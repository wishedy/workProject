<template>
    <div class="playBackTitleWrap">
        <section class="smallTitle playBackTitle" v-text="'回播：'+liveTitle" v-show="liveTitle"></section>
    </div>
</template>
<script>
    import comm from 'static/js/comm.js';
    import {mapGetters} from 'vuex';
    export default {
        computed:{
            ...mapGetters(['conSubInfo']),
            liveTitle(){
                let _this = this;
                return comm.checkInvalid(_this.conSubInfo.conSubName)?'':_this.conSubInfo.conSubName;
            }
        }
    }
</script>