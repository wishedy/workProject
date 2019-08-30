global.webpackJsonp([43],{

/***/ 464:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorInfoMore_vue__ = __webpack_require__(466);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_946ab984_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorInfoMore_vue__ = __webpack_require__(467);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(465)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-946ab984"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_doctorInfoMore_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_946ab984_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_doctorInfoMore_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/pages/doctorMain/doctorInfoMore.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] doctorInfoMore.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-946ab984", Component.options)
  } else {
    hotAPI.reload("data-v-946ab984", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 465:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 466:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer__ = __webpack_require__(166);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_common_js_doctorHome_getBaseMessage__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getConsultPrice__ = __webpack_require__(167);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_common_js_doctorHome_getConsultStatus__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_miniLogin__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getHasInvitedConsult__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_components_loading__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_dataLog__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_components_confirm__ = __webpack_require__(15);



//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





var _createNamespacedHelp = Object(__WEBPACK_IMPORTED_MODULE_5_vuex__["a" /* createNamespacedHelpers */])('doctorMain'),
    mapMutations = _createNamespacedHelp.mapMutations,
    mapGetters = _createNamespacedHelp.mapGetters,
    mapActions = _createNamespacedHelp.mapActions,
    mapState = _createNamespacedHelp.mapState;

 //医生基本信息 api
 //获取咨询价格
 //医生基本信息 api
 //检测登录
 //是否邀请过



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      finish: false,
      ensureShare: false,
      nickName: '', //用户微信昵称
      showHonier: false,
      showAcademic: false,
      authMap: {},
      achievement: '',
      doctorLogo: '',
      doctorName: "",
      doctorCustomerId: '',
      showShareBtn: true,
      medicalTitle: "",
      department: "",
      company: "",
      jobDoctorYear: '',
      expertise: '',
      honor: [],
      honorLess: '',
      honorMore: false, // 获得荣誉是否显示更多显示更多还是收起
      academic: "", // 执业成就详情全部字段
      academicLess: "", // 学术能力详情少数字段
      academicMoreShow: false, // 学术能力是否显示更多
      academicMore: false, // 学术能力是否显示更多显示更多还是收起
      work: [], // 社会任职全部字段
      workLess: "", // 社会任职详情少数字段
      workMoreShow: false, // 社会任职是否显示更多
      workMore: false, // 社会任职是否显示更多显示更多还是收起
      generalPrice: '',
      inquiryState: '', //1-已开通免费咨询
      footerLeftShow: false,
      openState: 0, //  接诊开关 0-"" | 1-开诊 | 2-不开诊
      payType: '', // "pay"  "free"
      count: '', //咨询人数
      noStateTextTitle: '',
      noStateText: '',
      from: '',
      ensureShow: false, //授权
      ensureParams: {
        content: "唯医骨科需获取您的授权信息，以方便您后续使用",
        ensure: "确定",
        type: "openSetting"
      },
      navigateTo: false,
      scrollTop: '',
      showBottom: true,
      confirmShow: false, //沟通中弹层
      source: ''
    };
  },

  components: {
    NormalLoading: __WEBPACK_IMPORTED_MODULE_11_components_loading__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_13_components_confirm__["a" /* default */]
  },
  onLoad: function onLoad(option) {
    var _this2 = this;

    var _this = this;
    wx.removeStorageSync('reportPatient', true); // 清除患者报道患者的标记
    this.from = option.from || '';
    _this.showHonier = false;
    _this.academicMoreShow = false;
    _this.honorMore = false;
    _this.academicMore = false;
    _this.workMore = false;
    _this.workMoreShow = false;
    this.source = option.source || '';
    if (option.applicationType) {
      _this.applicationType = option.applicationType;
    } else {
      _this.applicationType = '12';
    }
    //获取授权信息
    wx.getSetting({
      success: function success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function success(res) {
              _this.ensureShare = true;
              _this.nickName = res.userInfo.nickName;
            }
          });
        }
      }
    });
    wx.onNetworkStatusChange(function (res) {
      _this2.finish = false;
      console.log("netStatus:");
      console.log(res);
      if (res && !!res.isConnected) {} else {}
    });
  },
  onShow: function onShow() {
    this.achievement = '';
    this.honor = [];
    this.academic = '';
    this.work = [];
    this.init();
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].leaveBrowse();
  },
  onPageScroll: function onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },

  //转发事件
  onShareAppMessage: function onShareAppMessage(res) {
    if (res.from === 'button') {
      console.log(res.target);
    }
    // let _path = `/${getCurrentPages()[1].route}`;
    var _path = "/pages/mIndex/mIndex?doctorCustomerId=" + this.idList.doctorId + "&from=shareFriend&path=/pages/doctorMain/doctorMain";
    var _sharTitle = this.nickName + "\u63A8\u8350>> " + this.authMap.fullName + " " + this.authMap.medicalTitleShow;
    return {
      title: _sharTitle,
      path: _path
    };
  },

  watch: {
    scrollTop: function scrollTop(item, items) {
      if (item < items) {
        //页面上滑分享出现showShareBtn
        this.showBottom = true;
        this.showShareBtn = true;
      } else {
        //页面上滑分享消失showShareBtn
        this.showBottom = false;
        this.showShareBtn = false;
      }
      if (item == 0 || items == 0) {
        this.showShareBtn = true;
      }
    }
  },
  methods: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapMutations(["setId"]), {
    // ...mapActions(["getDoctorMessage"]),
    formSubmit: function formSubmit(e) {
      sendFormId(e.target.formId);
    },
    init: function init() {
      var _this = this;
      this.finish = true;
      _this.getDocInfo();
      _this.getPriceInfo();
    },

    /** 主动授权回调 */
    userInfo: function userInfo(e) {
      if (e.target.userInfo) {
        this.ensureShow = false;
        this.nickName = e.target.userInfo.nickName; //昵称
        this.ensureShare = true; //分享按钮
      } else {
        this.ensureShow = true;
      }
    },

    // 医生基本信息
    getDocInfo: function getDocInfo() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_6_common_js_doctorHome_getBaseMessage__["a" /* default */])({
        "customerId": _this.idList.doctorId,
        "logoUseFlag": 3
      }).then(function (res) {
        _this.finish = false;
        if (res && res.responseData && res.responseData.dataList) {
          var _baseInfoData = res.responseData.dataList[0];
          _this.authMap = _baseInfoData.authMap;
          var medicalTitleText = _this.textCutter(_this.authMap.medicalTitle, "medical");
          _this.doctorLogo = _baseInfoData.logoUrlMap.logoUrl;
          // _this.doctorName = _this.authMap.fullName.length > 4 ? _this.authMap.fullName.substring(0, 4) + "..." : _this.authMap.fullName;
          _this.jobDoctorYear = _this.authMap.jobDoctorYear >= 5 ? _this.authMap.jobDoctorYear >= 10 ? "\u4ECE\u533B" + _this.authMap.jobDoctorYear + "\u5E74" : "从医5年以上" : "师从名医";
          // _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
          _this.medicalTitle = medicalTitleText;
          _this.department = _this.authMap.department || "";
          _this.company = _this.authMap.company || "";
          _this.expertise = _this.authMap.expertise;
          _this.count = _baseInfoData.count;
          wx.setNavigationBarTitle({
            title: _this.authMap.fullName + "\u533B\u751F\u4ECB\u7ECD"
          });
          console.log(_baseInfoData.abilityPracticeList);
          // 处理执业成就字段；
          _baseInfoData.abilityPracticeList.length && _baseInfoData.abilityPracticeList.map(function (item) {
            _this.achievement += item.executiveAbility + "；";
          });
          _this.achievement.length && (_this.achievement = _this.achievement.substring(0, _this.achievement.length - 1));
          // 处理获得荣誉字段
          _baseInfoData.honorList.length && _baseInfoData.honorList.map(function (item) {
            _this.honor.push(item.honorName);
          });
          _this.honorLess = _this.honor;
          var honorLen = _this.honor.length;
          if (honorLen) {
            if (honorLen > 3) {
              _this.showHonier = true;
              var honorTemp = _this.honor.concat([]);
              _this.honorLess = honorTemp.splice(0, 3);
            }
          }
          // 处理学术能力字段；
          _baseInfoData.abilityAcademicList.length && _baseInfoData.abilityAcademicList.map(function (item) {
            _this.academic += item.academicAbility + "；";
          });
          _this.academic.length && (_this.academic = _this.academic.substring(0, _this.academic.length - 1));
          _this.academicLess = _this.academic;
          if (__WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getByteLen(_this.academic) > 120) {
            _this.academicMoreShow = true;
            _this.academicLess = __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].getStrByteLen(_this.academic, 115) + "...";
          }
          // 处理社会任职字段
          _baseInfoData.socialList.length && _baseInfoData.socialList.map(function (item) {
            _this.work.push(item.organization + item.socialTitle);
          });
          _this.workLess = _this.work;
          var workLen = _this.work.length;
          if (workLen) {
            if (workLen > 3) {
              _this.workMoreShow = true;
              var workTemp = _this.work.concat([]);
              _this.workLess = workTemp.splice(0, 3);
            }
          }
        }
      }).catch(function (err) {
        _this.finish = false;
      });
    },

    // 咨询价格
    getPriceInfo: function getPriceInfo() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_7_common_js_doctorHome_getConsultPrice__["a" /* default */])({
        customerId: _this.idList.doctorId
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
            Object(__WEBPACK_IMPORTED_MODULE_8_common_js_doctorHome_getConsultStatus__["a" /* default */])({
              customerId: _this.idList.doctorId,
              caseId: _this.idList.caseId,
              patientId: _this.idList.patientId, //患者ID
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
                __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].enterBrowse({
                  browseType: "132",
                  opDesc: "医生信息介绍页-未开诊（小程序）"
                });
              } else {
                _this.openState = 1;
                __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].enterBrowse({
                  browseType: "89",
                  opDesc: "医生信息介绍页（小程序）"
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
            });
          }
        }
      });
    },
    isHasGood: function isHasGood() {
      return this.authMap.expertise > 0 ? true : false;
    },

    /** 切换展开、隐藏 */
    showFun: function showFun(type) {
      this[type + "More"] = !this[type + "More"];
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

    /** 去咨询按钮 */
    goConsultFn: function goConsultFn() {
      var _this = this;
      Object(__WEBPACK_IMPORTED_MODULE_8_common_js_doctorHome_getConsultStatus__["a" /* default */])({
        customerId: _this.idList.doctorId,
        caseId: _this.idList.caseId,
        patientId: _this.idList.patientId, //患者ID
        orderType: 1,
        orderSourceType: 0,
        sortType: 2
      }).then(function (data) {
        var _isFree = data.isFree;
        var _state = data.state;
        var _remainNum = data.remainNum;
        var _conState = data.conState; //0-无沟通中数据 1-有
        if (_state == 1) {
          //开启咨询
          if (_conState == 1 && _this.from == 'imScene') {
            _this.confirmShow = true;
          } else {
            if (_remainNum !== 0) {
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
      });
    },
    toImPage: function toImPage() {
      var _this = this;
      if (getCurrentPages().length >= 4) {
        __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].setItem('backIndex', true);
        wx.reLaunch({
          url: "/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=" + _this.idList.doctorId + "&patientId=" + _this.idList.patientId + "&caseId=" + _this.idList.caseId
        });
      } else {
        wx.navigateTo({
          url: "/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=" + _this.idList.doctorId + "&patientId=" + _this.idList.patientId + "&caseId=" + _this.idList.caseId
        });
      }
    },

    /** 邀请医生开诊 */
    inviteConsultFn: function inviteConsultFn() {
      var _this3 = this;

      var _this = this;
      this.finish = true;
      Object(__WEBPACK_IMPORTED_MODULE_9_common_js_miniUtil_miniLogin__["a" /* default */])({
        successCallBack: function successCallBack(res) {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            // 已登录...
            Object(__WEBPACK_IMPORTED_MODULE_10_common_js_HttpRequest_getHasInvitedConsult__["a" /* default */])({
              customerId: _this.idList.doctorId, //	string	是	医生id
              patientCustomerId: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId") || '', //string	是	患者所属用户id
              openid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("openId") || "", // string	是	渠道唯一id
              uuid: __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem('unionId') || "" // string	是	联合id（用来关联其他平台）
            }).then(function (data) {
              _this3.finish = false;
              if (data.responseObject.responseStatus) {
                if (data.responseObject.responseMessage == "NO DATA") {
                  //未邀请过
                  wx.navigateTo({
                    url: "/pages/doctorMain/inviteContent?from=" + _this.from
                  });
                } else {
                  //已邀请过
                  _this3.toastFn("您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。");
                }
              } else {
                cosnole.log('获取是否邀请过医生开诊失败');
              }
            });
          } else {
            _this3.finish = false;
            wx.navigateTo({
              url: "/pages/doctorMain/inviteContent?from=" + _this.from
            });
          }
        }
      });
    },

    /** 去咨询授权 */
    authorizeFn: function authorizeFn(e) {
      this.navigateTo = true;
      if (e.target.userInfo) {
        if (this.openState == 1) {
          __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
            actionId: 14150
          });
          this.goConsultFn();
        } else {
          __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
            actionId: 14151
          });
          this.inviteConsultFn();
        }
      } else {
        console.log("拒绝授权");
        this.ensureShow = true;
      }
    },
    goToSetting: function goToSetting(e) {
      var _this = this;
      if (e.mp.detail.errMsg === "openSetting:ok") {
        _this.ensureShow = false;
        if (!_this.navigateTo) {
          // 分享授权回调函数 此处需要手动触发分享
        } else {
          if (_this.openState == 1) {
            _this.goConsultFn();
          } else {
            _this.inviteConsultFn();
          }
        }
      } else {
        _this.ensureShow = true;
      }
    },

    /** 咨询跳页判断 */
    showNotConsult: function showNotConsult() {
      var _this = this;
      var data = {
        applicationType: this.applicationType,
        doctorId: _this.idList.doctorId,
        doctorName: _this.authMap.fullName
      };
      __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].removeItem("redirect");
      if (_this.from == '' || _this.from == "find" || _this.from == "share" || _this.from == "journal" || _this.from == "AI" || _this.from == "patientNote") {
        if (__WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].getItem("userId")) {
          if (getCurrentPages().length >= 4) {
            __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].setItem('backIndex', true);
            if (_this.source && _this.source == 'qrCode') {
              wx.reLaunch({
                // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
              });
            } else {
              wx.reLaunch({
                // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
              });
            }
          } else {
            if (_this.source && _this.source == 'qrCode') {
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
              });
            } else {
              wx.navigateTo({
                // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
              });
            }
          }
        } else {
          if (getCurrentPages().length >= 4) {
            __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].setItem('backIndex', true);
            if (_this.source && _this.source == 'qrCode') {
              wx.reLaunch({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
              });
            } else {

              wx.reLaunch({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
              });
            }
          } else {
            if (_this.source && _this.source == 'qrCode') {
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
              });
            } else {
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(data))
                // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
              });
            }
          }
        }
      } else {
        console.log("正常路程咨询");
        if (getCurrentPages().length >= 4) {
          __WEBPACK_IMPORTED_MODULE_4_localStorage__["a" /* default */].setItem('backIndex', true);
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
    },
    shareFn: function shareFn() {
      __WEBPACK_IMPORTED_MODULE_12_dataLog__["a" /* default */].createTrack({
        actionId: 14152
      });
    }
  }),
  filters: {
    movePoint: function movePoint(value) {
      var result = void 0;
      if (!__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_number_is_integer___default()(parseFloat(value))) {
        result = parseFloat(value);
      } else {
        result = parseFloat(value).toFixed(0);
      }
      return isNaN(result) ? 0 : result;
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_extends___default()({}, mapState(["doctorMessage", "doctorBaseInfo", "idList"]))
});

/***/ }),

/***/ 467:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "doctorHome-main"
  }, [(_vm.finish) ? _c('NormalLoading', {
    attrs: {
      "mpcomid": '0'
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-topInfo"
  }, [(false) ? _c('button', {
    staticClass: "doc-shareBtn",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '0'
    },
    on: {
      "getuserinfo": _vm.userInfo
    }
  }) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "top-left"
  }, [_c('img', {
    attrs: {
      "src": _vm.doctorLogo,
      "alt": ""
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "top-right"
  }, [_c('p', {
    staticClass: "top-docInfoContent"
  }, [_c('span', {
    staticClass: "doc-name"
  }, [_vm._v(_vm._s(_vm.authMap.fullName))])]), _vm._v(" "), _c('section', [_c('span', {
    staticClass: "doc-medical"
  }, [_vm._v(_vm._s(_vm.medicalTitle))]), (false) ? _c('span', {
    staticClass: "doc-degree"
  }, [_vm._v(_vm._s(_vm.department))]) : _vm._e()]), _vm._v(" "), _c('p', {
    staticClass: "doc-right-content2"
  }, [(_vm.authMap.hospitalLevelId == 1) ? _c('span', {
    staticClass: "doc-hospitalGrade"
  }, [_vm._v("三甲")]) : _vm._e(), _c('span', {
    staticClass: "doc-hospitallName"
  }, [_vm._v(_vm._s(_vm.company))])]), _vm._v(" "), _c('p', {
    staticClass: "doc-cureTime"
  }, [_vm._v(_vm._s(_vm.jobDoctorYear))])], 1), _vm._v(" "), _c('section', {
    staticClass: "doc-borderLine"
  })], 1), _vm._v(" "), (_vm.expertise.length) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("医生擅长")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent"
  }, [_vm._v(_vm._s(_vm.expertise))])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-border-hightLine"
  }), _vm._v(" "), (_vm.achievement.length) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("执业成就")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent"
  }, [_vm._v(_vm._s(_vm.achievement))])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-border-hightLine"
  }), _vm._v(" "), (_vm.honor.length) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("获得荣誉")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent"
  }, _vm._l((_vm.honorMore ? _vm.honor : _vm.honorLess), function(item, index) {
    return _c('p', {
      key: index,
      staticClass: "doc-listGoodItem"
    }, [_vm._v(_vm._s(item))])
  })), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showHonier),
      expression: "showHonier"
    }],
    staticClass: "doc-listShowBtn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": function($event) {
        _vm.showFun('honor')
      }
    }
  }, [_vm._v(_vm._s(_vm.honorMore ? "收起" : "展开") + "\n      ")])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-border-hightLine"
  }), _vm._v(" "), (_vm.academicLess.length) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("学术能力")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent ",
    domProps: {
      "innerHTML": _vm._s(_vm.academicMore ? _vm.academic : _vm.academicLess)
    }
  }), _vm._v(" "), (_vm.academicMoreShow) ? _c('section', {
    staticClass: "doc-listShowBtn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": function($event) {
        _vm.showFun('academic')
      }
    }
  }, [_vm._v(_vm._s(_vm.academicMore ? "收起" :
    "展开") + "\n      ")]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-border-hightLine"
  }), _vm._v(" "), (_vm.work.length) ? _c('section', {
    staticClass: "doc-listComm doc-goodAt"
  }, [_c('section', {
    staticClass: "doc-listTitle"
  }, [_vm._v("社会任职")]), _vm._v(" "), _c('section', {
    staticClass: "doc-listContent"
  }, _vm._l((_vm.workMore ? _vm.work : _vm.workLess), function(item, index) {
    return _c('p', {
      key: index,
      staticClass: "doc-listGoodItem"
    }, [_vm._v(_vm._s(item))])
  })), _vm._v(" "), (_vm.workMoreShow) ? _c('section', {
    staticClass: "doc-listShowBtn",
    attrs: {
      "eventid": '3'
    },
    on: {
      "click": function($event) {
        _vm.showFun('work')
      }
    }
  }, [_vm._v(_vm._s(_vm.workMore ? "收起" : "展开"))]) : _vm._e()], 1) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "doc-goConsult"
  }, [(_vm.ensureShare && _vm.showShareBtn) ? _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '5'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "shareBtn wx-contact-text",
    attrs: {
      "open-type": "share",
      "type": "submit",
      "formType": "submit",
      "eventid": '4'
    },
    on: {
      "click": _vm.shareFn
    }
  }, [_c('span', [_vm._v("分享")])])], 1) : _vm._e(), _vm._v(" "), _c('section', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.openState == 2 && _vm.showBottom),
      expression: "openState==2&&showBottom"
    }],
    staticClass: "invite-consult"
  }, [_c('p', [_vm._v("医生暂不在线，点击[预约咨询]医生助理会为您联系医生，并在医生上线后第一时间通知您。")])], 1), _vm._v(" "), _c('section', {
    staticClass: "doc-go-left"
  }, [_c('p', {
    staticClass: "doc-goLone"
  }, [(_vm.openState == 1 && _vm.inquiryState == 1 && _vm.payType == 'free') ? _c('span', {
    staticClass: "doc-goFreeText",
    class: {
      'notOnline': _vm.openState == 2
    }
  }, [_vm._v(_vm._s(_vm.openState == 1 ? "前3次回复免费" : "暂不在线"))]) : _vm._e(), _vm._v(" "), (_vm.openState == 2) ? _c('span', {
    staticClass: "doc-goFreeText",
    class: {
      'notOnline': _vm.openState == 2
    }
  }, [_vm._v(_vm._s(_vm.openState == 1 ? "前3次回复免费" : "暂不在线"))]) : _vm._e(), (_vm.openState == 1) ? _c('span', {
    staticClass: "doc-goPrice",
    class: {
      'charge': _vm.payType !== 'free'
    }
  }, [_vm._v("￥" + _vm._s(_vm.generalPrice) + " "), (_vm.payType == 'free') ? _c('span', {
    staticClass: "doc-priceIcon"
  }) : _vm._e()]) : _vm._e()]), _vm._v(" "), _c('p', {
    staticClass: "doc-goLTwo"
  }, [_vm._v("已有"), _c('span', {
    staticClass: "doc-goNum"
  }, [_vm._v(_vm._s(_vm.count))]), _vm._v("人咨询过")])], 1), _vm._v(" "), (_vm.openState == 1) ? _c('button', {
    staticClass: "doc-go-right",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '6'
    },
    on: {
      "getuserinfo": _vm.authorizeFn
    }
  }, [_vm._v("去咨询")]) : _vm._e(), _vm._v(" "), (_vm.openState == 2) ? _c('button', {
    staticClass: "doc-go-right",
    attrs: {
      "open-type": "getUserInfo",
      "eventid": '7'
    },
    on: {
      "getuserinfo": _vm.authorizeFn
    }
  }, [_vm._v("预约咨询")]) : _vm._e()], 1), _vm._v(" "), (_vm.ensureShow) ? _c('ensureConfirm', {
    attrs: {
      "ensureParams": _vm.ensureParams,
      "eventid": '8',
      "mpcomid": '1'
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
      "eventid": '9',
      "mpcomid": '2'
    },
    on: {
      "cancelClickEvent": function($event) {
        _vm.confirmShow = false
      },
      "ensureClickEvent": _vm.toImPage
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-946ab984", esExports)
  }
}

/***/ })

},[1224]);