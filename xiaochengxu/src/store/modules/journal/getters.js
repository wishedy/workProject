/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/12.
 */

export default {
  commentList:(state)=>{
    console.log(state.commentList)
    return state.commentList;
  },
  videoNum: (state, getters, rootState, rootGetters) => rootState.videoNum,
}
