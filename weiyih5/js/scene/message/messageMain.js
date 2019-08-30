/**
 * 功能描述：消息页面的列表
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/13.
 */

$(function(){
    //window.onload = Log.createBrowse(53,'消息列表页面');
    //comm.loading.show();
    user.privExecute({ //消息首页登录权限
        operateType: 'login', //'login','auth','conference'
        callback: function() {}
    });
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
            deleteReadOp:"/mcall/customer/message/update3/",//删除操作和未读变成已读
            mesAllStatus: "/mcall/customer/message/json_grouplist3/",//消息的总状态和系统消息
            authUrl:"/mcall/customer/auth/getCustomerAuth/"//判断用户的权限
        },
        init:function(){
            var t=this;
            comm.footerNav();
            t.allStatusNum();
            //if(TempCache.getItem("userId")){//登录状态
            //    $.ajax({
            //        url: t.path.authUrl,
            //        type:"get",
            //        dataType:"json",
            //        success:function(rep){
            //            if(rep&&rep.responseObject && rep.responseObject.responseMessage && !$.isEmptyObject(rep.responseObject.responseMessage)){
            //                t.allStatusNum();
            //            }
            //        }
            //    });
            //}
        },
        ajaxFn:function(opt) {
            comm.loading.show();
            var cfg = opt;
            $.ajax({
                url: cfg.url,
                type: 'post',
                data: {paramJson: $.toJSON(cfg.param)},
                dataType: 'json',
                async:opt.async?opt.async:true,
                success: function (data) {
                    comm.loading.hide();
                    if (data) {
                        cfg.fn(data);
                    }
                }
            });
        },
        //全部消息条目数
        allStatusNum:function(){
            var t=this;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            t.ajaxFn({
                url: t.path.mesAllStatus,
                param:param,
                fn:function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        var navStatus=rep.responseObject.responseData;
                        var noReadTipClass=$(".Ev-mesTipNoReadNum");
                        if(navStatus.groupCount){//关注提醒
                            noReadTipClass.eq(0).addClass("al-newsNum").text(navStatus.groupCount>99?"…":navStatus.groupCount);
                        }else{
                            noReadTipClass.eq(0).removeClass("al-newsNum").text("");
                        }
                        if(navStatus.reviewNoReadCount){//评论我的
                            noReadTipClass.eq(1).addClass("al-newsNum").text(navStatus.reviewNoReadCount>99?"…":navStatus.reviewNoReadCount);
                        }else{
                            noReadTipClass.eq(1).removeClass("al-newsNum").text("");
                        }
                        if(navStatus.remindNoReadCount){//提醒我看
                            noReadTipClass.eq(2).addClass("al-newsNum").text(navStatus.remindNoReadCount>99?"…":navStatus.remindNoReadCount);
                        }else{
                            noReadTipClass.eq(2).removeClass("al-newsNum").text("");
                        }
                        if(navStatus.preferNumCount){//赞了我的
                            noReadTipClass.eq(3).addClass("al-newsNum").text(navStatus.preferNumCount>99?"…":navStatus.preferNumCount);
                        }else{
                            noReadTipClass.eq(3).removeClass("al-newsNum").text("");
                        }
                        //if(navStatus.sysCount){//系统消息
                            var items=rep.responseObject.responseData.data_list;
                            t.mesSystemAddHtml(items);
                            if(items.length< t.config.pageSize){
                                $(".Ev-mesSystemAppList").attr("scrollPagination", "disabled");
                            }else{
                                t.scrollPage();
                            }

                        //}
                    }
                }
            });
        },
        //系统消息页面添加列表
        mesSystemAddHtml:function(items,kv){
            var t=this,html="",messageBody='',dataReUrl,messageBodyText='',mesCheckDetail,messageId;
            $.each(items,function(i,e){
                if(e.opType==60){//运营消息
                    if(!$.isEmptyObject(e.webStoragePath)&& $.trim(e.webStoragePath)){
                        dataReUrl=e.webStoragePath;
                        messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")?e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""):"";
                    }
                }else if(e.opType==66){//引用消息
                    var refUrl=!$.isEmptyObject(e.refUrlWebStoragePath)?e.refUrlWebStoragePath:"";//var refName=e.messageBody.substring(e.messageBody.indexOf("《")+1,e.messageBody.indexOf("》"));
                    var refName= e.refName;
                    refReviewId=e.refReviewId&&!$.isEmptyObject(e.refReviewId)?e.refReviewId:"";
                    if(e.customer_review&&!$.isEmptyObject(e.customer_review)&&e.customer_review.parentId!=0){//跳转到讨论页面
                        dataReUrl='/pages/personal/details_discuss.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+refReviewId+'&refName='+refName+'&refUrl='+refUrl;
                    }else{//父层是资源，跳转到正文页面
                        dataReUrl='/pages/personal/details_content.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+refReviewId+'&refName='+refName+'&refUrl='+refUrl;
                    }
                    messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")?e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""):"";
                }else{
                    dataReUrl="";
                    messageBodyText=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")?e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, ""):"";
                }
                if(e.isRead!=1){//未读
                    if(e.opType==60||e.opType==66){//运营消息，引用消息，默认展开
                        messageBody='<p class="al-msgRemindContentText">'+messageBodyText+'</p>';
                        mesCheckDetail="";
                    }else{
                        messageBody='<p class="al-msgRemindContentText Ev-mesCheckDetailCon" style="display: none;">'+ messageBodyText+'</p>';
                        mesCheckDetail='<p class="al-msgRemindContentTextHide Ev-mesCheckDetailBtn">查看详情<i class="icon-messageMore"></i></p>';
                    }
                }else{//已读
                    messageBody='<p class="al-msgRemindContentText">'+messageBodyText+'</p>';
                    mesCheckDetail="";
                }
               messageId=(e.id.toString().lastIndexOf(",")>-1)?e.id:e.id+",";
                messageSrcTime=e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?comm.date.diffDay_one(e.messageSrcTime.substr(0,19),comm.date.local_time()):"";
                html+='<section class="al-msgRemindItem Ev-mesSysListBox" data-IsRe="'+e.opType+'" data-resUrl="'+dataReUrl+'"'+
                    'data-mesId="'+messageId+'">'+
                        '<figure class="al-msgRemindIcon">'+
                            '<i class="icon-mailbox"></i>'+
                            '<i class="'+(e.isRead!=1?'icon-newTips':'')+'"></i>'+
                        '</figure>'+
                        '<article class="al-msgRemindContent">'+
                            '<h2 class="al-msgRemindTitle">'+ e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'<span class="al-msgRemindTime">'+
                    messageSrcTime+
                        '</span></h2>'+
                            mesCheckDetail+
                            messageBody+//消息主体内容
                        '</article>'+
                    '</section>';
            });
            if(kv){
                $(".Ev-mesSystemAppList").append(html);
            }else{
                $(".Ev-mesSystemAppList").html(html);
            }

            t.mesSysClick();
        },
        //系统消息的未读变成已读事件（查看详情按钮和运营消息的已读跳转）
        mesSysClick:function(){
            var t=this,href;
            $(".Ev-mesCheckDetailBtn").off("click").on("click",function(i,e){//查看更多按钮
                var selfParent =$(this).parents(".Ev-mesSysListBox");
                var mesId=selfParent.attr("data-mesId");
                var detailBtn=$(this);
                var detailContent=$(this).parents(".Ev-mesSysListBox").find("p.Ev-mesCheckDetailCon");
                t.ajaxFn({
                    url: t.path.deleteReadOp,
                    param:{
                        opTypeRules: 2,
                        messageIdList:mesId,
                        isRead:1
                    },
                    fn:function(data){
                        if(data&&data.responseObject&&data.responseObject.responseStatus){
                            //t.allStatusNum();
                            detailBtn.remove();
                            detailContent.show();
                            //只删除当前提示
                            selfParent.find("i.icon-newTips").remove();
                        }
                    }
                });
            });

            $(".Ev-mesSysListBox").off("click").on("click",function(){
                var mesId=$(this).attr("data-mesId");
                var redPoint=$(this).find("i.icon-newTips");
                if($(this).attr("data-IsRe")==60||$(this).attr("data-IsRe")==66){//66引用消息，60运营推送消息
                    window.location=$(this).attr("data-resUrl");
                    if(redPoint.length){
                        t.ajaxFn({
                            url: t.path.deleteReadOp,
                            param:{
                                opTypeRules: 2,
                                messageIdList:mesId,
                                isRead:1
                            },
                            fn:function(data){
                                if(data&&data.responseObject&&data.responseObject.responseStatus){
                                    //t.allStatusNum();
                                    redPoint.remove();
                                }
                            }
                        });
                    }

                }
            });

        },
        //瀑布流滚动
        scrollPage: function ($this) {
            var t = this;
            var pageIndex=2;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex=pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            $(".Ev-mesSystemAppList").off("scroll").scrollPagination({
                'contentPage': t.path.mesAllStatus,
                'contentData': $.extend(param, {
                    pageIndex: function () {
                        return pageIndex++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset':0,
                'delaytime': 0,
                'type': "post",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".Ev-mesSystemAppList").attr("scrollPagination", "disabled");
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".Ev-mesSystemAppList").attr("scrollPagination", "disabled");
                            //alert("没有内容了");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            t.mesSystemAddHtml(items,1);
                        }
                    }
                }
            });
        }
    };
    controller.init();
});