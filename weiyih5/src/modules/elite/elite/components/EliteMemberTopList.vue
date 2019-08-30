<template>
    <section class="al-elite-memberList" v-if="!isEmptyObject(memberConfig)">
        <section class="al-elite-memberModule" v-for="(item,index) in memberConfig.memberList" :key="index">
            <EliteSubTitle :config="{
            title:item.name,
            totalCount:'0'
        }"></EliteSubTitle>
            <EliteMemberItem v-for="(innerItem,innedIndex) in item.memberList" :config="innerItem" :key="index+'@'+innedIndex" @follwedCustomer="follwedCustomer"></EliteMemberItem>
        </section>
    </section>
</template>
<script>
    import  EliteMemberItem from './EliteMemberItem'
    import  EliteSubTitle from './EliteSubTitle'
    import comm from 'static/js/comm.js';
    export default {
        components:{
            EliteMemberItem,
            EliteSubTitle
        },
        props:{
            memberConfig:{
                default(){
                    return {}
                }
            }
        },
        watch:{
            memberConfig:{
                handler(n){
                    console.log(n);
                },
                deep:true
            }
        },
        methods:{
            isEmptyObject(obj){
                return comm.isEmptyObject(obj);
            },
            follwedCustomer(config){
                let _this = this;
                _this.$emit('follwedTopCustomer',config);
            }
        }
    }
</script>