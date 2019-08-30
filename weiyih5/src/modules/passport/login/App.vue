<template>
  <section class="al-mainInner">
    <Container></Container>
  </section>
</template>

<script type="text/ecmascript-6">
  import Container from "./components/Container";
  import comm from 'static/js/comm.js';
  import TempCache from 'static/js/tempcache.js';

  export default {
      data(){
        return {

        }
      },
      methods:{

      },
      mounted(){

      },
      components:{
          Container
      }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
 @import 'scss/pages/login_register/login.scss';
</style>
