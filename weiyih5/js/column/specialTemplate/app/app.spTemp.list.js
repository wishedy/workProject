/**
 * 功能描述：  专题模板
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：公共方法
 * Created by WangJingRong on 2016/10/20.
 */
var spTemp_list = {};
spTemp_list.one = {
    spTemp_listLoad: function(ev) {
        var myList = {
            config: {
                url: '/mcall/col/column/recommend/getResourceMapList/'
            },
            init: function() {
                var t = this;
                t.addList(ev);
                t.videoMore();
                t.checkEndTime();
                t.appClickEvent();//列表点击事件
            },
            /*** 处理点击事件 */
            appClickEvent:function(){
                var t=this;
                //新闻专家列表展开更多操作
                $(".ev-appClickList").off("click").on("click",function(){
                    var resourceId,resourceType,tplPath;
                    if($(this).attr("resourceId")){
                        resourceId = $(this).attr("resourceId");
                        resourceType = $(this).attr("resourceType");
                        tplPath = $(this).attr("tplPath");
                    }else{
                        resourceId = $(this).find(".appZDtitle").attr("resourceId");
                        resourceType = $(this).find(".appZDtitle").attr("resourceType");
                        tplPath = $(this).find(".appZDtitle").attr("tplPath");
                    }
                    appjs.gotoTerminalDetailVC($.toJSON({"resourceId":resourceId,"resourceType":resourceType,"tplPath":tplPath}));
                });
                $(".ev-appClickPerson").off("click").on("click",function(){
                    var resourceId = $(this).find(".appPerTitle").attr("resourceid");
                    if(resourceId){
                        appjs.gotoPersonalCenter($.toJSON({"customerId":resourceId}))
                    }
                });
                $(".appVideoLive").off("click").on("click",function(){
                    var conId=$(this).attr("conid"),
                        conSubId=$(this).attr("consubid");
                    appjs.gotoConferenceLive($.toJSON({'conSubId':conSubId,'conId':conId}));
                });
                $(".appResouSans").off("click").on("click",function(){
                    var appResouUrl=$(this).attr("appresouurl");
                    if(appResouUrl){
                        appjs.gotoAdPage($.toJSON({"adLinkUrl":appResouUrl}))
                    }
                });
                $(".appThemeUrl").off("click").on("click",function(){
                    var appuUrl=$(this).attr("appUrl");
                    if(appuUrl){
                        appjs.gotoAdPage($.toJSON({"adLinkUrl":appuUrl}))
                    }
                });
            },
            //封装请求函数
            ajaxFn: function(opt) {
                var o = opt;
                $.ajax({
                    url: o.url,
                    type: 'post',
                    data: o.param,
                    dataType: 'json',
                    success: function(data) {
                        if(data) {
                            o.fn(data)
                        }
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {;
                    }
                })
            },
            //点赞
            dianZan: function(refId,refType) {
                var data = {
                    customerId:appjs.getAuthorCustomerId(),
                    refId:refId,
                    usefulType:refType?refType:9,
                    upDownType:1
                };
                var params={paramJson: $.toJSON(data)};
                $.ajax({
                    url:"/mcall/customer/prefer/create/",
                    type:"post",
                    data:params,
                    dataType:"json",
                    async:false,
                    success:function(data){
                    }
                });
            },
            clearZan: function(refId,refType) {
                var data = {
                    customerId:appjs.getAuthorCustomerId(),
                    refId:refId,
                    usefulType:refType?refType:9,
                    upDownType:1
                };
                var params={paramJson: $.toJSON(data)};
                $.ajax({
                    url:"/mcall/customer/prefer/delete/",
                    type:"post",
                    data:params,
                    dataType:"json",
                    async:false,
                    success:function(data){
                    }
                });
            },
            clickPraise: function(c, b) {//c是父层 b是点赞数目
                var t = this;
                $(c).find('.spTemp_praise').off("click").on("click",function(event){
                    appjs.praise();
                    var _that = $(this);
                    var refId=_that.attr("resourceId");
                    var refType = _that.attr("refType");
                    if(appjs.getPraise()==true){
                        if(_that.hasClass("spTemp_praise_no")){
                            t.dianZan(refId,refType);
                            _that.removeClass("spTemp_praise_no").addClass("spTemp_praise_yes").html("已赞");
                            var asNum = _that.parents(c).find(b);
                            var asNumA = parseInt(asNum.text())+1;
                            asNum.text(asNumA);
                            _that.parents(c).find('.zhezhao_dianzanSuc').show().siblings('.zhezhao_dianzanDef').hide();
                            setTimeout(function(){ _that.parents(c).find('.zhezhao_dianzanSuc').hide()},3000);
                        }else if(_that.hasClass("spTemp_praise_yes")){
                            t.clearZan(refId,refType);
                            _that.removeClass("spTemp_praise_yes").addClass("spTemp_praise_no").html("点赞");
                            var asNum = _that.parents(c).find(b);
                            var asNumC = parseInt(asNum.text()) > 0 ? (parseInt(asNum.text()) - 1) : 0;
                            asNum.text(asNumC);
                            _that.parents(c).find('.zhezhao_dianzanDef').show().siblings('.zhezhao_dianzanSuc').hide();
                            setTimeout(function(){ _that.parents(c).find('.zhezhao_dianzanDef').hide()},3000);
                        }
                        event.stopPropagation();
                    }
                });
            },
            //创建展开更多DOM
            unfoldMoreHtml: function() {
                var unfoldMore = $('<div class="unfoldMore"><p>展开更多</p></div>');
                return unfoldMore;
            },
            checkEndTime:function(){
                if($(".video_live_box").length>0){
                    var beginTime=$("#videoComponent").attr("begintime");
                    var begin=Date.parse(beginTime.replace(/-/g, "/"));
                    var endTime=$("#videoComponent").attr("endtime");
                    var end=Date.parse(endTime.replace(/-/g, "/"));
                    var now = new Date().getTime();
                    if(begin<now && now<end){
                        $('.gsVideo').show().siblings().remove()
                    }else if(begin>now){
                        $('.beginTime').show().siblings().remove()
                    }else if(now>end){
                        $('.endTime').show().siblings().remove()
                    }
                }
            },
            //视频简介展开更多
            videoMore:function(){
                var t= this;
                if($(".video_live_introt_down")&&$(".video_live_introt_down").text().length>66){
                    var videoAllIntro = $(".video_live_introt_down").text();
                    var videoIntro = comm.getStrLen($(".video_live_introt_down").text(),132);
                    $(".video_live_introt_down").text(videoIntro)
                    $(".video_intro_more").show();
                }
                $(".video_intro_more span").on("click",function(){
                    if($(".video_intro_more").hasClass("video_intro_more_spread")){
                        $(".video_live_introt_down").text(videoAllIntro)
                        $(this).parent(".video_intro_more").addClass("video_intro_more_pack").removeClass("video_intro_more_spread").end().text("收起")
                    }else if($(".video_intro_more").hasClass("video_intro_more_pack")){
                        $(".video_live_introt_down").text(videoIntro)
                        $(this).parent(".video_intro_more").addClass("video_intro_more_spread").removeClass("video_intro_more_pack").end().text("展开")
                    }
                })
            },
            themeNewsHtml:function(data){
                var t = this;
                var themeNewsHtml = '',
                    moduleItem = data.moduleItem,
                    item = data.item,
                    aa = item.componentType,
                    dataId = data.dataId
                if(moduleItem&&moduleItem.length>0){
                    for(var j=0;j<moduleItem.length;j++){
                        var listItem = moduleItem[j];
                        themeNewsHtml += listItem.cnNewsBody;
                    }
                }
                //新闻列表
                if($('.sp_container_l div[data-id='+dataId+']')&&aa==4){
                    $('.sp_container_l div[data-id='+dataId+']').children('.theme_news').html(themeNewsHtml);
                }
                t.appClickEvent();
            },
            //创建资源列表DOM
            resourceListHtml: function(data) {
                var t = this;
                var resourceListHtml = '',
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    preferUp = "",
                    aa = item.componentType;

                if(item.interactiveOperation) {
                    var isHasPre = item.interactiveOperation;//是否有点赞
                }
                if(item.isShowMore) {
                    var isShowMore = item.isShowMore; //是否有更多
                    if(isShowMore == 1) {
                        var appTitleMore = item.moreWebUrl.replace("/m/","/app/");
                        $('div[data-id=' + dataId + '] .total_title').children('a').show();
                        $('div[data-id=' + dataId + '] .total_title').children('a').attr('href',appTitleMore)
                    } else {
                        $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                    }
                }
                if(moduleItem && moduleItem.length > 0) {
                    for(var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            resouTyp = listItem.resourceType,
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            resou_socialNum = "", //资源列表社交内容
                            video_play_time = "", //视频播放时间
                            videoBtn = ""; //视频播放按钮
                        //判断点赞状态
                        if(isHasPre == 1) {
                            preferUp = '<span class="spTemp_praise ' + (isPrefer == 0 ? "spTemp_praise_no" : "spTemp_praise_yes")
                                + '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                        }
                        //判断资源类型
                        if(resouTyp==1){
                            video_play_time = '<span class="spTemp_list_videoTime">'+listItem.playTime+'</span>';
                            videoBtn = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png" alt=""></i>';
                        }
                        //判断有几个社交内容
                        if(isSocial) {
                            for(var k = 0; k < isSocial.length; k++) {
                                switch(parseInt(isSocial[k])) {
                                    case 1:
                                        resou_socialNum += '<li class="resource_list_stat_liulan">' + listItem.browseNum.toWK() + '</li>';
                                        break;
                                    case 2:
                                        resou_socialNum += '<li class="resource_list_stat_shoucang">' + listItem.collectionNum.toWK() + '</li>';
                                        break;
                                    case 3:
                                        resou_socialNum += '<li class="resource_list_stat_pinglun">' + listItem.reviewNum.toWK() + '</li>';
                                        break;
                                    case 4:
                                        resou_socialNum += '<li class="resource_list_stat_dianzan">' + ((isPrefer==1&&listItem.preferUpNum==0)?"1":(listItem.preferUpNum ? listItem.preferUpNum.toWK() : "0")) + '</li>';
                                        break;
                                }
                            }
                        }
                        var name = listItem.author;
                        var manyAuthor = false;
                        if(resouTyp == 1){//视频
                            name = listItem.ownerNameStr;
                            if(name&&name.split(",").length&&name.split(",").length>=2){//多作者
                                manyAuthor = true;
                            }
                        }
                        //判断是否有图片
                        var _vType=listItem.videoType;
                        if(listItem.coverPicUrl) {
                            resourceListHtml += '<section class="spTemp_list_resource ev-appClickList">'+
                                '<section class="spTemp_list_resource_left '+($("div[data-id="+dataId+"] .resource_list").hasClass("resource_list_leftImg_rightArt")?"spTemp_right":"spTemp_left")+'">'+
                                '<h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="'+refId+'" resourceType="'+listItem.resourceType+'" tplPath="'+listItem.tplPath+'" class="appZDtitle">'+comm.getStrLen(listItem.title,38)+'</a>'+preferUp+'</h3>'+
                                '<ul>'+
                                '<li class="resource_list_stat_per'+((_vType&&(_vType==17||_vType==18||_vType==19))?" spTEBookIcon":"")+'">'
                                +(name?comm.getStrLen(name,10):"")+'</li>'+
                                resou_socialNum+
                                '</ul>'+
                                '</section>'+
                                '<section class="spTemp_list_resource_right '+($("div[data-id="+dataId+"] .resource_list").hasClass("resource_list_leftImg_rightArt")?"spTemp_left":"spTemp_right")+'">'+
                                '<div class="spTemp_list_resource_imgBox">'+
                                '<a href="javascript:;"><img src="'+listItem.coverPicUrl+'">'+videoBtn+'</a>'+
                                video_play_time+
                                '</div>'+
                                '</section>'+
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>'+
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>'+
                                '</section>'
                        } else {
                            resourceListHtml += '<section class="spTemp_list_resource ev-appClickList">'+
                                '<h3 class="spTemp_list_resource_title"><a href="javascript:;" resourceId="'+refId+'" resourceType="'+listItem.resourceType+'" tplPath="'+listItem.tplPath+'" class="appZDtitle">'+comm.getStrLen(listItem.title,38)+'</a>'+preferUp+'</h3>'+
                                '<ul>'+
                                '<li class="resource_list_stat_per'+((_vType&&(_vType==17||_vType==18||_vType==19))?" spTEBookIcon":"")+' ">'+(name?comm.getStrLen(name,10):"")+'</li>'+
                                resou_socialNum+
                                '</ul>'+
                                '<section class="zhezhao_dianzanSuc">点赞成功</section>'+
                                '<section class="zhezhao_dianzanDef">取消点赞成功</section>'+
                                '</section>'
                        }
                    }
                }
                //资源列表
                if($('.sp_container_l div[data-id=' + dataId + ']') && aa == 1) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if(item.isPage == 1) {
                        //创建资源列表请求分页时的起始页
                        var resourcePage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').append(unfoldMore).find('.unfoldMore').addClass("reList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore')
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function() {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, resourcePage, isSocial);
                            resourcePage++;
                        });
                    }
                }
                return resourceListHtml;
            },
            //创建会员列表DOM
            vipListHtml: function(data) {
                var t = this;
                var vipListHtml = '',
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    preferUp = "",
                    aa = item.componentType;
                if(item.interactiveOperation) {
                    var isHasPre = item.interactiveOperation; //是否有点赞
                }
                if(item.isShowMore) {
                    var isShowMore = item.isShowMore; //是否有更多
                    if(isShowMore == 1) {
                        var appTitleMore = item.moreWebUrl.replace("/m/","/app/");
                        $('div[data-id=' + dataId + '] .total_title').children('a').show();
                        $('div[data-id=' + dataId + '] .total_title').children('a').attr('href',appTitleMore)
                    } else {
                        $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                    }
                }
                if(moduleItem && moduleItem.length > 0) {
                    for(var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            vip_socialNum = "", //会员列表社交内容
                            companyNum = 26; //医院的截取数
                        //判断点赞状态
                        if(isHasPre == 1) {
                            companyNum = 16;
                            preferUp = '<span class="spTemp_praise ' + (isPrefer == 0 ? "spTemp_praise_no" : "spTemp_praise_yes") + '" resourceId="' + refId + '" isPrefer="' + isPrefer + '">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                        }
                        //判断有几个社交内容
                        if(isSocial) {
                            for(var k = 0; k < isSocial.length; k++) {
                                switch(parseInt(isSocial[k])) {
                                    case 3:
                                        if(listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>评论</span><span>' + listItem.customerStatistic.reviewNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        if(listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span class="vip_list_dianzan">' + ((isPrefer==1&&listItem.customerStatistic.othersUpNum==0)?"1":listItem.customerStatistic.othersUpNum.toWK()) + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if(listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + listItem.customerStatistic.fansNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 6:
                                        if(listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>关注</span><span>' + listItem.customerStatistic.followTrendsNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 7:
                                        if(listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + listItem.customerStatistic.contributionCount.toWK() + '</span></li>';
                                        }
                                        break;
                                }
                            }
                        }
                        vipListHtml += '<section class="spTemp_list_member ev-appClickPerson">'+
                            '<section class="spTemp_list_member_left spTemp_left"><img src="'+listItem.coverPicUrl+'"></section>'+
                            '<section class="spTemp_list_member_center spTemp_left">'+
                            '<h3 class="spTemp_list_member_title appPerTitle" resourceid="'+refId+'">'+(listItem.title?comm.getStrLen(listItem.title,10):"")+'</h3>'+
                            '<ul class="spTemp_list_member_intro">'+
                            '<li>'+listItem.medicalTitleShow+'</li>'+
                            '<li>'+(listItem.hospitalName?comm.getStrLen(listItem.hospitalName,companyNum):"")+'</li>'+
                            '</ul>'+
                            '<ul class="spTemp_list_member_info">'+
                            vip_socialNum+
                            '</ul>'+
                            '</section>'+
                            '<section class="spTemp_list_member_right spTemp_right">'+preferUp+'</section>'+
                            '<section class="zhezhao_dianzanSuc">点赞成功</section>'+
                            '<section class="zhezhao_dianzanDef">取消点赞成功</section>'+
                            '</section>'
                    }
                }
                //会员列表
                if($('.sp_container_l div[data-id=' + dataId + ']') && aa == 2) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if(item.isPage == 1) {
                        //创建专题列表请求分页时的起始页
                        var vipPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').append(unfoldMore).find('.unfoldMore').addClass("viList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').append(unfoldMore).find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function() {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, vipPage, isSocial);
                            vipPage++;
                        });
                    }
                }
                return vipListHtml;
            },
            //创建专题列表DOM
            specialListHtml: function(data) {
                var t = this;
                var specialListHtml = '',
                    moduleItem = data.moduleItem,
                    item = data.item,
                    aa = item.componentType,
                    dataId = data.dataId;
                if(moduleItem && moduleItem.length > 0) {
                    for(var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j];
                        if($('div[data-id='+data.dataId+']').find(".special_list").hasClass("special_list_topImg_bottomArt")) {
                            specialListHtml +=  '<section class="spTemp_list_topic">'+
                                '<section class="spTemp_list_topic_imgBox"><img src="'+listItem.coverPicUrl+'"></section>'+
                                '<section class="spTemp_list_topic_title">'+(listItem.summary?comm.getStrLen(listItem.summary,66):"")+'</section>'+
                                '<a href="'+listItem.h5Url.replace("/m/","/app/")+'"><section class="spTemp_list_topic_fullText"><span>查看全文</span></section></a>'+
                                '</section>'
                        }else{
                            specialListHtml += '<section class="spTemp_list_topic">'+
                                '<section class="spTemp_list_topic_title">'+(listItem.summary?comm.getStrLen(listItem.summary,66):"")+'</section>'+
                                '<section class="spTemp_list_topic_imgBox"><img src="'+listItem.coverPicUrl+'"></section>'+
                                '<a href="'+listItem.h5Url.replace("/m/","/app/")+'"><section class="spTemp_list_topic_fullText"><span>查看全文</span></section></a>'+
                                '</section>'
                        }
                    }
                }
                //专题列表
                if($('.sp_container_l div[data-id=' + dataId + ']') && aa == 8) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if(item.isPage == 1) {
                        //创建专题列表请求分页时的起始页
                        var specialPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').append(unfoldMore).find('.unfoldMore').addClass("spList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').find('.unfoldMore');
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function() {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, specialPage);
                            specialPage++;
                        });
                    }
                }
                return specialListHtml;
            },
            //创建排行榜DOM
            rankListHtml: function(data) {
                var t = this;
                var rankListHtml = "",
                    item = data.item,
                    moduleItem = data.moduleItem,
                    isSocial = data.isSocial,
                    dataId = data.dataId,
                    bb = item.recommendType, //排行榜类型 1:病例排行 2:专家排行
                    aa = 3
                if(moduleItem && moduleItem.length > 0) {
                    for(var k = 0; k < moduleItem.length; k++) {
                        var compItem = moduleItem[k],
                            vip_socialNum = "", //专家排行社交内容
                            refId = compItem.refId, //关联ID
                            rankNum = "",
                            resPic = ""
                        //判断排行版前面显示数字
                        if(item.pageIndex){
                            rankNum = k + 1 + (item.pageIndex-1)*item.pageSize
                        }else{
                            rankNum = k + 1
                        }
                        //判断是否有图片，没有用默认
                        if(compItem.coverPicUrl){
                            resPic = compItem.coverPicUrl.split('|')[0];
                        }else{
                            resPic = "/images/img50/225_150.jpg"
                        }
                        //判断有几个社交内容
                        if(isSocial){
                            for(var j = 0; j < isSocial.length; j++) {
                                switch(parseInt(isSocial[j])) {
                                    case 3:
                                        if(compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>评论</span><span>' + compItem.customerStatistic.reviewNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        if(compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span>' + compItem.customerStatistic.othersUpNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if(compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + compItem.customerStatistic.fansNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 7:
                                        if(compItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + compItem.customerStatistic.contributionCount.toWK() + '</span></li>';
                                        }
                                        break;
                                }
                            }
                        }

                        //判断专家排行2  病例排行1
                        if(aa == 3 && bb == 2) {
                            rankListHtml += '<div class="expert_content ev-appClickPerson">'+
                                '<p class="'+(rankNum<4?'num':'num_1')+'"><span>' + rankNum + '</span></p>'+
                                '<div class="expert_info">'+
                                '<p class="pic"><a href="javascript:;"><img src="' + compItem.coverPicUrl + '"></a></p>'+
                                '<div class="expert_info_cont">'+
                                '<p class="expert_name"><a href="javascript:;" class="name appPerTitle" resourceid="'+refId+'">' + compItem.title + '</a>'+(rankNum<4?'<i class="vipUser"></i>':"")+'</p>'+
                                '<p class="expert_prof"><span class="prof">' + compItem.medicalTitleShow + '</span><span>' + (compItem.hospitalName?comm.getStrLen(compItem.hospitalName,20):"") + '</span></p>'+
                                '<ul class="spTemp_list_member_info">'+
                                vip_socialNum+
                                '</ul>'+
                                '</div>'+
                                '</div>'+
                                '</div>'
                        }
                        var name = compItem.author;
                        var manyAuthor = false;
                        if(compItem.resourceType == 1){//视频
                            name = compItem.ownerNameStr;
                            if(name&&name.split(",").length&&name.split(",").length>=2){//多作者
                                manyAuthor = true;
                            }
                        }
                        if(aa == 3 && bb == 1) {
                            var _vType=compItem.videoType;
                            rankListHtml += '<div class="case_content ev-appClickList">'+
                                '<div class="case_cont_left '+($("div[data-id="+dataId+"] .resource_rank").hasClass("resource_rank_leftImg_rightArt")?"spTemp_right":"spTemp_left")+'">'+
                                '<p class="title"><a href="javascript:;" resourceId="'+refId+'" resourceType="'+compItem.resourceType+'" tplPath="'+compItem.tplPath+'" class="appZDtitle">'+comm.getStrLen(compItem.title,38)+'</a></p>'+
                                '<p class="doctor_info"><span><i class="case_author '+((_vType&&(_vType==17||_vType==18||_vType==19))?" spTEBookIcon":"")+'"></i>'+(name?comm.getStrLen(name,10):"")+'</span><span class="prof" '+(manyAuthor?'style="display: none"':'')+'>'+compItem.medicalTitleShow+'</span><span '+(manyAuthor?'style="display: none"':'')+'>'+(compItem.hospitalName?comm.getStrLen(compItem.hospitalName,16):"")+'</span></p>'+
                                '</div>'+
                                '<p class="case_cont_right '+($("div[data-id="+dataId+"] .resource_rank").hasClass("resource_rank_leftImg_rightArt")?"spTemp_left":"spTemp_right")+'">'+
                                '<a href="javascript:;"><img class="bg" src="'+resPic+'"></a>'+
                                '<i class="label" style="background:url('+(rankNum<4?"/images/img50/column/specialTemplate/label.png":"/images/img50/column/specialTemplate/lable_gray.png")+') no-repeat;background-size:cover;">'+(rankNum<10?0+rankNum:rankNum)+'</i>'+
                                '</p>'+
                                '</div>'
                        }
                    }
                }

                //病例排行
                if($('.sp_container_l div[data-id=' + dataId + ']') && bb == 1) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if(item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {
                        //创建病例排行列表请求分页时的起始页
                        var resourceRankPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').append(unfoldMore).find('.unfoldMore').addClass("reRankList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').append(unfoldMore).find('.unfoldMore')
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function() {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, resourceRankPage, isSocial);
                            resourceRankPage++;
                        });
                    }
                }
                //专家排行
                if($('.sp_container_l div[data-id=' + dataId + ']') && bb == 2) {
                    //判断是否有分页，添加展开更多DOM及事件
                    if(item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {
                        //创建专家排行列表请求分页时的起始页
                        var expertRankPage = 2;
                        //创建展开更多DOM
                        var unfoldMore = this.unfoldMoreHtml();
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').append(unfoldMore).find('.unfoldMore').addClass("viRankList");
                        var unfoldMore = $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').append(unfoldMore).find('.unfoldMore')
                        var className = unfoldMore.attr("class");
                        unfoldMore.on("click", function() {
                            comm.loading.show();
                            t.addPaging(className, item, dataId, expertRankPage, isSocial);
                            expertRankPage++;
                        });
                    }
                }

                return rankListHtml;
            },
            //创建推荐位DOM
            posidListHtml: function(data) {
                var t = this;
                var posidListHtml = "",
                    item = data.item,
                    moduleItem = data.moduleItem,
                    dataId = data.dataId,
                    aa = item.componentType;
                if(moduleItem && moduleItem.length > 0) {
                    if(moduleItem.length > 4) {
                        moduleItem.length = 4;
                    }
                    for(var j = 0; j < moduleItem.length; j++) {
                        var listItem = moduleItem[j],
                            resouTyp = listItem.resourceType,
                            resouTypCont = "",
                            video_play_time = "", //视频播放时间
                            videoBtn_small = "", //视频播放按钮
                            videoBtn_big = ""; //视频播放按钮
                        //判断资源类型
                        if(resouTyp==1){
                            video_play_time = '<span class="videoTime">'+listItem.playTime+'</span>';
                            videoBtn_small = '<i class="btn_small"><img src="/images/img50/column/specialTemplate/play-btn-small.png"></i>';
                            videoBtn_big = '<i class="btn_big"><img src="/images/img50/column/specialTemplate/play-btn-small.png"></i>';
                        }
                        //判断有几个资源，样式的改变
                        if(moduleItem.length == 1) {
                            posidListHtml = ""
                        } else if(moduleItem.length == 2 || moduleItem.length >= 4) {
                            if(item.recommendType == 3){
                                posidListHtml += '<a href="javascript:;" class="recommend_intro2_content appResouSans" appresouurl = "'+listItem.appUrl+'">'+
                                    '<dl>'+
                                    '<dt><img class="bg" src="'+listItem.coverPicUrl+'" alt="">'+videoBtn_big+'<i class="label"><img src="'+listItem.logoPicUrl+'"></i>'+video_play_time+'</dt>'+
                                    '<dd>'+(listItem.title?comm.getStrLen(listItem.title,32):"")+'</dd>'+
                                    '</dl>'+
                                    '</a>'
                            }else{
                                posidListHtml += '<a href="javascript:;" class="recommend_intro2_content ev-appClickList appZDtitle" resourceId="'+listItem.refId+'" resourceType="'+listItem.resourceType+'" tplPath="'+listItem.tplPath+'">'+
                                    '<dl>'+
                                    '<dt><img class="bg" src="'+listItem.coverPicUrl+'" alt="">'+videoBtn_big+'<i class="label"><img src="'+listItem.logoPicUrl+'"></i>'+video_play_time+'</dt>'+
                                    '<dd>'+(listItem.title?comm.getStrLen(listItem.title,32):"")+'</dd>'+
                                    '</dl>'+
                                    '</a>'
                            }
                        } else if(moduleItem.length == 3) {
                            if(item.recommendType == 3){
                                posidListHtml += '<a href="javascript:;" class="recommend_intro3_content appResouSans" appresouurl = "'+listItem.appUrl+'">'+
                                    '<dl>'+
                                    '<dt><img class="bg" src="'+listItem.coverPicUrl+'" alt="">'+videoBtn_big+'<i class="label"><img src="'+listItem.logoPicUrl+'"></i>'+video_play_time+'</dt>'+
                                    '<dd>'+(listItem.title?comm.getStrLen(listItem.title,32):"")+'</dd>'+
                                    '</dl>'+
                                    '</a>'
                            }else{
                                posidListHtml += '<a href="javascript:;" class="recommend_intro3_content ev-appClickList appZDtitle" resourceId="'+listItem.refId+'" resourceType="'+listItem.resourceType+'" tplPath="'+listItem.tplPath+'">'+
                                    '<dl>'+
                                    '<dt><img class="bg" src="'+listItem.coverPicUrl+'" alt="">'+videoBtn_big+'<i class="label"><img src="'+listItem.logoPicUrl+'"></i>'+video_play_time+'</dt>'+
                                    '<dd>'+(listItem.title?comm.getStrLen(listItem.title,32):"")+'</dd>'+
                                    '</dl>'+
                                    '</a>'
                            }
                        }
                    }
                    if($('.sp_container_l div[data-id=' + dataId + ']') && aa == 5) {
                        $('.sp_container_l div[data-id=' + dataId + ']').children('.posid_list').append(posidListHtml);
                    }
                    t.appClickEvent();//列表点击事件
                }

            },

            //添加各个列表
            addList: function(ev) {
                var t = this;
                if(ev.resTemplate && ev.resTemplate.bo.responseData) {
                    var dataItem = ev.resTemplate.bo.responseData.data_list;
                    if(dataItem && dataItem.length > 0) {
                        for(var i = 0; i < dataItem.length; i++) {
                            var item = dataItem[i],
                                dataId = item.colMenuLayoutModuleId,
                                aa=item.componentType,
                                moduleTitle = item.title,//组件标题
                                moduleItem = item.recommendResourceListMap,
                                resourceSource = item.resourceSource,
                                resourcePageNum=item.pageNum,
                                recommendType=item.recommendType,
                                isRanking=item.isRanking,
                                interactiveOperation=item.interactiveOperation,
                                resourceNum = item.resourceNum,
                                resourceTagId = item.resourceTagId,
                                resourceType = item.resourceType,
                                resourceEndTime = item.resourceEndTime,
                                resourceOwnType = item.resourceOwnType,
                                resourceSortType = item.resourceSortType,
                                resourceStartTime = item.resourceStartTime
                            if(item.settingElement) {
                                var isSocial = item.settingElement.split(',') //社交选项
                            };
                            //资源列表
                            if(item.componentType == 1) {
                                //创建资源列表DOM
                                var resourceListHtml = t.resourceListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //添加资源列表DOM
                                if(item.isPage == 1) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore').before(resourceListHtml);

                                } else {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').append(resourceListHtml);
                                }
                                //添加点赞事件
                                t.clickPraise('.spTemp_list_resource', '.resource_list_stat_dianzan');
                                t.appClickEvent();//列表点击事件
                            };
                            //会员列表
                            if(item.componentType == 2) {
                                //创建会员列表DOM
                                var vipListHtml = t.vipListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //添加会员列表DOM
                                if(item.isPage == 1) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').find('.unfoldMore').before(vipListHtml);
                                } else {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').append(vipListHtml);
                                }
                                //添加点赞事件
                                t.clickPraise(".spTemp_list_member", ".vip_list_dianzan");
                            };
                            //专题列表
                            if(item.componentType == 8) {
                                //创建会员列表DOM
                                var specialListHtml = t.specialListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                if(item.isPage == 1) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').find('.unfoldMore').before(specialListHtml);
                                } else {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').append(specialListHtml);
                                }
                            };
                            //排行榜列表
                            if(item.componentType == 3) {
                                //创建排行榜DOM
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                                //资源排行榜
                                if (recommendType==1) {
                                    if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {
                                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').find('.unfoldMore').before(rankListHtml);
                                    } else {
                                        $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').append(rankListHtml);
                                    }
                                } else if (recommendType==2) {	//会员排行榜
                                    if (item.isPage == 1 && parseInt(item.pageNum) < parseInt(item.totalCount)) {
                                        $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').find('.unfoldMore').before(rankListHtml);
                                    } else {
                                        $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').append(rankListHtml);
                                    }
                                }
                                t.appClickEvent();//列表点击事件
                            };
                            //新闻列表
                            if (item.componentType == 4) {
                                var themeNewsHtml = t.themeNewsHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                            }
                            //推荐位列表
                            if (item.componentType == 5) {
                                var posidListHtml = t.posidListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                //组件名称
                                $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                            }
                        }
                    }
                }
            },
            //添加分页功能,展开更多点击事件
            addPaging: function(className, item, dataId, paging, isSocial) {
                var className = className,
                    paging = paging
                var t = this;
                this.ajaxFn({
                    url: this.config.url,
                    param: {
                        paramJson: $.toJSON({
                            pageIndex: paging,
                            customerId: item.customerId,
                            visitSiteId: 2,
                            pageSize: item.pageNum,
                            columnId: item.columnId,
                            isRanking: item.isRanking,
                            recommendType: item.recommendType,
                            interactiveOperation: item.interactiveOperation,
                            resourceSource:item.resourceSource,
                            resourceNum:item.resourceNum,
                            resourceTagId:item.resourceTagId,
                            resourceType:item.resourceType,
                            resourceEndTime:item.resourceEndTime,
                            resourceOwnType:item.resourceOwnType,
                            resourceSortType:item.resourceSortType,
                            resourceStartTime:item.resourceStartTime
                        })
                    },
                    fn: function(data) {
                        comm.loading.hide();
                        var item = data.bo.responseData.data_list[0],
                            moduleItem = item.recommendResourceListMap;
                        switch(className) {
                            //资源列表的回调函数
                            case 'unfoldMore reList':
                                var resourceListHtml = t.resourceListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore').before(resourceListHtml);
                                //添加点赞事件
                                t.clickPraise('.spTemp_list_resource', '.resource_list_stat_dianzan');
                                break;
                            //会员列表的回调函数
                            case 'unfoldMore viList':
                                var vipListHtml = t.vipListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').find('.unfoldMore').before(vipListHtml);
                                //添加点赞事件
                                t.clickPraise(".spTemp_list_member", ".vip_list_dianzan");
                                break;
                            //专题列表的回调函数
                            case 'unfoldMore spList':
                                var specialListHtml = t.specialListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').find('.unfoldMore').before(specialListHtml);
                                break;
                            //资源排行榜的回调函数
                            case 'unfoldMore reRankList':
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').find('.unfoldMore').before(rankListHtml);
                                break;
                            //会员排行榜的回调函数
                            case 'unfoldMore viRankList':
                                var rankListHtml = t.rankListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                                $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').find('.unfoldMore').before(rankListHtml);
                                break;
                            default:
                                break;
                        }
                        t.appClickEvent();//列表点击事件
                    }
                });
                //再请求下一页数据,判断是否显示展开更多DOM
                this.ajaxFn({
                    url: this.config.url,
                    param: {
                        paramJson: $.toJSON({
                            pageIndex: paging + 1,
                            customerId: item.customerId,
                            visitSiteId: 2,
                            pageSize: item.pageNum,
                            columnId: item.columnId,
                            isRanking: item.isRanking,
                            recommendType: item.recommendType,
                            interactiveOperation: item.interactiveOperation,
                            resourceSource:item.resourceSource,
                            resourceNum:item.resourceNum,
                            resourceTagId:item.resourceTagId,
                            resourceType:item.resourceType,
                            resourceEndTime:item.resourceEndTime,
                            resourceOwnType:item.resourceOwnType,
                            resourceSortType:item.resourceSortType,
                            resourceStartTime:item.resourceStartTime
                        })
                    },
                    fn: function(data) {
                        comm.loading.hide();
                        var item = data.bo.responseData.data_list[0],
                            moduleItem = item.recommendResourceListMap
                        switch(className) {
                            //资源列表的回调函数
                            case 'unfoldMore reList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_list').find('.unfoldMore').hide();
                                }
                                break;
                            //会员列表的回调函数
                            case 'unfoldMore viList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.vip_list').find('.unfoldMore').hide();
                                }
                                break;
                            //专题列表的回调函数
                            case 'unfoldMore spList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.special_list').find('.unfoldMore').hide();
                                }
                                break;
                            //资源排行榜的回调函数
                            case 'unfoldMore reRankList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.resource_rank').find('.unfoldMore').hide();
                                }
                                break;
                            //会员排行榜的回调函数
                            case 'unfoldMore viRankList':
                                if (item.recommendResourceListMap.length == 0) {
                                    $('.sp_container_l div[data-id=' + dataId + ']').children('.expert_rank').find('.unfoldMore').hide();
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        }
        myList.init();
    }
}
