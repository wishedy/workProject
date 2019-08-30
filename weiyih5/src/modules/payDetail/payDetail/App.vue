<template>
    <section class="al-mainInner">
        <payDetailCon></payDetailCon>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import payDetailCon from '../payDetail/components/payDetail.vue'
    window.shareAll = shareAll;
    export default {
        components: {
            payDetailCon
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
    @import "scss/pages/payDetail/payDetail.scss";
</style>


