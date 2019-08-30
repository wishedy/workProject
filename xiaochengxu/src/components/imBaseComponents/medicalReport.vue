<template>
  <div>
    <section class="main-message-box">
      <article class="medical-report-box" data-clientid="" @click="goToDetail">
        <header class="medical-report-title">咨询单</header>
        <section class="medical-report-content">
          <p class="patient-info">
            <span>患者：</span>
            <span class="patient-name">{{patientInfo.patientName}}&nbsp</span>
            <span
              class="patient-age">{{patientInfo.sexName}}&nbsp{{patientInfo.age}}岁</span>
          </p>
          <p class="case-describe"><span>主诉：</span><span class="case-describe-main">{{mainCase}}</span></p>
        </section>
        <footer class="medical-report-footer">查看已提交信息</footer>
      </article>
    </section>
    <section class="main-message-box">
      <article class="main-message-box-item others-message">
        <figure class="main-message-img">
          <template v-if="isFindDoctor">
            <img src="https://m.allinmed.cn/static/image/imScene/avatar.png" alt="">
            <img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">
          </template>
          <template v-else>
            <img src="https://m.allinmed.cn/static/image/imScene/chatting_portrait_system@2x.png" alt="">
          </template>
        </figure>
        <figcaption class="medical-report-tips">
          <template v-if="!isFindDoctor">
            <p v-if="timeSlot">您好！分诊医生正在详细阅读您提交的资料，将尽快给您答复，并根据情况为您推荐对症专家。</p>
            <p v-else-if="!timeSlot">您好！分诊服务时间为09：00-22：00，如有问题请留言，分诊医生上班后会为您答复。</p>
          </template>
          <p v-else>您好，我是{{doctorBaseMsg.customerName}}医生的医生助理，很高兴为您服务。为给您准确诊断还有几个简短的问题需要您配合完成</p>
          <!--<p>①  与您沟通分析病情</p>-->
          <!--<p>②  根据病情推荐对症专家</p>-->
          <!--<p>分诊医生通常会在5分钟内回复，请您耐心等候</p>-->
          <section class="tips-content">
            重要提示：在线咨询不能代替面诊，医生建议仅供参考。
          </section>
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
  import {mapMutations, mapState} from "vuex";

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

      if (!this.medicalReportMessage.data.diagnoseConTent&&!this.medicalReportMessage.data.diagnoseContent) {
        this.getCaseMain();
      }else{
        this.mainCase=this.medicalReportMessage.data.diagnoseConTent||this.medicalReportMessage.data.diagnoseContent
      }
    },
    computed: {
      ...mapState(['patientName','patientInfo','isFindDoctor','doctorBaseMsg']),
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
        if (timeTamp < 9 || timeTamp > 21) {
          this.timeSlot = false;
        } else {
          this.timeSlot = true;
        }
      },
      goToDetail() {
        this.$router.push({
          name: "MedicalReportDetail",
        })
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
      caseId:{
        type:Number
      },
      patientId:{
        type:Number
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
      padding: 38px 0px 0px 40px;
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
      padding-left: 40px;
      color: #2EA9FE;
      line-height: 78px;
    }
  }
</style>
