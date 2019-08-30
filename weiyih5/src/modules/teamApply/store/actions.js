const actions = {
    showMoIndexC:({commit, state}, str)=>{
        commit("showMoIndexC",str);
    },
    medArrC:({commit, state}, str)=>{
        commit("medArrC",str);
    },
    setTeamState:({commit, state}, str)=>{
        commit("setTeamState",str);
    },
};
export default actions;