<template>
  <section class="main-message-box" @longpress="longTouchHandler">
    <article class="main-message-box-item"
             :data-clientid="fileMessage.idClient"
             :class="{'my-message':fileMessage.from===userData.account,
             'others-message':fileMessage.from===targetData.account}">
      <figure class="main-message-img" v-if="fileMessage.from===targetData.account">
        <img src="https://m.allinmed.cn/static/image/imScene/chatting_portrait_system@2x.png" alt="">
      </figure>
      <figcaption class="main-message-content file-message-box">

        <span class="delete-msg-btn" @click.stop="deleteMsgEvent"
              v-if="currentIndex===deleteMsgIndex&&showDeleteMsg&&fileMessage.from===userData.account">撤回</span>
        <section class="file-box">
          <figure class="file-content" @click="seeFile()">
            <img class="file-image" src="https://m.allinmed.cn/static/image/imScene/pdf@3x.png">
            <!-- <figcaption class="file-name">{{fileMessage.file.fileName}}</figcaption> -->
            <figcaption class="file-name" v-if="custom">{{custom.name}}</figcaption>
          </figure>
        </section>
        <article class="disclaimer-content" v-if="fileMessage.from===targetData.account">
          <span>重要提示：在线咨询不能代替面诊，医生建议仅供参考。</span>
        </article>
      </figcaption>
      <figure class="main-message-img" v-if="fileMessage.from===userData.account">
        <img :src="logoUrl" alt="">
      </figure>
    </article>
  </section>
</template>

<script>

  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapGetters} = createNamespacedHelpers('imSceneDoctor');

  export default {
    data() {
      return {
        custom: null,
        showDeleteMsg: false
      }
    },
    computed: {
      ...mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']),
      ...mapGetters(['targetLogo']),
      // progress() {
      //   if (this.currentIndex === this.fileProgress.index) {
      //     // return this.imageProgress;
      //     if (this.fileProgress.progress.includes(".")) {
      //       let returnObj = Object.assign(this.fileProgress, {
      //         progress: `${this.fileProgress.progress.split(".")[0]}%`
      //       });
      //       return returnObj;
      //     } else {
      //       return this.fileProgress;
      //     }
      //   } else {
      //     return {
      //       uploading: false,
      //       progress: "0",
      //       index: 0
      //     };
      //   }
      // },
    },
    props: {
      fileMessage: {
        type: Object
      },
      targetData: {
        type: Object
      },
      userData: {
        type: Object
      },
      fileProgress: {
        type: Object
      },
      currentIndex: {
        type: Number
      },
      deleteMsgIndex: {
        type: Number
      }
    },
    methods: {
      seeFile() {
        wx.downloadFile({
          url: this.fileMessage.file.url,
          success: function (res) {
            var filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            })
          }
        })
      },
      longTouchHandler() {
        if (this.toolbarConfig.delete) {
          this.showDeleteMsg = true;
          this.$emit("longTouchEmitHandler");
        }
      },
      deleteMsgEvent() {
        this.showDeleteMsg = false;
        this.$emit("deleteMsgEvent");
      }
    },
    mounted() {
      console.log(this.fileMessage)
      this.custom = JSON.parse(this.fileMessage.custom);
      console.log(this.custom);
    },

  }
</script>

<style lang="scss" rel="stylesheet/scss">

  .file-content {
    width: 442px;
    height: 132px;
    background: #EDEEEE;
    @include clearfix();
    .file-image {
      width: 104px;
      height: 132px;
    }
    .file-name {
      float: right;
      width: 306px;
      vertical-align: top;
      color: #333333;
      font-size: 30px;
      box-sizing: border-box;
      margin: 30px 22px 30px 0px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
</style>
