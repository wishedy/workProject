global.webpackJsonp([37],{

/***/ 558:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_feedback_vue__ = __webpack_require__(560);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0305a934_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_feedback_vue__ = __webpack_require__(561);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(559)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_feedback_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0305a934_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_feedback_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/feedback/feedback.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] feedback.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0305a934", Component.options)
  } else {
    hotAPI.reload("data-v-0305a934", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 559:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 560:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_dataLog__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by YuxiYang on 2017/12/25.
 */



var feedbackUrl = __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/suggestion/v1/create/";

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      customerId: "",
      triageCustomerId: "",
      doctorId: "",
      suggestionType: {
        service: false,
        setting: false,
        others: false
      },
      suggestionNumbers: "",
      suggestionContent: "",
      errorShow: false,
      errorMsg: "",
      submitSuccess: false,
      backTimeout: 2,
      finish: false,
      active: false
    };
  },

  components: {
    toast: __WEBPACK_IMPORTED_MODULE_1_components_toast__["a" /* default */]
  },
  watch: {
    "suggestionContent": {
      handler: function handler(val, oldval) {
        if (this.suggestionType.others) {
          if (this.suggestionContent.length > 0) {
            this.active = true;
          } else {
            this.active = false;
          }
        } else {}
      }
    },
    "suggestionType": {
      handler: function handler(val, oldval) {
        if (this.suggestionType.others) {
          if (this.suggestionContent.length > 0) {
            this.active = true;
          } else {
            this.active = false;
          }
        } else if (this.suggestionType.service || this.suggestionType.setting) {
          this.active = true;
        } else {
          this.active = false;
        }
      },
      deep: true
    }
  },
  onUnload: function onUnload() {
    this.submitSuccess = false;
    this.suggestionType = {
      service: false,
      setting: false,
      others: false
    };
    this.suggestionNumbers = "";
    this.suggestionContent = "";
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].enterBrowse();
    wx.setNavigationBarTitle({
      title: "建议反馈"
    });
    this.backTimeout = 2;
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_2_dataLog__["a" /* default */].leaveBrowse();
  },
  mounted: function mounted() {
    var query = this.$root.$mp.query;
    this.from = query.from || "";
    this.customerId = query.customerId || "";
    this.triageCustomerId = query.triageCustomerId || "";
    this.doctorId = query.doctorCustomerId || "";
    clearInterval(this._interval);
  },

  methods: {
    //检查后没有error后提交所有数据
    checkAllData: function checkAllData() {
      var _this = this;
      if (!this.suggestionType.service && !this.suggestionType.setting && !this.suggestionType.others) {
        this.validateToast("您还有问题未完善");
      } else {
        if (this.suggestionType.others && !this.suggestionContent) {
          this.validateToast("您还有问题未完善");
        } else {
          _this.submitAllData();
        }
      }
    },
    submitAllData: function submitAllData() {
      var _this2 = this;

      var _this = this,
          _arr = [];
      for (var i in this.suggestionType) {
        if (this.suggestionType[i]) {
          switch (i) {
            case "service":
              _arr.push(3);
              break;
            case "setting":
              _arr.push(4);
              break;
            case "others":
              _arr.push(5);
              break;
          }
        }
      }
      wx.showLoading({
        mask: true
      });
      wx.getNetworkType({
        success: function success(data) {
          var networkType = data.networkType;
          var device = wx.getSystemInfoSync();

          __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].ajax({
            url: feedbackUrl,
            method: "POST",
            data: {
              suggestionType: _arr.join(""),
              triageCustomerId: _this2.triageCustomerId,
              suggestionContent: _this2.suggestionContent,
              suggestionNumbers: _this2.suggestionNumbers,
              customerId: _this.customerId || wx.getStorageSync("userId") || 0,
              doctorId: _this2.doctorId || 0,
              visitSiteId: __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getSiteId(),
              equipmentVersion: device.model,
              networkEnvironment: networkType,
              systemVersion: device.system
            },
            done: function done(data) {
              wx.hideLoading();
              if (data.responseObject.responseStatus) {
                _this.submitSuccess = true;
                _this.backToPast();
              } else {
                _this.submitSuccess = false;
                _this.validateToast("提交失败，请检查您的网络");
              }
            },
            fail: function fail(err) {}
          });
        }
      });
    },
    backToPast: function backToPast() {
      var _this3 = this;

      this._interval = setInterval(function () {
        _this3.backTimeout = _this3.backTimeout - 1;
        if (_this3.backTimeout === 0) {
          clearInterval(_this3._interval);
          _this3.goToHref();
        }
      }, 1000);
    },
    playPhone: function playPhone() {
      wx.makePhoneCall({
        phoneNumber: "400-0010210", //此号码并非真实电话号码，仅用于测试
        success: function success() {
          console.log("拨打电话成功！");
        },
        fail: function fail() {
          console.log("拨打电话失败！");
        }
      });
    },
    goToHref: function goToHref() {
      if (this._interval) clearInterval(this._interval);
      wx.navigateBack({
        delta: 1
      });
    },
    validateToast: function validateToast(content) {
      wx.showToast({
        title: content,
        icon: "none",
        duration: 2000
      });
    },
    contentLimit: function contentLimit() {
      if (__WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getByteLength(this.suggestionContent) > 100) {
        this.suggestionContent = __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getStrByteLength(this.suggestionContent, 100);
        // this.errorShow = true;
        this.validateToast("最多只能输入100字");
      }
    },
    Limit: function Limit() {
      if (__WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getByteLength(this.suggestionNumbers) > 50) {
        this.suggestionNumbers = __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getStrByteLength(this.suggestionNumbers, 50);
      }
    },
    getByteLen: function getByteLen(len) {
      return __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getByteLen(len);
    }
  }
});

/***/ }),

/***/ 561:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "al-mainInner"
  }, [(!_vm.submitSuccess) ? _c('section', {
    staticClass: "main-inner"
  }, [_c('scroll-view', {
    staticClass: "main-inner-content",
    attrs: {
      "scroll-y": "true"
    }
  }, [_c('section', {
    staticClass: "feedback-main"
  }, [_c('section', {
    staticClass: "question"
  }, [_c('section', {
    staticClass: "question-feedback"
  }, [_vm._v("(必选)请选择你想反馈的问题点")]), _vm._v(" "), _c('p', {
    staticClass: "question-type",
    class: {
      'on': _vm.suggestionType.service
    },
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.suggestionType.service = !_vm.suggestionType.service
      }
    }
  }, [_c('span', [_vm._v("服务问题：医生回复慢、质量差，推荐的医生不合理")])]), _vm._v(" "), _c('p', {
    staticClass: "question-type",
    class: {
      'on': _vm.suggestionType.setting
    },
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.suggestionType.setting = !_vm.suggestionType.setting
      }
    }
  }, [_c('span', [_vm._v("使用问题：产品使用障碍、流程不顺畅")])]), _vm._v(" "), _c('p', {
    staticClass: "question-type",
    class: {
      'on': _vm.suggestionType.others
    },
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.suggestionType.others = !_vm.suggestionType.others
      }
    }
  }, [_c('span', [_vm._v("其他问题")])])], 1), _vm._v(" "), _c('section', {
    staticClass: "question"
  }, [_c('section', {
    staticClass: "question-feedback"
  }, [(_vm.suggestionType.others) ? _c('span', [_vm._v("(必填)")]) : _vm._e(), (!_vm.suggestionType.others) ? _c('span', [_vm._v("(选填)")]) : _vm._e(), _vm._v("请补充详细问题和描述")]), _vm._v(" "), _c('figure', {
    staticClass: "main-input-box-textarea-inner"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.suggestionContent),
      expression: "suggestionContent",
      modifiers: {
        "trim": true
      }
    }],
    staticClass: "input-textArea",
    attrs: {
      "placeholder": "请输入问题",
      "cursor-spacing": "10",
      "eventid": '3'
    },
    domProps: {
      "value": (_vm.suggestionContent)
    },
    on: {
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.suggestionContent = $event.target.value.trim()
      }, _vm.contentLimit],
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "text-num-tips"
  }, [_vm._v(_vm._s(_vm.suggestionContent.length) + "/100")])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "question"
  }, [_c('section', {
    staticClass: "question-feedback"
  }, [_vm._v("(选填)请输入联系信息")]), _vm._v(" "), _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.suggestionNumbers),
      expression: "suggestionNumbers"
    }],
    staticClass: "input-textArea2",
    attrs: {
      "placeholder": "请填写QQ号/电话/邮箱",
      "maxlength": "50",
      "auto-height": "true",
      "eventid": '4'
    },
    domProps: {
      "value": (_vm.suggestionNumbers)
    },
    on: {
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.suggestionNumbers = $event.target.value
      }, _vm.Limit]
    }
  })], 1), _vm._v(" "), _c('button', {
    staticClass: "btn-primary go-next",
    class: {
      'active': _vm.active
    },
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": _vm.checkAllData
    }
  }, [_vm._v("提交反馈")])], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '1'
    }
  }, [(_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '0'
    }
  }) : _vm._e()], 1)], 1)], 1) : (_vm.submitSuccess) ? _c('section', {
    staticClass: "get-back"
  }, [_c('section', {
    staticClass: "icon"
  }), _vm._v(" "), _c('section', {
    staticClass: "title"
  }, [_vm._v("提交成功")]), _vm._v(" "), _c('section', {
    staticClass: "description"
  }, [_vm._v("\n      您的反馈我们已经收到\n      "), _c('br'), _vm._v("感谢对我们的支持理解\n    ")], 1), _vm._v(" "), _c('section', {
    staticClass: "back",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.goToHref
    }
  }, [_c('span', {
    staticClass: "back-timing"
  }, [_vm._v(_vm._s(_vm.backTimeout) + "s后")]), _vm._v(" "), _c('em', [_vm._v("自动返回")])], 1)], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "contactMain"
  }, [_c('section', {
    staticClass: "con_center"
  }, [_c('section', {
    staticClass: "con_itemList"
  }, [_c('div', {
    staticClass: "con_workTimeBox"
  }, [_c('span', {
    staticClass: "workingTitle"
  }, [_c('span', {
    staticClass: "con_point"
  }), _vm._v("工作时间")]), _vm._v(" "), _c('span', {
    staticClass: "workingWeek"
  }, [_vm._v("周一至周五")]), _vm._v(" "), _c('span', {
    staticClass: "workingHour"
  }, [_vm._v("09:00-18:00")]), _vm._v(" "), _c('span', {
    staticClass: "workingTip"
  }, [_vm._v("节假日除外")])]), _vm._v(" "), _c('div', {
    staticClass: "con_phone",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": _vm.phoneCall
    }
  }, [_c('a', [_c('p', {
    staticClass: "con_phoneText"
  }, [_c('span', {
    staticClass: "con_wxText"
  }, [_vm._v("电话")]), _c('span', {
    staticClass: "con_phoneNum"
  }, [_vm._v("400-0010210")]), _c('span', {
    staticClass: "con_phoneIcon"
  })])], 1)]), _vm._v(" "), _c('div', {
    staticClass: "con_weiXin"
  }, [_c('span', {
    staticClass: "con_wxText"
  }, [_vm._v("微信")]), _c('span', {
    staticClass: "con_wxNum"
  }, [_vm._v("weiyizs123")])])]), _vm._v(" "), _c('section', {
    staticClass: "con_itemList"
  }, [_c('div', {
    staticClass: "con_workTimeBox notWork"
  }, [_c('span', {
    staticClass: "workingTitle"
  }, [_c('span', {
    staticClass: "con_point"
  }), _vm._v("非工作时间")])]), _vm._v(" "), _c('div', {
    staticClass: "con_email"
  }, [_c('span', {
    staticClass: "con_wxText"
  }, [_vm._v("邮箱")]), _c('span', {
    staticClass: "con_wxNum"
  }, [_vm._v("help@allinmed.cn")])])])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0305a934", esExports)
  }
}

/***/ })

},[1232]);