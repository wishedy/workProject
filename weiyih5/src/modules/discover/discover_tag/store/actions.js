
const  actions = {
    changeSearchState:({commit},giveState)=>{
        commit("changeSearchState",giveState);
    },
    initLoading:({commit})=>{
        commit("initLoading");
    }
};
export  default  actions;