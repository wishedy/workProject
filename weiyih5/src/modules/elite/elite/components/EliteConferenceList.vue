<template>
    <section class="al-elite-conferenceList">
        <EliteConferenceItem v-for="(item,index) in config.list" :key="index" :conferenceConfig="item" v-if="index<config.limitNum"></EliteConferenceItem>
    </section>
</template>
<script>
    import EliteConferenceItem from './EliteConferenceItem';
    export default {
        components:{
            EliteConferenceItem,

        },
        props:{
            config:{
                default(){
                    return{
                        totalCount:0,
                        list:[],
                        limitNum:0
                    }
                }
            }
        }
    }
</script>