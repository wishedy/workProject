import TempCache from "static/js/tempcache.js"
const state = {
    loading:false,
    recommendTeacher: "",
    woundTeacher: "",
    spineTeacher: "",
    jointTeacher: "",
    customerId:TempCache.getItem("userId") != null ? TempCache.getItem("userId") : "",
    department:TempCache.getItem("department") != null ? TempCache.getItem("department") : 1
};

export default  state;