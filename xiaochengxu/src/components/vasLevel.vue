<template>
  <section class="vas">
    <div class="body-view">
      <div class="scope">
        <div>不痛</div>
        <div>巨痛</div>
      </div>
      <div class="level">
        <ul>
          <li v-for="item in indexList" :key="index" :class="[index == value?'active':'']">{{item}}</li>
        </ul>
      </div>
      <slider min="0" max="10" :value="value" @change="sliderEvent" @changing="sliderEvent" color="none" block-size="90"/>
      <div class="fakeSlider" :class="'position_'+value"></div>
      <div class="dot" :class="'position_'+value"></div>
    </div>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/7/18.
   */
  export default {
    data() {
      return {
        value: 2,
        indexList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],//vas的一些数据
      }
    },
    props: {
      dataList: {
        type: Array,
        default: []
      }
    },
    methods: {
      sliderEvent(e) {
        this.value = e.mp.detail.value;
        console.log(e.mp.detail.value)
        this.$emit("getSliderEvent", e.mp.detail.value)
      },
    },
    mounted() {

    },
    computed: {}
  }
</script>

<style lang="scss">
  .vas {

    .textTip {
      text-align: center;
      font-size: 32px;
      color: #333333;
      letter-spacing: 0;
      line-height: 16px;
    }
    .scope {
      padding-top: 28px;
      display: flex;
      justify-content: space-between;
      width: 588px;
      margin: 0 auto;
      & > div {
        font-size: 24px;
        color: #AAAAAA;
        letter-spacing: 0;
        line-height: 24px;
        &:nth-child(1) {
          margin-left: -5px;
        }
        &:nth-last-child(1) {
          margin-right: -13px;
        }
      }
    }
    .level {
      display: flex;
      justify-content: left;
      padding-left: 10px;
      box-sizing: border-box;
      ul {
        display: block;
        position: relative;
        left: 30px;
        li {
          display: inline-block;
          width: 56px;
          text-align: center;
          /*font-size: 28px;*/
          font-size: 32px;
          color: #909090;
          letter-spacing: 0;
          /*line-height: 28px;*/
          line-height: 32px;
          &.active {
            /*color: #2FC5BD;*/
            font-weight: bold;
            color:rgba(46,169,254,1);
          }
        }
      }
    }
    .dot {
      top: 48%;
      margin-top: 8px;
      width: 160px;
      height: 160px;
      background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression00@2x.png") no-repeat center center;
      -webkit-background-size: contain;
      background-size: contain;
      position: absolute;
      transform: translate(-50%, -50%);
      z-index: 3;
      pointer-events: none;
      left: 10px;
      &.position_0 {
        left: 58px;
      }
      &.position_1 {
        left: 120px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression02@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_2 {
        left: 175px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression02@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_3 {
        left: 235px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression03@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_4 {
        left: 290px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression03@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_5 {
        left: 347px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression05@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_6 {
        left: 403px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression05@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_7 {
        left: 460px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression08@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_8 {
        left: 515px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression08@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_9 {
        left: 570px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression09@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
      &.position_10 {
        left: 628px;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/popups_expression09@2x.png") no-repeat center center;
        -webkit-background-size: contain;
        background-size: contain;
      }
    }
    .body-view {
      position: relative;
      height: auto;
      margin: 0 auto;
      slider {
        width: 580px;
        height: 116px;
        padding-top: 40px;
        margin-left: 60px;
        opacity: 0;
      }
      .fakeSlider {
        top: -175px;
        position: relative;
        width: 682px;
        height: 116px;
        margin-left: auto;
        margin-right: auto;
        background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale00@2x.png") no-repeat center center;
        background-size: contain;
        z-index: 2;
        pointer-events: none;
        &.position_1, &.position_2 {
          background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale02@2x.png") no-repeat center center;
          background-size: contain;
        }
        &.position_3, &.position_4 {
          background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale03@2x.png") no-repeat center center;
          background-size: contain;
        }
        &.position_5, &.position_6 {
          background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale05@2x.png") no-repeat center center;
          background-size: contain;
        }
        &.position_7, &.position_8 {
          background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale08@2x.png") no-repeat center center;
          background-size: contain;
        }
        &.position_9, &.position_10 {
          background: url("http://m.allinmed.cn/static/image/img00/consult_V1.2/scale09@2x.png") no-repeat center center;
          background-size: contain;
        }
      }
    }
    .submit {
      margin-top: 68px;
      width: 100%;
      padding: 0 10px;
      text-align: center;
      box-sizing: border-box;
      .btn {
        font-size: 36px;
        height: 88px;
        width: 100%;
        line-height: 88px;
        background: #2EA9FE;
        border-radius: 88px;
        color: #fff;
      }
    }
  }
</style>
