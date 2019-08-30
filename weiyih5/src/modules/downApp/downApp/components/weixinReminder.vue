<template>
    <section class="al-weixin" v-if="isWeiXin">
        <h1 class="title">链接打不开？</h1>
        <p class="des">
            请点击右上角<span class="dot">
            <em></em>
            <em></em>
            <em></em>
            <i></i>
        </span>
        </p>
        <p class="explorerDes" v-if="!isIOS">
            选择<span class="explorer">“在浏览器中打开”</span>
        </p>
        <p class="explorerDes" v-if="isIOS">
            选择<span class="explorer">“在Safari中打开”</span>
        </p>
        <section class="logo"></section>
    </section>
</template>
<script>
    import {mapGetters} from 'vuex';
    export default {
        computed:{
            ...mapGetters(['isWeiXin',"isIOS"])
        },
        mounted(){
            let _this = this;
            if(!_this.isWeiXin){
                _this.$router.push({path:'/downAppHome'});
            }
        }
    }
</script>
