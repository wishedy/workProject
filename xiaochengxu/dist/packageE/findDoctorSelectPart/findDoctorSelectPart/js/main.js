global.webpackJsonp([53],{

/***/ 1069:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorSelectPart_vue__ = __webpack_require__(1071);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3e373c7f_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorSelectPart_vue__ = __webpack_require__(1072);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1070)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_findDoctorSelectPart_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3e373c7f_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_findDoctorSelectPart_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/findDoctorSelectPart/findDoctorSelectPart.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] findDoctorSelectPart.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3e373c7f", Component.options)
  } else {
    hotAPI.reload("data-v-3e373c7f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1070:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1071:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_consult_selectPart__ = __webpack_require__(174);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vuex__ = __webpack_require__(4);

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





/**************************Base Vue-Methods*************************/


var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_6_vuex__["a" /* createNamespacedHelpers */])('findDoctor'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions;

var XHRList = {
  patientInfo: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/baseinfo/v1/getMapList/" // 获取患者个人信息
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      selectPartShow: false
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(["setDoctorCustomerId"]), mapActions(["setPatientMessage"]), {
    goToQuestion: function goToQuestion() {
      wx.navigateTo({
        url: '/packageE/findDoctorQuestionList/findDoctorQuestionList'
      });
    },

    /** 获取患者个人信息 */
    getPatientInfo: function getPatientInfo(patientId, unshiftFlag) {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.patientInfo,
        method: "POST",
        data: {
          patientId: patientId //患者id
        },
        done: function done(data) {
          if (data.responseObject.responseStatus) {
            _this.setPatientInfo(data.responseObject.responseData.dataList[0]);
          } else {
            console.log('获取患者信息失败');
          }
        }
      });
    },

    /** 设置患者信息 */
    setPatientInfo: function setPatientInfo(data) {
      // debugger;
      this.setPatientMessage({
        partId: '',
        userId: __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].getItem("userId"),
        sex: data.patientSex,
        age: data.patientAge,
        patientId: data.patientId,
        patientName: data.patientName,
        count: 0,
        height: data.height ? data.height : "",
        weight: data.weight ? data.weight : ""
      });
      this.selectPartShow = true;
    }
  }),
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : options,
        patientId = _ref.patientId,
        doctorId = _ref.doctorId;

    //针对于老患者报道未就诊过来的增加的容错；
    if (patientId) {
      this.getPatientInfo(patientId);
    } else {
      this.selectPartShow = true;
    }
    if (doctorId) {
      this.setDoctorCustomerId(doctorId);
    }
  },

  computed: {},
  components: {
    HeaderProgress: __WEBPACK_IMPORTED_MODULE_3_components_consult_headerProgress__["a" /* default */],
    SelectPart: __WEBPACK_IMPORTED_MODULE_1_components_consult_selectPart__["a" /* default */]
  }
});

/***/ }),

/***/ 1072:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [_c('HeaderProgress', {
    attrs: {
      "progress": 2,
      "mpcomid": '0'
    }
  }), _vm._v(" "), (_vm.selectPartShow) ? _c('SelectPart', {
    attrs: {
      "eventid": '0',
      "mpcomid": '1'
    },
    on: {
      "selectPartCb": _vm.goToQuestion
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3e373c7f", esExports)
  }
}

/***/ })

},[1305]);