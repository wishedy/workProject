global.webpackJsonp([92],{

/***/ 1012:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderDepartment_vue__ = __webpack_require__(1014);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ef2e6bea_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderDepartment_vue__ = __webpack_require__(1018);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1013)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-ef2e6bea"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderDepartment_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_ef2e6bea_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderDepartment_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/orderDepartment.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] orderDepartment.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-ef2e6bea", Component.options)
  } else {
    hotAPI.reload("data-v-ef2e6bea", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1013:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1014:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_get_iterator__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_OrderRule__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_ensure__ = __webpack_require__(24);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  * @Desc:选择科室
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */









var XHRList = {
    getDepartmentList: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/tocure/register/basic/getHospitalDeptList/'
};

/* harmony default export */ __webpack_exports__["a"] = ({
    data: function data() {
        return {
            city: '北京市',
            departmentList: [],
            alert: '目前仅支持重庆唯医骨科医院',
            showPromisePopup: true,
            ensureShow: false,
            ensureParams: {
                content: "唯医骨科需获取您的授权信息，以方便您后续使用",
                ensure: "确定",
                type: "openSetting"
            }
        };
    },

    components: {
        orderRule: __WEBPACK_IMPORTED_MODULE_7__components_OrderRule__["a" /* default */],
        ensureConfirm: __WEBPACK_IMPORTED_MODULE_8_components_ensure__["a" /* default */]
    },
    onLoad: function onLoad() {
        var that = this;
        // 扫码进入判断权限
        if (wx.getStorageSync('openId')) {
            that.showPromisePopup = false;
        } else {
            that.showPromisePopup = true;
        }
        // 获取我的位置，并推荐重庆唯医骨科
        if (!that.showPromisePopup) {
            that.getLocation();
        }
    },
    onShow: function onShow() {
        __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].enterBrowse();
        this.ensureShow = false;
        this.getDepartmentList();
    },
    onHide: function onHide() {
        __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
    },

    methods: {
        /** 发送formId */
        formSubmit: function formSubmit(e) {
            Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
        },

        // 获取用户信息
        getInfo: function getInfo(e) {
            var _this = this;

            if (e.target.userInfo) {
                this.ensureShow = false;
                Object(__WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__["a" /* default */])({
                    successCallBack: function successCallBack(res) {
                        _this.showPromisePopup = false;
                        _this.getLocation();
                    },
                    failCallBack: function failCallBack(res) {}
                });
            } else {
                this.ensureShow = true;
            }
        },

        // 获取科室列表
        getDepartmentList: function getDepartmentList() {
            var that = this;
            wx.showLoading({
                title: "正在加载..."
            });
            __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
                url: XHRList.getDepartmentList,
                method: 'get',
                // data: {},
                done: function done(result) {
                    wx.hideLoading();
                    if (result && result.responseObject && result.responseObject.responseData && result.responseObject.responseData.dataList) {
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_get_iterator___default()(result.responseObject.responseData.dataList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var dept = _step.value;

                                if (__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_typeof___default()(dept.deptDesc) === 'object') {
                                    dept.deptDesc = '';
                                } else if (typeof dept.deptDesc === 'string') {
                                    // 不处理
                                } else {
                                    dept.deptDesc = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(dept.deptDesc);
                                }
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        that.departmentList = result.responseObject.responseData.dataList;
                    }
                }
            });
        },

        // 跳转到预约时间页
        goOrderTime: function goOrderTime(id, departmentCode, departmentName) {
            switch (id) {
                case 0:
                    __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].createTrack({
                        actionId: 14242
                    });
                    break;
                case 1:
                    __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].createTrack({
                        actionId: 14243
                    });
                    break;
                case 2:
                    __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].createTrack({
                        actionId: 14244
                    });
                    break;
                case 3:
                    __WEBPACK_IMPORTED_MODULE_4_common_js_dataLog_dataLog__["a" /* default */].createTrack({
                        actionId: 14245
                    });
                    break;
                default:
                    break;
            }
            var query = {
                departmentCode: departmentCode,
                departmentName: departmentName
            };
            query = encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(query));
            wx.navigateTo({
                url: '/packageD/registration/orderTime?query=' + query
            });
            // if (wx.getStorageSync('openId')) {
            //     // that.showPromisePopup = false
            //     wx.navigateTo({
            //         url: '/packageD/registration/orderTime?departmentID=' + id
            //     })
            // } else {
            //     this.showPromisePopup = true
            // }
        },

        // 获取当前位置
        getLocation: function getLocation() {
            var that = this;
            __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getLocationCity({
                name: "重庆市"
            }).then(function (data) {
                var name = data.cityName;
                // 设置提示文案
                if (data.isfail) {
                    that.alert = '未获取到您的定位，目前仅支持重庆唯医骨科医院';
                } else if (data.isCover) {
                    that.alert = '根据您的定位，为您推荐重庆唯医骨科医院';
                } else if (!data.isCover) {
                    that.alert = '\u60A8\u7684\u5B9A\u4F4D\u5728' + name + '\uFF0C\u76EE\u524D\u4EC5\u652F\u6301\u91CD\u5E86\u552F\u533B\u9AA8\u79D1\u533B\u9662';
                }
                // 判断所在城市是否改变
                if (wx.getStorageSync('locationCity')) {
                    var locationCity = wx.getStorageSync('locationCity');
                    if (locationCity !== name) {
                        that.city = name;
                        // 弹窗
                        wx.showModal({
                            title: '',
                            content: that.alert,
                            showCancel: false,
                            confirmText: '我知道啦',
                            success: function success(res) {}
                        });
                        wx.setStorageSync('locationCity', name);
                    } else {}
                } else {
                    // 弹窗
                    wx.showModal({
                        title: '',
                        content: that.alert,
                        showCancel: false,
                        confirmText: '我知道啦',
                        success: function success(res) {}
                    });
                    wx.setStorageSync('locationCity', name);
                }
            });
        },

        // 去设置权限
        goToSetting: function goToSetting(e) {
            if (e.mp.detail.authSetting.scoped.userInfo) {
                this.ensureShow = false;
                Object(__WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_miniLogin__["a" /* default */])({
                    successCallBack: function successCallBack(res) {}
                });
            } else {
                this.ensureShow = true;
            }
        }
    }
});

/***/ }),

/***/ 1018:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "department"
  }, [_c('section', {
    staticClass: "department-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "department-info"
  }, [_c('span', {
    staticClass: "department-select"
  }, [_vm._v("选择科室：")]), _vm._v(" "), _c('section', {
    staticClass: "department-list"
  }, _vm._l((_vm.departmentList), function(department, idx) {
    return _c('section', {
      key: idx,
      staticClass: "department-item",
      class: {
        'item-no-border': idx === 0
      },
      attrs: {
        "eventid": '0-' + idx
      },
      on: {
        "click": function($event) {
          _vm.goOrderTime(idx, department.deptCode, department.deptName)
        }
      }
    }, [_c('div', {
      staticClass: "department-logo"
    }, [(idx % 4 === 0) ? _c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_one.png"
      }
    }) : _vm._e(), _vm._v(" "), (idx % 4 === 1) ? _c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_two.png"
      }
    }) : _vm._e(), _vm._v(" "), (idx % 4 === 2) ? _c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_three.png"
      }
    }) : _vm._e(), _vm._v(" "), (idx % 4 === 3) ? _c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/subject_four.png"
      }
    }) : _vm._e()]), _vm._v(" "), _c('div', {
      staticClass: "department-content"
    }, [_c('h3', [_vm._v(_vm._s(department.deptName))]), _vm._v(" "), _c('span', [_vm._v(_vm._s(department.deptDesc))])], 1), _vm._v(" "), _c('div', {
      staticClass: "department-next"
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/department_go.png"
      }
    })])])
  }))], 1), _vm._v(" "), _c('section', {
    staticClass: "order-rule"
  }, [_c('div', {
    staticClass: "order-rule-btn"
  }, [_c('order-rule', {
    attrs: {
      "classType": 'e7ebee',
      "mpcomid": '0'
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/order_rule_go.png"
    }
  })])], 1)]), _vm._v(" "), (_vm.showPromisePopup) ? _c('section', {
    staticClass: "promise-popup"
  }, [_c('section', {
    staticClass: "department-promise"
  }, [_c('section', {
    staticClass: "promise-bg"
  }), _vm._v(" "), _c('section', {
    staticClass: "promise-btn"
  }, [_c('form', {
    staticClass: "promise-allow",
    attrs: {
      "report-submit": "true",
      "eventid": '2'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    attrs: {
      "open-type": "getUserInfo",
      "type": "button",
      "formType": "submit",
      "eventid": '1'
    },
    on: {
      "getuserinfo": _vm.getInfo
    }
  }, [_vm._v("授权微信用户信息")])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "promise-agreement"
  }, [_c('div', {
    staticClass: "promise-select"
  }), _vm._v(" "), _c('span', [_vm._v("我已认真阅读，理解并同意《唯医互联网骨科医院服务协议》")])])], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '3',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e()], 1) : _vm._e()], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-ef2e6bea", esExports)
  }
}

/***/ })

},[1295]);