global.webpackJsonp([5],{

/***/ 1077:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_intelligentTriage_vue__ = __webpack_require__(1079);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0b3551f7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_intelligentTriage_vue__ = __webpack_require__(1092);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1078)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-0b3551f7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_intelligentTriage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_0b3551f7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_intelligentTriage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/intelligentTriage/intelligentTriage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] intelligentTriage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-0b3551f7", Component.options)
  } else {
    hotAPI.reload("data-v-0b3551f7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1078:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1079:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_localStorage__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_confirm__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_MachineMessage__ = __webpack_require__(1080);
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
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * @Desc：智能分诊
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by zh 2019/7/3
 */



// import getTriageWorkingTime from "common/js/HttpRequest/getTriageWorkingTime"; // 获取分诊工作时间



var triageList = {
  question: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/cms/part/question/relation/v1/geQuestionAndOptionList/",
  saveTmpData: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/cms/part/illness/relation/v1/saveTmpData/",
  getTmpData: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/cms/part/illness/relation/v1/getTmpData/",
  imgUpload: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/create/"
};

/* harmony default export */ __webpack_exports__["a"] = ({
  name: "intelligent-triage",
  data: function data() {
    return {
      dateObj: {
        array: [],
        index: [2]
      },
      serviceTime: '',
      showTip: false,
      isFinish: false,
      isShowPicker: false,
      partId: '', //部位id
      sex: '',
      doctorId: '',
      partName: '',
      applicationType: '0', //流程类型1-快速问诊；2-找医生
      scrollHeight: 0,
      scrollTimer: null,
      questionList: [],
      getTmpDataList: [],
      postData: {
        optionList: [],
        inspectionAttId: ''
      },
      messageList: [],
      currentIndex: 0
    };
  },

  computed: {
    nowDate: function nowDate() {
      // 10-09 15:05
      var myDate = new Date(),
          year = myDate.getFullYear(),
          //获取当前年
      yue = myDate.getMonth() + 1,
          //获取当前月
      date = myDate.getDate(),
          //获取当前日
      h = myDate.getHours(),
          //获取当前小时数(0-23)
      m = myDate.getMinutes(),
          //获取当前分钟数(0-59)
      s = myDate.getSeconds(); //获取当前秒
      if (yue < 10) {
        yue = "0" + yue;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (h < 10) {
        h = "0" + h;
      }
      if (m < 10) {
        m = "0" + m;
      }
      return yue + "-" + date + " " + h + ":" + m;
    }
  },
  components: {
    MachineMessage: __WEBPACK_IMPORTED_MODULE_5__components_MachineMessage__["a" /* default */],
    confirm: __WEBPACK_IMPORTED_MODULE_4_components_confirm__["a" /* default */]
    // PickerComponent
  },
  methods: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, Object(__WEBPACK_IMPORTED_MODULE_7_vuex__["e" /* mapMutations */])(["setOrderMessage"]), {
    //继续填写
    ensureShowTip: function ensureShowTip() {
      this.showTip = false;
      if (this.isFinish) {
        this.finishJump();
      } else {
        this.messageList = this.getTmpDataList.messageList;
        this.postData = this.getTmpDataList.severData;
        this.questionList = this.getTmpDataList.questionList;
        if (this.messageList.length) {
          this.currentIndex = this.messageList.length;
          if (this.questionList[this.messageList.length]) {
            this.messageListAdd(this.questionList[this.messageList.length]);
          } else {
            this.finishJump();
          }
          // this.getQuestionList(this.messageList.length)
        } else {
          this.getQuestionList(0);
        }
      }
    },

    //重新填写
    cancelShowTip: function cancelShowTip() {
      this.showTip = false;
      this.getTmpDataList = [];
      this.messageList = [];
      this.postData = {
        optionList: [],
        inspectionAttId: ''
      };
      this.currentIndex = 0;
      this.questionList = [];
      this.isFinish = false;
      this.getQuestionList(0);
    },

    //跳转
    finishJump: function finishJump() {
      var _this = this;

      this.isFinish = true;
      var query = {
        partId: this.partId,
        partName: this.partName,
        applicationType: this.applicationType,
        sex: this.sex,
        doctorId: this.doctorId
      };
      var orderMessage = {
        mainSymptom: '', //主诉
        continueTime: '', //患病时长
        treatment: '', //治疗情况
        illness: '', //病情补充
        docHelp: '', //想要医生帮助
        imageList: [] //图片资料
      };
      this.messageList.map(function (value, index) {
        if (value.questionName === 'symptom_1') {
          if (_this.messageList[index].answer !== '其他') {
            orderMessage.mainSymptom += _this.messageList[index].answer;
          }
          // if(this.postData.optionList[1].questionName === 'pain_degree_1.3'){
          //   orderMessage.mainSymptom+=this.postData.optionList[1].optionDesc;
          // }
        }
        if (value.questionName === 'else_4.1' && index === 1 || value.questionName === 'else_symptom_1.2') {
          orderMessage.mainSymptom += _this.messageList[index].answer;
        }
        if (value.questionName === 'time_2') {
          orderMessage.continueTime += _this.messageList[index].answer;
        }
        if (value.questionName === 'diagnosis_treat_4.2') {
          orderMessage.treatment += _this.messageList[index].answer;
        }
        if (value.questionName === 'to_the_hospital_3' || value.questionName === 'else_4.1' && index !== 1) {
          orderMessage.illness += _this.messageList[index].answer + '医院';
        }
        if (value.questionName === 'ask_else_6' || value.questionName === 'ask_doctor_5.1') {
          orderMessage.docHelp += _this.messageList[index].answer;
        }
        if (value.imgList && value.imgList.length) {
          orderMessage.imageList = _this.messageList[index].answer;
        }
      });
      console.log(orderMessage);
      // console.log('query ---> ', query)
      if (this.applicationType == 0) {
        //partId:部位id;applicationType:0-快速问诊；1-找医生;sex性别，doctorName doctorId
        wx.navigateTo({
          url: "/packageB/consultPatientList/consultPatientList?query=" + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(query))
        });
      } else {
        this.setOrderMessage({
          medicalShow: {
            mainSymptom: orderMessage.mainSymptom, //主诉
            continueTime: orderMessage.continueTime, //患病时长
            treatment: orderMessage.treatment, //治疗情况
            illness: orderMessage.illness, //病情补充
            docHelp: orderMessage.docHelp, //想要医生帮助
            imageList: orderMessage.imageList ? orderMessage.imageList : '没有' //图片资料
          },
          medicalCreate: {}
        });
        wx.navigateTo({
          url: "/packageE/findDoctorPatientList/findDoctorPatientList?query=" + encodeURIComponent(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()(query))
        });
      }
    },

    //上传数据
    saveTmpData: function saveTmpData() {
      var _this2 = this;

      // let messageList=[];
      // this.messageList.map((item,index)=>{
      //   messageList.push({
      //     answer:item.answer,
      //     questionId:item.questionId,
      //   })
      // });
      // console.log(messageList)
      var sex = 1;
      switch (this.sex) {
        case 'man':
          sex = 1;
          break;
        case 'woman':
          sex = 2;
          break;
        case 'kid':
          sex = 3;
          break;
        default:
          sex = 1;
          break;
      }
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: triageList.saveTmpData,
        method: "post",
        data: {
          partId: this.partId,
          sex: sex,
          openId: wx.getStorageSync('openId'),
          data: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_json_stringify___default()({ messageList: this.messageList, severData: this.postData, questionList: this.questionList })
        },
        done: function done(data) {
          if (data && data.responseObject && data.responseObject.responseStatus) {
            if (_this2.isFinish) {
              _this2.finishJump();
            }
          } else {
            console.log('shibai');
          }
        }
      });
    },

    //获取数据
    getTmpData: function getTmpData() {
      var _this3 = this;

      var sex = 1;
      switch (this.sex) {
        case 'man':
          sex = 1;
          break;
        case 'woman':
          sex = 2;
          break;
        case 'kid':
          sex = 3;
          break;
        default:
          sex = 1;
          break;
      }
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: triageList.getTmpData,
        method: "post",
        data: {
          partId: this.partId,
          sex: sex,
          openId: wx.getStorageSync('openId')
        },
        done: function done(data) {
          // this.getQuestionList(0);
          if (data && data.responseObject && data.responseObject.responseStatus) {
            if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
              if (data.responseObject.responseData.dataList.messageList && data.responseObject.responseData.dataList.messageList.length) {
                _this3.showTip = true;
                _this3.getTmpDataList = data.responseObject.responseData.dataList;
              } else {
                _this3.showTip = false;
                _this3.getQuestionList(0);
              }
            } else {
              _this3.showTip = false;
              _this3.getQuestionList(0);
            }
          } else {
            wx.showToast({
              title: '获取历史数据失败',
              icon: 'none'
            });
          }
        }
      });
    },
    dataInit: function dataInit() {
      this.dateObj = {
        array: [],
        index: [2]
      };
      this.isFinish = false;
      this.isShowPicker = false;
      this.showTip = false;
      this.partId = '';
      this.partName = '';
      this.serviceTime = '';
      this.applicationType = '0';
      this.scrollHeight = 0;
      this.scrollTimer = null;
      this.questionList = [];
      this.getTmpDataList = [];
      this.postData = {
        optionList: [],
        inspectionAttId: ''
      };
      this.messageList = [];
      this.currentIndex = 0;
    },
    pickerSure: function pickerSure() {
      this.isShowPicker = false;
      this.messageList[this.messageList.length - 1].answer = this.dateObj.array[this.dateObj.index[0]].optionName;
      this.dateObj.array = [];
      this.postData.optionList.push({
        questionId: this.messageList[this.messageList.length - 1].questionId,
        optionIdList: this.messageList[this.messageList.length - 1].optionList[this.dateObj.index[0]].optionId,
        optionDesc: this.messageList[this.messageList.length - 1].answer,
        questionName: this.messageList[this.messageList.length - 1].questionName,
        refOptionId: this.messageList[this.messageList.length - 1].optionList[this.dateObj.index[0]].refOptionId,
        partId: this.partId
      });
      this.nextQuestion();
    },
    bindPickerChange: function bindPickerChange(e) {
      console.log(e.mp.detail.value);
      this.dateObj.index = e.mp.detail.value;
    },
    getQuestionList: function getQuestionList(index) {
      var _this4 = this;

      wx.showLoading({
        title: "正在加载..."
      });
      __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].ajax({
        url: triageList.question,
        method: "post",
        data: {
          partId: this.partId,
          applicationType: 5
        },
        done: function done(data) {
          wx.hideLoading();
          if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
            var dataList = data.responseObject.responseData.dataList;
            _this4.questionList = _this4.changeDataList(dataList);
            _this4.messageListAdd(_this4.questionList[index]);
          } else {}
        }
      });
    },

    //处理数组增加父级id
    changeDataList: function changeDataList(data) {
      var list = [],
          forList = function forList(optionList, questionId) {
        var opList = [];
        optionList.map(function (val, ind) {
          val.refOptionId = '';
          if (val.questionList && val.questionList.length) {
            val.questionList.map(function (v, i) {
              v.refOptionId = val.optionId;
              if (v.optionList && v.optionList.length) {
                v.optionList = forList(v.optionList, v.questionId);
              }
            });
          }
          opList.push(val);
        });
        return opList;
      };
      data.map(function (value, index) {
        value.refOptionId = '';
        if (value.optionList && value.optionList.length) {
          value.optionList = forList(value.optionList, value.questionId);
        }
        list.push(value);
      });
      return list;
    },
    messageListAdd: function messageListAdd(data) {
      var _this5 = this;

      __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].createTrack({
        actionId: 14262,
        keyword: data.questionName,
        locationId: this.currentIndex
      });
      this.messageList.push({
        loading: true
      });
      setTimeout(function () {
        _this5.messageList.pop();
        _this5.messageList.push({
          questionDesc: data.questionDesc,
          questionName: data.questionName,
          questionType: Number(data.questionType),
          optionList: data.optionList,
          imgList: data.imgList || [],
          questionValue: data.questionValue || '',
          answer: data.answer || '',
          questionList: data.questionList || '',
          questionId: data.questionId,
          refOptionId: data.refOptionId
        });
        _this5.scrollToBottom();
        if (Number(data.questionType) === 6) {
          _this5.isShowPicker = true;
          _this5.dateObj.array = data.optionList;
        } else {
          _this5.isShowPicker = false;
        }
      }, 1000);
    },
    nextQuestion: function nextQuestion(data) {
      var _this6 = this;

      this.currentIndex += 1;
      if (data) {
        data.map(function (item, index) {
          _this6.questionList.splice(_this6.currentIndex + index, 0, item);
        });
      }
      this.saveTmpData();
      if (this.currentIndex < this.questionList.length) {
        this.messageListAdd(this.questionList[this.currentIndex]);
      } else {
        this.isFinish = true;
        this.scrollToBottom();
      }
    },
    scrollToBottom: function scrollToBottom() {
      var _this7 = this;

      var delayTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;

      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer);
      }
      this.scrollTimer = setTimeout(function () {
        wx.pageScrollTo({
          scrollTop: _this7.scrollHeight + 10000,
          duration: 0
        });
      }, delayTime);
    },

    /** 获取服务时间 */
    getConsultPrice: function getConsultPrice() {
      var _this8 = this;

      console.log("获取服务时间");
      getTriageWorkingTime({
        visitSiteId: __WEBPACK_IMPORTED_MODULE_2_common_js_util_util__["a" /* default */].getSiteId()
      }).then(function (data) {
        var _data$responseObject = data.responseObject,
            responseStatus = _data$responseObject.responseStatus,
            responseData = _data$responseObject.responseData;

        if (responseStatus && !!responseData) {
          var _responseData$dataLis = responseData.dataList.responseData,
              serviceEndTime = _responseData$dataLis.serviceEndTime,
              serviceStartTime = _responseData$dataLis.serviceStartTime;


          var startTimeArray = serviceStartTime.split(":"),
              endTimeArray = serviceEndTime.split(":");
          if (startTimeArray[0].length === 1) {
            startTimeArray[0] = "0" + startTimeArray[0];
            serviceStartTime = startTimeArray.join(':');
          }
          var myDate = new Date();
          var currentHours = myDate.getHours(); //获取当前小时数(0-23)
          var currentMinutes = myDate.getMinutes(); //获取当前分钟数(0-59)
          _this8.serviceTime = serviceStartTime + "-" + serviceEndTime;
          if (currentHours < parseInt(startTimeArray[0]) || currentHours == parseInt(startTimeArray[0]) && currentMinutes < parseInt(startTimeArray[1]) || currentHours > parseInt(endTimeArray[0]) || currentHours == parseInt(endTimeArray[0]) && currentMinutes > parseInt(endTimeArray[1])) {
            _this8.serviceTime = _this8.serviceTime + " 休息中";
          }
        }
      });
    }
  }),
  onShow: function onShow() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].enterBrowse();
    if (__WEBPACK_IMPORTED_MODULE_3_localStorage__["a" /* default */].getItem("PCIMLinks")) {
      wx.reLaunch({
        url: "/pages/mIndex/mIndex"
      });
    }
    if (this.isFinish) {
      this.showTip = true;
    }
  },
  onHide: function onHide() {
    __WEBPACK_IMPORTED_MODULE_6_dataLog__["a" /* default */].leaveBrowse();
  },
  onLoad: function onLoad(option) {
    if (option.query) {
      option = JSON.parse(decodeURIComponent(option.query));
    }
    this.dataInit();
    // this.getConsultPrice();
    //partId:部位id;applicationType:1-快速问诊；2-找医生;sex性别，doctorName doctorId
    if (option.partId) {
      this.partId = option.partId;
    } else {
      this.partId = '1502698533928';
    }
    if (option.doctorName) {
      wx.setNavigationBarTitle({
        title: option.doctorName + "\u533B\u751F\u533B\u52A9"
      });
    } else {
      wx.setNavigationBarTitle({
        title: "分诊医生"
      });
    }
    if (option.applicationType) {
      this.applicationType = option.applicationType;
    } else {
      this.applicationType = '0';
    }
    if (option.sex) {
      this.sex = option.sex;
    } else {
      this.sex = 'man';
    }
    if (option.partName) {
      this.partName = option.partName;
    } else {
      this.partName = '腰部';
    }
    if (option.doctorId) {
      this.doctorId = option.doctorId;
    } else {
      this.doctorId = '';
    }
    this.getTmpData();
  }
});

/***/ }),

/***/ 1080:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_MachineMessage_vue__ = __webpack_require__(1082);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_878d3fb6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_MachineMessage_vue__ = __webpack_require__(1091);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1081)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-878d3fb6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_MachineMessage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_878d3fb6_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_MachineMessage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/intelligentTriage/components/MachineMessage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] MachineMessage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-878d3fb6", Component.options)
  } else {
    hotAPI.reload("data-v-878d3fb6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1081:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1082:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__PatientMessage__ = __webpack_require__(1083);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_sendFormId__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_upLoadPic_upLoadComm__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_components_vasLevel__ = __webpack_require__(1087);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







var casexhr = {
  createPicture: __WEBPACK_IMPORTED_MODULE_3_common_js_util_util__["a" /* default */].httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/"
};
/* harmony default export */ __webpack_exports__["a"] = ({
  name: "machine-message",
  props: {
    questionItem: {
      type: Object
    }, postData: {
      type: Array
    },
    partId: {
      type: Number
    }
  },
  data: function data() {
    return {
      inputMarBot: false,
      currentIndex: 0,
      currentSelect: [],
      currentItem: [],
      sortId: 0,
      vasShow: false,
      vasList: [],
      painValue: -1
    };
  },

  components: {
    PatientMessage: __WEBPACK_IMPORTED_MODULE_0__PatientMessage__["a" /* default */],
    VAS: __WEBPACK_IMPORTED_MODULE_4_components_vasLevel__["a" /* default */]
  },
  methods: {
    /** 发送formId */
    formSubmit: function formSubmit(e) {
      Object(__WEBPACK_IMPORTED_MODULE_1_common_js_HttpRequest_sendFormId__["a" /* default */])(e.target.formId);
    },

    // 评论输入框聚焦时，设置与底部的距离
    settingMbShow: function settingMbShow() {
      this.inputMarBot = true;
    },
    //  评论输入框失去聚焦时，设置与底部的距离（默认状态）
    settingMbNoShow: function settingMbNoShow() {
      this.inputMarBot = false;
    },
    //vasShow=false,疼痛等级关闭
    closePainLevel: function closePainLevel() {
      this.vasShow = false;
      this.painValue = -1;
      this.questionItem.optionList[this.currentIndex].isActive = false;
      var cIndex = this.currentSelect.indexOf(this.currentIndex);
      if (cIndex !== -1) {
        this.currentSelect.splice(cIndex, 1);
        this.currentItem.splice(cIndex, 1);
      }
    },

    //疼痛程度确认
    levelSure: function levelSure() {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.vasShow = false;
        _this2.questionItem.optionList[_this2.currentIndex].optionDesc += '(' + _this2.painValue + ')';
      });
    },

    //获取当前疼痛程度
    getPainValue: function getPainValue(value) {
      this.painValue = value;
    },

    //单选和多选点击
    itemSelect: function itemSelect(index, item, type) {
      var _this3 = this;

      // 多选 单选//1单选，2多选-标签 3 input输入框 4图片 5长选择  1-单选2-多选3-进度条4-问答题5-多选&描述6-时间7-图片
      switch (type) {
        case 1:
          this.questionItem.optionList[index].isActive = true;
          setTimeout(function () {
            _this3.questionItem.answer = item.optionDesc;
            if (Number(item.isAttachment) === 1) {
              item.questionList = [{
                "questionDesc": "",
                "questionId": "",
                "isPopup": "0",
                "popupPrompt": "",
                "optionList": [{
                  "optionDesc": "上传照片",
                  "optionId": "",
                  "optionName": "上传照片",
                  "questionList": [],
                  "isAttachment": "0"
                }, {
                  "optionDesc": "暂不上传",
                  "optionId": "",
                  "optionName": "暂不上传",
                  "questionList": [],
                  "isAttachment": "0"
                }],
                "questionName": "take_an_xray_5.2",
                "questionType": "7"
              }];
            }
            _this3.postData.optionList.push({
              questionId: _this3.questionItem.questionId,
              optionIdList: item.optionId,
              optionDesc: _this3.questionItem.answer,
              partId: _this3.partId
            });
            if (item.questionList && item.questionList.length) {
              _this3.$emit('nextQuestion', item.questionList);
            } else {
              _this3.$emit('nextQuestion', false);
            }
          }, 100);
          break;
        case 7:
          this.questionItem.optionList[index].isActive = true;
          if (index === 0) {
            this.addImg();
          } else {
            setTimeout(function () {
              _this3.questionItem.answer = item.optionDesc;
              console.log({
                questionId: _this3.questionItem.questionId,
                optionIdList: item.optionId,
                optionDesc: _this3.questionItem.answer,
                questionName: _this3.questionItem.questionName,
                refOptionId: _this3.questionItem.refOptionId,
                partId: _this3.partId
              });
              if (_this3.questionItem.questionList && _this3.questionItem.questionList.length) {
                _this3.$emit('nextQuestion', _this3.questionItem.questionList);
              } else {
                _this3.$emit('nextQuestion', false);
              }
            }, 100);
          }
          break;
        case 2:
        case 5:
          var cIndex = this.currentSelect.indexOf(index);
          if (cIndex === -1) {
            this.currentSelect.push(index);
            this.currentItem.push(item);
            this.questionItem.optionList[index].isActive = true;
            if (type === 2 && item.questionList && item.questionList.length && Number(item.questionList[0].questionType) === 3) {
              this.currentIndex = index;
              this.vasShow = true;
              this.painValue = 2;
              this.vasList = item.questionList[0].optionList;
            }
          } else {
            this.currentSelect.splice(cIndex, 1);
            this.currentItem.splice(cIndex, 1);
            this.questionItem.optionList[index].isActive = false;
            if (type === 2 && item.questionList && item.questionList.length && Number(item.questionList[0].questionType) === 3) {
              var name = this.questionItem.optionList[index].optionDesc,
                  nIndex = name.indexOf('(');
              if (nIndex !== -1) {
                this.questionItem.optionList[index].optionDesc = name.slice(0, nIndex);
              }
            }
          }
          break;
        default:
          break;
      }
    },

    //多选确定
    selectSubmit: function selectSubmit() {
      var _this4 = this;

      if (this.currentItem.length) {
        var str = '',
            isElse = false,
            data = {},
            postdata = { optionIdList: '' },
            listItem = void 0;
        this.currentItem.map(function (value, index) {
          if (value.questionList && value.questionList.length && value.optionDesc.indexOf('其他') !== -1) {
            isElse = true;
            data = value.questionList;
          } else {
            str += value.optionDesc + '、';
          }
          if (value && value.questionList && value.questionList.length && Number(value.questionList[0].questionType) === 3 && _this4.painValue !== -1) {
            var optionList = value.questionList[0].optionList[_this4.painValue],
                optionId = '',
                optionName = '',
                optionDesc = '';
            if (optionList) {
              optionId = optionList.optionId;
              optionName = optionList.optionName;
              optionDesc = optionList.optionDesc;
            }
            listItem = {
              questionId: value.questionList[0].questionId,
              questionName: value.questionList[0].questionName,
              optionIdList: optionId,
              partId: _this4.partId,
              refOptionId: value.questionList[0].refOptionId,
              optionDesc: 'VAS评分' + optionName + optionDesc
            };
          }
          postdata.optionIdList += value.optionId + ',';
          postdata.refOptionId = value.refOptionId;
        });
        this.questionItem.answer = str.slice(0, str.length - 1);
        postdata.questionId = this.questionItem.questionId;
        postdata.optionDesc = this.questionItem.answer;
        postdata.answer = this.questionItem.answer;
        postdata.questionName = this.questionItem.questionName;
        postdata.partId = this.partId;
        //数据传输
        console.log(postdata);
        this.postData.optionList.push(postdata);
        console.log(listItem);
        if (listItem) {
          this.postData.optionList.push(listItem);
        }
        console.log(this.painValue);
        if (!this.questionItem.answer) {
          this.questionItem.answer = '其他';
        }
        if (isElse) {
          this.$emit('nextQuestion', data);
        } else {
          this.$emit('nextQuestion', false);
        }
      }
    },

    //发送input事件
    sendInput: function sendInput() {
      if (this.questionItem.questionValue) {
        this.questionItem.answer = this.questionItem.questionValue;
        this.postData.optionList.push({
          questionId: this.questionItem.questionId,
          optionIdList: this.questionItem.optionList && this.questionItem.optionList.length && this.questionItem.optionList[0].optionId,
          optionDesc: this.questionItem.answer,
          questionName: this.questionItem.questionName,
          refOptionId: this.questionItem.refOptionId,
          partId: this.partId
        });
        if (this.questionItem.questionList && this.questionItem.questionList.length) {
          this.$emit('nextQuestion', this.questionItem.questionList);
        } else {
          this.$emit('nextQuestion', false);
        }
      }
    },

    //图片确认上传
    imgSubmit: function imgSubmit() {
      var _this = this;
      var _imgurls = [],
          successNum = 0,
          inspectionAttId = '';
      _this.questionItem.imgList.forEach(function (ele, index) {
        if (ele.attId) {
          _imgurls.push(ele.path);
          // inspectionAttId.push(ele.attId);
          inspectionAttId += ele.attId + ',';
          successNum++;
        }
      });
      if (successNum === _this.questionItem.imgList.length) {
        this.questionItem.answer = _imgurls;
        this.postData.inspectionAttId = inspectionAttId;
        this.$emit('nextQuestion', false);
      } else {
        wx.showToast({
          title: '请确保图片全部上传成功',
          icon: 'none'
        });
      }
    },

    // 上传图片
    upLoadPic: function upLoadPic(item, index) {
      var _this = this;
      _this.sortId++;
      var _defaultData = {
        caseCategoryId: "", //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
        imageType: "0", //	string	是	资源类型		1-上传资料图片
        visitSiteId: "24",
        sortId: _this.sortId
      };
      _this.questionItem.imgList[index].upload = false;
      _this.questionItem.imgList[index].fail = false;
      wx.uploadFile({
        url: casexhr.createPicture,
        filePath: item.path,
        name: "file",
        formData: _defaultData,
        success: function success(res) {
          _this.questionItem.imgList[index].upload = true;
          if (res && res.data) {
            var _data = JSON.parse(res.data);
            // 接口返回成功
            if (_data.responseObject.responsePk > 0) {
              _this.questionItem.imgList[index].fail = false;
              _this.questionItem.imgList[index].attId = _data.responseObject.responsePk;
              _this.questionItem.imgList[index].path = _data.responseObject.responseMessage.logoUrl;
            } else {
              // 接口返回失败
              _this.questionItem.imgList[index].fail = true;
            }
          } else {
            _this.questionItem.imgList[index].fail = true;
          }
          wx.pageScrollTo({
            scrollTop: 10000000,
            duration: 0
          });
          _this.$forceUpdate();
        },
        fail: function fail(err) {
          //微信接口调用失败
          _this.questionItem.imgList[index].upload = true;
          _this.questionItem.imgList[index].fail = true;
          _this.$forceUpdate();
        },
        complete: function complete() {
          //微信接口调用结束

        }
      });
    },

    //删除图片确定模态
    imgDelToast: function imgDelToast(index) {
      var _this = this;
      // wx.showModal({
      //   // title: '确定删除图片吗？',
      //   content: '确定删除图片吗？',
      //   cancelText: '确定',
      //   cancelColor: '#2ea9fe',
      //   confirmText: '取消',
      //   confirmColor: '#2ea9fe',
      //   success: function (res) {
      //     if (res.confirm) {
      //
      //     } else if (res.cancel) {
      //       _this.deleteImg(index);
      //     }
      //   }
      // })
      _this.deleteImg(index);
    },

    //删除图片api
    deleteImg: function deleteImg(index) {
      var _this = this;
      if (!_this.questionItem.imgList[index].attId) {
        _this.questionItem.imgList.splice(index, 1);
        return;
      }
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_upLoadPic_upLoadComm__["a" /* default */])({
        id: _this.questionItem.imgList[index].attId,
        isValid: "0"
      }).then(function (res) {
        _this.questionItem.imgList.splice(index, 1);
      }).catch(function (err) {
        console.log(err);
      });
    },

    //图片预览
    previewImage: function previewImage(index) {
      var _this = this;
      var _imgurls = [];
      _this.questionItem.imgList.forEach(function (ele, index) {
        _imgurls.push(ele.path);
      });
      wx.previewImage({
        current: _imgurls[index], // 当前显示图片的http链接
        urls: _imgurls // 需要预览的图片http链接列表
      });
    },

    //添加图片
    addImg: function addImg() {
      var _this = this,
          count = 36 - _this.questionItem.imgList.length;
      if (count > 9) {
        count = 9;
      }
      wx.chooseImage({
        count: count,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function success(res) {
          _this.questionItem.optionList[0].isActive = false;
          var tempFiles = _this.beforeImgLoad(res.tempFiles);
          _this.questionItem.imgList = tempFiles.concat(_this.questionItem.imgList);
          tempFiles.forEach(function (ele, index) {
            _this.upLoadPic(ele, index);
          });
        },
        fail: function fail() {
          _this.questionItem.optionList[0].isActive = false;
          _this.$forceUpdate();
        }
      });
    },

    //图片上传前
    beforeImgLoad: function beforeImgLoad(arr) {
      var newArr = arr;
      arr.forEach(function (ele, index) {
        if (ele.size > 10 * 1024 * 1024) {
          newArr.splice(index, 1);
          wx.showToast({
            title: '图片不能大于10M',
            icon: 'none'
          });
        }
      });
      return newArr;
    }
  },
  mounted: function mounted() {},
  onLoad: function onLoad() {
    this.currentSelect = [];
    this.currentItem = [];
    this.currentIndex = 0;
    this.sortId = 0;
    this.vasShow = false;
    this.inputMarBot = false;
    this.vasList = [];
    this.painValue = -1;
  }
});

/***/ }),

/***/ 1083:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_PatientMessage_vue__ = __webpack_require__(1085);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4a6bb6a7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_PatientMessage_vue__ = __webpack_require__(1086);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1084)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-4a6bb6a7"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_PatientMessage_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_4a6bb6a7_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_PatientMessage_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageE/intelligentTriage/components/PatientMessage.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] PatientMessage.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4a6bb6a7", Component.options)
  } else {
    hotAPI.reload("data-v-4a6bb6a7", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1084:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1085:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
  props: {
    answer: {
      type: String
    },
    questionType: {
      type: Number
    }
  },
  name: "patient-message",
  data: function data() {
    return {
      logoUrl: wx.getStorageSync('logoUrl')
    };
  },

  computed: {
    anwserType: function anwserType() {
      return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_typeof___default()(this.answer);
    }
  },
  methods: {
    previewImg: function previewImg(item) {
      wx.previewImage({
        current: item, // 当前显示图片的http链接
        urls: this.answer // 需要预览的图片http链接列表
      });
    }
  }
});

/***/ }),

/***/ 1086:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "patient-message"
  }, [_c('article', {
    staticClass: "main-message-box-item"
  }, [_c('figure', {
    staticClass: "main-message-img"
  }, [(_vm.anwserType === 'string') ? _c('p', {
    staticClass: "message-content"
  }, [_vm._v(_vm._s(_vm.answer))]) : _vm._e(), _vm._v(" "), (_vm.anwserType !== 'string') ? _c('ul', {
    staticClass: "message-content-img"
  }, _vm._l((_vm.answer), function(item, index) {
    return (index < 12) ? _c('li', {
      key: index,
      staticClass: "answe-img",
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.previewImg(item)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item
      }
    }), _vm._v(" "), (index === 11) ? _c('div', {
      staticClass: "answer-mask"
    }, [_c('p', {
      staticClass: "answer-mask-content"
    }, [_c('i', {
      staticClass: "answer-mask-icon"
    }), _vm._v(" "), _c('span', {
      staticClass: "answer-mask-more"
    }, [_vm._v("查看全部")])], 1)], 1) : _vm._e()]) : _vm._e()
  })) : _vm._e(), _vm._v(" "), _c('img', {
    staticClass: "message-logo",
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })], 1)], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-4a6bb6a7", esExports)
  }
}

/***/ }),

/***/ 1087:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_vasLevel_vue__ = __webpack_require__(1089);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7aa970f6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_vasLevel_vue__ = __webpack_require__(1090);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(1088)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_vasLevel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_7aa970f6_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_vasLevel_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/vasLevel.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] vasLevel.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7aa970f6", Component.options)
  } else {
    hotAPI.reload("data-v-7aa970f6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 1088:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 1089:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
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
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Hallmader on 2018/7/18.
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      value: 2,
      indexList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //vas的一些数据
    };
  },

  props: {
    dataList: {
      type: Array,
      default: []
    }
  },
  methods: {
    sliderEvent: function sliderEvent(e) {
      this.value = e.mp.detail.value;
      console.log(e.mp.detail.value);
      this.$emit("getSliderEvent", e.mp.detail.value);
    }
  },
  mounted: function mounted() {},

  computed: {}
});

/***/ }),

/***/ 1090:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "vas"
  }, [_c('div', {
    staticClass: "body-view"
  }, [_c('div', {
    staticClass: "scope"
  }, [_c('div', [_vm._v("不痛")]), _vm._v(" "), _c('div', [_vm._v("巨痛")])]), _vm._v(" "), _c('div', {
    staticClass: "level"
  }, [_c('ul', _vm._l((_vm.indexList), function(item, index) {
    return _c('li', {
      key: index,
      class: [index == _vm.value ? 'active' : '']
    }, [_vm._v(_vm._s(item))])
  }))], 1), _vm._v(" "), _c('slider', {
    attrs: {
      "min": "0",
      "max": "10",
      "value": _vm.value,
      "color": "none",
      "block-size": "90",
      "eventid": '0'
    },
    on: {
      "change": _vm.sliderEvent,
      "changing": _vm.sliderEvent
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "fakeSlider",
    class: 'position_' + _vm.value
  }), _vm._v(" "), _c('div', {
    staticClass: "dot",
    class: 'position_' + _vm.value
  })])])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-7aa970f6", esExports)
  }
}

/***/ }),

/***/ 1091:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', [_c('section', {
    staticClass: "machine-message"
  }, [_c('article', {
    staticClass: "main-message-box-item"
  }, [_c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '0'
    }
  }, [(_vm.questionItem.questionDesc || _vm.questionItem.loading) ? _c('figure', {
    staticClass: "main-message-img"
  }, [_c('img', {
    staticClass: "message-logo",
    attrs: {
      "src": "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png",
      "alt": ""
    }
  }), _vm._v(" "), (!_vm.questionItem.loading) ? _c('p', {
    staticClass: "message-content"
  }, [_vm._v(_vm._s(_vm.questionItem.questionDesc)), (_vm.questionItem.questionType === 2) ? _c('span', {
    staticClass: "text-tip"
  }, [_vm._v("（可多选）")]) : _vm._e()]) : _vm._e(), _vm._v(" "), (_vm.questionItem.loading) ? _c('p', {
    staticClass: "message-content message-loading"
  }, [_c('span', {
    staticClass: "loading-text"
  }), _vm._v(" "), _c('span', {
    staticClass: "loading-text"
  }), _vm._v(" "), _c('span', {
    staticClass: "loading-text"
  })]) : _vm._e()], 1) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '1'
    }
  }, [(_vm.questionItem.questionType && _vm.questionItem.questionType !== 4 && _vm.questionItem.questionType !== 6 && !(_vm.questionItem.imgList && _vm.questionItem.imgList.length) && !_vm.questionItem.answer) ? _c('figure', {
    staticClass: "select-container"
  }, [_c('p', {
    staticClass: "select-title"
  }, [_vm._v("您可以点击标签快速回答：")]), _vm._v(" "), _c('ul', {
    staticClass: "select-list"
  }, _vm._l((_vm.questionItem.optionList), function(item, index) {
    return _c('li', {
      key: index,
      staticClass: "select-list-item",
      class: {
        'active': item.isActive,
          'item-block': _vm.questionItem.questionType === 5
      },
      attrs: {
        "eventid": '0-' + index
      },
      on: {
        "click": function($event) {
          _vm.itemSelect(index, item, _vm.questionItem.questionType)
        }
      }
    }, [_vm._v("\n              " + _vm._s(item.optionDesc) + "\n              "), _vm._v(" "), (item.isActive && (_vm.questionItem.questionType === 2 || _vm.questionItem.questionType === 5)) ? _c('i', {
      staticClass: "icon-select"
    }) : _vm._e()], 1)
  })), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '2'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [(_vm.questionItem.questionType === 2 || _vm.questionItem.questionType === 5) ? _c('button', {
    staticClass: "select-btn",
    class: {
      'active': _vm.currentSelect.length > 0
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '1'
    },
    on: {
      "click": _vm.selectSubmit
    }
  }, [_vm._v("选好了\n            ")]) : _vm._e()], 1)], 1) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '2'
    }
  }, [(_vm.questionItem.questionType === 4 && !_vm.questionItem.answer) ? _c('figure', {
    staticClass: "input-container"
  }, [_c('input', {
    directives: [{
      name: "model",
      rawName: "v-model.trim",
      value: (_vm.questionItem.questionValue),
      expression: "questionItem.questionValue",
      modifiers: {
        "trim": true
      }
    }],
    staticClass: "send-input",
    class: {
      'inputMarBot': _vm.inputMarBot
    },
    attrs: {
      "type": "text",
      "auto-focus": "true",
      "maxlength": "300",
      "eventid": '3'
    },
    domProps: {
      "value": (_vm.questionItem.questionValue)
    },
    on: {
      "focus": _vm.settingMbShow,
      "blur": [_vm.settingMbNoShow, function($event) {
        _vm.$forceUpdate()
      }],
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.questionItem.questionValue = $event.target.value.trim()
      }
    }
  }), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '5'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "send-btn",
    class: {
      'active': _vm.questionItem.questionValue.length, 'inputMarBot': _vm.inputMarBot
    },
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '4'
    },
    on: {
      "click": _vm.sendInput
    }
  }, [_vm._v("发送\n            ")])], 1)], 1) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '3'
    }
  }, [(_vm.questionItem.imgList && _vm.questionItem.imgList.length && !_vm.questionItem.answer) ? _c('figure', {
    staticClass: "img-container"
  }, [_c('ul', {
    staticClass: "img-list"
  }, [_vm._l((_vm.questionItem.imgList), function(item, index) {
    return (index < 11 || (_vm.questionItem.imgList.length === 36 && index <= 11)) ? _c('li', {
      key: index,
      staticClass: "img-list-item"
    }, [_c('img', {
      attrs: {
        "src": item.path,
        "alt": "",
        "eventid": '6-' + index
      },
      on: {
        "click": function($event) {
          _vm.previewImage(index)
        }
      }
    }), _vm._v(" "), ((!item.upload) && (!item.attId)) ? _c('span', {
      staticClass: "imgItem-cover"
    }, [_c('span', {
      staticClass: "imgItem-loading"
    })]) : _vm._e(), _vm._v(" "), _c('i', {
      staticClass: "close-icon",
      attrs: {
        "eventid": '7-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.imgDelToast(index)
        }
      }
    }), _vm._v(" "), (item.fail) ? _c('figure', {
      staticClass: "imgItem-fail",
      attrs: {
        "eventid": '8-' + index
      },
      on: {
        "click": function($event) {
          $event.stopPropagation();
          _vm.upLoadPic(item, index)
        }
      }
    }, [_c('p', {
      staticClass: "imgItem-failText"
    }, [_vm._v("上传失败")]), _vm._v(" "), _c('p', {
      staticClass: "imgItem-reloadText"
    }, [_vm._v("点击重试")])], 1) : _vm._e()], 1) : _vm._e()
  }), _vm._v(" "), (_vm.questionItem.imgList.length < 36) ? _c('li', {
    staticClass: "img-list-item wxChoseFileBtn",
    attrs: {
      "eventid": '9'
    },
    on: {
      "click": _vm.addImg
    }
  }, [_c('img', {
    attrs: {
      "src": "https://m1.allinmed.cn/static/image/mp/index/1.6.0/upload-img.png"
    }
  }), _vm._v(" "), _c('p', {
    staticClass: "chose-text"
  }, [_vm._v("上传照片")])], 1) : _vm._e()], 2), _vm._v(" "), _c('p', {
    staticClass: "tip-text"
  }, [_c('span', {
    staticClass: "img-num"
  }, [_vm._v("已上传" + _vm._s(_vm.questionItem.imgList.length) + "张" + _vm._s(_vm.questionItem.imgList.length > 11 ? '，' : ''))]), _vm._v(" "), (_vm.questionItem.imgList.length > 11) ? _c('span', {
    staticClass: "more-text",
    attrs: {
      "eventid": '10'
    },
    on: {
      "click": function($event) {
        _vm.previewImage(0)
      }
    }
  }, [_vm._v("查看全部")]) : _vm._e()]), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '12'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "img-submit",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '11'
    },
    on: {
      "click": _vm.imgSubmit
    }
  }, [_vm._v("确认上传\n            ")])], 1)], 1) : _vm._e()], 1)], 1)], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '5'
    }
  }, [(_vm.questionItem.answer && _vm.questionItem.answer !== '其他') ? _c('PatientMessage', {
    attrs: {
      "answer": _vm.questionItem.answer,
      "questionType": _vm.questionItem.questionType,
      "mpcomid": '4'
    }
  }) : _vm._e()], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade",
      "mpcomid": '7'
    }
  }, [(_vm.vasShow) ? _c('section', {
    staticClass: "pain-level-wrapper",
    attrs: {
      "eventid": '18'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.vasShow = false
      }
    }
  }, [_c('section', {
    staticClass: "pain-level-box",
    attrs: {
      "eventid": '17'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.vasShow = true
      }
    }
  }, [_c('h3', [_c('i', {
    staticClass: "icon-closePainLevel",
    attrs: {
      "eventid": '13'
    },
    on: {
      "click": function($event) {
        $event.stopPropagation();
        _vm.closePainLevel($event)
      }
    }
  })], 1), _vm._v(" "), _c('p', {
    staticClass: "pain-level-content"
  }, [_c('span', {
    staticClass: "pain-value-name"
  }, [_c('i', [_vm._v("疼痛程度:")]), _c('i', {
    staticClass: "name-text"
  }, [_vm._v(_vm._s(_vm.painValue))])], 1), _vm._v(" "), _c('span', {
    staticClass: "pain-value-desc"
  }, [_vm._v(" " + _vm._s(_vm.vasList[_vm.painValue] && _vm.vasList[_vm.painValue].optionDesc))])]), _vm._v(" "), _c('VAS', {
    attrs: {
      "eventid": '14',
      "mpcomid": '6'
    },
    on: {
      "getSliderEvent": _vm.getPainValue
    }
  }), _vm._v(" "), _c('form', {
    attrs: {
      "report-submit": "true",
      "eventid": '16'
    },
    on: {
      "submit": _vm.formSubmit
    }
  }, [_c('button', {
    staticClass: "pain-level-ensure",
    attrs: {
      "type": "submit",
      "formType": "submit",
      "eventid": '15'
    },
    on: {
      "click": _vm.levelSure
    }
  }, [_vm._v("确定\n          ")])], 1)], 1)], 1) : _vm._e()], 1)], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-878d3fb6", esExports)
  }
}

/***/ }),

/***/ 1092:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "interllingent-main"
  }, [_c('section', {
    staticClass: "main-message-interllingent ",
    class: {
      'picker-show': _vm.isShowPicker
    }
  }, [_c('p', {
    staticClass: "time-stamp"
  }, [_vm._v(_vm._s(_vm.nowDate))]), _vm._v(" "), _vm._l((_vm.messageList), function(item, index) {
    return _c('MachineMessage', {
      key: index,
      attrs: {
        "questionItem": item,
        "partId": _vm.partId,
        "postData": _vm.postData,
        "eventid": '0-' + index,
        "mpcomid": '0-' + index
      },
      on: {
        "nextQuestion": _vm.nextQuestion
      }
    })
  })], 2), _vm._v(" "), (_vm.isShowPicker) ? _c('section', {
    staticClass: "picker-main"
  }, [_c('section', {
    staticClass: "picker-view-container"
  }, [_c('h3', {
    staticClass: "picker-header"
  }, [_c('span', {
    staticClass: "picker-tittle"
  }, [_vm._v("患病时长")]), _vm._v(" "), _c('span', {
    staticClass: "picker-sure-btn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.pickerSure
    }
  }, [_vm._v("确定")])]), _vm._v(" "), _c('picker-view', {
    staticClass: "picker-main-container",
    attrs: {
      "indicator-style": "height: 34px; font-size:20px;",
      "value": _vm.dateObj.index,
      "eventid": '2'
    },
    on: {
      "change": _vm.bindPickerChange
    }
  }, [_c('picker-view-column', {
    attrs: {
      "mpcomid": '1'
    }
  }, _vm._l((_vm.dateObj.array), function(item, index) {
    return _c('view', {
      key: index,
      staticClass: "picker-item",
      staticStyle: {
        "line-height": "34px"
      }
    }, [_vm._v("\n            " + _vm._s(item.optionName) + "\n          ")])
  }))], 1)], 1)], 1) : _vm._e(), _vm._v(" "), (_vm.showTip) ? _c('confirm', {
    attrs: {
      "confirmParams": {
        'ensure': '继续填写',
        'cancel': ' 重新填写',
        'title': '是否继续上次咨询？'
      },
      "showFlag": _vm.showTip,
      "eventid": '3',
      "mpcomid": '2'
    },
    on: {
      "update:showFlag": function($event) {
        _vm.showTip = $event
      },
      "cancelClickEvent": function($event) {
        _vm.cancelShowTip()
      },
      "ensureClickEvent": function($event) {
        _vm.ensureShowTip()
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-0b3551f7", esExports)
  }
}

/***/ })

},[1307]);