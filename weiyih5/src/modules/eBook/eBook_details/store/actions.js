const actions = {
    accept:({commit, state},date)=>{
        state.bookstate = date;
    },
    urlstore:({commit, state},date)=>{
        state.urlData = date;
    },
    change:({commit, state},date)=>{
        state.name = date;
    },
    trigger:({commit, state},data)=>{
        state.ajaxing = data;
    }
};
export default actions;