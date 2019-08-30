<template>
    <section class="discoverV2" data-alcode-mod="727" v-cloak>
        <section class="columnListDown" v-for="(v,i) in dataList" :key="i">
            <!--系列课-->
            <section class="goingActivity" v-if="v.itemType==2">
                <section class="course" :course-id="v.itemId">
                    <aside class="courseLeft ">
                        <a :href="'./discover_series.html?tId='+v.itemId">
                            <p class="courseTitle">{{v.itemTitle}}</p>
                            <p class="courseNum"><span>{{v.itemGroup,12 | cut}}系列课</span><i>{{v.catalogNum}}节课</i><b>{{v.resourceNum}}个资源</b></p>
                        </a>
                    </aside>
                    <aside class="courseRight" @click="collection(v.isCollection,v.itemTitle,v.itemId,i)"><button class="active" v-if="v.isCollection==1">已收藏</button><button v-if="v.isCollection==0">收藏</button></aside>
                </section>
                <aside class="goingTime">
                    <ul class="text">
                        <li class="timer"><i></i>{{v.recommendDate | times}}</li>
                        <li class="viewNum"><i></i>{{v.browseNum | toWKH}}</li>
                    </ul>
                    <div class="hotActivity" @click="enter(v.itemType)">
                        <a href="./discover_series.html">系列课<i></i></a>
                        <span class="promptDetail" v-if="i==0" v-show="guide" @click.stop><img src="//img50.allinmd.cn/v3/discover/prompt03.png"></span>
                    </div>
                </aside>
            </section>
                <!--热门活动-->
            <section class="goingActivity" v-if="v.itemType==3">
                <figure class="goingImg"><a :href="v.itemUrl">
                    <img :src="v.picUrl"></a>
                    <i :class="type(v.state)"><img :src="url(v.state)" alt=""></i>
                </figure>
                <p class="goingText">
                    <a :href="v.itemUrl">{{v.itemTitle}}</a>
                </p>
                <aside class="goingTime">
                    <ul class="text">
                        <li class="timer"><i></i>{{v.recommendDate | times}}</li>
                    </ul>
                    <div class="hotActivity" @click="enter(v.itemType)">
                        <a href="./discover_hotActivity.html">热门活动<i></i></a>
                        <span class="promptDetail" v-if="i==0" v-show="guide"><img src="//img50.allinmd.cn/v3/discover/prompt03.png"></span>
                    </div>
                </aside>
            </section>
            <!--特色栏目-->
            <section class="goingActivity" v-if="v.itemType==1">
                <section class="columnLeftRight">
                    <figure class="ads">
                        <a :href="'./discover_columnDetail.html?columnId='+v.itemId">
                            <img :src="v.picUrl">
                        </a>
                    </figure>
                    <aside class="textCont">
                        <div>
                            <a :href="'./discover_columnDetail.html?columnId='+v.itemId"><span class="itemTitle">{{v.itemTitle}}</span></a>
                            <button class="Ev-FollowBtn" :follow-id="v.itemId" v-if="v.isFollow==0" @click="follow(v.isFollow,v.itemTitle,v.itemId,i)">关注</button><button class="Ev-FollowBtn active" :follow-id="v.itemId" v-if="v.isFollow==1" @click="follow(v.isFollow,v.itemTitle,v.itemId,i)">已关注</button>
                        </div>
                        <p class="describe">
                            <a :href="'./discover_columnDetail.html?columnId='+v.itemId">{{v.itemGroup}}</a>
                        </p>
                        <p class="introduction"><a :href="'./discover_columnDetail.html?columnId='+v.itemId">{{v.content,28 | cut}}</a></p>
                    </aside>
                </section>
                <aside class="goingTime">
                    <ul class="text">
                        <li class="timer"><i></i>{{v.recommendDate | times}}</li>
                    </ul>
                    <div class="hotActivity"  @click="enter(v.itemType)">
                        <a href="./discover_featureColumn.html">特色栏目<i></i></a>
                        <span class="promptDetail" v-if="i==0" v-show="guide"><img src="//img50.allinmd.cn/v3/discover/prompt03.png"></span>
                    </div>
                </aside>
            </section>
            <!--推荐专题-->
            <section class="goingActivity" v-if="v.itemType==4">
                <figure class="goingImg">
                    <a :href="v.itemUrl">
                        <img :src="v.picUrl">
                    </a>
                    <span>{{v.itemGroup | subjectState}}</span>
                </figure>
                <p class="goingText">
                    <a :href="v.itemUrl">{{v.itemTitle}}</a>
                </p>
                <aside class="goingTime">
                    <ul class="text">
                        <li class="timer"><i></i>{{v.recommendDate | times}}</li>
                    </ul>
                    <div class="hotActivity"  @click="enter(v.itemType)">
                        <a href="./discover_subject.html">推荐专题<i></i></a>
                    </div>
                </aside>
            </section>
            <!--推荐标签-->
            <section class="goingActivity" v-if="v.score">
                <ul class="tagList">
                    <li v-for="(value,index) in v.score" :key="index">
                        <a :href="'./discover_tagSubject.html?tId='+value.propertyId" :tagid="value.propertyId">{{value.propertyName,18 | cut}}<span>{{value.resourceNum}}</span></a>
                    </li>
                </ul>
                <aside class="goingTime">
                    <div class="hotActivity">
                        <span style="margin-right:0.37rem">推荐标签</span>
                    </div>
                </aside>
            </section>
            <!--没有更多-->
            <section class="lastTime" v-if="i==end" v-show="noData">~  没有更多了  ~</section>
        </section>
        <Loading v-show="ajaxing"></Loading>
        <Popup :popup-config="popupConfig"></Popup>
    </section>
</template>

<script>
    import Vue from "vue";
    import axios from "axios";
    import comm from "static/js/comm";
    import date from "static/js/comm.date.js";
    import Popup from "components/PopupLayer/PopupLayer";
    import Loading from "components/Loading/Loading.vue";
    import TempCache from "static/js/tempcache";
    import {mapActions} from "vuex";
    import user from "static/js/module.user";
    const path = {
        info:"/mcall/recommend/discover/item/getMapListByDiscover/",    //发现详情
        recomendTags:"/mcall/recommend/customer/tag/json_list/",        //推荐标签
        collectioned: "/mcall/customer/collection/create/",             //收藏
        cancel:"/mcall/customer/collection/delete/",                    //取消收藏
        follow:"/mcall/customer/follow/resource/create/",               //关注
        cancelFollow:"/mcall/customer/follow/resource/delete/"          //取消关注
    };
    const customerId = TempCache.getItem('userId')||"";
    const platformId = TempCache.getItem('department')||1;
    export default {

        data(){
            return {
                dataList:[],
                score:0,
                index:1,
                onOff:false,
                ajaxing:true,
                noData:false,
                labelList:[],
                tagScore:0,
                count:1,    //记录加载在次数
                tagNum:0,
                guide:false,  //引导是否展示
                refName:'',
                id:'',
                i:'',
                end:Number,
                popupConfig:{},
                labelIndex:1
            }
        },
        methods:{
            content(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url: path.info,
                    method: "POST",
                    data:{
                        "score": t.score,
                        "flag":1,
                        "visitSiteId":2,
                        platformId,
                        "pageIndex":t.index,
                        "pageSize":10,
                        customerId
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
                    if (res && res.data.dataJson && res.data.dataJson.responseData && !$.isEmptyObject(res.data.dataJson.responseData)) {
                        let dataList = res.data.dataJson.responseData.data_list;
                        let scoreList = res.data.dataJson.responseData.score_list;
                        if(dataList.length>0) {
                            if(scoreList && scoreList.length>0){
                                t.score = scoreList[0].minRecommendTime;
                            }
                        }
                        t.dataList = t.dataList.concat(dataList);
                        t.index++;
                        if(dataList.length<10){
                            t.noData = true;
                            t.end = t.dataList.length;
                        }
                        t.label();
                    }else{
                        t.noData = true;
                        t.end = t.dataList.length-1;
                    }
                },res=>{
//                    console.log('res错误执行·········');
                })
            },
            label(){
                let t = this;
                t.ajaxing = true;
                axios({
                    url: path.recomendTags,
                    method: "POST",
                    data:{
                        "score": t.tagScore,
                        "flag":1,
                        "visitSiteId":2,
                        platformId,
                        "pageIndex":t.labelIndex,
                        "pageSize":10,
                        customerId
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
                        let dataList = res.data.responseObject.responseData.data_list;
                        let scoreList = res.data.responseObject.responseData.score_list;
                        t.tagNum++;
                        t.labelIndex++;
                        if(t.count==0){
                            t.dataList.splice(5,0,{"score":dataList})
                        }else{
                            t.dataList.splice((4 +t.count+(t.tagNum-1)*10),0,{"score":dataList})
                        }
                        t.count++;
                        if(dataList.length>0) {
                            if(scoreList && scoreList.length>0){
                                t.tagScore = scoreList[0].minRecommendTime;
                            }
                        }
                    }else{
                        t.noData = true;
                        t.end = t.dataList.length-1;
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
                            t.content();
                        }
                    }
                },false);
            },
            type(n){
                let type = "";
                switch(parseInt(n)){
                    case 1:
                        type = "new"; break;
                    case 2:
                        type = "hot"; break;
                    case 3:
                        type = "going"; break;
                    case 4:
                        type = "goEnd"; break;
                }
                return type;
            },
            url(n){
                let img = "";
                switch(parseInt(n)){
                    case 1:
                        img = "//img50.allinmd.cn/pages/discover/mark_hot.png"; break;
                    case 2:
                        img = "//img50.allinmd.cn/pages/discover/mark_new.png"; break;
                    case 3:
                        img = "//img50.allinmd.cn/pages/discover/mark_living_now.png"; break;
                    case 4:
                        img = "//img50.allinmd.cn/pages/discover/review.png"; break;
                }
                return img;
            },
            collection(collect,keyword,id,i){
                let t =this;
                if (collect!=1) {
                    user.privExecute({
                        operateType: 'auth',
                        noNeedBack:true,
                        callback: function () {
                            t.ajaxing = true;
                            comm.creatEvent({
                                triggerType:'收藏',
                                actionId:82,
                                keyword,
                                push_message_id:id,
                                location_id:i,
                                async:false
                            });
                            axios({
                                url:path.collectioned,
                                method:"POST",
                                data:{
                                    "collectionType": "18",
                                    "refId": id,
                                    customerId
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
                                if(res.data.responseObject.responseStatus == true){
                                    t.dataList[i].isCollection = 1;
                                    this.popupConfig = JSON.stringify({
                                        "msg":"收藏成功",
                                        "seen":true,
                                        "time":1500,
                                    });
                                    setTimeout(function () {
                                        t.popupConfig = JSON.stringify({
                                            "msg":"收藏成功",
                                            "seen":false,
                                            "time":3000      //这里可以设置多少毫秒消失
                                        });
                                    },100);
                                }
                            })
                        }
                    });
                } else {
                    t.ajaxing = true;
                    comm.creatEvent({
                        triggerType:'收藏',
                        actionId:82,
                        keyword,
                        push_message_id:id,
                        location_id:i,
                        async:false
                    });
                    axios({
                        url:path.cancel,
                        method:"POST",
                        data:{
                            "collectionType": "18",
                            "refId": id,
                            customerId
                        },
                        transformRequest: [data=>{
                            return  "paramJson=" + JSON.stringify(data);
                        }],
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        timeout: 30000
                    }).then(res=>{
                        t.ajaxing = false;
                        if(res.data.responseObject.responseStatus == true){
                            t.dataList[i].isCollection = 0;
                            this.popupConfig = JSON.stringify({
                                "msg":"取消收藏成功",
                                "seen":true,
                                "time":1500,
                            });
                            setTimeout(function () {
                                t.popupConfig = JSON.stringify({
                                    "msg":"取消收藏成功",
                                    "seen":false,
                                    "time":1500      //这里可以设置多少毫秒消失
                                });
                            },100);
                        }
                    })
                }
            },
            follow(follow,refName,id,i) {
                let t = this;
                t.refName = refName;
                t.id=id;
                t.i = i;
                if (follow != 1) {
                    user.privExecute({
                        operateType: 'auth',
                        noNeedBack:true,
                        callback: function () {
                            t.ajaxing = true;
                            comm.creatEvent({
                                triggerType: '关注',
                                refName:t.refName,
                                actionId: 11022,
                                push_message_id: t.id,
                                browsetype: 43
                            });
                            axios({
                                url: path.follow,
                                method: "POST",
                                data: {
                                    "refId": t.id,
                                    "followType": "8",
                                    refName:t.refName,
                                    customerId
                                },
                                transformRequest: [data=>{
                                    return "paramJson=" + JSON.stringify(data);
                                }],
                                headers: {
                                    'X-Requested-With': 'XMLHttpRequest'
                                },
                                timeout: 30000
                            }).then(res => {
                                t.ajaxing = false;
                                if (res && res.data.responseObject.responseStatus == true) {
                                    t.dataList[t.i].isFollow = 1;
                                    this.popupConfig = JSON.stringify({
                                        "msg":"已关注",
                                        "seen":true,
                                        "time":1500,
                                    });
                                    setTimeout(function () {
                                        t.popupConfig = JSON.stringify({
                                            "msg":"已关注",
                                            "seen":false,
                                            "time":1500      //这里可以设置多少毫秒消失
                                        });
                                    },100);
                                }
                            })
                        }
                    });
                } else {
                    t.change(true);
                }
            },
            enter(type){
                let str = String;
                switch(parseInt(type)){
                    case 2:
                        str = "系列课"; break;
                    case 3:
                        str = "热门活动"; break;
                    case 1:
                        str = "特色栏目"; break;
                    case 4:
                        str = "推荐专题"; break;
                }
                comm.creatEvent({
                    triggerType:'发现页到列表页入口',
                    keyword:str,
                    actionId:11037
                });
                this.guide = false;
                TempCache.setItem('firstTag','true');
            },
            ...mapActions(["change","changeEn"]),
        },
        mounted(){
            this.content();
            this.scroll();
        },
        filters:{
            toWKH:value=>comm.toWKH(value),
            times:v1=>date.thirdRule(v1,date.local_time()),
            cut:(v1,v2)=>comm.getStrLen(v1,v2),
            subjectState:(v1)=>{
                let subjectState ="";
                switch (parseInt(v1)) {
                    case 0:
                        subjectState = "待分组"; break;
                    case 1:
                        subjectState = "基础骨病"; break;
                    case 2:
                        subjectState = "骨科技术"; break;
                    case 3:
                        subjectState = "精品栏目"; break;
                    case 4:
                        subjectState = "特色专题"; break;
                }
                return subjectState;
            }
        },
        components:{
            Loading,
            Popup,
        },
        watch:{
            "$store.state.isEnsure"(){
                if(this.$store.state.isEnsure){
                    this.ajaxing = true;
                    comm.creatEvent({
                        triggerType: '关注',
                        refName:this.refName,
                        push_message_id: this.id,
                        actionId: 11022,
                        browsetype: 43
                    });
                    axios({
                        url:path.cancelFollow,
                        method:"POST",
                        data:{
                            refId: this.id,
                            followType: "8",
                            refName:this.refName,
                            customerId
                        },
                        transformRequest:[data=>{
                            return "paramJson=" + JSON.stringify(data);
                        }],
                        headers:{
                            'X-Request-Width':'XMLHttpRequest'
                        },
                        timeout:30000
                    }).then(res=>{
                        this.ajaxing = false;
                        if (res && res.data.responseObject && res.data.responseObject.responseStatus) {
                            this.dataList[this.i].isFollow = 0;
                        }
                        this.changeEn(false);
                    })
                }
            }
        }
    }
</script>

<style>
    [v-cloak]{
        display:none;
    }
</style>