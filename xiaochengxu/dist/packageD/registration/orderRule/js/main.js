global.webpackJsonp([89],{

/***/ 1019:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderRule_vue__ = __webpack_require__(1021);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c8a23516_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderRule_vue__ = __webpack_require__(1022);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1020)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c8a23516"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderRule_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c8a23516_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderRule_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/orderRule.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] orderRule.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c8a23516", Component.options)
  } else {
    hotAPI.reload("data-v-c8a23516", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1020:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1021:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
* @Desc:预约须知
* @Usage:
* @Notify：
* @Depend：
* Created by zh on  2019/5/27
*
*/


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },
  onLoad: function onLoad() {
    console.log('预约须知加载完毕');
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].enterBrowse();
    console.log('预约须知页面显示');
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },

  methods: {}
});

/***/ }),

/***/ 1022:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "rule-main"
  }, [_c('section', {
    staticClass: "booking"
  }, [_c('span', {
    staticClass: "booking-title boking-first"
  }, [_c('span', {
    staticClass: "title-strong"
  }, [_vm._v("1")]), _c('i', {
    staticClass: "title-text"
  }, [_vm._v("预约时间范围")])], 1), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("1.您可预约7日内的号源。")]), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("2.每日12：00停止当日上午挂号，17：30停止当日全部挂号。")])]), _vm._v(" "), _c('section', {
    staticClass: "booking"
  }, [_c('span', {
    staticClass: "booking-title"
  }, [_c('span', {
    staticClass: "title-strong"
  }, [_vm._v("2")]), _c('i', {
    staticClass: "title-text"
  }, [_vm._v("预约实名制")])], 1), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("网上预约挂号采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号和手机号等有效基本信息。")])]), _vm._v(" "), _c('section', {
    staticClass: "booking"
  }, [_c('span', {
    staticClass: "booking-title"
  }, [_c('span', {
    staticClass: "title-strong"
  }, [_vm._v("3")]), _c('i', {
    staticClass: "title-text"
  }, [_vm._v("预约取号")])], 1), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("1.预约成功后，请患者于就诊当日携带有效证件到医院一层服务台验证预约信息（核对与预约登记实名信息一致的本人有效证件）和取号，如验证不符则医院不能提供相应的诊疗服务。")]), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("2.取号时间：上午就诊患者，就诊当日12：00前取号。下午就诊患者，就诊当日下午17：30前取号。过时未取号者，预约作废。")]), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("3.取号地点：一层服务台。")])]), _vm._v(" "), _c('section', {
    staticClass: "booking"
  }, [_c('span', {
    staticClass: "booking-title"
  }, [_c('span', {
    staticClass: "title-strong"
  }, [_vm._v("4")]), _c('i', {
    staticClass: "title-text"
  }, [_vm._v("医生停诊")])], 1), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("如遇特殊情况医生停诊，给您造成的不便敬请谅解。医生临时停诊，工作人员将会用电话方式及时通知您，请配合更改就诊日期或更换其他医生，请您保持电话畅通。")])]), _vm._v(" "), _c('section', {
    staticClass: "booking"
  }, [_c('span', {
    staticClass: "booking-title"
  }, [_c('span', {
    staticClass: "title-strong"
  }, [_vm._v("5")]), _c('i', {
    staticClass: "title-text"
  }, [_vm._v("交通指南")])], 1), _vm._v(" "), _c('span', {
    staticClass: "booking-content"
  }, [_vm._v("重庆市渝北区冉家坝金易E世界4栋")])])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c8a23516", esExports)
  }
}

/***/ })

},[1296]);