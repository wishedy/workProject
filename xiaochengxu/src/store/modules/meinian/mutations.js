import sendCode from "common/js/auth/sendCode"; // 发送验证码
import api from 'common/js/util/util';
import localStorage from "localStorage";
const checkIdCard = {
   IdCard(UUserCard, num) {
  if (num == 1) {
    //获取出生日期
    let birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
    return birth;
  }
  if (num == 2) {
    //获取性别
    if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
      //男
      return "1";
    } else {
      //女
      return "2";
    }
  }
  if (num == 3) {
    //获取年龄
    let  myDate = new Date();
    let  month = myDate.getMonth() + 1;
    let  day = myDate.getDate();
    let  age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
      age++;
    }
    return age;
  }
},
   Calculate(ID) {
     let t = this;
     let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
     if (reg.test(ID) === false) {
        return false;
    } else {
    return {
      age:t.IdCard(ID, 3),
      birthday:t.IdCard(ID, 1),
      sex:t.IdCard(ID, 2),
    };
  }

}
};
const XHRList = {
  resultList: api.httpEnv() + "/mcall/patient/physical/result/getMapList/",//患者列表
  getMyDoctor:api.httpEnv() + "/mcall/customer/patient/case/v1/createMeiNianCase/",//我的医生列表
};
const mutations = {
  titleNameChange(state,data){//页面title文本
    state.titleName = data;
  },
  changeVerifyPhoneNumber(state,status){
    state.verifyPhoneNumber = status;
  },
  changeCodeDes(state,des){
    state.codeDes = des;
  },
  changeHasReport(state,status){
    state.hasReport = status;
  },
  changeReportDialog(state,status){
    state.reportDialog = status;
  },
  changeName(state,name){
    state.patientName = name;
  },
  changeIdentityCardNum(state,num){
    state.identityCardNum = num;
    state.idInfo = checkIdCard.Calculate(num);
  },
  changePhoneNum(state,num){
    state.phoneNum = num;
  },
  changeClickAble(state,status){
    state.clickAble = status;
  },
  consultDoctor(state){
    if(!state.clickAble){
      return false;
    }else{
      mutations.changeClickAble(state,false);
    }
    let _data = {
      "isValid": 1,
      'mobile':state.phoneNum,
      'patientName':state.patientName,
      'caseType':15,
      'channelId':'1531380434390',
      'channelType':1,
      'operatorType':0,
      'patientId':state.patientCustomerId,
      'certificateCode':state.identityCardNum,
      'customerId':localStorage.getItem("userId"),
      "visitSiteId": 24
    };
    api.ajax({
      url: XHRList.getMyDoctor,
      method: "POST",
      data: _data,
      done(param) {
        if (param.responseObject.responsePk !== 0 &&
          param.responseObject.responseStatus) {
          let patientId = state.patientCustomerId;
          let caseId = param.responseObject.responsePk;
          mutations.changeClickAble(state,true);
          wx.navigateTo({
            url: '/packageA/imScene/imScene?caseId='+caseId+'&patientId='+patientId+'&from=meinian'
          });
        } else {
            console.log('创建失败');
        }
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  savePatientCustomerId(state,id){
      state.patientCustomerId = id;
  },
  saveReportData(state,data){
    state.reportData = data;
  },
  getReportDetail(state,opt){
    console.log('获取体检报告');
    let _data = {
      certificateCode:state.identityCardNum,
      //certificateCode:'440527196812085844',
      patientName:state.patientName,
      physicalNo: (opt && opt.physicalNo) ? opt.physicalNo:'',
      //patientName:'温伟芳',
      customerId:localStorage.getItem("userId")
    };
    api.ajax({
      url: XHRList.resultList,
      method: "POST",
      data: _data,
      done(param) {

        if (param.responseObject.responseMessage == "NO DATA") {
          mutations.changeReportDialog(state,true);
        } else {
          mutations.changeReportDialog(state,false);
          mutations.saveReportData(state,param);
          mutations.changeClickAble(state,true);
          if(opt.from==='meinian'){
            if(param&&param.responseObject&&param.responseObject&&param.responseObject.responseData&&param.responseObject.responseData.dataList&&parseInt(param.responseObject.responseData.dataList[0].lastPhysicalFlag,10)){
              wx.navigateTo({
                url: '/pages/myConsult/myConsult'
              });
            }else{
              if(opt.fromPatientList&&(opt.fromPatientList==1)){
                wx.navigateTo({
                  url: '/packageA/meinian/healthReport?from=meinian&nav=1'
                });
              }else{
                wx.redirectTo({
                  url: '/packageA/meinian/healthReport?from=meinian&nav=0'
                });
              }
            }
          }

        }
      },
      fail(err) {
        console.log(err);
      }
    })
  },
  showToast(state,json) {
    let icon = json.icon?json.icon:'none';
    let image = json.image?json.image:'';
    let text = json.text?json.text:'';
    state.tipsMsg = text;
    if (!state.toastShow) {
      state.toastShow = true;
      wx.showToast({
        title: state.tipsMsg,
        icon,
        image
      });
      clearTimeout(warnToast);
      let warnToast = setTimeout(() => {
        state.toastShow = false;
        wx.hideToast();
      }, 2000);
    }
  },
  savePatientList(state,list){
    console.log(list);
      state.patientList = list;
      mutations.savePatientCustomerId(state,state.patientList[0].patientId);
      mutations.changeName(state,state.patientList[0]['fullName']);
      mutations.changeClickAble(state,true);
      mutations.changeIdentityCardNum(state,state.patientList[0]['certificateCode']);
      wx.navigateTo({
        url: '/packageA/meinian/patientList?from=meinian'
      });
  },
  setTimeVerificationCode(state){
    let t = this;
    clearInterval(interval);
    let interval = setInterval(()=>{
      (state.verificationCodeNum>0)?state.verificationCodeNum--:state.verificationCodeIng = false;
      console.log(state.verificationCodeIng);
      if(!state.verificationCodeIng){
        state.codeDes = '重新获取';
        state.limit = false;
        state.verificationCodeNum = 60;
        clearInterval(interval);
      }
    },1000);
  },
  checkVerificationCode(state){
    state.verificationCodeIng = true;
    sendCode({
      // account: _this.phoneMessage,
      // customerId: this.customerId,
      // account: 15555555550,
      account: state.phoneNum,
      // operateType: 1, //1-绑定手机 2－修改手机号 3-手机号找回p密码 5-手机号注册 8-手机号快捷登录 9-老患者报到 16-患者注册
      // typeId: 2 //1-修改/重置密码2-账号验证(绑定手机、手机号注册)3-手机快捷登录4-老患者报到5-短信通知
    })
      .then(res => {
        const data = res;
        /*state.limit = !(data.responseObject.responseData.codeNum<=0);
        state.verificationCodeIng = state.limit;*/
        state.limit = true;
        if(!state.limit){
          state.codeDes = '重新获取';
        }
        if (
          data.responseObject.responsePk !== 0 &&
          data.responseObject.responseStatus
        ) {
          mutations.showToast(state,
            {text:"验证码已发送",
            icon:"success",
            image:state.toastImg.success
            });
          state.verificationCode = data.responseObject.responsePk;
          mutations.setTimeVerificationCode(state);
        } else {
          state.verificationCodeIng = false;
          state.codeDes = '重新获取';
          state.limit = false;
          mutations.showToast(state,{
            text:data.responseObject.responseMessage,
            icon:'none',
            image:''
          });
        }
      })
      .catch(err => {
        console.log(err);
        mutations.showToast(state,{
          text:'网络信号差，建议您稍后再试',
          icon:'success',
          image:state.toastImg.wifi
        });
      });
  }
};
export default mutations;
