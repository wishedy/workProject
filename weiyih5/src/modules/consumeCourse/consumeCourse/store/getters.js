const getters = {
    tabActiveIndex(state){
        return state.tabIndex;
    },
    chatTotal(state){
        return state.chatTotal;
    },
    courseTotal(state){
        return state.courseTotal;
    },
    courseNum(state){
        return state.courseNum;
    },
    rightOnOff(state){
        return state.rightOnOff;
    },
    courseName(state){
        return state.courseName;
    },
    courseCover(state){
        return state.courseCover;
    },
    courseData(state){
        return state.courseData;
    },
    couponInfo(state){
        return state.couponInfo;
    }
};
export default getters;
