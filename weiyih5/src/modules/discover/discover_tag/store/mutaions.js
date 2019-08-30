const mutaions = {
    changeSearchState:(state,giveState)=>{
        state.onSearch = giveState;
        window.scrollTo(0,0);
        mutaions.initLoading(state);
        if(!giveState){
            state.searList = "";
            state.searchStr = "";
        }
    },
    initLoading:(state)=>{
         state.pageIndex = 1;
         state.completed =false;
         state.loading =false;
         state.firstLoading =false;
    }
};
export default mutaions;