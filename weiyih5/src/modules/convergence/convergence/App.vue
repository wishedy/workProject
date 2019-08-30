<template>
    <section class="al-mainInner">
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    export default {
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/convergence/convergence.scss";
</style>


