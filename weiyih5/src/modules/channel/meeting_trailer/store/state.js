
const state = {
    nowMouth:new Date().getMonth() + 1,//时间
    meetingState:true,
    subjectTeamId:'',//专业
    runState:'',//会议状态（0-未进行 1-已进行）
    shootState:'',//拍摄状态（0-不拍摄，1-拍摄）
    scrNoRe:false,//筛选无结果
    monthNoRe:false,//本月无会议
    monthChange:false,//区分月份和筛选点击
    scrChange:false,//筛选点击，
    majorName:"专业",
    stateName:"会议状态",
    isLive:false,//唯医合作按钮是否激活
};

export default  state;