<template>
  <section style="height:100%;">
    <affirmOrder v-if="orderShow" :caseType="caseType" :orderParams="orderParams" @paySuccess="toUpLoadTimes"></affirmOrder>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>
</template>
<script type="text/ecmascript-6">
  import affirmOrder from "components/affirmOrder";
  import BackIndex from "components/backIndex"; // 返回首页组件
  import updateConsultation from "common/js/HttpRequest/updateConsultation";


  import { createNamespacedHelpers } from 'vuex';
  const { mapState} = createNamespacedHelpers('imSceneDoctor');
  export default {
    data(){
      return {
        orderParams:{},
        orderShow:false,
        orderSourceId:'',
        state:'',
        backIndexShow: false, // 返回首页是否显示
      }
    },
    onLoad(options) {
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      this.orderParams = {
        from:"imSceneDoctor",
        doctorId:options.doctorCustomerId,
        caseId:options.caseId,
        patientId:this.patientInfo.patientId
      };
      this.orderSourceId = options.orderSourceId;
      this.state = options.state;
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
        wx.navigateBack({
          delta: 1
        })
      },
      // 支付成功的回调；
      toUpLoadTimes(opt) {
        updateConsultation({
          consultationId: this.orderSourceId,
          frequency: opt.orderFrequency,
          frequencyType: "2",
          consultationLevel: opt.orderType,
          consultationState: this.state,
          isOuttimeNoReply:"1"
        }).then(data => {
          if (data.responseObject.responseStatus && data.responseObject.responseData) {
            wx.setStorageSync('paySuccessParams',JSON.stringify(opt));
            this.goIM();
          }
        });
      },
    },
    computed: {
      ...mapState(["patientInfo",'caseType']),
    },
    components:{
      affirmOrder,
      BackIndex
    }
  }
</script>
