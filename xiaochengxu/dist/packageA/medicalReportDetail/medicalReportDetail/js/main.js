global.webpackJsonp([112],{

/***/ 798:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_medicalReportDetail_vue__ = __webpack_require__(800);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_57e2fc89_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReportDetail_vue__ = __webpack_require__(801);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(799)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_medicalReportDetail_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_57e2fc89_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_medicalReportDetail_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageA/medicalReportDetail/medicalReportDetail.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] medicalReportDetail.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-57e2fc89", Component.options)
  } else {
    hotAPI.reload("data-v-57e2fc89", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 799:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 800:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_backIndex__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getMedicalReportDetails__ = __webpack_require__(133);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 * Created by qiangkailiang on 2017/8/21.
 */

 // 返回首页组件

 // 获取咨询单详情


var XHRList = {
  getInquiryPage: '/mcall/customer/patient/case/v1/getMapById/' //咨询单
};
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      caseId: '',
      finish: false,
      patientCasemap: {
        patientName: "",
        caseMain: "",
        attachmentList: "",
        height: 0,
        weight: 0,
        bmi: 0
      },
      caseType: '', // 病例类型 15-美年大健康
      physicalNo: '', // 美年大健康的体检报告ID
      showMoreImg: true,
      logoUrl: "",
      remarkContent: "",
      illnessTime: "",
      caseTime: "",
      heavyTime: "",
      treatmentName: "",
      illnessName: "",
      illnessDis: "",
      takeMedicine: "",
      getHelp: "",
      resultMainList: [],
      isUpload: -1,
      imageList1: [],
      urlArray: [],
      acheType: "", //疼痛类型
      VASGrade: '', //VAS评分
      treatmentList: [],
      all_find: "",
      backIndexShow: false, // 返回首页是否显示
      certificateCode: '' // 患者身份证号；
    };
  },
  onLoad: function onLoad() {
    if (wx.getStorageSync("backIndex")) {
      this.backIndexShow = true;
    } else {
      this.backIndexShow = false;
    }
    this.caseId = this.$root.$mp.query.caseId;
    this.imageList1 = [];
    this.isUpload = -1;
    this.urlArray = [];
    this.all_find = '';
    this.getMedicalReport();
  },

  computed: {
    formatName: function formatName() {
      console.log(this.patientCasemap.patientName);

      if (this.patientCasemap.patientName.length > 5) {
        return this.patientCasemap.patientName.substring(0, 5) + "...";
      } else {
        return this.patientCasemap.patientName;
      }
    }
  },
  components: {
    BackIndex: __WEBPACK_IMPORTED_MODULE_1_components_backIndex__["a" /* default */]
  },
  methods: {
    getMedicalReport: function getMedicalReport() {
      var that = this;
      that.finish = true;
      Object(__WEBPACK_IMPORTED_MODULE_2_common_js_HttpRequest_getMedicalReportDetails__["a" /* default */])({
        caseId: this.caseId,
        attUseFlag: 1,
        isOrder: 0
      }).then(function (data) {
        that.finish = false;
        if (data.responseObject && data.responseObject.responseData) {
          var _data = data.responseObject.responseData.dataList[0];
          that.patientCasemap = _data.patientCasemap;
          that.resultMainList = _data.resultMainList;
          that.getLogoUrl();
          var caseTime = that.patientCasemap.caseTime.split(' ')[0];
          that.caseTime = caseTime.split('-')[0] + '年' + caseTime.split('-')[1] + '月' + caseTime.split('-')[2] + '日';
          that.getHelp = that.patientCasemap.needHelp || "未填写";
          that.treatmentName = that.patientCasemap.treatmentName || "未填写";
          that.illnessName = that.patientCasemap.illnessName || "未填写";
          that.illnessDis = that.patientCasemap.descriptionDisease;
          that.takeMedicine = that.patientCasemap.takeMedicine || "未填写";
          that.caseType = that.patientCasemap.caseType;
          that.physicalNo = that.patientCasemap.physicalNo; // 美年大健康的体检报告ID
          that.certificateCode = that.patientCasemap.certificateCode;
          console.log(that.isUpload);
          that.isUpload = that.patientCasemap.isUpload;
          that.patientCasemap.attachmentList.forEach(function (element, index) {
            that.imageList1.push({
              caseAttUrl: element.caseAttUrl,
              isShow: index >= 9 ? false : true
            });
            that.urlArray.push(element.caseAttUrl);
          });
          //找医生来的
          that.treatmentList = _data.treatmentList;
          that.treatmentList.forEach(function (element) {
            that.all_find += element.commOptionName + "，";
            if (element.commIsAttachment == 4) {
              element.optionRemark = element.optionRemark.split('-')[0] + '年' + element.optionRemark.split('-')[1] + '月' + element.optionRemark.split('-')[2] + '日';
            }
          });
          that.all_find = that.all_find.substring(0, that.all_find.length - 1);
          if (that.resultMainList[0].symptomOptions[0].refQuestionList.length) {
            if (that.patientCasemap.caseType == 12 || that.patientCasemap.caseType == 13) {
              that.acheType = "";
              if (that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName.indexOf('疼痛') !== -1) {
                that.VASGrade = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName + that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionDesc; //VAS评分
              }
            } else {
              that.acheType = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName;
              if (that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName.indexOf('疼痛') !== -1) {
                that.VASGrade = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName + that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionDesc; //VAS评分
              }
            }
          }
          that.illnessTime = (that.resultMainList[1].symptomOptions[0].optionDesc && that.resultMainList[1].symptomOptions[0].optionDesc.length > 0 ? that.resultMainList[1].symptomOptions[0].optionDesc : that.resultMainList[1].symptomOptions[0].optionName) || "未填写";
          that.heavyTime = (that.resultMainList[2].symptomOptions[0].optionDesc && that.resultMainList[2].symptomOptions[0].optionDesc.length > 0 ? that.resultMainList[2].symptomOptions[0].optionDesc : that.resultMainList[2].symptomOptions[0].optionName) || "未填写";
        }
      });
    },
    showBigImg: function showBigImg(index) {
      var that = this;
      var arrTemp = [];
      that.imageList1.map(function (item, index) {
        arrTemp.push(item.caseAttUrl);
      });
      wx.previewImage({
        current: arrTemp[index], // 当前显示图片的http链接
        urls: arrTemp // 需要预览的图片http链接列表
      });
    },
    getLogoUrl: function getLogoUrl() {
      console.log(this.patientCasemap.sexName);
      var sex = this.patientCasemap.sexName,
          age = parseInt(this.patientCasemap.age),
          img = "";
      if (age <= 12) {
        img = 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_child@2x.png';
      } else if (age > 12 && age <= 59) {
        img = sex === "男" ? 'https://m.allinmed.cn/static/image/img00/myServices/chatting_chatting_man@2x.png' : 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_woman@2x.png';
      } else if (age >= 60) {
        img = sex === "男" ? 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_man@2x.png' : 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_woman@2x.png';
      }
      this.logoUrl = img;
    },
    goHealthReport: function goHealthReport() {
      wx.navigateTo({
        url: "/packageA/meinian/healthReport?from=medical&patientName=" + this.patientCasemap.patientName + "&certificateCode=" + this.certificateCode + "&physicalNo=" + this.physicalNo
      });
    }
  }
});

/***/ }),

/***/ 801:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "main-inner medical-report-detail"
  }, [_c('section', {
    staticClass: "tc-caseContentBox"
  }, [_c('section', {
    staticClass: "tc-baseInfo"
  }, [_c('ul', {
    staticClass: "tc-baseInfoList"
  }, [_c('li', {
    staticClass: "tc-baseInfoItem"
  }, [_c('div', {
    staticClass: "tc-baseInfoItemLeft"
  }, [_c('img', {
    attrs: {
      "src": _vm.logoUrl,
      "alt": ""
    }
  })]), _vm._v(" "), _c('div', {
    staticClass: "tc-baseInfoItemRight"
  }, [_c('article', {
    staticClass: "sexAgeBox"
  }, [_c('span', {
    staticClass: "tc-baseInfoName"
  }, [_vm._v(_vm._s(_vm.formatName))]), _vm._v(" "), _c('span', {
    staticClass: "tc-baseInfoSex"
  }, [_vm._v(" " + _vm._s(_vm.patientCasemap.sexName))]), _vm._v(" "), _c('span', {
    staticClass: "tc-baseInfoAge"
  }, [_vm._v(_vm._s(_vm.patientCasemap.age) + "  岁")])]), _vm._v(" "), _c('div', {
    staticClass: "inquiryTimeBox"
  }, [_vm._v("咨询日期:" + _vm._s(_vm.caseTime))])], 1)])], 1), _vm._v(" "), _c('section', {
    staticClass: "recommendUserMainBox"
  }, [_c('div', {
    staticClass: "recommendUserMainLeft"
  }, [_vm._v("主诉")]), _vm._v(" "), _c('div', {
    staticClass: "recommendUserMainRight"
  }, [_vm._v(_vm._s(_vm.patientCasemap.caseMain.caseMain))])])], 1), _vm._v(" "), _c('section', {
    staticClass: "tc-caseDescribe tc-module"
  }, [_c('section', {
    staticClass: "tc-caseDescribeTitle title"
  }, [_c('h3', [_vm._v("详情")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "tc-caseDescribeList"
  }, [(_vm.caseType == 15) ? _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("美年体检")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice mei-nian",
    attrs: {
      "eventid": '0'
    },
    on: {
      "click": function($event) {
        _vm.goHealthReport()
      }
    }
  }, [_vm._v("查看美年体检报告")])]) : _vm._e(), _vm._v(" "), (_vm.resultMainList[1] && _vm.resultMainList[1].symptomOptions[0] && _vm.resultMainList[1].symptomOptions[0].optionName) ? _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("持续时间")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.resultMainList[1].symptomOptions[0].optionName))])]) : _vm._e(), _vm._v(" "), (_vm.VASGrade.length) ? _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("VAS评分")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.VASGrade))])]) : _vm._e(), _vm._v(" "), (_vm.illnessDis.length && _vm.caseType != 15) ? _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("病情补充")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.illnessDis))])]) : _vm._e(), _vm._v(" "), _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("想获得的帮助")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.getHelp))])])], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "tc-caseDescribe tc-module"
  }, [_c('section', {
    staticClass: "tc-caseDescribeTitle title"
  }, [_c('h3', [_vm._v("诊治情况")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "tc-caseDescribeList"
  }, [_c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("检查资料")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.imageList1.length === 0 ? (_vm.isUpload === 1 ? "暂不上传片子" : "未拍片子") : "  "))]), _vm._v(" "), (_vm.imageList1.length !== 0) ? _c('ul', {
    staticClass: "uploadListsBox"
  }, _vm._l((_vm.imageList1), function(item, index) {
    return _c('li', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (item.isShow),
        expression: "item.isShow"
      }],
      key: index,
      attrs: {
        "eventid": '1-' + index
      },
      on: {
        "click": function($event) {
          _vm.showBigImg(index)
        }
      }
    }, [_c('img', {
      attrs: {
        "src": item.caseAttUrl
      }
    }), _vm._v(" "), (_vm.imageList1.length > 9 && index == 8 && _vm.showMoreImg) ? _c('span', {
      staticClass: "moreImg"
    }, [_vm._v("更多" + _vm._s(_vm.imageList1.length - 9) + "张")]) : _vm._e()])
  })) : _vm._e()], 1), _vm._v(" "), (_vm.treatmentList.length > 0 && (_vm.patientCasemap.caseType == 12 || _vm.patientCasemap.caseType == 13)) ? _c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("治疗情况")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.all_find))])]) : _vm._e(), _vm._v(" "), _vm._l((_vm.treatmentList), function(item, index) {
    return (_vm.treatmentList.length > 0 && (_vm.patientCasemap.caseType == 12 || _vm.patientCasemap.caseType == 13)) ? _c('section', {
      key: index
    }, [(item.optionDesc.length > 0) ? _c('li', {
      staticClass: "tc-caseDescribeItem"
    }, [_c('span', {
      staticClass: "tc-caseDescribeItemLeft"
    }, [_vm._v(_vm._s(item.commOptionDesc))]), _vm._v(" "), _c('span', {
      staticClass: "tc-caseDescribeItemRight tc-noRevice"
    }, [_vm._v(_vm._s(item.optionDesc))])]) : _vm._e(), _vm._v(" "), (item.commIsAttachment == 4) ? _c('li', {
      staticClass: "tc-caseDescribeItem"
    }, [_c('span', {
      staticClass: "tc-caseDescribeItemLeft"
    }, [_vm._v("手术时间")]), _vm._v(" "), _c('span', {
      staticClass: "tc-caseDescribeItemRight tc-noRevice"
    }, [_vm._v(_vm._s(item.optionRemark))])]) : _vm._e()], 1) : _vm._e()
  })], 2)], 1), _vm._v(" "), _c('section', {
    staticClass: "tc-caseDescribe tc-module"
  }, [_c('section', {
    staticClass: "tc-caseDescribeTitle title"
  }, [_c('h3', [_vm._v("基本信息")])], 1), _vm._v(" "), _c('ul', {
    staticClass: "tc-caseDescribeList"
  }, [_c('li', {
    staticClass: "tc-caseDescribeItem"
  }, [_c('span', {
    staticClass: "tc-caseDescribeItemLeft"
  }, [_vm._v("手机号码")]), _vm._v(" "), _c('span', {
    staticClass: "tc-caseDescribeItemRight tc-noRevice"
  }, [_vm._v(_vm._s(_vm.patientCasemap.mobile))])])], 1)], 1)], 1), _vm._v(" "), (_vm.backIndexShow) ? _c('BackIndex', {
    attrs: {
      "mpcomid": '0'
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
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-57e2fc89", esExports)
  }
}

/***/ })

},[1252]);