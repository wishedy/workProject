<template>
    <section class="al-payHelp">
        <!--<HeaderBar :header-config="headerConfig" v-show="!appPort"></HeaderBar>-->
        <div class="buy-container">
            <div class="question-item">
                <h1 class="title">
                    一、什么是唯币
                </h1>
                <p class="content">
                    唯币是唯医骨科平台的虚拟货币，用于购买平台内的付费内容。唯币只能消费，不能提现或转让。唯币仅限iOS系统消费，无法在其他系统使用。
                </p>
            </div>
            <div class="question-item">
                <h1 class="title">
                    二、为什么提示扣款成功，唯币却没有到账
                </h1>
                <p class="content">
                    1. 因Apple支付服务需要时间完成验证，故唯币充值存在极短时间延迟的可能，请您耐心等待。<br/>
                    2. 请检查您当前账户和充值的账户是否一致，您可对照查看用户名或者播放历史等信息。<br/>
                    3. 尝试退出唯医骨科App，再次进入我的-余额。<br/>
                    4. 如果完成充值1小时后，唯币仍未到账。<br/>
                    请拨打唯医骨科官方客服热线 010-59007006 <br/>
                    或者添加唯医骨科官方客服微信 weiyizs123，<br/>
                    我们会在第一时间为您核实支付情况并为您的账户添加对应的唯币。
                </p>
            </div>
            <div class="question-item">
                <h1 class="title">
                    三、通过苹果支付，为何实际扣费比充值金额多，是否造成多扣费
                </h1>
                <p class="content">
                    Apple扣费有时会把多笔消费累计扣除，请登录注册Apple ID的邮箱，查看Apple发给您的邮件收据，在这里会有扣费的详细信息，指明每笔扣费具体流向哪个App。<br/>

                </p>
            </div>
            <div class="question-item">
                <h1 class="title">
                    四、如何操作
                </h1>
            </div>
            <div class="items">
                <div class="outer outer-one outer-one-top">
                    <div class="sidebar">
                        <span class="order-number order-number-1"></span>
                    </div>
                    <div class="content">
                        检查ios版本更新至10.1.1及以上：<br>
                        (步骤：设置-通用-关于本机)，如下图：
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img1"></div>
                </div>
            </div>
            <div class="items">
                <div class="outer">
                    <div class="sidebar">
                        <span class="order-number order-number-2">2</span>
                    </div>
                    <div class="content">
                        打开苹果App Store
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img2">

                    </div>
                </div>
            </div>
            <div class="items">
                <div class="outer">
                    <div class="sidebar">
                        <span class="order-number order-number-3">3</span>
                    </div>
                    <div class="content">
                        进入App Store，点击“App”滑动到底部“快速链接”，选择“绑定支付宝、微信支付或者银联卡”
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img3">

                    </div>
                </div>
            </div>
            <div class="items">
                <div class="outer">
                    <div class="sidebar">
                        <span class="order-number order-number-4">4</span>
                    </div>
                    <div class="content">
                        选择您常用的支付账户，可填写支付宝账户或授权微信支付、银联卡等完成账户绑定，如下图：
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img4">

                    </div>
                </div>
            </div>
            <div class="items">
                <div class="outer">
                    <div class="sidebar">
                        <span class="order-number order-number-5">5</span>
                    </div>
                    <div class="content">
                        返回“唯医骨科”app，在“支付详情”中进行支付，如下图：
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img5">

                    </div>
                </div>
            </div>
            <div class="items">
                <div class="outer">
                    <div class="sidebar">
                        <span class="order-number order-number-6">6</span>
                    </div>
                    <div class="content">
                        按照系统提示，输入AppleID等信息 ，如下图：
                    </div>
                </div>
                <div class="img-container">
                    <div class="img img6">

                    </div>
                </div>
            </div>
            <div class="items items-last">
                <div class="outer outer-last">
                    <div class="sidebar">
                        <span class="order-number order-number-last"></span>
                    </div>
                    <div class="content">
                        购买完成就可以去购买感兴趣的内容啦~
                    </div>
                </div>
            </div>

        </div>
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
                    title: "苹果充值帮助",  //  *标题项
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
                appPort:true
            }
        },
        mounted(){
            this.checkApp();
        },
        methods:{
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
