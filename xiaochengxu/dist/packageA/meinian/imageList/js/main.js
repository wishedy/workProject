global.webpackJsonp([109],{

/***/ 782:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imageList_vue__ = __webpack_require__(784);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_746cda22_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imageList_vue__ = __webpack_require__(785);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(783)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imageList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_746cda22_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imageList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/meinian/imageList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] imageList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-746cda22", Component.options)
  } else {
    hotAPI.reload("data-v-746cda22", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 783:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 784:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);

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



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('meinian'),
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'attachment',
  data: function data() {
    return {
      viewImageIndex: -1
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapGetters(['reportData']), {
    physicalAttList: function physicalAttList() {
      var t = this;
      if (t.reportData && t.reportData.responseData && t.reportData.responseData.dataList && t.reportData.responseData.dataList[0].physicalAttList) {
        return t.reportData.responseData.dataList[0].physicalAttList;
      } else {
        return [];
      }
    },
    imageArr: function imageArr() {
      var t = this;
      if (t.physicalAttList.length) {
        var arr = [];
        for (var i = 0; i < t.physicalAttList.length; i++) {
          arr.push(t.physicalAttList[i]['attUrl']);
        }
        return arr;
      } else {
        return [];
      }
    }
  }),
  watch: {},
  components: {},
  methods: {
    viewImage: function viewImage(index) {
      var t = this;
      wx.previewImage({
        current: t.imageArr[index], //当前图片地址
        urls: t.imageArr, //所有要预览的图片的地址集合 数组形式
        success: function success(res) {},
        fail: function fail(res) {},
        complete: function complete(res) {}
      });
    },
    returnBackUrl: function returnBackUrl() {
      var t = this;
      wx.navigateBack({
        delta: 1
      });
    },
    changeSlide: function changeSlide(index) {
      var t = this;
      t.viewImageIndex = index;
    }
  }
});

/***/ }),

/***/ 785:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "report-attachment-inner"
  }, [_c('h1', {
    staticClass: "title"
  }, [_c('i'), _vm._v(" "), _c('span', {
    staticClass: "subTitle"
  }, [_vm._v("共" + _vm._s(_vm.physicalAttList.length) + "张图片")])], 1), _vm._v(" "), _c('article', {
    staticClass: "report-attachment-list"
  }, _vm._l((_vm.physicalAttList), function(item, index) {
    return _c('figure', {
      key: index,
      staticClass: "report-attachment-item",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.viewImage(index)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.attUrl,
        "alt": item.inspectionItem
      }
    })])
  })), _vm._v(" "), _c('div', {
    staticClass: "returnBack",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.returnBackUrl($event)
      }
    }
  }, [_vm._v("返回")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-746cda22", esExports)
  }
}

/***/ })

},[1248]);