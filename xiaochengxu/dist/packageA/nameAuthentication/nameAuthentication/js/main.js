global.webpackJsonp([19],{

/***/ 802:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_nameAuthentication_vue__ = __webpack_require__(804);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7754cdfb_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_nameAuthentication_vue__ = __webpack_require__(806);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(803)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7754cdfb"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_nameAuthentication_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7754cdfb_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_nameAuthentication_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/nameAuthentication/nameAuthentication.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] nameAuthentication.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7754cdfb", Component.options)
  } else {
    hotAPI.reload("data-v-7754cdfb", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 803:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 804:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_checkIdCard__ = __webpack_require__(805);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_miniUtil_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(4);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by lichenyang on 2018/03/26.
 */



 // 返回首页组件




var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["a" /* createNamespacedHelpers */])('imSceneDoctor'),
    mapState = _createNamespacedHelp.mapState,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      name: '', //患者姓名
      idCard: '', // 身份证号
      errorMsg: "", // 错误提示话术
      errorShow: false, // toust提示框是否显示
      patientId: 0, // 患者id
      finish: false,
      backIndexShow: false // 返回首页是否显示
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(['patientInfo'])),
  onLoad: function onLoad() {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
  },
  mounted: function mounted() {
    var query = this.$root.$mp.query;
    this.patientId = query.patientId;
    this.caseId = query.caseId;
    this.doctorCustomerId = query.doctorCustomerId;
    this.name = this.patientInfo.patientName;
    wx.setNavigationBarTitle({
      title: '\u5B9E\u540D\u8BA4\u8BC1'
    });
    this.init();
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setPatientInfo']), {
    init: function init() {
      this.patientInfo.certificateCode && (this.idCard = this.patientInfo.certificateCode);
    },
    validateName: function validateName(name) {
      var isPass = /[`~!！？@#$%^&*()_+<>?:"{},，。\/;'[\] ]/.test(name) || /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g.test(this.nameValue) || /^(?=.*\d.*\b)/.test(this.nameValue);

      if (name.length === 0) {
        this.toastShow("请输入患者姓名");
        return false;
      } else if (isPass) {
        this.toastShow("请输入真实姓名");
        return false;
      } else {
        return true;
      }
    },
    validateCard: function validateCard(idCard) {
      if (idCard.length === 0) {
        this.toastShow("请输入身份证号码");
        return false;
      } else if (!this.idCardMethod(idCard)) {
        this.toastShow("请输入正确的身份证号码");
        return false;
      } else {
        return true;
      }
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

    // 验证字段函数
    validate: function validate() {
      if (this.validateName(this.name) && this.validateName(this.idCard)) {
        this.checkCardFun();
      }
    },

    // input 事件
    inputMaxLength: function inputMaxLength(attr, length) {
      this[attr] = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrByteLen(this[attr], length);
    },

    // toast 框显示
    toastShow: function toastShow() {
      var errorMsg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "需要传入错误话术";

      wx.showToast({
        title: errorMsg,
        icon: "none",
        duration: 2000
      });
    },

    // 验证姓名与身份证是否符合函数
    checkCardFun: function checkCardFun() {
      var _this = this;

      var that = this;
      if (this.finish) return false;
      this.finish = true;
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_checkIdCard__["a" /* default */])({
        patientId: that.patientId,
        name: that.name,
        cardno: that.idCard
      }).then(function (data) {
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData,
            responseMessage = _data$responseObject.responseMessage;

        _this.finish = false;
        if (responseStatus) {
          var dataList = responseData.dataList,
              _responseData$dataLis = responseData.dataList,
              code = _responseData$dataLis.code,
              msg = _responseData$dataLis.msg,
              patientName = _responseData$dataLis.patientName,
              patientAge = _responseData$dataLis.patientAge,
              patientSex = _responseData$dataLis.patientSex;

          if (!!dataList) {
            if (code === "0") {
              var _patientInfo = that.patientInfo;
              _patientInfo.idcardStatus = true;
              that.setPatientInfo(_patientInfo);
              wx.redirectTo({
                url: '/packageA/outpatientCalender/outpatientCalender?doctorCustomerId=' + that.doctorCustomerId + '&caseId=' + that.caseId + '&patientId=' + that.patientId
              });
            } else {
              that.toastShow('患者姓名与身份证信息不符');
            }
          }
        } else {
          _this.finish = false;
          console.log("验证失败");
        }
      }).catch(function (err) {
        _this.finish = false;
        console.log(err);
      });
    },

    // 去意见反馈页
    goFeedback: function goFeedback() {
      wx.navigateTo({
        url: '/pages/feedback/feedback?from=im&customerId=' + __WEBPACK_IMPORTED_MODULE_4_common_js_miniUtil_localStorage__["a" /* default */].getItem('userId') + '&doctorCustomerId=' + this.doctorCustomerId
      });
    }
  }),
  components: {
    BackIndex: __WEBPACK_IMPORTED_MODULE_3_components_backIndex__["a" /* default */]
  }
});

/***/ }),

/***/ 805:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = checkIdCard;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);

/**
 * @Desc：验证身份证号和姓名是否匹配
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/3/27.
 */



function checkIdCard(param) {
  var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/apix/interact/v2/checkIdCard/";
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    console.log(param);
    Object(__WEBPACK_IMPORTED_MODULE_1_common_js_util_ajax__["a" /* default */])({
      url: XHRUrl,
      method: "POST",
      data: {
        patientId: param.patientId,
        name: param.name,
        type: "idcard",
        cardno: param.cardno
      },
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

/***/ 806:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "authenticationMain"
  }, [(_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "authen-topBanner"
  }), _vm._v(" "), _c('section', {
    staticClass: "authen-container",
    attrs: {
      "data-alcode-mod": "758"
    }
  }, [_c('section', {
    staticClass: "authen-center"
  }, [_c('ul', {
    staticClass: "authen-info-list"
  }, [_c('li', {
    staticClass: "authen-title"
  }, [_vm._v("患者真实姓名")]), _vm._v(" "), _c('li', {
    staticClass: "authen-input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.name),
      expression: "name"
    }],
    attrs: {
      "type": "text",
      "name": "patientName",
      "placeholder": "请填写真实姓名",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.name)
    },
    on: {
      "blur": function($event) {
        _vm.validateName(_vm.name)
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.name = $event.target.value
      }, function($event) {
        _vm.inputMaxLength('name', 40)
      }]
    }
  })])], 1), _vm._v(" "), _c('ul', {
    staticClass: "authen-info-list"
  }, [_c('li', {
    staticClass: "authen-title"
  }, [_vm._v("身份证号")]), _vm._v(" "), _c('li', {
    staticClass: "authen-input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.idCard),
      expression: "idCard"
    }],
    attrs: {
      "type": "text",
      "name": "idCard",
      "placeholder": "填写患者证件号码",
      "eventid": '1'
    },
    domProps: {
      "value": (_vm.idCard)
    },
    on: {
      "blur": function($event) {
        _vm.validateCard(_vm.idCard)
      },
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.idCard = $event.target.value
      }, function($event) {
        _vm.inputMaxLength('idCard', 18)
      }]
    }
  })])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "tips-box"
  }, [_vm._v("\n      认证信息是您在唯医骨科后续就诊的凭证，请谨慎填写；认证过程如有任何疑问,请"), _c('span', {
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.goFeedback()
      }
    }
  }, [_vm._v("联系我们")])]), _vm._v(" "), _c('button', {
    staticClass: "finish-btn",
    attrs: {
      "data-alcode": "e172",
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.validate()
      }
    }
  }, [_vm._v("\n      完成\n    ")])], 1), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '1'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7754cdfb", esExports)
  }
}

/***/ })

},[1253]);