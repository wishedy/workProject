const getters = {
    headerTitle(state){
        return state.headerTitle
    },
    appOnOff(state){
        return state.appOnOff;
    },
    feedBackOnOff(state){
        return state.feedBackOnOff;
    },
    linkMe(state){
        return state.linkMe;
    },
    scrollTop(state){
        return state.scrollTop;
    }
};
export default getters;