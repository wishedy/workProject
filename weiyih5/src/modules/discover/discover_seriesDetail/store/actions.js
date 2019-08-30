import comm from 'static/js/comm.js'
import axios from "axios"

const xhrUrl = {
    banner: "/mcall/cms/course/getCourseAuthorList/",
    catalog: "/mcall/cms/course/getCatalogList/",
    related:"/mcall/cms/course/getThisTeamPreferList/"
};
const courseId = comm.queryParam("tId");
const  actions = {
    getCourseInfo:({commit,state})=>{
        if(state.courseInfo.length){
            return false;
        }else{
            axios({
                url: xhrUrl.banner,
                method: "POST",
                data: {"courseId":courseId,"customerId":state.customerId,"isValid":1},
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 30000
            }).then(function(res){
                state.courseInfo = JSON.stringify(res.data.responseObject.responseData);
            });
        }
    },
    getCatalog:({commit,state})=>{
        if(state.catalog.length){
            return false;
        }else{
            axios({
                url: xhrUrl.catalog,
                method: "POST",
                data: {"courseId":courseId, "customerId":state.customerId, "isValid": 1},
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 30000
            }).then(function(res){
                state.catalog = JSON.stringify(res.data.responseObject.responseData);
            });
        }
    },
    getRelated:({commit,state})=>{
        if(state.related.length){
            return false;
        }else{
            axios({
                url: xhrUrl.related,
                method: "POST",
                data: {
                    "courseId": courseId,
                    "customerId": state.customerId,
                    "isValid": 1,
                    "sortType": 5,
                    "pageIndex": 1,
                    "pageSize": 6
                },
                transformRequest: [function(data) {
                    return "paramJson=" + JSON.stringify(data);
                }],
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                timeout: 30000
            }).then(function(res){
                state.related = JSON.stringify(res.data.responseObject.responseData);
            });
        }

    }
};
export  default  actions;