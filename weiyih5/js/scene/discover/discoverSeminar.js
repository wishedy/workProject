/**
 * 功能描述：  发现——专题列表
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/17.
 */


$(function() {
    var DiscoverType = function() {
        var that = this;
        var $that = $(this);
        this.XHRList = {
            list: '/mcall/cms/theme/getMapList3/',
            share: '/mcall/comm/data/share/getMapList3/'
        };
    };
    DiscoverType.prototype = {
        // 预加载
        init: function() {

            //window.onload = Log.createBrowse(49, '按专题');

            this.layout();
            this.getContentList();
        },
        // 布局相关
        layout: function() {
            var fH = $(".al-searchHead").height();
            $(".al-mainInner").css("marginTop", fH);
        },
        // 数据获取
        getContentList: function() {
            var that = this;
            var data = {
                sortType: 5,
                themeType:0,
                pageIndex: 1,
                pageSize: 20
            };
            var template = "",
                markImg = "";
            $.ajax({
                    url: that.XHRList.list,
                    type: 'POST',
                    dataType: 'json',
                    timeout: 10000,
                    data: {
                        paramJson: $.toJSON(data)
                    },
                    beforeSend: function() {
                        comm.loading.show();
                    },
                })
                .done(function(data) {
                    if (data && !$.isEmptyObject(data.responseObject.responseData)) {

                        that.contentGenerate(data);
                        that.share();
                        that.dataWaterfall();
                    }
                })
                .fail(function() {
                    comm.loading.hide();
                    console.log("XHR Error...");
                });
        },
        // 数据瀑布流加载
        dataWaterfall: function() {
            var that = this;
            var num = 2;
            var data = {
                sortType: 5,
                themeType:0,
                pageIndex: num,
                pageSize: 20
            };

            $(".al-discoverSeminarInnerBox").off("scroll").scrollPagination({
                'contentPage': that.XHRList.list,
                'contentData': $.extend(data, {
                    pageIndex: function() {
                        return num++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "get",
                'beforeLoad': function() {
                    comm.loading.show();
                },
                'afterLoad': function() {
                    comm.loading.hide();
                },
                'loader': function(res) {
                    if ($.isEmptyObject(res)) {
                        $(".al-discoverSeminarInnerBox").attr('scrollPagination', 'disabled');
                        return false;
                    } else {
                        if ($.isEmptyObject(res.responseObject.responseData) || (res.responseObject.responseData.data_list && res.responseObject.responseData.data_list.length === 0)) {
                            $(".al-discoverSeminarInnerBox").attr('scrollPagination', 'disabled');
                            return false;
                        } else {
                            that.contentGenerate(res);
                        }
                    }
                }
            });
        },
        //dom操作
        contentGenerate:function(res){
            var template = "",
                markImg = "";
            var resList = res.responseObject.responseData.data_list;
            $(resList).each(function(index, element) {

                if (parseInt(element.isHot) === 1) {
                    markImg = '<i class="al-semeinarMark">' +
                    '<img src="//img50.allinmd.cn/pages/discover/mark_hot.png" alt="">' +
                    '</i>';
                }

                if (parseInt(element.isLiving) === 1) {
                    markImg = '<i class="al-semeinarLiving">' +
                    '<img src="//img50.allinmd.cn/pages/discover/mark_hot.png" alt="">' +
                    '</i>';
                }

                if (parseInt(element.isNew) === 1) {
                    markImg = '<i class="al-semeinarMark">' +
                    '<img src="//img50.allinmd.cn/pages/discover/mark_new.png" alt="">' +
                    '</i>';
                }
                template = '<section class="al-discoverSeminarInner">' +
                '<section class="al-discoverSeminar">' +
                '<a href="' + element.themeStoragePath + '">' +
                '<figure class="al-discoverSeminarImg">' +
                '<img src="' + element.themeLogoUrl + '" alt="">' + markImg +
                '</figure>' +
                '<figcaption class="al-discoverSeminarContent">' +
                '<h2 class="EV-seminarContent">' + element.themeName + '</h2>' +
                '<span>查看全文<i class="icon-messageMore"></i></span>' +
                '</figcaption>' +
                '</a>' +
                '</section>' +
                '</section>';

                $(".al-discoverSeminarInnerBox").append(template);
                comm.loading.hide();

            });
        },
        // 分享话术获取
        share: function() {
            var that = this;
            var data = {
                sortType: 5,
                themeType:0,
                pageIndex: 1,
                pageSize: 100,
                sceneType: 15
            };
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
                    if (data && !$.isEmptyObject(data.responseObject.responseData)) {
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
                            url: window.location.href,
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
                                    shareSence: 58,
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
                                    shareSence: 58,
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
                                        shareSence: 58,
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
                                        shareSence: 58,
                                        shareChannel: 3,
                                        shareContent: that.shareObj.sinaTitle
                                    });
                                }
                            }
                        }, false, $('.al-scrollShareBtn'));
                    } else {
                        $(".al-scrollShareBtn").hide();
                    }
                })
                .fail(function() {
                    console.log("XHR error...");
                });
        }

    };
    var discoverType = new DiscoverType();
    discoverType.init();
});
