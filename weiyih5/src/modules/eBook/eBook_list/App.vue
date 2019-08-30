<template>
    <section class="al-mainInner al-ebookMainPart">
        <WakeApp :options="wakeData"></WakeApp>
        <my-header :header-config="headerConfig"></my-header>
        <List></List>
    </section>
</template>

<script>
    import myHeader from "components/HeaderBar/HeaderBar"
    import List from "./components/List.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        data(){
            let androidParam = `{scene:3,type:103}`;
            let iosParam = `scene=3&type=103`;
            return {
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam
                },
                headerConfig:{
                    title:"书籍",
                    backOnOff:true
                }
            }
        },
        components:{
            myHeader,
            List,
            WakeApp
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/eBook/eBook_list";
</style>
