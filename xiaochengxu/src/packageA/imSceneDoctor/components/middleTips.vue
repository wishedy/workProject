<template>
  <div>
    <section class="main-message-box grey-tips" v-if="tipsType==5">
      <figcaption class="first-message">
        <p>在线咨询不能代替面诊，医生建议仅供参考</p>
      </figcaption>
    </section>
    <p class="receive-treatment"><span>{{tipsContent}}</span></p>
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/25.
   */
  export default{
    data(){
      return {
        tipsContent: ""
      }
    },
    mounted(){

      switch (this.tipsType) {
        case 4://医生接诊
          this.tipsContent = "咨询已开始";
          break;
        case 5://咨询结束
          this.tipsContent = "咨询已结束";
          break;

      }
    },
    methods: {},
    props: {
      tipsType: {
        type: Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .receive-treatment {
    padding: 36px 0;
    text-align: center;
    &:before, &:after {
      content: '';
      display: inline-block;
      vertical-align: middle;
      width: 238px;
      height: 16px;
    }
    &:before {
      background: url("https://m.allinmed.cn/static/image/imScene/left_start_or_finish@2x.png");
      background-size: contain;
    }
    &:after {
      background: url("https://m.allinmed.cn/static/image/imScene/right_start_or_finish@2x.png");
      background-size: contain;
    }
    span {
      font-size:26px;
      color: #AAAAAA;
      display: inline-block;
      vertical-align: middle;
      padding: 0 12px;
    }
  }
</style>
