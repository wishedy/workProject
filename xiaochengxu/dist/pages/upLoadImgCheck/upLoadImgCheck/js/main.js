global.webpackJsonp([22],{

/***/ 514:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadImgCheck_vue__ = __webpack_require__(516);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_23ba1414_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadImgCheck_vue__ = __webpack_require__(557);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(515)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_upLoadImgCheck_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_23ba1414_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_upLoadImgCheck_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/upLoadImgCheck/upLoadImgCheck.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] upLoadImgCheck.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-23ba1414", Component.options)
  } else {
    hotAPI.reload("data-v-23ba1414", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 515:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 516:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_keys__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_keys___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_keys__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_nimEnv_nimEnv__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_upLoadPic_upLoadPlugn__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getNimToken__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_imBaseMethods_imBusinessMethods__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_updateMedicalReport__ = __webpack_require__(173);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_updateConsultationState__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_common_js_nimEnv_NIM_Web_NIM_v5_3_0__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_common_js_nimEnv_NIM_Web_NIM_v5_3_0__);




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc： 咨询历史 补全检查资料
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by qiangkailiang on 2017/8/21.
 */














var XHRList = {
  imgDelete: __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/" //历史图片删除
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      params: {}, // 路由传过来的参数
      uploadList: [],
      imageList: {},
      failImgList: {},
      loading: false,
      errorMsg: "",
      errorShow: false,
      deletePic: {},
      deletePicTip: false,
      userData: {
        account: "",
        token: ""
      }
    };
  },
  onLoad: function onLoad(options) {
    this.params = options;
  },
  onUnload: function onUnload() {
    this.uploadList = [];
  },
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].enterBrowse();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].leaveBrowse();
  },
  mounted: function mounted() {
    this.getUploadList();
  },

  methods: {
    //去上传清晰图片教程页面
    goUploadTips: function goUploadTips() {
      wx.navigateTo({
        url: '/pages/upLoadGuide/upLoadGuide'
      });
    },
    getUploadList: function getUploadList() {
      var _this2 = this;

      if (wx.getStorageSync("checkInspectLists")) {
        this.uploadList = JSON.parse(wx.getStorageSync("checkInspectLists"));
        this.uploadList.forEach(function (element) {
          _this2.$set(_this2.imageList, element.adviceId, []);
          _this2.$set(_this2.failImgList, element.adviceId, []);
        });
      }
    },
    beforeUploadFn: function beforeUploadFn(param) {
      this.imageList[param.adviceId].push(param.imgUrl);
      this.failImgList[param.adviceId].push(param.failParam);
    },
    uploadDoneFn: function uploadDoneFn(_data) {
      //是否存在上传失败图片
      if (_data.isFail) {
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].fail = true;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].finish = true;
      } else {
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].imgId = _data.imgId;
        this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
      }
      this.$forceUpdate();
    },

    //上传失败重传事件
    upLoadReload: function upLoadReload(item, index) {
      var _this = this;
      __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].reloadFile({
        param: _this.failImgList[item.adviceId][index],
        uploadBefor: function uploadBefor(_data) {
          _this.imageList[item.adviceId][index].uploading = true;
          _this.imageList[item.adviceId][index].fail = false;
          _this.imageList[item.adviceId][index].finish = false;
        },
        uploadDoneFn: function uploadDoneFn(_data) {
          if (_data.fail) {
            _this.imageList[item.adviceId][index].uploading = true;
            _this.imageList[item.adviceId][index].fail = false;
            _this.imageList[item.adviceId][index].finish = false;
            _this.$forceUpdate();
          } else {
            _this.imageList[item.adviceId][index].imgId = _data.imgId;
            _this.imageList[item.adviceId][index].uploading = false;
            _this.imageList[item.adviceId][index].fail = false;
            _this.imageList[item.adviceId][index].finish = true;
            _this.$forceUpdate();
          }
        }
      });
    },

    //查看大图
    showBigImg: function showBigImg(item, type) {
      var bigImgLists = [];
      this.imageList[type].forEach(function (element) {
        bigImgLists.push(element.blob);
      });
      wx.previewImage({
        current: item.blob,
        urls: bigImgLists
      });
    },

    //删除图片 走接口
    imgDelete: function imgDelete(img, index, id) {
      this.deletePicTip = true;
      this.deletePic.imgId = img.imgId;
      this.deletePic.type = id;
      this.deletePic.index = index;
      console.log(this.deletePic);
    },

    //取消删除图片
    cancelDeletePic: function cancelDeletePic() {
      this.deletePic = {};
      this.deletePicTip = false;
    },

    //确定删除图片
    ensureDeletePic: function ensureDeletePic() {
      var that = this;
      var _deletePic = this.deletePic;
      __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.imgDelete,
        method: "POST",
        data: {
          id: that.deletePic.imgId,
          isValid: 0
        },
        done: function done() {
          that.imageList[_deletePic.type].splice(_deletePic.index, 1);
          that.failImgList[_deletePic.type].splice(_deletePic.index, 1);
          that.deletePicTip = false;
        }
      });
    },

    //提交后更新IM状态并返回上一页
    backToImPage: function backToImPage() {
      var _this3 = this;

      var failNum = 0;
      var loadingNum = 0;
      __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_object_keys___default()(this.imageList).forEach(function (element) {

        _this3.imageList[element].forEach(function (ele) {
          console.log(ele);
          if (ele.fail) {
            failNum += 1;
          }

          if (ele.uploading) {
            loadingNum += 1;
          }
        });
      });

      if (loadingNum > 0) {
        this.errorMsg = loadingNum + "\u5F20\u56FE\u7247\u6B63\u5728\u4E0A\u4F20\uFF0C\n\u8BF7\u7A0D\u5019";
        this.errorShow = true;
        setTimeout(function () {
          _this3.errorShow = false;
        }, 2000);
        return;
      }

      if (failNum > 0) {
        this.errorMsg = failNum + "\u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\n\u70B9\u51FB\u91CD\u65B0\u4E0A\u4F20\u540E\u518D\u6B21\u63D0\u4EA4";
        this.errorShow = true;
        setTimeout(function () {
          _this3.errorShow = false;
        }, 2000);
        return;
      }
      var that = this;
      that.loading = true;

      __WEBPACK_IMPORTED_MODULE_13_dataLog__["a" /* default */].createTrack({
        actionId: 14176
      });
      that.saveImage().then(function (resolve, reject) {
        if (that.params.from && that.params.from === "im") {
          wx.setStorageSync('checkSuggestTips', {
            success: 1,
            queryType: "checkSuggest"
          });
          that.loading = false;
          wx.navigateBack({
            delta: 1
          });
        } else {
          Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_updateMedicalReport__["a" /* default */])({
            caseId: _this3.params.caseId,
            state: 1
          }).then(function (data) {
            if (data.responseObject.responseStatus) {
              console.log("更新上传了检查检验");
              that.refreshStateOther();
              that.getUserBaseData(that.params);
            } else {
              console.log("更新状态失败");
            }
          });
        }
      });
    },

    // 保存图片
    saveImage: function saveImage() {
      var _this4 = this;

      return new __WEBPACK_IMPORTED_MODULE_2_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        var that = _this4;
        var _picIdList = "";
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(that.uploadList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(that.imageList[i.adviceId]), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

        __WEBPACK_IMPORTED_MODULE_4_common_js_util_util__["a" /* default */].ajax({
          url: XHRList.imgDelete,
          method: "POST",
          data: {
            caseId: _this4.params.caseId, //string	是	病例id
            idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
          },
          done: function done(data) {
            if (data && data.responseObject && data.responseObject.responseStatus) {
              resolve();
            }
          }
        });
      });
    },
    refreshStateOther: function refreshStateOther() {
      Object(__WEBPACK_IMPORTED_MODULE_12_common_js_HttpRequest_updateConsultationState__["a" /* default */])({
        consultationIds: this.params.consultationId,
        consultationState: 6 //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          console.log("状态更新成功" + state);
        } else {
          console.log("状态更新失败" + data);
        }
      });
    },
    getUserBaseData: function getUserBaseData(obj) {
      var _this5 = this;

      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_HttpRequest_getNimToken__["a" /* default */])({
        accid: obj.caseId
      }).then(function (data) {
        if (data.responseObject.responseStatus) {
          _this5.userData = {
            account: "0_" + obj.caseId,
            token: data.responseObject.responseData.imToken
          };
          _this5.connectToNim(obj);
        }
      });
    },
    connectToNim: function connectToNim(opt) {
      var _this6 = this;

      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_nimEnv_nimEnv__["a" /* default */])("test").then(function (nimEnv) {
        _this6.nim = __WEBPACK_IMPORTED_MODULE_15_common_js_nimEnv_NIM_Web_NIM_v5_3_0___default.a.getInstance({
          appKey: nimEnv,
          account: _this6.userData.account,
          token: _this6.userData.token,
          reconnectionAttempts: 0,
          onconnect: function onconnect(data) {
            console.log("连接成功");
            new __WEBPACK_IMPORTED_MODULE_10_common_js_imBaseMethods_imBusinessMethods__["a" /* default */](_this6.nim).sendCustomMessage({
              to: "1_doctor00001",
              custom: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
                cType: "0",
                cId: opt.triDocId,
                mType: "40",
                conId: opt.consultationId
              }),
              content: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({
                type: "checkSuggestSendTips",
                data: {
                  actionType: "checkSuggest"
                }
              })
            }).then(function (msg) {
              _this6.nim.destroy();
              _this6.loading = false;
              wx.setStorageSync('backFromImgCheck', 1);
              wx.navigateBack({ delta: 1 });
            });
          },
          onwillreconnect: function onwillreconnect(obj) {
            console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
          },
          ondisconnect: function ondisconnect() {
            console.log("链接已中断...");
          }
        });
      });
    }
  },

  computed: {
    submitFlag: function submitFlag() {
      var flag = false;
      // console.log(this.imageList);
      for (var i in this.imageList) {

        if (this.imageList[i].length !== 0) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_6_components_loading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_5_components_confirm__["a" /* default */],
    upLoadPic: __WEBPACK_IMPORTED_MODULE_8_components_upLoadPic_upLoadPlugn__["a" /* default */],
    toast: __WEBPACK_IMPORTED_MODULE_14_components_toast__["a" /* default */]
  }
});

/***/ }),

/***/ 557:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "upload-wrapper"
  }, [_c('section', {
    staticClass: "tc-upLoadFile"
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
    staticClass: "tc-upLoadTitleName"
  }, [_vm._v("医学影像拍摄过程")]), _c('span', {
    staticClass: "tc-upLoadRightIcon"
  })])], 1), _vm._v(" "), _vm._l((_vm.uploadList), function(item, index) {
    return _c('section', {
      key: index,
      staticClass: "tc-upLoadBox"
    }, [_c('figure', {
      staticClass: "tc-upLoadTitle"
    }, [_c('span', {
      staticClass: "tc-upLoadTitleName"
    }, [_vm._v(_vm._s(item.adviceName))]), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadRightIcon"
    }), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadRightCover"
    }), _vm._v(" "), _c('upLoadPic', {
      attrs: {
        "propClass": 'input-box',
        "imgList": _vm.imageList,
        "adviceId": item.adviceId,
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
    })], 1), _vm._v(" "), _c('ul', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.imageList[item.adviceId].length > 0),
        expression: "imageList[item.adviceId].length>0"
      }],
      staticClass: "tc-upLoadItemBox"
    }, [_vm._l((_vm.imageList[item.adviceId]), function(img, imgIndex) {
      return _c('li', {
        key: imgIndex,
        staticClass: "tc-upLoadItemList"
      }, [_c('img', {
        attrs: {
          "src": img.blob,
          "eventid": '2-' + index + '-' + imgIndex
        },
        on: {
          "click": function($event) {
            _vm.showBigImg(img, item.adviceId)
          }
        }
      }), _vm._v(" "), _c('span', {
        directives: [{
          name: "show",
          rawName: "v-show",
          value: (img.uploading == false),
          expression: "img.uploading==false"
        }],
        staticClass: "tc-upLoadDel",
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
        staticClass: "upload-fail",
        attrs: {
          "eventid": '4-' + index + '-' + imgIndex
        },
        on: {
          "click": function($event) {
            _vm.upLoadReload(item, imgIndex)
          }
        }
      }, [_c('p', [_vm._v("重新上传")]), _vm._v(" "), _c('div')], 1) : _vm._e()], 1)
    }), _vm._v(" "), _c('li', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (_vm.imageList[item.adviceId].length > 0 && _vm.imageList[item.adviceId].length < 9),
        expression: "imageList[item.adviceId].length>0&&imageList[item.adviceId].length<9"
      }],
      staticClass: "tc-upLoadAdd"
    }, [_c('div', {
      staticClass: "tc-upLoadAddBox"
    }, [_c('upLoadPic', {
      attrs: {
        "propClass": 'tc-upLoadAddInput',
        "imgList": _vm.imageList,
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
    })], 1)])], 2)], 1)
  }), _vm._v(" "), _c('footer', {
    staticClass: "tc-upLoadSubmit"
  }, [(_vm.submitFlag) ? _c('span', {
    staticClass: "tc-submitBtn",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.backToImPage
    }
  }, [_vm._v("提交")]) : _vm._e(), _vm._v(" "), (!_vm.submitFlag) ? _c('span', {
    staticClass: "tc-submitDisabled"
  }, [_vm._v("提交")]) : _vm._e()])], 2), _vm._v(" "), (_vm.deletePicTip) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '取消',
        'cancel': '确定',
        'title': '确定删除图片吗？'
      },
      "showFlag": _vm.deletePicTip,
      "eventid": '7',
      "mpcomid": '2'
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
  }) : _vm._e(), _vm._v(" "), (_vm.loading) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '3'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "imgUrl": "",
      "mpcomid": '4'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-23ba1414", esExports)
  }
}

/***/ })

},[1231]);