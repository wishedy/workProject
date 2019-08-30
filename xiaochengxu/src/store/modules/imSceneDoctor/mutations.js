
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
  // 设置患者姓名
  setPatientName(state,name){
    state.patientName=name;
  },
  // 设置患者信息
  setPatientInfo(state,obj){
    state.patientInfo = obj;
  },
  setConsultation(state, id) {
    state.consultationId = id;
  },
  setCaseType(state, type) {
    state.caseType = type;
  },
  setTargetMsg(state, params) {
    state.targetMsg = params;
  },
  setLastCount(state, count) {
    state.lastCount = count;
  },
  setTargetList(state, list) {
    state.targetList = list;
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
  setLastTime(state, time) {
    state.lastTime = time;
  },
  // 设置日历传过去的参数
  // setCalenderParams (state, params) {
  //   state.calenderParams = params;
  // },
  stopLastTimeCount(state) {
    clearInterval(totalTimeCount);
    // Attention
    // 若直接置为0，业务组件引用Vuex状态作监听体，归零直接进入另一状态
    state.lastTime = 0;
  },
  pauseLastTimeCount(state){
    clearInterval(totalTimeCount);
  },
  lastTimeCount(state) {
    clearInterval(totalTimeCount);
    totalTimeCount = setInterval(() => {
      if (state.lastTime <= 0) {
        clearInterval(totalTimeCount);
      } else {
        state.lastTime = state.lastTime - 1000;
      }
    }, 1000);
  },
  lastCountMinus(state) {
    state.lastCount = state.lastCount - 1;
  },
  lastCountPlus(state) {
    if(state.lastCount){//当次数为0时，不再加1
      state.lastCount = state.lastCount + 1;
    }
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
  },
  setReportImageUpload (state, flag) {
    state.reportImageUpload = flag;
  }
};

export default mutations;
