<template>
    <section class="headerTopNav">
        <section class="alEmr-logo" @click.stop="goRootUrl"><span></span> </section>
        <aside class="crumbs">
            <span>{{crumbsTxt}}</span>
            <i v-show="pageType==1"></i>
            <span>{{navName}}</span>
        </aside>
        <!--新建比例相关右侧-->
        <aside class="saveBtn" v-show="pageType==1" @click.stop="outType?saveCaseInfo(1):saveCaseInfo(0)">
            <span v-show="saveStatus!=1&&saveStatus!=2&&CaseId>0">保存并退出</span>                       <!--默认状态-->
            <span v-show="!(CaseId>0)" >取消</span>                       <!--默认状态-->
            <ul v-show="saveStatus==1"><li></li><li></li><li></li></ul>         <!--loading-->
            <i v-show="saveStatus==2"></i>                                      <!--加载成功-->
        </aside>
        <!--搜索，用户-->
        <section class="alEmr-headerContainer" v-show="pageType==2">
            <section class="alEmr-headerInner">
                <SearchInput></SearchInput>
                <UserLogo></UserLogo>
            </section>
        </section>
    </section>
</template>
<script>
    import Logo from './Logo.vue';
    import SearchInput from './SearchInput.vue';
    import UserLogo from './UserLogo.vue';
    import comm from '~utils/comm.js';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        props:{
            navName:{//面包屑名称
                type:String,
                default:''
            },
            crumbsTxt:{//当前页面
                type:String,
                default:''
            },
            pageType:{//页面类型
                type:Number,
                default:2
            },
            saveStatus:{//新建病历保存状态
                type:Number,
                default:0
            }
        },
        components:{
            Logo,
            UserLogo,
            SearchInput
        },
        watch:{

        },
        methods:{
            ...mapActions(['clickChangeBtn','checkChangeState','wantChangePageIndex','examineBasePageData','showLayer','toast','operationLog']),
            'saveCaseInfo'(type){
                //type 0取消，1保存并退出
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
                    if(t.pageIndex<0){
                        t.checkChangeState(0);
                        if(!t.isEmptyBase&&comm.isEmptyObject(t.baseInfo)){
                            comm.ajax2({
                                url: "/call/caseFolder/baseinfo/update/",
                                type: "POST",
                                data: {
                                    paramJson:JSON.stringify(
                                        {
                                            customerId:comm.cookie.get("userId"),
                                            caseId:t.CaseId,
                                            updateFlag:0,
                                            lockedFlag:0
                                        }
                                    )

                                },
                                success:function(res){
                                    if(res&&res.responseObject&&res.responseObject.responseStatus){
                                        if(res.responseObject.responseCode==1302){
                                            t.showLayer(2);
                                        }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                            t.showLayer(3);
                                        }else if(res.responseObject.responseCode==0){
                                            t.operationLog(3);
                                            localStorage.removeItem("emrNewCaseCaseId");
                                            window.location.href='/';
                                        }
                                    }
                                }
                            });
                            return false;
                        }
                    }else{
                        t.checkChangeState(1);
                    }
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
                                        lockedFlag:0
                                    }
                                )

                            },
                            success:function(res){
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    if(res.responseObject.responseCode==1302){
                                        t.showLayer(2);
                                    }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                        t.showLayer(3);
                                    }else if(res.responseObject.responseCode==0){
                                        t.operationLog(3);
                                        localStorage.removeItem("emrNewCaseCaseId");
                                        window.location.href = `/caseDetails/index.html?caseId=${t.CaseId}&templateId=${t.templateId>0?t.templateId:0}`;
                                    }
                                }
                            }
                        });
                    }else{
                        this.$emit('quitSaveCaseInfo',type);
                    }
                }else{
                    t.toast('您有内容正在上传中，请稍后');
                }


            },
            goRootUrl(){
                let t= this;
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
                    if(t.pageIndex<0){
                        t.checkChangeState(0);
                        //console.log(t.isEmptyBase);
                        if(!t.isEmptyBase){
                            comm.ajax2({
                                url: "/call/caseFolder/baseinfo/update/",
                                type: "POST",
                                data: {
                                    paramJson:JSON.stringify(
                                        {
                                            customerId:comm.cookie.get("userId"),
                                            caseId:t.CaseId,
                                            updateFlag:0,
                                            lockedFlag:0
                                        }
                                    )

                                },
                                success:function(res){
                                    if(res&&res.responseObject&&res.responseObject.responseStatus){
                                        if(res.responseObject.responseCode==1302){
                                            t.showLayer(2);
                                        }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                            t.showLayer(3);
                                        }else if(res.responseObject.responseCode==0){
                                            localStorage.removeItem("emrNewCaseCaseId");
                                            window.location.href = `/`;
                                        }
                                    }
                                }
                            });
                            //window.location.href='/';
                        }

                    }else{
                        t.checkChangeState(1);
                    }
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
                                        lockedFlag:0
                                    }
                                )

                            },
                            success:function(res){
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    if(res.responseObject.responseCode==1302){
                                        t.showLayer(2);
                                    }else if(res.responseObject.responseCode==1301||res.responseObject.responseCode==1303){
                                        t.showLayer(3);
                                    }else if(res.responseObject.responseCode==0){
                                        localStorage.removeItem("emrNewCaseCaseId");
                                        window.location.href = `/`;
                                    }
                                }
                            }
                        });
                    }else{
                        t.wantChangePageIndex(-2);
                        t.examineBasePageData();
                        t.clickChangeBtn();
                        if(t.changePageOnOff){
                            t.showLayer(5);
                        }
                    }
                }else{
                    t.toast('您有内容正在上传中，请稍后');
                }

            }
        },
        computed:{
            ...mapGetters(['pageIndex','isChangeOnOff','changePageOnOff','editType','tabList','uploadState','baseInfo','isEmptyBase','CaseId','imageErrorState','videoErrorState','templateId','isEmptyBase']),
            saveText(){
                let t = this;
                return (!((t.editType==0&&t.tabList.length==0&&t.pageIndex==-1))&&t.saveStatus==0)?'保存并退出':'取消';
            },
            outType(){
                let t = this;
                return t.saveStatus!=1&&t.saveStatus!=2&&t.CaseId>0;
            }
        },
        mounted(){
        }
    }
</script>
<style scoped lang="scss">
    @import "../../assets/scss/components/headerTopNav.scss";
    .alEmr-headerInner{
        float: right;
        display: inline;
        margin-right: 225px;
    }
    .alEmr-logo{
        width: 143px;
        height: 37px;
        /*padding-top: 51px;*/
        margin: 51px auto 0 auto;
        background: url("/static/images/common/logo.png") no-repeat center 50%;
        cursor: pointer;
        span{
            display: inline-block;
            width: 100%;
            height: 100%;
        }
    }
    @media screen and (max-width:1540px){
        .alEmr-logo{
            background: url("/static/images/common/logoSmall.png") no-repeat center 50%;
            width: 37px;
            height: 37px;
        }
    }
</style>
