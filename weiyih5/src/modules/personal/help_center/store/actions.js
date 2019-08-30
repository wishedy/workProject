/**
 * Create By ZhangHeng on 2018/10/19
 */
const actions = {
    changeTitle:({commit, state},text)=>{
        commit('changeTitle',text);
    },
    feedBack:({commit,state})=>{
        commit("feedBack");
    },
    changeScrollTop:({commit,state},num)=>{
        commit("changeScrollTop",num);
    }
};
export default actions;