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
  callApp:({commit,state},str)=>{
        commit("callApp",str);
  },
  setCustomerRole:({commit,state},num)=>{
        commit("setCustomerRole",num);
  },
  getEvent:({commit,state},str)=>{
      commit("getEvent",str);
  },
  changeAjax:({commit,state},str)=>{
    commit("changeAjax",str)
  },
    changeIscontentTab:({commit,state},str)=>{
        commit("changeIscontentTab",str)
    },
    changeIsHeader:({commit,state},str)=>{
        commit("changeIsHeader",str)
    },
    commCreatEvent:({commit, state}, str)=>{
        commit("commCreatEvent",str);
    },


}
export  default  actions;