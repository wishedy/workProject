<template><!--会议预告页列表-->
    <section>
        <section class="meetingList ev-meetingList meetingListTrailer" data-alcode-mod='676'>
            <p class="results" v-if="listTotal">已为您找到{{listTotal}}个会议</p>
            <ul>
                <li v-for="(v,i) in listArr" :key="i">
                    <aside class="allinFellow">
                        <div class="allinLive" :class="{allinNone:v.shootState!==1}">{{v.shootState|allinText}}</div>
                        <div v-if="v.shootState===1&&v.followState===1" class="fellow fellowed" :fellow="true" :index="i" :conId="v.conId" @click="likeView">
                            已关注
                        </div>
                        <div v-else-if="v.shootState===1&&v.followState!==1" class="fellow" :noFellow="true" :index="i" :conId="v.conId" @click="likeView">关注
                        </div>
                        <div v-else-if="v.shootState!==1&&v.followState===1" class="fellow likeViewNum"><i>{{v.followNum}}</i>人想看
                        </div>
                        <div v-else-if="v.shootState!==1&&v.followState!==1&&v.runState===1" class="fellow likeViewNum">
                            <i>{{v.followNum}}</i>人想看
                        </div>
                        <div v-else-if="v.shootState!==1&&v.followState!==1&&v.runState!==1" class="fellow likeView" :likeView="true" :index="i" :conId="v.conId" @click="likeView">想看
                        </div>
                    </aside>
                    <aside class="meetingTitle">
                        <span v-if="v.conTag">{{v.conTag}}</span>
                        <a href="javascript:;">{{v.conName}}</a>
                    </aside>
                    <aside class="meetingIntroduction">
                        <p v-if="v.conIntroFlag===1" v-show="showAll!==v.conId">
                            {{v.conIntroMin}}
                            <i @click="showAllClick(i)">展开</i>
                        </p>
                        <p v-if="v.conIntroFlag===1" v-show="showAll===v.conId">
                            {{v.conIntro}}
                            <i class="packUp" @click="showAllClick(i)">收起</i>
                        </p>
                        <p v-else>{{v.conIntro}}</p>
                    </aside>
                    <aside class="meetingTime">
                        <p class="mTime" v-if="v.meetingTime">{{v.meetingTime}}</p>
                        <p class="mAddress" v-if="v.conAddr">{{v.conAddr}}</p>
                    </aside>
                </li>

            </ul>
        </section>
        <section class="doubt" data-alcode-mod='677'>
            <p>对会议信息有疑问？</p>
            <button><a href="/dist/feedback.html">告诉我们</a></button>
        </section>
    </section>
</template>

<script>
    /*会议预告页列表*/
    import comm from "static/js/comm.js";
    import TempCache from "static/js/tempcache.js";
    import user from "static/js/module.user.js";
    const url={
        followUrl: "/mcall/customer/follow/resource/create/",//关注和想看接口
        cancelUrl:'/mcall/customer/follow/resource/delete3/',//取消关注接口
    };
    export default {
        props: ['listArr','listTotal'],
        data() {
            return {
                showAll:"",//展开按钮默认收起  不显示全部内容
            }
        },
        methods:{
            //展开和收起按钮点击事件
            showAllClick:function (index) {
                let t=this;
                if(t.showAll===t.listArr[index].conId){
                    t.showAll="";
                }else{
                    t.showAll=t.listArr[index].conId;
                }
            },
            //想看按钮点击
            likeView:function (e) {
                let t=this,
                    auth=TempCache.getItem('auth'),
                    cId=TempCache.getItem('userId'),
                    state;
                if(auth&&auth!=null){
                    state = parseInt(JSON.parse(auth).state);
                }
                if(cId&&state===2||state===7||state===8||state===9){//登录认证了
                    t.followEvent(e);//关注和想看事件
                }else{
                    user.privExecute({
                        callback: function() {
                            t.followEvent(e);//关注和想看事件
                        },
                        noNeedBack:true,
                        operateType: "auth",
                    });
                }
            },
            //关注和想看事件请求函数
            followEvent:function (e) {
                let t=this,
                    index=e.currentTarget.getAttribute("index"),
                    conId=e.currentTarget.getAttribute("conId"),
                    cancel=e.currentTarget.getAttribute("fellow"),
                    noFellow=e.currentTarget.getAttribute("noFellow"),
                    likeView=e.currentTarget.getAttribute("likeView");
                comm.ajax2({
                    url:cancel?url.cancelUrl:url.followUrl,
                    type:"POST",
                    data:{paramJson:$.toJSON(
                            {
                                "refId":  conId,
                                "refName": '',
                                "customerId": TempCache.getItem('userId'),
                                "followType": 3
                            }
                        )},
                    success:function (res) {
                        if(res.responseObject.responseStatus){
                            if(likeView){//想看
                                comm.creatEvent({
                                    triggerType: '关注',
                                    triggerName: "想看",
                                    keyword: "",
                                    actionId: 11023,
                                    refId: conId,
                                    refType: "会议"
                                });
                                t.listArr[index].followNum=t.listArr[index].followNum+1;//想看人数+1
                            }
                            if(noFellow){//关注
                                comm.creatEvent({
                                    triggerType: '关注',
                                    triggerName: "关注",
                                    keyword: "",
                                    actionId: 11022,
                                    refId: conId,
                                    refType: "会议"
                                });
                            }
                            t.listArr[index].followState===1?t.listArr[index].followState=0:t.listArr[index].followState=1;
                        }
                    }
                });
            },
        },
        mounted(){
            let t=this;
        },
        filters: {
            allinText(kv) {
                let str = String;
                if (parseInt(kv) === 1) {
                    str = "唯医合作";
                } else {
                    str = "合作沟通中";
                }
                return str;
            }
        }
    }
</script>

<style scoped>

</style>