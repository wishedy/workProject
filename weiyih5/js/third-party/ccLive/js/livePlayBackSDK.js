/**
 * CC playback video
 * v2.2.3 2018/1/8
 */
!(function ($, window, document) {

    // 直播播放器信息
    var CallbackPlayer = function (opts) {
        this.isReady = false;
        this.isPublishing = 0;
        this.id = opts.callbackPlayer.id;

        var swfUrl = '//player.csslcloud.net/platform/live/CallbackPlayer.swf';
        var flashvars = {
            "userid": opts.userId,
            "videoid": opts.videoId,
            "isShowBar": opts.isShowBar
        };
        var params = {
            allowFullscreen: 'true',
            allowScriptAccess: 'always',
            wmode: 'transparent'
        };
        swfobject.embedSWF(swfUrl, opts.callbackPlayer.id, opts.callbackPlayer.width, opts.callbackPlayer.height, '10.0.0',
            '/flash/expressInstall.swf', flashvars, params);

        this.getFlash = function () {
            return swfobject.getObjectById(this.id);
        };

        this.seek = function (t) {
            if (t < 0) {
                return;
            }
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            swf.seek(t);
        };

        this.getFlash = function () {
            return swfobject.getObjectById(this.id);
        };

        this.getPlayerTime = function () {
            if (!this.isReady) {
                return 0;
            }

            var t = parseInt(this.getFlash().getPosition(), 10);
            if (isNaN(t) || t < 0) {
                return 0;
            }

            return t;
        };

        this.getDuration = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.getDuration();
        };

        this.getBuffer = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.getBufferLength();
        };

        this.setVolume = function (n) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.setVolume(n);
        };

        this.getVolume = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.getVolume();
        };

        this.play = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            return swf.isPlay();
        };
    };


    var Socket = function (opts) {

        var isHttps = window.location.protocol === 'https:';
        var host = opts.chat.host;
        if (isHttps && host && host.indexOf(':')) {
            var s = host.split(':');
            if (s.length == 2) {
                var port = parseInt(s[1]);
                if (!isNaN(port)) {
                    var httpsPort = port + 400;
                    host = s[0] + ':' + httpsPort;
                }
            }
        }

        var terminal = 0;
        if (MobileLive.isMobile() == 'isMobile') {
            terminal = 1;
        }

        var socket = io.connect(document.location.protocol + '//' + host + '/replay', {
            query: {
                roomid: opts.roomId,
                sessionid: opts.viewer.sessionId,
                platform: 1,
                terminal: terminal
            }
        });
    };

    var DrawPanel = function (opts, callbackPlayer) {
        this.isReady = false;

        var swfUrl = '//zeus.csslcloud.net/flash/Player.swf';

        var flashvars = {
            'type': 'drawpanel'
        };
        var params = {
            allowFullscreen: 'true',
            allowScriptAccess: "always",
            wmode: 'transparent'
        };
        var attributes = {};
        swfobject.embedSWF(swfUrl, opts.drawPanel.id, opts.drawPanel.width, opts.drawPanel.height,
            "10.0.0", "/flash/expressInstall.swf", flashvars, params, attributes);

        this.getFlash = function () {
            if (!this.isReady) {
                return;
            }
            return swfobject.getObjectById(opts.drawPanel.id);
        };

        this.clear = function () {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }
            // clear == _streamEnd
            swf.clear();
        };

        // 画图
        this.draw = function (j) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            swf.draw(j);
        };

        this.draws = function (js) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            (function (jstr) {
                setTimeout(function () {
                    swf.drawList(jstr);
                });
            })(js);
        };


        // 翻页
        this.filp = function (j) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            var jj = JSON.parse(j);
            var u = jj.url;
            var isHttps = window.location.protocol === 'https:';
            if (isHttps) {
                jj.url = u.replace(/http:/g, 'https:');
            }

            if (options.adapt) {
                swf.filp(JSON.stringify(jj), 'auto');
            } else {
                swf.filp(JSON.stringify(jj));
            }
        };

        // 动画
        this.animation = function (j) {
            var swf = this.getFlash();
            if (!swf) {
                return;
            }

            swf.animation(j);
        };


        this.intervalNum = 0;

        // 循环更新翻页和画板信息
        this.interval = function () {
            var ft = 0;
            try {
                ft = callback.callbackPlayer.getPlayerTime();
            } catch (e) {
            }
            if (ft < 0) {
                return;
            }

            try {
                if (callback.animations && callback.animations.length > 0) {
                    if (callback.animationIndex < callback.animations.length) {
                        var pidex = callback.pageChangeIndex;
                        if (pidex >= 0) {
                            var pc = callback.pageChanges[pidex];
                            var a = callback.animations[callback.animationIndex + 1];
                            if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                                this.animation(JSON.stringify({
                                    "fileName": a.docName,
                                    "totalPage": a.docTotalPage,
                                    "docid": a.encryptDocId,
                                    "url": a.url,
                                    "page": a.pageNum,
                                    "step": a.step
                                }));
                                callback.animationIndex = callback.animationIndex + 1;
                            }
                        }
                    }
                }
            } catch (e) {
            }

            try {
                if (callback.pageChanges && callback.pageChanges.length > 0) {
                    if (callback.pageChangeIndex < callback.pageChanges.length) {
                        var pc = callback.pageChanges[callback.pageChangeIndex + 1];
                        if (ft >= pc.time) {
                            if (typeof window.on_cc_callback_page_change === 'function') {
                                window.on_cc_callback_page_change(pc);
                            }

                            this.filp(JSON.stringify({
                                "fileName": pc.docName,
                                "totalPage": pc.docTotalPage,
                                "docid": pc.encryptDocId,
                                "url": pc.url,
                                "page": pc.pageNum,
                                "useSDK": pc.useSDK
                            }));
                            callback.pageChangeIndex = callback.pageChangeIndex + 1;
                        }
                    }
                }
            } catch (e) {
            }

            try {
                if (callback.animations && callback.animations.length > 0) {
                    if (callback.animationIndex < callback.animations.length) {
                        var pidex = callback.pageChangeIndex;
                        if (pidex >= 0) {
                            var pc = callback.pageChanges[pidex];
                            var a = callback.animations[callback.animationIndex + 1];
                            if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                                this.animation(JSON.stringify({
                                    "fileName": a.docName,
                                    "totalPage": a.docTotalPage,
                                    "docid": a.encryptDocId,
                                    "url": a.url,
                                    "page": a.pageNum,
                                    "step": a.step
                                }));
                                callback.animationIndex = callback.animationIndex + 1;
                            }
                        }
                    }
                }
            } catch (e) {
            }


            try {
                if (callback.draws && callback.draws.length > 0) {
                    // 画图逻辑
                    if (callback.drawIndex < callback.draws.length) {
                        var dc = callback.draws[callback.drawIndex + 1];
                        while (ft >= dc.time) {
                            this.draw(dc.data);
                            callback.drawIndex = callback.drawIndex + 1;
                            dc = callback.draws[callback.drawIndex + 1];
                        }
                        //if (ft >= dc.time) {
                        //    this.draw(dc.data);
                        //    callback.drawIndex = callback.drawIndex + 1;
                        //}
                    }
                }
            } catch (e) {
            }
        };

        this.intervalPainting = function (callback) {
            callback.drawPanel.intervalNum = setInterval(function () {
                callback.drawPanel.interval(callback);
            }, 1000);
        }
    };

    // 历史数据
    var History = function (opts, callback) {
        $.ajax({
            url: "//view.csslcloud.net/api/room/callback/login",
            type: "GET",
            dataType: "jsonp",
            data: {
                roomid: opts.roomId,
                userid: opts.userId,
                liveid: opts.liveId,
                recordid: opts.recordId,
                viewertoken: opts.viewertoken,
                viewername: opts.viewername,
                forcibly: opts.forcibly
            },
            success: function (data) {
                if (!data.success) {
                    if (typeof window.on_cc_login_error === 'function') {
                        window.on_cc_login_error(data);
                    }
                    return;
                }

                if (!data.datas) {
                    return;
                }

                opts.chat = {
                    host: data.datas.chatHost
                };
                opts.viewer.sessionId = data.datas.sessionId;
                callback.socket = new Socket(opts);

                var datas = data.datas;
                var meta = datas.meta;
                if (!meta) {
                    return;
                }

                var pages = meta.pageChange;

                for (var i = 0; i < pages.length; i++) {
                    var imgUrl = pages[i].url;
                    var isHttps = window.location.protocol === 'https:';
                    if (imgUrl.indexOf('//') > 0 && isHttps) {
                        imgUrl = imgUrl.replace('http', 'https');
                        pages[i].url = imgUrl;
                    }
                }

                if (typeof window.on_cc_callback_pages === 'function') {
                    window.on_cc_callback_pages(pages);
                }

                if (typeof window.on_cc_callback_player === 'function') {
                    window.on_cc_callback_player(data.datas.live.encryptRecordvideoId);
                }

                var questions = meta.question;
                if (questions && questions.length) {
                    questions.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.questions = questions;
                    for (var i = 0; i < callback.questions.length; i++) {
                        var question = questions[i];

                        if (typeof window.on_cc_live_qa_question === 'function') {
                            console.log("这里")
                            window.on_cc_live_qa_question({
                                "action": "question",
                                "value": {
                                    "id": question.encryptId,
                                    "content": question.content,
                                    "userId": question.questionUserId,
                                    "userName": question.questionUserName,
                                    "userAvatar": question.questionUserAvatar,
                                    "isPublish": question.isPublish
                                }
                            });
                        }
                    }
                }

                var answers = meta.answer;
                if (answers && answers.length) {
                    answers.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.answers = answers;

                    for (var i = 0; i < callback.answers.length; i++) {
                        var answer = answers[i];

                        if (typeof window.on_cc_live_qa_answer === 'function') {
                            console.log('开始');
                            window.on_cc_live_qa_answer({
                                "action": "answer",
                                "value": {
                                    "questionId": answer.encryptId,
                                    "content": answer.content,
                                    "userId": answer.answerUserId,
                                    "isPrivate": answer.isPrivate,
                                    "userName": answer.answerUserName,
                                    "userAvatar": answer.answerUserAvatar,
                                    "userRole": answer.answerUserRole
                                }
                            });
                        }
                    }
                }

                var draws = meta.draw;
                if (draws && draws.length) {
                    callback.draws = draws;
                }

                var pageChanges = meta.pageChange;
                if (pageChanges && pageChanges.length) {
                    pageChanges.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.pageChanges = pageChanges;
                }

                var animations = meta.animation;
                if (animations && animations.length) {
                    animations.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    callback.animations = animations;
                }

                if (MobileLive.isMobile() == 'isMobile') {

                    MobileLive.init(opts);

                }

                var chatLogs = meta.chatLog;
                if (chatLogs && chatLogs.length) {
                    chatLogs.sort(function (p1, p2) {
                        return parseInt(p1.time) - parseInt(p2.time);
                    });
                    for (var i = 0; i < chatLogs.length; i++) {
                        var chatLog = chatLogs[i];
                        if (typeof window.on_cc_live_chat_msg === 'function') {
                            window.on_cc_live_chat_msg({
                                userid: chatLog.userId,
                                username: chatLog.userName,
                                time: chatLog.time,
                                msg: chatLog.content,
                                useravatar: chatLog.userAvatar,
                                userRole: chatLog.userRole,
                                usercustommark: chatLog.userCustomMark
                            });
                        }
                    }
                    callback.chatLogs = chatLogs;
                }

                window.on_cc_h5_player_load = function () {
                    $.Callback.config({playerId: 'playbackVideo'}, meta);
                    if (chatLogs && chatLogs.length) {
                        window.CHATLOGS = chatLogs;
                        cc_live_callback_chat_interval();
                    }
                };

                callback.isHistoryReady = true;

                callback.drawPanel.isReady = true;

                setTimeout(function () {
                    initDrawPanelInfo();
                }, 1500);
            }

        });
    };

    var ChatMessageCache = function () {
        this.cache = [];
        this.lastTimeRefresh = new Date().getTime();

        this.INTERVAL_TIME = setInterval(function () {
            callback.chatMessageCache.refresh();
        }, 80);

        //
        this.push = function (data) {
            // 缓存中超过5000条数据，则丢弃
            if (this.cache.length > 5000) {
                return;
            }
            this.cache.push(data);
        };

        this.ableRefresh = function () {
            var n = new Date().getTime();

            if (this.cache.length == 0) {
                return false;
            }

            if ((n - this.lastTimeRefresh) >= 80) {
                return true;
            }
            return false;
        };

        this.refresh = function () {
            if (!this.ableRefresh()) {
                return;
            }

            clearInterval(this.INTERVAL_TIME);

            var d = [];
            var l = Math.min(this.cache.length, 10);
            for (var i = 0; i < l; i++) {
                d.push(this.cache.shift());
            }

            if (typeof window.on_cc_live_chat_msg_sync === 'function') {
                console.log(window.on_cc_live_chat_msg_sync);
                window.on_cc_live_chat_msg_sync(d);
            }

            this.lastTimeRefresh = new Date().getTime();

            this.INTERVAL_TIME = setInterval(function () {
                callback.chatMessageCache.refresh();
            }, 80);
        };
    };

    var Callback = function (opts) {
        this.chatLogs = [];
        this.draws = [];
        this.pageChanges = [];
        // 获取历史数据成功
        this.isHistoryReady = false;
        this.questions = [];
        this.answers = [];
        this.pageChanges = [];
        this.draws = [];
        this.animations = [];
        this.pageChangeIndex = -1;
        this.drawIndex = -1;
        this.animationIndex = -1;

        //this.callbackPlayer = new CallbackPlayer(opts);
        //this.socket = new Socket(opts);
        this.drawPanel = new DrawPanel(opts, this);
        this.history = new History(opts, this);
        this.chatMessageCache = new ChatMessageCache();
    };

    var callback = {};

    var options = {
        userId: $('#userId').val(),
        roomId: $('#roomId').val(),

        liveId: $('#liveId').val(),
        recordId: $('#recordId').val(),
        videoId: $('#videoId').val(),
        adapt: false,
        isShowBar: 0,

        // 观看者用户信息
        viewer: {
            id: $('#viewerId').val(),
            name: $('#viewerName').val(),
            role: $('#viewerRole').val(),
            sessionId: $('#sessionId').val()
        },

        // 直播播放器信息
        callbackPlayer: {
            id: 'playbackPlayer',
            width: '100%',
            height: '100%'
        },

        // 画板信息
        drawPanel: {
            id: 'playbackPanel',
            width: '100%',
            height: '100%'
        }
    };

    function init(opts) {
        options = $.extend(options, opts);
        callback = new Callback(options);
    }

    var DW = {
        // 初始化DW对象
        config: function (opts) {

            this.loadScript([
                "//static.csslcloud.net/js/socket.io.js",
                "//static.csslcloud.net/js/swfobject.js",
                "//static.csslcloud.net/js/json3.min.js",
                "//static.csslcloud.net/js/module/drawingBoard-2.0.0.js",
                "//static.csslcloud.net/js/module/drawingBoardPlayback.js"
            ], function () {
                init(opts);
                if (MobileLive.isMobile() == 'isMobile' && $.DrawingBoard) {
                    var dp = '<canvas id="drawPanel" width="1200" height="1200"></canvas>'
                        + '<iframe id="dpa" src="" frameborder="0"></iframe>';
                    $('#playbackPanel').parent().append(dp);
                    $('div#playbackPanel').remove();
                }
            });

        },

        logout: function () {
            $.ajax({
                url: '//view.csslcloud.net/api/callback/logout',
                type: "GET",
                dataType: "json",
                timeout: 5000,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                },
                error: function (xhr, status, error) {
                }
            });
        },

        getScript: function (url, success) {

            var readyState = false,
                script = document.createElement('script');
            script.src = url;

            script.onload = script.onreadystatechange = function () {
                if (!readyState && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
                    readyState = true;
                    success && success();
                }
            };
            document.body.appendChild(script);

        },

        loadScript: function (res, callback) {

            if (typeof res === 'string') {
                var _res = res;
                res = [];
                res.push(_res);
            }
            var _this = this,
                queue = function (fs, cb) {
                    _this.getScript(fs.shift(), function () {
                        fs.length ? queue(fs, cb) : cb && cb();
                    });
                };

            queue(res, callback);

        },

        seek: function (t) {
            clearInterval(callback.drawPanel.intervalNum);
            callback.callbackPlayer.getFlash().seek(t);
        },

        getPlayerTime: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                return MobileLive.getPlayerTime();
            } else {
                return callback.callbackPlayer.getPlayerTime();
            }
        },

        getDuration: function () {
            if (MobileLive.isMobile() == 'isMobile') {
                return MobileLive.getDuration();
            } else {
                return callback.callbackPlayer.getDuration();
            }
        },

        docAdapt: function (t) {
            options.adapt = t;
        },

        isShowBar: function (n) {
            options.isShowBar = n;
        },

        getBuffer: function(){
            return callback.callbackPlayer.getBuffer();
        },

        setVolume: function(n){
            return callback.callbackPlayer.setVolume(n);
        },

        getVolume: function(){
            return callback.callbackPlayer.getVolume();
        },

        play: function(){
            return callback.callbackPlayer.play();
        }

    };

    $.extend({
        DW: DW
    });


    function isLivePlayerReady() {
        if (!callback.callbackPlayer.isReady) {
            setTimeout(function () {
                isLivePlayerReady();
            }, 500);
            return;
        }

        callback.drawPanel.intervalPainting(callback);
    }

    // 初始化画板数据
    function initDrawPanelInfo() {
        // 等待历史数据加载成功
        if (!callback.isHistoryReady) {
            setTimeout(function () {
                initDrawPanelInfo();
            }, 300);
            return;
        }

        isLivePlayerReady();
    }

    window.on_cc_callback_player = function (videoId) {
        options.videoId = videoId;
        callback.callbackPlayer = new CallbackPlayer(options);
    };

    // 播放器加载完成，开始播放
    window.on_cc_live_player_init = function () {
        callback.callbackPlayer.isReady = true;
        try {
            callback.callbackPlayer.getFlash().start();
        } catch (e) {
        }
        // 同时开始实时显示聊天信息
        setInterval(function () {
            var ft = 0;
            try {
                ft = callback.callbackPlayer.getPlayerTime();
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            if (!callback.chatLogs.length) {
                return;
            }

            var chatLog = callback.chatLogs[0];
            while (chatLog.time <= ft) {
                chatLog = callback.chatLogs.shift();

                callback.chatMessageCache.push({
                    userid: chatLog.userId,
                    username: chatLog.userName,
                    time: chatLog.time,
                    msg: chatLog.content,
                    useravatar: chatLog.userAvatar,
                    userRole: chatLog.userRole,
                    usercustommark: chatLog.userCustomMark
                });

                if (!callback.chatLogs.length) {
                    break;
                }

                chatLog = callback.chatLogs[0];
            }
        }, 1000);

        if (typeof window.on_cc_live_player_load === 'function') {
            window.on_cc_live_player_load();
        }
    };

    function cc_live_callback_chat_interval() {
        setInterval(function () {
            var ft = 0;
            try {
                ft = parseInt($('#playbackVideo')[0].currentTime, 10);
            } catch (e) {
            }
            if (ft <= 0) {
                return;
            }

            if (!window.CHATLOGS.length) {
                return;
            }

            var chatLog = window.CHATLOGS[0];

            while (chatLog.time <= ft) {
                var cl = window.CHATLOGS.shift();
                callback.chatMessageCache.push({
                    userid: cl.userId,
                    username: cl.userName,
                    time: cl.time,
                    msg: cl.content,
                    useravatar: cl.userAvatar,
                    userRole: cl.userRole,
                    usercustommark: cl.userCustomMark
                });
                if (!window.CHATLOGS.length) {
                    break;
                }
                chatLog = window.CHATLOGS[0];
            }
        }, 1000);
    }

    // 画板Flash加载完成回调
    //window.on_drampanel_ready = function () {
    //    callback.drawPanel.isReady = true;
    //
    //    setTimeout(function () {
    //        initDrawPanelInfo();
    //    }, 1500);
    //};

    window.seekStart = function () {
        clearInterval(callback.drawPanel.intervalNum);
    };

    // 拖动时间轴或跳动播放成功后回调函数
    window.seekComplete = function () {
        callback.drawPanel.clear();
        //clearInterval(callback.drawPanel.intervalNum);

        var ft = callback.callbackPlayer.getPlayerTime();
        if (ft < 0) {
            ft = 0;
        }

        callback.pageChangeIndex = -1;
        callback.drawIndex = -1;
        callback.animationIndex = -1;

        if (callback.pageChanges && callback.pageChanges.length > 0) {
            for (var i = 0; i < callback.pageChanges.length; i++) {
                var pc = callback.pageChanges[i];
                if (ft >= pc.time) {
                    callback.pageChangeIndex = i;
                }
            }

            if (callback.pageChangeIndex >= 0) {
                var pc = callback.pageChanges[callback.pageChangeIndex];
                if (typeof window.on_cc_callback_page_change === 'function') {
                    window.on_cc_callback_page_change(pc);
                }
                callback.drawPanel.filp(JSON.stringify({
                    "fileName": pc.docName,
                    "totalPage": pc.docTotalPage,
                    "docid": pc.encryptDocId,
                    "url": pc.url,
                    "page": pc.pageNum,
                    "useSDK": pc.useSDK
                }));
            }
        }

        if (callback.animations && callback.animations.length > 0) {
            for (var i = 0; i < callback.animations.length; i++) {
                var a = callback.animations[i];
                if (ft >= a.time) {
                    callback.animationIndex = i;
                }
            }

            if (callback.animationIndex >= 0) {
                var pidex = callback.pageChangeIndex;
                if (pidex >= 0) {
                    var pc = callback.pageChanges[pidex];
                    var a = callback.animations[callback.animationIndex];

                    if (!!pc && !!a && pc.encryptDocId == a.encryptDocId && ft >= a.time && pc.time <= a.time) {
                        callback.drawPanel.animation(JSON.stringify({
                            "fileName": a.docName,
                            "totalPage": a.docTotalPage,
                            "docid": a.encryptDocId,
                            "url": a.url,
                            "page": a.pageNum,
                            "step": a.step
                        }));
                    }
                }
            }
        }

        if (callback.draws && callback.draws.length > 0) {
            for (var i = 0; i < callback.draws.length; i++) {
                var dc = callback.draws[i];
                if (ft >= dc.time) {
                    //callback.drawPanel.draw(dc.data);
                    callback.drawIndex = i;
                }
            }

            var ds = callback.draws.slice(0, (callback.drawIndex + 1));
            if (ds.length > 0) {
                var dcdatas = [];
                for (var i = 0; i < ds.length; i++) {
                    var dc = ds[i];
                    dcdatas.push(dc.data);
                }
                callback.drawPanel.draws(dcdatas);
            }
        }

        callback.drawPanel.intervalNum = setInterval(function () {
            callback.drawPanel.interval();
        }, 1000);
    };


    var MobileLive = {

        init: function (opts) {
            var _this = this;
            $.ajax({
                url: "//view.csslcloud.net/api/vod/play/mobile",
                type: "GET",
                dataType: "jsonp",
                data: {userid: opts.userId, videoid: opts.videoId},
                success: function (data) {
                    var pvdefault = data.video[0];

                    var playurl = pvdefault.playurl;
                    var secureplayurl = pvdefault.secureplayurl;

                    var isHttps = window.location.protocol === 'https:';
                    if (isHttps && !!secureplayurl) {
                        playurl = secureplayurl;
                    }

                    _this.appendVideo(playurl);
                }
            });
        },

        appendVideo: function (s) {
            var v = '<video id="playbackVideo" webkit-playsinline playsinline controls autoplay x-webkit-airplay="allow" x5-playsinline width="100%" height="100%" src="' + s + '"></video>';
            $("#" + playbackPlayer.id).html(v);
            var video = document.getElementById('playbackVideo');
            video.addEventListener('canplay', function () {
                if (typeof window.on_cc_live_player_load === 'function') {
                    window.on_cc_live_player_load();
                }
                if (typeof window.on_cc_h5_player_load === 'function') {
                    window.on_cc_h5_player_load();
                }
            }, false)
        },

        getDuration: function () {
            var v = document.getElementById('playbackVideo');
            if (!v) {
                return;
            }
            return Math.floor(v.duration);
        },

        getPlayerTime: function () {
            var v = document.getElementById('playbackVideo');
            if (!v) {
                return;
            }
            return Math.floor(v.currentTime);
        },

        end: function () {
            $("#" + playbackPlayer.id).html('end');
        },

        appendDoc: function (s) {
            var img = '<img src="' + s + '" />';
            $("#" + playbackPanel.id).append(img);
        },

        isMobile: function () {
            if (this.isIPad() || this.isIPhone() || this.isAndroid() || this.isWindowsPhone()) {
                return 'isMobile';
            }
        },

        isIPad: function () {
            return navigator.userAgent.match(/iPad/i) != null;
        },

        isIPhone: function () {
            return navigator.userAgent.match(/iPhone/i) != null;
        },

        isAndroid: function () {
            return navigator.userAgent.match(/Android/i) != null;
        },

        isWindowsPhone: function () {
            return navigator.userAgent.match(/Windows Phone/i) != null;
        }

    };


})(jQuery, window, document, undefined);