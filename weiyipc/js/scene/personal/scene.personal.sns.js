/**
 * 功能描述：  粉丝、关注、赞列表页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/1.
 */
$(function(){
    var obj = {
        noTipsEl:$(".ev-noListTips"),//没有数据时的提示语
        noListTitle:$(".ev-noListTitle"),//没有数据时标题
        reDocCon:$(".ev-reDoc"),//推荐医师列表区域
        listCon : $(".ev-listCon"), //列表区域
        listAreaTitleEl : $(".ev-listTitle"), //列表标题
        pagerEl : $(".pager"),//翻页元素
        cid : $("#sesCustomerId").val(),
        userName : $(".ev-name"),//用户名
        companyMedicalTitle:$(".ev-companyMedicalTitle"),//职称//医院
        logoUrl : $(".ev-logoUrl"), //头像
        upNum : $(".ev-upNum"), //赞数
        fansNum : $(".ev-fansNum"), //粉丝数
        followNum : $(".ev-followNum")  //关注数
    };
/*
    $(".ev-logoUrl").selectCutUserPic({
        callback: function (data) {
            if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage){
                $(".ev-logoUrl img, #logo_src").attr("src",data.responseObject.responseMessage.url);
            };
            comm.showSuccessPop({
                title:'更新头像成功',//标题
                content:'现在其他医师可以看到您的新头像了',//内容
                second:3,//时间
                obj:$(".ev-logoUrl").parent()//存放dom的父元素
            });
        }
    });*/
    var sns={
        path:{
            initCore : PC_CALL+"customer/unite/getMapById/", //个人信息
            praise:PC_CALL+"prefer/json_list/",//赞
            fans:PC_CALL+"customer/follow_fans/getMapList/",//粉丝
            follow:PC_CALL+"customer/follow_people/json_list/",//关注
            reDoc:PC_CALL+"customer/auth/getRecommendList/"//推荐医师
        },
        config:{
            pageSize:20
        },
        init:function(){
            this.initPageAjax();
        },
        initPageAjax : function() {
            var t = this;
            var auth="";
            //获取基本信息
            $.ajax({
                url: t.path.initCore,
                type: "POST",
                data: {paramJson: $.toJSON({isCustomer:"1",customerId: obj.cid,"logoUseFlag": UseFlag.e})},
                dataType: "json",
                success: function (data) {
                    if (!data || !data.responseObject.responseStatus) {
                        g_sps.jump(null,"/pages/not_found.html");
                        return false;
                    }
                    var audit=false;
                    if(obj.cid){
                        $.ajax({
                            url:PC_CALL + "customer/revise/auth/getMapList/",//获取申请审核状态
                            type: "POST",
                            data: {paramJson: $.toJSON({isCustomer:1,customerId: obj.cid})},
                            dataType: "json",
                            async:false,
                            success: function (data) {
                                if(data&&data.responseObject&&data.responseObject.responseStatus){
                                    audit=true;
                                }else{
                                    audit=false;
                                }
                            }
                        });
                    }
                    var list = data.responseObject.responseData.data_list[0];
                    unit = list.customer_unite;
                    baseInfo = list.customer_baseinfo;
                    auth = list.customer_auth;
                    auth.state = parseInt(auth.state,10);
                    csc = list.customer_statistic;
                    att = list.customer_att;
                    var prompt = list.comm_data_prompt;
                    var content="审核将在1-3个工作日内完成，请耐心等待";
                    /*if(list.authFlag==1){//四证齐全
                        content="执业医师审核将在3个工作日内完成，请耐心等待";
                    }*/
                    //判断头像
                    var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
                    if (att.logoUrl !== "") logoUrl = att.logoUrl;
                    obj.logoUrl.html('<img src="' + logoUrl + '"/>' +
                    '<i class="al-personalLogoMask ev-uploadFaceMask" style="display:none;">'+
                    '<img src="//img10.allinmd.cn/v3/common/icon/icon_camera.png" alt="">'+
                    '</i>');

                    module.logoReplace({
                        container: $(".ev-logoUrl"),
                        callback: function (data) {
                            if(data.responseObject && data.responseObject.responseStatus && data.responseObject.responseMessage){
                                $(".ev-logoUrl>img, #logo_src").attr("src",data.responseObject.responseMessage.url);
                            };
                            comm.showSuccessPop({
                                title:'更新头像成功',//标题
                                content:'现在其他医师可以看到您的新头像了',//内容
                                second:3,//时间
                                obj:$(".ev-logoUrl").parent()//存放dom的父元素
                            });
                        }
                    });
                    var reminderBar = $(".al-auth-reminder");//补全四证或者认证失败的提示
                    var manufacturerOnOff = unit.customerRole!==3;
                    if ( auth.state !== 2&&auth.state !== 7 && auth.state !== 8&& auth.state !== 9) {//未认证
                        var nickname = auth.lastName+auth.firstName;
                        if (nickname === "") nickname = comm.getRegisterName(unit.email,unit.mobile);;
                        obj.userName.text(nickname);
                        var desStr = "";
                        function goAuth() {
                            var noAuthTemplate = "<section class='al-not-auth'><span>" + desStr + "</span><button class='al-go-auth ev-go-auth'>去认证</button></section>";
                            obj.companyMedicalTitle.html(noAuthTemplate);
                            $(".ev-go-auth").off("click").on("click", function () {
                                user.login({
                                    callback: function () {
                                        window.location.reload();
                                    },
                                    scene: privilegeSceneConst.eSceneTypeAuth,
                                    noAuthTip:1
                                });
                                //事件埋点
                                comm.creatEvent({
                                    triggerType: "认证",
                                    keyword: "去认证",
                                    actionId: 23
                                });
                            });
                        }
                        if ((auth.state === 3)&&manufacturerOnOff) {
                            desStr = prompt.promptMessage;
                            goAuth();
                            $(".ev-noAuth-hide").show();//显示姓名，粉丝行
                        } else if ((auth.state === -1 || auth.state === 0)&&manufacturerOnOff) {
                            $(".ev-noAuth-hide").hide();//隐藏姓名，粉丝行
                            desStr = prompt.promptMessage;
                            reminderBar.addClass('al-reminder-no-auto');
                            reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                            prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click", function () {
                                user.login({
                                    callback: function () {
                                        window.location.reload();
                                    },
                                    scene: privilegeSceneConst.eSceneTypeAuth,
                                    noAuthTip:1
                                });
                                //事件埋点
                                comm.creatEvent({
                                    triggerType: "认证",
                                    keyword: "去认证",
                                    actionId: 23
                                });
                            }):'';
                            $(".al-auth-reminder-close").off("click").on("click", function (e) {
                                $(".al-auth-reminder").hide();
                                e.stopPropagation();
                            });
                        }else{
                            $(".ev-noAuth-hide").show();//显示姓名
                        }
                        if(authInfo.state===1){
                            $(".ev-noAuth-hide").hide();
                            if(list.authFlag==1){
                                $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                            }else{
                                $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v1Status");
                            }
                        }
                    } else {
                        $(".ev-noAuth-hide").show();//显示姓名
                        var name = auth.lastName + auth.firstName;
                        obj.userName.html(name + '<i class="al-vipBigUser al-vipNewBigUser"></i>');
                        if(auth.medicalTitleShow){
                            obj.companyMedicalTitle.html('<p class="ev-medical">'+auth.medicalTitleShow+'</p><p class="ev-company">'+auth.workplace+'</p>');
                        }else{
                            obj.companyMedicalTitle.html('<p class="ev-company">'+auth.workplace+'</p>');
                        }
                        if(( auth.state === 2||auth.state === 7 || auth.state === 9)&&manufacturerOnOff){
                            $(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V1.png') no-repeat 50% 50%"});
                        }
                        if((auth.state===2)&&manufacturerOnOff){
                            var authHelpTemplate = '<section class="al-auth-grade" style="display: block;">'+
                                '<section class="al-auth-grade-details">'+
                                '<h1 class="al-auth-grade-title">认证等级规则</h1>'+
                                '<p class="al-auth-grade-produce">'+
                                '	认证等级是用户在唯医、医鼎、医栈、唯医骨科所具有的统一认证等级。包括：'+
                                '</p>'+
                                '<div class="al-auth-grade-des">'+
                                '	<h1><i></i>V1-认证医师</h1>'+
                                '	<p>'+
                                '		拥有在唯医、医鼎、医栈的医师操作权限'+
                                '	</p>'+
                                '</div>'+
                                '<div class="al-auth-grade-des">'+
                                '	<h1><i></i>V2-执业医师</h1>'+
                                '	<p>'+
                                '		拥有V1权限的同时，还具有在唯医骨科进行执业诊疗的权限'+
                                '	</p>'+
                                '</div>'+
                                '<div class="al-auth-grade-close">'+
                                '</div>'+
                                '</section>'+
                                '</section>';
                            if(TempCache.getItem("isFirstAuthHelp")){
                                // return false;
                            }else{
                                $(".al-auth-grade").remove();
                                $("body").append(authHelpTemplate);
                                $(".al-auth-grade-close").off("click").on("click",function(){
                                    $(".al-auth-grade").remove();
                                });
								TempCache.setItem("isFirstAuthHelp","true");
                            }
                        }
                        if((auth.state === 8)&&manufacturerOnOff ){
                            $(".al-vipBigUser").css({"background":"url('/images/img10/authentication/V2.png') no-repeat 50% 50%"});
                        }
                        if((auth.state===9)&&manufacturerOnOff){
                            //desStr ="v2认证未通过审核,请重新认证";
                            reminderBar.addClass("al-auth-reminder-failed").find(".al-auth-reminder-content").html(prompt.promptMessage);
                            prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click",function(){
                                g_sps.jump(null,"/pages/singlePage/user/auth.html");
                            }):'';
                            $(".al-auth-reminder-close").off("click").on("click", function (e) {
                                e.stopPropagation();
                                $(".al-auth-reminder").hide();
                            });
                        }
                        if(((auth.state === 2)&&auth.state != 7)&&manufacturerOnOff&&!audit){
                            reminderBar.addClass('al-reminder-no-auto');
                            reminderBar.find(".al-auth-reminder-content").html('<em>'+prompt.promptMessage+'</em>');
                            prompt.promptMessage.length>0?reminderBar.show(300).off("click").on("click",function(){
								TempCache.setItem("userInfoTrigger","true");
                                g_sps.jump(null,$(".al-customer-info a").attr("href"));
                            }):'';
                            $(".al-auth-reminder-close").off("click").on("click", function (e) {
                                e.stopPropagation();
                                $(".al-auth-reminder").hide();
                            });
                        }
                        if(auth.state===7&&manufacturerOnOff){
                            $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                        }
                        if(auth.state==2&&audit){//修改认证审核中
                            $(".al-certification-status").html('<p>'+content+'</p>').show().addClass("al-certification-v2Status");
                        }
                    }
                    obj.fansNum.attr("num",csc.fansNum).text(csc.fansNum);
                    // obj.followNum.attr("num",csc.followpeopleNum).text(csc.followpeopleNum);
                    obj.followNum.attr("num",csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum).text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);
                    obj.upNum.attr("num",csc.othersUpNum).text(csc.othersUpNum);

                    t.company=auth.company;
                    t.areasExpertise=auth.areasExpertise;
                    t.sidebarChange();
                    t.para=comm.getpara();
                    if(t.para.action){
                        t.type=t.para.action;
                        switch (t.type){
                            case "praise"://赞
                                t.pageTotal=csc.othersUpNum;
                                $(".al-personalInnerSidebarItem").eq(2).click();
                                break;
                            case "fans"://粉丝
                                t.pageTotal=csc.fansNum;
                                $(".al-personalInnerSidebarItem").eq(0).click();
                                break;
                            case "follow"://关注
                                // t.pageTotal=csc.followpeopleNum;
                                t.pageTotal=csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum;
                                $(".al-personalInnerSidebarItem").eq(1).click();
                                break;

                        }

                    }else{
                        t.type="fans";
                        $(".al-personalInnerSidebarItem").eq(0).click();

                    }
                    $(".al-personalFollowMsg p").each(function(i,em){
                        $(em).on("click",function(){
                            switch (i){
                                case 0://粉丝
                                    $(".al-personalInnerSidebarItem").eq(0).click();
                                    break;
                                case 1://关注
                                    $(".al-personalInnerSidebarItem").eq(1).click();
                                    break;
                                case 2://赞
                                    $(".al-personalInnerSidebarItem").eq(2).click();
                                    break;

                            }
                        });
                    });
                    if(unit.customerRole!==3){//厂商无分享自己权限
                        //分享
                        var url="https://www.allinmd.cn/pages/personal/others_index.html?cid="+obj.cid;
                        var h5Url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+obj.cid;
                        shareSence=shareSenceConst.personal_host;
                        module.share({
                            container:$(".ev-shareContainer"),//存放分享组件的父级
                            url:url,
                            type:2,//默认为1  1：社交分享  2：页面左下角全站分享
                            title:"",//分享标题
                            h5Url:h5Url,//h5页面链接
                            shareTrend:0,//0:不需要站内动态分享  1：需要站内动态分享
                            trendUrl:'',//分享到站内动态的接口
                            data:{},//分享到站内动态的接口参数
                            callback:function(){},//分享到站内动态成功后回调函数
                            triggerRequest:function(content){//事件点击
                                //获取分享话术
                                var data={};
                                data.customerId=obj.cid;
                                data.logoUseFlag=4;
                                data.pageIndex=1;
                                data.pageSize=1;
                                data.useFlag=1;
                                data.sceneType=getShareContentSense.my_index;
                                data.resourceType=ResouceType.person;
                                var param={};
                                param.paramJson= $.toJSON(data);
                                $.ajax({
                                    url: PC_CALL+'comm/data/share/getMapList3/',
                                    type: "post",
                                    data: param,
                                    dataType: 'json',
                                    async:false,
                                    success: function (d) {
                                        if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                            var item = d.responseObject.responseData.data_list[0];
                                            content.pic = item.share_comm.shareImageUrl;
                                            content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                            $.each(item.share_channel,function(i,el){
                                                if(el.shareChannel=='Sina'){
                                                    content.sinaTitle=el.shareDesc;
                                                }else if(el.shareChannel=="QQFriend"){
                                                    content.qqTitle = el.shareTitle;
                                                    content.qqSummary = el.shareDesc;
                                                }else if(el.shareChannel=="QZone"){
                                                    content.qqZoneTitle=el.shareTitle;
                                                    content.qqZoneSummary = el.shareDesc;
                                                }
                                            });
                                        }
                                    }

                                });
                            },
                            shareQQSuc:function(){//分享qq成功
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:"" ,
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence:shareSence,
                                    shareChannel:2,
                                    shareContent:document.title
                                });
                            },
                            shareQzoneSuc:function(){
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:"" ,
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence:shareSence,
                                    shareChannel:1,
                                    shareContent:document.title
                                });
                            },//分享qzone成功
                            shareSinaSuc:function(){
                                comm.shareLog({
                                    shareType: "",
                                    resourceId:"" ,
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence:shareSence,
                                    shareChannel:3,
                                    shareContent:document.title
                                });
                            }//分享sina成功
                        });

                    }

                    $(".ev-logoUrl").on("mouseenter", function(){
                        $(".ev-uploadFaceMask").show();
                    }).on("mouseleave", function(){
                        $(".ev-uploadFaceMask").hide();
                    });
                }
            });
        },

        //sidebar切换
        sidebarChange:function(){
            var t=this;
            $(".al-personalInnerSidebarItem").attr("on","true");
            $(".al-personalInnerSidebarItem").on("click", function(e) {
                if($(this).attr("on")=="true"){
                    $(".al-personalInnerSidebarItem").attr("on","true");
                    $(this).attr("on","false");
                    t.type = $(this).attr("data-role");
                    t.pageTotal=$(this).find("span").attr("num");
                    $(".al-personalInnerSidebarItem").removeClass('active');
                    $(this).addClass('active');
                    //if(t.pageTotal==0){

                    //}else{
                        t.getUserList();
                    //}

                }
            });
        },
        //获取推荐医师列表
        getReDoc:function(pageIndex){
            comm.LightBox.showloading();
            var t=this;
            var data={};
            var param={};
            data.sortType=4;
            data.recommendAreasExpertiset= t.areasExpertise;
            data.recommendCompany= t.company;
            data.logoUseFlag=3;
            data.pageIndex=pageIndex?pageIndex:1;
            data.pageSize=6;
            param.paramJson= $.toJSON(data);
            $.ajax({
                type : "post",
                url : t.path.reDoc,
                data : param,
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(!rep.responseObject.responseData||!rep.responseObject.responseData.data_list){
                        $(".ev-noList").find(".al-contentItem").hide();
                        return false;
                    }
                    var rows=rep.responseObject.responseData.data_list;
                    var arrHT=[];
                    if(rows&&rows.length<6){
                        t.num==0;
                    }
                    if(rows&&rows.length>0){
                        $.each(rows,function(i,val){
                            var logo; var user; var statistic;
                            if(val.customer_att){
                                logo=val.customer_att;
                            }
                            if(val.customer_doctor){
                                user=val.customer_doctor;
                            }

                            if(val.customer_statistic){
                                statistic=val.customer_statistic;
                            }

                            userName=user.last_name?user.last_name+user.first_name:"";
                            medicalTitle=comm.strHandle.cutDoctorTitle(comm.cutLine(user.medical_title,"_",","))?comm.strHandle.cutDoctorTitle(comm.cutLine(user.medical_title,"_",",")):"";
                            company=user.workplace?comm.getStrLen(user.workplace,22):"";

                            contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                            arrHT.push(module.resourceListTemplate({tempName:"squUserList"})({
                                cid:user.customer_id,
                                userName:userName==''?'唯医小编':userName,
                                logoUrl:logo.logoUrl,
                                state:user.state,
                                medicalTitle:medicalTitle,
                                company:company,
                                contribuNum:contribuNum,
                                reviewNum:statistic.reviewNum,
                                // fansNum:statistic.followpeopleNum,
                                fansNum:statistic.followOrgNum?statistic.followOrgNum:statistic.followpeopleNum,
                                relationship:val.relationship
                            }));
                        });
                    }

                    $(obj.reDocCon).empty();
                    $(obj.reDocCon).html(arrHT);
                },
                error:function(){}
            });

        },
        //参数配置
        getParam:function(pageIndex){
            var t =this;
            var data={};
            var params={};
            if(t.type!=="praise"){
                if(t.type=="follow"){
                    data.followTypeFlag=31;
                }
                data.customerId=obj.cid;
                data.useFlag=UseFlag.c;
                data.logoUseFlag=3;
                data.pageIndex=pageIndex;//第几页
                data.pageSize= t.config.pageSize;//每一页的数量
                params.paramJson = $.toJSON(data);
            }else{ //赞方式
                data.usefulType = 9;
                data.upDownType =1;
                data.refId=obj.cid;
                data.useFlag=UseFlag.c;
                data.logoUseFlag=3;
                data.pageIndex=pageIndex;//第几页
                data.pageSize= t.config.pageSize;//每一页的数量
                params.paramJson = $.toJSON(data);
            }
            return params;
        },
        getUserList:function(){
            var t=this;
            this.specialCount=json;
            switch (t.type){
                case "praise"://赞
                    url= t.path.praise;
                    document.title="点赞－唯医,allinmd";
                    TempCache.setItem('readPreferTime',comm.date.local_time());    //cookie记录上次查看赞的时间
                    // comm.Log.createBrowse({href:location.href,id:127,name:'点赞列表'});
                    setTimeout(function(){
                        g_sps&&g_sps.createBrowse({pageId:392})},2000);
                    break;
                case "fans"://粉丝
                    url= t.path.fans;
                    document.title="粉丝－唯医,allinmd";
                    TempCache.setItem('readFansTime',comm.date.local_time());    //cookie记录上次查看粉丝的时间
                    // comm.Log.createBrowse({href:location.href,id:124,name:'粉丝列表'});
                    setTimeout(function(){
                        g_sps&&g_sps.createBrowse({pageId:397})},2000);
                    break;
                case "follow"://关注
                    url= t.path.follow;
                    document.title="关注－唯医,allinmd";
                    // comm.Log.createBrowse({href:location.href,id:126,name:'关注医师列表'});
                    setTimeout(function(){
                        g_sps&&g_sps.createBrowse({pageId:399})},2000);
                    break;
            }

            comm.LightBox.showloading();
            $.ajax({
                type : "post",
                url : url,
                data : t.getParam(1),
                dataType : "json",
                success : function(rep){
                    comm.LightBox.hideloading();
                    if(rep){
                        if(t.type=="fans"){//粉丝
                            pagecount= Math.ceil(rep.responseObject.responseData.new_num/ t.config.pageSize);
                        }else if(t.type=="follow"){//关注
                            pagecount= Math.ceil(rep.responseObject.responseData.total_count/ t.config.pageSize);
                        }else{//赞
                            pagecount= Math.ceil(rep.responseObject.responseData.new_num/ t.config.pageSize);
                        }
                        t.getHtml(rep.responseObject);
                        obj.pagerEl.pager({pagenumber:1, pagecount: pagecount, buttonClickCallback: PageClick});
                    }else{
                        //t.options.container("<div class=\"no_dongtai font_yahei\">暂无数据！</div>");
                    }
                },
                error:function(){}
            });
            PageClick = function(pageclickednumber){
                comm.LightBox.showloading();
                $.ajax({
                    type : "post",
                    url : url,
                    data : t.getParam(pageclickednumber),
                    dataType : "json",
                    success : function(rep){
                        comm.LightBox.hideloading();
                        if(rep){
                            if(t.type=="fans"){//粉丝
                                pagecount= Math.ceil(rep.responseObject.responseData.new_num/ t.config.pageSize);
                            }else if(t.type=="follow"){//关注
                                pagecount= Math.ceil(rep.responseObject.responseData.total_count/ t.config.pageSize);
                            }else{//赞
                                pagecount= Math.ceil(rep.responseObject.responseData.new_num/ t.config.pageSize);
                            }
                            t.getHtml(rep.responseObject);
                            obj.pagerEl.pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                        }
                    },
                    error:function(){}
                });
            };
        },

        getHtml:function(data){
            var t=this;
            var html="";
            var arrHT=[];
            var num=0;
            switch (t.type){
                case "praise"://赞
                    rows=data.responseData.data_list;
                    num=this.specialCount.preferNum;
                    break;
                case "fans"://粉丝
                    rows= data.responseData.data_list;
                    num=this.specialCount.fansNum;
                    break;
                case "follow"://关注
                    rows= data.responseData.data_list;
                    break;
            }

            if(rows&&rows.length>0){
                obj.pagerEl.show();
                $(".ev-hasList").show();
                $(".ev-noList").hide();
                switch (t.type){
                    case "praise"://赞
                        obj.listAreaTitleEl.text("点赞的人");
                        break;
                    case "fans"://粉丝
                        obj.listAreaTitleEl.text("全部粉丝");
                        break;
                    case "follow"://关注
                        obj.listAreaTitleEl.text("关注的人");
                        break;
                }
                $.each(rows,function(i,val){
                    var logo; var auth; var base; var fans; var statistic;
                    if(val.customer_att){
                        logo=val.customer_att;
                    }
                    if(val.customer_auth){
                        auth=val.customer_auth;
                    }
                    if(val.customer_baseinfo){
                        base=val.customer_baseinfo;
                    }
                    if(val.customer_statistic){
                        statistic=val.customer_statistic;
                    }

                    fans=val.customer_fans?val.customer_fans:val.customer_people;
                    medicalTitle=auth.medicalTitleShow;//auth.medicalTitle?"<span>"+comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",","))+"</span>":"";
                    company=auth.workplace?comm.getStrLen($.trim(auth.workplace),22):"";

                    if(t.type === "praise"){ //赞时customerId从auth中取
                        fans = {};
                        fans.relationship = val.customer_relationship;
                        base.customerId = val.customer_auth.customerId;
                    }
                    contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                    t.followOrgFlag="";
                    if(t.type=="follow"&&auth.followType==2){//关注列表并且是组织
                        userName=auth.fullName;
                        logo.logoUrl?logo.logoUrl:"//img10.allinmd.cn/v3/organization/org_logo_default.png";
                        base.customerId=auth.customerId;
                        t.followOrgFlag=1;
                    }else{
                        userName=auth.lastName?auth.lastName+auth.firstName:"";
                    }
                    arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                        cid:base.customerId,
                        tips:(i<num?1:0),
                        userName:userName==''?'唯医小编':userName,
                        logoUrl:logo.logoUrl,
                        state:auth.state,
                        medicalTitle:medicalTitle,
                        company:company,
                        contribuNum:contribuNum,
                        reviewNum:statistic.reviewNum,
                        fansNum:statistic.fansNum,
                        relationship:fans.relationship,
                        fansRelationship:t.type=="fans"?1:0,
                        followOrgFlag: t.followOrgFlag==1?t.followOrgFlag:""//关注列表的组织列表项
                    }));
                });
                $(obj.listCon).empty();
                $(obj.listCon).html(arrHT);
            }else{
                obj.pagerEl.hide();
                $(".ev-hasList").hide();
                $(".ev-noList").show();
                switch (t.type){
                    case "praise"://赞
                        document.title="点赞－唯医,allinmd";
                        obj.noTipsEl.text("暂无点赞");//还没有为您点赞的人
                        //obj.noListTitle.text("多与大家互动，让更多人认识你");
                        $(".al-contentItemTitle").eq(0).hide();
                        $(".ev-reDoc").css({"margin-top":"20px"});
                        TempCache.setItem('readPreferTime',comm.date.local_time());    //cookie记录上次查看赞的时间
                        break;
                    case "fans"://粉丝
                        document.title="粉丝－唯医,allinmd";
                        obj.noTipsEl.text("暂无粉丝");
                        obj.noListTitle.text("先关注别人");
                        $(".al-contentItemTitle").eq(0).show();
                        $(".ev-reDoc").css({"margin-top":"0"});
                        TempCache.setItem('readFansTime',comm.date.local_time());    //cookie记录上次查看粉丝的时间
                        break;
                    case "follow"://关注
                        document.title="关注－唯医,allinmd";
                        obj.noTipsEl.text("暂无关注");//您还没有关注任何医师
                        obj.noListTitle.text("他们有很多病例");
                        $(".al-contentItemTitle").eq(0).show();
                        $(".ev-reDoc").css({"margin-top":"0"});
                        // comm.Log.createBrowse({href: location.href, id:128, name:'关注医师推荐'});
                        setTimeout(function(){
                            g_sps&&g_sps.createBrowse({pageId:402})},2000);
                        break;

                }
                t.num=1;
                t.getReDoc();
                $("#ev-changeBatch").on("click",function(){
                    t.num=++t.num;
                    t.getReDoc(t.num);
                })
            }


        }
    };

    user.login({
        callback: function () {
            obj.cid=$("#sesCustomerId").val();
            sns.init();
        },
        scene: privilegeSceneConst.eSceneTypeAttentionList,
        onClose:function(){
            history.back();
        },
        onAuthCancel:function(){
            history.back();
        },
        noAuthTip:1
    });

})
