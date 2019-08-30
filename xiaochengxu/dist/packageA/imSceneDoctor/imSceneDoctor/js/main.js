global.webpackJsonp([1],{

/***/ 699:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imSceneDoctor_vue__ = __webpack_require__(701);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1598236b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imSceneDoctor_vue__ = __webpack_require__(776);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(700)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imSceneDoctor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1598236b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imSceneDoctor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/imSceneDoctor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] imSceneDoctor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1598236b", Component.options)
  } else {
    hotAPI.reload("data-v-1598236b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 700:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 701:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_nimEnv_nimEnv__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_imBaseMethods_imBusinessMethods__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_nimEnv_NIM_Web_NIM_v5_3_0__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13_common_js_nimEnv_NIM_Web_NIM_v5_3_0__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_content__ = __webpack_require__(702);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_image__ = __webpack_require__(706);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_patientNodeMsg__ = __webpack_require__(710);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_bottomTips__ = __webpack_require__(714);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_middleTips__ = __webpack_require__(718);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_payFinishTips__ = __webpack_require__(722);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_outpatientInvite__ = __webpack_require__(726);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_outpatientAppointment__ = __webpack_require__(730);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_outpatientService__ = __webpack_require__(734);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_sendCount__ = __webpack_require__(738);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__components_video__ = __webpack_require__(742);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__components_mulitpleImage__ = __webpack_require__(746);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__components_fileMessage__ = __webpack_require__(750);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_components_suggestion__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__components_reportDetails__ = __webpack_require__(754);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__components_doctorAdvice__ = __webpack_require__(758);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__components_medicalReport__ = __webpack_require__(762);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__components_reportImageUpload__ = __webpack_require__(766);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__components_serviceComment__ = __webpack_require__(770);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34_common_js_HttpRequest_getNimToken__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_common_js_HttpRequest_getCaseInfo__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36_common_js_HttpRequest_getConsultationList__ = __webpack_require__(179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37_common_js_HttpRequest_createConsultation__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38_common_js_HttpRequest_getConsultationLastTime__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39_common_js_HttpRequest_getPatientBase__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40_common_js_HttpRequest_getDoctorBaseMsg__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41_common_js_HttpRequest_getReportDetails__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43_common_js_HttpRequest_updateConsultation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44_common_js_HttpRequest_getMedicalReportDetails__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45_common_js_HttpRequest_updateAfterTimeOver__ = __webpack_require__(774);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46_common_js_HttpRequest_refreshToken__ = __webpack_require__(775);



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
 * Created by Hallmader on 2018/5/15.
 */

// /**************************Common Components**************************/



 // 返回首页组件

 //黑名单组件
// /**************************Common Methods*************************/




// /**************************ThirdParty Components**************************/


// /**************************Base Vue-Methods*************************/
//
// /**************************Private Methods*************************/






 //门诊邀约单（除银川医生外展示的）
 //门诊预约单
 //门诊邀约单（银川医生展示的）








 // 报到单的图片上传
 // 服务评价消息体
// /**************************Axios Http Requests*************************/














var XHRList = {
  sendMessage: __WEBPACK_IMPORTED_MODULE_7_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
};
var imBaseMethods = void 0;
var scrollTimer = null; // 页面滑动的定时器

var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_14_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "index",
  data: function data() {
    return {
      ios: "",
      caseId: "",
      caseType: "",
      doctorCustomerId: "",
      patientId: "",
      patientCustomerId: "",
      from: "",
      consultationState: "",
      consultationLevel: "",
      mainCase: "",
      textareaShow: true,
      scrollTop: 0,
      timeStampList: [],
      allMsgsGot: false,
      historyBeginTime: 0,
      isLeave: false,
      disabled: false, // input 是否可以点击 ；
      titleName: "", //document.title 的话术
      onFocus: false,
      inputImageFlag: true, //上传图片input控制
      inputVideoFlag: true, //上传视频input控制
      inputPdfFlag: true, //上传pdf文件控制
      progressNum: 0, // 正在上传的个数
      loading: true,
      totalCount: 0,
      pulling: false,
      shuntCustomerId: "",
      bottomTipsShow: false,
      bottomTipsType: "",
      receiveTreatmentStatus: false,
      footerBottomFlag: false, // 底部文件选择框是否显示
      receiveTime: "",
      imageList: [],
      consultationId: "",
      setFocus: false,
      timeStampShowList: [],
      orderSourceId: "",
      triageOrderSourceId: "",
      beginTimestamp: 0,
      finish: true,
      lastTimeShow: false,
      inputBoxShow: false,
      msgList: [],
      targetMsgList: [],
      connectFlag: false,
      imageLastIndex: 0, //上传图片最后一张记录在数组中的位置
      userData: {
        account: "",
        token: ""
      },
      targetData: {
        account: "2_" + ""
      },
      sendTextContent: "",
      footerPosition: "main-input-box",
      scrollHeight: "",
      deleteMsgIndex: -1,
      toastContent: "",
      toastImg: "",
      toastShow: false,
      getTargetMsgFinish: false,
      recommendShow: false, // 重新推荐按钮是否显示，主要是为了处理找医生流程分诊推荐的医生
      connectNum: 0,
      clickFlag: true,
      isIPad: false, // 是否是 iPad
      backIndexShow: false // 返回首页是否显示
    };
  },
  onLoad: function onLoad(e) {
    var _this2 = this;

    console.log("Loaded");
    var query = this.$root.$mp.query;
    // this.stopLastTimeCount();
    console.log(e);
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.msgList = [];
    this._originList = [];
    this.imageList = [];
    this.bottomTipsShow = false;
    this.bottomTipsType = "";
    this.lastTimeShow = false;
    this.inputBoxShow = false;

    this.from = query.from;
    this.caseId = parseInt(query.caseId);
    this.doctorCustomerId = parseInt(query.doctorCustomerId);
    this.patientId = parseInt(query.patientId);
    this.patientCustomerId = parseInt(__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem("userId"));
    this.reportId = parseInt(query.reportId);
    this.allMsgsGot = false;

    this.userData = {
      account: "0_" + this.caseId,
      token: ""
    };
    this.targetData = {
      account: "2_" + this.doctorCustomerId
    };
    this.isIPad = wx.getSystemInfoSync().model.includes("iPad") ? true : false;
    this.ios = wx.getSystemInfoSync().system.toLowerCase().includes("ios") ? true : false;
    var _init = function _init() {
      if (__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('imShowToast') == "yes") {
        _this2.showToast("您已完成报到，可直接与医生沟通", "", function () {
          __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem('imShowToast');
          _this2.getUserBaseData();
        });
      } else {
        _this2.getUserBaseData();
      }
    };
    console.log("nim Check...");
    console.log(this.nim);
    if (this.nim && this.nim.disconnect) {
      console.log("SDK disconnect...");
      this.nim.disconnect({
        done: function done() {
          _this2.nim = {};
          console.log('disconnect really done!');
          _init();
        }
      });
    } else {
      console.log("SDK已销毁...初始化开始");
      _init();
    }

    wx.onNetworkStatusChange(function (res) {
      console.log("netStatus:" + res.isConnected);
      if (res.isConnected) {
        if (_this2.connectNum === 0) {
          _init();
        }
      } else {
        _this2.connectNum = 0;
        if (_this2.nim && _this2.nim.disconnect) {
          _this2.nim.disconnect({
            done: function done() {
              console.log('disconnect really done!');
              _init();
            }
          });
        }
      }
    });
  },
  onUnload: function onUnload() {
    var _this3 = this;

    console.log("Unload...");
    clearInterval(this.remainTimeCount);
    this.pauseLastTimeCount();
    console.log("nim Check...");
    console.log(this.nim);
    if (this.nim && this.nim.disconnect) {
      this.nim.disconnect({
        done: function done() {
          _this3.nim = {};
          console.log(_this3.nim);
        }
      });
    }
    this.msgList = [];
    this._originList = [];
    this.imageList = [];
    this.setTargetMsg({
      avatar: "",
      nick: "",
      title: "",
      hospital: "",
      companyId: "",
      medical: ""
    });
    this.caseId = "";
    this.doctorCustomerId = "";
    this.patientId = "";
    this.patientCustomerId = "";
    this.reportId = "";
    this.sendTextContent = "";
    this.connectFlag = false;
    this.historyBeginTime = 0;
    this.allMsgsGot = false;
    this.bottomTipsShow = false;
    this.bottomTipsType = "";
    this.lastTimeShow = false;
    this.getTargetMsgFinish = false;
    this.inputBoxShow = false;
    this.footerBottomFlag = false;
    this.connectNum = 0;
    clearTimeout(scrollTimer);
    this.setLastCount("");
    this.stopLastTimeCount();
    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].setItem("alreadyCreateIm", 1);

    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem("sendTips");
    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem("targetMsg");
    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem("doctorName");
    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem("orderSourceId");
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].leaveBrowse();
    clearInterval(this.remainTimeCount);
    this.pauseLastTimeCount();
    __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].setItem("alreadyCreateIm", 1);
  },
  onShow: function onShow() {
    var _this4 = this;

    __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].enterBrowse();
    var _init = function _init() {
      console.log("show");
      _this4.getDoctorMsg();
      if (__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('sendOrderMsg')) {
        _this4.getPatientBase();
      }
      setTimeout(function () {
        if (__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('sendOrderMsg') && !!imBaseMethods && imBaseMethods.sendCustomMessage) {
          imBaseMethods.sendCustomMessage({
            to: _this4.targetData.account,
            custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
              cType: "1",
              cId: _this4.doctorCustomerId,
              mType: "52",
              conId: _this4.orderSourceId
            }),
            content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
              type: "outpatientOrderFromPT",
              data: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(JSON.parse(__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('sendOrderMsg'), {
                caseId: _this4.userData.account.substring(2),
                patientId: _this4.patientId
              }))
            })
          }).then(function (msg) {
            __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem('sendOrderMsg');
            _this4.sendMessageSuccess(msg);
          });
        }
        // 判断是否是支付成功；
        console.log(__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('paySuccessParams'));
        if (__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('paySuccessParams')) {
          _this4.paySuccessCallBack(JSON.parse(__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem('paySuccessParams')));
          __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem('paySuccessParams');
        } else {
          console.log("\u8FDE\u63A5\u6570:" + _this4.connectNum);
          if (_this4.connectNum > 0) {
            _this4.getConsultationStatus();
          }
        }
      }, 200);
    };

    _init();
  },
  mounted: function mounted() {
    this.getToolbarConfig();
  },
  onPullDownRefresh: function onPullDownRefresh() {
    var _this5 = this;

    console.log("pull");
    console.log(this.historyBeginTime);
    this.pulling = true;
    imBaseMethods.getMessageList({
      beginTime: 0,
      endTime: this.historyBeginTime,
      target: this.targetData.account,
      limit: 20
    }).then(function (obj) {
      console.log(obj);
      wx.stopPullDownRefresh();
      if (obj.msgs.length === 0) {
        _this5.showToast("没有更多消息了");
        _this5.pulling = false;
        _this5.allMsgsGot = true;
      } else {
        _this5.buildRenderMsg("scrollInit", obj.msgs);
      }
    });
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['patientName', 'reportImageUpload', 'patientInfo', 'toolbarConfig', 'targetMsg', 'logoUrl', 'lastTime', 'lastCount']), mapGetters(['targetLogo', 'certificateCodeEncrypt']), {
    doctorTitleName: function doctorTitleName() {
      var result = [];

      if (this.targetMsg.title) {
        if (this.targetMsg.title.includes("_")) {
          this.targetMsg.title.split(",").forEach(function (element, index) {
            if (element.length > 0) {
              result.push(element.substring(2));
            }
          });
          return result.join(",");
        } else {
          return this.targetMsg.title;
        }
      }
    },
    lastTimeText: function lastTimeText() {
      return __WEBPACK_IMPORTED_MODULE_7_common_js_util_util__["a" /* default */].MillisecondToDate(this.lastTime);
    }
  }),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setPatientName', 'setCaseType', 'setPatientInfo', 'lastCountPlus', 'lastCountMinus', 'setTargetMsg', 'setLogoUrl', 'setConsultation', 'setLastTime', 'lastTimeCount', 'setLastCount', 'stopLastTimeCount', 'setTargetList', 'pauseLastTimeCount']), mapActions(['getToolbarConfig']), {
    inputFunc: function inputFunc(e) {
      console.log(e.target.value);
      this.sendTextContent = e.target.value;
    },
    goToDoctorHomePage: function goToDoctorHomePage() {
      var urlTemp = "/pages/doctorMain/doctorMain?doctorCustomerId=" + this.doctorCustomerId + "&patientId=" + this.patientId + "&caseId=" + this.caseId + "&patientCustomerId=" + this.patientCustomerId + "&caseType=" + this.caseType + "&from=imSceneDoctor";
      wx.navigateTo({
        url: urlTemp
      });
    },

    // 支付成功回调
    paySuccessCallBack: function paySuccessCallBack(param) {
      var _this6 = this;

      var state = "";
      if (this.bottomTipsType == -1) {
        state = -1;
      } else {
        state = 0;
      }
      if (state === -1) {
        this.getLastTime(-1);
        this.sendPayFinish(param);
      } else {
        this.getLastTime(0);
        this.sendPayFinish(param);
        setTimeout(function () {
          _this6.lastTimeShow = true;
          _this6.receiveTreatmentStatus = true;
        }, 200);
      }
      this.footerBottomFlag = false;
    },
    showTabbar: function showTabbar() {
      this.footerBottomFlag = this.footerBottomFlag ? false : true;
      this.scrollToBottom();
    },

    //toast显示
    showToast: function showToast(text, img, callback) {
      var _this7 = this;

      this.toastContent = text;
      this.toastImg = img;
      this.toastShow = true;
      setTimeout(function () {
        _this7.toastContent = "";
        _this7.toastImg = "";
        _this7.toastShow = false;
        if (typeof callback == "function") {
          callback();
        }
      }, 2000);
    },
    getUserBaseData: function getUserBaseData() {
      var _this8 = this;

      this.getCaseBaseInfo(); // 通过caseId 获取 case 的基本信息

      Object(__WEBPACK_IMPORTED_MODULE_34_common_js_HttpRequest_getNimToken__["a" /* default */])({
        accid: this.caseId
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseCode == 'fail') {
            // this.finish = true;
            _this8.showToast("获取 Token 失败，请重新咨询");
            return;
          }
          _this8.userData = {
            account: "0_" + _this8.caseId,
            token: data.responseObject.responseData.imToken
          };
          if (_this8.connectNum == 0) {
            if (_this8.from === "report") {
              setTimeout(function () {
                _this8.connectToNim();
              }, 2000);
            } else {
              _this8.connectToNim();
            }
          }
        }
      });
    },
    refreshToken: function refreshToken() {
      var _this9 = this;

      Object(__WEBPACK_IMPORTED_MODULE_46_common_js_HttpRequest_refreshToken__["a" /* default */])({
        accid: "0_" + caseId
      }).then(function (param) {
        if (param.responseObject.responseStatus) {
          _this9.userData = {
            account: "0_" + caseId,
            token: param.responseObject.responseData.token
          };
        }
      });
    },

    //底部重新购买按钮
    retryClick: function retryClick(e, type) {
      var _this10 = this;

      switch (type) {
        case -1:
          __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
            actionId: 14180
          });
          wx.navigateTo({
            url: "/packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder?doctorCustomerId=" + this.doctorCustomerId + "&caseId=" + this.caseId + "&state=-1&orderSourceId=" + this.orderSourceId
          });
          break;
        case 1:
          __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
            actionId: 14181
          });
          wx.navigateTo({
            url: "/packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder?doctorCustomerId=" + this.doctorCustomerId + "&caseId=" + this.caseId + "&state=0&orderSourceId=" + this.orderSourceId
          });
          break;
        case 2:
          if (this.caseType == 12 || this.caseType == 13) {
            __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
              actionId: 14194,
              browseTypeUrl: "packageA/imSceneDoctor/imSceneDoctor?from=find"
            });
          } else {
            __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
              actionId: 14194
            });
          }
          Object(__WEBPACK_IMPORTED_MODULE_43_common_js_HttpRequest_updateConsultation__["a" /* default */])({
            consultationId: this.triageOrderSourceId,
            frequency: "0",
            frequencyType: "5",
            consultationLevel: "1",
            consultationState: "2"
          }).then(function (data) {
            if (data.responseObject.responseData) {
              // 存储Storage，给分诊医生im使用；
              __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].setItem("doctor", _this10.targetMsg.nick);
              // 用来获取最近的一层的分诊IM的层级
              var _arr = getCurrentPages().reverse();
              var backNum = -1;
              for (var j = 0, len = _arr.length; j < len; j++) {
                if (_arr[j].route == 'packageA/imScene/imScene') {
                  backNum = j;
                  j = len;
                }
              }
              if (backNum == -1) {
                if (_this10.nim && _this10.nim.disconnect) {
                  _this10.nim.disconnect({
                    done: function done() {
                      _this10.nim = {};
                      wx.redirectTo({
                        url: "/packageA/imScene/imScene?&caseId=" + _this10.caseId + "&patientId=" + _this10.patientId
                      });
                    }
                  });
                } else {
                  wx.redirectTo({
                    url: "/packageA/imScene/imScene?&caseId=" + _this10.caseId + "&patientId=" + _this10.patientId
                  });
                }
              } else {
                if (_this10.nim && _this10.nim.disconnect) {
                  _this10.nim.disconnect({
                    done: function done() {
                      _this10.nim = {};
                      wx.navigateBack({
                        delta: backNum
                      });
                    }
                  });
                } else {
                  wx.navigateBack({
                    delta: backNum
                  });
                }
              }
            }
          });
          break;
      }
    },
    getCaseBaseInfo: function getCaseBaseInfo() {
      var _this11 = this;

      Object(__WEBPACK_IMPORTED_MODULE_35_common_js_HttpRequest_getCaseInfo__["a" /* default */])(this.caseId).then(function (data) {
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData;

        if (responseStatus && responseData) {
          var _responseData$dataLis = responseData.dataList[0],
              caseType = _responseData$dataLis.caseType,
              doctorId = _responseData$dataLis.doctorId;

          _this11.caseType = caseType;
          _this11.setCaseType(caseType);
          console.log(parseInt(doctorId) && !(parseInt(doctorId) == _this11.doctorCustomerId));
          if (parseInt(doctorId) && !(parseInt(doctorId) == _this11.doctorCustomerId)) {
            _this11.recommendShow = true;
          } else {
            _this11.recommendShow = false;
          }
        } else {
          console.log("获取case 的基本信息失败");
        }
      });
    },


    //actionType透传消息统一处理接收条件
    receivedNotification: function receivedNotification(msg, actionType) {
      var flag = false;
      if (msg.type === "custom") {
        if (msg.content.type === "notification" && msg.content.data.actionType == actionType) {
          flag = true;
        }
      }
      return flag;
    },
    sendMessage: function sendMessage() {
      var _this12 = this;

      if (this.sendTextContent.trim().length === 0) {
        return false;
      } else {
        this.textareaShow = false;
        var isJion = false; //判断是否改变了recommendShow的状态
        if (this.recommendShow) {
          this.recommendShow = false;
          isJion = true;
        }
        if (!this.clickFlag) return false;
        this.clickFlag = false;
        console.log(this.sendTextContent.trim().substring(0, 20));
        __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
          actionId: 14202,
          keyword: this.sendTextContent.trim()
        });
        var hints = 0,
            ret = this.nim.filterClientAntispam({
          content: this.sendTextContent.trim()
        });
        switch (ret.type) {
          case 0:
            console.log('没有命中反垃圾词库', ret.result);
            hints = 0;
            break;
          case 1:
            hints = 1;
            console.log('已对特殊字符做了过滤', ret.result);
            break;
          case 2:
            hints = 1;
            console.log('建议拒绝发送', ret.result);
            break;
          case 3:
            hints = 1;
            console.log('建议服务器处理反垃圾，发消息带上字段clientAntiSpam', ret.result);
            break;
        }
        imBaseMethods.sendMessage({
          target: this.targetData.account,
          sendContent: this.sendTextContent.trim(),
          custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "0",
            conId: this.orderSourceId,
            hints: hints
          }),
          needPushNick: false,
          pushContent: "\u60A3\u8005" + (this.patientName ? this.patientName : "") + ":" + this.sendTextContent.trim().substring(0, 20),
          pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            account: "0_" + this.caseId,
            type: "1"
          })
        }).then(function (obj) {
          if (isJion) {
            _this12.recommendShow = true;
          }
          _this12.textareaShow = true;
          _this12.setFocus = true;
          _this12.sendMessageSuccess(obj);
          //命中反垃圾，发送发垃圾消息提醒
          if (hints == 1) {
            _this12.sendAntiSpamTips();
          }
        }).catch(function (err, obj) {
          _this12.sendFail(err, obj);
        });
      }
    },

    //发送成功回调
    sendMessageSuccess: function sendMessageSuccess(msg) {
      var _this13 = this;

      this.clickFlag = true;
      this.getTimeStampShowList(msg);
      console.log("\u53D1\u9001" + msg.scene + msg.type + "\u6D88\u606F\u6210\u529F, id=" + msg.idClient);
      if (msg.type === "custom") {
        msg.content = JSON.parse(msg.content);
      }

      if (!(msg.type === "custom" && msg.content.type === "deleteMsgTips")) {
        this.sendTextContent = "";
      }
      msg.timeStamp = this.transformTimeStamp(msg.time);
      // const _msg = this.setPraviteMessage(msg);
      this.msgList.push(this.setPraviteMessage(msg));
      this._originList.push(msg);
      // this.historyBeginTime=_msg.time;
      if (msg.type === "text") {
        this.setFocus = true;
      }

      if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
        var idClient = msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient || msg.content.data.imMessage && msg.content.data.imMessage.idClient || msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId;
        this.msgList.forEach(function (element, index) {
          if (element.idClient === idClient) {
            _this13.msgList.removeByValue(element);
            return;
          }
        });
        this._originList.forEach(function (element, index) {
          if (element.idClient === idClient) {
            _this13._originList.removeByValue(element);
            return;
          }
        });
      }
      this.scrollToBottom();
    },

    //发送失败回调
    sendFail: function sendFail(err, msg) {
      this.clickFlag = true;
      console.log(err, msg);
      console.log("\u53D1\u9001" + msg.type + "\u6D88\u606F\u5931\u8D25, id=" + msg.idClient);
    },
    triageDoctorAssign: function triageDoctorAssign() {
      var _this14 = this;

      //是否有分诊会话记录
      //无则创建
      //有则获取
      console.log({
        caseId: this.caseId,
        consultationType: 1,
        customerId: this.doctorCustomerId
      });
      Object(__WEBPACK_IMPORTED_MODULE_36_common_js_HttpRequest_getConsultationList__["a" /* default */])({
        caseId: this.caseId,
        consultationType: 1,
        customerId: this.doctorCustomerId
      }).then(function (data) {
        console.log(data);
        if (data.responseObject.responseMessage === "NO DATA") {
          _this14.createTriageMessage();
        } else {
          var dataList = data.responseObject.responseData.dataList;
          _this14.orderSourceId = dataList[0].consultationId;
          _this14.getLastTime(parseInt(dataList[0].consultationState));
          _this14.getMessageList("history");
        }
      });
    },

    //创建分流
    createTriageMessage: function createTriageMessage() {
      var _this15 = this;

      Object(__WEBPACK_IMPORTED_MODULE_37_common_js_HttpRequest_createConsultation__["a" /* default */])({
        caseId: this.caseId,
        caseType: "14",
        customerId: this.doctorCustomerId,
        patientCustomerId: this.patientCustomerId,
        patientId: this.patientId,
        consultationType: 1,
        consultationState: 0,
        consultationFrequency: 50,
        siteId: __WEBPACK_IMPORTED_MODULE_7_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          //创建就诊信息
          _this15.orderSourceId = data.responseObject.responsePk;

          _this15.getMessageList("history");
          _this15.getLastTime(0);
        }
      });
    },

    //获取剩余时间/次数
    getLastTime: function getLastTime(status) {
      var _this16 = this;

      Object(__WEBPACK_IMPORTED_MODULE_38_common_js_HttpRequest_getConsultationLastTime__["a" /* default */])({
        caseId: this.caseId,
        customerId: this.doctorCustomerId,
        consultationType: 1
      }).then(function (param) {
        _this16.inputBoxShow = true;
        console.log(param);
        if (param.responseObject.responseStatus) {
          var dataList = param.responseObject.responseData.dataList;
          var time = parseInt(dataList.remainingTime);
          var count = parseInt(dataList.consultationFrequency);
          var receiveTime = parseInt(dataList.receiveTime);
          var endState = parseInt(dataList.endState);
          _this16.consultationState = parseInt(dataList.consultationState);
          _this16.shuntCustomerId = dataList.triageCustomerId;
          _this16.triageOrderSourceId = dataList.triageConsultationId;
          _this16.consultationLevel = dataList.consultationLevel;

          _this16.getConsultationStatusByTime(dataList, time, count, receiveTime, status, endState);
        }
      });
    },

    //根据剩余时间/次数进入各状态
    getConsultationStatusByTime: function getConsultationStatusByTime(dataList, time, count, receiveTime, status, endState) {
      clearInterval(this.remainTimeCount);
      this.pauseLastTimeCount();
      // -1 为不限次，针对于美年来源
      if (count == -1) {
        if (status == 2 || status == 3) {
          this.receiveTreatmentStatus = false;
          this.lastTimeShow = false;
          this.textareaShow = false;
          this.bottomTipsType = 2;
          this.footerBottomFlag = false;
          this.bottomTipsShow = false;
          // if (this.caseType == 12 || this.caseType == 13) {
          //   this.inputBoxShow = false;
          // }
        } else {
          this.receiveTreatmentStatus = true;
          this.bottomTipsShow = false;
          this.lastTimeShow = true;
          this.textareaShow = true;
          this.bottomTipsType = "";
          // status 等于 -1 时，是待就诊状态
          if (status < 0) {
            this.receiveTreatmentStatus = false;
            this.lastTimeShow = false;
            if (receiveTime >= 0) {
              console.log(receiveTime);
              this.receiveTime = receiveTime;
              // this.receiveTime = 5000;
              this.remainTimeOut();
            } else {
              this.textareaShow = false;
              this.footerBottomFlag = false;
              this.bottomTipsType = 2;
            }
          }
        }
      } else {
        this.totalCount = 0;
        // 若未接诊，接诊是否已超时...
        if (status < 0) {
          this.receiveTreatmentStatus = false;
          if (receiveTime <= 0) {
            this.showBottomTips(-1);
            this.textareaShow = false;
            this.footerBottomFlag = false;
          } else {
            console.log(receiveTime);
            this.receiveTime = receiveTime;
            // this.receiveTime = 5000;
            this.bottomTipsShow = false;
            this.lastTimeShow = false;
            this.textareaShow = true;
            this.bottomTipsType = "";
            this.remainTimeOut();
          }
        } else if (status === 0) {
          // 已接诊，设置剩余时间次数...
          this.receiveTreatmentStatus = true;
          this.setConsultation(dataList.consultationId);

          if (time > 0 && count > 0) {
            // time == 99999999 为报到的患者，不限时间，只限 50次回复
            if (time === 999999999) {
              this.totalCount = count;
              this.setLastCount(count);
              this.lastTimeShow = true;
              this.textareaShow = true;
              this.bottomTipsType = "";
            } else {
              this.setLastTime(time);
              this.lastTimeCount();
              this.setLastCount(count);
              this.textareaShow = true;
              this.lastTimeShow = true;
              this.bottomTipsType = "";
            }
          } else {
            this.lastTimeShow = false;
            this.textareaShow = false;
            this.footerBottomFlag = false;
            this.showBottomTips(1);
          }
        } else if (status == 3) {
          // 对美年来源做区分
          if (this.caseType == '15') {
            this.receiveTreatmentStatus = false;
            this.lastTimeShow = false;
            this.textareaShow = false;
            this.bottomTipsType = 2;
            this.footerBottomFlag = false;
            this.bottomTipsShow = false;
          } else {
            this.lastTimeShow = false;
            this.textareaShow = false;
            this.footerBottomFlag = false;
            this.showBottomTips(-1);
          }
        } else if (status == 2) {
          this.lastTimeShow = false;
          this.textareaShow = false;
          this.bottomTipsType = 2;
          this.footerBottomFlag = false;
          this.bottomTipsShow = false;

          // if (this.caseType == 12 || this.caseType == 13) {
          //   this.inputBoxShow = false;
          // }
        } else if (status == 1) {
          //结束
          // 对美年来源做区分
          if (this.caseType == '15') {
            this.receiveTreatmentStatus = true;
            this.bottomTipsShow = false;
            this.lastTimeShow = true;
            this.textareaShow = true;
            this.bottomTipsType = "";
          } else {
            this.textareaShow = false;
            this.lastTimeShow = false;
            this.footerBottomFlag = false;
            if (endState == 1 || endState == 2) {
              //强制结束
              this.showBottomTips(3);
            } else {
              //正常结束
              this.showBottomTips(1);
            }
          }
        }
      }
    },
    showBottomTips: function showBottomTips(type) {
      this.bottomTipsShow = true;
      this.bottomTipsType = type;
    },

    //接诊时间倒数
    remainTimeOut: function remainTimeOut() {
      var _this17 = this;

      this.remainTimeCount = setInterval(function () {
        // console.log(this.receiveTime)
        if (_this17.receiveTime <= 0) {
          clearInterval(_this17.remainTimeCount);
          setTimeout(function () {
            _this17.getConsultationStatus();
          }, 1000);
          // this.bottomTipsType = -1;
          // this.bottomTipsShow=true;
          // this.footerBottomFlag = false;

          if (_this17.orderSourceId && _this17.consultationLevel) {
            Object(__WEBPACK_IMPORTED_MODULE_45_common_js_HttpRequest_updateAfterTimeOver__["a" /* default */])({
              consultationId: _this17.orderSourceId,
              consultationType: "1",
              consultationLevel: _this17.consultationLevel,
              consultationState: "-1",
              updateConsultationState: "3"
            }).then(function (res) {
              if (res.responseObject.responseStatus) {
                console.log("时间结束后更新状态成功");
              }
            }).catch(function (err) {
              console.log("时间结束后更新状态失败");
            });
          }
        } else {
          _this17.receiveTime = _this17.receiveTime - 1000;
        }
      }, 1000);
    },

    // 连接IM
    connectToNim: function connectToNim() {
      var _this18 = this;

      var that = this;
      //获取IM Token/appKey
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_nimEnv_nimEnv__["a" /* default */])().then(function (nimEnv) {
        _this18.finish = true;
        console.log(nimEnv);
        _this18.nim = __WEBPACK_IMPORTED_MODULE_13_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default.a.getInstance({
          debug: false,
          appKey: nimEnv,
          account: _this18.userData.account,
          token: _this18.userData.token,
          reconnectionAttempts: 0, //断线不主动重连，否则Unload后
          onconnect: function onconnect(data) {
            _this18.finish = false;
            console.log(nimEnv);
            console.log("连接成功");
            _this18.connectNum += 1;

            _this18.triageDoctorAssign();

            imBaseMethods = new __WEBPACK_IMPORTED_MODULE_10_common_js_imBaseMethods_imBusinessMethods__["a" /* default */](_this18.nim);
            _this18.nim.getClientAntispamLexicon({
              done: function done(error, file) {
                console.log('获取词库完成');
                console.log(error);
                console.log(file);
              }
            });
          },
          onupdatesession: function onupdatesession(obj) {
            console.log('更新会话');
            console.log(obj);

            if (obj.to == that.targetData.account && obj.lastMsg.fromClientType == 'Server') {
              if (obj.lastMsg.content.type === "medicalReport" || obj.lastMsg.content.type === "reportOrder") {
                this.renderReceiveMessage(obj.lastMsg);
              }
              // let content=JSON.parse(obj.lastMsg.content);
              // if(content.type === "notification"&&content.data.actionType==58){
              //   this.renderReceiveMessage(obj.lastMsg);
              // }
            }
          },

          onmyinfo: function onmyinfo(info) {
            console.log(info);
          },
          onwillreconnect: function onwillreconnect(obj) {
            console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
          },
          ondisconnect: function ondisconnect() {
            console.warn("链接已中断...即将重新连接");
          },
          onroamingmsgs: function onroamingmsgs(obj) {
            console.log("漫游消息...");
          },


          onofflinemsgs: function onofflinemsgs(obj) {
            console.log("离线消息...");
            // console.log(obj)
            // obj.msgs.forEach((e, i) => {
            //   if (this.msgList.indexOf(e) < 0) {
            //     this.renderReceiveMessage(e);
            //   }
            // });
            // this.scrollToBottom();
          },
          onmsg: function onmsg(msg) {
            console.log('收到消息');
            console.log(msg);
            _this18.renderReceiveMessage(msg);
          }
        });
      }).catch(function (err) {
        console.log(err);
      });
    },

    // 处理收到的消息
    renderReceiveMessage: function renderReceiveMessage(msg) {
      var _this19 = this;

      if (msg.from === this.targetData.account) {
        if (msg.type === "custom") {
          msg.content = JSON.parse(msg.content);
        }
        // const _msg = this.setPraviteMessage(msg);
        this.msgList.push(this.setPraviteMessage(msg));
        this._originList.push(msg);
        if (msg.type === "text") {
          this.targetMsgList.push(this.setPraviteMessage(msg));
        }
        // 处理收到的图片
        if (msg.type === "image") {
          this.imageList.push(msg.file.url);
        }
        //对于美年来源的患者 次数不做计算
        if (this.caseType != '15') {
          if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
            this.lastCountPlus();
          } else if (msg.type !== "custom") {
            this.lastCountMinus();
          }
        }

        if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
          var idClient = msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient || msg.content.data.imMessage && msg.content.data.imMessage.idClient || msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId;
          this.msgList.forEach(function (element, index) {
            if (element.idClient === idClient) {
              _this19.msgList.removeByValue(element);
              if (element && element.custom && element.custom.mType == 1) {
                _this19.imageList.removeByValue(element.file.url);
              }
              return;
            }
          });
        }

        this.receiveSpecialMessage(msg);
        this.getTimeStampShowList(msg);

        this.setTargetList(this.targetMsgList);
        if (msg.type === "image") {
          setTimeout(function () {
            _this19.scrollToBottom(1000);
          }, 200);
        } else {
          this.scrollToBottom();
        }
      }
    },

    //接收图片利用云信SDK作预览压缩
    imageCompressByNim: function imageCompressByNim(msg) {
      //云信图片压缩
      if (msg.type === "image") {
        this.imageList.unshift(msg.file.url);
        // const qualityUrl = this.nim.viewImageQuality({
        //   url: msg.file.url,
        //   quality: 60
        // });
        // if (this.imageList.indexOf(qualityUrl) == -1) {
        //   this.imageList.push(qualityUrl);
        // }
      }
    },

    //医生发送特殊消息的处理对应方案
    receiveSpecialMessage: function receiveSpecialMessage(msg) {
      if (msg.type === "custom") {
        if (msg.content && msg.content.type === "notification") {
          var type = msg.content.data.actionType;
          switch (parseInt(type)) {
            case 1:
              //患者购买 不处理
              break;
            case 2:
              //医生赠送次数
              this.getConsultationStatus();
              break;
            case 3:
              //医生主动拒绝
              this.getConsultationStatus();
              clearInterval(this.remainTimeCount);
              // this.lastTimeShow = false;
              // this.footerBottomFlag = false;
              // this.bottomTipsShow = false;
              // this.textareaShow = false;
              // this.bottomTipsType = 2;
              //
              // if (this.caseType == 12 || this.caseType == 13) {
              //   this.inputBoxShow = false;
              // }
              break;
            case 4:
              //医生接诊
              this.getLastTime(0);
              break;
            case 58:
              //医生强制结束沟通
              this.getLastTime(1);
              break;

          }
        }
      }
    },
    transformTimeStamp: function transformTimeStamp(time) {
      return imBaseMethods.transformTimeStamp(time);
    },
    getPatientBase: function getPatientBase(type) {
      var _this20 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_39_common_js_HttpRequest_getPatientBase__["a" /* default */])({
        patientId: this.patientId
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          _this20.setPatientName(dataList[0].patientName);

          _this20.setPatientInfo({
            patientId: _this20.patientId,
            patientName: dataList[0].patientName,
            age: dataList[0].patientAge,
            sexName: dataList[0].patientSex == 1 ? "男" : "女",
            idcardStatus: dataList[0].idcardStatus === "0" ? false : true,
            certificateCode: dataList[0].certificateCode,
            mobile: dataList[0].mobile
          });

          if (dataList && dataList.length !== 0) {
            _this20.setLogoUrl({
              age: dataList[0].patientAge,
              sexName: dataList[0].patientSex == 1 ? "男" : "女"
            });
            var userData = {
              nick: dataList[0].patientName,
              avatar: _this20.logoUrl,
              sign: "newSign",
              gender: dataList[0].patientSex === "1" ? "male" : "female",
              email: "",
              birth: "",
              tel: ""
            };
            // this.nim.updateMyInfo(userData);
            _this20.userData = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_this20.userData, userData);
            __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].setItem("patientInfo", __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()(_this20.patientInfo));

            if (_this20.from === "report") {
              // this.checkReportDetails(type);
            } else {
                // this.checkHasSendedMedicalReport(type);
              }
          }
        }
      });
    },
    getDoctorMsg: function getDoctorMsg() {
      var _this21 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_40_common_js_HttpRequest_getDoctorBaseMsg__["a" /* default */])({
        doctorCustomerId: this.doctorCustomerId,
        logoUseFlag: 5
      }).then(function (data) {

        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList[0];
          wx.setNavigationBarTitle({
            title: dataList.customerName + "\u533B\u751F"
          });
          _this21.setTargetMsg({
            avatar: dataList.logoUrl,
            nick: dataList.customerName,
            title: dataList.medicalTitle,
            hospital: dataList.company,
            companyId: dataList.companyId,
            medical: dataList.medical,
            customerId: _this21.doctorCustomerId
          });
          _this21.titleName = dataList.customerName + "\u533B\u751F";

          console.log(_this21.targetMsg);
          _this21.getTargetMsgFinish = true;
          __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].setItem("targetMsg", __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()(_this21.targetMsg));
        }
      });
    },
    setPraviteMessage: function setPraviteMessage(element) {
      var result = {
        from: element.from,
        to: element.to,
        time: element.time,
        timeStamp: element.timeStamp || "",
        type: element.type,
        text: element.text,
        idClient: element.idClient,
        target: element.target
      };
      if (element.type === "custom") {
        result = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(result, {
          content: element.content || {}
        });
      } else if (element.type === "file" || element.type === "image" || element.type === "video") {
        result = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(result, {
          file: element.file ? element.file : {}
        });
      }
      return result;
    },
    buildRenderMsg: function buildRenderMsg(type, msgs) {
      var _this22 = this;

      this.beginTimestamp = 0;
      if (msgs.length === 0) return;

      var msgList = [],
          targetMsgList = [],
          timeStampShowList = [];
      msgs.forEach(function (element, index) {
        _this22.imageCompressByNim(element);
        if (index == msgs.length - 1) {
          _this22.historyBeginTime = element.time;
        }
        if (element.type === "custom") {
          element.content = JSON.parse(element.content);
        }
        element.timeStamp = _this22.transformTimeStamp(element.time);

        if (_this22.msgList.indexOf(element) < 0) {
          msgList.unshift(_this22.setPraviteMessage(element));
        }

        if (element.from === _this22.targetData.account && element.type === "text") {
          targetMsgList.unshift(_this22.setPraviteMessage(element));
        }

        if (element.type === "custom" && element.content.type === "deleteMsgTips") {

          var idClient = element.content.data.deleteMsg && element.content.data.deleteMsg.idClient || element.content.data.imMessage && element.content.data.imMessage.idClient || element.content.data.deleteMsg && element.content.data.deleteMsg.messageId;
          if (element.idClient === idClient) {
            msgList.removeByValue(_this22.setPraviteMessage(element));
          }
        }
      });
      if (type === "scrollInit") {
        this.msgList = msgList.concat(this.msgList);
        this.targetMsgList = this.targetMsgList.concat(targetMsgList);
        this._originList = msgs.concat(this._originList);
        this.setTargetList(this.targetMsgList);
      } else {

        this.msgList = msgList;
        this.targetMsgList = targetMsgList;
        this._originList = this.reverse(msgs);
        this.setTargetList(this.targetMsgList);
      }

      this._originList.forEach(function (element, index) {
        if ((element.time - _this22.beginTimestamp) / (5 * 60 * 1000) > 1) {
          if (element.type === "custom") {
            if (!element.content.type) {
              element.content = JSON.parse(element.content);
            }
            if (element.content.type === 'notification' && element.content.data.actionType == 5) {
              timeStampShowList.push(0);
            } else {
              _this22.beginTimestamp = element.time;
              timeStampShowList.push(1);
            }
          } else {
            _this22.beginTimestamp = element.time;
            timeStampShowList.push(1);
          }
        } else {
          timeStampShowList.push(0);
        }
      });

      this.timeStampShowList = timeStampShowList;

      if (type !== "scrollInit") {
        setTimeout(function () {
          _this22.scrollToBottom(1000);
        }, 0);
      } else {
        setTimeout(function () {
          _this22.pulling = false;
        }, 800);
      }

      this.allMsgsGot = true;
      // this.pushHealthCard();    // 健康卡push提示消息
    },

    // 健康卡领取提示
    pushHealthCard: function pushHealthCard() {
      var _this = this;
      this.msgList.push({
        type: 'healthCard'
      });
    },
    goToGetHealthCard: function goToGetHealthCard() {
      var _this = this;
      wx.navigateTo({
        url: '/packageD/healthCard/healthCardRecognition?from=imSceneDoctor'
      });
    },
    getTimeStampShowList: function getTimeStampShowList(element) {
      // console.log(this.timeStampShowList);
      // console.log(element.time, this.beginTimestamp)
      if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
        if (element.type === "custom") {
          if (!element.content.type) {
            element.content = JSON.parse(element.content);
          }
          if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
            if (element.content.type === 'notification' && element.content.data.actionType == 5) {
              this.timeStampShowList.push(0);
            } else {
              this.beginTimestamp = element.time;
              this.timeStampShowList.push(1);
            }
          } else {
            this.timeStampShowList.push(0);
          }
        } else {
          this.beginTimestamp = element.time;
          this.timeStampShowList.push(1);
        }
      } else {
        this.timeStampShowList.push(0);
      }
    },
    reverse: function reverse(list) {
      var result = [];
      list.forEach(function (element, index) {
        result.unshift(element);
      });

      return result;
    },

    //长按事件响应
    longTouchEmitHandler: function longTouchEmitHandler(index) {
      console.log(index);
      if (this.toolbarConfig.delete) {
        this.deleteMsgIndex = index;
      }
    },

    //消息撤回
    deleteMsgEvent: function deleteMsgEvent(msg, index) {
      var _this23 = this;

      console.log(this._originList);
      var _msg = this._originList[index];
      console.log(_msg);
      var _DeleteTimeLimit = void 0;
      var _deleteTime = parseInt(this.toolbarConfig.deleteTime);
      if (_deleteTime < 60) {
        _DeleteTimeLimit = _deleteTime + "\u79D2";
      } else {
        if (_deleteTime % 60) {
          _DeleteTimeLimit = parseInt(_deleteTime / 60) + "\u5206\u949F" + _deleteTime % 60 + "\u79D2";
        } else {
          _DeleteTimeLimit = _deleteTime / 60 + "\u5206\u949F";
        }
      }

      imBaseMethods.deleteMessageSendTip({
        msg: _msg,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "37",
          conId: this.orderSourceId,
          patientName: this.patientName,
          idClient: msg.idClient
        }),
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "deleteMsgTips",
          data: {
            from: this.patientName || "患者",
            deleteMsg: _msg || {}
          }
        }),
        deleteFailCallback: function deleteFailCallback(err) {
          console.log(err);
          _this23.showToast("\u60A8\u53EA\u80FD\u64A4\u56DE" + _DeleteTimeLimit + "\u5185\u7684\u6D88\u606F");
        },
        deleteSuccessCallback: function deleteSuccessCallback(dMsg) {
          if (JSON.parse(_msg.custom).mType == 1) {
            var _imageUrl = _msg.file.url;
            _this23.imageList.map(function (element, index) {
              if (element === _imageUrl) {
                _this23.imageList.removeByValue(element);
                return;
              }
            });
          }
          console.log(dMsg);
          _this23.sendMessageSuccess(dMsg);
          console.log("\u64A4\u56DE\u6D88\u606F\u63D0\u793A--\u53D1\u9001\u6210\u529F");
        }
      });
    },
    getImageList: function getImageList() {
      var _this24 = this;

      this.$nextTick(function () {
        var imageList = [];
        if (_this24.$refs.bigImg) {
          _this24.$refs.bigImg.forEach(function (element, index) {
            if (_this24.imageList.indexOf(element.imageMessage.file.url) == -1) {
              imageList.push(element.imageMessage.file.url);
            }
          });
        }
        _this24.imageList = imageList;
      });
    },
    scrollToBottom: function scrollToBottom() {
      var _this25 = this;

      var delayTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
      scrollTimer = setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: _this25.scrollHeight + 10000,
          duration: 0
        });
      }, delayTime);
    },
    checkHasSendedMedicalReport: function checkHasSendedMedicalReport(type) {
      var _this26 = this;

      //检测从未发送过...
      imBaseMethods.getMessageList({
        beginTime: 0,
        endTime: 0,
        target: this.targetData.account,
        limit: 5,
        reverse: true
      }).then(function (obj) {
        var flag = false;
        var msgList = obj.msgs;
        for (var i in msgList) {
          var _ele = msgList[i];
          if (_ele.type === "custom" && _ele.content && (JSON.parse(_ele.content).type === 'medicalReport' || JSON.parse(_ele.content).type === 'reportOrder')) {
            flag = false;
            return;
          } else {
            flag = true;
          }
        }

        if (type === "history" && flag) _this26.getMedicalMessage();
        _this26.allMsgsGot = true;
      }).catch(function (err) {
        console.log(err);
      });
    },
    checkReportDetails: function checkReportDetails(type) {
      var _this27 = this;

      //检测从未发送过...
      imBaseMethods.getMessageList({
        beginTime: 0,
        endTime: 0,
        target: this.targetData.account,
        limit: 5,
        reverse: true
      }).then(function (obj) {
        var msgList = obj.msgs;
        var _flag = false;
        for (var i in msgList) {
          var _ele = msgList[i];
          if (_ele.type === "custom" && _ele.content && JSON.parse(_ele.content).type === 'reportOrder') {
            _flag = false;
            return false;
          } else {
            _flag = true;
          }
        }
        console.log(type);
        if (type === "history" && _flag) _this27.getReportDetails();
        _this27.allMsgsGot = true;
      }).catch(function (err) {
        console.log(err);
      });
    },
    getMedicalMessage: function getMedicalMessage() {
      var _this28 = this;

      Object(__WEBPACK_IMPORTED_MODULE_44_common_js_HttpRequest_getMedicalReportDetails__["a" /* default */])({
        caseId: this.caseId
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          if (dataList && dataList.length !== 0) {
            _this28.sendMedicalReport(dataList[0]);
          }
        }
      });
    },
    getReportDetails: function getReportDetails() {
      var _this29 = this;

      Object(__WEBPACK_IMPORTED_MODULE_41_common_js_HttpRequest_getReportDetails__["a" /* default */])({
        reportId: this.reportId
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
            var dataList = data.responseObject.responseData.data_list;

            _this29.sendReportDetails(dataList[0]);
          }
        }
      }).catch(function (err) {
        console.log(err);
      });
    },
    sendReportDetails: function sendReportDetails(param) {
      var _this30 = this;

      var dateType = "",
          source = "";

      switch (parseInt(param.dateType)) {
        case 1:
          dateType = "上午";
          break;
        case 2:
          dateType = "下午";
          break;
        case 3:
          dateType = "晚上";
          break;
        default:
          break;
      }

      if (param.reportChannelOther && param.reportChannelOther.length > 0) {
        if (param.reportChannelOther.length > 4) {
          source = param.reportChannel + " - " + param.reportChannelOther.substring(0, 4) + "...";
        } else {
          source = param.reportChannel + " - " + param.reportChannelOther;
        }
      } else {
        source = param.reportChannel;
      }

      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "53",
          conId: this.orderSourceId
        }),
        isPushable: true,
        isUnreadable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005<" + (this.patientName ? this.patientName : "") + ">\u5411\u60A8\u62A5\u5230\uFF0C\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5",
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "reportOrder",
          data: {
            //三种类型的患者都需要传的字段
            patientId: param.patientId, //患者Id
            reportType: param.reportType, //患者类型 1-门诊患者；2-住院患者；3-首次就诊患者 *
            patientName: param.patientName, //患者名称
            patientSex: parseInt(param.patientSex) == 1 ? "男" : "女", //患者性别
            patientAge: param.patientAge, //患者年龄
            reportId: this.reportId || "",

            //住院患者需要传的字段
            hospitalTime: param.reportType == 2 ? param.visitDate.substring(0, 10) + "     " + dateType || "" : "", //住院时间
            diagnosis: param.reportType == 2 ? param.doctorDiagnosis || "" : "", //医生诊断
            isOperation: param.reportType == 2 ? parseInt(param.whetherOperation) === 1 ? "已手术" : "未手术" : "", //是否手术
            operationName: param.reportType == 2 ? param.operationName || "" : "", //手术名称
            operationTime: param.reportType == 2 ? param.operationDate && param.operationDate.substring(0, 10) || "" : "", //手术时间


            //门诊患者需要传的字段
            clinicPurpose: param.reportType == 1 ? param.reportPurpose || "" : "", //就诊目的
            clinicTime: param.reportType == 1 ? param.visitDate.substring(0, 10) + dateType || "" : "", //就诊时间
            clinicDiagnosis: param.reportType == 1 ? param.doctorDiagnosis || "" : "", //医生诊断
            treatmentRecommendations: param.reportType == 1 ? param.doctorSuggest || "" : "", //治疗建议


            //初次就诊患者需要传的字段
            source: param.reportType == 3 ? source : "", //来源渠道
            illnessDetail: param.reportType == 3 ? param.reportPersonCondition || "" : "", //病情详述
            purpose: param.reportType == 3 ? param.reportAssist || "" : "", //初次就诊患者 就诊目的

            // 图片列表字段
            // attrList: param.attList || [],
            // 标签列表字段
            patientTagList: param.tagList || [],
            // 标签备注字段
            tagRemark: param.tagRemark || ""
          }
        })
      }).then(function (msg) {
        _this30.historyBeginTime = msg.time;
        _this30.sendMessageSuccess(msg);
        _this30.allMsgsGot = true;
        setTimeout(function () {
          _this30.checkReportDetails("history");
        }, 8000);
      }).catch(function (err) {
        console.log(err);
      });
    },

    //发送咨询单
    sendMedicalReport: function sendMedicalReport(param) {
      var _this31 = this;

      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "27",
          conId: this.orderSourceId
        }),
        isPushable: false,
        isUnreadable: false,
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          data: {
            caseId: this.caseId, //咨询单 病例ID
            patientName: param.patientCasemap.patientName, //患者姓名
            sexName: param.patientCasemap.sexName, //患者性别
            age: param.patientCasemap.age, //患者年龄
            createDate: new Date().getTime(),
            diagnoseContent: param.patientCasemap.caseMain.caseMain,
            isAttachment: param.patientCasemap.isAttachment,
            time: param.patientCasemap.caseTime,
            caseUrl: __WEBPACK_IMPORTED_MODULE_7_common_js_util_util__["a" /* default */].httpEnv() + "/pages/app_native/reservation_list.html?caseId=" + this.caseId + "&isOrder=0"
          },
          type: "medicalReport" //自定义类型 咨询单
        })
      }).then(function (msg) {
        _this31.mainCase = param.patientCasemap.caseMain.caseMain;
        _this31.sendMessageSuccess(msg);
        _this31.historyBeginTime = msg.time; // 设置分页开始时间
        _this31.allMsgsGot = true;
        setTimeout(function () {
          _this31.checkHasSendedMedicalReport("history");
        }, 8000);
        if (!_this31.from || _this31.from !== "report") {
          _this31.sendHistoryTips();
        }
      });
    },
    sendHistoryTips: function sendHistoryTips() {
      var _this32 = this;

      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "44",
          conId: this.orderSourceId
        }),
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "getHistoryTip",
          data: {
            caseId: this.userData.account.substring(2)
          }
        })
      }).then(function (msg) {
        _this32.sendMessageSuccess(msg);
      });
    },

    //发送反垃圾提示语
    sendAntiSpamTips: function sendAntiSpamTips() {
      var _this33 = this;

      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.cId,
          mType: "57",
          conId: this.orderSourceId
        }),
        isPushable: false,
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "sensitiveTip",
          data: {}
        })
      }).then(function (msg) {
        _this33.sendMessageSuccess(msg);
      }).catch(function (err) {
        console.log(err);
      });
    },
    selectVideo: function selectVideo() {
      var that = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function success(res) {
          console.log(res);
          that.sendVideo(res.tempFilePath);
        }
      });
    },
    sendVideo: function sendVideo(file) {
      var _this34 = this;

      this.finish = true;
      __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt3'
      });
      imBaseMethods.sendVideoMessage({
        file: file,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "3",
          conId: this.orderSourceId
        }),
        isPushable: true,
        isUnreadable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005" + (this.patientName ? this.patientName : "") + ":[\u5F71\u50CF]",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        progressCallback: function progressCallback(obj) {},
        sendSuccessCallback: function sendSuccessCallback(msg) {
          _this34.finish = false;
          _this34.msgList.push(_this34.setPraviteMessage(msg));
          _this34._originList.push(msg);
          _this34.$nextTick(function () {
            _this34.scrollToBottom();
          });
        }
      });
    },
    selectImage: function selectImage() {
      var _this35 = this;

      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function success(res) {
          var tempFiles = res.tempFiles;
          if (tempFiles.length > 1) {
            _this35.sendMulitpleImage(tempFiles);
          } else {
            _this35.sendImage(tempFiles[0]);
          }
        }
      });
    },
    sendMulitpleImage: function sendMulitpleImage(tempFiles) {
      var _this36 = this;

      this.finish = true;
      __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt38'
      });
      imBaseMethods.sendMulitpleImage({
        list: tempFiles,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "38",
          conId: this.orderSourceId
        }),
        isPushable: true,
        isUnreadable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005" + (this.patientName ? this.patientName : "") + ":[\u5F71\u50CF]",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        sendSuccessCallback: function sendSuccessCallback(msg) {
          _this36.finish = false;

          msg.content = JSON.parse(msg.content);
          _this36.msgList.push(_this36.setPraviteMessage(msg));
          _this36._originList.push(msg);
          _this36.$nextTick(function () {
            _this36.scrollToBottom();
          });
        }
      });
    },
    sendImage: function sendImage(file) {
      var _this37 = this;

      this.finish = true;
      this.disabled = true;
      __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt1'
      });
      imBaseMethods.sendImageMessage({
        file: file,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "1",
          conId: this.orderSourceId
        }),
        isPushable: true,
        isUnreadable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005" + (this.patientName ? this.patientName : "") + ":[\u5F71\u50CF]",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        progressCallback: function progressCallback(obj) {},
        sendSuccessCallback: function sendSuccessCallback(msg) {
          console.log(msg);
          // this.progressNum--;
          _this37.msgList.push(_this37.setPraviteMessage(msg));
          _this37._originList.push(msg);
          // this._originList.push(msg);
          // this.msgList[imageLastIndex] = msg;
          _this37.imageList.push(msg.file.url);
          _this37.finish = false;
          // this.$nextTick(() => {
          //   this.scrollToBottom();
          // });
          setTimeout(function () {
            _this37.scrollToBottom(1000);
            setTimeout(function () {
              _this37.disabled = false;
            }, 1000);
          }, 200);
        }
      });
    },
    getConsultationStatus: function getConsultationStatus() {
      var _this38 = this;

      this.finish = true;
      Object(__WEBPACK_IMPORTED_MODULE_36_common_js_HttpRequest_getConsultationList__["a" /* default */])({
        caseId: this.caseId,
        consultationType: 1,
        customerId: this.doctorCustomerId
      }).then(function (data) {
        _this38.finish = false;
        if (data.responseObject.responseMessage === "NO DATA") {
          _this38.createTriageMessage();
        } else {
          var dataList = data.responseObject.responseData.dataList;
          _this38.orderSourceId = dataList[0].consultationId;

          _this38.getLastTime(parseInt(dataList[0].consultationState));
        }
      });
    },
    getMessageList: function getMessageList(type) {
      var _this39 = this;

      //获取用户基本信息...
      this.getPatientBase(type).then(function (res) {
        // this.checkFirstBuy();
        return _this39.getDoctorMsg();
      }).then(function () {
        //拉取历史记录...
        _this39.getHistoryMessage(0);
      });
    },

    // 拉取历史记录；
    getHistoryMessage: function getHistoryMessage(num) {
      var _this40 = this;

      if (num > 20) return console.log('2s之间获取历史消息一直为空');
      imBaseMethods.getMessageList({
        beginTime: 0,
        // endTime: this.historyBeginTime,
        target: this.targetData.account,
        limit: 20
      }).then(function (obj) {
        console.log('获取历史');
        console.log(obj);
        // 为了兼容报道的患者至少一条问诊历史，而轻问诊和找医生至少有两条问诊历史
        if (_this40.from === "report" && obj.msgs.length > 0) {
          return _this40.buildRenderMsg('history', obj.msgs);
        } else if (_this40.from !== "report" && obj.msgs.length > 1) {
          return _this40.buildRenderMsg('history', obj.msgs);
        } else {
          setTimeout(function () {
            return _this40.getHistoryMessage(++num);
          }, 200);
        }
      });
    },

    //查询是否第一次购买
    // checkFirstBuy() {
    //   if (localStorage.getItem("sendTips")) {
    //     this.sendPayFinish(JSON.parse(localStorage.getItem("sendTips")));
    //   }
    // },
    //支付后发送提示语
    sendPayFinish: function sendPayFinish(args) {
      var _this41 = this;

      var count = "",
          userData = "",
          desc = "",
          subContentDesc = "",
          contentType = "",
          amount = "";
      if (args.nick) {
        userData = args;
        count = JSON.parse(__WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].getItem("sendTips"));
      } else {
        count = args;
        userData = this.userData;
      }

      switch (parseInt(count.orderType)) {
        case 0:
          desc = "免费";
          break;
        case 1:
          desc = "图文";
          break;
        case 3:
          desc = "特需";
          break;
        default:
          break;
      }

      if (count.orderAmount) {
        amount = "(" + count.orderAmount + "\u5143)";
      } else {
        amount = "";
      }

      if (parseInt(count.orderType) === 0) {
        subContentDesc = "[患者申请免费咨询]";
        contentType = "申请";
      } else {
        subContentDesc = "[\u60A3\u8005\u8D2D\u4E70\u54A8\u8BE2]";
        contentType = "购买";
      }
      __WEBPACK_IMPORTED_MODULE_11_localStorage__["a" /* default */].removeItem("sendTips");
      imBaseMethods.sendCustomMessage({
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "1",
          cId: this.doctorCustomerId,
          mType: "33",
          conId: this.orderSourceId
        }),
        to: this.targetData.account,
        isPushable: false, // 是否推送
        isUnreadable: false, // 医生端是否计入未读数
        needPushNick: false, // 医生端是否展示昵称
        pushContent: "\u60A3\u8005<" + (this.patientName ? this.patientName : "") + ">\u5411\u60A8\u54A8\u8BE2\uFF0C\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "notification",
          data: {
            actionType: "1",
            contentDesc: "\u60A3\u8005\u5DF2" + contentType + "\u60A8\u7684" + desc + "\u54A8\u8BE2" + amount,
            subContentDesc: subContentDesc
          }
        })
      }).then(function (msg) {
        if (_this41.msgList.length !== 0) {
          _this41.sendMessageSuccess(msg);
        }
      }).catch(function (err, msg) {
        _this41.sendFail(err, msg);
      });
    },
    formSubmitName: function formSubmitName(e) {
      Object(__WEBPACK_IMPORTED_MODULE_42_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    //时间为0后交流状态更新为已结束
    updateAfterTimeOver: function updateAfterTimeOver() {
      Object(__WEBPACK_IMPORTED_MODULE_45_common_js_HttpRequest_updateAfterTimeOver__["a" /* default */])({
        consultationId: this.orderSourceId,
        consultationType: "1",
        consultationLevel: this.consultationLevel,
        consultationState: "0",
        updateConsultationState: "1"
      }).then(function (res) {
        if (res.responseObject.responseStatus) {
          console.log("时间结束后更新状态成功");
        }
      }).catch(function (err) {
        console.log("时间结束后更新状态失败");
      });
    }
  }),
  watch: {
    //监听剩余时间的变化，小于0进入沟通结束状态
    lastTime: function lastTime(time) {
      // console.log(time)
      if (time <= 0) {
        // this.lastTimeShow = false;
        // this.bottomTipsShow = true;
        // this.textareaShow = false;
        // this.footerBottomFlag = false;
        // this.showBottomTips(1);

        if (this.orderSourceId && this.consultationLevel) {
          this.updateAfterTimeOver();
        }

        this.getConsultationStatus();
      } else {
        this.lastTimeShow = true;
        this.bottomTipsShow = false;
      }
    },

    //监听剩余次数的变化，小于0进入沟通结束状态
    lastCount: function lastCount(count) {
      if (count <= 0) {
        this.lastTimeShow = false;
        this.bottomTipsShow = true;
        this.footerBottomFlag = false;
        this.textareaShow = false;
        this.showBottomTips(1);
        this.pauseLastTimeCount();
        // this.getConsultationStatus();
      } else {
        this.lastTimeShow = true;
        this.bottomTipsShow = false;
      }
    }
  },
  components: {
    MedicalReport: __WEBPACK_IMPORTED_MODULE_31__components_medicalReport__["a" /* default */],
    ContentText: __WEBPACK_IMPORTED_MODULE_15__components_content__["a" /* default */],
    ImageContent: __WEBPACK_IMPORTED_MODULE_16__components_image__["a" /* default */],
    BottomTips: __WEBPACK_IMPORTED_MODULE_18__components_bottomTips__["a" /* default */],
    MiddleTips: __WEBPACK_IMPORTED_MODULE_19__components_middleTips__["a" /* default */],
    PayFinishTips: __WEBPACK_IMPORTED_MODULE_20__components_payFinishTips__["a" /* default */],
    OutpatientInvite: __WEBPACK_IMPORTED_MODULE_21__components_outpatientInvite__["a" /* default */],
    OutpatientAppointment: __WEBPACK_IMPORTED_MODULE_22__components_outpatientAppointment__["a" /* default */],
    OutpatientService: __WEBPACK_IMPORTED_MODULE_23__components_outpatientService__["a" /* default */],
    SendCount: __WEBPACK_IMPORTED_MODULE_24__components_sendCount__["a" /* default */],
    DoctorAdvice: __WEBPACK_IMPORTED_MODULE_30__components_doctorAdvice__["a" /* default */],
    VideoMessage: __WEBPACK_IMPORTED_MODULE_25__components_video__["a" /* default */],
    MulitpleImage: __WEBPACK_IMPORTED_MODULE_26__components_mulitpleImage__["a" /* default */],
    ReportDetails: __WEBPACK_IMPORTED_MODULE_29__components_reportDetails__["a" /* default */],
    Suggestion: __WEBPACK_IMPORTED_MODULE_28_components_suggestion__["a" /* default */],
    FileMessage: __WEBPACK_IMPORTED_MODULE_27__components_fileMessage__["a" /* default */],
    Toast: __WEBPACK_IMPORTED_MODULE_3_components_toast__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_4_components_confirm__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_5_components_loading__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_6_components_backIndex__["a" /* default */],
    patientNodeMsg: __WEBPACK_IMPORTED_MODULE_17__components_patientNodeMsg__["a" /* default */],
    reportImageUpload: __WEBPACK_IMPORTED_MODULE_32__components_reportImageUpload__["a" /* default */],
    serviceComment: __WEBPACK_IMPORTED_MODULE_33__components_serviceComment__["a" /* default */],
    blackList: __WEBPACK_IMPORTED_MODULE_8_components_BlackList__["a" /* default */]
  }
});

/***/ }),

/***/ 702:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_content_vue__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4162e568_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_content_vue__ = __webpack_require__(705);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(703)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_content_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4162e568_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_content_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/content.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] content.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4162e568", Component.options)
  } else {
    hotAPI.reload("data-v-4162e568", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 703:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 704:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/17.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showDeleteMsg: false
    };
  },
  mounted: function mounted() {
    console.log("contentindex:" + this.currentIndex);
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']), mapGetters(['targetLogo'])),
  methods: {
    longTouchHandler: function longTouchHandler() {
      console.log(123);
      if (this.toolbarConfig.delete) {
        this.showDeleteMsg = true;
        this.$emit("longTouchEmitHandler");
      }
    },
    deleteMsgEvent: function deleteMsgEvent() {
      this.showDeleteMsg = false;
      this.$emit("deleteMsgEvent");
    }
  },
  props: {
    contentMessage: {
      type: Object
    },
    targetData: {
      type: Object
    },
    userData: {
      type: Object
    },
    currentIndex: {
      type: Number
    },
    deleteMsgIndex: {
      type: Number
    },
    from: {
      type: String
    }
  }
});

/***/ }),

/***/ 705:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "eventid": '2'
    },
    on: {
      "longpress": _vm.longTouchHandler
    }
  }, [_c('article', {
    staticClass: "main-message-box-item",
    class: {
      'my-message': _vm.contentMessage.from === _vm.userData.account,
        'others-message': _vm.contentMessage.from === _vm.targetData.account
    },
    attrs: {
      "data-clientid": _vm.contentMessage.idClient
    }
  }, [(_vm.contentMessage.from === _vm.targetData.account) ? _c('figure', {
    staticClass: "main-message-img",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.$emit('clickLogo')
      }
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.targetLogo,
      "alt": ""
    }
  })]) : _vm._e(), _vm._v(" "), _c('i', {
    staticClass: "fail-button",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content"
  }, [_c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '0'
    }
  }, [(_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.contentMessage.from === _vm.userData.account) ? _c('span', {
    staticClass: "delete-msg-btn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.deleteMsgEvent($event)
      }
    }
  }, [_vm._v("撤回")]) : _vm._e()]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.contentMessage.text))]), _vm._v(" "), (_vm.from === 'report' && _vm.currentIndex < 2 && _vm.contentMessage.from === _vm.targetData.account) ? _c('article', {
    staticClass: "disclaimer-content"
  }, [_c('span', [_vm._v("重要提示：在线咨询不能代替面诊，医生建议仅供参考。")])]) : _vm._e(), _vm._v(" "), (_vm.from !== 'report' && _vm.currentIndex <= 3 && _vm.contentMessage.from === _vm.targetData.account) ? _c('article', {
    staticClass: "disclaimer-content"
  }, [_c('span', [_vm._v("重要提示：在线咨询不能代替面诊，医生建议仅供参考。")])]) : _vm._e()], 1), _vm._v(" "), (_vm.contentMessage.from === _vm.userData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4162e568", esExports)
  }
}

/***/ }),

/***/ 706:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_image_vue__ = __webpack_require__(708);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_a61b9824_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_image_vue__ = __webpack_require__(709);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(707)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_image_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_a61b9824_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_image_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/image.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] image.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a61b9824", Component.options)
  } else {
    hotAPI.reload("data-v-a61b9824", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 707:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 708:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);




var _data$computed$comput;

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/17.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = (_data$computed$comput = {
  data: function data() {
    return {
      showDeleteMsg: false
    };
  },

  computed: {
    progress: function progress() {
      if (this.imageProgress) {
        if (this.currentIndex === this.imageProgress.index) {
          if (this.imageProgress.progress.includes(".")) {
            var returnObj = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_object_assign___default()(this.imageProgress, {
              progress: this.imageProgress.progress.split(".")[0] + "%"
            });
            return returnObj;
          } else {
            return this.imageProgress;
          }
        } else {
          return {
            uploading: false,
            progress: "0",
            index: 0
          };
        }
      }
    }
  }
}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "computed", __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']), mapGetters(['targetLogo']))), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "mounted", function mounted() {

  wx.pageScrollTo({
    scrollTop: 100000,
    duration: 1000
  });
}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "methods", {
  longTouchHandler: function longTouchHandler() {
    if (this.toolbarConfig.delete) {
      this.showDeleteMsg = true;
      this.$emit("longTouchEmitHandler");
    }
  },
  deleteMsgEvent: function deleteMsgEvent() {
    this.showDeleteMsg = false;
    this.$emit("deleteMsgEvent");
  },
  showBigImg: function showBigImg(item, index) {
    var that = this;
    var num = 0;
    that.imageList.map(function (item, index) {
      if (that.imageMessage.file.url.includes(item)) {
        num = index;
        return;
      }
    });
    // let _params = {
    //   imgBlob: (function () {
    //     let result = [];
    //     that.imageList.forEach((element, index) => {
    //       if (element.includes("?imageView")) {
    //         let a = element;
    //         let b = element.indexOf("?imageView");
    //         let n = a.substring(0, b);
    //         result.push({blob: n});
    //       } else {
    //         result.push({blob: element});
    //       }
    //     });
    //     return result;
    //   }()),
    //   indexNum: num,
    // };
    console.log(this.imageMessage.file.url);
    console.log(that.imageList);
    wx.previewImage({
      current: this.imageMessage.file.url, // 当前显示图片的http链接
      urls: that.imageList // 需要预览的图片http链接列表
    });
  }
}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "props", {
  imageMessage: {
    type: Object
  },
  nim: {
    type: Object
  },
  imageList: {
    type: Array
  },
  imageProgress: {
    type: Object
  },
  currentIndex: {
    type: Number
  },
  targetData: {
    type: Object
  },
  deleteMsgIndex: {
    type: Number
  },
  userData: {
    type: Object
  }
}), _data$computed$comput);

/***/ }),

/***/ 709:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "eventid": '4'
    },
    on: {
      "longpress": _vm.longTouchHandler
    }
  }, [_c('article', {
    staticClass: "main-message-box-item",
    class: {
      'my-message': _vm.imageMessage.from === _vm.userData.account,
        'others-message': _vm.imageMessage.from === _vm.targetData.account
    },
    attrs: {
      "data-clientid": _vm.imageMessage.idClient
    }
  }, [(_vm.imageMessage.from === _vm.targetData.account) ? _c('figure', {
    staticClass: "main-message-img",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.$emit('clickLogo')
      }
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.targetLogo,
      "alt": ""
    }
  })]) : _vm._e(), _vm._v(" "), _c('i', {
    staticClass: "fail-button",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content image-message"
  }, [(_vm.progress && _vm.progress.uploading) ? _c('section', {
    staticClass: "middle-tip-box"
  }, [_c('figure', {
    staticClass: "middle-tip-box-text"
  }, [_c('img', {
    staticClass: "notShow",
    attrs: {
      "src": "//m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png",
      "alt": "loading...",
      "eventid": '1'
    },
    on: {
      "click": function($event) {}
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "progress"
  }, [_c('p', [_vm._v(_vm._s(_vm.progress.progress))])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '0'
    }
  }, [(_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.imageMessage.from === _vm.userData.account) ? _c('span', {
    staticClass: "delete-msg-btn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.deleteMsgEvent($event)
      }
    }
  }, [_vm._v("撤回")]) : _vm._e()]), _vm._v(" "), _c('figure', {
    staticClass: "im-image-con",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.showBigImg($event)
      }
    }
  }, [_c('img', {
    staticClass: "im-image im-image-img",
    attrs: {
      "src": _vm.imageMessage.file.url,
      "alt": ""
    }
  })]), _vm._v(" "), (_vm.imageMessage.from === _vm.targetData.account) ? _c('article', {
    staticClass: "disclaimer-content"
  }, [_c('span', [_vm._v("重要提示：在线咨询不能代替面诊，医生建议仅供参考。")])]) : _vm._e()], 1), _vm._v(" "), (_vm.imageMessage.from === _vm.userData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-a61b9824", esExports)
  }
}

/***/ }),

/***/ 710:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNodeMsg_vue__ = __webpack_require__(712);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dc336c52_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNodeMsg_vue__ = __webpack_require__(713);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(711)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNodeMsg_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dc336c52_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNodeMsg_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/patientNodeMsg.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] patientNodeMsg.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dc336c52", Component.options)
  } else {
    hotAPI.reload("data-v-dc336c52", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 711:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 712:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/12/19.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      clickFlag: true,
      patientNodeContent: {}
    };
  },
  mounted: function mounted() {
    this.patientNodeContent = this.contentMessage.content.data[0];
    console.log(this.patientNodeContent);
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetMsg'])),
  methods: {
    goPatientNodeDetail: function goPatientNodeDetail() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_1_dataLog__["a" /* default */].createTrack({
        actionId: 14203,
        pushMessageId: this.patientNodeContent.manualId,
        keyword: this.patientNodeContent.manualTitle
      });
      if (!this.clickFlag) return;
      this.clickFlag = false;
      wx.getNetworkType({
        success: function success(res) {
          // 返回网络类型, 有效值：
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          var networkType = res.networkType;
          if (networkType === 'none') {
            wx.showToast({
              title: "网络中断，请检查您的网络状态",
              icon: 'none'
            });
            _this.clickFlag = true;
          } else {
            wx.navigateTo({
              url: "/packageF/patientNote/patientNote?manualId=" + _this.patientNodeContent.manualId + "&shareDoctorId=" + _this.targetMsg.customerId,
              complete: function complete() {
                _this.clickFlag = true;
              }
            });
          }
        }
      });
    }
  },
  props: {
    contentMessage: {
      type: Object
    },
    caseId: {
      type: Number
    },
    patientId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 713:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "patient-node-box",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goPatientNodeDetail()
      }
    }
  }, [_c('header', {
    staticClass: "patient-node-title"
  }, [_vm._v("推荐您查看")]), _vm._v(" "), _c('section', {
    staticClass: "patient-node-content"
  }, [_c('div', {
    staticClass: "patient-node-top"
  }, [_c('div', {
    staticClass: "patient-node-left"
  }, [_c('h3', {
    staticClass: "node-left-title"
  }, [_vm._v(_vm._s(_vm.patientNodeContent.manualTitle))]), _vm._v(" "), _c('p', {
    staticClass: "node-left-num"
  }, [_vm._v("包含" + _vm._s(_vm.patientNodeContent.educationCount) + "篇内容")])], 1), _vm._v(" "), _c('image', {
    staticClass: "patient-node-right",
    attrs: {
      "src": _vm.patientNodeContent.manualAttUrl
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "patient-node-footer"
  }, [_vm._v("分享自：" + _vm._s(_vm.targetMsg.nick)), _c('span', {
    staticClass: "doctor-split"
  }), _vm._v(_vm._s(_vm.targetMsg.hospital))])])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-dc336c52", esExports)
  }
}

/***/ }),

/***/ 714:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_bottomTips_vue__ = __webpack_require__(716);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_38e6f700_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_bottomTips_vue__ = __webpack_require__(717);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(715)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_bottomTips_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_38e6f700_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_bottomTips_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/bottomTips.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] bottomTips.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-38e6f700", Component.options)
  } else {
    hotAPI.reload("data-v-38e6f700", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 715:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 716:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
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
 * Created by qiangkailiang on 2017/8/25.
 */

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },

  computed: {
    renderMessage: function renderMessage() {
      var type = this.bottomTipsType;
      var result = "";
      switch (type) {
        case -1:
          //超时未接诊...剩余接诊时间小于0
          result = "抱歉~由于出诊、手术等原因，未能及时回复，已为您退诊；如需继续等待医生，请重新支付。";
          break;
        case 1:
          //咨询已结束...咨询时间结束或咨询次数归零
          result = "本次咨询已结束。若希望继续咨询，请点击下方按钮完成支付后继续沟通。";
          break;
        case 2:
          //医生拒绝咨询
          // 应需求，隐藏该文案
          // if (api.getPara().from === "report") {
          //   this.renderMessage = "抱歉~您的咨询请求未能得到主诊专家的接诊确认，已为您退诊。";
          // }else{
          //   // 应需求，隐藏该文案
          //   // this.renderMessage = "抱歉~您的咨询请求未能得到主诊医生的接诊确认，已为您退诊；点击下方按钮，我们会重新为您推荐医生。";
          //   this.renderMessage=""
          // }
          break;
      }
      return result;
    }
  },
  mounted: function mounted() {},

  methods: {},
  props: {
    bottomTipsType: {
      type: Number
    }
  }
});

/***/ }),

/***/ 717:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.bottomTipsType != 3) ? _c('section', {
    staticClass: "bottom-tips-wrapper"
  }, [_c('article', {
    staticClass: "bottom-tips-text"
  }, [_vm._v("\n      " + _vm._s(_vm.renderMessage) + "\n    ")])], 1) : (_vm.bottomTipsType == 3) ? _c('figure', {
    staticClass: "end-tip-con"
  }, [_c('i', {
    staticClass: "end-icon"
  }), _vm._v(" "), _c('p', {
    staticClass: "end-tip-text"
  }, [_vm._v("因发送不良用语，本次咨询已强制结束。若有其他问题，可联系客服")]), _vm._v(" "), _c('div', {
    staticClass: "end-tip-arrow"
  })], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-38e6f700", esExports)
  }
}

/***/ }),

/***/ 718:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_middleTips_vue__ = __webpack_require__(720);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_8ec68c2c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_middleTips_vue__ = __webpack_require__(721);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(719)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_middleTips_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_8ec68c2c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_middleTips_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/middleTips.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] middleTips.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-8ec68c2c", Component.options)
  } else {
    hotAPI.reload("data-v-8ec68c2c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 719:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 720:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
 * Created by qiangkailiang on 2017/8/25.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      tipsContent: ""
    };
  },
  mounted: function mounted() {

    switch (this.tipsType) {
      case 4:
        //医生接诊
        this.tipsContent = "咨询已开始";
        break;
      case 5:
        //咨询结束
        this.tipsContent = "咨询已结束";
        break;

    }
  },

  methods: {},
  props: {
    tipsType: {
      type: Number
    }
  }
});

/***/ }),

/***/ 721:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.tipsType == 5) ? _c('section', {
    staticClass: "main-message-box grey-tips"
  }, [_c('figcaption', {
    staticClass: "first-message"
  }, [_c('p', [_vm._v("在线咨询不能代替面诊，医生建议仅供参考")])], 1)], 1) : _vm._e(), _vm._v(" "), _c('p', {
    staticClass: "receive-treatment"
  }, [_c('span', [_vm._v(_vm._s(_vm.tipsContent))])])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-8ec68c2c", esExports)
  }
}

/***/ }),

/***/ 722:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_payFinishTips_vue__ = __webpack_require__(724);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7e65e0c6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_payFinishTips_vue__ = __webpack_require__(725);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(723)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_payFinishTips_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7e65e0c6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_payFinishTips_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/payFinishTips.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] payFinishTips.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7e65e0c6", Component.options)
  } else {
    hotAPI.reload("data-v-7e65e0c6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 723:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 724:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
 * Created by qiangkailiang on 2017/8/25.
 */
/* harmony default export */ __webpack_exports__["a"] = ({});

/***/ }),

/***/ 725:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('p', {
    staticClass: "time-stamp"
  }, [_vm._v("以上为历史纪录")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7e65e0c6", esExports)
  }
}

/***/ }),

/***/ 726:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientInvite_vue__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2120281d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientInvite_vue__ = __webpack_require__(729);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(727)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientInvite_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2120281d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientInvite_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/outpatientInvite.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] outpatientInvite.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2120281d", Component.options)
  } else {
    hotAPI.reload("data-v-2120281d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 727:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 728:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/29.
 */

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      oiMessage: {}
    };
  },
  mounted: function mounted() {
    this.oiMessage = this.outPatientMessage.data;
  },

  props: {
    outPatientMessage: {
      type: Object
    }
  },
  methods: {
    formatNumber: function formatNumber(num) {
      if (num) {
        var firstPart = num.substring(0, num.length - 4);
        var lastPart = num.substring(num.length - 4, num.length);

        return firstPart.replace(/[[a-zA-Z0-9\u4e00-\u9fa5]/g, "*") + lastPart;
      }
    }
  },
  computed: {
    patientName: function patientName() {
      if (!this.oiMessage.patientName) {
        return;
      } else {
        return this.oiMessage.patientName.length > 6 ? this.oiMessage.patientName.substring(0, 6) + "..." : this.oiMessage.patientName;
      }
    },
    doctorName: function doctorName() {
      if (!this.oiMessage.doctorName) {
        return;
      } else {
        return this.oiMessage.doctorName.length > 6 ? this.oiMessage.doctorName.substring(0, 6) + "..." : this.oiMessage.doctorName;
      }
    },
    cardId: function cardId() {
      return this.formatNumber(this.oiMessage.patientDocumentNumber);
    }
  }
});

/***/ }),

/***/ 729:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "outpatient-nvite-box"
  }, [_c('header', {
    staticClass: "outpatient-header"
  }, [_c('h2', {
    staticClass: "outpatient-title"
  }, [_vm._v("\n        门诊邀约单\n      ")])], 1), _vm._v(" "), _c('section', {
    staticClass: "outpatient-content"
  }, [_c('section', {
    staticClass: "outpatient-content-top"
  }, [_c('article', {
    staticClass: "outpatient-item-time"
  }, [_c('p', [_c('span', [_vm._v("有效期")]), _vm._v(" "), _c('span', [_vm._v("一次加号机会")])]), _vm._v(" "), _c('h3', {
    staticClass: "time-area"
  }, [_vm._v(_vm._s(_vm.oiMessage.validPeriod))])], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-patient-msg"
  }, [_c('article', {
    staticClass: "outpatient-patient-item"
  }, [_c('h4', {
    staticClass: "outpatient-patient-item-title"
  }, [_vm._v("患者")]), _vm._v(" "), _c('p', {
    staticClass: "outpatient-patient-item-msg"
  }, [_c('span', [_vm._v(_vm._s(_vm.patientName))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.oiMessage.patientSex == 1 ? '男' : '女'))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.oiMessage.patientAge) + "岁")])])], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-patient-item"
  }, [_c('h4', {
    staticClass: "outpatient-patient-item-title"
  }, [_vm._v("证件号码")]), _vm._v(" "), _c('p', {
    staticClass: "outpatient-patient-item-msg"
  }, [_c('span', [_vm._v(_vm._s(_vm.cardId))])])], 1)], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-patient-msg no-border"
  }, [_c('article', {
    staticClass: "outpatient-patient-item"
  }, [_c('h4', {
    staticClass: "outpatient-patient-item-title"
  }, [_vm._v("医生")]), _vm._v(" "), _c('p', {
    staticClass: "outpatient-patient-item-msg"
  }, [_c('span', [_vm._v(_vm._s(_vm.doctorName))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.oiMessage.doctorPosition))])])], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-patient-item"
  }, [_c('h4', {
    staticClass: "outpatient-patient-item-title"
  }, [_vm._v("医院")]), _vm._v(" "), _c('p', {
    staticClass: "outpatient-patient-item-msg content-overflow"
  }, [_c('span', [_vm._v(_vm._s(_vm.oiMessage.doctorHospital))])])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "outpatient-tips-box"
  }, [_c('article', {
    staticClass: "outpatient-base-explanation part-one"
  }, [_c('p', [_vm._v("请以医院官网的专家出诊时间为准，停诊信息以医院当天公布为准")])], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-base-explanation part-two"
  }, [_c('p', [_vm._v("有效期内患者到医生诊室出示邀约单，领取加号条后，到医院挂号处缴费。挂号费以医院门诊价格为准")])], 1), _vm._v(" "), _c('article', {
    staticClass: "outpatient-base-explanation part-three"
  }, [_c('p', [_vm._v("请以上方有效期为准，逾期就诊，医生有权拒绝加号")])], 1)], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "main-message-box grey-tips"
  }, [_c('figcaption', {
    staticClass: "first-message"
  }, [_c('p', [_vm._v("此条信息不消耗医生回复次数")])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2120281d", esExports)
  }
}

/***/ }),

/***/ 730:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientAppointment_vue__ = __webpack_require__(732);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6e2bb13b_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientAppointment_vue__ = __webpack_require__(733);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(731)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6e2bb13b"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientAppointment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6e2bb13b_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientAppointment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/outpatientAppointment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] outpatientAppointment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6e2bb13b", Component.options)
  } else {
    hotAPI.reload("data-v-6e2bb13b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 731:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 732:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__ = __webpack_require__(8);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/2.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;





var XHRList = {
  clinicStatus: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/clinic/v1/getMapById/" // 门诊预约单信息
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showDeleteMsg: false,
      contentData: {},
      clinicType: 0
    };
  },
  mounted: function mounted() {
    this.mountedInit();
    console.log(this.contentMessage);
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["logoUrl", "patientInfo"]), mapGetters(["certificateCodeEncrypt"])),
  methods: {
    mountedInit: function mountedInit() {
      this.contentData = this.contentMessage.content.data;
      this.getOutpatientInfo();
    },

    // 获取预约状态
    getOutpatientInfo: function getOutpatientInfo() {
      var that = this;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__["a" /* default */])({
        url: XHRList.clinicStatus,
        method: "POST",
        data: {
          clinicId: this.contentData.clinicId,
          isValid: 1 // string	是	是否有效
        },
        beforeSend: function beforeSend(config) {},
        done: function done(param) {
          console.log(param);
          if (param.responseObject.responseStatus && param.responseObject) {
            var datas = param.responseObject.responseData.dataList[0];
            that.clinicType = datas.clinicType;
          } else {
            console.log("接口返回状态失败");
          }
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    }
  },
  props: {
    contentMessage: {
      type: Object
    }
  }
});

/***/ }),

/***/ 733:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "appointment-box"
  }, [_c('article', {
    staticClass: "appointment-box-item"
  }, [_c('figcaption', {
    staticClass: "appointment-content appointment-box"
  }, [_c('section', {
    staticClass: "appointment-top"
  }, [_c('h3', {
    staticClass: "appointment-title"
  }, [_vm._v("门诊预约")])], 1), _vm._v(" "), _c('section', {
    staticClass: "appointment-middle"
  }, [_c('ul', {
    staticClass: "patient-info-list"
  }, [_c('li', {
    staticClass: "patient-info-item"
  }, [_c('section', {
    staticClass: "patient-info-top"
  }, [_vm._v("患者：")]), _vm._v(" "), _c('section', {
    staticClass: "patient-info-bottom"
  }, [_c('span', [_vm._v(_vm._s(_vm.patientInfo.patientName))]), _c('span', [_vm._v(_vm._s(_vm.patientInfo.sexName) + "性")]), _c('span', [_vm._v(_vm._s(_vm.patientInfo.age) + "岁")])])], 1), _vm._v(" "), _c('li', {
    staticClass: "patient-info-item"
  }, [_c('section', {
    staticClass: "patient-info-top"
  }, [_vm._v("身份证：")]), _vm._v(" "), _c('section', {
    staticClass: "patient-info-bottom"
  }, [_c('span', [_vm._v(_vm._s(_vm.certificateCodeEncrypt))])])], 1), _vm._v(" "), _c('li', {
    staticClass: "patient-info-item"
  }, [_c('section', {
    staticClass: "patient-info-top"
  }, [_vm._v("就诊时间：")]), _vm._v(" "), _c('section', {
    staticClass: "patient-info-bottom"
  }, [_c('span', [_vm._v(_vm._s(_vm.contentData.clinicTime))]), _c('span', [_vm._v(_vm._s(_vm.contentData.weekDay))]), _c('span', [_vm._v(_vm._s(_vm.contentData.timeType))])])], 1)], 1), _vm._v(" "), (_vm.clinicType == 1) ? _c('section', {
    staticClass: "appiontment-status pendding"
  }, [_vm._v("预约中")]) : _vm._e(), _vm._v(" "), (_vm.clinicType == 2) ? _c('section', {
    staticClass: "appiontment-status fail"
  }, [_vm._v("预约失败")]) : _vm._e(), _vm._v(" "), (_vm.clinicType == 3) ? _c('section', {
    staticClass: "appiontment-status success"
  }, [_vm._v("预约成功")]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "appointment-bottom"
  }, [_vm._v("\n        温馨提示：预约成功后以短信形式提醒，请保持手机畅通\n      ")])], 1), _vm._v(" "), _c('figure', {
    staticClass: "appointment-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6e2bb13b", esExports)
  }
}

/***/ }),

/***/ 734:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientService_vue__ = __webpack_require__(736);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2796f95e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientService_vue__ = __webpack_require__(737);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(735)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2796f95e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientService_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2796f95e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientService_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/outpatientService.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] outpatientService.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2796f95e", Component.options)
  } else {
    hotAPI.reload("data-v-2796f95e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 735:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 736:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/3.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showDeleteMsg: false
    };
  },
  mounted: function mounted() {},

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetMsg', 'patientInfo']), mapGetters(['targetLogo']), {
    doctorTitleName: function doctorTitleName() {
      var result = [];
      if (this.targetMsg.title.includes("_")) {
        this.targetMsg.title.split(",").forEach(function (element, index) {
          if (element.length > 0) {
            result.push(element.substring(2));
          }
        });
        return result.join(",");
      } else {
        return this.targetMsg.title;
      }
    }
  }),
  methods: {
    goInvite: function goInvite() {
      if (this.patientInfo.idcardStatus) {
        wx.navigateTo({
          url: '/packageA/outpatientCalender/outpatientCalender?doctorCustomerId=' + this.doctorCustomerId + '&caseId=' + this.caseId + '&patientId=' + this.patientId
        });
      } else {
        wx.navigateTo({
          url: '/packageA/nameAuthentication/nameAuthentication?routerName=outpatientCalender&patientId=' + this.patientId + '&doctorCustomerId=' + this.doctorCustomerId + '&caseId=' + this.caseId
        });
      }
    }
  },
  props: {
    contentMessage: {
      type: Object
    },
    targetData: {
      type: Object
    },
    userData: {
      type: Object
    },
    caseId: {
      type: Number
    },
    currentIndex: {
      type: Number
    },
    deleteMsgIndex: {
      type: Number
    },
    doctorCustomerId: {
      type: Number
    },
    patientId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 737:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "service-box"
  }, [_c('article', {
    staticClass: "service-box-item"
  }, [_c('figure', {
    staticClass: "service-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.targetLogo,
      "alt": ""
    }
  })]), _vm._v(" "), _c('figcaption', {
    staticClass: "service-content service-box"
  }, [_c('section', {
    staticClass: "service-top"
  }, [_c('h3', {
    staticClass: "service-title"
  }, [_vm._v("门诊邀约")])], 1), _vm._v(" "), _c('section', {
    staticClass: "service-middle"
  }, [_c('ul', {
    staticClass: "doctor-info-list"
  }, [_c('li', {
    staticClass: "doctor-info-top"
  }, [_vm._v(_vm._s(_vm.targetMsg.nick))]), _vm._v(" "), (_vm.targetMsg.medical) ? _c('li', {
    staticClass: "doctor-info-bottom"
  }, [_vm._v(_vm._s(_vm.targetMsg.medical))]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "go-invite on",
    attrs: {
      "data-alcode": "e188",
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goInvite()
      }
    }
  }, [_vm._v("去预约")])], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2796f95e", esExports)
  }
}

/***/ }),

/***/ 738:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_sendCount_vue__ = __webpack_require__(740);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1598150c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_sendCount_vue__ = __webpack_require__(741);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(739)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_sendCount_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1598150c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_sendCount_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/sendCount.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] sendCount.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1598150c", Component.options)
  } else {
    hotAPI.reload("data-v-1598150c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 739:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 740:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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
 * Created by qiangkailiang on 2017/8/29.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  computed: {},
  props: {
    sendCountMessage: {
      type: Object
    },
    doctorName: {}
  },
  onLoad: function onLoad() {
    console.log(this.sendCountMessage);
  }
});

/***/ }),

/***/ 741:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "send-count-box"
  }, [_c('article', {
    staticClass: "send-count"
  }, [_c('span', [_vm._v(_vm._s(_vm.doctorName) + "医生赠送了您")]), _vm._v(" "), _c('em', [_vm._v("3")]), _vm._v(" "), _c('span', [_vm._v("条回复")])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1598150c", esExports)
  }
}

/***/ }),

/***/ 742:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_video_vue__ = __webpack_require__(744);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_30bd0f0e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_video_vue__ = __webpack_require__(745);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(743)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_video_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_30bd0f0e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_video_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-30bd0f0e", Component.options)
  } else {
    hotAPI.reload("data-v-30bd0f0e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 743:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 744:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showDeleteMsg: false,
      showBigVideo: false
    };
  },


  methods: {
    longTouchHandler: function longTouchHandler() {
      if (this.toolbarConfig.delete) {
        this.showDeleteMsg = true;
        this.$emit("longTouchEmitHandler");
      }
    },
    deleteMsgEvent: function deleteMsgEvent() {
      this.showDeleteMsg = false;
      this.$emit("deleteMsgEvent");
    },
    videoPlay: function videoPlay() {
      var _url = "/packageA/videoPlayer/videoPlayer?videoUrl=" + encodeURIComponent(this.videoMessage.file.url);
      wx.navigateTo({
        url: _url
      });
    },
    hideBigVideo: function hideBigVideo() {
      this.showBigVideo = false;
      this.$emit("update:inputBoxShow", true);
      this.videoContext.pause();
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']), mapGetters(['targetLogo']), {
    progress: function progress() {}
  }),
  props: {
    videoMessage: {
      type: Object
    },
    videoProgress: {
      type: Object
    },
    targetData: {
      type: Object
    },
    userData: {
      type: Object
    },
    currentIndex: {
      type: Number
    },
    deleteMsgIndex: {
      type: Number
    },
    inputBoxShow: {
      type: Boolean
    }
  },
  mounted: function mounted() {
    console.log(this.videoMessage);
    setTimeout(function () {
      wx.pageScrollTo({
        scrollTop: 30000,
        duration: 100
      });
    }, 300);
  }
});

/***/ }),

/***/ 745:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "eventid": '5'
    },
    on: {
      "longpress": _vm.longTouchHandler
    }
  }, [(_vm.showBigVideo) ? _c('section', {
    staticClass: "video-player",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.hideBigVideo
    }
  }, [_c('video', {
    attrs: {
      "src": _vm.videoMessage.file.url,
      "id": "videoPlayer",
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
      }
    }
  })]) : _vm._e(), _vm._v(" "), _c('article', {
    staticClass: "main-message-box-item",
    class: {
      'my-message': _vm.videoMessage.from === _vm.userData.account,
        'others-message': _vm.videoMessage.from === _vm.targetData.account
    },
    attrs: {
      "data-clientid": _vm.videoMessage.idClient
    }
  }, [(_vm.videoMessage.from === _vm.targetData.account) ? _c('figure', {
    staticClass: "main-message-img",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.$emit('clickLogo')
      }
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.targetLogo,
      "alt": ""
    }
  })]) : _vm._e(), _vm._v(" "), _c('i', {
    staticClass: "fail-button",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content video-message-box",
    class: {
      'my-video': _vm.videoMessage.from === _vm.userData.account
    }
  }, [(_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.videoMessage.from === _vm.userData.account) ? _c('span', {
    staticClass: "delete-msg-btn",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.deleteMsgEvent($event)
      }
    }
  }, [_vm._v("撤回")]) : _vm._e(), _vm._v(" "), (_vm.progress && _vm.progress.uploading) ? _c('section', {
    staticClass: "middle-tip-box"
  }, [_c('figure', {
    staticClass: "middle-tip-box-text"
  }, [_c('img', {
    staticClass: "notShow",
    attrs: {
      "src": "https://m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png",
      "alt": "loading..."
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "progress"
  }, [_c('p', [_vm._v(_vm._s(_vm.progress.progress))])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.videoMessage.from === _vm.targetData.account) ? _c('header', {
    staticClass: "mulit-title"
  }, [_vm._v("视频")]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "mulitple-image-box"
  }, [_c('figure', {
    staticClass: "mulitple-image"
  }, [_c('img', {
    staticClass: "im-image",
    staticStyle: {
      "border-radius": "21px"
    },
    attrs: {
      "src": "https://m.allinmed.cn/static/image/imScene/video_play@76.png",
      "alt": "",
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.videoPlay()
      }
    }
  })])], 1), _vm._v(" "), (_vm.videoMessage.from === _vm.targetData.account) ? _c('article', {
    staticClass: "disclaimer-content"
  }, [_c('span', [_vm._v("重要提示：在线咨询不能代替面诊，医生建议仅供参考。")])]) : _vm._e()], 1), _vm._v(" "), (_vm.videoMessage.from === _vm.userData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-30bd0f0e", esExports)
  }
}

/***/ }),

/***/ 746:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mulitpleImage_vue__ = __webpack_require__(748);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_afe91b18_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mulitpleImage_vue__ = __webpack_require__(749);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(747)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mulitpleImage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_afe91b18_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mulitpleImage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/mulitpleImage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mulitpleImage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-afe91b18", Component.options)
  } else {
    hotAPI.reload("data-v-afe91b18", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 747:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 748:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      imageList: [],
      showDeleteMsg: false
    };
  },

  watch: {
    "imageMessage": function imageMessage(data) {
      var _this = this;

      data.content.data.list.forEach(function (element, index) {
        if (element) {
          _this.imageList.push(_this.nim.viewImageQuality({
            url: element.url,
            quality: 60
          }));
        }
      });
    }
  },
  components: {},
  methods: {
    showBigImg: function showBigImg() {
      var that = this;
      var _indexNum = 0;
      this.showDeleteMsg = false;
      var _params = {
        imgBlob: function () {
          var result = [];
          that.imageList.forEach(function (element, index) {
            var a = element;
            var b = element.indexOf("?imageView");
            var n = a.substring(0, b);
            result.push({
              blob: n
            });
          });
          return result;
        }(),
        indexNum: 0
      };
      wx.previewImage({
        current: this.imageList[0],
        urls: this.imageList
      });
    },
    longTouchHandler: function longTouchHandler() {
      if (this.toolbarConfig.delete) {
        this.showDeleteMsg = true;
        this.$emit("longTouchEmitHandler");
      }
    },
    deleteMsgEvent: function deleteMsgEvent() {
      this.showDeleteMsg = false;
      this.$emit("deleteMsgEvent");
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    this.imageMessage.content.data.list.forEach(function (element, index) {
      if (element) {
        _this2.imageList.push(element.url);
      }
    });
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['logoUrl', 'toolbarConfig'])),
  props: {
    imageMessage: {
      type: Object,
      default: {}
    },
    targetData: {
      type: Object
    },
    nim: {
      type: Object
    },
    userData: {
      type: Object
    },
    mulitpleLoading: {
      type: Boolean
    },
    currentIndex: {
      type: Number
    },
    deleteMsgIndex: {
      type: Number
    }
  }
});

/***/ }),

/***/ 749:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "eventid": '2'
    },
    on: {
      "longpress": _vm.longTouchHandler
    }
  }, [_c('article', {
    staticClass: "main-message-box-item my-message",
    attrs: {
      "data-clientid": _vm.imageMessage.idClient
    }
  }, [_c('i', {
    staticClass: "fail-button",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content multiple-box image-type"
  }, [_c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '0'
    }
  }, [(_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.imageMessage.from === _vm.userData.account) ? _c('span', {
    staticClass: "delete-msg-btn",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.deleteMsgEvent($event)
      }
    }
  }, [_vm._v("撤回")]) : _vm._e()]), _vm._v(" "), (_vm.imageMessage.loading) ? _c('section', {
    staticClass: "middle-tip-modal"
  }, [_c('figure', {
    staticClass: "middle-tip-box-text"
  }, [_c('img', {
    staticClass: "notShow",
    attrs: {
      "src": "//m.allinmed.cn/image/img00/patientConsult/symptom_photo_loading@2x.png",
      "alt": "loading..."
    }
  })])], 1) : _vm._e(), _vm._v(" "), _c('header', {
    staticClass: "mulit-title"
  }, [_vm._v("图片(" + _vm._s(_vm.imageList.length) + ")")]), _vm._v(" "), _c('section', {
    staticClass: "mulitple-image-box",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.showBigImg($event)
      }
    }
  }, _vm._l((_vm.imageList), function(item, index) {
    return (index < 3) ? _c('figure', {
      key: index,
      staticClass: "mulitple-image"
    }, [_c('img', {
      attrs: {
        "src": item,
        "alt": ""
      }
    })]) : _vm._e()
  }))], 1), _vm._v(" "), (_vm.imageMessage.from === _vm.userData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-afe91b18", esExports)
  }
}

/***/ }),

/***/ 750:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_fileMessage_vue__ = __webpack_require__(752);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3216b93e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_fileMessage_vue__ = __webpack_require__(753);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(751)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_fileMessage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3216b93e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_fileMessage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/fileMessage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] fileMessage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3216b93e", Component.options)
  } else {
    hotAPI.reload("data-v-3216b93e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 751:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 752:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      custom: null,
      showDeleteMsg: false
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg']), mapGetters(['targetLogo'])),
  props: {
    fileMessage: {
      type: Object
    },
    targetData: {
      type: Object
    },
    userData: {
      type: Object
    },
    fileProgress: {
      type: Object
    },
    currentIndex: {
      type: Number
    },
    deleteMsgIndex: {
      type: Number
    }
  },
  methods: {
    seeFile: function seeFile() {
      wx.downloadFile({
        url: this.fileMessage.file.url,
        success: function success(res) {
          var filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            success: function success(res) {
              console.log('打开文档成功');
            }
          });
        }
      });
    },
    longTouchHandler: function longTouchHandler() {
      if (this.toolbarConfig.delete) {
        this.showDeleteMsg = true;
        this.$emit("longTouchEmitHandler");
      }
    },
    deleteMsgEvent: function deleteMsgEvent() {
      this.showDeleteMsg = false;
      this.$emit("deleteMsgEvent");
    }
  },
  mounted: function mounted() {
    console.log(this.fileMessage);
    this.custom = JSON.parse(this.fileMessage.custom);
    console.log(this.custom);
  }
});

/***/ }),

/***/ 753:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "eventid": '2'
    },
    on: {
      "longpress": _vm.longTouchHandler
    }
  }, [_c('article', {
    staticClass: "main-message-box-item",
    class: {
      'my-message': _vm.fileMessage.from === _vm.userData.account,
        'others-message': _vm.fileMessage.from === _vm.targetData.account
    },
    attrs: {
      "data-clientid": _vm.fileMessage.idClient
    }
  }, [(_vm.fileMessage.from === _vm.targetData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/imScene/chatting_portrait_system@2x.png",
      "alt": ""
    }
  })]) : _vm._e(), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content file-message-box"
  }, [(_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.fileMessage.from === _vm.userData.account) ? _c('span', {
    staticClass: "delete-msg-btn",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.deleteMsgEvent($event)
      }
    }
  }, [_vm._v("撤回")]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "file-box"
  }, [_c('figure', {
    staticClass: "file-content",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.seeFile()
      }
    }
  }, [_c('img', {
    staticClass: "file-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/imScene/pdf@3x.png"
    }
  }), _vm._v(" "), (_vm.custom) ? _c('figcaption', {
    staticClass: "file-name"
  }, [_vm._v(_vm._s(_vm.custom.name))]) : _vm._e()], 1)], 1), _vm._v(" "), (_vm.fileMessage.from === _vm.targetData.account) ? _c('article', {
    staticClass: "disclaimer-content"
  }, [_c('span', [_vm._v("重要提示：在线咨询不能代替面诊，医生建议仅供参考。")])]) : _vm._e()], 1), _vm._v(" "), (_vm.fileMessage.from === _vm.userData.account) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3216b93e", esExports)
  }
}

/***/ }),

/***/ 754:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportDetails_vue__ = __webpack_require__(756);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e7585efe_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportDetails_vue__ = __webpack_require__(757);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(755)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportDetails_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e7585efe_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportDetails_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/reportDetails.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reportDetails.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e7585efe", Component.options)
  } else {
    hotAPI.reload("data-v-e7585efe", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 755:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 756:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_getReportDetails__ = __webpack_require__(44);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/5/17.
 */




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;
// /**************************Axios Http Requests*************************/




/* harmony default export */ __webpack_exports__["a"] = ({
  name: "report-details",
  data: function data() {
    return {
      param: {},
      imageList: [], // 处理过后查看大图需要的图片列表
      attList: [], // 用户上传的图片列表
      imageNum: '', // 显示话术
      imageShow: false, // 图片是否显示
      reportList: [] // 报到单数据；
    };
  },


  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setReportImageUpload']), {
    clipImg: function clipImg(imgUrl) {
      if (imgUrl.indexOf("_c") != -1) {
        var beforeUrl = imgUrl.substring(0, imgUrl.indexOf("_c") + 2);
        var afterUrl = imgUrl.substring(imgUrl.lastIndexOf("."));
        return beforeUrl + afterUrl;
      } else {
        return imgUrl;
      }
    },
    showBigImg: function showBigImg(item) {
      wx.previewImage({
        current: this.clipImg(item.caseAttUrl), // 当前显示图片的http链接
        urls: this.imageList // 需要预览的图片http链接列表
      });
    },
    getReportDetails: function getReportDetails() {
      var that = this;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_getReportDetails__["a" /* default */])({
        reportId: that.param.reportId
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
            var dataList = data.responseObject.responseData.data_list;
            console.log(dataList);
            that.attList = dataList[0].attList;
          }
        }
      }).catch(function (err) {
        console.log(err);
      });
    },
    uploadShow: function uploadShow() {
      // this.setReportImageUpload(true);
      console.log('上传图片');
      var _this = this;
      if (_this.textareaShow) {
        wx.setStorageSync('reportUploadImg', true);
        wx.navigateTo({
          url: "/packageD/reportNew/reportUploadImg?reportId=" + _this.param.reportId
        });
      } else {
        // 本次咨询已结束
        wx.showToast({
          title: '本次咨询已结束',
          icon: 'none'
        });
      }
    }
  }),
  mounted: function mounted() {
    this.param = this.reportOrderMessage.data;
    wx.removeStorageSync('isUploadImg'); //该缓存记录的是：是否进入补全信息页面并提交
    this.getReportDetails();
  },
  onShow: function onShow() {
    console.log('ggggggggggggggggggggggggg');
    if (wx.getStorageSync('isUploadImg')) {
      wx.removeStorageSync('isUploadImg'); //该缓存记录的是：是否进入补全信息页面并提交
      this.getReportDetails();
    }
  },

  watch: {
    attList: function attList() {
      var _this2 = this;

      if (this.attList.length) {
        this.attList.forEach(function (element, index) {
          _this2.imageList.push(_this2.clipImg(element.caseAttUrl));
          _this2.imageNum = "共" + _this2.attList.length + "张";
          _this2.imageShow = true;
        });
      } else {
        this.imageShow = false;
        this.imageNum = '未上传';
      }
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["logoUrl", "patientInfo", "targetMsg"]), {
    userName: function userName() {
      if (this.param.patientName) {
        return __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getByteLen(this.param.patientName) > 12 ? __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(this.param.patientName, 10) + "..." : this.param.patientName;
      } else {
        return '';
      }
    },
    patientType: function patientType() {
      //患者类型 1-住院患者；2-门诊患者；3-首次就诊患者 *
      var result = "";
      switch (parseInt(this.param.reportType)) {
        case 1:
        case 4:
          result = "门诊报到";
          break;
        case 2:
        case 5:
          result = "住院报到";
          break;
        case 3:
          result = "未就诊患者";
          break;
          break;
      }
      return result;
    }
  }),
  props: {
    reportOrderMessage: {
      type: Object
    },
    reportId: {
      type: Number
    },
    targetMsg: {
      type: Object
    },
    textareaShow: {
      type: Boolean
    }
  }
});

/***/ }),

/***/ 757:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('section', {
    staticClass: "send-count-box"
  }, [_c('article', {
    staticClass: "reportTipsBox"
  }, [_c('img', {
    staticClass: "tipsImg",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/congratulations.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "reportTipsText"
  }, [_vm._v("您已经成功向" + _vm._s(_vm.targetMsg.nick) + "医生报到，如有问题可以给医生留言。")])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details"
  }, [_c('header', {
    staticClass: "report-details-head"
  }, [_c('i', {
    staticClass: "icon-report"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/report.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('p', [_vm._v("报到信息")])], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-content"
  }, [_c('section', {
    staticClass: "patient-info-box"
  }, [_c('article', {
    staticClass: "report-details-text-inline patientName"
  }, [_c('span', {
    staticClass: "text patientName"
  }, [_vm._v(_vm._s(_vm.userName))]), _vm._v(" "), _c('span', {
    staticClass: "other"
  }, [_vm._v(_vm._s(_vm.patientInfo.sexName))]), _vm._v(" "), _c('span', {
    staticClass: "other"
  }, [_vm._v(_vm._s(_vm.patientInfo.age) + "岁")])]), _vm._v(" "), _c('span', {
    staticClass: "patientType"
  }, [_vm._v(_vm._s(_vm.patientType))])], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-list"
  }, [(_vm.param.reportTypeNew && (_vm.param.reportTypeNew == 4 || _vm.param.reportTypeNew == 5)) ? _vm._l((_vm.param.reportList), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "report-details-item"
    }, [_c('article', {
      staticClass: "report-details-text"
    }, [_c('h4', {
      staticClass: "title"
    }, [_vm._v(_vm._s(item.reportFieldName))]), _vm._v(" "), _c('article', {
      staticClass: "report-details-text-inline"
    }, [_c('p', {
      staticClass: "text"
    }, [_vm._v(_vm._s(item.reportValue))])], 1)], 1)], 1)
  }) : [(_vm.param.reportType == 2) ? [_c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("住院时间")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.hospitalTime.length > 0 ? _vm.param.hospitalTime : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("医生诊断")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.diagnosis.length > 0 ? _vm.param.diagnosis : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("是否手术")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.isOperation.length > 0 ? _vm.param.isOperation : "未填写"))])], 1)], 1)], 1), _vm._v(" "), (_vm.param.isOperation == '已手术') ? _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("手术名称")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.operationName.length > 0 ? _vm.param.operationName : "未填写"))])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.param.isOperation == '已手术') ? _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("手术时间")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.operationTime.length > 0 ? _vm.param.operationTime : "未填写"))])], 1)], 1)], 1) : _vm._e()] : _vm._e(), _vm._v(" "), (_vm.param.reportType == 1) ? [_c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("就诊时间")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.clinicTime))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("医生诊断")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.clinicDiagnosis.length > 0 ? _vm.param.clinicDiagnosis : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("治疗建议")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.treatmentRecommendations.length > 0 ? _vm.param.treatmentRecommendations : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("报到目的")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.clinicPurpose.length > 0 ? _vm.param.clinicPurpose : "未填写"))])], 1)], 1)], 1)] : _vm._e(), _vm._v(" "), (_vm.param.reportType == 3) ? [_c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("来源渠道")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.source.length > 0 ? _vm.param.source : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("咨询目的")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.purpose.length > 0 ? _vm.param.purpose : "未填写"))])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "report-details-item"
  }, [_c('article', {
    staticClass: "report-details-text"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("病情描述")]), _vm._v(" "), _c('article', {
    staticClass: "report-details-text-inline"
  }, [_c('p', {
    staticClass: "text"
  }, [_vm._v(_vm._s(_vm.param.illnessDetail.length > 0 ? _vm.param.illnessDetail : "未填写"))])], 1)], 1)], 1)] : _vm._e()]], 2), _vm._v(" "), _c('section', {
    staticClass: "report-img-box"
  }, [_c('h4', {
    staticClass: "title"
  }, [_vm._v("图片资料")]), _vm._v(" "), (_vm.imageShow) ? _c('section', {
    staticClass: "report-details-img-box"
  }, _vm._l((_vm.attList), function(item, index) {
    return (index < 4) ? _c('figure', {
      key: index,
      staticClass: "report-details-img-item",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(item)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.caseAttUrl,
        "alt": ""
      }
    }), _vm._v(" "), (index === 3 && _vm.attList.length > 4) ? _c('article', {
      staticClass: "report-details-img-big"
    }, [_c('figure', [_c('span', [_vm._v("更多")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.imageNum))])])], 1) : _vm._e()], 1) : _vm._e()
  })) : _c('p', {
    staticClass: "report-img-text"
  }, [_vm._v("您还未上传，"), _c('span', {
    staticClass: "report-img-upload",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.uploadShow()
      }
    }
  }, [_vm._v("点击补充检查资料、药品图片")]), _vm._v("等")])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "main-message-box-item others-message"
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.targetMsg.avatar,
      "alt": ""
    }
  })]), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content"
  }, [_c('p', [_vm._v("恭喜您报到成功，有问题可随时给我留言，上线后会尽快回复您。")])], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e7585efe", esExports)
  }
}

/***/ }),

/***/ 758:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorAdvice_vue__ = __webpack_require__(760);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e1828f98_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorAdvice_vue__ = __webpack_require__(761);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(759)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-e1828f98"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorAdvice_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e1828f98_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorAdvice_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/doctorAdvice.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorAdvice.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e1828f98", Component.options)
  } else {
    hotAPI.reload("data-v-e1828f98", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 759:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 760:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
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
 * Created by lichenyang on 2018/7/5.
 */


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      contentData: {},
      moreShowFlag: false,
      adviceContent: '',
      adviceContentMore: ""
    };
  },
  mounted: function mounted() {
    console.log(this.reportId);
    this.contentData = this.contentMessage.content.data[0];
    if (__WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getByteLen(this.contentData.toleContent) > 24) {
      this.moreShowFlag = true;
      this.adviceContentMore = this.contentData.toleContent;
      this.adviceContent = __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getStrByteLen(this.contentData.toleContent, 22) + "...";
    } else {
      this.adviceContent = this.contentData.toleContent;
    }
    console.log(this.contentData);
  },


  methods: {
    showMore: function showMore() {
      this.adviceContent = this.adviceContentMore;
      this.moreShowFlag = false;
    },

    // 去患教
    goKnowledge: function goKnowledge(e) {
      console.log(encodeURIComponent(this.contentData.educationUrl));
      wx.navigateTo({
        url: "/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=" + encodeURIComponent(this.contentData.educationUrl + "&type=1&shareDoctorId=" + this.contentData.customerId)
      });
    }
  },
  props: {
    contentMessage: {
      type: Object
    },
    reportId: {
      type: Number
    },
    doctorCustomerId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 761:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "advice-box"
  }, [_c('figcaption', {
    staticClass: "advice-title"
  }, [_c('section', {
    staticClass: "advice-top"
  }, [_c('h3', {
    staticClass: "advice-title"
  }, [_vm._v("医嘱提醒")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "advice-content"
  }, [(_vm.adviceContent.length) ? _c('li', {
    staticClass: "content-top"
  }, [_c('section', {
    staticClass: "content-top-left"
  }, [_vm._v("医嘱内容")]), _vm._v(" "), _c('section', {
    staticClass: "content-top-right"
  }, [_vm._v(_vm._s(_vm.adviceContent)), (_vm.moreShowFlag) ? _c('span', {
    staticClass: "more",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.showMore()
      }
    }
  }) : _vm._e()])], 1) : _vm._e(), _vm._v(" "), _c('li', {
    staticClass: "content-bottom",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.goKnowledge($event)
      }
    }
  }, [_vm._v("请及时查看"), _c('span', [_vm._v(_vm._s(_vm.contentData.educationTitle))]), _c('span', {
    staticClass: "more"
  })])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e1828f98", esExports)
  }
}

/***/ }),

/***/ 762:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_medicalReport_vue__ = __webpack_require__(764);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_885b5490_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReport_vue__ = __webpack_require__(765);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(763)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_medicalReport_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_885b5490_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReport_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/medicalReport.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] medicalReport.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-885b5490", Component.options)
  } else {
    hotAPI.reload("data-v-885b5490", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 763:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 764:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_getMedicalReportMainCase__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);

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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/11.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      timeSlot: false, // 咨询单底部提示话术控制
      mainCase: ""
    };
  },
  mounted: function mounted() {
    this.getTimeSlot();
    // this.$emit("medicalReportLoad",this.medicalReportMessage.data);

    if (!this.medicalReportMessage.data.diagnoseConTent && !this.medicalReportMessage.data.diagnoseContent) {
      this.getCaseMain();
    } else {
      this.mainCase = this.medicalReportMessage.data.diagnoseConTent || this.medicalReportMessage.data.diagnoseContent;
    }
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['patientName', 'patientInfo', 'isFindDoctor', 'doctorBaseMsg']), {
    formatName: function formatName() {
      if (this.patientInfo.patientName.length > 6) {
        return this.patientInfo.patientName.substring(0, 6) + "...";
      } else {
        return this.patientInfo.patientName;
      }
    }
  }),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setIsFindDoctor']), {
    getCaseMain: function getCaseMain() {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_getMedicalReportMainCase__["a" /* default */])({
        caseId: this.caseId,
        patientId: this.patientId
      }).then(function (param) {
        if (param.responseObject.responseStatus) {
          _this.mainCase = param.responseObject.responseData.dataList[0].caseMain.caseMain;
        }
      });
    },

    // 设置咨询单底部提示话术
    getTimeSlot: function getTimeSlot() {
      var param = this.medicalReportMessage.data;
      console.log(param);
      var timeTamp = parseInt(param.time.split(" ")[1].split(":")[0]);
      if (timeTamp < 9 || timeTamp > 17) {
        this.timeSlot = false;
      } else {
        this.timeSlot = true;
      }
    },
    goToDetail: function goToDetail() {
      // this.$router.push({
      //   name: "MedicalReportDetail",
      // })
      wx.navigateTo({
        url: '/packageA/medicalReportDetail/medicalReportDetail?caseId=' + this.caseId
      });
    }
  }),
  filters: {
    ellipsis: function ellipsis(value, len) {
      if (!value) return '';
      var newStr = '',
          newLength = 0;
      for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 128) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength <= len) {
          newStr = newStr.concat(value[i]);
        } else {
          break;
        }
      }
      if (newLength > len) {
        newStr = newStr + "...";
      }
      return newStr;
    }
  },
  props: {
    medicalReportMessage: {
      type: Object
    },
    caseId: {
      type: Number
    },
    patientId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 765:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "medical-report-box",
    attrs: {
      "data-clientid": "",
      "eventid": '0'
    },
    on: {
      "click": _vm.goToDetail
    }
  }, [_c('header', {
    staticClass: "medical-report-title"
  }, [_vm._v("咨询单")]), _vm._v(" "), _c('section', {
    staticClass: "medical-report-content"
  }, [_c('p', {
    staticClass: "patient-info"
  }, [_c('span', [_vm._v("就诊人：")]), _vm._v(" "), _c('span', {
    staticClass: "patient-name"
  }, [_vm._v(_vm._s(_vm.formatName) + " ")]), _vm._v(" "), _c('span', {
    staticClass: "patient-age"
  }, [_vm._v(_vm._s(_vm.patientInfo.sexName) + " " + _vm._s(_vm.patientInfo.age) + "岁")])]), _vm._v(" "), _c('p', {
    staticClass: "case-describe"
  }, [_c('span', [_vm._v("病   情：")]), _c('span', {
    staticClass: "case-describe-main"
  }, [_vm._v(_vm._s(_vm.mainCase))])])], 1), _vm._v(" "), _c('footer', {
    staticClass: "medical-report-footer"
  }, [_vm._v("查看已提交信息")])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "main-message-box-item others-message"
  }, [_c('figcaption', {
    staticClass: "first-message"
  }, [_c('p', [_vm._v("已通知医生尽快接诊，医生回复将在公众号中即时通知，请保持关注，"), _c('span', {
    staticStyle: {
      "color": "#2EA9FE"
    }
  }, [_vm._v("48小时未接诊将自动退诊")])])], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-885b5490", esExports)
  }
}

/***/ }),

/***/ 766:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportImageUpload_vue__ = __webpack_require__(768);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_fe4dce0a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportImageUpload_vue__ = __webpack_require__(769);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(767)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-fe4dce0a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportImageUpload_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_fe4dce0a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportImageUpload_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/reportImageUpload.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reportImageUpload.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-fe4dce0a", Component.options)
  } else {
    hotAPI.reload("data-v-fe4dce0a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 767:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 768:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);

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
 * Created by lichenyang on 2018/7/5.
 */




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },
  mounted: function mounted() {},


  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setReportImageUpload']), {
    uploadHidden: function uploadHidden() {
      this.setReportImageUpload(false);
    }
  }),
  props: {}
});

/***/ }),

/***/ 769:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "upload-box",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.uploadHidden()
      }
    }
  }, [_c('ul', {
    staticClass: "upload-image-list",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
      }
    }
  }, [_c('h3', {
    staticClass: "upload-image-title"
  }, [_vm._v("您要上传的照片是？")]), _vm._v(" "), _c('li', {
    staticClass: "upload-image-item"
  }, [_vm._v("检查资料")]), _vm._v(" "), _c('li', {
    staticClass: "upload-image-item"
  }, [_vm._v("药品名称")]), _vm._v(" "), _c('li', {
    staticClass: "upload-image-item"
  }, [_vm._v("床头卡/腕带")])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-fe4dce0a", esExports)
  }
}

/***/ }),

/***/ 770:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_serviceComment_vue__ = __webpack_require__(772);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7dd93732_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_serviceComment_vue__ = __webpack_require__(773);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(771)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7dd93732"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_serviceComment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7dd93732_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_serviceComment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctor/components/serviceComment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] serviceComment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7dd93732", Component.options)
  } else {
    hotAPI.reload("data-v-7dd93732", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 771:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 772:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getServiceCommentStatus__ = __webpack_require__(132);

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
 * Created by lichenyang on 2018/7/5.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState;



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isClick: false
    };
  },
  mounted: function mounted() {},

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetMsg'])),
  methods: {
    // 去评价
    goCommentPage: function goCommentPage() {
      var _this2 = this;

      var _this = this;
      if (_this.isClick) {
        return;
      }
      _this.isClick = true;
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getServiceCommentStatus__["a" /* default */])({
        consultationId: this.orderSourceId
      }).then(function (data) {
        console.log(data);
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData,
            responseMessage = _data$responseObject.responseMessage;

        if (responseStatus && !!responseData) {
          if (responseMessage == 'NO DATA') {
            wx.navigateTo({
              url: "/packageD/reportNew/doctorEvaluate?doctorId=" + _this2.customerId + "&patientId=" + _this2.patientId + "&consultationId=" + _this2.orderSourceId + "&isRequest=1&patientCustomerId=" + wx.getStorageSync('userId')
            });
          } else {
            var status = responseData.status;

            if (status == 2) {
              wx.navigateTo({
                url: "/packageD/reportNew/doctorEvaluate?doctorId=" + _this2.customerId + "&patientId=" + _this2.patientId + "&consultationId=" + _this2.orderSourceId + "&isRequest=1&patientCustomerId=" + wx.getStorageSync('userId')
              });
            } else {
              wx.navigateTo({
                url: "/packageD/reportNew/doctorEvaluateEnd?consultationId=" + _this2.orderSourceId
              });
            }
          }
        } else {
          console.log('接口请求失败');
        }
        _this.isClick = false;
      }).catch(function (err) {
        _this.isClick = false;
        console.log(err);
      });
      // wx.navigateTo({
      //   url: `/packageD/reportNew/doctorEvaluate?doctorId=${this.customerId}&patientId=${this.patientId}&consultationId=${this.orderSourceId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
      // });
    }
  },
  props: {
    customerId: {
      type: Number
    },
    patientId: {
      type: Number
    },
    orderSourceId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 773:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "service-box",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goCommentPage()
      }
    }
  }, [_c('figcaption', {
    staticClass: "service--title"
  }, [_c('section', {
    staticClass: "service--top"
  }, [_c('h3', {
    staticClass: "service--title"
  }, [_vm._v("服务评价提醒")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "service--content"
  }, [_c('li', {
    staticClass: "content-top"
  }, [_c('section', {
    staticClass: "content-top-left"
  }, [_vm._v("您对" + _vm._s(_vm.targetMsg.nick) + "医生满意吗？亲爱的患友，请您抽出宝贵的时间，对医生进行评价，为其他患友提供有价值的参考。")])], 1), _vm._v(" "), _c('li', {
    staticClass: "content-bottom"
  }, [_vm._v("\n        点击此处对" + _vm._s(_vm.targetMsg.nick) + "医生进行评价\n        "), _c('span', {
    staticClass: "more"
  })])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7dd93732", esExports)
  }
}

/***/ }),

/***/ 774:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = updateAfterTimeOver;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/16.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/case/consultation/v1/batchUpdateStatus/";
function updateAfterTimeOver(params) {

  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
      url: XHRUrl,
      method: "POST",
      data: params,
      done: function done(data) {
        resolve(data);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

/***/ }),

/***/ 775:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = refreshToken;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);


/**
 * @Desc：重新刷新TokeN
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/im/interact/v1/refreshToken/";

function refreshToken(param) {
  var _default = {};

  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
      url: XHRUrl,
      method: "POST",
      data: data,
      done: function done(data) {
        resolve(data);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

/***/ }),

/***/ 776:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-inner",
    attrs: {
      "eventid": '18'
    },
    on: {
      "click": function($event) {
        _vm.deleteMsgIndex = -1
      }
    }
  }, [(_vm.caseType == '15' && _vm.lastTimeShow && _vm.receiveTreatmentStatus) ? [_c('article', {
    staticClass: "main-message-time meinianHeader"
  }, [_vm._v("\n      免费问诊\n    ")])] : [(_vm.totalCount === 0 && _vm.lastTimeShow && _vm.receiveTreatmentStatus) ? _c('article', {
    staticClass: "main-message-time"
  }, [_c('article', [_c('p', [_vm._v("医生回复剩余次数")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.lastCount))]), _vm._v(" "), _c('p', [_vm._v("次")])], 1), _vm._v(" "), _c('article', [_c('p', [_vm._v("对话剩余时间")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.lastTimeText))]), _vm._v(" "), _c('p')], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.totalCount > 0 && _vm.lastTimeShow && _vm.receiveTreatmentStatus) ? _c('article', {
    staticClass: "main-message-time"
  }, [_c('article', [_c('p', [_vm._v("唯医骨科送您")]), _vm._v(" "), _c('span', [_vm._v("50")]), _vm._v(" "), _c('p', [_vm._v("次医生回复机会")])], 1), _vm._v(" "), _c('article', [_c('p', [_vm._v("剩余次数：")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.lastCount))]), _vm._v(" "), _c('p', [_vm._v("次")])], 1)], 1) : _vm._e()], _vm._v(" "), (_vm.getTargetMsgFinish && !_vm.lastTimeShow) ? _c('article', {
    staticClass: "main-message-time doctor-title-message",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.goToDoctorHomePage
    }
  }, [_c('figure', {
    staticClass: "doctor-title-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.targetMsg.avatar,
      "alt": ""
    }
  })]), _vm._v(" "), _c('figcaption', {
    staticClass: "doctor-title-content"
  }, [_c('h4', {
    staticClass: "name"
  }, [_vm._v(_vm._s(_vm.targetMsg.nick))]), _vm._v(" "), (_vm.targetMsg.title) ? _c('span', {
    staticClass: "title"
  }, [_vm._v(_vm._s(_vm.doctorTitleName))]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "hospital"
  }, [_vm._v(_vm._s(_vm.targetMsg.hospital))]), _vm._v(" "), _c('i', {
    staticClass: "icon-rightArrow"
  })], 1)], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "main-message",
    class: {
      'showBottomPd': _vm.footerBottomFlag || _vm.bottomTipsType !== '', 'android': !_vm.ios
    },
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": function($event) {
        _vm.deleteMsgIndex = -1
      },
      "touchmove": function($event) {
        _vm.deleteMsgIndex = -1
      }
    }
  }, _vm._l((_vm.msgList), function(msg, index) {
    return _c('section', {
      key: msg.idClient,
      staticClass: "main-message-wrapper"
    }, [(_vm.timeStampShowList[index] == 1) ? _c('p', {
      staticClass: "time-stamp"
    }, [_vm._v("\n        " + _vm._s(msg.timeStamp))]) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'reportOrder') ? _c('ReportDetails', {
      ref: "reportOrder",
      refInFor: true,
      attrs: {
        "reportOrderMessage": msg.content,
        "reportId": _vm.caseId,
        "targetMsg": _vm.targetMsg,
        "textareaShow": _vm.textareaShow,
        "mpcomid": '2-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'medicalReport') ? _c('MedicalReport', {
      attrs: {
        "medicalReportMessage": msg.content,
        "caseId": _vm.caseId,
        "patientId": _vm.patientId,
        "mpcomid": '3-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 4) ? _c('MiddleTips', {
      attrs: {
        "tipsType": 4,
        "mpcomid": '4-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'deleteMsgTips') ? _c('section', {
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message"
    }, [(msg.from === _vm.targetData.account) ? _c('p', [_vm._v(_vm._s(_vm.targetMsg.nick + '医生') + "撤回了一条消息")]) : _vm._e(), _vm._v(" "), (msg.from !== _vm.targetData.account) ? _c('p', [_vm._v("您撤回了一条消息")]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 3) ? _c('section', {
      staticClass: "main-message-box"
    }, [_c('article', {
      staticClass: "main-message-box-item others-message"
    }, [_c('figure', {
      staticClass: "main-message-img"
    }, [_c('img', {
      attrs: {
        "src": _vm.targetLogo,
        "alt": ""
      }
    })]), _vm._v(" "), _c('figcaption', {
      staticClass: "main-message-content"
    }, [_c('p', [_vm._v("感谢您的信任！我暂时无法为您提供服务；您已支付的费用系统将自动退回，请注意查收。")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'payFinishTips') ? _c('PayFinishTips', {
      attrs: {
        "mpcomid": '5-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'outpatientInvite') ? _c('OutpatientInvite', {
      ref: "outpatientInvite",
      refInFor: true,
      attrs: {
        "outPatientMessage": msg.content,
        "mpcomid": '6-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'outpatientOrderFromPT') ? _c('OutpatientAppointment', {
      attrs: {
        "contentMessage": msg,
        "mpcomid": '7-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'outpatientOrderFromDT') ? _c('OutpatientService', {
      attrs: {
        "patientId": _vm.patientId,
        "caseId": _vm.caseId,
        "doctorCustomerId": _vm.doctorCustomerId,
        "mpcomid": '8-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'doctorRemind') ? _c('DoctorAdvice', {
      attrs: {
        "reportId": _vm.reportId,
        "doctorCustomerId": _vm.doctorCustomerId,
        "contentMessage": msg,
        "mpcomid": '9-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 2) ? _c('SendCount', {
      attrs: {
        "sendCountMessage": msg.content,
        "doctorName": _vm.targetMsg.nick,
        "mpcomid": '10-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 1) ? _c('section', {
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message"
    }, [_c('p', [_vm._v("您已完成支付，可与主诊医生继续沟通")])], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'text' && msg.text) ? _c('ContentText', {
      attrs: {
        "contentMessage": msg,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "currentIndex": index,
        "from": _vm.from,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "eventid": '1-' + index,
        "mpcomid": '11-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg, index)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        }
      }
    }) : _vm._e(), _vm._v(" "), ((msg.type === 'file' || msg.type === 'image') && msg.file && msg.file.ext !== 'pdf') ? _c('ImageContent', {
      ref: "bigImg",
      refInFor: true,
      attrs: {
        "imageMessage": msg,
        "imageList": _vm.imageList,
        "currentIndex": index,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "eventid": '2-' + index,
        "mpcomid": '12-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg, index)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && (msg.content.type === 'mulitpleImage' || msg.content.type === 'multipleImage')) ? _c('MulitpleImage', {
      attrs: {
        "imageMessage": msg,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "currentIndex": index,
        "eventid": '3-' + index,
        "mpcomid": '13-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg, index)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'video' && msg.file) ? _c('VideoMessage', {
      attrs: {
        "videoMessage": msg,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "currentIndex": index,
        "inputBoxShow": _vm.inputBoxShow,
        "eventid": '4-' + index,
        "mpcomid": '14-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg, index)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        },
        "update:inputBoxShow": function($event) {
          _vm.inputBoxShow = $event
        }
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'file' && msg.file && msg.file.ext === 'pdf') ? _c('FileMessage', {
      attrs: {
        "fileMessage": msg,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "currentIndex": index,
        "fileProgress": _vm.fileProgress,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "eventid": '5-' + index,
        "mpcomid": '15-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg, index)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'patientNode') ? _c('patientNodeMsg', {
      attrs: {
        "contentMessage": msg,
        "mpcomid": '16-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'serviceComment') ? _c('serviceComment', {
      attrs: {
        "customerId": _vm.doctorCustomerId,
        "patientId": _vm.patientId,
        "orderSourceId": _vm.orderSourceId,
        "mpcomid": '17-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 6) ? _c('section', {
      ref: "reportTip",
      refInFor: true,
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message"
    }, [_c('p', [_vm._v("报到成功，您可继续补充您的情况，便于医生更好了解病情")])], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'sensitiveTip') ? _c('section', {
      staticClass: "main-message-box anti-spam-tips"
    }, [_c('figcaption', {
      staticClass: "anti-spam-con"
    }, [_c('p', {
      staticClass: "anti-spam-text"
    }, [_vm._v("您可能发送了不良用语，请乐观积极与医生沟通以获取指导。（如系统误判，请忽略此消息）")])], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'healthCard') ? _c('section', {
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message",
      attrs: {
        "eventid": '6-' + index
      },
      on: {
        "click": _vm.goToGetHealthCard
      }
    }, [_c('p', {
      staticClass: "getHealthCard-one"
    }, [_vm._v("领取居民健康卡，有利于医生了解您的病情")]), _vm._v(" "), _c('p', {
      staticClass: "getHealthCard"
    }, [_vm._v("立即领取 >")])], 1)], 1) : _vm._e()], 1)
  })), _vm._v(" "), (_vm.inputBoxShow || (_vm.recommendShow && !_vm.lastTimeShow && _vm.bottomTipsType == 2)) ? _c('footer', {
    staticClass: "main-input-box",
    class: {
      'main-input-box-text': (!_vm.textareaShow) && (_vm.bottomTipsType !== ''), 'main-input-box-end': (!_vm.textareaShow) && (_vm.bottomTipsType == 3)
    }
  }, [_c('section', {
    staticClass: "footer-box-top"
  }, [_c('transition', {
    attrs: {
      "name": "fadeUp",
      "mpcomid": '19'
    }
  }, [(_vm.bottomTipsShow) ? _c('BottomTips', {
    attrs: {
      "bottomTipsType": _vm.bottomTipsType,
      "mpcomid": '18'
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: ((_vm.recommendShow && !_vm.textareaShow) || !_vm.lastTimeShow && _vm.bottomTipsType == 2),
      expression: "(recommendShow&&!textareaShow) || !lastTimeShow&&bottomTipsType==2"
    }],
    staticClass: "prohibit-input",
    attrs: {
      "eventid": '8'
    },
    on: {
      "click": function($event) {
        _vm.retryClick($event, 2)
      }
    }
  }, [_c('div', [_c('span', [_vm._v("重新推荐")])])]), _vm._v(" "), (_vm.bottomTipsShow && _vm.bottomTipsType == 3) ? _c('section', {
    staticClass: "prohibit-input consultation-end"
  }, [_c('div', [_c('span', {
    staticClass: "end-text"
  }, [_vm._v("咨询已结束")])])]) : _vm._e(), _vm._v(" "), (!_vm.lastTimeShow && _vm.bottomTipsType == -1) ? _c('section', {
    staticClass: "prohibit-input",
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": function($event) {
        _vm.retryClick($event, -1)
      }
    }
  }, [_c('div', [_c('span', [_vm._v("重新支付")])])]) : _vm._e(), _vm._v(" "), (!_vm.lastTimeShow && _vm.bottomTipsType == 1) ? _c('section', {
    staticClass: "prohibit-input",
    attrs: {
      "eventid": '10'
    },
    on: {
      "click": function($event) {
        _vm.retryClick($event, 1)
      }
    }
  }, [_c('div', [_c('span', [_vm._v("继续沟通")])])]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "main-input-box-plus",
    attrs: {
      "eventid": '11'
    },
    on: {
      "click": _vm.showTabbar
    }
  }, [_c('i', {
    staticClass: "icon-im-plus"
  })], 1), _vm._v(" "), (_vm.textareaShow) ? _c('figure', {
    staticClass: "main-input-box-textarea-inner"
  }, [_c('form', {
    staticClass: "patientForm",
    attrs: {
      "report-submit": "true",
      "id": "baseIm",
      "eventid": '14'
    },
    on: {
      "submit": _vm.formSubmitName
    }
  }, [_c('section', {
    staticClass: "area-content"
  }, [(_vm.textareaShow) ? _c('input', {
    staticClass: "main-input-box-textarea",
    attrs: {
      "type": "text",
      "maxlength": "500",
      "cursor-spacing": "5",
      "eventid": '12'
    },
    on: {
      "input": _vm.inputFunc,
      "focus": function($event) {
        _vm.scrollToBottom()
      }
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.textareaShow) ? _c('div', {
    staticClass: "main-input-box-textarea"
  }) : _vm._e()]), _vm._v(" "), _c('button', {
    staticClass: "main-input-box-send",
    class: {
      'on': _vm.sendTextContent.length
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '13'
    },
    on: {
      "click": _vm.sendMessage
    }
  }, [_vm._v("发送\n          ")])], 1)], 1) : _vm._e()], 1), _vm._v(" "), (_vm.footerBottomFlag) ? _c('ul', {
    staticClass: "footer-box-bottom"
  }, [(_vm.toolbarConfig.image) ? _c('li', {
    staticClass: "bottom-item",
    attrs: {
      "eventid": '15'
    },
    on: {
      "click": _vm.selectImage
    }
  }, [_c('figure', {
    staticClass: "bottom-item-content"
  }, [_c('img', {
    staticClass: "bottom-item-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/imScene/picture@2x.png",
      "width": "350",
      "height": "234"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "bottom-item-description"
  }, [_vm._v("图片")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.toolbarConfig.video && !_vm.isIPad) ? _c('li', {
    ref: "videoSendBox",
    staticClass: "bottom-item",
    attrs: {
      "eventid": '16'
    },
    on: {
      "click": _vm.selectVideo
    }
  }, [_c('figure', {
    staticClass: "bottom-item-content"
  }, [_c('img', {
    staticClass: "bottom-item-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/imScene/pictures@2x.png",
      "width": "350",
      "height": "234"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "bottom-item-description"
  }, [_vm._v("视频")])], 1)], 1) : _vm._e()], 1) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '20'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.toastShow) ? _c('Toast', {
    attrs: {
      "content": _vm.toastContent,
      "imgUrl": _vm.toastImg,
      "mpcomid": '21'
    }
  }) : _vm._e(), _vm._v(" "), _c('Suggestion', {
    attrs: {
      "customerId": _vm.patientCustomerId,
      "isLeave": _vm.isLeave,
      "doctorCustomerId": _vm.targetData.account.substring(2),
      "eventid": '17',
      "mpcomid": '22'
    },
    on: {
      "update:isLeave": function($event) {
        _vm.isLeave = $event
      }
    }
  }), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '23'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.reportImageUpload) ? _c('reportImageUpload', {
    attrs: {
      "mpcomid": '24'
    }
  }) : _vm._e(), _vm._v(" "), _c('blackList', {
    attrs: {
      "mpcomid": '25'
    }
  })], 2)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1598236b", esExports)
  }
}

/***/ })

},[1246]);