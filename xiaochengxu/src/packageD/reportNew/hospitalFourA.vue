/*
*住院路径第4-1个问题
*/
<template>
  <section>
    <report-progress
      :progress="progess"
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
        isLoading:false,
        reportContentList:[],
        chooseImg:false,
        progess:'80%',
        question:{
          title:'请拍照上传【处方单】或【药盒】',
          descShow:'便于医生记录病情，指导后续治疗',
          selectText:['拍照上传','没在身边，手写药名','暂时跳过，稍后补充＞'],
        },
        imgList:{
          title:'请拍照上传【处方单】或【药盒】',
          descShow:'便于医生记录病情，指导后续治疗',
          imgSrcArr:[],
          questionType:'2-4',
          imgReport:[],
        }
      }
    },
    watch:{
      imgListLen(){
        if(this.imgListLen){
          this.progess='90%';
        }else {
          this.progess='80%';
        }
      }
    },
    computed:{
        ...mapState(['reportId','doctorCustomerId','patientId','caseId']),
      imgListLen(){
        return this.imgList.imgSrcArr.length
      }
    },
    components:{
      questionSelect,
      imgList,
      reportProgress,
      logoLoading
    },
    methods:{
      selctBtnSubmit(index){
        let url='',_this=this,reportIsFinish=0;
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
            url='/packageD/reportNew/hospitalFourB';
            break;
          case 2:
            reportIsFinish=1;
            url=`/packageA/imSceneDoctor/imSceneDoctor?caseId=${_this.caseId}&doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&reportId=${_this.reportId}&from=report`;
            console.log('wancheng')
            break;
          default:
            break;
        }
        let paramData={
          reportId:_this.reportId,
          sortId:26,
          patientId:_this.patientId,
          doctorId:_this.doctorCustomerId,
          reportIsFinish:reportIsFinish,
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
                url:url
              });
            }else if(index==2){
              console.log('wanchengIM');
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
            if(pageSort=='QB4_1'){
              _this.reportContentList=res.reportMap.reportContentList;
            }else {
              _this.imgList.imgReport=res.reportMap.reportContentList;
              _this.imgList.imgSrcArr=res.reportMap.attList;
            }
          }else{
            if(pageSort=='QB4_1'){
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
        this.getReportInfo('QB4_1',26);
        if(!this.chooseImg){
          this.getReportInfo('QB4_2',27);
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


