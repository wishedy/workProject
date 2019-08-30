const mutaions = {
    changeActiveIndex(state,index){
        state.tabIndex=index;
    },
    setTotal(state,num){
        state.chatTotal=num;
    },
    setRightOnOff(state,onOff){
        state.rightOnOff=onOff;
    },
    setCourseTotal(state,num){
        state.courseTotal=num;
    },
    setCourseName(state,str){
        state.courseName=str;
    },
    setCourseCover(state,str){
        state.courseCover=str;
    },
    changeCouponStatus(state,type){
      state.couponInfo.applyStatus = type;
    },
    setCourseNum(state,num){
        state.courseNum=num;
    },
    saveCourseData(state,data){
        state.courseData=data;
    },
    saveCoupon(state,data){
        state.couponInfo=data;
    },
};
export default mutaions;
