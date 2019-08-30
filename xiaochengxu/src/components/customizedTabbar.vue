<template>
  <section class="tabbar-box">
    <button class="tabbar-list" @click="pageSwitch(1)">
      <dl class="tabbar-item" :class="{'selected':selected == 1}">
        <dt class="tabbar-icon home"></dt>
        <dd class="tabbar-des1">首页</dd>
      </dl>
    </button>
    <!--<button class="tabbar-list" open-type="getUserInfo"
            @getuserinfo="jumpMessage">
      <dl class="tabbar-item" :class="{'selected':selected == 3}">
        <i>12</i>
        <dt class="tabbar-icon message">
        </dt>
        <dd class="tabbar-des1">消息
        </dd>
      </dl>
    </button>-->
    <!--<button class='pop_btn' plain="true"

            open-type='getPhoneNumber' @getphonenumber="getPhoneNumber">获取用户手机号</button>-->
    <button class="tabbar-list" open-type="getUserInfo"
            @getuserinfo="logInConform"  v-if="checkedPhone">
      <dl class="tabbar-item" :class="{'selected':selected == 2}">
        <dt class="tabbar-icon my">
        </dt>
        <dd class="tabbar-des1">我的
        </dd>
      </dl>
    </button>
    <button class="tabbar-list" open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber" v-if="!checkedPhone">
      <dl class="tabbar-item" :class="{'selected':selected == 2}">
        <dt class="tabbar-icon my">
        </dt>
        <dd class="tabbar-des1">我的
        </dd>
      </dl>
    </button>
  </section>
</template>
<script type="text/ecmascript-6">
  // import ensureConfirm from "components/ensure";
  import dataLog from "dataLog";
  import api from "common/js/util/util";
  import miniApi from "common/js/miniUtil/miniUtil";
  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import {mapGetters} from 'vuex';
  const XHRList = {
    getSession: api.httpEnv() + "/mcall/wx/api/v1/jscode2session/",
    getMiniLogin: api.httpEnv() + "/mcall/patient/customer/unite/v1/miniLogin/"
  };

  /**
   * @Desc：
   * @Usage:  引入此公共组件，需要传一个参数 selected （必传，代表哪个高亮且不可点击）
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2017/12/25.
   * Reworked by Yuxi(Shurrik)Yang on 8/16/2018
   */
  export default {
    data() {
      return {
        selected: '',
        mobileOnOff:false,
      };
    },
    computed:{
      ...mapGetters(['userInfoEnd'])
    },
    watch:{
      userInfoEnd(newVal,oldVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    methods: {
      getPhoneNumber: function (info) {//点击获取手机号码按钮
        let _this = this;
        var e = info.mp;
        console.log(e);
        getPhoneAuthorization.init({
          info:e,
          cancelBack(){

          },
          successBack(){//只有用户授权了手机号才可以跳转到我的界面
            dataLog.createTrack({
              actionId: 14133,
            });
            _this.$emit("FromChild", {from: 'tabbar', desc: true});
          }
        });
        dataLog.createTrack({
          actionId: 14133,
        });
        /*if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
          _this.$emit("FromChild", {from: 'tabbar', desc: false});
        }else{
          _this.$emit("FromChild", {from: 'tabbar', desc: true});

        }*/
      },
      /*jumpMessage(e){
        dataLog.createTrack({
          actionId: 14184,
          browseType: "127",
          opDesc: "我的（小程序）"
        });
        if (e.target.userInfo) {
          this.$emit("goToMessage", {from: 'tabbar', desc: true});
        } else {
          this.$emit("goToMessage", {from: 'tabbar', desc: false});
        }
      },*/
      logInConform(e) {
        dataLog.createTrack({
          actionId: 14133,
        });
        if (e.target.userInfo) {
          this.$emit("FromChild", {from: 'tabbar', desc: true});
        } else {
          this.$emit("FromChild", {from: 'tabbar', desc: false});
        }
      },
      pageSwitch(num) {
        switch (num) {
          case 1:
            if (this.selected!=1){
              wx.redirectTo({
                url: '/pages/mIndex/mIndex'
              });
            }
            dataLog.createTrack({
              actionId: 14132,
            });
            break;
        }
      }
    },
    props: {
      selected: {
        default: 0,
        type: Number
      },
      isClick: {
        default: true,
        type: Boolean
      },
      checkedPhone: {
        type: Boolean
      }
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  button::after {
    border: 0
  }

  .tabbar-box {
    z-index: 3;
    width: 100%;
    height: 98px;
    border: none;
    background: #ffffff;
    box-shadow: 0 -8px 8px 0 rgba(0,0,0,0.04);
    position: fixed;
    bottom: 0;
    display: flex;
    @include iphoneX() {
      height: 166px;
    }
    .tabbar-list {
      flex: 1;
      width: 50%;
      display: inline-block;
      align-content: center;
      background: white;
      .tabbar-item {
        font-size: 22px;
        color: #97a0b7;
        text-align: center;
        position: relative;
        i{
          display: block;
          position: absolute;
          top:-4px;
          right: -22px;
          width:34px;
          height:34px;
          background:rgba(242,117,135,1);
          border:2px solid rgba(255,255,255,1);
          color:rgba(255,255,255,1);
          border-radius: 50%;
          line-height: 34px;
          font-size:24px;
          z-index: 1;
          margin-right:74px;
          margin-top:6px;
        }
        .tabbar-icon {
          height: 56px;
          position: relative;
          top: 6px;
          &.home {
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.5.0/tab_index.png") no-repeat center bottom;
            background-size: 56px 56px;
          }
          &.message{
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/tab_message.png") no-repeat center bottom;
            background-size: 56px 56px;
            position: relative;

          }
          &.my {
            background: url("https://m1.allinmed.cn/static/image/mp/index/1.5.0/tab_self.png") no-repeat center bottom;
            background-size: 56px 56px;
            position: relative;
          }
        }
        &.selected {
          color: #2ea9fe;
          i{
            z-index: 1;
            margin-right:74px;
            margin-top:6px;
            display: block;
            position: absolute;
            top:-4px;
            right: -22px;
            width:34px;
            height:34px;
            background:rgba(242,117,135,1);
            border:2px solid rgba(255,255,255,1);
            color:rgba(255,255,255,1);
            border-radius: 50%;
            line-height: 34px;
            font-size:24px;
          }
          .tabbar-icon {
            &.home {
              background: url("https://m1.allinmed.cn/static/image/mp/index/1.5.0/tab_index_select.png") no-repeat center bottom;
              background-size: 56px 56px;
            }
            &.message{
              background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/tab_message-active.png") no-repeat center bottom;
              background-size: 56px 56px;
              position: relative;

            }
            &.my {
              background: url("https://m1.allinmed.cn/static/image/mp/index/1.5.0/tab_self_select.png") no-repeat center bottom;
              background-size: 56px 56px;
              position: relative;
            }
          }
        }
        .tabbar-des1 {
          position: relative;
          bottom: 6px;
        }
      }
    }
  }
</style>
