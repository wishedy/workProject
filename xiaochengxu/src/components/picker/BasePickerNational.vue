<template>
  <section class="picker-main" :class="{'defualtClass':defaultClass}">
    <!-- 普通选择器 -->
    <view class="section" v-if="selectType=='1'">
      <picker class="national-picker" mode = selector @change="bindPickerChange" :value="value" :range="minzuList">
        <view class="picker"></view>
      </picker>
    </view>
    <!-- 多列选择器 -->
    <view class="picker-national" v-if="selectType=='2'">
      <section class="timeSelect-bar">
        <span class="timeCancel-enBtn" @click="selectCanFn">取消</span>
        <span class="timeSelect-enBtn" @click="selectEnFn">确定</span>
      </section>
      <picker-view
        indicator-style="height: 50px;"
        style="width: 100%; height: 300px;"
        :value="value"
        @change="bindChange"
      >
        <picker-view-column>
          <view
            v-for="(item,index) in minzu"
            :key="index"
            style="line-height: 50px;text-align:center"
          >{{item.name}}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </section>
</template>

<script>
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
export default {
  data() {
    return {
      index:'',       // 普通选择器 下标
      value: [0],   // 默认民族值
      valueNmae: "",    //民族值-多列
      minzu: [
        { id: "01", name: "汉族" },
        { id: "02", name: "蒙古族" },
        { id: "03", name: "回族" },
        { id: "04", name: "藏族" },
        { id: "05", name: "维吾尔族" },
        { id: "06", name: "苗族" },
        { id: "07", name: "彝族" },
        { id: "08", name: "壮族" },
        { id: "09", name: "布依族" },
        { id: "10", name: "朝鲜族" },
        { id: "11", name: "满族" },
        { id: "12", name: "侗族" },
        { id: "13", name: "瑶族" },
        { id: "14", name: "白族" },
        { id: "15", name: "土家族" },
        { id: "16", name: "哈尼族" },
        { id: "17", name: "哈萨克族" },
        { id: "18", name: "傣族" },
        { id: "19", name: "黎族" },
        { id: "20", name: "傈僳族" },
        { id: "21", name: "佤族" },
        { id: "22", name: "畲族" },
        { id: "23", name: "高山族" },
        { id: "24", name: "拉祜族" },
        { id: "25", name: "水族" },
        { id: "26", name: "东乡族" },
        { id: "27", name: "纳西族" },
        { id: "28", name: "景颇族" },
        { id: "29", name: "柯尔克孜族" },
        { id: "30", name: "土族" },
        { id: "31", name: "达斡尔族" },
        { id: "32", name: "仫佬族" },
        { id: "33", name: "羌族" },
        { id: "34", name: "布朗族" },
        { id: "35", name: "撒拉族" },
        { id: "36", name: "毛难族" },
        { id: "37", name: "仡佬族" },
        { id: "38", name: "锡伯族" },
        { id: "39", name: "阿昌族" },
        { id: "40", name: "普米族" },
        { id: "41", name: "塔吉克族" },
        { id: "42", name: "怒族" },
        { id: "43", name: "乌孜别克族" },
        { id: "44", name: "俄罗斯族" },
        { id: "45", name: "鄂温克族" },
        { id: "46", name: "崩龙族" },
        { id: "47", name: "保安族" },
        { id: "48", name: "裕固族" },
        { id: "49", name: "京族" },
        { id: "50", name: "塔塔尔族" },
        { id: "51", name: "独龙族" },
        { id: "52", name: "鄂伦春族" },
        { id: "53", name: "赫哲族" },
        { id: "54", name: "门巴族" },
        { id: "55", name: "珞巴族" },
        { id: "56", name: "基诺族" }
      ],
      minzuList: [
        "汉族",
        "蒙古族",
        "回族",
        "藏族",
        "维吾尔族",
        "苗族",
        "彝族",
        "壮族",
        "布依族",
        "朝鲜族",
        "满族",
        "侗族",
        "瑶族",
        "白族",
        "土家族",
        "哈尼族",
        "哈萨克族",
        "傣族",
        "黎族",
        "傈僳族",
        "佤族",
        "畲族",
        "高山族",
        "拉祜族",
        "水族",
        "东乡族",
        "纳西族",
        "景颇族",
        "柯尔克孜族",
        "土族",
        "达斡尔族",
        "仫佬族",
        "羌族",
        "布朗族",
        "撒拉族",
        "毛难族",
        "仡佬族",
        "锡伯族",
        "阿昌族",
        "普米族",
        "塔吉克族",
        "怒族",
        "乌孜别克族",
        "俄罗斯族",
        "鄂温克族",
        "崩龙族",
        "保安族",
        "裕固族",
        "京族",
        "塔塔尔族",
        "独龙族",
        "鄂伦春族",
        "赫哲族",
        "门巴族",
        "珞巴族",
        "基诺族"
      ]
    };
  },
  props: {
    selectType:{
      type:String,
      required: false,
      default: "1"
    },
    param: {
      type: String,
      required: false,
      default: ""
    },
    defaultClass:{
      type:String,
      required:false,
      default:''
    }
  },
  onLoad() {
    console.log(this.param);
    let _minzu = [];
    this.minzu.forEach(element => {
      _minzu.push(element.name);
      if (element.name == this.param) {
        this.value = [element.id - 1];
      }
    });
  },
  methods: {
    // 多列选择器事件
    bindChange(e) {
      let _this = this;
      _this.value = e.target.value;
      _this.valueNmae = _this.minzu[e.target.value[0]].name;
    },
    selectEnFn() {},
    selectCanFn() {},
    // 普通选择器确定事件
    bindPickerChange(e){
      let _this = this;
      _this.value = e.target.value;
      _this.$emit("selectNational",_this.minzuList[_this.value]);
    }
  }
};
</script>

<style lang="scss" scoped>
.picker-main{
  &.defualtClass{
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
.section {
    height: 100%;
  }
  .national-picker {
    height: 100%;
    position: relative;
    .picker {
      position: absolute;
      display: block;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
.picker-national {
  position: absolute;
  opacity: 1;
  bottom: 0;
  z-index: 2;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 -3px 4px 0 rgba(77, 77, 77, 0.12);
  .timeSelect-bar {
    position: relative;
    height: 100px;
    .timeCancel-enBtn {
      position: absolute;
      font-size: 32px;
      color: #909090;
      left: 40px;
      top: 46px;
    }
    .timeSelect-enBtn {
      font-size: 32px;
      color: #00beaf;
      position: absolute;
      right: 40px;
      top: 46px;
    }
  }
  .timeSelect-box {
    padding-left: 58px;
    box-sizing: border-box;
  }
}
}
</style>

