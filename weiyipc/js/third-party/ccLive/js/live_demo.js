/*
* create By ZhangHeng on 2018/1/10
*/
$(document).ready(function () {
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
            onHandUp: $("#gs-handup-countdown")
        },
        data: {
            backOnOff: parseInt(comm.getpara().back, 10) === 1,
            userid: comm.getpara().userid,
            roomid: comm.getpara().roomid,
            conId: comm.getpara().conId,
            conSubId: comm.getpara().conSubId,
            ownerid: comm.getpara().ownerid,
            audioOnOff: false,
            User: {},
            viewername: $("#sesNickname").val()+'_'+$("#sesCustomerId").val()+'_1_'+comm.getpara().conId,
            'regionEmotion': "//other.allinmd.cn/gensee/image/emotion/",
            emotion: {
                emotionList: [
                    'emotion.smile.gif', 'emotion.goodbye.gif', 'emotion.laugh.gif',
                    'emotion.cry.gif', 'emotion.angerly.gif', 'emotion.nod.gif',
                    'emotion.lh.gif', 'emotion.question.gif', 'emotion.bs.gif',
                    'rose.up.png', 'rose.down.png', 'chat.gift.png',
                    'feedback.quickly.png', 'feedback.slowly.png',
                    'feedback.agreed.png', 'feedback.against.gif',
                    'feedback.applaud.png', 'feedback.think.png'
                ]
            }
        },
        init: function () {
            var t = this;
            console.log(t.data.viewername)
            if (t.data.backOnOff) {
                t.backVideoInit().disableChat().receiveMsg().getUserInfo().changeVideoDoc().processInit();
            } else {
                t.videoInit().getUserInfo().chatInit().receiveMsg().onlineNum().changeVideoDoc().processInit();
            }

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
                return {f: hasFlash, v: flashVersion};
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
        backVideoInit: function () {
            // 回放SDK参数配置
            var t = this;

            $.DW.config({
                userId: '0438CD3A0AB20794',
                roomId: 'C837DF69777B32DC9C33DC5901307461',
                liveId: 'B39910985A75A185',
                viewername: 'websdk',
                viewertoken: '111',
                recordid: '9B3852E651CCA0E4'
            });
            console.log($.DW)
            var showVideo = setInterval(function () {
                if ($("#playbackPlayer").children().length) {
                    $(".Ev-Show").show();
                    console.log(console.log(window.on_cc_callback_pages));

                    clearInterval(showVideo);
                }
            }, 1000);

            return t;
        },
        videoInit: function () {
            var t = this;
            if (!t.flashState()) {
                $("#livePlayer").html('<object type="application/x-shockwave-flash"' +
                    '                               data="your-flash-file.swf"' +
                    '                               width="100%" height="100%">' +
                    '                          <param name="movie" value="your-flash-file.swf" />' +
                    '                           <param name="quality" value="high"/>' +
                    '</object>')
            } else {
                DWLive.init({
                    userid: t.data.userid,
                    roomid: t.data.roomid,
                    viewername: '萤火虫_227342010941_1_' + t.data.conId,
                    viewertoken: 'nothing',
                    viewercustomua: 'web-pc'
                });
            }
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


                $("#ifr-2").animate({
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
                $("#ifr-2").animate({
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
            DWLive.onUserCountMessage = function (data) {
                t.el.onLineNum.html(data);
            };
            return t;
        },
        toggleTeacherList: function () {
            //展示讲师列表
            var t = this;
            t.el.toggleTeacher.off("click").on("click", function () {
                t.el.teacherBox.toggle(400);
            });
            t.el.teacherBox.find("li").off("click").on("click", function (e) {
                var item = $(this);
                e.stopPropagation();
                t.el.teacherBox.hide(400);
                t.el.sendRole.html(item.text()).attr({
                    "data-role": item.attr("data-role"),
                    'data-id': item.attr("data-id")
                });
                return false;
            });
            return t;
        },
        phizInit: function () {
            //展示比起表情包
            var t = this;
            t.el.phizBtn.off("click").on("click", function () {
                t.el.phizList.toggle(400);
            });
        },
        hideOtherPanel: function () {
            //当点击其他界面时把表情包，在线的人员列表收起来
            var t = this;
            $("body").on("mousedown", function (e) {
                var element = $(e.target);
                var isNotTarget = element.hasClass("teacher-list") || element.hasClass("phiz-list") || element.hasClass("name");
                if (!isNotTarget) {
                    t.el.teacherBox.hide(400);
                    t.el.phizList.hide(400);
                }
            });
            return t;
        },
        assembleEmotion: function () {
            //将表情域名和名字链接起来
            var t = this;
            var arr = [];
            $.each(t.data.emotion.emotionList, function (index, val) {
                val = t.data.regionEmotion + val;
                arr.push(val);
            });
            return arr;
        },
        emotionInit: function () {
            //初始化表情包
            var t = this;
            t.data.emotion.emotionList = t.assembleEmotion();
            var myTemplate = Handlebars.compile($("#al-tpl-emotion").html());
            t.el.phizList.html(myTemplate(t.data.emotion));
            t.selectEmotion();
        },
        selectEmotion: function () {
            //选中表情后的操作
            var t = this;

            function produceEmotion(data, index) {
                return '<img src="' + data + '" data-resource="' + index + '">';
            }

            $(".phiz-item").off("mousedown").on("mousedown", function () {
                var element = $(this);
                var index = element.index();
                t.el.sendBar.append(produceEmotion(t.data.emotion.emotionList[index], index));
            })
        },
        filterHtml: function (str) {
            var reTag = /<img(?:.|\s)*?>/g;
            var machResult = str.match(reTag);
            var lastResult = {};
            var contentPara = [];
            if (machResult) {
                for (var num = 0; num < machResult.length; num++) {
                    var l = machResult[num];
                    str = str.replace(l, "$" + l + '$');
                }
                var arr = (str.replace(/\$+/g, "$")).split("$");
                for (var innerNum = 0; innerNum < arr.length; innerNum++) {
                    if (arr[innerNum].indexOf("img") > -1) {
                        contentPara.push($(arr[innerNum]).attr("src"));
                    } else {
                        var item = $('<p>' + arr[innerNum] + '</p>').text();
                        if (item.length) {
                            contentPara.push(item);
                        }

                    }
                }
                lastResult = {
                    type: 1,
                    contentData: contentPara
                }

            } else {
                lastResult = {
                    type: 0,
                    contentData: [str]
                };
            }
            var lastResultStr = '';
            $.each(lastResult.contentData, function (i, v) {
                if ((v.indexOf("img") > -1) || (v.indexOf("gif") > -1) || (v.indexOf("png") > -1) || (v.indexOf("jpg") > -1) || (v.indexOf("jpeg") > -1)) {
                    lastResultStr += '[' + v + ']';
                } else {
                    lastResultStr += v;
                }
            });
            return lastResultStr;
        },
        analysisMsg: function (msg) {
            var str = '';
            var lastResult = '';
            if ((msg.indexOf("[") > -1) && (msg.indexOf("]") > -1)) {
                str = msg.replace(/\[/g, '[]').replace(/\[\]/g, '&').replace(/\]/g, '[]').replace(/\[\]/g, '&');
                var dataList = str.split('&');
                for (var num = 0; num < dataList.length; num++) {
                    var item = dataList[num];
                    if (item.length) {
                        if ((item.indexOf("gif") > -1) || (item.indexOf("png") > -1) || (item.indexOf("jpg") > -1) || (item.indexOf("jpeg") > -1)) {
                            lastResult += '<img src="' + item + '"/>';
                        } else {
                            lastResult += item;
                        }
                    }
                }
            } else {
                lastResult = msg;
            }
            return lastResult;
        },
        chatSend: function (msg) {
            var t = this;
            var role = parseInt(t.el.sendRole.attr("data-role"), 10);
            if (role === 0) {
                //发送公聊
                DWLive.sendPublicChatMsg(msg);
            } else {
                //发送私聊
                // console.log("私聊",t.el.sendRole.attr("data-id"),t.el.sendRole.text(),msg);
                DWLive.sendPrivateChatMsg(t.el.sendRole.attr("data-id"), t.el.sendRole.text(), msg);
            }
            t.el.sendBar.html("");//将输入栏清空
        },
        receiveMsg: function () {
            var t = this;
            var msgAppend = function (m) {
                // console.log(m);
                var data = JSON.parse(m);
                // console.log(data)
                t.el.msgList.append(t.templateMsgItem(data));
            };
            var privateAccept = function (msg) {
                //接受所有私聊消息
                msg = JSON.parse(msg);
                console.log(msg);
                var nowData = {
                    userid: msg.fromuserid,
                    username: msg.fromusername,
                    msg: msg.msg,
                    time: msg.time
                };
                // console.log(nowData)
                msgAppend(JSON.stringify(nowData));
            };
            if (t.data.backOnOff) {
                window.on_cc_live_chat_msg_sync = function (msg) {
                    console.log(msg);
                    for (var num = 0; num < msg.length; num++) {
                        msgAppend(JSON.stringify(msg[num]));
                    }

                };
                window.on_cc_live_qa_question = function (msg) {
                    console.log(msg);
                    for (var num = 0; num < msg.length; num++) {
                        msgAppend(JSON.stringify(msg[num]));
                    }
                }
            } else {
                DWLive.onPublicChatMessage = function (msg) {
                    //三端可以相互接收消息，web端目前可以是表情和文本，app是文本，
                    msgAppend(msg);
                };

                DWLive.onPrivateAnswer = function (msg) {
                    privateAccept(msg);
                };
                DWLive.onPrivateChatMessage = function (msg) {
                    privateAccept(msg);
                };
            }

            return t;
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
                ownerid: comm.getpara().ownerid,
                conListPath: window.location.href
            };

            /*var obj = {
                conId : 1510046676014,
                conSubId : 707,
                ownerid : 'd9f5afb802fa4516a7acfdf260f6a05b',
                conListPath : window.location.href
            };*/
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

            function isValidAuth(callBackUrl, conSubId) {//验证规则是否能够观看
                function authority(rs) {
                    var subId = conSubId ? conSubId : $.getUrlParam("conSubId"),
                        data = rs.responseObject.responseData.data_list && rs.responseObject.responseData.data_list[0].menu_data_list,
                        authority = 0;

                    //获取当前所需权限 观看权限(1所有、2登录、3认证、4caos缴费)
                    if (data) {
                        $.each(data, function (i, el) {
                            if (el.id == subId) {
                                authority = el.authority;
                                $("#peopleNum").text(el.browseNum);
                            }
                        });
                    }

                    //如果未匹配到数据配置的分会场信息，则回首页
                    var _href = this.backURL;

                    if (_href.indexOf('live-wrap.html') > -1) {//todo 如果是从手机直播页跳转过来的，未登录会一直跳H5页，再跳回当前页，死循环
                        _href = '/';
                    }
                    if (!authority) window.location.href = _href;

                    //是否登录/认证
                    var isLogin = $.trim($("#sesCustomerId").val()).length !== 0 ? true : false;
                    var isAuth = $.trim($("#sesAuth").val());
                    if (isAuth == 2 || isAuth == 7 || isAuth == 8 || isAuth == 9) isAuth = true; else isAuth = false;
                    // 匹配结果
                    switch (authority) {
                        case 1:
                            break;															//所有
                        case 2:
                            if (!isLogin) {
                                window.location.href = _href;
                            }
                            break; //登录
                        case 3:
                            if (!isAuth) {
                                window.location.href = _href;
                            }
                            break; //认证
                        case 4:
                            break;
                        default:
                            window.location.href = _href;
                    }
                }

                var data = {};
                data.paramJson = $.toJSON({conId: $.getUrlParam("conId")});
                $.ajax({
                    url: PC_CALL + "conference/index/getAllSubConferenceListV2/",
                    type: "POST",
                    data: data,
                    backURL: callBackUrl
                }).done(authority);

                // getBrowseNum();
            }

            function conListTemplate(el) { //分会场列表模版
                el.userId = '0438CD3A0AB20794';
                return '<li data-userid="' + el.liveId + '" data-conSubId="' + el.id + '" data-conSubRoom="' + el.conSubRoom + '" data-userid="' + el.userId + '">' + el.conSubName + '</li>';
            }

            function listCtrl(data, src, obj) { //数据控制
                if (src === "con") { //多会场
                    var kv = data.data_list[0].menu_data_list;

                    //非PC端跳手机版 为了取标题
                    if (!comm.equipment.IsPC()) {
                        window.location.href = "//m.allinmd.cn/pages/conference/live-wrap.html?conSubId=" + $.getUrlParam("conSubId") + "&conId=" + $.getUrlParam("conId") + "&liveId=" + $.getUrlParam("userid") + "&token=333333";
                        return false;
                    }

                    var showAgenda = 0, html = "";
                    $.each(kv, function (i, el) {
                        //showAgenda = el.ConferenceAgenda[0].isOnline;
                        //if(showAgenda){
                        if (el.id == obj.conSubId) {
                            document.title = el.conSubName + "直播会场-唯医,allinmd";
                            $(".ev-currColumn").text(el.conSubName);
                            $(".ev-currColumn").attr("data-userid", el.liveId);
                            $(".ev-currColumn").attr("data-conSubId", el.conSubId);
                        } else {
                            html += conListTemplate(el);
                        }
                        //}
                    })

                    $(".ev-conList").html(html).find("li").off("click").on("click", function () {//主导航
                        obj.conSubId = $(this).attr("data-conSubId");
                        obj.userid = $(this).attr("data-userid");
                        obj.userid = $(this).attr("data-userid");
                        obj.roomid = $(this).attr("data-consubroom");

                        GlobalOneStatusBrowse = true;
                        isForeign(function () {
                            return false;
                        }, function () {
                            isValidAuth("/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html", obj.conSubId);
                        });
                        var jumOther = function () {
                            //changeVideo(obj);
                            //TODO:为了方便记录观看人数点击需要刷新页面
                            var otherHref = "/pages/channel/conference/multi-conference/live.html?userid=" + obj.userid + "&conId=" + $.getUrlParam("conId") + "&conSubId=" + obj.conSubId + "&roomid=" + obj.roomid;
                            window.location.href = otherHref;
                        };
                        jumOther();
                        /*if(!isForeign()) */

                    });

                } else { //秀分会场日程
                    //非PC端跳手机版 为了取标题
                    if (!comm.equipment.IsPC()) {
                        window.location.href = "//m.allinmd.cn/pages/conference/live-wrap.html?conSubId=" + $.getUrlParam("conSubId") + "&conId=" + $.getUrlParam("conId") + "&userid=" + $.getUrlParam("userid") + "&token=333333";
                        return false;
                    }
                    isForeign(
                        function () {
                            isValidAuth("/html/conference/" + $.getUrlParam("conId") + "/1/meeting_index.html");
                        });
                    var process = function () {
                        var kv = data.data_list[0].menu_list_agenda;
                        var html = "", tempDate = "", arrDate = [];
                        $("title").text(data.data_list[0].conSubName + "直播-唯医,allinmd");
                        $(".ev-currColumn").text(data.data_list[0].conSubName);

                        function template(i, el) {
                            var addClass = 'style="color:#999;font-weight: normal;"';
                            if (i == 0) {
                                addClass = "";
                            }

                            return "<li class=\"on ev-conSubListDate cursor\" " + addClass + ">" + el.start_time + "</li>";
                        };

                        var tDate = [];  //默认日期位置
                        var showAgenda = 0;
                        $.each(kv, function (i, el) {

                            showAgenda = el.ConferenceAgenda[0].isOnline;
                            if (showAgenda) {
                                tempDate += template(i, el);

                                tDate.push(new Date(el.start_time).getTime());

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

                        $(".ev-conSubList").html(html);


                        //获取当前时间
                        var MDY = new Date();
                        var Month = MDY.getMonth() + 1;
                        var Day = MDY.getDate();
                        var Year = MDY.getFullYear();

                        var pjDate = Year + "-" + (Month.toString().length > 1 ? Month : "0" + Month) + "-" + (Day.toString().length > 1 ? Day : "0" + Day);
                        var MDYTime = new Date(pjDate).getTime();

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
                        if (data != null && data.responseObject.responseStatus) listCtrl(data.responseObject.responseData, src, obj);
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
            params.paramJson = $.toJSON({conId: t.data.conId, isOnline: 1}); //分会场参数
            //params.paramJson = $.toJSON({conId : 1510046676014, isOnline: 1}); //分会场参数

            ajaxList(conListURL, params, obj, "con");

            var conSubListURL = PC_CALL + "conference/index/getConferenceAllDateList/"; //分会场日程
            //todo 测试参数注释
            params.paramJson = $.toJSON({conSubId: t.data.conSubId, pageIndex: 1, pageSize: 100}); //分会场日程参数
            //params.paramJson = $.toJSON({conSubId : 707,pageIndex:1,pageSize:100}); //分会场日程参数
            ajaxList(conSubListURL, params, obj, "conSub");
            return t;
        },
        templateMsgItem: function (msg) {
            var t = this;
            var userid = msg.userid;
            var username = msg.username;
            // console.log(msg)
            var msgContent = msg.msg;
            var cuName = (username.indexOf("_") > -1) ? username.split("_")[0] : username;
            var time = msg.time;
            var timeClass = (time.length) ? "" : "hide";
            return '<li class="my-msg">' +
                '<i class="msg-time ' + timeClass + '">' + time + '</i>' +
                '<span uid="' + userid + '" class="role-me name" style="text-decoration: underline; padding-left:0;">' + cuName + ((!t.data.backOnOff && (DWLive.viewerid === userid)) ? "(我)" : "") + '</span>' +
                '说：' +
                t.analysisMsg(msgContent) +
                '</li>';
        },
        chatSubmit: function () {
            var t = this;
            t.el.sendBtn.off("click").on("click", function () {
                var sendTxt = t.el.sendBar.html();
                var sendOnOff = sendTxt.length;//有消息的时候才发送
                if (sendOnOff) {
                    t.chatSend(t.filterHtml(sendTxt));
                }
            });
            t.el.handUp.off("click").on("click", function (e) {
                if (!t.data.audioOnOff) {
                    var timeCount = 60;
                    t.data.audioOnOff = true;
                    console.log({
                        video: false,
                        audio: true
                    });

                    DWLive.requestInteraction({
                        video: false,
                        audio: true
                    });

                    var handTimer = null;
                    window.on_cc_live_accept_interaction = function () {
                        handTimer = setInterval(function () {
                            if ((timeCount <= 60) && (timeCount >= 0)) {
                                t.el.onHandUp.text('(' + (timeCount--) + ')');
                            } else {
                                t.el.onHandUp.text('');
                                t.data.audioOnOff = false;
                                DWLive.hangupInteraction();
                                clearInterval(handTimer);
                                handTimer = null;
                            }
                        }, 1000);
                    };
                    window.on_cc_live_interaction_disconnect = function () {
                        t.el.onHandUp.text('');
                        handTimer = null;
                    };

                } else {
                    return false;
                }
            });
        },
        chatInit: function () {
            //初始化聊天界面
            var t = this;
            DWLive.onOnlineTeachers = function (data) {//获取讲师列表
                var myTemplate = Handlebars.compile($("#al-tpl-teachers").html());
                var template = '<li style="font-weight: bold" class="all-people" data-role="0"><a href="javascript:;">所有人</a></li>';
                t.el.teacherBox.find('ul').html(template + myTemplate(data));
                t.toggleTeacherList();
            };
            t.hideOtherPanel();
            t.phizInit();
            t.emotionInit();
            t.chatSubmit();
            return t;
        }
    };
    ccLive.init();
});