<template>
    <section class="al-discoverSeminarInnerBox" data-alcode-mod='417'>
        <section class="al-discoverSeminarInner" v-for="(v,i) in list" :key="i">
            <h2 class="al-discoverActivitionTime">{{v.startTime,0 | cut}}<em>-</em>{{v.endTime,5 | cut}}</h2>
            <section class="al-discoverSeminar">
                <a :href="v.activityUrl">
                    <figure class="al-discoverSeminarImg"><img :src="v.activityPicUrl" alt="">
                        <i :class="status(v.state)"><img :src="types(v.state)" alt=""></i>
                    </figure>
                    <figcaption class="al-discoverSeminarContent">
                        <h2 class="EV-seminarContent" :class="v.state==4?'active':''">{{v.activityName}}</h2>
                        <span>查看全文<i class="icon-messageMore"></i></span>
                    </figcaption>
                </a>
            </section>
        </section>
        <section class="al-discoverNoActivition" v-if="noData" style="display:block">
            <img src="//img50.allinmd.cn/pages/discover/noActivity.png" alt="">
        </section>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    const path = {
        list:"/mcall/cms/activity/getMapList3/"
    }
    export default {
        data(){
            return{
                list:[],
                noData:false,
                heig:''
            }
        },
        mounted(){
            this.content();
        },
        methods:{
            content(){
                axios({
                    url:path.list,
                    method:"POST",
                    data:{
                        sortType: 1,
                        pageSize: 200,
                        pageIndex: 1
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data)
                    }],
                    header:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    if(comm.hasResponseData(res.data)){
                        this.list = res.data.responseObject.responseData.data_list;
                    }else{
                        this.noData = true;
                    }
                })
            },
            status(v){
                let str = String;
                switch(parseInt(v)){
                    case 1:
                        str = "al-semeinarMark"; break;
                    case 2:
                        str = "al-semeinarMark"; break;
                    case 3:
                        str = "al-semeinarLiving"; break;
                    case 4:
                        str = "al-semeinarLiving"; break;
                }
                return str;
            },
            types(v){
                let str = String;
                switch(parseInt(v)){
                    case 1:
                        str = "//img50.allinmd.cn/pages/discover/mark_hot.png"; break;
                    case 2:
                        str = "//img50.allinmd.cn/pages/discover/mark_new.png"; break;
                    case 3:
                        str = "//img50.allinmd.cn/pages/discover/mark_living_now.png"; break;
                    case 4:
                        str = "//img50.allinmd.cn/pages/discover/mark_endnew.png"; break;
                }
                return str;
            }
        },
        filters:{
            cut:(v1,v2)=>v1.replace(/-/g, "/").substring(v2, 10)
        }
    }
</script>

<style scoped>
    .active{
        color: #aaa;
    }
    .al-discoverSeminarContent h2{
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
    }
</style>