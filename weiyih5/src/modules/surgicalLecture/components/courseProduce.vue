<template>
    <section class="al-view-content">
        <WakeApp :options="wakeData"></WakeApp>
        <div class="al-header-wrapper course">
            <HeaderBar></HeaderBar>
            <figure class="al-course-banner" v-if="picUrl">
                <img :src="picUrl" alt="">
            </figure>
        </div>
        <input type="hidden" id="resourceId" :value="courseId">
        <article class="al-learn-info">
            <p class="al-num">
                <span v-text="studyNum"></span>人次学习
            </p>
            <p class="border"></p>
            <p class="al-num" v-if="courseProgress==anthologyNum">
                {{anthologyNum}}课全
            </p>
            <p class="al-num" v-if="courseProgress!=anthologyNum">
                更新至第<span v-text="courseProgress"></span>课
            </p>
        </article>
        <section class="al-practice-container produce al-course">
            <h1 class="title-bar">
                <i></i>
                适合人群
            </h1>
            <p class="al-course-content" v-text="suitCrowd">
            </p>
            <h1 class="title-bar">
                <i></i>
                课程介绍
            </h1>
            <p class="al-course-content" v-text="courseDesc">
            </p>
            <h1 class="title-bar">
                <i></i>
                讲师介绍
            </h1>
            <p class="al-course-content" v-text="customerDesc">
            </p>
            <h1 class="title-bar" v-if="courseList.length>0">
                <i></i>
                课程表
            </h1>
            <section class="al-course-schedule" v-if="courseList.length>0">
                <ul class="al-course-list">
                    <li class="al-course-item" v-for="(item,index) in courseList">
                        <i class="icon"></i>
                        <p class="title" v-text="(index+1)+'. '+getStrLen(item.anthologyName,62)"></p>
                        <p class="des" v-text="item.refDesc"></p>
                    </li>
                </ul>
            </section>
        </section>
        <section class="al-footerFix">
            <article class="al-learn-handle">
                <p class="al-handle-bar" @click.stop="wakeUpApp('订阅课程')">
                    <span class="stateIcon"></span>
                    订阅课程
                </p>
                <p class="al-handle-bar" @click.stop="studyCourse">
                    进入课程学习
                </p>
            </article>
        </section>

    </section>
</template>
<script>
    const  $ =  require('jquery');
    import HeaderBar from './header';
    import axios from 'axios';
    import comm from 'static/js/comm.js';
    import commApp from 'static/js/comm.app.js';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    export default {
        components:{
            HeaderBar,
            WakeApp
        },
        mounted(){
            let t = this;
            document.title = '课程介绍';
            t.getCourseInfo();
            setTimeout(()=>{
                let amChannel = comm.getpara()._amChannel;
                t.wakeData = {
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?type=1&scene=surgeryColumnScene&columnId="+t.columnId+"&courseId="+t.courseId+"" + (amChannel?"&_amChannel="+amChannel:''),
                    ios9: "http://app.allinmd.cn/applinks.html?type=1&scene=surgeryColumnScene&columnId="+t.columnId+"&courseId="+t.courseId+ (amChannel?"&_amChannel="+amChannel:''),
                    android: "allin://com.allin.social:75235?data={sourceName:"+t.courseName+",scene:3,type:106,columnId:"+t.columnId+",sourceId:"+t.courseId+"" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
                };
            },2000);
        },
        watch:{
            courseName(newVal){
                let t = this;
                if(!comm.checkInvalid(newVal)){
                    let amChannel = comm.getpara()._amChannel;
                    t.wakeData = {
                        el: ".al-newWakeUpAppBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?type=1&scene=surgeryCourseScene&columnId="+t.columnId+"&courseId="+t.courseId+"" + (amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?type=1&scene=surgeryCourseScene&columnId="+t.columnId+"&courseId="+t.courseId+ (amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={sourceName:"+t.courseName+",scene:3,type:106,columnId:"+t.columnId+",sourceId:"+t.courseId+"" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    };
                }
            }
        },
        data(){
          return {
              firstVideoUrl:'',
              suitCrowd:'',
              courseDesc:'',
              customerDesc:'',
              courseList:[],
              courseProgress:'',
              picUrl:'',
              studyNum:'',
              courseName:"",
              anthologyNum:'',
              wakeData:{}
          }
        },
        computed:{
            courseId(){
                let t = this;
                return comm.getpara().courseId;
            },
            customerId(){
                return comm.getpara().customerId;
            },
            columnId(){
                let t = this;
                return comm.getpara().columnId;
            }
        },
        methods:{
            studyCourse(){
              let t = this;
              setTimeout(()=>{
                  g_sps.jump(null,t.firstVideoUrl);
              },500);
            },
            getStrLen(str,num){
                return comm.getStrLen(str,num);
            },
            wakeUpApp(text){
                //唤醒app
                let t = this;
                let amChannel = comm.getpara()._amChannel;
                commApp.newReleaseBox({
                    imgPath:"//img50.allinmd.cn/case/release.png",
                    title:text+"需使用唯医骨科App",
                    solidBtnTitile:"立即使用",
                    authNoneTitle:" ",
                    data:{
                        el: ".solidBtn",
                        ios: "allinmdios://app.allinmd.cn/applinks.html?scene= surgeryCourseScene&columnId="+t.columnId+"&courseId="+t.courseId+"" + (amChannel?"&_amChannel="+amChannel:''),
                        ios9: "http://app.allinmd.cn/applinks.html?scene= surgeryCourseScene&columnId="+t.columnId+"&courseId="+t.courseId+ (amChannel?"&_amChannel="+amChannel:''),
                        android: "allin://com.allin.social:75235?data={type:106,scene:3,sourceId:"+t.courseId+",columnId:"+t.columnId+"" + (amChannel?",_amChannel:"+amChannel:'')+ "}",
                    }
                });
            },
            getCourseInfo(){
                let t = this;
                axios({
                    url: '/mcall/cms/column/config/getCourseAdvertiseData/',
                    method: "POST",
                    data: {
                        courseId:t.courseId,
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
                        t.suitCrowd = res.data.responseObject.responseData.dataList.suitCrowd;
                        t.firstVideoUrl = res.data.responseObject.responseData.dataList.firstVideoUrl;
                        t.courseDesc = res.data.responseObject.responseData.dataList.courseDesc;
                        t.customerDesc = res.data.responseObject.responseData.dataList.customerDesc;
                        t.courseList = res.data.responseObject.responseData.dataList.courseList;
                        t.courseName = res.data.responseObject.responseData.dataList.courseName;
                        t.courseProgress = res.data.responseObject.responseData.dataList.courseProgress;//courseProgress,studyNum
                        t.studyNum = res.data.responseObject.responseData.dataList.studyNum;
                        t.picUrl = res.data.responseObject.responseData.dataList.picUrl;
                        t.anthologyNum = res.data.responseObject.responseData.dataList.anthologyNum;

                    }
                });

            }
        }
    }
</script>
