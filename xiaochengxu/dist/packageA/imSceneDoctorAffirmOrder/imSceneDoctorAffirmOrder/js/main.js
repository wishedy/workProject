global.webpackJsonp([113],{

/***/ 691:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imSceneDoctorAffirmOrder_vue__ = __webpack_require__(693);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2a187a1b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imSceneDoctorAffirmOrder_vue__ = __webpack_require__(694);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(692)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imSceneDoctorAffirmOrder_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2a187a1b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imSceneDoctorAffirmOrder_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] imSceneDoctorAffirmOrder.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a187a1b", Component.options)
  } else {
    hotAPI.reload("data-v-2a187a1b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 692:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 693:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_affirmOrder__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_updateConsultation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(4);


//
//
//
//
//
//


 // 返回首页组件




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      orderParams: {},
      orderShow: false,
      orderSourceId: '',
      state: '',
      backIndexShow: false // 返回首页是否显示
    };
  },
  onLoad: function onLoad(options) {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.orderParams = {
      from: "imSceneDoctor",
      doctorId: options.doctorCustomerId,
      caseId: options.caseId,
      patientId: this.patientInfo.patientId
    };
    this.orderSourceId = options.orderSourceId;
    this.state = options.state;
    console.log(this.orderParams);
    this.orderShow = true;
  },
  onUnload: function onUnload() {
    this.orderParams = {};
    this.orderShow = false;
  },

  methods: {
    //跳转IM页面
    goIM: function goIM() {
      wx.navigateBack({
        delta: 1
      });
    },

    // 支付成功的回调；
    toUpLoadTimes: function toUpLoadTimes(opt) {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_updateConsultation__["a" /* default */])({
        consultationId: this.orderSourceId,
        frequency: opt.orderFrequency,
        frequencyType: "2",
        consultationLevel: opt.orderType,
        consultationState: this.state,
        isOuttimeNoReply: "1"
      }).then(function (data) {
        if (data.responseObject.responseStatus && data.responseObject.responseData) {
          wx.setStorageSync('paySuccessParams', __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(opt));
          _this.goIM();
        }
      });
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["patientInfo", 'caseType'])),
  components: {
    affirmOrder: __WEBPACK_IMPORTED_MODULE_2_components_affirmOrder__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_3_components_backIndex__["a" /* default */]
  }
});

/***/ }),

/***/ 694:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [(_vm.orderShow) ? _c('affirmOrder', {
    attrs: {
      "caseType": _vm.caseType,
      "orderParams": _vm.orderParams,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "paySuccess": _vm.toUpLoadTimes
    }
  }) : _vm._e(), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2a187a1b", esExports)
  }
}

/***/ })

},[1244]);