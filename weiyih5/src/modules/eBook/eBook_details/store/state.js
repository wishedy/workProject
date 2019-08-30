import comm from "static/js/comm";
import TempCache from "static/js/tempcache";
const state = {
    bookstate:{},
    name:'',
    ajaxing:false,
    bId:comm.getpara("?").bId || "",
    customerId:TempCache.getItem('userId') || "",
    urlData:{},
    articleNum:"",
    catlogNum:"",
    reviewNum:"",
    onlyComment:false
};
export default  state;