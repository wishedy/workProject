<template>
    <section class="al-ad-delivery-small" style="display: block;" v-if="isSmall&&isShow">
        <a class="al-ad-delivery-small-banner" :href="attachment.linkUrl" target="_blank" :style="bgImg(attachment.adAttUrl)" @click="createEvent" :adId="attachment.adId"></a>
        <section class="al-ad-delivery-small-close" @click="closeAd" :adId="attachment.adId"></section>
    </section>
</template>

<script>
    import comm from 'static/js/comm';
    export default {
        name: "small-screen",
        props:['attachment','isSmall'],
        data(){
            return {
                isShow:true
            }
        },
        methods:{
            bgImg(src){
                if(src){
                    return {
                        'background':'url("'+src+'") no-repeat center 50%',
                        'backgroundSize':'cover'
                    }
                }
            },
            closeAd(e){
                this.isShow=false;
                localStorage.setItem("indexAdDelivery",true);
                let param = this.attachment.linkUrl+"$"+this.attachment.adId;
                comm.creatEvent({
                    async:false,
                    triggerType:"广告",
                    keyword:'弹窗广告-小屏关闭',
                    param:param,
                    locationId:e.target.getAttribute('adId'),
                    actionId:11048
                });
            },
            createEvent(){
                let param = this.attachment.linkUrl+"$"+this.attachment.adId;
                localStorage.setItem("indexAdDelivery",true);
                comm.creatEvent({
                    async:false,
                    triggerType:"广告",
                    keyword:'弹窗广告-小屏图文点击',
                    param:param,
                    locationId:e.target.getAttribute('adId'),
                    actionId:11047
                });
            }
        }
    }
</script>

<style scoped>

</style>