<template>
  <div></div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Yuxi(Shurrik)Yang on 2018/7/5.
   */
  export default {
    data() {
      return {}
    },
    methods: {},
    onLoad() {

      const query = this.$root.$mp.query;
      let search = [];

      for (let i in query) {
        if (i !== "url") {
          search.push(`${i}=${query[i]}`)
        }
      }
      console.log(`${decodeURIComponent(query.url)}?${search.join("&")}`)
      if (query.url.includes("index") || query.url.includes("personal")) {
        wx.switchTab({
          url: `${decodeURIComponent(query.url)}?${search.join("&")}`,
          complete(res) {
            // console.log(res)
          }
        })
      }else {
        wx.redirectTo({
          url: `${decodeURIComponent(query.url)}?${search.join("&")}`,
          complete(res) {
            // console.log(res)
          }
        })
      }
    }
  }
</script>

<style lang="scss">

</style>
