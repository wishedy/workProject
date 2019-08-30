global.webpackJsonp([88],{

/***/ 1001:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderSuccess_vue__ = __webpack_require__(1003);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_268130cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderSuccess_vue__ = __webpack_require__(1007);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1002)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-268130cc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_orderSuccess_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_268130cc_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_orderSuccess_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/registration/orderSuccess.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] orderSuccess.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-268130cc", Component.options)
  } else {
    hotAPI.reload("data-v-268130cc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1002:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1003:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_share__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_dataLog__ = __webpack_require__(7);
//
//
//
//
//
//
//
//
//
//
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
 * @Desc:预约成功
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by zh on  2019/5/27
 *
 */





/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      id: 0,
      patientName: '',
      patientId: '',
      visitState: 1,
      clinicDuration: '',
      registDate: '',
      deptName: '',
      doctorName: '',
      doctorTitle: '',
      amount: 0,
      certificateCode: ''
    };
  },

  components: {
    Share: __WEBPACK_IMPORTED_MODULE_1_components_share__["a" /* default */]
  },
  onLoad: function onLoad(option) {

    wx.showLoading({
      title: "正在加载..."
    });
    this.id = option.registId;
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
      url: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/tocure/register/basic/getAppointmentDetail/',
      method: "POST",
      data: {
        id: this.id
      },
      done: function done(response) {
        wx.hideLoading();
        if (response && response.responseObject && response.responseObject.responseData) {
          _this.patientName = response.responseObject.responseData.patientName;
          _this.visitState = response.responseObject.responseData.visitState;
          _this.clinicDuration = response.responseObject.responseData.clinicDuration;
          _this.registDate = response.responseObject.responseData.registDate;
          _this.deptName = response.responseObject.responseData.deptName;
          _this.doctorName = response.responseObject.responseData.doctorName;
          _this.doctorTitle = response.responseObject.responseData.doctorTitle;
          _this.amount = response.responseObject.responseData.amount;
          _this.patientId = response.responseObject.responseData.patientId;
          _this.certificateCode = response.responseObject.responseData.certificateCode;
          __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].enterBrowse({
            keyword: _this.patientId
          });
        }
      }
    });
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].leaveBrowse();
  },

  methods: {
    savepic: function savepic() {
      __WEBPACK_IMPORTED_MODULE_3_dataLog__["a" /* default */].createTrack({
        actionId: 14259
      });
      var params = {
        width: 702,
        height: 922,
        backgroundUrl: 'https://m.allinmed.cn/static/image/mp/index/1.5.0/sharebg.png',
        texts: [{
          x: 478,
          y: 146,
          text: '预约成功',
          fontSize: 48,
          color: '#272727'
        }, {
          x: 96,
          y: 260,
          text: '姓名',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 260,
          text: this.patientName,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 370,
          text: '身份证号',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 370,
          text: this.certificateCode,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 470,
          text: '就诊科室',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 470,
          text: this.deptName,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 570,
          text: '就诊时间',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 570,
          text: this.registDate + ' ' + this.clinicDuration,
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 150,
          y: 680,
          text: '医院地址',
          fontSize: 30,
          color: '#888'
        }, {
          x: 670,
          y: 680,
          text: '重庆市百灵路1号金易E世界4栋',
          textAlign: 'right',
          fontSize: 30,
          color: '#222'
        }, {
          x: 650,
          y: 790,
          text: '请您在就诊当日凭本人有效身份证件到一层服',
          fontSize: 30,
          color: '#888'
        }, {
          x: 200,
          y: 830,
          text: '务台取号。',
          fontSize: 30,
          color: '#888'
        }],
        leftButton: {
          type: "close",
          text: "关闭",
          flag: true,
          actionId: 14261
        },
        rightButton: {
          type: "save",
          text: "确认保存",
          flag: true,
          actionId: 14260
        }
      };
      this.$refs.share.create(params);
    }
  }
});

/***/ }),

/***/ 1007:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "order-success-main"
  }, [_c('Share', {
    ref: "share",
    attrs: {
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "success": _vm.onCreateSuccess
    }
  }), _vm._v(" "), _c('article', {
    staticClass: "content"
  }, [_c('div', [_c('span', {
    staticClass: "label"
  }, [_vm._v("患者姓名")]), _vm._v(" "), _c('span', {
    staticClass: "info"
  }, [_vm._v(_vm._s(_vm.patientName))])]), _vm._v(" "), _c('div', [_c('span', {
    staticClass: "label"
  }, [_vm._v("就诊状态")]), _vm._v(" "), _c('span', {
    staticClass: "info"
  }, [_vm._v(_vm._s(_vm.visitState == 1 ? '待就诊' : '已就诊'))])]), _vm._v(" "), _c('div', [_c('span', {
    staticClass: "label"
  }, [_vm._v("就诊时间")]), _vm._v(" "), _c('span', {
    staticClass: "info"
  }, [_vm._v(_vm._s(_vm.registDate) + " " + _vm._s(_vm.clinicDuration))])]), _vm._v(" "), _c('div', [_c('span', {
    staticClass: "label"
  }, [_vm._v("科室")]), _vm._v(" "), _c('span', {
    staticClass: "info"
  }, [_vm._v(_vm._s(_vm.deptName))])]), _vm._v(" "), _c('div', [_c('span', {
    staticClass: "label"
  }, [_vm._v("医生")]), _vm._v(" "), _c('span', {
    staticClass: "info"
  }, [_vm._v(_vm._s(_vm.doctorName) + " " + _vm._s(_vm.doctorTitle))])])]), _vm._v(" "), _c('section', {
    staticClass: "submit"
  }, [_c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '1'
    },
    on: {
      "click": _vm.savepic
    }
  }, [_c('button', [_vm._v("保存本页为图片")])], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-268130cc", esExports)
  }
}

/***/ })

},[1293]);