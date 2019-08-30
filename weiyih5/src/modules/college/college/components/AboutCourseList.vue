<template>
    <section>
        <div class="row-two-courseList">
            <section class="list-container" v-for="(items,index) in courseList" :key="index">
                <div class="courseList-title">
                    <span class="line"></span>
                    <span class="text">{{items.themeName}}</span>
                    <span class="line"></span>
                </div>
                <ul>
                    <li v-for="(item,index) in items.courseList.slice(0,4)"
                        :key="index"
                        v-if="(index+1)<=maxLen" @click="creatCourseEvent()">
                        <i class="courseType1">
                            <img :src="item.courseCover" alt="">
                        </i>
                        <!--<i class="courseType2" v-show="item.courseType===1"></i>-->
                        <div>
                            <p v-if="item.courseType===2" class="about-course-title"
                               :class="item.courseName?'':'about-course-title-active'" >
                                {{item.courseName?item.courseName:'敬请期待'}}
                            </p>
                            <p v-else class="about-course-title"
                               :class="item.courseName?'':'about-course-title-active'" style="color:#888888">
                                {{item.courseName?item.courseName:'敬请期待'}}
                            </p>
                            <p class="about-course-remark">{{item.courseType===2 ? item.courseDesc: item.noticeDesc}}</p>
                        </div>
                    </li>
                    <li class="course-remark-last" v-show="items.courseList.length>4">
                        已上线{{items.courseList.length}}位讲师课程，持续更新中
                    </li>
                </ul>
            </section>
        </div>
    </section>
</template>
<script>
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import loading from "components/Loading/Loading.vue";
    import comm from 'static/js/comm.js';

    export default {
        components: {
            VueDataLoading,
            loading
        },
        data() {
            return {
                distanceNum: 0
            }
        },
        props: {
            completed: {
                default: false,
                type: Boolean
            },
            loading: {
                default: false,
                type: Boolean
            },
            maxLen: {
                default: 100000,
                type: Number
            },
            courseList: {
                default: [],
                type: Array
            }
        },
        mounted() {
            this.checkApp();
        },
        methods: {
            "infiniteScroll"() {
                let t = this;
                setTimeout(() => {
                    if (!t.completed) {
                        t.$emit("scrollBottom");
                    } else {
                        return false;
                    }
                }, 800)
            },
            creatCourseEvent() {
                if (!this.appPort) {
                    comm.creatEvent({
                        triggerType: '关于学院',
                        triggerName: '讲师头像点击',
                        actionId: 11754,
                        browType: 414,

                    });
                }
            },
            checkApp() {
                let _this = this;
                if (!(typeof appjs == "undefined" || appjs == null || appjs == "")) {
                    _this.appPort = true;
                } else {
                    _this.appPort = false;
                }
            },
        }
    }
</script>