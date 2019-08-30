<template>
    <section class="al-elite-redundance" v-if="!isEmptyObject(redundanceConfig)">
        <EliteMemberModule  v-for="(item,index) in redundanceConfig.titleList" :config="item" :key="index"  @follwedCustomer="flowPeople" ></EliteMemberModule>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import EliteMemberModule from './EliteMemberModule'
    export default {
        props:{
            redundanceConfig:{
                default(){
                    return {}
                }
            }
        },
        name:'elite-redundance',
        components:{
            EliteMemberModule
        },
        watch:{
            redundanceConfig:{
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
            flowPeople(config){
                let _this = this;
                _this.$emit('follwedCustomer',config);

            }
        }
    }
</script>