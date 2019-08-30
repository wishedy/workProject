<template>
    <!--筛选无结果开始-->
    <section class="alEmr-screeningNoList" v-if="noCListFlag==2">
        <img class="noScreeningImg" src="/static/images/pages/allCase/noCase.png">
        <p class="noScreeningText">暂无符合条件的病历</p>
    </section>
    <!--筛选无结果结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'screeningNoList',
        computed:{
            ...mapGetters(['noCListFlag']),
        },
    }
</script>

<style scoped>

</style>
