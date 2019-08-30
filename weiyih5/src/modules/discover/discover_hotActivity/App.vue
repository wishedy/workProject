<template>
    <section class="al-mainInner">
        <WakeApp :options="wakeData"></WakeApp>
        <header class="al-searchHead" id="header" style="position: inherit;">
            <my-header :header-config="headerConfig"></my-header>
        </header>
        <my-content></my-content>
        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>
    </section>
</template>

<script>
    import myHeader from "components/HeaderBar/HeaderBar";
    import myContent from  "./components/Content";
    import Share from "components/Share/Share";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import comm from 'static/js/comm';
	import {shareAll} from '@allin/wap-share';
	window.shareAll = shareAll;
    export default {
        data(){
            return {
                heig:'',
                headerConfig:{
                    title:"热门活动",
                    backOnOff:true,
                },
                wakeData:{
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html",
                    ios9: "http://app.allinmd.cn/applinks.html",
                    android: "allin://com.allin.social:75235?data={}"
                },
                shareConfig:"",
                shareOnOff:true,
                shareData:{}
            }
        },
        mounted(){
            this.layout();
            this.share();
        },
        components:{
            myHeader,
            myContent,
            Share,
            WakeApp
        },
        methods:{
            layout() {
                this.heig = document.getElementById('header').offsetHeight;
            },
            share(){
            	let t= this;
				this.shareConfig = {
					initData:{

					},
					shareData:{
                        sortType: 1,
                        pageSize: 200,
                        pageIndex: 1,
                        sceneType: 18
					}
				}
            },
        }
    }
</script>

<style rel="stylesheet" lang="scss">
    @import "scss/base";
    @import "scss/pages/discover/discover_activition";
</style>
