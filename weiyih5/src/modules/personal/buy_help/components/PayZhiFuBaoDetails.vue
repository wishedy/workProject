<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" ></HeaderBar>
        <section class="al-payDetails-container">
            <h1 class="de-title">标题</h1>
            <p>中国骨科菁英会是由中国人民解放军总医院骨科主任王岩教授于2014年创始的骨科青年菁英协会。</p>
            <p>菁英会旨在通过专业知识的分享与传递，领导 力的培养，不断发掘和培养中国骨科未来的领 军人才，带领中国骨科走向更高层次的国际舞 台，使中国骨科成为世界舞台上不可或缺的重 要力量。</p>
            <p>菁英会旨在通过专业知识的分享与传递，领导 力的培养，不断发掘和培养中国骨科未来的领 军人才，带领中国骨科走向更高层次的国际舞 台，使中国骨科成为世界舞台上不可或缺的重 要力量。</p>
            <p>
                仍有问题，
                可<a href="javascript:void (0);" class="concatCustom"  @click="concatCustomer()">联系客服</a>
            </p>
        </section>
    </section>
</template>

<script>
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';
    import TempCache from "static/js/tempcache";
    export default {
        components:{
            HeaderBar
        },
        data(){
            return{
                headerConfig:{
                    title:"购买帮助",  //  *标题项
                    share:{            // ..自定义分享项
                        onOff:false,
                        params: {},
                        authority:1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff:true,
                    editOnOff:true
                },
                appPort:true
            }
        },
        mounted() {
            // this.headerConfig.title=decodeURIComponent(this.$route.query.title);
            this.headerConfig.title = '购买课程如何开发票';
            document.title='购买课程如何开发票';
        },
        methods:{
            concatCustomer() {
                if (this.appPort) {
                    appjs && appjs.showPhoneCallDialog();
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