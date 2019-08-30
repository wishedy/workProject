<template>
  <section class="crm-patientsEvaluation">
    <!--患者评价标题开始-->
    <h1 class="crm-patientsEvaluation-title">患者评价</h1>
    <!--患者评价标题结束-->
    <!--患者评价操作模块开始-->
    <Handler></Handler>
    <!--患者评价操作模块结束-->
    <!--患者评价批量操作按钮开始-->
    <BatchBtn></BatchBtn>
    <!--患者评价批量操作按钮结束-->
    <!--患者列表模块开始-->
    <TableList></TableList>
    <!--患者列表模块结束-->
    <!--患者列表分页模块开始-->
    <Pager></Pager>
    <!--患者列表分页模块结束-->

  </section>
</template>
<script>
/**
   * CRM 管理后台，患者端管理，患者评价部分
   * 注意事项：暂无
   * author:zhangheng
   * create-time:2019.01.29 16:49 -
   * 产品版本：患者端v1.2下的05版本
   * 迭代版本：
   * 1、首页模块的相关数据需要通过 src/router/menuRelation.js 和 src/router/router.js 配合设置才能正常使用，详情可见 README.md 的“管理后台主页菜单配置说明”部分
   * 2、当前首页的图标仅提供了 3 种
   */
import comm from '@/assets/js/utils/comm';
import Handler from './components/handler';
import TableList from './components/tableList';
import BatchBtn from './components/batchBtn';
import Pager from './components/pager';
export default {
  data() {
    return {
      name: '患者评价'
    };
  },
  components: {
    Handler,
    TableList,
    BatchBtn,
    Pager
  },
  destroyed() {
    comm.goBack();
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/patientsEvaluation/patientsEvaluation";
</style>
