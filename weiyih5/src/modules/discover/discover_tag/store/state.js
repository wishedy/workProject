import TempCache from "static/js/tempcache.js"
const state = {
    onSearch:false,
    completed: false,
    firstLoading:false,
    loading:false,
    pageIndex:1,
    pageSize:20,
    searList:"",
    searchStr:"",
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : ""
};

export default  state;