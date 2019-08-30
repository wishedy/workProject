<template>
  <section class="correctDictEditRoot">
    <div class="correctDictEditRoot-titleTab">
      <h3>搜索词管理 > 纠正词编辑</h3>
    </div>

    <div class="correctDictEditRoot-editArea">
      <ul>
        <li class="correctDictEditRoot-editArea-row">
          <div class="correctDictEditRoot-editArea-left">搜索词</div>
          <div class="correctDictEditRoot-editArea-right">
            <input type="text" :class="warningStyle.keyWord | redlineStyle"
                   v-model="correctDictDetail.keyWord"
                   @input="validInput('keyWord')"></div>
        </li>
        <li class="correctDictEditRoot-editArea-row">
          <div class="correctDictEditRoot-editArea-left">纠正词</div>
          <div class="correctDictEditRoot-editArea-right">
            <input type="text" :class="warningStyle.reusltWord | redlineStyle"
                   v-model="correctDictDetail.reusltWord"
                   @input="validInput('reusltWord')"></div>
        </li>

        <li class="correctDictEditRoot-editArea-button">
          <div class="correctDictEditRoot-editArea-button-submit" @click="saveInfo">提交</div>
          <div class="correctDictEditRoot-editArea-button-clear" @click="goBack">返回</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
export default{
  name: 'correctDictEdit',
  data() {
    return {
      correctDictDetail: [],
      warningStyle: {
        keyWord: false,
        reusltWord: false
      },
      dictDetailParams: {
        id: 0
      },
      saveInfoParams: {
        id: 0, // 修改需要
        keyWord: '',
        reusltWord: ''
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
    sessionStorage.setItem('search_correct_goBack', true);
    sessionStorage.setItem('search_correct_source', 'correct');

    // 获取纠正词详情
    if (this.$route.query.dictId) { // 编辑
      this.dictDetailParams.id = this.$route.query.dictId;
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('correctDetail', this.dictDetailParams);
      const _this = this;
      promise.then((res) => {
        comm.closeLoading();
        _this.correctDictDetail = res.responseData.dataList[0];
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    }
  },
  destroyed() {
    comm.goBack();
  },
  methods: {
    goBack() {
      comm.closeLoading();
      this.$router.go(-1);
    },
    validInput(val) {
      switch (val) {
        case 'keyWord':
          if (comm.getByteLen(this.correctDictDetail.keyWord) > 30) this.$set(this.warningStyle, 'keyWord', true);
          else this.$set(this.warningStyle, 'keyWord', false);
          break;
        case 'reusltWord':
          if (comm.getByteLen(this.correctDictDetail.reusltWord) > 30) this.$set(this.warningStyle, 'reusltWord', true);
          else this.$set(this.warningStyle, 'reusltWord', false);
          break;
      }
    },
    saveInfo() {
      this.saveInfoParams.keyWord = comm.clearUndefinedAndSpace(this.correctDictDetail.keyWord);
      this.saveInfoParams.reusltWord = comm.clearUndefinedAndSpace(this.correctDictDetail.reusltWord);
      this.saveInfoParams.id = this.dictDetailParams.id;

      if (!this.saveInfoParams.keyWord) {
        this.warningStyle.keyWord = true;
      }
      if (!this.saveInfoParams.reusltWord) {
        this.warningStyle.reusltWord = true;
      }

      for (var x in this.warningStyle) {
        if (this.warningStyle[x]) {
          if (comm.getByteLen(this.saveInfoParams.keyWord) > 30 || comm.getByteLen(this.saveInfoParams.reusltWord) > 30) {
            this.$allin_confirm({content: '搜索词或纠正词不能超过15个字符', type: 'notice'});
          }
          else {
            this.$allin_confirm({content: '搜索词和纠正词不可为空', type: 'notice'});
          }
          return false;
        }
      }

      if (this.saveInfoParams.keyWord === this.saveInfoParams.reusltWord) {
        this.$allin_confirm({content: '搜索词和纠正词一致，保存失败', type: 'notice'});
        return false;
      }

      comm.openLoading('查询/保存中...');
      const promise = comm.sendAxios('updateCorrectDict', this.saveInfoParams);
      promise.then((res) => {
        comm.closeLoading();
        if (res.responseStatus) this.goBack();
        else {
          if (res.responseData) {
            this.$allin_confirm({type: 'notice', content: '和 ' + res.responseData.id + ' 号记录存在冲突'});
          }
          else {
            this.$allin_confirm({type: 'notice', content: res.responseMessage});
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) this.$allin_confirm({title: '提示', content: '保存失败', type: 'notice'});
      });
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .correctDictEditRoot {

    .correctDictEditRoot-editArea {
      margin: 5px auto;
      width: 1200px;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      height: 269px;

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

      .correctDictEditRoot-editArea-button {
        cursor: pointer;
        margin: 60px 0 0 100px;

        .correctDictEditRoot-editArea-button-submit {
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

        .correctDictEditRoot-editArea-button-clear {
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
      .correctDictEditRoot-editArea-row {
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

        .correctDictEditRoot-editArea-left {
          width: 100px;
          float: left;
          text-align: right;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #555555;
          letter-spacing: 0;
          line-height: 42px;
        }

        .correctDictEditRoot-editArea-right {
          float: left;
          margin-left: 10px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #111111;
          letter-spacing: 0;
          line-height: 42px;
        }

      }
    }
    .correctDictEditRoot-titleTab {
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
