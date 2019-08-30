<template>
  <header class="consult-number">
      <article class="consult-number-inner" :class="{'on-two':progress == 2,'on-three':progress == 3}">
        <p class="consult-number-inner-item"><span>1</span></p>
        <p class="consult-number-inner-item"><span>2</span></p>
        <p class="consult-number-inner-item"><span>3</span></p>
      </article>
    </header>
</template>
<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/8/9.
   */


  export default {
    data() {
      return {}
    },
    methods: {

    },
    mounted() {

    },
    computed: {

    },
    components: {

    },
    props:{
      progress:{
        type:Number || String,
        default:1,
      }
    }
  }
</script>

<style lang="scss">
  .consult-number {
    width: 690px;
    padding-top: 30px;
    margin: 0 auto;
    position: relative;
    z-index: 4;
    .consult-number-inner {
      display:flex;
      .consult-number-inner-item {
        position: relative;
        flex: 1;
        font-size: 28px;
        color: #CCCCCC;
        &::before,&::after{
          display: block;
          content: "";
          position: absolute;
          top: 21.5px;
          height: 1px;
          background-color: #eeeeee;
          z-index: 8;
          transition: all 0.2s ease-in-out;
        }
        &::before{
          left: 0;
        }
        &::after{
          right: 0;
        }
        span{
          position: relative;
          display: inline-block;
          box-sizing: border-box;
          width: 44px;
          height: 44px;
          line-height: 44px;
          border: 1px solid #CCCCCC;
          border-radius: 50%;
          text-align: center;
          z-index: 9;
          background-color: #FFFFFF;
          transition: all 0.2s ease-in-out;
        }
        &:nth-child(1){
          span{
            margin-left: 53px;
            color: #00B9AD;
            border: 1px solid #00B9AD;
            border-radius:50%;
          }
          &::before{
            width: 33%;
            background-color: #00B9AD;
          }
          &::after{
            width: 77%;
          }
        }
        &:nth-child(2){
          text-align: center;
          padding-left: 1px; // 为了兼容 苹果x
          &::before{
            width: 50%;
          }
          &::after{
            width: 50%;
          }
        }
        &:nth-child(3){
          text-align: right;
          span{
            margin-right: 58px;
          }
          &::before{
            width: 77%;
          }
          &::after{
            width: 33%;
          }
        }
      }
      &.on-two .consult-number-inner-item{
        &:nth-child(1){
          &::after{
            background-color: #00B9AD;
          }
        }
        &:nth-child(2){
          &::before{
            background-color: #00B9AD;
          }
          span{
            color: #00B9AD;
            border: 1px solid #00B9AD;
            border-radius:50%;
          }
        }
      }
      &.on-three .consult-number-inner-item{
        &:nth-child(1){
          &::after{
            background-color: #00B9AD;
          }
        }
        &:nth-child(2){
          &::before,&::after{
            background-color: #00B9AD;
          }
          span{
            color: #00B9AD;
            border: 1px solid #00B9AD;
          }
        }
        &:nth-child(3){
          span{
            color: #00B9AD;
            border: 1px solid #00B9AD;
            border-radius:50%;
          }
          &::before,&::after{
            background-color: #00B9AD;
          }
        }
      }
    }

  }
</style>
