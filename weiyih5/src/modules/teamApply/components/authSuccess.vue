<template>
    <section class="authSuccess" v-if="showMoIndex===2">
        <aside>
            <p class="authRemind">
                <i></i>
                <span>认证提交成功</span>
            </p>
            <p class="remindText">待审核通过后</p>
            <p class="remindText">可扫描团队二维码申请加入</p>
        </aside>
    </section>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    export default {
        name: "authSuccess",
        computed:{
            ...mapGetters(['showMoIndex']),
        },
    }
</script>

<style scoped>

</style>