global.webpackJsonp([83],{

/***/ 910:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_clinicFourA_vue__ = __webpack_require__(912);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3afd3782_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_clinicFourA_vue__ = __webpack_require__(916);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(911)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3afd3782"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_clinicFourA_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3afd3782_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_clinicFourA_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/clinicFourA.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] clinicFourA.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3afd3782", Component.options)
  } else {
    hotAPI.reload("data-v-3afd3782", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 911:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 912:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_SelectDate__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_report_createReport__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_report_getReportList__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_dataLog_dataLog__ = __webpack_require__(7);


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




 //完善保存信息
 //获取保存信息




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isProgress: false,
      reportContentList: [],
      isLoading: false,
      isBtnClick: false,
      reviewTime: {
        title: '请选择复诊日期',
        array: ['三天后复查', '一周后复查', '两周后复查', '两个月后复查', '三个月后复查', '半年后复查', '一年后复查'],
        index: ''
      }
    };
  },

  components: {
    selectDate: __WEBPACK_IMPORTED_MODULE_4__components_SelectDate__["a" /* default */],
    reportProgress: __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_7_components_LogoLoading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId'])),
  methods: {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    //下一步
    nextSubmit: function nextSubmit() {
      var _this = this;
      if (this.reviewTime.index.length && !this.isBtnClick) {
        this.isBtnClick = true;
        var paramData = {
          reportId: _this.reportId,
          sortId: 11,
          patientId: _this.patientId,
          doctorId: _this.doctorCustomerId,
          reportIsFinish: 1,
          reportContentList: [{ id: '', reportValue: parseInt(_this.reviewTime.index, 10) + 1 }],
          oldReportContentList: _this.reportContentList
        };
        console.log(paramData);
        _this.isLoading = true;
        Object(__WEBPACK_IMPORTED_MODULE_5_common_js_report_createReport__["a" /* default */])(paramData).then(function (res) {
          _this.isLoading = false;
          _this.isBtnClick = false;
          if (res && res.responseObject && res.responseObject.responseStatus) {
            console.log('wanchengIM');
            wx.setStorageSync("backIndex", true);
            wx.reLaunch({
              url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + _this.caseId + "&doctorCustomerId=" + _this.doctorCustomerId + "&patientId=" + _this.patientId + "&reportId=" + _this.reportId + "&from=report"
            });
          } else {
            wx.showToast({
              title: '保存失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    },

    //获取报道信息
    getReportInfo: function getReportInfo() {
      var _this = this,
          paramData = {
        reportId: _this.reportId,
        // pageSort:'QA4_1'
        sortId: 11
      };
      _this.isLoading = true;
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_report_getReportList__["a" /* default */])(paramData).then(function (res) {
        _this.isLoading = false;
        if (res && res.reportMap && res.reportMap.reportContentList && res.reportMap.reportContentList.length) {
          _this.reportContentList = res.reportMap.reportContentList;
          _this.textDesc = _this.reportContentList[0].reviewTimeType;
        } else {
          _this.reportContentList = [];
        }
      });
    }
  },
  onShow: function onShow() {
    this.isBtnClick = false;
    this.isLoading = false;
    this.getReportInfo();
    __WEBPACK_IMPORTED_MODULE_9_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
      resourceId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        doctorId: this.doctorCustomerId,
        patientId: this.patientId
      })
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_9_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    this.reviewTime.index = '';
    this.isProgress = true;
  },
  onUnload: function onUnload() {
    this.isProgress = false;
  }
});

/***/ }),

/***/ 916:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "reportMain"
  }, [(_vm.isProgress) ? _c('report-progress', {
    attrs: {
      "progress": '90%',
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), _c('select-date', {
    attrs: {
      "dateObj": _vm.reviewTime,
      "mpcomid": '1'
    }
  }), _vm._v(" "), _c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "question-next",
    class: {
      'active': _vm.reviewTime.index.length
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '0'
    },
    on: {
      "click": _vm.nextSubmit
    }
  }, [_vm._v("下一步")])], 1), _vm._v(" "), (_vm.isLoading) ? _c('logo-loading', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3afd3782", esExports)
  }
}

/***/ })

},[1273]);