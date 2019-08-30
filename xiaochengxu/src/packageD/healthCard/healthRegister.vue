<template>
  <section class="regist-main">
    <section class="title">注册居民健康卡，有利于医生了解您的病情</section>
    <section class="registInfo-content">
      <section class="registInfo-item">
        <span class="registInfo-itemType">姓名</span>
        <input
          class="registInfo-itemInput"
          :placeholder-class="'placeholderClass'"
          placeholder="请输入姓名"
          type="text"
        >
      </section>
      <section class="registInfo-item">
        <span class="registInfo-itemType">身份证号</span>
        <input
          class="registInfo-itemInput"
          :placeholder-class="'placeholderClass'"
          placeholder="请输入证件号"
          type="text"
        >
      </section>
      <section class="registInfo-item">
        <span class="registInfo-itemType">民族</span>
        <section class="registInfo-itemNational">{{national}}</section>
        <pickerNational
          :param="national"
          :selectType="1"
          :defaultClass="true"
          @selectNational="selectBack"
        ></pickerNational>
      </section>
      <section class="registInfo-item">
        <span class="registInfo-itemType city">所在城市</span>
        <span class="registInfo-itemCity">{{province}} {{city}}</span>
        <province-city-picker
          @dataChange="provinceCityChang"
          :defaultProvince="province"
          :defaultCity="city"
          v-if="hackReset"
        ></province-city-picker>
      </section>
    </section>
    <section class="regist-submitBtn" :class="{'actived':isActived}">领取</section>
  </section>
</template>

<script>
/**
 *
 * @Desc: 居民健康卡注册模块
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/3/27
 *
 */
import api from "common/js/util/util";
import pickerNational from "components/picker/BasePickerNational";
import provinceCityPicker from "components/picker/BasePickerCity";
export default {
  data() {
    return {
      national: "", //民族
      showNational: false,
      province: "",
      city: "",
      hackReset: false,
      isActived: false //领取按钮
    };
  },
  onLoad() {},
  onShow() {
    let _this = this;
    this.hackReset = true;
    this.national = "汉族";
    // 根据经纬度获取所在地城市
    api
      .getLocationCity({
        name: "北京市"
      })
      .then(res => {
        console.log(res);
        if (res.provinceName) {
          _this.province = res.provinceName;
          _this.city = res.cityName;
        }
      });
    // console.log()
  },
  components: {
    pickerNational,
    provinceCityPicker
  },
  methods: {
    selectBack(data) {
      console.log(data);
      this.national = data;
    },
    provinceCityChang(e) {
      this.province = e.province;
      this.city = e.city;
    }
  }
};
</script>

<style lang="scss">
.regist-main {
  margin-top: 40px;
  .title {
    padding: 0 60px;
    font-size: 40px;
    color: #222222;
    font-weight: bold;
  }
  .registInfo-content {
    padding: 20px 60px 80px;
    .registInfo-item {
      position: relative;
      padding: 50px 0;
      border-bottom: 1px solid #d8d8d8;
      // padding-bottom: 30px;
      @include clearfix();
      .registInfo-itemType {
        float: left;
        font-size: 34px;
        color: #666666;
        width: 196px;
        &.city{
          position: absolute;
        }
      }
      .registInfo-itemCity {
        position: relative;
        padding-left: 194px;
        display: inline-block;
      }
      .registInfo-itemInput {
        float: left;
      }
      .placeholderClass {
        color: #aaaaaa;
      }
      .registInfo-itemNational {
        font-size: 34px;
        color: #222222;
      }
    }
  }
  .regist-submitBtn {
    margin-top: 60px;
    width: 520px;
    height: 96px;
    background: #cccccc;
    border-radius: 8px;
    margin: 0 auto;
    text-align: center;
    line-height: 96px;
    color: #ffffff;
    &.actived {
      background: #00b9ad;
    }
  }
}
</style>
