<template><!--专业筛选-->
    <!--筛选项目-->
    <section class="screenOptions ev-screenOptions" :class="!meetingState? 'screenTwo':''">
        <!--专业筛选开始-->
        <div class="major ev-majorCheck" data-flag="1" :class="checkHover(majorName,'专业')">
            <span data-tagId="noCheck" @click="majorCheck" data-index="0">{{majorName}}</span>
            <div class="screenPosition ev-screenOptionsDiv" style="display: block" v-show="isMajor" @click="selectLi" data-contaner="true">
                <ul>
                    <li :class="{active:subjectTeamId===''&&allBtnClick}" data-tagId="" data-tagType="1">全部</li>
                    <li :class="{active:parseInt(subjectTeamId)===parseInt(v.tagId)}" v-for="(v,i) in majorListArr" :key="i" :data-tagId="v.tagId" :data-tagType="v.tagType">{{v.tagName}}</li>
                </ul>
            </div>
        </div>
        <!--专业筛选结束-->
        <!--会议状态筛选开始-->
        <div class="meetingState ev-meetingState" data-flag="1" v-if="meetingState" :class="checkHover(stateName,'会议状态')">
            <span data-type="noCheck" @click="majorCheck" data-index="1">{{stateName}}</span>
            <div class="screenPosition ev-meetingStateDiv" style="display: block" v-show="isState" @click="selectLi" data-contaner="true">
                <ul>
                    <li data-type="">全部</li>
                    <li data-type="1">已进行</li>
                    <li data-type="0">未进行</li>
                </ul>
            </div>
        </div>
        <!--会议状态筛选结束-->
        <div class="allinLive ev-allinLive" data-flag="1" :class="isLive?'active':''" data-index="2" @click="majorCheck">唯医合作</div>
        <aside></aside>
    </section>
</template>

<script>
    /*专业筛选层*/
    import TempCache from "static/js/tempcache.js";
    import comm from 'static/js/comm';
    import {mapActions, mapGetters} from "vuex";
    export default {
        data(){
            return {
                isMajor:false,
                isState:false,
                majorListArr:[],//专业列表数组
                allBtnClick:false,//全部按钮的点击
            }
        },
        computed:{
            ...mapGetters(['meetingState','subjectTeamId','runState','shootState','majorName',
                'stateName','isLive']),//时间月份点击
        },
        methods:{
            ...mapActions(['subjectTeamIdChange','meetingStateChange','shootStateChange',
                'runStateChange','majorNameChange','stateNameChange','isLiveChange']),
            majorCheck(e){
                let t=this,
                    dataIndex=e.target.getAttribute('data-index');
                switch (parseInt(dataIndex,10)){
                    case 0:
                        t.isMajor=!t.isMajor;
                        t.isState=false;
                        break;
                    case 1:
                        t.isState=!t.isState;
                        t.isMajor=false;
                        break;
                    case 2://唯医合作
                        t.isLiveChange(!t.isLive);
                        t.isMajor=false;
                        t.isState=false;
                        if(t.isLive){
                            t.shootStateChange(1);
                        }else {
                            t.shootStateChange("");
                        }
                        break;
                }
                t.judgeBodyScroll();//弹层出现判断body禁止滚动
            },
            selectLi(e){
                let t=this,
                    target=e.target;
                if(!target.getAttribute('data-contaner')){
                    if(t.isMajor){
                        t.majorNameChange(target.innerText);
                        t.subjectTeamIdChange(target.getAttribute('data-tagId'));
                        if(!target.getAttribute('data-tagId')){
                            t.allBtnClick=true;
                        }else {
                            t.allBtnClick=false;
                        }
                    }else if(t.isState){
                        t.stateNameChange(target.innerText);
                        t.subjectTeamIdChange(target.getAttribute('data-type'));
                    }
                }
                t.isMajor=false;
                t.isState=false;
                t.judgeBodyScroll();//弹层出现判断body禁止滚动
            },
            //判断弹层状态进行滚动禁用时间
            judgeBodyScroll(){
                let t=this;
                if(t.isMajor||t.isState){//弹层禁止滚动
                    comm.bodyScroll();
                }else{//释放body滚动
                    comm.bodyNoScroll();
                }
            },
            //专业筛选和会议状态选中class效果
            checkHover(type,name){
                if(type!=name){
                    return 'checkHover';
                }
            },
            majorList(){
                let t=this,
                    scrBtnUrl="/mcall/conference/index/getScreeningCondition/";//筛选项按钮的url;
                comm.ajax2({
                    url: scrBtnUrl,
                    type: "post",
                    data: {
                        paramJson:JSON.stringify({
                            sessionCustomerId:TempCache.getItem("userId")||'',
                            platformId: TempCache.getItem('department') || 1
                        })
                    },
                    success:function(res){
                        if(comm.hasResponseData(res)){
                            t.majorListArr=res.responseObject.responseData.majorList;
                        }
                    }
                })
            }
        },
        mounted(){
            let t=this;
            t.majorList();//筛选的请求
        },
    }
</script>

<style scoped>

</style>