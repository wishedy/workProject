<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header-Detail" v-show="!appPort"></HeaderBar>
        <section class="al-payDetails-container">
            <h1 class="de-title">各专业学院课程、手术案例和专栏有什么区别</h1>
            <p class="invoice-details">
                1、专业学院课：在汇集行业尖端力量及核心资源的积累优势下，通过关节、创伤、运医、保膝、脊柱、肩肘、足踝七大临床学院的定向科研课题深入研究，结合场景带入并引导关键性内容的多元化教学，来构建适合各个层级的专业课程体系。<br>
                2、专栏：包含专业和非专业两大类，涵盖学术知识、医学人文、实用技能等多方面内容，且持续更新。<br>
                3、手术案例：以主刀的第一视角，为会员逐步讲解手术操作的重点与难点，海量手术视频，全年持续更新。<br>
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
                            questionTitle:'各专业学院课程、手术案例和专栏有什么区别',
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
            this.headerConfig.title = '各专业学院课程、手术案例和专栏有什么区别';
            document.title='各专业学院课程、手术案例和专栏有什么区别';
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
