const actions = {
    change:({commit, state},date)=>{
        state.confirmOption = date;
    },
    changeEn:({commit, state},date)=>{
        state.isEnsure = date;
    },
};
export default actions;