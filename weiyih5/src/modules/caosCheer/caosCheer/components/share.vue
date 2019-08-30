<template>
    <div class="container-share">
        <div class="inviter-name">
            <p class="inner-inviter-name">
                {{inviterName}}
            </p>
        </div>
        <p class="hospital-name">{{hospitalName}}</p>
        <hospital-info :authNum="authNum" :assistanceNum="assistanceNum" :assistanceList="assistanceList" :newAuthNum="newAuthNum" v-if="renderHospital"></hospital-info>
        <button class="btn" @click="handleClick"></button>
        <rank-list :customerId="invitateCustomerId" v-if="renderRankList"></rank-list>
        <rule-list></rule-list>
        <tip-msg ref="tips"></tip-msg>
    </div>
</template>

<script type="text/ecmascript-6">
    import hospitalInfo from "./hospitalInfo"
    import rankList from "./rankList"
    import ruleList from "./ruleList"
    import tipMsg from "./tipMsg"
    import qs from "qs"
    import axios from "axios"
    import user from 'static/js/module.user.js'
    import TempCache from "static/js/tempcache.js"
    import comm from 'static/js/comm.js'
    var storeSession = {
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
                searchParam = "?redirectNum=1";
            } else {
                var redirectNum = storeSession.getQueryString('redirectNum');
                var loginNumRight = !storeSession.checkInvalid(redirectNum);
                if (loginNumRight && parseInt(redirectNum, 10) === 1) {
                    loginOnOff = false;
                } else {
                    searchParam = location.search + "&redirectNum=1";
                    loginOnOff = true;
                }
            }
            var href = location.origin + location.pathname + searchParam;
            var toUrl = 'http:' + webdomain + '/mcall/wx/allin/interact/viewVideo/?url=' + encodeURIComponent(href);
            if (loginOnOff) {
                var weixinLoginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appId + '&redirect_uri=' + encodeURIComponent(toUrl) + '&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
                // window.location.href = weixinLoginUrl;
            } else {
            }
        }
    };
    function parseQuery() {
        let obj ={}
        let search = location.search.slice(1).split('&')
        for (let i = 0; i < search.length; i++) {
            let arr = search[i].split('=')
            let key = arr[0]
            let value = arr[1]
            if (!obj[key]) {
                obj[key] = value
            }
        }
        return obj

    }

    export default {
        components: {
            tipMsg,
            hospitalInfo,
            rankList,
            ruleList
        },
        data(){
            return { //1558078458574
                inviterName:'',
                isWX: false,
                isOther: false,
                renderHospital: false,
                renderRankList: false,
                customerId: '',
                customerName: '',
                invitateCustomerId: '',
                hospitalId: 0,
                aHospitalName:'',
                hospitalName: '',
                authNum: 0,
                newAuthNum:0,
                assistanceNum: 0,
                assistanceList: [],
                showCustomer: false,
                authState: -1,
                passState: [0, 1, 2, 7, 8],
                rejectState: [3, 9],
                appPort: false,
                customerRole:''
            }
        },
        created () {
            let _this = this;
            let invitateCustomerId = parseQuery().invitateCustomerId;
            this.invitateCustomerId = invitateCustomerId;
            this.customerId = TempCache.getItem("userId") ? TempCache.getItem("userId") : '';
            this.checkClient();
            let auth = TempCache.getItem("auth");
            if (auth){
                auth = JSON.parse(auth);
                this.customerName = auth.lastName + auth.firstName;
                this.hospitalId = auth.companyId;
                this.aHospitalName = auth.company;
                this.authState = auth.state;
            }
            if(this.invitateCustomerId){
                this.renderRankList = true;
            }
            this.getCustomerInfo(TempCache.getItem("userId"));
            this.getCustomerList();
            if(comm.isWeiXin()){
                document.addEventListener('WeixinJSBridgeReady',()=>{
                    setTimeout(()=> {
                        _this.share();
                    },2000);
                })
            }
        },
        mounted () {
            let _this = this;
            if(TempCache.getItem('assistance')){
                _this.customerId = TempCache.getItem("userId");
                let invitateCustomerId = parseQuery().invitateCustomerId;
                _this.invitateCustomerId = invitateCustomerId;
                _this.getCustomerInfo(_this.customerId);
                setTimeout(()=>{
                    _this.assistance();
                    TempCache.removeItem('assistance');
                },300);
            }

        },
        watch:{
            customerId(n){
                let _this = this;
                if(n){
                    _this.getCustomerList()
                }
            },
            invitateCustomerId(n){
                let _this = this;
                if(n){
                    _this.getCustomerList();
                    if(n){
                        let url = '/mcall/customer/unite/getMapById/';
                        let Data = {
                            paramJson: JSON.stringify({
                                "customerId": n,
                                "logoUseFlag": 4,
                                "isCustomer": 1,
                                "vFlag": 3
                            })
                        };
                        let that = this;
                        axios.post(url, qs.stringify(Data)).then(function (datas) {
                            let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                            if (dataList) {
                                let customerAuth = dataList.customer_auth;
                                var str = (customerAuth.lastName + customerAuth.firstName);
                                let strArr = str.split('');
                                console.log(strArr);
                                that.inviterName = strArr[strArr.length-2]+strArr[strArr.length-1];
                            }
                        })
                    }
                }
            }
        },
        methods: {
            share () { //分享
                let t = this;
                let shareObj ={};
                let customerId = TempCache.getItem("userId");
                let invitateCustomerId = parseQuery().invitateCustomerId;
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
                        $.ajax({
                            url: "/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify({
                                    sceneType: 103,
                                    customerId: customerId,
                                    invitateCustomerId: customerId
                                })
                            },
                            type: "post",
                            async:false,
                            dataType:"json",
                            success:function(data){
                                if(comm.hasResponseData(data)){
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    shareObj.url = data.responseObject.responseData.data_list[0].share_comm.shareUrl;
                                    $(sList).each(function (index, element) {
                                        if (element.shareChannel === 'QZone') {
                                            shareObj.title = element.shareTitle;
                                            shareObj.summary = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'Sina') {
                                            shareObj.sinaTitle = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatFriend') {
                                            shareObj.wxTitle = element.shareTitle;
                                            shareObj.wxDesc = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatTimeline') {
                                            shareObj.timeLineTitle = element.shareTitle;
                                        }

                                    });

                                }
                            }
                        });
                        return shareObj;
                    }
                }, true);
            },
            checkClient () {
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) { //app内
                    this.appPort = true;
                    this.customerId = (appjs && appjs.getAuthorCustomerId());
                    TempCache.setItem("userId",this.customerId);
                    this.saveSession(this.customerId);
                    if (this.customerId){
                        this.getCustomerInfo(this.customerId);
                        this.getCustomerAssistanceState(this.customerId)
                    }
                } else if (comm.isWeiXin()) { //微信内
                    this.isWX = true;
                    this.weiXinLogin();
                    console.log(TempCache.getItem("userId"));
                    this.getCustomerInfo(TempCache.getItem("userId"));
                    this.getCustomerAssistanceState(this.customerId)
                } else { //其他环境打开
                    this.isOther = true;
                }
            },
            getCustomerAssistanceState (customerId) { //获取用户是否已经助力
                let that = this;
                let url = '/mcall/customer/invitation/getInvitationCustomerList/';
                let Data = {
                    paramJson: JSON.stringify({
                        "customerId": customerId,
                        "invitateCustomerId": this.invitateCustomerId
                    })
                }
                axios.get(url, {params: Data}).then(function (datas) {
                    let data = datas.data.responseObject.responseData.dataList[0];
                    //////alert('as:' + data.assistanceState)
                    console.log(data.assistanceState);
                    if (data.assistanceState == 1) {
                        /*that.$router.push({  //核心语句
                            path:'/invite',   //跳转的路径
                            query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                                invitateCustomerId:'' ,
                                customerId:''
                            }
                        })*/
                        let url = '/dist/caosCheer/caosCheer.html?invitateCustomerId='+customerId+'#/invite';
                        location.href = url;
                    }
                })
            },
            login () { //唤起web登陆
                let t = this;
                TempCache.setItem('assistance',1);
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:false,
                    callback: function () {
                        console.log('回调2222');
                        TempCache.setItem('fromPage', location.href);
                        t.assistance('auth');
                    }
                })
            },
            getCustomerInfo (customerId,callBack) {//获取邀请用户信息
                let url = '/mcall/customer/unite/getMapById/';
                let Data = {
                    paramJson: JSON.stringify({
                        "customerId": customerId,
                        "logoUseFlag": 4,
                        "isCustomer": 1,
                        "vFlag": 3
                    })
                };
                let that = this;
                axios.post(url, qs.stringify(Data)).then(function (datas) {
                    let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                    if (dataList) {
                        let customerAuth = dataList.customer_auth;
                        that.customerName = customerAuth.lastName + customerAuth.firstName;
                        that.hospitalId = customerAuth.companyId;
                        that.aHospitalName = customerAuth.company;
                        that.customerRole = dataList.customer_unite.customerRole;
                        callBack&&callBack();
                    }
                })
            },
            getCustomerList () {
                let that = this;
                let url = '/mcall/customer/invitation/getInvitationCustomerList/';
                let Data = {
                    paramJson: JSON.stringify({
                        "customerId": that.customerId,
                        "invitateCustomerId": that.invitateCustomerId
                    })
                }
                axios.get(url, {params: Data}).then(function (datas) {
                    if(datas&&datas.data){
                        if(datas.data.responseObject.responseStatus){
                            let data = datas.data.responseObject.responseData.dataList[0];
                            that.assistanceList = data.assistanceList;
                            that.authNum = data.authNum;
                            that.assistanceNum = data.assistanceNum;
                            that.hospitalName = data.hospitalName;
                            that.newAuthNum = data.newAuthNum;
                            that.renderHospital = true;
                            console.log('-----'+data.assistanceState);
                            if (data.assistanceState == 1) {
                                /*that.$router.push({  //核心语句
                                    path:'/invite',   //跳转的路径
                                    query:{           //路由传参时push和query搭配使用 ，作用时传递参数
                                        invitateCustomerId:'' ,
                                        customerId:''
                                    }
                                })*/
                                let url = '/dist/caosCheer/caosCheer.html?invitateCustomerId='+that.invitateCustomerId+'#/invite';
                                location.href = url;
                            }
                        }else{

                        }
                    }

                })
            },
            checkAppCallBack(){
              let _this = this;
                let getAuthInfo=(customerId,callBack)=>{
                    let url = '/mcall/customer/unite/getMapById/';
                    let Data = {
                        paramJson: JSON.stringify({
                            "customerId": customerId,
                            "logoUseFlag": 4,
                            "isCustomer": 1,
                            "vFlag": 3
                        })
                    };
                    let that = this;
                    axios.post(url, qs.stringify(Data)).then(function (datas) {
                        let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                        if (dataList) {
                            let customerAuth = dataList.customer_auth;
                            that.customerName = customerAuth.lastName + customerAuth.firstName;
                            that.hospitalId = customerAuth.companyId;
                            that.aHospitalName = customerAuth.company;
                            that.authState = customerAuth.state;
                            if(parseInt(that.authState,10)!==-1&&parseInt(that.authState,10)!==3){
                                callBack&&callBack();
                            }
                        }
                    })
                }
                let timer = setInterval(()=>{
                    _this.customerId = (appjs && appjs.getAuthorCustomerId());
                    if(_this.customerId){
                        TempCache.setItem("userId",_this.customerId);
                        _this.customerId = TempCache.getItem("userId");
                        let invitateCustomerId = parseQuery().invitateCustomerId;
                        _this.invitateCustomerId = invitateCustomerId;
                        console.log('获取用户信息');
                        _this.getCustomerInfo(_this.customerId,function(){
                            console.log('开始助力');
                            getAuthInfo(_this.customerId,function(){
                                _this.assistance();
                                TempCache.removeItem('assistance');
                                clearInterval(timer);
                            });
                        });

                    }
                },1000);
            },
            weiXinLogin(){
                let _this = this;
                storeSession.loginInit();
            },
            auth (state) { //认证
//                user.privExecute({
//                    operateType: 'auth',
//                    callback: function () {}
//                })
                ////alert('auth')
                var t = this;
                var _this = this;
                switch (parseInt(state,10)) {
                    case -1:
                    case 3:
                        if(t.appPort){
                            appjs && appjs.signup(); //跳转登陆页
                            _this.checkAppCallBack();
                        }else{
                            TempCache.setItem('assistance',1);
                            user.privExecute({
                                noNeedBack:false,
                                operateType: 'auth',
                                callback: function () {
                                    console.log('回调3333');
                                    TempCache.setItem('fromPage', location.href);
                                    t.assistance('auth');
                                }
                            })
                        }
                        //t.assistance('auth');
                        break;
                    case 0://可以直接助力
                    case 1://可以直接助力
                    case 2://可以直接助力
                    case 7://可以直接助力
                    case 8://可以直接助力
                    case 9://可以直接助力
                        if(comm.isWeiXin()){
                            t.assistance();
                        }
                        break;
                }
            },
            handleClick () { //点击按钮根据不同的场景触发不同的操作
                let _this = this;
                console.log(comm.isWeiXin());
                function checkLogin(){
                    if(!_this.customerId){
                        if(_this.appPort){
                            appjs && appjs.signup(); //跳转登陆页
                            _this.checkAppCallBack();
                        }else{
                            if(comm.isWeiXin()){
                                _this.login();
                            }else{
                                _this.login();
                            }
                        }
                    }else{
                        let url = '/mcall/customer/unite/getMapById/';
                        let that = _this;
                        console.log('准备请求');
                        axios({
                            url: url,
                            method: "POST",
                            data: {
                                "customerId": _this.customerId,
                                "logoUseFlag": 4,
                                "isCustomer": 1,
                                "vFlag": 3
                            },
                            transformRequest: [function(data) {
                                return "paramJson=" + JSON.stringify(data);
                            }],
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            timeout: 30000
                        }).then(function(datas){
                            console.log('请求成功');
                            let dataList = datas.data.responseObject.responseData && datas.data.responseObject.responseData.data_list && datas.data.responseObject.responseData.data_list[0]
                            if (dataList) {
                                let customerAuth = dataList.customer_auth;
                                that.customerName = customerAuth.lastName + customerAuth.firstName;
                                that.hospitalId = customerAuth.companyId;
                                that.aHospitalName = customerAuth.company;
                                that.authState = customerAuth.state;
                                _this.auth(that.authState);
                            }
                        });
                    }
                }
                if (_this.appPort) {
                    ////alert(this.customerId)
                    ////alert(this.authState)
                    console.log(_this.customerId,_this.authState);
                    if (_this.customerId && (parseInt(_this.authState,10) === -1||parseInt(_this.authState,10) === 3)) {
                        _this.auth(_this.authState);
                    } else if (_this.customerId && _this.passState.includes(Number(_this.authState))) {////alert('aaaaa')
                        _this.assistance();
                    } else {
                        console.log('这个逻辑');
                        checkLogin();
                    }
                } else if (comm.isWeiXin()) {
                    console.log('微信登录助力');
                    if (_this.customerId && _this.passState.includes(_this.authState)) {
                        _this.assistance();
                    } else {
                        checkLogin();
                    }
                } else if (_this.isOther) {
                    if (_this.customerId && _this.passState.includes(_this.authState)) {
                        _this.assistance();
                    } else {
                        checkLogin();
                    }


                }
            },
            assistance (type) {
                if(!this.customerId){
                    return false;
                }
                //厂商
                if(this.customerRole==15||this.customerRole==14){
                    this.$refs.tips.showTips('您暂时无法为医院助力');
                    return false;
                }
                let that = this;
                let url = '/mcall/customer/invitation/saveInvitationCustomer/';
                let Data = {
                    paramJson: JSON.stringify({
                        "customerId": that.customerId,
                        "customerName": that.customerName,
                        "invitateCustomerId": that.invitateCustomerId,
                        "hospitalId": that.hospitalId,
                        "hospitalName": that.aHospitalName
                    })
                };
                axios.post(url, qs.stringify(Data)).then(function (datas) {
                    let res = datas && datas.data && datas.data.responseObject && datas.data.responseObject.responseStatus
                    if (res) {
                        that.$refs.tips.showTips('助力成功');
                        window.localStorage.setItem('joined',1)
                        if((type&&type==='auth')){

                        }else{
                            let url = '/dist/caosCheer/caosCheer.html?customerId=&invitateCustomerId='+that.customerId+'#/invite';
                            location.href = url;
                        }
                    } else {
                        that.$refs.tips.showTips('您暂时无法为医院助力')
                    }
                })
            }
        }
    };
</script>
<style lang="scss" rel="stylesheet/scss" scoped></style>


