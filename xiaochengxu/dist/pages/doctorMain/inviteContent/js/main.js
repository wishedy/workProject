global.webpackJsonp([16],{

/***/ 483:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_inviteContent_vue__ = __webpack_require__(485);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1281d5f8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_inviteContent_vue__ = __webpack_require__(487);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(484)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_inviteContent_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_1281d5f8_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_inviteContent_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/inviteContent.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] inviteContent.vue: functional components are not supported with templates, they should use render functions.")}


/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-1281d5f8", Component.options)
  } else {
    hotAPI.reload("data-v-1281d5f8", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 484:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 485:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createInviteContent__ = __webpack_require__(486);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_vuex__ = __webpack_require__(4);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//









var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_7_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      placeholder: "请在这里描述",
      areaText: "",
      inputCount: "",
      loading: false, // loading 是否显示
      from: '',
      ableUse: true,
      doctorFullName: '', //医生名字
      doctorId: '' //医生ID
    };
  },
  mounted: function mounted() {
    this.checkLogin(); // 检查是否登录
  },
  onLoad: function onLoad(option) {
    var _this = this;
    if (option.from) {
      this.from = option.from;
      //IM医生卡牌邀请开诊，增加 option.doctorId,是为了容错 分诊IM => 医生主页 => 邀请开诊获取不到医生名字而添加；
      if (option.from == 'imScene' && option.doctorId) {
        _this.doctorFullName = option.fullName;
        _this.doctorId = option.doctorId;
        _this.setDoctorMessage({
          authMap: { fullName: option.fullName }
        });
      } else {
        _this.doctorFullName = _this.doctorMessage.authMap.fullName;
        _this.doctorId = _this.idList.doctorId;
      }
    }
    this.inputCount = '';
    this.areaText = '';
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].leaveBrowse();
  },

  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_3_components_loading__["a" /* default */]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapState(["doctorMessage", "idList", "isLogin"])),
  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setMainKey', 'setIsLogin', "setDoctorMessage"]), {
    // ...mapActions(['setIsLogin']),
    showToast: function showToast(str) {
      wx.showToast({
        title: str,
        icon: 'none',
        duration: 2000
      });
    },

    /** 检查是否登录 */
    checkLogin: function checkLogin() {
      var _this2 = this;

      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            // 已登录...前往患者列表
            _this2.setIsLogin(true);
          } else {
            // 未登录...前往添加患者
            _this2.setIsLogin(false);
          }
        }
      });
    },
    sureGoBack: function sureGoBack() {
      if (this.areaText.length > 0) {
        if (this.ableUse) {

          this.ableUse = !this.ableUse;
          this.saveInviteContent();
        } else {
          return false;
        }
      } else {
        this.showToast("请输入描述内容");
      }
    },

    //保存开诊登记
    saveInviteContent: function saveInviteContent() {
      var _this3 = this;

      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14154,
        keyword: __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_localStorage__["a" /* default */].getItem("userId") || ""
      });
      this.loading = true;
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_createInviteContent__["a" /* default */])({
        patientId: "",
        patientCustomerId: __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_localStorage__["a" /* default */].getItem("userId") || "",
        customerId: this.doctorId,
        openid: __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_localStorage__["a" /* default */].getItem("openId") || "",
        uuid: __WEBPACK_IMPORTED_MODULE_5_common_js_miniUtil_localStorage__["a" /* default */].getItem("unionId") || "",
        state: "0",
        needHelp: this.areaText,
        visitSiteId: '24',
        sourceType: this.from === "find" ? 1 : 2
      }).then(function (data) {
        _this3.ableUse = !_this3.ableUse;
        if (data.responseObject.responseStatus) {
          _this3.setMainKey(data.responseObject.responsePk);
          _this3.loading = false;
          // 保存成功...判断是否已登录
          if (_this3.isLogin) {
            console.log('登录了');
            wx.redirectTo({
              url: "/pages/doctorMain/doctorMainPatientList"
            });
          } else {
            console.log("未登录");
            wx.redirectTo({
              url: "/pages/doctorMain/doctorMainAddPatient"
            });
          }
        } else {
          _this3.showToast("提交失败");
        }
      });
    },
    inputFn: function inputFn() {
      var _this = this;
      var _countObj = __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].getStrInputCut(_this.areaText, 200, 50);
      _this.areaText = _countObj.str;
      if (_countObj.outStatus) {
        _this.inputCount = _countObj.lastCount;
      } else {
        _this.inputCount = '';
      }
    }
  })
});

/***/ }),

/***/ 486:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createInviteContent;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__ = __webpack_require__(8);


/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/6/25.
 */



var XHRList = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/invite/clinic/create/";

function createInviteContent(param) {
  var defaultData = {};
  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(defaultData, param);
  console.log("====================");
  console.log(data);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__["a" /* default */])({
      url: XHRList,
      method: "POST",
      data: data,
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

/***/ 487:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "illnessAddMain"
  }, [_c('article', {
    staticClass: "invite-title"
  }, [_c('h2', [_vm._v("想要" + _vm._s(_vm.doctorFullName) + "医生提供的帮助是？")]), _vm._v(" "), _c('p', [_vm._v("简单描述您的病情，并说明想要得到的帮助；如发病诱因，症状，患病时长，治疗情况等。")])], 1), _vm._v(" "), _c('section', {
    staticClass: "illnessBox"
  }, [_c('textarea', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.areaText),
      expression: "areaText",
      modifiers: {
        "trim": true
      }
    }],
    staticClass: "illnessAddArea",
    attrs: {
      "placeholder": _vm.placeholder,
      "maxlength": "-1",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.areaText)
    },
    on: {
      "input": [function($event) {
        if ($event.target.composing) { return; }
        _vm.areaText = $event.target.value.trim()
      }, function($event) {
        _vm.inputFn()
      }],
      "blur": function($event) {
        _vm.$forceUpdate()
      }
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "inputCount"
  }, [_vm._v(_vm._s(_vm.inputCount))])]), _vm._v(" "), _c('section', {
    staticClass: "illnessAddBtnBox"
  }, [_c('button', {
    staticClass: "illnessAddBtnSure",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.sureGoBack
    }
  }, [_vm._v("下一步")])], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-1281d5f8", esExports)
  }
}

/***/ })

},[1226]);