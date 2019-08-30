global.webpackJsonp([107],{

/***/ 817:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientOrder_vue__ = __webpack_require__(819);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_887786ea_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientOrder_vue__ = __webpack_require__(820);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(818)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_outpatientOrder_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_887786ea_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_outpatientOrder_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/outpatientOrder/outpatientOrder.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] outpatientOrder.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-887786ea", Component.options)
  } else {
    hotAPI.reload("data-v-887786ea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 818:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 819:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_getPatientBase__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_dataLog__ = __webpack_require__(7);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc：门诊邀约选择
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/24.
 */
 // 返回首页组件





var XHRList = {
  updateMobile: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/baseinfo/v1/updateMobile/", // 更新患者手机号
  createOrder: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/clinic/v1/create/" // 创建预约单
};

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      patientInfo: {}, // 患者数据
      params: {}, // 上个路由传过来的参数
      changePhone: false, // 是否修改手机号
      mobileError: false, // 手机号是否有错误
      telphoneNumber: 0, // 用户手机号
      toastTips: "", // toast框提示的内容
      toastShow: "", // toast框是否显示
      timeSeleted: -1, // 预约时间选择
      timeinterval: "", // 预约时间展示
      clickFlag: true, // 限制点击
      backIndexShow: false // 返回首页是否显示
    };
  },

  methods: {
    // 修改手机号
    changeNumber: function changeNumber() {
      this.changePhone = true;
    },

    // 控制手机号输入
    onInput: function onInput() {
      var content = this.telphoneNumber.split("").filter(function (item, index) {
        return (/^[0-9]*$/.test(item) && index < 11
        );
      }).join("");
      this.telphoneNumber = content;
    },

    // 失焦验证
    validate: function validate() {
      var isPass = /^1\d{10}$/.test(this.telphoneNumber);
      this.changePhone = false;
      if (this.telphoneNumber.length === 0) {
        this.showToast("请补全手机号");
        this.clickFlag = false;
        return false;
      } else if (!isPass) {
        this.clickFlag = false;
        this.showToast("请输入正确的手机号码");
        return false;
      } else {
        return true;
      }
    },

    // 提交表单
    submitForm: function submitForm() {
      if (!this.clickFlag) return false;
      if (this.validate()) {
        this.updateMobile();
      }
    },

    // 提交预约单信息
    updateMobile: function updateMobile() {
      var that = this;
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.updateMobile,
        method: "POST",
        data: {
          isValid: 1, // string 是   1
          mobile: this.telphoneNumber, //  手机号
          patientId: this.patientId //  string 是  用户id
        },
        beforeSend: function beforeSend(config) {},
        done: function done(param) {
          console.log(param);
          if (param.responseObject.responseStatus && param.responseObject) {
            that.createOrder();
            that.clickFlag = true;
          } else {
            that.clickFlag = true;
            that.showToast('手机号修改保存失败');
          }
        },
        fail: function fail(err) {
          that.clickFlag = true;
          console.log(err);
        }
      });
    },

    // 获取患者数据
    getPatientBase: function getPatientBase() {
      var _this = this;

      return Object(__WEBPACK_IMPORTED_MODULE_3_common_js_HttpRequest_getPatientBase__["a" /* default */])({
        patientId: this.patientId
      }).then(function (data) {
        if (data.responseObject && data.responseObject.responseData) {
          var dataList = data.responseObject.responseData.dataList;
          _this.patientInfo = {
            patientName: dataList[0].patientName,
            age: dataList[0].patientAge,
            sexName: dataList[0].patientSex == 1 ? "男" : "女",
            idcardStatus: dataList[0].idcardStatus === "0" ? false : true,
            certificateCode: dataList[0].certificateCode,
            mobile: dataList[0].mobile
          };
          _this.telphoneNumber = _this.patientInfo.mobile;
        }
      });
    },

    // 创建预约单
    createOrder: function createOrder() {
      var that = this;
      var scheduleid = void 0;
      if (this.timeinterval.length == 1) {
        scheduleid = this.params.scheduleid[0];
      } else {
        scheduleid = this.params.scheduleid[this.timeSeleted - 1];
      }
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.createOrder,
        method: "POST",
        data: {
          customerId: this.doctorCustomerId, //string	是	医生id
          patientId: this.patientId, //	string	是	患者id
          fullName: this.targetMsg.nick, // 医生名字
          mobile: this.telphoneNumber, // 患者手机号
          isValid: 1, // string	是	是否有效
          hospitalId: this.targetMsg.companyId, //	string	是	医院id
          hospitalName: this.targetMsg.hospital, //	string	是	医院名称
          clinicTime: this.params.year + "-" + this.params.month + "-" + this.params.day, //	string	是	就诊时间
          visitSiteId: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getSiteId(), // string	是	站点
          status: "1", // string	是	状态，传1		1
          caseId: this.caseId, // string	是	病例id
          clinicType: "1", // string	是	门诊预约类型（1-预约中2-预约失败3-预约成功）		1
          timeType: this.timeSeleted, //string	是	门诊预约类型（1-上午2-下午3-全天）
          clinicCode: "", //string	是	门诊预约码
          scheduleid: scheduleid, // 排班id，
          cardno: this.patientInfo.certificateCode // 身份证号
        },
        beforeSend: function beforeSend(config) {},
        done: function done(param) {
          console.log(param);
          if (param.responseObject.responseStatus && param.responseObject) {
            wx.hideLoading();
            if (param.responseObject.responsePk == '0') {
              setTimeout(function () {
                that.showToast(param.responseObject.responseMessage);
              }, 0);
            } else {
              __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].setItem('sendOrderMsg', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
                clinicId: param.responseObject.responsePk,
                patientName: that.patientInfo.patientName,
                patientSex: that.patientInfo.sexName,
                patientAge: that.patientInfo.age,
                patientIdNum: that.certificateCodeEncrypt,
                clinicTime: that.params.year + "-" + that.params.month + "-" + that.params.day,
                weekDay: that.params.weekDay,
                clinicType: '1',
                timeType: that.timeSeleted == 1 ? '上午' : '下午'
              }));
              wx.navigateBack({
                delta: 2
              });
            }
          } else {
            console.log('失败');
          }
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    },

    //显示Toast提示
    showToast: function showToast(text) {
      wx.showToast({
        title: text,
        icon: "none",
        duration: 2000
      });
    },

    // 页面初始化
    mountedInit: function mountedInit() {
      this.params = JSON.parse(__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('calenderParams'));
      this.timeSeleted = -1;
      wx.setNavigationBarTitle({
        title: '预约门诊'
      });
      if (this.params.timeinterval.length == 1) {
        this.timeinterval = this.params.timeinterval[0];
      } else if (this.params.timeinterval.length == 2) {
        this.timeinterval = 'AL';
      }
      this.getPatientBase(); // 获取患者信息
    }
  },
  onLoad: function onLoad() {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
  },
  mounted: function mounted() {
    var query = this.$root.$mp.query;

    this.doctorCustomerId = query.doctorCustomerId;
    this.caseId = query.caseId;
    this.patientId = query.patientId;

    this.targetMsg = JSON.parse(__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("targetMsg"));

    this.mountedInit();
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_5_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    BackIndex: __WEBPACK_IMPORTED_MODULE_1_components_backIndex__["a" /* default */]
  },
  computed: {
    // 将身份证号加密
    certificateCodeEncrypt: function certificateCodeEncrypt() {
      if (this.patientInfo.certificateCode && this.patientInfo.certificateCode.length) {
        return this.patientInfo.certificateCode.substr(0, 3) + '***********' + this.patientInfo.certificateCode.substr(-4, 4);
      } else {
        return "";
      }
    }
  }
});

/***/ }),

/***/ 820:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "outpatient-order-inner"
  }, [_c('header', {
    staticClass: "outpatient-order-header"
  }, [_c('h2', [_vm._v("请选择当天具体时间"), _c('span', [_vm._v("(单选)")])])], 1), _vm._v(" "), _c('section', {
    staticClass: "outpatient-order-info-content"
  }, [_c('section', {
    staticClass: "info-container select-time"
  }, [_c('ul', {
    staticClass: "time-list"
  }, [(_vm.timeinterval == 'AL' || _vm.timeinterval == 'AM') ? _c('li', {
    staticClass: "time-item am",
    class: {
      'selected': _vm.timeSeleted == 1
    },
    attrs: {
      "data-alcode": "e191",
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.timeSeleted = 1
      }
    }
  }, [_vm._v(_vm._s(_vm.params.month + '-' + _vm.params.day) + "\n          " + _vm._s(_vm.params.weekDay) + " 上午\n        ")]) : _vm._e(), _vm._v(" "), (_vm.timeinterval == 'AL' || _vm.timeinterval == 'PM') ? _c('li', {
    staticClass: "time-item pm",
    class: {
      'selected': _vm.timeSeleted == 2
    },
    attrs: {
      "data-alcode": "e191",
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.timeSeleted = 2
      }
    }
  }, [_vm._v(_vm._s(_vm.params.month + '-' + _vm.params.day) + "\n          " + _vm._s(_vm.params.weekDay) + " 下午\n        ")]) : _vm._e()], 1)], 1), _vm._v(" "), _c('h3', {
    staticClass: "info-title"
  }, [_vm._v("就诊人信息")]), _vm._v(" "), _c('section', {
    staticClass: "info-container patient-info"
  }, [_c('ul', {
    staticClass: "patient-info-list",
    attrs: {
      "data-alcode-mod": "770"
    }
  }, [_c('li', {
    staticClass: "patient-info-item"
  }, [_c('span', {
    staticClass: "patient-info-item-left"
  }, [_vm._v("患者姓名")]), _vm._v(" "), _c('span', {
    staticClass: "patient-info-item-right"
  }, [_vm._v(_vm._s(_vm.patientInfo.patientName))])]), _vm._v(" "), _c('li', {
    staticClass: "patient-info-item"
  }, [_c('span', {
    staticClass: "patient-info-item-left"
  }, [_vm._v("身份证")]), _vm._v(" "), _c('span', {
    staticClass: "patient-info-item-right"
  }, [_vm._v(_vm._s(_vm.certificateCodeEncrypt))])]), _vm._v(" "), _c('li', {
    staticClass: "patient-info-item",
    attrs: {
      "data-alcode": "e189",
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.changeNumber()
      }
    }
  }, [_c('span', {
    staticClass: "patient-info-item-left phone"
  }, [_vm._v("手机号")]), _vm._v(" "), (!_vm.changePhone) ? _c('div', {
    staticClass: "patient-info-item-right"
  }, [_c('span', {
    staticClass: "phone-number"
  }, [_vm._v(_vm._s(_vm.telphoneNumber))]), _c('span', {
    staticClass: "change"
  }, [_vm._v("修改")])]) : _c('div', {
    staticClass: "patient-info-item-right"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.telphoneNumber),
      expression: "telphoneNumber"
    }],
    staticClass: "phone-input",
    attrs: {
      "focus": _vm.changePhone,
      "name": "telphoneNumber",
      "type": "number",
      "placeholder": "便于接收重要信息",
      "eventid": '2'
    },
    domProps: {
      "value": (_vm.telphoneNumber)
    },
    on: {
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.telphoneNumber = $event.target.value
      }, function($event) {
        _vm.onInput()
      }],
      "blur": function($event) {
        _vm.validate()
      }
    }
  })])])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "info-container pay-way"
  }, [_c('span', {
    staticClass: "pay-way-left"
  }, [_vm._v("支付方式")]), _vm._v(" "), _c('span', {
    staticClass: "pay-way-right"
  }, [_vm._v("去医院支付")])]), _vm._v(" "), _c('section', {
    staticClass: "info-container order-tips"
  }, [_c('p', {
    staticClass: "order-tips-top"
  }, [_vm._v("挂号费以医院挂号窗口为主,平台不收取任何费用")]), _vm._v(" "), _c('section', {
    staticClass: "order-tips-bottom"
  }, [_c('p', {
    staticClass: "order-tips-bottom-title"
  }, [_vm._v("就诊须知：")]), _vm._v(" "), _c('p', {
    staticClass: "order-tips-bottom-item"
  }, [_vm._v("停诊将短信通知，请保持手机畅通")]), _vm._v(" "), _c('p', {
    staticClass: "order-tips-bottom-item"
  }, [_vm._v("实名制预约，就诊人信息不符将无法取号")])], 1)], 1), _vm._v(" "), _c('section', {
    attrs: {
      "data-alcode-mod": "771"
    }
  }, [(_vm.timeSeleted != -1) ? _c('footer', {
    staticClass: "order-submit on",
    attrs: {
      "data-alcode": "e190",
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.submitForm()
      }
    }
  }, [_vm._v("提交")]) : _vm._e(), _vm._v(" "), (_vm.timeSeleted == -1) ? _c('footer', {
    staticClass: "order-submit off"
  }, [_vm._v("提交")]) : _vm._e()], 1)], 1), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-887786ea", esExports)
  }
}

/***/ })

},[1255]);