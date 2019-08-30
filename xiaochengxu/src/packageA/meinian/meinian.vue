<template>
  <section class="main-inner">
    <section class="loginMain">
      <header class="logo"></header>
      <h1>请填写您在美年大健康的体检信息</h1>
      <section class="formContent">
        <aside class="labelBox">
          <span class="labelName">姓名</span>
          <input class="labelText" type="text" placeholder="请填写真实姓名" v-model="inputPatientName" @blur.stop="blurInput('name')">
        </aside>
        <aside class="labelBox">
          <span class="labelName">身份证号</span>
          <input class="labelText" type="text" placeholder="方便准确查询体检报告" v-model="identityCardNum" @blur.stop="blurInput('ID')">
        </aside>
        <aside class="labelBox" v-if="!verifyPhoneNumber">
          <span class="labelName">手机号</span>
          <input class="labelText" type="text" placeholder="请填写手机号" v-model="inputPatientPhoneNum" @blur.stop="blurInput('phone')">
        </aside>
        <aside class="labelBox sCode" v-if="!verifyPhoneNumber">
          <span class="labelName">验证码</span>
          <p class="sendCodeBox">
            <input class="labelText getCode" type="text"  @blur.stop="blurInput('code')" placeholder="请填写" v-model="codeNum">
            <span class="sendCode" @click.stop="getVerificationCode" :class="{'onSend':verificationCodeIng}">
              <i v-text="verificationCodeIng?'重新发送':codeDes"></i>
              <i v-if="limit"  v-text="verificationCodeNum+'s'"></i>
            </span>
          </p>
        </aside>
        <p class="sureBtn" @click.stop="getReport">查询体检报告</p>
      </section>
      <confirm :confirmParams="{
      'ensure':'确认提交',
      'cancel':'返回',
      'title':'提示',
      'content':'<p class=\'textAlign\'>请确认身份证号是否正确，提交后不得更改身份证号码信息</p><p class=\'textAlign\'>'+identityCardNum+'</p>',
      }" v-if="confirmOnOff" @ensureClickEvent="sureConfirm " @cancelClickEvent="cancelConfirm">
      </confirm>
      <confirm :confirmParams="{
      'ensure':'知道了',
      'title':'暂未查询到您的体检报告',
      'content':'<p class=\'textAlign\'>可能如下原因：</p><p class=\'textAlign\'>1. 身份证信息有误，请重新输入</p><p class=\'textAlign\'>2. 您的体检报告暂未生成</p>',
      }" v-if="reportDialog" @ensureClickEvent="ensureClickEvent" >
      </confirm>
      <NormalLoading v-if="loading"></NormalLoading>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
  /**
   * @Desc：美年大合作问诊流程
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by zhangheng on 2018/11/1.
   */
  const XHRList = {
    createPatient: api.httpEnv() + "/mcall/customer/patient/relation/v1/create/"//创建患者
  };
  import api from 'common/js/util/util';
  import localStorage from "localStorage";
  import NormalLoading from "components/loading";
  import confirm from 'components/confirm';
  import {createNamespacedHelpers} from "vuex";
  const {mapGetters,mapActions} = createNamespacedHelpers('meinian');
  import validCodeLogin from "common/js/auth/validCodeLogin"; // 验证验证码
  import bindMobile from "common/js/auth/bindMobile"; // 绑定手机号
  export default {
    data() {
      return {
        confirmOnOff:false,
        inputPatientPhoneNum:'',
        identityCardNum:'',
        inputPatientName:'',
        toastShow:false,
        tipsMsg:'',
        codeNum:'',
        loading:false,
        maxNameLen:40,
        maxPhoneLen:11
      }
    },
    watch:{
      inputPatientName(n){
        let t = this;
        if(n.length>t.maxNameLen){
          t.inputPatientName = t.inputPatientName.substring(0,t.maxNameLen);
          t.changeName(t.inputPatientName);
        }else{
          t.changeName(n);
        }
      },
      codeNum(n){
        let t = this;
        if(n.length>4){
          t.codeNum = t.codeNum.substring(0,4);
        }
      },
      identityCardNum(n){
        let t = this;
        if(n.length===18&&t.identityCardNumRight){

          t.changeIdentityCardNum(n);
        }else{
          t.identityCardNum=t.identityCardNum.substring(0,18);
        }
      },
      inputPatientPhoneNum(n){
        let t = this;
        if(n.length===t.maxPhoneLen&&t.identityPhoneNumRight){
           t.changePhoneNum(n);
        }else{
          t.inputPatientPhoneNum = t.inputPatientPhoneNum.substring(0,t.maxPhoneLen);
        }
      }
    },
    methods: {
      ...mapActions(['changeName','changeIdentityCardNum','changePhoneNum','checkVerificationCode','showToast','getReportDetail','changeReportDialog','savePatientCustomerId','changeClickAble','changeCodeDes']),
      blurInput(name){
        let t = this;
        switch (name) {
          case 'name':
            if(t.patientName.length===0){
              t.showToast({text:'请填写体检人姓名'});
              return false;
            }
            if(!t.identityNameRight){
              t.showToast({text:"不能包含数字和特殊字符"});
              return false;
            }
            break;
          case 'phone':
            if(t.inputPatientPhoneNum.length===0){
              t.showToast({text:'请输入手机号'});
              return false;
            }else if(!t.identityPhoneNumRight){
              t.showToast({text:'请输入正确的手机号'});
              return false;
            }
            break;
          case 'code':
            if(t.codeNum.length===0){
              t.showToast({text:'请输入验证码'});
              return false;
            }else if(!t.codeNumRight){
              t.showToast({text:'请输入正确的验证码'});
              return false;
            }
            break;
          case 'ID':
            if(t.identityCardNum.length===0){
              t.showToast({text:'请输入身份证号'});
              return false;
            }else if(!(t.idCardMethod(t.identityCardNum))){
              t.showToast({text:'请输入正确的身份证号'});
              return false;
            }
            break;
        }
        console.log(name);
      },
      bindPhone () {
        let t = this ;
        console.log('我要绑定手机号');
        bindMobile({
          account: t.inputPatientPhoneNum,
          encryptedData: wx.getStorageSync('encryptedData'),
          sessionKey: wx.getStorageSync('sessionKey'),
          iv: wx.getStorageSync('iv'),
          visitSiteId:'24'
        }).then( res => {
          console.log(res);
          if (res.responseObject.responseStatus) {
            wx.setStorageSync("userId",res.responseObject.responsePk);
            //t.getReportDetail({from:'meinian'});
            api.codeRecord();
            t.createPatient();
          }
        });
      },
      showModal({ title = "", content,success = () =>{} } = paramObj) {
        wx.showModal({
          success: () =>{

          },
          title,
          success: () =>{

          },
          content,
          success,
        });
      },
      cancelConfirm(){
        let t = this;
        t.confirmOnOff = false;
        t.changeClickAble(true);
      },
      sureConfirm(){
       let t = this;
        validCodeLogin({
          validCode: t.codeNum,
          codeId: t.verificationCode,
          account: t.inputPatientPhoneNum,
          typeId: 2,
          customerId:localStorage.getItem("userId")
        }).then(res => {
          if (res.responseObject.responseStatus) {
            if (res.responseObject.responseData) {
              let {responseObject:{responseData:{uniteNameWeixin,uniteNickname,uniteFlagWeixin}}} = res;

              if (uniteFlagWeixin) {
                if (this.unionId != uniteNameWeixin) {
                  t.loading = false;
                  t.showModal({
                    content:"该手机号码已被“" + uniteNickname +"”占用，是否更换绑定为当前微信?",
                    success: (res) =>{
                      if (res.confirm) {
                        console.log('用户点击确定');
                        t.loading = true;
                        t.bindPhone();
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    },
                  });
                } else {
                }
              } else {
                t.bindPhone();
              }
            }
          } else {
            // 如果是新手机号，则进行绑定
            if (res.responseObject.responseCode == '0B0010') {
              t.bindPhone();
            } else {
              t.loading = false;
              t.showToast({text:res.responseObject.responseMessage});
            }
          }
        });
      },
      idCardMethod(value) {
        let city = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江 ",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北 ",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏 ",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外 "
        };
        let tip = "",
          pass = true;
        value = value.toUpperCase();
        if (value.length == 15) {
          //15位身份证直接过
          pass = false;
        } else if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
          //tip = "身份证号格式错误";
          pass = false;
        } else if (!city[value.substr(0, 2)]) {
          //tip = "地址编码错误";
          pass = false;
        } else if (value.length == 18) {
          //18位身份证需要验证最后一位校验位
          value = value.split('');
          //∑(ai×Wi)(mod 11)
          //加权因子
          let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],//校验位
            sum = 0,
            ai = 0,
            wi = 0;
          for (let i = 0; i < 17; i++) {
            ai = value[i];
            wi = factor[i];
            sum += ai * wi;
          }
          if (parity[sum % 11] != value[17]) {
            //tip = "校验位错误";
            pass = false;
          }
        }
        return pass;
      },
      getReport(){
        let t = this;
        if(!t.clickAble){
          return false;
        }else{
          t.changeClickAble(false);
        }
        if(!t.verifyPhoneNumber){
          if(t.patientName.length===0){
            t.showToast({text:'请填写体检人姓名'});
            t.changeClickAble(true);
            return false;
          }
          if(!t.identityNameRight){
            t.showToast({text:"不能包含数字和特殊字符"});
            t.changeClickAble(true);
            return false;
          }
          if(t.identityCardNum.length===0){
            t.showToast({text:'请输入身份证号'});
            t.changeClickAble(true);
            return false;
          }else if(!t.identityCardNumRight){
            t.showToast({text:'请输入正确的身份证号'});
            t.changeClickAble(true);
            return false;
          }
          if(t.inputPatientPhoneNum.length===0){
            t.showToast({text:'请输入手机号'});
            t.changeClickAble(true);
            return false;
          }else if(!t.identityPhoneNumRight){
            t.showToast({text:'请输入正确的手机号'});
            t.changeClickAble(true);
            return false;
          }
          if(t.codeNum.length===0){
            t.showToast({text:'请输入验证码'});
            t.changeClickAble(true);
            return false;
          }else if(!t.codeNumRight){
            t.showToast({text:'请输入正确的验证码'});
            t.changeClickAble(true);
            return false;
          }
          t.confirmOnOff = true;
        }else{
          if(t.patientName.length===0){
            t.showToast({text:'请填写体检人姓名'});
            t.changeClickAble(true);
            return false;
          }
          if(t.identityCardNum.length===0){
            t.showToast({text:'请输入身份证号'});
            t.changeClickAble(true);
            return false;
          }else if(!(t.idCardMethod(t.identityCardNum))){
            t.showToast({text:'请输入正确的身份证号'});
            t.changeClickAble(true);
            return false;
          }
          t.createPatient();
        }
      },
      createPatient(){
        let t = this;
        let _data = {
          customerId:localStorage.getItem("userId"),
          patientName:t.inputPatientName,
          patientBirthday:t.idInfo.birthday,
          patientSex:t.idInfo.sex,
          mobile:t.phoneNum,
          certificateCode:t.identityCardNum,
          patientAge:t.idInfo.age,
          caseType:'15',
          visitSiteId:'24',
          patientSource:'1'
        };
        api.ajax({
            url: XHRList.createPatient,
            method: "POST",
            data: _data,
            done(param) {
              if (param.responseObject.responseStatus) {
                t.savePatientCustomerId(param.responseObject.responsePk);
                t.getReportDetail({from:'meinian'});
              }
            }
        })
      },
      getVerificationCode(){
        let t = this;
        if(t.inputPatientPhoneNum.length===0){
          t.showToast({text:'请输入手机号'});
        }else if(t.verificationCodeIng){
          return false;
        }else if(t.identityPhoneNumRight){
          //既不是空手机号也不是错误的手机号也不是正在获取验证码的状态
          t.checkVerificationCode();
        }else{
          t.showToast({text:'请输入正确的手机号'});
        }
      },
      ensureClickEvent(){
        let t = this;
        t.changeReportDialog(false);
        t.changeClickAble(true);
        wx.redirectTo({
          url: '/packageA/meinian/patientList?from=meinian'
        });
      }
    },
    mounted() {
      let t = this;
      console.log(t.verificationCodeIng);
    },
    components:{
      confirm,
      NormalLoading
    },
    computed: {
      ...mapGetters(['verifyPhoneNumber','patientName','phoneNum','verificationCodeIng','verificationCodeNum','reportDialog','verificationCode','idInfo','clickAble','codeDes','limit']),
      identityCardNumRight(){
        let t = this;

        let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/i;
        return reg.test(t.identityCardNum);
      },
      codeNumRight(){
        let t = this;
        let reg = /(^\d{4}$)/i;
        return reg.test(t.codeNum);
      },
      identityPhoneNumRight(){
        let t = this;
        let reg = /^1\d{10}$/i;
        return reg.test(t.inputPatientPhoneNum);
      },
      identityNameRight(){
        let t = this;
        let isPass = (/[`~!！？@#$%^&*()_+<>?:"{},，。\/;'[\] ]/).test(t.inputPatientName) || (/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g).test(t.inputPatientName) || (/^(?=.*\d.*\b)/).test(t.inputPatientName) || (/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig).test(t.inputPatientName);
        if (t.inputPatientName === "") {
          return false;
        } else if (isPass) {
          return false;
        } else {
          return true;
        }
      },
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "healthCooperation";
  .main-inner{
    position: relative;
    background-color: #fff;
    width: 100%;
  }
</style>
<style lang="scss" rel="stylesheet/scss">
  .textAlign{
    width:100%;
    margin: 0 auto;
    text-align: left;
  }
</style>
