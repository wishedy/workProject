/*
*住院路径第4-3个问题
*/
<template>
  <section class="reportMain">
    <report-progress
      :progress="'90%'"
      v-if="isProgress"
    ></report-progress>
    <!--<question-text-area-->
      <!--:title="textAreaTitle"-->
      <!--:textDesc="textDesc"-->
      <!--:titleTip="titleTip"-->
      <!--@textDesc="textChange"-->
    <!--&gt;</question-text-area>-->
    <section class="question-textarea">
      <article class="question-title">
        <span>{{textAreaTitle}}</span>
        <p v-if="titleTip" class="question-desc">{{titleTip}}</p>
      </article>
      <figure class="textarea-con">
      <textarea
        v-model="textDesc"
        @input="contentLimit"
        placeholder="请输入"
      ></textarea>
        <span class="textarea-num" :class="{'active':textareaLen<20}">{{textareaLen}}</span>
      </figure>
    </section>
    <form action="" @submit="formSubmit" report-submit="true">
      <button class="question-next"
              type="submit"
              formType="submit"
              @click="nextSubmit"
              :class="{'active':textDesc}"
      >下一步</button>
    </form>
    <logo-loading v-if="isLoading"></logo-loading>
  </section>
</template>

<script>
  import api from 'common/js/util/util';
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import reportProgress from './components/ReportProgress';
  import questionTextArea from './components/QuestionTextarea'
  import createReport from "common/js/report/createReport";//完善保存信息
  import getReportList from "common/js/report/getReportList";//获取保存信息
  import logoLoading from 'components/LogoLoading';
  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('reportNew');
  export default {
    data(){
      return{
        isProgress:false,
        reportContentList:[],
        isLoading:false,
        textAreaTitle:'请填写药名名称和用法用量',
        textDesc:'',
        textareaLen:100,
        titleTip:'',
        isBtnClick:false
      }
    },
    components:{
      questionTextArea,
      reportProgress,
      logoLoading
    },
    computed:{
      ...mapState(['reportId','doctorCustomerId','patientId','caseId'])
    },
    methods:{
      textChange(text){
        this.textDesc=text;
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      contentLimit() {
        let _this=this,getLen=api.getByteLen(_this.textDesc);
        _this.textareaLen=100-getLen;
        if (_this.textDesc&& getLen> 100){
          _this.textDesc=api.getStrByteLen(_this.textDesc,100);
          _this.textareaLen=0;
        }
      },
      //下一步
      nextSubmit(){
        let _this=this;
        if(this.textDesc&&(!this.isBtnClick)){
          this.isBtnClick=true;
          console.log('wancheng');
          let paramData={
            reportId:_this.reportId,
            sortId:28,
            patientId:_this.patientId,
            doctorId:_this.doctorCustomerId,
            reportIsFinish:1,
            reportContentList:[
              {id:'',reportValue:_this.textDesc},
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
          // pageSort:'QB4_3'
          sortId:28,
        };
        _this.isLoading=true;
        getReportList(paramData).then((res)=>{
          _this.isLoading=false;
          if(res&&res.reportMap&&res.reportMap.reportContentList&&res.reportMap.reportContentList.length){
            _this.reportContentList=res.reportMap.reportContentList;
            _this.textDesc=_this.reportContentList[0].prescribeMethod;
            _this.contentLimit();
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
    },
    onLoad(){
      this.textDesc='';
      this.textareaLen=100;
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
  .question-textarea{
    .question-title{
      margin-left: 30px;
      padding: 72px 0 66px;
      font-size:46px;
      font-family:PingFangSC-Medium;
      font-weight:bold;
      color:rgba(51,51,51,1);
      line-height:46px;
      .question-desc{
        width:690px;
        height:68px;
        background:rgba(88,128,237,0.08);
        border-radius:6px;
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:68px;
        padding-left: 20px;
        box-sizing: border-box;
        margin-top: 40px;
      }
    }
    .textarea-con{
      position: relative;
      width:690px;
      margin: auto;
      margin-bottom: 30px;
      textarea{
        border:1px solid #999999;
        width: 100%;
        height: 242px;
        font-size:34px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(34,34,34,1);
        line-height:34px;
        padding: 26px 24px 38px 20px;
        box-sizing: border-box;
        &::placeholder{
          color: #aaaaaa;
        }
      }
      .textarea-num{
        position: absolute;
        bottom: 16px;
        right: 12px;
        font-size:26px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(170,170,170,1);
        line-height:28px;
        &.active{
          color:rgba(252,116,106,1);
        }
      }
    }
  }
</style>

