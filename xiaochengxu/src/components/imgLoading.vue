<template>
  <section class="img-loading-box">
    <section class="img-loading-modal">
      <figure class="img-loading-box-text">
        <img src="https://m.allinmed.cn/static/image/mp/index/loading.png" class="rotate" alt="loading...">
      </figure>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/7/18.
   */
  export default {
    data() {
      return {}
    },
    mounted() {

    },
    props: {
      show: {
        type: Boolean
      },

    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  .img-loading-box {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .img-loading-modal {
    width: 100%;
    height: 100%;
    position: relative;
    .img-loading-box-text {
      padding: 0;
      width: 40px;
      height: 40px;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
        &.rotate {
          animation: rotate 1s linear forwards infinite;
        }
      }
    }
  }

  .popup-tips {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    font-size: 30px;
    color: #fff;
    padding: 30px 30px;
    z-index: 6;
    transform-origin: 0 0;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }


</style>
