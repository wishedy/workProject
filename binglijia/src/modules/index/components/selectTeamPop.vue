<template>
    <!--病历归属选择团队开始-->
    <section class="alEmr-selectTeamPop" v-if="sTeamFlag">
        <section ref="listStyle" class="alEmr-selectTeamList" :style="{marginTop:mTop+'px',marginLeft:mLeft+'px'}">
            <h2>归属提示</h2>
            <section class="textBox">
                <h3>请选择团队</h3>
                <ul>
                    <li v-for="(val,i) in teamNameList" :class="{active:val.active}" @click="selectTeamId(i)">
                        <i></i><span>{{val.teamName|teamTxt}}</span>
                    </li>
                </ul>
            </section>
            <aside>
                <p class="cancelBtn" @click="sTeamCancel">取消</p>
                <p class="sureBtn" @click="sTeamSure" :class="{gray:!sureConBtn}">确定</p>
            </aside>
        </section>
    </section>
    <!--病历归属选择团队结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from "~utils/comm.js";
    const $ = require('jquery');
    export default {
        name: 'selectTeamPop',
        data(){
            return {
                mTop:0,
                mLeft:0,
            }
        },
        computed:{
            ...mapGetters(['teamNameList','teamId','sTeamFlag','loading','sureConBtn']),
        },
        watch:{
            'teamNameList':{
                handler(v1,v2){
                    let t=this;
                    for (let i=0;i<t.teamNameList.length;i++){
                        let items=t.teamNameList[i];
                        if(items.active){//如果有选中的团队激活，那么确认按钮可以继续点击
                            t.sureConBtnChange(true);
                        }
                    }
                },
                deep:true
            }
        },
        methods: {
            ...mapActions(['teamIdChange','belongAjax','sTeamFlagChange','sureConBtnChange']),
            //选择一个归属团队
            selectTeamId(index){
                let t=this;
                if(t.loading){
                    return;
                }
                for (let i=0;i<t.teamNameList.length;i++){
                    let items=t.teamNameList[i];
                    if(index===i){
                        items.active=true;
                        t.sureConBtnChange(true);
                    }else {
                        items.active=false;
                    }
                }
                t.teamIdChange(t.teamNameList[index].teamId);
            },
            //确认选择团队按钮
            sTeamSure(){
                let t=this;
                if(t.loading){
                    return;
                }
                if(t.sureConBtn){//发送归属请求
                    t.belongAjax();
                }
            },
            //取消选择团队停留在列表悬着杰顿
            sTeamCancel(){
                let t=this;
                if(t.loading){
                    return;
                }
                t.sTeamFlagChange(false);
            }
        },
        updated(){
            let t=this;
            if($(t.$refs.listStyle).height()>0){
                t.mTop=($(window).height()-$(t.$refs.listStyle).height())/2;
                t.mLeft=($(window).width()-$(t.$refs.listStyle).width())/2;
            }
        },
        filters:{
            teamTxt(txt){
                return comm.getStrLen(txt,50);
            }
        }
    }
</script>

<style scoped>

</style>
