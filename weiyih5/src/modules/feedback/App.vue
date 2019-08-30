<template>
  <section class="al-mainInner">
    <ContentBar></ContentBar>
  </section>
</template>

<script type="text/ecmascript-6">
    import axios from "axios"
    import ContentBar from "./components/Content.vue";
    export default {
        components: {
            ContentBar
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../../css/pages/personal/personal_fedBack.css";

</style>
