<template>
  <section class="hotDictEditRoot">
    <div class="hotDictEditRoot-titleTab">
      <h3>搜索热词管理 > 搜索词编辑页</h3>
    </div>

    <div class="hotDictEditRoot-editArea">
      <ul>
        <li class="hotDictEditRoot-editArea-row">
          <div class="hotDictEditRoot-editArea-left">热搜名</div>
          <div class="hotDictEditRoot-editArea-right">{{hotDictDetail.searchKey}}</div>
        </li>
        <li class="hotDictEditRoot-editArea-row">
          <div class="hotDictEditRoot-editArea-left">来源</div>
          <div class="hotDictEditRoot-editArea-right">{{hotDictDetail.sourceTypeDesc}}</div>
        </li>
        <li class="hotDictEditRoot-editArea-row">
          <div class="hotDictEditRoot-editArea-left">线上排序号</div>
          <div class="hotDictEditRoot-editArea-right">
            <input :class="warningStyle.sortId | redlineStyle" type="text"
                   v-model="hotDictDetail.sortId"
                   @input="validInput('sortId')"></div>
        </li>
        <li class="hotDictEditRoot-editArea-row">
          <div class="hotDictEditRoot-editArea-left">推荐类型</div>
          <div class="hotDictEditRoot-editArea-right">
            <el-select v-model="recommendDesc" placeholder="请选择推荐类型"
                       :class="warningStyle.recommendType | redlineStyle"
                       @change="validInput('recommendType')">
              <el-option
                v-for="item in recommendType"
                :key="item.id"
                :label="item.desc"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="hotDictEditRoot-button">
          <div class="hotDictEditRoot-button-submit"
               @click="save">提交
          </div>
          <div class="hotDictEditRoot-button-clear"
               @click="goBack">返回
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
export default{
  name: 'hotDictEdit',
  data() {
    return {
      warningStyle: {
        sortId: false, // 标注排序样式类状态
        recommendType: false // 推荐类型
      },
      hotDictDetail: {
        searchKey: '', // 热搜词名
        sourceTypeDesc: '', // 来源类型
        sortId: 0 // 排序号
      },
      recommendDesc: '',
      recommendType: [{id: 0, desc: '不推荐'}, {id: 1, desc: '推荐'}, {id: 2, desc: '预填充词'}], // 对应数据库
      dictDetailParams: {
        id: 0
      },
      updateDictParams: {
        updateTime: 1,
        id: 0,
        recommendType: 0,
        sortId: 0,
        isValid: 1
      }
    };
  },
  filters: {
    redlineStyle(state) {
      return state
        ? 'warningStyle'
        : '';
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    for (let x in sessionStorage) {
      if (x.includes('hot')) {
        sessionStorage.removeItem(x);
      }
    }
    comm.goBack();
  },
  methods: {
    init() {
      // 获取热搜词详情 只有编辑场景，如果无id，直接返回来源页
      if (!this.$route.query.dictId) {
        this.goBack();
      }
      sessionStorage.setItem('search_goBack', true);
      sessionStorage.setItem('search_source', 'hot');

      this.dictDetailParams.id = this.$route.query.dictId;
      const promise = comm.sendAxios('dictDetail', this.dictDetailParams);
      const _this = this;
      comm.openLoading('加载中...');
      promise.then((res) => {
        comm.closeLoading();
        _this.hotDictDetail = res;
        _this.hotDictDetail.sourceTypeDesc = res.sourceType === 1 ? '运营添加' : '系统';
        _this.recommendDesc = res.recommendType;
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询/保存失败', type: 'notice'});
      });
    },
    goBack() {
      comm.closeLoading();
      this.$router.go(-1);
    },
    validInput(val) {
      if (val === 'sortId' && (!comm.isNumber(this.hotDictDetail.sortId) || this.hotDictDetail.sortId.length > 9)) this.warningStyle.sortId = true;
      else this.warningStyle.sortId = false;
      if (val === 'recommendType') this.warningStyle.recommendType = false;
    },
    save() {
      for (var x in this.warningStyle) {
        if (this.warningStyle[x]) {
          this.$allin_confirm({content: '资料不符合规范，保存失败', type: 'notice'});
          return false;
        }
      }

      // 校验是否词类型是否超出(预填充只允许一个)
      comm.openLoading('查询/保存中...');
      let _this = this;
      const existPromise = comm.sendAxios('existDict', {
        sourceType: this.hotDictDetail.sourceType,
        recommendType: this.recommendDesc,
        searchKey: this.hotDictDetail.searchKey,
        isValid: this.hotDictDetail.isValid,
        id: this.hotDictDetail.id
      });
      existPromise.then((res) => {
        if (res.responseStatus) {
          this.updateDictParams.id = this.dictDetailParams.id;
          this.updateDictParams.sortId = this.hotDictDetail.sortId;
          this.updateDictParams.recommendType = this.recommendDesc;

          const promise = comm.sendAxios('updateDict', this.updateDictParams);
          promise.then((res) => {
            if (res.responseStatus) {
              _this.goBack();
            }
          }).catch((e) => {
            comm.closeLoading();
            if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '保存失败', type: 'notice'});
          });
        }
        else {
          comm.closeLoading();
          _this.warningStyle.recommendType = true;
          _this.$allin_confirm({content: res.responseMessage + '，保存失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询/保存失败', type: 'notice'});
      });
    },
    tools() {
      return {
        getRecommendDesc(val) {
          let desc = '不推荐';
          switch (val) {
            case 1:
              desc = '推荐';
              break;
            case 2:
              desc = '预填充词';
              break;
          }
          return desc;
        }
      };
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .hotDictEditRoot {
    .hotDictEditRoot-editArea {
      margin: 5px auto;
      width: 1200px;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      ul {
        height: 100%;
        background: #FFFFFF;
        float: left;
        li:first-child {
          padding-top: 12px;
        }
        .hotDictEditRoot-button {
          cursor: pointer;
          margin: 60px 0 60px 100px;
          float: left;
          .hotDictEditRoot-button-submit {
            width: 140px;
            height: 32px;
            background: #3846DC;
            border-radius: 3px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 32px;
            text-align: center;
            float: left;
          }
          .hotDictEditRoot-button-clear {
            width: 140px;
            height: 32px;
            background: #A1A8C0;
            border-radius: 3px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 32px;
            text-align: center;
            float: left;
            margin-left: 30px;
          }
        }
        .hotDictEditRoot-editArea-row {
          /*height:42px;*/
          input {
            width: 272px;
            height: 30px;
            background: #F7F9FC;
            border: 1px solid #E6E6E8;
            border-radius: 3px;
            padding: 0 13px;
          }
          .hotDictEditRoot-editArea-left {
            width: 100px;
            float: left;
            text-align: right;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #555555;
            letter-spacing: 0;
            line-height: 42px;
          }
          .hotDictEditRoot-editArea-right {
            float: left;
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #111111;
            letter-spacing: 0;
            line-height: 42px;
            width: 1000px;
            .warningStyle {
              background: #F7F9FC;
              border: 1px solid #EB3B46;
              border-radius: 3px;
            }
            .el-input--suffix {
              input {
                width: 298px;
                height: 32px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #BBBBBB;
                letter-spacing: 0;
                line-height: 14px;
              }
            }
          }
        }
      }
    }
    .hotDictEditRoot-titleTab {
      margin: 0 auto;
      width: 1200px;
      margin-top: 37px;
      height: 38px;
      h3 {
        float: left;
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #222222;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }
</style>
