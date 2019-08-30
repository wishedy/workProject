/**
 * 功能描述： 发现—— 热门活动
 * 使用方法:
 * 注意事件：    
 * 引入来源：  作用：
 *
 * Created by QiangKaiLiang on 2016/08/17.
 */

$(function() {
    var DiscoverActivition = function() {
        var that = this;
        var $that = $(this);
        this.XHRList = {
            list: M_CALL+'cms/activity/getMapList3/',
            share: M_CALL+'comm/data/share/getMapList3/'
        };
    };
    DiscoverActivition.prototype = {
        // 预加载
        init: function() {
            //window.onload = Log.createBrowse(51, '热门活动');
            this.layout();
            this.getContentList();
            this.digHole();
        },
        // 布局相关
        layout: function() {
            var fH = $(".al-searchHead").height();
            $(".al-mainInner").css("marginTop", fH);
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
        // 动态数据获取
        getContentList: function() {
            var that = this;
            var data = {
                sortType: 1,
                pageSize: 200,
                pageIndex: 1
            };
            $.ajax({
                    url: that.XHRList.list,
                    type: 'get',
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
                        var resList = data.responseObject.responseData.data_list;
                        $(resList).each(function(index, element) {
                            var sT = element.startTime.replace(/-/g, "/").substring(0, 10),
                                eT = element.endTime.replace(/-/g, "/"),
                                eET = eT.substring(5, 10),
                                activitionState = "",
                                endClass = "";
                            switch (parseInt(element.state)) {
                                case 1:
                                    activitionState = '<i class="al-semeinarMark">' +
                                        '<img src="//img50.allinmd.cn/pages/discover/mark_hot.png" alt="">' +
                                        '</i>';
                                    break;
                                case 2:
                                    activitionState = '<i class="al-semeinarMark">' +
                                        '<img src="//img50.allinmd.cn/pages/discover/mark_new.png" alt="">' +
                                        '</i>';
                                    break;
                                case 3:
                                    activitionState = '<i class="al-semeinarLiving">' +
                                        '<img src="//img50.allinmd.cn/pages/discover/mark_living_now.png" alt="">' +
                                        '</i>';
                                    break;
                                case 4:
                                    activitionState = '<i class="al-semeinarLiving">' +
                                    //activitionState = '<i class="al-semeinarMark">' +
                                        '<img src="//img50.allinmd.cn/pages/discover/mark_endnew.png" alt="">' +
                                        //'<img src="//img50.allinmd.cn/pages/discover/mark_end.png" alt="">' +
                                        '</i>';
                                    endClass = ' al-activitionEnd';
                                    break;

                            }
                            that.template = '<section class="al-discoverSeminarInner' + endClass + '">' +
                                '<h2 class="al-discoverActivitionTime">' + sT + '<em>-</em>' + eET + '</h2>' +
                                '<section class="al-discoverSeminar">' +
                                '<a href="' + element.activityUrl + '">' +
                                '<figure class="al-discoverSeminarImg">' +
                                '<img src="' + element.activityPicUrl + '" alt="">' +
                                activitionState +
                                '</figure>' +
                                '<figcaption class="al-discoverSeminarContent">' +
                                '<h2 class="EV-seminarContent">' + element.activityName + '</h2>' +
                                '<span>查看全文<i class="icon-messageMore"></i></span>' +
                                '</figcaption>' +
                                '</a>' +
                                '</section>' +
                                '</section>';

                            $(".al-discoverSeminarInnerBox").append(that.template);
                        });
                    } else {
                        $(".al-discoverNoActivition").show();
                    }
                    comm.loading.hide();
                    that.share();
                })
                .fail(function() {
                    comm.loading.hide();
                    $(".al-discoverNoActivition").show();
                    console.log("XHR Error...");
                });
        },

        // 分享内容获取
        share: function() {
            var that = this;
            that.shareObj = {};
            var data = {
                sortType: 1,
                pageSize: 200,
                pageIndex: 1,
                sceneType: 18
            };
            shareAll({
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
                },
                triggerRequest:function(){
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

                            } else {
                                $(".al-scrollShareBtn").hide();
                            }
                        })
                        .fail(function() {
                            console.log("XHR error...");
                        });
                    return that.shareObj;
                }
            }, false, $('.al-scrollShareBtn'));


        }

    };
    var discoverActivition = new DiscoverActivition();
    discoverActivition.init();
});
