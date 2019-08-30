/**
 * 我关注的会议
 * Created by HJ on 2017/8/9.
 */
$(function () {
    //window.onload = Log.createBrowse(211, "我关注的会议"); //	浏览日志
    var cId = TempCache.getItem("userId");
    var authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
    var controller = {
        config:{
            pageSize:20
        },
        path: {
            getConferenceNum: M_CALL+'conference/index/getConferenceNum/',//我关注的会议数量接口
            getMapListV4: M_CALL+'conference/index/getMapListV4/'//我关注的会议接口列表
        },
        init: function () {
            var t = this;
            if (cId && authState == 2 || authState == 7 || authState == 8 || authState == 9 ) {//登录认证用户 authState == 1 ||
                t.getNumData();//关注的会议数目
            } else {//未登录用户，不提示登录，直接展示没有列表
                t.noListFunc();//暂无会议提示
            }
            t.backBtn();//返回按钮的返回和埋点
            t.shareLog();//微信端分享日志
        },
        //分享日志,只在微信浏览器端的分享
        shareLog: function () {
            shareAll({
                title: document.title,
                pic: 'https://m.allinmd.cn/image/allin_logo.png',
                summary: $('meta[name="keywords"]').attr('content'),
                fnMessageSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 4,
                        shareContent: document.title
                    });
                },
                fnTimelineSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 3,
                        refId: "",
                        isValid: 1,
                        shareSence: 25,
                        shareChannel: 5,
                        shareContent: document.title
                    });
                }
            }, true);
        },
        //页面左上角返回按钮
        backBtn:function(){
            $(".ev-backBtn").off("click").on("click",function(){
                comm.creatEvent({
                    triggerType:'全站功能按钮点击',
                    keyword:"返回",
                    actionId:41,
                    async:false
                });
                if(document.referrer!=""){
                    $(this).attr("href","javascript:"+history.back(-1)+";");
                }else{
                    $(this).attr("href","/");
                }
            });
        },
        //我关注的会议的列表数目
        getNumData:function(){
            var t=this;
            var cBack=function(rep){
                if(comm.hasResponseData(rep)&&rep.responseObject.responseData.data_list&&rep.responseObject.responseData.data_list.length>0){
                    var res=rep.responseObject.responseData.data_list[0];
                    if(res.holdedConfNum&&res.unholdedConfNum){//已进行和未进行的会议同时存在
                        $(".ev-alreadyPlay span").text(res.holdedConfNum);//已
                        $(".ev-noPlay span").text(res.unholdedConfNum);//未
                        t.getDataList(1);//会议状态（0-未进行，1-已进行）
                    }else if(res.holdedConfNum&&!res.unholdedConfNum){//只有已进行的会议
                        $(".ev-alreadyPlay span").text(res.holdedConfNum);
                        $(".ev-alreadyPlay").show().addClass("widthAdapt").siblings(".ev-noPlay").hide();//已
                        t.getDataList(1);//会议状态（0-未进行，1-已进行）
                    }else if(!res.holdedConfNum&&res.unholdedConfNum){//只有未进行的会议
                        $(".ev-noPlay span").text(res.unholdedConfNum);
                        $(".ev-noPlay").show().addClass("widthAdapt").siblings(".ev-alreadyPlay").hide();//未
                        t.getDataList(0);//会议状态（0-未进行，1-已进行）
                    }else{//两个都没有
                        t.noListFunc();//暂无会议提示
                    }
                }else{
                    t.noListFunc();
                }
            };
            comm.ajax.async(t.path.getConferenceNum,{paramJson: $.toJSON({sessionCustomerId:cId})},cBack);
        },
        //获取我关注的列表
        getDataList: function (flag) {
            var t = this;
            if (cId &&  authState == 2|| authState == 7 || authState == 8|| authState == 9 ) {//登录认证用户 authState == 1 ||
                var param = {
                    paramJson: $.toJSON({
                        scene:1,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	1
                        sessionCustomerId:cId,//用户ID
                        runState:flag,	//会议状态（0-未进行，1-已进行）
                        pageIndex:1,
                        pageSize: t.config.pageSize
                    })
                };
                var cBack = function (rep) {
                    if (comm.hasResponseData(rep) && rep.responseObject.responseData.data_list && rep.responseObject.responseData.data_list.length>0) {
                        var items = rep.responseObject.responseData;
                        if (flag==1) {//已进行的会议存储
                            t.dataItems1=items;//数据存储已进行的列表
                        } else {//未进行的会议存储
                            t.dataItems2=items;//数据存储未进行的列表
                        }
                        t.htmlDomFunc(items,0,flag);
                        t.listTabClick();
                    } else {
                        t.noListFunc();//接口没有返回数据的时候默认展示没有列表
                    }
                };
                comm.ajax.async(t.path.getMapListV4, param, cBack);
            } else {//未登录用户，不提示登录，直接展示没有列表
                t.noListFunc();
            }
        },
        //没有列表的时候展示无列表
        noListFunc: function () {
            $(".ev-fellowNone").show();
            $(".ev-meetingFellow").hide();
        },
        //列表的dom结构铺设
        htmlDomFunc: function (items,flag,param) {
            var t = this;
            var html = "";
            $.each(items.data_list, function (k, v) {
                html +='<li>' +
                    '<aside class="meetingTitle">' +
                    ( v.conTag ? '<span>' + v.conTag + '</span>' : '') +
                    '<a href="/pages/conference/meeting_detail.html?conId=' + v.conId + '" class="ev-meetingName">' + comm.getStrLen(v.conName, 40) + '</a></aside>' +
                    '<aside class="meetingTime">'+ (!v.startTime && !v.endTime ? '' : '<p class="mTime">' +comm.date.dateLocalJoint(v.startTime, v.endTime, "/", "-", true)+ '</p>') +
                    (v.conAddr ? '<p class="mAddress">' + v.conAddr + '</p>' : '') + '</aside></li>';
            });
            var _kv = $(".ev-meetingList ul");
            if (flag) {//来自瀑布流
                _kv.append(html);
            } else {//来自正常铺设
                _kv.html(html);
                //分页判断
                if (items.total && parseInt(items.total) > 20) {
                    _kv.attr("scrollPagination", "enabled");
                    t.scrollPage(param);
                } else {
                    _kv.attr("scrollPagination", "disabled");
                }
            }
        },
        //顶部tab切换点击事件
        listTabClick:function(){
            var t=this;
            $(".ev-tabClickBtn").off("click").on("click",function(){
                if($(this).hasClass("ev-noPlay")){//未进行的列表点击事件
                    if(t.dataItems2){
                        t.htmlDomFunc(t.dataItems2);
                    }else{
                        t.getDataList(0);
                    }
                    comm.creatEvent({
                        triggerType: '会议tab',
                        triggerName:"我关注的会议tab",
                        keyword: "未进行",
                        actionId: 11012
                    });
                }else{//已进行的列表点击事件
                    if(t.dataItems1){
                        t.htmlDomFunc(t.dataItems1);
                    }else{
                        t.getDataList(0);
                    }
                    comm.creatEvent({
                        triggerType: '会议tab',
                        triggerName:"我关注的会议tab",
                        keyword: "已进行",
                        actionId: 11012
                    });
                }
                $(this).addClass("active").siblings().removeClass("active");
            });
        },
        //瀑布流滚动加载列表
        scrollPage: function (flag) {
            var t = this;
            var pageIndex = 2;
            var param = {
                scene:1,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	1
                sessionCustomerId:cId,//用户ID
                runState:flag,	//会议状态（0-未进行，1-已进行）
                pageIndex:pageIndex,
                pageSize:t.config.pageSize
            };
            $(".ev-meetingList").off("scroll").scrollPagination({
                'contentPage': t.path.getMapListV4,
                'contentData': $.extend(param, {
                    pageIndex: function () {
                        return pageIndex++;
                    }
                }),
                'scrollTarget': $(window),
                'heightOffset': 0,
                'delaytime': 0,
                'type': "post",
                'beforeLoad': function () {
                    comm.loading.show();
                },
                'afterLoad': function (elementsLoaded) {
                    comm.loading.hide();
                },
                'loader': function (data) {
                    if ($.isEmptyObject(data)) {
                        $(".ev-meetingList").attr("scrollPagination", "disabled");
                        return false;
                    } else {
                        if ($.isEmptyObject(data.responseObject.responseData) || (data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length == 0)) {
                            $(".ev-meetingList").attr("scrollPagination", "disabled");
                            return false;
                        } else {
                            var items=data.responseObject.responseData;
                            t.htmlDomFunc(items,1);
                        }
                    }
                }
            });
        }
    };
    controller.init();
});
