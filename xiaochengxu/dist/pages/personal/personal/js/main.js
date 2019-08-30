global.webpackJsonp([13],{

/***/ 445:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_personal_vue__ = __webpack_require__(447);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ec5748d8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_personal_vue__ = __webpack_require__(453);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(446)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_personal_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ec5748d8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_personal_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/personal/personal.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] personal.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ec5748d8", Component.options)
  } else {
    hotAPI.reload("data-v-ec5748d8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 446:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 447:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_mpvue_cropper__ = __webpack_require__(448);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_customizedTabbar__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_GetPhoneAuthorization__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getDiaryStatistics__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_createJournal__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_vuex__ = __webpack_require__(4);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//










 // 获取日记数量
 // 创建日记接口



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    var mobileOnOff = __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    return {
      finish: false,
      authorizationFlag: false,
      buttonShow: false,
      cropperShow: false,
      clickAble: true,
      mobileOnOff: mobileOnOff,
      baseInfo: {
        nickName: "",
        headUrl: "",
        mobile: ''
      },
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      diaryNum: -1, // 有效康复日记总数
      diaryTotal: 0, // 康复日记总数
      sumPreferUpNum: 0 // 康复日记点赞数
    };
  },

  components: {
    // MpvueCropper,
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_2_components_ensure__["a" /* default */],
    customizedTabbar: __WEBPACK_IMPORTED_MODULE_4_components_customizedTabbar__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_5_components_loading__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_12_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_13_components_authorization_authorization__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_14_vuex__["d" /* mapGetters */])(['userInfoEnd'])),
  watch: {
    userInfoEnd: function userInfoEnd(newVal, oldVal) {
      console.log(newVal);
      console.log('获取到信息');
      var _this = this;
      _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    }
  },
  methods: {
    continueRecording: function continueRecording() {
      var _this2 = this;

      if (this.clickAble) {
        this.clickAble = false;
        wx.navigateTo({
          url: "/packageF/journal/journalList?patientCustomerId=" + wx.getStorageSync('userId') + "&from=personal"
        });
        setTimeout(function () {
          _this2.clickAble = true;
        }, 2000);
      }
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    // 获取是否有康复日记
    getDiaryStatisticsFun: function getDiaryStatisticsFun() {
      var _this3 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getDiaryStatistics__["a" /* default */])({
        patientCustomerId: wx.getStorageSync('userId'),
        isValid: 1
      }).then(function (res) {
        console.log(res);
        if (res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          var _res$responseObject$r = res.responseObject.responseData.dataList[0],
              diaryNum = _res$responseObject$r.diaryNum,
              diaryTotal = _res$responseObject$r.diaryTotal,
              sumPreferUpNum = _res$responseObject$r.sumPreferUpNum;

          _this3.diaryTotal = diaryTotal;
          _this3.diaryNum = diaryNum;
          _this3.sumPreferUpNum = sumPreferUpNum;
        } else {
          console.log('获取康复日记数量失败');
        }
      });
    },

    //跳转到我的医生列表
    jumpToMessage: function jumpToMessage(e) {
      var _this4 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/myConsult/myConsult'
        });
        Object(__WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {},
          failCallBack: function failCallBack(res) {
            _this4.finish = true;
            setTimeout(function () {
              _this4.finish = false;
            }, 2000);
          }
        });
      } else {
        this.ensureShow = true;
      }
    },

    //跳转到个人中心
    jumpToUrl: function jumpToUrl(e) {
      var _this5 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/personal/personal'
        });
        Object(__WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__["a" /* default */])({
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
    createJournalFun: function createJournalFun(diaryTotal) {
      var _this6 = this;

      wx.showLoading({
        mask: true
      });
      Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_createJournal__["a" /* default */])({
        authorId: wx.getStorageSync('userId'),
        sourceDiaryType: 4
      }).then(function (res) {
        console.log(res);
        if (res.responseObject && res.responseObject.responseStatus) {
          wx.navigateTo({
            url: "/packageF/journal/journalEditor?isRedirect=true&patientCustomerId=" + wx.getStorageSync('userId') + (_this6.diaryTotal ? '&isShowTip=' : '') + (_this6.diaryTotal ? false : '') + "&journalId=" + res.responseObject.responsePk
          });
          wx.hideLoading();
        } else {
          console.log('创建康复日记失败');
        };
      });
    },
    goToPage: function goToPage(index, e) {
      var _this7 = this;

      if (this.clickAble) {
        this.clickAble = false;
        switch (index) {
          case 1:
            __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
              actionId: 14184,
              browseType: "127",
              opDesc: "我的（小程序）"
            });

            if (e.target.userInfo) {
              this.ensureShow = false;
              if (this.buttonShow) {
                wx.navigateTo({
                  url: '/pages/login/login?from=1'
                });
              } else {
                wx.navigateTo({
                  url: '/pages/myConsult/myConsult'
                });
              }
            } else {
              this.ensureShow = true;
            }

            break;
          case 4:
            __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
              actionId: 14187,
              browseType: "127",
              opDesc: "我的（小程序）"
            });
            wx.navigateTo({
              url: '/pages/feedback/feedback'
            });
            break;
          case 5:
            wx.navigateTo({
              url: '/pages/personalDetail/personalDetail'
            });
            break;
          case 6:
            if (e.target.userInfo) {
              this.ensureShow = false;
              if (this.buttonShow) {
                wx.navigateTo({
                  url: '/pages/login/login?from=3&needSession=1'
                });
              } else {
                this.createJournalFun();
              }
            } else {
              this.ensureShow = true;
            }
            break;
          case 7:
            if (true) {
              wx.navigateTo({
                url: '/packageD/healthCard/healthCardList'
              });
            } else {
              wx.navigateTo({
                url: '/pages/login/login?from=3&needSession=1'
              });
            }
            break;
          case 8:
            //预约挂号
            __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
              actionId: 14240
            });
            if (e.target.userInfo) {
              this.ensureShow = false;
              if (this.buttonShow) {
                wx.navigateTo({
                  url: '/pages/login/login?from=8'
                });
              } else {
                wx.navigateTo({
                  url: '/packageD/registration/myOrderList'
                });
              }
            } else {
              this.ensureShow = true;
            }
            break;
        }
      };
      setTimeout(function () {
        _this7.clickAble = true;
      }, 3000);
    },
    goToPagePhoneNumber: function goToPagePhoneNumber(index, info) {
      console.log(index);
      var _this = this;
      var e = info.mp;
      console.log(e);
      __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].init({
        info: e,
        cancelBack: function cancelBack() {
          console.log('取消');
        },
        successBack: function successBack() {
          console.log('成功');
          if (_this.clickAble) {
            _this.clickAble = false;
            switch (index) {
              case 1:
                __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
                  actionId: 14184,
                  browseType: "127",
                  opDesc: "我的（小程序）"
                });
                if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                  // _this.mobileOnOff = true
                  wx.navigateTo({
                    url: '/pages/personal/personal'
                  });
                } else {
                  _this.mobileOnOff = false;
                }
                break;
              case 2:
                __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
                  actionId: 14185,
                  browseType: "127",
                  opDesc: "我的（小程序）"
                });
                if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                  // _this.mobileOnOff = true
                  wx.navigateTo({
                    url: '/pages/personal/personal'
                  });
                } else {
                  _this.mobileOnOff = false;
                }
                break;
              case 4:
                __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
                  actionId: 14187,
                  browseType: "127",
                  opDesc: "我的（小程序）"
                });
                wx.navigateTo({
                  url: '/pages/feedback/feedback'
                });
                break;
              case 5:
                wx.navigateTo({
                  url: '/pages/personalDetail/personalDetail'
                });
                break;
              case 6:
                if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                  // _this.mobileOnOff = true
                  wx.navigateTo({
                    url: '/pages/personal/personal'
                  });
                } else {
                  _this.mobileOnOff = false;
                }
                break;
              case 7:
                if (true) {
                  wx.navigateTo({
                    url: '/packageD/healthCard/healthCardList'
                  });
                } else {
                  wx.navigateTo({
                    url: '/pages/personal/personal'
                  });
                }
                break;
              case 8:
                //预约挂号
                __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
                  actionId: 14240
                });
                if (!(e.detail.errMsg == 'getPhoneNumber:fail user deny')) {
                  // _this.mobileOnOff = true
                  wx.navigateTo({
                    url: '/pages/personal/personal'
                  });
                } else {
                  _this.mobileOnOff = false;
                }
                break;
            }
          };
          setTimeout(function () {
            _this.clickAble = true;
          }, 3000);
        }
      });
    },
    goLogin: function goLogin(e) {
      if (this.finish) return false;
      this.finish = true;
      __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].createTrack({
        actionId: 14183,
        browseType: "127",
        opDesc: "我的（小程序）"
      });
      if (e.target.userInfo) {
        this.finish = false;
        this.ensureShow = false;
        wx.navigateTo({
          url: '/pages/login/login?needSession=1'
        });
      } else {
        this.finish = false;
        this.ensureShow = true;
      }
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.errMsg === "openSetting:ok") {
        this.ensureShow = false;
      } else {
        this.ensureShow = true;
      }
    },
    checkLogin: function checkLogin() {
      var _this = this;
      _this.finish = true;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            _this.finish = false;
            _this.buttonShow = false; //已绑定手机...
            _this.baseInfo = res.data.responseObject.responseData;
            if (_this.diaryNum == -1 || _this.diaryNum == 0) {
              _this.getDiaryStatisticsFun();
            }
          } else {
            _this.finish = false;
            _this.buttonShow = true; //未绑定手机...出现去登录按钮
            _this.baseInfo = {
              nickName: res.data.responseObject.responseData.nickName,
              headUrl: res.data.responseObject.responseData.headUrl,
              mobile: ""
            };
          }
        }, failCallBack: function failCallBack(err) {
          _this.finish = false;
          _this.buttonShow = true;
        }
      });
    },
    getAuthorize: function getAuthorize(e) {
      var _this8 = this;

      // this.finish = true;
      if (e.target.userInfo) {
        this.ensureShow = false;
        this.authorizationFlag = false;
        wx.getUserInfo({
          success: function success(res) {
            //已授权...尝试检测手机号绑定
            _this8.checkLogin();
          }
        });
      } else {
        this.ensureShow = true;
        this.finish = false;
      }
    }
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("mobile") && __WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("mobile").length > 0) {
      this.buttonShow = false;
    } else {
      this.buttonShow = true;
    }
    this.baseInfo = {
      nickName: __WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("nickName") || "",
      headUrl: __WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("logoUrl") || "",
      mobile: __WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("mobile") || ""
    };
    console.log(__WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("needRefresh"));
    if (__WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].getItem("needRefresh")) {
      this.checkLogin();
      __WEBPACK_IMPORTED_MODULE_8_localStorage__["a" /* default */].removeItem("needRefresh");
    }
    this.getDiaryStatisticsFun();
    this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    console.log('personal ===', this.mobileOnOff);
  },
  onHide: function onHide() {
    this.clickAble = true;
    __WEBPACK_IMPORTED_MODULE_7_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad() {
    var _this9 = this;

    this.buttonShow = false;
    this.diaryNum = -1;
    this.authorizationFlag = false;
    wx.setNavigationBarTitle({
      title: '我的'
    });
    // this.finish = true;
    //显示授权提示
    wx.getSetting({
      success: function success(res) {
        //已授权...
        if (res && res.authSetting["scope.userInfo"]) {
          _this9.authorizationFlag = false;
          _this9.checkLogin();
        } else {
          //未授权...
          // this.finish = false;
          _this9.authorizationFlag = true;
        }
      },
      fail: function fail() {
        // this.finish = true;
        console.log('获取授权失败');
      }
    });
  },
  onUnload: function onUnload() {
    this.clickAble = true;
  }
});

/***/ }),

/***/ 448:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mpvue_cropper_vue__ = __webpack_require__(450);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2027d1a7_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mpvue_cropper_vue__ = __webpack_require__(452);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(449)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_mpvue_cropper_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2027d1a7_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_mpvue_cropper_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "node_modules/mpvue-cropper/mpvue-cropper.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] mpvue-cropper.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2027d1a7", Component.options)
  } else {
    hotAPI.reload("data-v-2027d1a7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* unused harmony default export */ var _unused_webpack_default_export = (Component.exports);


/***/ }),

/***/ 449:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 450:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_we_cropper__ = __webpack_require__(451);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_we_cropper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_we_cropper__);


//
//
//
//
//
//
//
//
//
//
//
//



var _wecropper = void 0;

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'mpvue-cropper',
  props: {
    option: {
      type: Object
    }
  },
  computed: {
    _canvasId: function _canvasId() {
      return this.option.id;
    },
    _width: function _width() {
      return this.option.width;
    },
    _height: function _height() {
      return this.option.height;
    }
  },
  methods: {
    touchstart: function touchstart($event) {
      _wecropper.touchStart($event.mp);
    },
    touchmove: function touchmove($event) {
      _wecropper.touchMove($event.mp);
    },
    touchend: function touchend($event) {
      _wecropper.touchEnd($event.mp);
    },
    pushOrigin: function pushOrigin(src) {
      _wecropper.pushOrign(src);
    },
    updateCanvas: function updateCanvas() {
      _wecropper.updateCanvas();
    },
    getCropperBase64: function getCropperBase64() {
      return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        _wecropper.getCropperImage(function (src) {
          src ? resolve(src) : reject();
        });
      });
    },
    getCropperImage: function getCropperImage() {
      return new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        _wecropper.getCropperImage(function (src) {
          src ? resolve(src) : reject();
        });
      });
    },
    init: function init() {
      var _this = this;

      _wecropper = new __WEBPACK_IMPORTED_MODULE_2_we_cropper___default.a(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_object_assign___default()(this.option, {
        id: this._canvasId
      })).on('ready', function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.$emit.apply(_this, ['ready'].concat(args));
      }).on('beforeImageLoad', function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _this.$emit.apply(_this, ['beforeImageLoad'].concat(args));
      }).on('imageLoad', function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        _this.$emit.apply(_this, ['imageLoad'].concat(args));
      }).on('beforeDraw', function () {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        _this.$emit.apply(_this, ['beforeDraw'].concat(args));
      }).updateCanvas();
    }
  },
  onLoad: function onLoad() {
    if (!this.option) {
      return console.warn('[mpvue-cropper] 请传入option参数\n参数配置见文档：https://we-plugin.github.io/we-cropper/#/api');
    }
    this.init();
  }
});

/***/ }),

/***/ 452:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm._canvasId) ? _c('canvas', {
    style: ({
      width: _vm._width + 'px',
      height: _vm._height + 'px',
      background: 'rgba(0, 0, 0, .8)'
    }),
    attrs: {
      "canvasId": _vm._canvasId,
      "disable-scroll": "",
      "eventid": '0'
    },
    on: {
      "touchstart": _vm.touchstart,
      "touchmove": _vm.touchmove,
      "touchend": _vm.touchend
    }
  }) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2027d1a7", esExports)
  }
}

/***/ }),

/***/ 453:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [(_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.authorizationFlag) ? _c('div', {
    staticClass: "index"
  }, [_c('section', {
    staticClass: "header"
  }, [(_vm.baseInfo.mobile.length > 0) ? _c('image', {
    staticClass: "dp",
    attrs: {
      "src": _vm.baseInfo.headUrl,
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goToPage(5)
      }
    }
  }) : _vm._e(), _vm._v(" "), (_vm.baseInfo.mobile.length > 0) ? _c('span', {
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.goToPage(5)
      }
    }
  }, [_vm._v(_vm._s(_vm.baseInfo.nickName))]) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('button', {
    staticClass: "loginButton",
    attrs: {
      "open-type": "getPhoneNumber",
      "eventid": '2'
    },
    on: {
      "getphonenumber": function($event) {
        _vm.goToPagePhoneNumber(1, $event)
      }
    }
  }, [_vm._v("快速登录/注册\n      ")]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "item-list"
  }, [(_vm.baseInfo.mobile > 0 && !_vm.authorizationFlag && _vm.diaryNum > 0) ? _c('section', {
    staticClass: "item",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": _vm.continueRecording
    }
  }, [_c('img', {
    staticClass: "listIcon",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/Rectangle.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("康复日记")]), _vm._v(" "), _c('section', {
    staticClass: "haveJournal"
  }, [_c('dl', {
    staticClass: "haveItem"
  }, [_c('dt', {
    staticClass: "num journal"
  }, [_vm._v(_vm._s(_vm.diaryNum))]), _vm._v(" "), _c('dd', {
    staticClass: "title"
  }, [_vm._v("我的日记")])], 1), _vm._v(" "), _c('dl', {
    staticClass: "haveItem"
  }, [_c('dt', {
    staticClass: "num hearten"
  }, [_vm._v(_vm._s(_vm.sumPreferUpNum))]), _vm._v(" "), _c('dd', {
    staticClass: "title"
  }, [_vm._v("患友鼓励")])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "addJournal updateJournal"
  }, [_c('img', {
    staticClass: "addIcon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "addText"
  }, [_vm._v("继续更新日记")])])], 1) : _c('section', {
    staticClass: "item"
  }, [_c('img', {
    staticClass: "listIcon",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/Rectangle.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("康复日记")]), _vm._v(" "), (_vm.mobileOnOff) ? _c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '4'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.baseInfo.mobile.length === 0 || _vm.authorizationFlag || _vm.diaryNum == 0) ? _c('button', {
    staticClass: "addJournal",
    attrs: {
      "open-type": "getUserInfo",
      "type": "submit",
      "formType": "submit",
      "eventid": '3'
    },
    on: {
      "getuserinfo": function($event) {
        _vm.goToPage(6, $event)
      }
    }
  }, [_c('img', {
    staticClass: "addIcon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "addText"
  }, [_vm._v("写第一篇日记")])]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '6'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.baseInfo.mobile.length === 0 || _vm.authorizationFlag || _vm.diaryNum == 0) ? _c('button', {
    staticClass: "addJournal",
    attrs: {
      "open-type": "getPhoneNumber",
      "type": "submit",
      "formType": "submit",
      "eventid": '5'
    },
    on: {
      "getphonenumber": function($event) {
        _vm.goToPagePhoneNumber(6, $event)
      }
    }
  }, [_c('img', {
    staticClass: "addIcon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/add-simple.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "addText"
  }, [_vm._v("写第一篇日记")])]) : _vm._e()], 1) : _vm._e()], 1), _vm._v(" "), (_vm.mobileOnOff) ? _c('button', {
    staticClass: "item",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '8'
    },
    on: {
      "getuserinfo": function($event) {
        _vm.goToPage(1, $event)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon special",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/myDoctor.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("问诊消息")]), _vm._v(" "), _c('span', {
    staticClass: "extension"
  }, [_vm._v("诊后报到 咨询记录")])]) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('button', {
    staticClass: "item",
    attrs: {
      "open-type": "getPhoneNumber",
      "eventid": '9'
    },
    on: {
      "getphonenumber": function($event) {
        _vm.goToPagePhoneNumber(1, $event)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon special",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/myDoctor.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("问诊消息")]), _vm._v(" "), _c('span', {
    staticClass: "extension"
  }, [_vm._v("诊后报到 咨询记录")])]) : _vm._e(), _vm._v(" "), (false) ? _c('button', {
    staticClass: "item",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '10'
    },
    on: {
      "getuserinfo": function($event) {
        _vm.goToPage(7, $event)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon special",
    attrs: {
      "src": "http://m.allinmed.cn/static/image/mp/index/1.4.0/icon@3x.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("我的居民健康卡")]), _vm._v(" "), _c('span', {
    staticClass: "getCard"
  }, [_vm._v("可领取")])]) : _vm._e(), _vm._v(" "), (_vm.mobileOnOff) ? _c('button', {
    staticClass: "item",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '11'
    },
    on: {
      "getuserinfo": function($event) {
        _vm.goToPage(8, $event)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon order",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/order_mine.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("我的预约挂号")])]) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('button', {
    staticClass: "item",
    attrs: {
      "open-type": "getPhoneNumber",
      "eventid": '12'
    },
    on: {
      "getphonenumber": function($event) {
        _vm.goToPagePhoneNumber(8, $event)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon order",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/order_mine.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("我的预约挂号")])]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "item",
    attrs: {
      "eventid": '13'
    },
    on: {
      "click": function($event) {
        _vm.goToPage(4)
      }
    }
  }, [_c('img', {
    staticClass: "listIcon",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/suggestion.png"
    }
  }), _vm._v(" "), _c('span', [_vm._v("建议反馈")])])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.authorizationFlag) ? _c('div', {
    staticClass: "authorization"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/report/authorization.png"
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "text"
  }, [_vm._v("获取信息失败，请先授权")]), _vm._v(" "), _c('button', {
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '14'
    },
    on: {
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("去授权")])], 1) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '15',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), _c('customizedTabbar', {
    attrs: {
      "selected": 2,
      "checkedPhone": _vm.mobileOnOff,
      "eventid": '16',
      "mpcomid": '2'
    },
    on: {
      "FromChild": _vm.jumpToUrl,
      "goToMessage": _vm.jumpToMessage
    }
  }), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '3'
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '4'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ec5748d8", esExports)
  }
}

/***/ })

},[1222]);