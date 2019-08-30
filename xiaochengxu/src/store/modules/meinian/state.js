/**
 * @Desc：美年大健康合作页面
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by zhangHeng on 2018/11/01.
 */
const states = {
  limit:false,
  codeDes:"获取验证码",
  clickAble:true,
  patientCustomerId:'',
  phoneNum:'',//患者的手机号
  identityCardNum:'',//患者的身份证号
  patientName:'',//患者的名字
  titleName:" ", //title名字
  verifyPhoneNumber:false,//手机号是否验证过false未验证过，true验证过
  hasReport:false,//用户是否有体检报告
  reportDialog:false,
  patientList:[],
  idInfo:{},
  reportData:{},
  verificationCode:'',//验证码id
  verificationCodeIng:false,
  verificationCodeNum:60,//获取验证码计时秒数
  tipsMsg:'',
  toastShow:'',
  toastImg: {
    wifi: "/static/images/login/wifi@2x.png.png",
    success: "/static/image/success.png"
  }
};

export default states;
