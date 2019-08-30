/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const state = {
  patientName:"", // 患者姓名
  patientInfo:{}, // 患者信息
  // calenderParams:{}, // 日历组件选择的参数
  consultationId: "",
  logoUrl: "",
  lastTime: "",
  lastCount: "",
  targetMsg: {},
  targetList:[],
  toolbarConfig: {
    image: false,
    video: false,
    file: false,
    delete: false,
    deleteTime: ""
  }
};

export default state;
