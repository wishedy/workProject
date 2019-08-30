<template>
  <section class="question-select">
    <article class="question-title">
      <span>{{question.title}}</span>
      <p v-if="question.descShow" class="question-desc">{{question.descShow}}</p>
    </article>
    <form action="" @submit="formSubmit" report-submit="true" v-for="(item,index) in question.selectText" :key="index">
      <button
        type="submit"
        formType="submit"
        @click="selctBtnSubmit(index)"
        @touchstart="touchstart(index)"
        @touchend="touchend"
        class="select-item"
        :class="{'jump-select':item=='暂时跳过，稍后补充＞','clickBg':index==bgIndex}"
      >{{item}}</button>
    </form>
  </section>
</template>

<script>
  import sendFormId from "common/js/HttpRequest/sendFormId";
    export default {
      props:{
        question:{
          type:Object
        }
      },
      data(){
        return{
          bgIndex:-1
        }
      },
      methods:{
        /** 发送formId */
        formSubmit(e) {
          sendFormId(e.target.formId);
        },
        touchstart(index){
          this.bgIndex=index;
        },
        touchend(e){
          this.bgIndex=-1;
        },
        selctBtnSubmit(index){
          this.$emit('btnIndex',index)
        }
      },
      mounted(){
        console.log(this.question)
      }
    }
</script>

<style scoped lang="scss">
  .question-select{
    .question-title{
      margin-left: 30px;
      padding: 72px 0 66px;
      font-size:46px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:46px;
      .question-desc{
        width:690px;
        height:68px;
        background:rgba(88,128,237,0.08);
        border-radius:6px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:68px;
        padding-left: 20px;
        box-sizing: border-box;
        margin-top: 40px;
      }
    }
    .select-item{
      width:690px;
      height:104px;
      line-height: 104px;
      background:rgba(245,247,247,1);
      border-radius:8px;
      border:1px solid #E9F0EF;
      margin-bottom: 32px;
      font-size:36px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(0,185,173,1);
      &.jump-select{
        font-size:30px;
        height: 30px;
        font-weight:400;
        color:rgba(136,136,136,1);
        line-height:30px;
        margin: auto;
        margin-top: 88px;
        padding-left:0;
        padding-right:0;
        box-sizing:border-box;
        border-radius:0;
        border: none;
        outline: none;
        background: transparent;
        &.clickBg{
          background:transparent;
          box-shadow:none;
          border-radius:0;
          border:none;
        }
      }
      &:after {
        border: 0;
      }
      &.clickBg{
        background:rgba(255,255,255,1);
        box-shadow:0px 4px 10px 0px rgba(0,0,0,0.05);
        border-radius:8px;
        border:1px solid #15D1C5;
      }
    }
  }

</style>
