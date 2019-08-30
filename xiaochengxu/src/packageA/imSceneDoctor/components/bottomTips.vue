<template>
  <section>
    <section class="bottom-tips-wrapper" v-if="bottomTipsType!=3">
      <article class="bottom-tips-text">
        {{renderMessage}}
      </article>
    </section>
    <figure class="end-tip-con" v-else-if="bottomTipsType==3">
      <i class="end-icon"></i>
      <p class="end-tip-text">因发送不良用语，本次咨询已强制结束。若有其他问题，可联系客服</p>
      <div class="end-tip-arrow"></div>
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
   * Created by qiangkailiang on 2017/8/25.
   */
  import api from "common/js/util/util";
  export default{
    data(){
      return {

      }
    },
    computed:{
      renderMessage(){
        let type = this.bottomTipsType;
        let result="";
        switch (type) {
          case -1://超时未接诊...剩余接诊时间小于0
            result = "抱歉~由于出诊、手术等原因，未能及时回复，已为您退诊；如需继续等待医生，请重新支付。";
            break;
          case 1://咨询已结束...咨询时间结束或咨询次数归零
            result = "本次咨询已结束。若希望继续咨询，请点击下方按钮完成支付后继续沟通。";
            break;
          case 2://医生拒绝咨询
            // 应需求，隐藏该文案
            // if (api.getPara().from === "report") {
            //   this.renderMessage = "抱歉~您的咨询请求未能得到主诊专家的接诊确认，已为您退诊。";
            // }else{
            //   // 应需求，隐藏该文案
            //   // this.renderMessage = "抱歉~您的咨询请求未能得到主诊医生的接诊确认，已为您退诊；点击下方按钮，我们会重新为您推荐医生。";
            //   this.renderMessage=""
            // }
            break;
        }
        return result
      }
    },
    mounted(){

    },
    methods: {

    },
    props: {
      bottomTipsType: {
        type: Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .bottom-tips-wrapper {
    width: 750px;
    height: 238px;
    position: absolute;
    bottom: 97.5px;
    left: 0;
    right: 0;
    background: url("https://m.allinmed.cn/static/image/imScene/below_the_tip@2x.png");
    background-size: contain;
    .bottom-tips-text {
      position: absolute;
      left: 202px;
      right: 75px;
      top: 50%;
      transform: translateY(-50%);
      margin-top: 18px;
      font-size: 28px;
      color: #e5e5e5;
      line-height: 1.4;
    }
  }
  .end-tip-con{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top:-168px;
    width:690px;
    height:124px;
    background:rgba(255,244,243,1);
    border-radius:16px;
    border:1px solid rgba(247,229,228,1);
    text-align: center;
    .end-tip-arrow{
      width: 32px;
      height: 32px;
      background:rgba(255,244,243,1);
      transform:rotate(45deg);
      -ms-transform:rotate(45deg); /* Internet Explorer */
      -moz-transform:rotate(45deg); /* Firefox */
      -webkit-transform:rotate(45deg); /* Safari 和 Chrome */
      -o-transform:rotate(45deg); /* Opera */
      margin:6px auto;/*让菱形浏览器上居中*/
      border-width: 1px;
      border-style: solid;
      border-color:transparent rgba(247,229,228,1) rgba(247,229,228,1)  transparent;
    }
    .end-icon{
      display: inline-block;
      vertical-align: middle;
      background: url("https://m.allinmed.cn/static/image/mp/index/1.3.0/weiqu.png") no-repeat;
      width: 56px;
      height: 56px;
      background-size: 100% 100%;
      margin-top: 24px;
    }
    .end-tip-text{
      text-align: left;
      display: inline-block;
      vertical-align: middle;
      margin-left: 12px;
      width:544px;
      font-size:30px;
      font-weight:400;
      color:rgba(252,116,106,1);
      line-height:40px;
      padding-top: 24px;
    }
  }
</style>
