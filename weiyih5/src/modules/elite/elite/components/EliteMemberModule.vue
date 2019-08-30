<template>
    <section class="al-elite-memberModule" v-if="!isEmptyObject(config)">
        <EliteSubTitle :config="{
            title:config.name,
            totalCount:config.memberList.length,
        }"></EliteSubTitle>
        <EliteMemberList @follwedCustomer="flowPeople" :memberConfig="{
        memberList:config.memberList
}"></EliteMemberList>
    </section>
</template>
<script>
    import EliteSubTitle from './EliteSubTitle';
    import EliteMemberList from './EliteMemberList';
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
            EliteSubTitle,
            EliteMemberList
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            flowPeople(config){
                let _this = this;
                _this.$emit('follwedCustomer',config);
            },
        }
    }
</script>