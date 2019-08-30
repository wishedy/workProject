import TempCache from "static/js/tempcache.js";
import comm from 'static/js/comm';
const state = {
    searchList:"",
    searchData:JSON.stringify({"searchStr":"","associateOnOff":true}),
    confirmOption:"",
    shareConfig:{},
    selectedStr:"",
    allResource:"",
    mistakeWords:'',
    preWord:'',
    platformType:TempCache.getItem('department')||1,
    "allSortType":1,"caseSortType":1,videoSortType:1,meetingSortType:1,doctorSortType:1,docSortType:1,topicSortType:1,
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""

};

export default  state;