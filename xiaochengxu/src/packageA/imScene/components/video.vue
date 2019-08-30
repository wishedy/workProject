<template>
  <section class="main-message-box" @longpress="longTouchHandler">
    <section class="video-player" v-if="showBigVideo" @click="hideBigVideo">
      <video :src="videoMessage.file.url" id="videoPlayer" @click.stop=""></video>
    </section>
    <article class="main-message-box-item"
             :data-clientid="videoMessage.idClient"
             :class="{'my-message':videoMessage.from===userData.account,
             'others-message':videoMessage.from===targetData.account}">
      <figure class="main-message-img" v-if="videoMessage.from===targetData.account" @click.stop="$emit('clickLogo')">
        <template v-if="isFindDoctor">
          <img src="https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png" alt="">
          <!--<img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">-->
        </template>
        <template v-else>
          <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="">
        </template>
      </figure>
      <i class="fail-button" style="display:none">

      </i>
      <figcaption class="main-message-content video-message-box"
                  :class="{'my-video':videoMessage.from===userData.account}">

        <span class="delete-msg-btn" @click.stop="deleteMsgEvent"
              v-if="currentIndex===deleteMsgIndex&&showDeleteMsg&&videoMessage.from===userData.account">撤回</span>

        <section class="middle-tip-box" v-if="progress&&progress.uploading">
          <figure class="middle-tip-box-text">
            <img class="notShow" src="https://m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png"
                 alt="loading...">
            <figcaption class="progress"><p>{{progress.progress}}</p></figcaption>
          </figure>
        </section>
        <header class="mulit-title" v-if="videoMessage.from===targetData.account">视频</header>
        <section class="mulitple-image-box">
          <figure class="mulitple-image">
            <img class="im-image" @click="videoPlay()" src="https://m.allinmed.cn/static/image/imScene/video_play@76.png"
                 alt=""
                 style="border-radius: 21px">
          </figure>

        </section>
        <article class="disclaimer-content" v-if="videoMessage.from===targetData.account">
          <span>重要提示：在线咨询不能代替面诊，医生建议仅供参考。</span>
        </article>
      </figcaption>

      <figure class="main-message-img" v-if="videoMessage.from===userData.account">
        <img :src="logoUrl" alt="">
      </figure>
    </article>
  </section>
</template>

<script>
  import {createNamespacedHelpers} from "vuex";

  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');

  export default {
    data() {
      return {
        showDeleteMsg: false,
        showBigVideo: false
      }
    },

    methods: {
      longTouchHandler() {
        if (this.toolbarConfig.delete) {
          this.showDeleteMsg = true;
          this.$emit("longTouchEmitHandler");
        }
      },
      deleteMsgEvent() {
        this.showDeleteMsg = false;
        this.$emit("deleteMsgEvent");
      },
      videoPlay() {
        const _url = `/packageA/videoPlayer/videoPlayer?videoUrl=${encodeURIComponent(this.videoMessage.file.url)}`;
        wx.navigateTo({
          url: _url
        });
      },
      hideBigVideo() {
        this.showBigVideo = false;
        this.$emit("update:inputBoxShow", true);
        this.videoContext.pause();
      }
    },
    computed: {
      ...mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', 'isFindDoctor']),
      ...mapGetters(['targetLogo']),
      progress() {

      }
    },
    props: {
      videoMessage: {
        type: Object
      },
      videoProgress: {
        type: Object
      },
      targetData: {
        type: Object
      },
      userData: {
        type: Object
      },
      currentIndex: {
        type: Number
      },
      deleteMsgIndex: {
        type: Number
      },
      inputBoxShow: {
        type: Boolean
      }
    },
    mounted() {
      console.log(this.videoMessage)
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 30000,
          duration: 100
        })
      }, 300)
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">


  .video-message {
    width: 150px;
    height: 150px;

  }

  .video-player {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    background-color: #000000;
    text-align: center;
    &::before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      height: 100%;
    }
    & > video {
      width: 100%;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .main-message-box-item.others-message > .main-message-content.video-message-box {
    .mulitple-image-box {
      width: 200px;
      height: 200px;
    }
  }

  .main-message-box-item.my-message > .main-message-content.video-message-box {
    padding: 0;
    width: 200px;
    height: 200px;
    position: relative;
    border-top-right-radius: 21px;

    .delete-msg-btn {
      margin-left: -150px;
    }
    .mulitple-image-box {
      padding-top: 0;
      height: 100%;
    }
    .mulit-title {
      padding-bottom: 24px;
      border-bottom: 1px solid #d8d8d8;

      font-size: 34px;
      color: #222222;
    }
    .multiple-box {
      min-width: 510px;

    }

  }

  .others-message {
    .mulitple-image-box {
      margin-top: 24px;
    }
  }

  .mulitple-image-box {
    text-align: left;
    & > .mulitple-image {
      display: inline-block;
      margin-right: 20px;
      position: relative;
      width: 100%;
      background: url("https://m.allinmed.cn/static/image/imScene/default_video.jpg");
      background-size: 100% 100%;
      border-radius: 21px;
      height: 100%;
      & > img {
        width: 76px;
        height: 76px;
        vertical-align: top;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -38px;
        margin-top: -38px;
      }
      &:nth-child(1) {
        // margin: 0;
      }
      &:nth-last-child(1) {
        margin-right: 0;
      }
    }
  }

  .im-video {
    width: 100%;
  }
</style>
