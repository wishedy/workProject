<template>
    <nav class="al-indexNavbar">
        <ul data-alcode-mod='380'>
            <li class="al-indexNavbarItem" :class="active(0)">
                <a href="/">
                    <span>热门</span>
                </a>
            </li>
            <li class="al-indexNavbarItem" :class="active(1)">
                <a href="/dist/channel/case_index.html">
                    <span>病例</span>
                </a>
            </li>
            <li class="al-indexNavbarItem" :class="active(2)">
                <a href="/dist/channel/video_index.html">
                    <span>视频</span>
                </a>
            </li>

            <li class="al-indexNavbarItem" :class="active(3)">
                <a href="/dist/channel/meeting_index.html">
                    <span>会议<i v-if="isLive"></i></span>
                </a>
            </li>
            <li class="al-indexNavbarItem" :class="active(4)">
                <a href="/dist/channel/doc_index.html">
                    <span>文库</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    export default {
        name: "nav-bar",
        props:['isActive','isLiveState'],
        data(){
            return {
                isLive:false
            }
        },
        watch: {
            isLiveState: {
                handler(newValue, oldValue) {
                    if(newValue!=oldValue){
                        this.isLive=newValue;
                    }
                },
                deep: true
            }
        },
        methods:{
            active(index){
                if(this.isActive==index){
                    return 'active';
                }
            },
            liveState(){
                let t=this;
                comm.ajax2({
                    url: "/mcall/conference/index/getMapListV4/",
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                            platformId: TempCache.getItem('department') || 1,
                            pageIndex:1,
                            pageSize:0
                        })
                    },
                    timeout: 30000,
                    success:function(rep){
                        if (rep && rep.responseObject && rep.responseObject.responseData) {
                            var res = rep.responseObject.responseData;
                            if (res.liveState == 1) {//有直播的会议
                                t.isLive=true;
                            } else {
                                t.isLive=false;
                            }
                        } else {//默认没有列表的时候
                            t.isLive=false;
                        }
                    }
                })
            }
        },
        mounted(){
            if(this.isActive!=3){
                this.liveState();
            }else {
                this.isLive=this.isLiveState;
            }
        }
    }
</script>

<style scoped>

</style>