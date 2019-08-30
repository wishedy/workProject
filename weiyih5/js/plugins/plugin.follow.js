/**
 * 功能描述：  关注插件
 * 使用方法:   el.follow({
 *                 fId: fId,//用户id
 *                 fStatus: fStatus,//关注状态
 *                 classStyle: "",
 *                 picStyle:1//默认不传
 *            });
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2016/8/19.
 */
! function(a) {
    a.fn.extend({
        follow: function(b) {
            var c = this;
            f = a.extend({
                fn: null,
                el: null, //存放关注计数元素
                followPlace: null, //组件存放位置
                outEvElName: null, //执行某个事件 例个人首页，用于点击关注同时刷新关注时，调用外部刷新事件 outEvElName 为元素事件名称
                outEv: null,
                fStatus: 1, //关注状态 //relationship 1 未关注，2 已关注 3 粉丝 4 相互关注
                classStyle: "", //样式
                isValid: !0, //是否认证
                createURL: "/mcall/customer/follow/people/create/", //关注地址
                cancelURL: "/mcall/customer/follow/people/delete/", //取消关注地址
                type: "post", //发送方式
                fId: 0, //被关注人id
                picStyle: 1, //不同状态的不同样式
                needSure: 0, //是否需要确认
                canToggle: false, //是否能取消关注
                addSuccess: function() {} //添加关注成功回调函数
            }, b);
            var d = {};
            d = {
                el: f.el,
                fId: f.fId,
                cId: f.cId,
                fStatus: f.fStatus,
                fn: f.fn,
                evEl: f.outEvElName,
                ev: f.outEv,
                isValid: f.isValid,
                add: "add", //添加关注
                reAdd: "reAdd", //已关注
                remove: "remove", //取消关注
                rtsp: "rtsp" //相互关注
            };
            var e = {};
            return e = {
                init: function() {
                    var b = this,
                        e = b.picStyle();
                    switch (parseInt(d.fStatus)) {
                        case 1:
                            template = b.template(e.addPic, d.add, "关注");
                            break;
                        case 2:
                            template = b.template(e.reAddPic, d.reAdd, "已关注");
                            break;
                        case 3:
                            template = b.template(e.addPic, d.add, "关注");
                            break;
                        case 4:
                            template = b.template(e.rtspPic, d.rtsp, "相互关注");
                            break;
                        default:
                            template = b.template(e.addPic, d.add, "关注")
                    }
                    var g = null;
                    g = null == f.followPlace ? c : c.find(f.followPlace);
                    g.append(template);
                    var _followDom = g.find("a:last");
                    // _followDom.css({top:'50%',transform:'translate(0)',marginTop:-_followDom.outerHeight(true)/2});
                    _followDom.on("click", function() {
                        var c = a(this);
                        var _keyword = c.attr('data-refId');
                        user.privExecute({
                            callback: function() {
                                comm.creatEvent({
                                    triggerType:'关注',
                                    pushMessageId:_keyword,
                                    actionId:4
                                });
                                null == d.el ? b.elNull(c, b, e, d.fStatus) : (b.elNotNull(c, b, e, d.el, d.fStatus), particularPage.customer())
                            },
                            operateType: "auth",
                            noNeedBack:true
                        });
                        return false;
                    });
                    if (f.canToggle === true) { //可以原位置取消加划过事件
                        _followDom.hover(function() {
                            b.hoverPic(a(this), d.reAdd, d.remove, e.removePic, d.rtsp, d.remove, e.removePic)
                        }, function() {
                            b.hoverPic(a(this), d.remove, d.reAdd, e.reAddPic, d.remove, d.rtsp, e.rtspPic)
                        })
                    }
                },
                template: function(a, b, k) {
                    return "<a href='javascript:;' class='" + a + " " + f.classStyle + "' style='cursor:pointer;' data-stat='" + b + "' data-refid='" + d.fId + "'>" + k + "</a>"
                },
                ajaxSend: function(b, c) {
                    a.ajax({ url: b, type: f.type, data: { paramJson: a.toJSON({ dataFlag: 2, refId: c }) } })
                },
                togglePic: function(a, b, c, k) {
                    a.attr("data-stat", b), a.attr("class", c + f.classStyle), a.text(k)
                },
                hoverPic: function(a, b, c, e, f, g, h) {
                    var i = a.attr("data-stat");
                    i == b && 4 != d.fStatus && (a.attr("data-stat", c), a.attr("class", e)), (i == f && 4 == d.fStatus || i == b && 4 == d.fStatus || i == f && 3 == d.fStatus) && (a.attr("data-stat", g), a.find("img").attr("src", h))
                },
                elNull: function(a, b, c, e) {
                    var t = this;
                    var g = a.attr("data-stat");
                    if (g == d.remove || g == d.reAdd || g==d.rtsp) {
                        if (f.canToggle === true) {

                            if (f.needSure) { //需要确认弹窗
                                $(".al-bottomSelectorListMask").addClass('on');
                                $(".ev-sureBtn").on("click", function() {
                                    t.ajaxSend(f.cancelURL, d.fId);
                                    t.togglePic(a, d.add, c.addPic, "关注");
                                    $(".al-bottomSelectorListMask").removeClass('on');
                                    comm.creatEvent({
                                        triggerType:'取消关注',
                                        pushMessageId:'',
                                        actionId:69
                                    });
                                    popup("已取消关注");
                                });
                                $(".ev-cancelBtn").on("click", function() {
                                    comm.creatEvent({
                                        triggerType:'全站功能按钮点击',
                                        pushMessageId:comm.getpara().cid||comm.getpara().cId,
                                        actionId:45
                                    });
                                    $(".al-bottomSelectorListMask").removeClass('on');
                                })
                            } else {
                                t.ajaxSend(f.cancelURL, d.fId);
                                t.togglePic(a, d.add, c.addPic, "关注");
                            }

                        }
                    } else {
                        g == d.add && (3 == e || 4 == e ? (b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.rtsp, c.rtspPic, "相互关注"), f.addSuccess && f.addSuccess()) : (b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.reAddPic, "已关注"), f.addSuccess && f.addSuccess()))
                    }

                },
                elNotNull: function(a, b, c, e, g) {
                    var h = a.attr("data-stat");
                    h == d.add && (3 == g || 4 == g ? (e.html(parseInt(e.text()) + 1), b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.rtspPic, "相互关注")) : (e.html(parseInt(e.text()) + 1), b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.reAddPic, "已关注")))
                },
                picStyle: function() {
                    switch (f.picStyle) {
                        case 1: //普通的医师列表
                            picSrc = {
                                addPic: "al-doctorRecommendFollow btn-primary", //添加关注
                                reAddPic: "al-doctorRecommendFollowed btn-done", //已关注
                                rtspPic: "al-doctorRecommendFollowBtn btn-dobule" //相互关注
                            };
                            break;
                        case 2: //他人主页
                            picSrc = {
                                addPic: "icon-othersFollow", //添加关注
                                reAddPic: "icon-othersFollowed", //已关注
                                rtspPic: "" //相互关注
                            };
                            break;
                        case 3:
                            picSrc = {
                                addPic: "//img00.allinmd.cn/organization/add_gz.png",
                                reAddPic: "//img00.allinmd.cn/organization/ygz.png",
                                removePic: "//img00.allinmd.cn/organization/cancel.png"
                            };
                            break;
                        default:
                            picSrc = {
                                addPic: "al-doctorRecommendFollow btn-primary", //添加关注
                                reAddPic: "al-doctorRecommendFollowed btn-done", //已关注
                                rtspPic: "al-doctorRecommendFollowBtn btn-dobule" //相互关注
                            };
                            break;
                    }
                    return picSrc
                }
            }, e.init(), c
        }
    })
}(jQuery);
