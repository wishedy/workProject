import global_ from 'common/Global';
import comm from 'static/js/comm.js';

let path = {
  customerInfo : "/mcall/customer/unite/getMapById/", //客户信息
};
const mutaions = {
  setCID(state,data){
    state.cId= data;
  },
  showUpload(state,data){
    state.showUploadImg = data;
    if(state.showUploadImg==true){
      $(".al-appWakeUpFigure").hide();
    }else{
      $(".al-appWakeUpFigure").show();
    }
  },
  getInitPage(state){
    comm.ajax2({
      type:"post",
      url:path.customerInfo,
      data:{paramJson: JSON.stringify({customerId: state.cId,"logoUseFlag": global_.UseFlag.d,isCustomer:1})},
      success:function(res){
        let options = {
          success(res){
            let responseData=res.responseObject.responseData.data_list[0];
            mutaions.setCustomerInfo(state,responseData);
          },
        };
        comm.successRequest(res,options);
      }
    })
  },
  changeUpload(state,data){
    state.uploadIng = data;
  },
  showUploadSuccess(state,data){
    state.uploadSuccess = data;
  },
  setLogoUrl(state,data){
    state.logoUrl = data;
  },
  setCustomerInfo(state,data){
    state.customerInfo = data;
  },
  setSpecialCount(state,data){
    state.specialCount = data;
  }
};
export default mutaions;