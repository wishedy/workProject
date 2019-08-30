<template>
  <section class="maskers">
    <section class="vConfirmInner">
      <h2 v-if="confirmParams.title">{{confirmParams.title}}</h2>
      <footer class="vConfirmBtns">
        <button class="vConfirmEnsure" @click="ensureClickEvent">{{confirmParams.ensure}}</button>
        <button class="vConfirmCancel" @click="cancelClickEvent">{{confirmParams.cancel}}</button>
      </footer>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：垂直结构的确认弹层组件
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by wangjingrong on 2017/12/7.
   */
  export default{
    data(){
      return {}
    },
    methods:{
      cancelClickEvent() {
        this.$emit('cancelClickEvent')
      },
      ensureClickEvent() {
        this.$emit('ensureClickEvent')
      }
    },
    mounted(){

    },
    props: {
      confirmParams: {
        type: Object
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">

  .vConfirmInner{
    width:540px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    text-align: center;
    background: #fff;
    border-radius: 10px;
    h2{
      color: #000000;
      font-size:40px;
      padding:60px 0 50px;
    }
    button{
      width:100%;
      display:block;
      padding:30px 0;
      border-top:1px solid #DFDFDF;
      font-size:36px;
      &.vConfirmEnsure{
        color: #2FC5BD;
        font-weight: 600;
      }
      &.vConfirmCancel{
        color: #333333;
      }
    }
  }
</style>
