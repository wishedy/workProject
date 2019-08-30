global.webpackJsonp([11],{

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_cropper_vue__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c4d066a0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_cropper_vue__ = __webpack_require__(387);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(380)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-c4d066a0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_cropper_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c4d066a0_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_cropper_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/cropper/cropper.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] cropper.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c4d066a0", Component.options)
  } else {
    hotAPI.reload("data-v-c4d066a0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 380:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_weCropper__ = __webpack_require__(382);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
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
//






var XHRUrl = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/customer/unite/info/v1/createPicture/";

var wecropper = void 0;

var device = wx.getSystemInfoSync();
var width = device.windowWidth;
var height = device.windowHeight / 2;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      imgUrl: '',
      cropperOpt: {
        id: 'cropper',
        width: width,
        height: height,
        scale: 2.5,
        zoom: 8,
        cut: {
          x: (width - 300) / 2,
          y: (height - 300) / 2,
          width: 300,
          height: 300
        }
      }
    };
  },


  components: {
    MpvueCropper: __WEBPACK_IMPORTED_MODULE_0_components_weCropper__["a" /* default */]
  },

  methods: {
    cropperReady: function cropperReady() {
      console.log('cropper ready!');
    },
    cropperBeforeImageLoad: function cropperBeforeImageLoad() {
      console.log('before image load');
    },
    cropperLoad: function cropperLoad() {
      console.log('image loaded');
    },
    inits: function inits() {
      wecropper.pushOrigin(this.$root.$mp.query.imgUrl);
    },
    getCropperImage: function getCropperImage() {
      console.log(111);
      wecropper.getCropperImage().then(function (src) {
        wx.uploadFile({
          url: XHRUrl,
          filePath: src,
          name: "file",
          formData: {
            customerId: __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("userId"),
            attType: 1,
            visitSiteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId(),
            sortId: "1"
          },
          success: function success() {
            wx.showToast({
              title: '上传图片成功',
              icon: 'success',
              duration: 2000,
              success: function success() {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/personal/personal'
                  });
                }, 2000);
              }
            });
          },
          fail: function fail() {
            wx.showToast({
              title: '上传图失败',
              icon: 'fail',
              duration: 2000,
              success: function success() {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '/pages/personalDetail/personalDetail'
                  });
                }, 2000);
              }
            });
          },
          complete: function complete() {}
        });
      }).catch(function (e) {
        console.error('获取图片失败');
      });
    }
  },

  mounted: function mounted() {
    wx.setNavigationBarTitle({
      title: '更换头像'
    });
    wecropper = this.$refs.cropper;
    this.inits();
  }
});

/***/ }),

/***/ 382:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_weCropper_vue__ = __webpack_require__(384);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ddfc0534_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_weCropper_vue__ = __webpack_require__(386);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(383)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_weCropper_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ddfc0534_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_weCropper_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/weCropper.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] weCropper.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ddfc0534", Component.options)
  } else {
    hotAPI.reload("data-v-ddfc0534", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 383:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 384:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_we_cropper__ = __webpack_require__(385);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_we_cropper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_we_cropper__);


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



var _wecropper = void 0;
/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'mpvue-cropper',
  props: {
    option: {
      type: Object
    }
  },
  computed: {
    _canvasId: function _canvasId() {
      return this.option.id;
    },
    _width: function _width() {
      return this.option.width;
    },
    _height: function _height() {
      return this.option.height;
    }
  },
  methods: {
    touchstart: function touchstart($event) {
      _wecropper.touchStart({
        touches: $event.mp.touches.filter(function (i) {
          return i.x !== undefined;
        })
      });
    },
    touchmove: function touchmove($event) {
      _wecropper.touchMove({
        touches: $event.mp.touches.filter(function (i) {
          return i.x !== undefined;
        })
      });
    },
    touchend: function touchend($event) {
      _wecropper.touchEnd($event.mp);
    },
    pushOrigin: function pushOrigin(src) {
      _wecropper.pushOrign(src);
    },
    updateCanvas: function updateCanvas() {
      _wecropper.updateCanvas();
    },
    getCropperBase64: function getCropperBase64() {
      return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        _wecropper.getCropperImage(function (src) {
          src ? resolve(src) : reject();
        });
      });
    },
    getCropperImage: function getCropperImage() {
      return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        _wecropper.getCropperImage(function (src) {
          src ? resolve(src) : reject();
        });
      });
    },
    init: function init() {
      var _this = this;

      _wecropper = new __WEBPACK_IMPORTED_MODULE_2_we_cropper___default.a(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()(this.option, {
        id: this._canvasId
      })).on('ready', function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.$emit.apply(_this, ['ready'].concat(args));
      }).on('beforeImageLoad', function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _this.$emit.apply(_this, ['beforeImageLoad'].concat(args));
      }).on('imageLoad', function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        _this.$emit.apply(_this, ['imageLoad'].concat(args));
      }).on('beforeDraw', function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        _this.$emit.apply(_this, ['beforeDraw'].concat(args));
      }).updateCanvas();
    }
  },
  onLoad: function onLoad() {
    if (!this.option) {
      return console.warn('[mpvue-cropper] 请传入option参数\n参数配置见文档：https://we-plugin.github.io/we-cropper/#/api');
    }
    this.init();
  }
});

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm._canvasId) ? _c('canvas', {
    style: ({
      width: _vm._width + 'px',
      height: _vm._height + 'px',
      background: 'black',
      marginTop: 200 + 'px'
    }),
    attrs: {
      "canvasId": _vm._canvasId,
      "disable-scroll": "",
      "eventid": '0'
    },
    on: {
      "touchstart": _vm.touchstart,
      "touchmove": _vm.touchmove,
      "touchend": _vm.touchend
    }
  }) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ddfc0534", esExports)
  }
}

/***/ }),

/***/ 387:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "main"
  }, [_c('section', {
    staticClass: "fillup2"
  }), _vm._v(" "), _c('MpvueCropper', {
    ref: "cropper",
    attrs: {
      "option": _vm.cropperOpt,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "ready": _vm.cropperReady,
      "beforeDraw": _vm.cropperBeforeDraw,
      "beforeImageLoad": _vm.cropperBeforeImageLoad,
      "beforeLoad": _vm.cropperLoad
    }
  }), _vm._v(" "), _c('button', {
    staticClass: "changeAvator",
    attrs: {
      "eventid": '1'
    },
    on: {
      "tap": _vm.getCropperImage
    }
  }, [_vm._v("更换头像")]), _vm._v(" "), _c('section', {
    staticClass: "fillup"
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c4d066a0", esExports)
  }
}

/***/ })

},[1213]);