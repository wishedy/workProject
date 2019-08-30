/*!
 * Gensee EasyCast JavaScript SDK
 * http://www.gensee.com/
 *
 * Date: 2013-1-29
 */
(function (g, h) {
	__GSJsonp = {};
    if (g.GS !== h) {
        return
    }
    var a = {
        Server: {
            _default: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/sdk/video",
                vodURL: "/site/sdk/vod",
                docURL: "/site/sdk/doc",
                hostURL: "/site/sdk/host",
                wbURL: "/site/sdk/wb",
                vpURL: "/site/sdk/publisher",
                audioURL: "/site/sdk/audio",
                params: true
            },
            training: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/sdk/tra/video",
                vodURL: "/site/sdk/tra/vod",
                docURL: "/site/sdk/tra/doc",
                hostURL: "/site/sdk/tra/host",
                wbURL: "/site/sdk/tra/wb",
                vpURL: "/site/sdk/tra/publisher",
                audioURL: "/site/sdk/audio",
                params: true
            },
            webcast: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/sdk/video",
                vodURL: "/site/sdk/vod",
                docURL: "/site/sdk/doc",
                hostURL: "/site/sdk/host",
                wbURL: "/site/sdk/wb",
                vpURL: "/site/sdk/publisher",
                audioURL: "/site/sdk/audio",
                params: true
            },
            easycast: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/module/video-live/{ownerid}_{authcode}?k={k}",
                vodURL: "/site/site/sdk/vod?ownerid={ownerid}&authcode={authcode}&k={k}",
                docURL: "/site/module/doc/{ownerid}_{authcode}",
                params: true
            },
            gensee: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/sdk/gs/video",
                vodURL: "/site/sdk/gs/vod",
                docURL: "/site/sdk/doc",
                hostURL: "/site/sdk/gs/host",
                wbURL: "/site/sdk/wb",
                vpURL: "/site/sdk/publisher",
                audioURL: "/site/sdk/audio",
                params: true
            },
            gensee_tra: {
                baseURL: "//{site}/sdk",
                liveURL: "/site/sdk/gs/tra/video",
                vodURL: "/site/sdk/gs/tra/vod",
                docURL: "/site/sdk/tra/doc",
                hostURL: "/site/sdk/tra/gs/host",
                wbURL: "/site/sdk/tra/wb",
                vpURL: "/site/sdk/tra/publisher",
                audioURL: "/site/sdk/audio",
                params: true
            }
        }
    }, e = (function () {
        var k = {};
        k.defaultKey = "_GS_SDK_default_group_" + (new Date()).getTime();
        k.suites = {};
        k.widgets = {};
        k.N = 0;
        k.IE = /msie/i.test(navigator.userAgent);
        k.basePath = (function () {
            var m = document.getElementsByTagName("script"), n;
            var p = null;
            for (var o = 0; o < m.length; o++) {
                n = m[o];
                var l = n.src.indexOf("js/gssdk.js");
                if (l > 0) {
                    p = n.src.substring(0, l);
                    break
                }
            }
            if (p == null) {
                for (var o = 0; o < m.length; o++) {
                    n = m[o];
                    var l = n.src.indexOf("js/gssdk");
                    if (l > 0) {
                        p = n.src.substring(0, l);
                        break
                    }
                }
            }
            if (p == null) {
                p = "/js/third-party/gensee/"
            }
            return p
        })();
        k.register = function (n, l) {
            var p = n.split(".");
            var o = k;
            var m = null;
            while (m = p.shift()) {
                if (p.length) {
                    if (o[m] === h) {
                        o[m] = {}
                    }
                    o = o[m]
                } else {
                    if (o[m] === h) {
                        o[m] = l(k)
                    }
                }
            }
        };
        k.loadScript = function (m, l) {
            var n = document.createElement("script");
            n.charset = "UTF-8";
            n.src = m;
            if (l) {
                if (k.IE) {
                    n.onreadystatechange = function () {
                        if (n.readyState.toLowerCase() == "complete" || n.readyState.toLowerCase() == "loaded") {
                            l.call(l)
                        }
                    }
                } else {
                    n.onload = function () {
                        l.call(l)
                    }
                }
            }
            document.getElementsByTagName("head")[0].appendChild(n)
        };
        k.trim = function (l) {
            if (typeof l !== "string") {
                return l
            }
            if (typeof l.trim === "function") {
                return l.trim()
            } else {
                return l.replace(/^(\u3000|\s|\t|\u00A0)*|(\u3000|\s|\t|\u00A0)*$/g, "")
            }
        };
        k.isEmpty = function (l) {
            if (l === h) {
                return true
            } else {
                if (l == null) {
                    return true
                } else {
                    if (typeof l === "string") {
                        if (k.trim(l) == "") {
                            return true
                        }
                    }
                }
            }
            return false
        };
        k.isNotEmpty = function (l) {
            return !k.isEmpty(l)
        };
        k.elem = function (l) {
            if (typeof l === "string") {
                return document.getElementById(l)
            } else {
                return l
            }
        };
        k.Event = (function (l, n, m, o) {
            this.type = l;
            this.target = n;
            this.data = m;
            this.cb = o
        });
        k.Logger = (function (l) {
            var n = this;
            this.name = l;
            this.logs = [];
            var m = {"DEBUG": 0, "INFO": 1, "WARN": 2, "ERROR": 3, "FATAL": 4};
            this.level = "INFO";
            this.out = function (o) {
                n.logs.push(o)
            };
            this.log = function (s, p, q) {
                p = p ? p : "info";
                var r = m[p.toUpperCase()];
                var o = m[n.level.toUpperCase()];
                if (typeof r === "number" && typeof o === "number") {
                    if (r < o) {
                        return
                    }
                }
                if (typeof s !== "string") {
                    this.log("log(msg, type), type of msg must be 'string'", "ERROR", s);
                    return
                }
                n.out({time: new Date(), msg: s, type: p, data: q})
            };
            this.moveLogs = function (o) {
                return n.logs.splice(0, o || n.logs.length)
            }
        });
        k.logger = new k.Logger();
        k.log = k.logger.log;
        k.JSONP = (function (m, p) {
            var l = "__GSJsonp";
            var o = m[l] = m[l] || {}, n = 0;
            o.load = function (r, q) {
                var u = r.indexOf("?") > 0 ? "&" : "?";
                var t = r + u + "jsonpcallback=" + q;
                k.loadScript(t)
            };
            o.createJsonpCallback = function (q) {
                var r = "jsonpcallback_" + n;
                n++;
                o[r] = function (s) {
                    delete o[r];
                    return q(s)
                };
                return l + "." + r
            };
            o.process = function (q, r) {
                o.load(q, o.createJsonpCallback(r))
            };
            return o
        })(g);
        k.asyncRun = function (l, m) {
            setTimeout(function () {
                try {
                    l(m)
                } catch (n) {
                    k.log("" + n, "ERROR", n);
                    throw n
                }
            }, 0)
        }, k.register("core.dom.addEvent", function (l) {
            return function (m, p, o) {
                var n = l.elem(m);
                if (n == null) {
                    return
                }
                p = p || "click";
                if ((typeof o).toLowerCase() != "function") {
                    return
                }
                if (n.attachEvent) {
                    n.attachEvent("on" + p, o)
                } else {
                    if (n.addEventListener) {
                        n.addEventListener(p, o, false)
                    } else {
                        n["on" + p] = o
                    }
                }
            }
        });
        k.register("core.dom.ready", function (s) {
            var q = [];
            var u = false;
            var r = s.core.dom.addEvent;
            var m = function () {
                if (!u) {
                    if (document.readyState === "complete") {
                        return true
                    }
                }
                return u
            };
            var l = function () {
                if (u == true) {
                    return
                }
                u = true;
                for (var v = 0; v < q.length; v++) {
                    if (typeof q[v] == "function") {
                        try {
                            q[v].call();
                        } catch (w) {
                            s.log(w.message, "ERROR", w);
                            throw w
                        }
                    }
                }
                q = []
            };
            var n = function () {
                if (m()) {
                    l();
                    return
                }
                try {
                    document.documentElement.doScroll("left")
                } catch (v) {
                    setTimeout(arguments.callee, 50);
                    return
                }
                l()
            };
            var p = function () {
                if (m()) {
                    l();
                    return
                }
                setTimeout(arguments.callee, 50)
            };
            var t = function () {
                r(document, "DOMContentLoaded", l)
            };
            var o = function () {
                r(g, "load", l)
            };
            if (!m()) {
                if (s.IE && g === g.top) {
                    n()
                }
                t();
                p();
                o()
            }
            return function (v) {
                if (m()) {
                    if (typeof v == "function") {
                        v.call()
                    }
                } else {
                    q.push(v)
                }
            }
        });
        k.register("core.util.assignProperties", function () {
            return function (m, o, q, l) {
                if (typeof o != "undefined") {
                    for (var n in o) {
                        var p = o[n];
                        if (typeof q === "function") {
                            n = q(n)
                        }
                        if (typeof l === "function") {
                            p = l(p)
                        }
                        m[n] = p
                    }
                }
                return m
            }
        });
        k.register("core.util.browser", function () {
            var u = navigator.userAgent.toLowerCase();
            var m = g.external || "";
            var s = "", r, q = "", l = "", p = "";
            var t = function (w) {
                var v = 0;
                return parseFloat(w.replace(/\./g, function () {
                    return (v++ == 1) ? "" : "."
                }))
            };
            try {
                if ((/windows|win32/i).test(u)) {
                    p = "windows"
                } else {
                    if ((/macintosh/i).test(u)) {
                        p = "macintosh"
                    } else {
                        if ((/rhino/i).test(u)) {
                            p = "rhino"
                        }
                    }
                }
                if ((r = u.match(/applewebkit\/([^\s]*)/)) && r[1]) {
                    s = "webkit";
                    l = t(r[1])
                } else {
                    if ((r = u.match(/presto\/([\d.]*)/)) && r[1]) {
                        s = "presto";
                        l = t(r[1])
                    } else {
                        if (r = u.match(/msie\s([^;]*)/)) {
                            s = "trident";
                            l = 1;
                            if ((r = u.match(/trident\/([\d.]*)/)) && r[1]) {
                                l = t(r[1])
                            }
                        } else {
                            if (/gecko/.test(u)) {
                                s = "gecko";
                                l = 1;
                                if ((r = u.match(/rv:([\d.]*)/)) && r[1]) {
                                    l = t(r[1])
                                }
                            }
                        }
                    }
                }
                if (/world/.test(u)) {
                    q = "world"
                } else {
                    if (/360se/.test(u)) {
                        q = "360"
                    } else {
                        if ((/maxthon/.test(u)) || typeof m.max_version == "number") {
                            q = "maxthon"
                        } else {
                            if (/tencenttraveler\s([\d.]*)/.test(u)) {
                                q = "tt"
                            } else {
                                if (/se\s([\d.]*)/.test(u)) {
                                    q = "sogou"
                                }
                            }
                        }
                    }
                }
            } catch (n) {
            }
            var o = {
                OS: p,
                CORE: s,
                Version: l,
                EXTRA: (q ? q : false),
                IE: /msie/.test(u),
                OPERA: /opera/.test(u),
                MOZ: /gecko/.test(u) && !/(compatible|webkit)/.test(u),
                IE5: /msie 5 /.test(u),
                IE55: /msie 5.5/.test(u),
                IE6: /msie 6/.test(u),
                IE7: /msie 7/.test(u),
                IE8: /msie 8/.test(u),
                IE9: /msie 9/.test(u),
                SAFARI: !/chrome\/([\d.]*)/.test(u) && /\/([\d.]*) safari/.test(u),
                CHROME: /chrome\/([\d.]*)/.test(u),
                IPAD: /\(ipad/i.test(u),
                IPHONE: /\(iphone/i.test(u),
                ITOUCH: /\(itouch/i.test(u),
                MOBILE: /mobile/i.test(u)
            };
            return o
        });
        k.register("core.util.jsonToStr", function (o) {
            function p(v) {
                return v < 10 ? "0" + v : v
            }

            if (typeof Date.prototype.toJSON !== "function") {
                Date.prototype.toJSON = function (v) {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + p(this.getUTCMonth() + 1) + "-" + p(this.getUTCDate()) + "T" + p(this.getUTCHours()) + ":" + p(this.getUTCMinutes()) + ":" + p(this.getUTCSeconds()) + "Z" : null
                };
                String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (v) {
                    return this.valueOf()
                }
            }
            var n = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, r = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, s, m, u = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            }, t = h;

            function l(v) {
                r.lastIndex = 0;
                return r.test(v) ? '"' + v.replace(r, function (w) {
                    var x = u[w];
                    return typeof x === "string" ? x : "\\u" + ("0000" + w.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + v + '"'
            }

            function q(D, A) {
                var y, x, E, w, B = s, z, C = A[D];
                if (C && typeof C === "object" && typeof C.toJSON === "function") {
                    C = C.toJSON(D)
                }
                if (typeof t === "function") {
                    C = t.call(A, D, C)
                }
                switch (typeof C) {
                    case"string":
                        return l(C);
                    case"number":
                        return isFinite(C) ? String(C) : "null";
                    case"boolean":
                    case"null":
                        return String(C);
                    case"object":
                        if (!C) {
                            return "null"
                        }
                        s += m;
                        z = [];
                        if (Object.prototype.toString.apply(C) === "[object Array]") {
                            w = C.length;
                            for (y = 0; y < w; y += 1) {
                                z[y] = q(y, C) || "null"
                            }
                            E = z.length === 0 ? "[]" : s ? "[\n" + s + z.join(",\n" + s) + "\n" + B + "]" : "[" + z.join(",") + "]";
                            s = B;
                            return E
                        }
                        if (t && typeof t === "object") {
                            w = t.length;
                            for (y = 0; y < w; y += 1) {
                                x = t[y];
                                if (typeof x === "string") {
                                    E = q(x, C);
                                    if (E) {
                                        z.push(l(x) + (s ? ": " : ":") + E)
                                    }
                                }
                            }
                        } else {
                            for (x in C) {
                                if (Object.hasOwnProperty.call(C, x)) {
                                    E = q(x, C);
                                    if (E) {
                                        z.push(l(x) + (s ? ": " : ":") + E)
                                    }
                                }
                            }
                        }
                        E = z.length === 0 ? "{}" : s ? "{\n" + s + z.join(",\n" + s) + "\n" + B + "}" : "{" + z.join(",") + "}";
                        s = B;
                        return E
                }
            }

            return function (y, w, x) {
                var v;
                s = "";
                m = "";
                if (typeof x === "number") {
                    for (v = 0; v < x; v += 1) {
                        m += " "
                    }
                } else {
                    if (typeof x === "string") {
                        m = x
                    }
                }
                t = w;
                if (w && typeof w !== "function" && (typeof w !== "object" || typeof w.length !== "number")) {
                    throw new Error("JSON.stringify")
                }
                return q("", {"": y})
            }
        });
        var j = (function () {
            var l = function (o, n, m) {
                this.orign = o;
                this.type = n;
                this.elem = m ? m.elem : {};
                this.attrs = m ? m.attrs : null;
                this.initId();
                if ("GSML" == o) {
                    this.init()
                }
            };
            l.fn = l.prototype = {
                constructor: l, attr: function (m) {
                    if (k.isNotEmpty(this.attrs)) {
                        return this.attrs[m]
                    }
                    var n = "";
                    try {
                        if (this.elem.getAttribute) {
                            n = this.elem.getAttribute(m);
                            n = k.trim(n)
                        }
                    } catch (o) {
                        k.log(".getAttribute(name) throw:" + o, "ERROR", this)
                    }
                    return k.isEmpty(n) ? "" : n
                }, initId: function () {
                    var m = this.attr("id");
                    if (k.isEmpty(m)) {
                        m = "_GS_WIDGET_" + k.N++;
                        m += "_" + (new Date()).getTime()
                    }
                    this.id = m
                }, init: function () {
                    if (this.type == "channel") {
                        return
                    }
                    var u = this.attr("ctx");
                    var o = a.Server[u];
                    if (k.isEmpty(o)) {
                        o = a.Server._default
                    }
                    this.url = o.baseURL.replace("{site}", this.attr("site"));
                    var n = "";
                    switch (this.type) {
                        case"video-live":
                            n = o.liveURL;
                            break;
                        case"video-vod":
                            n = o.vodURL;
                            break;
                        case"doc":
                            n = o.docURL;
                            break;
                        case"video-host":
                            n = o.hostURL;
                            break;
                        case"video-pub":
                            n = o.vpURL;
                            break;
                        case"wb":
                            n = o.wbURL;
                            break;
                        case"audio-live":
                            n = o.audioURL;
                            break;
                        default:
                            k.log("Unsupported widget type - " + this.type, "ERROR");
                            throw"[SDK]ERROR! Unsupported widget type - " + this.type
                    }
                    this.url += n;
                    this.url += this.url.indexOf("?") > 0 ? "&" : "?";
                    this.url += "widgetid=" + this.id;
                    if (o.params == true) {
                        for (var r = 0, m = this.elem.attributes, p = m.length; r < p; r++) {
                            var v = m.item(r).nodeName;
                            this.url += "&" + v + "=" + encodeURIComponent(this.attr(v))
                        }
                    } else {
                        if (Object.prototype.toString.call(o.params) === "[object Array]") {
                            for (var q in o.params) {
                                var t = o.params[q];
                                var s = this.attr(t);
                                if (k.isNotEmpty(s)) {
                                    this.url += "&" + t + "=" + encodeURIComponent(s)
                                }
                            }
                        }
                    }
                }, bind: function (n, m) {
                    n = n.toLowerCase();
                    if (!this.suite.eventsmap[n]) {
                        this.suite.eventsmap[n] = []
                    }
                    this.suite.eventsmap[n].push(m)
                }, unbind: function (o, n) {
                    o = o.toLowerCase();
                    if (this.suite.eventsmap[o]) {
                        for (var m in this.suite.eventsmap[o]) {
                            if (this.eventsmap[o][m] == n) {
                                delete this.suite.eventsmap[o][m];
                                break
                            }
                        }
                    }
                }, fire: function (q) {
                    if (!(q instanceof k.Event)) {
                        k.log("It's not instanceof Event - " + q, "ERROR");
                        throw"[SDK]ERROR! It's not a instance of Event - " + q
                    }
                    var p = q.type.toLowerCase();
                    var n = this.suite.eventsmap[p];
                    var m = 0;
                    if (n) {
                        m = n.length;
                        if(n[0].toString().indexOf("explain\":\"Core-widget not ready, please wait a moment!")>-1){
                        		k.asyncRun(n[0], q)
                        }else{
                        		for (var o = 0; o < n.length; o++) {
                        			k.asyncRun(n[o], q) 
                        		}
                        }
                    }
                    k.log("send message of '" + q.type + "'", "DEBUG", q);
                    return m
                }, load: function () {
                    var m = this;
                    m.elem.innerHTML = '<span style="background:url(' + k.basePath + '/image/xubox_loading0.gif) no-repeat;height:18px;padding:0 0 2px 20px;">Loading...</span>';
                    k.JSONP.process(this.url, function (n) {
                        if (typeof n == "string") {
                            m.elem.innerHTML = n
                        } else {
                            if (typeof n == "object") {
                                m.elem.innerHTML = "";
                                m.elem.appendChild(n)
                            } else {
                                if (typeof n == "function") {
                                    m.elem.innerHTML = "";
                                    n(m.elem)
                                } else {
                                    if (n == h) {
                                        m.elem.innerHTML = ""
                                    } else {
                                        m.elem.innerHTML = "";
                                        k.log("Can't process JSONP-" + m.url + "," + n, "ERROR")
                                    }
                                }
                            }
                        }
                        return m.elem
                    })
                }
            };
            return l
        })();
        var i = (function () {
            var l = function (m) {
                if (k.isEmpty(m)) {
                    m = k.defaultKey
                }
                this.key = m;
                this.init()
            };
            l.fn = l.prototype = {
                constructor: l, init: function () {
                    this.eventsmap = {};
                    this.widgets = {}
                }, loadWidget: function (m) {
                    if (typeof m.id === h) {
                        throw new ERROR("widget's id is undefined. " + m)
                    }
                    if (this.widgets[m.id] === h) {
                        m.suite = this;
                        this.widgets[m.id] = m;
                        k.widgets[m.id] = m;
                        k.log("Widget(" + m.id + ") has loaded!", "INFO", m)
                    }
                }, createWidget: function (p, n, m) {
                    n = n.toLowerCase();
                    var o = new j(p, n, m);
                    this.loadWidget(o);
                    return o
                }
            };
            return l
        })();
        k.suite = function (l) {
            if (k.isEmpty(l)) {
                l = k.defaultKey
            }
            var m = k.suites[l];
            if (typeof m == "undefined") {
                m = new i(l);
                k.suites[l] = m
            }
            return m
        };
        k.isKeyValid = function (l) {
            if (k.isEmpty(l)) {
                l = k.defaultKey
            }
            if (suites[l] === h) {
                return false
            }
            return true
        };
        return k
    })();
    e.logger.name = "SDK";
    e.register("api.ready", function () {
        return function (i) {
            e.core.dom.ready(i)
        }
    });
    e.register("api.widget", function () {
        return function (i) {
            return e.widgets[i]
        }
    });
    e.register("api.suite", function () {
        return function (i) {
            return e.suite(i)
        }
    });
    e.register("api.jsonToStr", function () {
        return function (k, i, j) {
            e.core.util.jsonToStr(k, i, j)
        }
    });
    e.register("api.log.extend", function (i) {
        return function (l) {
            if (typeof l != "function") {
                that.log(l + " is not a function!", "ERROR");
                return
            }
            i.logger.out = l;
            var k = i.logger.moveLogs();
            for (var j in k) {
                l(k[j])
            }
        }
    });
    e.register("api.widget.proxy", function (i) {
        return function (l) {
            var k = i.api.widget(l);
            if (i.isEmpty(k)) {
                i.log("No widget which id is " + l, "ERROR");
                throw"[SDK]ERROR! no widget which id is " + l
            }
            if (k.proxy === h) {
                var j = k.proxy = {id: l, type: k.type, group: k.suite.key};
                k.eventTargetProxy = {id: l, type: k.type};
                j.extend = function (m) {
                    i.core.util.assignProperties(j, m)
                };
                j.bind = function (n, m) {
                    if (typeof n !== "string") {
                        i.log("Type of event must be a string!", "ERROR");
                        return
                    }
                    if (typeof m !== "function") {
                        i.log("Handler of event must be a function!", "ERROR");
                        return
                    }
                    n = i.trim(n);
                    if (i.isEmpty(n)) {
                        i.log("Empty type of event is invalid!", "ERROR");
                        return
                    }
                    k.bind(n, m)
                };
                j.send = function (o, q, n) {
                    if (typeof o !== "string") {
                        i.log("Type of message must be a string!", "ERROR");
                        throw"[SDK]ERROR! Type of message must be a string!"
                    }
                    o = i.trim(o);
                    o = b.types(o);
                    var p = new i.Event(o, k.eventTargetProxy, q, n);
                    var m = k.fire(p);
                    if (m == 0) {
                        var r = k.suite.key == i.defaultKey ? "" : k.suite.key + ".";
                        i.log("No handler had bound to '" + r + p.type + "'!", "WARN", p)
                    }
                    return m
                };
                j.activeShakehand = function (q, n, o) {
                    k._dataInMyHand = n;
                    if (typeof o === "string" && i.isNotEmpty(o)) {
                        k._shakeWithType = o
                    } else {
                        delete k._shakeWithType
                    }
                    if (typeof q == "function") {
                        j.shakehand = function (v) {
                            setTimeout(function () {
                                q(v._dataInMyHand)
                            }, 0)
                        }
                    } else {
                        j.shakehand = function () {
                        }
                    }
                    var p = k.suite;
                    for (var m in p.widgets) {
                        var u = p.widgets[m];
                        if (u.id == k.id) {
                            continue
                        }
                        var t = i.api.widget.proxy(u.id);
                        if (i.isNotEmpty(t.shakehand)) {
                            var s = true;
                            if (k._shakeWithType && k._shakeWithType != u.type) {
                                s = false
                            }
                            var r = true;
                            if (u._shakeWithType && u._shakeWithType != k.type) {
                                r = false
                            }
                            if (s && r) {
                                j.shakehand(u);
                                t.shakehand(k)
                            }
                        }
                    }
                }
            }
            return k.proxy
        }
    });
    var f = (function () {
        var i = {};
        i.NS = "gs";
        var j = function (n) {
            var m = e.core.util.browser;
            var l = i.NS + ":" + n;
            if (m.IE) {
                try {
                    var k = document.namespaces;
                    if (k && k[i.NS]) {
                        return document.getElementsByTagName(n).length == 0 ? document.getElementsByTagName(l) : document.getElementsByTagName(n)
                    }
                } catch (o) {
                }
                return document.getElementsByTagName(l)
            } else {
                if (m.MOZ) {
                    return document.getElementsByTagNameNS(document.body.namespaceURI, l)
                } else {
                    return document.getElementsByTagName(l)
                }
            }
        };
        i.loadTags = function (k, m) {
            if (e.isEmpty(k)) {
                e.log("tagNames is empty.", "WARN");
                return
            }
            for (var o = 0; o < k.length; o++) {
                var n = k[o];
                var p = j(n);
                for (var l = 0; l < p.length; l++) {
                    var s = p[l];
                    var q = m(n, s);
                    if (q == false) {
                        break
                    }
                }
            }
        };
        i.getElementsByTagName = j;
        (function () {
            try {
                if (document.namespaces && !document.namespaces.item[i.NS]) {
                    document.namespaces.add(i.NS)
                }
            } catch (k) {
            }
        })();
        return i
    })();
    e.gsmlTagHandler = function (l, n) {
        if (e.isNotEmpty(n.className) && n.className.indexOf("gs-sdk-widget") >= 0) {
            return
        }
        n.className = (e.isEmpty(n.className) ? "" : " ") + "gs-sdk-widget";
        var p = ["site", "ownerid"];
        for (var k = 0; k < p.length; k++) {
            var j = n.getAttribute(p[k]);
            if (e.isEmpty(j)) {
                e.log("Tag's attr -" + p[k] + " is request.", "ERROR")
            }
        }
        var o = n.getAttribute("group");
        var m = e.suite(o);
        m.createWidget("GSML", l, {elem: n}).load()
    };
    var b = (function () {
        var j = {};
        var i = {};
        j.types = function (k) {
            if (typeof k === "object") {
                e.core.util.assignProperties(i, k, function (m) {
                    return e.trim(m).toLowerCase()
                })
            } else {
                if (typeof k === "string") {
                    var l = k.toLowerCase();
                    return i[l] ? i[l] : k
                } else {
                    if (e.isEmpty(k)) {
                        return i
                    } else {
                        e.log("typeCenter.types(arg):arg not support-" + k, "WARN")
                    }
                }
            }
        };
        return j
    })();
    var d = (function () {
        var j = {}, i = {};
        j.value = function (k, l) {
            if (e.isEmpty(k)) {
                throw"[SDK]ERROR! param 'key' of value() cannot be empty!"
            }
            if (e.isEmpty(l)) {
                return i[k]
            } else {
                if (i[k]) {
                    e.log("[SDK]INFO value of '" + k + "' - '" + i[k] + "' is replaced with '" + l + "'", "INFO")
                }
                i[k] = l;
                return l
            }
        };
        return j
    })();
    e.api.ready(function () {
        f.loadTags(["video-live", "video-vod", "audio-live", "audio-vod", "doc"], e.gsmlTagHandler)
    });
    var c = g.GS = {
        version: "1.0", widget: function (i) {
            return e.api.widget.proxy(i)
        }, loadTag: function (i, j) {
            e.gsmlTagHandler(i, j)
        }, createChannel: function (j) {
            var i = e.suite(j).createWidget("CHANNEL", "CHANNEL");
            return e.api.widget.proxy(i.id)
        }, options: function (i) {
            if (e.isNotEmpty(i.log)) {
                e.api.log.extend(i.log)
            }
            if (e.isNotEmpty(i.debug)) {
                if (i.debug == true || i.debug == "true") {
                    e.logger.level = "DEBUG"
                }
            }
        }, monitor: {
            logs: function () {
                var m = [];
                var l = e.logger.logs;
                for (var j = 0; j < l.length; j++) {
                    var k = l[j];
                    m.push("[" + k.time.toLocaleTimeString() + "][" + k.type + "]" + k.msg)
                }
                return m
            }, events: function () {
                var m = [];
                for (var j in e.suites) {
                    var l = e.suites[j];
                    for (var k in l.eventsmap) {
                        var n = "";
                        if (l.key != e.defaultKey) {
                            n = l.key + "."
                        }
                        m.push(n + k)
                    }
                }
                return m
            }, types: function (i) {
                return b.types(i)
            }
        }, value: function (i, j) {
            d.value(i, j)
        }
    };
    c._in_ = {
        widget: function (i) {
            return e.api.widget.proxy(i)
        }, types: function (i) {
            b.types(i)
        }, options: function (i) {
            if (e.isNotEmpty(i.log)) {
                e.api.log.extend(i.log)
            }
        }, stringify: function (k, i, j) {
            e.api.jsonToStr(k, i, j)
        }, getFlashObj: function (i) {
            return document[i] || g[i]
        }, value: function (i, j) {
            d.value(i, j)
        }, elem: function (i) {
            return e.elem(i)
        }
    };
    c._open_ = {
        onDomReady: e.api.ready,
        browser: e.core.util.browser,
        getElementsByTagName: f.getElementsByTagName,
        loadWidget: function (i, l, m) {
            var j = e.suite(m);
            var k = j.createWidget("OPEN", i, {elem: l});
            return e.api.widget.proxy(k.id)
        },
        loadTags: f.loadTags,
        loadScript: e.loadScript,
        log: e.log,
        trim: e.trim,
        isEmpty: e.isEmpty,
        isNotEmpty: e.isNotEmpty,
        basePath: e.basePath,
        loadSDKTags: function () {
            f.loadTags(["video-live", "video-vod", "audio-live", "audio-vod", "doc"], e.gsmlTagHandler)
        }
    };
    e.log("SDK has loaded!")
})(window);