<template>
    <section class="al-mainInner">
        <HeaderBar></HeaderBar>
        <router-view :class="{'al-personalContent':footerType,'al-msgListPart':!footerType,'Ev-mesListEditStatus':!footerType}"></router-view>
        <CommFooterBar :isActive="2" v-if="footerType"  @specialCount="listenToMyBoy" ></CommFooterBar>
        <SelectFooterBar></SelectFooterBar>
    </section>
</template>

<script type="text/ecmascript-6">
    import HeaderBar from "./components/HeaderBar.vue";
    import ContainerBar from "./components/IndexBar.vue";
    import CommFooterBar from "components/Footer/Footer.vue";
    import SelectFooterBar from "./components/FooterBar.vue";
    import {mapActions,mapGetters} from "vuex";
    import user from "static/js/module.user";

    export default {
        computed:{
            ...mapGetters(['pageType']),
            footerType(){
                return (this.$route.path).substring(1,100)==='messageIndex'
            }
        },
        methods:{
            listenToMyBoy (somedata){
                this.accept(somedata);
            },
            ...mapActions(['accept'])
        },
        components:{
            HeaderBar,
            CommFooterBar,
            SelectFooterBar,
            ContainerBar
        },
		beforeMount(){
			user.privExecute({
				callback: function() {},
				operateType: "login"
			})
		}
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "scss/base";
    @import "scss/pages/message/message_index";
    @import "scss/pages/message/message_follow";
    @import "scss/pages/message/message_comment";
    @import "scss/pages/message/message_remind";
    @import "scss/pages/message/message_like";
</style>



