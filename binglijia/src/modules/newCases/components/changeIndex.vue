<template>
    <div class="caseBottomBtn">
        <div class="caseBWCont">
            <p class="casePrevBtn" @click.stop="changeIndex({pre:0})" v-if="!(pageIndex==-1)">上一步</p>
            <p class="caseNextBtn" @click.stop="(nextTemplate)?changePage():changeIndex({pre:1})"  v-text="(((!(pageIndex==tabList.length-1))||pageIndex==-1))?'下一步':'完成'"></p>
            <span class="caseChangeTemplate" @click.stop="changeTemplate" v-show="($route.name==='baseInfo')&&templateId>0">更换病历模板</span>
        </div>
    </div>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import comm from '~utils/comm.js';
    export default {
        computed:{
            ...mapGetters(['canSaveBaseData','pageIndex','pageInfo','tabList','editType','templateId','changePageOnOff','isChangeOnOff','clickNum','teamList','CaseId','pushTplate','uploadState','changeTemplateIdOnOff','imageErrorState','videoErrorState']),
            nextTemplate(){
                let t = this;
                return (parseInt(this.editType,10)===0)&&(this.tabList.length===0)&&(t.pageIndex==-1);
            }
        },
        methods:{
            ...mapActions(['filtrateBaseData','changeIndex','saveCaseId','saveBasePageInfo','clickChangeBtn','examineBasePageData','showLayer','saveCaseDataId','operationLog','showLoading','hideLoading','saveTagId','checkChangeState','changeSaveStatus','toast','changeBaseHandleType']),
            changeTemplate(){
              let t = this;
              t.showLayer(0);
            },
            changePage(option){
                let t = this;
                if(t.imageErrorState||t.videoErrorState){
                    if(t.imageErrorState){
                        t.toast('图片上传失败');
                        return false;
                    }
                    if(t.videoErrorState){
                        t.toast('视频上传失败');
                        return false;
                    }
                }else if(t.uploadState){
                    if((parseInt(this.editType,10)===0)&&(this.tabList.length===0)&&(t.pageIndex==-1)){
                        t.examineBasePageData();
                        console.log(this.changePageOnOff);
                        if(!this.changePageOnOff){
                            t.clickChangeBtn();
                        }else{//保存完第一步的信息然后跳转到模板页
                            t.changeSaveStatus(0);
                            t.filtrateBaseData();
                            let port = '/call/caseFolder/baseinfo/create/';
                            if(t.CaseId>0){
                                port = '/call/caseFolder/baseinfo/update/';
                            }
                            t.showLoading();
                            let basePostData = JSON.parse(JSON.stringify(t.canSaveBaseData));
                            basePostData.lockedFlag = 1;
                            t.checkChangeState(0);
                            if(t.isChangeOnOff){
                                comm.ajax2({
                                    url: "/call/caseFolder/baseinfo/update/",
                                    type: "POST",
                                    data: {
                                        paramJson:JSON.stringify(
                                            {
                                                customerId:comm.cookie.get("userId"),
                                                caseId:t.CaseId,
                                                updateFlag:0,
                                                lockedFlag:1
                                            }
                                        )

                                    },
                                    success:function(res){
                                        if(res&&res.responseObject&&res.responseObject.responseStatus){
                                            t.hideLoading();
                                            switch (parseInt(res.responseObject.responseCode)) {
                                                case 0://未锁定
                                                    t.changeBaseHandleType(false);
                                                    t.saveTagId('');
                                                    t.saveBasePageInfo(basePostData);
                                                    if(parseInt(t.templateId,10)>0){
                                                        t.changeIndex({index:0});
                                                    }else{
                                                        t.$router.push({
                                                            path: '/tplate'
                                                        });
                                                    }
                                                    break;
                                                case 1301://正在编辑
                                                case 1303://正在编辑
                                                    t.showLayer(3);
                                                    break;
                                                case 1302://异常退出
                                                    t.showLayer(2);
                                                    break;
                                            }
                                        }
                                    }
                                });

                            }else{
                                comm.ajax2({
                                    url: port,
                                    type:"POST",
                                    data:
                                        {
                                            paramJson:
                                                JSON.stringify(
                                                    basePostData
                                                )
                                        },
                                    success:function(res){
                                        if(res.responseObject.responseStatus){
                                            t.hideLoading();
                                        }
                                        if(res.responseObject.responseCode==1302){
                                            t.showLayer(2);
                                        }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                            t.showLayer(3);
                                        }else if(res.responseObject.responseCode==0){
                                            t.changeBaseHandleType(true);
                                            t.saveTagId('');
                                            if(res.responseObject.responseStatus){
                                                if(!(t.CaseId>0)){
                                                    t.saveCaseId(res.responseObject.responsePk);
                                                    t.operationLog(1);
                                                    t.saveCaseDataId(res.responseObject.responseData.id);
                                                }else{
                                                    //t.operationLog(3);
                                                }
                                                t.saveBasePageInfo(basePostData);
                                                if(parseInt(t.templateId,10)>0){
                                                    t.changeIndex({index:0});
                                                }else{
                                                    t.$router.push({
                                                        path: '/tplate'
                                                    });
                                                }

                                            }
                                        }
                                    }
                                });
                            }


                        }
                    }else{
                        //console.log('开始')
                    }
                }else{
                    t.toast('您有内容正在上传中，请稍后');
                }

            }
        },
        watch:{
            clickNum(){
                //console.log('点击');
            },
            pushTplate(n){
                let t = this;
                if(n){
                    t.$router.push({
                        path: '/tplate'
                    });
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .newCases{
       /* .caseBottomBtn{
            z-index: 4;
        }*/
    }
    .caseChangeTemplate{
        float: right;
        width: 146px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        cursor: pointer;
        color: #4B6EA6;
    }
</style>
