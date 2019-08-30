global.webpackJsonp([26],{

/***/ 371:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientComment_vue__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_49514194_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientComment_vue__ = __webpack_require__(374);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(372)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientComment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_49514194_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientComment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/patientComment/patientComment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] patientComment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49514194", Component.options)
  } else {
    hotAPI.reload("data-v-49514194", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 372:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dataLog__ = __webpack_require__(7);
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
 * Created by Hallmader on 2018/6/29.
 */



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      webViewUrl: ""
    };
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].leaveBrowse();
  },

  methods: {},
  mounted: function mounted() {
    __WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].setItem("backFromImgCheck", 1);
    var query = this.$root.$mp.query;
    var urlTemp = __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].httpEnv() + "/dist/patientComment.html?patientCustomerId=" + (__WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].getItem("userId") ? __WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].getItem("userId") : query.patientCustomerId) + "&consultationId=" + query.consultationId + "&patientId=" + query.patientId + "&doctorId=" + query.doctorId;

    var blackUserId = __WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].getItem("userId") ? __WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].getItem("userId") : query.patientCustomerId;
    if (blackUserId) {
      urlTemp += "&blackUserId=" + blackUserId;
    }

    this.webViewUrl = urlTemp;
  },

  computed: {}
});

/***/ }),

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('web-view', {
    attrs: {
      "src": _vm.webViewUrl,
      "mpcomid": '0'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-49514194", esExports)
  }
}

/***/ })

},[1211]);