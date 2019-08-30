<template>
  <section class="main-message-box" @longpress="longTouchHandler">
    <article class="main-message-box-item"
             :data-clientid="imageMessage.idClient"
             :class="{'my-message':imageMessage.from===userData.account,
             'others-message':imageMessage.from===targetData.account}">
      <figure class="main-message-img" v-if="imageMessage.from===targetData.account" @click.stop="$emit('clickLogo')">
        <img :src="targetLogo" alt="">
      </figure>
      <i class="fail-button" style="display:none">

      </i>
      <figcaption class="main-message-content image-message">
        <section class="middle-tip-box" v-if="progress&&progress.uploading">
          <figure class="middle-tip-box-text">
            <img class="notShow" src="//m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png"
                 alt="loading..."
                 @click="">
            <figcaption class="progress"><p>{{progress.progress}}</p></figcaption>
          </figure>
        </section>
        <transition name="fade">
          <span class="delete-msg-btn" @click.stop="deleteMsgEvent"
                v-if="currentIndex===deleteMsgIndex&&showDeleteMsg&&imageMessage.from===userData.account">撤回</span>
        </transition>
        <figure class="im-image-con" @click.stop="showBigImg">
          <!--<img class="im-image" @click.stop="showBigImg" :src="imageMessage.file.url" alt=""-->
          <!--style="border-radius: 21px">-->
          <img class="im-image im-image-img" :src="imageMessage.file.url" alt="">
        </figure>
        <!--<img class="im-image" @click.stop="showBigImg" :src="imageMessage.file.url" alt=""-->
             <!--style="border-radius: 21px">-->
        <article class="disclaimer-content" v-if="imageMessage.from===targetData.account">
          <span>重要提示：在线咨询不能代替面诊，医生建议仅供参考。</span>
        </article>
      </figcaption>
      <figure class="main-message-img" v-if="imageMessage.from===userData.account">
        <img :src="logoUrl" alt="">
      </figure>
    </article>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/17.
   */

  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapGetters} = createNamespacedHelpers('imSceneDoctor');
  export default {
    data() {
      return {
        showDeleteMsg: false
      }
    },
    computed: {
      progress() {
        if (this.imageProgress) {
          if (this.currentIndex === this.imageProgress.index) {
            if (this.imageProgress.progress.includes(".")) {
              let returnObj = Object.assign(this.imageProgress, {
                progress: `${this.imageProgress.progress.split(".")[0]}%`
              });
              return returnObj;
            } else {
              return this.imageProgress;
            }
          } else {
            return {
              uploading: false,
              progress: "0",
              index: 0
            }
          }
        }
      },
    },
    computed:{
      ...mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']),
      ...mapGetters(['targetLogo']),
    },
    mounted() {

      wx.pageScrollTo({
        scrollTop: 100000,
        duration: 1000
      })
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
      showBigImg(item, index) {
        let that = this;
        let num = 0;
        that.imageList.map((item, index) => {
          if (that.imageMessage.file.url.includes(item)) {
            num = index;
            return;
          }
        });
        // let _params = {
        //   imgBlob: (function () {
        //     let result = [];
        //     that.imageList.forEach((element, index) => {
        //       if (element.includes("?imageView")) {
        //         let a = element;
        //         let b = element.indexOf("?imageView");
        //         let n = a.substring(0, b);
        //         result.push({blob: n});
        //       } else {
        //         result.push({blob: element});
        //       }
        //     });
        //     return result;
        //   }()),
        //   indexNum: num,
        // };
        console.log(this.imageMessage.file.url)
        console.log( that.imageList )
        wx.previewImage({
          current:this.imageMessage.file.url, // 当前显示图片的http链接
          urls: that.imageList // 需要预览的图片http链接列表
        })
      }
    },
    props: {
      imageMessage: {
        type: Object
      },
      nim: {
        type: Object
      },
      imageList: {
        type: Array
      },
      imageProgress: {
        type: Object
      },
      currentIndex: {
        type: Number
      },
      targetData: {
        type: Object
      },
      deleteMsgIndex: {
        type: Number
      },
      userData: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .image-message {
    background-color: #fff !important;

    .disclaimer-content {
      color: #97A8BA;
      background: #fafafb;
      font-size: 26px;
      margin: 0;
      padding: 20px 36px;
      box-sizing: border-box;
      border-radius: 21px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid #d8d8d8;
    }
  }

  .main-message-box-item.others-message > .main-message-content > img {
    margin: 30px;
  }
  .main-message-content {
    .im-image-con{
      .im-image{
        width: 150px;
        height: 150px;
        vertical-align: middle;
        border-radius: 21px;
        border-top-left-radius: 0;
        /*margin: 30px;*/
      }
    }
  }
  .main-message-box-item.others-message > .main-message-content{
    .im-image{
      &.im-image-img{
        margin: 30px;
      }
    }
  }
</style>
