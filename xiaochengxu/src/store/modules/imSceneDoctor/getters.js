/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const getters = {
  targetLogo(state) {
    if (state.targetMsg.avatar) {
      return state.targetMsg.avatar;
    } else {
      return "/src/common/image/imScene/default.png";
    }
  },
  // 将身份证号加密
  certificateCodeEncrypt (state) {
    if (state.patientInfo.certificateCode && state.patientInfo.certificateCode.length) {      
      return state.patientInfo.certificateCode.substr(0,3) + '***********' + state.patientInfo.certificateCode.substr(-4,4);
    } else {
      return "";
    }
  }
};
export default getters;
