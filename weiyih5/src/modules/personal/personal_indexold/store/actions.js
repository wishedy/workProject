/**
 * Created by lichunhui on 2018/1/4.
 */
const actions = {
  setCID:({commit, state}, str)=>{
    commit("setCID",str);
  },
  showUpload:({commit, state}, str)=>{
    commit("showUpload",str);
  },
  changeUpload:({commit, state}, str)=>{
    commit("changeUpload",str);
  },
  showUploadSuccess:({commit, state}, str)=>{
    commit("showUploadSuccess",str);
  },
  setLogoUrl:({commit, state}, str)=>{
    commit("setLogoUrl",str);
  },
  setCustomerInfo:({commit, state}, str)=>{
    commit("setCustomerInfo",str);
  },
  getInitPage:({commit, state})=>{
    commit("getInitPage",);
  },
  setSpecialCount:({commit, state}, str)=>{
    commit("setSpecialCount",str);
  },
}
export  default  actions;