<template>
    <!--归属成功提示遮罩开始-->
    <section class="alEmr-sucPop" v-if="teamSuccess">
        <section class="sucText">
            <aside>
                <i></i>
                <p>
                    <span class="textBelong"><b>{{teamSucInfo[0].caseCount}}</b>个病历已成功归于</span>
                    <span class="textTeam">“{{teamSucInfo[0].teamName}}”</span>
                </p>
            </aside>
        </section>
    </section>
    <!--归属成功提示遮罩结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: 'belongSuccessPop',
        computed:{
            ...mapGetters(['teamSuccess','teamSucInfo']),
        },
    }
</script>

<style scoped>

</style>
