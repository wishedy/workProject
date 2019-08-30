<template>
    <!--删除遮罩开始-->
    <section class="alEmr-belongPop" v-if="deleteBtn||passDelete">
        <span class="deleteTips" :class="{redTips:forbidDelete||caseEdit,greenTips:passDelete}"><i v-if="passDelete"></i>{{textTips}}</span>
        <p class="firstBtn" v-if="!passDelete" @click="deCancel">取消</p>
        <p class="secBtn wid116"  v-if="!passDelete" @click="deSure">确定删除</p>
    </section>
    <!--删除遮罩结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from "~utils/comm.js";
    const deleteUrl="/call/caseFolder/baseinfo/update/";
    export default {
        data(){
            return{
                textTips:"该操作为永久删除、不可恢复",//删除栏底部文字提示
                textFlag:false,//展示默认文本
            }
        },
        name: 'belongOpPop',
        computed:{
            ...mapGetters(['deleteBtn','loading','deleteId','forbidDelete','passDelete','caseEdit','itemsArr']),
            textFn(){
                let t=this;
                if (!(t.forbidDelete||t.passDelete||t.caseEdit)){//如果都不存在
                    return t.textFlag=true;
                }
            }
        },
        watch:{
            forbidDelete(){//检测不能删除
                let t=this;
                if(t.forbidDelete==true){//文本显示为
                    t.textTips="您暂时没有权限删除此病历！";
                }else{
                    t.textTips="该操作为永久删除、不可恢复";
                }
            },
            passDelete(){//检测删除成功
                let t=this;
                if(t.passDelete==true){//文本显示为
                    t.textTips="删除成功";
                }else{
                    t.textTips="该操作为永久删除、不可恢复";
                }
            },
            caseEdit(){//检测正在编辑
                let t=this;
                if(t.caseEdit==true){//文本显示为
                    t.textTips="您暂时没有权限删除此病历！";
                }else{
                    t.textTips="该操作为永久删除、不可恢复";
                }
            },
            textFlag(){//展示默认文本
                let t=this;
                if(t.textFlag==true){//文本显示为
                    t.textTips="该操作为永久删除、不可恢复";
                }
            }
        },
        methods: {
            ...mapActions(['loadingChange','caseListInit','deCancel','deleteStatus','forbidDeleteChange',
                'caseEditChange','passDeleteChange','itemsArrChange']),
            //删除操作确认
            deSure(){
                let t=this;
                if(t.loading){
                    return;
                }
                if(!t.deleteId){
                    return;
                }
                t.loadingChange(true);
                comm.ajax2({
                    url:deleteUrl,
                    type:"post",
                    dataType:"json",
                    data:{paramJson:JSON.stringify({
                            customerId:comm.cookie.get("userId")?comm.cookie.get("userId"):"",
                            visitSiteId:"1",
                            updateFlag:"4",
                            lockedFlag:"1",
                            caseId:t.deleteId,//'1532756363101,1531999302226,',
                            isValid:"0"
                        })
                    },
                    success:function(res) {
                        t.loadingChange(false);
                        if(res.responseObject.responseStatus) {//可以删除的情况
                            let _code=res.responseObject.responseCode;
                            if(_code==0){
                                /*本地先删除*/
                                for (let k in t.itemsArr) {
                                    if(t.itemsArr[k].caseId==t.deleteId){
                                        t.itemsArr.splice(k,1);
                                        break;
                                    }
                                }
                                t.itemsArrChange(t.itemsArr);
                                /*本地先删除结束*/
                                t.deCancel();//相当于取消操作回到初始状态
                                t.passDeleteChange(true);//可以删除
                                t.forbidDeleteChange(false);//不能删除,只有作者可以
                                t.caseEditChange(false);//病例正在编辑

                                setTimeout(function() {
                                    t.passDeleteChange(false);//可以删除

                                    t.caseListInit(true);//刷新列表
                                },2000);
                            }else if(_code==1301){//被锁定，正在编辑
                                t.caseEditChange(true);//病例正在编辑
                                t.passDeleteChange(false);//可以删除
                                t.forbidDeleteChange(false);//不能删除,只有作者可以
                                t.deleteStatus();//保留删除编辑状态，但是回归到未选择
                            }else if(_code==1303){//无权限，只能作者
                                t.forbidDeleteChange(true);//不能删除,只有作者可以
                                t.caseEditChange(false);//病例正在编辑
                                t.passDeleteChange(false);//可以删除
                                t.deleteStatus();//保留删除编辑状态，但是回归到未选择
                            }
                        }
                    }
                });
            },
        }
    }
</script>

<style scoped>

</style>
