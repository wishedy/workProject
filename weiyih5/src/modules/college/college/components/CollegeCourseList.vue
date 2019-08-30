<template>
    <section>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="distanceNum">
            <section v-for="(items,index) in relatedContent"
                     :key="index"
                     v-if="(index+1)<=maxLen">
                <div class="college-one">
                    <h3>
                        <!--<em></em>-->
                        {{items.themeName}}
                    </h3>
                </div>
                <div class="courseList"
                     v-for="(item,index) in items.courseList"
                     :key="index"
                     v-if="(index+1)<=maxLen" @click="goCourseDetail(item)">
                    <div class="col-left">
                        <img v-bind:src="item.courseCover" alt="">
                    </div>
                    <div class="col-middle">
                        <h1 class="col-middle-title" v-if="item.courseType == 2">{{item.courseName}}</h1>
                        <h1 class="col-middle-title" v-else style="color:#555">{{item.courseName}}</h1>
                        <h2 class="course-desc" v-if="item.courseType == 2">{{item.courseDesc}}</h2>
                        <h2 class="course-price">
                        <span class="course-price-title">
                            <span v-show="item.courseType==2">
                                {{item.totalNum}}讲
                                <span class="diandian"></span>
                                ¥{{item.coursePrice}}
                            </span>
                            <span v-show="item.courseType==1" style="color:#555">
                                {{item.noticeDesc}}
                            </span>
                        </span>
                            <span class="course-price-content">
                            {{item.courseType==2?`更新至第${item.newestNum}讲`:''}}
                        </span>
                        </h2>
                    </div>
                </div>
            </section>

        </vue-data-loading>
        <loading v-show="loading"></loading>
    </section>
</template>
<script>
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import loading from "components/Loading/Loading.vue";

    const baseIp = 'https://m.allinmd.cn/dist/';

    export default {
        components: {
            VueDataLoading,
            loading
        },
        data() {
            return {
                distanceNum: 200
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
            relatedContent: {
                default: [],
                type: Array
            }
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
            goCourseDetail(item) {
                if(item.courseType==2){
                    window.location.href = baseIp + 'payCourse/payCourse.html#/payCourse?courseId=' + item.courseId;
                }else{
                    popup("课程即将上线，敬请期待")
                }

            }
        },
        mounted(){
            console.log('123131',this.completed);
        }
    }
</script>