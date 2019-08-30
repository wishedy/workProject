<template>

  <!-- 全局提示框 -->
  <div v-show="visible" v-bind:class="[{info:type.isInfo}]" class="tipMessage">
    <p>{{message}}</p>
  </div>

</template>
<script>
/**
   * 全局消息提示
   * 详情见 "./README.md "文档
   */
export default {
  data() {
    return {
      visible: false,
      message: '',
      type: {
        isInfo: false
      }
    };
  }
};
</script>
<style lang="scss">
  .tipMessage {
    width: 100%;
    position: absolute;
    top: 66px;
    left: 0;
  }
  .info{
    background: #FFEBEF;
    p{
      padding: 11px 0;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #EB3B46;
      letter-spacing: 0;
      line-height: 14px;
    }
  }

</style>
