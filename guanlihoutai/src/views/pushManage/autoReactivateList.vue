<template>
    <push-list-manage :type="0"></push-list-manage>
</template>

<script>
/**
 * 名称：自动召回列表
 * 说明：
 * 作者：刘宇涛
 * 时间：2019/6/25
 * 推送为1 召回为0
 */

import pushListManage from './components/pushListManage';

export default {
  name: 'autoReactiveList',
  components: {pushListManage},
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style scoped lang='scss'>

</style>
