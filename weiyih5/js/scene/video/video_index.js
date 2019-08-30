/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/26
 * @author: sunhaibin
 */
$(function() {
    //window.onload = Log.createBrowse(17, "视频列表页面"); // 浏览日志
    comm.footerNav();
    comm.isLiveState();
    var ctrl = {
        opt: {
            tagNum: 0,
            doctorNum: 0,
            topNpage:0,
            cid: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",   //1399533638818
            jsonData:{}
        },
        path: {
            bannerUrl: M_CALL + 'ad/position/profile/getMapList/',
            dynamicEntryUrl: M_CALL + 'navigation/scheduling/json_list/', //动态入口
            getRes: M_CALL + "customer/recommendResourceItem/json_video/",
            getRecommendDoctor: M_CALL + "recommend/customer/first/json_list3/", //推荐医师
            getRecommendTag: M_CALL + 'recommend/customer/tag/json_list/', //推荐标签
            topNList:M_CALL+"cms/resource/json_list/"
        },
        params: {
            customerId: TempCache.getItem('userId')!=null?TempCache.getItem('userId'):"",   //1399533638818
            pageIndex: 1,
            pageSize: 10,
            scene: 10,
            platformId:TempCache.getItem('department')||1,
            flag:1,
            score:0
        },
        init: function() {
            var t = this;
            t.tagDom2 = "";
            t.TOP2="";
            t.app();
            t.bannerLoad();
            t.dynamicEntry();
            t.getRes();
            t.slideUp();

            //左右滑动切换页面
            changePage();
            t.scrollPage();
            t.backToTop();
            t.shareLog();
        },
        app:function(){
            comm.appWakeUp('btn');
        },
        //banner加载
        bannerLoad: function() {
            var t = this;
            //comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('videoFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('videoFirstScreenData'));
                var item = _tempData.bannerData;
                if(item){
                    t.bannerData(item);
				}else{
					$('.Ev-banner').html("");
                }
            }
            var params = {
                paramJson: $.toJSON({
                    firstResult: 0,
                    maxResult: 10,
                    visitSiteId: 2, //pc 1  h52
                    channelId: 105, //channelId:''//107-病例 105-视频 106-文库 114-话题  83-首页
                    isIndex: 1, //是否是首页,首页传1，频道页不传值,
                    platformId:TempCache.getItem('department')||1,
                    customerId:TempCache.getItem('userId')
                })
            };
            var callback = function(data) {
                if (comm.hasResponseData(data) && data.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.bannerData = data;
                    t.bannerData(data);
                }
            };
            comm.ajax.async(t.path.bannerUrl, params, callback);

        },
        bannerData:function(data){
            var state = TempCache.getItem("auth")?JSON.parse(TempCache.getItem("auth")).state:0;
            var arr = data.responseObject.responseData.data_list[0];
            var html = "";
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
                $('.Ev-banner').html(html);
                if(arr.ad_profile_attachment.length>1) {
                    var indexCarousel = new Swiper("#Ev-AlCarouselBanner", {
                        direction: 'horizontal',
                        loop: true,
                        autoplay: 3000,
                        speed: 500,
                        pagination: '.swiper-pagination',
                        autoplayDisableOnInteraction: false
                    });
                }
                //埋点
                $('.Ev-banner a').click(function(){
                    var param=$(this).attr("href")+"$"+$(this).attr("adId");
                    comm.creatEvent({
                        triggerType:'广告位',
                        keyword:"广告位-轮播图(热门)-"+$(this).find('img').attr('alt'),
                        actionId:14,
                        param:param,
                        locationId:parseInt($('.Ev-banner .swiper-slide-active').attr('data-swiper-slide-index'))+1,
                        refId:$(this).attr('href')
                    });
                });
            }
        },
        //分享日志
        shareLog:function(){
            shareAll({
                title:document.title,
                pic:'https:/image/allin_logo.png',
                summary:$('meta[name="keywords"]').attr('content'),
                fnMessageSuc:function(){
                    comm.shareLog({
                        shareType: "",
                        resourceId:"" ,
                        resourceType: 1,
                        refId: "",
                        isValid: 1,
                        shareSence:shareSenceConst.video_index,
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
                        shareSence:shareSenceConst.video_index,
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
            $(window).on('scroll touchmove',function(){
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
                    //$('.searchCont').stop().animate({height:0},100);
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
                    //$('.searchCont').stop().animate({height:'1.12rem'},100);
                }
            });
        },
        dynamicEntry:function(){ //navigationType 导航类型（1-全站导航，2-热门导航，3-发现页按，4-发现页活动专家，5-视频频道页，6-文库频道页，7-话题频道页，8-病例频道页）
            var t=this;
            comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('videoFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('videoFirstScreenData'));
                var item = _tempData.entryData;
                item&&t.entryData(item);
            }
            var html ="";
            var cid = TempCache.getItem('userId')||"";
            var params = {paramJson:$.toJSON({navigationType:5,visitSiteId:2,sessionCustomerId:cid,customerId:cid,platformId:TempCache.getItem('department')||1})};
            var callback=function(data){
                comm.loading.hide();
                if(comm.hasResponseData(data)){
                    t.opt.jsonData.entryData = data;
                    t.entryData(data);
                }else{
                    $('.Ev-downSlide').parent().remove();
                    $('.al-indexRecommend').remove();
                }
                $('.al-indexRecommendItem').click(function(){
                    comm.creatEvent({
                        triggerType:'动态入口',
                        keyword:$.trim($(this).text()),
                        actionId:63,
                        locationId:$(this).index(),
                        async:false
                    });
                });
                $('.downSlide').click(function(){//$('.swiper-slide-active')
                    comm.creatEvent({
                        triggerType:'动态入口',
                        actionId:63,
                        locationId:$(this).index()
                    });
                });
            };

            $.ajax({
                url:t.path.dynamicEntryUrl,
                type:"post",
                data:params,
                dataType:'json',
                success:callback
            });

        },
        entryData:function(data){
            if(data.responseObject.responseData.up_data_list.length){
                var arr=data.responseObject.responseData.up_data_list.slice(0,4);
                var _temp="";
                var _cName;
                switch(arr.length){
                    case 1:
                        _cName='oneItem';break;
                    case 2:
                        _cName='twoItem';break;
                    case 3:
                        _cName='threeItem';break;
                    case 4:
                        _cName='fourItem';break;
                }
                $.each(arr,function(i,ele){
                    _temp+=' <figure class="al-indexRecommendItem '+_cName+'">' +
                    '    <a href="' + ele.navigationPath + '">' +
                    '    <img src="' + ele.navigationLogo + '" alt="">' +
                    '    <figcaption class="al-indexRecommendItemTitle">' +
                    '    <span>' + ele.navigationName + '</span>' +
                    '    </figcaption>' +
                    '    </a>' +
                    '    </figure>';
                });
                $('.al-indexRecommend').html(_temp);
            }else{
                $('.al-indexRecommend').remove();
            }
            //第二个左右滑动动态入口
            if(data.responseObject.responseData.down_data_list.length){
                var _html2 = '';
                var _arr2 = data.responseObject.responseData.down_data_list;
                $.each(_arr2,function(i,ele){
                    _html2+='<section class="swiper-slide downSlide">'+
                    '    <a href="'+ele.navigationPath+'">'+
                    '        <img src="'+ele.navigationLogo+'" alt=""/>'+
                    '    </a>'+
                    '</section>';

                });
                $('.Ev-downSlide').html(_html2);
                //if($('.al-downSwiper .swiper-slide').length>2){
                var swiper = new Swiper('.al-downSwiper', {
                    slidesPerView: "auto",
                    freeMode:true
                });
                //}
            }else{
                $('.Ev-downSlide').parent().remove();
            }

        },
        noMoreDom:function(){
            return '<section class="listNoMore">~  没有更多了  ~</section>';
        },
        getRes: function() {
            var t = this;
            //comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('videoFirstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('videoFirstScreenData'));
                var item = _tempData.listData&&_tempData.listData.responseObject.responseData.data_list;
                t.listDataDispose(item);
            }
            var _params = { paramJson: $.toJSON(t.params) };
            var _callback = function(data) {
                //comm.loading.hide();
                if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.listData = data;
                    TempCache.setItem('videoFirstScreenData',JSON.stringify(t.opt.jsonData));
                    var item = data.responseObject.responseData.data_list;
                    var scoreList = data.responseObject.responseData.score_list;
                    if(scoreList&&scoreList[0]){
                        for(var _i in scoreList[0]){
                            if(_i==1){
                                t.params.score = scoreList[0][1];
                            }
                        }
                    }
                    t.listDataDispose(item);
                    var itemLength = item.length;
                    if(itemLength<t.params.pageSize){
                        $('.ev_videoBox').attr('scrollPagination','disabled').append(t.noMoreDom());
                    }
                    if(itemLength>4){
                        t.topNRec();
                    }
                    if(itemLength>7){
                        t.tagRec();
                    }
                    t.setImgWidth();
                    dislikeAction();
                }
            };
            comm.ajax.async(t.path.getRes, _params, _callback);
        },
        listDataDispose:function(item){
            var html = '';
            var _temp = "";
            var attLength = 0;
            var attUrl = [];
            $.each(item, function(i, me) {
                attLength = me.picNum;
                if (attLength > 0) {
                    attUrl = me.picUrl.split('|');
                    for(var i= 0,l=attUrl.length;i<l;i++){
                        if(attUrl[i].indexOf('http')==-1){
                            attUrl.splice(i,1);
                        }
                    }
                    attLength = attUrl.length;
                }
                _temp = module.indexListTem.list({
                    refType: me.itemType,
                    resUrl: me.itemUrl,
                    resName: me.itemTitle,
                    resDesc: me.itemAbstract,
                    isAward: me.isAward,
                    isAttend: me.isAttend,
                    isNew: me.isNew,
                    isHot: me.isHot,
                    id:me.itemId,
                    tplPath: me.tplPath,
                    resAuthor: me.ownerName,
                    resWatchCount: me.browseNum,
                    playTime: me.playTime,
                    attLength: attLength,
                    attUrl: attUrl,
                    videoType:me.videoType,
                    score:me.currentStarLevel,
                    scoreNum:me.currentScoreNum,
                    isShowActivityTag:me.isShowActivityTag,
                    activityTagName:me.activityTagName,
                    activityTagColor:me.activityTagColor
                });
                html += _temp;
            });
            $('.ev_videoBox').html(html);
        },
        topNRec:function(){
            var t=this;
            $.ajax({
                url: t.path.topNList,
                type:"post",
                data:{paramJson: $.toJSON({channelId:1,pageIndex:(t.opt.topNpage+1),pageSize:2,sessionCustomerId:TempCache.getItem('userId')||"",platformId:TempCache.getItem('department')||1 })},
                dataType:'json',
                success:function(d){
                    if(d&& d.responseObject.responseData&&!$.isEmptyObject(d.responseObject.responseData)&& d.responseObject.responseData.data_list.length){
                        var item = d.responseObject.responseData.data_list;
                        $.each(item,function(i,el){
                            if(el.data_list.length>0){
                                var _el = el.data_list;
                                if(el.itemType==15){//top5榜单
                                    var topHtml='';
                                    var attUrl;
                                    var topDom='';
                                    $.each(_el,function(j,jl){
                                        attUrl=jl.picUrl.split('|')[0];
                                        //attUrl
                                        topHtml+=module.indexListTem.topNList({
                                            attUrl:attUrl,
                                            resUrl:jl.itemUrl,
                                            resName:jl.itemTitle,
                                            resDesc:jl.itemTitle
                                        });
                                    });
                                    topDom ='<section class="al-videoAlbumRank al-content">'+
                                        '<h2 class="al-contentMainTitle">'+el.itemName+'</h2>'+
                                        '<section class="al-videoAlbumRank">'+
                                        topHtml+
                                        '</section></section>';

                                }
                                if(el.itemType==16||el.itemType==14){    //专题16 ,广告14
                                    var speHtml="";
                                    $.each(_el,function(spi,spl){
                                        speHtml+=module.indexListTem.special({
                                            resUrl:spl.itemUrl,
                                            attUrl:spl.picUrl.split('|')[0],
                                            resName:spl.itemTitle
                                        });
                                    });

                                }
                                if(el.itemType==12){//活动
                                    var actHtml ="";
                                    $.each(_el,function(ai,al){
                                        actHtml+= module.indexListTem.activityList({
                                            resUrl:al.itemUrl,
                                            attUrl:al.picUrl.split('|')[0],
                                            resName:al.itemTitle
                                        })
                                    });

                                }
                                if(el.itemType==13){
                                    var serHtml="";
                                    var serDom="";
                                    _el = _el.slice(0,9);
                                    $.each(_el,function(si,sl){
                                        serHtml+=module.indexListTem.tagVideoList({
                                            resUrl:sl.itemUrl,
                                            attUrl:sl.picUrl,
                                            playTime:sl.playTime,
                                            resName:sl.itemTitle,
                                            itemType:sl.itemType
                                        })
                                    });
                                    serDom = '<section class="al-videoAlbum al-content">'+
                                        '      <h2 class="al-contentMainTitle">'+el.itemName+'</h2>'+
                                        serHtml+
                                        '</section>';

                                }
                                if(el.itemType==1||el.itemType==2||el.itemType==4||el.itemType==7){
                                    var _resHtml ="";
                                    $.each(_el,function(rei,rel) {

                                        var _attLength = rel.picNum;
                                        var _attUrl = "";
                                        if (_attLength != 0) {
                                            _attUrl = rel.picUrl.split('|');
                                            for(var i= 0,l=_attUrl.length;i<l;i++){
                                                if(_attUrl[i].indexOf('http')==-1){
                                                    _attUrl.splice(i,1);
                                                }
                                            }
                                            _attLength = _attUrl.length;
                                        }
                                        if(rel.tplPath==286){
                                            var _temHtm = module.indexListTem.release({
                                                resUrl: rel.itemUrl,
                                                attUrl: _attUrl!=""?_attUrl:"",
                                                resName: rel.itemTitle
                                            });
                                        }else {
                                            var _temHtm = module.indexListTem.list({
                                                refType: rel.itemType,
                                                resUrl: rel.itemUrl,
                                                resName: rel.itemTitle,
                                                resDesc: rel.itemAbstract,
                                                isAward: 0,
                                                isAttend: 0,
                                                isNew: 0,
                                                tplPath: rel.tplPath,
                                                resAuthor: rel.ownerName,
                                                resWatchCount: rel.browseNum.toWK(),
                                                attUrl: _attUrl,
                                                attLength: _attLength,
                                                id: rel.itemId,
                                                playTime: rel.playTime,
                                                score:rel.currentStarLevel,
                                                scoreNum:rel.currentScoreNum
                                            });
                                        }
                                        _resHtml += _temHtm;
                                    });
                                    _resHtml =_resHtml.replace(/ev_flow/,'');   //去除ev_flow类，不占用推荐流位置
                                }
                                if(el.itemType==3){//会议
                                    var meetHtml="";
                                    $.each(_el,function(mi,ml){
                                        meetHtml=module.indexListTem.meeting({
                                            itemId:ml.itemId,
                                            resUrl:ml.itemUrl,
                                            resName:ml.itemTitle,
                                            attUrl:ml.picUrl,
                                            startTime:ml.startTime,
                                            endTime:ml.endTime,
                                            place:ml.conLocation
                                        });
                                    });

                                }
                                var TOP1="",TOP2="";
                                if(i==0){
                                    TOP1="";
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP1 = topDom;break;
                                        case 16:
                                        case 14:TOP1 =speHtml;break;
                                        case 12:TOP1 = actHtml;break;
                                        case 13:TOP1=serDom;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP1=_resHtml;break;
                                        case 3:TOP1=meetHtml;break;

                                    }
                                }else if(i==1){
                                    TOP2="";
                                    switch(parseInt(el.itemType)){
                                        case 15:TOP2 = topDom;break;
                                        case 16:
                                        case 14:TOP2 =speHtml;break;
                                        case 12:TOP2 = actHtml;break;
                                        case 13:TOP2=serDom;break;
                                        case 1:
                                        case 2:
                                        case 4:
                                        case 7:TOP2=_resHtml;break;
                                        case 3:TOP2=meetHtml;break;
                                    }
                                }
                                $('.ev_flow').eq(3+ t.opt.topNpage*20).after(TOP1);

                                t.TOP2 = TOP2;
                            }
                        })

                    }
                    t.opt.topNpage++;
                }

            });
        },
        tagRec: function() {
            var t = this;
            var cid = t.opt.cid;
            var _params = {
                paramJson: $.toJSON({
                    customerId: cid != null ? cid : "",
                    pageIndex: t.opt.tagNum+1,
                    pageSize: 12,
                    scene: 10,
                    flag:1,
                    score:t.tagRecScore?t.tagRecScore:0,
                    platformId:TempCache.getItem('department')||1
                })
            };
            var _callback =function(q){
                if(q&& q.responseObject.responseData&&!$.isEmptyObject(q.responseObject.responseData)&&q.responseObject.responseData.data_list){
                    var item =q.responseObject.responseData.data_list;
                    var html="",html2="";
                    $.each(item,function(i,e){
                        if(i<6){
                            html+='<li class="al-tagsRecommendItem"><a href="/pages/discover/discover_tagSubject.html?tId='+ e.propertyId+'" tagId="'+ e.propertyId+'">'+ comm.getStrLen(e.propertyName,18)+'</a></li>';
                        }else if(i>=6){
                            html2+='<li class="al-tagsRecommendItem"><a href="/pages/discover/discover_tagSubject.html?tId='+ e.propertyId+'" tagId="'+ e.propertyId+'">'+ comm.getStrLen(e.propertyName,18)+'</a></li>';
                        }

                    });
                    var tagDom="",tagDom2="";
                    if(html!=""){
                        tagDom = ' <section class="al-content al-tagsRecommend">' +
                            '<h2 class="al-contentMainTitle al-contentHeaderIcon">标签推荐</h2>' +
                            '<ul>' +
                            html +
                            ' </ul><a class="al-allTags" href="/pages/discover/discover_tag.html">查看全部<i class="icon-circleArrowRight"></i></a></section>';
                        $('.ev_flow').eq(6 + t.opt.tagNum * 20).after(tagDom);
                    }
                    if(html2!=""){
                        tagDom2 = ' <section class="al-content al-tagsRecommend">' +
                            '<h2 class="al-contentMainTitle al-contentHeaderIcon">标签推荐</h2>' +
                            '<ul>' +
                            html2 +
                            ' </ul><a class="al-allTags" href="/pages/discover/discover_tag.html">查看全部<i class="icon-circleArrowRight"></i></a></section>';
                        //$('.ev_flow').eq(16 + t.opt.tagNum * 20).after(tagDom2);
                        t.tagDom2 =tagDom2;
                    }
                    var scoreList = q.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.tagRecScore=scoreList[0][i];
                            }
                        }
                    }
                }
                t.opt.tagNum++;
            };
            comm.ajax.async(t.path.getRecommendTag, _params, _callback);
        },
        //医师推荐列表
        docRecList: function() {
            var t = this;
            var cid = t.opt.cid;
            //var loginCallback=scene.indexLoginAndGetInfo().index_login;//点击关注 登录成功后回调
            //var indexOnClose =scene.indexLoginAndGetInfo().index_login;//取消登录回调
            var _params = {
                paramJson: $.toJSON({
                    customerId: cid != null ? cid : "",
                    pageIndex: t.opt.doctorNum + 1,
                    pageSize: 3,
                    scene: 10,
                    flag:1,
                    score:t.docRecScore?t.docRecScore:0,
                    platformId:TempCache.getItem('department')||1
                })
            };
            var callback = function(d) {
                if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list) {
                    var item = d.responseObject.responseData.data_list;
                    var arr = "";
                    var _temp = '';
                    $.each(item, function(ei, kv) {
                        _temp = module.indexListTem.doctorList({
                            cid: kv.customerId,
                            logoUrl: kv.logoUrl,
                            cName: kv.customerName,
                            cTitle: kv.medicalTitle,
                            company: kv.company,
                            relationship: kv.relationship
                        });
                        arr += _temp;
                    });
                    var docDom = '<section class="al-content al-doctorRecommend"><h2 class="al-contentMainTitle">推荐医师</h2>' + arr + '</section>';
                    $(docDom).insertAfter($('.al-contentPartModule').eq(19 + t.opt.doctorNum * 15));
                    $('.ev_foll').each(function(){
                        if($(this).find('a').length==0){
                            $(this).follow({
                                fId:$(this).attr('cid'),
                                fStatus:$(this).attr('fStatus'),
                                canToggle:false,
                                picStyle:1
                            });
                        }
                    });
                    var scoreList = d.responseObject.responseData.score_list;
                    if(scoreList&&scoreList.length>0){
                        for (var i in scoreList[0]){
                            if(i==1){
                                t.docRecScore=scoreList[0][i];
                            }
                        }
                    }
                    t.opt.doctorNum++;
                }
            };
            comm.ajax.async(t.path.getRecommendDoctor, _params, callback);
        },
        setImgWidth: function() {
            var rem = function(opx) {
                var px = parseInt(opx);
                return (px / 75) + 'rem';
            };
            $(".al-contentUpTitleDownImg .al-contentMiddleImg").each(function(index, element) {
                var ele = $(element).find('li');
                switch (ele.length) {
                    case 2:
                        ele.width(rem(270));
                        ele.height(rem(180));
                        break;
                }
            });
        },
        scrollPage: function() {
            var t = this;
            var pagenumber = 2;
            var f = t.params.firstResult;
            var m = t.params.maxResult;
            var top = 200; //$('.ev_scrollPage').offset().top;
            $('.ev_videoBox').scrollPagination({
                'contentPage': t.path.getRes,
                'contentData': $.extend(t.params, {
                    pageIndex: function() {
                        return pagenumber++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': $(window).height(), // it gonna request when scroll is 10 pixels before the page ends
                'delaytime': 0,
                'type': "post",
                'dataType': "json",
                'beforeLoad': function() {
                    comm.loading.show();
                },
                'afterLoad': function(elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function(data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev_videoBox").attr("scrollPagination", "disabled").append(t.noMoreDom());
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev_videoBox").attr("scrollPagination", "disabled").append(t.noMoreDom());
                            //alert("没有内容了2");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            var scoreList = data.responseObject.responseData.score_list;
                            if(scoreList&&scoreList[0]){
                                for(var _i in scoreList[0]){
                                    if(_i==1){
                                        t.params.score = scoreList[0][1];
                                    }
                                }
                            }
                            var itemsLength = items.length;
                            var html = '',
                                attUrl, attLength, _html, picUrl;
                            $.each(items, function(_ei, _elei) {
                                attLength = _elei.picNum;
                                if (attLength != 0) {
                                    attUrl = _elei.picUrl.split('|');
                                    for(var i= 0,l=attUrl.length;i<l;i++){
                                        if(attUrl[i].indexOf('http')==-1){
                                            attUrl.splice(i,1);
                                        }
                                    }
                                    attLength =attUrl.length;
                                }
                                _html = module.indexListTem.list({
                                    refType: _elei.itemType,
                                    resUrl: _elei.itemUrl,
                                    resName: _elei.itemTitle,
                                    resDesc: _elei.itemAbstract,
                                    isAward: _elei.isAward,
                                    isAttend: _elei.isAttend,
                                    isNew: _elei.isNew,
                                    isHot: _elei.isHot,
                                    tplPath: _elei.tplPath,
                                    resAuthor: _elei.ownerName,
                                    resWatchCount: _elei.browseNum.toWK(),
                                    attUrl: attUrl,
                                    attLength: attLength,
                                    id: _elei.itemId,
                                    playTime: _elei.playTime,
                                    score:_elei.currentStarLevel,
                                    scoreNum:_elei.currentScoreNum,
                                    isShowActivityTag:_elei.isShowActivityTag,
                                    activityTagName:_elei.activityTagName,
                                    activityTagColor:_elei.activityTagColor
                                });
                                html += _html;
                            });
                            $('.ev_videoBox').append(html);
                            if(pagenumber%2==0){
                                if(itemsLength>4){
                                    t.topNRec();
                                }
                                if(itemsLength>7){
                                    t.tagRec();
                                }
                            }else{
                                $('.ev_flow').eq(16+ (t.opt.tagNum-1)*20).after(t.tagDom2);
                                t.tagDom2="";
                                $('.ev_flow').eq(13+ (t.opt.topNpage-1)*20).after(t.TOP2);
                                t.TOP2="";
                                t.docRecList();
                            }
                            dislikeAction();
                            if (itemsLength < t.params.pageSize) {
                                $(".ev_videoBox").attr("scrollPagination", "disabled").append(t.noMoreDom());
                                //alert("没有内容了3");
                                return false;
                            }
                        }
                    }
                }
            });
        }
    };
    ctrl.init();
});
