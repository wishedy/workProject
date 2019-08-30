/**
 * 功能描述：消息页面，提醒我看
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/20.
 */
$(function(){
    //window.onload = Log.createBrowse(56,'消息提醒我看页面');
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
            mesTrendsList:"/mcall/customer/message/getMapList3/"//提醒我看的列表
        },
        init:function(){
            var t=this;
            var locationParam=comm.getpara("#");
            if(locationParam.tab=="doctorList"){
                var data={};
                data.opT=locationParam.opT;
                data.reT=locationParam.reT;
                data.rId=locationParam.rId;
                mesDocListAjax(data);
            }else{
                $(".Ev-mesListEditStatus").css("margin-top",$(".al-indexHeader").outerHeight());//列表加上margin-top
                t.mesFollowShowList();
            }
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
        //提醒我看的列表
        mesFollowShowList:function(){
            var t=this;
            var _e=$(".Ev-mesListEditStatus");
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.messageType=t.config.messageType;
            param.isRemind=1;
            param.isShowRef=1;
            param.sortType=t.config.sortType;
            param.isRemindOrReply=2;//提醒我看2 评论我的1
            param.isShowAtt=1;
            t.ajaxFn({
                url: t.path.mesTrendsList,
                param:param,
                fn:function(data) {
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                        var items = data.responseObject.responseData.data_list;
                        t.mesFollowAddHtml(items);
                        $("#EV-selectToDelete").show();
                        _e.show();
                        if(items.length< t.config.pageSize){
                            _e.attr("scrollPagination", "disabled");
                        }else{
                            t.scrollPage();
                        }
                    }else{
                        $("#EV-selectToDelete").hide();
                        $(".Ev-mesNoList").show();
                        _e.hide();
                    }
                }
            });
        },
        //提醒我看添加html
        mesFollowAddHtml:function(items,kv){
            var t=this,html="",cusCount,cusName,doctorListParam,messageId;
            $.each(items,function(i,e){
                cusCount= e.customer_Count;
                cusName= e.sendCustomerName? e.sendCustomerName:"";//人名
                doctorListParam=' data-opType="'+ e.opType+'" data-resType="'+ e.refType+'" data-resId="'+ e.refId+'"';
                messageSrcTime=e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?comm.date.diffDay_one(e.messageSrcTime.substr(0,19),comm.date.local_time()):"";
                messageName=e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                if(e.refType==8){//评论
                    var content;
                    var messageBody;
                    if(e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")!=""){
                        messageBody=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                    }else{
                        if(e.attachment_resource.customer_review.reviewContent!=""){
                            messageBody=e.attachment_resource.customer_review.reviewContent
                        }else{
                            messageBody='【影像】';
                        }
                    }
                    var _p=e.attachment_resource;
                    if(_p&&!$.isEmptyObject(_p)&&_p.customer_review&&!$.isEmptyObject(_p.customer_review)&&_p.customer_review.parentId!=0){//跳转到讨论页面
                        content='/pages/personal/details_discuss.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+e.refReviewId+'&refName='+ e.refName.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'&refUrl='+e.refUrl;
                    }else{//父层是资源，跳转到正文页面
                        content='/pages/personal/details_content.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+e.refReviewId+'&refName='+ e.refName.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'&refUrl='+e.refUrl;
                    }
                }
                if(e.refType!=8){//资源
                    if(e.isValid!=1&& e.isValid!=""){//无效的屏蔽资源
                        messageContent='<article class="al-msgListItemContent al-msgHasDeletedOrShield">'+
                            '<p>'+messageName+'</p>'+
                            '</article>';
                    }else{//有效的资源
                        messageContent='<article class="al-msgListItemContent">'+
                            '<p>'+getResourceCon(e.refType)+": "+'《'+messageName+'》'+'</p>'+
                            '</article>';
                    }
                }else{//评论
                    if(e.attachment_resource.customer_review.reviewStatus!=1){//无效的屏蔽资源
                        messageContent='<article class="al-msgListItemContent al-msgHasDeletedOrShield">'+
                            '<p>'+messageBody+'</p>'+
                            '</article>';
                    }else{//有效的资源
                        messageContent='<article class="al-msgListItemContent">'+
                            '<p>'+getResourceCon(e.refType)+": "+comm.cutstr(messageBody,90,1)+'</p>'+
                            '</article>';
                    }
                }
                messageId=(e.messageId.lastIndexOf(",")>-1)?e.messageId:e.messageId+",";
                html+=' <section class="al-msgListItem Ev-mesListBox"'+doctorListParam+'  data-flag="1" ' +
                    'data-mesId="'+messageId+'" data-onePer="1" ' +
                    'data-resUrl="'+(e.refUrl?(e.refType!=8?e.refUrl:content):1)+'" >'+
                    '<header class="al-msgListTitle">'+
                    '<figure class="al-msgListHeadImg" style="position: relative;">'+
                    '<a class="Ev-mesPersonalCenter" href="javascript:void(0)" data-perCenter="/pages/personal/others_contribution.html?cid='+e.sendCustomerId+'"">'+
                    '<img src="'+(e.logoUrl?e.logoUrl:'//img50.allinmd.cn/pages/personal/no_head.png')+'">'+
                    (e.isRead==0?'<i class="icon-newTips"></i>':'')+
                    '</a>'+
                    '</figure>'+
                    '<article class="al-msgListTitleContent">'+
                    '<a href="javascript:;">'+cusName+'<i class="al-vipUser"></i></a>'+
                    '<span class="al-msgListStatus">'+
                    '提醒我看'+
                    '</span>'+
                    '<span class="al-msgListTime">'+messageSrcTime+'</span>'+
                    '</article>'+
                    '</header>'+
                        messageContent+
                    '</section>';
            });
            if(kv){
                $(".Ev-mesListEditStatus").append(html);
            }else{
                $(".Ev-mesListEditStatus").html(html);
            }
            mesSelectDelete();//选中删除
            mesDeletePop(
                function(){
                    t.mesFollowShowList();
                }
            );//删除弹层和未读变已读
        },
        //瀑布流滚动
        scrollPage: function () {
            var t = this;
            var pageIndex=2;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.messageType=t.config.messageType;
            param.isRemind=1;
            param.isShowRef=1;
            param.sortType=t.config.sortType;
            param.isRemindOrReply=2;//提醒我看2 评论我的1
            param.isShowAtt=1;
            $(".Ev-mesListEditStatus").off("scroll").scrollPagination({
                'contentPage': t.path.mesTrendsList,
                'contentData': $.extend(param, {
                    pageIndex: function () {
                        return pageIndex++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
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
                        $(".Ev-mesListEditStatus").attr("scrollPagination", "disabled");
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".Ev-mesListEditStatus").attr("scrollPagination", "disabled");
                            //alert("没有内容了");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            t.mesFollowAddHtml(items,1);
                        }
                    }
                }
            });
        }
    };
    //认证权限
    user.privExecute({
        operateType: 'auth',   //'login','auth','conference'
        callback:function(){
            controller.init();
        },
        reAuthCallback:function(){//二次认证操作
            $(".Ev-mesNoList").show();
            $(".Ev-mesListEditStatus").hide();
        }
    });

});
