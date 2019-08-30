/**
 * 站点类型配置存放
 * **/
//手机邮箱验证
var allinEmailExp = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var allinMobileExp = /^1\d{10}$/;
window.version = "3.7.1.0";//版本号
var PC_CALL = "//"+location.hostname+"/call/";
var base = {}; //基础
var comm = {}; //公共方法
var module = {}; //模块
var plugin = {}; //插件 不强制
var support = {}; //扩展支撑 不强制
var scene = {}; //场景 不强制
document.domain = location.hostname;

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
    AuthedDoctor: 6,
    /*住陪学员*/
    LiveStudents:7,
    /*执业医师*/
    practitioner:11,
    /*护理角色，权限参考V1*/
    Nurse:12,
    /*医助角色，权限参考V1*/
    DoctorAssistance:13,
	/*未认证厂商*/
	NoCertifiedManufacture:14,
	/*已认证厂商*/
	CertifiedManufacture:15
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
	 *  工作站-病例管理
	 **/
	eSceneTypeCaseManage: 84,
    /**
     *  厂商无此权限(PC) 同发布权限
     **/
    eSceneTypeManufacture: 0,
    /**
     *  厂商有此权限(PC) 同赞列表权限
     **/
    eSceneTypeNeedManufacture: 30,
    /**
     *  登录厂商用户有此权限(PC)
     **/
    eSceneTypeNeedManufactureLogin: "manufactureLogin",
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
    eSceneTypeReAuth: "reAuth",
    /*
    * 医师和厂商 和医助
    * */
	eSceneDoctorAndCompany:'doctorAndCompany',
	/*
   * 仅医师
   * */
	eSceneDoctorOnly:'doctorOnly',
	/*
    * 排除厂商
    * */
	eSceneExceptManufacture:'ExceptManufacture'
};
/*
 * 分享日志场景枚举值
 * */
var shareSenceConst={
    host:1,                                 //1-主页
    video_index:2,                          //2-视频应用页
    doc_index:3,                            //3-文库应用页
    video_detail:4,                         //4-视频内容页
    doc_detail:5,                           //5-文库内容页
    personal_host:6,                        //6-个人主页
    personal_index:7,                       // 7-个人首页
    personal_info:8,                        //8个人资料页
    topic_detail:9,                         //9话题内容页
    case_detail:10,                         //10病例内容页
    meeting_place:11,                       //11会场页面
    comment:12,                             //12评论内容页
    case_index:13,                          //13-病例应用页
    topic_index:14,                         //14-话题应用页
    fellow:15,                              //15-fellowship应用页面
    doctor_exam:16,                         //16-医师定考应用页面
    video_list:17,                          //17-视频列表页面
    doc_list:18,                            //18-文库列表页面
    topic_list:19,                          //19-话题列表页面
    case_list:20,                           //20-病例列表页面
    annual_detail:21,                       //21-年会内容页面
    organization:22,                        //22-组织应用页面
    manufactor:23,                          //23-厂商应用页面
    meeting_live_places:24,                 //24-会议直播页面-多会场
    meeting_live_list:25,                   //25-直播列表页面
    meeting_playBack:26,                    //26-会议回放页面
    login:27,                               //27-登录
    regist:28,                              //28-注册
    findPassword:29,                        //29-找回密码
    doctor_index:30,                        //30-医师频道页
    doctor_list:31,                         //31-医师列表页
    search:32,                              //32-搜索页面
    vPK:33,                                 //33-视频pk页面
    search_list_all:34,                     //34-搜索全部列表页
    search_list_case:35,                    //35-搜索病例列表页
    search_list_video:36,                   //36-搜索视频列表页
    search_list_topic:37,                   //37-搜索话题列表页
    search_list_meeting:38,                 //38-搜索会议列表页
    search_list_doctor:39,                  //39-搜索医师列表页
    search_list_doc:40,                     //40-搜索文库列表页
    resource_list_case:41,                  //41-资源病例列表
    resource_list_topic:42,                 //42-资源话题列表
    resource_list_video:43,                 //43-资源视频列表
    resource_list_meeting:44,               //44-资源会议列表
    resource_list_doc:45,                   //45- 资源文库列表
    upload_list_case:46,                    //46-发布病例列表
    upload_list_topic:47,                   //47-发布话题列表
    upload_list_video:48,                   //48-发布视频列表
    reply_list:49,                          //49-回复内容列表
    friendCircle:50,                        //50-朋友圈
    my_dynamic:51,                          //51-我的动态
    others_dynamic:52,                      //52-他人动态
    discover_by_major:53,                   //53-按专业
    discover_by_disease:54,                 //54-按疾病
    discover_by_operation:55,               //55-按术式
    discover_by_type:56,                    //56-按类型
    tag_subject:57,                         //57-标签专题
    discover_by_subject:58,                 //58-按专题
    discover_professor:59,                  //59-权威专家
    discover_hotActivity:60,                //60-热门活动
    others_index:61,                         //61-他人主页
    special_detail:62,                      //62-专题详情
    column_detail:63,                        //63-活动详情
    live_index:64,                            //64-主播分享（正在直播）
    live_audience:65,                         //65-观众分享（正在直播）
    live_orderIndex:66,                       //66-主播分享（预约）
    live_orderAudience:67,                    //67-观众分享（预约）
    ebook_detail:68,                            //68-电子书书籍分享
    fellow_index:69,                            //69-进修应用页
    fellow_detail:70                           //70-进修内容页
};
/*
 * 获取分享话术场景值 sceneType 获取分享话术场景值
 * */
var getShareContentSense={
    search:1,                               //1-搜索
    list:2,                                 //2-列表
    subConference:3,                        //3-分会场列表
    personal_center_release:4,              //4-个人中心发布
    personal_center_reply:5,                //5-个人中心回复
    terminal:6,                             //6-终端页
    live_terminal:7,                        //7-直播终端页
    playback_terminal:8,                    //8-回播终端页
    reply_upload:9,                         // 9-回复发布
    reply_comment:10,                       //10-回复评论
    activity:11,                            //11-参加活动
    share_reply:12,                         //12-分享回复
    by_major:13,                            //13-按专业
    by_type:14,                             //14-按类型
    by_subject:15,                          //15-按专题
    by_tagSubject:16,                       //16-标签专题
    professor:17,                           // 17-权威专家
    hot_activity:18,                        //18-热门活动
    my_index:19,                            //19-我的主页
    others_index:20,                        //20-他人主页
    by_disease:21,                          //21-按疾病
    by_operation:22                         //22-按术式
};

$(function () {
    if (navigator.userAgent.indexOf("Mac OS X") > 0) {
        $("body").addClass("macFont");
    }
    //20190518唯医学院左侧边栏添加
    function addAllinmdCollege(){
        var collegeTxt = $(".al-mainSidebarItem").eq(1).text();
        if(!(collegeTxt.indexOf('唯医学院')>-1)){
            $(".al-mainSidebarItem").eq(0).after("<li class=\"al-mainSidebarItem\">\n" +
                "                    <a href=\"/pages/college/college_index.html\">\n" +
                "                        <img src=\"//img10.allinmd.cn/v3/common/sidebar/sidebar_college.png\" alt=\"\">\n" +
                "                        <figcaption>唯医学院</figcaption>\n" +
                "                        <article class=\"al-collapseItem\">\n" +
                "                            <p class=\"al-collapseItemText\">\n" +
                "                            </p><h4>唯医学院</h4>\n" +
                "                            <p>HOME</p>\n" +
                "                            <p></p>\n" +
                "                        </article>\n" +
                "                    </a>\n" +
                "                </li>")
        }
    }
    addAllinmdCollege();
    //添加异常监控文件引用
    (function() {
        var monitor_report = document.createElement("script");
        monitor_report.src = "//paas.allinmd.cn/modules/arthas_monitor_report/arthas_monitor_report.js";
        var report = document.getElementsByTagName("script")[0];
        report.parentNode.insertBefore(monitor_report, report);
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
                    token: '1'
                });
            }
        },1000)
    })();
    //添加sps文件引用
    (function() {
        var sps = document.createElement("script");
        sps.src = "//paas.allinmd.cn/modules/sps/sps.js";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(sps, s);
    })();
    if(!$.md5){
        $("body").append("<script src='/js/third-party/md5.js'></script>");
    }
    //修改footer二维码图片
    if($('.al-mainFooterErWeiCode').length>0){
        $('.al-mainFooterErWeiCode img').attr('src','/images/img10/v3/common/icon/newErWeiCode.jpg');
        $('.al-mainFooterErWeiCode img').css('width','98px');
        $('.al-mainFooterErWeiCode img').css('width','103px');
        setTimeout(function () {
            $('.al-mainFooterErWeiCode').css('visibility','visible');
        },100);
    }
});
