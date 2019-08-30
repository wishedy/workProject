<template>
  <section class="shootTipsBox">
    <button class="btn-slideOver" @click="skipCallBack" v-show="skipShow">关闭</button>
    <swiper style="height:100%;" class="swiper-containMain" :options="swiperOption" @change="swiperChange" indicator-dots="true" indicator-color="#cccccc" indicator-active-color="#00BCB3">
      <swiper-item>
        <scroll-view scroll-y style="height:100%;">
          <article class="stepOneBox">
            <figure class="stepOneMain">
              <h2 class="stepOneTitle"></h2>
              <p class="stepOneImg"></p>
              <h3>数码相机或者手机拍摄</h3>
              <figcaption>首推单反相机或者卡片机拍摄也可<br>用手机进行拍摄</figcaption>
              <h4>提示：拍摄前请关闭设备闪光灯</h4>
            </figure>
          </article>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y style="height:100%;">
          <article class="stepTwoBox">
            <figure class="stepTwoMain">
              <h2 class="stepTwoTitle"></h2>
              <p class="stepTwoImgComputer"></p>
              <h3>拍摄背景选择电脑</h3>
              <article>打开word白色背景全屏进行拍摄</article>
              <p class="stepTwoImgWindow"></p>
              <h3>拍摄背景选择窗户</h3>
              <article>找一间朝阳的房间在玻璃上贴张白 纸并将片子贴在白纸上</article>
              <h4 style="color: #F8852D">提示：为避免反光，请关闭房间灯光，同时建议拍摄者穿深黑色服装</h4>
            </figure>
          </article>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y style="height:100%;">
          <article class="stepThreeBox">
            <figure class="stepThreeMain">
              <h2 class="stepThreeTitle"></h2>
              <p class="stepThreeImgComputer"></p>
              <h3>通过片子上的R/L或豁口找正反</h3>
              <article class="stepThreeInfo">如图，L保持在右侧<br>R在左侧，或者在片子上找到豁口，<span style="color: #F8852D">将豁口保持在右上方</span>
              </article>
              <p class="stepThreeImgWindow"></p>
              <h3>根据片子上的文字判断正反</h3>
              <article>如图，根据文字顺序正反来分清正反</article>
            </figure>
          </article>
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y style="height:100%;">
          <article class="stepFourBox">
            <figure class="stepFourMain">
              <h2 class="stepFourTitle"></h2>
              <p class="stepFourImgComputer"></p>
              <h3>X光片建议以窗户为背景整张拍摄</h3>
              <p class="stepFourImgWindow"></p>
              <h3>CT/核磁每1-4格拍摄一张</h3>
              <article>从左至右，从上至下依次拍摄</article>
              <h4 style="color:#F8852D">提示：①拍完后确保片子上文字可以看清</h4>
              <h3 style="color:#F8852D">②片子上如有反光、人影或障碍物请重新拍摄</h3>
              <button class="btn-goShoot" @click="skipCallBack">关闭</button>
            </figure>
          </article>
        </scroll-view>
      </swiper-item>
    </swiper>
  </section>
</template>

<script>
  // 上传指导页
  export default {
    data() {
      return {
        skipShow: true,
        swiperOption: {
          notNextTick: true,
          setWrapperSize: true,
          observeParents: true
        }
      }
    },
    onShow(){
      this.skipShow=true
    },
    methods: {
      skipCallBack() {
        wx.setStorageSync("guideFrom", "shootips");
        wx.navigateBack({
          delta: 1
        })
      },
      swiperChange(e) {
        if (e.target.current == 3) {
          this.skipShow = false;
        } else {
          this.skipShow = true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .shootTipsBox {
    position: relative;
    background: #eeeeee;
    padding-bottom: 30px;
    height:100%;
    overflow: scroll;
    swiper-item{
      height:100%;
      overflow: visible !important;
    }
    .stepOneBox {
      background: url("https://m.allinmed.cn/static/image/img00/shootTips/head@2x.png") no-repeat;
      background-size: 100% 584px;
      border-top:0.5px solid transparent;
      .stepOneMain {
        margin: 300px 20px 0;
        background: #fff;
        border-radius: 20px;
        box-sizing: border-box;
        padding:40px 0 80px 0;
        .stepOneTitle {
          width: 100%;
          height: 60px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/shooting-tool@2x.png") no-repeat center;
          background-size: 240px 100%;
        }
        .stepOneImg {
          width: 100%;
          height: 364px;
          margin-top: 26px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/tool@2x.png") no-repeat center;
          background-size: 100% 100%;
        }
        h3 {
          padding-top: 26px;
          color: #000000;
          font-size: 32px;
          text-align: center;
        }
        figcaption {
          line-height: 50px;
          padding: 60px 110px 0;
          color: #4A4A4A;
          font-size: 32px;
          text-align: center;
        }
        h4 {
          width: 100%;
          padding-top: 50px;
          line-height: 50px;
          color: #F8852D;
          font-size: 32px;
          text-align: center;
          &:before {
            width: 40px;
            height: 40px;
            display: inline-block;
            background: url("https://m.allinmed.cn/static/image/img00/shootTips/prompt@2x.png");
            background-size: contain;
            border-radius: 2px;
            content: "";
            margin-right: 8px;
            vertical-align: middle;
          }
        }
      }
    }
    .stepTwoBox {
      background: url("https://m.allinmed.cn/static/image/img00/shootTips/head-small@2x.png") no-repeat;
      background-size: 100% 300px;
      border-top:0.5px solid transparent;
      .stepTwoMain {
        background: #fff;
        margin: 100px 20px 0;
        border-radius: 16px;
        box-sizing: border-box;
        padding:40px 0 80px 0;
        .stepTwoTitle {
          width: 100%;
          height: 60px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/bg-shoot.png") no-repeat center;
          background-size: 240px 100%;
        }
        .stepTwoImgComputer {
          width: 100%;
          height:240px;
          margin-top: 12px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/backgroud-computer@2x.png") no-repeat center;
          background-size: 450px 100%;
        }
        .stepTwoImgWindow {
          width: 100%;
          margin-top: 20px;
          height:220px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/shooting-window@2x.png") no-repeat center;
          background-size: 375px 100%;
        }
        h3 {
          margin-top: 20px;
          color: #000000;
          font-size: 32px;
          text-align: center;
        }
        article {
          padding: 20px 110px 8px 110px;
          color: #555555;
          font-size: 32px;
          text-align: center;
        }
        h4 {
          line-height: 50px;
          padding: 20px 95px 0;
          color: #F8852D;
          font-size: 32px;
          text-align: center;
          &:before {
            width: 40px;
            height: 40px;
            display: inline-block;
            background: url("https://m.allinmed.cn/static/image/img00/shootTips/prompt@2x.png");
            background-size: contain;
            border-radius: 2px;
            content: "";
            margin-right: 8px;
            vertical-align: middle;
          }
        }
      }
    }
    .stepThreeBox {
      background: url("https://m.allinmed.cn/static/image/img00/shootTips/head-small@2x.png") no-repeat;
      background-size: 100% 300px;
      border-top:0.5px solid transparent;
      .stepThreeMain {
        background: #fff;
        margin: 100px 20px 0;
        border-radius: 16px;
        box-sizing: border-box;
        padding:40px 0 80px 0;
        .stepThreeTitle {
          width: 100%;
          height: 64px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/positive@2x.png") no-repeat center;
          background-size: 216px 100%;
        }
        .stepThreeImgComputer {
          width: 100%;
          height: 240px;
          margin-top: 10px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/RL@2x.png") no-repeat center;
          background-size: 375px 100%;
        }
        .stepThreeImgWindow {
          width: 100%;
          height: 220px;
          margin-top: 10px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/text@2x.png") no-repeat center;
          background-size: 375px 100%;
        }
        h3 {
          margin-top: 24px;
          color: #000000;
          font-size: 32px;
          text-align: center;
        }
        h4 {
          margin-top: 10px;
          color: #000000;
          font-size: 32px;
          text-align: center;
        }
        article {
          padding: 26px 160px;
          color: #555555;
          font-size: 32px;
          text-align: center;
        }
        .stepThreeInfo {
          padding: 20px 110px;
        }
      }
    }
    .stepFourBox {
      background: url("https://m.allinmed.cn/static/image/img00/shootTips/head-small@2x.png") no-repeat;
      background-size: 100% 300px;
      border-top:0.5px solid transparent;
      .stepFourMain {
        background: #fff;
        margin: 100px 20px 0;
        border-radius: 16px;
        box-sizing: border-box;
        padding:40px 0 80px 0;
        .stepFourTitle {
          width: 100%;
          height: 64px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/shooting@2x.png") no-repeat center;
          background-size: 194px 100%;
        }
        .stepFourImgComputer {
          width: 100%;
          height: 240px;
          margin-top: 10px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/shooting-x@2x.png") no-repeat center;
          background-size: 450px 100%;
        }
        .stepFourImgWindow {
          width: 100%;
          height: 240px;
          margin-top: 20px;
          background: url("https://m.allinmed.cn/static/image/img00/shootTips/shooting-CT@2x.png") no-repeat center;
          background-size: 470px 100%;
        }
        h3 {
          margin-top: 11px;
          color: #000000;
          font-size: 32px;
          text-align: center;
        }
        h4 {
          margin-top: 10px;
          color: #000000;
          font-size: 32px;
          text-align: center;
          &:before {
            width: 40px;
            height: 40px;
            display: inline-block;
            background: url("https://m.allinmed.cn/static/image/img00/shootTips/prompt@2x.png");
            background-size: contain;
            border-radius: 2px;
            content: "";
            margin-right: 8px;
            vertical-align: middle;
          }
        }
        article {
          padding: 10px 110px;
          color: #555555;
          font-size: 32px;
          text-align: center;
          line-height: 50px;
        }
        .btn-goShoot {
          display: block;
          width: 490px;
          height: 90px;
          margin: 30px auto 0;
          text-align: center;
          color: #fff;
          background: #2EA9FE;
          border-radius: 100px;
          font-size: 36px;
          font-weight: bold;
        }
      }
    }
  }

  .btn-slideOver {
    position: absolute;
    z-index: 2;
    display: block;
    width: 120px;
    height: 60px;
    line-height: 60px;
    right: 20px;
    top: 20px;
    text-align: center;
    background: #fff;
    color: #4ECECC;
    font-size: 28px;
    border-radius: 100px;
    letter-spacing: 2px;
  }
</style>

