<template>
  <section class="crm-login">
    <figure class="crm-login-box">
      <h3>Allin新业务平台</h3>
      <form class="crm-login-form">
        <el-input class="crm-login-input" placeholder="请输入账号" v-model="username"></el-input>
        <el-input class="crm-login-input" type="password" placeholder="请输入密码" v-model="password"></el-input>
        <p class="crm-login-tips">{{tips}}</p>
        <el-button type="primary" round v-on:click="loginOnClick">登录</el-button>
      </form>
    </figure>

  </section>
</template>

<script>
import apiConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

import {formatMenuDataList} from '@/assets/js/utils/auth';

export default {
  name: 'Login',
  data() {
    return {
      username: '', // 用户账号
      password: '', // 用户登录密码
      tips: ''// 登录结果提示
    };
  },
  methods: {
    loginOnClick: function() {
      let data = {};
      const _this = this;
      data.userLoginName = this.username;
      data.userPassword = this.password;
      data.isValid = '3';
      if (!this.username || !this.password) {
        _this.tips = '！账号、密码不可为空';
      }
      else {
        axios({
          method: apiConfig.loginAPI.type,
          url: apiConfig.loginAPI.url,
          data: data
        }).then(function(res) {
          if (res.data.responseObject && res.data.responseObject.responseData && !res.data.responseObject.responseCode) {
            const sessionUser = res.data.responseObject.responseData.SESSION_USER;
            const menuMap = res.data.responseObject.responseData.MENU_MAP;

            _this.$store.commit('setUserLoginName', sessionUser.userLoginName);
            _this.$store.commit('setUserName', sessionUser.userRealName);

            let menuList = formatMenuDataList(menuMap.responseData.data);
            _this.$store.commit('setMenuList', menuList);

            localStorage.setItem('userLoginName', sessionUser.userLoginName);
            localStorage.setItem('userRealName', sessionUser.userRealName);
            localStorage.setItem('userId', sessionUser.userId);
            sessionStorage.setItem('menuList', JSON.stringify(menuList));
            // sessionStorage 中也保存userLoginName,仅用于校验是否登录，localStorage 中用于业务
            sessionStorage.setItem('userLoginName', sessionUser.userLoginName);

            _this.$router.push({path: '/'});
          }
          else {
            _this.tips = '！账号、密码错误请重新登录';
          }
        }).catch((e) => {
          console.log('登录异常', e);
        });
      }
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.loginOnClick();
      }
    };
  }
};
</script>

<style lang="scss">
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #F7F9FC inset !important;
    background-color: #F7F9FC !important;
    background-image: none !important;
    color: #F7F9FC !important;
  }
  .crm-login-input{
    border-radius: 4px;
    width:300px;
  .el-input__inner{
    height:50px;
    background: #F7F9FC;
    border: 1px solid #E6E6E8;
    border-radius: 4px;
    font-size:15px;
  }
  }

  .crm-login {
    width: 1200px;
    height: 640px;
    margin: 0 auto;
    margin-top: 20px;
    position: relative;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
    border-radius: 4px;
  .crm-login-box {
  h3 {
    padding-top: 120px;
    text-align: center;
    font-size: 20px;
  }
  .crm-login-form {
    position: absolute;
    width: 300px;
    height: 200px;
    left: 50%;
    margin-left: -150px;
    margin-top: 40px;
  }
  .el-input {
    margin-top: 20px;
  }
  .el-button {
    background: #4B67D6;
    height: 41px;
    width: 160px;
    margin: 36px 70px;
  }
  .crm-login-tips {
    margin-top: 16px;
    font-family: PingFangSC-Regular;
    font-size: 15px;
    color: #EB3B46;
    letter-spacing: 0;
    line-height: 15px;
  }
  }
  }

</style>
