/**
 * 功能描述：  发现——首页
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/17.
 */

$(function() {
    var DiscoverIndex = function() {
        var that = this;
        var $that = $(this);
        this.fixedHeader = $(".al-indexHeader");
        this.XHRList = {
            list: '/mcall/recommend/customer/tag/json_othertags/',
            banner: '/mcall/ad/position/profile/getMapList/',
            activity: '/mcall/navigation/scheduling/json_list/',
            customerInfo:M_CALL + "customer/unite/getMapById/", //客户信息
            searchHot:M_CALL + "allsearch/searchHot/"
        };
    };
    DiscoverIndex.prototype = {
        init: function() {
            //window.onload = Log.createBrowse(43, '发现首页');
            //comm.appWakeUp('btn');
            comm.footerNav();
            // comm.releaseBox();
            this.searchHot();
            this.layout();
            this.topBanner();
            this.whetherSW();
            this.activityEntry();
            this.switchPlatform();
            this.getEveryBrowsedItem();
            $(".al-searchInputBar input").on("focus", function() {
                comm.creatEvent({
                    triggerType:'搜索-发现',
                    keyword:"搜索-发现",
                    actionId:9
                });
                //window.location = '/pages/search/search.html'
                // g_sps.jump($(this),"/pages/search/search.html");
                g_sps.jump($(this),"/dist/search/search.html");
            });
            $('.al-discoverRecommendItem').on('click',function(){
                g_sps.jump($(this),$(this).attr("_href"));
            })
        },
        //搜索热区
        searchHot:function(){
            var t=this;
            var data={
                "pageIndex":1,
                "pageSize" : 2,
                groupByFlag:1,
                platformId:1
            };
            $.ajax({
                type : "post",
                url : t.XHRList.searchHot,
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
                        $(".al-searchInputBar input").attr("placeholder",comm.getStrByteLen(str.substr(0,str.length-3),40));
                    }
                },
                error:function(){}
            });
        },
        switchPlatform:function(){
            var t=this;
            var _platformId = TempCache.getItem('department')||1;
            if (_platformId==1) {
                $('.platformName').text('骨科').attr('data-platformId',1);
                $('.ev_switchPlatform li').eq(0).addClass('active').siblings().removeClass('active');
            } else if (_platformId==2) {
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
            $(window).on('scroll', function () {
                if($('.ev_switchPlatform').hasClass('al-personalSelectorOn')){
                    $('.ev_switchPlatform').removeClass('al-personalSelectorOn');
                    comm.creatEvent({
                        triggerType:'骨科&手外科切换(取消)',
                        keyword:"骨科&手外科切换(取消)",
                        actionId:3
                    });
                }

            });
        },
        whetherSW:function() {
            var t=this;
            var cid =TempCache.getItem('userId');
            var _platformId = TempCache.getItem('department')||1;
            if(_platformId==2){
                $('.ev_SWEntry').show();
                $('.ev_BoneEntry').hide();
            }
            //if(cid){
            //    var params={}
            //    params.paramJson= $.toJSON({"customerId":cid,"logoUseFlag":4});
            //    $.ajax({
            //        url: M_CALL+'customer/unite/getMapById/',
            //        data: params,
            //        success: function(rep){
            //            var platformId = rep.responseObject.responseData.data_list[0].customer_auth.platformId;
            //            if(platformId){
            //                TempCache.setItem("department", platformId);
            //                if(platformId==2){
            //                    $('.ev_SWEntry').show();
            //                    $('.ev_BoneEntry').hide();
            //                }
            //            }
            //        }
            //    });
            //}
        },
        layout: function() {
            var fH = this.fixedHeader.outerHeight();
            var slH = $(".EV-scrollFixedHeader").outerHeight();
            var slHN = $('.EV-scrollFixedHeader').siblings('section');
            var sT_css = {
                'position': 'fixed',
                'top': fH,
                'zIndex': 2,
                'left': 0,
                'right': 0,
                'backgroundColor': '#fff'
            };
            var sT_css_reset = {};
            //$(".al-mainInner").css("marginTop", fH);

            $(window).on("scroll", function(e) {

                var sT = $(".EV-scrollFixedHeader").offset().top - $(window).scrollTop() - fH;
                if (sT <= 0) {
                    $('.EV-scrollFixedHeader').css(sT_css);
                    slHN.css('marginTop', fH);
                    if (slHN.offset().top - $(window).scrollTop() - fH - $(".EV-scrollFixedHeader").outerHeight() > 0) {
                        $('.EV-scrollFixedHeader').attr("style", "");
                        slHN.css('marginTop', '');
                    }
                }
            });

        },
        getEveryBrowsedItem: function() {
            var data = {
                    pageIndex: 1,
                    pageSize: 20,
                    customerId:TempCache.getItem('userId')||'',
                    platformId: TempCache.getItem('department')||1
                },
                template = "";

            $.ajax({
                    url: this.XHRList.list,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    }
                })
                .done(function(data) {
                    var list = data.responseObject.responseData.data_list;
                    $(list).each(function(index, ele) {
                        template += '<article class="al-discoverListItem">' +
                            '<a href="/pages/discover/discover_tagSubject.html?tId=' + ele.propertyId + '">' +
                            '<p>' + ele.propertyName + '</p>' +
                            '<span><strong>' + ele.propertyNum + '</strong>个资源</span>' +
                            '</a>' +
                            '</article>';


                    });
                    $(".EV-browsedList section").html(template);
                    $(".EV-browsedList section").append('<article class="al-discoverListOver"><span>~没有更多了~</span></article>')
                    $(".EV-browsedList section a").click(function(){
                        comm.creatEvent({
                            triggerType:'标签',
                            trigger_name:"标签",
                            keyword:$(this).find('p').text(),
                            refId:$(this).attr('href').split('tId=')[1],
                            actionId:79,
                            async:false
                        });
                    });
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        },
        topBanner: function() {
            var data = {
                firstResult: 20,
                maxResult: 1,
                visitSiteId: 2,
                channelId: 140,
                isIndex: 1,
                platformId: TempCache.getItem('department')||1,
                customerId: TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
            };
            var sTemplate = "";
            $.ajax({
                    url: this.XHRList.banner,
                    type: 'get',
                    dataType: 'json',
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON(data)
                    }
                })
                .done(function(data) {
                    var sList = !$.isEmptyObject(data.responseObject.responseData)&&data.responseObject.responseData.data_list[0].ad_profile_attachment;
                    $(sList).each(function(index, ele) {
                        sTemplate = '<figure class="al-discoverIndexBannerImg swiper-slide">' +
                            '<a href="' + ele.linkUrl + '">' +
                            '<img src="' + ele.adAttUrl + '" alt="'+ele.adAttName+'">' +
                            // '<i class="al-discoverIndexBannerMark">' +
                            // '<img src="" alt="">' +
                            // '</i>' +
                            '</a>' +
                            '</figure>';
                        $(".swiper-wrapper").append(sTemplate).click(function(){
                            comm.creatEvent({
                                triggerType:'广告位',
                                keyword:"广告位-轮播图(发现)-"+$(this).find('a img').attr('alt'),
                                actionId:14,
                                locationId:0
                            });
                        });

                        return false;
                    });
                }).fail(function() {
                    console.log("XHR error...");
                });

        },
        activityEntry: function() {
            var data = {
                navigationType: 3,
                visitSiteId: 2,
                platformId: TempCache.getItem('department')||1
            };
            $.ajax({
                    url: this.XHRList.activity,
                    type: 'get',
                    dataType: 'json',
                    data: {
                        paramJson: $.toJSON(data)
                    }
                })
                .done(function(data) {
                    var pList = data.responseObject.responseData.data_list;
                    $(pList).each(function(index, ele) {
                        var pId = ele.navigationId,
                            mark = "";
                        switch (ele.navigationStatus) {
                            case 1:
                                mark = '<article class="al-tagsRecommendHot"></article>';
                                break;
                            case 2:
                                mark = '<article class="al-tagsRecommendNew"></article>';
                                break;
                            default:
                                break;
                        }
                        $("[data-id='" + pId + "'] .EV-activityEntry").append(mark);

                    });
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        }
    };
    $.ajax({
        url:"/mcall/cms/course/getHotCourseList/",
        type:"POST",
        dataType:'json',
        data: {
            paramJson: $.toJSON({
                "isValid": 1,
                "firstResult": 0,
                "maxResult": 6,
                "sortType": 4,
                "courseSubjectTeamId":-1,
                "platformId":localStorage.getItem('department')
            })
        },
        success:function(data) {
            if (data && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.data_list.length) {
                var newArr = data.responseObject.responseData.data_list.slice(0, 6);
                var courseTemplate = "";
                $.each(newArr, function (index, data) {
                    var s = comm.getStrLen(data.courseName, 24);
                    data.courseName = s;
                    courseTemplate += '<li><a href="/pages/discover/series/discover_series_details.html?tId=' + data.courseId + '"><img src="' + data.courseCoverPicUrl + '"><p style="display: none">' + data.courseName + '</p></a><p><i></i>' + data.totalLearnNum.toWKH() + '<span>' + data.catalogNum + '节课</span><b>' + data.coursePrice + '</b></p></li>';
                });
                $('.al-discoverRecommend').after('<section class="discoverCourse" data-alcode-mod="662" data-alcode-item-selector=".courseMore"> <aside class="title">系列课程</aside><ul class="courseList">'+courseTemplate+'</ul><aside class="courseMore right">查看更多<i></i></aside> </section>');
                $(".courseMore").click(function(){
                    comm.creatEvent({
                        triggerType:'系列课',
                        keyword:"查看更多",
                        actionId:11001
                    });
                    var href="/pages/discover/series/feedback.html";
                    g_sps.jump($(this),href);
                });
                $('.discoverCourse .courseList li a').click(function(){
                    comm.creatEvent({
                        triggerType:'系列课',
                        keyword:"系列课程",
                        actionId:11000,
                        refId: $(this).attr('href').split('tId=')[1],
                        locationId:$(this).parent('li').index()+1
                    });
                });
            }
        }
    });

    var discoverIndex = new DiscoverIndex();

    discoverIndex.init();
});
