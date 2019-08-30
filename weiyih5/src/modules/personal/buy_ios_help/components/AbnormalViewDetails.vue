<template>
    <section class="al-payHelp">
       <!-- <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>-->
        <section class="al-payDetails-container">
            <h1 class="de-title">通过苹果支付，为什么余额充值后没有立刻到账</h1>
            <p>

                因Apple支付服务在国外，需要时间验证等待，充值后没有显示请不要急于二次支付，请在24h内查看充值结果，偶尔可能会小概率出现支付验证延迟或失败等情况，如果遇到款项已支付但是余额未充值上的情况，我们会在24小时向苹果服务端反复确认你的订单支付状态。

            </p>
            <p v-show="appPort">
                仍有问题，
                可<a href="javascript:void (0);" class="concatCustom" @click="concatCustomer()">联系客服</a>
            </p>
        </section>
    </section>
</template>

<script>
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import TempCache from "static/js/tempcache";
    export default {
        components: {
            HeaderBar
        },
        data() {
            return {
                headerConfig: {
                    title: "购买帮助",  //  *标题项
                    share: {            // ..自定义分享项
                        onOff: false,
                        params: {
                            sceneType:101,
                            customerId:TempCache.getItem('userId') || '',
                            questionTitle:'通过苹果支付，为什么余额充值后没有立刻到账',
                            questionType:'3'
                        },
                        authority: 1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff: true,
                    editOnOff: false
                },
                appPort: true
            }
        },
        mounted() {
            // this.headerConfig.title = decodeURIComponent(this.$route.query.title);
            this.headerConfig.title = '通过苹果支付，为什么余额充值后没有立刻到账';
            document.title='通过苹果支付，为什么余额充值后没有立刻到账';
            this.checkApp();
             if (this.appPort) {
                 //3.7安卓没写。ios写了，先注释
                appjs && appjs.makeCustomerShareType && appjs.makeCustomerShareType('1');
            }
        },
        methods: {
            concatCustomer() {
                if (this.appPort) {
                    appjs && appjs.showPhoneCallDialog && appjs.showPhoneCallDialog('1');
                } else {
                    return false;
                }

            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                } else {
                    _this.appPort = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>
