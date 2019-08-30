<template>
  <section class="al-mainInner">
    <ContentBar></ContentBar>
  </section>
</template>

<script type="text/ecmascript-6">
    import ContentBar from "./components/Content.vue";
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    export default {
        components: {
            ContentBar
        },
    };
</script>

<!--<style lang="scss" rel="stylesheet/scss">
  @import "scss/pages/teamApply/teamApply.scss";

</style>-->
