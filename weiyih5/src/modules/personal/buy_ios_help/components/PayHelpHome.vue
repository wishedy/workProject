<template>
    <!--<section class="al-payHelp">
        &lt;!&ndash;<HeaderBar :header-config="headerConfig" class="al-payHelp-header" v-show="!appPort"></HeaderBar>&ndash;&gt;
        <section class="al-payHelp-container">
            <div>
                &lt;!&ndash;<h3 class="pay-questions">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAAXNSR0IArs4c6QAAA4dJREFUaAXtW01rE0EYNrtJSo7RQ4hCVBqQ6EFEPFkUioIHwYPQQ0GxeiqVHCpEiEnzQRIEf4AiQk+C5OCtoqeiCCpe9GAakBKDaERIBE8paRKfKabkYz/ezCRkoLOw7O77/cwzO7uw7zr2cWyZTOZws9m8BdfZdrs97XA4DuBc4whl59KCQQ05NpFjXdO01Xg8vmnn1K939AusrvP5vHtjYyMHmzASu6xsx6ED0CbiPg4EAssLCwt1ag7y6AOUVigU1nC8MwmADBDy6tgXy+XyKwy4TgXppBqm0+m7sL1Atf9vV3S73TPRaLRq5oeitVQq9QD6ZTMbA/k5zKg45EkD3YCIxCQAnkQx6QFvGwGm1wcrgMwdNi3sL2xCGaljqOuMkaJfRgIJgEtwJLPeSQK/s7lcji1KphtjEvtlUwMTBXz0Vqt120TdIyYtPJhORQQ91uMpx8W3ZDJ51K4UKpN+u0AT0h+k5CWBxD1DXskoSUdlQ61r6PusU6DT6Twfi8XedK7Hfcxms/5Go/GTJw+JSZ7AMvkokDKxIVKLYlJk9GTyVUzKxIZILYpJkdGTyVcxKRMbIrUoJkVGTyZfxaRMbIjUopgUGT2ZfBWTMrEhUotiUmT0ZPJVTMrEhkgtikmR0ZPJVzEpExsitSgmRUZPJl/FpExsiNSyJ5jk/gi7vb39Gt/rRQZ4KF98gB3Kvtt4TzCpQHYoR3sLqRWmY290RBPDU9ZnMDU1td/lcp1CM+A92JH744xiUmXc9yQ1AbMDwJuJRGK1y+cPzj+ho4r16r3D7unSjfx07NOVMdgHcBfEysrKZ+gzu4IxnZBAopC2QP5uBgfCYAo/HxCOWEACiZysuZZrA4iClWMwGPwKPVd8THPW/2q7UUH+so1kYoAmvxMmqh1xqVRiLW3UOvpD/e4XGF1Tg783cqbIAPK6lV29Xr9qpbfRFW30O2oSSF3XH1GCGdlgSl3DKjpvpEOb6HHIs0Y6igxrxUuSHcWI2aAd9AkKZs31XBsKeoh91efzfalWq0fwmnYFgeK8jw/EWg+FQhfn5uZs70vyc9Lr9S7VajXWWzrLgxJgFtleqVR43Ht8APCHx+OZpwBkjqTpygzD4fCW3++/hNP7SLLFZJPYkHsNK/bpSCRCXgy5XtfwX8gh/BdyA8zMIuk0jmP5LwSx2fP5L+J/x/EtXgWf4QXi47CD+w95bwG6p9qEOwAAAABJRU5ErkJggg==" alt="支付问题" class="combined-shape">
                    <span class="combined-text">ios支持帮助</span>
                </h3>&ndash;&gt;
                <ul>
                    <li v-for="(item,key) in list" :key="item.id">
                        <a href="javascript:void (0)" @click="gotoDetail(item.title,item.routeName)" class="ios-pay-help">{{item.title}}</a>
                    </li>
                </ul>
            </div>
            <div class="foot-container" v-show="appPort">
                <span>
                    &lt;!&ndash;<img src="../../../../../static/images/payHelp/customs.svg" alt="客服">&ndash;&gt;
                </span>
                <a href="javascript:void (0)" @click="concatCustomer()">联系客服</a>
            </div>
        </section>
    </section>-->
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
                    title: "ios支持帮助",  //  *标题项
                    share: {            // ..自定义分享项
                        onOff: false,
                        params: {},
                        authority: 1
                    },
                    feedback: {         //..自定义反馈项
                        onOff: false
                    },
                    backOnOff: true
                },
                list: [
                    {id: 1, title: '什么是唯币', routeName: 'OpenInvoiceDetails'},
                    /*{id: 2, title: '通过苹果支付，为什么余额充值后没有立刻到账', routeName: 'AbnormalViewDetails'},*/
                    {id: 2, title: '为什么提示扣款成功，唯币却没有到账', routeName: 'payQuestionsDetails'},
                    {id: 3, title: '通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费', routeName: 'PayWeChatDetails'}
                ],
                appPort: false
            }
        },
        mounted() {
            this.checkApp();
            if (this.appPort) {
                //3.7安卓没写。ios写了，先注释
                appjs && appjs.makeCustomerShareType && appjs.makeCustomerShareType('0');
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
