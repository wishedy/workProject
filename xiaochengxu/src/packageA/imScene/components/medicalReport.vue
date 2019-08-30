<template>
  <div class="medical-report-main">
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
          <p class="case-describe"><span>病&nbsp&nbsp&nbsp情：</span><span class="case-describe-main">{{mainCase}}</span></p>
        </section>
        <footer class="medical-report-footer">查看已提交信息</footer>
      </article>
    </section>
    <section class="main-message-box">
      <article class="main-message-box-item others-message">
        <figure class="main-message-img">
          <template v-if="isFindDoctor">
            <img src="https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png" alt="">
            <!--<img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">-->
          </template>
          <template v-else>
            <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="">
          </template>
        </figure>
        <figcaption class="medical-report-tips">
          <template v-if="!isFindDoctor">
            <p v-if="timeCompare">好的，已为您推荐匹配医生，请点击下方卡片与医生沟通～</p>
            <template v-if="!timeCompare">
              <p v-if="timeSlot">您好！分诊医生正在详细阅读您提交的资料，将尽快给您答复，并根据情况为您推荐对症专家。</p>
              <p v-else-if="!timeSlot">您好！分诊服务时间为09：00-18：00，如有问题请留言，分诊医生上班后会为您答复。</p>
            </template>

          </template>
          <p v-else>好的，稍等一下，我们正在帮您联系骨科专家，因为专家比较忙，可能需要等2个小时左右，我们会及时通过微信和短信通知您，请您留意一下。</p>
          <section class="tips-content">
            重要提示：在线咨询不能代替面诊，医生建议仅供参考。
          </section>
        </figcaption>
      </article>
    </section>
    <preview-suggestion-auto
      :caseId="parseInt(caseId)"
      :patientId="parseInt(patientId)"
      v-if="!isFindDoctor && timeCompare"
      @doctorList="getDoctorList"
    ></preview-suggestion-auto>
    <p class="suggestion-autoTip" v-if="triageType===0" @click="changeTriageType">都不是我想要的，我要找私人骨科医生</p>
    <section class="main-message-box" v-if="triageType!==0 && !isFindDoctor && timeCompare">
      <article class="main-message-box-item others-message">
        <figure class="main-message-img">
          <template v-if="isFindDoctor">
            <img src="https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png" alt="">
            <!--<img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">-->
          </template>
          <template v-else>
            <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="">
          </template>
        </figure>
        <figcaption class="medical-report-tips">
          <template v-if="!isFindDoctor">
            <p v-if="timeSlot">您好！分诊医生正在详细阅读您提交的资料，将尽快给您答复，并根据情况为您推荐对症专家。</p>
            <p v-else-if="!timeSlot">您好！分诊服务时间为09：00-18：00，如有问题请留言，分诊医生上班后会为您答复。</p>
          </template>
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
  import previewSuggestionAuto from "./previewSuggestionAuto"; // 系统建议组件
  import getMedicalReportMainCase from "common/js/HttpRequest/getMedicalReportMainCase";
  import {createNamespacedHelpers} from "vuex";
  import dataLog from "dataLog";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');

  export default {
    data() {
      return {
        timeSlot: false, // 咨询单底部提示话术控制
        mainCase: "",
        doctorList:[]
      }
    },
    components:{
      previewSuggestionAuto
    },
    mounted() {
      this.doctorList=[];
      this.getTimeSlot();
      // this.$emit("medicalReportLoad",this.medicalReportMessage.data);

      if (!this.medicalReportMessage.data.diagnoseConTent&&!this.medicalReportMessage.data.diagnoseContent) {
        this.getCaseMain();
      }else{
        this.mainCase=this.medicalReportMessage.data.diagnoseConTent||this.medicalReportMessage.data.diagnoseContent
      }
    },
    computed: {
      ...mapState(['patientInfo','isFindDoctor','doctorBaseMsg']),
      formatName() {
        if (this.patientInfo.patientName.length > 6) {
          return this.patientInfo.patientName.substring(0, 6) + "...";
        } else {
          return this.patientInfo.patientName;
        }
      },
      //  比较两个时间this.medicalReportMessage.data
      timeCompare() {
         console.log(this.medicalReportMessage.data.time>'2019-07-09')
        return this.medicalReportMessage.data.time>'2019-07-09'
      }
    },
    methods: {
      ...mapMutations(['setIsFindDoctor']),
      getDoctorList(data){
        this.doctorList=data;
      },
      //改变分诊转态
      changeTriageType(){
        dataLog.createTrack({
          actionId: 14266,
          pushMessageId: this.doctorList
        });
       this.$emit('changeType','')
      },
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
      caseId:{
        type:Number
      },
      triageType:{
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
    background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/card_bg.png") no-repeat;
    background-size: 690px 298px;
    padding-right: 2px;
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
      color: #2EA9FE;
      text-align: right;
      line-height: 78px;
    }
  }
  .medical-report-main{
    .suggestion-autoTip{
      margin-top: 68px;
      font-size:30px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(46,169,254,1);
      line-height:30px;
      text-align: center;
    }
  }
</style>
