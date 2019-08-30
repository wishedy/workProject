import TempCache from "static/js/tempcache"
const state = {
    pageType:{'messageIndex':0,'messageFollow':1,'messageRemind':2,'messagePraise':3,'messageReview':4},  //个页面参数
    customerId:TempCache.getItem('userId') || "",
    platformId:TempCache.getItem("department")||1,
    acceptData:{},
    isShowCompile:false,    //头部左上角string[编辑]、[取消]、[不展示]
    compileOrCancel:false,  //编辑还是取消
    count:0,                //计数
    isAllDelete:false,      //否全部删除
    deleteListIdGather:'',  //存储删除ID
    isDelete:false,         //是否已经删除，
    isLoading:false,        //是否展示Loading效果
    isCheckall:false,       //是否是[全选]二字还是[取消全选]
    headerHeight:''
};

export default  state;