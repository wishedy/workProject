<template>
    <section class="al-personalContent al-personalContribution" style="width: 100%;" data-role="contribution">
        <header class="al-personalContributionHeader ev-subNav">
            <section class="al-personalContributionSelector" :class="{'al-personalSelectorOn':updown}">
                <h2 @click="upDown" v-if="rightList.length">{{rightList[rightState].tagName}}</h2>
                <ul>
                    <li class="al-personalContributionSelectorItem" v-for="(v,i) in rightList" :class="i==rightState?'active':''" @click="switchList(v,i)">{{v.tagName}}</li>
                </ul>
            </section>
        </header>
        <section class="ev-list" data-alcode-mod="490">
            <section class="tagList" v-if="!noImage">
                <ul>
                    <li v-for="(item,index) in tagList" :class="{'active':index==propertyIndex}" @click="propertyClick(item,index)">
                        {{item.propertyName}}
                    </li>
                </ul>
            </section>
            <section class="al-contentPartModule" v-for="(v,i) in dataList" v-show="!noImage" @click="commCreatEvent({id:11263,locationId:v.customer_trends&&v.customer_trends.resourceId})">
                <section class="al-tableBox">
                    <article class="al-contentText" v-if="v.resource_valid.resourceValid==1">
                        <a :href="v.customer_trends.resourceUrl" class="al-contentTitle">
                            <span v-html="v.customer_trends.resourceName"></span>
                        </a>
                        <p class="al-contentOtherMsg">
                            <span class="contentAuthorName">{{dataTime(v.customer_trends.opDate)}}</span>
                            <span class="icon-contentWatchedNum">{{v.resource_valid.browseNum | toWKH}}浏览</span>
                        </p>
                    </article>

                    <figure class="al-contentImgBox video" v-if="v.customer_trends_type==1 && v.cms_video_attachment_logo!='' && v.resource_valid.resourceValid==1 &&v.cms_video_attachment_logo.videoAttUrl">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_video_attachment_logo.videoAttUrl">
                        </a>
                        <div>
                            <i class="al-videoPlayBtn">
                                <img src="/static/images/personal/start_p.png">
                            </i>
                        </div>
                    </figure>

                    <figure class="al-contentImgBox doc" v-if="v.customer_trends_type==2 && v.cms_doc_attachment_logo!='' && v.resource_valid.resourceValid==1 &&v.cms_doc_attachment_logo.docAttUrl">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_doc_attachment_logo.docAttUrl">
                        </a>
                    </figure>

                    <figure class="al-contentImgBox topic" v-if="v.customer_trends_type==4 && v.cms_topic_attachment_logo!='' && v.resource_valid.resourceValid==1 &&v.cms_topic_attachment_logo.topicAttUrl">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.cms_topic_attachment_logo.topicAttUrl">
                        </a>
                    </figure>

                    <figure class="al-contentImgBox case" v-if="v.customer_trends_type==7 && v.case_attachment_logo!='' && v.resource_valid.resourceValid==1 &&v.case_attachment_logo.attUrl">
                        <a :href="v.customer_trends.resourceUrl">
                            <img :src="v.case_attachment_logo.attUrl">
                        </a>
                    </figure>

                    <!--v.resource_valid.resourceValid==0,已被系统屏蔽-->
                    <article class="al-contentText" v-if="v.resource_valid.resourceValid==0">
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
            <section class="al-personalContributionOver" v-show="noData&&!noImage">
                <span>~</span>没有更多了<span>~</span>
            </section>

            <section class="al-personalContributionNone" v-show="noImage">
                <img src="/static/images/personal/nocontent.png" alt="">
                <p class="al-personalPushContribution">暂无专栏</p>
            </section>
        </section>
    </section>
</template>

<script>
    import axios from "axios";
    import comm from "static/js/comm";
    import commDate from 'static/js/comm.date.js'
    import {mapActions,mapGetters} from "vuex";
    const PATH = '/mcall/customer/trends/getListByTagId/';
    const  getTagList='/mcall/customer/trends/getTagList/';
        export default {
            props:['isResurce'],
        data(){
            return {
                rightList:[],
                tagList:[
                ],
                ajaxing:false,
                propertyIndex:0,
                rightState:'0',
                updown:false,    //左侧导航展开收起
                flag:'',        //标记左导航点击过在点击不从新加载内容
                dataList:[],    //贡献数据
                type:'全部',     //资源名称
                numbers:'',     //资源数量
                pageIndex:1,    //翻页下标
                noData:false,   //少于20条数据
                refType:"",     //记录类型ID
                noImage:false,  //自己无贡献
                isSelf:false,   //判断是否是自己
                propertyId:0,
                tagId:'0',
                state:{
                    'padding':'0 0.10667rem',
                    'margin-right': '0.26667rem',
                    'border-radius': '0.02667rem'
                },
                noChangeTab:true
            }
        },
        beforeDestroy(){
            this.noChangeTab = false;
        },
        mounted(){
            this.initContribution("");
            this.getTagList();
        },
            computed:{
                ...mapGetters(['isAjax'])
            },
        methods:{
            ...mapActions(["changeIsAjax","commCreatEvent"]),
            dataTime(time){
                return commDate.diffDay_three(time,commDate.local_time())
            },
            propertyClick(item,index){
                this.propertyIndex=index;
                this.propertyId=item.propertyId;
                this.pageIndex = 1;
                this.rightState = 0;
                this.tagId=0;
                this.initContribution(1);
                this.commCreatEvent({id:11257});
            },
            upDown(){
                this.updown = !this.updown;
            },
            switchList(v,i){
                this.updown = false;
                this.rightState = i;
                this.type = this.rightList[i].tagName;
                let num = '',refType = '';
                switch(v.tagName){
                  case '全部':
                    num = 11258;
                    refType = "";break;
                  case '视频':
                    num = 11259;
                    refType = 1;break;
                  case '病例':
                    num = 11260;
                    refType = 7;break;
                  case '文库':
                    num = 11261;
                    refType = 2;break;
                }
                this.refType = refType;
                this.tagId = v.tagId;
                this.pageIndex = 1;
                if(this.flag == i) {
                    return false;
                }else{
                    this.commCreatEvent({id:num});
                    this.initContribution(1);
                    this.flag = i;
                }
            },
            initContribution(clickFlag){
                let t = this;
               t.changeIsAjax(true);
                t.ajaxing=true;
                axios({
                    url:PATH,
                    method:"POST",
                    data:{
                        sessionCustomerId: this.$store.state.otherId,
                        "opId":0,
                        "trendTypes":"1,2,7",
                        "dataFlag":1,
                        "sortType":2,
                        "logoUseFlag":3,
                        "attUseFlag":5,
                        "visitSiteId":2,
                        "pageIndex":t.pageIndex,
                        "pageSize":20,
                        "propertyId":t.propertyId,
                        "vFlag":"3",
                        useFlag:3,
                        "tagId":t.tagId,
                    },
                    transformRequest: [data=>{
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(res=>{
                    t.changeIsAjax(false);
                    t.ajaxing=false;
                    if(comm.hasResponseData(res.data)){
                        t.noImage=false;
                        let result = res.data.responseObject.responseData;
                        t.numbers = !result.totalCount ? 0 : result.totalCount;
                        if(t.pageIndex==1){
                            t.$emit('totalCount',t.numbers)
                        }
                        if(result.tagList.length){
                            t.rightList=[];
                            t.rightList.push({
                                tagName:'全部',
                                tagId:'0'
                            });
                            t.rightList=t.rightList.concat(result.tagList);
                        }else {
                            t.rightList=[];
                        }
                        if(result.dataList&&result.dataList.length==0&&t.pageIndex==1){
                                t.noImage = true;
                        }
                        if(result.dataList.length < 20 ){
                            if(clickFlag==1){
                                t.dataList = result.dataList;
                            }else{
                                t.dataList = t.dataList.concat(result.dataList);
                            }
                            t.noData = true;
                        }else{
                            if(clickFlag==1){
                                t.dataList = result.dataList;
                            }else{
                                t.dataList = t.dataList.concat(result.dataList);
                            }
                            t.pageIndex++;
                            t.noData = false;
                            t.scrollLoad();
                        }
                    }else{

                        if(t.pageIndex==1){
                            t.$emit('totalCount',0)
                            t.noImage = true;
                        }
                        t.noData = true;
                    }
                });
            },
            scrollLoad(){
                let t = this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData && t.noChangeTab && !window.stopScroll&&t.isResurce==1){
                            t.initContribution();
                        }
                    }
                },false);
            },
            //获取专栏下面的标签
            getTagList(){
                let t=this;
                t.changeIsAjax(true);
                comm.ajax2({
                    url:getTagList,
                    type:'post',
                    data:{paramJson:JSON.stringify({
                            "sessionCustomerId":t.$store.state.otherId,
                            "opId":0,
                            "trendTypes":"1,2,7",
                            "dataFlag":1,
                            "sortType":2,
                            "logoUseFlag":3,
                            "attUseFlag":5,
                            "visitSiteId":2,
                            "pageIndex":1,
                            "pageSize":20
                        })},
                    success:(data)=>{
                        t.changeIsAjax(false);
                        if(data&&data.responseObject&&data.responseObject.responseData&&data.responseObject.responseData.dataList&&data.responseObject.responseData.dataList.length){
                            t.tagList=[{
                                propertyName:'全部',
                                propertyId:'0'
                            }];
                            t.tagList=t.tagList.concat(data.responseObject.responseData.dataList);
                        }
                    }
                })
            }
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
    }
</script>