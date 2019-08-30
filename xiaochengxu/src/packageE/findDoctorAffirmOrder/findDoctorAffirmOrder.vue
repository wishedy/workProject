<template>
  <section style="height:100%;">
    <affirmOrder v-if="orderShow" :orderParams="orderParams" :medicalParams="orderMessage"
                 @paySuccess="goIM"></affirmOrder>
    <confirm :confirmParams="{
          'ensure':'继续沟通',
          'cancel':'返回首页',
          'title':'您的订单已提交\n无需重复操作'
          }" v-if="confirmShow" @cancelClickEvent="backToHome" @ensureClickEvent="storageGoIm">
    </confirm>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import affirmOrder from "components/affirmOrder";
  import confirm from 'components/confirm';
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from 'vuex';

  const {mapState, mapGetters} = createNamespacedHelpers('findDoctor');
  export default {
    data() {
      return {
        orderParams: {},
        orderShow: false,
        confirmShow: false,
        caseId: '',
        patientId: '',
      }
    },

    onShow() {
      dataLog.enterBrowse();
      if (localStorage.getItem("PCIMLinks")) {
        let objTemp = JSON.parse(localStorage.getItem("PCIMLinks"));
        this.caseId = objTemp.caseId;
        this.patientId = objTemp.patientId;
        this.confirmShow = true;
      } else {
        this.confirmShow = false;
      }
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onLoad() {
      this.orderParams = {
        from: "findDoctor",
        doctorId: this.doctorCustomerId,
        caseId: this.patientMessage.caseId,
        patientId: this.patientMessage.patientId
      };
      this.orderShow = true;
    },
    onUnload() {
      this.orderShow = false;
      this.confirmShow = false;
      this.orderParams = {};
    },
    methods: {
      //跳转IM页面
      goIM(opt) {
        this.confirmShow = false;
        localStorage.removeItem("promotionSubId");
        if (getCurrentPages().length > 5) {
          wx.setStorageSync("backIndex",true);
          wx.reLaunch({
            url: `/packageA/imScene/imScene?caseId=${opt.caseId}&patientId=${this.patientMessage.patientId}&from=find`
          });
        } else {
          wx.navigateTo({
            url: `/packageA/imScene/imScene?caseId=${opt.caseId}&patientId=${this.patientMessage.patientId}&from=find`
          });
        }
      },
      storageGoIm() {
        this.confirmShow = false;
        localStorage.removeItem("promotionSubId");
        wx.navigateTo({
          url: `/packageA/imScene/imScene?caseId=${this.caseId}&patientId=${this.patientId}&from=find`
        });
      },
      //返回到医生列表页
      backToHome() {
        this.confirmShow = false;
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      }
    },
    computed: {
      ...mapState(["doctorCustomerId"]),
      ...mapGetters(["patientMessage", "orderMessage"])
    },
    components: {
      affirmOrder,
      confirm
    }
  }
</script>
