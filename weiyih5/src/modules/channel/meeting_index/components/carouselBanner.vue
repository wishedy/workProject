<template>
    <swiper :options="swiperOption" ref="mySwiper" class="al-carouselBanner">
        <!-- slides -->
        <swiper-slide v-for="(val,key) in bannerImg" :key="key" class="al-carouselBannerItem" >
            <a :href="!val.adUrl?'javascript:;':val.adUrl" :adId="val.adId" :index="key" @click="bannerCreateLog">
                <img :src="val.adImgUrl" :alt="val.adAttName">
            </a>
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
</template>

<script>
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import "static/css/swiper.min.css"
    import comm from "static/js/comm.js"
    export default {
        props:['bannerImg'],
        components:{
            swiper,
            swiperSlide
        },
        data () {
            return {
                swiperOption: {//以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
                    notNextTick: true,
                    autoplay: 3000,
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    observeParents:true,
                    onSlideChangeEnd: function(swiper){
                        swiper.startAutoplay();
                    }
                }
            }
        },
        methods:{
            //轮播图的事件埋点
            bannerCreateLog(e){
                let t=this,
                    param=e.currentTarget.getAttribute("href")+"$"+e.currentTarget.getAttribute("adId");
                comm.creatEvent({
                    triggerType: '广告位',
                    keyword: "广告位-轮播图(会议)-" + e.target.getAttribute('alt'),
                    actionId: 14,
                    param:param,
                    locationId: parseInt(e.currentTarget.getAttribute('index'),10)+1,
                    refId: e.currentTarget.getAttribute("href")
                });
            },
        },
        mounted(){

        }
    }
</script>

