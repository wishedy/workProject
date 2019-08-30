<template>
    <section>
        <!-- 头像上传 -->
        <section class="al-middleTipsBox ev-showStatus" v-show="uploadIng">
            <section class="al-middleTipsModal al-uploadFigureBox ">
                <figure class="al-middleTipsModalText al-loading">
                    <img src="//img50.allinmd.cn/pages/default/loading.png" alt="">
                    <p>正在上传头像</p>
                </figure>
            </section>
        </section>
        <section class="al-middleTipsBox ev-showStatus" v-show="uploadSuccess">
            <section class="al-middleTipsModal al-uploadFigureBox ">
                <figure class="al-middleTipsModalText al-loadingFinish" style="display: inline-block">
                    <img src="//img50.allinmd.cn/pages/default/loading_finish.png" alt="">
                    <p>上传成功</p>
                </figure>
            </section>
        </section>
        <!--上传头像-->
        <header class="al-personalHead" data-alcode-mod='464'>
            <a href="./personal_setting.html" class="al-personalConfig icon-config ev-setting">设置</a>
            <span class="al-personalShare icon-shareWhite" v-show="hasAuth&&hasShare&&hasLogin">分享</span>
            <article class="al-personalBasicMsg">
                <figure class="al-personalImg ev-hasLogin" v-show="hasLogin">
                    <a href="javascript:;" class="ev-logoUrl" @click="showUpload(true)">
                        <img :src="logoUrl|getLogoUrl">
                    </a>
                </figure>
                <figcaption class="al-personalBasicMsgContent ev-hasLogin" v-show="hasLogin">
                    <h2 :class="vipClass"><span class="ev-name" v-show="hasName">{{name}}</span></h2>
                    <ul class="ev-hasAuth" v-show="hasAuth">
                        <li class="al-personalSnsNum"><a href="./sns.html?action=fans">粉丝<span class="ev-fansNum" :num="csc.fansNum">{{csc.fansNum|toWKH}}</span></a><i class="icon-newTips" v-if="specialCount.fansNum>0"></i></li>
                        <li class="al-personalSnsNum"><a href="./sns.html?action=follow">关注<span class="ev-followNum" :num="csc.followpeopleNum">{{csc.followpeopleNum|toWKH}}</span></a></li>
                        <li class="al-personalSnsNum"><a href="./sns.html?action=praise">赞<span class="ev-upNum" :num="csc.othersUpNum">{{csc.othersUpNum|toWKH}}</span></a><i class="icon-newTips" v-if="specialCount.preferNum>0"></i></li>
                    </ul>
                </figcaption>
            </article>
            <button class="al-personalGoLogin al-whiteBtn ev-noLogin" v-show="!hasLogin" style="display: block" @click="login">登录 / 注册</button>
        </header>
        <section v-html="html" @click="closeAuth"></section>

        <!-- 导航栏部分 -->
        <!--<section class="serviceTime ev_vipIntro" v-show="vipIntro">
            <aside class="serviceTimeCont">
                <p class="close" @click="close"><img src="//img50.allinmd.cn/authentication/auth/close_grey.png"></p>
                <p class="title">认证权益 </p>
                <P class="authGrade">认证后可在唯医、医鼎、医栈、唯医骨科拥有相应权限。根据认证资料完整度，认证分为两个等级：</P>
                <figure class="physicianVip">
                    <p class="titleVip1"><i></i>认证医师<span class="smallTip">上传任1资质证明</span></p>
                    <p class="physicianText">
                        <span></span>
                        <span>在唯医、医鼎、医栈的医师操作权限</span>
                    </p>
                </figure>
                <figure class="physicianVip">
                    <p class="titleVip2"><i></i>执业医师<span class="smallTip">上传4个标星证件</span></p>
                    <p class="physicianText">
                        <span></span>
                        <span style="display:inline-block;width:7.5rem;">拥有V1权限的同时，还具有在唯医骨科进行执业诊疗的权限</span>
                    </p>
                </figure>
            </aside>
        </section>-->
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script type="text/ecmascript-6">
  import TempCache from "static/js/tempcache.js";
  import comm from 'static/js/comm.js';
  import user from 'static/js/module.user.js';
  import Loading from 'components/Loading/Loading';
  import app from 'static/js/comm.app.js';
  import commPopup from 'static/js/commPopup.js';
  import {mapActions,mapGetters} from  "vuex";

  const path={
     customerInfo : "/mcall/customer/unite/getMapById/", //客户信息
     getShare: "/mcall/comm/data/share/getMapList3/",//获取分享话术
     revise :'/mcall/customer/revise/auth/getMapList/'//申请认证状态
  };
  export default{
    data(){
      return {
        unit:{},
        baseInfo:{},
        auth:{},
        csc:{},
        att:{},
        authFlag:{},
        name:'',
        ajaxing:false,
        hasLogin:false,
        hasAuth:false,
        hasShare:true,
        hasName:true,
        vipClass:'',
        html:'',
        vipIntro:false,
        cId:TempCache.getItem('userId')
      }
    },
    computed:{
      ...mapGetters(['logoUrl',"uploadIng","uploadSuccess","customerInfo",'specialCount']),
    },
    methods:{
      ...mapActions(["showUpload","setLogoUrl"]),
      getInitPage(){
        let t=this;
        t.ajaxing=true;
        let responseData={};
        if(TempCache.getItem('customerRole')==2||TempCache.getItem('customerRole')==3||TempCache.getItem('customerRole')==4){
          t.hasShare = false;
        }
        responseData=t.customerInfo;
        t.ajaxing=false;
        if(comm.isEmptyObject(responseData)){
          return;
        }
        t.unit=responseData.customer_unite;
        t.baseInfo=responseData.customer_baseinfo;
        t.auth=responseData.customer_auth;
        t.csc=responseData.customer_statistic;
        t.att=responseData.customer_att;
        t.authFlag = responseData.authFlag;
        t.promptMessage= responseData.comm_data_prompt.promptMessage;
        t.setLogoUrl(t.att.logoUrl);
        if(!TempCache.getItem("passwd")&&TempCache.getItem("passwd")!=null){
          TempCache.setItem("passwd",t.unit.passwd);
        }
        if(t.unit.isValid==0){//TODO:无效用户以及其他端修改密码后本地需要退出登录
          commPopup.popup('您的帐号已被无效，请重新登录');
          setTimeout(function(){
            comm.ajax2({
              url:"/mcall/web/user/logout/",
              data:null,
              dataType:'json',
              type:'post',
              success:function(){
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
                //g_sps.jump(null,"/pages/passport/loginV2/login.html");
              }
            });
          },2000);
        }
        let passwd=TempCache.getItem("passwd");
        if(passwd&&passwd!=null&&!passwd&&t.unit.passwd!=passwd){
          commPopup.popup('您的密码已修改，请重新登录');
          setTimeout(function(){
            comm.ajax2({
              url:"/mcall/web/user/logout/",
              data:null,
              dataType:'json',
              type:'post',
              success:function(){
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
                //g_sps.jump(null,"/pages/passport/loginV2/login.html");
              }
            });
          },2000);
        }
        if(t.auth.state!=2 && t.auth.state!=7 && t.auth.state!=8&& t.auth.state!=9){//未认证auth.state!==1 &&
          t.hasAuth=false;
          t.name = t.auth.lastName+t.auth.firstName;
          if(t.name ==="") t.name = comm.getRegisterName(t.unit.email,t.unit.mobile);
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
              comm.ajax2({
                url: path.revise,
                type: "post",
                data: {paramJson: JSON.stringify({customerId: t.cId})},
                success: function (res) {
                  if (res && res.responseObject && res.responseObject.responseData && JSON.stringify(res.responseObject.responseData)!=="{}") {
                    authing = true;
                  }
                  if(t.promptMessage) {
                      if (authing) {
                          if (t.authFlag == 1) {    //变更中，并且四证已全
                              t.html = '<aside class="personalStar authTip"><span style="border-left:none;">' + t.promptMessage + '</span></aside>';
                          } else {
                              t.html = '<aside class="personalStar authTip"><span style="border-left:none;">' + t.promptMessage + '</span></aside>';
                          }
                      } else {
                          t.html = '<aside class="personalStar"><i></i><b></b><span style="width: 72%;">' + t.promptMessage + '</span><a href="/pages/passport/auth/authInfo.html"><p></p></a></aside>';

                      }
                  }
                }
              });//是否在认证变更中，
              t.vipClass = "al-vipUserV1";
              break;
            case 3://拒绝
              t.html = '<aside class="authTip"><p><i></i>'+t.promptMessage+'</p><a class="ev_goAuthTrack" href="/pages/passport/auth/auth.html">去认证</a></aside>';
              t.hasName=false;
              break;
            case -1: //未认证
              t.html = '<aside class="authTip"><p>'+t.promptMessage+'</p><a class="ev_goAuthTrack"  href="/pages/passport/auth/auth.html">去认证</a></aside>';
              t.hasName=false;
              break;
            case 9://二次认证  4  5
              t.html = '<aside class="personalStar authTip"><i></i><b></b><span>'+t.promptMessage+'</span><a class="ev_goAuthTrack"  href="/pages/passport/auth/auth.html">去认证</a></aside>';
              t.vipClass = "al-vipUserV1";
              break;
            case 8:
              t.vipClass = "al-vipUserV2";  //V2显示
              break;
            case 0:
            case 1:
                t.html = '<aside class="personalStar authTip"><span style="margin-left: 0.4rem;border-left:none;">审核将在1-3个工作日内完成，请耐心等待</span></aside>';
              break;
            case 7:
                t.html = '<aside class="personalStar authTip"><span style="border-left:none;">审核将在1-3个工作日内完成，请耐心等待</span></aside>';
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
        $('.ev_goAuthTrack').click(function(){
          comm.creatEvent({
            triggerType:'去认证',
            keyword:'去认证',
            actionId:23
          });
        });
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
        closeAuth(e){
            if(e.target.localName=='i'){
                $('.uploadStar').hide();
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
        if(location.hash.indexOf('index')>-1){
			url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId+'#/index';
			shareSence=t.GLOBAL.shareSenceConst.personal_host;
        }else if(location.hash.indexOf('contribution')>-1){
			  url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId+'#/contribution';
			  shareSence=t.GLOBAL.shareSenceConst.personal_host;
        }else if(location.hash.indexOf('active')>-1){
			url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId+'#/dynamic';
			shareSence=t.GLOBAL.shareSenceConst.personal_host;
		}else if(location.hash.indexOf('info')>-1){
			url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId+'#/baseInfo';
			shareSence=t.GLOBAL.shareSenceConst.personal_info;
		}else{
			url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+t.cId;
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
            $.ajax({
              type : "post",
              url : path.getShare,
              data : param,
              async:false,
              dataType : "json",
              success : function(rep){
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
                      shareObj.qZoneTitle=el.shareTitle;
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
    components:{
      Loading
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
      "$store.state.specialCount"() {

      },
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss">
    @import 'scss/pages/authentication/personal';
</style>
