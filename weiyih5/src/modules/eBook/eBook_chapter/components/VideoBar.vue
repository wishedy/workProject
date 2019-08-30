<template>
    <section class="al-eBookItemContent" style="width: 100%;">
        <section id="box">
            <header class="al-personalContributionHeader ev-subNav" v-if="!fail">
                <h2 class="al-personalContributionTitle article">
                    <span class="labelsType">全部视频</span>
                    <span class="contributionNum">{{sum}}</span>
                </h2>
                <section class="al-personalContributionSelector" :class="unfold?'al-personalSelectorOn':''">
                    <h2 v-on:click="toggle()">{{types}}</h2>
                    <ul  v-show="unfold" data-alcode-mod='434' data-alcode-item-selector="li">
                        <li class="al-personalContributionSelectorItem" :class="i==nowIndex?'active':''" v-for="(v,i) in rightLeft" @click="switchBtn(i,v)">{{v}}</li>
                    </ul>
                </section>
            </header>
            <section class="al-articleListContent" data-alcode-mod='432'>
                <section class="al-contentPartModule" v-for="(v,i) in videoList">
                    <div class="al-resourceTypeBox" style="margin-bottom:7px;">
                        <ul class="al-littleScoreStarBox" v-html="starDom(v.currentScoreNum,v.currentStarLevel)">

                        </ul>
                    </div>
                    <section class="al-tableBox">
                        <article class="al-contentText">
                            <a :href="v.webStoragePath" class="al-contentTitle">
                                <span>{{v.videoName}}</span>
                            </a>
                            <p class="al-contentOtherMsg">
                                <span class="icon-contentWatchedNum">{{v.browseNum}}</span>
                                <span class="icon-tagComment">{{v.reviewNum}}</span>
                            </p>
                        </article>
                        <figure class="al-contentImgBox"><a href="https://m.allinmd.cn/html/m/video/2014/04/19/1397797391802.html">
                            <img :src="v.picUrl"  alt="">
                            <i class="al-videoPlayBtn">
                                <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                            </i>
                            <span class="al-videoTime">{{v.playTime}}</span>
                        </a>
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
    const PATH = '/mcall/cms/video/getMapByVideoList/';

    export default {
        data() {
            return {
                ajaxing:false,
                unfold:true,
                rightLeft:['全部'],
                nowIndex:0,
                videoList:[],
                videoParam: {
                    "bookId":this.$store.state.bookId,
                    "visitSiteId":2,
                    "scene":10,
                    "catalogueId":comm.getpara().articleCatalogue,
                    "pageIndex":1,
                    "pageSize":10,
                    "videoEbookCatagory":0
                },
                noData: false,
                sum:0,
                fail:false,
                types:'全部',
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
            switchBtn(i,v){
                let num = '';
                if(v=='全部'){
                    num = 0;
                }else if(v=='视诊/触诊'){
                    num = 1;
                }else if(v=='活动度'){
                    num = 2;
                }else if(v=='肌力检查'){
                    num = 3;
                }else if(v=='操作'){
                    num = 4
                }else if(v=='特殊检查'){
                    num = 5
                }
                if(this.flag == num){
                    this.unfold = false;
                }else{
                    this.nowIndex = i;
                    this.flag = i;
                    this.unfold = false;
                    this.noData = false;
                    this.videoParam.pageIndex = 1;
                    this.videoParam.videoEbookCatagory = num;
                    this.fail = false;
                    this.clicks(num);
                    this.videoList = [];
                    this.types = v;
                    this.rightLeft = ['全部'];
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
                    data: {paramJson: JSON.stringify(t.videoParam)},
                    dataType: "json",
                    success: function (res) {
                        t.ajaxing = false;
                        let options = {
                            success(res) {
                                let catagoryList = res.responseObject.responseData.catagory_list[0];
                                if(catagoryList.VisionCount!=0){
                                    t.rightLeft.push('视诊/触诊');
                                }
                                if(catagoryList.ActivityCount!=0){
                                    t.rightLeft.push('活动度');
                                }
                                if(catagoryList.strengthCount!=0){
                                    t.rightLeft.push('肌力检查');
                                }
                                if(catagoryList.operatingCount!=0){
                                    t.rightLeft.push('操作');
                                }
                                if(catagoryList.specialCount!=0){
                                    t.rightLeft.push('特殊检查');
                                }
                                let dataList = res.responseObject.responseData;
                                t.videoParam.pageIndex++;
                                t.videoList = t.videoList.concat(dataList.data_list);
                                t.sum = dataList.total_count;
                                t.vcount(dataList.total_count);

                                if(dataList.data_list.length>=3){
                                    t.shareParam({
                                        docCount:dataList.total_count,
                                        firstDocName:t.videoList[0].videoName,
                                        secondDocName:t.videoList[1].videoName,
                                        threeDocName:t.videoList[2].videoName,
                                    });
                                }else{
                                    t.shareParam({
                                        docCount:dataList.total_count,
                                        firstDocName:t.videoList[0]?t.videoList[0].videoName:'',
                                        secondDocName:t.videoList[1]?t.videoList[1].videoName:'',
                                        threeDocName:t.videoList[2]?t.videoList[2].videoName:'',
                                    });
                                }

                                t.scrollLoad();
                                if(dataList.data_list.length<6){
                                    t.noData = true;
                                }
                            },
                            failed() {
                                if(t.videoParam.pageIndex>1){
                                    t.noData = true;
                                }else{
                                    t.fail = true;  //展示默认图
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
            ...mapActions(["shareParam","clicks","vcount"])
        }
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