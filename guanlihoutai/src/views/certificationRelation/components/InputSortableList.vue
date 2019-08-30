<template>
  <section>
    <SlickList>

    </SlickList>
  </section>
</template>

<script>
/**
 * 功能描述：带有输入框的可拖拽组件
 * 参数说明：
 * 注意事项：
 * 1、基于 vue-slicksort 组件
 * 1、仅支持单列拖拽
 *
 * Create by YaoQiao on 2019/3/29
 */

import {SlickList, SlickItem} from 'vue-slicksort';
import StringInput from './StringInput';

export default {
  name: 'InputSortableList',
  components: {
    SlickList,
    SlickItem,
    StringInput
  },
  data() {
    return {};
  }
};
</script>

<style scoped>

</style>
