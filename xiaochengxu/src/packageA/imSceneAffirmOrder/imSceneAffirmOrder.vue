<template>
  <section style="height:100%;">
    <affirmOrder v-if="orderShow" :caseType="caseType" :orderParams="orderParams" @paySuccess="toUpLoadTimes"></affirmOrder>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>
</template>
<script type="text/ecmascript-6">
  import affirmOrder from "components/affirmOrder";
  import BackIndex from "components/backIndex"; // 返回首页组件
  import localStorage from "localStorage";

  import updateConsultation from "common/js/HttpRequest/updateConsultation";
  import updateConsultationState from "common/js/HttpRequest/updateConsultationState";


  import { createNamespacedHelpers } from 'vuex';
  const { mapState,mapGetters } = createNamespacedHelpers('imScene');
  export default {
    data(){
      return {
        orderParams:{},
        orderShow:false,
        backIndexShow: false, // 返回首页是否显示
      }
    },
    onLoad () {
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
    },
    onShow(){
      this.orderParams = {
        from:"imScene",
        doctorId:this.orderDoctorId,
        caseId:this.caseId,
        patientId:this.patientInfo.patientId
      };
      console.log(this.orderParams);
      this.orderShow = true;
    },
    onUnload(){
      this.orderParams={};
      this.orderShow = false;
    },
    methods:{
      //跳转IM页面
      goIM(){
        this.orderParams={};
        this.orderShow = false;
        wx.redirectTo({
          url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${this.caseId}&patientId=${this.patientInfo.patientId}&doctorCustomerId=${this.orderDoctorId}&from=imScene`
        });
      },
      // 支付成功的回调；
      toUpLoadTimes(opt) {
        if (this.caseType == '15') {
          this.refreshState(-1);
          this.finish = false;
          this.goIM();
        } else {
          updateConsultation({
            consultationId: localStorage.getItem("orderSourceId"),
            frequency: opt.orderFrequency,
            frequencyType: 2,
            consultationState: -1,
            consultationLevel: opt.orderType
          }).then(data => {
            if (data.responseObject.responseStatus) {
              localStorage.setItem("sendTips", JSON.stringify(opt));
              this.refreshState(-1);
              this.finish = false;
              this.goIM();
            }
          });
        }
      },
      // 更新分诊状态
      refreshState(state) {
        updateConsultationState({
          consultationIds: this.consultationId,
          consultationState: state //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
        }).then(data => {
          if (data.responseObject.responseStatus) {
            console.log("状态更新成功" + state);
          } else {
            console.log("状态更新失败" + data);
          }
        });
      }
    },
    computed: {
      ...mapState(["orderDoctorId","caseId","caseType","patientInfo",'consultationId']),
    },
    components:{
      affirmOrder,
      BackIndex
    }
  }
</script>
