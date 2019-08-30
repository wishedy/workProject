global.webpackJsonp([101],{

/***/ 595:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultPatientList_vue__ = __webpack_require__(597);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_71b3b788_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultPatientList_vue__ = __webpack_require__(601);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(596)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultPatientList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_71b3b788_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultPatientList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageB/consultPatientList/consultPatientList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultPatientList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-71b3b788", Component.options)
  } else {
    hotAPI.reload("data-v-71b3b788", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 596:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 597:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_consult_patientList__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_createConsultation__ = __webpack_require__(70);
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
 * Created by Hallmader on 2018/7/4.
 */











/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      confirmShow: false,
      isLoading: false
    };
  },


  methods: {
    /** 去选择部位 */
    toSelectPart: function toSelectPart(patientItem) {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14157,
        keyword: patientItem.patientName
      });
      console.log('patientItem --> ', patientItem);
      this.patientCustomerId = patientItem.patientCustomerId;
      this.patientId = patientItem.patientId;
      var caseParam = {
        "visitSiteId": __WEBPACK_IMPORTED_MODULE_8_common_js_util_util__["a" /* default */].getSiteId(),
        "customerId": this.customerId + "",
        "patientId": patientItem.patientId,
        "patientName": patientItem.patientName,
        "caseType": this.caseType,
        "openId": this.openId,
        "partId": this.partId,
        "sex": patientItem.patientSex
      };
      this.doctorId && (caseParam.doctorId = this.doctorId);
      // wx.showLoading({
      //   title: "正在加载..."
      // });
      _this.isLoading = true;
      __WEBPACK_IMPORTED_MODULE_8_common_js_util_util__["a" /* default */].ajax({
        url: __WEBPACK_IMPORTED_MODULE_8_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/case/v3/create/',
        method: "POST",
        data: caseParam,
        done: function done(response) {
          //console.log('response --> ', response);
          if (response.responseObject.responseStatus) {
            var consultParam = {
              caseId: response.responseObject.responsePk,
              caseType: _this.caseType,
              patientCustomerId: _this.patientCustomerId,
              patientId: _this.patientId,
              consultationType: _this.consultationType,
              consultationState: 4,
              siteId: __WEBPACK_IMPORTED_MODULE_8_common_js_util_util__["a" /* default */].getSiteId()
            };
            console.log('consultParam ---> ', consultParam);
            Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_createConsultation__["a" /* default */])(consultParam).then(function (data) {
              wx.hideLoading();
              _this.isLoading = false;
              if (data.responseObject.responseStatus) {
                if (getCurrentPages().length > 5) {
                  wx.setStorageSync("backIndex", true);
                  wx.reLaunch({
                    url: "/packageA/imScene/imScene?caseId=" + consultParam.caseId + "&patientId=" + consultParam.patientId
                  });
                } else {
                  wx.navigateTo({
                    url: "/packageA/imScene/imScene?caseId=" + consultParam.caseId + "&patientId=" + consultParam.patientId
                  });
                }
              } else {
                console.log('consultParam ---> ', data);
              }
            });
          } else {
            wx.hideLoading();
            console.log('caseParam --> ', response);
          }
        }
      });

      // wx.reLaunch({
      //   url: `/packageA/imScene/imScene?caseId=${param.caseId}&patientId=${param.patientId}`
      // });
      // wx.navigateTo({
      //   url: '/packageB/consultSelectPart/consultSelectPart'
      // });
    },

    /** 去添加患者 */
    toAddPatient: function toAddPatient() {
      wx.navigateTo({
        url: '/packageB/consultAddPatient/consultAddPatient?doctorId=' + this.doctorId + '&partId=' + this.partId
      });
    },

    /** 替换患者列表 */
    redirectToAddPatient: function redirectToAddPatient(data) {
      console.log('redirectToAddPatient ---> ', data);
      wx.redirectTo({
        url: '/packageB/consultAddPatient/consultAddPatient?doctorId=' + this.doctorId + '&partId=' + this.partId
      });
    },

    //返回首页
    backToHome: function backToHome() {
      this.confirmShow = false;
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    },
    backToIm: function backToIm() {
      this.confirmShow = false;
      var param = JSON.parse(__WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("PCIMLinks"));
      wx.navigateTo({
        url: "/packageA/imScene/imScene?caseId=" + param.caseId + "&patientId=" + param.patientId
      });
    }
  },
  mounted: function mounted() {},
  onLoad: function onLoad(option) {
    var data = JSON.parse(decodeURIComponent(option.query));
    console.log(data);
    this.doctorId = data.doctorId;
    this.partId = data.partId;
    this.isLoading = false;
    // this.caseType = data.applicationType;
    this.caseType = 0;
    try {
      this.customerId = wx.getStorageSync('userId');
    } catch (e) {}
    try {
      this.openId = wx.getStorageSync('openId');
    } catch (e) {}
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      this.confirmShow = true;
    } else {
      this.confirmShow = false;
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: {},
  components: {
    // HeaderProgress,
    PatientList: __WEBPACK_IMPORTED_MODULE_0_components_consult_patientList__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_6_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_7_components_authorization_authorization__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_4_components_confirm__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_1_components_loading__["a" /* default */]
  }
});

/***/ }),

/***/ 601:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('PatientList', {
    attrs: {
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPatientCb": _vm.toSelectPart,
      "addPatientCb": _vm.toAddPatient,
      "redirectPatientCb": _vm.redirectToAddPatient
    }
  }), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '继续沟通',
        'cancel': '返回首页',
        'title': '您的咨询单已提交\n无需重复操作'
      },
      "eventid": '1',
      "mpcomid": '1'
    },
    on: {
      "cancelClickEvent": _vm.backToHome,
      "ensureClickEvent": _vm.backToIm
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '2'
    }
  }), _vm._v(" "), (_vm.isLoading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '3'
    }
  }) : _vm._e(), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '4'
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-71b3b788", esExports)
  }
}

/***/ })

},[1237]);