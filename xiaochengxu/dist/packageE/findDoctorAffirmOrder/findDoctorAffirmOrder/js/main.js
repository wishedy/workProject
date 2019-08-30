global.webpackJsonp([56],{

/***/ 1061:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorAffirmOrder_vue__ = __webpack_require__(1063);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3ec10ff2_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorAffirmOrder_vue__ = __webpack_require__(1064);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1062)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorAffirmOrder_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3ec10ff2_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorAffirmOrder_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/findDoctorAffirmOrder/findDoctorAffirmOrder.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] findDoctorAffirmOrder.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3ec10ff2", Component.options)
  } else {
    hotAPI.reload("data-v-3ec10ff2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1062:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1063:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_affirmOrder__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vuex__ = __webpack_require__(4);

//
//
//
//
//
//
//
//
//
//
//
//








var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_6_vuex__["a" /* createNamespacedHelpers */])('findDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      orderParams: {},
      orderShow: false,
      confirmShow: false,
      caseId: '',
      patientId: ''
    };
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      var objTemp = JSON.parse(__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("PCIMLinks"));
      this.caseId = objTemp.caseId;
      this.patientId = objTemp.patientId;
      this.confirmShow = true;
    } else {
      this.confirmShow = false;
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    this.orderParams = {
      from: "findDoctor",
      doctorId: this.doctorCustomerId,
      caseId: this.patientMessage.caseId,
      patientId: this.patientMessage.patientId
    };
    this.orderShow = true;
  },
  onUnload: function onUnload() {
    this.orderShow = false;
    this.confirmShow = false;
    this.orderParams = {};
  },

  methods: {
    //跳转IM页面
    goIM: function goIM(opt) {
      this.confirmShow = false;
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("promotionSubId");
      if (getCurrentPages().length > 5) {
        wx.setStorageSync("backIndex", true);
        wx.reLaunch({
          url: "/packageA/imScene/imScene?caseId=" + opt.caseId + "&patientId=" + this.patientMessage.patientId + "&from=find"
        });
      } else {
        wx.navigateTo({
          url: "/packageA/imScene/imScene?caseId=" + opt.caseId + "&patientId=" + this.patientMessage.patientId + "&from=find"
        });
      }
    },
    storageGoIm: function storageGoIm() {
      this.confirmShow = false;
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("promotionSubId");
      wx.navigateTo({
        url: "/packageA/imScene/imScene?caseId=" + this.caseId + "&patientId=" + this.patientId + "&from=find"
      });
    },

    //返回到医生列表页
    backToHome: function backToHome() {
      this.confirmShow = false;
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["doctorCustomerId"]), mapGetters(["patientMessage", "orderMessage"])),
  components: {
    affirmOrder: __WEBPACK_IMPORTED_MODULE_2_components_affirmOrder__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_3_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 1064:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [(_vm.orderShow) ? _c('affirmOrder', {
    attrs: {
      "orderParams": _vm.orderParams,
      "medicalParams": _vm.orderMessage,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "paySuccess": _vm.goIM
    }
  }) : _vm._e(), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '继续沟通',
        'cancel': '返回首页',
        'title': '您的订单已提交\n无需重复操作'
      },
      "eventid": '1',
      "mpcomid": '1'
    },
    on: {
      "cancelClickEvent": _vm.backToHome,
      "ensureClickEvent": _vm.storageGoIm
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3ec10ff2", esExports)
  }
}

/***/ })

},[1303]);