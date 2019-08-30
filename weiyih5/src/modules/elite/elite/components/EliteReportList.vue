<template>
    <section class="al-elite-reportList">
        <EliteReportItem  v-for="(item,index) in config.list"  :key="index" :reportConfig="item" v-if="index<config.limitNum"></EliteReportItem>
    </section>
</template>
<script>
    import EliteReportItem from  './EliteReportItem'
    export default {
        components:{
            EliteReportItem
        },
        props:{
            config:{
                default(){
                    return {
                        totalCount:0,
                        list:[],
                        limitNum:3
                    }
                }
            }
        }
    }
</script>