<template>
    <div class="formSelectS formCommon">
        <section>
            <p class="articleText">
                {{timeSelect.labelNameOne}}
            </p>
            <div class="cont">
                <div class="selectCont" @click.stop="toggleSelect(0)"><span v-text="yearSTextOne"></span>
                    <ul class="selectOption" v-show="yearSOneOnOff">
                        <li v-for="(item,i) in dateData.yearTimeBox1" :class="{gray:!item.active,active:yearSTextOne==item.year}" @click.stop="changeTime(0,item)">{{item.year}}<i></i></li>
                    </ul>
                </div>
                <b>年</b>
                <div class="selectCont" @click.stop="toggleSelect(1)"><span v-text="monthSTextOne"></span>
                    <ul class="selectOption width83" v-show="monthSOneOnOff">
                        <li v-for="(item,i) in dateData.monthTimeBox1" :class="{gray:!item.active,active:monthSTextOne==item.month}" @click.stop="changeTime(1,item)">{{item.month}}<i></i></li>
                    </ul>
                </div>
                <b>月</b>
                <div class="selectCont" @click.stop="toggleSelect(2)"><span v-text="daySTextOne"></span>
                    <ul class="selectOption width83" v-show="daySOneOnOff">
                        <li v-for="(item,i) in dateData.dayTimeBox1" :class="{gray:!item.active,active:daySTextOne==item.day}" @click.stop="changeTime(2,item)">{{item.day}}<i></i></li>
                    </ul>
                </div>
                <b>日</b>
            </div>
        </section>
        <section>
            <p class="articleText">
                {{timeSelect.labelNameTwo}}
            </p>
            <div class="cont">
                <div class="selectCont" @click.stop="toggleSelect(3)"><span v-text="yearSTextTwo"></span>
                    <ul class="selectOption" v-show="yearSTwoOnOff">
                        <li v-for="(item,i) in dateData.yearTimeBox2" :class="{gray:!item.active,active:yearSTextTwo==item.year}" @click.stop="changeTime(3,item)">{{item.year}}<i></i></li>
                    </ul>
                </div>
                <b>年</b>
                <div class="selectCont" @click.stop="toggleSelect(4)"><span v-text="monthSTextTwo"></span>
                    <ul class="selectOption width83" v-show="monthSTwoOnOff">
                        <li v-for="(item,i) in dateData.monthTimeBox2" :class="{gray:!item.active,active:monthSTextTwo==item.month}" @click.stop="changeTime(4,item)">{{item.month}}<i></i></li>
                    </ul>
                </div>
                <b>月</b>
                <div class="selectCont" @click.stop="toggleSelect(5)"><span v-text="daySTextTwo"></span>
                    <ul class="selectOption width83" v-show="daySTwoOnOff">
                        <li v-for="(item,i) in dateData.dayTimeBox2" :class="{gray:!item.active,active:daySTextTwo==item.day}" @click.stop="changeTime(5,item)">{{item.day}}<i></i></li>
                    </ul>
                </div>
                <b>日</b>
            </div>
        </section>
    </div>
</template>
<script>
    import getDateData from '../jsComponents/getDateData.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            timeSelect:{},//調用組件傳遞的參數
        },
        data(){
          return {
              yearSOneOnOff:false,//開始時間的選擇下拉框是否顯示
              yearSTwoOnOff:false,//結束時間的選擇下拉框是否顯示
              yearSTextOne:'',//第一个时间，开始时间的年选中文本
              yearSTextTwo:'',//结束时间的年选中文本
              monthSOneOnOff:false,
              monthSTwoOnOff:false,
              monthSTextOne:'',//开始时间的月选中文本
              monthSTextTwo:'',//结束时间的月选中文本
              daySOneOnOff:false,
              daySTwoOnOff:false,
              daySTextOne:'',//开始时间的日选中文本
              daySTextTwo:'',//结束时间的日选中文本
              dateData:{
                  dayTimeBox1:[],
                  monthTimeBox1:[],
                  yearTimeBox1:[],
                  dayTimeBox2:[],
                  monthTimeBox2:[],
                  yearTimeBox2:[],
              }
          }
        },
        computed:{
            ...mapGetters(['loading']),
        },
        methods:{
            //下拉選擇框的顯示隱藏
            toggleSelect(type){
              let t = this;
                if(t.loading){
                    return;
                }
              switch (parseInt(type,10)){
                  case 0://開始時間的下拉選擇框
                      t.yearSOneOnOff = !t.yearSOneOnOff;
                      t.monthSOneOnOff=false;
                      t.daySOneOnOff=false;
                      t.yearSTwoOnOff=false;
                      t.monthSTwoOnOff=false;
                      t.daySTwoOnOff=false;
                      break;
                  case 1:
                      t.monthSOneOnOff = !t.monthSOneOnOff;
                      t.yearSOneOnOff=false;
                      t.daySOneOnOff=false;
                      t.yearSTwoOnOff=false;
                      t.monthSTwoOnOff=false;
                      t.daySTwoOnOff=false;
                      break;
                  case 2:
                      t.daySOneOnOff = !t.daySOneOnOff;
                      t.yearSOneOnOff=false;
                      t.monthSOneOnOff=false;
                      t.yearSTwoOnOff=false;
                      t.monthSTwoOnOff=false;
                      t.daySTwoOnOff=false;
                      break;
                  case 3://結束時間的下拉選擇框
                      t.yearSTwoOnOff = !t.yearSTwoOnOff;
                      t.yearSOneOnOff=false;
                      t.monthSOneOnOff=false;
                      t.daySOneOnOff=false;
                      t.monthSTwoOnOff=false;
                      t.daySTwoOnOff=false;
                      break;
                  case 4:
                      t.monthSTwoOnOff = !t.monthSTwoOnOff;
                      t.yearSOneOnOff=false;
                      t.monthSOneOnOff=false;
                      t.daySOneOnOff=false;
                      t.yearSTwoOnOff=false;
                      t.daySTwoOnOff=false;
                      break;
                  case 5:
                      t.daySTwoOnOff = !t.daySTwoOnOff;
                      t.yearSOneOnOff=false;
                      t.monthSOneOnOff=false;
                      t.daySOneOnOff=false;
                      t.yearSTwoOnOff=false;
                      t.monthSTwoOnOff=false;
                      break;
              }
            },
            changeTime(type,item){
                let t = this;
                if(item.active){
                    switch (type){
                        //開始時間的相關操作
                        case 0:
                            t.yearSTextOne = item.year;
                            t.yearSOneOnOff = false;
                            break;
                        case 1:
                            t.monthSTextOne = item.month;
                            t.monthSOneOnOff = false;
                            break;
                        case 2:
                            t.daySTextOne = item.day;
                            t.daySOneOnOff = false;
                            break;
                        //結束時間的相關操作
                        case 3:
                            t.yearSTextTwo = item.year;
                            t.yearSTwoOnOff = false;
                            break;
                        case 4:
                            t.monthSTextTwo = item.month;
                            t.monthSTwoOnOff = false;
                            break;
                        case 5:
                            t.daySTextTwo = item.day;
                            t.daySTwoOnOff = false;
                            break;
                    }
                }

            }
        },
        watch:{
            //开始时间变更
            yearSTextOne(newVal){
                let t = this;
                t.dayTimeBox1 = [];
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yT=t.yearSTextTwo;
                let _mT=t.monthSTextTwo;
                let _dT=t.daySTextTwo;
                t.dateData.obj({
                    yearOne :newVal,
                    monthOne:t.monthSTextOne,
                    dayOne:t.daySTextOne,
                    yearTwo :_yT,
                    monthTwo:_mT,
                    dayTwo:_dT
                });
            },
            monthSTextOne(newVal){
                let t = this;
                t.dayTimeBox1 = [];
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yT=t.yearSTextTwo;
                let _mT=t.monthSTextTwo;
                let _dT=t.daySTextTwo;
                t.dateData.obj({
                    yearOne :t.yearSTextOne,
                    monthOne:newVal,
                    dayOne:t.daySTextOne,
                    yearTwo :_yT,
                    monthTwo:_mT,
                    dayTwo:_dT
                });
                //如果存在日期大于当前月最大日期，更改日期
                if(t.dateData.changeDay1()){
                    t.daySTextOne=t.dateData.changeDay1();
                }
            },
            daySTextOne(newVal){
                let t  = this;
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yT=t.yearSTextTwo;
                let _mT=t.monthSTextTwo;
                let _dT=t.daySTextTwo;
                t.dateData.obj({
                    yearOne :t.yearSTextOne,
                    monthOne:t.monthSTextOne,
                    dayOne:newVal,
                    yearTwo :_yT,
                    monthTwo:_mT,
                    dayTwo:_dT
                });
            },
            //结束时间变更
            yearSTextTwo(newVal){
                let t = this;
                t.dayTimeBox2 = [];
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yO=t.yearSTextOne;
                let _mO=t.monthSTextOne;
                let _dO=t.daySTextOne;
                t.dateData.obj({
                    yearTwo :newVal,
                    monthTwo:t.monthSTextTwo,
                    dayTwo:t.daySTextTwo,
                    yearOne :_yO,
                    monthOne:_mO,
                    dayOne:_dO
                });
            },
            monthSTextTwo(newVal){
                let t = this;
                t.dayTimeBox2 = [];
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yO=t.yearSTextOne;
                let _mO=t.monthSTextOne;
                let _dO=t.daySTextOne;
                t.dateData.obj({
                    yearTwo :t.yearSTextTwo,
                    monthTwo:newVal,
                    dayTwo:t.daySTextTwo,
                    yearOne :_yO,
                    monthOne:_mO,
                    dayOne:_dO
                });
                //如果存在日期大于当前月最大日期，更改日期
                if(t.dateData.changeDay2()){
                    t.daySTextTwo=t.dateData.changeDay2();
                }
            },
            daySTextTwo(newVal){
                let t  = this;
                t.$emit('changeDate', {
                    bTime:t.yearSTextOne+'-'+(t.monthSTextOne>9?t.monthSTextOne:'0'+t.monthSTextOne)+'-'
                    +(t.daySTextOne>9?t.daySTextOne:'0'+t.daySTextOne),
                    eTime:t.yearSTextTwo+'-'+(t.monthSTextTwo>9?t.monthSTextTwo:'0'+t.monthSTextTwo)+'-'
                    +(t.daySTextTwo>9?t.daySTextTwo:'0'+t.daySTextTwo)
                });
                let _yO=t.yearSTextOne;
                let _mO=t.monthSTextOne;
                let _dO=t.daySTextOne;
                t.dateData.obj({
                    yearTwo :t.yearSTextTwo,
                    monthTwo:t.monthSTextTwo,
                    dayTwo:newVal,
                    yearOne :_yO,
                    monthOne:_mO,
                    dayOne:_dO
                });
            }
        },
        mounted(){
            let t=this,
                _kv=t.timeSelect;
            t.dateData = new getDateData();
            t.yearSTextOne = _kv.yearSTextOne;
            t.monthSTextOne = _kv.monthSTextOne;
            t.daySTextOne = _kv.daySTextOne;
            t.yearSTextTwo = _kv.yearSTextTwo;
            t.monthSTextTwo = _kv.monthSTextTwo;
            t.daySTextTwo = _kv.daySTextTwo;
        }
    }
</script>
