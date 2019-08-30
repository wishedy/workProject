<template>
    <section class="al-mainInner" style="padding-bottom: 0">
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
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
        methods: {

        },
        watch:{

        },
        mounted(){
            window.location.href = 'https://m.allinmd.cn/dist/buyHelp/buyHelp.html#/buyHelp';
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/payHelp/payHelp.scss";
</style>


