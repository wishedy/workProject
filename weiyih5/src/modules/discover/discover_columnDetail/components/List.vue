<template>
    <section class="boneClass">
        <aside class="boneScreen">
            <div class="boneScreenCont">
                <div class="al-terminalSortChangeItem" :class="{active:defaultSeen}" @click="defaults">默认</div>
                <div class="al-terminalSortChangeItem" :class="{active:newestSeen}" @click="newest">最新</div>
            </div>
        </aside>
        <ul class="boneClassList" data-alcode-mod="730">
            <li v-for="(v,i) in item" :key="i">
                <a :href="v.webStoragePath">
                    <p :style="v.resourceType==19?'width: 2.2rem':'' ">{{v.resourceType | types}}</p>
                </a>
                <div class="titleImg">
                    <a :href="v.webStoragePath">
                        <div class="titleImg">
                            <div class="detailText" :style="v.attrUrl!=''? '':'width:auto'">
                                <span :style="v.hasSceen!=1?'':'color:#909090'">{{v.resoureName}}</span>
                            </div>
                            <b v-if="v.isNew==1"></b>
                            <div class="detailImg" v-if="v.attrUrl">
                                <img :src="v.attrUrl">
                                <i class="al-videoPlayBtn">
                                    <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="" v-if="v.resourceType==1">
                                </i>
                                <span class="al-videoTime">{{v.playTime}}</span>
                            </div>
                        </div>
                        <div class="personalCont">
                            <div v-if="v.author!='' || v.hospital!=''">
                                <img :src="v.logoUrl" v-if="v.logoUrl!=''&&v.owerNameList.length<=1">
                                <span>{{v.resourceType,v.author,v.owerNameList | getOwnerName }}</span>
                                <span v-if="v.owerNameList.length<=1">{{v.hospital,20 | cut}}</span>
                            </div>
                            <div>
                                <span class="browse">{{v.browseNum}}</span>
                                <span class="time" v-if="v.bindingTime!=''">{{v.bindingTime | time}}</span>
                            </div>
                        </div>
                    </a>
                </div>
            </li>
        </ul>
        <section class="lastTime" v-show="noData">~  没有更多了  ~</section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import axios from  "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import commDate from "static/js/comm.date";
    import TempCache from "static/js/tempcache";
    const path = "/mcall/special/getSpecialCategoryResourceList/";
    const param = {
        customerId:TempCache.getItem('userId')||"",
        platformId:TempCache.getItem('department')||1,
        specialId:comm.getpara().columnId||""
    };
    export default {
        data(){
            return {
                ajaxing:false,
                item:[],
                index:1,
                sort:0,
                special:"",
                categoryLevel:1,
                noData:false,
                scrollFalg:'',
                defaultSeen:true,
                newestSeen:false,
            }
        },
        methods:{
            list(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url:path,
                    method:"POST",
                    data:{
                        customerId: param.customerId,
                        categoryId:t.special,
                        specialId: param.specialId,
                        visitSiteId: 2,
                        sortType: t.sort,
                        categoryLevel:t.categoryLevel,
                        pageIndex:t.index,
                        pageSize:10
                    },
                    transformRequest:[data=>{
                        return "paramJson=" +JSON.stringify(data)
                    }],
                    headers:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        this.index++;
                        if(this.scrollFalg ==1){
                            this.item = this.item.concat(dataList);
                        }else{
                            this.item = dataList;
                            this.scrollFalg = 1;
                        }
                        if(dataList.length<10){
                            this.noData = true;
                        }
                    }else{
                        this.noData = true;
                    }
                })
            },
            scroll(){
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData){
                            t.list();
                        }
                    }
                },false);
            },
            defaults(){
                this.newestSeen = false;
                this.defaultSeen = true;
                this.sort = 0;
                this.index = 1;
                this.item = [];
                this.list();
                comm.creatEvent({
                    triggerType:'筛选排序',
                    trigger_name:"默认",
                    keyword:"默认",
                    actionId:11040,
                    browsetype_url:param.specialId,
                    browsetype:218
                });
            },
            newest(){
                this.newestSeen = true;
                this.defaultSeen = false;
                this.sort = 1;
                this.index = 1;
                this.item = [];
                this.list();
                comm.creatEvent({
                    triggerType:'筛选排序',
                    trigger_name:"最新",
                    keyword:"最新",
                    actionId:57,
                    browsetype_url:param.specialId,
                    browsetype:218
                });
            }
        },
        mounted(){
            if(TempCache.getItem(param.specialId)){
                let _tempData = JSON.parse(TempCache.getItem(param.specialId));
                this.special = _tempData.id;
            }
            this.list();
            this.scroll();
        },
        filters:{
            types:v=>{
                let type = '';
                switch(parseInt(v)){
                    case 1:
                        type='视频';break;
                    case 2:
                        type='文库';break;
                    case 4:
                        type='话题';break;
                    case 7:
                        type='病例';break;
                    case 17:
                        type='电子书';break;
                    case 18:
                        type='文章';break;
                    case 19:
                        type='电子书视频';break;
                }
                return type;
            },
            cut:(v1,v2)=> comm.getStrLen(v1,v2),
            time:v=> commDate.thirdRule(v, commDate.local_time()),
            getOwnerName(resourceType,author,owerNameList){
                var ownerName="",authorName="";
                var ownerName = comm.getStrLen(author,10);
                if(resourceType==1&&owerNameList.length>=1){//视频多作者
                    for(let i=0;i<owerNameList.length;i++){
                        authorName += owerNameList[i].authorName+",";
                    }
                    ownerName = comm.getStrLen(authorName.substring(0,authorName.length-1),14);
                }
                return ownerName;
            }
        },
        components:{
            Loading
        },
        watch:{
            "$store.state.stairId"(){
                this.index = 1;
                this.categoryLevel = 1;
                this.special = this.$store.state.stairId;
                this.noData = false;
                this.scrollFalg = '';
                this.defaultSeen = true;
                this.newestSeen = false;
                this.sort = 0;
                this.item = [];
                this.list();
            },
            "$store.state.secondId"(){
                this.index = 1;
                this.categoryLevel = 2;
                this.special = this.$store.state.secondId;
                this.noData = false;
                this.scrollFalg = '';
                this.defaultSeen = true;
                this.newestSeen = false;
                this.sort = 0;
                this.item = [];
                this.list();
            }
        }
    }
</script>

<style scoped>
    .boneClassList .personalCont div:last-child .browse:before {
        content: "";
        display: inline-block;
        width: 0.37333rem;
        height: 0.24rem;
        background: url(//img50.allinmd.cn/classes/views.png) no-repeat;
        background-size: 100% 100%;
        vertical-align: middle;
        margin-right: 0.13333rem;
    }
</style>