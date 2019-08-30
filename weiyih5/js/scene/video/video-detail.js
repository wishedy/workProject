var v_width, v_height;

function resetUserHead() {
    $(".user-img .head img").each(function () {
        $(this).css("height", $(this).width());
    });
}
$(function () {
    toggleToPC();
    var wx = comm.getpara() && comm.getpara().sukey;
    if (wx != null && wx != "") {
      g_sps.jump(null,window.location.pathname);
    }

    $("#header .logo").after("<div class='video-title line'>全部视频<div class='right-a'></div></div>");
    $("#header .video-title").on("click", function () {
      g_sps.jump(null,'/pages/video/video_list.html');
    });
    // viewVideo();
});

// 设置视频播放器
function setVideoPlayer() {
    $("#MediaMask").append("<script type='text/javascript' src='/js/third-party/ckplayer66/ckplayer/ckplayer.js' charset='utf-8'></script><script src='/js/scene/video/videoControls.js' type='text/javascript'></script>");

    var domain = "//v.allinmd.cn/";

    var videoMp4Src = $("#videoMp4Src").val();

    var playPic = $("#playPic").val();

    var flashvars = {
        f: videoMp4Src,
        c: 0,
        p: 0,
        i: playPic
    };
    var params = {bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always'};
    //CKobject.embedSWF('/js/ckplayer66/ckplayer/ckplayer.swf', 'a1', 'CKa1', v_width, v_height, flashvars, params);
    var video = [flashvars.f];
    var support=['all'];
    CKobject.embedHTML5('video', 'CKa1', v_width, v_height, video, flashvars, support);
    bindMediaEnd();
}

// 视频播放结束后
function bindMediaEnd() {
    $("#CKa1").on("ended", function () {
        //$("#MeadiaCon").hide();
        //$("#recommendPic").show();
        if($(".js-seriesVideo .video_series_list li").length>0){
            var locationHref=$(".highLight").next().find(".text").attr("href");
            if(locationHref==undefined||locationHref==null){
                CKobject.getObjectById('CKa1').videoPause();
            }else{
              g_sps.jump(null,locationHref);
            }
        }else{
            CKobject.getObjectById('CKa1').videoPause();
        }
    });
}

function updateViewdNum() {
    commdata.asyncExecute("updateVideoNum", {
        "propertyKey": "playNum",
        "type": "plus",
        "videoId": $("#resourceId").val()
    });
}

$("#detail").live("pageinit", function () {

    resetUserHead();
    // 简介的展开与收起
    var videoDesc = $("#videoAbstract").attr("videoAbstract");
    if (videoDesc) {

    }
    updateViewdNum();
    // 减短作者的长度
    $(".user-name-wrap .user-name a").text($.trim($(".user-name-wrap .user-name a").text()).cutString(20));
    var video = {
        videoId: "",
        videoData: {},
        init: function () {
            var t = this;
            if (comm.getpara()) {
                if (comm.getpara().videoId != undefined) {
                    t.videoId = comm.getpara().videoId;
                } else {
                    t.videoId = $("#resourceId").val();
                }
            } else {// 无参数的话， 通过页面中隐藏元素获取参数
                t.videoId = $("#resourceId").val();            // "1402881975175"
            }
            if (t.videoId == "" || t.videoId == undefined) {   //
                alert("参数不正确");
            }

            t.initVideoData(); // 两种方式都需要初始化
            //判断是否是pK活动作品
            var shareTitle = ($('.video-content h5')[0].innerText).replace(/[\n|\s]/g,"");
            var videoAuthor = ($('#resourceId').attr('videoAuthor')).replace(/[\n|\s]/g,"");
            var imgUrl='/image/allin_logo.png';
            var shareImgUrl = $(".user-info-open :eq(0)").attr("src");//作者头像
            var refCustomerId = $('#authCustomerId').length>0?$('#authCustomerId').val():"";
            if(shareImgUrl&&shareImgUrl!='undefined'&&shareImgUrl!=""){
                imgUrl=shareImgUrl;
            }
            if($('#resourceId').attr('activityId')==1449026372937){//1449026372937是视频病例PK活动ID
                wechat_share_pk({
                    title:"参赛视频《"+shareTitle+"》",
                    desc:videoAuthor+'参加了“骨科示教病例及手术视频评选活动”， 快点赞支持他！点击进入作品',
                    timeLineTitle:"参赛视频《"+shareTitle+"》，欢迎讨论！",
                    imgUrl:imgUrl,
                    fnMessageSuc:function(){
                        comm.shareLog({
                            shareType: 1,
                            resourceId:t.videoId ,
                            resourceType: 1,
                            refId:t.videoId,
                            isValid: 1,
                            shareSence:4,
                            shareChannel:4,
                            shareContent:"参赛视频《" + shareTitle + "》",
                            refCustomerId:refCustomerId
                        });
                    },
                    fnTimelineSuc:function(){
                        comm.shareLog({
                            shareType:1,
                            resourceId:t.videoId ,
                            resourceType: 1,
                            refId:t.videoId,
                            isValid: 1,
                            shareSence:4,
                            shareChannel:5,
                            shareContent:"参赛视频《" + shareTitle + "》",
                            refCustomerId:refCustomerId
                        });
                    }
                });
            }else{
                initShareWeixin();
            }
            $("#MeadiaCon,#MediaMask,#MeadiaCon img").css("height", $(".content-page").width() * 0.5625);
            $("#MeadiaCon,#MediaMask,#Media").css("top", $("#videoPageTitle").height());
            t.bindOrientationChangeEvent();
            t.initCheckAuth();
            comm.bindNav(2, false,false);
          var amChannel = comm.getpara()._amChannel;
	        var callAppOptions ={
		        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + $("#resourceId").val() + "&tplPath=1&share=app&visitSiteId=5"+(amChannel?"&_amChannel="+amChannel:''),
		        android: "allin://com.allin.social:75235?data={scene:3,type:1,sourceId:"+  $("#resourceId").val()  +",tplPath:1"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
		        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=1&sourceId=" + $("#resourceId").val() + "&tplPath=1&share=app&visitSiteId=5"+(amChannel?"&_amChannel="+amChannel:''),
		        runAtOnce: false
	        }
	        //comm.bindCallApp(callAppOptions);
            if(!TempCache.getItem("detailNoNeedApp")){
                if (comm.getparaNew() && comm.getparaNew().share && (comm.getparaNew().share.toLowerCase() == "app")){//app分享的链接

                }else {
                    comm.appWakeUp("confirm", callAppOptions);//唤醒app弹层
                }
            }
            TempCache.removeItem("detailNoNeedApp");
	        comm.recognizeAppShareLink(callAppOptions);

            comm.showAppDownload("video");
            t.loadSeriesVideo();
            t.loadRecommendVideo();
            t.initVideoInfo();
        },
        bindScrollBox: function () {
            // 推荐视频的滑动
            $(".Ev-btnVMouse").on("vmousedown", function (e) {
                e.preventDefault();
                var startMX, startLeft;
                var scrollBoxParent = $(this).parent().get(0);
                startMX = e.pageX;

                startLeft = scrollBoxParent.scrollLeft;
                $(this).on("vmousemove", function (e) {
                    e.preventDefault();
                    var newMX = e.pageX,
                        mx = newMX - startMX,
                        nowX = startLeft - mx;
                    if (nowX < ($(this).find(".Ev-btnVMouse1").get(0).offsetWidth - $(this).parent().width())) {
                        scrollBoxParent.scrollLeft = nowX;
                    }
                });
            });
            $(".Ev-btnVMouse").on("vmouseup", function () {
                $(".Ev-btnVMouse").off("vmousemove touchmove");
            });

            $(".Ev-btnVMouse1 li a").on("vclick",function(e){
                var href=$(this).attr("href");
                g_sps.jump(null,href);
            });

            $(".slider-ctl-box .right").on("vclick", function () {
                var o = $(".scroll-wrap").eq(1).find(".scroll-box1 li").eq(0);
                var liW = o.width() + parseInt(o.css("marginRight"));
                var w = $(".scroll-wrap").eq(1).find(".scroll-box1").width();
                var sW = $(".scroll-wrap").eq(1).width();
                var oL = $(".scroll-wrap").get(1).scrollLeft;
                if ((w - oL) > sW) {
                    if ((w - oL) > 2 * liW) {
                        $(".scroll-wrap").eq(1).animate({"scrollLeft": $(".scroll-wrap").get(1).scrollLeft + liW * 2});
                    } else {
                        $(".scroll-wrap").eq(1).animate({"scrollLeft": w - sW});
                    }
                } else {
                    $(".scroll-wrap").eq(1).animate({"scrollLeft": w - sW});
                }
            });
            $(".slider-ctl-box .left").on("vclick", function () {
                var o = $(".scroll-wrap").eq(1).find(".scroll-box1 li").eq(0);
                var liW = o.width() + parseInt(o.css("marginRight"));
                var w = $(".scroll-wrap").eq(1).find(".scroll-box1").width();
                var sW = $(".scroll-wrap").eq(1).width();
                var oL = $(".scroll-wrap").get(1).scrollLeft;
                if (oL > sW) {
                    if (oL > 2 * liW) {
                        $(".scroll-wrap").eq(1).animate({"scrollLeft": $(".scroll-wrap").get(1).scrollLeft - liW * 2});
                    } else {
                        $(".scroll-wrap").eq(1).animate({"scrollLeft": 0});
                    }
                } else {
                    $(".scroll-wrap").eq(1).animate({"scrollLeft": 0});
                }
            });
        },
        initVideoInfo: function () {
            $(".user-info-close > span,.user-info-close .arrow-down").on("vclick", function () {
                $(".user-info-close").hide();
                $(this).parent().parent().find(".arrow").removeClass("down");
                $(".user-info-open").show();
                return false;
            });

            $(".user-info-open > span,.user-info-open .arrow").on("vclick", function () {
                $(".user-info-open,.v3-video-tags-box").hide();
                $(this).parent().parent().find(".arrow").addClass("down");
                $(".user-info-close,.v3-video-tags-box").show();
                return false;
            });
        },
        initCheckAuth: function () {
            v_width = $(".content-page").width();
            v_height = v_width * 0.5625;
            var refresh = comm.getpara() && comm.getpara().refresh;

            if (refresh != undefined && refresh == "refresh") {
                if (!user.getLoginStatus() || !user.getRenZhengStatus() || !user.getWanShanStatus()) {    // 跳转过来的显示提示    未登录 或 未认证 则不显示视频
                    $(".mm-bg,.mm-play").hide();
                    $(".vedio_content").show();
                    var html;
                    if (!user.getLoginStatus()) { //未登录
                        $(".mm-bg,.mm-play").hide();
                        html = "<img id=\"goLogin\" src=\"\/images\/img50\/video_detail\/notlogin2.png\" style=\"width:" + v_width + "px;height:" + v_height + "px;\"/>";
                    } else {                         //已登录
                        if (user.getRenZhengStatus()) {       // 已认证
                            if (!user.getWanShanStatus()) {    // 未完善
                                html = "<img id=\"goLogin\" src=\"\/images\/img50\/video_detail\/notwanshan.png\" style=\"width:" + v_width + "px;height:" + v_height + "px;\">";
                            } else {              // 已完善

                            }
                        } else {   // 未认证
                            html = "<img id=\"goLogin\" src=\"\/images\/img50\/video_detail\/notrenzheng.png\" style=\"width:" + v_width + "px;height:" + v_height + "px;\">";
                        }
                    }
                    $("#video").append("<div id='videoDisable' style='position:absolute;z-index: 9;width:" + v_width + "px;height:" + v_height + "px;'></div>");
                    $("#video>video").hide();
                    $("#videoDisable").html(html);
                    $("#goLogin").on("vclick", function () {
                        user.needRenZhengHandler();
                    });
                } else {
                    $(".mm-bg,.mm-play").hide();
                    $(".vedio_content").show();
                    setVideoPlayer();
                }
            } else {                                  // 开始试播
                setVideoPlayer();
            }
        },
        initVideoData: function () {
            var t = this;
            t.videoData = commdata.getResponseData("getVideoByVideoId", {videoId: t.videoId});
            t.videoData = t.videoData.data_list[0];
            $(".video-info-list:eq(1) dd:eq(3)").html(t.videoData.cms_video.playNum);
            resourceDesc = t.videoData.cms_video.videoAbstract;
            var activityId = t.videoData.cms_video.activityId;
            var videoAuthor = t.videoData.cms_video.videoAuthor;
            $(".praiseNum").text(t.videoData.cms_video.preferUpNum);
            //给resourceId属性赋activityId值
            $('#resourceId').attr({
                "activityId":activityId,
                "videoAuthor":videoAuthor
            });
        },
        //获取头像
        loadCustomerLogoUrl: function (personal_customerId) {
            var logoUrl = "/images/img50/index/person.jpg";
            if (personal_customerId != "") {
                data = commdata.getData("getDataLogoUrl", {refId: personal_customerId, logoSpec: 1, logoType: 4});
                if (data && data.logoUrl) {
                    if (data.logoUrl.indexOf("http") > -1) {
                        logoUrl = data.logoUrl;//头像地址
                    } else {
                        logoUrl = weburl_img00 + data.logoUrl;//头像地址
                    }
                }
            }
            return logoUrl;
        },
        bindOrientationChangeEvent: function () {
            var t = this;

	        $('body').on('orientationchange', function (event) {
		        //t.resetVideo();   by liuyutao 函数丢失，所以注掉
	        });

	        $('body').on('resize', function (event) {
		        //t.resetVideo();
	        });
        },
        loadSeriesVideo:function(){
            var t=this;
            var t = this;
            var seriesBox = $(".js-seriesVideo");
            $.ajax({
                url: "/mcall/cms/video/albumListInTag/",
                type: "GET",
                dataType: "json",
                data: {
                    refId: t.videoId,
                    refType:1//视频
                },
                success: function (data) {
                    if (data && data.rows && data.rows!== undefined && data.rows.length > 0) {
                        var list = data.rows;
                        seriesBox.show();
                        var box1 = $(".video_series_list", seriesBox).empty();
                        var html = "";
                        var obj, videoName,refId;
                        for (var i = 0; i < list.length; i++) {
                            obj = list[i];
                            videoName = obj.refName;
                            refId=obj.refId;
                            if(comm.getLength(videoName)>48){
                                videoName=comm.cutstr(videoName,36)+'……'+comm.revCutstr(videoName,10);
                            }
                            html += ' <li data='+refId+'>' +
                                '        <a class="text" href="'+ obj.refUrl +'" data-ajax=false data-role=none>' +
                                videoName +
                                '        </a>' +
                                '    </li>';
                        }
                        box1.html(html);
                        $.each($(".video_series_list li",seriesBox),function(i,e){
                            if($("#resourceId").val()== $(e).attr("data")){
                                $(e).addClass("highLight");
                            }
                        });
                        $(".highLight").css("border","solid 1px #4ba1dc");
                        var highLightPrevLi=$(".highLight").prevAll().length;//当前播放之前的li有多少个
                        var highLightNextLi=$(".highLight").nextAll().length;//当前播放之后的li有多少个
                        var scrollDistance=parseInt($(".highLight a").outerWidth(true))+parseInt($(".highLight a").css("margin-right"));
                        var margin=parseInt($(".slider-ctl-box").eq(0).css("margin-right"));
                        var scrollDistanceNum=parseInt(($(window).width()-scrollDistance)/2);
                        if(highLightPrevLi==0){
                            $(".scroll-wrap",seriesBox).animate({scrollLeft:0+'px'});
                        }else{
                            if(highLightNextLi==0){
                                $(".scroll-wrap",seriesBox).animate({scrollLeft:highLightPrevLi*scrollDistance-scrollDistanceNum*2+margin+'px'},0) ;
                            }else{
                                $(".scroll-wrap",seriesBox).animate({scrollLeft:highLightPrevLi*scrollDistance-scrollDistanceNum+margin+'px'},0) ;
                            }

                        }

                        t.bindScrollBox();   // 绑定滑动
                    }
                }
            })
        },
        loadRecommendVideo: function () {
            var t = this;
            var recommendBox = $(".js-recommendVideo");
            $.ajax({
                url: "/mcall/cms/video/listInTag/",
                type: "GET",
                dataType: "json",
                data: {
                    refId: t.videoId
                },
                success: function (data) {
                    if (data && data.rows && data.rows[0].refVideoItems !== undefined && data.rows[0].refVideoItems.length > 0) {
                        var list = data.rows[0].refVideoItems;
                        recommendBox.show();
                        var box1 = $(".scroll-box1", recommendBox).empty();
                        var html = "";
                        var obj, videoName;
                        for (var i = 0; i < list.length; i++) {
                            obj = list[i];
                            videoName = comm.cutstr(obj.recommendVideoName, 28);
                            html += ' <li>' +
                                '        <div class="img-box">' +
                                '            <a class="img" href="'+ obj.webStoragePath +'" data-ajax=false data-role=none>' +
                                '               <img  src="' +  obj.recommendVideoLogo + '" alt=""/>' +
                                '            </a>' +
                                '            <div class="video-time-bg"></div>' +
                                '            <div class="video-time-text">' + obj.playTime + '</div>' +
                                '        </div>' +
                                '        <a class="text" href="'+ obj.webStoragePath +'" data-ajax=false data-role=none>' +
                                videoName +
                                '        </a>' +
                                '    </li>';
                        }
                        box1.html(html);
                        t.bindScrollBox();   // 绑定滑动
                    } else {
                        recommendBox.hide();
                    }
                }
            })
        }

    };
    video.init();
    //草稿提示
    var resourceId=$("#resourceId").val();//资源id
    comm.draftRemind({
        url:"/mcall/customer/draft/reviewOperate/",
        data:{refId:resourceId,reviewType:1,operateType:1},//reviewType 4:话题 7:病例;
        type:2, //1:频道页 2:详情页
        resourceId:resourceId,
        resourceType:1,//resourceType 1-视频，2-文库，4-话题 ,7-病例
        data2:{refId:resourceId,reviewType:1,operateType:2}//operateType 1:说明执行的是判断是否加载提示操作 2:关闭提示
    });
    //window.onload = Log.createBrowse(4, "视频终端页面"); //	浏览日志
});

/*
 * PK活动微信分享，判断是否是活动作品
 */

function wechat_share_pk(obj){
    var data=WeixinJSApi.getWxJSConfig();
    var controller={
        init:function(){
            var t=this;
            t.options={};
            var shareData = {
                title: document.title,
                desc: "",
                link: window.location.href,
                imgUrl: '//img00.allinmd.cn/common/header/logo.png',
                timeLineTitle:"",			//朋友圈标题，没有使用默认title
                fnSuc:function(){
                    if($('.dk-result-pointer').length){
                        $('.dk-result-pointer,.dk-result-pointer-bg').remove();
                    }
                },
                fnCancel:function(){
                    if($('.dk-result-pointer').length){
                        $('.dk-result-pointer,.dk-result-pointer-bg').remove();
                    }
                },
                fnMessageSuc: function () {

                },
                fnTimelineSuc: function () {

                }
            };
            t.options=$.extend(shareData,obj);
            t.getWxConfig();
        },
        getWxConfig:function(){
            var t=this;
            wx.config({
                debug: false,
                appId:"wx8d4a2df6fdc13658",
                timestamp: data.timestamp,
                nonceStr: data.noncestr,
                signature: data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            setTimeout(function(){
                t.shareContent();
            },500)
        },
        shareContent:function(){
            var t = this;
            wx.ready(function(){
                wx.onMenuShareAppMessage({
                    title:t.options.title,
                    desc:t.options.desc,
                    link:t.options.link,
                    imgUrl:'https:'+t.options.imgUrl,
                    success:function(){
                        if(t.options.fnSuc){
                            t.options.fnSuc();
                        }
                        if(t.options.fnMessageSuc){
                            t.options.fnMessageSuc();
                        }
                    },
                    cancel:function(){
                        if(t.options.fnCancel){
                            t.options.fnCancel();
                        }
                    }
                });
                wx.onMenuShareTimeline({
                    title:t.options.timeLineTitle===""?t.options.title:t.options.timeLineTitle,
                    desc:t.options.desc,
                    link:t.options.link,
                    imgUrl:'https:'+t.options.imgUrl,
                    success:function(){
                        if(t.options.fnSuc){
                            t.options.fnSuc();
                        }
                        if(t.options.fnTimelineSuc){
                            t.options.fnTimelineSuc();
                        }
                    },
                    cancel:function(){
                        if(t.options.fnCancel){
                            t.options.fnCancel();
                        }
                    }
                });
            })
        }
    };
    controller.init(obj);
}
/**
 * 微信分享---2016/4/14新加分享话术，名字：《title》-—唯医视频
 */
var resourceDesc = "";

function initShareWeixin() {
    var weiXinTitle = "";
    var weiXinDesc = "";
    var weiXinLogo = "//m.allinmd.cn/image/allin_logo.png";
    var resourceId = $('#resourceId').val();
    var refCustomerId =$('#authCustomerId').length>0?$('#authCustomerId').val():"";
    WeixinJSApi.title = function () {
        var resourceTitle = $(".video-content").find("h5").text().trim();
        var nameCard = $('.video-info-list a').eq(0).text().trim();//作者名称
            nameCard = ((nameCard =='唯医小编'||nameCard=="")?"":nameCard+":");//作者名称为唯医小编时为空
        var videoType, videoTypeNum =$('#videoType').length?$('#videoType').val():"";
            switch(videoTypeNum){
                case '1':
                    videoType ='手术';
                    break;
                case '2':
                    videoType ='课程';
                    break;
                case '3':
                    videoType ='会议';
                    break;
                case '4':
                    videoType ='专家访谈';
                    break;
                default:
                    videoType='';
            }
        if (comm.getLength(resourceTitle) > 30) {
            resourceTitle = comm.cutstr(resourceTitle, 30) + "..."
        }
        if (resourceTitle && resourceTitle != "")
            weiXinTitle = nameCard+"《"+resourceTitle+"》 —唯医"+videoType+"视频, allinmd";
        return weiXinTitle;
    };
    WeixinJSApi.desc = function () {
        if (comm.getLength(resourceDesc) > 55) {
            resourceDesc = comm.cutstr(resourceDesc, 52) + "..."
        }
        if (resourceDesc && resourceDesc != "")
            weiXinDesc = resourceDesc;
        return weiXinDesc;
    };
    WeixinJSApi.imgUrl = function () {
        weiXinLogo = $('#shareImgSrc').val();
        return weiXinLogo;
    };
    WeixinJSApi.appSuc = function(){
        comm.shareLog({
            shareType: 1,
            resourceId:resourceId ,
            resourceType: 1,
            refId: resourceId,
            isValid: 1,
            shareSence:4,
            shareChannel:4,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    };
    WeixinJSApi.timeLineSuc = function(){
        comm.shareLog({
            shareType: 1,
            resourceId:resourceId ,
            resourceType: 1,
            refId: resourceId,
            isValid: 1,
            shareSence:4,
            shareChannel:5,
            shareContent:weiXinTitle,
            refCustomerId:refCustomerId
        });
    }
}