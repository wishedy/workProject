<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>
        <section class="al-payDetails-container">
            <h1 class="de-title">购买的课程可以下载吗</h1>
            <p>站内所有付费视频仅支持App内缓存观看。</p>
            <p>所有课程均有版权，是授课专家智力劳动成果，受法律保护，不允许个人或组织通过其他非法途径下载使用，对于侵权行为，平台将永久冻结账户，并依法追究法律责任。</p>
            <p v-show="appPort">
                仍有问题，
                可<a href="javascript:void (0);" class="concatCustom" @click='concatCustomer()'>联系客服</a>
            </p>
        </section>
    </section>
</template>

<script>
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import TempCache from "static/js/tempcache";
    import user from 'static/js/module.user.js';

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
                            sceneType: 101,
                            customerId: TempCache.getItem('userId') || '',
                            questionTitle: '购买的课程可以下载吗',
                            questionType: '5'
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
            this.headerConfig.title = '购买的课程可以下载吗';
            // document.title = '购买的课程可以下载吗';
            this.checkApp();
             if (this.appPort) {
                appjs && appjs.makeCustomerShareType && appjs.makeCustomerShareType('1');
            }
        },
        methods: {
            gotoDetail(title, routeName) {
                this.$router.push({
                    path: routeName,
                    query: {title: title}
                });
            },
            concatCustomer() {
                if (this.appPort) {
                    appjs && appjs.showPhoneCallDialog &&appjs.showPhoneCallDialog('1');
                } else {

                }

            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    return _this.appPort = true;
                } else {
                    return _this.appPort = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>
