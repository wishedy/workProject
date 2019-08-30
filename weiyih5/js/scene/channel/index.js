/**
 * @name:
 * @desc:
 * @example:
 * @depend:
 * @date: 2016/8/1
 * @author: sunhaibin
 */
$(function() {
    //comm.appWakeUp();//下载app层

    //弹层2017/12/06
    //if(TempCache.getItem('tagHide') == 'true'){
    //    $('.promptPopup').attr('style','display:none');
    //}

    //window.onload = Log.createBrowse(35, "首页热门推荐页面"); //    浏览日志
    comm.footerNav();
    comm.isLiveState();
    var controller = {
        opt: {
            clickNum: 0,
            tagNum: 0,
            doctorNum: 0,
            topNpage: 0,
            cid: TempCache.getItem("userId"),
            jsonData:{}
        },
        path: {
            bannerUrl: M_CALL + 'ad/position/profile/getMapList/',
            dynamicEntryUrl: M_CALL + 'navigation/scheduling/json_list/', //动态入口
            getRecomResUrl: M_CALL + "customer/recommendResourceItem/json_list/", //获取推荐数据
            getRecommendDoctor: M_CALL + "recommend/customer/first/json_list3/", //推荐医师
            getRecommendTag: M_CALL + 'recommend/customer/tag/json_list/', //推荐标签
            createTagFollow: M_CALL + 'customer/follow/resource/create/', //标签关注
            topNList: M_CALL + "cms/resource/json_list/" //推荐专题，活动，专辑等
        },
        params: {
            customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "", //1399533638818,//1434505803474 ,//    用户ID
            pageIndex: 1,
            pageSize: 10,
            scene: 10, //场景（首页传10）    新增10 -  首页11 -  朋友圈12 -  个人主页13 -  发现
            sessionCustomerId:TempCache.getItem("userId") || "",
            platformId:TempCache.getItem('department')||1,
            flag:1,
            score:0
        },

        init: function() {
            var t = this;
            t.app();
            t.bannerLoad();
            //t.bannerLoad(false);
            t.dynamicEntry();
            t.getRecomRes();
            //左右滑动切换页面
            changePage();
            t.slideUp();
            t.backToTop();
            //关注标签
            tagFollow();
            t.scrollPage();
            t.shareLog();
            t.showRecommend();
        },
        app: function() {
            comm.appWakeUp('btn');
        },
        //分享日志
        shareLog: function() {
            shareAll({
                title: document.title,
                pic:'https://m.allinmd.cn/image/allin_logo.png',
                summary: '汇集海量手术视频、医学文献、病例讨论、会议回放资源。医生专业互动社区。',
                fnMessageSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 0,
                        refId: "",
                        isValid: 1,
                        shareSence: shareSenceConst.host,
                        shareChannel: 4,
                        shareContent: "唯医—医生互动社区，医学继续教育"
                    });
                },
                fnTimelineSuc: function() {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 0,
                        refId: "",
                        isValid: 1,
                        shareSence: shareSenceConst.host,
                        shareChannel: 5,
                        shareContent: "唯医—医生互动社区，医学继续教育"
                    });
                }
            }, true);
        },
        //banner加载
        bannerLoad: function() {
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
                platformId:TempCache.getItem('department')||1,
                customerId:TempCache.getItem('userId')
            };
            var params = {
                paramJson: $.toJSON(
                    jsonData
                )
            };
            var callback = function(data) {
                if (data && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.bannerData = data;
                    t.bannerData(data);
                }
            };
            comm.ajax.async(t.path.bannerUrl, params, callback);

        },
        bannerData:function(data){
            var t = this;
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

        },
        slideUp: function() {
            var _h = $('.al-indexHeader').outerHeight();
            $(window).on('scroll touchmove',function() {
                if ($(window).scrollTop() > _h) {
                    $('.al-indexHeader').stop().animate({ height: 0}, 100);
                    //$('.searchCont').stop().animate({height:0},100);
                    if($('.ev_switchPlatform').hasClass('al-personalSelectorOn')){
                        $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
                        comm.creatEvent({
                            triggerType:'骨科&手外科切换(取消)',
                            keyword:"骨科&手外科切换(取消)",
                            actionId:3
                        });
                    }

                } else {
                    $('.al-indexHeader').stop().animate({ height: _h}, 100);
                    //$('.searchCont').stop().animate({height:'1.12rem'},100);
                }
            });
        },
        //动态入口
        dynamicEntry: function() {
            var t = this;
            comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('firstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('firstScreenData'));
                var _tempItem = _tempData.entryData;
                _tempItem&&t.entryData(_tempItem);
            }
            var _cid = TempCache.getItem('userId')||"";
            var params = { paramJson: $.toJSON({ navigationType: 2, visitSiteId: 2,sessionCustomerId:_cid,customerId:_cid, platformId:TempCache.getItem('department')||1 }) };
            var callback = function(data) {
                comm.loading.hide();
                if (data && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.entryData = data;
                    t.entryData(data);
                }else{
                    $('.al-indexRecommend').remove();
                }
            };
            comm.ajax.async(t.path.dynamicEntryUrl, params, callback);
        },
        entryData:function(data){
            var arr = data.responseObject.responseData.data_list.slice(0, 8);
            var html = "";
            $.each(arr, function(i, ele) {
                html += ' <figure class="al-indexRecommendItem">' +
                '    <a href="' + ele.navigationPath + '">' +
                '    <img src="' + ele.navigationLogo + '" alt="">' +
                '    <figcaption class="al-indexRecommendItemTitle">' +
                '    <span>' + ele.navigationName + '</span>' +
                '    </figcaption>' +
                '    </a>' +
                '    </figure>';
            });
            $('.al-indexRecommend').html(html);
            $('.al-indexRecommend .al-indexRecommendItem').on('click',function(){
                var _key = $.trim($(this).text());
                comm.creatEvent({
                    triggerType:'动态入口',
                    keyword:_key,
                    actionId:63,
                    locationId:$(this).index(),
                    async:false
                });
            });

        },
        //加载推荐数据
        getRecomRes: function() {
            var t = this;
            //comm.loading.show();
            //先加载本地缓存数据，请求结束后替换
            if(TempCache.getItem('firstScreenData')){
                var _tempData = JSON.parse(TempCache.getItem('firstScreenData'));
                var _tempHtml = '',
                    _tempHtml2 = '';
                var _tempItem = _tempData.listData&&_tempData.listData.responseObject.responseData.data_list;
                var _tempItemLength = _tempItem?_tempItem.length:0;
                var _tempTagList = _tempData.listData&&_tempData.listData.responseObject.responseData.tag_list;
                if (_tempTagList&&_tempTagList.length) {
                    _tempHtml = t.eachQueryDom(_tempItem, _tempTagList);
                } else if(_tempItemLength){
                    $.each(_tempItem, function(eit, eleit) {
                        _tempHtml2 = t.singleDom(eleit);
                        _tempHtml += _tempHtml2;
                    });
                }
                $('.ev_recBox').html(_tempHtml);
            }
            var _paramJson = { paramJson: $.toJSON(t.params) };
            var _callback = function(data) {
                //comm.loading.hide();
                if (data && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                    t.opt.jsonData.listData = data;
                    TempCache.setItem('firstScreenData',JSON.stringify(t.opt.jsonData));
                    var html = '',
                        _html = '';
                    var item = data.responseObject.responseData.data_list;
                    var itemLength = item.length;
                    var tagList = data.responseObject.responseData.tag_list;
                    var scoreList = data.responseObject.responseData.score_list;
                    if(scoreList&&scoreList[0]){
                        for(var _i in scoreList[0]){
                            if(_i==1){
                                t.params.score = scoreList[0][1];
                                break;
                            }
                        }
                    }
                    if (tagList.length) {
                        html = t.eachQueryDom(item, tagList);
                    } else {
                        $.each(item, function(ei, elei) {
                            _html = t.singleDom(elei);
                            html += _html;
                        });
                    }
                    $('.ev_recBox').html(html);
                    if (itemLength > 4) {
                        t.topNRec();
                    }
                    if (itemLength > 7) {
                        t.tagRec();
                    }
                    //if (itemLength > 19) {
                    //    t.docRecList();
                    //}
                    t.addTagFollow();
                    dislikeAction();
                    t.setImgWidth();
                    if (item.length < t.params.pageSize) {
                        $('.ev_recBox').attr("scrollPagination", "disabled").append('<section class="listNoMore">~  没有更多了  ~</section>')
                    }
                }
            };
            comm.ajax.async(t.path.getRecomResUrl, _paramJson, _callback);

        },
        eachQueryDom: function(item, tagList) {
            var t = this;
            var html = '',
                _html0 = "",
                _html1 = "",
                _html2 = "",
                _html11_13 = "";
            var isFollowed = false;
            if (tagList[0].state == 1) {
                isFollowed = true;
            }
            $.each(item, function(_ei, _elei) {
                if (_ei < 10) {
                    _html0 += t.singleDom(_elei);
                } else if (_ei >= 10 && _ei < 13) {
                    _html1 += t.singleDom(_elei);

                } else if (_ei >= 13) {
                    _html2 += t.singleDom(_elei);
                }
                _html11_13 = '  <section class="al-content al-tagPart">' +
                    '      <section class="al-contentTagHeader">' +
                    '          <a href="javascript:void(0)">' +
                    '              <article class="al-contentTagHeaderText">' +
                    '                  <h2 class="al-contentHeaderIcon">' +
                    '<span>' + tagList[0].propertyName + '</span>' +
                    '                      <span href="javascript:void(0)" class="al-tagFollowBtn ' + (isFollowed == true ? 'al-tagHasFollowed' : '') + '" tagId="' + tagList[0].propertyId + '">' + (isFollowed == true ? '已关注' : '关注') + '</span>' +
                    '                  </h2>' +
                    '              </article>' +
                    '          </a>' +
                    '      </section>' +
                    _html1 +
                    '  </section>';
            });
            html += _html0 + _html11_13 + _html2;
            return html;
        },
        singleDom: function(elei,ev_operate) {
            var attLength = elei.picNum;
            var attUrl = '';
            if (attLength != 0) {
                attUrl = elei.picUrl.split('|');
                for(var i= 0,l=attUrl.length;i<l;i++){
                    if(attUrl[i].indexOf('http')==-1){
                        attUrl.splice(i,1);
                    }
                }
                attLength = attUrl.length;
            }
            var _html = module.indexListTem.list({
                refType: elei.itemType,
                resUrl: elei.itemUrl,
                resName: elei.itemTitle,
                resDesc: elei.itemAbstract,
                isAward: elei.isAward,
                isAttend: elei.isAttend,
                isNew: elei.isNew,
                isHot: elei.isHot,
                tplPath: elei.tplPath,
                resAuthor: elei.ownerName,
                resWatchCount: elei.browseNum.toWK(),
                attUrl: attUrl,
                attLength: attLength,
                id: elei.itemId,
                playTime: elei.playTime?elei.playTime.substring(0,8):"",
                videoType:elei.videoType,
                score:elei.currentStarLevel,
                scoreNum:elei.currentScoreNum,
                ev_operate:ev_operate,
                isShowActivityTag:elei.isShowActivityTag,
                activityTagName:elei.activityTagName,
                activityTagColor:elei.activityTagColor
            });
            return _html;
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
        //回到顶部
        backToTop: function() {
            var t = this;
            var scrollTop = 0;
            $(window).scroll(function() {
                scrollTop = $(window).scrollTop();
                if (scrollTop > 100) {
                    $('.al-footerBarItemBackToTop').show();

                } else {
                    $('.al-footerBarItemBackToTop').hide();
                }
            });
            $('.al-footerBarItemBackToTop').on('click', function(e) {
                if (t.opt.clickNum == 1) {
                  g_sps.jump(null,location.href);
                } else {
                    t.opt.clickNum = 1;
                    setTimeout(function() {
                        t.opt.clickNum = 0;
                        $('html,body').stop().animate({ scrollTop: 0 }, 300);
                    }, 500);
                    e.preventDefault();
                    return false;
                }

            });

        },
        //标签加关注
        addTagFollow: function() {
            var t = this;
            $('.al-tagFollowBtn').each(function(i, e) {
                $(e).on('click', function() {
                    var self = $(this);
                    if (self.hasClass('al-tagHasFollowed')) {
                        return false;
                    } else {
                        user.privExecute({
                            operateType: 'login',
                            callback: function() {
                                comm.creatEvent({
                                    triggerType:'关注',
                                    keyword:"关注(标签)",
                                    actionId:7
                                });
                                t.createTagFollow(self);
                            }
                        });
                    }
                });
            })

        },
        createTagFollow: function(that) {
            var t = this;
            var params = {
                paramJson: $.toJSON({
                    followType: 61,
                    customerId: TempCache.getItem('userId'),
                    refId: that.attr('tagId'),
                    refName: $.trim(that.prev('span').text()),
                    platformId:TempCache.getItem('department')||1
                })
            };
            $.ajax({
                url: t.path.createTagFollow,
                type: "post",
                data: params,
                dataType: 'json',
                success: function(d) {
                    if (d && d.responseObject.responseStatus == true) {
                        that.text('已关注').addClass('al-tagHasFollowed');
                    }
                }
            });
        },
        tagRec: function() {
            var t = this;
            var cid = t.opt.cid;
            var _params = {
                paramJson: $.toJSON({
                    customerId: cid != null ? cid : "",
                    pageIndex: t.opt.tagNum + 1,
                    pageSize: 12,
                    scene: 10,
                    flag:1,
                    score:t.tagRecScore?t.tagRecScore:0,
                    sessionCustomerId:TempCache.getItem("userId") || "",
                    platformId:TempCache.getItem('department')||1
                })
            };

            var _callback = function(q) {
                if (q && q.responseObject.responseData && !$.isEmptyObject(q.responseObject.responseData) && q.responseObject.responseData.data_list) {
                    var item = q.responseObject.responseData.data_list;
                    var html = "",
                        html2 = "";
                    $.each(item, function(i, e) {
                        if (i < 6) {
                            html += '<li class="al-tagsRecommendItem"><a href="/pages/discover/discover_tagSubject.html?tId=' + e.propertyId + '" tagId="' + e.propertyId + '">' + comm.getStrLen(e.propertyName, 18) + '</a></li>';
                        } else if (i >= 6) {
                            html2 += '<li class="al-tagsRecommendItem"><a href="/pages/discover/discover_tagSubject.html?tId=' + e.propertyId + '" tagId="' + e.propertyId + '">' + comm.getStrLen(e.propertyName, 18) + '</a></li>';
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
            var _params = {
                paramJson: $.toJSON({
                    customerId: cid != null ? cid : "",
                    pageIndex: t.opt.doctorNum + 1,
                    pageSize: 3,
                    scene: 10,
                    flag:1,
                    score:t.docRecScore?t.docRecScore:0,
                    sessionCustomerId:TempCache.getItem("userId") || "",
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
                    $(docDom).insertAfter($('.ev_flow').eq(19 + t.opt.doctorNum * 15));
                    $('.ev_foll').each(function() {
                        if ($(this).find('a').length == 0) {
                            $(this).follow({
                                fId: $(this).attr('cid'),
                                fStatus: $(this).attr('fStatus'),
                                canToggle: false,
                                picStyle: 1
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
        topNRec: function() {
            var t = this;
            $.ajax({
                url: t.path.topNList,
                type: "post",
                data: {
                    paramJson: $.toJSON({
                        channelId: 0,
                        pageIndex: (t.opt.topNpage + 1),
                        pageSize: 2,
                        sessionCustomerId:TempCache.getItem('userId')||"",
                        customerId:TempCache.getItem('userId')||"" ,
                        platformId:TempCache.getItem('department')||1
                    }) }, //(t.opt.topNpage+1)
                dataType: 'json',
                success: function(d) {
                    if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                        var item = d.responseObject.responseData.data_list;
                        $.each(item, function(i, el) {
                            if (el.data_list.length > 0) {
                                var _el = el.data_list;
                                if (el.itemType == 15) { //top5榜单
                                    var topHtml = '';
                                    var attUrl;
                                    var topDom = '';
                                    $.each(_el, function(j, jl) {
                                        attUrl = jl.picUrl.split('|')[0];
                                        //attUrl
                                        topHtml += module.indexListTem.topNList({
                                            attUrl: attUrl,
                                            resUrl: jl.itemUrl,
                                            resName: jl.itemTitle,
                                            resDesc: jl.itemTitle,
                                            itemType:el.itemType
                                        });
                                    })
                                    topDom = '<section class="al-videoAlbumRank al-content">' +
                                        '<h2 class="al-contentMainTitle">' + el.itemName + '</h2>' +
                                        '<section class="al-videoAlbumRank">' +
                                        topHtml +
                                        '</section></section>';
                                    //$('.ev_flow').eq((el.itemLocation - 2) + t.opt.topNpage * 20).after(topDom);
                                }
                                if (el.itemType == 16 || el.itemType == 14) { //专题16 ,广告14
                                    var speHtml = "";
                                    $.each(_el, function(spi, spl) {
                                        speHtml += module.indexListTem.special({
                                            resUrl: spl.itemUrl,
                                            attUrl: spl.picUrl.split('|')[0],
                                            resName: spl.itemTitle,
                                            itemType: el.itemType,
                                            index:t.opt.topNpage + 1
                                        });
                                    });
                                }
                                if (el.itemType == 12) { //活动
                                    var actHtml = "";
                                    $.each(_el, function(ai, al) {
                                        actHtml += module.indexListTem.activityList({
                                            resUrl: al.itemUrl,
                                            attUrl: al.picUrl.split('|')[0],
                                            resName: al.itemTitle,
                                            itemType: el.itemType,
                                            index:t.opt.topNpage + 1
                                        })
                                    });
                                }
                                if (el.itemType == 13) {
                                    var serHtml = "";
                                    var serDom = "";
                                    _el = _el.slice(0,9);
                                    $.each(_el, function(si, sl) {
                                        serHtml += module.indexListTem.tagVideoList({
                                            resUrl: sl.itemUrl,
                                            attUrl: sl.picUrl,
                                            playTime: sl.playTime,
                                            resName: sl.itemTitle,
                                            itemType: el.itemType
                                        })
                                    });
                                    serDom = '<section class="al-videoAlbum al-content">' +
                                        '      <h2 class="al-contentMainTitle">' + el.itemName + '</h2>' +
                                        serHtml +
                                        '</section>';
                                }
                                if (el.itemType == 1 || el.itemType == 2 || el.itemType == 4 || el.itemType == 7) {
                                    var _resHtml;
                                    if(el.data_list[0].tplPath==286){
                                        _resHtml = module.indexListTem.release({
                                            resUrl: el.data_list[0].itemUrl,
                                            attUrl: el.data_list[0].picUrl.split('|')[0],
                                            resName: el.data_list[0].itemTitle,
                                            itemType:el.itemType,
                                            index:t.opt.topNpage + 1
                                        });
                                    }else{
                                        _resHtml = t.singleDom(_el[0],'ev_operate');
                                        _resHtml = _resHtml.replace(/ev_flow/, ''); //去除ev_flow类，不占用推荐流位置
                                    }

                                }

                                if (el.itemType == 3) { //会议
                                    var meetHtml = "";
                                    $.each(_el, function(mi, ml) {
                                        meetHtml = module.indexListTem.meeting({
                                            itemId:ml.itemId,
                                            resUrl: ml.itemUrl,
                                            resName: ml.itemTitle,
                                            attUrl: ml.picUrl,
                                            startTime: ml.startTime,
                                            endTime: ml.endTime,
                                            place: ml.conLocation,
                                            itemType:el.itemType
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
                                //$('.ev_flow').eq(13+ t.opt.topNpage*20).after(TOP2);
                                t.TOP2 =TOP2;
                            }
                        })

                    }
                    t.opt.topNpage++;
                }

            });
        },
        scrollPage: function() {
            var t = this;
            var pagenumber = 2;
            var top = 200; //$('.ev_scrollPage').offset().top;
            $('.ev_recBox').scrollPagination({
                'contentPage': t.path.getRecomResUrl,
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
                        $(".ev_recBox").attr("scrollPagination", "disabled").append('<section class="listNoMore">~  没有更多了  ~</section>');
                        //alert("没有内容了");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev_recBox").attr("scrollPagination", "disabled").append('<section class="listNoMore">~  没有更多了  ~</section>');
                            //alert("没有内容了2");
                            return false;
                        } else {
                            var items = data.responseObject.responseData.data_list;
                            var itemsLength = items.length;
                            var tagList = data.responseObject.responseData.tag_list;
                            var scoreList = data.responseObject.responseData.score_list;
                            if(scoreList&&scoreList[0]){
                                for(var _i in scoreList[0]){
                                    if(_i==1){
                                        t.params.score = scoreList[0][1];
                                    }

                                }
                            }
                            var html = '',
                                _html = "";
                            if (tagList.length) {
                                html = t.eachQueryDom(items, tagList);
                            } else {
                                $.each(items, function(ei, elei) {
                                    _html = t.singleDom(elei);
                                    html += _html;
                                });
                            }
                            $('.ev_recBox').append(html);
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
                            t.addTagFollow();
                            dislikeAction();
                            t.setImgWidth();
                            if (items.length < t.params.pageSize) {
                                $(".ev_recBox").attr("scrollPagination", "disabled").append('<section class="listNoMore">~  没有更多了  ~</section>');
                                return false;
                            }
                        }
                    }
                }
            });
        },
        showRecommend:function(){
            //2017/12/06该注释首页弹层
            //if(TempCache.getItem('tagHide') !== 'true'){
            //    $('.promptPopup').attr('style','display:block');
            //}
            //$('.promptPopup p').off('click').on('click',function(){
            //    $('.promptPopup').attr('style','display:none');
            //    TempCache.setItem('tagHide','true');
                if(!TempCache.getItem('isFirst')){
                    $('.al-footerBarItem:nth-child(2) img').attr('style','display:none');
                    $('#bm').attr('style','display:block');

                    var animation = bodymovin.loadAnimation({
                        container: document.getElementById('bm'),
                        renderer: 'svg',
                        loop: 1,
                        autoplay: true,
                        path: '/js/scene/channel/discover.json'
                    });
                    animation.addEventListener('complete',function(){
                        $('#bm').attr('style','display:none');
                        $('.al-footerBarItem:nth-child(2) img').attr('style','display:block');
                    });
                    TempCache.setItem('isFirst','0');
                }else{
                    $('.al-footerBarItem:nth-child(2) img').attr('style','display:block');
                }
            //});
        }
    };
    controller.init();

});
