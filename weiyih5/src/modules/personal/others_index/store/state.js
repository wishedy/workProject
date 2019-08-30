import TempCache from "static/js/tempcache.js"
import comm from "static/js/comm"
const state = {
    confirmOption:false,
    isEnsure:false,
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
    otherId:comm.getpara().cid && comm.getpara().cid.replace(/"/g,""),
    platformType:TempCache.getItem('department')||1,
    public:{},
    resourceType:{},
    issuccess:false,
    eventList:[],
    isAjax:[],
    iscontentTab:false,
    isHeader:false
};
export default  state;