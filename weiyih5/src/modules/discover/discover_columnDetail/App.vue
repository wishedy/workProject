<template>
    <section class="al-mainInner boneClassCont">
        <WakeApp :options="wakeData"></WakeApp>
        <my-header></my-header>
        <my-details></my-details>
        <my-lecturer></my-lecturer>
        <my-filter></my-filter>
        <my-list></my-list>
        <MonoLayer :confirmOption="confirmOption" @ensureClickEvent="ensure" @cancelClickEvent="cancel"></MonoLayer>
    </section>
</template>

<script>
    import myHeader from "./components/Header.vue";
    import myDetails from "./components/Details";
    import myLecturer from "./components/Lecturer";
    import myFilter from "./components/Filter";
    import myList from "./components/List";
    import MonoLayer from "components/MonoLayer/MonoLayer.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        data(){
            return {
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                confirmOption:""
            }
        },
        components:{
            myHeader,
            myDetails,
            myLecturer,
            myFilter,
            myList,
            MonoLayer,
            WakeApp
        },
        methods:{
            "ensure"() {
                let t = this;
                t.$store.state.confirmOption = "1";
            },
            "cancel"() {
                let t = this;
                t.$store.state.confirmOption = "0";
            },
            scroll(){
                let distance = document.getElementById('nav').offsetTop+150;
                window.onscroll=()=>{
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    if(top>0){
                        this.$store.state.header = "1";
                    }
                    if(top==0){
                        this.$store.state.header = "0";
                    }
                    if(top>distance){
                        this.$store.state.nav = "1";
                    }else{
                        this.$store.state.nav = "0";
                    }
                }
            }
        },
        watch: {
            "$store.state.confirmOption" () {
                let t = this;
                t.confirmOption = t.$store.state.confirmOption;
            },
        },
        mounted(){
            this.scroll();
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/discover/discover/bone_class";
</style>
