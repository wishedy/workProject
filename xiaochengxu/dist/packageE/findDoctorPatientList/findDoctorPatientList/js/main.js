global.webpackJsonp([55],{

/***/ 1065:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorPatientList_vue__ = __webpack_require__(1067);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4c45fe37_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorPatientList_vue__ = __webpack_require__(1068);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1066)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorPatientList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4c45fe37_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorPatientList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/findDoctorPatientList/findDoctorPatientList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] findDoctorPatientList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4c45fe37", Component.options)
  } else {
    hotAPI.reload("data-v-4c45fe37", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1066:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1067:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_consult_patientList__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getImStatus__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_common_js_HttpRequest_createConsultation__ = __webpack_require__(70);


//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/7/4.
 */
/**************************Common Components**************************/

 // 返回首页组件




/**************************Axios Http Requests*************************/

 // 找医生流程获取im状态

/**************************Base Vue-Methods*************************/




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_10_vuex__["a" /* createNamespacedHelpers */])('findDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions;



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      headTitle: '', // 头部title
      doctorCustomerId: 0, // 医生id
      loading: false,
      confirmShow: false,
      consultationtype: "",
      patientId: "",
      partName: "",
      caseId: "",
      backIndexShow: false // 返回首页是否显示
    };
  },
  onLoad: function onLoad(options) {
    options = JSON.parse(decodeURIComponent(options.query));
    console.log(options);
    this.loading = true;
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.doctorCustomerId = options.doctorId;
    this.partName = options.partName;
    this.caseType = options.applicationType;
    this.partId = options.partId;
    this.setDoctorCustomerId(options.doctorId);
    this.init();
    if (options.source && options.source === 'qrCode') {
      this.setQrCode(true);
    } else {
      this.setQrCode(false);
    }
    try {
      this.customerId = wx.getStorageSync('userId');
    } catch (e) {}
    try {
      this.openId = wx.getStorageSync('openId');
    } catch (e) {}
  },
  onShow: function onShow() {
    console.log('出现了');
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_7_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].leaveBrowse();
  },
  onUnload: function onUnload() {
    console.log('onUnload');
    this.setDoctorMessage({}); // 返回的时候清掉医生的数据；
    this.headTitle = ""; // 返回的时候清空头部话术；
  },

  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapActions(["getDoctorMsg", "setQrCode", "setOrderMessage"]), mapMutations(["setDoctorMessage", "setDoctorCustomerId"]), {
    /** 页面初始化 */
    init: function init() {
      var _this = this;

      var doctorMessage = this.doctorMessage;
      if (doctorMessage && doctorMessage.doctorName) {
        this.headTitle = "\u4E0E" + doctorMessage.doctorName + "\u533B\u751F\u6C9F\u901A\u524D\uFF0C\u8BF7\u5148\u5B8C\u5584\u5C31\u8BCA\u4EBA\u4FE1\u606F\u548C\u75C5\u60C5\u8D44\u6599\u3002";
        this.loading = false;
      } else {
        this.getDoctorMsg(this.doctorCustomerId).then(function () {
          _this.loading = false;
          _this.headTitle = "\u4E0E" + _this.doctorMessage.doctorName + "\u533B\u751F\u6C9F\u901A\u524D\uFF0C\u8BF7\u5148\u5B8C\u5584\u5C31\u8BCA\u4EBA\u4FE1\u606F\u548C\u75C5\u60C5\u8D44\u6599\u3002";
        }).catch(function (err) {
          console.log(err);
          _this.loading = false;
        });
      }
    },

    /** 去选择部位 */
    toSelectPart: function toSelectPart(patientItem) {
      var _this2 = this;

      if (this.loading) return;
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14157,
        keyword: patientItem.patientName
      });
      this.loading = true;

      var caseParam = {
        "visitSiteId": __WEBPACK_IMPORTED_MODULE_13_common_js_util_util__["a" /* default */].getSiteId(),
        "customerId": this.customerId + "",
        "patientId": patientItem.patientId,
        "patientName": patientItem.patientName,
        "patientAge": patientItem.patientAge,
        "caseType": this.caseType,
        "openId": this.openId,
        "partId": this.partId,
        "sex": patientItem.patientSex
      };

      // 找医生流程获取im状态
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getImStatus__["a" /* default */])({
        doctorCustomerId: this.doctorCustomerId,
        patientId: patientItem.patientId
      }).then(function (data) {
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData;

        if (responseStatus) {
          var caseId = responseData.caseId,
              isIntoIm = responseData.isIntoIm,
              consultationtype = responseData.consultationtype;

          if (!caseId) {
            _this2.findDoctorAffirmOrder(caseParam);
          } else {
            if (isIntoIm) {
              _this2.confirmShow = true;
              _this2.loading = false;
              _this2.consultationtype = consultationtype;
              _this2.patientId = patientItem.patientId;
              _this2.caseId = caseId;
            } else {
              _this2.findDoctorAffirmOrder(caseParam);
            }
          }
        }
        _this2.loading = false;
        console.log(data);
      }).catch(function (err) {
        console.log(err);
      }).finally(function () {});
    },

    //跳转IM
    toImPage: function toImPage() {
      var _this3 = this;

      if (parseInt(this.consultationtype)) {
        wx.navigateTo({
          url: "/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=" + this.doctorCustomerId + "&patientId=" + this.patientId + "&caseId=" + this.caseId,
          complete: function complete() {
            _this3.confirmShow = false;
            _this3.consultationtype = "";
            _this3.patientId = "";
            _this3.caseId = "";
          }
        });
      } else {
        wx.navigateTo({
          url: "/packageA/imScene/imScene?patientId=" + this.patientId + "&caseId=" + this.caseId + "&from=find",
          complete: function complete() {
            _this3.confirmShow = false;
            _this3.consultationtype = "";
            _this3.patientId = "";
            _this3.caseId = "";
          }
        });
      }
    },

    /** 去添加患者 */
    toAddPatient: function toAddPatient() {
      var url = void 0;
      if (this.qrCode) {
        url = "/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=" + this.doctorCustomerId + "&source=qrCode&partName=" + this.partName + "&caseType=" + this.caseType + "&partId=" + this.partId;
      } else {
        url = "/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=" + this.doctorCustomerId + "&partName=" + this.partName + "&caseType=" + this.caseType + "&partId=" + this.partId;
      }
      wx.navigateTo({
        url: url
      });
    },

    /** 替换患者列表 */
    redirectToAddPatient: function redirectToAddPatient() {
      var url = void 0;
      if (this.qrCode) {
        url = "/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=" + this.doctorCustomerId + "&source=qrCode&partName=" + this.partName + "&caseType=" + this.caseType + "&partId=" + this.partId;
      } else {
        url = "/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=" + this.doctorCustomerId + "&partName=" + this.partName + "&caseType=" + this.caseType + "&partId=" + this.partId;
      }
      wx.redirectTo({
        url: url
      });
    },
    findDoctorAffirmOrder: function findDoctorAffirmOrder(caseParam) {
      // let _this = this;
      // api.ajax({
      //   url:  api.httpEnv() + '/mcall/customer/patient/case/v3/create/',
      //   method: "POST",
      //   data: caseParam,
      //   done(response) {
      //     if (response.responseObject.responseStatus) {
      //       if (_this.applicationType == '12') {
      //         const consultParam = {
      //           caseId: response.responseObject.responsePk,
      //           caseType: _this.caseType,
      //           patientCustomerId: _this.patientCustomerId,
      //           patientId: _this.patientId,
      //           consultationType: _this.consultationType,
      //           consultationState: 4,
      //           siteId: api.getSiteId()
      //         }
      //         createConsultation(consultParam).then(data => {
      //           if (data.responseObject.responseStatus) {
      //             wx.reLaunch({
      //               url: `/packageA/imScene/imScene?caseId=${consultParam.caseId}&patientId=${consultParam.patientId}`
      //             });
      //           } else {
      //             console.log('createConsultation error')
      //           }
      //         });
      //       } else {
      //
      //       }
      //
      //     } else {
      //       console.log('caseParam error')
      //     }
      //   }
      // })
      console.log('伪造一下订单信息吧');
      var medicalShow = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()(this.orderMessage.medicalShow, {
        patientName: caseParam.patientName,
        sex: caseParam.sex,
        age: caseParam.patientAge,
        partName: this.partName
      });
      //订单信息伪造
      this.setOrderMessage({
        medicalShow: medicalShow,
        medicalCreate: caseParam
      });
      wx.navigateTo({
        url: "/packageE/findDoctorAffirmOrder/findDoctorAffirmOrder"
      });
    }
  }),
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(["doctorMessage"]), mapGetters(['qrCode', "orderMessage"])),
  components: {
    HeaderProgress: __WEBPACK_IMPORTED_MODULE_4_components_consult_headerProgress__["a" /* default */],
    PatientList: __WEBPACK_IMPORTED_MODULE_2_components_consult_patientList__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_5_components_loading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_11_components_confirm__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_3_components_backIndex__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_12_components_BlackList__["a" /* default */]
  }
});

/***/ }),

/***/ 1068:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('PatientList', {
    attrs: {
      "headTitle": _vm.headTitle,
      "scene": 'findDoctor',
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPatientCb": _vm.toSelectPart,
      "addPatientCb": _vm.toAddPatient,
      "redirectPatientCb": _vm.redirectToAddPatient
    }
  }), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '2'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '去沟通',
        'cancel': '取消',
        'title': '您与该医生有正在进行中的咨询，现在继续去沟通吗？'
      },
      "eventid": '1',
      "mpcomid": '3'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.confirmShow = false
      },
      "ensureClickEvent": _vm.toImPage
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '4'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4c45fe37", esExports)
  }
}

/***/ })

},[1304]);