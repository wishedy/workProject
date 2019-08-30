global.webpackJsonp([106],{

/***/ 695:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_triageDetail_vue__ = __webpack_require__(697);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_77b2303b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_triageDetail_vue__ = __webpack_require__(698);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(696)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_triageDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_77b2303b_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_triageDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/triageDetail/triageDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] triageDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-77b2303b", Component.options)
  } else {
    hotAPI.reload("data-v-77b2303b", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 696:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 697:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_toast__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getQiniuToken__ = __webpack_require__(181);
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
//
//
//
//
//
//

/**
 * @Desc： 视诊
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2017/8/23.
 */


// import Qiniu from "common/js/third-party/qiniu/qiniu";




// import store from "../store/store";
// import imageCompress from "common/js/imgCompress/toCompress";



var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_8_vuex__["a" /* createNamespacedHelpers */])('imScene'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapGetters = _createNamespacedHelp.mapGetters;

var XHRList = {
  imgCreate: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/", //上传图片
  imgDelete: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/", //更新图片
  saveVideo: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/qiniu/storage/v1/saveVideoInfo/", //视频保存
  resetTime: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/case/consultation/v1/updateFrequency/",
  updateCase: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/v1/update/",
  getToken: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/qiniu/storage/v1/getToken/"
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      tokenObj: {}, // 七牛token对象
      type: 0, // 视诊类型
      content: '', // 视诊话术
      tempFilePaths: [], // 小程序选择的临时图片路径；
      imgLeaveConfirm: false, //上传图片离开confirm框是否显示
      imgLeaveConfirmParams: {}, //图片离开的参数
      videoLeaveConfirm: false, //上传视频离开confirm框是否显示
      videoLeaveConfirmParams: {}, //上传视频离开confirm的参数
      pageLeaveEnsure: false, //页面是否离开
      reloadVideoConfirm: false, //视频重新上传的confirm框是否显示
      imageList: [],
      filesObj: {}, //多图file对象存储，用于获取每张图的信息
      base64Arr: [], //base64压缩后的图片
      uploadIndex: "", //多图上传递增索引
      loading: false,
      uploading: false,
      deletePic: {},
      // deletePicTip: false, //图片删除
      videoUploading: false, //视频正在上传七牛
      videoObj: {},
      videoSubmitParam: {},
      upLoadPercent: 0,
      tip: "上传完成",
      tipShow: false,
      finish: false,
      wxImgLists: [],
      picLists: [],
      picIdIndex: 0,
      uploadVideo: false, //点击提交之后，提交按钮是否可以点击
      uploader: {}, //七牛初始化的对象
      errorShow: false, //toast提示框
      errorMsg: "" //toast话术
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapState(['caseId'])),
  watch: {},
  props: {},
  methods: {
    // 选择图片
    selectImage: function selectImage() {
      var _this = this;
      wx.chooseImage({
        count: 9 - this.imageList.length, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function success(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.tempFilePaths = res.tempFilePaths;
          _this.uploadImg();
        },
        complete: function complete(res) {}
      });
    },

    // 上传图片
    uploadImg: function uploadImg() {
      var index = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var reLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var _this = this;
      if (!reLoad) {
        var promises = [];
        this.tempFilePaths.map(function (item, number) {
          console.log(item);
          console.log(number);
          _this.imageList.unshift({
            blob: _this.tempFilePaths[number],
            imgId: 0,
            uploading: true,
            fail: false
          });
          promises.push(new __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
            wx.uploadFile({
              url: XHRList.imgCreate,
              filePath: item,
              name: "file",
              formData: {
                caseCategoryId: "1", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
                imageType: "1", //	string	是	资源类型		1-上传资料图片
                caseAttSource: "1",
                visitSiteId: "24"
              },
              success: function success(res) {
                var _data = JSON.parse(res.data);
                console.log(_data);
                if (_data.responseObject.responseStatus && _data.responseObject.responsePk) {
                  _this.imageList[number].imgId = _data.responseObject.responsePk;
                  _this.imageList[number].uploading = false;
                  _this.imageList[number].fail = false;
                  _this.imageList[number].finish = true;
                } else {
                  _this.imageList[number].uploading = false;
                  _this.imageList[number].fail = true; //上传失败标识
                  _this.imageList[number].finish = true;
                }
                resolve();
              },
              fail: function fail(err) {
                //微信接口调用失败
                _this.imageList[number].uploading = false;
                _this.imageList[number].fail = true; //上传失败标识
                _this.imageList[number].finish = true;
                reject();
              },
              complete: function complete() {}
            });
          }));
          __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_promise___default.a.all(promises).then(function (result) {
            console.log('上传完成');
          });
        });
      } else {
        console.log(_this.imageList[_this.imageList.length - index - 1].blob);
        wx.uploadFile({
          url: XHRList.imgCreate,
          filePath: _this.imageList[_this.imageList.length - index - 1].blob,
          name: "file",
          formData: {
            caseCategoryId: "1", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
            imageType: "1", //	string	是	资源类型		1-上传资料图片
            caseAttSource: "1",
            visitSiteId: "24"
          },
          success: function success(res) {
            var _data = JSON.parse(res.data);
            console.log(_data);
            if (_data.responseObject.responseStatus && _data.responseObject.responsePk) {
              _this.imageList[index].imgId = _data.responseObject.responsePk;
              _this.imageList[index].uploading = false;
              _this.imageList[index].fail = false;
              _this.imageList[index].finish = true;
            } else {
              _this.imageList[index].uploading = false;
              _this.imageList[index].fail = true; //上传失败标识
              _this.imageList[index].finish = true;
            }
          },
          fail: function fail(err) {
            //微信接口调用失败
            _this.imageList[index].uploading = false;
            _this.imageList[index].fail = true; //上传失败标识
            _this.imageList[index].finish = true;
          },
          complete: function complete() {}
        });
      }
    },

    //查看大图
    showBigImg: function showBigImg(item, index) {
      var arrTemp = [];
      this.imageList.map(function (item, index) {
        arrTemp.push(item.blob);
      });
      wx.previewImage({
        current: item.blob, // 当前显示图片的http链接
        urls: arrTemp // 需要预览的图片http链接列表
      });
    },

    //删除图片
    imgDelete: function imgDelete(item, index, id) {
      var _this2 = this;

      this.deletePic.type = id;
      this.deletePic.index = index;
      wx.showModal({
        title: '确定删除图片吗？',
        content: '',
        success: function success(res) {
          if (res.confirm) {
            _this2.ensureDeletePic();
            // console.log('用户点击确定')
          } else if (res.cancel) {
            _this2.cancelDeletePic();
            // console.log('用户点击取消')
          }
        }
      });
      // this.deletePicTip = true;
      // this.deletePic.type = id;
      // this.deletePic.index = index;
    },

    //取消删除图片
    cancelDeletePic: function cancelDeletePic() {
      this.deletePic.type = "";
      this.deletePic.index = "";
      // this.deletePicTip = false;
    },

    //确定删除图片
    ensureDeletePic: function ensureDeletePic() {
      var that = this;
      var _deletePic = this.deletePic;
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.imgDelete,
        method: "POST",
        data: {
          id: that.deletePic.type,
          isValid: 0
        },
        beforeSend: function beforeSend() {},
        done: function done() {
          that.imageList.splice(_deletePic.index, 1);
          that.uploading = false;
          // that.deletePicTip = false;
        }
      });
    },


    /** 选择视频 */
    selectVideo: function selectVideo() {
      var that = this;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function success(res) {
          console.log(res);
          console.log('微信选择成功');
          if (res.size >= 62914560) {
            console.log('视频太大');
            that.errorMsg = "视频不能超过60M，请重新上传";
            that.errorShow = true;
            setTimeout(function () {
              that.errorShow = false;
            }, 2000);
            return;
          }
          that.videoUploading = true;
          var uploadTask = wx.uploadFile({
            url: 'https://up-z1.qbox.me', //如果是华北一请用up-z1.qbox.me
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              'key': that.tokenObj.key,
              'token': that.tokenObj.uptoken
            },
            success: function success(response) {
              console.log(response);
              var data = JSON.parse(response.data);
              that.videoUploading = false;
              that.upLoadPercent = 0;
              that.videoObj = res;
              that.videoSubmitParam = data;
              that.tipShow = true;
            },
            fail: function fail(error) {
              console.log(error);
            },
            complete: function complete(res) {
              // console.log(res)
            }
          });
          uploadTask.onProgressUpdate(function (res) {
            console.log('上传进度');
            that.upLoadPercent = res.progress;
          });
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    },

    //图片提交
    submitImage: function submitImage() {
      var _this3 = this;

      var that = this;
      var _picIdList = "";
      var _num = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(that.imageList), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var i = _step.value;

          if (i.imgId) {
            _picIdList += i.imgId + ",";
          } else {
            _num++;
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

      if (_num) {
        this.errorMsg = _num + "\u5F20\u56FE\u7247\u4E0A\u4F20\u5931\u8D25\uFF0C\n\u70B9\u51FB\u91CD\u65B0\u4E0A\u4F20\u540E\u518D\u6B21\u63D0\u4EA4";
        this.errorShow = true;
        setTimeout(function () {
          _this3.errorShow = false;
        }, 2000);
        return;
      }
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.imgDelete,
        method: "POST",
        data: {
          caseId: that.caseId, //string	是	病例id
          idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
        },
        done: function done(data) {
          if (data && data.responseObject && data.responseObject.responseStatus) {
            that.pageLeaveEnsure = true;
            __WEBPACK_IMPORTED_MODULE_7_common_js_miniUtil_localStorage__["a" /* default */].setItem('triageTips', {
              success: 1,
              queryType: "triage",
              triageType: "image"
            });
            wx.navigateBack({
              delta: 1
            });
            that.imageList = [];
          } else {
            that.errorMsg = "图片保存失败，请稍后再试";
            that.errorShow = true;
            setTimeout(function () {
              that.errorShow = false;
            }, 2000);
          }
        }
      });
    },

    //视频提交
    submitVideo: function submitVideo() {
      var that = this;
      // 小程序处理文件名，因为没有获取到，然后自己整一个
      var nameArr = this.videoObj.tempFilePath.split('.');
      that.uploadVideo = true;

      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.saveVideo,
        method: "POST",
        data: {
          videoName: nameArr[nameArr.length - 2] + "." + nameArr[nameArr.length - 1],
          key: this.videoSubmitParam.key,
          persistentId: this.videoSubmitParam.persistentId,
          caseId: this.caseId,
          refType: 1
        },
        done: function done(data) {
          that.uploadVideo = false;
          if (data && data.responseObject && data.responseObject.responseStatus) {
            that.pageLeaveEnsure = true;
            __WEBPACK_IMPORTED_MODULE_7_common_js_miniUtil_localStorage__["a" /* default */].setItem('triageTips', {
              success: 1,
              queryType: "triage",
              triageType: "video"
            });
            wx.navigateBack({
              delta: 1
            });
          } else {
            that.errorMsg = "视频保存失败，请稍后再试";
            that.errorShow = true;
            setTimeout(function () {
              that.errorShow = false;
            }, 2000);
          }
          that.videoLeaveConfirm = false;
        }
      });
    },

    //视频上传离开confirm取消函数
    cancelEvent: function cancelEvent() {
      this.videoLeaveConfirm = false;
      if (!this.videoUploading) {
        this.pageLeaveEnsure = true;
        this.$router.go(-1);
      } else {
        this.uploader.start(); //七牛上传开始；
        this.pageLeaveEnsure = false;
      }
    },

    //视频上传离开confirm离开函数
    ensureEvent: function ensureEvent() {
      var that = this;
      if (that.videoUploading) {
        that.videoLeaveConfirm = false;
        that.pageLeaveEnsure = true;
        that.$router.go(-1);
      } else {
        if (that.uploadVideo) {
          return false;
        }
        that.submitVideo();
      }
    },

    //重新上传按钮
    againUpload: function againUpload() {
      var _this4 = this;

      wx.showModal({
        title: '重新上传后',
        content: '原有视频将被替换',
        success: function success(res) {
          if (res.confirm) {
            _this4.selectVideo();
            // console.log('用户点击确定')
          } else if (res.cancel) {

            // console.log('用户点击取消')
          }
        }
      });
    },

    //重新上传confirm取消函数
    uploadCancel: function uploadCancel() {
      this.reloadVideoConfirm = false;
    },

    //重新上传confirm替换函数
    uploadEnsure: function uploadEnsure() {
      var that = this;
      that.reloadVideoConfirm = false;
      //        console.log(document.all);
      console.log(document.querySelector("#uploadBtn").nextSibling.firstChild);
      document.querySelector("#uploadBtn").nextSibling.firstChild["click"]();
      //        try{
      //          let evt = document.createEvent("Events"); //还有onchange则是HtmlEvents
      //          evt.initEvent("click",true,true);
      //          that.$refs.uploadBtn.dispatchEvent(evt);
      //        }catch(e) {
      //          alert(e);
      //        }
    },

    //图片离开取消按钮
    imgCancel: function imgCancel() {
      var that = this;
      that.imgLeaveConfirm = false;
      that.pageLeaveEnsure = true;
      that.$router.go(-1);
      //        this.leaveConfirm = false;
      //        this.pageLeaveEnsure = false;
      console.log("取消");
    },

    //图片离开函数
    imgEnsure: function imgEnsure() {
      var that = this;
      console.log("离开");
      if (that.uploading) {
        this.imgLeaveConfirm = false;
        this.pageLeaveEnsure = false;
      } else {
        this.submitImage();
      }
    }
  },
  mounted: function mounted() {
    var _this5 = this;

    console.log('caseId+++++++++++++++++' + this.caseId);
    console.log(this.$root.$mp.query);
    this.type = this.$root.$mp.query.type, // 视诊类型
    this.content = this.$root.$mp.query.content, // 视诊话术
    this.imageList = [];
    this.videoObj = {};
    this.videoSubmitParam = {};

    // 如果是上传视频，则获取七牛 token
    if (this.type == 1) {
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_getQiniuToken__["a" /* default */])().then(function (result) {
        _this5.tokenObj = result.responseObject;
      });
    }

    // if (!sessionStorage.getItem("triageRoute")) {
    //   sessionStorage.setItem("triageRoute", JSON.stringify(this.$route.params));
    // }
    // this.baseMessage = JSON.parse(sessionStorage.getItem("triageRoute"));
  },
  onUnload: function onUnload() {
    this.videoUploading = false;
    this.upLoadPercent = 0;
    this.videoObj = {};
    this.videoSubmitParam = {};
  },

  components: {
    Toast: __WEBPACK_IMPORTED_MODULE_4_components_toast__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_5_components_confirm__["a" /* default */]
  }
});

/***/ }),

/***/ 698:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "he-videoUpHide ev-videoImgUpHide"
  }, [_c('section', {
    staticClass: "he-videoUpLoadBox"
  }, [_c('section', {
    staticClass: "he-videosMain"
  }, [(_vm.type == 2) ? _c('section', {
    staticClass: "al-uploadNumLimit"
  }, [_c('span', [_vm._v("提示：最多可以上传9张图片")])]) : _vm._e(), _vm._v(" "), _c('p', {
    staticClass: "he-loadTitle",
    class: {
      'upLoadPicHasTip': _vm.type == 2
    }
  }, [_vm._v(_vm._s(_vm.content))]), _vm._v(" "), (_vm.type == 2) ? _c('ul', {
    staticClass: "he-loadFiles he-videoImageBox docInt"
  }, [_vm._l((_vm.imageList), function(item, index) {
    return (_vm.imageList.length > 0) ? _c('li', {
      key: index,
      staticClass: "tc-imageItemList ev-imgList success"
    }, [_c('img', {
      attrs: {
        "src": item.blob,
        "alt": "",
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(item, index)
        }
      }
    }), _vm._v(" "), _c('span', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (item.finish),
        expression: "item.finish"
      }],
      staticClass: "tc-upLoadDel",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.imgDelete(item, index, item.imgId)
        }
      }
    }), _vm._v(" "), (item.uploading) ? _c('div', [_c('span', {
      staticClass: "tc-upLoadCover"
    }), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoading"
    }), _vm._v(" "), _c('span', {
      staticClass: "tc-upLoadAfreshText"
    }, [_vm._v("等待上传")])]) : _vm._e(), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "upload-fail",
      attrs: {
        "eventid": '2-' + index
      },
      on: {
        "click": function($event) {
          _vm.uploadImg(index, true)
        }
      }
    }, [_c('p', [_vm._v("重新上传")])], 1) : _vm._e()], 1) : _vm._e()
  }), _vm._v(" "), _c('li', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.imageList.length < 9),
      expression: "imageList.length<9"
    }],
    staticClass: "tc-imageUpLoadAdd",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.selectImage()
      }
    }
  }, [_c('div', {
    staticClass: "imageIcon"
  }, [_c('span', {
    staticClass: "tc-upLoadAddMore"
  })])])], 2) : _vm._e(), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 1 && !_vm.videoObj.size),
      expression: "type==1 && !videoObj.size"
    }],
    staticClass: "he-loadFiles"
  }, [_c('li', {
    staticClass: "he-videoAddFirstBtn",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        _vm.selectVideo()
      }
    }
  }, [_c('div', {
    staticClass: "he-videoFirstLoadBtn"
  })])], 1), _vm._v(" "), _c('ul', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 1 && _vm.videoObj.size),
      expression: "type==1 && videoObj.size"
    }],
    staticClass: "he-loadFiles ev-success"
  }, [_c('li', {
    staticClass: "he-loadVideoSuccess"
  }, [_c('span', {
    staticClass: "he-loadVideoSuccessBox"
  }, [_c('span', {
    staticClass: "he-loadSuccessTip"
  }), _vm._v(" "), _c('span', {
    staticClass: "he-loadSuccessText"
  }, [_vm._v("已上传")])])]), _vm._v(" "), _c('li', {
    staticClass: "he-videoAddBtn he-loadSuccessTextBox"
  }, [_c('div', {
    staticClass: "he-reLoadText",
    attrs: {
      "id": "reloadBtn",
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.againUpload()
      }
    }
  }, [_vm._v("重新上传")])])], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 2),
      expression: "type==2"
    }],
    staticClass: "he-videosSubmit ev-submitUpData"
  }, [(_vm.imageList.length && !_vm.uploading) ? _c('button', {
    staticClass: "usable downBtn",
    staticStyle: {
      "display": "inline-block"
    },
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.submitImage
    }
  }, [_vm._v("提交\n          ")]) : _vm._e(), _vm._v(" "), (!_vm.imageList.length || _vm.uploading) ? _c('button', {
    staticClass: "unusable"
  }, [_vm._v("提交")]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.type == 1),
      expression: "type==1"
    }],
    staticClass: "he-videosSubmit ev-submitUpData"
  }, [(_vm.videoObj.size) ? _c('button', {
    staticClass: "usable downBtn",
    staticStyle: {
      "display": "inline-block"
    },
    attrs: {
      "disabled": _vm.uploadVideo,
      "eventid": '7'
    },
    on: {
      "click": function($event) {
        _vm.submitVideo()
      }
    }
  }, [_vm._v("提交\n          ")]) : _vm._e(), _vm._v(" "), (!_vm.videoObj.size) ? _c('button', {
    staticClass: "unusable"
  }, [_vm._v("提交")]) : _vm._e()], 1)], 1)], 1), _vm._v(" "), (_vm.videoUploading) ? _c('section', {
    staticClass: "video-upLoad-box"
  }, [_c('section', {
    staticClass: "ev-videoUpLoading"
  }, [_c('div', {
    staticClass: "tc-videoLoadingImg"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png",
      "alt": ""
    }
  })]), _vm._v(" "), _c('p', {
    staticClass: "tc-videoLoadingText"
  }, [_vm._v("上传中" + _vm._s(_vm.upLoadPercent) + "%...")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.errorShow) ? _c('toast', {
    attrs: {
      "content": _vm.errorMsg,
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '2'
    }
  }, [(_vm.imgLeaveConfirm) ? _c('confirm', {
    attrs: {
      "confirmParams": _vm.imgLeaveConfirmParams,
      "showFlag": _vm.imgLeaveConfirm,
      "eventid": '8',
      "mpcomid": '1'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.imgLeaveConfirm = $event
      },
      "cancelClickEvent": function($event) {
        _vm.imgCancel()
      },
      "ensureClickEvent": function($event) {
        _vm.imgEnsure()
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '4'
    }
  }, [(_vm.videoLeaveConfirm) ? _c('confirm', {
    attrs: {
      "confirmParams": _vm.videoLeaveConfirmParams,
      "showFlag": _vm.videoLeaveConfirm,
      "eventid": '9',
      "mpcomid": '3'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.videoLeaveConfirm = $event
      },
      "cancelClickEvent": function($event) {
        _vm.cancelEvent()
      },
      "ensureClickEvent": function($event) {
        _vm.ensureEvent()
      }
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '6'
    }
  }, [(_vm.reloadVideoConfirm) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '取消',
        'cancel': '替换',
        'title': '重新上传后',
        'content': '原有视频将被替换',
      },
      "showFlag": _vm.reloadVideoConfirm,
      "eventid": '10',
      "mpcomid": '5'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.reloadVideoConfirm = $event
      },
      "cancelClickEvent": function($event) {
        _vm.uploadEnsure()
      },
      "ensureClickEvent": function($event) {
        _vm.uploadCancel()
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-77b2303b", esExports)
  }
}

/***/ })

},[1245]);