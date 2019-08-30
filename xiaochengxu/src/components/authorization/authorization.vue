<template>
  <section class="su_maskers" v-show="showOnOff">
    <section class="authorization-mask">
        <section class="authorization-mask-top">
        </section>
        <section class="authorization-mask-bottom">
          <button class="authorization-mask-button" open-type="getUserInfo"
                  @getuserinfo="getInfo">点此微信授权</button>
        </section>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by gubowen on 2017/7/27.
   */
  import miniLogin from "common/js/miniUtil/miniLogin";
  import localStorage from "localStorage";
  import {mapActions} from 'vuex';
  export default{
    data(){
      return {
        showOnOff:false
      }
    },
    methods:{
      ...mapActions(['storageUserInfoEnd']),
      ensureClickEvent(obj) {
        console.log(obj);
        this.$emit('ensureClickEvent',obj)
      },
      getInfo(e){
        let _this = this;
        if (e.target.userInfo) {
          miniLogin({
            successCallBack: (res) => {
              _this.showOnOff = false;
              _this.storageUserInfoEnd();

            },
            failCallBack: (res) => {
              _this.showOnOff = true;
            }
          });
        }else{

        }
      }
    },
    mounted(){
      console.log("显示");
      let _this = this;
      _this.showOnOff = localStorage.getItem("openId")?false:true;
    },
    components:{
      miniLogin
    },
    props: {
      ensureParams: {
        type: Object
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .su_maskers {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
    transition: all 0.3s linear;
    .authorization-mask{
      width: 564px;
      height: 540px;
      background: #fff;
      position: absolute;
      top:55%;
      left: 50%;
      transform: translate(-50%,-50%);
      border-radius: 10px;
      .authorization-mask-top{
        border-radius: 10px 10px 0 0;
        width: 564px;
        height: 380px;
        position: relative;
        background: url("https://m1.allinmed.cn/static/image/img00/myServices/weChatAuthorization.png") no-repeat center;
        background-size: cover;
      }
      .authorization-mask-bottom{
        width: 564px;
        height: 160px;
        .authorization-mask-button{
          margin-top: 20px;
          width:440px;
          height:92px;
          background:rgba(46,169,254,1);
          box-shadow:0px 8px 16px 0px rgba(46,169,254,0.5);
          border-radius:8px;
          line-height: 92px;
          font-size:32px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
          text-align: center;
        }
      }
    }
  }
</style>
