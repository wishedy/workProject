<template>
  <section class="main-message-box" @longpress="longTouchHandler">
    <article
      class="main-message-box-item my-message"
      :data-clientid="imageMessage.idClient">

      <i class="fail-button" style="display:none">

      </i>
      <figcaption class="main-message-content multiple-box image-type">
        <transition name="fade">
          <span class="delete-msg-btn" @click.stop="deleteMsgEvent"
                v-if="currentIndex===deleteMsgIndex&&showDeleteMsg&&imageMessage.from===userData.account">撤回</span>
        </transition>
        <section class="middle-tip-modal" v-if="imageMessage.loading">
          <figure class="middle-tip-box-text">
            <img class="notShow" src="//m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png"
                 alt="loading...">
          </figure>
        </section>

        <header class="mulit-title">图片({{imageList.length}})</header>
        <section class="mulitple-image-box" @click.stop="showBigImg">
          <figure class="mulitple-image" v-for="(item,index) in imageList" :key="index" v-if="index<3">
            <img :src="item" alt="" >
          </figure>
        </section>
      </figcaption>

      <figure class="main-message-img" v-if="imageMessage.from===userData.account">
        <img :src="logoUrl" alt="">
      </figure>
    </article>
  </section>
</template>

<script type="text/ecmascript-6">
  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapGetters} = createNamespacedHelpers('imSceneDoctor');
  export default {
    data() {
      return {
        imageList: [],
        showDeleteMsg: false
      };
    },
    watch: {
      "imageMessage"(data) {
        data.content.data.list.forEach((element, index) => {
          if (element) {
            this.imageList.push(this.nim.viewImageQuality({
              url: element.url,
              quality: 60
            }));
          }
        });
      }
    },
    components: {},
    methods: {
      showBigImg() {
        let that = this;
        let _indexNum = 0;
        this.showDeleteMsg = false;
        let _params = {
          imgBlob: (function () {
            let result = [];
            that.imageList.forEach((element, index) => {
              let a = element;
              let b = element.indexOf("?imageView");
              let n = a.substring(0, b);
              result.push({
                blob: n
              });
            });
            return result;
          })(),
          indexNum: 0
        };
        wx.previewImage({
          current: this.imageList[0],
          urls: this.imageList
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
      this.imageMessage.content.data.list.forEach((element, index) => {
        if (element) {
          this.imageList.push(element.url);
        }
      });

    },
    computed: {
      ...mapState(['logoUrl' ,'toolbarConfig',]),
    },
    props: {
      imageMessage: {
        type: Object,
        default: {}
      },
      targetData: {
        type: Object
      },
      nim: {
        type: Object
      },
      userData: {
        type: Object
      },
      mulitpleLoading: {
        type: Boolean
      },
      currentIndex: {
        type: Number
      },
      deleteMsgIndex: {
        type: Number
      }
    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">


  .mulit-title {
    padding-bottom: 24px;
    border-bottom: 1px solid #d8d8d8;
    font-size: 34px;
    color: #222222;
  }

  .multiple-box {
    min-width: 510px;
    position: relative;
    &.image-type {
      .mulitple-image-box {

        & > .mulitple-image {
          width: 132px;
          height: 132px;
          /*margin-right: 0;*/
          & > img {
            width: 100%;
            height: 100%;
            position: static;
            margin-top: 0;
            margin-left: 0;
          }
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
    .mulitple-image-box {
      text-align: left;
      padding-top: 24px;

      & > .mulitple-image {
        display: inline-block;
        margin-right: 18px;
        & > img {
          width: 132px;
          height: 132px;
          vertical-align: top;
        }
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }
    }

    .middle-tip-modal {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.5);
      transform: translate(0, 0);
      text-align: center;
      border-radius: 21px;
      &:before {
        content: '';
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      .middle-tip-modal .middle-tip-box-text > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: transparent;
      }
    }

  }


</style>
