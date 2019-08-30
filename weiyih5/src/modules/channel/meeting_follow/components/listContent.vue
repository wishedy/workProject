<template>
    <!--暂无关注会议开始-->
    <no-content v-if="fellowNone"></no-content>
    <!--暂无关注会议结束-->
    <section class="meetingFellow ev-meetingFellow" style="margin-top: -2px;" v-else>
        <!--已进行、未进行切换结束-->
        <!--关注的列表开始-->
        <!--已进行、未进行切换开始-->
        <section class="titleTab">
            <ul>
                <li class=" ev-tabClickBtn ev-alreadyPlay" v-if="isIndex.ready" :class="readyClass(isIndex.readyActive,isIndex.readyWidth)" @click="tabClick">已进行({{getConferenceNum.holdedConfNum}})</li>
                <li class="ev-tabClickBtn ev-noPlay" v-if="isIndex.noPlay" :class="readyClass(isIndex.noPlayActive,isIndex.noPlayWidth)" @click="tabClick">未进行({{getConferenceNum.unholdedConfNum}})</li>
            </ul>
        </section>
        <section class="meetingList ev-meetingList" data-alcode-mod='675'>
            <ul>
                <li v-for="(v,i) in dataItems" :key="i">
                    <aside class="meetingTitle">
                        <span v-if="v.conTag">{{v.conTag}}</span>
                        <a :href="'/dist/conference/meeting_detail.html?conId=' + v.conId" class="ev-meetingName">{{getStrLen(v.conName, 40)}}</a>
                    </aside>
                    <aside class="meetingTime">
                        <p class="mTime" v-if="v.startTime && v.endTime">{{dateLocalJoint(v.startTime, v.endTime, "/", "-", true)}}</p>
                        <p class="mAddress" v-if="v.conAddr"> {{v.conAddr}}</p>
                    </aside>
                </li>
            </ul>
        </section>
        <!--关注的列表结束-->
    </section>
</template>

<script>
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import commdate from 'static/js/comm.date.js';
    import NoContent from './NoContent.vue';
    const meetFollowPath= {
            getConferenceNum: '/mcall/conference/index/getConferenceNum/',//我关注的会议数量接口
            getMapListV4: '/mcall/conference/index/getMapListV4/'//我关注的会议接口列表
        };
    export default {
        data(){
            return {
                fellowNone:false,
                dataList:[],
                getConferenceNum:'',
                isIndex:{
                    ready:false,
                    readyActive:false,
                    readyWidth:false,
                    noPlay:false,
                    noPlayActive:false,
                    noPlayWidth:false,
                },
                dataItems1:[],//已进行
                dataItems2:[],//未进行
                dataItems:'',
                ajaxing:true,
                noData1:false,
                noData2:false,
                noData:'',
                pageIndex1:1,//已进行
                pageIndex2:1,//未进行
                pageIndex:''
            }
        },
        components:{
            NoContent,
        },
        methods:{
            fellowList(){
                let t=this;
                comm.ajax2({
                    url: meetFollowPath.getConferenceNum,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            sessionCustomerId:TempCache.getItem("userId")||''
                        })
                    },
                    timeout: 30000,
                    success:function(res){
                        if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                            t.getConferenceNum=res.responseObject.responseData.data_list[0];
                            let rep=res.responseObject.responseData.data_list[0];
                            if(rep.holdedConfNum&&rep.unholdedConfNum){//已进行和未进行的会议同时存在
                               t.isIndex={
                                   ready:true,
                                   readyActive:true,
                                   readyWidth:false,
                                   noPlay:true,
                                   noPlayActive:false,
                                   noPlayWidth:false,
                               };
                               t.pageIndex=t.pageIndex1;
                                t.noData=t.noData1;
                                t.getDataList(1);//会议状态（0-未进行，1-已进行）
                            }else if(rep.holdedConfNum&&!rep.unholdedConfNum){//只有已进行的会议
                                t.isIndex={
                                    ready:true,
                                    readyActive:true,
                                    readyWidth:true,
                                    noPlay:false,
                                    noPlayActive:false,
                                    noPlayWidth:false,
                                };
                                t.pageIndex=t.pageIndex1;
                                t.noData=t.noData1;
                                t.getDataList(1);//会议状态（0-未进行，1-已进行）
                            }else if(!rep.holdedConfNum&&rep.unholdedConfNum){//只有未进行的会议
                                t.isIndex={
                                    ready:false,
                                    readyActive:false,
                                    readyWidth:false,
                                    noPlay:true,
                                    noPlayActive:true,
                                    noPlayWidth:true,
                                };
                                t.pageIndex=t.pageIndex2;
                                t.noData=t.noData2;
                                t.getDataList(0);//会议状态（0-未进行，1-已进行）
                            }else{//两个都没有
                                t.fellowNone=true;//暂无会议提示
                            }
                        }else {
                            t.fellowNone=true;
                        }
                    }
                })
            },
            getDataList(flag){
                let t = this,
                    cId = TempCache.getItem("userId"),
                    authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
                if (cId &&  authState == 2|| authState == 7 || authState == 8|| authState == 9 ) {//登录认证用户 authState == 1 ||
                    t.ajaxing = true;
                    comm.ajax2({
                        url: meetFollowPath.getMapListV4,
                        type: "post",
                        data: {
                            paramJson:JSON.stringify({
                                scene:1,//场景（0-会议频道页，1-我关注的会议，2-会议预告）	1
                                sessionCustomerId:cId,//用户ID
                                runState:flag,	//会议状态（0-未进行，1-已进行）
                                pageIndex:t.pageIndex,
                                pageSize: 20
                            })
                        },
                        timeout: 30000,
                        success:function(res){
                            t.ajaxing = false;
                            if(res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.data_list){
                                var items = res.responseObject.responseData.data_list;
                                if (flag==1) {//已进行的会议存储
                                    t.dataItems1= t.dataItems1.concat(items);//数据存储已进行的列表
                                    t.dataItems=t.dataItems1;
                                    t.pageIndex1++;
                                } else {//未进行的会议存储
                                    t.dataItems2= t.dataItems2.concat(items);//数据存储未进行的列表
                                    t.dataItems=t.dataItems2;
                                    t.pageIndex2++;
                                }
                                if(items.length<20){
                                    if(flag==1){
                                        t.noData1=true;
                                    }else {
                                        t.noData2=true;
                                    }
                                    t.noData=true;
                                }
                            }else {
                                if(flag==1){
                                    t.noData1=true;
                                }else {
                                    t.noData2=true;
                                }
                                t.noData=true;
                                if(t.pageIndex==1){
                                    t.fellowNone=true;
                                }
                            }
                        }
                    })

                } else {//未登录用户，不提示登录，直接展示没有列表
                    t.fellowNone=true;//暂无会议提示
                }
            },
            readyClass(readyActive,readyWidth){
                if(readyActive&&readyWidth){
                    return 'widthAdapt active';
                }else  if(readyActive){
                    return 'active';
                }
            },
            getStrLen(conName,len){
                return comm.getStrLen(conName, len)
            },
            dateLocalJoint(date1, date2, sign, middleJoint,isMeeting){
                return commdate.dateLocalJoint(date1, date2, sign, middleJoint,isMeeting)
            },
            scroll(){
                let t = this,
                    scrollTop = 0;
                window.addEventListener('scroll',function(){
                    scrollTop = window.pageYOffset||document.documentElement.scrollTop;
                    if(scrollTop+document.documentElement.clientHeight > document.documentElement.scrollHeight - 100){
                        if(!t.ajaxing && !t.noData){
                            if(t.isIndex.readyActive){
                                t.pageIndex=t.pageIndex1;
                                t.getDataList(1);
                            }else if(t.isIndex.noPlayActive){
                                t.pageIndex=t.pageIndex2;
                                t.getDataList(0);
                            }

                        }
                    }
                },false);
            },
            tabClick(){
                if(this.isIndex.ready&&this.isIndex.noPlay){
                    this.isIndex.readyActive=!this.isIndex.readyActive;
                    this.isIndex.noPlayActive=!this.isIndex.noPlayActive;
                    if(this.dataItems==this.dataItems1){
                        this.dataItems=this.dataItems2;
                        this.pageIndex=this.pageIndex2;
                        this.noData=this.noData2;
                        if(this.dataItems.length==0){
                            this.getDataList(0);
                        }
                        comm.creatEvent({
                            triggerType: '会议tab',
                            triggerName:"我关注的会议tab",
                            keyword: "未进行",
                            actionId: 11012
                        });
                    }else if(this.dataItems==this.dataItems2){
                        this.dataItems=this.dataItems1;
                        this.pageIndex=this.pageIndex1;
                        this.noData=this.noData1;
                        comm.creatEvent({
                            triggerType: '会议tab',
                            triggerName:"我关注的会议tab",
                            keyword: "已进行",
                            actionId: 11012
                        });
                    }

                }
            },
            init(){
                let cId = TempCache.getItem("userId"),
                    authState = JSON.parse(TempCache.getItem("auth")) ? JSON.parse(TempCache.getItem("auth")).state : "";
                if (cId && authState == 2 || authState == 7 || authState == 8 || authState == 9 ) {//登录认证用户 authState == 1 ||
                    this.fellowList();//关注的会议数目
                    this.scroll();
                } else {//未登录用户，不提示登录，直接展示没有列表
                   this.fellowNone=true;//暂无会议提示
                }
            }
        },
        mounted(){
            this.init();
        }

    }
</script>

<style scoped>

</style>