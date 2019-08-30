<template>
  <section class="intro-inner">
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/24.
   */

  export default {
    data() {
      return {

      }
    },
    methods: {

    },
    mounted() {

    },
    onLoad(options){
      wx.showLoading({
        mask: true
      });
      let result=[];
      for (let i in options){
        result.push(`${i}=${options[i]}`);
      }

      wx.redirectTo({
        url: '/packageB/consultIntro/consultIntro?'+result.join("&")
      });
    },
    onShow(){

    },
    onHide(){

    },
    computed: {

    },
    components:{

    }
  }
</script>

<style lang="scss">

</style>
