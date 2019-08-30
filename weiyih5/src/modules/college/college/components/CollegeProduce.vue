<template>
    <section class="about-college">
        <AboutCourseHead :customerId="customerId"></AboutCourseHead>
        <AboutCourseVideoBanner></AboutCourseVideoBanner>
        <AboutCourseVision></AboutCourseVision>
        <AboutCourseTeamList></AboutCourseTeamList>
        <AboutCourseList :courseList="courseLists"
                         :more="courseConfig.moreOnOff"
                         @scrollBottom="getCourseList"
                         v-if="courseLists.length!==0"
                         :loading="courseConfig.loading"
                         :completed="courseConfig.completed">

        </AboutCourseList>
        <AboutCourseRecruitmentPlan></AboutCourseRecruitmentPlan>
    </section>
</template>
<script>
    import AboutCourseHead from './AboutCourseHead'
    import AboutCourseVideoBanner from './AboutCourseVideoBanner'
    import AboutCourseTeamList from './AboutCourseTeamList'
    import AboutCourseVision from './AboutCourseVision'
    import AboutCourseRecruitmentPlan from './AboutCourseRecruitmentPlan'
    import AboutCourseList from './AboutCourseList'
    import axios from 'axios'
    import TempCache from "static/js/tempcache";
    import user from 'static/js/module.user.js';

    const url = {
        courseListUrl: '/mcall/medicalCollege/getCollegeInfoList/'
    }

    export default {
        components: {
            AboutCourseHead,
            AboutCourseVideoBanner,
            AboutCourseTeamList,
            AboutCourseVision,
            AboutCourseRecruitmentPlan,
            AboutCourseList
        },
        data() {
            return {
                RelatedContent: [],
                player2: null,
                courseLists: [],
                courseConfig: {
                    loading: false,
                    completed: false,
                    pageIndex: 0,
                    pageSize: 1000,
                    moreOnOff: false,
                    totleNum: 50
                },
                appPort: false,
                doctorTeamList: [],
                shareUrl: '',
                customerId: TempCache.getItem('userId'),
            }
        },
        mounted() {
            document.title = '关于学院'
            let t = this;
            t.checkApp();
            if (t.appPort) {
                let coustomId = (appjs && appjs.getAuthorCustomerId());
                if (!coustomId) {
                    appjs && appjs.myWorksPermission();
                } else {

                    t.getRelatedContent();
                    t.getCourseList();
                    t.getDoctorTeamList();
                }
            } else {
                // user.privExecute({
                //     operateType: 'login',
                //     callback: function () {
                //         t.getRelatedContent();
                //         t.getCourseList();
                //         t.getDoctorTeamList();
                //     }
                // });
            }
            //  t.getRelatedContent();
            // t.getCourseList();

        },
        methods: {
            getRelatedContent() {
                let t = this;
                axios({
                    method: 'get',
                    url: '/static/college.banner.json',
                    dataType: "json",
                    crossDomain: true,
                    cache: false
                }).then(res => {
                    t.RelatedContent = res.data.responseObject.responseData.dataList;
                    t.currentData = res.data.responseObject.responseData.dataList[0];
                    console.log(t.RelatedContent);
                }).catch(error => {
                    console.log(error);
                })
            },

            /**
             * 获取课程列表
             * params 无
             */
            getCourseList() {
                let t = this;
                if (!t.courseConfig.loading) {
                    t.courseConfig.loading = true;
                    axios.get(url.courseListUrl, {
                        params: {
                            paramJson: (
                                $.toJSON({
                                    opUsr: t.customerId || '',
                                    firstResult: t.courseConfig.pageIndex,
                                    maxResult: t.courseConfig.pageSize
                                })
                            )
                        }
                    }).then(function (res) {
                        if (res && res.data && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length > 0) {
                            t.shareUrl = res.data.responseObject.responseData.dataList[0].shareImgUrl;
                            t.sendShareUrl(t.shareUrl);
                            t.formatteData(res.data.responseObject.responseData.dataList);
                            t.courseConfig.completed = (t.courseLists.length < t.courseConfig.pageSize || t.courseLists.length > res.data.responseObject.responseData.totalCount);
                            if (!t.courseConfig.completed) {
                                t.courseConfig.pageIndex++;
                            }
                        } else {
                            t.courseConfig.completed = true;
                        }
                        t.courseConfig.loading = false;
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
            },
            formatteData(data) {
                if (this.courseLists.length == 0) {
                    this.courseLists = this.courseLists.concat(data)
                } else {
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < this.courseLists.length; j++) {
                            if (data[i].themeName === this.relatedContent[i].themeName) {
                                this.courseLists[i].courseList = this.courseLists[i].courseList.concat(data[i].courseList)
                            }
                        }
                    }
                }

            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                    _this.customerId = appjs.getAuthorCustomerId();
                    return
                } else {
                    _this.appPort = false;
                    _this.customerId = TempCache.getItem('userId');
                    return
                }
            },
            getDoctorTeamList() {
                let t = this;
                axios({
                    method: 'get',
                    url: '/static/doctor.team.json',
                    dataType: "json",
                    crossDomain: true,
                    cache: false
                }).then(res => {
                    t.doctorTeamList = res.data.responseObject.responseData.dataList;
                    console.log(res);
                }).catch(error => {
                    console.log(error);
                })
            },
            sendShareUrl(shareUrl) {
                if (this.appPort) {
                    appjs && appjs.shareImageUrl($.toJSON({
                        imageUrl: shareUrl
                    }));
                }
            }
        }

    }
</script>
