<template>
    <section class="al-newWakeApp-container" v-show="!isApp">
        <div class="al-newWakeApp-bar">
            <div class="logo"></div>
            <div class="title">唯医骨科 手术资源免费下载</div>
            <div class="downBtn al-newWakeUpAppBtn">立即打开</div>
        </div>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    export default {
        props:{
          options:{
              default(){
                  return {};
              },
              type:Object
          }
        },
        data(){
          return {
              isApp:true
          }
        },
        watch:{
            options(n){
                let _this = this;
                console.log({..._this.options,runAtOnce:false});
                comm.bindCallApp({..._this.options,runAtOnce:false});
                console.log("改变配置数据");
            }
        },
        methods:{
            openApp(){
                let _this = this;
                console.log(_this.options);
                comm.bindCallApp({..._this.options,runAtOnce:false});

            }
        },
        mounted(){
            let _this = this;
            console.log({..._this.options,runAtOnce:false});
            comm.bindCallApp({..._this.options,runAtOnce:false});
            setTimeout(()=>{
                _this.isApp = comm.isApp();
            },1500);
        },
        updated() {
            let _this = this;
            console.log({..._this.options,runAtOnce:false});
            comm.bindCallApp({..._this.options,runAtOnce:false});
        }
    }
</script>
<style lang="scss" scoped>
    @import "scss/components/_newWakeUpApp.scss";
</style>
