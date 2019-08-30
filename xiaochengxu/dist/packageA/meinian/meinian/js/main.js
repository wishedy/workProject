global.webpackJsonp([20],{

/***/ 777:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_meinian_vue__ = __webpack_require__(780);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_32144362_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_meinian_vue__ = __webpack_require__(781);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(778)
  __webpack_require__(779)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-32144362"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_meinian_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_32144362_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_meinian_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/meinian/meinian.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] meinian.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-32144362", Component.options)
  } else {
    hotAPI.reload("data-v-32144362", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 778:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 779:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 780:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_defineProperty__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_auth_validCodeLogin__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_auth_bindMobile__ = __webpack_require__(47);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc：美年大合作问诊流程
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by zhangheng on 2018/11/1.
 */
var XHRList = {
  createPatient: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/relation/v1/create/" //创建患者
};






var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_6_vuex__["a" /* createNamespacedHelpers */])('meinian'),
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions;

 // 验证验证码
 // 绑定手机号
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      confirmOnOff: false,
      inputPatientPhoneNum: '',
      identityCardNum: '',
      inputPatientName: '',
      toastShow: false,
      tipsMsg: '',
      codeNum: '',
      loading: false,
      maxNameLen: 40,
      maxPhoneLen: 11
    };
  },

  watch: {
    inputPatientName: function inputPatientName(n) {
      var t = this;
      if (n.length > t.maxNameLen) {
        t.inputPatientName = t.inputPatientName.substring(0, t.maxNameLen);
        t.changeName(t.inputPatientName);
      } else {
        t.changeName(n);
      }
    },
    codeNum: function codeNum(n) {
      var t = this;
      if (n.length > 4) {
        t.codeNum = t.codeNum.substring(0, 4);
      }
    },
    identityCardNum: function identityCardNum(n) {
      var t = this;
      if (n.length === 18 && t.identityCardNumRight) {

        t.changeIdentityCardNum(n);
      } else {
        t.identityCardNum = t.identityCardNum.substring(0, 18);
      }
    },
    inputPatientPhoneNum: function inputPatientPhoneNum(n) {
      var t = this;
      if (n.length === t.maxPhoneLen && t.identityPhoneNumRight) {
        t.changePhoneNum(n);
      } else {
        t.inputPatientPhoneNum = t.inputPatientPhoneNum.substring(0, t.maxPhoneLen);
      }
    }
  },
  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapActions(['changeName', 'changeIdentityCardNum', 'changePhoneNum', 'checkVerificationCode', 'showToast', 'getReportDetail', 'changeReportDialog', 'savePatientCustomerId', 'changeClickAble', 'changeCodeDes']), {
    blurInput: function blurInput(name) {
      var t = this;
      switch (name) {
        case 'name':
          if (t.patientName.length === 0) {
            t.showToast({ text: '请填写体检人姓名' });
            return false;
          }
          if (!t.identityNameRight) {
            t.showToast({ text: "不能包含数字和特殊字符" });
            return false;
          }
          break;
        case 'phone':
          if (t.inputPatientPhoneNum.length === 0) {
            t.showToast({ text: '请输入手机号' });
            return false;
          } else if (!t.identityPhoneNumRight) {
            t.showToast({ text: '请输入正确的手机号' });
            return false;
          }
          break;
        case 'code':
          if (t.codeNum.length === 0) {
            t.showToast({ text: '请输入验证码' });
            return false;
          } else if (!t.codeNumRight) {
            t.showToast({ text: '请输入正确的验证码' });
            return false;
          }
          break;
        case 'ID':
          if (t.identityCardNum.length === 0) {
            t.showToast({ text: '请输入身份证号' });
            return false;
          } else if (!t.idCardMethod(t.identityCardNum)) {
            t.showToast({ text: '请输入正确的身份证号' });
            return false;
          }
          break;
      }
      console.log(name);
    },
    bindPhone: function bindPhone() {
      var t = this;
      console.log('我要绑定手机号');
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_auth_bindMobile__["a" /* default */])({
        account: t.inputPatientPhoneNum,
        encryptedData: wx.getStorageSync('encryptedData'),
        sessionKey: wx.getStorageSync('sessionKey'),
        iv: wx.getStorageSync('iv'),
        visitSiteId: '24'
      }).then(function (res) {
        console.log(res);
        if (res.responseObject.responseStatus) {
          wx.setStorageSync("userId", res.responseObject.responsePk);
          //t.getReportDetail({from:'meinian'});
          __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].codeRecord();
          t.createPatient();
        }
      });
    },
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
    cancelConfirm: function cancelConfirm() {
      var t = this;
      t.confirmOnOff = false;
      t.changeClickAble(true);
    },
    sureConfirm: function sureConfirm() {
      var _this = this;

      var t = this;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_auth_validCodeLogin__["a" /* default */])({
        validCode: t.codeNum,
        codeId: t.verificationCode,
        account: t.inputPatientPhoneNum,
        typeId: 2,
        customerId: __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("userId")
      }).then(function (res) {
        if (res.responseObject.responseStatus) {
          if (res.responseObject.responseData) {
            var _res$responseObject$r = res.responseObject.responseData,
                uniteNameWeixin = _res$responseObject$r.uniteNameWeixin,
                uniteNickname = _res$responseObject$r.uniteNickname,
                uniteFlagWeixin = _res$responseObject$r.uniteFlagWeixin;


            if (uniteFlagWeixin) {
              if (_this.unionId != uniteNameWeixin) {
                t.loading = false;
                t.showModal({
                  content: "该手机号码已被“" + uniteNickname + "”占用，是否更换绑定为当前微信?",
                  success: function success(res) {
                    if (res.confirm) {
                      console.log('用户点击确定');
                      t.loading = true;
                      t.bindPhone();
                    } else if (res.cancel) {
                      console.log('用户点击取消');
                    }
                  }
                });
              } else {}
            } else {
              t.bindPhone();
            }
          }
        } else {
          // 如果是新手机号，则进行绑定
          if (res.responseObject.responseCode == '0B0010') {
            t.bindPhone();
          } else {
            t.loading = false;
            t.showToast({ text: res.responseObject.responseMessage });
          }
        }
      });
    },
    idCardMethod: function idCardMethod(value) {
      var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
      };
      var tip = "",
          pass = true;
      value = value.toUpperCase();
      if (value.length == 15) {
        //15位身份证直接过
        pass = false;
      } else if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
        //tip = "身份证号格式错误";
        pass = false;
      } else if (!city[value.substr(0, 2)]) {
        //tip = "地址编码错误";
        pass = false;
      } else if (value.length == 18) {
        //18位身份证需要验证最后一位校验位
        value = value.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
            //校验位
        sum = 0,
            ai = 0,
            wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = value[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if (parity[sum % 11] != value[17]) {
          //tip = "校验位错误";
          pass = false;
        }
      }
      return pass;
    },
    getReport: function getReport() {
      var t = this;
      if (!t.clickAble) {
        return false;
      } else {
        t.changeClickAble(false);
      }
      if (!t.verifyPhoneNumber) {
        if (t.patientName.length === 0) {
          t.showToast({ text: '请填写体检人姓名' });
          t.changeClickAble(true);
          return false;
        }
        if (!t.identityNameRight) {
          t.showToast({ text: "不能包含数字和特殊字符" });
          t.changeClickAble(true);
          return false;
        }
        if (t.identityCardNum.length === 0) {
          t.showToast({ text: '请输入身份证号' });
          t.changeClickAble(true);
          return false;
        } else if (!t.identityCardNumRight) {
          t.showToast({ text: '请输入正确的身份证号' });
          t.changeClickAble(true);
          return false;
        }
        if (t.inputPatientPhoneNum.length === 0) {
          t.showToast({ text: '请输入手机号' });
          t.changeClickAble(true);
          return false;
        } else if (!t.identityPhoneNumRight) {
          t.showToast({ text: '请输入正确的手机号' });
          t.changeClickAble(true);
          return false;
        }
        if (t.codeNum.length === 0) {
          t.showToast({ text: '请输入验证码' });
          t.changeClickAble(true);
          return false;
        } else if (!t.codeNumRight) {
          t.showToast({ text: '请输入正确的验证码' });
          t.changeClickAble(true);
          return false;
        }
        t.confirmOnOff = true;
      } else {
        if (t.patientName.length === 0) {
          t.showToast({ text: '请填写体检人姓名' });
          t.changeClickAble(true);
          return false;
        }
        if (t.identityCardNum.length === 0) {
          t.showToast({ text: '请输入身份证号' });
          t.changeClickAble(true);
          return false;
        } else if (!t.idCardMethod(t.identityCardNum)) {
          t.showToast({ text: '请输入正确的身份证号' });
          t.changeClickAble(true);
          return false;
        }
        t.createPatient();
      }
    },
    createPatient: function createPatient() {
      var t = this;
      var _data = {
        customerId: __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("userId"),
        patientName: t.inputPatientName,
        patientBirthday: t.idInfo.birthday,
        patientSex: t.idInfo.sex,
        mobile: t.phoneNum,
        certificateCode: t.identityCardNum,
        patientAge: t.idInfo.age,
        caseType: '15',
        visitSiteId: '24',
        patientSource: '1'
      };
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.createPatient,
        method: "POST",
        data: _data,
        done: function done(param) {
          if (param.responseObject.responseStatus) {
            t.savePatientCustomerId(param.responseObject.responsePk);
            t.getReportDetail({ from: 'meinian' });
          }
        }
      });
    },
    getVerificationCode: function getVerificationCode() {
      var t = this;
      if (t.inputPatientPhoneNum.length === 0) {
        t.showToast({ text: '请输入手机号' });
      } else if (t.verificationCodeIng) {
        return false;
      } else if (t.identityPhoneNumRight) {
        //既不是空手机号也不是错误的手机号也不是正在获取验证码的状态
        t.checkVerificationCode();
      } else {
        t.showToast({ text: '请输入正确的手机号' });
      }
    },
    ensureClickEvent: function ensureClickEvent() {
      var t = this;
      t.changeReportDialog(false);
      t.changeClickAble(true);
      wx.redirectTo({
        url: '/packageA/meinian/patientList?from=meinian'
      });
    }
  }),
  mounted: function mounted() {
    var t = this;
    console.log(t.verificationCodeIng);
  },

  components: {
    confirm: __WEBPACK_IMPORTED_MODULE_5_components_confirm__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_4_components_loading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapGetters(['verifyPhoneNumber', 'patientName', 'phoneNum', 'verificationCodeIng', 'verificationCodeNum', 'reportDialog', 'verificationCode', 'idInfo', 'clickAble', 'codeDes', 'limit']), {
    identityCardNumRight: function identityCardNumRight() {
      var t = this;

      var reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/i;
      return reg.test(t.identityCardNum);
    },
    codeNumRight: function codeNumRight() {
      var t = this;
      var reg = /(^\d{4}$)/i;
      return reg.test(t.codeNum);
    },
    identityPhoneNumRight: function identityPhoneNumRight() {
      var t = this;
      var reg = /^1\d{10}$/i;
      return reg.test(t.inputPatientPhoneNum);
    },
    identityNameRight: function identityNameRight() {
      var t = this;
      var isPass = /[`~!！？@#$%^&*()_+<>?:"{},，。\/;'[\] ]/.test(t.inputPatientName) || /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(t.inputPatientName) || /^(?=.*\d.*\b)/.test(t.inputPatientName) || /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig.test(t.inputPatientName);
      if (t.inputPatientName === "") {
        return false;
      } else if (isPass) {
        return false;
      } else {
        return true;
      }
    }
  })
});

/***/ }),

/***/ 781:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-inner"
  }, [_c('section', {
    staticClass: "loginMain"
  }, [_c('header', {
    staticClass: "logo"
  }), _vm._v(" "), _c('h1', [_vm._v("请填写您在美年大健康的体检信息")]), _vm._v(" "), _c('section', {
    staticClass: "formContent"
  }, [_c('aside', {
    staticClass: "labelBox"
  }, [_c('span', {
    staticClass: "labelName"
  }, [_vm._v("姓名")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.inputPatientName),
      expression: "inputPatientName"
    }],
    staticClass: "labelText",
    attrs: {
      "type": "text",
      "placeholder": "请填写真实姓名",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.inputPatientName)
    },
    on: {
      "blur": function($event) {
        $event.stopPropagation();
        _vm.blurInput('name')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.inputPatientName = $event.target.value
      }
    }
  })]), _vm._v(" "), _c('aside', {
    staticClass: "labelBox"
  }, [_c('span', {
    staticClass: "labelName"
  }, [_vm._v("身份证号")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.identityCardNum),
      expression: "identityCardNum"
    }],
    staticClass: "labelText",
    attrs: {
      "type": "text",
      "placeholder": "方便准确查询体检报告",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.identityCardNum)
    },
    on: {
      "blur": function($event) {
        $event.stopPropagation();
        _vm.blurInput('ID')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.identityCardNum = $event.target.value
      }
    }
  })]), _vm._v(" "), (!_vm.verifyPhoneNumber) ? _c('aside', {
    staticClass: "labelBox"
  }, [_c('span', {
    staticClass: "labelName"
  }, [_vm._v("手机号")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.inputPatientPhoneNum),
      expression: "inputPatientPhoneNum"
    }],
    staticClass: "labelText",
    attrs: {
      "type": "text",
      "placeholder": "请填写手机号",
      "eventid": '2'
    },
    domProps: {
      "value": (_vm.inputPatientPhoneNum)
    },
    on: {
      "blur": function($event) {
        $event.stopPropagation();
        _vm.blurInput('phone')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.inputPatientPhoneNum = $event.target.value
      }
    }
  })]) : _vm._e(), _vm._v(" "), (!_vm.verifyPhoneNumber) ? _c('aside', {
    staticClass: "labelBox sCode"
  }, [_c('span', {
    staticClass: "labelName"
  }, [_vm._v("验证码")]), _vm._v(" "), _c('p', {
    staticClass: "sendCodeBox"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.codeNum),
      expression: "codeNum"
    }],
    staticClass: "labelText getCode",
    attrs: {
      "type": "text",
      "placeholder": "请填写",
      "eventid": '3'
    },
    domProps: {
      "value": (_vm.codeNum)
    },
    on: {
      "blur": function($event) {
        $event.stopPropagation();
        _vm.blurInput('code')
      },
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.codeNum = $event.target.value
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "sendCode",
    class: {
      'onSend': _vm.verificationCodeIng
    },
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.getVerificationCode($event)
      }
    }
  }, [_c('i', {
    domProps: {
      "textContent": _vm._s(_vm.verificationCodeIng ? '重新发送' : _vm.codeDes)
    }
  }), _vm._v(" "), (_vm.limit) ? _c('i', {
    domProps: {
      "textContent": _vm._s(_vm.verificationCodeNum + 's')
    }
  }) : _vm._e()], 1)])], 1) : _vm._e(), _vm._v(" "), _c('p', {
    staticClass: "sureBtn",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.getReport($event)
      }
    }
  }, [_vm._v("查询体检报告")])], 1), _vm._v(" "), (_vm.confirmOnOff) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '确认提交',
        'cancel': '返回',
        'title': '提示',
        'content': '<p class=\'textAlign\'>请确认身份证号是否正确，提交后不得更改身份证号码信息</p><p class=\'textAlign\'>' + _vm.identityCardNum + '</p>',
      },
      "eventid": '6',
      "mpcomid": '0'
    },
    on: {
      "ensureClickEvent": _vm.sureConfirm,
      "cancelClickEvent": _vm.cancelConfirm
    }
  }) : _vm._e(), _vm._v(" "), (_vm.reportDialog) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '知道了',
        'title': '暂未查询到您的体检报告',
        'content': '<p class=\'textAlign\'>可能如下原因：</p><p class=\'textAlign\'>1. 身份证信息有误，请重新输入</p><p class=\'textAlign\'>2. 您的体检报告暂未生成</p>',
      },
      "eventid": '7',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.ensureClickEvent
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '2'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-32144362", esExports)
  }
}

/***/ })

},[1247]);