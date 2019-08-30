global.webpackJsonp([52],{

/***/ 1177:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalEditor_vue__ = __webpack_require__(1179);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5684885d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalEditor_vue__ = __webpack_require__(1180);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1178)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalEditor_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_5684885d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalEditor_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journal/journalEditor.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] journalEditor.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5684885d", Component.options)
  } else {
    hotAPI.reload("data-v-5684885d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1178:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1179:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);

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
 * Created by Hallmader on 2018/6/29.
 */


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      webViewUrl: ""
    };
  },
  onShow: function onShow() {
    var _this = this;

    if (wx.getStorageSync('isReflesh')) {
      var urlTemp = this.webViewUrl;
      this.webViewUrl = '';
      wx.removeStorageSync('isReflesh');
      setTimeout(function () {
        _this.webViewUrl = urlTemp.split('?')[0] + '?flag=' + Date.parse(new Date()) + '&' + urlTemp.split('?')[1];
      }, 100);
      // this.webViewUrl=this.webViewUrl.split('?')[0]+'?flag='+Date.parse(new Date())+'&'+this.webViewUrl.split('?')[1]
    }
  },
  onUnload: function onUnload() {
    // console.log('sdagfsfgds')
    // this.webViewUrl = '';
  },
  onLoad: function onLoad(option) {
    var str = '/dist/journalEditor.html';
    if (__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(option) !== '{}') {
      str += '?';
      for (var i in option) {
        str += i + '=' + option[i] + '&';
      }
      str = str.slice(0, str.length - 1);
      if (!option.isRedirect) {
        wx.setStorageSync('isJournalBack', true);
      }
    }
    this.webViewUrl = "" + __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + decodeURIComponent(str);
    // const query = this.$root.$mp.query;
    // this.queryUrl = query.url;
    // if (query.url.includes("m1.allinmed.cn") || query.url.includes("m.allinmed.cn")) {
    //   this.webViewUrl = `${decodeURIComponent(query.url)}`;
    // } else {
    //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(query.url)}`;
    // }
  }
});

/***/ }),

/***/ 1180:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.webViewUrl.length) ? _c('web-view', {
    attrs: {
      "src": _vm.webViewUrl,
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-5684885d", esExports)
  }
}

/***/ })

},[1311]);