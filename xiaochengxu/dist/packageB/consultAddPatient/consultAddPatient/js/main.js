global.webpackJsonp([103],{

/***/ 602:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultAddPatient_vue__ = __webpack_require__(604);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_610c3904_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultAddPatient_vue__ = __webpack_require__(605);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(603)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultAddPatient_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_610c3904_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultAddPatient_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageB/consultAddPatient/consultAddPatient.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultAddPatient.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-610c3904", Component.options)
  } else {
    hotAPI.reload("data-v-610c3904", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 603:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 604:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_consult_addPatient__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_createConsultation__ = __webpack_require__(70);
//
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


// import HeaderProgress from "components/consult/headerProgress";





/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isLoading: false
    };
  },

  methods: {
    /** 去选择部位 */
    toSelectPart: function toSelectPart(patientItem) {
      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].createTrack({
        actionId: 14159,
        browseType: "108",
        opDesc: "新患者信息添加"
      });
      this.isLoading = true;
      console.log('patientItem --> ', patientItem);
      var _this = this;
      this.patientCustomerId = patientItem.patientCustomerId;
      this.patientId = patientItem.patientId;
      var caseParam = {
        "visitSiteId": __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId(),
        "customerId": this.customerId + "",
        "patientId": patientItem.patientId,
        "patientName": patientItem.patientName,
        "caseType": this.caseType,
        "openId": this.openId,
        "partId": this.partId,
        "sex": patientItem.patientSex
      };
      this.doctorId && (caseParam.doctorId = this.doctorId);

      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/case/v3/create/',
        method: "POST",
        data: caseParam,
        done: function done(response) {
          //console.log('response --> ', response);
          if (response.responseObject.responseStatus) {
            var consultParam = {
              caseId: response.responseObject.responsePk,
              caseType: _this.caseType,
              patientCustomerId: _this.patientCustomerId,
              patientId: _this.patientId,
              consultationType: _this.consultationType,
              consultationState: 4,
              siteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId()
            };
            console.log('consultParam ---> ', consultParam);
            Object(__WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_createConsultation__["a" /* default */])(consultParam).then(function (data) {
              wx.hideLoading();
              _this.isLoading = false;
              if (data.responseObject.responseStatus) {
                if (getCurrentPages().length > 5) {
                  wx.setStorageSync("backIndex", true);
                  wx.reLaunch({
                    url: "/packageA/imScene/imScene?caseId=" + consultParam.caseId + "&patientId=" + consultParam.patientId
                  });
                } else {
                  wx.navigateTo({
                    url: "/packageA/imScene/imScene?caseId=" + consultParam.caseId + "&patientId=" + consultParam.patientId
                  });
                }
              } else {
                console.log('consultParam ---> ', data);
              }
            });
          } else {
            wx.hideLoading();
            console.log('caseParam --> ', response);
          }
        }
      });
      // wx.navigateTo({
      //   url: '/packageB/consultSelectPart/consultSelectPart'
      // });
    }
  },
  mounted: function mounted() {},
  onShow: function onShow() {
    if (__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId")) {
      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].enterBrowse({
        browseType: "109",
        opDesc: "新就诊人信息添加-已登录找医生（小程序）"
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].enterBrowse({
        browseType: "108",
        opDesc: "新就诊人信息添加-未登录找医生（小程序）"
      });
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad(option) {
    this.isLoading = false;
    this.doctorId = option.doctorId;
    this.partId = option.partId;
    this.caseType = 0;
    try {
      this.customerId = wx.getStorageSync('userId');
    } catch (e) {}
    try {
      this.openId = wx.getStorageSync('openId');
    } catch (e) {}
  },

  components: {
    // HeaderProgress,
    AddPatient: __WEBPACK_IMPORTED_MODULE_0_components_consult_addPatient__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_1_components_loading__["a" /* default */]
  }
});

/***/ }),

/***/ 605:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('AddPatient', {
    attrs: {
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPartCb": _vm.toSelectPart
    }
  }), _vm._v(" "), (_vm.isLoading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '1'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-610c3904", esExports)
  }
}

/***/ })

},[1238]);