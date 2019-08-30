<template>
    <section class="al-mainInner">
        <couponContent></couponContent>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import couponContent from '../couponList/components/couponContent.vue'
    window.shareAll = shareAll;
    export default {
        components: {
            couponContent,
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

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/couponList/couponList.scss";
</style>


