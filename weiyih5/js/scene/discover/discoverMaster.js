/**
 * 功能描述：  发现——权威专家列表
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/24.
 */
$(function() {
    var DiscoverMaster = function() {
        var that = this;
        var $that = $(this);

        this.XHRList = {
            search: '/mcall/customer/pundits/getSearchPunditsCustomerName/',
            list: '/mcall/customer/pundits/getPunditsCustomerList/',
            share: '/mcall/comm/data/share/getMapList3/'
        };
    };
    DiscoverMaster.prototype = {
        init: function() {
            $(".EV-goToApplyMaster").on("click", function(e) {
                var $this=$(this);
                e.preventDefault();
                user.privExecute({
                    operateType: 'auth',
                    callback: function() {
                        //window.location = "/pages/discover/discover_addMaster.html";
                        g_sps.jump($this,"/pages/discover/discover_addMaster.html");
                    }
                });
            });
            if(navigator.userAgent.toLowerCase().indexOf('android')>-1){
                $('.al-content').css({marginTop:'.4rem','paddingTop':'.2rem'});
            }
            //window.onload = Log.createBrowse(50, '权威专家');
            this.layout();
            this.searchMasterList();
            this.digHole();
            this.getMasterList({
                pageSize: 20,
                pageIndex: 1,
                logoUseFlag: "10",
                sortType: 6,
                url: this.XHRList.list,
                container: $(".EV-listResultBox"),
                sBool: 0,
                platformId:TempCache.getItem('department')
            });
        },
        //返回埋点
        digHole:function(){
            $('.ev_digHole').click(function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
            });
        },
        layout: function() {
            var fH = $(".al-searchHead").innerHeight();
            $(".al-mainInner").css("marginTop", fH-25);


            $(".al-searchInputBar input").on("click", function(e) {
                $(".al-mainInner").css("marginTop", '1.4rem');
            });
            $(".al-searchCancel").on("click", function(e) {
                if (e.target.className === "icon-searchCancel") {
                    return;
                }
                $(".al-mainInner").css("marginTop", fH);
            });

            $(".al-doctorRecommend").on("cliclk", "#EV-preventAttr", function(e) {
                e.preventDefault();
                return false;
            });
        },
        getMasterList: function(sObj) {
            var template = '';
            var that = this;

            $.ajax({
                    url: sObj.url,
                    type: 'POST',
                    dataType: 'json',
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON({
                            pageSize: sObj.pageSize,
                            pageIndex: sObj.pageIndex,
                            logoUseFlag: sObj.logoUseFlag,
                            firstName: sObj.firstName,
                            sortType: sObj.sortType,
                            platformId:sObj.platformId,
                            sessionCustomerId:TempCache.getItem('userId')||""
                        })
                    },
                    beforeSend: function() {
                        comm.loading.show();
                    }
                })
                .done(function(data) {
                    $("#EV-searchResultContent").children().remove();
                    that.contentGenerate(sObj, data);
                    that.v1 = that.v2;
                    that.share(sObj.sBool);
                    comm.loading.hide();
                    that.dataWaterfall(sObj);
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        },
        contentGenerate: function(sObj, data) {
            var sList = data.responseObject.responseData.data_list;
            var contentPart = {},
                contributionNum = '';
            if (typeof(sList) !== 'undefined' && sList.length !== 0) {
                $(".al-noContentTips").hide();
                $('.al-scrollShareBtn').show();
                $(sList).each(function(index, element) {
                    contributionNum = parseInt(element.customerStatistic.caseNum) +
                        parseInt(element.customerStatistic.docNum) +
                        parseInt(element.customerStatistic.videoNum) +
                        parseInt(element.customerStatistic.topicNum);
                    contentPart = {
                        contribution: (contributionNum === 0) ? "" : ('<p>贡献<span>' + contributionNum.toWK() + '</span></p>'),
                        fans: (element.customerStatistic.fansNum === 0||!element.customerStatistic.fansNum) ? "" : ('<p>粉丝<span>' + element.customerStatistic.fansNum.toWK() + '</span></p>'),
                        comment: (element.customerStatistic.reviewNum === 0||!element.customerStatistic.reviewNum) ? "" : ('<p>评论<span>' + element.customerStatistic.reviewNum.toWK() + '</span></p>'),
                        job: (typeof(element.customerPunditsEntity.medicalTitleShow) === "undefined" || element.customerPunditsEntity.medicalTitleShow.length === 0) ? "" : ('<span class="al-doctorRecommendJob">' + comm.cutDoctorTitle(element.customerPunditsEntity.medicalTitleShow) + '</span>')
                    };
                    var selfId = localStorage.getItem('userId') == element.customerPunditsEntity.customerId ? "EV-preventAttr" : "";
                    template = '<section class="al-doctorRecommendItem">' +
                        '<figure class="al-doctorRecommendImg">' +
                        '<a id="' + selfId + '" href="/pages/personal/others_contribution.html?cid=' + element.customerPunditsEntity.customerId + '">' +
                        '<img src="' + element.customerAtt.logoUrl + '" alt="">' +
                        '</a>' +
                        '</figure>' +
                        '<article class="al-doctorRecommendMsg">' +
                        '<a class="al-doctorRecommendName" href="/pages/personal/others_contribution.html?cid=' + element.customerPunditsEntity.customerId + '">' + element.customerPunditsEntity.customerName + '<i class="al-vipUser"></i></a>' +
                        contentPart.job +

                        '<span class="al-doctorRecommendHospital">' + element.customerPunditsEntity.company + '</span>' +
                        '<article class="al-discoverRecommendNum">' +
                        contentPart.contribution +
                        contentPart.fans +
                        contentPart.comment +
                        '</article>' +
                        '</article>' +
                        '<div class="clearFix"></div>'
                        '</section> ';

                    sObj.container.append(template);

                });
            } else {
                if (!sObj.container.hasClass('EV-listResultBox')) {
                    $(".al-noContentTips").show();
                    $('.al-scrollShareBtn').hide();
                    $(".al-applicaptionMaster").show();
                }

            }
        },
        searchMasterList: function() {
            var that = this,
                ti;
            this.v1 = "";
            this.v2 = "";
            var timer = null;
            var nowVal = '';
            var inputSelf;
            var flag = true;
            $("#EV-SearchInput").bind('compositionstart',function(){
                flag = false;
            });
            $("#EV-SearchInput").bind('compositionend',function(){
                flag = true;
            });
            $("#EV-SearchInput").on("input propertychange", function(e) {
                clearTimeout(timer);
                inputSelf = $(this);
                nowVal = inputSelf.val();
                timer = setTimeout(function(){
                    if(nowVal&&flag) {
                        comm.creatEvent({
                            triggerType: '搜索',
                            keyword: inputSelf.val(),
                            actionId: 10
                        });
                        that.getMasterList({
                            url: that.XHRList.search,
                            pageSize: 20,
                            pageIndex: 1,
                            logoUseFlag: "10",
                            firstName: inputSelf.val(),
                            container: $("#EV-searchResultContent"),
                            sBool: 1,
                            platformId: TempCache.getItem('department')
                        });
                    }
                },500);


            });

            comm.inputFocus({
                focusCallback: function() {
                    $(".EV-searchResultBox").show();
                    $(".EV-listResultBox").hide();
                },
                inputCallback: function() {
                    $(".icon-searchCancel").show();
                },
                emptyCallback: function() {
                    $(".icon-searchCancel").hide();
                    that.getMasterList({
                        url: that.XHRList.search,
                        pageSize: 20,
                        pageIndex: 1,
                        logoUseFlag: "10",
                        firstName: "",
                        container: $("#EV-searchResultContent")
                    });
                },
                clearCallback: function() {
                    $("#EV-searchResultContent").children().remove();
                    $(".al-noContentTips").hide();
                    var s1 = $(".EV-listResultBox .al-doctorRecommendItem").eq(0).find(".al-doctorRecommendName").text();
                    var s2 = $(".EV-listResultBox .al-doctorRecommendItem").eq(1).find(".al-doctorRecommendName").text();
                },
                cancelCallback: function() {
                    comm.creatEvent({
                        triggerType:'全站功能按钮点击',
                        keyword:"取消",
                        actionId:45
                    });
                    $(".EV-searchResultBox").hide();
                    $(".EV-listResultBox").show();
                    var s1 = $(".EV-listResultBox .al-doctorRecommendItem").eq(0).find(".al-doctorRecommendName").text();
                    var s2 = $(".EV-listResultBox .al-doctorRecommendItem").eq(1).find(".al-doctorRecommendName").text();
                }

            });
        },
        // 瀑布流加载——仅针对搜索结果
        dataWaterfall: function(rObj) {
            var that = this;
            this.lNum = 2;
            this.sNum = 2;
            var data = {
                logoUseFlag: "10",
                pageSize: 20,
                // firstName:that.v2
            };

            var sObj = {
                lContainer: $(".EV-listResultBox"),
                sContainer: $("#EV-searchResultContent"),
                sUrl: this.XHRList.search,
                lUrl: this.XHRList.list,
            };


            if ($(".EV-listResultBox").is(":visible")) {
                data = {
                    logoUseFlag: "10",
                    pageSize: 20,
                };
                scrollUnit({
                    container: sObj.lContainer,
                    url: sObj.lUrl,
                });

            } else {
                data = {
                    logoUseFlag: "10",
                    pageSize: 20,
                    firstName: decodeURI($("#EV-SearchInput").val())
                };
                scrollUnit({
                    container: sObj.sContainer,
                    url: sObj.sUrl,
                });

            }

            $(".al-searchCancel").on("click", function() {
                var obj = {
                    container: sObj.lContainer,
                    url: sObj.lUrl,

                };
                data = {
                    logoUseFlag: "10",
                    pageSize: 20,
                };
                scrollUnit(obj);
                $("#EV-searchResultContent").attr('scrollPagination', 'disabled');
            });
            $("#EV-SearchInput").on("click", function() {
                var obj = {
                    container: sObj.sContainer,
                    url: sObj.sUrl,

                };
                data = {
                    logoUseFlag: "10",
                    pageSize: 20,
                    firstName: rObj.firstName
                };
                scrollUnit(obj);
                $(".EV-listResultBox").attr('scrollPagination', 'disabled');
            });

            function scrollUnit(obj) {

                obj.container.off("scroll").scrollPagination({
                    'contentPage': obj.url,
                    'contentData': $.extend(data, {
                        pageIndex: function() {
                            if ($(".EV-listResultBox").is(":visible")) {
                                return that.lNum++;
                            } else {
                                return that.sNum++;
                            }
                        }
                    }),
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 1000,
                    'type': "POST",
                    'beforeLoad': function() {
                        comm.loading.show();
                    },
                    'afterLoad': function() {
                        comm.loading.hide();
                    },
                    'loader': function(res) {
                        if ($.isEmptyObject(res)) {
                            obj.container.attr('scrollPagination', 'disabled');
                            $(".al-applicaptionMaster").show();
                            return false;
                        } else {
                            if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {
                                obj.container.attr('scrollPagination', 'disabled');
                                $(".al-applicaptionMaster").show();
                                return false;
                            } else {
                                that.contentGenerate({
                                    container: obj.container
                                }, res);
                            }
                        }

                    }
                });
            }

        },
        // 分享内容获取
        share: function(sBool) {
            var that = this;
            var data = {
                sortType: 6,
                pageSize: 200,
                pageIndex: 1,
                sceneType: 17,
                dataShare: sBool,
                platformId:TempCache.getItem('department'),
                sessionCustomerId:TempCache.getItem('userId')||""
            };

            if ($("#EV-SearchInput").val().length) {
                data.firstName = $("#EV-SearchInput").val();
            }
            $.ajax({
                url: that.XHRList.share,
                type: 'POST',
                dataType: 'json',
                data: {
                    paramJson: $.toJSON(data)
                },
                async: false,
                timeout: 10000
            })
                .done(function(data) {
                    if (typeof(data.responseObject.responseData.data_list) !== 'undefined' && data.responseObject.responseData.data_list) {
                        var sList = data.responseObject.responseData.data_list[0].share_channel;
                        that.shareObj = {
                            title: '',
                            summary: '',
                            sinaTitle: '',
                            wxTitle: '',
                            wxDesc: '',
                        };

                        $(sList).each(function(index, element) {
                            if (element.shareChannel === 'QZone') {
                                that.shareObj.title = element.shareTitle;
                                that.shareObj.summary = element.shareDesc;
                            }
                            if (element.shareChannel === 'Sina') {
                                that.shareObj.sinaTitle = element.shareDesc;
                            }
                            if (element.shareChannel === 'WechatFriend') {
                                that.shareObj.wxTitle = element.shareTitle;
                                that.shareObj.wxDesc = element.shareDesc;
                            }
                            if (element.shareChannel === 'WechatTimeline') {
                                that.shareObj.timeLineTitle = element.shareTitle;
                            }
                        });
                        shareAll({
                            title: that.shareObj.title,
                            url: window.location.origin + window.location.pathname,
                            summary: that.shareObj.summary,
                            sinaTitle: encodeURI(that.shareObj.sinaTitle),
                            wxTitle: that.shareObj.wxTitle,
                            wxDesc: that.shareObj.wxDesc,
                            timeLineTitle:that.shareObj.timeLineTitle,
                            fnMessageSuc: function() {
                                comm.shareLog({
                                    shareType: "",
                                    resourceId: "",
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence: 59,
                                    shareChannel: 4,
                                    shareContent: that.shareObj.wxTitle
                                });
                            },
                            fnTimelineSuc: function() {
                                comm.shareLog({
                                    shareType: "",
                                    resourceId: "",
                                    resourceType: "",
                                    refId: "",
                                    isValid: 1,
                                    shareSence: 59,
                                    shareChannel: 5,
                                    shareContent: that.shareObj.timeLineTitle
                                });
                            },
                            qShareLog: function(x) {
                                if (x === 'qzone') {
                                    comm.shareLog({
                                        shareType: "",
                                        resourceId: "",
                                        resourceType: "",
                                        refId: "",
                                        isValid: 1,
                                        shareSence: 59,
                                        shareChannel: 1,
                                        shareContent: that.shareObj.summary
                                    });
                                } else if (x === 'sina') {
                                    comm.shareLog({
                                        shareType: "",
                                        resourceId: "",
                                        resourceType: "",
                                        refId: "",
                                        isValid: 1,
                                        shareSence: 59,
                                        shareChannel: 3,
                                        shareContent: that.shareObj.sinaTitle
                                    });
                                }
                            }
                        }, false, $('.al-scrollShareBtn'));
                    }
                })
                .fail(function() {
                    console.log("XHR error...");
                });

        }

    };
    var discoverMaster = new DiscoverMaster();

    discoverMaster.init();
});
