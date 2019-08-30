global.webpackJsonp([24],{

/***/ 419:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_report_vue__ = __webpack_require__(421);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2f534158_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_report_vue__ = __webpack_require__(422);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(420)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2f534158"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_report_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2f534158_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_report_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/report/report.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] report.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2f534158", Component.options)
  } else {
    hotAPI.reload("data-v-2f534158", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 420:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 421:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_ensure__ = __webpack_require__(24);

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





var XHRList = {
  getSession: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/wx/api/v1/jscode2session/",
  doctorInfo: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/auth/v1/getMapById/"
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      dataList: [],
      successFlag: false,
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定"
      },
      authorizationFlag: true,
      toPatient: ''
    };
  },

  computed: {},
  components: {
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_3_components_ensure__["a" /* default */]
  },
  methods: {
    messageType: function messageType(item) {
      // let message = '';
      // switch (item.patient.type) {
      //   case 'message':
      //     message = '系统提示';
      //     break;
      //   case 'fenzhen':
      //     message = '分诊医生';
      //     break;
      //   case 'doctor' :
      //     console.log(item.doctor.name);
      //     message = item.doctor.name;
      //     break;
      //   default :
      //     message = '系统提示';
      // }
      // this.messageTypeShow = message;
    },
    goTo: function goTo(item) {
      var patientId = item.patientId;
      var reportId = item.reportId;
      var caseId = item.caseId;
      var doctorCustomerId = item.doctorId;
      console.log(item);
      wx.removeStorageSync("alreadyCreateIm");
      wx.setStorageSync("patientInfo", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
        patientName: item.patientName,
        patientId: item.patientId,
        patientSex: item.patientSex,
        patientAge: item.patientAge
      }));
      if (item.reportState == 1 || item.reportState == 2) {
        // wx.removeStorageSync("qrHasClosed");
        wx.setStorageSync("reportId", reportId + "");
        wx.setStorageSync("patientId", patientId);
        wx.setStorageSync("caseId", caseId);
        wx.setStorageSync('doctorId', doctorCustomerId);
        wx.navigateTo({
          url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + caseId + '&doctorCustomerId=' + doctorCustomerId + '&patientId=' + patientId + '&reportId=' + reportId + '&from=reportList'
        });
      } else {
        wx.setStorageSync("reportId", reportId + "");
        wx.setStorageSync("patientId", patientId);
        wx.setStorageSync("caseId", caseId);
        wx.setStorageSync('doctorId', doctorCustomerId);
        wx.navigateTo({
          url: '../../packageD/questionDesc/questionDesc'
        });
      }
    },
    getMyDoctorList: function getMyDoctorList() {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].codeRecord("/pages/report/report");
      if (_this.toPatient) {
        wx.navigateTo({
          url: '/pages/addPatient/addPatient'
        });
      }
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/patient/report/improvement/v1/getMapByCustomerId/',
        method: "POST",
        data: {
          customerId: wx.getStorageSync("userId"),
          isValid: '1',
          visitSiteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId()
        },
        done: function done(res) {
          if (res.responseObject.responseStatus) {
            if (res.responseObject.responseData && res.responseObject.responseData.data_list) {

              res.responseObject.responseData.data_list.forEach(function (ele, index) {
                if (ele.patientName.length > 4) {
                  ele.patientName = ele.patientName.substr(0, 4) + '...';
                }
                if (ele.doctorName && ele.doctorName.length > 10) {
                  ele.doctorName = ele.doctorName.substr(0, 10) + '...';
                }
                // if(ele.messageName&&ele.messageName.length>4){
                //   ele.messageName=ele.messageName.substr(0,4)+'...'
                // }
              });

              _this.dataList = res.responseObject.responseData.data_list;

              if (_this.dataList.length == 0) {
                _this.successFlag = true;
              }
            } else {
              _this.successFlag = true;
            }
          }
        },
        fail: function fail(error) {
          console.log(error);
        }
      });
    },

    // getUserInfo() {
    //   let _this = this;
    //   wx.getSetting({
    //     success: function (res) {
    //       console.log(res);
    //       if (res.authSetting['scope.userInfo']) {
    //         miniLogin({
    //           successCallBack: function (res) {
    //             if (res.data.responseObject.responseStatus) {
    //               _this.getMyDoctorList();
    //             }
    //           }
    //         });
    //       } else {
    //         _this.goToSetting();
    //       }
    //     }
    //   })
    //
    //
    // },
    // openSetting(res){
    //     console.log(res);
    // },
    goToSetting: function goToSetting() {
      var _this = this;
      // wx.getSetting({
      //   success: (res) => {
      //     if (res && res.authSetting["scope.userInfo"]) {
      //       _this.getLoginInfo();
      //     }else{
      wx.openSetting({
        success: function success(res) {
          if (res && res.authSetting["scope.userInfo"]) {
            _this.getLoginInfo();
          }
        },
        fail: function fail(error) {
          console.log(error);
        }
      });
      //     }
      //   },fail:(error)=>{
      //     console.log(error)
      //   }
      // })
    },
    getAuthorize: function getAuthorize(obj) {
      if (obj.target.userInfo) {
        this.ensureShow = false;

        this.getLoginInfo();
      } else {
        this.ensureShow = true;
      }
    },
    getLoginInfo: function getLoginInfo() {
      var _this = this;
      _this.authorizationFlag = false;
      _this.ensureShow = false;
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            _this.getMyDoctorList();
          } else {
            wx.redirectTo({
              url: '/pages/login/login?backPage=report'
            });
          }
        }
      });
    },
    getDoctorInfo: function getDoctorInfo() {
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.doctorInfo,
        method: "POST",
        data: {
          customerId: wx.getStorageSync("doctorId"),
          logoUseFlag: 3
        },
        done: function done(res) {
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            var doctorMain = res.responseObject.responseData.dataList[0];
            wx.setStorageSync("doctorName", doctorMain.authMap.fullName);
          }
        }
      });
    }
  },
  onLoad: function onLoad(options) {
    console.log("onLoad");
    var _this = this;
    if (decodeURIComponent(options.scene) == "undefined") {} else {
      //  _this.toPatient = decodeURIComponent(options.scene);
      wx.setStorageSync("doctorId", decodeURIComponent(options.scene));
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].codeRecord(options.scene.toString());
      _this.getDoctorInfo();
    }
    __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].codeRecord("/pages/report/report");

    wx.getSetting({
      success: function success(res) {
        console.log(res);
        if (res && res.authSetting["scope.userInfo"]) {
          _this.getLoginInfo();
        } else {}
      }, fail: function fail(error) {
        console.log(error);
      }
    });
  }
});

/***/ }),

/***/ 422:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "report",
    class: [{
      'bgWhite': _vm.successFlag
    }, {
      'bgWhite': _vm.authorizationFlag
    }, {
      'bgGray': _vm.successFlag && !_vm.authorizationFlag
    }]
  }, [(!_vm.successFlag && !_vm.authorizationFlag) ? _c('ul', _vm._l((_vm.dataList), function(item, index) {
    return _c('li', {
      key: index,
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.goTo(item)
        }
      }
    }, [_c('div', {
      staticClass: "doctorInfo"
    }, [_c('image', {
      attrs: {
        "src": item.doctorUrl
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "baseInfo"
    }, [_c('div', {
      staticClass: "info"
    }, [_c('span', {
      staticClass: "name"
    }, [_vm._v(_vm._s(item.doctorName))]), _c('span', [_vm._v(_vm._s(item.medicalTitle))])]), _vm._v(" "), _c('div', {
      staticClass: "company"
    }, [_vm._v(_vm._s(item.company))])])]), _vm._v(" "), _c('div', {
      staticClass: "patientInfo"
    }, [(item.patientName.length > 0) ? _c('div', {
      staticClass: "mb10"
    }, [_c('label', {
      staticClass: "patientName"
    }, [_vm._v("患者姓名")]), _c('span', [_vm._v(_vm._s(item.patientName))])], 1) : _vm._e(), _vm._v(" "), (item.reportState == 0) ? _c('div', [_c('label', [_vm._v("系统提示")]), _c('span', {
      staticClass: "InfoContent"
    }, [_vm._v(_vm._s(item.messageContent))])], 1) : _vm._e(), _vm._v(" "), (item.reportState == 1) ? _c('div', [_c('label', [_vm._v(_vm._s(item.doctorName))]), _c('span', {
      staticClass: "InfoContent"
    }, [_vm._v(_vm._s(item.messageContent))])], 1) : _vm._e(), _vm._v(" "), (item.reportState == 2) ? _c('div', [_c('label', [_vm._v(_vm._s(item.messageName))]), _c('span', {
      staticClass: "InfoContent"
    }, [_vm._v(_vm._s(item.messageContent))])], 1) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "arrow"
    })])])
  })) : _vm._e(), _vm._v(" "), (_vm.successFlag && !_vm.authorizationFlag) ? _c('div', {
    staticClass: "success"
  }, [_c('img', {
    attrs: {
      "src": "/static/images/bg-icon@2x.png"
    }
  }), _vm._v(" "), _c('h3', {
    staticClass: "title"
  }, [_vm._v("暂无报到医生")]), _vm._v(" "), _c('p', {
    staticClass: "text"
  }, [_vm._v("请扫描就诊时医生提供的报到二维码与医生快速建立联系")])], 1) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '1',
      "mpcomid": '0'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), (_vm.authorizationFlag) ? _c('div', {
    staticClass: "authorization"
  }, [_c('img', {
    attrs: {
      "src": "/static/images/report/authorization.png"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "text"
  }, [_vm._v("获取信息失败，请先授权")]), _vm._v(" "), _c('button', {
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '2'
    },
    on: {
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("去授权")])], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2f534158", esExports)
  }
}

/***/ })

},[1218]);