<template>
    <section class="alEmr-searchNoList" v-if="noCListFlag==3">
        <img class="noSearchImg" src="/static/images/pages/allCase/noSearch.png">
        <p class="noSearchText">暂无搜索结果，换个关键词试试吧</p>
    </section>
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'searchNoList',
        computed:{
            ...mapGetters(['noCListFlag']),
        },
    }
</script>

<style scoped>

</style>
