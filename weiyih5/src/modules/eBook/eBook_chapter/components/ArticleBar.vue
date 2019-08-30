<template>
    <section class="al-eBookItemContent" style="width: 100%;">
        <section id="box">
            <header class="al-personalContributionHeader ev-subNav" v-if="!fail">
                <h2 class="al-personalContributionTitle article">
                    <span class="labelsType">全部文章</span>
                    <span class="contributionNum">{{sum}}</span>
                </h2>
                <section class="al-personalContributionSelector" :class="unfold?'al-personalSelectorOn':''">
                    <h2 v-on:click="toggle()">{{rightLeft[nowIndex]}}</h2>
                    <ul  v-show="unfold" data-alcode-mod='434' data-alcode-item-selector="li">
                        <li class="al-personalContributionSelectorItem" :class="i==nowIndex?'active':''" v-for="(v,i) in rightLeft" @click="switchBtn(i)">{{v}}</li>
                    </ul>
                </section>
            </header>
            <section class="al-articleListContent" data-alcode-mod='432'>
                <section class="al-contentPartModule" v-for="(v,i) in articleList">
                    <div class="al-resourceTypeBox" style="margin-bottom:7px;">
                        <ul class="al-littleScoreStarBox" v-html="starDom(v.currentScoreNum,v.currentStarLevel)">
                        </ul>
                    </div>
                    <section class="al-tableBox">
                        <article class="al-contentText">
                            <a :href="v.webStoragePath" class="al-contentTitle">
                                <span>{{v.docName}}</span>
                            </a>
                            <p class="al-contentOtherMsg">
                                <span class="icon-contentWatchedNum">{{v.browseNum}}</span>
                                <span class="icon-tagComment">{{v.language}}</span>
                            </p>
                        </article>
                        <figure class="al-contentImgBox" v-if="v.picUrl">
                            <a :href="v.webStoragePath"><img :src="v.picUrl" alt=""></a>
                        </figure>
                    </section>
                </section>
                <div class="al-eBookNoContent" v-if="fail"><img src="//img50.allinmd.cn/pages/eBook/eBookNoContentImg.png" alt=""/></div>
            </section>
            <section class="lastTime" v-show="noData">~  到底了  ~</section>
            <Loading v-show="ajaxing"></Loading>
        </section>

    </section>
</template>

<script>

    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    import {mapActions} from "vuex";
    const PATH = '/mcall/cms/doc/getMapByDocList/';

    export default {
        data() {
            return {
                ajaxing:false,
                unfold:true,
                rightLeft:['默认顺序','最多浏览','最多评论'],
                nowIndex:0,
                articleList:[],
                articleParam: {
                    "bookId":this.$store.state.bookId,
                    "visitSiteId":2,
                    "scene":1,
                    "catalogueId":comm.getpara().articleCatalogue,
                    "pageIndex":1,
                    "pageSize":10,
                    "sortType":2
                },
                noData: false,
                sum:0,
                fail:false,
                flag:0
            }
        },
        components: {
            Loading
        },
        mounted() {
            let param = this.$store.state.routerData;
            this.content(param);
        },
        methods: {
            switchBtn(i){
                if(this.flag == i){
                    this.unfold = false;
                }else{
                    this.nowIndex = i;
                    this.flag =i;
                    let num = '';
                    if(i==0){
                        num = 2;
                    }else if(i==1){
                        num = 18;
                    }else if(i==2){
                        num = 19;
                    }
                    this.unfold = false;
                    this.noData = false;
                    this.articleParam.pageIndex = 1;
                    this.articleParam.sortType = num;
                    this.fail = false;
                    this.articleList = [];
                    this.clicks(num);
                    this.content();
                }
            },
            content(param){
                let t = this;
                if(!param){
                    t.ajaxing = true;
                }
                comm.ajax2({
                    url: PATH,
                    type: "post",
                    data: {paramJson: JSON.stringify(t.articleParam)},
                    dataType: "json",
                    success: function (res) {
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let dataList = res.responseObject.responseData;
                                t.articleParam.pageIndex++;
                                t.articleList = t.articleList.concat(dataList.data_list);
                                t.sum = dataList.total_count;
                                t.dcount(dataList.total_count);
                                if(t.articleList.length>=3){
                                    t.shareParam({
                                        docCount:dataList.total_count,
                                        firstDocName:t.articleList[0].docName,
                                        secondDocName:t.articleList[1].docName,
                                        threeDocName:t.articleList[2].docName,
                                    });
                                }else{
                                    t.shareParam({
                                        docCount:dataList.total_count,
                                        firstDocName:t.articleList[0]?t.articleList[0].docName:'',
                                        secondDocName:t.articleList[1]?t.articleList[1].docName:'',
                                        threeDocName:t.articleList[2]?t.articleList[2].docName:'',
                                    });
                                }

                                t.scrollLoad();
                                if(dataList.data_list.length<6){
                                    t.noData = true;
                                }
                            },
                            failed() {
                                if(t.articleParam.pageIndex>1){
                                    t.noData = true;
                                }else{
                                    t.fail = true;  //展示默认图
                                    // console.log(11111111111111111111111);
                                    //console.log('这里无文章应该配置默认图');
                                }
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    },
                });
            },
            scrollLoad() {
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll', function () {
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
                        if (!t.ajaxing && !t.noData) {
                            t.content();
                        }
                    }
                }, false);
            },
            //选择排序的list
            toggle:function(){
                this.unfold = !this.unfold;
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
            },
            ...mapActions(["shareParam","clicks","dcount"])
        },
    }
</script>

<style>
    .lastTime {
        font-size: .4rem;
        color: #626f8c;
        padding: .58667rem 0;
        text-align: center;
        background-color: #eff4f8;
    }
    .al-eBookNoContent {
        height: 8.66667rem;
        line-height: 8.66667rem;
        text-align: center;
        background-color: #eff4f8;
    }

</style>