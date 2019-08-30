global.webpackJsonp([96],{

/***/ 993:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardList_vue__ = __webpack_require__(995);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4c83d948_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardList_vue__ = __webpack_require__(996);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(994)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4c83d948"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4c83d948_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/healthCard/healthCardList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthCardList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4c83d948", Component.options)
  } else {
    hotAPI.reload("data-v-4c83d948", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 994:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 995:
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

/*
 * @Desc: 居民健康卡列表
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/4/2
 *
 */
/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            cardList: ['', '', '', '', '']
        };
    },

    methods: {
        goToDetail: function goToDetail(item) {
            console.log(item);
            wx.navigateTo({
                url: "/packageD/healthCard/healthCardDetail"
            });
        }
    }
});

/***/ }),

/***/ 996:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "healthCard-main"
  }, [_c('section', {
    staticClass: "healthCard-list"
  }, _vm._l((_vm.cardList), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "healthCard-item",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.goToDetail(item)
        }
      }
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
    }, [_vm._v("**杰")])]), _vm._v(" "), _c('section', {
      staticClass: "healthCard-sex"
    }, [_c('span', {
      staticClass: "healthCard-sex-one"
    }, [_vm._v("性别：")]), _vm._v(" "), _c('span', {
      staticClass: "healthCard-sex-two"
    }, [_vm._v("男")])])], 1)], 1)
  }))], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4c83d948", esExports)
  }
}

/***/ })

},[1291]);