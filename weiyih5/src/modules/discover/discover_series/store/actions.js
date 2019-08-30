import comm from 'static/js/comm.js'
import axios from "axios"

const xhrUrl = {

    "teacherLink":"/mcall/cms/course/getHotAuthorList/"
};
const actions = {
    getAuthorInfo:({commit, state}, options)=>{
        let type = options.type?options.type:0;
        let courseRecommendTeacher = {"0": "recommendTeacher", "9": "woundTeacher", "7": "spineTeacher", "2": "jointTeacher"};
        axios({
            url: xhrUrl.teacherLink,
            method: "POST",
            data: {"sortType":4,"courseSubjectTeamId":type,"platformId":"1"},
            transformRequest: [function(data) {
                return "paramJson=" + JSON.stringify(data);
            }],
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            timeout: 30000
        }).then(function(res){
            let options = {
                success(){
                    state[courseRecommendTeacher[type + ""]] = JSON.stringify(res.data.responseObject.responseData);
                },
                failed(){
                    state[courseRecommendTeacher[type + ""]]  = JSON.stringify({data_list:[]});
                }
            };
            comm.successRequest(res.data,options);
        });
    },
    startLoading:({commit,state})=>{
        state.loading = true;
    },
    endLoading:({commit,state})=>{
        state.loading = false;
    }
};
export default actions;