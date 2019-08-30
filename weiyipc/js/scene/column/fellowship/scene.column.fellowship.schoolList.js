/**
 * 功能描述：  立即报名按钮点击
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2015/12/10.
 */
$(function () {
    var controller = {
        config: {
            fellowshipId: $("#fellowShipHiddenId").val()
        },
        path: {
            fellowStateUrl: PC_CALL + "customer/fellowship/base/json_list/",//报名状态
            signUrl: PC_CALL + "customer/fellowship/base/create/",//确认报名
            signStatus: PC_CALL + "fellowship/base/getfellowshipState/",//进修的状态
            shareDes: PC_CALL + "comm/data/share/getMapList3/"//分享话术
        },
        init: function () {
            var t = this;
            t.fellowState();
            t.flowTimeCtrl();
        },
        flowTimeCtrl: function () {
            var t = this;
            var kv = $(".Ev-timeCtrl");
            var _sTime, _eTime, _sTCompare, _eTCompare, _nowDate, _nowDateVal, _nYear, _nMon, _nDay;
            if (kv.length) {
                _nowDate = new Date();
                _nYear = _nowDate.getFullYear();
                _nMon = _nowDate.getMonth() + 1;
                _nDay = _nowDate.getDate();
                _nowDateVal = Date.UTC(_nYear, _nMon, _nDay);
                $.each(kv, function (i, e) {
                    _sTime = $.trim($(e).find(".Ev-startTime").text());
                    _eTime = $.trim($(e).find(".Ev-endTime").text());
                    _sTCompare = Date.UTC(_sTime.substring(0, 4), _sTime.substring(5, 7), _sTime.substring(8, 10));
                    _eTCompare = Date.UTC(_eTime.substring(0, 4), _eTime.substring(5, 7), _eTime.substring(8, 10));
                    if (_nowDateVal >= _sTCompare && _nowDateVal <= _eTCompare) {
                        $(e).siblings("div.dian").addClass("orange");
                    }
                });
            }
        },
        //fellow报名状态
        fellowState: function () {
            var t = this;
            $.ajax({
                url: t.path.signStatus,
                type: "POST",
                data: {paramJson: $.toJSON({fellowshipId: t.config.fellowshipId})},
                dataType: "json",
                success: function (data) {
                    if (data && data.responseObject) {
                        var fellowshipState = data.responseObject.fellowshipState;
                        t.fellowshipMainType = data.responseObject.fellowshipMainType;
                        t.fellowshipMainId = data.responseObject.fellowshipMainId;
                        $("#fellowshipMainType").val(t.fellowshipMainType);
                        t.shareEvent();//分享事件
                        if (fellowshipState == 1) {//1，报名正在进行  2，报名即将开始 3，报名已经结束
                            $(".Ev-NowApplyBtn").show();
                            t.bindClick();
                        }
                    }
                }
            });
        },
        //分享事件
        shareEvent: function () {
            var t = this;
            shareSence = shareSenceConst.fellow_detail;
            var sinaTitle=""; var qqTitle=""; var qZoneTitle="";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享 3.终端页面的固定分享
                url: window.location.href,// 分享链接， 默认取当前页链接
                noShareWeixin: true,//不需要分享到微信
                h5Url: "",//h5页面的链接会生成微信二维码
                shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: "",// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                shareSinaSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: t.config.fellowshipId,
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: t.config.fellowshipId,
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: t.config.fellowshipId,
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                },
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var o = {
                        visitSiteId: 1,
                        useFlag: 1,
                        sceneType: 29,
                        resourceType: 0,
                        fellowshipUrl: window.location.href,
                        fellowshipId: t.config.fellowshipId
                    };
                    $.ajax({
                        url: t.path.shareDes,
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
                }
            });
        },
        bindClick: function () {
            var t = this;
            $(".Ev-NowApplyBtn").off("click").on("click", function () {
                var val = $("#sesCustomerId").val();
                var auth = $("#sesAuth").val();
                var _d = $("#sesDepartment").attr("data-registPlatformId");
                if (val && val != "" && auth && (auth == 2 || auth==7 || auth==8 || auth==9)) {//登录认证用户
                    if (_d == 1) {
                        t.myFellowSign();
                    } else {//2是手外
                        if (_d == 2) {
                            t.handPop();
                        }
                    }
                } else {
                    user.login({
                        callback: function () {
                            if (_d == 1) {
                                t.myFellowSign();
                            } else {//2是手外
                                if (_d == 2) {
                                    t.handPop();
                                }
                            }
                        },
                        scene: privilegeSceneConst.eSceneTypeFellow
                    });
                }
            });
        },
        handPop: function () {
            var t = this, html = "";
            html = '<div id="lightbox" class="apply_lightBox"></div>' +
                '<div class="lightbox-container" style="z-index: 10; position: fixed; top:50%; left:50%;margin-left:-226px;margin-top:-141.5px">' +
                '<div class="layer_fellow font_yahei">' +
                '<div class="layer_fellow_t">' +
                '<div class="tip">温馨提示</div>' +
                '<a href="javascript:;" class="close Ev-popCloseBtn">' +
                '<div class="layer_close"></div>' +
                '</a>' +
                '<div class="clear"></div>' +
                '</div>' +
                '<div class="layer_fellow_c layerTip">' +
                '<div class="layerTxt">对不起，暂无符合您的进修项目，敬请关注！</div>' +
                '<div class="layerBtn"></div>' +//<a href="javascript:;" class="check_my_apply Ev-popCloseBtn" data-flag="1">确认报名</a>
                '</div>' +
                '</div>' +
                '</div>';
            if ($('.apply_lightBox').length == 0) {
                $("body").append(html);
            }
            $(".Ev-popCloseBtn").on("click", function () {
                $("#lightbox,.lightbox-container").remove();
                //事件埋点
                comm.creatEvent({
                    triggerType:"全站功能按钮点击",
                    keyword:"fellowship报名关闭",
                    actionId:43
                });
            });
        },
        myFellowSign: function () {//登录认证成功之后提示的弹层
            var t = this;
            var param = {
                paramJson: $.toJSON({
                    customerId: $("#sesCustomerId").val(),
                    fellowshipId: t.config.fellowshipId,
                    //queryType: 1,
                    fellowshipMainType: t.fellowshipMainType
                })
            };
            var callback = function (data) {
                if (data && data.responseObject.responseData) {
                    var isRegistration = data.responseObject.responseData.isRegistration;
                    var isOverseasRegistration = data.responseObject.responseData.isOverseasRegistration;
                    t.createPop(isRegistration, isOverseasRegistration);
                }
            };
            comm.ajax.async(t.path.fellowStateUrl, param, callback);
        },
        createPop: function (isRegistration, state) {
            var t = this;
            var html = "";
            if (t.fellowshipMainType == 1 && state == 0) {//提示未报名 1国外进修，2国内进修，3培训课程,isOverseasRegistration,0--本年度没报名，1，本年度已经报名
                html = '<div id="lightbox" class="apply_lightBox"></div>' +
                    '<div class="lightbox-container" style="z-index: 10; position: fixed; top:50%; left:50%;margin-left:-226px;margin-top:-141.5px">' +
                    '<div class="layer_fellow font_yahei">' +
                    '<div class="layer_fellow_t">' +
                    '<div class="tip">温馨提示</div>' +
                    '<a href="javascript:;" class="close Ev-popCloseBtn">' +
                    '<div class="layer_close"></div>' +
                    '</a>' +
                    '<div class="clear"></div>' +
                    '</div>' +
                    '<div class="layer_fellow_c layerTip">' +
                    '<div class="layerTxt">一个用户每年只能申请一个国际进修项目，选择后将无法取消哦！</div>' +
                    '<div class="layerBtn"><a href="javascript:;" class="check_my_apply Ev-checkMyApply" data-flag="1">确认报名</a></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else if (t.fellowshipMainType == 1 && state == 1) {// else if(t.fellowshipMainType==1&&state==1)本年度海外进修已经报名了
                html = '<div id="lightbox" class="apply_lightBox"></div>' +
                    '<div class="lightbox-container" style="z-index: 10; position: fixed; top:50%; left:50%;margin-left:-226px;margin-top:-141.5px">' +
                    '<div class="layer_fellow font_yahei">' +
                    '<div class="layer_fellow_t">' +
                    '<div class="tip">温馨提示</div>' +
                    '<a href="javascript:;" class="close Ev-popCloseBtn">' +
                    '<div class="layer_close"></div>' +
                    '</a>' +
                    '<div class="clear"></div>' +
                    '</div>' +
                    '<div class="layer_fellow_c layerTip">' +
                    '<div class="layerTxt">您已经申报过本年度的其他国际进修项目，一个用户每年只能申请一个国际进修项目哦！</div>' +
                    '<div class="layerBtn"><a href="javascript:;" class="check_my_apply Ev-checkMyApply" data-flag="1">查看我的报名</a></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else {//需要确认国内的项目，是否已经报过名了
                if (t.fellowshipMainType != 1) {
                    if (isRegistration == 0) {//国内的进修当前的项目还没有报名
                        if ($(".Ev-NowApplyBtn").attr("data-flag") == 1) {
                            $(this).attr("data-flag", "0");
                            var param = {
                                paramJson: $.toJSON({
                                    fellowshipId: t.config.fellowshipId,
                                    customerId: $("#sesCustomerId").val(),
                                    fellowshipMainType: t.fellowshipMainType
                                })
                            };
                            var callback = function (rep) {
                                if (rep && rep.responseObject.responseStatus) {
                                    $(".Ev-NowApplyBtn").attr("data-flag", "1");
                                    g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                                }
                            };
                            comm.ajax.async(t.path.signUrl, param, callback);
                        }
                    } else {//国内的进修当前项目已经报过名了
                        g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                    }
                }

            }
            if ($('.apply_lightBox').length == 0) {
                $("body").append(html);
            }
            $(".Ev-popCloseBtn").on("click", function () {
                $("#lightbox,.lightbox-container").remove();
            });
            $(document).off("click").on("click", '.Ev-checkMyApply', function () {
                if (t.fellowshipMainType == 1 && state == 0) {//确认报名 t.fellowshipMainType==1&&state==0
                    var $this=$(this);
                    if ($this.attr("data-flag") == 1) {
                        $this.attr("data-flag", "0");
                        var param = {
                            paramJson: $.toJSON({
                                fellowshipId: t.config.fellowshipId,
                                customerId: $("#sesCustomerId").val(),
                                fellowshipMainType: t.fellowshipMainType
                            })
                        };
                        var callback = function (rep) {
                            if (rep && rep.responseObject.responseStatus) {
                                $this.attr("data-flag", "1");
                                g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                            } else {

                            }
                        };
                        comm.ajax.async(t.path.signUrl, param, callback);
                    }
                } else {//查看我的报名 t.fellowshipMainType==1&&state==1
                    g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                }
            });
        }
    };
    controller.init();
    scene.TopHeadLoginCallback = function () {
        controller.fellowState();
    };
});