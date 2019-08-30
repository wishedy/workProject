global.webpackJsonp([99],{

/***/ 606:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultSelectPart_vue__ = __webpack_require__(608);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_a2b988d8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultSelectPart_vue__ = __webpack_require__(612);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(607)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultSelectPart_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_a2b988d8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultSelectPart_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageB/consultSelectPart/consultSelectPart.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultSelectPart.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-a2b988d8", Component.options)
  } else {
    hotAPI.reload("data-v-a2b988d8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 607:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 608:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_consult_selectPart__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_authorization_authorization__ = __webpack_require__(36);

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






/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },


  methods: {
    goToQuestion: function goToQuestion(data) {
      data.applicationType = this.applicationType;
      this.doctorId && (data.doctorId = this.doctorId);
      this.doctorName && (data.doctorName = this.doctorName);
      console.log('data result ---> ', data);
      wx.navigateTo({
        url: '/packageE/intelligentTriage/intelligentTriage?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
      });
    }
  },
  mounted: function mounted() {},

  computed: {},
  onLoad: function onLoad(option) {
    this.doctorId = '';
    this.doctorName = '';
    this.applicationType = '';
    var data = JSON.parse(decodeURIComponent(option.query));
    this.applicationType = data.applicationType;
    data.doctorId && (this.doctorId = data.doctorId);
    data.doctorName && (this.doctorName = data.doctorName);
  },
  onShow: function onShow() {
    if (this.doctorId) {
      __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].enterBrowse({
        browseType: "93",
        opDesc: "人体图页-找医生"
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].enterBrowse();
    }

    if (__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("PCIMLinks");
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    HeaderProgress: __WEBPACK_IMPORTED_MODULE_2_components_consult_headerProgress__["a" /* default */],
    SelectPart: __WEBPACK_IMPORTED_MODULE_1_components_consult_selectPart__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_5_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 612:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [_c('SelectPart', {
    attrs: {
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPartCb": _vm.goToQuestion
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '1'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-a2b988d8", esExports)
  }
}

/***/ })

},[1239]);