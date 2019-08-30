<template>
    <swiper :options="swiperOption" ref="mySwiper" class="al-carouselBanner" v-if="isSwiper">
        <!-- slides -->
        <swiper-slide v-for="(v,i) in swiperArr"  :key="i" class="al-carouselBannerItem" v-if="isBanner(v.linkUrl)">
            <a :href="v.linkUrl"  :adId="v.id" :target="_target(v.linkUrl)" @click="createEvent" :index="i">
            <img :src="/:/.test(v.adAttUrl)?v.adAttUrl:'https:'+v.adAttUrl" :alt="v.adAttName">
            </a>
        </swiper-slide>

        <!-- Optional controls -->
        <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
</template>
<script type="text/ecmascript-6">
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm'
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import "static/css/swiper.min.css"
    const SwiperUrl = '/mcall/ad/position/profile/getMapList/';
    export default {
        props:['channelId','isIndex','keyword'],
        data () {
            return {
                swiperOption: {//以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
                    // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　　　　　　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                    notNextTick: true,
                    // swiper configs 所有的配置同swiper官方api配置
                    autoplay: 3000,
                    // loop:true,
                    // direction : 'horizontal',
                    // grabCursor : true,
                    pagination : '.swiper-pagination',
                    paginationClickable :true,
                    // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
                    // debugger: true,
                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                    observeParents:false,//修改swiper的父元素时，自动初始化swiper
                    onSlideChangeEnd: function(swiper){
                        swiper.startAutoplay();
                    }
                },
                swiperArr:[],
                isSwiper:false
            }
        },
        components:{
            swiper,
            swiperSlide
        },
        methods:{
            banner(){
                let t = this;
                if(TempCache.getItem('bannerData')){
                    t.swiperArr = JSON.parse(TempCache.getItem('bannerData'));
                    t.isSwiper=true;
                }
                comm.ajax2({
                    url: SwiperUrl,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            firstResult: 0,
                            maxResult: 10,
                            visitSiteId: 2, //pc 1  h52
                            channelId: t.channelId, //channelId:''//107-病例 105-视频 106-文库 114-话题  83-首页
                            isIndex: t.isIndex, //是否是首页,首页传1，频道页不传值,
                            platformId:TempCache.getItem('department')||1,
                            customerId:TempCache.getItem('userId')
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list) {
                            t.swiperArr = res.responseObject.responseData.data_list["0"].ad_profile_attachment;
                            TempCache.setItem('bannerData',JSON.stringify(t.swiperArr));
                            t.isSwiper=true;
                        }else {
                            t.isSwiper=false;
                        }
                    }
                });
            },
            _target(linkUrl){
                if(linkUrl.lastIndexOf("m.medplus.net")>-1){
                    return '_href';
                }
            },
            isBanner(linkUrl){
                let  state = TempCache.getItem("auth")?JSON.parse(TempCache.getItem("auth")).state:0;
                if(!TempCache.getItem("userId")&&linkUrl.lastIndexOf("authInfo")>-1){//TODO:推广 V1用户去补全四证其他状态不显示此广告位

                }else{
                    if(state!=2&&linkUrl.lastIndexOf("authInfo")>-1){

                    }else{
                        return true;
                    }

                }
            },
            createEvent(e){
                let t=this,param=e.currentTarget.getAttribute("href")+"$"+e.currentTarget.getAttribute("adId");
                comm.creatEvent({
                    triggerType:'广告位',
                    keyword:"广告位-轮播图("+t.keyword+")-"+e.target.getAttribute('alt'),
                    actionId:14,
                    param:param,
                    locationId:parseInt(e.currentTarget.getAttribute('index'),10)+1,
                    refId:e.currentTarget.getAttribute("href")
                });
            }
        },
        mounted(){
            this.banner();
        }
    }
</script>