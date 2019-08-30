/**
 * 功能描述：  PK参赛作品
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/1/20.
 */
$(function(){
    var PKWork={
        path:{
            getActivityId:"/mcall/cms/activity/getActivityMapList/",
            getTagList:"/mcall/activity/property/getMapList/",
            getList:"/mcall/activity/resourcesList/search_list_activty/"
        },
        init:function(){
            this.videoPro=[];
            this.casePro=[];
            this.mediaType="video";
            this.iconName="play";
            this.order="browse";
            this.activityType=1;
            this.browser=browser.versions;
            if(this.browser.iPhone||this.browser.iPad){
                this.className="i";
            }
            if(this.browser.android){
                this.className="a";
            }
            this.activityId=$("#activityId").val();
            //this.getActId();
            this.getTags();
            this.query();
            this.initMenuScroll();
            this.bindOrders();
            this.bindMenu();
            this.typeClick();
            this.bindCloseBtn();
            this.share();
            /**
             * 处理点击事件
             */
            var t=this;
            $(".prod_list").off("vclick").on("vclick",'.list_con',function (event) {
                event.stopPropagation();
                var resourceId=$(this).attr("resourceId");
                if (t.activityType==1) {//视频
                    //alert(1);
                    appjs.gotoVideoDetail($.toJSON({"resourceId":resourceId,"videoName":$(this).attr("resourceName")}))
                }else{
                    //alert(1);
                    appjs.gotoCaseDetail($.toJSON({resourceId:resourceId}))
                }
                return false;
            });
        },
        share:function(){
            var t=this;
            if(status==1){//1:结果公示中 -1:过期
                qqTitle="《骨科示教病例及手术视频评选活动》最终获奖结果揭晓"; //qq微信title
                qqDesc="最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！"; //qq微信簡介
                sDesc="《骨科示教病例及手术视频评选活动》最终获奖结果揭晓—最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？点击揭晓，并查看全部优秀作品！点击链接："; //新浪簡介
                mDesc="《骨科示教病例及手术视频评选活动》最终获奖结果揭晓—最终结果新鲜出炉，桂冠由谁摘得？人气王花落谁家？查看全部优秀作品！点击链接：";//短信
            }else{
                qqTitle="决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！"; //qq微信title
                qqDesc="点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！"; //qq微信簡介
                sDesc="决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！点击链接："; //新浪簡介
                mDesc="决战一触即发，骨科示教病例及手术视频选拔赛决赛入围名单公布！点击查看优秀作品名单，看看有没有你心中的“它”！桂冠最终由谁摘得？5月21日CAOS2016为你揭晓！点击链接：";//短信
            }
            $(".EVshare_btn").on("click",function(){
                urlNew="http://m.allinmd.cn/pages/column/videoPK/m/works.html?activityType="+ t.activityType+(t.propertyIds?"&propertyIds="+ t.propertyIds:'');
                appjs.share($.toJSON({"url":urlNew,
                    "imgUrl":"http://m.allinmd.cn/images/img50/column/videoPK/pk_banner.jpg",
                    "sinaContent":sDesc,
                    "qqTitle":qqTitle,
                    "qqContent":qqDesc,
                    "messageContent":mDesc
                    })
                );
            })
        },
        navScroll:function(){
            var titleH=$("#browser_title").outerHeight();
            var navH=$(".casePK_nav").outerHeight();
            var headerTop = $(".casePK_nav").offset().top-titleH;
            $(window).on("scroll swipe vmousemove", function (ev) {
                // down
                var len = document.body.scrollTop - headerTop;
                if (len > 0) { // 向下滑动
                    $('.casePK_nav').css({
                        position:'fixed',
                        top:titleH+"px",
                        left:'0',
                        background:"#fff",
                        zIndex:"10"
                    });
                    $(".casePK_h5").css({marginTop:navH+"px"});
                } else {	// up       向上滑动
                    $(".casePK_h5").css({marginTop:"0px"});
                    $('.casePK_nav').css({
                        position:'static'
                    });
                }

            });
        },
        //下拉菜单跟随
        initMenuScroll: function () {
            var t = this;
            var titleH=$("#browser_title").outerHeight();
            var downH=$(".casePK_down").outerHeight();
            var navH=$(".casePK_nav").outerHeight();
            t.headerTop = $(".casePK_down").offset().top-titleH-navH;
            $(window).on("scroll swipe vmousemove", function (ev) {
                // down
                var len = document.body.scrollTop - t.headerTop;
                if (len > 0) { // 向下滑动
                    $('.casePK_down').css({
                        position:'fixed',
                        top:titleH+navH-1+"px",
                        left:'0',
                        background:"#fff",
                        zIndex:"10"
                    });
                    //$(".casePK_h5").css({marginTop:downH+navH+"px"});
                } else {	// up       向上滑动
                    //$(".casePK_h5").css({marginTop:"0px"});
                    $('.casePK_down').css({
                        position:'static'
                    });
                }

            });

        },
        //获取活动id
        getActId:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getActivityId,
                data : {},
                async:false,
                dataType : "json",
                success : function(rep){
                    if(rep&&rep.responseObject&&rep.responseObject.responseData){
                        if(rep.responseObject.responseData.list&&rep.responseObject.responseData.list.length>0){
                            t.activityId=rep.responseObject.responseData.list[0].activityId;
                        }

                    }
                },
                error:function(){}
            });
        },
        //获取不同参赛类型下的专业
        getTags:function(){
            var t=this;
            $.ajax({
                type : "post",
                url : t.path.getTagList,
                data : {paramJson:$.toJSON({activityId:t.activityId,activityType:t.activityType,parentId:0})},
                dataType : "json",
                success : function(data){
                    var vPktags='<div class="cur"><a href="javascript:;">全部</a></div>';
                    if(data&&data.responseObject.responseData){
                        var data=data.responseObject.responseData;
                        if(t.activityType==1){//video
                            t.videoPro=data.list;
                        }else{//case
                            t.casePro=data.list;
                        }
                        if(data.list&&data.list.length>0){
                            for(var vt=0,vtl=data.list.length;vt<vtl;vt++){
                                var item=data.list[vt];
                                if(item.cms_activity_property.parentId===0){
                                    vPktags+='<div tagId="'+item.cms_activity_property.propertyId+'"><a href="javascript:;">'+item.cms_activity_property.propertyName +'</a></div>';
                                }
                            }
                        }
                        //$('.casePK_flobox').eq(1).empty();
                        $('.casePK_flobox').eq(1).html(vPktags);
                        t.tagClick();
                    }
                },
                error:function(){}
            });
        },
        getProperty:function(){
            var data=[];
            if(this.activityType==1){//video
                data=this.videoPro;
            }else{//case
                data=this.casePro;
            }
            var vPktags='<div class="cur"><a href="javascript:;">全部</a></div>';
            if(data&&data.length>0){
                for(var vt=0,vtl=data.length;vt<vtl;vt++){
                    var item=data[vt];
                    if(item.cms_activity_property.parentId===0){
                        vPktags+='<div tagId="'+item.cms_activity_property.propertyId+'"><a href="javascript:;">'+item.cms_activity_property.propertyName +'</a></div>';
                    }
                }
            }
            //$('.casePK_flobox').eq(1).empty();
            $('.casePK_flobox').eq(1).html(vPktags);
            this.tagClick();
        },
        //  下拉菜单绑定
        bindMenu: function () {
            var t = this;
            $('.casePK_snavList li').each(function (i,em) {
                $(em).on("vclick",function(){
                    //已展开选择
                    if ($(this).find("div").hasClass("cur")) {
                        t.clear();
                        $(".prod_list").attr("scrollpagination","enabled");
                        if($("#shareBox").attr("isProcess")){
                            $("#shareBox").show();
                        }else{
                            $("#signUpBox").attr("isLogin")?$("#signUpBox").show():$("#publishBox").show();
                        }
                    }else{  // 未展开
                        $('.casePK_snavList li div').removeClass("cur");
                        $(".casePK_flobox").hide();
                        $(this).find("div").addClass("cur");
                        $(".casePK_flo").show();
                        $(".casePK_flobox").eq(i).show();
                        $(".casePK_h5").hide();
                        $("#shareBox").hide();
                        $("#signUpBox").hide();
                        $("#publishBox").hide();
                        $(".prod_list").attr("scrollpagination","disabled");
                        if (document.documentElement.clientHeight < document.documentElement.offsetHeight-4){
                            //alert(123);
                        }else{
                            $(window).off("scroll swipe vmousemove");
                            $('.casePK_nav').css({
                                position:'static'
                            });
                            $('.casePK_down').css({
                                position:'static'
                            });
                            $(".casePK_h5").css({marginTop:"0px"});
                        }
                    }
                    return false;
                })

            });
        },
        goTop:function(){
            $('.casePK_down').css({
                position:'static'
            });
            $('.casePK_nav').css({
                position:'static'
            });
            $(".casePK_h5").css({marginTop:"0px"});
            document.documentElement.scrollTop=document.body.scrollTop=0;
        },
        //参赛类型点击
        typeClick:function(){
            var t=this;
            $(".casePK_flobox").eq(0).find("div").on("vclick",function(){
                if(!$(this).hasClass("cur")){
                    $(".casePK_flobox").eq(0).find("div").removeClass("cur");
                    $(this).addClass("cur");
                    t.goTop();
                    var n = $(this).index();
                    switch(n){
                        case 0:
                            t.mediaType = "case";
                            t.activityType=7;
                            t.iconName="eye";
                            $(".cpType_name").text("参赛病例作品");
                            break;
                        case 1:
                            t.mediaType ="video";
                            t.activityType=1;
                            t.iconName="play";
                            $(".cpType_name").text("参赛视频作品");
                            break;
                    }
                    t.propertyIds="";
                    $(".cpTag_name").text("全部");
                    if((t.activityType==1&&t.videoPro.length==0)||(t.activityType==7&&t.casePro.length==0)){
                        t.getTags();
                    }else{
                        t.getProperty();
                    }

                    t.query();
                    t.clear();
                    return false;
                }
            })
        },
        //专业点击
        tagClick:function(){
            var t=this;
            $(".casePK_flobox").eq(1).find("div").on("vclick",function(){
                if(!$(this).hasClass("cur")){
                    $(".casePK_flobox").eq(1).find("div").removeClass("cur");
                    $(this).addClass("cur");
                    $(".cpTag_name").text($(this).find("a").text());
                    t.goTop();
                    t.propertyIds=$(this).attr("tagid");
                    t.query();
                    t.clear();
                    return false;
                }
            })
        },
        //关闭回到初始
        clear:function(){
            $('.casePK_snavList li div').removeClass("cur");
            $(".casePK_flo").hide();
            $(".casePK_flobox").hide();
            $(".casePK_h5").show();
            $(".prod_list").attr("scrollpagination","enabled");
            $("#shareBox").show();
        },
        // 关闭按钮绑定
        bindCloseBtn: function () {
            var t=this;
            $(".casePK_close").on("vclick", function () {
                t.clear();
                t.navScroll();
                t.initMenuScroll();
                return false;
            });
        },
        // 排序绑定
        bindOrders: function () {
            var t = this;
            // 展开与隐藏
            $(".casePK_r").on("vclick",function(){
                if($(this).attr("on")=="true"){
                    $(this).attr("on","false");
                    $(".casePK_rList").hide();
                }else{
                    $(this).attr("on","true");
                    $(".casePK_rList").show();
                }
                return false;
            })

            // 点击排序绑定
            $(".casePK_rList li").on("vclick", function () {
                $(".casePK_rList li").removeClass("cur");
                $(this).addClass("cur");
                $(".casePK_r").attr("on","false");
                $(".casePK_rList").hide();
                var n = $(this).index();
                switch(n){
                    case 0:
                        t.order ="publishTime";
                        break;
                    case 1:
                        t.order="browse";
                        break;
                    case 2:
                        t.order = "preferUpNum";
                        break;
                };
                t.query();
                return false;
            });
        },
        createHtml: function (data) {
            var t = this;
            var html = "";
            $(data.rows.items).each(function (i, n) {
                var imgList;
                var imgUrl ="";
                var pageUrl = n.toUrl;
                var id= n.id;
                var refName = n.title.length > 23 ? n.title.substring(0, 23) + '...' : n.title;
                var refAuthor = n.author.length>3?n.author.substring(0,3)+'...':n.author;
                var company=$.isEmptyObject(n.company)?'':(n.company.length>8?n.company.substring(0,8)+'...':n.company);
                var time="";
                if(t.activityType==1){
                    time='<p>'+n.playTime+'</p>';
                    imgList=data.videoAttList?data.videoAttList:[];
                    $.each(imgList,function(j,val){
                        if(val.videoId==n.id){
                            imgUrl=val.videoAttUrl;
                            return;
                        }
                    })
                }else{
                    imgList=data.caseAttList?data.caseAttList:[];
                    $.each(imgList,function(j,val){
                        if(val.caseId==n.id){
                            imgUrl=val.caseAttUrl;
                            return;
                        }
                    })
                }

                var browseNum=n.browse;//资源浏览数
                var reviewNum=n.reviewNum;//评论数
                var upNum=n.upNum;//点赞数

                html += '<div class="list_con" resourceId="'+id+'" resourceName="'+n.title+'">'+
                '<div class="list_z">'+
                '<a href="javascript:;" target="_blank"><img src="'+(imgUrl?imgUrl:'/images/img50default_list_225_150.jpg')+'" alt="" width="100%;">'+
                time+
                ' </a>'+
                '</div>'+
                '<div class="list_y">'+
                '<a href="javascript:;" target="_blank">'+
                '<h5 class="bt">'+refName+'</h5>'+
                '</a>'+
                '<div class="casePK_info">'+
                '<div class="casePK_ac_'+t.className+'">'+refAuthor+'<span style="color: #969696;">'+company+'</span></div>'+
                '<ul>'+
                '<li class="casePK_'+t.iconName+'_'+t.className+'">'+browseNum.toWK()+'</li>'+
                '<li class="casePK_comment_'+t.className+'">'+reviewNum.toWK()+'</li>'+
                '<li class="casePK_support_'+t.className+'">'+upNum.toWK()+'</li>'+
                '<div class="clear"></div>'+
                '</ul>'+
                '</div>'+
                '</div>'+
                '</div>';
            });
            return html;
        },
        query: function () {
            var t = this;
            $.mobile.loading().show();
            var data = {pageIndex: 1, pageSize: 10};
            data.mediaType=t.mediaType;
            data.order=t.order;
            data.activityIds=t.activityId;
            if(t.propertyIds){
                data.propertyIds=t.propertyIds;
            }
            t.data = data;

            $.ajax({
                url: t.path.getList,
                data: {paramJson:$.toJSON(data)},
                type: "post",
                dataType: "json",
                success: function (data) {
                    $.mobile.loading().hide();
                    $(".prod_list").html("");
                    scrollpage = 2;
                    if (data && data.dataJson && data.dataJson.rows) {
                        var result = data.dataJson;
                        $(".list_num").text(data.dataJson.rows.total);
                        if (data.dataJson.rows.items.length>0) {
                            t.emptyResult=false;
                            var html = t.createHtml(result);
                            $(".prod_list").html(html).show();

                            //瀑布流
                            (function () {
                                $(".prod_list").scrollPagination({
                                    'contentPage': t.path.getList,
                                    'noParamJson': 0,
                                    'contentData': $.extend(t.data, {
                                        pageIndex: function () {
                                            return scrollpage++
                                        }
                                    }),
                                    'scrollTarget': $(window),
                                    'heightOffset': 0,
                                    'delaytime': 1000,
                                    type: "post",
                                    'beforeLoad': function () {
                                        $.mobile.loading().show();
                                    },
                                    'afterLoad': function (elementsLoaded) {
                                        $.mobile.loading().hide();
                                    },
                                    'loader': function (data) {
                                        if(t.emptyResult){
                                            return false;
                                        }
                                        if (data && data.dataJson && data.dataJson.rows && data.dataJson.rows.items.length>0) {
                                            var result = data.dataJson;
                                            var html = t.createHtml(result);
                                            $(".prod_list").append(html).show();
                                        } else {
                                            $(".prod_list").attr('scrollPagination', 'disabled');
                                            //alert("没有内容了");
                                            return false;
                                        }
                                    }
                                });
                            })();
                        } else {
                            t.emptyResult = true;
                            $(".noResult").show();
                            $(".prod_list").attr('scrollPagination', 'disabled').hide();
                            return false;
                        }


                    } else {
                        $(".noResult").show();
                        $(".prod_list").attr('scrollPagination', 'disabled').hide();
                        return false;
                    }
                },
                error: function () {
                    $(".none").show();
                    $(".prod_list").attr('scrollPagination', 'disabled');
                    //alert("没有内容了");
                    return false;
                }
            });

            $.mobile.loading("hide");


        }
    };
    PKWork.init();
})
