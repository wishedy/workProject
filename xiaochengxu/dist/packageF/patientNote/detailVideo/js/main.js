global.webpackJsonp([47],{

/***/ 1173:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_detailVideo_vue__ = __webpack_require__(1175);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_53677cba_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_detailVideo_vue__ = __webpack_require__(1176);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1174)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-53677cba"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_detailVideo_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_53677cba_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_detailVideo_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/patientNote/detailVideo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] detailVideo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53677cba", Component.options)
  } else {
    hotAPI.reload("data-v-53677cba", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1174:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1175:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(4);

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






var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('patientNote'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;
// let getVideoList='http://10.1.8.5:8080/static/js/jourList2.json';


var getVideoList = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getVideoList/'; //手册详情--视频播放列表
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      videoObj: {
        videoUrl: ''
      },
      educationId: '',
      isFinish: false,
      loading: false,
      manualId: '',
      videoId: ''
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['videoMap'])),
  onLoad: function onLoad(option) {
    this.videoObj = {
      videoUrl: ''
    };
    this.educationId = '';
    this.isFinish = false;
    this.loading = false;
    this.manualId = '';
    this.videoId = '';
    // console.log(option)
    if (option.id) {
      this.videoId = option.id;
    }
    if (option.manualId) {
      this.manualId = option.manualId;
    }
    if (option.educationId) {
      this.educationId = option.educationId;
      this.getVideoInfo(this.educationId);
    }
  },

  methods: {
    videoPlay: function videoPlay() {
      this.isFinish = false;
      this.videoContext = wx.createVideoContext('myVideo');
      this.videoContext.play();
    },
    endVideo: function endVideo() {
      this.isFinish = true;
    },

    //获取视频信息
    getVideoInfo: function getVideoInfo(educationId) {
      var t = this;
      t.loading = true;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: getVideoList,
        method: 'post',
        data: {
          educationId: educationId,
          id: t.videoId,
          manualId: t.manualId
        },
        timeout: 30000,
        done: function done(response) {
          t.loading = false;
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList) {
            var dataList = response.responseObject.responseData.dataList;
            if (dataList.length) {
              t.videoObj = dataList[0];
              t.videoId = dataList[0].nextId;
              setTimeout(function () {
                t.videoPlay();
              }, 100);
            }
          }
        }
      });
    }
  },
  mounted: function mounted() {

    // this.videoObj=JSON.parse(this.videoMap);
  },

  components: {
    normalLoading: __WEBPACK_IMPORTED_MODULE_2_components_loading__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_3_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 1176:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "playVideoCon"
  }, [(!_vm.isFinish) ? _c('div', {
    staticClass: "videoCon"
  }, [(_vm.videoObj.videoUrl) ? _c('video', {
    ref: "videoHtml",
    attrs: {
      "src": _vm.videoObj.videoUrl,
      "controls": "",
      "poster": _vm.videoObj.imgUrl,
      "autoplay": "",
      "webkit-playsinline": "true",
      "x-webkit-airplay": "true",
      "playsinline": "true",
      "x5-playsinline": "",
      "id": "myVideo",
      "eventid": '0'
    },
    on: {
      "ended": _vm.endVideo
    }
  }) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.isFinish) ? _c('div', {
    staticClass: "playNextTip"
  }, [_c('img', {
    attrs: {
      "src": _vm.videoObj.imgUrl
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "tipContainer"
  }, [_c('div', {
    staticClass: "tipContent"
  }, [(_vm.videoObj.tipsContent) ? _c('p', {
    staticClass: "tipTitle"
  }, [_c('i', {
    staticClass: "iconTip"
  }), _c('span', [_vm._v("温馨提示：" + _vm._s(_vm.videoObj.tipsContent))])], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "tipPlaySel"
  }, [(_vm.videoObj.nextEducationId) ? _c('button', {
    staticClass: "playNextBtn wx-contact-text",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.getVideoInfo(_vm.videoObj.nextEducationId)
      }
    }
  }, [_vm._v("播放下一个")]) : _vm._e(), _vm._v(" "), _c('button', {
    staticClass: "playReshBtn wx-contact-text",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.videoPlay
    }
  }, [_vm._v("重新播放")])], 1)], 1)])]) : _vm._e(), _vm._v(" "), _c('article', {
    staticClass: "videoDesc"
  }, [_c('p', {
    staticClass: "videoText"
  }, [_vm._v(_vm._s(_vm.videoObj.educationDesc))])], 1), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '0'
    }
  }), _vm._v(" "), (_vm.loading) ? _c('normalLoading', {
    attrs: {
      "mpcomid": '1'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-53677cba", esExports)
  }
}

/***/ })

},[1310]);