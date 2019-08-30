/**
 * 功能描述：
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by LiChunHui on 2015/3/20.
 *
 * // TODO: 处理头部链接，厂商用户不能够点击跳转 多中心平台 与 进修页面
 */
var json = {};
comm.getHeaderLogin = function (changeSite) {
    var container = {};
    container = {
        el: {
            sesCustomerId: $("#sesCustomerId"),
            sesNickname: $("#sesNickname"),
            sesDepartment: $('#sesDepartment'),
            sesAuth: $("#sesAuth")
        },
        path: {
            getWebUser: PC_CALL + "web/user/getWebUser/",
            getDecodeStr: PC_CALL + "web/user/getDecodeStr/",
            urlList: PC_CALL + "passport/securitycheck",
            browse: PC_CALL + "log/customer/browse/json_list/",//浏览记录
            mesDataList: PC_CALL + "customer/message/getMessageCountInfo/",//改版3.0消息获取数据列表
        },
        init: function (changeSite) {
            var t = this;
            setTimeout(function () {
                t.autoLogin();
            }, 500); //延迟登录
            this.getUser();
            this.checkCompany();
            this.addHistoryDOM();
            if (typeof comm.getpara().searchParam != "undefined") {
                $("#serch_input").val(comm.getpara().searchParam);
            }
            if ($("#sesCustomerId").val()) {//登录后获取导航徽标
                setTimeout(function () {
                    t.getSpecialCount();
                }, 1500);
            }

        },
		//检查厂商角色  2019-04-11 屏蔽厂商 点击进修与多中心研究链接时，停止跳转。并提示
		checkCompany:function(){
            var customerRole = TempCache.getItem("customerRole");
            if(customerRole && (customerRole =="14" || customerRole =="15" )){
                $(".al-headerTopNav").find("li:eq(5),li:eq(7)").on("click",function(e){
                    e.preventDefault();
                    e.stopPropagation();
					$.topTip({content:"此功能仅向医务人员开放",mark:'warn'});
                })
            }
        },
        //获取导航徽标
        getSpecialCount: function () {
            var data = {};
            var t = this;
            var localTime = comm.date.local_time();

            if (!TempCache.getItem("readCollectionTime")) {
                TempCache.setItem("readCollectionTime", localTime); //第一次登陆后进入网站记下时间
            }
            if (!TempCache.getItem("readDraftTime")) {
                TempCache.setItem("readDraftTime", localTime); //第一次登陆后进入网站记下时间
            }
            if (!TempCache.getItem("readTrendTime")) {
                TempCache.setItem("readTrendTime", localTime); //第一次登陆后进入网站记下时间
            }
            if (!TempCache.getItem("readFansTime")) {
                TempCache.setItem("readFansTime", localTime); //第一次登陆后进入网站记下时间
            }
            if (!TempCache.getItem("readPreferTime")) {
                TempCache.setItem("readPreferTime", localTime); //第一次登陆后进入网站记下时间
            }
            //if (!TempCache.getItem("loginplatformId") || TempCache.getItem("loginplatformId")=="undefined") {
            //TempCache.setItem("loginplatformId", $("#sesDepartment").val()==undefined?1:$('#sesDepartment').val()); //第一次登陆后进入网站记下时间
            //}
            data.readCollectionTime = TempCache.getItem("readCollectionTime");//上次进入我的收藏的时间
            data.readDraftTime = TempCache.getItem("readDraftTime");//上次进入草稿的时间
            data.readTrendTime = TempCache.getItem("readTrendTime");//上次进入朋友圈的时间
            data.readFansTime = TempCache.getItem("readFansTime");//上次进入粉丝列表的时间
            data.readPreferTime = TempCache.getItem("readPreferTime");//上次进入赞列表的时间
            data.platformId = $('#sesDepartment').val(); //上次登陆平台
            var param = {};
            param.paramJson = $.toJSON(data);
            //var json={};
            $.ajax({
                type: "post",
                url: PC_CALL + "customer/message/getSpecialCount/",
                data: param,
                dataType: "json",
                success: function (rep) {
                    if (rep && rep.responseObject.responseData) {
                        if (rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length > 0) {
                            var list = rep.responseObject.responseData.data_list[0];
                            json = {
                                collectionNum: list.collectionNum,////新的收藏数
                                draftNum: list.draftNum,//新的草稿数
                                fansNum: list.fansNum,//新的粉丝数
                                messageNum: list.messageNum,//新的消息数
                                preferNum: list.preferNum,//新的赞数
                                trendsNum: list.trendsNum//新的朋友圈数
                            };
                            if (list.trendsNum > 0) {//首页徽标
                                /*$(".al-mainSidebarItem>a").eq(0).append('<span class="al-navRedPoint"></span>');
                                setTimeout(function(){
                                    if(location.pathname.length<=1){
                                        $(".al-recommendLinksWrap a").eq(0).append('<i class="al-newNumTips"></i>');
                                    }
                                },1000);*/
                            }
                            /*if(list.trendsNum>0){//发现徽标
                                 $(".al-mainSidebarItem a").eq(1).append('<span class="al-navRedPoint al-discoveryPoint"></span>');
                            }*/
                            $.ajax({
                                type: "post",
                                url: t.path.mesDataList,
                                data: {
                                    paramJson: $.toJSON({
                                        isRead: 0,
                                        customerId: $("#sesCustomerId").val(),
                                    })
                                },
                                dataType: "json",
                                success: function (rep) {
                                    if (rep && rep.responseObject && rep.responseObject.responseData) {
                                        var dataList = rep.responseObject.responseData;
                                        // 3.0改版将消息置成小红点
                                        if (dataList.isNoticeRead == 0) {
                                            $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navRedPoint"></span>');
                                        }
                                        if (dataList.isReceiveRead == 0) {
                                            $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navRedPoint"></span>');
                                        }
                                        if (dataList.isReplyRead == 0) {
                                            $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navRedPoint"></span>');
                                        }
                                        if (dataList.isofficialRead == 0) {
                                            $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navRedPoint"></span>');
                                        }
                                    }
                                }
                            });
                            // if(list.messageNum>0){//消息徽标
                            // 	//原来带有消息数
                            // 	// $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navMessagePoint">'+(list.messageNum<100?list.messageNum:'...')+'</span>');
                            //    //3.0改版将消息置成小红点
                            //    $(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint al-navMessagePoint al-newRedPoint"></span>');
                            // }else if(list.sysNoReadCount>0){
                            // 	$(".al-mainSidebarItem>a").eq(3).append('<span class="al-navRedPoint"></span>');
                            // }
                            if (list.draftNum > 0 || list.fansNum > 0 || list.preferNum > 0 || list.collectionNum > 0) {//我的徽标
                                $(".al-mainSidebarItem>a").eq(4).append('<span class="al-navRedPoint"></span>');
                            }
                            if (!(location.href.lastIndexOf("others_") > -1)) {//个人中心的徽标提示
                                if (list.fansNum > 0) {//有新的粉丝加徽标
                                    $(".al-personalFollowNum").eq(0).append('<i class="al-newNumTips"></i>');
                                } else {
                                    $(".al-personalFollowNum").eq(0).find("i").remove();
                                }
                                if (list.preferNum > 0) {//有新的关注人加徽标
                                    $(".al-personalFollowNum").eq(2).append('<i class="al-newNumTips"></i>');
                                } else {
                                    $(".al-personalFollowNum").eq(2).find("i").remove();
                                }
                            }
                            if (location.href.lastIndexOf("personal_index.html") > -1) {
                                $(".ev-draftNum").text(list.draftNum);
                            }
                        }
                    }
                },
                error: function () {
                }
            });

        },

        //自动登录
        autoLogin: function () {
            var t = this;
            var param = comm.getpara();

            var source = param.source ? param.source : "";
            var userName = param.email ? param.email : "";
            var password = param.password ? param.password : "";
            if (source) {
                $.ajax({
                    url: t.path.getDecodeStr + "?password=" + password,
                    dataType: "json",
                    type: "post",
                    async: false,
                    success: function (result) {
                        password = result.responseObject;
                    }
                });
            }

            var data = {};
            var sesCCId = $("#sesCustomerId").val();

            if ((!sesCCId || sesCCId === "") && source != null && source === "caos") {
                if (typeof userName != "undefined" && userName != null && typeof password != "undefined" && password != null) {
                    var type = "email";
                    if (!userName.indexOf("@") > -1) type = "mobile";
                    data.j_username = "caos;" + userName + ";" + password + ";" + type;
                    data.j_password = password;
                    data.rememberMe = 1;
                    $.ajax({
                        type: 'POST',
                        url: t.path.urlList,
                        data: data,
                        dataType: "json",
                        success: function (rep) {
                            if (rep.responseObject.responseStatus) {
                                t.getUser();
                            }
                        }, timeout: 10000
                    });
                }
            }

        },
        //获取用户信息
        getUser: function () {
            var t = this;
            t.hasLogin();
        },
        //是否登录
        hasLogin: function () {
            var rep;
            //这段代码比较有历史，会强制在每页的header中请求一下用户的权限信息，会与module.user.js中的相同接口有重复，但各司其职
            //同时if里的判断也是有意义的，因为 LocalStorage 里是可以存 null 的，但存完之后取出来的是字符串null，存null是因为接口可能会返回 null
            if (TempCache.getItem("authInfo") && TempCache.getItem("authInfo") != "null") {
                rep = JSON.parse(TempCache.getItem("authInfo")).responseObject;
                if (rep && rep.customerId) {
                    var name = rep.lastName ? rep.lastName + rep.firstName : rep.fullName;
                    if (!$("#sesNickname").length > 0) {
                        TempCache.setItem("userId", rep.customerId);
                        $("body").append('<input type="hidden" id="sesNickname" value="' + name + '">');
                        $("body").append('<input type="hidden" id="sesCustomerId" value="' + rep.customerId + '">');
                        $("body").append('<input type="hidden" id="sesAuth" value="' + rep.state + '">');
                        platformId = rep.platformId == "" ? 1 : rep.platformId;
                        if ((rep.state == 2 || rep.state == 3 || rep.state == 7 || rep.state == 8 || rep.state == 9) && platformId == 2) {//认证或认证拒绝并且是手外科
                            platformId = 2;
                        } else {
                            platformId = 1;
                        }
                        if (changeSite) {//切换站点之后 再登陆用户站点用登录用户的platformId
                            TempCache.setItem("sesDepartment", platformId);
                        }
                        if (TempCache.getItem("sesDepartment")) {//如果切换过站点
                            platformId = TempCache.getItem("sesDepartment");
                        }
                        $("body").append('<input type="hidden" id="sesDepartment" value="' + platformId + '" data-registPlatformId="' + (rep.platformId ? rep.platformId : platformId) + '">');
                    } else {
                        platformId = rep.platformId == "" ? 1 : rep.platformId;
                        if ((rep.state == 2 || rep.state == 3 || rep.state == 7 || rep.state == 8 || rep.state == 9) && platformId == 2) {
                            platformId = 2;
                        } else {
                            platformId = 1;
                        }
                        if (changeSite) {//切换站点之后 再登陆用户站点用登录用户的platformId
                            TempCache.setItem("sesDepartment", platformId);
                        }
                        if (TempCache.getItem("sesDepartment")) {//如果切换过站点
                            platformId = TempCache.getItem("sesDepartment");
                        }
                        $("#sesNickname").val(name);
                        $("#sesCustomerId").val(rep.customerId);
                        $("#sesAuth").val(rep.state);
                        $("#sesDepartment").val(platformId);
                    }
                    if (comm.cookie.get("userId") == "" || !comm.cookie.get("userId") || comm.cookie.get("userId") != rep.customerId) {
                        comm.cookie.deleteFn("userId");
                        comm.cookie.set("userId", rep.customerId, 365 * 5);//todo :病历夹子站设置用户名cookie
                    }
                    $('#sesCustomerId').data({name: rep.fullName, userName: rep.fullName});

                    if (platformId == 2 && (rep.state == 2 || rep.state == 3 || rep.state == 7 || rep.state == 8 || rep.state == 9)) {
                        $(".al-headerTopNav li").eq(6).hide();
                        $(".al-headerTopNav li").eq(7).hide();
                        $(".al-headerTopNav li").eq(9).hide();
                    }

                }
            }
            // 3.5迭代，对之前的代码做了优化，处理了一些重复逻辑
            // 这个方法的本质是保证当前用户的认证状态是最新的
            $.ajax({
                url: PC_CALL + "customer/auth/getAuthBycustomerId/",
                type: 'POST',
                success: function (data) {
                    if (data) {
                        TempCache.setItem("authInfo", JSON.stringify(data));
                        rep = data.responseObject;
                        if ($("#sesAuth").length > 0) {
                            $("#sesAuth").val(rep.state);
                        } else {
                            $("body").append('<input type="hidden" id="sesAuth" value="' + rep.state + '">');
                        }
                    }
                }
            });
        },
        //往头部添加浏览记录的dom
        addHistoryDOM: function () {
            var t = this;
            var defHtml = '<figure class="al-browseLogin"><span>您还没有登录，无法查看浏览记录</span><h6 class="ev-browseLoginBtn">去登录</h6></figure>';
            var hisHtml = '<section class="al-contentBrowseBox al-browseRecord"><section class="ev-browseRecordBox"></section><h6 class="al-browseMore ev-browseMore"><span>查看更多</span></h6><h6 class="al-browseAll hide">查看全部</h6></section>';
            if (!$("#sesCustomerId").val()) {//未登录
                $(".al-browseRecordBox").html(defHtml);
                $(".ev-browseLoginBtn").on("click", function () {
                    if ($("#ev-videoDetailCon").length) {
                        comm.players[0].player.pause();//暂停其他播放
                    }
                    user.login({
                        callback: function () {
                            if ($("#ev-videoDetailCon").length) {
                                comm.players[0].player.pause();//暂停其他播放
                            }
                            if ((location.host + location.pathname) === "www.allinmd.cn/" || location.href.lastIndexOf("html/video") > -1) {//首页登录
                                window.location.href = window.location.href;
                            }
                            if (window.location.href.match(/message_main/)) {//消息登录
                                scene.messageLogin();
                            }
                            //if(window.location.href.match(/video/)){//视频终端
                            //	scene.videoTerminal();
                            //}
                            scene.TopHeadLoginCallback && scene.TopHeadLoginCallback();
                        },
                        scene: privilegeSceneConst.eSceneTypeAuth,
                        onClose: function () {
                            if ($("#ev-videoDetailCon").length) {
                                comm.players[0].player.play();//暂停其他播放
                            }
                            if (window.location.href.match(/www.allinmd.cn\/$/g)) {	//首页登录
                                scene.indexLoginAndGetInfo().index_login();
                            }
                        },
                        onAuthCancel: function () {
                            if (window.location.href.match(/www.allinmd.cn\/$/g)) {	//首页登录
                                //scene.indexLoginAndGetInfo().index_login();
                                window.location.href = window.location.href;
                            }
                            scene.TopHeadAuthCancelCallback && scene.TopHeadAuthCancelCallback();
                        }
                    });
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "登录",
                        keyword: "去登录按钮",
                        actionId: 17
                    });
                })
            } else {//已登录
                $(".al-browseRecordBox").html(hisHtml);
                $(".al-headerSearchRecord").on("mouseover", function () {
                    if (!$(this).attr("hasLoad")) {
                        $(this).attr("hasLoad", true);
                        t.getBrowse(1);
                    }
                });
                var num = 2;
                $(".ev-browseMore").on("click", function () {
                    if (t.hasLoading) {//数据请求结束后在请求下一条
                        t.hasLoading = false;
                        t.getBrowse(num++);
                    }
                });
                $(".al-browseAll").on("click", function () {
                    window.location.href = "/pages/personal/personal_index.html?action=browsed";
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "浏览记录点击",
                        keyword: "查看全部浏览记录",
                        actionId: 39
                    });
                })
            }
        },
        //获取自己的浏览记录
        getBrowse: function (pageIndex) {
            var t = this;
            var data = {};
            data.browseTypes = "4,5,9,10";
            data.customerId = $("#sesCustomerId").val();
            data.dataFlag = 3;
            data.groupType = 1;
            data.pageIndex = pageIndex;
            data.pageSize = 10;
            data.platfrom = $('#sesDepartment').val() == undefined ? 1 : $('#sesDepartment').val();
            var param = {};
            param.paramJson = $.toJSON(data);
            $.ajax({
                type: "post",
                url: t.path.browse,
                data: param,
                dataType: "json",
                success: function (rep) {
                    t.hasLoading = true;//数据请求结束
                    if (rep && rep.responseObject.responseData && rep.responseObject.responseData.data_list) {
                        _length = rep.responseObject.responseData.data_list.length;
                        if (_length > 0) {
                            var list = rep.responseObject.responseData.data_list;
                            var html = t.getBroweHtml(list);
                            $(".ev-browseRecordBox").append(html);
                            if (_length < 10) {//小于10条直接显示查看全部
                                $(".ev-browseMore").remove();
                                $(".al-browseAll").show();
                            }
                        } else {
                            if (pageIndex == 1) {//第一页
                                $(".ev-browseMore").text("暂无浏览记录").off("click");
                            } else if (pageIndex == 2) {//第二页无数据
                                $(".ev-browseMore").remove();
                                $(".al-browseAll").show();
                            }
                        }
                    } else {
                        if (pageIndex == 1) {//第一页
                            $(".ev-browseMore").text("暂无浏览记录").off("click");
                        } else if (pageIndex == 2) {//第二页无数据
                            $(".ev-browseMore").remove();
                            $(".al-browseAll").show();
                        }
                    }
                    if (pageIndex == 3) {
                        $(".ev-browseMore").remove();
                        $(".al-browseAll").show();
                    }
                },
                error: function () {
                }
            });
        },
        getBroweHtml: function (data, n) {
            result = data;
            //计算今天日期     [{dayDescription : "今天",list: {数据}},]
            var currDate = comm.date.local_time().substr(0, 10);
            //组装数据
            var groupData = [
                {dayDescription: "今天", dataStyle: "today", dataStatus: false, list: []},
                {dayDescription: "昨天", dataStyle: "yesDay", dataStatus: false, list: []},
                {dayDescription: "更早以前", dataStyle: "longAgo", dataStatus: false, list: []}
            ];

            for (var i = 0; i < result.length; i++) {
                if (n && i >= n) {
                    break;
                }
                var srcDate = result[i].openTime.substr(0, 10);
                if (currDate == srcDate) {//今天
                    groupData[0].dataStatus = true;
                    groupData[0].dayDescription = "今天";
                    groupData[0].list.push(result[i]);
                } else if (Date.parse(currDate) - Date.parse(srcDate) == 86400000) { //昨天
                    groupData[1].dataStatus = true;
                    groupData[1].dayDescription = "昨天";
                    groupData[1].list.push(result[i]);
                } else { //更早以前
                    groupData[2].dataStatus = true;
                    groupData[2].dayDescription = "更早以前";
                    groupData[2].list.push(result[i]);
                }
            }
            var html = "";
            $.each(groupData, function (i, val) {
                html2 = '';
                if (val.dataStatus) {
                    $.each(val.list, function (j, o) {
                        if (o.browseType) {
                            switch (parseInt(o.browseType)) {
                                case 4:
                                    browseType = '视频';
                                    break;
                                case 5:
                                    browseType = '文库';
                                    break;
                                case 9:
                                    browseType = '话题';
                                    break;
                                case 10:
                                    browseType = '病例';
                                    break;
                                default :
                                    break;
                            }
                            html2 += '<article class="al-contentBrowseItem">' +
                                '<span>' + browseType + '</span><a href="' + o.browseUrl + '" target="_blank">' + comm.getStrLen(o.refName, 38) + '</a>' +
                                '</article>';
                        }

                    })
                }
                if (html2) {
                    var len = $(".ev-cBrowse").length;
                    if ($(".ev-cBrowse").eq(len - 1).attr("data-style") == val.dataStyle) {//style="margin-top:-25px"
                        html += '<section class="al-contentBrowse ev-cBrowse" data-style="' + val.dataStyle + '">' + html2 + '</section>';
                    } else {
                        html += '<section class="al-contentBrowse ev-cBrowse" data-style="' + val.dataStyle + '"><h2>' + val.dayDescription + '</h2>' + html2 + '</section>';
                    }

                }

            });
            return html;
        }
    };
    container.init(changeSite);
};
var checkInvalid = function (val) {
    if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
        return true;
    } else {
        return false;
    }
};
$(function () {
    var cid = checkInvalid($('#sesCustomerId').val()) ? "" : $('#sesCustomerId').val();
    var searchLayer = {
        el: {
            mainContainer: $(".al-mainInner"),
            searchBar: $(".al-headerSearch"),
            inputBar: $(".al-headerSearch input")
        },
        data: {
            openLayerOnOff: false,
            showOff: false,
            preWord: {},
            hotList: [],
            historyList: comm.cookie.get('searchHistoryList' + cid) ? JSON.parse(decodeURIComponent(comm.cookie.get('searchHistoryList' + cid))) : []
        },
        path: {
            hotSearch: '//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList'
        },
        init: function (left) {
            var t = this;
            t.bindInput();

        },
        checkInvalid: function (val) {
            if (((typeof val == 'string') && (val.length == 0)) || (val == undefined) || (val == 'undefined') || (val == 'null') || (typeof val == 'undefined') || (typeof val == 'null') || (val == null)) {
                return true;
            } else {
                return false;
            }
        },
        template: {
            searchContainer: "<section class=\"al-search-layer\">" +
            "    <article class=\"al-search-panel\" style=\"left:1000px;\">" +
            "        <section class=\"al-search-hot hide\">" +
            "            <h3 class=\"title\">热门搜索</h3>" +
            "            <ul class=\"al-hot-list\">" +
            "            </ul>" +
            "        </section>" +
            "        <section class=\"al-search-history hide\">" +
            "            <h3 class=\"title\">历史搜索</h3>" +
            "            <ul class=\"al-history-list\">" +
            "            </ul>" +
            "        </section>" +
            "<section class=\"al-search-lenovo hide\">" +
            "            <article class=\"lenovo-item\">" +
            "                <span>关节</span>普通字体普通字体" +
            "            </article>" +
            "</section>" +
            "    </article>" +
            "</section>"
        },
        bindInput: function () {
            var t = this;
            t.el.inputBar.off('focus').on('focus', function () {
                t.openLayer();
            });
            t.el.inputBar.off('blur').on('blur', function () {
                setTimeout(function () {
                    header.showPanel(4);
                }, 500);

            });
            /*$(".al-headerSearch input").off('blur').on('blur',function(){
                //console.log('失焦');
            });*/
            t.el.searchBar.find("b").off("click").on("click", function () {
                if (t.data.showOff) {
                    //此时属于弹出状态
                    header.showPanel(4);
                } else {
                    //此时属于搜索状态
                    header.showPanel(0);
                    var searchVal = $.trim($(this).siblings('input').val()).length <= 0 ? $(this).siblings('input').attr("placeholder") : $.trim($(this).siblings('input').val());
                    if (!($.trim($(this).siblings('input').val()).length <= 0 && $(this).siblings('input').attr("placeholder") === '搜索')) {
                        var _searchParam = searchVal;
                        if (_searchParam) {
                            location.href = "/pages/search/search.html?keyword=" + escapeReplace(_searchParam);
                        }
                    }

                }
            });
        },
        templateSearchPanel: function (container) {
            var t = this;
            var hotContainer = container.find('.al-hot-list');
            var historyContainer = container.find('.al-history-list');
            if (!t.data.openLayerOnOff) {
                hotContainer.hide().html('');
                hotContainer.parent().hide();
                historyContainer.parent().hide();
            } else {
                hotContainer.show().html(t.templateList(t.data.hotList));
                hotContainer.parent().show();
            }
            var cid = t.checkInvalid($('#sesCustomerId').val()) ? "" : $('#sesCustomerId').val();
            t.data.historyList = comm.cookie.get('searchHistoryList' + cid) ? JSON.parse(decodeURIComponent(comm.cookie.get('searchHistoryList' + cid))) : [];
            t.data.historyList = t.data.historyList.slice(0, 10);
            if (t.data.historyList.length) {
                var list = t.changeList(t.data.historyList);
                historyContainer.show().html(t.templateList(list));
                historyContainer.parent().show();
            } else {
                historyContainer.hide().html('');
                historyContainer.parent().hide();
            }
        },
        changeList: function (data) {
            var originalData = JSON.parse(JSON.stringify(data));
            for (var num = 0; num < originalData.length; num++) {
                var item = originalData[num];
                item.searchKey = decodeURI(item.searchKey);
            }
            return originalData;
        },
        handleItem: function () {
            var t = this;
            $(".al-search-item").off("click").on("click", function () {
                var searchWord = $(this).text();
                $(".al-headerSearch input").val(searchWord);
                //header.showPanel(0);
                location.href = "/pages/search/search.html?keyword=" + escapeReplace(searchWord);
            });
        },
        templateList: function (data) {
            //热门搜索
            var lastResultStr = '';
            $.each(data, function (index, item) {
                var recommendType = parseInt(item.recommendType, 10);
                var searchKey = htmlToString(item.searchKey);
                var recommendStr = '';
                if (recommendType === 1) {
                    recommendStr = 'recommend';
                } else if (recommendType === 2) {
                    recommendStr = 'Pre-filling';
                }
                lastResultStr += "<li class=\"al-search-item " + recommendStr + "\"><i class=\"icon\"></i>" + searchKey + "</li>";
            });
            return lastResultStr;
        },
        hideLayer: function () {
            var t = this;
            t.data.showOff = false;
            t.el.searchBar.removeClass('active');
            $(".al-search-layer").remove();
        },
        openLayer: function () {
            var t = this;

            if (!t.data.showOff) {
                t.data.showOff = true;
                $(".al-search-layer").remove();
                var isThis = $(this);
                t.el.searchBar.addClass('active');
                setTimeout(function () {
                    var searchLeft = $(".al-headerSearch").offset().left;
                    var layerElement = $(t.template.searchContainer);
                    t.templateSearchPanel(layerElement);
                    layerElement.find(".al-search-panel").css({left: searchLeft});
                    t.el.mainContainer.append(layerElement);
                    t.handleItem();
                    layerElement.show();
                    $(".al-search-layer").off("click").on("click", function (e) {
                        var _isThis = $(this);
                        var isContainer = $(e.target).hasClass('al-search-layer');
                        if (isContainer) {
                            header.showPanel(5);
                        }
                    });
                }, 500);
            } else {
                return false;
            }
        }
    };
    var header = {};
    header = {
        config: {},
        el: {
            sesCustomerId: $("#sesCustomerId"),
            sesNickname: $("#sesNickname"),
            sesAuth: $("#sesAuth"),
            sesDepartment: $('#sesDepartment')
        },
        path: {
            lenovo: '//gateway.allinmd.cn/base-customer-platform/cms/search/keyword/getMapListV3',
            getWebUser: PC_CALL + "web/user/getWebUser/",
            unitInfo: PC_CALL + "customer/unite/json_info/",
            keyLog: PC_CALL + "log/customer/keyword/createKeyword/",
            getMapList: PC_CALL + 'conference/index/getMapListV4/',//判断会议直播
            hotSearch: "//gateway.allinmd.cn/base-customer-platform/cms/search/hotkey/getMapList"//热门搜索
        },
        init: function () {
            var t = this;
            var windowWidth = $(window).width();
            if (windowWidth <= 1200) {
                $('body').addClass('al-sideBarExtend');
            }
            this.terminalBackBtnHide();
            this.addWeixin();
            comm.getHeaderLogin();
            this.research();
            //跳转到病历夹
            this.goEmr();
            this.siteSwitch();//手外科，骨科切换
            this.searchSubmit();
            this.goPersonal();
            this.appendRightDownBtn();
            setTimeout(function () {
                t.liveState();//是否有会议直播
            }, 1500);
            this.hotSearch();
            $(".al-headerTopNav a").eq($(".al-headerTopNav a").length - 1).on("click", function (evt) {
                //容错，如果是返回按钮，则不发送该埋点，当然我也不知道当时是什么场景会触发此操作
                //如果是“返回”按钮，则不发送此数据
                if($(evt.target).html().indexOf("返回") === -1){
                    comm.creatEvent({
                        triggerName: '多中心研究平台',
                        triggerType: "产品引流",
                        actionId: 110482,
                        async: false
                    });
                }
            });
            //返回
            $(".al-headerTopNav .al-backBtn").not('.Ev-ul-NavBarClick').find('a').on("click", function () {
                var authState = $("#sesAuth").val();
                if (!($(this).attr("href").indexOf("www.allinmd.cn") > 0)) {
                    if (location.pathname.indexOf('pages/singlePage/user/auth.html') > -1) {
                        var userRoleType = 1;
                        var _customerRole = TempCache.getItem("customerRole");
                        if (_customerRole == '12' || t.identity == 2 || t.medicalID == 11 || t.medicalID == 12 || t.medicalID == 13 || t.medicalID == 14 || t.medicalID == 15) {
                            userRoleType = 2;
                        }
                        if ($('#secondStep').css('display') == 'block' || $('.ev_exception').css('display') == 'block') {
                            if ($('.ev_exceptionMain').css('display') == 'block' && $('.ev_exception').css('display') == 'block') {
                                $('.ev_exception').hide();
                                $('#firstStep').show();
                            }
                            else if ($('.ev_exceptionPhone').css('display') == 'block') {
                                $('.ev_exceptionPhone').hide();
                                $('.ev_exceptionMain').show();
                            }
                            else {
                                $('#secondStep').hide();
                                if ($('.ev_exceptionMain').attr('data-isShow')) {
                                    $('.ev_exception,.ev_exceptionMain').show();
                                } else {
                                    $("#firstStep").show();
                                    comm.creatEvent({
                                        async: false,
                                        triggerType: "全站功能按钮点击",
                                        keyword: "返回",
                                        actionId: 41,
                                        browType: '10014',
                                        userRoleType:userRoleType
                                    });
                                }
                            }
                        }//后退是否显示选择角色弹层，可以根据 js/scene/singlePage/user/auth.js 中 firstAuthStep() 方法的逻辑同步
                        else if (authState && authState !== "2" && authState !== "8" && authState !== "9" && $('#firstStep').css('display') == 'block') {
                            comm.creatEvent({
                                async: false,
                                triggerType: "全站功能按钮点击",
                                keyword: "返回",
                                actionId: 41,
                                browType: '10014',
                                userRoleType:userRoleType
                            });
                            $('#firstStep').hide();
                            $('#roleSelectStep').show();
                        }
                        else {
                            //如果当前是角色选择页，则发送角色选择页的埋点数据
                            if($('#roleSelectStep').css('display') == 'block'){
                                comm.creatEvent({
                                    async: false,
                                    triggerType: "全站功能按钮点击",
                                    keyword: "返回",
                                    actionId: 41,
                                    browType: '395',
                                    userRoleType:userRoleType
                                });
                            }
                            if($('#firstStep').css('display') == 'block'){
                                comm.creatEvent({
                                    async: false,
                                    triggerType: "全站功能按钮点击",
                                    keyword: "返回",
                                    actionId: 41,
                                    browType: '10014',
                                   userRoleType:userRoleType
                                });
                            }
                            if (comm.getpara().isCustomerInfo) {
                                $.makeSurePopup({
                                    title: "",
                                    content01: "确认放弃认证变更吗？",//弹窗标题
                                    content: "现在放弃将丢失已修改的内容",//弹窗内容
                                    ensure: "放弃",//确认按钮文字内容 默认 “确认”
                                    cancel: "继续认证",//取消按钮文字内容 默认 “取消”
                                    ensureClass: 'al-msgDeleteConfirm',//确认按钮class
                                    cancelClass: 'al-msgDeleteCancel',
                                    callback: function () {
                                        history.back(-1);
                                    }
                                });
                            }
                            else {
                                $.makeSurePopup({
                                    title: "",
                                    content01: "确认放弃认证吗？",//弹窗标题
                                    content: "放弃认证将无法正常使用唯医",//弹窗内容
                                    ensure: "放弃",//确认按钮文字内容 默认 “确认”
                                    cancel: "继续认证",//取消按钮文字内容 默认 “取消”
                                    ensureClass: 'al-msgDeleteConfirm',//确认按钮class
                                    cancelClass: 'al-msgDeleteCancel',
                                    callback: function () {
                                        if (document.referrer) {
                                            var href = document.referrer;
                                            if (
                                                href.lastIndexOf("/html/video/") > -1 ||
                                                href.lastIndexOf("/html/doc/") > -1 ||
                                                href.lastIndexOf("/html/case/") > -1 ||
                                                href.lastIndexOf("/html/topic/") > -1
                                            ) {
                                                g_sps.jump(null, "/");
                                            } else {
                                                history.go(-1);
                                            }
                                        } else {
                                            g_sps.jump(null, "/");
                                        }
                                    }
                                });
                            }

                        }
                    }
                    else {
                        //非认证页面
                        if (document.referrer && document.referrer != "https://www.allinmd.cn/") {
                            if (history.length == 1) {
                                //返回到首页
                                g_sps.jump(null, "/");
                            } else {
                                history.back(-1);
                            }
                        } else {
                            //返回到首页
                            g_sps.jump(null, "/");
                        }
                    }
                }
                else if ((window.location.href.indexOf('channel') > -1 && location.pathname.indexOf('pages/singlePage/user/auth.html') == -1) ||
                    (window.location.href.indexOf('fellow_home') > -1 && location.pathname.indexOf('pages/singlePage/user/auth.html') == -1)
                ) {
                    //频道首页和进修页除外
                    if (window.location.href.indexOf('pages/channel/conference/meeting') > -1) {
                        comm.creatEvent({
                            async: false,
                            triggerType: "全站功能按钮点击",
                            keyword: "返回",
                            actionId: 41
                        });
                    }
                }
                else {
                    comm.creatEvent({
                        async: false,
                        triggerType: "全站功能按钮点击",
                        keyword: "返回",
                        actionId: 41,
                    });
                }

            });
            t.publishBtnAppend();
            t.handleMyCenter();
            //t.guidanceHeader();
        },
        //跳转到多中心
        research: function () {
            $(".al-headerTopNav li").eq(8).on("click", function () {
                user.login({
                    callback: function () {
                        g_sps.jump(null, "//research.allinmd.cn");
                    },
                    scene: privilegeSceneConst.eSceneTypeLogin,
                    onClose: function () {
                        if ($("#ev-videoDetailCon").length) {
                            comm.players[0].player.play();//暂停其他播放
                        }
                        if (window.location.href.match(/www.allinmd.cn\/$/g) || comm.getpara().from == "research") {	//首页登录
                            scene.indexLoginAndGetInfo().index_login();
                        }
                    },
                    onAuthCancel: function () {
                        if (window.location.href.match(/www.allinmd.cn\/$/g)) {	//首页登录
                            window.location.href = window.location.href;
                        }
                        scene.TopHeadAuthCancelCallback && scene.TopHeadAuthCancelCallback();
                    }
                });
                return false;
            });
            if (comm.getpara().from == "research" && $("#sesCustomerId").val()) {
                window.location.href = "//research.allinmd.cn";
            }
        },
        // 处理左侧栏我的按钮，角色为厂商时暂不能跳转至个人中心，仅显示 是否要退出的按钮
        handleMyCenter:function(){
			$(".al-mainSidebar .al-mainSidebarItem:eq(5) a").on('click',function(e){
			    var customerRole = TempCache.getItem("customerRole");
				var con = $(".al-mainSidebar .al-mainSidebarItem:eq(5)");
			    if(customerRole=="14" || customerRole=="15"){
					e.preventDefault();
					e.stopPropagation();
					console.log("my")
                    if($(".myQuitBox").size()==0){
						var html = "<aside class=\"myQuitBox\" >" +
							"   <div class='bubble-close'><i></i></div>" +
							"   <div class='bubble-title'>您是否要退出唯医？</div>" +
							"   <div class='quit-button'>退出登录</div>" +
							"</aside>"; /*style="display: none"*/

						con.append(html);
                        con.find(".bubble-close i").on("click",function () {
							con.find(".myQuitBox").hide();
						});
						con.find(".quit-button").on("click",function () {
							user.logout(function(){
								window.location.reload();
                            });

						});
                    }else{
						con.find(".myQuitBox").show();
                    }
                }
			});
        },

        //跳转病历夹
        goEmr: function () {
            $(".al-siteEmr").on("click", function () {
                if (comm.browser.isLessEqIe8()) {
                    comm.emrIEAlert();
                }
                else {
                    user.login({
                        callback: function () {
                            var href = TempCache.getItem("emr");
                            //跳转之前存放 customerRole，userName 到 cookie 中，方便病历夹中使用,userName和customerName相同
                            comm.cookie.deleteFn("customerRole");
                            comm.cookie.set("customerRole", TempCache.getItem("customerRole"), 365 * 5);
                            comm.cookie.deleteFn("customerName");
                            comm.cookie.set("customerName", encodeURI(TempCache.getItem("userName")), 365 * 5);
                            if (!href) {
                                href = "//emr.allinmd.cn";
                            }
                            TempCache.removeItem("emr");
                            g_sps.jump(null, href.replace("http:", ''));
                        },
                        scene:privilegeSceneConst.eSceneTypeCaseManage,
                        onClose: function () {
                            if ($("#ev-videoDetailCon").length) {
                                comm.players[0].player.play();//暂停其他播放
                            }
                            if (window.location.href.match(/www.allinmd.cn\/$/g) || comm.getpara().from == "emr") {	//首页登录
                                scene.indexLoginAndGetInfo().index_login();
                            }
                        },
                        onAuthCancel: function () {
                            if (window.location.href.match(/www.allinmd.cn\/$/g)) {	//首页登录
                                window.location.href = window.location.href;
                            }
                            scene.TopHeadAuthCancelCallback && scene.TopHeadAuthCancelCallback();
                        }
                    })
                }
            });
            if (comm.getpara().from == "emr") {
                TempCache.setItem("emr", document.referrer);
                setTimeout(function () {
                    $(".al-siteEmr").click();
                }, 1000);
            }
        },
        guidanceHeader: function () {
            var t = this;
            var discoverSideBar = $(".al-mainSidebarItem").eq(1);

            function appendDiscover() {
                if (discoverSideBar.find(".promptLeftNav").length === 0) {
                    var mask = $(".al-promptPopup");
                    if (mask.length === 1) {
                        if (TempCache.getItem("indexGuide")) {
                            discoverSideBar.append('<span class="promptLeftNav hide"><span>『发现』页面全面升级！<b>骨课精华全在这里</b><i class="ev-promptLeftNavClose"></i></span> </span>');
                            discoverSideBar.append('<span class="promptLeftNav"><span>『发现』页面全面升级！<b>骨课精华全在这里</b><i class="ev-promptLeftNavClose"></i></span> </span>');
                        } else {
                            discoverSideBar.append('<span class="promptLeftNav hide"><span>『发现』页面全面升级！<b>骨课精华全在这里</b><i class="ev-promptLeftNavClose"></i></span> </span>');
                        }

                    } else {
                        discoverSideBar.append('<span class="promptLeftNav"><span>『发现』页面全面升级！<b>骨课精华全在这里</b><i class="ev-promptLeftNavClose"></i></span> </span>');

                    }
                    $(".ev-promptLeftNavClose").off("click").on("click", function () {
                        if (!TempCache.getItem("discoverIndexTips")) {
                            TempCache.setItem("discoverIndexTips", "1");
                        }
                        $(".promptLeftNav").remove();
                    });


                }
            }

            if (!discoverSideBar.hasClass("active")) {
                // //console.log(localStorage.getItem("discoverIndexTips"))
                if (!TempCache.getItem("discoverIndexTips")) {
                    appendDiscover();
                }
            }

            return t;
        },
        //发布按钮追加展示
        publishBtnAppend: function () {
            if (!$.cookie("publishGuideShow")) {
                $.cookie("publishGuideShow", 'yes', {expires: 15});
            }
            var t = this,
                html = '<div class="al-publishBtn"><div class="ev-publishBtn"><i></i>发布</div></div>';
            $(".al-headerSearch").after(html);
            // $(".al-header").after('<div style="height: 70px;"></div>');
            if (module.videoUpload) {//上传插件存在时
                t.uploadClick();
            }
        },
        //手外科，骨科切换
        siteSwitch: function () {
            if (comm.browser.isIe8()) {//ie8不支持媒体查询
                if ($(window).height() < 800) {
                    $(".al-mainSidebarOtherList").css({'margin-top': '82px', 'position': 'static'});
                }
            }
            $(document).bind("click", function () {
                if ($(".al-siteEmr").hasClass("active")) {
                    $(".al-siteEmr").removeClass("active");
                }
                if ($(".al-siteSwitch").hasClass("active")) {
                    $(".al-siteSwitch").removeClass("active");
                    comm.creatEvent({
                        triggerType: '骨科&手外科切换(取消)',
                        keyword: "骨科&手外科切换(取消)",
                        actionId: 3
                    });
                }

            });
            $(window).bind("scroll", function () {
                if ($(".al-siteEmr").hasClass("active")) {
                    $(".al-siteEmr").removeClass("active");
                }
                if ($(".al-siteSwitch").hasClass("active")) {
                    $(".al-siteSwitch").removeClass("active");
                    comm.creatEvent({
                        triggerType: '骨科&手外科切换(取消)',
                        keyword: "骨科&手外科切换(取消)",
                        actionId: 3
                    });
                }
            });
            $(".al-mainSidebarOtherList li").eq(1).on("click", function () {
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                } else {
                    $(this).addClass("active");
                }
                comm.creatEvent({
                    triggerType: "骨科&手外科切换",
                    keyword: "骨科&手外科切换",
                    actionId: 2
                });
                return false;
            });
            $(".al_siteSwitch_popBox div").attr("on", "false");
            $(".al_siteSwitch_popBox div").on("click", function () {
                if ($(this).attr("on") == "false") {
                    var i = $(this).index();
                    TempCache.setItem("sesDepartment", i + 1);
                    //事件埋点
                    comm.creatEvent({
                        async: false,
                        triggerType: "骨科&手外科切换",
                        keyword: $(this).text(),
                        actionId: 3
                    });
                    if (/conference\/meeting_trailer.html/.test(window.location.href)) {
                        window.location.href = "/pages/channel/conference/meeting_trailer.html";
                    } else {
                        window.location.reload();
                    }
                }
                return false;
            });
            if (TempCache.getItem("sesDepartment") || $("#sesDepartment").val()) {
                var i = TempCache.getItem("sesDepartment") || $("#sesDepartment").val();
                $(".al_siteSwitch_popBox div").eq(i - 1).attr("on", "true");
                if (i == 2) {
                    $(".ev_siteSwitchName").text("手外科");
                    $(".al-headerTopNav li").eq(6).hide();
                    $(".al-headerTopNav li").eq(7).hide();
                    $(".al-headerTopNav li").eq(9).hide();
                }
                if ($("#sesDepartment").length == 0) {
                    $("body").append('<input type="hidden" id="sesDepartment" value="' + (i) + '">');
                } else {
                    $("#sesDepartment").val(i);
                }
            } else {
                $(".al_siteSwitch_popBox div").eq(0).attr("on", "true");
            }
        },
        //微信认证
        addWeixin: function () {
            var href = location.hostname + location.pathname;
            if (module.welcomeAuth == undefined) {
                $("body").append('<script src="/js/modules/weixin/module.welcome.auth.js"></script>');
                $("body").append('<script src="/js/modules/weixin/module.weixin.auth.js"></script>');
            }

        },
        //发布点击
        uploadClick: function () {
            var beforeEm;
            var mask = $(".al-promptPopup");
            var hideClass = "";
            // //console.log(mask.length,mask.css("display")==="block")
            if ((!TempCache.getItem("indexGuide")) && (mask.length === 1)) {
                hideClass = " hide";
            }
            var html = '<!--点击发布图标弹出框-->' + '<aside class="publishCont" style="display: none">' +
                '<ul>' +
                '<li class="live"><a href="/pages/live/live_create.html" class="ev-liveBtn"> <b></b><span>直播</span></a></li>' +
                '<li class="case"><a href="javascript:;" class="ev-caseUBtn"> <b></b><span>病例</span></a></li>' +
                '<li class="doc"><a href="javascript:;" class="ev-docUBtn"> <b></b><span>文库</span></a></li>' +
                '<li class="video"><a href="javascript:;" class="ev-videoUBtn"> <b></b><span>视频</span></a></li>' +
                '</ul>' +
                '</aside>'
            //'<aside class="al-publishGuide '+hideClass+'"><span>发布资源移动到这里啦！</span><b class="ev-publishGuideClose"></b></aside>';


            $(".al-publishBtn").append(html);
            $(".ev-publishGuideClose").off("click").on("click", function () {
                //$(".al-publishGuide").hide().remove();
                //TempCache.setItem("publishGuideHide",true);
                //$(".al-publishGuide").css({"display":"none"});
            });
            $(".ev-publishBtn").off("click").on("click", function (ev) {
                var customerRole = TempCache.getItem("customerRole");
                if(customerRole && (customerRole=="14" || customerRole=="15")){
					$.topTip({content:"此功能仅向医务人员开放",mark:'warn'});
                    return false;
                }
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    $(".publishCont").hide();
                } else {
                    $(this).addClass("active");
                    $(".publishCont").show();
                    //事件埋点
                    comm.creatEvent({
                        triggerType: "发布",
                        keyword: "发布",
                        actionId: 32
                    });
                    //$(".al-publishGuide").hide();
                    //TempCache.setItem("publishGuideHide",true);
                }
                ev.stopPropagation();
            });
            /*if($.cookie("publishGuideShow")&&$.cookie("publishGuideShow")=='yes'){
                if(TempCache.getItem("publishGuideHide")){
                    $(".al-publishGuide").hide();
                }else{
                    var mask = $(".al-promptPopup");
                    if((!TempCache.getItem("indexGuide"))&&(mask.length===1)){
                        $(".al-publishGuide").hide();
                    }
                    /!*console.log(
                        mask.length
                    )*!/
                    if(mask.length===0){
                        $(".al-publishGuide").show();
                    }
                }
            }else{
                $(".al-publishGuide").hide();
            }*/
            $(document).bind("click", function () {
                $(".ev-publishBtn").removeClass("active");
                $(".publishCont").hide();
            });
            $(".ev-liveBtn").on("click", function () {
                //事件埋点
                comm.creatEvent({
                    triggerType: "发布",
                    keyword: "发布直播",
                    actionId: 36
                });
            });
            //上传视频
            module.videoUpload({
                videoBtn: $(".ev-videoUBtn"),
                needAuth: 1,
                indexLogin: function () {//取消登录，取消认证时
                    if ((location.host + location.pathname) === "www.allinmd.cn/") {	//首页登录
                        if (!$(".publishCont").attr('hasLogin')) {
                            scene.indexLoginAndGetInfo().index_login();
                        }
                        if (!$(".publishCont").attr('reloadData')) {
                            scene.TopHeadLoginCallback && scene.TopHeadLoginCallback();
                        }
                    } else {
                        if (!$(".publishCont").attr('reloadData')) {
                            scene.TopHeadLoginCallback && scene.TopHeadLoginCallback(1);
                        }
                    }
                }
            });
            //上传病例
            $(".ev-caseUBtn").on('click', function () {
                comm.ieAlert("/pages/singlePage/upload-case.html");
            });
            //上传文档
            module.docUpload({
                docBtn: $(".ev-docUBtn"),
                indexLogin: function () {
                    if ((location.host + location.pathname) === "www.allinmd.cn/") {	//首页登录
                        if (!$(".publishCont").attr('hasLogin')) {
                            scene.indexLoginAndGetInfo().index_login();
                        }
                        if (!$(".publishCont").attr('reloadData')) {
                            scene.TopHeadLoginCallback && scene.TopHeadLoginCallback();
                        }
                    } else {
                        if (!$(".publishCont").attr('reloadData')) {
                            scene.TopHeadLoginCallback && scene.TopHeadLoginCallback(1);
                        }
                    }
                }
            });
        },
        //到个人中心
        goPersonal: function () {
            $(".al-mainSidebarItem").eq(4).find("a").on("click", function () {
            //    g_sps.jump(null, "/pages/personal/personal_index.html");  //2019-04-13
            })
        },

        //增加右下角按钮
        appendRightDownBtn: function () {
            var html = '<!--右下角按钮-->' +
                '<section class="al-backToTop">' +
                '<figure class="al-backToTopItem al-backToTopFirst ev-goTop">' +
                '</figure>' +
                '<figure class="al-backToTopItem ev-shareContainer hide">' +
                '分享' +
                '</figure>' +
                '<figure class="al-backToTopItem al-clickToShowErweiCode">' +
                '<i class="icon-erweiCodeBottom"></i>' +
                '<section class="al-shareBox al-erweiCodeShareBox hide">' +
                '<figure class="al-shareListItem">' +
                '<img src="//img10.allinmd.cn/v3/common/icon/newErWeiCode.jpg" alt="">' +
                '</figure>' +
                '<figcaption>唯医骨科官方微信</figcaption>' +
                '</section>' +
                '</figure>' +
                '</section>';
            $(".al-mainInner").append(html);
            if ($(document).scrollTop() > 100) {
                $(".ev-goTop").show();
            } else {
                $(".ev-goTop").hide();
            }
            this.scrollTop();
            this.officialErWei();
        },
        //官方二维码hover
        officialErWei: function () {
            var timer = null;
            $(".al-clickToShowErweiCode").on("mouseover", function () {
                timer = setTimeout(function () {
                    $(".al-erweiCodeShareBox").show();
                }, 300);
            });
            $(".al-clickToShowErweiCode").on("mouseout", function () {
                timer = setTimeout(function () {
                    $(".al-erweiCodeShareBox").hide();
                }, 300);
            });
            $(document).bind("click", function () {
                $(".al-erweiCodeShareBox").hide();
            })
        },
        //热门搜索
        hotSearch: function () {
            var t = this;
            var hotJson = {
                sortType: 1
            };
            $.ajax({
                type: "GET",
                url: t.path.hotSearch,
                data: hotJson,
                dataType: "json",
                success: function (data) {
                    if (data && data.responseObject && data.responseObject.responseData && (!$.isEmptyObject(data.responseObject.responseData))) {
                        var html = '搜索';
                        var preList = data.responseObject.responseData.preList;
                        var dataList = data.responseObject.responseData.dataList;
                        dataList.length > 0 ? (searchLayer.data.hotList = dataList) : ('');
                        if (preList.length > 0) {
                            searchLayer.data.preWord = preList[0];
                            html = htmlToString(preList[0]['searchKey']);
                        }
                        $(".al-headerSearch input").attr("placeholder", comm.getStrByteLen(html, 20));
                        if (preList.length === 0 && dataList.length === 0) {
                            searchLayer.data.openLayerOnOff = false;
                            searchLayer.el.inputBar.attr({"placeholder": '搜索'});
                        } else {
                            searchLayer.data.openLayerOnOff = true;
                        }
                    } else {
                        searchLayer.data.openLayerOnOff = false;
                        searchLayer.el.inputBar.attr({"placeholder": '搜索'});
                    }
                },
                error: function () {
                    searchLayer.data.openLayerOnOff = false;
                    searchLayer.el.inputBar.attr({"placeholder": '搜索'});
                }
            });
        },
        showPanel: function (type, html) {
            var t = this;
            var hotAndHistory = $(".al-search-history,.al-search-hot");
            var allPanel = $(".al-search-history,.al-search-hot,.al-search-lenovo");
            var lenovo = $(".al-search-lenovo");
            if (parseInt(type, 10) === 1) {
                hotAndHistory.hide();
                lenovo.html(html).show();
                $('.al-search-lenovo .lenovo-item').off("click").on("click", function () {
                    var searchWord = $(this).text();
                    $(".al-headerSearch input").val(searchWord);
                    t.showPanel(0);
                    location.href = "/pages/search/search.html?keyword=" + escapeReplace(searchWord);
                });
                lenovo.show();
            } else if (parseInt(type, 10) === 3) {
                allPanel.hide();
            } else if (parseInt(type, 10) === 4) {
                searchLayer.el.searchBar.removeClass('active');
                $(".al-search-layer").remove();
                (!searchLayer.checkInvalid(($(".al-headerSearch input").val().replace(/\s+/g, "")))) ? $(".al-headerSearch input").val('') : '';
                searchLayer.data.showOff = false;
            } else if (parseInt(type, 10) === 0) {
                searchLayer.templateSearchPanel($(".al-search-layer"));
                lenovo.html('').hide();
            } else if (parseInt(type, 10) === 5) {
                lenovo.html('').hide();
            }

        },
        searchSubmit: function () {
            var t = this;
            var searchInput = $(".al-headerSearch input");
            $(".al-headerSearch").append('<div class="al-searchContent"></div>');
            $(window).bind("click", function () {
                $(".al-headerSearch .al-searchContent").hide();
            });
            searchInput.on("click", function () {
                var href = window.location.href;
                if (href.lastIndexOf(".html") <= -1 || href.lastIndexOf("/channel") > -1 || href.lastIndexOf("/fellowship_home") > -1) {//首页
                    actionId = 8;
                } else if (href.lastIndexOf("/discover") > -1) {//发现
                    actionId = 9;
                } else {
                    actionId = 10;
                }
                //事件埋点
                comm.creatEvent({
                    triggerType: "搜索",
                    keyword: $(this).val(),
                    actionId: actionId
                });
            });
            var flag = true;
            var timer = null;
            searchInput.bind('compositionstart', function () {
                flag = false;
            });
            searchInput.bind('compositionend', function () {
                flag = true;
            });
            searchInput.bind("input propertychange keyup", function (event) {
                clearTimeout(timer);
                var _isThis = $(this);
                var searchParam = $.trim($(this).val());
                timer = setTimeout(function () {
                    if ((!searchLayer.checkInvalid((_isThis.val().replace(/\s+/g, "")))) && flag) {
                        searchFn(_isThis.val());
                    }
                }, 500);
                //输入框无输入值时隐藏联想提示框,否则当用户回车时搜索匹配的全部资源
                if ((searchParam.length <= 0) && (searchInput.attr('placeholder') === "搜索")) {
                    header.showPanel(0);
                } else {
                    if ((searchInput.val().length <= 0)) {
                        header.showPanel(0);
                    }
                    //当用户键入会车时搜索匹配的全部
                    if (event.keyCode == 13) {
                        if ((searchParam.length <= 0) && (searchInput.attr('placeholder') === "搜索")) {
                            return;
                        }
                        header.showPanel(0);
                        //事件埋点
                        comm.creatEvent({
                            async: false,
                            triggerType: "搜索",
                            triggerName: '搜索-成功',
                            keyword: $(this).val(),
                            actionId: 11044
                        });
                        if (searchLayer.checkInvalid(_isThis.val())) {
                            if (_isThis.attr('placeholder') !== "搜索") {
                                var href = "/pages/search/search.html?keyword=" + escapeReplace($.trim(_isThis.attr('placeholder')));
                                g_sps.jump(null, href);
                            }
                        } else {
                            var href = "/pages/search/search.html?keyword=" + escapeReplace($.trim(_isThis.val()));
                            g_sps.jump(null, href);
                        }
                    }
                }
            });
            searchLayer.init();//唯医3.2排期新增搜索功能，2018121416：18 张恒
            function isNull(val) {
                var parten = /^\s*$/;
                if (parten.test(val)) {//为空格或回车
                    return true;
                } else {
                    return false;
                }
            }

            function searchFn(searchParam) {
                var html = "";
                var lenoverJson = {
                    // "treeLevel":'',          //级别ID    （3-）
                    "searchParam": searchParam,        //搜索词
                    // "pageIndex":1,         //起始记录数
                    // "visitSiteId":"2",     // 站点id
                    // "pageSize":6,           //记录条数
                    // 'platformId': $('#sesDepartment').val()
                };
                $.ajax({
                    type: "GET",
                    url: t.path.lenovo,
                    data: lenoverJson,
                    dataType: "json",
                    success: function (data) {
                        if (data && data.responseObject && data.responseObject.responseData && !$.isEmptyObject(data.responseObject.responseData) && data.responseObject.responseData.dataList) {
                            var data_list = data.responseObject.responseData.dataList;
                            if (data_list && data_list.length > 0) {
                                $.each(data_list, function (i, val) {
                                    var propertyName = val.keyWord;
                                    var re = new RegExp(searchParam, "g");
                                    //var re =new RegExp("^\\d+" + searchParam + "$","gim");
                                    var lastPropertyName = propertyName.replace(re, '<span>' + searchParam + '</span>');
                                    html += '<article class="lenovo-item" href="javascript:;">' + lastPropertyName + '</article>';
                                });
                                if (searchParam.length > 0) {
                                    t.showPanel(1, html);
                                    /*$(".al-headerSearch .al-searchContent").show();
                                    $(".al-headerSearch .al-searchContent").html(html);*/
                                    //弹出下拉列表搜索0
                                } else {
                                }
                            } else {
                                //console.log('无匹配结果');
                                //搜索无匹配结果时下拉框隐藏
                                t.showPanel(0);
                            }
                        } else {
                            //console.log('无匹配结果');
                            t.showPanel(3);
                        }
                    },
                    error: function () {
                    }
                });
            }
        },

        //右下角按钮
        scrollTop: function () {
            var t = this;
            var b = 1;
            var timer = null;
            var url = location.hostname + location.pathname;//获取网站地址

            //回到顶部
            $(".ev-goTop").on("click", function () {
                MoveTop(0);
            });

            //回到顶部显示和隐藏
            $(window).bind("scroll", function () {
                if (b == 2) {
                    clearInterval(timer);
                }
                b = 2;
                if ($(document).scrollTop() > 100) {
                    $(".ev-goTop").show();
                } else {
                    $(".ev-goTop").hide();
                }
            });

            function MoveTop(target) {
                clearInterval(timer);
                var iSpeed = iCur = 0;
                timer = setInterval(function () {
                    iCur = document.documentElement.scrollTop || document.body.scrollTop;
                    iSpeed = (target - iCur) / 8;
                    iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                    if (iCur == target) {
                        clearInterval(timer);
                    } else {
                        document.documentElement.scrollTop = document.body.scrollTop = iCur + iSpeed;
                    }

                    b = 1;
                }, 30);
            }
        },
        terminalBackBtnHide: function () {//终端页返回按钮隐藏
            var pathname = location.pathname;
            if (/\/html\/(case|doc|video|topic)\//.test(pathname)) {
                $('.al-backBtn').hide();
            }
        },
        //判断会议是否有直播
        liveState: function () {
            var t = this,
                pathname = location.pathname;
            if (!/pages\/channel\/conference\/meeting_/.test(pathname)) {
                if (/pages\/channel/.test(pathname) || /html\/index\/fellowship\/fellowship_home.html/.test(pathname) || /^\/$/.test(pathname)) {
                    var paramData = {
                        scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                        pageIndex: 1,
                        pageSize: 0,
                        platformId: $('#sesDepartment').val() || 1
                    };
                    paramData = {
                        paramJson: $.toJSON(paramData)
                    };
                    $.ajax({
                        type: "post",
                        url: t.path.getMapList,
                        data: paramData,
                        dataType: "json",
                        success: function (data) {
                            if (data && data.responseObject && data.responseObject.responseStatus) {
                                if (data.responseObject.responseData.liveState == '1') {
                                    $('.al-headerTopNav li').eq(3).append('<i class="meetingI"></i>');
                                } else {
                                    $('.al-headerTopNav li').eq(3).find('i').remove();
                                }
                            }
                        },
                        error: function () {
                        }
                    });
                }
            }
        }
    };

    header.init();
});
