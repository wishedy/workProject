import TempCache from "static/js/tempcache.js"
const state = {
    courseInfo: "",
    catalog: "",
    related: "",
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
    popupConfig:""
};

export default  state;