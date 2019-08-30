<template>
  <section class="mainPublish">
    <section class="title">操作成功</section>
    <section class="mainContent">
      <section class="comment">已优先为您的日记安排审核。</section>
      <section class="comment">我们会在审核中根据实际情况优化日记的易读性、错别字等。过程持续3～5个工作日，审核通过后，会即时通知您。</section>
      <section class="comment">建议您加入患友群，即时接收通知，享受就医福利。</section>
    </section>
    <img src="https://m.allinmed.cn/static/image/mp/index/1.1.4/pulishCode.jpg">
    <section class="saveButtom" @click="saveImagePhoto()">保存二维码</section>
    <section class="back" @click="goback">返回首页</section>
    <EnsureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></EnsureConfirm>
  </section>
</template>

<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by YuxiYang on 2018/11/29.
   */
  import EnsureConfirm from "components/ensure";
  import getPagesParam from "common/js/getPagesParam/getPagesParam";
  export default {
    data() {
      return {
        patientCustomerId:'',
        ensureShow: false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
      }
    },
    methods: {
      saveImagePhoto(){
        let _this=this;
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum']) {//授权成功
              _this.saveImg();
            }else {//授权失败
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: function (res) {//写入成功
                  _this.saveImg();
                },
                fail:function (err) {//写入失败
                  wx.showToast({
                    title:'微信授权失败，请重试',
                    icon:'none'
                  });
                  _this.ensureShow = true;
                }
              })
            }
          },
          fail: (err) => {
            wx.showToast({
              title:'微信授权失败，请重试',
              icon:'none'
            });
          }
        });
      },
      saveImg(){
        wx.saveImageToPhotosAlbum({
          filePath: '/static/image/v1.1.4/pulishCode.jpg',
          success: (res) => {
            wx.showModal({
              title: "图片已保存至手机相册",
              content: '快去分享给朋友们吧',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#00BEAF'
            });
            console.log(res)
          },
          fail: (() => {
            wx.getSetting({
              success: (res) => {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  this.saveImg();
                } else {
                  this.ensureShow = true;
                }
              },
              fail: (err) => {
                console.log(err);
              }
            });
          })
        })
      },
      goback() {
        let pagesParam= getPagesParam.getPageInfo('journalList');

        if(pagesParam.hasName){//有相同的
          wx.navigateBack({
            delta: pagesParam.backNum
          })
        }else {//没有相同的历史
          wx.redirectTo({
            url:`/packageF/journal/journalList?patientCustomerId=${this.patientCustomerId}`
          })
        }
      },
      goToSetting(e){
        if (e.mp.detail.errMsg==="openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']){
          this.ensureShow = false;
          this.saveImg();
        }else{
          this.ensureShow = false;
        }
      },
    },
    onLoad(option){
      if(option.patientCustomerId){
        this.patientCustomerId=option.patientCustomerId
      }
    },
    components:{
      EnsureConfirm
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .mainPublish {
    height: 100%;
    .title {
      font-size: 46px;
      font-weight: 700;
      color: #222222;
      margin-bottom: 20px;
      margin-top: 68px;
      margin-left: 60px;
      &:before {
        position: relative;
        top: -2px;
        width: 60px;
        height: 60px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/selected.png") no-repeat;
        display: inline-block;
        content: "";
        background-size: 100% 100%;
        vertical-align: middle;
      }
    }
    .mainContent {
      margin-left: 62px;
      margin-right: 42px;
      .comment {
        width: 95%;
        line-height: 46px;
        font-size: 32px;
        color: #444444;
        margin-top: 20px;
      }
    }
    img {
      width: 360px;
      height: 360px;
      display: block;
      margin: auto;
      margin-top: 64px;
      border-radius: 8px;
    }
    .saveButtom {
      margin: auto;
      width: 560px;
      margin-top: 84px;
      background-color: #00B9AD;
      color: white;
      font-size: 36px;
      font-weight: 500;
      height: 96px;
      line-height: 96px;
      text-align: center;
      border-radius: 8px;
      display: block;
    }
    .back {
      color: #00B9AD;
      font-size: 36px;
      text-align: center;
      padding: 48px 0 70px;
    }
  }
</style>
