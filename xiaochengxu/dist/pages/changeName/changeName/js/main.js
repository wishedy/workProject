global.webpackJsonp([17],{

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_changeName_vue__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3a672e74_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_changeName_vue__ = __webpack_require__(366);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(363)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_changeName_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_3a672e74_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_changeName_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/changeName/changeName.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] changeName.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3a672e74", Component.options)
  } else {
    hotAPI.reload("data-v-3a672e74", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 363:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_uploadAvator__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      newName: '',
      ensureShow: false,
      saveFinish: false,
      ensureParams: {
        content: "",
        ensure: "我知道了"
      }
    };
  },

  components: {
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_0_components_ensure__["a" /* default */]
  },
  methods: {
    saveData: function saveData() {
      var _this = this;

      if (this.newName.length > 20) {
        this.showConfirm('昵称需输入1～20个字', '我知道了');
      } else if (this.newName.length == 0) {
        this.showConfirm('请输入需要修改的昵称', '我知道了');
      } else if (this.newName.indexOf("<") > -1 || this.newName.indexOf(">") > -1 || this.newName.indexOf("/") > -1) {
        this.showConfirm('输入内容不能含有特殊符号', '我知道了');
      } else {
        //这里就用了传头像的接口，所以并不是传avator
        Object(__WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_uploadAvator__["a" /* default */])({
          customerId: __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("userId"),
          nickName: this.newName,
          attType: 1,
          visitSiteId: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getSiteId(),
          sortId: "1"
        }).then(function (data) {
          if (data.responseObject.responseStatus) {
            _this.saveFinish = true;
            __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].setItem("nickName", _this.newName);
            _this.showConfirm('保存成功', '我知道了');
          } else {
            _this.showConfirm('保存失败...', '我知道了');
          }
        }).catch(function (err) {
          console.log(err);
          _this.showConfirm('网络错误，请稍后再试', '我知道了');
        });
      }
    },
    ensureEvent: function ensureEvent() {
      this.ensureShow = false;
      if (this.saveFinish && this.newName.length != 0) {
        wx.reLaunch({
          url: "/pages/personal/personal"
        });
      }
    },
    showConfirm: function showConfirm(content, ensure) {
      this.ensureShow = true;
      this.ensureParams = {
        content: content,
        ensure: ensure
      };
    }
  },
  onShow: function onShow() {
    this.ensureShow = false;
  },
  mounted: function mounted() {
    this.saveFinish = false;
    this.newName = this.$root.$mp.query.name;
    wx.setNavigationBarTitle({
      title: '修改昵称'
    });
  }
});

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = uploadAvator;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__ = __webpack_require__(8);


/**
 * @Desc：头像/昵称上传接口
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Yuxi(Shurrik)Yang on 2018/8/20.
 */


var XHRUrl = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/customer/unite/info/v1/createPicture/";



function uploadAvator(param) {
  var _default = {};

  var data = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
  return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
    Object(__WEBPACK_IMPORTED_MODULE_3_common_js_util_ajax__["a" /* default */])({
      url: XHRUrl,
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

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticStyle: {
      "width": "100%",
      "height": "100%",
      "overflow": "hidden"
    }
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.newName),
      expression: "newName"
    }],
    attrs: {
      "placeholder": "请填写昵称",
      "eventid": '0'
    },
    domProps: {
      "value": (_vm.newName)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.newName = $event.target.value
      }
    }
  }), _vm._v(" "), _c('img', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.newName.length > 0),
      expression: "newName.length>0"
    }],
    staticClass: "cleanUp",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/personal/delet.png",
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.newName = ''
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "tips"
  }, [_vm._v("提示")]), _vm._v(" "), _c('p', {
    staticClass: "tips"
  }, [_vm._v("· 默认使用微信昵称")]), _vm._v(" "), _c('p', {
    staticClass: "tips"
  }, [_vm._v("· 修改昵称需输入1～20个字，不包含特殊符号 ")]), _vm._v(" "), _c('button', {
    staticClass: "save",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.saveData
    }
  }, [_vm._v("保存")]), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '3',
      "mpcomid": '0'
    },
    on: {
      "ensureClickEvent": _vm.ensureEvent
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-3a672e74", esExports)
  }
}

/***/ })

},[1209]);