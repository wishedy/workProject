const actions = {
    saveIndexLiveList:({commit, state}, data)=>{
        commit("saveIndexLiveList",data);
    },
    saveLiveTotalCount:({commit, state}, num)=>{
        commit("saveLiveTotalCount",num);
    },
    changeScrollTop:({commit,state},num)=>{
        commit("changeScrollTop",num);
    },
    saveOrganizationName:({commit,state},name)=>{
        commit("saveOrganizationName",name);
    },
    changeColumnState:({commit,state},num)=>{
        commit("changeColumnState",num);
    },
    saveBannerData:({commit,state},data)=>{
        console.log(data);
    commit("saveBannerData",data);
    }
};
export default actions;