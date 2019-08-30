<template>

    <div class="course-section-content">
        <section>
            <vue-data-loading :loading="loading"
                              :completed="completed"
                              :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll"
                              :distance="distanceNum">
                <ul>
                    <li v-for="(item,index) in relatedContent" :key="index+'test'">
                        <a :href="checkInvalid(item.webStoragePath)?'javascript:void(0)':item.webStoragePath">
                            <p>{{item.videoName}}</p>
                            <div class="foot-list">
                                <span class="checkAuth">{{getStrLen(item.videoAuthor,10)}}</span>
                                <span class="checkNum">{{item.playNum}}浏览</span>
                                <i class="noPay" v-if="parseInt(item.payType,10)===1">免费</i>
                            </div>
                            <em class="course-replying"></em>

                        </a>
                    </li>
                </ul>
            </vue-data-loading>
            <loading v-show="loading"></loading>
        </section>
    </div>
</template>
<script>
    import comm from 'static/js/comm.js';
    import InfiniteLoading from 'vue-infinite-loading';
    import VueDataLoading from 'components/scroll/vue-data-loading';
    import loading from "components/Loading/Loading.vue";

    export default {
        components: {
            InfiniteLoading,
            VueDataLoading,
            loading
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
            relatedContent: {
                default: [],
                type: Array
            }
        },
        methods: {
            checkInvalid(str) {
                return comm.checkInvalid(str);
            },
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
            getStrLen(str, num) {
                return comm.getStrLen(str, num);
            }
        },
        data() {
            return {
                distanceNum: 0
            }
        }
    }
</script>