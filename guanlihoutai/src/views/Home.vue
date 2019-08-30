<template>
  <section class="crm-home">
    <section class="menu-list">
      <section class="menu-list-row" v-for="(row,index) in menuList" :key="index">
        <h3>{{row.title}}</h3>
        <section class="menu-list-panel">
          <router-link :to="item.router" tag="section" class="menu-list-item"
                       v-for="(item,index) in row.menuItemList" :key="index">
            <figure class="menu-list-item-icon">
              <img :src="item.icon">
            </figure>
            <p>{{item.name}}</p>
          </router-link>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
/**
   * CRM 管理后台，首页部分
   * 注意事项：
   * 2018.09.07 - v2.7 迭代-姚乔
   * 1、首页模块的相关数据需要通过 src/router/menuRelation.js 和 src/router/router.js 配合设置才能正常使用，详情可见 README.md 的“管理后台主页菜单配置说明”部分
   * 2、当前首页的图标仅提供了 3 种
   */
export default {
  name: 'Home',
  data() {
    return {
      menuList: []
    };
  },
  created: function() {
    if (!this.$store.getters.menuList) {
      let menuList = JSON.parse(sessionStorage.getItem('menuList'));
      this.$store.commit('setMenuList', menuList);
      this.menuList = menuList;
    }
    else {
      this.menuList = this.$store.getters.menuList;
    }
  }
};
</script>

<style lang="scss" scoped>
  .crm-home {
    width: 1200px;
    margin: 35px auto;
    .menu-list {
      width: 100%;
      .menu-list-row {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #2C343A;
        letter-spacing: 0;
        line-height: 1.5;
        .menu-list-item {
          display: inline-block;
          margin: 25px 50px 25px 0;
          width: 200px;
          height: 98px;
          background: #FFFFFF;
          box-shadow: 0 4px 15px 0 rgba(42, 53, 102, 0.12);
          border-radius: 4px;
          .menu-list-item-icon {
            overflow: hidden;
            img {
              float: right;
              margin: 10px;
            }
          }
          p {
            margin: 10px 16px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #2C343A;
            letter-spacing: 0;
            line-height: 15px;
          }
        ;
          &:hover {
            cursor: pointer;
            p {
              color: #4B67D6;

            }
          }
        }
      }
    }
  }
</style>
