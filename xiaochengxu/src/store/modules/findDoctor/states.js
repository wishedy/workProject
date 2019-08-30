/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
const state = {
  doctorCustomerId:0, // 医生id;
  queryObject: {},
  scene:0,
  doctorMessage:{},
  patientMessage:{
    partId:"",
    age:"",
    sex:"",
    descriptionDisease:"",
    needHelp:""
  },
  questionDetail: {},
  questionOne:[],
  questionTwo:[],
  questionTwoDes:"",
  questionOneDes:"",
  orderMessage:{}
};

export default state;
