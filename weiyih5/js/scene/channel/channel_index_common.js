/**
 * @name:  各个频道页的公共方法
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/1
 * @author: sunhaibin
 */

//左右滑动切换页面
var firstScreenAd = {//首页顶部tab栏切换时，广告功能
    bannerData:function(data,swiperOnOff){
        var t = this;
        var state = TempCache.getItem("auth")?JSON.parse(TempCache.getItem("auth")).state:0;
        var arr = data.responseObject.responseData.data_list[0];
        var html = "";
        if(swiperOnOff){
            if (arr.ad_profile_attachment && arr.ad_profile_attachment.length){
                t.adDelivery(arr.ad_profile_attachment[0]);
            }
            return false;
        }else{
            if (arr.ad_profile_attachment && arr.ad_profile_attachment.length) {
                $.each(arr.ad_profile_attachment, function(ind, elem) {
                    var _target="";
                    if(elem.linkUrl.lastIndexOf("m.medplus.net")>-1){
                        _target="target='_href'";
                    }
                    if(!TempCache.getItem("userId")&&elem.linkUrl.lastIndexOf("authInfo")>-1){//TODO:推广 V1用户去补全四证其他状态不显示此广告位

                    }else{
                        if(state!=2&&elem.linkUrl.lastIndexOf("authInfo")>-1){

                        }else{
                            html += ' <figure class="swiper-slide al-carouselBannerItem">' +
                                '<a href="' + elem.linkUrl + '" '+_target+' adId="'+elem.id+'">' +
                                '<img src="' + (/:/.test(elem.adAttUrl)?elem.adAttUrl:"https:"+elem.adAttUrl) + '" alt="'+elem.adAttName+'">' + //    alt="'+elem.adAttName+'"
                                '</a>' +
                                '</figure>';
                        }

                    }

                });
                $('.swiper-wrapper').html(html);
                var indexCarousel = new Swiper("#Ev-AlCarouselBanner", {
                    direction: 'horizontal',
                    loop: true,
                    autoplay: 3000,
                    speed: 500,
                    pagination: '.swiper-pagination',
                    autoplayDisableOnInteraction: false
                });
                //埋点
                $('.swiper-wrapper a').click(function(){//$('.swiper-slide-active')
                    var param=$(this).attr("href")+"$"+$(this).attr("adId");
                    comm.creatEvent({
                        triggerType:'广告位',
                        keyword:"广告位-轮播图(热门)-"+$(this).find('img').attr('alt'),
                        actionId:14,
                        param:param,
                        locationId:parseInt($('.swiper-slide-active').attr('data-swiper-slide-index'))+1,
                        refId:$(this).attr('href')
                    });
                });
            }
        }
    },
    adDelivery:function(data){
        var t = this;
        if(localStorage.getItem("indexAdDelivery")){
            return false;
        }else{
            var src = data.adAttUrl;
            var href = data.linkUrl;
            var adId = data.id;
            var param = href+"$"+adId;
            if(href.length>0||src.length>0){
                var adDeliveryTemplate = '<section class="al-ad-delivery" style="display: none;">'+
                    '    <section class="al-ad-delivery-details">'+
                    '        <section class="al-ad-delivery-close"></section>'+
                    '        <a class="al-ad-delivery-banner" href="javascript:;" target="_blank"></a>'+
                    '    </section>'+
                    '</section>';
                $(".al-ad-delivery").remove();
                $('.ev-guide').hide();
                $(".al-ad-delivery-small").remove();
                $(".al-footerBar").append('        <section class="al-ad-delivery-small" style="display: none;">'+
                    '            <a class="al-ad-delivery-small-banner" href="javascript:;" target="_blank"></a>'+
                    '            <section class="al-ad-delivery-small-close"></section>'+
                    '        </section>');
                $('body').append(
                    adDeliveryTemplate
                ).css({"overflow":"hidden"});
                if(href.length){
                    $(".al-ad-delivery-banner").attr({"href":href});
                    $(".al-ad-delivery-small-banner").attr({"href":href});
                }
                if(src.length){
                    var backgroundStyle = ':url("'+src+'") no-repeat center 50%;';
                    var backgroundSize = "cover;";
                    $(".al-ad-delivery-banner").attr({style:"background"+backgroundStyle+'background-size:'+backgroundSize});
                    $(".al-ad-delivery-small-banner").attr({style:"background"+backgroundStyle+'background-size:'+backgroundSize});
                }
                var showSmallAd = function(){
                    var container =$(".al-ad-delivery");
                    container.addClass("al-ad-delivery-small").find('.al-ad-delivery-details').addClass("al-ad-delivery-details-small");
                    $(".al-ad-delivery-small").fadeIn(1000);
                    $(".al-ad-delivery-small-close").off("touchend").on("touchend",function(e){
                        $('.ev-guide').show();
                        $(".al-ad-delivery-small").remove();
                        $(".al-ad-delivery").remove();
                        localStorage.setItem("indexAdDelivery",true);
                        e.stopPropagation();
                        return false;
                    }).on("touchstart",function(e){
                        e.stopPropagation();
                        comm.creatEvent({
                            async:false,
                            triggerType:"广告",
                            keyword:'弹窗广告-小屏关闭',
                            param:param,
                            locationId:adId,
                            actionId:11048
                        });
                    });
                    $(".al-ad-delivery-small-banner").on("mousedown",function(e){
                        clearTimeout(closeTimer);
                        e.stopPropagation();
                        var closeTimer =setTimeout(function(){
                            $(".al-ad-delivery-small-close").trigger("touchend");
                        },2000);
                        return false;
                    }).on("touchend",function(e){
                        e.stopPropagation();
                        comm.creatEvent({
                            async:false,
                            triggerType:"广告",
                            keyword:'弹窗广告-小屏图文点击',
                            param:param,
                            locationId:adId,
                            actionId:11047
                        });
                    });
                };
                $(".al-ad-delivery-close").off("click").on("click",function(e){
                    e.stopPropagation();
                    var isThis = $(this);
                    comm.creatEvent({
                        async:false,
                        triggerType:"广告",
                        keyword:'弹窗广告-关闭',
                        param:param,
                        locationId:adId,
                        actionId:11046
                    });
                    isThis.fadeOut(500,function(){
                        isThis.remove();
                    });
                    localStorage.setItem("indexBigAdDelivery",true);
                    $(".al-ad-delivery").css({"background":"none"});
                    $(".al-ad-delivery-banner").animate({"width":0,height:0},1000,function(){
                        showSmallAd();
                    });
                    $("body").css({"overflow":"auto"});
                });
                $(".al-ad-delivery-banner").on("touchend",function(){
                    clearTimeout(closeTimer);
                    comm.creatEvent({
                        async:false,
                        triggerType:"广告",
                        keyword:'弹窗广告-图文',
                        param:param,
                        locationId:adId,
                        actionId:11045
                    });
                    var closeTimer =setTimeout(function(){
                        localStorage.setItem("indexBigAdDelivery",true);
                        localStorage.setItem("indexAdDelivery",true);
                        $('.ev-guide').show();
                        $(".al-ad-delivery-small").remove();
                        $(".al-ad-delivery").remove();
                    },2000)

                });
                if(localStorage.getItem("indexBigAdDelivery")){
                    var container =$(".al-ad-delivery");
                    container.css({"background":"none"}).addClass("al-ad-delivery-small");
                    container.find('.al-ad-delivery-close').hide();
                    container.find('.al-ad-delivery-details').addClass("al-ad-delivery-details-small");
                    container.find('.al-ad-delivery-banner').hide();
                    container.show();
                    showSmallAd();
                    $("body").css({"overflow":"auto"});
                }else{
                    $(".al-ad-delivery").show();
                }
            }else{
                return false;
            }
        }
    },
    bannerLoad:function(swiperOnOff){
        var t = this;
        //comm.loading.show();
        //先加载本地缓存数据，请求结束后替换
        if(TempCache.getItem('firstScreenData')){
            var _tempData = JSON.parse(TempCache.getItem('firstScreenData'));
            var _tempItem = _tempData.bannerData;
            _tempItem&&t.bannerData(_tempItem);
        }
        var jsonData = {
            firstResult: 0,
            maxResult: 10,
            visitSiteId: 2, //pc 1  h52
            channelId: 83, //channelId:''//107-病例 105-视频 106-文库 114-话题  83-首页
            isIndex: 1, //是否是首页,首页传1，频道页不传值,
            platformId:1,
            customerId:TempCache.getItem('userId')
        };
        jsonData.positionId = 580;      //是否是首页,首页传1，频道页不传值
        var params = {
            paramJson: $.toJSON(
                jsonData
            )
        };
        var callback = function(data) {
            if (data && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                t.bannerData(data,swiperOnOff);
            }else{
                $(".al-ad-delivery").remove();
                $('.ev-guide').show();
                $(".al-ad-delivery-small").remove();
            }
        };
        comm.ajax.async(M_CALL + 'ad/position/profile/getMapList/', params, callback);
    }
};
firstScreenAd.bannerLoad(true);
function changePage() {
    //var ind = $('.al-indexNavbar li.active').index();
    //$('body').not(".swiper-container").swipe({
    //    swipeRight: function(e) {
    //
    //        if ($(e.target) == $('.swiper-container') || $(e.target).parents().is('.swiper-container')) {
    //            return false;
    //        } else {
    //            if (ind > 0 && ind <= 5) {
    //                ind--;
    //                window.location.href = $('.al-indexNavbar li').eq(ind).find('a').attr('href');
    //            }
    //        }
    //    },
    //    swipeLeft: function(e) {
    //
    //        if ($(e.target) == $('.swiper-container') || $(e.target).parents().is('.swiper-container')) {
    //            return false;
    //        } else {
    //            if (ind >= 0 && ind < 5) {
    //                ind++;
    //                window.location.href = $('.al-indexNavbar li').eq(ind).find('a').attr('href');
    //            }
    //        }
    //    }
    //})
}
//新消息提醒
function newMessageTip(text) {
    var t = '<figure class="al-newActive show">' +
        '<span>新增' + text + '，<strong>点此查看</strong></span>' +
        '</figure> ';
    $('.al-indexNavbar').append(t);
    $('.al-newActive.show').on('click', function(e) {
        g_sps.jump(null,location.href);
        e.preventDefault();
        e.stopPropagation();
    });
};
//不喜欢按钮
function dislikeAction() {
    $(".al-contentDelete").on("click", function() {
        var cid = TempCache.getItem('userId');
        $("body").bind('touchmove',function(e){
            e.preventDefault();
        });
        var self = $(this);
        var isWholeLine = $(this).parents('.al-contentOtherMsg').width()>$(window).width()*0.8;
        var pL = $(this).offset().left;
        var pT = $(this).offset().top - $(window).scrollTop();
        var itemId =self.attr('itemId');
        var itemType=self.attr('itemType');
        var cancelHtml = ' <section class="al-cancelModal">' +
            '<figure class="al-cancelModalItem '+(isWholeLine?"":"interested")+'">' +
            '<i></i>' +
            '<span>不感兴趣后，将减少此类推荐</span>' +
            '<a class="btn-primary ev_cancelSure">' +
            '确定' +
            '</a>' +
            '</figure>' +
            '</section>';

        $('body').append(cancelHtml);

        setTimeout(function() {
            $(".al-cancelModal").addClass('show');
        }, 100);
        if ($(window).height() - pT < 150) { //如果下方空间不足，上面显示
            $('.al-cancelModalItem').css({ top: pT - 150 });
            //$('.al-cancelModalItem i').css({ left: pL - 10, top: $('.al-cancelModalItem').height(), borderColor: '#fff transparent transparent transparent' });
        } else {
            $('.al-cancelModalItem').css({ top: pT + 50 });
            //$('.al-cancelModalItem i').css({ left: pL - 10 });
        }

        $(".ev_cancelSure").on("click", function(event) {
            if(cid!=undefined&&cid!=""){
                $.ajax({
                    url:M_CALL+"customer/recommendResourceItem/deleteByKey/",
                    type:"post",
                    data:{paramJson:$.toJSON({
                        customerId:TempCache.getItem('userId')!=null?TempCache.getItem('userId'):0,
                        itemType:itemType,
                        itemId:itemId,
                        visiteSiteId:2,
                        sessionCustomerId:TempCache.getItem("userId") || "",
                        platformId:TempCache.getItem('department')||1
                    })},
                    dataType:'json',
                    success:function(data){
                        if(data&&data.responseObject.responseStatus==true){
                            $(".al-cancelModal").remove();
                            self.parents('.al-contentPartModule').remove();
                        }
                    },
                    error:function(){
                        $(".al-cancelModal").remove();

                    }

                });
            }else{
                $(".al-cancelModal").remove();
                self.parents('.al-contentPartModule').remove();
            }
            $("body").unbind('touchmove');
            event.stopPropagation();
        });
        $(".al-cancelModal").not(".al-cancelModalItem").on("click", function(ev) {
            $(".al-cancelModal").removeClass('show');
            $("body").unbind('touchmove');
            setTimeout(function(){
                $(".al-cancelModal").remove();

            }, 200)
            
            ev.stopPropagation();
        });
        $(".al-cancelModalItem").on("click", function(event) {
            event.stopPropagation();
        });

    });
}

//固定导航

//关注标签
function tagFollow() {
    $('.al-tagFollowBtn').click(function() {
        var t = $(this);
        if ($(this).hasClass('al-tagHasFollowed')) { //
            return false;
        } else {
            //var customerId='';
            //var tagId ='';
            //var url='';
            //var params={};
            //var callback=function(){
            t.addClass('al-tagHasFollowed').html('已关注');
            //}
            //common.ajax.async(url,params,callback);
        }
    })
}
//首页，频道首页站点切换
(function(){
    var _platformId = TempCache.getItem('department')||1;
    if (_platformId==1) {
        $('.platformName').text('骨科').attr('data-platformId',1);
        $('.ev_switchPlatform li').eq(0).addClass('active').siblings().removeClass('active');
    } else if(_platformId==2) {
        $('.platformName').text('手外科').attr('data-platformId',2);
        $('.ev_switchPlatform li').eq(1).addClass('active').siblings().removeClass('active');
    }
    $('.platformChange').on('click',function(){
        $('.ev_switchPlatform').toggleClass('al-personalSelectorOn');
        comm.creatEvent({
            triggerType:'骨科&手外科切换',
            keyword:"骨科&手外科切换(切换按钮点击)",
            actionId:2
        });
    });
    $('.al-personalContributionSelectorItem').click(function(){
        var pId = $(this).attr('data-platformId');
        comm.creatEvent({
            triggerType:'骨科&手外科切换',
            keyword:pId==1?"骨科&手外科切换(骨科按钮点击)":"骨科&手外科切换(手外科按钮点击)",
            actionId:3
        });
        TempCache.setItem('department',pId);
        g_sps.jump(null,window.location.href);

    });
    $(document).on('click',function(e){
        if($('.ev_switchPlatform').hasClass('al-personalSelectorOn')){
            if(!($(e.target).hasClass('platformChange')||$(e.target).parents().hasClass('platformChange')||$(e.target).hasClass('ev_switchPlatform')||$(e.target).parents().hasClass('ev_switchPlatform'))){
                $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
                comm.creatEvent({
                    triggerType:'骨科&手外科切换(取消)',
                    keyword:"骨科&手外科切换(取消)",
                    actionId:3
                });
            }
        }
    });
    $('.ev_recBox').on('click','.al-tagsRecommend a',function(){
        comm.creatEvent({
            triggerType:'标签',
            trigger_name:"标签",
            keyword:$(this).attr('tagId'),
            actionId:79,
            async:false
        });
    });
    //搜索热区
    (function(){
        var t=this;
        var data={
            "pageIndex":1,
            "pageSize" : 2,
            groupByFlag:1,
            platformId:1
        };
        $.ajax({
            type : "post",
            url : M_CALL + "allsearch/searchHot/",
            data : data,
            dataType : "json",
            success : function(data){
                if(data.responseObject.responseStatus){
                    var xhrdata = data.responseObject.responseData.data_list;
                    var str="";
                    $.each(xhrdata,function(i,val){
                        if(i<=2){
                            str += htmlToString(xhrdata[i].keyWord)+" | ";
                        }
                    });
                    $(".searchCont .searchInput").html('<i></i>'+comm.getStrByteLen(str.substr(0,str.length-3),40)).click(function(){
                        comm.creatEvent({
                            triggerType:'搜索',
                            keyword:"搜索-首页",
                            actionId:8,
                            async:false
                        });
                        // window.location.href = '/pages/search/search.html';
                        localStorage.removeItem("searchOriginal");
                        localStorage.setItem("searchOriginal",window.location.href);
                        g_sps.jump(null,'/dist/search/search.html');
                    });

                }else{
                    $(".searchCont .searchInput").click(function(){
                        comm.creatEvent({
                            triggerType:'搜索',
                            keyword:"搜索-首页",
                            actionId:8,
                            async:false
                        });
                        localStorage.removeItem("searchOriginal");
                        localStorage.setItem("searchOriginal",window.location.href);
                        // window.location.href = '/pages/search/search.html';
                        g_sps.jump(null,'/dist/search/search.html');
                    });
                }
            },
            error:function(){}
        });
    })();
}());
$('.ev_recBox').on('click','.ev_operate',function(){
    var pageIndex=$(this).attr("index");
    comm.creatEvent({
        triggerType:'广告',
        locationId:pageIndex+"-"+($(this).prevAll('.ev_flow').length+1),
        keyword:$(this).find('.al-contentTitle').text(),
        actionId:62,
        pushMessageId:$(this).find('.al-contentDelete').attr('itemId')?$(this).find('.al-contentDelete').attr('itemId'):'',
        refType:$(this).attr('itemType'),
        refId:$(this).find('.al-contentDelete').attr('itemId')?$(this).find('.al-contentDelete').attr('itemId'):""
    });
});
$('.ev_recBox').on('click','.al-tagsRecommendItem',function(){
    comm.creatEvent({
        triggerType:'广告',
        keyword:$(this).find('a').text(),
        actionId:62,
        pushMessageId:$(this).find('a').attr('tagId'),
        refId:$(this).find('a').attr('tagId')
    });
});
$('.ev_recBox').on('click','.al-doctorRecommendItem',function(){
    comm.creatEvent({
        triggerType:'广告',
        keyword:$(this).find('.al-doctorRecommendName').text(),
        actionId:62,
        pushMessageId:$(this).find('.ev_foll').attr('cId'),
        refId:$(this).find('.ev_foll').attr('cId')
    });
});
