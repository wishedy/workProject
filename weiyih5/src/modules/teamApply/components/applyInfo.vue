<template>
    <section class="applyInfo" v-if="showMoIndex===1">
        <aside>
            <aside class="applyInfoText_01">
            </aside>
            <aside class="applyInfoText_02">
                <p>登录并申请成为</p>
                <p>
                    <span class="infoOne">{{medArr.authorName}}</span>
                    <span>的</span>
                    <span class="infoThree">[{{medArr.teamName}}]</span>
                    <span>团队成员</span>
                </p>
            </aside>
        </aside>
        <aside class="applyInfoText_03">
            <aside class="bg_box">
                <aside class="applyInfoPerson">
                    <figure>
                        <img :src="medArr.url">
                    </figure>
                    <aside>
                        <p class="nameInfo">{{medArr.authorName}}</p>
                        <p>
                            <span class="medInfo">{{medArr.medicalTitle}}</span>
                            <span class="comInfo">{{medArr.company}}</span>
                        </p>
                    </aside>
                </aside>
            </aside>

        </aside>

    </section>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    export default {
        name: "applyInfo",
        computed:{
            ...mapGetters(['showMoIndex','medArr']),
        },
    }
</script>

<style scoped>

</style>