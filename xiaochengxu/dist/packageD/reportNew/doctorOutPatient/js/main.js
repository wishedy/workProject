global.webpackJsonp([71],{

/***/ 829:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorOutPatient_vue__ = __webpack_require__(831);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0b690f1a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorOutPatient_vue__ = __webpack_require__(832);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(830)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0b690f1a"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorOutPatient_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0b690f1a_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorOutPatient_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/doctorOutPatient.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorOutPatient.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b690f1a", Component.options)
  } else {
    hotAPI.reload("data-v-0b690f1a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 830:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 831:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_components_LogoLoading__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_GetPhoneAuthorization__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_getPatientList__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_common_js_auth_checkBlackList__ = __webpack_require__(79);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//















var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_13_vuex__["a" /* createNamespacedHelpers */])('reportNew'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState;

var XHRList = {
  doctorInfo: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/auth/v1/getMapById/"
};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "doctorHome",
  data: function data() {
    var mobileOnOff = __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    return {
      mobileOnOff: mobileOnOff,
      doctorLogo: "",
      doctorName: "",
      doctorNameAll: "",
      doctorLevel: "",
      medicalTitle: "",
      company: "",
      expertiseFiled: "",
      toastShow: false,
      toastContent: "",
      clickStatus: true,
      ensureShow: false,
      dataFinish: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      loadingFlag: false,
      isFullScreen: false, // 是否是全面屏；
      isShielded: 0 //是否被屏蔽
    };
  },
  onLoad: function onLoad(options) {
    this.loadingFlag = false;
    var scene = "";
    var defaultId = "1522723538976";
    var docCustomerId = this.$root.$mp.query.doctorCustomerId;
    console.log('onLoad');
    console.log(options);
    wx.removeStorageSync('backIndex');
    if (docCustomerId && docCustomerId.length > 0) {
      scene = docCustomerId;
      wx.setStorageSync("doctorId", scene);
    } else {
      if (options.scene) {
        console.log(options);
        scene = decodeURIComponent(options.scene);
        wx.setStorageSync("doctorId", scene);
      } else {
        scene = defaultId;
      }
    }
    this.setDoctorCustomerId(scene); // 设置vuex中的doctorId；
    this.isFullScreen = wx.getSystemInfoSync().screenHeight / wx.getSystemInfoSync().screenWidth > 2 ? true : false;
    __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].codeRecord("/pages/doctorHome/doctorHome");
  },
  mounted: function mounted(options) {
    console.log('mounted');
    console.log(options);
  },
  onShow: function onShow(option) {
    this.dataFinish = false;
    this.clickStatus = true;

    this.doctorInfo();
    console.log('onshow');
    console.log(option);
    var _this = this;
    wx.getLocation({
      type: 'wgs84',
      success: function success(res) {
        console.log(res);
        var location = {
          latitude: res ? res.latitude : "", //经度
          longitude: res ? res.longitude : "", //纬度
          speed: res ? res.speed : "" //移动速度
        };
        __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].setItem("location", __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()(location));
      },
      fail: function fail(err) {
        console.log("用户拒绝授权，无法获取位置信息");
      }
    });
    __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].removeItem("alreadyCreateIm");
    this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['doctorMessage']), Object(__WEBPACK_IMPORTED_MODULE_13_vuex__["d" /* mapGetters */])(['userInfoEnd'])),
  watch: {
    userInfoEnd: function userInfoEnd(newVal, oldVal) {
      console.log(newVal);
      console.log('获取到信息');
      var _this = this;
      _this.mobileOnOff = __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].checkPhoneNumber();
    }
  },
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setDoctorCustomerId', 'setDoctorMessage']), {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    /** 显示toast */
    showToast: function showToast(msg) {
      var _this2 = this;

      this.toastContent = msg;
      this.toastShow = true;
      setTimeout(function () {
        _this2.toastShow = false;
      }, 2000);
    },
    shielded: function shielded() {
      this.isShielded = 1;
    },

    /** 获取医生信息 */
    doctorInfo: function doctorInfo() {
      var _this = this;
      _this.loadingFlag = true;
      _this.doctorId = wx.getStorageSync("doctorId");
      console.log('获取数据的医生ID' + wx.getStorageSync("doctorId"));
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.doctorInfo,
        method: "POST",
        data: {
          customerId: wx.getStorageSync("doctorId"),
          logoUseFlag: 3
        },
        done: function done(res) {
          _this.loadingFlag = false;
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            var doctorMain = res.responseObject.responseData.dataList[0];
            var medicalTitleText = _this.textCutter(doctorMain.authMap.medicalTitle, "medical");
            _this.doctorLogo = doctorMain.logoUrlMap.logoUrl;
            _this.doctorNameAll = doctorMain.authMap.fullName;
            wx.setStorageSync("doctorName", doctorMain.authMap.fullName);
            _this.doctorName = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getByteLen(doctorMain.authMap.fullName) > 8 ? __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getStrByteLen(doctorMain.authMap.fullName, 6) + "..." : doctorMain.authMap.fullName;
            _this.doctorLevel = doctorMain.authMap.state;
            _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
            _this.company = doctorMain.authMap.company || "";
            // _this.expertiseFiled = doctorMain.illnessMapList.length > 0 ?  _this.expertiseFun(doctorMain.illnessMapList) : '';
            _this.expertiseFiled = doctorMain.authMap.expertise.split("，");
            _this.dataFinish = true;
            _this.setDoctorMessage({
              logoUrl: _this.doctorLogo, // 医生头像连接
              fullName: _this.doctorNameAll, // 医生名字的全称；
              fullNameClip: _this.doctorName, // 医生名字超过四个中文字显示 ...
              medicalTitle: _this.medicalTitle, // 医生职称
              company: _this.company // 医院
            });
            console.log(_this.doctorMessage);
            if (_this.doctorLevel != 8) {
              wx.setNavigationBarTitle({
                title: _this.doctorNameAll + "\u533B\u751F"
              });
              wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#ffffff'
              });
              __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
                browseType: "131",
                opDesc: "患者报到医生二维码失效页（小程序）"
              });
            } else {
              wx.setNavigationBarTitle({
                title: "唯医骨科"
              });
              wx.setNavigationBarColor({
                frontColor: '#000000',
                backgroundColor: '#DBFBFF'
              });

              __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].enterBrowse({
                resourceId: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()({
                  doctorId: wx.getStorageSync("doctorId")
                })
              });
            }
          } else {
            _this.dataFinish = false;
            _this.showToast("网络信号差，请稍后再试");
          }
        },
        fail: function fail(err) {
          _this.dataFinish = false;
          _this.loadingFlag = false;
          _this.showToast("网络信号差，请稍后再试");
        }
      });
    },

    // 处理擅长疾病字段；
    expertiseFun: function expertiseFun(obj) {
      var arrTemp = [];
      obj.map(function (item) {
        arrTemp.push(item.illnessName);
      });
      return arrTemp.join(',');
    },

    /** 处理医生职称数据 */
    textCutter: function textCutter(str, type) {
      var strNew = "";
      if (str.includes(",")) {
        str.split(",").forEach(function (element) {
          if (element.length === 0) {
            strNew += "";
          } else {
            if (element.includes("_")) {
              if (type == "medical") {
                strNew += element.split("_")[1] + " ";
              } else {
                strNew += element.split("_")[1] + "，";
              }
            } else {
              if (type == "medical") {
                strNew += element + " ";
              } else {
                strNew += element + "，";
              }
            }
          }
        });
        return strNew.substring(0, strNew.length - 1);
      } else if (str.includes("_")) {
        strNew += str.split("_")[1];
        return strNew;
      } else {
        strNew += str;
        return strNew;
      }
    },
    getAuthorizePhone: function getAuthorizePhone(info) {
      var _this = this;
      var e = info.mp;
      if (_this.isShielded === 1) {
        _this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
        return false;
      }
      __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_GetPhoneAuthorization__["a" /* default */].init({
        info: e,
        cancelBack: function cancelBack() {
          if (_this.clickStatus) {
            _this.ensureShow = true;
          }
        },
        successBack: function successBack() {
          if (_this.clickStatus) {
            _this.clickStatus = false;
            _this.ensureShow = false;
            _this.getLoginInfo();
          }
        }
      });
    },

    /** 获取授权 */
    getAuthorize: function getAuthorize(obj) {
      if (this.isShielded === 1) {
        this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
        return false;
      }

      if (this.clickStatus) {
        this.clickStatus = false;
        if (obj.target.userInfo) {
          this.ensureShow = false;
          this.getLoginInfo();
        } else {
          this.ensureShow = true;
        }
      }
    },

    /** 获取授权 */
    goToSetting: function goToSetting(e) {
      var _this = this;
      if (e.mp.detail.errMsg === "openSetting:ok") {
        _this.ensureShow = false;
        _this.clickStatus = false;
        _this.getLoginInfo();
      } else {
        _this.clickStatus = true;
        _this.ensureShow = true;
      }
    },

    /** 登录判断并且跳转 */
    getLoginInfo: function getLoginInfo() {
      var _this = this;
      _this.loadingFlag = true;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          var customerId = wx.getStorageSync("userId");
          var doctorId = wx.getStorageSync("doctorId");
          Object(__WEBPACK_IMPORTED_MODULE_15_common_js_auth_checkBlackList__["a" /* default */])({
            customerId: customerId,
            doctorId: doctorId
          }).then(function (checkBlackListRes) {

            //如果被屏蔽则提示,并退出
            if (checkBlackListRes && checkBlackListRes.responseObject && checkBlackListRes.responseObject.responseData && checkBlackListRes.responseObject.responseData.dataList && checkBlackListRes.responseObject.responseData.dataList[0] && checkBlackListRes.responseObject.responseData.dataList[0].isShielded === 1) {
              _this.isShielded = 1;
              _this.loadingFlag = false;
              _this.showToast("与医生沟通时触发敏感词汇，无法向该医生报到");
              return false;
            } else {
              if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].codeRecord("/packageD/doctorHome/doctorHome");
                _this.getPatientListFun();
              } else {
                _this.loadingFlag = false;
                wx.navigateTo({
                  url: "/packageD/reportNew/reportRegister"
                });
              }
            }
          });
        },
        failCallback: function failCallback(err) {
          _this.loadingFlag = false;
          console.log(err);
        }
      });
    },

    /** 获取患者列表函数 */
    getPatientListFun: function getPatientListFun() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_getPatientList__["a" /* default */])().then(function (param) {
        _this.loadingFlag = false;
        if (param.responseObject.responseMessage == "NO DATA") {
          console.log("没有患者");
          wx.navigateTo({
            url: "/packageD/reportNew/reportAddPatient"
          });
        } else {
          wx.navigateTo({
            url: "/packageD/reportNew/reportPatientList"
          });
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 返回首页 */
    goHomePage: function goHomePage() {
      wx.navigateTo({
        url: '/pages/mIndex/mIndex'
      });
    },
    logTrack: function logTrack() {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_10_common_js_dataLog_dataLog__["a" /* default */].createTrack({ // 医生报到首页页面 点击”点击进入“
        actionId: 14223,
        browseType: 145,
        pushMessageId: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_json_stringify___default()({ doctorId: _this.doctorId })
      });
    }
  }),
  components: {
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_4_components_ensure__["a" /* default */],
    toast: __WEBPACK_IMPORTED_MODULE_6_components_toast__["a" /* default */],
    LogoLoading: __WEBPACK_IMPORTED_MODULE_7_components_LogoLoading__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_14_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_9_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "doctorHomeMain",
    class: {
      doctorNoV2: _vm.dataFinish && _vm.doctorLevel != 8
    }
  }, [(_vm.dataFinish && _vm.doctorLevel != 8) ? _c('section', {
    staticClass: "doctorV2Level"
  }, [_c('div', {
    staticClass: "doctorV2BgImg"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/lost_erweima.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('h4', [_vm._v("二维码已失效")]), _vm._v(" "), _c('article', [_vm._v("请联系" + _vm._s(_vm.doctorNameAll) + "医生获取最新二维码")]), _vm._v(" "), _c('span', {
    staticClass: "goHomeBtn",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.goHomePage
    }
  }, [_vm._v("返回首页")])], 1) : _vm._e(), _vm._v(" "), (_vm.dataFinish && _vm.doctorLevel == 8) ? _c('section', {
    staticClass: "doctorHomeTop",
    class: {
      'fullScreen': _vm.isFullScreen
    }
  }, [_c('section', {
    staticClass: "doctorInfo"
  }, [_c('div', {
    staticClass: "doctorLogo"
  }, [_c('img', {
    staticClass: "doctorLogoImg",
    attrs: {
      "src": _vm.doctorLogo,
      "alt": ""
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "doctorLogoBottom"
  })]), _vm._v(" "), _c('section', {
    staticClass: "doctorBaseInfo"
  }, [_c('h2', {
    staticClass: "docName"
  }, [_vm._v(_vm._s(_vm.doctorName) + "医生网上诊所")]), _vm._v(" "), _c('p', {
    staticClass: "docOtherInfo"
  }, [_c('span', [_vm._v(_vm._s(_vm.medicalTitle))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.company))])]), _vm._v(" "), _c('p', {
    staticClass: "docTips"
  }, [_c('span', {
    staticClass: "docTipsText"
  }, [_vm._v("擅治疾病")])]), _vm._v(" "), _c('p', {
    staticClass: "docStrongInfo"
  }, [_vm._v(_vm._s(_vm.expertiseFiled))]), _vm._v(" "), _c('div', {
    staticClass: "reportBtn"
  }, [_c('form', {
    attrs: {
      "action": "",
      "report-submit": "true",
      "eventid": '3'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.mobileOnOff) ? _c('button', {
    staticClass: "reportBtnAuthorize",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getUserInfo",
      "eventid": '1'
    },
    on: {
      "click": _vm.logTrack,
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("\n              点击进入\n            ")]) : _vm._e(), _vm._v(" "), (!_vm.mobileOnOff) ? _c('button', {
    staticClass: "reportBtnAuthorize",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "open-type": "getPhoneNumber",
      "eventid": '2'
    },
    on: {
      "click": _vm.logTrack,
      "getphonenumber": _vm.getAuthorizePhone
    }
  }, [_vm._v("\n              点击进入\n            ")]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c('img', {
    staticClass: "flowerOne",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/hua1.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "flowerTwo",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/hua2.png",
      "alt": ""
    }
  }), _vm._v(" "), _c('img', {
    staticClass: "flowerThree",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.2.0/hua_b.png",
      "alt": ""
    }
  })], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.toastShow) ? _c('toast', {
    attrs: {
      "content": _vm.toastContent,
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loadingFlag) ? _c('LogoLoading', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '4',
      "mpcomid": '2'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "shielded": true,
      "eventid": '5',
      "mpcomid": '3'
    },
    on: {
      "shielded": _vm.shielded
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0b690f1a", esExports)
  }
}

/***/ })

},[1258]);