<template>
    <section class="al-help-contact" :class="{'noneTop':appOnOff}">
            <h1 class="title">工作时间</h1>
            <p class="des">周一至周五09:00-18:00节假日除外</p>
            <div class="handle-bar">
                <span class="label">客服电话</span>
                <span class="content">010-59007006</span>
                <span class="infoBox" v-show="appOnOff">
                    <i class="line"></i>
                    <i class="icon phone"></i>
                    <i class="small-title" @click.stop="makeCustomerServicePhoneCall">呼叫</i>
                </span>
            </div>
            <div class="handle-bar">
                <span class="label">客服微信</span>
                <span class="content">weiyizs123</span>
                <span class="infoBox" v-show="appOnOff">
                    <i class="line"></i>
                        <i class="icon copy"></i>
                        <i class="small-title" @click.stop="makeCustomerServiceWeiChat">复制</i>
                    </span>
            </div>
            <h1 class="title changeTitle">非工作时间</h1>
            <div class="handle-bar" style="margin-top: 0;">
                <span class="label">邮箱</span>
                <span class="content">help@allinmed.cn</span>
            </div>
    </section>
</template>
<script>
    import  {mapActions,mapGetters} from 'vuex';
    export default {
        methods:{
            ...mapActions(['changeTitle']),
            makeCustomerServicePhoneCall(){
                if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                    appjs&&appjs.makeCustomerServicePhoneCall($.toJSON({
                        phoneNum:'01059007006'
                    }));
                }
            },
            makeCustomerServiceWeiChat(){
                if(!(typeof appjs == "undefined" || appjs == null || appjs == "")){
                    appjs&&appjs.makeCustomerServiceWeiChat($.toJSON({
                        weiChatName:'weiyizs123'
                    }));
                }

            }
        },
        computed:{
            ...mapGetters(['appOnOff','linkMe'])
        },
        mounted(){
            let t = this;
            if(t.linkMe){
                t.changeTitle('联系我们');
            }else{
                t.changeTitle('联系客服');
            }
        }
    }
</script>
