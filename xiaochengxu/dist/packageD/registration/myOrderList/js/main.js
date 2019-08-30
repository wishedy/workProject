global.webpackJsonp([94],{

/***/ 1008:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_myOrderList_vue__ = __webpack_require__(1010);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4544c70b_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_myOrderList_vue__ = __webpack_require__(1011);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1009)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4544c70b"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_myOrderList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4544c70b_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_myOrderList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/myOrderList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] myOrderList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4544c70b", Component.options)
  } else {
    hotAPI.reload("data-v-4544c70b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1009:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1010:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_backIndex__ = __webpack_require__(27);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc:我的预约列表
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by zh on  2019/5/27
 *
 */



 // 返回首页组件
var orderList = {
  getOrderList: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/tocure/register/basic/getMyAppointmentList/'
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      typeSelect: ['全部', '待就诊', '已就诊'],
      currentSelect: '全部',
      isShowSelect: false,
      visitState: 10,
      firstResult: 0,
      maxResult: 20,
      noMoreShow: false,
      orderList: [],
      patientCustomerId: '',
      backIndexShow: false
    };
  },

  components: {
    BackIndex: __WEBPACK_IMPORTED_MODULE_3_components_backIndex__["a" /* default */]
  },
  onReachBottom: function onReachBottom() {
    //分页加载
    // if (!this.noMoreShow&&this.orderList.length) {
    //   this.firstResult += this.maxResult;
    //   this.getOrderList();
    // }
  },

  methods: {
    //获取挂号列表
    getOrderList: function getOrderList() {
      var _this = this;
      wx.showLoading({
        title: "正在加载..."
      });
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: orderList.getOrderList,
        method: "post",
        data: {
          patientCustomerId: _this.patientCustomerId,
          visitState: _this.visitState,
          firstResult: _this.firstResult,
          maxResult: _this.maxResult
        },
        done: function done(response) {
          wx.hideLoading();
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList && response.responseObject.responseData.dataList.length > 0) {
            var dataList = response.responseObject.responseData.dataList;
            _this.orderList = _this.orderList.concat(dataList);
            if (dataList.length < _this.maxResult) {
              _this.noMoreShow = true;
            }
          } else {
            _this.noMoreShow = true;
          }
        }
      });
    },

    //跳转预约须知
    goOrderRule: function goOrderRule() {
      wx.navigateTo({
        url: '/packageD/registration/orderRule'
      });
    },

    //跳转到预约详情
    gotoDetail: function gotoDetail(id) {
      __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].createTrack({
        actionId: 14258
      });
      wx.navigateTo({
        url: '/packageD/registration/orderSuccess?registId=' + id
      });
    },

    //显示下拉选项
    selectHandle: function selectHandle() {
      this.isShowSelect = !this.isShowSelect;
    },

    //下拉选项点击
    itemHandle: function itemHandle(item, index) {
      this.isShowSelect = false;
      this.currentSelect = item;
      var actionId = '';
      switch (index) {
        case 0:
          actionId = 14255;
          this.visitState = 10;
          break;
        case 1:
          actionId = 14256;
          this.visitState = 1;
          break;
        case 2:
          actionId = 14257;
          this.visitState = 2;
          break;
      }
      __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].createTrack({
        actionId: actionId
      });
      this.firstResult = 0;
      this.orderList = [];
      this.noMoreShow = false;
      // wx.pageScrollTo({
      //   scrollTop: 0,
      //   duration: 0
      // });
      this.getOrderList();
    },

    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].leaveBrowse();
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_0_common_js_dataLog_dataLog__["a" /* default */].enterBrowse();
    this.isShowSelect = false;
    var pages = getCurrentPages(); //页面栈
    if (pages.length == 1) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
  },
  onLoad: function onLoad(option) {
    var userId = wx.getStorageSync('userId');
    if (!userId) {
      this.patientCustomerId = option.customerId;
    } else {
      this.patientCustomerId = userId;
    }
    this.currentSelect = '全部';
    this.firstResult = 0;
    this.visitState = 10;
    this.orderList = [];
    this.noMoreShow = false;
    this.getOrderList();
  }
});

/***/ }),

/***/ 1011:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "order-list-main",
    class: {
      'order-list-tip': !_vm.orderList.length
    }
  }, [_c('section', {
    staticClass: "order-top"
  }, [_c('figure', {
    staticClass: "select-out"
  }, [_c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "select-text",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '0'
    },
    on: {
      "click": _vm.selectHandle
    }
  }, [_c('span', [_vm._v(_vm._s(_vm.currentSelect))]), _vm._v(" "), _c('i', {
    staticClass: "select-down",
    class: {
      'active': _vm.isShowSelect
    }
  })], 1)], 1), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.isShowSelect),
      expression: "isShowSelect"
    }],
    staticClass: "select-container"
  }, _vm._l((_vm.typeSelect), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "select-item",
      class: {
        'active': item === _vm.currentSelect
      },
      attrs: {
        "eventid": '3-' + index
      },
      on: {
        "click": function($event) {
          _vm.itemHandle(item, index)
        }
      }
    }, [_c('form', {
      attrs: {
        "report-submit": "true",
        "eventid": '2-' + index
      },
      on: {
        "submit": _vm.formSubmit
      }
    }, [_c('button', {
      attrs: {
        "type": "submit",
        "formType": "submit"
      }
    }, [_vm._v(_vm._s(item))])], 1)], 1)
  }))], 1), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '5'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "rule-btn",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '4'
    },
    on: {
      "click": _vm.goOrderRule
    }
  }, [_c('img', {
    staticClass: "order-img",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/order_rule.png"
    }
  }), _vm._v("预约须知")])], 1)], 1), _vm._v(" "), (_vm.orderList.length) ? _c('article', {
    staticClass: "order-list"
  }, _vm._l((_vm.orderList), function(item, index) {
    return _c('figure', {
      key: index,
      staticClass: "order-list-item",
      attrs: {
        "eventid": '6-' + index
      },
      on: {
        "click": function($event) {
          _vm.gotoDetail(item.id)
        }
      }
    }, [_c('p', {
      staticClass: "list-item-top"
    }, [_c('span', {
      staticClass: "item-name"
    }, [_vm._v(_vm._s(item.patientName))]), _vm._v(" "), _c('span', {
      staticClass: "item-state",
      class: {
        'active': item.visitState == 2
      }
    }, [_vm._v(_vm._s(item.visitState == 2 ? '已就诊' : (item.visitState == 1 ? '待就诊' : '')))])]), _vm._v(" "), _c('section', {
      staticClass: "item-content-con"
    }, [_c('p', {
      staticClass: "list-item-content"
    }, [_c('span', {
      staticClass: "content-title"
    }, [_vm._v("就诊时间：")]), _vm._v(" "), _c('span', {
      staticClass: "content-text"
    }, [_vm._v(_vm._s(item.registDate + ' ' + item.clinicDuration))])]), _vm._v(" "), _c('p', {
      staticClass: "list-item-content"
    }, [_c('span', {
      staticClass: "content-title"
    }, [_vm._v("科室：")]), _vm._v(" "), _c('span', {
      staticClass: "content-text"
    }, [_vm._v(_vm._s(item.deptName))])]), _vm._v(" "), _c('p', {
      staticClass: "list-item-content"
    }, [_c('span', {
      staticClass: "content-title"
    }, [_vm._v("医生：")]), _vm._v(" "), _c('span', {
      staticClass: "content-text"
    }, [_vm._v(_vm._s(item.doctorName + ' ' + item.doctorTitle))])])], 1)], 1)
  })) : _vm._e(), _vm._v(" "), (!_vm.orderList.length) ? _c('section', {
    staticClass: "no-order-list"
  }, [_c('figure', {
    staticClass: "no-tip-con"
  }, [_c('img', {
    staticClass: "tip-img",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.5.0/no-order.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "tip-text"
  }, [_vm._v("暂无预约挂号")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.backIndexShow) ? _c('back-index', {
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4544c70b", esExports)
  }
}

/***/ })

},[1294]);