<template>
    <section class="al-eBookItemContent slide-content" data-role="article" style="width:100%">
        <header class="al-personalContributionHeader">
            <h2 class="al-personalContributionTitle">
                <span class="labelsType">全部文章</span><span class="contributionNum"></span>
            </h2>
            <section class="al-personalContributionSelector" :class="{'al-personalSelectorOn':unfold}">
                <h2 @click="toggle">{{flag==0?'最多浏览':'最多评论'}}</h2>
                <ul data-alcode-mod='438' data-alcode-item-selector="li" v-show="unfold">
                    <li class="al-personalContributionSelectorItem" :class="flag==0?'active':''" @click="switchBtn(0)">最多浏览</li>
                    <li class="al-personalContributionSelectorItem" :class="flag==1?'active':''" @click="switchBtn(1)">最多评论</li>
                </ul>
            </section>
        </header>
        <section class="al-contentArticle" data-alcode-mod='439'>
            <section class="al-contentPartModule"  v-for="(v,i) in articleData">
                <div class="al-resourceTypeBox" style="margin-bottom:7px;">
                    <ul class="al-littleScoreStarBox" v-html="starDom(v.currentScoreNum,v.currentStarLevel)">

                    </ul>
                </div>
                <section class="al-tableBox">
                    <article class="al-contentText">
                        <a :href="v.pageStoragePath" class="al-contentTitle">
                            <span>{{v.docName}}</span>
                        </a>
                        <p class="al-contentOtherMsg">
                            <span class="icon-contentWatchedNum">{{v.browseNum | toWKH}}</span>
                            <span class="icon-tagComment">{{v.reviewNum |toWKH}}</span>
                        </p>
                    </article>
                    <figure class="al-contentImgBox" v-if="v.picUrl!=''">
                        <a :href="v.webStoragePath">
                            <img :src="v.picUrl">
                        </a>
                    </figure>
                </section>
            </section>
        </section>
        <footer class="al-eBookNoContent" v-show="noData">
            <span>~</span>到底了<span>~</span>
        </footer>
    </section>
</template>

<script>
    import comm from "static/js/comm";
    import {mapActions} from "vuex";
    const PATH = '/mcall/cms/doc/getMapByDocList/';
    export default {
        data() {
            return {
                unfold:true,
                bookNum: 2,
                flag:0,
                articleData: [],
                requestData: {
                    "pageIndex": 1,
                    "pageSize": 6,
                    "bookId": this.$store.state.bId,
                    "visitSiteId": 2,
                    "scene": 1,
                    "sortType": 18,
                },
                noData: false,
                article: false,
                ajaxing:false,
				noChangeTab:true
            }
        },
		beforeDestroy(){
			this.noChangeTab =false;
		},
        mounted() {
            this.ajax();
//            this.scrollLoad();
        },
        methods: {
            //文章最新最热展开收起
            toggle(){
                this.unfold = !this.unfold;
            },
            //评论浏览切换
            switchBtn(num){
                if(this.flag == num){
                    this.unfold = false;
                    return false;
                }else{
                    this.unfold = false;
                    this.noData = false;
                    this.flag = num;
                    this.requestData.pageIndex = 1;
                    if(num==0){
                        this.requestData.sortType = 18;
                    }else if(num==1){
                        this.requestData.sortType = 19;
                    }
                    this.articleData = [];
                    this.ajax();
                }
            },
            //获得文本详情
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
            isValid(valid){
                if(valid==0||valid==2||valid==3){
                    return "isNotValid";
                }	else{
                    return "";
                }
            },
            isBookIcon(videoType){
                return (videoType==17||videoType==18||videoType==19)?'bookNameIcon':'icon-contentAuthor';
            },
            getPicUrl(picUrl){
                let picArr = picUrl.split('|');
                if(picArr.length==1){return picUrl;}
                if(/allinmd.cn/.test(picArr[0])){
                    return picArr[0];
                }else if(/allinmd.cn/.test(picArr[1])){
                    return picArr[1]
                }
            },
            scrollLoad() {
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll', function () {
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if (scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
                        if (!t.ajaxing && !t.noData && t.noChangeTab) {
                            t.ajax();
                        }
                    }
                }, false);
            },
            ajax() {
                let t = this;
                t.trigger(true);
                t.ajaxing = true;
                comm.ajax2({
                    url: PATH,
                    type: "post",
                    data: {paramJson: JSON.stringify(t.requestData)},
                    dataType: "json",
                    success: function (res) {
                        t.ajaxing = false;
                        t.trigger(false);
                        let options = {
                            success(res) {
                            	if(comm.hasResponseData(res)) {
									t.$store.state.articleNum = res.responseObject.responseData.total_count;
									let dataList = res.responseObject.responseData.data_list;
									t.requestData.pageIndex++;
									t.articleData = t.articleData.concat(dataList);
									t.scrollLoad();
									if (dataList.length < 6) {
										t.noData = true;
									}
								}
                            },
                            failed() {
                                if(t.requestData.pageIndex>1){
                                    t.noData = true;
                                }else{
                                    //console.log('这里无文章应该配置默认图');
                                }
                                return false;
                            }
                        };
                        comm.successRequest(res,options);
                    }
                });
            },
            ...mapActions(["trigger"])
        },
        filters:{
            toWKH:(V)=>comm.toWKH(V)
        }
    }
</script>