global.webpackJsonp([23],{

/***/ 510:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadGuide_vue__ = __webpack_require__(512);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dd2dc168_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadGuide_vue__ = __webpack_require__(513);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(511)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-dd2dc168"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadGuide_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_dd2dc168_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadGuide_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/upLoadGuide/upLoadGuide.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] upLoadGuide.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-dd2dc168", Component.options)
  } else {
    hotAPI.reload("data-v-dd2dc168", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 511:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 512:
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

// 上传指导页
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      skipShow: true,
      swiperOption: {
        notNextTick: true,
        setWrapperSize: true,
        observeParents: true
      }
    };
  },
  onShow: function onShow() {
    this.skipShow = true;
  },

  methods: {
    skipCallBack: function skipCallBack() {
      wx.setStorageSync("guideFrom", "shootips");
      wx.navigateBack({
        delta: 1
      });
    },
    swiperChange: function swiperChange(e) {
      if (e.target.current == 3) {
        this.skipShow = false;
      } else {
        this.skipShow = true;
      }
    }
  }
});

/***/ }),

/***/ 513:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "shootTipsBox"
  }, [_c('button', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.skipShow),
      expression: "skipShow"
    }],
    staticClass: "btn-slideOver",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.skipCallBack
    }
  }, [_vm._v("关闭")]), _vm._v(" "), _c('swiper', {
    staticClass: "swiper-containMain",
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "options": _vm.swiperOption,
      "indicator-dots": "true",
      "indicator-color": "#cccccc",
      "indicator-active-color": "#00BCB3",
      "eventid": '2'
    },
    on: {
      "change": _vm.swiperChange
    }
  }, [_c('swiper-item', {
    attrs: {
      "mpcomid": '0'
    }
  }, [_c('scroll-view', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "scroll-y": ""
    }
  }, [_c('article', {
    staticClass: "stepOneBox"
  }, [_c('figure', {
    staticClass: "stepOneMain"
  }, [_c('h2', {
    staticClass: "stepOneTitle"
  }), _vm._v(" "), _c('p', {
    staticClass: "stepOneImg"
  }), _vm._v(" "), _c('h3', [_vm._v("数码相机或者手机拍摄")]), _vm._v(" "), _c('figcaption', [_vm._v("首推单反相机或者卡片机拍摄也可"), _c('br'), _vm._v("用手机进行拍摄")], 1), _vm._v(" "), _c('h4', [_vm._v("提示：拍摄前请关闭设备闪光灯")])], 1)], 1)], 1)], 1), _vm._v(" "), _c('swiper-item', {
    attrs: {
      "mpcomid": '1'
    }
  }, [_c('scroll-view', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "scroll-y": ""
    }
  }, [_c('article', {
    staticClass: "stepTwoBox"
  }, [_c('figure', {
    staticClass: "stepTwoMain"
  }, [_c('h2', {
    staticClass: "stepTwoTitle"
  }), _vm._v(" "), _c('p', {
    staticClass: "stepTwoImgComputer"
  }), _vm._v(" "), _c('h3', [_vm._v("拍摄背景选择电脑")]), _vm._v(" "), _c('article', [_vm._v("打开word白色背景全屏进行拍摄")]), _vm._v(" "), _c('p', {
    staticClass: "stepTwoImgWindow"
  }), _vm._v(" "), _c('h3', [_vm._v("拍摄背景选择窗户")]), _vm._v(" "), _c('article', [_vm._v("找一间朝阳的房间在玻璃上贴张白 纸并将片子贴在白纸上")]), _vm._v(" "), _c('h4', {
    staticStyle: {
      "color": "#F8852D"
    }
  }, [_vm._v("提示：为避免反光，请关闭房间灯光，同时建议拍摄者穿深黑色服装")])], 1)], 1)], 1)], 1), _vm._v(" "), _c('swiper-item', {
    attrs: {
      "mpcomid": '2'
    }
  }, [_c('scroll-view', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "scroll-y": ""
    }
  }, [_c('article', {
    staticClass: "stepThreeBox"
  }, [_c('figure', {
    staticClass: "stepThreeMain"
  }, [_c('h2', {
    staticClass: "stepThreeTitle"
  }), _vm._v(" "), _c('p', {
    staticClass: "stepThreeImgComputer"
  }), _vm._v(" "), _c('h3', [_vm._v("通过片子上的R/L或豁口找正反")]), _vm._v(" "), _c('article', {
    staticClass: "stepThreeInfo"
  }, [_vm._v("如图，L保持在右侧"), _c('br'), _vm._v("R在左侧，或者在片子上找到豁口，"), _c('span', {
    staticStyle: {
      "color": "#F8852D"
    }
  }, [_vm._v("将豁口保持在右上方")])], 1), _vm._v(" "), _c('p', {
    staticClass: "stepThreeImgWindow"
  }), _vm._v(" "), _c('h3', [_vm._v("根据片子上的文字判断正反")]), _vm._v(" "), _c('article', [_vm._v("如图，根据文字顺序正反来分清正反")])], 1)], 1)], 1)], 1), _vm._v(" "), _c('swiper-item', {
    attrs: {
      "mpcomid": '3'
    }
  }, [_c('scroll-view', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "scroll-y": ""
    }
  }, [_c('article', {
    staticClass: "stepFourBox"
  }, [_c('figure', {
    staticClass: "stepFourMain"
  }, [_c('h2', {
    staticClass: "stepFourTitle"
  }), _vm._v(" "), _c('p', {
    staticClass: "stepFourImgComputer"
  }), _vm._v(" "), _c('h3', [_vm._v("X光片建议以窗户为背景整张拍摄")]), _vm._v(" "), _c('p', {
    staticClass: "stepFourImgWindow"
  }), _vm._v(" "), _c('h3', [_vm._v("CT/核磁每1-4格拍摄一张")]), _vm._v(" "), _c('article', [_vm._v("从左至右，从上至下依次拍摄")]), _vm._v(" "), _c('h4', {
    staticStyle: {
      "color": "#F8852D"
    }
  }, [_vm._v("提示：①拍完后确保片子上文字可以看清")]), _vm._v(" "), _c('h3', {
    staticStyle: {
      "color": "#F8852D"
    }
  }, [_vm._v("②片子上如有反光、人影或障碍物请重新拍摄")]), _vm._v(" "), _c('button', {
    staticClass: "btn-goShoot",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.skipCallBack
    }
  }, [_vm._v("关闭")])], 1)], 1)], 1)], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-dd2dc168", esExports)
  }
}

/***/ })

},[1230]);