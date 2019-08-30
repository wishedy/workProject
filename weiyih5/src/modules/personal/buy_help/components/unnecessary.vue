<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>
        <section class="al-payDetails-container">

            <h1 class="de-title">通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费</h1>
            <p>
                Apple扣费有时会把多笔消费累计扣除，请登录注册Apple ID的邮箱，查看Apple发给您的邮件收据，在这里会有扣费的详细信息，指明每笔扣费具体流向哪个App。<br/>
                如确实存在唯医骨科App多扣费的行为,请拨打下方我们的客服热线01059007006或者添加我们的客服微信weiyizs123，
                我们会在第一时间为您解决。
            </p>
            <p></p>
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
                        onOff: true,
                        params: {
                            sceneType:101,
                            customerId:TempCache.getItem('userId') || '',
                            questionTitle:'通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费',
                            questionType:'2'
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
            this.headerConfig.title = '通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费';
            document.title='通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费';
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
