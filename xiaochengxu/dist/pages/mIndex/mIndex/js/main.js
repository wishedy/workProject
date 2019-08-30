global.webpackJsonp([7],{

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mIndex_vue__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1a68a634_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mIndex_vue__ = __webpack_require__(345);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(309)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mIndex_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1a68a634_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mIndex_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/mIndex/mIndex.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mIndex.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a68a634", Component.options)
  } else {
    hotAPI.reload("data-v-1a68a634", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 309:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 310:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_miniProgram__ = __webpack_require__(320);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_components_recureJournal__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_components_customizedTabbar__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getRecureJournal__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_getPartList__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_toolbarConfig__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_common_js_miniUtil_GetPhoneAuthorization__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_common_js_HttpRequest_getHealthCardList__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_vuex__ = __webpack_require__(4);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
    var mobileOnOff = __WEBPACK_IMPORTED_MODULE_14_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    return {
      toBottom: true, //判断显示加载中还是加载完毕
      selected: 1, //用于给定tabbar的样式
      page: 0,
      loadMoreFlag: true, //避免重复多次触底加载
      quickSearch: '',
      clickLimit: true,
      ensureShow: false,
      journalList: [],
      mobileOnOff: mobileOnOff,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      finish: false,
      indicatorDots: true,
      recureJournalList: [],
      pathObj: {},
      // quickSearchList: [],
      clickFlag: true,
      AIminiProgramStatus: false,
      miniParams: {
        name: 'AIReadCard',
        path: '',
        extraData: {
          a: '1',
          b: '2',
          c: '3'
        }
      },
      partList: [], // 部位列表
      partSelected: -1, // 部位选中列表
      partIdIn: '',
      isCoverCity: false, // 定位 默认不在范围内
      hasCard: true // 有健康卡
    };
  },

  watch: {
    partSelected: function partSelected(newVal, oldVal) {
      this.partIdIn = newVal == -1 ? '' : this.partList[newVal].propertyId;
      this.page = 0;
      this.loadMoreFlag = true;
      this.getRecureJournal();
    },
    userInfoEnd: function userInfoEnd(newVal, oldVal) {
      console.log(newVal);
      console.log('获取到信息');
      var _this = this;
      _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_14_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    }
  },
  onPullDownRefresh: function onPullDownRefresh() {
    this.getRecureJournal();
  },
  onReachBottom: function onReachBottom() {
    this.loadMore();
  },

  //转发事件
  onShareAppMessage: function onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target);
    }
    var _path = "/pages/mIndex/mIndex?from=share";
    var _sharTitle = "\u552F\u533B\u9AA8\u79D1 | \u627E\u9AA8\u79D1\u4E09\u7532\u540D\u533B>>\u9AA8\u79D1\u95EE\u9898 \u5C31\u95EE\u552F\u533B";
    return {
      title: _sharTitle,
      path: _path
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_19_vuex__["d" /* mapGetters */])(['userInfoEnd'])),
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_2_components_loading__["a" /* default */],
    recureJournal: __WEBPACK_IMPORTED_MODULE_7_components_recureJournal__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_3_components_ensure__["a" /* default */],
    miniLogin: __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */],
    customizedTabbar: __WEBPACK_IMPORTED_MODULE_9_components_customizedTabbar__["a" /* default */],
    MiniProgram: __WEBPACK_IMPORTED_MODULE_5_components_miniProgram__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_18_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_4_components_authorization_authorization__["a" /* default */]
  },
  methods: {
    // 获取健康卡列表
    getHealthCardList: function getHealthCardList() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_17_common_js_HttpRequest_getHealthCardList__["a" /* default */])({}).then(function (res) {
        console.log(res);
        if (res) {
          // 账号下有健康卡
          _this.hasCard = true;
        } else {
          // 账号下无健康卡
          _this.hasCard = false;
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_13_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    // 首页的跳转初始化
    navigateInit: function navigateInit(option) {
      // console.log(option);
      if (option.from === 'shareFriend') {
        var result = [];
        for (var i in option) {
          if (i !== 'from' && i !== 'path') result.push(i + "=" + option[i]);
        }
        var navigatePath = option['path'] + (result.length ? "?" + result.join("&") : '');
        wx.navigateTo({
          url: navigatePath
        });
        console.log('navigatePath:' + navigatePath);
      }
    },

    // 获取部位列表
    getPartFun: function getPartFun() {
      var _this2 = this;

      Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_getPartList__["a" /* default */])({
        isValid: 1, //string	是	是否有效		1
        firstResult: 0, //string	是	分页参数		0
        maxResult: 100, //string	是	分页参数		100
        propertyTypeId: 16
      }).then(function (res) {
        if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this2.partList = res.responseObject.responseData.dataList;
          console.log(_this2.partList);
        } else {
          console.log('获取部位列表失败');
        }
      });
    },

    // 部位切换
    partSelectedFun: function partSelectedFun(index) {
      this.partSelected = index;
    },
    getTransferParam: function getTransferParam(item) {
      this.quickSearch = item;
    },

    // HotWordResource() {
    //   getHotWord({
    //     flag: 1
    //   }).then(data => {
    //     let dataList = data.responseObject.responseData.dataList;
    //     this.quickSearchList = dataList.split(",");
    //   })
    // },
    rjTrack: function rjTrack(obj) {
      __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
        actionId: 14124,
        pushMessageId: obj.item.diaryId,
        keyword: obj.item.diaryName
      });
    },

    // 跳转小程序埋点
    jumpToMini: function jumpToMini() {
      __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
        actionId: 14198
      });
    },
    loadMore: function loadMore() {
      var _this3 = this;

      if (this.loadMoreFlag) {
        this.finish = true;
        var result = this.page += 1;
        Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getRecureJournal__["a" /* default */])({
          isValid: 1,
          sortType: 2,
          visitSiteId: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getSiteId(),
          firstResult: result * 20,
          maxResult: 20,
          imgUseFlag: 2,
          partIdIn: this.partIdIn
        }).then(function (res) {
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            var dataList = res.responseObject.responseData.dataList;
            // dataList.forEach(element => {
            //   this.recureJournalList.push(element)
            // })
            _this3.finish = false;
            _this3.recureJournalList = _this3.recureJournalList.concat(dataList);
          } else {
            _this3.finish = false;
            _this3.toBottom = false;
            _this3.loadMoreFlag = false;
          }
        });
      }
    },
    getRecureJournal: function getRecureJournal() {
      var _this4 = this;

      wx.showLoading({
        title: "正在加载..."
      });
      Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getRecureJournal__["a" /* default */])({
        isValid: 1,
        sortType: 5,
        visitSiteId: __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getSiteId(),
        firstResult: 0,
        maxResult: 20 * (this.page + 1),
        imgUseFlag: 2,
        partIdIn: this.partIdIn
      }).then(function (res) {
        wx.stopPullDownRefresh();
        if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          var dataList = res.responseObject.responseData.dataList;
          _this4.recureJournalList = dataList;
          wx.hideLoading();
        } else {
          _this4.loadMoreFlag = false;
          wx.hideLoading();
        }
      });
    },
    jumpToDiary: function jumpToDiary(e) {
      if (!this.clickFlag) return false;
      this.clickFlag = false;
      this.pathObj = {
        path: "diary",
        obj: e.obj
      };
      if (e.desc) {
        this.ensureShow = false;
        this.clickFlag = true;
        wx.navigateTo({
          url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId + "&from=home"
        });
        // miniLogin({
        //   successCallBack: (res) => {
        //   },
        //   failCallBack: (err) => {
        //   }
        // });
      } else {
        this.clickFlag = true;
        this.ensureShow = true;
      }
    },

    //健康卡领取
    goToHealthCard: function goToHealthCard() {
      var _this = this;
      if (true) {
        wx.navigateTo({
          url: "/packageD/healthCard/healthCardRecognition?from=mIndex"
        });
      } else {
        // 去登陆 from == 3 (待修改)
        wx.navigateTo({
          url: '/pages/login/login?from=3&needSession=1'
        });
      }
    },

    //写日记跳转到个人中心
    goPersonal: function goPersonal(e) {
      var _this5 = this;

      this.pathObj = {
        path: "personal",
        obj: ""
      };
      if (!this.clickLimit) return;
      if (e.target.userInfo) {
        wx.redirectTo({
          url: '/pages/personal/personal'
        });
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {},
          failCallBack: function failCallBack(res) {
            _this5.finish = true;
            setTimeout(function () {
              _this5.finish = false;
            }, 2000);
          }
        });
      } else {
        this.ensureShow = true;
      }
    },

    //跳转到我的医生列表
    jumpToMessage: function jumpToMessage(e) {
      var _this6 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/myConsult/myConsult'
        });
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {},
          failCallBack: function failCallBack(res) {
            _this6.finish = true;
            setTimeout(function () {
              _this6.finish = false;
            }, 2000);
          }
        });
      } else {
        this.ensureShow = true;
      }
    },

    //跳转到个人中心
    jumpToUrl: function jumpToUrl(e) {
      var _this7 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/personal/personal'
        });
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {},
          failCallBack: function failCallBack(res) {
            _this7.finish = true;
            setTimeout(function () {
              _this7.finish = false;
            }, 2000);
          }
        });
      } else {
        this.ensureShow = true;
      }
    },

    //找医生流程
    Searchdoctor: function Searchdoctor(e) {
      this.pathObj = {
        path: "findDoctor",
        obj: {}
      };
      if (this.clickLimit) {
        this.clickLimit = false;
        __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
          actionId: 14122
        });
        if (e.target.userInfo) {
          this.ensureShow = false;
          wx.navigateTo({
            url: '/pages/doctorList/doctorList'
          });
          Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
            successCallBack: function successCallBack(res) {},
            failCallBack: function failCallBack(res) {}
          });
        } else {
          this.ensureShow = true;
        }
      }
    },

    //快速搜索
    goSearchdoctor: function goSearchdoctor(e) {
      this.pathObj = {
        path: "searchDoctor",
        obj: this.quickSearch
      };
      if (this.clickLimit) {
        __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
          actionId: 14123,
          pushMessageId: this.quickSearch
        });
        this.clickLimit = false;
        if (e.target.userInfo) {
          this.ensureShow = false;
          wx.navigateTo({
            url: '/pages/indexSearch/indexSearch?activeType=2&searchItem=' + this.quickSearch
          });
          Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
            successCallBack: function successCallBack(res) {}
          });
        } else {
          this.ensureShow = true;
        }
      }
    },

    //首页搜索
    goIndexSearch: function goIndexSearch() {
      __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
        actionId: 14137
      });
      wx.navigateTo({
        url: "/pages/indexHistory/indexHistory"
      });
    },

    //轻咨询流程
    goConsult: function goConsult(e) {

      this.pathObj = {
        path: "consult",
        obj: ""
      };
      if (this.clickLimit) {
        this.clickLimit = false;
        __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
          actionId: 14121
        });
        if (e.target.userInfo) {
          this.ensureShow = false;
          wx.navigateTo({
            url: '/packageB/consultIntro/consultIntro'
          });
          Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
            successCallBack: function successCallBack(res) {}
          });
        } else {
          this.ensureShow = true;
        }
      }
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.authSetting.scoped.userInfo) {
        this.ensureShow = false;
        switch (this.pathObj.path) {
          case "consult":
            wx.navigateTo({
              url: '/packageB/consultIntro/consultIntro'
            });
            break;
          case "findDoctor":
            wx.navigateTo({
              url: '/pages/doctorList/doctorList'
            });
            break;
          case "diary":
            wx.navigateTo({
              url: "/packageF/journalDetail/journalDetail?resourceId=" + this.pathObj.obj.diaryId + "&authorCustomerId=" + this.pathObj.obj.authorId + "&doctorCustomerId=" + this.pathObj.obj.attendCustomerId + "&from=home"
            });
            break;
          case "searchDoctor":
            wx.navigateTo({
              url: '/pages/indexSearch/indexSearch?activeType=2&searchItem=' + this.pathObj.path.obj
            });
          case "personal":
            wx.redirectTo({
              url: '/pages/personal/personal'
            });
            break;
        }
        Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {}
        });
      } else {
        this.ensureShow = true;
      }
    },
    AIReadCardShow: function AIReadCardShow() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_toolbarConfig__["a" /* default */])().then(function (res) {
        // console.log(res)
        if (res.responseObject.responseData) {
          var dataList = res.responseObject.responseData.dataList;
          if (dataList) {
            dataList.forEach(function (element, index) {
              if (element.state == 1) {
                switch (parseInt(element.toolType)) {
                  case 10:
                    _this.AIminiProgramStatus = true;
                    break;
                }
              } else {
                switch (parseInt(element.toolType)) {
                  case 10:
                    _this.AIminiProgramStatus = false;
                    break;
                }
              }
            });
          }
        } else {
          _this.AIminiProgramStatus = false;
        }
      }).catch(function (err) {
        console.log(err);
        _this.AIminiProgramStatus = false;
      });
    },

    // 预约挂号
    goDepartment: function goDepartment(e) {
      console.log(1);
      this.pathObj = {
        path: "department",
        obj: ""
      };
      if (this.clickLimit) {
        this.clickLimit = false;
        __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].createTrack({
          actionId: 14241
        });
        if (e.target.userInfo) {
          this.ensureShow = false;
          wx.navigateTo({
            url: '/packageD/registration/orderDepartment'
          });
          Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
            successCallBack: function successCallBack(res) {}
          });
        } else {
          this.ensureShow = true;
        }
      }
    }
  },
  mounted: function mounted() {},
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].leaveBrowse();
  },
  onUnload: function onUnload() {},
  onLoad: function onLoad(option) {
    var _this8 = this;

    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    });
    this.recureJournalList = [];
    wx.removeStorageSync("backIndex");
    this.getRecureJournal();
    this.getPartFun();
    // this.HotWordResource();
    this.AIReadCardShow();
    this.navigateInit(option);
    this.clickLimit = true;
    wx.onNetworkStatusChange(function (res) {
      _this8.finish = false;
      if (res && !!res.isConnected) {
        // this.HotWordResource();
        // this.getRecureJournal();
      } else {
        wx.showToast({
          title: "网络中断，请检查您的网络状态",
          icon: "none",
          duration: 2000,
          mask: true
        });
      }
    });
  },
  onShow: function onShow() {
    console.log('index=====', __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].getItem('mobile'));

    var _this = this;
    wx.setNavigationBarTitle({
      title: '唯医骨科'
    });
    this.finish = false;
    this.ensureShow = false;
    this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_14_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    if (__WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].getItem("bindFinish") && __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].getItem("cacheObj")) {
      var obj = JSON.parse(__WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].getItem("cacheObj"));
      wx.navigateTo({
        url: "/packageF/journalDetail/journalDetail?rId=" + obj.diaryId + "&acId=" + obj.authorId + "&from=home"
      });
      __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("cacheObj");
      __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("bindFinish");
    }
    __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("PCIMLinks");
    __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("patientInfo");

    // 清除医生主页、患教手册、患教详情页的缓存；
    __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("patientInfo");
    __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("patientInfo");
    __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].removeItem("patientInfo");

    this.quickSearch = '';
    __WEBPACK_IMPORTED_MODULE_15_dataLog__["a" /* default */].enterBrowse();
    this.clickLimit = true;
    wx.getLocation({
      type: 'wgs84',
      success: function success(res) {
        var location = {
          latitude: res ? res.latitude : "", //经度
          longitude: res ? res.longitude : "", //纬度
          speed: res ? res.speed : "" //移动速度
        };
        __WEBPACK_IMPORTED_MODULE_16_localStorage__["a" /* default */].setItem("location", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(location));
      },
      fail: function fail(err) {
        console.log("用户拒绝授权，无法获取位置信息");
      }
    });
    __WEBPACK_IMPORTED_MODULE_6_common_js_util_util__["a" /* default */].getLocationCity({
      name: "北京市"
    }).then(function (res) {
      console.log(res);
      if (!res.isfail && res.isCover) {
        // 定位城市在 所属范围
        _this.isCoverCity = true; // 定位城市
        // _this.getHealthCardList(); // 获取健康卡列表
      }
    });
  }
});

/***/ }),

/***/ 320:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_miniProgram_vue__ = __webpack_require__(322);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ca2ff218_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_miniProgram_vue__ = __webpack_require__(323);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(321)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_miniProgram_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ca2ff218_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_miniProgram_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/miniProgram.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] miniProgram.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ca2ff218", Component.options)
  } else {
    hotAPI.reload("data-v-ca2ff218", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 321:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 322:
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

/**
 * 使用场景：   小程序跳转
 * 引入使用：   <MiniProgram :propClass="'item'" :miniProgramParam='miniParams'></MiniProgram>
 * 参数格式:
 *             miniParams:{
                   name:'智能咨询',      //名字
                   path:'',             //指定小程序页面
                   extraData:{
                       a:'1',
                       b:'2',
                       c:'3'
                   }
               }
 *
*/
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      appId: "",
      appIdList: ["wxa188055d5e77a7fb"], //app-id list
      version: "release", //develop（开发版），trial（体验版），release（正式版）
      extraData: {}, //参数
      path: "", //指定小程序页面
      propText: '' //文本
    };
  },
  onLoad: function onLoad() {
    console.log(this.miniProgramParam);
    var _this = this;
    var _propData = _this.miniProgramParam;
    //指定appId
    switch (_propData.name) {
      case "智能咨询":
        this.appId = this.appIdList[0];
        break;
      case "AIReadCard":
        this.appId = this.appIdList[0];
    }
    //指定参数
    if (_propData.extraData && _propData.extraData.length > 0) {
      this.extraData = _propData.extraData;
    }
    //指定页面
    if (_propData.path && _propData.path.length > 0) {
      this.path = _propData.path;
    }
  },

  methods: {
    navigateFn: function navigateFn() {
      var _this = this;
      wx.navigateToMiniProgram({
        appId: _this.appId,
        path: _this.path,
        extraData: _this.extraData,
        envVersion: _this.version,
        success: function success(res) {
          // 打开成功
          console.log(res);
        }
      });
    }
  },
  props: {
    miniProgramParam: {
      type: Object,
      default: {}
    },
    propClass: {
      type: String
    }
  }
});

/***/ }),

/***/ 323:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    class: _vm.propClass,
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.navigateFn()
      }
    }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ca2ff218", esExports)
  }
}

/***/ }),

/***/ 337:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getPartList;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__ = __webpack_require__(8);


/**
 * @Desc：首页获取部位列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by liChenYang on 2018/12/04.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getDiaryPartList/";



function getPartList(param) {
  var _default = {};

  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
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

/***/ 338:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getHealthCardList;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);


/**
 * @Desc：获取健康卡列表
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by JK on 2019/04/03.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getDiaryPartList/";

function getHealthCardList(param) {
  var _default = {};
  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
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

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "mHome"
  }, [_c('section', {
    staticClass: "Home"
  }, [_c('section', {
    staticClass: "searchDocOut"
  }, [_c('section', {
    staticClass: "searchDoc",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.goIndexSearch
    }
  }, [_vm._v("搜索医生、康复日记")])], 1), _vm._v(" "), _c('button', {
    staticClass: "registered",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '1'
    },
    on: {
      "getuserinfo": _vm.goDepartment
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.5.0/order_door.png"
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "indexBox"
  }, [_c('button', {
    staticClass: "halfPart1",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '2'
    },
    on: {
      "getuserinfo": _vm.Searchdoctor
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_found_doctor.png"
    }
  })]), _vm._v(" "), _c('button', {
    staticClass: "halfPart2",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '3'
    },
    on: {
      "getuserinfo": _vm.goConsult
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.5.0/index_quick_visits.png"
    }
  })])], 1), _vm._v(" "), (_vm.AIminiProgramStatus) ? _c('section', {
    staticClass: "AIminiProgram",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.jumpToMini()
      }
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/bannerNew.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('MiniProgram', {
    attrs: {
      "propClass": 'AIminiProgram-item',
      "miniProgramParam": _vm.miniParams,
      "mpcomid": '0'
    }
  })], 1) : _vm._e(), _vm._v(" "), (_vm.isCoverCity && !_vm.hasCard) ? _c('section', {
    staticClass: "health-card",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.goToHealthCard()
      }
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "middle-box"
  }), _vm._v(" "), _c('figure', {
    staticClass: "history"
  }, [_c('header', [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '7'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('h3', {
    staticClass: "journalTitle"
  }, [_vm._v("康复日记")]), _vm._v(" "), _c('button', {
    staticClass: "addJournal",
    attrs: {
      "open-type": "getUserInfo",
      "type": "submit",
      "formType": "submit",
      "eventid": '6'
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
  }, [_vm._v("我也要写")])])], 1)], 1), _vm._v(" "), _c('ul', {
    staticClass: "journalClassifyList"
  }, [_c('li', {
    staticClass: "journalClassifyItem",
    class: {
      selected: _vm.partSelected == -1
    },
    attrs: {
      "eventid": '8'
    },
    on: {
      "click": function($event) {
        _vm.partSelectedFun(-1)
      }
    }
  }, [_vm._v("\n          全部\n        ")]), _vm._v(" "), _vm._l((_vm.partList), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "journalClassifyItem",
      class: {
        selected: _vm.partSelected == index
      },
      attrs: {
        "eventid": '9-' + index
      },
      on: {
        "click": function($event) {
          _vm.partSelectedFun(index)
        }
      }
    }, [_vm._v("\n          " + _vm._s(item.propertyName) + "\n        ")])
  })], 2), _vm._v(" "), _c('recureJournal', {
    attrs: {
      "journalData": _vm.recureJournalList,
      "eventid": '10',
      "mpcomid": '1'
    },
    on: {
      "FromChild": _vm.jumpToDiary,
      "clickCallback": _vm.rjTrack
    }
  }), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.recureJournalList.length > 0),
      expression: "recureJournalList.length>0"
    }],
    staticClass: "extraLine"
  }, [_vm._v(_vm._s(_vm.toBottom ? '正在加载..' : '--到底了--'))])], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '11',
      "mpcomid": '2'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '3'
    }
  })], 1), _vm._v(" "), _c('customizedTabbar', {
    attrs: {
      "selected": 1,
      "checkedPhone": _vm.mobileOnOff,
      "eventid": '12',
      "mpcomid": '4'
    },
    on: {
      "FromChild": _vm.jumpToUrl,
      "goToMessage": _vm.jumpToMessage
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '5'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1a68a634", esExports)
  }
}

/***/ })

},[1204]);