const actions = {
    changeActiveIndex:({commit, state}, index)=>{
        commit("changeActiveIndex",index);
    },
    setTotal:({commit, state}, num)=>{
        commit("setTotal",num);
    },
    setRightOnOff:({commit, state}, onOff)=>{
        commit("setRightOnOff",onOff);
    },
    setCourseTotal:({commit, state}, num)=>{
        commit("setCourseTotal",num);
    },
    setCourseNum:({commit, state}, num)=>{
        commit("setCourseNum",num);
    },
    setCourseName:({commit, state}, str)=>{
        commit("setCourseName",str);
    },
    setCourseCover:({commit, state}, str)=>{
        commit("setCourseCover",str);
    },
    saveCourseData:({commit, state}, data)=>{
        commit("saveCourseData",data);
    },
    saveCoupon:({commit, state}, data)=>{
        commit("saveCoupon",data);
    },
    changeCouponStatus:({commit, state}, type)=>{
        commit("changeCouponStatus",type);
    },
};
export default actions;
