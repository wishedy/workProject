<template>
    <section class="al-mainInner boneClassCont">
        <WakeApp :options="wakeData"></WakeApp>
        <my-header :header-config="headerConfig"></my-header>
        <my-content></my-content>
        <FollowLayer @ensureClickEvent="ensure" @cancelClickEvent="cancel"></FollowLayer>
    </section>
</template>

<script>
    import myHeader from "components/HeaderBar/HeaderBar"
    import myContent from "./components/Content"
    import comm from "static/js/comm"
    import FollowLayer from "components/FollowLayer/FollowLayer";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import {mapActions} from 'vuex';
    export default {
        data(){
            return{
                headerConfig:{
                    title:'特色栏目',
                    backOnOff:true

                },
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                }
            }
        },
        components:{
            myHeader,
            myContent,
            FollowLayer,
            WakeApp
        },
        methods: {
            "ensure"() {
                this.change(false);
                this.changeEn(true);
            },
            "cancel"() {
                this.change(false);
            },
            ...mapActions(["change","changeEn"]),
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import 'scss/base';
    @import 'scss/pages/discover/discover/discover_indexV2';
</style>
