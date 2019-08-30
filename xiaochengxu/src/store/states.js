/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
import localStorage from "localStorage";

const state = {
  loading: false,
  bottomNavShow: false,
  bottomNavSelectIndex: -1,
  isSubscribe: false,
  toastContent: '',
  toastShow: false,
  userInfoEnd:false,
  updatePatientList: 0,
  isLogin: false,   //是否登录
  updatePatient:{}, // 针对小程序添加的患者需要进行完善的数据对象
  // customerId: localStorage.getItem("userId") || "",  请别用这个了 ， 从缓存获取，这个数据是错的
  queryObject: {},
  scene: 0,
  patientMessage: {
    partId: "",
    age: "",
    sex: "",
    descriptionDisease: "",
    needHelp: ""
  },
  questionDetail: {},
  //订单信息
  orderMessage: {
    medicalShow:{},
    medicalCreate:{}
  },
  imgList:[],
  questionOne:[],
  questionTwo:[],
  questionTwoDes:"",
  questionOneDes:"",
  //患教搜索参数
  searchFlag:false,
  qrCode:false, // 是否是扫码进来的。
  videoNum:0, // 康复日记视频数量
};

export default state;
