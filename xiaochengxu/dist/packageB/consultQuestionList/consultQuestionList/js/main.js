global.webpackJsonp([100],{

/***/ 613:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultQuestionList_vue__ = __webpack_require__(615);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_01a22884_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultQuestionList_vue__ = __webpack_require__(619);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(614)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_consultQuestionList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_01a22884_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_consultQuestionList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageB/consultQuestionList/consultQuestionList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] consultQuestionList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-01a22884", Component.options)
  } else {
    hotAPI.reload("data-v-01a22884", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 614:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 615:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_consult_questionList__ = __webpack_require__(175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_consult_headerProgress__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_dataLog__ = __webpack_require__(7);
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
      confirmShow: false
    };
  },
  onUnload: function onUnload() {},

  methods: {
    goToNext: function goToNext(param) {
      if (getCurrentPages().length >= 6) {
        wx.setStorageSync("backIndex", true);
        wx.reLaunch({
          url: "/packageA/imScene/imScene?caseId=" + param.caseId + "&patientId=" + param.patientId
        });
      } else {
        wx.navigateTo({
          url: "/packageA/imScene/imScene?caseId=" + param.caseId + "&patientId=" + param.patientId
        });
      }
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
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      this.confirmShow = true;
    } else {
      this.confirmShow = false;
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_4_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    HeaderProgress: __WEBPACK_IMPORTED_MODULE_1_components_consult_headerProgress__["a" /* default */],
    QuestionList: __WEBPACK_IMPORTED_MODULE_0_components_consult_questionList__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_2_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 619:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [_c('HeaderProgress', {
    attrs: {
      "progress": 3,
      "mpcomid": '0'
    }
  }), _vm._v(" "), _c('QuestionList', {
    attrs: {
      "eventid": '0',
      "mpcomid": '1'
    },
    on: {
      "questionListCb": _vm.goToNext
    }
  }), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '继续沟通',
        'cancel': '返回首页',
        'title': '您的咨询单已提交\n无需重复操作'
      },
      "eventid": '1',
      "mpcomid": '2'
    },
    on: {
      "cancelClickEvent": _vm.backToHome,
      "ensureClickEvent": _vm.backToIm
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-01a22884", esExports)
  }
}

/***/ })

},[1240]);