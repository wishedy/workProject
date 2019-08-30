<template>
    <section class="al-mainInner">
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import {mapActions} from  'vuex';
    import comm from 'static/js/comm.js';
    window.shareAll = shareAll;
    export default {
        components: {

        },
        data(){
            return {

            }
        },
        beforeMount(){
        },
        computed:{

        },
        mounted(){
            let _this = this;
            _this.isWeiXin(comm.isWeiXin());
            _this.isIOS(comm.browser.versions.ios);

        },
        methods: {
            ...mapActions(['isWeiXin',"isIOS"])
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/downApp/downApp.scss";
</style>


