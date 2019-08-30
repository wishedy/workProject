<template>
    <section class="al-mainInner"  :class="{'whiteBg':($route.name!=='home')}">
        <router-view></router-view>
    </section>
</template>
<script type="text/ecmascript-6">
    const $ = require('jquery');
    import {mapGetters,mapActions} from  'vuex';
    /*window.addEventListener('touchstart',function(e){e.preventDefault();});
    window.addEventListener("touchmove",function(e){e.preventDefault();});
    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    document.addEventListener('touchstart', function (e) { e.preventDefault(); }, false);*/
    export default  {
        data(){
            return {

            }
        },
        watch:{
          '$route'(n){
              let t = this;
              if(n.name!='introduction'){
                  $(".al-mainInner").scrollTop(0);
                  $('html,body',document,".al-mainInner").animate({scrollTop: 0}, 0);
              }

          }
        },
        computed:{
           ...mapGetters(['scrollTop'])
        }
    }
</script>
<style scoped lang="scss">
    @import "scss/pages/eliteClub/eliteClub";
</style>
