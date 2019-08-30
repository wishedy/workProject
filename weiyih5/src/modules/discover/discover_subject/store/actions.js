const actions = {
    change:({commit, state},date)=>{
        state.typeName = date;
    },
    changeEn:({commit, state},date)=>{
        state.search = date;
    },
    shareEn:({commit, state},date)=>{
        state.word = date;
    },
    tabTypeChange:({commit, state},date)=>{
        state.tabType = date;
    },
    /*tabTypeChange:({commit,state},str)=>{
        commit('tabTypeChange',str);
    },*/
    //切换tab
  /*  tabTypeChange(state,data){
        state.tabType=data;
    },*/
};
export default actions;