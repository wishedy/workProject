global.webpackJsonp([111],{

/***/ 794:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultIntro_vue__ = __webpack_require__(796);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1121537a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultIntro_vue__ = __webpack_require__(797);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(795)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-1121537a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultIntro_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1121537a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultIntro_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/meinian/consultIntro.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultIntro.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1121537a", Component.options)
  } else {
    hotAPI.reload("data-v-1121537a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 795:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 796:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_dataLog__ = __webpack_require__(7);
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/24.
 */
var XHRList = {
  patientList: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/relation/v1/getMapList/" //患者列表
};









var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('meinian'),
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      loading: false // loading 组件是否显示
    };
  },

  // onShareAppMessage: function () {
  //   let path = '/packageB/consultIntro/consultIntro';
  //   return {
  //     title: '唯医骨科|按病情快速推荐医生咨询',
  //     path: `/pages/mIndex/mIndex?from=shareFriend&path=${path}`,
  //   }
  // },
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['changeVerifyPhoneNumber', 'changeName', 'changeIdentityCardNum', 'changePhoneNum', 'checkVerificationCode', 'showToast', 'savePatientList', 'changePhoneNum', 'changeClickAble']), {
    getAuthorize: function getAuthorize(obj) {
      var t = this;
      if (!t.clickAble) {
        return false;
      } else {
        t.changeClickAble(false);
      }
      if (this.loading) return;
      this.loading = true;

      // dataLog.createTrack({
      //   actionId: 14182,
      // });
      if (obj.target.userInfo) {
        this.ensureShow = false;
        this.getLoginInfo();
      } else {
        this.loading = false;
        t.changeClickAble(true);
        this.ensureShow = true;
      }
    },
    formSubmitName: function formSubmitName(e) {
      var _this2 = this;

      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        _this2.loading = false;
      });
    },
    getPatientList: function getPatientList() {
      var _this = this;
      this.gotPatient = false;
      this.loading = true;
      var _data = {
        customerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId"),
        isValid: "1",
        patientSource: 1,
        caseType: 15,
        firstResult: "0",
        maxResult: "9999"
      };
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.patientList,
        method: "POST",
        data: _data,
        done: function done(param) {
          _this.gotPatient = true;
          _this.count = param.responseObject.responseData.totalCount;
          if (param.responseObject.responseMessage == "NO DATA") {
            _this.changeClickAble(true);
            wx.navigateTo({
              url: '/packageA/meinian/meinian'
            });
          } else {
            param.responseObject.responseData.dataList.forEach(function (e, i) {
              e.fullName = e.patientName.length > 4 ? e.patientName.substring(0, 4) + '...' : e.patientName;
            });
            _this.patientList = param.responseObject.responseData.dataList.reverse();
            if (_this.patientList.length > 0) {
              console.log(_this.patientList);
              _this.savePatientList(_this.patientList);
            } else {
              _this.changeClickAble(true);
              wx.navigateTo({
                url: '/packageA/meinian/meinian'
              });
            }
          }
          _this.loading = false;
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    },
    getLoginInfo: function getLoginInfo() {
      var _this3 = this;

      var t = this;
      setTimeout(function () {
        _this3.loading = false;
      }, 1500);
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          _this3.loading = false;
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            var mobileNum = res.data.responseObject.responseData.mobile.trim();
            t.changePhoneNum(mobileNum);
            t.changeVerifyPhoneNumber(true);
            t.getPatientList();
            /*t.changeVerifyPhoneNumber(false);
            wx.navigateTo({
              url: '/packageA/meinian/meinian'
            });*/
          } else {
            t.changeVerifyPhoneNumber(false);
            wx.navigateTo({
              url: '/packageA/meinian/meinian'
            });
          }
          t.changeClickAble(true);
        },
        failCallBack: function failCallBack() {
          console.log('失败的回调');
          _this3.loading = false;
          t.changeClickAble(true);
        }
      });
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.errMsg === "openSetting:ok") {
        this.ensureShow = false;
        this.getLoginInfo();
      } else {
        this.ensureShow = true;
      }
    }
  }),
  mounted: function mounted() {
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("caseId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("doctorId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("doctorName");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("alreadyCreateIm");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("patientInfo");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("patientId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("PCIMLinks");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem('backIndex');
  },
  onLoad: function onLoad() {
    var _this4 = this;

    wx.onNetworkStatusChange(function (res) {
      _this4.loading = false;
      console.log("netStatus:");
      console.log(res);
      if (res && !!res.isConnected) {} else {}
    });
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapGetters(['clickAble'])),
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_3_components_loading__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_5_components_ensure__["a" /* default */]
  }
});

/***/ }),

/***/ 797:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "intro-inner"
  }, [(_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "intro-wrapper"
  }, [_c('figure', {
    staticClass: "intro-banner"
  }, [_c('image', {
    staticClass: "intro-banner-img",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/text-bg.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-banner-out"
  }, [_c('span', {
    staticClass: "intro-tips-one"
  }, [_vm._v("不排队/限时免费")])])], 1), _vm._v(" "), _c('section', {
    staticClass: "intro-main-content"
  }, [_c('h3', {
    staticClass: "intro-content-title"
  }, [_vm._v("超过1600位合作专家")]), _vm._v(" "), _c('h3', {
    staticClass: "intro-content-title"
  }, [_vm._v("为您提供金牌服务")]), _vm._v(" "), _c('ul', {
    staticClass: "intro-main-list"
  }, [_c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/one.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("预约加号")])], 1), _vm._v(" "), _c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/two.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("手术咨询")])], 1), _vm._v(" "), _c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/three.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("片子解读")])], 1), _vm._v(" "), _c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/four.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("用药建议")])], 1), _vm._v(" "), _c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/five.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("康复指导")])], 1), _vm._v(" "), _c('li', {
    staticClass: "intro-main-item"
  }, [_c('image', {
    staticClass: "intro-main-image",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/six.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "intro-main-tips"
  }, [_vm._v("随访关怀")])], 1)], 1)], 1), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "submit": _vm.formSubmitName
    }
  }, [_c('button', {
    staticClass: "consult-btn",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '0'
    },
    on: {
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("马上去咨询")])], 1)], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '2',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1121537a", esExports)
  }
}

/***/ })

},[1251]);