<template>
    <swiper :options="swiperOptionEnty" ref="mySwiper" class="al-downSwiper" v-if="downList&&downList.length>0">
        <!-- slides -->
        <swiper-slide v-for="(v,i) in downList"  :key="i" class="downSlide" >
            <a @click="jumpEntry(v.navigationName,v.navigationSort,v.navigationPath)">
                <img :src="v.navigationLogo" alt="">
            </a>
        </swiper-slide>
    </swiper>
</template>
<script type="text/ecmascript-6">
    import { swiper, swiperSlide } from 'vue-awesome-swiper'
    import "static/css/swiper.min.css"
    import TempCache from "static/js/tempcache.js";
    export default {
        props:['downList'],
        data () {
            return {
                swiperOptionEnty: {//以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
                    // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>　　　　　　　　假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                    notNextTick: true,
                    // swiper configs 所有的配置同swiper官方api配置
                    // autoplay: 3000,
                    // loop:true,
                    // direction : 'horizontal',
                    // grabCursor : true,
                    // pagination : '.swiper-pagination',
                    // paginationClickable :true,
                    slidesPerView: "auto",
                    freeMode:true

                },
            }
        },
        components:{
            swiper,
            swiperSlide
        },
        mounted(){
            if(TempCache.getItem('swiperEntry')){
                this.downList = JSON.parse(TempCache.getItem('swiperEntry'));
            }
            TempCache.setItem('swiperEntry',JSON.stringify(this.downList));
        },
        methods:{
            jumpEntry(name,sortId,href){
                comm.creatEvent({
                    triggerType:'功能',
                    triggerName:'动态入口',
                    keyword:name,
                    location_id:sortId,
                    actionId:63
                });
                if(href){
                    g_sps.jump(null,href);
                }
            }
        }

    }
</script>