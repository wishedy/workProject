<template><!--会议预告页面-->
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <!-- 头部信息开始 -->
        <!-- 头部信息开始 -->
        <header-bar :headerConfig="headerConfig"></header-bar >
        <!-- 头部信息结束 -->
        <!-- 头部信息结束 -->
        <!--页面主内容开始-->
        <list-content></list-content>

    </section>
</template>

<script>
    import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
    import ListContent from './components/ListContent.vue';
    import {mapGetters} from "vuex";
    import TempCache from "static/js/tempcache.js";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        data(){
            let androidParam = `{scene:3,type:105}`;
            let iosParam = `scene=3&type=105`;
            return {
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam
                },
                headerConfig:{
                    title:"会议预告",
                    backOnOff:true,
                    share:{
                        onOff:true,
                        params: {
                            resourceType: 3,
                            sceneType: 2,
                            openTime: new Date().getFullYear() + '-' + (this.$store.state.nowMouth > 9 ? this.$store.state.nowMouth : '0' +this.$store.state.nowMouth),
                            platformId: TempCache.getItem('department') || 1
                        }
                    },
                }
            }
        },
        components:{
            HeaderBar,
            ListContent,
            WakeApp
        },
        computed:{
            ...mapGetters(['nowMouth']),
        },
        watch:{
            nowMouth(){
                let t=this;
                t.headerConfig.share.params.openTime=new Date().getFullYear() + '-' + (this.nowMouth > 9 ? this.nowMouth : '0' +this.nowMouth);
            },

        },
    }
</script>

<style>

</style>
