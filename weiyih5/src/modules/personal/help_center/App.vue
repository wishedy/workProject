<template>
    <section class="al-mainInner" :class="{'whiteBg':($route.name==='precautions')||($route.name==='specification')||($route.name==='standard')}">
        <HeaderBar :headerConfig="headerConfig" v-show="showHeader"></HeaderBar>
        <router-view></router-view>
    </section>
</template>

<script>
    const $ = require('jquery');
    import FastClick from "fastclick";
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import comm from 'static/js/comm.js';
    import {mapGetters} from 'vuex';
    window.FastClick = FastClick;
    FastClick.attach(document.body);
    export default {
        data(){
            let t = this;
            return {
                headerConfig: {
                    title: "帮助中心",
                    backOnOff: true,
                    share: {
                        title:"&nbsp;",
                        onOff: true,
                        params: {
                            'questionType':0,
                            "sceneType": "84",
                            "platformId": 1,
                            'customerId':t.customerId
                        }
                    },
                    feedback: {
                        onOff: false
                    }
                },
                showHeader:false
            }
        },
        components:{
            HeaderBar
        },
        computed:{
            ...mapGetters(['headerTitle','scrollTop']),
            customerId(){
                return comm.getpara().customerId;
            }
        },
        methods: {
            shareMethods(name){
                let t = this;
                switch (name) {
                    case 'index':
                        t.headerConfig.share.params.questionType = 0;
                        t.headerConfig.share.onOff = false;
                        break;
                    case 'advisory':
                        t.headerConfig.share.params.questionType = 3;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'standard':
                        t.headerConfig.share.params.questionType = 7;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'specification':
                        t.headerConfig.share.params.questionType = 6;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'precautions':
                        t.headerConfig.share.params.questionType = 5;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'practiceIntroduction':
                        t.headerConfig.share.params.questionType = 8;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'aboutUs':
                        t.headerConfig.share.params.questionType = 9;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'contactCustomerService':
                        t.headerConfig.share.params.questionType = 10;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'income':
                        t.headerConfig.share.params.questionType = 4;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'open':
                        t.headerConfig.share.params.questionType = 2;
                        t.headerConfig.share.onOff = true;
                        break;
                    case 'settled':
                        t.headerConfig.share.params.questionType = 1;
                        t.headerConfig.share.onOff = true;
                        /*makeCustomerShareType*/
                        break;

                }
                if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                    appjs.makeCustomerShareType&&appjs.makeCustomerShareType(t.headerConfig.share.params.questionType+'');
                }
            }
        },
        watch:{
            headerTitle(n){
                let t = this;
                t.headerConfig.title = n;
            },
            '$route'(n){
                let t = this;
                if(n.name!='index'){
                    $(document).scrollTop(0);
                }else{
                    $('html,body',document).animate({scrollTop: t.scrollTop}, 0);
                }
                t.shareMethods(n.name);
            }
        },
        mounted(){
            let t = this;
            if(typeof appjs == "undefined" || appjs == null || appjs == ""){
                t.showHeader = true;
            }else{
                t.showHeader = false;
            }
            t.shareMethods(t.$route.name);
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/pages/personal/help_center";
    .whiteBg{
        background: #fff !important;
    }
</style>
