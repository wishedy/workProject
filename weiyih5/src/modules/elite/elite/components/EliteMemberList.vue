<template>
    <section class="al-elite-memberList" v-if="!isEmptyObject(memberConfig)">
        <EliteMemberItem v-for="(item,index) in memberConfig.memberList" :config="item" :key="index" @follwedCustomer="follwedCustomer"></EliteMemberItem>
    </section>
</template>
<script>
    import  EliteMemberItem from './EliteMemberItem'
    import comm from 'static/js/comm.js';
    export default {
         components:{
             EliteMemberItem
         },
        props:{
            memberConfig:{
                default(){
                    return {}
                }
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            follwedCustomer(config){
                let _this = this;
                _this.$emit('follwedCustomer',config);
            }
        }
    }
</script>