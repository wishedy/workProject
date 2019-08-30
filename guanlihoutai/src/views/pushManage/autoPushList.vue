<template>
  <push-list-manage :type="1"></push-list-manage>
</template>

<script>
/**
 * 名称：自动推送列表
 * 说明：
 * 作者：刘宇涛
 * 时间：2019/6/25
 * 推送为1 召回为0
 */

import pushListManage from './components/pushListManage';

export default {
  name: 'autoPushList',
  components: {pushListManage},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang='scss'>

</style>
