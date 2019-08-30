/**
 * Created by ALLIN on 2016/11/22.
 */
$.getScript(window.paasFilePathObj.js,function() {
    $(function () {
        FastClick.attach(document.body);
        // Log.createBrowse(159, '书籍主页-简介Tab');
        setTimeout(function(){
            g_sps.createBrowse({pageId:423});
        },2200);

        var bookDetails = {
            path: {
                header: '/mcall/cms/doc/getMapByBookList/',
                article: '/mcall/cms/doc/getMapByDocList/',
                catalogue: '/mcall/cms/book/catalogue/getMapList/',
                share: '/mcall/comm/data/share/getMapList3/',    //分享话术
                collect:"/mcall/customer/collection/create/",         //收藏
                cancelCollect:"/mcall/customer/collection/delete/"    //取消收藏
            },
            init: function () {
                var t = this;
                t.params = comm.getpara();
                t.visitSiteId = 2;
                t.pageIndex = 1;
                t.pageSize = 6;
                t.docId = t.params.bId;
                t.bookId = t.params.bId;
                $('#resourceId').val(t.bookId);
                t.sortType = 18;    //为18按浏览数排序,为19按评论数排序,2默认排序
                t.getHeaderData();
                var w = $(window).width();
                var h = $(window).height() - $('.slide-wrapper').offset().top;
                $('.slide-content').width(w);
                // t.getArticleData();  //文章
                //t.getCatalogueData();
                t.bindOrder();
                t.backBtnClick();
                //t.getShareData();
                t.shareOp();
                t.reviewBox();
                t.style();
                t.eventTrack();
                t.collect();
                t.advertisement();
            },
            advertisement:function(){
                var t = this;
                console.log(refId);
                $.ajax({
                    url: '/mcall/medicalCollege/getBannerList/',
                    type: "post",
                    data: {
                        paramJson: $.toJSON(
                            {
                                "opUsr":TempCache.getItem("userId")!=""&&TempCache.getItem("userId")!=undefined?TempCache.getItem("userId"):"",
                                "resourceId":t.bookId,
                                "recommendType":6,
                                "resourceType":2,
                                "firstResult":0,
                                "maxResult":1,
                                'visitSiteId': 1
                            }
                        )
                    },
                    dataType: 'json',
                    success: function (d) {

                        if (d && d.responseObject && d.responseObject.responseData && d.responseObject.responseData.dataList && d.responseObject.responseData.dataList.length > 0) {
                            var item = d.responseObject.responseData.dataList[0];
                            $(".al-advertisement-video").remove();
                            $(".Ev-discussArea").before(`<section class='al-advertisement-video'><section class='al-advertisement-picture' style='background: url("${item.bannerUrl}") no-repeat center center/cover'></section></section>`);
                            $(".al-advertisement-video").off("click").on("click",function(){
                                console.log(comm.banner);
                                comm.banner.openBanner(item);
                            });
                            console.log(d.responseObject.responseData.dataList.length);
                        } else {

                        }
                    },
                    error: function () {

                    }
                });
            },
            eventTrack: function () {
                $(".al-terminalSortChangeItem").on("click", function () {
                    comm.creatEvent({
                        triggerType: '评论区排序',
                        trigger_name: "评论区排序",
                        keyword: $(this).text(),
                        actionId: 74
                    });
                });
            },
            style: function () {
                $(".al-personalContributionSelector").on("click", function () {
                    if ($(this).hasClass('al-personalSelectorOn')) {
                        $(this).removeClass('al-personalSelectorOn');
                    } else {
                        $(this).addClass('al-personalSelectorOn');
                    }
                });
                $(".al-personalContributionSelectorItem").on("click", function () {
                    $(this).addClass('active').siblings().removeClass('active');
                    $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                    $(".al-personalContributionSelector h2").text($(this).text());
                });
            },
            getCatalogueData: function () {
                var t = this;
                var param = {};
                param.bookId = t.bookId;
                param.pageSize = 10;
                t.param = param;
                t.catalogueIndex = 2;
                t.catalogueRequesting = false;
                var params_catalogue = {paramJson: $.toJSON(param)};
                comm.loading.show();
                comm.ajax.async(t.path.catalogue, params_catalogue, function (data) {
                    if (data && data.responseObject.responseData && data.responseObject.responseData.total_count) {
                        var total_count = data.responseObject.responseData.total_count;
                        $('figure[data-role="catalog"] span').text(total_count);
                    }
                    if (comm.hasResponseData(data)) {
                        var data_list = data.responseObject.responseData.data_list;
                        if (data_list.length > 0) {
                            t.loadCatalogue(data_list);
                            if (data_list.length < 10) {
                                $('.al-eBookCatalog').attr('dataMore', 'none');
                            }
                        } else {
                            $('.slide-content[data-role=catalog]').height($(window).height() - $('.slide-wrapper').offset().top);
                        }

                    } else {
                        $('.slide-content[data-role=catalog]').height($(window).height() - $('.slide-wrapper').offset().top);
                    }
                    comm.loading.hide();
                    (function () {
                        $(window).on('scroll', function () {
                            if ($(window).height() + $(window).scrollTop() >= $(document).height()) {
                                if (t.slideIndex == 1 && !$('.al-eBookCatalog').attr('dataMore')) {
                                    if (!t.catalogueRequesting) {
                                        t.catalogueRequesting = true;
                                        $.ajax({
                                            url: t.path.catalogue,
                                            data: {paramJson: $.toJSON($.extend({}, t.param, {pageIndex: t.catalogueIndex}))},
                                            dataType: 'json',
                                            async: false,
                                            type: 'post',
                                            success: function (res) {
                                                t.catalogueRequesting = false;
                                                if (comm.hasResponseData(res) && res.responseObject.responseData.data_list.length) {
                                                    var _list = res.responseObject.responseData.data_list;
                                                    if (_list.length < 10) {
                                                        $('.al-eBookCatalog').attr('dataMore', 'none');
                                                    }
                                                    t.catalogueIndex++;
                                                    t.loadCatalogue(_list);
                                                } else {
                                                    $('.al-eBookCatalog').attr('dataMore', 'none');
                                                }
                                            }
                                        });

                                    }
                                }
                            }
                        });
                    })();


                });
            },
            getArticleData: function () {
                var t = this;
                var data = {};
                data.pageIndex = t.pageIndex;
                data.pageSize = t.pageSize;
                data.bookId = t.bookId;
                data.visitSiteId = t.visitSiteId;
                data.scene = 1;
                data.sortType = t.sortType;
                t.data = data;
                var params_article = {paramJson: $.toJSON(data)};
                comm.loading.show();
                var w = $(window).width();
                var h = $(window).height() - $('.slide-wrapper').offset().top;
                $('.slide-content[data-role=article]').width(w).css("minHeight", h);
                comm.ajax.async(t.path.article, params_article, function (data) {
                    if (data && data.responseObject.responseData && data.responseObject.responseData.total_count) {
                        var total_count = data.responseObject.responseData.total_count;
                        $('figure[data-role="article"] span').text(total_count);
                        $('.al-personalContributionTitle .contributionNum').text(total_count);
                    }
                    if (comm.hasResponseData(data)) {
                        var data_list = data.responseObject.responseData.data_list;
                        if (data_list.length > 0) {
                            t.loadArticle(data_list);
                            h = $(window).height() - $('.slide-wrapper').offset().top;
                            $('.slide-content[data-role=article]').width(w).css("minHeight", h);
                        }
                        comm.slideTabs(function () {  //调用左右滑动Tab
                            t.scrollPage();
                            var aIndex = $('.slide-navbarItem.active').index();
                            t.slideIndex = aIndex;
                            if (aIndex == 0) {
                                // Log.createBrowse(160, '书籍主页-文章Tab');
                                setTimeout(function(){
                                    g_sps.createBrowse({pageId:425});
                                },2200);

                                $('.slide-wrapper').css({
                                    height: 'auto', minHeight: ''
                                });
                                $('.slide-wrapper').height($(".slide-content[data-role=article]").outerHeight());

                            } else if (aIndex == 1) {
                                // Log.createBrowse(161, '书籍主页-目录Tab');

                                setTimeout(function(){
                                    g_sps.createBrowse({pageId:426});
                                },2200);
                                $('.slide-wrapper').css({
                                    height: 'auto', minHeight: ''
                                });
                                $('.slide-wrapper').height($(".slide-content[data-role=catalog]").outerHeight());

                            } else {
                                // Log.createBrowse(162, '书籍主页-评论Tab');
                                setTimeout(function(){
                                    g_sps.createBrowse({pageId:427});
                                },2200);

                                $('.slide-wrapper').css({
                                    height: 'auto', minHeight: ''
                                });
                                $('.slide-wrapper').height($(".slide-content[data-role=comment]").outerHeight());
                            }
                        });
                        $(".slide-navbarItem").eq(1).click();
                        t.scrollPage();
                    }
                    comm.loading.hide();
                });
            },
            getHeaderData: function () {
                var t = this;
                var params_header = {
                    paramJson: $.toJSON({
                        docId: t.docId,
                        visitSiteId: t.visitSiteId,
                        pageIndex: t.pageIndex,
                        pageSize: t.pageSize,
                        scene: 14,
                        sessionCustomerId:TempCache.getItem('userId') || ""
                    })
                };
                comm.loading.show();
                comm.ajax.async(t.path.header, params_header, function (data) {
                    //console.log(data);
                    if (comm.hasResponseData(data)) {
                        var data_list = data.responseObject.responseData.data_list;
                        if (data_list.length > 0) {
                            t.loadBookHeader(data_list[0]);
                        }
                        // t.getCatalogueData();
                    }
                    comm.loading.hide();
                });
            },
            loadBookHeader: function (ev) {
                var t = this;
                var html = '',reviewNum = '',docAbstract = '',shrink = '',picUrl = '';
                    t.bookName = ev.docName;
                    if(ev.reviewNum){
                        reviewNum = ev.reviewNum;
                    }else{
                        reviewNum = 0;
                    }
                    docAbstract = comm.getStrLen(ev.docAbstract, 72);
                    if (ev.docAbstract.length > 42) {
                        shrink = '<p class="al-contentShow show">展开</p>' +
                            '</article>' +
                            '<div class="al-eBookIntroduce contentFull" style="display:none">' +
                            ev.docAbstract +
                            '<p class="al-contentShow hide">收起</p>' +
                            '</div>';
                    } else {
                        shrink = "</article>";
                    }
                    if(ev.picUrl){
                        picUrl = ev.picUrl;
                    }else{
                        picUrl = '/images/img50/v3/icon/book_img_default.png'
                    }
                    html = '<section data-book="' + ev.bookId + '">' +
                        '<figure class="al-eBookImg">' +
                        '<img src="' + picUrl + '" data-original="' + picUrl + '" alt="">' +
                        '</figure>' +
                        '<figcaption class="al-eBookBaseMessageContent">' +
                        '<article>' +
                        '<h3>' + ev.docName + '</h3>' +
                        // '<p>译者:<span>' + ev.authorName + '</span><span>等<i class="transformerNum" data-alcode="e89">' + ev.authorNum + '</i>人</span></p>' +
                        '<p><span>' + ev.browseNum + '</span>浏览</p>' +
                        '<p class="transformerNum">书籍参与者</p>'+
                        '</article>' +
                        // '<figure class="al-readBtnBox">' +
                        // '<button class="al-readBtn icon-eBookRead"><span>全书阅读</span></button>' +
                        // '</figure>' +
                        '</figcaption>' +
                        '</section>' +
                        '<article class="al-eBookIntroduce Ev-test">' +
                        docAbstract +
                        shrink;
                $('.al-eBookBaseMessage').html(html);
                if(ev.collectionRelationship==1){
                    $('.commentCollageNav p:last-child').html('<i></i><span>已收藏</span>').addClass('active');
                }
                if(ev.hasBook==1 && ev.hasArticle ==1){     //有整书，有散书
                    t.getArticleData();
                    t.getCatalogueData();
                    $(".al-eBookContentChange").show();
                    $('.ev_commentNav').hide();
                }
                if(ev.hasBook==1 && ev.hasArticle ==0){     //有整书，无散书
                    $('.al-terminalSortChange').hide();
                    $('.al-eBookContentContainer .al-eBookContentWrapper').removeAttr('style');
                    $('.slide-content').attr('style','background-color:#eff4f8;width:100%');
                }
                if(ev.hasBook==0 && ev.hasArticle ==1){     //无整书，有散书
                    $('.ev_commentNav').hide();
                    t.getArticleData();
                    t.getCatalogueData();
                    $(".al-eBookContentChange").show();
                    $('.noPandect').attr('style','display:block');
                    $('.BookComment').attr('style','display:none');
                    $('.BookFree').attr('style','display:none');
                }
                if(ev.hasBook==0 && ev.hasArticle ==0){     //无整书，无散书
                    $('.al-terminalSortChange').hide();
                    $('.noPandect').attr('style','display:block');
                    $('.BookComment').attr('style','display:none');
                    $('.BookFree').attr('style','display:none');
                    $('.al-eBookContentContainer .al-eBookContentWrapper').removeAttr('style');
                    $('.slide-content').attr('style','background-color:#eff4f8;width:100%');
                }
                $('.commentCollageNav').show();
                t.transformerList();
                t.callApp();
                t.spreadToggle();
                t.scroll(ev.docName);

                $('.Ev-navReviewNum').text(reviewNum);
                $('figure[data-role="comment"] span').text(reviewNum);
                $('title').text(ev.docName + ' - 书籍,唯医,allinmd');
            },
            scoreDom: function (s, scoreNum) {
                var score = "";
                if (scoreNum < 10) {
                    return ""
                }
                var num = parseInt(s);
                var flot = (s - num) * 100 + "%";
                if (num == 0) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li><li></li></ul></div>';
                } else if (num == 1) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li></ul></div>';
                } else if (num == 2) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li></ul></div>';
                } else if (num == 3) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li></ul></div>';
                } else if (num == 4) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li></ul></div>';
                } else if (num == 5) {
                    score = '<div class="al-resourceTypeBox" style="margin-bottom:7px;"><ul class="al-littleScoreStarBox"><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li></ul></div>';
                }
                return score;
            },
            loadArticle: function (data) {
                var t = this;
                var html = '',dataItem = '';
                for (var i = 0,le = data.length; i < le; i++) {
                    dataItem = data[i];
                    if (dataItem.picUrl !== '') {
                        html += '<section class="al-contentPartModule">' + t.scoreDom(dataItem.currentStarLevel, dataItem.currentScoreNum) +
                            '<section class="al-tableBox">' +
                            '<article class="al-contentText"><a href="' + dataItem.webStoragePath + '" class="al-contentTitle"><span>' + dataItem.docName + '</span></a>' +
                            '<p class="al-contentOtherMsg">' +
                            '<span class="icon-contentWatchedNum">' + dataItem.browseNum.toWKH() + '</span>' +
                            '<span class="icon-tagComment">' + dataItem.reviewNum.toWKH() + '</span></p>' +
                            '</article>' +
                            '<figure class="al-contentImgBox">' +
                            '<a href="' + dataItem.webStoragePath + '"><img src="' + dataItem.picUrl + '" data-original="' + dataItem.picUrl + '" alt=""></a>' +
                            '</figure>' +
                            '</section>' +
                            '</section>';
                    } else {
                        html += '<section class="al-contentPartModule">' + t.scoreDom(dataItem.currentStarLevel, dataItem.currentScoreNum) +
                            '<section class="al-tableBox">' +
                            '<article class="al-contentText"><a href="' + dataItem.webStoragePath + '" class="al-contentTitle"><span>' + dataItem.docName + '</span></a>' +
                            '<p class="al-contentOtherMsg">' +
                            '<span class="icon-contentWatchedNum">' + dataItem.browseNum.toWKH() + '</span>' +
                            '<span class="icon-tagComment">' + dataItem.reviewNum.toWKH() + '</span>' +
                            '</p>' +
                            '</article>' +
                            '</section>' +
                            '</section>';
                    }
                }
                $('.al-contentArticle').append(html);
                $('.ev-subNav').show();
            },
            loadCatalogue: function (data) {
                var t = this;
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];
                    html += '<article class="al-eBookCatalogItem" data-catalogue="' + dataItem.catalogueId + '" data-book_1="' + dataItem.bookId + '" data-cataname="' + dataItem.catalogueName + '" data-catanum="' + dataItem.catalogueSortId + '" data-bookname="' + t.bookName + '" data-bookid="' + dataItem.bookId + '">' +
                        '<span>' + dataItem.catalogueName + '</span><i class="icon-arrowRight"><span>' + dataItem.sumNum + '</span></i>' +
                        '</article>';
                    /*<i>'+comm.numToChinese(dataItem.catalogueSortId)+'</i>*/

                }
                $('.al-eBookCatalog').append(html);
                $('.slide-wrapper').css('height', 'auto');
                if (t.slideIndex == 1) {
                    $('.slide-wrapper').height($(".slide-content[data-role=catalog]").outerHeight());
                }
                t.articleList();
            },
            bindOrder: function () {
                var t = this;
                $('.al-personalContributionSelectorItem').on('click', function () {
                    var n = $(this).index();
                    switch (n) {
                        case 0:
                            t.sortType = 18;
                            break;
                        case 1:
                            t.sortType = 19;
                            break;
                    }
                    $('.al-contentArticle').empty();
                    $(".al-contentArticle").attr("scrollPagination", "enabled");
                    t.getArticleData();
                });
            },
            //点击章节目录跳转到章节列表页
            articleList: function () {
                $('.al-eBookCatalogItem').on("click", function () {
                    var articleCatalogue = $(this).data('catalogue');
                    var articleBook = $(this).data('book_1');
                    var catalogueName = $(this).data('cataname');
                    var catalogueNum = $(this).data('catanum');
                    var bookName = $(this).data('bookname');
                    var articleId = $(this).data('bookid');
                    window.location = '/pages/eBook/eBook_chapter.html?articleBook=' + articleBook +
                        '&articleCatalogue=' + articleCatalogue +
                        '&catalogueName=' + catalogueName +
                        '&catalogueNum=' + catalogueNum +
                        '&bookName=' + bookName +
                        '&articleId=' + articleId +
                        '#1';

                })
            },
            //点击译者人数跳转到译者列表页
            transformerList: function () {
                $('.transformerNum').on("click", function () {
                    var bookId = $(this).closest('.al-eBookBaseMessageContent').parent().data('book');
                    var href = '/pages/eBook/eBook_transformerList.html?bookId=' + bookId + '';
                    g_sps.jump($(this), href);
                });
            },
            backBtnClick: function () {
                $(".al-indexHeaderItem img").on("click", function () {
                    comm.creatEvent({
                        triggerType: '全站功能按钮点击',
                        keyword: "返回",
                        actionId: 41,
                        async: false
                    });
                    if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                      g_sps.jump(null,"/");
                    } else {
                        history.back();
                    }
                    return false;
                })
            },
            //点击全书阅读唤醒app
            callApp: function () {
                var t = this;
                var refId = t.bookId;
                var amChannel = comm.getpara()._amChannel;
                var callAppOptions = {
                    ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=286&share=app&visitSiteId=5"+(amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:" + refId + ",tplPath:286"+(amChannel?",_amChannel:"+amChannel:'')+ "}",
                    ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=286&share=app&visitSiteId=5"+(amChannel?"&_amChannel="+amChannel:''),
                    runAtOnce: false
                };
                comm.recognizeAppShareLink(callAppOptions);
                $('.BookFree').on('click', function () {
                    comm.appWakeUp("confirm", callAppOptions);//唤醒app弹层
                });
            },
            //展开/收起切换
            spreadToggle: function () {
                $('.al-contentShow.show').on('click', function () {
                    $('.contentFull').show();
                    $(this).parent().hide();
                    comm.creatEvent({
                        triggerType: '展开',
                        keyword: $('.al-eBookBaseMessageContent h3').text(),
                        actionId: 77,
                        refId: comm.getpara().bId
                    });
                });
                $('.al-contentShow.hide').css({'bottom': '0.2rem'});
                $('.al-contentShow.hide').on('click', function () {
                    $(this).parent().hide();
                    $('.Ev-test').show();
                    comm.creatEvent({
                        triggerType: '收起',
                        keyword: $('.al-eBookBaseMessageContent h3').text(),
                        actionId: 78,
                        refId: comm.getpara().bId
                    });
                });
            },
            //书籍主页文章瀑布流
            scrollPage: function () {
                var t = this;
                var num = 2;

                $(".al-contentArticle").off("scroll").scrollPagination({
                    'contentPage': t.path.article,
                    'contentData': $.extend(t.data, {
                        pageIndex: function () {
                            //return num++;
                            return Math.ceil($('.al-contentArticle .al-contentPartModule').length / 6) + 1;
                        }
                    }),
                    'moreScroll': true,
                    'flag': function () {
                        return $('.slide-wrapper').css('transform') != 'none' ? Math.abs($('.slide-wrapper').css('transform').split(',')[4]) == 0 : true;
                    },
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
                            $(".al-contentArticle").attr("scrollPagination", "disabled");
                            $('.al-eBookNoContent').show();
                            $(".slide-wrapper").height($(".slide-wrapper").height() + 100)
                            return false;
                        } else {
                            if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                                $(".al-contentArticle").attr("scrollPagination", "disabled");
                                $('.al-eBookNoContent').show();
                                $(".slide-wrapper").height($(".slide-wrapper").height() + 100);
                                return false;
                            }
                            else {
                                var result = data.responseObject.responseData.data_list;
                                var html = t.loadArticle(result);
                                var role = $(".slide-navbarItem.active").attr("data-role");
                                $(".al-contentArticle").append(html);
                                $(".slide-wrapper").height($(".slide-content[data-role=article]").height());
                                if (result.length < 6) {
                                    $(".al-contentArticle").attr("scrollPagination", "disabled");
                                    $('.al-eBookNoContent').show();
                                    $(".slide-wrapper").height($(".slide-content[data-role=article]").height() + 100);
                                }
                            }
                        }
                    }
                });

            },
            // 分享按钮
            getShareData: function () {
                var t = this;
                var params = {};
                var params_share = {
                    paramJson: $.toJSON({
                        attUseFlag: 3,
                        useFlag: 3,
                        docId: t.bookId,
                        visitSiteId: 2,
                        resourceType: 17,
                        sceneType: 27,
                        sessionCustomerId: $("#sesCustomerId").val()||''
                    })
                };
                $.ajax({
                    url: t.path.share,
                    data: params_share,
                    dataType: "json",
                    type: "post",
                    async: false,
                    success: function (data) {
                        if (comm.hasResponseData(data) && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list[0]) {
                            var items = data.responseObject.responseData.data_list[0];
                            var picUrl, shareTitle;
                            picUrl = items.share_comm.shareImageUrl;
                            shareTitle = items.share_comm.shareTitle !== "" ? items.share_comm.shareTitle : document.title;
                            params.pic = picUrl;
                            params.title = shareTitle;
                            $.each(items.share_channel, function (i, el) {
                                if (el.shareChannel == "WechatTimeline") {
                                    params.wxTitle = el.shareTitle;
                                    params.wxDesc = el.shareDesc;
                                } else if (el.shareChannel == "WechatFriend") {
                                    params.timeLineTitle = el.shareTitle;
                                    params.friCircleDesc = el.shareDesc;
                                } else if (el.shareChannel == "QZone") {
                                    params.qzoneTitle = el.shareTitle;
                                    params.qZoneDesc = el.shareDesc;
                                } else if (el.shareChannel == "QQFriend") {
                                    params.qqTitle = el.shareTitle;
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
            shareOp: function (kv) {
                var t = this;
                var aIndex = $('.slide-navbarItem.active').index();
                t.slideIndex = aIndex;
                var shareSence = 160;
                if (aIndex == 0) {
                    shareSence = 160;
                } else if (aIndex == 1) {
                    shareSence = 161;
                } else {
                    shareSence = 162;
                }
                var refType = 2;
                var cId = TempCache.getItem("userId");
                var refId = t.bookId;
                var shareObj = {};
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
                    },//分享动态后成功后的回调函数
                    qShareLog: function (x) {    //分享新浪，空间成功与否都执行
                        if (x == 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: shareSence,
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
                                shareSence: shareSence,
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
                            shareSence: shareSence,
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
                            shareSence: shareSence,
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },      //分享朋友圈成功回调
                    triggerRequest: function () {
                        shareObj = t.getShareData();
                        return shareObj;
                    }
                }, false, $('.ebookShare'));
            },
            //点击评论出现评论框，点击评论框跳转回复页面
            reviewBox: function () {
                var t = this;
                // $('figure[data-role="comment"]').on('click', function () {
                //     $('.al-commentEbookPart').show();
                //     $('.al-commentEbookPart p').on('click', function () {
                //         TempCache.setItem('commentFromPage', window.location.href);
                //         window.location = '/pages/common/comment.html?resourceId=' + t.bookId + '&username=' + t.bookName + '&type=2&parentId=0&refCustomerId' + t.bookId + '';
                //     });
                // });
                // $('figure[data-role="article"],figure[data-role="catalog"]').on('click', function () {
                //     $('.al-commentEbookPart').hide();
                // });
                if (comm.getpara().reviewId) {
                    $('.slide-navbarItem[data-role=comment]').addClass('active').siblings().removeClass('active');
                    $(".slide-wrapper").css("transform", "translateX(-" + (100 / 3) * 2 + "%)");
                    // $('.al-commentEbookPart').show();//同上一起注释
                    //$(".slide-wrapper").height($(".slide-content[data-role=comment]").innerHeight());
                }
                $('.commentCollageNav p:first-child').off('click').on('click',function(){
                    user.privExecute({
                        operateType:'auth',
                        noNeedBack:true,
                        callback:function(){
							TempCache.setItem('commentFromPage', window.location.href);
							window.location = '/pages/common/comment.html?resourceId=' + t.bookId + '&username=' + t.bookName + '&type=2&parentId=0&refCustomerId' + t.bookId + '';
						}
                    });
                });
            },
            collect:function(){
                var t = this;
                $('.commentCollageNav p:last-child').off('click').on('click',function(){
                    var that = $(this);
                    user.privExecute({
                        operateType: 'auth',
                        callback: function () {
                            var params={
                                paramJson: $.toJSON({
                                    "collectionType":"17",
                                    "refId":t.bookId,
                                    "customerId":TempCache.getItem('userId') || ""
                                })
                            };
                            if(that.hasClass('active')){
                                var callback = function(data){
                                    if(data.responseObject.responseStatus){
                                        that.removeClass('active').html('<i></i><span>收藏</span>');
                                    }
                                };
                                comm.ajax.async(t.path.cancelCollect,params,callback);
                            }else{
                                var callback = function(data){
                                    if(data.responseObject.responseStatus){
                                        that.addClass('active').html('<i></i><span>已收藏</span>');
                                    }
                                };
                                comm.ajax.async(t.path.collect,params,callback);
                            }
                        }
                    });

                })
            },
            scroll:function(n){
                if(n){
                    var name = comm.getStrLen(n,20);
                }
                $(window).on('scroll',function(){
                    var scrollT = $(this).scrollTop();
                    if(scrollT>0){
                        $('.al-indexHeader').attr('style','position: fixed;z-index: 2;width:9.2rem');
                        $('.al-indexHeader .al-indexHeaderItem:eq(1)').attr('style','width:auto').html('<h1>'+name+'</h1>');
                    }else if(scrollT==0){
                        $('.al-indexHeader').removeAttr('style');
                        $('.al-indexHeader .al-indexHeaderItem:eq(1)').removeAttr('style').html('');
                    }
                })
            }
        };
        bookDetails.init();
    });
});

