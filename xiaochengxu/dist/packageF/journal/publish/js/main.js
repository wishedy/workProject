global.webpackJsonp([48],{

/***/ 1181:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_publish_vue__ = __webpack_require__(1183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3da495b0_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_publish_vue__ = __webpack_require__(1184);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1182)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_publish_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3da495b0_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_publish_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journal/publish.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] publish.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3da495b0", Component.options)
  } else {
    hotAPI.reload("data-v-3da495b0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1182:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1183:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_getPagesParam_getPagesParam__ = __webpack_require__(54);
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/11/29.
 */


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      patientCustomerId: '',
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      }
    };
  },

  methods: {
    saveImagePhoto: function saveImagePhoto() {
      var _this = this;
      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            //授权成功
            _this.saveImg();
          } else {
            //授权失败
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function success(res) {
                //写入成功
                _this.saveImg();
              },
              fail: function fail(err) {
                //写入失败
                wx.showToast({
                  title: '微信授权失败，请重试',
                  icon: 'none'
                });
                _this.ensureShow = true;
              }
            });
          }
        },
        fail: function fail(err) {
          wx.showToast({
            title: '微信授权失败，请重试',
            icon: 'none'
          });
        }
      });
    },
    saveImg: function saveImg() {
      var _this2 = this;

      wx.saveImageToPhotosAlbum({
        filePath: '/static/image/v1.1.4/pulishCode.jpg',
        success: function success(res) {
          wx.showModal({
            title: "图片已保存至手机相册",
            content: '快去分享给朋友们吧',
            showCancel: false,
            confirmText: '知道了',
            confirmColor: '#00BEAF'
          });
          console.log(res);
        },
        fail: function fail() {
          wx.getSetting({
            success: function success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                _this2.saveImg();
              } else {
                _this2.ensureShow = true;
              }
            },
            fail: function fail(err) {
              console.log(err);
            }
          });
        }
      });
    },
    goback: function goback() {
      var pagesParam = __WEBPACK_IMPORTED_MODULE_1_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('journalList');

      if (pagesParam.hasName) {
        //有相同的
        wx.navigateBack({
          delta: pagesParam.backNum
        });
      } else {
        //没有相同的历史
        wx.redirectTo({
          url: "/packageF/journal/journalList?patientCustomerId=" + this.patientCustomerId
        });
      }
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.errMsg === "openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']) {
        this.ensureShow = false;
        this.saveImg();
      } else {
        this.ensureShow = false;
      }
    }
  },
  onLoad: function onLoad(option) {
    if (option.patientCustomerId) {
      this.patientCustomerId = option.patientCustomerId;
    }
  },

  components: {
    EnsureConfirm: __WEBPACK_IMPORTED_MODULE_0_components_ensure__["a" /* default */]
  }
});

/***/ }),

/***/ 1184:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "mainPublish"
  }, [_c('section', {
    staticClass: "title"
  }, [_vm._v("操作成功")]), _vm._v(" "), _c('section', {
    staticClass: "mainContent"
  }, [_c('section', {
    staticClass: "comment"
  }, [_vm._v("已优先为您的日记安排审核。")]), _vm._v(" "), _c('section', {
    staticClass: "comment"
  }, [_vm._v("我们会在审核中根据实际情况优化日记的易读性、错别字等。过程持续3～5个工作日，审核通过后，会即时通知您。")]), _vm._v(" "), _c('section', {
    staticClass: "comment"
  }, [_vm._v("建议您加入患友群，即时接收通知，享受就医福利。")])], 1), _vm._v(" "), _c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/pulishCode.jpg"
    }
  }), _vm._v(" "), _c('section', {
    staticClass: "saveButtom",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.saveImagePhoto()
      }
    }
  }, [_vm._v("保存二维码")]), _vm._v(" "), _c('section', {
    staticClass: "back",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.goback
    }
  }, [_vm._v("返回首页")]), _vm._v(" "), (_vm.ensureShow) ? _c('EnsureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '2',
      "mpcomid": '0'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3da495b0", esExports)
  }
}

/***/ })

},[1312]);