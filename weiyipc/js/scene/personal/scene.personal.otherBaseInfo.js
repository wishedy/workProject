/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/4/17.
 */
$(function(){
	var languageFlag=0;
    var uid= $('#sesCustomerId').val(); //登录人id

    var logoPath="//img01.allinmd.cn";
    var cId=comm.getpara().cid;
    //当为自己时不允许进入他人主页，直接转入个人首页
    if(uid==cId || !cId){
        location.href="/pages/personal/customerInfo.html";
    }
    /*if(!$("#sesCustomerId").val()){//未登录
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
    //跳出到关注粉丝收藏页
    $(".al-personalFollowNum").each(function(i,em){
        $(em).attr("href","/pages/personal/others_sns.html?cid="+cId+"&action="+$(em).attr("data-role"));
    });
    $(".ev-index").attr("href","/pages/personal/others_index.html?cid="+cId);
    $(".ev-contribution").attr("href","/pages/personal/others_contribution.html?cid="+cId);
    //$(".ev-baseInfo").attr("href","/pages/personal/others_baseInfo.html?cid="+cid);
    var obj = {
        cid : $("#sesCustomerId").val(),
        userName : $(".ev-name"),//用户名
        companyMedicalTitle:$(".ev-companyMedicalTitle"),//职称//医院
        logoUrl : $(".ev-logoUrl"), //头像
        upNum : $(".ev-othersUpNum"), //赞数
        fansNum : $(".ev-fansNum"), //粉丝数
        followNum : $(".ev-followNum"),  //关注数
        collectionNum : $(".ev-collectionNum")//收藏数
    };
    var otherBaseInfo={};
    var param={dataFlag:3,customerId:cId,languageFlag:languageFlag};//获取列表参数
    otherBaseInfo={
        path:{
            isFollowPath:PC_CALL+"customer/follow_people/isFollowPeople/",
            unitInfo:PC_CALL+"customer/unite/getMapById/",
            occList:PC_CALL+"customer/occupation/json_list/",
            eduList:PC_CALL+"customer/education/json_list/",
            cEduList:PC_CALL+"customer/continue/education/json_list/",
            honorList:PC_CALL+"customer/honor/json_list/",
            fundList:PC_CALL+"customer/fund/json_list/",
            socialList:PC_CALL+"customer/social/json_list/",
            opusList:PC_CALL+"customer/opus/json_list/",
            patentList:PC_CALL+"customer/patent/json_list/"
        },
        templete:{
            returnList : function(options){
                var html="";
                html+='<section class="al-tableWriteComplate occ_list">'+
                '<i class="'+options.bg+'"></i>'+
                '<article class="al-tableWriteContent">'+
                '<h2 class="unit">'+options.title+'</h2>'+
                '<p>'+
                (options.con01?'<span>'+options.con01+'</span>':'')+
                (options.con02?'<b class="al-hrLine"></b><span>'+options.con02+'</span>':'')+
                (options.con03?'<b class="al-hrLine"></b><span>'+options.con03+'</span>':'')+
                (options.time?'<span class="al-timeRange">'+options.time+'</span>':'')+
                '</p>'+
                (options.con04?'<p><span class="al-infor">'+options.con04+'</span></p>':'')+
                '<figcaption class="al-tableWriteComplateConfig">'+
                '</figcaption>'+
                '</article>'+
                '</section>';
                return html;
            }
        },
        init:function(){
            this.getBase();
            this.getOccList();
            this.getEduList();
            this.getcEduList();
            this.getHonorList();
            this.getFundList();
            this.getSocialList();
            this.getOpusList();
            this.getPatList();
        },
        getBase:function(){
            var t=this;
            var baseInfo;var unit;var auth;var dataTag;var logo;var statistic; var followPeople; var prefer;
            comm.LightBox.showloading();
            $.ajax({
                url: t.path.unitInfo,
                type: "POST",
                data: {paramJson: $.toJSON({customerId: cId,"logoUseFlag": UseFlag.d})},
                dataType: "json",
                //async:false,
                success: function (data) {
                    comm.LightBox.hideloading();
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
                    prefer=list.customer_prefer;
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
                        if(auth.medicalTitleShow){
                            obj.companyMedicalTitle.html('<p>' + auth.medicalTitleShow + '</p><p>' + auth.workplace + '</p>');
                        }else{
                            obj.companyMedicalTitle.html('<p class="ev-company">' + auth.workplace + '</p>');
                        }
                        $(".ev-medical").text(comm.cutLine(auth.medicalTitle, "_", "，"));
                        $(".ev-company").text(auth.workplace);

                    }
                    obj.upNum.text(csc.othersUpNum);
                    obj.fansNum.text(csc.fansNum);
                    // obj.followNum.text(csc.followpeopleNum);
                    obj.followNum.text(csc.followOrgNum?csc.followOrgNum:csc.followpeopleNum);
                    obj.collectionNum.text(csc.collectionNum);

                    var area = baseInfo.areasExpertise;
                    var area1 = area.split(",");
                    var areaHtml = "";
                    $.each(area1, function (i, val) {
                        if (val) {
                            if (val.split("_")[1]) {
                                areaHtml+='<figure class="al-tableItemTagItem" tagId="' + val.split("_")[0] + '">' + val.split("_")[1] + '</figure>';
                            }
                        }
                    });
                    $(".ev-areas").html(areaHtml);
                    $(".ev-clinicalYear").text(auth.clinicalTime+"年");
                    if (auth.platformId=="1"){
                        $(".ev-department").text("骨科");
                    }else{
                        $(".ev-department").text("手外科");
                    }
                    if (baseInfo.sexId == "1") {
                        $(".ev-sex").text("男");
                    }
                    if (baseInfo.sexId == "2") {
                        $(".ev-sex").text("女");
                    }
                    birthday=$.trim(baseInfo.birthday)?baseInfo.birthday:auth.birthYear;
                    if(birthday){
                        $(".ev-birth").text(birthday.substring(0,4)+'年'+birthday.substring(5,7)+'月'+birthday.substring(8,10)+"日");
                    }

                    registTime=baseInfo.registTime;
                    $(".ev-registTime").text(registTime.substring(0,4)+'/'+registTime.substring(5,7)+'/'+registTime.substring(8,10));

                    $("#summary_count").text(baseInfo.summary);
                    $("#summary_count").expandShrink({len: 210});
                    //分享
                    var href=window.location.href;
                    var h5Url="https://m.allinmd.cn/dist/personal/others_index.html?cid="+cId+'#/baseInfo';
                    shareSence=shareSenceConst.others_index;
                    module.share({
                        container:$(".ev-shareContainer"),//存放分享组件的父级
                        url:href,
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
                    //关注
                    $(".ev-followStatus").follow({
                        fId : cId,
                        fStatus : followPeople.relationship,
                        picStyle : 6,
                        needSure:1,
                        name:obj.userName.text()
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
                    $("#ev-praise").on("click",function(){
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
                                        "refId":cid,
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
                                        "refId":cid,
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
                    }).on("mouseleave",function(){
                        $(".ev-alreadyPraise").hide();
                    });
                }
            });

        },

        //获取列表
        getOccList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.occList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#occ_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.upNow){
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ "+val.endTime.substring(0,7).replace("-","/");
                            };

                            html+= t.templete.returnList({
                                bg:"al-tableIconJob",
                                title:val.unit,
                                con01:val.department,
                                con02:comm.cutLine(val.medicalTitle,"_","，"),
                                time:time
                            });
                        })
                    };
                    $("#occ_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getEduList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.eduList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#edu_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.upNow){
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,7).replace("-","/")+" ～ "+val.endTime.substring(0,7).replace("-","/");
                            };
                            html+= t.templete.returnList({
                                bg:"al-tableIconMsg",
                                title:val.university,
                                con01:val.major,
                                con02:val.education,
                                con03:val.city,
                                time:time
                            });
                        })
                    };
                    $("#edu_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getcEduList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.cEduList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#cEdu_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.upNow){
                                time=val.startTime.substring(0,4)+'.'+val.startTime.substring(5,7)+'.'+val.startTime.substring(8,10)+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,4)+'/'+val.startTime.substring(5,7)+'/'+val.startTime.substring(8,10)+" ～ "+val.endTime.substring(0,4)+'/'+val.endTime.substring(5,7)+'/'+val.endTime.substring(8,10);
                            };
                            html+= t.templete.returnList({
                                bg:"al-tableIconConEdu",
                                title:val.organization,
                                con01:$.trim(val.certificate)?val.certificate:'',
                                con02:$.trim(val.cmeDesc)?val.cmeDesc:'',
                                time:time
                            });
                        })
                    };
                    $("#cEdu_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getHonorList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.honorList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#honor_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                bg:"al-tableIconAward",
                                title:val.honorName,
                                con01:val.awardDepartment,
                                time:val.awardYear
                            });
                        })
                    };
                    $("#honor_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getFundList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.fundList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#fund_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            html+= t.templete.returnList({
                                bg:"al-tableIconFoud",
                                title:val.fundName,
                                con01:val.fundCode,
                                time:val.approvalTime.substring(0,4)
                            });
                        })
                    };
                    $("#fund_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getSocialList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.socialList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#social_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            if(val.upNow){
                                time=val.startTime.substring(0,4)+'.'+val.startTime.substring(5,7)+" ～ 至今";
                            }else{
                                time=val.startTime.substring(0,4)+'.'+val.startTime.substring(5,7)+" ～ "+val.endTime.substring(0,4)+'.'+val.endTime.substring(5,7);
                            };
                            html+= t.templete.returnList({
                                bg:"al-tableIconSociety",
                                title:val.organization,
                                con01:val.socialTitle,
                                time:time
                            });
                        })
                    };
                    $("#social_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getOpusList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.opusList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#opus_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){
                            switch(val.authorType){
                                case 1:
                                    authorType="第一作者";
                                    break;
                                case 2:
                                    authorType="第一译者";
                                    break;
                                case 3:
                                    authorType="联合作者";
                                    break;
                                case 4:
                                    authorType="联合译者";
                                    break;
                            }
                            time=val.publicationTime.substring(0,4)+"."+val.publicationTime.substring(5,7);
                            html+= t.templete.returnList({
                                bg:"al-tableIconMonographs",
                                title:val.opusName,
                                con01:val.publisher,
                                con02:authorType,
                                con04:val.information,
                                time:time
                            });
                        })
                    };
                    $("#opus_list").html(html);
                },
                error:function(){}
            });
        },
        //获取列表
        getPatList:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.patentList,
                data:param,
                dataType : "json",
                success : function(data){
                    var html="";
                    if(data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length>0) {
                        $("#patent_oth").show();
                        var list = data.responseObject.responseData.data_list;
                        $.each(list,function(i,val){

                            time=val.patentTime.substring(0,4)+"."+val.patentTime.substring(5,7);
                            html+= t.templete.returnList({
                                bg:"al-tableIconPatent",
                                title:val.patentName,
                                con01:val.patentCode,
                                con02:val.country,
                                time:time
                            });
                        })
                    };
                    $("#patent_list").html(html);
                },
                error:function(){}
            });
        }
    };

    otherBaseInfo.init();
})
