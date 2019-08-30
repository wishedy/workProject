<template>
  <section class="crm-patientsEvaluation-panel">
    <section class="crm-patientsEvaluation-star">
      <span class="star-item" v-for="n in parseInt(score)" :key="n"></span>
    </section>
    <section class="crm-patientsEvaluation-label" v-if="formatteTag.length">
      <span class="label-item" v-for="(item,index) in formatteTag" v-text="item" v-if="item" :key="index"></span>
    </section>
    <section class="crm-patientsEvaluation-words" v-text="thoughts"></section>
  </section>
</template>
<script>
export default {
  props: {
    score: 0,
    tag: '',
    thoughts: ''
  },
  computed: {
    formatteTag() {
      let _this = this;
      return _this.tag.split(',');
    }
  },
  mounted() {
    let _this = this;
    console.log(_this.score);
  }
};
</script>
