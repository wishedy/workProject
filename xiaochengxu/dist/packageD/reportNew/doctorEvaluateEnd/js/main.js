global.webpackJsonp([72],{

/***/ 854:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorEvaluateEnd_vue__ = __webpack_require__(856);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_43d0184f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorEvaluateEnd_vue__ = __webpack_require__(857);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(855)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-43d0184f"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorEvaluateEnd_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_43d0184f_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorEvaluateEnd_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/doctorEvaluateEnd.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorEvaluateEnd.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-43d0184f", Component.options)
  } else {
    hotAPI.reload("data-v-43d0184f", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 855:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 856:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__common_js_doctorEvaluate_doctorEvaluateStarTags__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__common_js_HttpRequest_getEducationList__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_healthKnowComponents_healthItem__ = __webpack_require__(125);

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









 //健康知识信息 api

 //健康知识组件
var XHRList = {
  getConsultation: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/tocure/patient/score/getByConsultId/', // 获取评价内容
  getDoctorGuide: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorGuide/' // 获取专家指南列表
};
/* harmony default export */ __webpack_exports__["a"] = ({
  name: "doctorEvaluateEnd",
  data: function data() {
    return {
      loading: false,
      params: {
        // 推荐患教参数
        recommendParam: {
          firstResult: 0,
          maxResult: 10,
          refCustomerId: '',
          isValid: 1,
          status: 1,
          sortType: 8,
          educationContentTypeNotIn: "5"
        }
      },
      pageNum: 0, //分页计数
      noMoreData: false, //无更多数据
      isLoadMore: false, //是否加载更多数据
      commentInfo: { // 评价信息
        consultationId: "",
        createTime: "",
        doctorId: "",
        doctorName: "",
        isSecret: "",
        patientCustomerId: "",
        patientName: "",
        recommendStar: "",
        serviceStar: "",
        status: "",
        tagList: [],
        thoughts: ""
      },
      selectedTags: [],
      recommendListsLess: [], //健康知识
      recommendLists: [] //健康知识对象
    };
  },

  computed: {
    //分享医生主页超4个字截取
    shareDoctorName: function shareDoctorName() {
      if (this.commentInfo.doctorName && this.commentInfo.doctorName.length > 4) {
        return this.commentInfo.doctorName.substr(0, 4) + "...";
      } else {
        return this.commentInfo.doctorName;
      }
    }
  },
  components: {
    healthItem: __WEBPACK_IMPORTED_MODULE_11__components_healthKnowComponents_healthItem__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_6_components_LogoLoading__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_10_components_BlackList__["a" /* default */]
  },
  onLoad: function onLoad(options) {
    this.consultationId = options.consultationId;
  },
  onShow: function onShow() {
    this.pageNum = 0;
    this.noMoreData = false;
    this.recommendListsLess = [];
    this.init();

    __WEBPACK_IMPORTED_MODULE_5_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({});
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_5_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },
  onReachBottom: function onReachBottom() {
    var _this = this;
    if (!_this.noMoreData && _this.isLoadMore) {
      _this.isLoadMore = false;
      _this.getRecommendListFn(); //加载专家文章分页数据
    }
  },

  methods: {
    init: function init() {
      this.getConsultationInfo();
    },
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    /** 获取健康知识 */
    getRecommendListFn: function getRecommendListFn() {
      var _this = this;
      _this.loading++;
      _this.params.recommendParam.refCustomerIdSetIn = _this.doctorId;
      _this.params.recommendParam.firstResult = _this.pageNum * _this.params.recommendParam.maxResult;
      Object(__WEBPACK_IMPORTED_MODULE_9__common_js_HttpRequest_getEducationList__["a" /* default */])(_this.params.recommendParam).then(function (res) {
        _this.loading--;
        _this.isLoadMore = true;
        _this.pageNum++; //分页计数加一
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this.recommendLists = res.responseObject.responseData.dataList;
          if (_this.recommendLists && _this.recommendLists.length > 0) {
            _this.recommendLists.forEach(function (element) {
              _this.recommendListsLess.push(element);
            });
          }
        } else {
          //无更多数据
          _this.noMoreData = true;
        }
      }).catch(function (err) {
        console.log(err);
        _this.loading--;
        _this.isLoadMore = true;
      });
    },

    // 获取评价信息
    getConsultationInfo: function getConsultationInfo() {
      var _this = this;
      _this.loading++;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getConsultation,
        method: "POST",
        data: {
          consultationId: this.consultationId
        },
        done: function done(res) {
          _this.loading--;
          if (res && res.responseObject.responseData) {
            _this.commentInfo = res.responseObject.responseData;
            _this.doctorId = _this.commentInfo.doctorId; //   1462341980375  _this.commentInfo.doctorId
            _this.getRecommendListFn();
            wx.setNavigationBarTitle({
              title: _this.commentInfo.doctorName + '医生评价'
            });
          }
        }
      }, "loading");
    },
    trackShareCallback: function trackShareCallback(obj) {
      var doctorId = this.commentInfo.doctorId;
      __WEBPACK_IMPORTED_MODULE_5_common_js_dataLog_dataLog__["a" /* default */].createTrack({ // 点击分享
        actionId: 14221,
        browseType: 144,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ doctorId: doctorId })
      });
    },
    goDoctorHome: function goDoctorHome() {
      var _this = this;
      var doctorId = this.commentInfo.doctorId;
      __WEBPACK_IMPORTED_MODULE_5_common_js_dataLog_dataLog__["a" /* default */].createTrack({ // 点击“去医生主页看看”
        actionId: 14222,
        browseType: 144,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ doctorId: doctorId })
      });
      wx.navigateTo({
        url: "/pages/doctorMain/doctorMain?doctorCustomerId=" + doctorId + "&from=doctorEvaluate"
      });
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    });
    // dataLog.createTrack({
    //   actionId: 14206
    // });
    var path = "";
    if (this.doctorId) {
      path = "/pages/mIndex/mIndex?from=shareFriend&consultationId=" + this.consultationId + "&path=/packageD/reportNew/doctorEvaluateEnd";
    }
    return {
      title: this.commentInfo.doctorName + "评价",
      path: path
    };
  }
});

/***/ }),

/***/ 857:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "stars-title"
  }, [_c('span', [_c('img', {
    attrs: {
      "src": "//m.allinmed.cn/static/image/mp/index/1.2.0/name_select.png",
      "alt": ""
    }
  }), _vm._v("您已完成评价\n    ")])]), _vm._v(" "), _c('div', {
    staticClass: "stars-con"
  }, [_c('section', {
    staticClass: "patient-comment-stars"
  }, [_c('figure', {
    staticClass: "patient-comment-stars-item",
    class: {
      'active': _vm.commentInfo.serviceStar >= 1
    }
  }), _vm._v(" "), _c('figure', {
    staticClass: "patient-comment-stars-item",
    class: {
      'active': _vm.commentInfo.serviceStar >= 2
    }
  }), _vm._v(" "), _c('figure', {
    staticClass: "patient-comment-stars-item",
    class: {
      'active': _vm.commentInfo.serviceStar >= 3
    }
  }), _vm._v(" "), _c('figure', {
    staticClass: "patient-comment-stars-item",
    class: {
      'active': _vm.commentInfo.serviceStar >= 4
    }
  }), _vm._v(" "), _c('figure', {
    staticClass: "patient-comment-stars-item",
    class: {
      'active': _vm.commentInfo.serviceStar >= 5
    }
  })], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "patient-comment-tag-list"
  }, _vm._l((_vm.commentInfo.tagList), function(item, index) {
    return _c('article', {
      key: index,
      staticClass: "patient-comment-tag-item active"
    }, [_vm._v("\n      " + _vm._s(item.tagName) + "\n    ")])
  })), _vm._v(" "), (_vm.commentInfo.thoughts && _vm.commentInfo.thoughts.length > 0) ? _c('section', {
    staticClass: "comment-text"
  }, [_vm._v("\n    " + _vm._s(_vm.commentInfo.thoughts) + "\n  ")]) : _vm._e(), _vm._v(" "), (_vm.recommendLists && _vm.recommendLists.length > 0) ? _c('section', {
    staticClass: "doc-listComm doc-healthContent"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("\n      查看" + _vm._s(_vm.commentInfo.doctorName) + "医生的专家文章，了解相关疾病\n    ")]), _vm._v(" "), _c('healthItem', {
    attrs: {
      "from": "doctorMain",
      "healthLists": _vm.recommendListsLess,
      "mpcomid": '0'
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "share-box"
  }, [_c('div', {
    staticClass: "share"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "shareBtn",
    attrs: {
      "open-type": "share",
      "formType": "submit",
      "eventid": '0'
    },
    on: {
      "click": _vm.trackShareCallback
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/wechat.png",
      "alt": ""
    }
  }), _vm._v("\n          分享\n        ")])], 1)], 1), _vm._v(" "), _c('button', {
    staticClass: "go-doctor-home",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.goDoctorHome
    }
  }, [_vm._v("\n      去" + _vm._s(_vm.shareDoctorName) + "医生主页看看\n    ")])], 1), _vm._v(" "), (_vm.loading) ? _c('logo-loading', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '2'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-43d0184f", esExports)
  }
}

/***/ })

},[1263]);