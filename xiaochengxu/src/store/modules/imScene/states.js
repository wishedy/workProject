/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const state = {
  caseId:'', // 病例id。
  upload:[], // 检查检验的数组
  patientId:'', // 患者Id
  patientName:"", // 患者姓名
  patientInfo:{}, // 患者信息
  isFindDoctor: false, // 是否是自己找医生进来的
  doctorBaseMsg: {}, // 自己找医生进来的专业医生的基本信息；
  consultationId: "",
  consultationState: 0,//会话咨询状态
  orderDoctorId:'', // 支付的医生id
  logoUrl: "",
  ensureShow: false, // 推荐医生是否通过消息
  targetMsg: {},
  targetList:[],
  toolbarConfig: {
    image: false,
    video: false,
    file: false,
    delete: false,
    deleteTime: ""
  },
  caseType:'', // 病例类型
};

export default state;
