global.webpackJsonp([4],{

/***/ 566:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthKnowledge_vue__ = __webpack_require__(568);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_615ab0cc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthKnowledge_vue__ = __webpack_require__(586);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(567)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthKnowledge_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_615ab0cc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthKnowledge_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/healthKnowledge/healthKnowledge.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthKnowledge.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-615ab0cc", Component.options)
  } else {
    hotAPI.reload("data-v-615ab0cc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 567:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 568:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_healthKnowComponents_healthItemList__ = __webpack_require__(569);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getEducationList__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getDoctorFilterList__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__healthSearch__ = __webpack_require__(573);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_vuex__ = __webpack_require__(4);




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








var XHRList = {
  getBannerList: __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/ad/position/profile/getMapList/"
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      headFixed: false,
      bannerList: [],
      bannerShow: true,
      fromDocHomeShow: true,
      fourTypesIndex: -1,
      mainListParam: {
        educationContentType: "",
        firstResult: 0,
        maxResult: 20,
        isValid: 1,
        status: 1,
        sortType: 9
      },
      mainList: [],
      doctorRecommendParams: {
        firstResult: 0,
        maxResult: 3,
        logoUseFlag: 3,
        indexType: "customer",
        solrContent: "", //搜索关键字
        searchSortType: 1, //综合排序 1综合2从低到高
        areasExpertise: "", //专业
        searchRegion: "", //地区
        searchHospitalLevel: "", //医院级别
        searchTitleLevel: "" //职称级别
      },
      doctorList: [],
      educationTypeListParam: {
        groupType: 2,
        sortType: 6,
        firstResult: 0,
        maxResult: 999,
        isValid: 1,
        status: 1
      },
      educationTypeList: [],
      finish: false,
      noMore: false
    };
  },
  onLoad: function onLoad() {
    var query = this.$root.$mp.query;
    if (query.doctorCustomerId && query.doctorCustomerId.length > 0) {
      this.fromDocHomeShow = false;
      this.mainListParam = {
        educationContentType: "",
        firstResult: 0,
        maxResult: 20,
        refCustomerIdSetIn: query.doctorCustomerId,
        educationContentTypeNotIn: "5",
        isValid: 1,
        status: 1,
        sortType: 8
      };
    }
    wx.setNavigationBarTitle({
      title: '\u4E13\u5BB6\u6587\u7AE0'
    });
  },
  onShow: function onShow() {
    this.finish = true;
    this.noMore = false;
    this.mainListParam.firstResult = 0;
    this.scrollTop();
    this.getBannerList();
    this.getEducationType();
  },

  methods: __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_10_vuex__["e" /* mapMutations */])(["setSearchFlag"]), {
    getBannerList: function getBannerList() {
      var that = this;
      __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getBannerList,
        method: "POST",
        data: {
          siteId: __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].getSiteId(),
          channelId: 170,
          platformId: 1,
          positionId: __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].httpEnv().includes("m.allinmed") ? 641 : 3324
        },
        done: function done(data) {
          if (data && data.responseObject.responseStatus && data.responseObject.responseData) {
            that.bannerList = data.responseObject.responseData.data_list[0].ad_profile_attachment;
          }
        }
      });
    },
    getEducationType: function getEducationType() {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a.all([Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getEducationList__["a" /* default */])(this.educationTypeListParam), Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getEducationList__["a" /* default */])(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(this.mainListParam, { educationContentType: "" }))]).then(function (list) {
        var res1 = list[0],
            res2 = list[1];

        _this.finish = false;
        if (res1 && res1.responseObject.responseData && res1.responseObject.responseData.dataList) {
          _this.educationTypeList = res1.responseObject.responseData.dataList;

          _this.educationTypeList.forEach(function (element, index) {
            element.titleName = _this.typeChangeTitle(element).titleName;
            element.titleIcon = _this.typeChangeTitle(element).titleIcon;
          });
        }

        if (res2 && res2.responseObject.responseData && res2.responseObject.responseData.dataList) {
          _this.mainList = res2.responseObject.responseData.dataList;
          if (__WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].getPara().doctorCustomerId && __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].getPara().doctorCustomerId.length > 0) {
            wx.setNavigationBarTitle({
              title: _this.mainList[0].fullName + "医生患教"
            });
          }
        } else {
          _this.mainList = [];
        }
      });
    },
    typeChangeTitle: function typeChangeTitle(obj) {
      var titleName = void 0,
          titleIcon = void 0;
      switch (parseInt(obj.educationContentType)) {
        case 0:
          titleName = "读文章";
          titleIcon = "icon-read";
          break;
        case 1:
          titleName = "看视频";
          titleIcon = "icon-look";
          break;
        case 2:
          titleName = "听语音";
          titleIcon = "icon-hear";
          break;
      }
      return {
        titleName: titleName,
        titleIcon: titleIcon
      };
    },
    getMainList: function getMainList(obj) {
      var _this2 = this;

      this.noMore = false;
      this.mainListParam.firstResult = 0;
      this.mainListParam.educationContentType = obj.educationContentType;
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getEducationList__["a" /* default */])(this.mainListParam).then(function (res) {
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this2.mainList = res.responseObject.responseData.dataList;
        } else {
          _this2.mainList = [];
        }
      });
    },
    getDoctorList: function getDoctorList() {
      var _this3 = this;

      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getDoctorFilterList__["a" /* default */])(this.doctorRecommendParams).then(function (res) {
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this3.doctorList = res.responseObject.responseData.dataList;
        }
      });
    },
    scrollTop: function scrollTop(e) {
      if (!e) return;
      var topDistance = e.mp.detail.scrollTop;
      if (topDistance > 100) {
        this.bannerShow = false;
        this.headFixed = true;
      } else {
        this.bannerShow = true;
        this.headFixed = false;
      }
    },
    toSearch: function toSearch() {
      this.setSearchFlag(true);
    },
    scrolltoMore: function scrolltoMore() {
      var _this4 = this;

      // console.log("1111111111111111");
      if (!this.noMore) {
        this.finish = true;
        this.mainListParam.firstResult += 20;
        Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getEducationList__["a" /* default */])(this.mainListParam).then(function (res) {
          _this4.finish = false;
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            _this4.mainList = [].concat(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(_this4.mainList), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_toConsumableArray___default()(res.responseObject.responseData.dataList));
            _this4.noMore = false;
          } else {
            _this4.noMore = true;
          }
        });
      }
    }
  }),
  components: {
    healthItem: __WEBPACK_IMPORTED_MODULE_5_components_healthKnowComponents_healthItemList__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_8_components_loading__["a" /* default */],
    healthSearch: __WEBPACK_IMPORTED_MODULE_9__healthSearch__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_3_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_10_vuex__["f" /* mapState */])(["searchFlag"]))
});

/***/ }),

/***/ 569:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthItemList_vue__ = __webpack_require__(571);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7ff97666_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthItemList_vue__ = __webpack_require__(572);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(570)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthItemList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7ff97666_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthItemList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/healthKnowComponents/healthItemList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthItemList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ff97666", Component.options)
  } else {
    hotAPI.reload("data-v-7ff97666", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 570:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 571:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
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



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      swiperDoctorOption: {
        notNextTick: true,
        setWrapperSize: true,
        mousewheelControl: true,
        observeParents: true,
        slidesPerView: "auto",
        freeMode: true
      },
      newDate: [],
      innerAudioContext: null
    };
  },

  methods: {
    audioPlayStop: function audioPlayStop(item) {
      // console.log(this.innerAudioContext)
      if (this.innerAudioContext) {
        // console.log(this.innerAudioContext.paused)
        if (this.innerAudioContext.paused) {
          this.innerAudioContext.play();
          item.playState = 1;
          this.$forceUpdate();
        } else {
          // console.log("+++++++++++++++")
          this.innerAudioContext.stop();
          // console.log("---------")
          item.playState = 0;
          this.$forceUpdate();
        }
      } else {
        this.innerAudioContext = wx.createInnerAudioContext();
        this.innerAudioContext.src = item.attUrl;
        this.innerAudioContext.play();
        item.playState = 1;
        this.$forceUpdate();
      }
    },
    getTypeName: function getTypeName(obj) {
      switch (parseInt(obj.educationContentType)) {
        case 0:
        case 3:
          return "文章";
          break;
        case 1:
          return "视频";
          break;
        case 2:
          return "语音";
          break;
        case 4:
          return "综合";
          break;
      }
    },
    goToInfo: function goToInfo(obj, index) {
      this.$emit("clickCallback", {
        item: obj,
        index: index
      });
      __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].ajax({
        url: __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/cms/patienteducation/v1/update/",
        method: "POST",
        data: {
          educationId: obj.educationId,
          isBrowse: 1
        },
        done: function done(res) {}
      });
      var url = "";
      if (this.from == "doctorMain") {
        url = obj.webStoragePath + "?refCustomerId=" + obj.refCustomerId + "&educationId=" + obj.educationId + "&from=doctorMain";
      } else {
        url = obj.webStoragePath + "?refCustomerId=" + obj.refCustomerId + "&educationId=" + obj.educationId;
      }
      wx.navigateTo({
        url: "/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=" + encodeURIComponent(url)
      });
    }
  },
  mounted: function mounted() {
    var _this = this;

    this.healthLists.forEach(function (element, index) {
      //        if(element.educationContentType == 2){
      //          element.playState = 0;
      //        }
      element.typeName = _this.getTypeName(element);
    });
  },

  props: {
    healthLists: {
      type: Array,
      required: true
    },
    doctorLists: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    from: {
      type: String,
      default: "home"
    }
  },
  watch: {
    //      healthLists(newVal,oldVal){
    //        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    //        this.newDate = newVal;
    //        this.newDate.forEach((element) => {
    //          if(element.educationContentType == 2){
    //            element.playState = 0;
    //          }
    //          element.typeName = this.getTypeName(element);
    //        });
    //      }
  }
});

/***/ }),

/***/ 572:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "articleLists"
  }, _vm._l((_vm.healthLists), function(item, index) {
    return _c('figure', {
      key: index,
      staticClass: "articleItem",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.goToInfo(item, index)
        }
      }
    }, [_c('article', {
      staticClass: "noShowImg"
    }, [_c('span', {
      staticClass: "articalIcon"
    }), _vm._v(" "), _c('h3', {
      staticClass: "articleTitle isArtical"
    }, [_vm._v(_vm._s(item.educationName))])], 1), _vm._v(" "), (index == 2 && _vm.from == 'home' && _vm.doctorLists.length > 0) ? _c('section', {
      staticClass: "recommendDoctor"
    }, [_c('div', {
      staticClass: "doctorBorder"
    }), _vm._v(" "), _c('h3', [_vm._v("医生推荐")]), _vm._v(" "), _c('swiper', {
      ref: "mySwiper",
      refInFor: true,
      attrs: {
        "options": _vm.swiperDoctorOption
      }
    }, _vm._l((_vm.doctorLists), function(item, index1) {
      return _c('swiper-slide', {
        key: item.customerId,
        attrs: {
          "mpcomid": '0-' + index + '-' + index1
        }
      }, [_c('figure', {
        staticClass: "doctorInfo"
      }, [_c('figcaption', [_c('img', {
        attrs: {
          "src": item.logoUrl,
          "alt": ""
        }
      })]), _vm._v(" "), _c('span', {
        staticClass: "doctorName"
      }, [_vm._v(_vm._s(item.fullName.length > 4 ? item.fullName.substring(0, 4) + '...' : item.fullName))]), _vm._v(" "), _c('span', {
        staticClass: "doctorTitle"
      }, [_vm._v(_vm._s(item.medicalTitle))]), _vm._v(" "), _c('span', {
        staticClass: "doctorAddress"
      }, [_vm._v(_vm._s(item.hospitalName.length > 6 ? item.hospitalName.substring(0, 6) + '...' : item.hospitalName))])], 1)], 1)
    }))], 1) : _vm._e()], 1)
  }))
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7ff97666", esExports)
  }
}

/***/ }),

/***/ 573:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthSearch_vue__ = __webpack_require__(575);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_9b9f5188_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthSearch_vue__ = __webpack_require__(585);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(574)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthSearch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_9b9f5188_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthSearch_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/healthKnowledge/healthSearch.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthSearch.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-9b9f5188", Component.options)
  } else {
    hotAPI.reload("data-v-9b9f5188", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 574:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 575:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_healthKnowComponents_search__ = __webpack_require__(576);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_healthKnowComponents_healthItem__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_getEducationList__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_getEducationSearchList__ = __webpack_require__(584);
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







/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      historyShow: true,
      tabIndex: -1,
      noResult: false,
      educationTypeListParam: {
        groupType: 2,
        sortType: 6,
        firstResult: 0,
        maxResult: 999,
        isValid: 1,
        status: 1
      },
      educationTypeList: [],
      searchParam: {
        searchParam: "",
        searchEducationContentType: "",
        firstResult: 0,
        maxResult: 20,
        isSolr: 1
      },
      searchResultList: [],
      recommendParam: {
        firstResult: 0,
        maxResult: 5,
        isValid: 1,
        status: 1,
        sortType: 8
      },
      recommendList: [],
      finish: false,
      noMore: false
    };
  },
  mounted: function mounted() {
    this.getEducationType();
  },

  methods: {
    getEducationType: function getEducationType() {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_getEducationList__["a" /* default */])(this.educationTypeListParam).then(function (res) {
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this.educationTypeList = res.responseObject.responseData.dataList;
          _this.educationTypeList.forEach(function (e, i) {
            e.typeName = _this.getTypeName(e);
          });
        }
      });
    },
    getTypeName: function getTypeName(obj) {
      switch (parseInt(obj.educationContentType)) {
        case 0:
          return "文章";
          break;
        case 1:
          return "视频";
          break;
        case 2:
          return "语音";
          break;
        //          case 3:
        //            return "图片";
        //            break;
        //          case 4:
        //            return "综合";
        //            break;
      }
    },
    searchResult: function searchResult(kw) {
      var _this2 = this;

      this.finish = true;
      this.noMore = false;
      this.searchParam.searchParam = kw;
      this.searchParam.firstResult = 0;
      this.searchParam.searchEducationContentType = "";
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_getEducationSearchList__["a" /* default */])(this.searchParam).then(function (res) {
        _this2.finish = false;
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this2.noResult = false;
          _this2.searchResultList = res.responseObject.responseData.dataList;
        } else {
          _this2.noResult = true;
          _this2.recommendResult();
        }
      });
    },
    filterResult: function filterResult(obj) {
      var _this3 = this;

      this.finish = true;
      this.noMore = false;
      this.searchParam.firstResult = 0;
      this.searchParam.searchEducationContentType = obj.educationContentType;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_getEducationSearchList__["a" /* default */])(this.searchParam).then(function (res) {
        _this3.finish = false;
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this3.noResult = false;
          _this3.searchResultList = res.responseObject.responseData.dataList;
        } else {
          _this3.noResult = true;
          _this3.recommendResult();
        }
      });
    },
    recommendResult: function recommendResult() {
      var _this4 = this;

      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_getEducationList__["a" /* default */])(this.recommendParam).then(function (res) {
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this4.recommendList = res.responseObject.responseData.dataList;
        }
      });
    }
  },
  components: {
    searchInput: __WEBPACK_IMPORTED_MODULE_2_components_healthKnowComponents_search__["a" /* default */],
    healthItem: __WEBPACK_IMPORTED_MODULE_3_components_healthKnowComponents_healthItem__["a" /* default */],
    loading: __WEBPACK_IMPORTED_MODULE_1_components_loading__["a" /* default */]
  }
});

/***/ }),

/***/ 576:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_search_vue__ = __webpack_require__(578);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_335e427e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_search_vue__ = __webpack_require__(583);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(577)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-335e427e"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_search_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_335e427e_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_search_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/healthKnowComponents/search.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] search.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-335e427e", Component.options)
  } else {
    hotAPI.reload("data-v-335e427e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 577:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 578:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_healthKnowComponents_searchHistory__ = __webpack_require__(579);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createHistoryRecord__ = __webpack_require__(48);
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
      searchVal: ''
    };
  },

  methods: {
    backToPast: function backToPast() {
      this.$store.commit("setSearchFlag", false);
    },
    searchKetWordCallBack: function searchKetWordCallBack(kw) {
      this.$emit('update:historyShow', false);
      if (kw && kw.length > 0) {
        this.searchVal = kw;
        this.$emit('searchKetWordCallBack', kw);
      } else {
        if (this.searchVal.length > 0) {
          Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createHistoryRecord__["a" /* default */])({
            searchType: "2",
            keyWord: this.searchVal,
            siteId: __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getSiteId()
          }).then(function (res) {
            if (res && res.responseObject.responseStatus) {
              console.log("创建历史记录成功");
            }
          });
        }
        this.$emit('searchKetWordCallBack', this.searchVal);
      }
    }
  },
  components: {
    searchHistory: __WEBPACK_IMPORTED_MODULE_1_components_healthKnowComponents_searchHistory__["a" /* default */]
  },
  props: {
    historyShow: {
      type: Boolean,
      required: true
    }
  }
});

/***/ }),

/***/ 579:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_searchHistory_vue__ = __webpack_require__(581);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_53a058c3_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_searchHistory_vue__ = __webpack_require__(582);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(580)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-53a058c3"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_searchHistory_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_53a058c3_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_searchHistory_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/healthKnowComponents/searchHistory.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] searchHistory.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-53a058c3", Component.options)
  } else {
    hotAPI.reload("data-v-53a058c3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 580:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 581:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getHistoryRecord__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_deleteHistoryRecord__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_createHistoryRecord__ = __webpack_require__(48);
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
      historyInfo: [],
      confirmShow: false
    };
  },
  mounted: function mounted() {
    this.getHistoryRecord();
  },

  methods: {
    getHistoryRecord: function getHistoryRecord() {
      var _this = this;

      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getHistoryRecord__["a" /* default */])({
        searchType: "2"
      }).then(function (res) {
        if (res && res.responseObject.responseData && res.responseObject.responseData.data_list) {
          _this.historyInfo = res.responseObject.responseData.data_list;
        }
      });
    },
    deleteHistoryRecord: function deleteHistoryRecord() {
      var _this2 = this;

      this.confirmShow = false;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_deleteHistoryRecord__["a" /* default */])().then(function (res) {
        if (res && res.responseObject.responseStatus) {
          _this2.historyInfo = [];
        }
      });
    },
    historyClickCallBack: function historyClickCallBack(obj) {
      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_createHistoryRecord__["a" /* default */])({
        searchType: "2",
        keyWord: obj.keyWord,
        siteId: __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (res) {
        if (res && res.responseObject.responseStatus) {
          console.log("创建历史记录成功");
        }
      });
      this.$emit("historyClickCallBack", obj.keyWord);
    }
  },
  components: {
    confirm: __WEBPACK_IMPORTED_MODULE_1_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 582:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.historyInfo.length > 0) ? _c('figure', {
    staticClass: "sd_searchHistory"
  }, [_c('figcaption', [_vm._v("历史记录"), _c('i', {
    staticClass: "sd_deleteBtnIcon",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.confirmShow = true
      }
    }
  })], 1), _vm._v(" "), _c('ul', {
    staticClass: "sd_searchHistoryList"
  }, _vm._l((_vm.historyInfo), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "sd_searchHistoryItem",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.historyClickCallBack(item)
        }
      }
    }, [_vm._v(_vm._s(item.keyWord.length > 20 ? item.keyWord.substring(0, 20) + '...' : item.keyWord))])
  })), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '确认',
        'cancel': '取消',
        'content': '确认删除全部历史记录么?'
      },
      "eventid": '2',
      "mpcomid": '0'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.confirmShow = false
      },
      "ensureClickEvent": function($event) {
        _vm.deleteHistoryRecord()
      }
    }
  }) : _vm._e()], 1) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-53a058c3", esExports)
  }
}

/***/ }),

/***/ 583:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "sd_searchHeaderBox"
  }, [_c('span', {
    staticClass: "sd_searchBack",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.backToPast
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "sd_searchGroup"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.searchVal),
      expression: "searchVal",
      modifiers: {
        "trim": true
      }
    }],
    staticClass: "sd_searchInput",
    attrs: {
      "type": "text",
      "placeholder": "请输入关键词",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.searchVal)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.searchVal = $event.target.value.trim()
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "sd_searchClear",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.searchVal = ''
      }
    }
  }, [_c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.searchVal.length > 0),
      expression: "searchVal.length>0"
    }],
    staticClass: "sd_delete_icon",
    attrs: {
      "src": "https://m.allinmed.cn/dist/static/image/img00/DrList/delete_01.png"
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "sd_searchBtn",
    attrs: {
      "sps-data": 'keyword:' + _vm.searchVal,
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.searchKetWordCallBack()
      }
    }
  }, [_vm._v("搜索")])])]), _vm._v(" "), (_vm.historyShow) ? _c('searchHistory', {
    attrs: {
      "eventid": '4',
      "mpcomid": '0'
    },
    on: {
      "historyClickCallBack": _vm.searchKetWordCallBack
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-335e427e", esExports)
  }
}

/***/ }),

/***/ 584:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getEducationList;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Wangjingrong on 2018/4/23.
 */



var XHRList = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/cms/patienteducation/v1/getMapSearchList/";

function getEducationList(param) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__["a" /* default */])({
      url: XHRList,
      method: "POST",
      data: param,
      done: function done(data) {
        resolve(data);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

/***/ }),

/***/ 585:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "healthSearchBox",
    class: {
      bgf: _vm.historyShow
    }
  }, [_c('searchInput', {
    attrs: {
      "historyShow": _vm.historyShow,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "update:historyShow": function($event) {
        _vm.historyShow = $event
      },
      "searchKetWordCallBack": _vm.searchResult
    }
  }), _vm._v(" "), (!_vm.historyShow) ? _c('section', {
    staticClass: "healthSearchFilter"
  }, [_c('ul', {
    staticClass: "healthFilterType"
  }, [_c('li', {
    staticClass: "healthFilterItem",
    class: {
      on: _vm.tabIndex == -1
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.tabIndex = -1;
        _vm.filterResult({
          educationContentType: ''
        })
      }
    }
  }, [_vm._v("全部")]), _vm._v(" "), _vm._l((_vm.educationTypeList), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "healthFilterItem",
      class: {
        on: _vm.tabIndex == index
      },
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          _vm.tabIndex = index;
          _vm.filterResult(item)
        }
      }
    }, [_vm._v(_vm._s(item.typeName))])
  })], 2), _vm._v(" "), _c('section', {
    staticClass: "healthSearchResult"
  }, [(!_vm.noResult) ? _c('healthItem', {
    attrs: {
      "healthLists": _vm.searchResultList,
      "from": "search",
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.noResult) ? _c('figure', {
    staticClass: "healthSearchNoResult"
  }, [_c('span', [_vm._v("抱歉，暂未找到符合条件的结果")])]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.noResult) ? _c('section', {
    staticClass: "searchRecommendMoudle"
  }, [_c('h2', [_vm._v("相关推荐")]), _vm._v(" "), _c('healthItem', {
    attrs: {
      "healthLists": _vm.recommendList,
      "from": "recommend",
      "mpcomid": '2'
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.noMore) ? _c('footer', {
    staticClass: "noMore"
  }, [_vm._v("~没有更多了~")]) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('loading', {
    attrs: {
      "mpcomid": '3'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-9b9f5188", esExports)
  }
}

/***/ }),

/***/ 586:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "healthMain",
    class: {
      fromDoc: !_vm.fromDocHomeShow
    }
  }, [(_vm.searchFlag) ? _c('healthSearch', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.searchFlag) ? _c('article', {
    staticStyle: {
      "height": "100%"
    }
  }, [(false) ? _c('header', {
    staticClass: "headContent",
    class: {
      fixed: _vm.headFixed
    }
  }, [(_vm.fromDocHomeShow) ? _c('section', {
    staticClass: "searchBox",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.toSearch
    }
  }, [_vm._v("请输入关键词")]) : _vm._e(), _vm._v(" "), (_vm.fromDocHomeShow && _vm.bannerList.length > 0) ? _c('section', {
    staticClass: "healthBanner",
    class: {
      'hide': !_vm.bannerShow
    }
  }, [_c('swiper', {
    attrs: {
      "autoplay": "true",
      "interval": "3000",
      "duration": "300"
    }
  }, _vm._l((_vm.bannerList), function(item, index) {
    return _c('block', {
      key: index
    }, [_c('swiper-item', {
      staticClass: "banner-slider",
      attrs: {
        "mpcomid": '1-' + index
      }
    }, [_c('a', [_c('img', {
      staticClass: "slide-image",
      attrs: {
        "src": item.adAttUrl
      }
    })])])], 1)
  }))], 1) : _vm._e(), _vm._v(" "), _c('ul', {
    staticClass: "fourTypes"
  }, [_c('li', {
    class: {
      'on': _vm.fourTypesIndex == -1
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.fourTypesIndex = -1;
        _vm.getMainList({
          educationContentType: ''
        })
      }
    }
  }, [_c('i', {
    staticClass: "icon-all"
  }), _vm._v(" "), _c('span', [_vm._v("全部")])], 1), _vm._v(" "), _vm._l((_vm.educationTypeList), function(item, index) {
    return _c('li', {
      key: index,
      class: {
        'on': _vm.fourTypesIndex == index
      },
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          _vm.fourTypesIndex = index;
          _vm.getMainList(item)
        }
      }
    }, [_c('i', {
      class: item.titleIcon
    }), _vm._v(" "), _c('span', [_vm._v(_vm._s(item.titleName))])], 1)
  })], 2)], 1) : _vm._e(), _vm._v(" "), _c('scroll-view', {
    staticStyle: {
      "height": "100%"
    },
    attrs: {
      "scroll-y": "",
      "eventid": '3'
    },
    on: {
      "scroll": _vm.scrollTop,
      "scrolltolower": _vm.scrolltoMore
    }
  }, [_c('section', {
    staticClass: "mainContent",
    class: {
      cancleTop: !_vm.fromDocHomeShow
    }
  }, [_c('healthItem', {
    attrs: {
      "doctorLists": _vm.doctorList,
      "healthLists": _vm.mainList,
      "from": "home",
      "mpcomid": '2'
    }
  })], 1), _vm._v(" "), (_vm.noMore) ? _c('footer', {
    staticClass: "noMore"
  }, [_vm._v("~没有更多了~")]) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '3'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-615ab0cc", esExports)
  }
}

/***/ })

},[1234]);