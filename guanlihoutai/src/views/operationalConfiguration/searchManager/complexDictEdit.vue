<template>
  <section class="complexDictEditRoot">
    <div class="complexDictEditRoot-titleTab">
      <h3>搜索词管理 > 复合搜索词编辑</h3>
    </div>

    <div class="complexDictEditRoot-editArea" :style="heightRowStyle">
      <ul>
        <li class="complexDictEditRoot-editArea-row">
          <div class="complexDictEditRoot-editArea-left">搜索词</div>
          <div class="complexDictEditRoot-editArea-right">
            <input type="text" :class="warningStyle.keyWord | redlineStyle"
                   v-model="mixedDictDetail.keyWord"
                   @input="validInput('keyWord')">
          </div>
        </li>
        <li class="complexDictEditRoot-editArea-row">
          <div class="complexDictEditRoot-editArea-left">复合搜索词</div>
          <div v-for="(value,index) in mixedDictItems" :key="index">
            <div v-if="index==0" class="complexDictEditRoot-editArea-right">
              <input type="text" v-model="mixedDictItems[index].reusltWord"
                     :class="warningStyle['mixedDicts'+index] | redlineStyle"
                     @input="validInput('mixedDicts', index)">
            </div>
            <div v-if="index==0" class="complexDictEditRoot-editArea-addRowBtn" @click="addRowBtn">新增一行</div>
            <div v-if="index!=0" class="complexDictEditRoot-editArea-newRight">
              <input type="text" v-model="mixedDictItems[index].reusltWord"
                     :class="warningStyle['mixedDicts'+index] | redlineStyle"
                     @input="validInput('mixedDicts', index)"></div>
          </div>
        </li>

        <li class="complexDictEditRoot-button">
          <div class="complexDictEditRoot-button-submit" @click="save">提交</div>
          <div class="complexDictEditRoot-button-clear" @click="goBack">返回</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
export default{
  name: 'complexDictEdit',
  data() {
    return {
      warningStyle: {
        keyWord: false,
        mixedDicts0: false
      },
      heightRowStyle: {height: '269px'},
      mixedDictDetail: {}, // 返回词详情
      mixedDictItems: [], // 新复合词追加
      dictDetailParams: {
        id: 0
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
    comm.goBack();
  },
  methods: {
    // reusltWord因为后台单词拼成这个，为了匹配，切勿修正
    init() {
      sessionStorage.setItem('search_complex_goBack', true);
      sessionStorage.setItem('search_complex_source', 'complex');

      // 获取复合词详情
      if (this.$route.query.dictId) { // 修改
        this.dictDetailParams.id = this.$route.query.dictId;

        comm.openLoading('加载中...');
        const promise = comm.sendAxios('complexDetail', this.dictDetailParams);
        const _this = this;
        promise.then((res) => {
          comm.closeLoading();
          _this.mixedDictDetail = res.responseData.dataList[0];
          _this.mixedDictItems = _this.mixedDictDetail.associateWordList.concat();
          _this.heightRowStyle = {height: (_this.mixedDictItems.length * 42 + 269) + 'px'};
          if (_this.mixedDictItems.length === 0) _this.mixedDictItems.push({reusltWord: ''});
        }).catch((e) => {
          comm.closeLoading();
          if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        });
      }
      else {
        this.mixedDictItems.push({reusltWord: ''});
      }
    },
    goBack() {
      comm.closeLoading();
      this.$router.go(-1);
    },
    addRowBtn() {
      this.mixedDictItems.push({reusltWord: ''});
      this.heightRowStyle = {height: (this.mixedDictItems.length * 42 + 269) + 'px'};
    },
    validInput(val, index) {
      switch (val) {
        case 'keyWord':
          if (comm.getByteLen(this.mixedDictDetail.keyWord) > 30) this.$set(this.warningStyle, 'keyWord', true);
          else this.$set(this.warningStyle, 'keyWord', false);
          break;
        case 'mixedDicts':
          if (comm.getByteLen(this.mixedDictItems[index].reusltWord) > 30) this.$set(this.warningStyle, 'mixedDicts' + index, true);
          else this.$set(this.warningStyle, 'mixedDicts' + index, false);
          break;
      }
    },
    clearEmptyResultItems(item) {
      return item.reusltWord.trim() !== '';
    },
    trimValue(item) {
      if (item === undefined) {
        item = '';
      }
      else {
        item = item.trim();
      }
      return item;
    },
    save() {
      const keyword = this.trimValue(this.mixedDictDetail.keyWord);
      // 获取复合词
      let resultItems = this.mixedDictItems.concat();
      resultItems = resultItems.filter(this.clearEmptyResultItems); // 清除空行
      // 清除对象值的空格
      for (let x in resultItems) resultItems[x].reusltWord = this.trimValue(resultItems[x].reusltWord);

      if (!keyword) {
        this.warningStyle.keyWord = true;
      }
      if (resultItems.length === 0) {
        this.warningStyle.mixedDicts0 = true;
      }
      for (var x in this.warningStyle) {
        if (this.warningStyle[x]) {
          if (comm.getByteLen(keyword) > 30 || resultItems.some(function(item) {
            return comm.getByteLen(item.reusltWord) > 30;
          })) {
            this.$allin_confirm({title: '提示', content: '搜索词或复合搜索词不能超过15个字符', type: 'notice'});
          }
          else {
            this.$allin_confirm({title: '提示', content: '搜索词和复合搜索词不可为空', type: 'notice'});
          }
          return false;
        }
      }

      const promise = comm.sendAxios('updateComplexDict', {
        id: this.dictDetailParams.id,
        keyWord: keyword,
        associateWordList: resultItems
      });
      const _this = this;
      comm.openLoading('保存中...');
      promise.then((res) => {
        comm.closeLoading();
        if (res.responseStatus) _this.goBack();
        else {
          if (res.responseData) {
            this.$allin_confirm({title: '提示', type: 'notice', content: '和 ' + res.responseData.id + ' 号记录存在冲突'});
          }
          else {
            this.$allin_confirm({title: '提示', type: 'notice', content: res.responseMessage});
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({content: '保存失败', type: 'notice'});
      });
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .complexDictEditRoot {

    .complexDictEditRoot-editArea {
      margin: 5px auto;
      width: 1200px;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      height: 269px;

      .complexDictEditRoot-editArea-addRowBtn {
        cursor: pointer;
        width: 90px;
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
        margin-top: 6px;
        margin-left: 10px;
      }

      .radio {
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

      .complexDictEditRoot-button {
        cursor: pointer;
        margin: 60px 0 0 100px;
        width: 800px;
        height: 80px;
        float: left;

        .complexDictEditRoot-button-submit {
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

        .complexDictEditRoot-button-clear {
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
      .complexDictEditRoot-editArea-row {
        height: 42px;
        width: 520px;

        .complexDictEditRoot-editArea-newRight {
          margin-top: 6px;
          margin-left: 110px;
          float: left;
        }

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

        .complexDictEditRoot-editArea-left {
          width: 100px;
          float: left;
          text-align: right;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0;
          line-height: 42px;
        }

        .complexDictEditRoot-editArea-right {
          float: left;
          margin-left: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #111111;
          letter-spacing: 0;
          line-height: 42px;
        }

      }
      .rowArea {
        height: 90px;
      }

    }
    .complexDictEditRoot-titleTab {
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
