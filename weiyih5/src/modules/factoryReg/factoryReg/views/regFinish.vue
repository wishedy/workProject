<template>
    <section class="regFinish">
        <FactoryHeader :title="title"></FactoryHeader>
        <section>
            <aside class="regFinish-form">
                <div class="regFinish-img-center">
                    <img src="/static/images/factoryReg/group.png" alt="">
                </div>
                <div class="regFinish-text" v-if="isRegister">
                    恭喜您完成注册，立即登录唯医骨科app完成认证
                </div>
                <div class="regFinish-text" v-if="!isRegister">
                    立即登录唯医骨科app完成认证
                </div>
                <div class="regFinish-btn-center">
                    <button class="regFinish-btn-openApp" @click="createAccount">打开唯医骨科APP</button>
                </div>
            </aside>
        </section>

    </section>
</template>

<script>
    import FactoryHeader from '../components/Header.vue';
    import commApp from 'static/js/comm.app.js';
    const regFinish = {
        data(){
            return {
                title: '完成注册',
                isRegister: true
            }
        },
        components: {FactoryHeader: FactoryHeader},
        mounted(){
            if(this.$route.query.source === "v2login" || this.$route.query.source === "v2login_doc"){
                this.isRegister = false;
                this.title = '厂商认证';
            }
        },
        methods: {
            createAccount(){
                comm.creatEvent({
                    triggerType:'完成注册页',
                    triggerName:'打开唯医骨科app点击',
                    actionId:11705,
                    browType:399
                });

                let androidParam = `{}`;
                let iosParam = ``;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    runAtOnce: false
                };
                commApp.appWakeUp("confirm", callAppOptions);//唤醒app弹层
            }
        }

    }

    export default regFinish;

</script>

<style lang="scss" scoped rel="stylesheet/scss">
    .regFinish{
        .regFinish-form{
            margin-top: 43px;
            .regFinish-img-center{
                text-align:center;
                img{
                    width: 85px;
                    height: 76px;
                }
            }
            .regFinish-text{
                width:320px;
                height:28px;
                font-size:20px;
                font-family:PingFangSC-Medium;
                font-weight:500;
                color:#222222;
                line-height:28px;
                text-align: center;
                margin: 0 auto;
                margin-top: 44px;
                font-weight: bold;
            }

            .regFinish-btn-center{
                text-align:center;
                margin-top: 32px;
            }

            .regFinish-btn-openApp{
                margin-top: 28px;
                font-size: 17px;
                line-height: 52px;
                width: 345px;
                height: 52px;
                background:#6483E9;
                border-radius:3px;
                color: #fff;
                font-weight: bold;
            }
            .regFinish-btn-openApp::after {
                position: relative;
                top: 17px;
                content: ' ';
                float: right;
                background: url(/static/images/factoryReg/openAppIcon2x.png);
                background-size: 18px 18px;
                width: 18px;
                height: 18px;
                right: 92px;
            }

        }
    }

</style>