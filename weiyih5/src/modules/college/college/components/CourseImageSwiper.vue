<template>
    <section class="al-elite-imageBanner">
        <section class="al-elite-imgContainer swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in config" :key="index"  :style="{background: 'url('+item.bannerUrl+') no-repeat center center',backgroundSize:'cover'}" @click.stop="openBanner(item)" :slideConfig="JSON.stringify(item)"  @mousedown.stop="trackAction({
            browseName:'广告位',
            actionName:'广告位',
            keyWord:'广告位',
            actionId:'11660',
            index:index+1,
            refId:item.resourceId
        })"></div>
            </div>
        </section>
        <section class="al-elite-pager" :style="[{'width':createPagerWidth}]"></section>
    </section>
</template>
<script>
    // import EliteSdk from '../untils/eliteCommSdk';
    import comm from 'static/js/comm.js';
    import Swiper from 'swiper';
    export default {
        name:'elite-imageBanner',
        mounted(){
            let _this = this;

        },
        props:{
            config:{
                default:[]
            }
        },
        watch:{
            config:{
                handler(n){
                    let _this = this;
                    setTimeout(()=>{
                        _this.initSwiper();
                    },1000);

                },
                deep:true
            }
        },
        computed:{
            createPagerWidth(){
                let _this = this;
                /*6张图81     5张图6        4张图55       3张图48      2张图35*/
                let widthNum = 70;
                switch (parseInt(_this.config.length)) {
                    case 2:
                        widthNum = 70;
                        break;
                    case 3:
                        widthNum = 96;
                        break;
                    case 4:
                        widthNum = 110;
                        break;
                    case 5:
                        widthNum = 136;
                        break;
                    case 6:
                        widthNum = 162;
                        break;
                }
                return widthNum/75+'rem';
            }
        },
        methods:{
            jumpUrl(){
              let _this = this;

            },
            initSwiper(){
                let _this = this;
                new Swiper ('.swiper-container', {
                    loop: true,
                    autoplay: 5000,
                    // 如果需要分页器
                    pagination: '.al-elite-pager',
                });
                setTimeout(()=>{
                    $(".swiper-pagination-bullet").each(function(){
                        let isThisElement = $(this);
                        isThisElement.width(isThisElement.height());
                        isThisElement.css({"borderRadius":'50%'});
                    });
                },300);
            },
            openBanner(e){
                console.log(e);
                comm.banner.openBanner(e);
            },
            trackAction(config){
                console.log(JSON.stringify(config));
                // EliteSdk.trackAction(config);
            }
        }
    }
</script>