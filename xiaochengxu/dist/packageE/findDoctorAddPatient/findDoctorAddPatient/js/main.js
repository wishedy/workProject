global.webpackJsonp([57],{

/***/ 1057:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorAddPatient_vue__ = __webpack_require__(1059);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ce77b9f_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorAddPatient_vue__ = __webpack_require__(1060);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1058)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorAddPatient_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ce77b9f_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorAddPatient_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/findDoctorAddPatient/findDoctorAddPatient.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] findDoctorAddPatient.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ce77b9f", Component.options)
  } else {
    hotAPI.reload("data-v-2ce77b9f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1058:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1059:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_consult_addPatient__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vuex__ = __webpack_require__(4);


//
//
//
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
 * Created by lichenyang on 2018/8/9.
 */


 // 返回首页组件
// import HeaderProgress from "components/consult/headerProgress";



/**************************Base Vue-Methods*************************/


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('findDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      loading: false, // 控制 Loading；
      headTitle: '', // 头部title
      doctorCustomerId: 0, // 医生id
      backIndexShow: false // 返回首页是否显示
    };
  },
  onShow: function onShow() {
    if (__WEBPACK_IMPORTED_MODULE_7_localStorage__["a" /* default */].getItem("userId")) {
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse({
        browseType: "92",
        opDesc: "新就诊人信息添加-已登录找医生（小程序）"
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse({
        browseType: "91",
        opDesc: "新就诊人信息添加-未登录找医生（小程序）"
      });
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad(options) {
    this.loading = true;
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    // 从患者列表进来没有医生id，所以添加容错；
    if (options && options.doctorCustomerId) {
      this.doctorCustomerId = options.doctorCustomerId;
      this.setDoctorCustomerId(options.doctorCustomerId);
    }
    this.partName = options.partName;
    this.caseType = options.caseType;
    this.partId = options.partId;
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
    this.init();
  },
  onUnload: function onUnload() {
    console.log('onUnload');
    this.setDoctorMessage({}); // 返回的时候清掉医生的数据；
    this.headTitle = ""; // 返回的时候清空头部话术；
  },

  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapActions(["getDoctorMsg", 'setQrCode', "setOrderMessage"]), mapMutations(["setDoctorMessage", "setDoctorCustomerId"]), {
    /** 页面初始化 */
    init: function init() {
      var _this = this;

      var doctorMessage = this.doctorMessage;
      if (doctorMessage && !!doctorMessage.doctorName) {
        this.headTitle = "\u4E0E" + doctorMessage.doctorName + "\u533B\u751F\u6C9F\u901A\u524D\uFF0C\u8BF7\u5148\u5B8C\u5584\u5C31\u8BCA\u4EBA\u4FE1\u606F\u548C\u75C5\u60C5\u8D44\u6599\u3002";
        this.loading = false;
      } else {
        this.getDoctorMsg(this.doctorCustomerId).then(function () {
          _this.headTitle = "\u4E0E" + _this.doctorMessage.doctorName + "\u533B\u751F\u6C9F\u901A\u524D\uFF0C\u8BF7\u5148\u5B8C\u5584\u5C31\u8BCA\u4EBA\u4FE1\u606F\u548C\u75C5\u60C5\u8D44\u6599\u3002";
          _this.loading = false;
        });
      }
    },

    /** 去选择部位 */
    toSelectPart: function toSelectPart(patientItem) {
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14159,
        browseType: "92",
        opDesc: "新患者信息添加"
      });
      var caseParam = {
        "visitSiteId": __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getSiteId(),
        "customerId": this.customerId + "",
        "patientId": patientItem.patientId,
        "patientName": patientItem.patientName,
        "patientAge": patientItem.patientAge,
        "caseType": this.caseType,
        "openId": this.openId,
        "partId": this.partId,
        "sex": patientItem.patientSex
      };
      this.findDoctorAffirmOrder(caseParam);
      // wx.navigateTo({
      //   url: '/packageE/findDoctorSelectPart/findDoctorSelectPart'
      // });
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
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(["doctorMessage"]), mapGetters(["orderMessage"])),
  mounted: function mounted() {
    this.init();
  },

  components: {
    BackIndex: __WEBPACK_IMPORTED_MODULE_4_components_backIndex__["a" /* default */],
    // HeaderProgress,
    NormalLoading: __WEBPACK_IMPORTED_MODULE_5_components_loading__["a" /* default */],
    AddPatient: __WEBPACK_IMPORTED_MODULE_3_components_consult_addPatient__["a" /* default */]
  }
});

/***/ }),

/***/ 1060:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('AddPatient', {
    attrs: {
      "headTitle": _vm.headTitle,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPartCb": _vm.toSelectPart
    }
  }), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '2'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2ce77b9f", esExports)
  }
}

/***/ })

},[1302]);