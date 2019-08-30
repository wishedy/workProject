<template>
  <section class="picker-main" :class="{'hasDays':timeType==2,'noDays':timeType==1}">
    <view class="section"  v-if="timeType==1">
        <!-- <view class="section__title">日期选择器</view> -->
        <picker class="time-picker" mode="date" :value="date" start="1940-01-01" :end="currTime" @change="dateChangeFn">
            <view class="picker">
            <!-- 当前选择: {{date}} -->
            </view>
        </picker>
    </view>
    <view class="section"  v-if="false">
          <!-- <view class="section__title">多列选择器</view> -->
          <picker  class="time-picker" mode="multiSelector" @change="changeFn" @columnchange="bindMultiPickerColumnChange" :value="multiIndex" :range="multiArray">
            <p class="picker">
              <!-- 当前选择： -->
            </p>
          </picker>
    </view>

    <section class="picker-daysCover" v-show="showMult"></section>
    <view class="picker-days" v-show="showMult">
      <section class="timeSelect-bar">
        <span class="timeCancel-enBtn" @click="selectCanFn">取消</span><span class="timeSelect-enBtn" @click="selectEnFn">确定</span>
      </section>
      <picker-view class="timeSelect-box" indicator-style="height: 50px;" style="width: 100%; height: 300px;" :value="value" @change="Changes">
        <picker-view-column>
          <view v-for="(item,index) in years" style="line-height: 50px" :key="index">{{item}}年</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in months" style="line-height: 50px" :key="index">{{item}}月</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in days" style="line-height: 50px" :key="index">{{item}}日</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item,index) in dayss" style="line-height: 50px" :key="index">{{item}}</view>
        </picker-view-column>
      </picker-view>
    </view>
  </section>
</template>

<script>
/**
 * @Desc：日期控件
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Jukun on 2018/5/6.
 */
// const date = new Date();
// const years = [];
// const months = [];
// const days = [];

// for (let i = 1990; i <= date.getFullYear(); i++) {
//   years.push(i);
// }

// for (let i = 1; i <= 12; i++) {
//   months.push(i);
// }
export default {
  name: "pickers",
  data() {
    return {
      hasDays: true,
      showMult: false, //多列
      date: "",
      currTime: 0,
      time: {
        year: "",
        month: "",
        day: ""
      },
      multiIndex: [0, 0, 0, 0],
      multiArray: [],
      value: [9999, 1, 1, 1],
      years: [],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      days: [],
      dayss: ["上午", "下午", "晚上"]
    };
  },
  methods: {
    currentTime() {
      let _this = this;
      let dataTemp = new Date();
      _this.time.year = dataTemp.getFullYear();
      _this.time.month = dataTemp.getMonth() + 1;
      _this.time.day = dataTemp.getDate();
      let _hour = _this.getHour(dataTemp);
      _this.time.hour = _hour==0?"上午":_hour==1?"下午":"晚上";
      if (_this.defaultTime&&_this.defaultTime.defaultYear) {
        _this.currTime = `${_this.defaultTime.defaultYear}-${_this.time.month}-${ _this.time.day}`;
      } else {
        _this.currTime = `${_this.time.year}-${_this.time.month}-${ _this.time.day}`;
      }
      console.log(_this.currTime)
      //具体当天时间段
      if(_this.timeType == 2){
        _this.years = _this.getYear("1940", _this.time.year);
        _this.days = _this.getDay(_this.time.year, _this.time.month);
        let _currentHour = '';
        if (_this.times.num =="0") {
          _currentHour = _hour;
        } else {
          _currentHour = (_this.times.hour=="上午"?0:(_this.times.hour=="下午"?1:2));
        }
        if (_this.times&&_this.times!==null) {
          // console.log(_this.times.year);
          // console.log(typeof(_this.times.year));
          let _currentYear = '';
          if (typeof(_this.times.year)=='string') {
             _currentYear = _this.years.indexOf(_this.times.year);
          } else {

             _currentYear = _this.years.indexOf(JSON.stringify(_this.times.year));
          }
          // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>")
          // console.log(_currentYear);
          _this.value = [
            _currentYear,
            _this.times.month-1,
            _this.times.day-1,
            _currentHour,
          ]
        } else {
          _this.value = [
          _this.time.year,
          _this.time.month-1,
          _this.time.day-1,
          _this.getHour(dataTemp)
        ]
        }
      }else{
        _this.$emit("selectTime", _this.time);
      }
    },
    selectCanFn(){
      let _this = this;
      _this.$emit("cancleTime");
      _this.$emit("update:pickerShow", false);
    },
    //多列时间选择器
    selectEnFn(){
      let _this = this;
      this.$emit("update:pickerShow", false);
      _this.time.year = _this.years[_this.value[0]];
      _this.time.month = _this.months[_this.value[1]];
      _this.time.day = _this.days[_this.value[2]];
      _this.time.hour = _this.dayss[_this.value[3]];
      _this.$emit("selectTime", _this.time);
    },
    //多列时间 滑动事件(禁止超过当前时间点)
    Changes(e) {
      let _this = this;
      let _targetYear = e.target.value[0];
      let _currentYear = _this.years.indexOf(JSON.stringify(_this.time.year));
      let _currentMonth = _this.months.indexOf(_this.time.month);
      let _currentDayType = '';
      if (typeof(_this.time.day)=="number") {
        _currentDayType = _this.time.day>9?_this.time.day:"0"+_this.time.day;
      } else {
        let _stringDay = number(_this.time.day);
        _currentDayType = _stringDay>9?_stringDay:"0"+_this.time.day;
      }
      let _currentDay = '';
      if (typeof(_currentDayType)=="number") {
        _currentDay = _this.days.indexOf(JSON.stringify(_currentDayType))
      } else {
        _currentDay = _this.days.indexOf(_currentDayType)
      }
      if (_targetYear <= _currentYear) {
        _this.value[0] = e.target.value[0];
        if (_targetYear == _currentYear) {
          //当前年 月份控制
          if (e.target.value[1] > _currentMonth) {
            //返回当前月份
            _this.value[1] = _currentMonth;
            if (e.target.value[2] <= _currentDay) {
                _this.value[2] = e.target.value[2];
                //当天 控制时间段禁止超过当前时间段
                if (e.target.value[3] <= _this.getHour(new Date())) {
                  _this.value[3] = e.target.value[3];
                } else {
                  _this.value[3] = _this.getHour(new Date());
                }
              } else {
                _this.value[2] = _currentDay;
                _this.value[3] = _this.getHour(new Date());
              }
          } else {
            //当前月份 控制天数是禁止超过当天
            _this.value[1] = e.target.value[1];
            if (e.target.value[1] == _currentMonth) {
              // debugger
              if (e.target.value[2] <= _currentDay) {
                _this.value[2] = e.target.value[2];
                //当天 控制时间段禁止超过当前时间段
                if (e.target.value[2] == _currentDay) {
                  if (e.target.value[3] <= _this.getHour(new Date())) {
                    _this.value[3] = e.target.value[3];
                  } else {
                    _this.value[3] = _this.getHour(new Date());
                  }
                } else {
                  _this.value[3] = e.target.value[3];
                }
              } else {
                _this.value[2] = _currentDay;
                _this.value[3] = _this.getHour(new Date());
              }
            } else {
              _this.value[2] = e.target.value[2];
              _this.value[3] = e.target.value[3];
            }
          }
        } else {
          //无需控制
          _this.value[1] = e.target.value[1];
          _this.value[2] = e.target.value[2];
          _this.value[3] = e.target.value[3];
        }
      } else {}
      _this.days = _this.getDay(_this.time.year, e.target.value[1] + 1);
    },
    //年月日选择器
    dateChangeFn(e) {
      let _this = this;
      _this.date = e.target.value;
      let _timeArr = e.target.value.split("-");
      //月份去零
      if (_timeArr[1] > 9) {
        _this.time.month = _timeArr[1];
      } else {
        _this.time.month = _timeArr[1].split("0")[1];
      }
      //天数去零
      if (_timeArr[2] > 9) {
        _this.time.day = _timeArr[2];
      } else {
        _this.time.day = _timeArr[2].split("0")[1];
      }
      _this.time.year = _timeArr[0];
      _this.$emit("selectTime", _this.time);
    },
    getYear(startYear, lastYear) {
      if (!lastYear) {
        let dData = new Date();
        lastYear = dData.getFullYear();
      }
      if (startYear && lastYear) {
        startYear = parseInt(startYear);
        lastYear = parseInt(lastYear);
      }
      if (startYear > lastYear) {
        let temp = startYear;
        startYear = lastYear;
        lastYear = temp;
      }
      let yearArr = [];
      for (let i = startYear; i <= lastYear; i++) {
        i = i + "";
        yearArr.push(i);
      }
      return yearArr;
    },
    getDay(year, month) {
      let dayArr = [];
      let lastDay = 31;
      if (year && month) {
        year = parseInt(year);
        month = parseInt(month, 10);
        lastDay = new Date(year, month, 0);
        lastDay = lastDay.getDate();
      }
      for (let i = 1; i <= lastDay; i++) {
        i = i < 10 ? "0" + i : i + "";
        dayArr.push(i);
        i = parseInt(i);
      }
      return dayArr;
    },
    getHour(_date){
      let _this = this;
      var _time = _date.getHours();
      var _text = '';
      if(_time>=6&&_time<12)
      _text = 0;
      else if(_time>=12&&_time<18)
      _text = 1
      else
      _text = 2;
      return _text;
    },
    //多列
    changeFn(e) {
      console.log(e);
    },
    bindMultiPickerColumnChange(e) {
      let _this = this;
      console.log(e);
      if (e.target.column == 1) {
        console.log(_this.multiArray);
        _this.multiArray = [];
      }
      console.log(_this.multiArray);
    },
    bindchange(e) {
      console.log(e);
    }
  },
  mounted() {
    let _this = this;
    _this.currentTime();
    _this.showMult =  _this.timeType==2?true:false;
    // console.log(_this.times)
  },
  computed: {},
  components: {},
  props: {
    timeType: {
      type:String
    },
    times:{
      type:Object
    },
    defaultTime:{
      type:String || ''
    }
  }
};
</script>

<style lang="scss" scoped>
.picker-main {
  &.noDays {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.hasDays {
    .picker-daysCover {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.8;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }
    .picker-days {
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
  .section {
    height: 100%;
  }
  .time-picker {
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
}
</style>
