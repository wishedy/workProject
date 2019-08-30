global.webpackJsonp([15],{

/***/ 423:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_indexSearch_vue__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_49a0094a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_indexSearch_vue__ = __webpack_require__(427);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(424)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-49a0094a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_indexSearch_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_49a0094a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_indexSearch_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/indexSearch/indexSearch.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] indexSearch.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49a0094a", Component.options)
  } else {
    hotAPI.reload("data-v-49a0094a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 424:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 425:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_doctorItem__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_recureJournal__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_indexSearch__ = __webpack_require__(426);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_auth_checkLogin__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_createHistoryRecord__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      inputFocus: false,
      //tab switch
      tabsName: [{
        name: "全部"
      }, {
        name: "医生"
      }, {
        name: "康复日记"
      }],
      pageUrl: "",
      timing: "",
      isActive: -1,
      counter: 0,
      hotWord: [],
      loadingFlag: false, //true的话会禁止一切点击事件
      doctorCustomerId: "",
      showMoreFlag: false, //更多医生展示
      indexShow: true, //主页面
      noResult: false, //无结果的提示
      noResult1: false, //无tab结果的提示
      searchVal: "", //显示在输入框里的文字
      organizationNavs: [], //传数据到医生名片
      historyInfo: [],
      finish: false, //用来判断loading
      moreFinish: false,
      areaList: [],
      majorList: [], //日记列表
      majorListAll: [],
      maskerShow: false,
      allReady: false,
      doctorList: [], //医生列表
      doctorList1: [], //医生列表1
      selectedFilterIndex: -1,
      errorShow: false,
      errorMsg: "",
      firstTag: true, //控制首页列表只拉一次的anchor
      confirmShow: false,
      allMsgGot: false,
      allDiaryGot: false,
      indexJournalPage: 0,
      activeType: '', //跳转到该页面带的页面类型
      authPage: 0,
      majorPage: 0,
      HttpParams: {
        searchParam: "", //	string	是	搜索关键词
        solrType: 1, //	string	是	1-全部列表 2-医生列表 3-日记列表
        visitSiteId: 24, //	string	是	站点
        imgUseFlag: 2,
        firstResult: "0", //	string	是	分页参数
        maxResult: "20" //	string	是	分页参数
      },
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      ensureShow: false
    };
  },

  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_2_components_loading__["a" /* default */],
    toast: __WEBPACK_IMPORTED_MODULE_4__components_toast__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_6_components_confirm__["a" /* default */],
    CheckLogin: __WEBPACK_IMPORTED_MODULE_7_common_js_auth_checkLogin__["a" /* default */],
    DoctorItem: __WEBPACK_IMPORTED_MODULE_0_components_doctorItem__["a" /* default */],
    recureJournal: __WEBPACK_IMPORTED_MODULE_1_components_recureJournal__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_5_components_ensure__["a" /* default */]
  },
  mounted: function mounted() {
    // this.$forceUpdate();
    var query = this.$root.$mp.query;
    this.HttpParams.searchParam = query.searchItem ? query.searchItem : '';
    this.searchVal = query.searchItem ? query.searchItem : '';
    this.activeType = query.activeType;
    switch (parseInt(query.activeType)) {
      case 1:
        this.isActive = 0;
        break;
      case 2:
        this.isActive = 1;
        this.HttpParams.solrType = 2;
        break;
      case 3:
        this.isActive = 2;
        this.HttpParams.solrType = 3;
        break;
      default:
        this.isActive = 0;
        break;
    }
    this.getDoctorList();
    this.getCurrentTime();
    this.getCurrentPageUrl();
    if (this.activeType == 2) {
      this.specialDiary();
    }
  },
  onLoad: function onLoad() {
    this.doctorList = [];
    this.doctorList1 = [];
    this.majorList = [];
    this.majorListAll = [];
  },
  onShow: function onShow() {
    console.log(this.inputFocus);
    __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].enterBrowse();
    this.init();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].leaveBrowse();
  },
  onReachBottom: function onReachBottom() {
    this.loadMore();
  },

  methods: {
    specialDiary: function specialDiary() {
      this.HttpParams.solrType = 3;
      this.getJournalList();
    },
    trackCallback: function trackCallback(obj) {
      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14141,
        pushMessageId: obj.item.diaryId ? obj.item.diaryId : obj.item.customerId,
        keyword: obj.item.diaryName ? obj.item.diaryName : obj.item.fullName,
        locationId: obj.index
      });
      if (obj.item.diaryContentType) {
        wx.navigateTo({
          url: "/packageF/journalDetail/journalDetail?rId=" + obj.item.diaryId + "&aId=" + obj.item.authorId + "&from=search"
        });
      }
    },
    goSetting: function goSetting(e) {
      if (e.desc) {
        this.ensureShow = false;
        Object(__WEBPACK_IMPORTED_MODULE_10_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {
            console.log(res);
          }
        });
      } else {
        this.finish = false;
        this.ensureShow = true;
      }
    },

    //data initialization
    init: function init() {
      this.moreFinish = false;
      this.authPage = 0;
      this.majorPage = 0;
      this.ensureShow = false;
      this.HttpParams.solrType = 1;
      this.loadingFlag = false;
      this.HttpParams.firstResult = 0;
      this.firstTag = true;
      this.allMsgGot = false;
      this.allDiaryGot = false;
      this.inputFocus = false;
    },

    //更多医生功能
    MoreDoctor: function MoreDoctor() {
      this.doctorList = [];
      this.doctorList1 = [];
      this.HttpParams.firstResult = 0;
      this.noResult1 = false;
      this.isActive = 1;
      this.HttpParams.solrType = 2;
      this.getDoctorList();
    },
    searchTabClick: function searchTabClick(index) {
      this.isActive = index;
      this.moreFinish = false;
      this.allMsgGot = false;
      this.allDiaryGot = false;
      switch (index) {
        case 0:
          this.noResult = false;
          break;
        case 1:
          this.noResult = false;
          if (this.doctorList.length === 0) {
            this.noResult1 = true;
          } else {
            this.noResult1 = false;
          }
          break;
        case 2:
          this.noResult = false;
          if (this.majorListAll.length === 0) {
            this.noResult1 = true;
          } else {
            this.noResult1 = false;
          }
          break;
      }
      if (this.isActive == 0) {
        this.noResult = false;
      }
      if (this.isActive == 1) {
        this.doctorList = [];
        this.HttpParams.solrType = 2;
        this.HttpParams.firstResult = this.authPage * this.HttpParams.maxResult;
        this.getDoctorList();
      }
      if (this.isActive == 2) {
        this.majorListAll = this.majorList;
        // this.HttpParams.solrType = 3;
        // this.HttpParams.firstResult = this.authPage * this.HttpParams.maxResult;
        // this.getDoctorList();
      }
    },
    getCurrentTime: function getCurrentTime() {
      var timestamp = Date.parse(new Date());
      timestamp = timestamp / 1000;
      var n = timestamp * 1000;
      var date = new Date(n);
      var Y = date.getFullYear();
      var M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      var D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();
      this.Timing = Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    },
    getCurrentPageUrl: function getCurrentPageUrl() {
      var pages = getCurrentPages();
      var currentPage = pages[pages.length - 1];
      this.pageUrl = currentPage.route;
    },

    //加载更多
    loadMore: function loadMore() {
      var _this = this;
      _this.noResult = false;
      _this.noResult1 = false;
      if (!_this.allMsgGot && !_this.allDiaryGot && _this.isActive >= 0) {
        _this.HttpParams.solrType = _this.isActive == 1 ? 2 : 3;
        clearTimeout(_this.debounce);
        _this.debounce = setTimeout(function () {
          if (_this.isActive == 1) {
            _this.authPage += 1;
            _this.HttpParams.firstResult = _this.authPage * _this.HttpParams.maxResult;
          } else {
            _this.majorPage += 1;
            _this.HttpParams.firstResult = _this.majorPage * _this.HttpParams.maxResult;
          }
          _this.getDoctorList1();
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
    showChinese: function showChinese(item) {
      var itemValue = item.areasExpertise;
      if (itemValue != null && itemValue != "") {
        var reg = /[\u4e00-\u9fa5,]/g;
        var str = itemValue.match(reg).join("");
        var val = str.replace(/,/g, "、");
        return val;
      }
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

    //获取日记数据（从快速搜索来）
    getJournalList: function getJournalList() {
      var _this4 = this;

      this.majorList = [];
      this.majorListAll = [];
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_indexSearch__["a" /* default */])(this.HttpParams).then(function (data) {
        if (data && data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData;
          if (dataList.diaryList && dataList.diaryList.length > 0) {
            dataList.diaryList.forEach(function (element) {
              element.patientAgeShow = _this4.getAge(element.patientAge);
              _this4.majorList.push(element); //全部搜索日记列表
              _this4.majorListAll.push(element); //日记tab列表
            });
          }
        }
      });
    },

    //获取列表数据
    getDoctorList: function getDoctorList() {
      var _this5 = this;

      console.log('-----');
      console.log(this.doctorList1);
      console.log('-----');
      var _this = this;
      _this.finish = true;
      _this.allMsgGot = false;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_indexSearch__["a" /* default */])(_this.HttpParams).then(function (data) {
        _this.loadingFlag = false;
        if (data && data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData;
          _this.finish = false;
          _this.noResult = false;
          //日记数据
          if (dataList.diaryList && dataList.diaryList.length > 0) {
            _this.noResult1 = false;
            _this.noResult = false;
            dataList.diaryList.forEach(function (element) {
              element.patientAgeShow = _this5.getAge(element.patientAge);
              if (_this.firstTag) {
                _this.majorList.push(element); //全部搜索日记列表
              }
              _this.majorListAll.push(element); //日记tab列表
            });
            _this.firstTag = false;
          } else {
            if (_this.majorList.length == 0 && _this.isActive !== 1) {
              _this.noResult1 = true; //无结果
            } else if (!dataList.authMapList) {
              _this.allDiaryGot = true; //无更多
            }
          }
          //医生数据
          if (dataList.authMapList && dataList.authMapList.length > 0) {
            _this.noResult1 = false;
            _this.noResult = false;
            if (dataList.authMapList.length > 2) {
              _this.showMoreFlag = true;
            }
            dataList.authMapList.forEach(function (element) {
              _this.doctorList.push(element);
            });
            if (!_this.doctorList1.length > 0) {
              _this.doctorList1.push(dataList.authMapList[0]); //全部搜索医生第一条数据
              if (dataList.authMapList.length > 1) {
                _this.doctorList1.push(dataList.authMapList[1]); //全部搜索医生第二条数据
              }
            }
            _this.noResult = false;
          } else {
            if (_this.doctorList.length == 0 && _this.isActive == 1) {
              _this.noResult1 = true; //无结果
            } else if (!dataList.diaryList) {
              _this.allMsgGot = true; //无更多
            }
          }
          // if(_this.activeType ==2){
          //   _this.HttpParams.solrType = 3;
          //   _this.getDoctorList1();
          //   _this.isActive = 1;
          // }
        } else {
          _this.errorMsg = "网络连接失败";
          _this.errorShow = true;
          setTimeout(function () {
            _this.finish = false;
            _this.errorShow = false;
          }, 2000);
        }
      }).catch(function () {
        _this.finish = false;
      });
    },

    //loadingMore 不能改变其他tag的东西，所以请求要分开
    getDoctorList1: function getDoctorList1() {
      var _this6 = this;

      var _this = this;
      _this.moreFinish = true;
      _this.allMsgGot = false;
      _this.allDiaryGot = false;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_indexSearch__["a" /* default */])(_this.HttpParams).then(function (data) {
        _this.loadingFlag = false;
        if (data && data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData;
          _this.moreFinish = false;
          //日记数据
          if (dataList.diaryList && dataList.diaryList.length > 0) {
            dataList.diaryList.forEach(function (element) {
              element.patientAgeShow = _this6.getAge(element.patientAge);
              if (_this.isActive == 2) {
                _this.majorListAll.push(element); //日记tab列表
              } else if (_this.isActive == 0) {
                _this.majorList.push(element); //全部搜索日记列表
              }
            });
          } else {
            if (_this.majorList.length == 0 && _this.isActive !== 1) {
              // _this.isActive = -1;
            } else if (!dataList.authMapList && _this.majorPage > 0) {
              _this.allDiaryGot = true; //无更多
            }
          }
          //医生数据
          if (dataList.authMapList && dataList.authMapList.length > 0) {
            dataList.authMapList.forEach(function (element) {
              _this.doctorList.push(element);
            });
            if (!_this.doctorList1.length > 0) {
              _this.doctorList1.push(dataList.authMapList[0]); //全部搜索医生第一条数据
              if (dataList.authMapList.length > 1) {
                _this.doctorList1.push(dataList.authMapList[1]); //全部搜索医生第二条数据
              }
            }
          } else {
            if (_this.doctorList.length == 0 && _this.isActive == 1) {
              // _this.isActive = -1;
            } else if (!dataList.diaryList) {
              _this.allMsgGot = true; //无更多
            }
          }
        } else {
          _this.errorMsg = "网络连接失败";
          _this.errorShow = true;
          setTimeout(function () {
            _this.moreFinish = false;
            _this.errorShow = false;
          }, 2000);
        }
      }).catch(function () {
        _this.moreFinish = false;
      });
    },

    //搜索按钮的特殊性
    getDoctorList2: function getDoctorList2() {
      var _this7 = this;

      var _this = this;
      _this.allMsgGot = false;
      _this.allDiaryGot = false;
      _this.finish = false;
      _this.HttpParams.firstResult = 0;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_indexSearch__["a" /* default */])(_this.HttpParams).then(function (data) {
        _this.loadingFlag = false;
        if (data && data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData;
          _this.finish = false;
          _this.noResult = true;
          _this.doctorList1 = []; //清空tabbar用的东西
          _this.majorList = [];
          _this.majorListAll = [];
          //日记数据
          if (dataList.diaryList && dataList.diaryList.length > 0) {
            _this.noResult1 = false;
            _this.noResult = false;
            _this.isActive = 0;
            dataList.diaryList.forEach(function (element) {
              element.patientAgeShow = _this7.getAge(element.patientAge);
              _this.majorList.push(element); //全部搜索日记列表
            });
          } else {
            _this.isActive = 0;
          }
          //医生数据
          if (dataList.authMapList && dataList.authMapList.length > 0) {
            _this.noResult1 = false;
            _this.noResult = false;
            dataList.authMapList.forEach(function (element) {
              _this.doctorList.push(element);
            });
            if (!_this.doctorList1.length > 0) {
              _this.doctorList1.push(dataList.authMapList[0]); //全部搜索医生第一条数据
              if (dataList.authMapList.length >= 2) {
                _this.doctorList1.push(dataList.authMapList[1]);
              }
            }
            _this.isActive = 0;
            _this.noResult = false;
          } else {
            _this.isActive = 0;
          }
        } else {
          _this.errorMsg = "网络连接失败";
          _this.errorShow = true;
          setTimeout(function () {
            _this.finish = false;
            _this.errorShow = false;
          }, 2000);
        }
      }).catch(function () {
        _this.finish = false;
      });
    },

    //点击事件触发搜索
    getSearchResult: function getSearchResult() {
      var _this8 = this;

      this.inputFocus = false;
      if (this.finish == false) {
        this.authPage = 0;
        this.majorPage = 0;
        this.HttpParams.firstResult = 0;
        this.HttpParams.areasExpertise = "";
        this.HttpParams.searchRegion = "";
        //搜索框
        if (this.searchVal.length > 0) {
          this.isActive = -1;
          this.loadingFlag = true;
          this.HttpParams.solrType = 1; //全局搜索
          this.indexShow = true;
          // 清空数据
          this.doctorList = [];
          this.doctorList1 = [];
          this.majorList = [];
          this.majorListAll = [];
          this.$set(this.HttpParams, "searchParam", this.searchVal);
          this.createHistoryRecord();
          this.getDoctorList2();
        } else {
          this.HttpParams.searchParam = "";
          this.errorMsg = "请输入关键词";
          this.errorShow = true;
          setTimeout(function () {
            _this8.finish = false;
            _this8.errorShow = false;
          }, 2000);
        }
      }
    },
    getAge: function getAge(num) {
      var firstNum = parseInt(num / 10);
      var twoNum = num % 10;
      if (firstNum) {
        if (twoNum <= 5) {
          if (twoNum == 0) {
            if (firstNum == 1) {
              return num + "\u5C81";
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
    filterShowCallback: function filterShowCallback(index) {
      this.selectedFilterIndex = index;
    },

    //搜索历史记录处理
    //创建历史记录
    createHistoryRecord: function createHistoryRecord() {
      var _this9 = this;

      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_createHistoryRecord__["a" /* default */])({
        searchType: "4",
        keyWord: this.searchVal,
        pageUrl: this.pageUrl,
        createTime: this.timing
      }).then(function (res) {
        if (res && res.responseObject.responseStatus) {
          console.log("创建历史记录成功");
        }
      }).catch(function (err) {
        _this9.finish = false;
      });
    }
  }
});

/***/ }),

/***/ 426:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = indexSearchList;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：找医生列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */




var XHRList = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getSearchMapList2/";
function indexSearchList(param) {
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__["a" /* default */])({
      url: XHRList,
      method: "POST",
      data: {
        searchParam: param.searchParam, //	string	是	搜索关键词
        solrType: param.solrType, //	string	是	1-全部（医生列表与日记列表）		只搜日记列表（不传改参数）
        visitSiteId: param.visitSiteId, //	string	是	站点
        firstResult: param.firstResult, //	string	是	分页参数
        maxResult: param.maxResult, //	string	是	分页参数
        imgUseFlag: param.imgUseFlag,
        isValid: 1
      },
      done: function done(data) {
        resolve(data);
      },
      fail: function fail(err) {
        reject(err);
      }
    }, 'loading');
  });
};

/***/ }),

/***/ 427:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main",
    attrs: {
      "id": "contain"
    }
  }, [_c('section', {
    style: ({
      'height': '100vh'
    })
  }, [_c('section', {
    staticClass: "header"
  }, [_c('section', {
    staticClass: "input-box"
  }, [_c('div', {
    staticClass: "sd_searchGroup"
  }, [_c('img', {
    staticClass: "search-icon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/img00/DrList/search.png",
      "eventid": '0'
    },
    on: {
      "click": _vm.cleanContent
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
      "type": "text",
      "placeholder": "搜索医生、康复日记",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.searchVal)
    },
    on: {
      "click": _vm.gogogo,
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.searchVal = $event.target.value.trim()
      },
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  }), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.searchVal.length > 0),
      expression: "searchVal.length>0"
    }],
    staticClass: "sd_delete_icon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/delet.png",
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.searchVal = ''
      },
      "confirm": _vm.getSearchResult
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "sd_searchBtn",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": _vm.getSearchResult
    }
  }, [_vm._v("搜索")])]), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '1'
    }
  }, [(_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '0'
    }
  }) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c('p', {
    staticClass: "traderText"
  }, [_vm._v("\n      为您找到以下"), _c('span', {
    staticStyle: {
      "color": "#02B5AC"
    }
  }, [_vm._v(_vm._s(_vm.HttpParams.searchParam))]), _vm._v("相关结果\n    ")]), _vm._v(" "), _c('section', [(_vm.doctorList1.length > 0 || _vm.majorList.length > 0 || _vm.majorListAll.length > 0) ? _c('div', {
    staticClass: "_box"
  }, _vm._l((_vm.tabsName), function(item, index) {
    return _c('span', {
      key: index
    }, [_c('a', {
      staticClass: "tab-link",
      class: {
        active: _vm.isActive === index
      },
      attrs: {
        "eventid": '4-' + index
      },
      on: {
        "click": function($event) {
          _vm.searchTabClick(index)
        }
      }
    }, [_vm._v(_vm._s(item.name))])])
  })) : _vm._e()]), _vm._v(" "), (_vm.isActive == 0) ? _c('section', [(_vm.doctorList1.length > 0) ? _c('p', {
    staticClass: "all-title doctor-title"
  }, [_vm._v("医生")]) : _vm._e(), _vm._v(" "), _c('DoctorItem', {
    attrs: {
      "organization": _vm.doctorList1,
      "eventid": '5',
      "mpcomid": '2'
    },
    on: {
      "FromChild": _vm.getErrMsg,
      "clickCallback": _vm.trackCallback
    }
  }), _vm._v(" "), (_vm.doctorList1.length > 1) ? _c('button', {
    staticClass: "showMore",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.MoreDoctor
    }
  }, [_c('span', [_vm._v("查看更多相关医生")])]) : _vm._e(), _vm._v(" "), (_vm.majorList.length > 0) ? _c('p', {
    staticClass: "all-title"
  }, [_vm._v("康复日记")]) : _vm._e(), _vm._v(" "), _c('recureJournal', {
    attrs: {
      "journalData": _vm.majorList,
      "eventid": '7',
      "mpcomid": '3'
    },
    on: {
      "FromChild": _vm.goSetting,
      "clickCallback": _vm.trackCallback
    }
  }), _vm._v(" "), (_vm.moreFinish) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("正在加载...")]) : _vm._e(), _vm._v(" "), (!_vm.moreFinish && _vm.allDiaryGot) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("--到底了--")]) : _vm._e(), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.majorList.length === 0 && _vm.doctorList1.length === 0),
      expression: "!finish&&majorList.length===0&&doctorList1.length===0"
    }],
    staticClass: "noResult-img",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png"
    }
  }), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.majorList.length === 0 && _vm.doctorList1.length === 0),
      expression: "!finish&&majorList.length===0&&doctorList1.length===0"
    }],
    staticClass: "Noresult"
  }, [_vm._v("未找到符合条件的结果")])], 1) : _vm._e(), _vm._v(" "), (_vm.indexShow && _vm.isActive == 1) ? _c('section', {
    staticClass: "main-inner"
  }, [_c('DoctorItem', {
    attrs: {
      "organization": _vm.doctorList,
      "eventid": '8',
      "mpcomid": '4'
    },
    on: {
      "FromChild": _vm.getErrMsg,
      "clickCallback": _vm.trackCallback
    }
  }), _vm._v(" "), (_vm.moreFinish) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("正在加载...")]) : _vm._e(), _vm._v(" "), (!_vm.moreFinish && _vm.allMsgGot) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("--到底了--")]) : _vm._e(), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.doctorList.length === 0),
      expression: "!finish&&doctorList.length===0"
    }],
    staticClass: "noResult-img",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png"
    }
  }), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.doctorList.length === 0),
      expression: "!finish&&doctorList.length===0"
    }],
    staticClass: "Noresult"
  }, [_vm._v("未找到符合条件的结果")])], 1) : _vm._e(), _vm._v(" "), (_vm.isActive == 2) ? _c('section', [_c('recureJournal', {
    attrs: {
      "journalData": _vm.majorListAll,
      "eventid": '9',
      "mpcomid": '5'
    },
    on: {
      "FromChild": _vm.goSetting,
      "clickCallback": _vm.trackCallback
    }
  }), _vm._v(" "), (_vm.moreFinish) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("正在加载...")]) : _vm._e(), _vm._v(" "), (!_vm.moreFinish && _vm.allDiaryGot) ? _c('span', {
    staticClass: "no-more"
  }, [_vm._v("--到底了--")]) : _vm._e(), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.majorListAll.length === 0),
      expression: "!finish&&majorListAll.length===0"
    }],
    staticClass: "noResult-img",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/default.png"
    }
  }), _vm._v(" "), _c('p', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (!_vm.finish && _vm.majorListAll.length === 0),
      expression: "!finish&&majorListAll.length===0"
    }],
    staticClass: "Noresult"
  }, [_vm._v("未找到符合条件的结果")])], 1) : _vm._e(), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '6'
    }
  }) : _vm._e()], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '10',
      "mpcomid": '7'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-49a0094a", esExports)
  }
}

/***/ })

},[1219]);