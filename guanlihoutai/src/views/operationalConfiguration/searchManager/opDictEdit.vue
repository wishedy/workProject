<template>
  <section class="opDictEditRoot">
    <div class="opDictEditRoot-titleTab">
      <h3>搜索热词管理 > 运营词新增/编辑页</h3>
    </div>

    <div class="opDictEditRoot-editArea">
      <ul>
        <li class="opDictEditRoot-editArea-row">
          <div class="opDictEditRoot-editArea-left">热搜名</div>
          <div class="opDictEditRoot-editArea-right">
            <input type="text"
                   :class="warningStyle.searchKey | redlineStyle"
                   v-model="opDictDetail.searchKey"
                   @input="validInput('key')">
          </div>
        </li>
        <li class="opDictEditRoot-editArea-row">
          <div class="opDictEditRoot-editArea-left">线上排序号</div>
          <div class="opDictEditRoot-editArea-right">
            <input type="text" :class="warningStyle.sortId | redlineStyle"
                   v-model="opDictDetail.sortId"
                   @input="validInput('sortId')">
          </div>
        </li>
        <li class="opDictEditRoot-editArea-row">
          <div class="opDictEditRoot-editArea-left">URL</div>
          <div class="opDictEditRoot-editArea-right">
            <input type="text" v-model="opDictDetail.redirectUrl">
          </div>
        </li>
        <li class="opDictEditRoot-editArea-row">
          <div class="opDictEditRoot-editArea-left">状态</div>
          <div class="opDictEditRoot-editArea-right">
            <div class="opDictEditRoot-editArea-radio"
                 @click="chooseStatus(1)">
              <img :src="isSelected | iconState" alt="">上架
            </div>
            <div class="opDictEditRoot-editArea-radio" @click="chooseStatus(0)">
              <img :src="!isSelected | iconState" alt="">下架
            </div>
          </div>
        </li>
        <li class="opDictEditRoot-editArea-row opDictEditRoot-editArea-rowArea">
          <div class="opDictEditRoot-editArea-left">备注</div>
          <div class="opDictEditRoot-editArea-right">
            <textarea name="" id="" cols="30" rows="10"
                      :class="warningStyle.remarks | redlineStyle"
                      v-model="opDictDetail.remarks"
                      @input="validInput('remarks')"></textarea></div>
        </li>
        <li class="opDictEditRoot-button">
          <div class="opDictEditRoot-button-submit" @click="save">提交</div>
          <div class="opDictEditRoot-button-clear" @click="goBack">返回</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
export default{
  name: 'OpDictEdit',
  data() {
    return {
      opDictDetail: [],
      warningStyle: {
        searchKey: false,
        remarks: false,
        sortId: false
      },
      isSelected: false, // 默认选中无效
      editMode: false, // 新增/编辑
      dictDetailParams: {
        id: 0
      },
      saveInfoParams: {
        updateTime: 1, // 修改需要  固定1
        id: 0, // 修改需要
        searchKey: '',
        sortId: '',
        remarks: '',
        isValid: 0,
        recommendType: 0, // 新增需要 （0-不推荐，1-推荐，2-预填充词）(预填充词判断传) 默认不推荐
        sourceType: 1 // 新增需要 （0-系统，1-运营添加） 运营场景直接写1
      }
    };
  },
  filters: {
    iconState(state) {
      return state
        ? require('../../../../static/images/icons/icon-selected.png')
        : require('../../../../static/images/icons/icon-unselected.png');
    },
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
    comm.goBack();
  },
  methods: {
    init() {
      sessionStorage.setItem('search_op_goBack', true);
      sessionStorage.setItem('search_op_source', 'op');

      // 获取运营词详情
      if (!this.$route.query.dictId) { // 新增
        this.editMode = false;
      }
      else { // 编辑
        this.editMode = true;
        this.dictDetailParams.id = this.$route.query.dictId;

        comm.openLoading('加载中...');
        const promise = comm.sendAxios('dictDetail', this.dictDetailParams);
        const _this = this;
        promise.then((res) => {
          comm.closeLoading();
          _this.isSelected = res.isValid === 1;
          _this.opDictDetail = res;
        }).catch((e) => {
          comm.closeLoading();
          if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        });
      }
    },
    goBack() {
      for (let x in sessionStorage) {
        if (x.includes('op')) {
          sessionStorage.removeItem(x);
        }
      }
      comm.closeLoading();
      this.$router.go(-1);
    },
    validInput(val) {
      switch (val) {
        case 'key':
          if (comm.getByteLen(this.opDictDetail.searchKey) > 30) this.$set(this.warningStyle, 'searchKey', true);
          else this.$set(this.warningStyle, 'searchKey', false);
          break;
        case 'remarks':
          if (comm.getByteLen(this.opDictDetail.remarks) > 100) this.$set(this.warningStyle, 'remarks', true);
          else this.$set(this.warningStyle, 'remarks', false);
          break;
        case 'sortId':
          if (!comm.isNumber(this.opDictDetail.sortId) || this.opDictDetail.sortId.length > 9) this.$set(this.warningStyle, 'sortId', true);
          else this.$set(this.warningStyle, 'sortId', false);
          break;
      }
    },
    save() {
      if (!comm.clearUndefinedAndSpace(this.opDictDetail.searchKey)) {
        this.warningStyle.searchKey = true;
      }
      if (!this.opDictDetail.sortId) {
        this.warningStyle.sortId = true;
      }

      for (var x in this.warningStyle) {
        if (this.warningStyle[x]) {
          this.$allin_confirm({title: '提示', content: '资料不符合规范，保存失败', type: 'notice'});
          return false;
        }
      }

      this.saveInfoParams.isValid = this.isSelected ? 1 : 0;
      this.saveInfoParams.remarks = comm.clearUndefinedAndSpace(this.opDictDetail.remarks);
      this.saveInfoParams.id = this.dictDetailParams.id;
      this.saveInfoParams.redirectUrl = comm.clearUndefinedAndSpace(this.opDictDetail.redirectUrl);
      this.saveInfoParams.searchKey = comm.clearUndefinedAndSpace(this.opDictDetail.searchKey);
      this.saveInfoParams.sortId = this.opDictDetail.sortId;

      // 校验是否词存在
      comm.openLoading('查询/保存中...');
      let _this = this;
      let params = {
        sourceType: 1, // this.opDictDetail.sourceType,
        recommendType: this.opDictDetail.recommendType,
        searchKey: this.saveInfoParams.searchKey,
        isValid: this.saveInfoParams.isValid,
        redirectUrl: this.saveInfoParams.redirectUrl,
        id: this.opDictDetail.id
      }; // 新增时id无值，编辑时id有值，这是为什么?

      const existPromise = comm.sendAxios('existDict', params);
      existPromise.then((res) => {
        if (res.responseStatus) {
          let promise;
          if (!this.editMode) {
            delete this.saveInfoParams.id;
            delete this.saveInfoParams.updateTime;
            promise = comm.sendAxios('createDict', this.saveInfoParams);
          }
          else {
            delete this.saveInfoParams.recommendType;
            delete this.saveInfoParams.sourceType;
            promise = comm.sendAxios('updateDict', this.saveInfoParams);
          };

          promise.then((res) => {
            if (res.responseStatus) _this.goBack();
          }).catch((e) => {
            comm.closeLoading();
            if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '保存失败', type: 'notice'});
          });
        }
        else {
          comm.closeLoading();
          this.$allin_confirm({title: '提示', content: res.responseMessage + '，保存失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询/保存失败', type: 'notice'});
      });
    },
    chooseStatus(val) {
      if (val === 1) this.isSelected = true;
      else this.isSelected = false;
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .opDictEditRoot {

    .opDictEditRoot-editArea {
      margin: 5px auto;
      width: 1200px;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      height: 399px;

      .opDictEditRoot-editArea-radio {
        cursor: pointer;
        float: left;
        width: 70px;

        img {
          float: left;
          position: relative;
          top: 12px;
          margin-right: 5px;
        }

      }
      textarea {
        padding: 9px 13px;
        width: 612px;
        height: 70px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 3px;
        resize: none
      }

      li:first-child {
        padding-top: 19px;
      }

      .opDictEditRoot-button {
        cursor: pointer;
        margin: 60px 0 0 100px;

        .opDictEditRoot-button-submit {
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

        .opDictEditRoot-button-clear {
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
      .opDictEditRoot-editArea-row {
        height: 42px;

        input {
          width: 272px;
          height: 30px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 3px;
          padding: 0 13px;
        }

        .warningStyle {
          background: #F7F9FC;
          border: 1px solid #EB3B46;
          border-radius: 3px;
        }

        .opDictEditRoot-editArea-left {
          width: 100px;
          float: left;
          text-align: right;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0;
          line-height: 42px;
        }

        .opDictEditRoot-editArea-right {
          float: left;
          margin-left: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #111111;
          letter-spacing: 0;
          line-height: 42px;
        }

      }
      .opDictEditRoot-editArea-rowArea {
        height: 90px;
      }

    }
    .opDictEditRoot-titleTab {
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
