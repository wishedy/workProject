global.webpackJsonp([2],{

/***/ 1093:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalDetail_vue__ = __webpack_require__(1095);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1043eb72_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalDetail_vue__ = __webpack_require__(1164);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1094)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1043eb72_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/journalDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] journalDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1043eb72", Component.options)
  } else {
    hotAPI.reload("data-v-1043eb72", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1094:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1095:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_recommend__ = __webpack_require__(1096);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_shareBox__ = __webpack_require__(1100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_gcList__ = __webpack_require__(1104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_bottomBar__ = __webpack_require__(1112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_commentWindow__ = __webpack_require__(1116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_journalInfo__ = __webpack_require__(1128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_drawShareImage__ = __webpack_require__(1149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_commentLoading__ = __webpack_require__(1160);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_components_BlackList__ = __webpack_require__(31);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12
 */


















var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_14_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      finish: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      model: ""
    };
  },

  // onPageScroll(){
  //   this.setCommentWindowShow(false);
  // },
  onPullDownRefresh: function onPullDownRefresh() {
    this.getAllCommentItem();
  },
  onShow: function onShow(options) {
    __WEBPACK_IMPORTED_MODULE_13_localStorage__["a" /* default */].setItem('diaryId', this.$root.$mp.query.rId);
    var query = this.$root.$mp.query;
    console.log(query);
    if (query.scene) {
      __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].enterBrowse({
        browseUrl: encodeURIComponent("packageF/journalDetail/journalDetail?scene=" + query.scene + "&from=qrCode")
      });
    } else {
      __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].enterBrowse();
    }

    if (__WEBPACK_IMPORTED_MODULE_13_localStorage__["a" /* default */].getItem("bindFinish")) {
      this.setCommentWindowShow(true);
      __WEBPACK_IMPORTED_MODULE_13_localStorage__["a" /* default */].removeItem("bindFinish");
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad(options) {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_16_common_js_util_util__["a" /* default */].getUserInfo().then(function (res) {
      _this.setAuthStatus(true);
      _this.initCheckLogin();
    }).catch(function (err) {
      _this.setAuthStatus(false);
    });
    this.getShareTitle();
  },
  onUnload: function onUnload() {
    this.setCommentList([]); //全部评论
    this.setAuthorCommentList([]); //作者评论
    this.setCommentNum({
      all: 0,
      author: 0
    });
    this.setShareMessage({
      num: 0
    });
    this.setCommentWindowShow(false);
    this.setShareShow(false);
    this.setAllTypePageFinish(false);
    this.setAuthorTypePageFinish(false);
    this.setLoadingStatus(false);
    this.setCanvasShow(false);
    this.setJournalMessage({
      authorName: "",
      authorLogoUrl: "",
      diaryName: "",
      fullName: "",
      customerLogo: "",
      medicalTitle: "",
      company: "",
      qrCode: ""
    });
    console.log(this.loading);
  },
  onShareAppMessage: function onShareAppMessage(res) {
    var _this2 = this;

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    var page = getCurrentPages();
    var route = page[page.length - 1].options;
    var result = [];
    for (var i in route) {
      if (i != "from") {
        result.push(i + "=" + route[i]);
      }
    }
    var _path = "/pages/mIndex/mIndex?from=shareFriend&" + result.join("&") + "&path=" + this.shareMessage.url;
    return {
      title: "唯医骨科康复日记",
      path: _path,
      success: function success(res) {

        _this2.updateBrowseAndShareNum({
          shareNum: 1
        });
      }
    };
  },
  onReachBottom: function onReachBottom() {
    console.log("pull");

    if (this.loading) return;
    if (this.listType === "all" && !this.allTypeFinish) {
      this.getCommentList({
        type: "getAll",
        pull: true
      });
    } else if (this.listType === "author" && !this.authorTypeFinish) {
      console.log(this.listType);
      this.getCommentList({
        type: "getAuthor",
        pull: true
      });
    }
  },
  mounted: function mounted() {
    var query = this.$root.$mp.query;
    this.getSystomInfo();
    this.setBaseMessage({
      resourceId: query.rId || query.scene || ""
      // authorCustomerId: query.aId
    });

    this.setListType('all');
    this.updateBrowseAndShareNum({
      browseNum: 1
    });
    this.model = this.systemInfo.model.toLowerCase().replace(" ", "");
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['toastTips', 'toastShow', 'authorCustomerId', 'showCommentWindow', 'commentLoadingParam', 'ensureShow', 'loading', 'loadingType', 'deleteShowFlag', 'listType', 'allTypeFinish', 'authorTypeFinish', 'shareMessage', 'systemInfo', 'canvasShow'])),

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['getCommentList', 'getJournalRecommendList', 'showToast', 'checkLogin', 'deleteCommentItem', 'getDoctorMessage', 'updateBrowseAndShareNum', 'getSystomInfo', 'initCheckLogin']), mapMutations(['setLoadingStatus', 'setBaseMessage', 'setEnsureShow', 'setDeleteCommentItem', 'setShareMessage', 'setCommentList', 'setAuthorCommentList', 'setCommentNum', 'setListType', 'setAllTypePageFinish', 'setAuthorTypePageFinish', 'setShareShow', 'setShareMessage', 'setCommentWindowShow', 'setClickFlag', 'setAuthStatus', 'setJournalMessage', 'setCanvasShow']), {
    getImage: function getImage(e) {
      var detail = e.detail;

      console.log(e);
      wx.previewImage({
        current: e,
        urls: [e]
      });
    },
    goToSetting: function goToSetting(e) {
      var _this3 = this;

      if (e.mp.detail.errMsg === "openSetting:ok") {
        this.setLoadingStatus(true);
        this.setEnsureShow(false);
        this.checkLogin().then(function (flag) {
          // if (flag) {
          //   this.setCommentWindowShow(true);
          // }
          _this3.setLoadingStatus(false);
        }).catch(function (err) {
          console.log(err);
          _this3.setLoadingStatus(false);
        });
      } else {
        this.setEnsureShow(true);
      }
    },
    getShareTitle: function getShareTitle() {
      var page = getCurrentPages();

      var pageUrl = page[page.length - 1].route;
      var route = page[page.length - 1].options;
      var result = [];
      for (var i in route) {
        if (i != "from") {
          result.push(i + "=" + route[i]);
        }
      }
      this.setShareMessage({
        url: "/" + pageUrl + "?" + result.join("&") + "&from=share"
      });
    },
    getAllCommentItem: function getAllCommentItem() {
      this.getCommentList({
        type: "getAll",
        getter: true
      });
      this.getCommentList({
        type: "getAuthor",
        getter: true
      });
    },
    deleteCancel: function deleteCancel() {
      this.setDeleteCommentItem({
        'flag': false,
        'deleteItem': {}
      });
      this.setClickFlag(true);
    }
  }),
  watch: {
    authorCustomerId: function authorCustomerId(id) {
      this.getAllCommentItem();
    }
  },
  components: {
    Recommend: __WEBPACK_IMPORTED_MODULE_1__components_recommend__["a" /* default */],
    GcList: __WEBPACK_IMPORTED_MODULE_3__components_gcList__["a" /* default */],
    BottomBar: __WEBPACK_IMPORTED_MODULE_4__components_bottomBar__["a" /* default */],
    CommentWindow: __WEBPACK_IMPORTED_MODULE_5__components_commentWindow__["a" /* default */],
    CommentLoading: __WEBPACK_IMPORTED_MODULE_11__components_commentLoading__["a" /* default */],
    JournalInfo: __WEBPACK_IMPORTED_MODULE_6__components_journalInfo__["a" /* default */],
    Toast: __WEBPACK_IMPORTED_MODULE_8_components_toast__["a" /* default */],
    Confirm: __WEBPACK_IMPORTED_MODULE_9_components_confirm__["a" /* default */],
    EnsureConfirm: __WEBPACK_IMPORTED_MODULE_10_components_ensure__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_12_components_loading__["a" /* default */],
    DrawShareImage: __WEBPACK_IMPORTED_MODULE_7__components_drawShareImage__["a" /* default */],
    ShareBox: __WEBPACK_IMPORTED_MODULE_2__components_shareBox__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_17_components_BlackList__["a" /* default */]
  }
});

/***/ }),

/***/ 1096:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_recommend_vue__ = __webpack_require__(1098);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0fdda92e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_recommend_vue__ = __webpack_require__(1099);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1097)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_recommend_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0fdda92e_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_recommend_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/recommend.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] recommend.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0fdda92e", Component.options)
  } else {
    hotAPI.reload("data-v-0fdda92e", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1097:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1098:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12.
 */



var XHRList = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getRecommendList/";
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      reLists: [],
      clickStatus: true
    };
  },
  onLoad: function onLoad() {
    this.getRecommendList();
  },
  onUnload: function onUnload() {
    this.reLists = [];
    this.clickStatus = true;
  },

  methods: {
    getRecommendList: function getRecommendList() {
      var that = this;
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
        url: XHRList,
        method: "POST",
        data: {
          diaryIdNotIn: this.$root.$mp.query.rId || this.$root.$mp.query.scene,
          firstResult: "0",
          maxResult: "5",
          isValid: "1",
          visitSiteId: "24",
          sortType: "2"
        },
        done: function done(res) {
          console.log(res);
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            that.reLists = res.responseObject.responseData.dataList;
          } else {
            that.reLists = [];
          }
        }
      });
    },
    goOtherJournal: function goOtherJournal(obj, index) {
      var _this = this;

      this.clickStatus = false;
      setTimeout(function () {
        _this.clickStatus = true;
      }, 500);
      __WEBPACK_IMPORTED_MODULE_0_dataLog__["a" /* default */].createTrack({
        actionId: 14131,
        pushMessageId: obj.diaryId,
        keyword: obj.diaryName,
        locationId: parseInt(index) + 1
      });
      wx.redirectTo({
        url: "/packageF/journalDetail/journalDetail?aId=" + obj.authorId + "&rId=" + obj.diaryId
      });
    }
  }
});

/***/ }),

/***/ 1099:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.reLists.length > 0) ? _c('section', {
    staticClass: "recommend-container"
  }, [_c('header', {
    staticClass: "recommend-title"
  }, [_c('h2', [_vm._v("相关推荐")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "recommend-list"
  }, _vm._l((_vm.reLists), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "recommend-item",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.clickStatus && _vm.goOtherJournal(item, index)
        }
      }
    }, [_c('i', {
      staticClass: "icon-recommend"
    }), _vm._v(" "), _c('p', [_vm._v(_vm._s(item.diaryName))])], 1)
  }))], 1) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0fdda92e", esExports)
  }
}

/***/ }),

/***/ 1100:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_shareBox_vue__ = __webpack_require__(1102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0473d562_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_shareBox_vue__ = __webpack_require__(1103);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1101)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_shareBox_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0473d562_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_shareBox_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/shareBox.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] shareBox.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0473d562", Component.options)
  } else {
    hotAPI.reload("data-v-0473d562", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1101:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1102:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dataLog__ = __webpack_require__(7);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },

  props: {
    destory: {
      type: Number,
      default: 0
    }
  },

  onUnload: function onUnload() {
    this.commentContent = "";
    this.imageList = [];
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setShareShow', 'setCanvasShow']), {
    drawShareImage: function drawShareImage() {
      this.setCanvasShow(true);
      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].createTrack({
        actionId: 14200,
        opDesc: '康复日记详情页，点击生成图片'
      });
    },
    commentEvent: function commentEvent() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 100
      });
      __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].createTrack({
        actionId: '点击转发给好友的次数',
        opDesc: ''
      });
    },
    cancelSubmit: function cancelSubmit() {
      this.setShareShow(false);
    }
  }),
  mounted: function mounted() {},

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['showShareBox', 'cachePosition', 'canvasShow', 'systemInfo']), {
    system: function system() {
      // debugger
      // console.log(this.systemInfo)
      if (this.systemInfo.model && this.systemInfo.model.toLowerCase().includes("iphone x")) {
        return "iphoneX";
      } else {
        if (this.systemInfo.system) {
          if (this.systemInfo.system.toLowerCase().includes("android")) {
            return "android";
          } else {
            return "ios";
          }
        }
      }
    }
  })
});

/***/ }),

/***/ 1103:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "comment-window-container",
    class: {
      'show': _vm.showShareBox
    },
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.cancelSubmit
    }
  }, [_c('footer', {
    staticClass: "bottom-barr",
    class: {
      'isIphoneX': _vm.system == 'iphoneX'
    }
  }, [_c('section', {
    staticClass: "bottom-bar-item"
  }, [_c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "open-type": "share",
      "eventid": '0'
    },
    on: {
      "getuserinfo": _vm.commentEvent
    }
  }, [_c('i', {
    staticClass: "icon-shareBox"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/wechat_02.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("转发给好友")])], 1)], 1), _vm._v(" "), _c('span', {
    staticClass: "line"
  }), _vm._v(" "), _c('section', {
    staticClass: "bottom-bar-item"
  }, [_c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.drawShareImage
    }
  }, [_c('i', {
    staticClass: "icon-shareBox"
  }, [_c('img', {
    attrs: {
      "src": "/static/image/shareCircle.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("生成分享海报")])], 1)], 1)], 1), _vm._v(" "), _c('button', {
    staticClass: "cancelButton",
    class: {
      'isIphoneX': _vm.system == 'iphoneX'
    }
  }, [_vm._v("取消")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0473d562", esExports)
  }
}

/***/ }),

/***/ 1104:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_gcList_vue__ = __webpack_require__(1106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_74f5533d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_gcList_vue__ = __webpack_require__(1111);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1105)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_gcList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_74f5533d_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_gcList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/gcList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] gcList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74f5533d", Component.options)
  } else {
    hotAPI.reload("data-v-74f5533d", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1105:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1106:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__commentContent__ = __webpack_require__(1107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12.
 */





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      type: "all",
      updateFlag: false
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['getCommentList']), mapMutations(['setListType']), {
    changeCommentList: function changeCommentList(type) {
      var _type = this.listType;
      this.setListType(type);
      console.log(this.listType);
      if (_type !== type) {
        if (type === "all") {
          this.getCommentList({
            type: "getAll",
            getter: true
          });
          __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].createTrack({
            actionId: 14127
          });
        } else {
          this.getCommentList({
            type: "getAuthor",
            getter: true
          });
          __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].createTrack({
            actionId: 14128
          });
        }
      }
    }
  }),
  mounted: function mounted() {},


  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['commentList', 'authorCommentList', 'loading', 'listType', 'allTypePage', 'authorTypePage', 'authorTypeFinish', 'allTypeFinish', 'allTypeLoading', 'authorTypeLoading'])),

  components: {
    CommentContent: __WEBPACK_IMPORTED_MODULE_1__commentContent__["a" /* default */]
  }
});

/***/ }),

/***/ 1107:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentContent_vue__ = __webpack_require__(1109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_14b6b9bd_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentContent_vue__ = __webpack_require__(1110);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1108)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentContent_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_14b6b9bd_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentContent_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/commentContent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] commentContent.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-14b6b9bd", Component.options)
  } else {
    hotAPI.reload("data-v-14b6b9bd", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1108:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1109:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
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
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12.
 */



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_2_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      contentToggleShow: false,
      contentToggle: true,
      quoteToggleShow: false,
      quoteToggle: true
    };
  },

  props: {
    reviewItem: {
      type: Object,
      default: {}
    },
    refReviewItem: {
      type: Object,
      default: {}
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['customerId', 'authorCustomerId', 'clickFlag']), {
    formatContent: function formatContent() {
      if (!this.reviewItem || !this.reviewItem.reviewContent) return "";

      if (__WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getByteLen(this.reviewItem.reviewContent) > 130) {
        this.contentToggleShow = true;
        if (this.contentToggle) {
          return __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(this.reviewItem.reviewContent, 125) + "...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        } else {

          return this.reviewItem.reviewContent + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
      } else {
        this.contentToggleShow = false;
        return this.reviewItem.reviewContent;
      }
    },
    formatQuote: function formatQuote() {
      if (!this.refReviewItem || !this.refReviewItem.reviewContent) return "";
      if (__WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getByteLen("引用" + this.refReviewItem.nickName + "的" + this.refReviewItem.reviewContent + "评论") > 50) {
        this.quoteToggleShow = true;
        if (this.quoteToggle) {
          return '<span class="quote">\u5F15\u7528 ' + (this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0 ? this.refReviewItem.nickName : "") + this.isAuthor + '\u7684\u8BC4\u8BBA\uFF1A</span> ' + __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(this.refReviewItem.reviewContent, 35 - ('\u5F15\u7528' + this.refReviewItem.nickName + '\u7684\u8BC4\u8BBA').length) + '...&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        } else {
          return '<span class="quote">\u5F15\u7528 ' + (this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0 ? this.refReviewItem.nickName : "") + this.isAuthor + '\u7684\u8BC4\u8BBA\uFF1A</span> ' + this.refReviewItem.reviewContent + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        }
      } else {
        return '<span class="quote">\u5F15\u7528 ' + (this.refReviewItem.nickName && this.refReviewItem.nickName.length > 0 ? this.refReviewItem.nickName : "") + this.isAuthor + '\u7684\u8BC4\u8BBA\uFF1A</span> ' + this.refReviewItem.reviewContent;
      }
    },
    formatTime: function formatTime() {
      if (!this.reviewItem || !this.reviewItem.reviewTime) return "";
      return this.reviewItem.reviewTime.substring(0, 10).replace(/-/g, ".");
    },
    isAuthor: function isAuthor() {
      if (!this.refReviewItem) return "";
      if (this.refReviewItem.isAuthor == 1) {
        return "（作者）";
      } else {
        return "";
      }
    }
  }),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setCommentWindowShow', 'setCurrentCommentId', 'setLoadingStatus', 'setDeleteCommentItem', 'showBigImg', 'setClickFlag', 'setEnsureShow']), mapActions(['checkLogin']), {
    previewImage: function previewImage(list) {
      var _list = [];
      list.forEach(function (e, i) {
        _list.push(e.attUrl);
      });

      wx.previewImage({
        current: list[0].attUrl,
        urls: _list
      });
    },
    replyCurrentComment: function replyCurrentComment(e) {
      var _this = this;

      if (!this.clickFlag) return false;
      this.setClickFlag(false);
      console.log(this.clickFlag);
      console.log(this.reviewItem);
      this.setLoadingStatus(true);
      if (e.target.userInfo) {
        //已授权...
        if (this.customerId) {
          this.setCommentWindowShow(true);
          this.setCurrentCommentId({
            reviewId: this.reviewItem.reviewId,
            refCustomerId: this.reviewItem.customerId
          });
          this.setLoadingStatus(false);
          this.setClickFlag(true);
        } else {
          this.checkLogin().then(function (status) {
            _this.setClickFlag(true);
            //  是否绑定手机？
            // 已绑定...
            if (status) {
              _this.setCommentWindowShow(true);
              _this.setCurrentCommentId({
                reviewId: _this.reviewItem.reviewId,
                refCustomerId: _this.reviewItem.customerId
              });
            }
            _this.setLoadingStatus(false);
            //未绑定...前往绑定
          });
        }
      } else {
        this.setEnsureShow(true);
        this.setLoadingStatus(false);
        this.setClickFlag(true);
        this.setCurrentCommentId({
          reviewId: this.reviewItem.reviewId,
          refCustomerId: this.reviewItem.customerId
        });
      }
    },
    deleteEvent: function deleteEvent() {
      if (!this.clickFlag) return false;
      this.setClickFlag(false);
      this.setDeleteCommentItem({
        flag: true,
        item: this.reviewItem.reviewId
      });
    }
  }),

  mounted: function mounted() {
    // console.log(this.reviewItem)
  }
});

/***/ }),

/***/ 1110:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('section', {
    staticClass: "comment-content-item"
  }, [_c('header', {
    staticClass: "comment-content-item-title"
  }, [(_vm.reviewItem) ? _c('figure', {
    staticClass: "comment-content-item-logo"
  }, [_c('img', {
    attrs: {
      "src": _vm.reviewItem.headLogo,
      "alt": ""
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.reviewItem) ? _c('section', {
    staticClass: "comment-content-item-base"
  }, [(_vm.reviewItem.nickName && _vm.reviewItem.nickName.length > 0) ? _c('h4', {
    staticClass: "name"
  }, [_vm._v(_vm._s(_vm.reviewItem.nickName) + " "), (_vm.reviewItem.isAuthor == 1) ? _c('span', [_vm._v("（作者）")]) : _vm._e()]) : _vm._e(), _vm._v(" "), _c('p', {
    staticClass: "time"
  }, [_vm._v(_vm._s(_vm.formatTime))])], 1) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "comment-content-item-article"
  }, [_c('article', {
    staticClass: "comment-content-item-mainText"
  }, [(_vm.reviewItem.isValid == 1) ? _c('p', {
    staticClass: "content",
    domProps: {
      "innerHTML": _vm._s(_vm.formatContent)
    }
  }) : _vm._e(), _vm._v(" "), (_vm.reviewItem.isValid == 0) ? _c('p', {
    staticClass: "content"
  }, [_vm._v("该评论已删除")]) : _vm._e(), _vm._v(" "), (_vm.reviewItem.isValid == 1 && _vm.contentToggleShow && _vm.contentToggle) ? _c('span', {
    staticClass: "toggle",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.contentToggle = false
      }
    }
  }, [_vm._v("展开")]) : _vm._e(), _vm._v(" "), (_vm.reviewItem.isValid == 1 && _vm.contentToggleShow && !_vm.contentToggle) ? _c('span', {
    staticClass: "toggle hide",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.contentToggle = true
      }
    }
  }, [_vm._v("收起")]) : _vm._e()], 1), _vm._v(" "), (_vm.reviewItem && _vm.reviewItem.isValid == 1 && _vm.reviewItem.attList[0]) ? _c('figure', {
    staticClass: "comment-content-img-box"
  }, [_c('img', {
    attrs: {
      "src": _vm.reviewItem.attList[0] && _vm.reviewItem.attList[0].attUrl,
      "alt": "",
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.previewImage(_vm.reviewItem.attList)
      }
    }
  })]) : _vm._e()], 1), _vm._v(" "), (_vm.refReviewItem) ? _c('section', {
    staticClass: "comment-content-item-quote"
  }, [_c('article', {
    staticClass: "comment-content-item-quote-article"
  }, [(_vm.refReviewItem.isValid == 1 && _vm.refReviewItem.status == 1 && _vm.refReviewItem.reviewContent.length > 0) ? _c('p', {
    staticClass: "content"
  }, [_c('span', {
    domProps: {
      "innerHTML": _vm._s(_vm.formatQuote)
    }
  })]) : _vm._e(), _vm._v(" "), (_vm.refReviewItem.isValid == 1 && _vm.refReviewItem.status == 1 && _vm.refReviewItem.reviewContent.length === 0 && _vm.refReviewItem.attList.length > 0) ? _c('p', {
    staticClass: "content"
  }, [_c('span', {
    staticClass: "quote"
  }, [_vm._v("引用 " + _vm._s((_vm.refReviewItem.nickName && _vm.refReviewItem.nickName.length > 0) ? _vm.refReviewItem.nickName : "") + _vm._s(_vm.isAuthor) + "的评论：")]), _vm._v("图片评论\n        ")]) : _vm._e(), _vm._v(" "), (_vm.refReviewItem.isValid == 0 || _vm.refReviewItem.status == 0) ? _c('p', {
    staticClass: "content"
  }, [_c('span', {
    staticClass: "quote"
  }, [_vm._v("引用 " + _vm._s((_vm.refReviewItem.nickName && _vm.refReviewItem.nickName.length > 0) ? _vm.refReviewItem.nickName : "") + _vm._s(_vm.isAuthor) + "的评论：")]), _vm._v("该评论已删除\n        ")]) : _vm._e(), _vm._v(" "), (_vm.refReviewItem.isValid == 1 && _vm.quoteToggleShow) ? _c('article', [(_vm.quoteToggle) ? _c('span', {
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.quoteToggle = false
      }
    }
  }, [_vm._v("展开")]) : _c('span', {
    staticStyle: {
      "margin-bottom": "-28rpx"
    },
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.quoteToggle = true
      }
    }
  }, [_vm._v("收起")])]) : _vm._e()], 1), _vm._v(" "), (_vm.refReviewItem && _vm.refReviewItem.isValid == 1 && _vm.refReviewItem.status == 1 && _vm.refReviewItem.attList[0]) ? _c('figure', {
    staticClass: "comment-content-quote-img-box"
  }, [_c('figure', {
    staticClass: "list"
  }, [_c('img', {
    attrs: {
      "src": _vm.refReviewItem.attList[0] && _vm.refReviewItem.attList[0].attUrl,
      "alt": "",
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.previewImage(_vm.refReviewItem.attList)
      }
    }
  })])], 1) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.reviewItem.isValid == 1) ? _c('section', {
    staticClass: "comment-content-controller"
  }, [(_vm.reviewItem.customerId == _vm.customerId) ? _c('section', {
    staticClass: "delete",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.deleteEvent
    }
  }, [_c('i', {
    staticClass: "icon-delete"
  }), _vm._v(" "), _c('span', [_vm._v("删除")])], 1) : _vm._e(), _vm._v(" "), _c('button', {
    staticClass: "reply",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '7'
    },
    on: {
      "getuserinfo": _vm.replyCurrentComment
    }
  }, [_c('i', {
    staticClass: "icon-replay"
  }), _vm._v(" "), _c('span', [_vm._v("回复")])], 1)], 1) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-14b6b9bd", esExports)
  }
}

/***/ }),

/***/ 1111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "comment-container",
    attrs: {
      "id": "container"
    }
  }, [_c('nav', {
    staticClass: "comment-navBar"
  }, [_c('section', {
    staticClass: "comment-navBar-item",
    class: {
      'active': _vm.listType === 'all'
    },
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.changeCommentList('all')
      }
    }
  }, [_vm._v("全部评论\n    ")]), _vm._v(" "), _c('section', {
    staticClass: "comment-navBar-item",
    class: {
      'active': _vm.listType === 'author'
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.changeCommentList('author')
      }
    }
  }, [_vm._v("\n      只看作者\n    ")])], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.listType === 'all'),
      expression: "listType==='all'"
    }],
    staticClass: "comment-content"
  }, [_vm._l((_vm.commentList), function(item, index) {
    return (item.reviewData && item.reviewData.isValid == 1 && _vm.commentList.length > 0) ? _c('CommentContent', {
      key: index,
      attrs: {
        "reviewItem": item.reviewData,
        "refReviewItem": item.refReviewData,
        "updateFlag": _vm.updateFlag,
        "eventid": '2-' + index,
        "mpcomid": '0-' + index
      },
      on: {
        "update:updateFlag": function($event) {
          _vm.updateFlag = $event
        }
      }
    }) : _vm._e()
  }), _vm._v(" "), (_vm.commentList === 'empty') ? _c('article', {
    staticClass: "no-comment"
  }, [_vm._v("第一条评论是你的了~")]) : _vm._e(), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.commentList !== 'empty' && _vm.allTypeLoading),
      expression: "commentList!=='empty'&&allTypeLoading"
    }],
    staticClass: "extraLine"
  }, [_vm._v(_vm._s(_vm.allTypeFinish ? '--到底了--' : '正在加载..'))])], 2), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.listType === 'author'),
      expression: "listType==='author'"
    }],
    staticClass: "comment-content"
  }, [_vm._l((_vm.authorCommentList), function(item, index) {
    return (item.reviewData && item.reviewData.isValid == 1 && _vm.authorCommentList.length > 0) ? _c('CommentContent', {
      key: index,
      attrs: {
        "reviewItem": item.reviewData,
        "refReviewItem": item.refReviewData,
        "updateFlag": _vm.updateFlag,
        "eventid": '3-' + index,
        "mpcomid": '1-' + index
      },
      on: {
        "update:updateFlag": function($event) {
          _vm.updateFlag = $event
        }
      }
    }) : _vm._e()
  }), _vm._v(" "), (_vm.authorCommentList === 'empty') ? _c('article', {
    staticClass: "no-comment"
  }, [_vm._v("暂无内容")]) : _vm._e(), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.authorCommentList !== 'empty' && _vm.authorTypeLoading),
      expression: "authorCommentList!=='empty'&&authorTypeLoading"
    }],
    staticClass: "extraLine"
  }, [_vm._v(_vm._s(_vm.authorTypeFinish ? '--到底了--' : '正在加载..'))])], 2)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-74f5533d", esExports)
  }
}

/***/ }),

/***/ 1112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_bottomBar_vue__ = __webpack_require__(1114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_45d54ad6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_bottomBar_vue__ = __webpack_require__(1115);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1113)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_bottomBar_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_45d54ad6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_bottomBar_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/bottomBar.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] bottomBar.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-45d54ad6", Component.options)
  } else {
    hotAPI.reload("data-v-45d54ad6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1113:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_GetPhoneAuthorization__ = __webpack_require__(46);
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
//
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
 * Created by Hallmader on 2018/8/12.
 */





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    var mobileOnOff = __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    return {
      mobileOnOff: mobileOnOff,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      }
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['checkLogin']), mapMutations(['setShareShow', 'setCommentWindowShow', 'setEnsureShow', 'setLoadingStatus', 'setCurrentCommentId', 'setClickFlag', 'setAuthStatus']), {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    shareEvent: function shareEvent() {
      this.setShareShow(true);
      __WEBPACK_IMPORTED_MODULE_1_dataLog__["a" /* default */].createTrack({
        actionId: 14130
      });
    },
    clickCommentEventPhoneNumber: function clickCommentEventPhoneNumber(info) {
      var _this = this;
      var e = info.mp;
      console.log(e);
      __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].init({
        info: e,
        cancelBack: function cancelBack() {
          console.log('未获取用户手机号');
        },
        successBack: function successBack() {
          // console.log(`+++++++++++++++++++++`)
          // console.log(this.mobile)
          if (!_this.clickFlag) return false;
          _this.setClickFlag(false);

          if (_this.mobile) {
            _this.setCurrentCommentId({
              reviewId: "",
              refCustomerId: ""
            });
            _this.setCommentWindowShow(true);
            _this.setLoadingStatus(false);
            _this.setClickFlag(true);
          } else {

            var pages = getCurrentPages(); //获取加载的页面

            var currentPage = pages[pages.length - 1]; //获取当前页面的对象

            var url = currentPage.route; //当前页面url

            var options = currentPage.options; //如果要获取url中所带的参数可以查看options

            wx.navigateTo({
              url: "/packageF/journalDetail/journalDetail?rId=" + options + "&aId=" + options.aId + +"&form=" + options.form,
              success: function success() {
                _this.setClickFlag(true);
              }
            });
          }
        }
      });
    },
    clickCommentEvent: function clickCommentEvent() {
      var _this2 = this;

      // console.log(`+++++++++++++++++++++`)
      // console.log(this.mobile)
      if (!this.clickFlag) return false;
      this.setClickFlag(false);

      if (this.mobile) {
        this.setCurrentCommentId({
          reviewId: "",
          refCustomerId: ""
        });
        this.setCommentWindowShow(true);
        this.setLoadingStatus(false);
        this.setClickFlag(true);
      } else {

        var pages = getCurrentPages(); //获取加载的页面

        var currentPage = pages[pages.length - 1]; //获取当前页面的对象

        var url = currentPage.route; //当前页面url

        var options = currentPage.options; //如果要获取url中所带的参数可以查看options

        wx.navigateTo({
          url: "/packageF/journalDetail/journalDetail?rId=" + options + "&aId=" + options.aId + +"&form=" + options.form,
          success: function success() {
            _this2.setClickFlag(true);
          }
        });
      }
    },
    commentEvent: function commentEvent(e) {
      var _this3 = this;

      // console.log(`-------------------------`)
      // console.log(this.mobile)
      if (!this.clickFlag) return false;
      this.setClickFlag(false);
      __WEBPACK_IMPORTED_MODULE_1_dataLog__["a" /* default */].createTrack({
        actionId: 14129
      });
      this.setCurrentCommentId({
        reviewId: "",
        refCustomerId: ""
      });
      this.setLoadingStatus(true);
      // console.log("check....")
      // console.log(e.target)
      if (e.target.userInfo) {
        this.setAuthStatus(true);
        //已授权...
        if (this.mobile) {
          this.setCommentWindowShow(true);
          this.setLoadingStatus(false);
          this.setClickFlag(true);
        } else {
          this.checkLogin().then(function (status) {
            //  是否绑定手机？
            // 已绑定...
            console.log(status);
            if (status) {
              _this3.setCommentWindowShow(true);
            }
            _this3.setLoadingStatus(false);
            //未绑定...前往绑定
          });
        }
      } else {
        this.setEnsureShow(true);
        this.setLoadingStatus(false);
        this.setClickFlag(true);
      }
    }
  }),

  mounted: function mounted() {
    // console.log(this.shareMessage.num)
    var _this = this;
    _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
  },

  watch: {
    userInfoEnd: function userInfoEnd(newVal, oldVal) {
      console.log(newVal);
      console.log('获取到信息');
      var _this = this;
      _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["userInfoEnd", 'hasBind', 'showShareBox', 'customerId', 'shareMessage', 'commentNum', 'listType', 'clickFlag', 'mobile', 'authStatus']), {
    formatCommentNum: function formatCommentNum() {
      if (parseInt(this.commentNum.all) > 99) {
        return "99+";
      } else {
        return this.commentNum.all;
      }
    },
    formatShareNum: function formatShareNum() {
      if (parseInt(this.shareMessage.num) >= 99) {
        return "99+";
      } else {
        return this.shareMessage.num;
      }
    }
  })
});

/***/ }),

/***/ 1115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.showShareBox) ? _c('footer', {
    staticClass: "bottom-bar"
  }, [(_vm.mobileOnOff) ? _c('section', {
    staticClass: "bottom-bar-item"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(!_vm.authStatus) ? _c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '0'
    },
    on: {
      "getuserinfo": _vm.commentEvent
    }
  }, [_c('i', {
    staticClass: "icon-comment"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("评论")]), _vm._v(" "), (_vm.commentNum.all > 0) ? _c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.formatCommentNum))]) : _vm._e()], 1) : _vm._e()], 1), _vm._v(" "), (_vm.authStatus) ? _c('section', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.clickCommentEvent
    }
  }, [_c('i', {
    staticClass: "icon-comment"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("评论")]), _vm._v(" "), (_vm.commentNum.all > 0) ? _c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.formatCommentNum))]) : _vm._e()], 1) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('section', {
    staticClass: "bottom-bar-item"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '4'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(!_vm.authStatus) ? _c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '3'
    },
    on: {
      "getuserinfo": _vm.commentEvent
    }
  }, [_c('i', {
    staticClass: "icon-comment"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("评论")]), _vm._v(" "), (_vm.commentNum.all > 0) ? _c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.formatCommentNum))]) : _vm._e()], 1) : _vm._e()], 1), _vm._v(" "), (_vm.authStatus) ? _c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "open-type": "getPhoneNumber",
      "eventid": '5'
    },
    on: {
      "getphonenumber": _vm.clickCommentEventPhoneNumber
    }
  }, [_c('i', {
    staticClass: "icon-comment"
  }), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("评论")]), _vm._v(" "), (_vm.commentNum.all > 0) ? _c('span', {
    staticClass: "num"
  }, [_vm._v(_vm._s(_vm.formatCommentNum))]) : _vm._e()], 1) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "line"
  }), _vm._v(" "), _c('section', {
    staticClass: "bottom-bar-item"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '7'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "bottom-bar-item-content",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '6'
    },
    on: {
      "click": _vm.shareEvent
    }
  }, [_c('i', {
    staticClass: "icon-share"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/wechat_01.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('span', {
    staticClass: "text"
  }, [_vm._v("分享给好友")])], 1)], 1)], 1)], 1) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-45d54ad6", esExports)
  }
}

/***/ }),

/***/ 1116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentWindow_vue__ = __webpack_require__(1118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_368fc9dc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentWindow_vue__ = __webpack_require__(1127);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1117)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentWindow_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_368fc9dc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentWindow_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/commentWindow.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] commentWindow.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-368fc9dc", Component.options)
  } else {
    hotAPI.reload("data-v-368fc9dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1117:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_upLoadPic_upLoadPic__ = __webpack_require__(1119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_imgLoading__ = __webpack_require__(1123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_confirm__ = __webpack_require__(15);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by Hallmader on 2018/8/12.
 */




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;





var xhr = __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/review/v1/upload/";
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      fixed: true,

      hideConfirm: false,
      commentContent: "",
      imageList: [],
      failImgList: [],
      deletePic: {},
      deletePicTip: false,
      focus: false,
      keyBoardHeight: 0,
      adjustPosition: false,
      submitSuccess: {
        type: '',
        icon: '/static/image/success.png',
        content: '发布成功',
        show: true,
        hideDelay: true
      },
      submitFail: {
        type: '',
        icon: '/static/image/fail.png',
        content: '发布失败',
        show: true,
        hideDelay: true
      }
    };
  },

  props: {
    destory: {
      type: Number,
      default: 0
    }
  },

  onUnload: function onUnload() {
    this.commentContent = "";
    this.imageList = [];
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setCommentWindowShow', 'showBigImg']), mapActions(['createJournalComment', 'showToast', 'getCommentList', 'changeCommentLoading']), {
    //取消评论
    cancelSubmit: function cancelSubmit() {
      var _this = this;

      this.setCommentWindowShow(false);
      this.focus = false;
      setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: _this.cachePosition,
          duration: 0
        });
      }, 100);
    },

    //提交评论
    submitComment: function submitComment() {
      var _this2 = this;

      if (this.imageList[0]) {
        if (this.imageList[0].uploading) {
          return false;
        }
      }

      if (this.commentContent.trim().length === 0 && (this.imageList.length === 0 || !this.imageList[0].imgId)) {
        this.showToast("回复内容不能为空");
      } else {
        this.createJournalComment({
          resourceId: this.resourceId,
          customerId: this.customerId,
          refCustomerId: this.currentCustomerId || "",
          reviewContent: this.commentContent.trim(),
          treeLevel: this.currentCustomerId ? 2 : 1,
          parentId: this.currentCommentId || 0,
          attIdList: this.imageList[0] ? this.imageList[0].imgId : ""
        }).then(function (data) {
          if (data.responseObject.responseStatus) {
            //  成功
            _this2.changeCommentLoading(_this2.submitSuccess).then(function () {
              _this2.setCommentWindowShow(false);
              _this2.getCommentList({
                type: "getAll",
                getter: true
              });
              _this2.getCommentList({
                type: "getAuthor",
                getter: true
              });

              _this2.commentContent = "";
              _this2.imageList = [];
              var query = wx.createSelectorQuery();
              query.select('#queryHelper').boundingClientRect();
              query.selectViewport().scrollOffset();

              query.exec(function (res) {
                setTimeout(function () {
                  wx.pageScrollTo({
                    scrollTop: res[0].height,
                    duration: 0
                  });
                }, 100);
              });
            });
          } else {
            //失败
            _this2.changeCommentLoading(_this2.submitFail);
          }
        }).catch(function (err) {
          _this2.changeCommentLoading(_this2.submitFail);
        });
      }
    },
    previewImage: function previewImage(item) {
      this.showBigImg({
        imageList: this.imageList,
        img: item.blob
      });
    },
    uploadImage: function uploadImage() {
      var _this3 = this;

      console.log('------------\u4E0A\u4F20\u56FE\u7247----------');
      console.log(this.imageList.length);
      if (this.imageList.length > 0) {
        this.showToast("最多上传1张图片");
        return false;
      }
      wx.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function success(res) {
          _this3.imageList = [];
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this3.tempFilePaths = res.tempFilePaths;
          _this3.imageList.push({
            imgId: "",
            uploading: true,
            fail: false,
            finish: false,
            blob: res.tempFilePaths[0]
          });
          _this3.upLoadPic(res.tempFilePaths[0]);
        }
      });
    },
    upLoadPic: function upLoadPic(file) {
      var _this4 = this;

      wx.uploadFile({
        url: xhr,
        filePath: file,
        name: "file",
        formData: {
          attType: "1",
          sortId: "1",
          reviewId: this.currentCommentId || "",
          visitSiteId: __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].getSiteId()
        },
        success: function success(res) {
          var _data = JSON.parse(res.data);
          if (_data.responseObject.responseStatus) {
            _this4.imageList[0].imgId = _data.responseObject.responseData.id;
            _this4.imageList[0].uploading = false;
            _this4.imageList[0].fail = false;
            _this4.imageList[0].finish = true;
          } else {
            _this4.imageList[0].imgId = _data.responseObject.responseData.id;
            _this4.imageList[0].uploading = false;
            _this4.imageList[0].fail = true;
            _this4.imageList[0].finish = false;
          }

          _this4.tempFilePaths = [];
        },
        fail: function fail(err) {
          _this4.imageList[0] = {};
          _this4.tempFilePaths = [];
        }
      });
    },
    imgDelete: function imgDelete() {
      this.deletePicTip = true;
    },
    ensureDeletePic: function ensureDeletePic() {
      this.deletePicTip = false;
      this.imageList = [];
    },
    cancelDeletePic: function cancelDeletePic() {
      this.deletePicTip = false;
    }
  }),
  mounted: function mounted() {},

  components: {
    upLoadPic: __WEBPACK_IMPORTED_MODULE_1_components_upLoadPic_upLoadPic__["a" /* default */],
    ImgLoading: __WEBPACK_IMPORTED_MODULE_5_components_imgLoading__["a" /* default */],
    Confirm: __WEBPACK_IMPORTED_MODULE_6_components_confirm__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['cachePosition', 'customerId', 'resourceId', 'showCommentWindow', 'currentCommentId', 'currentCustomerId', 'systemInfo']), {
    lastCount: function lastCount() {
      return 1000 - this.commentContent.trim().length;
    },
    sendActive: function sendActive() {
      if (this.imageList.length > 0 || this.commentContent.trim().length > 0) {
        return true;
      } else {
        return false;
      }
    },
    hasImage: function hasImage() {
      if (this.imageList.length > 0 && this.focus) {
        return true;
      } else {
        return false;
      }
    },
    system: function system() {
      if (this.systemInfo.model && this.systemInfo.model.toLowerCase().includes("iphone x")) {
        return "iphoneX";
      } else {
        if (this.systemInfo.system) {
          if (this.systemInfo.system.toLowerCase().includes("android")) {
            return "android";
          } else {
            return "ios";
          }
        }
      }
    }
  })
});

/***/ }),

/***/ 1119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadPic_vue__ = __webpack_require__(1121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_315a4f8a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadPic_vue__ = __webpack_require__(1122);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1120)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadPic_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_315a4f8a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadPic_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/upLoadPic/upLoadPic.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] upLoadPic.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-315a4f8a", Component.options)
  } else {
    hotAPI.reload("data-v-315a4f8a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1120:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__common_js_upLoadPic_upLoadComm__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__upLoadPlugn__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
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
//
//
//
//
//

/**
 * @Desc：上传图模块(就诊情况页面)
 * @Usage:
 * @Notify：版本_2.0
 * @Depend：util.js//upLoadComm.js//upLoadPlugn.vue
 *
 * Created by Jukun on 2018/5/15.
 */





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('questionDesc'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters;

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "uploadPic",
  data: function data() {
    return {
      upLoadDetail: true,
      tempFilePaths: "",
      imgUrl: [],
      upLoadIndex: 0,
      reload: false,
      isReadyLoad: true, //是否无上传失败图片
      failImgList: []
      // isShowBtn:true
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setQueryObject', 'setScene']), {
    //上传前
    beforeUploadFn: function beforeUploadFn(data) {
      var _this = this;
      _this.imgUrl = data.imgUrl;
      _this.failImgList.push(data.failParam);
    },

    //上传结束
    uploadDoneFn: function uploadDoneFn(param) {
      console.log(param);
    },

    //重传图片
    upLoadReload: function upLoadReload(index) {
      var _this = this;
      if (!_this.reload) {
        _this.reload = true; //禁止重传
        __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].reloadFile({
          param: _this.failImgList[index],
          uploadBefor: function uploadBefor(_data) {
            _this.imgUrl[index].uploading = true;
            _this.imgUrl[index].fail = false;
            _this.imgUrl[index].finish = false;
          },
          uploadDoneFn: function uploadDoneFn(_data) {
            _this.reload = false; //允许重传
            if (_data.fail) {
              _this.imgUrl[index].uploading = false;
              _this.imgUrl[index].fail = true;
              _this.imgUrl[index].finish = true;
              _this.$forceUpdate();
            } else {
              _this.imgUrl[index].imgId = _data.imgId;
              _this.imgUrl[index].uploading = false;
              _this.imgUrl[index].fail = false;
              _this.imgUrl[index].finish = true;
              _this.$forceUpdate();
            }
          }
        });
      } else {
        //禁止重传
      }
    },

    //查看大图
    viewBigImg: function viewBigImg(index) {
      var _this = this;
      var _imgurls = [];
      wx.setStorageSync("guideFrom", "shootips");
      _this.imgUrl.forEach(function (ele, index) {
        _imgurls.push(ele.blob);
      });
      wx.previewImage({
        current: _this.imgUrl[index].blob, // 当前显示图片的http链接
        urls: _imgurls // 需要预览的图片http链接列表
      });
    },

    //删除图片
    imgDelFn: function imgDelFn(index) {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_1__common_js_upLoadPic_upLoadComm__["a" /* default */])({
        id: _this.imgUrl[index].imgId,
        isValid: "0"
      }).then(function (res) {
        _this.imgUrl.splice(index, 1);
        var idList = '';
        _this.imgUrl.forEach(function (ele, index) {
          if (ele.imgId > 0) {
            if (index == 0) {
              idList = ele.imgId;
            } else if (idList == '') {
              idList = ele.imgId;
            } else {
              idList = idList + ',' + ele.imgId;
            }
          }
        });
        //清理缓存
        wx.setStorageSync("attIds", idList);
        if (_this.imgUrl.length == 0) {
          _this.upLoadDetail = true;
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    //删除图片确定模态
    imgDelToast: function imgDelToast(index) {
      var _this = this;
      wx.showModal({
        // title: '确定删除图片吗？',
        content: '确定删除图片吗？',
        cancelText: '确定',
        cancelColor: '#00beaf',
        confirmText: '取消',
        confirmColor: '#00beaf',
        success: function success(res) {
          if (res.confirm) {
            ;
          } else if (res.cancel) {
            _this.imgDelFn(index);
          }
        }
      });
    },

    //上传指导页面
    viewGuide: function viewGuide() {
      wx.navigateTo({
        url: "/pages/upLoadGuide/upLoadGuide"
      });
    },
    getDefaultData: function getDefaultData() {
      var _this2 = this;

      var _this = this;
      var _keys = '';
      this.$nextTick(function () {
        if ((_this2.queryObject.reportType == 1 || _this2.queryObject.reportType == 2) && _this2.uploadType == _this2.queryObject.reportType) {
          var _imgurls = _this2.queryObject.attList;
          if (_imgurls && _imgurls.length > 0) {
            _this.upLoadDetail = false;
          }
          _imgurls.forEach(function (item, index) {
            _this.imgUrl.push({
              blob: item.caseAttUrl,
              imgId: item.id,
              uploading: false,
              fail: false,
              finish: true
            });
            //ID存储
            if (_keys != '') {
              _keys = _keys + "," + item.id;
            } else {
              _keys = item.id;
            }
          });
          wx.setStorageSync("attIds", _keys);
        }
      });
    }
  }),
  mounted: function mounted() {
    this.getDefaultData();
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapGetters(['queryObject', 'scene'])),
  components: {
    uploadPlugn: __WEBPACK_IMPORTED_MODULE_2__upLoadPlugn__["a" /* default */]
  },
  props: {
    uploadType: {
      type: String
    }
  }
});

/***/ }),

/***/ 1122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('section', {
    staticClass: "upLoad-main"
  }, [_c('ul', {
    staticClass: "upLoadBox"
  }, [_vm._l((_vm.imgUrl), function(item, index) {
    return (index < 9) ? _c('li', {
      key: index,
      staticClass: "upLoadItem"
    }, [_c('img', {
      staticClass: "imgItem",
      attrs: {
        "src": item.blob,
        "mode": "aspectFill",
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.viewBigImg(index)
        }
      }
    }), _vm._v(" "), (!item.fail) ? _c('span', {
      staticClass: "imgItem-delBtn",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelToast(index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (item.uploading) ? _c('span', {
      staticClass: "imgItem-cover"
    }, [_c('span', {
      staticClass: "imgItem-loading"
    })]) : _vm._e(), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "imgItem-fail",
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          _vm.upLoadReload(index)
        }
      }
    }, [_c('p', {
      staticClass: "imgItem-failText"
    }, [_vm._v("上传失败")]), _vm._v(" "), _c('p', {
      staticClass: "imgItem-reloadText"
    }, [_vm._v("点击重试")])], 1) : _vm._e()], 1) : _vm._e()
  }), _vm._v(" "), _c('uploadPlugn', {
    attrs: {
      "isFailToast": true,
      "propClass": 'upLoadItem addBtn',
      "imgList": _vm.imgUrl,
      "paramObj": {
        limit: 50,
        singleNum: 9,
        maxSize: 10,
        overSingleTips: '一次最多上传9张图片',
        overSizeTips: '图片不能超过10M',
        compressRatio: 0.8
      },
      "eventid": '3',
      "mpcomid": '0'
    },
    on: {
      "beforeUpload": _vm.beforeUploadFn,
      "uploadDone": _vm.uploadDoneFn
    }
  }), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.imgUrl.length > 0),
      expression: "!imgUrl.length>0"
    }],
    staticClass: "upLoadDetail"
  }, [_c('p', {
    staticClass: "upLoadDetail-top"
  }, [_vm._v("请上传您的病例（以及处方、检查单、X光/CT/核磁等资料）")]), _vm._v(" "), _c('span', {
    staticClass: "upLoadDetail-bottom",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": _vm.viewGuide
    }
  }, [_vm._v("查看拍摄示例")])], 1)], 2), _vm._v(" "), (_vm.imgUrl.length > 0) ? _c('section', {
    staticClass: "upLoadViewBtn"
  }, [_c('span', {
    staticClass: "upLoadViewBtn-l"
  }, [_vm._v("【已上传" + _vm._s(_vm.imgUrl.length) + "张】")]), _c('span', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imgUrl.length > 9),
      expression: "imgUrl.length>9"
    }],
    staticClass: "upLoadViewBtn-r",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.viewBigImg(0)
      }
    }
  }, [_vm._v("查看更多")])]) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-315a4f8a", esExports)
  }
}

/***/ }),

/***/ 1123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imgLoading_vue__ = __webpack_require__(1125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3515e8fc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imgLoading_vue__ = __webpack_require__(1126);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1124)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_imgLoading_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3515e8fc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_imgLoading_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/imgLoading.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] imgLoading.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3515e8fc", Component.options)
  } else {
    hotAPI.reload("data-v-3515e8fc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1124:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1125:
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/7/18.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {};
  },
  mounted: function mounted() {},

  props: {
    show: {
      type: Boolean
    }

  }
});

/***/ }),

/***/ 1126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "img-loading-box"
  }, [_c('section', {
    staticClass: "img-loading-modal"
  }, [_c('figure', {
    staticClass: "img-loading-box-text"
  }, [_c('img', {
    staticClass: "rotate",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/loading.png",
      "alt": "loading..."
    }
  })])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3515e8fc", esExports)
  }
}

/***/ }),

/***/ 1127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "comment-window-container",
    class: {
      'show': _vm.showCommentWindow
    },
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": _vm.cancelSubmit
    }
  }, [_c('section', {
    staticClass: "comment-window",
    class: {
      'isIphoneX': _vm.system == 'iphoneX'
    },
    attrs: {
      "eventid": '8'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
      }
    }
  }, [_c('section', {
    staticClass: "comment-window-textarea-container"
  }, [_c('figure', {
    staticClass: "comment-window-textarea"
  }, [(_vm.system == 'iphoneX' && _vm.showCommentWindow) ? _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.commentContent),
      expression: "commentContent"
    }],
    staticClass: "comment-window-text iphoneX",
    attrs: {
      "fixed": _vm.fixed,
      "placeholder": "走心的评论最有爱",
      "placeholder-class": "comment-window-placeholder",
      "maxlength": "1000",
      "showConfirmBar": _vm.hideConfirm,
      "cursor-spacing": "20",
      "auto-height": "true",
      "auto-focus": "true",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.commentContent)
    },
    on: {
      "focus": function($event) {
        _vm.focus = true
      },
      "blur": function($event) {
        _vm.focus = false
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.commentContent = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.system == 'ios' && _vm.showCommentWindow) ? _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.commentContent),
      expression: "commentContent"
    }],
    staticClass: "comment-window-text ios",
    attrs: {
      "fixed": _vm.fixed,
      "placeholder": "走心的评论最有爱",
      "placeholder-class": "comment-window-placeholder",
      "maxlength": "1000",
      "showConfirmBar": _vm.hideConfirm,
      "cursor-spacing": "20",
      "auto-height": "true",
      "auto-focus": "true",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.commentContent)
    },
    on: {
      "focus": function($event) {
        _vm.focus = true
      },
      "blur": function($event) {
        _vm.focus = false
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.commentContent = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.system == 'android' && _vm.showCommentWindow) ? _c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.commentContent),
      expression: "commentContent"
    }],
    staticClass: "comment-window-text android",
    class: {
      'noText': _vm.commentContent.length > 0
    },
    attrs: {
      "fixed": _vm.fixed,
      "placeholder": "走心的评论最有爱",
      "showConfirmBar": _vm.hideConfirm,
      "placeholder-class": "comment-window-placeholder",
      "maxlength": "1000",
      "cursor-spacing": "20",
      "auto-height": "true",
      "auto-focus": "true",
      "eventid": '2'
    },
    domProps: {
      "value": (_vm.commentContent)
    },
    on: {
      "focus": function($event) {
        _vm.focus = true
      },
      "blur": function($event) {
        _vm.focus = false
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.commentContent = $event.target.value
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.lastCount <= 50) ? _c('p', {
    staticClass: "last-tips"
  }, [_vm._v(_vm._s(_vm.lastCount))]) : _vm._e()], 1), _vm._v(" "), (_vm.imageList.length > 0) ? _c('span', {
    staticClass: "middle-line"
  }) : _vm._e(), _vm._v(" "), (_vm.imageList.length > 0) ? _c('section', {
    staticClass: "comment-window-imgList"
  }, _vm._l((_vm.imageList), function(item, index) {
    return _c('figure', {
      key: index,
      staticClass: "comment-window-img"
    }, [_c('img', {
      attrs: {
        "src": item.blob,
        "alt": "",
        "eventid": '3-' + index
      },
      on: {
        "click": function($event) {
          _vm.previewImage(item)
        }
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadDel",
      attrs: {
        "eventid": '4-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelete(index)
        }
      }
    }), _vm._v(" "), (!item.finish) ? _c('ImgLoading', {
      attrs: {
        "mpcomid": '0-' + index
      }
    }) : _vm._e()], 1)
  })) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "submit-container"
  }, [_c('figure', {
    staticClass: "comment-window-uploader",
    class: {
      'uploaded': _vm.imageList.length > 0
    },
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": _vm.uploadImage
    }
  }), _vm._v(" "), _c('section', {
    staticClass: "submit-button-container",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.submitComment
    }
  }, [_c('div', {
    staticClass: "submit-button",
    class: {
      'active': _vm.sendActive
    }
  }, [_vm._v("发送")])])], 1), _vm._v(" "), (_vm.deletePicTip) ? _c('Confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '取消',
        'cancel': '确定',
        'title': '确定删除图片吗？'
      },
      "showFlag": _vm.deletePicTip,
      "eventid": '7',
      "mpcomid": '1'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.deletePicTip = $event
      },
      "cancelClickEvent": function($event) {
        _vm.ensureDeletePic()
      },
      "ensureClickEvent": function($event) {
        _vm.cancelDeletePic()
      }
    }
  }) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-368fc9dc", esExports)
  }
}

/***/ }),

/***/ 1128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalInfo_vue__ = __webpack_require__(1130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_97401d1c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalInfo_vue__ = __webpack_require__(1148);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1129)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalInfo_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_97401d1c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalInfo_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/journalInfo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] journalInfo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-97401d1c", Component.options)
  } else {
    hotAPI.reload("data-v-97401d1c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1129:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1130:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getJournalQrCode__ = __webpack_require__(1131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getLikeNumber__ = __webpack_require__(1132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__backgroundMusic__ = __webpack_require__(1133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_components_wxParse_jkParse__ = __webpack_require__(1137);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//











var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapMutations = _createNamespacedHelp.mapMutations,
    mapActions = _createNamespacedHelp.mapActions;

var XHRList = {
  infoHtml: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getMapById/"
};
// const jkParse = require("../api/js/jkParse");


var popupTimeOut = null;
var shackTimeOut = null;
var videoTime = null;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      popup: false,
      shack: false,
      count: 0,
      recentLikeNum: 0,
      journalData: {
        operationString: "",
        updateTime: "",
        treatmentTimeShow: "",
        browseNumTest: "200000"
      },
      parseShow: false,
      clickStatus: true,
      clipFlag: false,
      countPages: '',
      backStatus: 0,
      fixedShow: false, // fixed 医生信息是否显示
      textHtml: '<p><img src="https://img05.allinmed.cn/public1/M00/04/ED/wKgBwVuPiryAV21KACq5BoF0xlU301.png"></p><p>发发发发发发发发发付付付付付付付付付付付付付付付付付付付</p><section class="videoStyleOrder"><video src="http://vpro.allinmed.cn/1536131521612_1280_720.mp4" class="videoPlayBox" controls="controls" poster="http://vpro.allinmed.cn/1536131521612_1536131521_450_300.jpg"></video></section>'
    };
  },

  components: {
    jkParse: __WEBPACK_IMPORTED_MODULE_11_components_wxParse_jkParse__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_8_components_backIndex__["a" /* default */],
    backgroundMusic: __WEBPACK_IMPORTED_MODULE_9__backgroundMusic__["a" /* default */]
  },
  onUnload: function onUnload() {
    this.recentLikeNum = 0;
    this.getLike();
    this.parseShow = false;
    this.journalData = {
      operationString: "",
      updateTime: "",
      treatmentTimeShow: "",
      diaryContent: ''
    };
    // if (videoTime) clearTimeout(videoTime);
  },
  onHide: function onHide() {
    this.getLike();
  },
  onShow: function onShow() {
    this.count = 0;
  },
  onPageScroll: function onPageScroll(e) {
    if (this.journalData.fullName) {
      if (e.scrollTop > 100) {
        this.fixedShow = true;
      } else {
        this.fixedShow = false;
      }
    }
  },
  onLoad: function onLoad(options) {
    var _this = this;
    this.journalData = {
      operationString: "",
      updateTime: "",
      treatmentTimeShow: "",
      diaryContent: ''
    };
    this.parseShow = false;
    this.popup = false;
    this.shack = false;
    this.fixedShow = false;
    if (popupTimeOut) clearTimeout(popupTimeOut);
    if (shackTimeOut) clearTimeout(shackTimeOut);
    // if (videoTime) clearTimeout(videoTime);
    // this.setVideoNum(0);
    this.getQr(options);
    this.getInfoHtml(options);

    // videoTime = setTimeout( () => {
    //   this.videoPause();
    // }, 2000)

    _this.countPages = getCurrentPages();
    // let _currentPages = getCurrentPages();
    // _currentPages.forEach((item,index)=>{
    //   switch (item.route){
    //     case 'pages/doctorMain/doctorMain':
    //         _this.backStatus+=1;
    //         break;
    //   }
    // })
  },

  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapActions(['checkLogin', 'getJournalQrCode', 'setVideoNum']), mapMutations(['setLoadingStatus', 'setShareMessage', 'setEnsureShow', 'setCommentNum', 'setCanvasShow', 'setJournalMessage', 'setBaseMessage']), {
    getLike: function getLike() {
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getLikeNumber__["a" /* default */])({
        refId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('diaryId'),
        preferUpNum: this.count,
        customerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('userId')
      });
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    clickShareButton: function clickShareButton() {
      var _this2 = this;

      // clearInterval(_interval);
      this.shack = true;
      this.count += 1;
      this.recentLikeNum += 1;
      this.popup = true;
      if (popupTimeOut) clearTimeout(popupTimeOut);

      // let timeRemaining = 3;
      // popupTimeOut = setTimeout(() => {
      //   timeRemaining = timeRemaining - 1;
      //   if (timeRemaining == 0) {
      //     this.popup = false;
      //     clearInterval(_interval);
      //   }
      // }, 1000);
      popupTimeOut = setTimeout(function () {
        _this2.popup = false;
      }, 3000);
      setTimeout(function () {
        _this2.shack = false;
      }, 500);
    },
    getCircleImage: function getCircleImage(url, w) {
      var _this3 = this;

      var ctx = wx.createCanvasContext('getCircleImage', this);
      // console.log(w)
      var res = wx.getSystemInfoSync();
      var platform = res.platform;
      var time = 0;
      if (platform === 'android') {
        // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
        time = 300;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, w / 2, w / 2, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(url, 0, 0, w, w);
      ctx.restore();

      if (platform === 'android') {
        // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
        time = 300;
      }
      // console.log(url)
      ctx.draw(false, function () {
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'getCircleImage',
            x: 0,
            y: 0,
            width: w,
            height: w,
            success: function success(res) {
              // console.log("....")
              // console.log(res)
              _this3.setJournalMessage({
                customerLogo: res.tempFilePath
              });
              _this3.clipFlag = false;
            },
            complete: function complete(res) {}
          }, _this3);
        }, 300);
      });
    },
    showCanvas: function showCanvas() {
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14196,
        pushMessageId: this.resourceId
      });
      this.setCanvasShow(true);
    },
    _mapHttpToHttps: function _mapHttpToHttps(rawUrl) {
      if (rawUrl.indexOf(':') < 0) {
        return rawUrl;
      }
      var urlComponent = rawUrl.split(':');
      if (urlComponent.length === 2) {
        if (urlComponent[0] === 'http') {
          urlComponent[0] = 'https';
          return urlComponent[0] + ":" + urlComponent[1];
        }
      }
      return rawUrl;
    },
    getQr: function getQr(obj) {
      var _this4 = this;

      // wx.showToast({
      //   title:"diaryId:"+obj.rId || obj.scene
      // });
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getJournalQrCode__["a" /* default */])({
        diaryId: obj.rId || obj.scene
      }).then(function (data) {
        // console.log('====================')
        // console.log(data.responseObject.responseStatus)
        // console.log('====================')
        if (data.responseObject.responseStatus) {
          _this4.setJournalMessage({
            qrCode: data.responseObject.responseData.dataList[0].miniUrl
          });
        }
      });
    },

    // 处理年龄；
    getAge: function getAge(num) {
      // console.log(num);
      var firstNum = parseInt(num / 10);
      var twoNum = num % 10;
      if (firstNum) {
        if (twoNum <= 5) {
          if (twoNum == 0) {
            if (firstNum == 1) {
              return firstNum + "\u5C81";
            } else {
              return firstNum - 1 + "5\u5C81\u4EE5\u4E0A";
            }
          } else {
            return firstNum + "0\u5C81\u4EE5\u4E0A";
          }
        } else {
          return firstNum + "5\u5C81\u4EE5\u4E0A";
        }
      } else {
        return twoNum + "\u5C81";
      }
    },
    getInfoHtml: function getInfoHtml(obj) {
      var that = this;
      this.setLoadingStatus(true);
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.infoHtml,
        method: "POST",
        data: {
          diaryId: obj.rId || obj.scene,
          isValid: "1",
          visitSiteId: 24
        },
        done: function done(res) {
          that.clipFlag = true;
          that.setLoadingStatus(false);
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            that.journalData = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()(that.journalData, res.responseObject.responseData.dataList[0]);
            setTimeout(function () {
              that.parseShow = true;
            }, 0);
            if (that.journalData.operationList && that.journalData.operationList.length) {
              that.journalData.operationList.forEach(function (element) {
                that.journalData.operationString += element.operationName + " ";
              });
            };
            that.recentLikeNum = parseInt(that.journalData.preferUpNum);
            that.journalData.updateTime = that.journalData.releaseTime.substring(0, 10);
            // that.journalData.fullNameShow = that.journalData.fullName.length > 9 ? that.journalData.fullName.substring(0, 9) + "..." : that.journalData.fullName;  //主诊医师字符截取
            that.journalData.fullNameShow = that.journalData.fullName.length > 4 ? that.journalData.fullName.substring(0, 3) + "..." : that.journalData.fullName;
            that.journalData.authorNameShow = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getByteLen(that.journalData.authorName) > 8 ? __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getStrByteLen(that.journalData.authorName, 6) + "..." : that.journalData.authorName;
            that.journalData.patientAgeShow = that.getAge(that.journalData.patientAge);
            that.journalData.treatmentTimeShow = that.journalData.treatmentTime.substring(0, 10);
            that.journalData.browseNumShow = that.journalData.browseNum > 9999 ? that.journalData.browseNum.substring(0, 1) + '万+' : that.journalData.browseNum;
            that.setShareMessage({
              title: that.journalData.diaryName,
              num: that.journalData.shareNum
            });
            that.$forceUpdate();
            // that.getCircleImage(that.journalData.customerLogo, 100);
            // console.log((that.journalData.customerLogo && that.journalData.customerLogo.length > 0) ? that._mapHttpToHttps(that.journalData.customerLogo) : that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"))
            wx.downloadFile({
              url: that.journalData.customerLogo && that.journalData.customerLogo.length > 0 ? that._mapHttpToHttps(that.journalData.customerLogo) : that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"),
              success: function success(res) {

                // console.log(res)
                if (res.statusCode === 200) {
                  that.getCircleImage(res.tempFilePath, 100);
                } else {
                  // console.log("??")
                  wx.downloadFile({
                    url: that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"),
                    success: function success(_res) {

                      if (_res.statusCode === 200) {
                        // console.log("??")
                        // console.log(_res)
                        that.getCircleImage(_res.tempFilePath, 100);
                      }
                    },
                    complete: function complete(err) {
                      console.log(err);
                    }
                  });
                }
              }
            });
            that.setJournalMessage({
              authorName: that.journalData.authorName,
              authorLogoUrl: that.journalData.authorLogoUrl,
              diaryName: that.journalData.diaryName,
              fullName: that.journalData.fullName,
              medicalTitle: that.journalData.medicalTitle,
              company: that.journalData.company,
              customerUrl: that.journalData.customerLogo,
              content: that.journalData.shareGuide
            });

            that.setBaseMessage({
              resourceId: obj.rId || obj.scene,
              authorCustomerId: that.journalData.authorId
            });
          }
        }
      });
    },

    // goToDoctor(doctorCustomerId) {
    //   if (!this.clickStatus) return;
    //   this.clickStatus = false;
    //   setTimeout(() => {
    //     this.clickStatus = true;
    //   }, 500);
    //   dataLog.createTrack({
    //     actionId: 14125,
    //   });
    //   console.log(`==============page============`)
    //   console.log(getcurrentPage())
    //   wx.navigateTo({
    //     url: `/pages/doctorMain/doctorMain?doctorCustomerId=${doctorCustomerId}&from=journal`
    //   })
    // },
    goDoctorMain: function goDoctorMain(doctorCustomerId) {
      var _this5 = this;

      if (!this.clickStatus) return;
      this.clickStatus = false;

      setTimeout(function () {
        _this5.clickStatus = true;
      }, 500);
      __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].createTrack({
        actionId: 14126
      });

      var _currenRout = false;
      var _currentPages = getCurrentPages();
      _currentPages.forEach(function (item, index) {
        if (item.route.indexOf('pages/doctorMain/doctorMain') > -1) {
          _currenRout = true; //历史栈有医生主页   路由回退
        }
      });
      if (_currenRout) {
        wx.navigateBack({
          delta: 1
        });
      } else {
        wx.navigateTo({
          url: "/pages/doctorMain/doctorMain?doctorCustomerId=" + doctorCustomerId + "&from=journal"
        });
      }
    },
    getUserInfo: function getUserInfo(e) {
      this.setLoadingStatus(true);
      if (e.target.userInfo) {
        //已授权...
        this.goDoctorMain(this.journalData.attendCustomerId);
        this.setLoadingStatus(false);
      } else {
        this.setEnsureShow(true);
        this.setLoadingStatus(false);
      }
    },
    goPersonal: function goPersonal(e) {
      this.setLoadingStatus(true);
      if (e.target.userInfo) {
        //已授权...
        wx.navigateTo({
          url: '/pages/personal/personal'
        });
        this.setLoadingStatus(false);
      } else {
        this.setEnsureShow(true);
        this.setLoadingStatus(false);
      }
    }
  }),
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['loading', 'customerId', 'commentNum', 'resourceId', 'journalMessage', 'canvasShow']), mapGetters(['videoNum']))
});

/***/ }),

/***/ 1131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getJournalQrCode;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__ = __webpack_require__(8);


/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/9/24.
 */



function getJournalQrCode(params) {
  var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getQrCode/";
  var _defaultData = {};

  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_defaultData, params);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__["a" /* default */])({
      url: XHRUrl,
      method: "POST",
      data: data,
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

/***/ 1132:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getHasInvitedConsult;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);


/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/11/5.
 */



var XHRList = __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/prefer/v1/createPreferNum/";

function getHasInvitedConsult(param) {
  var defaultData = {
    refId: '',
    preferUpNum: 0,
    customerId: '',
    usefulType: 1,
    upDownType: 1,
    sendSiteIdsendSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId
  };
  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(defaultData, param);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__["a" /* default */])({
      url: XHRList,
      method: "POST",
      data: data,
      done: function done(result) {
        resolve(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    });
  });
}

/***/ }),

/***/ 1133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_backgroundMusic_vue__ = __webpack_require__(1135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_432571f8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_backgroundMusic_vue__ = __webpack_require__(1136);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1134)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_backgroundMusic_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_432571f8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_backgroundMusic_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/backgroundMusic.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] backgroundMusic.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-432571f8", Component.options)
  } else {
    hotAPI.reload("data-v-432571f8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1134:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1135:
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

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'wxParseVideo',
  data: function data() {
    return {
      srcUrl: 'https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png',
      audioSrc: 'https://triage.allinmed.cn/dist/static/image/audio/warningTone.mp3',
      audioCtx: null,
      audioStatus: "paused",
      audioText: ''
    };
  },
  onLoad: function onLoad() {
    wx.removeStorageSync('audioStatus');
    this.audioStatus = 'paused';
    this.srcUrl = 'https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png';
    this.audioCtx = wx.createAudioContext('jkAudio');
    // this.audioCtx.play()
    this.audioControl();
  },

  methods: {
    audioControl: function audioControl() {
      if (this.audioStatus == 'paused') {
        this.audioPlay();
      } else {
        this.audioPause();
      }
    },
    audioPlay: function audioPlay() {
      this.audioCtx.play();
      this.audioStatus = 'played';
      this.srcUrl = 'https://m.allinmed.cn/static/image/mp/index/1.1.4/bofang.png';
      this.audioText = '音乐播放中...';
    },
    audioPause: function audioPause() {
      this.audioCtx.pause();
      this.audioStatus = 'paused';
      this.srcUrl = 'https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png';
      this.audioText = '音乐已暂停';
    }
  },
  computed: {},
  onHide: function onHide() {
    wx.setStorageSync('audioStatus', this.audioStatus == 'played' ? true : false);
    this.audioPause();
  },
  onShow: function onShow() {
    if (wx.getStorageSync('audioStatus')) {
      this.audioPlay();
    }
  },

  props: {
    audioMap: {}
  }
});

/***/ }),

/***/ 1136:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "audioOut"
  }, [_c('section', {
    staticClass: "audioBox"
  }, [_c('img', {
    staticClass: "audioStatus",
    attrs: {
      "src": _vm.srcUrl,
      "alt": "",
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.audioControl()
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "audioText"
  }, [_vm._v(_vm._s(_vm.audioText))]), _vm._v(" "), _c('audio', {
    attrs: {
      "id": "jkAudio",
      "src": _vm.audioMap.attUrl,
      "loop": ""
    }
  })], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-432571f8", esExports)
  }
}

/***/ }),

/***/ 1137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_jkParse_vue__ = __webpack_require__(1139);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_19904a7c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_jkParse_vue__ = __webpack_require__(1147);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1138)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_jkParse_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_19904a7c_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_jkParse_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/wxParse/jkParse.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] jkParse.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-19904a7c", Component.options)
  } else {
    hotAPI.reload("data-v-19904a7c", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1138:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1139:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__libs_html2json__ = __webpack_require__(1140);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_jkParseVideo__ = __webpack_require__(1143);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(4);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  name: "wxParse",
  components: {
    jkVideo: __WEBPACK_IMPORTED_MODULE_2__components_jkParseVideo__["a" /* default */]
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    noData: {
      type: String,
      default: '<div style="color: red;">数据不能为空</div>'
    },
    startHandler: {
      type: Function,
      default: function _default() {
        return function (node) {
          node.attr.class = null;
          node.attr.style = null;
        };
      }
    },
    endHandler: {
      type: Function,
      default: null
    },
    charsHandler: {
      type: Function,
      default: null
    },
    imageProp: {
      type: Object,
      default: function _default() {
        return {
          mode: "aspectFit",
          padding: 0,
          lazyLoad: true,
          domain: ""
        };
      }
    }
  },
  data: function data() {
    return {
      imageUrls: [],
      system: "",
      nodes: [],
      dataArr: [],
      lazyLoad: true,
      number: 0
    };
  },
  onLoad: function onLoad() {
    this.clearData();
    this.setVideoDefaultNum(0);
    // 数据重组初始化
    this.dataFormate();
  },
  onUnload: function onUnload() {
    this.clearData();
    this.setVideoDefaultNum(0);
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["f" /* mapState */])(["videoNum"])),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_3_vuex__["c" /* mapActions */])(["setVideoDefaultNum"]), {
    clearData: function clearData() {
      this.imageUrls = [];
      this.system = "";
      this.nodes = [];
      this.dataArr = [];
    },
    dataFormate: function dataFormate() {
      var _this = this;
      console.log("---------wxparse\u6570\u636E\u91CD\u7EC4-----------");
      var _nodesInit = this.getNodes();
      _this.dataCall(_nodesInit);
    },
    dataCall: function dataCall(_data) {
      var _this = this;
      _data.forEach(function (element) {
        if (element.nodes && element.nodes.length > 0) {
          _this.dataCall(element.nodes);
        } else {
          _this.dataSelect(element);
        }
      });
    },
    dataSelect: function dataSelect(_data) {
      var _this = this;
      switch (_data.node) {
        case "text":
          _this.dataArr.push({
            type: _data.node,
            content: _data.text
          });
          break;
        case "element":
          switch (_data.tag) {
            case "img":
              _this.dataArr.push({
                type: _data.tag,
                content: _data.attr.src
              });
              break;
            case "video":
              _this.dataArr.push({
                type: _data.tag,
                content: _data.attr.src,
                poster: _data.attr.poster
              });
              break;
            case "br":
              _this.dataArr.push({
                type: _data.tag
              });
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    navigate: function navigate(href, $event) {
      this.$emit("navigate", href, $event);
    },
    preview: function preview(src, $event) {
      if (!this.imageUrls.length) return;
      wx.previewImage({
        current: src,
        urls: this.imageUrls
      });
      this.$emit("preview", src, $event);
    },
    getNodes: function getNodes() {
      var content = this.content,
          noData = this.noData,
          imageProp = this.imageProp,
          startHandler = this.startHandler,
          endHandler = this.endHandler,
          charsHandler = this.charsHandler;

      var parseData = content || noData;
      var customHandler = {
        start: startHandler,
        end: endHandler,
        chars: charsHandler
      };
      var results = Object(__WEBPACK_IMPORTED_MODULE_1__libs_html2json__["a" /* default */])(parseData, customHandler, imageProp, this);
      this.imageUrls = results.imageUrls;
      return results.nodes;
    },
    removeImageUrl: function removeImageUrl(src) {
      var imageUrls = this.imageUrls;

      imageUrls.splice(imageUrls.indexOf(src), 1);
    },

    // 循环获取 video 让其暂停；
    videoPause: function videoPause() {
      var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.videoNum > num) {
        wx.createVideoContext("videoTag" + num).pause();
        return this.videoPause(++num);
      } else {
        return false;
      }
    }
  })
});

/***/ }),

/***/ 1140:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wxDiscode__ = __webpack_require__(1141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__htmlparser__ = __webpack_require__(1142);


/**
 * html2Json 改造来自: https://github.com/Jxck/html2json
 *
 *
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */




function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {
    obj[items[i]] = true;
  }return obj;
}

// Block Elements - HTML 5
var block = makeMap('br,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function removeDOCTYPE(html) {
  var isDocument = /<body.*>([^]*)<\/body>/.test(html);
  return isDocument ? RegExp.$1 : html;
}

function trimHtml(html) {
  return html.replace(/<!--.*?-->/gi, '').replace(/\/\*.*?\*\//gi, '').replace(/[ ]+</gi, '<').replace(/<script[^]*<\/script>/gi, '').replace(/<style[^]*<\/style>/gi, '');
}

function getScreenInfo() {
  var screen = {};
  wx.getSystemInfo({
    success: function success(res) {
      screen.width = res.windowWidth;
      screen.height = res.windowHeight;
    }
  });
  return screen;
}

function html2json(html, customHandler, imageProp, host) {
  // 处理字符串
  html = removeDOCTYPE(html);
  html = trimHtml(html);
  html = __WEBPACK_IMPORTED_MODULE_2__wxDiscode__["a" /* default */].strDiscode(html);
  // 生成node节点
  var bufArray = [];
  var results = {
    nodes: [],
    imageUrls: []
  };

  function Node(tag) {
    this.node = 'element';
    this.tag = tag;
  }
  Node.prototype.$screen = getScreenInfo();
  Node.prototype.$host = host;

  Object(__WEBPACK_IMPORTED_MODULE_3__htmlparser__["a" /* default */])(html, {
    start: function start(tag, attrs, unary) {
      // node for this element
      var node = new Node(tag);

      if (bufArray.length !== 0) {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
        node.tagType = 'closeSelf';
      }

      node.attr = attrs.reduce(function (pre, attr) {
        var name = attr.name;
        var value = attr.value;

        if (name === 'class') {
          node.classStr = value;
        }
        // has multi attibutes
        // make it array of attribute
        if (name === 'style') {
          node.styleStr = value;
        }
        if (value.match(/ /)) {
          value = value.split(' ');
        }

        // if attr already exists
        // merge it
        if (pre[name]) {
          if (Array.isArray(pre[name])) {
            // already array, push to last
            pre[name].push(value);
          } else {
            // single value, make it array
            pre[name] = [pre[name], value];
          }
        } else {
          // not exist, put it
          pre[name] = value;
        }

        return pre;
      }, {});

      // 优化样式相关属性
      if (node.classStr) {
        node.classStr += ' ' + node.tag;
      } else {
        node.classStr = node.tag;
      }
      if (node.tagType === 'inline') {
        node.classStr += ' inline';
      }

      // 对img添加额外数据
      if (node.tag === 'img') {
        var imgUrl = node.attr.src;
        imgUrl = __WEBPACK_IMPORTED_MODULE_2__wxDiscode__["a" /* default */].urlToHttpUrl(imgUrl, imageProp.domain);
        __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(node.attr, imageProp, {
          src: imgUrl || ''
        });
        if (imgUrl) {
          results.imageUrls.push(imgUrl);
        }
      }

      // 处理a标签属性
      if (node.tag === 'a') {
        node.attr.href = node.attr.href || '';
      }

      // 处理font标签样式属性
      if (node.tag === 'font') {
        var fontSize = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', '-webkit-xxx-large'];
        var styleAttrs = {
          color: 'color',
          face: 'font-family',
          size: 'font-size'
        };
        if (!node.styleStr) node.styleStr = '';
        __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_keys___default()(styleAttrs).forEach(function (key) {
          if (node.attr[key]) {
            var value = key === 'size' ? fontSize[node.attr[key] - 1] : node.attr[key];
            node.styleStr += styleAttrs[key] + ': ' + value + ';';
          }
        });
      }

      // 临时记录source资源
      if (node.tag === 'source') {
        results.source = node.attr.src;
      }

      if (customHandler.start) {
        customHandler.start(node, results);
      }

      if (unary) {
        // if this tag doesn't have end tag
        // like <img src="hoge.png"/>
        // add to parents
        var _parent = bufArray[0] || results;
        if (_parent.nodes === undefined) {
          _parent.nodes = [];
        }
        _parent.nodes.push(node);
      } else {
        bufArray.unshift(node);
      }
    },
    end: function end(tag) {
      // merge into parent tag
      var node = bufArray.shift();
      if (node.tag !== tag) {
        console.error('invalid state: mismatch end tag');
      }

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (customHandler.end) {
        customHandler.end(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (!parent.nodes) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    },
    chars: function chars(text) {
      if (!text.trim()) return;

      var node = {
        node: 'text',
        text: text
      };

      if (customHandler.chars) {
        customHandler.chars(node, results);
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        parent.nodes.push(node);
      }
    }
  });

  return results;
}

/* harmony default export */ __webpack_exports__["a"] = (html2json);

/***/ }),

/***/ 1141:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// HTML 支持的数学符号
function strNumDiscode(str) {
  str = str.replace(/&forall;/g, '∀');
  str = str.replace(/&part;/g, '∂');
  str = str.replace(/&exist;/g, '∃');
  str = str.replace(/&empty;/g, '∅');
  str = str.replace(/&nabla;/g, '∇');
  str = str.replace(/&isin;/g, '∈');
  str = str.replace(/&notin;/g, '∉');
  str = str.replace(/&ni;/g, '∋');
  str = str.replace(/&prod;/g, '∏');
  str = str.replace(/&sum;/g, '∑');
  str = str.replace(/&minus;/g, '−');
  str = str.replace(/&lowast;/g, '∗');
  str = str.replace(/&radic;/g, '√');
  str = str.replace(/&prop;/g, '∝');
  str = str.replace(/&infin;/g, '∞');
  str = str.replace(/&ang;/g, '∠');
  str = str.replace(/&and;/g, '∧');
  str = str.replace(/&or;/g, '∨');
  str = str.replace(/&cap;/g, '∩');
  str = str.replace(/&cup;/g, '∪');
  str = str.replace(/&int;/g, '∫');
  str = str.replace(/&there4;/g, '∴');
  str = str.replace(/&sim;/g, '∼');
  str = str.replace(/&cong;/g, '≅');
  str = str.replace(/&asymp;/g, '≈');
  str = str.replace(/&ne;/g, '≠');
  str = str.replace(/&le;/g, '≤');
  str = str.replace(/&ge;/g, '≥');
  str = str.replace(/&sub;/g, '⊂');
  str = str.replace(/&sup;/g, '⊃');
  str = str.replace(/&nsub;/g, '⊄');
  str = str.replace(/&sube;/g, '⊆');
  str = str.replace(/&supe;/g, '⊇');
  str = str.replace(/&oplus;/g, '⊕');
  str = str.replace(/&otimes;/g, '⊗');
  str = str.replace(/&perp;/g, '⊥');
  str = str.replace(/&sdot;/g, '⋅');
  return str;
}

// HTML 支持的希腊字母
function strGreeceDiscode(str) {
  str = str.replace(/&Alpha;/g, 'Α');
  str = str.replace(/&Beta;/g, 'Β');
  str = str.replace(/&Gamma;/g, 'Γ');
  str = str.replace(/&Delta;/g, 'Δ');
  str = str.replace(/&Epsilon;/g, 'Ε');
  str = str.replace(/&Zeta;/g, 'Ζ');
  str = str.replace(/&Eta;/g, 'Η');
  str = str.replace(/&Theta;/g, 'Θ');
  str = str.replace(/&Iota;/g, 'Ι');
  str = str.replace(/&Kappa;/g, 'Κ');
  str = str.replace(/&Lambda;/g, 'Λ');
  str = str.replace(/&Mu;/g, 'Μ');
  str = str.replace(/&Nu;/g, 'Ν');
  str = str.replace(/&Xi;/g, 'Ν');
  str = str.replace(/&Omicron;/g, 'Ο');
  str = str.replace(/&Pi;/g, 'Π');
  str = str.replace(/&Rho;/g, 'Ρ');
  str = str.replace(/&Sigma;/g, 'Σ');
  str = str.replace(/&Tau;/g, 'Τ');
  str = str.replace(/&Upsilon;/g, 'Υ');
  str = str.replace(/&Phi;/g, 'Φ');
  str = str.replace(/&Chi;/g, 'Χ');
  str = str.replace(/&Psi;/g, 'Ψ');
  str = str.replace(/&Omega;/g, 'Ω');

  str = str.replace(/&alpha;/g, 'α');
  str = str.replace(/&beta;/g, 'β');
  str = str.replace(/&gamma;/g, 'γ');
  str = str.replace(/&delta;/g, 'δ');
  str = str.replace(/&epsilon;/g, 'ε');
  str = str.replace(/&zeta;/g, 'ζ');
  str = str.replace(/&eta;/g, 'η');
  str = str.replace(/&theta;/g, 'θ');
  str = str.replace(/&iota;/g, 'ι');
  str = str.replace(/&kappa;/g, 'κ');
  str = str.replace(/&lambda;/g, 'λ');
  str = str.replace(/&mu;/g, 'μ');
  str = str.replace(/&nu;/g, 'ν');
  str = str.replace(/&xi;/g, 'ξ');
  str = str.replace(/&omicron;/g, 'ο');
  str = str.replace(/&pi;/g, 'π');
  str = str.replace(/&rho;/g, 'ρ');
  str = str.replace(/&sigmaf;/g, 'ς');
  str = str.replace(/&sigma;/g, 'σ');
  str = str.replace(/&tau;/g, 'τ');
  str = str.replace(/&upsilon;/g, 'υ');
  str = str.replace(/&phi;/g, 'φ');
  str = str.replace(/&chi;/g, 'χ');
  str = str.replace(/&psi;/g, 'ψ');
  str = str.replace(/&omega;/g, 'ω');
  str = str.replace(/&thetasym;/g, 'ϑ');
  str = str.replace(/&upsih;/g, 'ϒ');
  str = str.replace(/&piv;/g, 'ϖ');
  str = str.replace(/&middot;/g, '·');
  return str;
}

function strcharacterDiscode(str) {
  // 加入常用解析
  str = str.replace(/&nbsp;/g, ' ');
  str = str.replace(/&ensp;/g, ' ');
  str = str.replace(/&emsp;/g, '　');
  str = str.replace(/&quot;/g, "'");
  str = str.replace(/&amp;/g, '&');
  str = str.replace(/&lt;/g, '<');
  str = str.replace(/&gt;/g, '>');
  str = str.replace(/&#8226;/g, '•');

  return str;
}

// HTML 支持的其他实体
function strOtherDiscode(str) {
  str = str.replace(/&OElig;/g, 'Œ');
  str = str.replace(/&oelig;/g, 'œ');
  str = str.replace(/&Scaron;/g, 'Š');
  str = str.replace(/&scaron;/g, 'š');
  str = str.replace(/&Yuml;/g, 'Ÿ');
  str = str.replace(/&fnof;/g, 'ƒ');
  str = str.replace(/&circ;/g, 'ˆ');
  str = str.replace(/&tilde;/g, '˜');
  str = str.replace(/&ensp;/g, '');
  str = str.replace(/&emsp;/g, '');
  str = str.replace(/&thinsp;/g, '');
  str = str.replace(/&zwnj;/g, '');
  str = str.replace(/&zwj;/g, '');
  str = str.replace(/&lrm;/g, '');
  str = str.replace(/&rlm;/g, '');
  str = str.replace(/&ndash;/g, '–');
  str = str.replace(/&mdash;/g, '—');
  str = str.replace(/&lsquo;/g, '‘');
  str = str.replace(/&rsquo;/g, '’');
  str = str.replace(/&sbquo;/g, '‚');
  str = str.replace(/&ldquo;/g, '“');
  str = str.replace(/&rdquo;/g, '”');
  str = str.replace(/&bdquo;/g, '„');
  str = str.replace(/&dagger;/g, '†');
  str = str.replace(/&Dagger;/g, '‡');
  str = str.replace(/&bull;/g, '•');
  str = str.replace(/&hellip;/g, '…');
  str = str.replace(/&permil;/g, '‰');
  str = str.replace(/&prime;/g, '′');
  str = str.replace(/&Prime;/g, '″');
  str = str.replace(/&lsaquo;/g, '‹');
  str = str.replace(/&rsaquo;/g, '›');
  str = str.replace(/&oline;/g, '‾');
  str = str.replace(/&euro;/g, '€');
  str = str.replace(/&trade;/g, '™');

  str = str.replace(/&larr;/g, '←');
  str = str.replace(/&uarr;/g, '↑');
  str = str.replace(/&rarr;/g, '→');
  str = str.replace(/&darr;/g, '↓');
  str = str.replace(/&harr;/g, '↔');
  str = str.replace(/&crarr;/g, '↵');
  str = str.replace(/&lceil;/g, '⌈');
  str = str.replace(/&rceil;/g, '⌉');

  str = str.replace(/&lfloor;/g, '⌊');
  str = str.replace(/&rfloor;/g, '⌋');
  str = str.replace(/&loz;/g, '◊');
  str = str.replace(/&spades;/g, '♠');
  str = str.replace(/&clubs;/g, '♣');
  str = str.replace(/&hearts;/g, '♥');

  str = str.replace(/&diams;/g, '♦');
  str = str.replace(/&#39;/g, "'");
  return str;
}

function strDiscode(str) {
  str = strNumDiscode(str);
  str = strGreeceDiscode(str);
  str = strcharacterDiscode(str);
  str = strOtherDiscode(str);
  return str;
}

function urlToHttpUrl(url, domain) {
  if (/^\/\//.test(url)) {
    return 'https:' + url;
  } else if (/^\//.test(url)) {
    return 'https://' + domain + url;
  }
  return url;
}

/* harmony default export */ __webpack_exports__["a"] = ({
  strDiscode: strDiscode,
  urlToHttpUrl: urlToHttpUrl
});

/***/ }),

/***/ 1142:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *
 * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
 *
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */
// Regular Expressions for parsing tags and attributes

var startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z0-9_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
var endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
var attr = /([a-zA-Z0-9_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

function makeMap(str) {
  var obj = {};
  var items = str.split(',');
  for (var i = 0; i < items.length; i += 1) {
    obj[items[i]] = true;
  }return obj;
}

// Empty Elements - HTML 5
var empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');

// Block Elements - HTML 5
var block = makeMap('address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
var inline = makeMap('a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

// Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');

function HTMLParser(html, handler) {
  var index = void 0;
  var chars = void 0;
  var match = void 0;
  var last = html;
  var stack = [];

  stack.last = function () {
    return stack[stack.length - 1];
  };

  function parseEndTag(tag, tagName) {
    // If no tag name is provided, clean shop
    var pos = void 0;
    if (!tagName) {
      pos = 0;
    } else {
      // Find the closest opened tag of the same type
      tagName = tagName.toLowerCase();
      for (pos = stack.length - 1; pos >= 0; pos -= 1) {
        if (stack[pos] === tagName) break;
      }
    }
    if (pos >= 0) {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i -= 1) {
        if (handler.end) handler.end(stack[i]);
      }

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();

    if (block[tagName]) {
      while (stack.last() && inline[stack.last()]) {
        parseEndTag('', stack.last());
      }
    }

    if (closeSelf[tagName] && stack.last() === tagName) {
      parseEndTag('', tagName);
    }

    unary = empty[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      var attrs = [];

      rest.replace(attr, function genAttr(matches, name) {
        var value = arguments[2] || arguments[3] || arguments[4] || (fillAttrs[name] ? name : '');

        attrs.push({
          name: name,
          value: value,
          escaped: value.replace(/(^|[^\\])"/g, '$1\\"') // "
        });
      });

      if (handler.start) {
        handler.start(tagName, attrs, unary);
      }
    }
  }

  while (html) {
    chars = true;

    if (html.indexOf('</') === 0) {
      match = html.match(endTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(endTag, parseEndTag);
        chars = false;
      }

      // start tag
    } else if (html.indexOf('<') === 0) {
      match = html.match(startTag);

      if (match) {
        html = html.substring(match[0].length);
        match[0].replace(startTag, parseStartTag);
        chars = false;
      }
    }

    if (chars) {
      index = html.indexOf('<');
      var text = '';
      while (index === 0) {
        text += '<';
        html = html.substring(1);
        index = html.indexOf('<');
      }
      text += index < 0 ? html : html.substring(0, index);
      html = index < 0 ? '' : html.substring(index);

      if (handler.chars) handler.chars(text);
    }

    if (html === last) throw new Error('Parse Error: ' + html);
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();
}

/* harmony default export */ __webpack_exports__["a"] = (HTMLParser);

/***/ }),

/***/ 1143:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_jkParseVideo_vue__ = __webpack_require__(1145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0723dee8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_jkParseVideo_vue__ = __webpack_require__(1146);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1144)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_jkParseVideo_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0723dee8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_jkParseVideo_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/wxParse/components/jkParseVideo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] jkParseVideo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0723dee8", Component.options)
  } else {
    hotAPI.reload("data-v-0723dee8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1144:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1145:
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


/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'wxParseVideo',
  data: function data() {
    return {
      platform: "",
      videoId: '' // 给视频增加id 属性，为了解决视频自动播放的问题
    };
  },
  onLoad: function onLoad() {
    this.platform = "";
    this.getPlatForm();
    // console.log(`videoTag${this.videoNum}`);
    this.videoId = 'videoTag' + this.videoNum;
    this.setVideoNum();
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["c" /* mapActions */])(['setVideoNum']), {
    getPlatForm: function getPlatForm() {
      var that = this;
      wx.getSystemInfo({
        success: function success(res) {
          if (res.platform == "ios") {
            that.platform = "ios";
          }
        },
        fail: function fail(err) {
          that.platform = "ios";
        }
      });
    },
    videoPlay: function videoPlay() {
      var _url = '/packageA/videoPlayer/videoPlayer?videoUrl=' + encodeURIComponent(this.item.content);
      wx.navigateTo({
        url: _url
      });
    }
  }),
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_1_vuex__["f" /* mapState */])(['videoNum'])),
  props: {
    item: {}
  }
});

/***/ }),

/***/ 1146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('view', {
    staticClass: "videoStyleOrder",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.videoPlay()
      }
    }
  }, [_c('img', {
    staticClass: "_video videoPlayBox video-video video",
    attrs: {
      "src": _vm.item.poster,
      "mode": "aspectFit",
      "alt": ""
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "videoPlayBtn",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/img00/healthKnowledge/play_big.png",
      "alt": ""
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0723dee8", esExports)
  }
}

/***/ }),

/***/ 1147:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.loading) ? _c('div', {
    staticClass: "wxParse",
    class: _vm.className
  }, _vm._l((_vm.dataArr), function(item, index) {
    return _c('section', {
      key: index
    }, [(item.type == 'text') ? _c('p', {
      staticClass: "p"
    }, [_vm._v(_vm._s(item.content))]) : _vm._e(), _vm._v(" "), (item.type == 'img') ? _c('img', {
      staticClass: "img image",
      attrs: {
        "lazy-load": _vm.lazyLoad,
        "mode": "widthFix",
        "src": item.content,
        "alt": "",
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.preview(item.content, $event)
        }
      }
    }) : _vm._e(), _vm._v(" "), (item.type == 'video') ? _c('jk-video', {
      attrs: {
        "item": item,
        "mpcomid": '0-' + index
      }
    }) : _vm._e(), _vm._v(" "), (item.type == 'br') ? _c('text', [_vm._v("\\n")]) : _vm._e()], 1)
  })) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-19904a7c", esExports)
  }
}

/***/ }),

/***/ 1148:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "ji_main"
  }, [(_vm.clipFlag) ? _c('div', {
    staticStyle: {
      "position": "absolute",
      "z-index": "-1",
      "opacity": "0",
      "visibility": "hidden",
      "bottom": "0",
      "right": "0"
    }
  }, [_c('canvas', {
    staticClass: "getCircleImage",
    attrs: {
      "canvasId": "getCircleImage"
    }
  })]) : _vm._e(), _vm._v(" "), _c('form', {
    attrs: {
      "action": "",
      "eventid": '2'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.journalData.fullName) ? _c('button', {
    staticClass: "doctorInfo content clearButtonStyle",
    attrs: {
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '0'
    },
    on: {
      "getuserinfo": _vm.getUserInfo
    }
  }, [_c('section', {
    staticClass: "clearButtonStyle"
  }, [_c('figure', {
    staticClass: "logoUrl"
  }, [_c('img', {
    attrs: {
      "src": _vm.journalData.customerLogo ? _vm.journalData.customerLogo : 'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "message"
  }, [_c('span', {
    staticClass: "doctorName"
  }, [_vm._v("主刀:" + _vm._s(_vm.journalData.fullNameShow))]), _vm._v(" "), _c('span', {
    staticClass: "doctorLevel"
  }, [_vm._v(_vm._s(_vm.journalData.medicalTitle))]), _vm._v(" "), _c('p', {
    staticClass: "hospital"
  }, [_vm._v(_vm._s(_vm.journalData.company))])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "ji-consultDoc"
  }, [_vm._v("咨询医生")])], 1) : _vm._e(), _vm._v(" "), (_vm.journalData.fullName) ? _c('button', {
    staticClass: "doctorFixed",
    class: {
      'show': _vm.fixedShow
    },
    attrs: {
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '1'
    },
    on: {
      "getuserinfo": _vm.getUserInfo
    }
  }, [_c('section', {
    staticClass: "doctorBox"
  }, [_c('img', {
    staticClass: "doctorFixedLogo",
    attrs: {
      "src": _vm.journalData.customerLogo ? _vm.journalData.customerLogo : 'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "doctorFixedName"
  }, [_vm._v("主刀：" + _vm._s(_vm.journalData.fullNameShow))]), _vm._v(" "), _c('span', {
    staticClass: "doctorFixedOther"
  }, [_vm._v(_vm._s(_vm.journalData.medicalTitle) + " " + _vm._s(_vm.journalData.company))])])], 1) : _vm._e()], 1), _vm._v(" "), _c('header', {
    staticClass: "ji_title"
  }, [_vm._v(_vm._s(_vm.journalData.diaryName))]), _vm._v(" "), _c('section', {
    staticClass: "ji_updateTime"
  }, [_c('section', {
    staticClass: "ji_patientInfo"
  }, [(_vm.journalData.authorLogoUrl) ? _c('img', {
    staticClass: "patientLogo",
    attrs: {
      "src": _vm.journalData.authorLogoUrl,
      "alt": ""
    }
  }) : _vm._e(), _vm._v(" "), (_vm.journalData.authorName) ? _c('span', {
    staticClass: "patientName"
  }, [_vm._v(_vm._s(_vm.journalData.authorNameShow))]) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "patientAge"
  }, [_vm._v(_vm._s((_vm.journalData.patientSex == 1 ? '男' : '') || (_vm.journalData.patientSex == 2 ? '女' : '')) + " " + _vm._s(_vm.journalData.patientAgeShow))])]), _vm._v(" "), (_vm.journalData.updateTime.length) ? _c('p', {
    staticClass: "updateTime"
  }, [_vm._v("更新于: " + _vm._s(_vm.journalData.updateTime))]) : _vm._e()], 1), _vm._v(" "), (_vm.journalData.audioMap && _vm.journalData.audioMap.attUrl) ? _c('backgroundMusic', {
    attrs: {
      "audioMap": _vm.journalData.audioMap,
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.journalData.diaryContent && _vm.journalData.diaryContent.length && _vm.parseShow) ? _c('section', {
    staticClass: "ji_patientDes-box"
  }, [_c('jkParse', {
    attrs: {
      "className": "ji_patientDes",
      "content": _vm.journalData.diaryContent,
      "mpcomid": '1'
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('footer', {
    staticClass: "ji_bottomMsg"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '4'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "addJournal",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '3'
    },
    on: {
      "getuserinfo": _vm.goPersonal
    }
  }, [_c('img', {
    staticClass: "addIcon",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/write.png"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "addText"
  }, [_vm._v("我也要写")])])], 1), _vm._v(" "), (_vm.journalData.browseNum > 0) ? _c('div', {
    staticClass: "ji_browseNum"
  }, [_vm._v(_vm._s(_vm.journalData.browseNumShow) + "浏览")]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "LikeSection"
  }, [_c('section', {
    staticClass: "like",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": _vm.clickShareButton
    }
  }, [_c('h1', {
    class: {
      'popup': _vm.popup
    }
  }, [_vm._v(_vm._s(_vm.count) + "鼓励")]), _vm._v(" "), _c('img', {
    staticClass: "likeIcon",
    class: {
      'shacking': _vm.shack
    },
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.2/like.png"
    }
  }), _vm._v(" "), (_vm.recentLikeNum != 0 && _vm.recentLikeNum < 100000) ? _c('p', [_vm._v(_vm._s(_vm.recentLikeNum))]) : _vm._e(), _vm._v(" "), (_vm.recentLikeNum != 0 && _vm.recentLikeNum >= 100000) ? _c('p', [_vm._v("10万+")]) : _vm._e()], 1), _vm._v(" "), _c('p', [_vm._v("康复不易，点赞鼓励~")])], 1), _vm._v(" "), (_vm.countPages.length == 1) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '2'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-97401d1c", esExports)
  }
}

/***/ }),

/***/ 1149:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_drawShareImage_vue__ = __webpack_require__(1151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_55dc42c3_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_drawShareImage_vue__ = __webpack_require__(1159);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1150)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_drawShareImage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_55dc42c3_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_drawShareImage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/drawShareImage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] drawShareImage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-55dc42c3", Component.options)
  } else {
    hotAPI.reload("data-v-55dc42c3", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1150:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1151:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_canvasCreator_canvasCreator2__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);
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
//


/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/10/31.
 */






var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_4_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      ensureShow: false,
      params: {},
      showFlag: false,
      shareImg: "",
      fromSetting: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      }
    };
  },
  onShow: function onShow() {
    // this.ensureShow = false,
    this.setEnsureShow(false);
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapActions(['showToast']), mapMutations(['setCanvasShow', 'setEnsureShow']), {
    closeCanvas: function closeCanvas() {
      console.log('close');
      console.log(this.fromSetting);
      if (!this.fromSetting) {
        this.setCanvasShow(false);
        this.shareImg = "";
      }
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.errMsg === "openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']) {
        this.ensureShow = false;
        this.saveImage();
      } else {
        this.setCanvasShow(true);
        this.ensureShow = false;
        this.fromSetting = false;
      }
    },
    onCreateSuccess: function onCreateSuccess(e) {
      wx.hideLoading();
      this.shareImg = e;
    },
    saveImagePhoto: function saveImagePhoto() {
      var _this = this;
      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            //授权成功
            _this.saveImage();
          } else {
            //授权失败
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function success(res) {
                //写入成功
                _this.saveImage();
              },
              fail: function fail(err) {
                //写入失败
                _this.ensureShow = true;
                _this.fromSetting = true;
                wx.showToast({
                  title: '微信授权失败，请重试',
                  icon: 'none'
                });
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
    saveImage: function saveImage() {
      var _this2 = this;

      this.fromSetting = false;
      __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].createTrack({
        actionId: 14197
      });
      wx.saveImageToPhotosAlbum({
        filePath: this.shareImg,
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
              console.log(res);
              if (res.authSetting['scope.writePhotosAlbum']) {
                _this2.saveImage();
                _this2.fromSetting = false;
              } else {
                _this2.ensureShow = true;
                _this2.fromSetting = true;
              }
            },
            fail: function fail(err) {
              console.log(err);
            }
          });
        }
      });
    },
    getCanvasMessage: function getCanvasMessage() {
      var _this3 = this;

      if (!this.journalMessage.fullName) {
        this.params = {
          width: 700,
          height: 800,
          backgroundColor: '#A3B4D1',
          debug: false,
          texts: [{
            x: 120,
            y: 130,
            baseLine: 'middle',
            text: '手术康复日记',
            fontSize: 30,
            color: '#FFFDFA'
          }, {
            x: 80,
            y: 210,
            baseLine: 'middle',
            text: this.journalMessage.diaryName ? this.journalMessage.diaryName : ' ',
            lineNum: 2,
            fontSize: 36,
            width: 550,
            color: 'white',
            lineHeight: 48
          }, {
            x: 80,
            y: 350,
            baseLine: 'middle',
            text: this.journalMessage.content ? this.journalMessage.content : ' ',
            lineNum: 3,
            fontSize: 26,
            width: 530,
            color: '#808080',
            lineHeight: 33
          }, {
            x: 80,
            y: 480,
            baseLine: 'middle',
            text: '我正在阅读这篇文章',
            fontSize: 28,
            color: '#08B6AD'
          }, {
            x: 220,
            y: 620,
            baseLine: 'middle',
            text: '长按小程序码查看详情',
            fontSize: 24,
            color: '#888888'
          }, {
            x: 220,
            y: 650,
            baseLine: 'middle',
            text: '分享自 「 唯医骨科 」',
            fontSize: 24,
            color: '#888888'
          }],
          images: [{
            width: 700,
            height: 765,
            x: 0,
            y: 20,
            url: 'https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_haibao_sm.png',
            zIndex: 0
          }, {
            width: 130,
            height: 130,
            x: 80,
            y: 580,
            url: this.journalMessage.qrCode,
            zIndex: 1
          }]
        };
      } else this.params = {
        width: 696,
        height: 948,
        backgroundColor: '#A3B4D1',
        debug: false,
        texts: [{
          x: 120,
          y: 110,
          baseLine: 'middle',
          text: '手术康复日记',
          fontSize: 30,
          color: '#FFFDFA'
        }, {
          x: 80,
          y: 180,
          baseLine: 'middle',
          text: this.journalMessage.diaryName ? this.journalMessage.diaryName : ' ',
          lineNum: 2,
          fontSize: 36,
          width: 550,
          color: 'white',
          lineHeight: 48
        }, {
          x: 80,
          y: 340,
          baseLine: 'middle',
          text: this.journalMessage.content ? this.journalMessage.content : ' ',
          lineNum: 3,
          fontSize: 26,
          width: 530,
          color: '#808080',
          zIndex: 1,
          lineHeight: 33
        }, {
          x: 80,
          y: 480,
          baseLine: 'middle',
          text: '我正在阅读这篇文章',
          fontSize: 28,
          color: '#08B6AD',
          zIndex: 1
        }, {
          x: 210,
          y: 590,
          text: '主诊医师:',
          fontSize: 32,
          color: 'black'
        }, {
          x: 360,
          y: 590,
          text: this.journalMessage.fullName ? this.journalMessage.fullName : ' ',
          fontSize: 32,
          color: 'black',
          width: 280
        }, {
          x: 210,
          y: 635,
          // text: '长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情长按小程序码查看详情',
          text: this.journalMessage.medicalTitle + ' ' + this.journalMessage.company,
          fontSize: 30,
          color: '#888888',
          width: 400
        }, {
          x: 230,
          y: 780,
          baseLine: 'middle',
          text: '长按小程序码查看详情',
          fontSize: 30,
          color: '#888888',
          zIndex: 1
        }, {
          x: 230,
          y: 830,
          baseLine: 'middle',
          text: '分享自 「 唯医骨科 」',
          fontSize: 30,
          color: '#888888',
          zIndex: 1
        }],
        images: [{
          width: 696,
          height: 948,
          x: 0,
          y: 0,
          url: 'https://m.allinmed.cn/static/image/mp/index/1.1.2/bg_haibao.png',
          zIndex: 0,
          backgroundColor: '#A3B4D1'
        }, {
          width: 100,
          height: 100,
          x: 90,
          y: 550,
          url: this.journalMessage.customerLogo ? this.journalMessage.customerLogo : 'https://img05.allinmd.cn/public1/M01/1B/F4/wKgBL1uYuT6ATsTaAACLw8VTixw111_c_p_100_100.JPG',
          circle: 1,
          zIndex: 1
        }, {
          width: 130,
          height: 130,
          x: 80,
          y: 745,
          url: this.journalMessage.qrCode ? this.journalMessage.qrCode : " ",
          zIndex: 1
        }]
      };
      this.showFlag = true;
      console.log('showFlag is ' + this.showFlag);
      this.$nextTick(function () {
        _this3.$refs.canvas.onCreate();
      });
    }
  }),
  mounted: function mounted() {
    this.getCanvasMessage();
  },

  props: {},
  components: {
    CanvasCreator: __WEBPACK_IMPORTED_MODULE_1_components_canvasCreator_canvasCreator2__["a" /* default */],
    EnsureConfirm: __WEBPACK_IMPORTED_MODULE_2_components_ensure__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['journalMessage', 'systemInfo']))
});

/***/ }),

/***/ 1159:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "shareCanvasMask",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": _vm.closeCanvas
    }
  }, [_c('article', {
    staticClass: "main",
    class: {
      'longer': _vm.journalMessage.fullName
    },
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
      }
    }
  }, [(_vm.showFlag && _vm.shareImg.length == 0) ? _c('CanvasCreator', {
    ref: "canvas",
    attrs: {
      "params": _vm.params,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "success": _vm.onCreateSuccess
    }
  }) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "main-header",
    class: {
      'longer': _vm.journalMessage.fullName
    }
  }, [_vm._v(_vm._s(_vm.journalMessage.diaryName))]), _vm._v(" "), _c('div', {
    staticClass: "main-content",
    class: {
      'longer': _vm.journalMessage.fullName
    }
  }, [_vm._v(_vm._s(_vm.journalMessage.content))]), _vm._v(" "), _c('p', {
    staticClass: "reading",
    class: {
      'longer': _vm.journalMessage.fullName
    }
  }, [_vm._v("我正在阅读这篇文章")]), _vm._v(" "), (_vm.journalMessage.fullName) ? _c('div', {
    staticClass: "main-doctor"
  }, [_c('img', {
    attrs: {
      "src": _vm.journalMessage.customerLogo
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "doctorName"
  }, [_vm._v("主诊医生: " + _vm._s(_vm.journalMessage.fullName))]), _vm._v(" "), _c('div', {
    staticClass: "doctorTitle"
  }, [_vm._v(_vm._s(_vm.journalMessage.medicalTitle) + " " + _vm._s(_vm.journalMessage.company))])]) : _vm._e(), _vm._v(" "), _c('div', {
    staticClass: "main-QrCode",
    class: {
      'longer': _vm.journalMessage.fullName
    }
  }, [_c('img', {
    attrs: {
      "src": _vm.journalMessage.qrCode
    }
  }), _vm._v(" "), _c('p', [_vm._v("长按小程序码查看详情"), _c('br'), _vm._v("分享自 「 唯医骨科 」")], 1)], 1), _vm._v(" "), _c('figure', {
    staticClass: "close-btn",
    class: {
      'longer': _vm.journalMessage.fullName
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.setCanvasShow(false)
      }
    }
  }, [_c('img', {
    attrs: {
      "src": "/static/image/canvasClose.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "saveQrCode",
    class: {
      'longer': _vm.journalMessage.fullName
    },
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.saveImagePhoto($event)
      }
    }
  }, [_c('p', [_vm._v("保存图片")]), _vm._v(" "), _c('span', [_vm._v("点击按钮，图片将自动保存至手机相册")])], 1)], 1), _vm._v(" "), _c('p', {
    staticStyle: {
      "display": "inline-block"
    }
  }, [(_vm.ensureShow) ? _c('EnsureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '4',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-55dc42c3", esExports)
  }
}

/***/ }),

/***/ 1160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentLoading_vue__ = __webpack_require__(1162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1e164d00_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentLoading_vue__ = __webpack_require__(1163);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1161)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_commentLoading_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1e164d00_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_commentLoading_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journalDetail/components/commentLoading.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] commentLoading.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1e164d00", Component.options)
  } else {
    hotAPI.reload("data-v-1e164d00", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1161:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1162:
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

/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/8/14.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  name: "comment-loading",
  data: function data() {
    return {};
  },

  methods: {},
  mounted: function mounted() {},

  computed: {},
  props: {
    param: {
      type: Object,
      default: {}
    }
  }
});

/***/ }),

/***/ 1163:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "comment-loading-container"
  }, [_c('section', {
    staticClass: "comment-loading"
  }, [_c('figure', {
    staticClass: "comment-loading-content"
  }, [_c('img', {
    class: {
      'rotate': _vm.param.type === 'rotate'
    },
    attrs: {
      "src": _vm.param.icon,
      "alt": ""
    }
  }), _vm._v(" "), _c('p', [_vm._v(_vm._s(_vm.param.content))])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1e164d00", esExports)
  }
}

/***/ }),

/***/ 1164:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: _vm.model
  }, [_c('section', {
    staticClass: "journal-container",
    attrs: {
      "id": "journal-container"
    }
  }, [_c('section', {
    staticClass: "query-helper",
    attrs: {
      "id": "queryHelper"
    }
  }, [_c('JournalInfo', {
    attrs: {
      "mpcomid": '0'
    }
  }), _vm._v(" "), _c('Recommend', {
    attrs: {
      "mpcomid": '1'
    }
  })], 1), _vm._v(" "), _c('GcList', {
    attrs: {
      "mpcomid": '2'
    }
  }), _vm._v(" "), _c('BottomBar', {
    attrs: {
      "mpcomid": '3'
    }
  }), _vm._v(" "), (_vm.toastShow) ? _c('Toast', {
    attrs: {
      "content": _vm.toastTips,
      "mpcomid": '4'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.commentLoadingParam.show) ? _c('CommentLoading', {
    attrs: {
      "param": {
        type: _vm.commentLoadingParam.type,
        icon: _vm.commentLoadingParam.icon,
        content: _vm.commentLoadingParam.content
      },
      "mpcomid": '5'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "type": _vm.loadingType,
      "mpcomid": '6'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.deleteShowFlag) ? _c('Confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '确定',
        'cancel': '取消',
        'title': '您确定要删除该回复吗？'
      },
      "eventid": '0',
      "mpcomid": '7'
    },
    on: {
      "cancelClickEvent": _vm.deleteCancel,
      "ensureClickEvent": _vm.deleteCommentItem
    }
  }) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('EnsureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '1',
      "mpcomid": '8'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e()], 1), _vm._v(" "), (_vm.canvasShow) ? _c('DrawShareImage', {
    attrs: {
      "mpcomid": '9'
    }
  }) : _vm._e(), _vm._v(" "), _c('CommentWindow', {
    attrs: {
      "mpcomid": '10'
    }
  }), _vm._v(" "), _c('ShareBox', {
    attrs: {
      "mpcomid": '11'
    }
  }), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '12'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1043eb72", esExports)
  }
}

/***/ })

},[1308]);