<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <my-header :header-config="headerConfig"></my-header>
        <Contents></Contents>
    </section>
</template>

<script>
    import myHeader from "components/HeaderBar/HeaderBar.vue";
    import Contents from "./components/Contents.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default{
        data(){
            return {
                headerConfig:{
                    title:"译者",
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
            Contents,
            WakeApp
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/eBook/eBook_transformerList";
    .al-mainInner{
        overflow:inherit;
    }
</style>
