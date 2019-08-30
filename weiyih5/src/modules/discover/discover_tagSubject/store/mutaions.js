import comm from 'static/js/comm.js'
const mutaions = {
    changeSearchState:(state,giveState)=>{
        state.onSearch = giveState;
        if(!giveState){
            state.searList = "";
            state.searchStr = "";
            comm.creatEvent({
                triggerType:'全站功能按钮点击',
                keyword:"取消",
                actionId:45
            });
        }
    }
};
export default mutaions;