global.webpackJsonp([102],{

/***/ 591:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultIntro_vue__ = __webpack_require__(593);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_79db8f48_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultIntro_vue__ = __webpack_require__(594);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(592)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-79db8f48"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultIntro_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_79db8f48_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultIntro_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageB/consultIntro/consultIntro.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultIntro.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-79db8f48", Component.options)
  } else {
    hotAPI.reload("data-v-79db8f48", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 592:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 593:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_dataLog__ = __webpack_require__(7);

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







/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      loading: false, // loading 组件是否显示
      isFullScreen: false, // 是否是全面屏；
      tips: '正为您安排骨科诊室，请稍候…',
      timeId: null
    };
  },

  onShareAppMessage: function onShareAppMessage() {
    var path = '/packageB/consultIntro/consultIntro';
    return {
      title: '唯医骨科|按病情快速推荐医生咨询',
      path: "/pages/mIndex/mIndex?from=shareFriend&path=" + path
    };
  },
  methods: {
    getAuthorize: function getAuthorize(obj) {

      if (this.loading) return;
      this.loading = true;

      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
        actionId: 14182
      });

      console.log(obj);
      if (obj.target.userInfo) {
        this.ensureShow = false;
        this.getLoginInfo();
      } else {
        this.loading = false;
        this.ensureShow = true;
      }
    },
    goNext: function goNext() {
      var data = { applicationType: 0 };
      if (this.timeId) clearInterval(this.timeId);
      wx.navigateTo({
        url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
      });
    },
    getLoginInfo: function getLoginInfo() {
      var _this2 = this;

      console.log('检测登录');
      setTimeout(function () {
        _this2.loading = false;
      }, 1500);
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          _this2.loading = false;
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            wx.navigateTo({
              url: '/packageB/consultPatientList/consultPatientList'
            });
          } else {
            wx.navigateTo({
              url: '/packageB/consultAddPatient/consultAddPatient'
            });
          }
        },
        failCallBack: function failCallBack() {
          console.log('失败的回调');
          _this2.loading = false;
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
  },
  mounted: function mounted() {
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("caseId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("doctorId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("doctorName");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("alreadyCreateIm");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("patientInfo");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("patientId");
    __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("PCIMLinks");
  },
  onLoad: function onLoad() {
    var _this3 = this;

    var _this = this;
    wx.onNetworkStatusChange(function (res) {
      _this3.loading = false;
      // console.log("netStatus:");
      // console.log(res);
      if (res && !!res.isConnected) {} else {}
    });
    this.isFullScreen = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth > 2 ? true : false;
    setTimeout(function () {
      _this.tips = '正帮您联系骨科医生，请稍候…';
    }, 1000);
    this.timeId = setTimeout(function () {
      var data = { applicationType: 0 };
      wx.navigateTo({
        url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
      });
    }, 2000);
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: {},
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_3_components_loading__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_5_components_ensure__["a" /* default */]
  }
});

/***/ }),

/***/ 594:
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
  }, [_c('img', {
    staticClass: "intro-banner-img",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/zixun_bg.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('section', {
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
  }, [_vm._v("随访关怀")])], 1)], 1), _vm._v(" "), _c('p', {
    staticClass: "intro-tips"
  }, [_vm._v(_vm._s(_vm.tips))]), _vm._v(" "), _c('form', [_c('button', {
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.goNext
    }
  }, [_c('p', {
    staticClass: "intor-auto-redirect"
  }, [_vm._v(" 点此直接跳转 ")])], 1)], 1)], 1)], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '1',
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-79db8f48", esExports)
  }
}

/***/ })

},[1236]);