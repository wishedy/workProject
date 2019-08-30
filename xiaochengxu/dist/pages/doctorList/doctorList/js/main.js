global.webpackJsonp([44],{

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorList_vue__ = __webpack_require__(390);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2b609934_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorList_vue__ = __webpack_require__(406);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(389)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-2b609934"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2b609934_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorList/doctorList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2b609934", Component.options)
  } else {
    hotAPI.reload("data-v-2b609934", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 389:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 390:
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_common_js_HttpRequest_deleteHistoryRecord__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_common_js_HttpRequest_createHistoryRecord__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_components_authorization_authorization__ = __webpack_require__(36);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
















 // 返回首页组件


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      backIndexShow: false,
      scrollTop: 0,
      clickAble: true,
      dataClean: false,
      extraShow: true, //最下面那个加载中/到底了
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
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
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
    DoctorItem: __WEBPACK_IMPORTED_MODULE_3_components_doctorItem__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_14_components_ensure__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_17_components_backIndex__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_18_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_19_components_authorization_authorization__["a" /* default */]
  },
  watch: {
    value: function value(newVal) {
      this.inputValue = newVal;
    },
    inputValue: function inputValue(newVal) {
      this.$emit('input', newVal);
    }
  },
  onReachBottom: function onReachBottom() {
    this.loadMore();
  },
  onUnload: function onUnload() {
    this.dataClean = false;
    this.doctorList = [];
    this.HttpParams.firstResult = 0;
  },
  onShow: function onShow() {
    var pages = getCurrentPages(); //页面栈
    if (pages.length == 1) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].enterBrowse();
    this.clickAble = true;
    this.searchVal = '';
    this.maskerShow = false;
    wx.setNavigationBarTitle({
      title: "找名医"
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].leaveBrowse();
  },
  mounted: function mounted() {
    this.dataClean = true;
    this.doctorList = [];
    // const query = this.$root.$mp.query;
    // this.HttpParams.solrContent = query.searchItem ? query.searchItem : '';
    // this.searchVal = query.searchItem ? query.searchItem : '';
    this.HttpParams.areasExpertise = '';
    this.HttpParams.searchRegion = '';
    this.page = 0;
    this.allMsgGot = false;
    this.toBottom = false;
    this.getDoctorList();
    this.getFilterCondition();
  },

  //转发事件
  onShareAppMessage: function onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target);
    }
    // let _path = `/${getCurrentPages()[1].route}`;
    var _path = "/pages/mIndex/mIndex?from=shareFriend&path=/pages/doctorList/doctorList";
    var _sharTitle = "\u552F\u533B\u9AA8\u79D1 | \u627E\u9AA8\u79D1\u4E09\u7532\u540D\u533B";
    console.log(_path);
    return {
      title: _sharTitle,
      path: _path
    };
  },

  methods: {
    getTop: function getTop(e) {
      console.log(e);
      this.scrollTop = e.mp.detail.scrollTop;
    },
    authEvent: function authEvent(obj) {
      console.log(obj);
      if (obj.desc) {
        this.ensureShow = false;
      } else {
        this.ensureShow = true;
      }
    },
    goToSetting: function goToSetting(e) {
      console.log(e.mp.detail.errMsg === "openSetting:ok");
      if (e.mp.detail.errMsg === "openSetting:ok") {
        this.ensureShow = false;
      } else {
        this.ensureShow = true;
      }
    },
    trackCallback: function trackCallback(obj) {
      __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].createTrack({
        actionId: 14146,
        pushMessageId: obj.item.customerId,
        keyword: obj.item.fullName,
        locationId: obj.index
      });
    },
    loadMore: function loadMore() {
      var _this = this;

      console.log(456456);
      if (!this.allMsgGot) {

        clearTimeout(this.debounce);
        this.extraShow = true;
        this.debounce = setTimeout(function () {
          // wx.pageScrollTo({
          //   scrollTop: 10000,
          //   duration: 0
          // })
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

    //快速搜索
    quickSearch: function quickSearch(item, index) {
      this.page = 0;
      this.loadingFlag = true;
      this.HttpParams.firstResult = 0;
      this.doctorList = [];
      this.indexShow = true;
      this.maskerShow && (this.maskerShow = false);
      if (this.selectItem1 == index) {
        this.HttpParams.solrContent = '';
        this.selectItem1 = '';
        this.searchVal = '';
        this.getDoctorList();
      } else {
        this.selectItem1 = index;
        this.searchVal = item;
        this.HttpParams.solrContent = item;
        this.getDoctorList();
        this.HttpParams.solrContent = '';
      }
    },
    showChinese: function showChinese(item) {
      var itemValue = item.areasExpertise;
      if (itemValue != null && itemValue != "") {
        var reg = /[\u4e00-\u9fa5,]/g;
        var str = itemValue.match(reg).join("");
        var val = str.replace(/,/g, '、');
        return val;
      }
    },
    cancelEvent: function cancelEvent() {
      this.confirmShow = false;
    },
    ensureEvent: function ensureEvent() {
      var _this3 = this;

      this.confirmShow = false;
      Object(__WEBPACK_IMPORTED_MODULE_15_common_js_HttpRequest_deleteHistoryRecord__["a" /* default */])().then(function (res) {
        if (res && res.responseObject.responseStatus) {
          _this3.historyInfo = [];
        }
      });
    },

    //获取过滤后的医生数据
    getDoctorList: function getDoctorList() {
      var _this4 = this;

      // if (this.toBottom) {
      this.finish = true;
      // }
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getDoctorFilterList__["a" /* default */])(this.HttpParams).then(function (data) {
        if (data.responseObject.responseData) {
          _this4.extraShow = false;
          var dataList = data.responseObject.responseData.dataList;
          _this4.finish = false;
          if (dataList && dataList.length !== 0) {
            dataList.forEach(function (element) {
              _this4.doctorList.push(element);
              _this4.loadingFlag = true;
            });
            _this4.noResult = false;
          } else {
            _this4.extraShow = true;
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
    getSearchResult: function getSearchResult(type, obj) {
      this.loadingFlag = true;
      this.maskerShow = false;
      this.HttpParams.firstResult = 0;
      this.page = 0;
      this.doctorList = [];
      this.indexShow = true;
      if (this.finish == false) {
        this.HttpParams.areasExpertise = "";
        this.HttpParams.searchRegion = "";
        this.defaultMajor = {
          title: "全部专科",
          index: -1
        };
        this.defaultArea = {
          title: "全国",
          index: -1
        };
        if (type == 1) {
          if (this.searchVal.length > 0) {
            this.$set(this.HttpParams, "solrContent", this.searchVal);
            this.createHistoryRecord();
            this.getDoctorList();
            this.HttpParams.firstResult += this.HttpParams.maxResult;
          } else {
            this.HttpParams.solrContent = '';
            this.getDoctorList();
          }
        } else {
          this.HttpParams.solrContent = obj.keyWord;
          this.searchVal = obj.keyWord;
          this.createHistoryRecord();
          this.getDoctorList();
          this.HttpParams.firstResult += this.HttpParams.maxResult;
        }
      }
    },
    getSelectFilter: function getSelectFilter(filter) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      });
      // document.body.style.position = 'inherit'
      this.loadingFlag = true;
      this.HttpParams.firstResult = 0;
      this.scrollTop = 0;
      this.finish = true;
      this.toBottom = false;
      this.allMsgGot = false;
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
      var _this5 = this;

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
                _this5.majorList = data.data_list;
                _this5.majorList.unshift({
                  tagName: "全部专科",
                  type: "default"
                });
                break;
              case 1:
                //地区
                _this5.areaList = data.dataList;
                _this5.areaList.unshift({
                  regionName: "全国",
                  type: "default"
                });
                break;
              default:
                break;
            }
          }
        });
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getHotWord__["a" /* default */])({
          flag: 0
        }).then(function (data) {
          var dataList = data.responseObject.responseData.dataList;
          _this5.hotWord = dataList.split(",");
        });
      });
    },
    filterShowCallback: function filterShowCallback(index) {
      this.selectedFilterIndex = index;
    },

    //搜索历史记录处理
    getHistoryRecord: function getHistoryRecord() {
      if (this.clickAble) {
        this.clickAble = false;
        __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].createTrack({
          actionId: 14138
        });
        wx.navigateTo({
          url: "/pages/history/history"
        });
      }
    },
    createHistoryRecord: function createHistoryRecord() {
      var _this6 = this;

      Object(__WEBPACK_IMPORTED_MODULE_16_common_js_HttpRequest_createHistoryRecord__["a" /* default */])({
        searchType: "1",
        keyWord: this.searchVal,
        siteId: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (res) {
        if (res && res.responseObject.responseStatus) {
          console.log("创建历史记录成功");
        }
      }).catch(function (err) {
        _this6.finish = false;
      });
    }
  }
});

/***/ }),

/***/ 406:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main"
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
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_search.png"
    }
  }), _vm._v(" "), _c('section', {
    staticClass: "sd_searchInput",
    attrs: {
      "data-alcode": "e174",
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.getHistoryRecord()
      }
    },
    model: {
      value: (_vm.searchVal),
      callback: function($$v) {
        _vm.searchVal = (typeof $$v === 'string' ? $$v.trim() : $$v)
      },
      expression: "searchVal"
    }
  }, [_vm._v("输入医院、医生、疾病关键词搜索\n        ")]), _vm._v(" "), (_vm.searchVal.length > 0) ? _c('img', {
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
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '2'
    }
  }, [(_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '1'
    }
  }) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.indexShow),
      expression: "indexShow"
    }],
    staticClass: "navBar",
    staticStyle: {
      "font-size": "0"
    }
  }, [_c('FilterBuilder', {
    ref: "filterBuilder",
    attrs: {
      "param": {
        dataList: _vm.majorList,
        title: '全部专科',
        itemName: 'tagName',
        type: 'major',
        index: 0,
        changeTitle: '全部专科'
      },
      "maskerShow": _vm.maskerShow,
      "selectItem": _vm.defaultMajor.index,
      "selectTitle": _vm.defaultMajor.title,
      "selectIndex": _vm.selectedFilterIndex,
      "eventid": '3',
      "mpcomid": '3'
    },
    on: {
      "update:maskerShow": function($event) {
        _vm.maskerShow = $event
      },
      "selectFilter": _vm.getSelectFilter,
      "update:selectItem": function($event) {
        _vm.defaultMajor.index = $event
      },
      "update:selectTitle": function($event) {
        _vm.defaultMajor.title = $event
      },
      "filterShowCallback": function($event) {
        _vm.filterShowCallback(0)
      }
    }
  }), _vm._v(" "), _c('FilterBuilder', {
    ref: "filterBuilder",
    attrs: {
      "param": {
        dataList: _vm.areaList,
        title: '全国',
        itemName: 'regionName',
        type: 'area',
        index: 1,
        changeTitle: '全国'
      },
      "maskerShow": _vm.maskerShow,
      "selectItem": _vm.defaultArea.index,
      "selectTitle": _vm.defaultArea.title,
      "selectIndex": _vm.selectedFilterIndex,
      "eventid": '4',
      "mpcomid": '4'
    },
    on: {
      "update:maskerShow": function($event) {
        _vm.maskerShow = $event
      },
      "selectFilter": _vm.getSelectFilter,
      "update:selectItem": function($event) {
        _vm.defaultArea.index = $event
      },
      "update:selectTitle": function($event) {
        _vm.defaultArea.title = $event
      },
      "filterShowCallback": function($event) {
        _vm.filterShowCallback(1)
      }
    }
  })], 1), _vm._v(" "), (_vm.indexShow) ? _c('section', {
    staticClass: "main-inner1"
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
      "eventid": '5',
      "mpcomid": '5'
    },
    on: {
      "FromChild": _vm.getErrMsg,
      "clickCallback": _vm.trackCallback,
      "authEvent": _vm.authEvent
    }
  }), _vm._v(" "), (_vm.extraShow && (_vm.doctorList.length > 0 && _vm.toBottom)) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("--到底了--")]) : (_vm.extraShow && (_vm.doctorList.length > 0 && !_vm.toBottom)) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("正在加载...")]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '6'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '6',
      "mpcomid": '7'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.indexShow && _vm.historyInfo.length > 0) ? _c('figure', {
    staticClass: "dr_searchHistory"
  }, [_c('figcaption', [_vm._v("历史记录"), _c('i', {
    staticClass: "dr_deleteBtnIcon",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.confirmShow = true
      }
    }
  })], 1), _vm._v(" "), _c('ul', {
    staticClass: "dr_searchList"
  }, _vm._l((_vm.historyInfo), function(item, index) {
    return _c('span', {
      key: index,
      staticClass: "history-item",
      attrs: {
        "eventid": '8-' + index
      },
      on: {
        "click": function($event) {
          _vm.getSearchResult(2, item)
        }
      }
    }, [_vm._v(_vm._s(item.keyWord))])
  })), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '9'
    }
  }, [(_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '确认',
        'cancel': '取消',
        'content': '确认删除全部历史记录吗?'
      },
      "eventid": '9',
      "mpcomid": '8'
    },
    on: {
      "cancelClickEvent": _vm.cancelEvent,
      "ensureClickEvent": _vm.ensureEvent
    }
  }) : _vm._e()], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '10'
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '11'
    }
  }), _vm._v(" "), _c('authorization', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2b609934", esExports)
  }
}

/***/ })

},[1214]);