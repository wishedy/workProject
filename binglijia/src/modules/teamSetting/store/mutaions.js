

const mutaions = {
    changeTeamId(state,data){//选择团队列表的弹层显示开关
        state.teamId=data;
    },
    changeTitleOnOFF(state,data){//改变第几步的方法
        state.titleOnOFF=data;
    },
    changeRemindingOnOff(state,data){//改变第几步的方法
        state.RemindingOnOff=data;
    },
    changeLoading(state,data){//改变第几步的方法
        state.showLoading=data;
    },
    ChangeCliInputNone(state,data){//改变第几步的方法
        state.cliInputNone=data;
    },
    ChangeRequestOnOff(state,data){//改变第几步的方法
        state.requestOnOff=data;
    },
    ChangePointerOnOff(state,data){//改变第几步的方法
        state.pointerOnOff=data;
    },
    ChangeRemindingNum(state,data){//有新成员的加入申请
        state.remindingNum=data;
    }
};
export default mutaions;
