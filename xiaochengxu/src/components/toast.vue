<template>
  <section class="popup-tips show">
    <figure class="middle-tips-box-img" v-if="imgUrl">
      <img :src="imgUrl" alt="">
    </figure>
    <figure class="middle-tip-box-text">
      <p class="tipText">{{content}}</p>
    </figure>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/7/24.
   */
  export default {
    data() {
      return {}
    },
    mounted() {
    },
    props: {
      content: {
        type: String
      },
      imgUrl: {
        type: String
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  .popup-tips {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    font-size: 30px;
    color: #fff;
    z-index: 6;
    transform-origin: 0 0;
    padding: 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .tipText {
      text-align: center;
    }
    .middle-tips-box-img {
      width: 66px;
      height: 66px;
      margin: 0 auto;
      padding-bottom: 15px;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
  }

</style>
