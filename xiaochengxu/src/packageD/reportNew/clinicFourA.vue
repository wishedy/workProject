/*
*门诊路径第4-1个问题
*/
<template>
  <section class="reportMain">
    <report-progress
      :progress="'90%'"
      v-if="isProgress"
    ></report-progress>
    <select-date
      :dateObj="reviewTime"
    ></select-date>
    <form action="" @submit="formSubmit" report-submit="true">
      <button class="question-next"
              type="submit"
              formType="submit"
              @click="nextSubmit"
              :class="{'active':reviewTime.index.length}"
      >下一步</button>
    </form>
    <logo-loading v-if="isLoading"></logo-loading>
  </section>
</template>

<script>
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import reportProgress from './components/ReportProgress';
  import selectDate from "./components/SelectDate";
  import createReport from "common/js/report/createReport";//完善保存信息
  import getReportList from "common/js/report/getReportList";//获取保存信息
  import logoLoading from 'components/LogoLoading';
  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "common/js/dataLog/dataLog";
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  export default {
    data(){
      return{
        isProgress:false,
        reportContentList:[],
        isLoading:false,
        isBtnClick:false,
        reviewTime:{
          title:'请选择复诊日期',
          array: ['三天后复查', '一周后复查', '两周后复查', '两个月后复查','三个月后复查','半年后复查','一年后复查'],
          index:'',
        },
      }
    },
    components:{
      selectDate,
      reportProgress,
      logoLoading
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
    },
    methods:{
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      //下一步
      nextSubmit(){
        let _this=this;
        if(this.reviewTime.index.length&&(!this.isBtnClick)){
          this.isBtnClick=true;
          let paramData={
            reportId:_this.reportId,
            sortId:11,
            patientId:_this.patientId,
            doctorId:_this.doctorCustomerId,
            reportIsFinish:1,
            reportContentList:[
              {id:'',reportValue:parseInt(_this.reviewTime.index,10)+1},
            ],
            oldReportContentList:_this.reportContentList
          };
          console.log(paramData)
          _this.isLoading=true;
          createReport(paramData).then((res)=>{
            _this.isLoading=false;
            _this.isBtnClick=false;
            if(res&&res.responseObject&&res.responseObject.responseStatus){
              console.log('wanchengIM');
              wx.setStorageSync("backIndex",true);
              wx.reLaunch({
                url:`/packageA/imSceneDoctor/imSceneDoctor?caseId=${_this.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&reportId=${_this.reportId}&from=report`
              })
            }else {
              wx.showToast({
                title:'保存失败，请重试',
                icon:'none'
              });
            }
          });
        }
      },
      //获取报道信息
      getReportInfo(){
        let _this=this,paramData={
          reportId:_this.reportId,
          // pageSort:'QA4_1'
          sortId:11,
        };
        _this.isLoading=true;
        getReportList(paramData).then((res)=>{
          _this.isLoading=false;
          if(res&&res.reportMap&&res.reportMap.reportContentList&&res.reportMap.reportContentList.length){
            _this.reportContentList=res.reportMap.reportContentList;
            _this.textDesc=_this.reportContentList[0].reviewTimeType;
          }else{
            _this.reportContentList=[];
          }


        })
      }
    },
    onShow(){
      this.isBtnClick=false;
      this.isLoading=false;
      this.getReportInfo();
      dataLog.enterBrowse({
        resourceId:JSON.stringify({
          doctorId:this.doctorCustomerId,
          patientId:this.patientId
        })
      })
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onLoad(){
      this.reviewTime.index='';
      this.isProgress=true;
    },
    onUnload(){
      this.isProgress=false;
    },
  }
</script>

<style scoped lang="scss">
  .reportMain{
    min-height: 100%;
    position: relative;
  }
  .question-next{
    position: absolute;
    bottom: 80px;
    width:560px;
    height:96px;
    background:rgba(204,204,204,1);
    border-radius:8px;
    font-size:36px;
    font-family:PingFangSC-Medium;
    font-weight:bold;
    color:rgba(255,255,255,1);
    left: 50%;
    transform: translateX(-50%);
    border: none;
    outline: none;
    &.active{
      background:rgba(0,185,173,1);
    }
    &:after {
      border: 0;
    }
  }
</style>
