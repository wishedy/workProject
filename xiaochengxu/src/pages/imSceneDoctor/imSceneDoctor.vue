<template>
  <div></div>
</template>

<script type="text/ecmascript-6">

  export default {

    data() {
      return {}
    },

    onHide() {

    },
    onLoad(options) {
      wx.showLoading({
        mask: true
      });
      let result=[];
      for (let i in options){
        result.push(`${i}=${options[i]}`);
      }

      wx.redirectTo({
        url: '/packageA/imSceneDoctor/imSceneDoctor?'+result.join("&")
      });
      console.log(options)
    },
    computed: {

    },

    methods: {

    },
    components: {

    }
  }
</script>

<style lang="scss" scoped>

</style>
