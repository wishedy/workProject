<template>
    <section class="al-elite-liveContainerWrap">
        <section class="al-elite-liveContainer">
            <EliteLiveItem v-for="(item,index) in liveConfig.list"
                           :key="index"
                           :config="item"
                           v-if="index<liveConfig.limitNum"
            ></EliteLiveItem>
        </section>
    </section>
</template>
<script>
    import EliteLiveItem from './EliteLiveItem';
    import {mapGetters,mapActions} from 'vuex';
    import axios from 'axios';
    export default {
        components:{
            EliteLiveItem
        },
        props:{
          liveConfig:{
              default(){
                  return {
                      totalCount:0,
                      list:[],
                      limitNum:0
                  }
              }
          }
        },
        mounted(){
        }
    }
</script>