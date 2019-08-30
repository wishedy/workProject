<template>
    <section class="al-mainInner">
        <HeaderBar :headerConfig="headerConfig" style="border-bottom: 1px solid #e3e4e5;"></HeaderBar>
        <section class="al-share-view">
            <figure class="al-logo"></figure>
            <h1 class="title">唯医<i></i></h1>
            <h1 class="slogan">“值得信赖的骨科医疗平台”</h1>
        </section>
        <footer class="wakeBtn" @click.stop="awakeApp" v-text="btnContent"></footer>
    </section>
</template>
<script>
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import comm from 'static/js/comm.js';
    import Log from 'static/js/log.js';
    import commApp from 'static/js/comm.app.js';
    export default {
        data(){
            return {
                btnContent:'',
                headerConfig: {
                    title: "唯医",
                    backOnOff: true,
                    share: {
                        onOff: false
                    },
                    feedback: {
                        onOff: false
                    }
                }
            }
        },
        methods:{
            awakeApp(){
                let t = this;
                let amChannel = comm.getpara()._amChannel;
                let paraJson = comm.getpara();
                if((paraJson.userId||paraJson.columnId||paraJson.refId||paraJson.authority)&&(!(paraJson.pushScene==="recall"))){
                    commApp.appWakeUp("confirm", t.createOptions(paraJson));//唤醒app弹层
                }else if(paraJson.pushScene==="recall"){
                    comm.creatEvent({
                        triggerType:'召回h5中间页',
                        browType:'385',
                        keyword:'唤醒事件（唤醒）',
                        actionId:11611
                    });
                    commApp.appWakeUp("confirm", t.createOptions(paraJson));//唤醒app弹层
                }else{
                    commApp.appWakeUp("confirm", {
                        runAtOnce: false,
                        ios: "allinmdios://://app.allinmd.cn/applinks.html?scene=idiomScene&brochureId="+t.brochureId,
                        ios9: "http://app.allinmd.cn/applinks.html?scene=idiomScene&brochureId="+t.brochureId,
                        android:"allin://com.allin.social:75235?data={scene:2,type:81,sourceId:"+t.brochureId+"}",
                    });//唤醒app弹层
                }
            },
            createOptions(data){
                    let resultJson = {};
                    let num = 0;
                    let str = '';
                    for(let keyName in data){
                        if(num===0){
                            str+=keyName+"="+data[keyName];
                        }else{
                            str+="&"+keyName+"="+data[keyName];
                        }
                        num++;
                    }
                if(data.userId||data.columnId||data.refId||data.authority){
                    data.scene = 3;
                    data.liveType = 1;
                    resultJson.runAtOnce = false;
                    resultJson.ios = "allinmdios://://app.allinmd.cn/applinks.html?liveType=1&scene=terminalPage&"+str;
                    resultJson.ios9 = "http://app.allinmd.cn/applinks.html?liveType=1&scene=terminalPage&"+str;
                    resultJson.android = 'allin://com.allin.social:75235?data='+JSON.stringify(data);
                }else if(data.pushScene==="recall"){
                    resultJson.ios = "allinmdios://://app.allinmd.cn/applinks.html?"+str;
                    resultJson.ios9 = "http://app.allinmd.cn/applinks.html?"+str;
                    resultJson.android = 'allin://com.allin.social:75235?data='+JSON.stringify(data);
                }
                return resultJson;
            }
        },
        computed:{
            brochureId(){
                let t = this;
                return comm.getpara().brochureId;
            }
        },
        components:{
            HeaderBar
        },
        mounted(){
            let t = this;
            let paraJson = comm.getpara();
            if((paraJson.userId||paraJson.columnId||paraJson.refId||paraJson.authority)&&(!(paraJson.pushScene==="recall"))){
                   t.btnContent = '更多精彩内容，打开唯医骨科APP查看';
            }else if(paraJson.pushScene==="recall"){
                Log.createBrowse(385,'召回h5中间页',window.location.href);
                t.btnContent = '安装唯医骨科';
            }else{
                t.btnContent = '更多精彩内容，打开唯医骨科APP查看';
            }
            /*?scene=terminalPage&index=0&sourceId=1234567890&tplPath=1*/
        }
    }
</script>
<style lang="scss" rel="stylesheet">
    @import "scss/pages/commShare/commShare";
</style>
