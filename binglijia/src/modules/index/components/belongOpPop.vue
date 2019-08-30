<template>
    <!--归属遮罩开始-->
    <section class="alEmr-belongPop" v-if="belongBtn&&!alBelongFail&&!sTeamFlag&&!teamSuccess&&!teamFailPerson&&!editing">
        <p class="firstBtn" @click="beCancel">取消</p>
        <p class="secBtn" @click="beSure">确定</p>
    </section>
    <!--归属遮罩结束-->
</template>

<script>
    import {mapActions,mapGetters} from 'vuex';
    import comm from "~utils/comm.js";
    const $ = require('jquery');
    const xUrl = {
        getMapListByCustomerId: '/call/caseFolder/team_baseinfo/getMapListByCustomerId/'
    };
    export default {
        name: 'belongOpPop',
        data(){
            return {
                dId:"",
            }
        },
        computed:{
            ...mapGetters(['belongBtn','chooseTips','belongList','alBelongFail','sTeamFlag','teamSuccess',
                'teamNameList','teamFailPerson','loading','editing','selectDoctorId']),
        },
        methods: {
            ...mapActions([ 'sTeamFlagChange','chooseTipsChange','belongCancel','teamNameListChange']),
            //归属操作取消
            beCancel(){
                let t=this;
                if(t.loading){
                    return;
                }
                t.belongCancel();//取消编辑选中状态
            },
            //归属操作确认
            beSure(){
                let t=this;
                if(t.loading){
                    return;
                }
                if(t.belongList.length>0){//选中的列表长度大于0时才可进行归属操作
                    //增加判断，用病例id确定主管医生的id都有哪些
                    let arr = t.selectDoctorId.split(',');
                    for (let i = 0; i < arr.length-1; i++) {
                        if(parseInt(i)!==0){
                            if(parseInt(arr[i])===parseInt(arr[i-1])){//两两相比取相等
                                t.dId=arr[i];
                            }else{
                                t.dId="";
                            }
                        }else{
                            t.dId=arr[i];
                        }
                    }
                    if(!t.dId&&arr.length){//如果主管医生的id不存在提示 请选择同一主管医生
                        t.chooseTipsChange(2);
                        setTimeout(()=>{
                            t.chooseTipsChange(0);
                        },2000);
                        return ;
                    }

                    comm.ajax2({
                        url: xUrl.getMapListByCustomerId,
                        type: 'get',
                        data: {
                            paramJson: JSON.stringify({
                                customerId: comm.cookie.get('userId') ? comm.cookie.get('userId') : '',
                                visitSiteId: 1,
                                teamSelectType: 1,//	1-所有团队 2-为所有者的团队
                                isValid: 1,
                                doctorId:t.dId?t.dId:"",
                            })
                        },
                        success(res) {
                            if (comm.hasResponseData(res) && res.responseObject.responseData.data_list
                                && res.responseObject.responseData.data_list.length > 0) {//有团队的话
                                let items = res.responseObject.responseData.data_list;
                                let _flag = false;//判断列表中有没有
                                let _arr = [];
                                let dayJson = {};
                                for (let i = 0; i < items.length; i++) {
                                    _flag = true;
                                    dayJson = {
                                        teamName: items[i].teamName,
                                        active: false,
                                        teamId: items[i].teamId
                                    };
                                    _arr.push(dayJson);//处理展示列表

                                }
                                if (_flag) {
                                    t.sTeamFlagChange(true);//要归属的团队列表弹层显示
                                }else{
                                    t.sTeamFlagChange(false);
                                }
                                t.teamNameListChange(_arr);//归属团队列表push值
                            } else {//没有团队，不显示归属
                                t.teamNameListChange([]);
                            }
                        }
                    });
                }else{//提示，请选择一个病历
                    t.chooseTipsChange(1);
                    setTimeout(()=>{
                        t.chooseTipsChange(0);
                    },2000);
                }
            },
        }
    }
</script>

<style scoped>

</style>
