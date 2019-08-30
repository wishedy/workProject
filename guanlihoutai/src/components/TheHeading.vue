<template>
  <header>
    <figure class="crm-header">
      <router-link class="crm-header-logo" to="/home">
        <img src="/static/images/icons/logo.png" width="182.5px" height="50px">
      </router-link>
      <section class="crm-header-right-area">
        <router-link :to="headerHome.router" class="crm-header-home crm-header-float-right" v-if="headerHome.visiable">
          <img src="/static/images/icons/icon-home.png">
        </router-link>
        <router-link :to="headerCustomItem.router" class="crm-header-custom-item crm-header-float-right"
                     v-if="headerCustomItem.visiable">
          <span>{{headerCustomItem.content}}</span>
        </router-link>
        <el-dropdown v-if="headerUserInfo.isLogin" @command="userInfoCommandHandle" class="crm-header-user-info">
          <span class="el-dropdown-link ">{{headerUserInfo.content}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logoutEvent">登出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span v-else class="crm-header-user-info">{{headerUserInfo.content}}</span>
      </section>
    </figure>
  </header>
</template>

<script >
/**
   * CRM 管理后台，公共 Header 部分
   * 注意事项：
   * 2018.09.05-v2.7迭代-姚乔
   * 1、本组件为整个 CRM 后台管理站点通用组件，改动时需考虑影响范围
   * 2、本组件的 headerCustomItem 属性可以用来定制化特殊的 item 需求
   *
   */

export default {
  name: 'Header',
  data() {
    return {
      headerUserInfo: {
        visiable: false,
        isLogin: false,
        content: '未登录'
      },
      headerHome: {
        visiable: false,
        router: '/home'
      }, // 需要自定义显示的 Item 内容
      headerCustomItem: {
        visiable: false,
        content: '自定义啊',
        router: '/home'
      }
    };
  },
  methods: {
    userInfoCommandHandle(command) {
      if (command === 'logoutEvent') {
        this.logoutEvent();
      }
    },
    // 用户登出操作
    logoutEvent() {
      this.$confirm('确定要退出登录状态吗？', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        center: true,
        showClose: false,
        customClass: 'logout-confirm-box'
      }).then(() => {
        localStorage.clear();
        this.headerCustomItem.visiable = false;
        this.headerHome.visiable = false;
        this.headerUserInfo.isLogin = false;
        this.$router.push('/login');
      }).catch(() => {
        throw new Error('用户退出登录状态异常');
      });
    }
  },
  watch: {
    '$route': function(to, from) {
      const routerName = this.$route.name;
      const userLoginName = localStorage.getItem('userLoginName');
      if (routerName === 'login' && !userLoginName) {
        this.headerUserInfo.visiable = true;
        this.headerUserInfo.content = '未登录';

        this.headerCustomItem.visiable = false;
        this.headerHome.visiable = false;
      }
      else {
        this.headerHome.visiable = true;
        this.headerHome.router = '/home';

        this.headerCustomItem.visiable = false;

        this.headerUserInfo.visiable = false;
        this.headerUserInfo.isLogin = true;
        this.headerUserInfo.content = userLoginName;

        if (routerName === 'memberAuditDetail' || routerName === 'memberAuditChangeDetail') {
          this.headerCustomItem.visiable = true;
          this.headerCustomItem.content = '查看审核列表';
          this.headerCustomItem.router = '/memberAudit';
        }
        else if (routerName === 'memberMergeDetail') {
          this.headerCustomItem.visiable = true;
          this.headerCustomItem.content = '查看合并列表';
          this.headerCustomItem.router = '/memberMerge';
        }
      }
    }
  }
};
</script>

<style lang="scss">
  @import "../assets/scss/base.scss";

  header {
    background: #ffffff;
    width: 100%;
    height: 66px;
  }

  .crm-header {
    margin: 0 35px;
    padding: 10px 0;
    font-size: 0;
    a {
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
    }
    img {
      vertical-align: middle;
    }
    .crm-header-name {
      margin-left: 10px;
      font-family: PingFangSC-Regular;
      font-size: 18px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      vertical-align: middle;
    }
  }

  .crm-header-right-area {
    float: right;
    a {
      margin-left: 60px;
    }
    .crm-header-tip {

    }
    .crm-header-custom-item {
      padding: 9px 21px;
      border: 1px solid #4B67D6;
      border-radius: 100px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B67D6;
      letter-spacing: 0;
      line-height: 1.5;
    }
    .crm-header-user-info {
      vertical-align: middle;
      margin-left: 50px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #6C7492;
      letter-spacing: 0;
      line-height: 2;
      cursor: pointer;
    }
  }

  .logout-confirm-box {
    p {
      font-weight: bold;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 24px;
    }
    button {
      margin: 27px 20px;
      padding: 13px 40px;
      border-radius: 100px;
      color: #ffffff;
      &:nth-child(1) {
        background: #A1A8C0;
        &:hover {
          color: #ffffff;
        }
      }
      &:nth-child(2) {
        background: #4B67D6;
      }
    }
  }

</style>
