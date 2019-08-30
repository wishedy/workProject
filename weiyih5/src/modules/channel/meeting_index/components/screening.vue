<template>
    <section class="screenCont">
        <!--筛选弹层开始-->
        <ScreenPop></ScreenPop>
        <!--筛选弹层结束-->
        <!--筛选无结果开始-->
        <section class="screenNone" v-if="noScreenRe"><img
                src="//img50.allinmd.cn/meeting/meeting_index/search_noresult.png"
                webpSrc="//img50.allinmd.cn/meeting/meeting_index/search_noresult.webp"></section>
        <!--筛选无结果结束-->
        <!--页面主列表开始-->
        <MainList v-if="!noScreenRe" :conListArr="conListArr" :totalNum="totalNum"></MainList>
        <!--页面主列表结束-->
        <Loading v-if="loading"></Loading>
    </section>
</template>

<script>
    import MainList from "components/ConferenceList/conferenceList.vue"
    import TempCache from "static/js/tempcache.js"
    import comm from "static/js/comm.js"
    import commdate from "static/js/comm.date.js"
    import {mapActions, mapGetters} from "vuex"
    import Loading from 'components/Loading/Loading.vue'
    import ScreenPop from "./screenPop.vue"
    const xhlUrl = {
        getMapListV4Url: '/mcall/conference/index/getMapListV4/',//页面主列表
        scrBtnUrl: '/mcall/conference/index/getScreeningCondition/',//筛选项按钮的url
    };
    export default {
        data() {
            return {
                totalNum: 0,//会议总数
                conListArr: [],//主列表的数据
                jsonData: {},//缓存
                authMajorList: [],//首页推荐的筛选标签年份专业数组
                majorList: [],//筛选项的专业
                dateList: [],//日期数组
                loading: false,//loading显示和隐藏
                completed: false,//瀑布流是否加载完成
                pageIndex: 1,
                ajaxing: false,//瀑布流ajax
                noMore: false,//没有更多了~
                noScreenRe:false,//筛选无结果
            }
        },
        components: {
            MainList,//会议主列表
            Loading,//loading小圈圈
            ScreenPop,//筛选弹层
        },
        methods: {
            ...mapActions(['screeningPopChange','isLiveStateChange']),
            //分享方法
            //先走列表循环 缓存
            beforeMainList: function () {
                let t = this;
                if (TempCache.getItem('meetFirstScreenData')) {
                    let _tempData = JSON.parse(TempCache.getItem('meetFirstScreenData')),
                        data = _tempData.listData.responseObject.responseData;
                    if (data) {
                        t.totalNum = data.total;
                        t.conListArr = [];
                        for (let i = 0; i < data.data_list.length; i++) {
                            let v = data.data_list[i];
                            let json = {
                                isLive: v.isLive,
                                conTag: v.conTag,
                                conId: v.conId,
                                conTime: (!v.startTime && !v.endTime) ? "" : commdate.dateLocalJoint(v.startTime, v.endTime, "/", "-", true),
                                conAddr: v.conAddr,
                                conName: v.conName ? comm.getStrLen(v.conName, 40) : ''
                            };
                            t.conListArr.push(json);
                        }
                        t.ajaxing = true;
                    }
                }
                t.loadMainList();
            },
            //主列表的函数操作
            loadMainList: function () {
                let t = this;
                t.ajaxing = true;
                comm.ajax2({
                    url: xhlUrl.getMapListV4Url,
                    type: "POST",
                    data: {
                        paramJson: JSON.stringify({
                            scene: 0,//场景（0-会议频道页，1-我关注的会议，2-会议预告）
                            platformId: TempCache.getItem('department') || 1,
                            subjectTeamId: t.subjectTeamId,
                            openTime: t.openTime,
                            pageIndex: t.pageIndex,
                            pageSize: 20
                        })
                    },
                    success: function (res) {
                        t.loading = false;
                        t.ajaxing = false;
                        if (comm.hasResponseData(res)) {
                            if (t.pageIndex === 1) {
                                t.conListArr = [];
                                document.documentElement.scrollTop = 0;
                            }
                            if (TempCache.getItem('meetFirstScreenData')) {
                                t.jsonData = JSON.parse(TempCache.getItem('meetFirstScreenData'));
                            }
                            t.jsonData.listData = res;
                            TempCache.setItem('meetFirstScreenData', JSON.stringify(t.jsonData));
                            let data = res.responseObject.responseData;
                            if(data.data_list&&data.data_list.length){
                                t.noScreenRe=false;
                                t.totalNum = data.total;
                                t.isLiveStateChange ((parseInt(data.liveState)===1)?true:false) ;
                                for (let i = 0; i < data.data_list.length; i++) {
                                    let v = data.data_list[i];
                                    let json = {
                                        isLive: v.isLive,
                                        conTag: v.conTag,
                                        conId: v.conId,
                                        conTime: (!v.startTime && !v.endTime) ? "" : commdate.dateLocalJoint(v.startTime, v.endTime, "/", "-", true),
                                        conAddr: v.conAddr,
                                        conName: v.conName ? comm.getStrLen(v.conName, 40) : ''
                                    };
                                    t.conListArr.push(json);
                                }
                                t.pageIndex++;
                                if (data.data_list.length < 20) {
                                    t.noMore = true;
                                }
                            }else{//筛选无结果
                                t.noScreenRe=true;
                                t.noMore = true;
                            }
                        } else {
                            if (t.pageIndex === 1) {//第一页请求的时候
                                t.conListArr = [];
                            }
                        }
                    }
                });
            },
            //瀑布流
            scroll: function () {
                let t = this;
                window.onscroll = function () {
                    document.querySelectorAll('.screenListNav')[0].style.top
                        = document.querySelectorAll('.fixedHeader')[0].offsetHeight+'px';
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if (top + height > scrollHeight - 100) {
                        if (!t.ajaxing && !t.noMore) {
                            t.loadMainList();
                        }
                    }
                }
            },
        },
        computed: {
            ...mapGetters(['scrPopShow','subjectTeamId','openTime']),
            scrParamChange() {//判断筛选的参数的变化，专业或者时间
                let t = this;
                const {subjectTeamId, openTime} = this;
                return {
                    subjectTeamId,
                    openTime
                };
            }
        },
        watch: {
            scrParamChange: {
                handler: function () {
                    let t = this;
                    t.pageIndex = 1;
                    t.loading = true;
                    t.loadMainList();
                }
            }
        },
        mounted() {
            let t = this;
            t.beforeMainList();//主列表先走缓存
            t.scroll();//瀑布流操作
        }
    }
</script>

<style scoped>

</style>