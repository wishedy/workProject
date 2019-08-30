<template>
  <section class="su_maskers" v-if="isInBlackList">
    <section class="su_confirmBox-inner">
      <article class="su_confirmBox-content"><p v-show="true">账号异常</p></article>
      <footer class="su_confirmBox-btns">
        <button class="su_confirmBox-ensureBtn" @click="logOut">确定</button>
      </footer>
    </section>
    <LogoLoading v-if="loadingFlag"></LogoLoading>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：检查是否在黑名单
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by wangning on 2019/3/3.
   */
  import checkBlackList from "common/js/auth/checkBlackList";
  import LogoLoading from "components/LogoLoading";

  export default {
    data() {
      return {
        isInBlackList: false,
        loadingFlag: false
      };
    },
    components: {
      LogoLoading
    },
    methods: {
      logOut() {
        // wx.clearStorage(); 因为授权原因,取消清空缓存
        wx.reLaunch({
          url: "/pages/login/login?from=blackList"
        });
      }
    },
    props: {
      shielded: {
        type: Boolean
      }
    },
    onLoad() {
      let _this = this;
      let customerId = wx.getStorageSync("userId");
      let doctorId = wx.getStorageSync("doctorId");
      let data = { customerId: customerId };

      //需要校验是否被屏蔽
      if (this.shielded) {
        data.doctorId = doctorId;
      }

      if (customerId) {
        this.loadingFlag = true;
        checkBlackList(data).then(res => {
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList && res.responseObject.responseData.dataList[0]) {

            if (res.responseObject.responseData.dataList[0].isBlack === 1) {
              _this.isInBlackList = true;
            } else {
              _this.isInBlackList = false;

              //需要检验是否被屏蔽
              if (_this.shielded && res.responseObject.responseData.dataList[0].isShielded === 1) {
                _this.$emit("shielded");
              }
            }
          }

          this.loadingFlag = false;
        }).catch(err => {
          this.loadingFlag = false;
        });
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .su_maskers {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001; //因为全局最大为1000,故改为1001.//后期可以整体优化
    transition: all 0.3s linear;
  }

  .su_confirmBox-inner {
    background-color: #fff;
    position: absolute;
    border-radius: 24px;
    overflow: hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .su_confirmBox-content {
    min-width: 442px;
    padding: 49px;
    font-size: 34px;
    line-height: 1.5;
    border-bottom: 1px solid #dfdfdf;
    color: #222;

    p {
      font-weight: bold;
      text-align: center;
      margin-top: 5px;
    }
  }

  .su_confirmBox-btns {
    .su_confirmBox-ensureBtn {
      width: 100%;
      font-size: 34px;
      text-align: center;
      color: #00BEAF;
      font-weight: bold;
      background: #fff;
    }
  }
</style>
