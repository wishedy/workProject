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

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
 @import "scss/pages/buyHelp/buyHelp";
</style>


