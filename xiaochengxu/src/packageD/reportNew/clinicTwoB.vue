/*
*门诊路径第2-2个问题
*/
<template>
 <section>
   <report-progress
     :progress="'40%'"
     v-if="isProgress"
   ></report-progress>
   <question-select
     :question="question"
     @btnIndex="selctBtnSubmit"
     v-if="!imgList.imgSrcArr.length"
   ></question-select>
   <img-list
     :imgList="imgList"
     v-else
   ></img-list>
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
  import imgList from './components/ImgList'
  export default {
    data(){
      return{
        isProgress:false,
        isLoading:0,
        reportContentList:[],
        chooseImg:false,
        question:{
          title:'请上传【检查结果】',
          descShow:'便于医生记录病情，指导后续治疗',
          selectText:['拍照上传','还没拿到'],
        },
        imgList:{
          title:'请上传【检查结果】',
          descShow:'便于医生记录病情，指导后续治疗',
          imgSrcArr:[],
          questionType:'1-2',
          imgReport:[],
        }
      }
    },
    components:{
      questionSelect,
      imgList,
      reportProgress,
      logoLoading
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
    },
    methods:{
      selctBtnSubmit(index){
        let _this=this;
        if(index==0){
          _this.chooseImg=true;
          wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
              // tempFilePath可以作为img标签的src属性显示图片
              _this.imgList.imgSrcArr=res.tempFiles;
            },
            fail(){

            }
          })
        }
        let paramData={
          reportId:_this.reportId,
          sortId:4,
          patientId:_this.patientId,
          doctorId:_this.doctorCustomerId,
          reportIsFinish:0,
          reportContentList:[
            {id:'',reportValue:index+1},
          ],
          oldReportContentList:_this.reportContentList
        };
        console.log(paramData)
        _this.isLoading++;
        createReport(paramData).then((res)=>{
          _this.isLoading--;
          if(res&&res.responseObject&&res.responseObject.responseStatus){
            if(index==1){
              wx.redirectTo({
                url:'/packageD/reportNew/clinicThree'
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
      getReportInfo(pageSort, sortId){
        let _this=this,paramData={
          reportId:_this.reportId,
          // pageSort:pageSort
          sortId:sortId,
        };
        _this.isLoading++;
        getReportList(paramData).then((res)=>{
          _this.isLoading--;
          if(res&&res.reportMap&&res.reportMap.reportContentList&&res.reportMap.reportContentList.length){
            if(pageSort=='QA2_2'){
              _this.reportContentList=res.reportMap.reportContentList;
            }else {
              _this.imgList.imgReport=res.reportMap.reportContentList;
              _this.imgList.imgSrcArr=res.reportMap.attList;
            }
          }else{
            if(pageSort=='QA2_2'){
              _this.reportContentList=[];
            }else {
              _this.imgList.imgReport=[];
              _this.imgList.imgSrcArr=[];
            }

          }
        })
      }
    },
    onShow(){
      this.isLoading=false;
      if(this.imgList.imgSrcArr.length==0){
        this.getReportInfo('QA2_2',4);
        if(!this.chooseImg){
          this.getReportInfo('QA2_3',5);
        }

      }

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
      this.imgList.imgSrcArr=[];
      this.chooseImg=false;
      this.isProgress=true;
    },
    onUnload(){
      this.isProgress=false;
    },
  }
</script>

<style scoped>

</style>
