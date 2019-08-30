<template>
    <section class="al-mainInner">
        <router-view></router-view>
        <!--<Skeleton></Skeleton>-->
    </section>
</template>

<script type="text/ecmascript-6">
    const $ = require('jquery');
    /*import Skeleton from '../../../components/Skeleton/Skeleton'*/
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    export default {
        components: {
           /* Skeleton*/
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
 @import "scss/pages/medPlus/medPlus";
</style>


