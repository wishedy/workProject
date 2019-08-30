<template>
    <section class="al-mainInner">
        <!-- 头部信息开始 -->
        <header-bar :headerConfig="headerConfig"></header-bar >
        <!-- 头部信息结束 -->
        <list-content></list-content>

    </section>
</template>

<script>
    import HeaderBar from 'components/HeaderBar/HeaderBar.vue';
    import listContent from './components/listContent.vue';
    export default {
        data (){
          return {
              headerConfig:{
                  title:"我关注的会议",
                  backOnOff:true
              }

          }
        },
        components:{
            HeaderBar,
            listContent
        }
    }
</script>

<style>

</style>