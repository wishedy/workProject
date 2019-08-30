<template>
    <section class="al-view-content">
        <WakeApp :options="wakeData"></WakeApp>
        <div class="al-header-wrapper operate" ref="wrapper">
            <HeaderBar style="position:inherit;"></HeaderBar>
            <input type="hidden" id="resourceId" :value="columnId">
            <article class="al-banner">
                <h1 class="al-practice-name">{{columnName}}
                    <!--<i class="recommendIcon operateIcon"></i>-->
                </h1>
                <div class="al-practice-des" ref="des">
                    {{cutLen(columnDesc,194)}}
                </div>
                <div class="al-practice-info  al-operate-info">
                    <span class="num" v-text="studyNum"></span>
                    人次浏览&nbsp;&nbsp;
                    共<span class="num" v-text="courseNum"></span>个视频
                </div>
            </article>
        </div>
        <vue-data-loading :loading="loadingOnOff" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum" style="background: #1A9EA7;">
            <div slot="pull-down-ready">ready to refresh</div>
        <section class="al-practice-container al-operate-container">
            <section class="al-tab" v-if="tabList.length">
                <section class="al-tab-list" ref="tabBox">
                    <div class="al-tab-item" v-for="(item,index) in tabList"  :class="{'active':selectedId===index}" @click.stop="changeTab($event,index)" ref="tabItem">
                        <span v-text="item.label"></span>
                        <i></i>
                    </div>
                </section>
            </section>
            <ul class="al-practice-list">
                <li class="al-practice-item" v-for="(item,index) in videoList">
                    <div class="al-practice-info">
                        <a :href="(item.videoUrl).length?item.videoUrl:'javascript:void(0)'"  target="_self"  class="title" v-text="cutLen(item.videoName,42)">
                        </a>
                        <p class="info">
                            <span class="nameList" v-if="item.customerList&&item.customerList.length>0">
                                <a :class="{'normal':item.customerList.length>0}" v-for="(innerItem,innerIndex) in item.customerList"  v-if="innerIndex<2" :href="filterPersonalUrl(innerItem.customerId)" target="_self">{{innerItem.customerName}}<i v-if="innerIndex<1&&item.customerList.length>1">；</i>
                            </a>
                            </span>
                            <span>{{toWK(item.playNum)}}浏览</span>
                        </p>
                    </div>
                    <a class="al-practice-logo" :href="(item.videoUrl).length?item.videoUrl:'javascript:void(0)'"  target="_self">
                        <img class="al-img-banner" :src="item.picUrl" alt="">
                        <i class="playIcon"></i>
                    </a>
                </li>
            </ul>
        </section>
        </vue-data-loading>
        <loading v-show="loadingOnOff"></loading>
    </section>
</template>
<script>
    const  $ =  require('jquery');
    import HeaderBar from './header';
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import VueDataLoading from 'components/scroll/vue-data-loading.vue';
    import loading from "components/Loading/Loading.vue";
    import WakeApp from  'components/WakeApp/WakeApp.vue'
    export default {
        methods:{
            cutLen(str,num){
                return comm.getStrLen(str,num);
            },
            getTabList(){
                let t = this;
                axios({
                    url: '/mcall/cms/column/config/getColumnTabList/',
                    method: "POST",
                    data: {
                        columnId:t.columnId,
                        customerId:t.customerId
                    },
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList){
                        t.tabList = t.formatTabList(res.data.responseObject.responseData.dataList);

                    }
                });
            },
            formatTabList(data){
                let t = this;
                let originalData = JSON.parse(JSON.stringify(data));
                let lastData = [];
                for(let num = 0;num<originalData.length;num++){
                    let json = {
                        propertyId:originalData[num]['propertyId'],
                        label:originalData[num]['propertyName']
                    };
                    lastData.push(
                        json
                    );
                }
                return lastData;
            },
            toWK(num){
                return comm.toWKH(num);
            },
            getInfoData(){
                let t = this;
                axios({
                    url: '/mcall/cms/column/config/getColumnCourseBaseData/',
                    method: "POST",
                    data: {
                        columnId:t.columnId,
                        customerId:t.customerId
                    },
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataMap){
                        let mapData = res.data.responseObject.responseData.dataMap;
                        t.columnDesc = mapData.columnDesc;
                        t.columnName = mapData.columnName;
                        document.title = t.cutLen(t.columnName,10);
                        t.courseNum = mapData.courseNum;
                        t.studyNum = mapData.studyNum;
                    }
                });
            },
            changeTab(a,index){
                let t = this;
                t.selectedId = index;
                comm.creatEvent({
                    triggerType: '手术实操首页',
                    keyword: "tab切换",
                    actionId: 11292,
                    locationId: parseInt(index,10)+1,
                    refId: t.columnId
                });
                setTimeout(()=>{
                    let middleX = $(t.$refs.tabBox).width()/2;
                    let itemWidth = $(".active").width()/2;
                    let itemLeft = $(".active").offset().left;
                    let scrollLeft = $(t.$refs.tabBox).scrollLeft();
                    $(t.$refs.tabBox).animate({
                        scrollLeft:scrollLeft+(itemLeft-middleX)+itemWidth
                    });
                },300);
                t.propertyId = t.tabList[index]['propertyId'];
            },
            filterPersonalUrl(cid){
                let t = this;
                if((parseInt(cid,10)===0)||cid.length===0){
                    return 'javascript:void(0)';
                }else{
                    return ((t.customerId==cid))?'/dist/personal/personal_index.html':'/dist/personal/others_index.html?cid='+cid;
                }
            },
            "infiniteScroll"(){
                let t = this;
                t.pageIndex++;
                t.loadingOnOff = true;
                setTimeout(() => {
                    t.getCourseList();
                }, 300)
            },
            getCourseList(){
                let t = this;
                axios({
                    url: '/mcall/cms/column/config/getColumnTabVideoList/',
                    method: "POST",
                    data: {
                        propertyId:t.propertyId,
                        "pageIndex": t.pageIndex ,
                        "pageSize": t.pageSize,
                        columnId:t.columnId,
                        customerId:t.customerId
                    },
                    transformRequest: [function(data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function(res){
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&(!comm.isEmptyObject(res.data.responseObject.responseData))&&res.data.responseObject.responseData.dataList){
                        t.firstLoading = true;
                        t.loadingOnOff = false;
                        if(t.videoList.length===0){
                            t.videoList = res.data.responseObject.responseData.dataList;
                        }else{
                            if(res.data.responseObject.responseData.dataList.length===0){
                                t.completed = true;
                            }else{
                                t.videoList = t.videoList.concat(res.data.responseObject.responseData.dataList);
                            }

                        }
                    }else{
                        t.loadingOnOff = false;
                        t.completed = true;
                    }
                });
            }

        },
        watch:{
            propertyId(){
                let t = this;
                t.pageIndex = 1;
                t.loadingOnOff = true;
                t.completed = false;
                t.videoList = [];
                t.getCourseList();
            }
        },
        mounted(){
            let t = this;
            //document.title = '手术实操';
            t.getInfoData();
            t.getTabList();
            t.getCourseList();
            setTimeout(()=>{
                let amChannel = comm.getpara()._amChannel;
                t.wakeData = {
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?type=2&scene=surgeryColumnScene&columnId="+t.columnId + (amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?type=2&scene=surgeryColumnScene&columnId="+t.columnId+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:2,type:85,sourceId:"+t.columnId+ "}",
                };
            },1000);
        },
        created(){
          let t = this;
          setTimeout(()=>{
              //$(t.$refs.wrapper).height($(t.$refs.wrapper).height()+($(t.$refs.des).height()));
          },300);
        },
        computed:{
            columnId(){
                let t = this;
                return comm.getpara().columnId;
            },
            customerId(){
                return comm.getpara().customerId;
            }
        },
        data(){
            return {
                wakeData:{},
                firstLoading:false,
                distanceNum:100,
                loadingOnOff:false,
                completed:false,
                pageIndex:1,
                pageSize:10,
                courseNum:'',
                studyNum:'',
                columnName:"",
                columnDesc:'',
                selectedId: 0,
                propertyId:'',
                tabList:[],
                videoList:[],
                options: {
                    activeColor: '#6483E9',
                    activeFontSize:'30px'
                },
                index:0
            }
        },
        components:{
            HeaderBar,
            VueDataLoading,
            loading,
            WakeApp
        }
    }
</script>
