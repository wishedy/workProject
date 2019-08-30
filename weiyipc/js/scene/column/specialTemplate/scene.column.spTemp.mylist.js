/**
 * 功能描述：  专题模板
 * 使用方法:
 * 注意事件：
 * 引入来源：
 * 作用：公共方法
 * Created by WangJingRong on 2016/10/20.
 */
var spTemp_list = {};
spTemp_list.one={
    spTemp_listLoad:function(ev) {
        var myList = {
            config: {
                url: "/call/col/column/recommend/getResourceMapList/",
            },
            init: function () {
                var t = this;
                t.addList(ev);
                t.videoMore();
                t.checkEndTime();
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
                    if (d2.offsetWidth - d.scrollLeft <= 0) {
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
                                        _that.removeClass('resource_list_assist_no').addClass('resource_list_assist_yes').html("已 赞")
                                        var asNum = _that.parents('.zan_parents').siblings('.zan_parents_siblings').find('.assist_number');
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
                                        _that.removeClass('resource_list_assist_yes').addClass('resource_list_assist_no').html("点 赞")
                                        var asNum = _that.parents('.zan_parents').siblings('.zan_parents_siblings').find('.assist_number');
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
                if (data.item.isShowMore) {
                    var isShowMore = data.item.isShowMore; //是否有更多
                    if (isShowMore == 1) {
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').show();
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').attr('href', '' + data.item.morePageUrl + '')
                    } else {
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').hide();
                    }
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
                            videoBtn = "";//视频播放按钮
                        //判断点赞状态
                        if (isHasPre == 1) {
                            preferUp = '<span class="resource_list_assist ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") +
                                '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
                            preferUp_s = '<span class="resource_list_assist resource_list_assist_s ' + (isPrefer == 0 ? "resource_list_assist_no" : "resource_list_assist_yes") +
                                '" resourceId="' + refId + '" isPrefer="' + isPrefer + '" refType="'+resouTyp+'">' + (isPrefer == 0 ? "点赞" : "已赞") + '</span>';
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
                                        resou_socialNum += '<li class="resource_list_stat_liulan_l">' + listItem.browseNum.toWK() + '</li>';
                                        break;
                                    case 2:
                                        resou_socialNum += '<li class="resource_list_stat_shoucang_l">' + listItem.collectionNum.toWK() + '</li>';
                                        break;
                                    case 3:
                                        resou_socialNum += '<li class="resource_list_stat_pinglun_l">' + listItem.reviewNum.toWK() + '</li>';
                                        break;
                                    case 4:
                                        resou_socialNum += '<li class="resource_list_stat_dianzan_l assist_number">' + ((isPrefer==1&&listItem.preferUpNum==0)?"1":listItem.preferUpNum.toW()) + '</li>';
                                        break;
                                }
                            }
                        }
                        //资源多作者字段处理
                        var authorName = '';
                        if(listItem.resourceType==1){
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        //判断是否有图片
                        if (listItem.coverPicUrl) {
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                                resourceListHtml += '<section class="resource_list_box_l fix">' +
                                    '<section class="resource_list_left_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title">' + (listItem.title ? comm.getStrLen(listItem.title, 52) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_l">' +
                                    '<span class="resource_list_stat_per_name_l">' + authorName + '</span>' +
                                    '<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 34) : "") + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>' +
                                    '<section class="resource_list_right_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                    '<a href="' + listItem.pcUrl + '"><img src="' + listItem.coverPicUrl + '">' + videoBtn + '</a>' +
                                    video_play_time +
                                    '</section>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {

                                resourceListHtml += '<section class="resource_list_box_m fix">' +
                                    '<section class="resource_list_left_m ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title">' + (listItem.title ? comm.getStrLen(listItem.title, 34) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_m fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_m">' +
                                    '<span class="resource_list_stat_per_name_m">' + authorName + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>' +
                                    '<section class="resource_list_right_l ' + ($("div[data-id=" + data.dataId + "] .resource_list").hasClass("resource_list_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                    '<a href="' + listItem.pcUrl + '"><img src="' + listItem.coverPicUrl + '">' + videoBtn + '</a>' +
                                    video_play_time +
                                    '</section>' +
                                    '</section>'

                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                                resourceListHtml += '<section class="resource_list_box_s">' +
                                    '<div class="resource_list_title_box_s zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title_s">' + (listItem.title ? comm.getStrLen(listItem.title, 38) : "") + '</p></a>' +
                                    preferUp_s +
                                    '</div>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    '<li class="resource_list_stat_per_s">' +
                                    '<span class="resource_list_stat_per_name_s">' + authorName + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
                                    '</ul>' +
                                    '</section>'
                            }
                        } else {
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_l')) {
                                resourceListHtml += '<section class="resource_list_box_l fix">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title">' + (listItem.title ? comm.getStrLen(listItem.title, 52) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_l">' +
                                    '<span class="resource_list_stat_per_name_l">' + authorName + '</span>' +
                                    '<span class="resource_list_stat_per_hosp_l">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 34) : "") + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                                resourceListHtml += '<section class="resource_list_box_m fix">' +
                                    '<div class="resource_list_title_box fix zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title">' + (listItem.title ? comm.getStrLen(listItem.title, 34) : "") + '</p></a>' +
                                    preferUp +
                                    '</div>' +
                                    '<p class="resource_list_intro">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                    '<ul class="resource_list_stat_m fix zan_parents_siblings">' +
                                    resouTypCont +
                                    '<li class="resource_list_stat_per_m">' +
                                    '<span class="resource_list_stat_per_name_m">' + authorName + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
                                    '<li class="resource_list_stat_time">' + (listItem.publishTime ? listItem.publishTime.split(" ")[0] : "") + '</li>' +
                                    '</ul>' +
                                    '</section>'
                            }
                            if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                                resourceListHtml += '<section class="resource_list_box_s">' +
                                    '<div class="resource_list_title_box_s zan_parents">' +
                                    '<a href="' + listItem.pcUrl + '"><p class="resource_list_title_s">' + (listItem.title ? comm.getStrLen(listItem.title, 38) : "") + '</p></a>' +
                                    preferUp_s +
                                    '</div>' +
                                    '<ul class="resource_list_stat_l fix zan_parents_siblings">' +
                                    '<li class="resource_list_stat_per_s">' +
                                    '<span class="resource_list_stat_per_name_s">' + authorName + '</span>' +
                                    '</li>' +
                                    resou_socialNum +
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
                    vipListHtml = ""
                if (data.item.interactiveOperation) {
                    var isHasPre = data.item.interactiveOperation   //是否有点赞
                }
                if (data.item.isShowMore) {
                    var isShowMore = data.item.isShowMore //是否有更多
                    if (isShowMore == 1) {
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').show();
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').attr('href', '' + data.item.morePageUrl + '')
                    } else {
                        $('div[data-id=' + data.dataId + '] .total_title').children('a').hide();
                    }
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
                                            vip_socialNum += '<li><span>评论</span><span>' + listItem.customerStatistic.reviewNum.toWK() + '</span></li>';
                                        }
                                        break;
                                    case 4:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>赞</span><span class="assist_number">' +((isPrefer==1&&listItem.customerStatistic.othersUpNum==0)?"1":listItem.customerStatistic.othersUpNum.toWK())  + '</span></li>';
                                        }
                                        break;
                                    case 5:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>粉丝</span><span>' + listItem.customerStatistic.fansNum.toWK() + '</span></li>';
                                            break;
                                        }
                                    case 6:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>关注</span><span>' + listItem.customerStatistic.followTrendsNum.toWK() + '</span></li>';
                                            break;
                                        }
                                    case 7:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<li><span>贡献</span><span>' + listItem.customerStatistic.contributionCount.toWK() + '</span></li>';
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
                        if ($('div[data-id=' + data.dataId + ']').find(".special_list").hasClass("special_list_topImg_bottomArt")) {
                            specialListHtml += '<a href="' + listItem.pcUrl + '"><section class="special_list_con">' +
                                '<div class="special_list_imgBox"><img src="' + listItem.coverPicUrl + '"></div>' +
                                '<div class="special_list_describe">' + comm.getStrLen(listItem.summary, 180) + '</div>' +
                                '</section></a>'
                        } else {
                            specialListHtml += '<a href="' + listItem.pcUrl + '"><section class="special_list_con">' +
                                '<div class="special_list_describe">' + comm.getStrLen(listItem.summary, 180) + '</div>' +
                                '<div class="special_list_imgBox"><img src="' + listItem.coverPicUrl + '"></div>' +
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
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            resouTypCont = "",
                            resou_socialNum = "",//资源排行社交内容
                            video_play_time = "",//视频播放时间
                            videoBtn = "",//视频播放按钮
                            rankNum = "",
                            resPic = "";
                        //判断排行版前面显示数字
                        if (data.item.pageIndex) {
                            rankNum = j + 1 + (data.item.pageIndex - 1) * data.item.pageSize
                        } else {
                            rankNum = j + 1
                        }
                        //判断是否有图片，没有用默认
                        if (listItem.coverPicUrl) {
                            resPic = listItem.coverPicUrl
                        } else {
                            resPic = "//img10.allinmd.cn/default/loading/225_150.jpg"
                        }
                        var authorName = '';
                        if(listItem.resourceType==1){
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                resouTypCont = '<span class="case_m resource_list_stat_type_video">视频</span>';
                                video_play_time = '<span class="video_play_time">' + listItem.playTime + '</span>';
                                videoBtn = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png" alt=""></i>';
                                break;
                            case 2:
                                resouTypCont = '<span class="case_m resource_list_stat_type_lib">文库</span>';
                                break;
                            case 4:
                                resouTypCont = '<span class="case_m resource_list_stat_type_topic">话题</span>';
                                break;
                            case 7:
                                resouTypCont = '<span class="case_m resource_list_stat_type_case">病例</span>';
                                break;

                        }

                        //判断有几个社交内容
                        if (data.isSocial !== undefined) {
                            for (var k = 0; k < data.isSocial.length; k++) {
                                switch (parseInt(data.isSocial[k])) {
                                    case 1:
                                        resou_socialNum += '<span class="case_see_m"><i class="case_seeNum_m"></i>' + listItem.browseNum.toWK() + '</span>';
                                        break;
                                    case 2:
                                        resou_socialNum += '<span class="case_collect_m"><i class="case_collectNum_m"></i>' + listItem.collectionNum.toWK() + '</span>';
                                        break;
                                    case 3:
                                        resou_socialNum += '<span class="case_comment_m"><i class="case_commentNum_m"></i>' + listItem.reviewNum.toWK() + '</span>';
                                        break;
                                    case 4:
                                        resou_socialNum += '<span class="case_praise_m"><i class="case_praiseNum_m"></i>' + listItem.preferUpNum.toWK() + '</span>';
                                        break;
                                }
                            }
                        }

                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_m')) {
                            resourceRankHtml +=
                                '<section class="case_detail_m">' +
                                '<div class="case_content_m">' +
                                '<div class="case_cont_left ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt") ? "spTemp_right" : "spTemp_left") + '">' +
                                '<p class="case_title_m">' +
                                '<a href="' + listItem.pcUrl + '">' + comm.getStrLen(listItem.title, 44) + '</a>' +
                                '</p>' +
                                '<p class="case_cont_m">' + (listItem.summary ? comm.getStrLen(listItem.summary, 100) : "") + '</p>' +
                                '<p class="case_info_m">' +
                                resouTypCont + '<span><i class="case_author_m"></i>' + authorName + '</span>' + resou_socialNum + '<span class="case_time_m">' + listItem.publishTime.split(" ")[0] + '</span>' +
                                '</p>' +
                                '</div>' +
                                '<figure class="case_cont_right ' + ($("div[data-id=" + data.dataId + "] .resource_rank").hasClass("resource_rank_leftImg_rightArt") ? "spTemp_left" : "spTemp_right") + '">' +
                                '<a href="' + listItem.pcUrl + '">' +
                                '<img class="bg" src="' + resPic + '" data-original="' + resPic + '" alt="">' +
                                '<i class="label"><img src="' + (rankNum < 4 ? "/images/img00/column/specialTemplate/label.png" : "/images/img00/column/specialTemplate/label_gray.png") + '" alt=""></i>' +
                                ($.isEmptyObject(listItem.playTime) ? "" : ('<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png"></i><i class="videoTime">' + listItem.playTime + '</i>')) +
                                '<span>' + (rankNum < 10 ? "0" + rankNum : rankNum) + '</span>' +
                                '</a>' +
                                '</figure>' +
                                '</div>' +
                                '</section>';
                        }
                        if ($('div[data-id=' + data.dataId + ']').parents('.sp_container').hasClass('sp_container_s')) {
                            resourceRankHtml +=
                                '<section class="case_rank_s">' +
                                '<div class="case_content_s">' +
                                '<p class="' + (rankNum < 4 ? "num" : "num_1") + '">' +
                                '<span>' + rankNum + '</span>' +
                                '</p>' +
                                '<div class="case_info_s">' +
                                '<p class="case_title_one_s">' +
                                '<a href="' + listItem.pcUrl + '">' + (listItem.title ? comm.getStrLen(listItem.title, 40) : "") + '</a>' +
                                '</p>' +
                                '<p class="case_otherMsg_s">' +
                                '<span class="case_name_s">' + authorName + '</span><span class="case_prof_s">' + listItem.medicalTitleShow + '</span><span class="case_hospital_s">' + (listItem.hospitalName ? comm.getStrLen(listItem.hospitalName, 10) : "") + '</span>' +
                                '</p>' +
                                '</div>' +
                                '</div>' +
                                '</section>';
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
                        //判断排行版前面显示数字
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
                                            vip_socialNum += '<span>评论<i>' + listItem.customerStatistic.reviewNum.toWK() + '</i></span>';
                                        }
                                        break;
                                    case 4:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>赞<i>' + listItem.customerStatistic.othersUpNum.toWK() + '</i></span>';
                                        }
                                        break;
                                    case 5:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>粉丝<i>' + listItem.customerStatistic.fansNum.toWK() + '</i></span>';
                                        }
                                        break;
                                    case 6:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>关注<i>' + listItem.customerStatistic.followTrendsNum.toWK() + '</i></span>';
                                        }
                                        break;
                                    case 7:
                                        if (listItem.customerStatistic) {
                                            vip_socialNum += '<span>贡献<i>' + listItem.customerStatistic.contributionCount.toWK() + '</i></span>';
                                        }
                                        break;
                                }
                            }
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
                var posidListHtml = "";
                if (data.moduleItem && data.moduleItem.length > 0) {
                    if (data.moduleItem.length > 4) {
                        data.moduleItem.length = 4;
                    }
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            video_play_time = "",//视频播放时间
                            videoBtn_small = "";//视频播放按钮
                        //判断资源类型
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="videoTime">' + listItem.playTime + '</span>';
                                videoBtn_small = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>';
                                break;
                        }
                        //判断有几个资源，样式的改变
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
                var scrollListHtml = "";
                if (data.moduleItem && data.moduleItem.length > 0) {
                    for (var j = 0; j < data.moduleItem.length; j++) {
                        var listItem = data.moduleItem[j],
                            resouTyp = listItem.resourceType,
                            video_play_time = "",//视频播放时间
                            videoBtn_small = "";//视频播放按钮
                        //判断资源类型
                        var authorName = '';
                        if(listItem.resourceType==1){
                            authorName = comm.getStrLen(listItem.ownerNameStr,30);
                        }else{
                            authorName = comm.getStrLen(listItem.author, 10);
                        }
                        switch (parseInt(resouTyp)) {
                            case 1:
                                video_play_time = '<span class="videoTime">' + listItem.playTime + '</span>';
                                videoBtn_small = '<i class="videoBtn"><img src="/images/img00/column/specialTemplate/play-btn-small.png"></i>';
                                break;
                        }
                        //判断是资源滚动栏1？会员滚动栏2
                        if (data.item.recommendType == 1) {
                            scrollListHtml += '<a href="' + listItem.pcUrl + '" class="works_detail">' +
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
                            scrollListHtml += '<a href="' + listItem.pcUrl + '" class="works_detail">' +
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
            //分页
            addList: function () {
                var t = this;
                if (ev.resTemplate && ev.resTemplate.bo.responseData) {
                    var dataItem = ev.resTemplate.bo.responseData.data_list;
                    if (dataItem && dataItem.length > 0) {
                        for (var i = 0; i < dataItem.length; i++) {
                            var item = dataItem[i],
                                dataId = item.colMenuLayoutModuleId,
                                aa = item.componentType,
                                moduleTitle = (item.title ? comm.getStrLen(item.title, 50) : ""),//组件标题
                                moduleItem = item.recommendResourceListMap,
                                recommendType = item.recommendType;

                            if (item.settingElement) {
                                var isSocial = item.settingElement.split(','); //社交选项
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
                            //组件名称
                            var LContainer = $('.sp_container_l div[data-id=' + dataId + ']');
                            var MContainer = $('.sp_container_m div[data-id=' + dataId + ']');
                            var SContainer = $('.sp_container_s div[data-id=' + dataId + ']');
                            $('div[data-id=' + dataId + '] .total_title').children('span').text(moduleTitle);
                            //资源列表
                            if (LContainer.length > 0 && aa == 1) {
                                LContainer.children('.resource_list').html(resourceHtml);
                                t.clickPraise();
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageCbkL(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        LContainer.find(".pager").show().pager({
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
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation
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
                                                if (pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageCbkM(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if (item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
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
                                    t.clickPraise();
                                    t.overScroll(dataId, ".resource_list", ".resource_list_box_s");
                                }
                                //会员列表
                            if (LContainer.length > 0 && aa == 2) {
                                LContainer.children('.vip_list').html(vipHtml);
                                t.clickPraise();
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageVipListL(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageVipListL(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                            if (MContainer.length > 0 && aa == 2) {
                                MContainer.children('.vip_list').html(vipHtml);
                                t.clickPraise();
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageVipListM(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageVipListM(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            if (SContainer.length > 0 && aa == 2) {
                                    SContainer.children('.vip_list').html(vipHtml);
                                    t.clickPraise();
                                    t.overScroll(dataId, ".vip_list", ".vip_list_s");
                                }
                                //专题列表
                            if (LContainer.length > 0 && aa == 8) {
                                LContainer.find('.special_list').html(specialHtml);
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageSpeciaList(dataId, container)
                                                    });
                                                }
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        LContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageSpeciaList(dataId, LContainer)
                                        });
                                    }
                                }
                            }
                                //资源排行榜
                            if (MContainer.length > 0 && aa == 3 && recommendType == 1) {
                                MContainer.children('.resource_rank').html(reRankHtml);
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation,
                                                    resourceSource: item.resourceSource,
                                                    resourceNum: item.resourceNum,
                                                    resourceTagId: item.resourceTagId,
                                                    resourceType: item.resourceType,
                                                    resourceEndTime: item.resourceEndTime,
                                                    resourceOwnType: item.resourceOwnType,
                                                    resourceSortType: item.resourceSortType,
                                                    resourceStartTime: item.resourceStartTime
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pageResourceRank(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pageResourceRank(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            if (SContainer.length > 0 && aa == 3 && recommendType == 1) {
                                SContainer.children('.resource_rank').html(reRankHtml);
                                t.overScroll(dataId, ".resource_rank", ".case_rank_s");
                            }
                                //专家排行榜
                            if (MContainer.length > 0 && aa == 3 && recommendType == 2) {
                                MContainer.children('.expert_rank').html(vipRankHtml);
                                if (item.isPage == 1) {
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
                                                    customerId: $("#sesCustomerId").val(),
                                                    visitSiteId: 1,
                                                    pageSize: item.pageNum,
                                                    columnId: item.columnId,
                                                    isRanking: item.isRanking,
                                                    recommendType: item.recommendType,
                                                    interactiveOperation: item.interactiveOperation,
                                                    resourceSource: item.resourceSource,
                                                    resourceNum: item.resourceNum,
                                                    resourceTagId: item.resourceTagId,
                                                    resourceType: item.resourceType,
                                                    resourceEndTime: item.resourceEndTime,
                                                    resourceOwnType: item.resourceOwnType,
                                                    resourceSortType: item.resourceSortType,
                                                    resourceStartTime: item.resourceStartTime
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
                                                if(pageItem.totalCount / pageItem.maxResult > 1) {
                                                    container.find(".pager").pager({
                                                        pagenumber: pageclickednumber,
                                                        pagecount: Math.ceil(pageItem.totalCount / pageItem.maxResult),
                                                        buttonClickCallback: pagExpertRank(dataId, container)
                                                    });
                                                }
                                                t.clickPraise();
                                            }
                                        });
                                    }
                                };
                                if(item.isPage == 1) {
                                    if (item.totalCount / item.pageNum > 1) {
                                        MContainer.find(".pager").show().pager({
                                            pagenumber: 1,
                                            pagecount: Math.ceil(item.totalCount / item.pageNum),
                                            buttonClickCallback: pagExpertRank(dataId, MContainer)
                                        });
                                    }
                                }
                            }
                            if (SContainer.length > 0 && aa == 3 && recommendType == 2) {
                                SContainer.children('.expert_rank').html(vipRankHtml);
                                t.overScroll(dataId, ".expert_rank", ".doctor_detail_s");
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
                            }
                            if (MContainer && aa == 4) {
                                MContainer.children('.theme_news').html(newsHtml);
                            }
                            if (SContainer && aa == 4) {
                                SContainer.children('.theme_news').html(newsHtml);
                            }
                        }
                    }
                }
            }
        }
        myList.init();
    }
}
