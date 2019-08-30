<template>
  <section class="su_maskers">
    <section class="su_confirmBox-inner">
      <article class="su_confirmBox-content"><p v-show="ensureParams.content">{{ensureParams.content}}</p></article>
      <footer class="su_confirmBox-btns">
        <!--<button class="su_confirmBox-ensureBtn" @opensetting="ensureClickEvent" open-type="openSetting">{{ensureParams.ensure}} </button>-->
        <button v-if="ensureParams.type!=='openSetting'" class="su_confirmBox-ensureBtn" @click="ensureClickEvent">{{ensureParams.ensure}}</button>
        <button v-if="ensureParams.type==='openSetting'" class="su_confirmBox-ensureBtn" open-type="openSetting" @opensetting="ensureClickEvent">{{ensureParams.ensure}}</button>
      </footer>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by gubowen on 2017/7/27.
   */
  export default{
    data(){
      return {}
    },
    methods:{
      ensureClickEvent(obj) {
        console.log(obj);
        this.$emit('ensureClickEvent',obj)
      }
    },
    props: {
      ensureParams: {
        type: Object
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .su_maskers {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 5;
    transition: all 0.3s linear;
  }
  .su_confirmBox-inner {
    background-color: #fff;
    position: absolute;
    border-radius: 24px;
    overflow:hidden;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .su_confirmBox-content {
    min-width: 442px;
    padding: 49px;
    font-size:34px;
    line-height: 1.5;
    border-bottom: 1px solid #dfdfdf;
    color: #222;
    p {
      font-weight: bold;
      text-align: center;
      margin-top:5px;
    }
  }

  .su_confirmBox-btns {
    .su_confirmBox-ensureBtn{
      width:100%;
      font-size:34px;
      text-align: center;
      color: #00BEAF;
      font-weight: bold;
      background: #fff;
    }
  }
</style>
