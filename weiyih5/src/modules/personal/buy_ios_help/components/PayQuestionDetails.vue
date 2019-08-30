<template>
    <section class="al-payHelp">
        <!--<HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>-->
        <section class="al-payDetails-container">
            <h1 class="de-title">为什么提示扣款成功，唯币却没有到账</h1>
            <p class="invoice-details">
                1. 因Apple支付服务需要时间完成验证，故唯币充值存在极短时间延迟的可能，请您耐心等待。<br/>
                2. 请检查您当前账户和充值的账户是否一致，您可对照查看用户名或者播放历史等信息。<br/>
                3. 尝试退出唯医骨科App，再次进入我的-余额。<br/>
                4. 如果完成充值1小时后，唯币仍未到账。<br/>
            </p>
            <p>
                请拨打唯医骨科官方客服热线 010-59007006 <br/>
                或者添加唯医骨科官方客服微信 weiyizs123，<br/>
                我们会在第一时间为您核实支付情况并为您的账户添加对应的唯币。
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
                    title: "",  //  *标题项
                    share: {            // ..自定义分享项
                        onOff: false,
                        params: {
                            sceneType:101,
                            customerId:TempCache.getItem('userId') || '',
                            questionTitle:'为什么提示扣款成功，唯币却没有到账',
                            questionType:'1'
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
            this.headerConfig.title = '为什么提示扣款成功，唯币却没有到账';
            document.title='为什么提示扣款成功，唯币却没有到账';
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
