<template>
  <section class="middle-tip-box">
    <section class="middle-tip-con">
      <img :src="icon" alt="loading..." class="middle-tip-img">
      <p class="loading-text">正在加载…</p>
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
        icon: "https://m.allinmed.cn/static/image/mp/index/1.2.0/logo.gif"
      }
    },
    mounted() {
      switch (this.type) {
        case "loading":
          this.icon = "https://m.allinmed.cn/static/image/mp/index/1.2.0/logo.gif";
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
<style lang="scss" rel="stylesheet/scss" scoped>


  .middle-tip-box {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    /*background: #fff;*/
    /*background: rgba(0,0,0,.5);*/

  }

  .middle-tip-con {
    position: absolute;
    top: 50%;
    left: 50%;
    /*width: 135px;*/
    /*height: 135px;*/
    padding: 34px;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    /*background: #fff;*/
    background: rgba(0,0,0,.06);
    border-radius: 20px;
    .middle-tip-img{
      width: 92px;
      height: 92px;
      display: block;
      margin: 0 auto;
    }
    .loading-text{
      text-align: center;
      font-size:26px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,185,173,1);
      line-height:26px;
      margin-top: 14px;
    }
  }

</style>
