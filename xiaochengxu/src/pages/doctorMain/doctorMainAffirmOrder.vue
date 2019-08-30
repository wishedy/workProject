<template>
  <section>
    <affirmOrder v-if="orderShow" :orderParams="orderParams" :caseType="idList.caseType"  @paySuccess="toUpLoadTimes"></affirmOrder>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>
</template>

<script>
import localStorage from "localStorage";
import {createNamespacedHelpers} from "vuex";
const {mapMutations, mapGetters, mapActions,mapState} = createNamespacedHelpers('doctorMain');
import affirmOrder from "components/affirmOrder";
import BackIndex from "components/backIndex"; // 返回首页组件
import updateConsultation from "common/js/HttpRequest/updateConsultation";
import updateConsultationState from "common/js/HttpRequest/updateConsultationState";
export default {
  data() {
    let newVar = {
      orderParams:{},
      orderShow:false,
      backIndexShow: false, // 返回首页是否显示
    };
    return newVar;
  },
  onLoad() {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.orderParams = {
      from:"doctorHome",
      doctorId:this.idList.doctorId,
      caseId:this.idList.caseId,
      patientId:this.idList.patientId
    }
    this.orderShow = true;
  },
  onUnload() {
    this.orderShow = false;
    this.orderParams = {};
  },
  methods: {
    // 支付成功的回调；
    toUpLoadTimes(opt) {
      let _this = this;
      if (_this.idList.caseType == '15') {
        this.refreshState(-1);
        let urlTemp="/packageA/imSceneDoctor/imSceneDoctor?caseId="+_this.idList.caseId+"&doctorCustomerId="+_this.idList.doctorId+"&patientId="+_this.idList.patientId+"&from=doctorHome";
        wx.redirectTo({
          url:urlTemp
        })
      } else {
        updateConsultation({
          consultationId: localStorage.getItem("orderSourceId"),    //和主诊医生的会话Id
          frequency: opt.orderFrequency,
          frequencyType: "2",
          consultationLevel: opt.orderType,
          consultationState: -1
        }).then(data => {
          if (data.responseObject.responseStatus) {
            localStorage.setItem("sendTips", JSON.stringify(opt));
            this.refreshState(-1);
            let urlTemp="/packageA/imSceneDoctor/imSceneDoctor?caseId="+_this.idList.caseId+"&doctorCustomerId="+_this.idList.doctorId+"&patientId="+_this.idList.patientId+"&from=doctorHome";
            wx.redirectTo({
              url:urlTemp
            })
          }
        });
      }
    },
    // 更新分诊状态
    refreshState(state) {
      updateConsultationState({
        consultationIds: this.idList.orderSourceId,
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
  computed:{
      ...mapState(["idList"])
  },
  components: {
    affirmOrder,
    BackIndex,
  }
};
</script>

<style lang="scss" scoped>
</style>

