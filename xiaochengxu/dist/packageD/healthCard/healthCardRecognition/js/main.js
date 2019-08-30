global.webpackJsonp([95],{

/***/ 989:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardRecognition_vue__ = __webpack_require__(991);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_026118e9_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardRecognition_vue__ = __webpack_require__(992);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(990)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-026118e9"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthCardRecognition_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_026118e9_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthCardRecognition_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/healthCard/healthCardRecognition.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthCardRecognition.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-026118e9", Component.options)
  } else {
    hotAPI.reload("data-v-026118e9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 990:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 991:
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
//
//
//

/*
 * @Desc: 居民健康卡注册 身份证识别
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/3/27
 *
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      imgUrl: "http://m.allinmed.cn/static/image/mp/index/1.4.0/card@3x.png", //图片地址
      from: '' //来源
    };
  },
  onLoad: function onLoad(option) {
    console.log(option);
    this.from = option.from;
    this.imgUrl = '';
  },
  onShow: function onShow() {},

  methods: {
    upLoadImg: function upLoadImg() {},
    goNext: function goNext() {
      var _this = this;
      wx.navigateTo({
        url: '/packageD/healthCard/healthRegister'
      });
    },
    goPass: function goPass() {
      var _this = this;
      wx.navigateTo({
        url: '/packageD/healthCard/healthRegister'
      });
    }
  }
});

/***/ }),

/***/ 992:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "recognition-main"
  }, [_c('section', {
    staticClass: "recognition-title"
  }, [_vm._v("领取居民健康卡，有利于医生了解您的病情")]), _vm._v(" "), _c('section', {
    staticClass: "recognition-upLoad"
  }, [_c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imgUrl.length == 0),
      expression: "imgUrl.length==0"
    }],
    staticClass: "recognition-cover-border",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.upLoadImg()
      }
    }
  }), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imgUrl.length == 0),
      expression: "imgUrl.length==0"
    }],
    staticClass: "recognition-cover-card"
  }), _vm._v(" "), (_vm.imgUrl.length == 0) ? _c('section', {
    staticClass: "recognition-cover-btn"
  }, [_c('section', {
    staticClass: "recognition-coverBtn-box"
  }, [_c('span', {
    staticClass: "recognition-btn-text"
  }, [_vm._v("点击上传")])])], 1) : _vm._e(), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imgUrl.length > 0),
      expression: "imgUrl.length>0"
    }],
    staticClass: "recognition-img",
    attrs: {
      "src": _vm.imgUrl,
      "alt": ""
    }
  }), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imgUrl.length > 0),
      expression: "imgUrl.length>0"
    }],
    staticClass: "recognition-reload"
  }, [_c('section', {
    staticClass: "recognition-reload-box"
  }, [_c('span', {
    staticClass: "recognition-reload-cover"
  }), _vm._v(" "), _c('span', {
    staticClass: "recognition-reload-icon"
  }), _vm._v(" "), _c('span', {
    staticClass: "recognition-reload-text"
  }, [_vm._v("重新上传")])])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "cecognition-tip"
  }, [_c('span', {
    staticClass: "recognition-tip-icon"
  }), _vm._v("请上传本人身份证正面照片\n  ")]), _vm._v(" "), _c('section', {
    staticClass: "recognition-Btn"
  }, [_c('section', {
    staticClass: "recognition-next",
    class: {
      'actived': _vm.imgUrl.length > 0
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.goNext
    }
  }, [_vm._v("下一步")]), _vm._v(" "), _c('section', {
    staticClass: "recognition-next-two",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.goPass
    }
  }, [_vm._v("身份证不在身边")])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-026118e9", esExports)
  }
}

/***/ })

},[1290]);