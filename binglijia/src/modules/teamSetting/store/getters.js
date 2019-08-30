const getters = {
    teamId(state){
        return state.teamId;
    },
    titleOnOFF(state){
        return state.titleOnOFF;
    },
    RemindingOnOff(state){
        return state.RemindingOnOff;
    },
    showLoading(state){
        return state.showLoading;
    },
    cliInputNone(state){
        return state.cliInputNone;
    },
    requestOnOff(state){
        return state.requestOnOff;
    },
    pointerOnOff(state){
        return state.pointerOnOff;
    },
    remindingNum(state){
        return state.remindingNum;
    }
};
export default getters;
