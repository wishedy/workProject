/**
 * Create By DingLindong on 2017/12/22
 */
const actions = {
    change:({commit, state},date)=>{
        state.confirmOption = date;
    },
    changeEn:({commit, state},date)=>{
        state.isEnsure = date;
    },
    information:({commit, state},date)=>{
        state.public= date;
    },
    types:({commit, state},data)=>{
        state.resourceType = data;
    }
};
export default actions;