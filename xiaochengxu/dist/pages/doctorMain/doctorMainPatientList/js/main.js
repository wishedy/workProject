global.webpackJsonp([39],{

/***/ 503:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMainPatientList_vue__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_9694fe02_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMainPatientList_vue__ = __webpack_require__(509);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(504)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMainPatientList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_9694fe02_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMainPatientList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/doctorMainPatientList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorMainPatientList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9694fe02", Component.options)
  } else {
    hotAPI.reload("data-v-9694fe02", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 504:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 505:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_consult_patientList__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createInvitePatient__ = __webpack_require__(171);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);

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
 * Created by Hallmader on 2018/7/23.
 */






var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      headTitle: ''
    };
  },

  methods: {
    /** 返回医生主页 */
    toSelectPart: function toSelectPart(patientId) {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14156
      });
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createInvitePatient__["a" /* default */])({
        id: this.mainKey,
        patientId: patientId.patientId,
        patientCustomerId: __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("userId") || ""
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          _this.showToast("您的预约已发送成功，医生上线后会及时通知，请耐心等候");
          // 用来获取最近的一层的分诊IM的层级
          var _arr = getCurrentPages().reverse();
          var backNum = -1;
          for (var j = 0, len = _arr.length; j < len; j++) {
            if (_arr[j].route == 'pages/doctorMain/doctorMain') {
              backNum = j;
              j = len;
              break;
            }
            if (_arr[j].route == 'packageA/imScene/imScene') {
              backNum = j;
              j = len;
              break;
            }
          }
          console.log("-------------" + backNum + "-----------------");
          setTimeout(function () {
            if (backNum == -1) {
              wx.redirectTo({
                url: "/pages/doctorMain/doctorMain"
              });
            } else {
              wx.navigateBack({
                delta: backNum
              });
            }
          }, 2000);
        }
      });
    },

    /** 去添加患者 */
    toAddPatient: function toAddPatient() {
      wx.navigateTo({
        url: '/pages/doctorMain/doctorMainAddPatient'
      });
    },

    /** 替换患者列表 */
    redirectToAddPatient: function redirectToAddPatient() {
      wx.redirectTo({
        url: '/pages/doctorMain/doctorMainAddPatient'
      });
    },
    showToast: function showToast(str) {
      wx.showToast({
        title: str,
        icon: 'none',
        duration: 2000
      });
    }
  },
  mounted: function mounted() {
    this.headTitle = "\u8BF7\u5B8C\u5584\u60A3\u8005\u4FE1\u606F\u4EE5\u4FBF\u63D0\u9192" + this.doctorMessage.authMap.fullName + "\u533B\u751F\u5C3D\u5FEB\u5F00\u8BCA";
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["doctorMessage", 'mainKey'])),
  components: {
    PatientList: __WEBPACK_IMPORTED_MODULE_1_components_consult_patientList__["a" /* default */]
  }
});

/***/ }),

/***/ 509:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('PatientList', {
    attrs: {
      "headTitle": _vm.headTitle,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectPatientCb": _vm.toSelectPart,
      "addPatientCb": _vm.toAddPatient,
      "redirectPatientCb": _vm.redirectToAddPatient
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-9694fe02", esExports)
  }
}

/***/ })

},[1229]);