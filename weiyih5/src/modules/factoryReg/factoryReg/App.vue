<template>
    <section>
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import TempCache from "../../../../static/js/tempcache";
    import {shareAll} from '@allin/wap-share';
    import axios from 'axios';
    window.shareAll = shareAll;
</script>
<style lang="scss" rel="stylesheet/scss">

</style>


