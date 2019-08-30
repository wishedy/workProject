<template>
  <section class="main-message-box" @longpress="longTouchHandler">
    <article
      class="main-message-box-item"
      :data-clientid="contentMessage.idClient"
      :class="{'my-message':contentMessage.from===userData.account,
             'others-message':contentMessage.from===targetData.account}">
      <figure class="main-message-img" v-if="contentMessage.from===targetData.account" @click.stop="$emit('clickLogo')">
        <img :src="targetLogo" alt="">
      </figure>
      <i class="fail-button" style="display:none">

      </i>
      <figcaption class="main-message-content">
        <transition name="fade">
          <span class="delete-msg-btn" @click.stop="deleteMsgEvent"
                v-if="currentIndex===deleteMsgIndex&&showDeleteMsg&&contentMessage.from===userData.account">撤回</span>
        </transition>
        <p>{{contentMessage.text}}</p>
        <article class="disclaimer-content"
                 v-if="from==='report'&&currentIndex<2&&contentMessage.from===targetData.account">
          <span>重要提示：在线咨询不能代替面诊，医生建议仅供参考。</span>
        </article>
        <article class="disclaimer-content"
                 v-if="from!=='report'&&currentIndex<=3&&contentMessage.from===targetData.account">
          <span>重要提示：在线咨询不能代替面诊，医生建议仅供参考。</span>
        </article>
      </figcaption>
      <figure class="main-message-img" v-if="contentMessage.from===userData.account">
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
      };
    },
    mounted() {
      console.log("contentindex:"+this.currentIndex)
    },
    computed: {
      ...mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']),
      ...mapGetters(['targetLogo']),
    },
    methods: {
      longTouchHandler() {
        console.log(123)
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
    props: {
      contentMessage: {
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
      from:{
        type:String
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  .delete-msg-btn {
    font-size:28px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-left: -112.5px;
    text-indent: -15px;
    color: #fff;
    line-height: 70px;
    text-align: center;
    display: block;
    transform: translateY(-50%);
    width: 136px;
    height: 70px;
    background: url("https://m.allinmed.cn/static/image/imScene/bullet_withdraw.png");
    background-size: 100% 100%;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .disclaimer-content {
    color: #97A8BA;
    background: #fafafb;
    font-size:26px;
    margin: -37.5px -37.5px;
    margin-top: 34px;
    padding: 20px 36px;
    box-sizing: border-box;
    border-radius: 21px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-top: 1px solid #d8d8d8;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
