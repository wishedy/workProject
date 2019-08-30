
const state = {
    teamId:'',//团队id
    titleOnOFF:true, //判断第几步
    RemindingOnOff:false,//判断显示未审核提示信息
    showLoading:false,//判断显示未审核提示信息
    cliInputNone:false,//判断推荐点击
    requestOnOff:false,// 关闭审核弹层后重新请求
    pointerOnOff:false,// 判断左侧小红点是否显示
    remindingNum:0,//有新加入的成员邀请
};

export default  state;
