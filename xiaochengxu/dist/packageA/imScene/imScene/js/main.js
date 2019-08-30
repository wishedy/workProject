global.webpackJsonp([3],{

/***/ 620:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imScene_vue__ = __webpack_require__(622);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3f79aaed_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imScene_vue__ = __webpack_require__(682);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(621)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imScene_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3f79aaed_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imScene_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/imScene.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] imScene.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3f79aaed", Component.options)
  } else {
    hotAPI.reload("data-v-3f79aaed", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 621:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 622:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_nimEnv_nimEnv__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_imBaseMethods_imBusinessMethods__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_nimEnv_NIM_Web_NIM_v5_3_0__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_common_js_nimEnv_NIM_Web_NIM_v5_3_0__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_content__ = __webpack_require__(623);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_image__ = __webpack_require__(627);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_middleTips__ = __webpack_require__(631);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_medicalReport__ = __webpack_require__(635);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_previewSuggestion__ = __webpack_require__(643);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_checkSuggest__ = __webpack_require__(647);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_reviewCaseSuccess__ = __webpack_require__(651);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_reviewCaseFail__ = __webpack_require__(655);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_triage__ = __webpack_require__(659);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_video__ = __webpack_require__(663);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_mulitpleImage__ = __webpack_require__(667);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_fileMessage__ = __webpack_require__(671);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25_components_suggestion__ = __webpack_require__(177);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29_common_js_HttpRequest_getTriageWorkingTime__ = __webpack_require__(678);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30_common_js_HttpRequest_getMedicalReportDetails__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_common_js_HttpRequest_getNimToken__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32_common_js_HttpRequest_getCaseInfo__ = __webpack_require__(178);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33_common_js_HttpRequest_getConsultationList__ = __webpack_require__(179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34_common_js_HttpRequest_createConsultation__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_common_js_HttpRequest_getConsultationLastTime__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36_common_js_HttpRequest_getPatientBase__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37_common_js_HttpRequest_getDoctorBaseMsg__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39_common_js_HttpRequest_updateConsultationState__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40_common_js_HttpRequest_updateMedicalReport__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41_util__ = __webpack_require__(679);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41_util___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_41_util__);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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




// /**************************Common Methods*************************/




// /**************************ThirdParty Components**************************/

// /**************************Base Vue-Methods*************************/

// /**************************Private Methods*************************/



 // 咨询单组件
 // 初诊建议组件
 // 检查检验组件
 // 审核通过消息组件
 //审核不通过消息组件
 // 视诊




 // 返回首页组件
 //黑名单组件

// /**************************Axios Http Requests*************************/
 // 获取分诊工作时间
 // 获取咨询单详情







 // 发送formId




var XHRList = {
  sendMessage: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/',
  updateTriageType: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/case/consultation/v1/update/"
};

var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_12_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

var imBaseMethods = void 0;
var roamingMsgs = []; // 漫游消息
var scrollTimer = null; // 页面滑动的定时器
/* harmony default export */ __webpack_exports__["a"] = ({
  name: "index",
  data: function data() {
    return {
      serviceTime: '', // 分诊医生服务时间
      // caseId: "",
      caseType: "", // 患者与专业医生等病例类型（caseType0-咨询2-手术直约10-老患者报到(诊后报道)11-立即咨询12-找医生(免费)13-找医生(付费)）
      doctorCustomerId: "",
      // patientId: "",
      patientCustomerId: "",
      mainCase: "",
      allMsgsGot: false,
      historyBeginTime: 0,
      isLeave: false,
      disabled: false, // input 是否可以点击 ；
      titleName: "", //document.title 的话术
      loading: true,
      footerBottomFlag: false, // 底部文件选择框是否显示
      receiveTime: "",
      imageList: [],
      consultationId: "",
      setFocus: false,
      timeStampShowList: [],
      orderSourceId: "",
      beginTimestamp: 0,
      inputBoxShow: false,
      triageType: '',
      msgList: [],
      connectFlag: false, // 是否连接上
      showFlag: false, // 是否触发 onShow 生命周期；
      userData: {
        account: "",
        token: ""
      },
      //分诊目标数据
      targetData: {
        account: "1_doctor00001"
      },
      sendTextContent: "",
      footerPosition: "main-input-box",
      scrollHeight: "",
      deleteMsgIndex: -1,
      toastTips: "",
      toastShow: false,
      connectNum: 0,
      destroyIM: true, // 是否卸载IM；
      isIPad: false, // 是否是 iPad
      backIndexShow: false, // 返回首页是否显示，
      sendTextFlag: true, // 是否可以发送文字消息
      sendDataList: {}
    };
  },
  onLoad: function onLoad() {
    var _this2 = this;

    console.log('onLoad');
    //是否显示回首页的悬浮按钮
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.msgList = [];
    this.sendDataList = {};
    this.imageList = []; // 清空查看大图数组
    this.timeStampShowList = []; // 是否显示时间清空
    this.sendTextFlag = true;
    this.destroyIM = true;
    var query = this.$root.$mp.query;
    console.log(query);
    // this.caseId = query.caseId;
    this.setCaseId(query.caseId); // 设置 vuex 中的caseId
    // this.patientId = query.patientId;
    this.setPatientId(query.patientId); // 设置 vuex 中的patientId
    this.patientCustomerId = wx.getStorageSync("userId");
    this.allMsgsGot = false;
    this.userData = {
      account: "0_" + this.caseId,
      token: ""
    };
    this.isIPad = wx.getSystemInfoSync().model.includes("iPad") ? true : false;
    this.getCaseBaseInfo(); // 通过caseId 获取 case 的基本信息
    this.getPatientBase(); // 获取患者的基本信息
    wx.getNetworkType({
      success: function success(res) {
        var networkType = res.networkType;
        if (networkType === "none") {
          wx.showToast({
            title: "网络中断，请检查您的网络状态",
            icon: "none",
            duration: 2000,
            mask: true
          });
        }
      }
    });

    wx.onNetworkStatusChange(function (res) {

      console.log("netStatus:");
      console.log(res);
      if (res && !!res.isConnected) {
        if (_this2.connectNum === 0) {
          _this2.getUserBaseData();
        }
      } else {
        _this2.connectNum = 0;
        wx.showToast({
          title: "网络中断，请检查您的网络状态",
          icon: "none",
          duration: 2000,
          mask: true
        });
        if (_this2.nim) {
          _this2.nim.disconnect({
            done: function done() {
              console.log('destroy really done!');
              _this2.getUserBaseData();
            }
          });
        }
      }
    });
  },
  onUnload: function onUnload() {
    var _this3 = this;

    console.log('onUnload');
    if (this.nim && this.nim.disconnect) {
      this.nim.disconnect({
        done: function done() {
          _this3.nim = {};
          console.log(_this3.nim);
          console.log('onUnload destroy really done!');
        }
      });
    }
    this.msgList = [];
    this.triageType = '';
    this.imageList = []; // 清空查看大图数组
    this.timeStampShowList = []; // 是否显示时间清空
    this.setTargetMsg({});
    this.doctorCustomerId = "";
    this.patientCustomerId = "";

    this.historyBeginTime = 0;
    this.allMsgsGot = false;
    this.inputBoxShow = false;
    this.footerBottomFlag = false;
    this.connectNum = 0;
    clearTimeout(scrollTimer);
    //清除缓存
    __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem('triageTips');
    __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem('checkSuggestTips');
  },
  onShow: function onShow() {
    var _this4 = this;

    console.log("onShow");
    if (this.$root.$mp.query.from === "find") {
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].enterBrowse({
        browseType: "100",
        opDesc: "想要医生的帮助-找医生（小程序）"
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].enterBrowse({
        browseType: "115",
        opDesc: "分诊聊天页（小程序）"
      });
    }
    this.showFlag = true; // 触发了 onShow 的生命周期，在 watch 中需要监听im 连接；
    console.log(this.destroyIM);

    if (this.destroyIM) {
      if (this.nim && this.nim.disconnect) {
        console.log("SDK Destory...");
        this.nim.disconnect({
          done: function done() {
            _this4.nim = {};
            _this4.connectNum = 0;
            console.log('destroy really done!');
            _this4.getUserBaseData();
          }
        });
      } else {
        this.connectNum = 0;
        console.log("SDK已销毁...初始化开始");
        this.getUserBaseData();
      }
    }
    if (this.connectNum > 0) {
      console.log('已经连接过了');
      Object(__WEBPACK_IMPORTED_MODULE_33_common_js_HttpRequest_getConsultationList__["a" /* default */])({
        caseId: this.caseId,
        consultationType: 0
      }).then(function (data) {
        //无数据....创建新会话
        if (data.responseObject.responseMessage === "NO DATA") {
          console.log('我要创建会话1');
          _this4.createTriageMessage();
        } else {
          //有数据...获取会话ID并获取当前会话状态
          var dataList = data.responseObject.responseData.dataList;
          _this4.orderSourceId = dataList[0].consultationId;
          _this4.getLastTime();
        }
      });
    }
  },
  onHide: function onHide() {
    var _this5 = this;

    __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].leaveBrowse();
    console.log('onHide');
    this.showFlag = false;
    if (this.destroyIM && this.nim && this.nim.disconnect) {
      this.nim.disconnect({
        done: function done() {
          _this5.nim = {};
          _this5.connectNum = 0;
          console.log('onHide destroy really done!');
        }
      });
    }
  },
  onPullDownRefresh: function onPullDownRefresh() {
    var _this6 = this;

    console.log("pull");
    this.pulling = true;
    if (roamingMsgs.length) {
      this.buildRenderMsg("scrollInit", roamingMsgs.splice(0, 20));
    } else {
      if (this.allMsgsGot) {
        this.showToast("没有更多消息了");
      } else {
        console.log('getTimeSlot');
        if (!this.msgList[0]) {
          wx.stopPullDownRefresh();
          return;
        }
        imBaseMethods.getMessageList({
          beginTime: 0,
          endTime: this.msgList[0].time,
          target: this.targetData.account,
          reverse: false
        }).then(function (obj) {
          console.log(obj);
          if (obj.msgs.length === 0) {
            _this6.showToast("没有更多消息了");
            _this6.allMsgsGot = true;
          } else {
            if (obj.msgs.length <= 100) {
              _this6.allMsgsGot = true;
            } else {
              _this6.allMsgsGot = false;
            }
            roamingMsgs = obj.msgs;
            _this6.buildRenderMsg("scrollInit", roamingMsgs.splice(0, 20));
          }
        });
      }
      this.allMsgsGot = true;
    }
    wx.stopPullDownRefresh();
  },
  mounted: function mounted() {
    this.getToolbarConfig();
    this.scrollToBottom();
    this.getConsultPrice(); // 获取分诊服务时间；
    __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].setItem("PCIMLinks", __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({ caseId: this.caseId, patientId: this.patientId }));
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['caseId', 'patientId', 'patientName', 'isFindDoctor', 'patientInfo', 'toolbarConfig', 'targetMsg', 'logoUrl', 'ensureShow']), mapGetters([])),
  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapMutations(['setCaseId', 'setCaseType', 'setPatientName', 'setPatientId', 'setDoctorBaseMsg', 'setPatientInfo', 'setIsFindDoctor', 'setTargetMsg', 'setLogoUrl', 'setConsultation', 'setconsultationState', 'setEnsureShow']), mapActions(['getToolbarConfig']), {
    ////改变分诊转态
    changeTriageType: function changeTriageType() {
      var _this7 = this;

      __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.updateTriageType,
        method: "post",
        data: {
          visitSiteId: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getSiteId(),
          consultationId: this.orderSourceId,
          triageType: 1
        },
        done: function done(data) {
          if (data && data.responseObject && data.responseObject.responseStatus) {
            _this7.triageType = 1;
            _this7.scrollToBottom();
            _this7.tipNewPatient(_this7.sendDataList);
          } else {
            wx.showToast({
              title: '更新失败',
              icon: 'none'
            });
          }
        }
      });
    },

    // 取消ensure框
    ensureClickEvent: function ensureClickEvent() {
      this.setEnsureShow(false);
    },

    /** 获取服务时间 */
    getConsultPrice: function getConsultPrice() {
      var _this8 = this;

      console.log("获取服务时间");
      Object(__WEBPACK_IMPORTED_MODULE_29_common_js_HttpRequest_getTriageWorkingTime__["a" /* default */])({
        visitSiteId: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (data) {
        console.log(data);
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData;

        if (responseStatus && !!responseData) {
          var _responseData$dataLis = responseData.dataList.responseData,
              serviceEndTime = _responseData$dataLis.serviceEndTime,
              serviceStartTime = _responseData$dataLis.serviceStartTime;


          var startTimeArray = serviceStartTime.split(":"),
              endTimeArray = serviceEndTime.split(":");
          if (startTimeArray[0].length === 1) {
            startTimeArray[0] = "0" + startTimeArray[0];
            serviceStartTime = startTimeArray.join(':');
          }
          var myDate = new Date();
          var currentHours = myDate.getHours(); //获取当前小时数(0-23)
          var currentMinutes = myDate.getMinutes(); //获取当前分钟数(0-59)
          _this8.serviceTime = serviceStartTime + "-" + serviceEndTime;
          if (currentHours < parseInt(startTimeArray[0]) || currentHours == parseInt(startTimeArray[0]) && currentMinutes < parseInt(startTimeArray[1]) || currentHours > parseInt(endTimeArray[0]) || currentHours == parseInt(endTimeArray[0]) && currentMinutes > parseInt(endTimeArray[1])) {
            _this8.serviceTime = _this8.serviceTime + " 休息中";
          }
        }
      });
    },
    showTabbar: function showTabbar() {
      this.footerBottomFlag = this.footerBottomFlag ? false : true;
      this.scrollToBottom();
    },
    getUserBaseData: function getUserBaseData() {
      var _this9 = this;

      // this.getCaseBaseInfo();// 通过caseId 获取 case 的基本信息
      console.log('获取token ， caseId + ' + this.caseId);
      Object(__WEBPACK_IMPORTED_MODULE_31_common_js_HttpRequest_getNimToken__["a" /* default */])({
        accid: this.caseId
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseCode == 'fail') {
            _this9.loading = false;
            _this9.showToast("获取 Token 失败，请重新咨询");
            return;
          }
          _this9.userData = {
            account: "0_" + _this9.caseId,
            token: data.responseObject.responseData.imToken
          };
          console.log(_this9.connectNum);
          if (_this9.connectNum == 0) {
            _this9.connectToNim();
          }
        }
      });
    },

    //通过caseId 获取 case 的基本信息
    getCaseBaseInfo: function getCaseBaseInfo() {
      var _this10 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_32_common_js_HttpRequest_getCaseInfo__["a" /* default */])(this.caseId).then(function (data) {
        var _data$responseObject2 = data.responseObject,
            responseStatus = _data$responseObject2.responseStatus,
            responseData = _data$responseObject2.responseData;

        if (responseStatus && responseData) {
          var _responseData$dataLis2 = responseData.dataList[0],
              caseType = _responseData$dataLis2.caseType,
              doctorId = _responseData$dataLis2.doctorId;

          console.log(caseType, doctorId);
          _this10.caseType = caseType;
          _this10.setCaseType(caseType); // 用来判断进入那种支付页；
          _this10.doctorCustomerId = doctorId;
          // 用来判断是否需要实名认证的需求，后来取消掉
          if (caseType == "12" || caseType == '13') {
            _this10.setIsFindDoctor(true);
            _this10.getDoctorMsg();
            _this10.isFree = caseType == "12" ? true : false;
          } else {
            _this10.setIsFindDoctor(false);
            _this10.titleName = "分诊医生";
            wx.setNavigationBarTitle({
              title: "分诊医生"
            });
          }
        } else {
          console.log("获取case 的基本信息失败");
        }
      });
    },
    sendMessage: function sendMessage() {
      var _this11 = this;

      if (this.sendTextContent.trim().length === 0 || !this.sendTextFlag) {
        return false;
      } else {
        this.sendTextFlag = false;
        __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
          actionId: 14202,
          keyword: this.sendTextContent.trim()
        });
        // let hints=0,
        //   ret = this.nim.filterClientAntispam({
        //     content: this.sendTextContent.trim()
        //   });
        // switch (ret.type) {
        //   case 0:
        //     hints=0;
        //     console.log('没有命中反垃圾词库', ret.result);
        //     break;
        //   case 1:
        //     hints=1;
        //     console.log('已对特殊字符做了过滤', ret.result);
        //     break;
        //   case 2:
        //     hints=1;
        //     console.log('建议拒绝发送', ret.result);
        //     break;
        //   case 3:
        //     hints=1;
        //     console.log('建议服务器处理反垃圾，发消息带上字段clientAntiSpam', ret.result);
        //     break
        // }
        imBaseMethods.sendMessage({
          target: this.targetData.account,
          sendContent: this.sendTextContent.trim(),
          custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            cType: "0",
            cId: this.cId,
            mType: "0",
            conId: this.orderSourceId
            // hints:hints
          })
        }).then(function (obj) {
          _this11.setFocus = true;
          _this11.sendTextFlag = true;
          _this11.sendMessageSuccess(obj);
          // //命中反垃圾，发送发垃圾消息提醒
          // if(hints==1){
          //   this.sendAntiSpamTips();
          // }
        }).catch(function (err, obj) {
          _this11.sendTextFlag = true;
          _this11.sendFail(err, obj);
        });
      }
    },

    //发送成功回调
    sendMessageSuccess: function sendMessageSuccess(msg) {
      var _this12 = this;

      console.log("\u53D1\u9001" + msg.scene + msg.type + "\u6D88\u606F\u6210\u529F, id=" + msg.idClient);
      if (msg.type === "custom") {
        msg.content = JSON.parse(msg.content);
      }

      if (!(msg.type === "custom" && msg.content.type === "deleteMsgTips")) {
        this.sendTextContent = "";
      }

      this.msgList.push(msg);
      if (msg.type === "text") {
        this.setFocus = true;
      }

      if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
        var idClient = msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient || msg.content.data.imMessage && msg.content.data.imMessage.idClient || msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId;
        this.msgList.forEach(function (element, index) {
          if (element.idClient === idClient) {
            _this12.msgList.removeByValue(element);
            return;
          }
        });
      }
      this.getTimeStampShowList(msg);
      msg.timeStamp = this.transformTimeStamp(msg.time); // 给元素添加时间显示属性；
      this.scrollToBottom();
    },

    //发送失败回调
    sendFail: function sendFail(err, msg) {
      console.log(err, msg);
      console.log("\u53D1\u9001" + msg.type + "\u6D88\u606F\u5931\u8D25, id=" + msg.idClient);
    },
    triageDoctorAssign: function triageDoctorAssign() {
      var _this13 = this;

      //是否有分诊会话记录
      //无则创建
      //有则获取
      Object(__WEBPACK_IMPORTED_MODULE_33_common_js_HttpRequest_getConsultationList__["a" /* default */])({
        caseId: this.caseId,
        consultationType: 0
      }).then(function (data) {
        //无数据....创建新会话
        if (data.responseObject.responseMessage === "NO DATA") {
          console.log('我要创建会话2');
          _this13.createTriageMessage();
        } else {
          //有数据...获取会话ID并获取当前会话状态
          var dataList = data.responseObject.responseData.dataList;
          _this13.orderSourceId = dataList[0].consultationId;
          _this13.getLastTime();
          _this13.getMessageList();
        }
      });
    },

    //创建分流
    createTriageMessage: function createTriageMessage() {
      var _this14 = this;

      console.log('创建了分流');
      Object(__WEBPACK_IMPORTED_MODULE_34_common_js_HttpRequest_createConsultation__["a" /* default */])({
        caseId: this.caseId,
        customerId: 0,
        patientCustomerId: this.patientCustomerId,
        patientId: this.patientId,
        consultationType: 0,
        consultationState: 4,
        siteId: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getSiteId(),
        caseType: parseInt(this.caseType)
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          //创建就诊信息
          _this14.orderSourceId = data.responseObject.responsePk;
          _this14.getLastTime();
          _this14.getMessageList();
        } else {
          console.log('创建会话失败1');
        }
      }).catch(function (err) {
        console.log('创建会话失败2');
      });
    },

    // 更新状态
    refreshState: function refreshState(state) {
      Object(__WEBPACK_IMPORTED_MODULE_39_common_js_HttpRequest_updateConsultationState__["a" /* default */])({
        consultationIds: this.orderSourceId,
        consultationState: state //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          console.log("状态更新成功" + state);
        } else {
          console.log("状态更新失败" + data);
        }
      });
    },

    //获取剩余时间/次数
    getLastTime: function getLastTime() {
      var _this15 = this;

      Object(__WEBPACK_IMPORTED_MODULE_35_common_js_HttpRequest_getConsultationLastTime__["a" /* default */])({
        caseId: this.caseId,
        consultationType: 0
      }).then(function (param) {
        if (param.responseObject.responseStatus) {
          var dataList = param.responseObject.responseData.dataList;

          _this15.cId = dataList.customerId || 0;

          _this15.setConsultation(dataList.consultationId);
          _this15.setconsultationState(dataList.consultationState);

          switch (dataList.consultationState) {//	工单状态会诊状态-1-待就诊0-沟通中1-已结束2-被退回3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复12-待审核13-审核未通过
            case 1:
            case 7:
            case 8:
              _this15.inputBoxShow = false;
              break;
            case -1:
            case 0:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
              _this15.inputBoxShow = true;
              break;
          }
          _this15.triageType = Number(dataList.triageType);
        }
      }).catch(function (err) {
        console.log(err);
      });
    },
    showToast: function showToast(content) {
      wx.showToast({
        title: content,
        icon: "none",
        duration: 2000
      });
    },
    connectToNim: function connectToNim() {
      var _this16 = this;

      var that = this;
      //获取IM Token/appKey
      console.log("fffff");
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_nimEnv_nimEnv__["a" /* default */])("test").then(function (nimEnv) {
        console.log(nimEnv);
        console.log(_this16.userData);
        _this16.loading = true;
        _this16.nim = __WEBPACK_IMPORTED_MODULE_11_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default.a.getInstance({
          debug: false,
          appKey: nimEnv,
          account: _this16.userData.account,
          token: _this16.userData.token,
          reconnectionAttempts: 0,
          onconnect: function onconnect(data) {
            _this16.loading = false;
            console.log("连接成功");
            _this16.connectNum += 1;

            // if (!this.connectFlag) {
            _this16.triageDoctorAssign();
            // }
            imBaseMethods = new __WEBPACK_IMPORTED_MODULE_8_common_js_imBaseMethods_imBusinessMethods__["a" /* default */](_this16.nim);
            // this.nim.getClientAntispamLexicon({
            //   done: (error,file) => {
            //     console.log('获取词库完成');
            //     console.log(error);
            //     console.log(file);
            //   }
            // })
            // this.checkHasSendedMedicalReport();
          },
          // 同步登录用户名片的回调, 会传入用户名片
          onmyinfo: function onmyinfo(info) {
            console.log(info);
          },
          onwillreconnect: function onwillreconnect(obj) {
            console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
          },
          ondisconnect: function ondisconnect(error) {
            console.warn("链接已中断...即将重新连接,连接中断的原因");
            console.log(error);
          },

          onupdatesession: function onupdatesession(obj) {
            console.log('更新会话');
            console.log(obj);
            // 同步服务端发送的消息
            if (obj.to == that.targetData.account && obj.lastMsg.fromClientType == 'Server') {
              that.onUpdateSession(obj.lastMsg);
            }
          },
          onroamingmsgs: function onroamingmsgs(obj) {
            console.log("漫游消息...");
            console.log(obj);
            // 歪门邪道，切不敢学习。
            if (obj.to == that.targetData.account) {
              // roamingMsgs = obj.msgs.reverse();
              // if (roamingMsgs.length < 100) {
              //   this.allMsgsGot = true;
              // } else {
              //   this.allMsgsGot = false;
              // }
              // that.sendSuggestDoctor(); // 是否发送重新推荐
              // that.showInit(); // 检查是否需要发送
              that.onRoamingMsgs(obj.msgs.reverse()); // 漫游消息处理；
            }
          },
          onofflinemsgs: function onofflinemsgs(obj) {
            console.log("离线消息...");
            // console.log(obj);
            var msgs = obj.msgs;
            msgs.forEach(function (element, index) {
              if (index == msgs.length - 1) {
                that.historyBeginTime = element.time;
              }
              if (element.type === "custom" && !element.content.type) {
                element.content = JSON.parse(element.content);
              }
              element.timeStamp = that.transformTimeStamp(element.time);
              that.hideInput(element); // 检查是否需要隐藏输入框 ；
            });
            console.log(msgs);
            that.msgList = that.nim.mergeMsgs(that.msgList, msgs);
          },

          onmsg: function onmsg(msg) {
            console.log('收到消息');
            console.log(msg);
            _this16.renderReceiveMessage(msg);
          }
        });
      }).catch(function (err) {
        console.log(err);
      });
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
        url: '/packageD/healthCard/healthCardRecognition?from=imScene'
      });
    },

    // 更新会话消息处理
    onUpdateSession: function onUpdateSession(msg) {
      // 开发中发现结束消息第一次会出来两条，因为会同时触发更新会话和收到消息
      if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) return;
      msg.timeStamp = this.transformTimeStamp(msg.time); // 给元素添加时间显示属性；
      if (msg.type === "custom") {
        if (!msg.content.type) {
          msg.content = JSON.parse(msg.content);
        }
        // 开发中发现结束消息第一次会出来两条，因为会同时触发更新会话和收到消息
        if (msg.content.type === 'notification' && msg.content.data.actionType == 5) {
          this.inputBoxShow = false; //输入框取消
          this.setconsultationState(8);
          return;
        }
        if (!msg.time) {
          this.timeStampShowList.push(0);
        }
        if (Math.abs(msg.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
          if (msg.type === "custom" && msg.content.type) {
            if (msg.content.type.includes("new-") || msg.content.type === 'reviewCaseFail' || msg.content.type === "payFinishTips" || msg.content.type === "triagePatientTips" || msg.content.type === "reTriageTip" || msg.content.type === "refusePatient" || msg.content.type === "overtimeTip" || msg.content.type === "chatOvertimeTip" || msg.content.type === 'notification' && msg.content.data.actionType == 3) {
              this.timeStampShowList.push(0);
            } else {
              this.beginTimestamp = msg.time;
              this.timeStampShowList.push(1);
            }
            if (msg.content.type === 'medicalReport') {
              this.allMsgsGot = true;
            }
          } else {
            this.beginTimestamp = msg.time;
            this.timeStampShowList.push(1);
          }
        } else {
          this.timeStampShowList.push(0);
        }
      }
      this.historyBeginTime = msg.time;
      this.msgList.push(msg);
    },

    // 漫游消息处理；
    onRoamingMsgs: function onRoamingMsgs(msgs) {
      // 处理医生接诊，返回不隐藏输入框
      var msg = msgs[0];
      if (msg.type === "custom" && !msg.content.type) {
        msg.content = JSON.parse(msg.content);
      }
      if (!!msg.content) {
        // msg.content = JSON.parse(msg.content);
        if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) {
          this.inputBoxShow = false;
        }
      } // 处理完成

      // 截取漫游消息最后二十条，页面展示
      // this.buildRenderMsg('history', roamingMsgs.splice(0, 20));
    },

    // 处理是否要发送消息（发送视诊、检查检验等）
    showInit: function showInit() {
      var _this17 = this;

      if (!!__WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].getItem('triageTips')) {
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            cType: "0",
            cId: this.cId,
            mType: "39",
            conId: this.orderSourceId
          }),
          content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            type: "triageSendTips",
            data: {
              actionType: __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].getItem('triageTips').triageType
            }
          })
        }).then(function (msg) {
          _this17.sendMessageSuccess(msg);
        }).catch(function (err, msg) {
          _this17.sendFail(err, msg);
        }).finally(function () {
          __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem('triageTips');
        });
      } else if (!!__WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].getItem('checkSuggestTips')) {
        this.updateMedical();
        // 如果会话消息不是结束，则更新状态；
        if (this.consultationState != 7 && this.consultationState != 1 && this.consultationState != 8) {
          this.refreshState(6);
        }
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            cType: "0",
            cId: this.cId,
            mType: "40",
            conId: this.orderSourceId
          }),
          content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            type: "checkSuggestSendTips",
            data: {
              actionType: __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].getItem('checkSuggestTips').queryType
            }
          })
        }).then(function (msg) {
          _this17.sendMessageSuccess(msg);
        }).catch(function (err, msg) {
          _this17.sendFail(err, msg);
        }).finally(function () {
          __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem('checkSuggestTips');
        });
      }
    },
    renderReceiveMessage: function renderReceiveMessage(msg) {
      var _this18 = this;

      if (msg.from === this.targetData.account) {
        console.log("收到回复消息：" + __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()(msg));
        if (msg.type === "custom") {
          msg.content = JSON.parse(msg.content);
        }
        this.getCId(msg); //每次收到消息更新cId(分诊台医生id);
        this.hideInput(msg); // 患者端收到拒绝咨询隐藏输入框或者分诊完成；
        this.msgList.push(msg);

        if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
          var idClient = msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient || msg.content.data.imMessage && msg.content.data.imMessage.idClient || msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId;
          this.msgList.forEach(function (element, index) {
            if (element.idClient === idClient) {
              _this18.msgList.removeByValue(element);
              if (element.custom.mType == 1) {
                _this18.imageList.removeByValue(element.file.url);
              }
              return;
            }
          });
        }
        this.getTimeStampShowList(msg);

        this.imageCompressByNim(msg);

        if (msg.type === "image") {
          setTimeout(function () {
            _this18.scrollToBottom(1000);
          }, 200);
        } else {
          this.scrollToBottom(500);
        }
      }
    },

    //每次收到消息更新cId(分诊台医生id);
    getCId: function getCId(msg) {
      var that = this;
      console.log(!!msg.custom);
      if (!!msg.custom) {
        that.cId = parseInt(JSON.parse(msg.custom).cId);
      }
    },

    // 患者端收到拒绝咨询隐藏输入框
    hideInput: function hideInput(msg) {
      console.log('验证');
      console.log(msg);
      if (msg.type === "custom" && msg.content && msg.content.type === "refusePatient") {
        this.inputBoxShow = false; //输入框取消
        this.setconsultationState(7);
      }
      if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) {
        this.inputBoxShow = false; //输入框取消
        this.setconsultationState(8);
      }
      // 收到审核通过的信息隐藏输入框
      if (msg.type === "custom" && msg.content && msg.content.type === "reviewCaseSuccess") {
        this.inputBoxShow = false; //输入框取消
      }
    },

    //接收图片利用云信SDK作预览压缩
    imageCompressByNim: function imageCompressByNim(msg) {
      //云信图片压缩
      if (msg.type === "image") {
        this.imageList.push(msg.file.url);
      }
    },

    //聊天记录时间戳处理
    transformTimeStamp: function transformTimeStamp(time) {
      return imBaseMethods.transformTimeStamp(time);
    },

    // 获取患者的基本信息
    getPatientBase: function getPatientBase() {
      var _this19 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_36_common_js_HttpRequest_getPatientBase__["a" /* default */])({
        patientId: this.patientId
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          _this19.setPatientName(dataList[0].patientName);

          _this19.setPatientInfo({
            patientName: dataList[0].patientName,
            patientId: _this19.patientId,
            age: dataList[0].patientAge,
            sexName: dataList[0].patientSex == 1 ? "男" : "女",
            idcardStatus: dataList[0].idcardStatus === "0" ? false : true,
            certificateCode: dataList[0].certificateCode,
            mobile: dataList[0].mobile
          });

          if (dataList && dataList.length !== 0) {
            _this19.setLogoUrl({
              age: dataList[0].patientAge,
              sexName: dataList[0].patientSex == 1 ? "男" : "女"
            });
            var userData = {
              nick: dataList[0].patientName,
              avatar: _this19.logoUrl,
              sign: "newSign",
              gender: dataList[0].patientSex === "1" ? "male" : "female",
              email: "",
              birth: "",
              tel: ""
            };
            // this.nim.updateMyInfo(userData);
            _this19.userData = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()(_this19.userData, userData);
            console.log(_this19.targetMsg);
            __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].setItem("patientInfo", __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()(_this19.patientInfo));
          }
        }
      });
    },

    // 获取医生姓名、头像
    getDoctorMsg: function getDoctorMsg() {
      var _this20 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_37_common_js_HttpRequest_getDoctorBaseMsg__["a" /* default */])({
        doctorCustomerId: this.doctorCustomerId,
        logoUseFlag: 5
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList[0];
          _this20.setDoctorBaseMsg(dataList);
          wx.setNavigationBarTitle({
            title: dataList.customerName + "\u533B\u751F\u533B\u52A9"
          });
          _this20.titleName = dataList.customerName + "\u533B\u751F";
        }
      });
    },
    buildRenderMsg: function buildRenderMsg(type, msgs) {
      var _this21 = this;

      var _timeStampShowList = [];
      if (type == 'history') {
        this.msgList = [];
        this.beginTimestamp = 0;
      }
      msgs.forEach(function (element, index) {
        if (index == msgs.length - 1) {
          _this21.historyBeginTime = element.time;
        }
        if (element.type === "custom" && !element.content.type) {
          element.content = JSON.parse(element.content);
        }
        element.timeStamp = _this21.transformTimeStamp(element.time);
        _this21.msgList.unshift(element);

        if (element.type === "custom" && element.content.type === "deleteMsgTips") {

          var idClient = element.content.data.deleteMsg && element.content.data.deleteMsg.idClient || element.content.data.imMessage && element.content.data.imMessage.idClient || element.content.data.deleteMsg && element.content.data.deleteMsg.messageId;
          if (element.idClient === idClient) {
            _this21.msgList.removeByValue(element);
            return;
          }
        }
      });
      this.msgList.forEach(function (element, index) {
        if (!element.time) {
          _timeStampShowList.push(0);
          return;
        }
        if (Math.abs(element.time - _this21.beginTimestamp) / (5 * 60 * 1000) > 1) {
          if (element.type === "custom" && element.content.type) {
            if (element.content.type.includes("new-") || element.content.type === 'reviewCaseFail' || element.content.type === "payFinishTips" || element.content.type === "triagePatientTips" || element.content.type === "reTriageTip" || element.content.type === "refusePatient" || element.content.type === "overtimeTip" || element.content.type === "chatOvertimeTip" || element.content.type === 'notification' && element.content.data.actionType == 3) {
              _timeStampShowList.push(0);
              return;
            } else {
              _this21.beginTimestamp = element.time;
              _timeStampShowList.push(1);
            }
          } else {
            _this21.beginTimestamp = element.time;
            _timeStampShowList.push(1);
          }
        } else {
          _timeStampShowList.push(0);
        }
      });
      this.timeStampShowList = _timeStampShowList;
      this.getImageList();
      if (type !== "scrollInit") {
        setTimeout(function () {
          _this21.scrollToBottom(1000);
        }, 0);
      } else {
        // setTimeout(() => {
        this.pulling = false;
        // }, 800)
      }
      // this.pushHealthCard();   // 健康卡提示
    },

    // 判断是否需要发送推荐医生
    sendSuggestDoctor: function sendSuggestDoctor() {
      var _this22 = this;

      var doctorName = __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].getItem("doctor");
      if (!!doctorName) {
        var msg = this.msgList[this.msgList.length - 1];
        if (msg && msg.custom && JSON.parse(msg.custom).mType == '47') {
          __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem("doctor");
          return;
        }
        console.log(msg);
        imBaseMethods.sendMessage({
          target: this.targetData.account,
          sendContent: doctorName + "\u62D2\u7EDD\u4E86\u6211\u7684\u54A8\u8BE2\uFF0C\u8BF7\u91CD\u65B0\u4E3A\u6211\u5339\u914D\u5BF9\u75C7\u533B\u751F",
          custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
            cType: "0",
            cId: this.cId,
            mType: "47",
            conId: this.orderSourceId
          })
        }).then(function (obj) {
          _this22.sendMessageSuccess(obj);
          __WEBPACK_IMPORTED_MODULE_9_localStorage__["a" /* default */].removeItem("doctor");
        }).catch(function (err, obj) {
          _this22.sendFail(err, obj);
        });
      }
    },

    //聊天记录时间处理压入是0还是1
    getTimeStampShowList: function getTimeStampShowList(element) {
      if (!element.time) {
        this.timeStampShowList.push(0);
        return;
      }
      if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
        if (element.type === "custom") {
          if (element.content.type.includes("new-") || element.content.type === 'reviewCaseFail' || element.content.type === "payFinishTips" || element.content.type === "triagePatientTips" || element.content.type === "reTriageTip" || element.content.type === "refusePatient" || element.content.type === "overtimeTip" || element.content.type === "chatOvertimeTip" || element.content.type === 'notification' && element.content.data.actionType == 3) {
            this.timeStampShowList.push(0);
            return;
          } else {
            this.beginTimestamp = element.time;
            this.timeStampShowList.push(1);
          }
        } else {
          this.beginTimestamp = element.time;
          this.timeStampShowList.push(1);
        }
      } else {
        this.timeStampShowList.push(0);
      }
    },

    //长按事件响应
    longTouchEmitHandler: function longTouchEmitHandler(index) {
      if (this.toolbarConfig.delete) {
        this.deleteMsgIndex = index;
      }
    },

    //消息撤回
    deleteMsgEvent: function deleteMsgEvent(msg) {
      var _this23 = this;

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
        msg: msg,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
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
            deleteMsg: msg || {}
          }
        }),
        deleteFailCallback: function deleteFailCallback(err) {
          _this23.showToast("\u60A8\u53EA\u80FD\u64A4\u56DE" + _DeleteTimeLimit + "\u5185\u7684\u6D88\u606F");
        },
        deleteSuccessCallback: function deleteSuccessCallback(dMsg) {

          if (JSON.parse(msg.custom).mType == 1) {
            var _imageUrl = msg.file.url;
            _this23.imageList.forEach(function (element, index) {
              if (element === _imageUrl) {
                _this23.imageList.removeByValue(element);
                return;
              }
            });
          }
          _this23.sendMessageSuccess(dMsg);
          console.log("\u64A4\u56DE\u6D88\u606F\u63D0\u793A--\u53D1\u9001\u6210\u529F");
        }
      });
    },

    // 获取页面图片消息存到数组里
    getImageList: function getImageList() {
      var _this24 = this;

      this.$nextTick(function () {
        if (_this24.$refs.bigImg) {
          _this24.$refs.bigImg.forEach(function (element, index) {
            if (_this24.imageList.indexOf(element.imageMessage.file.url) == -1) {
              _this24.imageList.push(element.imageMessage.file.url);
            }
          });
        }
      });
    },

    // 滑动到底部
    scrollToBottom: function scrollToBottom() {
      var _this25 = this;

      var delayTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

      console.log('触发了滑到底部');
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

    //滑动到某个元素
    scrollElement: function scrollElement(distance) {
      console.log("position" + distance);
    },

    //更新上传了检查检验
    updateMedical: function updateMedical() {
      Object(__WEBPACK_IMPORTED_MODULE_40_common_js_HttpRequest_updateMedicalReport__["a" /* default */])({
        caseId: this.caseId,
        state: 1
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          console.log("更新上传了检查检验");
        }
      });
    },

    //发送咨询结束或者开始消息--4开始、5结束
    sendConsultState: function sendConsultState(num) {
      var _this26 = this;

      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.cId,
          mType: "24",
          conId: this.orderSourceId
        }),
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "notification",
          data: {
            actionType: num
          }
        })
      }).then(function (msg) {
        _this26.sendMessageSuccess(msg);
      }).catch(function (err, msg) {
        _this26.sendFail(err, msg);
      });
    },

    // checkHasSendedMedicalReport() {
    //   //检测从未发送过...
    //   imBaseMethods.getMessageList({
    //     beginTime: 0,
    //     endTime: 0,
    //     target: this.targetData.account,
    //     limit: 5,
    //     reverse: true,
    //   }).then(obj => {
    //     const msgList = obj.msgs;
    //     let _flag = false;
    //     for (let i in msgList) {
    //       let _ele = msgList[i];
    //       if (_ele.type === "custom" && _ele.content && JSON.parse(_ele.content).type === 'medicalReport') {
    //         _flag = false;
    //         return false;
    //       } else {
    //         _flag = true;
    //       }
    //     }
    //     if (_flag) this.getMedicalMessage();
    //     this.allMsgsGot = true;
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    //获取患者咨询单
    getMedicalMessage: function getMedicalMessage() {
      var _this27 = this;

      Object(__WEBPACK_IMPORTED_MODULE_30_common_js_HttpRequest_getMedicalReportDetails__["a" /* default */])({
        caseId: this.caseId
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          if (dataList && dataList.length !== 0) {
            if (!_this27.isFindDoctor) {
              _this27.sendDataList = dataList[0];
            }
            _this27.sendMedicalReport(dataList[0]);
          }
        }
      });
    },

    //发送咨询单
    sendMedicalReport: function sendMedicalReport(param) {
      var _this28 = this;

      console.log(imBaseMethods.sendCustomMessage);
      imBaseMethods.sendCustomMessage({
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.cId,
          mType: "27",
          conId: this.orderSourceId
        }),
        isPushable: false,
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
            caseUrl: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].httpEnv() + "/pages/app_native/reservation_list.html?caseId=" + this.caseId + "&isOrder=0"
          },
          type: "medicalReport" //自定义类型 咨询单
        })
      }).then(function (msg) {
        _this28.mainCase = param.patientCasemap.caseMain.caseMain;
        console.log('发送咨询单成功');
        _this28.sendMessageSuccess(msg);
        _this28.historyBeginTime = msg.time; // 设置分页开始时间
        if (_this28.isFindDoctor) {
          _this28.tipNewPatient(param);
        }

        _this28.allMsgsGot = true;
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 提示信息 分诊台刷新患者 */
    tipNewPatient: function tipNewPatient(data) {
      var _this29 = this;

      imBaseMethods.sendCustomMessage({
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.cId,
          mType: "32",
          conId: this.orderSourceId
        }),
        to: this.targetData.account,
        content: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          type: "new-health",
          data: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()({}, data.data, {
            patientId: this.patientId,
            consultationid: this.orderSourceId
          })
        })
      }).then(function (msg) {
        _this29.sendMessageSuccess(msg);
        console.log("新用户提醒发送...");
      });
    },
    selectVideo: function selectVideo() {
      var that = this;
      that.destroyIM = false;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function success(res) {
          console.log('选择视频成功');
          console.log(res);
          if (res.size >= 104857600) {
            console.log('视频太大');
            that.showToast("视频最大为100M");
            return;
          }
          if (/mp4$/.test(res.tempFilePath) || /mov$/.test(res.tempFilePath) || /quicktime$/.test(res.tempFilePath)) {
            that.sendVideo(res.tempFilePath);
          } else {
            that.showToast("请选择mp4或mov文件");
          }
        },
        fail: function fail(err) {
          that.destroyIM = true;
          console.log('选择视频失败');
          console.log(err);
          if (err.errMsg == "chooseVideo:fail DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed") {
            that.showToast("视频尝试打开失败");
          }
        }
      });
    },
    sendVideo: function sendVideo(file) {
      var _this30 = this;

      console.log('我要发送视频');
      var that = this;
      that.loading = true;
      console.log(file);
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt3'
      });
      imBaseMethods.sendVideoMessage({
        file: file,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.doctorCustomerId,
          mType: "3",
          conId: this.orderSourceId
        }),
        isPushable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005<" + (this.patientName ? this.patientName : "") + ">\u5411\u60A8\u53D1\u9001\u4E86\u4E00\u6761\u89C6\u9891\uFF0C\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        progressCallback: function progressCallback(obj) {
          console.log(obj);
        },
        sendSuccessCallback: function sendSuccessCallback(msg) {
          console.log('视频发送成功');
          console.log(msg);
          console.log(that.msgList);
          that.loading = false;
          that.msgList.push(msg);
          that.destroyIM = true;
          that.$nextTick(function () {
            _this30.scrollToBottom();
          });
        }
      });
    },
    selectImage: function selectImage() {
      var _this31 = this;

      this.destroyIM = false;
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function success(res) {
          console.log(res);
          var tempFiles = res.tempFiles;
          if (tempFiles.length > 1) {
            _this31.sendMulitpleImage(tempFiles);
          } else {
            _this31.sendImage(tempFiles[0]);
          }
        },
        fail: function fail(err) {
          _this31.destroyIM = true;
        }
      });
    },

    // 发送多图
    sendMulitpleImage: function sendMulitpleImage(tempFiles) {
      var _this32 = this;

      this.loading = true;
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt38'
      });
      imBaseMethods.sendMulitpleImage({
        list: tempFiles,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.doctorCustomerId,
          mType: "38",
          conId: this.orderSourceId
        }),
        isPushable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005<" + (this.patientName ? this.patientName : "") + ">\u5411\u60A8\u53D1\u9001\u4E86\u4E00\u6761\u56FE\u96C6\uFF0C\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        sendSuccessCallback: function sendSuccessCallback(msg) {
          _this32.loading = false;
          _this32.destroyIM = true;
          msg.content = JSON.parse(msg.content);
          _this32.msgList.push(msg);
          _this32.$nextTick(function () {
            _this32.scrollToBottom();
          });
        }
      });
    },

    // 发送单图
    sendImage: function sendImage(file) {
      var _this33 = this;

      this.loading = true;
      this.disabled = true;
      console.log('发送图片');
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14202,
        keyword: 'mt1'
      });
      imBaseMethods.sendImageMessage({
        file: file,
        to: this.targetData.account,
        custom: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          cType: "0",
          cId: this.doctorCustomerId,
          mType: "1",
          conId: this.orderSourceId
        }),
        isPushable: true,
        needPushNick: false,
        pushContent: "\u60A3\u8005<" + (this.patientName ? this.patientName : "") + ">\u5411\u60A8\u53D1\u9001\u4E86\u4E00\u5F20\u56FE\u7247\uFF0C\u70B9\u51FB\u67E5\u770B\u8BE6\u60C5",
        pushPayload: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_json_stringify___default()({
          account: "0_" + this.caseId,
          type: "1"
        }),
        progressCallback: function progressCallback(obj) {},
        sendSuccessCallback: function sendSuccessCallback(msg) {
          console.log(msg);
          _this33.destroyIM = true;
          _this33.msgList.push(msg);
          _this33.imageList.push(msg.file.url);
          _this33.loading = false;
          setTimeout(function () {
            _this33.scrollToBottom(1000);
            setTimeout(function () {
              _this33.disabled = false;
            }, 1000);
          }, 200);
        }
      });
    },

    //发送反垃圾提示语
    sendAntiSpamTips: function sendAntiSpamTips() {
      var _this34 = this;

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
        _this34.sendMessageSuccess(msg);
      }).catch(function (err) {
        console.log(err);
      });
    },
    getMessageList: function getMessageList(type) {
      var _this35 = this;

      //获取历史消息
      imBaseMethods.getMessageList({
        beginTime: 0,
        // endTime: this.historyBeginTime,
        target: this.targetData.account,
        limit: 100
      }).then(function (obj) {
        console.log('-------------------');
        console.log(obj);
        if (obj.msgs.length < 100) {
          _this35.allMsgsGot = true;
        } else {
          _this35.allMsgsGot = false;
        }
        // 为了兼容老数据
        if (obj.msgs.length > 1) {
          roamingMsgs = obj.msgs;
          _this35.buildRenderMsg('history', roamingMsgs.splice(0, 20));
        }
        _this35.sendSuggestDoctor(); // 是否发送重新推荐
        _this35.showInit(); // 检查是否需要发送
      });
    },
    formSubmitName: function formSubmitName(e) {
      Object(__WEBPACK_IMPORTED_MODULE_38_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    }
  }),
  components: {
    MedicalReport: __WEBPACK_IMPORTED_MODULE_16__components_medicalReport__["a" /* default */],
    ContentText: __WEBPACK_IMPORTED_MODULE_13__components_content__["a" /* default */],
    ImageContent: __WEBPACK_IMPORTED_MODULE_14__components_image__["a" /* default */],
    MiddleTips: __WEBPACK_IMPORTED_MODULE_15__components_middleTips__["a" /* default */],
    VideoMessage: __WEBPACK_IMPORTED_MODULE_22__components_video__["a" /* default */],
    MulitpleImage: __WEBPACK_IMPORTED_MODULE_23__components_mulitpleImage__["a" /* default */],
    ensure: __WEBPACK_IMPORTED_MODULE_28_components_ensure__["a" /* default */],
    Suggestion: __WEBPACK_IMPORTED_MODULE_25_components_suggestion__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_26_components_backIndex__["a" /* default */],
    PreviewSuggestion: __WEBPACK_IMPORTED_MODULE_17__components_previewSuggestion__["a" /* default */], // 初诊建议组件
    CheckSuggest: __WEBPACK_IMPORTED_MODULE_18__components_checkSuggest__["a" /* default */], // 检查检验组件
    reviewCaseSuccess: __WEBPACK_IMPORTED_MODULE_19__components_reviewCaseSuccess__["a" /* default */], // 审核通过消息组件
    reviewCaseFail: __WEBPACK_IMPORTED_MODULE_20__components_reviewCaseFail__["a" /* default */], // 审核不通过消息组件
    Triage: __WEBPACK_IMPORTED_MODULE_21__components_triage__["a" /* default */],
    FileMessage: __WEBPACK_IMPORTED_MODULE_24__components_fileMessage__["a" /* default */],
    Toast: __WEBPACK_IMPORTED_MODULE_3_components_toast__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_4_components_loading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_5_components_confirm__["a" /* default */],
    blackList: __WEBPACK_IMPORTED_MODULE_27_components_BlackList__["a" /* default */]
  }
});

/***/ }),

/***/ 623:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_content_vue__ = __webpack_require__(625);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_59645c6b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_content_vue__ = __webpack_require__(626);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(624)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_59645c6b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_content_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/content.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] content.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-59645c6b", Component.options)
  } else {
    hotAPI.reload("data-v-59645c6b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 624:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 625:
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/17.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      showDeleteMsg: false
    };
  },
  mounted: function mounted() {},

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', "isFindDoctor"]), mapGetters(['targetLogo'])),
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
    }
  }
});

/***/ }),

/***/ 626:
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
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2) : _vm._e(), _vm._v(" "), _c('i', {
    staticClass: "fail-button",
    staticStyle: {
      "display": "none"
    }
  }), _vm._v(" "), _c('figcaption', {
    staticClass: "main-message-content"
  }, [_c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '2'
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
  }, [_vm._v("撤回")]) : _vm._e()]), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.contentMessage.text))])], 1), _vm._v(" "), (_vm.contentMessage.from === _vm.userData.account) ? _c('figure', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-59645c6b", esExports)
  }
}

/***/ }),

/***/ 627:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_image_vue__ = __webpack_require__(629);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_83c18266_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_image_vue__ = __webpack_require__(630);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(628)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_83c18266_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_image_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/image.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] image.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-83c18266", Component.options)
  } else {
    hotAPI.reload("data-v-83c18266", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 628:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 629:
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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
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
}, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "computed", __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', 'isFindDoctor']), mapGetters(['targetLogo']))), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_data$computed$comput, "mounted", function mounted() {

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

/***/ 630:
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
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2) : _vm._e(), _vm._v(" "), _c('i', {
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
  }, [_c('p', [_vm._v(_vm._s(_vm.progress.progress))])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.currentIndex === _vm.deleteMsgIndex && _vm.showDeleteMsg && _vm.imageMessage.from === _vm.userData.account) ? _c('span', {
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
  }, [_vm._v("撤回")]) : _vm._e(), _vm._v(" "), _c('figure', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-83c18266", esExports)
  }
}

/***/ }),

/***/ 631:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_middleTips_vue__ = __webpack_require__(633);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ee2bb2a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_middleTips_vue__ = __webpack_require__(634);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(632)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ee2bb2a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_middleTips_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/middleTips.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] middleTips.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ee2bb2a", Component.options)
  } else {
    hotAPI.reload("data-v-2ee2bb2a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 632:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 633:
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/7/5.
 */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      doctorName: ''
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['doctorBaseMsg']), {
    logoUrl: function logoUrl() {
      return this.$store.state.logoUrl;
    }
  }),
  mounted: function mounted() {
    if (this.tipsType == 5) {
      this.doctorName = JSON.parse(this.msg.custom).docName;
    }
  },

  methods: {},
  props: {
    tipsType: {
      type: Number
    },
    tipsText: {
      type: String
    },
    msg: {
      type: Object
    }
  }
});

/***/ }),

/***/ 634:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "main-message-box grey-tips"
  }, [_c('figcaption', {
    staticClass: "first-message"
  }, [(_vm.tipsType == 4) ? _c('p', [_vm._v("您已重新购买分诊医生的咨询，可重新提问")]) : (_vm.tipsType == 5) ? _c('p', [_vm._v("系统提示：分诊为您推荐的「 " + _vm._s(_vm.doctorName) + " 」医生已经接诊，请尽快与医生沟通")]) : (_vm.tipsType == 6) ? _c('p', [_vm._v(_vm._s(_vm.tipsText))]) : (_vm.tipsType == 7) ? _c('p', [_vm._v("系统提示：医生助理的服务已经结束啦，点击上方卡片，与医生沟通详细病情")]) : _vm._e()], 1)], 1), _vm._v(" "), (_vm.tipsType != 4 && _vm.tipsType != 5 && _vm.tipsType != 7) ? _c('p', {
    staticClass: "receive-treatment"
  }, [_c('span', [_vm._v("咨询已结束")])]) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2ee2bb2a", esExports)
  }
}

/***/ }),

/***/ 635:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_medicalReport_vue__ = __webpack_require__(637);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_23f21197_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReport_vue__ = __webpack_require__(642);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(636)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_23f21197_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReport_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/medicalReport.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] medicalReport.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-23f21197", Component.options)
  } else {
    hotAPI.reload("data-v-23f21197", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 636:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 637:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__previewSuggestionAuto__ = __webpack_require__(638);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getMedicalReportMainCase__ = __webpack_require__(176);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_dataLog__ = __webpack_require__(7);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 // 系统建议组件




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      timeSlot: false, // 咨询单底部提示话术控制
      mainCase: "",
      doctorList: []
    };
  },

  components: {
    previewSuggestionAuto: __WEBPACK_IMPORTED_MODULE_1__previewSuggestionAuto__["a" /* default */]
  },
  mounted: function mounted() {
    this.doctorList = [];
    this.getTimeSlot();
    // this.$emit("medicalReportLoad",this.medicalReportMessage.data);

    if (!this.medicalReportMessage.data.diagnoseConTent && !this.medicalReportMessage.data.diagnoseContent) {
      this.getCaseMain();
    } else {
      this.mainCase = this.medicalReportMessage.data.diagnoseConTent || this.medicalReportMessage.data.diagnoseContent;
    }
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['patientInfo', 'isFindDoctor', 'doctorBaseMsg']), {
    formatName: function formatName() {
      if (this.patientInfo.patientName.length > 6) {
        return this.patientInfo.patientName.substring(0, 6) + "...";
      } else {
        return this.patientInfo.patientName;
      }
    },

    //  比较两个时间this.medicalReportMessage.data
    timeCompare: function timeCompare() {
      console.log(this.medicalReportMessage.data.time > '2019-07-09');
      return this.medicalReportMessage.data.time > '2019-07-09';
    }
  }),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setIsFindDoctor']), {
    getDoctorList: function getDoctorList(data) {
      this.doctorList = data;
    },

    //改变分诊转态
    changeTriageType: function changeTriageType() {
      __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].createTrack({
        actionId: 14266,
        pushMessageId: this.doctorList
      });
      this.$emit('changeType', '');
    },
    getCaseMain: function getCaseMain() {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getMedicalReportMainCase__["a" /* default */])({
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
    triageType: {
      type: Number
    },
    patientId: {
      type: Number
    }
  }
});

/***/ }),

/***/ 638:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_previewSuggestionAuto_vue__ = __webpack_require__(640);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_565c5d2d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_previewSuggestionAuto_vue__ = __webpack_require__(641);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(639)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-565c5d2d"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_previewSuggestionAuto_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_565c5d2d_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_previewSuggestionAuto_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/previewSuggestionAuto.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] previewSuggestionAuto.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-565c5d2d", Component.options)
  } else {
    hotAPI.reload("data-v-565c5d2d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 639:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_doctorHome_getConsultStatus__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getBaseMessage__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getHasInvitedConsult__ = __webpack_require__(89);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by lichenyang on 2017/8/18.
 */





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;


/**************************Axios Http Requests*************************/

 //医生基本信息 api
 //是否邀请过


var XHRList = {
  getCheckSuggestion: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/case/diagnosis/v1/getMapList/", //预览初诊建议
  getRecommedDoctor: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/tocure/recommend/customer/getRecommendCustomercList/", //推荐医生
  // getRecommedDoctor: api.httpEnv() + "/mcall/patient/recommend/v1/getMapList/",//推荐医生
  getToken: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/im/interact/v1/refreshToken/",
  getCurrentByCustomerId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/advice/setting/v1/getCurrentByCustomerId/', //获取是否与专业医生建立过im
  queryIsValid: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/recommend/v1/getMapById/" // 查询该医生是否有效
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isClickInquiry: true,
      message: {},
      suggestResponse: false, //检查检验预览响应是否完成
      doctorResponse: false, //推荐医生预览是否完成
      currentIndex: -1, // 点击当前的医生
      //推荐医生的的数据
      doctorObj: {
        allData: [], //全部数据
        moreBoxShow: false, //展开更多盒子是否显示
        moreData: false, //显示展开更多还是显示收起按钮
        tempData: [], //展示的数组
        lessData: [], //五条建议的数据
        initNum: 3, //初始展示的数据条数
        pageNum: 5, //分页数据条数
        position: 0, //记录卡片的位置
        hasPosition: false //卡片的位置是否已经记录
      },
      hasCommunShow: false // confirm 框是否显示
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["orderDoctorId", 'caseType', "isFindDoctor", 'consultationId'])),
  mounted: function mounted() {
    this.initData();
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['addRenderSuggestionNum', 'setOrderDoctorId', 'setEnsureShow']), {
    goKnowledgeDetail: function goKnowledgeDetail(index) {
      this.$router.push({
        name: "knowledgeDetail",
        params: this.knowledgeObj.allData[index]
      });
    },
    initData: function initData() {
      this.getRecommedDoctor();
    },

    /** 邀请医生开诊 */
    inviteConsultFn: function inviteConsultFn(index) {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getHasInvitedConsult__["a" /* default */])({
        customerId: this.doctorObj.allData[this.currentIndex].customerId, //	string	是	医生id
        patientCustomerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId") || '', //string	是	患者所属用户id
        openid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("openId") || "", // string	是	渠道唯一id
        uuid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('unionId') || "" // string	是	联合id（用来关联其他平台）
      }).then(function (data) {
        _this.isClickInquiry = true;
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseMessage == "NO DATA") {
            //未邀请过
            wx.navigateTo({
              url: "/pages/doctorMain/inviteContent?from=imScene&doctorId=" + _this.doctorObj.allData[_this.currentIndex].customerId + "&fullName=" + _this.doctorObj.allData[_this.currentIndex].fullName
            });
          } else {
            //已邀请过
            wx.showToast({
              title: "您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。",
              icon: "none",
              duration: 2000
            });
          }
        } else {
          console.log('获取是否邀请过医生开诊失败');
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 获取推荐医生 */
    getRecommedDoctor: function getRecommedDoctor() {
      var that = this;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getRecommedDoctor,
        method: "POST",
        data: {
          caseId: this.caseId,
          patientId: this.patientId,
          bodyPartId: '1502698533928'
        },
        beforeSend: function beforeSend() {},
        done: function done(data) {
          if (data.responseObject.responseData.dataList) {
            that.doctorObj.allData = data.responseObject.responseData.dataList;
            console.log(data.responseObject.responseData.dataList);
            that.checkSuggestData('doctorObj');
          }
          that.doctorResponse = true;
          that.$nextTick(function () {
            that.checkResponse();
          });
          that.$emit('scrollToBottom', 500);
        },
        fail: function fail() {
          that.doctorResponse = true;
          that.$nextTick(function () {
            that.checkResponse();
          });
        }
      });
    },

    //检查响应是否都完成
    checkResponse: function checkResponse() {
      var that = this;
      if (that.suggestResponse && that.doctorResponse) {
        this.addRenderSuggestionNum();
      }
      //渲染完成后进行定位
      if (that.$store.state.previewSuggestionNum <= that.$store.state.renderSuggestionNum) {
        that.$nextTick(function () {
          if (that.$store.state.historyStatus === "history") {
            console.log('医生数据完成');
            if (!__WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getPara().suggest) {
              that.scrollToBottom();
            } else {
              var _eleArr = document.querySelectorAll(".doctor-main-box");
              var _ele = _eleArr[_eleArr.length - 1];
              console.log(_ele.parentElement.parentElement.offsetTop);
              that.scrollElement(_ele.parentElement.parentElement.offsetTop);
            }
          }
        });
      }
    },

    //检查检验数据
    checkSuggestData: function checkSuggestData(param) {
      var that = this;
      if (that[param].allData.length > that[param].initNum) {
        that[param].moreBoxShow = true;
        that[param].lessData = that[param].allData.slice(0, that[param].initNum);
        that[param].tempData = that[param].lessData;
        that[param].moreData = true;
      } else {
        that[param].moreBoxShow = false;
        that[param].tempData = that[param].allData;
      }
      var dataListStr = [];
      that[param].tempData.map(function (val, index) {
        dataListStr.push(val.customerId);
      });
      that.$emit('doctorList', dataListStr);
    },

    //展示更多
    moreDataShow: function moreDataShow(param, e) {
      var that = this;
      console.log(e);
      if (that[param].allData.length - that[param].tempData.length > that[param].pageNum) {
        that[param].tempData = that[param].allData.slice(0, that[param].pageNum + that[param].tempData.length);
      } else {
        that[param].moreData = false;
        that[param].tempData = that[param].allData;
      }
    },

    //去医生主页
    goDoctorHome: function goDoctorHome(index, item) {
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14174
      });
      // 针对于美年来源，直接进入医生主页
      if (this.caseType == '15') {
        this.queryConsult(index, item);
      } else {
        wx.navigateTo({
          url: "/pages/doctorMain/doctorMain?from=imScene&caseId=" + this.caseId + "&&doctorCustomerId=" + this.doctorObj.allData[index].customerId + "&patientId=" + this.patientId + "&orderSourceId=" + this.consultationId + "&caseType=" + this.caseType
        });
      }
    },

    // 查询是否可以咨询
    queryConsult: function queryConsult(index, opt) {
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14265,
        locationId: index
      });
      var that = this;
      that.isClickInquiry = false;
      that.currentIndex = index, __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.queryIsValid,
        method: "POST",
        data: {
          diagnosisId: that.message.diagnosisId,
          recommendId: that.doctorObj.allData[index].customerId,
          isValid: 1
        },
        done: function done(data) {
          var _this2 = this;

          console.log(data);
          if (data.responseObject && data.responseObject.responseMessage == 'NO DATA') {
            that.isClickInquiry = true;
            that.setEnsureShow(true);
          } else {
            Object(__WEBPACK_IMPORTED_MODULE_6_common_js_doctorHome_getConsultStatus__["a" /* default */])({
              customerId: that.doctorObj.allData[index].customerId,
              caseId: that.caseId,
              patientId: that.patientId,
              orderType: 1,
              orderSourceType: 0,
              sortType: 2
            }).then(function (data) {
              console.log(data);
              if (data.conState == 1) {
                //已存在咨询记录
                that.isClickInquiry = true;
                that.hasCommunShow = true;
              } else {
                // 判断如果是预约咨询，则请求预约咨询接口
                if (opt.adviceStatus == 0 || opt.customerReviseStatus != 8) {
                  that.inviteConsultFn();
                } else {
                  Object(__WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getBaseMessage__["a" /* default */])({
                    "customerId": that.doctorObj.allData[index].customerId,
                    "logoUseFlag": 3
                  }).then(function (res) {
                    if (res && res.responseData && res.responseData.dataList) {
                      var _baseInfoData = res.responseData.dataList[0];
                      if (_baseInfoData.authMap.state == 8) {
                        that.goConsult();
                      } else {
                        wx.navigateTo({
                          url: "/pages/doctorMain/doctorMain?from=imScene&caseId=" + _this2.caseId + "&&doctorCustomerId=" + _this2.doctorObj.allData[index].customerId + "&patientId=" + _this2.patientId + "&caseType=" + _this2.caseType
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },

    //咨询
    goConsult: function goConsult() {
      var that = this;
      this.setOrderDoctorId(that.doctorObj.allData[that.currentIndex].customerId);
      wx.navigateTo({
        url: "/packageA/imSceneAffirmOrder/imSceneAffirmOrder"
      });
      that.isClickInquiry = true;
    },

    // 去主诊医生IM
    goDoctorIm: function goDoctorIm() {
      this.hasCommunShow = false;
      wx.navigateTo({
        url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + this.caseId + "&doctorCustomerId=" + this.doctorObj.allData[this.currentIndex].customerId + "&patientId=" + this.patientId
      });
    },

    //收起
    lessDataShow: function lessDataShow(param, e) {
      var that = this;
      // document.body.scrollTop = that[param].position;
      that[param].moreData = true;
      that[param].hasPosition = false;
      that[param].tempData = that[param].lessData;
      // console.log($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      that.$nextTick(function () {
        // that.scrollElement($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      });
    },
    goToUpload: function goToUpload() {
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("upload");
      if (this.$store.state.consultationState == 7 || this.$store.state.consultationState == 1 || this.$store.state.consultationState == 8) {
        this.$store.commit("setToastTips", "分诊服务已结束");
        this.$store.commit('setToastShow');
      } else {
        this.$router.push({
          name: "UploadList",
          params: this.checkSuggestObj.allData
        });
      }
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
    previewSuggestionMessage: {
      type: Object
    },
    payPopupShow: {
      type: Boolean
    },
    scrollToBottom: {
      type: Function,
      default: null
    },
    scrollElement: {
      type: Function,
      default: null
    },
    caseId: {
      type: Number
    },
    patientId: {
      type: Number
    },
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag: function showFlag(newVal, oldVal) {
      if (newVal) {
        this.getRecommedDoctor(); // 当触发 onShow 的时候重新获取推荐医生信息
      }
    }
  },
  components: {
    confirm: __WEBPACK_IMPORTED_MODULE_3_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 641:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.doctorObj.allData.length) ? _c('section', {
    staticClass: "main-message-box doctor-main-box",
    attrs: {
      "data-alcode-mod": "716"
    }
  }, [_c('article', {
    staticClass: "doctor-box"
  }, [_c('header', {
    staticClass: "doctor-header"
  }, [_c('h3', {
    staticClass: "doctor-title"
  }, [_vm._v("根据病情为您推荐以下医生")]), _vm._v(" "), _c('p', {
    staticClass: "doctor-p"
  }, [_vm._v("点击卡片开始咨询")])], 1), _vm._v(" "), _c('section', {
    staticClass: "doctor-content"
  }, [_c('section', {
    staticClass: "doctor-list"
  }, _vm._l((_vm.doctorObj.tempData), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "main-inner-item",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.goDoctorHome(index, item)
        }
      }
    }, [_c('div', {
      staticClass: "main-inner-item-img"
    }, [_c('img', {
      staticClass: "dp",
      attrs: {
        "src": item.logoUrl
      }
    })]), _vm._v(" "), (item.jobDoctorYear > 5) ? _c('div', {
      staticClass: "ProMark"
    }, [_vm._v("\n              " + _vm._s(item.jobDoctorYear >= 10 ? '从医' + item.jobDoctorYear + '年' : '从医5年以上') + "\n            ")]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "main-inner-item-baseMessage"
    }, [_c('p', [_c('span', {
      staticClass: "main-inner-item-baseMessage-name"
    }, [_vm._v(_vm._s(item.fullName))]), _vm._v(" "), _c('span', {
      staticClass: "main-inner-item-baseMessage-title"
    }, [_vm._v(_vm._s(item.medicalTitle))])]), _vm._v(" "), _c('p', {
      staticStyle: {
        "margin-top": "1.1vw"
      }
    }, [(item.hospitalLevelId == 1) ? _c('span', {
      staticClass: "sanjia"
    }, [_vm._v("三甲")]) : _vm._e(), _vm._v(" "), _c('span', {
      staticClass: "main-inner-item-baseMessage-hospital"
    }, [_vm._v(_vm._s(item.company))])])], 1), _vm._v(" "), _c('p', {
      staticClass: "main-inner-item-baseMessage-Pro"
    }, [(item.illnessNameList.length || item.operationNameList.length) ? _c('span', {
      staticStyle: {
        "color": "#222222"
      }
    }, [_vm._v("擅长：")]) : _vm._e(), _c('span', [_vm._v(_vm._s(item.illnessNameList + ((item.illnessNameList.length && item.operationNameList.length) ? "," : "") +
      item.operationNameList))])]), _vm._v(" "), _c('div', {
      staticClass: "priceBar",
      staticStyle: {
        "float": "left"
      }
    }, [(item.adviceStatus == 0 || item.customerReviseStatus != 8) ? [_c('span', {
      staticClass: "price offLine"
    }, [_vm._v("暂不在线")])] : [(item.isFreeTimes == 1) ? _c('span', {
      staticClass: "price"
    }, [_vm._v("前3次回复免费")]) : _vm._e(), _vm._v(" "), (item.isFreeTimes == 1) ? _c('span', {
      staticClass: "freeSug",
      class: {
        'lineThrough': item.isFreeTimes == 1
      }
    }, [_vm._v("￥" + _vm._s(item.generalPrice))]) : _vm._e(), _vm._v(" "), (item.isFreeTimes !== 1) ? _c('span', {
      staticClass: "noFreeSug"
    }, [_vm._v("￥" + _vm._s(item.generalPrice))]) : _vm._e()]], 2), _vm._v(" "), _c('button', {
      staticClass: "proMark1",
      attrs: {
        "hoverStopPropagation": _vm.hoverStopPropagation,
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.isClickInquiry && _vm.queryConsult(index, item)
        }
      }
    }, [_vm._v(_vm._s(item.adviceStatus == 1 && item.customerReviseStatus == 8 ? '咨询医生' : '预约咨询') + "\n            ")])], 1)
  })), _vm._v(" "), (_vm.doctorObj.moreBoxShow) ? _c('section', {
    staticClass: "more-box doctor-more-box"
  }, [(_vm.doctorObj.moreData) ? _c('span', {
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.moreDataShow('doctorObj', $event)
      }
    }
  }, [_vm._v("查看更多")]) : _vm._e(), _vm._v(" "), (!_vm.doctorObj.moreData) ? _c('span', {
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.lessDataShow('doctorObj', $event)
      }
    }
  }, [_vm._v("收起")]) : _vm._e()]) : _vm._e()], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.hasCommunShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '去沟通',
        'cancel': '取消',
        'title': '您与该医生有正在进行中的咨询服务，现在去继续沟通吗？'
      },
      "eventid": '4',
      "mpcomid": '2'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.hasCommunShow = false
      },
      "ensureClickEvent": function($event) {
        _vm.goDoctorIm()
      }
    }
  }) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-565c5d2d", esExports)
  }
}

/***/ }),

/***/ 642:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "medical-report-main"
  }, [_c('section', {
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
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2), _vm._v(" "), _c('figcaption', {
    staticClass: "medical-report-tips"
  }, [(!_vm.isFindDoctor) ? [(_vm.timeCompare) ? _c('p', [_vm._v("好的，已为您推荐匹配医生，请点击下方卡片与医生沟通～")]) : _vm._e(), _vm._v(" "), (!_vm.timeCompare) ? [(_vm.timeSlot) ? _c('p', [_vm._v("您好！分诊医生正在详细阅读您提交的资料，将尽快给您答复，并根据情况为您推荐对症专家。")]) : (!_vm.timeSlot) ? _c('p', [_vm._v("您好！分诊服务时间为09：00-18：00，如有问题请留言，分诊医生上班后会为您答复。")]) : _vm._e()] : _vm._e()] : _c('p', [_vm._v("好的，稍等一下，我们正在帮您联系骨科专家，因为专家比较忙，可能需要等2个小时左右，我们会及时通过微信和短信通知您，请您留意一下。")]), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n          重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n        ")])], 2)], 1)], 1), _vm._v(" "), (!_vm.isFindDoctor && _vm.timeCompare) ? _c('preview-suggestion-auto', {
    attrs: {
      "caseId": parseInt(_vm.caseId),
      "patientId": parseInt(_vm.patientId),
      "eventid": '1',
      "mpcomid": '4'
    },
    on: {
      "doctorList": _vm.getDoctorList
    }
  }) : _vm._e(), _vm._v(" "), (_vm.triageType === 0) ? _c('p', {
    staticClass: "suggestion-autoTip",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.changeTriageType
    }
  }, [_vm._v("都不是我想要的，我要找私人骨科医生")]) : _vm._e(), _vm._v(" "), (_vm.triageType !== 0 && !_vm.isFindDoctor && _vm.timeCompare) ? _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "main-message-box-item others-message"
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2), _vm._v(" "), _c('figcaption', {
    staticClass: "medical-report-tips"
  }, [(!_vm.isFindDoctor) ? [(_vm.timeSlot) ? _c('p', [_vm._v("您好！分诊医生正在详细阅读您提交的资料，将尽快给您答复，并根据情况为您推荐对症专家。")]) : (!_vm.timeSlot) ? _c('p', [_vm._v("您好！分诊服务时间为09：00-18：00，如有问题请留言，分诊医生上班后会为您答复。")]) : _vm._e()] : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n          重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n        ")])], 2)], 1)], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-23f21197", esExports)
  }
}

/***/ }),

/***/ 643:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_previewSuggestion_vue__ = __webpack_require__(645);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5b7b9dde_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_previewSuggestion_vue__ = __webpack_require__(646);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(644)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5b7b9dde"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_previewSuggestion_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5b7b9dde_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_previewSuggestion_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/previewSuggestion.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] previewSuggestion.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5b7b9dde", Component.options)
  } else {
    hotAPI.reload("data-v-5b7b9dde", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 644:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 645:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_updateConsultation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getConsultStatus__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_doctorHome_getBaseMessage__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getHasInvitedConsult__ = __webpack_require__(89);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by lichenyang on 2017/8/18.
 */





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;


/**************************Axios Http Requests*************************/


 //医生基本信息 api
 //是否邀请过


var XHRList = {
  getCheckSuggestion: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/case/diagnosis/v1/getMapList/", //预览初诊建议
  getRecommedDoctor: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/recommend/v1/getMapList/", //推荐医生
  getToken: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/im/interact/v1/refreshToken/",
  getCurrentByCustomerId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/advice/setting/v1/getCurrentByCustomerId/', //获取是否与专业医生建立过im
  queryIsValid: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/recommend/v1/getMapById/" // 查询该医生是否有效
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isClickInquiry: true,
      message: {},
      suggestResponse: false, //检查检验预览响应是否完成
      doctorResponse: false, //推荐医生预览是否完成
      currentIndex: -1, // 点击当前的医生
      //检查检验里的数据
      checkSuggestObj: {
        allData: [], //全部数据
        moreBoxShow: false, //展开更多盒子是否显示
        moreData: false, //显示展开更多还是显示收起按钮
        tempData: [], //展示的数组
        lessData: [], //五条建议的数据
        initNum: 5, //初始展示的数据条数
        pageNum: 5, //分页数据条数
        position: 0, //记录卡片的位置
        hasPosition: false //卡片的位置是否已经记录
      },
      //处置建议里的数据
      treatmentObj: {
        allData: [], //全部数据
        moreBoxShow: false, //展开更多盒子是否显示
        moreData: false, //显示展开更多还是显示收起按钮
        tempData: [], //展示的数组
        lessData: [], //五条建议的数据
        initNum: 5, //初始展示的数据条数
        pageNum: 5, //分页数据条数
        position: 0, //记录卡片的位置
        hasPosition: false //卡片的位置是否已经记录
      },
      //患教知识里的数据
      knowledgeObj: {
        allData: [], //全部数据
        moreBoxShow: false, //展开更多盒子是否显示
        moreData: false, //显示展开更多还是显示收起按钮
        tempData: [], //展示的数组
        lessData: [], //五条建议的数据
        initNum: 5, //初始展示的数据条数
        pageNum: 5, //分页数据条数
        position: 0, //记录卡片的位置
        hasPosition: false //卡片的位置是否已经记录
      },
      //推荐医生的的数据
      doctorObj: {
        allData: [], //全部数据
        moreBoxShow: false, //展开更多盒子是否显示
        moreData: false, //显示展开更多还是显示收起按钮
        tempData: [], //展示的数组
        lessData: [], //五条建议的数据
        initNum: 3, //初始展示的数据条数
        pageNum: 5, //分页数据条数
        position: 0, //记录卡片的位置
        hasPosition: false //卡片的位置是否已经记录
      },
      hasCommunShow: false // confirm 框是否显示
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["orderDoctorId", 'caseType', "isFindDoctor", 'consultationId'])),
  mounted: function mounted() {
    this.message = this.previewSuggestionMessage.data.length ? this.previewSuggestionMessage.data[0] : this.previewSuggestionMessage.data;
    this.initData();
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['addRenderSuggestionNum', 'setOrderDoctorId', 'setEnsureShow']), {
    goKnowledgeDetail: function goKnowledgeDetail(index) {
      this.$router.push({
        name: "knowledgeDetail",
        params: this.knowledgeObj.allData[index]
      });
    },
    initData: function initData() {
      var that = this;
      that.uploadVideo = true;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getCheckSuggestion,
        method: "POST",
        data: {
          caseId: that.message.caseId,
          diagnosisId: that.message.diagnosisId,
          diagnosisType: 1,
          isValid: 1,
          firstResult: 0,
          maxResult: 1,
          sortType: 1
        },
        beforeSend: function beforeSend() {},
        done: function done(data) {
          if (data.responseObject.responseData.dataList) {
            var items = data.responseObject.responseData.dataList[0];
            //检查检验DOM添加
            if (items.checkList && items.checkList.length > 0 || items.inspectionList && items.inspectionList.length > 0) {
              if (items.checkList.length > 0) {
                that.checkSuggestObj.allData = that.checkSuggestObj.allData.concat(items.checkList);
              }
              if (items.inspectionList.length > 0) {
                that.checkSuggestObj.allData = that.checkSuggestObj.allData.concat(items.inspectionList);
              }
              that.checkSuggestObj.allData.map(function (item, index) {
                item.adviceId = item.checkId || item.inspectionId;
                item.adviceName = item.checkName || item.inspectionName;
                item.adviceTypeisAttachment = item.isAttachment;
                item.adviceType = '3';
              });
              that.checkSuggestData('checkSuggestObj');
            }
            //患教知识DOM添加
            if (items.knowledgeList && items.knowledgeList.length > 0) {
              that.knowledgeObj.allData = items.knowledgeList;
              that.checkSuggestData('knowledgeObj');
            }
            //处置建议DOM添加
            if (items.treatmentList && items.treatmentList.length > 0) {
              that.treatmentObj.allData = items.treatmentList;
              that.checkSuggestData('treatmentObj');
            }
          }
          that.suggestResponse = true;
          that.checkResponse();
        },
        fail: function fail() {
          that.suggestResponse = true;
          that.checkResponse();
        }
      });
      that.getRecommedDoctor();
    },

    /** 邀请医生开诊 */
    inviteConsultFn: function inviteConsultFn(index) {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getHasInvitedConsult__["a" /* default */])({
        customerId: this.doctorObj.allData[this.currentIndex].customerId, //	string	是	医生id
        patientCustomerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId") || '', //string	是	患者所属用户id
        openid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("openId") || "", // string	是	渠道唯一id
        uuid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('unionId') || "" // string	是	联合id（用来关联其他平台）
      }).then(function (data) {
        _this.isClickInquiry = true;
        if (data.responseObject.responseStatus) {
          if (data.responseObject.responseMessage == "NO DATA") {
            //未邀请过
            wx.navigateTo({
              url: "/pages/doctorMain/inviteContent?from=imScene&doctorId=" + _this.doctorObj.allData[_this.currentIndex].customerId + "&fullName=" + _this.doctorObj.allData[_this.currentIndex].fullName
            });
          } else {
            //已邀请过
            wx.showToast({
              title: "您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。",
              icon: "none",
              duration: 2000
            });
          }
        } else {
          console.log('获取是否邀请过医生开诊失败');
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 获取推荐医生 */
    getRecommedDoctor: function getRecommedDoctor() {
      var that = this;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getRecommedDoctor,
        method: "POST",
        data: {
          diagnosisId: that.message.diagnosisId,
          caseId: this.caseId,
          patientId: this.patientId,
          isValidList: "1,2",
          firstResult: 0,
          maxResult: 9999,
          sortType: 1,
          logoUseFlag: 3
        },
        beforeSend: function beforeSend() {},
        done: function done(data) {
          if (data.responseObject.responseData.dataList) {
            that.doctorObj.allData = data.responseObject.responseData.dataList;
            console.log(data.responseObject.responseData.dataList);
            that.checkSuggestData('doctorObj');
          }
          that.doctorResponse = true;
          that.$nextTick(function () {
            that.checkResponse();
          });
          that.$emit('scrollToBottom', 500);
        },
        fail: function fail() {
          that.doctorResponse = true;
          that.$nextTick(function () {
            that.checkResponse();
          });
        }
      });
    },

    //检查响应是否都完成
    checkResponse: function checkResponse() {
      var that = this;
      if (that.suggestResponse && that.doctorResponse) {
        this.addRenderSuggestionNum();
      }
      //渲染完成后进行定位
      if (that.$store.state.previewSuggestionNum <= that.$store.state.renderSuggestionNum) {
        that.$nextTick(function () {
          if (that.$store.state.historyStatus === "history") {
            console.log('医生数据完成');
            if (!__WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getPara().suggest) {
              that.scrollToBottom();
            } else {
              var _eleArr = document.querySelectorAll(".doctor-main-box");
              var _ele = _eleArr[_eleArr.length - 1];
              console.log(_ele.parentElement.parentElement.offsetTop);
              that.scrollElement(_ele.parentElement.parentElement.offsetTop);
            }
          }
        });
      }
    },

    //检查检验数据
    checkSuggestData: function checkSuggestData(param) {
      var that = this;
      if (that[param].allData.length > that[param].initNum) {
        that[param].moreBoxShow = true;
        that[param].lessData = that[param].allData.slice(0, that[param].initNum);
        that[param].tempData = that[param].lessData;
        that[param].moreData = true;
      } else {
        that[param].moreBoxShow = false;
        that[param].tempData = that[param].allData;
      }
    },

    //展示更多
    moreDataShow: function moreDataShow(param, e) {
      var that = this;
      console.log(e);
      if (that[param].allData.length - that[param].tempData.length > that[param].pageNum) {
        that[param].tempData = that[param].allData.slice(0, that[param].pageNum + that[param].tempData.length);
      } else {
        that[param].moreData = false;
        that[param].tempData = that[param].allData;
      }
    },

    //去医生主页
    goDoctorHome: function goDoctorHome(index, item) {
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14174
      });
      // 针对于美年来源，直接进入医生主页
      if (this.caseType == '15') {
        this.queryConsult(index, item);
      } else {
        wx.navigateTo({
          url: "/pages/doctorMain/doctorMain?from=imScene&caseId=" + this.caseId + "&&doctorCustomerId=" + this.doctorObj.allData[index].customerId + "&patientId=" + this.patientId + "&orderSourceId=" + this.consultationId + "&caseType=" + this.caseType
        });
      }
    },

    // 查询是否可以咨询
    queryConsult: function queryConsult(index, opt) {
      if (this.isFindDoctor) {
        __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
          actionId: 14178,
          browseType: "100",
          opDesc: "审核不通过推荐医师咨询点击（小程序）",
          pushMessageId: opt.customerId,
          locationId: index,
          keyword: opt.fullName
        });
      } else {
        __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
          actionId: 14177,
          browseType: "115",
          opDesc: "立即咨询（小程序）",
          pushMessageId: opt.customerId,
          keyword: opt.fullName
        });
      }
      var that = this;
      that.isClickInquiry = false;
      that.currentIndex = index, __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.queryIsValid,
        method: "POST",
        data: {
          diagnosisId: that.message.diagnosisId,
          recommendId: that.doctorObj.allData[index].customerId,
          isValid: 1
        },
        done: function done(data) {
          var _this2 = this;

          console.log(data);
          if (data.responseObject && data.responseObject.responseMessage == 'NO DATA') {
            that.isClickInquiry = true;
            that.setEnsureShow(true);
          } else {
            Object(__WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getConsultStatus__["a" /* default */])({
              customerId: that.doctorObj.allData[index].customerId,
              caseId: that.caseId,
              patientId: that.patientId,
              orderType: 1,
              orderSourceType: 0,
              sortType: 2
            }).then(function (data) {
              console.log(data);
              if (data.conState == 1) {
                //已存在咨询记录
                that.isClickInquiry = true;
                that.hasCommunShow = true;
              } else {
                // 判断如果是预约咨询，则请求预约咨询接口
                if (opt.adviceStatus == 0 || opt.customerReviseStatus != 8) {
                  that.inviteConsultFn();
                } else {
                  Object(__WEBPACK_IMPORTED_MODULE_8_common_js_doctorHome_getBaseMessage__["a" /* default */])({
                    "customerId": that.doctorObj.allData[index].customerId,
                    "logoUseFlag": 3
                  }).then(function (res) {
                    if (res && res.responseData && res.responseData.dataList) {
                      var _baseInfoData = res.responseData.dataList[0];
                      if (_baseInfoData.authMap.state == 8) {
                        that.goConsult();
                      } else {
                        wx.navigateTo({
                          url: "/pages/doctorMain/doctorMain?from=imScene&caseId=" + _this2.caseId + "&&doctorCustomerId=" + _this2.doctorObj.allData[index].customerId + "&patientId=" + _this2.patientId + "&caseType=" + _this2.caseType
                        });
                      }
                    }
                  });
                }
              }
            });
          }
        }
      });
    },

    //咨询
    goConsult: function goConsult() {
      var that = this;
      this.setOrderDoctorId(that.doctorObj.allData[that.currentIndex].customerId);
      wx.navigateTo({
        url: "/packageA/imSceneAffirmOrder/imSceneAffirmOrder"
      });
      that.isClickInquiry = true;
    },

    // 去主诊医生IM
    goDoctorIm: function goDoctorIm() {
      this.hasCommunShow = false;
      wx.navigateTo({
        url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + this.caseId + "&doctorCustomerId=" + this.doctorObj.allData[this.currentIndex].customerId + "&patientId=" + this.patientId
      });
    },

    //收起
    lessDataShow: function lessDataShow(param, e) {
      var that = this;
      // document.body.scrollTop = that[param].position;
      that[param].moreData = true;
      that[param].hasPosition = false;
      that[param].tempData = that[param].lessData;
      // console.log($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      that.$nextTick(function () {
        // that.scrollElement($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      });
    },
    goToUpload: function goToUpload() {
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("upload");
      if (this.$store.state.consultationState == 7 || this.$store.state.consultationState == 1 || this.$store.state.consultationState == 8) {
        this.$store.commit("setToastTips", "分诊服务已结束");
        this.$store.commit('setToastShow');
      } else {
        this.$router.push({
          name: "UploadList",
          params: this.checkSuggestObj.allData
        });
      }
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
    previewSuggestionMessage: {
      type: Object
    },
    payPopupShow: {
      type: Boolean
    },
    scrollToBottom: {
      type: Function,
      default: null
    },
    scrollElement: {
      type: Function,
      default: null
    },
    caseId: {
      type: Number
    },
    patientId: {
      type: Number
    },
    showFlag: {
      type: Boolean
    }
  },
  watch: {
    showFlag: function showFlag(newVal, oldVal) {
      if (newVal) {
        this.getRecommedDoctor(); // 当触发 onShow 的时候重新获取推荐医生信息
      }
    }
  },
  components: {
    confirm: __WEBPACK_IMPORTED_MODULE_3_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 646:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.doctorObj.allData.length) ? _c('section', {
    staticClass: "main-message-box doctor-main-box",
    attrs: {
      "data-alcode-mod": "716"
    }
  }, [_c('article', {
    staticClass: "doctor-box"
  }, [_c('header', {
    staticClass: "doctor-header"
  }, [_c('h3', {
    staticClass: "doctor-title"
  }, [_vm._v("根据病情为您推荐以下医生")]), _vm._v(" "), _c('p', {
    staticClass: "doctor-p"
  }, [_vm._v("点击卡片开始咨询")])], 1), _vm._v(" "), _c('section', {
    staticClass: "doctor-content"
  }, [_c('section', {
    staticClass: "doctor-list"
  }, _vm._l((_vm.doctorObj.tempData), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "main-inner-item",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.goDoctorHome(index, item)
        }
      }
    }, [_c('div', {
      staticClass: "main-inner-item-img"
    }, [_c('img', {
      staticClass: "dp",
      attrs: {
        "src": item.logoUrl
      }
    })]), _vm._v(" "), (item.jobDoctorYear > 5) ? _c('div', {
      staticClass: "ProMark"
    }, [_vm._v("\n              " + _vm._s(item.jobDoctorYear >= 10 ? '从医' + item.jobDoctorYear + '年' : '从医5年以上') + "\n            ")]) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "main-inner-item-baseMessage"
    }, [_c('p', [_c('span', {
      staticClass: "main-inner-item-baseMessage-name"
    }, [_vm._v(_vm._s(item.fullName))]), _vm._v(" "), _c('span', {
      staticClass: "main-inner-item-baseMessage-title"
    }, [_vm._v(_vm._s(item.medicalTitle))])]), _vm._v(" "), _c('p', {
      staticStyle: {
        "margin-top": "1.1vw"
      }
    }, [(item.hospitalLevelId == 1) ? _c('span', {
      staticClass: "sanjia"
    }, [_vm._v("三甲")]) : _vm._e(), _vm._v(" "), _c('span', {
      staticClass: "main-inner-item-baseMessage-hospital"
    }, [_vm._v(_vm._s(item.company))])])], 1), _vm._v(" "), _c('p', {
      staticClass: "main-inner-item-baseMessage-Pro"
    }, [(item.illnessNameList.length || item.operationNameList.length) ? _c('span', {
      staticStyle: {
        "color": "#222222"
      }
    }, [_vm._v("擅长：")]) : _vm._e(), _c('span', [_vm._v(_vm._s(item.illnessNameList + ((item.illnessNameList.length && item.operationNameList.length) ? "," : "") +
      item.operationNameList))])]), _vm._v(" "), _c('div', {
      staticClass: "priceBar",
      staticStyle: {
        "float": "left"
      }
    }, [(item.adviceStatus == 0 || item.customerReviseStatus != 8) ? [_c('span', {
      staticClass: "price offLine"
    }, [_vm._v("暂不在线")])] : [(item.isFreeTimes == 1) ? _c('span', {
      staticClass: "price"
    }, [_vm._v("前3次回复免费")]) : _vm._e(), _vm._v(" "), (item.isFreeTimes == 1) ? _c('span', {
      staticClass: "freeSug",
      class: {
        'lineThrough': item.isFreeTimes == 1
      }
    }, [_vm._v("￥" + _vm._s(item.generalPrice))]) : _vm._e(), _vm._v(" "), (item.isFreeTimes !== 1) ? _c('span', {
      staticClass: "noFreeSug"
    }, [_vm._v("￥" + _vm._s(item.generalPrice))]) : _vm._e()]], 2), _vm._v(" "), _c('button', {
      staticClass: "proMark1",
      attrs: {
        "hoverStopPropagation": _vm.hoverStopPropagation,
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.isClickInquiry && _vm.queryConsult(index, item)
        }
      }
    }, [_vm._v(_vm._s(item.adviceStatus == 1 && item.customerReviseStatus == 8 ? '咨询医生' : '预约咨询') + "\n            ")])], 1)
  })), _vm._v(" "), (_vm.doctorObj.moreBoxShow) ? _c('section', {
    staticClass: "more-box doctor-more-box"
  }, [(_vm.doctorObj.moreData) ? _c('span', {
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.moreDataShow('doctorObj', $event)
      }
    }
  }, [_vm._v("查看更多")]) : _vm._e(), _vm._v(" "), (!_vm.doctorObj.moreData) ? _c('span', {
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.lessDataShow('doctorObj', $event)
      }
    }
  }, [_vm._v("收起")]) : _vm._e()]) : _vm._e()], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.knowledgeObj.allData.length) ? _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "knowledge-box"
  }, [_c('header', {
    staticClass: "knowledge-title"
  }, [_vm._v("以下骨科知识有助于您早日康复，点击查看详情")]), _vm._v(" "), _c('section', {
    staticClass: "knowledge-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "knowledge-content"
  }, [_c('ul', {
    staticClass: "knowledge-list"
  }, _vm._l((_vm.knowledgeObj.tempData), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "knowledge-item",
      attrs: {
        "eventid": '4-' + index
      },
      on: {
        "click": function($event) {
          _vm.goKnowledgeDetail(index)
        }
      }
    }, [_c('span', {
      staticClass: "knowledge-name"
    }, [_vm._v(_vm._s(item.knowledgeName))]), _vm._v(" "), _c('span', {
      staticClass: "knowledge-detail"
    }, [_vm._v("详情")])])
  })), _vm._v(" "), (_vm.knowledgeObj.moreBoxShow) ? _c('section', {
    staticClass: "more-box"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.knowledgeObj.moreData),
      expression: "knowledgeObj.moreData"
    }],
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.moreDataShow('knowledgeObj', $event)
      }
    }
  }, [_vm._v("查看更多")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.knowledgeObj.moreData),
      expression: "!knowledgeObj.moreData"
    }],
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.lessDataShow('knowledgeObj', $event)
      }
    }
  }, [_vm._v("收起")])]) : _vm._e()], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.treatmentObj.allData.length) ? _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "advice-box"
  }, [_c('header', {
    staticClass: "check-suggest-title"
  }, [_vm._v("根据您的情况，为您推荐以下康复方式，请务必在医生的指导下进行")]), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-content"
  }, [_c('ul', {
    staticClass: "check-suggest-list"
  }, _vm._l((_vm.treatmentObj.tempData), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "check-suggest-item"
    }, [_c('span', [_vm._v(_vm._s(item.treatmentName))])])
  })), _vm._v(" "), (_vm.treatmentObj.moreBoxShow) ? _c('section', {
    staticClass: "more-box"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.treatmentObj.moreData),
      expression: "treatmentObj.moreData"
    }],
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.moreDataShow('treatmentObj', $event)
      }
    }
  }, [_vm._v("查看更多")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.treatmentObj.moreData),
      expression: "!treatmentObj.moreData"
    }],
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '8'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.lessDataShow('treatmentObj', $event)
      }
    }
  }, [_vm._v("收起")])]) : _vm._e()], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.checkSuggestObj.allData.length) ? _c('section', {
    staticClass: "main-message-box",
    attrs: {
      "data-alcode-mod": "715"
    }
  }, [_c('article', {
    staticClass: "check-suggest-box"
  }, [_c('header', {
    staticClass: "check-suggest-title"
  }, [_vm._v("建议您进行以下检查，并上传检查资料，分诊将继续为您解答，并推荐对症专家")]), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-content"
  }, [_c('ul', {
    staticClass: "check-suggest-list"
  }, _vm._l((_vm.checkSuggestObj.tempData), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "check-suggest-item",
      attrs: {
        "data-adviceid": item.adviceId,
        "data-advicetype": item.adviceType
      }
    }, [_c('span', [_vm._v(_vm._s(item.adviceName))])])
  })), _vm._v(" "), (_vm.checkSuggestObj.moreBoxShow) ? _c('section', {
    staticClass: "more-box"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.checkSuggestObj.moreData),
      expression: "checkSuggestObj.moreData"
    }],
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.moreDataShow('checkSuggestObj', $event)
      }
    }
  }, [_vm._v("查看更多")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.checkSuggestObj.moreData),
      expression: "!checkSuggestObj.moreData"
    }],
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '10'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.lessDataShow('checkSuggestObj', $event)
      }
    }
  }, [_vm._v("收起")])]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-btn",
    attrs: {
      "data-alcode": "e129",
      "data-role": "videoTriage",
      "eventid": '11'
    },
    on: {
      "click": _vm.goToUpload
    }
  }, [_vm._v("\n          上传检查资料\n        ")])], 1), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n        重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n      ")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.hasCommunShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '去沟通',
        'cancel': '取消',
        'title': '您与该医生有正在进行中的咨询服务，现在去继续沟通吗？'
      },
      "eventid": '12',
      "mpcomid": '2'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.hasCommunShow = false
      },
      "ensureClickEvent": function($event) {
        _vm.goDoctorIm()
      }
    }
  }) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5b7b9dde", esExports)
  }
}

/***/ }),

/***/ 647:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_checkSuggest_vue__ = __webpack_require__(649);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ef35674c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_checkSuggest_vue__ = __webpack_require__(650);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(648)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ef35674c"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_checkSuggest_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ef35674c_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_checkSuggest_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/checkSuggest.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] checkSuggest.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ef35674c", Component.options)
  } else {
    hotAPI.reload("data-v-ef35674c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 648:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 649:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(4);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
   * Created by lichenyang on 2017/8/21.
   */

// import store from "../store/store";



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      moreBoxShow: false, //展开更多盒子是否显示
      moreData: false, //显示展开更多还是显示收起按钮
      tempSuggest: [], //展示的数组
      moreSuggest: [], //最多的数组
      lessSuggest: [], //五条建议的数据
      position: 0, //记录卡片的位置
      hasPosition: false, //卡片的位置是否已经记录
      paramsData: [] //上传检查检验的参数
    };
  },
  mounted: function mounted() {
    console.log(this.checkSuggestMessage);
    this.initData();
  },

  methods: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapMutations(['setToastTips', 'setToastShow', 'setUpload']), {
    //初始化数据
    initData: function initData() {
      var that = this;
      //检查检验Imagetype手动改为3，与pc展示相对应
      that.paramsData = that.checkSuggestMessage.data;
      that.paramsData.map(function (item, index) {
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(item, { adviceType: 3 });
      });
      if (that.checkSuggestMessage.data.length > 5) {
        that.moreBoxShow = true;
        that.moreSuggest = that.checkSuggestMessage.data;
        that.lessSuggest = that.checkSuggestMessage.data.slice(0, 5);
        that.tempSuggest = that.lessSuggest;
        that.moreData = true;
      } else {
        that.moreBoxShow = false;
        that.tempSuggest = that.checkSuggestMessage.data;
      }
    },

    //展示更多
    moreDataShow: function moreDataShow(e) {
      var that = this;
      // if (!that.hasPosition) {
      //   that.position = e.path["4"].offsetTop;
      //   that.hasPosition = true;
      // }
      that.moreData = false;
      that.tempSuggest = that.moreSuggest;
    },

    //收起
    lessDataShow: function lessDataShow(e) {
      var that = this;
      // document.body.scrollTop = that.position;
      that.moreData = true;
      that.tempSuggest = that.lessSuggest;
      that.$nextTick(function () {
        // that.scrollElement($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
      });
    },
    goToUpload: function goToUpload() {
      __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].createTrack({
        actionId: 14173
      });

      if (this.consultationState == 7 || this.consultationState == 1 || this.consultationState == 8) {
        this.setToastShow();
        this.setToastTips('分诊服务已结束');
      } else {
        // this.setUpload(this.paramsData);
        wx.setStorageSync("checkInspectLists", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(this.paramsData));
        wx.navigateTo({
          url: "/pages/upLoadImgCheck/upLoadImgCheck?caseId=" + this.caseId + "&from=im"
        });
      }
    }
  }),
  computed: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapState(['consultationState', "caseId"])),
  props: {
    checkSuggestMessage: {
      type: Object
    },
    scrollToBottom: {
      type: Function,
      default: null
    },
    scrollElement: {
      type: Function,
      default: null
    }
  }
});

/***/ }),

/***/ 650:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "data-alcode-mod": "715"
    }
  }, [_c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "check-suggest-box"
  }, [_c('header', {
    staticClass: "check-suggest-title"
  }, [_vm._v("建议您进行以下检查，并上传检查资料，分诊将继续为您解答，并推荐对症专家")]), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-content"
  }, [_c('ul', {
    staticClass: "check-suggest-list"
  }, _vm._l((_vm.tempSuggest), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "check-suggest-item",
      attrs: {
        "data-adviceid": item.adviceId,
        "data-advicetype": item.adviceType,
        "scrollToBottom": _vm.scrollToBottom,
        "scrollElement": _vm.scrollElement
      }
    }, [_c('span', [_vm._v(_vm._s(item.adviceName))])])
  })), _vm._v(" "), (_vm.moreBoxShow) ? _c('section', {
    staticClass: "more-box"
  }, [_c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.moreData),
      expression: "moreData"
    }],
    staticClass: "more-box-btn more-btn",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.moreDataShow($event)
      }
    }
  }, [_vm._v("查看更多")]), _vm._v(" "), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.moreData),
      expression: "!moreData"
    }],
    staticClass: "more-box-btn less-btn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.lessDataShow($event)
      }
    }
  }, [_vm._v("收起")])]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "check-suggest-btn",
    attrs: {
      "data-alcode": "e129",
      "data-role": "videoTriage",
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.goToUpload()
      }
    }
  }, [_vm._v("\n        上传检查资料\n      ")])], 1), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n      重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n    ")])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ef35674c", esExports)
  }
}

/***/ }),

/***/ 651:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reviewCaseSuccess_vue__ = __webpack_require__(653);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5dc602a6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reviewCaseSuccess_vue__ = __webpack_require__(654);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(652)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-5dc602a6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reviewCaseSuccess_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5dc602a6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reviewCaseSuccess_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/reviewCaseSuccess.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reviewCaseSuccess.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5dc602a6", Component.options)
  } else {
    hotAPI.reload("data-v-5dc602a6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 652:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 653:
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
   * Created by lichenyang on 2018/3/28.
   */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      // doctorName:'',
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['isFindDoctor', 'doctorBaseMsg', 'caseId', 'patientInfo']), {
    medicalTitle: function medicalTitle() {
      var result = [];
      this.doctorBaseMsg.medicalTitle.split(",").forEach(function (element, index) {
        if (element.length > 0) {
          result.push(element.substring(2));
        }
      });
      result = result.join(",");
      if (!result) return '';
      var newStr = '',
          newLength = 0;
      for (var i = 0; i < result.length; i++) {
        if (result.charCodeAt(i) > 128) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength <= 22) {
          newStr = newStr.concat(result[i]);
        } else {
          break;
        }
      }
      if (newLength > 22) {
        newStr = newStr + "...";
      }
      return newStr;
    },
    doctorName: function doctorName() {
      if (!this.doctorBaseMsg.customerName) return '';
      var newStr = '',
          newLength = 0;
      for (var i = 0; i < this.doctorBaseMsg.customerName.length; i++) {
        if (this.doctorBaseMsg.customerName.charCodeAt(i) > 128) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength <= 8) {
          newStr = newStr.concat(this.doctorBaseMsg.customerName[i]);
        } else {
          break;
        }
      }
      if (newLength > 8) {
        newStr = newStr + "...";
      }
      return newStr;
    }
  }),
  methods: {
    // 埋点参数
    getSpsData: function getSpsData(opt, index) {
      __WEBPACK_IMPORTED_MODULE_1_dataLog__["a" /* default */].createTrack({
        actionId: 14179,
        pushMessageId: this.doctorCustomerId,
        keyword: this.doctorBaseMsg.customerName
      });
      return "pushMassageId:" + this.doctorCustomerId + ";keyword:" + this.doctorBaseMsg.customerName;
    },

    // 去与专业医生聊天
    goDoctorIm: function goDoctorIm() {
      __WEBPACK_IMPORTED_MODULE_1_dataLog__["a" /* default */].createTrack({
        actionId: 14179,
        browseType: "100",
        opDesc: "审核通过推荐医师咨询点击（小程序）",
        pushMessageId: this.doctorCustomerId,
        keyword: this.doctorBaseMsg.customerName
      });
      wx.navigateTo({
        url: "/packageA/imSceneDoctor/imSceneDoctor?from=im&caseId=" + this.caseId + "&&doctorCustomerId=" + this.doctorCustomerId + "&patientId=" + this.patientInfo.patientId
      });
    },

    //去医生主页
    goDoctorHome: function goDoctorHome() {
      wx.navigateTo({
        url: "/pages/doctorMain/doctorMain?from=im&caseId=" + this.caseId + "&&doctorCustomerId=" + this.doctorCustomerId + "&patientId=" + this.patientInfo.patientId
      });
    }
  },
  props: {
    doctorCustomerId: {
      type: String
    }
  }
});

/***/ }),

/***/ 654:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "main-message-box-item others-message"
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2), _vm._v(" "), _c('figcaption', {
    staticClass: "medical-report-tips"
  }, [_c('p', [_vm._v("我已将您的病历信息提交至" + _vm._s(_vm.doctorBaseMsg.customerName) + "医生，点击下方卡片，立即与" + _vm._s(_vm.doctorBaseMsg.customerName) + "医生沟通吧~")]), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n          重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n        ")])], 1)], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "main-message-box doctor-main-box",
    attrs: {
      "data-alcode-mod": "762"
    }
  }, [_c('article', {
    staticClass: "doctor-box"
  }, [_c('header', {
    staticClass: "doctor-header"
  }, [_c('h3', {
    staticClass: "doctor-title"
  }, [_vm._v("点击卡片咨询医生")])], 1), _vm._v(" "), _c('section', {
    staticClass: "doctor-content",
    attrs: {
      "data-alcode": "e178",
      "sps-data": _vm.getSpsData(),
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goDoctorIm()
      }
    }
  }, [_c('section', {
    staticClass: "doctor-list"
  }, [_c('section', {
    staticClass: "doctor-item"
  }, [_c('section', {
    staticClass: "doctor-item-top"
  }, [_c('figure', {
    staticClass: "doctor-item-img"
  }, [_c('img', {
    attrs: {
      "src": _vm.doctorBaseMsg.logoUrl,
      "alt": "医生头像"
    }
  })]), _vm._v(" "), _c('figcaption', {
    staticClass: "doctor-item-info"
  }, [_c('p', {
    staticClass: "doctor-base-info"
  }, [_c('span', {
    staticClass: "doctor-name"
  }, [_vm._v(_vm._s(_vm.doctorName))]), _vm._v(" "), _c('span', {
    staticClass: "doctor-post"
  }, [_vm._v(_vm._s(_vm.medicalTitle))])]), _vm._v(" "), _c('p', {
    staticClass: "doctor-hospital"
  }, [(_vm.doctorBaseMsg.hospitalLevelId == 1) ? _c('span', {
    staticClass: "doctor-hospital-level"
  }, [_vm._v("三甲")]) : _vm._e(), _vm._v(_vm._s(_vm.doctorBaseMsg.company))])], 1)], 1), _vm._v(" "), (_vm.doctorBaseMsg.illnessNameList.length) ? _c('p', {
    staticClass: "doctor-good"
  }, [_c('span', {
    staticStyle: {
      "color": "#25324D"
    }
  }, [_vm._v("擅长：")]), _vm._v(_vm._s(_vm.doctorBaseMsg.illnessNameList))]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doctor-item-bottom"
  }, [_c('span', {
    staticClass: "go-consult"
  }, [_vm._v("去沟通")])])], 1)], 1)], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5dc602a6", esExports)
  }
}

/***/ }),

/***/ 655:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reviewCaseFail_vue__ = __webpack_require__(657);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d4cd8338_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reviewCaseFail_vue__ = __webpack_require__(658);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(656)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reviewCaseFail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d4cd8338_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reviewCaseFail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/reviewCaseFail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reviewCaseFail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d4cd8338", Component.options)
  } else {
    hotAPI.reload("data-v-d4cd8338", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 656:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 657:
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

/**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/17.
   */


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },
  mounted: function mounted() {},

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['isFindDoctor', 'doctorBaseMsg'])),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setIsFindDoctor'])),
  props: {
    // doctorName: {
    //   type: String,
    //   default: "xxx"
    // },
  }
});

/***/ }),

/***/ 658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "main-message-box-item others-message"
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2), _vm._v(" "), _c('figcaption', {
    staticClass: "medical-report-tips"
  }, [_c('p', [_vm._v("您的情况我了解了，由于您的病历与" + _vm._s(_vm.doctorBaseMsg.customerName) + "医生的接诊要求不匹配，系统将自动为您退款；同时我将为您推荐其他合适的医生，请稍后。")]), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n        重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n      ")])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-d4cd8338", esExports)
  }
}

/***/ }),

/***/ 659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_triage_vue__ = __webpack_require__(661);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_723aaef2_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_triage_vue__ = __webpack_require__(662);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(660)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-723aaef2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_triage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_723aaef2_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_triage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/triage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] triage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-723aaef2", Component.options)
  } else {
    hotAPI.reload("data-v-723aaef2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 660:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 661:
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2017/8/23.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },
  mounted: function mounted() {
    //      type2图片 1视频
    console.log(this.triageMessage);
  },

  methods: {
    goToUpload: function goToUpload(type) {
      // sessionStorage.removeItem("triageRoute");
      // this.$router.push({
      //   name: "TriageDetail",
      //   params: this.triageMessage.data
      // })
      wx.navigateTo({
        url: "/packageA/triageDetail/triageDetail?type=" + this.triageMessage.data.type + "&content=" + this.triageMessage.data.content
      });
    }
  },
  props: {
    triageMessage: {
      type: Object
    }
  }
});

/***/ }),

/***/ 662:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-message-box"
  }, [_c('article', {
    staticClass: "video-triage-box"
  }, [_c('figure', {
    staticClass: "video-triage-content"
  }, [_c('span', [_vm._v(_vm._s(_vm.triageMessage.data.content))])]), _vm._v(" "), _c('figcaption', {
    staticClass: "video-triage-btn",
    attrs: {
      "data-role": "videoTriage",
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goToUpload(_vm.triageMessage.data.type)
      }
    }
  }, [_vm._v("\n              上传" + _vm._s(_vm.triageMessage.data.type == 1 ? "视频" : "照片") + "\n    ")])], 1), _vm._v(" "), _c('section', {
    staticClass: "tips-content"
  }, [_vm._v("\n    重要提示：在线咨询不能代替面诊，医生建议仅供参考。\n  ")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-723aaef2", esExports)
  }
}

/***/ }),

/***/ 663:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_video_vue__ = __webpack_require__(665);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_41ea19ed_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_video_vue__ = __webpack_require__(666);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(664)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_41ea19ed_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_video_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/video.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] video.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-41ea19ed", Component.options)
  } else {
    hotAPI.reload("data-v-41ea19ed", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 664:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 665:
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
//
//
//
//
//
//



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
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
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', 'isFindDoctor']), mapGetters(['targetLogo']), {
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

/***/ 666:
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
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2) : _vm._e(), _vm._v(" "), _c('i', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-41ea19ed", esExports)
  }
}

/***/ }),

/***/ 667:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mulitpleImage_vue__ = __webpack_require__(669);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_102b2e53_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mulitpleImage_vue__ = __webpack_require__(670);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(668)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_102b2e53_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mulitpleImage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/mulitpleImage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mulitpleImage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-102b2e53", Component.options)
  } else {
    hotAPI.reload("data-v-102b2e53", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 668:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 669:
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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      imageList: [],
      showDeleteMsg: false
    };
  },

  watch: {
    // "imageMessage"(data) {
    //   data.content.data.list.forEach((element, index) => {
    //     if (element) {
    //       this.imageList.push(this.nim.viewImageQuality({
    //         url: element.url,
    //         quality: 60
    //       }));
    //     }
    //   });
    // }
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
    var _this = this;

    this.imageMessage.content.data.list.forEach(function (element, index) {
      if (element) {
        _this.imageList.push(element.url);
      }
    });
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', "isFindDoctor"]), mapGetters(['targetLogo'])),
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

/***/ 670:
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-102b2e53", esExports)
  }
}

/***/ }),

/***/ 671:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_fileMessage_vue__ = __webpack_require__(673);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0061e0dd_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_fileMessage_vue__ = __webpack_require__(674);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(672)
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
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0061e0dd_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_fileMessage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imScene/components/fileMessage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] fileMessage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0061e0dd", Component.options)
  } else {
    hotAPI.reload("data-v-0061e0dd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 672:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 673:
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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      custom: null,
      showDeleteMsg: false
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['targetList', 'logoUrl', 'toolbarConfig', 'targetMsg', 'isFindDoctor']), mapGetters(['targetLogo'])),
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

/***/ 674:
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
  }, [(_vm.isFindDoctor) ? [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png",
      "alt": ""
    }
  })] : [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  })]], 2) : _vm._e(), _vm._v(" "), _c('figcaption', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0061e0dd", esExports)
  }
}

/***/ }),

/***/ 678:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getTriageWorkingTime;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：获取分诊医生工作时间
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/15.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/traige/v1/getMapById/";

function getTriageWorkingTime(param) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
      url: XHRUrl,
      method: "POST",
      data: {
        visitSiteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId(),
        maxResult: 999,
        id: 0
      },
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

/***/ 682:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-inner",
    attrs: {
      "eventid": '17'
    },
    on: {
      "click": function($event) {
        _vm.deleteMsgIndex = -1
      }
    }
  }, [_c('article', {
    staticClass: "main-message-time"
  }, [_c('span', {
    staticClass: "time-icon"
  }), _c('p', {
    staticClass: "new-service-time"
  }, [_vm._v("服务时间：" + _vm._s(_vm.serviceTime))])], 1), _vm._v(" "), _c('section', {
    staticClass: "main-message",
    class: {
      'showBottomPd': _vm.footerBottomFlag
    }
  }, _vm._l((_vm.msgList), function(msg, index) {
    return _c('section', {
      key: index,
      staticClass: "main-message-wrapper"
    }, [(_vm.timeStampShowList[index] == 1) ? _c('p', {
      staticClass: "time-stamp"
    }, [_vm._v(_vm._s(msg.timeStamp))]) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'medicalReport') ? _c('MedicalReport', {
      attrs: {
        "medicalReportMessage": msg.content,
        "triageType": _vm.triageType,
        "caseId": parseInt(_vm.caseId),
        "patientId": parseInt(_vm.patientId),
        "eventid": '0-' + index,
        "mpcomid": '0-' + index
      },
      on: {
        "changeType": _vm.changeTriageType
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'videoTriage') ? _c('Triage', {
      attrs: {
        "triageMessage": msg.content,
        "mpcomid": '1-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'previewSuggestion') ? _c('PreviewSuggestion', {
      attrs: {
        "previewSuggestionMessage": msg.content,
        "caseId": parseInt(_vm.caseId),
        "patientId": parseInt(_vm.patientId),
        "showFlag": _vm.showFlag,
        "eventid": '1-' + index,
        "mpcomid": '2-' + index
      },
      on: {
        "scrollToBottom": _vm.scrollToBottom,
        "scrollElement": _vm.scrollElement
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'checkSuggestion') ? _c('CheckSuggest', {
      attrs: {
        "checkSuggestMessage": msg.content,
        "eventid": '2-' + index,
        "mpcomid": '3-' + index
      },
      on: {
        "scrollToBottom": _vm.scrollToBottom,
        "scrollElement": _vm.scrollElement
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'text' && msg.text) ? _c('ContentText', {
      attrs: {
        "contentMessage": msg,
        "userData": _vm.userData,
        "targetData": _vm.targetData,
        "currentIndex": index,
        "deleteMsgIndex": _vm.deleteMsgIndex,
        "eventid": '3-' + index,
        "mpcomid": '4-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg)
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
        "eventid": '4-' + index,
        "mpcomid": '5-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
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
        "mpcomid": '6-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg)
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
        "eventid": '6-' + index,
        "mpcomid": '7-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg)
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
        "eventid": '7-' + index,
        "mpcomid": '8-' + index
      },
      on: {
        "deleteMsgEvent": function($event) {
          _vm.deleteMsgEvent(msg)
        },
        "longTouchEmitHandler": function($event) {
          _vm.longTouchEmitHandler(index)
        },
        "update:inputBoxShow": function($event) {
          _vm.inputBoxShow = $event
        }
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'triageSendTips') ? _c('section', {
      staticClass: "main-message-box"
    }, [_c('article', {
      staticClass: "main-message-box-item my-message",
      attrs: {
        "data-clientid": msg.idClient
      }
    }, [_c('i', {
      staticClass: "fail-button",
      staticStyle: {
        "display": "none"
      }
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/imScene/error_tips.png",
        "alt": ""
      }
    })]), _vm._v(" "), _c('figcaption', {
      staticClass: "main-message-content"
    }, [_c('p', [_vm._v("患者已上传视诊资料")])], 1), _vm._v(" "), (msg.from === _vm.userData.account) ? _c('figure', {
      staticClass: "main-message-img"
    }, [_c('img', {
      attrs: {
        "src": _vm.logoUrl,
        "alt": ""
      }
    })]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'checkSuggestSendTips') ? _c('section', {
      staticClass: "main-message-box"
    }, [_c('article', {
      staticClass: "main-message-box-item my-message",
      attrs: {
        "data-clientid": msg.idClient
      }
    }, [_c('i', {
      staticClass: "fail-button",
      staticStyle: {
        "display": "none"
      }
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/imScene/error_tips.png",
        "alt": ""
      }
    })]), _vm._v(" "), _c('figcaption', {
      staticClass: "main-message-content"
    }, [_c('p', [_vm._v("检查资料已上传")])], 1), _vm._v(" "), (msg.from === _vm.userData.account) ? _c('figure', {
      staticClass: "main-message-img"
    }, [_c('img', {
      attrs: {
        "src": _vm.logoUrl,
        "alt": ""
      }
    })]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'reviewCaseSuccess') ? _c('reviewCaseSuccess', {
      attrs: {
        "doctorCustomerId": _vm.doctorCustomerId,
        "mpcomid": '9-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 5) ? _c('MiddleTips', {
      attrs: {
        "tipsType": 5,
        "msg": msg,
        "mpcomid": '10-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'notification' && msg.content.data.actionType == 7) ? _c('MiddleTips', {
      attrs: {
        "tipsType": 7,
        "mpcomid": '11-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'refusePatient') ? _c('MiddleTips', {
      attrs: {
        "tipsType": 6,
        "tipsText": msg.content.text,
        "mpcomid": '12-' + index
      }
    }) : _vm._e(), _vm._v(" "), (msg.type === 'custom' && msg.content.type === 'deleteMsgTips') ? _c('section', {
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message"
    }, [(msg.from === _vm.targetData.account) ? _c('p', [_vm._v("分诊医生撤回了一条消息")]) : _vm._e(), _vm._v(" "), (msg.from !== _vm.targetData.account) ? _c('p', [_vm._v("您撤回了一条消息")]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (msg.type === 'healthCard') ? _c('section', {
      staticClass: "main-message-box grey-tips"
    }, [_c('figcaption', {
      staticClass: "first-message",
      attrs: {
        "eventid": '8-' + index
      },
      on: {
        "click": _vm.goToGetHealthCard
      }
    }, [_c('p', {
      staticClass: "getHealthCard-one"
    }, [_vm._v("领取居民健康卡，有利于医生了解您的病情")]), _vm._v(" "), _c('p', {
      staticClass: "getHealthCard"
    }, [_vm._v("立即领取 >")])], 1)], 1) : _vm._e()], 1)
  })), _vm._v(" "), (_vm.inputBoxShow && _vm.triageType !== 0) ? _c('footer', {
    class: _vm.footerPosition
  }, [_c('section', {
    staticClass: "footer-box-top"
  }, [_c('section', {
    staticClass: "main-input-box-plus",
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": _vm.showTabbar
    }
  }, [_c('i', {
    staticClass: "icon-im-plus"
  })], 1), _vm._v(" "), _c('figure', {
    staticClass: "main-input-box-textarea-inner"
  }, [_c('form', {
    staticClass: "patientForm",
    attrs: {
      "report-submit": "true",
      "id": "baseIm",
      "eventid": '12'
    },
    on: {
      "submit": _vm.formSubmitName
    }
  }, [_c('section', {
    staticClass: "area-content"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.sendTextContent),
      expression: "sendTextContent"
    }],
    staticClass: "main-input-box-textarea",
    attrs: {
      "disabled": _vm.disabled,
      "type": "text",
      "maxlength": "500",
      "cursor-spacing": "5",
      "eventid": '10'
    },
    domProps: {
      "value": (_vm.sendTextContent)
    },
    on: {
      "focus": _vm.scrollToBottom,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.sendTextContent = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('button', {
    staticClass: "main-input-box-send",
    class: {
      'on': _vm.sendTextContent.length
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '11'
    },
    on: {
      "click": _vm.sendMessage
    }
  }, [_vm._v("发送\n          ")])], 1)], 1)], 1), _vm._v(" "), (_vm.footerBottomFlag) ? _c('ul', {
    staticClass: "footer-box-bottom"
  }, [(_vm.toolbarConfig.image) ? _c('li', {
    staticClass: "bottom-item",
    attrs: {
      "eventid": '13'
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
      "eventid": '14'
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
  }, [_vm._v("视频")])], 1)], 1) : _vm._e()], 1) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('Suggestion', {
    attrs: {
      "customerId": _vm.patientCustomerId,
      "isLeave": _vm.isLeave,
      "triageCustomerId": _vm.cId,
      "eventid": '15',
      "mpcomid": '13'
    },
    on: {
      "update:isLeave": function($event) {
        _vm.isLeave = $event
      }
    }
  }), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '14'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '15'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensure', {
    attrs: {
      "ensureParams": {
        'content': '抱歉，经平台审核，您的咨询不在该医生的接诊范围，请咨询其他匹配医生',
        'ensure': '好的'
      },
      "eventid": '16',
      "mpcomid": '16'
    },
    on: {
      "ensureClickEvent": _vm.ensureClickEvent
    }
  }) : _vm._e(), _vm._v(" "), _c('black-list', {
    attrs: {
      "mpcomid": '17'
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3f79aaed", esExports)
  }
}

/***/ })

},[1241]);