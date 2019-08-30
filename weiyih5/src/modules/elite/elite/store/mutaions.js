const mutaions = {
    saveIndexLiveList(state,data){
        state.liveIndexList=data;
    },
    saveLiveTotalCount(state,num){
        state.liveTotalCount = num;
    },
    changeScrollTop(state,num){
        state.scrollTop = num;
    },
    saveOrganizationName(state,name){
        state.organizationName = name;
    },
    changeColumnState(state,num){
        state.columnState = num;
    },
    saveBannerData(state,data){
        state.bannerData = data;
    },
};
export default mutaions;