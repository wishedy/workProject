global.webpackJsonp([6],{

/***/ 977:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthRegister_vue__ = __webpack_require__(979);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_081a37b1_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthRegister_vue__ = __webpack_require__(988);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(978)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_healthRegister_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_081a37b1_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_healthRegister_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/packageD/healthCard/healthRegister.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] healthRegister.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-081a37b1", Component.options)
  } else {
    hotAPI.reload("data-v-081a37b1", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 978:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 979:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_components_picker_BasePickerNational__ = __webpack_require__(980);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_components_picker_BasePickerCity__ = __webpack_require__(984);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
 *
 * @Desc: 居民健康卡注册模块
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/3/27
 *
 */



/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      national: "", //民族
      showNational: false,
      province: "",
      city: "",
      hackReset: false,
      isActived: false //领取按钮
    };
  },
  onLoad: function onLoad() {},
  onShow: function onShow() {
    var _this = this;
    this.hackReset = true;
    this.national = "汉族";
    // 根据经纬度获取所在地城市
    __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].getLocationCity({
      name: "北京市"
    }).then(function (res) {
      console.log(res);
      if (res.provinceName) {
        _this.province = res.provinceName;
        _this.city = res.cityName;
      }
    });
    // console.log()
  },

  components: {
    pickerNational: __WEBPACK_IMPORTED_MODULE_1_components_picker_BasePickerNational__["a" /* default */],
    provinceCityPicker: __WEBPACK_IMPORTED_MODULE_2_components_picker_BasePickerCity__["a" /* default */]
  },
  methods: {
    selectBack: function selectBack(data) {
      console.log(data);
      this.national = data;
    },
    provinceCityChang: function provinceCityChang(e) {
      this.province = e.province;
      this.city = e.city;
    }
  }
});

/***/ }),

/***/ 980:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_BasePickerNational_vue__ = __webpack_require__(982);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_618ac0d9_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_BasePickerNational_vue__ = __webpack_require__(983);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(981)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-618ac0d9"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_BasePickerNational_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_618ac0d9_hasScoped_true_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_BasePickerNational_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/picker/BasePickerNational.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] BasePickerNational.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-618ac0d9", Component.options)
  } else {
    hotAPI.reload("data-v-618ac0d9", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 981:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 982:
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
//
//
//
//
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
 *
 * @Desc: 民族选择器
 * @Usage:  <compont :param="national" :selectType="1" :defaultClass="true" @selectNational="selectBack"></compont>
 *                    param: 民族   // “汉族”
 *                    selectType: 选择器类型        // 1-单列 普通  2-多列 自定义
 *                    defaultClass：选择器样式   // 当selectType =1 时 必传
 *                    selectNational：组件回调   // 返回选中值
 * @Notify：
 * @Depend：
 * Created by JK on 2019/3/27
 *
 */
/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      index: '', // 普通选择器 下标
      value: [0], // 默认民族值
      valueNmae: "", //民族值-多列
      minzu: [{ id: "01", name: "汉族" }, { id: "02", name: "蒙古族" }, { id: "03", name: "回族" }, { id: "04", name: "藏族" }, { id: "05", name: "维吾尔族" }, { id: "06", name: "苗族" }, { id: "07", name: "彝族" }, { id: "08", name: "壮族" }, { id: "09", name: "布依族" }, { id: "10", name: "朝鲜族" }, { id: "11", name: "满族" }, { id: "12", name: "侗族" }, { id: "13", name: "瑶族" }, { id: "14", name: "白族" }, { id: "15", name: "土家族" }, { id: "16", name: "哈尼族" }, { id: "17", name: "哈萨克族" }, { id: "18", name: "傣族" }, { id: "19", name: "黎族" }, { id: "20", name: "傈僳族" }, { id: "21", name: "佤族" }, { id: "22", name: "畲族" }, { id: "23", name: "高山族" }, { id: "24", name: "拉祜族" }, { id: "25", name: "水族" }, { id: "26", name: "东乡族" }, { id: "27", name: "纳西族" }, { id: "28", name: "景颇族" }, { id: "29", name: "柯尔克孜族" }, { id: "30", name: "土族" }, { id: "31", name: "达斡尔族" }, { id: "32", name: "仫佬族" }, { id: "33", name: "羌族" }, { id: "34", name: "布朗族" }, { id: "35", name: "撒拉族" }, { id: "36", name: "毛难族" }, { id: "37", name: "仡佬族" }, { id: "38", name: "锡伯族" }, { id: "39", name: "阿昌族" }, { id: "40", name: "普米族" }, { id: "41", name: "塔吉克族" }, { id: "42", name: "怒族" }, { id: "43", name: "乌孜别克族" }, { id: "44", name: "俄罗斯族" }, { id: "45", name: "鄂温克族" }, { id: "46", name: "崩龙族" }, { id: "47", name: "保安族" }, { id: "48", name: "裕固族" }, { id: "49", name: "京族" }, { id: "50", name: "塔塔尔族" }, { id: "51", name: "独龙族" }, { id: "52", name: "鄂伦春族" }, { id: "53", name: "赫哲族" }, { id: "54", name: "门巴族" }, { id: "55", name: "珞巴族" }, { id: "56", name: "基诺族" }],
      minzuList: ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛难族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "崩龙族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"]
    };
  },

  props: {
    selectType: {
      type: String,
      required: false,
      default: "1"
    },
    param: {
      type: String,
      required: false,
      default: ""
    },
    defaultClass: {
      type: String,
      required: false,
      default: ''
    }
  },
  onLoad: function onLoad() {
    var _this2 = this;

    console.log(this.param);
    var _minzu = [];
    this.minzu.forEach(function (element) {
      _minzu.push(element.name);
      if (element.name == _this2.param) {
        _this2.value = [element.id - 1];
      }
    });
  },

  methods: {
    // 多列选择器事件
    bindChange: function bindChange(e) {
      var _this = this;
      _this.value = e.target.value;
      _this.valueNmae = _this.minzu[e.target.value[0]].name;
    },
    selectEnFn: function selectEnFn() {},
    selectCanFn: function selectCanFn() {},

    // 普通选择器确定事件
    bindPickerChange: function bindPickerChange(e) {
      var _this = this;
      _this.value = e.target.value;
      _this.$emit("selectNational", _this.minzuList[_this.value]);
    }
  }
});

/***/ }),

/***/ 983:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "picker-main",
    class: {
      'defualtClass': _vm.defaultClass
    }
  }, [(_vm.selectType == '1') ? _c('view', {
    staticClass: "section"
  }, [_c('picker', {
    staticClass: "national-picker",
    attrs: {
      "mode": "selector",
      "value": _vm.value,
      "range": _vm.minzuList,
      "eventid": '0'
    },
    on: {
      "change": _vm.bindPickerChange
    }
  }, [_c('view', {
    staticClass: "picker"
  })])], 1) : _vm._e(), _vm._v(" "), (_vm.selectType == '2') ? _c('view', {
    staticClass: "picker-national"
  }, [_c('section', {
    staticClass: "timeSelect-bar"
  }, [_c('span', {
    staticClass: "timeCancel-enBtn",
    attrs: {
      "eventid": '1'
    },
    on: {
      "click": _vm.selectCanFn
    }
  }, [_vm._v("取消")]), _vm._v(" "), _c('span', {
    staticClass: "timeSelect-enBtn",
    attrs: {
      "eventid": '2'
    },
    on: {
      "click": _vm.selectEnFn
    }
  }, [_vm._v("确定")])]), _vm._v(" "), _c('picker-view', {
    staticStyle: {
      "width": "100%",
      "height": "300px"
    },
    attrs: {
      "indicator-style": "height: 50px;",
      "value": _vm.value,
      "eventid": '3'
    },
    on: {
      "change": _vm.bindChange
    }
  }, [_c('picker-view-column', {
    attrs: {
      "mpcomid": '0'
    }
  }, _vm._l((_vm.minzu), function(item, index) {
    return _c('view', {
      key: index,
      staticStyle: {
        "line-height": "50px",
        "text-align": "center"
      }
    }, [_vm._v(_vm._s(item.name))])
  }))], 1)], 1) : _vm._e()])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-618ac0d9", esExports)
  }
}

/***/ }),

/***/ 984:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_BasePickerCity_vue__ = __webpack_require__(986);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c88f60dc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_BasePickerCity_vue__ = __webpack_require__(987);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(985)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_script_index_0_BasePickerCity_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_template_compiler_index_id_data_v_c88f60dc_hasScoped_false_transformToRequire_video_src_source_src_img_src_image_xlink_href_node_modules_f_loat_mpvue_loader_1_0_15_f_loat_mpvue_loader_lib_selector_type_template_index_0_BasePickerCity_vue__["a" /* default */],
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/picker/BasePickerCity.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {return key !== "default" && key.substr(0, 2) !== "__"})) {console.error("named exports are not supported in *.vue files.")}
if (Component.options.functional) {console.error("[vue-loader] BasePickerCity.vue: functional components are not supported with templates, they should use render functions.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-c88f60dc", Component.options)
  } else {
    hotAPI.reload("data-v-c88f60dc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),

/***/ 985:
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 986:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__ = __webpack_require__(1);
//
//
//
//
//
//
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
 * 省市两级选择器
 * @module src/components/provinceCityPicker/provinceCityPicker.vue
 * @desc 可以根据微信定位初始化省市地址，通过调取百度经纬 地址转换接口。
 * @author liuyutao
 * @date 2019/3/5
 * @param {String} [defaultProvince]    - 默认省份
 * @param {String} [defaultCity] - 默认城市
 * @example 调用示例
 *   <province-city-picker
 *       @dataChange="provinceCityChang"
 *       :defaultProvince="province"
 *       :defaultCity="city"
 *       v-if="hackReset"
 *       ></province-city-picker>
 *
 * Created by liuyutao extend by JK on 2019/3/28
 */


var baiduAK2 = "RRkAmQiiYOGNCKgwFmgws34YBMTTABe3"; // 百度地图开放平台申请下的Key  web接口的  TODO:以后应换成公司注册的百度帐号。现为我自己的帐号创建的 liuyutao
var provinces = [{
  id: "",
  name: "请选择",
  cities: [["", "请选择"]]
}, {
  id: "110000",
  name: "北京市",
  cities: [["110100", "北京市"]]
}, {
  id: "120000",
  name: "天津市",
  cities: [["120100", "天津市"]]
}, {
  id: "130000",
  name: "河北省",
  cities: [["130100", "石家庄市"], ["130200", "唐山市"], ["130300", "秦皇岛市"], ["130400", "邯郸市"], ["130500", "邢台市"], ["130600", "保定市"], ["130700", "张家口市"], ["130800", "承德市"], ["130900", "沧州市"], ["131000", "廊坊市"], ["131100", "衡水市"]]
}, {
  id: "140000",
  name: "山西省",
  cities: [["140100", "太原市"], ["140200", "大同市"], ["140300", "阳泉市"], ["140400", "长治市"], ["140500", "晋城市"], ["140600", "朔州市"], ["140700", "晋中市"], ["140800", "运城市"], ["140900", "忻州市"], ["141000", "临汾市"], ["141100", "吕梁市"]]
}, {
  id: "150000",
  name: "内蒙古自治区",
  cities: [["150100", "呼和浩特市"], ["150200", "包头市"], ["150300", "乌海市"], ["150400", "赤峰市"], ["150500", "通辽市"], ["150600", "鄂尔多斯市"], ["150700", "呼伦贝尔市"], ["150800", "巴彦淖尔市"], ["150900", "乌兰察布市"], ["152200", "兴安盟"], ["152500", "锡林郭勒盟"], ["152900", "阿拉善盟"]]
}, {
  id: "210000",
  name: "辽宁省",
  cities: [["210100", "沈阳市"], ["210200", "大连市"], ["210300", "鞍山市"], ["210400", "抚顺市"], ["210500", "本溪市"], ["210600", "丹东市"], ["210700", "锦州市"], ["210800", "营口市"], ["210900", "阜新市"], ["211000", "辽阳市"], ["211100", "盘锦市"], ["211200", "铁岭市"], ["211300", "朝阳市"], ["211400", "葫芦岛市"]]
}, {
  id: "220000",
  name: "吉林省",
  cities: [["220100", "长春市"], ["220200", "吉林市"], ["220300", "四平市"], ["220400", "辽源市"], ["220500", "通化市"], ["220600", "白山市"], ["220700", "松原市"], ["220800", "白城市"], ["222400", "延边朝鲜族自治州"]]
}, {
  id: "230000",
  name: "黑龙江省",
  cities: [["230100", "哈尔滨市"], ["230200", "齐齐哈尔市"], ["230300", "鸡西市"], ["230400", "鹤岗市"], ["230500", "双鸭山市"], ["230600", "大庆市"], ["230700", "伊春市"], ["230800", "佳木斯市"], ["230900", "七台河市"], ["231000", "牡丹江市"], ["231100", "黑河市"], ["231200", "绥化市"], ["232700", "大兴安岭地区"]]
}, {
  id: "310000",
  name: "上海市",
  cities: [["310100", "上海市"]]
}, {
  id: "320000",
  name: "江苏省",
  cities: [["320100", "南京市"], ["320200", "无锡市"], ["320300", "徐州市"], ["320400", "常州市"], ["320500", "苏州市"], ["320600", "南通市"], ["320700", "连云港市"], ["320800", "淮安市"], ["320900", "盐城市"], ["321000", "扬州市"], ["321100", "镇江市"], ["321200", "泰州市"], ["321300", "宿迁市"]]
}, {
  id: "330000",
  name: "浙江省",
  cities: [["330100", "杭州市"], ["330200", "宁波市"], ["330300", "温州市"], ["330400", "嘉兴市"], ["330500", "湖州市"], ["330600", "绍兴市"], ["330700", "金华市"], ["330800", "衢州市"], ["330900", "舟山市"], ["331000", "台州市"], ["331100", "丽水市"]]
}, {
  id: "340000",
  name: "安徽省",
  cities: [["340100", "合肥市"], ["340200", "芜湖市"], ["340300", "蚌埠市"], ["340400", "淮南市"], ["340500", "马鞍山市"], ["340600", "淮北市"], ["340700", "铜陵市"], ["340800", "安庆市"], ["341000", "黄山市"], ["341100", "滁州市"], ["341200", "阜阳市"], ["341300", "宿州市"], ["341400", "巢湖市"], ["341500", "六安市"], ["341600", "亳州市"], ["341700", "池州市"], ["341800", "宣城市"]]
}, {
  id: "350000",
  name: "福建省",
  cities: [["350100", "福州市"], ["350200", "厦门市"], ["350300", "莆田市"], ["350400", "三明市"], ["350500", "泉州市"], ["350600", "漳州市"], ["350700", "南平市"], ["350800", "龙岩市"], ["350900", "宁德市"]]
}, {
  id: "360000",
  name: "江西省",
  cities: [["360100", "南昌市"], ["360200", "景德镇市"], ["360300", "萍乡市"], ["360400", "九江市"], ["360500", "新余市"], ["360600", "鹰潭市"], ["360700", "赣州市"], ["360800", "吉安市"], ["360900", "宜春市"], ["361000", "抚州市"], ["361100", "上饶市"]]
}, {
  id: "370000",
  name: "山东省",
  cities: [["370100", "济南市"], ["370200", "青岛市"], ["370300", "淄博市"], ["370400", "枣庄市"], ["370500", "东营市"], ["370600", "烟台市"], ["370700", "潍坊市"], ["370800", "济宁市"], ["370900", "泰安市"], ["371000", "威海市"], ["371100", "日照市"], ["371200", "莱芜市"], ["371300", "临沂市"], ["371400", "德州市"], ["371500", "聊城市"], ["371600", "滨州市"], ["371700", "荷泽市"]]
}, {
  id: "410000",
  name: "河南省",
  cities: [["410100", "郑州市"], ["410200", "开封市"], ["410300", "洛阳市"], ["410400", "平顶山市"], ["410500", "安阳市"], ["410600", "鹤壁市"], ["410700", "新乡市"], ["410800", "焦作市"], ["410900", "濮阳市"], ["411000", "许昌市"], ["411100", "漯河市"], ["411200", "三门峡市"], ["411300", "南阳市"], ["411400", "商丘市"], ["411500", "信阳市"], ["411600", "周口市"], ["410881", "济源市"], ["411700", "驻马店市"]]
}, {
  id: "420000",
  name: "湖北省",
  cities: [["420100", "武汉市"], ["420200", "黄石市"], ["420300", "十堰市"], ["420500", "宜昌市"], ["420600", "襄阳市"], ["420700", "鄂州市"], ["420800", "荆门市"], ["420900", "孝感市"], ["421000", "荆州市"], ["421100", "黄冈市"], ["421200", "咸宁市"], ["421300", "随州市"], ["422800", "恩施土家族苗族自治州"],
  // ['429000', '省直辖行政单位']]省直辖行政单位包括：仙桃市，潜江市，天门市，神农架林区
  ["429004", "仙桃市"], ["429005", "潜江市"], ["429006", "天门市"], ["429021", "神农架林区"]]
}, {
  id: "430000",
  name: "湖南省",
  cities: [["430100", "长沙市"], ["430200", "株洲市"], ["430300", "湘潭市"], ["430400", "衡阳市"], ["430500", "邵阳市"], ["430600", "岳阳市"], ["430700", "常德市"], ["430800", "张家界市"], ["430900", "益阳市"], ["431000", "郴州市"], ["431100", "永州市"], ["431200", "怀化市"], ["431300", "娄底市"], ["433100", "湘西土家族苗族自治州"]]
}, {
  id: "440000",
  name: "广东省",
  cities: [["440100", "广州市"], ["440200", "韶关市"], ["440300", "深圳市"], ["440400", "珠海市"], ["440500", "汕头市"], ["440600", "佛山市"], ["440700", "江门市"], ["440800", "湛江市"], ["440900", "茂名市"], ["441200", "肇庆市"], ["441300", "惠州市"], ["441400", "梅州市"], ["441500", "汕尾市"], ["441600", "河源市"], ["441700", "阳江市"], ["441800", "清远市"], ["441900", "东莞市"], ["442000", "中山市"], ["445100", "潮州市"], ["445200", "揭阳市"], ["445300", "云浮市"]]
}, {
  id: "450000",
  name: "广西壮族自治区",
  cities: [["450100", "南宁市"], ["450200", "柳州市"], ["450300", "桂林市"], ["450400", "梧州市"], ["450500", "北海市"], ["450600", "防城港市"], ["450700", "钦州市"], ["450800", "贵港市"], ["450900", "玉林市"], ["451000", "百色市"], ["451100", "贺州市"], ["451200", "河池市"], ["451300", "来宾市"], ["451400", "崇左市"]]
}, {
  id: "460000",
  name: "海南省",
  cities: [["460100", "海口市"], ["460200", "三亚市"],
  // ['469000', '省直辖县级行政单位'],
  ["469001", "五指山市"], ["469002", "琼海市"], ["469005", "文昌市"], ["469006", "万宁市"], ["469007", "东方市"], ["469025", "定安县"], ["469026", "屯昌县"], ["469027", "澄迈县"], ["469028", "临高县"], ["469030", "白沙黎族自治县"], ["469031", "昌江黎族自治县"], ["469033", "乐东黎族自治县"], ["469034", "陵水黎族自治县"], ["469035", "保亭黎族苗族自治县"], ["469036", "琼中黎族苗族自治县"]]
}, {
  id: "500000",
  name: "重庆市",
  cities: [["500100", "重庆市"]]
}, {
  id: "510000",
  name: "四川省",
  cities: [["510100", "成都市"], ["510300", "自贡市"], ["510400", "攀枝花市"], ["510500", "泸州市"], ["510600", "德阳市"], ["510700", "绵阳市"], ["510800", "广元市"], ["510900", "遂宁市"], ["511000", "内江市"], ["511100", "乐山市"], ["511300", "南充市"], ["511400", "眉山市"], ["511500", "宜宾市"], ["511600", "广安市"], ["511700", "达州市"], ["511800", "雅安市"], ["511900", "巴中市"], ["512000", "资阳市"], ["513200", "阿坝藏族羌族自治州"], ["513300", "甘孜藏族自治州"], ["513400", "凉山彝族自治州"]]
}, {
  id: "520000",
  name: "贵州省",
  cities: [["520100", "贵阳市"], ["520200", "六盘水市"], ["520300", "遵义市"], ["520400", "安顺市"], ["522200", "铜仁地区"], ["522300", "黔西南布依族苗族自治州"], ["522400", "毕节地区"], ["522600", "黔东南苗族侗族自治州"], ["522700", "黔南布依族苗族自治州"]]
}, {
  id: "530000",
  name: "云南省",
  cities: [["530100", "昆明市"], ["530300", "曲靖市"], ["530400", "玉溪市"], ["530500", "保山市"], ["530600", "昭通市"], ["530700", "丽江市"], ["530800", "思茅市"], ["530900", "临沧市"], ["532300", "楚雄彝族自治州"], ["532500", "红河哈尼族彝族自治州"], ["532600", "文山壮族苗族自治州"], ["532800", "西双版纳傣族自治州"], ["532900", "大理白族自治州"], ["533100", "德宏傣族景颇族自治州"], ["533300", "怒江傈僳族自治州"], ["533400", "迪庆藏族自治州"]]
}, {
  id: "540000",
  name: "西藏自治区",
  cities: [["540100", "拉萨市"], ["542100", "昌都地区"], ["542200", "山南地区"], ["542300", "日喀则地区"], ["542400", "那曲地区"], ["542500", "阿里地区"], ["542600", "林芝地区"]]
}, {
  id: "610000",
  name: "陕西省",
  cities: [["610100", "西安市"], ["610200", "铜川市"], ["610300", "宝鸡市"], ["610400", "咸阳市"], ["610500", "渭南市"], ["610600", "延安市"], ["610700", "汉中市"], ["610800", "榆林市"], ["610900", "安康市"], ["611000", "商洛市"]]
}, {
  id: "620000",
  name: "甘肃省",
  cities: [["620100", "兰州市"], ["620200", "嘉峪关市"], ["620300", "金昌市"], ["620400", "白银市"], ["620500", "天水市"], ["620600", "武威市"], ["620700", "张掖市"], ["620800", "平凉市"], ["620900", "酒泉市"], ["621000", "庆阳市"], ["621100", "定西市"], ["621200", "陇南市"], ["622900", "临夏回族自治州"], ["623000", "甘南藏族自治州"]]
}, {
  id: "630000",
  name: "青海省",
  cities: [["630100", "西宁市"], ["632100", "海东地区"], ["632200", "海北藏族自治州"], ["632300", "黄南藏族自治州"], ["632500", "海南藏族自治州"], ["632600", "果洛藏族自治州"], ["632700", "玉树藏族自治州"], ["632800", "海西蒙古族藏族自治州"]]
}, {
  id: "640000",
  name: "宁夏回族自治区",
  cities: [["640100", "银川"], ["640200", "石嘴山"], ["640300", "吴忠"], ["640400", "固原"], ["640500", "中卫"]]
}, {
  id: "650000",
  name: "新疆维吾尔自治区",
  cities: [["650100", "乌鲁木齐市"], ["650200", "克拉玛依市"], ["652100", "吐鲁番地区"], ["652200", "哈密地区"], ["652300", "昌吉回族自治州"], ["652700", "博尔塔拉蒙古自治州"], ["652800", "巴音郭楞蒙古自治州"], ["652900", "阿克苏地区"], ["653000", "克孜勒苏柯尔克孜自治州"], ["653100", "喀什地区"], ["653200", "和田地区"], ["654000", "伊犁哈萨克自治州"], ["654200", "塔城地区"], ["654300", "阿勒泰地区"],
  // ['659000', '省直辖行政单位']
  ["659001", "石河子市"], ["659002", "阿拉尔市"], ["659003", "图木舒克市"], ["659004", "五家渠市"], ["659005", "北屯市"], ["659006", "铁门关市"], ["659007", "双河市"], ["659008", "可克达拉市"], ["659009", "昆玉市"]]
}, {
  id: "710000",
  name: "台湾省",
  cities: [["710100", "台湾"]]
}, {
  id: "810000",
  name: "香港特别行政区",
  cities: [["810100", "香港"]]
}, {
  id: "820000",
  name: "澳门特别行政区",
  cities: [["820100", "澳门"]]
}];
/* harmony default export */ __webpack_exports__["a"] = ({
  name: "provinceCityPicker",
  data: function data() {
    return {
      provinceIndex: 0,
      multiArray: [["请选择", "北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省", "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "台湾省", "香港特别行政区", "澳门特别行政区"], ["请选择"]],
      objectMultiArray: [[{ id: "", name: "请选择" }, { id: "110000", name: "北京市" }, { id: "120000", name: "天津市" }, { id: "130000", name: "河北省" }, { id: "140000", name: "山西省" }, { id: "150000", name: "内蒙古自治区" }, { id: "210000", name: "辽宁省" }, { id: "220000", name: "吉林省" }, { id: "230000", name: "黑龙江省" }, { id: "310000", name: "上海市" }, { id: "320000", name: "江苏省" }, { id: "330000", name: "浙江省" }, { id: "340000", name: "安徽省" }, { id: "350000", name: "福建省" }, { id: "360000", name: "江西省" }, { id: "370000", name: "山东省" }, { id: "410000", name: "河南省" }, { id: "420000", name: "湖北省" }, { id: "430000", name: "湖南省" }, { id: "440000", name: "广东省" }, { id: "450000", name: "广西壮族自治区" }, { id: "460000", name: "海南省" }, { id: "500000", name: "重庆市" }, { id: "510000", name: "四川省" }, { id: "520000", name: "贵州省" }, { id: "530000", name: "云南省" }, { id: "540000", name: "西藏自治区" }, { id: "610000", name: "陕西省" }, { id: "620000", name: "甘肃省" }, { id: "630000", name: "青海省" }, { id: "640000", name: "宁夏回族自治区" }, { id: "650000", name: "新疆维吾尔自治区" }, { id: "710000", name: "台湾省" }, { id: "810000", name: "香港特别行政区" }, { id: "820000", name: "澳门特别行政区" }], [{
        id: "",
        name: "请选择"
      }]],
      multiIndex: [0, 0],
      provinceName: "请选择",
      provinceId: "",
      cityName: "",
      cityId: ""
    };
  },

  computed: {
    selectedResult: function selectedResult() {
      console.log(this.provinceId);
      if (this.provinceId == "") {
        // 尚未选择
        return "请选择";
      } else {
        return (this.provinceName.length > 5 ? this.provinceName.substr(0, 5) + "..." : this.provinceName) + "," + (this.cityName.length > 5 ? this.cityName.substr(0, 5) + "..." : this.cityName);
      }
    }
  },
  mounted: function mounted() {
    // TODO: 初始化当前位置
  },
  onShow: function onShow() {
    this.provinceName = "请选择";
    this.provinceId = "";
    this.cityName = "";
    this.cityId = "";
    console.log("onShow picker");
  },
  onHide: function onHide() {
    this.provinceName = "请选择";
    this.provinceId = "";
    this.cityName = "";
    this.cityId = "";
  },
  onLoad: function onLoad() {
    console.log("onLoad picker");
    this.provinceName = "请选择";
    this.provinceId = "";
    this.cityName = "";
    this.cityId = "";
    console.log("default");
    console.log(this.defaultProvince, this.defaultCity);
    if (!this.defaultProvince && !this.defaultCity) {
      // 没有初始值的话
      console.log("reinit");
      this.initLocation(); // 初始化定位地址
    } else {
      // 有初始值的话
      this.provinceName = this.defaultProvince;
      this.cityName = this.defaultCity;
      this.initProvinceAndCity();
    }
    this.$forceUpdate();
  },

  props: {
    defaultProvince: {
      type: String
    },
    defaultCity: {
      type: String
    },
    cityErrorTip: {
      type: String
    }
  },

  methods: {
    initLocation: function initLocation() {
      var _this = this;
      wx.getLocation({
        type: "wgs84",
        success: function success(res) {
          //   console.log(res);
          var location = {
            latitude: res ? res.latitude : "", //经度
            longitude: res ? res.longitude : "" //纬度
          };
          var location2 = res.latitude + "," + res.longitude;
          __WEBPACK_IMPORTED_MODULE_0_common_js_util_util__["a" /* default */].ajax({
            url: "https://api.map.baidu.com/geocoder/v2/?output=json&ak=" + baiduAK2 + "&location=" + location2,
            done: function done(data) {
              if (data && data.status == 0) {
                if (data.result) {
                  //   console.log("init baidu location");
                  _this.provinceName = data.result.addressComponent.province;
                  _this.cityName = data.result.addressComponent.city;
                  _this.initProvinceAndCity();
                }
              }
            }
          });
        },
        fail: function fail(err) {
          console.log("用户拒绝授权，无法获取位置信息");
        }
      });
    },

    // 值改变
    bindMultiPickerChange: function bindMultiPickerChange(e) {
      var _this = this;
      console.log("picker发送选择改变，携带值为", e.target.value);
      this.multiIndex = e.target.value;
      _this.provinceIndex = e.target.value[0];
      var param = void 0;
      if (_this.multiIndex[0] == 0) {
        //
        _this.provinceName = "请选择";
        param = {
          provinceId: "",
          province: "",
          city: "",
          cityId: ""
        };
      } else if (_this.multiIndex[0] > 0) {
        _this.provinceName = _this.multiArray[0][_this.provinceIndex];
        _this.provinceId = provinces[_this.provinceIndex].id;
        _this.$set(_this.multiArray, 1, _this.getCitiesByProvinceName(_this.provinceName)); // 设置城市列表
        console.log(_this.multiArray);
        var cityIndex = this.multiIndex[1];
        _this.cityName = _this.multiArray[1][cityIndex];
        _this.cityId = provinces[_this.provinceIndex].cities[cityIndex][0];
        param = {
          provinceId: _this.provinceId,
          province: _this.provinceName,
          city: _this.cityName,
          cityId: _this.cityId
        };
      }

      console.log(param);
      _this.$emit("dataChange", param);
    },

    // 列改变
    bindMultiPickerColumnChange: function bindMultiPickerColumnChange(e) {
      var _this = this;
      console.log("修改的列为", e.target.column, "，值为", e.target.value);
      this.multiIndex[e.target.column] = e.target.value;
      if (e.target.column === 0) {
        var provinceIndex = e.target.value;
        var provinceName = _this.multiArray[0][provinceIndex];
        console.log(provinceName);
        _this.provinceId = provinces[provinceIndex].id;
        _this.$set(_this.multiArray, 1, _this.getCitiesByProvinceName(provinceName)); // 设置城市列表
        //  _this.$set(_this.multiIndex, 1, 0);   // 选中城市第一个元素
        _this.$set(_this.multiIndex, 1, 0); // 选中城市第一个元素
      } else {
        var cityIndex = e.target.value;
        // _this.cityName = _this.multiArray[1][cityIndex];
        // _this.cityId = provinces[_this.provinceIndex].cities[cityIndex][0];
      }
    },

    // 根据省份获取市
    getCitiesByProvinceName: function getCitiesByProvinceName(provinceName) {
      var cities = [];
      for (var i = 0; i < provinces.length; i++) {
        var province = provinces[i];
        if (province.name === provinceName) {
          for (var j = 0; j < province.cities.length; j++) {
            cities.push(province.cities[j][1]);
          }
          return cities;
        }
      }
    },

    // 根据父组件传入的省与市 或 百度的省或市 进行初始化
    // 根据 this.provinceName 和 this.city
    // TODO 湖北 新疆 等省有一些二级行政单位写的省级直辖的行政单位有可能选择不到。
    initProvinceAndCity: function initProvinceAndCity() {
      console.log("init-address");
      var _this = this;
      _this.provinceIndex = 0;
      for (var i = 0; i < provinces.length; i++) {
        // 遍历省份
        if (this.provinceName === provinces[i].name) {
          _this.provinceIndex = i;
          _this.provinceId = provinces[i].id;
          _this.$set(_this.multiArray, 1, _this.getCitiesByProvinceName(_this.provinceName)); // 设置城市列表
          _this.$set(_this.multiIndex, 0, _this.provinceIndex); // 选中省份
          _this.$set(_this.multiIndex, 1, 0); // 选中城市第一个元素

          _this.cityName = provinces[_this.provinceIndex].cities[0][1];
          _this.cityId = provinces[_this.provinceIndex].cities[0][0];
          break;
        }
      }
      if (this.cityName == "县") {
        // 产品让把直辖市下定位到的县，直接改为市。不用选择到县
        _this.cityId = provinces[_this.provinceIndex].cities[0][0];
        _this.cityName = provinces[_this.provinceIndex].cities[0][1];
      } else {
        // 遍历城市
        for (var _i = 0; _i < provinces[_this.provinceIndex].cities.length; _i++) {
          var city = provinces[_this.provinceIndex].cities[_i];
          if (this.cityName === provinces[_this.provinceIndex].cities[_i][1]) {
            _this.cityId = provinces[_this.provinceIndex].cities[_i][0];
            break;
          }
        }
      }

      var param = {
        provinceId: _this.provinceId,
        province: _this.provinceName,
        city: _this.cityName,
        cityId: _this.cityId
      };
      _this.$emit("dataChange", param);
    }
  }
});

/***/ }),

/***/ 987:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "cityPicker-main"
  }, [_c('picker', {
    attrs: {
      "mode": "multiSelector",
      "value": _vm.multiIndex,
      "range": _vm.multiArray,
      "eventid": '0'
    },
    on: {
      "change": _vm.bindMultiPickerChange,
      "columnchange": _vm.bindMultiPickerColumnChange
    }
  }, [_c('view', {
    staticClass: "picker"
  }, [_c('div', {
    staticClass: "right"
  })])])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-c88f60dc", esExports)
  }
}

/***/ }),

/***/ 988:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('section', {
    staticClass: "regist-main"
  }, [_c('section', {
    staticClass: "title"
  }, [_vm._v("注册居民健康卡，有利于医生了解您的病情")]), _vm._v(" "), _c('section', {
    staticClass: "registInfo-content"
  }, [_c('section', {
    staticClass: "registInfo-item"
  }, [_c('span', {
    staticClass: "registInfo-itemType"
  }, [_vm._v("姓名")]), _vm._v(" "), _c('input', {
    staticClass: "registInfo-itemInput",
    attrs: {
      "placeholder-class": 'placeholderClass',
      "placeholder": "请输入姓名",
      "type": "text"
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "registInfo-item"
  }, [_c('span', {
    staticClass: "registInfo-itemType"
  }, [_vm._v("身份证号")]), _vm._v(" "), _c('input', {
    staticClass: "registInfo-itemInput",
    attrs: {
      "placeholder-class": 'placeholderClass',
      "placeholder": "请输入证件号",
      "type": "text"
    }
  })]), _vm._v(" "), _c('section', {
    staticClass: "registInfo-item"
  }, [_c('span', {
    staticClass: "registInfo-itemType"
  }, [_vm._v("民族")]), _vm._v(" "), _c('section', {
    staticClass: "registInfo-itemNational"
  }, [_vm._v(_vm._s(_vm.national))]), _vm._v(" "), _c('pickerNational', {
    attrs: {
      "param": _vm.national,
      "selectType": 1,
      "defaultClass": true,
      "eventid": '0',
      "mpcomid": '0'
    },
    on: {
      "selectNational": _vm.selectBack
    }
  })], 1), _vm._v(" "), _c('section', {
    staticClass: "registInfo-item"
  }, [_c('span', {
    staticClass: "registInfo-itemType city"
  }, [_vm._v("所在城市")]), _vm._v(" "), _c('span', {
    staticClass: "registInfo-itemCity"
  }, [_vm._v(_vm._s(_vm.province) + " " + _vm._s(_vm.city))]), _vm._v(" "), (_vm.hackReset) ? _c('province-city-picker', {
    attrs: {
      "defaultProvince": _vm.province,
      "defaultCity": _vm.city,
      "eventid": '1',
      "mpcomid": '1'
    },
    on: {
      "dataChange": _vm.provinceCityChang
    }
  }) : _vm._e()], 1)], 1), _vm._v(" "), _c('section', {
    staticClass: "regist-submitBtn",
    class: {
      'actived': _vm.isActived
    }
  }, [_vm._v("领取")])], 1)
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
     require("vue-loader/node_modules/vue-hot-reload-api").rerender("data-v-081a37b1", esExports)
  }
}

/***/ })

},[1289]);