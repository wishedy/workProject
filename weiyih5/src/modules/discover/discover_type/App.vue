<template>
  <section class="al-mainInner">
    <DiscoverProContent></DiscoverProContent>
  </section>
</template>

<script type="text/ecmascript-6">
    import axios from "axios"
    import DiscoverProContent from "./components/discoverTypeContent.vue";
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        components: {
            DiscoverProContent
        }
    };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "scss/base";
  @import "scss/pages/discover/discover_type";
  .al-mainInner{
    padding-bottom: 0;
  }
</style>
