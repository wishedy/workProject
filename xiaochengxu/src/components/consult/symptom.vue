<template>
  <section class="symptom-inner">
    <header class="symptom-inner-title">
      <h2>已选部位不适症状</h2>
      <p>(可多选)</p>
    </header>
    <section class="symptom-inner-content">
      <article class="symptom-inner-item" :class="{'active':item.selected}" v-for="(item,index) in dataList"
               :key="index">
        <span @click="selectItem(item)">{{item.optionName}}</span>
      </article>
    </section>
    <article class="symptom-inner-textarea" v-show="descShow">
      <textarea name="" placeholder="描述您的其他症状…" v-model="descContent" @input="contentLimit"></textarea>
      <p class="last-count" v-show="descContent.length>94">{{100-descContent.length}}</p>
    </article>
    <transition name="fade">
      <section class="pain-level-wrapper" @click.stop="vasShow=false" v-if="vasShow">
        <section class="pain-level-box" @click.stop="vasShow=true">
          <h3>
            <span>告诉我您的疼痛程度</span>
            <i class="icon-closePainLevel" @click.stop="vasShow=false"></i>
          </h3>
          <p class="pain-level-content">
            {{vasList[painValue].optionName}}{{vasList[painValue].optionDesc}}
          </p>
          <VAS @getSliderEvent="getPainValue"></VAS>
          <button class="btn-primary pain-level-ensure" @click.stop="getPainLevelData">选好了</button>
        </section>
      </section>
    </transition>
    <figure class="symptom-submit-btn" @click="checkOptions">选好了</figure>
    <ToastBox :content="toastContent" v-if="toastShow"></ToastBox>
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
  import VAS from "components/vasLevel";
  import dataLog from "dataLog";
  const {mapMutations, mapActions, mapGetters, mapState} = createNamespacedHelpers('consult');
  export default {
    data() {
      return {
        labelStyle: {
          display: "inline-block",
          fontSize: "28",
          color: "#909090",
          top: "-65px"
        },
        dataList: [],
        vasList: [],
        descShow: false,
        descContent: "",
        vasShow: false,
        painValue: -1,
        refOptionId: "",
        selectList: {},
        selectPain: {}
      }
    },
    components: {
      ToastBox,
      VAS
    },
    onShow(){
      console.log(this.$root.$mp.query)
      if (this.$root.$mp.query.scene==="findDoctor"){
        dataLog.enterBrowse({
          browseType:"95",
          opDesc:"选择症状页-找医生（小程序）"
        });
      }else{
        dataLog.enterBrowse({
          browseType:"112",
          opDesc:"选择症状页-快速咨询（小程序）"
        });
      }

    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods: {
      ...mapActions(['showToast',"setQuestionOne",'setQuestionOneDes']),
      // ...mapMutations(['setQuestionOne', 'setQuestionOneDes']),
      installData() {
        if (this.questionDetail[0]) {
          this.questionDetail[0].optionList1.forEach((element, index) => {
            element.selected = false;
            element.desc = "";
            this.dataList.push(element);
          });
          this.questionDetail[0].optionList1[0].questionList2[0].optionList2.forEach((element, index) => {
            this.vasList.push(element);
          })
        }
      },
      contentLimit() {
        let content = this.descContent;
        if (content.length > 100) {
          this.descContent = content.substring(0, 100);
          return false;
        }
      },
      getPainValue(value) {
        console.log(value)
        this.painValue = value;
      },
      getPainLevelData() {
        let checkPain = this.vasList[this.painValue];
        this.selectPain = {
          optionDesc: checkPain.optionName + checkPain.optionDesc,
          optionIdList: checkPain.optionId,
          questionId: this.questionDetail[0].optionList1[0].questionList2[0].questionId,
          refOptionId: this.refOptionId,
          partId: this.patientMessage.partId
        };
        this.vasShow = false;
        this.saveResult();
      },
      selectItem(item) {
        console.log(item);
        item.selected = !item.selected;
        this.$forceUpdate(); //强制重新渲染
        //显示输入框
        if (item.isAttachment == 2) {
          if (item.selected === true) {
            this.descShow = true;
          } else {
            this.descShow = false;
            this.descContent = "";
          }
        }
        // 显示进度条
        if (item.questionList2.length > 0 && item.questionList2[0].questionType == 3) {
          if (item.selected) {
            this.refOptionId = item.optionId;
            this.painValue = 2;
          } else {
            this.refOptionId = "";
            this.painValue = -1;
          }
        }
      },
      getAllSelectedItem() {
        let result = [];
        this.dataList.forEach((element) => {
          if (element.selected) {
            result.push(element.optionId);
          }
        });
        return result;
      },
      getAllSelectedName() {
        let result = [];
        this.dataList.forEach((element) => {
          if (element.selected && element.isAttachment != "2") {
            result.push(element.optionName);
          }
        });
        return result;
      },
      checkOptions() {
        if (this.getAllSelectedItem().length == 0) {
          this.showToast("请选择已选部位不适症状");
        } else if (this.descShow && !this.descContent) {
          this.showToast("请填写其他症状");
        } else if (this.painValue >= 0) {
          this.vasShow = true;
        } else {
          this.saveResult();
        }
      },
      saveResult() {
        this.selectList = {
          questionId: this.questionDetail[0].questionId,
          optionIdList: this.getAllSelectedItem().join(","),
          partId: this.patientMessage.partId,
          optionDesc: this.descShow ? this.descContent : ""
        };
        if (this.painValue >= 0) {
          this.setQuestionOne([this.selectList, this.selectPain]);
          this.setQuestionOneDes(this.getAllSelectedName().join("，") + this.descContent + "VAS评分" + this.selectPain.optionDesc);
        } else {
          this.setQuestionOne([this.selectList]);
          this.setQuestionOneDes(this.getAllSelectedName().join("，") + this.descContent);
        }
        wx.navigateBack({
          delta: 1
        })
      }
    },
    mounted() {
      this.installData();
    },

    computed: {
      ...mapGetters(['patientMessage', 'toastContent', 'toastShow',"questionDetail"])
    },
    watch: {
      "questionDetail": {
        handler: function (val, oldval) {
          this.dataList = [];
          this.vasList = [];
          this.installData();
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss">


  .symptom-inner-title {
    text-align: center;
    margin-top: 64px;
    h2 {
      font-size: 44px;
      color: #000000;
    }
    p {
      font-size: 30px;
      color: #333333;
    }

  }

  .symptom-inner-content {
    font-size: 0;
    padding-left: 60px;
    padding-right: 30px;
    margin-top: 80px;
  }

  .symptom-inner-item {
    display: inline-block;
    vertical-align: middle;
    padding: 0 50px;
    border: 1px solid #CCCCCC;
    border-radius: 10px;
    margin-right: 32px;
    font-size: 36px;
    margin-bottom: 32px;
    height: 80px;
    line-height: 80px;
    transition: all 0.2s linear;
    &.active {
      border: none;
      background: #00B9AD;
      box-shadow: 0 4px 10px 0 rgba(37, 56, 77, 0.04);
      color: #ffffff;
    }
  }

  .symptom-inner-textarea {
    padding: 0 60px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
    textarea {
      border: 1px solid #CCCCCC;
      border-radius: 8px;
      padding: 16px;
      font-size: 32px;
      color: #333333;
      height: 240px;
      width: 100%;
      box-sizing: border-box;
    }
    @include placeholder() {
      font-size: 32px;
      color: #AAAAAA;
    }
    .last-count {
      position: absolute;
      bottom: 10px;
      right: 70px;
      font-size: 36px;
      color: #FE8178;

    }
  }

  .symptom-submit-btn {
    margin: 0 auto;
    margin-top: 80px;
    background-image: linear-gradient(-90deg, #07B6AC 6%, #3FE6BC 95%);
    box-shadow: 0 10px 18px 0 rgba(30, 231, 187, 0.38);
    width: 500px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius: 9999px;

    font-size: 34px;
    color: #ffffff;
  }

  .pain-level-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    z-index: 5;
  }

  .pain-level-box {
    background: #ffffff;
    border-radius: 8px;
    box-sizing: border-box;
    z-index: 5;
    position: absolute;
    width: 690px;
    left: 50%;
    margin-left: -345px;
    top: 50%;
    transform: translateY(-50%);
    padding-bottom: 172px;
    .pain-level-ensure {
      width: 500px;
      height: 100px;
      position: absolute;
      bottom: -50px;
      left: 50%;
      margin-left: -250px;
      box-shadow: 0 8px 24px 0 rgba(74, 74, 74, 0.5);
    }
    & > h3 {
      font-size: 30px;
      color: #909090;
      font-weight: normal;
      padding: 40px 40px 0;
      @include clearfix();
      span {
        float: left;
      }
      .icon-closePainLevel {
        float: right;
        width: 30px;
        height: 30px;
        background: url("https://m.allinmed.cn/static/image/img00/index/close.png") no-repeat;
        background-size: 100% 100%;
      }
    }
    & > p {
      padding: 30px 0;
      font-size: 32px;
      color: #333333;
      background: rgba(239, 239, 239, 0.3);
      margin: 40px 0;
    }
    .pain-level-progress {
      -webkit-appearance: none;
      position: relative;
      top: 67.5px;
      width: 682px !important;
      height: 116px;
      .vue-slider {
        background: none;
      }
      .vue-slider-process {
        background: none;
      }
      .vue-slider-piecewise {
        li {
          &:before {
            content: "";
            font-size: 24px;
            color: #aaaaaa;
            position: absolute;
            top: -180px;
            left: -15px;
            white-space: nowrap;
          }
          &:nth-child(1) {
            &:before {
              content: "不痛";
            }
          }
          &:nth-last-child(1) {
            &:before {
              content: "巨痛";
            }
          }
        }
      }
      .vue-slider-dot {
        width: 160px;
        height: 160px;
        box-shadow: none;
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression00@2x.png") no-repeat;
        background-size: contain;
      }
      &.pain0 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression00@2x.png") no-repeat;
          background-size: contain;
          position: absolute;
          top: 0;
        }
      }
      &.pain1 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale02@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression02@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain2 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale03@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression03@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain3 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale05@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression05@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain4 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale08@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression08@2x.png") no-repeat;
          background-size: contain;
        }
      }
      &.pain5 {
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/scale09@2x.png") no-repeat center center;
        background-size: 97% 80%;
        .vue-slider-dot {
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/popups_expression09@2x.png") no-repeat;
          background-size: contain;
        }
      }
    }
  }

  .vue-slider {
    background: none !important;
  }

  .pain-level-progress-tips {
    text-align: center;
    font-size: 0;
    position: relative;
    white-space: nowrap;
    left: 5%;
    margin-bottom: 20px;
    & > li {
      display: inline-block;
      font-size: 28px;
      padding-right: 39px;
      color: #909090;
      &.tips {
        position: relative;
        &:before {
          content: "";
          font-size: 24px;
          color: #aaaaaa;
          position: absolute;
          top: -35px;
        }
        &.first:before {
          content: "不痛";
          left: -25%;
        }
        &.last:before {
          content: "巨痛";
          left: -10%;
        }
      }
    }
  }

  .pain-level-title-content {
    background: #ffffff;
    border-radius: 9999px;
    width: 564px;
    margin: 0 auto;
    padding: 14px 16px;
    box-sizing: border-box;
    margin-top: 54px;
    &.pain .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression00@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain0 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression00@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain1 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression02@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain2 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression03@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain3 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression05@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain4 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression08@2x.png") no-repeat;
      background-size: contain;
    }
    &.pain5 .icon-pain-level-tips {
      background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/secondary_expression09@2x.png") no-repeat;
      background-size: contain;
    }

    & > .icon-pain-level-tips {
      width: 60px;
      height: 60px;
      display: inline-block;
      vertical-align: middle;
    }

    & > p {
      font-size: 32px;
      color: #222222;
      vertical-align: middle;
      display: inline-block;
      position: relative;
      width: 450px;
      &.choicePain:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -18px;
        @include square(36px);
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/arrow@2x.png");
        background-size: contain;
      }
      em {
        font-style: normal;
        vertical-align: middle;
      }
      span {
        @include ellipsis();
        color: #2EA9FE;
        width: 225px;
        display: inline-block;
        vertical-align: middle;

        &:after {
          content: "";
          display: inline-block;
          vertical-align: middle;
          position: absolute;
          right: 0;
          top: 50%;
          margin-top: -18px;
          @include square(36px);
          background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/arrow@2x.png");
          background-size: contain;
        }
      }
    }
  }
</style>
