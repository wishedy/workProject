<template>
    <section class="al-elite-memberTitle" @click.stop="slideUp" v-if="!isEmptyObject(config)">
        <div class="title" v-text="config.title"></div>
        <span class="icon" :class="{'down':!slideName,'up':slideName}"></span>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
          config:{
              default(){
                  return {
                      title:""
                  }
              }
          },
            slideName:{
              default(){
                  return false;
              }
            }
        },
        data(){
          return {
              up:0
          }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            slideUp(){
                let _this = this;
                //_this.up===0?_this.up=1:_this.up=0;
                _this.$emit("slideUp",_this.up);
            }
        }
    }
</script>