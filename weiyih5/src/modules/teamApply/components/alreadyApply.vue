<template>
    <section class="alreadyApply" v-if="showMoIndex===3">
        <aside>
            <p class="medAccept">
                <i></i>
                <span class="highLight">{{medArr.authorName}}医生</span>
                <span v-if="teamState==0||teamState==2">已收到您的申请</span>
            </p>
            <p class="remindText">请在唯医骨科app中查看结果</p>
        </aside>
    </section>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    export default {
        name: "alreadyApply",
        computed:{
            ...mapGetters(['showMoIndex','medArr','teamState']),
        },
    }
</script>

<style scoped>

</style>