<template>
    <section class="newCases alEmr-mainInner" @click.stop="globalEventActions">
        <headerTopNav :saveStatus="saveStatus" :crumbsTxt="crumbsTxt" :pageType="1" :navName="titleName" @quitSaveCaseInfo="quitSaveCaseInfo"></headerTopNav>
        <caseTopNav ref="topNavBar" v-show="!templateTopNav"></caseTopNav>
        <caseLeftNav v-show="parseInt(navHeight,10)" :style="[{'top':(navHeight+71)+'px'}]"></caseLeftNav>
        <router-view  :style="[{'paddingTop':checkNavHeight}]"></router-view>
        <MaskLayer v-if="layerIndex==0">
            <section>
                <div class="close" @click.stop="hideLayer"><i></i></div>
                <div class="text"><i></i><p><span>更换模板将清空全部病历内容，您确认更换么？</span></p></div>
                <div class="btn">
                    <a class="grey cancel" @click.stop="hideLayer">取消</a>
                    <a class="grey red" @click.stop="changeTemplate">清空并更换</a>
                </div>
            </section>
        </MaskLayer>
        <MaskLayer v-if="layerIndex==1">
            <section>
                <div class="close" @click.stop="hideLayer"><i></i></div>
                <div class="text"><i></i><p><span>您要保存当前编辑的病历内容么？</span></p></div>
                <div class="btn">
                    <a class="grey cancel" @click.stop="closeLayer">不保存</a>
                    <a class="blue" @click.stop="saveInfoQuite">保存</a>
                </div>
            </section>
        </MaskLayer>
        <MaskLayer v-if="layerIndex==2">
            <section>
                <div class="close" @click.stop="reloadHref"><i></i></div>
                <div class="text"><i></i><p><span>保存失败</span><span>长期未保存，当前内容已过期失效请重新录入</span></p></div>
                <div class="btn">
                    <a class="blue" @click.stop="reloadHref">好的</a>
                </div>
            </section>
        </MaskLayer>
        <MaskLayer v-if="layerIndex==3">
            <section>
                <div class="close" @click.stop="jumpSource"><i></i></div>
                <div class="text"><i></i><p><span>当前病历正在团队其他成员编辑中
                        请稍后再试</span></p></div>
                <div class="btn">
                    <a class="blue" @click.stop="jumpSource">知道了</a>
                </div>
            </section>
        </MaskLayer>
        <MaskLayer v-if="layerIndex==4">
            <section>
                <div class="close" @click.stop="jumpSource"><i></i></div>
                <div class="text"><i></i><p><span>检测异常退出，当前病历正在保护期请稍后再试
                        请稍后再试</span></p></div>
                <div class="btn">
                    <a class="blue" @click.stop="jumpSource">知道了</a>
                </div>
            </section>
        </MaskLayer>
        <MaskLayer v-if="layerIndex==5">
            <section>
                <div class="close" @click.stop="hideLayer"><i></i></div>
                <div class="text"><i></i><p><span>您要保存当前编辑的病历内容么？</span></p></div>
                <div class="btn">
                    <a class="grey cancel" @click.stop="outSidePage">不保存</a>
                    <a class="blue" @click.stop="changeTab">保存</a>
                </div>
            </section>
        </MaskLayer>
        <Loading v-show="loadingOnOff"></Loading>
        <ToastTip :text="toastText"
                  :showToast="toastState"></ToastTip>
    </section>
</template>
<script>
    const $ = require('jquery');
import headerTopNav from '~components/common/newCasesTopNav.vue';
import caseTopNav from '~components/common/caseTopNav.vue';
import comm from '~utils/comm.js';
import {mapGetters,mapActions} from 'vuex';
import CaseLeftNav from "../../components/common/caseLeftNav";
import MergePageData from './assemble/mergePageData.js';
import MaskLayer from './components/MaskLayer.vue';
import Loading from "~components/loading/loading.vue";
import ToastTip from "~components/toastTip/toastTip.vue";
export default {
    name: 'index-app',
    data() {
        return {
            edit: (comm.getParamFromUrl(document.URL,'edit')||'0').replace(/[^0-9]/ig,""),
            topics: [],
            queryCaseId:(comm.getParamFromUrl(document.URL,'caseId')||'0').replace(/[^0-9]/ig,""),
            heightTop:43
        }
    },
    components: {
        CaseLeftNav,
        headerTopNav,
        caseTopNav,
        MaskLayer,
        Loading,
        ToastTip

    },
    created(){
        // this.showLayer(5);
    },
    async mounted() {


        let t = this;
        t.changeTemplateId(false);
        t.initUploadState();
        t.checkBigImage();
        this.saveEditType(this.edit);
        if(((parseInt(this.queryCaseId,10)>0)||(parseInt(sessionStorage.getItem('emrNewCaseCaseId'),10)>0))){
            if((parseInt(this.queryCaseId,10)>0)){
                this.saveCaseId(this.queryCaseId);
                this.checkCaseStatus();
            }else{
                this.saveCaseId(sessionStorage.getItem('emrNewCaseCaseId'));
                this.checkCaseStatus();
            }
        }else{
            sessionStorage.removeItem('emrNewCaseCaseId');
        }
        t.timingLog();
        setTimeout(()=>{
            document.title = t.crumbsTxt;
        },1000);
    },
    computed:{
        ...mapGetters(['canSaveBaseData','titleName','navHeight','editType','tabList','pageIndex','CaseId','templateId','teamList','layerIndex','saveBaseInfo','pageInfo','changePageOnOff','isChangeOnOff','CaseDataId','CaseId','loadingOnOff','globalEvent','wantChangeIndex','saveStatus','toastText','toastState','changeTemplateIdType','changeTemplateIdOnOff']),
        checkNavHeight(){
            let t = this;
            return (t.$route.path.replace('/','')==='tplate')?"":parseInt(t.navHeight+71,10)+'px';
        },
        crumbsTxt(){
          let t = this;
          return (t.editType==1)&&(t.CaseId>0)?'编辑病历':'新建病历';
        },
        templateTopNav(){
            let t = this;
            return t.$route.name==='tplate';
        }
    },
    metaInfo: {
        title: ''
    },
    methods:{
        ...mapActions(['filtrateBaseData','saveEditType','saveCaseId','getTabList','getBaseCaseInfo','getTeamList','changeIndex','hideLayer','showLayer','saveBasePageInfo','clickChangeBtn','examinePageData','operationLog','examineBasePageData','showLoading','hideLoading','globalEventActions','saveTagId','changeSaveStatus','checkChangeState','saveIndexSubPageData','toast','saveTemplateId','saveCaseDataId','templateIdType','changeTemplateId','initUploadState','changeHandleType','changeBaseHandleType','timingLog']),
        checkCaseStatus(){
          let t = this;
            t.showLoading();
            comm.ajax2({
                url: "/call/caseFolder/baseinfo/update/",
                type: "POST",
                data: {
                    paramJson:JSON.stringify(
                        {
                        customerId:comm.cookie.get("userId"),
                        caseId:t.CaseId,
                        updateFlag:0
                    }
                    )
                },
                success:function(res){
                    if(res&&res.responseObject&&res.responseObject.responseStatus){
                        t.hideLoading();
                        switch (parseInt(res.responseObject.responseCode)) {
                            case 0://未锁定
                                break;
                            case 1301://正在编辑
                                t.showLayer(3);
                                break;
                            case 1302://异常退出
                                t.showLayer(4);
                                break;
                        }
                    }
                }
            });
        },
        outSidePage(){
          let t = this;
            t.hideLayer();
            let routerJump = (index)=>{
                t.changeIndex({'index':index});
                if(index==-1){
                    t.$router.push({
                        path: '/baseInfo',
                        name:'baseInfo'
                    });
                }else if(index==-2){
                    sessionStorage.removeItem("emrNewCaseCaseId");
                    window.location.href = '/';
                }else{
                    t.$router.push({
                        path: '/assemble',
                        name:'assemble',
                        params:{
                            menuId:t.tabList[index].menuId
                        }
                    });
                }
            };
            routerJump(t.wantChangeIndex);
        },
        closeLayer(){
          let t = this;
          t.hideLayer();
          t.jumpSource();
        },
        quitSaveCaseInfo(type){
            let t=this;
            t.examineBasePageData();
            t.clickChangeBtn();
            if(type==0){
                t.showLayer(1);
            }else{
                t.saveInfoQuite();
            }
        },
        reloadHref(){
          window.location.reload();
        },
        jumpSource(){
            sessionStorage.removeItem("emrNewCaseCaseId");
          window.location.href = sessionStorage.getItem('newCasesSource')?sessionStorage.getItem('newCasesSource'):'/';
        },
        changeTab(){
            let t = this;
            t.hideLayer();
            t.clickChangeBtn();
            let routerJump = (index)=>{
                t.changeIndex({'index':index});
                if(index==-1){
                    t.$router.push({
                        path: '/baseInfo',
                        name:'baseInfo'
                    });
                }else if(index==-2)
                {
                    t.operationLog(3);
                    sessionStorage.removeItem("emrNewCaseCaseId");
                    window.location.href = '/';
                }else{
                    t.$router.push({
                        path: '/assemble',
                        name:'assemble',
                        params:{
                            menuId:t.tabList[index].menuId
                        }
                    });
                }
            };
            t.savePageInfo(
                'tab',
                function(res){
                    if(res.responseObject.responseCode==1302){
                        t.showLayer(2);
                    }else if(res.responseObject.responseCode==1301){
                        t.showLayer(3);
                    }else if(res.responseObject.responseCode==0){
                        if(res.responseObject.responseStatus){

                            t.changeSaveStatus(2);
                            setTimeout(()=>{
                                routerJump(t.wantChangeIndex);
                            },500);
                        }
                    }

                },
                function(res,baseData){
                    if(res.responseObject.responseCode==1302){
                        t.showLayer(2);
                    }else if(res.responseObject.responseCode==1301){
                        t.showLayer(3);
                    }else if(res.responseObject.responseCode==0){
                        if(res.responseObject&&res.responseObject.responseStatus){
                            t.saveTagId('');
                            if(!(t.CaseId>0)){
                                t.saveCaseId(res.responseObject.responsePk);
                                t.saveCaseDataId(res.responseObject.responseData.id);
                                t.operationLog(1);
                            }
                            t.saveBasePageInfo(baseData);
                            t.changeSaveStatus(2);
                            setTimeout(()=>{
                                routerJump(t.wantChangeIndex);
                            },500);
                        }
                    }
                }
            )
        },
        savePageInfo(type,assembleCallBack,baseCallBack){
            let t = this;
            let updateFlag = 0;
            let lockedFlag = 0;
            t.examineBasePageData();
            if(type=='tab'){
                updateFlag=0;
                lockedFlag=1;
            }else{
                updateFlag=0;
                lockedFlag=0;
            }
            if(t.changePageOnOff){
                if(t.$route.name==='assemble'){
                    t.checkChangeState(1);
                    t.showLoading();
                    let mergeData = new MergePageData(t.pageInfo.pageData);
                    t.changeSaveStatus(1);
                    if(t.isChangeOnOff){
                        comm.ajax2({
                            url: "/call/caseFolder/baseinfo/update/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify(
                                    {
                                        customerId:comm.cookie.get("userId"),
                                        caseId:t.CaseId,
                                        updateFlag:updateFlag,
                                        lockedFlag:lockedFlag
                                    }
                                )

                            },
                            success:function(res){
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    t.changeHandleType({
                                        index:parseInt(t.pageIndex,10),
                                        onOff:false
                                    });
                                    t.saveIndexSubPageData();
                                    t.hideLoading();
                                    assembleCallBack && assembleCallBack(res)
                                }
                            }
                        });
                    }else{
                        comm.ajax2({
                            url: "/call/caseFolder/case_folder_detail/createBatch/",
                            type: "POST",
                            data:
                                {
                                    paramJson:
                                        JSON.stringify(mergeData.mergeData({quiteType:lockedFlag}))
                                },
                            success:function(res) {
                                if(res.responseObject.responseStatus){
                                    t.changeHandleType({
                                        index:parseInt(t.pageIndex,10),
                                        onOff:true
                                    });
                                    t.saveIndexSubPageData();
                                    t.hideLoading();
                                }
                                assembleCallBack && assembleCallBack(res);
                            }
                        });
                    }

                }else{
                    t.filtrateBaseData();
                    t.checkChangeState(0);
                    let port = '/call/caseFolder/baseinfo/create/';
                    if(t.CaseId>0){
                        port = '/call/caseFolder/baseinfo/update/';
                        //type=='quit'?t.operationLog(3):'';
                    }
                    t.changeSaveStatus(1);
                    t.showLoading();
                    let basePostData = JSON.parse(JSON.stringify(t.canSaveBaseData));
                    basePostData.lockedFlag = lockedFlag;
                    if(t.isChangeOnOff){
                        comm.ajax2({
                            url: "/call/caseFolder/baseinfo/update/",
                            type: "POST",
                            data: {
                                paramJson:JSON.stringify(
                                    {
                                        customerId:comm.cookie.get("userId"),
                                        caseId:t.CaseId,
                                        updateFlag:updateFlag,
                                        lockedFlag:lockedFlag
                                    }
                                )

                            },
                            success:function(res){
                                if(res&&res.responseObject&&res.responseObject.responseStatus){
                                    t.hideLoading();
                                    t.changeBaseHandleType(false);
                                    baseCallBack&&baseCallBack(res,basePostData);
                                }
                            }
                        });
                    }else{
                        comm.ajax2({
                            url: port,
                            type: "POST",
                            data: {
                                paramJson:
                                    JSON.stringify(basePostData)
                            },
                            success:function(res){
                                if(res.responseObject.responseStatus){
                                    t.changeBaseHandleType(true);
                                    t.hideLoading();
                                }
                                baseCallBack&&baseCallBack(res,basePostData);
                            }
                        });
                    }

                }
            }
        },
        saveInfoQuite(){
          let t = this;
            t.hideLayer();
            t.clickChangeBtn();
            t.savePageInfo(
                'quit',
                function(res){
                if(res.responseObject.responseCode==1302){
                    t.showLayer(2);
                }else if(res.responseObject.responseCode==1301){
                    t.showLayer(3);
                }else if(res.responseObject.responseCode==0){
                    if(res.responseObject.responseStatus){
                        t.changeSaveStatus(2);
                        t.operationLog(3);
                        setTimeout(()=>{
                            sessionStorage.removeItem("emrNewCaseCaseId");
                            window.location.href = `/caseDetails/index.html?caseId=${t.CaseId}&templateId=${t.templateId>0?t.templateId:0}`;
                        },500);
                    }
                }

             },
                function(res,saveData){
                    if(res.responseObject.responseCode==1302){
                        t.showLayer(2);
                    }else if(res.responseObject.responseCode==1301){
                        t.showLayer(3);
                    }else if(res.responseObject.responseCode==0){
                        if(res.responseObject&&res.responseObject.responseStatus){
                            t.saveTagId('');
                            if(!(t.CaseId>0)){
                                t.saveCaseId(res.responseObject.responsePk);
                                t.saveCaseDataId(res.responseObject.responseData.id);
                            }
                            t.operationLog(1);
                            t.saveBasePageInfo(saveData);
                            t.changeSaveStatus(2);
                            setTimeout(()=>{
                                sessionStorage.removeItem("emrNewCaseCaseId");
                                window.location.href = `/caseDetails/index.html?caseId=${t.CaseId}&templateId=${t.templateId>0?t.templateId:0}`;
                            },500);
                        }
                    }
                }
            )
        },
        checkBigImage(){
            $('.alEmr-mainInner').on("mousedown",'.ev-bigImg,.detImgMore',function(){
                setTimeout(()=>{
                    let originalBtn = $(".view_img_view_yt");
                    originalBtn.off("click mousedown mouseup").on("click",function(){
                        let originalImageUrl = $(".view_img_tp td[align='center'] img").attr("src");
                        window.open(originalImageUrl.replace(/\_c./ig,'.'));
                    });
                    $(".view_img_view_yt").css({"display":"inline-block",'right':'202px'})
                },500);
            });
        },
        changeTemplate(){
            let t = this;
            t.saveTemplateId('-1');
            t.templateIdType(0);
            t.changeTemplateId(true);
            t.hideLayer();//需要执行一个借口操作清除该病历的模板回显数据
            t.$router.push({
                path: '/tplate'
            });
        }
    },
    watch:{
        pageIndex(newVal){
            let t = this;
            if(newVal===-1){
                t.getBaseCaseInfo();
            }
        },
        CaseId(newVal){
            //当获取到caseId的时候去发请求获得模板id,，或者新建病历的时候自己去选择一个模板，取出模板id
            let t = this;
            if(parseInt(newVal,10)>0){
                if(t.editType===1){
                    //如果是编辑病历这是需要获取基本信息
                    t.getBaseCaseInfo();
                }else{
                    //如果是在基本信息创建病历后这时候可以去选模板了
                    if((t.$route.name==='baseInfo')||(t.$route.name==='assemble')){
                        t.getBaseCaseInfo();
                    }
                }
            }else{
                //console.log('没有病历ID');
            }
        },
        loadingOnOff(n){
            //console.log(n);
        },
        '$route'(n,o){
            let t = this;
            if((n.name==='baseInfo')&&(o.name==='tplate')){
                t.getBaseCaseInfo();
            }else if((n.name==='baseInfo')){
                t.changeIndex({index:-1});
            }
            setTimeout(()=>{
                $('.alEmr-mainInner').scrollTop(0);
            },200);
        },
        templateId(newVal,oldVel){
            //在获取模板id的时候果断发起请求tab数据的请求
            let t = this;
            //debugger;
            if(t.changeTemplateIdType==0){
                if(t.CaseDataId>0&&newVal>0){
                    t.showLoading();
                    comm.ajax2({
                        type: 'POST',
                        url: '/call/caseFolder/template/chooseOrReplaceTemplate/',
                        data: {
                            paramJson:
                                JSON.stringify(
                                    {
                                        lockedFlag:1,
                                        customerId:comm.cookie.get("userId"),
                                        id:t.CaseDataId,
                                        caseId: t.CaseId,//	string	是	病历id
                                        templateId:newVal,//	string	是	模板id
                                        opType:(t.changeTemplateIdOnOff)?1:0//
                                    }
                                )
                        },
                        success:function(req){
                            if(req.responseObject.responseStatus){
                                t.hideLoading();
                            }
                        }
                    });

                }
            }

            if(newVal>0){
                t.getTabList();
            }
            if(newVal===0){
                //console.log('没有模板');
            }
        }
    }
}
</script>

<style lang="scss">
    @import "../../assets/scss/base.scss";
    @import "../../assets/scss/pages/newCases.scss";
</style>
