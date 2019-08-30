<template>
    <div id="app">
        <section class="al-mainInner">
            <!-- 顶部信息栏 -->
            <section class="fixedHeader">

                <hearder-bar></hearder-bar>
                <!--搜索框 end-->
                <Search></Search>
                <!-- 主导航栏 -->
                <nav-bar :isActive="4"></nav-bar>
            </section>
            <swiper-banner :channelId="106"  :keyword="'文库'" :is-index="1"></swiper-banner>
            <Entry-bar :navigationType="6"></Entry-bar>
            <List :GetRecomResUrl="'/mcall/customer/recommendResourceItem/json_doc/'" :is-index="4"></List>
            <Footer :attachment="$store.state.screenData" :isSmall="$store.state.isSmall" :isActive="0"></Footer>
        </section>
        <display-action v-if='$store.state.contentDelete'></display-action>
        <first-screen-ad  v-on:option="listenToMyBoy"></first-screen-ad>
        <loading v-show="$store.state.loading"></loading>
    </div>
</template>

<script type="text/ecmascript-6">

    import HearderBar from "components/CommIndex/HearderBar.vue"
    import Search from "components/Search/Search.vue"
    import NavBar from "components/NavBar/NavBar.vue"
    import SwiperBanner from "components/SwiperBanner/SwiperBanner.vue"
    import EntryBar from "components/CommIndex/EntryBar.vue"
    import List from "components/CommIndex/List.vue"
    import Footer from "components/Footer/Footer.vue"
    import DisplayAction from "components/CommIndex/DisplayAction.vue"
    import FirstScreenAd from "components/CommIndex/FirstScreenAd.vue"
    import loading from "components/Loading/Loading.vue"
    export default {
        name: 'app',
        components:{
            HearderBar,
            Search,
            NavBar,
            SwiperBanner,
            EntryBar,
            List,
            Footer,
            DisplayAction,
            FirstScreenAd,
            loading
        },
        methods:{
            listenToMyBoy (somedata){
                this.$store.state.screenData=somedata.screenData;
                this.$store.state.isSmall=somedata.isSmall;
            },
        }
    }
</script>

<style>

</style>
