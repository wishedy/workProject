<template>
    <section class="al-personalContent al-personalContribution" style="position: absolute;width: 100%;"
             data-role="contribution">
        <header class="al-personalContributionHeader ev-subNav" v-show="dataList.length">
            <h2 class="al-personalContributionTitle">
                <span class="labelsType">{{type}}</span>贡献<span class="contributionNum">{{numbers}}</span>
            </h2>
            <section class="al-personalContributionSelector" :class="{'al-personalSelectorOn':updown}">
                <h2 @click="upDown">{{rightList[rightState]}}</h2>
                <ul>
                    <li class="al-personalContributionSelectorItem" v-for="(v,i) in rightList" :class="i==rightState?'active':''" @click="switchList(v,i)">{{v}}</li>
                </ul>
            </section>
        </header>
        <section class="ev-list" data-alcode-mod="490">
            <section class="al-contentPartModule" v-for="(v,i) in dataList" v-show="!noImage">
                <section class="al-tableBox">
                    <article class="al-contentText" v-if="v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl" class="al-contentTitle">
                            <span>{{v.customer_trends.resourceName}}</span>
                        </a>
                        <p class="al-contentOtherMsg">
                             <span v-if="v.resource_valid.isShowActivityTag==1"
                                  :style="'color:'+v.resource_valid.activityTagColor+';border:1px solid'+v.resource_valid.activityTagColor+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;'">
                                {{v.resource_valid.activityTagName}}
                            </span>
                            <span class="icon-contentWatchedNum">{{v.resource_valid.browseNum | toWKH}}</span>
                            <span class="icon-tagComment">{{v.resource_valid.reviewNum | toWKH}}</span>
                            <span class="icon-likeNum">{{v.resource_valid.preferUpNum | toWKH}}</span>
                        </p>
                    </article>

                    <figure class="al-contentImgBox video" v-if="v.customer_trends_type==1 && v.cms_video_attachment_logo!='' && v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_video_attachment_logo.videoAttUrl">
                        </a>
                        <div>
                            <i class="al-videoPlayBtn">
                                <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png">
                            </i>
                            <span class="al-videoTime">{{v.resource_valid.playTime}}</span>
                        </div>
                    </figure>

                    <figure class="al-contentImgBox doc" v-if="v.customer_trends_type==2 && v.cms_doc_attachment_logo!='' && v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_doc_attachment_logo.docAttUrl">
                        </a>
                    </figure>

                    <figure class="al-contentImgBox topic" v-if="v.customer_trends_type==4 && v.cms_topic_attachment_logo!='' && v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_topic_attachment_logo.topicAttUrl">
                        </a>
                    </figure>

                    <figure class="al-contentImgBox case" v-if="v.customer_trends_type==7 && v.case_attachment_logo!='' && v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.case_attachment_logo.attUrl">
                        </a>
                    </figure>

                    <!--v.resource_valid.resourceValid==0,已被系统屏蔽-->
                    <article class="al-contentText" v-if="v.resource_valid.resourceValid==0">
                        <a href="javascript:;" class="al-contentTitle" style="color:#a9a9a9;">
                            <span>该{{v.customer_trends.resourceType | fill}}已被系统屏蔽</span>
                        </a>
                        <p class="al-contentOtherMsg">
                            <span v-if="v.resource_valid.isShowActivityTag==1"
                                   :style="'color:'+v.resource_valid.activityTagColor+';border:1px solid'+v.resource_valid.activityTagColor+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;'">
                                {{v.resource_valid.activityTagName}}
                            </span>
                            <span class="icon-contentWatchedNum">{{v.resource_valid.browseNum | toWKH}}</span>
                            <span class="icon-tagComment">{{v.resource_valid.reviewNum | toWKH}}</span>
                            <span class="icon-likeNum">{{v.resource_valid.preferUpNum | toWKH}}</span>
                        </p>
                    </article>

                    <!--v.resource_valid.resourceValid==2,已被用户删除-->
                    <article class="al-contentText" v-if="v.resource_valid.resourceValid==2">
                        <a href="javascript:;" class="al-contentTitle"  style="color:#a9a9a9;">
                            <span>该{{v.customer_trends.resourceType | fill}}已被系统屏蔽</span>
                        </a>
                        <p class="al-contentOtherMsg">
                            <span v-if="v.resource_valid.isShowActivityTag==1"
                                   :style="'color:'+v.resource_valid.activityTagColor+';border:1px solid'+v.resource_valid.activityTagColor+';padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;'">
                                {{v.resource_valid.activityTagName}}
                            </span>
                            <span class="icon-contentWatchedNum">{{v.resource_valid.browseNum | toWKH}}</span>
                            <span class="icon-tagComment">{{v.resource_valid.reviewNum | toWKH}}</span>
                            <span class="icon-likeNum">{{v.resource_valid.preferUpNum | toWKH}}</span>
                        </p>
                    </article>


                </section>
            </section>
            <section class="al-personalContributionOver" v-show="noData">
                <span>~</span>没有更多了<span>~</span>
            </section>

            <section class="al-othersActiveNone" v-show="noImage">
                <img src="//img50.allinmd.cn/pages/personal/others_no_contribution.png" alt="">
            </section>
        </section>

        <Loading v-show="ajaxing"></Loading>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import Loading from "components/Loading/Loading";
    const PATH = '/mcall/customer/trends/getMapList/';
        export default {
        data(){
            return {
                rightList:['全部'],
                rightState:'0',
                updown:true,    //左侧导航展开收起
                flag:'',        //标记左导航点击过在点击不从新加载内容
                ajaxing:false,  //ajax请求状态ing···
                dataList:[],    //贡献数据
                type:'全部',     //资源名称
                numbers:'',     //资源数量
                pageIndex:1,    //翻页下标
                noData:false,   //少于20条数据
                refType:"",     //记录类型ID
                noImage:false,  //自己无贡献
                isSelf:false,   //判断是否是自己
                state:{
                    'padding':'0 0.10667rem',
                    'margin-right': '0.26667rem',
                    'border-radius': '0.02667rem'
                },
                type:'全部',
                noChangeTab:true
            }
        },
        beforeDestroy(){
            this.noChangeTab = false;
        },
        mounted(){
            let resource = this.$store.state.resourceType;
            if(resource.videoNum>0){
                this.rightList.push('视频');
            }
            if(resource.caseNum>0){
                this.rightList.push('病例');
            }
            if(resource.docNum>0){
                this.rightList.push('文库');
            }
            if(resource.topicNum>0){
                this.rightList.push('话题');
            }
            this.initContribution("");
        },
        methods:{
            upDown(){
                this.updown = !this.updown;
            },
            switchList(v,i){
                this.updown = false;
                this.rightState = i;
                this.type = this.rightList[i];
                let num = '',refType = '';
                switch(v){
                  case '全部':
                    num = 51;
                    refType = "";break;
                  case '视频':
                    num = 53;
                    refType = 1;break;
                  case '病例':
                    num = 52;
                    refType = 7;break;
                  case '文库':
                    num = 54;
                    refType = 2;break;
                  case '话题':
                    num = 55;
                    refType = 4;break;
                }
                this.refType = refType;
                this.pageIndex = 1;
                if(this.flag == i) {
                    return false;
                }else{
                    comm.creatEvent({
                        triggerType:'全部类型 -'+ this.type+'',
                        keyword:'全部类型 -'+ this.type+'',
                        actionId:num
                    });
                    this.initContribution(1);
                    this.flag = i;
                }
            },
            initContribution(clickFlag){
                let t = this;
                t.ajaxing = true;

                axios({
                    url:PATH,
                    method:"POST",
                    data:{
                        customerId: this.$store.state.otherId,
                        opId: 0,
                        resourceType: t.refType, //类型变化
                        trendTypes : "1,2,4,7",
                        dataFlag: 5,
                        logoUseFlag: 3,
                        useFlag:3,
                        attUseFlag: 5, //300*200 新的
                        visitSiteId: 2,
                        pageIndex: t.pageIndex,
                        pageSize: 20
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    t.ajaxing = false;
                    if(comm.hasResponseData(res.data)){
                        t.noImage=false;
                        let result = res.data.responseObject.responseData;
                        t.numbers = !result.total_count ? 0 : result.total_count;
                        if(result.data_list.length < 20 ){
                            if(clickFlag==1){
                                t.dataList = result.data_list;
                            }else{
                                t.dataList = t.dataList.concat(result.data_list);
                            }
                            t.noData = true;
                        }else{
                            if(clickFlag==1){
                                t.dataList = result.data_list;
                            }else{
                                t.dataList = t.dataList.concat(result.data_list);
                            }
                            t.pageIndex++;
                            t.noData = false;
                            t.scrollLoad();
                        }
                    }else{
                        t.noImage = true;
                    }
                });
            },
            scrollLoad(){
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData && t.noChangeTab && !window.stopScroll){
                            t.initContribution();
                        }
                    }
                },false);
            }
        },
        components:{
            Loading
        },
        filters:{
            toWKH:comm.toWKH,
            fill:v1=>{
                let desc = '';
                switch(parseInt(v1)){
                    case 1: desc="视频"; break;
                    case 2: desc= "文章";break;
                    case 4: desc="话题"; break;
                    case 7: desc="病例"; break;
                    default: desc= "评论";
                }
                return desc;
            }
        },
        watch: {
            "$store.state.resourceType"() {
                let resource = this.$store.state.resourceType;
                if (resource.videoNum > 0) {
                    this.rightList.push('视频')
                }
                if (resource.caseNum > 0) {
                    this.rightList.push('病例')
                }
                if (resource.docNum > 0) {
                    this.rightList.push('文库')
                }
                if (resource.topicNum > 0) {
                    this.rightList.push('话题')
                }
            },
        }
    }
</script>