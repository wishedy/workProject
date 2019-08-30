/*
*门诊路径第4-2个问题
*/
<template>
  <section>
    <report-progress
      :progress="'90%'"
      v-if="showQuestion"
    ></report-progress>
    <question-select
      :question="question"
      @btnIndex="selctBtnSubmit"
      v-if="showQuestion"
    ></question-select>
    <logo-loading v-if="isLoading"></logo-loading>
  </section>
</template>

<script>
  import questionSelect from './components/QuestionSelect'
  import reportProgress from './components/ReportProgress';
  import createReport from "common/js/report/createReport";//完善保存信息
  import getReportList from "common/js/report/getReportList";//获取保存信息
  import logoLoading from 'components/LogoLoading';
  import {createNamespacedHelpers} from 'vuex';
  import dataLog from "common/js/dataLog/dataLog";
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  export default {
    data(){
      return{
        reportContentList:[],
        isLoading:false,
        showQuestion:false,
        question:{
          title:'您现在住院了吗？',
          descShow:'',
          selectText:['犹豫中，还没有决定','已决定住院，等待安排','已住院','已出院']
        }
      }
    },
    components:{
      questionSelect,
      reportProgress,
      logoLoading
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
    },
    methods:{
      selctBtnSubmit(index){
        // ['犹豫中，还没有决定','已决定住院，等待安排','已住院','已出院']
        let url='',_this=this,reportIsFinish=0;
        switch (index){
          case 2:
            url='/packageD/reportNew/clinicFive';
            break;
          default:
            reportIsFinish=1;
            url=`/packageA/imSceneDoctor/imSceneDoctor?caseId=${_this.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&reportId=${_this.reportId}&from=report`;//im
            //完成
            console.log('wancheng');
            break;
        }
        let paramData={
          reportId:_this.reportId,
          sortId:12,
          patientId:_this.patientId,
          doctorId:_this.doctorCustomerId,
          reportIsFinish:reportIsFinish,
          reportContentList:[
            {id:'',reportValue:index+1},
          ],
          oldReportContentList:_this.reportContentList
        };
        console.log(paramData);
        _this.isLoading=true;
        createReport(paramData).then((res)=>{
          _this.isLoading=false;
          if(res&&res.responseObject&&res.responseObject.responseStatus){
            if(index!=2){
              console.log('wanchengIM');
              wx.setStorageSync("backIndex",true);
              wx.reLaunch({
                url:url
              })
            }else {
              wx.redirectTo({
                url:url
              })
            }
          }else {
            wx.showToast({
              title:'保存失败，请重试',
              icon:'none'
            });
          }
        });

      },
      //获取报道信息
      getReportInfo(){
        let _this=this,paramData={
          reportId:_this.reportId,
          // pageSort:'QA4_2'
          sortId:12,
        };
        _this.isLoading=true;
        getReportList(paramData).then((res)=>{
          _this.isLoading=false;
          if(res&&res.reportMap&&res.reportMap.reportContentList&&res.reportMap.reportContentList.length){
            _this.reportContentList=res.reportMap.reportContentList;
          }else{
            _this.reportContentList=[];
          }


        })
      }
    },
    onShow(){
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
    onUnload(){
      this.showQuestion=false;
    },
    onLoad(){
      this.showQuestion=true;
    }
  }
</script>

<style scoped>

</style>
