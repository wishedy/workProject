<template>
    <section class="alEmr-aside">
        <section class="alEmr-commlogo"><a href="/"></a></section>
        <ul class="navSideBarLi">
            <li class="navLeftNormal">
                <a href="javascript:;" target="_blank" @click="newCaseclick">
                    <i class="caseIcon"></i>
                    <span>新建病历</span>
                </a>
            </li>
            <li class="navLeftNormal">
                <a href="../choosePatients/index.html" target="_blank">
                    <i class="patientsIcon"></i>
                    <span>选择患者</span>
                </a>
            </li>
            <li class="navLeftSpecial" :class="{active:sideSetting.index==1}">
                <a href="/">
                    <i class="allCaseIcon"></i>
                    <span>全部病历</span>
                </a>
            </li>
            <li class="navLeftSpecial" :class="{active:sideSetting.index==2}">
                <a href="../templateLib/index.html">
                    <i class="templateIcon"></i>
                    <span>模板库</span>
                </a>
            </li>
            <li class="navLeftSpecial position" :class="{active:sideSetting.index==3}">
                <a href="javascript:;" @click="goTeamSetting(sideSetting.index)">
                    <i class="teamIcon"></i>
                    <span>团队设置<i v-show="redPoint"></i></span>
                </a>
            </li>
        </ul>
        <ieAlert :showAlert="showAlert"></ieAlert>
        <MaskLayer v-if="layerOnOff">
            <section>
                <div class="close" @click.stop="layerOnOff=false;"><i></i></div>
                <div class="text"><h3><span>您还没有加入过团队</span></h3></div>
                <div class="btn">
                    <a class="blue" @click.stop="layerOnOff=false;">好的</a>
                </div>
            </section>
        </MaskLayer>
    </section>
</template>
<script>
    import comm from '~utils/comm.js';
    import ieAlert from "~components/ieAlert/ieAlert.vue";
    import MaskLayer from "./MaskLayer";
    export default {
        props:[
            'sideSetting'
        ],
        data() {
            return {
                layerOnOff:false,
                'redPoint':false,
                showAlert:false,
                assistantDoctor:parseInt(comm.cookie.get("customerRole"))===13
            }
        },
        methods:{
            //移除新建病历缓存
            newCaseclick(e){
                let t = this;
                if(comm.browser.isIe9()){
                    e.preventDefault();
                    this.showAlert = !this.showAlert
                    let t=this;
                    setTimeout(function() {
                        t.showAlert = !t.showAlert
                    },1000)
                }else{
                    if(t.assistantDoctor){
                        comm.ajax2({
                            url:"/call/caseFolder/team_baseinfo/getMapListByCustomerId/",
                            type:"get",
                            data:{
                                paramJson:JSON.stringify({
                                    customerId:comm.cookie.get("userId"),
                                    teamSelectType:1,
                                    visitSiteId:1,
                                    isValid:1
                                })
                            },
                            success(res){
                                if(res.responseObject.responseData&&res.responseObject.responseData.data_list&&res.responseObject.responseData.data_list.length>0){//有团队的话
                                    sessionStorage.removeItem("emrNewCaseCaseId");
                                    sessionStorage.setItem('newCasesSource',window.location.href);
                                    window.location.href="/newCases/index.html?edit=0#/baseInfo";
                                }else{
                                    if(t.assistantDoctor){
                                        t.layerOnOff = true;
                                    }else{
                                        sessionStorage.removeItem("emrNewCaseCaseId");
                                        sessionStorage.setItem('newCasesSource',window.location.href);
                                        window.location.href="/newCases/index.html?edit=0#/baseInfo";
                                    }

                                }
                            }
                        })
                    }else{
                        sessionStorage.removeItem("emrNewCaseCaseId");
                        sessionStorage.setItem('newCasesSource',window.location.href);
                        window.location.href="/newCases/index.html?edit=0#/baseInfo";
                    }

                }
            },
            goTeamSetting(index){
                let t=this;
                comm.ajax2({
                    url:"/call/caseFolder/team_baseinfo/getMapListByCustomerId/",
                    type:"get",
                    data:{
                        paramJson:JSON.stringify({
                            customerId:comm.cookie.get("userId"),
                            teamSelectType:1,
                            visitSiteId:1,
                            isValid:1
                        })
                    },
                    success(res){
                        if(res.responseObject.responseData&&res.responseObject.responseData.data_list&&res.responseObject.responseData.data_list.length>0){//有团队的话
                            window.location.href="/teamSetting/index.html#teamSetting";
                            if(index==3){
                                t.$router.push({
                                    path: 'teamSetting',//跳转链接
                                })
                            }
                        }else{
                            if(t.assistantDoctor){
                                  t.layerOnOff = true;
                            }else{
                                window.location.href="/teamSetting/index.html#createTeam";
                                if(index==3){
                                    t.$router.push({
                                        path: 'createTeam',//跳转链接
                                    })
                                }
                            }

                        }
                    }
                })
            },
            //获取红点状态
            getRedPoint(){
                let t=this;
                comm.ajax2({
                    url:"/call/caseFolder/team_member/getStateCount/",
                    type:"post",
                    data:{
                        paramJson:JSON.stringify({
                            customerId:comm.cookie.get("userId"),
                            teamSelectType:2,
                        })
                    },
                    success(res){
                        if(res.responseObject.responseData&&res.responseObject.responseData.data_list&&res.responseObject.responseData.data_list.length>0){//有当前团队
                            if(res.responseObject.responseData.data_list[0].total_num>0){
                                t.redPoint = true;
                            }
                        }
                    }
                })
            },
        },
        components:{
            ieAlert,
            MaskLayer
        },
        mounted(){
            if(comm.cookie.get("userId")){
                this.getRedPoint();
            }
        }
    }
</script>
<style scoped lang="scss">
@import "../../assets/scss/components/navSideBar.scss";
</style>
