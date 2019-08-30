/*
* create By ZhangHeng on 2018/1/10
*/

$(function () {
    // var liveUserId = '0438CD3A0AB20794';
     var liveUserId = comm.getpara().userId;
    var ccLive = {
        el: {
            toggleTeacher: $("#chatto-box"),
            teacherBox: $("#chatto-list"),
            phizBtn: $(".phiz-btn"),
            phizList: $("#phizList"),
            sendBar: $("#chat-area"),
            sendBtn: $("#chat-submit"),
            sendRole: $("#selectedUser"),
            msgList: $(".msg-list"),
            onLineNum: $('#peopleNum'),
            changeBtn: $("#changeWindows"),
            handUp: $("#gs-handup"),
            onHandUp: $("#gs-handup-countdown"),
            ifr2:null
        },
        data: {
            getBrowseNum:false,
            authority:comm.getpara().authority,
            token:comm.getpara().token||333333,
            back:comm.getpara().back,
            backOnOff: parseInt(comm.getpara().back, 10) === 1,
            userId: liveUserId,
            roomId: comm.getpara().roomId,
            conId: comm.getpara().conId,
            conSubId: comm.getpara().conSubId,
            ownerId: comm.getpara().ownerId,
            liveId: comm.getpara().liveId,
            recordId: comm.getpara().recordId,
            audioOnOff: false,
            User: {},
            viewername: $("#sesCustomerId").val()+'_1',
            'regionEmotion': "//img10.allinmd.cn/v3/conference/ccEmotion/",
            emotion: {
                emotionList: []
            }
        },
        init: function () {
            var t = this;
            //t.data.viewername = 'd22f_bd5b4_2c64628_9fbaef796d0f_5c1e';
            var startBackLiveInit = function(){
                var customerId = $("#sesCustomerId").val();
                var timestamp = Date.parse(new Date());
                t.data.viewername = customerId+'_1';
                if(((typeof  customerId)==="string")&&customerId.length===0){
                    t.data.viewername = 'Y'+timestamp+'_1';
                }
                if(((customerId == "null")||(typeof customerId == "null")||(customerId == "undefined")||(typeof customerId == "undefined"))){
                    t.data.viewername = 'Y'+timestamp+'_1';
                }
                t.backVideoInit().disableChat().getUserInfo().changeVideoDoc().processInit();
                t.el.ifr2.addClass("live-wrap");
                $("[name=interaction]").show();
            };
            var startLiveInit = function(){
                var customerId = $("#sesCustomerId").val();
                var timestamp = Date.parse(new Date());
                t.data.viewername = customerId+'_1';
                if(((typeof  customerId)==="string")&&customerId.length===0){
                    t.data.viewername = 'Y'+timestamp+'_1';
                }
                if(((customerId == "null")||(typeof customerId == "null")||(customerId == "undefined")||(typeof customerId == "undefined"))){
                    t.data.viewername = 'Y'+timestamp+'_1';
                }
                t.videoInit().getUserInfo().onlineNum().changeVideoDoc().processInit().chatSubmit();
                t.el.ifr2.addClass("live-wrap");
                $("[name=interaction]").show();
            };
            if (t.data.backOnOff) {
                t.checkLiveAuth(startBackLiveInit)
            } else {
                t.checkLiveAuth(startLiveInit);

            }


        },
        checkLiveAuth:function(callBack){
          var t = this;
            var isLogin = $.trim($("#sesCustomerId").val()).length !== 0 ? true : false;
            var factory = (parseInt(localStorage.getItem('customerRole'),10)===3);
            var isAuth = $.trim($("#sesAuth").val());
            switch (parseInt(ccLive.data.authority,10)) {
                case 1:
                    callBack&&callBack();
                    break;															//所有
                case 2:
                    user.login({
                        callback: function () {
                            //window.location.reload();
                            callBack&&callBack();
                        },
                        scene: privilegeSceneConst.eSceneTypeLogin,
                        onClose:function(){
                            if ((!isLogin)&&(factory)) {
                                window.location.href = (document.referrer)?document.referrer:_href;
                            }
                        },
                        onAuthCancel: "back"
                    });
                    break; //登录
                case 3:
                    user.login({
                        callback: function () {
                            // window.location.reload();
                            callBack&&callBack();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose:function(){
                            if ((!isAuth)&&(factory)) {
                                window.location.href = (document.referrer)?document.referrer:_href;
                            }
                        },
                        onAuthCancel: "back"
                    });
                    break; //认证
                case 4:
                    callBack&&callBack();
                    break;
                default:
                    window.location.href = (document.referrer)?document.referrer:'www.allinmd.cn';
            }
          return t;
        },
        notice:function(msg){
            var time = '';
            var d = new Date();
            var my_hours=d.getHours();
            var my_minutes=d.getMinutes();
            var my_seconds=d.getSeconds();
            time = my_hours+":"+my_minutes+":"+my_seconds;
            return '<li class="al-msg-item al-msg-sys">\n' +
                '                                                <div class="al-msg-icon"></div>\n' +
                '                                                <div class="al-msg-sysContent">\n' +
                msg +
                '                                                </div>\n' +
                '                                            </li>';
        },
        chatSubmit: function () {
            var t = this;

            t.el.handUp.off("click").on("click", function (e) {
                t.el.handUp.off("click");
                if (!t.data.audioOnOff) {
                    var timeCount = 60;
                    t.data.audioOnOff = true;
                    $.topTip({mark: "success", content: "已发送语音申请，请稍候..."});
                    DWLive.requestInteraction({
                        video: false,
                        audio: true
                    });

                    var handTimer = null;
                    function giveUpInteraction(){
                        t.el.onHandUp.text('');
                        t.data.audioOnOff = false;
                        DWLive.hangupInteraction();
                        t.chatSubmit();
                        clearInterval(handTimer);
                        handTimer = null;
                    }
                    window.on_cc_live_accept_interaction = function () {
                        handTimer = setInterval(function () {
                            if ((timeCount <= 60) && (timeCount >= 0)) {
                                t.el.onHandUp.text('(' + (timeCount--) + ')');
                            } else {
                                DWLive.hangupInteraction();
                                giveUpInteraction();
                            }
                        }, 1000);
                    };
                } else {
                    return false;
                }
            });
            return t;
        },
        disableChat: function () {
            var t = this;
            $("#chat-area").attr({"contenteditable": false});
            $(".phiz-btn").addClass("phiz-btn-disable");
            $("#selectedUser").off("click");
            $(".chat-send-btn").addClass("chat-send-btn-discover");
            $(".phiz").addClass("phiz-disable");
            $("#selectedUser").addClass("selectedUser-disable");
            return t;
        },
        backInit: function () {
            //初始化参数，区分本逻辑是直播还是回播

        },
        flashState: function () {
            function flashChecker() {
                var hasFlash = 0;         //是否安装了flash
                var flashVersion = 0; //flash版本
                var isIE = /*@cc_on!@*/0;      //是否IE浏览器

                if (isIE) {
                    var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    if (swf) {
                        hasFlash = 1;
                        VSwf = swf.GetVariable("$version");
                        flashVersion = parseInt(VSwf.split(" ")[1].split(",")[0]);
                    }
                } else {
                    if (navigator.plugins && navigator.plugins.length > 0) {
                        var swf = navigator.plugins["Shockwave Flash"];
                        if (swf) {
                            hasFlash = 1;
                            var words = swf.description.split(" ");
                            for (var i = 0; i < words.length; ++i) {
                                if (isNaN(parseInt(words[i]))) continue;
                                flashVersion = parseInt(words[i]);
                            }
                        }
                    }
                }
                return {f: hasFlash===1, v: flashVersion};
            }

            function demo() {
                var flag = false;
                if (window.ActiveXObject) {
                    try {
                        var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                        if (swf) {
                            flag = true;
                        }
                    } catch (e) {
                    }
                } else {
                    try {
                        var swf = navigator.plugins['Shockwave Flash'];
                        if (swf) {
                            flag = true;
                        }
                    } catch (e) {
                    }
                }
                if (flag) {
                    return true
                } else {
                    return false;
                }
            }

            var fls = flashChecker();
            var s = "";
            return fls.f && demo();
        },
        getUserId:function(userId){
            var timestamp = Date.parse(new Date());

            if(((typeof  userId)==="string")&&(userId.length===0) ){
                userId = 'Y'+timestamp;
            }
            if(((userId == null)||(userId == "null")||(typeof userId == "null")||(userId == "undefined")||(typeof userId == "undefined"))){
                userId = 'Y'+timestamp;
            }
            return userId;
        },
        backVideoInit: function () {
            // 回放SDK参数配置
            var t = this;
            if (!t.flashState()&&(!comm.browser.versions.iPad)) {
                $("#playbackPlayer").html('<object type="application/x-shockwave-flash"' +
                    '                               data="your-flash-file.swf"' +
                    '                               width="100%" height="100%">' +
                    '                          <param name="movie" value="//zeus.csslcloud.net/flash/Player.swf" />' +
                    '                           <param name="quality" value="high"/>' +
                    '</object>')
            } else {
                var backConfig = {
                    userId: t.data.userId,
                    roomId: t.data.roomId,
                    liveId: t.data.liveId,
                    //fastMode:true,
                    viewername: t.getUserId($("#sesCustomerId").val())+'_1',
                    viewertoken: t.data.token,
                    recordId: t.data.recordId
                };
                $.DW.config(backConfig);
                ccChat.methods.init();
                var showVideo = setInterval(function () {
                    if ($("#playbackPlayer").children().length) {
                        $(".Ev-Show").show();
                        clearInterval(showVideo);
                    }
                }, 1000);
            }
            t.el.ifr2 = $(".ifrVideo-22");
            t.el.ifr2.show();
            return t;
        },
        videoInit: function () {
            var t = this;
            t.el.ifr2 = $(".ifrVideo-21");
            if (!t.flashState()&&(!comm.browser.versions.iPad)) {
                $("#livePlayer").html('<object type="application/x-shockwave-flash"' +
                    '                               data="your-flash-file.swf"' +
                    '                               width="100%" height="100%">' +
                    '                          <param name="movie" value="your-flash-file.swf" />' +
                    '                           <param name="quality" value="high"/>' +
                    '</object>')
            } else {
                DWLive.init({
                    userid: t.data.userId,
                    roomid: t.data.roomId,
                    viewername: t.data.viewername,
                    viewertoken: t.data.token,
                    //fastMode:true,
                    viewercustomua: 'pc',
                    forcibly: true
                });
                DWLive.onLiveEnd = function(){
                    t.el.ifr2.removeClass("video-wrap").removeClass("video-wrap-start").addClass("video-wrap-end");
                    t.el.ifr2.children().hide();

                };
                DWLive.onLiveStart = function(){
                    t.el.ifr2.removeClass("video-wrap-end").addClass("video-wrap-start");
                    t.el.ifr2.children().show();
                };
                ccChat.methods.init();
                DWLive.onAnnouncementShow = function (j) {
                    t.el.msgList.append(t.notice(j));
                    $(".chat-cnt").animate({scrollTop: '1000000px'}, 400);
                };
                // 修改公告,发布公告
                DWLive.onAnnouncementRelease = function (j) {
                    t.el.msgList.append(t.notice(j));
                    $(".chat-cnt").animate({scrollTop: '1000000px'}, 400);
                };

                // 删除公告
                DWLive.onAnnouncementRemove = function (j) {
                    $(".al-msg-notice").remove();
                };


            }
            t.el.ifr2.show();
            return t;
        },
        changeVideoDoc: function () {
            var t = this;
            t.el.changeBtn.toggle(function () {
                $("#ifr-1").animate({
                    width: "656px",
                    height: "476px"
                }, 0, function () {
                    $(".video3").animate({
                        width: "656px",
                        height: "476px",
                        left: "0"
                    }, 500, function () {
                        $(".overlay").hide();
                    });
                });


                t.el.ifr2.animate({
                    width: "300px",
                    height: "207px"
                }, 0, function () {
                    $(".document3").animate({
                        left: "680px",
                        width: "300px",
                        height: "207px"
                    }, 500, function () {
                        $(".overlay").hide();
                    });
                });

            }, function () {
                //$(".overlay").show();
                t.el.ifr2.animate({
                    width: "656px",
                    height: "476px"
                }, 0, function () {
                    $(".document3").animate({
                        left: "0",
                        width: "656px",
                        height: "476px"
                    }, 500, function () {
                        $(".overlay").hide();
                    });
                });

                $("#ifr-1").animate({
                    width: "300px",
                    height: "207px"
                }, 0, function () {
                    $(".video3").animate({
                        left: "680px",
                        width: "300px",
                        height: "207px"
                    }, 500, function () {
                        $(".overlay").hide();
                    });
                });
            });
            return t;
        },
        onlineNum: function () {
            var t = this;
            var numObj = $(".people_num");
            numObj.show();
            return t;
        },
        getBrowseNum:function(){
            //获取浏览数
            if(!ccLive.data.getBrowseNum){
                ccLive.data.getBrowseNum = true;
                clearInterval(timer);
                var timer = setInterval(function(){
                    $.ajax({
                        url:PC_CALL+"conference/index/getLiveCount/",
                        dataType:"json",
                        type:"post",
                        data:{paramJson:$.toJSON({conSubId:$.getUrlParam("conSubId")})},
                        success:function(res){
                            if(comm.hasResponseData(res)){
                                var count = res.responseObject.responseData.count;
                                if(count){
                                    $('#peopleNum').html(count).show();
                                }
                            }
                        }
                    });
                },60*1000);
            }
        },
        getUserInfo: function () {
            var t = this;

            function nameAjax() { //获取名字
                $.ajax({
                    url: PC_CALL + "customer/auth/getAuthBycustomerId/",
                    type: "POST",
                    data: {},
                    async: false,
                    success: function (data) {
                        if (data.responseObject.lastName + data.responseObject.firstName) {
                            t.data.User.nickname = data.responseObject.lastName + data.responseObject.firstName + "_" + data.responseObject.customerId + "_1_";
                        } else {
                            t.data.User.nickname = "游客" + "_" + (data.responseObject.customerId ? data.responseObject.customerId : 0) + "_1_";
                        }

                        t.data.User.id = data.responseObject.customerId;
                        $("#sesAuth").val(data.responseObject.state);
                    }
                });
            }

            nameAjax();
            return t;
        },
        processInit: function () {
            var t = this;
            //地址参数配置
            //todo 测试参数注释
            var obj = {
                conId: comm.getpara().conId,
                conSubId: comm.getpara().conSubId,
                ownerid: comm.getpara().ownerId,
                conListPath: window.location.href
            };
            function isForeign(fail, success) { //是否海外
                var foreign = false;
                $.ajax({
                    url: PC_CALL + "log/op/location/getIpArea/",
                    type: "POST",
                    data: {},
                    async: false,
                    success: function (data) {
                        if (data.responseObject.responseData.countryCode !== "CN") {
                            foreign = true;
                            success && success();
                        } else {
                            foreign = false;
                            fail && fail();
                        }
                    }
                });
                return foreign;
            }

            function conSubListTemplate(i, el, date) { //某个分会场日程模版
                var defaultStyle = 'style="display:none;"';
                if (i == 0) {
                    defaultStyle = "";
                }

                return '<li date=' + date + ' ' + defaultStyle + '>' +
                    '<div class="biao_top"></div>' +
                    '<div class="position_time">' + el.startTime.substr(11) + '</div>' +
                    '<div style="margin:0 13px;"><span style="color:#266ba2; margin-right:13px;">' + el.lecturer + '</span>' + el.conName + '</div>' +
                    '</li>';
            }
            function authority(rs) {
                var subId = conSubId ? conSubId : $.getUrlParam("conSubId"),
                    data = rs.data_list && rs.data_list[0].menu_data_list,
                    authority = 0;

                //获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
                var factoryRole = localStorage.getItem("customerRole");
                var myRole = 3;
                var factory = (parseInt(factoryRole,10)===myRole);
                var notFactory = !factory;
                if (data) {
                    $.each(data, function (i, el) {
                        if (el.id == subId) {
                            authority = el.authority;
                            $("#peopleNum").text(el.browseNum);
                        }
                    });
                }

                //如果未匹配到数据配置的分会场信息，则回首页
                var _href = "/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html";

                if (_href.indexOf('conference_live.html') > -1) {//todo 如果是从手机直播页跳转过来的，未登录会一直跳H5页，再跳回当前页，死循环
                    _href = '/';
                }
                //debugger;
                if ((!parseInt(t.data.authority,10))&&(notFactory)) window.location.href = (document.referrer)?document.referrer:_href;

                //是否登录/认证
                var isLogin = $.trim($("#sesCustomerId").val()).length !== 0 ? true : false;
                var isAuth = $.trim($("#sesAuth").val());

                if (isAuth == 2 || isAuth == 7 || isAuth == 8 || isAuth == 9) isAuth = true; else isAuth = false;
                // 匹配结果
                authority = parseInt(t.data.authority,10);
                //debugger;
                switch (authority) {
                    case 1:
                        break;															//所有
                    case 2:
                        user.login({
                            callback: function () {
                                //window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeLogin,
                            onClose:function(){
                                if ((!isLogin)&&(notFactory)) {
                                    window.location.href = (document.referrer)?document.referrer:_href;
                                }
                            },
                            onAuthCancel: "back"
                        });
                        break; //登录
                    case 3:
                        user.login({
                            callback: function () {
                               // window.location.reload();
                            },
                            scene: privilegeSceneConst.eSceneTypeAuth,
                            onClose:function(){
                                if ((!isAuth)&&(notFactory)) {
                                    window.location.href = (document.referrer)?document.referrer:_href;
                                }
                            },
                            onAuthCancel: "back"
                        });
                        break; //认证
                    case 4:
                        break;
                    default:
                        window.location.href = (document.referrer)?document.referrer:_href;
                }
            }
            function isValidAuth(callBackUrl, conSubId) {//验证规则是否能够观看

                 t.getBrowseNum();
            }
            isValidAuth("/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html", obj.conSubId);
            function conListTemplate(el) { //分会场列表模版
                //////console.log(t.data.backOnOff&&(parseInt(el.isOnline,10)===3))
                ////console.log(el);
                    if(t.data.backOnOff){
                        el.userId = liveUserId;
                        return '<li data-liveId="' + el.liveId + '" data-conSubId="' + el.id + '" data-conSubRoom="' + el.conSubRoom + '" data-userid="'+liveUserId+''  + '" data-recordId="'+el.playBackId+ '" data-authority="'+el.authority+'">' + el.conSubName + '</li>';
                    }else{
                        /*if(!t.data.backOnOff&&(parseInt(el.isOnline,10)===1)){

                        }else{
                            return '<li data-liveId="' + el.liveId + '" data-conSubId="' + el.id + '" data-conSubRoom="' + el.conSubRoom + '" data-userid="'+liveUserId+''  + '" data-recordId="'+el.playBackId+ '" data-authority="'+el.authority+'">' + el.conSubName + '</li>';
                        }*/
                        return '<li data-liveId="' + el.liveId + '" data-conSubId="' + el.id + '" data-conSubRoom="' + el.conSubRoom + '" data-userid="'+liveUserId+''  + '" data-recordId="'+el.playBackId+ '" data-authority="'+el.authority+'">' + el.conSubName + '</li>';

                    }

            }

            function listCtrl(data, src, obj) { //数据控制

                if (src === "con") { //多会场
                    authority(data);
                    var kv = data.data_list[0].menu_data_list;

                    //非PC端跳手机版 为了取标题
                    if (!comm.equipment.IsPC()) {
                        if(ccLive.data.liveId){
                            window.location.href = "//m.allinmd.cn/pages/conference/conference_live.html?authority="+ccLive.data.authority+"&conSubId=" + ccLive.data.conSubId + "&conId=" + ccLive.data.conId + "&userId=" + ccLive.data.userId + "&roomId="+ccLive.data.roomId+"&back="+ccLive.data.back+"&liveId="+ccLive.data.liveId+"&recordId="+ccLive.data.recordId;
                        }else{
                            window.location.href = "//m.allinmd.cn/pages/conference/conference_live.html?authority="+ccLive.data.authority+"&conSubId=" + ccLive.data.conSubId + "&conId=" + ccLive.data.conId + "&userId=" + ccLive.data.userId + "&roomId="+ccLive.data.roomId+"&back="+ccLive.data.back
                        }

                        return false;
                    }

                    var showAgenda = 0, html = "";
                    $.each(kv, function (i, el) {
                        showAgenda = el.isOnline;
                        /*if(showAgenda){*/
                        if (el.id == obj.conSubId) {
                            document.title = el.conSubName + "直播会场-唯医,allinmd";
                            $(".ev-currColumn").text(el.conSubName);
                            $(".ev-currColumn").attr("data-userid", el.liveId);
                            $(".ev-currColumn").attr("data-conSubId", el.conSubId);
                        } else {
                            if(t.data.backOnOff){
                                ////console.log('这是个回播');
                                if(parseInt(el.isOnline,10)!==1){
                                    html += conListTemplate(el);
                                }
                            }else{
                                ////console.log('这是个直播');
                                if(parseInt(el.isOnline,10)===1){
                                    html += conListTemplate(el);
                                }
                            }

                        }
                        /*}*/
                    });

                    $(".ev-conList").html(html).find("li").off("click").on("click", function () {//主导航
                        obj.conSubId = $(this).attr("data-conSubId");
                        obj.userid = $(this).attr("data-userid");
                        obj.recordId = $(this).attr("data-recordId");
                        obj.roomid = $(this).attr("data-consubroom");
                        obj.liveId = $(this).attr("data-liveId");
                        obj.authority = $(this).attr("data-authority");
                        GlobalOneStatusBrowse = true;
                        isForeign(function () {
                            isValidAuth("/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html", obj.conSubId);

                        }, function () {
                            return false;
                        });
                        var jumOther = function () {
                            //changeVideo(obj);
                            //debugger;
                            //TODO:为了方便记录观看人数点击需要刷新页面
                            if(ccLive.data.liveId){
                                window.location.href = "//www.allinmd.cn/pages/conference/conference_live.html?authority="+obj.authority+"&conSubId=" + obj.conSubId + "&conId=" + ccLive.data.conId + "&userId=" + obj.userid + "&roomId="+obj.roomid+"&back=1"+"&liveId="+obj.liveId+"&recordId="+obj.recordId;
                            }else{
                                window.location.href = "//www.allinmd.cn/pages/conference/conference_live.html?authority="+obj.authority+"&conSubId=" + obj.conSubId + "&conId=" + ccLive.data.conId + "&userId=" + obj.userid + "&roomId="+obj.roomid+"&back=0";
                            }
                        };
                        jumOther();

                    });

                } else { //秀分会场日程
                    //非PC端跳手机版 为了取标题
                    if (!comm.equipment.IsPC()) {
                        if(ccLive.data.liveId){
                            window.location.href = "//m.allinmd.cn/pages/conference/conference_live.html?authority="+ccLive.data.authority+"&conSubId=" + $.getUrlParam("conSubId") + "&conId=" + $.getUrlParam("conId") + "&userId=" + $.getUrlParam("userid") + "&roomId="+ccLive.data.roomid+"&back="+ccLive.data.back+"&liveId"+ccLive.data.liveId+"&recordId="+ccLive.data.recordId;
                        }else{
                            window.location.href = "//m.allinmd.cn/pages/conference/conference_live.html?authority="+ccLive.data.authority+"&conSubId=" + $.getUrlParam("conSubId") + "&conId=" + $.getUrlParam("conId") + "&userId=" + $.getUrlParam("userid") + "&roomId="+ccLive.data.roomid+"&back="+ccLive.data.back;
                        }
                        return false;
                    }
                    isForeign(
                        function () {
                            isValidAuth("/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html");
                        });
                    var process = function () {
                        var kv = data.data_list[0].menu_list_agenda;
                        var html = "", tempDate = "", arrDate = [];
                        document.title = data.data_list[0].conSubName + "直播-唯医,allinmd";
                        $(".ev-currColumn").text(data.data_list[0].conSubName);

                        function template(i, el) {
                            var addClass = 'style="color:#999;font-weight: normal;"';
                            if (i == 0) {
                                addClass = "";
                            }
                            return "<li class=\"on ev-conSubListDate cursor\" " + addClass + ">" + el.start_time + "</li>";
                        };

                        var tDate = [];  //默认日期位置
                        var showAgenda = 1;
                        $.each(kv, function (i, el) {

                            //showAgenda = el.ConferenceAgenda[0].isOnline;
                            if (showAgenda) {
                                tempDate += template(i, el);
                                tDate.push(Date.parse(el.start_time.replace(/-/g,'/')));

                                $.each(el.ConferenceAgenda, function (j, ele) {
                                    html += conSubListTemplate(i, ele, el.start_time);
                                });
                            }
                        });

                        //给日程加事件切换
                        $(".time_title").html(tempDate).find("li").on("click", function () {
                            $(this).removeAttr("style").siblings().css({"color": "#999", "font-weight": "normal"});

                            $(".ev-conSubList>li").hide();
                            $("[date=" + $(this).text() + "]").show();
                        });
                        ////console.log(html);
                        $(".ev-conSubList").html(html);


                        //获取当前时间
                        var MDY = new Date();
                        var Month = MDY.getMonth() + 1;
                        var Day = MDY.getDate();
                        var Year = MDY.getFullYear();

                        var pjDate = Year + "-" + (Month.toString().length > 1 ? Month : "0" + Month) + "-" + (Day.toString().length > 1 ? Day : "0" + Day);
                        var MDYTime = Date.parse(pjDate.replace(/-/,"/"));

                        //设置当前日程或大于当前日程
                        var citeDate = "";
                        var sign = false;
                        for (var k = 0; k < tDate.length; k++) {
                            if (tDate[k] >= MDYTime) {
                                $(".time_title li:eq(" + k + ")").click();
                                sign = true;
                                return false;
                            }
                        }


                        if (!sign) {
                            var len = $(".time_title").find("li").length;
                            $(".time_title li:eq(" + (len - 1) + ")").click();
                        }
                    }
                        process();
                }

                if ($(".time_title").find("li").length === 1) {
                    $(".time_title").find("li").click();
                }
            }

            function ajaxList(url, params, obj, src) {
                $.ajax({
                    url: url,
                    type: "POST",
                    data: params,
                    success: function (data) {
                        if (data != null && data.responseObject.responseStatus){
                            listCtrl(data.responseObject.responseData, src, obj);
                        }
                        //window.location.href = obj.conListPath; //直接跳回直播列表
                    }
                })
            }

            var params = {};
            //conSubType:1-分会,2-卫星会;
            //is_online:'是否在线直播(0-不直播、1-展视互动-直播、2-厂商-直播、3-展视互动-回播；)',
            //conId:'会议id';
            //conIdList: 会议id串

            var conListURL = PC_CALL + "conference/index/getAllSubConferenceListV2/"; //分会场列表
            //todo 测试参数注释
            params.paramJson = $.toJSON({conId: t.data.conId}); //分会场参数
            //params.paramJson = $.toJSON({conId : 1510046676014, isOnline: 1}); //分会场参数

            ajaxList(conListURL, params, obj, "con");

            var conSubListURL = PC_CALL + "conference/index/getConferenceAllDateList/"; //分会场日程
            //todo 测试参数注释
            params.paramJson = $.toJSON({conSubId: t.data.conSubId, pageIndex: 1, pageSize: 100}); //分会场日程参数
            //params.paramJson = $.toJSON({conSubId : 707,pageIndex:1,pageSize:100}); //分会场日程参数
            ajaxList(conSubListURL, params, obj, "conSub");
            return t;
        }
    };
    ccLive.init();
});
/*window.ALLOW_SPEAK_INTERACTION = false;
DWLive.onRoomSetting = function (data) {
    window.ALLOW_SPEAK_INTERACTION = data.allow_speak_interaction == "true";
    if (window.RECONNECTING && window.ALLOW_SPEAK_INTERACTION) {
        window.RECONNECTING = false;
        return;
    }

    if (!live.interaction.isSupportInteraction()) {
        return;
    }


    // 允许语音通话
    if (data.allow_speak_interaction == "true") {

    } else {
        // 断开语音通话
        DWLive.hangupInteraction();
    }
};
window.on_cc_live_interaction_cancal = function(){
    //////console.log("取消");
}*/
/*
window.on_cc_live_interaction_interval = function(){
    //////console.log(":触发");
}
window.on_cc_live_interaction_disconnect = function () {
    //////console.log('断开连接')
};*/
