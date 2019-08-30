global.webpackJsonp([85],{

/***/ 929:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_clinicFiveA_vue__ = __webpack_require__(931);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dc1cdb9a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_clinicFiveA_vue__ = __webpack_require__(932);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(930)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-dc1cdb9a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_clinicFiveA_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dc1cdb9a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_clinicFiveA_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/clinicFiveA.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] clinicFiveA.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dc1cdb9a", Component.options)
  } else {
    hotAPI.reload("data-v-dc1cdb9a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 930:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 931:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_report_createReport__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_report_getReportList__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_QuestionTextarea__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_LogoLoading__ = __webpack_require__(14);

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
//




 //完善保存信息
 //获取保存信息




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_7_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isProgress: false,
      reportContentList: [],
      isLoading: false,
      textAreaTitle: '请填写住院号',
      textDesc: '',
      textareaLen: 100,
      titleTip: '请在床头卡或腕带查看',
      isBtnClick: false
    };
  },

  components: {
    questionTextArea: __WEBPACK_IMPORTED_MODULE_6__components_QuestionTextarea__["a" /* default */],
    reportProgress: __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_8_components_LogoLoading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId'])),
  methods: {
    textChange: function textChange(text) {
      this.textDesc = text;
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    contentLimit: function contentLimit() {
      var _this = this,
          getLen = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getByteLen(_this.textDesc);
      _this.textareaLen = 100 - getLen;
      if (_this.textDesc && getLen > 100) {
        _this.textDesc = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(_this.textDesc, 100);
        _this.textareaLen = 0;
      }
    },

    //下一步
    nextSubmit: function nextSubmit() {
      var _this = this;
      if (this.textDesc && !this.isBtnClick) {
        _this.isBtnClick = true;
        var paramData = {
          reportId: _this.reportId,
          sortId: 16,
          patientId: _this.patientId,
          doctorId: _this.doctorCustomerId,
          reportIsFinish: 1,
          reportContentList: [{ id: '', reportValue: _this.textDesc }],
          oldReportContentList: _this.reportContentList
        };
        console.log(paramData);
        _this.isLoading = true;
        Object(__WEBPACK_IMPORTED_MODULE_4_common_js_report_createReport__["a" /* default */])(paramData).then(function (res) {
          _this.isLoading = false;
          _this.isBtnClick = false;
          if (res && res.responseObject && res.responseObject.responseStatus) {
            console.log('wanchengIM');
            wx.setStorageSync("backIndex", true);
            wx.reLaunch({
              url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + _this.caseId + '&doctorCustomerId=' + _this.doctorCustomerId + '&patientId=' + _this.patientId + '&reportId=' + _this.reportId + '&from=report'
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
        // pageSort:'QA5_2'
        sortId: 16
      };
      _this.isLoading = true;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_report_getReportList__["a" /* default */])(paramData).then(function (res) {
        _this.isLoading = false;
        if (res && res.reportMap && res.reportMap.reportContentList && res.reportMap.reportContentList.length) {
          _this.reportContentList = res.reportMap.reportContentList;
          _this.textDesc = _this.reportContentList[0].uploadBedwordResult;
          _this.contentLimit();
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
  },
  onLoad: function onLoad() {
    this.textDesc = '';
    this.textareaLen = 100;
    this.isProgress = true;
  },
  onUnload: function onUnload() {
    this.isProgress = false;
  }
});

/***/ }),

/***/ 932:
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
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "question-textarea"
  }, [_c('article', {
    staticClass: "question-title"
  }, [_c('span', [_vm._v(_vm._s(_vm.textAreaTitle))]), _vm._v(" "), (_vm.titleTip) ? _c('p', {
    staticClass: "question-desc"
  }, [_vm._v(_vm._s(_vm.titleTip))]) : _vm._e()], 1), _vm._v(" "), _c('figure', {
    staticClass: "textarea-con"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.textDesc),
      expression: "textDesc"
    }],
    attrs: {
      "placeholder": "请输入",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.textDesc)
    },
    on: {
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.textDesc = $event.target.value
      }, _vm.contentLimit]
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "textarea-num",
    class: {
      'active': _vm.textareaLen < 20
    }
  }, [_vm._v(_vm._s(_vm.textareaLen))])])], 1), _vm._v(" "), _c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '2'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "question-next",
    class: {
      'active': _vm.textDesc
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '1'
    },
    on: {
      "click": _vm.nextSubmit
    }
  }, [_vm._v("下一步")])], 1), _vm._v(" "), (_vm.isLoading) ? _c('logo-loading', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-dc1cdb9a", esExports)
  }
}

/***/ })

},[1277]);