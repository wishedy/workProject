<template>
  <section class="backIndex-box" :class='{"doctorMainTop":from == "doctorMain"}' @click="goFeedback()">
    <div class="suggestion-bg"></div>
    <!-- <p class="suggestion-text">首页</p> -->
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
        wx.removeStorageSync('backIndex');
        wx.reLaunch({
          url:`/pages/mIndex/mIndex`
        })
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
      },
      from:{
        type: String,
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  section.backIndex-box {
    position: fixed;
    box-sizing: border-box;
    padding-top: 14px;
    top: 40px;
    left: 0;
    z-index: 5;
    &.doctorMainTop{
      top: 276px;
    }
    // border-radius: 0 10px 10px 0;
    .suggestion-bg {
      width: 110px;
      height: 60px;
      margin: 0 auto;
      // background: url("https://m.allinmed.cn/static/image/mp/index/back_home.png") no-repeat center top;
      background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/back_home.png") no-repeat center top;
      background-size: 100% 100%;
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
