global.webpackJsonp([14],{

/***/ 1197:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_uploadVideo_vue__ = __webpack_require__(1199);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_15231dda_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_uploadVideo_vue__ = __webpack_require__(1203);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1198)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_uploadVideo_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_15231dda_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_uploadVideo_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/journal/uploadVideo.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] uploadVideo.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-15231dda", Component.options)
  } else {
    hotAPI.reload("data-v-15231dda", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1198:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1199:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_getQiniuToken__ = __webpack_require__(181);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_journal_getDiaryDetails__ = __webpack_require__(1200);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_journal_saveVideo__ = __webpack_require__(1201);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_journal_createSupplementRecord__ = __webpack_require__(1202);


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 *  日记上传视频组件
 * 
 *  create by JK on 2018/11/28
 */










/* harmony default export */ __webpack_exports__["a"] = ({
  name: 'attachment',
  data: function data() {
    return {
      diaryId: '', //主日记ID

      upLoadType: '', //上传类型  1-术前 2-术后
      tokenObj: {}, //七牛 token 对象

      videoList1: [], //视频列表
      videoList2: [],

      videoUploading1: false,
      videoUploading2: false,

      videoObj1: {}, //本地文件对象
      videoObj2: {},

      videoSubmitParam1: [], //提交参数
      videoSubmitParam2: [],

      upLoadPercent1: '', //视频上传进度
      upLoadPercent2: '', //视频上传进度

      deleteVideoTip: false,
      tipText: '',

      delVideoList1: [], // 视频删除list
      delVideoList2: [],

      delateType: '', //删除类型
      delIndex: '', //删除索引
      delItem: {} //删除项
    };
  },
  onLoad: function onLoad(option) {
    this.videoList1 = []; //视频列表
    this.videoList2 = [];
    this.delVideoList1 = []; // 视频删除list
    this.delVideoList2 = [];
    this.videoSubmitParam1 = []; //提交参数
    this.videoSubmitParam2 = [];
    this.diaryId = option.diaryId; //日记ID
  },
  onShow: function onShow() {},
  mounted: function mounted() {
    this.getQiniuTokenFn(); //获取token
    this.getJourDetails(); //获取详情
  },

  computed: {},
  watch: {},
  components: {
    confirm: __WEBPACK_IMPORTED_MODULE_5_components_confirm__["a" /* default */]
  },
  methods: {
    //主日记详情
    getJourDetails: function getJourDetails() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_journal_getDiaryDetails__["a" /* default */])({
        sortType: '', //string	是	排序		
        imgUseFlag: '5', //string	是	图片规格尺寸	  5
        videoUseFlag: '8', //	string	是	图视频规格尺寸	  8
        diaryId: _this.diaryId //	string	是	日记id
      }).then(function (res) {
        console.log(res);
        if (res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          var _data = res.responseObject.responseData.dataList[0];
          var _beforeOperationVideoList = _data.beforeOperationVideoList ? _data.beforeOperationVideoList : '';
          var _afterOperationVideoListt = _data.afterOperationVideoList ? _data.afterOperationVideoList : '';
          if (_beforeOperationVideoList.length > 0) {
            _beforeOperationVideoList.forEach(function (element) {
              _this.videoList1.push(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(element, {
                fail: false,
                finish: true
              }));
            });
          }
          if (_afterOperationVideoListt.length > 0) {
            _afterOperationVideoListt.forEach(function (element) {
              _this.videoList2.push(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(element, {
                fail: false,
                finish: true
              }));
            });
          }
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    //获取七牛token
    getQiniuTokenFn: function getQiniuTokenFn() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_4_common_js_HttpRequest_getQiniuToken__["a" /* default */])().then(function (result) {
        _this.tokenObj = result.responseObject;
      });
    },

    //视频上传
    wxChoseVideoFile: function wxChoseVideoFile(index) {
      var _this = this;
      _this.upLoadType = index;
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function success(res) {
          console.log(res);
          if (res.size >= 62914560) {
            _this.showTips({
              type: '1',
              title: '视频不能超过60M，请重新上传'
            });
            return;
          }
          //上传前
          if (index == '1') {
            _this.videoUploading1 = true; //上传中
            _this.videoObj1 = res; //本地文件对象
            _this.videoList1.push({
              fail: false, //是否上传失败
              finish: false //是否上传完成
            });
          } else {
            _this.videoUploading2 = true; //上传中
            _this.videoObj2 = res; //本地文件对象
            _this.videoList2.push({
              fail: false, //是否上传失败
              finish: false //是否上传完成
            });
          }
          //七牛上传
          var uploadTask = wx.uploadFile({
            url: 'https://up-z1.qbox.me', //如果是华北一请用up-z1.qbox.me
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              'key': _this.tokenObj.key,
              'token': _this.tokenObj.uptoken
            },
            success: function success(response) {
              var data = JSON.parse(response.data);
              _this.getQiniuTokenFn(); //获取token
              //本地视频链接
              if (index == '1') {
                _this.videoUploading1 = false; //上传完成
                _this.videoSubmitParam1.push(data); //提交参数
                _this.saveVideoFn({
                  name: '', //文件名
                  key: data.key, //token
                  persistentId: data.persistentId, //七牛Id 
                  type: '7',
                  callBack: function callBack(backData) {
                    _this.videoList1[_this.videoList1.length - 1] = {
                      fail: false,
                      finish: true,
                      attUrl: res.tempFilePath, //	播放地址
                      qiniuId: data.persistentId, //	七牛ID
                      attType: '', //2    
                      qiniuStatus: '', //视频状态 2-转码成功  
                      imageUrl: '', //封面图    http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                      playTime: '', //视频时长  00:00:21
                      id: backData //视频保存成功 responsePk
                    };
                    _this.upLoadPercent1 = 0; //上传进度
                    _this.$forceUpdate();
                  }
                });
              } else {
                _this.videoUploading2 = false; //上传完成
                _this.videoSubmitParam2.push(data); //提交参数
                _this.saveVideoFn({
                  name: '', //文件名  "fad9a9cc561513f....mp4",
                  key: data.key, //token
                  persistentId: data.persistentId, //七牛Id 
                  type: '8',
                  callBack: function callBack(backData) {
                    _this.videoList2[_this.videoList2.length - 1] = {
                      fail: false,
                      finish: true,
                      attUrl: res.tempFilePath, //	http://vpro.allinmed.cn/1544261651797_480_320.mp4
                      qiniuId: data.persistentId, //	z1.5c0b904dc0ebc160e492b42c 
                      attType: '', //2    
                      qiniuStatus: '', //2  
                      imageUrl: '', //http://vpro.allinmed.cn/1544261651797_1544261651_450_300.jpg  
                      playTime: '', //00:00:21
                      id: backData //"4321"
                    };
                    _this.upLoadPercent2 = 0; //上传进度
                    _this.$forceUpdate();
                  }
                });
              }
            },
            fail: function fail(error) {
              console.log(error);
              if (index == '1') {
                _this.videoUploading1 = false; //上传完成
                _this.upLoadPercent1 = 0; //上传进度
                _this.videoList1[_this.videoList1.length - 1] = {
                  fail: true,
                  finish: true
                };
              } else {
                _this.videoUploading2 = false; //上传完成
                _this.upLoadPercent2 = 0; //上传进度
                _this.videoList2[_this.videoList2.length - 1] = {
                  fail: true,
                  finish: true
                };
              }
            },
            complete: function complete(res) {
              // console.log(res)
            }
          });
          // 上传进度
          uploadTask.onProgressUpdate(function (res) {
            // console.log('上传进度');
            if (index == '1') {
              _this.upLoadPercent1 = res.progress;
            } else {
              _this.upLoadPercent2 = res.progress;
            }
          });
        },
        fail: function fail(err) {
          console.log(err);
        }
      });
    },
    saveVideoFn: function saveVideoFn(_param) {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_journal_saveVideo__["a" /* default */])({
        "videoName": _param.name, //"fad9a9cc561513f....mp4",
        "key": _param.key,
        "persistentId": _param.persistentId,
        "diaryId": _this.diaryId,
        "sourceType": _param.type,
        "isValid": 0,
        "refType": 4
      }).then(function (res) {
        // console.log(res)
        if (res && res.responseObject && res.responseObject.responseStatus) {
          _param.callBack(res.responseObject.responsePk); //回调 
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    // 点击完成
    videoEnsure: function videoEnsure() {
      if (this.videoList1.length == 0 && this.videoList2.length == 0) {
        this.showTips({
          type: '2',
          content: '您还未上传视频'
        });
      } else {
        this.saveVideo(); //保存视频     
      }
    },

    // 点击返回
    videoBack: function videoBack() {
      wx.navigateBack({
        delta: '1'
      });
    },

    //提交上传并返回
    saveVideo: function saveVideo() {
      var _this = this;
      var _beforContentList = _this.getContentList(); // 术前
      var _diarySupplementAttList = _this.getAttList(); // 术后
      var _param = {
        "diaryId": _this.diaryId,
        "isVideoFlag": 1,
        "diarySupplementContentList": __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(_beforContentList),
        "diarySupplementAttList": __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(_diarySupplementAttList),
        "isDraftFlag": 0,
        "visitSiteId": __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getSiteId()
      };
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_journal_createSupplementRecord__["a" /* default */])(_param).then(function (res) {
        if (res && res.responseObject && res.responseObject.responseStatus) {
          __WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].setItem("isReflesh", true); //保存成功 需要刷新页面
          wx.navigateBack({
            delta: '1'
          });
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    //拼接问题Id list
    getContentList: function getContentList() {
      var _this = this;
      var _data = [];
      var _qiniuID1 = '';
      var _qiniuID2 = '';
      _this.videoList1.forEach(function (item) {
        _qiniuID1 += item.qiniuId + ',';
      });
      _data.push({
        "supplementQuestion": "术前视频",
        "supplementContent": _qiniuID1.substring(0, _qiniuID1.length - 1),
        "supplementType": "7",
        "sortId": 1
      });
      _this.videoList2.forEach(function (item) {
        _qiniuID2 += item.qiniuId + ',';
      });
      _data.push({
        "supplementQuestion": "术后视频",
        "supplementContent": _qiniuID2.substring(0, _qiniuID2.length - 1),
        "supplementType": "8",
        "sortId": 1
      });
      return _data;
    },

    //拼接视频Id list
    getAttList: function getAttList() {
      var _this = this;
      var _data = [];
      _this.videoList1.forEach(function (element) {
        _data.push({
          "id": element.id,
          "qiniuId": element.qiniuId,
          "supplementType": "7",
          "isValid": 1
        });
      });
      _this.videoList2.forEach(function (element) {
        _data.push({
          "id": element.id,
          "qiniuId": element.qiniuId,
          "supplementType": "8",
          "isValid": 1
        });
      });
      _this.delVideoList1.forEach(function (element) {
        _data.push({
          "id": element.id,
          "qiniuId": element.qiniuId,
          "supplementType": "7",
          "isValid": 0
        });
      });
      _this.delVideoList2.forEach(function (element) {
        _data.push({
          "id": element.id,
          "qiniuId": element.qiniuId,
          "supplementType": "8",
          "isValid": 0
        });
      });
      return _data;
    },

    // toast取消删除
    cancelDeletePic: function cancelDeletePic() {
      this.deleteVideoTip = false;
    },

    // toast确认删除
    ensureDeletePic: function ensureDeletePic() {
      switch (this.delateType) {
        case '1':
          if (!this.delItem.fail) {
            //非上传失败
            this.delVideoList1.push(this.videoList1[this.delIndex]); //记录删除ID
            this.videoSubmitParam1.splice(this.delIndex, 1);
          }
          this.videoList1.splice(this.delIndex, 1); //数组删除item
          this.deleteVideoTip = false;
          break;
        case '2':
          if (!this.delItem.fail) {
            //非上传失败
            this.delVideoList2.push(this.videoList2[this.delIndex]); //记录删除ID
            this.videoSubmitParam2.splice(this.delIndex, 1);
          }
          this.videoList2.splice(this.delIndex, 1);
          this.deleteVideoTip = false;
          break;
      }
    },

    // 视频删除
    delateFn: function delateFn(type, item, index) {
      this.deleteVideoTip = true;
      this.tipText = '确定删除视频吗？';
      this.delateType = type;
      this.delIndex = index;
      this.delItem = item;
    },

    // 视频播放 
    videoPlay: function videoPlay(path) {
      var _url = "/packageA/videoPlayer/videoPlayer?videoUrl=" + encodeURIComponent(path);
      wx.navigateTo({
        url: _url
      });
    },

    // toast提示
    showTips: function showTips(option) {
      var _this = this;
      switch (option.type) {
        case '1':
          wx.showToast({
            title: '您还未上传视频',
            icon: 'none'
          });
          break;
        case '2':
          wx.showModal({
            title: '',
            content: option.content,
            showCancel: false,
            confirmText: "我知道了"
          });
          break;
        default:
          break;
      }
    }
  }
});

/***/ }),

/***/ 1200:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getDiaryDetails;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);


/**
 * @Desc：获取日记详情
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/3/27.
 */




var XHRList = __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/v1/getDiaryDetailsMapById/";

function getDiaryDetails(param) {
    var _default = {};
    var _param = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
    return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        Object(__WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__["a" /* default */])({
            url: XHRList,
            method: "POST",
            data: _param,
            done: function done(data) {
                resolve(data);
            },
            fail: function fail(err) {
                reject(err);
            }
        });
    });
};

/***/ }),

/***/ 1201:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = saveVideoInfo;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);




/**
 * @Desc：保存视频
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/12/12.
 */




var XHRList = __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/qiniu/storage/v1/saveVideoInfo/";

function saveVideoInfo(param) {
    var _default = {};
    var _param = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
    return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        Object(__WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__["a" /* default */])({
            url: XHRList,
            method: "POST",
            data: _param,
            done: function done(data) {
                resolve(data);
            },
            fail: function fail(err) {
                reject(err);
            }
        });
    });
};

/***/ }),

/***/ 1202:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = createSupplementRecord;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);




/**
 * @Desc：保存视频数据
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/12/12.
 */




var XHRList = __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/rehabilitative/diary/supplement/v1/createSupplementRecord/";

function createSupplementRecord(param) {
    var _default = {};
    var _param = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_object_assign___default()(_default, param);
    return new __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_promise___default.a(function (resolve, reject) {
        Object(__WEBPACK_IMPORTED_MODULE_2_common_js_util_ajax__["a" /* default */])({
            url: XHRList,
            method: "POST",
            data: _param,
            done: function done(data) {
                resolve(data);
            },
            fail: function fail(err) {
                reject(err);
            }
        });
    });
};

/***/ }),

/***/ 1203:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "videoContent"
  }, [_c('section', {
    staticClass: "first-box"
  }, [_c('section', {
    staticClass: "title-box"
  }, [_c('p', {
    staticClass: "title-box-title"
  }, [_c('span', {
    staticClass: "title-icon"
  }), _vm._v("术前视频")]), _vm._v(" "), _c('p', {
    staticClass: "title-box-describe"
  }, [_vm._v("因肢体功能异常造成的生活和行动不便的视频")])], 1), _vm._v(" "), _c('section', {
    staticClass: "videoBox"
  }, [_vm._l((_vm.videoList1), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "videoList"
    }, [(!item.fail && item.finish && item.imageUrl.length > 0) ? _c('div', {
      staticClass: "videoItem",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.videoPlay(item.attUrl)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.imageUrl,
        "alt": ""
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "play-btn"
    }), _vm._v(" "), _c('span', {
      staticClass: "video-time"
    }, [_vm._v(_vm._s(item.playTime))])]) : _vm._e(), _vm._v(" "), (item.finish) ? _c('span', {
      staticClass: "delateVideoBtn",
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.delateFn('1', item, index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (!item.finish) ? _c('div', {
      staticClass: "upload-coverImg"
    }, [_c('div', {
      staticClass: "tc-videoLoadingImg"
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png",
        "alt": ""
      }
    })]), _vm._v(" "), _c('p', {
      staticClass: "tc-videoLoadingText"
    }, [_vm._v("上传中 " + _vm._s(_vm.upLoadPercent1) + " %...")])], 1) : _vm._e(), _vm._v(" "), (item.finish && !item.fail && item.imageUrl.length == 0) ? _c('div', {
      staticClass: "upload-success"
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/videoBanner.jpg",
        "alt": ""
      }
    })]) : _vm._e(), _vm._v(" "), (item.finish && item.fail) ? _c('div', {
      staticClass: "upload-fail"
    }, [_c('span', {
      staticClass: "fail-first"
    }, [_vm._v("上传失败")]), _c('span', {
      staticClass: "fail-second"
    }, [_vm._v("请重新上传")])]) : _vm._e()])
  }), _vm._v(" "), (!_vm.videoUploading1 && _vm.videoList1.length < 2) ? _c('section', {
    staticClass: "wxChoseFileBtn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.wxChoseVideoFile('1')
      }
    }
  }) : _vm._e()], 2)], 1), _vm._v(" "), _c('section', {
    staticClass: "second-box"
  }, [_c('section', {
    staticClass: "title-box"
  }, [_c('p', {
    staticClass: "title-box-title"
  }, [_c('span', {
    staticClass: "title-icon"
  }), _vm._v("术后视频")]), _vm._v(" "), _c('p', {
    staticClass: "title-box-describe"
  }, [_vm._v("术后下地活动视频、日常锻炼小视频")])], 1), _vm._v(" "), _c('section', {
    staticClass: "videoBox"
  }, [_vm._l((_vm.videoList2), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "videoList"
    }, [(!item.fail && item.finish && item.imageUrl.length > 0) ? _c('div', {
      staticClass: "videoItem",
      attrs: {
        "eventid": '3-' + index
      },
      on: {
        "click": function($event) {
          _vm.videoPlay(item.attUrl)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.imageUrl,
        "alt": ""
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "play-btn"
    }), _vm._v(" "), _c('span', {
      staticClass: "video-time"
    }, [_vm._v(_vm._s(item.playTime))])]) : _vm._e(), _vm._v(" "), (item.finish) ? _c('span', {
      staticClass: "delateVideoBtn",
      attrs: {
        "eventid": '4-' + index
      },
      on: {
        "click": function($event) {
          _vm.delateFn('2', item, index)
        }
      }
    }) : _vm._e(), _vm._v(" "), (!item.finish) ? _c('div', {
      staticClass: "upload-coverImg"
    }, [_c('div', {
      staticClass: "tc-videoLoadingImg"
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png",
        "alt": ""
      }
    })]), _vm._v(" "), _c('p', {
      staticClass: "tc-videoLoadingText"
    }, [_vm._v("上传中 " + _vm._s(_vm.upLoadPercent2) + " %...")])], 1) : _vm._e(), _vm._v(" "), (item.finish && !item.fail && item.imageUrl.length == 0) ? _c('div', {
      staticClass: "upload-success"
    }, [_c('img', {
      attrs: {
        "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/videoBanner.jpg",
        "alt": ""
      }
    })]) : _vm._e(), _vm._v(" "), (item.finish && item.fail) ? _c('div', {
      staticClass: "upload-fail"
    }, [_c('span', {
      staticClass: "fail-first"
    }, [_vm._v("上传失败")]), _c('span', {
      staticClass: "fail-second"
    }, [_vm._v("请重新上传")])]) : _vm._e()])
  }), _vm._v(" "), (_vm.videoList2.length < 2 && !_vm.videoUploading2) ? _c('section', {
    staticClass: "wxChoseFileBtn",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.wxChoseVideoFile('2')
      }
    }
  }) : _vm._e()], 2)], 1), _vm._v(" "), _c('section', {
    staticClass: "videoBtn-box"
  }, [_c('section', {
    staticClass: "videoBtn ensure",
    attrs: {
      "eventid": '6'
    },
    on: {
      "click": _vm.videoEnsure
    }
  }, [_c('span', [_vm._v("完成")])]), _vm._v(" "), _c('section', {
    staticClass: "videoBtn later",
    attrs: {
      "eventid": '7'
    },
    on: {
      "click": _vm.videoBack
    }
  }, [_c('span', [_vm._v("稍后上传")])])], 1), _vm._v(" "), (_vm.deleteVideoTip) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '取消',
        'cancel': '确定',
        'title': _vm.tipText,
      },
      "showFlag": _vm.deleteVideoTip,
      "eventid": '8',
      "mpcomid": '0'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.deleteVideoTip = $event
      },
      "cancelClickEvent": function($event) {
        _vm.ensureDeletePic()
      },
      "ensureClickEvent": function($event) {
        _vm.cancelDeletePic()
      }
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-15231dda", esExports)
  }
}

/***/ })

},[1316]);