global.webpackJsonp([36],{

/***/ 587:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthKnowledgeDetail_vue__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1f5d5808_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthKnowledgeDetail_vue__ = __webpack_require__(590);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(588)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthKnowledgeDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1f5d5808_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthKnowledgeDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/healthKnowledgeDetail/healthKnowledgeDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthKnowledgeDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1f5d5808", Component.options)
  } else {
    hotAPI.reload("data-v-1f5d5808", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 588:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 589:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_getPagesParam_getPagesParam__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);
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
      webViewUrl: "",
      queryUrl: ''
    };
  },
  onShow: function onShow(option) {
    console.log(option);
    __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].enterBrowse();
    var query = this.$root.$mp.query;
    this.queryUrl = query.url;

    var pDParam = __WEBPACK_IMPORTED_MODULE_1_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('doctorMain');
    var pSParam = __WEBPACK_IMPORTED_MODULE_1_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('patientNote');

    var urlTemp = '';
    var pDNum = '';
    var pDDocID = '';
    var pSnum = '';
    var pSID = '';

    if (this.queryUrl.includes("m1.allinmed.cn") || this.queryUrl.includes("m.allinmed.cn")) {
      urlTemp = "" + decodeURIComponent(this.queryUrl);
    } else {
      urlTemp = "" + __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].httpEnv() + decodeURIComponent(this.queryUrl);
    }
    if (__WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem('knowledgeDetailUrl')) {
      if (this.queryUrl.includes("m1.allinmed.cn")) {
        urlTemp = 'https://m1.allinmed.cn';
      } else if (this.queryUrl.includes("m.allinmed.cn")) {
        urlTemp = 'https://m.allinmed.cn';
      }
      urlTemp = urlTemp + __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem('knowledgeDetailUrl');
      //医生主页
      if (pDParam.hasName) {
        //有相同的
        pDNum = pDParam.backNum;
        if (pDParam.param.doctorCustomerId) {
          pDDocID = pDParam.param.doctorCustomerId;
        } else {
          if (pDParam.param.scene && pDParam.param.scene.indexOf('_') != -1) {
            pDDocID = pDParam.param.scene.split('_')[0];
          } else {
            pDDocID = pDParam.param.scene;
          }
        }
        urlTemp = urlTemp + "&pDNum=" + pDNum + "&pDDocID=" + pDDocID;
      }
      //手册
      if (pSParam.hasName) {
        //有相同的
        pSnum = pSParam.backNum;
        if (pSParam.param.manualId) {
          pSID = pSParam.param.manualId;
        } else {
          if (pSParam.param.scene && pSParam.param.scene.indexOf('_') != -1) {
            pSID = pSParam.param.scene.split('_')[0];
          } else {
            pSID = pSParam.param.scene;
          }
        }
        urlTemp = urlTemp + "&pSnum=" + pSnum + "&pSID=" + pSID;
      }
      __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].removeItem('knowledgeDetailUrl');
    } else {
      //医生主页
      if (pDParam.hasName) {
        //有相同的
        pDNum = pDParam.backNum;
        if (pDParam.param.doctorCustomerId) {
          pDDocID = pDParam.param.doctorCustomerId;
        } else {
          if (pDParam.param.scene && pDParam.param.scene.indexOf('_') != -1) {
            pDDocID = pDParam.param.scene.split('_')[0];
          } else {
            pDDocID = pDParam.param.scene;
          }
        }
        urlTemp = urlTemp + "&pDNum=" + pDNum + "&pDDocID=" + pDDocID;
      }

      //手册
      if (pSParam.hasName) {
        //有相同的
        pSnum = pSParam.backNum;
        if (pSParam.param.manualId) {
          pSID = pSParam.param.manualId;
        } else {
          if (pSParam.param.scene && pSParam.param.scene.indexOf('_') != -1) {
            pSID = pSParam.param.scene.split('_')[0];
          } else {
            pSID = pSParam.param.scene;
          }
        }
        urlTemp = urlTemp + "&pSnum=" + pSnum + "&pSID=" + pSID;
      }
    }

    var blackUserId = __WEBPACK_IMPORTED_MODULE_2_localStorage__["a" /* default */].getItem("userId");
    if (blackUserId) {
      urlTemp += "&blackUserId=" + blackUserId;
    }

    this.webViewUrl = urlTemp;

    // if (this.queryUrl.includes("m1.allinmed.cn") || this.queryUrl.includes("m.allinmed.cn")) {
    //   this.webViewUrl = `${decodeURIComponent(this.queryUrl)}`;
    // } else {
    //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(this.queryUrl)}`;
    // }
  },
  onLoad: function onLoad() {
    // const query = this.$root.$mp.query;
    // this.queryUrl = query.url;

    // if (query.url.includes("m1.allinmed.cn") || query.url.includes("m.allinmed.cn")) {
    //   this.webViewUrl = `${decodeURIComponent(query.url)}`;
    // } else {
    //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(query.url)}`;
    // }
  },

  //转发事件
  onShareAppMessage: function onShareAppMessage(res) {
    var _this = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    //  let _path =  `/${getCurrentPages()[0].route}`;
    var _path = "/pages/mIndex/mIndex?from=shareFriend&url=" + this.queryUrl + "&path=/pages/healthKnowledgeDetail/healthKnowledgeDetail";
    return {
      title: '分享给你一篇不错的文章，快看看哟～',
      path: _path
    };
  }
});

/***/ }),

/***/ 590:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('web-view', {
    attrs: {
      "src": _vm.webViewUrl,
      "mpcomid": '0'
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1f5d5808", esExports)
  }
}

/***/ })

},[1235]);