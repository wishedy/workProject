!function (a) {
    a.fn.extend({
        follow: function (b) {
            var c = this;
            f = a.extend({
                fn: null,
                el: null,
                followPlace: null,
                outEvElName: null,
                outEv: null,
                fStatus: 1,
                classStyle: "",
                isValid: !0,
                createURL: "/mcall/customer/follow/people/create/",
                cancelURL: "/mcall/customer/follow/people/delete/",
                type: "post",
                fId: 0,
                picStyle: 1
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
                add: "add",
                reAdd: "reAdd",
                remove: "remove",
                rtsp: "rtsp"
            };
            var e = {};
            return e = {
                init: function () {
                    var b = this, e = b.picStyle();
                    switch (d.fStatus) {
                        case 1:
                            template = b.template(e.addPic, d.add);
                            break;
                        case 2:
                            template = b.template(e.reAddPic, d.reAdd);
                            break;
                        case 3:
                            template = b.template(e.addPic, d.add);
                            break;
                        case 4:
                            template = b.template(e.rtspPic, d.rtsp);
                            break;
                        default:
                            template = b.template(e.addPic, d.add)
                    }
                    var g = null;
                    g = null == f.followPlace ? c : c.find(f.followPlace), g.append(template).find("div:last").on("click", function () {
                        var c = a(this);
                        user.privExecute({
                            callback: function () {
                                null == d.el ? b.elNull(c, b, e, d.fStatus) : (b.elNotNull(c, b, e, d.el, d.fStatus), particularPage.customer())
                            }, operateType: "auth"
                        })
                        return false;
                    }).hover(function () {
                        b.hoverPic(a(this), d.reAdd, d.remove, e.removePic, d.rtsp, d.remove, e.removePic)
                    }, function () {
                        b.hoverPic(a(this), d.remove, d.reAdd, e.reAddPic, d.remove, d.rtsp, e.rtspPic)
                    })
                }, template: function (a, b) {
                    return "<div class='" + f.classStyle + "' style='cursor:pointer;' data-stat='" + b + "' data-refid='" + d.fId + "'><img src='" + a + "'></div>"
                }, ajaxSend: function (b, c) {
                    a.ajax({url: b, type: f.type, data: {paramJson: a.toJSON({dataFlag: 2, refId: c})}})
                }, togglePic: function (a, b, c) {
                    a.attr("data-stat", b), a.find("img").attr("src", c)
                }, hoverPic: function (a, b, c, e, f, g, h) {
                    var i = a.attr("data-stat");
                    i == b && 4 != d.fStatus && (a.attr("data-stat", c), a.find("img").attr("src", e)), (i == f && 4 == d.fStatus || i == b && 4 == d.fStatus || i == f && 3 == d.fStatus) && (a.attr("data-stat", g), a.find("img").attr("src", h))
                }, elNull: function (a, b, c, e) {
                    var g = a.attr("data-stat");
                    g == d.add && (3 == e || 4 == e ? (b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.rtsp, c.rtspPic)) : (b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.reAddPic)))
                }, elNotNull: function (a, b, c, e, g) {
                    var h = a.attr("data-stat");
                    h == d.add && (3 == g || 4 == g ? (e.html(parseInt(e.text()) + 1), b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.rtspPic)) : (e.html(parseInt(e.text()) + 1), b.ajaxSend(f.createURL, d.fId), b.togglePic(a, d.reAdd, c.reAddPic)))
                }, picStyle: function () {
                    switch (f.picStyle) {
                        case 3:
                            picSrc = {
                                addPic: "//img00.allinmd.cn/organization/add_gz.png",
                                reAddPic: "//img00.allinmd.cn/organization/ygz.png",
                                removePic: "//img00.allinmd.cn/organization/cancel.png"
                            };
                            break;
                        default:
                            picSrc = {
                                addPic: "//img50.allinmd.cn/personal_v2/tjgz.jpg",
                                reAddPic: "//img50.allinmd.cn/personal_v2/zan.jpg",
                                rtspPic: "//img50.allinmd.cn/personal_v2/xhgz.jpg"
                            }
                    }
                    return picSrc
                }
            }, e.init(), c
        }
    })
}(jQuery);