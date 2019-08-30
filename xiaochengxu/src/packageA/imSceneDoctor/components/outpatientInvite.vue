<template>
  <div>
    <section class="outpatient-nvite-box">
      <header class="outpatient-header">
        <h2 class="outpatient-title">
          门诊邀约单
        </h2>
      </header>
      <section class="outpatient-content">
        <section class="outpatient-content-top">
          <article class="outpatient-item-time">
            <p>
              <span>有效期</span>
              <span>一次加号机会</span>
            </p>
            <h3 class="time-area">{{oiMessage.validPeriod}}</h3>
          </article>
          <article class="outpatient-patient-msg">
            <article class="outpatient-patient-item">
              <h4 class="outpatient-patient-item-title">患者</h4>
              <p class="outpatient-patient-item-msg">
                <span>{{patientName}}</span>

                <span>{{oiMessage.patientSex == 1 ? '男' : '女'}}</span>
                <span>{{oiMessage.patientAge}}岁</span>
              </p>
            </article>
            <article class="outpatient-patient-item">
              <h4 class="outpatient-patient-item-title">证件号码</h4>
              <p class="outpatient-patient-item-msg">
                <span>{{cardId}}</span>
              </p>
            </article>
          </article>
          <article class="outpatient-patient-msg no-border">
            <article class="outpatient-patient-item">
              <h4 class="outpatient-patient-item-title">医生</h4>
              <p class="outpatient-patient-item-msg">
                <span>{{doctorName}}</span>
                <span>{{oiMessage.doctorPosition}}</span>
              </p>
            </article>
            <article class="outpatient-patient-item">
              <h4 class="outpatient-patient-item-title">医院</h4>
              <p class="outpatient-patient-item-msg content-overflow">
                <span>{{oiMessage.doctorHospital}}</span>
              </p>
            </article>
          </article>
        </section>
        <section class="outpatient-tips-box">
          <article class="outpatient-base-explanation part-one">
            <p>请以医院官网的专家出诊时间为准，停诊信息以医院当天公布为准</p>
          </article>
          <article class="outpatient-base-explanation part-two">
            <p>有效期内患者到医生诊室出示邀约单，领取加号条后，到医院挂号处缴费。挂号费以医院门诊价格为准</p>
          </article>
          <article class="outpatient-base-explanation part-three">
            <p>请以上方有效期为准，逾期就诊，医生有权拒绝加号</p>
          </article>
        </section>
      </section>
    </section>
    <section class="main-message-box grey-tips">
      <figcaption class="first-message">
        <p>此条信息不消耗医生回复次数</p>
      </figcaption>
    </section>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/29.
   */

  export default {
    data() {
      return {
        oiMessage: {}
      }
    },
    mounted() {
      this.oiMessage = this.outPatientMessage.data;
    },
    props: {
      outPatientMessage: {
        type: Object
      }
    },
    methods: {
      formatNumber(num) {
        if (num) {
          let firstPart = num.substring(0, num.length - 4);
          let lastPart = num.substring(num.length - 4, num.length);

          return firstPart.replace(/[[a-zA-Z0-9\u4e00-\u9fa5]/g, "*") + lastPart;
        }
      }
    },
    computed: {
      patientName() {
        if (!this.oiMessage.patientName) {
          return;
        } else {
          return (this.oiMessage.patientName.length > 6 ? (this.oiMessage.patientName.substring(0, 6) + "...") : this.oiMessage.patientName);
        }
      },
      doctorName(){
        if (!this.oiMessage.doctorName) {
          return;
        } else {
          return (this.oiMessage.doctorName.length > 6 ? (this.oiMessage.doctorName.substring(0, 6) + "...") : this.oiMessage.doctorName);
        }
      },
      cardId(){
        return this.formatNumber(this.oiMessage.patientDocumentNumber);
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  $inner-border-color: #E3E5E9;
  .outpatient-nvite-box {
    background: #FFFFFF;
    border-radius:24px;
    overflow: hidden;
    color: #222222;
    width: 690px;
    padding: 2px;
    background:linear-gradient(270deg,rgba(1,209,194,1) 0%,rgba(7,182,172,1) 100%);
    box-sizing: border-box;
    margin: 0 auto;
    .outpatient-header {
      height: 68px;
      line-height: 68px;
      .outpatient-title {
        font-weight: normal;
        font-size: 28px;
        color: #FFFFFF;
        &::before {
          content: "";
          display: inline-block;
          width: 28px;
          height: 28px;
          background: url("https://m.allinmed.cn/static/image/imScene/inquiry.png") no-repeat;
          background-size: cover;
          vertical-align: -2px;
          margin: 0 2px 0 32px;
        }
      }
    }
    .outpatient-content {
      background: #FFFFFF;
      width: 100%;
      box-sizing: border-box;
      border-radius:0 0 22px 22px;
      overflow:hidden;
      .outpatient-content-top{
        padding: 0 32px;
      }
    }
    .outpatient-item-time {
      padding: 44px 0;
      border-bottom: 2px solid $inner-border-color;
      & > p {
        @include clearfix();
        margin-bottom: 16px;
        span {
          &:nth-child(1) {
            float: left;
            font-size: 32px;
            color: #888888;
          }
          &:nth-last-child(1) {
            float: right;
            padding: 0 16px;
            line-height:48px;
            background:rgba(238,249,246,1);
            color:rgba(71,191,157,1);
            border-radius:6px;
            font-size:28px;
          }
        }
      }
      .time-area {
        font-size:40px;
        font-weight:500;
        color:rgba(7,182,172,1);
      }
    }
  }

  .outpatient-patient-msg {
    padding: 44px 0;
    border-bottom: 2px solid $inner-border-color;
    &.no-border{
      border: none;
    }
    .outpatient-patient-item {
      font-size: 0;
      & > h4 {
        color: #000000;
        font-size: 32px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 20px;
        font-weight: bold;
      }
      & > p {
        color: #333333;
        font-size: 0;
        display: inline-block;
        vertical-align: middle;
        &.content-overflow {
          @include ellipsis();
          max-width: 450px;
        }
        & > span {
          padding-right: 28px;
          display: inline-block;
          font-size: 32px;
          vertical-align: middle;
        }
      }
      & + .outpatient-patient-item{
        margin-top: 16px;
      }
    }
  }

  .outpatient-tips-box{
    background:rgba(245,247,248,1);
    padding: 60px 20px 60px 32px;
    position: relative;
    &::before{
      display: block;
      position: absolute;
      width: 32px;
      height: 32px;
      background:rgba(245,247,248,1);
      content:'';
      border-radius: 4px;
      top:-16px;
      left: 44px;
      transform: rotate(45deg);
    }
  }

  .outpatient-base-explanation {
    & > p {
      font-size: 34px;
      color: #333333;
      font-weight: bold;
      max-width: 525px;
      display: inline-block;
      vertical-align: text-top;
    }
    &:before {
      content: "";
      text-align: center;
      display: inline-block;
      @include square(40px);
      line-height: 40px;
      border-radius: 50%;
      vertical-align: text-top;
      background:rgba(114,208,202,1);
      margin-right: 24px;
      color: #FFFFFF;
    }
    &.part-one {
      &:before {
        content: '1';
      }
    }
    &.part-two {
      &:before {
        content: '2';
      }
    }
    &.part-three {
      &:before {
        content: '3';
      }
    }

    & + .outpatient-base-explanation{
      margin-top: 60px;
    }
  }
</style>
