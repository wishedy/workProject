global.webpackJsonp([18],{

/***/ 858:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientInfo_vue__ = __webpack_require__(860);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_91040c82_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientInfo_vue__ = __webpack_require__(865);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(859)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-91040c82"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientInfo_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_91040c82_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientInfo_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/patientInfo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] patientInfo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-91040c82", Component.options)
  } else {
    hotAPI.reload("data-v-91040c82", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 859:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 860:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_report_createMainReport__ = __webpack_require__(861);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_QuestionSelect__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getImStatus__ = __webpack_require__(185);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vuex__ = __webpack_require__(4);


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


 //创建主报道信息


 // 找医生流程获取im状态



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  components: {
    questionSelect: __WEBPACK_IMPORTED_MODULE_5__components_QuestionSelect__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_4_components_LogoLoading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_2_components_confirm__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId', 'doctorMessage'])),
  data: function data() {
    return {
      confirmShow: false,
      consultationtype: '',
      imPatientId: '',
      imCaseId: '',
      isLoading: false,
      showQuestion: false,
      question: {
        title: '您本次的就诊方式是',
        descShow: '',
        selectText: ['门诊', '住院', '未就诊']
      }
    };
  },
  onUnload: function onUnload() {
    this.showQuestion = false;
  },
  onLoad: function onLoad() {
    this.showQuestion = true;
  },
  onShow: function onShow() {
    this.confirmShow = false;
    this.isLoading = false;
    this.consultationtype = '';
    this.imPatientId = '';
    this.imCaseId = '';
    wx.removeStorageSync('reportPatient', true);

    __WEBPACK_IMPORTED_MODULE_7_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
      resourceId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        doctorId: this.doctorCustomerId
      })
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_7_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },

  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapMutations(['setCaseId', 'setReportId']), {
    //跳转IM
    toImPage: function toImPage() {
      var _this = this,
          url = '';
      if (parseInt(_this.consultationtype, 10)) {
        url = '/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=' + _this.doctorCustomerId + '&patientId=' + _this.imPatientId + '&caseId=' + _this.imCaseId;
      } else {
        url = '/packageA/imScene/imScene?patientId=' + _this.imPatientId + '&caseId=' + _this.imCaseId + '&from=find';
      }
      wx.navigateTo({
        url: url,
        complete: function complete() {
          _this.confirmShow = false;
          _this.consultationtype = "";
          _this.imPatientId = "";
          _this.imCaseId = "";
        }
      });
    },

    /** 去选择部位 */
    toSelectPart: function toSelectPart() {
      var _this = this;
      _this.loading = true;
      // 找医生流程获取im状态

      var navData = {
        applicationType: '12',
        doctorId: _this.doctorCustomerId,
        doctorName: _this.doctorMessage.fullName
      };

      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getImStatus__["a" /* default */])({
        doctorCustomerId: _this.doctorCustomerId,
        patientId: _this.patientId
      }).then(function (data) {
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData;

        if (responseStatus) {
          var caseId = responseData.caseId,
              isIntoIm = responseData.isIntoIm,
              consultationtype = responseData.consultationtype;

          if (!caseId) {
            wx.navigateTo({
              url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(navData)),
              complete: function complete() {
                _this.loading = false;
              }
            });
          } else {
            if (isIntoIm) {
              _this.confirmShow = true;
              _this.loading = false;
              _this.imPatientId = _this.patientId;
              _this.consultationtype = consultationtype;
              _this.imCaseId = caseId;
            } else {
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(navData)),
                //url: `/packageE/findDoctorSelectPart/findDoctorSelectPart?patientId=${_this.patientId}&doctorId=${_this.doctorCustomerId}`,
                complete: function complete() {
                  _this.loading = false;
                }
              });
            }
          }
        }
        _this.loading = false;
      }).catch(function (err) {
        console.log(err);
      }).finally(function () {});
    },
    selctBtnSubmit: function selctBtnSubmit(index) {
      var _this = this,
          url = '',
          param = void 0,
          reportType = '';
      var types = ["门诊", "住院", "未就诊"];
      // 就诊信息-就诊方式页面
      __WEBPACK_IMPORTED_MODULE_7_common_js_dataLog_dataLog__["a" /* default */].createTrack({
        actionId: 14226,
        browseType: 148,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ doctorId: _this.doctorCustomerId, patientId: _this.patientId, treatType: types[index] })
      });

      switch (index) {
        case 0:
          // 门诊
          reportType = 4;
          url = '/packageD/reportNew/clinicOne';
          break;
        case 1:
          // 住院
          reportType = 5;
          url = '/packageD/reportNew/hospitalOne';
          break;
        case 2:
          //未就诊 跳转至人体部位选择页面
          // url='/packageE/findDoctorSelectPart/findDoctorSelectPart';

          var data = {
            applicationType: '12',
            doctorId: _this.doctorCustomerId,
            doctorName: _this.doctorMessage.fullName
          };

          wx.navigateTo({
            url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
          });
          break;
      }
      if (reportType) {
        param = {
          customerId: wx.getStorageSync('userId'),
          patientId: _this.patientId,
          doctorId: _this.doctorCustomerId,
          reportType: reportType
        };
        _this.isLoading = true;
        Object(__WEBPACK_IMPORTED_MODULE_3_common_js_report_createMainReport__["a" /* default */])(param).then(function (res) {
          _this.isLoading = false;
          if (res) {
            _this.setCaseId(res.caseId);
            _this.setReportId(res.reportId);
            wx.navigateTo({
              url: url
            });
          }
        });
      } else {
        // reportPatient,true;
        wx.setStorageSync('reportPatient', true);
        _this.toSelectPart();
      }
    }
  })
});

/***/ }),

/***/ 861:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createMainReport;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：创建主报道信息
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by ZH on 2019/2/19.
 */




var XHRList = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/report/content/v2/createMainReport/";
function createMainReport(param) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__["a" /* default */])({
      url: XHRList,
      method: "POST",
      data: param,
      done: function done(data) {
        if (data && data.responseObject && data.responseObject.responseStatus) {
          resolve(data.responseObject.responseData);
        } else {
          wx.showToast({
            title: '创建报道信息失败，请重试',
            icon: 'none'
          });
        }
      },
      fail: function fail(err) {
        wx.showToast({
          title: '接口错误',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

/***/ }),

/***/ 865:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [(_vm.showQuestion) ? _c('question-select', {
    attrs: {
      "question": _vm.question,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "btnIndex": _vm.selctBtnSubmit
    }
  }) : _vm._e(), _vm._v(" "), (_vm.isLoading) ? _c('logo-loading', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '去沟通',
        'cancel': '取消',
        'title': '您与该医生有正在进行中的咨询，现在继续去沟通吗？'
      },
      "eventid": '1',
      "mpcomid": '2'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.confirmShow = false
      },
      "ensureClickEvent": _vm.toImPage
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-91040c82", esExports)
  }
}

/***/ })

},[1264]);