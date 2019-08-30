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
    },
    callApp:({commit,state},str)=>{
        commit("callApp",str);
    },
    getEvent:({commit,state},str)=>{
        commit("getEvent",str);
    },
    changeIsAjax:({commit,state},str)=>{
        commit("changeIsAjax",str)
    },
    changeIscontentTab:({commit,state},str)=>{
        commit("changeIscontentTab",str)
    },
    changeIsHeader:({commit,state},str)=>{
        commit("changeIsHeader",str)
    },
    commCreatEvent:({commit, state}, str)=>{
        commit("commCreatEvent",str);
    },
};
export default actions;