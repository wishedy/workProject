<template>
    <section class="al-alive-video" :class="{'ready':liveStatus===-1,'start':liveStatus===1,'end':liveStatus===0}" :id="parseInt(liveType,10)===0?'livePlayer':'playbackPlayer'">

    </section>
</template>
<script>
    import AlLiveSdk from  '../untils/alLiveSdk';
    import {mapGetters,mapActions} from 'vuex';
    export default {
        data(){
            return {
                mag:''
            }
        },
        computed:{
            ...mapGetters(['liveType','liveStatus'])
        },
        methods:{
            ...mapActions(['changeLiveStatus'])
        },
        mounted(){
            let _this = this;
            AlLiveSdk.onLineHandle({
                onKickOut(){
                    _this.changeLiveStatus(0);
                    alert("您被踢出直播间");
                },
                onLiveEnd(){
                    _this.changeLiveStatus(0);
                }
            });
        }
    }
</script>