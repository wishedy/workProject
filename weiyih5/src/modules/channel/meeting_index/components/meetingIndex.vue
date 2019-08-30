<template>
    <section>
        <section class="fixedHeader">
            <!-- 顶部信息栏开始 -->
            <HearderBar></HearderBar>
            <!--搜索框-->
            <SearchText></SearchText>
            <!--搜索框 end-->
            <!--导航开始-->
            <NavBarText :isActive="3" :isLiveState="isLiveState"></NavBarText>
            <!--导航结束-->
            <!-- 顶部信息栏结束 -->
        </section>

        <!--页面主列表功能-->
        <section class="meetingIndexCont">
            <!--轮播图会议预告、关注的会议开始-->
            <section class="screenTop ev-screenTop">
                <BannerText :bannerImg="bannerImg" v-show="!scrPopShow"></BannerText>
                <section class="nav ev-navTabClick" v-show="!scrPopShow" data-alcode-mod='673'>
                    <ul>
                        <li><a href="/dist/channel/meeting_follow.html">我关注的会议</a></li>
                        <li><a href="/dist/channel/meeting_trailer.html">会议预告</a></li>
                    </ul>
                </section>
            </section>
            <!--轮播图会议预告、关注的会议结束-->
            <!--主列表、筛选开始-->
            <ScreenCont></ScreenCont>
            <!--主列表、筛选结束-->

        </section>
        <!--页面主列表功能结束-->

        <!-- 页脚功能栏 -->
        <FooterText :attachment="screenData" :isSmall="isSmall" :isActive="0"></FooterText>
        <first-screen-ad v-on:option="listenToMyBoy"></first-screen-ad>
    </section>
</template>
<script>
    import TempCache from "static/js/tempcache.js"
    import comm from "static/js/comm.js"
    import NavBarText from "components/NavBar/NavBar.vue"
    import SearchText from "components/Search/Search.vue"
    import HearderBar from "components/CommIndex/HearderBar.vue"
    import FirstScreenAd from "components/CommIndex/FirstScreenAd.vue"
    import FooterText from "components/Footer/Footer.vue"
    import BannerText from "./carouselBanner.vue"
    import ScreenCont from "./screening.vue"
    import {mapActions, mapGetters} from "vuex"

    const xhlUrl = {
        bannerUrl: '/mcall/conference/index/getBannerList/',//banner广告位
    };
    export default {
        components: {
            BannerText,
            NavBarText,
            SearchText,
            HearderBar,
            ScreenCont,
            FirstScreenAd,
            FooterText,
        },
        computed: {
            ...mapGetters(['scrPopShow','isLiveState']),
        },
        data() {
            return {
                bannerImg: [],//banner图数组
                bannerHide: false,//没有图的时候banner隐藏，默认不隐藏，
                jsonData: {},//缓存数据先于接口请求展示（banner，筛选，主列表）
                screenData: "",
                isSmall: false,
            }
        },
        methods: {
            ...mapActions(['screeningPopChange']),
            //首屏动画操作数据
            listenToMyBoy(somedata) {
                this.screenData = somedata.screenData;
                this.isSmall = somedata.isSmall;
            },
            //banner图接口请求
            getBanner() {
                let t = this;
                //页面展示首先寻找缓存，解决接口请求出现的白屏时间
                if (TempCache.getItem('meetFirstScreenData')) {
                    let _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData')),
                        data = _tempData.bannerData;
                    if (data) {
                        t.bannerImg = [];
                        let items = data.responseObject.responseData.data_list;
                        for (let i = 0; i < items.length; i++) {
                            let _kv = items[i];
                            let json = {
                                adUrl: _kv.linkUrl,
                                adImgUrl: _kv.adAttUrl,
                                adAttName: _kv.adAttName,
                                adId: _kv.id
                            };
                            t.bannerImg.push(json);
                        }
                    } else {
                        t.bannerHide = true;
                    }
                }
                //接口请求banner图
                comm.ajax2({
                    url: xhlUrl.bannerUrl,
                    type: 'POST',
                    data: {
                        paramJson: JSON.stringify({
                            visitSiteId: 2,
                            platformId: TempCache.getItem('department') || 1,
                            customerId: TempCache.getItem('userId') || ''
                        })
                    },
                    success: function (res) {
                        let data = res;
                        if (data && data.responseObject.responseStatus) {
                            let items = data.responseObject.responseData.data_list;
                            if (TempCache.getItem('meetFirstScreenData')) {
                                t.jsonData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                            }
                            t.jsonData.bannerData = data;
                            TempCache.setItem('meetFirstScreenData', JSON.stringify(t.jsonData));
                            t.bannerImg = [];
                            for (let i = 0; i < items.length; i++) {
                                let _kv = items[i];
                                let json = {
                                    adUrl: _kv.linkUrl,
                                    adImgUrl: _kv.adAttUrl,
                                    adAttName: _kv.adAttName,
                                    adId: _kv.id
                                };
                                t.bannerImg.push(json);
                            }
                        } else {
                            t.bannerHide = true;
                        }
                    }
                });
            },
        },
        mounted() {
            let t = this;
            t.getBanner();//banner图请求
        }
    }
</script>