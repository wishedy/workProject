<template>
  <div>
    <section class="main-message-box grey-tips">
      <figcaption class="first-message">
        <p v-if="tipsType == 4">您已重新购买分诊医生的咨询，可重新提问</p>
        <p v-else-if="tipsType == 5">系统提示：分诊为您推荐的「 {{doctorName}} 」医生已经接诊，请尽快与医生沟通</p>
        <p v-else-if="tipsType == 6">{{tipsText}}</p>
        <p v-else-if="tipsType == 7">系统提示：医生助理的服务已经结束啦，点击上方卡片，与医生沟通详细病情</p>
      </figcaption>
    </section>
    <p v-if="tipsType !=4 && tipsType !=5 && tipsType !=7" class="receive-treatment"><span>咨询已结束</span></p>
    <!--<section v-if="tipsType ==7" class="main-message-box grey-tips">-->
      <!--<figcaption class="first-message">-->
        <!--<p>在线咨询不能代替面诊，医生建议仅供参考</p>-->
      <!--</figcaption>-->
    <!--</section>-->
  </div>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/7/5.
   */
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');
  export default{
    data(){
      return {
        doctorName:'',
      }
    },
    computed: {
      ...mapState(['doctorBaseMsg',]),
      logoUrl() {
        return this.$store.state.logoUrl;
      }
    },
    mounted(){
      if (this.tipsType == 5) {
        this.doctorName = JSON.parse(this.msg.custom).docName;
      }
    },
    methods: {},
    props: {
      tipsType: {
        type: Number
      },
      tipsText: {
        type: String
      },
      msg:{
        type :Object
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .grey-tips{
    text-align: center;
  }
  .receive-treatment {
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
