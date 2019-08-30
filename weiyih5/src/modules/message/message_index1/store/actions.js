const actions = {
    accept:({commit, state},date)=>{
        state.acceptData = date;
    },
    headerBtn:({commit, state},date)=>{
        state.isShowCompile = date;
    },
    change:({commit, state},date)=>{
        state.compileOrCancel = date;
    },
    changCount:({commit, state},date)=>{
        state.count = date;
    },
    setAllDelete:({commit, state},date)=>{
        state.isAllDelete = date;
    },
    getDeleteListId:({commit, state},date)=>{
        state.deleteListIdGather = date;
    },
    setDelete:({commit, state},date)=>{
        state.isDelete = date;
    },
    setLoading:({commit, state},date)=>{
        state.isLoading = date;
    },
    setCheckall:({commit, state},date)=>{
        state.isCheckall = date;
    },
    setHeaderHeight:({commit, state},date)=>{
        state.headerHeight = date;
    },
};
export default actions;