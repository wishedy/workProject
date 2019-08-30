<template>
    <section class="authorization">
      <img src="https://m.allinmed.cn/static/image/mp/report/authorization.png"/>
      <div class="text">获取信息失败，请先授权</div>
      <button class="authorize_button" @getuserinfo="getAuthorize" open-type="getUserInfo">去授权</button>
    </section>
</template>
<script type="text/ecmascript-6">
  export  default{
    name:'authorization',
    data(){
      return{

      }
    },
    mounted(){
    // console.log("authorization");
    },
    methods:{
      getAuthorize(obj) {
        console.log("授权成功");
        this.$emit("FromChild", true);

        // if (obj.target.userInfo) {
        //   this.ensureShow = false;
        //
        //   // this.getLoginInfo();
        // } else {
        //   this.ensureShow = true;
        // }
      },
    },
    props:{
    }
  }
</script>
<style lang="scss" scoped>
  .authorization{
    height:100%;
    width: 100%;
    background: #fff;
    box-sizing: border-box;
    padding-top: 200px;
    image {
      width: 360px;
      height: 256px;
      display: block;
      margin: 0px auto 28px;
    }
    .text {
      font-size:28px;
      color: #888888;
      letter-spacing: 0;
      line-height: 28px;
      text-align: center;
      margin-bottom:140px;
    }
    .authorize_button{
      font-size:32px;
      width:400px;
      height:100px;
      border:2px solid #12D5A8;
      border-radius: 50px;
      line-height: 100px;
      color:#11D5A7;
      display: block;
      margin:0 auto;
    }
  }
</style>
