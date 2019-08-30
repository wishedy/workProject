/**
 * 功能描述：消息页面，赞了我的
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/19.
 */

$(function(){
    //window.onload = Log.createBrowse(57,'消息赞了我的页面');
    var cid=TempCache.getItem("userId");
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
            mesPreferList:"/mcall/customer/message/json_preferList/",//赞了我的列表
            deleteReadOp:"/mcall/customer/message/update3/"//赞了我的全部已读
        },
        init:function(){
            var t=this;
            var locationParam=comm.getpara("#");
            if(locationParam.tab=="doctorList"){
                var data={};
                data.opT=locationParam.opT;
                data.reT=locationParam.reT;
                data.rId=locationParam.rId;
                data.cST=locationParam.cST;
                data.count=locationParam.cNum;
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
        //赞了我的列表
        mesFollowShowList:function(){
            var t=this;
            var _e=$(".Ev-mesListEditStatus");
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= t.config.pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            param.messageType=t.config.messageType;
            param.groupDateType=2;
            t.ajaxFn({
                url: t.path.mesPreferList,
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
                        t.praiseBackBtn();
                    }
                }
            });
        },
        //赞了我的添加html
        mesFollowAddHtml:function(items,kv){
            var t=this,html="",cusCount,onePerLogoImg,cusName,cusNameText,doctorListParam,moreNoRead,_logo,messageId;
            $.each(items,function(i,e){
                cusCount= e.customer_Count;
                cusName= e.logo_url_CustomerName? e.logo_url_CustomerName:"";//人名
                onePerLogoImg="";

                messageNameA='《'+ e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "")+'》';//返回带了a标签，资源
                messageNameB=e.messageName.replace(/\<(\/?\S+)\s*?[^<]*?(\/?)>/g, "");//评论
                //赞了我的
                if(e.refType!=8){//资源
                    if(e.messageIsValid!=1&& e.messageIsValid!=""){//屏蔽的资源
                        messageContent='<article class="al-msgListItemContent al-msgHasDeletedOrShield">'+
                            '<p>'+messageNameB+'</p>'+
                            '</article>';
                    }else{//正常的资源
                        messageContent='<article class="al-msgListItemContent">'+
                            '<p>'+ t.getResourceCon(e.refType)+" : "+messageNameA+'</p>'+
                            '</article>';
                    }
                }else{//评论
                    if(e.messageIsValid!=1&& e.messageIsValid!=""){//屏蔽的评论
                        messageContent='<article class="al-msgListItemContent al-msgHasDeletedOrShield">'+
                            '<p>'+messageNameB+'</p>'+
                            '</article>';
                    }else{//正常的评论
                        messageContent='<article class="al-msgListItemContent">'+
                            '<p>'+ t.getResourceCon(e.refType)+" : "+messageNameB+'</p>'+
                            '</article>';
                    }
                }
                if(e.logo_url_list&&e.logo_url_list.length){
                    _logo=e.logo_url_list[0].logoUrl;
                }else{
                    _logo='//img50.allinmd.cn/pages/personal/no_head.png';
                }
                if(cusCount==1){//1人
                    onePerLogoImg='<figure class="al-msgListHeadImg" style="position: relative;">'+
                        '<a class="Ev-mesPersonalCenter" href="javascript:;" data-perCenter="/pages/personal/others_contribution.html?cid='+ e.customer_List+'">'+
                        '<img src="'+_logo+'">'+
                        (e.isRead==0?'<i class="icon-newTips"></i>':'')+
                        '</a>'+
                        '</figure>';
                    cusNameText=cusName+'<i class="al-vipUser"></i>';
                    doctorListParam="";
                    moreNoRead="";
                }else if(cusCount>3){
                    cusNameText=cusName+"等"+cusCount+"人";
                    doctorListParam=' data-opType="'+ e.opType+'" data-resType="'+ e.refType+'" data-resId="'+ e.resourceId+'" data-cST="'+ e.messageSrcTime+'"';
                    moreNoRead=e.isRead==0?'al-msgListManyUserNews':'';
                }else{
                    cusNameText=cusName;
                    doctorListParam=' data-opType="'+ e.opType+'" data-resType="'+ e.refType+'" data-resId="'+ e.resourceId+'" data-cST="'+ e.messageSrcTime+'"';
                    moreNoRead=e.isRead==0?'al-msgListManyUserNews':'';
                }
                if(e.refType==8){
                    var content,resourceName,reviewId;
                    resourceName=e.resourceName?e.resourceName:e.refName;
                    reviewId=e.reviewId?e.reviewId:e.refReviewId;
                    if(e.customer_review&&!$.isEmptyObject(e.customer_review)&&e.customer_review.parentId!=0){//跳转到讨论页面
                        content='/pages/personal/details_discuss.html?refId='+e.resourceId+'&refType='+e.resourceType+
                            '&reviewId='+ reviewId+'&refName='+resourceName+'&refUrl='+e.resourceWebUrl;
                    }else{//父层是资源，跳转到正文页面
                        content='/pages/personal/details_content.html?refId='+e.resourceId+'&refType='+e.resourceType+
                            '&reviewId='+ reviewId+'&refName='+resourceName+'&refUrl='+e.resourceWebUrl;
                    }
                }
                messageId=(e.messageId.lastIndexOf(",")>-1)?e.messageId:e.messageId+",";
                messageTime=e.messageTime&&!$.isEmptyObject(e.messageTime)?comm.date.diffDay_one(e.messageTime.substr(0,19),comm.date.local_time()):"";
                html+=' <section class="al-msgListItem Ev-mesListBox"'+doctorListParam+'  data-flag="1" ' +
                    'data-mesId="'+messageId+'"'+(cusCount==1?'data-onePer="1"':"")+(cusCount!=1?'data-count="'+cusCount+'"':"")+
                    ' data-resUrl="'+ (e.resourceWebUrl?(e.refType!=8?e.resourceWebUrl:content):1)+'">'+
                    '<header class="al-msgListTitle">'+
                    onePerLogoImg+
                    '<article class="al-msgListTitleContent '+moreNoRead+'">'+
                    '<a href="javascript:;">'+cusNameText+'</a>'+
                    '<span class="al-msgListStatus">'+
                    getOpConText(e.opType)+
                    '</span>'+
                    '<span class="al-msgListTime">'+messageTime+'</span>'+
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
            t.praiseBackBtn();
        },
        praiseBackBtn:function(){
            var t=this;
            $(".Ev-praiseBtn").off("click").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if($(".Ev-mesListBox").length){
                    t.ajaxFn({
                        url: t.path.deleteReadOp,
                        param:{
                            opTypeRules: 3,
                            opType:5,
                            isRead:1,
                            customerId:cid
                        },
                        fn:function(data){
                            if(data&&data.responseObject&&data.responseObject.responseStatus){
                                window.location="/pages/message/message_main.html"
                            }
                        }
                    });
                }else{
                    window.location="/pages/message/message_main.html"
                }
            });
        },

        //赞了我的赞的类型
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
            var pageIndex= 2;
            var param={};
            param.dataFlag=t.config.dataFlag;
            param.pageIndex= pageIndex;
            param.pageSize=t.config.pageSize;
            param.logoUseFlag=t.config.logoUseFlag;
            param.sortType=t.config.sortType;
            param.messageType=t.config.messageType;
            param.groupDateType=2;
            $(".Ev-mesListEditStatus").off("scroll").scrollPagination({
                'contentPage': t.path.mesPreferList,
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
            controller.praiseBackBtn();
            $(".Ev-mesNoList").show();
            $(".Ev-mesListEditStatus").hide();
        }
    });

});
