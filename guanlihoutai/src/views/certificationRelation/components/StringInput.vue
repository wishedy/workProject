<template>
  <input :value="strInput" @input="updateInput($event.target.value.trim())" class="string-input"/>
</template>

<script>
/**
 * 功能描述：供拖拽组件使用的 input 子组件
 * 参数说明：
 * 1、value - 表示父组件传入的值
 * 注意事项：
 *
 * Create by YaoQiao on 2019/3/29
 */

const VALUE = 'value';
const INPUT = 'input';

export default {
  name: 'StringInput',
  props: [VALUE],
  data() {
    return {
      strInput: this[VALUE]
    };
  },
  methods: {
    updateInput(value) {
      this.$emit(INPUT, value);
    }
  }
};
</script>

<style scoped type="scss">
  .string-input{
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
</style>
