<template>
    <section class="al-ad-delivery" style="display: block;" v-if="isAd">
        <section class="al-ad-delivery-details">
            <section class="al-ad-delivery-close" @click="showSmallAd"></section>
            <a class="al-ad-delivery-banner" :href="attachment.linkUrl" target="_blank" :style="bgImg(attachment.adAttUrl)" @click="creatEvent"></a>
        </section>
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    const FirstAd = '/mcall/ad/position/profile/getMapList/';
    export default {
        name: "first-screen-ad",
        data(){
            return {
                attachment:'',
                isAd:false
            }
        },
        methods:{
            bannerLoad(isBig){
                let t=this;
                t.$store.state.loading=true;
                comm.ajax2({
                    url: FirstAd,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            firstResult: 0,
                            maxResult: 10,
                            visitSiteId: 2, //pc 1  h52
                            channelId: 83, //channelId:''//107-病例 105-视频 106-文库 114-话题  83-首页
                            isIndex: 1, //是否是首页,首页传1，频道页不传值,
                            platformId:TempCache.getItem('department')||1,
                            customerId:TempCache.getItem('userId')||'',
                            positionId:580
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.$store.state.loading=false;
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            let state = TempCache.getItem("auth")?JSON.parse(TempCache.getItem("auth")).state:0,
                                arr = res.responseObject.responseData.data_list[0];
                            if (arr.ad_profile_attachment && arr.ad_profile_attachment.length){
                                t.attachment=arr.ad_profile_attachment[0];
                                t.$store.state.screenData=arr.ad_profile_attachment[0];
                                if(isBig){
                                    t.isAd=true;
                                }else {
                                    t.isAd=false;
                                    t.$store.state.isSmall=true;
                                    document.body.style.overflow='auto';
                                }
                            }else {
                                document.body.style.overflow='auto';
                                t.isAd=false;
                            }
                        }else {
                            document.body.style.overflow='auto';
                            t.isAd=false;
                        }
                    }
                })
            },
            bgImg(src){
                if(src){
                    return {
                        'background':'url("'+src+'") no-repeat center 50%',
                        'backgroundSize':'cover'
                    }
                }
            },
            showSmallAd(){
                localStorage.setItem("indexBigAdDelivery",true);
                this.isAd=false;
                this.$store.state.isSmall=true;
                document.body.style.overflow='auto';
            },
            creatEvent(){
                localStorage.setItem("indexBigAdDelivery",true);
                let t=this;
               setTimeout(function () {
                   t.isAd=false;
               },1000);
                let adId=this.attachment.adId,
                    param = this.attachment.linkUrl+"$"+adId;
                comm.creatEvent({
                    async:false,
                    triggerType:"广告",
                    keyword:'弹窗广告-图文',
                    param:param,
                    locationId:adId,
                    actionId:11045
                });
            }
        },
        mounted (){
            if(!localStorage.getItem("indexBigAdDelivery")){
                this.bannerLoad(true);
                document.body.style.overflow='hidden';
            }else if(!localStorage.getItem("indexAdDelivery")){
                this.bannerLoad();
            }
        }
    }
</script>

<style scoped>

</style>