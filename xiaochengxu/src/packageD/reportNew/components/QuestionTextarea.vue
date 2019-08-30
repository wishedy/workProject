<!--文本框-->
<template>
  <section class="question-textarea">
    <article class="question-title">
      <span>{{title}}</span>
      <p v-if="titleTip" class="question-desc">{{titleTip}}</p>
    </article>
    <figure class="textarea-con">
      <textarea
        v-model="textDesc"
        @input="contentLimit"
        placeholder="请输入"
      ></textarea>
      <span class="textarea-num" :class="{'active':textareaLen<20}">{{textareaLen}}</span>
    </figure>
  </section>
</template>

<script>
  import api from 'common/js/util/util';
    export default {
        props:{
          title:{
            type:String
          },
          textDesc:{
            type:String
          },
          titleTip:{
            type:String
          },
        },
      data(){
        return{
          inputVal:null,

        }
      },
      computed:{
        textareaLen(){
          return 100-api.getByteLen(this.textDesc)
        }
      },
      methods:{
        contentLimit() {
          let _this=this;
          if (_this.textDesc&&api.getByteLen(_this.textDesc) > 100){
            _this.textDesc=api.getStrByteLen(_this.textDesc,100);
          }
          clearTimeout(_this.inputVal);
          _this.inputVal=setTimeout(()=>{
            _this.$emit('textDesc',_this.textDesc)
          },100)
        },
      }
    }
</script>

<style scoped lang="scss">
.question-textarea{
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
  .textarea-con{
    position: relative;
    width:690px;
    margin: auto;
    margin-bottom: 30px;
    textarea{
      border:1px solid #999999;
      width: 100%;
      height: 242px;
      font-size:34px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(34,34,34,1);
      line-height:34px;
      padding: 26px 24px 38px 20px;
      box-sizing: border-box;
      &::placeholder{
        color: #aaaaaa;
      }
    }
    .textarea-num{
      position: absolute;
      bottom: 16px;
      right: 12px;
      font-size:26px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(170,170,170,1);
      line-height:28px;
      &.active{
        color:rgba(252,116,106,1);
      }
    }
  }
}
</style>
