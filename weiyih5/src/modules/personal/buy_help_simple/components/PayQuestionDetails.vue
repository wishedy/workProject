<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>
        <section class="al-payDetails-container">
            <h1 class="de-title">购买课程如何开发票</h1>
            <p class="invoice-details">
                发票详情：<br>
                1、兑换的课程不支持开发票<br>
                2、暂时不支持开电子发票<br>
                3、开具发票金额为实付金额
            </p>
            <p>发票类型：信息服务费</p>
            <p>发票明细：增值税普通发票、增值税专用发票</p>
            <p>
                开票周期：<br>
                建议在付费后30天内开具发票
            </p>
            <p>
                发票将于您留下信息后的10个工作日内，安排寄送（暂不支持港、澳、台地区邮寄）
                如需开票，请拨打下方我们的客服热线01059007006或者添加我们的客服微信weiyizs123。工作人员会为您记录开票信息。
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
                        onOff: true,
                        params: {
                            sceneType:101,
                            customerId:TempCache.getItem('userId') || '',
                            questionTitle:'购买课程如何开发票',
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
            this.headerConfig.title = '购买课程如何开发票';
            // document.title='购买课程如何开发票';
            this.checkApp();
             if (this.appPort) {
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
