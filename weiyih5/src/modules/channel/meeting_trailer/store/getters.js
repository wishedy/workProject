const getters = {
    nowMouth(state){//头部月份点击
        return state.nowMouth;
    },
    meetingState(state){//点击的月份判断是否是当前月份
        return state.meetingState;
    },
    subjectTeamId(state){//筛选的专业
        return state.subjectTeamId;
    },
    runState(state){//会议状态（0-未进行 1-已进行）
        return state.runState;
    },
    shootState(state){//拍摄状态（0-不拍摄，1-拍摄）
        return state.shootState;
    },
    monthNoRe(state){//本月无会议
        return state.monthNoRe;
    },
    scrNoRe(state){//筛选无结果
        return state.scrNoRe;
    },
    monthChange(state){//区分月份和筛选点击
        return state.monthChange;
    },
    scrChange(state){//筛选点击，
        return state.scrChange;
    },
    majorName(state){//专业头部名称
        return state.majorName;
    },
    stateName(state){//会议状态头部名称
        return state.stateName;
    },
    isLive(state){//唯一按钮是否激活
        return state.isLive;
    },


};
export default getters;