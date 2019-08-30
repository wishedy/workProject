<template>
    <section class="al-discoverSeminarInnerBox" data-subjectCntType="00" data-alcode-mod='412'>
        <section class="searchResultsText" :style="{display:isResult}">匹配结果</section>
        <section class="al-discoverSeminarNone" :style="{display:isData}"></section>
        <section class="al-discoverSeminarInner" v-for="(v,i) in item" :key="i">
            <section class="al-discoverSeminar">
                <a :href="v.themeStoragePath">
                    <figure class="al-discoverSeminarImg">
                        <img :src="v.themeLogoUrl" alt="">
                        <i v-if="isShow" :class="icon(v.isHot,v.isLiving,v.isNew)"><img :src="attUrl(v.isHot,v.isLiving,v.isNew)" alt=""></i>
                    </figure>
                    <figcaption class="al-discoverSeminarContent">
                        <h2 class="EV-seminarContent">{{v.themeName}}</h2>
                        <span>查看全文<i class="icon-messageMore"></i></span>
                    </figcaption>
                </a>
            </section>
        </section>
        <section class="al-applicaptionMaster" data-alcode-mod='413' v-show="noData">
            <i class="icon-aplMaster"></i>
            <p>没有找到喜欢的专题？</p>
            <a href="/pages/discover/discover_sendMsg.html" data-alcode='e48'>告诉我们</a>
        </section>
        <Loading v-show="ajaxing"></Loading>
        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>
    </section>
</template>

<script>
    import axios from "axios"
    import {mapGetters,mapActions} from "vuex"
    import comm from "static/js/comm"
    import Loading from "components/Loading/Loading"
    import bus from "../assets/eventBus"
    import Log from "static/js/log"
    import Share from "components/Share/Share.vue";
    const path  = {
        list:'/mcall/cms/theme/getMapList3/'
    };
    export default {
        data(){
            return {
                item:[],
                pageIndex:1,
                isShow:false,
                ajaxing:false,
                noData:false,
                public:"",
                isResult:'none',
                isData:'none',
                shareConfig:"",
                shareOnOff:true,
                word:''
            }
        },
        computed:{
            ...mapGetters(['tabType']),
        },
        methods:{
            content(){
                let t = this;
                t.ajaxing = true;
               /* let types = this.$route.name;
                this.change(types);*/
                axios({
                    url:path.list,
                    method:"POST",
                    data:{
                        "sortType":5,
                        "pageIndex":this.pageIndex,
                        "pageSize":20,
                        "themeGroup":t.tabType,
                    },
                    transformRequest:[data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    header:{
                        "X-Requested-with":"XMLHttpRequest"
                    },
                    timeout:30000
                }).then(res=>{
                    this.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        let dataList = res.data.responseObject.responseData.data_list;
                        this.item =  this.item.concat(dataList);
						this.shareOnOff = true;
                        this.pageIndex++;
                        if(dataList.length<20){
                            this.noData = true;
                        }else{
                            this.noData = false;
                        }

                    }else{//第一页无数据不显示分享
                    	if(this.pageIndex==1){
                    		this.shareOnOff = false;
                        }
                        this.noData = true;
                    }
                },r=>{
//                    console.log('失败·······')
                })
            },
            icon(v1,v2,v3){
                let str = '';
                if(v1===1){
                    str =  'al-semeinarMark';
                }
                if(v2===1){
                    str =  'al-semeinarLiving';
                }
                if(v3===1){
                    str =  'al-semeinarMark';
                }
                if(v1===1 || v2===1 || v3===1){
                    this.isShow = true;
                }
                return str;
            },
            attUrl(v1,v2,v3){
                if(v1===1){
                    return '//img50.allinmd.cn/pages/discover/mark_hot.png';
                }
                if(v2===1){
                    return '//img50.allinmd.cn/pages/discover/mark_living_now.png';
                }
                if(v3===1){
                    return '//img50.allinmd.cn/pages/discover/mark_new.png';
                }
            },
            scroll(){
                let scrollTop = 0;
                let t = this;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData) {
                            t.content();
                        }
                    }
                },false);
            },
            ...mapActions(["change","changeEn"]),
            share(){
                let t = this;
                t.shareConfig = {
                    initData:{},
                    shareData:{
                        "sortType":5,
                        "pageIndex":"1",
                        "pageSize":20,
                        "sceneType":15,
                        "themeGroup":t.public,
                        "searchKeyword":t.word
                    }
                }
            },
        },
        mounted(){
            this.content();
            this.scroll();
            this.share();
            let t = this;
            bus.$on("successData",function(res){
                let msg = res.data.responseObject.responseData;
                t.noData = true;
                if(Object.keys(msg).length!=0){
                    t.isResult = 'block';
                    t.isData = 'none';
                    t.shareOnOff = true;
                    t.item = msg.data_list;
                }else{
                    t.isResult = 'none';
                    t.isData = 'block';
					t.shareOnOff = false;
                    t.item = [];
                }
            });
            bus.$on("close",()=>{           //点击小x号执行
                this.item = [];             //清空数据
                t.isData = 'none';          //隐藏无数据展示的图
                t.isResult = 'none';        //隐藏搜搜匹配成功字符
                t.shareOnOff = false;
            });
            bus.$on("cancel",()=>{          //点击取消按钮从新调用列表主方法
                this.isData = 'none';       //无数据图初始化
                this.isResult = 'none';     //匹配结果初始化
                this.pageIndex = 1;         //分页请求初始化
                this.item = [];             //初始化数据为空
                this.content();             //调用主方法
                t.word = '';
                t.shareOnOff = true;
                t.share();
            });
            bus.$on("string",(res)=>{
                this.group = res;
            })
        },
        components:{
            Loading,
            Share
        },
        watch:{
            //tab点击变化了
            tabType(){
                this.item = [];
                this.pageIndex = 1;
                this.content();
                this.word = "";
                this.share();
            },
          /*  $route(){
                this.item = [];
                this.pageIndex = 1;
                this.content();
                this.word = "";
                this.share();
            },*/
            "$store.state.search"(){
                if(this.$store.state.search==1){    //点击状态
                    this.head = false;
                    this.layer = true;
                    this.high = 0;
                    this.shareOnOff = false;
                }else{      //取消还原状态
                    this.head = true;
                    this.layer = false;
                    this.high = this.height;
                }
            },
            "$store.state.word"(){
                this.word = this.$store.state.word;
                this.share();
            }
        }
    }
</script>

<style scoped>
    .al-discoverSeminarNone {
        background: url('//img50.allinmd.cn/pages/discover/h5None.png') no-repeat center;
        height: 4.34667rem;
        background-size: 61%;
        margin: 100px 0;
        display: none;
    }
</style>