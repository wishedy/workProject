<template>
    <section class="al-mainInner">
        <!--申请加入落地页开始-->
        <ApplyInfo></ApplyInfo>
        <!--申请加入落地页结束-->
        <!--收到申请开始-->
        <AlreadyApply></AlreadyApply>
        <!--收到申请结束-->
        <!--认证成功开始-->
        <AuthSuccess></AuthSuccess>
        <!--认证成功结束-->
        <!--申请加入，前往app查看按钮开始-->
        <aside class="applyTeamBtn" v-if="showMoIndex==1||showMoIndex==3" @click="applyClick">
            <p>{{showMoIndex===1?'申请加入':'前往app内查看'}}</p>
        </aside>
        <!--申请加入，前往app查看按钮结束-->
        <Loading v-show="showLoading"></Loading>
        <PopupLayer :popupConfig="popupConfig"></PopupLayer>
        <AlertBox :confirmOption="confirmOption" @ensureClickEvent="ensure"></AlertBox>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache.js";
    import comm from "static/js/comm.js";
    import user from 'static/js/module.user.js';
    import Loading from "components/Loading/Loading.vue";
    import PopupLayer from "components/PopupLayer/PopupLayer.vue";
    import AlertBox from 'components/MonoLayer/AlertBox.vue';
    import ApplyInfo from "./applyInfo";
    import AlreadyApply from "./alreadyApply";
    import AuthSuccess from "./authSuccess";
    import {mapActions, mapGetters} from "vuex";
    import app from 'static/js/comm.app.js';

    const path={
        getAuth:'/mcall/customer/auth/getCustomerAuth/',
        teamMember:"/mcall/caseFolder/team_member/getMapListByTeamId/",//获取登录用户在此团队的信息
        teamBaseinfo:"/mcall/caseFolder/team_baseinfo/getMapById/",//获取团队信息
        createMember:"/mcall/caseFolder/team_member/createMember/"//申请加入
    };
    export default {
        data(){
          return {
              teamId:comm.getpara().teamId,
              userId:TempCache.getItem("userId")!="null"?TempCache.getItem("userId"):'',
              showLoading:false,
              teamState:0,
              popupConfig:'',
              confirmOption:'',
              hasApply:false
          }
        },
        components:{
            Loading,
            PopupLayer,
            ApplyInfo,
            AlreadyApply,
            AuthSuccess,
            AlertBox
        },
        computed:{
            ...mapGetters(['showMoIndex','medArr']),
        },
        methods:{
            ...mapActions(['medArrC','showMoIndexC','setTeamState']),
            //获取当前登录用户是否在此团队
            getTeamMember(){
                let t=this;
                const promise = new Promise(function(resolve,reject){
                    t.showLoading = true;
                    if(t.userId){//已登录
                        comm.ajax2({
                            type:"post",
                            url:path.teamMember,
                            data:{paramJson: JSON.stringify({teamId: t.teamId, customerId: t.userId, isValid: 1})},
                            success:function(data){
                                if (data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length>=1) {
                                    let dataList = data.responseObject.responseData.data_list[0];
                                    //0-待审核  1-审核通过 2-待用户确认 3-审核拒绝
                                    if(dataList.teamState==0){//待审核
                                        t.setTeamState(0);//设置在团队的状态
                                        t.showMoIndexC(3);
                                    }else if(dataList.teamState==1){//审核通过
                                        t.showMoIndexC(1);
                                    }else if(dataList.teamState==2){//被邀请了 需要去消息中确认加入
                                        t.setTeamState(2);//设置在团队的状态
                                        t.showMoIndexC(1);
                                    }else if(dataList.teamState==3){//审核拒绝
                                        t.setTeamState(3);//设置在团队的状态
                                        t.showMoIndexC(1);
                                    }
                                    t.teamState = dataList.teamState;
                                }else{//未申请过
                                    t.teamState = -1;
                                }
                                resolve(t.teamState);
                            }
                        })
                    }else{//如果未登录默认没有申请加入
                        t.teamState = -1;
                        resolve(t.teamState);
                    }
                });
                return promise;
            },
            //申请加入的小组医生和小组信息处理
            commPar(){
                let t=this;
                comm.ajax2({
                    url: path.teamBaseinfo,
                    type: "get",
                    data: {
                        paramJson: JSON.stringify({
                            teamId: t.teamId,
                            visitSiteId: 2,
                            firstResult:0,
                            maxResult:1,
                            isValid:1
                        })
                    },
                    success: function (res) {
                        t.showLoading = false;
                        if(res && res.responseObject.responseData && res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length>0){
                            let data = res.responseObject.responseData.data_list[0];
                            if(t.teamState==-1){//未申请过
                                t.showMoIndexC(1);
                            }
                            t.medArrC(data);
                            t.shareAction(data);
                        }
                    }
                });
            },
            //申请加入按钮点击
            applyClick(){
                let t=this;
                if(!t.hasApply){
                    t.hasApply = true;
                    if(t.showMoIndex===1){//申请加入
                        if(TempCache.getItem("userId")){
                            //未通过认证的用户
                            comm.ajax2({
                                url: path.getAuth,
                                type: "get",
                                success: function (res) {
                                    if(res && res.responseObject &&res.responseObject.responseMessage){
                                        let state;
                                        state = res.responseObject.responseMessage.state;
                                        if(state===0||state===1) {//认证待审核
                                            t.showMoIndexC(2);//提示等待认证通过再申请加入
                                        }else{
                                            t.applyAction();
                                        }
                                    }
                                }
                            });
                        }else{
                            t.applyAction();
                        }
                    }
                }

            },
            //唤醒app
            wakeupApp(){
                let amChannel = comm.getpara()._amChannel;
                let callAppOptions = {
                    ios: "allinmdios://",
                    ios9: "http://app.allinmd.cn/applinks.html"+(amChannel?"?_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235"+(amChannel?"?data={_amChannel:"+amChannel+"}":''),
                    el: ".applyTeamBtn"
                };
                app.bindCallApp(callAppOptions);
            },
            ensure(){
                this.confirmOption='';
            },
            applyAction(){
                let t=this;
                user.privExecute({
                    operateType: 'auth',
                    noNeedBack:true,
                    noCallback:function(){
                        t.hasApply = false;
                    },
                    callback:function(){
                        t.userId = TempCache.getItem("userId");
                        if(t.teamState==1){//已经加入过团队
                            t.popupConfig = JSON.stringify({
                                "msg":"您已加入该团队",
                                "seen":true,
                                "time":3000      //这里可以设置多少毫秒消失
                            });
                            setTimeout(function () {
                                t.popupConfig = JSON.stringify({
                                    "msg":"您已加入该团队",
                                    "seen":false,
                                    "time":3000      //这里可以设置多少毫秒消失
                                });
                                t.hasApply = false;
                            },100);
                            t.hasApply = false;
                        }else if(t.medArr.isApply=="0"){//当前团队不允许申请加入
                            t.confirmOption={
                                'mTitle':"申请失败",
                                'title':"["+t.medArr.teamName+"]团队当前不可被加入",
                                'ensureTitle':"知道了"
                            };
                            t.hasApply = false;
                        }else if(t.teamState==2){//已经被邀请
                            t.confirmOption={
                                'mTitle':"提示",
                                'title':"您已经被该团队邀请<br>请前往唯医骨科app-消息列表中查看",
                                'ensureTitle':"知道了"
                            };
                            t.hasApply = false;
                        }else{
                            t.applyAjax();
                        }
                    }

                })
            },
            //申请加入
            applyAjax(){
                let t=this;
                t.showLoading = true;
                comm.ajax2({
                    url: path.createMember,
                    type: "post",
                    data: {
                        paramJson: JSON.stringify({
                            createType: 1,
                            customerIdList: t.userId,
                            teamId:t.teamId
                        })
                    },
                    success: function (res) {
                        t.hasApply = false;
                        t.showLoading = false;
                        if(res && res.responseObject && res.responseObject.responseStatus){
                            let code = res.responseObject.responseCode;
                            switch (code){
                                case '1201'://不接受加入申请
                                    //t.setTeamState(3);//设置在团队的状态
                                    t.confirmOption={
                                      'mTitle':"申请失败",
                                      'title':"["+t.medArr.teamName+"]团队当前不可被加入",
                                      'ensureTitle':"知道了"
                                    };
                                    break;
                                case '1202'://加入成功
                                    t.setTeamState(0);//设置在团队的状态
                                    t.showMoIndexC(3);//加入成功
                                    break;
                                case '1203'://已经被邀请
                                    t.setTeamState(2);
                                    break;
                                case '1204':
                                    t.confirmOption={
                                        'mTitle':"申请失败",
                                        'title':"您已经被该团队邀请<br>请前往唯医骨科app-消息列表中查看",
                                        'ensureTitle':"知道了"
                                    };
                                    break;
                            }
                        }
                    }
                });
            },
            shareAction(data){//微信分享
                let title=data.authorName+"的团队["+data.teamName+"]",
                    wxDesc="申请成为"+data.authorName+"的["+data.teamName+"]成员";
                shareAll({
                    title: title,
                    url: window.location.href,//不传默认取当前地址
                    wxTitle: title,//微信分享标题
                    wxDesc:wxDesc,//微信分享描述
                    timeLineTitle: wxDesc,
                    sinaTitle:title,//新浪title
                    desc: wxDesc,//新浪的描述
                    qzoneTitle:title,//qq空间title
                    summary: wxDesc,//qq空间的描述
                }, true);
            },
            //隐藏分享
            weixinHideShare(){
                function onBridgeReady() {
                    WeixinJSBridge.call('hideOptionMenu');
                }
                var useragent = navigator.userAgent;
                if (useragent.match(/MicroMessenger/i) == 'MicroMessenger') {
                    if (typeof WeixinJSBridge == "undefined") {
                        if (document.addEventListener) {
                            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                        } else if (document.attachEvent) {
                            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                        }
                    } else {
                        onBridgeReady();
                    }
                }
            }
        },
        mounted(){
            let t=this;
            t.getTeamMember().then(()=>{
                t.commPar();
            });
            //t.weixinHideShare();
        },
        watch:{
            "$store.state.showMoIndex"(){
                let t=this;
                if(this.$store.state.showMoIndex==3){
                    setTimeout(function () {
                        t.wakeupApp();
                    },500);
                }
            }
        }
    }
</script>