<template>
    <section class="discoverCourse data_list" v-show="list.length>0">
        <aside class="title">猜你喜欢</aside>
        <ul class="courseList like" data-alcode-mod="635">
            <li v-for="(i,v) in list" :data-seriesid="i.courseId"
                data-href="'./discover_seriesDetail.html?tId='+i.courseId" v-show="i.showOnOff">
                <a :href="'./discover_seriesDetail.html?tId='+i.courseId" @mousedown="courseEventCreate(v,i)">
                    <img :src="i.courseCoverPicUrl">
                    <p v-cloak><i></i>{{i.totalLearnNum|toWK}}<span>{{i.catalogNum}}节课</span></p>
                </a>
            </li>
        </ul>
        <aside :class="{courseMore:true,up:tempOnOff}" data-alcode-mod="639" data-alcode="e116" v-show="total>pageSize"
               @click="addPage" @mousedown="moreEventCreate">{{addDes}}<i></i></aside>

    </section>
</template>
<script>
    import {mapActions} from "vuex";

    import axios from "axios"
    import Log from 'static/js/log.js';
    import comm from "static/js/comm.js";

    const xhrUrl = {
        "contentLink": "/mcall/cms/course/getHotCourseList/"
    };
    export default {
        data() {
            return {
                list: [],
                moreOnOff: false,
                pageIndex: 1,
                pageSize: 6,
                tempOnOff: false,
                total: 0
            }
        },
        computed: {
            department() {
                return this.$store.department;
            },
            type() {
                var str = this.$route.path;
                return str.substring(str.length-1,1000);
            },
            addDes() {
                return (this.tempOnOff) ? "收起" : "更多好课";
            }
        },
        methods: {
            ...mapActions(['startLoading','endLoading']),
            resetData(data) {
                let t = this;
                let nowData = JSON.parse(JSON.stringify(data));
                for (let num = 0; num < nowData.length; num++) {
                    if (nowData.length === t.total) {
                        if (num > 5) {
                            nowData[num].showOnOff = t.tempOnOff;
                        } else {
                            nowData[num].showOnOff = true;
                        }

                    } else {
                        nowData[num].showOnOff = true;
                    }
                }
                return nowData;
            },
            resetPage() {
                let t = this;
                t.pageIndex = 1;
                t.tempOnOff = false;
                t.total = 0;
                t.list = [];
            },
            addPage() {
                let t = this;
                if (t.list.length === t.total) {
                    t.tempOnOff = !t.tempOnOff;
                    t.list = t.resetData(t.list);
                } else {
                    t.pageIndex++;
                }
            },
            nowTypeName(type){
                let courseSubjectTeamId = type;
                let desName = '';
                if(courseSubjectTeamId==9) {
                    desName = '创伤';
                }
                if(courseSubjectTeamId==0) {
                    desName = '推荐';
                }
                if(courseSubjectTeamId==7){
                    desName = '脊柱';
                }
                if(courseSubjectTeamId==2){
                    desName = '关节';
                }if(desName.length){
                    return desName;
                }else{
                    return "推荐";
                }
            },
            moreEventCreate(){
                let t = this;
                let str = t.$route.path;
                let courseSubjectTeamId = parseInt(str.substring(str.length-1,1000),10);
                comm.creatEvent({
                    triggerType:'系列课',
                    triggerName:'更多好课',
                    keyword:t.nowTypeName(courseSubjectTeamId)+"更多好课",
                    actionId:11003
                });
            },
            courseEventCreate(i,item){
                let t = this;
                let str = t.$route.path;
                let courseSubjectTeamId = parseInt(str.substring(str.length-1,1000),10);
                comm.creatEvent({
                    triggerType:'系列课',
                    triggerName:'猜你喜欢',
                    keyword:t.nowTypeName(courseSubjectTeamId)+"猜你喜欢",
                    actionId:11002,
                    refId: item.courseId,
                    locationId:i+1
                });
            },
            getList() {
                let t = this;
                t.startLoading();
                axios({
                    url: xhrUrl.contentLink,
                    method: "POST",
                    data: {
                        "isValid": 1,
                        "pageIndex": t.pageIndex,
                        "pageSize": t.pageSize,
                        "sortType": 4,
                        "courseSubjectTeamId": t.type,
                        "platformId": t.department||1
                    },
                    transformRequest: [function (data) {
                        return "paramJson=" + JSON.stringify(data);
                    }],
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    timeout: 30000
                }).then(function (res) {
                    if (res.data.responseObject.responseData.data_size) {
                        t.total = parseInt(res.data.responseObject.responseData.data_size, 10);
                    }
                    let options = {
                        success(res) {
                            if (t.pageIndex === 1) {
                                t.list = res.responseObject.responseData.data_list;
                            } else {
                                t.list = t.list.concat(res.responseObject.responseData.data_list);
                            }
                            t.tempOnOff = (t.total === t.list.length);
                            t.list = t.resetData(t.list);
                            t.endLoading();
                        },
                        failed(res) {
                            if (t.pageIndex === 1) {
                                t.list = [];
                            } else {
                                return false;
                            }

                        }
                    };

                    comm.successRequest(res.data, options);
                });
            }
        },
        watch: {
            "$route"() {
                let t = this;
                let str = this.$route.path;
                let courseSubjectTeamId = parseInt(str.substring(str.length-1,1000),10);
                t.resetPage();
                t.getList();
            },
            pageIndex() {
                let t = this;
                t.getList();
            }
        },
        mounted() {
            let t = this;
            let str = this.$route.path;
            let courseSubjectTeamId = parseInt(str.substring(str.length-1,1000),10);
            t.getList();
        },
        filters: {
            toWK: comm.toWKH
        }
    }
</script>
<style scoped lang="scss">
    .courseMore i {
        background: url('//img50.allinmd.cn/classes/course_directory_unfold.png') no-repeat;
        background-size: contain;
    }
</style>