global.webpackJsonp([40],{

/***/ 468:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMainAffirmOrder_vue__ = __webpack_require__(470);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4761ece7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMainAffirmOrder_vue__ = __webpack_require__(482);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(469)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4761ece7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMainAffirmOrder_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4761ece7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMainAffirmOrder_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/doctorMainAffirmOrder.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorMainAffirmOrder.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4761ece7", Component.options)
  } else {
    hotAPI.reload("data-v-4761ece7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 469:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 470:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_affirmOrder__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_updateConsultation__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_updateConsultationState__ = __webpack_require__(91);


//
//
//
//
//
//
//




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;


 // 返回首页组件


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    var newVar = {
      orderParams: {},
      orderShow: false,
      backIndexShow: false // 返回首页是否显示
    };
    return newVar;
  },
  onLoad: function onLoad() {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.orderParams = {
      from: "doctorHome",
      doctorId: this.idList.doctorId,
      caseId: this.idList.caseId,
      patientId: this.idList.patientId
    };
    this.orderShow = true;
  },
  onUnload: function onUnload() {
    this.orderShow = false;
    this.orderParams = {};
  },

  methods: {
    // 支付成功的回调；
    toUpLoadTimes: function toUpLoadTimes(opt) {
      var _this2 = this;

      var _this = this;
      if (_this.idList.caseType == '15') {
        this.refreshState(-1);
        var urlTemp = "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + _this.idList.caseId + "&doctorCustomerId=" + _this.idList.doctorId + "&patientId=" + _this.idList.patientId + "&from=doctorHome";
        wx.redirectTo({
          url: urlTemp
        });
      } else {
        Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_updateConsultation__["a" /* default */])({
          consultationId: __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("orderSourceId"), //和主诊医生的会话Id
          frequency: opt.orderFrequency,
          frequencyType: "2",
          consultationLevel: opt.orderType,
          consultationState: -1
        }).then(function (data) {
          if (data.responseObject.responseStatus) {
            __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].setItem("sendTips", __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(opt));
            _this2.refreshState(-1);
            var _urlTemp = "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + _this.idList.caseId + "&doctorCustomerId=" + _this.idList.doctorId + "&patientId=" + _this.idList.patientId + "&from=doctorHome";
            wx.redirectTo({
              url: _urlTemp
            });
          }
        });
      }
    },

    // 更新分诊状态
    refreshState: function refreshState(state) {
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_updateConsultationState__["a" /* default */])({
        consultationIds: this.idList.orderSourceId,
        consultationState: state //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          console.log("状态更新成功" + state);
        } else {
          console.log("状态更新失败" + data);
        }
      });
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["idList"])),
  components: {
    affirmOrder: __WEBPACK_IMPORTED_MODULE_4_components_affirmOrder__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_5_components_backIndex__["a" /* default */]
  }
});

/***/ }),

/***/ 482:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.orderShow) ? _c('affirmOrder', {
    attrs: {
      "orderParams": _vm.orderParams,
      "caseType": _vm.idList.caseType,
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4761ece7", esExports)
  }
}

/***/ })

},[1225]);