global.webpackJsonp([29],{

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_login_vue__ = __webpack_require__(434);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e3939130_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_login_vue__ = __webpack_require__(444);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(433)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_login_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e3939130_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_login_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/login/login.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] login.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e3939130", Component.options)
  } else {
    hotAPI.reload("data-v-e3939130", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 433:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 434:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_wxValidate__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_auth_checkBlackList__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_auth_sendCode__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_auth_getOpenId__ = __webpack_require__(163);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_auth_validCodeLogin__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_auth_bindMobile__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_vuex__ = __webpack_require__(4);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by lichenyang on 2018/5/15.
 */
/**************************Common Methods*************************/

 //校验是否是黑名单用户
/**************************Axios Http Requests*************************/

 // 发送验证码
 // 获取openId
 // 验证验证码
 // 绑定手机号


var timerCode = null; // 定时器



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_11_vuex__["a" /* createNamespacedHelpers */])('journal'),
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations,
    mapActions = _createNamespacedHelp.mapActions;

var XHRList = {
  updateCode: ""
};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "index",
  data: function data() {
    return {
      customerId: '', // 用户Id
      unionId: '', // 微信 unionId
      openId: '', // 微信 openId
      validateObj: {}, // 验证插件对象
      phoneMessage: "", // 手机号码
      codeMessage: "", // 验证码
      tipsMsg: "", // 提示话术
      codeId: "", // 验证码验证id
      wxCode: "", // 微信临时code
      toastImg: {
        wifi: "/static/images/login/wifi@2x.png.png",
        success: "/static/image/success.png"
      },
      countShow: false, // 倒计时计数是否显示
      getCodeText: "获取验证码",
      codeTime: 60, // 验证码有效时间
      toastShow: false, // toastShow 是否显示
      sendCodeFlag: false, // 设置多次点击发送验证码判断
      loading: false
    };
  },

  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapMutations(['setMobile', 'setCustomerId']), {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      if (this.loading) return;
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    init: function init() {
      var that = this;
      this.customerId = wx.getStorageSync('userId');
      this.unionId = wx.getStorageSync('unionId');
      this.openId = wx.getStorageSync('openId');
      wx.setNavigationBarTitle({
        title: '快速注册/登录'
      });
      // 验证字段的规则
      var rules = {
        tel: {
          required: true,
          tel: true
        },
        code: {
          required: true
        }
      };
      // 验证字段的提示信息，若不传则调用默认的信息
      var messages = {
        tel: {
          required: "请输入手机号",
          tel: "请输入正确的手机号"
        },
        code: {
          required: "请输入验证码"
        }
      };
      this.wxValidate = new __WEBPACK_IMPORTED_MODULE_2_common_js_util_wxValidate__["a" /* default */](rules, messages);
    },

    // 清空消息
    clearMessage: function clearMessage(type) {
      this[type] = "";
    },

    //11位手机号截取
    onKeyPress: function onKeyPress() {
      var content = this.phoneMessage.split("").filter(function (item, index) {
        return (/^[0-9]*$/.test(item) && index < 11
        );
      }).join("");
      this.phoneMessage = content;
    },

    //4位验证码截取
    codeKeyPress: function codeKeyPress(event, name) {
      var content = this.codeMessage.split("").filter(function (item, index) {
        return (/^[0-9]*$/.test(item) && index < 4
        );
      }).join("");
      this.codeMessage = content;
    },

    // 失焦验证
    blurValid: function blurValid(message, type) {
      var _this2 = this;

      return this.wxValidate.checkForm(this[message], type).then(function (result) {
        if (!result) {
          _this2.showToast(_this2.wxValidate.errorList[0].msg);
        }
        return result;
      });
    },

    // 登录按钮验证
    validLogin: function validLogin() {
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14135
      });
      if (this.loading) return;
      var _this = this;
      this.blurValid("phoneMessage", "tel").then(function (result) {
        if (result) {
          _this.isCheckBlack('login');
        } else {
          _this.loginApi();
        }
      });
    },
    loginApi: function loginApi() {
      var _this3 = this;

      this.loading = true;
      this.wxValidate.checkAll({
        tel: this.phoneMessage,
        code: this.codeMessage
      }).then(function (result) {
        if (result) {
          // this.getWxCode();
          _this3.submitForm();
        } else {
          _this3.loading = false;
          _this3.showToast(_this3.wxValidate.errorList[0].msg);
        }
      });
    },

    // 获取微信临时code
    getWxCode: function getWxCode() {
      var _this4 = this;

      wx.login({
        success: function success(res) {
          console.log(res);
          _this4.wxCode = res.code;
          _this4.openId();
        },
        fail: function fail(err) {
          console.log("获取微信临时code失败");
          console.log(err);
        }
      });
    },

    // 获取openid
    openId: function openId() {
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_auth_getOpenId__["a" /* default */])(this.wxCode).then(function (res) {
        console.log(res);
      });
    },

    // 调用验证方法，传入参数 e 是 form 表单组件中的数据
    submitForm: function submitForm() {
      var _this5 = this;

      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_auth_validCodeLogin__["a" /* default */])({
        validCode: this.codeMessage,
        codeId: this.codeId,
        account: this.phoneMessage,
        typeId: 3
      }).then(function (res) {
        console.log(res);
        if (res.responseObject.responseStatus) {
          if (res.responseObject.responseData) {
            var _res$responseObject$r = res.responseObject.responseData,
                uniteNameWeixin = _res$responseObject$r.uniteNameWeixin,
                uniteNickname = _res$responseObject$r.uniteNickname,
                uniteFlagWeixin = _res$responseObject$r.uniteFlagWeixin;


            if (uniteFlagWeixin) {
              if (_this5.unionId != uniteNameWeixin) {
                _this5.loading = false;
                _this5.showModal({
                  content: "该手机号码已被“" + uniteNickname + "”占用，是否更换绑定为当前微信?",
                  success: function success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定');
                      _this5.loading = true;
                      _this5.bindPhone();
                    } else if (res.cancel) {
                      console.log('用户点击取消');
                    }
                  }
                });
              } else {
                var query = _this5.$root.$mp.query.from;
                if (query == 'blackList') {
                  wx.redirectTo({
                    url: '/pages/mIndex/mIndex'
                  });
                } else {
                  _this5.goAddPatient();
                  console.log('验证成功');
                }
              }
            } else {
              _this5.bindPhone();
            }
          }
        } else {
          // 如果是新手机号，则进行绑定
          if (res.responseObject.responseCode == '0B0010') {
            _this5.bindPhone();
          } else {
            _this5.loading = false;
            _this5.showToast(res.responseObject.responseMessage);
          }
        }
      });
    },

    // 去添加患者；
    goAddPatient: function goAddPatient() {
      var backPage = void 0;
      this.loading = false;
      this.setMobile(this.phoneMessage); //绑定成功后手机号
      if (this.$root.$mp.query.needSession) {
        wx.setStorageSync('bindFinish', 1);
        wx.setStorageSync('needRefresh', true);
      }
      if (this.$root.$mp.query.backPage) {
        backPage = this.$root.$mp.query.backPage;
        console.log(backPage);
        wx.redirectTo({
          url: backPage
        });
      } else {
        wx.navigateBack({
          delta: 1
        });
      }
    },

    // 绑定手机号
    bindPhone: function bindPhone() {
      var _this6 = this;

      this.setCustomerId(wx.getStorageSync('userId')); //添加换绑后的customerId
      console.log(this.$root.$mp.query.from);
      console.log('我要绑定手机号');
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_auth_bindMobile__["a" /* default */])({
        account: this.phoneMessage,
        encryptedData: wx.getStorageSync('encryptedData'),
        sessionKey: wx.getStorageSync('sessionKey'),
        iv: wx.getStorageSync('iv'),
        visitSiteId: '24'
      }).then(function (res) {
        console.log(res);
        if (res.responseObject.responseStatus) {
          wx.setStorageSync("userId", res.responseObject.responsePk);
          var query = _this6.$root.$mp.query.from;
          if (query == 1) {
            wx.redirectTo({
              url: '/pages/myConsult/myConsult'
            });
          } else if (query == 2) {
            wx.redirectTo({
              url: '/packageF/couponList/couponList'
            });
          } else if (query == 8) {
            //设置登录成功之后跳转到我的挂号列表并返回重新获取登录信息
            wx.setStorageSync('needRefresh', true);
            wx.redirectTo({
              url: '/packageD/registration/myOrderList'
            });
          } else if (query == 'blackList') {
            wx.redirectTo({
              url: '/pages/mIndex/mIndex'
            });
          } else {
            _this6.goAddPatient();
          }
          api.codeRecord();
        }
      });
    },

    //校验是否是黑名单用户
    isCheckBlack: function isCheckBlack(type) {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_3_common_js_auth_checkBlackList__["a" /* default */])({
        mobile: _this.phoneMessage
      }).then(function (res) {
        if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList && res.responseObject.responseData.dataList.length > 0) {
          //是黑名单用户
          var dataList = res.responseObject.responseData.dataList[0];
          if (dataList.isBlack) {
            wx.showToast({
              title: '该账号违规，暂时无法登录',
              icon: 'none'
            });
          } else {
            if (type == 'login') {
              _this.loginApi();
            } else {
              _this.sendCodeApi();
            }
          }
        } else {
          if (type == 'login') {
            _this.loginApi();
          } else {
            _this.sendCodeApi();
          }
        }
      });
    },

    //获取验证码
    getCodeApi: function getCodeApi() {
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14134
      });
      var _this = this;
      this.blurValid("phoneMessage", "tel").then(function (result) {
        if (result) {
          _this.isCheckBlack();
        } else {
          _this.sendCodeFlag = false;
        }
      });
    },

    //发送验证码
    sendCodeApi: function sendCodeApi() {
      var _this7 = this;

      var _this = this;
      if (_this.sendCodeFlag) return;
      _this.sendCodeFlag = true;
      Object(__WEBPACK_IMPORTED_MODULE_5_common_js_auth_sendCode__["a" /* default */])({
        // account: _this.phoneMessage,
        // customerId: this.customerId,
        // account: 15555555550,
        account: this.phoneMessage
        // operateType: 1, //1-绑定手机 2－修改手机号 3-手机号找回p密码 5-手机号注册 8-手机号快捷登录 9-老患者报到 16-患者注册
        // typeId: 2 //1-修改/重置密码2-账号验证(绑定手机、手机号注册)3-手机快捷登录4-老患者报到5-短信通知
      }).then(function (res) {
        var data = res;
        console.log(data);
        if (data.responseObject.responsePk !== 0 && data.responseObject.responseStatus) {
          _this7.showToast("验证码已发送", "success", _this.toastImg.success);
          _this.sendCodeFlag = false;
          _this.countDown(60);
          _this.codeId = data.responseObject.responsePk;
        } else {
          _this7.showToast(data.responseObject.responseMessage);
        }
      }).catch(function (err) {
        console.log(err);
        _this7.showToast("网络信号差，建议您稍后再试", "success", _this.toastImg.wifi);
      });
    },

    // toast 框提示
    showToast: function showToast(text) {
      var _this8 = this;

      var icon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "none";
      var image = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";

      this.tipsMsg = text;
      if (!this.toastShow) {
        this.toastShow = true;
        wx.showToast({
          title: this.tipsMsg,
          icon: icon,
          image: image
        });
        setTimeout(function () {
          _this8.toastShow = false;
          wx.hideToast();
        }, 2000);
      }
    },

    // confirm 框提示
    showModal: function showModal() {
      var _wx$showModal;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : paramObj,
          _ref$title = _ref.title,
          title = _ref$title === undefined ? "" : _ref$title,
          content = _ref.content,
          _ref$success = _ref.success,
          success = _ref$success === undefined ? function () {} : _ref$success;

      wx.showModal((_wx$showModal = {
        success: function success() {},
        title: title
      }, __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_wx$showModal, "success", function success() {}), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_wx$showModal, "content", content), __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default()(_wx$showModal, "success", success), _wx$showModal));
    },

    //验证码倒计时
    countDown: function countDown(time) {
      var _this9 = this;

      var _this = this;
      var _codeTime = time;
      this.countShow = true;
      _this.codeTime = _codeTime--;
      // _this.getCode = false;
      timerCode = setInterval(function () {
        if (_codeTime > 0) {
          _this.codeTime = _codeTime--;
        } else {
          // _this.getCode = true;
          _this.codeTime = 0;
          _this9.countShow = false;
          _this.getCodeText = "重新获取";
          clearInterval(timerCode);
        }
      }, 1000);
    },

    // 跳转到唯医互联网骨科协议
    goLoginRule: function goLoginRule() {
      __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].createTrack({
        actionId: 14136,
        browseType: "86",
        opDesc: "快速登录注册页（小程序）"
      });
      wx.navigateTo({
        url: "../loginRule/loginRule"
      });
    }
  }),
  onLoad: function onLoad() {
    this.phoneMessage = '';
    this.codeMessage = '';
    var query = this.$root.$mp.query.from;
    console.log(query);
  },
  onUnload: function onUnload() {
    this.phoneMessage = '';
    this.codeMessage = '';
    this.getCodeText = '获取验证码';
    this.countShow = false;
    this.sendCodeFlag = false;
    this.loading = false;
    clearTimeout(timerCode);
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_10_dataLog__["a" /* default */].leaveBrowse();
  },
  mounted: function mounted() {
    this.init();
  },

  computed: {
    // 清除手机号的按钮是否展示
    clearPhone: function clearPhone() {
      if (this.phoneMessage.length > 0) {
        return true;
      } else {
        return false;
      }
    },

    // 清除验证码的按钮是否展示
    clearCode: function clearCode() {
      if (this.codeMessage.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_4_components_loading__["a" /* default */]
  }
});

/***/ }),

/***/ 444:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "out-box"
  }, [_c('section', {
    staticClass: "image-head"
  }), _vm._v(" "), _c('section', {
    staticClass: "loginRegisterBox"
  }, [_c('article', {
    staticClass: "tphoneTips"
  }, [_vm._v("请填写手机号，仅对医生可见")]), _vm._v(" "), _c('p', {
    staticClass: "phoneInput"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.phoneMessage),
      expression: "phoneMessage"
    }],
    class: {
      'hasContent': _vm.clearPhone
    },
    attrs: {
      "type": "number",
      "placeholder": "请输入手机号",
      "placeholder-class": "placeholderClass",
      "cursor-spacing": 100,
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.phoneMessage)
    },
    on: {
      "blur": function($event) {
        _vm.blurValid('phoneMessage', 'tel')
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.phoneMessage = $event.target.value
      }, function($event) {
        _vm.onKeyPress()
      }]
    }
  }), _vm._v(" "), (_vm.clearPhone) ? _c('i', {
    staticClass: "icon-clear",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.clearMessage("phoneMessage")
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('p', {
    staticClass: "codeInput"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.codeMessage),
      expression: "codeMessage"
    }],
    class: {
      'hasContent': _vm.clearCode
    },
    attrs: {
      "type": "number",
      "placeholder": "请输入验证码",
      "cursor-spacing": 100,
      "placeholder-class": "placeholderClass",
      "eventid": '2'
    },
    domProps: {
      "value": (_vm.codeMessage)
    },
    on: {
      "blur": function($event) {
        _vm.blurValid('codeMessage', 'code')
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.codeMessage = $event.target.value
      }, function($event) {
        _vm.codeKeyPress()
      }]
    }
  }), _vm._v(" "), (_vm.clearCode) ? _c('i', {
    staticClass: "icon-clear",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.clearMessage("codeMessage")
      }
    }
  }) : _vm._e(), _vm._v(" "), (!_vm.countShow) ? _c('span', {
    staticClass: "getCode",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.getCodeApi()
      }
    }
  }, [_vm._v(_vm._s(_vm.getCodeText))]) : _c('span', {
    staticClass: "codeCountdown",
    class: {
      'hasContent': _vm.codeMessage.length > 0
    }
  }, [_c('i', [_vm._v(_vm._s(_vm.codeTime))]), _vm._v("秒后重新获取")], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "stipulation"
  }, [_vm._v("登录代表您已同意"), _c('i', {
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.goLoginRule()
      }
    }
  }, [_vm._v("《唯医互联网骨科医院服务协议》")])], 1)], 1), _vm._v(" "), _c('form', {
    staticClass: "btn-primary go-next",
    attrs: {
      "report-submit": "true",
      "eventid": '7'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "loginButton",
    attrs: {
      "disabled": _vm.loading,
      "formType": "submit",
      "eventid": '6'
    },
    on: {
      "click": function($event) {
        _vm.validLogin()
      }
    }
  }, [_vm._v("登录")])], 1), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e3939130", esExports)
  }
}

/***/ })

},[1221]);