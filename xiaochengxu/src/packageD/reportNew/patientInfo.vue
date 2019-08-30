<!--就诊人信息-->

<template>
  <div class="main">
    <question-select
      :question="question"
      @btnIndex="selctBtnSubmit"
      v-if="showQuestion"
    ></question-select>
    <logo-loading v-if="isLoading"></logo-loading>
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询，现在继续去沟通吗？'
          }" v-if="confirmShow"  @cancelClickEvent="confirmShow=false" @ensureClickEvent="toImPage">
    </confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import confirm from 'components/confirm';
  import createMainReport from "common/js/report/createMainReport";//创建主报道信息
  import logoLoading from 'components/LogoLoading';
  import questionSelect from './components/QuestionSelect'
  import getImStatus from "common/js/HttpRequest/getImStatus"; // 找医生流程获取im状态
  import dataLog from "common/js/dataLog/dataLog";
  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  export default {
    components:{
      questionSelect,
      logoLoading,
      confirm
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId', 'doctorMessage'])
    },
    data() {
      return {
        confirmShow:false,
        consultationtype:'',
        imPatientId:'',
        imCaseId:'',
        isLoading:false,
        showQuestion:false,
        question:{
          title:'您本次的就诊方式是',
          descShow:'',
          selectText:['门诊','住院','未就诊']
        }
      }
    },
    onUnload(){
      this.showQuestion=false;
    },
    onLoad(){
      this.showQuestion=true;
    },
    onShow(){
      this.confirmShow=false;
      this.isLoading=false;
      this.consultationtype='';
      this.imPatientId='';
      this.imCaseId='';
      wx.removeStorageSync('reportPatient',true);

      dataLog.enterBrowse({
        resourceId:JSON.stringify({
          doctorId:this.doctorCustomerId
        })
      })
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    methods:{
      ...mapMutations(['setCaseId','setReportId']),
      //跳转IM
      toImPage(){
        let _this=this,url='';
        if (parseInt(_this.consultationtype,10)) {
            url= `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.imPatientId}&caseId=${_this.imCaseId}`;
        } else {
            url=`/packageA/imScene/imScene?patientId=${_this.imPatientId}&caseId=${_this.imCaseId}&from=find`;
        }
        wx.navigateTo({
          url: url,
          complete: () => {
            _this.confirmShow = false;
            _this.consultationtype = "";
            _this.imPatientId = "";
            _this.imCaseId = "";
          }
        });
      },
      /** 去选择部位 */
      toSelectPart() {
        let _this=this;
        _this.loading = true;
        // 找医生流程获取im状态

        const navData = {
          applicationType: '12',
          doctorId: _this.doctorCustomerId,
          doctorName: _this.doctorMessage.fullName
        }

        getImStatus({
          doctorCustomerId:_this.doctorCustomerId,
          patientId:_this.patientId,
        }).then( (data) => {
          let {responseStatus,responseData} = data.responseObject;
          if (responseStatus) {
            let {caseId,isIntoIm,consultationtype} = responseData;
            if(!caseId) {
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(navData)),
                complete: () => {
                  _this.loading = false;
                }
              });
            } else {
              if (isIntoIm) {
                _this.confirmShow = true;
                _this.loading = false;
                _this.imPatientId = _this.patientId;
                _this.consultationtype = consultationtype;
                _this.imCaseId = caseId;
              } else {
                wx.navigateTo({
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(navData)),
                  //url: `/packageE/findDoctorSelectPart/findDoctorSelectPart?patientId=${_this.patientId}&doctorId=${_this.doctorCustomerId}`,
                  complete: () => {
                    _this.loading = false;
                  }
                });
              }
            }
          }
          _this.loading = false;
        }).catch( (err) => {
          console.log(err);
        }).finally( () => {

        });
      },
      selctBtnSubmit(index){
        let _this=this,url='',param,reportType='';
        let types = ["门诊","住院","未就诊"];
        // 就诊信息-就诊方式页面
        dataLog.createTrack({
          actionId: 14226,
          browseType:148,
          pushMessageId:JSON.stringify({doctorId:_this.doctorCustomerId,patientId:_this.patientId,treatType:types[index]})
        });

        switch (index){
          case 0: // 门诊
            reportType=4;
            url='/packageD/reportNew/clinicOne';
            break;
          case 1:// 住院
            reportType=5;
            url='/packageD/reportNew/hospitalOne';
            break;
          case 2: //未就诊 跳转至人体部位选择页面
            // url='/packageE/findDoctorSelectPart/findDoctorSelectPart';

            const data = {
              applicationType: '12',
              doctorId: _this.doctorCustomerId,
              doctorName: _this.doctorMessage.fullName
            }

            wx.navigateTo({
              url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
            })
            break;
        }
        if(reportType){
          param={
            customerId:wx.getStorageSync('userId'),
            patientId:_this.patientId,
            doctorId:_this.doctorCustomerId,
            reportType:reportType
          };
          _this.isLoading=true;
          createMainReport(param).then((res)=>{
            _this.isLoading=false;
            if(res){
              _this.setCaseId(res.caseId);
              _this.setReportId(res.reportId);
              wx.navigateTo({
                url: url
              });
            }
          });
        }else {
          // reportPatient,true;
          wx.setStorageSync('reportPatient',true);
          _this.toSelectPart();
        }


      },
    }
  }
</script>

<style lang="scss" scoped>
.main{
  /*background: #B6B6B6;*/
  background: white;
  min-height: 100%;
}

</style>
