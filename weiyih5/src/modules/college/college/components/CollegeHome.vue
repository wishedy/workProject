<!--
 * @Description: 一级学院
 * @Author: 丁国庆
 * @Date: 2019-08-07 16:43:59
 * @LastEditTime: 2019-08-21 13:33:24
 * @LastEditors: 丁国庆
 -->
<template>
    <section class="weiyi-college">
        <WakeApp :options="wakeData"></WakeApp>
        <section class="weiyi-college-header">
            <div class="banner swiper-container">
                <section class="swiper-wrapper">
                    <div class="banner-1 swiper-slide" @click.stop="openBanner(item, index)" v-for="(item, index) in bannerList"
                        :style="{background: 'url('+item.bannerUrl+') no-repeat center center/cover'}" :key="index">
                    </div>
                </section>
                <div class="swiper-pagination banner1-account"></div>
            </div>
            <!-- 二级学院入口 -->
            <section class="secondary-college">
                <ul class="seCollegeUl">
                    <li v-for="(opt, index) in secondaryCollegeList" :key="index" @click="openCollegeDetail(opt, index)">
                        <span :style="{ background: `url(${opt.departmentPic}) no-repeat center` }"></span>
                        <span :style="{ color: Number(opt.departmentId) === 0 ? '#aaa' : '' }">{{ opt.departmentName }}</span>
                    </li>
                </ul>
            </section>
        </section>
        <!-- 最新课程 -->
        <section class="latest-member-course">
            <h3>最新课程</h3>
            <ul class="latest-member-course-ul">
                <li v-for="(opt, index) in latestCourseList" :key="index" @click="openLatestCourse(opt, index, '点击唯医学院首页会员课程', 11885, opt.courseId)">
                    <div class="latest-course-img">
                        <img :src="opt.courseCoverPicUrl">
                        <span v-if="Number(opt.vipState) === 1"></span>
                    </div>
                    <div class="latest-course-info">
                        <div class="member-course-top">
                            <p class="member-course-p1">{{ opt.courseName }}</p>
                            <p class="member-course-tip">{{ opt.courseDesc }}</p>
                        </div>
                        <p class="member-course-p2">
                            <span>{{ opt.newestNum }}讲</span>
                            <span :style="{ background: `#${opt.departmentColor}` }">{{ opt.departmentName }}</span>
                        </p>
                    </div>
                </li>
            </ul>
        </section>
        <!-- 专栏课程 -->
        <section class="column-course">
            <h3>专栏课程</h3>
            <ul class="column-course-ul">
                <li v-for="(opt, index) in columnCourseList" :key="index" @click="openLatestCourse(opt, index, '点击唯医学院首页专栏课', 11752, opt.departmentId)">
                    <div class="columnCourse-1" :style="{ background: `url(${opt.courseCoverPicUrl}) no-repeat center` }"></div>
                    <div class="columnCourse-2">
                        <p>{{ opt.courseName }}</p>
                        <p>{{ opt.courseDesc }}</p>
                        <p>
                            <span>{{ opt.newestNum }}讲 <i>&#8226;</i></span>
                            <span>{{ opt.coursePrice }}元</span>
                            <span>更新至{{ opt.totalNum }}讲</span>
                        </p>
                    </div>
                </li>
            </ul>
        </section>
        <!-- 手术实例 -->
        <section class="surgical-example">
            <h3>手术实例</h3>
            <ul class="surgical-example-ul">
                <li v-for="(opt, index) in surgicalExampleList" :key="index" @click="openExample(opt, index)">
                    <div class="surgical-left" :style="{ background: `url(${opt.picUrl})` }">
                        <p>
                            <span class="surgical-example-play"></span>
                            <span class="surgical-example-time">{{ opt.playTime }}</span>
                        </p>
                    </div>
                    <div class="surgical-right">
                        <p class="surgical-title">{{ opt.itemTitle }}</p>
                        <p class="surgical-info">
                            <span>{{ opt.ownerName }}</span>
                            <span>{{ opt.price }}元</span>
                        </p>
                    </div>
                </li>
            </ul>
        </section>
        <Loading v-show="ajaxing"></Loading>
    </section>
</template>
<script>
    import comm from 'static/js/comm.js';
    import axios from 'axios';
    import WakeApp from  'components/WakeApp/WakeApp.vue';
    import CourseImageSwiper from './CourseImageSwiper';
    // import TempCache from "static/js/tempcache";
    import user from 'static/js/module.user.js';
    import Loading from "@/components/Loading/Loading";
    const Api = {
        courseBannerListUrl: '/mcall/medicalCollege/getBannerList/', // 轮播图
        collegeLists: '/allingateway/base-resource-platform/college/getCourseList/', // 学院列表集合
        exampleList: '/allingateway/base-resource-platform/recommend/college/living/example/' // 手术实例列表
    }

    export default {
        data() {
            let androidParam = `{scene:3,type:102}`;
            let iosParam = `scene=3&type=102`;
            return {
                wakeData: {
                    el: ".al-newWakeUpAppBtn",
                    ios: "allinmdios://app.allinmd.cn/applinks.html?"+iosParam,
                    ios9: "http://app.allinmd.cn/applinks.html?"+iosParam,
                    android: "allin://com.allin.social:75235?data="+androidParam
                },
                loading: false,
                completed: false,
                pageIndex: 0,
                pageSize: 50,
                moreOnOff: false,
                relatedContent: [],
                totalNum: 0,
                bannerList: [],
                appPort: false,
                customerId: '',
                secondaryCollegeList: [],
                latestCourseList: [],
                columnCourseList: [],
                surgicalExampleList: [],
                pageConfig: {
                    offset: 0,
                    limit: 20
                },
                noData: false,
                ajaxing: false,
            }
        },
        mounted() {
            document.title = '唯医学院';
            let t = this;
            t.checkApp();

            if (t.appPort) {
                let coustomId = (appjs && appjs.getAuthorCustomerId());
                if (!coustomId) {
                    appjs && appjs.myWorksPermission();
                } else {
                    t.getBannerList();
                }
            } else {
                user.privExecute({
                    operateType: 'login',
                    callback: function () {
                        t.getBannerList();
                    }
                });
            }

            // this.getRelatedContent(); // remove
            this.getBannerList();
            this.getCollegeLists();
            this.getExampleList();
        },
        methods: {
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                    _this.customerId = appjs.getAuthorCustomerId();
                    return
                } else {
                    _this.appPort = false;
                    _this.customerId = localStorage.getItem('userId');
                    return
                }
            },
            scroll () {
                let that = this,
                scrollTop = 0;
                window.addEventListener('scroll', () => {
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    if(scrollTop + document.documentElement.clientHeight > document.documentElement.scrollHeight - 1) {
                        if (!that.noData) {
                            console.log('到达底部')
                            this.ajaxing = true;
                            that.pageConfig.offset += 10;
                            that.getExampleList()
                        }
                    }
                }, false);
            },
            initSwiper() {
                let mySwiper = new Swiper('.swiper-container', {
                    autoplay: 3000,
                    loop: false,
                    pagination: '.swiper-pagination',

                });
            },
            openBanner(e, i) {
                console.log(e);
                this.buriedPoint(11751, '点击唯医学院banner图', i);
                comm.banner.openBanner(e);
            },
            getBannerList() {
                let _this = this;
                axios.get(Api.courseBannerListUrl, {
                    params: {
                        paramJson: JSON.stringify({
                            opUsr: _this.customerId,
                            recommendType: 5
                        })
                    }
                }).then(function (res) {
                    if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList) {
                        _this.bannerList = res.data.responseObject.responseData.dataList;
                        //存在数据
                        console.log(_this.bannerList);
                        setTimeout(() => {
                            _this.initSwiper();
                        }, 300);
                    } else {
                        //没有数据
                    }
                })
            },
            getCollegeLists () {
                axios.get(Api.collegeLists).then((res) => {
                // axios.get("http://dev-gateway.allinmd.cn/base-resource-platform/college/getCourseList/").then((res) => {
                    this.secondaryCollegeList = res.data.responseData.departmentList // 二级学院列表
                    this.latestCourseList = res.data.responseData.departCourseList // 最新课程列表
                    this.columnCourseList = res.data.responseData.seriesCourseList // 专栏课程列表
                    this.secondaryCollegeList.forEach((opt) => {
                        if (Number(opt.departmentId) === 0) {
                            opt.departmentPic = '/static/college/more.png'
                        }
                    })
                })
            },
            getExampleList () {
                console.log(localStorage.getItem("userId"));
                axios.get(Api.exampleList, {
                // axios.get('http://dev-gateway.allinmd.cn/base-resource-platform/recommend/college/living/example/', {
                    params: {
                        customerId: localStorage.getItem("userId"),
                        offset: this.pageConfig.offset,
                        limit: this.pageConfig.limit
                    }
                }).then((res) => {
                    if (res && res.data.responseData && res.data.responseData.dataList && res.data.responseData.dataList.length !== 0) {
                        this.surgicalExampleList = this.surgicalExampleList.concat(res.data.responseData.dataList)
                        this.scroll()
                    } else if (res.data.responseData.dataList && res.data.responseData.dataList.length === 0) {
                        this.noData = true
                    }
                    this.ajaxing = false;
                })
            },
            openCollegeDetail (opt, index) {
                if (Number(opt.departmentId) !== 0) {
                    this.buriedPoint(11884, '点击唯医学院二级学院入口', index, opt.departmentName);
                    this.$router.push({ path: '/collegeDetail', query: { departmentId: opt.departmentId } })
                }
            },
            openLatestCourse (opt, index, keyword, openId, courseId) {
                this.buriedPoint(openId, keyword, index, '', courseId);
                setTimeout(fn => {
                    window.location.href = 'https://m.allinmd.cn/dist/consumeCourse/consumeCourse.html#/home?courseId=' + opt.courseId
                }, 300)
            },
            buriedPoint (openId, description, index, keyword, refId, browseTypeUrl) {
                // let amChannel = comm.getpara()._amChannel;
                let paramsData = {
                    triggerType: '唯医学院首页',
                    triggerName: description,
                    locationId: index,
                    actionId:openId,
                    browType: 413
                }
                if (keyword) {
                    paramsData.keyword = keyword
                }
                if (refId) {
                    paramsData.refId = refId
                }
                if (browseTypeUrl) {
                    paramsData.browseTypeUrl = browseTypeUrl
                }
                console.log(paramsData)
                comm.creatEvent(paramsData);
            },
            openExample (opt, index) {
                this.buriedPoint(11886, '点击唯医首页手术实例视频', index, '', opt.courseId);
                setTimeout(fn => {
                    window.location.href = opt.h5PageUrl
                }, 300)
            }
        },
        components: {
            WakeApp,
            Loading,
            CourseImageSwiper
        }
    }
</script>