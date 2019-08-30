<template>
    <section class="al-mainInner">
        <productCon></productCon>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import productCon from '../productClassify/components/productContent'
    window.shareAll = shareAll;
    export default {
        components: {
            productCon
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
    @import "scss/base";
    @import "scss/pages/productClassify/productClassify";
</style>


