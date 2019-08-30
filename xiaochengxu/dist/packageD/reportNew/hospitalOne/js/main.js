global.webpackJsonp([67],{

/***/ 933:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_hospitalOne_vue__ = __webpack_require__(935);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6f5531b8_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_hospitalOne_vue__ = __webpack_require__(936);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(934)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-6f5531b8"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_hospitalOne_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_6f5531b8_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_hospitalOne_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/hospitalOne.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] hospitalOne.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-6f5531b8", Component.options)
  } else {
    hotAPI.reload("data-v-6f5531b8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 934:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 935:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_ReportProgress__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_QuestionTextarea__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_report_createReport__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_report_getReportList__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_SelectTime__ = __webpack_require__(93);


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
//
//





 //完善保存信息
 //获取保存信息




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_9_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isProgress: false,
      reportContentList: [],
      isLoading: false,
      textAreaTitle: '请填写本次住院的疾病（或症状）',
      textDesc: '',
      textareaLen: 100,
      titleTip: '',
      hospitalTime: {
        title: '本次住院的时间',
        timeDate: ''
      },
      isBtnClick: false
    };
  },

  components: {
    questionTextArea: __WEBPACK_IMPORTED_MODULE_5__components_QuestionTextarea__["a" /* default */],
    selectTime: __WEBPACK_IMPORTED_MODULE_11__components_SelectTime__["a" /* default */],
    reportProgress: __WEBPACK_IMPORTED_MODULE_4__components_ReportProgress__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_8_components_LogoLoading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId'])),
  methods: {
    textChange: function textChange(text) {
      this.textDesc = text;
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    contentLimit: function contentLimit() {
      var _this = this,
          getLen = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getByteLen(_this.textDesc);
      _this.textareaLen = 100 - getLen;
      if (_this.textDesc && getLen > 100) {
        _this.textDesc = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getStrByteLen(_this.textDesc, 100);
        _this.textareaLen = 0;
      }
    },

    //下一步
    nextSubmit: function nextSubmit() {
      var _this = this;
      if (_this.textDesc && !_this.isBtnClick) {
        _this.isBtnClick = true;
        var paramData = {
          reportId: _this.reportId,
          sortId: 17,
          patientId: _this.patientId,
          doctorId: _this.doctorCustomerId,
          reportIsFinish: 0,
          reportContentList: [{ id: '', reportValue: _this.textDesc }, { id: '', reportValue: _this.hospitalTime.timeDate }],
          oldReportContentList: _this.reportContentList
        };
        console.log(paramData);
        _this.isLoading = true;
        Object(__WEBPACK_IMPORTED_MODULE_6_common_js_report_createReport__["a" /* default */])(paramData).then(function (res) {
          _this.isLoading = false;
          _this.isBtnClick = false;
          if (res && res.responseObject && res.responseObject.responseStatus) {
            wx.navigateTo({
              url: '/packageD/reportNew/hospitalTwo'
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
        // pageSort:'QB1'
        sortId: 17
      };
      _this.isLoading = true;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_report_getReportList__["a" /* default */])(paramData).then(function (res) {
        _this.isLoading = false;
        if (res && res.reportMap && res.reportMap.reportContentList && res.reportMap.reportContentList.length) {
          _this.reportContentList = res.reportMap.reportContentList;
          _this.textDesc = _this.reportContentList[0].illnessContent;
          if (_this.reportContentList[1].visitDate) {
            _this.hospitalTime.timeDate = _this.reportContentList[1].visitDate;
          }
          _this.contentLimit();
        } else {
          _this.reportContentList = [];
        }
      });
    },
    getCurrentTime: function getCurrentTime() {
      var str = '',
          date = new Date(),
          year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      str = year + '-' + month + '-' + day;
      return str;
    }
  },
  onShow: function onShow() {
    this.isBtnClick = false;
    this.isLoading = false;
    this.getReportInfo();

    __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
      resourceId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        doctorId: this.doctorCustomerId,
        patientId: this.patientId
      })
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    this.textDesc = '';
    this.textareaLen = 100;
    this.hospitalTime.timeDate = this.getCurrentTime();
    this.isProgress = true;
  },
  onUnload: function onUnload() {
    this.isProgress = false;
  }
});

/***/ }),

/***/ 936:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "reportMain"
  }, [(_vm.isProgress) ? _c('report-progress', {
    attrs: {
      "progress": '10%',
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
  }, [_vm._v(_vm._s(_vm.textareaLen))])])], 1), _vm._v(" "), _c('select-time', {
    attrs: {
      "timeObj": _vm.hospitalTime,
      "mpcomid": '1'
    }
  }), _vm._v(" "), _c('form', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-6f5531b8", esExports)
  }
}

/***/ })

},[1278]);