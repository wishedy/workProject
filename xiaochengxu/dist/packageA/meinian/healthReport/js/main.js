global.webpackJsonp([110],{

/***/ 786:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthReport_vue__ = __webpack_require__(788);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2a906c4a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthReport_vue__ = __webpack_require__(789);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(787)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthReport_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2a906c4a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthReport_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/meinian/healthReport.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthReport.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2a906c4a", Component.options)
  } else {
    hotAPI.reload("data-v-2a906c4a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 787:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 788:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);

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

/**
 * @Desc：美年大合作问诊流程
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by zhangheng on 2018/11/1.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('meinian'),
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      checkDoctor: false,
      from: 'meinian'
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['consultDoctor', 'getReportDetail', 'changeIdentityCardNum', 'changeName']), {
    checkAttachment: function checkAttachment() {
      var t = this;
      wx.navigateTo({
        url: '/packageA/meinian/imageList'
      });
    }
  }),
  onLoad: function onLoad(option) {
    var t = this;
    if (option.from) {
      t.from = option.from;
      t.nav = option.nav;
    }
    if (t.from && t.from === 'medical') {
      t.checkDoctor = false;
      t.changeIdentityCardNum(option.certificateCode);
      t.changeName(option.patientName);
      t.getReportDetail({ from: 'other', physicalNo: option.physicalNo });
    } else {
      t.checkDoctor = true;
    }
  },
  onShow: function onShow() {
    if (!this.checkDoctor) {
      if (this.from && this.from === 'medical') {
        this.checkDoctor = false;
      } else {
        this.checkDoctor = true;
      }
    }
  },
  onUnload: function onUnload() {
    var t = this;
    console.log(t.nav);
    if (t.from === 'meinian' && t.nav == 0) {
      if (__WEBPACK_IMPORTED_MODULE_1_localStorage__["a" /* default */].getItem('backIndex')) {
        return false;
      }
      wx.navigateTo({
        url: '/packageA/meinian/patientList'
      });
    }
    t.from = '';
  },
  mounted: function mounted() {
    console.log(this.reportData);
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
    reportList: function reportList() {
      var t = this;
      if (t.reportData && t.reportData.responseData && t.reportData.responseData.dataList && t.reportData.responseData.dataList[0].physicalResultList) {
        return t.reportData.responseData.dataList[0].physicalResultList;
      } else {
        return [];
      }
    }
  })
});

/***/ }),

/***/ 789:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "report-inner"
  }, [_c('section', {
    staticClass: "healthCooperationHeader"
  }, [_c('h1', {
    staticClass: "logo"
  }), _vm._v(" "), _c('span', [_vm._v("美年大健康体检报告")])], 1), _vm._v(" "), (_vm.physicalAttList.length) ? _c('section', {
    staticClass: "healthCooperationImages",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.checkAttachment($event)
      }
    }
  }, [_c('span', {
    staticClass: "imageNumber"
  }, [_c('i', {
    staticClass: "icon"
  }), _vm._v(" "), _c('i', [_vm._v("影像检测图片（共" + _vm._s(_vm.physicalAttList.length) + "张图）")])], 1), _vm._v(" "), _c('span', {
    staticClass: "check-btn"
  }, [_vm._v("查看")])]) : _vm._e(), _vm._v(" "), (_vm.reportList.length) ? _c('section', {
    staticClass: "healthCooperationReportList"
  }, _vm._l((_vm.reportList), function(item, index) {
    return _c('article', {
      key: index,
      staticClass: "healthCooperationReportItem"
    }, _vm._l((item), function(innerItem, innerKey) {
      return _c('section', {
        key: innerKey
      }, [_c('h1', {
        staticClass: "title",
        domProps: {
          "textContent": _vm._s(innerKey)
        }
      }), _vm._v(" "), _vm._l((innerItem), function(innerListItem, innerIndex) {
        return _c('article', {
          key: innerIndex,
          staticClass: "bodyParts"
        }, [_c('h3', {
          staticClass: "subTitle"
        }, [_c('i'), _vm._v(" "), _c('span', {
          domProps: {
            "textContent": _vm._s(innerListItem.inspectionItem)
          }
        })], 1), _vm._v(" "), _c('article', {
          staticClass: "reportDescribe"
        }, [_c('h3', {
          staticClass: "describeTitle"
        }, [_c('i'), _vm._v(" "), _c('span', [_vm._v("描述")])], 1), _vm._v(" "), _c('p', {
          staticClass: "describeContent",
          domProps: {
            "textContent": _vm._s(innerListItem.inspectionDesc)
          }
        })], 1), _vm._v(" "), _c('article', {
          staticClass: "reportDescribe"
        }, [_c('h3', {
          staticClass: "describeTitle"
        }, [_c('i'), _vm._v(" "), _c('span', [_vm._v("检查结果")])], 1), _vm._v(" "), _c('p', {
          staticClass: "describeContent",
          domProps: {
            "textContent": _vm._s(innerListItem.inspectionResult)
          }
        })], 1)], 1)
      })], 2)
    }))
  })) : _vm._e(), _vm._v(" "), (_vm.checkDoctor) ? _c('section', {
    staticClass: "footer-btn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.consultDoctor($event)
      }
    }
  }, [_c('i', {
    staticClass: "icon"
  }), _vm._v("\n    免费咨询医生\n  ")], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2a906c4a", esExports)
  }
}

/***/ })

},[1249]);