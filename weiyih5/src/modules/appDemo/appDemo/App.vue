<template>
    <section class="al-mainInner">
        <div class="loginApp" @click.stop="loginApp">登录app</div>
        <div class="test-special">打开专题页测试</div>
        <div class="test-special">打开活动页测试</div>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    const vConsole = require('vconsole');
    window.shareAll = shareAll;
    import comm from 'static/js/comm.js';
    new vConsole();
    export default {
        components: {

        },
        data(){
            return {
                msg:'1111'
            }
        },
        beforeMount(){
        },
        computed:{

        },
        methods: {
            loginApp(){
                appjs&&appjs.joinAuthority(JSON.stringify(
                    {
                        callback:"callBack",
                        operateId:1002,
                    }
                ));
            },
            callBack(option){
                console.log(option);
                if(option.type==0){
                    //console.log("不分成功与失败");
                }else if(option.type==1){
                   // console.log('只有授权成功的时候掉');
                }
            }
        },
        mounted(){
            window.callBack = this.callBack;
            let androidParam = `{scene:3,type:53,linkUrl://m.allinmd.cn/html/m/theme/1551861106198/theme_index.html?alcode=a2.197.412.1.jyjqkkf7,linkName:《手术精讲》| 孙垂国：胸椎管狭窄症手术技术}`;
            let iosParam = `scene=11&type=53&linkUrl=${encodeURIComponent("//m.allinmd.cn/html/m/theme/1551861106198/theme_index.html?alcode=a2.197.412.1.jyjqkkf7")}&linkName=《手术精讲》| 孙垂国：胸椎管狭窄症手术技术`;
            console.log({
                el: ".test-special",
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam,
                runAtOnce:false
            })
            comm.bindCallApp({
                el: ".test-special",
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam,
                runAtOnce:false
            });
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
        .test-special,.loginApp{
            width: 100px;
            height: 40px;
            border-radius: 6px;
            background: #0a74c6;
            color: #fff;
            line-height: 40px;
            text-align: center;
            margin: 30px auto;
        }
</style>


