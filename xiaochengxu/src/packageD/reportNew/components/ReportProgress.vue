<template>
  <section class="progress-con">
    <div class="progress-bg">
        <div class="progress-green" :style="{'width':progress}">
          <div class="progress-text" :class="progressClass">
            <i class="icon-smile"></i>
            <span class="progress-tip">已完成{{progress}}</span>
            <i class="icon-arrow"></i>
          </div>
        </div>
    </div>
  </section>

</template>

<script>
    export default {
        props:{
          progress:{
            type:String
          }
        },
        data(){
         return{
           // right: -100px;
         }
        },
      computed:{
        progressClass(){
          let str='';
          switch (this.progress){
            case '10%':
              str='progress10';
              break;
            case '90%':
              str='progress90';
              break;
            default:
              break;
          }
          return str;
        },
      },
    }
</script>

<style scoped lang="scss">
  .progress-con{
    padding-top: 70px;
  }
  .progress-bg{
    width:100%;
    height:8px;
    background: #F2F5F7;
    /*margin-top: 78px;*/
    .progress-green{
      background: #10CCBF;
      height:8px;
      position: relative;
      .progress-text{
        text-align: center;
        position: absolute;
        top: -66px;
        right: -70px;
        width:160px;
        font-size: 0;
        background:rgba(10,199,186,1);
        border-radius: 2px;
        &.progress10{
          right: -100px;
          .icon-arrow{
            left: 30%;
          }
        }
        &.progress90{
          right: -52px;
          .icon-arrow{
            left: 60%;
          }
        }
        .icon-smile{
          width: 24px;
          height: 24px;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/smile_progress bar.png") no-repeat;
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
        }
        .progress-tip{
          display: inline-block;
          vertical-align: middle;
          font-size:22px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          margin-left: 4px;
          color:rgba(255,255,255,1);
          line-height: 42px;
        }
        .icon-arrow{
          position: absolute;
          width: 16px;
          height: 10px;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/arrow_progress bar .png") no-repeat;
          background-size: contain;
          bottom: -9px;
          left: 50%;
        }

      }
    }
  }

</style>
