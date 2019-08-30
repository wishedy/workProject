global.webpackJsonp([30],{

/***/ 411:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_listResult_vue__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2fdfae74_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_listResult_vue__ = __webpack_require__(414);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(412)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2fdfae74"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_listResult_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2fdfae74_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_listResult_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/listResult/listResult.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] listResult.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2fdfae74", Component.options)
  } else {
    hotAPI.reload("data-v-2fdfae74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 412:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_filterBuilder___ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_doctorItem__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_getAreaList__ = __webpack_require__(81);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getMajorTitleList__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getMajorList__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getHotWord__ = __webpack_require__(84);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getDoctorFilterList__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_common_js_auth_checkLogin__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_HttpRequest_createHistoryRecord__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_dataLog__ = __webpack_require__(7);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc：医生搜寻术
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by YuxiYang on 2018/3/26.
 */














/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      extraShow: false, //最下面那个加载中/到底了
      toBottom: false, //上拉显示更多时的判断
      counter: 0,
      selectItem1: -2,
      hotWord: [],
      loadingFlag: false, //true的话会禁止一切点击事件
      doctorCustomerId: '',
      indexShow: true, //主页面
      noResult: false, //无结果的提示
      searchVal: '', //显示在输入框里的文字
      organizationNavs: [], //传数据到医生名片
      historyInfo: [],
      finish: false, //用来判断loading
      areaList: [],
      majorList: [],
      majorTitleList: [],
      maskerShow: false,
      allReady: false,
      doctorList: [],
      selectedFilterIndex: -1,
      errorShow: false,
      errorMsg: '',
      confirmShow: false,
      allMsgGot: false,
      page: 0,
      clickLimit: true,
      currentLocation: '',
      defaultTitle: {
        title: "",
        index: -1
      },
      defaultMajor: {
        title: "全部专科",
        index: -1
      },
      defaultArea: {
        title: "全国",
        index: -1
      },
      HttpParams: {
        firstResult: 0,
        maxResult: 20,
        logoUseFlag: 3,
        indexType: "customer",
        solrContent: "", //搜索关键字
        searchSortType: 1, //综合排序 1综合2从低到高
        areasExpertise: "", //专业
        searchRegion: "", //地区
        searchHospitalLevel: "", //医院级别
        searchTitleLevel: "" //职称级别
      }
    };
  },

  filters: {},
  components: {
    FilterBuilder: __WEBPACK_IMPORTED_MODULE_2_components_filterBuilder___["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_4_components_loading__["a" /* default */],
    toast: __WEBPACK_IMPORTED_MODULE_10__components_toast__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_11_components_confirm__["a" /* default */],
    CheckLogin: __WEBPACK_IMPORTED_MODULE_12_common_js_auth_checkLogin__["a" /* default */],
    DoctorItem: __WEBPACK_IMPORTED_MODULE_3_components_doctorItem__["a" /* default */]
  },
  watch: {
    value: function value(newVal) {
      this.inputValue = newVal;
    },
    inputValue: function inputValue(newVal) {
      this.$emit('input', newVal);
    }
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_14_dataLog__["a" /* default */].enterBrowse();
    wx.setNavigationBarTitle({
      title: '找名医'
    });
    this.HttpParams.firstResult = 0;
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_14_dataLog__["a" /* default */].leaveBrowse();
  },
  mounted: function mounted() {
    var query = this.$root.$mp.query;
    this.doctorList = [];
    this.HttpParams.solrContent = query.searchItem ? query.searchItem : '';
    this.searchVal = query.searchItem ? query.searchItem : '';
    this.getDoctorList();
  },

  methods: {
    trackCallback: function trackCallback(obj) {
      __WEBPACK_IMPORTED_MODULE_14_dataLog__["a" /* default */].createTrack({
        actionId: 14142,
        pushMessageId: obj.item.diaryId ? obj.item.diaryId : obj.item.customerId,
        keyword: obj.item.diaryName ? obj.item.diaryName : obj.item.fullName,
        locationId: obj.index
      });
    },
    loadMore: function loadMore() {
      var _this = this;

      if (!this.allMsgGot) {
        clearTimeout(this.debounce);
        this.debounce = setTimeout(function () {
          _this.page += 1;
          _this.HttpParams.firstResult = _this.page * _this.HttpParams.maxResult;
          _this.getDoctorList();
        }, 100);
      }
    },
    getErrMsg: function getErrMsg(data) {
      var _this2 = this;

      this.errorMsg = data.msg;
      this.errorShow = data.state;
      setTimeout(function () {
        _this2.errorShow = false;
      }, 2000);
    },
    cleanContent: function cleanContent() {
      this.searchVal = '';
      this.selectItem1 = -1;
    },
    cancelEvent: function cancelEvent() {
      this.confirmShow = false;
    },
    ensureEvent: function ensureEvent() {
      var _this3 = this;

      this.confirmShow = false;
      deleteHistoryRecord().then(function (res) {
        if (res && res.responseObject.responseStatus) {
          _this3.historyInfo = [];
        }
      });
    },

    //获取过滤后的医生数据

    getDoctorList: function getDoctorList() {
      var _this4 = this;

      if (this.toBottom) {
        this.finish = true;
      }
      this.allMsgGot = false;
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getDoctorFilterList__["a" /* default */])(this.HttpParams).then(function (data) {
        _this4.extraShow = true;
        if (data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          _this4.finish = false;
          if (dataList && dataList.length !== 0) {
            dataList.forEach(function (element) {
              _this4.doctorList.push(element);
              _this4.loadingFlag = true;
            });
            _this4.noResult = false;
          } else {
            _this4.toBottom = true;
            if (_this4.page === 0) {
              _this4.noResult = true;
            } else {
              _this4.allMsgGot = true;
            }
          }
        } else {
          _this4.errorMsg = '当前网络不可用，请检查网络设置';
          _this4.errorShow = true;
          setTimeout(function () {
            _this4.finish = false;
            _this4.errorShow = false;
          }, 2000);
        }
      }).catch(function () {
        _this4.finish = false;
      });
    },
    getSearchResult: function getSearchResult() {
      var _this5 = this;

      this.loadingFlag = true;
      this.indexShow = true;
      if (this.searchVal.length > 0) {
        if (this.clickLimit) {
          this.clickLimit = false;
          this.HttpParams.firstResult = 0;
          this.page = 0;
          this.doctorList = [];
          this.$set(this.HttpParams, "solrContent", this.searchVal);
          this.createHistoryRecord();
          this.getDoctorList();
          this.HttpParams.firstResult += this.HttpParams.maxResult;
          setTimeout(function () {
            _this5.clickLimit = true;
          }, 1000);
        }
      } else {
        this.errorMsg = '请输入关键词';
        this.errorShow = true;
        setTimeout(function () {
          _this5.errorShow = false;
        }, 2000);
      }
    },
    getSelectFilter: function getSelectFilter(filter) {
      // document.body.style.position = 'inherit'
      this.loadingFlag = true;
      this.HttpParams.firstResult = 0;
      this.finish = true;
      switch (filter.type) {
        case "major":
          if (filter.item.tagName === "全部专科") {
            this.HttpParams.areasExpertise = "";
          } else {
            this.HttpParams.areasExpertise = filter.item.tagName.includes("&") ? filter.item.tagName.replace("&", ",") : filter.item.tagName;
          }
          this.finish = false;
          break;
        case "area":
          if (filter.item.regionName === "全国") {
            this.HttpParams.searchRegion = "";
          } else {
            this.HttpParams.searchRegion = filter.item.regionName;
          }
          this.finish = false;
          break;
        case "sort":
          this.HttpParams.searchSortType = filter.item.sortType;
          this.finish = false;
          break;
        case "hospital":
          this.HttpParams.searchHospitalLevel = filter.item.hospitalLevel;
          this.HttpParams.searchTitleLevel = filter.item.majorTitle;
          this.finish = false;
          break;
        default:
          break;
      }
      this.doctorList = [];
      this.page = 0;
      this.getDoctorList();
      this.HttpParams.firstResult = 0;
    },
    maskerClickCb: function maskerClickCb() {
      this.maskerShow = false;
    },

    //获取筛选数据，传递至js文件
    getFilterCondition: function getFilterCondition() {
      var _this6 = this;

      __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a.all([Object(__WEBPACK_IMPORTED_MODULE_7_common_js_HttpRequest_getMajorList__["a" /* default */])({
        treeLevel: 2,
        firstResult: 0,
        maxResult: 9999
      }), Object(__WEBPACK_IMPORTED_MODULE_5_common_js_HttpRequest_getAreaList__["a" /* default */])({
        parentId: "",
        level: 2
      }), Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getMajorTitleList__["a" /* default */])({
        typeId: 1,
        firstResult: 0,
        maxResult: 999
      })]).then(function (allData) {
        // console.log(allData)
        allData.forEach(function (element, index) {
          if (element.responseObject.responseData) {
            var data = element.responseObject.responseData;
            switch (index) {
              case 0:
                //专科
                _this6.majorList = data.data_list;
                _this6.majorList.unshift({
                  tagName: "全部专科",
                  type: "default"
                });
                break;
              case 1:
                //地区
                _this6.areaList = data.dataList;
                _this6.areaList.unshift({
                  regionName: "全国",
                  type: "default"
                });
                break;
              default:
                break;
            }
          }
        });
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getHotWord__["a" /* default */])().then(function (data) {
          var dataList = data.responseObject.responseData.dataList;
          _this6.hotWord = dataList.split(",");
        });
      });
    },
    filterShowCallback: function filterShowCallback(index) {
      this.selectedFilterIndex = index;
    },

    //搜索历史记录处理
    createHistoryRecord: function createHistoryRecord() {
      var _this7 = this;

      Object(__WEBPACK_IMPORTED_MODULE_13_common_js_HttpRequest_createHistoryRecord__["a" /* default */])({
        searchType: "1",
        keyWord: this.searchVal,
        siteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (res) {
        if (res && res.responseObject.responseStatus) {
          console.log("创建历史记录成功");
        }
      }).catch(function (err) {
        _this7.finish = false;
      });
    }
  }
});

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main",
    staticStyle: {
      "height": "100vh",
      "overflow": "hidden"
    }
  }, [_c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '0'
    }
  }, [(_vm.maskerShow) ? _c('section', {
    staticClass: "masker",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.maskerClickCb($event)
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "header"
  }, [_c('section', {
    staticClass: "input-box"
  }, [_c('div', {
    staticClass: "sd_searchGroup",
    attrs: {
      "data-alcode-mod": "759"
    }
  }, [_c('img', {
    staticClass: "search-icon",
    class: {
      'change': !_vm.indexShow
    },
    attrs: {
      "src": "https://m.allinmed.cn/static/image/img00/DrList/search.png"
    }
  }), _vm._v(" "), _c('input', {
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
      "data-alcode": "e174",
      "type": "text",
      "placeholder": "输入医院、医生、疾病关键词搜索",
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
  }), _vm._v(" "), (_vm.searchVal.length > 0) ? _c('img', {
    staticClass: "sd_delete_icon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/delet.png",
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.cleanContent($event)
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "sd_searchBtn",
    attrs: {
      "data-alcode": "e175",
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.getSearchResult(1)
      }
    }
  }, [_vm._v("搜索")])]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '2'
    }
  }, [(_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '1'
    }
  }) : _vm._e()], 1)], 1)], 1), _vm._v(" "), (_vm.indexShow) ? _c('scroll-view', {
    staticClass: "main-inner1",
    attrs: {
      "scroll-y": "true",
      "eventid": '5'
    },
    on: {
      "scrolltolower": _vm.loadMore
    }
  }, [_c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.noResult && _vm.indexShow),
      expression: "noResult&&indexShow"
    }],
    staticClass: "noResult-img",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png"
    }
  }), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.noResult && _vm.indexShow),
      expression: "noResult&&indexShow"
    }],
    staticClass: "Noresult"
  }, [_vm._v("未找到符合条件的结果")]), _vm._v(" "), _c('DoctorItem', {
    attrs: {
      "organization": _vm.doctorList,
      "eventid": '4',
      "mpcomid": '3'
    },
    on: {
      "FromChild": _vm.getErrMsg,
      "clickCallback": _vm.trackCallback
    }
  }), _vm._v(" "), (_vm.extraShow && _vm.doctorList.length != 0 && _vm.toBottom) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("--到底了--")]) : _vm._e(), _vm._v(" "), (_vm.extraShow && _vm.doctorList.length > 20 && !_vm.toBottom) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("正在加载...")]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '4'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2fdfae74", esExports)
  }
}

/***/ })

},[1216]);