<template>
    <section class="discoverV2">
        <section class="columnList">
            <aside class="columnListCont" data-alcode-mod="726">
                <!---->
                <section class="pickUpCont" style="display:none;" v-show="isUnfold">
                    <aside class="pickUp">
                        <ul>
                            <li v-for="(v,i) in entry" :key="i" v-if="i!=5" :data-flag="i+1" @click="enter(v.alt,i+1)"><a :href="v.linkUrl"><img :src="v.srcUrl" :alt="v.alt"></a></li>
                        </ul>
                        <p @click="up">
                            <i></i><span>收起</span>
                        </p>
                    </aside>
                </section>
                <!--展开 end-->
                <section class="swiper-container">
                    <ul class="pickDown swiper-wrapper">
                        <li v-for="(v,i) in entry" :key="i" :data-flag="i+1" class="swiper-slide"  @click="enter(v.alt,i+1)"><a :href="v.linkUrl"><img :src="v.srcUrl" :alt="v.alt"></a></li>
                    </ul>
                    <aside class="listMore" @click="down"><span>展开</span><p v-show="isShow" @click.stop><img src="//img50.allinmd.cn/v3/discover/prompt04.png"></p></aside>
                </section>
            </aside>
        </section>
    </section>
</template>
<script>
    import comm from "static/js/comm.js"
    import TempCache from "static/js/tempcache"
    export default {
        data(){
            return {
                entry:[
                    {
                        "linkUrl":"./discover_featureColumn.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance7.png",
                        "alt":"特色栏目",
                    },
                    {
                        "linkUrl":"./discover_series.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance1.png",
                        "alt":"系列课",
                    },
                    {
                        "linkUrl":"./discover_hotActivity.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance8.png",
                        "alt":"热门活动",
                    },
//                    {
//                        "linkUrl":"",
//                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance2.png",
//                        "alt":"",
//                    },
                    {
                        "linkUrl":"./discover_subject.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance4.png",
                        "alt":"推荐专题",
                    },
                    {
                        "linkUrl":"./discover_tag.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance3.png",
                        "alt":"全部标签",
                    },
                    {
                        "linkUrl":"/dist/personal/friends_circle.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance6.png",
                        "alt":"朋友圈",
                    },
                    {
                        "linkUrl":"./discover_billboard.html",
                        "srcUrl":"//img50.allinmd.cn/v3/discover/entrance5.png",
                        "alt":"明星榜单",
                    }
                    ],  //入口配置数据
                isUnfold:false,
                isShow:false,
                platformId:TempCache.getItem('department')==2?true:false,
            }
        },
        methods:{
            down(){  //展开
                this.isUnfold = true;
                $('html body').animate({ scrollTop: 0 },0);
                comm.creatEvent({
                    triggerType:'展开',
                    actionId:11024
                });
                TempCache.setItem('clickTag','true');
                //控制图层固定
                $("body,html").css({
                    overflow:"hidden",
                    height:"100%"
                });
                $("html,body").on("touchmove", function (e) {
                    e.preventDefault();
                });
            },
            up(){   //收起
                this.isUnfold = false;
                this.isShow = false;
                //控制图层取消
                $("body,html").css({
                    overflow:"",
                    height:""
                });
                $("html,body").unbind("touchmove");
            },
            swiper(){   //左右滚动
                let swiper = new Swiper('.swiper-container', {
                    slidesPerView: "auto",
                    paginationClickable: true,
                    freeMode: true,
                    observer: true
                });
            },
            enter(keyword,location_id){     //顶部入口
                comm.creatEvent({
                    triggerType:'发现页顶部入口',
                    keyword,
                    location_id,
                    actionId:11036
                });
            }
        },
        mounted(){
            if(TempCache.getItem('firstTag') == 'true'){
                this.isShow = true;
            }
            if(TempCache.getItem('clickTag') == 'true'){
                this.isShow = false;
            }
            this.swiper();
        }
    }
</script>