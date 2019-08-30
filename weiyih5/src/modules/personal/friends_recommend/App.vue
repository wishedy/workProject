<template>
  <section class="al-mainInner">
    <HeaderBar :header-config="headerConfig"></HeaderBar>
    <Container></Container>
  </section>
</template>

<script type="text/ecmascript-6">
  import HeaderBar from "components/HeaderBar/HeaderBar.vue";
  import Container from "./components/Container";
  import comm from 'static/js/comm.js';
  import TempCache from 'static/js/tempcache.js';

  export default {
      data(){
        return {
            headerConfig: {
                title: "推荐医师",
                backOnOff: true,
                share: {
                    onOff: false
                },
                feedback: {
                    onOff: false
                }
            }
        }
      },
      methods:{

      },
      mounted(){

      },
      components:{
          HeaderBar,
          Container
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/index/recommend_users.scss';
 @import 'scss/pages/personal/personal_fans.scss';
</style>
