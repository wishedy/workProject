/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */

/**************************Axios Http Requests*************************/
import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg"; // 获取专业医生基本信息 

const actions={
  /** 获取医生信息 */
  // 获取医生姓名、头像
  getDoctorMsg({dispatch, commit, rootState},doctorCustomerId) {
    return new Promise( (resolve, reject) => {
      getDoctorBaseMsg({
        doctorCustomerId,
        logoUseFlag: 5
      }).then(data => {
        if (data.responseObject && data.responseObject.responseData) {
          const dataList = data.responseObject.responseData.dataList[0];
          commit("setDoctorMessage",{
            doctorId: this.doctorCustomerId,
            doctorName: dataList.customerName
          });
          resolve(true);
        }
      });
    }) 
  },
};


export default actions;
