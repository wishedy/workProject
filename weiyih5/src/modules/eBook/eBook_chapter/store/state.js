import TempCache from "static/js/tempcache";
import comm from "static/js/comm";
const state = {
    ajaxing:false,
    shareData:{},
    docCount:'',
    deoCount:'',
    customerId:TempCache.getItem('userId') || "",
    bookId:comm.getpara().articleBook,
    status:1,
    viewDirection:'',
    routerData:''
};
export default  state;