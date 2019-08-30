/*
*门诊路径第5个问题
*/
<template>
  <section>
    <report-progress
      :progress="'90%'"
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
  import imgList from './components/ImgList'
  import {createNamespacedHelpers} from 'vuex';
  import logoLoading from 'components/LogoLoading';
  import dataLog from "common/js/dataLog/dataLog";
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  export default {
    data(){
      return{
        isProgress:false,
        isLoading:false,
        reportContentList:[],
        chooseImg:false,
        question:{
          title:'请拍照上传床头卡或腕带',
          descShow:'便于医生记录病情，指导后续治疗',
          selectText:['拍照上传','没在身边，手动填写'],
        },
        imgList:{
          title:'请拍照上传床头卡或腕带',
          descShow:'便于医生记录病情，指导后续治疗',
          imgSrcArr:[],
          questionType:'1-5',
          imgReport:[],
        }
      }
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
    },
    components:{
      questionSelect,
      imgList,
      reportProgress,
      logoLoading
    },
    methods:{
      selctBtnSubmit(index){
        let _this=this;
        switch (index){
          case 0:
            _this.chooseImg=true;
            wx.chooseImage({
              count: 9,
              sizeType: ['original', 'compressed'],
              sourceType: ['album', 'camera'],
              success(res) {
                // tempFilePath可以作为img标签的src属性显示图片
                _this.imgList.imgSrcArr=res.tempFiles;
              }
            });
            break;
          case 1:
            // wx.navigateTo({
            //   url:'/packageD/reportNew/clinicFiveA'
            // });
            break;
          default:
            break;
        }
        let paramData={
          reportId:_this.reportId,
          sortId:14,
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
              wx.navigateTo({
                url:'/packageD/reportNew/clinicFiveA'
              });
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
      getReportInfo(pageSort,sortId){
        let _this=this,paramData={
          reportId:_this.reportId,
          // pageSort:pageSort
          sortId:sortId,
        };
        _this.isLoading++;
        getReportList(paramData).then((res)=>{
          _this.isLoading--;
          if(res&&res.reportMap&&res.reportMap.reportContentList&&res.reportMap.reportContentList.length){
            if(pageSort=='QA5'){
              _this.reportContentList=res.reportMap.reportContentList;
            }else {
              _this.imgList.imgReport=res.reportMap.reportContentList;
              _this.imgList.imgSrcArr=res.reportMap.attList;
            }
          }else{
            if(pageSort=='QA5'){
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
        this.getReportInfo('QA5',14);
        if(!this.chooseImg){
          this.getReportInfo('QA5_1',15);
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
