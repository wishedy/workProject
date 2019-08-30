<template>
    <section class="al-mainInner">
        <router-view></router-view>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    window.shareAll = shareAll;
    import {mapGetters} from 'vuex';
    import $ from 'jquery';
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
            ...mapGetters(['rightOnOff'])
        },
        methods: {

        },
        watch:{
            rightOnOff(n){
                if(n){
                    $('html,body').animate({scrollTop: '0px'}, 0).css("overflow",'hidden');
                }else{
                    $('html,body').css("overflow",'auto');
                }
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/consumeCourse/consumeCourse.scss";
</style>


