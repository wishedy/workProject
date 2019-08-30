global.webpackJsonp([54],{

/***/ 1073:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorQuestionList_vue__ = __webpack_require__(1075);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5bfcfedf_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorQuestionList_vue__ = __webpack_require__(1076);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1074)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorQuestionList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5bfcfedf_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorQuestionList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/findDoctorQuestionList/findDoctorQuestionList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] findDoctorQuestionList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5bfcfedf", Component.options)
  } else {
    hotAPI.reload("data-v-5bfcfedf", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1074:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1075:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_consult_questionList__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);
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




/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      scene: "findDoctor"
    };
  },

  methods: {
    goToNext: function goToNext(param) {
      wx.navigateTo({
        url: "/packageE/findDoctorAffirmOrder/findDoctorAffirmOrder"
      });
    }
  },
  mounted: function mounted() {},
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: {},
  components: {
    HeaderProgress: __WEBPACK_IMPORTED_MODULE_1_components_consult_headerProgress__["a" /* default */],
    QuestionList: __WEBPACK_IMPORTED_MODULE_0_components_consult_questionList__["a" /* default */]
  }
});

/***/ }),

/***/ 1076:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [_c('HeaderProgress', {
    attrs: {
      "progress": 3,
      "mpcomid": '0'
    }
  }), _vm._v(" "), _c('QuestionList', {
    attrs: {
      "scene": _vm.scene,
      "eventid": '0',
      "mpcomid": '1'
    },
    on: {
      "questionListCb": _vm.goToNext
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5bfcfedf", esExports)
  }
}

/***/ })

},[1306]);