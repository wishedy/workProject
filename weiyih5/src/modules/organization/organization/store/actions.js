const actions = {
    changeLoading:({commit, state}, str)=>{
        commit("changeLoading",str);
    },
    changeNewsPop:({commit, state}, str)=>{
        commit("changeNewsPop",str);
    },
    changeHeadShow:({commit, state}, str)=>{
        commit("changeHeadShow",str);
    },
    commCreateEvent:({commit, state}, str)=>{
        commit("commCreateEvent",str);
    },
};
export default actions;