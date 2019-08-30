<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <header class="discoverV2Header">
            <Search></Search>
        </header>
        <Entry></Entry>
        <List></List>
        <PublicFooter :isActive="1"></PublicFooter>
        <FollowLayer @ensureClickEvent="ensure" @cancelClickEvent="cancel"></FollowLayer>
    </section>
</template>

<script type="text/ecmascript-6">
    import Search from "components/Search/Search";
    import Entry from "./components/Entry";
    import List from "./components/List";
    import PublicFooter from "components/Footer/Footer";
    import FollowLayer from "components/FollowLayer/FollowLayer.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import {mapActions} from "vuex";
    export default {
        data(){
            return {
                confirmOption:"",
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                }
            }
        },
        components:{
            Search,
            Entry,
            List,
            PublicFooter,
            FollowLayer,
            WakeApp
        },
        methods: {
            "ensure"() {
                this.changeEn(true);
                this.change(false);
            },
            "cancel"() {
                this.change(false);
            },
            ...mapActions(["change","changeEn"]),
        }
    };
</script>
<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/discover/discover/discover_indexV2";
</style>

