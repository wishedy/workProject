global.webpackJsonp([62],{

/***/ 941:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_hospitalTwoA_vue__ = __webpack_require__(943);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_70ca7b13_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_hospitalTwoA_vue__ = __webpack_require__(944);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(942)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-70ca7b13"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_hospitalTwoA_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_70ca7b13_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_hospitalTwoA_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/hospitalTwoA.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] hospitalTwoA.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-70ca7b13", Component.options)
  } else {
    hotAPI.reload("data-v-70ca7b13", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 942:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 943:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_QuestionSelect__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_report_createReport__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_report_getReportList__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_ImgList__ = __webpack_require__(71);


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
      isLoading: false,
      reportContentList: [],
      chooseImg: false,
      progess: '60%',
      question: {
        title: '请拍照上传床头卡或腕带',
        descShow: '便于医生记录病情，指导后续治疗',
        selectText: ['拍照上传', '没在身边，手动填写']
      },
      imgList: {
        title: '请拍照上传床头卡或腕带',
        descShow: '便于医生记录病情，指导后续治疗',
        imgSrcArr: [],
        questionType: '2-2',
        imgReport: []
      }
    };
  },

  watch: {
    imgListLen: function imgListLen() {
      if (this.imgListLen) {
        this.progess = '90%';
      } else {
        this.progess = '60%';
      }
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId']), {
    imgListLen: function imgListLen() {
      return this.imgList.imgSrcArr.length;
    }
  }),
  components: {
    questionSelect: __WEBPACK_IMPORTED_MODULE_2__components_QuestionSelect__["a" /* default */],
    imgList: __WEBPACK_IMPORTED_MODULE_9__components_ImgList__["a" /* default */],
    reportProgress: __WEBPACK_IMPORTED_MODULE_3__components_ReportProgress__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_6_components_LogoLoading__["a" /* default */]
  },
  methods: {
    selctBtnSubmit: function selctBtnSubmit(index) {
      var _this = this;
      if (index == 0) {
        _this.chooseImg = true;
        wx.chooseImage({
          count: 9,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success: function success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            _this.imgList.imgSrcArr = res.tempFiles;
          }
        });
      }
      var paramData = {
        reportId: _this.reportId,
        sortId: 19,
        patientId: _this.patientId,
        doctorId: _this.doctorCustomerId,
        reportIsFinish: 0,
        reportContentList: [{ id: '', reportValue: index + 1 }],
        oldReportContentList: _this.reportContentList
      };
      console.log(paramData);
      _this.isLoading++;
      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_report_createReport__["a" /* default */])(paramData).then(function (res) {
        _this.isLoading--;
        if (res && res.responseObject && res.responseObject.responseStatus) {
          if (index == 1) {
            wx.redirectTo({
              url: '/packageD/reportNew/hospitalTwoB'
            });
          }
        } else {
          wx.showToast({
            title: '保存失败，请重试',
            icon: 'none'
          });
        }
      });
    },

    //获取报道信息
    getReportInfo: function getReportInfo(pageSort, sortId) {
      var _this = this,
          paramData = {
        reportId: _this.reportId,
        // pageSort:pageSort
        sortId: sortId
      };
      _this.isLoading++;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_report_getReportList__["a" /* default */])(paramData).then(function (res) {
        _this.isLoading--;
        if (res && res.reportMap && res.reportMap.reportContentList && res.reportMap.reportContentList.length) {
          if (pageSort == 'QB2_1') {
            _this.reportContentList = res.reportMap.reportContentList;
          } else {
            _this.imgList.imgReport = res.reportMap.reportContentList;
            _this.imgList.imgSrcArr = res.reportMap.attList;
          }
        } else {
          if (pageSort == 'QB2_1') {
            _this.reportContentList = [];
          } else {
            _this.imgList.imgReport = [];
            _this.imgList.imgSrcArr = [];
          }
        }
      });
    }
  },
  onShow: function onShow() {
    this.isLoading = false;
    if (this.imgList.imgSrcArr.length == 0) {
      this.getReportInfo('QB2_1', 19);
      if (!this.chooseImg) {
        this.getReportInfo('QB2_2', 20);
      }
    }

    __WEBPACK_IMPORTED_MODULE_8_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
      resourceId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        doctorId: this.doctorCustomerId,
        patientId: this.patientId
      })
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_8_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    this.imgList.imgSrcArr = [];
    this.chooseImg = false;
    this.isProgress = true;
  },
  onUnload: function onUnload() {
    this.isProgress = false;
  }
});

/***/ }),

/***/ 944:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.isProgress) ? _c('report-progress', {
    attrs: {
      "progress": _vm.progess,
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.imgList.imgSrcArr.length) ? _c('question-select', {
    attrs: {
      "question": _vm.question,
      "eventid": '0',
      "mpcomid": '2'
    },
    on: {
      "btnIndex": _vm.selctBtnSubmit
    }
  }) : _c('img-list', {
    attrs: {
      "imgList": _vm.imgList,
      "mpcomid": '1'
    }
  }), _vm._v(" "), (_vm.isLoading) ? _c('logo-loading', {
    attrs: {
      "mpcomid": '3'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-70ca7b13", esExports)
  }
}

/***/ })

},[1280]);