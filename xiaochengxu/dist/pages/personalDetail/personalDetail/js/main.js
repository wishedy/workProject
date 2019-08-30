global.webpackJsonp([25],{

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_personalDetail_vue__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_91747e98_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_personalDetail_vue__ = __webpack_require__(370);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(368)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_personalDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_91747e98_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_personalDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/personalDetail/personalDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] personalDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-91747e98", Component.options)
  } else {
    hotAPI.reload("data-v-91747e98", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 368:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localStorage__ = __webpack_require__(9);
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




/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      finish: false,
      baseInfo: {
        nickName: "",
        headUrl: ""
      }
    };
  },

  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_1_components_loading__["a" /* default */]
  },
  methods: {
    goRenew: function goRenew(data) {
      switch (data) {
        case 1:
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function success(res) {
              var src = res.tempFilePaths[0];
              wx.navigateTo({
                url: '/pages/cropper/cropper?imgUrl=' + src
              });
            }
          });
          break;
        case 2:
          wx.navigateTo({
            url: '/pages/changeName/changeName?name=' + this.baseInfo.nickName
          });
      }
    }
  },
  onShow: function onShow() {
    wx.setNavigationBarTitle({
      title: '我的资料'
    });
    this.baseInfo = {
      nickName: __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("nickName"),
      headUrl: __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("logoUrl")
    };
    // miniLogin({
    //   successCallBack: (res) => {
    //     if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
    //       this.baseInfo = res.data.responseObject.responseData
    //       this.finish = false
    //     }
    //   }
    // });
  }
});

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('div', {
    staticClass: "item",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goRenew(1)
      }
    }
  }, [_c('span', {
    staticClass: "title1"
  }, [_vm._v("我的头像")]), _vm._v(" "), _c('image', {
    staticClass: "avator",
    attrs: {
      "src": _vm.baseInfo.headUrl
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "item",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.goRenew(2)
      }
    }
  }, [_c('span', {
    staticClass: "title2"
  }, [_vm._v("我的昵称")]), _vm._v(" "), _c('span', {
    staticClass: "operate"
  }, [_c('em', [_vm._v(_vm._s(_vm.baseInfo.nickName))])], 1)]), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-91747e98", esExports)
  }
}

/***/ })

},[1210]);