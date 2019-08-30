global.webpackJsonp([42],{

/***/ 454:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMain_vue__ = __webpack_require__(456);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_13b85a54_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMain_vue__ = __webpack_require__(463);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(455)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-13b85a54"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorMain_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_13b85a54_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorMain_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/doctorMain.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorMain.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-13b85a54", Component.options)
  } else {
    hotAPI.reload("data-v-13b85a54", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 455:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 456:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_authorization_authorization__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getBaseMessage__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getEducationList__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_doctorHome_getConsultPrice__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_doctorHome_getConsultStatus__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_getRecureJournal__ = __webpack_require__(161);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_common_js_HttpRequest_getHasInvitedConsult__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_components_healthKnowComponents_healthItem__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_components_recureJournal__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_components_ensure__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_common_js_getPagesParam_getPagesParam__ = __webpack_require__(54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_components_BlackList__ = __webpack_require__(31);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var XHRList = {
  getPersonalProXHR: "/mcall/customer/patent/v1/getMapList/", // 个人简介
  // evaluate: "http://10.1.8.5:8080/static/js/jourList1.json",                                  // 获取患者评价信息
  evaluate: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/tocure/patient/score/getByDoctorId/", // 获取患者评价信息
  getDocMain: "/mcall/customer/auth/v2/getMapById/", //医生信息
  getVisitDetails: "/mcall/customer/advice/setting/v1/getMapById/", //咨询详情
  updateTime: "/mcall/customer/case/consultation/v1/updateFrequency/", //更新次数
  getConsultationId: "/mcall/customer/case/consultation/v1/getConsultationFrequency/", //获取咨询Id
  getCurrentByCustomerId: "/mcall/customer/advice/setting/v1/getCurrentByCustomerId/", //获取剩余人数和状态,
  getVideos: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/comm/data/logo/url/v1/getVideoList/", //获取医生视频
  getDoctorGuide: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorGuide/' // 获取专家指南列表
};
// 接口api


 //医生基本信息 api
 //健康知识信息 api

 //医生基本信息 api
 //康复日记 api
 // 返回首页组件
 //登录检测
 //是否邀请过
// 组件
 //健康知识组件
 //康复日记列表







var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_20_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;


/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      isMoreClick: false, //点击更多评价
      caseId: '',
      caseType: '', // 病例类型
      patientId: '',
      doctorLogo: '',
      authMap: {},
      doctorName: "",
      doctorCustomerId: '',
      medicalTitle: "",
      department: "",
      company: "",
      jobDoctorYear: '', //从医
      expertiseFiled: [], //擅治疾病 标签
      practiceIntroduction: '', //执业介绍
      abilityPatientList: [], //全部评价
      recommendListsLess: '', //健康知识
      recommendLists: '', //健康知识对象
      videoUrl: '', //视频
      docHasVideo: false, //是否有视频  默认false
      isAble: true,
      finish: false,
      params: {
        // 推荐患教参数
        recommendParam: {
          firstResult: 0,
          maxResult: 5,
          refCustomerId: '',
          isValid: 1,
          status: 1,
          sortType: 8,
          educationContentTypeNotIn: "5"
        },
        // 获取医生主页展示视频参数
        getDocVideoParams: {
          refId: '', //string	是
          logoType: 12,
          logoType2: 13,
          firstResult: 0, //	string	是
          maxResult: 999, //string	是
          isValid: 1 //string	是
        }
      },
      generalPrice: '',
      openState: 0, //  接诊开关 0-"" | 1-开诊 | 2-不开诊
      payType: '', // "pay"  "free"
      count: '', //咨询人数
      noStateTextTitle: '',
      noStateText: '',
      inquiryState: '', //1-已开通免费咨询
      from: '', //来源
      ensureShow: false, //授权
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      scrollTop: '',
      showBottom: true,
      showShareBtn: true,
      buttonClicked: true,
      nickName: '', //微信昵称
      confirmShow: false, //沟通中弹层
      type: '',
      currentPage: '',
      source: '', //通过扫码来源
      patientReputationList: [], //v1.1.2 评价list
      patientReputationStatusList: [],
      recureJournalList: [], //康复日记列表
      page: 0,
      loadMoreFlag: true, //避免重复多次触底加载
      toBottom: true,
      clickFlag: true,
      isNoData: false, //康复日记无数据
      backIndexShow: true,
      recommendType: ''
    };
  },
  onUnload: function onUnload() {
    this.clearHisData();
  },
  onLoad: function onLoad(option) {
    var _this2 = this;

    if (option.recommend) {
      //判断是否来自评价页面的专家文章
      this.recommendType = option.recommend;
    } else {
      this.recommendType = '';
    }
    this.applicationType = '12';
    wx.removeStorageSync('reportPatient', true); // 清除患者报道患者的标记
    console.log("-------------onLoad\u533B\u751F\u4E3B\u9875---------------");
    this.clearHisData();
    wx.onNetworkStatusChange(function (res) {
      _this2.finish = false;
      if (res && !!res.isConnected) {} else {}
    });
    var _this = this;
    if (__WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].getItem("isOnWatch")) {
      __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].removeItem("isOnWatch");
      __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].removeItem("isOffLine");
    }
    // 扫码进来只能拼接 scene 参数，对此做判断
    if (option.scene) {
      this.doctorCustomerId = option.scene.split('_')[0]; //医生ID
      this.from = option.scene.split('_')[1]; //医生ID
      //对患教终端二维码中携带的参数qrCode做容错处理
      if (this.from == 'qrCode') {
        this.from = '';
      }
    }
    if (option.doctorCustomerId) {
      this.doctorCustomerId = option.doctorCustomerId; //医生ID
    }
    if (option.caseId) {
      this.caseId = option.caseId;
    }
    if (option.caseType) {
      this.caseType = option.caseType;
    }
    if (option.patientId) {
      this.patientId = option.patientId;
    }
    if (option.orderSourceId) {
      this.orderSourceId = option.orderSourceId;
    }
    if (option.from) {
      this.from = option.from;
    }
    if (option.type) {
      this.type = option.type;
    }
    //扫码来源
    if (option.source) {
      this.source = option.source;
    }
    //获取授权信息
    wx.getSetting({
      success: function success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function success(res) {
              // _this.ensureShare = true;
              _this.nickName = res.userInfo.nickName;
            }
          });
        }
      }
    });
    _this.getRecureJournalOnLoad();
  },
  onShow: function onShow() {
    console.log("-------------\u533B\u751F\u4E3B\u9875onShow---------------");
    this.recommendLists = "";
    this.recommendListsLess = '';
    this.getRecureJournalOnLoad();

    if (wx.getStorageSync('nodeDoctorId')) {
      this.doctorCustomerId = wx.getStorageSync('nodeDoctorId');
      wx.removeStorageSync('nodeDoctorId');
    }

    this.init();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].leaveBrowse();
  },
  onPageScroll: function onPageScroll(e) {
    this.scrollTop = e.scrollTop;
    // console.log(e.scrollTop);
    // if (this.backIndexShow == false && e.scrollTop >=60) {
    //   this.backIndexShow = true;
    // } else if (this.backIndexShow == true && e.scrollTop < 60) {
    //   this.backIndexShow = false;
    // }
  },

  //转发事件
  onShareAppMessage: function onShareAppMessage(res) {
    if (res.from === 'button') {}
    // console.log(res.target)

    // let _path = `/${getCurrentPages()[1].route}`;
    var _path = "/pages/mIndex/mIndex?doctorCustomerId=" + this.doctorCustomerId + "&from=shareFriend&path=/pages/doctorMain/doctorMain";
    var _sharTitle = this.nickName + "\u63A8\u8350>> " + this.authMap.fullName + " " + this.authMap.medicalTitleShow;
    return {
      title: _sharTitle,
      path: _path
    };
  },
  onPullDownRefresh: function onPullDownRefresh() {
    this.getRecureJournal();
  },
  onReachBottom: function onReachBottom() {
    this.loadMore();
  },

  watch: {
    scrollTop: function scrollTop(item, items) {
      if (item < items) {
        //页面上滑分享出现showShareBtn
        this.showBottom = true;
        this.showShareBtn = true;
      } else {
        //页面下滑分享消失showShareBtn
        this.showBottom = false;
        this.showShareBtn = false;
      }
      if (item == 0 || items == 0) {
        this.showShareBtn = true;
      }
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapState(['doctorGuideList']), {
    formatDepartment: function formatDepartment() {
      if (this.department.length > 4) {
        return this.department.substring(0, 4) + "...";
      } else {
        return this.department;
      }
    }
  }),
  methods: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapMutations(["setDoctorMessage", "setDoctorBaseInfo", "setId", 'setDoctorGuideList']), {
    //点击更多评价
    openMoreAbility: function openMoreAbility() {
      this.isMoreClick = true;
    },

    //首次加载清空历史数据
    clearHisData: function clearHisData() {
      this.isMoreClick = false; //更多评价
      this.recureJournalList = []; // 清空康复日记列表
      this.doctorLogo = '';
      this.authMap = {};
      this.doctorName = "";
      this.doctorCustomerId = '';
      this.from = '';
      this.medicalTitle = "";
      this.department = "";
      this.company = "";
      this.jobDoctorYear = ''; //从医
      this.expertiseFiled = []; //擅治疾病 标签
      this.practiceIntroduction = ''; //执业介绍

      this.abilityPatientList = []; //全部评价
      // this.$set(this.abilityPatientList,[]);    //全部评价
      this.patientReputationStatusList = []; //评价展开收起

      this.recommendListsLess = ''; //健康知识
      this.recommendLists = ''; //健康知识对象
      this.isNoData = false;
      this.loadMoreFlag = true;
      this.toBottom = true;
      // this.backIndexShow = false; // 返回首页按钮隐藏
      this.setDoctorGuideList([]);
      this.isNoData = false;
      this.loadMoreFlag = true;
      this.toBottom = true;
    },

    //滚动到专家文章位置
    scollRecommend: function scollRecommend() {
      // doc-healthContent
      var _this = this;
      setTimeout(function () {
        var query = wx.createSelectorQuery();
        //选择
        query.select('#stroke-info').boundingClientRect(function (rect) {
          if (rect.top) {
            wx.pageScrollTo({
              scrollTop: rect.top
            });
          }
        }).exec();
      }, 1000);
    },
    trackCallback: function trackCallback(obj) {
      __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].createTrack({
        actionId: 14149,
        pushMessageId: obj.item.educationId,
        keyword: obj.item.educationName,
        locationId: obj.index
      });
    },

    //初始化
    init: function init() {
      this.finish = true;
      var _this = this;
      // vuex id存储
      this.setId({
        doctorId: _this.doctorCustomerId, //医生ID
        caseId: _this.caseId || '', //病历ID
        patientId: _this.patientId || '', //患者ID
        orderSourceId: _this.orderSourceId || '', //订单来源ID,
        caseType: _this.caseType
      });
      this.getDocInfo();
      this.getRecommendListFn();
      this.getDocVideo();
      this.getDoctorGuideFun();
      _this.getEvaluate();
      _this.getPriceInfo();
    },

    //获取患者评价等同于之前的全部评价
    getEvaluate: function getEvaluate() {
      var _this = this;
      // _this.setDoctorGuideList([]);
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.evaluate,
        method: "post",
        data: {
          doctorId: _this.doctorCustomerId
        },
        done: function done(res) {
          // console.log(res);
          if (res && res.responseObject.responseStatus && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            _this.abilityPatientList = res.responseObject.responseData.dataList;
          } else {

            console.log('获取医生指南列表失败');
          }
        },
        fail: function fail(err) {

          console.log('获取医生指南列表失败');
          console.log(err);
        }
      });
    },

    // 获取医生指南列表
    getDoctorGuideFun: function getDoctorGuideFun() {
      var _this = this;
      // _this.setDoctorGuideList([]);
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getDoctorGuide,
        method: "POST",
        data: {
          customerId: _this.doctorCustomerId, //string	是	用户id
          firstResult: 0, //string	是
          maxResult: 999, //	string	是
          attUseFlag: 15, //	string	是	图片规格1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500
          visitSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId()
        },
        done: function done(res) {
          // console.log(data);
          if (res && res.responseObject.responseStatus && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            _this.setDoctorGuideList(res.responseObject.responseData.dataList);
          } else {
            _this.setDoctorGuideList([]);
            console.log('获取医生指南列表失败');
          }
        },
        fail: function fail(err) {
          // _this.setDoctorGuideList([]);
          console.log('获取医生指南列表失败');
          console.log(err);
        }
      });
    },

    // 患者手册列表
    goPatientNodeDetail: function goPatientNodeDetail(item) {
      var _this3 = this;

      if (!this.clickFlag) return;
      this.clickFlag = false;
      var pagesParam = __WEBPACK_IMPORTED_MODULE_22_common_js_getPagesParam_getPagesParam__["a" /* default */].getPageInfo('patientNote');
      if (pagesParam.hasName) {
        //有相同的
        wx.setStorageSync('nodeManualId', item.manualId);
        wx.navigateBack({
          delta: pagesParam.backNum
        });
        this.clickFlag = true;
      } else {
        wx.getNetworkType({
          success: function success(res) {
            // 返回网络类型, 有效值：
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            var networkType = res.networkType;
            if (networkType === 'none') {
              wx.showToast({
                title: "网络中断，请检查您的网络状态",
                icon: 'none'
              });
              _this3.clickFlag = true;
            } else {
              wx.navigateTo({
                url: "/packageF/patientNote/patientNote?manualId=" + item.manualId,
                success: function success() {
                  _this3.clickFlag = true;
                },
                fail: function fail() {
                  _this3.clickFlag = true;
                }
              });
            }
          }
        });
      }
    },

    // 患教手册列表页
    goPatientNoteList: function goPatientNoteList() {
      wx.navigateTo({
        url: "/pages/doctorMain/patientNoteList"
      });
    },
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    //评价展开收起按钮
    changeBtnStatus: function changeBtnStatus(index) {
      if (this.patientReputationStatusList[index]) {
        this.$set(this.patientReputationStatusList, index, false);
      } else {
        this.$set(this.patientReputationStatusList, index, true);
      }
    },

    // 医生基本信息
    getDocInfo: function getDocInfo() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getBaseMessage__["a" /* default */])({
        "customerId": _this.doctorCustomerId,
        "logoUseFlag": 3
      }).then(function (res) {
        if (res && res.responseData && res.responseData.dataList) {
          var _baseInfoData = res.responseData.dataList[0];
          _this.authMap = _baseInfoData.authMap;
          var medicalTitleText = _this.textCutter(_this.authMap.medicalTitle, "medical");
          _this.doctorLogo = _baseInfoData.logoUrlMap.logoUrl;
          // _this.doctorName = _this.authMap.fullName.length > 4 ? _this.authMap.fullName.substring(0, 4) + "..." : _this.authMap.fullName;
          _this.doctorName = _this.authMap.fullName;
          // _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
          // _this.medicalTitle = medicalTitleText;  //医生学术职称隐藏
          _this.medicalTitle = _this.authMap.medicalTitleShow;
          _this.department = _this.authMap.department || "";
          _this.company = _this.authMap.company || "";
          _this.expertiseFiled = _this.authMap.expertise.split("，");
          _this.practiceIntroduction = _baseInfoData.practiceIntroduction;
          // _this.abilityPatientList = _baseInfoData.abilityPatientList;
          _this.count = _baseInfoData.count;
          _this.jobDoctorYear = _this.authMap.jobDoctorYear >= 5 ? _this.authMap.jobDoctorYear >= 10 ? "\u4ECE\u533B" + _this.authMap.jobDoctorYear + "\u5E74" : "从医5年以上" : "师从名医";
          //评价列表数据处理
          _this.patientReputationList = [];
          _this.abilityPatientList.forEach(function (item, index) {
            _this.patientReputationStatusList.push(true);
            if (item.patientReputation.length > 37) {
              _this.patientReputationList.push(item.patientReputation.substring(0, 37) + '...');
            } else {
              _this.patientReputationList.push(item.patientReputation);
            }
          });
          //页面标题设置
          wx.setNavigationBarTitle({
            title: ""
          });
          _this.setDoctorBaseInfo({
            doctorLogo: _this.doctorLogo,
            doctorName: _this.doctorName,
            medicalTitle: _this.medicalTitle,
            department: _this.department,
            company: _this.company,
            jobDoctorYear: _this.authMap.jobDoctorYear,
            hospitalLevelId: _this.authMap.hospitalLevelId
          });
          _this.setDoctorMessage(_baseInfoData);
        }
        _this.finish = false;
      }).catch(function (err) {
        _this.finish = false;
      });
    },

    /** 获取医生视频 */
    getDocVideo: function getDocVideo() {
      var _this = this;
      _this.params.getDocVideoParams.refId = _this.doctorCustomerId;
      __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].ajax({
        url: XHRList.getVideos,
        method: "POST",
        data: _this.params.getDocVideoParams,
        done: function done(data) {
          // 视频文件
          if (data && data.responseObject && data.responseObject.responseData && data.responseObject.responseData) {
            var _data = data.responseObject.responseData;
            if (_data.data_list != undefined) {
              _data.data_list.forEach(function (item, index) {
                if (item.logoSpec == "13") {
                  _this.videoUrl = item.logoUrl;
                  _this.docHasVideo = true;
                  return;
                }
              });
            } else {
              _this.videoUrl = '';
            }
          } else {
            _this.videoUrl = '';
          }
        },
        fail: function fail(err) {
          console.log(err);
          _this.finish = false;
          _this.videoUrl = '';
        }
      });
    },

    /** 获取健康知识 */
    getRecommendListFn: function getRecommendListFn() {
      var _this = this;
      _this.finish = true;
      _this.params.recommendParam.refCustomerIdSetIn = _this.doctorCustomerId;
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_HttpRequest_getEducationList__["a" /* default */])(_this.params.recommendParam).then(function (res) {
        _this.finish = false;
        if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          _this.recommendLists = res.responseObject.responseData.dataList;
          _this.recommendListsLess = _this.recommendLists.concat([]).splice(0, 2);
          _this.$nextTick(function () {
            if (_this.recommendType) {
              _this.scollRecommend();
            }
          });
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    // 手术康复日记数据
    getRecureJournalOnLoad: function getRecureJournalOnLoad() {
      var _this4 = this;

      var _this = this;
      // wx.showLoading({
      //   title: "正在加载..."
      // });
      Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_getRecureJournal__["a" /* default */])({
        isValid: 1,
        sortType: 2,
        visitSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId(),
        firstResult: 0,
        maxResult: 20 * (this.page + 1),
        imgUseFlag: 2,
        propertyId: '',
        attendCustomerId: _this.doctorCustomerId //doctorID
      }).then(function (res) {
        wx.stopPullDownRefresh();
        if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
          var dataList = res.responseObject.responseData.dataList;
          for (var i = 0; i < dataList.length; i++) {
            dataList[i].patientAgeShow = _this4.getAge(dataList[i].patientAge);
          }
          _this4.recureJournalList = dataList;
          // wx.hideLoading();
        } else {
          _this4.loadMoreFlag = false;
          _this4.finish = false;
          _this4.toBottom = false;
          _this4.isNoData = true;
          // wx.hideLoading();
        }
      });
    },
    getAge: function getAge(num) {
      var firstNum = parseInt(num / 10);
      var twoNum = num % 10;
      if (firstNum) {
        if (twoNum <= 5) {
          if (twoNum == 0) {
            if (firstNum == 1) {
              return num + "\u5C81";
            } else {
              return firstNum - 1 + "5\u5C81\u4EE5\u4E0A";
            }
          } else {
            return firstNum + "0\u5C81\u4EE5\u4E0A";
          }
        } else {
          return firstNum + "5\u5C81\u4EE5\u4E0A";
        }
      } else {
        return twoNum + "\u5C81";
      }
    },
    loadMore: function loadMore() {
      var _this5 = this;

      var _this = this;
      if (this.loadMoreFlag) {
        this.finish = true;
        var result = this.page += 1;
        Object(__WEBPACK_IMPORTED_MODULE_11_common_js_HttpRequest_getRecureJournal__["a" /* default */])({
          isValid: 1,
          sortType: 2,
          visitSiteId: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getSiteId(),
          firstResult: result * 20,
          maxResult: 20,
          imgUseFlag: 2,
          propertyId: '',
          attendCustomerId: _this.doctorCustomerId //doctorID
        }).then(function (res) {
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            var dataList = res.responseObject.responseData.dataList;
            for (var i = 0; i < dataList.length; i++) {
              dataList[i].patientAgeShow = _this5.getAge(dataList[i].patientAge);
            }
            _this5.finish = false;
            _this5.recureJournalList = _this5.recureJournalList.concat(dataList);
          } else {
            _this5.finish = false;
            _this5.toBottom = false;
            _this5.loadMoreFlag = false;
          }
        });
      }
    },

    // 康复日记详情
    jumpToDiary: function jumpToDiary(e) {
      if (!this.clickFlag) return false;
      this.clickFlag = false;
      this.pathObj = {
        path: "diary",
        obj: e.obj
      };
      if (e.desc) {
        this.ensureShow = false;
        this.clickFlag = true;
        var _currenRout = false;
        var _currentPages = getCurrentPages();
        _currentPages.forEach(function (item, index) {
          if (item.route.indexOf('packageF/journalDetail/journalDetail') > -1) {
            _currenRout = true; //历史栈有康复日记详情页  清空历史栈
          }
        });
        if (_currenRout) {
          wx.reLaunch({
            url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId + "&from=doctorHome"
          });
        } else {
          wx.navigateTo({
            url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId + "&from=doctorHome"
          });
        }
        // wx.navigateTo({
        //   url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
        // });
        // wx.navigateTo({
        //   url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
        // });
        // miniLogin({
        //   successCallBack: (res) => {
        //   },
        //   failCallBack: (err) => {
        //   }
        // });
      } else {
        this.clickFlag = true;
        this.ensureShow = true;
      }
    },

    // 埋点？不详
    rjTrack: function rjTrack(obj) {
      __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].createTrack({
        actionId: 14124,
        pushMessageId: obj.item.diaryId,
        keyword: obj.item.diaryName
      });
    },
    textCutter: function textCutter(str, type) {
      var strNew = "";
      if (str.includes(",")) {
        str.split(",").forEach(function (element) {
          if (element.length === 0) {
            strNew += "";
          } else {
            if (element.includes("_")) {
              if (type == "medical") {
                strNew += element.split("_")[1] + " ";
              } else {
                strNew += element.split("_")[1] + "，";
              }
            } else {
              if (type == "medical") {
                strNew += element + " ";
              } else {
                strNew += element + "，";
              }
            }
          }
        });
        return strNew.substring(0, strNew.length - 1);
      } else if (str.includes("_")) {
        strNew += str.split("_")[1];
        return strNew;
      } else {
        strNew += str;
        return strNew;
      }
    },
    playVideoFn: function playVideoFn(item) {
      var _this = this;
      if (!_this.videoUrl.length > 0) {
        return false;
      }
      _this.getNetworkType(function (type) {
        if (type == "wifi") {
          _this.goNavigateTo(item);
        } else {
          wx.showModal({
            // title: '您正在使用非WIFI网络，播放将消耗流量',
            content: '您正在使用非WIFI网络，播放将消耗流量',
            confirmText: '继续播放',
            confirmColor: '#00BEAF',
            success: function success(res) {
              if (res.confirm) {
                _this.goNavigateTo(item);
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          });
        }
      });
    },

    // 咨询价格
    getPriceInfo: function getPriceInfo() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_doctorHome_getConsultPrice__["a" /* default */])({
        customerId: _this.doctorCustomerId
      }).then(function (res) {
        if (res && res.responseData && res.responseData.dataList) {
          var _dataList = res.responseData.dataList[0];
          var _generalPrice = _dataList.generalPrice; // 图文咨询 (老接口普通咨询价格)
          _this.inquiryState = _dataList.generalChargeMode; //  1-已开通免费咨询
          if (!__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer___default()(parseFloat(_generalPrice))) {
            _this.generalPrice = parseFloat(_generalPrice);
          } else {
            _this.generalPrice = parseFloat(_generalPrice).toFixed(0);
          }
          // 获取咨询状态 然后处理数据
          if (parseFloat(_this.generalPrice) >= 0) {
            _this.finish = true;
            Object(__WEBPACK_IMPORTED_MODULE_10_common_js_doctorHome_getConsultStatus__["a" /* default */])({
              customerId: _this.doctorCustomerId,
              caseId: _this.caseId,
              patientId: _this.patientId, //患者ID
              orderType: 1,
              orderSourceType: 0,
              sortType: 2
            }).then(function (data) {
              _this.footerLeftShow = true;
              _this.finish = false;
              var _isFree = data.isFree;
              var _state = data.state;
              //是否开启免费咨询
              if (_dataList.state == 0) {
                _this.openState = 2;
                __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].enterBrowse({
                  browseType: "131",
                  opDesc: "医生主页-未开诊（小程序）"
                });
              } else {
                _this.openState = 1;
                __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].enterBrowse({
                  browseType: "88",
                  opDesc: "医生主页（小程序）"
                });
              }
              if (_this.inquiryState == 1) {
                //是否使用过免费咨询
                if (_isFree == 0) {
                  //试用过
                  _this.payType = "pay";
                } else {
                  //未使用
                  _this.payType = "free";
                }
              } else {
                //未开启免费咨询
                _this.payType = "pay";
              }
            }).catch(function (err) {
              console.log(err);
            });
          }
        }
      }).catch(function (err) {
        console.log(err);
      });
    },

    /** 去咨询按钮 */
    goConsultFn: function goConsultFn() {
      var _this6 = this;

      var _this = this;
      __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].createTrack({
        actionId: 14147,
        pushMessageId: _this.doctorCustomerId
      });
      Object(__WEBPACK_IMPORTED_MODULE_10_common_js_doctorHome_getConsultStatus__["a" /* default */])({
        customerId: _this.doctorCustomerId,
        caseId: _this.caseId,
        patientId: _this.patientId, //患者ID
        orderType: 1,
        orderSourceType: 0,
        sortType: 2
      }).then(function (data) {
        var _isFree = data.isFree; //是否使用过免费咨询（0-使用过1-未使用过）
        var _state = data.state;
        var _remainNum = data.remainNum; //剩余咨询人数 （-1为医生设置无限次接诊）
        var _conState = data.conState; //0-无沟通中数据 1-有
        if (_state == 1) {
          //开启咨询
          if (_conState == 1 && _this.from == 'imScene') {
            _this.confirmShow = true;
          } else {
            if (_remainNum !== 0) {
              _this6.applicationType = '12';
              //_remainNum!==0 (-1次数无限)
              //剩余人数>0
              if (_remainNum > 0 || _remainNum == -1) {
                _this.showNotConsult(); //去咨询流程
              } else {
                _this.noStateTextTitle = "";
                _this.noStateText = "抱歉，该医生今天已经没有咨询名额了";
                _this.showToastFn({
                  contentTitle: _this.noStateTextTitle,
                  content: _this.noStateText,
                  showCancel: false,
                  confirmText: '我知道了'
                });
              }
            } else {
              _this6.applicationType = '13';
              //无剩余名额
              _this.noStateTextTitle = "";
              _this.noStateText = "抱歉，该医生今天已经没有咨询名额了";
              _this.showToastFn({
                contentTitle: _this.noStateTextTitle,
                content: _this.noStateText,
                showCancel: false,
                confirmText: '我知道了'
              });
            }
          }
        } else {
          //未开启咨询
          _this.noStateText = "医生关闭了今天的咨询服务，暂不能为您提供帮助";
          _this.noStateTextTitle = "今日暂不接诊";
          _this.showToastFn({
            contentTitle: _this.noStateTextTitle,
            content: _this.noStateText,
            showCancel: false,
            confirmText: '我知道了'
          });
        }
      }).catch(function (err) {
        console.log(err);
      });
    },
    toImPage: function toImPage() {
      var _this = this;
      _this.confirmShow = false;
      if (getCurrentPages().length >= 4) {
        __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].setItem('backIndex', true);
        wx.reLaunch({
          url: "/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=" + _this.doctorCustomerId + "&patientId=" + _this.patientId + "&caseId=" + _this.caseId
        });
      } else {
        wx.navigateTo({
          url: "/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=" + _this.doctorCustomerId + "&patientId=" + _this.patientId + "&caseId=" + _this.caseId
        });
      }
    },

    /** 邀请医生开诊 */
    inviteConsultFn: function inviteConsultFn() {
      var _this7 = this;

      var _this = this;
      this.finish = true;
      __WEBPACK_IMPORTED_MODULE_21_dataLog__["a" /* default */].createTrack({
        actionId: 14148,
        pushMessageId: _this.doctorCustomerId
      });
      Object(__WEBPACK_IMPORTED_MODULE_13_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            // 已登录...
            Object(__WEBPACK_IMPORTED_MODULE_14_common_js_HttpRequest_getHasInvitedConsult__["a" /* default */])({
              customerId: _this.doctorCustomerId, //	string	是	医生id
              patientCustomerId: __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].getItem("userId") || '', //string	是	患者所属用户id
              openid: __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].getItem("openId") || "", // string	是	渠道唯一id
              uuid: __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].getItem('unionId') || "" // string	是	联合id（用来关联其他平台）
            }).then(function (data) {
              _this7.finish = false;
              if (data.responseObject.responseStatus) {
                if (data.responseObject.responseMessage == "NO DATA") {
                  //未邀请过
                  wx.navigateTo({
                    url: "/pages/doctorMain/inviteContent?from=" + _this7.from
                  });
                } else {
                  //已邀请过
                  _this7.toastFn("您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。");
                }
              } else {
                console.log('获取是否邀请过医生开诊失败');
              }
            }).catch(function (err) {
              console.log(err);
            });
          } else {
            _this7.finish = false;
            wx.navigateTo({
              url: "/pages/doctorMain/inviteContent?from=" + _this7.from
            });
          }
        }
      });
    },

    /** 查看更多授权 */
    doctorMoreFn: function doctorMoreFn(e) {
      this.navigateTo = "doctorMore";
      if (e.target.userInfo) {
        this.goNavigateTo("doctorMore");
      } else {
        console.log("拒绝授权");
        this.ensureShow = true;
      }
    },

    /** 去咨询授权 */
    authorizeFn: function authorizeFn(e) {
      var _this8 = this;

      var _this = this;
      _this.navigateTo = "";
      _this.buttonClickedFn();
      if (e.target.userInfo && !_this.buttonClicked) {
        if (this.openState == 1) {
          this.finish = true;
          Object(__WEBPACK_IMPORTED_MODULE_13_common_js_miniUtil_miniLogin__["a" /* default */])({
            successCallBack: function successCallBack(res) {
              _this8.finish = false;
              if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                // 已登录...
                _this8.goConsultFn();
              } else {
                _this8.goConsultFn();
              }
            }
          });
        } else {
          this.inviteConsultFn();
        }
      } else {
        console.log("拒绝授权");
        this.ensureShow = true;
      }
    },

    // 去我的页面
    goPersonal: function goPersonal(e) {
      this.navigateTo = 'personal';
      if (e.target.userInfo) {
        //已授权...
        wx.navigateTo({
          url: '/pages/personal/personal'
        });
      } else {
        console.log("拒绝授权");
        this.ensureShow = true;
      }
    },
    buttonClickedFn: function buttonClickedFn() {
      var _this = this;
      this.buttonClicked = false;
      setTimeout(function () {
        this.buttonClicked = true;
      }, 500);
    },
    goNavigateTo: function goNavigateTo(item) {
      // console.log(item)
      var _url = "",
          _this = this;
      switch (item) {
        case "video":
          _url = "/packageA/videoPlayer/videoPlayer?videoUrl=" + _this.videoUrl;
          break;
        case "doctorMore":
          if (_this.source && _this.source == 'qrCode') {
            _url = "/pages/doctorMain/doctorInfoMore?source=qrCode&&from=" + _this.from;
          } else {
            _url = "/pages/doctorMain/doctorInfoMore?from=" + _this.from + "&&applicationType=" + _this.applicationType;
          }
          break;
        case "health":
          _url = "/pages/healthKnowledge/healthKnowledge?doctorCustomerId=" + _this.doctorCustomerId;
          break;
        case "healthDetail":
          _url = "/pages/healthKnowledgeDetail/healthKnowledgeDetail";
          break;
        case "personal":
          _url = "/pages/personal/personal";
          break;
      }
      wx.navigateTo({
        url: _url
      });
    },
    goToSetting: function goToSetting(e) {
      var _this = this;
      // console.log(e.mp.detail.errMsg)
      if (e.mp.detail.errMsg === "openSetting:ok") {
        //获取授权信息
        wx.getSetting({
          success: function success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              _this.ensureShow = false;
              if (_this.navigateTo !== "") {
                _this.goNavigateTo(_this.navigateTo);
              } else {
                if (_this.openState == 1) {
                  _this.goConsultFn();
                } else {
                  _this.inviteConsultFn();
                }
              }
            } else {
              _this.ensureShow = true;
              setTimeout(function () {
                _this.ensureShow = false;
              }, 2000);
            }
          }
        });
      } else {
        _this.ensureShow = true;
        setTimeout(function () {
          _this.ensureShow = false;
        }, 2000);
      }
    },

    /** 网络类型判断 */
    getNetworkType: function getNetworkType(param) {
      wx.getNetworkType({
        success: function success(res) {
          // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
          param(res.networkType);
        }
      });
    },

    /** 咨询跳页判断 */
    showNotConsult: function showNotConsult() {
      var _this = this;
      var data = {
        applicationType: this.applicationType,
        doctorId: this.doctorCustomerId,
        doctorName: this.doctorName
      };
      if (_this.source && _this.source == 'qrCode') {
        data.source = 'qrCode';
      }

      __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].removeItem("redirect");
      if (_this.from == '' || _this.from == "find" || _this.from == "share" || _this.from == "journal" || _this.from == "AI" || _this.from == "patientNote") {
        if (getCurrentPages().length >= 4) {
          wx.reLaunch({
            url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
          });
        } else {
          wx.navigateTo({
            url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
          });
        }
      } else if (_this.from == 'imSceneDoctor') {
        wx.navigateBack();
      } else {
        console.log("正常路程咨询");
        wx.removeStorageSync("PCIMLinks");
        if (getCurrentPages().length >= 4) {
          __WEBPACK_IMPORTED_MODULE_5_localStorage__["a" /* default */].setItem('backIndex', true);
          wx.reLaunch({
            url: '/pages/doctorMain/doctorMainAffirmOrder'
          });
        } else {
          wx.navigateTo({
            url: '/pages/doctorMain/doctorMainAffirmOrder'
          });
        }
      }
    },

    /** toast提示 */
    toastFn: function toastFn(param) {
      wx.showToast({
        title: param,
        icon: 'none',
        duration: 2000
      });
    },
    showToastFn: function showToastFn(param) {
      var _this = this;
      wx.showModal({
        title: param.contentTitle || '',
        content: param.content || '',
        showCancel: param.showCancel,
        confirmText: param.confirmText || '确定',
        success: function success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    }
  }),
  components: {
    healthItem: __WEBPACK_IMPORTED_MODULE_15_components_healthKnowComponents_healthItem__["a" /* default */],
    NormalLoading: __WEBPACK_IMPORTED_MODULE_18_components_loading__["a" /* default */],
    ensureConfirm: __WEBPACK_IMPORTED_MODULE_17_components_ensure__["a" /* default */],
    recureJournal: __WEBPACK_IMPORTED_MODULE_16_components_recureJournal__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_19_components_confirm__["a" /* default */],
    BackIndex: __WEBPACK_IMPORTED_MODULE_12_components_backIndex__["a" /* default */],
    BlackList: __WEBPACK_IMPORTED_MODULE_23_components_BlackList__["a" /* default */],
    authorization: __WEBPACK_IMPORTED_MODULE_4_components_authorization_authorization__["a" /* default */]
  }
});

/***/ }),

/***/ 463:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "doctorHome-main"
  }, [_c('section', {
    staticClass: "doc-topInfo"
  }, [_c('section', {
    staticClass: "doc-name-big"
  }, [_vm._v(_vm._s(_vm.doctorName) + "医生")]), _vm._v(" "), _c('section', {
    staticClass: "top-left",
    class: {
      'no-background': !_vm.videoUrl.length > 0
    },
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.playVideoFn('video')
      }
    }
  }, [(_vm.videoUrl.length > 0) ? _c('section', {
    staticClass: "doc-playVideo"
  }) : _vm._e(), _vm._v(" "), _c('img', {
    attrs: {
      "src": _vm.doctorLogo,
      "alt": ""
    }
  })], 1), _vm._v(" "), _c('section', {
    staticClass: "top-right"
  }, [_c('section', [_c('span', {
    staticClass: "doc-medical"
  }, [_vm._v(_vm._s(_vm.medicalTitle))]), (false) ? _c('span', {
    staticClass: "doc-degree"
  }, [_vm._v(_vm._s(_vm.formatDepartment))]) : _vm._e()]), _vm._v(" "), _c('section', {
    staticClass: "doc-right-content2"
  }, [_c('span', {
    staticClass: "doc-hospitallName"
  }, [_vm._v(_vm._s(_vm.company))])]), _vm._v(" "), (_vm.authMap.hospitalLevelId == 1) ? _c('span', {
    staticClass: "doc-hospitalGrade"
  }, [_vm._v("三甲")]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-cureTime"
  }, [_vm._v(_vm._s(_vm.jobDoctorYear))])], 1)], 1), _vm._v(" "), (_vm.expertiseFiled.length > 0) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("擅治疾病")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent"
  }, _vm._l((_vm.expertiseFiled), function(item, index) {
    return _c('span', {
      key: index,
      staticClass: "doc-goodTips"
    }, [_vm._v(_vm._s(item))])
  }))], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-listComm doc-practice"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("执业简介"), _c('button', {
    staticClass: "doc-infoMore",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '1'
    },
    on: {
      "getuserinfo": _vm.doctorMoreFn
    }
  }, [_vm._v("更多")])], 1), _vm._v(" "), (_vm.practiceIntroduction.length > 0) ? _c('section', {
    staticClass: "doc-listContent"
  }, [_vm._v(_vm._s(_vm.practiceIntroduction))]) : _vm._e()], 1), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.abilityPatientList.length > 0),
      expression: "abilityPatientList.length>0"
    }],
    staticClass: "doc-listComm allSuggestion"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("全部评价")]), _vm._v(" "), _vm._l((_vm.abilityPatientList), function(item, index) {
    return (_vm.isMoreClick || ((!_vm.isMoreClick) && index < 5)) ? _c('section', {
      key: index,
      staticClass: "doc-listContent doc-listContent-tag"
    }, [_c('section', {
      staticClass: "doc-evaluateTitle"
    }, [_c('img', {
      attrs: {
        "src": item.patientLogo,
        "alt": ""
      }
    }), _vm._v(" "), _c('section', {
      staticClass: "doc-evalUserName"
    }, [_vm._v(_vm._s(item.patientName))])], 1), _vm._v(" "), _c('section', {
      staticClass: "doc-evaluateContent"
    }, [(item.tag) ? _c('p', {
      staticClass: "doc-evaluate-tag"
    }, [_vm._v(_vm._s(item.tag))]) : _vm._e(), _vm._v(" "), (item.patientReputation) ? _c('p', {
      staticClass: "doc-evaluate-text",
      class: {
        'doc-evaluate-top': item.tag
      }
    }, [_vm._v(_vm._s('“' + item.patientReputation + '”'))]) : _vm._e(), _vm._v(" "), ((!item.patientReputation) && (!item.tag)) ? _c('p', {
      staticClass: "doc-evaluate-text"
    }, [_vm._v("“该用户给出好评，对医生非常满意”")]) : _vm._e(), _vm._v(" "), _c('span', {
      staticClass: "circle"
    })], 1)], 1) : _vm._e()
  }), _vm._v(" "), (_vm.abilityPatientList.length > 5 && (!_vm.isMoreClick)) ? _c('section', {
    staticClass: "more-reputation",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.openMoreAbility
    }
  }, [_vm._v("更多评价")]) : _vm._e()], 2), _vm._v(" "), (_vm.doctorGuideList && _vm.doctorGuideList.length > 0) ? _c('section', {
    staticClass: "doc-border-hightLine"
  }) : _vm._e(), _vm._v(" "), (_vm.doctorGuideList.length) ? _c('section', {
    staticClass: "doc-listComm doc-guide"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("专家指南"), (_vm.doctorGuideList.length > 2) ? _c('span', {
    staticClass: "doc-infoMore",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.goPatientNoteList()
      }
    }
  }, [_vm._v("更多")]) : _vm._e()]), _vm._v(" "), _c('ul', {
    staticClass: "doc-guide-list"
  }, _vm._l((_vm.doctorGuideList), function(item, index) {
    return (index < 2) ? _c('li', {
      key: index,
      staticClass: "doc-guide-item",
      attrs: {
        "eventid": '4-' + index
      },
      on: {
        "click": function($event) {
          _vm.goPatientNodeDetail(item)
        }
      }
    }, [_c('div', {
      staticClass: "doc-guide-left"
    }, [_c('img', {
      staticClass: "node-img",
      attrs: {
        "src": item.coverUrl,
        "alt": "图片加载失败"
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "doc-guide-middle"
    }, [_c('h3', {
      staticClass: "guide-title"
    }, [_vm._v(_vm._s(item.manualName))]), _vm._v(" "), _c('p', {
      staticClass: "guide-content"
    }, [_vm._v("共" + _vm._s(item.articleNum) + "篇")])], 1), _vm._v(" "), _c('div', {
      staticClass: "doc-guide-right"
    })]) : _vm._e()
  }))], 1) : _vm._e(), _vm._v(" "), (_vm.recommendLists && _vm.recommendLists.length > 0) ? _c('section', {
    staticClass: "doc-border-hightLine"
  }) : _vm._e(), _vm._v(" "), (_vm.recommendLists && _vm.recommendLists.length > 0) ? _c('section', {
    staticClass: "doc-listComm doc-healthContent",
    attrs: {
      "id": "stroke-info"
    }
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("专家文章"), (_vm.recommendLists && _vm.recommendLists.length > 2) ? _c('span', {
    staticClass: "doc-infoMore",
    attrs: {
      "eventid": '5'
    },
    on: {
      "click": function($event) {
        _vm.goNavigateTo('health')
      }
    }
  }, [_vm._v("更多")]) : _vm._e()]), _vm._v(" "), _c('healthItem', {
    attrs: {
      "from": "doctorMain",
      "healthLists": _vm.recommendListsLess,
      "eventid": '6',
      "mpcomid": '0'
    },
    on: {
      "clickCallback": _vm.trackCallback
    }
  })], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-border-hightLine"
  }), _vm._v(" "), _c('figure', {
    staticClass: "doctorMainHistory"
  }, [_c('header', {
    class: {
      'padding-bottom': _vm.recureJournalList.length
    }
  }, [_c('h3', {
    staticClass: "journalTitle"
  }, [_vm._v("手术康复日记")]), _vm._v(" "), (_vm.recureJournalList.length) ? _c('button', {
    staticClass: "addJournal",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '7'
    },
    on: {
      "getuserinfo": _vm.goPersonal
    }
  }, [_c('img', {
    staticClass: "addIcon",
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/write.png"
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "addText"
  }, [_vm._v("我也要写")])]) : _vm._e()], 1), _vm._v(" "), (_vm.recureJournalList.length) ? [_c('recureJournal', {
    attrs: {
      "journalData": _vm.recureJournalList,
      "eventid": '8',
      "mpcomid": '1'
    },
    on: {
      "FromChild": _vm.jumpToDiary,
      "clickCallback": _vm.rjTrack
    }
  }), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.recureJournalList.length > 0),
      expression: "recureJournalList.length>0"
    }],
    staticClass: "extraLine"
  }, [_vm._v(_vm._s(_vm.toBottom ? '正在加载..' : '--到底了--'))])] : _vm._e(), _vm._v(" "), (!_vm.recureJournalList.length) ? _c('button', {
    staticClass: "goJournal",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '9'
    },
    on: {
      "getuserinfo": _vm.goPersonal
    }
  }, [_c('span', {
    staticClass: "space"
  }), _vm._v(" "), _c('section', {
    staticClass: "out-box"
  }, [_c('img', {
    staticClass: "goIcon",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/1.1.4/add-blue.jpg",
      "alt": ""
    }
  }), _vm._v(" "), _c('span', {
    staticClass: "goText"
  }, [_vm._v("写我的手术康复日记")])])], 1) : _vm._e()], 2), _vm._v(" "), (_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '3'
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-goConsult"
  }, [(_vm.showShareBtn) ? _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '10'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "shareBtn wx-contact-text",
    attrs: {
      "open-type": "share",
      "type": "submit",
      "formType": "submit"
    }
  }, [_c('span', [_vm._v("分享")])])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: ((_vm.authMap.state != 8 || _vm.openState == 2) && _vm.showBottom),
      expression: "(authMap.state!=8||openState==2)&&showBottom"
    }],
    staticClass: "invite-consult"
  }, [_c('p', [_vm._v("\n      医生暂不在线，点击[预约咨询]医生助理会为您联系医生，并在医生上线后第一时间通知您。")])], 1), _vm._v(" "), _c('section', {
    staticClass: "doc-go-left"
  }, [_c('p', {
    staticClass: "doc-goLone"
  }, [(_vm.authMap.state == 8 && _vm.openState == 1 && _vm.inquiryState > 0 && _vm.payType == 'free') ? _c('span', {
    staticClass: "doc-goFreeText",
    class: {
      'notOnline': _vm.authMap.state != 8 || _vm.openState == 2
    }
  }, [_vm._v(_vm._s((_vm.authMap.state == 8 && _vm.openState == 1) ? "前3次回复免费" : "暂不在线"))]) : _vm._e(), _vm._v(" "), (_vm.authMap.state != 8 || _vm.openState == 2) ? _c('span', {
    staticClass: "doc-goFreeText",
    class: {
      'notOnline': _vm.authMap.state != 8 || _vm.openState == 2
    }
  }, [_vm._v(_vm._s((_vm.authMap.state == 8 && _vm.openState == 1) ? "前3次回复免费" : "暂不在线"))]) : _vm._e(), _vm._v(" "), (_vm.authMap.state == 8 && _vm.openState == 1) ? _c('span', {
    staticClass: "doc-goPrice",
    class: {
      'charge': _vm.payType !== 'free'
    }
  }, [_vm._v("¥" + _vm._s(_vm.generalPrice) + " "), (_vm.payType == 'free') ? _c('span', {
    staticClass: "doc-priceIcon"
  }) : _vm._e()]) : _vm._e()]), _vm._v(" "), _c('p', {
    staticClass: "doc-goLTwo"
  }, [_vm._v("已有"), _c('span', {
    staticClass: "doc-goNum"
  }, [_vm._v(_vm._s(_vm.count))]), _vm._v("人咨询过")])], 1), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '13'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.authMap.state == 8 && _vm.openState == 1) ? _c('button', {
    staticClass: "doc-go-right",
    attrs: {
      "open-type": "getUserInfo",
      "formType": "submit",
      "eventid": '11'
    },
    on: {
      "getuserinfo": _vm.authorizeFn
    }
  }, [_vm._v("去咨询\n      ")]) : _vm._e(), _vm._v(" "), (_vm.authMap.state != 8 || _vm.openState == 2) ? _c('button', {
    staticClass: "doc-go-right",
    attrs: {
      "open-type": "getUserInfo",
      "formType": "submit",
      "eventid": '12'
    },
    on: {
      "getuserinfo": _vm.authorizeFn
    }
  }, [_vm._v("预约咨询\n      ")]) : _vm._e()], 1)], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '14',
      "mpcomid": '4'
    },
    on: {
      "ensureClickEvent": _vm.goToSetting
    }
  }) : _vm._e(), _vm._v(" "), (_vm.confirmShow) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '去沟通',
        'cancel': '取消',
        'title': '您与该医生有正在进行中的咨询，现在继续去沟通吗？'
      },
      "eventid": '15',
      "mpcomid": '5'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.confirmShow = false
      },
      "ensureClickEvent": _vm.toImPage
    }
  }) : _vm._e(), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "from": 'doctorMain',
      "mpcomid": '6'
    }
  }) : _vm._e(), _vm._v(" "), _c('BlackList', {
    attrs: {
      "mpcomid": '7'
    }
  }), _vm._v(" "), _c('authorization', {
    attrs: {
      "mpcomid": '8'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-13b85a54", esExports)
  }
}

/***/ })

},[1223]);