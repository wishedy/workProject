<template>
    <section class="al-view-content">
        <WakeApp :options="wakeData"></WakeApp>
        <div class="al-header-wrapper course">
            <HeaderBar></HeaderBar>
            <figure class="al-course-banner" v-if="picUrl">
                <img :src="picUrl" alt="">
            </figure>
        </div>
        <input type="hidden" id="resourceId" :value="columnId">
        <section class="al-practice-container produce">
            <h1 class="title-bar">
                <i></i>
                课程介绍
            </h1>
            <p class="al-course-content" v-text="columnDesc">
            </p>
            <h1 class="title-bar">
                <i></i>
                已有课程
            </h1>
            <ul class="al-lecture-list">
                <li class="al-lecture-item" v-for="(item,index) in courseList" :key="index">
                    <router-link tag="figure" :to="{'name':'courseProduce','query':{'courseId':item.courseId,'columnId':columnId,'customerId':customerId}}"  class="al-lecture-logo">
                        <img :src="item.picUrl" alt="">
                        <p class="des" v-text="item.courseName">
                        </p>
                        <div class="mask"></div>
                    </router-link>
                    <article class="al-lecture-info" v-if="item.customerList&&item.customerList.length>0">
                        <h3 class="title" :class="{'ellipsis':item.customerList.length>1}">
                            <a :href="filterPersonalUrl(innerItem.customerId)"  v-for="(innerItem,innerIndex) in item.customerList" v-text="(innerIndex===item.customerList.length-1)?innerItem.customerName:innerItem.customerName+'/'"></a><i v-show="item.customerList.length===1">·</i><span class="al-company" v-if="item.customerList.length===1" v-text="cutLen(item.customerList[0]['company'],36)"></span>
                        </h3>
                        <p class="info">
                            <span class="update" v-if="item.anthologyNum!=item.courseProgress">更新到</span>
                            <span class="num" v-text="(item.anthologyNum!=item.courseProgress)?item.courseProgress+'课':item.anthologyNum+'全'"></span>
                        </p>
                    </article>
                </li>
            </ul>
        </section>
    </section>
</template>
<script>
    const  $ =  require('jquery');
    import HeaderBar from './header';
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        components:{
            HeaderBar,
            WakeApp
        },
        methods:{
            share(){
                let t = this;
                let shareObj ={};
                shareAll({
                    fnMessageSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence:"",
                            shareChannel: 4,
                            shareContent: shareObj.wxTitle
                        });
                    },
                    fnTimelineSuc: function () {
                        comm.shareLog({
                            shareType: "",
                            resourceId: "",
                            resourceType: "",
                            refId: "",
                            isValid: 1,
                            shareSence: "",
                            shareChannel: 5,
                            shareContent: shareObj.timeLineTitle
                        });
                    },
                    qShareLog: function (x) {
                        if (x === 'qzone') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 1,
                                shareContent: shareObj.summary
                            });
                        } else if (x === 'sina') {
                            comm.shareLog({
                                shareType: "",
                                resourceId: "",
                                resourceType: "",
                                refId: "",
                                isValid: 1,
                                shareSence: "",
                                shareChannel: 3,
                                shareContent: shareObj.sinaTitle
                            });
                        }
                    },
                    triggerRequest:function(){
                        $.ajax({
                            url:"/mcall/comm/data/share/getMapList3/",
                            data: {
                                paramJson: JSON.stringify(t.createShareData())
                            },
                            type: "post",
                            async:false,
                            dataType:"json",
                            success:function(data){
                                if(comm.hasResponseData(data)){
                                    var sList = data.responseObject.responseData.data_list[0].share_channel;
                                    shareObj = {
                                        title: '',
                                        summary: '',
                                        sinaTitle: '',
                                        wxTitle: '',
                                        wxDesc: '',
                                    };
                                    shareObj.pic = data.responseObject.responseData.data_list[0].share_comm.shareImageUrl;
                                    $(sList).each(function (index, element) {
                                        if (element.shareChannel === 'QZone') {
                                            shareObj.title = element.shareTitle;
                                            shareObj.summary = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'Sina') {
                                            shareObj.sinaTitle = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatFriend') {
                                            shareObj.wxTitle = element.shareTitle;
                                            shareObj.wxDesc = element.shareDesc;
                                        }
                                        if (element.shareChannel === 'WechatTimeline') {
                                            shareObj.timeLineTitle = element.shareTitle;
                                        }

                                    });

                                }
                            }
                        });
                        return shareObj;
                    }
                }, false, $(t.$refs.evShare));
            },
            createShareData(){
                let t = this;
                let json = {};
                let routeName = t.$route.name;
                switch (routeName) {
                    case 'surgicalPractice':
                        json = {
                            sceneType:'80',
                            columnId:t.columnId,
                            customerId:t.customerId,
                            columnType:'2'
                        };
                        break;
                    case 'surgicalLecture':
                        json = {
                            sceneType:'80',
                            columnId:t.columnId,
                            customerId:t.customerId,
                            columnType:'1'
                        };
                        break;
                    case 'surgicalLectureProduce':
                        json = {
                            sceneType:'81',
                            columnId:t.columnId,
                            customerId:t.customerId
                        };
                        break;
                    case 'courseProduce':
                        json ={
                            sceneType:'82',
                            columnId:t.columnId,
                            courseId:t.courseId,
                            customerId:t.customerId
                        };
                        break;
                }
                return json;
            },
            cutLen(str,num){
                return comm.getStrLen(str,num);
            },
                goBack(){
                let t = this;
                if(window.history.length>1){
                    t.$router.go(-1);
                }else{
                    g_sps.jump(null,'/');
                }
            },
            filterPersonalUrl(cid){
                let t = this;
                if((parseInt(cid,10)===0)||cid.length===0){
                    return 'javascript:void(0)';
                }else{
                    return ((t.customerId==cid))?'/dist/personal/personal_index.html':'/dist/personal/others_index.html?cid='+cid;
                }
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
                        t.picUrl = mapData.picUrl;
                    }
                });
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
                    if(res&&res.data&&res.data.responseObject&&res.data.responseObject.responseData&&(!comm.isEmptyObject(res.data.responseObject.responseData))&&res.data.responseObject.responseData.dataList){
                        t.courseList = res.data.responseObject.responseData.dataList;
                    }
                });
            }
        },
        data(){
            return{
                courseList:[],
                pageSize:1000,
                pageIndex:1,
                columnDesc:'',
                picUrl:'',
                wakeData:{}
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
        mounted(){
            let t = this;
            document.title = '手术精讲';
            //t.share();
            t.getInfoData();
            t.getCourseList();
            t.share();
            setTimeout(()=>{
                let amChannel = comm.getpara()._amChannel;
                t.wakeData = {
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?type=2&scene=surgeryColumnIntroduceScene&columnId="+t.columnId+"" + (amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?type=2&scene=surgeryColumnIntroduceScene&columnId="+t.columnId+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={scene:3,type:107,columnId:"+t.columnId+ "}",
                };
            },1000);
        }
    }
</script>
