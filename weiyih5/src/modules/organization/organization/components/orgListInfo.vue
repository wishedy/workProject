<template>
    <!--专栏开始-->
    <aside class="al-column ev-alColumn " :class="{contentTabFix:headShow}"><!--:class="{contentTabFix:headShow}"-->
        <!--标题开始-->
        <h1 class="headerTitle">
            <p class="titleShow">专栏</p>
            <p class="numShow" v-if="totalCount>0">{{totalCount}}</p>
            <p class="tagShow" :class="{active:tagShow}"
               v-if="tagListArr.length>0" @click="filterBtn">{{tagNameShow}}</p>
            <ul class="al-tagList" v-if="tagShow">
                <li v-for="(items,i) in tagListArr" :class="{active:items.tagId==tagIndex}" @click="tagListClick(items.tagId)">{{items.tagName}}</li>
            </ul>
        </h1>
        <!--标题结束-->
        <!--列表开始-->
        <section>
            <section class="al-listParent" v-if="dataListArr.length>0" v-for="(items,i) in dataListArr">
                <aside class="al-itemList" :class="{paddingRig:items.resourceAttUrl}">
                    <a @click="commCreateEvent({id:'11476'})" class="al-itemListName" :href="(items.mpageStoragePath?
                        '//m.allinmd.cn'+items.mpageStoragePath:'javascript:;')">
                        {{items.resourceName}}
                    </a>
                    <p class="al-social">
                        <span class="timeSocial" v-if="items.publishTime">{{dataTime(items.publishTime)}}</span>
                        <span class="playSocial" v-if="items.browseNum">{{items.browseNum+'浏览'}}</span>
                    </p>
                </aside>
                <figure class="al-itemListImg" v-if="items.resourceAttUrl">
                    <a @click="commCreateEvent({id:'11476'})" :href="(items.mpageStoragePath?
                        '//m.allinmd.cn'+items.mpageStoragePath:'javascript:;')">
                        <img :src="items.resourceAttUrl">
                        <i class="al-videoBtn" v-if="items.tagId==1">
                            <img src="/static/images/personal/start_p.png">
                        </i>
                    </a>
                </figure>
            </section>
        </section>
        <!--列表结束-->
        <!--没有更多开始-->
        <section class="listNotMore" v-if="notMore&&!notListShow">
            <span>~</span>没有更多了<span>~</span>
        </section>
        <!--没有更多结束-->
        <!--暂无专栏开始-->
        <section class="notList" v-if="notListShow">
            <img src="/static/images/personal/nocontent.png" alt="">
            <p class="textTips">暂无专栏</p>
        </section>
        <!--暂无专栏结束-->
    </aside>
    <!--专栏结束-->
</template>

<script>
    import comm from 'static/js/comm.js';
    import commDate from 'static/js/comm.date.js'
    import {mapActions, mapGetters} from "vuex";

    const path={
        getResourcePager: "/mcall/organization/getResourcePager/",//获取组织专栏列表
    };
    export default {
        name: "orgInfo",
        data() {
            return {
                orgId:comm.getpara().orgId?comm.getpara().orgId:"10001",//组织id
                orgHeadInfo:"",//头部信息
                tagShow:false,//专栏下拉筛选
                dataListArr:[],//专栏数据列表数组
                tagListArr:[],//专栏筛选标签数组
                newsListArr:[],//新闻公告列表
                tagIndex:0,//筛选索引
                tagIdVal:"",//筛选id
                tagNameShow:"全部",//筛选标签展示
                fromTag:false,//是否由筛选来
                notMore:false,//没有更多是否展示
                notListShow:false,//没有专栏图片
                pageIndex:1,
                pageSize:20,
                totalCount:0,//资源数
                noChangeTab:true
            }
        },
        beforeDestroy(){
            this.noChangeTab = false;
        },
        watch:{
            //筛选值变化
            tagIdVal(){
                let t=this;
                t.pageIndex=1;
                t.fromTag=true;
                t.getDataList();//专栏列表
            }
        },
        computed:{
            ...mapGetters(['isLoading','headShow'])
        },
        methods: {
            ...mapActions(["changeLoading","commCreateEvent"]),
            //处理专栏资源列表里的时间
            dataTime(time){
                return commDate.diffDay_three(time,commDate.local_time());
            },
            //专栏筛选唤醒按钮
            filterBtn(){
                let t=this;
                t.tagShow=!t.tagShow;
            },
            //筛选条件点击
            tagListClick(tagId){
                let t=this;
                t.tagIndex=tagId;
                t.tagShow=false;//筛选下拉不显示
                t.commCreateEvent({id:'11475'});//组织专栏筛选
                switch (parseInt(tagId)){
                    case 0://全部
                        t.tagIdVal="";
                        t.tagNameShow="全部";
                        break;
                    case 1://视频
                        t.tagIdVal="1";
                        t.tagNameShow="视频";
                        break;
                    case 2://文库
                        t.tagIdVal="2";
                        t.tagNameShow="文库";
                        break;
                }
            },
            //组织专栏列表获取数据
            getDataList(){
                let t=this;
                t.changeLoading(true);
                comm.ajax2({
                    url: path.getResourcePager,
                    type: "get",
                    data: {paramJson:JSON.stringify({
                            "organizationId": t.orgId,
                            "tagId": t.tagIdVal,
                            "pageIndex":t.pageIndex,
                            "pageSize":t.pageSize
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        t.changeLoading(false);
                        if(comm.hasResponseData(res)){//基本信息
                            if(t.fromTag&&t.pageIndex==1){//筛选来源列表
                                t.dataListArr=[];
                            }
                            if(res.responseObject.responseData.dataList
                                &&res.responseObject.responseData.dataList.length>0){//判断有专栏资源列表
                                let items=res.responseObject.responseData.dataList;
                                for (let i = 0; i < items.length; i++){
                                    let kv=items[i];
                                    let json={
                                        resourceName:kv.resourceName,
                                        mpageStoragePath:kv.mpageStoragePath,
                                        resourceId:kv.resourceId,
                                        resourceAuthor:kv.resourceAuthor,
                                        browseNum:kv.browseNum,
                                        publishTime:kv.publishTime&&!$.isEmptyObject(kv.publishTime)?kv.publishTime:'',
                                        qiniuStatus:kv.qiniuStatus,
                                        tagId:kv.tagId
                                    };
                                    if(kv.resourceAtt&&kv.resourceAtt.length>0){
                                        if(kv.resourceAtt[0].resourceAttType==1){
                                            if(kv.qiniuStatus==1){//视频转码中
                                                json.resourceAttUrl="//img50.allinmd.cn/case/videoFormating.jpg";
                                            }else if(kv.qiniuStatus==4){//视频转码失败
                                                json.resourceAttUrl="//img50.allinmd.cn/case/videoFailing.png";
                                            }else{//正常浏览的视频
                                                json.resourceAttUrl=kv.resourceAtt[0].resourceAttUrl;
                                            }
                                        }else{
                                            json.resourceAttUrl=kv.resourceAtt[0].resourceAttUrl;
                                        }
                                        json.resourceAttType=kv.resourceAtt[0].resourceAttType;
                                    }
                                    t.dataListArr.push(json);
                                }
                                if(items.length<20){
                                    t.notMore=true;
                                }else{
                                    t.notMore=false;
                                    t.pageIndex++;
                                    t.scrollList();
                                }
                                t.notListShow=false;//暂无专栏不显示
                                t.totalCount=res.responseObject.responseData.totalCount;//资源数目
                            }else{//专栏资源无列表;
                                if(t.pageIndex==1){//首次请求加载
                                    t.dataListArr=[];
                                    t.notListShow=true;//暂无专栏
                                    t.totalCount=0;//资源数目
                                }else{
                                    t.notMore=true;//没有更多
                                }
                            }
                            if(res.responseObject.responseData.tagList
                                &&res.responseObject.responseData.tagList.length>0) {//判断有专栏筛选标签
                                let tagItems=res.responseObject.responseData.tagList;
                                t.tagListArr=[{
                                    tagName:"全部",
                                    tagId:0
                                }];
                                for (let i = 0; i < tagItems.length; i++) {
                                    let kv=tagItems[i];
                                    let tagJosn={
                                        tagName:kv.tagName,
                                        tagId:kv.tagId
                                    };
                                    t.tagListArr.push(tagJosn);
                                }
                            }else{//无筛选条件
                                if(t.pageIndex==1) {//首次请求加载
                                    t.tagListArr = [];
                                }
                            }
                        }else{//专栏资源无列表
                            t.dataListArr=[];
                            t.tagListArr=[];
                            t.notListShow=true;//暂无专栏
                            t.totalCount=0;//资源数目
                        }
                    }
                });
            },
            //瀑布流滚动加载列表
            scrollList(){
                let t=this;
                let scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.isLoading && !t.notMore&&t.noChangeTab && !window.stopScroll
                            &&location.hash.indexOf("#/")>-1){
                            t.getDataList();
                        }
                    }
                },false);
            }
        },
        mounted() {
            let t = this;
            t.getDataList();//专栏列表
        }
    }
</script>

<style scoped>

</style>