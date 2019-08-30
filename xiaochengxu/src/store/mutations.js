/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/19.
 */
// import GetPersonal from '@/common/js/auth/getPersonal';
// const getPersonal = new GetPersonal();
const mutations = {
  // 设置患者姓名
  setLoadingState(state, flag) {
    state.loading = flag;
  },
  setbottomNav(state, flag) {
    state.bottomNavShow = flag;
  },
  setbottomNavSelectIndex(state, index) {
    state.bottomNavSelectIndex = index;
  },
  //患者信息
  setPatientMessage(state, param) {
    state.patientMessage = Object.assign(state.patientMessage,param);
  },
  //订单预览
  setOrderMessage(state, param) {
    state.orderMessage = param;
  },
  // 添加了患者了
  addUpdatePatientList (state) {
    state.updatePatientList ++;
  },
  getSubscribeStatus(state, name) {
    // getPersonal.getMessage(localStorage.getItem("userId")).then((data) => {
    //   if (data.responseObject.responseData) {
    //     if (data.responseObject.responseData.uniteFlagWeixin == 1) {
    //       state.isSubscribe = true;
    //     } else {
    //       state.isSubscribe = false;
    //     }
    //   }
    // });
  },
  storageUserInfoEnd(state){
    state.userInfoEnd = true;
  },
  setScene(state, scene) {
    state.scene = scene;
  },
  setQueryObject(state, param) {
    state.queryObject = Object.assign(state.queryObject, param);
  },
  setQuestionDetail(state, param) {
    state.questionDetail = param;
  },
  setQuestionOne(state,param){
    state.questionOne=param;
  },
  setQuestionOneDes(state,param){
    state.questionOneDes=param;
  },
  setQuestionTwo(state,param){
    state.questionTwo=param;
  },
  setQuestionTwoDes(state,param){
    state.questionTwoDes=param;
  },
  //设置患教搜索状态
  setSearchFlag(state,param){
    state.searchFlag=param;
  }
};

export default mutations;
