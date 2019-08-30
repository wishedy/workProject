<template>
  <section class="comment-window-container" :class="{'show':showShareBox}" @click="cancelSubmit">
    <footer class="bottom-barr" :class="{'isIphoneX':system=='iphoneX'}">
      <section class="bottom-bar-item">
        <button class="bottom-bar-item-content" open-type="share" @getuserinfo="commentEvent" >
          <i class="icon-shareBox">
            <img src="https://m.allinmed.cn/static/image/mp/index/1.1.2/wechat_02.png" alt="">
          </i>
          <span class="text">转发给好友</span>
        </button>
      </section>
      <span class="line"></span>
      <section class="bottom-bar-item">
        <button class="bottom-bar-item-content" @click="drawShareImage">
          <i class="icon-shareBox">
            <img src="/static/image/shareCircle.png" alt="">
          </i>
          <span class="text">生成分享海报</span>
        </button>
      </section>
    </footer>
    <button class="cancelButton" :class="{'isIphoneX':system=='iphoneX'}">取消</button>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12.
   */
  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "dataLog";

  const {mapState, mapMutations} = createNamespacedHelpers('journal');

  export default {
    data() {
      return {

      }
    },
    props: {
      destory: {
        type: Number,
        default: 0
      }
    },

    onUnload(){
      this.commentContent="";
      this.imageList=[];
    },
    methods: {
      ...mapMutations(['setShareShow','setCanvasShow']),
      drawShareImage(){
        this.setCanvasShow(true);
        dataLog.createTrack({
          actionId: 14200,
          opDesc:'康复日记详情页，点击生成图片'
        });
      },
      commentEvent(){
        wx.pageScrollTo({
          scrollTop:  0,
          duration: 100
        });
        dataLog.createTrack({
          actionId: '点击转发给好友的次数',
          opDesc:''
        });
      },
      cancelSubmit() {
        this.setShareShow(false);
      },
    },
    mounted() {

    },
    computed: {
      ...mapState(['showShareBox','cachePosition','canvasShow','systemInfo']),
      system() {
        // debugger
        // console.log(this.systemInfo)
        if (this.systemInfo.model&&this.systemInfo.model.toLowerCase().includes("iphone x")){
          return "iphoneX";
        }else{
          if (this.systemInfo.system) {
            if (this.systemInfo.system.toLowerCase().includes("android")) {
              return "android";
            } else {
              return "ios"
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .comment-window-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .15);
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    &.show {
      opacity: 1;
      visibility: visible;
      z-index: 3;
    }
  }
  .iphonex {
    .bottom-bar {
      height: 128px;
    }
  }
  .icon-shareBox {
    display: inline-block;
    vertical-align: middle;
    width: 52px !important;
    height: 52px !important;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }
  .bottom-barr {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    background-color: #ffffff;
    height: 144px;
    z-index: 3;
    box-sizing: border-box;
    box-shadow: 0 -3px 11px 0 rgba(0, 0, 0, 0.05);

    border-radius: 10px;
    width: 95%;
    margin: 0 auto;
    &.isIphoneX{
      bottom: 160px;
    }
    .line {
      position: absolute;
      width: 1px;
      height: 80%;
      left: 50%;
      top: 50%;
      display: block;
      transform: translate(-50%, -50%);
      background: #F0F0F0;
    }
    &-item {
      width: 50%;
      text-align: center;
      &-content {
        padding: 0;
        border: none;
        background: none;
        border-radius: 0;
        box-shadow: none;
        span {
          display: inline-block;
          vertical-align: middle;
          color: #506C85;
        }
        i {
          display: inline-block;
          vertical-align: middle;
          width: 44px;
          height: 44px;
          margin-right: 10px;
        }
        .icon-comment {
          background: url("https://m.allinmed.cn/static/image/mp/index/comment.png") no-repeat center center;
          background-size: contain;
        }
        .text {
          font-size: 28px;
        }
        .num {
          font-size: 28px;
          margin-left:5px;
        }
      }
    }
  }
  .cancelButton{
    width:95%;
    height:96px;
    line-height:96px;
    position:absolute;
    bottom:10px;
    left:20px;
    background: #FFFFFF;
    border-radius: 8px;
    &.isIphoneX{
      bottom: 50px;
    }
  }
</style>

