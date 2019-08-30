<template><!--会议预告页面主组件-->
    <section class="meetingTrailer">
        <!--月份列表开始-->
        <mouth-list></mouth-list>
        <screen-option></screen-option>
        <!--月份列表结束-->
        <!--本月无会议开始-->
        <no-meeting v-if="monthNoRe"></no-meeting>
        <!--本月无会议结束-->

        <section v-if="!monthNoRe">
            <!--筛选开始-->

            <!--筛选结束-->
            <!--筛选无结果开始-->
            <no-result v-if="scrNoRe"></no-result>
            <!--筛选无结果结束-->
            <!--筛选主列表开始-->
            <ListContent :listArr="listArr" :listTotal="listTotal" v-else></ListContent>
            <Loading v-show="loading"></Loading>
            <!--筛选主列表结束-->
        </section>

    </section>
</template>

<script>
    /*会议预告页面主组件*/
    import MouthList from './MouthList.vue';
    import NoMeeting from './NoMeeting.vue';
    import ScreenOption from './ScreenOption.vue';
    import NoResult from './NoResult.vue';
    import ListContent from './List.vue';
    import comm from "static/js/comm.js";
    import TempCache from "static/js/tempcache.js";
    import commdate from "static/js/comm.date.js";
    import {mapActions, mapGetters} from "vuex";
    import Loading from 'components/Loading/Loading.vue';

    const url = {
        getMapListV4Url: '/mcall/conference/index/getMapListV4/',//会议预告列表接口
    };
    export default {
        data() {
            return {
                pageIndex: 1,//页码
                pageSize: 20,//页面条数
                listArr: [],//列表数组
                listTotal:"",//会议预告列表数
                ajaxing:false,//瀑布流ajax
                noMore:false,//没有更多了~
                loading: false,//loading显示和隐藏
            }
        },
        components: {
            MouthList,
            NoMeeting,
            ScreenOption,
            NoResult,
            ListContent,
            Loading,//loading小圈圈
        },
        computed: {
            ...mapGetters(['nowMouth','subjectTeamId','runState','shootState','scrNoRe',
                'monthNoRe','monthChange','scrChange']),//时间
            paramChange() {//检测参数变化
                const {nowMouth, subjectTeamId, runState, shootState} = this;
                return {
                    nowMouth,
                    subjectTeamId,
                    runState,
                    shootState,
                }
            }
        },
        methods: {
            ...mapActions(['scrNoReChange','monthNoReChange','monthChangeFun','scrChangeFun',
                'subjectTeamIdChange','shootStateChange','runStateChange']),//筛选无结果
            //列表筛选
            listRender: function () {
                let t = this,
                    param = {
                        scene: 2,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	2
                        sessionCustomerId: TempCache.getItem("userId"),	//用户ID
                        subjectTeamId: t.subjectTeamId,	//专业标签（0-无标签，9999-综合，10000-其他，2-关节，7-脊柱，9-创伤）
                        runState: t.runState,	//会议状态（0-未进行，1-已进行）
                        shootState: t.shootState,	//拍摄状态（0-不拍摄，1-拍摄）
                        openTime: new Date().getFullYear() + '-' + (t.nowMouth > 9 ? t.nowMouth : '0' + t.nowMouth),	//时间筛选
                        platformId: TempCache.getItem('department') || 1,	//平台（1-骨科，2-手外科）
                        pageIndex: t.pageIndex,
                        pageSize: t.pageSize
                    };
                t.ajaxing=true;
                t.loading=true;
                comm.ajax2({
                    url: url.getMapListV4Url,
                    type: "POST",
                    data: {paramJson: $.toJSON(param)},
                    success: function (res) {
                        t.ajaxing=false;
                        t.loading = false;
                        if (comm.hasResponseData(res)) {
                            let items= res.responseObject.responseData;
                            if(items.data_list&&items.data_list.length>0){
                                t.listTotal=items.total;
                                if(t.pageIndex===1){
                                    t.listArr = [];
                                    document.documentElement.scrollTop = 0;
                                }
                                for (let i = 0; i < items.data_list.length; i++) {
                                    let kv = items.data_list[i],
                                        json = {
                                            conAddr: kv.conAddr,
                                            conId: kv.conId,
                                            conIntro: kv.conIntro,
                                            conIntroMin: comm.getStrByteLen(kv.conIntro, 66),
                                            conIntroFlag: comm.getByteLen(kv.conIntro) > 66 ? 1 : "",//判断展开和收起
                                            conName: comm.getStrByteLen(kv.conName, 40),
                                            conTag: kv.conTag,
                                            conUrl: kv.conUrl,
                                            meetingTime: kv.startTime && kv.endTime ? commdate.dateLocalJoint(kv.startTime, kv.endTime, "/", "-", true) : "",
                                            followNum: parseInt(kv.followNum),
                                            followState: parseInt(kv.followState),
                                            runState: parseInt(kv.runState),
                                            shootState: parseInt(kv.shootState),
                                        };
                                    t.listArr.push(json);
                                }
                                t.pageIndex++;
                                if(items.data_list.length<20){
                                    t.noMore=true;
                                }
                                t.scrNoReChange(false);
                                t.monthNoReChange(false);
                            }else{
                                if(t.subjectTeamId&&t.scrChange){//月份，筛选一起点击\只点击了筛选（显示筛选无结果）
                                    t.scrNoReChange(true);
                                }else{//只点击了月份（显示本月无会议）
                                    t.monthNoReChange(true);
                                }
                            }
                        }
                    },
                });
            },
            //瀑布流
            scroll:function(){
                let t=this;
                window.onscroll=function(){
                    let top = document.documentElement.scrollTop || document.body.scrollTop;//滚动高度
                    let height = document.documentElement.clientHeight;//可视区高度
                    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//文档高度
                    if(top+height>scrollHeight-100){
                        if(!t.ajaxing && !t.noMore){
                            t.loading = true;
                            t.listRender();
                        }
                    }
                }
            },
        },
        watch: {
            paramChange: {//参数变化检测
                handler: function () {
                    let t = this;
                    t.pageIndex = 1;
                    t.listRender();
                },
            },
            nowMouth(){//月份变化
                let t=this;
                t.monthChangeFun(true);
            },
            subjectTeamId(){//专业变化
                let t=this;
                t.scrChangeFun(true);
            },
            shootState(){//唯医是否录制
                let t=this;
                t.scrChangeFun(true);
            },
            runState(){//已进行和未进行
                let t=this;
                t.scrChangeFun(true);
            },
        },
        mounted() {
            let t = this;
            t.listRender();//会议预告列表渲染
            t.scroll();//瀑布流渲染
        }
    }
</script>

<style scoped>

</style>