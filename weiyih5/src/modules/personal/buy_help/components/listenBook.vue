<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>
        <section class="al-payDetails-container">
            <h1 class="de-title">会员可以免费听所有付费课程吗</h1>
            <p class="invoice-details">
                1、 会员不支持免费听所有付费课程。<br>
                2、 唯医学院包含七大专业学院，单专业会员只可免费学习所对应学院的付费课程。此外，专栏课程和手术案例，需额外付费。<br>
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
                            questionTitle:'会员可以免费听所有付费课程吗',
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
            this.headerConfig.title = '会员可以免费听所有付费课程吗';
            document.title='会员可以免费听所有付费课程吗';
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
