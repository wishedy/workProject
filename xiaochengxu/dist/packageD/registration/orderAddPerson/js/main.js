global.webpackJsonp([93],{

/***/ 1053:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderAddPerson_vue__ = __webpack_require__(1055);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_272834a6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderAddPerson_vue__ = __webpack_require__(1056);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1054)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-272834a6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderAddPerson_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_272834a6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderAddPerson_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/orderAddPerson.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] orderAddPerson.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-272834a6", Component.options)
  } else {
    hotAPI.reload("data-v-272834a6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1054:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1055:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
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
//
//
//
//
//

/*
  * @Desc:添加就诊人
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by 朱宁 on  2019/6/24
  *
  */






/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      username: '',
      sexSelect: -1, // 性别选择控制
      birthClickNum: 0, // 生日是否选择了,因为初始化的执行一次，所以用数字 ++
      pickerShow: false, // 生日选择器是否显示，每次进来都让其重新初始化；
      birthInput: "", // 出生日期
      defaultTime: '',
      currTime: "",
      customerId: '',
      mobile: '',
      infoFlag: false
    };
  },

  components: {
    Toast: __WEBPACK_IMPORTED_MODULE_3_components_toast__["a" /* default */]
  },
  onLoad: function onLoad() {
    this.username = '';
    this.sexSelect = -1;
    this.birthClickNum = 0;
    this.pickerShow = true;
    this.birthInput = '';
    try {
      this.customerId = wx.getStorageSync('userId');
    } catch (e) {}
    try {
      this.mobile = wx.getStorageSync('mobile');
    } catch (e) {}
    this.getPickerTime();
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["d" /* mapGetters */])(['toastShow', 'toastContent', 'updatePatient', 'isLogin'])),
  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["c" /* mapActions */])(['showToast', 'hideToast', 'setPatientMessage', 'setIsLogin']), Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["e" /* mapMutations */])(['addUpdatePatientList']), {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },
    addPerson: function addPerson() {
      var _this = this;
      var sex = '未选择';
      if (this.sexSelect === 1) {
        sex = '男';
      } else if (this.sexSelect === 2) {
        sex = '女';
      } else {
        sex = '未选择';
      }
      var age = '28';
      var now = new Date();
      var nowYear = now.getFullYear();
      var pYear = this.birthInput.substr(0, 4);
      var pMonth = this.birthInput.substr(5, 2);
      age = now.getMonth() + 1 > pMonth ? nowYear - pYear + 1 : nowYear - pYear;

      // console.log(`姓名：${this.username}，性别：${sex}，出生日期：${this.birthInput}，年龄：${age}`)

      wx.showLoading({ title: "正在加载..." });
      var param = {
        customerId: this.customerId || 1550555211623,
        patientName: this.username,
        patientSex: this.sexSelect,
        patientBirthday: this.birthInput,
        mobile: this.mobile
      };
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/customer/patient/relation/v1/create2/',
        method: "POST",
        data: param,
        done: function done(response) {
          try {
            wx.setStorageSync('patientInfo', __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(response.responseObject.responseData.dataList));
          } catch (e) {}
          wx.hideLoading();
          _this.infoFlag = false;
          wx.navigateBack({ delta: 1 });
        }
      });
    },

    // input最大长度事件
    inputMaxLength: function inputMaxLength(attr, length) {
      this[attr] = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getStrByteLen(this[attr], length);
    },

    // input失焦事件
    validateBlur: function validateBlur() {
      this.infoFlag = this.infoJudge();
      if (this.username.trim() === "") this.infoFlag = false;
    },

    /** 选择性别时的函数 */
    selectSex: function selectSex(index) {
      this.sexSelect = index;
      this.infoFlag = this.infoJudge();
    },

    /** 生日 picker 选择回调函数 */
    selectTimeFn: function selectTimeFn(e) {
      var _this = this;
      var time = {};
      var _timeArr = e.target.value.split("-");
      //月份去零
      time.month = _timeArr[1] > 9 ? _timeArr[1] : _timeArr[1].split("0")[1];
      //天数去零
      time.day = _timeArr[2] > 9 ? _timeArr[2] : _timeArr[2].split("0")[1];
      time.year = _timeArr[0];
      _this.birthClickNum++;
      // _this.birthInput = time.year + '-' + time.month.toString().padStart(2, '0') + "-" + time.day.toString().padStart(2, '0') ;
      if (time.month < 10) time.month = '0' + time.month;
      if (time.day < 10) time.day = '0' + time.day;
      _this.birthInput = time.year + "-" + time.month + "-" + time.day;
      this.infoFlag = this.infoJudge();
    },
    getPickerTime: function getPickerTime() {
      var _this = this;
      this.birthClickNum = 1;
      var time = {};
      var dataTemp = new Date();
      time.year = dataTemp.getFullYear();
      time.month = dataTemp.getMonth() + 1;
      time.day = dataTemp.getDate();
      _this.currTime = time.year + "-" + time.month + "-" + time.day;
      _this.defaultTime = "2000-" + time.month + "-" + time.day;
    },
    confirmModal: function confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
      var _this = this;
      if (!this.modalFlag) {
        this.modalFlag = true;
        wx.showModal({
          content: info || "出错了",
          showCancel: cancleFlag || false,
          confirmText: '知道了',
          confirmColor: '#333',
          success: function success(res) {
            _this.modalFlag = false;
            if (res.confirm) {
              callbackFlag && (callbackFlag = callbackFlagVal);
            }
          }
        });
      }
    },
    infoJudge: function infoJudge() {
      return this.username.trim() != '' && this.sexSelect != -1 && this.birthInput != '';
    }
  }),
  onUnload: function onUnload() {
    this.pickerShow = false;
    this.hideToast();
  }
});

/***/ }),

/***/ 1056:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "add-patient-content"
  }, [_c('article', {
    staticClass: "add-patient-content-item"
  }, [_c('aside', [_vm._v("姓名")]), _vm._v(" "), _c('figure', {
    staticClass: "add-patient-input"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.username),
      expression: "username"
    }],
    attrs: {
      "type": "text",
      "placeholder": "请填写真实姓名",
      "id": "patientName",
      "maxlength": "10",
      "placeholder-style": "color:#aaaaaa;",
      "disabled": _vm.updateInfo,
      "name": "username",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.username)
    },
    on: {
      "blur": _vm.validateBlur,
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.username = $event.target.value
      }, function($event) {
        _vm.inputMaxLength('username', 40)
      }]
    }
  })])], 1), _vm._v(" "), _c('article', {
    staticClass: "add-patient-content-item"
  }, [_c('aside', [_vm._v("性别")]), _vm._v(" "), _c('figure', {
    staticClass: "add-patient-input"
  }, [_c('section', {
    staticClass: "add-patient-sex-selector ",
    class: {
      'on': _vm.sexSelect == 1
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.selectSex(1)
      }
    }
  }, [_c('i', {
    staticClass: "add-patient-selector"
  }), _vm._v(" "), _c('span', [_vm._v("男")])], 1), _vm._v(" "), _c('section', {
    staticClass: "add-patient-sex-selector women",
    class: {
      'on': _vm.sexSelect == 2
    },
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.selectSex(2)
      }
    }
  }, [_c('i', {
    staticClass: "add-patient-selector"
  }), _vm._v(" "), _c('span', [_vm._v("女")])], 1)], 1)], 1), _vm._v(" "), _c('article', {
    staticClass: "add-patient-content-item"
  }, [_c('aside', [_vm._v("出生日期")]), _vm._v(" "), _c('figure', {
    staticClass: "add-patient-input birth-box"
  }, [_c('p', {
    staticClass: "contentMessage",
    class: {
      'on': _vm.birthClickNum > 1
    }
  }, [_vm._v(_vm._s(_vm.birthClickNum > 1 ? _vm.birthInput : '请选择'))]), _vm._v(" "), _c('picker', {
    staticClass: "time-picker",
    staticStyle: {
      "position": "absolute",
      "top": "0",
      "width": "100%",
      "height": "100%"
    },
    attrs: {
      "mode": "date",
      "value": _vm.defaultTime,
      "start": "1900-01-01",
      "end": _vm.currTime,
      "eventid": '3'
    },
    on: {
      "change": _vm.selectTimeFn
    }
  }, [_c('view', {
    staticClass: "picker",
    staticStyle: {
      "position": "absolute",
      "top": "0",
      "width": "100%",
      "height": "100%"
    }
  })])], 1)], 1), _vm._v(" "), _c('form', {
    staticClass: "add-patient-btn",
    attrs: {
      "report-submit": "true",
      "eventid": '5'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.infoFlag) ? _c('button', {
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": _vm.addPerson
    }
  }, [_vm._v("完成")]) : _vm._e(), _vm._v(" "), (!_vm.infoFlag) ? _c('button', {
    staticClass: "disabled"
  }, [_vm._v("完成")]) : _vm._e()], 1), _vm._v(" "), (_vm.toastShow) ? _c('Toast', {
    attrs: {
      "content": _vm.toastContent,
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-272834a6", esExports)
  }
}

/***/ })

},[1301]);