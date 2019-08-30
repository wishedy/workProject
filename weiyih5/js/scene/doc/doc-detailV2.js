/**
 * Created by Administrator on 2014/12/29.
 *
 * Change by HJ on2019/01/22
 * 修改文库终端唤醒app tplPath
 */

$(function () {
    var cId = TempCache.getItem("userId");
    var refType = $("#relationType").val();
    var refId = $("#resourceId").val();
    var tplPathVal = $("#tplPath").val();
    toggleToPC();
    // var tplPath = tplPathVal?tplPathVal:0;

    var tplPath = 0;
    if ($("#tplPath").size() > 0 && [31, 32, 127, 78].indexOf(parseInt($("#tplPath").val())) > -1) {
        tplPath = 1;
    }
    var amChannel = comm.getpara()._amChannel;
    var callAppOptions = {
        ios: "allinmdios://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=" + tplPath+(amChannel?"&_amChannel="+amChannel:''),
        android: "allin://com.allin.social:75235?data={scene:3,type:2,sourceId:" + refId + ",tplPath:" + tplPath + (amChannel?",_amChannel:"+amChannel:'')+ "}",
        ios9: "http://app.allinmd.cn/applinks.html?scene=terminalPage&index=2&sourceId=" + refId + "&tplPath=" + tplPath+(amChannel?"&_amChannel="+amChannel:''),
        runAtOnce: false
    };
    user.privExecute({
        operateType: 'auth',
        callback: function () {
            comm.appWakeUp("figure", callAppOptions);//唤醒app弹层
            if($(".Ev-fixedHeader").length>0){//有分享按鈕時
                $(".al-appWakeUpFigure").css("margin-top","1.3rem")
            }
        },
        noNeedBack:true,
        noAuthTip:1
    });

    //中英文切换
    if ($(".ch_en")) {
        $(".ch_en").attr("oe", "ch");
        $(".ch_en").on("click", function () {
            //切换成中文
            if ($(this).attr("oe") == "en") {
                $(".ch_en").attr("oe", "ch");
                $(this).find(".ch_en_center").text("切换到英文版");
                $(".oe_ch").show();
                $(".oe_en").hide();
            } else {
                //切换成英文
                $(".ch_en").attr("oe", "en");
                $(this).find(".ch_en_center").text("切换到中文版");
                $(".oe_ch").hide();
                $(".oe_en").show();
            }

        });
    }

    var doc = {
        default: {
            qzone_m: "http://qzs.qzone.qq.com/open/connect/widget/mobile/qzshare/index.html?",
            sina_m: "http://v.t.sina.com.cn/share/share.php?&appkey=&"

        },
        path: {
            correctionURL: M_CALL + "customer/correct/create/",//乱码反馈
            getAuthorDoc: M_CALL + "cms/doc/getMapAuthorList/",//获取用户
            getTabList: M_CALL + "/cms/resource_property/jsonList/",//获取标签
            tagListNew:M_CALL + 'mcall/cms/doc/getMapByIdNew4/',//新的获取标签的内容
        },
        init: function () {
            var t = this;
            var a=$(".al-terminalHeader a").eq(0).attr("href");
            if(a&&a.lastIndexOf("/pages/")>-1){
              a = a.replace("pages","dist").replace("others_contribution","others_index");
              $(".al-terminalHeader a").attr("href",a);
            }
          $.each($(".al-terminalTags"),function(i,em){
            if($(em).attr("href").lastIndexOf("pages")>-1){
              var tag = $(em).attr("href").replace("pages","dist");
              $(em).attr("href",tag);
            }
          })
            $('.al-terminalContentTags').hide();//先将标签隐藏
            t.updateViewdNum();
            t.shareDomRender();
            t.contentFun();//页面中的浏览，关注数，话题的关注状态
            t.oldNewFunc();//评论区最新最旧按钮切换
            t.scrollFunc();//评论最新最旧的滚动&&固定
            t.shareFunc();//页面上的分享功能
            t.backBtnClick();
            t.moreImgClick();
            t.authorNeat();
            t.getColumnInfo();//栏目相关推荐10.12
            t.series();
            scoringSystem();//新增评分系统
            t.eventTrack();
            t.messyCodeFeedBack();//PDF文档乱码反馈
            t.authAjaxList();
            t.getTabList();//标签
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

                            //   "resourceId":refId,
                            "opUsr":TempCache.getItem("userId")!=""&&TempCache.getItem("userId")!=undefined?TempCache.getItem("userId"):"",
                            "resourceId":refId,
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
        //编者译者点击操作事件
        compilerEvent: function () {
            var t = this, _bodyScr;
            $(".ev-coAuthor").off("click").on("click", function () {
                if ($(this).find("span").hasClass("ev-onlyOneAuth")) {//只有一个人，直接跳转到他人中心
                    if($(this).find("span").attr("data-href")){
                        var href = $(this).find("span").attr("data-href");
                        g_sps.jump(null,href);
                    }
                } else {//展开列表
                    _bodyScr = $(window).scrollTop();
                    $(".ev-compilerBox").show().siblings().hide();
                    $(".al-appWakeUpFigure").hide();
                    $(window).scrollTop(0);
                    $(".al-mainInner").css("height", $(window).height());
                }
            });
            $(".ev-backToMain").off("click").on("click", function () {
                $(".Ev-discussArea h2").css({
                    position: "static"
                });
                $(".ev-compilerBox").hide().siblings().show();
                $(".al-appWakeUpFigure").show();
                $(window).scrollTop(_bodyScr);
            });
        },
        //展开列表进行筛选人名请求
        authAjaxList: function (kv, scrollFlag) {
            var t = this;
            var param = {
                customerId:cId?cId:"",
                docId: refId,
                authorType: kv ? kv : 0,
                logoUseFlag:4,  //传图片大小
                visitSiteId:2, //访问途径
                pageIndex:1,
                pageSize:99
            };
            t.param = param;
            var cBack = function (rep) {
                if (comm.hasResponseData(rep)) {
                    var items = rep.responseObject.responseData;
                    var _authType = "";
                    if (items.authorType) {//判断类型进行检测，显示筛选项
                        _authType = items.authorType.split(",");
                        $.each(_authType, function (i, e) {
                            $(".al-personalContributionSelectorItem[data-id=0]").show();//全部按钮
                            $(".al-personalContributionSelectorItem[data-id=" + e + "]").show();
                        });
                    }

                    //列表请求
                    if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length) {
                        var data_list = rep.responseObject.responseData.data_list;
                        var html = "", html2 = "", arrHT = [],twoAuthTypeNum=0;
                        if(!kv) {//判断页面添加第一个
                            var helplessNum = 0;
                            var _d = data_list[0].authorType;
                            var _na = data_list[0].data_list[0]?data_list[0].data_list[0].authorName:"",
                                _naCon = comm.getByteLen(_na) > 10 ? comm.getStrByteLen(_na, 10) : _na + "...";
                            if (data_list.length == 1 && data_list[0].data_list.length == 1) {//只有一个人的情况
                                if (data_list[0].authorType != 1) {//不是第一作者
                                    var _cid=data_list[0].data_list[0].customerId;
                                    exHtml = '<p class="ev-coAuthor">' + comm.getStrByteLen(data_list[0].authorTypeName, 10) + '：<span class="ev-onlyOneAuth" ' +
                                        (_cid&&_cid!=0?'data-href="/dist/personal/others_index.html?cid='+_cid:'') + '">' +
                                        data_list[0].data_list[0].authorName + '</span></p>';
                                }
                            } else {
                                $.each(data_list, function (k, v) {
                                    var _v = v.authorType;//排除不属于文库终端的状态
                                    if (k == 0 && _v == 1 || _v == 5 || _v == 6 || _v == 10 || _v == 11 || _v == 14 || _v == 15 || _v == 16 || _v == 17) {
                                        helplessNum = 1;
                                    } else if (k != 0 && _v == 1 || _v == 5 || _v == 6 || _v == 10 || _v == 11 || _v == 14 || _v == 15 || _v == 16 || _v == 17) {
                                        helplessNum = k + 1;
                                    }
                                });
                                exHtml = '<p class="ev-coAuthor">' + data_list[helplessNum].authorTypeName + '：<span>' +
                                    _naCon + '</span><i></i></p>';
                            }
                            if (!kv) {
                                $(".authorSeries").html(exHtml);
                            }
                        }
                        $.each(data_list, function (i, e) {
                            var _v=e.authorType;//排除不属于文库终端的状态
                            if (_v!=1&&_v!=5&&_v!=6&&_v!=10&&_v!=11&&_v!=14&&_v!=15&&_v!=16&&_v!=17) {
                                t.dataHtmlTran(arrHT, e.data_list);
                            }else{
                                twoAuthTypeNum+=e.data_list.length;
                            }
                        });
                        var _kv = $(".ev-docUserList");
                        if (scrollFlag) {
                            _kv.append(arrHT);
                        } else {
                            _kv.html(arrHT);
                            if (items.total_count && items.total_count.length > 99) {
                                _kv.attr("scrollPagination", "enabled");
                                t.scrollPage();
                            } else {
                                _kv.attr("scrollPagination", "disabled");
                            }
                        }
                        t.compilerEvent();//点击事件
                        t.differAuthClick();//不同的作者列表点击请求
                    }

                    //总数有多少  顶部不变
                    if (!kv&&items.total_count) {
                        var total_count = items.total_count-twoAuthTypeNum;
                        $(".contributionNum").text(total_count);//数目
                    }
                }
            };
            comm.ajax.async(t.path.getAuthorDoc, {paramJson: $.toJSON(param)}, cBack);
        },
        //列表结构html
        dataHtmlTran: function (arrHT,data) {
            $.each(data, function (i, e) {
                arrHT.push(module.listTemplate({tempName: "userList"})({
                    cid: e.customerId, //用户id
                    customerId: localStorage.getItem('userId'), //当前人ID
                    userName: e.authorName, //用户名
                    logoUrl: e.url, //头像
                    state: e.state, //认证状态
                    medicalTitle: comm.cutLine(comm.cutDoctorTitle(e.medicalTitle), "_", ","), //职称
                    company: e.company, //医院
                    relationship: e.relationship, //关注关系
                    terminalFlag: 1
                }));
            });
            return arrHT;
        },
        //不同的列表作者点击请求,分本站医师点击显示处理
        differAuthClick: function () {
            var t = this;
            $(".ev-noAllinDoctor").off("click").on("click", function () {
                popup("该用户尚未注册唯医");
            });
            $(".al-personalContributionSelector h2").off("click").on("click", function() {
                if ($(".al-personalContributionSelector").hasClass('al-personalSelectorOn')) {
                    $(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                } else {
                    $(".al-personalContributionSelector").addClass('al-personalSelectorOn');
                }
            });
            $(".al-personalContributionSelectorItem").off("click").on("click", function () {
                t.authAjaxList($(this).attr("data-id"));
                $(this).addClass('active').siblings().removeClass('active');
                $(this).parents(".al-personalContributionSelector").removeClass('al-personalSelectorOn');
                $(this).parents(".al-personalContributionSelector").find('h2').text($(this).text());
                /*if($(this).attr("data-id")==0){
                    $(".labelsType").text("相关参与者");
                }else{
                    $(".labelsType").text($(this).text());
                }*/

            });
        },
        //编者译者列表瀑布流
        scrollPage: function () {
            var t = this;
            var _kv = $(".ev-docUserList");
            var num = 2;
            var params = t.param;
            params.pageIndex = num;
            _kv.off("scroll").scrollPagination({
                'contentPage': t.path.transformer,
                'contentData': $.extend(params, {
                    pageIndex: function () {
                        return num++;
                    }
                }),
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
                        _kv.attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            _kv.attr("scrollPagination", "disabled");
                            return false;
                        }
                        else {
                            var result = data.responseObject.responseData;
                            t.authAjaxList(params.authorType, 1);
                        }
                    }
                }
            });
        },
        shareDomRender: function () {
            var t = this;
            t.isWeixin = function () { //是否微信浏览器
                var nav = navigator.userAgent;
                if (/MicroMessenger/.test(nav)) {
                    return true;
                } else {
                    return false;
                }
            };
            if (t.isWeixin()) {
                $('.al-terminalShareItem').wrapAll('<div class="al-terminalShareItemWrap">');
                $('.al-terminalShareItem[ref=qzone]').hide();
                wxDom = '<section class="al-terminalShareItem Ev-shareBtn" ref="wx">' +
                    '<figure class="al-bottomShareImg">' +
                    '<img src="/images/img50/pages/index/wechat.png" _mce_src="/images/img50/pages/index/wechat.png" alt=""></figure>' +
                    '<figcaption>微信</figcaption>' +
                    '</section>' +
                    '<section class="al-terminalShareItem Ev-shareBtn" ref="wx">' +
                    '<figure class="al-bottomShareImg">' +
                    '<img src="/images/img50/pages/index/friendship.png" _mce_src="/images/img50/pages/index/friendship.png" alt=""></figure>' +
                    '<figcaption>朋友圈</figcaption>' +
                    '</section>';
                $('.al-terminalShareItem[ref=trend]').after(wxDom);
            }

        },
        //PDF文档乱码反馈
        messyCodeFeedBack: function () {
            var t = this;
            if (tplPathVal == 78 || tplPathVal == 127 || tplPathVal == 31 || tplPathVal == 32) {//PDF模板  或者图集模板
                $(".al-myScoreBox").before('<div class="al-messyCodeFeedBack ev-messyCodeFeedBack" data-flag="1">乱码反馈 </div>');
                $(".ev-messyCodeFeedBack").off("click").on("click", function () {
                    if ($(this).attr("data-flag") == 1) {//可以点击进行反馈
                        $(this).attr("data-flag", "0");
                        if (!$(".ev-cancelModal").length) {
                            $(this).after('<section class="al-cancelModal ev-cancelModal show"><figure class="al-cancelModalItem">' +
                                '<i></i><span>文章乱码，确定反馈吗?</span>' +
                                '<a class="btn-primary ev_cancelSure" data-flag="1">确定</a></figure></section>');
                        } else {
                            $(".ev-cancelModal").addClass("show");
                        }
                        $("html,body").css({height: $(window).scrollTop() + $(window).height(), overflow: "hidden"});
                    }
                    var pL = $(this).offset().left;
                    var pT = $(this).offset().top - $(window).scrollTop();
                    if ($(window).height() - pT < 150) { //如果下方空间不足，上面显示
                        $('.al-cancelModalItem').css({top: pT - 150});
                    } else {
                        $('.al-cancelModalItem').css({top: pT + 90});
                    }
                });

                $(document).off("click").on("click", ".ev-cancelModal", function (e) {
                    if (!$(e.target).is(".al-cancelModalItem") && !$(e.target).parents().is(".al-cancelModalItem")) {//点击其他区域关闭
                        $(".ev-cancelModal").removeClass("show");
                        $(".ev-messyCodeFeedBack").attr("data-flag", "1");
                        $("body,html").css({height: "auto", overflow: "auto"});
                    }
                    if ($(e.target).is(".ev_cancelSure")) {  //确定按钮点击
                        if ($(e.target).attr("data-flag") == 1) {
                            $(e.target).attr("data-flag", "0");
                            var callback = function (rep) {
                                if (comm.hasResponseMessage(rep)) {
                                    $(".ev-cancelModal").removeClass("show");
                                    comm.alertBox({
                                        title: "感谢您的反馈<br/>我们会尽快处理",
                                        ensure: "继续浏览",
                                        ensureCallback: function () {
                                            $(".ev_cancelSure").attr("data-flag", "1");
                                            $(".ev-messyCodeFeedBack").attr("data-flag", "1");
                                            $("body,html").css({height: "auto", overflow: "auto"});
                                        }
                                    });
                                }
                            };
                            comm.ajax.async(t.path.correctionURL, {
                                paramJson: $.toJSON({
                                    resourceType: refType,
                                    resourceId: refId,
                                    visitSiteId: 2,
                                    reviewId: 0,
                                    dataFlag: 2,
                                    isValid: 1,
                                    correction: JSON.stringify([{
                                        correctContentOrigin: "乱码反馈",
                                        correctContentSuggest: "乱码反馈"
                                    }])
                                })
                            }, callback);
                        }
                    }
                });
            }
        },
        series: function () {
            //系列课程
            var t = this;
            var operateData = {
                pageName: function () {
                    var a = location.href;
                    var b = a.split("/");
                    var c = b.slice(b.length - 1, b.length).toString(String).split(".");
                    return c.slice(0, 1);
                }
            };
            var param = {
                paramJson: $.toJSON({
                    //"resourceId": 1502087347155,    //资源Id
                    "resourceId": $('#resourceId').val(),    //资源Id
                    "isValid": !$(".al-terminalNone").length ? 1 : 0,
                    "resourceType": 2
                })
            };
            var findRecommendObj = function () {
                var objArr = [$(".Ev-recommendVideo"), $(".Ev-similarRecommend")];
                var resultObj = false;
                $.each(objArr, function (i, v) {
                    if (v.length > 0) {
                        resultObj = v;
                    }
                })
                return resultObj;
            };
            var templateRecommend = function (data) {
                var reStr = "";
                /*//资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章*/
                $.each(data, function (i, v) {
                    var typeStr = "";
                    switch (parseInt(v.resourceType)) {
                        case 1:
                            typeStr = "视频";
                            break;
                        case 2:
                            typeStr = "文库";
                            break;
                        case 7:
                            typeStr = "病例";
                            break;
                        case 17:
                            typeStr = "电子书";
                            break;
                        case 18:
                            typeStr = "文章";
                            break;
                    }
                    reStr += '<article class="al-terminalRecommendItem"><a href="//' + v.webStoragePath + '"><em>' + typeStr + '</em><span>' + comm.getStrLen(v.resourceName, 30) + '</span></a></article>';
                });
                return reStr;
            };

            function recommendShow(data) {
                var recommendObj = findRecommendObj();
                var newArrData = [];
                var recommendLen = 0;
                if (data) {
                    $.each(data, function (i, v) {
                        if (i < 5) {
                            newArrData.push(v);
                        }
                        recommendLen++;
                    });
                }

                recommendObj.find(".al-terminalRecommendItem").each(function (i) {
                    if (i < recommendLen) {
                        $(this).remove();
                    }
                });
                recommendObj.find("h2").after(templateRecommend(newArrData));
                if (recommendObj.find(".al-terminalRecommendItem").length > 0) {
                    recommendObj.show();
                } else {
                    recommendObj.hide();
                }
            }

            function belongCourse(data) {
                var templateBelong = function (data) {
                    var belongStr = "";
                    $.each(data, function (i, v) {
                        belongStr += '<a href="/dist/discover/discover_seriesDetail.html?tId=' + v.courseId + '">《' + v.courseName + '》</a>';
                    });
                    return belongStr;
                };
                if (data.length > 0) {
                    var belongObj = $(".al-series-belong");
                    belongObj.find(".al-series-list").html(templateBelong(data));
                    belongObj.show();
                }
            }

            //资源类型，1-视频，2-文库，7-病例,17-电子书，18-文章
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.data_list
                    && rep.responseObject.responseData.data_list.length > 0) {
                    var dataInfo = rep.responseObject.responseData.data_list;
                    belongCourse(dataInfo);
                    recommendShow(rep.responseObject.responseData.recommend_list);
                }
            };
            comm.ajax.async(M_CALL + "/cms/course/getCoursesByResource/", param, callback);
        },
        //强迫症对齐专用(al-terminalAuthorMsg 作者信息无职称时候对齐)
        authorNeat: function () {
            if (!$.trim($(".al-terminalAuthorMsg p>span").eq(0).text())) {
                $(".al-terminalAuthorMsg p>span").eq(0).remove();
            }
            //处理文库图文终端页 word文档上传后页面错乱问题
            $('body').removeClass('a1 a2 a3 b1 b2 b3');
            if ($('#tplPath').val() == 52) {
                $('.Ev-docContent span').each(function () {
                    this.style.fontSize = "";    // 清空默认字体大小设置
                    this.style.whiteSpace = "";  //解决文字不换行问题
                });
                $('.Ev-docContent').length>0&&$('.Ev-docContent').html($('.Ev-docContent').html().replace(/<p>&nbsp;<\/p>|<p><\/p>|<p><br><\/p>|<span>&nbsp;*<\/span>/g, "")); //清空空P占据行高
                $.each($('.Ev-docContent img'),function(ei,ele){
                    $(ele).attr('src',$(ele).attr('data-original'));
                });
            }

        },
        getColumnInfo: function () {
            var t = this;
            var callback = function (data) {
                if (comm.hasResponseData(data)) {
                    var item = data.responseObject.responseData.data_list;
                    if (item.length) {
                        t.cloumnStatus(item[0]);
                    }
                }
            };
            comm.ajax.async('/mcall/special/getResourceSpecial/', {
                paramJson: $.toJSON({
                    resourceId: refId,
                    resourceType: refType
                })
            }, callback);
        },
        //所属栏目
        cloumnStatus: function (data) {
            if (data.specialId && data.specialTitle) {
                $(".ev-column").show();
                $(".ev-column a").attr('href', '/dist/discover/discover_columnDetail.html?columnId=' + parseInt(data.specialId)).text('《' + comm.getStrByteLen(data.specialTitle, 28) + '》');
            }

        },
        //标签埋点
        eventTrack: function () {
            $('.al-terminalTags').click(function () {
                comm.creatEvent({
                    triggerType: '标签',
                    trigger_name: "标签",
                    keyword: $(this).text(),
                    refId: $(this).attr('href').split('tId=')[1],
                    actionId: 79,
                    async: false
                });
            });
        },
        //图集
        moreImgClick: function () {
            $(".Ev-moreReadImg").off("click").on("click", function () {
              g_sps.jump(null,"/pages/doc/doc-pdf-picshow.html?resourceId=" + refId + "&resourceType=" + refType);
            });
        },
        //返回按钮
        backBtnClick: function () {
            $(".Ev-backBtn").on("click", function () {
                if (document.referrer.lastIndexOf("/passport/") > -1 || document.referrer.indexOf("seminar") > -1 || !document.referrer) {
                    g_sps.jump(null,"/");
                } else {
                    history.back();
                }
                return false;
            })
        },
        //更新浏览数
        updateViewdNum: function () {
            commdata.asyncExecute("updateDocNum", {
                "propertyKey": "browseNum",
                "type": "plus",
                "docId": $("#resourceId").val()
            });
        },
        //评论区最新最旧按钮切换
        oldNewFunc: function () {
            $(".al-terminalSortChangeItem").on("click", function () {
                $(this).addClass('active').siblings().removeClass('active');
                comm.creatEvent({
                    triggerType: '评论区排序',
                    trigger_name: "评论区排序",
                    keyword: $(this).text(),
                    actionId: 74
                });
            });
        },
        //页面上的分享功能
        shareFunc: function () {
            var t = this;
            var paramLog = {};
            paramLog.shareSence = shareSenceConst.doc_detail;
            var param = {};
            param.resourceType = refType;
            param.sessionCustomerId = cId||'';
            param.sceneType = 6;
            param.docId = refId;
            param.useFlag = 12;
            param.visitSiteId = 2;
            param.logoUseFlag = 3;
            var params = {paramJson: $.toJSON(param)};
            var callback = function (rep) {
                if (rep && rep.responseObject && !$.isEmptyObject(rep.responseObject.responseData) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list[0]) {
                    var items = rep.responseObject.responseData.data_list[0];
                    var sinaTitle, qqTitle, qZoneTitle, qqSummary, qZoneSummary, picUrl, shareTitle, shareDesc,
                        wechatTitle, wechatSummary, timelineTitle, timelineSummary;
                    picUrl = items.share_comm.shareImageUrl;
                    shareTitle = items.share_comm.shareTitle != "" ? items.share_comm.shareTitle : document.title;
                    paramLog.picUrl = picUrl;
                    paramLog.shareTitle = shareTitle;
                    $.each(items.share_channel, function (i, el) {
                        if (el.shareChannel == 'Sina') {//新浪
                            sinaTitle = el.shareTitle;
                            shareDesc = el.shareDesc;
                            paramLog.sinaTitle = sinaTitle;
                            paramLog.sinaDesc = shareDesc;
                        } else if (el.shareChannel == "QZone") {//QQ空间
                            qZoneTitle = el.shareTitle;
                            qZoneSummary = el.shareDesc;
                            paramLog.qZoneTitle = qZoneTitle;
                            paramLog.qZoneSummary = qZoneSummary;
                        } else if (el.shareChannel == "WechatFriend") {//微信好友
                            wechatTitle = el.shareTitle;
                            wechatSummary = el.shareDesc;
                            paramLog.wechatTitle = wechatTitle;
                            paramLog.weiXinDesc = wechatSummary;
                        } else if (el.shareChannel == "WechatTimeline") {//微信朋友圈
                            timelineTitle = el.shareTitle;
                            timelineSummary = el.shareDesc;
                            paramLog.timelineTitle = timelineTitle;
                            paramLog.timelineSummary = timelineSummary;
                        }
                    });

                    t.shareFuncClick(paramLog);
                }
            };
            comm.ajax.async("/mcall/comm/data/share/getMapList3/", params, callback);
        },
        //分享点击操作
        shareFuncClick: function (paramLog) {
            var t = this;
            //页面固定的分享
            $(".Ev-shareBtn").off("click").on("click", function () {
                comm.creatEvent({
                    triggerType: '分享',
                    keyword: "分享",
                    actionId: 40,
                    locationId: 2
                });
                var shareToName = $(this).attr('ref');
                if (shareToName == "wx") {
                    var shareHtml = '<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                    $("body").append(shareHtml);
                    $("body").bind('touchmove', function (e) {
                        e.preventDefault();
                    });
                    $(".dk-result-pointer,.dk-result-pointer-bg").on("click", function () {
                        $(".dk-result-pointer").remove();
                        $(".dk-result-pointer-bg").remove();
                        $('body').unbind('touchmove');
                        return false;
                    });
                } else {
                    if (shareToName == "trend") {
                        comm.loading.show();
                        $.ajax({
                            type: "post",
                            url: "/mcall/customer/reprint/create/",
                            data: {
                                paramJson: $.toJSON({
                                    "reprintType": refType,
                                    "customerId": cId,//当前人ID
                                    "refId": refId,//资源id
                                    "visitSiteId": "2"//1PC 2 h5
                                })
                            },
                            dataType: "json",
                            success: function (rep) {
                                comm.loading.hide();
                                $('.al-bottomSharePart').removeClass('on');
                                $("body").css("overflow", "visible");
                                if (rep && rep.responseObject.responseStatus) {
                                    popup("分享到唯医朋友圈成功！");
                                } else {
                                    popup("分享到唯医朋友圈失败！");
                                }
                                $('body').unbind('touchmove');
                            },
                            error: function () {
                                comm.loading.hide();
                                popup("分享到唯医朋友圈失败！");
                                $('body').unbind('touchmove');
                            }
                        });
                    } else {
                        var newHref = t.default[shareToName + '_m'];
                        var picture = '&pics=http:',
                            shareTitleFixed, shareChannel;
                        if (shareToName == 'sina') {
                            picture = "&pic=http:";
                            shareTitleFixed = paramLog.sinaDesc != '' ? paramLog.sinaDesc : document.title;
                            shareChannel = 3;
                        } else if (shareToName == 'qzone') {
                            shareTitleFixed = paramLog.qZoneTitle != '' ? paramLog.qZoneTitle : document.title;
                            shareChannel = 1;
                        }
                        if (paramLog.picUrl.search(':') >= 0) {
                            paramLog.picUrl = paramLog.picUrl.split(':')[1];
                        }
                        comm.shareLog({
                            shareType: refType,
                            resourceId: refId,
                            resourceType: refType,
                            refId: refId,
                            isValid: 1,
                            shareSence: 10,
                            shareChannel: shareChannel,
                            shareContent: paramLog.shareTitle,
                            refCustomerId: cId
                        });
                        window.open(newHref + 'url=' + encodeURIComponent(window.location.href) + '&title=' + encodeURIComponent(shareTitleFixed) +
                            picture + encodeURIComponent(paramLog.picUrl) + '&summary=' + encodeURIComponent(comm.getStrLen(paramLog.qZoneSummary, 50)) +
                            (shareToName == 'sina' ? '&desc=' + encodeURIComponent(paramLog.sinaDesc) : ""), '_blank');
                    }
                    $('body').unbind('touchmove');
                    return false;
                }
            });

            shareAll({
                title: paramLog.shareTitle,
                url: window.location.href,//不传默认取当前地址
                pic: paramLog.picUrl,//分享图片
                trendUrl: "/mcall/customer/reprint/create/",//分享动态的请求连接  //不需要动态分享就不传
                noPJ: 0,//0：分享动态给后台的参数需要转为paramJson ,1:不需要
                data: {//分享动态传给后台的参数
                    "reprintType": refType,
                    "customerId": cId,//当前人ID
                    "refId": refId,//资源id
                    "visitSiteId": "2"//1PC 2 h5
                },
                callback: function () {
                },//分享动态后成功后的回调函数
                wxTitle: paramLog.wechatTitle,//微信分享标题
                wxDesc: paramLog.weiXinDesc,//微信分享描述
                timeLineTitle: paramLog.timelineTitle,
                sinaTitle: paramLog.sinaDesc,//新浪title
                desc: paramLog.sinaDesc,//新浪的描述
                qzoneTitle: paramLog.qZoneTitle,//qq空间title
                summary: paramLog.qZoneSummary,//qq空间的描述
                qShareLog: function (x) {
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: x == 'sina' ? 3 : 1,
                        shareContent: x == 'sina' ? (paramLog.sinaDesc ? paramLog.sinaDesc : document.title) : (paramLog.qZoneTitle ? paramLog.qZoneTitle : document.title),
                        refCustomerId: cId
                    });
                },  //分享新浪，空间成功与否都执行
                fnMessageSuc: function () {//分享好友成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: 4,
                        shareContent: paramLog.shareTitle,
                        refCustomerId: cId

                    });
                },
                fnTimelineSuc: function () {//分享朋友圈成功回调
                    comm.shareLog({
                        shareType: refType,
                        resourceId: refId,
                        resourceType: refType,
                        refId: refId,
                        isValid: 1,
                        shareSence: paramLog.shareSence,
                        shareChannel: 5,
                        shareContent: paramLog.shareTitle,
                        refCustomerId: cId
                    });
                }
            }, false, $(".Ev-topShareBtn"));
        },
        //页面中的浏览，关注数，文库的关注状态
        contentFun: function () {
            var t = this;
            var result = CommService.getResponseData("/mcall/cms/doc/info/", {
                sessionCustomerId: cId,
                useFlag: 12,
                visitSiteId: 2,
                logoUseFlag: 3,
                docId: refId
            });
            if (!$.isEmptyObject(result)) {
                var data = result.data_list[0];//关注
                var info = data.customer_doc;//收藏，点赞，评论，关注，浏览数
                var auth = data.doc_customer_auth;//文库的作者
                //文库关注 回复数
                if(!auth.customerId||auth.customerId==0){
                    $(".al-terminalHeader section").eq(0).hide();
                    $(".noUserIdBoxBorder").show();
                }
                $(".userNameContent").text(auth.lastName+auth.firstName);
                $(".al-terminalHeader a").attr("href",(auth.customerId&&auth.customerId!=0)?"/dist/personal/others_index.html?cid="+auth.customerId:'javascript:;');
                $(".Ev-authorName").text(auth.lastName+auth.firstName);
                $(".al-terminalAuthorImg img").attr("src",data.customer_att.logoUrl);
                $(".al-terminalAuthorMsg p").eq(0).html('<span>'+auth.medicalTitleShow+'</span><span>'+auth.workplace+'</span>');
                if (info.reviewNum && info.reviewNum > 0) {
                    $(".Ev-navReviewNum").text(info.reviewNum);//评论区导航评论数字
                    if (parseInt(info.reviewNum) > 999) {
                        $(".Ev-reviewNum span").show().text("999+");//评论数
                    } else {
                        $(".Ev-reviewNum span").show().text(info.reviewNum);//评论数
                    }
                    $(".Ev-followNum").text(info.reviewNum);//顶部评论数
                } else {
                    $(".Ev-navReviewNum").text(0);//评论区导航评论数字
                    $(".Ev-reviewNum span").show().text("评论");
                    $(".Ev-followNum").text(0);//顶部评论数
                }

                if (info.browseNum && info.browseNum > 0) {
                    if (parseInt(info.browseNum) > 9999) {
                        $(".Ev-browseNum").text(info.browseNum.toW());//浏览数
                    } else {
                        $(".Ev-browseNum").text(info.browseNum);//浏览数
                    }
                } else {
                    $(".Ev-browseNum").text(0);//浏览数
                }

                if (info.preferUpNum && info.preferUpNum > 0) {
                    if (parseInt(info.preferUpNum) > 999) {
                        $(".Ev-praiseNum span").show().text("999+");//点赞数
                    } else {
                        $(".Ev-praiseNum span").show().text(info.preferUpNum);//点赞数
                    }
                } else {
                    $(".Ev-praiseNum span").show().text("点赞");//点赞数
                }

                if (info.collectionNum && info.collectionNum > 0) {
                    if (parseInt(info.collectionNum) > 999) {
                        $(".Ev-collectNum span").show().text("999+");//收藏数
                    } else {
                        $(".Ev-collectNum span").show().text(info.collectionNum);//收藏数
                    }
                } else {
                    $(".Ev-collectNum span").show().text("收藏");//收藏数
                }


                //文库的点赞状态和收藏状态
                if (parseInt(data.preferRelationship) > 0) {//点赞
                    $(".Ev-praiseNum").addClass("on");
                    if($(".Ev-praiseNum span").text()==0||$(".Ev-praiseNum span").text()=="点赞"){//如果已点赞，但数据为0，+1
						$(".Ev-praiseNum span").text(1);
                    }
                } else {
                    $(".Ev-praiseNum").removeClass("on");
                }
                if (parseInt(data.collectionRelationship) > 0) {//收藏
                    $(".Ev-collectNum").addClass("on");
                    if($(".Ev-collectNum span").text()==0||$(".Ev-collectNum span").text()=="收藏"){
						$(".Ev-collectNum span").text(1);
                    }
                } else {
                    $(".Ev-collectNum").removeClass("on");
                }
                t.praColDisFunc(auth.customerId);//点赞收藏评论操作
                t.activityStatus(data);
            } else {
                $(".Ev-navReviewNum").text(0);
            }
        },
        //点赞收藏评论操作
        praColDisFunc: function (val) {
            var t = this;
            $(".Ev-discussBtn").off("click").on("click", function () {//加入讨论操作
                if(TempCache.getItem("customerRole") === "14" ||
                    TempCache.getItem("customerRole") === "15" ||
                    TempCache.getItem("customerRole") === "13"){ // 厂商不能评论
                    comm.toastFactoryAuth(null);
                }else {
                    var authorName = $('.Ev-authorName').text().replace(/[\n|\s]/g, "");
                    user.privExecute({
                        operateType: 'auth',   //'login','auth','conference'
                        callback: function () {
                            comm.creatEvent({
                                triggerType: '加入讨论',
                                keyword: $('#resourceId').val(),
                                actionId: 72
                            });
                            if (TempCache.getItem('customerRole') == 2 || TempCache.getItem('customerRole') == 3 || TempCache.getItem('customerRole') == 4) {
                                popup('该用户没有操作权限');
                            } else {
                                TempCache.setItem('commentFromPage', window.location.href);
                                g_sps.jump(null, "/pages/common/comment.html?resourceId=" + refId + "&username=" + authorName + "&type=" + refType + "&parentId=0&refCustomerId=" + val);
                            }
                        }
                    });
                }
            });
            $(".Ev-reviewNum").off("click").on("click", function () {//评论数点击操作
                var _top = $(".Ev-discussArea").offset().top;
                $(window).scrollTop(_top);
                return false;
            });
            var rep;
			var praising =false,collecting = false;
            $(".Ev-praiseNum").off("click").on("click", function () {//点赞数点击操作
                if(praising){
                    return false;
                }
                var kv = $(".Ev-praiseNum span").text();
                var preferUpNum = $(".Ev-praiseNum span").text() ? parseInt($(".Ev-praiseNum span").text()) : "";
                var params = {};
                params.customerId = cId;
                params.refId = refId;
                params.usefulType = refType;
                params.upDownType = 1;
                praising = true;
                  user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                      if ($(".Ev-praiseNum").hasClass("on")) {//取消点赞
                        rep = CommService.execute("/mcall/customer/prefer/delete/", params);
                        praising =false;
                        if (rep.responseStatus && rep.responseStatus == true) {
                          $(".Ev-praiseNum").removeClass("on");
                          if (kv.indexOf("+") == -1) {
                            if (preferUpNum && preferUpNum > 0) {  //点赞数
                              if (preferUpNum - 1 > 0) {
                                $(".Ev-praiseNum span").text(preferUpNum - 1);
                              } else {
                                $(".Ev-praiseNum span").text("点赞");
                              }
                            } else {
                              $(".Ev-praiseNum span").text("点赞");
                            }
                          }
                        }
                      } else {//点赞
                        rep = CommService.execute("/mcall/customer/prefer/create/", params);
                        praising =false;
                        if (rep.responseStatus && rep.responseStatus == true) {
                          $(".Ev-praiseNum").addClass("on");
                          if (kv.indexOf("+") == -1) {
                            if($(".Ev-praiseNum span").text() === '点赞'){
                              $(".Ev-praiseNum span").text(1);
                            }else{
                              $(".Ev-praiseNum span").text(preferUpNum + 1).show();//点赞数
                            }
                          }
                        }
                      }
                    }
                  });
            });
            $(".Ev-collectNum").off("click").on("click", function () {//收藏数点击操作
				if(collecting){return false;}
                var kVal = $(".Ev-collectNum span").text();
                var collectionNum = $(".Ev-collectNum span").text() ? parseInt($(".Ev-collectNum span").text()) : "";
                var param = {};
				collecting =true;
                param.customerId = cId;
                param.refId = refId;
                param.collectionType = refType;
                user.privExecute({
                    operateType: 'auth',   //'login','auth','conference'
                    callback: function () {
                      if ($(".Ev-collectNum").hasClass("on")) {//取消收藏
                        rep = CommService.execute("/mcall/customer/collection/delete/", param);
                        collecting = false;
                        if (rep.responseStatus && rep.responseStatus == true) {
                          $(".Ev-collectNum").removeClass("on");
                          if (kVal.indexOf("+") == -1) {
                            if (collectionNum && collectionNum > 0) {
                              if (collectionNum - 1 > 0) {
                                $(".Ev-collectNum span").text(collectionNum - 1);
                              } else {
                                $(".Ev-collectNum span").text("收藏");
                              }
                            } else {
                              $(".Ev-collectNum span").text("收藏");
                            }
                          }
                        }
                      } else {//收藏
                        rep = CommService.execute("/mcall/customer/collection/create/", param);
                        collecting = false;
                        if (rep.responseStatus && rep.responseStatus == true) {
                          $(".Ev-collectNum").addClass("on");
                          if (kVal.indexOf("+") == -1) {
                            if($(".Ev-collectNum span").text() === '收藏'){
                              $(".Ev-collectNum span").text(1);
                            }else{
                              $(".Ev-collectNum span").text(collectionNum + 1).show();//收藏数
                            }
                          }
                        }
                      }
                    }
                });
            });
        },
        //顶部滚动和评论区导航滚动
        scrollFunc:function(){
            var windowTop = 0;//初始可视区域距离页面顶端的距离
            $(window).bind("scroll", function() {
                var _top=$(".Ev-discussArea").offset().top;
                var scrolls = $(this).scrollTop();//获取当前可视区域距离页面顶端的距离
                if (scrolls >= _top) {//评论区顶部最新最旧
                    var top = 0;
                    if($('.Ev-fixedHeader').length>0){
                        top=$('.Ev-fixedHeader').outerHeight()
                    }
                    $(".Ev-discussArea h2").css({
                        "position": "fixed",
                        "top": top,
                        "left": 0,
                        "right": 0,
                        "background": "#fff",
                        "z-index": 4
                    });
                } else {
                    $(".Ev-discussArea h2").css({
                        position: "static"
                    });
                }
                if (scrolls >= windowTop) {//向下滑动
                    if (scrolls != 0) {
                        windowTop = scrolls;
                    }

                    // $('.al-terminalFooter').hide();
                }else {//上滑
                    windowTop = scrolls;
                    // $('.al-terminalFooter').show();
                }
            });
        },
        //所属活动
        activityStatus: function (data) {
            var t = this;
            var act = data.activity;
            if (act.activityId != 0 || act.activityId != "") {
                $(".Ev-activity").show().find("span").text(act.type == 1 ? "活动：" : "专题：");
                $(".Ev-actName").text("《" + comm.getStrByteLen(act.activityName, 28) + "》").attr("href", act.activityUrl);
            }
        },
        //获取标签列表
        getTabList: function () {
            //(1-视频,2-文库,4-话题,7-病例)
            var t = this;
            var param = {
                resourceType:2,
                resourceId: refId,
                isValid: 1,
                vFlag:4
            };
            t.param = param;
            var cBack = function (rep) {
                if (rep&&rep.responseData&&rep.responseData.dataList) {
                    var _rep = rep.responseData.dataList;
                    var TagHtml = '';
                    for(var i = 0;i<_rep.length;i++){
                        var tagName = comm.getStrByteLen(_rep[i].propertyName,18);
                        if(_rep[i].propertyType==4){
                            if(_rep[i].propertyLogoUrl){
                                if(parseInt(_rep[i].propertyId,10)===14){
                                    TagHtml += '<a href="//m.allinmd.cn/dist/elite/elite.html#/home" class="al-terminalTags"><img src="'+_rep[i].propertyLogoUrl+'" />'+tagName+'</a>';
                                }else{
                                    TagHtml += '<a href="//m.allinmd.cn/dist/organization/organization.html?orgId='+_rep[i].propertyId+'#/" class="al-terminalTags"><img src="'+_rep[i].propertyLogoUrl+'" />'+tagName+'</a>';
                                }
                            }else{
                                if(parseInt(_rep[i].propertyId,10)===14){
                                    TagHtml += '<a href="//m.allinmd.cn/dist/elite/elite.html#/home"  class="al-terminalTags"><img src="/images/img50/v3/video-detail/normalTagIcon.png" />'+tagName+'</a>'
                                }else{
                                    TagHtml += '<a href="//m.allinmd.cn/dist/organization/organization.html?orgId='+_rep[i].propertyId+'#/" class="al-terminalTags"><img src="/images/img50/v3/video-detail/normalTagIcon.png" />'+tagName+'</a>'
                                }

                            }
                        }else{
                            TagHtml += '<a href="//m.allinmd.cn/dist/discover/discover_tagSubject.html?tId='+_rep[i].propertyId+'" class="al-terminalTags">'+tagName+'</a>'
                        }
                    }
                    if(_rep.length>0){//如果存在数据
                        if($('.al-terminalContentTags').length<=0){//即如果页面中没有相应的dom结构
                            tagDetailHtml = '<article class="al-terminalContextItem al-terminalContentTags" data-alcode-mod="498" style="display: block;">' +
                                                '<h3>标签</h3>' +
                                                TagHtml+
                                            '</article>';
                            $('.al-series-belong').after(tagDetailHtml)
                        }else{
                            $('.al-terminalContentTags').html('<h3>标签</h3>'+TagHtml);
                            $('.al-terminalContentTags').show();
                        }
                    }
                }
            };
            comm.ajax.async(t.path.getTabList, {paramJson: $.toJSON(param)}, cBack);
        }
    };
    doc.init();
    //相关产品
    var relatedProducts = {
        path: {
            product: "/mcall/cms/resourceCategory/getMapList/"
        },
        init: function () {
            var t = this;
            t.resourceType = $("#relationType").val();
            t.resourceId = $("#resourceId").val();
            t.getData();
            t.appendRecommendProduct();
        },
        appendRecommendProduct:function(){
            var oldRecommendElement = $(".al-productRecommendPart");//原有的相关推荐产品
            var newRecommendTemplate = '<!--推荐产品开始-->'+
                '                        <section class="al-elite-productList" style="display: none;">'+
                '                            <section class="al-elite-titleBar productTitle"><h1 class="title">推荐产品</h1>'+
                '                            </section>'+
                '                            <section class="al-elite-productContainerWrap">'+
                '                                <section class="al-elite-productContainer">'+
                '                                </section>'+
                '                            </section>'+
                '                        </section>'+
                '  <!--推荐产品结束-->';
            oldRecommendElement.hide().after(newRecommendTemplate);
            oldRecommendElement.remove();
        },
        getData: function () {
            var t = this;
            var data = {
                resourceType: t.resourceType,     //文库2 视频1 病例7
                resourceId: t.resourceId,
                categoryType: 4,
                pageIndex: 1,
                pageSize: 10000,
                isValid: 1,
                sortType: 5,
                vFlag: "3.8"
            };
            var params = {paramJson: $.toJSON(data)};
            comm.loading.show();
            comm.ajax.async(t.path.product, params, function (data) {
                $(".al-productRecommendPart").css("display", "block");
                if (data && data.responseObject.responseData && data.responseObject.responseData.total_count) {
                    var total_count = data.responseObject.responseData.total_count;
                    t.total_count = total_count;
                    $('.al-productRecommendPart .num').text(total_count);
                }
                if (data && data.responseObject.responseData && data.responseObject.responseData.data_list) {
                    var data_list = data.responseObject.responseData.data_list;
                    if (data_list.length > 0) {
                        t.dataProcessing(data_list);
                    }
                }
                if ($.isEmptyObject(data.responseObject.responseData)) {
                    $(".al-productRecommendPart").css("display", "none");
                }
                comm.loading.hide();
            });
        },
        dataProcessing: function (data) {
            var t = this;
            var html = '';
            /*唯医3.6推荐产品逻辑开始*/
            $(".al-elite-productList .title").html('推荐产品');
            var n = data.length >= 10 ? 10 : data.length;
            if(n>0){
                $(".al-elite-productList").show();
            }
            for (var i = 0; i < n; i++) {
                var dataItem = data[i];
                var newUrlLink = dataItem.productId;
                dataItem.webStoragePath = '//m.allinmd.cn/dist/medPlus/medPlus.html?#/productDetail?productId=' + newUrlLink + '&';
                if (parseInt(dataItem.operationType, 10) === 1) {
                    if (dataItem.attPath !== '') {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    } else {
                        html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                            '                                        <section class="al-elite-productCard"\n' +
                            '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                            '                                        </section>\n' +
                            '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                            '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                            '                                    </a>';
                    }
                } else if (parseInt(dataItem.operationType, 10) === 2) {
                    if ((parseInt(dataItem.customerId, 10) === parseInt(cId, 10)) && (parseInt(dataItem.customerId, 10) != 0)) {//我打的产品
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                            <span class="al-my-product">我的</span>\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    } else {
                        if (dataItem.attPath !== '') {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        } else {
                            html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                                '                                        <section class="al-elite-productCard"\n' +
                                '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                                '                                        </section>\n' +
                                '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                                '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                                '                                    </a>';
                        }
                    }

                // 3推广这项不显示
                // } else if (parseInt(dataItem.operationType, 10) === 3) {
                //     if (dataItem.attPath !== '') {
                //         html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                //             '                                        <section class="al-elite-productCard"\n' +
                //             '                                                 style="background: url(&quot;'+dataItem.attPath+'&quot;) center center / cover no-repeat;">\n' +
                //             '                                           <span class="al-vendor-product">推广</span>\n' +
                //             '                                        </section>\n' +
                //             '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                //             '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                //             '                                    </a>';
                //     } else {
                //         html+='<a class="al-elite-productItem" href="' + dataItem.webStoragePath + '?from=2&visitSiteId=2"  class="ev_digHole">\n' +
                //             '                                        <section class="al-elite-productCard"\n' +
                //             '                                                 style="background: url(&quot;//img50.allinmd.cn/score/productNoImg.png&quot;) center center / cover no-repeat;">\n' +
                //             '                                           <span class="al-vendor-product">推广</span>\n' +
                //             '                                        </section>\n' +
                //             '                                        <article class="al-elite-productDes productBackProductDes">\n' +
                //             '                                            <p class="content">'+dataItem.productName+'</p></article>\n' +
                //             '                                    </a>';
                //     }

                }

            }
            $('.al-elite-productContainer').append(html);
            if (n == 10) {
                $('.al-elite-productContainer').append('<section class="al-elite-productItem al-elite-productMore total">\n' +
                    '                                        <section class="al-elite-productCard"\n' +
                    '                                                 style="background: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABp5JREFUeAHtnc1rlEccx3c3wSSHmCBSRSwmoRARxJqjUMGg9BQPbc+C9FIP9dL2r9BezKG9lIJn20NyKpYUWsgxLQ2IgZKkNYS2iBiFbFLy0s93febhedlnn3mefZLN7s4DDzPPzPzm5bO/38w8LzNbLrXw2N/fP7m9vX2ZKozv7e2Nl8vlcfynOQeJG+R6UNXD/xr/a7w6/+Z6qVKpLOFf6uvr+5W45/hbcpQPs1QaPgCw68CapNxJGn6RsKbqQB5ksb9IfnNAnQPoj4RVD6tdTVXeppICtLW1dZW0tzg/4vq4jVzeNMB7hewjzof9/f0/C3DevGzkDgwgoPrQttu4X3CO2VSm6DTAW+a8h1Z+i7tddP7Kr3CAwJKZfoKZfk7+Zw6i0jnyXMe87wPya0AWat6FAsRUpwD4gHMkRyMPXAR4q5x3Me3ZogorBGC1Wj0ncFTqZlEVO+B8ZgD56cDAwF/NltM0QMz1g93d3W+oyHCzlTlk+Zc9PT0fY9bfN1NuJa8wGndsc3PzAfC+I492g6dmD6vuaoPakpdDLg2kwBP0d7O4V/IWfJTkMOd5+sUp3BdZ65UZINDOAu8H3AtZCzvK6YH3BIjv465lqWcmgIAbB9xjzrezFNIuaYH3jPMGIHWbaHVY94HSvE6GJ1pSDK+NZ63okcgKIJmqz5PZdqTmBWGpjV5bTwTDk/ypAMnwGBlqwOioPi8JiMLVVq/NqaNzKkAmyffJsCNG20bQonFqs9oeDY9eNxxEvEmy5nldezDZ/rDRZDsRoHd79hvk2nGSXOQP/pKR+VLSbV+iCaPCurftdnj6IYZhMZ30i9QFSAc6hUC7PBhIaluR4Tc9JrE8YyYM7QESP8EdiaXu4gDMeJUJ9gXc0PPEmAbS991x8OKaIiZ6UByNCWkgifoAuEyio/IkOVrfVl+vM5iMoYX+64GQBkL4toPX8Dc64zHyE/kaiPbp7dkfuGN+rPPECKB9y/SF7+DW3vb5Ggi8qw5ejFcsQIzEykT4AAm4ZQKdm0rAZ1UzYahq6qJPJo6niroEJcz3FWZ8Grda00A6xusOnr1miJWYSaIG0PtWxT4Hl7JkmJk+cNIxyUygxkyfNp2k//sX15/SZM6qCwU0jaEffKuCLV928LJrgJiJnUz4fHZxJ+ERGK/QGeqrUHfkIAC78xVs2QHMAU8iYteLeyqnfKIYfUNpZWWltLGxUUszNDRUGh0dLfFuIVEmGNFq+WBdUvynyjy+WqFDHElJaB2txi8sLJR2dnZCMr29vaWJiYlUiK2WD1U65QINXK0Ar/YlfEpa62hpXhSehBWmuLSj1fJp9QvGi536wEIBGrMNFmT8jeJs0hyGvKmHjSt25k7EJr1LU4eATFiLVwo7NGAkHY3ijEyjNI3iipI3+di4YicTLhSgRlsNGNFDYYpLO1otn1a/YLzYaRT+HZIXgxHN+ls9DWm2fNv2A3BRAPXBZO3Zlq2gS/eGAAAfqw+0/hrTgQsTEDsW8FSehoPdlS0B2C1pGuM00JZYPN2Se6Aah2IVQv/35oEqnufY8qKVlEvkExAzsTN3InN+jPPYEqgxqwGkM3QAbbF56Qwz92I9Izglx3TDL9YJ0EeDWibvDjsCjzxmoYU2D+1kXSoI+Kz8d8GMKu7zNgvdQPPqf95GxD7nPYs8ujqJGImVgeBroALQQveJryFT3238iS9ktxmeU5c31c+780PFRoyCLQ1poCLQQrfMIUjI8wPObpkDCaucd+vk0dVBYiI2UQjmVi4UzldHswTMhAK7+2LGYxKjEDNhk4In1ecwZ7fYsFTKt9iQBSV/al8VA7RbXTFIWqkpJnVN2MDy1slOm+sudKcbrRUWj0QTNrAwYy35/wm3q1atM2BoL5lruP8ZFvXcVIASAp42nfgFtyv2TQCa9pB5Dzd1Ix4rgB5EbbgzD8SO3rkDaM+AdwV3rZ7GRcMa9oHBxMqQ84YKCIZ3kl9t89poBU9tt9ZAAwoNdFs/GRi41hpoZPiF1rz+Yd6EtbtLmzRgqM+z1jzT5swAJUhBLyjwGt5OmOJMqy1qk4GSxc1swtHM+ZDHbcAYhZLlWhNNfr13kWmne2dtAXopbZJsw6FpDQwWwjTHbUIbBJLHzyg9wIOIO8h+xnlUNq9Ypy5fck/7FZoXeySVp51GplANNJnKBaTbiDsIJK8fkG4r+LzwonIyb0Zt92cEUTB5rwFq/g7jvBY90j9p3Z6WnjX6O4x/kDN/h/GUkbSlf4fxPxamYl2QcMBBAAAAAElFTkSuQmCC\') center center / cover no-repeat;">\n' +
                    '                                        </section>\n' +
                    '                                        <article class="al-elite-productDes productEndProductDes">\n' +
                    '                                            <p class="content">查看更多</p></article>\n' +
                    '                                    </section>');
            }
            if (t.total_count == 9) {
                $('.al-elite-productContainer .al-elite-productMore').remove();
            }
            /*唯医3.6推荐产品逻辑结束*/
            if (t.total_count > 3) {
                //t.touchFun();
            }
            t.skipProduct();
            $('.ev_digHole').click(function () {
                var _hr = $(this).attr('href');
                var _refId = _hr.split('.html')[0];
                var _rd = _refId.substring(_refId.lastIndexOf('/') + 1);
                comm.creatEvent({
                    triggerType: '引流医栈',
                    keyword: $(this).find('.al-productRecommendText').text(),
                    actionId: 1,
                    pushMessageId: _rd,
                    locationId: $(this).parent().index() + 1
                });
            });
        },
        //手动滑动查看
        touchFun: function () {
            var tag_num = $(".al-productRecommendListBox >li").length;
            var nav_widthx = document.body.clientWidth; //获取可视区域宽度
            var tag_width = $(".al-productRecommendListBox >li").width();
            var max_width = (tag_num * tag_width + tag_width + 20) * -1; //获取左滑最大距离
            document.getElementById("al-productRecommendListBox").addEventListener('touchstart', touchStart, false);
            document.getElementById("al-productRecommendListBox").addEventListener('touchmove', touchMove, false);
            document.getElementById("al-productRecommendListBox").addEventListener('touchend', function () {
                isMove = false;
            }, false);

            function touchStart(e) {
                isMove = true;
                tx = parseInt($("#al-productRecommendListBox").css('left'));
                x = e.touches[0].pageX;
            }

            function touchMove(e) {
                if (isMove) {
                    var n = tx + e.touches[0].pageX - x;
                    if (n <= 0 && n > max_width) {
                        $("#al-productRecommendListBox").css('left', n + 'px');
                    }
                }
            }
        },
        //点击全部进入产品列表页
        skipProduct: function () {
            var t = this;
            $(".total").on("click", function () {
                window.location = '/dist/medPlus/medPlus.html#/terminalRelatedProducts?resourceType=' + t.resourceType + '&resourceId=' + t.resourceId + '';
            });
        }
    }
    relatedProducts.init();
    //window.onload = Log.createBrowse(5, "文库终端页面"); //	浏览日志

});


