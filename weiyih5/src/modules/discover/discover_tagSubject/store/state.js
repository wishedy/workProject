import comm from "static/js/comm.js"
import TempCache from "static/js/tempcache.js"
const state = {
    wantFollow:false,
    noData:false,
    dataType:0,
    followState:0,
    tagId:comm.queryParam("tId"),
    baseInfo:"",
    confirmOption:false,
    propertyName:"",
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
    goShare:0,
    pageIndex:1
};

export default  state;