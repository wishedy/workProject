<template>
  <section class="main-message-box" >
    <section class="qr-code-box-wrapper" v-if="qrShow">
      <section class="qr-code-box">
        <i class="qr-code-close" @click="closeQr">
          <img src="/static/images/im/close.png" alt="">
        </i>
        <h2 class="qr-code-title">请保存二维码，离开小程序后， </h2>
        <h2 class="qr-code-title">能扫码联系到医生</h2>
        <figure class="qr-code-img-box">
          <img :src="qrLogoUrl" alt="图片获取失败....">
        </figure>
        <p class="qr-code-ensure" @click="saveImage" v-if="hasAuth">保存二维码</p>
        <button class="qr-code-ensure" open-type="openSetting" @opensetting="getSetResult" v-if="!hasAuth">保存二维码
        </button>
      </section>
    </section>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/5/17.
   */
  import localStorage from "common/js/miniUtil/localStorage"
  import getQrCode from "common/js/HttpRequest/getQrCode";
  import Toast from "components/toast";

  export default {
    name: "qr-code",
    data() {
      return {
        qrShow: false,
        qrLogoUrl: "",
        hasAuth: false,
        toastContent: "",
        toastShow: false,
      }
    },
    props: {
      customerId: {
        type: Number
      },
      allMsgsGot: {
        type: Boolean
      }
    },
    watch:{

    },
    methods: {
      closeQr() {
        this.qrShow = false;
        localStorage.setItem("qrHasClosed", 1);
      },
      //toast显示
      showToast(text){
        this.toastContent = text;
        this.toastShow = true;
        setTimeout(()=>{
          this.toastContent = "";
          this.toastShow = false;
        },2000);
      },
      getSetResult() {
        wx.getSetting({
          success: (res) => {
            console.log(res)
            if (!res.authSetting['scope.writePhotosAlbum']) {
              this.hasAuth = false;
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: () => {
                  this.hasAuth = true;
                },
                fail: () => {
                  this.hasAuth = false;
                }
              });
            } else {
              this.hasAuth = true;
            }
          },
        })
      },
      saveImage() {


        wx.downloadFile({
          url: this.qrLogoUrl,
          success: (res) => {

            if (res.statusCode === 200) {
              this.downloadToAlbum(res.tempFilePath);
            } else if (res.statusCode === 404) {
              this.showToast("保存失败");
            }
          }
        })
      },
      downloadToAlbum(filePath) {
        wx.saveImageToPhotosAlbum({
          filePath,
          success(res) {
            this.showToast("保存成功");
          },
          fail(res) {
            this.showToast("保存失败");
          },
          complete(res) {
            console.log(res)
          }
        })
      },

      getQrCodeImageUrl() {
        getQrCode({
          customerId: this.customerId
        }).then(data => {

          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseData) {
              this.qrLogoUrl = data.responseObject.responseData.miniUrl;
            }
          }
        })

      },
    },
    onShow(){
      console.log("qqqqqqqq")
      const hasClosed = localStorage.getItem("qrHasClosed");
      console.log(hasClosed)
      if (hasClosed && hasClosed == 1) {
        this.qrShow = false;
      } else {
        this.qrShow = true;
      }
    },
    mounted() {
      this.getSetResult();
      this.getQrCodeImageUrl();

      const hasClosed = localStorage.getItem("qrHasClosed");
      console.log(hasClosed)
      if (hasClosed && hasClosed == 1) {
        this.qrShow = false;
      } else {
        this.qrShow = true;
      }
    },
    computed: {
      Toast
    }
  }
</script>

<style lang="scss">
  .qr-code-box-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.80);
    z-index: 7;

  }

  .qr-code-box {
    margin: 0 60px;
    margin-top: 184px;
    padding: 60px 72px;
    background: #ffffff;
    border: 1px solid #DEDEDE;
    border-radius: 10px;
    box-sizing: border-box;
    position: relative;
    .qr-code-title {
      font-size: 36px;
      color: #444444;
      line-height: 1.5;
      text-align: center;
    }
    .qr-code-img-box {
      width: 266px;
      height: 266px;
      text-align: center;
      margin: 0 auto;
      margin-top: 44px;
      margin-bottom: 60px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .qr-code-ensure {
      background-image: linear-gradient(-90deg, #07B6AC 6%, #3FE6BC 95%);
      border-radius: 9999px;
      font-size: 36px;
      text-align: center;
      color: #FFFFFF;
      width: 504px;
      height: 100px;
      line-height: 100px;
      font-weight: bold;
    }
    .qr-code-close {
      width: 51px;
      height: 51px;
      position: absolute;
      top: 13px;
      right: 13px;
      display: block;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
  }
</style>
