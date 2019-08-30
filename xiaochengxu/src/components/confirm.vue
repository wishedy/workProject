<template>
  <section class="maskers confirmBox-tips show">
    <section class="confirmBox-inner">
      <article class="confirmBox-content">
        <article>
          <h2 v-if="confirmParams.title" style="font-weight:bold">{{confirmParams.title}}</h2>
          <p v-show="confirmParams.content" v-html="confirmParams.content" :class="confirmParams.propClassName"></p>
        </article>
      </article>
      <footer class="confirmBox-btns">
        <span v-if="confirmParams.cancel" class="confirmBox-cancelBtn" @click="cancelClickEvent">{{confirmParams.cancel}}</span>
        <span v-if="confirmParams.ensure" class="confirmBox-ensureBtn" @click="ensureClickEvent">{{confirmParams.ensure}}</span>
      </footer>
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
   * Created by qiangkailiang on 2017/7/27.
   */
  export default {
    data() {
      return {}
    },
    methods: {
      cancelClickEvent() {
        this.$emit('cancelClickEvent')
      },
      ensureClickEvent() {
        console.log('点击');
        this.$emit('ensureClickEvent')
      }
    },
    mounted() {

    },
    props: {
      confirmParams: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .maskers {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
    transition: all 0.3s linear;
  }

  .confirmBox-inner {
    background-color: #fff;
    position: absolute;
    border-radius: 24px;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    overflow: hidden;
  }

  .confirmBox-content {
    min-width: 442px;
    padding: 49px;
    font-size: 34px;
    line-height: 1.5;
    border-bottom: 1px solid #dfdfdf;
    color: #222;
    h2 {
      font-weight: normal;
      text-align: center;
      font-size: 34px;
      color: #222;
    }
    p {
      text-align: center;
      margin-top: 5px;
      font-size: 26px;
    }
  }

  .confirmBox-btns {
    font-size: 34px;
    text-align: center;
    background: #fff;
    box-sizing: border-box;
    span {
      color: #2EA9FE;
      width: 49%;
      padding: 17px 0;
      display: inline-block;
      box-sizing: border-box;
    }
    .confirmBox-cancelBtn {
      border-right: 1px solid #dfdfdf;
    }
    .confirmBox-ensureBtn {
      font-weight: bold;
    }
  }
</style>
