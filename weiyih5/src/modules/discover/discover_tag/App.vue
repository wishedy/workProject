<template>
  <section class="al-mainInner" :style="innerStyle">
    <section class="al-searchHead">
    <HeaderBar  :header-config="headerConfig" :class="{'al-searchHeadShow':onSearch}"></HeaderBar>
    <SearchBar></SearchBar>
    </section>
    <section class="al-searchFocusMask" :class="{'al-searchFocusMaskShow':onSearch}" v-show="showOnOff">
      <loading v-show="loading"></loading>
    </section>
    <Nothing v-show="(searchStr.length!==0)&&onSearch&&list.length===0&&!loading"></Nothing>
    <TagContent v-show="searchStr.length===0"></TagContent>
    <SearchContent></SearchContent>
  </section>
</template>

<script type="text/ecmascript-6">
    import axios from "axios"
    import loading from "components/Loading/Loading.vue";
    import comm from 'static/js/comm.js'
    import HeaderBar from "components/HeaderBar/HeaderBar.vue";
    import SearchBar from "./components/SearchBar.vue"
    import Nothing from "./components/Nothing.vue"
    import TagContent from "./components/TagContent.vue"
    import SearchContent from "./components/SearchContent.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue';
  export default {
        data(){
          return {//头部栏配置参数
              headerConfig: {
                  title: "全部标签",
                  backOnOff: true,
                  share: {
                      onOff: false
                  }
              },
            wakeData:{
              el: ".al-newWakeUpAppBtn",
              ios: "allinmdios://app.allinmd.cn/applinks.html",
              ios9: "http://app.allinmd.cn/applinks.html",
              android: "allin://com.allin.social:75235?data={}"
            }
          }
        },
      computed:{
          loading(){
            return this.$store.state.firstLoading;
          },
          list(){
              if(this.$store.state.searList.length===0){
                  return [];
              }else{
                  return JSON.parse(this.$store.state.searList);
              }
          },
          searchStr(){
              return this.$store.state.searchStr;
          },
          onSearch(){
              return this.$store.state.onSearch;
          },
          innerStyle(){
              return [
                  {"margin-top": (this.onSearch)?"1.5rem":"3rem"}
              ]

          },
          showOnOff(){
              let t = this;
              return t.$store.state.searList.length===0;
          }
      },
      components:{
          HeaderBar,SearchBar,Nothing,TagContent,SearchContent,loading,WakeApp
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "scss/base";
  @import "scss/pages/discover/discover_searchTag";
</style>
