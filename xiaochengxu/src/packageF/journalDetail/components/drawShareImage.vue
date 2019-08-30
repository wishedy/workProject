<template>
  <section class="shareCanvasMask" @click="closeCanvas">
    <article @click.stop="" class="main" :class="{'longer':journalMessage.fullName}">
      <CanvasCreator
        :params="params"
        ref="canvas"
        v-if="showFlag&&shareImg.length==0"
        @success="onCreateSuccess"
      ></CanvasCreator>
      <div class="main-header" :class="{'longer':journalMessage.fullName}">{{journalMessage.diaryName}}</div>
      <div class="main-content" :class="{'longer':journalMessage.fullName}">{{journalMessage.content}}</div>
      <p class="reading" :class="{'longer':journalMessage.fullName}">我正在阅读这篇文章</p>
      <div class="main-doctor" v-if="journalMessage.fullName">
        <img :src="journalMessage.customerLogo">
        <div class="doctorName">主诊医生: {{journalMessage.fullName}}</div>
        <div class="doctorTitle">{{journalMessage.medicalTitle}} {{journalMessage.company}}</div>
      </div>
      <div class="main-QrCode" :class="{'longer':journalMessage.fullName}">
        <img :src="journalMessage.qrCode">
        <p>长按小程序码查看详情</br>分享自 「 唯医骨科 」</p>
      </div>
      <!--<img :src="shareImg" alt="">-->
      <figure class="close-btn" :class="{'longer':journalMessage.fullName}" @click="setCanvasShow(false)">
        <img src="/static/image/canvasClose.png" alt="">
      </figure>
      <section class="saveQrCode" @click.stop="saveImagePhoto" :class="{'longer':journalMessage.fullName}">
        <p>保存图片</p>
        <span>点击按钮，图片将自动保存至手机相册</span>
      </section>
    </article>
    <p style="display: inline-block">
      <EnsureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></EnsureConfirm>
    </p>
  </section>

</template>

<script>

  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by YuxiYang on 2018/10/31.
   */

  import CanvasCreator from "components/canvasCreator/canvasCreator2";
  import EnsureConfirm from "components/ensure";
  import dataLog from "dataLog";
  import {createNamespacedHelpers} from 'vuex';

  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('journal');
  export default {
    data() {
      return {
        ensureShow: false,
        params: {},
        showFlag: false,
        shareImg: "",
        fromSetting:false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
      }
    },
    onShow() {
      // this.ensureShow = false,
        this.setEnsureShow(false);
    },
    methods: {
      ...mapActions(['showToast']),
      ...mapMutations(['setCanvasShow', 'setEnsureShow']),
      closeCanvas() {
        console.log('close');
        console.log(this.fromSetting)
        if(!this.fromSetting){
          this.setCanvasShow(false);
          this.shareImg = "";
        }
      },
      goToSetting(e){
        if (e.mp.detail.errMsg==="openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']){
          this.ensureShow = false;
          this.saveImage();
        }else{
          this.setCanvasShow(true);
          this.ensureShow = false;
          this.fromSetting = false
        }
      },
      onCreateSuccess(e) {
        wx.hideLoading();
        this.shareImg = e;
      },
      saveImagePhoto(){
        let _this=this;
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum']) {//授权成功
              _this.saveImage();
            }else {//授权失败
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success: function (res) {//写入成功
                  _this.saveImage();
                },
                fail:function (err) {//写入失败
                  _this.ensureShow = true;
                  _this.fromSetting = true
                  wx.showToast({
                    title:'微信授权失败，请重试',
                    icon:'none'
                  });
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
      saveImage() {
        this.fromSetting = false;
        dataLog.createTrack({
          actionId: 14197,
        });
        wx.saveImageToPhotosAlbum({
          filePath: this.shareImg,
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
                console.log(res)
                if (res.authSetting['scope.writePhotosAlbum']) {
                  this.saveImage();
                  this.fromSetting = false
                } else {
                  this.ensureShow = true;
                  this.fromSetting = true
                }
              },
              fail: (err) => {
                console.log(err);
              }
            });
          })
        })
      },
      getCanvasMessage() {
        if (!this.journalMessage.fullName) {
          this.params = {
            width: 700,
            height: 800,
            backgroundColor: '#A3B4D1',
            debug: false,
            texts: [
              {
                x: 120,
                y: 130,
                baseLine: 'middle',
                text: '手术康复日记',
                fontSize: 30,
                color: '#FFFDFA'
              },
              {
                x: 80,
                y: 210,
                baseLine: 'middle',
                text: this.journalMessage.diaryName ? this.journalMessage.diaryName : ' ',
                lineNum: 2,
                fontSize: 36,
                width: 550,
                color: 'white',
                lineHeight: 48
              },
              {
                x: 80,
                y: 350,
                baseLine: 'middle',
                text: this.journalMessage.content ? this.journalMessage.content : ' ',
                lineNum: 3,
                fontSize: 26,
                width: 530,
                color: '#808080',
                lineHeight: 33
              },
              {
                x: 80,
                y: 480,
                baseLine: 'middle',
                text: '我正在阅读这篇文章',
                fontSize: 28,
                color: '#08B6AD',
              },
              {
                x: 220,
                y: 620,
                baseLine: 'middle',
                text: '长按小程序码查看详情',
                fontSize: 24,
                color: '#888888',
              },
              {
                x: 220,
                y: 650,
                baseLine: 'middle',
                text: '分享自 「 唯医骨科 」',
                fontSize: 24,
                color: '#888888',
              },
            ],
            images: [
              {
                width: 700,
                height: 765,
                x: 0,
                y: 20,
                url: 'https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_haibao_sm.png',
                zIndex: 0,
              },
              {
                width: 130,
                height: 130,
                x: 80,
                y: 580,
                url: this.journalMessage.qrCode,
                zIndex: 1,
              },
            ]
          }
        } else
          this.params = {
            width: 696,
            height: 948,
            backgroundColor: '#A3B4D1',
            debug: false,
            texts: [
              {
                x: 120,
                y: 110,
                baseLine: 'middle',
                text: '手术康复日记',
                fontSize: 30,
                color: '#FFFDFA'
              },
              {
                x: 80,
                y: 180,
                baseLine: 'middle',
                text: this.journalMessage.diaryName ? this.journalMessage.diaryName : ' ',
                lineNum: 2,
                fontSize: 36,
                width: 550,
                color: 'white',
                lineHeight: 48
              },
              {
                x: 80,
                y: 340,
                baseLine: 'middle',
                text: this.journalMessage.content ? this.journalMessage.content : ' ',
                lineNum: 3,
                fontSize: 26,
                width: 530,
                color: '#808080',
                zIndex: 1,
                lineHeight: 33
              },
              {
                x: 80,
                y: 480,
                baseLine: 'middle',
                text: '我正在阅读这篇文章',
                fontSize: 28,
                color: '#08B6AD',
                zIndex: 1
              },
              {
                x: 210,
                y: 590,
                text: '主诊医师:',
                fontSize: 32,
                color: 'black',
              },
              {
                x: 360,
                y: 590,
                text: this.journalMessage.fullName ? this.journalMessage.fullName : ' ',
                fontSize: 32,
                color: 'black',
                width: 280
              },
              {
                x: 210,
                y: 635,
                // text: '长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情',
                text: this.journalMessage.medicalTitle + ' ' + this.journalMessage.company,
                fontSize: 30,
                color: '#888888',
                width: 400
              },
              {
                x: 230,
                y: 780,
                baseLine: 'middle',
                text: '长按小程序码查看详情',
                fontSize: 30,
                color: '#888888',
                zIndex: 1
              },
              {
                x: 230,
                y: 830,
                baseLine: 'middle',
                text: '分享自 「 唯医骨科 」',
                fontSize: 30,
                color: '#888888',
                zIndex: 1
              },
            ],
            images: [
              {
                width: 696,
                height: 948,
                x: 0,
                y: 0,
                url: 'https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_haibao.png',
                zIndex: 0,
                backgroundColor: '#A3B4D1'
              },
              {
                width: 100,
                height: 100,
                x: 90,
                y: 550,
                url: this.journalMessage.customerLogo ? this.journalMessage.customerLogo : 'https://img05.allinmd.cn/public1/M01/1B/F4/wKgBL1uYuT6ATsTaAACLw8VTixw111_c_p_100_100.JPG',
                circle:1,
                zIndex: 1,
              },
              {
                width: 130,
                height: 130,
                x: 80,
                y: 745,
                url: this.journalMessage.qrCode ? this.journalMessage.qrCode : " ",
                zIndex: 1,
              },
            ]
          }
        this.showFlag = true;
        console.log('showFlag is ' + this.showFlag)
        this.$nextTick(() => {
          this.$refs.canvas.onCreate();
        })
      }
    },
    mounted() {
      this.getCanvasMessage();
    },
    props: {},
    components: {
      CanvasCreator,
      EnsureConfirm
    },
    computed: {
      ...mapState(['journalMessage', 'systemInfo'])
    }
  }
</script>

<style lang="scss">
  .main {
    display: inline-block;
    vertical-align: top;
    width: 624px;
    background: #FFFFFF;
    border-radius: 24px;
    transform-origin: 0 0;
    padding: 44px;
    box-sizing: border-box;
    position: relative;
    background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_small.png") no-repeat center;
    background-size: contain;
    .main-header {
      opacity: 0.9;
      font-size: 38px;
      color: #FFFFFF;
      line-height: 48px;
      text-shadow: 0 3px 8px rgba(19, 141, 139, 0.27);
      position: relative;
      text-align: left;
      top: 118px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      max-height: 110px;
      font-weight: 600;
      &.longer {
        top: 50px;
        padding-left: 11px;
      }
    }
    .main-content {
      font-size: 26px;
      color: #808080;
      line-height: 34px;
      position: absolute;
      top: 309px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      text-align: left;
      max-height: 135px;
      max-width: 460px;
      &.longer {
        top: 240px;
        padding-left: 16px;
      }
    }
    .reading {
      position: absolute;
      bottom: 290px;
      font-size: 28px;
      color: #08B6AD;
      line-height: 30px;
      &.longer {
        bottom: 362px;
        padding-left: 16px;
      }
    }
    .main-QrCode {
      position: absolute;
      bottom: 120px;
      margin-left: 10px;
      &.longer {
        position: absolute;
        bottom: 44px;
      }
      & > p {
        font-size: 24px;
        color: #888888;
        display: inline-block;
        margin-left: 10px;
        padding-top: 18px;
      }
      & > img {
        width: 100px;
        height: 100px;
        vertical-align: top;
        display: inline-block;
      }
    }
    .main-doctor {
      background: #F5FAF8;
      border-radius: 4px;
      position: absolute;
      width: 450px;
      top: 430px;
      padding: 5px;
      box-sizing: border-box;
      height: 100px;
      & > img {
        position: absolute;
        width: 84px;
        height: 84px;
        border-radius: 50%;
        top: 10px;
        margin-left: 10px;
      }
      .doctorName {
        position: relative;
        font-size: 29px;
        color: black;
        line-height: 29px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-left: 114px;
        margin-top: 20px;
      }
      .doctorTitle {
        margin-top: 10px;
        position: relative;
        font-size: 26px;
        color: #888888;
        line-height: 26px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        margin-left: 114px;
      }
    }
    & > img {
      width: 100%;
      height: 756px;
      vertical-align: top;
      border-radius: 5px;
    }
    &.longer {
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_big.png") no-repeat center;
      background-size: contain;
    }
  }

  .shareCanvasMask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.6);
    text-align: center;
    z-index: 10;
    .canvasCreator {
      visibility: hidden;
      opacity: 0;
    }
    &:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    & > article {
      display: inline-block;
      width: 576px;
      height: 752px;
      border-radius: 24px;
      transform-origin: 0 0;
      text-align: left;
      padding: 44px;
      box-sizing: border-box;
      position: relative;
      vertical-align: middle;
      top: -56px;
      .saveQrCode {
        position: absolute;
        top: 720px;
        left: 50%;
        transform: translateX(-50%);
        text-align: center;
        span {
          font-size: 26px;
          color: #ffffff;
          white-space: nowrap;
          margin-top: 18px;
          opacity: 0.8;
        }
        p {
          background: #ffffff;
          border-radius: 10000px;
          width: 400px;
          height: 84px;
          font-size: 32px;
          text-align: center;
          line-height: 84px;
          color: #00B9AD;
          margin: 0 auto;
        }
        &.longer {
          position: relative;
          top: 685px;
        }
      }
    }
  }

  .close-btn {
    position: absolute;
    right: -20px;
    top: 29px;
    & > img {
      width: 64px;
      height: 64px;
      vertical-align: top;
    }
    &.longer {
      top: -26px;
    }
  }
</style>
