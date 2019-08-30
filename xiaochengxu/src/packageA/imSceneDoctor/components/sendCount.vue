<template>
  <section class="send-count-box">
    <article class="send-count">
      <span>{{doctorName}}医生赠送了您</span>
      <em>3</em>
      <span>条回复</span>
    </article>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/29.
   */
  export default{
    computed: {

    },
    props :{
      sendCountMessage:{
        type:Object,
      },
      doctorName : {

      }
    },
    onLoad () {
      console.log(this.sendCountMessage)
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  .send-count-box{
    text-align:center;
  }
  .send-count {
    display:inline-block;
    background: #EDEEEE;
    border-radius: 12px;
    font-size: 0;
    margin: 0 30px;
    padding: 20px 30px;
    box-sizing: border-box;
    & > span {
      color: #AAAAAA;
      font-size:26px;
      /*vertical-align: middle;*/
      /*display: inline-block;*/
    }
    & > em {
      display:inline;
      font-style: normal;
      font-size:26px;
      color: #FF7171;
      /*vertical-align: middle;*/
      /*display: inline-block;*/
      margin: 0 8px;
    }
  }
</style>
