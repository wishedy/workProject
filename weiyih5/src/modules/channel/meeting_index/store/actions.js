const actions = {
    screeningPopChange:({commit, state}, str)=>{
        commit("screeningPopChange",str);
    },
    subjectTeamIdChange:({commit, state}, str)=>{
        commit("subjectTeamIdChange",str);
    },
    openTimeChange:({commit, state}, str)=>{
        commit("openTimeChange",str);
    },
    isLiveStateChange:({commit, state}, str)=>{
        commit("isLiveStateChange",str);
    },
};
export default actions;