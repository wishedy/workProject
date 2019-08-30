
const state = {
    conSubInfo:{},
    authority:-1,//直播权限
    loadOnOff:false,
    liveNum:0,//当前实时在线人数
    agendaList:{},
    agendaStatus:-1,//日程数据未请求,0无数据，1有数据
    num:0,
    liveStatus:-1,//直播状态，-1准备，0结束，1开始
    queryJson:{},//地址栏query参数
    chatTemMsg:'',//保存每次聊天的发送消息
    documentType:-1,//文档模式，-1未启动，0无文档，1有文档
    liveType:-1,//-1代表未启动当前的直播类型0直播1回播
    tabIndex:-1,
    nothingOnOff:false,//是否是完全没有数据，适用于回播，既没有日程也没有文档
    landscape:false,//竖屏：false，横屏：true
    windowWidth:0,//当前屏幕的宽度
    windowHeight:0,//当前屏幕的高度
    chatList:[],//当前聊天接收的消息数
    conferenceId:{}//会议相关主会分会id
};

export default  state;