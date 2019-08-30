<template>
  <div>
    <section class="main-message-box">
      <article class="medical-report-box" data-clientid="" @click="goToDetail">
        <header class="medical-report-title">咨询单</header>
        <section class="medical-report-content">
          <p class="patient-info">
            <span>就诊人：</span>
            <span class="patient-name">{{formatName}}&nbsp</span>
            <span
              class="patient-age">{{patientInfo.sexName}}&nbsp{{patientInfo.age}}岁</span>
          </p>
          <p class="case-describe"><span>病&nbsp&nbsp&nbsp情：</span><span class="case-describe-main">{{mainCase}}</span>
          </p>

        </section>
        <footer class="medical-report-footer">查看已提交信息</footer>
      </article>
    </section>
    <section class="main-message-box">
      <article class="main-message-box-item others-message">
        <figcaption class="first-message">
          <p>已通知医生尽快接诊，医生回复将在公众号中即时通知，请保持关注，<span style="color: #2EA9FE">48小时未接诊将自动退诊</span></p>
        </figcaption>
      </article>
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
   * Created by qiangkailiang on 2017/8/11.
   */
  import getMedicalReportMainCase from "common/js/HttpRequest/getMedicalReportMainCase";
  import {createNamespacedHelpers} from "vuex";

  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imSceneDoctor');

  export default {
    data() {
      return {
        timeSlot: false, // 咨询单底部提示话术控制
        mainCase: ""
      }
    },
    mounted() {
      this.getTimeSlot();
      // this.$emit("medicalReportLoad",this.medicalReportMessage.data);

      if (!this.medicalReportMessage.data.diagnoseConTent && !this.medicalReportMessage.data.diagnoseContent) {
        this.getCaseMain();
      } else {
        this.mainCase = this.medicalReportMessage.data.diagnoseConTent || this.medicalReportMessage.data.diagnoseContent
      }
    },
    computed: {
      ...mapState(['patientName', 'patientInfo', 'isFindDoctor', 'doctorBaseMsg']),
      formatName() {
        if (this.patientInfo.patientName.length > 6) {
          return this.patientInfo.patientName.substring(0, 6) + "...";
        } else {
          return this.patientInfo.patientName;
        }
      }
    },
    methods: {
      ...mapMutations(['setIsFindDoctor']),
      getCaseMain() {
        getMedicalReportMainCase({
          caseId: this.caseId,
          patientId: this.patientId,
        }).then(param => {
          if (param.responseObject.responseStatus) {
            this.mainCase = param.responseObject.responseData.dataList[0].caseMain.caseMain;
          }
        });
      },
      // 设置咨询单底部提示话术
      getTimeSlot() {
        let param = this.medicalReportMessage.data;
        console.log(param)
        let timeTamp = parseInt(param.time.split(" ")[1].split(":")[0]);
        if (timeTamp < 9 || timeTamp > 17) {
          this.timeSlot = false;
        } else {
          this.timeSlot = true;
        }
      },
      goToDetail() {
        // this.$router.push({
        //   name: "MedicalReportDetail",
        // })
        wx.navigateTo({
          url: '/packageA/medicalReportDetail/medicalReportDetail?caseId=' + this.caseId,
        });
      }
    },
    filters: {
      ellipsis(value, len) {
        if (!value) return ''
        let newStr = '',
          newLength = 0;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 128) {
            newLength += 2;
          } else {
            newLength++;
          }
          if (newLength <= len) {
            newStr = newStr.concat(value[i]);
          } else {
            break;
          }
        }
        if (newLength > len) {
          newStr = newStr + "..."
        }
        return newStr;
      }
    },
    props: {
      medicalReportMessage: {
        type: Object
      },
      caseId: {
        type: Number
      },
      patientId: {
        type: Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  //咨询单
  .medical-report-box {
    height: 302px;
    width: 694px;
    margin: 0 auto;
    background: url("https://m.allinmed.cn/static/image/mp/index/1.4.0/bg.png") no-repeat;
    background-size: cover;
    .medical-report-title {
      height: 68px;
      line-height: 68px;
      font-size:28px;
      padding-left: 72px;
      color: #FFFFFF;
    }
    .medical-report-content {
      height: 152px;
      font-size:32px;
      padding: 28px 0px 0px 40px;
      box-sizing: border-box;
      color: #555555;
      line-height: 1;
      .patient-info {
        span {
          display: inline-block;
          vertical-align: text-bottom;
        }
        line-height: 1.2;
        .patient-name {
          color: #333333;
          font-weight: bold;
          display: inline-block;
          /*max-width: 160px;*/
          //          @include ellipsis();
        }
        .patient-age {
          margin-left: 10px;
          font-size:28px;
        }
      }
      .case-describe {
        margin-top: 20px;
        span {
          vertical-align: middle;
        }
        .case-describe-main {
          font-weight: bold;
          display: inline-block;
          width: 520px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          /*vertical-align: sub;*/
          line-height: 1.2;
        }
      }
    }
    .medical-report-footer {
      height: 78px;
      font-size:28px;
      padding-right: 40px;
      color: #29A3A3;
      text-align: right;
      line-height: 78px;
    }
  }
</style>
