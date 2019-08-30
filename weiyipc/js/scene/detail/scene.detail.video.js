/**
 * 功能描述：视频终端页的操作3.0
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2016/08/27.
 */
function checkClientSpeedLow(callback) {
    //以小于 200kb/s 来判断是否为弱网环境，可根据实际情况更改
    var SPEED_LOW_VALUE = 200;
    //测试图片大小为 58.6 kb
    var SPEED_FILE_SIZE = 58.6;
    //被检测图片地址
    var SPEED_IMG_URL = '//img10.allinmd.cn/v3/single/spread_item2_img.png?' + Date.now();
    var element = document.createElement('img');
    element.setAttribute('src', SPEED_IMG_URL);
    element.setAttribute('style', 'display:none');
    document.body.appendChild(element);
    var speed_time1 = Date.now();
    $(element).on('load', function (evt) {
        var speed_time2 = Date.now();
        var speed = Math.round(SPEED_FILE_SIZE * 1000) / (speed_time2 - speed_time1);
        if (speed < SPEED_LOW_VALUE) {
            return callback(true);
        }
        return callback(false);
    });
}
function videoScore(vsv){
    $.ajax({//评分接口请求
        url: PC_CALL + "customer/resource/score/getResourceComprehensiveScore/",
        type: "POST",
        dataType: "json",
        data: {
            paramJson: $.toJSON({
                "isValid":"1",
                "visitSiteId":"1",
                "myScoreCustomerId":$("#sesCustomerId").val(),
                "scoreType":$("#resourceType").val(),
                "sortType":"2",
                "refId":$("#resourceId").val(),
                "firstResult":"0",
                "maxResult":"999999"
            })
        },
        success: function (data) {
            if (data && data.responseObject && data.responseObject.responseData) {
                var items = data.responseObject.responseData,
                    iScoring = items.myScoreState//是否评过分
                //是否评过分
                if(iScoring == 0){
                    $(".al-myScorePart figure span").text("我要评分");
                    $(".al-myScorePart ul").addClass("ev-scoring");
                    $(".al-myScorePart").addClass("al-noScore al-demandScorePart").removeClass("al-yesScore");
                }else if(iScoring == 1){
                    $(".al-myScorePart figure span").text("我的评分");
                    $(".al-myScorePart").addClass("al-yesScore").removeClass("al-noScore al-demandScorePart");
                    $(".al-videoScoreMask").remove();
                    scoringCount(items.score,$(".al-yesScore"));
                }
                vsv.vScoreBack(iScoring);
            }
        }
    });
}
$(function(){
    //针对视频
    var html = "";
    var authDataObject;
    var unite;
    var actionId;
    var loginState = false;//标识登录状态的变量
    var authState = false;//标识认证状态的变量
    var limitTime=29;
    var videoNodeJson = [];
    var controller={
        config:{},
        path:{
            selectionsVideoUrl:PC_CALL + "customer/video/getSelectionByVideo/",//选集视频列表
            seriesVideoUrl:PC_CALL + "video/albumListInTag/",//系列视频列表
            reEBookUrl:PC_CALL+"book/catalogue/getMapCatalogueVideoList/",//电子书系列视频
            createRecord:PC_CALL+"customer/videoPlay/create/",//创建保存更新用户播放时间
            getRecord:PC_CALL+"customer/videoPlay/getById/"//获取用户播放时间
        },
        init:function(){
            var t=this;
            //console.log($("#videoType").val());
            if($("#videoType").val()!=19){

                t.seriesVideo_content();
            }
            $(".Ev-videoAbs").expandShrink({len:234});
            t.downloadApp();
        },
        //电子书系列视频
        eBookSeriesVideo:function(){
            var t=this;
            var refId = $("#resourceId").val();
            var refTy = parseInt($("#resourceType").val());
            var videoType = parseInt($("#videoType").val());
            $.ajax({
                url:  t.path.reEBookUrl,
                type: "post",
                dataType: "json",
                data: {paramJson: $.toJSON({
                        videoId:refId,
                        catalogueId:parseInt($("#catalogueParentId").val()),
                        scene:10,
                        visitSiteId:1

                    })},
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                        var items = data.responseObject.responseData.data_list;
                        $(".Ev-seriesVideoBox").show();
                        var html = "";
                        var videoName, nowRefId;
                        $.each(items, function (i, e) {
                            videoName=e.videoName;
                            nowRefId = e.videoId;
                            if (comm.getByteLen(videoName) > 48) {
                                videoName = comm.getStrLen(videoName, 36) + comm.revCutstr(videoName, 10);
                            }
                            html += '<section class="al-video_container Ev-videoTipBox" data-reId="' + nowRefId + '">' +
                                '<a target="_blank" href="' + e.pageStoragePath + '" class="Ev-padRight">' +
                                '<img class="videoImg" src="'+e.picUrl+'"/>' +
                                '<b class="videoPlayBtn"></b>' +
                                '<span>' + e.playTime + '</span>' +
                                '</a>' +
                                '<a class="videoText">' +
                                '<p>' + videoName + '</p>' +
                                '</a>' +
                                '</section>';
                        });

                        var html2=html+'<section class="al-video_container"><a href="/pages/eBook/eBook_chapter.html?articleBook='+parseInt($("#bookId").val())+
                            '&articleCatalogue='+parseInt($("#catalogueParentId").val())+'&catalogueName='+ $("#catalogueName").val()+'&catalogueNum='+ $("#catalogueSortId").val()+'&articleId='+parseInt($("#bookId").val())
                            +'#2" class="al-AllVideoBtn Ev-AllVideoBtn">全部</a></section>';

                        var appVideo=$(".Ev-seriesVideoListApp");
                        appVideo.html(html2);
                        t.highlightShow();
                        $(".Ev-leftMove").css("cursor","default");
                        var vTipW=parseInt($(".Ev-videoTipBox").outerWidth(true)),
                            itemsL= items.length+1,
                            appVideoW=vTipW*itemsL;//列表的外层宽度
                        appVideo.width(appVideoW);
                        t.seriesVideo_move(vTipW,itemsL);
                    }
                }
            });
        },
        //系列视频内容
        seriesVideo_content:function(){
            var t=this;
            var refId = $("#resourceId").val();
            var refTy = parseInt($("#resourceType").val());
            var videoType = parseInt($("#videoType").val());
            setTimeout(function(){
                var collegeCourseState = (!isNaN(parseInt($(".al-mainContent").attr('data-collegeCourseState'),10)));
                //console.log(collegeCourseState);
                if(collegeCourseState){//请求选集接口
                    $(".Ev-seriesVideoBox").find("figcaption").eq(0).text("选集");
                    $.ajax({
                        url: t.path.selectionsVideoUrl,
                        type: "get",
                        data: {
                            paramJson:$.toJSON(
                                {
                                    customerId:$('#sesCustomerId').val()!=""&&$('#sesCustomerId').val()!=undefined?$('#sesCustomerId').val():"",
                                    videoId: refId,
                                    visiteSiteId:1//视频
                                }
                            )
                        },
                        dataType: "json",
                        success: function (data) {
                            if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length){
                                var items=data.responseObject.responseData.dataList;
                                t.selectionsVideo_list(items);
                            }
                        }
                    });
                }else{
                    //保持原有逻辑不变
                    $.ajax({
                        url: t.path.seriesVideoUrl,
                        type: "get",
                        data: {
                            refId: refId,
                            refType:1//视频
                        },
                        dataType: "json",
                        success: function (data) {
                            if(data&&data.rows[0].refVideoItems) {//系列视频有数据
                                var items=data.rows[0].refVideoItems;
                                t.seriesVideo_list(items);
                            }
                        }
                    });
                }
            },1000);


        },//选集视频列表，实现上与系列视频列表一样
        selectionsVideo_list:function(items){
            var t = this;
            var html = "",appVideo=$(".Ev-seriesVideoListApp");
            $.each(items,function(i,e){
                html+= t.selectionsVideo_template(e);
            });
            appVideo.html(html);
            $(".Ev-seriesVideoBox").show();
            t.highlightShow();
            $(".Ev-leftMove").css("cursor","default");
            var vTipW=parseInt($(".Ev-videoTipBox").outerWidth(true)),
                itemsL= items.length,
                appVideoW=vTipW*itemsL;//列表的外层宽度
            appVideo.width(appVideoW);
            $(".Ev-seriesVideoListApp .Ev-padRight").off("mousedown").on("mousedown",function(){
                var t = $(this);
                var refId = t.parents('.al-video_container.Ev-videoTipBox').attr("data-reid");
                if(localStorage.getItem('videoTerminalEnd'+refId)){
                    localStorage.removeItem('videoTerminalEnd'+refId);
                    localStorage.removeItem('videoTerminal'+refId);
                    localStorage.setItem('noNeedSetTime'+refId,1);
                }

            });
            //console.log(vTipW,itemsL);
            t.seriesVideo_move(vTipW,itemsL);
        },
        //系列视频列表
        seriesVideo_list:function(items){
            var t=this;
            var html = "",appVideo=$(".Ev-seriesVideoListApp");
            $.each(items,function(i,e){
                html+= t.seriesVideo_template(e);
            });
            appVideo.html(html);
            $(".Ev-seriesVideoBox").show();
            t.highlightShow();
            $(".Ev-leftMove").css("cursor","default");
            var vTipW=parseInt($(".Ev-videoTipBox").outerWidth(true)),
                itemsL= items.length,
                appVideoW=vTipW*itemsL;//列表的外层宽度
            appVideo.width(appVideoW);
            $(".Ev-seriesVideoListApp .Ev-padRight").off("mousedown").on("mousedown",function(){
                var t = $(this);
                var refId = t.parents('.al-video_container.Ev-videoTipBox').attr("data-reid");
                if(localStorage.getItem('videoTerminalEnd'+refId)){
                    localStorage.removeItem('videoTerminalEnd'+refId);
                    localStorage.removeItem('videoTerminal'+refId);
                    localStorage.setItem('noNeedSetTime'+refId,1);
                }

            });
            t.seriesVideo_move(vTipW,itemsL);
        },
        selectionsVideo_template:function(kv){
            var recommendVideoName=kv.videoName;
            var recommendVideoId=kv.videoId;
            /*           if(comm.getByteLen(recommendVideoName)>42){
             recommendVideoName=comm.getStrLen(recommendVideoName,42);
             }*/
            if (comm.getByteLen(recommendVideoName) > 48) {
                recommendVideoName = comm.getStrLen(recommendVideoName, 36) + comm.revCutstr(recommendVideoName, 10);
            }
            var payType = '';
            if(parseInt(kv.payType,10)===1){
                payType+='<em class="payType">免费</em>';
            }
            var pageStoragePath = 'javascript:void(0);';
            if(!comm.checkInvalid(kv.pageStoragePath)){
                pageStoragePath = kv.pageStoragePath;
            }
            return '<section class="al-video_container Ev-videoTipBox" data-reId="'+recommendVideoId+'">'+
                '<a target="_blank" href="'+pageStoragePath+'" class="Ev-padRight">'+
                '<img class="videoImg" src="'+ kv.attUrl +'"/>'+
                '<b class="videoPlayBtn"></b>'+
                '<span>'+kv.playTime+'</span>'+
                payType+
                '</a>'+
                '<a class="videoText">'+
                '<p>'+ recommendVideoName+'</p>'+
                '</a>'+
                '</section>';
        },
        //系列视频的html
        seriesVideo_template:function(kv){
            var recommendVideoName=kv.recommendVideoName;
            var recommendVideoId=kv.recommendVideoId;
            /*           if(comm.getByteLen(recommendVideoName)>42){
             recommendVideoName=comm.getStrLen(recommendVideoName,42);
             }*/
            if (comm.getByteLen(recommendVideoName) > 48) {
                recommendVideoName = comm.getStrLen(recommendVideoName, 36) + comm.revCutstr(recommendVideoName, 10);
            }
            return '<section class="al-video_container Ev-videoTipBox" data-reId="'+recommendVideoId+'">'+
                '<a target="_blank" href="'+ kv.pageStoragePath +'" class="Ev-padRight">'+
                '<img class="videoImg" src="'+ kv.recommendVideoLogo2 +'"/>'+
                '<b class="videoPlayBtn"></b>'+
                '<span>'+kv.playTime+'</span>'+
                '</a>'+
                '<a class="videoText">'+
                '<p>'+ recommendVideoName+'</p>'+
                '</a>'+
                '</section>';
        },
        //当前播放高亮显示
        highlightShow:function(){
            var t=this,
                _vB=$(".Ev-videoTipBox"),
                refId = $("#resourceId").val();
            $.each(_vB,function(i,e){
                if(refId==$(e).attr("data-reId")){
                    $(e).addClass("al-videoHighLight");
                    $(e).find("a.Ev-padRight").addClass("padRight3");
                }
            });
        },
        //系列视频的移动
        seriesVideo_move:function(vTipW,itemsL){
            var _item = $(".Ev-seriesVideoListApp"),
                _boxW=$('.al-advContent_videoBox').width(),
                _len = itemsL,
                _w = vTipW,
                _no =0,
                sLeft= 0,
                _rMove=$(".Ev-rightMove"),
                _lMove=$(".Ev-leftMove"),
                _vHL=$(".al-videoHighLight"),
                _pLen,_nLen;
            _pLen=_vHL.prevAll().length;
            _nLen=_vHL.nextAll().length;
            if(_pLen>1&&_nLen>1){//前后各有两个以上li才进行当前的位置操作
                _lMove.css("cursor","pointer");
                sLeft = _w*(_pLen-1);
                _item.stop().animate({left:-sLeft});
                _no=_pLen-1;
            }

            if(_len<4){
                $(".Ev-rightMove,.Ev-leftMove").css("cursor","default");
            }else{
                _rMove.off("click").on("click",function(){
                    if(_no<_len-3){
                        _no++;
                        $(this).css("cursor","pointer");
                        _lMove.css("cursor","pointer");
                    }
                    sLeft = _w*_no;
                    if(sLeft>_w*(_len-4)){
                        if(videoType==19){
                            sLeft = _item.outerWidth(true)-_boxW-90;//-90;//列表向右最后三个的滑动距离
                        }else{
                            sLeft = _item.outerWidth(true)-_boxW;//列表向右最后三个的滑动距离
                        }
                        $(this).css("cursor","default");
                    }
                    _item.stop().animate({left:-sLeft});
                });

                _lMove.off("click").on("click",function(){
                    if(_no>0){
                        $(this).css("cursor","pointer");
                        _rMove.css("cursor","pointer");
                        _no--;
                        sLeft =-_no*_w;
                        _item.stop().animate({left:sLeft});
                    }
                    if(_no==0){
                        $(this).css("cursor","default");
                    }
                });
                for(var triggerNum = 0;triggerNum<$(".al-videoHighLight").index()-2;triggerNum++){
                    _rMove.trigger("click");
                }
            }
        },
        //下载视频弹层
        downloadApp:function(){
            var _tabImg= $(".Ev-downLoad_QR img");
            $(".Ev-downloadBtn").on("click", function () {
                $('.Ev-al-downLoad_PopBox').show();
                $("body").css({"overflow":"hidden"});
                // comm.setCenter($(".Ev-al-downContainer"));
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({"overflow":"auto"});
            });
        },
        getVideoType:function(e){
            var text;
            switch (parseInt(e)){
                case 1:
                    text="手术视频";
                    break;
                case 2:
                    text="课程视频";
                    break;
                case 3:
                    text="会议视频";
                    break;
                case 4:
                    text="专家访谈视频";
                    break;
            }
            return text;
        }
    };
    var payForClass = {
        el:{
            coupon:$(".al-receive-coupon"),
            buyCourse:$(".al-buyCourse-btn")
        },
        getCoupon:function(){
            var _this = this;
            _this.el.coupon.off("click").on("click",function(){
                $(".al-downLoadContent figcaption").text('\n' +
                    '更多大额优惠券，打开唯医骨科app查看');
                $('.Ev-al-downLoad_PopBox').show();
                $("body").css({"overflow":"hidden"});
            });
            _this.el.buyCourse.off("click").on("click",function(){
                $(".al-downLoadContent figcaption").text('\n' +
                    '打开唯医骨科app，尽享唯医学院精品内容');
                $('.Ev-al-downLoad_PopBox').show();
                $("body").css({"overflow":"hidden"});
            });
            $(".Ev-closePopBtn").on("click",function () {
                $('.Ev-al-downLoad_PopBox').hide();
                $("body").css({"overflow":"auto"});
            });
        }
    };//唯医3.7付费课相关参数方法
    var authData = JSON.parse(localStorage.getItem('authInfo'));
    var videoId = $("#resourceId").val();
    //videoId = 1529898619896;
    var isMpFourType = false;//页面是否使用的MP4播放视频
    var switchover = false;//是否切换过视频源
    var checkUserVideoAuth = function(){
        var login = ($('#sesCustomerId').val())?1:0;
        var authState = parseInt(authData.responseObject.state,10);
        var authStatus = 1;
        if (authData == null || authData == "" || authData == undefined || $.isEmptyObject(authData) || authState == -1
            || authState == 0 || authState == 1 || authState == 3) {	//未认证
            authStatus = 0;
        }
        return ((login+authStatus)===2)?0:3;
    };
    var saveLocalVideoTime = function(type,time){
        if(type===1){
            localStorage.setItem('videoTerminal'+videoId,time);
            window.location.reload();
        }else{
            if(localStorage.getItem('videoTerminal'+videoId)){
                return parseInt(localStorage.getItem('videoTerminal'+videoId),10);
            }else{
                return 0;
            }
        }
    };
    var cutIntoSlices = function(options){
        var reloadVideoSrc = function(){
            checkClientSpeedLow(function(bool){
                setTimeout(function(){
                    var collegeCourseState = (!isNaN(parseInt($(".al-mainContent").attr('data-collegeCourseState'),10)))&&(parseInt($(".al-mainContent").attr('data-collegeCourseState'),10)===1);
                    var payType = (!isNaN(parseInt($(".al-mainContent").attr('data-payType'),10)))&&(parseInt($(".al-mainContent").attr('data-payType'),10)===1);
                    if((!collegeCourseState)||(collegeCourseState&&payType)){
                        $.ajax({
                            url: '//www.allinmd.cn/call/cms/video/crop/json_list/',
                            type:"post",
                            data:{paramJson: $.toJSON(
                                    {"videoId":videoId,"isValid":"1","firstResult":"0","maxResult":"1000000",'cropType':checkUserVideoAuth(),'visitSiteId':1,'isSupport':(comm.browser.isIeOrEdge()||comm.browser.mozilla||comm.browser.qqbrowser||bool)?'0':'1'}
                                )},
                            dataType:'json',
                            success:function(d){
                                if(d&&d.responseObject&&d.responseObject.responseData&&d.responseObject.responseData.data_list&&d.responseObject.responseData&&d.responseObject.responseData.data_list.length){
                                    if(options.first){
                                        if(comm.browser.isIeOrEdge()||comm.browser.mozilla){
                                            $("#videoSource").attr({"src":d.responseObject.responseData.data_list[0].videoAttUrl.replace(/http:|https:/ig,''),"type":'video/mp4'});
                                            isMpFourType = true;

                                        }else{
                                            // debugger;
                                            var videoType = 'application/x-mpegURL';
                                            if(!((/.m3u8/ig).test(d.responseObject.responseData.data_list[0].cropM3u8Url))){
                                                isMpFourType = true;
                                                videoType = 'video/mp4';
                                                d.responseObject.responseData.data_list[0].videoAttUrl?$("#videoSource").attr({"src":d.responseObject.responseData.data_list[0].videoAttUrl.replace(/http:|https:/ig,''),"type":videoType}):'';
                                            }else{
                                                d.responseObject.responseData.data_list[0].cropM3u8Url?$("#videoSource").attr({"src":(d.responseObject.responseData.data_list[0].cropM3u8Url).replace(/http:|https:/ig,''),"type":videoType}):'';
                                            }

                                        }
                                    }else{
                                        videoType = 'application/x-mpegURL';
                                        d.responseObject.responseData.data_list[0].cropM3u8Url?options.player2.player.src({src:d.responseObject.responseData.data_list[0].cropM3u8Url.replace(/http:|https:/ig,''),type:videoType}):'';
                                        options.player2.player.load();

                                    }


                                    options.callBack&&options.callBack();

                                }else{
                                    options.callBack&&options.callBack();
                                }
                            }
                        });
                    }else{
                        controller.init();
                    }
                },1000);

            })
        };
        if(switchover){
            if(isMpFourType){
                options.callBack&&options.callBack();
            }else{
                reloadVideoSrc();
            }
        }else{
            switchover = true;
            reloadVideoSrc();

        }

    };
    var initVideoPlay = function(){
        //视频初始化
        $.ajax({
            url: '//www.allinmd.cn/call/cms/video/node/json_list/',
            type:"post",
            data:{paramJson: $.toJSON(
                    {"videoId":videoId,"isValid":"1","firstResult":"0","maxResult":"1000000"}
                )},
            dataType:'json',
            success:function(d){

                if(d&&d.responseObject&&d.responseObject.responseData&&d.responseObject.responseData.data_list){
                    $.each(d.responseObject.responseData.data_list,function(index,v){
                        videoNodeJson.push({
                            time:v.nodeTime,
                            text:v.nodeDesc||''
                        })
                    });
                }

                var startVideoPlatyInterval = setInterval(function () {
                    ////console.log('进入');
                    var collegeCourseState = (!isNaN(parseInt($(".al-mainContent").attr('data-collegeCourseState'),10)));
                    ////console.log(collegeCourseState);
                    if(collegeCourseState){
                        $("#video #a1").length?startVideoPlaty():controller.init();//当可以播放视频的元素存在的时候才播放视频
                        clearInterval(startVideoPlatyInterval);

                    }
                },200);
            }
        });
    };
// initVideoPlay();
    cutIntoSlices({
        callBack:initVideoPlay,
        first:1
    });
    var startToast = function(player2,t){
        if(player2.getCurrentTime()>1){
            return false;
        }
        var toastStr = '<div class="videoAnchorBg authVideoAnchorBg" style="display: none;">'+
            '        <!--<p>已经为您切换为1.5倍速度播放</p>-->'+
            '        <i></i><div class="videoToast">可试看30秒，<span class="ev-authLogin" style="cursor: pointer;">通过认证</span>可观看全部内容</div>'+
            '    </div>';
        var eleToast = $(toastStr);
        var showOnOff = false;
        if (!$('#sesCustomerId').val() && $("#goLogin").length === 0) { //未登录
            showOnOff = true;
            eleToast.find(".ev-authLogin").off("click").on("click",function(){
                player2.player.pause();//暂停;
                if(player2.player.isFullscreen()){
                    player2.player.exitFullscreen();//退出全屏
                }
                var currentTime = player2.getCurrentTime();
                user.login({
                    callback: function () {
                        authData = JSON.parse(localStorage.getItem('authInfo'));
                        $(".reminderLogin").remove();
                        cutIntoSlices(
                            {
                                callBack:function(){
                                    saveLocalVideoTime(1,currentTime);
                                    if(!comm.browser.isLessIe10()&&!comm.browser.mozilla) {
                                        player2.player.resetSpeed();
                                    }
                                    player2.currentTime(currentTime);
                                    if(player2!=undefined){
                                        setTimeout(function(){
                                            player2.player.play();
                                        },1000);

                                    }else{
                                        t.play();
                                    }
                                },
                                player2:player2
                            }


                        );
                    },
                    onClose: function () {
                        if(player2!=undefined){
                            player2.player.play();
                        }else{
                            t.play();
                        }
                        //g_sps.jump(null, "/pages/channel/video/video_index.html");
                    },

                    scene: privilegeSceneConst.eSceneTypeVideoPlay,
                    noAuthTip:1
                });
            });

        }else{
            //未认证
            var authState = parseInt(authData.responseObject.state,10);
            if (authData == null || authData == "" || authData == undefined || $.isEmptyObject(authData) || authState == -1
                || authState == 0 || authState == 1 || authState == 3) {	//未认证
                showOnOff = true;
                eleToast.find(".ev-authLogin").off("click").on("click",function(){
                    var currentTime = player2.getCurrentTime();
                    player2.player.pause();//暂停;
                    if(player2.player.isFullscreen()){
                        player2.player.exitFullscreen();//退出全屏
                    }
                    user.login({
                        callback: function () {
                            authData = JSON.parse(localStorage.getItem('authInfo'));
                            $(".reminderLogin").remove();
                            cutIntoSlices(
                                {
                                    callBack:function(){
                                        saveLocalVideoTime(1,currentTime);
                                        if(!comm.browser.isLessIe10()&&!comm.browser.mozilla) {
                                            player2.player.resetSpeed();
                                        }
                                        player2.currentTime(currentTime);
                                        if(player2!=undefined){
                                            setTimeout(function(){
                                                player2.player.play();
                                            },1000);
                                        }else{
                                            t.play();
                                        }
                                    },
                                    player2:player2
                                }

                            );
                        },
                        onClose: function () {
                            if(player2!=undefined){
                                player2.player.play();
                            }else{
                                t.play();
                            }
                            //g_sps.jump(null, "/pages/channel/video/video_index.html");
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        noAuthTip:1
                    });
                });//.html("通过")

            }
        }
        $('.vjs-progress-control').append(eleToast);
        if(showOnOff){
            $(".videoAnchorBg").show();
        }
        setTimeout(function(){
            $(".videoAnchorBg").fadeOut(1000);
        },5000);
    };
    var multipleSpeed = {
        //倍速切换的 label 值
        menuLabel: '倍速',
        //倍速切换菜单项，label 为菜单项的显示文本，rate 为对应的播放速率
        menuItems: [{label: '1.0X', rate: 1}, {label: '1.25X', rate: 1.25},{label: '1.5X', rate: 1.5},{label: '2.0X', rate: 2}]
    };
    var techOrder=['html5'];
    if(comm.browser.isLessIe10()||comm.browser.mozilla){//ie8,9,10,在火狐浏览器下同样适用flash
        multipleSpeed = {};
        techOrder = ["flash"];
    }
    var startVideoPlaty = function(){
        var player2 = new AllinmdPlayer('ev-videoDetailCon', {
            techOrder: techOrder,
            width:708,
            height:442,
            poster:"//img10.allinmd.cn/v3/terminal/defaultVideo.jpg",  //播放之前需要放置的海报图片
            //IE8下使用的swf地址
            flash: {
                swf:'//paas.allinmd.cn/modules/allinmdplayer/allinmdplayer.swf'
            },
            plugins: {
                videoJsSpeedSwitcher: multipleSpeed,
                videoJsResolutionSwitcher: {"default": 'high', dynamicLabel: "true"},
                progress: videoNodeJson
            },
            //需要使用的插件，清晰度切换(videoJsResolutionSwitcher)，关键点显示(progress)
            /*plugins: {
             videoJsResolutionSwitcher:{"default": 'high', dynamicLabel: "true"}
             },*/
            //设置播放权限时间，使用时需保证allow值为true
            limitPlayTime:{
                allow:false,
                value:29
            },//设置允许最大的快进时长，用于限制用户拖拽至不允许播放的时间点，使用时需保证allow值为true
            setMaxPlayTime:{
                allow:false,
                value:0
            }
        },function(){
            ////console.log("videojs对象初始化后的回调函数");
            var t=this;
            startToast(player2,t);
            //player2.ModalDialog(true,toastStr);
            if(saveLocalVideoTime(0)==0){
                setTimeout(function () {
                    if($(".m-UserPop-v2").length===0){
                        if(player2!=undefined){
                            player2.player.play();
                        }else{
                            t.play();
                        }
                        // player2.player.volume && player2.player.volume(0.5);
                        loadedHandler();
                    }
                    //player2.volume(0.5);
                    //document.getElementById('ev-videoDetailCon_html5_api').volume = .5;
                }, 5000);
            }else{
                setTimeout(function () {

                    if($(".m-UserPop-v2").length===0){
                        if(player2!=undefined){
                            player2.player.play();
                        }else{
                            t.play();
                        }
                        // player2.player.volume && player2.player.volume(0.5);
                        player2.currentTime(saveLocalVideoTime(0));
                        localStorage.removeItem('videoTerminal'+videoId);
                        loadedHandler();
                    }
                    //document.getElementById('ev-videoDetailCon_html5_api').volume = .5;

                }, 500);

            }
        });
        comm.players=[player2];        //存放播放器
//页面刷新获取播放时间
        function loadedHandler(){
            var _sesLogin=$("#sesCustomerId").val();
            if(_sesLogin) {
                var paramData = {};
                paramData.customerId = _sesLogin;
                paramData.videoId = $("#resourceId").val();
                paramData.siteId = 1;//1.pc 2.h5
                paramData.timeType = 1;//1.pc 2.h5
                var callback = function (rep) {
                    if (rep && rep.responseObject&& $.trim(rep.responseObject.responseData)&&!$.isEmptyObject(rep.responseObject.responseData)) {
                        var _goTime=rep.responseObject.responseData.data_list[0].customer_video_play.playTime;
                        if(_goTime&&comm.timeToSec(_goTime)){
                            if(localStorage.getItem('noNeedSetTime'+videoId)){
                                localStorage.removeItem('noNeedSetTime'+videoId);
                                if(player2.getDurationTime()){
                                    player2.currentTime(0);
                                    player2.player.play();
                                }else{
                                    setTimeout(function () {
                                        player2.currentTime(0);
                                        player2.player.play();
                                    }, 2000);
                                }
                            }else{

                                if(player2.getDurationTime()){
                                    player2.currentTime(comm.timeToSec(_goTime));
                                    player2.player.play();

                                }else{
                                    setTimeout(function () {
                                        player2.currentTime(comm.timeToSec(_goTime));
                                        player2.player.play();
                                    }, 2000);
                                }
                            }

                        }
                    }
                };
                comm.ajax.async(PC_CALL+"customer/videoPlay/getById/", {paramJson: $.toJSON(paramData)}, callback);
            }

            //允许播放时间
            if($("#videoType").val() != 19){
                if($("#sesAuth").val()==2||$("#sesAuth").val()==7||$("#sesAuth").val()==8||$("#sesAuth").val()==9){
                    limitTime = 50000000;
                }else{
                    limitTime = 29;
                }
            }else{
                limitTime = 50000000;
            }
        }

        function checkAuth(data) {
            html = "";
            var loginJson = {
                login:false,
                auth:false
            };
            if (data == null || data == "" ||
                data.responseObject == undefined ||
                $.isEmptyObject(data.responseObject) ||
                data.responseObject.state == -1 ||
                data.responseObject.state == 0 ||
                data.responseObject.state == 1 ||
                data.responseObject.state == 3) {	//未认证
                if ($("#goLogin").length === 0) {
                    actionId=24;
                    html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyAccreditation.png\" style=\"width:708px;height:442px;\">";
                    authState = false;
                }
            } else {
                authState = true;
                var state = data.responseObject.state;
                var company = data.responseObject.company;
                var schoolName = data.responseObject.schoolName;
                var areasExpertise = data.responseObject.areasExpertise;
                var medicalTitle = data.responseObject.medicalTitle;
                if (state == 2 || state==7 || state==8 || state==9) {
                    //认证已经通过，此时不允许再次认证
                    if ((!company && !schoolName) || !areasExpertise || !medicalTitle && $("#goLogin").length === 0) {
                        //认证已经通过，但资料未完善。
                        html = "<img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyWs.png\" style=\"width:708px;height:442px;\">";
                    }
                }
            }
            return html;
        }

//SWF
        var arrPlayTimes=[];
        var _play,_pause,_totalTime,_loginTimeParam;
//当视频时间发生变化时，触发此事件
        player2.player.on("timeupdate",function(){
            allinPlayer_status();
        });
        //监听视频倍速
        player2.player.on(player2.EVENT_TYPE.SPEED_CHANGE_EVENT,function(){
            var rateState = this.playbackRate();
            $(".videoAnchorBg").remove();
            var toastStr = '<div class="videoAnchorBg" style="display: none;">'+
                '        <!--<p>已经为您切换为1.5倍速度播放</p>-->'+
                '<div class="videoToast">已经为您切换为'+rateState+'倍速度播放</div>'+
                '    </div>';
            var eleToast = $(toastStr);
            $('.vjs-progress-control').append(eleToast);
            eleToast.show();
            setTimeout(function(){
                eleToast.hide();
            },3000);
        });
//视频播放事件监听
        player2.player.on("play",function(){
            // startToast(player2,player2);
            _play=parseFloat(player2.getCurrentTime());//当前播放点时间
            _totalTime=player2.getDurationTime();//总时长 秒
        });
//视频暂停事件监听
        player2.player.on("pause",function(){
            if($("#sesCustomerId").val()) {
                _pause = parseFloat(player2.getCurrentTime());//当前暂停点时间
                if ((_pause && _pause < _totalTime)) {
                    if ((_pause - _play > 0) && (_pause - _play == 0 || _pause - _play)) {
                        arrPlayTimes.push({
                            'playTime': comm.secToTime(parseInt(_pause - _play)),
                            'createTime': comm.date.local_time()
                        });//存储播放时间段
                    }
                }
            }
            ////console.log(arrPlayTimes);
        });
//视频结束事件监听
        player2.player.on("ended",function(){
            if($("#sesCustomerId").val()) {//系列课视频跳转问题
                localStorage.setItem('videoTerminalEnd'+videoId,1);
                _pause = parseFloat(player2.getCurrentTime());//当前结束点时间
                if ((_pause && _pause < _totalTime) || _pause) {
                    if ((_pause - _play > 0) && (_pause - _play == 0 || _pause - _play)) {
                        arrPlayTimes.push({
                            'playTime': comm.secToTime(parseInt(_pause - _play)),
                            'createTime': comm.date.local_time()
                        });//存储播放时间段
                    }
                }
            }
            //系列视频自动播放
            var authState = parseInt(authData.responseObject.state,10);
            if($('#sesCustomerId').val()&&(authState==2||authState==7||authState==8||authState==9)){
                playerstop();
            }
            ////console.log(arrPlayTimes);
        });
        function loginToast(){
            $(".reminderLogin").remove();
            $('body').append(
                '<section class="reminderLogin">'+
                '    <div class="videoAnchorPopup">'+
                '        <div class="close" id="closeLoginAuth"><i></i></div>'+
                '        <h2>试看结束</h2>'+
                '        <p>认证资格可观看全部内容</p>'+
                '        <button id="loginState" style="cursor: pointer;"><span>登录/认证</span></button>'+
                '        <p id="reloadVideo" style="cursor: pointer;">重新试看</p>'+
                '    </div>'+
                '</section>'
            );
            $('body').css({'overflow':"hidden"});
        }
//判断权限
        function allinPlayer_status() {
            authDataObject=comm.authInfo;
            var nowTime = player2.getCurrentTime();
            var manufacture = 0;//厂商用户
            if (limitTime < nowTime) {
                player2.player.pause();//先暂停
                if (!$('#sesCustomerId').val() && $("#goLogin").length === 0) { //未登录
                    actionId=18;
                    loginState = false;
                    html = "<div class='authVideoMask' style='background: #333;'><img id=\"goLogin\" src=\"//img00.allinmd.cn/detail/video/immediatelyLogin.png\" style=\"width:708px;height:442px;\"/></div>";
                    if(player2.player.isFullscreen()){
                        player2.player.exitFullscreen();//退出全屏
                    }
                } else {
                    loginState = true;
                    if(unite){
                        if(unite.customerRole&&unite.customerRole==3){//厂商
                            limitTime = 50000000;
                            player2.player.play();//播放
                            manufacture=1;
                        }
                    }else{
                        $.ajax({
                            url: PC_CALL + "customer/unite/getCustomerUnite/",
                            dataType: "json",
                            type: "post",
                            async: false,
                            success: function (rep) {
                                if (rep && rep.responseObject) {
                                    unite = rep.responseObject;
                                    if(unite.customerRole&&unite.customerRole==3){//厂商
                                        limitTime = 50000000;
                                        player2.player.play();//播放
                                        manufacture=1;
                                    }
                                }
                            }
                        });
                    }
                    if (!manufacture){
                        if (!authDataObject) {
                            $.ajax({
                                url: PC_CALL + "customer/auth/getAuthBycustomerId/",
                                dataType: "json",
                                type: "post",
                                async: false,
                                success: function (data) {
                                    authDataObject = data;
                                    _obj = data.responseObject;
                                    if (data == null || data == "" || _obj == undefined || $.isEmptyObject(_obj) || _obj.state == -1
                                        || _obj.state == 0 || _obj.state == 1 || _obj.state == 3) {	//未认证
                                        //CKobject.getObjectById('CKa1').videoPause();
                                    } else {
                                        var state = _obj.state;
                                        var company = _obj.company;
                                        var schoolName = _obj.schoolName;
                                        var areasExpertise = _obj.areasExpertise;
                                        var medicalTitle = _obj.medicalTitle;
                                        if (state == 2 || state==7 || state==8 || state==9) {
                                            //认证已经通过，此时不允许再次认证
                                            if ((!company && !schoolName) || !areasExpertise || !medicalTitle && $("#goLogin").length === 0) {
                                                //认证已经通过，但资料未完善。
                                                //CKobject.getObjectById('CKa1').videoPause();
                                            }else{
                                                player2.player.play();//播放
                                                limitTime = 50000000;
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            _kv = authDataObject;
                            _obj = _kv.responseObject;
                            if (_kv == null || _kv == "" || _obj == undefined || $.isEmptyObject(_obj) || _obj.state == -1 || _obj.state == 0 || _obj.state == 1 || _obj.state == 3) {	//未认证
                                player2.player.pause();//暂停
                            } else {
                                var state = _obj.state;
                                var company = _obj.company;
                                var schoolName = _obj.schoolName;
                                var areasExpertise = _obj.areasExpertise;
                                var medicalTitle = _obj.medicalTitle;
                                if (state == 2 || state==7 || state==8 || state==9) {
                                    //认证已经通过，此时不允许再次认证
                                    if ((!company && !schoolName) || !areasExpertise || !medicalTitle && $("#goLogin").length === 0) {
                                        //认证已经通过，但资料未完善。
                                        limitTime = 29;
                                        //CKobject.getObjectById('CKa1').videoPause();
                                    }else{
                                        limitTime = 50000000;
                                        player2.player.play();//播放
                                    }
                                }
                            }
                        }
                        html = checkAuth(authDataObject);
                    }

                }
                if (html.length > 0) {
                    if(player2.player.isFullscreen()){
                        player2.player.exitFullscreen();//退出全屏
                    }
                    //$("#a1").css("position", "absolute").css("top", "-10000px");
                    if (checkUserVideoAuth()===3) {
                        //$("#video").prepend(html);
                        //提示用户登录
                        //player2.ModalDialog(true,html);
                        player2.player.pause();//暂停;
                        //player2.currentTime(30);
                        /*debugger;*/
                        loginToast();


                    }
                    $("#closeLoginAuth").off("click").on("click",function(){
                        player2.currentTime(0);
                        if(!comm.browser.isLessIe10()&&!comm.browser.mozilla){
                            player2.player.resetSpeed();
                        }
                        player2.player.play();
                        //player2.currentTime(0);
                        $('.reminderLogin').remove();
                        $('body').css({'overflow':"auto"});
                        $(document).scrollTop(0);
                    });
                    $('#reloadVideo').off("click").on("click",function(){
                        $("#closeLoginAuth").trigger("click");
                    });
                    $("#loginState").on("click", function () {
                        $('.reminderLogin').remove();
                        var currentTime = player2.getCurrentTime();
                        player2.player.pause();//暂停;
                        if(player2.player.isFullscreen()){
                            player2.player.exitFullscreen();//退出全屏
                        }
                        user.login({
                            callback: function () {
                                authData = JSON.parse(localStorage.getItem('authInfo'));
                                $(".reminderLogin").remove();
                                cutIntoSlices(
                                    {
                                        callBack:function(){
                                            loginState = true;
                                            $("#a1").css("position", "static");
                                            $("#goLogin").remove();
                                            getCommentHeadImg();    //新增评论部分头像更新
                                            flag = true;
                                            saveLocalVideoTime(1,currentTime);
                                            if(!comm.browser.isLessIe10()&&!comm.browser.mozilla) {
                                                player2.player.resetSpeed();
                                            }
                                            player2.currentTime(currentTime);
                                            player2.player.play();
                                            limitTime = 50000000;
                                            var param = {};
                                            param.sessionCustomerId = $("#sesCustomerId").val();
                                            param.useFlag = 12;
                                            param.visitSiteId = 1;
                                            param.logoUseFlag = 3;
                                            param.videoId = $("#resourceId").val();
                                            $.ajax({
                                                type: "POST",
                                                url: PC_CALL + "video/getMapById3/",
                                                data: {paramJson: $.toJSON(param)},
                                                dataType: "json",
                                                success: function (rep) {
                                                    if (rep && rep.responseObject && !$.isEmptyObject(rep.responseObject.responseData) && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                                                        var items = rep.responseObject.responseData.data_list[0];
                                                        var cAuth = items.cms_video_customer;
                                                        if (cAuth.customerId == $("#sesCustomerId").val()) {//登录，发布是同一个人
                                                            $(".Ev-followBtn .followBtn").remove();
                                                        } else {
                                                            $(".Ev-followBtn .followBtn").remove();
                                                            $(".followBtn").follow({
                                                                fStatus: items.isFollowPeople,
                                                                classStyle: "followBtn",
                                                                fId: cAuth.customerId ? cAuth.customerId : "",
                                                                picStyle: 5,
                                                                canToggle: false
                                                            });
                                                        }
                                                    }
                                                },
                                                error: function () {
                                                }
                                            });
                                            scoringSystem();
                                        },
                                        player2:player2
                                    }
                                );
                            },
                            onClose: function () {
                                player2.currentTime(0);
                                if(!comm.browser.isLessIe10()&&!comm.browser.mozilla) {
                                    player2.player.resetSpeed();
                                }
                                setTimeout(function(){
                                    player2.player.play();
                                },1000);
                                //g_sps.jump(null, "/pages/channel/video/video_index.html");
                            },
                            //onAuthCancel: "back",     // 当点暂不认证时的处理、回退到来源页
                            scene: privilegeSceneConst.eSceneTypeVideoPlay,
                            noAuthTip:1
                        });
                        //事件埋点
                        comm.creatEvent({
                            triggerType:(actionId==18)?"登录":"认证",
                            keyword:"视频权限按钮",
                            actionId:actionId
                        });
                    });
                } else {
                    if ($("#goLogin").length !== 0) {
                        player2.player.pause();//暂停;
                    }
                }
            }else{
                /*if (!$('#sesCustomerId').val() && $("#goLogin").length === 0) { //未登录{
                    player2.player.pause();//暂停;
                    //player2.currentTime(30);
                }
                var authState = parseInt(authData.responseObject.state,10);
                if (authData == null || authData == "" || authData == undefined || $.isEmptyObject(authData) || authState == -1
                    || authState == 0 || authState == 1 || authState == 3) {	//未认证
                    player2.player.pause();//暂停;
                //    player2.currentTime(30);
                }*/
            }

        }
//针对视频结束


        $(".ev-isAnonymous b").removeClass("active");
        var refId = $("#resourceId").val();
        var refTy = parseInt($("#resourceType").val());
        var videoType = parseInt($("#videoType").val());
        /*  if ($('#sesCustomerId').val() && ($('#sesAuth') == 1 || $('#sesAuth') == 2)) {//如果登录了
         ckplayer_status = null;
         }*/
        controller.init();
        scene.eBookVideo=function(){
            controller.eBookSeriesVideo();
        };
//自动播放下一集
        function playerstop() {
            if($(".al-videoScoreMask").length>0){
                //判断有网络 并且 目前播放时间到视频总时长差额在5秒内，要结束时
                if(navigator.onLine&&(player2.getCurrentTime()>player2.getDurationTime()-5)){
                    player2.player.pause();
                    $(".al-videoScoreMask").show();
                    if($('.al-mainContent').attr('data-collegecoursestate')==1){
                        $(".al-downLoadContent figcaption").text('\n' +
                            '打开唯医骨科app，尽享唯医学院精品内容');
                        $('.ev-scoring .ev-startItem').unbind();
                        $('.ev-scoring .ev-startItem').off("click").on("click",function(){
                            user.login({
                                callback: function () {
                                    $('.Ev-al-downLoad_PopBox').show();
                                    $("body").css({"overflow":"hidden"});
                                },
                                onClose: function () {

                                },
                                scene: privilegeSceneConst.eSceneTypeAuth,
                                noAuthTip:1
                            });
                        });
                    }
                }
            }else if($(".Ev-videoTipBox").length>0){
                var locationHref=$(".al-videoHighLight").next().find("a.Ev-padRight").attr("href");
                if(locationHref){
                    g_sps.jump(null, locationHref);
                }else{
                    player2.player.pause();
                }
            }else{
                player2.player.pause();
            }
        }
//视频时间未到3分钟、


//关闭页面或者页面跳转定为上次播放时间
        window.onbeforeunload=function(){
            var _sesLogin=$("#sesCustomerId").val();
            if(_sesLogin&&!$(".al-caseScreenedBox").length) {
                var _n=player2.getCurrentTime();//当前时间
                var _nowT =(_n==0||_n)?parseFloat(_n):-1;//页面离开时当前的时间
                var _totalT = player2.getDurationTime();//总时长 秒
                if(_nowT!=-1&&(_play||_play==0)){//直接刷新页面离开时对数组再进行一次push
                    if((_nowT-_play>0)&&(_nowT-_play==0||_nowT-_play)&&(parseInt(_pause)!=parseInt(_nowT))){
                        arrPlayTimes.push({'playTime':comm.secToTime(parseInt(_nowT-_play)),'createTime':comm.date.local_time()});
                    }
                }
                //离开页面播放时间点接口传递
                var paramData = {};
                paramData.customerId = _sesLogin;
                paramData.videoId = $("#resourceId").val();
                paramData.typeId = 1;
                paramData.playTime=(_nowT!=-1&&_totalT)?comm.secToTime(parseInt(_nowT)):"00:00:00";
                paramData.isValid = 1;
                paramData.siteId = 1;//1.pc 2.h5
                paramData.timeType = 1;
                paramData.createTime = comm.date.local_time();//本地时间
                cPlayTime(paramData);
                //离开页面播放时间段接口传递
                var paramData1={};
                paramData1.customerId = _sesLogin;
                paramData1.videoId = $("#resourceId").val();
                //paramData1.typeId = 1;
                paramData1.siteId = 1;//1.pc 2.h5
                paramData1.timeType = 2;
                paramData1.playTimeList=JSON.stringify(arrPlayTimes);
                cPlayTime(paramData1);
            }
        };

        function cPlayTime(kv){
            $.ajax({
                url: PC_CALL+"customer/videoPlay/create/",
                type: "post",
                dataType: "json",
                data: {paramJson: $.toJSON(kv)},
                async:false,
                success: function (data) {

                }
            });
        }
    };

});
