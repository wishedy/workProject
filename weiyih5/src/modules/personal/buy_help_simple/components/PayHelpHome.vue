<template>
    <section class="al-payHelp">
        <HeaderBar :header-config="headerConfig" class="al-payHelp-header" v-show="!appPort"></HeaderBar>
        <section class="al-payHelp-container">
            <div>
                <h3 class="pay-questions">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAABMCAYAAADHl1ErAAAAAXNSR0IArs4c6QAAAwRJREFUeAHt3MGLElEcB3BnmhBhoZPNEHusv6GFtr+hTu6lY+TB9lRgoqZmgtLZgx067SW71GU7Bq3ERreO0qHDEkN4jERctd9vdmYZ5O3seyMSz/kOiDPv/X7K78N7M7Orz1QKGwQgAAEIQAACEIDA/xAwlt+00WjcWywWD6h9hx4OPazlmA0/PqX6XHocG4ZxUKvVPoTrPQfrdDo3xuPxW+rcDQdgPzXIZDJ7xWLxF1t4YD7WVzreBpBQ4ITQbjOayd3+yAKW0Mpr3PaNUoZ/znp/cSx6AgE6p903/RN80IbnCAG24inJV0NscgI7DMa3DtjkBBwGS9p9lhyNOMryrpLiPrSKBAAmUoloA1gEjqgLYCKViDaAReCIugAmUoloA1gEDrogAAEIbJqAUa/XF5tW1DrrwVVSURdgAFMUUAzHCAOYooBiOEYYwBQFFMMxwgCmKKAYjhEGMEUBxXDdP5M8TKfThVKp9FO27n6/f2U4HN6ZzWZ9+ujfls0L4nSekr+z2eyeChYXncvlZpVK5TPtvgoQVJ61BaNv0rwoFAp/VIpdio01u3QF++E4zuslAOnDXq93labjQ+mEUKCWYKZplvP5/DRUh9Ku67qPKOGmUpIfrB0YTcVv1Wr1XZxiOafb7W7R6HoeN187MCq0SGix/0s8Go2e0mtcTwQYQX2kr4F/iltsq9WyaXQ9iZvPeTqNsLllWc9WKXY6nfJU3FrlNXQC+1Iul7/HLbbZbN6iXD7Zr7TpBMYrNGJv8/m8Rcmx7r3Cb6rVx2x0O7Fv2/YbuqX4Gy4iar/dbl+bTCaP6dz1MipOtk8rMNmi1hmn05Rcp4P0awNMmuosEGAxwFa6+ii+n+7hpzzCeDElNjkBl8GO5WIRxVYm/X12AAo5AbbyVuTSd8SOKGVXLi2xUQNyuutdJXlNMzGcJJbi8sJ5CTMbnf23gtcy85pmOh5cnpu4CF4k76335srPf1UgYMDPMKT4NuvCn2EInPAMAQhAAAIQgAAEIAABCEAAAhCQFfgHb8mwQEBn1hwAAAAASUVORK5CYII=" alt="支付问题" class="combined-shape">
                    <span class="combined-text">支付问题</span>
                </h3>
                <ul>
                    <li v-for="(item,key) in list" :key="item.id">
                        <a href="javascript:void (0)" @click="gotoDetail(item.title,item.routeName)">{{item.title}}</a>
                    </li>
                </ul>
            </div>
            <div>
                <h3 class="pay-questions">
                    <img src="data:image/png;base64,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" alt="常见问题"
                         class="combined-shape">
                    <span class="combined-text">常见问题</span>
                </h3>
                <ul>
                    <li v-for="(item,key) in questionList" :key="item.id">
                        <a href="javascript:void (0)" @click="gotoDetail(item.title,item.routeName)">{{item.title}}</a>
                        <span class="arrowUp"></span>
                    </li>
                </ul>
            </div>
            <div class="foot-container" v-show="appPort">
                <span>
                    <!--<img src="../../../../../static/images/payHelp/customs.svg" alt="客服">-->
                </span>
                <a href="javascript:void (0)" @click="concatCustomer()">联系客服</a>
            </div>
        </section>
    </section>
</template>
<script>
    import HeaderBar from '../../../../components/HeaderBar/HeaderBar';

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
                        params: {},
                        authority: 1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: true
                    },
                    backOnOff: true
                },
                list: [
                    {id: 1, title: '购买课程如何开发票', routeName: 'payQuestionsDetails'},
                    {id: 2, title: '优惠券使用规则是什么', routeName: 'PayWeChatDetails'},
                    // {id: 3, title: '如何使用支付宝支付', routeName: 'PayZhiFuBaoDetails'}
                ],
                questionList: [
                    {id: 1, title: '支付成功之后无法观看付费课程', routeName: 'AbnormalViewDetails'},
                    {id: 2, title: '关于课程更新', routeName: 'OpenInvoiceDetails'},
                    {id: 3, title: '购买的课程可以下载吗', routeName: 'RefundDetails'}
                ],
                appPort: false
            }
        },
        mounted() {
            this.checkApp();
            if (this.appPort) {
                appjs && appjs.makeCustomerShareType &&appjs.makeCustomerShareType('0');
            }
        },
        methods: {
            gotoDetail(title, routeName) {
                this.$router.push({
                    path: routeName,
                    // query: {title: encodeURIComponent(title)}
                });
            },
            concatCustomer() {
                if (this.appPort) {
                    appjs && appjs.showPhoneCallDialog && appjs.showPhoneCallDialog('0');
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
