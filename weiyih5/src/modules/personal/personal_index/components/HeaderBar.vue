<template>
    <section>
        <header class="al-personalHead homePersonCon" data-alcode-mod='464' @click="goIndexHome" :class="{'al-personalHome':isIndexHome}">
            <section class="personFixed" v-if="isIndexHome">
                <a class="ev_backBtn fixedBack" href="javascript:history.back(-1);">
                    <img src="/static/images/personal/return-White.png" alt="">
                </a>
                <span class="al-personalShare icon-shareWhite" v-show="hasAuth&&hasShare&&hasLogin"></span>
            </section>
            <article class="al-personalBasicMsg" :class="{'personalBase':!isIndexHome}" v-show="hasLogin&&(!factoryNoAuth)">
                <figure class="al-personalImg ev-hasLogin" v-show="hasLogin" @click="logoBigImg">
                    <a href="javascript:;" class="ev-logoUrl">
                        <img :src="logoUrl|getLogoUrl">
                    </a>
                </figure>
                <figcaption class="al-personalBasicMsgContent ev-hasLogin" v-show="hasLogin">
                    <h2 :class="vipClass" class="doctorAuthor"><span class="ev-name doctorName" v-show="name">{{name}}</span></h2>
                    <div class="doctorDesc" v-show="hasName">
                        <p class="doctorMedical" v-text="medicalTitleName"></p>
                        <p class="doctorHos">{{auth.company||auth.schoolName}}</p>
                    </div>
                </figcaption>
                <!--<button class="doctorOther perBotton">关注</button>-->
                <button class="doctorMy perBotton" @click="callApp({text:'编辑主页',tplPath:4,type:13})" v-if="isIndexHome">编辑主页</button>
                <p class="persCenter" v-if="(!isIndexHome&&cId&&(auth.state==2||auth.state==8||auth.state==7||auth.state==9)&&((!factoryNoAuth)&&(customerRole!=15)))" >个人中心</p>
                <p class="persCenter" v-if="isIndexHome&&((factoryNoAuth)||(customerRole==15))"  @click.stop="callApp({text:'编辑主页',tplPath:4,type:13})">编辑资料</p>
            </article>
            <ul class="ev-hasAuth al-personalSnsNumCon" v-show="hasAuth&&isIndexHome">
                <li class="al-personalSnsNum grandNum" v-if="customer_resource_browse>12000">
                    <a href="javascript:;"><p class="ev-fansNum" :num="customer_resource_browse">{{customer_resource_browse}}</p><p class="numName">累计浏览</p></a>
                </li>
                <li class="al-personalSnsNum" :class="{'noGrandNum':customer_resource_browse<12000}" @click="commCreatEvent({id:11245,browType:298})">
                    <a href="./sns.html?action=fans"><p class="ev-fansNum" :num="csc.fansNum">{{csc.fansNum|toWKH}}</p><p class="numName">粉丝</p></a>
                </li>
                <li class="al-personalSnsNum" :class="{'noGrandNum':customer_resource_browse<12000}" @click="commCreatEvent({id:11244,browType:298})">
                    <a href="./sns.html?action=follow"><p class="ev-followNum" :num="csc.followOrgNum">{{csc.followOrgNum|toWKH}}</p><p class="numName">关注</p></a>
                </li>
                <li class="al-personalSnsNum" @click="gototab" :class="{'noGrandNum':customer_resource_browse<12000}">
                    <a href="javascript:;"><p class="ev-upNum" :num="csc.totalPostsNum">{{csc.totalPostsNum|toWKH}}</p><p class="numName">资源</p></a>
                </li>
            </ul>
            <!--<button class="al-personalGoLogin al-whiteBtn ev-noLogin" v-show="!hasLogin" style="display: block" @click="login">登录 / 注册</button>-->
            <section class="al-newNologin ev-noLogin" v-show="!hasLogin&&!isIndexHome&&(!factoryNoAuth)" style="display: block" @click.stop="login">
                <section  class="defalutImg">
                    <img src="https://img00.allinmd.cn/default/customer/190_190.jpg">
                </section>
                <section class="defalutDesc">
                    <p class="p-logBtn">点击登录</p>
                    <p class="p-logDesc">登录后可记录并保存数据</p>
                </section>
            </section>
            <section class="al-newNologin ev-noLogin" v-show="factoryNoAuth" style="display: block" @click.stop="goAuth">
                <section  class="defalutImg">
                    <img src="https://img00.allinmd.cn/default/customer/190_190.jpg">
                </section>
                <section class="defalutDesc">
                    <p class="p-logBtn">立即认证</p>
                    <p class="p-logDesc">享受所有厂商权限</p>
                </section>
            </section>
        </header>
        <section v-html="html" @click="closeAuth" v-if="(!isIndexHome)" v-show="promptMessageShow&&(!factoryNoAuth)"></section>
        <section v-if="isBigImg&&isIndexHome" class="logoBig">
            <figure class="hearTitle">
                <a class="scrollBack" href="javascript:;" @click="isBigImg=false">
                    <img src="/static/images/personal/return-White.png" alt="">
                </a>
                <span class="namecenter">头像大图</span>
            </figure>
            <img :src="getBigLogoUrl(logoUrl)" class="logoImg"/>
        </section>
    </section>
</template>

<script type="text/ecmascript-6">
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm.js';
    import user from 'static/js/module.user.js';
    import app from 'static/js/comm.app.js';
    import commPopup from 'static/js/commPopup.js';
    import {mapActions,mapGetters} from  "vuex";

    const path={
        customerInfo : "/mcall/customer/unite/getMapById/", //客户信息
        getShare: "/mcall/comm/data/share/getMapList3/",//获取分享话术
        revise :'/mcall/customer/revise/auth/getMapList/'//申请认证状态
    };
    export default{
        props:['isIndexHome'],
        data(){
            return {
                unit:{},
                isBigImg:false,
                baseInfo:{},
                auth:{},
                csc:{},
                att:{},
                promptMessageShow:false,
                promptMessageType:-1,
                authFlag:{},
                name:'',
                ajaxing:false,
                hasLogin:false,
                hasAuth:false,
                hasShare:true,
                hasName:true,
                vipClass:'',
                //medicalTitleName:'',
                customer_resource_browse:'',
                html:'',
                vipIntro:false,
                maskCallApp:false,
                cId:TempCache.getItem('userId')
            }
        },
        computed:{
            ...mapGetters(['logoUrl',"uploadIng","uploadSuccess","customerInfo",'specialCount','customerRole']),
            medicalTitleName(){
                let t = this;
                if(comm.isEmptyObject(t.auth)){
                    return '';
                }else{
                    let title = t.auth.medicalTitle;
                    if(title&&title.split(',')){
                        title= title.split(',')[0];
                        if(title.indexOf('_')!=-1){
                            return title.split('_')[1];
                        }else {
                            return title
                        }
                    }else{
                        if(comm.checkInvalid(title)&&((parseInt(t.customerRole,10)===14)||(parseInt(t.customerRole,10)===15))){
                            return  '暂无职称';
                        }
                    }
                }
            },
            factoryNoAuth(){
                let t = this;
                if(t.customerRole==14){
                    if(t.auth.state==3||t.auth.state==9){
                        //认证拒绝
                        return false;
                    }else{
                        return  true;
                    }
                }

            }
        },
        methods:{
            ...mapActions(["showUpload","setLogoUrl","callApp","changeAjax","commCreatEvent",'setCustomerRole']),
            logoBigImg(){
                if(this.isIndexHome){
                    this.isBigImg=true;
                }
            },
            goAuth(){
                let t = this;
                t.callApp({text:'厂商认证',tplPath:4,type:15});
            },
            getBigLogoUrl(logoUrl){
                let imgLogo='//img50.allinmd.cn/pages/personal/no_head.png';
                if(logoUrl){
                    if(logoUrl.indexOf('_c_p_150_150')>-1){
                        imgLogo=logoUrl.split('_c_p_150_150')[0]+logoUrl.split('_c_p_150_150')[1]
                    }else {
                        imgLogo=logoUrl;
                    }
                }
                return imgLogo;
            },
            goIndexHome(){
                if(!this.isIndexHome&&(this.auth.state==2||this.auth.state==8||this.auth.state==7||this.auth.state==9)){
                    this.commCreatEvent({id:11295,browType:312})
                    this.$router.push({
                        path:'IndexHome'
                    })
                }

            },
            gototab(){
                $('html,body').animate({scrollTop: $('.ev-contentCon').offset().top-$('.al-personalScrollHead').height()},800);
                this.$emit('isResource',1);
                this.commCreatEvent({id:11246,browType:298})
            },
            authMedical(title){
                let t = this;
                //t.medicalTitleName = title;
                if(title&&title.split(',')){
                    title= title.split(',')[0];
                    if(title.indexOf('_')!=-1){
                        return title.split('_')[1];
                    }else {
                        return title
                    }
                }else{
                    if(comm.checkInvalid(title)&&((parseInt(t.customerRole,10)===14)||(parseInt(t.customerRole,10)===15))){
                        return  '暂无职称';
                    }
                }
            },
            getInitPage(){
                let t=this;
                let responseData={};
                if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
                    t.hasShare = false;
                }
                responseData=t.customerInfo;
                if(comm.isEmptyObject(responseData)){
                    return;
                }
                t.unit=responseData.customer_unite;
                t.baseInfo=responseData.customer_baseinfo;
                t.customer_resource_browse=responseData.customer_resource_browse;
                t.auth=responseData.customer_auth;
                t.csc=responseData.customer_statistic;
                t.att=responseData.customer_att;
                t.authFlag = responseData.authFlag;
                t.promptMessage= responseData.comm_data_prompt.promptMessage;
                t.promptMessageType= responseData.comm_data_prompt.type;
                t.setCustomerRole(t.unit.customerRole);
                t.setLogoUrl(t.att.logoUrl);
                if(!TempCache.getItem("passwd")&&TempCache.getItem("passwd")!=null){
                    TempCache.setItem("passwd",t.unit.passwd);
                }
                if(t.unit.isValid==0){//TODO:无效用户以及其他端修改密码后本地需要退出登录
                    commPopup.popup('您的帐号已被无效，请重新登录');
                    setTimeout(function(){
                        t.changeAjax(true);
                        comm.ajax2({
                            url:"/mcall/web/user/logout/",
                            data:null,
                            dataType:'json',
                            type:'post',
                            success:function(){
                                t.changeAjax(false);
                                TempCache.clear();
                                if(comm.isApp()){
                                    comm.callAppLogin();
                                }else{
                                    if(g_sps){
                                        g_sps.jump(null,"/pages/passport/loginV2/login.html");
                                    }else{
                                        window.location.href = "/pages/passport/loginV2/login.html";
                                    }

                                }

                            }
                        });
                    },2000);
                }
                let passwd=TempCache.getItem("passwd");
                if(passwd&&passwd!=null&&!passwd&&t.unit.passwd!=passwd){
                    commPopup.popup('您的密码已修改，请重新登录');
                    setTimeout(function(){
                        t.changeAjax(true);
                        comm.ajax2({
                            url:"/mcall/web/user/logout/",
                            data:null,
                            dataType:'json',
                            type:'post',
                            success:function(){
                                t.changeAjax(false);
                                TempCache.clear();
                                if(comm.isApp()){
                                    comm.callAppLogin();
                                }else{
                                    if(g_sps){
                                        g_sps.jump(null,"/pages/passport/loginV2/login.html");
                                    }else{
                                        window.location.href = "/pages/passport/loginV2/login.html";
                                    }

                                }

                            }
                        });
                    },2000);
                }
                if(t.auth.state!=2 && t.auth.state!=7 && t.auth.state!=8&& t.auth.state!=9){//未认证auth.state!==1 &&
                    t.hasAuth=false;
                    t.name = t.auth.lastName+t.auth.firstName;
                    // if(t.name ==="") t.name = comm.getRegisterName(t.unit.email,t.unit.mobile);
                }else {
                    t.hasAuth=true;
                    t.name=t.auth.lastName+t.auth.firstName;
                    t.shareFn(t.auth);
                    window.addEventListener('hashchange',function(){t.shareFn(t.auth)},false);
                }
                //判断当前认证状态展示对应提示   456 改 789
                let _role = TempCache.getItem('customerRole');
                if(_role!=2&&_role!=3&&_role!=4){
                    switch (parseInt(t.auth.state)){
                        case 2:
                            let authing = false;
                            t.changeAjax(true);
                            comm.ajax2({
                                url: path.revise,
                                type: "post",
                                data: {paramJson: JSON.stringify({customerId: t.cId})},
                                success: function (res) {
                                    t.changeAjax(false);
                                    if (res && res.responseObject && res.responseObject.responseData && JSON.stringify(res.responseObject.responseData)!=="{}") {
                                        authing = true;
                                    }
                                    if(t.promptMessage) {
                                        if (authing) {
                                            if (t.authFlag == 1) {    //变更中，并且四证已全
                                                t.html = '<aside class="authTip perAuthTip"><p class="authStar">' + t.promptMessage + '</p></aside>';
                                            } else {
                                                t.html = '<aside class="authTip perAuthTip"><p class="authTrack">' + t.promptMessage + '</p></aside>';
                                            }
                                        } else {
                                            if(parseInt(_role)===12){//20190326判断是否为护士  护士展示完善提示  医生展示补全四证
                                                t.html = '<aside class="authTip perAuthTip"><a class="ev_goAuthTrack goAuthTrack"  href="javascript:;"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">去完善</span></a></aside>';
                                                t.maskCallApp=true;
                                            }else{
                                                if(parseInt(_role)===14||parseInt(_role)===15){
                                                    t.html = '<aside class="authTip perAuthTip"><a href="javascript:void(0);" class="goAuthTrack"><p class="authTrack">' + t.promptMessage + '</p><span class="tipRight"></span></a></aside>';
                                                }else{
                                                    t.html = '<aside class="authTip perAuthTip"><a href="/pages/passport/auth/authInfo.html" class="goAuthTrack"><p class="authTrack">' + t.promptMessage + '</p><span class="tipRight"></span></a></aside>';
                                                }

                                            }
                                        }
                                    }
                                }
                            });//是否在认证变更中，
                            t.vipClass = "al-vipUserV1";
                            break;
                        case 3://拒绝
                            if(parseInt(_role)===14||parseInt(_role)===15){
                                t.html = '<aside class="authTip perAuthTip"><a  class="ev_goAuthTrack goAuthTrack"  href="javascript:void(0);" ><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">重新提交</span></a></aside>';
                            }else{
                                t.html = '<aside class="authTip perAuthTip"><a  class="ev_goAuthTrack goAuthTrack" href="/pages/passport/auth/auth.html"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">重新提交</span></a></aside>';
                            }

                            t.hasName=false;
                            break;
                        case -1: //未认证
                            if(parseInt(_role)===14||parseInt(_role)===15){
                                t.html = '<aside class="authTip perAuthTip"><a  class="ev_goAuthTrack goAuthTrack"  href="javascript:void(0);"><p>'+t.promptMessage+'</p><span class="tipRight">去认证</span></a></aside>';
                            }else{
                                t.html = '<aside class="authTip perAuthTip"><a  class="ev_goAuthTrack goAuthTrack"  href="/pages/passport/auth/auth.html"><p>'+t.promptMessage+'</p><span class="tipRight">去认证</span></a></aside>';
                            }

                            t.hasName=false;
                            break;
                        case 9://二次认证  4  5
                            if(parseInt(_role)===14||parseInt(_role)===15){
                                t.html = '<aside class="authTip perAuthTip"><a class="ev_goAuthTrack goAuthTrack"  href="javascript:void(0);"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">重新提交</span></a></aside>';
                                t.vipClass = "al-vipUserV1";
                            }else{
                                t.html = '<aside class="authTip perAuthTip"><a class="ev_goAuthTrack goAuthTrack"  href="/pages/passport/auth/auth.html"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">重新提交</span></a></aside>';
                                t.vipClass = "al-vipUserV1";
                            }

                            break;
                        case 8:
                            t.vipClass = "al-vipUserV2";  //V2显示
                            if(t.promptMessage){
                                t.html = '<aside class="authTip perAuthTip"><a class="ev_goAuthTrack goAuthTrack"  href="javascript:;"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">去完善</span></a></aside>';
                            }
                            t.maskCallApp=true;
                            break;
                        case 0:
                        case 1:
                            t.html = '<aside class="authTip perAuthTip"><p class="authStar">审核将在1-3个工作日内完成，请耐心等待</p></aside>';
                            break;
                        case 7:
                            t.html = '<aside class="authTip perAuthTip"><p class="authStar">审核将在1-3个工作日内完成，请耐心等待</p></aside>';
                            t.vipClass = "al-vipUserV1";
                            break;
                        //审核中
                    }
                }else{
                    switch (parseInt(t.auth.state)){
                        case 2:
                        case 9:
                        case 8:
                        case 7:
                            t.vipClass = "al-vipUser";
                            break;
                        case 3://拒绝
                        case -1:
                        case 1:
                            t.hasName=false;
                            break;
                        // case 1:break;
                    }
                }
                // $('.ev_goAuthTrack').click(function(){
                //   comm.creatEvent({
                //     triggerType:'去认证',
                //     keyword:'去认证',
                //     actionId:23
                //   });
                // });
                if(parseInt(t.promptMessageType,10)===22){
                    t.html = '<aside class="authTip perAuthTip"><a class="ev_goAuthTrack goAuthTrack"  href="javascript:;"><p class="authTrack">'+t.promptMessage+'</p><span class="tipRight">去完善</span></a></aside>';
                }
                t.promptMessageShow = t.html.length>0;
                $('.uploadStar i').on('click',function(){
                    $('.uploadStar').hide();
                });
                let isFirstTimeAuth =TempCache.getItem("firstTimeAuth");
                if(isFirstTimeAuth){
                    t.showVip();
                }else{
                    if(t.auth.state==2){   //老的认证用户 显示一次等级信息提示auth.state==1||
                        if(!TempCache.getItem('oldAuthVipShow')){
                            TempCache.setItem('oldAuthVipShow','oldAuthVipShow');
                            t.showVip();
                        }
                    }
                }
            },
            //认证权益弹层方法
            showVip(){
                let t=this;
                t.vipIntro=true;
                comm.creatEvent({
                    triggerType:'认证-等级规则',
                    keyword:'认证-等级规则',
                    actionId:2517
                });
                TempCache.removeItem('firstTimeAuth');
                TempCache.setItem('oldAuthVipShow','oldAuthVipShow');
            },
            //关闭认证权益弹层
            close(){
                this.vipIntro=false;
            },
            closeAuth(){
                let authState=this.auth.state;
                let t = this;
                if((parseInt(t.customerRole)===14)||(parseInt(t.customerRole)===15)||parseInt(t.promptMessageType,10)===22){
                    t.callApp({text:'厂商认证',tplPath:4,type:15});
                }else{
                    if(authState!=0&&authState!=1&&authState!=7){
                        this.commCreatEvent({id:11294,browType:312,keyword:this.promptMessage||''});
                    }
                    if(this.maskCallApp){
                        this.callApp({text:'编辑主页',tplPath:4});
                    }
                }


            },
            //分享
            shareFn(auth){
                let t=this;
                //获取分享话术
                let data={};
                data.customerId=t.cId||'';
                data.logoUseFlag=4;
                data.pageIndex=1;
                data.pageSize=1;
                data.useFlag=1;
                data.sceneType=t.GLOBAL.getShareContentSense.my_index;
                data.resourceType=t.GLOBAL.ResouceType.person;
                let param={};
                param.paramJson= JSON.stringify(data);
                //分享
                let href=window.location.href;
                let url="",shareSence;
                if(location.hash.indexOf('IndexHome')>-1){
                    url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId+'#/IndexHome';
                    shareSence=t.GLOBAL.shareSenceConst.personal_host;
                }
                let shareObj={};
                shareAll({
                    url:url,
                    qShareLog:function(x){    //分享新浪，空间成功与否都执行
                        if(x=='sina'){
                            comm.shareLog({
                                shareType: "",
                                resourceId:"" ,
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence:shareSence,
                                shareChannel:3,
                                shareContent:shareObj.sinaTitle
                            });
                        }else{
                            comm.shareLog({
                                shareType: "",
                                resourceId:"" ,
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence:shareSence,
                                shareChannel:1,
                                shareContent:shareObj.qZoneTitle
                            });
                        }
                    },
                    fnMessageSuc:function(){//微信好友
                        comm.shareLog({
                            shareType: "",
                            resourceId:"" ,
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:shareSence,
                            shareChannel:4,
                            shareContent:shareObj.wxTitle
                        });
                    },      //分享好友成功回调
                    fnTimelineSuc:function(){//朋友圈
                        comm.shareLog({
                            shareType: "",
                            resourceId:"" ,
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:shareSence,
                            shareChannel:5,
                            shareContent:shareObj.timeLineTitle
                        });
                    },      //分享朋友圈成功回调
                    triggerRequest:function(){
                        t.changeAjax(true);
                        $.ajax({
                            type : "post",
                            url : path.getShare,
                            data : param,
                            async:false,
                            dataType : "json",
                            success : function(rep){
                                t.changeAjax(false);
                                if(rep&&rep.responseObject.responseStatus){
                                    var shareJson=rep.responseObject.responseData.data_list[0];
                                    var WechatTimeline;
                                    shareObj.pic = shareJson.share_comm.shareImageUrl;
                                    shareObj.title = shareJson.share_comm.shareTitle!=""?shareJson.share_comm.shareTitle:document.title;
                                    shareObj.url = url;
                                    $.each(shareJson.share_channel,function(i,el){
                                        if(el.shareChannel=='Sina'){
                                            shareObj.sinaTitle=el.shareDesc;
                                        }else if(el.shareChannel=="WechatFriend"){
                                            shareObj.wxTitle = el.shareTitle;
                                            shareObj.wxDesc = el.shareDesc.substring(0,60);
                                        }else if(el.shareChannel=="QZone"){
                                            shareObj.qzoneTitle=el.shareTitle;
                                            shareObj.summary = el.shareDesc;
                                        }else if(el.shareChannel=="WechatTimeline"){
                                            shareObj.timeLineTitle=el.shareTitle;
                                        }
                                    });

                                }else{
                                    var shareSummary=comm.cutLine(auth.medicalTitle,"_",",")+auth.workplace+(baseInfo.summary?"个人简介："+baseInfo.summary:'').substring(0,60);
                                    shareObj.summary = shareSummary;
                                    shareObj.title = '推荐'+$(".ev-name").text()+'的唯医个人主页';
                                    shareObj.wxTitle = '推荐'+$(".ev-name").text()+'老师的唯医个人主页，关注可方便查看他的个人动态';
                                    shareObj.wxDesc = shareSummary;
                                    shareObj.sinaTitle = '分享'+$(".ev-name").text()+'的唯个人主页，欢迎与我沟通交流，点击关注';
                                    shareObj.desc = '分享'+$(".ev-name").text()+'的唯个人主页，欢迎与我沟通交流，点击关注';
                                    shareObj.pic = logoUrl;
                                    shareObj.url = url;
                                }
                            },
                            error:function(){}
                        });
                        return shareObj;
                    }
                },false,$('.al-personalShare'));
            },
            //唤醒app
            wakeup(){
                let t=this;
                let amChannel = comm.getpara()._amChannel;
                let callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(t.cId?"&sourceId=" + t.cId:"") + (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:0"+(t.cId?",sourceId:"+  t.cId :'')+ (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=0"+(t.cId?"&sourceId=" + t.cId:"") + (amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                app.appWakeUp("figure",callAppOptions);//下载app层
            },
            login(){
                comm.creatEvent({
                    triggerType:'登录',
                    keyword:"去登录按钮(个人中心)",
                    actionId:17
                });
                TempCache.removeItem('needAuthRegist');
                user.redirectToLogin();
            }
        },
        mounted(){
            this.wakeup();
            if(this.cId){
                this.hasLogin=true;
            }
            if(this.hasLogin){
                this.getInitPage();
            }
        },
        filters:{
            toWKH(num){
                return comm.toWKH(num);
            },
            getLogoUrl(logoUrl){
                return logoUrl!=""?logoUrl:"//img50.allinmd.cn/pages/personal/no_head.png"
            }
        },
        watch: {
            "$store.state.customerInfo"() {
                this.getInitPage();
            },
        }

    }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'scss/pages/authentication/personalNew';

</style>
