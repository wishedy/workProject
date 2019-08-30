<template>
    <section class="al-mainInner">
        <router-view></router-view>
    </section>
</template>
<script type="text/ecmascript-6">
    import comm from 'static/js/comm.js';
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    export default  {
        data(){
            return {

            }
        }
    }
</script>
<style lang="scss">
 @import "scss/pages/surgicalLecture/surgicalLecture";
</style>
