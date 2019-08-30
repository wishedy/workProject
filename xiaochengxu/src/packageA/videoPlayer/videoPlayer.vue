<template>
  <section class="video-player">
    <video v-if="isIphoneX" :src="videoUrl" id="videoPlayer" direction="0" autoplay="true"></video>
    <video v-else :src="videoUrl" id="videoPlayer" autoplay="true"></video>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by hallmader on 2018/7/24.
   */
  import localStorage from "localStorage";
  export default {
    data() {
      return {
        videoUrl: "",
        isIphoneX:false
      }
    },
    methods: {},
    onLoad(){
      let that =this;
      wx.getSystemInfo({
        success: function(res) {
          if(res.model.indexOf('iPhone X') > -1){
            that.isIphoneX = true;
          }
        }
      })
    },
    onShow() {
      let _this = this;
      if (localStorage.getItem("isOnWatch")) {

      } else {
        wx.onNetworkStatusChange((res)=>{
          localStorage.setItem("isOnWatch",true);
          if (!res.isConnected){
            localStorage.setItem("isOffLine",true)
            wx.showModal({
              // title: '当前网络不可用，请检查网络设置',
              content: '当前网络不可用，请检查网络设置',
              confirmText:"重试",
              confirmColor:'#2EA9FE',
              success: function(res) {
                if (res.confirm) {
                  _this.videoContext.play();
                } else if (res.cancel) {
                  wx.navigateBack({delta: 1});
                }
              }
            })
          }else{
            localStorage.setItem("isOffLine",false)
          }
        })
      }
      this.videoUrl = decodeURIComponent(this.$root.$mp.query.videoUrl);
      this.videoContext = wx.createVideoContext('videoPlayer');
      if(this.isIphoneX){
        console.log("12423")
//        this.videoContext.requestFullScreen();
      }
      this.videoContext.play();
    },
    onUnload() {
      this.videoContext.pause();
      if(this.isIphoneX) {
//        this.videoContext.exitFullScreen();
      }
    },
    onHide() {
      this.videoContext.pause();
      if(this.isIphoneX) {
//        this.videoContext.exitFullScreen();
      }
    }
  }
</script>

<style lang="scss">
  .video-player {
    width:100%;
    height:100%;
    background-color: #000000;
    position: relative;
    & > video {
      width: 100%;
      height: 100%;
      display: inline-block;
      position: absolute;
      top:50%;
      transform:translateY(-50%);
    }
  }
</style>
