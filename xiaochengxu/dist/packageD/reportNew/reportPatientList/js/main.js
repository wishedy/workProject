global.webpackJsonp([60],{

/***/ 837:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportPatientList_vue__ = __webpack_require__(839);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d0325a4a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportPatientList_vue__ = __webpack_require__(840);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(838)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-d0325a4a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportPatientList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d0325a4a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportPatientList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/reportPatientList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reportPatientList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d0325a4a", Component.options)
  } else {
    hotAPI.reload("data-v-d0325a4a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 838:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 839:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_report_getReportList__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
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


 //获取跳转路径







var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

var XHRList = {
  getPatientList: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/baseinfo/v1/getPatientList/', // 获取就诊人
  getPath: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/patient/report/content/v2/getReportList/' // 跳转/获取报道信息页
};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "reportPatientList",
  data: function data() {
    return {
      loading: 0,
      patientList: [],
      doctorId: '',
      customerId: '',
      isCoverCity: false // 定位城市 默认不在范围内 或 定位失败
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['reportId', 'doctorCustomerId', 'patientId', 'caseId', 'customerId', 'doctorId'])),
  onLoad: function onLoad(options) {
    wx.removeStorageSync('backIndex');
    if (options.doctorId) {
      this.doctorId = options.doctorId;
    } else {
      this.doctorId = this.doctorCustomerId;
    }
    if (options.patientCustomerId) {
      this.customerId = options.patientCustomerId;
    } else {
      this.customerId = __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId");
    }
    if (!this.customerId) {
      wx.redirectTo({
        url: '/packageD/doctorHome/doctorHome?scene=' + this.doctorId
      });
    }
  },
  onShow: function onShow() {
    var _this = this;
    _this.loading = 0;
    // api
    // .getLocationCity({
    //   name: "北京市"
    // })
    // .then(res => {
    //   console.log(res);
    //   if ((!res.isfail&&res.isCover)) {
    //     // 定位城市在 所属范围
    //     _this.isCoverCity = true;  // 定位城市
    //   }
    // });
    _this.getPatientList();
    __WEBPACK_IMPORTED_MODULE_6_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
      resourceId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        doctorId: _this.doctorCustomerId
      })
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    logoLoading: __WEBPACK_IMPORTED_MODULE_5_components_LogoLoading__["a" /* default */]
  },
  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapMutations(['setCaseId', 'setReportId', 'setPatientId']), {
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    // 获取就诊人列表
    getPatientList: function getPatientList() {
      var _this = this;
      _this.loading++;
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getPatientList,
        method: "POST",
        data: {
          patientCustomerId: this.customerId,
          doctorId: this.doctorId,
          firstResult: 0,
          maxResult: 100
        },
        done: function done(res) {
          _this.loading--;
          if (res && res.responseObject && res.responseObject.responseData) {
            _this.patientList = res.responseObject.responseData.dataList;
            for (var i = 0; i < _this.patientList.length; i++) {
              var item = _this.getState(_this.patientList[i].reportState);
              _this.patientList[i].stateText = item.text;
              _this.patientList[i].imgSrc = item.imgSrc;
            }
          }
        }
      }, "loading");
    },

    //添加新就诊人
    addPatient: function addPatient() {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_6_common_js_dataLog_dataLog__["a" /* default */].createTrack({ // 就诊人列表页面 点击“新增就诊人”
        actionId: 14227,
        browseType: 149,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ doctorId: _this.doctorId })
      });
      this.setPatientId(""); // 清空vuex中的patientId

      if (this.isCoverCity) {
        // 银川地区 健康卡用户少于5个
        wx.showModal({
          title: '温馨提醒',
          content: '领取居民健康卡有利于医生了解您的病 情，建议为本人领取。',
          showCancel: false,
          cancelText: '跳过',
          cancelColor: '#555555',
          confirmText: '确认',
          confirmColor: '#00BEAF',
          success: function success(res) {
            if (res.confirm) {
              // 确认
              wx.navigateTo({
                url: "/packageD/healthCard/healthCardRecognition?from=reportNew"
              });
            } else if (res.cancel) {
              // 取消
            }
          }
        });
      } else {
        // 其他
        wx.navigateTo({
          url: '/packageD/reportNew/reportAddPatient?customerId=' + this.customerId
        });
      }
    },

    // 选择一位患者
    // 报到状态;1-未开始 2未完成 3完成
    selectPatient: function selectPatient(patient) {
      var _this = this;
      _this.setCaseId(patient.caseId);
      _this.setReportId(patient.reportId);
      _this.setPatientId(patient.patientId);
      __WEBPACK_IMPORTED_MODULE_6_common_js_dataLog_dataLog__["a" /* default */].createTrack({
        actionId: 14228,
        browseType: 149,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ doctorId: _this.doctorCustomerId, patientId: patient.patientId, reportState: patient.reportState })
      });
      if (this.isCoverCity) {
        // 银川地区 未注册健康卡
        wx.showModal({
          title: '温馨提醒',
          content: '领取居民健康卡有利于医生了解您的病 情，建议为本人领取。',
          // showCancel:false,
          cancelText: '跳过',
          cancelColor: '#555555',
          confirmText: '确认',
          confirmColor: '#00BEAF',
          success: function success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/packageD/healthCard/healthCardRecognition?from=reportNew"
              });
            } else if (res.cancel) {
              _this.reportStateGoto(patient);
            }
          }
        });
      } else {
        // 其他
        _this.reportStateGoto(patient);
      }
    },
    reportStateGoto: function reportStateGoto(patient) {
      var _this = this;
      switch (patient.reportState) {
        case 1:
          // 未开始
          if (patient.isIdCardExist) {
            // 有身份证 进入就诊信息-就诊方式页面
            wx.navigateTo({
              url: '/packageD/reportNew/patientInfo'
            });
          } else {
            // 若无身份证号 进入【新建就诊人页面】，自动添加该患者姓名
            wx.navigateTo({
              url: '/packageD/reportNew/reportAddPatient?patientName=' + patient.patientName + '&province=' + patient.province + '&city=' + patient.city + '&reportState=1'
            });
          }
          break;
        // 未完成
        case 2:
          // 有身份证 进入就诊信息-就诊方式页面
          if (patient.isIdCardExist) {
            _this.getReportPath(patient.reportId);
          }
          //若无身份证号，进入至【新建就诊人页面】
          else {
              wx.navigateTo({
                url: '/packageD/reportNew/reportAddPatient?patientName=' + patient.patientName + '&reportState=2'
              });
            }
          break;
        case 3:
          // 已完成
          wx.navigateTo({
            url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + patient.caseId + "&doctorCustomerId=" + _this.doctorCustomerId + "&patientId=" + patient.patientId + "&reportId=" + patient.reportId + "&from=report"
          });
          break;
        default:
          break;
      }
    },

    // 根据当前报到状态，获取报到页面路径
    getReportPath: function getReportPath(reportId) {
      var _this = this,
          paramData = {
        reportId: reportId
      };
      _this.loading++;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_report_getReportList__["a" /* default */])(paramData).then(function (res) {
        _this.loading--;
        console.log(res);
        if (res.miniPath) {
          wx.navigateTo({
            url: '/' + res.miniPath
          });
        }
      });
    },

    // 根据报到状态返回状态提示文字
    getState: function getState(state) {
      var result = void 0;
      console.log("getState");
      switch (state) {
        case 1:
          result = { imgSrc: 'https://m.allinmed.cn/static/image/mp/index/1.2.0/unstart.png', text: '' }; // 报到未开始
          break;
        case 2:
          result = { imgSrc: 'https://m.allinmed.cn/static/image/mp/index/1.2.0/uncomplete.png', text: '报到未完成，点击完善信息' };
          break;
        case 3:
          result = { imgSrc: 'https://m.allinmed.cn/static/image/mp/index/1.2.0/complete.png', text: '报到已完成，点击这里和医生沟通' };
          break;
        default:
          result = { imgSrc: 'https://m.allinmed.cn/static/image/mp/index/1.2.0/unstart.png', text: '报到未开始' };
          break;
      }
      console.log(result);
      return result;
    }
  })
});

/***/ }),

/***/ 840:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "head"
  }, [_vm._v("\n    请选择就诊人，让我知道您是谁\n  ")]), _vm._v(" "), _c('section', {
    staticClass: "patient-list"
  }, _vm._l((_vm.patientList), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "patient",
      class: {
        'non-start': item.stateText == ''
      },
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.selectPatient(item)
        }
      }
    }, [_c('div', {
      staticClass: "name"
    }, [_c('span', {
      staticClass: "patient-name"
    }, [_vm._v(_vm._s(item.patientName))]), _vm._v(" "), _c('span', {
      staticClass: "patient-info"
    }, [_vm._v("  " + _vm._s(item.patientSex == 1 ? "男" : "女") + "  " + _vm._s(item.patientAge) + "岁")])]), _vm._v(" "), (item.stateText != '') ? _c('div', {
      staticClass: "state"
    }, [_vm._v("\n        " + _vm._s(item.stateText) + "\n      ")]) : _vm._e(), _vm._v(" "), (false) ? _c('section', {
      staticClass: "patientItem-card"
    }) : _vm._e()], 1)
  })), _vm._v(" "), _c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '2'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "add-patient",
    attrs: {
      "formType": "submit",
      "eventid": '1'
    },
    on: {
      "click": _vm.addPatient
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/add.png",
      "alt": ""
    }
  }), _vm._v("\n      添加就诊人\n    ")])], 1), _vm._v(" "), (_vm.loading) ? _c('logo-loading', {
    attrs: {
      "mpcomid": '0'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-d0325a4a", esExports)
  }
}

/***/ })

},[1260]);