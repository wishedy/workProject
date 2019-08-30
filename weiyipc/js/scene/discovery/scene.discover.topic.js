/**
 * Created by zhangheng on 2017/3/28.
 *
 * Change  by HJ on 2019/01/17
 * 将顶部的固定tab改成动态接口获取
 * 基础骨病、骨科技术、精品栏目、特色专题
 *
 */
$(document).ready(function () {
    var subjectFilter = {
        "init": function () {
            var sf = this;
            sf.topTabRender();//动态获取tab切换
            sf.work.commResponse();
            sf.work.searchBegin();
            sf.means.applyData({
                port: sf.parameters.applyDataPort.subjectList,
                type: 0,
                postData: {
                    sortType: 5,
                    pageIndex: 1,
                    pageSize: 10,
                    "themeGroup": sf.parameters.themeGroup
                },
                success: function (data) {
                    // //console.log(data)
                    $(".ev_subjectWrap").html(sf.means.template.subjectList());
                },
                failed: function () {
                    $(".subjectNone").show();
                }

            });

        },
        //顶部tab切换按钮变成
        topTabRender:function () {
            var t=this;
            $.ajax({
                url:PC_CALL+"cms/theme/getGroupList/",
                type:"get",
                data:{paramJson:JSON.stringify({
                        "firstResult":"0",
                        "maxResult":"99"
                    })},
                dataType:"json",
                success:function (data) {
                    if(data&&comm.hasResponseData(data)){
                        if(data.responseObject.responseData.dataList
                            &&data.responseObject.responseData.dataList.length){
                            var items=data.responseObject.responseData.dataList;
                            var html="";
                            var tabLen=0;
                            $.each(items,function (i, e) {
                                html+='<li class="subjectTabItem" data-subjectType="'+e.groupValue+'">'
                                    +e.groupName+'</li>';
                                tabLen+=e.groupName.toString().length;
                            });
                            $(".subjectTab ul li").eq(0).after(html);
                            if(tabLen>24){
                                var _kv= $(".subjectTab.subjectTabNewCss ul");
                                _kv.css({"height":"34px","overflow":"hidden"});
                                $(".ev-showMore").show().off("click").on("click",function(){
                                    if($(this).hasClass("closeMore")){//展开状态
                                        $(this).removeClass("closeMore").text("更多");//变成收起状态
                                        _kv.css({"height":"34px","overflow":"hidden"});
                                    }else {//收起状态
                                        $(this).addClass("closeMore").text("收起");//变成展开状态
                                        _kv.css({"height":"auto","overflow":"auto"});
                                    }
                                });

                            }
                            t.work.changeTab();
                        }
                    }
                }
            });
        },
        "means": {
            shareAction: function (param) {
                var t = subjectFilter;
                var o = $.extend(param, {"sceneType": getShareContentSense.by_subject});
                var sinaTitle="";var qqTitle="";var qZoneTitle="";
                module.share({
                    container: $(".ev-shareContainer"),// 存放分享组件的父级
                    type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                    url: document.location.href,// 分享链接， 默认取当前页链接
                    h5Url: '',//h5页面的链接会生成微信二维码
                    title: "",// 分享标题
                    shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                    trendUrl: '',// 分享到站内动态的接口
                    data: {},// 分享到站内动态的接口参数
                    callback: function () {},// 分享到站内动态成功后回调函数
                    triggerRequest:function(content){//事件点击
                        $.ajax({
                            url: t.parameters.applyDataPort.share,
                            type: "post",
                            data: {paramJson: $.toJSON(o)},
                            dataType: 'json',
                            async:false,
                            success: function (d) {
                                if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                    var item = d.responseObject.responseData.data_list[0];
                                    content.pic = item.share_comm.shareImageUrl;
                                    content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                    $.each(item.share_channel,function(i,el){
                                        if(el.shareChannel=='Sina'){
                                            sinaTitle=content.sinaTitle=el.shareDesc;
                                        }else if(el.shareChannel=="QQFriend"){
                                            qqTitle=content.qqTitle = el.shareTitle;
                                            content.qqSummary = el.shareDesc;
                                        }else if(el.shareChannel=="QZone"){
                                            qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                            content.qqZoneSummary = el.shareDesc;
                                        }
                                    });
                                }
                            }

                        });
                    },
                    shareSinaSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: shareSenceConst.discover_by_subject,
                            shareChannel: 3,
                            shareContent: sinaTitle
                        });
                    },
                    shareQQSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: shareSenceConst.discover_by_subject,
                            shareChannel: 2,
                            shareContent: qqTitle
                        });
                    },
                    shareQzoneSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            shareSence: shareSenceConst.discover_by_subject,
                            shareChannel: 1,
                            shareContent: qZoneTitle
                        });
                    }
                });
            },
            pagination: function (data) {
                var sf = subjectFilter;
                var content = 0;
                var dataContainer = [];
                var temporaryData = [];
                var controlNum = 0;
                $.each(data, function (index, val) {
                    var manageData = {
                        "isLiving": (this.isLiving) ? this.isLiving : 0,
                        "isHot": this.isHot,
                        "isNew": this.isNew,
                        "themeStoragePath": this.themeStoragePath,
                        "themeLogoUrl": this.themeLogoUrl,
                        "themeName": this.themeName
                    };
                    dataContainer.push(manageData);
                });
                return dataContainer;
            },
            pageClick: function (num) {
                var sf = subjectFilter;
                sf.means.applyData({
                    port: sf.parameters.applyDataPort.subjectList,
                    type: 0,
                    postData: {
                        sortType: 5,
                        pageIndex: num,
                        pageSize: 10,
                        "themeGroup": sf.parameters.themeGroup
                    },
                    success: function (data) {
                        $('.pager').pager({
                            pagenumber: num,
                            pagecount: sf.parameters.pageNum,
                            buttonClickCallback: sf.means.pageClick
                        });
                        sf.parameters.nowPage = num;
                        $(".ev_subjectWrap").html(sf.means.template.subjectList());
                    },
                    failed: function () {
                        $(".subjectNone").show();
                    }

                });
                /*$('.pager').pager({
                    pagenumber: num,
                    pagecount: sf.parameters.pageNum,
                    buttonClickCallback: sf.means.pageClick
                });
                sf.parameters.nowPage = num;
                $(".ev_subjectWrap").html(sf.means.template.subjectList());*/
            },
            "applySubjectList": function (options) {
                var sf = subjectFilter;
            },
            "applyData": function (options) {
                var sf = subjectFilter;
                var postType = (options.get) ? "GET" : "POST";//默认是post方式，除非特别传参指名要get方式。
                var postData = {"paramJson": $.toJSON(options.postData)};
                comm.LightBox.showloading();
                $.ajax({
                    url: options.port,    //请求的url地址
                    dataType: "json",   //返回格式为json
                    async: true, //请求是否异步，默认为异步，这也是ajax重要特性
                    data: postData,    //参数值
                    type: postType,   //请求方式
                    beforeSend: function () {
                        //请求前的处理
                        options.operate && options.operate();
                    },
                    success: function (data) {
                        //请求成功时处理
                        var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                        var realStatus = data.responseObject.responseStatus;
                        if (realNoData || !realStatus) {
                            comm.LightBox.hideloading();
                            options.failed && options.failed();
                        } else {
                            sf.parameters.subjectData = sf.means.pagination(data.responseObject.responseData.data_list);
                            comm.LightBox.hideloading();
                            switch (options.type) {
                                case 0:
                                    var listNum = data.responseObject.responseData.total_count;
                                    var pageNum = sf.parameters.nowPage;
                                    $('.subjectNum').html("<p>为你找到匹配结果<span>" + listNum + "</span>个</p>");
                                    sf.parameters.pageNum = Math.ceil(listNum / 10);
                                    var pageCount = sf.parameters.pageNum;
                                    ////console.log(pageCount)
                                    $('.pager').pager({
                                        pagenumber: pageNum,
                                        pagecount: pageCount,
                                        buttonClickCallback: sf.means.pageClick
                                    });
                                    sf.means.shareAction({
                                        sortType: 5,
                                        pageIndex: Number($(".pgCurrent").html()),
                                        pageSize: 3,
                                        "themeGroup": sf.parameters.themeGroup,
                                        "searchKeyword": sf.parameters.searchVal
                                    });
                                    break;
                            }

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
                    var _hotT = "";
                    var nowIndex = sf.parameters.nowPage;
                    var dataItem = sf.parameters.subjectData;
                    var htmlStr = "";
                    $.each(sf.parameters.subjectData, function (index, kv) {
                        if (kv.isLiving == 1) {
                            _hotT = '<i class="al-discover_SMC_LiveIcon"></i>';
                        } else {
                            if (kv.isHot == 1) {
                                _hotT = '<i class="al-discover_SMC_HotIcon"></i>';
                            } else if (kv.isNew == 1) {
                                _hotT = '<i class="al-discover_SMC_NewIcon"></i>';
                            }
                        }
                        htmlStr += '<section class="al-discover_subMainContent">' +
                            '     <figure>' +
                            _hotT +
                            '     <a href="' + kv.themeStoragePath + '" target="_blank"><img src="' + kv.themeLogoUrl + '" alt=""/></a>' +
                            '     </figure>' +
                            '     <p><a href="' + kv.themeStoragePath + '" target="_blank">' + kv.themeName + '</a></p>' +
                            '</section>';
                    });

                    return htmlStr;
                }
            }
        },
        "work": {
            "searchCancel": function () {
                var sf = subjectFilter;
            },
            "searchBegin": function () {
                var sf = subjectFilter;
                var flag = true;
                var timer = null;
                $("#EV-SearchInput").on('click',function(){
                    //事件埋点
                    comm.creatEvent({
                        triggerType:"搜索",
                        keyword:$(this).val(),
                        actionId:11
                    });
                });
                $("#EV-SearchInput").bind('compositionstart',function(){
                    flag = false;
                });
                $("#EV-SearchInput").bind('compositionend',function(){
                    flag = true;
                });
                $('#EV-SearchInput').bind('input propertychange', function () {
                    clearTimeout(timer);
                    var searchInfo = $(this).val();
                    timer = setTimeout(function(){
                        if(searchInfo&&flag){
                            var postData = {
                                sortType: 5,
                                pageIndex: 1,
                                pageSize: 200,
                                "themeGroup": sf.parameters.themeGroup

                            };
                            if (searchInfo.length > 0) {
                                sf.parameters.searchVal = searchInfo;
                                postData.searchKeyword = searchInfo;
                            }
                            sf.means.applyData({
                                port: sf.parameters.applyDataPort.subjectList,
                                type: 0,
                                postData: postData,
                                success: function (data) {
                                    $(".subjectNone").hide();
                                    $(".ev_subjectWrap").html(sf.means.template.subjectList());
                                },
                                failed: function () {
                                    $(".subjectNone").show();
                                    $(".ev_subjectWrap").html("");
                                    $('.subjectNum').html("为你找到匹配结果<span>" + 0 + "<\/span>个\n");
                                    $(".pager").html("");
                                }

                            });
                        }
                    },500);
                });
                $(".Ev-searchKey").unbind("click").bind("click",function(){
                    var searchInputObj = $('#EV-SearchInput');
                    var searchInfo = searchInputObj.val();
                    if(searchInfo.length>0){
                        searchInputObj.trigger("input");
                        searchInputObj.trigger("propertychange");
                    }
                });
                if($(".ev_subjectWrap").attr("data-subjectcnttype")=="00"){
                    $(document).keydown(function(event){
                        var searchInputObj = $('#EV-SearchInput');
                        var searchInfo = searchInputObj.val();
                        if((event.keyCode==13)&&(searchInfo.length>0)){
                            searchInputObj.trigger("input");
                            searchInputObj.trigger("propertychange");
                        }
                    });

                }
            },
            commResponse: function () {
                var sf = subjectFilter;
                $('.ev_writeDown').click(function () {
                    if ($('#sesCustomerId').val() != undefined && $('#sesCustomerId').val() != "") {//已登录
                        $('.al-responseEntry').hide();
                        $('.al-dis_subSideBar').show();
                        $('#ev_textArea').val($.cookie('sub_suggest') != undefined ? $.cookie('sub_suggest') : '').focus();
                    } else {
                        user.login({
                            callback: function () {
                                $('.al-responseEntry').hide();
                                $('.al-dis_subSideBar').show();
                                $('#ev_textArea').val($.cookie('sub_suggest') != undefined ? $.cookie('sub_suggest') : '');
                            },
                            scene: privilegeSceneConst.eSceneTypeLogin
                        })
                    }
                });
                //提交
                $('.ev_submit').click(function () {
                    if ($(this).attr('disable') == 'true') {
                        return false;
                    } else {

                        var _val = $.trim($('#ev_textArea').val());
                        if (_val == "") {
                            $('#ev_textArea').focus();
                            if (comm.browser.isIe8()) {
                                $('#ev_textArea').css('paddingLeft', "13px");
                            }
                            return false;
                        } else {
                            $(this).attr('disable', 'true');
                            var param = {
                                customerId: $('#sesCustomerId').val(),
                                suggestion: _val,
                                visitSiteId: 1,
                                customerName: $('#sesCustomerId').data('name') != "" ? $('#sesCustomerId').data('name') : $('#sesCustomerId').data('userName'),
                                suggestionType: 2   //1-系统意见反馈;2-专题反馈
                            };
                            comm.LightBox.showloading();
                            $.ajax({
                                url: sf.parameters.applyDataPort.suggestion,
                                type: "post",
                                data: {paramJson: $.toJSON(param)},
                                dataType: 'json',
                                success: function (data) {
                                    $('.ev_submit').attr('disable', 'false');
                                    comm.LightBox.hideloading();
                                    if (data && data.responseObject.responseStatus) {
                                        $.topTip({mark: "success", showTime: 2, content: "感谢您的反馈！我们会尽快处理"});
                                        $.removeCookie('sub_suggest');
                                        $('.al-responseEntry').show();
                                        $('.al-dis_subSideBar').hide();
                                    }
                                },
                                error: function () {
                                    comm.LightBox.hideloading();
                                    $('.ev_submit').attr('disable', 'false');
                                }
                            })
                        }
                    }

                });
                //取消
                $('.ev_cancelSubmit').click(function () {
                    $('.ev_submit').attr('disable', 'false');
                    if ($('#ev_textArea').is(':visible') && $.trim($('#ev_textArea').val()) != "") {
                        $.makeSurePopup({
                            title: "放弃编辑",//弹窗标题
                            content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                            content: "",//弹窗内容
                            url: "",//ajax请求接口（可不传，不传就不发请求）
                            param: "",//ajax请求参数(可不传)
                            toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                            callback: function () {
                                $.topTip({mark: "success", showTime: 2, content: "您的申请信息已被保存，下次可以继续编辑"});
                                $.cookie('sub_suggest', $.trim($('#ev_textArea').val()), {expires: 365});
                                setTimeout(function () {
                                    $('.al-responseEntry').show();
                                    $('.al-dis_subSideBar').hide();
                                }, 1000);
                            },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                            error: function () {
                            }//ajax请求失败后执行的方法(可不传)
                        });
                    } else {
                        $.removeCookie('sub_suggest');
                        $('.al-responseEntry').show();
                        $('.al-dis_subSideBar').hide();
                    }


                });
                $('body').on('click', 'a:not(.al-discover_subjectSideBar a, .al-release a)', function () {
                    var self = this;
                    $('.ev_submit').attr('disable', 'false');
                    if ($('#ev_textArea').is(':visible') && $.trim($('#ev_textArea').val()) != "") {
                        $.makeSurePopup({
                            title: "放弃编辑",//弹窗标题
                            content01: "确定放弃当前编辑的内容吗？",//弹窗内容字体会加粗 (可不传)
                            content: "",//弹窗内容
                            url: "",//ajax请求接口（可不传，不传就不发请求）
                            param: "",//ajax请求参数(可不传)
                            toJSON: 1,//传参是否为paramJSPN 0或1，默认为1
                            callback: function () {
                                $.topTip({mark: "success", showTime: 2, content: "您的申请信息已被保存，下次可以继续编辑"});
                                $.cookie('sub_suggest', $.trim($('#ev_textArea').val()), {expires: 365});
                                setTimeout(function () {
                                    var href = $(self).attr('href');
                                    g_sps.jump(null,href);
                                }, 1000);
                            },//点击确认后执行的方法（有发送请求时，是请求成功后执行的方法)
                            error: function () {
                            }//ajax请求失败后执行的方法(可不传)
                        });
                        return false;
                    }

                });
                //字数提示
                comm.textChange({"$tex": $("#ev_textArea"), "$num": $(".ev_numTip"), "noTop": 1});
            },
            "changeTab": function () {
                var sf = subjectFilter;
                $(".subjectTabItem").each(function () {
                    $(this).unbind("click").bind("click", function () {
                        var subjectContentObj = $(".ev_subjectWrap");
                        if ($(this).attr("data-subjectType") == subjectContentObj.attr("data-subjectCntType")) {
                            return false;
                        } else {
                            $(".pages").html("");
                            $(".subjectNum").html("");
                            var id; var name;
                            switch (parseInt($(this).attr("data-subjectType"))){
                                case 1:
                                    id="169";
                                    name="专题-基础骨病";
                                    break;
                                case 2:
                                    id="170";
                                    name="专题-骨科技术";
                                    break;
                                case 3:
                                    id="171";
                                    name="专题-精品栏目";
                                    break;
                                case 4:
                                    id="172";
                                    name="专题-特色专题";
                                    break;
                                case 5:
                                    id="";
                                    name="专题-唯品学院";
                                    break;
                                default:
                                    id="";
                                    name="";
                            }
                            comm.Log.createBrowse({href: location.href, id:id, name: name,platformId: $('#sesDepartment').val(),noTimeOut:1});
                            $(".active").removeClass("active");
                            $(this).addClass("active");
                            if ($(this).attr("data-subjectType") == "00") {
                                sf.parameters.themeGroup = "";
                                $(".al-discoverZJ_searchBox").show();
                            } else {
                                sf.parameters.themeGroup = $(this).attr("data-subjectType");
                                $(".al-discoverZJ_searchBox").hide();
                            }
                            subjectContentObj.attr({
                                "data-subjectCntType": $(this).attr("data-subjectType"),
                                'style':'height:800px'
                            }).html("");
                            $(".subjectNone").hide();
                            sf.parameters.nowPage = 1;
                            sf.means.applyData({
                                port: sf.parameters.applyDataPort.subjectList,
                                type: 0,
                                postData: {
                                    sortType: 5,
                                    pageIndex: 1,
                                    pageSize: 10,
                                    "themeGroup": sf.parameters.themeGroup
                                },
                                success: function (data) {
                                    subjectContentObj.attr('style','').html(sf.means.template.subjectList());
                                },
                                failed: function () {
                                    $(".subjectNone").show();
                                    $('.subjectNum').html("为你找到匹配结果<span>" + 0 + "<\/span>个\n");
                                }

                            });
                        }
                    });
                });
            }
        },
        "parameters": {
            "themeGroup": "", "subjectData": [], "searchVal": "",
            "pageNum": 1,
            "nowPage": 1,
            "applyDataPort": {
                'suggestion': PC_CALL + 'customer/suggestion/create/',
                "subjectList": PC_CALL + "cms/theme/getMapList/",
                "share": PC_CALL + 'comm/data/share/getMapList3/',
                "subjectSearch": "/mcall/cms/theme/searchPrompt/"
            }
        }
    };
    subjectFilter.init();
});
