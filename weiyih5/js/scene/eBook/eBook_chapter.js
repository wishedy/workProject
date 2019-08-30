/**
 * Created by ALLIN on 2016/11/22.
 */
$(function(){
    FastClick.attach(document.body);
    // Log.createBrowse(164,'章节列表页-文章Tab');
    setTimeout(function(){
      g_sps&&g_sps.createBrowse({pageId:421});
    },2000)
    var chapterList={
        path:{
            articleList:'/mcall/cms/doc/getMapByDocList/',
            videoList:'/mcall/cms/video/getMapByVideoList/',
            share:"/mcall/comm/data/share/getMapList3/"    //分享话术
        },
        init:function(){
            var t=this;
            t.visitSiteId=2;
            t.pageIndex=1;
            t.pageSize=10;
            t.book=comm.getpara();
            t.sortTypeA=2;
            t.sortTypeV=0;
            t.getArticleListData();
            t.getVideoListData();
            t.bindArticleOrder();
            t.bindVideoOrder();
            //t.getShareData();
            t.backBtnClick();
            t.style();
            t.videoPageIndex = 2;
            t.videoQureying = false;
            comm.slideTabs(function(){
                var aIndex = $('.slide-navbarItem.active').index();
                t.slideIndex = aIndex;
                if(aIndex==0){
                    // Log.createBrowse(164,'章节列表页-文章Tab');
                    setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:421});
                    },2200);
                }else{
                    // Log.createBrowse(165,'章节列表页-视频Tab');
                    setTimeout(function(){
                      g_sps&&g_sps.createBrowse({pageId:422});
                    },2200);
                    t.scrollPage_video(t.videoPageIndex);
                }
            });
        },
        style:function(){
            $(".al-personalContributionSelector h2").on("click", function() {
                if ($(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
                    $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                } else {
                    $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
                }

            });
            $(".al-personalContributionSelectorItem").on("click", function() {
                $(this).addClass('active').siblings().removeClass('active');
                $(this).parents(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                $(this).parents(".al-personalContributionSelector").find('h2').text($(this).text());
            });
        },
        getArticleListData:function(){
            var t=this;
            var data={};
            data.bookId=parseInt(t.book.articleBook);
            data.visitSiteId=t.visitSiteId;
            data.scene=1;
            data.catalogueId=parseInt(t.book.articleCatalogue);
            data.pageIndex=t.pageIndex;
            data.pageSize=t.pageSize;
            data.sortType=t.sortTypeA;    //为18按浏览数排序,为19按评论数排序,2默认排序
            t.data=data;
            var params_article={paramJson: $.toJSON(data)};
            comm.loading.show();
            $('.al-eBookHeadListBox h1').text(t.book.catalogueName);
            $('title').text(t.book.catalogueName+'-'+t.book.bookName+'唯医,allinmd');
            comm.ajax.async(t.path.articleList,params_article,function(data){
                if(comm.hasResponseData(data)&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    t.articleNum=total_count;
                    $('figure[data-role="article"] span').text(total_count);
                    $('.article .contributionNum').text(total_count);
                }
                if(comm.hasResponseData(data)&&data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.loadArticleList(data_list);
                    }
                    //comm.slideTabs();
                    t.scrollPage_article();
                    if(t.book.type==2){//默认视频点击
                        $(".slide-navbarItem").eq(1).click();
                    }
                }
                if($.isEmptyObject(data.responseObject.responseData)){
                    $('.al-articleListContent').empty();
                    $('.al-articleListContent').append('<div class="al-eBookNoContent"><img src="//img50.allinmd.cn/pages/eBook/eBookNoContentImg.png" alt=""/></div>');
                    $('figure[data-role="article"] span').text(0);
                    $('.article .contributionNum').text(0);
                    $('.al-personalContributionTitle.article').siblings().hide();
                }
                //t.getShareData();
                t.shareOp();
                //comm.slideTabs();
                comm.loading.hide();
            });
        },
        getVideoListData:function(){
            var t=this;
            var data={};
            data.bookId=t.book.articleBook;
            data.visitSiteId=t.visitSiteId;
            data.pageIndex=t.pageIndex;
            data.pageSize= t.pageSize;
            data.scene=10;
            data.catalogueId=t.book.articleCatalogue;
            data.videoEbookCatagory=t.sortTypeV;        //0-全部 1-视诊/触诊 2-活动度 3-肌力检查 4-操作 5-特殊检查
            t.param=data;
            var params_video={paramJson: $.toJSON(data)};
            comm.loading.show();
            comm.ajax.async(t.path.videoList,params_video,function(data){
                if(comm.hasResponseData(data)&&data.responseObject.responseData.total_count){
                    var total_count=data.responseObject.responseData.total_count;
                    t.videoNum=total_count;
                    $('figure[data-role="video"] span').text(total_count);
                    $('.video .contributionNum').text(total_count);
                }
                if(comm.hasResponseData(data)&&data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0){
                        t.loadVideoList(data_list);
                    }
                    //t.scrollPage_video();

                }
                if($.isEmptyObject(data.responseObject.responseData)){
                    $('.al-videoListContent').empty();
                    $('.al-videoListContent').append('<div class="al-eBookNoContent"><img src="//img50.allinmd.cn/pages/eBook/eBookNoContentImg.png" alt=""/></div>');
                    $('figure[data-role="video"] span').text(0);
                    $('.video .contributionNum').text(0);
                    $('.al-personalContributionTitle.video').siblings().hide();
                }
                if(data&&data.responseObject.responseData&&data.responseObject.responseData.catagory_list){
                    var catagory_list=data.responseObject.responseData.catagory_list[0];
                    t.typeList(catagory_list);
                }
                //comm.slideTabs();
                comm.loading.hide();
            });
        },
        scoreDom:function(s,scoreNum){
            var score="";
            if(scoreNum<10){return ""}
            var num = parseInt(s);
            var flot =(s-num)*100+"%";
            if(num==0){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li></ul></div>';
            }else if(num==1){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li></ul></div>';
            }else if(num==2){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li></ul></div>';
            }else if(num==3){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li></ul></div>';
            }else if(num==4){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li></ul></div>';
            }else if(num==5){
                score='<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
            }
            return score;
        },
        loadArticleList:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++) {
                var dataItem = data[i];
                if(data.length>=3){
                    t.firstDocName=data[0].docName;
                    t.secondDocName=data[1].docName;
                    t.threeDocName=data[2].docName;
                }else{
                    t.firstDocName=data[0]?data[0].docName:"";
                    t.secondDocName=data[1]?data[1].docName:"";
                    t.threeDocName=data[2]?data[2].docName:"";
                    data[i].docName?data[i].docName:'';
                }
                if (dataItem.picUrl !== '') {
                    html += '<section class="al-contentPartModule">' +t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText"><a href="'+dataItem.webStoragePath+'" class="al-contentTitle"><span>' + dataItem.docName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +
                        '<span class="icon-contentWatchedNum">' + dataItem.browseNum + '</span>' +
                        '<span class="icon-tagComment">' + dataItem.reviewNum + '</span></p>' +
                        '</article>' +
                        '<figure class="al-contentImgBox">' +
                        '<a href="'+dataItem.webStoragePath+'"><img src="' + dataItem.picUrl + '" data-original="' + dataItem.picUrl + '" alt=""></a>' +
                        '</figure>' +
                        '</section>' +
                        '</section>';
                } else {
                    html += '<section class="al-contentPartModule">' +t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                        '<section class="al-tableBox">' +
                        '<article class="al-contentText"><a href="'+dataItem.webStoragePath+'" class="al-contentTitle"><span>' + dataItem.docName + '</span></a>' +
                        '<p class="al-contentOtherMsg">' +
                        '<span class="icon-contentWatchedNum">' + dataItem.browseNum + '</span>' +
                        '<span class="icon-tagComment">' + dataItem.reviewNum + '</span>' +
                        '</p>' +
                        '</article>' +
                        '</section>' +
                        '</section>';
                }
            }
            $('.al-articleListContent').append(html);
        },
        loadVideoList:function(data){
            var t=this;
            var html='';
            for(var i=0;i<data.length;i++){
                var dataItem = data[i];
                html+='<section class="al-contentPartModule">'+t.scoreDom(dataItem.currentStarLevel,dataItem.currentScoreNum)+
                    '<section class="al-tableBox">'+
                    '<article class="al-contentText"><a href="'+dataItem.webStoragePath+'" class="al-contentTitle"><span>'+dataItem.videoName+'</span></a>'+
                    '<p class="al-contentOtherMsg">'+
                    '<span class="icon-contentWatchedNum">'+dataItem.browseNum+'</span>'+
                    '<span class="icon-tagComment">'+dataItem.reviewNum+'</span></p>'+
                    '</article>'+
                    '<figure class="al-contentImgBox">'+
                    '<a href="'+dataItem.webStoragePath+'">' +
                    '<img src="'+dataItem.picUrl+'" data-original="'+dataItem.picUrl+'" alt="">' +
                    '<i class="al-videoPlayBtn"><img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt=""></i>' +
                    '<span class="al-videoTime">'+dataItem.playTime+'</span>' +
                    '</a>'+
                    '</figure>'+
                    '</section>'+
                    '</section>';
            }
            $('.al-videoListContent').append(html);
            if(t.slideIndex==1){
                $(".slide-wrapper").height($(".slide-content[data-role=video]").innerHeight());
            }
        },
        bindArticleOrder:function(){
            var t=this;
            $('section[data-role="article"] .al-personalContributionSelectorItem').on('click',function(){
                var n = $(this).index();
                switch(n){
                    case 0:
                        t.sortTypeA=2;
                        break;
                    case 1:
                        t.sortTypeA=18;
                        break;
                    case 2:
                        t.sortTypeA=19;
                        break;
                }
                $('.al-articleListContent').empty();
                $(".al-articleListContent").attr("scrollPagination", "enabled");
                t.getArticleListData();
            });
        },
        bindVideoOrder:function(){
            var t=this;
            $('section[data-role="video"] .al-personalContributionSelectorItem').on('click',function(){
                t.sortTypeV=$(this).data('id');
                //console.log(t.sortTypeV);
                $('.al-videoListContent').empty();
                $(".al-videoListContent").attr("scrollPagination", "enabled");
                t.getVideoListData();
            });
        },
        backBtnClick:function(){
            $(".al-eBookHeadListBox img").on("click", function() {
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                  g_sps.jump(null, "/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //文章列表瀑布流
        scrollPage_article:function () {
            var t = this;
            var num=2;
            $(".al-articleListContent").off("scroll").scrollPagination({
                'contentPage': t.path.articleList,
                'contentData': $.extend(t.data, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "POST",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".al-articleListContent").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".al-articleListContent").attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData.data_list;
                            var html=t.loadArticleList(result);
                            var role=$(".slide-navbarItem.active").attr("data-role");
                            $(".al-articleListContent").append(html);
                            $(".slide-wrapper").height($(".slide-content[data-role='"+role+"']").innerHeight());
                        }
                    }
                }
            });
        },
        //视频列表瀑布流
        scrollPage_video:function (videoPageIndex) {
            var t = this;
            var num=2;
            if(t.slideIndex==1){
                $(window).on('scroll',function(){
                    if($(window).height()+$(window).scrollTop()>= $(document).height()){
                        if($(".al-videoListContent").attr('dataMore')!='none'&&!t.videoQuerying){
                            t.videoQureying = true;
                            $.ajax({
                                url:t.path.videoList,
                                data:{paramJson:$.toJSON($.extend({},t.param,{pageIndex:videoPageIndex}))},
                                dataType:"json",
                                type:'post',
                                success:function(data){
                                    t.videoQureying = false;
                                    if(comm.hasResponseData(data)&&data.responseObject.responseData.data_list&&data.responseObject.responseData.data_list.length){
                                        t.videoPageIndex++;
                                        var result = data.responseObject.responseData.data_list
                                       t.loadVideoList(result);
                                        var role=$(".slide-navbarItem.active").attr("data-role");
                                        if(data.responseObject.responseData.data_list.length<10){
                                            $(".al-videoListContent").attr('dataMore','none');
                                        }
                                    }else{
                                        $(".al-videoListContent").attr('dataMore','none');
                                    }
                                }
                            });
                        }

                    }
                });
            }
            //$(".al-videoListContent").off("scroll").scrollPagination({
            //    'contentPage': t.path.videoList,
            //    'contentData': $.extend(t.param, {
            //        pageIndex: function () {
            //            return num++;
            //        }
            //    }),
            //    'scrollTarget': $(window),
            //    'heightOffset': 0,
            //    'delaytime': 0,
            //    'type': "POST",
            //    'beforeLoad': function () {
            //        comm.loading.show();
            //    },
            //    'afterLoad': function (elementsLoaded) {
            //        comm.loading.hide();
            //    },
            //    'loader': function (data) {
            //        if ($.isEmptyObject(data)) {
            //            $(".al-videoListContent").attr("scrollPagination", "disabled");
            //            return false;
            //        } else {
            //            if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
            //                $(".al-videoListContent").attr("scrollPagination", "disabled");
            //                return false;
            //            }
            //            else {
            //                var result = data.responseObject.responseData.data_list;
            //                var html=t.loadVideoList(result);
            //                var role=$(".slide-navbarItem.active").attr("data-role");
            //                $(".al-videoListContent").append(html);
            //                $(".slide-wrapper").height($(".slide-content[data-role='"+role+"']").innerHeight());
            //            }
            //        }
            //    }
            //});
        },
        // 分享按钮
        getShareData:function(){
            var t=this;
            var params={};
            var params_share={paramJson: $.toJSON({
                attUseFlag:3,
                useFlag:3,
                docId:t.book.articleBook,
                visitSiteId:2,
                resourceType:0,
                sceneType:27,
                sessionCustomerId: $("#sesCustomerId").val()||'',
                catalogueName:t.book.catalogueName,
                catalogueNum:t.book.catalogueNum,
                firstDocName: t.firstDocName,
                secondDocName: t.secondDocName,
                threeDocName: t.threeDocName,
                docCount:t.articleNum,
                catalogueId:t.book.articleCatalogue
            })};
            $.ajax({
                url: t.path.share,
                data: params_share,
                dataType: "json",
                type: "post",
                async: false,
                success: function (data) {
                    if (comm.hasResponseData(data) && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list[0]) {
                        var items = data.responseObject.responseData.data_list[0];
                        params.title = items.share_comm.shareTitle !== "" ? items.share_comm.shareTitle : document.title;
                        params.pic = items.share_comm.shareImageUrl;
                        $.each(items.share_channel, function (i, el) {
                            if (el.shareChannel == "WechatTimeline") {
                                params.wxTitle = el.shareTitle;
                                params.wxDesc = el.shareDesc;
                            } else if (el.shareChannel == "WechatFriend") {
                                params.timeLineTitle = el.shareTitle;
                                params.friCircleDesc = el.shareDesc;
                            } else if (el.shareChannel == "QZone") {
                                params.qzoneTitle = el.shareTitle;
                                params.summary = el.shareDesc;
                            } else if (el.shareChannel == "Sina") {
                                params.sinaTitle = el.shareDesc;
                            }
                        });
                    }
                }
            });
            return params;
        },
        shareOp:function(kv){
            var t=this;
            var refType = 2;
            var cId = TempCache.getItem("userId");
            var refId = t.book.articleBook;
            var shareObj ={};
            shareAll({
                trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data: {
                    "reprintType": refType,
                    "customerId": cId,//当前人ID
                    "refId": refId,//资源id
                    "visitSiteId": "2"//1PC 2 h5
                },//分享动态传给后台的参数
                callback: function () {
                },//
                qShareLog: function (x) {    //分享新浪，空间成功与否都执行
                    if (x == 'sina') {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 164,
                            shareChannel: 3,
                            shareContent: shareObj.sinaTitle
                        });
                    } else {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 164,
                            shareChannel: 1,
                            shareContent: shareObj.qZoneTitle
                        });
                    }
                },
                fnMessageSuc: function () {//微信好友
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 164,
                        shareChannel: 4,
                        shareContent: shareObj.wxTitle
                    });
                },      //分享好友成功回调
                fnTimelineSuc: function () {//朋友圈
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: "",
                        refId: "",
                        isValid: 1,
                        shareSence: 164,
                        shareChannel: 5,
                        shareContent: shareObj.timeLineTitle
                    });
                },      //分享朋友圈成功回调
                triggerRequest: function () {
                    shareObj = t.getShareData();
                    return shareObj;
                }
            },false,$('.al-scrollShareBtn'));
        },
        typeList:function(ev){
            if(ev.ActivityCount==0){//活动度
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(3)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(3)').css("display","block");
            }
            if(ev.VisionCount==0){//视诊/触诊
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(2)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(2)').css("display","block");
            }
            if(ev.operatingCount==0){//操作
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(5)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(5)').css("display","block");
            }
            if(ev.specialCount==0){//特殊检查
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(6)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(6)').css("display","block");
            }
            if(ev.strengthCount==0){//肌力检查
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(4)').css("display","none");
            }else{
                $('.al-personalContributionTitle.video').siblings().find('li:nth-child(4)').css("display","block");
            }
        }
    };
    chapterList.init();
});