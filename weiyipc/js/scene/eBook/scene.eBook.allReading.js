/**
 * Created by HJ on 2016/12/2.
 */

$(function () {
    document.oncontextmenu=function(){
        event.returnValue=false;
    };
    document.onselectstart=function(){
        event.returnValue=false;
    };
    var cId = $("#sesCustomerId").val();
    var eBookReading = {
        config: {
            bookId: comm.getpara().bId,
            bookName: comm.getpara().bName,
            docId: ""
        },
        path: {
            eContent: PC_CALL + "customer/doc/getMapByDocContent/",//电子书内容
            eCatalog: PC_CALL + "customer/doc/getMapByBookCatalogue/",//电子书目录
            readVideo: PC_CALL + "customer/doc/getMapByEBookReadVideo/",//电子书全书阅读视频处理
            collect: PC_CALL + "collection/create/", //收藏
            collectCancel: PC_CALL + "collection/delete/",//收藏取消
            addBNumUrl: PC_CALL + 'follow/addBrowseNum/',
            bookDetail: PC_CALL + "customer/doc/getMapByBookList/"//书籍详情
        },
        login: function () {
            var t = this;
            //$("title").text(t.config.bookName + "- 电子书阅读,唯医,allinmd");
            document.title = t.config.bookName + "- 电子书阅读,唯医,allinmd";
            var onLoginClose;
            onLoginClose = function () {
                if (window.history.length > 1) {
                    history.back();
                } else {
                    g_sps.jump(null,"/");
                }
            };
            user.login({
                callback: function () {
                    t.init();
                },
                scene: privilegeSceneConst.eSceneTypeDocDetail,
                onClose: onLoginClose,
                onAuthCancel: "back"      // 当点暂不认证时的处理、回退到来源页
            });
        },
        init: function () {
            var t = this;
            $(".Ev-searchPop").css("max-height",$(window).height()-50);
            t.addCatalog();//添加目录
            t.exitReading();//退出阅读
            t.collectClick();//边栏收藏书籍
            t.sideBarClick();//边栏按钮点击事件
            t.topDownScroll();//上下滚动
            t.searchEvent();//搜索事件
            t.addBookmark();//添加书签
            t.bookmarkState();//书签状态
            t.bookDetailEvent();//书籍详情页跳转
            t.addBrowseNum();//全书阅读增加浏览数
        },
        //全书阅读增加浏览数
        addBrowseNum: function () {
            var t = this;
            var callback = function (rep) {
            };
            var param = {};
            param.refId = t.config.bookId;
            param.usefulType = 2;
            //var params={paramJson: $.toJSON(param)};
            comm.ajax.async(t.path.addBNumUrl, param, callback);
        },
        //书籍详情页跳转
        bookDetailEvent: function () {
            var t = this;
            $(".Ev-bookBtn").off("click").on("click", function () {
                g_sps.jump(null,"/pages/eBook/eBook_details.html?bId=" + t.config.bookId);
            });
        },
        //退出阅读
        exitReading: function () {
            $(".Ev-exitReadBtn").off("click").on("click", function () {
                if (!document.referrer) {
                    g_sps.jump(null,"about:blank");
                } else {
                    window.close();
                }

            });
        },
        //边栏收藏按钮
        collectClick: function () {
            var t = this;
            var _c = $(".Ev-alCollect");
            var param = {};
            param.docId = t.config.bookId;
            param.scene = 14;
            param.visitSiteId = 1;
            param.sessionCustomerId = cId;
            param.pageIndex = 1;
            param.pageSize = 10;
            var params = {paramJson: $.toJSON(param)};
            var callback = function (data) {
                if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list[0]) {
                    var items = data.responseObject.responseData.data_list[0];
                    if (items.collectionRelationship == 1) {//已收藏
                        _c.addClass("collectClick");
                    } else {//未收藏
                        _c.removeClass("collectClick");
                    }
                }
            };
            comm.ajax.async(t.path.bookDetail, params, callback);


            _c.off("click").on("click", function () {
                var data = {};
                data.customerId = cId;
                data.collectionType = 17;//书籍类型
                data.refId = t.config.bookId;
                var paramJson = {paramJson: $.toJSON(data)};
                if ($(this).hasClass("collectClick")) {
                    var callbackCancel = function (data) {
                        if (data && data.responseObject && data.responseObject.responseStatus == true) {
                            $(".Ev-alCollect").removeClass("collectClick");
                        }
                    };
                    comm.ajax.async(t.path.collectCancel, paramJson, callbackCancel);
                } else {
                    var callbackCollect = function (data) {
                        if (data && data.responseObject && data.responseObject.responseStatus == true) {
                            $(".Ev-alCollect").addClass("collectClick");
                        }
                    };
                    comm.ajax.async(t.path.collect, paramJson, callbackCollect);
                }
            });
        },
        //边栏点击事件
        sideBarClick: function () {
            var t = this;
            var _pop = $(".Ev-searchPop"),//弹层的公共外层
                _sBtn = $(".Ev-searchClick"),//搜索按钮
                _sCon = $(".Ev-sContentPart"),//搜索内容
                _mBtn = $(".Ev-catalogClick"),//目录按钮
                _mCon = $(".Ev-catalogAdd"),  //目录内容
                _bBtn = $(".Ev-bookmarkClick"),//书签按钮
                _bCon = $(".Ev-bContentPart");//书签内容

            //搜索按钮
            _sBtn.mouseover(function () {//鼠标悬停
                $(this).addClass("searchClick");
            });
            _sBtn.mouseout(function () { //鼠标离开
                if ($(this).attr("data-flag") == 0) {
                    $(this).removeClass("searchClick");
                }
            });
            _sBtn.off("click").on("click", function () { //鼠标点击
                if ($(this).attr("data-flag") == 1) {//选中状态，点击取消选中
                    $(".Ev-bookBtn").show();
                    $(this).attr("data-flag", 0);
                    _pop.animate({"width": 0}, 100).hide().find(".Ev-sContentPart").hide();
                    $(".Ev-sContentAdd").text("");
                    $(".Ev-searchEvent").val("");
                } else {//未选中状态，点击选中
                    $(".Ev-bookBtn").hide();
                    $(this).attr("data-flag", 1);
                    if (_pop.is(":visible")) {//判断可见
                        _sCon.show().siblings().hide();
                        _mBtn.removeClass("catalogClick").attr("data-flag", "0");
                        _bBtn.removeClass("bookmarkClick").attr("data-flag", "0");
                    } else {
                        _pop.show().animate({"width": 550}, 100).find(".Ev-sContentPart").show();
                        _sCon.show().siblings().hide();
                    }
                }
            });

            //目录按钮
            _mBtn.mouseover(function () { //鼠标悬停
                $(this).addClass("catalogClick");
            });
            _mBtn.mouseout(function () {//鼠标离开
                if ($(this).attr("data-flag") == 0) {
                    $(this).removeClass("catalogClick");
                }
            });
            _mBtn.off("click").on("click", function () {//鼠标点击
                if ($(this).attr("data-flag") == 1) {//选中状态，点击取消选中
                    $(".Ev-bookBtn").show();
                    $(this).attr("data-flag", 0);
                    _pop.animate({"width": 0}, 100).hide().find(".Ev-catalogAdd").hide();
                } else {//未选中状态，点击选中
                    $(".Ev-bookBtn").hide();
                    $(this).attr("data-flag", 1);
                    if (_pop.is(":visible")) {//判断可见
                        _mCon.show().siblings().hide();
                        _sBtn.removeClass("searchClick").attr("data-flag", "0");
                        _bBtn.removeClass("bookmarkClick").attr("data-flag", "0");

                    } else {
                        _pop.show().animate({"width": 550}, 100).find(".Ev-catalogAdd").show();
                        _mCon.show().siblings().hide();
                    }
                }
            });

            //书签按钮
            _bBtn.mouseover(function () {   //鼠标悬停
                $(this).addClass("bookmarkClick");
            });
            _bBtn.mouseout(function () { //鼠标离开
                if ($(this).attr("data-flag") == 0) {
                    $(this).removeClass("bookmarkClick");
                }
            });
            _bBtn.off("click").on("click", function () { //鼠标点击
                if ($(this).attr("data-flag") == 1) {//选中状态，点击取消选中
                    $(".Ev-bookBtn").show();
                    $(this).attr("data-flag", 0);
                    _pop.animate({"width": 0}, 100).hide().find(".Ev-bContentPart").hide();
                } else {//未选中状态，点击选中
                    $(".Ev-bookBtn").hide();
                    $(this).attr("data-flag", 1);
                    if (TempCache.getItem("eBookmark")) {
                        t.bookmarkContent();
                    } else {
                        $(".Ev-noBookmark").show();
                    }
                    if (_pop.is(":visible")) {
                        _bCon.show().siblings().hide();
                        _sBtn.removeClass("searchClick").attr("data-flag", "0");
                        _mBtn.removeClass("catalogClick").attr("data-flag", "0");
                    } else {
                        _pop.show().animate({"width": 550}, 100).find(".Ev-bContentPart").show();
                        _bCon.show().siblings().hide();
                    }
                }
            });

            //弹层可见

            $(".eBookPageBox").on("click", function (e) {
                var _a = $(e.target);
                if (_a.parents().hasClass("Ev-searchPop") || _a.hasClass("Ev-searchPop") || _a.hasClass("Ev-searchClick") || _a.hasClass("Ev-bookmarkClick") || _a.hasClass("Ev-catalogClick") || _a.hasClass("Ev-bDeleteBtn")) {

                } else {
                    if (_pop.is(":visible") && (_sBtn.attr("data-flag") == 1 || _bBtn.attr("data-flag") == 1 || _mBtn.attr("data-flag") == 1)) {
                        _sBtn.attr("data-flag", 0).removeClass("searchClick");
                        _mBtn.attr("data-flag", 0).removeClass("catalogClick");
                        _bBtn.attr("data-flag", 0).removeClass("bookmarkClick");
                        $(".Ev-sContentAdd").text("");
                        $(".Ev-searchEvent").val("");
                        _pop.hide();
                        $(".Ev-bookBtn").show();
                    }
                }
            });

            //边栏的滚动条
            _pop.mCustomScrollbar({theme: "minimal-dark"});

        },
        //书签状态
        bookmarkState: function (prev) {
            if (TempCache.getItem("eBookmark")) {
                var _last =prev?$(".Ev-textAppend .Ev-docContent:first"):$(".Ev-textAppend .Ev-docContent:last");
                var _eachCon = TempCache.getItem("eBookmark");
                var _dId = _last.attr("data-docId");
                var _eDId;
                var _arr = _eachCon.split("&&&&");
                $.each(_arr, function (i, e) {
                    if (e) {
                        _eDId = e.substring(e.indexOf("&&dId=") + 6, e.indexOf("&&docNowNum="));
                        if (_eDId == _dId) {
                            $(".Ev-addBookmark").addClass("orderClick");
                            return false;
                        } else {
                            $(".Ev-addBookmark").removeClass("orderClick");
                        }
                    }
                });
            } else {
                $(".Ev-addBookmark").removeClass("orderClick");
            }
        },
        //添加书签
        addBookmark: function (prev) {
            var t = this;
            $(".Ev-addBookmark").off("click").on("click", function () {
                var _last = prev?$(".Ev-textAppend .Ev-docContent:first"):$(".Ev-textAppend .Ev-docContent:last");
                var _lCon = comm.getStrLen(_last.find(".Ev-allReadingCon").text(), 150);
                var _dId = _last.attr("data-docId");
                var _t = _last.find("figcaption").text();
                var _docNowNum = _last.find("figcaption").attr("data-catalogNum");
                var arr = [];
                if (TempCache.getItem("eBookmark")) {
                    var _eachCon = TempCache.getItem("eBookmark");
                    var flag = true;
                    var _eDId;
                    var _arr = _eachCon.split("&&&&");
                    $.each(_arr, function (i, e) {
                        if (e) {
                            _eDId = e.substring(e.indexOf("&&dId=") + 6, e.indexOf("&&docNowNum="));
                            if (_eDId == _dId) {
                                flag = false;
                                return false;
                            }
                        }
                    });
                    if (flag) {
                        arr.push(_eachCon + 'content=' + _lCon + '&&title=' + _t + '&&dId=' + _dId + '&&docNowNum=' + _docNowNum + '&&&&');
                        $(".Ev-addBookmark").addClass("orderClick");
                        TempCache.setItem("eBookmark", arr);
                    }
                } else {
                    arr.push('content=' + _lCon + '&&title=' + _t + '&&dId=' + _dId + '&&docNowNum=' + _docNowNum + '&&&&');
                    $(".Ev-addBookmark").addClass("orderClick");
                    TempCache.setItem("eBookmark", arr);
                }
                t.sideBarClick();
            });
        },
        //书签内容
        bookmarkContent: function () {
            var t = this;
            if (TempCache.getItem("eBookmark")) {
                var _eachCon = TempCache.getItem("eBookmark");
                var html = "", _con, _tit, _dId, _dNowNum;
                var _arr = _eachCon.split("&&&&");
                $.each(_arr, function (i, e) {
                    if (e) {
                        _con = e.substring(e.indexOf("content=") + 8, e.indexOf("&&title"));
                        _tit = e.substring(e.indexOf("&&title=") + 8, e.indexOf("&&dId"));
                        _dId = e.substring(e.indexOf("&&dId=") + 6, e.indexOf("&&docNowNum="));
                        _dNowNum = e.substring(e.indexOf("&&docNowNum=") + 12);

                        html += ' <section class="al-searchContentItem Ev-docClick" data-docId="' + _dId + '">' +
                            '<a href="javascript:;">' +
                            '<span>' + _con + '</span>' +
                            '<p>' + _dNowNum + " " + _tit + '<span class="al-deleteBtn Ev-bDeleteBtn">删除</span></p>' +
                            '</a>' +
                            '</section>';
                    }
                });
                $(".Ev-noBookmark").hide();
                $(".Ev-addBookmarkContent").html(html);
                t.bookmarkClick();
            } else {
                $(".Ev-addBookmarkContent").html("");
                $(".Ev-noBookmark").show();
            }


        },
        //书签处章节点击跳转
        bookmarkClick: function () {
            var t = this, flag = 1, _dId;
            var _bBtn = $(".Ev-bookmarkClick");//书签按钮
            var _mBtn = $(".Ev-catalogClick");//目录按钮
            var _pop = $(".Ev-searchPop");//弹层的公共外层
            var _ebMarkCon = TempCache.getItem("eBookmark");
            $(".Ev-docClick").off("click").on("click", function (e) {
                if ($(e.target).hasClass("Ev-bDeleteBtn")) {//书签删除
                    var _thisContent = $(this).attr("data-docId");
                    var _arr = _ebMarkCon.split("&&&&");
                    $.each(_arr, function (k, v) {
                        if (v) {
                            _dId = v.substring(v.indexOf("&&dId=") + 6, v.indexOf("&&docNowNum="));
                            if (_dId == _thisContent) {
                                if ((_arr.length == 2 && !_arr[1]) || _arr.length == 1) {
                                    _arr = [];
                                } else {
                                    _arr.splice(k, 1);
                                }
                                return false;
                            }
                        }

                    });
                    TempCache.setItem("eBookmark", _arr.join("&&&&"));
                    t.bookmarkContent();
                    t.bookmarkState();
                } else {//书签点击跳转
                    $(".Ev-bookBtn").show();
                    _bBtn.attr("data-flag", 0).removeClass("bookmarkClick");
                    _mBtn.attr("data-flag", 0).removeClass("catalogClick");
                    _pop.animate({"width": 0}, 100).hide().find("div.Ev-bContentPart,div.hide Ev-catalogAdd").hide();
                    t.addContent($(this).attr("data-docId"), flag);//文章id   $(this).attr("data-docId")  1397622805989
                }

            });
            $(".Ev-catalogCJump").off("click").on("click", function () {
                if ($(this).next(".Ev-docClick")) {
                    $(this).next(".Ev-docClick").click();
                }
            });
        },
        //搜索事件
        searchEvent: function () {
            var t = this;
            var _i, _str, _tN, arr = [], _docId;
            $(".Ev-searchEvent").keyup(function () {
                if ($(".Ev-textAppend").find("span.Ev-highlight").length) {
                    $.each($(".Ev-textAppend span.Ev-highlight"), function (i, e) {
                        var _e = $(this).html();
                        $(this).replaceWith(_e);
                    });
                }
                if ($(".Ev-sContentAdd").html()) {
                    $(".Ev-sContentAdd").html("");
                }
                if($(".Ev-textAppend").text().indexOf($.trim($(this).val()))>-1){
                    highlight($.trim($(this).val()));
                }

            });
            $(".Ev-searchBtn").off("click").on("click", function () {
                $(".Ev-searchEvent").keyup();
            });
            //转码
            function encode(s) {
                return s.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/([\\\.\*\[\]\(\)\$\^])/g, "\\$1");
            }

            function decode(s) {
                return s.replace(/\\([\\\.\*\[\]\(\)\$\^])/g, "$1").replace(/>/g, ">").replace(/</g, "<").replace(/&/g, "&");
            }

            //搜索操作
            function highlight(s) {
                s = encode(s);
                var obj = $(".Ev-textAppend")[0];
                var t = obj.innerHTML.replace(/<span\s+class=.?Ev-highlight.?>([^<>]*)<\/span>/gi, "$1");
                obj.innerHTML = t;
                var cnt = loopSearch(s, obj);
                /*  console.log(cnt);*/
                t = obj.innerHTML;
                var r = /{searchHL}(({(?!\/searchHL})|[^{])*){\/searchHL}/g;
                t = t.replace(r, "<span class='Ev-highlight'>$1</span>");
                obj.innerHTML = t;
                if (s && $(".Ev-textAppend").text().indexOf(s)>-1) {
                    var html = "", _sContent, _docNowNum,_len,_replaceStr,textBox;
                    textBox=$(".Ev-textAppend").text();
                    $.each($(".Ev-textAppend span.Ev-highlight"), function (i, e) {
                        _len=$(e).text().length;
                        _replaceStr="";
                        for(var j= 0;j<_len;j++){
                            _replaceStr+="卍";
                        }
                        if(i>0){
                            textBox=textBox.replace($(e).text(),_replaceStr);
                        }
                        _i = textBox.indexOf($(e).text());

                        _tN = $(e).parents(".Ev-docContent").find("figcaption").eq(0).text();
                        _docNowNum = $(e).parents(".Ev-docContent").find("figcaption").eq(0).attr("data-catalogNum");
                        _docId = $(e).parents(".Ev-docContent").attr("data-docId");
                        if (_i > -1) {
                            if (_i > 9) {
                                _str = "..." + $(e).parents(".Ev-textAppend").text().substring(_i - 9, _i + 61);
                            } else {
                                _str = $(e).parents(".Ev-textAppend").text().substring(_i, _i + 61);
                            }
                            var _searchStr=$(e).text();
                            var reg =new RegExp(_searchStr,"g");
                            _sContent = _str.replace(reg,'<i>'+_searchStr+'</i>');
                                html += '<section class="al-searchContentItem Ev-docClick" data-docId="' + _docId + '">' +
                                    '<a href="javascript:;">' +
                                    '<span>' + _sContent + '</span>' +
                                    '<p>' + _docNowNum + '  ' + _tN + '</p>' +
                                    '</a>' +
                                    '</section>';
                        }
                    });
                    $(".Ev-sContentAdd").html(html);

                } else {
                    $(".Ev-sContentAdd").html("");
                }
            }

            function loopSearch(s, obj) {
                var cnt = 0;
                if (obj.nodeType == 3) {
                    cnt = replace(s, obj);
                    return cnt;
                }
                for (var i = 0, c; c = obj.childNodes[i]; i++) {
                    if (!c.className || c.className != "highlight")
                        cnt += loopSearch(s, c);
                }
                return cnt;
            }

            function replace(s, dest) {
                var r = new RegExp(s, "g");
                var tm = null;
                var t = dest.nodeValue;
                var cnt = 0;
                if (tm = t.match(r)) {
                    cnt = tm.length;
                    t = t.replace(r, "{searchHL}" + decode(s) + "{/searchHL}");
                    dest.nodeValue = t;
                }
                return cnt;
            }

            t.searchEventClick();//搜索结果点击
        },
        //搜索处章节点击跳转
        searchEventClick: function () {
            var t = this, flag = 1;
            var _sBtn = $(".Ev-searchClick");//搜索按钮
            var _pop = $(".Ev-searchPop");//弹层的公共外层
            $(".Ev-sContentAdd").off("click").on("click", ".Ev-docClick", function () {
                $(".Ev-bookBtn").show();
                _sBtn.attr("data-flag", 0).removeClass("searchClick");
                _pop.animate({"width": 0}, 100).hide().find("div.Ev-sContentPart").hide();
                $(".Ev-sContentAdd").text("");
                $(".Ev-searchEvent").val("");
                var _thisDoc = $(this).attr("data-docId");
                $.each($(".Ev-textAppend .Ev-docContent"), function (i, e) {
                    if ($(e).attr("data-docId") == _thisDoc) {
                        $(window).scrollTop($(this).offset().top);
                    }
                });
            });
        },
        //点击上下按钮进行滚动加载
        topDownScroll: function () {
            var t = this,
                _top = $(".Ev-toTopBtn"),
                _down = $(".Ev-toDownBtn");
            var scTop;
            var docH;
            var wH = $(window).height();
            var box = $(".Ev-scrollPageBox");
            _top.off("click").on("click", function () {
                scTop = $(window).scrollTop();
                if (scTop > wH) {
                    $(this).addClass("al-toTopHover");
                    $(window).scrollTop(scTop - wH);
                } else {
                    if (scTop > 0) {
                        $(this).addClass("al-toTopHover");
                    } else {
                        $(this).removeClass("al-toTopHover");
                    }
                    $(window).scrollTop(0);
                }
            });
            _down.off("click").on("click", function () {
                scTop = $(window).scrollTop();
                if (box.attr("scrollpagination") == "disabled" && scTop != 0 && ($(document).height() - wH == scTop)) {
                    $(this).removeClass("al-toDownHover");
                    docH = $(document).height();
                    $(window).scrollTop(docH - wH);
                } else {
                    $(this).addClass("al-toDownHover");
                    $(window).scrollTop(scTop + wH);
                }
            });

            //向下点击按钮的样式
            _down.mouseover(function () {
                if (box.attr("scrollpagination") == "disabled" && $(window).scrollTop() != 0 && ($(document).height() - wH <= $(window).scrollTop())) {
                    $(this).removeClass("al-toDownHover");
                } else {
                    $(this).addClass("al-toDownHover");
                }
            });
            _down.mouseout(function () {
                $(this).removeClass("al-toDownHover");
            });

            //向上点击按钮的样式
            _top.mouseover(function () {
                if ($(window).scrollTop() == 0) {
                    $(this).removeClass("al-toTopHover");
                } else {
                    $(this).addClass("al-toTopHover");
                }
            });
            _top.mouseout(function () {
                $(this).removeClass("al-toTopHover");
            });


        },
        //目录添加
        addCatalog: function () {
            var t = this;
            var param = {};
            param.bookId = t.config.bookId;
            var params = {paramJson: $.toJSON(param)};
            t.arr = [];
            var callback = function (data) {
                if (data && data.responseObject && data.responseObject.responseData) {
                    var items = data.responseObject.responseData.data_list;
                    var html, html2 = "";
                    $.each(items, function (i, e) {
                        html = "";
                        if (e.response_data) {
                            $.each(e.response_data, function (n, val) {
                                html += '<p class="Ev-docClick" data-docId="' + val.docId + '">' + (i + 1) + '.' + (n + 1) + "  " + val.docName + '</p>';
                                t.arr.push(val.docId);
                            });
                        }
                        html2 += '<section class="al-chapterListBox">' +
                            '<figure class="al-chapterNumItem">' +
                            '<figcaption class="Ev-catalogCJump">' +
                            '<span style="padding-left:10px;">' + e.catalogueName + '</span>' +
                            '</figcaption>' +
                            html +
                            '</figure>' +
                            '</section>';

                    });
                    $(".Ev-catalogAdd").append(html2);
                    t.addContent(t.arr[0]);//t.arr[0] 1479204701977
                    t.bookmarkClick();
                }
            };
            comm.ajax.async(t.path.eCatalog, params, callback);
        },
        //加载主体内容
        addContent: function (dId, flag) {
            var t = this;
            var param = {};
            param.docId = dId;
            var params = {paramJson: $.toJSON(param)};
            var callback = function (data) {
                if (data && data.responseObject && data.responseObject.responseData) {
                    $(".Ev-scrollPageBox").show();
                    var items = data.responseObject.responseData.data_list[0];
                    $(".Ev-catalogueName").text(items.catalogueName);//comm.numToChinese(parseInt(items.catalogueSortId)) + '  ' +
                    if (flag) {//点击跳转替换
                        $(".Ev-textAppend").html('<figure class="Ev-docContent" data-docId="' + dId + '"><figcaption data-catalogNum="' + (parseInt(items.catalogueSortId)) + '.' + (items.docSortId) + '">'
                            + (items.docName ? items.docName : '') + '</figcaption><figure class="Ev-allReadingCon">' + (items.docContent ? items.docContent : "") + '</figure></figure>');
                        $(window).scrollTop(10);
                        t.scrollEvent();
                        if(dId== t.arr[t.arr.length-1]){
                            $(".Ev-scrollPageBox").attr("scrollPagination", "disabled");
                        }else{
                            $(".Ev-scrollPageBox").attr("scrollPagination", "enabled");
                            t.scrollPage(dId);
                        }
                    } else {//正常瀑布流添加
                        $(".Ev-textAppend").append('<figure class="Ev-docContent" data-docId="' + dId + '"><figcaption data-catalogNum="' + (parseInt(items.catalogueSortId)) + '.' + (items.docSortId) + '">'
                            + (items.docName ? items.docName : '') + '</figcaption><figure class="Ev-allReadingCon">' + (items.docContent ? items.docContent : "") + '</figure></figure>');
                        if(dId== t.arr[t.arr.length-1]){
                            $(".Ev-scrollPageBox").attr("scrollPagination", "disabled");
                        }else{
                            $(".Ev-scrollPageBox").attr("scrollPagination", "enabled");
                            t.scrollPage(dId);
                        }
                    }
                    t.noSrcImgRemove();
                    t.bookmarkState();//书签状态
                    t.videoPlayEvent(dId);//视频播放事件
                }
            };
            comm.ajax.async(t.path.eContent, params, callback);

        },
        noSrcImgRemove:function(){
            var t=this;
            $.each($(".Ev-docContent img"),function(i,e){
                if(!$(e).attr("src")){
                    $(this).remove();
                }
            });
        },
        //视频播放
        videoPlayEvent: function (dId, prev) {
            var t = this;
            $(".Ev-allReadingCon img").attr("style", "");//图片样式
            $(".Ev-allReadingCon").children("style").remove();
            var params = {};
            params.docId = dId;
            var paramData = {paramJson: $.toJSON(params)};
            var callback = function (rep) {
                if (rep && rep.responseObject && rep.responseObject.responseData && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list[0] && !$.isEmptyObject(rep.responseObject.responseData.data_list[0])) {
                    var items = rep.responseObject.responseData.data_list[0].VideoInfoMap;
                    var videoParents;
                    if (prev) {
                        videoParents = $(".Ev-allReadingCon:first").find("a");
                    } else {
                        videoParents = $(".Ev-allReadingCon:last").find("a");
                    }
                    if (videoParents.length) {
                        $.each(videoParents, function (i, e) {
                            if ($(e).attr("href") && $(e).attr("href").indexOf("/video/") > -1) {
                                var _href = $(e).attr("href");
                                var _n = _href ? (_href.substring(_href.lastIndexOf("/") + 1, _href.lastIndexOf(".html"))) : "";
                                $(e).addClass("Ev-videoImgSrc").attr({"style": "", "href": "javascript:;"}).css({
                                    position: "relative",
                                    display: "block"
                                });
                                if (!$(e).find("img").length) {//表格中的视频进行容错
                                    $.each($(e).siblings("img"), function (i2, e2) {
                                        if ($(e2).attr("src")) {
                                            $(e).append('<img src="' + $(e2).attr("src") + '"/>');
                                            $(e2).attr("src", "").remove();
                                            return false;
                                        }
                                    });
                                }
                                $.each(items, function (k, v) {
                                    if (v.videoId == _n) {
                                        $(e).attr("videoSrc", v.PCMp4Url).append('<b class="Ev-videoPlayBtn"></b><span class="Ev-videoPlayTime">' + v.playTime + '</span>');
                                        $(e).after('<p style="color: #666;font-size: 14px;">' + v.videoAbstract + '</p>');
                                        return false;
                                    }
                                });
                            } else {
                                $(e).attr("href", "javascript:;");
                            }
                        });
                        $(".Ev-videoImgSrc").off("click").on("click", function (e) {
                            module.backgroundVideo({videoSrc: $(this).attr("videoSrc")});
                        });
                    }
                }


            };
            comm.ajax.async(t.path.readVideo, paramData, callback);

        },
        //点击跳转当页之前添加新页
        prependHtml: function () {
            var t = this,prev=1;
            var _f = $(".Ev-textAppend figure");
            var nowId = _f.eq(0).attr("data-docId");
            var nowNum;//当前文章的
            $.each(t.arr, function (i, e) {
                if (nowId == e) {
                    nowNum = i;
                    return false;
                }
            });
            if (nowNum == 0) {
                $(window).scrollTop(0);
                t.bookmarkState();
                t.addBookmark();
                t.videoPlayEvent(t.arr[nowNum], true);
            }else if (nowNum > 0) {
                nowNum--;
                var param = {};
                param.docId = t.arr[nowNum];
                var params = {paramJson: $.toJSON(param)};
                var data=comm.ajax.sync(t.path.eContent, params);
                    if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData.data_list[0]) {
                        var items = data.responseObject.responseData.data_list[0];
                        $(".Ev-catalogueName").text(items.catalogueName);
                        $(".Ev-textAppend figure").eq(0).before('<figure  class="Ev-docContent" data-docId="' + param.docId
                            + '"><figcaption data-catalogNum="' + (parseInt(items.catalogueSortId)) + '.' + (items.docSortId) + '">'
                            + (items.docName ? items.docName : '') + '</figcaption><figure class="Ev-allReadingCon">' + (items.docContent ? items.docContent : "") + '</figure></figure>');
                        t.videoPlayEvent(param.docId, true);
                        t.bookmarkState(prev);
                        t.addBookmark(prev);
                        $(window).scrollTop($(".Ev-textAppend figure.Ev-docContent").eq(1).offset().top - $('.Ev-catalogueName').parent().outerHeight());
                        t.scrollEvent();
                        t.noSrcImgRemove();
                }
            }
        },
        //向上滚动加载
        scrollEvent: function () {
            var t = this;
            $(window).scroll(function () {
                if ($(window).scrollTop() == 0) {
                    t.prependHtml();
                }
            });
        },
        //正常文章内容瀑布流滚动
        scrollPage: function (dId) {//传递arr
            var t = this;
            var nowNum;
            $.each(t.arr, function (i, e) {
                if (e == dId) {
                    nowNum = i;
                    return false;
                }
            });
            nowNum++;
            var kv = t.arr[nowNum];
            if (kv) {
                var param = {};
                param.docId = kv;
                $('.Ev-scrollPageBox').scrollPagination({
                    'contentPage': t.path.eContent,
                    'contentData': param,
                    'scrollTarget': $(window),
                    'heightOffset': 0,
                    'delaytime': 1000,
                    'type': "post",
                    'dataType': "json",
                    'beforeLoad': function () {
                        comm.LightBox.showloading();
                    },
                    'afterLoad': function (elementsLoaded) {
                        comm.LightBox.hideloading();
                    },
                    'loader': function (data) {
                        if ($.isEmptyObject(data)) {
                            $(".Ev-scrollPageBox").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            if ($.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                                $(".Ev-scrollPageBox").attr("scrollPagination", "disabled");
                                return false;
                            } else {
                                var items = data.responseObject.responseData.data_list[0];
                                $(".Ev-catalogueName").text(items.catalogueName);//comm.numToChinese(parseInt(items.catalogueSortId)) + '  ' +
                                $(".Ev-textAppend").append('<figure class="Ev-docContent" data-docId="' + param.docId + '"><figcaption data-catalogNum="' + (parseInt(items.catalogueSortId)) + '.' + (items.docSortId) + '">'
                                    + (items.docName ? items.docName : '') + '</figcaption><figure class="Ev-allReadingCon">' + (items.docContent ? items.docContent : "") + '</figure></figure>');
                                t.bookmarkState();//书签状态
                                t.addBookmark();//添加书签
                                t.videoPlayEvent(param.docId);//视频播放事件
                                t.noSrcImgRemove();
                                nowNum++;
                                var kv = t.arr[nowNum];
                                if (kv) {
                                    param.docId = kv;
                                } else {
                                    $(".Ev-scrollPageBox").attr("scrollPagination", "disabled");
                                }
                            }
                        }
                    }
                });
            }

        }
    };
    eBookReading.login();
    //comm.Log.createBrowse({href: location.href, id: 166, name: '全书阅读页面'});
});