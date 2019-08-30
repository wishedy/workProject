<template>
    <section class="al-elite-seat" v-if="!isEmptyObject(config)">
        <EliteSeatContent :config="config"></EliteSeatContent>
    </section>
</template>
<script>
    import EliteSeatContent from './EliteSeatContent';
    import comm from 'static/js/comm.js';
    export default {
        props:{
          config:{
              default(){
                  return {}
              }
          }
        },
        components:{
            EliteSeatContent
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            }
        }
    }
</script>