<template>
    <section class="billboard">
        <section class="billboardListDetail" v-show="itemLength!=0" data-alcode-mod="627">
            <section class="title">{{reveal}}</section>
            <section class="al-content ev_recBox" scrollpagination="enabled" >
                <section class="al-contentPartModule ev_flow " itemtype="1" rel="loaded" v-for="(val,index) in item">
                    <div class="al_flow_type">  <span class="al_flow_span" :class="icon(val.itemType,val.videoType)">{{val.itemType,val.videoType | resourceType}}</span>
                        <ul class="al-littleScoreStarBox" v-html="starDom(val.currentScoreNum,val.currentStarLevel)">

                        </ul>
                    </div>
                    <section class="al-tableBox" v-if="val.itemType!=2">
                        <article class="al-contentText">
                            <a :href="val.itemUrl" class="al-contentTitle">{{val.itemTitle}}</a>
                            <p class="al-contentOtherMsg">
                                <span :class="iconType(val.resourceSign)">{{val.resourceSign | categoryType}}</span>
                                <span class="al-contentAuthor icon-contentAuthor">{{val.ownerName}}</span>
                                <span class="icon-contentWatchedNum">{{val.browseNum | toWKH}}</span>
                                <!--<span class="al-contentDel  ete" itemtype="1" itemid="1492581177268">x</span>-->
                            </p>
                        </article>
                        <figure class="al-contentImgBox">
                            <a :href="val.itemUrl">
                                <img :src="val.picUrl" alt="">
                                <i class="al-videoPlayBtn"  v-if="val.itemType==1">
                                    <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                                </i>
                                <span class="al-videoTime"  v-if="val.itemType==1">{{val.playTime}}</span>
                            </a>
                        </figure>
                    </section>


                    <article class="al-contentText" v-if="val.itemType==2">
                        <a :href="val.itemUrl" class="al-contentTitle">{{val.itemTitle}}</a>
                        <article class="al-contentMainText">
                            <a href="javascript:void(0)">{{val.itemAbstract}}</a>
                        </article>
                        <p class="al-contentOtherMsg">
                            <span class="al-contentAuthor bookNameIcon">{{val.ownerName}}</span>
                            <span class="icon-contentWatchedNum">{{val.browseNum | toWKH}}</span>
                        </p>
                    </article>
                </section>
            </section>
            <section class="listNoMore">~  没有更多了  ~</section>
        </section>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import TempCache from "static/js/tempcache";
    const xhrUrl = {
        "list":"/mcall/customer/resource/toplist/getResTopList/"
    };
    export default {
        data(){
            return {
                item:[],
                itemLength:0,
                reveal:'',
                listType:1
            }
        },
        methods:{
            getData(){
                let  t = this;
                axios({
                    url:xhrUrl.list,
                    method:"POST",
                    data:{
                        platformId:TempCache.getItem('department')||1,
                        toplistType: t.$route.name,
                        customerId:TempCache.getItem('userId')||"",
                        logoUseFlag:1
                    },
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    if(comm.hasResponseData(res.data)){
                        t.item = res.data.responseObject.responseData.data_list;
                        if(t.item.length){
                            t.itemLength = 1;
                        }else{
                            t.itemLength = 0;
                        }
                    }

                    switch(parseInt(t.$route.name)){
                        case 1:
                            t.reveal = `他们贡献了`;break;
                        case 2:
                            t.reveal = `他们评论了`;break;
                        case 3:
                            t.reveal = ``;break;
                    }
                })
            },
            icon(itemType,videoType){
                let type = '';
                switch(parseInt(itemType)){
                    case 1:
                        type = "al_flow_video";
                        switch(parseInt(videoType)){
                            case 1:
                                type = "al_flow_video surgey";break;
                        }break;
                    case 2:
                        type = "al_flow_doc";break;
                    case 4:
                        type =  "al_flow_topic";break;
                    default:
                        type =  "al_flow_case";break;
                }
                return type;
            },
            iconType(v){
                let type = "";
                switch(parseInt(v)){
                    case 1:
                        type = "al-contentNewest";break;
                    case 2:
                        type = "al-contentHotest";break;
                    case 3:
                        type = "al-contentJoin";break;
                    case 4:
                        type = "al-contentAward";break;
                    case 31:
                    case 32:
                    case 127:
                        type = "al-contentPdf";break;
                }
                return type;

            },
            starDom(ScoreNum,score){
                if(parseInt(ScoreNum)>=10){
                    let str="";
                    let num = parseInt(score);
                    let flot =(score-num)*100+"%";
                    switch(num){
                        case 0:
                            str = '<li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li><li></li>';break;
                        case 1:
                            str = '<li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li><li></li>';break;
                        case 2:
                            str = '<li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li><li></li>';break;
                        case 3:
                            str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li><li></li>';break;
                        case 4:
                            str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:'+flot+'"></b></li>';break;
                        case 5:
                            str = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li>';break;
                    }
                    return str;
                }
            }
        },
        mounted(){
            let listType = this.$route.name;
            if(listType == 1 || listType == 2){  //贡献和活跃榜单执行列表
                this.getData();
            }
        },
        watch: {
            $route() {
                let t = this;
                t.item = [];
                t.itemLength = 0;
                let listType = this.$route.name;
                if(listType == 1 || listType == 2){  //贡献和活跃榜单执行列表
                    t.getData();
                }
            }
        },
        filters:{
            resourceType:(v1,v2)=>{
                let str = "";
                switch(parseInt(v1,10)){
                    case 1:
                        str="视频";
                        switch(parseInt(v2)){
                            case 1:
                                str = "手术视频";
                                break;
                        }
                        break;
                    case 2:
                        str="文库";
                        break;
                    case 4:
                        str="话题";
                        break;
                    default:
                        str="病例";
                        break;
                }
                return str;
            },
            categoryType:v=>{
                let str = "";
                switch(parseInt(v)){
                    case 1:
                        str = "最新";break;
                    case 2:
                        str = "最热";break;
                    case 3:
                        str = "参赛";break;
                    case 4:
                        str = "获奖";break;
                    case 31:
                    case 32:
                    case 127:
                        str = "PDF";break;
                }
                return str;
            },
            toWKH:value=>comm.toWKH(value)
        }
    }
</script>

<style>

</style>