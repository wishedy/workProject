/**
 * Created by zhangheng on 2017/3/27.
 */
$(document).ready(function () {
    var subjectFilter = {
        "init": function () {
            var sf = this;
            var fH = $(".al-searchHead").height();
            $(".al-mainInner").css("marginTop", fH);
            sf.work.changeTab();
            sf.work.searchTop();
            sf.means.applySubjectList({
                "data": {
                    sortType: 5,
                    pageIndex: 1,
                    pageSize: 20,
                    "themeGroup": sf.parameters.themeGroup,
                }
            });
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        "means": {
            "share": function () {
                var sf = subjectFilter;
                var _shareObj;
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 58,
                            shareChannel: 4,
                            shareContent: _shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: 58,
                            shareChannel: 5,
                            shareContent: _shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: 58,
                                shareChannel: 1,
                                shareContent: _shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: 58,
                                shareChannel: 3,
                                shareContent: _shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest:function(){
                        $.ajax({
                            url: sf.parameters.applyDataPort.share,
                            data: {paramJson:$.toJSON({
                                sortType: 5,
                                pageIndex: $(".al-discoverSeminarInnerBox").attr("data-page"),
                                pageSize: 20,
                                sceneType: 15,
                                "themeGroup": sf.parameters.themeGroup,
                                "searchKeyword": sf.parameters.searchVal
                            })},
                            dataType:"json",type:"post",async:false,
                            success: function (data) {
                                var sList = data.responseObject.responseData.data_list[0].share_channel;
                                var shareObj = {
                                    title: '',
                                    summary: '',
                                    sinaTitle: '',
                                    wxTitle: '',
                                    wxDesc: '',
                                };
                                $(sList).each(function (index, element) {
                                    if (element.shareChannel === 'QZone') {
                                        shareObj.title = element.shareTitle;
                                        shareObj.summary = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'Sina') {
                                        shareObj.sinaTitle = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'WechatFriend') {
                                        shareObj.wxTitle = element.shareTitle;
                                        shareObj.wxDesc = element.shareDesc;
                                    }
                                    if (element.shareChannel === 'WechatTimeline') {
                                        shareObj.timeLineTitle = element.shareTitle;
                                    }
                                });
                                _shareObj = shareObj;
                            },
                            failed: function () {
                                //$(".al-scrollShareBtn").hide();
                            }
                        });
                        return _shareObj;
                    }
                }, false, $('.al-scrollShareBtn'));

            },
            "applySubjectList": function (options) {
                var sf = subjectFilter;
                sf.means.applyData({
                    port: sf.parameters.applyDataPort.subjectList,
                    postData: options.data,
                    operate: function () {
                        $(window).off("scroll");
                    },
                    success: function (data) {
                        sf.parameters.subjectData = data.responseObject.responseData.data_list;
                        var subjectObj = $(".al-discoverSeminarInnerBox");
                        subjectObj.html(sf.means.template.subjectList()).attr({"data-page": "1"});
                        if(sf.parameters.subjectData.length==0||sf.parameters.subjectData.length<20){
                            subjectObj.attr('scrollPagination','disabled');
                        }
                        sf.work.scrollPage(subjectObj);
                        if(sf.parameters.subjectData.length){
                            sf.means.share();
                            $('.al-scrollShareBtn').show();
                        }else{
                            $('.al-scrollShareBtn').hide();
                        }
                    },
                    failed: function () {
                        $(".searchResultsText").hide();
                        $(".al-discoverSeminarNone").show();
                        $('.al-scrollShareBtn').hide();
                    }

                });
            },
            "applyData": function (options) {
                var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                var postData = {"paramJson": $.toJSON(options.postData)};
                $.ajax({
                    url: options.port,    //请求的url地址
                    dataType: "json",   //返回格式为json
                    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                    data: postData,    //参数值
                    type: postType,   //请求方式
                    beforeSend: function () {
                        //请求前的处理
                        options.operate && options.operate();
                        comm.loading.show();
                    },
                    success: function (data) {
                        //请求成功时处理
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        if (realNoData || !realStatus) {
                            comm.loading.hide();
                            options.failed && options.failed();
                        } else {
                            comm.loading.hide();
                            options.success && options.success(data);
                        }

                    },
                    complete: function () {
                        //请求完成的处理
                    },
                    error: function () {
                        //请求出错处理
                    }
                });
            },
            "template": {
                "subjectList": function () {
                    var sf = subjectFilter;
                    var template = "",
                        markImg = "";
                    var demoData = sf.parameters.searchOnOff ? sf.parameters.searchData : sf.parameters.subjectData;
                    $.each(demoData, function (index, val) {
                        if (parseInt(this.isHot) === 1) {
                            markImg = '<i class="al-semeinarMark">' +
                                '<img src="/images/img50/pages/discover/mark_hot.png" alt="">' +
                                '</i>';
                        }

                        if (parseInt(this.isLiving) === 1) {
                            markImg = '<i class="al-semeinarLiving">' +
                                '<img src="/images/img50/pages/discover/mark_hot.png" alt="">' +
                                '</i>';
                        }

                        if (parseInt(this.isNew) === 1) {
                            markImg = '<i class="al-semeinarMark">' +
                                '<img src="/images/img50/pages/discover/mark_new.png" alt="">' +
                                '</i>';
                        }
                        template += '<section class="al-discoverSeminarInner">' +
                            '<section class="al-discoverSeminar">' +
                            '<a href="' + this.themeStoragePath + '">' +
                            '<figure class="al-discoverSeminarImg">' +
                            '<img src="' + this.themeLogoUrl + '" alt="">' + markImg +
                            '</figure>' +
                            '<figcaption class="al-discoverSeminarContent">' +
                            '<h2 class="EV-seminarContent">' + this.themeName + '</h2>' +
                            '<span>查看全文<i class="icon-messageMore"></i></span>' +
                            '</figcaption>' +
                            '</a>' +
                            '</section>' +
                            '</section>';

                    });
                    return template;
                }
            }
        },
        "work": {
            "searchCancel": function () {
                var sf = subjectFilter;
                var cancelObj = $(".al-searchCancel");
                var cancelIcon = $(".icon-searchCancel");
                cancelObj.off("click").on("click", function (e) {
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"取消",
                        actionId:45
                    });
                    sf.parameters.searchOnOff = false;
                    var headObj = $(".al-searchHead");
                    $("#EV-SearchInput").removeClass("focus").val("");
                    $(".al-searchInputBar").removeClass("alZindex");
                    headObj.show().find(".subjectTab").show();
                    $(".al-discoverSeminarNone").hide();
                    var fH = headObj.height();
                    $(".al-searchFocusMaskShow").remove();
                    $(".al-mainInner").css({"marginTop": fH});
                    $(".al-searchCancel").hide();
                    $(".searchResultsText").hide();
                    $(window).off("scroll");
                    var subjectObj = $(".al-discoverSeminarInnerBox");
                    if(sf.shareChange){
                        sf.means.applySubjectList({
                            "data": {
                                sortType: 5,
                                pageIndex: 1,
                                pageSize: 20,
                                "themeGroup": sf.parameters.themeGroup,
                            }
                        });
                    }else{
                        subjectObj.html(sf.means.template.subjectList()).attr({"data-page": "1"});
                    }
                    subjectObj.removeAttr('scrollpagination');
                    sf.work.scrollPage(subjectObj);
                });
                cancelIcon.off("click").on("click", function (e) {
                    sf.parameters.searchData = [];
                    e.stopPropagation();
                    $(this).hide();
                    $("#EV-SearchInput").val("");
                    $(".al-discoverSeminarNone").hide();
                    var subjectContentObj = $(".al-discoverSeminarInnerBox");
                    subjectContentObj.attr({
                        "data-subjectCntType": $(this).attr("data-subjectType"),
                        "data-page": "1",
                        "scrollpagination": ""
                    }).html("");
                    return false;
                });
            },
            "searchTop": function () {
                var sf = subjectFilter;
                var searChInputObj = $("#EV-SearchInput");
                searChInputObj.unbind("click touchstart").bind("click touchstart",function(){
                    var isFocus=$(this).is(":focus");
                    if(!isFocus){
                        $(this).trigger("focus");
                    }
                });
                searChInputObj.unbind("focus").bind("focus", function () {
                    Log.createBrowse(173,'专题-搜索');
                    var isThis = $(this);
                    if (!isThis.hasClass("focus")) {
                        isThis.addClass("focus");
                        sf.parameters.searchOnOff = true;
                        $(".al-searchInputBar").addClass("alZindex");
                        $(".subjectTab").slideUp();
                        $(".al-mainInner").animate({"marginTop": "0"}, 400, function () {
                            $(".al-searchFocusMaskShow").remove();
                            if (isThis.hasClass("focus")) {
                                $("body").append("<section class=\"al-searchFocusMask al-searchFocusMaskShow\"></section>");
                            }
                            sf.shareChange =false;
                            sf.work.searchCancel();
                            sf.work.searchBegin();
                        });
                        $(".al-searchHead").hide();
                        $(".al-searchCancel").show();
                    }


                }).blur(function () {
                });
            },
            "searchBegin": function () {
                var timer = null;
                var nowVal = '';
                var inputSelf;
                var flag = true;
                $('#EV-SearchInput').bind('compositionstart',function(){
                    flag = false;
                });
                $('#EV-SearchInput').bind('compositionend',function(){
                    flag = true;
                });
                $('#EV-SearchInput').on('input propertychange', function () {
                    clearTimeout(timer);
                    inputSelf = $(this);
                    nowVal = inputSelf.val();
                    timer = setTimeout(function() {
                        if(nowVal&&flag) {
                            comm.creatEvent({
                                triggerType: '搜索',
                                keyword: inputSelf.val(),
                                actionId: 10
                            });
                            var sf = subjectFilter;
                            sf.shareChange = false;
                            var searchVal = inputSelf.val();
                            var cancelIcon = $(".icon-searchCancel");
                            if (searchVal.length > 0) {
                                cancelIcon.show();
                                sf.parameters.searchVal = searchVal;
                                var subjectContentObj = $(".al-discoverSeminarInnerBox");
                                $(".al-searchFocusMaskShow").remove();
                                subjectContentObj.attr({
                                    "data-subjectCntType": inputSelf.attr("data-subjectType"),
                                    "data-page": "1",
                                    "scrollpagination": ""
                                }).html("");
                                sf.means.applyData({
                                    port: sf.parameters.applyDataPort.subjectList,
                                    postData: {
                                        sortType: 5,
                                        pageIndex: 1,
                                        pageSize: 20,
                                        "themeGroup": sf.parameters.themeGroup,
                                        "searchKeyword": sf.parameters.searchVal
                                    },
                                    operate: function () {
                                        $(window).off("scroll");
                                    },
                                    success: function (data) {
                                        sf.parameters.searchData = data.responseObject.responseData.data_list;
                                        var subjectObj = $(".al-discoverSeminarInnerBox");
                                        subjectObj.html(sf.means.template.subjectList()).attr({"data-page": "1"});
                                        $(".al-discoverSeminarNone").hide();
                                        $(".searchResultsText").show();
                                        sf.work.scrollPage(subjectObj);
                                        if (sf.parameters.searchData.length == 0 || sf.parameters.searchData.length < 20) {
                                            subjectObj.attr('scrollPagination', 'disabled');
                                        }
                                        if (sf.parameters.searchData.length) {
                                            sf.means.share();
                                            sf.shareChange = true;
                                            $('.al-scrollShareBtn').show();
                                        } else {
                                            $('.al-scrollShareBtn').hide();

                                        }

                                    },
                                    failed: function () {
                                        var subjectContentObj = $(".al-discoverSeminarInnerBox");
                                        subjectContentObj.attr({
                                            "data-subjectCntType": inputSelf.attr("data-subjectType"),
                                            "data-page": "1",
                                            "scrollpagination": ""
                                        }).html("");
                                        $(".searchResultsText").hide();
                                        $(".al-discoverSeminarNone").show();
                                        $('.al-scrollShareBtn').hide();
                                    }

                                });
                            } else {
                                $(".searchResultsText").hide();
                                $('.al-scrollShareBtn').hide();
                                cancelIcon.hide();
                            }
                        }
                    });
                });
            },
            "changeTab": function () {
                var sf = subjectFilter;
                $(".subjectTabItem").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        var subjectContentObj = $(".al-discoverSeminarInnerBox");
                        var subjectType = $(this).attr("data-subjectType")
                        if (subjectType == subjectContentObj.attr("data-subjectCntType")) {
                            return false;
                        } else {
                            switch(parseInt(subjectType)){
                                case 1:
                                    Log.createBrowse(169,'专题-基础骨病');break;
                                case 2:
                                    Log.createBrowse(170,'专题-骨科技术');break;
                                case 3:
                                    Log.createBrowse(171,'专题-精品栏目');break;
                                case 4:
                                    Log.createBrowse(172,'专题-特色专题');break;

                            }
                            var searchObj = $(".al-searchInputBar");
                            $(".active").removeClass("active");
                            $(this).addClass("active");
                            if ($(this).attr("data-subjectType") == "00") {
                                sf.parameters.themeGroup = "";
                                searchObj.show();
                            } else {
                                sf.parameters.themeGroup = $(this).attr("data-subjectType");
                                searchObj.hide();
                            }
                            subjectContentObj.attr({
                                "data-subjectCntType": $(this).attr("data-subjectType"),
                                "data-page": "1",
                                "scrollpagination": ""
                            }).html("");
                            $(".al-discoverSeminarNone").hide();
                            sf.means.applySubjectList({
                                "data": {
                                    sortType: 5,
                                    pageIndex: 1,
                                    pageSize: 20,
                                    "themeGroup": sf.parameters.themeGroup
                                }
                            });
                        }
                    })
                });
            },
            "scrollPage": function (container) {
                var sf = subjectFilter;
                var scrollOption = {
                    'contentPage': sf.parameters.applyDataPort.subjectList,
                    'contentData': $.extend({
                        sortType: 5,
                        pageIndex: 1,
                        pageSize: 20,
                        "themeGroup": sf.parameters.themeGroup,
                        "searchKeyword": sf.parameters.searchVal
                    }, {
                        pageIndex: function () {
                            var isPage = parseInt(container.attr("data-page"));
                            isPage++;
                            container.attr({"data-page": isPage});
                            return isPage;
                        }
                    }),
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 0,
                    'type': "post",
                    'beforeLoad': function () {
                        comm.loading.show();
                    },
                    'afterLoad': function (elementsLoaded) {
                        comm.loading.hide();
                    },
                    'loader': function (data) {
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        if (realNoData || !realStatus) {
                            container.attr("scrollPagination", "disabled").off("scroll");
                            $(window).off("scroll");
                        } else {
                            comm.loading.hide();
                            $.each(data.responseObject.responseData.data_list, function (index, val) {
                                if(sf.parameters.searchOnOff){
                                    sf.parameters.searchData.push(this);
                                }else{
                                    sf.parameters.subjectData.push(this);
                                }

                            });
                            $(".al-discoverSeminarInnerBox").html(sf.means.template.subjectList());
                            //sf.means.share();
                        }

                    }
                };

                $(window).off("scroll");
                container&&container.scrollPagination(scrollOption);
            }
        },
        "parameters": {
            "themeGroup": "", "subjectData": [], "searchOnOff": false, "searchData": [],"searchVal":"",
            "applyDataPort": {
                "subjectList": "/mcall/cms/theme/getMapList3/",
                "share": "/mcall/comm/data/share/getMapList3/",
                "subjectSearch": "/mcall/cms/theme/searchPrompt/"
            }
        }
    };
    subjectFilter.init();
});
