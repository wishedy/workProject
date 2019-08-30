global.webpackJsonp([27],{

/***/ 562:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_myConsult_vue__ = __webpack_require__(564);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_b9768fd4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_myConsult_vue__ = __webpack_require__(565);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(563)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_myConsult_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_b9768fd4_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_myConsult_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/myConsult/myConsult.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] myConsult.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b9768fd4", Component.options)
  } else {
    hotAPI.reload("data-v-b9768fd4", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 563:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 564:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_components_customizedTabbar__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_miniUtil_GetPhoneAuthorization__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_getServiceCommentStatus__ = __webpack_require__(132);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  getOrderHistoryLists: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/case/consultation/v1/getMapList/', //咨询历史接口
  getPicList: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/patient/recovery/advice/v1/getMapList/' //图片列表
};




/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    var mobileOnOff = __WEBPACK_IMPORTED_MODULE_11_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    return {
      finish: false,
      noFriend: false,
      noMoreShow: false,
      pageStart: 0,
      pageNum: 20,
      historyLists: [],
      authorizationFlag: false,
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      mobileOnOff: mobileOnOff,
      clickStatus: true
    };
  },
  onPullDownRefresh: function onPullDownRefresh() {
    this.pageStart = 0;
    this.noMoreShow = false;
    this.historyLists = [];
    this.getConsultLists("get");
  },
  onShow: function onShow() {
    if (__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("backFromImgCheck")) {
      this.pageStart = 0;
      this.noMoreShow = false;
      this.historyLists = [];
      this.getConsultLists("get");
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("backFromImgCheck");
    }
  },
  onLoad: function onLoad() {
    var _this2 = this;

    this.init();
    wx.onNetworkStatusChange(function (res) {
      _this2.finish = false;
      console.log("netStatus:");
      console.log(res);
      if (res && !!res.isConnected) {} else {}
    });
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_10_vuex__["d" /* mapGetters */])(['userInfoEnd'])),
  watch: {
    userInfoEnd: function userInfoEnd(newVal) {
      console.log(newVal);
      console.log('获取到信息');
      var _this = this;
      _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_11_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].leaveBrowse();
  },
  onReachBottom: function onReachBottom() {
    if (!this.noMoreShow) {
      this.pageStart += this.pageNum;
      this.getConsultLists("pull");
    }
  },

  methods: {
    //跳转到我的医生列表
    jumpToMessage: function jumpToMessage(e) {
      var _this3 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/myConsult/myConsult'
        });
        Object(__WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__["a" /* default */])({
          successCallBack: function successCallBack(res) {},
          failCallBack: function failCallBack(res) {
            _this3.finish = true;
            setTimeout(function () {
              _this3.finish = false;
            }, 2000);
          }
        });
      } else {
        this.ensureShow = true;
      }
    },

    //跳转到个人中心
    jumpToUrl: function jumpToUrl(e) {
      var _this4 = this;

      if (e.desc) {
        wx.redirectTo({
          url: '/pages/personal/personal'
        });
        Object(__WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__["a" /* default */])({
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
    init: function init() {
      this.pageStart = 0;
      this.finish = false;
      this.noFriend = false;
      this.noMoreShow = false;
      this.authorizationFlag = false;
      this.ensureShow = false;
      this.clickStatus = true;
      this.historyLists = [];
      this.checkAuthorize();
    },
    trackCallback: function trackCallback() {
      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14192
      });
    },
    checkAuthorize: function checkAuthorize() {
      var that = this;
      wx.getSetting({
        success: function success(res) {
          console.log(res);
          if (res && res.authSetting["scope.userInfo"]) {
            that.authorizationFlag = false;
            that.getConsultLists("get");
          } else {
            that.authorizationFlag = true;
            __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].enterBrowse({
              browseType: "124",
              opDesc: "授权页面（独立授权页）（小程序）"
            });
          }
        }
      });
    },
    getAuthorize: function getAuthorize(obj) {
      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14188
      });
      if (obj.target.userInfo) {
        this.ensureShow = false;
        this.getLoginInfo();
      } else {
        this.ensureShow = true;
      }
    },
    getLoginInfo: function getLoginInfo() {
      var that = this;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            that.authorizationFlag = false;
            that.getConsultLists();
          } else {
            wx.navigateTo({
              url: '/pages/login/login?backPage=myConsult'
            });
          }
        }
      });
    },
    goToSetting: function goToSetting(e) {
      var that = this;
      if (e.mp.detail.errMsg === "openSetting:ok") {
        that.ensureShow = false;
        that.getLoginInfo();
      } else {
        that.ensureShow = true;
      }
    },
    getConsultLists: function getConsultLists(type) {
      var that = this;
      that.finish = true;
      wx.stopPullDownRefresh();
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getOrderHistoryLists,
        method: "POST",
        data: {
          patientCustomerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId"),
          isValid: 1,
          firstResult: that.pageStart,
          maxResult: that.pageNum,
          logoUseFlag: 3,
          visitSiteId: 24 //站点  （美年需求新增）
        },
        done: function done(response) {
          that.finish = false;
          if (response && response.responseObject.responseData.dataList && response.responseObject.responseData.dataList.length > 0) {
            var temp = response.responseObject.responseData.dataList;
            temp.forEach(function (element) {
              element.statusName = that.getStatusName(element).statusName;
              element.fontGray = that.getStatusName(element).fontGray;
              element.logoImg = that.getImgUrl(element);
              element.showName = that.getShowName(element);
              element.showTime = that.getCaseTime(element.createTime);
              element.patientNameShow = element.patientName.length > 5 ? element.patientName.substring(0, 5) + "..." : element.patientName;
              element.company = element.company.length > 15 ? element.company.substring(0, 15) + "..." : element.company;
              //                element.showNameAfter = that.getShowNameAfter(element);
            });
            that.historyLists = that.historyLists.concat(temp);
            if (type === "get") {
              if (that.historyLists.length === 0) {
                __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].enterBrowse({
                  browseType: "120",
                  opDesc: "无记录页面（小程序）"
                });
              } else {
                __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].enterBrowse({
                  browseType: "119",
                  opDesc: "无记录页面（小程序）"
                });
              }
            }
          } else {
            if (that.pageStart == 0) {
              that.noFriend = true;
            } else {
              that.noMoreShow = true;
            }
          }
        }
      });
    },
    getImgUrl: function getImgUrl(opt) {
      var logoImg = '';
      //分诊医生
      if (opt.consultationType == 0) {
        //判断头像
        if (opt.caseType == 0 || opt.caseType == 15) {
          logoImg = "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png";
        } else {
          logoImg = "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png";
        }
      } else {
        //判断头像
        if (opt.logoUrl) {
          logoImg = opt.logoUrl;
        } else {
          logoImg = "https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png";
        }
      }
      return logoImg;
    },
    getStatusName: function getStatusName(opt) {
      var statusName = '',
          fontGray = '';
      if (opt.consultationType == 0) {
        //分诊医生
        if (opt.doctorState == 0) {
          switch (Number(opt.consultationState)) {
            case -1:
            case 0:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
              statusName = '咨询中';
              break;
            case 1:
            case 7:
            case 8:
              statusName = '已结束';
              fontGray = 'font-gray';
              break;
          }
        } else if (opt.doctorState == 1) {
          statusName = '已结束';
          fontGray = 'font-gray';
        }
      } else {
        //医生
        switch (Number(opt.consultationState)) {
          case -1:
            statusName = '待接诊';
            break;
          case 0:
            statusName = '咨询中';
            break;
          case 1:
          case 11:
            if (opt.caseType == 15) {
              statusName = '咨询中';
            } else {
              statusName = '已结束';
              fontGray = 'font-gray';
            }
            break;
          case 2:
            statusName = '已拒绝';
            fontGray = 'font-gray';
            break;
          case 3:
            if (opt.caseType == '15') {
              statusName = '已拒绝';
            } else {
              statusName = '已超时';
            }
            fontGray = 'font-gray';
            break;
        }
      }
      return {
        statusName: opt.caseType == 14 ? "诊后报到" : statusName,
        fontGray: fontGray
      };
    },
    getShowName: function getShowName(opt) {
      if (opt.consultationType == 0) {
        if (opt.caseType == 0 || opt.caseType == 15) {
          return "分诊医生";
        } else {
          return opt.doctorName + "医生助理";
        }
      } else {
        if (opt.fullName.length > 6) {
          return opt.fullName.substring(0, 6) + "...";
        } else {
          return opt.fullName;
        }
      }
    },
    getShowNameAfter: function getShowNameAfter(opt) {
      if (opt.consultationType == 1) {
        return opt.company;
      } else {
        if (opt.consultationType == 1) {
          return "图文咨询 " + this.getCaseTime(opt.createTime);
        } else {
          return " " + this.getCaseTime(opt.createTime);
        }
      }
    },
    getCaseTime: function getCaseTime(times) {
      var time = times.substring(0, 19).replace(/-/g, "/");
      var format = function format(num) {
        return num > 9 ? num : "0" + num;
      };
      var normalTime = function normalTime(time) {
        var d = new Date(time);
        var obj = {
          y: d.getFullYear(),
          m: format(d.getMonth() + 1),
          dd: format(d.getDate()),
          h: format(d.getHours()),
          mm: format(d.getMinutes())
        };
        return obj;
      };
      var result = "";
      var now = new Date().getTime(),
          day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
          day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
      if (day1 === day2) {
        result = normalTime(time).h + ":" + normalTime(time).mm;
      } else if (normalTime(time).y === normalTime(now).y) {
        result = normalTime(time).m + "-" + normalTime(time).dd + "  " + normalTime(time).h + ":" + normalTime(time).mm;
      } else if (normalTime(time).y !== normalTime(now).y) {
        result = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd + "  " + normalTime(time).h + ":" + normalTime(time).mm;
      }
      return result;
    },
    hrefToConsult: function hrefToConsult() {
      var _this5 = this;

      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14189
      });
      this.finish = true;
      this.clickStatus = false;
      setTimeout(function () {
        _this5.clickStatus = true;
      }, 500);
      wx.navigateTo({
        url: '/packageB/consultIntro/consultIntro',
        success: function success() {
          _this5.finish = false;
        }
      });
    },
    goImPage: function goImPage(opt) {
      var _this6 = this;

      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14192
      });
      this.finish = true;
      this.clickStatus = false;
      setTimeout(function () {
        _this6.clickStatus = true;
      }, 500);
      if (opt.consultationType == 1) {
        //医生IM跳转
        if (opt.caseType == 14) {
          //跳转诊后报到IM
          wx.navigateTo({
            url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + opt.caseId + "&doctorCustomerId=" + opt.customerId + "&patientId=" + opt.patientId + "&reportId=" + opt.reportId + "&from=report",
            success: function success() {
              _this6.finish = false;
            }
          });
        } else {
          wx.navigateTo({ //跳转正常咨询IM
            url: "/packageA/imSceneDoctor/imSceneDoctor?caseId=" + opt.caseId + "&doctorCustomerId=" + opt.customerId + "&patientId=" + opt.patientId,
            success: function success() {
              _this6.finish = false;
            }
          });
        }
      } else {
        if (opt.caseType == 0) {
          //分诊医生跳转
          wx.navigateTo({ //跳转轻咨询IM
            url: "/packageA/imScene/imScene?caseId=" + opt.caseId + "&patientId=" + opt.patientId,
            success: function success() {
              _this6.finish = false;
            }
          });
        } else {
          wx.navigateTo({ //跳转找医生IM
            url: "/packageA/imScene/imScene?caseId=" + opt.caseId + "&doctorCustomerId=" + opt.customerId + "&patientId=" + opt.patientId + "&from=find",
            success: function success() {
              _this6.finish = false;
            }
          });
        }
      }
    },
    goToUploadPic: function goToUploadPic(opt) {
      var _this7 = this;

      this.finish = true;
      this.clickStatus = false;
      setTimeout(function () {
        _this7.finish = false;
        _this7.clickStatus = true;
      }, 500);
      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14191
      });
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getPicList,
        method: "POST",
        data: {
          caseId: opt.caseId,
          patientId: opt.patientId,
          isValid: 1,
          firstResult: 0,
          maxResult: 999
        },
        done: function done(response) {
          if (response && response.responseObject.responseData.dataList.length > 0) {
            var items = response.responseObject.responseData.dataList[0];
            var hisPicLists = [];
            if (items.checkMap.length > 0) {
              items.checkMap.forEach(function (element) {
                hisPicLists.push({
                  "adviceType": 3,
                  "adviceId": String(element.checkId),
                  "adviceName": element.checkName
                });
              });
            }
            if (items.inspectionMap.length > 0) {
              items.inspectionMap.forEach(function (elemen) {
                hisPicLists.push({
                  "adviceType": 3,
                  "adviceId": String(elemen.inspectionId),
                  "adviceName": elemen.inspectionName
                });
              });
            }
            wx.setStorageSync("checkInspectLists", __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(hisPicLists));
            wx.navigateTo({
              url: "/pages/upLoadImgCheck/upLoadImgCheck?caseId=" + opt.caseId + "&consultationId=" + opt.consultationId + "&triDocId=" + opt.customerId + "&from=myConsult"
            });
          }
        }
      });
    },
    goEvaluate: function goEvaluate(opt) {
      var _this8 = this;

      this.finish = true;
      this.clickStatus = false;
      setTimeout(function () {
        _this8.finish = false;
        _this8.clickStatus = true;
      }, 500);
      __WEBPACK_IMPORTED_MODULE_9_dataLog__["a" /* default */].createTrack({
        actionId: 14195
      });
      if (opt.caseType == '14') {
        this.goCommentPage(opt);
      } else {
        wx.navigateTo({
          url: "/pages/patientComment/patientComment?consultationId=" + opt.consultationId + "&doctorId=" + opt.customerId + "&patientId=" + opt.patientId
        });
      }
    },

    // 去评价
    goCommentPage: function goCommentPage(opt) {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_getServiceCommentStatus__["a" /* default */])({
        consultationId: opt.consultationId
      }).then(function (data) {
        console.log(data);
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData,
            responseMessage = _data$responseObject.responseMessage;

        if (responseStatus && !!responseData) {
          if (responseMessage == 'NO DATA') {
            wx.navigateTo({
              url: "/packageD/reportNew/doctorEvaluate?doctorId=" + opt.customerId + "&patientId=" + opt.patientId + "&consultationId=" + opt.consultationId + "&isRequest=1&patientCustomerId=" + wx.getStorageSync('userId')
            });
          } else {
            var status = responseData.status;

            if (status == 2) {
              wx.navigateTo({
                url: "/packageD/reportNew/doctorEvaluate?doctorId=" + opt.customerId + "&patientId=" + opt.patientId + "&consultationId=" + opt.consultationId + "&isRequest=1&patientCustomerId=" + wx.getStorageSync('userId')
              });
            } else {
              wx.navigateTo({
                url: "/packageD/reportNew/doctorEvaluateEnd?consultationId=" + opt.consultationId
              });
            }
          }
        } else {
          console.log('接口请求失败');
        }
      }).catch(function (err) {
        console.log(err);
      });
    }
  },
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_3_components_loading__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_6_components_ensure__["a" /* default */],
    customizedTabbar: __WEBPACK_IMPORTED_MODULE_7_components_customizedTabbar__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_8_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 565:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "orderList"
  }, [(_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.authorizationFlag) ? _c('section', {
    staticStyle: {
      "height": "100%"
    }
  }, [(_vm.historyLists.length == 0 && _vm.noFriend) ? _c('div', [_c('section', {
    staticClass: "noFriendText"
  }, [_c('p', [_vm._v("您还没有任何记录")])], 1), _vm._v(" "), _c('section', {
    staticClass: "noFriendHref"
  }, [_c('div', {
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.clickStatus && _vm.hrefToConsult()
      }
    }
  }, [_c('i', {
    staticClass: "icon"
  }), _vm._v("快速问诊")], 1)])], 1) : _c('div', {
    staticClass: "orderHistoryBox"
  }, [_vm._l((_vm.historyLists), function(item, index) {
    return (item.patientId) ? _c('section', {
      key: index,
      staticClass: "orderHistoryItem",
      attrs: {
        "eventid": '3-' + index
      },
      on: {
        "click": function($event) {
          _vm.clickStatus && _vm.goImPage(item)
        }
      }
    }, [_c('article', {
      staticClass: "orderHisItemTop"
    }, [_c('figure', {
      staticClass: "doctorInfo left"
    }, [_c('figcaption', {
      staticClass: "docLogo left"
    }, [_c('img', {
      attrs: {
        "src": item.logoImg
      }
    })]), _vm._v(" "), _c('section', {
      staticClass: "docType right"
    }, [_c('p', {
      staticClass: "docName"
    }, [_c('span', [_vm._v(_vm._s(item.showName))]), _c('span', {
      staticClass: "medicalTitleRight"
    }, [_vm._v(_vm._s(item.medicalTitle))])]), _vm._v(" "), _c('p', {
      staticClass: "inquiryType",
      class: {
        mTop: !item.medicalTitle
      }
    }, [_vm._v(_vm._s(item.consultationType == 1 ? item.company : "唯医骨科"))])], 1)], 1), _vm._v(" "), _c('div', {
      staticClass: "doctorState right"
    }, [_c('span', {
      staticClass: "inquiryTimeShow"
    }, [_vm._v(_vm._s(item.showTime))]), _vm._v(" "), _c('span', {
      staticClass: "inquiryStateShow",
      class: item.fontGray
    }, [_vm._v(_vm._s(item.statusName))])])], 1), _vm._v(" "), _c('div', {
      staticClass: "orderHistoryItemCenter"
    }, [_c('p', [_c('i', [_vm._v("就诊人")]), _c('span', [_vm._v(_vm._s(item.patientNameShow))])], 1), _vm._v(" "), (item.caseType != 14) ? _c('p', [_c('i', [_vm._v("病   情")]), _c('span', {
      staticClass: "patientComplaint"
    }, [_vm._v(_vm._s(item.mainContent.caseMain))])], 1) : _vm._e()], 1), _vm._v(" "), ((item.consultationType == 0 && (item.consultationState == 0 || item.consultationState == 9) && item.state == 3) || (item.consultationType == 0 && item.isRecommend == 1)) ? _c('div', {
      staticClass: "orderHistoryItemBottom"
    }, [(item.consultationState == 9 && item.state == 3) ? _c('span', {
      staticClass: "hrefBtn",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.clickStatus && _vm.goToUploadPic(item)
        }
      }
    }, [_vm._v("补全检查资料")]) : _vm._e(), _vm._v(" "), (item.isRecommend == 1) ? _c('span', {
      staticClass: "hrefBtn"
    }, [_vm._v("查看推荐专家")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (item.isEvaluateFlag == 1) ? _c('div', {
      staticClass: "orderHistoryItemBottom"
    }, [_c('span', {
      staticClass: "hrefBtn",
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.goEvaluate(item)
        }
      }
    }, [_vm._v("去评价")])]) : _vm._e()], 1) : _vm._e()
  }), _vm._v(" "), (_vm.noMoreShow) ? _c('p', {
    staticClass: "noMore"
  }, [_vm._v("没有更多了")]) : _vm._e()], 2)]) : _vm._e(), _vm._v(" "), (_vm.authorizationFlag) ? _c('section', {
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
      "eventid": '4'
    },
    on: {
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("去授权")])], 1) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '5',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), _c('customizedTabbar', {
    attrs: {
      "selected": 3,
      "checkedPhone": _vm.mobileOnOff,
      "eventid": '6',
      "mpcomid": '2'
    },
    on: {
      "FromChild": _vm.jumpToUrl,
      "goToMessage": _vm.jumpToMessage
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '3'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-b9768fd4", esExports)
  }
}

/***/ })

},[1233]);