const actions = {
    changeTeamId:({commit, state}, str)=>{
        commit("changeTeamId",str);
    },
    changeTitleOnOFF:({commit, state}, str)=>{
        commit("changeTitleOnOFF",str);
    },
    changeRemindingOnOff:({commit, state}, str)=>{
        commit("changeRemindingOnOff",str);
    },
    changeLoading:({commit, state}, str)=>{
        commit("changeLoading",str);
    },
    ChangeCliInputNone:({commit, state}, str)=>{
        commit("ChangeCliInputNone",str);
    },
    ChangeRequestOnOff:({commit, state}, str)=>{
        commit("ChangeRequestOnOff",str);
    },
    ChangePointerOnOff:({commit, state}, str)=>{
        commit("ChangePointerOnOff",str);
    },
    ChangeRemindingNum:({commit, state}, str)=>{
        commit("ChangeRemindingNum",str);
    }
};
export default actions;
