<template>
    <section class="al-mainInner">
        <router-view></router-view>
        <loading v-if="isLoading"></loading>
    </section>
</template>

<script type="text/ecmascript-6">
    import {shareAll} from '@allin/wap-share';
    import Loading from 'components/Loading/Loading';
    import {mapActions, mapGetters} from "vuex";
    window.shareAll = shareAll;
    export default {
        components: {
            Loading,
        },
        data(){
            return {

            }
        },
        beforeMount(){
        },
        computed:{
            ...mapGetters(['isLoading'])
        },
        methods: {
            ...mapActions(["changeLoading"]),
        },
        watch:{

        }
    };
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "scss/pages/organization/orgInfo.scss";
</style>


