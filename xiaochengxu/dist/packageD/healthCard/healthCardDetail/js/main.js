global.webpackJsonp([97],{

/***/ 1000:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "healthCardDetail-main"
  }, [_c('section', {
    staticClass: "healthCardDetail-banner"
  }, [_c('section', {
    staticClass: "healthCardDetail-content"
  }, [_c('section', {
    staticClass: "healthCardDetail-card"
  }, [_c('section', {
    staticClass: "healthCard-title"
  }, [_vm._v("居民健康卡")]), _vm._v(" "), _c('section', {
    staticClass: "healthCard-info"
  }, [_c('section', {
    staticClass: "healthCard-name"
  }, [_c('span', {
    staticClass: "healthCard-name-one"
  }, [_vm._v("姓名：")]), _vm._v(" "), _c('span', {
    staticClass: "healthCard-name-two"
  }, [_vm._v(_vm._s(_vm.name))])]), _vm._v(" "), _c('section', {
    staticClass: "healthCard-sex"
  }, [_c('span', {
    staticClass: "healthCard-sex-one"
  }, [_vm._v("性别：")]), _vm._v(" "), _c('span', {
    staticClass: "healthCard-sex-two"
  }, [_vm._v(_vm._s(_vm.sex))])])], 1), _vm._v(" "), _c('section', {
    staticClass: "healthCard-number"
  }, [_vm._v("\n          居民健康卡号码：\n          "), _c('span', {
    staticClass: "healthCard-number-two"
  }, [_vm._v(_vm._s(_vm.cardNumber))])]), _vm._v(" "), _c('section', {
    staticClass: "healthCard-producer"
  }, [_vm._v("国家卫生健康委员会监制")])], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4df5380f", esExports)
  }
}

/***/ }),

/***/ 997:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardDetail_vue__ = __webpack_require__(999);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4df5380f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardDetail_vue__ = __webpack_require__(1000);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(998)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4df5380f"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4df5380f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/healthCard/healthCardDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthCardDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4df5380f", Component.options)
  } else {
    hotAPI.reload("data-v-4df5380f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 998:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 999:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/*
 * @Desc: 居民健康卡详情页
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/4/2
 *
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      cardNumber: "110********302",
      name: "**杰",
      sex: "男"
    };
  },
  onLoad: function onLoad(options) {
    // Do some initialize when page load.
  },
  onReady: function onReady() {
    // Do something when page ready.
  },
  onShow: function onShow() {
    // Do something when page show.
  },
  onHide: function onHide() {
    // Do something when page hide.
  },
  onUnload: function onUnload() {
    // Do something when page close.
  },
  onPullDownRefresh: function onPullDownRefresh() {
    // Do something when pull down.
  },

  methods: {}
});

/***/ })

},[1292]);