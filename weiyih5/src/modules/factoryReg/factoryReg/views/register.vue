<template>
    <section class="">
        <!-- 摘自唯医- 遇到问题 -->
        <section :class="problemStyle">
            <section class="al-authHelpContent">
                <h2>服务时间</h2>
                <span class="al-authHelpClose" @click="closeProblem"></span>
                <p class="al-authHelpTime">周一至周五（9:00-18:00）节假日除外</p>
                <section class="al-authHelpContact">
                    <p>客服电话 <span>010-59007006</span><a href="tel:010-59007006"><img src="//img50.allinmd.cn/authentication/auth/tel.png" alt=""></a></p>
                    <p>客服微信 <span>weiyizs123</span></p>
                </section>
            </section>
        </section>
        <!-- 遇到问题 end -->

        <Loading v-if="showState.axiosLoading"></Loading>

        <section :class="phoneTipsStyle" v-if="showState.checkPhone">
            <figure class="reg-fade-text">
                <p>{{tipsDesc}}</p>
            </figure>
        </section>

        <section class="reg-cloak" v-if="showState.cloak" @click="closePopupWindow">
            <div class="reg-cloak-text" @click.stop>
                <div class="reg-cloak-text-upPart">
                    <p class="reg-cloak-title">提示</p>
                    <p class="reg-cloak-desc">该帐号已完成注册</p>
                    <p class="reg-cloak-desc">请直打开唯医骨科app进行登录</p>
                </div>
                <div class="reg-cloak-openAppText" @click="openApp">打开唯医骨科app</div>
            </div>
        </section>

        <FactoryHeader :title="title"></FactoryHeader>
        <section class="reg">
            <aside class="reg-form">
                <div class="inputBox"><input class="reg-input-phone" v-model="phone" type="number" placeholder="请输入手机号"></div>

                <div class="inputBox">
                    <input class="reg-input-verifyCode" type="number" v-model="verifyCode" placeholder="请输入验证码">
                    <span v-if="showState.verifyCode" :class="verifyCodeStyle" @click="sendSms">获取验证码</span>
                    <span v-if="!showState.verifyCode" class="reg-countdown">{{countdown}}s</span>
                </div>
                <div class="inputBox">
                    <input class="reg-input-password" :type="pwdType" v-model="password" placeholder="请设置密码(至少6位)">
                    <i :class="pwdStyle" v-show="password !=='' " @click="showPwd"></i>
                    <i class="reg-clearIcon" v-show="password!==''" @click="clearPwd"></i>
                </div>
                <div class="reg-btn-center">
                    <button :class="regBtnStyle" @click="createAccount">创建帐号</button>
                </div>
                <div class="reg-answer-tips">
                    <span @click="trackProblem">遇到问题？</span>
                </div>
            </aside>
            <aside class="reg-agree">
                <div>创建帐号即表示同意 <i @click="trackServiceUrl">服务条款</i> 及 <i @click="trackPrivacyUrl">隐私声明</i></div>
            </aside>
        </section>
    </section>
</template>

<script>
import FactoryHeader from '../components/Header.vue';
import Axios from 'axios';
import loading from "components/Loading/Loading.vue"
import commApp from 'static/js/comm.app.js';
//
const XhrUrl = {
    getToken: {
        type: 'GET',
        url: '/mcall/token/getToken/',
        params: {}
    },
    phoneReg: { // 手机注册
        type: 'POST',
        url: '/mcall/web/user/userRegist/', //?struts.token=
        params: {
            account: 0, // long 手机号
            type: 'mobile', // string 注册类型
            validCode: 0, //int 验证码
            passwd: '', // string 密码
            verificationId: 0 , // responsePK
            customerRole: 14, // int 角色状态值（厂商未认证-14）
        }
    },
    checkPhoneReg: { // 检查手机是否注册过
        type: 'POST',
        url: '/mcall/customer/unite/validateAccount/',
        params: {account: '', customerRole: 14}
    },
    sendSms: { // 发送验证码
        type: 'GET',
        url: '/mcall/customer/verification/sendSms/',
        params: {
            account: 0, // long 手机号
            isNew: 1, // int 传1
            codeLength: 4, // int 验证码长度（传4）
//            ALLINACCESSTOKEN: '', // string 验证Token
            timestamp: 0, // string 当前时间戳
            siteId: 2, // int 站点id
        }
    }
}

const register = {
    data(){
        return {
            title: '立即注册',
            timeSecond: 60, // 定义一分钟倒计时
            countdown: 60, // 初始化
            phone: '', // 手机号
            verifyCode: '', // 验证码
            password: '', // 密码
            responsePK: 0, // PKID
            showState: { // 展示状态
                regBtn: true, // 默认注册按钮样式
                checkPhone: false, // 提示电话状态
                cloak: false, // 遮罩状态
                verifyCode: true, // 验证码默认状态
                verifyCodeActive: false, // 验证码是灰色的
                axiosLoading: false, // loading
                pwdShow: false, // 是否显示密码
                problemWindow: false //是否显示遇到问题
            },
            fadeDesc: { // 动画描述语
                invalidPhone: '请填写正确的手机号码',
                invalidSms: '手机号码或验证码无效'
            }
        }
    },
    components: {FactoryHeader: FactoryHeader, Loading: loading},
    computed: {
        regBtnStyle(){
            return this.showState.regBtn?'reg-btn-create':'reg-btn-create reg-btn-createActive';
        },
        phoneTipsStyle(){
            return !this.showState.checkPhone?'reg-fade-tips':'reg-fade-tips reg-fade-showAnimation';
        },
        verifyCodeStyle(){
            return !this.showState.verifyCodeActive?'reg-verifyCode':'reg-verifyCode reg-verifyCode-active'
        },
        pwdStyle(){
            return !this.showState.pwdShow? 'reg-pwdIcon':'reg-pwdIcon reg-pwdShowIcon';
        },
        pwdType(){
            return !this.showState.pwdShow?'password': 'text';
        },
        problemStyle(){
            return !this.showState.problemWindow?'al-authHelpBg al-selectorBarMask':'al-authHelpBg al-selectorBarMask on';
        }
    },
    watch: {
        verifyCode(newVal){
            if(newVal.length === 4 && this.password.length>5 && this.phone.length === 11){
                this.showState.regBtn = false;
            }
        },
        phone(newVal){
            if(newVal.length === 11){
                this.showState.verifyCodeActive = true;
            }else{
                this.showState.verifyCodeActive = false;
            };

            if(newVal.length === 11 && this.verifyCode.length === 4 && this.password.length>5){
                this.showState.regBtn = false;
            }
        },
        password(newVal){
            if(newVal.length>5 && this.phone.length === 11 && this.verifyCode.length === 4){
                this.showState.regBtn = false;
            }
        }
    },
    mounted(){
        // 处理底部条款信息在Android上软键盘顶起底部固定
        let winHeight = $(window).height();   //获取当前页面高度
        $(window).resize(function(){
            let thisHeight=$(this).height();
            if(winHeight - thisHeight >50){
                //当软键盘弹出，在这里面操作
                $(".reg-agree").css("position","static")
            }else{
                //当软键盘收起，在此处操作
                $(".reg-agree").css("position","absolute")
            }
        });

        // 输入后回弹
        var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
        var wechatVersion = wechatInfo[1]
        var u = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
        if(wechatVersion=='6.7.4'&&!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            function temporaryRepair(){
                var currentPosition,timer;
                var speed=1;//页面滚动距离
                timer=setInterval(function(){
                    currentPosition=document.documentElement.scrollTop || document.body.scrollTop;
                    currentPosition-=speed;
                    window.scrollTo(0,currentPosition);//页面向上滚动
                    currentPosition+=speed; //speed变量
                    window.scrollTo(0,currentPosition);//页面向下滚动
                    clearInterval(timer);
                },1);
            }

            temporaryRepair();
        }

    },
    methods: {
        createAccount(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'创建帐号点击',
                actionId:11701,
                browType:398
            });

            if(this.verifyPhone(this.phone) && !!this.verifyCode && !!this.responsePK){
                this.showState.axiosLoading = true;
                const tokenPromise = this.AxiosSend(XhrUrl.getToken);
                tokenPromise.then((res) => {
                    let obj = Object.assign(XhrUrl.phoneReg, {params:{
                        account: this.phone,
                        type: 'mobile', // string 注册类型
                        validCode: this.verifyCode, // int 验证码
                        verificationId: this.responsePK,
                        passwd: this.password, // 密码
                        customerRole: 14, // int 角色状态值（厂商未认证-14）
                    }});
                    //obj.url = obj.url + res.responseData.token;

                    let _this = this;
                    let params={};
                    params.paramJson= $.toJSON(obj.params);
                    $.ajax({
                        url:obj.url,
                        type : 'POST',
                        data : params,
                        dataType:"json",
                        async: false,
                        success:function(rep){
                            if(rep.responseObject.responseStatus){
                                _this.showState.axiosLoading = false;
                                _this.$router.push({path: 'regFinish'});
                            }else{
                                _this.showState.axiosLoading = false;
                                comm.alertBox({
                                    "title":rep.responseObject.responseMessage,
                                    "ensure":"知道了",
                                });
                            }
                        }
                    });
//                    let _this = this;
//                    const promise = _this.AxiosSend(obj);
//                    promise.then((res) => {
//                        debugger;
//                        if(res){
//                            _this.$router.push({path: 'regFinish'})
//                        }else{
//                            console.log("注册出错", res);
//                        }
//                    });
                })
            }else{
                this.fadeAnimation(this.fadeDesc.invalidSms);
            }
        },
        sendSms(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'获取验证码点击',
                actionId:11699,
                browType:398
            });

            if(!this.verifyPhone(this.phone)){
                this.fadeAnimation(this.fadeDesc.invalidPhone);
            }else{
                let _this = this;

                // 验证是否手机号已注册
//                let obj = Object.assign(XhrUrl.checkPhoneReg, {params: {account: _this.phone}});
//                const promise = _this.AxiosSend(obj);
//                promise.then((res) => {

                let obj = Object.assign(XhrUrl.checkPhoneReg, {params: {account: _this.phone, customerRole: 14}});
                let params={};
                params.paramJson= $.toJSON(obj.params);
                $.ajax({
                    url:obj.url,
                    type : 'POST',
                    data : params,
                    dataType:"json",
                    async: false,
                    success:function(res){
                        if(!res.responseObject.responseStatus){ // 未注册
                            // 发送验证码
                            _this.showState.verifyCode = false;
                            _this.countdownFn();
                            let timestamp = new Date().getTime();
                            obj = Object.assign(XhrUrl.sendSms, {params: {
                                account: _this.phone,
                                isNew: 1,
                                codeLength: 4,
                                siteId: 2,
//                                ALLINACCESSTOKEN: _this.allinaccesstoken(_this.phone, timestamp),
                                timestamp: timestamp
                            }});
                            const regPromise = _this.AxiosSend(obj);
                            regPromise.then((res) => {
                                // 发送成功
                                if(res.responseStatus){
                                    _this.responsePK = res.responsePk;
                                }
                            });

                        }else{ // 已注册
                            // 弹已注册去登录
                            _this.showState.cloak = true;
                        }

                    }
                });











//                });
            }
        },
        countdownFn(){
           let second = setInterval(()=>{
               this.countdown--;
               if(this.countdown === 0){
                    clearInterval(second);
                    this.countdown = this.timeSecond;
                    this.showState.verifyCode = true;
               }
           },1000);
        },
        closeProblem(){
            this.showState.problemWindow = false;
        },
        showPwd(){
            this.showState.pwdShow = !this.showState.pwdShow;
        },
        clearPwd(){
            this.password = '';
            this.showState.pwdShow = false;
        },
        fadeAnimation(desc){
            this.showState.checkPhone = true;
            this.tipsDesc = desc;
            setTimeout(()=>{
                this.showState.checkPhone = false;
            }, 3000);
        },
        closePopupWindow(){
            this.showState.cloak = false;
        },
        openApp(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'弹层-打开唯医骨科app点击',
                actionId:11700,
                browType:398
            });

            let androidParam = `{}`;
            let iosParam = ``;
            let callAppOptions = {
                ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                android: "allin://com.allin.social:75235?data="+androidParam,
                ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                runAtOnce: false
            };

            commApp.appWakeUp("confirm", callAppOptions);//唤醒app弹层
        },
        verifyPhone(phone){
            if(phone.trim() === ""){
                return false;
            }
//            return (/^1[34578]\d{9}$/.test(phone));
            return (/^1\d{10}$/.test(phone));
        },
//        allinaccesstoken(timestamp,phoneVal){
//            return $.md5('dynamic.allinmd.cn/'+timestamp+'/'+phoneVal);
//        },
        AxiosSend(obj){
            if(obj.type === "GET"){
                return Axios.get(obj.url, {params: {paramJson: $.toJSON(obj.params)}}).then((res)=>{
                    return res.data.responseObject;
                });
            }else{
                return Axios({
                    method: obj.type,
                    url: obj.url,
                    data: {paramJson: obj.params}
                }).then((res)=>{
                    return res.data.responseObject;
                });

            }
        },
        trackServiceUrl(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'服务条款',
                actionId:11703,
                browType:398
            });

            setTimeout( ()=> {
                window.location.href = 'https://m.allinmd.cn/pages/service/service.html';
            }, 300);
        },
        trackPrivacyUrl(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'隐私声明',
                actionId:11704,
                browType:398
            });

            setTimeout( ()=> {
                window.location.href = 'https://m.allinmd.cn/pages/service/privacy.html';
            }, 300);
        },
        trackProblem(){
            comm.creatEvent({
                triggerType:'厂商注册页',
                triggerName:'遇到问题',
                actionId:11702,
                browType:398
            });
            this.showState.problemWindow = true;
        }
    }

}

export default register;


</script>

<style lang="scss" scoped rel="stylesheet/scss">
    html,body,.reg-cloak,.al-selectorBarMask{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 4;
        opacity: 1;
        background-color:rgba(0,0,0,0.7);
    }
    .reg-cloak .reg-cloak-text{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 10;
        color: red;
        width: 270px;
        height: 159px;
        background: #fff;
        border-radius: 5px;
        .reg-cloak-text-upPart{
            height: 95px;
            border-bottom: 1px solid #E3E5E9;
        }
        .reg-cloak-title{
            font-size: 18px;
            color: #222222;
            margin-top: 20px;
            font-weight: bold;
        }
        .reg-cloak-desc{
            font-size: 16px;
            color: #444444;
            margin-top:5px;
        }
        .reg-cloak-openAppText{
            font-size: 16px;
            color: #6483E9;
            line-height: 44px;
            font-weight: bold;
        }
    }

    .reg-fade-tips{
        position: fixed;
        background-color: #000;
        opacity: 0.7;
        width: 230px;
        height: 50px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        color: #fff;
        z-index: 1;
        .reg-fade-text{
            font-size: 17px;
            text-align: center;
            line-height: 50px;
        }
        .reg-fade-showAnimation{
            -webkit-animation-name: fadeIn; /*动画名称*/
            -webkit-animation-duration: 2s; /*动画持续时间*/
            -webkit-animation-iteration-count: 1; /*动画次数*/
            -webkit-animation-delay: 0s; /*延迟时间*/
        }
    }

    .reg{
        .reg-agree{
            position: absolute;
            text-align: center;
            font-size: 13px;
            color: #AAAAAA;
            bottom: 18px;
            width: 100%;
            margin-top:50px;

            i{
                text-decoration: underline;
            }
        }
        .reg-form{
            margin-top: 74px;
            .reg-answer-tips{
                margin: 0 auto;
                margin-top: 20px;
                font-size: 15px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                width: 300px;
                text-align: right;
                color: #bbbbbb;
            }
            .reg-btn-center{
                text-align:center;
            }
            .reg-verifyCode{
                width:85px;
                height:24px;
                font-size:17px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#bbbbbb;
                line-height:24px;
                float: right;
                margin: 14px;
                opacity: 1;
            }
            .reg-verifyCode-active{
                width:85px;
                height:24px;
                font-size:17px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:#6483E9;
                line-height:24px;
                float: right;
                margin: 14px;
            }
            .reg-countdown{
                width:85px;
                height:24px;
                font-size:17px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color: #BBBBBB ;
                line-height:24px;
                float: right;
                margin: 13px;
                text-align: center;
            }
            .reg-btn-create{
                margin-top: 39px;
                font-size: 17px;
                line-height: 52px;
                width: 300px;
                height: 52px;
                background:#E1E1E1;
                border-radius:3px;
                color: #fff;
            }
            .reg-btn-createActive{
                background:#6483E9;
            }
            .inputBox{
                margin: 0 auto;
                margin-top: 14px;
                padding-left:13px;
                font-size: 17px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                width: 285px;
                height: 50px;
                border-radius:3px;
                border:1px solid #BCBEC2;
                input{
                    width: 160px;
                    font-size: 22px;
                    border: 0px;
                    color: #6483E9;
                    text-shadow: 0 0 0 #000;
                    -webkit-text-fill-color: transparent;
                    line-height: normal;
                    /*border: 1px solid #68be4c;*/
                }

                .reg-input-phone::-webkit-input-placeholder{
                    font-size:17px;
                    color:#bbbbbb;
                    text-shadow: none;
                    -webkit-text-fill-color: initial;
                    line-height: normal;
                }
                .reg-input-verifyCode::-webkit-input-placeholder{
                    font-size:17px;
                    color:#bbbbbb;
                    text-shadow: none;
                    -webkit-text-fill-color: initial;
                    line-height: normal;
                }
                .reg-input-password::-webkit-input-placeholder{
                    font-size:17px;
                    font-weight:400;
                    color:#bbbbbb;
                    text-shadow: none;
                    -webkit-text-fill-color: initial;
                    line-height: normal;
                }
                .reg-input-phone{
                    margin-top: 12px;
                    width: 265px;
                    line-height: normal;
                }
                .reg-input-verifyCode{
                    margin-top: 12px;
                    width: 165px;
                    line-height: normal;
                }
                .reg-input-password{
                    margin-top: 12px;
                    width: 193px;
                    line-height: normal;
                }
                .reg-clearIcon{
                    float: right;
                    width: 25px;
                    height: 25px;
                    background: url(/static/images/factoryReg/cleanPwd.png) no-repeat;
                    background-size: contain;
                    margin: 12px 5px 0 0;
                    vertical-align: middle;
                }
                .reg-pwdIcon{
                    float: right;
                    width: 25px;
                    height: 25px;
                    background: url(/static/images/factoryReg/biyan.png) no-repeat;
                    background-size: contain;
                    margin: 11px 12px 0 0;
                    vertical-align: middle;
                }
                .reg-pwdShowIcon{
                    float: right;
                    width: 25px;
                    height: 25px;
                    background: url(/static/images/factoryReg/zhengyan.png) no-repeat;
                    background-size: contain;
                    margin: 11px 12px 0 0;
                    vertical-align: middle;
                }

            }
        }
    }


    .al-selectorBarMask {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0,0,0,.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity .2s linear;
        -webkit-transition: opacity .2s linear;
    }
    .al-selectorBarMask.on {
        visibility: visible;
        opacity: 1;
    }
    .al-authHelpBg{
        h2 {
            font-size: 20px;
            color: #222;
            margin-bottom: .4rem;
        }
        .al-authHelpContent {
            width: 92%;
            margin: 0 auto;
            padding: .93333rem .53333rem;
            text-align: left;
            background: #fff;
            border-radius: 15px;
            overflow: hidden;
            box-sizing: border-box;
            position: fixed;
            top: 50%;
            left: 4%;
            transform: translateY(-50%);
        }
        .al-authHelpClose {
            width: 17px;
            height: 17px;
            position: absolute;
            right: 17px;
            top: 17px;
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAV9JREFUSA29180RwiAQBWDhlDRgEXZhFxZhA7mlCIuwC7uwCBtITok8lExEdtnFIAd/wvK+wGTIYLquO0zTdGnb9tT3/WNXsbn8/TAMV2vt2QJ11nEcxxs6arnIhgELpsVMjTH3eZ4PtfCAwoDlTcww7mia5uiubbLsVLYJS0sVhP6Sby5zgRHMFWrhXNYHvBWeQ+F8wb/iEpSES3EpysJaXINmYSmuRUVwDi9BxTCF4zp2u7AjaTae5FONwFSLZ4eaEhTjVDAGrHEf4PZezUwxBs2+vv7/qZrxerZ4y+B2qy91jGJ5AVd9uFKou+Zfm1wfboxq2aWWBEtq4htgYU2gphY3QcLaIIRpxiRhTQDAdZOO/YKlA9dY/FuS8QFLBsQI9T+XtcC5QgrgrnOZHuYKuGBJH5VtqA5JqLQmZVicZUr3WwX8wBYbTizv85M9u4BbyatNCqPOzdrjsHBoewIPdmltEExNwwAAAABJRU5ErkJggg==") no-repeat;
            background-size: cover;
        }
        .al-authHelpTime {
            font-size: 16px;
            color: #333;
        }
        .al-authHelpContact {
            color: #909090;
            font-size: 16px;
            a {
                float: right;
                border-left: 1px solid #e4e9ed;
                padding-left: .2rem;
            }
            img {
                border: 0;
                width: 1.38667rem;
                height: .50667rem;
                line-height: .48rem;
                display: inline-block;
                position: relative;
                top: .10667rem;
            }
            p {
                line-height: .48rem;
                padding: .4rem 0;
            }
            p:first-child {
                border-bottom: 1px solid #e4e9ed;
            }
            p:nth-child(2) {
                padding-bottom: .2rem;
            }
            span {
                margin-left: .26667rem;
                line-height: .48rem;
                display: inline-block;
                color: #333;
                font-size: 18px;
                width: 50%;
                position: relative;
                top: .04rem;
            }
        }
    }



    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0; /*初始状态 透明度为0*/
        }
        50% {
            opacity: 0; /*中间状态 透明度为0*/
        }
        100% {
            opacity: 1; /*结尾状态 透明度为1*/
        }
    }
</style>
