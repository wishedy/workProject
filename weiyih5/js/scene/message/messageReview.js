/**
 * 功能描述：消息页面，评论我的
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/20.
 */
$(function(){
    //window.onload = Log.createBrowse(55,'消息评论我的页面');
    var controller={
        config:{
            pageIndex:1,
            pageSize:10,
            messageType:1,//系统消息不传messageType，其余4类都传1
            dataFlag:2,
            sortType:2,
            logoUseFlag:3,
            attUseFlag:3
        },
        path:{
            mesTrendsList:"/mcall/customer/message/getMapList3/"//提醒我看的列表，评论我的共用接口
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
        //评论我的列表
        mesFollowShowList:function(){
            var t=this;
            var _e=$(".Ev-mesListEditStatus");
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.attUseFlag=t.config.attUseFlag;
            param.messageType=t.config.messageType;
            param.refType=8;
            param.scene=3;
            param.isRemind=0;
            param.isShowRef=1;
            param.isShowAtt=1;
            param.isShowNoReadCount=1;
            param.sortType=t.config.sortType;
            param.isRemindOrReply=1;//提醒我看2 评论我的1
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
        //评论我的添加html
        mesFollowAddHtml:function(items,kv){
            var t=this,html="",cusCount,cusName,doctorListParam,reviewResUrl,messageId,messageName,messageNameContent,mBClass;
            $.each(items,function(i,e){
                cReview=e.attachment_resource.customer_review;
                cReviewP=e.attachment_resource.customer_review_parent;
                cusCount= e.customer_Count;
                cusName= e.sendCustomerName? e.sendCustomerName:"";//人名
                doctorListParam=' data-opType="'+ e.opType+'" data-resType="'+ e.showTitleType+'" data-resId="'+ e.refId+'"';
                messageName=e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");//replace(/</g,"&lt;").replace(/>/g,"&gt;");
                var messageBody;
                if(cReview.reviewStatus==1){
                    messageBody=cReview.reviewContent.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                }else{
                    messageBody=e.messageBody.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");
                }
                if(cReview&&cReview.length>0&&cReviewP&&cReviewP.length>0&&cReview.refCustomerId==cReviewP.refCustomerId){
                    e.showTitleType=8;
                }
                if(e.showTitleType!=8){//非评论
                    if(e.srcReviewStatus!=1){//屏蔽的messageBody
                        mBClass='al-msgHasDeletedOrShield';
                    }else{//正常的资源
                        mBClass='';
                    }
                    if(e.isValid!=1&& e.isValid!=""){//屏蔽的资源
                        messageNameContent='<span class="al-msgListItemMyText">'+
                            messageName+
                        '</span>';
                    }else{//正常的资源
                        messageNameContent='<span class="al-msgListItemMyType">'+
                            t.getResourceCon(e.showTitleType)+': '+
                            '</span>'+
                            '<span class="al-msgListItemMyText">'+
                            '《'+messageName+'》'+
                            '</span>';
                    }
                    reviewResUrl='data-resUrl="/pages/personal/details_content.html?refId='+e.refId+'&refType='+e.resourceType+
                        '&reviewId='+e.refReviewId+'&refName='+messageName+'&refUrl='+e.refUrl+'"';
                }else{//评论
                    if(e.srcReviewStatus!=1){//屏蔽的messageBody
                        mBClass='al-msgHasDeletedOrShield';
                    }else{//正常的资源
                        mBClass='';
                    }
                    if(cReviewP.reviewStatus!=1){//屏蔽的评论
                        messageNameContent='<span class="al-msgListItemMyText">'+
                            messageName+
                            '</span>';
                    }else{//正常的评论
                        messageNameContent='<span class="al-msgListItemMyType">'+
                            t.getResourceCon(e.showTitleType)+': '+
                            '</span>'+
                            '<span class="al-msgListItemMyText">'+
                            messageName+
                            '</span>';
                    }
                    resourceName=e.refName?e.refName:"";
                    var _p=e.attachment_resource;
                    if(_p&&!$.isEmptyObject(_p)&&_p.customer_review&&!$.isEmptyObject(_p.customer_review)&&_p.customer_review.parentId!=0){//跳转到讨论页面
                        reviewResUrl='data-resUrl="/pages/personal/details_discuss.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+e.refReviewId+'&refName='+resourceName+'&refUrl='+e.refUrl+'"';
                    }else{//父层是资源，跳转到正文页面
                        reviewResUrl='data-resUrl="/pages/personal/details_content.html?refId='+e.refId+'&refType='+e.resourceType+
                            '&reviewId='+e.refReviewId+'&refName='+resourceName+'&refUrl='+e.refUrl+'"';
                    }
                }
                messageId=(e.messageId.lastIndexOf(",")>-1)?e.messageId:e.messageId+",";
                messageSrcTime=e.messageSrcTime&&!$.isEmptyObject(e.messageSrcTime)?comm.date.diffDay_one(e.messageSrcTime.substr(0,19),comm.date.local_time()):"";
                html+=' <section class="al-msgListItem Ev-mesListBox"'+doctorListParam+'  data-flag="1" ' +
                    'data-mesId="'+ messageId+'" data-onePer="1" ' +reviewResUrl+'>'+
                    '<header class="al-msgListTitle">'+
                    '<figure class="al-msgListHeadImg" style="position: relative;">'+
                    '<a class="Ev-mesPersonalCenter" href="javascript:void(0)" data-perCenter="/pages/personal/others_contribution.html?cid='+ e.sendCustomerId+'">'+
                    '<img src="'+(e.logoUrl?e.logoUrl:'//img50.allinmd.cn/pages/personal/no_head.png')+'">'+
                    (e.isRead==0?'<i class="icon-newTips"></i>':'')+
                    '</a>'+
                    '</figure>'+
                    '<article class="al-msgListTitleContent">'+
                    '<a href="javascript:;">'+cusName+'<i class="al-vipUser"></i></a>'+
                    '<span class="al-msgListStatus">'+
                    '评论了'+
                    '</span>'+
                    '<span class="al-msgListTime">'+messageSrcTime+'</span>'+
                    '</article>'+
                    '</header>'+
                    '<article class="al-msgListItemContent '+mBClass+'">'+
                    '<p>'+comm.cutstr(messageBody,80,1).replace(/"/g,'').replace(/<(\/*?[b-z].*?)>/g,"&lt;$1&gt;").replace(/&lt;br\/&gt;/g,'<br/>').replace(/href=/g,"data-ajax=false style='color:#2899e6;' href=/pages/personal/others_contribution.html?cid=")+'</p>'+
                    '</article>'+
                    '<article class="al-msgListItemMyContent" style="word-break:break-all;">'+
                    '<p>'+
                    messageNameContent+
                    '</p>'+
                    '</article>'+
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

        //评论我的操作类型
        getResourceCon:function(e){
            var conText;
            switch (parseInt(e)){
                case 1:
                    conText="我的视频";
                    break;
                case 2:
                    conText="我的文库";
                    break;
                case 4:
                    conText="我的话题";
                    break;
                case 7:
                    conText="我的病例";
                    break;
                case 8:
                    conText="我的评论";
                    break;
            }
            return conText;
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
            param.attUseFlag=t.config.attUseFlag;
            param.messageType=t.config.messageType;
            param.refType=8;
            param.scene=3;
            param.isRemind=0;
            param.isShowRef=1;
            param.isShowAtt=1;
            param.isShowNoReadCount=1;
            param.sortType=t.config.sortType;
            param.isRemindOrReply=1;//提醒我看2 评论我的1
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
