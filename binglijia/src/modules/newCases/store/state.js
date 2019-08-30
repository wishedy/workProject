import comm from '~utils/comm.js';
const state = {
    numberModuleCount:1,
    handleBaseOnOff:false,
    num:0,
    doctorId:-1,
    selectIndexJson:{
        HandleId:0
    },
    CaseTemBelongType:0,
    pushTplate:false,
    editType:-1,//-1是默认值，0代表新建病历，1代表修改病历
    navHeight:43,//代表顶部tab栏的高度
    CaseId:-1,//代表本次病历id
    CaseDataId:-1,
    changeTemplateIdType:'0',
    templateId:-1,//代表本次病历使用的模板
    pageIndex:-1,//代表路由页面的索引值，初始为基本信息-1，
    subIndex:-1,
    wantChangeIndex:-1,//tab预跳转的保留参数
    saveStatus:0,
    teamList:[],//用户所属团队列表
    uploadState:{},
    editTypeNum:0,
    assistantDoctor:parseInt(comm.cookie.get("customerRole"))===13,
    customerName:decodeURI(comm.cookie.get("customerName")),
    ownerCustomerId:0,
    templateAssemblePageOnOff:false,
    teamCustomerId:0,
    toastText:'',
    toastState:false,
    Relationship:{},
    tabList:[],//顶部动态tab栏数据
    tagIdList:'',//存储在有caseid的情况下的新建标签
    tagIdSelectList:'',
    baseInfoTagIdSelectList:'',
    changePageOnOff:false,//当他改变为false的时候说明那个页面有错误
    isChangeOnOff:false,//标识当前页面数据是否发生变化
    isEmptyBase:false,
    clickNum:0,
    teamId:-1,
    canSaveBaseData:{},//每次保存新建病历基本信息的数据时将数据临时存储在这里
    copyModelData:{},//可添加页面里的模板数据
    layerIndex:-1,//标识页面弹窗显示与否的变量
    CaseBelongType:-1,
    changeTemplateIdOnOff:false,
    imageErrorState:{},
    videoErrorState:{},
    temTeamData:{},
    numberList:{},//存储当前的基本信息证件类型号
    numberTrigger:0,//触发基本信息证件号校验的字段，每次加加
    baseInfo:{
    },
    isOwner:false,
    globalEvent:0,//全局点击的时候在这里触发
    loadingOnOff:false,//loading状态
    subPageData:[],//页面从后台获取的原始值
    pageInfo:{
      pageId:'',
      pageName:'',
      pageData:Object//页面当时修改的值将在这里保存
    },
    'titleName':'填写患者基本信息'//header栏的名字动态改变
};
export default state;
