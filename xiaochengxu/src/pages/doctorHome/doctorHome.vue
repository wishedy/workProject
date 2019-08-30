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
      wx.redirectTo({
        url: '/packageD/doctorHome/doctorHome?scene='+options.scene
      })
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
