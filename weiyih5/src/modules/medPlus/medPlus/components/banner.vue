<template>
    <section class="al-medPlus-banner">
        <div class="swiper-container banner-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in productAttachmentList" :key="index">
                    <img :src="item.imageUrl" alt="">
                </div>
            </div>
            <div class="swiper-pagination banner-pagination"></div>
        </div>
    </section>
</template>
<script>
    export default {
        mounted(){
            let t = this;
            t.productAttachmentList.length>0?t.initSwiper():'';
            //console.log(this.productAttachmentList);
        },
        watch:{
            productAttachmentList(n){
                let t = this;
                setTimeout(()=>{
                    t.initSwiper();
                },300);
            }
        },
        methods:{
          initSwiper(){
              let mySwiper = new Swiper('.banner-container', {
                  autoplay:3000,
                  loop:false,
                  pagination: '.banner-pagination',

              });
          }
        },
        props:{
            productAttachmentList:{
                default:[],
                type:Array
            }
        }
    }
</script>