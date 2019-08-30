const actions = {
    isWeiXin:({commit, state}, onOff)=>{
        commit("isWeiXin",onOff);
    },
    isIOS:({commit, state}, onOff)=>{
        commit("isIOS",onOff);
    }
};
export default actions;
