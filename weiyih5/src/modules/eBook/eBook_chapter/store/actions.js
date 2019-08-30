const actions = {
    shareParam:({commit, state},date)=>{
        state.shareData = date;
    },
    clicks:({commit, state},date)=>{
        state.status = date;
    },
    trigger:({commit, state},data)=>{
        state.ajaxing = data;
    },
    routerState:({commit, state},data)=>{
        state.routerData = data;
    },
    dcount:({commit, state},data)=>{
        state.docCount = data;
    },
    vcount:({commit, state},data)=>{
        state.deoCount = data;
    },
};
export default actions;