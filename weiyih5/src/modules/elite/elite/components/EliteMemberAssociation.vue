<template>
  <section class="al-elite-association" v-if="!isEmptyObject(associationConfig)">
      <EliteMemberTitle @slideUp="slideModule" :class="{'small-title':slideOnOff}" :slideName="slideOnOff" :config="{
       title:associationConfig.branchName

      }"></EliteMemberTitle>
      <EliteMemberModule v-show="slideOnOff" v-for="(item,index) in associationConfig.titleList" :config="item" :key="index" @follwedCustomer="follwedBranchCustomer"></EliteMemberModule>
  </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import EliteMemberModule from './EliteMemberModule';
    import EliteMemberTitle from './EliteMemberTitle';
    export default {
        props:{
            associationConfig:{
                default(){
                  return {}
                }
            },
            listIndex:{
                default:0
            }
        },
        components:{
            EliteMemberModule,
            EliteMemberTitle
        },
        data(){
            let _this = this;
            let slideOnOff = false;
            console.log(_this.listIndex);
            if(_this.listIndex===0){
                slideOnOff = true;
            }
          return {
              slideOnOff:slideOnOff
          }
        },
        methods:{
            slideModule(n){
                let _this = this;
                _this.slideOnOff = !_this.slideOnOff;
            },
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            follwedBranchCustomer(obj){
                let _this = this;
                _this.$emit("follwedCustomer",obj);
            }
        }
    }
</script>