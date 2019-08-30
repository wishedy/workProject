global.webpackJsonp([58],{

/***/ 973:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportUploadImg_vue__ = __webpack_require__(975);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ae73c1a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportUploadImg_vue__ = __webpack_require__(976);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(974)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_reportUploadImg_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_2ae73c1a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_reportUploadImg_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/reportNew/reportUploadImg.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] reportUploadImg.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-2ae73c1a", Component.options)
  } else {
    hotAPI.reload("data-v-2ae73c1a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 974:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 975:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_upLoadPic_upLoadPlugn__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_LogoLoading__ = __webpack_require__(14);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * DESC: 报到补充上传图片
 */






var XHR = {
  reportSubmitUrl: __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/patient/report/content/v2/supplementReport/"
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      loading: false,
      reportId: "",
      reportType: "4",
      showUploadImg: false,
      questionList: [{
        id: "0",
        name: "检查资料"
      }, {
        id: "1",
        name: "床头卡/腕带"
      }, {
        id: "2",
        name: "处方单/药盒"
      }],
      imgUrl0: [], // 图片列表
      imgUrl1: [], // 图片列表
      imgUrl2: [], // 图片列表
      failImgList: [[], [], []], // 重传列表
      imgActive: false, // 提交按钮
      reloadBtnShow: false, //图片重传监控 显示btn
      reloadIndex: "" //图片重传监控  索引
    };
  },
  onLoad: function onLoad(option) {
    this.showUploadImg = true;
    if (option.reportId) {
      this.reportId = option.reportId;
    }
  },
  onUnload: function onUnload() {
    this.showUploadImg = false;
  },
  onShow: function onShow() {
    if (__WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_localStorage__["a" /* default */].getItem("reportUploadImg")) {
      this.imgUrl0 = []; // 图片列表
      this.imgUrl1 = []; // 图片列表
      this.imgUrl2 = []; // 图片列表
      this.failImgList = [[], [], []]; // 重传列表
      this.loading = false;
      // this.reportId="";
      this.imgActive = false; // 提交按钮
      this.reloadBtnShow = false; //  图片重传监控 显示btn
      this.reloadIndex = ""; //  图片重传监控  索引
      __WEBPACK_IMPORTED_MODULE_2_common_js_miniUtil_localStorage__["a" /* default */].removeItem('reportUploadImg');
    }
  },
  onHide: function onHide() {},
  mounted: function mounted() {},

  components: {
    uploadPlugn: __WEBPACK_IMPORTED_MODULE_3_components_upLoadPic_upLoadPlugn__["a" /* default */],
    logoLoading: __WEBPACK_IMPORTED_MODULE_4_components_LogoLoading__["a" /* default */]
  },
  watch: {
    imgUrl: {
      handler: function handler() {
        var _this2 = this;

        this.imgUrl.forEach(function (item) {
          if (item.length > 0) {
            _this2.imgActive = true;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    init: function init() {},

    // 图片上传前
    beforeUploadFn0: function beforeUploadFn0(data) {
      var _this = this;
      _this.imgUrl0 = data.imgUrl;
      _this.failImgList[0].push(data.failParam);
    },
    beforeUploadFn1: function beforeUploadFn1(data) {
      var _this = this;
      _this.imgUrl1 = data.imgUrl;
      _this.failImgList[1].push(data.failParam);
    },
    beforeUploadFn2: function beforeUploadFn2(data) {
      var _this = this;
      _this.imgUrl2 = data.imgUrl;
      _this.failImgList[2].push(data.failParam);
    },

    // 图片上传完成
    uploadDoneFn: function uploadDoneFn(_data) {},

    // 图片重传
    upLoadReload: function upLoadReload(index, k) {
      var _this = this;
      if (!_this.reload) {
        _this.reload = true; //禁止重传
        __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].reloadFile({
          param: _this.failImgList[k][index],
          uploadBefor: function uploadBefor(_data) {
            _this["imgUrl" + k][index].uploading = true;
            _this["imgUrl" + k][index].fail = false;
            _this["imgUrl" + k][index].finish = false;
          },
          uploadDoneFn: function uploadDoneFn(_data) {
            _this.reload = false; //允许重传
            if (_data.fail) {
              _this["imgUrl" + k][index].uploading = false;
              _this["imgUrl" + k][index].fail = true;
              _this["imgUrl" + k][index].finish = true;
              _this.$forceUpdate();
            } else {
              _this["imgUrl" + k][index].imgId = _data.imgId;
              _this["imgUrl" + k][index].uploading = false;
              _this["imgUrl" + k][index].fail = false;
              _this["imgUrl" + k][index].finish = true;
            }
          }
        });
      } else {
        //禁止重传
      }
    },

    // 查看大图
    showBigImg: function showBigImg(index, k) {
      var _imgArr = [];
      this["imgUrl" + k].forEach(function (item, index) {
        _imgArr.push(item.blob);
      });
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].showBigImg({
        index: index ? index : 0,
        imgArr: _imgArr
      });
    },

    // 查看全部
    viewAllPicture: function viewAllPicture(k) {
      var _this = this;
      var _imgArr = [];
      this["imgUrl" + k].forEach(function (item, index) {
        _imgArr.push(item.blob);
      });
      __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].showBigImg({
        index: 0,
        imgArr: _imgArr
      });
    },

    // 图片删除 model
    imgDelToast: function imgDelToast(index, k) {
      var _this = this;
      wx.showModal({
        // title: '确定删除图片吗？',
        content: "确定删除图片吗？",
        cancelText: "确定",
        cancelColor: "#00beaf",
        confirmText: "取消",
        confirmColor: "#00beaf",
        success: function success(res) {
          if (res.confirm) {} else if (res.cancel) {
            _this.imgDelFn(index, k);
          }
        }
      });
    },

    //删除图片
    imgDelFn: function imgDelFn(index, k) {
      var _this = this;
      _this["imgUrl" + k].splice(index, 1);
    },

    //上传指导页面
    viewGuide: function viewGuide() {
      wx.navigateTo({
        url: "/pages/upLoadGuide/upLoadGuide"
      });
    },

    // 图片idlist
    imgIdList: function imgIdList(param) {
      var _this = this;
      var _keys = "";
      var _fail = false;
      _this["imgUrl" + param].forEach(function (item, index) {
        //ID存储
        if (!item.fail) {
          if (_keys != "") {
            _keys = _keys + "," + item.imgId;
          } else {
            _keys = item.imgId;
          }
        } else {
          _fail = true;
        }
      });
      return { keys: _keys, fail: _fail };
    },

    // 数据提交
    submitReport: function submitReport() {
      var _this = this;
      if (_this.imgUrl0.length == 0 && _this.imgUrl1.length == 0 && _this.imgUrl2.length == 0) {
        return false;
      }
      if (_this.imgIdList(0).fail || _this.imgIdList(1).fail || _this.imgIdList(2).fail) {
        return false;
      }
      _this.loading = true;
      _this.submit({
        reportId: _this.reportId, //string是
        reportType: _this.reportType, //string 是报道类型：4-门诊患者(1.2新流程)，5-住院患者(1.2新流程)
        checkAttIdList: _this.imgIdList(0).keys, //string 图片id list
        bedAttIdList: _this.imgIdList(1).keys, //string 是 床头卡id list
        drugAttIdList: _this.imgIdList(2).keys // string 是药方id list
      }).then(function (res) {
        _this.loading = false;
        if (res && res.responseObject && res.responseObject.responseMessage && res.responseObject.responseMessage == "success") {
          wx.setStorageSync('isUploadImg', true);
          wx.navigateBack({
            delta: 1
          });
        }
      }).catch(function (err) {
        console, log(err);
        _this.loading = false;
      });
    },
    submit: function submit(param) {
      var _this = this;
      return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        __WEBPACK_IMPORTED_MODULE_1_common_js_util_util__["a" /* default */].ajax({
          url: XHR.reportSubmitUrl,
          method: "POST",
          data: param,
          done: function done(data) {
            resolve(data);
          },
          fail: function fail(err) {
            reject(err);
          }
        });
      });
    }
  }
});

/***/ }),

/***/ 976:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-content"
  }, [_c('section', {
    staticClass: "uploadBox"
  }, [_c('figure', {
    staticClass: "uploadTitleBox"
  }, [_c('section', {
    staticClass: "title-left"
  }, [_vm._v("\n        " + _vm._s(_vm.questionList[0].name) + "\n        "), _c('span', {
    staticClass: "select-tip"
  }, [_vm._v("(选填)")])]), _vm._v(" "), _c('section', {
    staticClass: "title-right",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": _vm.viewGuide
    }
  }, [_c('span', {
    staticClass: "tip-icon"
  }), _vm._v(" 如何拍摄\n      ")])], 1), _vm._v(" "), _c('section', {
    staticClass: "upload-content"
  }, [_vm._l((_vm.imgUrl0), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "upLoadItem"
    }, [_c('img', {
      staticClass: "imgItem",
      attrs: {
        "src": item.blob,
        "mode": "aspectFill",
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(index, 0)
        }
      }
    }), _vm._v(" "), (!item.fail) ? _c('span', {
      staticClass: "imgItem-delBtn",
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelToast(index, 0)
        }
      }
    }) : _vm._e(), _vm._v(" "), (item.uploading) ? _c('span', {
      staticClass: "imgItem-cover"
    }, [_c('span', {
      staticClass: "imgItem-loading"
    })]) : _vm._e(), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "imgItem-fail",
      attrs: {
        "eventid": '3-' + index
      },
      on: {
        "click": function($event) {
          _vm.upLoadReload(index, 0)
        }
      }
    }, [_c('p', {
      staticClass: "imgItem-failText"
    }, [_vm._v("上传失败")]), _vm._v(" "), _c('p', {
      staticClass: "imgItem-reloadText"
    }, [_vm._v("点击重试")])], 1) : _vm._e()], 1)
  }), _vm._v(" "), (_vm.showUploadImg) ? _c('uploadPlugn', {
    attrs: {
      "isFailToast": true,
      "imgList": _vm.imgUrl0,
      "order": true,
      "propClass": 'upLoadItem',
      "paramObj": {
        limit: 12,
        singleNum: 9,
        maxSize: 10,
        overSingleTips: '一次最多上传9张图片',
        overSizeTips: '图片不能超过10M',
        compressRatio: 0.8
      },
      "eventid": '4',
      "mpcomid": '0'
    },
    on: {
      "beforeUpload": _vm.beforeUploadFn0,
      "uploadDone": _vm.uploadDoneFn
    }
  }) : _vm._e()], 2), _vm._v(" "), (_vm.imgUrl0.length) ? _c('section', {
    staticClass: "upload-number"
  }, [_vm._v("\n      已上传" + _vm._s(_vm.imgUrl0.length) + "张，\n      "), _c('span', {
    staticClass: "upload-viewAll",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.showBigImg('', 0)
      }
    }
  }, [_vm._v("查看全部")])]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "uploadBox"
  }, [_c('figure', {
    staticClass: "uploadTitleBox"
  }, [_c('section', {
    staticClass: "title-left"
  }, [_vm._v("\n        " + _vm._s(_vm.questionList[1].name) + "\n        "), _c('span', {
    staticClass: "select-tip"
  }, [_vm._v("(选填)")])])], 1), _vm._v(" "), _c('section', {
    staticClass: "upload-content"
  }, [_vm._l((_vm.imgUrl1), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "upLoadItem"
    }, [_c('img', {
      staticClass: "imgItem",
      attrs: {
        "src": item.blob,
        "mode": "aspectFill",
        "eventid": '6-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(index, 1)
        }
      }
    }), _vm._v(" "), (!item.fail) ? _c('span', {
      staticClass: "imgItem-delBtn",
      attrs: {
        "eventid": '7-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelToast(index, 1)
        }
      }
    }) : _vm._e(), _vm._v(" "), (item.uploading) ? _c('span', {
      staticClass: "imgItem-cover"
    }, [_c('span', {
      staticClass: "imgItem-loading"
    })]) : _vm._e(), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "imgItem-fail",
      attrs: {
        "eventid": '8-' + index
      },
      on: {
        "click": function($event) {
          _vm.upLoadReload(index, 1)
        }
      }
    }, [_c('p', {
      staticClass: "imgItem-failText"
    }, [_vm._v("上传失败")]), _vm._v(" "), _c('p', {
      staticClass: "imgItem-reloadText"
    }, [_vm._v("点击重试")])], 1) : _vm._e()], 1)
  }), _vm._v(" "), (_vm.showUploadImg) ? _c('uploadPlugn', {
    attrs: {
      "isFailToast": true,
      "propClass": 'upLoadItem',
      "imgList": _vm.imgUrl1,
      "order": true,
      "paramObj": {
        limit: 12,
        singleNum: 9,
        maxSize: 10,
        overSingleTips: '一次最多上传9张图片',
        overSizeTips: '图片不能超过10M',
        compressRatio: 0.8
      },
      "eventid": '9',
      "mpcomid": '1'
    },
    on: {
      "beforeUpload": _vm.beforeUploadFn1,
      "uploadDone": _vm.uploadDoneFn
    }
  }) : _vm._e()], 2), _vm._v(" "), (_vm.imgUrl1.length) ? _c('section', {
    staticClass: "upload-number"
  }, [_vm._v("\n      已上传" + _vm._s(_vm.imgUrl1.length) + "张，\n      "), _c('span', {
    staticClass: "upload-viewAll",
    attrs: {
      "eventid": '10'
    },
    on: {
      "click": function($event) {
        _vm.showBigImg('', 1)
      }
    }
  }, [_vm._v("查看全部")])]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "uploadBox"
  }, [_c('figure', {
    staticClass: "uploadTitleBox"
  }, [_c('section', {
    staticClass: "title-left"
  }, [_vm._v("\n        " + _vm._s(_vm.questionList[2].name) + "\n        "), _c('span', {
    staticClass: "select-tip"
  }, [_vm._v("(选填)")])])], 1), _vm._v(" "), _c('section', {
    staticClass: "upload-content"
  }, [_vm._l((_vm.imgUrl2), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "upLoadItem"
    }, [_c('img', {
      staticClass: "imgItem",
      attrs: {
        "src": item.blob,
        "mode": "aspectFill",
        "eventid": '11-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(index, 2)
        }
      }
    }), _vm._v(" "), (!item.fail) ? _c('span', {
      staticClass: "imgItem-delBtn",
      attrs: {
        "eventid": '12-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelToast(index, 2)
        }
      }
    }) : _vm._e(), _vm._v(" "), (item.uploading) ? _c('span', {
      staticClass: "imgItem-cover"
    }, [_c('span', {
      staticClass: "imgItem-loading"
    })]) : _vm._e(), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "imgItem-fail",
      attrs: {
        "eventid": '13-' + index
      },
      on: {
        "click": function($event) {
          _vm.upLoadReload(index, 2)
        }
      }
    }, [_c('p', {
      staticClass: "imgItem-failText"
    }, [_vm._v("上传失败")]), _vm._v(" "), _c('p', {
      staticClass: "imgItem-reloadText"
    }, [_vm._v("点击重试")])], 1) : _vm._e()], 1)
  }), _vm._v(" "), (_vm.showUploadImg) ? _c('uploadPlugn', {
    attrs: {
      "isFailToast": true,
      "propClass": 'upLoadItem',
      "imgList": _vm.imgUrl2,
      "order": true,
      "paramObj": {
        limit: 12,
        singleNum: 9,
        maxSize: 10,
        overSingleTips: '一次最多上传9张图片',
        overSizeTips: '图片不能超过10M',
        compressRatio: 0.8
      },
      "eventid": '14',
      "mpcomid": '2'
    },
    on: {
      "beforeUpload": _vm.beforeUploadFn2,
      "uploadDone": _vm.uploadDoneFn
    }
  }) : _vm._e()], 2), _vm._v(" "), (_vm.imgUrl2.length) ? _c('section', {
    staticClass: "upload-number"
  }, [_vm._v("\n      已上传" + _vm._s(_vm.imgUrl2.length) + "张，\n      "), _c('span', {
    staticClass: "upload-viewAll",
    attrs: {
      "eventid": '15'
    },
    on: {
      "click": function($event) {
        _vm.showBigImg('', 2)
      }
    }
  }, [_vm._v("查看全部")])]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    staticClass: "upload-submitBtn",
    class: {
      'actived': _vm.imgUrl0.length > 0 || _vm.imgUrl1.length > 0 || _vm.imgUrl2.length > 0
    },
    attrs: {
      "eventid": '16'
    },
    on: {
      "click": _vm.submitReport
    }
  }, [_vm._v("提交")]), _vm._v(" "), (_vm.loading) ? _c('logo-loading', {
    attrs: {
      "mpcomid": '3'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-2ae73c1a", esExports)
  }
}

/***/ })

},[1288]);