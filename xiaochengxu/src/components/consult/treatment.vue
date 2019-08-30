<template>
  <section class="treatment-inner">
    <header class="treatment-inner-title">
      <p>{{questionName}}</p>
    </header>
    <section class="treatment-content">
      <!-- 暂未 -->
      <section class="treatment-content-item">
        <article class="treatment-content-wrapper" @click="notAcceptFn">
          <i class="icon-select" :class="{'selected':noAccept}"></i>
          <span class="treatment-text">暂未接受治疗</span>
        </article>
      </section>
      <section class="treatment-content-item" v-for="(item,index) in optionList1" :key="index" v-if="item.isAttachment!=4">
        <article class="treatment-content-wrapper" @click="checkedFn(index)">
          <i class="icon-select" :class="{'selected':opState[index].eatingState}"></i>
          <span class="treatment-text">{{item.optionName}}</span>
        </article>
        <figure class="treatment-textarea" v-if="opState[index].eatingState">
          <pre><span>{{opState[index].eating}}<br></span></pre>
          <textarea name="" v-model="opState[index].eating" :placeholder="opState[index].placeholder"
                    @input="inputFn(index)"></textarea>
          <span class="inputCount">{{opState[index].inputCount}}</span>
        </figure>
      </section>
      <section class="treatment-content-item surgical-special" v-for="(item,index) in optionList1"
               v-if="item.isAttachment==4" :key="index">
        <article class="treatment-content-wrapper" @click="checkedFn(index)">
          <i class="icon-select" :class="{'selected':opState[index].eatingState}"></i>
          <span  class="inputCount">手术</span>
        </article>
      </section>
      <section class="surgical-desc" v-for="(item,index) in optionList1"
               v-if="item.isAttachment==4&&opState[index].eatingState" :key="index">
        <section class="surgical-desc-item">
          <section class="question-list-item-content">
            <pre><span>{{opState[index].eating}}<br></span></pre>
            <textarea :placeholder="opState[index].placeholder" v-model="opState[index].eating"
                      @input="inputFn(index)" maxlength=-1></textarea>
            <span class="inputCount">{{opState[index].inputCount}}</span>
          </section>
        </section>
        <section class="surgical-time-item">
          <picker :value="0" :range="delayTimePicker" :range-key="'text'" :end="emdTime" mode="date" @change="getSelectedTime">
            <span class="select-tiemIcon"></span>
            <span class="question-list-item-title" :class="{'selected':selectedTimes}">{{surgicalTime}}</span>
            <span class="question-list-item-content"><i class="icon-arrow-right"></i></span>
          </picker>
        </section>
      </section>
    </section>
    <ToastBox :content="toastContent" v-if="toastShow"></ToastBox>
    <section class="treatment-btnBox">
      <section class="ensure-btn" @click="ensureFn">确定</section>
      <!--<section class="noEnsure-btn" @click="backFn">暂未接受治疗</section>-->
    </section>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/6.
   */
  import {createNamespacedHelpers} from "vuex";
  import ToastBox from "components/toast";
  const {mapMutations, mapActions, mapGetters, mapState} = createNamespacedHelpers('consult');
  import api from "common/js/util/util";
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        noAccept:false,  //暂未
        opState: [
          {eating: "", eatingState: false, placeholder: "请填写药物名称", inputCount: ''},
          {eating: "", eatingState: false, placeholder: "请填写理疗名称", inputCount: ''},
          {eating: "", eatingState: false, placeholder: "请填写打针名称", inputCount: ''},
          {eating: "", eatingState: false, placeholder: "请填写手术名称", inputCount: ''}
        ],
        surgicalTime: "请选择手术时间",
        rowss: "1",
        dataList: [],
        optionList1: [],
        questionName: "",
        questionId: "",
        pickerDate: [],
        selectedTimes: false,
        emdTime:0,
      };
    },
    components:{
      ToastBox
    },
    onShow(){
      dataLog.enterBrowse();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods: {
      // ...mapMutations(["setQuestionTwo", "setQuestionTwoDes"]),
      ...mapActions(["setQuestionTwo", "setQuestionTwoDes"]),
      initData() {
        let _this = this;
        let dataTemp = new Date();
        // _this.time.year = dataTemp.getFullYear();
        // _this.time.month = dataTemp.getMonth() + 1;
        // _this.time.day = dataTemp.getDate();
        _this.emdTime = `${dataTemp.getFullYear()}-${dataTemp.getMonth() + 1}-${ dataTemp.getDate()}`;
        _this.getDefaultData();
      },
      getSelectedTime(e){
        console.log(e.mp.detail)
        this.surgicalTime = e.mp.detail.value;
        this.selectedTimes=true;
      },
      getDefaultData() {
        let _this = this;
        this.$nextTick(() => {
          _this.dataList = _this.questionDetail[2];
          _this.optionList1 = _this.dataList.optionList1;
          _this.questionName = _this.dataList.questionName;
        });
      },
      notAcceptFn(){
        let _this = this;
        _this.noAccept =!_this.noAccept;
        _this.opState.forEach((item,index)=>{
          if (_this.noAccept) {
            _this.opState[index].eatingState = false;
          }
          // } else {
          //   _this.opState[index].eatingState = true;
          // }
        })
      },
      checkedFn(type) {
        this.noAccept = false;
        if (this.opState[type].eatingState) {
          this.opState[type].eatingState = false;
        } else {
          this.opState[type].eatingState = true;
        }
      },
      inputFn(index) {
        let _this = this;
        let _countObj = api.getStrInputCut(_this.opState[index].eating, 100, 5);
        _this.opState[index].eating = _countObj.str;
        if (_countObj.outStatus) {
          _this.opState[index].inputCount = _countObj.lastCount;
        } else {
          _this.opState[index].inputCount = "";
        }
      },
      ensureFn() {
        let _this = this;
        let _num = 0;
        for (let index = 0; index < _this.opState.length; index++) {
          if (_this.opState[index].eatingState && index == 3) {
            if (!_this.selectedTimes) {
              _this.showToast("请选择手术时间");
              _num += 1;
              break;
            }
          }
        }
        if (_num == 0) {
          _this.saveData();
        }
      },
      saveData() {
        let _this = this;
        let _dataArr = [];
        let _dataString = "";
        if(_this.noAccept){
          _this.setQuestionTwo([]);
          this.setQuestionTwoDes("暂未接受治疗");
        }else{
          _this.opState.forEach((item, index) => {
            if (item.eatingState) {
              if (_this.optionList1[index].isAttachment != 4) {
                _dataArr.push({
                  optionDesc: item.eating,
                  optionIdList: _this.optionList1[index].optionId,
                  partId: _this.patientMessage.partId,
                  questionId: _this.questionDetail[2].questionId
                });
                if (_dataString != "") {
                  if (item.eating != "") {
                    _dataString =
                      _dataString +
                      "," +
                      _this.optionList1[index].optionName +
                      "-" +
                      item.eating;
                  } else {
                    _dataString =
                      _dataString +
                      "," +
                      _this.optionList1[index].optionName;
                  }

                } else {
                  if (item.eating != "") {
                    _dataString =
                      _this.optionList1[index].optionName + "-" + item.eating;
                  } else {
                    _dataString =
                      _this.optionList1[index].optionName;
                  }
                }
              } else {
                _dataArr.push({
                  optionDesc: item.eating,
                  optionIdList: _this.optionList1[index].optionId,
                  optionRemark: _this.surgicalTime,
                  partId: _this.patientMessage.partId,
                  questionId: _this.questionDetail[2].questionId
                });
                if (_dataString != "") {
                  if (item.eating != "") {
                    _dataString =
                      _dataString +
                      "," +
                      _this.optionList1[index].optionName +
                      "-" +
                      item.eating +
                      "、" +
                      _this.surgicalTime.replace(/-/g,".");
                  } else {
                    _dataString =
                      _dataString +
                      "," +
                      _this.optionList1[index].optionName +
                      "、" +
                      _this.surgicalTime.replace(/-/g,".");
                  }
                } else {
                  if (item.eating == "") {
                    _dataString =
                      _this.optionList1[index].optionName +
                      "、" +
                      _this.surgicalTime.replace(/-/g,".");
                  } else {
                    _dataString =
                      _this.optionList1[index].optionName +
                      "-" +
                      item.eating +
                      "、" +
                      _this.surgicalTime.replace(/-/g,".");
                  }
                }
              }
            }
          });
          _this.setQuestionTwo(_dataArr);
          _this.setQuestionTwoDes(_dataString);
        }
        if (_this.noAccept || _dataString.length > 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          this.showToast("请选择治疗情况");
        }
      },
      backFn() {
        let _this = this;
        this.opState.forEach((item, index) => {
          item.eating = "";
          item.eatingState = false
        });
        _this.selectedTimes = false;
        _this.surgicalTime = "请选择手术时间";
        _this.setQuestionTwoDes("暂未接受治疗");
        wx.navigateBack({
          delta: 1
        })
      },
      showToast(param){
        wx.showToast({
          title: param,
          icon: 'none',
          duration: 2000
        })
      }
    },
    mounted() {
      this.initData();
    },
    computed: {
      // ...mapState(["questionDetail"]),
      ...mapGetters(['patientMessage', 'toastContent', 'toastShow','questionDetail'])
    },
    watch: {
      "patientMessage.partId": {
        handler: function (val, oldval) {
          this.opState = [
            {eating: "", eatingState: false, placeholder: "请填写药物名称", inputCount: ''},
            {eating: "", eatingState: false, placeholder: "请填写理疗名称", inputCount: ''},
            {eating: "", eatingState: false, placeholder: "请填写打针名称", inputCount: ''},
            {eating: "", eatingState: false, placeholder: "请填写手术名称", inputCount: ''}
          ];
          this.surgicalTime = "请选择手术时间";
          this.selectedTimes = false;
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  .treatment-inner {
    padding: 90px 60px 0 60px;
    box-sizing: border-box;
    .treatment-inner-title {
      font-size: 40px;
      color: #222222;
      // margin-top: 90px;
      padding-left: 46px;
      margin-bottom: 70px;
      position: relative;
      &::before {
        display: inline-block;
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        background: #2fc5bd;
        top: 50%;
        margin-top: -8px;
        border-radius: 50%;
        left: 0;
      }
    }
    .inputCount{
      font-size: 32px;
    }
    .treatment-content {
      .treatment-content-item {
        padding-bottom: 30px;
        &.surgical-special {
          padding-bottom: 0;
        }
        .treatment-content-wrapper {
          padding-left: 108px;
          margin-bottom: 28px;
          position: relative;
          .icon-select {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url("https://m.allinmed.cn/static/image/img00/findDoctor/select.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 56px;
            top: 50%;
            margin-top: -16px;
            &.selected {
              background: url("https://m.allinmed.cn/static/image/img00/findDoctor/checked.png") no-repeat;
              background-size: 100% 100%;
            }
          }
          .treatment-text {
            display: inline-block;
            font-size: 32px;
            color: #444444;
          }
        }
        .treatment-textarea {
          margin-left: 108px;
          border-radius: 10px;
          // padding: 26px 32px;
          border: 1px solid #cccccc;
          position: relative;
          overflow: hidden;
          pre {
            display: block;
            visibility: hidden;
            font-size: 28px;
            width: 100%;
            box-sizing: border-box;
            min-height: 104px;
            max-height: 230px;
            padding: 30px;
          }
          textarea {
            box-sizing: border-box;
            width: 100%;
            border-style: none;
            max-height: 230px;
            min-height: 104px;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            padding: 30px;
          }
          .inputCount {
            position: absolute;
            bottom: 12px;
            right: 10px;
            font-size: 36px;
            color: #FE8178;
          }
        }
      }
      .surgical-desc {
        .surgical-desc-item {
          .question-list-item-content {
            margin-left: 108px;
            position: relative;
            overflow: hidden;
            border: 1px solid #cccccc;
            border-radius: 10px;
            pre {
              display: block;
              visibility: hidden;
              font-size: 28px;
              width: 100%;
              box-sizing: border-box;
              min-height: 104px;
              max-height: 230px;
              padding: 30px;
            }
            textarea {
              box-sizing: border-box;
              width: 100%;
              border-style: none;

              padding: 26px 32px;
              max-height: 230px;
              min-height: 104px;
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              padding: 30px;
            }
            .inputCount {
              position: absolute;
              bottom: 12px;
              right: 10px;
              font-size: 36px;
              color: #FE8178;
            }
          }
        }
        .surgical-time-item {
          width: 526px;
          height: 100px;
          border-radius: 10px;
          margin-left: 108px;
          margin-top: 38px;
          border: 1px solid #cccccc;
          picker {
            width: 100%;
            height: 100%;
          }
          .select-tiemIcon {
            display: block;
            width: 38px;
            height: 40px;
            background: url("https://m.allinmed.cn/static/image/img00/findDoctor/time.png") no-repeat;
            background-size: 100% 100%;
            margin: 30px 16px 0 34px;
            float: left;
          }
          .question-list-item-title {
            font-size: 36px;
            color: #aaaaaa;
            float: left;
            margin-top: 24px;
            &.selected {
              color: #444444;
            }
          }
          .question-list-item-content {
            display: block;
            width: 16px;
            height: 26px;
            background: url("https://m.allinmed.cn/static/image/img00/findDoctor/arrow_left.png") no-repeat;
            background-size: 100% 100%;
            float: right;
            margin-right: 40px;
            margin-top: 38px;
          }
        }
      }
    }
    .treatment-btnBox {
      padding-top: 120px;
      .ensure-btn {
        width: 500px;
        height: 100px;
        background-image: linear-gradient(-90deg, #3fe6bc 6%, #07b6ac 95%);
        box-shadow: 0 10px 18px 0 rgba(30, 231, 187, 0.38);
        border-radius: 100px;
        text-align: center;
        font-size: 34px;
        color: #ffffff;
        line-height: 100px;
        margin: 0 auto;
      }
      .noEnsure-btn {
        font-size: 32px;
        color: #666666;
        text-align: center;
        margin-top: 44px;
        padding-bottom: 140px;
      }
    }
  }
</style>
