const mutaions = {
    screeningPopChange(state,data){
        state.scrPopShow=data;
    },
    subjectTeamIdChange(state,data){
        state.subjectTeamId=data;
    },
    openTimeChange(state,data){
        state.openTime=data;
    },
    isLiveStateChange(state,data){
        state.isLiveState=data;
    },
};
export default mutaions;