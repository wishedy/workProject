<template>
  <section class="middle-tip-box ev-loading">
    <section class="middle-tip-modal">
      <figure class="middle-tip-box-text">
        <img :src="icon" :class="{'rotate':type==='loading'}" alt="loading...">
        <p>正在加载</p>
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
      return {
        icon: "/static/image/loading.png"
      }
    },
    mounted() {
      switch (this.type) {
        case "loading":
          this.icon = "/static/image/loading.png";
          break;
        case "success":
          this.icon = "/static/image/success.png";
          break;
        case "fail":
          this.icon = '/static/image/fail.png';
          break;
      }
    },
    props: {
      show: {
        type: Boolean
      },
      type: {
        type: String,
        default: "loading"
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .middle-tip-box {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;

  }

  .middle-tip-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    .middle-tip-box-text {
      padding: 40px 60px;
      box-sizing: border-box;
      text-align: center;
      & > img {
        width: 60px;
        height: 60px;
        vertical-align: top;
        &.rotate {
          animation: rotate 1s linear forwards infinite;
        }
      }
      & > p {
        margin-top: 22px;
        font-size: 30px;
        color: #FFFFFF;
      }
    }
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
