<template>
  <section class="question-time">
    <article class="question-title">
      {{timeObj.title}}
    </article>
    <picker
      mode="date"
      :value="timeObj.timeDate"
      start="1900-01-01"
      :end="endDate"
      @change="bindDateChange"
    >
      <p class="picker-date">
       <span class="picker-text" :class="{'no-text':!timeObj.timeDate}">{{timeObj.timeDate?timeObj.timeDate:'请选择'}}</span>
        <i class="picker-icon"></i>
      </p>
    </picker>
  </section>
</template>

<script>
    export default {
      props:{
        timeObj:{
          type:Object
        }
      },
      data(){
        return{
          endDate:''
        }
      },
      methods:{
        bindDateChange(e) {
          this.timeObj.timeDate=e.mp.detail.value;
        },
        getCurrentTime(){
          let str='',
            date=new Date(),
            year=date.getFullYear(),
            month=date.getMonth()+1,
            day=date.getDate();
          if(month<10){
            month='0'+month;
          }
          if(day<10){
            day='0'+day;
          }
          str=year+'-'+month+'-'+day;
          return str;
        },
      },
      mounted(){
        this.endDate=this.getCurrentTime();
      }
    }
</script>

<style scoped lang="scss">
   .question-time{
    .question-title{
      margin-left: 30px;
      padding: 72px 0 66px;
      font-size:46px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:46px;
    }
    .picker-date{
      width:690px;
      height:104px;
      border-radius:6px;
      border:1px solid #999;
      font-size: 0;
      position: relative;
      margin:auto;
      .picker-text{
        font-size:34px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:104px;
        padding-left: 20px;
        &.no-text{
          color:rgba(153,153,153,1);
        }
      }
      .picker-icon{
        width: 16px;
        height: 26px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/arrow_enter.png") no-repeat;
        background-size: contain;
        position: absolute;
        right: 40px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }


</style>
