global.webpackJsonp([38],{

/***/ 488:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNoteList_vue__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d618dfae_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNoteList_vue__ = __webpack_require__(491);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(489)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNoteList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_d618dfae_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNoteList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/patientNoteList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] patientNoteList.vue: functional components are not supported with templates, they should use render functions.")}


/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-d618dfae", Component.options)
  } else {
    hotAPI.reload("data-v-d618dfae", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 489:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 490:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_getPagesParam_getPagesParam__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(4);

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






var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      clickFlag: true,
      loading: false
    };
  },
  mounted: function mounted() {},
  onLoad: function onLoad(option) {},
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].enterBrowse({
      browseType: "136",
      opDesc: "医生主页-专家指南列表页"
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_1_components_loading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['doctorGuideList'])),
  methods: {
    // 患者手册列表
    goPatientNodeDetail: function goPatientNodeDetail(item) {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].createTrack({
        actionId: 14210,
        pushMessageId: item.manualId,
        keyword: item.manualName
      });
      if (!this.clickFlag) return;
      this.clickFlag = false;
      var pagesParam = __WEBPACK_IMPORTED_MODULE_3_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('patientNote');
      if (pagesParam.hasName) {
        //有相同的
        wx.setStorageSync('nodeManualId', item.manualId);
        wx.navigateBack({
          delta: pagesParam.backNum
        });
        this.clickFlag = true;
      } else {
        //没有相同的历史
        wx.getNetworkType({
          success: function success(res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            if (networkType === 'none') {
              wx.showToast({
                title: "网络中断，请检查您的网络状态",
                icon: 'none'
              });
              _this.clickFlag = true;
            } else {
              wx.navigateTo({
                url: "/packageF/patientNote/patientNote?manualId=" + item.manualId,
                success: function success() {
                  _this.clickFlag = true;
                },
                fail: function fail() {
                  _this.clickFlag = true;
                }
              });
            }
          }
        });
      }
    }
  }
});

/***/ }),

/***/ 491:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('ul', {
    staticClass: "doc-guide-list"
  }, _vm._l((_vm.doctorGuideList), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "doc-guide-item",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.goPatientNodeDetail(item)
        }
      }
    }, [_c('div', {
      staticClass: "doc-guide-left"
    }, [_c('img', {
      staticClass: "node-img",
      attrs: {
        "src": item.coverUrl,
        "alt": "图片加载失败"
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "doc-guide-middle"
    }, [_c('h3', {
      staticClass: "guide-title"
    }, [_vm._v(_vm._s(item.manualName))]), _vm._v(" "), _c('p', {
      staticClass: "guide-content"
    }, [_vm._v("共" + _vm._s(item.articleNum) + "篇")])], 1), _vm._v(" "), _c('div', {
      staticClass: "doc-guide-right"
    })])
  }))
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-d618dfae", esExports)
  }
}

/***/ })

},[1227]);