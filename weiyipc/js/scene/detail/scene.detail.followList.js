/**
 * 功能描述：病例话题终端页关注列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/27.
 */
$(function(){
    var refTy=comm.getpara().followType;
    var refId=comm.getpara().rId;
    var scene, onLoginClose;
    if (refTy==4) {
        scene = privilegeSceneConst.eSceneTypeTopicDetail;
        onLoginClose = function () {
            g_sps.jump(null,  "/pages/channel/topic/topic_index.html");
        };
    }
    if (refTy==7) {
        scene = privilegeSceneConst.eSceneTypeCaseDetail;
        onLoginClose = function () {
            g_sps.jump(null, "/pages/channel/case/case_index.html");
        };
        //comm.Log.createBrowse({href:location.href,id:129,name:'关注病例用户列表'});
    }
    var controller={
        config:{
            logoUseFlag:3,
            visitSiteId:1,
            pageIndex:1,
            pageSize:12
        },
        path:{
            recommendUrl:PC_CALL+"video/listInTag/",//推荐视频
            tCFollowList: PC_CALL + "customer/follow_resource/getMapListByRef/",//病例话题的关注列表
            follow: PC_CALL + "customer/follow_resource/create/", //关注
            cancelFollow: PC_CALL + "customer/follow_resource/delete/", //取消关注
            getMapByIdTopic:PC_CALL+"topic/baseinfo/getMapById3/",//右侧所属活动，关注的人
            getMapByIdCase:PC_CALL+"case_baseinfo/getMapById3/"//右侧所属活动，关注的人
        },
        init:function(){
            var t=this;
            t.recommendList();
            t.rightFollow();
            t.followList();
        },
        //关注列表
        followList:function(){
            var t=this;
            var groupCount;
            var _box=$(".Ev-apFollowList");
            $.ajax({
                type: "POST",
                url: t.path.tCFollowList,
                data: {paramJson: $.toJSON({
                    refId:refId,
                    sessionCustomerId:$("#sesCustomerId").val(),
                    followType:refTy,
                    logoUseFlag:t.config.logoUseFlag,
                    visitSiteId:t.config.visitSiteId,
                    pageIndex: t.config.pageIndex,
                    pageSize: t.config.pageSize
                })},
                dataType: "json",
                success: function (rep) {
                    if(rep&&rep.responseObject&&!$.isEmptyObject(rep.responseObject.responseData)&&rep.responseObject.responseData.data_list){
                        var items=rep.responseObject.responseData.data_list;
                        var html=t.addHtmlList(items);
                        _box.html(html);
                        groupCount=Math.ceil(rep.responseObject.responseData.total_count/t.config.pageSize);
                        $(".pager").pager({pagenumber: 1, pagecount:groupCount, buttonClickCallback: PageClick });
                        t.clickUrlChange();
                    }
                },
                error: function () {}
            });
            PageClick = function(pageclickednumber){
                $.ajax({
                    type: "POST",
                    url:t.path.tCFollowList,
                    data: {paramJson: $.toJSON({
                        refId:refId,
                        sessionCustomerId:$("#sesCustomerId").val(),
                        followType:refTy,
                        logoUseFlag:t.config.logoUseFlag,
                        visitSiteId:t.config.visitSiteId,
                        pageIndex: pageclickednumber,
                        pageSize: t.config.pageSize
                    })},
                    success:function(rep){
                        $(".pager").pager({pagenumber:pageclickednumber, pagecount:groupCount, buttonClickCallback: PageClick});
                        if(rep&&rep.responseObject&&!$.isEmptyObject(rep.responseObject.responseData)&&rep.responseObject.responseData.data_list){
                            var items=rep.responseObject.responseData.data_list;
                            var html=t.addHtmlList(items);
                            _box.html(html);
                            t.clickUrlChange();
                        }
                    },
                    error: function () {}
                });
            };
        },
        //判断列表中是自己的选项
        clickUrlChange:function(){
            var t=this;
            $(".ev-sRList").off("click").on("click",function () {
                var _href = $(this).attr("href");
                var _cid = _href ? _href.split('cid=')[1]: "";
                var _thisC=_cid.indexOf("&")>-1?_cid.split('&')[0]:_cid;
                if (_thisC == $('#sesCustomerId').val()) {//是自己
                    g_sps.jump($(this), "/pages/personal/personal_contribution.html");
                    return false;
                }
            })
        },
        //添加html
        addHtmlList:function(items){
            var arrHT=[];
            $.each(items,function(i,e){
                var att= e.commDataLogoUrl;
                var auth= e.customerAuth;
                var statistic= e.customerStatistic;
                contribuNum=statistic.caseNum+statistic.docNum+statistic.topicNum+statistic.videoNum;//贡献值
                arrHT.push(module.resourceListTemplate({tempName:"userList"})({
                    cid:auth.customerId,
                    userName:auth.lastName+auth.firstName==''?'唯医小编':auth.lastName+auth.firstName,
                    logoUrl:att.logoUrl,
                    state: auth.state,
                    medicalTitle: $.trim(auth.medicalTitleShow),
                    company: $.trim(auth.company),
                    contribuNum:contribuNum.toW(),
                    reviewNum:statistic.reviewNum.toW(),
                    fansNum:statistic.fansNum.toW(),
                    relationship: e.isFollowPeople
                }));
            });
            return arrHT;
        },
        //推荐视频请求
        recommendList:function(){
            var t=this;
            $.ajax({//推荐视频的请求
                url: t.path.recommendUrl,
                type: "get",
                data: {
                    refId:refId
                },
                dataType: "json",
                success: function (data) {
                    if (data && data.rows[0].refVideoItems) {//推荐视频有数据
                        var items=data.rows[0].refVideoItems;
                        var html="";
                        $.each(items,function(i,e){
                            if(i<5){
                                html+= t.videoList_template(e);
                            }
                        });
                        $(".Ev-recommendVideoList").show().append(html);
                    }
                }
            });
        },
        //推荐视频的列表结构
        videoList_template:function(kv){
            var recommendVideoName=kv.recommendVideoName;
            var recommendVideoId=kv.recommendVideoId;
            if(comm.getByteLen(recommendVideoName)>26){
                recommendVideoName=comm.getStrLen(recommendVideoName,26);
            }
            return '<figure class="al-resourceInfo" data="'+recommendVideoId+'">'+
                '<a target="_blank" href="'+kv.pageStoragePath+'">'+
                '<img src="'+kv.recommendVideoLogo2+'"/>'+
                '</a>'+
                '<div>'+
                '<a target="_blank" href="'+kv.pageStoragePath+'">'+
                '<p>'+recommendVideoName+'</p>'+
                '</a>'+
                '<span>'+(kv.videoAuthor?kv.videoAuthor:"唯医小编")+'</span>'+
                '</div>'+
                '</figure>';
        },
        //右侧关注状态
        rightFollow:function(){
            var t=this;
            if(refTy==7){
                t.rightInfoC();
                $(".Ev-textChange figcaption").text("帮您了解病例更新及最新评论");
                $(".Ev-EditCase").attr("caseId",refId);
                $(".Ev-followListT h2").text("关注此病例的人");
                $("title").text("关注病例用户列表");
            }else{
                t.rightInfoT();
                $(".Ev-textChange figcaption").text("帮您了解话题更新及最新评论");
                $(".Ev-followListT h2").text("关注此话题的人");
                $("title").text("关注话题用户列表");
            }
        },
        //话题关注
        rightInfoT:function(){
            var t=this;
            var _alF=$(".Ev-alFollow");
            var _nlFT=$(".Ev-noFollowTopic");
            var _nlFC=$(".Ev-noFollowCase");
            $.ajax({
                type: "POST",
                url: t.path.getMapByIdTopic,
                data:{paramJson:$.toJSON(t.getParam())},
                dataType: "json",
                success: function (rep) {
                    if(rep&&rep.responseObject&&!$.isEmptyObject(rep.responseObject.responseData)&&rep.responseObject.responseData.data_list){
                        var items=rep.responseObject.responseData.data_list[0];
                        var cAuth=items.cms_topic_customer;
                        var tName=items.cms_topic.topicName;
                        $(".Ev-followTitle h4").text(tName);
                        if(cAuth.customerId!=$("#sesCustomerId").val()){//不是自己的时候显示
                            $(".Ev-myselfHide").show();
                            if(items.followRelationship==1){//关注状态
                                _alF.show();
                                _nlFT.hide();
                            }else{//未关注状态
                                _nlFT.show();
                                _alF.hide();
                            }
                        }
                        t.followClick(tName);
                    }
                },
                error: function () {}
            });
        },
        //病例关注状态
        rightInfoC:function(){
            var t=this;
            var _alF=$(".Ev-alFollow");
            var _nlFT=$(".Ev-noFollowTopic");
            var _nlFC=$(".Ev-noFollowCase");
            $.ajax({
                type: "POST",
                url: t.path.getMapByIdCase,
                data:{paramJson:$.toJSON(t.getParam())},
                dataType: "json",
                success: function (rep) {
                    if(rep&&rep.responseObject&&!$.isEmptyObject(rep.responseObject.responseData)&&rep.responseObject.responseData.data_list){
                        var items=rep.responseObject.responseData.data_list[0];
                        var cAuth=items.case_customer_auth;
                        var cName=items.case_baseinfo.caseName;
                        $(".Ev-followTitle h4").text(cName);
                        if(cAuth.customerId!=$("#sesCustomerId").val()){//不是自己的时候显示
                            $(".Ev-myselfHide").show();
                            if(items.followRelationship==1){//关注状态
                                _alF.show();
                                _nlFC.hide();
                            }else{//未关注状态
                                _nlFC.show();
                                _alF.hide();
                            }
                        }
                        t.followClick(cName);
                    }
                },
                error: function () {}
            });
        },
        followClick:function(refName){
            var t=this;
            var _alF=$(".Ev-alFollow");
            var _nlF=$(".Ev-noF");
            var param={};
            param.followType=refTy;
            param.refId=refId;
            param.refName=refName;
            _alF.off("click").on("click",function(){
                t.followAjax(t.path.cancelFollow,param,1);//取消关注
            });

            var data={};
            data.followType=refTy;
            data.refId=refId;
            data.refName=refName;
            _nlF.off("click").on("click",function(){
                t.followAjax(t.path.follow,data);//添加关注
            });
        },
        //病例和话题的关注和关注取消的请求
        followAjax:function(path,param,index){
            var _alF=$(".Ev-alFollow");
            var _nlFT=$(".Ev-noFollowTopic");
            var _nlFC=$(".Ev-noFollowCase");
            $.ajax({
                type: "POST",
                url: path,
                data:{paramJson:$.toJSON(param)},
                dataType: "json",
                success: function (rep) {
                    if(rep&&rep.responseObject&&rep.responseObject.responseStatus){
                        if(param.followType==7){//病例
                            if(index){//取消
                                _nlFC.show();
                                _alF.hide();
                            }else{//关注了
                                _alF.show();
                                _nlFC.hide();
                            }
                        }else{//话题
                            if(index){//取消
                                _nlFT.show();
                                _alF.hide();
                            }else{//关注了
                                _alF.show();
                                _nlFT.hide();
                            }
                        }

                    }
                },
                error: function () {
                }
            });
        },
        //右侧关注状态的参数
        getParam:function(){
            var t=this;
            var param={};
            param.sessionCustomerId=$("#sesCustomerId").val();
            param.useFlag=12;
            param.visitSiteId=1;
            param.logoUseFlag=3;
            switch (parseInt(refTy)){
                case 4://话题
                    param.topicId=refId;
                    param.attUseFlag=10;
                    break;
                case 7://病例
                    param.caseId=refId;
                    param.attUseFlag=10;
                    break;

            }
            return param;
        }
    };
    user.login({
        callback: function () {
            $(".mask_body").remove();
            controller.init();
        },
        scene: scene,
        onClose: onLoginClose,
        onAuthCancel:"back"      // 当点暂不认证时的处理、回退到来源页
    });
});