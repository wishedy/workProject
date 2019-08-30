global.webpackJsonp([104],{

/***/ 821:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_videoPlayer_vue__ = __webpack_require__(823);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7151d355_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_videoPlayer_vue__ = __webpack_require__(824);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(822)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_videoPlayer_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7151d355_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_videoPlayer_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/videoPlayer/videoPlayer.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] videoPlayer.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7151d355", Component.options)
  } else {
    hotAPI.reload("data-v-7151d355", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 822:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 823:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_localStorage__ = __webpack_require__(9);
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
 * Created by hallmader on 2018/7/24.
 */

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      videoUrl: "",
      isIphoneX: false
    };
  },

  methods: {},
  onLoad: function onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function success(res) {
        if (res.model.indexOf('iPhone X') > -1) {
          that.isIphoneX = true;
        }
      }
    });
  },
  onShow: function onShow() {
    var _this = this;
    if (__WEBPACK_IMPORTED_MODULE_0_localStorage__["a" /* default */].getItem("isOnWatch")) {} else {
      wx.onNetworkStatusChange(function (res) {
        __WEBPACK_IMPORTED_MODULE_0_localStorage__["a" /* default */].setItem("isOnWatch", true);
        if (!res.isConnected) {
          __WEBPACK_IMPORTED_MODULE_0_localStorage__["a" /* default */].setItem("isOffLine", true);
          wx.showModal({
            // title: '当前网络不可用，请检查网络设置',
            content: '当前网络不可用，请检查网络设置',
            confirmText: "重试",
            confirmColor: '#2EA9FE',
            success: function success(res) {
              if (res.confirm) {
                _this.videoContext.play();
              } else if (res.cancel) {
                wx.navigateBack({ delta: 1 });
              }
            }
          });
        } else {
          __WEBPACK_IMPORTED_MODULE_0_localStorage__["a" /* default */].setItem("isOffLine", false);
        }
      });
    }
    this.videoUrl = decodeURIComponent(this.$root.$mp.query.videoUrl);
    this.videoContext = wx.createVideoContext('videoPlayer');
    if (this.isIphoneX) {
      console.log("12423");
      //        this.videoContext.requestFullScreen();
    }
    this.videoContext.play();
  },
  onUnload: function onUnload() {
    this.videoContext.pause();
    if (this.isIphoneX) {
      //        this.videoContext.exitFullScreen();
    }
  },
  onHide: function onHide() {
    this.videoContext.pause();
    if (this.isIphoneX) {
      //        this.videoContext.exitFullScreen();
    }
  }
});

/***/ }),

/***/ 824:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "video-player"
  }, [(_vm.isIphoneX) ? _c('video', {
    attrs: {
      "src": _vm.videoUrl,
      "id": "videoPlayer",
      "direction": "0",
      "autoplay": "true"
    }
  }) : _c('video', {
    attrs: {
      "src": _vm.videoUrl,
      "id": "videoPlayer",
      "autoplay": "true"
    }
  })])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7151d355", esExports)
  }
}

/***/ })

},[1256]);