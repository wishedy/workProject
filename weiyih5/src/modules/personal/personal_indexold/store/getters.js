const getters = {
  cId(state){//用户Id
    return state.cId;
  },
  logoUrl(state){//用户头像
    return state.logoUrl;
  },
  showUploadImg(state){//是否显示上传图片组件
    return state.showUploadImg;
  },
  uploadIng(state){//上传图片中
    return state.uploadIng;
  },
  uploadSuccess(state){//上传图片成功
    return state.uploadSuccess;
  },
  customerInfo(state){//用户信息
    return state.customerInfo;
  },
  specialCount(state){//特殊的数字标识
    return state.specialCount;
  }
};
export default getters;