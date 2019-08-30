<template>
  <section class="al-mainInner">
    <MeetingText></MeetingText>
  </section>
</template>
<script type="text/ecmascript-6">
    import MeetingText from "./components/meetingIndex.vue";
    export default {
        components: {
            MeetingText
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "scss/pages/meeting/meeting_index.scss";
  @import "scss/pages/index/hotest_index.scss";
</style>

