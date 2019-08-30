/**
 * Created by ALLIN on 2017/5/18.
 */
$(document).ready(function () {
    var operateData = {
        //关于页面操作数据的一系列方法
        requestData: function (options) {
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
                },
                success: function (data) {
                    //请求成功时处理
                    var realNoData = ((data.responseObject.responseMessage) == "NO DATA");
                    var realStatus = data.responseObject.responseStatus;
                    if (realNoData || !realStatus) {
                        options.failed && options.failed();
                    } else {
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
        getUrlName: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)return unescape(r[2]);
            return null;
        },
        pageName: function () {
            var a = location.href;
            var b = a.split("/");
            var c = b.slice(b.length - 1, b.length).toString(String).split(".");
            return c.slice(0, 1);
        }
    };
    var config = {
        //关于页面初始化的一些配置，基本元素，基本接口，基本参数
        element: {
            returnBack: $(".al-returnBack a"),
            banner: $(".au-series-banner"),//广告位容器
            mainContentObj: $(".classesCont"),//整个页面的左右栏容器
            downLoadBtn: $(".Ev-downloadBtn"),//下载按钮
            downLoadMask: $(".al-downLoad_PopBox"),//下载弹层
            closeDownLoad: $(".Ev-closePopBtn")//关闭下载弹层
        },
        ajaxPort: {
            log:"/call/log/customer/browse/createBrowse/",
            suggestion:PC_CALL + 'customer/suggestion/create/',
            banner: "/call/cms/course/getBannerList/",//banner位接口
            share: PC_CALL + 'comm/data/share/getMapList3/'//分享接口
        },
        parameter: {
            sourceId:operateData.getUrlName("tId"),
            pageName: operateData.pageName()[0],
            h5Url:""
        }
    };
    var template = {
        //关于字符串生成的一系列方法
        produce: function (type, data) {
            /*
             * 函数名称：produce
             * 描述：产生html字符串，不做任何逻辑判断
             * 参数说明：
             * -------1、type,规定要产生的模板类型，string,必须
             * -------2、data，动态数据，array,必须
             * 返回值说明：
             *  -------1、htmlStr，返回相应类型的html字符串，string
             * */
            //调用示例：produce("pay",data)
            var str = "";
            for (var typeNum = 0; typeNum < type.length; typeNum++) {
                str += this.demo[type[typeNum]];
                //////console.log(this.demo[type[typeNum]])
            }
            String.prototype.temp = function (obj) {
                return this.replace(/\$\w+\$/gi, function (matchs) {
                    var returns = obj[matchs.replace(/\$/g, "")];
                    return (returns + "") == "undefined" ? "" : returns;
                });
            };
            var htmlStr = "";
            for (var i = 0; i < data.length; i++) {
                htmlStr += str.temp(data[i]);
            }
            return htmlStr;
        },
        "demo": {}
    };
    var seriesCommon = {
        init: function () {/*系列课程页，课程详情页，受欢迎的讲师页面所有的返回功能在这里*/
            (document.referrer) ? config.element.returnBack.attr({"href": document.referrer}) : "/pages/discover/discover_index.html";
            var t = this;//设置banner位，展示医鼎相关课程，实现页面链接的跳转，换一批相关课程，相关课程的展示，写下你想看的，下载客户端，分享
            t.bannerSet().jumpLink().commResponse().downLoad().logRecord().shareAction();
            return t;
        },
        logRecord:function(){
            var t = this;
            $('[data-log-record]').off("mousedown").on("mousedown",function(){
                    if(!$(this).attr("data-href")){
                        var triggerType = $(this).attr("data-triggerType");
                        var keyword = $(this).attr("data-keyword");
                        var browType = $(this).attr("data-browType");
                        var actionId = $(this).attr("data-actionId");
                        var options = {
                            triggerType:triggerType,
                            keyword:keyword,
                            browType:browType,
                            actionId:actionId,
                            async:false,
                            noTimeOut:1
                        };
                        // debugger;
                        if($(this).attr("data-log-index")){
                            options.locationId = $(this).attr("data-index");
                        }
                        if($(this).attr("data-log-id")){
                            options.refId = $(this).attr("data-log-id");
                        }
                        if($(this).attr("data-log-special")){
                            if(JSON.parse($(this).attr("data-log-special"))){
                                comm.creatEvent(options);
                            }
                        }else{
                            comm.creatEvent(options);
                        }
                    }




            });
            return t;

        },
        shareAction: function () {
            var param = {};
            var ishttps = 'https:' == document.location.protocol ?'https:': 'http:';
            var platformId = $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val();
            switch (config.parameter.pageName) {
                case "discover_series_course":
                    param = {
                        "sceneType": "71",          // 169代表列表页分享，170代表详情页分享
                        "resourceType": 0,                                //资源类型传0，代表所有类型]
                        platformId:platformId
                    };
                    config.parameter.h5Url = ishttps+"//m.allinmd.cn/dist/discover/discover_series.html";
                    break;
                case "discover_series_details":
                    param = {
                        "sceneType": "72",          // 169代表列表页分享，170代表详情页分享
                        "resourceType": 0,                                //资源类型传0，代表所有类型
                        "courseId": operateData.getUrlName("tId"),             //详情页分享时候要传课程id过来
                        platformId:platformId
                    };
                    var listType = window.location.search;
                    config.parameter.h5Url = ishttps+"//m.allinmd.cn/dist/discover/discover_seriesDetail.html"+listType;
                    break;
                case "discover_series_teacher":
                    return false;
                    break;
            }
            var t = this;
            var o = $.extend(param, {"sceneType": param.sceneType});
            var sinaTitle="";var qqTitle="";var qZoneTitle="";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享
                url: document.location.href,// 分享链接， 默认取当前页链接
                h5Url: config.parameter.h5Url,//h5页面的链接会生成微信二维码
                title: "",// 分享标题
                shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: '',// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                triggerRequest:function(content) {//事件点击
                    $.ajax({
                        url: config.ajaxPort.share,
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
            return t;
        },
        downLoad: function () {//下载客户端
            var t = this;
            config.element.downLoadBtn.on("click", function () {
                ////console.log(config.element.downLoadMask)
                config.element.downLoadMask.show();
            });
            config.element.closeDownLoad.on("click", function () {
                config.element.downLoadMask.hide();
            });
            return t;
        },
        jumpLink: function () {
            var t = this;
            config.element.mainContentObj.on("mousedown", "[data-href]", function () {//系列课程所有跳转从这里开始
                if($(this).attr("data-courseid")){
                    if ($('#sesCustomerId').val() != undefined && $('#sesCustomerId').val() != "") {//已登录
                        comm.Log.createBrowse({href:21+"/"+$(this).parent().attr("data-seriesdirid"),id:200,name:'系列课目录页面',noTimeOut:1});
                    }
                }
                if ($(this).attr("data-log-record")) {
                    var logObj = $(this);
                    var triggerType = logObj.attr("data-triggerType");
                    var keyword = logObj.attr("data-keyword");
                    var browType = logObj.attr("data-browType");
                    var actionId = logObj.attr("data-actionId");
                    var options = {
                        triggerType: triggerType,
                        keyword: keyword,
                        browType: browType,
                        actionId: actionId,
                        noTimeOut:1
                    };
                    if (logObj.attr("data-log-index")) {
                        options.locationId = logObj.attr("data-log-index");
                    }
                    if (logObj.attr("data-log-id")) {
                        options.refId = logObj.attr("data-log-id");
                    }
                    comm.creatEvent(options);
                }

                //debugger;
            });
            return t;
        },
        commResponse: function () {
            var t = this;
            $("#ev_textArea").off("keyup").on("keyup",function(){
               if($(this).val().length>0){
                   $(".ev_submit").addClass("ev_submit-high-light");
               }else{
                   $(".ev_submit").removeClass("ev_submit-high-light");
                }

            });
            $('.ev_writeDown').click(function () {
                if ($('#sesCustomerId').val() != undefined && $('#sesCustomerId').val() != "") {//已登录
                    $('.al-responseEntry').hide();
                    $('.al-dis_subSideBar').show();
                    var valStr = "";
                    if(TempCache.getItem("subSuggestion")){
                        var jsonData = JSON.parse(TempCache.getItem("subSuggestion"));
                        if(parseInt(jsonData.tId)==parseInt(config.parameter.sourceId)){
                            valStr = jsonData.valStr;
                        }
                    }
                    $('#ev_textArea').val(valStr).focus();
                } else {
                    user.login({
                        callback: function () {
                            $('.al-responseEntry').hide();
                            $('.al-dis_subSideBar').show();
                            $('#ev_textArea').val(valStr);
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
                            sourceId:config.parameter.sourceId,
                            customerName: $('#sesCustomerId').data('name') != "" ? $('#sesCustomerId').data('name') : $('#sesCustomerId').data('userName'),
                            suggestionType: 8   //1-系统意见反馈;2-专题反馈
                        };
                        comm.LightBox.showloading();
                        $.ajax({
                            url: config.ajaxPort.suggestion,
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
                            //$.topTip({mark: "success", showTime: 2, content: "您的申请信息已被保存，下次可以继续编辑"});
                            //$.cookie('sub_suggest', $.trim($('#ev_textArea').val()), {expires: 365});
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
                            var subSuggestion = {
                                tId:config.parameter.sourceId,
                                valStr:$.trim($('#ev_textArea').val())
                            };
							TempCache.setItem("subSuggestion",JSON.stringify(subSuggestion))
                            setTimeout(function () {
                                ////console.log($(self).attr('href'))
                                var href = $(self).attr('href');
                                g_sps.jump(null,href);
                                //g_sps.jump($(self),$(self).attr('href'));
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
            return t;
        },
        bannerSet: function () {
            var t = this;
            ////console.log("开始")
            if(config.parameter.pageName=="discover_series_course"){
                operateData.requestData({
                    port: config.ajaxPort.banner,
                    get: true,
                    postData: {
                        "isValid": 1,
                        "channelId": 148      //频道id，pc传148，h5传149，ios传150，android传151
                    },
                    success: function (req) {
                        var bannerInfo = req.responseObject.responseData.data_list[0].ad_profile_attachment[0];
                        var pathUrl = bannerInfo.adAttUrl;
                        var linkUrl = bannerInfo.linkUrl;
                        var adId = bannerInfo.id;
                        if(pathUrl.length>0){
                            config.element.banner.attr({
                                "data-href": linkUrl,
                                "data-adId": adId
                            }).show().find("img").attr({"src": pathUrl});
                        }else{
                            config.element.banner.hide();
                        }
                        if(linkUrl.length>0){
                            config.element.banner.off("click").on("click",function(){
                                var triggerType = $(this).attr("data-triggerType");
                                var keyword = $(this).attr("data-keyword");
                                var browType = $(this).attr("data-browType");
                                var actionId = $(this).attr("data-actionId");
                                var options = {
                                    triggerType:triggerType,
                                    keyword:keyword,
                                    browType:browType,
                                    actionId:actionId
                                };
                                comm.creatEvent(options);
                                var href = $(this).attr("data-href");
                                g_sps.jump(null,href);
                            });
                        }

                    },
                    failed: function () {

                    }
                });
            }

            return t;
        }
    };
    seriesCommon.init();
});