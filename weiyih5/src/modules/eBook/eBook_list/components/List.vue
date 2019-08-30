<template>
   <section data-alcode-mod="738">
        <section class="al-ebookList">
            <vue-data-loading :loading="ajaxing" :completed="noData" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll" :distance="0">
            <ul>
                <li v-for="(v,i) in item" :key="i">
                    <a :href="'/dist/eBook/eBook_details.html?bId='+v.resourceId">
                        <figure class="ebookImg"><img :src="v.picUrl? v.picUrl:picDefault"></figure>
                        <aside class="ebookDetail">
                            <p class="ebookName">{{v.title}}</p>
                            <p class="ebookIntroduction">{{v.briefIntro}}</p>
                            <div class="ebookTag">
                                <!--<i>{{v.type}}</i>-->
                                <p><span>{{v.browseNum}}</span>浏览</p>
                                <p><span>{{v.reviewNum}}</span>评论</p>
                            </div>
                        </aside>
                    </a>
                </li>
            </ul>
            </vue-data-loading>
        </section>
        <!--<section class="lastTime" v-show="noData">没有更多了</section>-->
        <Loading v-show="ajaxing"></Loading>
   </section>
</template>

<script>
    import axios from "axios"
    import Loading from "components/Loading/Loading"
    import comm from "static/js/comm"
    import VueDataLoading from 'components/scroll/vue-data-loading.vue'
    const path = "/mcall/cms/doc/getEBookList/";
    export default {
        data(){
            return {
                item:[],
                ajaxing:false,
                noData:false,
                index:1,
                picDefault:'//img50.allinmd.cn/v3/icon/book_img_default.png'
            }
        },
        methods:{
            eBookList(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url:path,
                    method:"POST",
                    data:{
                        scene:2,
                        visitSiteId:2,
                        pageIndex:this.index,
                        pageSize:10
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    header:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        if(t.index==1){
                            this.item = res.data.responseObject.responseData.data_list;
                        }else{
                            this.item = this.item.concat(res.data.responseObject.responseData.data_list);
                        }
                        if(res.data.responseObject.responseData.data_list.length<10){
                            this.noData = true;
                        }
                    }else{
                        this.noData = true;
                    }
                })
            },
//            //瀑布流方法
            "infiniteScroll"() {
                let t = this;
                t.ajaxing = true;
                t.index++;
                setTimeout(() => {
                    t.eBookList();
                }, 1000);
            },
        },
        mounted(){
            this.eBookList();
        },
        components:{
            Loading,
            VueDataLoading
        },
//        filters:{
//            toWKH:comm.toWKH,
//            types:(v)=>{
//                let str = '';
//                switch(parseInt(v)){
//                    case 1:
//                        str = '书籍'; break;
//                    case 2:
//                        str = '杂志'; break;
//                    case 3:
//                        str = '期刊'; break;
//                }
//                return str;
//            }
//        }
    }
</script>
<style>
    .vue-data-loading .loading-header, .vue-data-loading .loading-footer {
        margin: 0.5rem 0;
    }
    .al-ebookList {
        border-top: solid 1px #E4E9ED;
    }
</style>