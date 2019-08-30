<template>
        <section class="al-view-content">
            <WakeApp :options="wakeData"></WakeApp>
                <div class="al-header-wrapper lecture" ref="wrapper">
                    <HeaderBar style="position: inherit;"></HeaderBar>
                    <article class="al-banner">
                        <h1 class="al-practice-name">
                            {{columnName}}
                            <!--<i class="recommendIcon speakIcon"></i>-->
                        </h1>
                        <div class="al-practice-des surgicalLecture" ref="des">
                            {{cutLen(columnDesc,92)}}
                            <router-link tag="i" :to="{'name':'surgicalLectureProduce','query':{'columnId':columnId,'customerId':customerId}}" class="icon" @click.stop="createEvent"></router-link>
                        </div>
                        <div class="al-practice-info">
                            <span class="num" v-text="studyNum"></span>
                            人次学习&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            共<span class="num" v-text="courseNum"></span>讲
                        </div>
                    </article>
                    <input type="hidden" id="resourceId" :value="columnId">
                </div>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="distanceNum" style="background:#3954AF;">
                <div slot="pull-down-ready">ready to refresh</div>
                <section class="al-practice-container">
                    <section class="al-tab" v-if="tabList.length">
                        <section class="al-tab-list" ref="tabBox">
                            <div class="al-tab-item" v-for="(item,index) in tabList"  :class="{'active':selectedId===index}" @click.stop="changeTab($event,index)" ref="tabItem">
                                <span v-text="item.label"></span>
                                <i></i>
                            </div>
                        </section>
                    </section>

                    <ul class="al-lecture-list">
                        <li class="al-lecture-item" v-for="(item,index) in courseList" :key="index">
                            <router-link :to="{'name':'courseProduce','query':{'courseId':item.courseId,'columnId':columnId,'customerId':customerId}}"   class="al-lecture-logo" tag="figure">
                                <img :src="item.picUrl" alt="">
                                <aside class="bgGray">
                                    <p class="des" v-text="item.courseName"></p>
                                </aside>
                            </router-link>
                            <article class="al-lecture-info" v-if="item.customerList&&item.customerList.length>0">
                                <h3 class="title" :class="{'ellipsis':item.customerList&&item.customerList.length>1}">
                                    <a :href="filterPersonalUrl(innerItem.customerId)"  v-for="(innerItem,innerIndex) in item.customerList" v-text="(innerIndex===item.customerList.length-1)?innerItem.customerName:innerItem.customerName+'/'"></a><i v-show="item.customerList.length===1">·</i><span class="al-company" v-if="item.customerList&&item.customerList.length===1" v-text="cutLen(item.customerList[0]['company'],36)"></span>
                                </h3>
                                <p class="info">
                                    <span class="update" v-if="item.anthologyNum!=item.courseProgress">更新到</span>
                                    <span class="num" v-text="(item.anthologyNum!=item.courseProgress)?item.courseProgress+'课':item.anthologyNum+'全'"></span>
                                </p>
                            </article>
                        </li>
                    </ul>

                </section>
                <div slot="infinite-scroll-loading">loading...</div>
            </vue-data-loading>
                <loading v-show="loading"></loading>
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
        components:{
            HeaderBar,
            VueDataLoading,
            loading,
            WakeApp
        },
        watch:{
            areasExpertiseId(){
                let t = this;
                t.pageIndex = 1;
                t.loading = true;
                t.completed = false;
                t.courseList = [];
                t.getCourseList();
            }
        },
        methods:{
            filterPersonalUrl(cid){
                let t = this;
                if((parseInt(cid,10)===0)||cid.length===0){
                    return 'javascript:void(0)';
                }else{
                    return ((t.customerId==cid))?'/dist/personal/personal_index.html':'/dist/personal/others_index.html?cid='+cid;
                }
            },
            createEvent(){
              let t  = this;
                comm.creatEvent({
                    triggerType: '手术精讲首页',
                    keyword: "进入栏目宣传页",
                    actionId: 11286,
                    refId: t.columnId
                });
            },
            getTabList(){
              let t = this;
                axios({
                    url: '/mcall/cms/column/config/getColumnBaseTab/',
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
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&(!comm.isEmptyObject(res.data.responseObject.responseData))&&res.data.responseObject.responseData.dataList){
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
                      areasExpertiseId:originalData[num]['areasExpertiseId'],
                      label:originalData[num]['areasExpertiseName']
                  };
                  lastData.push(
                      json
                  );
              }
              return lastData;
            },
            changeTab(e,index){
                let t = this;
                t.selectedId = index;
                comm.creatEvent({
                    triggerType: '手术精讲首页',
                    keyword: "tab切换",
                    actionId: 11287,
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
                t.areasExpertiseId = t.tabList[index]['areasExpertiseId'];
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
                    //console.log(res.data);
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
            cutLen(str,num){
              return comm.getStrLen(str,num);
            },
            "infiniteScroll"(){
                let t = this;
                t.pageIndex++;
                t.loading = true;
                setTimeout(() => {
                    t.getCourseList();
                }, 300)
            },
            getCourseList(){
                let t = this;
                axios({
                    url: '/mcall/cms/column/config/getColumnTabCourseList/',
                    method: "POST",
                    data: {
                        areasExpertiseId:t.areasExpertiseId,
                        columnType:'1',
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
                    //console.log(res.data);
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&res.data.responseObject.responseData.dataList){
                        t.loading = false;
                        if(t.courseList.length===0){
                            t.courseList = res.data.responseObject.responseData.dataList;
                        }else{
                            if(res.data.responseObject.responseData.dataList.length===0){
                                t.completed = true;
                            }else{
                                t.courseList = t.courseList.concat(res.data.responseObject.responseData.dataList);
                            }

                        }
                    }else{
                        t.loading = false;
                        t.completed = true;
                    }
                });
            }
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
        created(){
            let t = this;
            setTimeout(()=>{
                //$(t.$refs.wrapper).height($(t.$refs.wrapper).height()+($(t.$refs.des).height()));
            },300);

        },
        data(){
            return {
                wakeData:{},
                translateX:0,
                distanceNum:100,
                pageIndex:1,
                pageSize:10,
                areasExpertiseId:'',
                courseNum:'',
                studyNum:'',
                columnName:"",
                columnDesc:'',
                loading: false,
                completed: false,
                selectedId: 0,
                tabList: [],
                courseList:[],
                options: {
                    activeColor: '#6483E9',
                    activeFontSize:'30px'
                }
            }
        },
        mounted(){
            let t = this;
            t.loading = false;
            //document.title = '手术精讲';
            t.getInfoData();
            t.getTabList();
            t.getCourseList();
            setTimeout(()=>{
                let amChannel = comm.getpara()._amChannel;
                t.wakeData = {
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?type=1&scene=surgeryColumnScene&columnId="+t.columnId + (amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?type=1&scene=surgeryColumnScene&columnId="+t.columnId+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:2,type:83,sourceId:"+t.columnId+ "}"
                };
                //alert(t.wakeData);
            },1000);
        }
    }
</script>
