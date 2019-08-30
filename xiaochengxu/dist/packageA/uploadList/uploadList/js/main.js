global.webpackJsonp([105],{

/***/ 683:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_uploadList_vue__ = __webpack_require__(685);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e02adf0a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_uploadList_vue__ = __webpack_require__(686);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(684)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_uploadList_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_e02adf0a_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_uploadList_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/uploadList/uploadList.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] uploadList.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e02adf0a", Component.options)
  } else {
    hotAPI.reload("data-v-e02adf0a", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 684:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 685:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_upLoadPic_upLoadPlugn__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_miniUtil_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vuex__ = __webpack_require__(4);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc： 上传检查检验
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/21.
 */









var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

var XHRList = {
  imgCreate: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/create/",
  imgDelete: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/",
  resetTime: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/case/consultation/v1/updateFrequency/",
  updateCase: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/v1/update/",
  saveImage: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/" //图片保存
};
var refreshFlag = true; //路由进来的时候判断是否是查看大图返回来的
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      leaveConfirm: false,
      leaveConfirmParams: {}, //离开confirm的参数
      pageLeaveEnsure: false, //是否离开页面
      uploadList: [], //上传列表项
      imageListLength: false, //图片列表中是否有图片
      imageList: {}, //上传成功后的图片数组
      toClick: false, //提交按钮是否可以点击
      errorShow: false,
      errorMsg: "",
      picIdIndex: 0,
      picLists: [],
      wxImgLists: [],
      loading: false, //是否正在上传
      deletePic: {},
      deletePicTip: false, //删除图片弹层,
      failImgList: {}
    };
  },


  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, mapState(['upload', 'caseId']), {
    //计算提交按钮是否可以点击
    submitFlag: function submitFlag() {
      var flag = false;
      var listFlag = false;
      var uploadingFlag = false;
      this.imageListLength = false;
      this.toClick = false;
      for (var i in this.imageList) {
        if (this.imageList[i].length !== 0) {
          listFlag = true;
          this.imageListLength = true;
          for (var j in this.imageList[i]) {
            if (this.imageList[i][j].uploading) {
              uploadingFlag = true;
              this.toClick = false;
            } else {
              uploadingFlag = false;
            }
          }
        }
      }
      //        debugger;
      if (listFlag && !uploadingFlag) {
        flag = true;
        this.toClick = true;
      }
      return flag;
    }
  }),
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    if (from.name === "showBigImg" || from.name === "upLoadTip") {
      refreshFlag = false;
    } else {
      refreshFlag = true;
    }
    next(true);
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    var that = this;
    if (to.name === "showBigImg" || to.name === "upLoadTip") {
      next(true);
      return;
    }
    if (that.imageListLength || that.toClick) {
      console.log("confirm框");
      if (that.imageListLength && that.toClick) {
        that.leaveConfirmParams = {
          ensure: "现在提交",
          cancel: "暂不提交",
          title: "要提交上传的图片么？"
        };
      } else {
        that.leaveConfirmParams = {
          ensure: "取消",
          cancel: "离开",
          title: "努力上传中",
          content: "现在离开，下次还要重新上传哦"
        };
      }
      that.leaveConfirm = true;
      next(that.pageLeaveEnsure);
      if (that.pageLeaveEnsure) {
        that.leaveConfirm = false; //离开之后confirm框隐藏
        that.imageList = {}; //离开之后上传图片对象置为空
      }
      that.pageLeaveEnsure = false;
    } else {
      console.log("没有上传图片");
      that.imageList = {}; //离开之后上传图片对象置为空
      that.leaveConfirm = false; //离开之后confirm框隐藏
      next(true);
    }
  },
  onLoad: function onLoad() {
    this.uploadList = [];
    this.getUploadList();
  },
  onUnload: function onUnload() {
    this.uploadList = [];
  },

  methods: {
    // 去上传提示
    goUploadTips: function goUploadTips() {
      wx.navigateTo({
        url: "/pages/upLoadGuide/upLoadGuide"
      });
    },
    beforeUploadFn: function beforeUploadFn(param) {
      // this.imageList[param.adviceId].push(param);
      this.imageList[param.adviceId].push(param.imgUrl);
    },
    uploadDoneFn: function uploadDoneFn(_data) {
      //是否存在上传失败图片
      if (_data.isFail) {
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].fail = true;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].finish = true;
        this.failImgList[_data.adviceId].push(_data.failParam);
      } else {
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].imgId = _data.imgId;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].fail = false;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].finish = true;
        this.failImgList[_data.adviceId].push([]);
      }
      this.$forceUpdate();
    },

    //上传失败重传事件
    upLoadReload: function upLoadReload(item, index) {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].reloadFile({
        param: _this.failImgList[item.adviceId][index],
        uploadBefor: function uploadBefor(_data) {
          _this.imageList[item.adviceId][index].uploading = true;
          _this.imageList[item.adviceId][index].fail = false;
          _this.imageList[item.adviceId][index].finish = false;
          _this.$forceUpdate();
        },
        uploadDoneFn: function uploadDoneFn(_data) {
          if (_data.fail) {
            _this.imageList[item.adviceId][index].uploading = false;
            _this.imageList[item.adviceId][index].fail = true;
            _this.imageList[item.adviceId][index].finish = true;
            _this.$forceUpdate();
          } else {
            _this.imageList[item.adviceId][index] = _data;
            _this.$forceUpdate();
          }
        }
      });
    },

    //上传列表数组初始化
    getUploadList: function getUploadList() {
      var _this2 = this;

      this.uploadList = this.upload;
      this.uploadList.forEach(function (element, index) {
        _this2.$set(_this2.imageList, element.adviceId, []);
        _this2.$set(_this2.failImgList, element.adviceId, []);
      });
      console.log(this.uploadList);
    },

    //删除图片
    imgDelete: function imgDelete(img, index, id) {
      var that = this;
      this.deletePicTip = true;
      this.deletePic.type = id;
      this.deletePic.index = index;
    },
    cancelDeletePic: function cancelDeletePic() {
      this.deletePic.type = "";
      this.deletePic.index = "";
      this.deletePicTip = false;
    },
    ensureDeletePic: function ensureDeletePic() {
      var _deletePic = this.deletePic;
      this["imageList"][_deletePic.type].splice(_deletePic.index, 1);
      this["failImgList"][_deletePic.type].splice(_deletePic.index, 1);
      this.deletePicTip = false;
    },

    //查看大图
    showBigImg: function showBigImg(item, index, type) {
      var _params = {
        imgBlob: this["imageList"][type],
        indexNum: index
      };
      this.$router.push({
        name: "showBigImg",
        params: _params
      });
    },
    backToImPage: function backToImPage() {
      var that = this;
      var _picIdList = "";
      this.leaveConfirm = false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(that.uploadList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(that.imageList[i.adviceId]), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var k = _step2.value;

              _picIdList += k.imgId + ",";
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
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

      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.saveImage,
        method: "POST",
        data: {
          caseId: this.caseId, //string	是	病例id
          idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
        },
        done: function done(data) {
          if (data && data.responseObject && data.responseObject.responseStatus) {
            that.pageLeaveEnsure = true;
            __WEBPACK_IMPORTED_MODULE_7_common_js_miniUtil_localStorage__["a" /* default */].setItem('checkSuggestTips', {
              success: 1,
              queryType: "checkSuggest"
            });
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    },

    //取消按钮
    cancelEvent: function cancelEvent() {
      var that = this;
      that.leaveConfirm = false;
      that.pageLeaveEnsure = true;
      that.$router.go(-1);
      //        this.leaveConfirm = false;
      //        this.pageLeaveEnsure = false;
      console.log("取消");
    },

    //离开函数
    ensureEvent: function ensureEvent() {
      var that = this;
      console.log("离开");
      if (!that.toClick) {
        this.leaveConfirm = false;
        this.pageLeaveEnsure = false;
      } else {
        that.backToImPage();
      }
    }
  },
  components: {
    Toast: __WEBPACK_IMPORTED_MODULE_5_components_toast__["a" /* default */],
    Loading: __WEBPACK_IMPORTED_MODULE_4_components_loading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_3_components_confirm__["a" /* default */],
    // SelectImage,
    upLoadPlugn: __WEBPACK_IMPORTED_MODULE_6_components_upLoadPic_upLoadPlugn__["a" /* default */]
  }
});

/***/ }),

/***/ 686:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "upload-wrapper"
  }, [_c('section', {
    staticClass: "tc-upLoadFile ev-delete"
  }, [_c('section', {
    staticClass: "tc-upLoadBox",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goUploadTips()
      }
    }
  }, [_c('figure', {
    staticClass: "tc-upLoadTitle uploadTips-box"
  }, [_c('span', {
    staticClass: "tc-upLoadTitleName  uploadTips-title"
  }, [_vm._v("医学影像拍摄过程")]), _vm._v(" "), _c('span', {
    staticClass: "tc-upLoadRightIcon  uploadTips-icon"
  })])], 1), _vm._v(" "), _vm._l((_vm.uploadList), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "tc-upLoadBox"
    }, [_c('figure', {
      staticClass: "tc-upLoadTitle ev-upLoadList"
    }, [_c('span', {
      staticClass: "tc-upLoadTitleName",
      attrs: {
        "data-treatmentid": item.adviceId,
        "data-advicetype": item.adviceType
      }
    }, [_vm._v(_vm._s(item.adviceName))]), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadRightIcon"
    }), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadRightCover"
    }), _vm._v(" "), (true) ? _c('upLoadPlugn', {
      attrs: {
        "propClass": 'ev-upLoadInput',
        "inputBoxClass": 'inputBoxClass',
        "adviceId": item.adviceId,
        "imageList": _vm.imageList,
        "paramObj": {
          limit: 9,
          singleNum: 9,
          maxSize: 10,
          overSingleTips: '一次最多上传9张图片',
          overSizeTips: '图片不能超过10M',
          compressRatio: 0.8
        },
        "eventid": '1-' + index,
        "mpcomid": '0-' + index
      },
      on: {
        "beforeUpload": _vm.beforeUploadFn,
        "uploadDone": _vm.uploadDoneFn
      }
    }) : _vm._e()], 1), _vm._v(" "), _c('ul', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.imageList[item.adviceId] && _vm.imageList[item.adviceId].length > 0),
        expression: "imageList[item.adviceId]&&imageList[item.adviceId].length>0"
      }],
      staticClass: "tc-upLoadItemBox docInt"
    }, [_vm._l((_vm.imageList[item.adviceId]), function(img, imgIndex) {
      return _c('li', {
        key: imgIndex,
        staticClass: "tc-upLoadItemList ev-imgList success"
      }, [_c('img', {
        attrs: {
          "alt": "",
          "src": img.blob,
          "eventid": '2-' + index + '-' + imgIndex
        },
        on: {
          "click": function($event) {
            _vm.showBigImg(img, imgIndex, item.adviceId)
          }
        }
      }), _vm._v(" "), _c('span', {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: (img.uploading == false && !img.fail),
          expression: "img.uploading==false&&!img.fail"
        }],
        staticClass: "tc-upLoadDel",
        staticStyle: {
          "cursor": "pointer"
        },
        attrs: {
          "eventid": '3-' + index + '-' + imgIndex
        },
        on: {
          "click": function($event) {
            _vm.imgDelete(img, imgIndex, item.adviceId)
          }
        }
      }), _vm._v(" "), _c('div', {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: (img.uploading),
          expression: "img.uploading"
        }]
      }, [_c('span', {
        staticClass: "tc-upLoadCover"
      }), _vm._v(" "), _c('span', {
        staticClass: "tc-upLoading"
      }), _vm._v(" "), _c('span', {
        staticClass: "tc-upLoadAfreshText"
      }, [_vm._v("等待上传")])]), _vm._v(" "), (img.fail) ? _c('figure', {
        staticClass: "upload-fail"
      }, [_c('p', [_vm._v("重新上传")]), _vm._v(" "), _c('div', {
        staticClass: "ev-upLoadInput",
        attrs: {
          "eventid": '4-' + index + '-' + imgIndex
        },
        on: {
          "click": function($event) {
            _vm.upLoadReload(item, imgIndex)
          }
        }
      })], 1) : _vm._e()], 1)
    }), _vm._v(" "), _c('li', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.imageList[item.adviceId] && _vm.imageList[item.adviceId].length > 0 && _vm.imageList[item.adviceId].length < 9),
        expression: "imageList[item.adviceId]&&imageList[item.adviceId].length>0&&imageList[item.adviceId].length<9"
      }],
      staticClass: "tc-upLoadAdd",
      staticStyle: {
        "display": "list-item"
      }
    }, [_c('span', {
      staticClass: "upLoadBtnBox"
    }, [_c('span', {
      staticClass: "tc-upLoadAddMore"
    }, [(true) ? _c('upLoadPlugn', {
      attrs: {
        "propClass": 'ev-upLoadInput',
        "inputBoxClass": 'inputBoxClass',
        "adviceId": item.adviceId,
        "paramObj": {
          limit: 9,
          singleNum: 9,
          maxSize: 10,
          overSingleTips: '一次最多上传9张图片',
          overSizeTips: '图片不能超过10M',
          compressRatio: 0.8
        },
        "eventid": '5-' + index,
        "mpcomid": '1-' + index
      },
      on: {
        "beforeUpload": _vm.beforeUploadFn,
        "uploadDone": _vm.uploadDoneFn
      }
    }) : _vm._e()], 1)])])], 2)], 1)
  }), _vm._v(" "), _c('div', {
    attrs: {
      "data-alcode-mod": "718"
    }
  }, [_c('footer', {
    staticClass: "tc-upLoadSubmit"
  }, [(_vm.submitFlag) ? _c('button', {
    staticClass: "tc-submitBtn",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.backToImPage
    }
  }, [_vm._v("提交")]) : _vm._e(), _vm._v(" "), (!_vm.submitFlag) ? _c('button', {
    staticClass: "tc-submitDisabled"
  }, [_vm._v("提交")]) : _vm._e()], 1)], 1)], 2), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '3'
    }
  }, [(_vm.errorShow) ? _c('Toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '2'
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '5'
    }
  }, [(_vm.deletePicTip) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '取消',
        'cancel': '确定',
        //          'content':'',
        'title': '确定删除图片吗？'
      },
      "showFlag": _vm.deletePicTip,
      "eventid": '7',
      "mpcomid": '4'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.deletePicTip = $event
      },
      "cancelClickEvent": function($event) {
        _vm.ensureDeletePic()
      },
      "ensureClickEvent": _vm.cancelDeletePic
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '7'
    }
  }, [(_vm.leaveConfirm) ? _c('confirm', {
    attrs: {
      "confirmParams": _vm.leaveConfirmParams,
      "showFlag": _vm.leaveConfirm,
      "eventid": '8',
      "mpcomid": '6'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.leaveConfirm = $event
      },
      "cancelClickEvent": function($event) {
        _vm.cancelEvent()
      },
      "ensureClickEvent": function($event) {
        _vm.ensureEvent()
      }
    }
  }) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-e02adf0a", esExports)
  }
}

/***/ })

},[1242]);