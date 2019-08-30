<template>
  <section class="suggestion-box" @click="goFeedback()">
    <div class="suggestion-bg"></div>
    <!--<p class="suggestion-text">提建议</p>-->
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2017/12/25.
   */
  export default {
    data() {
      return {}
    },
    methods: {
      goFeedback() {
        if (this.doctorCustomerId) {
          wx.navigateTo({
            url: `/pages/feedback/feedback?from=im&customerId=${this.customerId}&doctorCustomerId=${this.doctorCustomerId}&triageCustomerId=${this.triageCustomerId}`
          });
        } else {
          wx.navigateTo({
            url: `/pages/feedback/feedback?from=im&customerId=${this.customerId}&triageCustomerId=${this.triageCustomerId}`
          });
        }
      }
    },
    mounted() {

    },
    components: {},
    props: {
      customerId: {
        type: String
      },
      triageCustomerId: {
        type: Number,
        default: 0
      },
      doctorCustomerId: {
        type: String
      },
      isLeave: {
        type: Boolean,
      },
      leaveFlag: {
        type: Boolean,
        default: true,
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  section.suggestion-box {
    position: fixed;
    opacity: 0.7;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    padding-top: 14px;
    bottom: 160px;
    right: 16px;
    z-index: 5;
    border-radius: 10px 0 0 10px;
    .suggestion-bg {
      width: 50px;
      height: 50px;
      margin: 0 auto;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.4.0/kefu_im.png") no-repeat center center;
      background-size: 50px 50px;
    }
    .suggestion-text {
      font-size: 30px;
      color: #FFFFFF;
      text-align: center;
      margin-top: 6px;
      line-height: 1.1;
    }
  }
</style>
