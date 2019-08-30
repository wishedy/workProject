global.webpackJsonp([10],{

/***/ 1165:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNote_vue__ = __webpack_require__(1167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_21e0f110_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNote_vue__ = __webpack_require__(1172);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1166)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_patientNote_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_21e0f110_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_patientNote_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/patientNote/patientNote.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] patientNote.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-21e0f110", Component.options)
  } else {
    hotAPI.reload("data-v-21e0f110", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1166:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1167:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_shareNode__ = __webpack_require__(1168);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_getPagesParam_getPagesParam__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_components_BlackList__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_components_authorization_authorization__ = __webpack_require__(36);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




 // 返回首页组件





var noteUrl = {
  getManualDetail: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getManualBase/', //手册详情--基本信息
  getContentList: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getManualList/', //手册详情--内容列表
  getDoctorTip: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorTip/' //手册详情--医生悬浮窗提示
};

var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["a" /* createNamespacedHelpers */])('patientNote'),
    mapState = _createNamespacedHelp.mapState,
    mapActions = _createNamespacedHelp.mapActions,
    mapMutations = _createNamespacedHelp.mapMutations;

/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      manualId: '',
      nodeDetail: {},
      contentList: [],
      totalNum: '',
      isShowInvite: true,
      isShowShare: false,
      pageIndex: 1,
      nodata: false,
      loading: [],
      isHidden: false,
      doctorId: '',
      isTable: false,
      backIndexShow: false,
      doctorInfo: {}
    };
  },
  created: function created() {},

  computed: {
    doctorName: function doctorName() {
      return this.getStrByteLength(this.doctorInfo.doctorName);
    }
  },
  onShareAppMessage: function onShareAppMessage() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 100
    });
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
      actionId: 14206,
      keyword: this.nodeDetail.manualName
    });
    var path = '/pages/mIndex/mIndex?from=shareFriend&manualId=' + this.manualId + '&path=/packageF/patientNote/patientNote';
    if (this.doctorId) {
      path = '/pages/mIndex/mIndex?from=shareFriend&manualId=' + this.manualId + '&shareDoctorId=' + this.doctorId + '&path=/packageF/patientNote/patientNote';
    }
    return {
      title: this.nodeDetail.manualName,
      path: path
    };
  },
  onReachBottom: function onReachBottom() {//分页
    // let t=this;
    // if(!t.loading&&!t.nodata&&t.totalNum>20){
    //   // t.getContentList();
    // }
  },

  methods: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, mapMutations(['setVideoMap']), {
    //判断是否显示为空
    jugeNodata: function jugeNodata() {
      if (this.nodeDetail.adaptCrowd || this.nodeDetail.expertsSay || this.nodeDetail.recommenderList && this.nodeDetail.recommenderList.length || this.totalNum) {
        this.isTable = false;
        // this.isTable=true;
      } else {
        this.isTable = true;
      }
    },
    getStrByteLength: function getStrByteLength(item) {
      if (item) {
        if (__WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getByteLen(item) > 8) {
          return __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getStrByteLength(item, 3) + '...';
        } else {
          return item;
        }
      } else {
        this.isShowInvite = false;
      }
    },

    //患教详情
    gotoNoteDetail: function gotoNoteDetail(item) {
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14205,
        pushMessageId: item.educationId,
        keyword: item.educationName
      });
      var pagesParam = __WEBPACK_IMPORTED_MODULE_7_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('healthKnowledgeDetail');
      var webUrl = item.webStoragePath + '?educationId=' + item.educationId;
      if (pagesParam.hasName) {
        //有相同的
        wx.setStorageSync('knowledgeDetailUrl', webUrl);
        wx.navigateBack({
          delta: pagesParam.backNum
        });
      } else {
        //没有相同的历史
        wx.navigateTo({
          url: '/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=' + encodeURIComponent(webUrl)
        });
      }
    },

    //关闭分享卡片
    shareClose: function shareClose(data) {
      this.isHidden = false;
      this.isShowShare = false;
    },

    //分享卡片
    shareImg: function shareImg() {
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14207
      });
      this.isHidden = true;
      this.isShowShare = true;
    },

    //去医生主页
    showWarm: function showWarm(item, type, index) {
      var doctorId = item.customerId;
      if (type == 'shareDoctor') {
        __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
          actionId: 14208,
          pushMessageId: doctorId,
          keyword: item.fullName,
          locationId: index
        });
      } else {
        __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
          actionId: 14204,
          pushMessageId: doctorId,
          keyword: item.fullName,
          locationId: index
        });
      }
      var pagesParam = __WEBPACK_IMPORTED_MODULE_7_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('doctorMain');
      if (pagesParam.hasName) {
        //有相同的
        wx.setStorageSync('nodeDoctorId', doctorId);
        wx.navigateBack({
          delta: pagesParam.backNum
        });
      } else {
        //没有相同的历史
        wx.navigateTo({
          url: '/pages/doctorMain/doctorMain?doctorCustomerId=' + doctorId + '&from=patientNote'
        });
      }
    },

    //关闭邀请医生
    closeInvite: function closeInvite() {
      this.isShowInvite = false;
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14209
      });
    },
    gotoVideo: function gotoVideo(item) {
      // item.videoMap.tipsContent=item.tipsContent;
      // item.videoMap.educationId=item.educationId;
      // this.setVideoMap(JSON.stringify(item.videoMap));
      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14205,
        pushMessageId: item.educationId,
        keyword: item.educationName
      });
      wx.navigateTo({
        url: '/packageF/patientNote/detailVideo?educationId=' + item.educationId + '&manualId=' + this.manualId + '&id=' + item.id
      });
    },

    //手册详情--基本信息
    getManualDetail: function getManualDetail() {
      var t = this;
      t.loading.push('1');
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: noteUrl.getManualDetail,
        method: 'post',
        data: {
          manualId: t.manualId,
          visitSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId(),
          customerId: wx.getStorageSync('userId') || ''
        },
        timeout: 30000,
        done: function done(response) {
          t.loading.pop();
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList) {
            console.log(response.responseObject.responseData.dataList[0]);
            t.nodeDetail = response.responseObject.responseData.dataList[0];
            t.jugeNodata();
          }
        }
      });
    },

    //手册详情--医生悬浮窗提示
    getDoctorTip: function getDoctorTip() {
      var t = this;
      t.loading.push('1');
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: noteUrl.getDoctorTip,
        method: 'post',
        data: {
          doctorId: t.doctorId
        },
        timeout: 30000,
        done: function done(response) {
          t.loading.pop();
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList) {
            var dataList = response.responseObject.responseData.dataList;
            if (dataList.length) {
              t.doctorInfo = dataList[0];
              t.isShowInvite = true;
            }
          }
        }
      });
    },

    //手册详情--内容列表
    getContentList: function getContentList() {
      var t = this;
      t.loading.push('1');
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: noteUrl.getContentList,
        method: 'post',
        data: {
          manualId: t.manualId,
          visitSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId(),
          customerId: wx.getStorageSync('userId') || '',
          // firstResult:(t.pageIndex-1)*20,
          // maxResult:20,
          resultType: '1',
          videoAttSpec: 8
        },
        timeout: 30000,
        done: function done(response) {
          t.loading.pop();
          // t.pageIndex++;
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList) {
            var dataList = response.responseObject.responseData.dataList;
            if (dataList.length) {
              t.nodata = false;
              t.contentList = dataList;
              // if(t.contentList.length){
              //   //新数据与旧数据最后一个id一致拼接到最后一个数组的contentList
              //   if (t.contentList[t.contentList.length - 1].contentId == dataList[0].contentId) {
              //     t.contentList[t.contentList.length - 1].contentList=t.contentList[t.contentList.length - 1].contentList.concat(dataList[0].contentList);
              //     dataList.splice(0,1);
              //     t.contentList=t.contentList.concat(dataList);
              //   }else {
              //     t.contentList=t.contentList.concat(dataList)
              //   }
              // }else {
              //   //第一次
              //   t.contentList=dataList;
              // }
              // let contentLen=t.getContentLen(dataList);
              // if(contentLen<20){
              //   // 下一页没有数据
              //   t.nodata=true;
              // }else {
              //   t.nodata=false;
              // }
            } else {
              // 没数据
              t.nodata = true;
            }
          }
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.totalNum) {
            t.totalNum = response.responseObject.responseData.totalNum;
          }
          t.jugeNodata();
        }
      });
    },

    //  判断当前content的长度
    getContentLen: function getContentLen(content) {
      var num = 0;
      for (var i = 0; i < content.length; i++) {
        num += content[i].contentList.length;
      }
      return num;
    }
  }),
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse({
      browseType: "135",
      opDesc: "专家指南详情页-小程序"
    });
    var pages = getCurrentPages(); //页面栈
    if (pages.length == 1) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    if (wx.getStorageSync('nodeManualId')) {
      this.manualId = wx.getStorageSync('nodeManualId');
      wx.removeStorageSync('nodeManualId');
      this.getManualDetail();
      this.getContentList();
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad(option) {
    this.manualId = '';
    this.nodeDetail = {};
    this.contentList = [];
    this.totalNum = '';
    this.doctorId = '';
    this.doctorInfo = {};
    this.isShowInvite = true;
    this.isShowShare = false;
    this.loading = [];
    this.isHidden = false;
    this.isTable = false;
    // // 扫码进来只能拼接 scene 参数，对此做判断
    if (option.scene) {
      if (option.scene.indexOf('_') != -1) {
        this.manualId = option.scene.split('_')[0]; //手册ID
        this.doctorId = option.scene.split('_')[1]; //医生ID
      } else {
        this.manualId = option.scene;
      }
    } else {
      if (option.manualId) {
        this.manualId = option.manualId;
      }
      if (option.shareDoctorId) {
        this.doctorId = option.shareDoctorId;
      }
    }
  },
  mounted: function mounted() {
    if (this.doctorId) {
      this.getDoctorTip();
    }
    this.getManualDetail();
    this.getContentList();
  },

  components: {
    shareNode: __WEBPACK_IMPORTED_MODULE_1__components_shareNode__["a" /* default */],
    normalLoading: __WEBPACK_IMPORTED_MODULE_2_components_loading__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_4_components_backIndex__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_8_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_9_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 1168:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_shareNode_vue__ = __webpack_require__(1170);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_827505c2_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_shareNode_vue__ = __webpack_require__(1171);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1169)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-827505c2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_shareNode_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_827505c2_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_shareNode_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageF/patientNote/components/shareNode.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] shareNode.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-827505c2", Component.options)
  } else {
    hotAPI.reload("data-v-827505c2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1169:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1170:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_canvasCreator_canvasCreator2__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_components_ensure__ = __webpack_require__(24);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




// let getShareTicket='http://10.1.8.5:8080/static/js/jourList4.json';//手册详情--分享接口
var getShareTicket = __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getShareTicket/'; //手册详情--分享接口
/* harmony default export */ __webpack_exports__["a"] = ({
  props: {
    manualId: {
      type: String
    },
    doctorId: {
      type: String
    }
  },
  data: function data() {
    return {
      isshow: false,
      params: {},
      shareImg: '',
      shareMap: {},
      ensureShow: false,
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      }
    };
  },

  name: "share-node",
  methods: {
    closeShare: function closeShare() {
      this.$emit('shareClose', false);
    },
    goToSetting: function goToSetting(e) {
      if (e.mp.detail.errMsg === "openSetting:ok" && e.mp.detail.authSetting['scope.writePhotosAlbum']) {
        this.ensureShow = false;
        this.saveImage();
      } else {
        this.ensureShow = false;
      }
    },
    saveImagePhoto: function saveImagePhoto() {
      var _this = this;
      wx.getSetting({
        success: function success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            //授权成功
            _this.saveImage();
          } else {
            //授权失败
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success: function success(res) {
                //写入成功
                _this.saveImage();
              },
              fail: function fail(err) {
                //写入失败
                wx.showToast({
                  title: '微信授权失败，请重试',
                  icon: 'none'
                });
                _this.ensureShow = true;
              }
            });
          }
        },
        fail: function fail(err) {
          wx.showToast({
            title: '微信授权失败，请重试',
            icon: 'none'
          });
        }
      });
    },
    saveImage: function saveImage() {
      var _this2 = this;

      if (this.shareImg) {
        wx.saveImageToPhotosAlbum({
          filePath: this.shareImg,
          success: function success(res) {
            wx.showModal({
              title: "图片已保存至手机相册",
              content: '快去分享给朋友们吧',
              showCancel: false,
              confirmText: '知道了',
              confirmColor: '#00BEAF'
            });
          },
          fail: function fail() {
            wx.getSetting({
              success: function success(res) {
                if (res.authSetting['scope.writePhotosAlbum']) {
                  _this2.saveImage();
                } else {
                  _this2.ensureShow = true;
                }
              },
              fail: function fail(err) {
                console.log(err);
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: '图片生成失败，请关闭卡片重试',
          icon: 'none',
          duration: 2000
        });
      }
    },
    onCreateSuccess: function onCreateSuccess(e) {
      wx.hideLoading();
      this.shareImg = e;
    },
    onFail: function onFail(e) {
      wx.showToast({
        title: '图片生成失败',
        icon: 'none',
        duration: 2000
      });
    },
    getCanvasMessage: function getCanvasMessage() {
      var _this3 = this;

      var t = this;
      if (!this.shareMap.customerName) {
        this.params = {
          width: 628,
          height: 642,
          backgroundColor: '#fff',
          debug: false,
          texts: [{
            x: 90,
            y: 52,
            baseLine: 'middle',
            text: this.shareMap.manualName ? this.shareMap.manualName : '',
            lineNum: 2,
            fontSize: 38,
            width: 494,
            color: 'white',
            lineHeight: 44,
            zIndex: 1
          }, {
            x: 46,
            y: 212,
            baseLine: 'middle',
            text: "" + (this.shareMap.manualNum > 0 ? this.shareMap.manualNum + '个内容' : ''),
            fontSize: 34,
            width: 532,
            color: '#333333',
            lineHeight: 34,
            fontWeight: 'bold',
            zIndex: 1
          }, {
            x: 48,
            y: 280,
            baseLine: 'middle',
            width: 532,
            text: "" + (this.shareMap.manualNum >= 1 ? '- ' + this.shareMap.educationNameList[0].educationName : ''),
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 48,
            y: 338,
            baseLine: 'middle',
            width: 532,
            text: "" + (this.shareMap.manualNum >= 2 ? '- ' + this.shareMap.educationNameList[1].educationName : ''),
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 48,
            y: 382,
            baseLine: 'middle',
            text: "" + (this.shareMap.manualNum > 2 ? '…' : ''),
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 204,
            y: 520,
            baseLine: 'middle',
            text: '微信中识别小程序码 ',
            fontSize: 26,
            color: '#818181',
            zIndex: 1
          }, {
            x: 204,
            y: 555,
            baseLine: 'middle',
            text: '免费查看所有内容',
            fontSize: 26,
            color: '#818181',
            zIndex: 1
          }],
          images: [{
            width: 628,
            height: 642,
            x: 0,
            y: 0,
            url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_small.png',
            zIndex: 0,
            backgroundColor: '#000000'
          }]
        };
      } else {
        this.params = {
          width: 628,
          height: 862,
          backgroundColor: '#fff',
          debug: false,
          texts: [{
            x: 90,
            y: 52,
            baseLine: 'middle',
            text: this.shareMap.manualName ? this.shareMap.manualName : '',
            lineNum: 2,
            fontSize: 38,
            width: 494,
            color: 'white',
            lineHeight: 44,
            zIndex: 1
          }, {
            x: 46,
            y: 212,
            baseLine: 'middle',
            // text: `${this.shareMap.manualNum}个内容`,
            text: "" + (this.shareMap.manualNum > 0 ? this.shareMap.manualNum + '个内容' : ''),
            fontSize: 34,
            width: 532,
            color: '#333333',
            lineHeight: 34,
            fontWeight: 'bold',
            zIndex: 1
          }, {
            x: 48,
            y: 280,
            width: 532,
            baseLine: 'middle',
            text: "" + (this.shareMap.manualNum >= 1 ? '- ' + this.shareMap.educationNameList[0].educationName : ''),
            // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 48,
            y: 338,
            width: 532,
            baseLine: 'middle',
            text: "" + (this.shareMap.manualNum >= 2 ? '- ' + this.shareMap.educationNameList[1].educationName : ''),
            // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 48,
            y: 382,
            baseLine: 'middle',
            text: "" + (this.shareMap.manualNum > 2 ? '…' : ''),
            fontSize: 32,
            color: '#777777',
            zIndex: 1
          }, {
            x: 44,
            y: 452,
            baseLine: 'middle',
            text: '来自',
            fontSize: 34,
            color: '#333333',
            zIndex: 1
          }, {
            x: 168,
            y: 540,
            baseLine: 'middle',
            width: 404,
            text: "" + (this.shareMap.customerName ? this.shareMap.customerName : ''),
            // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
            fontSize: 32,
            color: '#333333',
            zIndex: 1
          }, {
            x: 168,
            y: 586,
            baseLine: 'middle',
            width: 404,
            text: (this.shareMap.medicalTitle ? this.shareMap.medicalTitle : '') + " " + (this.shareMap.company ? this.shareMap.company : ''),
            // text: `课后思考金风科技发发发积分率高达设计稿i防火防盗`,
            fontSize: 26,
            color: '#888888',
            zIndex: 1
          }, {
            x: 204,
            y: 738,
            baseLine: 'middle',
            text: '微信中识别小程序码 ',
            fontSize: 26,
            color: '#818181',
            zIndex: 1
          }, {
            x: 204,
            y: 770,
            baseLine: 'middle',
            text: '免费查看所有内容',
            fontSize: 26,
            color: '#818181',
            zIndex: 1
          }],
          images: [{
            width: 628,
            height: 862,
            x: 0,
            y: 0,
            url: 'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_big.png',
            zIndex: 0,
            backgroundColor: '#000000'
          }]
        };
      }

      if (this.shareMap.ticketUrl) {
        //有二维码
        //默认有医生二维码位置
        var ticketUrlObj = {
          width: 126,
          height: 126,
          x: 44,
          y: 696,
          url: this.shareMap.ticketUrl,
          // url:'https://m.allinmed.cn/static/image/mp/index/1.1.5/bg_paint_big.png',
          zIndex: 1
        };
        if (!this.shareMap.customerName) {
          //没有医生
          //没有医生二维码位置
          ticketUrlObj = {
            width: 126,
            height: 126,
            x: 44,
            y: 476,
            url: this.shareMap.ticketUrl,
            zIndex: 1
          };
        } else {
          //有医生
          if (this.shareMap.logoUrl) {
            //有医生头像
            this.params.images.push({
              width: 88,
              height: 88,
              x: 64,
              y: 520,
              url: this.shareMap.logoUrl,
              circle: 1,
              zIndex: 1
            });
          }
        }
        //添加二维码
        this.params.images.push(ticketUrlObj);
      }

      t.isshow = true;
      this.$nextTick(function () {
        _this3.$refs.canvas.onCreate();
      });
    },

    //手册详情--分享接口
    getShareMap: function getShareMap() {
      var t = this;
      wx.showLoading({
        title: '加载中'
      });
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: getShareTicket,
        method: 'post',
        data: {
          manualId: t.manualId,
          doctorId: t.doctorId
        },
        timeout: 30000,
        done: function done(response) {
          wx.hideLoading();
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.dataList) {
            var dataList = response.responseObject.responseData.dataList;
            if (dataList.length && __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(dataList[0]) != '{}') {
              t.shareMap = dataList[0];
              t.getCanvasMessage();
            } else {
              t.$emit('shareClose', false);
              wx.showToast({
                title: '分享信息获取失败',
                icon: 'none',
                duration: 2000
              });
            }
          } else {
            t.$emit('shareClose', false);
            wx.showToast({
              title: '分享信息获取失败',
              icon: 'none',
              duration: 2000
            });
          }
        }
      });
    }
  },
  mounted: function mounted() {
    this.getShareMap();
  },

  components: {
    CanvasCreator: __WEBPACK_IMPORTED_MODULE_1_components_canvasCreator_canvasCreator2__["a" /* default */],
    EnsureConfirm: __WEBPACK_IMPORTED_MODULE_3_components_ensure__["a" /* default */]
  }
});

/***/ }),

/***/ 1171:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.isshow) ? _c('section', {
    staticClass: "shareNodeCon"
  }, [(_vm.isshow) ? _c('canvas-creator', {
    ref: "canvas",
    attrs: {
      "params": _vm.params,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "success": _vm.onCreateSuccess,
      "fail": _vm.onFail
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "shareContent"
  }, [_c('i', {
    staticClass: "closeShareCon",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.closeShare
    }
  }), _vm._v(" "), _c('article', {
    staticClass: "shareTitle"
  }, [_c('h2', [_c('i', {
    staticClass: "iconTitle"
  }), _c('span', [_vm._v(_vm._s(_vm.shareMap.manualName))])], 1)], 1), _vm._v(" "), _c('article', {
    staticClass: "shareContainer"
  }, [_c('div', {
    staticClass: "contenList"
  }, [_c('h4', [_vm._v(_vm._s(_vm.shareMap.manualNum > 0 ? (_vm.shareMap.manualNum + '个内容') : ''))]), _vm._v(" "), _c('p', {
    staticClass: "contentItem"
  }, [_vm._v(_vm._s(_vm.shareMap.manualNum >= 1 ? ('- ' + _vm.shareMap.educationNameList[0].educationName) : ''))]), _vm._v(" "), _c('p', {
    staticClass: "contentItem"
  }, [_vm._v(_vm._s(_vm.shareMap.manualNum >= 2 ? ('- ' + _vm.shareMap.educationNameList[1].educationName) : ''))]), _vm._v(" "), (_vm.shareMap.manualNum > 2) ? _c('p', {
    staticClass: "contentItem"
  }, [_vm._v("…")]) : _vm._e()], 1), _vm._v(" "), (_vm.shareMap.customerName) ? _c('div', {
    staticClass: "doctorCon"
  }, [_c('h4', [_vm._v("来自")]), _vm._v(" "), _c('figure', {
    staticClass: "doctorInfo"
  }, [_c('img', {
    attrs: {
      "src": _vm.shareMap.logoUrl
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "doctorDesc"
  }, [_c('p', {
    staticClass: "doctorName"
  }, [_vm._v(_vm._s(_vm.shareMap.customerName))]), _vm._v(" "), _c('p', {
    staticClass: "doctorCom"
  }, [_c('span', {
    staticClass: "doctorMedical"
  }, [_vm._v(_vm._s(_vm.shareMap.medicalTitle))]), _c('span', [_vm._v(_vm._s(_vm.shareMap.company))])])], 1)])], 1) : _vm._e()]), _vm._v(" "), _c('div', {
    staticClass: "shareFoot"
  }, [_c('div', {
    staticClass: "imgContainer"
  }, [_c('img', {
    attrs: {
      "src": _vm.shareMap.ticketUrl
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "wxTipDesc"
  }, [_vm._v("微信中识别小程序码"), _c('br'), _vm._v("免费查看所有内容")], 1)], 1)]), _vm._v(" "), _c('div', {
    staticClass: "saveBtnCon"
  }, [_c('button', {
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.saveImagePhoto
    }
  }, [_vm._v("保存到手机")])], 1)], 1), _vm._v(" "), (_vm.ensureShow) ? _c('EnsureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '3',
      "mpcomid": '1'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e()], 1) : _vm._e()
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-827505c2", esExports)
  }
}

/***/ }),

/***/ 1172:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "patientNoteCon",
    class: {
      'patientHidden': _vm.isHidden, ' patient-table': _vm.isTable
    }
  }, [_c('header', [_c('h1', {
    staticClass: "headerTitle"
  }, [_vm._v(_vm._s(_vm.nodeDetail.manualName))]), _vm._v(" "), (!_vm.isTable) ? _c('p', {
    staticClass: "headerInfo"
  }, [_c('span', {
    staticClass: "headerNum"
  }, [_vm._v(_vm._s(_vm.nodeDetail.totalBrowseNum) + "浏览")])]) : _vm._e()], 1), _vm._v(" "), (!_vm.isTable) ? _c('section', [_c('section', {
    staticClass: "noteContent"
  }, [(_vm.nodeDetail.adaptCrowd) ? _c('article', {
    staticClass: "noteItem"
  }, [_c('h2', {
    staticClass: "itemTitle"
  }, [_c('span', {
    staticClass: "itemMidd"
  }, [_vm._v("适应人群")])]), _vm._v(" "), _c('div', {
    staticClass: "itemDesc"
  }, [_c('p', {
    staticClass: "itemdescCon"
  }, [_vm._v("\n           " + _vm._s(_vm.nodeDetail.adaptCrowd) + "\n         ")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.nodeDetail.expertsSay) ? _c('article', {
    staticClass: "noteItem"
  }, [_c('h2', {
    staticClass: "itemTitle"
  }, [_c('span', {
    staticClass: "itemMidd"
  }, [_vm._v("专家说")])]), _vm._v(" "), _c('div', {
    staticClass: "itemDesc"
  }, [_c('p', {
    staticClass: "itemdescCon"
  }, [_vm._v("\n           " + _vm._s(_vm.nodeDetail.expertsSay) + "\n         ")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.nodeDetail.recommenderList && _vm.nodeDetail.recommenderList.length) ? _c('article', {
    staticClass: "noteItem"
  }, [_c('h2', {
    staticClass: "itemTitle"
  }, [_c('span', {
    staticClass: "itemMidd"
  }, [_vm._v("推荐专家")]), _c('span', {
    staticClass: "doctorTip"
  }, [_vm._v("(点击头像咨询)")])]), _vm._v(" "), _c('ul', {
    staticClass: "itemDesc doctorList"
  }, _vm._l((_vm.nodeDetail.recommenderList), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "doctorItem",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.showWarm(item, 'recommend', index)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.logoUrl
      }
    }), _vm._v(" "), _c('div', {
      staticClass: "doctorInfo"
    }, [_c('p', {
      staticClass: "doctorName"
    }, [_c('span', [_vm._v(_vm._s(item.fullName))])]), _vm._v(" "), _c('p', {
      staticClass: "doctorDesc"
    }, [(item.medicalTitle) ? _c('span', {
      staticClass: "doctorMed"
    }, [_vm._v(_vm._s(item.medicalTitle) + "  ")]) : _vm._e(), _c('span', {
      staticClass: "doctorCom"
    }, [_vm._v(_vm._s(item.hospital))])])], 1)])
  }))], 1) : _vm._e(), _vm._v(" "), (_vm.totalNum) ? _c('article', {
    staticClass: "noteItem"
  }, [_c('h2', {
    staticClass: "itemTitle"
  }, [_c('span', {
    staticClass: "itemMidd"
  }, [_vm._v(_vm._s(_vm.totalNum) + "个内容")])]), _vm._v(" "), _vm._l((_vm.contentList), function(item, index) {
    return _c('figure', {
      key: index,
      staticClass: "contentCon"
    }, [(item.contentTypeName) ? _c('h3', {
      staticClass: "contentTitle"
    }, [_c('span', [_vm._v(_vm._s(item.contentTypeName))])]) : _vm._e(), _vm._v(" "), _c('ul', _vm._l((item.contentList), function(itemC, indexC) {
      return _c('li', {
        key: indexC,
        staticClass: "contentItem",
        class: {
          'itemVideo': itemC.educationContentType == 5, 'itemContentDesc': itemC.educationContentType != 5
        }
      }, [(itemC.educationContentType == 5) ? _c('div', {
        attrs: {
          "eventid": '2-' + index + '-' + indexC
        },
        on: {
          "click": function($event) {
            _vm.gotoVideo(itemC)
          }
        }
      }, [_c('div', {
        staticClass: "videoPic"
      }, [_c('img', {
        attrs: {
          "src": itemC.videoMap.imgUrl
        }
      }), _vm._v(" "), _c('span', {
        staticClass: "iconPlay"
      }), _vm._v(" "), _c('span', {
        staticClass: "timeContaier"
      }, [_vm._v(_vm._s(itemC.playTime))])]), _vm._v(" "), _c('div', {
        staticClass: "videoInfo"
      }, [_c('p', {
        staticClass: "videoTitle"
      }, [_vm._v(_vm._s(itemC.educationName))]), _vm._v(" "), _c('p', {
        staticClass: "repetition"
      }, [_vm._v(_vm._s(itemC.tipsContent))])], 1)]) : _c('div', {
        staticClass: "itemContainer",
        attrs: {
          "eventid": '1-' + index + '-' + indexC
        },
        on: {
          "click": function($event) {
            _vm.gotoNoteDetail(itemC)
          }
        }
      }, [_c('p', {
        staticClass: "itemConTitle"
      }, [_vm._v(_vm._s(itemC.educationName))]), _vm._v(" "), _c('p', {
        staticClass: "itemConDesc"
      }, [_c('span', {
        staticClass: "browseNum"
      }, [_vm._v(_vm._s(itemC.browseNum) + "个浏览")]), _c('span', {
        staticClass: "creatTime"
      }, [_vm._v(_vm._s(itemC.webCreateTime))])])], 1)])
    }))], 1)
  })], 2) : _vm._e()], 1), _vm._v(" "), _c('footer', {
    staticClass: "btnFooter"
  }, [_c('button', {
    staticClass: "shareSend wx-contact-text",
    attrs: {
      "open-type": "share"
    }
  }, [_c('i', {
    staticClass: "iconShare"
  }), _c('span', {
    staticClass: "shareSend"
  }, [_vm._v("转发")])], 1), _vm._v(" "), _c('button', {
    staticClass: "shareBtn wx-contact-text",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": _vm.shareImg
    }
  }, [_c('i', {
    staticClass: "iconShare"
  }), _c('span', {
    staticClass: "shareText"
  }, [_vm._v("分享")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.isTable) ? _c('section', {
    staticClass: "node-nodata"
  }, [_c('figure', {
    staticClass: "nodata-tip"
  }, [_c('img', {
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.7/none_conten.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "tip-text"
  }, [_vm._v("手册内没有内容")])], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.isShowInvite) ? _c('div', {
    staticClass: "doctorInvite",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.showWarm({
          'customerId': _vm.doctorInfo.doctorId,
          'fullName': _vm.doctorInfo.doctorName
        }, 'shareDoctor', 0)
      }
    }
  }, [_c('i', {
    staticClass: "closeDoctor",
    attrs: {
      "eventid": '4'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.closeInvite($event)
      }
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "doctorName"
  }, [_c('span', {
    staticClass: "doctorText"
  }, [_vm._v(_vm._s(_vm.doctorName) + "医生")]), _c('br'), _vm._v("邀您阅读")], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.isShowShare) ? _c('share-node', {
    attrs: {
      "manualId": _vm.manualId,
      "doctorId": _vm.doctorId,
      "eventid": '6',
      "mpcomid": '0'
    },
    on: {
      "shareClose": _vm.shareClose
    }
  }) : _vm._e(), _vm._v(" "), (_vm.loading.length) ? _c('normalLoading', {
    attrs: {
      "mpcomid": '1'
    }
  }) : _vm._e(), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '2'
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '3'
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '4'
    }
  })], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-21e0f110", esExports)
  }
}

/***/ })

},[1309]);