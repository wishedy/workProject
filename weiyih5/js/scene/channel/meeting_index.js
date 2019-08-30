/**
 * 会议首页
 * Created by sunhaibin on 2016/3/38.
 */

$(function(){
    FastClick.attach(document.body);
    //window.onload = Log.createBrowse(42, "会议列表页面"); //	浏览日志
    comm.footerNav();
    var mobileMeetingIndex ={
        config:{
            queryTime:1
        },
        opt:{
            clickNum:0
        },
        path:{
            url:'/mcall/conference/index/getMapList/'
        },
        init:function(obj){
            var o={};
            var t=this;
            o = $.extend(o,obj);
            t.app();
            t.slideUp();
            t.loadIndex();
            t.randomChange();
            //fixNav();
            changePage();
            t.bindOrientationChangeEvent();
            t.backToTop();
            t.shareLog();
        },
        app:function(){
            comm.appWakeUp('btn');
        },
        //分享日志
        shareLog:function(){
            shareAll({
                title:document.title,
                pic:'https://m.allinmd.cn/image/allin_logo.png',
                summary:$('meta[name="keywords"]').attr('content'),
                fnMessageSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: 1,
                        refId: "",
                        isValid: 1,
                        shareSence:11,
                        shareChannel:4,
                        shareContent:document.title
                    });
                },
                fnTimelineSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: 1,
                        refId: "",
                        isValid: 1,
                        shareSence:11,
                        shareChannel:5,
                        shareContent:document.title
                    });
                }
            },true);
        },
        //回到顶部
        backToTop:function(){
            var t=this;
            var scrollTop=0;
            $(window).scroll(function(){
                scrollTop=$(window).scrollTop();
                if(scrollTop>100){
                    $('.al-footerBarItemBackToTop').show();
                }else{
                    $('.al-footerBarItemBackToTop').hide();
                }
            });
            $('.al-footerBarItemBackToTop').on('click',function(e){
                if(t.opt.clickNum==1){
                  g_sps.jump(null,location.href);
                }else{
                    t.opt.clickNum=1;
                    setTimeout(function(){
                        t.opt.clickNum=0;
                        $('html body').stop().animate({scrollTop:0},300);
                    },500);
                    e.preventDefault();
                    return false;
                }
            });
        },

        slideUp:function(){
            var _h = $('.al-indexHeader').outerHeight();
            $(window).on('scroll touchmove',function(){
                if($(window).scrollTop()>_h){
                    $('.al-indexHeader').stop().animate({height:0},100);
                    if($('.ev_switchPlatform').hasClass('al-personalSelectorOn')){
                        $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
                        comm.creatEvent({
                            triggerType:'骨科&手外科切换(取消)',
                            keyword:"骨科&手外科切换(取消)",
                            actionId:3
                        });
                    }
                }else{
                    $('.al-indexHeader').stop().animate({height:_h},100);
                }
            });
        },

        loadIndex:function(){
            comm.loading.show();
            var t=this;
            var recentMeeting="",_recentMeet="",
                latestMeeting="",latestIndex="",
                recomMeeting="",recomMeetingWithImg="",recomMeetingWithNoImg="",
                prevMeeting="";
            t.ajaxFn({
                url: t.path.url,
                param: {paramJson: $.toJSON({conferenceVersion:1,visitSiteId:2,platformId:TempCache.getItem('department')||1,sessionCustomerId:TempCache.getItem('userId')||""})},//
                fn:function(data) {
                    comm.loading.hide();
                    if (data && data.responseObject.responseData && data.responseObject.responseData.data_list.length) {
                        var res = data.responseObject.responseData.data_list[0];
                        if(res.adList&&res.adList.length){
                            for (var r = 0, rl = res.adList.length; r < rl; r++) {
                                _recentMeet += ' <figure class="swiper-slide al-carouselBannerItem">'+
                                    '<a href="' + res.adList[r].linkUrl +'">'+
                                    '<img src="' + (/:/.test(res.adList[r].adAttUrl)?res.adList[r].adAttUrl:"https:"+res.adList[r].adAttUrl) + '" alt="'+res.adList[r].adAttName+'">'+
                                    '</a>'+
                                    '</figure>';
                            }
                            recentMeeting ='<section class="swiper-wrapper ">'+_recentMeet+'</section><section class="swiper-pagination"></section>';
                        }

                        latestIndex = res.conferenceList[0].conference;
                        if(latestIndex instanceof Array&&latestIndex.length) {
                            $.each(latestIndex, function (j, jE) {
                                latestMeeting += '<section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                    '      <article class="al-contentText">' +
                                    //'      <a href="/pages/conference/meeting-place.html?conId=' + jE.conId + '&conName=' + jE.conName + '" class="al-contentTitle">' +
                                    '      <a href="/pages/conference/meeting_detail.html?conId=' + jE.conId + '" class="al-contentTitle">' +
                                    (jE.conName.length > 40 ? jE.conName.substring(0, 38) + '...' : jE.conName) +
                                    '</a>' +
                                    '  <p class="al-contentOtherMsg">' +
                                    '      <span class="al-contentSeminarTime2"></span><span class="bytePlace">' + dateFormat(jE.startTime, jE.endTime) + '</span>' +
                                    '      <span class="al-contentSeminarPlace"></span>' + jE.country + (jE.country == "" || jE.city == "" ? "" : '&sdot;') + jE.city +
                                    '  </p>' +
                                    '  </article>' +
                                    '  </section>';
                            });
                        }

                        //推荐会议
                        var reItem = '';
                        if(res.conferenceList[1].conference instanceof Array&&res.conferenceList[1].conference.length) {
                            for (var m = 0, ml = res.conferenceList[1].conference.length; m < ml; m++) {
                                reItem = res.conferenceList[1].conference[m];
                                if (m == 0) {
                                    recomMeetingWithImg = '  <section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                        '      <article class="al-contentText">' +
                                        //'      <a href="/pages/conference/meeting-place.html?conId=' + reItem.conId + '&conName=' + reItem.conName + '" class="al-contentTitle">' +
                                        '      <a href="/pages/conference/meeting_detail.html?conId=' + reItem.conId + '" class="al-contentTitle">' +
                                        (reItem.conName.length > 40 ? reItem.conName.substring(0, 38) + '...' : reItem.conName) +
                                        ' </a>' +
                                        '  <figure class="al-contentSeminarImg">' +
                                        //'      <a href="/pages/conference/meeting-place.html?conId=' + reItem.conId + '&conName=' + reItem.conName + '">' +
                                        '      <a href="/pages/conference/meeting_detail.html?conId=' + reItem.conId + '">' +
                                        '      <img src="' + reItem.conMainPicUrl + '" alt="">' +
                                            //'      <i class="al-contentMeetingLiving">'+                //直播中
                                            //'      <img src="//img50.allinmd.cn/meeting/meeting2016/live.png" alt="">'+
                                            //'      </i>'+
                                        '      </a>' +
                                        '      </figure>' +
                                        '      <p class="al-contentOtherMsg">' +
                                        '      <span class="al-contentSeminarTime2"></span><span class="bytePlace">' + dateFormat(reItem.startTime, reItem.endTime) + '</span>' +
                                        '      <span class="al-contentSeminarPlace"></span>' + reItem.country + (reItem.country == "" || reItem.city == "" ? "" : '&sdot;') + reItem.city +
                                        '  </p>' +
                                        '  </article>' +
                                        '  </section>';
                                } else {
                                    recomMeetingWithNoImg += ' <section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                        '      <article class="al-contentText">' +
                                        //'      <a href="/pages/conference/meeting-place.html?conId=' + reItem.conId + '&conName=' + reItem.conName + '" class="al-contentTitle">' +
                                        '      <a href="/pages/conference/meeting_detail.html?conId=' + reItem.conId +'" class="al-contentTitle">' +
                                        (reItem.conName.length > 40 ? reItem.conName.substring(0, 38) + '...' : reItem.conName) +
                                        '  </a>' +
                                        '  <p class="al-contentOtherMsg">' +
                                        '      <span class="al-contentSeminarTime2"></span><span class="bytePlace">' + dateFormat(reItem.startTime, reItem.endTime) + '</span>' +
                                        '      <span class="al-contentSeminarPlace"></span>' + reItem.country + (reItem.country == "" || reItem.city == "" ? "" : '&sdot;') + reItem.city +
                                        '  </p>' +
                                        '  </article>' +
                                        '  </section>';
                                }


                            }
                            recomMeeting += recomMeetingWithImg + recomMeetingWithNoImg;
                        }
                        //过往会议
                        //var startTime,endTime;
                        if(res.conferenceList[2].conference instanceof Array&& res.conferenceList[2].conference.length) {
                            $.each(res.conferenceList[2].conference, function (n, ele) {
                                prevMeeting += '  <section class="al-contentPartModule al-contentUpTitleDownImg">' +
                                    '      <article class="al-contentText">' +
                                    //'      <a href="/pages/conference/meeting-place.html?conId=' + ele.conId + '&conName=' + ele.conName + '"  class="al-contentTitle">' +
                                    '      <a href="/pages/conference/meeting_detail.html?conId=' + ele.conId + '"  class="al-contentTitle">' +
                                    (ele.conName.length > 40 ? ele.conName.substring(0, 38) + '...' : ele.conName) +
                                    '</a>' +
                                    '  <figure class="al-contentSeminarImg">' +
                                    //'      <a href="/pages/conference/meeting-place.html?conId=' + ele.conId + '&conName=' + ele.conName + '">' +
                                    '      <a href="/pages/conference/meeting_detail.html?conId=' + ele.conId + '">' +
                                    '          <img src="' + ele.conMainPicUrl + '" alt="">' +
                                    '      </a>' +
                                    '      </figure>' +
                                    '      <p class="al-contentOtherMsg">' +
                                    '      <span class="al-contentSeminarTime2"></span><span class="bytePlace">' + dateFormat(ele.startTime, ele.endTime) + '</span>' +
                                    '      <span class="al-contentSeminarPlace"></span>' + ele.country + (ele.country == "" || ele.city == "" ? "" : '&sdot;') + ele.city +
                                    '  </p>' +
                                    '  </article>' +
                                    '  </section>';

                            });
                        }

                        if(recentMeeting!=""){
                            $('#ev_imgWrap').html(recentMeeting);
                        }else{
                            $('#ev_imgWrap').hide();
                        }
                        if(latestMeeting!=""){
                            $('#ev_latestMeetings').html(latestMeeting);
                        }else{
                            $('#ev_latestMeetings').parents('.al-content').hide();
                        }
                        if(recomMeeting!=""){
                            $('#ev_recomMeeting').html(recomMeeting);
                        }else{
                            $('#ev_recomMeeting').parents('.al-content').hide();
                        }
                        if(prevMeeting!=""){
                            $('#ev_allMeeting').html(prevMeeting);
                        }else{
                            $('#ev_allMeeting').parents('.al-content').hide();
                        }
                        if(recentMeeting==""&&latestMeeting==""&&recomMeeting==""&&prevMeeting==""){
                            $('.noMeetContent').show();
                            //$('.noMeetContent img').css('marginLeft',$('.noMeetContent img').width()/2);
                        }
                        t.lazyLoad();
                        t.resetSlider();

                    }
                }
            });
        },
        bindOrientationChangeEvent:function (){
            $('body').on('orientationchange', function(event) {
                resetSlider();
            });

            $('body').on('resize', function(event) {
                resetSlider();
            });
        },
        resetSlider:function (){
            if($('.swiper-slide').length>1){
                var indexCarousel = new Swiper("#ev_imgWrap", {
                    direction: 'horizontal',
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                });
                //埋点
                $('.swiper-wrapper a').click(function(){//$('.swiper-slide-active')
                    comm.creatEvent({
                        triggerType:'广告位',
                        keyword:"广告位-轮播图(会议)-"+$(this).find('img').attr('alt'),
                        actionId:14,
                        locationId:parseInt($('.swiper-slide-active').attr('data-swiper-slide-index'))+1,
                        refId:$(this).attr('href')
                    });
                });
            }else{
                $('.swiper-wrapper a').click(function(){
                    comm.creatEvent({
                        triggerType:'广告位',
                        keyword:"广告位-轮播图(会议)-"+$(this).find('img').attr('alt'),
                        actionId:14,
                        locationId:1,
                        refId:$(this).attr('href')
                    });
                });
            }

        },
        lazyLoad:function(){
            var t=this;
            var html="";
            var wholeHeight = $(document).height();
            var scrollHeight = $(window).scrollTop()+$(window).height();
            var firstResult,imgContent;
            $(window).on('scroll',function(){
                if(!$('#ev_allMeeting').hasClass('noMoreMeeting')&&!$('#ev_allMeeting').hasClass('moreMeetingQuerying')){ //如果没有更多，没有事件，否则加载
                    wholeHeight = $(document).height();
                    scrollHeight = $(window).scrollTop()+$(window).height();
                    if(scrollHeight>=(wholeHeight-50)) {
                        firstResult = $('#ev_allMeeting .al-contentPartModule').length;
                        $('#ev_allMeeting').addClass('moreMeetingQuerying');
                        comm.loading.show();
                        t.ajaxFn({
                            url: t.path.url,
                            param: {paramJson: $.toJSON({firstResult: firstResult, maxResult: 10,platformId:TempCache.getItem('department')||1,sessionCustomerId:TempCache.getItem('userId')||""})},
                            fn: function (data) {
                                comm.loading.hide();
                                if (data && data.responseObject.responseData && data.responseObject.responseData.data_list.length) {
                                    var item = data.responseObject.responseData.data_list;
                                    var startTime, endTime;
                                    html="";
                                    $.each(item, function (i, e) {
                                        startTime = (e.conference.startTime && e.conference.startTime != undefined && e.conference.startTime != "" && !$.isEmptyObject(e.conference.startTime)) ? (e.conference.startTime).substring(0, 10).replace(/-/g, ".") : "";
                                        endTime = (e.conference.endTime && e.conference.endTime != undefined && e.conference.endTime != "" && !$.isEmptyObject(e.conference.endTime)) ? (e.conference.endTime).substring(0, 10).replace(/-/g, ".") : "";
                                        //imgContent=e.conference.conMainPicUrl==""?"":('<img src="' + e.conference.conMainPicUrl + '"/>');
                                        imgContent =e.conference.conMainPicUrl==""?"":('  <figure class="al-contentSeminarImg">'+
                                        //'      <a href="/pages/conference/meeting-place.html?conId=' + e.conference.conId + '&conName='+e.conference.conName+'">'+
                                        '      <a href="/pages/conference/meeting_detail.html?conId=' + e.conference.conId + '">'+
                                        '<img src="' + e.conference.conMainPicUrl + '"/>'+
                                        '      </a>'+
                                        '      </figure>')
                                        html += '  <section class="al-contentPartModule al-contentUpTitleDownImg">'+
                                            '      <article class="al-contentText">'+
                                            //'      <a href="/pages/conference/meeting-place.html?conId=' + e.conference.conId + '&conName='+e.conference.conName+'"  class="al-contentTitle">' +
                                            '      <a href="/pages/conference/meeting_detail.html?conId=' + e.conference.conId + '"  class="al-contentTitle">' +
                                            (e.conference.conName.length>40? e.conference.conName.substring(0,38)+'...': e.conference.conName) +
                                            '</a>'+
                                            imgContent+
                                            '      <p class="al-contentOtherMsg">'+
                                            '      <span class="al-contentSeminarTime2"></span><span class="bytePlace">' + dateFormat(startTime,endTime) + '</span>'+
                                            '      <span class="al-contentSeminarPlace"></span>' + e.conference.country+(e.conference.country==""||e.conference.city==""?"":'&sdot;')+e.conference.city +
                                            '  </p>'+
                                            '  </article>'+
                                            '  </section>';
                                    })

                                    $('#ev_allMeeting').append(html);

                                    if (item.length < 10) {
                                        $('#ev_allMeeting').addClass('noMoreMeeting');
                                    }
                                } else if (data.responseObject.responseData.data_list.length == 0) {
                                    $('#ev_allMeeting').addClass('noMoreMeeting');
                                }
                                $('#ev_allMeeting').removeClass('moreMeetingQuerying');

                            },
                            error: function () {
                                $('#ev_allMeeting').removeClass('moreMeetingQuerying');
                                comm.loading.hide();
                            }
                        });
                    }
                }
            });
        },
        randomChange:function(){
            var t=this;
            var html="";
            $('#ev_randomChange').on('click',function(){
                html="";
                if($(this).hasClass('ev_querying')){
                    return false;
                }else{
                    $(this).addClass('ev_querying');
                    comm.loading.show();
                    t.ajaxFn({
                        url: t.path.url,
                        param:{paramJson: $.toJSON({visitSiteId:2,recommendNum: t.config.queryTime,platformId:TempCache.getItem('department')||1,sessionCustomerId:TempCache.getItem('userId')||"" })},
                        fn:function(data) {
                            comm.loading.hide();
                            if (data && data.responseObject.responseData && data.responseObject.responseData.data_list.length) {
                                var reItem = data.responseObject.responseData.data_list[0];
                                var startTime, endTime;
                                $.each(reItem.conference, function (i, e) {
                                    startTime = (e.startTime && e.startTime != undefined && e.startTime != "" && !$.isEmptyObject(e.startTime)) ? (e.startTime).substring(0, 10).replace(/-/g, ".") : "";
                                    endTime = (e.endTime && e.endTime != undefined && e.endTime != "" && !$.isEmptyObject(e.endTime)) ? (e.endTime).substring(0, 10).replace(/-/g, ".") : "";
                                    if(i==0){
                                        html+= '  <section class="al-contentPartModule al-contentUpTitleDownImg">'+
                                            '      <article class="al-contentText">'+
                                            //'      <a href="/pages/conference/meeting-place.html?conId=' + e.conId + '&conName='+e.conName+'">' +
                                            '      <a href="/pages/conference/meeting_detail.html?conId=' + e.conId +'">' +
                                            (e.conName.length>40?e.conName.substring(0,38)+'...':e.conName) +
                                            ' </a>'+
                                            '  <figure class="al-contentSeminarImg">'+
                                            //'      <a href="/pages/conference/meeting-place.html?conId=' + e.conId + '&conName='+e.conName+'">'+
                                            '      <a href="/pages/conference/meeting_detail.html?conId=' + e.conId + '">'+
                                            '      <img src="' + e.conMainPicUrl+ '" alt="">'+
                                            //'      <i class="al-contentMeetingLiving">'+                //直播中
                                            //'      <img src="//img50.allinmd.cn/meeting/meeting2016/live.png" alt="">'+
                                            //'      </i>'+
                                            '      </a>'+
                                            '      </figure>'+
                                            '      <p class="al-contentOtherMsg">'+
                                            '      <span class="al-contentSeminarTime"></span><span class="bytePlace">' + dateFormat(startTime, endTime) + '</span>'+
                                            '      <span class="al-contentSeminarPlace"></span>' + e.country+ (e.country==""||e.city==""?"":'&sdot;')+e.city +
                                            '  </p>'+
                                            '  </article>'+
                                            '  </section>';
                                    }else{
                                        html +=    ' <section class="al-contentPartModule al-contentUpTitleDownImg">'+
                                            '      <article class="al-contentText">'+
                                            //'      <a href="/pages/conference/meeting-place.html?conId=' + e.conId + '&conName='+e.conName+'" class="al-contentTitle">' +
                                            '      <a href="/pages/conference/meeting_detail.html?conId=' + e.conId +'" class="al-contentTitle">' +
                                            (e.conName.length>40?e.conName.substring(0,38)+'...':e.conName) +
                                            '  </a>'+
                                            '  <p class="al-contentOtherMsg">'+
                                            '      <span class="al-contentSeminarTime"></span><span class="bytePlace">' +  dateFormat(startTime, endTime) + '</span>'+
                                            '      <span class="al-contentSeminarPlace"></span>' + e.country+ (e.country==""||e.city==""?"":'&sdot;')+e.city +
                                            '  </p>'+
                                            '  </article>'+
                                            '  </section>';
                                    }
                                });
                                $('#ev_recomMeeting').html(html);
                                $('#ev_randomChange').removeClass('ev_querying');
                                t.config.queryTime++;
                            }
                        },
                        error:function(){
                            $('#ev_randomChange').removeClass('ev_querying');
                            comm.loading.hide();
                        }
                    });
                }
            })

        },
        ajaxFn:function(obj){
            comm.loading.show();
            $.ajax({
                url: obj.url,
                data: obj.param,
                dataType:'json',
                type:'post',
                success:function(data){
                    comm.loading.hide();
                    if(data){
                        obj.fn(data);
                    }
                }
            })
        }
    };
    mobileMeetingIndex.init();
});
/*
 * 设置时间格式 如：2015.10.01-10.03
 * */
function dateFormat(date1,date2){//date1开始时间，date2结束时间
    var result;
    if(date1&&date2&&typeof date1=='string'&&typeof date2=='string') {
        var d1 = date1.substring(0, 10).replace(/-/g, '.');
        var d1Arr = d1.toString().split('.');
        var d2 = date2.substring(0, 10).replace(/-/g, '.');
        var d2Arr = d2.toString().split('.');
        if (parseInt(d2Arr[0]) > parseInt(d1Arr[0])) {//如果跨年
            result = d1 + '~' + d2;
        } else {//同一年
            if (parseInt(d2Arr[1]) > parseInt(d1Arr[1])) {//如果结束月份大于开始月份
                result = d1 + '~' + d2.substring(5, 10);
            } else {
                result = d1 + "~" + d2.substring(8, 10);
            }
        }
        return result;
    }else{
        return "";
    }
}
