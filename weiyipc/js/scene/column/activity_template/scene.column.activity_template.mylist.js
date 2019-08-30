/**
 * 功能描述：  专题模板拜耳二期PC
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：公共方法
 * Created by WangJingRong on 2016/10/20.
 * UpData by zhanghongda on 2017/4
 */
var spTemp_list = {};
spTemp_list.one={
    spTemp_listLoad:function(ev) {
        //comm.Log.createBrowse({href: location.href, id: 197, name: '新版活动页面'});
        var myList = {
            config: {
                url:"/call/activity/columnrecommend/getResourceMapList/",
                screenUrl:'/call/activity/menu/layout/module/getColumnChooseRecommendMap/',//筛选项点击接口
                sortType:"",//点击排序的类型
                sortUrl:"",//排序接口地址
                screSourceList:'',//排序列表
                screenListHtml:''//筛选树
            },
            init: function () {
                var t = this;
                t.addList(ev);
                t.videoMore();
                t.checkEndTime();
                t.checkMoreClick();
                //在轮播图中将第一个和第二个图片进行提高等级显示
                $(".bannerBox .img").find("li").eq(0).css("z-index",2);
                $(".bannerBox .img").find("li").eq(1).css("z-index",1);
                if ($('#expert_demo').length > 0) {
                    t.autoPlay_expert();
                }
                if ($('#works_demo').length > 0) {
                    t.autoPlay_works();
                }
                if ($('#zdy_demo').length > 0) {
                    t.autoPlay_zdy();
                }
            },
            checkMoreClick:function(){
                $(".resourceListMore").on("click",function(){
                    var _num=$(this).find("a").attr("data-url").substr($(this).find("a").attr("data-url").indexOf("=")+1);
                    $('.spTemp_total_nav_lists li span[data-navText=' + _num + ']').click();
                    return false;
                });
            },
            ajaxFn: function (opt) {
                comm.LightBox.showloading();
                var o = opt;
                $.ajax({
                    url: o.url,
                    type: 'post',
                    data: o.param,
                    dataType: 'json',
                    success: function (data) {
                        comm.LightBox.hideloading();
                        if (data) {
                            o.fn(data)
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                    }
                })
            },
            //滚动广告栏
            //专家介绍100%
            autoPlay_expert: function () {
                var speed = 20;
                var d2 = document.getElementById("expert_demo2");
                var d1 = document.getElementById("expert_demo1");
                var d = document.getElementById("expert_demo");
                //取到一个轮播容器中一个轮播项的宽度
                var aWidth = $(d1).width() / $(d1).find('a').length;

                function Marquee() {
                    d2.innerHTML = d1.innerHTML;
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft++;
                    }
                }

                var MyMar = setInterval(Marquee, speed);
                var slider = $('.expert_slider');
                slider.mouseover(function () {
                    clearInterval(MyMar);
                })
                slider.mouseout(function () {
                    MyMar = setInterval(Marquee, speed);
                })

                $('.expert_slider .back_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.back_m').css('display', 'block');
                });
                $('.expert_slider .back_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.back_n').css('display', 'block');
                });
                $('.expert_slider .back_m').off('click').click(function () {
                    d.scrollLeft -= aWidth;
                })
                $('.expert_slider .forward_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.forward_m').css('display', 'block');
                });
                $('.expert_slider .forward_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.forward_n').css('display', 'block');
                });

                $('.expert_slider .forward_m').off('click').click(function () {
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft += aWidth;
                    }
                })
            },
            //入围作品100%
            autoPlay_works: function () {
                var speed = 20;
                var d2 = document.getElementById("works_demo2");
                var d1 = document.getElementById("works_demo1");
                var d = document.getElementById("works_demo");
                //取到一个轮播容器中一个轮播项的宽度
                var aWidth = $(d1).width() / $(d1).find('a').length;
                $("#works_demo-warp").css('width',$(d1).width()*2);
                function Marquee() {
                    d2.innerHTML = d1.innerHTML;
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft++;
                    }
                }

                var MyMar = setInterval(Marquee, speed);
                var slider = $('.works_slider');
                slider.mouseover(function () {
                    clearInterval(MyMar);
                });
                slider.mouseout(function () {
                    MyMar = setInterval(Marquee, speed);
                })

                $('.works_slider .back_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.back_m').css('display', 'block');
                });
                $('.works_slider .back_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.back_n').css('display', 'block');
                });
                //向前的点击事件
                $('.works_slider .back_m').off('click').click(function () {
                    d.scrollLeft -= aWidth;
                })
                $('.works_slider .forward_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.forward_m').css('display', 'block');
                });
                $('.works_slider .forward_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.forward_n').css('display', 'block');
                });
                //向后的点击事件
                $('.works_slider .forward_m').off('click').click(function () {
                    if (d2.offsetWidthf - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft += aWidth;
                    }
                })
            },
            //自定义100%
            autoPlay_zdy: function () {
                var speed = 20;
                var d2 = document.getElementById("zdy_demo2");
                var d1 = document.getElementById("zdy_demo1");
                var d = document.getElementById("zdy_demo");
                //取到一个轮播容器中一个轮播项的宽度
                var aWidth = $(d1).width() / $(d1).find('a').length;

                function Marquee() {
                    d2.innerHTML = d1.innerHTML;
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft++;
                    }
                }

                var MyMar = setInterval(Marquee, speed);
                var slider = $('.zdy_slider');
                slider.mouseover(function () {
                    clearInterval(MyMar);
                });
                slider.mouseout(function () {
                    MyMar = setInterval(Marquee, speed);
                })
                $('.zdy_slider .back_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.back_m').css('display', 'block');
                });
                $('.zdy_slider .back_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.back_n').css('display', 'block');
                });
                $('.zdy_slider .back_m').off('click').click(function () {
                    d.scrollLeft -= aWidth;
                })
                $('.zdy_slider .forward_n').mouseover(function () {
                    $(this).css('display', 'none').siblings('.forward_m').css('display', 'block');
                });
                $('.zdy_slider .forward_m').mouseout(function () {
                    $(this).css('display', 'none').siblings('.forward_n').css('display', 'block');
                });
                $('.zdy_slider .forward_m').off('click').click(function () {
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
                        d.scrollLeft -= d1.offsetWidth;
                    } else {
                        d.scrollLeft += aWidth;
                    }
                })
            },
            //点赞
            clickPraise: function () {
                $('.resource_list_assist').click(function () {
                    var _that = $(this);
                    var refId = _that.attr("resourceId");
                    var refType = _that.attr("refType");
                    user.login({
                        callback: function () {
                            var params = {
                                paramJson: $.toJSON({
                                    customerId: $("#sesCustomerId").val(),
                                    refId: refId,
                                    usefulType: refType?refType:9,
                                    upDownType: 1
                                })
                            };
                            if (_that.hasClass('resource_list_assist_no')) {
                                $.ajax({
                                    url: "/call/prefer/create/",
                                    type: "post",
                                    data: params,
                                    dataType: 'json',
                                    success: function (data) {
                                        _that.removeClass('resource_list_assist_no').addClass('resource_list_assist_yes').html("已 赞");
                                        var asNum;
                                        if( _that.parents('.zan_parents').length){//筛选列表的html格式和其他组件的html格式不一样，现需要区分点赞按钮的类名，进行分别获取点赞数class
                                            asNum = _that.parents('.zan_parents').siblings('.zan_parents_siblings').find('.assist_number');
                                        }else{
                                            asNum=_that.siblings("span.ev-preferNum").find("b");
                                        }
                                        if (asNum) {
                                            var asNumA = parseInt(asNum.text()) + 1;
                                            asNum.text(asNumA);
                                        }
                                    }
                                })
                            } else {
                                $.ajax({
                                    url: "/call/prefer/delete/",
                                    type: "post",
                                    data: params,
                                    dataType: 'json',
                                    success: function (data) {
                                        _that.removeClass('resource_list_assist_yes').addClass('resource_list_assist_no').html("点 赞");
                                        var asNum;
                                        if( _that.parents('.zan_parents').length){//筛选列表的html格式和其他组件的html格式不一样，现需要区分点赞按钮的类名，进行分别获取点赞数class
                                            asNum = _that.parents('.zan_parents').siblings('.zan_parents_siblings').find('.assist_number');
                                        }else{
                                            asNum=_that.siblings("span.ev-preferNum").find("b");
                                        }
                                        if (asNum) {
                                            var asNumC = parseInt(asNum.text())>0?parseInt(asNum.text()) - 1:0;
                                            asNum.text(asNumC);
                                        }
                                    }
                                })
                            }
                        },
                        scene: privilegeSceneConst.eSceneTypeFellow
                    });
                })
            },
            //30%的时候超出10条显示滚动条
            overScroll: function (dataId, fatherType, childType) {
                var t = this;
                var allHeight = 0;
                if ($('.sp_container_s div[data-id=' + dataId + '] ' + fatherType + ' ' + childType).length > 10) {
                    for (var i = 0; i < 10; i++) {
                        var everyHeight = $(fatherType + ' ' + childType).eq(i).innerHeight();
                        allHeight += everyHeight
                    }
                    $('.sp_container_s div[data-id=' + dataId + '] ' + fatherType).css({
                        height: allHeight,
                        "overflow-y": "scroll",
                        "overflow-x": "hidden"
                    })
                }
            },
            //直播时间比较
            checkEndTime: function () {
                if ($(".video_live_box").length > 0) {
                    var beginTime = $("#videoComponent").attr("begintime");
                    var begin = Date.parse(beginTime);
                    var endTime = $("#videoComponent").attr("endtime");
                    var end = Date.parse(endTime);
                    var now = Date.parse(new Date());
                    if (begin < now && now < end) {
                        $('.gsVideo').show().siblings().hide()
                    } else if (begin > now) {
                        $('.beginTime').show().siblings().hide()
                    } else if (now > end) {
                        $('.endTime').show().siblings().hide()
                    }
                }
            },
            //视频简介展开更多
            videoMore: function () {
                var t = this;
                if ($(".video_live_introt_down") && $(".video_live_introt_down span:nth-child(1)").text().length > 50) {
                    var videoAllIntro = $(".video_live_introt_down span:nth-child(1)").text();
                    var videoIntro = comm.getStrLen($(".video_live_introt_down span:nth-child(1)").text(), 100);
                    $(".video_live_introt_down span:nth-child(1)").text(videoIntro)
                    $(".video_intro_more").show();
                }
                $(".video_intro_more").on("click", function () {
                    if ($(".video_intro_more").hasClass("video_intro_more_spread")) {
                        $(".video_live_introt_down span:nth-child(1)").text(videoAllIntro)
                        $(".video_intro_more").addClass("video_intro_more_pack").removeClass("video_intro_more_spread").text('收起');
                    } else if ($(".video_intro_more").hasClass("video_intro_more_pack")) {
                        $(".video_live_introt_down span:nth-child(1)").text(videoIntro)
                        $(".video_intro_more").addClass("video_intro_more_spread").removeClass("video_intro_more_pack").text('展开');
                    }
                })
            },
            //加载资源列表组件
            resourceListHtml: function (data) {
                var t = this;
                var preferUp_s = "",
                    preferUp = "",
                    resourceListHtml = "";
                if (data.item.interactiveOperation) {
                    var isHasPre = data.item.interactiveOperation;   //是否有点赞
                }
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            refId = listItem.refId, //关联ID
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            resouTyp = listItem.resourceType,
                            resouTypCont = "",
                            resou_socialNum = "",//资源列表社交内容
                            video_play_time = "",//视频播放时间
                            videoBtn = "",//视频播放按钮
                            isShowAuth=false;//视频是多作者不显示医院，true为多作者。
                        var isPromotHtml = '';//晋级的图片
                        if(data.item.isShowPromoted!=0&&(data.item.isShowPromoted==listItem.isPromoted)){//晋级的作品
                            if(listItem.coverPicUrl=='') {//如果资源不显示图片(文库不显示图片，话题有图显示无图不显示)
                                isPromotHtml = '<div class="promotion_noPicDiv"><i class="promotion_noPic"></i></div>';
                                if (listItem.promotedName && listItem.promotedName != '') {//表示晋级并且有晋级名称
                                    if (listItem.promotedName.length <= 2) {
                                        isPromotHtml = '<div class="promotion_noPicDivSmall"><i class="promotion_noPic smallImage">晋级'+listItem.promotedName+'</i></div>';
                                    } else if (listItem.promotedName.length > 2 && listItem.promotedName.length <= 3) {
                                        isPromotHtml = '<div class="promotion_noPicDivBig"><i class="promotion_noPic bigImage">晋级'+listItem.promotedName+'</i></div>';
                                    }
                                }
                            }else{
                                isPromotHtml = '<i class="promotion"></i>';
                                if (listItem.promotedName && listItem.promotedName != '') {//表示晋级并且有晋级名称
                                    if (listItem.promotedName.length <= 2) {
                                        isPromotHtml = '<i class="promotion smallImage">晋级'+listItem.promotedName+'</i>';
                                    } else if (listItem.promotedName.length > 2 && listItem.promotedName.length <= 3) {
                                        isPromotHtml = '<i class="promotion bigImage">晋级'+listItem.promotedName+'</i>';
                                    }
                                }
                            }
                        }
                        //判断点赞状态
                        switch (parseInt(data.item.interactiveOperation)) {
                            //点赞
                            case 1:
                                preferUp = '<span class="resource_list_assist ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") +
                                    '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                                preferUp_s = '<span class="resource_list_assist resource_list_assist_s ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") +
                                    '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                                break;
                            //分数
                            case 2:
                                preferUp = '<span class="case_score_l"><i class="case_scoreNum_l">'+listItem.scoreResult+'</i>分</span>';
                                break;
                        }

                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                resouTypCont = '<li class="resource_list_stat_type resource_list_stat_type_video">视频</li>';
                                video_play_time = '<span class="video_play_time">' + listItem.playTime + '</span>';
                                videoBtn = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png" alt=""></i>';
                                break;
                            case 2:
                                resouTypCont = '<li class="resource_list_stat_type resource_list_stat_type_lib">文库</li>';
                                break;
                            case 4:
                                resouTypCont = '<li class="resource_list_stat_type resource_list_stat_type_topic">话题</li>';
                                break;
                            case 7:
                                resouTypCont = '<li class="resource_list_stat_type resource_list_stat_type_case">病例</li>';
                                break;

                        }
                        //判断有几个社交内容
                        if (data.isSocial !== undefined) {
                            for (var k = 0; k < data.isSocial.length; k++) {
                                switch (parseInt(data.isSocial[k])) {
                                    case 1:
                                        resou_socialNum += '<li class="resource_list_stat_liulan_l">' + listItem.browseNum.toW() + '</li>';
                                        break;
                                    case 2:
                                        resou_socialNum += '<li class="resource_list_stat_shoucang_l">' + listItem.collectionNum.toW() + '</li>';
                                        break;
                                    case 3:
                                        resou_socialNum += '<li class="resource_list_stat_pinglun_l">' + listItem.reviewNum.toW() + '</li>';
                                        break;
                                    case 4:
                                        resou_socialNum += '<li class="resource_list_stat_dianzan_l assist_number">' + ((isPrefer==1&&listItem.preferUpNum==0)?"1":listItem.preferUpNum.toString().toW()) + '</li>';
                                        break;
                                }
                            }
                        }
                        //资源多作者字段处理
                        var authorName = '';
                        if(listItem.resourceType==1){
                            if(listItem.ownerNameStr&&listItem.ownerNameStr.split(",").length&&listItem.ownerNameStr.split(",").length>=2){//多作者
                                isShowAuth = true;//是多作者
                            }
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        //判断是否有图片
                        if (listItem.coverPicUrl) {//有图片，不同尺寸
                            var coverPicUrl="";
                            if(coverPicUrl.lastIndexOf("|")>-1){
                                coverPicUrl=listItem.coverPicUrl.split("|")[0];
                            }else{
                                coverPicUrl=listItem.coverPicUrl;
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                                resourceListHtml += '<section class="resource_list_box_l fix">' +
                                    '<section class="resource_list_left_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 52) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    resouTypCont +
                                    (function(){
                                        var str='<li class="resource_list_stat_per_l'+((listItem.videoType&&(listItem.videoType==17||listItem.videoType==18||listItem.videoType==19))?' authorNoUserId':'')+'">';
                                        if(listItem.author){
                                            str+='<span class="resource_list_stat_per_name_l">' + authorName + '</span>' ;
                                        }
                                        if(!isShowAuth){
                                            str+='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 32) : "") + '</span>' +
                                                '</li>';
                                        }else{
                                            str+='</li>';
                                        }
                                        return str;
                                    }()) +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>' +
                                    '<section class="resource_list_right_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                    isPromotHtml+
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><img src="' + coverPicUrl + '">' + videoBtn + '</a>' +
                                    video_play_time +
                                    '</section>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                                resourceListHtml += '<section class="resource_list_box_m fix">' +
                                    '<section class="resource_list_left_m ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 34) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_m fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_m">' +
                                    '<span class="resource_list_stat_per_name_m">' + authorName + '</span>' +
                                        (function(){
                                            var str='';
                                            if(!isShowAuth){
                                                str='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 12) : "") + '</span>'
                                            }
                                            return str;
                                        }()) +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>' +
                                    '<section class="resource_list_right_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                    isPromotHtml+
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><img src="' + coverPicUrl + '">' + videoBtn + '</a>' +
                                    video_play_time +
                                    '</section>' +
                                    '</section>'

                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                                resourceListHtml += '<section class="resource_list_box_s">' +
                                    '<div class="resource_list_title_box_s zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title_s">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 38) : "") + '</p></a>' +
                                    '</div>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    '<li class="resource_list_stat_per_s">' +
                                    '<span class="resource_list_stat_per_name_s">' + authorName + '</span>' +
                                    (function(){
                                        var str='';
                                        if(!isShowAuth){
                                            str='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 18) : "") + '</span>'
                                        }
                                        return str;
                                    }()) +
                                    '</li>' +
                                    resou_socialNum +
                                    preferUp +
                                    '</ul>' +
                                    '</section>'
                            }
                        } else {
                            //没有图片，不同尺寸
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                                resourceListHtml += '<section class="resource_list_box_l fix">' +
                                    isPromotHtml+
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 52) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    resouTypCont +
                                    (function(){
                                        var str='<li class="resource_list_stat_per_l'+((listItem.videoType&&(listItem.videoType==17||listItem.videoType==18||listItem.videoType==19))?' authorNoUserId':'')+'">';
                                        if(listItem.author){
                                            str+='<span class="resource_list_stat_per_name_l">' + authorName + '</span>' ;
                                        }
                                        if(!isShowAuth){
                                            str+='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 32) : "") + '</span>' +
                                                '</li>';
                                        }else{
                                            str+='</li>'
                                        }
                                        return str;
                                    }()) +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                                resourceListHtml += '<section class="resource_list_box_m fix">' +
                                    isPromotHtml+
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 34) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_m fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_m">' +
                                    '<span class="resource_list_stat_per_name_m">' + authorName + '</span>' +
                                    (function(){
                                        var str='';
                                        if(!isShowAuth){
                                            str='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 12) : "") + '</span>'
                                        }
                                        return str;
                                    }()) +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                                resourceListHtml += '<section class="resource_list_box_s">' +
                                    '<div class="resource_list_title_box_s zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '" target="_blank"><p class="resource_list_title_s">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+(listItem.title ? comm.getStrLen(listItem.title, 38) : "") + '</p></a>' +
                                    '</div>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    '<li class="resource_list_stat_per_s">' +
                                    '<span class="resource_list_stat_per_name_s">' + authorName + '</span>' +
                                    (function(){
                                        var str='';
                                        if(!isShowAuth){
                                            str='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 18) : "") + '</span>'
                                        }
                                        return str;
                                    }()) +
                                    '</li>' +
                                    resou_socialNum +
                                    preferUp +
                                    '</ul>' +
                                    '</section>'
                            }
                        }
                    }
                }
                return resourceListHtml;
            },
            //加载会员列表组件
            vipListHtml: function (data) {
                var t = this;
                var preferUp_s = "",
                    preferUp = "",
                    vipListHtml = "";
                if (data.item.interactiveOperation) {
                    var isHasPre = data.item.interactiveOperation;   //是否有点赞
                }
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            vip_socialNum = "",//会员列表社交内容
                            isPrefer = listItem.customerPreferIsValid, //是否点赞
                            refId = listItem.refId;//关联ID
                        //判断点赞状态
                        if (isHasPre == 1) {
                            preferUp = '<span class="resource_list_assist ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") + '" resourceId="' + refId + '" isPrefer="' + isPrefer + '">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                            preferUp_s = '<span class="resource_list_assist resource_list_assist_s ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") + '" resourceId="' + refId + '" isPrefer="' + isPrefer + '">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                        }
                        //判断有几个社交内容
                        if (data.isSocial !== undefined) {
                            for (var k = 0; k < data.isSocial.length; k++) {
                                switch (parseInt(data.isSocial[k])) {
                                    case 3:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>评论</span><span>' + listItem.customerStatistic.reviewNum.toW() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span class="assist_number">' + ((isPrefer==1&&listItem.customerStatistic.othersUpNum==0)?"1":listItem.customerStatistic.othersUpNum.toWK()) + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + listItem.customerStatistic.fansNum.toW() + '</span></li>';
                                            break;
                                        }
                                    case 6:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>关注</span><span>' + listItem.customerStatistic.followTrendsNum.toW() + '</span></li>';
                                            break;
                                        }
                                    case 7:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + listItem.customerStatistic.contributionCount.toW() + '</span></li>';
                                            break;
                                        }
                                }
                            }
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                            vipListHtml += '<section class="vip_list_l fix">' +
                                '<div class="vip_list_favicon_l"><a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '"></a></div>' +
                                '<div class="vip_list_intro_l">' +
                                '<ul class="vip_list_intro_top_l fix zan_parents" style="margin-top:' + (vip_socialNum == "" ? "20px" : "12px") + ';">' +
                                '<li class="vip_list_intro_top_name_l"><a href="/pages/personal/others_contribution.html?cid=' + refId + '">' + comm.getStrLen(listItem.title, 10) + '</a></li>' +
                                '<li class="vip_list_intro_top_zc_l">' + listItem.medicalTitleShow + '</li>' +
                                '<li class="vip_list_intro_top_hos_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 16) : "") + '</li>' +
                                '<li style="position:absolute;right:0;bottom:-5px;">' + preferUp + '</li>' +
                                '</ul>' +
                                '<ul class="vip_list_intro_bottom_l fix zan_parents_siblings">' +
                                vip_socialNum +
                                '</ul>' +
                                '</div>' +
                                '</section>'
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                            vipListHtml += '<section class="vip_list_m fix">' +
                                '<div class="vip_list_favicon_m"><a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '"></a></div>' +
                                '<dl class="vip_list_intro_m">' +
                                '<dd class="vip_list_intro_name_m fix zan_parents"><a href="/pages/personal/others_contribution.html?cid=' + refId + '"><span>' + comm.getStrLen(listItem.title, 10) + '</span></a>' + preferUp + '</dd>' +
                                '<dd class="vip_list_intro_doc_m"><span>' + listItem.medicalTitleShow + '</span><span>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 18) : "") + '</span></dd>' +
                                '<dd class="vip_list_intro_bottom_m">' +
                                '<ul class="fix zan_parents_siblings">' +
                                vip_socialNum +
                                '</ul>' +
                                '</dd>' +
                                '</dl>' +
                                '</section>'
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                            vipListHtml += '<section class="vip_list_s fix">' +
                                '<div class="vip_list_favicon_s"><a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '"></a></div>' +
                                '<dl class="vip_list_intro_s">' +
                                '<dd class="vip_list_intro_name_s fix zan_parents"><a href="/pages/personal/others_contribution.html?cid=' + refId + '"><span>' + comm.getStrLen(listItem.title, 10) + '</span></a>' + preferUp_s + '</dd>' +
                                '<dd class="vip_list_intro_doc_s">' + listItem.medicalTitleShow + '</dd>' +
                                '<dd class="vip_list_intro_hos_s">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 30) : "") + '</dd>' +
                                '</dl>' +
                                '</section>'
                        }
                    }
                }

                return vipListHtml;
            },
            //加载专题列表组件
            specialListHtml: function (data) {
                var t = this;
                var specialListHtml = "";
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j];
                        var coverPicUrl="";
                        if(coverPicUrl.lastIndexOf("|")>-1){
                            coverPicUrl=listItem.coverPicUrl.split("|")[0];
                        }else{
                            coverPicUrl=listItem.coverPicUrl;
                        }
                        if ($('div[data-id=' + data.dataId + ']').find(".special_list").hasClass("special_list_topImg_bottomArt")) {
                            specialListHtml += '<a href="' + listItem.pcUrl + '" target="_blank"><section class="special_list_con">' +
                                '<div class="special_list_imgBox"><img src="' + coverPicUrl + '"></div>' +
                                '<div class="special_list_describe">' + comm.getStrLen(listItem.summary, 180) + '</div>' +
                                '</section></a>'
                        } else {
                            specialListHtml += '<a href="' + listItem.pcUrl + '" target="_blank"><section class="special_list_con">' +
                                '<div class="special_list_describe">' + comm.getStrLen(listItem.summary, 180) + '</div>' +
                                '<div class="special_list_imgBox"><img src="' + coverPicUrl + '"></div>' +
                                '</section></a>'
                        }
                    }
                }
                return specialListHtml;
            },
            //加载资源排行榜组件
            resourceRankHtml: function (data) {
                var t = this;
                var resourceRankHtml = "";
                //如果排行榜有内容，进行遍历
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            resouTypCont = "",
                            resou_socialNum = "",//资源排行社交内容
                            video_play_time = "",//视频播放时间
                            videoBtn = "",//视频播放按钮
                            rankNum = "",
                            resPic = "",
                            isShowAuth=false;//是否是多作者
                        //判断排行版前面显示数字
                        if (data.item.pageIndex) {
                            rankNum = j + 1 + (data.item.pageIndex - 1) * data.item.pageSize
                        } else {
                            rankNum = j + 1
                        }
                        //判断是否有图片，没有用默认
                        if (listItem.coverPicUrl) {
                            resPic = listItem.coverPicUrl.lastIndexOf("|")>-1?listItem.coverPicUrl.split("|")[0]:listItem.coverPicUrl;
                        } else {
                            resPic = "//img10.allinmd.cn/default/loading/225_150.jpg";
                        }
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                resouTypCont = '<span class="case_l resource_list_stat_type_video">视频</span>';
                                video_play_time = '<span class="video_play_time">' + listItem.playTime + '</span>';
                                videoBtn = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png" alt=""></i>';
                                break;
                            case 2:
                                resouTypCont = '<span class="case_l resource_list_stat_type_lib">文库</span>';
                                break;
                            case 4:
                                resouTypCont = '<span class="case_l resource_list_stat_type_topic">话题</span>';
                                break;
                            case 7:
                                resouTypCont = '<span class="case_l resource_list_stat_type_case">病例</span>';
                                break;
                        }
                        var authorName = '';
                        if(listItem.resourceType==1){
                            if(listItem.ownerNameStr&&listItem.ownerNameStr.split(",").length&&listItem.ownerNameStr.split(",").length>=2){//多作者
                                isShowAuth = true;//是多作者
                            }
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        //判断有几个社交内容
                        if (data.isSocial !== undefined) {
                            for (var k = 0; k < data.isSocial.length; k++) {
                                switch (parseInt(data.isSocial[k])) {
                                    //浏览数
                                    case 1:
                                        resou_socialNum += '<span class="case_see_m"><i class="case_seeNum_m"></i>' + listItem.browseNum.toW() + '</span>';
                                        break;
                                    //收藏
                                    case 2:
                                        resou_socialNum += '<span class="case_collect_m"><i class="case_collectNum_m"></i>' + listItem.collectionNum.toW() + '</span>';
                                        break;
                                    //评论
                                    case 3:
                                        resou_socialNum += '<span class="case_comment_m"><i class="case_commentNum_m"></i>' + ($.trim(listItem.reviewNum)?listItem.reviewNum.toString().toW():'') + '</span>';
                                        break;
                                    //点赞
                                    case 4:
                                        resou_socialNum += '<span class="case_praise_m"><i class="case_praiseNum_m"></i>' + ($.trim(listItem.preferUpNum)?listItem.preferUpNum.toString().toW():"") + '</span>';
                                        break;
                                //        粉丝
                                //        关注
                                //        贡献
                                }
                            }
                        }
                        var isPromotHtml = '';//晋级的图片
                        if(data.item.isShowPromoted!=0&&(data.item.isShowPromoted==listItem.isPromoted)){//晋级的作品
                            if(listItem.coverPicUrl=='') {//如果资源不显示图片(文库不显示图片，话题有图显示无图不显示)
                                isPromotHtml = '<i class="promotion_noPic"></i>';
                                if (listItem.promotedName && listItem.promotedName != '') {//表示晋级并且有晋级名称
                                    if (listItem.promotedName.length <= 2) {
                                        isPromotHtml = '<i class="promotion_noPic smallImage">晋级'+listItem.promotedName+'</i>';
                                    } else if (listItem.promotedName.length > 2 && listItem.promotedName.length <= 3) {
                                        isPromotHtml = '<i class="promotion_noPic bigImage">晋级'+listItem.promotedName+'</i>';
                                    }
                                }
                            }else{
                                isPromotHtml = '<i class="promotion"></i>';
                                if (listItem.promotedName && listItem.promotedName != '') {//表示晋级并且有晋级名称
                                    if (listItem.promotedName.length <= 2) {
                                        isPromotHtml = '<i class="promotion smallImage">晋级'+listItem.promotedName+'</i>';
                                    } else if (listItem.promotedName.length > 2 && listItem.promotedName.length <= 3) {
                                        isPromotHtml = '<i class="promotion bigImage">晋级'+listItem.promotedName+'</i>';
                                    }
                                }
                            }
                        }
                        //排行榜70%
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                            resourceRankHtml += '<section class="case_detail_m">' +
                                ((data.item.isShowSort&&data.item.isShowSort==1)?'<div class="rankingList"><i class="label"><img src="' + (rankNum < 4 ? "/images/img00/column/specialTemplate/label.png" : "/images/img00/column/specialTemplate/label_gray.png") + '" alt=""></i><span>' + (rankNum < 10 ? "0" + rankNum : rankNum) +'</span></div>':'')+
                                (listItem.coverPicUrl==""?isPromotHtml:'')+
                                '   <div class="case_content_m">' +
                                '   <div class="case_cont_left spTemp_left ' + ((listItem.coverPicUrl=='') ? "spTemp_noPic" : "") + ' ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt")&& (listItem.coverPicUrl!="")? "spTemp_right" : "spTemp_left") + '"><p class="case_title_l">' +
                                '   <p class="case_title_m">' +
                                '   <a href="' + listItem.pcUrl + '" target="_blank">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+ comm.getStrLen(listItem.title, 44) + '</a>' +
                                '   </p>' +
                                '   <p class="case_cont_m">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                '   <p class="case_info_m">' +
                                    resouTypCont + '<span class="case_aut_m"><i class="case_author_m"></i>' + authorName+ '</span>' +
                                (function(){
                                    var str='';
                                    if(!isShowAuth){
                                        str='<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 12) : "") + '</span>'
                                    }
                                    return str;
                                }()) +
                                resou_socialNum+'</span>' +
                                '   <span class="case_time_m">' + listItem.publishTime.split(" ")[0] + '</span>' +
                                '   </p></div>' +
                                    ((listItem.coverPicUrl!="") ? '<figure class="case_cont_right ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                    isPromotHtml+
                                    '   <a href="' + listItem.pcUrl + '" target="_blank">' +
                                '   <img class="bg" src="' + resPic + '" data-original="' + resPic + '" alt="">' +
                                    ((!listItem.playTime||listItem.playTime=="") ? "" : ('<i class="videoBtn">' +
                                '   <img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>' +
                                '   <i class="videoTime">' + listItem.playTime + '</i>')) +
                                '   </a>' +
                                '   </figure>' : "")+
                                '   </div>' +
                                '   </section>'
                        }
                        //排行榜30%
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                            resourceRankHtml +='<section class="case_detail_s">'+
                                ((data.item.isShowSort&&data.item.isShowSort==1)?'<div class="rankingList_noPic"><span style="background-color: ' + (rankNum < 4 ? "#f34b4b" : "#e1e1e1") + '">' + (rankNum < 10 ?  rankNum : rankNum) + '</span>+':'')+
                            '   </div>'+
                            '   <div class="case_content_s">'+
                            '   <div class="case_cont_left spTemp_left">'+
                            '   <p class="case_title_s">'+
                            '   <a href="' + listItem.pcUrl + '" target="_blank">' +(listItem.resourceForArea&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'') + comm.getStrLen(listItem.title, 44) + '</a>'+
                            '   </p>'+
                            //'   <p class="case_info_s">'+
                            //    resouTypCont + '<span class="case_aut_l"><i class="case_author_l"></i>' + listItem.author + '</span>' + resou_socialNum+'</span>' +
                            //'   </p>' +
                            '   <p class="case_otherMsg_s">' +
                                (function(){
                                    var str='';
                                    if(!isShowAuth){
                                        str='<span class="case_name_s">' + authorName + '</span><span class="case_hospital_s"><span class="case_prof_s">' + listItem.medicalTitleShow+ '</span>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 10) : "") + '</span>'
                                    }
                                    return str;
                                }()) +
                            '   </p>' +
                            '   </div>'+
                            '   </div>'+
                            '   </section>'
                        }
                        //排行榜100%显示
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                            resourceRankHtml += '<section class="case_detail_l">' +
                                ((data.item.isShowSort&&data.item.isShowSort==1)?'<div class="rankingList"><i class="label"><img src="' + (rankNum < 4 ? "/images/img00/column/specialTemplate/label.png" : "/images/img00/column/specialTemplate/label_gray.png") + '" alt=""></i><span>' + (rankNum < 10 ? "0" + rankNum : rankNum) +'</span></div>':'')+
                                (listItem.coverPicUrl==""?isPromotHtml:'')+
                            '   <div class="case_content_l">' +
                            '   <div class="case_cont_left spTemp_left ' + ((listItem.coverPicUrl=='') ? "spTemp_noPic" : "") + ' ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt")&& (listItem.coverPicUrl!="")? "spTemp_right" : "spTemp_left") + '"><p class="case_title_l">' +
                            '   <p class="case_title_l">' +
                            '   <a href="' + listItem.pcUrl + '" target="_blank">' +(listItem.resourceForArea&&data.item.isShowArea==1?'<span class="al-actAreaColor">【'+listItem.resourceForArea+'】</span>':'')+ comm.getStrLen(listItem.title, 44) + '</a>' +
                            '   </p>' +
                            '   <p class="case_cont_l">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                            '   <p class="case_info_l">' +
                                resouTypCont +
                                (function(){
                                    var str='';
                                    if(listItem.author){
                                        str+= '<span class="case_aut_l"><i class="case_author_l'+((listItem.videoType&&(listItem.videoType==17||listItem.videoType==18||listItem.videoType==19))?' authorNoUserId':'')+'"></i>' +  authorName + '</span>';
                                    }
                                    if(!isShowAuth){
                                        str+='<span class="case_hospital_s">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 22) : "") + '</span>'
                                    }
                                    return str;
                                }()) +
                                resou_socialNum+'</span>' +
                            '   <span class="case_time_m">' + (listItem.publishTime&&listItem.publishTime.length>0?listItem.publishTime.split(" ")[0]:"") + '</span>' +
                            '   </p></div>' +
                                ((listItem.coverPicUrl!="") ? '<figure class="case_cont_right ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                isPromotHtml+
                            '   <a href="' + listItem.pcUrl + '" target="_blank">' +
                            '   <img class="bg" src="' + resPic + '" data-original="' + resPic + '" alt="">' +
                                ((!listItem.playTime||listItem.playTime=="") ? "" : ('<i class="videoBtn">' +
                            '   <img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>' +
                            '   <i class="videoTime">' + listItem.playTime + '</i>')) +
                            '   </a>' +
                            '   </figure>' : "")+
                            '   </div>' +
                            '   </section>'
                        }
                    }
                }

                return resourceRankHtml;
            },
            //加载专家排行榜组件
            vipRankHtml: function (data) {
                var t = this;
                var vipRankHtml = "";
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            vip_socialNum = "",//专家排行社交内容
                            refId = listItem.refId, //关联ID
                            rankNum = "";
                        //判断排行榜前面显示数字
                        if (data.item.pageIndex) {
                            rankNum = j + 1 + (data.item.pageIndex - 1) * data.item.pageSize
                        } else {
                            rankNum = j + 1
                        }
                        //判断有几个社交内容
                        if (data.isSocial !== undefined) {
                            for (var k = 0; k < data.isSocial.length; k++) {
                                switch (parseInt(data.isSocial[k])) {
                                    case 3:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>评论<i>' + listItem.customerStatistic.reviewNum.toW() + '</i></span>';
                                        }
                                        break;
                                    case 4:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>赞<i>' + listItem.customerStatistic.othersUpNum.toW() + '</i></span>';
                                        }
                                        break;
                                    case 5:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>粉丝<i>' + listItem.customerStatistic.fansNum.toW() + '</i></span>';
                                        }
                                        break;
                                    case 6:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>关注<i>' + listItem.customerStatistic.followTrendsNum.toW() + '</i></span>';
                                        }
                                        break;
                                    case 7:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>贡献<i>' + listItem.customerStatistic.contributionCount.toW() + '</i></span>';
                                        }
                                        break;
                                }
                            }
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                            vipRankHtml +=
                                '<section class="doctor_detail_m">' +
                                '<div class="doctor_content_m">' +
                                '<p class="' + (rankNum < 4 ? 'num' : 'num_1') + '">' +
                                '<span>' + (rankNum < 10 ? 0 + rankNum : rankNum) + '</span>' +
                                '</p>' +
                                '<p class="pic">' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '" data-original="' + listItem.coverPicUrl + '" alt=""></a>' +
                                '</p>' +
                                '<div class="doctor_info_m">' +
                                '<p>' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '" class="doctor_name_m">' + listItem.title + '</a><span>' + listItem.medicalTitleShow + '</span><span class="doctor_hospital_m">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 40) : "") + '</span>' +
                                '</p>' +
                                '<p class="doctor_otherMsg_m">' +
                                vip_socialNum +
                                '</p>' +
                                '</div>' +
                                '</div>' +
                                '</section>';
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                            vipRankHtml +=
                                '<section class="doctor_detail_m">' +
                                '<div class="doctor_content_m">' +
                                '<p class="' + (rankNum < 4 ? 'num' : 'num_1') + '">' +
                                '<span>' + (rankNum < 10 ? 0 + rankNum : rankNum) + '</span>' +
                                '</p>' +
                                '<p class="pic">' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '" data-original="' + listItem.coverPicUrl + '" alt=""></a>' +
                                '</p>' +
                                '<div class="doctor_info_m">' +
                                '<p>' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '" class="doctor_name_m">' + listItem.title + '</a><span>' + listItem.medicalTitleShow + '</span><span class="doctor_hospital_m">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 40) : "") + '</span>' +
                                '</p>' +
                                '<p class="doctor_otherMsg_m">' +
                                vip_socialNum +
                                '</p>' +
                                '</div>' +
                                '</div>' +
                                '</section>';
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                            vipRankHtml +=
                                '<section class="doctor_detail_s">' +
                                '<div class="doctor_content_s">' +
                                '<p class="' + (rankNum < 4 ? 'num' : 'num_1') + '">' +
                                '<span>' + rankNum + '</span>' +
                                '</p>' +
                                '<p class="pic">' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '"><img src="' + listItem.coverPicUrl + '" data-original="' + listItem.coverPicUrl + '" alt=""></a>' +
                                '</p>' +
                                '<div class="doctor_info_s">' +
                                '<p>' +
                                '<a href="/pages/personal/others_contribution.html?cid=' + refId + '" class="doctor_name_s">' + (listItem.title ? comm.getStrLen(listItem.title, 10) : "") + '</a><span>' + listItem.medicalTitleShow + '</span>' +
                                '</p>' +
                                '<p class="doctor_hospital_s">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 20) : "") + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</section>';
                        }
                    }
                }
                return vipRankHtml;
            },
            //加载推荐位组件
            posidListHtml: function (data) {
                var posidListHtml = ""
                if (data.moduleItem && data.moduleItem.length > 0) {
                    //如果为70%则最多显示3个，最少显示2个
                    if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')&&data.moduleItem.length > 4) {
                        data.moduleItem.length = 3;
                    }else if(data.moduleItem.length > 4){
                        data.moduleItem.length = 4;
                    }
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            video_play_time = "",//视频播放时间
                            videoBtn_small = ""//视频播放按钮
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="videoTime">' + listItem.playTime + '</span>';
                                videoBtn_small = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>';
                                break;
                        }
                        //判断有几个资源，样式的改变,100%推荐位只有显示3个以上
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                            if (data.moduleItem.length <= 2) {
                                posidListHtml = ""
                            } else if (data.moduleItem.length == 3) {
                                posidListHtml += '<a href="' + listItem.pcUrl + '" class="recommend_intro3_content_l" target=' + (/allinmd/.test(listItem.h5Url) ? "_self" : "_blank") + '>' +
                                    '<dl>' +
                                    '<dt class="pic"><img class="recommend_pic_img" src="' + listItem.coverPicUrl + '">' +
                                    '<i class="label_small"><img src="' + listItem.logoPicUrl + '"></i>' +
                                    videoBtn_small +
                                    video_play_time +
                                    '</dt>' +
                                    '<dd class="title">' + (listItem.title ? comm.getStrLen(listItem.title, 32) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            } else {
                                posidListHtml += '<a href="' + listItem.pcUrl + '" class="recommend_intro4_content_l" target=' + (/allinmd/.test(listItem.h5Url) ? "_self" : "_blank") + '>' +
                                    '<dl>' +
                                    '<dt class="pic"><img src="' + listItem.coverPicUrl + '">' +
                                    '<i class="label_small"><img src="' + listItem.logoPicUrl + '"></i>' +
                                    videoBtn_small +
                                    video_play_time +
                                    '</dt>' +
                                    '<dd class="title">' + (listItem.title ? comm.getStrLen(listItem.title, 32) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            }
                        }
                        //70%推荐位只显示3个
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                            if (data.moduleItem.length <= 1) {
                                posidListHtml = ""
                            } else if (data.moduleItem.length == 2) {
                                posidListHtml += '<a href="' + listItem.pcUrl + '" class="recommend_intro2_content_m" target=' + (/allinmd/.test(listItem.h5Url) ? "_self" : "_blank") + '>' +
                                    '<dl>' +
                                    '<dt class="pic">' +
                                    '<img src="' + listItem.coverPicUrl + '">' +
                                    '<i class="label_small"><img src="' + listItem.logoPicUrl + '"></i>' +
                                    videoBtn_small +
                                    video_play_time +
                                    '</dt>' +
                                    '<dd class="title">' + (listItem.title ? comm.getStrLen(listItem.title, 32) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            } else {
                                posidListHtml += '<a href="' + listItem.pcUrl + '" class="recommend_intro3_content_m" target=' + (/allinmd/.test(listItem.h5Url) ? "_self" : "_blank") + '>' +
                                    '<dl>' +
                                    '<dt class="pic"><img src="' + listItem.coverPicUrl + '">' +
                                    '<i class="label_small"><img src="' + listItem.logoPicUrl + '"></i>' +
                                    videoBtn_small +
                                    video_play_time +
                                    '</dt>' +
                                    '<dd class="title">' + (listItem.title ? comm.getStrLen(listItem.title, 32) : "") + '</dd>' +
                                    '</dl>' +
                                    '</a>'
                            }
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                            posidListHtml += '<a href="' + listItem.pcUrl + '" class="recommend_intro1_content_s" target=' + (/allinmd/.test(listItem.h5Url) ? "_self" : "_blank") + '>' +
                                '<dl>' +
                                '<dt class="pic"><img src="' + listItem.coverPicUrl + '">' +
                                '<i class="label_small"><img src="' + listItem.logoPicUrl + '"></i>' +
                                videoBtn_small +
                                video_play_time +
                                '</dt>' +
                                '<dd class="title">' + (listItem.title ? comm.getStrLen(listItem.title, 32) : "") + '</dd>' +
                                '</dl>' +
                                '</a>'
                        }
                    }
                }
                return posidListHtml;
            },
            //加载滚动栏组件
            scrollListHtml: function (data) {
                var scrollListHtml = ""
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            video_play_time = "",//视频播放时间
                            videoBtn_small = "",//视频播放按钮
                            isShowAuth = false;//是否显示多作者
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="videoTime">' + listItem.playTime + '</span>';
                                videoBtn_small = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>';
                                break;
                        }
                        var authorName = '';
                        if(listItem.resourceType==1){
                            if(listItem.ownerNameStr&&listItem.ownerNameStr.split(",").length&&listItem.ownerNameStr.split(",").length>=2){//多作者
                                isShowAuth = true;//是多作者
                            }
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        //判断是资源滚动栏1？会员滚动栏2
                        if (data.item.recommendType == 1) {
                            scrollListHtml += '<a href="' + listItem.pcUrl + '" class="works_detail" target="_blank">' +
                                '<dl>' +
                                '<dt class="pic">' + video_play_time + '<img src="' + listItem.coverPicUrl + '">' + videoBtn_small + '</dt>' +
                                '<dd class="works_title">' + (listItem.title ? comm.getStrLen(listItem.title, 56) : "") + '</dd>' +
                                '<dd class="expert_name"><span><i class="scroll_author"></i>' + authorName + '</span></dd>' +
                                '</dl>' +
                                '</a>'
                        }
                        if (data.item.recommendType == 2) {
                            scrollListHtml += '<a href="/pages/personal/others_contribution.html?cid=' + listItem.customerStatistic.customerId + '" class="expert_detail" target="_blank">' +
                                '<dl>' +
                                '<dt class="pic"><img src="' + listItem.coverPicUrl + '"></dt>' +
                                '<dd class="expert_name">' + (listItem.title ? comm.getStrLen(listItem.title, 18) : "") + '</dd>' +
                                '<dd class="expert_info"><p class="prof_title">' + listItem.medicalTitleShow + '</p><p>' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 22) : "") + '</p></dd>' +
                                '</dl>' +
                                '</a>'
                        }
                        if (data.item.recommendType == 3) {
                            scrollListHtml += '<a href="' + listItem.pcUrl + '" class="works_detail" target="_blank">' +
                                '<dl>' +
                                '<dt class="pic">' + video_play_time + '<img src="' + listItem.coverPicUrl + '">' + videoBtn_small + '</dt>' +
                                '<dd class="works_title">' + (listItem.title ? comm.getStrLen(listItem.title, 56) : "") + '</dd>' +
                                '</dl>' +
                                '</a>'
                        }
                    }
                }
                return scrollListHtml;
            },
            //加载新闻组件
            newsListHtml: function (data) {
                var t = this;
                var newsListHtml = "";
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j];
                        newsListHtml += listItem.cnNewsBody
                    }
                }
                return newsListHtml;
            },
            //   加载筛选列表
            screenList:function(data){
                var t = this;
                var preferUp = "",//是否存在点赞
                    screenListHtml = "",//筛选的结构
                    screenSourceHtml = '',//被筛选出的列表
                    scrItemOne = '',//第一级筛选数据
                    scrItemTwo = '',//第二级筛选数据
                    scrItemThree = '';//第三级筛选数据
                //筛选的内容区
                var scrItem = data.item.chooseRecommendListMap;//筛选项数据
                var sctSourceList = data.item.recommendResourceListMap;//筛选资源数据
                var scrSourceListHtml = '';
                if(scrItem){
                    for(var i = 0;i<scrItem.length;i++){
                        if(scrItem[i].property_2&&scrItem[i].property_2.length>0){
                            scrItemTwo = '';
                            for(var j = 0;j<scrItem[i].property_2.length;j++){
                                if(scrItem[i].property_2[j].property_3&&scrItem[i].property_2[j].property_3.length>0){
                                    scrItemThree = '';
                                    for(var z = 0;z<scrItem[i].property_2[j].property_3.length;z++){
                                        scrItemThree += '<p data-fullPath="'+(scrItem[i].property_2[j].property_3[z].propertyFullPath?scrItem[i].property_2[j].property_3[z].propertyFullPath:'')+'">'+scrItem[i].property_2[j].property_3[z].propertyName+'<span>'+((scrItem[i].property_2[j].property_3[z].resourceCount||scrItem[i].property_2[j].property_3[z].resourceCount==0)?'（'+scrItem[i].property_2[j].property_3[z].resourceCount+'）':'')+'</span></p>'
                                    }
                                    scrItemTwo +='<div data-fullPath="'+(scrItem[i].property_2[j].propertyFullPath?scrItem[i].property_2[j].propertyFullPath:'')+'"><article>'+scrItem[i].property_2[j].propertyName+'<span>'+((scrItem[i].property_2[j].resourceCount||scrItem[i].property_2[j].resourceCount==0)?'（'+scrItem[i].property_2[j].resourceCount+'）':'')+'</span></article>'+(scrItem[i].property_2[j].propertyName=="全部"?'':'<i></i>')+'' +
                                        '<aside class="menuThird">'+scrItemThree+'</aside>' +
                                        '</div>'
                                }else{
                                    scrItemTwo +='<div data-fullPath="'+(scrItem[i].property_2[j].propertyFullPath?scrItem[i].property_2[j].propertyFullPath:'')+'">'+scrItem[i].property_2[j].propertyName+'<span>'+((scrItem[i].property_2[j].resourceCount||scrItem[i].property_2[j].resourceCount==0)?'（'+scrItem[i].property_2[j].resourceCount+'）':'')+'</span>' +
                                        '</div>'
                                }
                            }
                            scrItemOne += '<li data-fullPath="'+(scrItem[i].propertyFullPath?scrItem[i].propertyFullPath:'')+'">'+
                                '<div class="menuFirst"><article>'+scrItem[i].propertyName+'<span>（'+(scrItem[i].resourceCount?scrItem[i].resourceCount:'0')+'）</span></article>'+(scrItem[i].propertyName=="全部"?'':'<i></i>')+'</div>'+
                                '<aside class="menuSecond">'+scrItemTwo+'</aside>'+
                                '</li>'
                        }else{
                            scrItemOne += '<li data-fullPath="'+(scrItem[i].propertyFullPath?scrItem[i].propertyFullPath:'')+'">'+
                                '<div class="menuFirst '+(scrItem[i].propertyName=="全部"?'active':'')+'"><article>'+scrItem[i].propertyName+'<span>（'+(scrItem[i].resourceCount?scrItem[i].resourceCount:'0')+'）</span></article></div>'+
                                '</li>'
                        }
                        t.config.screenHtml = scrItemOne;
                    }
                }
                $.each(sctSourceList,function(i,v){
                    var picUrlHtml = '';//存放图片
                        videoHtml = '',//存放视频样式
                        upHtml = '',//晋级标示
                        workType = '',//判断作品类型
                        isPrefer = v.customerPreferIsValid, //是否点赞
                        refId = v.refId, //关联ID
                        resouTyp = v.resourceType;
                    switch(v.typeId){
                        case 1:
                            workType = '<span class="recourseType recourseType_video">视频</span>';
                            break;
                        case 2:
                            workType = '<span class="recourseType recourseType_lib">PDF</span>';
                            break;
                        case 4:
                            workType = '<span class="recourseType recourseType_topic">话题</span>';
                            break;
                        case 7:
                            workType = '<span class="recourseType recourseType_case">病例</span>';
                            break;

                    }
                    if(v.typeId==1){
                        var videoHtml = '<i class="al-contentVideoBtn">'+
                            '                  <img src="/images/img10/v3/common/icon/video_btn.png" alt="">'+
                            '            </i>' +
                            '            <i class="al-contentVideoTime">' + v.playTime + '</i>'
                    }
                    //将图片进行截取
                    if(v.coverPicUrl.indexOf("|")>-1){
                        v.coverPicUrl = v.coverPicUrl.substring(0,v.coverPicUrl.indexOf("|"));
                    }
                    var isPromotHtml = '';//晋级的图片
                    if(data.item.isShowPromoted!=0&&(data.item.isShowPromoted==v.isPromoted)){//晋级的作品
                        if(v.typeId==1||v.typeId==7){//如果是视频或病例（都有图片）
                            isPromotHtml = '<i class="promotion"></i>';
                            if (v.promotedName && v.promotedName != '') {//表示晋级并且有晋级名称
                                if (v.promotedName.length <= 2) {
                                    isPromotHtml = '<i class="promotion smallImage">晋级'+v.promotedName+'</i>';
                                } else if (v.promotedName.length > 2 && v.promotedName.length <= 3) {
                                    isPromotHtml = '<i class="promotion bigImage">晋级'+v.promotedName+'</i>';
                                }
                            }
                        }else{//否则判断是否有图片
                            if(v.coverPicUrl=='') {//如果资源不显示图片(文库不显示图片，话题有图显示无图不显示)
                                isPromotHtml = '<i class="promotion_noPic"></i>';
                                if (v.promotedName && v.promotedName != '') {//表示晋级并且有晋级名称
                                    if (v.promotedName.length <= 2) {
                                        isPromotHtml = '<i class="promotion_noPic smallImage">晋级'+v.promotedName+'</i>';
                                    } else if (v.promotedName.length > 2 && v.promotedName.length <= 3) {
                                        isPromotHtml = '<i class="promotion_noPic bigImage">晋级'+v.promotedName+'</i>';
                                    }
                                }
                            }else{
                                isPromotHtml = '<i class="promotion"></i>';
                                if (v.promotedName && v.promotedName != '') {//表示晋级并且有晋级名称
                                    if (v.promotedName.length <= 2) {
                                        isPromotHtml = '<i class="promotion smallImage">晋级'+v.promotedName+'</i>';
                                    } else if (v.promotedName.length > 2 && v.promotedName.length <= 3) {
                                        isPromotHtml = '<i class="promotion bigImage">晋级'+v.promotedName+'</i>';
                                    }
                                }
                            }
                        }
                    }
                    //如果类型不是文库，文库没有图片
                    if(v.typeId!=2&&v.typeId!=4){
                        picUrlHtml = '<aside class="resourseImg">'+
                            '                        <a href="'+ (v.pcUrl?v.pcUrl:"javascript:;") +'" target="_blank">'+
                            '                            <img src="'+(v.coverPicUrl?v.coverPicUrl:'/images/img10/default/loading/225_150.jpg')+'" alt="">'+
                                                        videoHtml+
                            //(v.isPromoted==1?'<i class="promotion"></i>':'')+
                            isPromotHtml+
                            '                        </a>'+
                            '                    </aside>'
                    }else if(v.typeId==4&&v.coverPicUrl!=''){
                        picUrlHtml = '<aside class="resourseImg">'+
                            '                        <a href="'+ (v.pcUrl?v.pcUrl:"javascript:;") +'" target="_blank">'+
                            '                            <img src="'+v.coverPicUrl+'" alt="">'+
                            videoHtml+
                            (v.isPromoted==1?'<i class="promotion"></i>':'')+
                            isPromotHtml+
                            '                        </a>'+
                            '                    </aside>'
                    }else{
                        picUrlHtml = isPromotHtml;
                    }
                    //判断点赞状态
                    var preferUp = '';
                    if(v.scoreResult==0){
                        preferUp = '<span class="resPraise resource_list_assist ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") +
                            '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                    }else{
                        preferUp = '<span class="al-actScoreNumBox"><i class="al-actScoreNum">'+v.scoreResult+'</i>分</span>';
                    }
                    scrSourceListHtml += '<li>'+
                        '                    <aside class="resourseText" style="'+(v.typeId==2||(v.typeId==4&&v.coverPicUrl=='')?'width:100%':'')+'">'+
                        '                        <a href="'+ (v.pcUrl?v.pcUrl:'javascript:;')+'" target="_blank"><span>' +(v.resourceForArea&&v.isShowArea==1?'<span class="al-actAreaColor">【'+v.resourceForArea+'】</span>':'')+(v.title||v.title&&(v.coverPicUrl!=''||v.typeId!=2) ? comm.getStrLen(v.title, 34) : comm.getStrLen(v.title, 34))+ '</span></a>'+
                        '                        <p class="resTextCont">' + (v.summary ? comm.getStrLen(v.summary, 100) : "") + '</p>'+
                        (v.pcUrl?'                        <aside class="contentOtherMsg">'+
                                                workType+
                                                (function(){
                                                    var str='';
                                                    if(v.author){
                                                        str+='      <span class="al-contentAuthorBox"><i class="al-contentAuthor'+((v.videoType&&(v.videoType==17||v.videoType==18||v.videoType==19))?' authorNoUserId':'')+'"></i>'+v.author+'</span>';
                                                    }
                                                    return str;
                                                }()) +
                        '                            <span class="al-contentHospBox">'+ (v.hospitalName ? comm.getStrLen(v.hospitalName, 12) : "") +'</span>'+
                        '                            <span><i class="al-contentWatchedNum"></i>' + v.browseNum.toW() + '</span>'+
                        '                            <span class="ev-preferNum"><i class="commentNum"></i><b>' +((isPrefer==1&&v.preferUpNum==0)?"1":v.preferUpNum.toString().toW())  + '</b></span>'+
                        //'                            <i class="resPraise resource_list_assist resource_list_assist_no"><b></b>点赞</i>'+
                                                preferUp+//判断是点赞还是评分
                        '                        </aside>':'')+
                        '                    </aside>'+
                                            picUrlHtml+//是否有图片
                        //(v.isPromoted==1&&v.coverPicUrl==''&& (v.typeId==2||v.typeId==4)?'<i class="promotion_noPic"></i>':'')+//是否有晋级的标示
                        '                </li>';
                    screenSourceHtml = scrSourceListHtml;
                });
                t.clickPraise();
                return screenSourceHtml;
            },
            //分页
            addList: function () {
                var t = this;
                if (ev.resTemplate && ev.resTemplate.bo.responseData) {
                    var dataItem = ev.resTemplate.bo.responseData.data_list;
                    if (dataItem && dataItem.length > 0) {
                        for (var i = 0; i < dataItem.length; i++) {
                            var item = dataItem[i],
                                dataId = item.colMenuLayoutModuleId,//???(模板中的id和请求中的id相互对应)
                                aa = item.componentType,//标识为排行榜类型
                                moduleItem = item.recommendResourceListMap,//排行榜的各项
                                recommendType = item.recommendType//???
                            if (item.settingElement) {
                                var isSocial = item.settingElement.split(',')  //社交选项(2,3)
                            }
                            if (item.componentType == 1) {
                                var resourceHtml = t.resourceListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 2) {
                                var vipHtml = t.vipListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                            }
                            //加载排行榜
                            if (item.componentType == 3 && recommendType == 1) {
                                var reRankHtml = t.resourceRankHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 3 && recommendType == 2) {
                                var vipRankHtml = t.vipRankHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 4) {
                                var newsHtml = t.newsListHtml({
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 5) {
                                var posidHtml = t.posidListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    isSocial: isSocial,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 6) {
                                var scrollHtml = t.scrollListHtml({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                            }
                            if (item.componentType == 8) {
                                var specialHtml = t.specialListHtml({
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                            }
                            /*
                            活动三期筛选列表
                             */
                            if(item.componentType == 10 && item.recommendType == 6){
                                var screenSourceHtml = t.screenList({
                                    item: item,
                                    moduleItem: moduleItem,
                                    dataId: dataId
                                });
                            }
                            //组件名称
                            var LContainer = $('.sp_container_l div[data-id=' + dataId + ']');
                            var MContainer = $('.sp_container_m div[data-id=' + dataId + ']');
                            var SContainer = $('.sp_container_s div[data-id=' + dataId + ']');
                            //如果是一个30%的样式将标题进行截取
                            if(SContainer.length>0){
                                var moduleTitle = (item.title ? comm.getStrLen(item.title, 24) : "");//组件标题
                            }else{
                                var moduleTitle = (item.title ? comm.getStrLen(item.title, 50) : "");//组件标题
                            }
                            $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                            //资源列表
                            if (LContainer.length > 0 && aa == 1) {
                                LContainer.children('.resource_list').html(resourceHtml);
                                t.clickPraise();
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_list').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                LContainer.data("item", item);
                                var pageCbkL = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                    isShowPromoted:item.isShowPromoted
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.resourceListHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.resource_list').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageCbkL(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        LContainer.find(".pager").pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageCbkL(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                            if (MContainer.length > 0 && aa == 1) {
                                    MContainer.children('.resource_list').html(resourceHtml);
                                    t.clickPraise();
                                    var isShowMore = item.isShowMore; //是否有更多
                                    if (isShowMore&&isShowMore==1) {
                                        $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                        $('div[data-id=' + dataId + '] .resource_list').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                    }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                        $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                        var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                        MContainer.append(_isPage);
                                    }
                                    MContainer.data("item", item);
                                    var pageCbkM = function (dataId, container) {
                                        var item = container.data("item");
                                        return function (pageclickednumber) {
                                            t.ajaxFn({
                                                url: t.config.url,
                                                param: {
                                                    paramJson: $.toJSON({
                                                        pageIndex: pageclickednumber,
                                                        pageSize: item.pageNum,
                                                        customerId: item.customerId,
                                                        visitSiteId: 1,
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
                                                        resourceStartTime:item.resourceStartTime,
                                                        rankingResourceType:item.rankingResourceType,
                                                        searchParam:item.resourceTagName,
                                                        isShowSort:item.isShowSort,
                                                        isShowArea:item.isShowArea,
                                                        isShowPromoted:item.isShowPromoted
                                                    })
                                                },
                                                fn: function (data) {
                                                    var pageItem = data.bo.responseData.data_list[0],
                                                        moduleItem = pageItem.recommendResourceListMap;
                                                    var pageResourceHtml = t.resourceListHtml({
                                                        item: pageItem,
                                                        moduleItem: moduleItem,
                                                        isSocial: item.settingElement.split(','),
                                                        dataId: dataId
                                                    });
                                                    container.find('.resource_list').html(pageResourceHtml);
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageCbkM(dataId, container)
                                                    });
                                                    t.clickPraise();
                                                }
                                            });
                                        }
                                    };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageCbkM(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            if (SContainer.length > 0 && aa == 1) {
                                SContainer.children('.resource_list').html(resourceHtml);
                                var isShowMore = item.isShowMore; //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_list').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }
                                t.overScroll(dataId, ".resource_list", ".resource_list_box_s");
                            }
                                /*
                                 活动三期筛选列表
                                 */
                            if(LContainer.length >0 && aa == 10){
                                LContainer.find('.screenList').html(t.config.screenHtml);
                                LContainer.find('.resourseList').html(screenSourceHtml);
                                //判断没有数据，显示图片
                                if(screenSourceHtml==''){
                                    $('.resourseList').hide();
                                    $('.noneResourse').show();
                                }
                                $('.sp_container_l div[data-id=' + dataId + ']').addClass("relati");
                                //$('.sp_container_l div[data-id=' + dataId + ']').css("posoition","relative");
                                //判断添加分页还是查看更多
                                if (item.totalCount>20){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                cliAddHei();
                                $(".page-container").addClass("pagePosi");
                                var heig = $(".relati").height();
                                $(".page-container").css("top",heig+"px");
                                $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                t.clickPraise();//点赞
                                LContainer.data("item", item);
                                //第一层的点击
                                $('.sp_container_l .screenList li').off("click").on('click',function(e){
                                    e.stopPropagation();
                                    var th = $(this);
                                    //判断如果点击的一级下面没有二级的东西则再次点击时没有移除类的操作
                                    if($(this).find('.menuSecond').length>0){
                                        if(th.find('.menuFirst').hasClass('active')){
                                            th.find('.menuFirst').removeClass('active').next().hide();
                                            $(".menuFirst").removeClass("activeUp");
                                            th.find('.menuFirst').addClass('activeUp');
                                        }else if(th.find('.menuFirst').hasClass('activeUp')){
                                            th.find('.menuFirst').removeClass('activeUp').next().show();
                                            th.find('.menuFirst').removeClass('activeUp').siblings().removeClass("activeUp");
                                            th.find('.menuFirst').addClass('active').siblings().removeClass("active");
                                        }else{
                                            $('.sp_container_l .menuSecond div').removeClass('active');
                                            $('.sp_container_l .menuSecond div').removeClass('activeUp');
                                            $('.sp_container_l .menuThird p').removeClass('active');
                                            $('.sp_container_l .menuThird p').removeClass('activeUp');
                                            $(".menuFirst").removeClass("activeUp");
                                            $('.menuThird').hide();
                                            $('.menuSecond').hide();
                                            th.find('.menuSecond').show();
                                            th.find('.menuFirst').addClass('active').siblings().removeClass("active");
                                            th.siblings().find('.menuFirst').removeClass('active').next().hide()
                                        }
                                        cliAddHei();//添加高度
                                    }else{
                                        if(!th.find('.menuFirst').hasClass('active')){
                                            th.find('.menuSecond').show();
                                            $('.sp_container_l .menuSecond div').removeClass('activeUp');
                                            th.find('.menuFirst').addClass('active');
                                            th.siblings().find('.menuFirst').removeClass('active').next().hide();
                                            th.siblings().find('.menuFirst').removeClass('activeUp')
                                            var propertyFullPath = $(this).attr("data-fullPath");
                                            t.ajaxFn({
                                                url: t.config.screenUrl,
                                                param: {
                                                    paramJson: $.toJSON({
                                                        columnId:item.columnId,
                                                        visitSiteId:1,
                                                        isSelect:0,//  是否多选 1多选0单选
                                                        propertyFullPath:$(this).attr("data-fullPath"),
                                                        firstResult:0,
                                                        maxResult:20,
                                                        customerId:$("#sesCustomerId").val(),
                                                    })
                                                },
                                                fn: function (data) {
                                                    if(!$.isEmptyObject(data.bo.responseData.data_list[0].recommendResourceListMap)){
                                                        if(data.bo.responseData.data_list[0].totalCount>20){
                                                            $('.page-container').show();
                                                        }else{
                                                            $('.page-container').hide();
                                                        }
                                                        $(".noneResourse").hide();
                                                        $(".resourseList").show();
                                                        var pageItem = data.bo.responseData.data_list[0],
                                                            moduleItem = pageItem.recommendResourceListMap;
                                                        var screenSourceListHtml = t.screenList({
                                                            item: pageItem,
                                                            moduleItem: moduleItem,
                                                            dataId: dataId
                                                        });
                                                        LContainer.find('.resourseList').html(screenSourceListHtml);
                                                        $(".page-container").remove();
                                                        if (data.bo.responseData.data_list[0].totalCount>20){
                                                            $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                                            var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                                            LContainer.append(_isPage);
                                                        }
                                                        //分页的点击事件
                                                        var pageCbkL = function (dataId, container) {
                                                            var item = data.bo.responseData.data_list[0];
                                                            item = container.data("item");
                                                            return function (pageclickednumber) {
                                                                t.ajaxFn({
                                                                    url: t.config.screenUrl,
                                                                    param: {
                                                                        paramJson: $.toJSON({
                                                                            columnId: item.columnId,
                                                                            visitSiteId: 2,
                                                                            pageIndex: pageclickednumber,
                                                                            pageSize: 20,
                                                                            propertyFullPath: propertyFullPath,//单选时传的参数
                                                                            isSelect: 0,//是否是多选0单选，1多选
                                                                            customerId: $("#sesCustomerId").val(),
                                                                            isShowPromoted:item.isShowPromoted
                                                                        })
                                                                    },
                                                                    fn: function (data) {
                                                                        var pageItem = data.bo.responseData.data_list[0],
                                                                            moduleItem = pageItem.recommendResourceListMap;
                                                                        var screenSourceListHtml = t.screenList({
                                                                            item: pageItem,
                                                                            moduleItem: moduleItem,
                                                                            dataId: dataId
                                                                        });
                                                                        container.find('.resourseList').html(screenSourceListHtml);
                                                                        container.find(".pager").show().pager({
                                                                            pagenumber: pageclickednumber,
                                                                            pagecount: Math.ceil(pageItem.totalCount / 20),
                                                                            buttonClickCallback: pageCbkL(dataId, container)
                                                                        });
                                                                        cliAddHei();//添加高度
                                                                        $(".page-container").addClass("pagePosi");
                                                                        var heig = $(".relati").height();
                                                                        $(".page-container").css("top",heig+"px");
                                                                        $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                                        t.clickPraise();
                                                                    }
                                                                });
                                                            }
                                                        };
                                                        //将分页进行插入页面
                                                        if(Math.ceil(data.bo.responseData.data_list[0].totalCount / 20)>1){
                                                            LContainer.find(".pager").show().pager({
                                                                pagenumber: 1,
                                                                pagecount: Math.ceil(data.bo.responseData.data_list[0].totalCount / 20),
                                                                buttonClickCallback: pageCbkL(dataId, LContainer)
                                                            })
                                                        }
                                                    }else{
                                                        $(".resourseList").hide();
                                                        $('.page-container').hide();
                                                        $(".noneResourse").show();
                                                    }
                                                    cliAddHei();//添加高度
                                                    $(".page-container").addClass("pagePosi");
                                                    var heig = $(".relati").height();
                                                    $(".page-container").css("top",heig+"px");
                                                    $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                    t.clickPraise();
                                                }
                                            });
                                        }
                                    }
                                });
                                //第二层的点击
                                $('.sp_container_l .menuSecond div').off("click").on('click',function(e){
                                    e.stopPropagation();
                                    var th = $(this);
                                    if($(this).find('.menuThird').length>0){
                                        if(th.hasClass('active')){
                                            th.removeClass('active');
                                            th.addClass('activeUp').siblings().removeClass("activeUp");
                                            th.find('.menuThird').hide();
                                            th.find('p').eq(0).removeClass('not');
                                        }else if(th.hasClass('activeUp')){
                                            th.addClass('active').siblings().removeClass("active");
                                            th.removeClass('activeUp');
                                            th.find('.menuThird').show();
                                            th.find('p').eq(0).addClass('not');
                                        }else{
                                            th.find('.menuThird').show();
                                            th.addClass('active').siblings().removeClass("active");
                                            th.siblings().removeClass('active').children('.menuThird').hide();
                                            th.siblings().removeClass('activeUp').children('.menuThird').hide();
                                            th.find('p').eq(0).addClass('not');
                                        }
                                        cliAddHei();//添加高度
                                    }else{
                                        if(!th.hasClass('active')){
                                            $('.sp_container_l .menuThird p').removeClass("active");
                                            $('.sp_container_l .menuThird p').removeClass("activeUp");
                                            th.find('.menuThird').show();
                                            th.addClass('active').siblings().removeClass("active");
                                            th.siblings().removeClass('active').children('.menuThird').hide();
                                            th.siblings().removeClass('activeUp');
                                            th.find('p').eq(0).addClass('not');
                                            var propertyFullPath = $(this).attr("data-fullPath");
                                            t.ajaxFn({
                                                url: t.config.screenUrl,
                                                param: {
                                                    paramJson: $.toJSON({
                                                        columnId:item.columnId,
                                                        visitSiteId:1,
                                                        isSelect:0,//  是否多选 1多选0单选
                                                        propertyFullPath:$(this).attr("data-fullPath"),
                                                        firstResult:0,
                                                        maxResult:20,
                                                        customerId:$("#sesCustomerId").val(),
                                                    })
                                                },
                                                fn: function (data) {
                                                    if(!$.isEmptyObject(data.bo.responseData.data_list[0].recommendResourceListMap)){
                                                        if(data.bo.responseData.data_list[0].totalCount>20){
                                                            $('.page-container').show();
                                                        }else{
                                                            $('.page-container').hide();
                                                        }
                                                        $(".noneResourse").hide();
                                                        $(".resourseList").show();
                                                        var pageItem = data.bo.responseData.data_list[0],
                                                            moduleItem = pageItem.recommendResourceListMap;
                                                        var screenSourceListHtml = t.screenList({
                                                            item: pageItem,
                                                            moduleItem: moduleItem,
                                                            dataId: dataId
                                                        });
                                                        LContainer.find('.resourseList').html(screenSourceListHtml);
                                                        $(".page-container").remove();
                                                        if (data.bo.responseData.data_list[0].totalCount>20){
                                                            $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                                            var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                                            LContainer.append(_isPage);
                                                        }
                                                        //分页的点击事件
                                                        var pageCbkL = function (dataId, container) {
                                                            var item = data.bo.responseData.data_list[0];
                                                            item = container.data("item");
                                                            return function (pageclickednumber) {
                                                                t.ajaxFn({
                                                                    url: t.config.screenUrl,
                                                                    param: {
                                                                        paramJson: $.toJSON({
                                                                            columnId: item.columnId,
                                                                            visitSiteId: 2,
                                                                            pageIndex: pageclickednumber,
                                                                            pageSize: 20,
                                                                            propertyFullPath: propertyFullPath,//单选时传的参数
                                                                            isSelect: 0,//是否是多选0单选，1多选
                                                                            customerId: $("#sesCustomerId").val(),
                                                                            isShowPromoted:item.isShowPromoted
                                                                        })
                                                                    },
                                                                    fn: function (data) {
                                                                        var pageItem = data.bo.responseData.data_list[0],
                                                                            moduleItem = pageItem.recommendResourceListMap;
                                                                        var screenSourceListHtml = t.screenList({
                                                                            item: pageItem,
                                                                            moduleItem: moduleItem,
                                                                            dataId: dataId
                                                                        });
                                                                        container.find('.resourseList').html(screenSourceListHtml);
                                                                        container.find(".pager").show().pager({
                                                                            pagenumber: pageclickednumber,
                                                                            pagecount: Math.ceil(pageItem.totalCount / 20),
                                                                            buttonClickCallback: pageCbkL(dataId, container)
                                                                        });
                                                                        t.clickPraise();
                                                                        cliAddHei();//添加高度
                                                                        //此条必须放在添加高度后面，否则会影响分页的定位
                                                                        $(".page-container").addClass("pagePosi");
                                                                        var heig = $(".relati").height();
                                                                        $(".page-container").css("top",heig+"px");
                                                                        $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                                    }
                                                                });
                                                            }
                                                        };
                                                        //将分页进行插入页面
                                                        if(Math.ceil(data.bo.responseData.data_list[0].totalCount / 20)>1){
                                                            LContainer.find(".pager").show().pager({
                                                                pagenumber: 1,
                                                                pagecount: Math.ceil(data.bo.responseData.data_list[0].totalCount / 20),
                                                                buttonClickCallback: pageCbkL(dataId, LContainer)
                                                            })
                                                        }
                                                    }else{
                                                        $(".resourseList").hide();
                                                        $('.page-container').hide();
                                                        $(".noneResourse").show();
                                                    }
                                                    t.clickPraise();
                                                    cliAddHei();//添加高度
                                                    $(".page-container").addClass("pagePosi");
                                                    var heig = $(".relati").height();
                                                    $(".page-container").css("top",heig+"px");
                                                    $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                }
                                            });
                                        }
                                    }
                                });
                                //第三层的点击
                                $('.sp_container_l .menuThird p').off("click").on('click', function (e) {
                                    e.stopPropagation();
                                    var th = $(this);
                                    if(!th.hasClass('active')){
                                        th.addClass('active');
                                        th.siblings().removeClass('active');
                                        th.siblings().removeClass('activeUp');
                                        var propertyFullPath = $(this).attr("data-fullPath");
                                        t.ajaxFn({
                                            url: t.config.screenUrl,
                                            param: {
                                                paramJson: $.toJSON({
                                                    columnId:item.columnId,
                                                    visitSiteId:1,
                                                    isSelect:0,//  是否多选 1多选0单选
                                                    propertyFullPath:$(this).attr("data-fullPath"),
                                                    firstResult:0,
                                                    maxResult:20,
                                                    customerId:$("#sesCustomerId").val(),
                                                })
                                            },
                                            fn: function (data) {
                                                if(!$.isEmptyObject(data.bo.responseData.data_list[0].recommendResourceListMap)){
                                                    if(data.bo.responseData.data_list[0].totalCount>20){
                                                        $('.page-container').show();
                                                    }else{
                                                        $('.page-container').hide();
                                                    }
                                                    $(".noneResourse").hide();
                                                    $(".resourseList").show();
                                                    var pageItem = data.bo.responseData.data_list[0],
                                                        moduleItem = pageItem.recommendResourceListMap;
                                                    var screenSourceListHtml = t.screenList({
                                                        item: pageItem,
                                                        moduleItem: moduleItem,
                                                        dataId: dataId
                                                    });
                                                    LContainer.find('.resourseList').html(screenSourceListHtml);
                                                    $(".page-container").remove();
                                                    if (data.bo.responseData.data_list[0].totalCount>20){
                                                        $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                                        var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                                        LContainer.append(_isPage);
                                                    }
                                                    //分页的点击事件
                                                    var pageCbkL = function (dataId, container) {
                                                        var item = data.bo.responseData.data_list[0];
                                                        item = container.data("item");
                                                        return function (pageclickednumber) {
                                                            t.ajaxFn({
                                                                url: t.config.screenUrl,
                                                                param: {
                                                                    paramJson: $.toJSON({
                                                                        columnId: item.columnId,
                                                                        visitSiteId: 2,
                                                                        pageIndex: pageclickednumber,
                                                                        pageSize: 20,
                                                                        propertyFullPath: propertyFullPath,//单选时传的参数
                                                                        isSelect: 0,//是否是多选0单选，1多选
                                                                        customerId: $("#sesCustomerId").val(),
                                                                        isShowPromoted:item.isShowPromoted
                                                                    })
                                                                },
                                                                fn: function (data) {
                                                                    var pageItem = data.bo.responseData.data_list[0],
                                                                        moduleItem = pageItem.recommendResourceListMap;
                                                                    var screenSourceListHtml = t.screenList({
                                                                        item: pageItem,
                                                                        moduleItem: moduleItem,
                                                                        dataId: dataId
                                                                    });
                                                                    container.find('.resourseList').html(screenSourceListHtml);
                                                                    container.find(".pager").show().pager({
                                                                        pagenumber: pageclickednumber,
                                                                        pagecount: Math.ceil(pageItem.totalCount / 20),
                                                                        buttonClickCallback: pageCbkL(dataId, container)
                                                                    });
                                                                    t.clickPraise();
                                                                    $(".page-container").addClass("pagePosi");
                                                                    var heig = $(".relati").height();
                                                                    $(".page-container").css("top",heig+"px");
                                                                    $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                                }
                                                            });
                                                        }
                                                    };
                                                    //将分页进行插入页面
                                                    if(Math.ceil(data.bo.responseData.data_list[0].totalCount / 20)>1){
                                                        LContainer.find(".pager").show().pager({
                                                            pagenumber: 1,
                                                            pagecount: Math.ceil(data.bo.responseData.data_list[0].totalCount / 20),
                                                            buttonClickCallback: pageCbkL(dataId, LContainer)
                                                        })
                                                    }
                                                }else{
                                                    $(".resourseList").hide();
                                                    $('.page-container').hide();
                                                    $(".noneResourse").show();
                                                }
                                                t.clickPraise();
                                                cliAddHei();//添加高度
                                                $(".page-container").addClass("pagePosi");
                                                var heig = $(".relati").height();
                                                $(".page-container").css("top",heig+"px");
                                                $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                            }
                                        });
                                    }
                                    e.stopPropagation()
                                });
                                //线上滚动吸顶
                                var Hei = $(".actScreen").offset().top;
                                var _aHei=$('.actScreen').height();
                                $(window).on("scroll",function(){
                                    if($(".spTemp_total_nav_lists").height()<=66){
                                        if(Hei-$(window).scrollTop()<=66){
                                            $(".actScreen").addClass("toTop");
                                        }else{
                                            $(".actScreen").removeClass("toTop");
                                        }
                                    }else{
                                        if(Hei-$(window).scrollTop()<=132){
                                            if(_aHei>=$(window).height()-226){
                                                if($(window).scrollTop()>$(document).height()-$(window).height()-$(".al-mainFooter").height()){
                                                    $('.actScreen').css("height",$(window).height()-399+"px");
                                                }else{
                                                    $('.actScreen').css("height",_aHei+"px");
                                                }
                                            }else{
                                                $('.actScreen').css("height","auto");
                                            }
                                            $(".actScreen").addClass("toTopTwo");
                                        }else{
                                            $(".actScreen").removeClass("toTopTwo");
                                        }
                                    }
                                });
                                //点击事件添加高度
                                function cliAddHei(){
                                    var actListHei = $(".actResource").height();//活动的高度
                                    var sctScrHei = $('.actScreen').height();//筛选项高度
                                    if(sctScrHei>$(window).height()-226){//如果筛选列表的高度大于了筛选的最大高度
                                        sctScrHei = $(window).height()-226;
                                    }

                                    //如果筛选项高度大约筛选列表高度
                                    if(sctScrHei>actListHei){
                                        actListHei = sctScrHei;//将筛选项高度进行赋值
                                    }
                                    $('.sp_container_l .isComp[data-id=' + dataId + ']').css("height",actListHei+"px");
                                    if($('.screenList').height()>$(window).height()-226){
                                        $('.actScreen').addClass("screenScroll");
                                        if($(window).scrollTop()>$(document).height()-$(window).height()-$(".al-mainFooter").height()) {//滚动到底部了
                                            $('.actScreen').css("height",$(window).height()-399+"px");
                                        }else{
                                            $('.actScreen').css("height", $(window).height() - 226 + "px");
                                        }
                                    }else{
                                        $('.actScreen').removeClass("screenScroll");
                                        $('.actScreen').css("height","auto");
                                    }
                                }
                                //分页的点击事件
                                var pageCbkL = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        var propertyFullPath = $(this).attr("data-fullPath");
                                        t.ajaxFn({
                                            url: t.config.screenUrl,
                                            param: {
                                                paramJson: $.toJSON({
                                                    columnId: item.columnId,
                                                    visitSiteId: 2,
                                                    pageIndex: pageclickednumber,
                                                    pageSize: 20,
                                                    propertyFullPath: propertyFullPath,//单选时传的参数
                                                    isSelect: 0,//是否是多选0单选，1多选
                                                    customerId: $("#sesCustomerId").val(),
                                                    isShowPromoted:item.isShowPromoted
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var screenSourceListHtml = t.screenList({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    dataId: dataId
                                                });
                                                container.find('.resourseList').html(screenSourceListHtml);
                                                container.find(".pager").show().pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / 20),
                                                    buttonClickCallback: pageCbkL(dataId, container)
                                                });
                                                cliAddHei();
                                                $(".page-container").addClass("pagePosi");
                                                var heig = $(".relati").height();
                                                $(".page-container").css("top",heig+"px");
                                                $('.sp_container_l div[data-id=' + dataId + ']').css("padding-bottom","60px");
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                //将分页进行插入页面
                                if(Math.ceil(item.totalCount / 20)>1){
                                    LContainer.find(".pager").pager({
                                        pagenumber: 1,
                                        pagecount: Math.ceil(item.totalCount / 20),
                                        buttonClickCallback: pageCbkL(dataId, LContainer)
                                    })
                                }
                            }
                            //会员列表100%
                            if (LContainer.length > 0 && aa == 2) {
                                LContainer.children('.vip_list').html(vipHtml);
                                t.clickPraise();
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + ']').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                LContainer.data("item", item);
                                var pageVipListL = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.vipListHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.vip_list').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageVipListL(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageVipListL(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                            //会员列表70%
                            if (MContainer.length > 0 && aa == 2) {
                                MContainer.children('.vip_list').html(vipHtml);
                                t.clickPraise();//点赞
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + ']').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    MContainer.append(_isPage);
                                }
                                MContainer.data("item", item);
                                var pageVipListM = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.vipListHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.vip_list').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageVipListM(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageVipListM(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            //会员列表30%
                            if (SContainer.length > 0 && aa == 2) {
                                SContainer.children('.vip_list').html(vipHtml);
                                t.clickPraise();
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + ']').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }
                                t.overScroll(dataId, ".vip_list", ".vip_list_s");
                            }
                                //专题列表
                            if (LContainer.length > 0 && aa == 8) {
                                LContainer.find('.special_list').html(specialHtml);
                                var isShowMore = item.isShowMore;//是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_list').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                LContainer.data("item", item);
                                var pageSpeciaList = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.specialListHtml({
                                                    moduleItem: moduleItem,
                                                    dataId: dataId
                                                });
                                                container.find('.special_list').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageSpeciaList(dataId, container)
                                                });
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageSpeciaList(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                                //资源排行榜
                            if (MContainer.length > 0 && aa == 3 && item.recommendType == 1) {
                                MContainer.children('.resource_rank').html(reRankHtml);
                                var isShowMore = item.isShowMore; //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if (item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    MContainer.append(_isPage);
                                }
                                MContainer.data("item", item);
                                var pageResourceRank = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                    isShowPromoted:item.isShowPromoted
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.resourceRankHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.resource_rank').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageResourceRank(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageResourceRank(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            //排行榜30%去掉分页，超出10条后出现滚动条和查看更多
                            if (SContainer.length > 0 && aa == 3 && item.recommendType == 1) {
                                SContainer.children('.resource_rank').html(reRankHtml);
                                var isShowMore = item.isShowMore; //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }
                                SContainer.data("item", item);
                                //滚动条显示
                                t.overScroll(dataId, ".resource_rank", ".case_detail_s");
                            }
                                //此处添加二期活动的资源排行榜100%格式
                            if (LContainer.length > 0 && aa == 3 && item.recommendType == 1) {
                                LContainer.children('.resource_rank').html(reRankHtml);
                                var isShowMore = item.isShowMore; //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .resource_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if (item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                LContainer.data("item", item);
                                var pageResourceRank = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                    isShowPromoted:item.isShowPromoted
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.resourceRankHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.resource_rank').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pageResourceRank(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageResourceRank(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                                //会员排行榜70%
                            if (MContainer.length > 0 && aa == 3 && recommendType == 2) {
                                MContainer.children('.expert_rank').html(vipRankHtml);
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .expert_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    MContainer.append(_isPage);
                                }
                                MContainer.data("item", item);
                                var pagExpertRank = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea,
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.vipRankHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.expert_rank').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pagExpertRank(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pagExpertRank(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            //会员排行榜30%
                            if (SContainer.length > 0 && aa == 3 && recommendType == 2) {
                                SContainer.children('.expert_rank').html(vipRankHtml);
                                var isShowMore = item.isShowMore //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .expert_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }
                                //SContainer.data("item", item);
                                t.overScroll(dataId, ".expert_rank", ".doctor_detail_s");
                            }
                            //添加会员排行榜100%样式
                            if(LContainer.length > 0 && aa == 3 && recommendType == 2){
                                LContainer.children('.expert_rank').html(vipRankHtml);
                                var isShowMore = item.isShowMore; //是否有更多
                                if (isShowMore&&isShowMore==1) {
                                    $('div[data-id=' + dataId + '] .total_title').children('a').show();
                                    $('div[data-id=' + dataId + '] .expert_rank').append("<p class='resourceListMore'><a href='javascript:;' data-url="+item.morePageUrl+"> 查看更多<i></i></a></p>")
                                }else if(item.isPage == 1&&parseInt(item.pageNum)<parseInt(item.totalCount)){
                                    $('div[data-id=' + dataId + '] .total_title').children('a').hide();
                                    var _isPage = '<div class="page-container"><div class="pagination pager hide" data-id="' + dataId + '"></div></div>';
                                    LContainer.append(_isPage);
                                }
                                LContainer.data("item", item);
                                var pagExpertRank = function (dataId, container) {
                                    var item = container.data("item");
                                    return function (pageclickednumber) {
                                        t.ajaxFn({
                                            url: t.config.url,
                                            param: {
                                                paramJson: $.toJSON({
                                                    pageIndex: pageclickednumber,
                                                    pageSize: item.pageNum,
                                                    customerId: item.customerId,
                                                    visitSiteId: 1,
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
                                                    resourceStartTime:item.resourceStartTime,
                                                    rankingResourceType:item.rankingResourceType,
                                                    searchParam:item.resourceTagName,
                                                    isShowSort:item.isShowSort,
                                                    isShowArea:item.isShowArea
                                                })
                                            },
                                            fn: function (data) {
                                                var pageItem = data.bo.responseData.data_list[0],
                                                    moduleItem = pageItem.recommendResourceListMap;
                                                var pageResourceHtml = t.vipRankHtml({
                                                    item: pageItem,
                                                    moduleItem: moduleItem,
                                                    isSocial: item.settingElement.split(','),
                                                    dataId: dataId
                                                });
                                                container.find('.expert_rank').html(pageResourceHtml);
                                                container.find(".pager").pager({
                                                    pagenumber: pageclickednumber,
                                                    pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                    buttonClickCallback: pagExpertRank(dataId, container)
                                                });
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1){
                                    if(Math.ceil(item.totalCount / item.pageNum)>1){
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pagExpertRank(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                            //推荐位
                            if (LContainer.length > 0 && aa == 5) {
                                LContainer.children('.posid_list').html(posidHtml);
                            }
                            if (MContainer.length > 0 && aa == 5) {
                                MContainer.children('.posid_list').html(posidHtml);
                            }
                            if (SContainer.length > 0 && aa == 5) {
                                SContainer.children('.posid_list').html(posidHtml);
                            }
                            //滚动栏
                            if ($('.sp_container div[data-id=' + dataId + ']').length > 0 && aa == 6) {
                                $('.sp_container div[data-id=' + dataId + ']').find('.scroll_list').html(scrollHtml);
                            }
                            //新闻
                            if (LContainer && aa == 4) {
                                LContainer.children('.theme_news').html(newsHtml);
                                t.newUpDow();
                            }
                            if (MContainer && aa == 4) {
                                MContainer.children('.theme_news').html(newsHtml);
                                t.newUpDow();
                            }
                            if (SContainer && aa == 4) {
                                SContainer.children('.theme_news').html(newsHtml);
                                t.newUpDow();
                            }
                        }
                    }
                }
            },
        //    轮播图
            banner: function () {
                //代码初始化
                var size=$(".img li").size();
                //判断图片的个数超过一个开始轮播
                if(size==1){
                    $('.numList').hide();
                    $(".btn").hide();
                }else{
                    $(".bannerBox").remove();
                    var bannerHtml = '<div class="bannerBox">'+
                        '<div class="out ">'+
                        '<ul class="img ">'+
                        ' <li>' +
                        ' <img src="//img99.allinmd.cn/ad/2015/02/02/266_1422870449083.jpg" alt=" ">' +
                        ' </li>' +
                        ' <li>' +
                        ' <img src="//img99.allinmd.cn/ad/2015/06/02/555_1433224345933.jpg" alt=" ">' +
                        ' </li>' +
                        ' <li>' +
                        ' <img src="/images/img/ads2.jpg" alt=" ">' +
                        ' </li>' +
                        ' <li>' +
                        ' <img src="/images/img/ads1.jpg" alt=" ">' +
                        ' </li>' +
                       ' </ul>' +
                        '  <ul class="numList ">' +
                        ' </ul>' +
                        ' <div class="left btn ">' +
                        '<img src="//img10.allinmd.cn/v3/common/icon/left_banner.png"/>' +
                        ' </div>' +
                        ' <div class="right btn ">' +
                        '<img src="//img10.allinmd.cn/v3/common/icon/right_banner.png"/>' +
                        '  </div>' +
                        '</div></div>'
                    $(".spTemp_total_up").before(bannerHtml);
                    for (var i = 1; i <= size; i++) {
                        var li="<li></li>";
                        $(".numList").append(li);
                    };

                    //手动控制轮播效果
                    $(".img li").eq(0).show();
                    $(".numList li").eq(0).addClass("active");
                    $(".numList li").click(function() {
                        $(this).addClass("active").siblings().removeClass("active");
                        var index = $(this).index();
                        i=index;
                        $(".img li").eq(index).fadeIn(1000).siblings().fadeOut(1000);
                    })

                    //自动
                    var i = 0;
                    var t = setInterval(move, 4000);
                    //核心向左的函数
                    function moveLeft() {
                        i--;
                        if (i == -1) {
                            i = size-1;
                        }
                        $(".numList li").eq(i).addClass("active").siblings().removeClass("active");
                        $(".img li").eq(i).fadeIn(1000).siblings().fadeOut(1000);
                    }
                    //核心向右的函数
                    function move() {
                        i++;
                        if (i == size) {
                            i = 0;
                        }
                        $(".numList li").eq(i).addClass("active").siblings().removeClass("active");
                        $(".img li").eq(i).fadeIn(1000).siblings().fadeOut(1000);
                    }
                    //定时器的开始与结束
                    $(".out").hover(function() {
                        clearInterval(t);
                    }, function() {
                        t = setInterval(move, 4000)
                    })
                    //左边按钮的点击事件
                    $(".out .left").off("click").on("click", function () {
                        moveLeft();
                    })
                    //右边按钮的点击事件
                    $(".out .right").off("click").on("click",function(){
                        move();
                    })
                }
            },
            newUpDow: function () { //    专业术士新闻点击展开收起
                var heigh = $(".term_left").height()>$(".term_right").height()?$(".term_left").height():$(".term_right").height();
                var flag = 0;
                $('.gd_btn').off("click").on("click", function () {
                    if(flag==0){
                        flag = 1;
                        $(this).children("i").css('background','url(//img10.allinmd.cn/v3/avtivity/up.png) no-repeat left center');
                        $(this).children("i").css('background-size','contain');
                        $(this).children("span").text('收起全部');
                        $('.term').css('height',heigh+'px');
                    }else{
                        flag = 0;
                        $(this).children("i").css('background','url(//img10.allinmd.cn/v3/avtivity/down.png) no-repeat left center');
                        $(this).children("i").css('background-size','contain');
                        $(this).children("span").text('展示更多');
                        $('.term').css('height','560px');
                    }
                });
            },
        }
        myList.init();
    }
}