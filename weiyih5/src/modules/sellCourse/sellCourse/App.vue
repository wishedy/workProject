<template>
    <section class="al-mainInner">
        <section class="al-sell-container default" v-show="pageType===0">
            <section class="course-banner"></section>
            <section class="vip-right"></section>
            <section class="discounts"></section>
            <section class="video-banner">
                <section class="content">
                    <section class="video-content">
                        <i class="playIcon"></i>
                        <AboutCourseVideoBanner></AboutCourseVideoBanner>
                    </section>
                </section>
            </section>
            <section class="light-port"></section>
            <section class="outline">
                <div class="btn" @click.stop="learnDetail">查看全部课程</div>
            </section>
            <section class="award"></section>
            <section class="learn-more"></section>
            <section class="al-sell-handle" v-if="buyStateEnd&&(!bought)">
            <span class="al-handle-money">
                <span class="money-content">
                    <i class="money-sign">￥</i>
                    <em>698</em>
                    <em class="time-valid">前200名限时特惠价</em>
                </span>
                <span class="original-money">
                    <i>￥998</i>
                    <em></em>
                </span>
            </span>
                <span class="al-handle-buy" @click.stop="checkState">立即购买</span>
            </section>
            <section class="al-sell-handle bought" v-if="buyStateEnd&&(bought)" @click.stop="jumpCourse">
            立即学习
            </section>
        </section>
        <section class="al-sell-container success" v-show="pageType===1">
            <section class="al-sell-sign">
                <section class="success-logo"></section>
                <section class="sell-des">支付成功</section>
                <article class="sell-open-des">赶快打开App去查看保膝学院精彩课程吧~</article>
                <section class="ml-sellSuccess-btn" @click.stop="wakeApp">立即打开</section>
            </section>
        </section>
        <section class="al-sell-container list" v-show="pageType===2" @click.stop="resetPage">
            <section class="wrapper">
                <img src="//img50.allinmd.cn/v3/sellCourse/detail.png" alt="">
            </section>
            <section class="closeBtn"></section>
        </section>
        <Loading v-if="loadOnOff"></Loading>
    </section>
</template>
<script type="text/ecmascript-6">
    import Loading from 'components/Loading/Loading.vue';
    import AboutCourseVideoBanner from './components/AboutCourseVideoBanner'
    import axios from "axios";
    import user from 'static/js/module.user.js';
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm.js';
    import commApp from 'static/js/comm.app.js';
    const storeSession = {
        checkInvalid: function (val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        loginInit: function () {
            var webdomain = '//' + location.host;
            var appId = 'wx8d4a2df6fdc13658';
            var searchParam = '';
            var searchUrlOnOff = storeSession.checkInvalid(location.search);
            var loginOnOff = false;
            if (searchUrlOnOff) {
                loginOnOff = true;
                searchParam = "?redirectNumKey=1";
            } else {
                var redirectNum = storeSession.getQueryString('redirectNumKey');
                var loginNumRight = !storeSession.checkInvalid(redirectNum);
                if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                    loginOnOff = false;
                } else {
                    searchParam = location.search + "&redirectNumKey=1";
                    loginOnOff = true;
                }
            }
            var href = location.origin + location.pathname + searchParam;
            var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
            if (loginOnOff) {
                var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                window.location.href = weixinLoginUrl;
            } else {
            }
        }
    };
    export default {
        components: {
            AboutCourseVideoBanner,
            Loading
        },
        data(){
            let customerId = comm.checkInvalid(TempCache.getItem("userId"))?'':TempCache.getItem("userId");
            let buyCourseStep = comm.checkInvalid(TempCache.getItem("buyCourse"))?'':TempCache.getItem("buyCourse");
            let sellCourseStep = comm.checkInvalid(TempCache.getItem("sellCourse"))?'':TempCache.getItem("sellCourse");
            return {
                loadOnOff:false,
                customerId:customerId,
                buyCourseStep:buyCourseStep,
                sellCourseStep:sellCourseStep,
                weiXinBridge:false,
                authState:-1,
                customerRole:0,
                pageType:0,
                scrollTop:0,
                onPaying:true,
                buyStateEnd:false,
                bought:false,
                courseId:18
            }
        },
        beforeMount(){
        },
        computed:{

        },
        mounted(){
            if(comm.isWeiXin()){
                storeSession.loginInit();
            }
            let _this = this;
            if(parseInt(comm.getpara().pageType,10)===1){
                //页面进来就是支付成功
                _this.pageType=1;
            }
            if(_this.sellCourseStep){
                //微信授权的登录绑定成功的回调逻辑
                TempCache.removeItem('sellCourse');
                _this.checkState();
            }
            if(_this.buyCourseStep){
                //认证结束的回调逻辑
                TempCache.removeItem('buyCourse');
                _this.buyCourse();
            }

            if(comm.isWeiXin()){
                document.addEventListener('WeixinJSBridgeReady',()=>{
                    setTimeout(()=> {
                        _this.share();
                    },2000);
                })
            }
            _this.share();
            _this.checkWeiXinBridge();
            console.log('1111');
            _this.checkBuyState();
        },
        methods: {
            learnDetail(){
                let _this = this;
                _this.pageType=2;
                _this.scrollTop = $(document).scrollTop();
                $('html body').animate({ scrollTop: 0 },0);

            },
            share () { //分享
                let shareObj ={};
                shareObj.pic = '//img50.allinmd.cn/pages/index/logo.png';
                shareObj.url = 'https://m.allinmd.cn/dist/sellCourse/sellCourse.html';
                shareObj.title = '保膝plus会员';
                shareObj.summary = '唯医骨科保膝学院会员正式上线';
                shareObj.sinaTitle = '唯医骨科保膝学院会员正式上线';
                shareObj.wxTitle = '保膝plus会员';
                shareObj.wxDesc = '唯医骨科保膝学院会员正式上线';
                shareObj.timeLineTitle ='保膝plus会员';
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:"",
                            shareChannel: 4,
                            shareContent: shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 1,
                                shareContent: shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 3,
                                shareContent: shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest:function(){
                        shareObj = {
                            title: '',
                            summary: '',
                            sinaTitle: '',
                            wxTitle: '',
                            wxDesc: '',
                        };
                        shareObj.pic = '//img50.allinmd.cn/v3/sellCourse/knee.png';
                        shareObj.url = 'https://m.allinmd.cn/dist/sellCourse/sellCourse.html';
                        shareObj.title = '国际保膝标准化课程全国独家上线！帮你彻底掌握保膝手术';
                        shareObj.summary = '黄野教授、郭万首教授领衔13位专家讲师团';
                        shareObj.sinaTitle = '黄野教授、郭万首教授领衔13位专家讲师团';
                        shareObj.wxTitle = '【唯医骨科】国际保膝标准化课程全国独家上线！';
                        shareObj.wxDesc = '黄野教授、郭万首教授领衔13位专家讲师团,帮你彻底掌握保膝手术';
                        shareObj.timeLineTitle ='国际保膝标准化课程全国独家上线！帮你彻底掌握保膝手术';
                        return shareObj;
                    }
                }, true);
            },
            resetPage(){
              let _this = this;
              _this.pageType=0;
                $('html body').animate({ scrollTop: _this.scrollTop },0);
            },
            checkWeiXinBridge(){
                let _this = this;
                if (typeof WeixinJSBridge == "undefined"){
                    if( document.addEventListener ){
                        document.addEventListener('WeixinJSBridgeReady', function(){
                            _this.weiXinBridge = true;
                        }, false);
                    }else if (document.attachEvent){
                        document.attachEvent('WeixinJSBridgeReady', function(){
                            _this.weiXinBridge = true;
                        });
                        document.attachEvent('onWeixinJSBridgeReady', function(){
                            _this.weiXinBridge = true;
                        });
                    }
                }else{
                    //onBridgeReady();
                    _this.weiXinBridge = true;
                }
            },
            auth(){
                let _this = this;
                switch (parseInt(_this.authState)) {
                    case -1:
                    case 3:
                    case 0:
                    case 1:
                        TempCache.setItem('buyCourse',1);
                        user.privExecute({
                            operateType: 'auth',
                            noNeedBack:false,
                            noAuthTip:1,
                            callback: function () {
                                TempCache.setItem('fromPage', location.href);

                            }
                        });
                        break;
                    case 2://可以购买
                    case 7://可以购买
                    case 8://可以购买
                    case 9://可以购买
                        _this.buyCourse();
                        break;
                }
            },
            jumpCourse(){
              let _this = this;
              window.location.href = 'https://m.allinmd.cn/dist/payCourse/payCourse.html#/payCourse?courseId=18';
            },
            checkState(){
                let _this = this;
                _this.loadOnOff = true;
                if(_this.onPaying){
                    if(comm.isWeiXin()){
                        if(_this.customerId){
                            let url = '/mcall/customer/unite/getMapById/';
                            let Data = {
                                "customerId": _this.customerId,
                                "logoUseFlag": 4,
                                "isCustomer": 1,
                                "vFlag": 3
                            };
                            axios({
                                url: url,
                                method: "POST",
                                data: Data,
                                transformRequest: [function(data) {
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(function(datas){
                                console.log('请求成功');
                                let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0];
                                if (dataList) {
                                    let customerAuth = dataList.customer_auth;
                                    _this.authState = customerAuth.state;
                                    _this.customerRole = dataList.customer_unite.customerRole;
                                    //0游客 1系统 2组织 3厂商 4患者 5普通医师 6认证医师 14厂商未注册
                                    _this.onPaying =false;
                                    _this.checkAuthority();
                                }
                            });
                        }else{
                            _this.login();
                        }
                    }else{
                        _this.wakeApp();
                    }
                }

            },
            checkAuthority(){
                let _this = this;
                let role = parseInt(_this.customerRole,10);
                //1-系统、2-组织、3-厂商、5-普通医生、6-认证医生、7-住陪学员、11-执业医师、12-护理、13-医助、14-厂商未认证、15-厂商已认证
                let roleOnOff = role===5||role===6||role===7||role===11||role===12;
                if(roleOnOff){//医务人员，医生，护士，医学生

                    _this.auth();
                }else{
                    //不可以购买
                }
            },
            login(){
                TempCache.setItem('sellCourse',1);
                user.weixinLogin();
            },
            weChatPay(data){
                let _this = this;
                let paramJson = {
                    "appId":"wx8d4a2df6fdc13658",     //公众号名称，由商户传入
                    "timeStamp":data.timeStamp+"",         //时间戳，自1970年以来的秒数
                    "nonceStr":data.nonceStr, //随机串
                    "package":"prepay_id="+data.prepayId,
                    "signType":"MD5",         //微信签名方式：
                    "paySign":data.sign //微信签名
                };
                //alert(JSON.stringify(paramJson));
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', paramJson,
                    function(res){
                        //alert(res.err_msg);
                        if(res.err_msg == "get_brand_wcpay_request:ok" ){
                            // 使用以上方式判断前端返回,微信团队郑重提示：
                            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                            /*_this.$router.push({ name: 'buySuccess'});*/
                                _this.pageType = 1;
                            window.location.href = 'https://m.allinmd.cn/dist/sellCourse/sellCourse.html?pageType=1';
                        }else{
                            _this.pageType=0;
                            _this.onPaying = true;
                            //window.location.href = 'https://m.allinmd.cn/dist/sellCourse/sellCourse.html';
                        }
                    });
            },
            weChatBuy(){
                let _this = this;
                if(_this.weiXinBridge){
                    //微信sdk以准备完毕可以开始支付
                    let url = '/mcall/shoppingOrder/createKneePreservationOrder/';
                    let Data = {
                        "customerId": _this.customerId,
                        "openid":comm.getpara().opendId
                    };
                    axios({
                        url: url,
                        method: "POST",
                        data: Data,
                        transformRequest: [function(data) {
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(function(datas){
                        console.log('请求成功');
                        let wechatPayResult = datas.data.responseObject.responseData && datas.data.responseObject.responseData.wechatPayResult;
                        if (wechatPayResult) {
                            _this.weChatPay(wechatPayResult);
                        }else{
                            alert('获取支付参数有误');
                        }
                    }).catch(function (error) {
                        alert('获取支付参数有误');
                        console.log(error);
                    });

                }
            },
            buyCourse(){
                let _this = this;
                console.log('购买课程');
                //购买课程前首先判断该用户是否购买过该课程
                let url = '/mcall/college/course/getCustomerPurchasedList/';
                let Data = {
                    "courseId": _this.courseId,
                    "customerId": _this.customerId,
                    "isValid": 1
                };
                axios({
                    url: url,
                    method: "POST",
                    data: Data,
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(datas){
                    console.log('请求成功');
                    _this.loadOnOff = false;
                    _this.onPaying = true;
                    let totalCount = datas.data.responseObject.responseData && datas.data.responseObject.responseData.totalCount;
                    if (parseInt(totalCount,10)===0) {//如果没有购买过课程
                        _this.weChatBuy();
                    }else{
                        //如果用户已经购买过课程
                        _this.wakeApp();
                    }
                });

            },
            checkBuyState(){
                let _this = this;
                console.log('购买课程');
                //购买课程前首先判断该用户是否购买过该课程
                let url = '/mcall/college/course/getCustomerPurchasedList/';
                let Data = {
                    "courseId": _this.courseId,
                    "customerId": _this.customerId,
                    "isValid": 1
                };
                axios({
                    url: url,
                    method: "POST",
                    data: Data,
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(datas){
                    console.log('请求成功');
                    _this.buyStateEnd = true;
                    let totalCount = datas.data.responseObject.responseData && datas.data.responseObject.responseData.totalCount;
                    if(!isNaN(parseInt(totalCount,10))){
                        if (parseInt(totalCount,10)===0) {//如果没有购买过课程
                            _this.bought = false;
                        }else{
                            _this.bought = true;
                        }
                    }else{
                        _this.bought = false;
                    }
                });

            },
            wakeApp(){
                let androidParam = `{scene:3,type:101,tplPath:0,sourceId:18}`;
                let iosParam = `scene=3&type=101&tplPath=0&keyword=18`;
                let callAppOptions = {
                    el: ".solidBtn",
                    runAtOnce: false,
                    ios: "allinmdios://app.allinmd.cn/applinks.html?" + iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?" + iosParam,
                    android: "allin://com.allin.social:75235?data=" + androidParam
                };
                commApp.appWakeUp('confirm',callAppOptions);
            }
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/sellCourse/sellCourse.scss";
</style>


