global.webpackJsonp([12],{

/***/ 1041:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderPerson_vue__ = __webpack_require__(1043);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_00ea210e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderPerson_vue__ = __webpack_require__(1048);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1042)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-00ea210e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderPerson_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_00ea210e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderPerson_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/orderPerson.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] orderPerson.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-00ea210e", Component.options)
  } else {
    hotAPI.reload("data-v-00ea210e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1042:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1043:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_share__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_telephoneVerify__ = __webpack_require__(1044);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_dataLog__ = __webpack_require__(7);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/*
  * @Desc:预约详情
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */








var personApiList = {
  getPatientList: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/relation/v1/getPatientList/',
  addRegister: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/tocure/register/basic/addRegister/',
  updatePerson: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/relation/v1/update/'
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    var _ref;

    return _ref = {
      now: new Date(),
      deptName: '骨一科',
      deptCode: '',
      doctorCode: '',
      doctorName: '医生姓名',
      medicalTitle: '医生职称',
      regDate: '就诊日期',
      clinicDuration: '就诊时间',
      week: '就诊星期',
      cost: 0,
      personListData: [],
      showPersonList: false,
      patientName: '选择就诊人',
      IDCard: '',
      IDCardStatus: false,
      phone: '',
      patientId: 0,
      customerId: '',
      doctorId: 0
    }, __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "doctorCode", 0), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "hbTime", ''), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "hospitalAddress", ''), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "hospitalCode", 2901349), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "attentionFlag", false), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "infoFlag", true), __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_defineProperty___default()(_ref, "firstFlag", true), _ref;
  },
  onLoad: function onLoad(option) {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].enterBrowse();
    var _this = this;
    var info = JSON.parse(decodeURIComponent(option.query));
    this.clinicDuration = info.clinicDuration;
    this.deptCode = info.deptCode;
    this.deptName = info.deptName;
    this.doctorId = info.doctorId || 1522654229281;
    this.doctorCode = info.doctorCode || 8000017;
    this.medicalTitle = info.medicalTitle || this.medicalTitle;
    this.regDate = info.regDate;
    this.hbTime = info.hbTime;
    this.week = this.getWeek(this.regDate);
    this.cost = info.cost;
    this.doctorName = info.doctorName;
    this.IDCard = '';
    this.hospitalAddress = info.hospitalAddress;
    this.now = this.getDay();
    try {
      this.customerId = wx.getStorageSync('userId');
    } catch (e) {}
    // Do something when catch error

    // this.init(this);
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].leaveBrowse();
  },
  onShow: function onShow() {
    this.init(this);
    var patientInfo = {};
    try {
      patientInfo = JSON.parse(wx.getStorageSync('patientInfo'));
    } catch (e) {}
    this.patientId = patientInfo.patientId || 0;
    this.patientName = patientInfo.patientName || '选择就诊人';
    this.phone = patientInfo.mobile || '';
    this.IDCard = patientInfo.certificateCode || '';
    this.IDCardStatus = false;
    this.showPersonList = false;
    this.$refs.verify && this.$refs.verify.cancle();
    // if (this.infoJudge()) this.infoFlag = true;
    this.$refs.share && this.$refs.share.close();
  },

  components: {
    Share: __WEBPACK_IMPORTED_MODULE_4_components_share__["a" /* default */],
    TelephoneVerify: __WEBPACK_IMPORTED_MODULE_5_components_telephoneVerify__["a" /* default */]
  },
  methods: {
    init: function init(_this) {
      wx.showLoading({ title: "正在加载..." });
      __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].ajax({
        url: personApiList.getPatientList,
        method: "POST",
        data: {
          customerId: _this.customerId,
          isValid: "1",
          firstResult: "0",
          maxResult: "9999"
        },
        done: function done(response) {
          wx.hideLoading();
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList && response.responseObject.responseData.dataList.length > 0) {
            var dataList = response.responseObject.responseData.dataList;
            _this.personListData = dataList;
            if (dataList.length == 1) {
              _this.patientName = dataList[0].patientName;
              _this.IDCard = dataList[0].certificateCode;
              _this.phone = dataList[0].mobile;
              _this.patientId = dataList[0].patientId;
              _this.IDCardStatus = dataList[0].idcardStatus == "1" ? true : false;
              // _this.infoFlag = true;
            } else {
              if (_this.firstFlag) {
                _this.showPersonList = true;
              } else {
                _this.showPersonList = false;
              }
              try {
                var value = wx.getStorageSync('mobile');
                if (value) {
                  _this.phone = value;
                }
              } catch (e) {
                console.log(e);
              }
            }
          } else {
            if (_this.firstFlag) {
              wx.navigateTo({ url: '/packageD/registration/orderAddPerson' });
            } else {
              _this.patientName = '添加就诊人';
            }
          }
        }
      });
    },
    idCardvalid: function idCardvalid() {
      // if (this.IDCard != '') {
      //   if (this.infoJudge()) this.infoFlag = true;
      // } else {
      //   this.infoFlag = false;
      // }
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    getWeek: function getWeek(date) {
      var weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      // let day = `${year}/${month}/1`
      var myDate = new Date(date);
      return weekDay[myDate.getDay()];
    },
    getDay: function getDay() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      return year + "-" + month + "-" + day;
    },
    goAddPerson: function goAddPerson() {
      this.firstFlag = false;
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({ actionId: 14252 });
      wx.navigateTo({ url: '/packageD/registration/orderAddPerson' });
    },
    goEditPerson: function goEditPerson(person) {
      this.firstFlag = false;
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({ actionId: 14251 });
      wx.navigateTo({ url: '/packageD/registration/orderEditPerson?query=' + __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(person) });
    },
    goSuccess: function goSuccess() {
      // this.infoFlag = false;
      this.firstFlag = false;
      var _this = this;
      wx.showLoading({ title: "正在加载..." });
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({ actionId: 14258 });
      var param = {
        patientCustoemerId: this.customerId,
        patientId: this.patientId,
        patientName: this.patientName,
        idCard: this.IDCard,
        doctorId: this.doctorId,
        doctorCode: this.doctorCode,
        doctorName: this.doctorName,
        hospitalCode: this.hospitalCode,
        deptCode: this.deptCode,
        deptName: this.deptName,
        regDate: this.regDate,
        // regDate: '2019-06-21',
        hbTime: this.hbTime,
        clinicDuration: this.clinicDuration,
        MedicalTitle: this.medicalTitle
      };

      if (this.patientId == 0 || this.IDCard == '' || this.phone == '') {
        wx.hideLoading();
        this.confirmModal('请补齐就诊人信息');
        return false;
      }
      // _this.savepic();
      // return false;
      __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].ajax({
        url: personApiList.updatePerson,
        method: "POST",
        data: {
          patientId: this.patientId,
          customerId: this.customerId,
          certificateId: 1,
          certificateCode: this.IDCard,
          patientName: this.patientName
        },
        done: function done(response) {
          // _this.infoFlag = true;
          if (response && response.responseObject.responseStatus) {
            var res = response.responseObject.responseData;
            __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].ajax({
              url: personApiList.addRegister,
              method: "POST",
              data: param,
              done: function done(response) {
                wx.hideLoading();
                if (response && response.responseObject.responseStatus || response.responseObject.responseCode == "10002" && response.responseObject.responseStatus) {
                  var _res = response.responseObject.responseData;
                  _this.savepic();
                } else if (response && response.responseObject.responseCode == "10001") {
                  _this.confirmModal('身份证号有误', _this.resultFlag, false);
                } else if (response && response.responseObject.responseCode == "10003") {
                  _this.attentionFlag = true;
                  _this.showPersonList = false;
                } else if (response && response.responseObject.responseCode == "10006") {
                  _this.confirmModal('当前时间已过上午/下午，不能挂号', _this.resultFlag, false);
                } else if (response && response.responseObject.responseCode == "10004") {
                  _this.confirmModal('号源已用完', _this.resultFlag, false);
                } else {
                  _this.confirmModal('挂号失败', _this.resultFlag, false);
                }
              }
            });
          } else if (response && response.responseObject.responseCode == "303") {
            _this.confirmModal('当前账号已多次身份证校验未通过，请明日再试');
          } else {
            _this.confirmModal('身份证号有误');
          }
        }
      });
    },
    personList: function personList(e) {
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({ actionId: 14246 });
      if (this.personListData.length == 0 && !this.firstFlag) {
        wx.navigateTo({ url: '/packageD/registration/orderAddPerson' });
      } else {
        if (e.target.id == "person") this.showPersonList = false;
        if (e.currentTarget.id == "patient") this.showPersonList = true;
      }
    },
    savepic: function savepic() {
      var params = {
        width: 702,
        height: 922,
        backgroundUrl: 'https://m.allinmed.cn/static/image/mp/index/1.5.0/sharebg.png',
        texts: [{
          x: 478,
          y: 146,
          text: '预约成功',
          fontSize: 48,
          color: '#272727'
        }, {
          x: 96,
          y: 260,
          text: '姓名',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 260,
          text: this.patientName,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 370,
          text: '身份证号',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 370,
          text: this.IDCard,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 470,
          text: '就诊科室',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 470,
          text: this.deptName,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 570,
          text: '就诊时间',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 570,
          text: this.regDate + ' ' + this.clinicDuration,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 680,
          text: '医院地址',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 680,
          text: '重庆市百灵路1号金易E世界4栋',
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 650,
          y: 790,
          text: '请您在就诊当日凭本人有效身份证件到一层服',
          fontSize: 30,
          color: '#888'
        }, {
          x: 200,
          y: 830,
          text: '务台取号。',
          fontSize: 30,
          color: '#888'
        }],
        leftButton: {
          type: "save",
          text: "保存本页图片",
          flag: true,
          actionId: 14253
        },
        rightButton: {
          type: "relaunch",
          text: "我的预约挂号",
          url: "/pages/mIndex/mIndex?from=shareFriend&path=/packageD/registration/myOrderList",
          flag: true,
          actionId: 14254
        }
      };
      this.$refs.share.create(params);
    },
    verifyShow: function verifyShow() {
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({ actionId: 14247 });
      this.$refs.verify.show(this.patientId);
    },
    choosePerson: function choosePerson(person) {
      this.patientName = person.patientName;
      this.IDCard = person.certificateCode;
      this.phone = person.mobile;
      this.patientId = person.patientId;
      this.IDCardStatus = person.idcardStatus == "1" ? true : false;
      this.showPersonList = false;
      // if (this.infoJudge()) this.infoFlag = true;
    },
    onChangeTelephoneSuccess: function onChangeTelephoneSuccess(data) {
      this.phone = data.mobile || this.phone;
      // if (this.infoJudge()) this.infoFlag = true;
    },
    confirm: function confirm() {
      this.attentionFlag = false;
    },
    attentionNav: function attentionNav() {
      wx.navigateTo({ url: '/packageD/registration/orderRule' });
    },
    confirmModal: function confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
      var _this = this;
      if (!this.modalFlag) {
        this.modalFlag = true;
        wx.showModal({
          content: info || "出错了",
          showCancel: cancleFlag || false,
          confirmText: '知道了',
          confirmColor: '#333',
          success: function success(res) {
            _this.modalFlag = false;
            if (res.confirm) {
              callbackFlag && (callbackFlag = callbackFlagVal);
            }
          }
        });
      }
    },
    infoJudge: function infoJudge() {
      return this.phone != '' && this.IDCard != '' && this.patientId != 0;
    }
  }
});

/***/ }),

/***/ 1044:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_telephoneVerify_vue__ = __webpack_require__(1046);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6c16a2e4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_telephoneVerify_vue__ = __webpack_require__(1047);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1045)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_telephoneVerify_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6c16a2e4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_telephoneVerify_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/telephoneVerify.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] telephoneVerify.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6c16a2e4", Component.options)
  } else {
    hotAPI.reload("data-v-6c16a2e4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1045:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1046:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_wxValidate__ = __webpack_require__(121);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by zhuning on 2019/06/25.
 */





var telephoneCodeApi = {
  getCode: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/send/code/v1/create/',
  confirm: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/baseinfo/v1/verifyCodeUpdateMobile/'
};

var telephoneReg = {
  tel: /^1[3456789]\d{9}$/,
  code: /^\d{4}$/
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      verifyFlag: false,
      buttonFlag: false,
      codeFlag: true,
      seconds: 60,
      timer: '',
      mobile: '',
      code: '',
      codeId: 0,
      patientId: '',
      modalFlag: false
    };
  },

  methods: {
    blurvalid: function blurvalid(flag) {
      if (flag == "tel" && !telephoneReg.tel.test(this.mobile)) {
        this.confirmModal('请输入正确手机号');
      } else if (flag == "code" && !telephoneReg.code.test(this.code)) {
        this.confirmModal('请输入正确验证码');
      }
      if (telephoneReg.tel.test(this.mobile) && telephoneReg.code.test(this.code)) {
        this.buttonFlag = true;
      }
    },
    cancle: function cancle() {
      __WEBPACK_IMPORTED_MODULE_0_dataLog__["a" /* default */].createTrack({ actionId: 14249 });
      this.verifyFlag = false;
      this.buttonFlag = false;
      this.mobile = '';
      this.code = '';
    },
    show: function show(patientId) {
      this.verifyFlag = true;
      this.patientId = patientId;
      clearInterval(this.timer);
      this.seconds = 60;
      this.codeFlag = true;
    },
    getCode: function getCode() {
      __WEBPACK_IMPORTED_MODULE_0_dataLog__["a" /* default */].createTrack({ actionId: 14248 });
      var _this = this;
      if (telephoneReg.tel.test(this.mobile)) {
        wx.showLoading({ title: "正在加载..." });
        __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
          url: telephoneCodeApi.getCode,
          method: "POST",
          data: {
            account: this.mobile,
            typeId: 16,
            operateType: 26,
            visitSiteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId()
          },
          done: function done(response) {
            wx.hideLoading();
            if (response && !response.responseObject.responseStatus) {
              this.confirmModal('验证码发送有误', _this.verifyFlag, true);
            } else {
              _this.codeId = response.responseObject.responsePk;
              _this.codeFlag = false;
              _this.timer = setInterval(function () {
                _this.seconds = _this.seconds - 1;
                if (_this.seconds <= 0) {
                  clearInterval(_this.timer);
                  _this.codeFlag = true;
                  _this.seconds = 60;
                }
              }, 1000);
            }
          }
        });
      } else {
        if (!this.modalFlag) this.confirmModal('请输入正确手机号');
      }
    },
    confirm: function confirm() {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_0_dataLog__["a" /* default */].createTrack({ actionId: 14250 });
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: telephoneCodeApi.confirm,
        method: "POST",
        data: {
          mobile: this.mobile,
          code: this.code,
          patientId: this.patientId,
          codeId: this.codeId
        },
        done: function done(response) {
          wx.hideLoading();
          if (response && !response.responseObject.responseStatus) {
            _this.confirmModal('验证码有误');
          } else {
            _this.$emit("success", { mobile: _this.mobile });
            _this.codeFlag = false;
            _this.verifyFlag = false;
            _this.buttonFlag = false;
            _this.mobile = '';
            _this.code = '';
          }
        }
      });
    },
    confirmModal: function confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
      var _this = this;
      if (!this.modalFlag) {
        this.modalFlag = true;
        wx.showModal({
          content: info || "出错了",
          showCancel: cancleFlag || false,
          confirmText: '知道了',
          confirmColor: '#333',
          success: function success(res) {
            _this.modalFlag = false;
            if (res.confirm) {
              callbackFlag && (callbackFlag = callbackFlagVal);
            }
          }
        });
      }
    }
  }
});

/***/ }),

/***/ 1047:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.verifyFlag) ? _c('section', {
    staticClass: "telephone-box"
  }, [_c('section', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.mobile),
      expression: "mobile"
    }],
    attrs: {
      "type": "text",
      "placeholder": "请输入新手机号",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.mobile)
    },
    on: {
      "blur": function($event) {
        _vm.blurvalid('tel')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.mobile = $event.target.value
      }
    }
  }), _vm._v(" "), (_vm.codeFlag) ? _c('div', {
    staticClass: "sendcode",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.getCode
    }
  }, [_vm._v("发送验证码")]) : _vm._e(), _vm._v(" "), (!_vm.codeFlag) ? _c('div', {
    staticClass: "sendcode disabled"
  }, [_vm._v("发送验证码(" + _vm._s(_vm.seconds) + ")")]) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.code),
      expression: "code"
    }],
    attrs: {
      "type": "text",
      "placeholder": "请输入验证码",
      "eventid": '2'
    },
    domProps: {
      "value": (_vm.code)
    },
    on: {
      "blur": function($event) {
        _vm.blurvalid('code')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.code = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('div'), _vm._v(" "), _c('div', {
    staticClass: "submit-box"
  }, [_c('form', {
    staticClass: "cancle",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": _vm.cancle
    }
  }, [_c('button', [_vm._v("取消")])], 1), _vm._v(" "), (_vm.buttonFlag) ? _c('form', {
    staticClass: "confirm",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": _vm.confirm
    }
  }, [_c('button', [_vm._v("确认")])], 1) : _vm._e(), _vm._v(" "), (!_vm.buttonFlag) ? _c('form', {
    staticClass: "confirm disabled"
  }, [_c('button', [_vm._v("确认")])], 1) : _vm._e()], 1)])], 1) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6c16a2e4", esExports)
  }
}

/***/ }),

/***/ 1048:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "person"
  }, [_c('Share', {
    ref: "share",
    attrs: {
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "success": _vm.onCreateSuccess
    }
  }), _vm._v(" "), _c('TelephoneVerify', {
    ref: "verify",
    attrs: {
      "eventid": '1',
      "mpcomid": '1'
    },
    on: {
      "success": _vm.onChangeTelephoneSuccess
    }
  }), _vm._v(" "), (_vm.attentionFlag) ? _c('section', {
    staticClass: "attention"
  }, [_c('section', {
    staticClass: "content"
  }, [_c('div', {
    staticClass: "info"
  }, [_c('p', [_vm._v("同一个就诊人每日仅可预约5个号源")]), _vm._v(" "), _c('p', {
    staticClass: "tips"
  }, [_vm._v("详细规则请见"), _c('span', {
    staticClass: "nav",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.attentionNav
    }
  }, [_vm._v("预约须知")])])], 1), _vm._v(" "), _c('div', {
    staticClass: "submit-box"
  }, [_c('form', {
    staticClass: "confirm",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": _vm.confirm
    }
  }, [_c('button', [_vm._v("知道了")])], 1)], 1)])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "person-title"
  }, [_c('span', [_vm._v("今日：" + _vm._s(_vm.now))])]), _vm._v(" "), _c('section', {
    staticClass: "person-order"
  }, [_c('h3', [_vm._v("挂号信息")]), _vm._v(" "), _c('div', {
    staticClass: "order-info"
  }, [_c('div', {
    staticClass: "order-item"
  }, [_c('span', [_vm._v("就诊科室")]), _vm._v(" "), _c('span', {
    staticClass: "order-content"
  }, [_vm._v("重庆唯医骨科医院-" + _vm._s(_vm.deptName))])]), _vm._v(" "), _c('div', {
    staticClass: "order-item"
  }, [_c('span', [_vm._v("就诊医生")]), _vm._v(" "), _c('span', {
    staticClass: "order-content"
  }, [_vm._v(_vm._s(_vm.doctorName) + " " + _vm._s(_vm.medicalTitle))])]), _vm._v(" "), _c('div', {
    staticClass: "order-item no-border"
  }, [_c('span', [_vm._v("就诊日期")]), _vm._v(" "), _c('span', {
    staticClass: "order-content"
  }, [_vm._v(_vm._s(_vm.regDate) + " " + _vm._s(_vm.week) + " " + _vm._s(_vm.clinicDuration))])])])], 1), _vm._v(" "), _c('section', {
    staticClass: "person-order add-info"
  }, [_c('h3', [_vm._v("填写相关信息完成预约")]), _vm._v(" "), _c('div', {
    staticClass: "order-info"
  }, [_c('div', {
    staticClass: "order-item",
    attrs: {
      "id": "patient",
      "eventid": '4'
    },
    on: {
      "click": _vm.personList
    }
  }, [_c('span', [_vm._v("就诊人")]), _vm._v(" "), _c('span', {
    staticClass: "order-content"
  }, [_vm._v(_vm._s(_vm.patientName) + "\n                    "), _c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/order_info_go.png"
    }
  })])]), _vm._v(" "), _c('div', {
    staticClass: "order-item"
  }, [_c('span', [_vm._v("身份证")]), _vm._v(" "), (!_vm.IDCardStatus) ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.IDCard),
      expression: "IDCard"
    }],
    staticClass: "order-content idcard",
    attrs: {
      "type": "text",
      "placeholder": "就诊人身份证号",
      "eventid": '5'
    },
    domProps: {
      "value": (_vm.IDCard)
    },
    on: {
      "blur": _vm.idCardvalid,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.IDCard = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.IDCardStatus) ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.IDCard),
      expression: "IDCard"
    }],
    staticClass: "order-content idcard",
    attrs: {
      "type": "text",
      "placeholder": "就诊人身份证号",
      "disabled": "",
      "eventid": '6'
    },
    domProps: {
      "value": (_vm.IDCard)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.IDCard = $event.target.value
      }
    }
  }) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "order-item no-border",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": _vm.verifyShow
    }
  }, [_c('span', [_vm._v("手机号")]), _vm._v(" "), _c('button', {
    staticClass: "order-content-btn"
  }, [_vm._v(_vm._s(_vm.phone) + "\n                    "), _c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/order_info_go.png"
    }
  })])], 1), _vm._v(" "), _c('div', {
    staticClass: "order-item no-border phone-sure"
  }, [_c('span', [_vm._v("(请确保手机号为本人号码)")])])])], 1), _vm._v(" "), _c('section', {
    staticClass: "person-btn"
  }, [_c('form', {
    staticClass: "person-order-btn",
    attrs: {
      "report-submit": "true",
      "eventid": '10'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(!_vm.infoFlag) ? _c('span', [(_vm.cost === 0) ? _c('button', {
    staticClass: "disabled"
  }, [_vm._v("免费预约" + _vm._s(_vm.type))]) : _c('button', {
    staticClass: "disabled"
  }, [_vm._v("免费预约" + _vm._s(_vm.type))])], 1) : _vm._e(), _vm._v(" "), (_vm.infoFlag) ? _c('span', [(_vm.cost === 0) ? _c('button', {
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": _vm.goSuccess
    }
  }, [_vm._v("免费预约" + _vm._s(_vm.type))]) : _c('button', {
    attrs: {
      "eventid": '8'
    },
    on: {
      "click": _vm.goSuccess
    }
  }, [_vm._v("免费预约" + _vm._s(_vm.type))])], 1) : _vm._e()])], 1), _vm._v(" "), (_vm.showPersonList) ? _c('section', {
    staticClass: "persons",
    attrs: {
      "id": "person",
      "eventid": '14'
    },
    on: {
      "click": _vm.personList
    }
  }, [_c('div', {
    staticClass: "tit"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/patient.png"
    }
  }), _vm._v("\n          选择就诊人\n        ")]), _vm._v(" "), _c('section', {
    staticClass: "person-list"
  }, _vm._l((_vm.personListData), function(item, index) {
    return _c('div', {
      key: index,
      staticClass: "person-item",
      attrs: {
        "eventid": '12-' + index
      },
      on: {
        "click": function($event) {
          _vm.choosePerson(item)
        }
      }
    }, [_c('span', {
      staticClass: "person-item-name"
    }, [_vm._v(_vm._s(item.patientName))]), _vm._v(" "), _c('span', {
      staticClass: "person-item-sex"
    }, [_vm._v(_vm._s(item.patientSex == 1 ? '男' : '女'))]), _vm._v(" "), _c('span', {
      staticClass: "person-item-age"
    }, [_vm._v(_vm._s(item.patientAge) + "岁")]), _vm._v(" "), (item.idcardStatus != 1) ? _c('form', {
      staticClass: "person-item-edit"
    }, [_c('button', {
      attrs: {
        "eventid": '11-' + index
      },
      on: {
        "click": function($event) {
          _vm.goEditPerson(item)
        }
      }
    }, [_vm._v("编辑")])], 1) : _vm._e(), _vm._v(" "), (item.idcardStatus == 1) ? _c('span', {
      staticClass: "person-item-tips"
    }, [_vm._v("已实名认证，不可更改")]) : _vm._e()], 1)
  })), _vm._v(" "), _c('section', {
    staticClass: "add-person"
  }, [_c('form', {
    staticClass: "add-person-btn"
  }, [_c('button', {
    attrs: {
      "eventid": '13'
    },
    on: {
      "click": _vm.goAddPerson
    }
  }, [_vm._v("添加就诊人")])], 1)], 1)], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-00ea210e", esExports)
  }
}

/***/ })

},[1299]);