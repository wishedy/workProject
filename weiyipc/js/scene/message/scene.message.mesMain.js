/**
 * 功能描述：消息页面的列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/02.
 * Change by HJ on 2018/07/13.
 */

$(function(){
    var listBox=$(".Ev-MesListAppend");
    var apParentBox=$(".Ev-mesSysAppendClass");
    var noList=$(".Ev-mesNoList");
    var controller={
        config:{
            pageIndex:1,
            pageSize:10,
            messageType:1,//系统消息不传messageType，其余4类都传1
            dataFlag:2,
            sortType:2,
            logoUseFlag:3
        },
        path:{
            customerInfo : PC_CALL+"customer/unite/json_info/", //个人信息
            mesRemindList:PC_CALL+"customer/message/json_remindGroupList/",//关注提醒列表
            deleteReadOp:PC_CALL+"customer/message/update3/",//删除操作和未读变成已读
            mesDoctorList:PC_CALL+"customer/message/getPeopleList/",//关注提醒获取医师列表
            mesAllStatus:PC_CALL+"customer/message/json_grouplist3/",//消息的总状态和系统消息
            mesPreferList:PC_CALL+"customer/message/json_preferList/",//赞了我的列表
            mesTrendsList:PC_CALL+"customer/message/getMapList3/",//提醒我看的列表
            getMapListByTeamId:PC_CALL+"caseFolder/team_member/getMapListByTeamId/",//病历夹 获取团队下面的成员
            updateTeamState:PC_CALL+"caseFolder/team_member/updateState/"//病历夹 接受团队邀请
        },
        init:function(){
            var t=this;
            t.login();
            t.logBrowse();
        },
        logBrowse:function(){
          var t = this;
            var locationParam=comm.getpara("#");
          switch (locationParam.tab){
              case 'attention':
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:409});
                  },2200);
                  break;
              case 'review':
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:411});
                  },2200);
                  break;
              case 'remind':
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:412});
                  },2200);
                  break;
              case 'praise':
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:413});
                  },2200);
                  break;
              case 'system':
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:414});
                  },2200);
                  break;
              default:
                  setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:409});
                  },2200);
                  break;
          }
        },
        ajaxFn:function(opt) {
            comm.LightBox.showloading();
            var cfg = opt;
            $.ajax({
                url: cfg.url,
                type: 'post',
                data: {paramJson: $.toJSON(cfg.param)},
                dataType: 'json',
                async:opt.async?opt.async:true,
                success: function (data) {
                    comm.LightBox.hideloading();
                    if (data) {
                        cfg.fn(data);
                    }
                }
            });
        },
        //登录认证
        login:function(x) {
            var t=this;
            var loginStatus=$("#sesCustomerId").val();
            var _navLi= $(".Ev-ul-NavBarClick li");
            if(x){//判断从发布登录重新获取资源
                $(".al-release_popBox").attr('reloadData',1);
            }
            //var _tit= $("title");
            if(loginStatus){//已经登录
                $(".Ev-messageNoLogin").hide();
                $(".Ev-messageLogin").show();
                t.cusInfoAjax();//用户的信息
                t.mesTopNavStatus();//导航徽标提示
                t.navTabClick();//导航点击切换内容
                t.locationParamOp();//导航和内容请求
            }else{//未登录
                var mesNoLogin=$(".Ev-messageNoLogin");
                mesNoLogin.show();
                t.loginClick();
                t.navTabClick();
                var locationParam=comm.getpara("#");
                if(locationParam.tab=="attention"||!locationParam.tab){
                    document.title="关注提醒－唯医,allinmd";
                    mesNoLogin.find("h2").text("关注提醒");
                    _navLi.eq(0).addClass("active").siblings().removeClass("active");
                }
                if(locationParam.tab=="review"){
                    document.title="评论我的－唯医,allinmd";
                    mesNoLogin.find("h2").text("评论我的");
                    _navLi.eq(1).addClass("active").siblings().removeClass("active");
                }
                if(locationParam.tab=="remind"){
                    document.title="提醒我看－唯医,allinmd";
                    mesNoLogin.find("h2").text("提醒我看");
                    _navLi.eq(2).addClass("active").siblings().removeClass("active");
                }
                if(locationParam.tab=="praise"){
                    document.title="赞了我的－唯医,allinmd";
                    mesNoLogin.find("h2").text("赞了我的");
                    _navLi.eq(3).addClass("active").siblings().removeClass("active");
                }
                if(locationParam.tab=="system"){
                    document.title="系统消息－唯医,allinmd";
                    mesNoLogin.find("h2").text("系统消息");
                    _navLi.eq(4).addClass("active").siblings().removeClass("active");
                }
           /*     if(locationParam.tab=="score"){
                    _tit.text("收到评分－唯医,allinmd");
                    mesNoLogin.find("h2").text("收到评分");
                    _navLi.eq(5).addClass("active").siblings().removeClass("active");
                }
*/

            }
        },
        //立即登录按钮
        loginClick:function(){
            var t=this;
            $(".Ev-MesLoginBtn").off("click").on("click",function(){
                user.login({
                    callback:function(){
                        $(".Ev-messageNoLogin").hide();
                        $(".Ev-messageLogin").show();
                        $(".al-release_popBox").attr('reloadData',1);
                        t.cusInfoAjax();//用户的信息
                        t.mesTopNavStatus();//导航徽标提示
                        t.navTabClick();//导航点击切换内容
                        t.locationParamOp();//导航和内容请求
                    },
                    scene:privilegeSceneConst.eSceneTypeLogin,
                    onAuthCancel:function(){
                        g_sps.jump(null,window.location.href);
                    }
                });
            });
        },
        //导航选中和数据请求操作
        locationParamOp:function(){
            var t=this;
            var _navLi= $(".Ev-ul-NavBarClick li");
            var locationParam=comm.getpara("#");
            var sysClass=$(".Ev-mesSysAppendClass");
            sysClass.removeClass("al-systemMessage");
            if(locationParam.tab=="attention"||!locationParam.tab){//关注提醒
                document.title="关注提醒－唯医,allinmd";
                //comm.Log.createBrowse({href:location.href,id:54,name:'关注提醒'});

                _navLi.eq(0).addClass("active").siblings().removeClass("active");
               /* $.ajax({
                    url:PC_CALL+"customer/message/update3/",
                    type:"POST",
                    data:{paramJson: $.toJSON({opTypeRules:4,dataFlag:2})},
                    dataType:"json",
                    success:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseStatus&&data.responseObject.responseStatus==true){*/
                            t.mesAttentionList();
                 /*       }
                    }
                });*/
            }
            if(locationParam.tab=="review"){//评论我的
                document.title="评论我的－唯医,allinmd";
                //comm.Log.createBrowse({href:location.href,id:55,name:'评论我的'});


                _navLi.eq(1).addClass("active").siblings().removeClass("active");
                apParentBox.hide();
                t.mesReviewShowList();
            }
            if(locationParam.tab=="remind"){//提醒我看
                document.title="提醒我看－唯医,allinmd";
                //comm.Log.createBrowse({href:location.href,id:56,name:'提醒我看'});


                _navLi.eq(2).addClass("active").siblings().removeClass("active");
                t.mesTrendsShowList();
            }
            if(locationParam.tab=="praise"){//赞了我的
                document.title="赞了我的－唯医,allinmd";
                //comm.Log.createBrowse({href:location.href,id:57,name:'赞了我的'});


                _navLi.eq(3).addClass("active").siblings().removeClass("active");
                t.praiseMe();
                t.mesPreferShowList();
            }
            if(locationParam.tab=="system"){//系统消息
                document.title="系统消息－唯医,allinmd";
                //comm.Log.createBrowse({href:location.href,id:53,name:'消息列表'});


                sysClass.addClass("al-systemMessage");
                _navLi.eq(4).addClass("active").siblings().removeClass("active");
                t.mesSystemShowList();
            }
         /*   if(locationParam.tab=="score"){//收到评分
                document.title="收到评分－唯医,allinmd";
                comm.Log.createBrowse({href:location.href,id:53,name:'消息列表'});
                sysClass.addClass("al-systemMessage");
                _navLi.eq(5).addClass("active").siblings().removeClass("active");
                t.mesSystemShowList();
            }*/
        },
        //顶部导航的状态判断(与系统消息共用接口)
        mesTopNavStatus:function(){
            var t=this;
            var _Li=$(".Ev-NavNewNumTips");
            var _cla="al-newNumTips";
                t.ajaxFn({
                url: t.path.mesAllStatus,
                param:{
                    dataFlag: t.config.dataFlag,
                    logoUseFlag: t.config.logoUseFlag,
                    pageIndex:t.config.pageIndex,
                    pageSize:t.config.pageSize,
                    sortType: t.config.sortType
                },
                fn:function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        var navStatus=rep.responseObject.responseData;
                        if(navStatus.groupCount){//关注提醒
                            _Li.eq(0).addClass(_cla);
                        }else{
                            _Li.eq(0).removeClass(_cla);
                        }
                        if(navStatus.reviewNoReadCount){//评论我的
                            _Li.eq(1).addClass(_cla);
                        }else{
                            _Li.eq(1).removeClass(_cla);
                        }
                        if(navStatus.remindNoReadCount){//提醒我看
                            _Li.eq(2).addClass(_cla);
                        }else{
                            _Li.eq(2).removeClass(_cla);
                        }
                        if(navStatus.preferNumCount){//赞了我的
                            _Li.eq(3).addClass(_cla);
                        }else{
                            _Li.eq(3).removeClass(_cla);
                        }
                        if(navStatus.sysNoReadCount){//系统消息
                            _Li.eq(4).addClass(_cla);
                        }else{
                            _Li.eq(4).removeClass(_cla);
                        }
                     /*   if(navStatus.sysNoReadCount){//收到评分
                            _Li.eq(5).addClass(_cla);
                        }else{
                            _Li.eq(5).removeClass(_cla);
                        }*/
                    }
                }
            });
        },
        //用户信息
        cusInfoAjax:function(){
            var t=this;
            var param={};
            param.customerId= $("#sesCustomerId").val();
            t.ajaxFn({
                url: t.path.customerInfo,
                param:param,
                fn:function(data){
                    if (!data || !data.responseObject.responseStatus) {
                        g_sps.jump(null,"/");
                        return false;
                    }
                    var list = data.responseObject.responseData.data_list[0];
                    var unit,_auth,csc,att;
                    unit = list.customer_unite;
                    _auth = list.customer_auth;//姓名，
                    csc = list.customer_statistic;//粉丝，点赞，关注
                    att = list.customer_att;//头像
                    //判断头像
                    var logoUrl = "//img10.allinmd.cn/default-user/user_img65.png";
                    if (att.logoUrl !== "") logoUrl = att.logoUrl;
                    $(".Ev-LogoUrl img").attr("src",logoUrl);
                    //认证状态
                    t.authState=_auth.state;
                    if (_auth.state !== 1 && _auth.state !== 2 && _auth.state !== 7 && _auth.state !== 8 && _auth.state !== 9) {//未认证
                        var nickname = _auth.lastName + _auth.firstName;
                        if (nickname === "") nickname =comm.getRegisterName(unit.email,unit.mobile);
                        $(".Ev-mesUserName").text(nickname);
                        if($(".al-mesMainR").find('.Ev-noAuth').length==0){
                            $('<span class="no_auth Ev-noAuth" style="position: relative;top:20px;background:#f5f6f8;padding:3px 10px;border-radius:25px;color:#a5a6a8;">您尚未认证</span>').insertBefore($(".Ev-mesUserTitle"));
                        }
                        //$(".Ev-mesUserTitle").text("");//职称
                        $(".Ev-mesCompany").text("尚未认证");
                    } else {
                        var name = _auth.lastName + _auth.firstName;
                        $(".Ev-mesUserName").html(name+'<i></i>');//姓名
                        $(".Ev-mesUserTitle").text(_auth.medicalTitleShow);//职称
                        $(".Ev-mesCompany").text(_auth.company);//医院
                    }
                    $(".Ev-mesFansNum").text(csc.fansNum);//粉丝
                    // $(".Ev-mesFollowNum").text(csc.followpeopleNum);//关注
                    $(".Ev-mesFollowNum").text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);//关注
                    $(".Ev-mesUpNum").text(csc.othersUpNum);//点赞
                }
            });
            t.getRenZhengPop();//认证弹层
        },
        //认证
        getRenZhengPop:function(){
            $(document).on('click','.Ev-noAuth',function(){
                auth.showAuthPage({
                    callback:function(){
                        $(".al-mesMainR").find('.Ev-noAuth').remove();
                        controller.login();
                    },
                    onAuthCancel:function(){},
                    privCheckFailed:function(){}
                });

            });
        },
        //关注提醒列表
        mesAttentionList:function(){
            var t=this;
            var groupCount;
            var liP=1;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag= t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            param.messageType=t.config.messageType;
            param.groupDateType=1;
            t.ajaxFn({
                url:t.path.mesRemindList,
                param: param,
                fn:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0){
                        var items=data.responseObject.responseData.data_list;
                        apParentBox.show();
                        noList.hide();
                        t.mesAttentionAddHtml(items,liP);
                        t.listCssStyle(items);
                        $(".page-container").show();
                        groupCount=Math.ceil(data.responseObject.responseData.groupCount/ t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick });
                    }else{//关注提醒，无列表
                        apParentBox.hide();
                        noList.show().find("h2").text("关注提醒");
                        $(".page-container").hide();
                    }
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url:t.path.mesRemindList,
                    param:{
                        dataFlag:t.config.dataFlag,
                        pageIndex: pageclickednumber,
                        pageSize: t.config.pageSize,
                        logoUseFlag:t.config.logoUseFlag,
                        sortType:t.config.sortType,
                        messageType:t.config.messageType,
                        groupDateType:1
                    },
                    fn:function(data){
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                            var items=data.responseObject.responseData.data_list;
                            t.mesAttentionAddHtml(items,liP);
                            t.listCssStyle(items);
                        }
                    }
                });
            };
        },
        //赞了我的列表
        mesPreferShowList:function(){
            var t=this;
            var liP=4;
            var groupCount;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            param.messageType=t.config.messageType;
            param.groupDateType=2;
            t.ajaxFn({
                url:t.path.mesPreferList,
                param: param,
                fn:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0){
                        var items=data.responseObject.responseData.data_list;
                        apParentBox.show();
                        noList.hide();
                        t.mesAttentionAddHtml(items,liP);
                        t.listCssStyle(items);
                        $(".page-container").show();
                        groupCount=Math.ceil(data.responseObject.responseData.total_count/t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick });
                    }else{
                        noList.show().find("h2").text("赞了我的");
                        apParentBox.hide();
                        $(".page-container").hide();
                    }
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url:t.path.mesPreferList,
                    param:{
                        dataFlag:t.config.dataFlag,
                        pageIndex: pageclickednumber,
                        pageSize: t.config.pageSize,
                        logoUseFlag:t.config.logoUseFlag,
                        sortType:t.config.sortType,
                        messageType:t.config.messageType,
                        groupDateType:2
                    },
                    fn:function(data){
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                            var items=data.responseObject.responseData.data_list;
                            t.mesAttentionAddHtml(items,liP);
                            t.listCssStyle(items);
                            //listBox.show(); //$(".page-container").show();
                        }
                    }
                });
            };
        },
        //关注提醒、赞了我的添加html
        mesAttentionAddHtml: function (items,kv) {
            var t=this,html,html2,onePerLogo,customerName,redPoint="",messageName,cusCount,moreReadStyle;
            html2="";
            var messageId;
            var _logo='//img10.allinmd.cn/default-user/user_img65.png';
            $.each(items,function(i,e){
                if(kv==1){//关注提醒
                    rType= e.resourceType;
                }else if(kv==4){//赞了我的
                    rType=e.refType;
                }
                if(e.logo_url_list&&e.logo_url_list.length){
                    _logo=e.logo_url_list[0].logoUrl;
                }
                cusCount=e.customer_Count;//评论人数
                if(cusCount==1){//人数
                    onePerLogo='<figure class="al-contentCommentUserImg">'+
                        '<a class="Ev-mesOnePer"  data-perCenter="/pages/personal/others_contribution.html?cid='+e.customer_List+'" href="javascript:;">'+
                        '<img class="Ev-mesOnePerImg" src="'+_logo+'" alt="">'+
                        (e.isRead!=1?'<i class="al-contentCommentTips"></i>':"")+//未读状态
                        '</a>'+
                        '</figure>';
                    redPoint='';
                    moreReadStyle="";
                }else{//多人状态
                    onePerLogo="";
                    if(e.isRead==0){
                        redPoint='<i class="redPoint"></i>';//多人未读
                        moreReadStyle="al-redPointComment";
                    }else{
                        redPoint='';
                        moreReadStyle="";
                    }
                }
                if(cusCount>3){//关注的人名
                    customerName=e.logo_url_CustomerName+'等'+cusCount+'人';
                }else{
                    customerName=e.logo_url_CustomerName;
                }
                messageNameA=e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");//屏蔽的
                messageNameB='《'+e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'》';//正常的
                messageId=(e.messageId.lastIndexOf(",")>-1)?e.messageId:e.messageId+",";
                if(rType!=8){//资源
                    if(e.messageIsValid!=1&& e.messageIsValid!=""){//屏蔽的资源
                        messageContent='<p class="al-contentCommentText"><span class="Ev-mesIsReadBtn"' +
                            'data-ReUrl="'+(e.resourceUrl?(rType!=8?e.resourceUrl:e.resourceUrl+"#reviewArea"):1)+'"> '+messageNameA+'</span>' +
                            '</p>';//终端评论区
                    }else{//正常的资源
                        messageContent=  '<p class="al-contentCommentText">'+ t.getResourceCon(rType)+':<span class="Ev-mesIsReadBtn"' +
                            'data-ReUrl="'+(e.resourceUrl?(rType!=8?e.resourceUrl:e.resourceUrl+"#reviewArea"):1)+'"> '+messageNameB+'</span>' +
                            '</p>';//终端评论区
                    }
                }else{//评论
                    if(e.messageIsValid!=1&& e.messageIsValid!=""){//屏蔽的评论
                        messageContent='<p class="al-contentCommentText"><span class="Ev-mesIsReadBtn"' +
                            'data-ReUrl="'+(e.resourceUrl?(rType!=8?e.resourceUrl:e.resourceUrl+"#reviewArea"):1)+'"> '+messageNameA+'</span>' +
                            '</p>';//终端评论区
                    }else{//正常的评论
                        messageContent='<p class="al-contentCommentText">'+ t.getResourceCon(rType)+':<span class="Ev-mesIsReadBtn"' +
                            'data-ReUrl="'+(e.resourceUrl?(rType!=8?e.resourceUrl:e.resourceUrl+"#reviewArea"):1)+'"> '+messageNameA+'</span>' +
                            '</p>';//终端评论区
                    }
                }
                html2+='<section class="al-contentComment SSS Ev-mesListBox" data-flag="1" data-mesId="'+messageId+'"' +
                    ' data-opType="'+e.opType+'" data-resType="'+rType+'" data-resId="'+ e.resourceId+'" '+
                    (e.messageSrcTime?'data-cMesT="'+e.messageSrcTime+'"':'')+'>'+
                        '<b class="Ev-selectHover hide al-contentComment_round"></b>'+//删除图标
                        onePerLogo+
                        '<section class="al-contentCommentMain al-login_contentCommentMain '+moreReadStyle+'">'+
                            '<article class="al-contentCommentItem">'+
                                '<article class="al-contentCommentItemTitle">'+
                                redPoint+
                                '<a class="al-contentCommentUserName Ev-mesCustomerNameList" ' +
                                'data-tit="'+(cusCount!=1?cusCount:"")+'"'+(cusCount==1?'data-oPer="1"':'')+'>'+customerName+
                                (cusCount==1?'<i class="al-vipUser"></i>':'')+//大V
                                '</a>'+
                                '<span>'+ t.getOpConText(e.opType)+'</span>'+
                                '<p class="al-contentCommentTime">'+(e.messageTime&&!$.isEmptyObject(e.messageTime)?comm.date.diffDay_one(e.messageTime.substr(0,19),comm.date.local_time()):"")+'</p>'+
                                '</article>'+
                            '</article>'+
                            messageContent+
                        '</section>'+
                    '</section>';
            });
            t.commHeadHtml(kv);
            $(".Ev-mesReviewListCon").html(html2);
            $(".Ev-mesIsReadBtn").each(function(){
                $(this).expandShrink({len:100});
            });
            t.mesOperateClick();//编辑删除
            t.mesAttentionIsRead();//未读变更
        },
        //关注提醒,赞了我的，变更成已读,查看医师列表
        mesAttentionIsRead:function(){
            var t=this,href,cMesSTime,opTypeRules;
            $('.Ev-mesListBox').click(function(e){
                var $this=$(this);
                var terminalUrl=$(this).find(".Ev-mesIsReadBtn").attr("data-ReUrl");//终端页链接
                if($(".Ev-mesOpBtn").attr("data-flag")==1){
                    if(e.target.nodeName==="A"){//请求医师列表
                        $("body").css("overflow","hidden");
                        var customerListNum=$(this).find(".Ev-mesCustomerNameList").attr("data-tit");//评论的人数
                        var oneCustomer=$(this).find(".Ev-mesCustomerNameList").attr("data-oPer");//一个人的时候去个人中心
                        if(customerListNum){
                            var param={};
                            if($(this).attr("data-cMesT")){//赞了我的
                                cMesSTime=$(this).attr("data-cMesT");
                                opTypeRules=2;
                                param.opType=$(this).attr("data-opType");
                            }else{//提醒我看
                                cMesSTime="";
                                opTypeRules=1;
                            }
                            param.logoUseFlag= t.config.logoUseFlag;
                            param.pageIndex=t.config.pageIndex;
                            param.pageSize=t.config.pageSize;
                            param.resourceType=$(this).attr("data-resType");
                            param.refId=$(this).attr("data-resId");
                            param.dataFlag=t.config.dataFlag;
                            param.messageType=1;//1为会员消息，2为系统消息
                            param.opTypeRules=opTypeRules;//
                            param.comparMessageSrcTime=cMesSTime;//赞了我的
                            t.ajaxFn({
                                url: t.path.mesDoctorList,
                                param:param,
                                fn:function(data){
                                    if(data&&data.responseObject&&data.responseObject.responseData){
                                        var items=data.responseObject.responseData.data_list;
                                        $(".Ev-mesDocPopText").text(customerListNum);
                                        $(".Ev-mesDoctorList").show();
                                        var arrHT=t.doctorListHtml(items);
                                        $(".Ev-mesDocListBox").html(arrHT);
                                        $(".Ev-mesDocPopCloseBtn").off("click").on("click",function(){
                                            $(".Ev-mesDoctorList").hide();
                                            $(".Ev-mesDocListBox").empty();
                                            $("body").css("overflow","auto");
                                            //事件埋点
                                            comm.creatEvent({
                                                triggerType:"全站功能按钮点击",
                                                keyword:"查看讨论医师列表关闭",
                                                actionId:43
                                            });
                                        });
                                        if(items.length< t.config.pageSize){
                                            $(".Ev-mesDocListBox").attr("scrollPagination", "disabled");
                                        }
                                        t.scrollPage($this);
                                    }
                                }
                            });
                        }else if(oneCustomer){/*解决IE浏览器的出现短暂404空白页面问题*/
                            var href = $(this).find("a.Ev-mesOnePer").attr("data-perCenter");
                            g_sps.jump(null,href,true);
                        }else{
                            if(terminalUrl!=1){
                                g_sps.jump(null,terminalUrl,true);
                            }
                        }
                    }else if(e.target.className=="Ev-mesOnePerImg"){
                        var href = $(this).find("a.Ev-mesOnePer").attr("data-perCenter");
                        g_sps.jump(null,href,true);
                    } else if(e.target.className != "al-contentCollapse expandOrShrink cursor"){//请求未读变成已读,整条点击
                        if(terminalUrl!=1){
                            g_sps.jump(null,terminalUrl,true);
                        }
                        var messageIdListParam=$(this).attr("data-mesId");
                        if($(this).find(".redPoint").length||$(this).find(".al-contentCommentTips").length){
                            if($(".al-contentCommentMain").hasClass("al-redPointComment")){
                                $(".al-contentCommentMain").removeClass("al-redPointComment");
                            }
                            t.ajaxFn({
                                url: t.path.deleteReadOp,
                                param:{
                                    opTypeRules: 2,
                                    messageIdList:messageIdListParam,
                                    isRead:1
                                },
                                fn:function(data){
                                    if(data&&data.responseObject&&data.responseObject.responseStatus){
                                        //t.locationParamOp();//导航hover和内容请求
                                        $this.find(".redPoint").remove();
                                        $this.find(".al-contentCommentTips").remove();
                                        t.mesTopNavStatus();//导航徽标提示
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        //关注提醒、赞了我的的医师列表
        doctorListHtml:function(items){
            var arrHT=[];
            $.each(items,function(i,e){
                var att= e.customer_att;
                var auth= e.customer_auth;
                var statistic= e.customer_statistic;
                contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                    cid:auth.customerId,
                    userName:auth.customerName,
                    logoUrl:att.logoUrl,
                    state: 2,
                    medicalTitle: auth.medicalTitleShow,
                    company: auth.company,
                    contribuNum:contribuNum.toW(),
                    reviewNum:statistic.reviewNum.toW(),
                    // fansNum:statistic.followpeopleNum.toW(),
                    fansNum:statistic.followOrgNum?statistic.followOrgNum.toW():statistic.followpeopleNum.toW(),//关注数
                    relationship:auth.relation
                }));
            });
            return arrHT;
        },
        //赞了我的,全部已读操作
        praiseMe:function(){
            var t=this;
            var prLi=$('.Ev-ul-NavBarClick li:eq(3)');
            prLi.siblings('li').on("click",function(){
                if(prLi.find("i.al-newNumTips").length){
                    t.ajaxFn({
                        url: t.path.deleteReadOp,
                        param:{
                            opTypeRules: 3,
                            opType:5,
                            isRead:1,
                            customerId:$("#sesCustomerId").val()
                        },
                        fn:function(data){
                            if(data&&data.responseObject&&data.responseObject.responseStatus){
                                t.locationParamOp();//导航hover和内容请求
                                t.mesTopNavStatus();//导航徽标提示
                            }
                        }
                    });
                }
            });
        },
        //评论我的列表
        mesReviewShowList:function(){
            var t=this;
            //apParentBox.show();
            t.commHeadHtml(2);
            module.reviewPage({$context:$('.Ev-mesReviewListCon'),$pages:$('.pager'),pageSize:10,callback:function(){
                t.mesOperateClick();
                t.mesIsReadReview();
                if($(".Ev-mesListBox").length>0){
                    $(".page-container").show();
                    noList.hide();
                    apParentBox.show();
                    t.listCssStyle($(".Ev-mesListBox"));
                }else{
                    noList.show().find("h2").text("评论我的");
                    apParentBox.hide();
                    $(".page-container").hide();
                }
            }});

            //t.mesOperateClick();//编辑删除
            //t.mesIsReadReview();//已读变成未读
        },
        //评论我的的已读和跳转
        mesIsReadReview:function(){
            var t=this,messageIdListParam,href,terminalUrl;
            $(".al-contentCommentMain").on("click",function(e){
                messageIdListParam = $(this).parents(".Ev-mesListBox").attr("data-mesId");
                terminalUrl=$(this).parents(".Ev-mesListBox").attr("data-ReUrl");
                if($(".Ev-mesOpBtn").attr("data-flag")==1) {//未编辑状态
                    if( (e.target.className=="al-contentCommentUserName ev-reviewUsername Ev-mesPersonalCenter") || (e.target.className=="al-contentCommentUserName Ev-mesPersonalCenter"&&e.target.className!="al-coomentWatchBtn ev-viewDialog"&&e.target.nodeName!='IMG')){
                       var href=$(this).parents(".Ev-mesListBox").find("a.Ev-mesPersonalCenter").attr("data-perCenter");
                       g_sps.jump(null,href,true);
                    }else if(e.target.className!="al-coomentWatchBtn ev-viewDialog"&&e.target.nodeName!='IMG'&&!$(e.target).parent().hasClass("ev-review")&&e.target.className!="ev-share"&&e.target.nodeName!="I"&&e.target.className!="al-contentCollapse expandOrShrink cursor"){
                        if(terminalUrl!=1){
                            g_sps.jump(null,terminalUrl,true);
                            //return false;
                        }
                        if($(this).parents(".Ev-mesListBox").find(".al-contentCommentTips").length){//有未读标志再进行请求
                            var $this=$(this);
                            t.ajaxFn({
                                url: t.path.deleteReadOp,
                                param: {
                                    opTypeRules: 2,
                                    messageIdList: messageIdListParam,
                                    isRead: 1
                                },
                                fn: function (data) {
                                    if (data && data.responseObject && data.responseObject.responseStatus) {
                                        //t.locationParamOp();//导航hover和内容请求
                                        $this.parents(".Ev-mesListBox").find(".al-contentCommentTips").remove();
                                        t.mesTopNavStatus();//导航徽标提示
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },
        //提醒我看的消息列表
        mesTrendsShowList:function(){
            var t=this;
            var groupCount;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.messageType=t.config.messageType;
            param.isRemind=1;
            param.isShowRef=1;
            param.sortType=t.config.sortType;
            param.isRemindOrReply=2;//提醒我看2，评论我的1
            param.isShowAtt=1;
            t.ajaxFn({
                url:t.path.mesTrendsList,
                param: param,
                fn:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0){
                        var items=data.responseObject.responseData.data_list;
                        apParentBox.show();
                        noList.hide();
                        t.mesTrendsAddHtml(items);
                        t.listCssStyle(items);
                        $(".page-container").show();
                        groupCount=Math.ceil(data.responseObject.responseData.totalCount/t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick });
                    }else{
                        noList.show().find("h2").text("提醒我看");
                        apParentBox.hide();
                        $(".page-container").hide();
                    }
                }
            });
            PageClick = function(pageclickednumber){
                    t.ajaxFn({
                        url:t.path.mesTrendsList,
                        param:{
                            dataFlag:t.config.dataFlag,
                            pageIndex:pageclickednumber,
                            pageSize:t.config.pageSize,
                            logoUseFlag:t.config.logoUseFlag,
                            isRemind:1,
                            messageType:t.config.messageType,
                            isShowRef:1,
                            sortType:t.config.sortType,
                            isRemindOrReply:2,//提醒我看2，评论我的1
                            isShowAtt:1
                        },
                        fn:function(data){
                            $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                            if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                                var items=data.responseObject.responseData.data_list;
                                t.mesTrendsAddHtml(items);
                                t.listCssStyle(items);
                                //listBox.show();//$(".page-container").show();
                            }
                        }
                    });
            };
        },
        //提醒我看的消息添加html
        mesTrendsAddHtml:function(items){
            var t=this,html;
            var html2="";
            var messageId;
            var messageBody;
            $.each(items,function(i,e){
                messageId=(e.messageId.lastIndexOf(",")>-1)?e.messageId:e.messageId+",";
                messageName=e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                if(e.refType!=8){//资源
                    if(e.isValid!=1&& e.isValid!=""){//无效的屏蔽资源
                        messageContent='<p class="al-contentCommentText"><span class="Ev-mesIsReadBtn">'+
                            messageName+'</span></p>';
                    }else{//有效的资源
                        messageContent='<p class="al-contentCommentText">'+
                            t.getResourceCon(e.refType)+
                            ': <span class="Ev-mesIsReadBtn">'+'《'+messageName+'》'+'</span>'+
                            '</p>';
                    }
                }else{//评论
                    if(e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")!=""){
                        messageBody=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                    }else{
                        if(e.attachment_resource.customer_review.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")!=""){
                            messageBody=e.attachment_resource.customer_review.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")
                        }else{
                            messageBody='[影像]';
                        }
                    }
                    if(e.attachment_resource.customer_review.reviewStatus!=1){//无效的屏蔽资源
                        messageContent='<p class="al-contentCommentText"><span class="Ev-mesIsReadBtn">'+
                            messageBody+'</span></p>';
                    }else{//有效的资源
                        messageContent='<p class="al-contentCommentText">'+
                            t.getResourceCon(e.refType)+
                            ': <span class="Ev-mesIsReadBtn">'+messageBody+'</span>'+
                            '</p>';
                    }
                }
                html2+='<section class="al-contentComment Ev-mesListBox" data-flag="1" data-mesId="'+ messageId+'"' +
                    'data-ReUrl="'+(e.refUrl?(e.refType!=8?e.refUrl:e.refUrl+"#reviewArea"):1)+'">'+///////终端页的评论区
                    '<b class="al-contentComment_round Ev-selectHover hide"></b>'+//删除图标
                    '<figure class="al-contentCommentUserImg">'+
                    '<a class="Ev-mesPersonalCenter" href="javascript:;" data-perCenter="/pages/personal/others_contribution.html?cid='+e.sendCustomerId+'">'+
                    '<img src="'+(e.logoUrl?e.logoUrl:'//img10.allinmd.cn/default-user/user_img65.png')+'" alt="">'+
                    (e.isRead!=1?'<i class="al-contentCommentTips"></i>':'')+
                    '</a>'+
                    '</figure>'+
                    '<section class="al-contentCommentMain">'+
                    '<article class="al-contentCommentItem">'+
                    '<article class="al-contentCommentItemTitle">'+
                    '<a class="al-contentCommentUserName">'+ e.sendCustomerName+'<i class="al-vipUser"></i></a>'+
                    '<span>提醒我看</span>'+
                    '<p class="al-contentCommentTime">'+(e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?comm.date.diffDay_one(e.messageSrcTime.substr(0,19),comm.date.local_time()):"")+'</p>'+
                    '</article>'+
                    '</article>'+
                    messageContent+
                    '</section>'+
                    '</section>';

            });
            t.commHeadHtml(3);
            $(".Ev-mesReviewListCon").html(html2);
            $(".Ev-mesIsReadBtn").each(function(){
                $(this).expandShrink({len:100});//评论的内容时候
            });
            t.mesOperateClick();//编辑操作
            t.mesIsReadRemindSys();//已读变成未读
        },
        //系统消息列表
        mesSystemShowList:function(){
            var t=this;
            var sysCount;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            t.ajaxFn({
                url:t.path.mesAllStatus,
                param: param,
                fn:function(data){
                    if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0){
                        var items=data.responseObject.responseData.data_list;
                        apParentBox.show();
                        noList.hide();
                        t.mesSystemAddHtml(items);
                        t.listCssStyle(items);
                        sysCount=Math.ceil(data.responseObject.responseData.total_count/t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:sysCount, buttonClickCallback: PageClick });
                        $(".page-container").show();
                    }else{
                        noList.show().find("h2").text("系统消息");
                        apParentBox.hide();
                        $(".page-container").hide();
                    }
                }
            });
            PageClick = function(pageclickednumber){
                t.ajaxFn({
                    url:t.path.mesAllStatus,
                    param:{
                        dataFlag:t.config.dataFlag,
                        pageIndex: pageclickednumber,
                        pageSize: t.config.pageSize,
                        logoUseFlag:t.config.logoUseFlag,
                        sortType:t.config.sortType
                    },
                    fn:function(data){
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:sysCount, buttonClickCallback: PageClick});
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                            var items=data.responseObject.responseData.data_list;
                            t.mesSystemAddHtml(items);
                            t.listCssStyle(items);
                            //listBox.show(); //$(".page-container").show();
                        }
                    }
                });
            };
        },
        //系统消息添加html
        mesSystemAddHtml:function(items){
            var t=this,html,dataReUrl,messageBody,mesCheckDetail,messageBodyText;
            var html2="";
            var messageId;
            $.each(items,function(i,e){
                if(e.opType==60){//运营消息
                    messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")?e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""):"";
                    if(!$.isEmptyObject(e.pageStoragePath)&& $.trim(e.pageStoragePath)){
                        dataReUrl=e.pageStoragePath;
                    }else{
                        dataReUrl=1;
                    }
                }else if(e.opType==66){//引用消息
                    dataReUrl= $.trim(e.refUrlPageStoragePath)&&!$.isEmptyObject(e.refUrlPageStoragePath)?e.refUrlPageStoragePath+"#reviewArea":1;//目前只有评论引用所以去终端评论区
                    if(e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "").indexOf("《")>-1){
                        var indexOfNum=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "").indexOf("《");
                        messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "").substr(0,indexOfNum)+'<span style="color:#626F8C;cursor: pointer;">'+e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "").substr(indexOfNum)+'</span>';
                    }else{
                        messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")?e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""):"";
                    }
                }else{
                    dataReUrl=1;
                    messageBodyText=e.messageBody;
                }

                var _mL;//margin-left
                if(e.isRead!=1){//未读状态
                    if(e.opType!=60&&e.opType!=66){//非运营消息,非引用消息
                        if(e.opType==69){//病历夹团队邀请通知
                            mesCheckDetail='<figure class="al-viewDetails Ev-UpTextBtn" data-opType="'+e.opType+'" data-teamId="'+e.refId+'">'+messageBodyText+'</figure>';
                            messageBody= '';
                        }else{
                            mesCheckDetail='<figure class="al-viewDetails Ev-UpTextBtn" data-opType="'+e.opType+'">查看详情 &gt;</figure>';
                            messageBody= '<p class="al-contentCommentTextSys Ev-mesBodyText hide"> '+messageBodyText+'</p>';
                        }
                    }else{
                        messageBody= '<p class="al-contentCommentTextSys Ev-mesBodyText"> '+messageBodyText+'</p>';
                        mesCheckDetail="";
                    }
                    _mL="style='margin-left:18px;'";
                }else{
                    if(e.opType==69){//病历夹团队邀请通知
                        mesCheckDetail='<figure class="al-viewDetails Ev-UpTextBtn" data-opType="'+e.opType+'" data-teamId="'+e.refId+'">'+messageBodyText+'</figure>';
                        messageBody= '';
                    }else {
                        messageBody = '<p class="al-contentCommentTextSys Ev-mesBodyText"> ' + messageBodyText + '</p>';
                        mesCheckDetail = "";
                    }
                    _mL="";
                }
                messageId=(e.id.toString().lastIndexOf(",")>-1)?e.id:e.id+",";
                html2+=  '<section class="al-contentComment Ev-mesListBox" data-opType="'+e.opType+'" data-flag="1" data-mesId="'+ messageId+'" ' +
                    'data-ReUrl="'+dataReUrl+'">'+
                        '<b class="al-contentComment_round Ev-selectHover hide"></b>'+//删除图标
                        '<section class="al-contentCommentMain"'+_mL+'>'+
                        '<article class="al-contentCommentItem">'+
                        '<article class="al-contentCommentItemTitle">'+
                            (e.isRead!=1?'<i class="redPoint"></i>':'')+
                        '<span style="position: relative">'+e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+
                        '</span>'+
                        '<p class="al-contentCommentTime">'+(e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?comm.date.diffDay_one(e.messageSrcTime.substr(0,19),comm.date.local_time()):"")+'</p>'+
                        mesCheckDetail+
                        '</article>'+
                        '</article>'+
                    messageBody+
                        '</section>'+
                        '</section>';
            });
            t.commHeadHtml(5);
            $(".Ev-mesReviewListCon").html(html2);
            t.mesOperateClick();//编辑操作
            t.mesIsReadRemindSys();//已读变成未读
        },
        //提醒我看,系统消息的已读和跳转
        mesIsReadRemindSys:function(){
            var t=this,messageIdListParam,href,terminalUrl;
            $(".Ev-mesListBox").on("click",function(e){
                messageIdListParam = $(this).attr("data-mesId");
                terminalUrl=$(this).attr("data-ReUrl");
                var $this=$(this);
                if($(".Ev-mesOpBtn").attr("data-flag")==1) {//正常状态
                    if(e.target.nodeName=="A"||e.target.nodeName=="IMG"){//头像姓名
                        var href=$(this).find("a.Ev-mesPersonalCenter").attr("data-perCenter");
                        g_sps.jump(null,href,true);
                     /*   href=window.open("_blank");
                        href.location=$(this).find("a.Ev-mesPersonalCenter").attr("data-perCenter");*//*解决IE浏览器的出现短暂404空白页面问题*/
                    }else if(e.target.className=="al-viewDetails Ev-UpTextBtn"){//查看详情
                        if($(this).find(".redPoint").length){//有未读标志,进行请求
                            t.ajaxFn({
                                url: t.path.deleteReadOp,
                                param: {
                                    opTypeRules: 2,
                                    messageIdList: messageIdListParam,
                                    isRead: 1
                                },
                                fn: function (data) {
                                    if (data && data.responseObject && data.responseObject.responseStatus) {
                                        $this.find(".al-contentCommentMain").css({"margin-left":0});
                                        $this.find(".redPoint").remove();
                                        t.mesTopNavStatus();//导航徽标提示
                                    }
                                }
                            });
                        }
                        if($(this).find(".Ev-UpTextBtn").attr("data-opType")==69){
                            var teamId=$(this).find(".Ev-UpTextBtn").attr("data-teamId");
                            var content=$(this).find(".Ev-UpTextBtn").text();
                            t.teamStateUpdate(teamId,content);
                        }else{
                            $(this).find(".Ev-mesBodyText").show();
                            $(this).find(".Ev-UpTextBtn").remove();
                        }
                    }else if(e.target.className!="al-contentCollapse expandOrShrink cursor"){//出点不等于展开收缩
                        if(terminalUrl!=1){/*解决IE浏览器的出现短暂404空白页面问题*/
                            g_sps.jump(null,terminalUrl,true);
                        }
                        if($(this).find(".al-newNumTips").length||$(this).find(".redPoint").length||$(this).find(".al-contentCommentTips").length){//有未读标志再进行请求
                            t.ajaxFn({
                                url: t.path.deleteReadOp,
                                param: {
                                    opTypeRules: 2,
                                    messageIdList: messageIdListParam,
                                    isRead: 1
                                },
                                fn: function (data) {
                                    if (data && data.responseObject && data.responseObject.responseStatus) {
                                        //t.locationParamOp();//导航hover和内容请求
                                        $this.find(".al-contentCommentMain").css({"margin-left":0});
                                        $this.find(".al-newNumTips").remove();
                                        $this.find(".redPoint").remove();
                                        $this.find(".al-contentCommentTips").remove();
                                        t.mesTopNavStatus();//导航徽标提示
                                    }
                                }
                            });
                        }
                        if($(this).attr("data-opType")==72&&(t.authState==-1)){
                            // e.preventDefault();
                            // e.stopPropagation();
                            window.location.href='//www.allinmd.cn/pages/singlePage/user/auth.html'
                        }
                    }
                }
            });
        },
        //病历夹 团队邀请消息确认修改状态
        teamStateUpdate:function(teamId,content){
            var t=this;
            t.ajaxFn({
                url: t.path.getMapListByTeamId,
                param: {
                    teamId: teamId,
                    customerId: $("#sesCustomerId").val(),
                    isValid: 1
                },
                fn: function (data) {
                    if (data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length>=1) {
                        var dataList = data.responseObject.responseData.data_list[0];
                        if(dataList.teamState==2){
                            $.makeSurePopup({
                                title:"邀请提示",//弹窗标题
                                content01:"" ,//弹窗内容字体会加粗 (可不传)
                                content:content.substring(0,content.length-5),//弹窗内容
                                ensure:"加入",//确认按钮文字内容 默认 “确认”
                                cancel:"取消",//取消按钮文字内容 默认 “取消”
                                url: t.path.updateTeamState,//ajax请求接口（可不传，不传就不发请求）
                                param:{memberIdList:dataList.memberId,stateType:2},//ajax请求参数(可不传)
                                type:"post",
                                //toJSON:1,//传参是否为paramJSPN 0或1，默认为1
                                callback:function(){

                                },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                                error:function(){}//ajax请求失败后执行的方法(可不传)
                            })
                        }
                    }
                }
            });
        },
        //页面公共头部
        commHeadHtml:function(i){
            var t=this,html;
            html=' <section class="al-contentItem Ev-al-contentItem">'+
                '<header class="al-contentItemTitle">'+
                '<h2><i class="Ev-TitleTextChange">'+ t.commHeadHtmlText(i)+'</i><span class="Ev-mesOpBtn" data-flag="1">编辑</span></h2>'+
                '</header>'+
                '<div class="al-contentComment_header Ev-DeleteShowOrHide hide" data-flag="1">'+
                '<b class="al-contentComment_round Ev-selectAllBtn"></b>'+//全选
                '<span class="Ev-selectAllBtn">全选</span>'+
                '<p class="Ev-DeleteBtnClick">删除<span></span></p>'+
                '</div>'+
                '<section class="Ev-mesReviewListCon"></section>'+
                '</section>';
            listBox.html(html);
        },
        //页面公共头部标题文本
        commHeadHtmlText:function(i){
            var text;
            switch (parseInt(i)){
                case 1:
                    text="关注提醒";
                    break;
                case 2:
                    text="评论我的";
                    break;
                case 3:
                    text="提醒我看";
                    break;
                case 4:
                    text="赞了我的";
                    break;
                case 5:
                    text="系统消息";
                    break;
             /*   case 6:
                    text="收到评分";
                    break;*/
            }
            return text;
        },
        //导航条切换
        navTabClick:function(){
            var t=this;
            $.each($(".Ev-ul-NavBarClick li"),function(i,e){
                $(e).off("click").on("click",function(event){
                    var a = window.location.pathname + location.search;
                    if (a.indexOf("#") < 0) {
                        a += "#";
                    }
                    var href =a+"&tab="+$(this).attr("data-flag");
                    g_sps.jump(null,href);
                    listBox.html("");
                    $(".page-container").hide();
                    $(".Ev-remove").remove();
                    t.login();
                    //return false;
                });
            });
        },
        //编辑删除
        mesOperateClick:function(){
            var t=this,tipHover,
                selectAll=$(".Ev-DeleteShowOrHide"),//全选删除的外层div
                deleteAll=$(".Ev-DeleteBtnClick"),//删除按钮
                locationPara=comm.getpara("#").tab,
                _sAll="al-selectAll",
                _editBtn= $(".Ev-mesOpBtn"),
                _al=$(".al-contentCommentMain");
            _editBtn.off("click").on("click",function(){//编辑按钮的点击事件
                tipHover=$(".Ev-selectHover");//单条前的选择按钮
                if(_editBtn.attr("data-Flag")==1){
                    $(this).text("取消").attr("data-Flag","0");
                    $(".page-container").hide();
                    selectAll.show();
                    tipHover.show().parents(".al-contentComment").attr("data-flag","1");
                    if(locationPara=="attention"||!locationPara||locationPara=="praise"){//编辑状态下的聚合消息样式
                        _al.removeClass("al-login_contentCommentMain");
                        $.each(_al,function(i,e){
                            if($(e).find("i.redPoint").length){//编辑状态下要移除class
                                $(e).removeClass("al-redPointComment");
                            }
                        });
                    }
                    if(locationPara=="review"){
                        if($(".Ev-mesListBox").find(".Ev-selectHover").length){
                            tipHover.show();
                        }else{
                            $(".al-contentCommentUserImg").before('<b class="Ev-selectHover al-contentComment_round"></b>');
                        }
                    }
                    if(locationPara=="system"){
                        $.each($(".al-contentCommentMain"),function(i,e){
                            if($(e).find("i.redPoint").length){
                                $(e).css("margin-left","47px");
                            }else{
                                $(e).css("margin-left","30px");
                            }
                        });
                    }
                }else{//取消，正常状态下
                    $(this).text("编辑").attr("data-Flag","1");
                    $(".page-container").show();
                    selectAll.hide().find("b").removeClass(_sAll);
                    tipHover.hide().removeClass(_sAll).parents(".al-contentComment").attr("data-flag","0");
                    deleteAll.removeClass("al-selectColor").find("span").text(""); //选中条目数字，清空
                    if(locationPara=="attention"||!locationPara||locationPara=="praise"){//取消编辑，正常状态下的聚合消息
                        _al.addClass("al-login_contentCommentMain");
                       $.each(_al,function(i,e){
                           if($(e).find("i.redPoint").length){//正常状态下多人未读添加class
                                $(e).addClass("al-redPointComment");
                            }
                       });
                    }
                    if(locationPara=="review"){
                        tipHover.hide();
                    }
                    if(locationPara=="system"){
                        $.each($(".al-contentCommentMain"),function(i,e){
                            if($(e).find("i.redPoint").length){
                                $(e).css("margin-left","17px");
                            }else{
                                $(e).css("margin-left","0px");
                            }
                        });
                    }
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"全站功能按钮点击",
                        keyword:"消息编辑取消",
                        actionId:45
                    });
                }
            });
            //全选按钮
            $(".Ev-selectAllBtn").off("click").on("click",function(){
                tipHover=$(".Ev-selectHover");//单条前的选择按钮
                if(selectAll.attr("data-Flag")==1){//全选
                    selectAll.attr("data-Flag","0").find("b").addClass(_sAll);
                    tipHover.addClass(_sAll).parents(".al-contentComment").attr("data-flag","0"); //具体条目选中
                    deleteAll.addClass("al-selectColor").find("span").text("("+tipHover.length+")");//选中条目数字
                }else{//取消全选
                    selectAll.attr("data-Flag","1").find("b").removeClass(_sAll);
                    tipHover.removeClass(_sAll).parents(".al-contentComment").attr("data-flag","1");
                    deleteAll.removeClass("al-selectColor").find("span").text("");//选中条目数字，清空
                }
            });
            //单独条目的选中
            var j,tipHoverNum;
            $.each($(".Ev-mesListBox"),function(i,e){
                $(e).off("click").on("click",function(ev){
                    tipHover=$(".Ev-selectHover");//单条前的选择按钮
                    if(_editBtn.attr("data-Flag")==0) {
                        if (ev.target.className != "al-contentCollapse expandOrShrink cursor") {
                            j = 0;
                            if ($(this).attr("data-flag") == 1) {//单条选中
                                $(this).attr("data-flag", "0").find(".Ev-selectHover").addClass(_sAll);
                                tipHoverNum = parseInt(deleteAll.find("span").text().match(/\d+/));
                                if (tipHoverNum) {
                                    tipHoverNum++;                          //选中的条数
                                    j = parseInt(tipHover.length);            //总条数
                                    if (tipHoverNum == j) {                     //全选按钮
                                        selectAll.attr("data-Flag", "0").find("b").addClass(_sAll);
                                    }
                                    deleteAll.addClass("al-selectColor").find("span").text("(" + tipHoverNum + ")");//选中条目数字
                                } else {
                                    j++;
                                    if (j == parseInt(tipHover.length)) {
                                        selectAll.attr("data-Flag", "0").find("b").addClass(_sAll);
                                    }
                                    deleteAll.addClass("al-selectColor").find("span").text("(" + j + ")");//选中条目数字
                                }
                            } else {//单条取消
                                $(this).attr("data-flag", "1").find(".Ev-selectHover").removeClass(_sAll);
                                if (selectAll.find("b").hasClass(_sAll)) {//全选情况下
                                    tipHoverNum = parseInt(tipHover.length) - 1;
                                    if (tipHoverNum == 0) {
                                        deleteAll.removeClass("al-selectColor").find("span").text("");
                                    } else {
                                        deleteAll.find("span").text('(' + tipHoverNum + ')');
                                    }
                                    selectAll.attr("data-Flag", "1").find("b").removeClass(_sAll);
                                } else {
                                    tipHoverNum = parseInt(deleteAll.find("span").text().match(/\d+/));
                                    if (tipHoverNum) {
                                        tipHoverNum--;
                                        if (tipHoverNum == 0) {
                                            deleteAll.removeClass("al-selectColor").find("span").text("");
                                        } else {
                                            deleteAll.find("span").text('(' + tipHoverNum + ')');
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            });
            //删除按钮
            deleteAll.off("click").on("click",function(){
                var deleteNum=parseInt(deleteAll.find("span").text().match(/\d+/));
                if(deleteNum){
                    $(".Ev-mesDeleteNum").text(deleteNum);
                    $(".Ev-mesDeletePop").show();
                }
            });
            //取消删除
            $(".Ev-delCancel").off("click").on("click",function(){
                $(".Ev-mesDeletePop").hide();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"消息取消删除功能",
                    actionId:45
                });
            });
            //确定删除
            var messageIdList=[];
            $(".Ev-mesDelSure").off("click").on("click",function(){
                $.each($(".Ev-mesListBox"),function(i,e){
                    if($(e).attr("data-flag")==0){
                        messageIdList.push($(e).attr("data-mesId"));
                    }
                });
                var messageIdListParam=messageIdList.join("").substring(0,messageIdList.join("").lastIndexOf(","));
                t.ajaxFn({
                    url: t.path.deleteReadOp,
                    param:{
                        opTypeRules:1,
                        messageIdList:messageIdListParam,
                        isValid:0
                    },
                    fn:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseStatus){
                            $(".Ev-mesDeletePop").hide();
                            t.locationParamOp();//导航hover和内容请求
                            t.mesTopNavStatus();//导航徽标提示
                        }
                    }
                });
            });
        },
        //列表数据少时自动添加高度和背景颜色
        listCssStyle:function(items){
            if(items.length<5&&items.length!=0) {
                var _h = $('.Ev-mesReviewListCon').height();
                var divH = 615-_h;
                $(".Ev-al-contentItem").append('<div class="Ev-remove" style="border:1px solid #e4e9ed;border-top:none;height:'+divH+'px;width:706px;background:#fff;"></div>');
            }
        },
        //资源类型：视频，文库，话题。。。
        getResourceCon:function(e){
            var conText;
            switch (parseInt(e)){
                case 1:
                    conText="视频";
                    break;
                case 2:
                    conText="文库";
                    break;
                case 4:
                    conText="话题";
                    break;
                case 7:
                    conText="病例";
                    break;
                case 8:
                    conText="评论";
                    break;
            }
            return conText;
        },
        //操作类型：发布，评论，赞。。。
        getOpConText:function(e){
            var conText="";
            switch (parseInt(e)){
                case 0:
                    conText="发布了";
                    break;
                case 1:
                    conText="评论了";
                    break;
                case 2:
                    conText="转发了";
                    break;
                case 3:
                    conText="收藏了";
                    break;
                case 4:
                    conText="分享了";
                    break;
                case 5:
                    conText="赞了";
                    break;
                case 6:
                    conText="更新了";
                    break;
            }
            return conText;
        },
        //瀑布流滚动
        scrollPage: function ($this) {
            var t = this;
            var _e=$(".Ev-mesDocListBox");
            var pageIndex=2;
            var cMesSTime,opTypeRules;
            var param={};
            var customerListNum=$this.find(".Ev-mesCustomerNameList").attr("data-tit");//评论的人数
            if(customerListNum) {
                if ($this.attr("data-cMesT")) {//赞了我的
                    cMesSTime = $this.attr("data-cMesT");
                    opTypeRules = 2;
                    param.opType = $this.attr("data-opType");
                } else {//提醒我看
                    cMesSTime = "";
                    opTypeRules = 1;
                }
            }
            param.logoUseFlag=t.config.logoUseFlag;
            param.pageIndex=pageIndex;
            param.pageSize= t.config.pageSize;
            param.resourceType=$this.attr("data-resType");
            param.refId=$this.attr("data-resId");
            param.dataFlag=t.config.dataFlag;
            param.messageType = 1;//1为会员消息，2为系统消息
            param.opTypeRules = opTypeRules;//
            param.comparMessageSrcTime = cMesSTime;//赞了我的
            var top=_e.offset().top-_e.height();
            _e.off("scroll").scrollPagination({
                'contentPage': t.path.mesDoctorList,
                'contentData': param,
                'scrollTarget': _e,
                'heightOffset':top ,
                'delaytime': 1000,
                'type': "post",
                'beforeLoad': function () {
                    comm.LightBox.showloading();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.LightBox.hideloading();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        _e.attr("scrollPagination", "disabled");
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            _e.attr("scrollPagination", "disabled");
                            //alert("没有内容了");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            if(items.length<param.pageSize){
                                _e.attr("scrollPagination", "disabled");
                            }
                            pageIndex++;
                            param.pageIndex =pageIndex;
                            var arrHT=t.doctorListHtml(items);
                            _e.append(arrHT);
                        }
                    }
                }
            });
        }
    };
    controller.init();
    scene.messageLogin = function(){
        $(".Ev-messageNoLogin").hide();
        $(".Ev-messageLogin").show();
        controller.cusInfoAjax();//用户的信息
        controller.mesTopNavStatus();//导航徽标提示
        controller.navTabClick();//导航点击切换内容
        controller.locationParamOp();//导航和内容请求
    };
    scene.TopHeadLoginCallback= function(){
        controller.login('reloadData');
    };
});