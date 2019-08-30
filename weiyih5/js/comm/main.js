/**
 * 站点类型配置存放
 * **/
var webdomain = "//"+location.host;
var weixinFlag=false;
//微信强制授权认证
function isWXBrowse() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("iphone") > 0) {
        weixinFlag = true;
        return "iphoneWX";
    } else if (ua.match(/MicroMessenger/i) == "micromessenger" && ua.indexOf("android") > 0) {
        weixinFlag = true;
        return "androidWX";
    }
    return "other";
}
isWXBrowse();
$.getCookie = function (key, options) {
    options = options || {};
    var result, decode = options.raw ? function (s) {
        return s;
    } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

window.version = "2.7.1.0";//版本号
var weburl_img00 = "//img01.allinmd.cn/";   //图片访问路径
var wapconfig = {
    isNeedLoginToWatchLive: [1, 1, 1, 1]                      // 是否需要登录 1-4会场，1-需要登录，0-不需要
};
// var phoneReg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
var phoneReg = /^1\d{10}$/;
var emailReg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

var M_CALL = webdomain+"/mcall/";
var base = {}; //基础
var comm = {}; //公共方法
var module = {}; //模块
var plugin = {}; //插件 不强制
var support = {}; //扩展支撑 不强制
var scene = {}; //场景 不强制
var specialCount = {};//特殊参数
var weixinJSConfig = {};//微信配置信息
comm.players = [];        //存放播放器
setTimeout(function () {
    weixinJSConfig = {};
}, 1000 * 60 * 5);   //5分钟更新一次，防止过多请求
//document.domain = "m.allinmd.cn";

var UseFlag = { //头像规格
    a: 1, //原图
    b: 2, //75% 压缩
    c: 3, //100*100
    d: 4, //150*150
    e: 5 //300*300
};

var Scene = { //场景 取图规则 只适用：话题/病例/回应
    a: 1,
    b: 2, //九宫格的取图规则
    c: 3,
    d: 4,
    e: 5 //单张图片
};
//视频
var userFlag = {
    a: 1,//原图,
    b: 2,  //原图压缩75%质量 _c
    c: 3,  // _c_d_225_150
    d: 4,
    e: 5,   //
    l: 12,  //_c_d_300_200
    m: 13,  //_c_t_450_300
    n: 14   //_c_t_750_500
};
//非视频
var AttUseFlag = { //非头像
    a: 1,  //原图,
    b: 2,  //原图压缩75%质量 _c
    c: 3,  // _c_d_150_150
    d: 4,  //_c_d_225_150
    e: 5,  //_c_d_300_200
    f: 6,   // _c_d_400_200
    g: 7,   //_c_t_200_200
    h: 8,   //_c_t_225_150
    i: 9,    //_c_t_300_200
    j: 10,  //_c_t_600_400
    k: 11,  //_c_t_75_75
    l: 12,    //_c_t_900_600
    m: 13,  //_c_t_450_300
    n: 14,   //_c_t_750_500
    o: 15   //_c_t_340_340
};

var ResouceType = { //资源类型
    all: 0,               		//. 全部
    video: 1,           		//. 视频
    doc: 2,    		        //. 文库
    meeting: 3,        		//. 会议
    topic: 4,           		//. 话题
    note: 5,                  //. 笔记
    tag: 6,                    //. 标签/tag/订阅
    caze: 7,                  //. 病例
    review: 8,               //. 评论/回应/回复
    person: 9                //. 人
};

var ResourseSortType = {  //排序
    sortDefaultType: 1,                 //. 默认排序
    sortNewType: 2,                     //. 最新发布
    sortReplyType: 3,                   //. 最多评论
    sortBrowseType: 4,                 //. 最多浏览
    sortMostPlayType: 4                //. 最多播放
};

var SceneType = { //场景
    searchSceneType: 1,          //搜索场景
    listSceneType: 2,          		//列表场景
    terminalSceneType: 3,       //终端场景
    outOfAppSceneType: 4       //App外场景
};

var CategoryType = {  //分类类型
    categoryTypeAll: 0,                       //全部
    categoryTypeLookAround: 1,         //随便看看
    categoryTypeProfessionTopic: 2,    //专业话题
    categoryTypeOperationVideo: 3,     //手术视频
    categoryTypeCourseVideo: 4,        //课程视频
    categoryTypeMeetingVideo: 5,       //会议视频
    categoryTypeExpertInterviews: 6   //专家访谈
};

/**
 * 角色常量定义
 * */
var privilegeRoleConst = {
    Visitor: 0,
    /* 系统 */
    System: 1,
    /*组织*/
    Organization: 2,
    /*厂商*/
    Manufacture: 3,
    /*患者*/
    Patient: 4,
    /*医师*/
    Doctor: 5,
    /*认证医师*/
    AuthedDoctor: 6
};

/**
 * 执行权限判断的各种场景常量
 * */
var privilegeSceneConst = {
    /**
     *   发布(资源)
     */
    eSceneTypePublic: 0,
    /**
     *  评论
     */
    eSceneTypeReview: 1,
    /**
     *  转发
     */
    eSceneTypeTransmit: 2,
    /**
     *  收藏
     */
    eSceneTypeCollect: 3,
    /**
     *  分享（资源) 转发
     */
    eSceneTypeShareResourse: 4,
    /**
     *  分享（医师）
     */
    eSceneTypeSharePerson: 9,
    /**
     *  赞（资源+评论）
     */
    eSceneTypePraiseResourse: 5,
    /**
     *  赞（医师）
     */
    eSceneTypePraisePerson: 7,
    /**
     *  关注
     */
    eSceneTypeAttention: 10,
    /**
     *  下载
     */
    eSceneTypeDownload: 11,
    /**
     *  查看上下文
     */
    eSceneTypeQueryUpDown: 12,
    /**
     *  绑定CAOS
     */
    eSceneTypeBindCAOS: 13,
    /**
     *  视频播放>3分钟.
     */
    eSceneTypeVideoPlay: 14,
    /**
     *  订阅
     */
    eSceneTypeSubscribe: 15,
    /**
     *  病例终端页
     */
    eSceneTypeCaseDetail: 16,
    /**
     *  话题终端页
     */
    eSceneTypeTopicDetail: 17,
    /**
     *  文库终端页
     */
    eSceneTypeDocDetail: 18,
    /**
     *  医师定考
     */
    eSceneTypeDingKao: 19,
    /**
     *  自己的个人主页
     */
    eSceneTypeMyHome: 20,
    /**
     *  他人的个人主页
     */
    eSceneTypeOtherHome: 21,
    /**
     *  消息
     */
    eSceneTypeMessage: 22,
    /**
     *  设置
     */
    eSceneTypeSetting: 23,
    /**
     *  视频终端页
     */
    eSceneTypeVideoTerminal: 24,
    /**
     *  添加联系人
     */
    eSceneTypeAddContact: 25,
    /**
     *  屏蔽动态
     */
    eSceneTypeShieldTrend: 26,
    /**
     *  关注列表
     */
    eSceneTypeAttentionList: 27,
    /**
     *  粉丝列表
     */
    eSceneTypeFansList: 28,
    /**
     *  订阅列表
     */
    eSceneTypeSubscribeList: 29,
    /**
     *  点赞列表
     */
    eSceneTypePraiseList: 30,
    /**
     *  视频直播
     **/
    eSceneTypeLiveShow: 31,
    /**
     *  发布资源-视频PK(PC)
     **/
    eSceneTypeVideoPK: 32,
    /**
     *  认证-fellow频道页(PC)
     **/
    eSceneTypeFellow: 34,
    /**
     * 只是认证
     * */
    eSceneTypeAuth: "auth",
    /**
     * 只是登录
     * */
    eSceneTypeLogin: "login",
    /**
     * 重新认证
     * */
    eSceneTypeReAuth: "reAuth"

};
/*
 * 分享日志场景枚举值
 * */
var shareSenceConst = {
    host: 1,                                 //1-主页
    video_index: 2,                          //2-视频应用页
    doc_index: 3,                            //3-文库应用页
    video_detail: 4,                         //4-视频内容页
    doc_detail: 5,                           //5-文库内容页
    personal_host: 6,                        //6-个人主页
    personal_index: 7,                       // 7-个人首页
    personal_info: 8,                        //8个人资料页
    topic_detail: 9,                         //9话题内容页
    case_detail: 10,                         //10病例内容页
    meeting_place: 11,                       //11会场页面
    comment: 12,                             //12评论内容页
    case_index: 13,                          //13-病例应用页
    topic_index: 14,                         //14-话题应用页
    fellow: 15,                              //15-fellowship应用页面
    doctor_exam: 16,                         //16-医师定考应用页面
    video_list: 17,                          //17-视频列表页面
    doc_list: 18,                            //18-文库列表页面
    topic_list: 19,                          //19-话题列表页面
    case_list: 20,                           //20-病例列表页面
    annual_detail: 21,                       //21-年会内容页面
    organization: 22,                        //22-组织应用页面
    manufactor: 23,                          //23-厂商应用页面
    meeting_live_places: 24,                 //24-会议直播页面-多会场
    meeting_live_list: 25,                   //25-直播列表页面
    meeting_playBack: 26,                    //26-会议回放页面
    login: 27,                               //27-登录
    regist: 28,                              //28-注册
    findPassword: 29,                        //29-找回密码
    doctor_index: 30,                        //30-医师频道页
    doctor_list: 31,                         //31-医师列表页
    search: 32,                              //32-搜索页面
    vPK: 33,                                 //33-视频pk页面
    search_list_all: 34,                     //34-搜索全部列表页
    search_list_case: 35,                    //35-搜索病例列表页
    search_list_video: 36,                   //36-搜索视频列表页
    search_list_topic: 37,                   //37-搜索话题列表页
    search_list_meeting: 38,                 //38-搜索会议列表页
    search_list_doctor: 39,                  //39-搜索医师列表页
    search_list_doc: 40,                     //40-搜索文库列表页
    resource_list_case: 41,                  //41-资源病例列表
    resource_list_topic: 42,                 //42-资源话题列表
    resource_list_video: 43,                 //43-资源视频列表
    resource_list_meeting: 44,               //44-资源会议列表
    resource_list_doc: 45,                   //45- 资源文库列表
    upload_list_case: 46,                    //46-发布病例列表
    upload_list_topic: 47,                   //47-发布话题列表
    upload_list_video: 48,                   //48-发布视频列表
    reply_list: 49,                          //49-回复内容列表
    friendCircle: 50,                        //50-朋友圈
    my_dynamic: 51,                          //51-我的动态
    others_dynamic: 52,                      //52-他人动态
    discover_by_major: 53,                   //53-按专业
    discover_by_disease: 54,                 //54-按疾病
    discover_by_operation: 55,               //55-按术式
    discover_by_type: 56,                    //56-按类型
    tag_subject: 57,                         //57-标签专题
    discover_by_subject: 58,                 //58-按专题
    discover_professor: 59,                  //59-权威专家
    discover_hotActivity: 60,                //60-热门活动
    others_index: 61                         //61-他人主页
    //169-新版活动页面，170-新版活动详情页
};
/*
 * 获取分享话术场景值 sceneType 获取分享话术场景值
 * */
var getShareContentSense = {
    search: 1,                               //1-搜索
    list: 2,                                 //2-列表
    subConference: 3,                        //3-分会场列表
    personal_center_release: 4,              //4-个人中心发布
    personal_center_reply: 5,                //5-个人中心回复
    terminal: 6,                             //6-终端页
    live_terminal: 7,                        //7-直播终端页
    playback_terminal: 8,                    //8-回播终端页
    reply_upload: 9,                         // 9-回复发布
    reply_comment: 10,                       //10-回复评论
    activity: 11,                            //11-参加活动
    share_reply: 12,                         //12-分享回复
    by_major: 13,                            //13-按专业
    by_type: 14,                             //14-按类型
    by_subject: 15,                          //15-按专题
    by_tagSubject: 16,                       //16-标签专题
    professor: 17,                           // 17-权威专家
    hot_activity: 18,                        //18-热门活动
    my_index: 19,                            //19-我的主页
    others_index: 20,                        //20-他人主页
    by_disease: 21,                          //21-按疾病
    by_opeartion: 22                         //22-按术式
};

$(document).bind("mobileinit", function () {
    if ($.mobile != undefined) {
        $.mobile.page.prototype.options.backBtnText = "后退";
        $.mobile.page.prototype.options.addBackBtn = true;
    }

});
//历史回退刷新问题
window.onpageshow = function(event) {
    if (event.persisted) {
        window.location.reload()
    }
};
$(function () {
    $(".l_logo").css("margin", "" + $(window).height() * 0.07 + "px auto " + $(window).height() * 0.07 + "px");
    if ($.mobile != undefined) {
        $.mobile.ignoreContentEnabled = true;
    }
    //comm.renderLinks();
    //comm.autoLogin();
    comm.autoLogin && comm.autoLogin();
    if (typeof FastClick == "function") {
        FastClick.attach(document.body); //防止点击事件点透
    }
    /*
     * 底部导航 ，发现加图标，1天过期
     * */
    (function () {
        var hasLoginDiscover = $.getCookie("hasLoginDiscover");
//假、真
        if (/\/discover\//.test(window.location.href) && hasLoginDiscover != "hasLoginDiscover") {//当前页面是发现页面加cookie
            $.setCookie("hasLoginDiscover", "hasLoginDiscover", {expires: 60 * 60 * 24});
            hasLoginDiscover = $.getCookie("hasLoginDiscover");
        }
        if (hasLoginDiscover != "hasLoginDiscover") {
            if ($('.al-footerBar').length > 0 && $('.icon-discoverEntryHot').length === 0) {
                $('.al-footerBar a').eq(1).append('<i class="icon-discoverEntryHot"></i>');
                //$('.al-footerBar a').eq(1).append('<span class="promptDiscover"><img src="//img50.allinmd.cn/v3/discover/prompt01.png"></span>')
                $('.al-footerBar a').eq(1).click(function () {
                    $.setCookie("hasLoginDiscover", "hasLoginDiscover", {expires: 60 * 60 * 24});//
                    $('.icon-discoverEntryHot').remove();
                    //$('.promptDiscover').remove();
                });
            }
        } else {
            $('.icon-discoverEntryHot').remove();
            //$('.promptDiscover').remove();
        }

        //5次之后隐藏发现页改版需求，上线反馈改为展示1次
        //var discoverSideBar = $(".al-footerBarItem").eq(1);
        //function appendDiscover(){
        //    if(discoverSideBar.find(".promptDiscover").length===0){
        //        discoverSideBar.append('<span class="promptDiscover"><img src="//img50.allinmd.cn/v3/discover/prompt01.png"></span>');
        //        if(!localStorage.getItem("discoverIndexTips")){
        //            localStorage.setItem("discoverIndexTips","1");
        //        }else{
        //            var num = parseInt(localStorage.getItem("discoverIndexTips"),10);
        //            num++;
        //            localStorage.setItem("discoverIndexTips",num+'');
        //        }
        //
        //    }
        //}
        //if(!discoverSideBar.hasClass("active")){
        //    if (!localStorage.getItem("discoverIndexTips")) {
        //        appendDiscover();
        //    }else{
        //        var num = parseInt(localStorage.getItem("discoverIndexTips"),10);
        //        if(num<5){
        //            appendDiscover();
        //        }
        //    }
        //}
        //$('.promptDiscover').on('click',function(event){
        //    event.preventDefault();
        //});
    })();

    /**
     * 百度统计
     */
    var _hmt = _hmt || [];
    (function () {
        if (/env=online/g.test(document.cookie)) {
            var hm = document.createElement("script");
            hm.src = "//hm.baidu.com/hm.js?71edc034f8bdd6704dbcdb7a5cdc79df";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    })();
    /*
     * 微信浏览器中分享出去的单页面返回首页，再返回退出浏览器
     * */
    (function () {
        var isW = navigator.userAgent.toLowerCase().indexOf('micromessenger') > -1;
        if (isW && (location.host + location.pathname) != "m.allinmd.cn/" && document.referrer == '') {//在微信浏览器中，并且非首页
            var nowHref = location.href;
            history.replaceState({page: "backPage"}, null, '//m.allinmd.cn/');
            history.pushState({page1: "backPage1"}, null, nowHref);
            window.addEventListener("popstate", function (e) {
                if (e.state && e.state.page == 'backPage') {
                    location.reload();
                }
            }, false);
        }
    })();
    /*
     * 唯医通行证创建成功提示
     * */
    (function () {   //此处try catch为了防止微信浏览器清空缓存之后第一次js加载不出来Tempcache报错问题（不加载原因不详）
        try {
            if (TempCache.getItem('firstRegist') && window.location.href.indexOf('wanshanInfoConference') == -1) {//如果是第一次注册
                if (TempCache.getItem('needAuthCompleted') == 'needAuthCompleted') {    //需要认证权限 并且认证成功 弹一次注册通行证成功，清除localstorage
                    TempCache.removeItem('firstRegist');
                    TempCache.removeItem('fromPageN');
                    TempCache.removeItem('needAuthRegist');
                    TempCache.removeItem('needAuthCompleted');
                } else if (!TempCache.getItem('needAuthRegist')) {    //不需要认证权限 直接弹
                    $('.ev-guide').hide();
                    comm.alertBox({
                        //mTitle: "成功创建唯医通行证",
                        //title: "您可使用通行证登录<br/>唯医、医栈、医鼎",
                        title: "成功创建唯医帐号",
                        ensure: '知道了',
                        ensureCallback: function () {
                            $('.al-confirmModalMask').remove();
                            $('.ev-guide').show();
                        }
                    });
                    TempCache.removeItem('firstRegist');
                    TempCache.removeItem('fromPageN');
                    TempCache.removeItem('needAuthRegist');
                } else{
                    TempCache.removeItem('firstRegist');
                }

            }
        } catch (e) {
            console.log('error');
        }
    })();
    //添加异常监控文件引用
    (function() {
        $("head").append('<script src="//paas.allinmd.cn/modules/arthas_monitor_report/arthas_monitor_report.js"></script>');
        /**
         * @description 配置项
         * token: '2', //必填,请根据具体站点传入siteId
         * limitTime:3000,   //相同异常日志发送最小间隔，即相同异常数据最快每3s发送一次
         *  checkImgSetIntervalTime: 10000, // 检查新增图片的间隔时间,默认10s
         *   transferSizeNum: 1024  //多大的图片算是大图标准 单位为kb 默认1兆
         */
        setTimeout(function () {
            if(typeof arthas_monitor === "object")  {
                arthas_monitor.init({
                    token: '2'
                });
            }
        },1000)
    })();
//添加sps文件引用
    (function () {
        $("head").append('<script src="//paas.allinmd.cn/modules/sps/sps.js"></script>');
    })();
});

var intransit = false;
