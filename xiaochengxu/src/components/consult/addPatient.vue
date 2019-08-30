<template>
  <section class="sticky-wrapper">
    <section class="main-inner">
      <!--头部-->
      <header class="find-doctor-head">
        <p class="find-doctor-head-tips">{{headTitle}}</p>
      </header>
      <!--添加患者-->
      <section class="add-patient-content">
        <article class="add-patient-content-item">
          <aside>姓名</aside>
          <figure class="add-patient-input">
            <input type="text" placeholder="请填写真实姓名" id="patientName" @blur="validateBlur('username')"
                   @input="inputMaxLength('username',40)"
                   placeholder-style="color:#aaaaaa;"
                   :disabled='updateInfo'
                   name="username"
                   v-model="username">
          </figure>
        </article>
        <article class="add-patient-content-item">
          <aside>性别</aside>
          <figure class="add-patient-input">
            <section class="add-patient-sex-selector " :class="{'on':sexSelect==1}" @click="selectSex(1)">
              <i class="add-patient-selector"></i>
              <span>男</span>
            </section>
            <section class="add-patient-sex-selector women" :class="{'on':sexSelect==2}" @click="selectSex(2)">
              <i class="add-patient-selector"></i>
              <span>女</span>
            </section>
          </figure>
        </article>
        <article class="add-patient-content-item">
          <aside>出生日期</aside>
          <figure class="add-patient-input birth-box">
            <p class="contentMessage" :class="{'on':birthClickNum > 1}">{{birthClickNum > 1 ? birthInput : '请选择'}}</p>
            <picker class="time-picker" mode="date" :value="defaultTime" start="1900-01-01" :end="currTime"
                    style="position: absolute;top: 0;width: 100%;height: 100%;" @change="selectTimeFn">
              <view class="picker" style="position: absolute;top: 0;width: 100%;height: 100%;">
                <!-- 当前选择: {{date}} -->
              </view>
            </picker>
          </figure>
        </article>
        <article class="add-patient-content-item" v-if="isLogin">
          <aside>手机号码</aside>
          <figure class="add-patient-input ">
            <input type="number" @blur="validateBlur('phone')" @input="inputMaxLength('phone',11)" placeholder="请填写手机号码"
                   name="phone" v-model="phone">
          </figure>
        </article>
        <template v-else>
          <article class="add-patient-content-item">
            <aside>手机号码</aside>
            <figure class="add-patient-input ">
              <input type="number" @blur="validateBlur('phone')"
                     @input="inputMaxLength('phone',11)"
                     placeholder="将用作登录账号" name="phone" v-model="phone">
            </figure>
          </article>
          <article class="add-patient-content-item">
            <aside>验证码</aside>
            <figure class="add-patient-input code-box">
              <input class='codeInput' type="number" @blur="validateBlur('codeText')"
                     @input="inputMaxLength('codeNumber',4)"
                     placeholder="请输入" name="codeInput" v-model="codeNumber">
              <i class="icon-clear" v-if='codeNumber.length' @click.stop='clearTextCode()'></i>
            </figure>
            <span class="codeText" v-if="codeTime<=0" @click.stop="getCodeApi()">{{codeText}}</span>
            <span class="codeCountdown" :class="{'hasContent':codeNumber.length>0}"
                  v-if="codeTime>0"><i>{{codeTime}}</i><i>秒后重新获取</i></span>
          </article>
        </template>
      </section>

      <!--无患者提示-->
      <form  class="btn-primary go-next" @submit="formSubmit" report-submit="true">
        <button class="btn-primary go-next" @click="validate()" formType="submit">下一步</button>
      </form>
    </section>

    <confirm
      :confirmParams="{ 'ensure':'取消', 'cancel':'确定',  'content':confirmContentText,'title':'当前WIFI未连接'}"
      v-if="levelShow" :showFlag.sync="levelShow" @cancelClickEvent="loginEnsureEvent()"
      @ensureClickEvent="loginCancelEvent()">
    </confirm>
    <NormalLoading v-if="loading"></NormalLoading>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：患者选择
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by liChenYang on 18/8/8.
   */

  import api from 'common/js/util/util';
  import Toast from "components/toast";
  import NormalLoading from "components/loading";
  import pickerSelect from "components/picker/picker";
  import confirm from "components/confirm";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  import {mapMutations, mapActions, mapState, mapGetters} from "vuex";

  /**************************Axios Http Requests*************************/
  import SendCode from "common/js/auth/sendCode"; // 发送验证码
  import validCodeLogin from "common/js/auth/validCodeLogin"; // 验证验证码
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import bindMobile from "common/js/auth/bindMobile";

  const XHRList = {
    getPhone: api.httpEnv() + "/mcall/patient/customer/unite/v1/getById/",//获取患者绑定的手机号
    addPatient: api.httpEnv() + "/mcall/customer/patient/relation/v1/create/",//增加患者
    updatePatient: api.httpEnv() + "/mcall/customer/patient/relation/v1/update/",//修改和删除患者
    patientInfo: api.httpEnv() + "/mcall/customer/patient/baseinfo/v1/getMapList/", // 获取患者个人信息
  };
  let timerCode = null; // 发送验证码倒计时
  export default {
    data() {
      return {
        loading: false, // 控制 loading 的显示隐藏；
        unionId: wx.getStorageSync('unionId'), // 微信 unionId
        updateInfo: false, // 患者是否需要更新信息（针对患者报道进来的数据不全）
        count: 0, // 曾经是否来过
        patientId: 0, // 患者id；
        patientMessage: {},
        sexSelect: -1, // 性别选择控制
        birthClickNum: 0, // 生日是否选择了,因为初始化的执行一次，所以用数字 ++
        pickerShow: false, // 生日选择器是否显示，每次进来都让其重新初始化；
        birthInput: "", // 出生日期
        username: "",// 添加患者名字
        phone: "",// 手机号
        bindPhone: "",// 用户绑定的手机号
        formCheck: false,//表单是否全部验证通过
        infoErrorShow: false,//信息错误是否显示
        codeNumber: '', // 验证码
        codeId: '', // 验证码主键
        codeText: "获取验证码",
        codeTime: 0,
        getCode: true,
        toastImg: {
          wifi: "/static/image/img00/login/wifi@2x.png.png",
          success: "/static/image/img00/login/Send a success@2x.png"
        },
        currTime: "",
        defaultTime: "",
        createFlag: false, // 是否正在创建患者
        levelShow: false,
        finish: false,
        date: '',
        selectTime: '',
        year: "",
        month: '',
        day: ''
      }
    },
    components: {
      pickerSelect,
      Toast,
      NormalLoading,
      confirm
    },
    computed: {
      ...mapGetters(['toastShow', 'toastContent', 'updatePatient', 'isLogin'])
    },
    onLoad() {
      console.log('onLoad idLogin' + this.isLogin);
      this.pickerShow = true;
      this.birthClickNum = 0;
      this.getPickerTime();
      if (this.isLogin) {
        //已登录
        console.log("登......");
        this.getPatientPhone();
        this.init();
      } else {
        //未登录
        console.log("未登......");
      }
      if (this.updatePatient && !!this.updatePatient.patientName) {
        console.log(this.updatePatient);
        this.updateInfo = true;
        let objTemp = this.updatePatient;
        this.patientId = objTemp.patientId;
        this.username = objTemp.patientName;
        if (!objTemp.sex) {
          this.sexSelect = 1;
        } else {
          this.sexSelect = objTemp.sex;
        }
        console.log(objTemp);
      } else {
        this.patientId = 0;
        this.username = '';
        this.sexSelect = -1;
        this.updateInfo = false;
      }
    },
    onUnload() {
      this.pickerShow = false;
      this.resetForm();
      this.hideToast();
      console.log('addPatient onUnload');
    },
    methods: {
      ...mapActions(['showToast','hideToast', 'setPatientMessage', 'setIsLogin']),
      ...mapMutations(['addUpdatePatientList']),
      init() {

      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      getPickerTime() {
        let _this = this;
        this.birthClickNum = 1;
        const time = {};
        let dataTemp = new Date();
        time.year = dataTemp.getFullYear();
        time.month = dataTemp.getMonth() + 1;
        time.day = dataTemp.getDate();
        _this.currTime = `${time.year}-${time.month}-${ time.day}`;
        _this.defaultTime = `2000-${time.month}-${ time.day}`;
      },
      /** 获取绑定的手机号 */
      getPatientPhone() {
        console.log("!1");
        const _this = this;
        api.ajax({
          url: XHRList.getPhone,
          method: "POST",
          data: {
            isValid: 1,                           // string 是   1
            firstResult: 0,                       // string 是  分页参数
            maxResult: 99999,                     //  string 是  分页参数
            customerId: localStorage.getItem("userId"),                       //  string 是  用户id
          },
          done(param) {
            if (param.responseObject.responseStatus && param.responseObject.responseData.dataList && param.responseObject.responseData.dataList.patientCustomerUnite.mobile) {
              _this.phone = param.responseObject.responseData.dataList.patientCustomerUnite.mobile;
              _this.bindPhone = param.responseObject.responseData.dataList.patientCustomerUnite.mobile;
            } else {

            }
          },
          fail(err) {
            console.log(err);
          }
        })
      },
      /** 获取患者个人信息 */
      getPatientInfo(patientId, unshiftFlag) {
        const _this = this;

        api.ajax({
          url: XHRList.patientInfo,
          method: "POST",
          data: {
            patientId: patientId,//患者id
          },
          done(data) {
            wx.hideLoading();
            if (data.responseObject.responseStatus) {
              //去咨询成功后，需要清除表单数据
              // localStorage.removeItem("watchedTips");
              // _this.resetForm();
              _this.toSelectPart(data.responseObject.responseData.dataList[0]);
            } else {
              _this.showToast(data.responseObject.responseMessage);
            }
          }
        })
      },
      /** 点击下一步验证 */
      validate() {
        if (this.validateBlur('username') && this.validateBlur('phone')) {
          if (this.sexSelect === -1) {
            this.showToast("请选择性别");
            this.formCheck = false;
            return;
          }
          if (this.birthClickNum < 2) {
            this.showToast('请选择出生日期');
            return;
          }
          this.formCheck = true;
          this.validateOther();//验证其他特殊的字段
        }

      },
      /** 验证其他特殊的字段 */
      validateOther() {
        if (this.formCheck) {
          //验证完成，提交
          if (this.isLogin) {
            this.messageSubmit();
          } else {
            if (this.validateBlur('codeText')) {
              this.validCode();
            }
          }
        }
      },
      /** 提交信息，创建或者更新患者 */
      messageSubmit() {
        const _this = this;
        let dData = new Date();
        dData.getFullYear();
        // 防止多次点击
        if (this.createFlag) {
          return;
        }
        this.createFlag = true;
        let data = {
          customerId: localStorage.getItem("userId"),
          patientName: this.username,//患者姓名
          visitSiteId: api.getSiteId(),
          patientSex: this.sexSelect,
          patientBirthday: this.birthInput,//患者出生日期
          mobile: this.phone
        };
        if (this.scene == 'report') {
          data.doctorId = localStorage.getItem("doctorId");
          data.caseType = 14;
        }
        let XHRUrl = '';
        if (this.updateInfo) {
          XHRUrl = XHRList.updatePatient;
          Object.assign(data, {patientId: this.patientId,})
        } else {
          XHRUrl = XHRList.addPatient;
        }
        this.loading = true;
        api.ajax({
          url: XHRUrl,
          method: "POST",
          data: data,
          done(data) {
            console.log("保存个人信息");
            _this.createFlag = false;

            if (data.responseObject.responseStatus) {
              _this.addUpdatePatientList();
              // 如果是患者报到，交给父组件处理
              if (_this.scene == 'report') {
                _this.loading = false;
                // _this.resetForm();
                let patientId;
                patientId = _this.updateInfo?_this.patientId:data.responseObject.responsePk;
                _this.$emit("selectPartCb", patientId);
              } else {
                if (_this.updateInfo) {
                  _this.getPatientInfo(_this.patientId);
                } else {
                  _this.getPatientInfo(data.responseObject.responsePk);
                }
              }
            } else {
              _this.loading = false;
              _this.showToast(data.responseObject.responseMessage);
            }
          },
          fail(err) {
            _this.loading = false;
            _this.createFlag = false;
            console.log(err);
          }
        })
      },
      /** 去往选择部位 */
      toSelectPart(data) {
        this.setPatientMessage({
          partId:'',
          userId: localStorage.getItem("userId"),
          sex: data.patientSex,
          age: data.patientAge,
          patientId: data.patientId,
          patientName: data.patientName,
          count: this.count,
          height: data.height ? data.height : "",
          weight: data.weight ? data.weight : ""
        });
        this.$emit("selectPartCb", {
          patientId:data.patientId,
          patientCustomerId:localStorage.getItem("userId")||'',
          patientName:data.patientName,
          patientAge:data.patientAge,
          patientSex:data.patientSex,
        });
        this.createFlag = false;
        this.pickerShow = false; // 重置picker；
        setTimeout(() => {
          this.pickerShow = true;
        }, 0);
        this.loading = false;
      },
      /** 重置表单 */
      resetForm() {
        this.sexSelect = -1; // 性别选择恢复
        this.birthClickNum = 0;
        this.birthInput = ""; // 出生日期
        this.username = ""; // 患者名字
        this.phone = this.bindPhone;// 手机号
      },
      /** 选择性别时的函数 */
      selectSex(index) {
        if (this.updateInfo) {
          this.showToast("已保存信息不能修改");
        } else {
          this.sexSelect = index;
        }
      },
      /** input最大长度事件 */
      inputMaxLength(attr, length) {
        this[attr] = api.getStrByteLen(this[attr], length);
      },
      /** 失焦事件 */
      validateBlur(type) {
        if (type === "username") {
          let isPass = (/[`~!！？@#$%^&*()_+<>?:"{},，。\/;'[\] ]/).test(this.username) || (/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g).test(this.username) || (/^(?=.*\d.*\b)/).test(this.username) || (/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig).test(this.username);
          if (this.username === "") {
            this.showToast("请填写患者姓名");
            return false;
          } else if (isPass) {
            this.showToast("不能包含数字和特殊字符");
            return false;
          } else {
            return true;
          }
        } else if (type === "phone") {
          let isPassPhone = /^1\d{10}$/.test(this.phone);
          this.changePhone = false;
          if (this.phone.length === 0) {
            this.showToast("请填写手机号码");
            return false;
          } else if (!isPassPhone) {
            this.showToast("请填写真实手机号码");
            return false;
          } else {
            return true;
          }
        } else if (type === "codeText") {
          if (this.codeNumber.length === 0) {
            this.showToast("请填写短信验证码");
            return false;
          } else {
            return true;
          }
        }

      },
      /** 获取验证码 */
      getCodeApi() {
        let _this = this;
        if (!_this.validateBlur("phone")) {
          return;
        }
        _this.loading = true;
        SendCode({
          account: _this.phone,
          operateType: 8,
          typeId: 3
        }).then(data => {
          if (data.responseObject.responsePk !== 0 && data.responseObject.responseStatus) {
            _this.showToast("验证码已发送");
            // _this.imgUrl = _this.toastImg.success;
            _this.countDown(60);
            _this.codeId = data.responseObject.responsePk;
          } else {

            _this.showToast(data.responseObject.responseMessage);
          }
        }).catch(err => {
          // _this.showToast("网络信号差，建议您稍后再试");
          console.log(err);
        }).finally(() => {
          _this.loading = false;
        });
      },
      /** 验证码倒计时 */
      countDown(time) {
        let _this = this;
        let _codeTime = time;
        _this.codeTime = _codeTime--;
        _this.getCode = false;
        timerCode = setInterval(() => {
          if (_codeTime > 0) {
            _this.codeTime = _codeTime--;
          } else {
            _this.getCode = true;
            _this.codeTime = 0;
            _this.getCodeText = "重新获取";
            clearInterval(timerCode);
          }
        }, 1000);
      },
      /** 微信原生 confirm 框提示 */
      showModal({
                  title = "", content, success = () => {
        }
                } = paramObj) {
        wx.showModal({
          title,
          content,
          success,
        });
      },
      /** 校验验证码并登陆 */
      validCode() {
        let that = this;
        this.loading = true;
        return new Promise((resolve, reject) => {
          validCodeLogin({
            validCode: this.codeNumber,
            codeId: this.codeId,
            account: this.phone,
            typeId: 3
          }).then(res => {
            console.log(res);
            if (res.responseObject.responseStatus) {
              if (res.responseObject.responseData) {
                let {responseObject: {responseData: {uniteNameWeixin, uniteNickname, uniteFlagWeixin}}} = res;
                if (uniteFlagWeixin) {
                  if (this.unionId != uniteNameWeixin) {
                    console.log('需要绑定');
                    this.loading = false;
                    this.showModal({
                      content: "该手机号码已被“" + uniteNickname + "”占用，是否更换绑定为当前微信?",
                      success: (res) => {
                        if (res.confirm) {
                          console.log('用户点击确定');
                          this.bindPhoneFun();
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      },
                    });
                  } else {
                    console.log('不需要绑定');
                    this.setIsLogin(true);
                    this.bindPhone = this.phone;
                    this.messageSubmit();
                    console.log('验证成功');
                  }
                } else {
                  this.bindPhoneFun();
                }
              }
            } else {
              // 如果是新手机号，则进行绑定
              if (res.responseObject.responseCode == '0B0010') {
                this.bindPhoneFun();
              } else {
                this.loading = false;
                this.showToast(res.responseObject.responseMessage);
              }
            }
          }).catch((err) => {
            console.log(err);
          });
        })
      },
      /** 绑定手机号 */
      bindPhoneFun() {
        let _this = this;
        console.log('我要绑定手机号');
        this.loading = true;
        bindMobile({
          account: this.phone,
          encryptedData: wx.getStorageSync('encryptedData'),
          sessionKey: wx.getStorageSync('sessionKey'),
          iv: wx.getStorageSync('iv'),
          visitSiteId: '24'
        }).then(res => {
          console.log(res);
          if (res.responseObject.responseStatus) {
            // 换绑成功，更新本地 userId
            wx.setStorageSync("userId", res.responseObject.responsePk);
            this.setIsLogin(true);
            this.bindPhone = this.phone;
            // 创建新患者；
            this.messageSubmit();
            api.codeRecord();
          }
        }).finally(() => {
          this.loading = false;
        });
      },
      /** 确定换绑 */
      loginEnsureEvent() {
        this.levelShow = false;
      },
      /** 换绑取消弹层 */
      loginCancelEvent() {
        this.levelShow = false;
        this.loginEnable = true;
        this.getCode = true;
        this.codeTime = 0;
        this.codeMessage = "";
        this.getCodeText = "重新获取";
        clearInterval(timerCode);
      },
      /** 生日 picker 选择回调函数 */
      selectTimeFn(e) {
        console.log(e)

        let _this = this;
        let time = {};
        let _timeArr = e.target.value.split("-");
        //月份去零
        if (_timeArr[1] > 9) {
          time.month = _timeArr[1];
        } else {
          time.month = _timeArr[1].split("0")[1];
        }
        //天数去零
        if (_timeArr[2] > 9) {
          time.day = _timeArr[2];
        } else {
          time.day = _timeArr[2].split("0")[1];
        }
        time.year = _timeArr[0];

        console.log(time)
        _this.birthClickNum++;

        // _this.birthInput = time.year + '-' + time.month.toString().padStart(2, '0') + "-" + time.day.toString().padStart(2, '0') ;
        if (time.month < 9) {
          time.month = '0' + time.month;
        }
        if (time.day < 9) {
          time.day = '0' + time.day;
        }
        _this.birthInput = `${time.year}-${time.month }-${time.day}`;
      },
      /** 清除验证码 */
      clearTextCode() {
        this.codeNumber = "";
        this.formCheck = false
      }
    },
    props: {
      headTitle: {
        type: String,
        default: '完善病情资料后，我们将推荐优质医生为您提供咨询服务。'
      },
      scene:{
        type:String,
        default:"consult"
      }
    }
  }
</script>
<style lang="scss" scoped="">
  html, body {
    width: 100%;
    height: 100%;
  }

  .sticky-wrapper {
    height: auto;
    min-height: 100%;
    box-sizing: border-box;
  }

  .main-inner {
    background: #fff;
    height: 100%;

  }

  // 患者自己找医生进来的头部
  .find-doctor-head {
    padding: 40px 60px 30px;
    .find-doctor-head-tips {
      font-size: 40px;
      color: #222222;
      font-weight: bold;
      opacity: 1;
      letter-spacing: 1px;
    }
  }

  //患者咨询
  .add-patient-content {
    padding: 15px 60px 0;
    &-item {
      height: 140px;
      line-height: 140px;
      border-bottom: 1px solid #D8D8D8;
      font-size: 0;
      position: relative;
      & > aside {
        display: inline-block;
        vertical-align: middle;
        width: 196px;
        font-size: 34px;
        color: #909090;
        letter-spacing: 0;
        /*line-height: 34px;*/
      }
      .codeText {
        position: absolute;
        right: 0px;
        top: 0;
        font-size: 34px;
        color: #2FC5BD;
        letter-spacing: 0;
        &::after {
          content: "";
          height: 30px;
          width: 4px;
          background: #ccc;
          position: absolute;
          left: -14px;
          top: 50%;
          margin-top: -15px;
        }
      }
      .codeCountdown {
        position: absolute;
        right: 0px;
        top: 0;
        font-size: 34px;
        color: #777;
        letter-spacing: 0;
        i {
          display: inline-block;
        }
      }
      & > .add-patient-input {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        /*width: 440px;*/
        font-size: 34px;
        max-width: 380px;
        color: #666666;
        &.birth-box {
          width: 50%;
        }
        &.code-box {
          width: 50%;
        }
        input[disabled] {
          color: #555;
        }
        .icon-clear {
          display: inline-block;
          position: absolute;
          width: 54px;
          height: 54px;
          top: 50%;
          margin-top: -27px;
          right: 150px;
          z-index: 2;
          background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png") center center no-repeat;
          background-size: 38px 38px;
        }

        .contentMessage {
          color: #AAAAAA;
          &.on {
            color: #222222;
          }
        }

        ::-webkit-input-placeholder { /* WebKit browsers */
          color: #AFAFAF;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          color: #AFAFAF;
          opacity: 1;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #AFAFAF;
          opacity: 1;
        }
        :-ms-input-placeholder { /* Internet Explorer 10+ */
          color: #AFAFAF;
        }

        & > input {
          width: 100%;
          height: 100%;
          border: none;
          outline: none;
          /*padding: 26px 30px;*/
          background: none;
          color: #222;
          font-size: 34px;
        }
        & > select {
          min-height: 60px;
          background: none;
          border: none;
          width: 100%;
          outline: medium;
        }
        & > .codeInput {
          width: 60%;
        }
      }
      .add-patient-sex-selector {
        display: inline-block;
        width: 164px;
        vertical-align: middle;
        .add-patient-selector {
          width: 48px;
          height: 48px;
          background: url("https://m.allinmed.cn/static//image/mp/consult/notSelect@2x.png") no-repeat;
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          box-sizing: border-box;
        }
        & > span {
          display: inline-block;
          vertical-align: middle;
          color:#222222;
        }
        &.on {
          .add-patient-selector {
            background: url("https://m.allinmed.cn/static//image/mp/consult/selected@2x.png") no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }

  //错误提示
  .info-error-tips {
    margin: 10px 14px 68px;
    font-size: 30px;
    line-height: 1;
    .tips-box {
      padding-left: 32px;
      line-height: 1;
      background: url("https://m.allinmed.cn/static/image/img00/patientConsult/error_tips.png") no-repeat left 2px;
      background-size: 26px 26px;
      span {
        line-height: 1;
        display: inline-block;
      }
      .tips-describe {
        color: #FA787A;
      }
      .tips-contact {
        color: #2FC5BD;
        border-bottom: 1px solid #2FC5BD;
      }
    }
  }

  .go-next {
    width: 520px;
    height: 96px;
    line-height: 96px;
    display: block;
    border-radius: 9999px;
    background: #2EA9FE;
    text-align: center;
    box-sizing: border-box;
    font-size: 36px;
    color: #fff;
    outline: medium;
    padding: 0;
    margin: 80px auto 40px;
  }

  .cancel-add-btn {
    font-size: 36px;
    color: #909090;
    text-align: center;
    padding-bottom: 60px;
  }

  .horizontal-box {
    padding: 100px 130px;
  }

  /*vue组件自定义动画开始*/
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0;
  }

  .fadeDown-enter-active, .fadeDown-leave-active {
    transition: all ease-in-out .5s
  }

  .fadeDown-enter, .fadeDown-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0;
    transform: translateY(-50%);
  }

  .fadeUp-enter-active {
    transition: all ease-in-out .5s
  }

  .fadeUp-leave-active {
    transition: opacity 0s
  }

  .fadeUp-enter /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0;
    transform: translateY(50%);
  }

  .fadeUp-leave-to {
    opacity: 0;
    /*transform: translateY(50%);*/
  }

  .fadeRight-enter-active, .fadeRight-leave-active {
    transition: all ease-in-out .5s;
    transform: translateX(0);
  }

  .fadeRight-enter, .fadeRight-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0;
    transform: translateX(100%);
  }

  /*vue组件自定义动画开始*/
</style>

