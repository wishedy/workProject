/*
*住院路径第4个问题
*/
<template>
  <section>
    <report-progress
      :progress="'70%'"
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
          title:'出院是否带药？',
          descShow:'',
          selectText:['是','否']
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
        let url='',_this=this,reportIsFinish=0;
        if(index==0){
          url='/packageD/reportNew/hospitalFourA';
        }else {
          reportIsFinish=1;
          url=`/packageA/imSceneDoctor/imSceneDoctor?caseId=${_this.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&reportId=${_this.reportId}&from=report`;
        }
        let paramData={
          reportId:_this.reportId,
          sortId:25,
          patientId:_this.patientId,
          doctorId:_this.doctorCustomerId,
          reportIsFinish:reportIsFinish,
          reportContentList:[
            {id:'',reportValue:index+1},
          ],
          oldReportContentList:_this.reportContentList
        };
        console.log(paramData)
        _this.isLoading=true;
        createReport(paramData).then((res)=>{
          _this.isLoading=false;
          if(res&&res.responseObject&&res.responseObject.responseStatus){
            if(index==0){
              wx.navigateTo({
                url:url
              })
            }else {
              wx.setStorageSync("backIndex",true);
              wx.reLaunch({
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
          // pageSort:'QB4_1'
          sortId:25,
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

