<template>
    <!--病历不能被归属提示开始-->
    <section class="alEmr-noBelongCasePop" v-if="alBelongFail">
        <section ref="listStyle" class="alEmr-noBelongCaseList" :style="{marginTop:mTop+'px',marginLeft:mLeft+'px'}">
            <h2>归属提示</h2>
            <section class="textBox">
                <h3>您不是以下<span>{{infoList[0].caseCount}}</span>个团队病历的所有者，暂无法修改归属，是否继续归属其他病历。</h3>
                <ul>
                    <li v-for="(val,i) in infoList[0].caseList">
                        <span class="itemOne" :title="val.patientName">{{val.patientName}}</span>
                        <span class="itemTwo">{{val.patientSex}}</span>
                        <span class="itemThree">{{val.patientAge|commAge}}</span>
                        <span class="itemFour" :title="val.preoperativeDiagnosis|commStr">{{val.preoperativeDiagnosis|commCutStr}}</span>
                        <span class="itemFive" :title="val.operationNameList|commStr">{{val.operationNameList|commCutStr}}</span>
                        <span class="itemSix" :title="val.tagNameList|commStrTag">{{val.tagNameList|commCutStrTag}}</span>
                    </li>
                </ul>

            </section>
            <aside>
                <p class="cancelBtn" @click="cancelBelong">重新选择</p>
                <p class="sureBtn" @click="continueBelong" :class="{gray:!bConBtn}">继续</p>
            </aside>
        </section>
    </section>
    <!--病历不能被归属提示结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from "~utils/comm.js";
    const $ = require('jquery');
    export default {
        name: 'notBelongPop',
        data(){
            return{
                mTop:0,
                mLeft:0
            }
        },
        computed:{
            ...mapGetters(['alBelongFail','infoList','bConBtn','loading']),
        },
        updated(){
            let t=this;
            if($(t.$refs.listStyle).height()>0){
                t.mTop=($(window).height()-$(t.$refs.listStyle).height())/2;
                t.mLeft=($(window).width()-$(t.$refs.listStyle).width())/2;
            }
        },
        methods: {
            ...mapActions(['alBelongFailChange', 'belongListChange','belongAjax']),
            //放弃归属,回到列表选中时
            cancelBelong(){
                let t=this;
                if(t.loading){
                    return;
                }
                t.alBelongFailChange(false);
            },
            //继续归属，belongList删除不符合的id
            continueBelong(){
                let t=this;
                if(t.loading){
                    return;
                }
                if(t.bConBtn){//选择的病历有可以归属的病历，去除不能归属的病历
                    for (let i=0;i<t.infoList[0].caseList.length;i++){
                        let item1=t.infoList[0].caseList[i];
                        t.belongListChange({caseId:item1.caseId,flag:false});
                    }
                    t.belongAjax();
                }
            }
        },
        filters:{
            commAge(txt){//年龄
                if(txt){
                    return txt.split(",")[0]?txt.split(",")[0]:0;
                }else{
                    return 0;
                }
            },
            commStr(txt){//完整字段名称,title显示
                if(txt){
                    let str=txt.split("|");
                    if(!str[str.length-1]){
                        str.splice(str.length-1,1);
                    }
                    return str.join("、");
                }
            },
            commCutStr(txt){//字段截取
                if(txt){
                    let str=txt.split("|");
                    if(!str[str.length-1]){
                        str.splice(str.length-1,1);
                    }
                    let _kv=str.join("、");
                    return comm.getStrLen(_kv,14);
                }
            },
            commCutStrTag(txt){//标签
                let str='';
                let _arr=comm.cutLine(txt,'|','_','、').split('、');
                if(!_arr[_arr.length-1]){
                    _arr.splice(_arr.length-1,1);
                }
                for (let i=0;i<_arr.length;i++){
                    if(i==_arr.length-1){
                        str+="#"+_arr[i]+"#";
                    }else{
                        str+="#"+_arr[i]+"#"+'、';
                    }
                }
                return comm.getStrLen(str,14);
            },
            commStrTag(txt){//标签的全部
                let str='';
                let _arr=comm.cutLine(txt,'|','_','、').split('、');
                if(!_arr[_arr.length-1]){
                    _arr.splice(_arr.length-1,1);
                }
                for (let i=0;i<_arr.length;i++){
                    if(i==_arr.length-1){
                        str+="#"+_arr[i]+"#";
                    }else{
                        str+="#"+_arr[i]+"#"+'、';
                    }
                }
                return str;
            },
        }
    }
</script>

<style scoped>

</style>
