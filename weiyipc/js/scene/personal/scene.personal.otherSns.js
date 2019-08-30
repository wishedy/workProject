/**
 * 功能描述：   他人主页（粉丝，关注，收藏）
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/10.
 */
$(function(){
    var languageFlag=0;
    var logoPath="//img01.allinmd.cn";
    var uid= $('#sesCustomerId').val(); //登录人id
    var cId=comm.getpara().cid;
    if(uid==cId || !cId){
        g_sps.jump(null,"/pages/personal/personal_index.html");
    }
    /*if(!$('#sesCustomerId').val()){//未登录
        user.login({
            callback: function () {
                location.reload();
            },
            scene: privilegeSceneConst.eSceneTypeLogin,
            onClose:function(){
                window.location.href="/";
            }
        });
        return false;
    }*/
    $(".ev-index").attr("href","/pages/personal/others_index.html?cid="+cId);
    $(".ev-contribution").attr("href","/pages/personal/others_contribution.html?cid="+cId);
    $(".ev-baseInfo").attr("href","/pages/personal/others_baseInfo.html?cid="+cId);
    var obj = {
        noTipsEl:$(".ev-noListTips"),//没有数据时的提示语
        noListTitle:$(".ev-noListTitle"),//没有数据时标题
        listCon : $(".ev-listCon"), //列表区域
        listAreaTitleEl : $(".ev-listTitle"), //列表标题
        pagerEl : $(".pager"),//翻页元素
        cid : $("#sesCustomerId").val(),
        userName : $(".ev-name"),//用户名
        companyMedicalTitle:$(".ev-companyMedicalTitle"),//职称//医院
        logoUrl : $(".ev-logoUrl"), //头像
        upNum : $(".ev-othersUpNum"), //赞数
        fansNum : $(".ev-fansNum"), //粉丝数
        followNum : $(".ev-followNum"),  //关注数
        collectionNum : $(".ev-collectionNum")//收藏数
    };
    var otherSns={};
    var baseInfo, unit, auth, csc, att, followPeople, prefer;
    var param={dataFlag:3,customerId:cId,languageFlag:languageFlag};//获取列表参数
    otherSns= {
        path: {
            isFollowPath: PC_CALL + "customer/follow_people/isFollowPeople/",
            unitInfo: PC_CALL + "customer/unite/getMapById/",
            fans:PC_CALL+"customer/follow_fans/getMapList/",//粉丝
            follow:PC_CALL+"customer/follow_people/json_list/"//关注
        },
        config:{
            pageSize:20
        },
        init: function () {
            this.getBase();
            this.getInitList();
        },
        getBase: function () {
            var t = this;

            $.ajax({
                url: t.path.unitInfo,
                type: "POST",
                data: {paramJson: $.toJSON({customerId: cId, "logoUseFlag": UseFlag.d})},
                dataType: "json",
                async: false,
                success: function (data) {
                    if (!data || !data.responseObject.responseStatus) {
                        g_sps.jump(null,"/pages/not_found.html");
                        return false;
                    }
                    var list = data.responseObject.responseData.data_list[0];
                    unit = list.customer_unite;
                    baseInfo = list.customer_baseinfo;
                    auth = list.customer_auth;
                    csc = list.customer_statistic;
                    att = list.customer_att;
                    followPeople = list.customer_follow_people;
                    prefer = list.customer_prefer;
                    //判断头像
                    var logoUrl = "<img src=\"//img10.allinmd.cn/default-user/user_img65.png\">";
                    if (att.logoUrl !== "") logoUrl = att.logoUrl;
                    obj.logoUrl.html("<img src=\"" + logoUrl + "\"/>");
                    if (auth.state !== 1 && auth.state !== 2 && auth.state !== 7 && auth.state !== 8 && auth.state !== 9) {//未认证
                        var nickname = auth.lastName + auth.firstName;
                        if (nickname === "") nickname = comm.getRegisterName(unit.email,unit.mobile);
                        obj.userName.text(nickname);
                        obj.companyMedicalTitle.html('<p id="EV-NoQualificationUser">用户尚未认证</p>');
                    } else {
                        var name = auth.lastName + auth.firstName;
                        $(".ev-trueName").text(name);
                        obj.userName.html(name + '<i class="al-vipBigUser"></i>');
                        $(".ev-medical").text(auth.medicalTitleShow);//comm.cutLine(auth.medicalTitle, "_", "，")
                        $(".ev-company").text(auth.workplace);
                        if(auth.medicalTitleShow){
                            obj.companyMedicalTitle.html('<p class="ev-medical">'+auth.medicalTitleShow+'</p><p class="ev-company">'+auth.workplace+'</p>');
                        }else{
                            obj.companyMedicalTitle.html('<p>'+auth.workplace+'</p>');
                        }
                    }
                    obj.upNum.text(csc.othersUpNum);
                    obj.fansNum.attr("num",csc.fansNum).text(csc.fansNum);
                    // obj.followNum.attr("num",csc.followpeopleNum).text(csc.followpeopleNum);
                    obj.followNum.attr("num",csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum).text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);//加入组织关注量
                    obj.collectionNum.attr("num",csc.collectionNum).text(csc.collectionNum);
                    //分享
                    var url="https://www.allinmd.cn/pages/personal/others_sns.html?cid="+cId;
                    var h5Url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+cId;
                    shareSence=shareSenceConst.others_index;//获取分享话术
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
                            data.customerId=cId;
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
            });
            //关注
            $(".ev-followStatus").follow({
                fId: cId,
                fStatus: followPeople.relationship,
                picStyle: 6,
                needSure:1,
                name:$(".ev-name").text()
            });
            obj.logoUrl.on('click',function(){
                var _src = $(this).find('img').eq(0).attr('src');
                comm.LightBox.show(70,'#0a1e2b');
                var _preView = '<div class="logoPreView"><div class="logoPreViewClose"></div><img class="logoPreViewImg" src="'+_src+'"></div>'
                $("body").append(_preView);
                $('.logoPreViewClose').on('click',function(){
                    comm.LightBox.hide();
                    $('.logoPreView').remove();
                })
            });
            //赞
            if(prefer.isValid){
                $("#ev-praise i").addClass("al-othersLikeOn");
            }
            $("#ev-praise").on("click", function () {
                user.login({
                    callback: function () {
                        //判断是否赞过，未赞过 则赞
                        if(!prefer.isValid){ //未赞过发送赞请求并＋1
                            prefer.isValid=1;

                            var praiseNum = parseInt($(".ev-othersUpNum").text());
                            $(".ev-othersUpNum").text(praiseNum+1);
                            $("i",$(this)).addClass("al-othersLikeOn");
                            var url = PC_CALL+"prefer/create/";
                            var params = {};
                            params.paramJson = $.toJSON({
                                "dataFlag":2,
                                "attUseFlag":3,
                                "refId":cId,
                                "refCustomerId":parseInt($("#sesCustomerId").val()),
                                "usefulType":9,
                                "upDownType": 1
                            });
                            $.ajax({
                                url : url,
                                type : "POST",
                                data : params
                            })
                        }else{ //取消赞
                            prefer.isValid=0;

                            var praiseNum = parseInt($(".ev-othersUpNum").text());
                            $(".ev-othersUpNum").text(praiseNum-1>0?praiseNum-1:0);
                            $("i",$(this)).removeClass("al-othersLikeOn");
                            var url = PC_CALL+"prefer/delete/";
                            var params = {};
                            params.paramJson = $.toJSON({
                                "dataFlag":2,
                                "attUseFlag":3,
                                "refId":cId,
                                "refCustomerId":parseInt($("#sesCustomerId").val()),
                                "usefulType":9,
                                "upDownType": 0
                            });
                            $.ajax({
                                url : url,
                                type : "POST",
                                data : params
                            });

                            //$(".ev-alreadyPraise").show(); //赞过提示
                        }
                    },
                    scene: privilegeSceneConst.eSceneTypePraiseList,
                    onClose:function(){
                        history.back(-1);
                    },
                    noAuthReload:true
                });
            }).on("mouseleave", function () {
                $(".ev-alreadyPraise").hide();
            });

        },
        //列表初始化
        getInitList:function(){
            var t=this;
            t.sidebarChange();
            t.para=comm.getpara();
            if(t.para.action){
                t.type=t.para.action;
                switch (t.type){
                    case "fans"://粉丝
                        t.pageTotal=csc.fansNum;
                        $(".al-personalInnerSidebarItem").eq(0).click();
                        break;
                    case "follow"://关注
                        // t.pageTotal=csc.followpeopleNum;
                        t.pageTotal=csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum;
                        $(".al-personalInnerSidebarItem").eq(1).click();
                        break;
                    case "collect"://收藏
                        t.pageTotal=csc.collectionNum;
                        $(".al-personalInnerSidebarItem").eq(2).click();
                        break;

                }

            }else{
                t.type="fans";
                t.pageTotal=csc.fansNum;
                obj.listAreaTitleEl.text("全部粉丝");
                $(".al-personalInnerSidebarItem").eq(0).addClass("active")
                t.getUserList();
            }
            $(".al-personalFollowMsg a").each(function(i,em){
                $(em).on("click",function(){
                    switch (i){
                        case 0://粉丝
                            $(".al-personalInnerSidebarItem").eq(0).click();
                            break;
                        case 1://关注
                            $(".al-personalInnerSidebarItem").eq(1).click();
                            break;
                        case 2://收藏
                            $(".al-personalInnerSidebarItem").eq(2).click();
                            break;

                    }
                });
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
                    if(t.pageTotal==0){
                        obj.pagerEl.hide();
                        $(".ev-collectNavList").hide();
                        $(".ev-hasList").hide();
                        $(".ev-noList").show();
                        switch (t.type){
                            case "fans"://粉丝
                                document.title="粉丝－唯医,allinmd";
                                obj.noTipsEl.text("暂无粉丝");
                                obj.noListTitle.text("先关注别人");
                                break;
                            case "follow"://关注
                                document.title="关注－唯医,allinmd";
                                obj.noTipsEl.text("TA还没有关注任何医师");
                                obj.noListTitle.text("他们有很多病例");
                                break;
                            case "collect": //收藏
                                document.title="收藏－收藏的资源汇总,唯医,allinmd";
                            	obj.noTipsEl.text("TA还没有收藏任何资源");
                                obj.noListTitle.text("他们有很多优秀资源");
                                break;
                            default:    
                        }

                    }else{
                        obj.pagerEl.show();
                        $(".ev-collectNavList").hide();
                        $(".ev-hasList").show();
                        $(".ev-noList").hide();
                        switch (t.type){
                            case "fans"://粉丝
                                document.title="粉丝－唯医,allinmd";
                                obj.listAreaTitleEl.text("全部粉丝");
                                // comm.Log.createBrowse({href:location.href,id:125,name:'TA的粉丝列表页'});
                                setTimeout(function(){
                                    g_sps&&g_sps.createBrowse({pageId:406})},2000);
                                t.getUserList();
                                break;
                            case "follow"://关注
                                document.title="关注－唯医,allinmd";
                                obj.listAreaTitleEl.text("关注的人");
                                t.getUserList();
                                break;
                            case "collect": //收藏
                                document.title="收藏－收藏的资源汇总,唯医,allinmd";
                                // comm.Log.createBrowse({href:location.href,id:96,name:'TA的收藏页'});
                                setTimeout(function(){
                                    g_sps&&g_sps.createBrowse({pageId:407})},2000);
                            	$(".ev-hasList").hide();
                            	$(".ev-collectNavList").show();
                            	t.getCollectionInitTotalAndTabNav();
                            	t.getCollection();
                                break;
                            default:    
                        }
                        
                    }

                }
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
                data.customerId=cId;
                data.useFlag=UseFlag.c;
                data.logoUseFlag=3;
                data.pageIndex=pageIndex;//第几页
                data.pageSize= t.config.pageSize;//每一页的数量
                params.paramJson = $.toJSON(data);
            }else{ //赞方式
                data.usefulType = 9;
                data.refId=cId;
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
            switch (t.type){
                case "fans"://粉丝
                    url= t.path.fans;
                    break;
                case "follow"://关注
                    url= t.path.follow;
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
                            }
                            t.getHtml(rep.responseObject);
                            obj.pagerEl.pager({ pagenumber: pageclickednumber, pagecount: pagecount, buttonClickCallback: PageClick });
                        }
                    },
                    error:function(){}
                });
            };
        },
        getCollectionInitTotalAndTabNav: function(){
        	var cid= comm.getpara().cid;
        	var countUrl= PC_CALL+'collection/getResourceNum/';
        	var params= {
        		paramJson: $.toJSON({customerId: cid})
        	}
        	var collectCount= Fns.ajax.sync(countUrl,params).responseObject.responseData.data_list;
        	$('.collectVideoNum').text(collectCount.videoNum);
        	$('.collectCaseNum').text(collectCount.caseNum);
        	$('.collectDocNum').text(collectCount.docNum);
        	$('.collectTopicNum').text(collectCount.topicNum);
        	$('.collectDiscussNum').text(collectCount.reviewNum);
            $(".collectSeriesNum").text(collectCount.courseNum);

        	var _this= this;
        	$(".ev-clickCollectionTab").find('[data-role]').on('click',function(){
        		$(this).addClass('active').siblings().removeClass('active');
        		switch($(this).attr('data-role')){
        		case "tabVideo": _this.getCollection(1); break;
        		case "tabCase": _this.getCollection(7); break;
        		case "tabDoc": _this.getCollection(2); break;
        		case "tabTopic": _this.getCollection(4); break;
        		case "tabDiscuss": _this.getCollection(8); break;
        		case "tabSeries": _this.getCollection(18); break;
        		default:
        		}
        	});

        },
        getCollection: function(type){
        	var _this= this;

        	if(!type){type= 1;} //默认视频

        	var rsCount= 0,typeDesc='';
        	switch(type){
        	case 1: rsCount= $('.collectVideoNum').text(); typeDesc='视频'; break;
        	case 2: rsCount= $('.collectDocNum').text(); typeDesc='文库'; break;
        	case 4: rsCount= $('.collectTopicNum').text(); typeDesc='话题'; break;
        	case 7: rsCount= $('.collectCaseNum').text(); typeDesc='病例'; break;
        	case 8: rsCount= $('.collectDiscussNum').text(); typeDesc='评论'; break;
        	case 18: rsCount= $('.collectSeriesNum').text(); typeDesc='系列课'; break;
        	default:
        	}
        	rsCount= Math.ceil(parseInt(rsCount)/20);
        	//装载翻页
        	obj.pagerEl.pager({pagenumber: 1, pagecount:rsCount, buttonClickCallback: pageAjax});

        	var url = PC_CALL+'collection/json_list/';
        	var params= {
    			collectionType: type,//	类型1视频2文库4话题7病例8评论
    			attUseFlag: 2,
    			logoUseFlag: 3,
    			customerId: cId,
                pageIndex:1,
                pageSize:20
        	};

        	if(rsCount>0){
        		comm.LightBox.showloading();
        		if(type==8){//他的个人中心他人收藏的讨论，collection/json_list/接口会被调用两侧，此处逻辑设置有一定问题，在渲染讨论数据的时候，直接将最后一个渲染函数提前到这里2018112311:43
                    module.reviewPage({$context:$('.ev-collectList'), scene:"collectReview",pageSize:20,customerId:cId,pageIndex:1});
                    comm.LightBox.hideloading();
                    return false;
                }
	        	var data= Fns.ajax.sync(url,params);
	        	comm.LightBox.hideloading();
	        	if(data && data.responseObject.responseStatus && data.responseObject.responseData.data_list){
	        		obj.pagerEl.show();
	        		if(type==18){
                            $(".ev-collectList").html('<ul class="classesListUl au-series-container">'+ctrlCourse(data.responseObject.responseData.data_list)+'</ul>');
                    }else{
                        ctrlCenter(type, data.responseObject.responseData.data_list);
                    }
	        	}else{
	        		obj.pagerEl.hide();
	        		$('.ev-collectList').html(module.list2Template.nullData('Ta还没有收藏'+typeDesc));
	        	}
        	}else{
        		obj.pagerEl.hide();
        		$('.ev-collectList').html(module.list2Template.nullData('Ta还没有收藏'+typeDesc));
        	}
            function ctrlCourse(data){
                function dealData(indata){
                    var returnData = [];
                    $.each(indata,function(i,v){
                        var dataJson = {};
                        var timeLimit = (v.customer_collection.price>0)?"0":"1";
                        dataJson.collect = {};
                        dataJson.collect.state = "1";
                        dataJson.courseNum = v.customer_collection.catalogNum;
                        dataJson.reviewNum = (v.customer_collection.totalLearnNum).toWKH();
                        dataJson.title = v.customer_collection.refName;
                        dataJson.id = v.customer_collection.refId;
                        dataJson.timeLimit = timeLimit;
                        dataJson.imgSrc = v.customer_collection.coverPicUrl;
                        dataJson.linkUrl = "/pages/discover/series/discover_series_details.html?tId=" + v.customer_collection.refId;
                        returnData.push(dataJson);
                    });
                    return returnData;
                }
                function demoStr(strdata){
                    var str = "";
                    $.each(strdata,function (i,v) {
                        str+='<li data-href="'+v.linkUrl+'" data-seriesId="'+v.id+'">'+
                            '<a href="'+v.linkUrl+'">'+
                            '<img src="'+v.imgSrc+'">'+
                            '<aside class="title">'+v.title+'</aside>'+
                            '<aside class="classNum"><i></i>'+v.reviewNum+'<span>'+v.courseNum+'节课</span></aside>'+
                            '<aside class="function"><span class="timeLimit '+v.timeLimitClass+'">限时免费</span><span class="collection '+v.collectClass+'" data-collectId="'+v.collectId+'"><i></i>已收藏</span></aside>'+
                            '</a>'+
                            '</li>';
                    });
                    return str;
                }
                return demoStr(dealData(data));
            }
        	function ctrlCenter(type, dataList,pageIndex){
        		var html='';var reviewNum=0;
        		for(var i=0;i<dataList.length;i++){
                    if(dataList[i].customer_collection.collectionType==8){
                        reviewNum++;
                    }else {
                        data = typeData(type, dataList[i]);
                        html += module.resourceListTemplate({tempName: "resource"})({
                            isNew: 0,//传0或1 最新标识
                            isHost: 0,//传0或1 最热标识
                            cancelText: '',//是否需要取消类的按钮
                            resType: type,//资源类型传数字  1-视频，2-文库，3-会议，4-话题 ,7-病例,
                            resId: data.refId,//资源id
                            resourceIsValid: data.resourceValid,
                            resName: data.refName,//标题
                            resContent: data.refContent,//内容
                            userName: data.author == '' ? '唯医小编' : data.author,//作者
                            reviewNum: data.browseNum.toWK(),//观看数
                            resPic: data.pic,//缩略图
                            playNum: data.playTime,//视频的时长   有值才传
                            resUrl: data.refUrl//资源链接
                        });
                    }
        		}
                $('.ev-collectList').html(html);
                $(".ev-resourceList:last .al-contentText").css("borderBottom","none");
                $(".ev-resourceList:last .al-tableBoxInnerWrap").css("borderBottom","none");
                $(".ev-resourceList:last").css("borderBottom","1px solid #ecf0f2");
                //处理回复类
                if(reviewNum>0){
                    module.reviewPage({$context:$('.ev-collectList'), scene:"collectReview",pageSize:reviewNum,customerId:cId,pageIndex:(pageIndex?pageIndex:1)});
                }
        	}

        	function pageAjax(pageclickednumber){ //翻页 取当前单击的数值
        		params.pageIndex = parseInt(pageclickednumber);
        		$(window).scrollTop(0);


        		//controllerCenter(data);
                var _localType = 1;
                switch($('.ev-clickCollectionTab figure.active').attr('data-role')){
                    case "tabVideo": _localType = 1; break;
                    case "tabDoc": _localType =2; break;
                    case "tabCase": _localType =7;break;
                    case "tabDiscuss": _localType = 8;break;
                }
                if(_localType!=8){
                    var data= Fns.ajax.sync(url,params);
                    if(comm.hasResponseData(data)){
                        var _localDataList = data.responseObject.responseData.data_list;
                        if(_localType==18){
                            $(".ev-collectList").html('<ul class="classesListUl au-series-container">'+ctrlCourse(data.responseObject.responseData.data_list)+'</ul>');
                        }else{
                            ctrlCenter(_localType,_localDataList,pageclickednumber);
                        }

                    }
                }else{
                    module.reviewPage({$context:$('.ev-collectList'), scene:"collectReview",pageSize:20,customerId:cId,pageIndex:pageclickednumber});
                }

        		obj.pagerEl.pager({pagenumber: pageclickednumber, pagecount: rsCount, buttonClickCallback: pageAjax});
        	}

        	function typeData(type,dataList){
        		var data= {};
        		switch(type){
	        	case 1:
	        		data= {
	        			refId:dataList.cms_video.videoId,
                        resourceValid:dataList.resource_valid.resourceValid,
	        			refName: dataList.cms_video.videoName,
	        			refContent: dataList.cms_video.videoAbstract,
	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
	        			browseNum: dataList.cms_video.playNum.toWK(),
	        			pic: dataList.cms_video_attachment.videoAttUrl,
	        			playTime: dataList.cms_video.playTime,
	        			refUrl: dataList.cms_video.pageStoragePath,
	        			refCustomerId: dataList.cms_video.refCustomerId
	        		};
	        		break;
	        	case 2:
	        		data= {
	        			refId: dataList.cms_doc.docId,
                        resourceValid:dataList.resource_valid.resourceValid,
	        			refName: dataList.cms_doc.docName,
	        			refContent: dataList.cms_doc.docAbstract,
	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
	        			browseNum: dataList.cms_doc.browseNum.toWK(),
	        			pic: dataList.cms_doc_attachment.docAttUrl,
	        			refUrl: dataList.cms_doc.pageStoragePath,
	        			refCustomerId: dataList.cms_doc.refCustomerId
	        		};
	        		break;
	        	case 4:
                    data= {
                        publishTime: dataList.cms_topic.publishTime,
                        refId: dataList.cms_topic.topicId,
                        resourceValid:dataList.resource_valid.resourceValid,
                        refName: htmlToString(dataList.cms_topic.topicName),
                        refContent: htmlToString(dataList.cms_topic.topicDiscuss),
                        author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
                        browseNum: dataList.cms_topic.browseNum.toWK(),
                        pic: dataList.cms_topic_attachment.topicAttUrl,
                        refUrl: dataList.cms_topic.pageStoragePath,
                        refCustomerId: dataList.cms_topic.customerId,
                        resourceIsValid: parseInt(dataList.resource_valid.resourceValid)
                    };
                    break;
	        	case 7:
	        		data= {
	        			refId: dataList.case_baseinfo.caseId,
                        resourceValid:dataList.resource_valid.resourceValid,
	        			refName: dataList.case_baseinfo.caseName,
	        			refContent: dataList.customer_collection.refContent,
	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
	        			browseNum: dataList.case_baseinfo.browseNum.toWK(),
	        			pic: dataList.case_attachment.attUrl,
	        			refUrl: dataList.case_baseinfo.pageStoragePath,
	        			refCustomerId: dataList.case_baseinfo.refCustomerId
	        		};
	        		break;
	        	case 8:
	        		//回复调用
//	        		data= {
//	        			refId: dataList.case_baseinfo.caseId,
//	        			refName: dataList.case_baseinfo.caseName,
//	        			refContent: dataList.customer_collection.refContent,
//	        			author: dataList.publish_customer.lastName+dataList.publish_customer.firstName,
//	        			browseNum: dataList.case_baseinfo.browseNum,
//	        			pic: dataList.case_attachment.attUrl,
//	        			refUrl: dataList.case_baseinfo.pageStoragePath
//	        		}
	        		break;
	        	default:
	        	}
        		return data;
        	}
        },
        getHtml:function(data){
            var t=this;
            var html="";
            var arrHT=[];
            switch (t.type){
                case "fans"://粉丝
                    rows= data.responseData.data_list;
                    break;
                case "follow"://关注
                    rows= data.responseData.data_list;
                    break;
            }

            if(rows&&rows.length>0){
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
                    medicalTitle=auth.medicalTitleShow;//comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",","))?"<span>"+comm.strHandle.cutDoctorTitle(comm.cutLine(auth.medicalTitle,"_",","))+"</span>":"";
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
                        userName:userName==''?'唯医小编':userName,
                        customerId:$("#sesCustomerId").val(),
                        logoUrl:logo.logoUrl,
                        state:auth.state,
                        medicalTitle:medicalTitle,
                        company:company,
                        contribuNum:contribuNum,
                        reviewNum:statistic.reviewNum,
                        fansNum:statistic.fansNum,
                        relationship:fans.relationship,
                        followOrgFlag: t.followOrgFlag==1?t.followOrgFlag:""//关注列表的组织列表项
                    }));
                });
            }

            $(obj.listCon).empty();
            $(obj.listCon).html(arrHT);
        }
    }

    otherSns.init();
})


