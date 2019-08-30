
/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
import getToolbarConfig from "common/js/HttpRequest/toolbarConfig";

let totalTimeCount;
const mutations = {
  /** 设置上传检查检验的参数 */
  setUpload (state, params) {
    state.upload = params;
  },
  /** 设置caseId */
  setCaseId (state,id) {
    state.caseId = id;
  },
  /** 设置caseId */
  setPatientId (state,id) {
    state.patientId = id;
  },
  /** 设置caseType */
  setCaseType (state,id) {
    state.caseType = id;
  },
  /** 取消ensure框 */
  setEnsureShow(state,flag) {
    state.ensureShow=flag;
  },
  // 设置患者姓名
  setPatientName(state,name){
    state.patientName=name;
  },
  // 设置患者信息
  setPatientInfo(state,obj){
    state.patientInfo = obj;
  },
  // 设置是否是找医生进去的
  setIsFindDoctor (state,flag) {
    state.isFindDoctor=flag;
  },
  // 设置找医生进去的医生信息
  setDoctorBaseMsg (state, param) {
    state.doctorBaseMsg = param;
  },
  //初诊建议次数增加
  addPreviewSuggestionNum(state){
    state.previewSuggestionNum++;
  },
  //渲染初诊建议次数增加
  addRenderSuggestionNum(state){
    state.renderSuggestionNum++;
  },
  // 设置支付
  setOrderDoctorId (state, id)  {
    state.orderDoctorId = id;
  },
  setConsultation(state, id) {
    state.consultationId = id;
  },
  setconsultationState(state, num){
    state.consultationState = num;
  },
  setTargetMsg(state, params) {
    state.targetMsg = params;
  },
  setLogoUrl(state, param) {
    let sex = param.sexName,
      age = parseInt(param.age),
      img = "";
    if (age <= 12) {
      img = "https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_child@2x.png";
    } else if (age > 12 && age <= 59) {
      img = (sex === "男" ? "https://m.allinmed.cn/static/image/img00/myServices/chatting_chatting_man@2x.png" : "https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_woman@2x.png");
    } else if (age > 59) {
      img = (sex === "男" ? "https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_man@2x.png": "https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_woman@2x.png");
    }
    state.logoUrl = img;
  },
  getToolbarConfig(state) {
    state.toolbarConfig={
      image: false,
      video: false,
      file: false,
      delete: false,
      deleteTime: ""
    };
    getToolbarConfig().then((data) => {
      if (data.responseObject.responseData) {
        let dataList = data.responseObject.responseData.dataList;
        if (dataList) {
          dataList.forEach((element, index) => {
            if (element.state == 1) {
              switch (parseInt(element.toolType)) {
                case 1://图片
                  state.toolbarConfig.image = true;
                  break;
                case 4://撤回
                  state.toolbarConfig.delete = true;
                  state.toolbarConfig.deleteTime = element.toolConfig;
                  break;
                case 5://视频
                  state.toolbarConfig.video = true;
                  break;
                case 6://文件
                  state.toolbarConfig.file = true;
                  break;
                default:
                  break;
              }
            }
          });
        }
      }
    })
  }
};

export default mutations;
