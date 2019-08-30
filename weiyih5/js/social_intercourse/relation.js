/***
 * A他人，B自己
 * 1) 悬浮(文库) 单击一次出现 分享、收藏、赞、设置
 *             (病例) 一直浮动 / B 回复、分享、收藏、赞  / A 回复、分享、收藏、赞、关注
 *                    （此处只出四个，到Ａ时显示）回复、分享、收藏、... 单击...时再弹出一个对话框中显示赞、关注
 *                      下拉到一定程序，归位到页面中出现的位置
 *
 * 2) 最新回复列表(查看对话(有对话时显示，没有不显示 不在这儿做)、赞96、 回复)
 *
 * 3) 视频在视下方有 评论(锚点)、收藏、赞、分享
 * $("#EQ_videoRelation").relation({type:4,anchor:$("#replyAnchor")});
 *
 * isFloat:true,isFloatDisappear:true,floatClick:true,disappearPlace:$("#testDisappear")
 *
 * 应用提示：
 * 在一个页面同时调用列表与悬浮时，应用排序：列表>悬浮
 *
 * 格式：
 * 视频：
 * $("#EQ_videoRelation").relation({type:4,refId:parseInt($("#resourceId").val()),relationType:parseInt($("#relationType").val()),anchor:"reply",isFixedChat:true});
 *
 *
 * 分享
 * 整体遮罩
 *
 * 回复（某人appSomeReply）、更多(appMore)  ++
 *
 * //被关注者的id  因病例终端页会生成静态，所以要给病例终端页设置隐藏refId
 *
 *
 * h5_detail , anchor:$("#replyAnchor")
 *
 * */

(function ($) {

    $.fn.extend({
        "relation": function (options) {
            //alert("localSchema" + localStorage.readSchema);
            var fontSize = parseInt($(".setting-font-size").css("font-size"));
            $('head').find('link[href="/js/social_intercourse/night.css"]').remove();
            if(fontSize==undefined || isNaN(fontSize)){
                fontSize = parseInt($(".case_detail_cont").css("font-size"));
            }
            //alert("font-size" + fontSize);
            s = $.extend({
                t: this,
                isFloat: false, // 是否悬浮
                isFloatDisappear: false, //悬浮到一定程度消失 与disapperPlace依赖关系
                disappearPlace: null, //消失的位置 指按钮
                reviewDisappearPlace: null, //指回复框
                parentReviewDisappearPlace: null,//回复框的原位置
                docSetPlace: null,//文档设置位置
                floatClick: false, // 单击一次后出现浮动
                type: "type", //采用类型 1文库 2b1病例(自己) 2b2病例(他人) 3列表 4视频
                anchor: null,  //锚点元素 d模版期待
                isFixedChat: false, //是否显示我来说两句
                isNeverFixedChat: false, //始终浮动说两句
                isList : false, //是否列表进来
                isIgnoreFontSize : false,//初始化时是否忽视字体大小改变
                nigthFileName: "/js/social_intercourse/night.css",
                smallFont: 0.8, //小字体
                bigFont: 1.2, //大字体
                nullFn : false,
                //
                cid: 0, //被访人id --(客户id)
                //uid : 0, //当前人id 这个从缓存中取
                refCustomerId:$("#authCustomerId").val(),//资源发布人ID
                refId: 0, //资源id
                /**以下三个 type一样，统一用relationType代替**/
                //收藏期待值 collectionType : 0, //收藏类型：1-视频、2-文库 3-会议
                //赞期待值 userfulType : 0, //userfulType 类型：1-视频 2-文库 3-会议 4-  upDownType  1-赞 2-踩
                //回复期待值 reviewType : 0, //评论类型：1-视频 2-文库 3-会议
                relationType: 0,

                reviewId: 0,//当前条目的id
                //reviewType : 0,

                templateStyle: "",//模版
                //caseRefId : 1402881975175, // 接入病例页中的refId即病例作者customer_id;
                reviewStatus: 1,//评论状态：1-发布 2-取消 3-草稿  固定
                parentId: 0,//父ID  针对资源作0 针对回复传被回复记录的id
                //列表期待值
                listIsChat: false, //是否显示闲谈
                listPraiseTotal: 0 //赞数量
            }, options);

            img = {
                praiseSmallDefault : "//img50.allinmd.cn/case/zan_small.png",
                praiseDefault: "//img50.allinmd.cn/case/f-default-praise.png",
                praiseBlueActive: "//img50.allinmd.cn/case/f-active-praise.png",
                praiseBlueDefault: "//img50.allinmd.cn/case/f-default-praise.png",

                collectDefault: "//img50.allinmd.cn/case/f-default-collect.png",
                collectBlueActive: "//img50.allinmd.cn/case/f-active-collect.png",
                collectBlueDefault: "//img50.allinmd.cn/case/f-default-collect.png"
            };


            var p = {
                //
                cid: s.cid,
                refId: s.refId,
                //列表
                listIsChat: s.listIsChat,
                listPraiseTotal: s.listPraiseTotal,

                reviewStatus: s.reviewStatus,
                parentId: s.parentId,
                reviewId: s.reviewId,
                //reviewType : s.reviewType

                relationType: s.relationType,
                disappearPlace: s.disappearPlace,
                reviewDisappearPlace: s.reviewDisappearPlace,
                parentReviewDisappearPlace: s.parentReviewDisappearPlace,

                isIgnoreFontSize : s.isIgnoreFontSize,
                isList : s.isList,

                docSetPlace: s.docSetPlace
            };

            var m = {
                achieve: function () {
                    var _this = this;
                    switch (s.type) {
                        case 1 : //文库
                            var status = true;
                            s.t.html(this.templateLibrary.a).find("li").on("vclick",function () {
                                if(status){
                                    status = false;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, true, this);
                                }else{
                                    status = true;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, false, this);
                                }
                            });

                            //初始化设置的状态
                            if (localStorage.readSchema != undefined) {
                                var arr = localStorage.readSchema.split(",");
                                var day = arr[0], font = arr[1];
                                if (font == 0) {
                                    $(".setting-font-size").css("font-size", s.bigFont*fontSize + "px")
                                }
                                else if (font == 2) {
                                    $(".setting-font-size").css("font-size", s.smallFont*fontSize + "px")
                                }
                            }else{
                                console.log(localStorage.readSchema);
                            }
                            break;
                        case 2 : //病例
                            var tempHtml;

                            if (s.cid == _this.commonFn.getUid()) {    //cid压根没传值
                                if (s.templateStyle == "blue") {
                                    tempHtml = _this.templateLibrary.b1;
                                } else {
                                    tempHtml = _this.templateLibrary.b11;
                                }
                            } else {
                                if (s.templateStyle == "blue") {
                                    tempHtml = _this.templateLibrary.b2;
                                } else {
                                    tempHtml = _this.templateLibrary.b21;
                                }
                            }
                            var statusArr=[true,true,true,true];
                            s.t.html(tempHtml).find("li").on("vclick",function () {
                                var _index = $(this).index();
                                if(statusArr[_index]) {
                                    statusArr[_index] = false;
                                    if ($(this).attr("identity") != undefined){
                                        _this.action[$(this).attr("identity")](_this, !statusArr[_index], this);
                                    }
                                }else{
                                    statusArr[_index] = true;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, !statusArr[_index], this);
                                }
                            });

                            break;
                        case 3 : //列表
                            var tempHtml = this.templateLibrary.c;
                            if (!p.listIsChat) {
                                var array = [];
                                array.push($(tempHtml)[1]);
                                array.push($(tempHtml)[2]);

                                var uid = localStorage.userId; //获取当人id
                                if(p.cid == uid){  //非当前人 删除
                                    array.push($(tempHtml)[3]);
                                }
                                tempHtml = array;
                            }else{
                                var array = [];
                                array.push($(tempHtml)[0]);
                                array.push($(tempHtml)[1]);
                                array.push($(tempHtml)[2]);

                                var uid = localStorage.userId; //获取当人id
                                if(p.cid == uid){  //非当前人 删除
                                    array.push($(tempHtml)[3]);
                                }
                                tempHtml = array;
                            }

                            var listStatus = true;


                            s.t.html(tempHtml).find(".h_c_look").off("tap").on("tap",function (e) {
                                window[0] = e;
                                if(listStatus){
                                    listStatus = false;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, true, this);
                                }else{
                                    listStatus = true;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, false, this);
                                }
                            });
                            break;
                        case 4 : //视频
                            var statusArr=[true,true,true,true];
                            s.t.html(this.templateLibrary.d).find("li").on("vclick",function (e) {
                                var _index = $(this).index();
                                if(statusArr[_index]){
                                    statusArr[_index]= false;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, !statusArr[_index], this);
                                }else{
                                    statusArr[_index]= true;
                                    if ($(this).attr("identity") != undefined) _this.action[$(this).attr("identity")](_this, !statusArr[_index], this);
                                }

                            });
                            break;
                    }

                    //没用
                    s.nullFn = true;

                    //是否浮动
                    if(s.isFloat && s.floatClick == false) _this.float();

                    //是否开启对话浮动
                    if(s.isFixedChat) _this.chatFloat();

                    //开启对话始终浮动在下方 放到all_reply.html中执行
                    //if(s.isNeverFixedChat) _this.neverChatFloat();

                    //单击一次会触发
//				touchstart:手指触摸屏幕上的时候触发 
//				touchmove:手指在屏幕上移动的时候触发 
//				touchend:手指从屏幕上拿起的时候触发 
//				touchcancel:系统取消touch事件的时候触发touchstart

//                    if (s.floatClick) { //启动单击消失和单击出现浮动
//                        var convert = true;
//                        //////////////////////////////
//                        //////////////////////////////
//                        $("section").on("touchstart", function () {
//                            convert = !convert;
//                            _this.float();
//                            if (convert) s.t.hide();
//                            else s.t.show();
//                        });
//                    }

                    //是否说两句
                    //$("#appRefReply").on("tap", function () {
                    //    _this.commonFn.checkLogin();
                    //});
                    //$("#appRefReply").keydown(function (e) {
                    //    if (e.keyCode == 13) {
                    //        var _tThis = this;
                    //        user.privExecute({operateType:'respond',callback:function() {
                    //            var params = {}, reviewContent = $(_tThis).find("textarea").val();
                    //            if (_this.commonFn.getCount($.trim(reviewContent)) < 5) {
                    //                popup("请至少输入5个字符!");
                    //                return false;
                    //            };
                    //            params.paramJson = $.toJSON({
                    //                customerId: _this.commonFn.getUid(),
                    //                reviewType: s.relationType,
                    //                reviewStatus: p.reviewStatus,
                    //                refId: p.refId,
                    //                parentId: 0,
                    //                reviewContent: reviewContent
                    //            });
                    //            _this.commonFn.ajax(_this.configUrl.reply, params);
                    //            $(_tThis).find("textarea").val("");
                    //
                    //            //require.js
                    //            if ($("#notDataTips").length == 1) {
                    //                $("#notDataTips").remove();
                    //            }
                    //            var webParams = {refId: s.refId, relationType: s.relationType}
                    //
                    //            if(location.pathname == "/html/pages/comm/all_reply.html"){
                    //                newReply($("#EQ_newReplyList"), webParams, "waterfall", "refresh");
                    //            }else{
                    //                newReply($("#EQ_newReplyList"), webParams, null, "refresh");
                    //                window.scrollTo($("#EQ_newReplyList").offset().left, $("#replyAnchor").offset().top);
                    //            }
                    //
                    //        }});
                    //
                    //        e.keyCode = 0;
                    //    }
                    //});

                    //仿锚点 改为直接弹出回复
                    $("#anchor").off("tap").on("tap", function () {
                        /* windowPop = $(window).scrollTop(); */
                        p.parentId=0;
                        _this.action.reply(_this, "anchor", this);

                    });

                    //对文档设置作初始化
                    //if(p.isIgnoreFontSize == false && s.isList == false){
                    if (localStorage.readSchema != undefined&&s.type==1) {
                        var ele, arr = localStorage.readSchema.split(",");
                        if(isNaN(arr[2])){
                            localStorage.readSchema = "0,1," + fontSize;
                            arr = localStorage.readSchema;
                        }

                        if (arr[0] == 0) {
                            var allsuspects = document.getElementsByTagName("link");
                            for (var i = 0, len = allsuspects.length; i < len; ++i) {
                                if (allsuspects[i].getAttribute("href") == s.nigthFileName)
                                    allsuspects[i].parentNode.removeChild(allsuspects[i]);
                            }
                        } else {
                            var oCss = document.createElement("link");
                            var allsuspects = document.getElementsByTagName("link");
                            oCss.setAttribute("rel", "stylesheet");
                            oCss.setAttribute("type", "text/css");
                            oCss.setAttribute("href", s.nigthFileName);
                            for (var i = 0, len = allsuspects.length; i < len; ++i) {
                                if (allsuspects[i].getAttribute("href") == s.nigthFileName)
                                    return false;
                            }
                            document.getElementsByTagName("head")[0].appendChild(oCss);
                            $('body').addClass('night');
                        }
                        //字体

                        if (arr[1] == 0) {
                            $(".setting-font-size").css("font-size", s.bigFont*fontSize + "px")
                        }
                        else if (arr[1] == 1) {
                            $(".setting-font-size").css("font-size", fontSize + "px")
                        }
                        else {
                            $(".setting-font-size").css("font-size",s.smallFont*fontSize + "px")
                        }
                    } else {
                        localStorage.readSchema = "0,1," + fontSize;
                    }
                    //}
                    //alert($(".setting-font-size").css("font-size"));
                },
                float: function () { //漂浮
                    //section[data-role=page]高度大于window.height
                    if($('section[data-role=page]').height()>$(window).height()){
                        s.t.addClass("pl_bottom").addClass("fixed").addClass("user-interact-box");
                    }else{
                        $("#float").removeClass("pl_bottom").removeClass("user-interact-box").removeClass("fixed");
                    }
                    if (s.isFloatDisappear) { //开启漂浮消失
                        $(window).on("scroll", function () {
                            var float = $("#float");
                            if ($(window).scrollTop() > ($(p.disappearPlace).offset().top - $(window).height())) {
                                float.removeClass("pl_bottom").removeClass("user-interact-box").removeClass("fixed");
                            } else {
                                if (float.attr("class").indexOf("pl_bottom") == -1) float.addClass("pl_bottom").addClass("fixed").addClass("user-interact-box");
                            }

                        });
                    }

                },
                /*chatFloat : function(){ //对话漂浮，场景视频终端页
                 $(window).on("scroll", function () {
                 if (s.reviewDisappearPlace != null) {
                 if ($(window).scrollTop() > ($(p.parentReviewDisappearPlace).offset().top) - $(window).height()) {
                 p.reviewDisappearPlace.addClass("comment_sr");
                 } else {
                 if (p.reviewDisappearPlace.attr("class") != undefined && p.reviewDisappearPlace.attr("class").indexOf("comment_sr") != -1) {
                 p.reviewDisappearPlace.removeClass("comment_sr");
                 }
                 }
                 }
                 });
                 },*/
                neverChatFloat : function(){ //对话一直固定在下方，应用全部评论
                    neverChatThis = s.t;
                    $(window).on("scroll",function(){
                        var cHeight = $(window).height();
                        var chatHeight = neverChatThis.height();
                        neverChatThis.css("top",cHeight-chatHeight);
                    })

                },
                templateLibrary: {
                    //采用类型
                    //1a文库
                    //2b1病例(自己蓝色版) 2b11病例(自己黑白版) 2b2病例(他人蓝色版) 2b21病例(他人黑白版) 2b3病例更多时触发
                    //3c列表 4d视频 5e查看对话 6f回复某人 7g1(白天版)文库设置 8h固定下方的我来说两句
                    a: "<ul>" +
                    "<li id=\"anchor\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-reply.png\"></li>" +
                    "<li identity=\"share\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-share.png\" /></li>" +
                        //"<li identity=\"praise\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-praise.png\" /></li>" +
                    "<li identity=\"collect\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-collect.png\" /></li>" +
                    "<li style=\"border-right:none\" identity=\"docSet\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-set.png\" /></li>" +
                    "</ul>",
                    b1: "<ul>" +
                    "<li id=\"anchor\"><img src=\"//img50.allinmd.cn/case/reply_blue.png\"></li>" +
                    "<li identity=\"praise\"><img src=\"//img50.allinmd.cn/case/praise_blue.png\"></li>" +
                    "<li identity=\"collect\"><img src=\"//img50.allinmd.cn/case/collect_blue.png\"></li>" +
                    "<li style=\"border-right:none\" identity=\"share\"><img src=\"//img50.allinmd.cn/case/share_blue.png\"></li>" +
                    "</ul>",
                    b11: "<ul>" +
                    "<li id=\"anchor\"><img src=\"//img50.allinmd.cn/case/hf_img.png\" />回复</li>" +
                    "<li identity=\"praise\" coloring=\"no\"><img src=\"//img50.allinmd.cn/case/zan_img.png\" />赞</li>" +
                    "<li identity=\"collect\" coloring=\"no\"><img src=\"//img50.allinmd.cn/case/sc_img.png\" />收藏</li>" +
                    "<li style=\"border-right:none\" identity=\"share\"><img src=\"//img50.allinmd.cn/case/fx_img.png\" />分享</li>" +
                    "</ul>",
                    b2: "<ul>" +
                    "<li id=\"anchor\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-reply.png\"></li>" +
                    "<li identity=\"praise\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-praise.png\"></li>" +
                    "<li identity=\"collect\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-collect.png\"></li>" +
                    "<li style=\"border-right:none\" identity=\"share\"><img class=\"imgSize\" src=\"//img50.allinmd.cn/case/f-default-share.png\"></li>" +
                    "</ul>",
                    b21: "<ul>" +
                    "<li id=\"anchor\"><img  src=\"//img50.allinmd.cn/case/f-default-reply.png\"></li>" +
                    "<li identity=\"praise\"><img  src=\"//img50.allinmd.cn/case/f-default-praise.png\"></li>" +
                    "<li identity=\"collect\"><img  src=\"//img50.allinmd.cn/case/f-default-collect.png\"></li>" +
                    "<li style=\"border-right:none\" identity=\"share\"><img src=\"//img50.allinmd.cn/case/f-default-share.png\"></li>" +
                    "</ul>",
                    b3: "<div class=\"cover\"></div>" +
                    "<div class=\"case_more\" id=\"appMore\">" +
                    "<div class=\"zz_but\">" +
                    "<div class=\"pingbi\" innerId=\"praise\">赞</div>" +
                    "<div class=\"pingbi\" innerId=\"follow\">加关注</div>" +
                    "<div class=\"pingbi\"><a id=\"editCase\" href=\"/html/pages/case/case_upload.html?caseId="+ p.refId+"\" data-ajax=\"false\" style=\"color:#666666\">编辑病例</a></div>" +
                    "<div class=\"qx_but\" innerId=\"clear\"><img src=\"//img50.allinmd.cn/personal_v2/quxiao_but.png\"></div>" +
                    "</div>" +
                    "</div>",
                    c: "<div class=\"h_c_look look_dh\" identity=\"chat\">" +
                    "<div class=\"h01\"><img src=\"//img50.allinmd.cn/case/hh.png\"/></div><div class=\"h02\">查看对话</div>"+
                    "<div class=\"clear\"></div>" +
                    "</div>"+
                    "<div class=\"h_c_look look_comment_text\" identity=\"reply\">"+
                    "<div class=\"h04\"><img src=\"//img50.allinmd.cn/case/hf_small.png\"/></div>"+
                    "<div class=\"h02\">回复</div>"+
                    "<div class=\"clear\"></div>"+
                    "</div>"+
                    "<div class=\"h_c_look look_dianzan\" identity=\"praise\">"+
                    "<div class=\"h03\" coloring=\"small\"><img src=\"//img50.allinmd.cn/case/zan_img.png\"/></div>"+
                    "<div class=\"h02\" id=\"praiseNum\">"+p.listPraiseTotal+"</div>"+
                    "<div class=\"clear\"></div>"+
                    "</div>"+
                    "<div class=\"h_c_look look_delete\" identity=\"del_reply\">"+
                    "<div class=\"h04\"><img src=\"//img50.allinmd.cn/case/remove.png\" style=\"margin-top: 0.25em;\" /></div>"+
                    "<div class=\"h02\">删除</div>"+
                    "<div class=\"clear\"></div>"+
                    "</div>",
                    d: "<ul class=\"fix\">" +
                    "<li id=\"anchor\"><img style=\"width:50%\" src=\"//img50.allinmd.cn/case/f-default-reply.png\"></li>" +
                    "<li identity=\"praise\"><img style=\"width:50%\" src=\"//img50.allinmd.cn/case/f-default-praise.png\" /></li>" +
                    "<li identity=\"collect\"><img style=\"width:50%\" src=\"//img50.allinmd.cn/case/f-default-collect.png\"></li>" +
                    "<li style=\"border-right:none\" identity=\"share\"><img style=\"width:50%\" src=\"//img50.allinmd.cn/case/f-default-share.png\"></li>" +
                    "</ul>",
                    e: function (el) {
                        return "<li>" +
                            "<div class=\"chat_face\"><img src=\"" + el.logoUrl + "\" class=\"chat_line02\"></div>" +
                            "<div class=\"chat_content\">" +
                            "<div class=\"hot_c_name\">" + el.nickname + "</div>" +
                            "<div class=\"hot_c_time\">" + el.time + "</div>" +
                            "<div class=\"clear\"></div>" +
                            "<div class=\"hot_c_text\">" + el.content + "</div>" +
                            "<div class=\"hot_c_look\">" +
                            "<div class=\"h_c_look\">" +
                            "<div class=\"h04\"><img src=\"//img50.allinmd.cn/case/hf_small.png\"></div>" +
                            "<div class=\"h02\" data-id=\"" + el.id + "\">回复</div>" +
                            "<div class=\"clear\"></div>" +
                            "</div>" +
                            "</div>" +
                            "</div>" +
                            "<div class=\"clear\"></div>" +
                            "</li>";
                    },
                    f: "<div class=\"cover\"></div>" +
                    "<div class=\"comment_zz_content\" id=\"appSomeReply\">" +
                    "<div class=\"c_zz_top\">" +
                    "<div class=\"comment_close\"><img src=\"//img50.allinmd.cn/personal_v2/tc_close.png\" /></div>" +
                    "<div class=\"comment_zz_text\">回复</div>" +
                    "<div class=\"comment_true\"><img src=\"//img50.allinmd.cn/personal_v2/tc_true.png\" /></div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"comment_input\">" +
                    "<textarea id=\"replyContent\"placeholder=\"\" style=\"font-size: 1.75em;\"></textarea>" +
                    "</div>" +
                    "</div>",
                    g1: "<div class=\"cover\"></div>" +
                    "<div class=\"doc_qh\">" +
                    "<div class=\"tc_close_case\" id=\"docSetClose\"><img src=\"//img50.allinmd.cn/doc/close.png\"></div>" +
                    "<div class=\"doc_qh_top\">" +
                    "<div class=\"yd_ms\">阅读模式</div>" +
                    "<div class=\"font_size\">字体大小</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"doc_qh_bottom\">" +
                    "<div class=\"yd_ms_qh\">" +
                    "<div class=\"qh_click\" id=\"set_daytime\">白天</div>" +
                    "<div class=\"qh_normal\" id=\"set_night\">夜间</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"font_size_qh\">" +
                    "<div class=\"font_size_normal\" id=\"set_bigFont\">大</div>" +
                    "<div class=\"font_size_click\" id=\"set_font\">中</div>" +
                    "<div class=\"font_size_normal\" id=\"set_smallFont\">小</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "<div class=\"clear\"></div>" +
                    "</div>" +
                    "</div>",
                    //h: "<div class=\"comment_sr\" id=\"appRefReply\">" +
                    //"<div class=\"c_text_input\">" +
                    //    "<textarea id=\"fixedChat\" class=\"ssvk\" type=\"text\" placeholder=\"我来说几句...\" /></textarea>" +
                    //"</div>" +
                    //"</div>",
                    i : "<div id=\"cancel_mask\" style=\"display:block;\">"+
                    "<div class=\"jxl_mask\" style=\"position:fixed;\"></div>"+
                    "<div class=\"jxl_want\" id=\"replyWindow\">"+
                    "<div class=\"jxl_want_top\"><div style=\"margin-top: 1em;font-size: 1.2em;\">删除评论</div><div style=\"margin-top: 1em;\">确定要删除这条评论？</div></div>"+
                    "<div class=\"jxl_want_bottom\">"+
                    "<div class=\"jix_l\" id=\"cancel_window\">取消</div>"+
                    "<div class=\"jix_r\" id=\"confrim_window\">确定</div>"+
                    "<div class=\"clear\"></div>"+
                    "</div>"+
                    "</div>"+
                    "</div>"

                },
                action: { //事件
                    chat: function (t, useless, _this) {

                        //$(".chat_line").hide();

                        //隐藏所有浮动
                        if (s.isFloat) s.t.hide();
                        //隐藏回复框
                        //$("#appRefReplyParent").hide();

                        var paramJson = {
                            dataFlag: 3,
                            useFlag: 1,
                            logoUseFlag:3,
                            reviewType: s.relationType,
                            refId: p.refId,
                            currentReviewId: p.reviewId,
                            pageIndex: 1,
                            pageSize: 5
                            //isCurrentRow: 0
                        };

                        var count = 0, dataJson, data, parentId;
                        dataJson = t.commonFn.ajax(t.configUrl.chat, paramJson);
                        data = dataJson.responseObject.responseData;
                        t.commonFn.assist_DataController(data, $("#h5_detail"), t, count,paramJson);

                        paramJson.currentReviewId = function () {
                            if (!t.commonFn.isEmptyObject(data))
                                return dataJson.responseObject.responseData.data_list[0].customer_review.id;
                            else
                                return p.reviewId;
                        }

                        $("#h5_detail").on("swipeDown", function (e) {	//向上向下事件swipeDown scrollstart   #h5_detail
                            if ($(this).attr("scrollLock") != "true") {
                                $("#waterfall_chat", this).prepend("<div class=\"comment_top\">向下滑动加载更多</div>");
                                $(this).attr("scrollLock", false);
                                count++;
                                dataJson = t.commonFn.ajax(t.configUrl.chat, paramJson);
                                data = dataJson.responseObject.responseData;
                                if (data.data_list.length < paramJson.pageSize) {
                                    $(this).attr("scrollLock", true);
                                }
                                t.commonFn.assist_DataController(data, $("#h5_detail"), t, count,paramJson);
                            }
                        });

                        //var scrollStop = false;
                        //t.commonFn.waterfallPage(t.configUrl.chat,paramJson,$("#h5_detail"),t,scrollStop);

                        //查看当前人
                        $("#watchMe").live("vclick", function () {

                            var params = {
                                dataFlag: 3,
                                useFlag: 1,
                                logoUseFlag:3,
                                reviewType: s.relationType,
                                //customerId : parseInt($(_this).parent().attr("data-cid")),
                                //currentReviewId : p.reviewId,
                                refId: s.refId,
                                parentId: $(this).attr("data-id"),
                                pageIndex: 1,
                                pageSize: 20
                            };

                            var html = "", kv, dataJson = t.commonFn.ajax(t.configUrl.chat, params);
                            dataJson = dataJson.responseObject.responseData.data_list;
                            $.each(dataJson, function (i, el) {
                                kv = t.commonFn.adapterData(el);
                                html += "<li>" + $(t.templateLibrary.e(kv)).html() + "</li>";
                            });
                            $(this).parent().find("ul").find(".chat_content").removeClass("li_last_line");
                            $(this).parent().find("ul").removeClass("ul_bottom_line");

                            $(this).parent().find("ul").after(html);

                            //遍历添加事件
                            $.each($(this).parent().find("li"), function (i, el) {
                                if ($(el).attr("style") != undefined) {
                                    $(el).find(".h02").on("vclick", function () {
                                        $(".comment_tc,.cover").remove();
                                        t.action.reply(t, null, this);
                                    });
                                }
                            })

                            $(this).parent().find("li:eq(" + parseInt($(this).parent().find("li").length - 2) + ")").find(".chat_content").addClass("li_last_line");
                            $(this).remove();

                        });

                        $("#closeWindow").live("vclick", function (e) {
                            $("#h5_detail").attr("scrollLock", false);
                            $("#h5_detail").empty();
                            $(".comment_tc,.cover").remove();
                            //开启浮动
                            if (s.isFloat) s.t.show();
                            //显示回复框
                            //$("#appRefReplyParent").show();

                            document.body.style.overflow = 'auto';
                            window.isIscrollBind = false;
                            b.destroy();
                            $("body").off("vmousemove");

                            e.preventDefault();
                            e.stopPropagation();

                            return false;
                        })

                        return false;
                        event.preventDefault();
                        event.stopPropagation();
                    },
                    reply: function (t, useless, _this) {
                        var type = s.relationType;
                        var resourceId = p.refId;
                        var parentId = p.parentId;
                        var name = $(_this).parents(".hot_c_r").find(".hot_c_name").text();
                        if(name===""){
                            name = $(".user_fabu_sq .ui-link").text();
                            if(name===""){
                                name = $(".user-info-close .ui-link").text();
                            }
                        }
                        user.privExecute({
                            operateType: 'auth',   //'login','auth','conference'
                            callback: function () {
                                location.href = "/pages/common/comment.html?resourceId="+
                                resourceId +"&username="+ name +"&type=" + type + "&parentId=" + parentId+'&refCustomerId='+ s.refCustomerId;
                            }
                        });

                        return false;

                        //防IOS手机视频
                        if($("#MediaMask").length>0){
                            $("#MediaMask").hide();
                        }

                        //alert(t.commonFn.browser().webApp)//mobile    trident    presto  webApp  微信mobile webApp
                        var actionThis = this;
                        user.privExecute({operateType:'respond',callback:function(){
                            //t.commonFn.checkLogin();

                            if ($("#appSomeReply").length == 0) {
                                //清空来源是查看对话
                                $("#h5_detail").attr("scrollLock", false);
                                $("#h5_detail").empty();
                                $("body").removeAttr("style");

                                var params = {};
                                $("body").append(t.templateLibrary.f);
                                $("#replyContent").focus();
                                $("#appSomeReply").find(".comment_close").off("vclick").on("vclick", function (e) {
                                    //如果对话存在的话，不要清.cover
                                    if($("#waterfall_chat").length>0) $(".comment_zz_content").remove();
                                    else $(".cover,.comment_zz_content").remove();
                                    //防IOS手机视频
                                    if($("#MediaMask").length>0){
                                        $("#MediaMask").show();
                                    }

                                    document.body.style.overflow = 'auto';
                                    window.isIscrollBind = false;
                                    b.destroy();
                                    $("body").off("vmousemove");

                                    window.scrollTo(0, windowPop);

                                    e.stopPropagation();
                                    e.preventDefault();
                                    return false;

                                }).siblings(".comment_true").off("vclick").on("vclick", function () {
                                    var reviewContent = $.trim($(this).parent().parent().find("#replyContent").val());
                                    if(t.commonFn.getCount(reviewContent)<1){popup("请至少输入1个字符!");return false;};

                                    //提交回复 判断途径来源
                                    var parentId,refId;
                                    if ($(_this).attr("data-id") == undefined && $(_this).parent().parent().attr("data-cid") == undefined){ // &&
                                        parentId = 0;
                                        refId = $("#resourceId").val();
                                    }else{
                                        if($(_this).attr("data-id") == undefined){
                                            var str = $(_this).parent().attr("class")
                                            var strCuss = str.substring(str.lastIndexOf("_")+1);
                                            parentId = strCuss;
                                        }else{
                                            parentId = parseInt($(_this).attr("data-id"));
                                        }

                                        refId = p.refId;
                                    }

                                    params.paramJson = $.toJSON({
                                        customerId: t.commonFn.getUid(),
                                        reviewType: s.relationType,
                                        reviewStatus: p.reviewStatus,
                                        refId: refId,
                                        parentId: parentId,
                                        reviewContent: reviewContent
                                    });
                                    t.commonFn.ajax(t.configUrl.reply, params);

                                    //针对病例回复，评论数加1
                                    if($(".detail-reivew-num").length>0){
                                        $(".detail-reivew-num").text(parseInt($(".detail-reivew-num").text())+1);
                                    }

                                    //回复资源时执行去记录尾
                                    //if(parentId==0){ $(".down-arr").trigger("tap");}

                                    //移除回复
                                    //$(".cover,.comment_zz_content").remove();

                                    $(".cover,.comment_zz_content").animate({
                                        width : 10,
                                        height : 10,
                                        left :  100,
                                        top:50
                                    },600,function(){
                                        $(".cover,.comment_zz_content").animate({
                                            width:10,
                                            height:10,
                                            left : 800,
                                            top : 800
                                        },800,function(){
                                            //防IOS手机视频
                                            if($("#MediaMask").size()>0){$("#MediaMask").show();}

                                            var webParams = {
                                                refId : $("#resourceId").val(),
                                                relationType : $("#relationType").val(),
                                                replyUp : false         //是否置顶回复
                                            };

                                            allReply($("#EQ_newReplyList"),webParams);
                                            $(".cover,.comment_zz_content").remove();

                                            document.body.style.overflow = 'auto';
                                            window.isIscrollBind = false;
                                            b.destroy();
                                            $("body").off("vmousemove");

                                        })
                                    })

                                    //var offset = $('.down-arr').offset(), flyer = $("<img class=\"u-flyer\" src=\"//img50.allinmd.cn/case/eye.jpg\"/>");
                                    //flyer.fly({
                                    //    start: {
                                    //        left: window.event.pageX,
                                    //        top: window.event.pageY
                                    //    },
                                    //    end: {
                                    //        left: offset.left+200,
                                    //        top: offset.top,
                                    //        width: 20,
                                    //        height: 20
                                    //    }
                                    //});

                                    //require.js
                                    //var webParams = {refId: s.refId, relationType: s.relationType}
                                    //$("#notDataTips").html('');
                                    //if(location.pathname == "/html/pages/comm/all_reply.html"){
                                    //    newReply($("#EQ_newReplyList"), webParams, "waterfall", "refresh");
                                    //}else{
                                    //    newReply($("#EQ_newReplyList"), webParams, null, "refresh");
                                    //    window.scrollTo($("#EQ_newReplyList").offset().left, $("#replyAnchor").offset().top);
                                    //}

                                    //waterfall.js
                                    //var webParams = {refId: s.refId,relationType : s.relationType}
                                    //hotReply($("#EQ_hotReplyList"),webParams);
                                    //allReply($("#EQ_newReplyList"),webParams);

                                });
                            }
                        }});

                    },
                    praise: function (t, status, _this) {
                        user.privExecute({operateType:'auth',callback:function(){
                            var params = {}, upDownType = 1, url = "";
                            if (status) {
                                popupAutoDisappear("点赞成功",1000);
                                upDownType = 1;
                                url = t.configUrl.praise;
                                $(_this).find("img").attr("src", img.praiseBlueActive);
                                if($(_this).attr("innerid") != undefined){
                                    $(_this).text("取消赞");
                                    $(_this).attr("data-praise",true);
                                }

                                if ($(_this).find("#praiseNum").length > 0){
                                    $(_this).find("#praiseNum").html(parseInt($(_this).find("#praiseNum").html()) + 1);
                                    $(_this).find("img").attr("src", "//img50.allinmd.cn/case/zan_active_small.png");
                                }

                            } else {
                                popupAutoDisappear("取消点赞",1000);
                                upDownType = 1;
                                if($(_this).attr("innerid") != undefined){
                                    $(_this).text("赞");
                                    $(_this).attr("data-praise",false);
                                }

                                if ($(_this).attr("coloring") != undefined) {
                                    $(_this).find("img").attr("src", img.praiseDefault);
                                } else if($(_this).find("div").attr("coloring") != undefined) {
                                    $(_this).find("[coloring=small]").find("img").attr("src",img.praiseSmallDefault);
                                } else{
                                    $(_this).find("img").attr("src", img.praiseBlueDefault);
                                }
                                url = t.configUrl.praiseD;
                                if ($(_this).find("#praiseNum").length > 0){
                                    var num = parseInt($(_this).find("#praiseNum").html());
                                    if(num>0){
                                        $(_this).find("#praiseNum").html(parseInt($(_this).find("#praiseNum").html()) - 1);
                                    }
                                }
                            }

                            if (p.reviewId == 0)
                                params.paramJson = $.toJSON({
                                    customerId: t.commonFn.getUid(),
                                    upDownType: upDownType,
                                    usefulType: p.relationType,
                                    refId: p.refId
                                });
                            else
                                params.paramJson = $.toJSON({
                                    customerId: t.commonFn.getUid(),
                                    upDownType: upDownType,
                                    usefulType: p.relationType,
                                    refId: p.reviewId
                                });

                            t.commonFn.ajax(url, params);
                        }});
                    },
                    collect: function (t, status, _this) {
                        user.privExecute({operateType:'auth',callback:function(){
                            //t.commonFn.checkLogin();
                            var params = {}, url = "";

                            //同步固定与浮动动作一致
                            if(status){
                                if($(_this).find("img").attr("src") == img.collectBlueActive) status = false;
                            }else{
                                if($(_this).find("img").attr("src") == img.collectBlueDefault || $(_this).find("img").attr("src") == img.collectDefault) status = true;
                            }

                            if (status) {
                                url = t.configUrl.collect;
                                //浮动收藏状态
                                if($("#float").length>0){
                                    if(s.type===1){
                                        $("#float").find("li:eq(1)>img").attr("src",img.collectBlueActive);
                                    }else{
                                        $("#float").find("li:eq(2)>img").attr("src",img.collectBlueActive);
                                    }
                                }
                                //固定位置收藏状态
                                if($("#EQ_fiexdRelation").length>0){
                                    $("#EQ_fiexdRelation").find("li:eq(2)>img").attr("src",img.collectBlueActive);
                                }

                            } else {
                                url = t.configUrl.collectD;

                                //if ($(_this).attr("coloring") != undefined) {
                                //浮动收藏状态
                                if($("#float").length>0){
                                    if(s.type===1) {
                                        $("#float").find("li:eq(1)>img").attr("src", img.collectBlueDefault);
                                    }else{
                                        $("#float").find("li:eq(2)>img").attr("src", img.collectBlueDefault);
                                    }
                                }
                                //固定位置收藏状态
                                if($("#EQ_fiexdRelation").length>0){
                                    $(_this).find("img").attr("src",img.collectDefault);
                                    //$("#EQ_fiexdRelation").find("li:eq(2)>img").attr("src",img.collectDefault);
                                }
                                //} else {
                                //浮动收藏状态
                                //if($("#float").length>0){
                                //	$("#float").find("li:eq(2)>img").attr("src",img.collectBlueDefault);
                                //}
                                ////固定位置收藏状态
                                //if($("#EQ_fiexdRelation").length>0){
                                //	$("#EQ_fiexdRelation").find("li:eq(2)>img").attr("src",img.collectDefault);
                                //}
                                //}
                                //TODO：　关注取消失败
                            }
                            params.paramJson = $.toJSON({
                                customerId: t.commonFn.getUid(),
                                collectionType: s.relationType,
                                refId: p.refId
                            });
                            t.commonFn.ajax(url, params);
                        }});
                    },
                    docSet: function (t) {
                        //浮动
                        if (s.floatClick) $("section").trigger("touchstart");


                        if(isNaN(localStorage.readSchema.split(",")[2])){
                            localStorage.readSchema = "0,1," + fontSize;
                        }

                        //处理初始化时状态
                        var ele= p.docSetPlace;
                        if(!ele){ ele = $('#doc_set');}

                        ele.prepend(t.templateLibrary.g1).find("#set_daytime").on("vclick", function (e) {
                            t.commonFn.readSchema("day", 0);
                            $(this).attr("class", "qh_click").siblings("#set_night").attr("class", "qh_normal");
                            var allsuspects = document.getElementsByTagName("link");
                            for (var i = 0, len = allsuspects.length; i < len; ++i) {
                                if (allsuspects[i].getAttribute("href") == s.nigthFileName)
                                    allsuspects[i].parentNode.removeChild(allsuspects[i]);
                            }
                            $('body').removeClass('night');
                            e.stopPropagation();e.preventDefault();
                        }).siblings("#set_night").on("vclick", function (e) {
                            t.commonFn.readSchema("day", 1);
                            $(this).attr("class", "qh_click").siblings("#set_daytime").attr("class", "qh_normal");
                            var oCss = document.createElement("link");
                            var allsuspects = document.getElementsByTagName("link");
                            oCss.setAttribute("rel", "stylesheet");
                            oCss.setAttribute("type", "text/css");
                            oCss.setAttribute("href", s.nigthFileName);
                            for (var i = 0, len = allsuspects.length; i < len; ++i) {
                                if (allsuspects[i].getAttribute("href") == s.nigthFileName)
                                    return false;
                            }
                            document.getElementsByTagName("head")[0].appendChild(oCss);
                            $('body').addClass('night');
                            e.stopPropagation();e.preventDefault();
                        }).parent().siblings(".font_size_qh").find("#set_bigFont").on("tap", function (e) {
                            t.commonFn.readSchema("font", 0);
                            $(".setting-font-size").css("font-size",fontSize* s.bigFont + "px");
                            $(this).attr("class", "font_size_click").siblings("div:eq(0),div:eq(1)").attr("class", "font_size_normal");
                            e.stopPropagation();e.preventDefault();
                        }).siblings("#set_font").on("tap", function (e) {
                            t.commonFn.readSchema("font", 1);
                            $(".setting-font-size").css("font-size", fontSize + "px");
                            $(this).attr("class", "font_size_click").siblings("div:eq(0),div:eq(1)").attr("class", "font_size_normal");
                            e.stopPropagation();e.preventDefault();
                        }).siblings("#set_smallFont").on("tap", function (e) {
                            t.commonFn.readSchema("font", 2);
                            $(".setting-font-size").css("font-size", fontSize * s.smallFont + "px");
                            $(this).attr("class", "font_size_click").siblings("div:eq(0),div:eq(1)").attr("class", "font_size_normal");
                            e.stopPropagation();e.preventDefault();
                        }).parent().parent().siblings("#docSetClose").on("tap", function (e) {
                            $(".doc_qh,.cover").remove();
                            if (s.floatClick) $("section").trigger("touchstart");
                            document.body.style.overflow = 'auto';
                            e.stopPropagation();e.preventDefault();
                        });

                        //设置打开的位置
                        t.commonFn.setOpenCenter($(".doc_qh"));

                        //对设置作初始化
                        if (localStorage.readSchema != undefined) {
                            var ele, arr = localStorage.readSchema.split(",");
                            //白天黑夜
                            arr[0] == 0 ? ele = $("#set_daytime") : ele = $("#set_night");
                            ele.attr("class", "qh_click").siblings("div:eq(0)").attr("class", "qh_normal");

                            //字体
                            if (arr[1] == 0) {
                                ele = $("#set_bigFont");
                            }
                            else if (arr[1] == 1) {
                                ele = $("#set_font");
                            }
                            else {
                                ele = $("#set_smallFont");
                            }
                            ele.attr("class", "font_size_click").siblings("div:eq(0),div:eq(1)").attr("class", "font_size_normal");
                        }

                    },
                    share: function (t) {
                        _this = t;
                        user.privExecute({operateType:'collect',callback:function(){
                            if(_this.commonFn.isWeiXin()){
                                var shareHtml='<div class="dk-result-pointer-bg"></div><div class="dk-result-pointer" ></div>';
                                $("body").append(shareHtml);
                                $("body").css("overflow","hidden");
                                if($(".dk-result-pointer").length){
                                    setTimeout(function(){
                                        $(".dk-result-pointer").remove();
                                        $(".dk-result-pointer-bg").remove();
                                        $("body").css("overflow","auto");
                                    },10000);
                                }
                                $(".dk-result-pointer").on("vclick",function(){
                                    $(".dk-result-pointer").remove();
                                    $(".dk-result-pointer-bg").remove();
                                    $("body").css("overflow","auto");
                                });
                            }
                        }});
                    },
                    follow: function (t, relationship, _this) {
                        var params = {}, url = "";

                        //触发后字幕
                        if ($(_this).text() == "加关注") { //初时未关注触发切换成取消关注以下类推..
                            $(_this).text("取消关注");
                            url = t.configUrl.followResource;
                        } else if ($(_this).text() == "取消关注") {
                            $(_this).text("加关注");
                            url = t.configUrl.followResourceD;
                        }

                        //被关注者的id  因病例终端页会生成静态，所以要给病例终端页设置隐藏refId
                        params.paramJson = $.toJSON({refId: s.refId, dataFlag: 2, followType: s.relationType});//refId  被关注者ID
                        t.commonFn.ajax(url, params);
                    },
                    del_reply : function(t,status,_this){  //删除回复
                        var params = {};
                        params.paramJson = $.toJSON({id: p.reviewId,reviewStatus:3});

                        $("body").append(t.templateLibrary.i);
                        t.commonFn.setOpenCenter($("#replyWindow"));

                        $("#confrim_window").on("click",function(){//确认删除
                            t.commonFn.ajaxSend(t.configUrl.removeReply,params);
                            $(_this).parents("li").remove();
                            $("#cancel_mask").remove();
                            $("body").removeAttr("style");

                            if($(".detail-reivew-num").length>0){
                                $(".detail-reivew-num").text(parseInt($(".detail-reivew-num").text())-1);
                            }
                        });

                        $("#cancel_window").on("click",function(){//关闭
                            $("#cancel_mask").remove();
                            $("body").removeAttr("style");
                        });

                        //swal({
                        //    title: "确定删除吗?",
                        //    text: "提示：删除后不可恢复!",
                        //    //type: "warning",
                        //    showCancelButton: true,
                        //    confirmButtonColor: "#DD6B55",
                        //    confirmButtonText: "确定删除！",
                        //    closeOnConfirm: false
                        //}, function(){
                        //    swal("删除完成！");
                        //    t.commonFn.ajaxSend(t.configUrl.removeReply,params);
                        //    $(_this).parents("li").remove();
                        //});

                    },
                    more: function (t, status) {
                        t.commonFn.checkLogin();
                        //if ($("#appMore").length == 0) {
                        _this = t, _status = status;

                        //初始化关注的状态
                        var params = {};
                        params.paramJson = $.toJSON({
                            refId: s.refId,
                            followType: s.relationType,
                            customerId: t.commonFn.getUid()!=null?t.commonFn.getUid():""
                        });
                        var dataJson = t.commonFn.ajax(t.configUrl.followResourceInfo, params);
                        if(!dataJson.responseObject.responseStatus){ console.log("服务请求失败！"); return false;}

                        relationship = dataJson.responseObject.responseData.data_list[0].customer_follow_resource.isValid;

                        //如果不存在，则添加
                        if($("#appMore").length == 0){

                            $("body").prepend(t.templateLibrary.b3);

                            //非用户本人时是关注，本人则编辑病例;
                            var cid = 0,uid = 0;cidObject = t.commonFn.ajax("/mcall/customer/baseinfo/getBaseInfo/",{});
                            if(cidObject.responseObject.responseStatus){
                                cid = cidObject.responseObject.responseMessage.customerId;
                            }

                            var getCid = $(".fb01").find("a").attr("href");
                            var startNum = getCid.indexOf("=")+1;

                            if(startNum >-1)uid = getCid.substring(startNum);
                            else uid = 0;

                            if(cid == uid && s.relationType==7){
                                $("[innerId=follow]").remove();
                            }else{
                                $("#editCase").parent().remove();
                            }


                            $("#appMore").find("div").toggle(function (e) {
                                if ($(this).attr("innerId") == "praise")
                                    _this.action.praise(_this, true, this);
                                else if ($(this).attr("innerId") == "follow") {
                                    _this.action.follow(_this, relationship, this);
                                } else if ($(this).attr("innerId") == "clear") {
                                    $(this).parent().parent().hide();
                                    $(".cover").hide();
                                    s.t.show();
                                    document.body.style.overflow = 'auto';
                                };


                            }, function () {
                                if ($(this).attr("innerId") == "praise")
                                    _this.action.praise(_this, false, this);
                                else if ($(this).attr("innerId") == "follow") {
                                    _this.action.follow(_this, relationship, this);
                                }
                            })

                            $("#editCase").on("click",function(e){
                                e.stopPropagation && e.stopPropagation();
                            });

                        }else{
                            $("#appMore").show();
                            $(".cover").show();
                        }
                        //打开在底部
                        t.commonFn.setOpenBottom($(".case_more"));


                        //relationship //0未关注 1关注
                        if (relationship == 0) {
                            $("div[innerId=follow]").text("加关注");
                        } else if (relationship == 1) {
                            $("div[innerId=follow]").text("取消关注");
                        }

                        //初始化赞的状态
                        if($("#appMore").find("div:eq(1)").attr("data-praise") == "false" || $("#appMore").find("div:eq(1)").attr("data-praise") == undefined){
                            $("#appMore").find("div:eq(1)").text("赞");
                        }else{
                            $("#appMore").find("div:eq(1)").text("取消赞");
                        }
                    }
                    //}
                },
                configUrl: { //地址
                    reply: "/mcall/customer/review/create/", //回复
                    removeReply : "/mcall/customer/review/delete/", //删除
                    praise: "/mcall/customer/prefer/create/", //赞
                    praiseD: "/mcall/customer/prefer/delete/", //取消赞
                    collect: "/mcall/customer/collection/create/", //收藏
                    collectD: "/mcall/customer/collection/delete/", //取消收藏
                    chat: "/mcall/customer/review/json_list/", //查看对话
                    followResource: "/mcall/customer/follow/resource/create/",
                    followResourceD: "/mcall/customer/follow/resource/delete/",
                    followResourceInfo: "/mcall/customer/follow/resource/info/" //关注关系
                },
                commonFn: {
                    isWeiXin : function(){
                        var ua = window.navigator.userAgent.toLowerCase();
                        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
                            return true;
                        }else{
                            return false;
                        }
                    },
                    ajax: function (url, params) {
                        var result = {};
                        $.ajax({
                            url: url,
                            type: "POST",
                            data: params,
                            async: false,
                            dataType: "json",
                            success: function (data) {
                                result = data;
                            }
                        })
                        return result;
                    },
                    ajaxSend: function(url,params){
                        $.ajax({
                            url: url,
                            type : "post",
                            data : params
                        })
                    },
                    isEmptyObject: function (obj) {
                        for (var x in obj) {
                            return false;
                        }
                        return true;
                    },
                    getCount : function(str){
                        var len = 0;
                        for(var i = 0;i < str.length; i++){
                            if(str.charCodeAt(i)>128)len+=2;
                            else len+=1;
                        }
                        return len;
                    },
                    getUid: function () {
                        return localStorage.userId != undefined && localStorage.userId.length != 0 ?
                            parseInt(localStorage.userId) : false;
                    },
                    checkLogin: function () {
                        if (this.getUid() == false) {
                            localStorage.fromPage = location.href;
                            location.href = "/html/pages/passport/login_select.html?redirect=1";
                            return false;
                        }
                    },
                    setOpenCenter: function (el) {
                        el.css("top", $(window).scrollTop() + ($(window).height() / 2 - el.height() / 2));
                        document.body.style.overflow = 'hidden';
                    },
                    setOpenBottom: function (el) {
                        //el.css("top", $(window).scrollTop() + ($(window).height() - $(".case_more").height()));
                        document.body.style.overflow = 'hidden';
                        s.t.hide();
                    },
                    readSchema: function (src, val) {
                        var arr = localStorage.readSchema.split(",");
                        var day = arr[0], font = arr[1], initSize = arr[2];
                        if (src == "font") {
                            localStorage.readSchema = day + "," + val + "," + initSize;
                        } else {
                            localStorage.readSchema = val + "," + font + "," + initSize;
                        }
                    },
                    adapterData: function (kv) {
                        return {
                            id: kv.customer_review.id,
                            logoUrl: kv.customer_att.logoUrl,
                            nickname: kv.customer_auth.lastName + kv.customer_auth.firstName,
                            time: diffDay_one(kv.customer_review.publishTime, local_time()),
                            content: htmlToString(kv.customer_review.reviewContent).replace(/&lt;br\/&gt;/g,'<br/>')
                        }
                    },
                    assist_DataController: function (dataJson, targetDOM, _this, count,paramJson) {
                        var html = "", kv, isLastRecord;
                        t = _this, len = dataJson.data_list.length;

                        //查看更多
                        var moreNum = dataJson.is_more;
                        function isMore(moreNum){
                            if(moreNum>0) return "<li id=\"watchMe\" data-id=\""+p.reviewId+"\">查看更多评论</li>";
                            return "";
                        }

                        var currHeight=0;

                        $.each(dataJson.data_list, function (i, el) {
                            kv = t.commonFn.adapterData(el);

                            html += t.templateLibrary.e(kv);
                        });

                        //清除loading状态
                        targetDOM.find(".comment_top").remove();



                        //包装
                        var result;
                        if ($("#waterfall_chat").length > 0) {
                            targetDOM = $("#waterfall_chat ul");
                            result = html;
                            //$(".ul_bottom_line").height()+
                        } else {
                            result = "<div class=\"cover\"></div>" +
                                "<div class='context_chat'>"+
                                "<div class=\"tc_close_case\" id=\"closeWindow\"><img src='//img50.allinmd.cn/doc/close.png' /></div>" +
                                "<div class=\"chat_context\" id=\"waterfall_chat\">" +
                                "<ul class=\"hot_comment_li_tc ul_bottom_line\">" +
                                html +
                                "</ul><span class=\"chat_line\"></span>"+
                                isMore(moreNum)+
                                "<div class=\"clear\"></div></div></div>";
                        }


                        targetDOM.prepend(result).find(".h02").on("vclick", function () {
                            $(".comment_tc,.cover").remove();
                            t.action.reply(t, null, this);
                        });

                        if(dataJson.data_list.length < paramJson.pageSize){
                            targetDOM.attr("scrolllock","true");
                        }

                        //iscroll.js
                        if(!window.isIscrollBind) {
                            window.isIscrollBind = true;
                            b = new IScroll("#waterfall_chat");   //#h5_detail
                        }
                        $("body").bind("vmousemove", function (e) {
                            e.preventDefault();
                        });

                        //设置打开位置
                        //$(".context_chat").css("top", $(window).scrollTop() + ($(window).height() / 2 - $(".context_chat").height() / 2));
                        $(".context_chat").css({
                            "position":"fixed",
                            "z-index":"5",
                            "top":($(window).height() - $(".context_chat").height()) / 2,
                            "left" : ($(window).width()-($(".context_chat").width()+$("#closeWindow").width()/2))/2
                        })
                        document.body.style.overflow = 'hidden';
                        //修改最后一条的线样式
                        $("#waterfall_chat ul li:eq(" + parseInt($("#waterfall_chat ul li").length - 1) + ")").find(".chat_content").addClass("li_last_line");

                        /**
                         * 计算对话线
                         * */
                        //计算ul总高度
                        var ulHeight = parseInt($("#waterfall_chat").height());
                        //计算有多少li与li不算最后一个的总高度
                        var liLen = $("#waterfall_chat").find("li").length-1,liHeight=0;
                        for(var i=0;i<liLen;i++){
                            liHeight+=$("#waterfall_chat").find("li:eq("+i+")").height()+32; //32为每个li的上下边距2em
                        }
                        //$(".chat_line").css("height",liHeight+24);    //24为外边框的上边距1.5em

                        ////计算出头像高度，作为对话线上部分高度值 头像是正方形，所以宽高一样
                        var upHeight = $(window).width()*0.125/2+8+20-2;
                        //计算出作为对话线下部分的高度值
                        //var downHeight = parseInt($("#waterfall_chat ul li:eq(0)").height()) - upHeight;
                        //计算中线位置 1.25为chat_face左边距的距离  0.5为chat_face头像的边线宽度
                        //公式(1.25+0.5)*16  改为12

                        if (liLen >= 4) {
                            $(".chat_line").css({
                                "height": liHeight,
                                "left" : upHeight - (1.25 - 0.5) * 12 + "px",
                                "top" : 0
                            })
                        } else {
                            $(".chat_line").css({
                                "height" : liHeight,
                                "left" : upHeight - (1.25 - 0.5) * 12 + "px",
                                "top" : 24
                            })
                        }

                        $(".chat_line").hide();

                        window[0].preventDefault();
                        window[0].stopPropagation();
                        return false;

                    }
                }

            }


            m.achieve();
            return this;
        }
    });

})(jQuery);
function nConverBr(text){
    return text.split("\n").join("<br>");
}

function isValExist(obj){
    if($.isEmptyObject(obj) || obj.length == 0){
        return false;
    }
    return true;
}
