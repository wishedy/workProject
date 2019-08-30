global.webpackJsonp([50],{

/***/ 1189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalSpread_vue__ = __webpack_require__(1191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1a81e563_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalSpread_vue__ = __webpack_require__(1192);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1190)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_journalSpread_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1a81e563_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_journalSpread_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journal/journalSpread.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] journalSpread.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1a81e563", Component.options)
  } else {
    hotAPI.reload("data-v-1a81e563", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1190:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_auth_sendCode__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_auth_validCodeLogin__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_auth_bindMobile__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getDoctorBaseMsg__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getDiaryStatistics__ = __webpack_require__(164);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_createJournal__ = __webpack_require__(165);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/**************************Axios Http Requests*************************/
 // 发送验证码
 // 验证验证码


 // 获取医生信息
 // 获取日记数量
 // 创建日记接口

var timerCode = null; // 发送验证码倒计时

/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'journalSpread',
  data: function data() {
    return {
      phone: '',
      codeNumber: '',
      loading: false,
      toastContent: '',
      toastShow: false,
      codeTime: 0,
      codeText: "获取验证码",
      authorizationFlag: false, // 用户是否授权
      ensureShow: false, // 打开设置提示
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      doctorId: 0,
      doctorInfo: {
        logoUrl: ''
      } // 医生信息
    };
  },

  computed: {},
  watch: {},
  components: {
    Toast: __WEBPACK_IMPORTED_MODULE_2_components_toast__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_3_components_loading__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_4_components_ensure__["a" /* default */]
  },
  onLoad: function onLoad(options) {
    if (options.scene) {
      this.doctorId = options.scene;
      this.checkAuthorize();
      this.getDoctorMsg();
    } else {
      console.log('医生ID没有传过来！！！');
    }
  },

  methods: {
    // 检测是否授权；
    checkAuthorize: function checkAuthorize() {
      var _this2 = this;

      var that = this;
      wx.getSetting({
        success: function success(res) {
          console.log(res);
          if (res && res.authSetting["scope.userInfo"]) {
            that.authorizationFlag = false;
            _this2.getLoginInfo();
            // that.getConsultLists("get");
          } else {
            that.authorizationFlag = true;
            // dataLog.enterBrowse({
            //   browseType: "124",
            //   opDesc: "授权页面（独立授权页）（小程序）"
            // });
          }
        }
      });
    },
    getAuthorize: function getAuthorize(obj) {
      // dataLog.createTrack({
      //   actionId: 14188,
      // });
      this.authorizationFlag = false;
      console.log(obj);
      if (obj.target.userInfo) {
        this.getLoginInfo();
        this.ensureShow = false;
      } else {
        this.ensureShow = true;
      }
    },
    goToSetting: function goToSetting(e) {
      var that = this;
      if (e.mp.detail.errMsg === "openSetting:ok" && e.mp.detail.authSetting["scope.userInfo"]) {
        that.ensureShow = false;
        that.getLoginInfo();
      } else {
        that.ensureShow = true;
      }
    },

    // 获取登录信息
    getLoginInfo: function getLoginInfo() {
      var that = this;
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            that.getDiaryStatisticsFun();
          } else {}
        },
        failCallBack: function failCallBack() {
          console.log('失败的回调');
        }
      });
    },

    // 获取是否有康复日记
    getDiaryStatisticsFun: function getDiaryStatisticsFun() {
      var _this3 = this;

      this.loading = true;
      return Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getDiaryStatistics__["a" /* default */])({
        patientCustomerId: wx.getStorageSync('userId'),
        isValid: 1
      }).then(function (res) {
        console.log(res);
        if (res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          var _res$responseObject$r = res.responseObject.responseData.dataList[0],
              diaryNum = _res$responseObject$r.diaryNum,
              diaryTotal = _res$responseObject$r.diaryTotal;

          if (diaryNum) {
            _this3.loading = false;
            wx.redirectTo({
              url: "/packageF/journal/journalList?isRedirect=true&patientCustomerId=" + wx.getStorageSync('userId') + "&doctorId=" + _this3.doctorId
            });
          } else {
            _this3.createJournalFun(diaryTotal);
          }
        } else {
          _this3.loading = false;
          console.log('获取康复日记数量失败');
        }
      });
    },
    createJournalFun: function createJournalFun(diaryTotal) {
      var _this4 = this;

      Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_createJournal__["a" /* default */])({
        authorId: wx.getStorageSync('userId'),
        sourceDiaryType: 2
      }).then(function (res) {
        console.log(res);
        _this4.loading = false;
        if (res.responseObject && res.responseObject.responseStatus) {
          wx.redirectTo({
            url: "/packageF/journal/journalEditor?isRedirect=true&patientCustomerId=" + wx.getStorageSync('userId') + "&doctorId=" + _this4.doctorId + (diaryTotal ? '&isShowTip=' : '') + (diaryTotal ? false : '') + "&journalId=" + res.responseObject.responsePk
          });
        } else {
          console.log('创建康复日记失败');
        };
      });
    },

    // 获取医生信息
    getDoctorMsg: function getDoctorMsg() {
      var _this5 = this;

      return Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getDoctorBaseMsg__["a" /* default */])({
        doctorCustomerId: this.doctorId,
        logoUseFlag: 5
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          _this5.doctorInfo = data.responseObject.responseData.dataList[0];
        }
      });
    },

    // 去登录规则页
    goPageRule: function goPageRule() {
      wx.navigateTo({
        url: "/pages/loginRule/loginRule"
      });
    },

    // 显示 toast 提示
    showToast: function showToast(text) {
      wx.showToast({
        title: text,
        icon: 'none',
        duration: 2000
      });
    },

    /** 失焦事件 */
    validateBlur: function validateBlur(type) {
      if (type === "phone") {
        var isPassPhone = /^1\d{10}$/.test(this.phone);
        this.changePhone = false;
        if (this.phone.length === 0) {
          this.showToast("请填写手机号码");
          return false;
        } else if (!isPassPhone) {
          this.showToast("请填写真实手机号码");
          return false;
        } else {
          return true;
        }
      } else if (type === "codeText") {
        if (this.codeNumber.length === 0) {
          this.showToast("请填写短信验证码");
          return false;
        } else {
          return true;
        }
      }
    },

    /** input最大长度事件 */
    inputMaxLength: function inputMaxLength(attr, length) {
      this[attr] = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(this[attr], length);
    },

    /** 清除验证码 */
    clearTextCode: function clearTextCode() {
      this.codeNumber = "";
      this.formCheck = false;
    },

    /** 获取验证码 */
    getCodeApi: function getCodeApi() {
      var _this = this;
      if (!_this.validateBlur("phone")) {
        return;
      }
      _this.loading = true;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_auth_sendCode__["a" /* default */])({
        account: _this.phone,
        operateType: 8,
        typeId: 3
      }).then(function (data) {
        if (data.responseObject.responsePk !== 0 && data.responseObject.responseStatus) {
          _this.showToast("验证码已发送");
          // _this.imgUrl = _this.toastImg.success;
          _this.countDown(60);
          _this.codeId = data.responseObject.responsePk;
        } else {

          _this.showToast(data.responseObject.responseMessage);
        }
      }).catch(function (err) {
        // _this.showToast("网络信号差，建议您稍后再试");
        console.log(err);
      }).finally(function () {
        _this.loading = false;
      });
    },

    /** 验证码倒计时 */
    countDown: function countDown(time) {
      var _this = this;
      var _codeTime = time;
      _this.codeTime = _codeTime--;
      _this.getCode = false;
      timerCode = setInterval(function () {
        if (_codeTime > 0) {
          _this.codeTime = _codeTime--;
        } else {
          _this.getCode = true;
          _this.codeTime = 0;
          _this.getCodeText = "重新获取";
          clearInterval(timerCode);
        }
      }, 1000);
    },

    /** 点击下一步验证 */
    validate: function validate() {
      if (this.validateBlur('phone') && this.validateBlur('codeText')) {
        this.validCode();
      }
    },

    /** 校验验证码并登陆 */
    validCode: function validCode() {
      var _this6 = this;

      var that = this;
      this.loading = true;
      return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        Object(__WEBPACK_IMPORTED_MODULE_6_common_js_auth_validCodeLogin__["a" /* default */])({
          validCode: _this6.codeNumber,
          codeId: _this6.codeId,
          account: _this6.phone,
          typeId: 3
        }).then(function (res) {
          console.log(res);
          if (res.responseObject.responseStatus) {
            if (res.responseObject.responseData) {
              var _res$responseObject$r2 = res.responseObject.responseData,
                  uniteNameWeixin = _res$responseObject$r2.uniteNameWeixin,
                  uniteNickname = _res$responseObject$r2.uniteNickname,
                  uniteFlagWeixin = _res$responseObject$r2.uniteFlagWeixin;

              if (uniteFlagWeixin) {
                if (_this6.unionId != uniteNameWeixin) {
                  console.log('需要绑定');
                  _this6.loading = false;
                  _this6.showModal({
                    content: "该手机号码已被“" + uniteNickname + "”占用，是否更换绑定为当前微信?",
                    success: function success(res) {
                      if (res.confirm) {
                        console.log('用户点击确定');
                        _this6.bindPhoneFun();
                      } else if (res.cancel) {
                        console.log('用户点击取消');
                      }
                    }
                  });
                } else {
                  console.log('不需要绑定');
                  _this6.getDiaryStatisticsFun();
                  console.log('验证成功');
                }
              } else {
                _this6.bindPhoneFun();
              }
            }
          } else {
            // 如果是新手机号，则进行绑定
            if (res.responseObject.responseCode == '0B0010') {
              _this6.bindPhoneFun();
            } else {
              _this6.loading = false;
              _this6.showToast(res.responseObject.responseMessage);
            }
          }
        }).catch(function (err) {
          console.log(err);
        });
      });
    },

    // confirm 框提示
    showModal: function showModal() {
      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : paramObj,
          _ref$title = _ref.title,
          title = _ref$title === undefined ? "" : _ref$title,
          content = _ref.content,
          _ref$success = _ref.success,
          success = _ref$success === undefined ? function () {} : _ref$success;

      wx.showModal({
        title: title,
        content: content,
        success: success
      });
    },

    /** 绑定手机号 */
    bindPhoneFun: function bindPhoneFun() {
      var _this7 = this;

      var _this = this;
      console.log('我要绑定手机号');
      this.loading = true;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_auth_bindMobile__["a" /* default */])({
        account: this.phone,
        encryptedData: wx.getStorageSync('encryptedData'),
        sessionKey: wx.getStorageSync('sessionKey'),
        iv: wx.getStorageSync('iv'),
        visitSiteId: '24'
      }).then(function (res) {
        console.log(res);
        if (res.responseObject.responseStatus) {
          // 换绑成功，更新本地 userId
          wx.setStorageSync("userId", res.responseObject.responsePk);
          // 创建新患者；
          _this7.getDiaryStatisticsFun();
        }
      }).finally(function () {
        _this7.loading = false;
      });
    }
  }
});

/***/ }),

/***/ 1192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "spread-box"
  }, [_c('section', {
    staticClass: "spread-main"
  }, [_c('div', {
    staticClass: "doctor-info-box"
  }, [_c('img', {
    staticClass: "doctor-icon",
    attrs: {
      "src": _vm.doctorInfo.logoUrl.length ? _vm.doctorInfo.logoUrl : 'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png',
      "alt": ""
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "doctor-info"
  }, [_c('p', {
    staticClass: "doctor-info-top"
  }, [_c('span', {
    staticClass: "doctor-name"
  }, [_vm._v("\n            " + _vm._s(_vm.doctorInfo.customerName) + "\n          ")]), _vm._v(" "), _c('span', {
    staticClass: "doctor-title"
  }, [_vm._v("\n            " + _vm._s(_vm.doctorInfo.medical) + "\n          ")])]), _vm._v(" "), _c('p', {
    staticClass: "doctor-info-hospital"
  }, [_vm._v("\n          " + _vm._s(_vm.doctorInfo.company) + "\n        ")])], 1)]), _vm._v(" "), _c('p', {
    staticClass: "spread-tips"
  }, [_vm._v("\n      请输入手机号，方便与您联系\n    ")]), _vm._v(" "), _c('section', {
    staticClass: "login-box"
  }, [_c('article', {
    staticClass: "add-patient-content-item"
  }, [_c('aside', [_vm._v("手机号")]), _vm._v(" "), _c('figure', {
    staticClass: "add-patient-input "
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.phone),
      expression: "phone"
    }],
    attrs: {
      "type": "number",
      "placeholder-style": "color:rgb(170,170,170)",
      "placeholder": "请输入手机号码",
      "name": "phone",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.phone)
    },
    on: {
      "blur": function($event) {
        _vm.validateBlur('phone')
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.phone = $event.target.value
      }, function($event) {
        _vm.inputMaxLength('phone', 11)
      }]
    }
  })])], 1), _vm._v(" "), _c('article', {
    staticClass: "add-patient-content-item"
  }, [_c('aside', [_vm._v("验证码")]), _vm._v(" "), _c('figure', {
    staticClass: "add-patient-input code-box"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.codeNumber),
      expression: "codeNumber"
    }],
    staticClass: "codeInput",
    attrs: {
      "type": "number",
      "placeholder-style": "color:rgb(170,170,170)",
      "placeholder": "请输入",
      "name": "codeInput",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.codeNumber)
    },
    on: {
      "blur": function($event) {
        _vm.validateBlur('codeText')
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.codeNumber = $event.target.value
      }, function($event) {
        _vm.inputMaxLength('codeNumber', 4)
      }]
    }
  }), _vm._v(" "), (_vm.codeNumber.length) ? _c('i', {
    staticClass: "icon-clear",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.clearTextCode()
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), (_vm.codeTime <= 0) ? _c('span', {
    staticClass: "codeText",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.getCodeApi()
      }
    }
  }, [_vm._v(_vm._s(_vm.codeText))]) : _vm._e(), _vm._v(" "), (_vm.codeTime > 0) ? _c('span', {
    staticClass: "codeCountdown",
    class: {
      'hasContent': _vm.codeNumber.length > 0
    }
  }, [_c('i', [_vm._v(_vm._s(_vm.codeTime))]), _c('i', [_vm._v("秒后重新获取")])], 1) : _vm._e()], 1)], 1), _vm._v(" "), _c('p', {
    staticClass: "login-tips"
  }, [_vm._v("*手机号仅对医生本人可见")])], 1), _vm._v(" "), _c('section', {
    staticClass: "next-box"
  }, [_c('div', {
    staticClass: "next-btn",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.validate()
      }
    }
  }, [_vm._v("下一步")]), _vm._v(" "), _c('div', {
    staticClass: "next-tips"
  }, [_vm._v("\n      点击按钮表示您同意唯医\n      "), _c('span', {
    staticClass: "next-agreement",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.goPageRule()
      }
    }
  }, [_vm._v("《唯医骨科用户注册协议》")])])]), _vm._v(" "), (_vm.authorizationFlag) ? _c('section', {
    staticClass: "journal-maskers"
  }, [_c('section', {
    staticClass: "journal-confirmBox-inner"
  }, [_c('article', {
    staticClass: "journal-confirmBox-content"
  }, [_c('p', [_vm._v("需要您的授权，才能为您提供更好的服务")])], 1), _vm._v(" "), _c('footer', {
    staticClass: "journal-confirmBox-btns"
  }, [_c('button', {
    staticClass: "journal-confirmBox-ensureBtn",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '6'
    },
    on: {
      "getuserinfo": _vm.getAuthorize
    }
  }, [_vm._v("去授权")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '7',
      "mpcomid": '0'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.toastShow) ? _c('Toast', {
    attrs: {
      "content": _vm.toastContent,
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1a81e563", esExports)
  }
}

/***/ })

},[1314]);