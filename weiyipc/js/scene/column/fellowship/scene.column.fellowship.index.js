/**
 * 功能描述： fellowship频道首页
 * 使用方法:
 * 注意事件：
 * 引入来源：  作用：
 *
 * Created by HeJing on 2015/12/24.
 */
$(function () {
    module.bannerCarousel();    // 幻灯片(模板生成)
    $(".banner-inner li").on("click",function(){
        //事件埋点
        comm.creatEvent({
            async:false,
            triggerType:"广告",
            keyword:"进修首页轮播图",
            actionId:14
        });
    });
    var controller = {
        config: {
            pageSize:10
        },
        path:{
            mainListUrl: PC_CALL + "/fellowship/main/json_list/",//活动列表
            shareDes: PC_CALL + "comm/data/share/getMapList3/"//分享话术
        },
        init: function () {
            var t = this;
            t.shareEvent();//分享事件
            t.myRegistrationClick();//我的报名按钮点击
            t.tabClickChange();
            var opts={};
            opts.param={
                fellowshipMainType:"",
                fellowshipMainIdLimit:1,
                pageIndex:1,
                pageSize: t.config.pageSize
            };
            opts.cNum=0;
            t.pageNumberClick(opts);//首次默认请求全部进修消息
        },
        //分享事件
        shareEvent:function(){
            var t = this;
            shareSence= shareSenceConst.fellow_index;
            var sinaTitle=""; var qqTitle=""; var qZoneTitle="";
            module.share({
                container: $(".ev-shareContainer"),// 存放分享组件的父级
                type: 2,// 默认为 1  1 ：社交分享  2 ：页面左下角全站分享 3.终端页面的固定分享
                url: window.location.href,// 分享链接， 默认取当前页链接
                noShareWeixin: true,//不需要分享到微信
                h5Url: "",//h5页面的链接会生成微信二维码
                shareTrend: 0,//0: 不需要站内动态分享  1 ：需要站内动态分享
                trendUrl: "",// 分享到站内动态的接口
                data: {},// 分享到站内动态的接口参数
                callback: function () {},// 分享到站内动态成功后回调函数
                shareSinaSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 3,
                        shareContent: sinaTitle
                    });
                },
                shareQQSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 2,
                        shareContent: qqTitle
                    });
                },
                shareQzoneSuc: function () {
                    comm.shareLog({
                        shareType: "",
                        resourceId: "",
                        resourceType: 0,
                        refId: "",
                        shareSence: shareSence,
                        shareChannel: 1,
                        shareContent: qZoneTitle
                    });
                },
                triggerRequest:function(content){//事件点击
                    //获取分享话术
                    var o = {visitSiteId:1,useFlag:1,sceneType:28,resourceType:0};
                    $.ajax({
                        url: t.path.shareDes,
                        type: "post",
                        data: {paramJson: $.toJSON(o)},
                        dataType: 'json',
                        async:false,
                        success: function (d) {
                            if (d && d.responseObject.responseData && !$.isEmptyObject(d.responseObject.responseData) && d.responseObject.responseData.data_list.length) {
                                var item = d.responseObject.responseData.data_list[0];
                                content.pic = item.share_comm.shareImageUrl;
                                content.title=item.share_comm.shareTitle!=""?item.share_comm.shareTitle:document.title;
                                $.each(item.share_channel,function(i,el){
                                    if(el.shareChannel=='Sina'){
                                        sinaTitle=content.sinaTitle=el.shareDesc;
                                    }else if(el.shareChannel=="QQFriend"){
                                        qqTitle=content.qqTitle = el.shareTitle;
                                        content.qqSummary = el.shareDesc;
                                    }else if(el.shareChannel=="QZone"){
                                        qZoneTitle=content.qqZoneTitle=el.shareTitle;
                                        content.qqZoneSummary = el.shareDesc;
                                    }
                                });
                            }
                        }

                    });
                }
            });
        },
        //分页点击
        pageNumberClick:function(opts){
            var t=this;
            var PageClick = function (pageclickednumber) {
                opts.param.pageIndex=pageclickednumber;
                t.fellowListRender(opts,function(pageCount){
                    $(".pager").eq(opts.cNum).pager({
                        pagenumber: pageclickednumber,
                        pagecount: pageCount,
                        buttonClickCallback: PageClick
                    });
                });
            };
            t.fellowListRender(opts,function(pageCount){
                $(".pager").eq(opts.cNum).pager({
                    pagenumber: 1,
                    pagecount: pageCount,
                    buttonClickCallback: PageClick
                });
            });

        },
        //进修列表请求
        fellowListRender: function (opts,fn) {
            var t = this;
            var paramData = {paramJson: $.toJSON(opts.param)};
            var callback = function (data) {
                if (data && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length > 0) {
                    var items = data.responseObject.responseData.data_list;
                    $(".Ev-fellowListAdd").eq(opts.cNum).html(t.mainListAddHtml(items)).show().siblings(".Ev-fellowListAdd").hide();
                    var pageCount=Math.ceil(data.responseObject.responseData.totalCount/ t.config.pageSize);
                    fn&&fn(pageCount);
                }else{
                    $(".Ev-fellowListAdd").eq(opts.cNum).html('<div style="background: #fff;padding: 200px 50px;"><img src="/images/img00/fellow/fs_v2/fs_notList.png" style="margin: 0 auto;display: block;"></div>').show().siblings(".Ev-fellowListAdd").hide();
                    $(".pager").eq(opts.cNum).html("");
                }
            };
            comm.ajax.async(t.path.mainListUrl,paramData, callback);
        },
        //进修列表dom结构铺设
        mainListAddHtml:function(items){
            var t=this;
            var html="",stateClass,kv;
            $.each(items,function(i,e){
                if(e.fellowshipMainState==3){//活动结束
                    stateClass="end_gry";
                }else if(e.fellowshipMainState==1){//活动正在进行中
                    stateClass="now_org";
                }else {//2 活动即将开始
                    stateClass="start_gre";
                }
                kv=e.fellowshipMain;
                html+=' <div class="fs_cont_l_ads fs_pos">'+
                    '<a href="'+(e.fellowshipMainState==2?'javascript:;':kv.fellowshipMainUrl) +'" target="_blank" title="'+kv.fellowshipMainName+'">'+
                    '<img src="'+ kv.fellowshipMainPicUrl+'"/>'+
                    '</a>'+
                    '<div class="fs_cor_bg  '+stateClass+'">'+
                    '</div>'+
                    '</div>';
            });
          return html;
        },
        //国内外培训进修点击
        tabClickChange:function(){
            var t=this;
            var opts={};
            var _i;
            $(".Ev-liClickBox li").off("click").on("click",function(){
                if(!$(this).hasClass("activeLi")){
                    _i=$(this).index();
                    $(".Ev-pageContainer").eq(_i).show().siblings(".Ev-pageContainer").hide();
                    $(this).addClass("activeLi").siblings("li").removeClass("activeLi");
                    opts.param={
                        fellowshipMainType:_i==0?"":_i,
                        fellowshipMainIdLimit:1,
                        pageIndex:1,
                        pageSize: t.config.pageSize
                    };
                    opts.cNum=_i;
                    t.pageNumberClick(opts);//导航点击修改请求
                }
            });
        },
        //我的报名按钮点击
        myRegistrationClick: function () {
            var t = this;
            var val = $("#sesCustomerId").val();
            var auth = $("#sesAuth").val();
            $(".Ev-MyApplyBtn").on("click", function () {
                if (val != "" && (auth==2 || auth==7 || auth==8 || auth==9)) {//已经登录
                    g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                } else {//还未登录
                    user.login({
                        callback: function () {
                            g_sps.jump(null,"/pages/column/fellowship/fellowship_registration.html");
                        },
                        onAuthCancel: "back",
                        scene: privilegeSceneConst.eSceneTypeFellow,
                        stay:true
                    });
                }
            });
        }
    };
    controller.init();
});