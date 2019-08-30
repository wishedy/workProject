<template>
  <section class="main-message-box">
    <article class="main-message-box-item others-message">
      <figure class="main-message-img">
        <template v-if="isFindDoctor">
          <img src="https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png" alt="">
          <!--<img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">-->
        </template>
        <template v-else>
          <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="">
        </template>
      </figure>
      <figcaption class="medical-report-tips">
        <p>您的情况我了解了，由于您的病历与{{doctorBaseMsg.customerName}}医生的接诊要求不匹配，系统将自动为您退款；同时我将为您推荐其他合适的医生，请稍后。</p>
        <section class="tips-content">
          重要提示：在线咨询不能代替面诊，医生建议仅供参考。
        </section>
      </figcaption>
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
const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');
export default {
  data() {
    return {
      
    };
  },
  mounted() {},
  computed: {
    ...mapState(['isFindDoctor','doctorBaseMsg']),
  },
  methods: {
    ...mapMutations(['setIsFindDoctor',]), 
  },
  props: {
    // doctorName: {
    //   type: String,
    //   default: "xxx"
    // },
  }
};
</script>
