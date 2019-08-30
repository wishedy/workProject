<template>
  <section class="interllingent-main">
    <!--<article class="main-message-time">-->
      <!--<span class="time-icon"></span>-->
      <!--<p class="new-service-time">服务时间：{{serviceTime}}</p>-->
    <!--</article>-->
    <section class="main-message-interllingent " :class="{'picker-show':isShowPicker}">
      <!--时间戳-->
      <p class='time-stamp'>{{nowDate}}</p>
      <MachineMessage
        v-for="(item,index) in messageList"
        :key="index"
        :questionItem="item"
        :partId="partId"
        :postData="postData"
        @nextQuestion="nextQuestion"
      ></MachineMessage>
    </section>
    <section class="picker-main" v-if="isShowPicker">
      <section class="picker-view-container">
        <h3 class="picker-header">
          <span class="picker-tittle">患病时长</span>
          <span class="picker-sure-btn" @click="pickerSure">确定</span>
        </h3>
        <picker-view
          class="picker-main-container"
          indicator-style="height: 34px; font-size:20px;"
          :value="dateObj.index"
          @change="bindPickerChange"
        >
          <picker-view-column>
            <view v-for="(item,index) in dateObj.array" class="picker-item" :key="index" style="line-height: 34px">
              {{item.optionName}}
            </view>
          </picker-view-column>
        </picker-view>
      </section>
    </section>
    <confirm :confirmParams="{
          'ensure':'继续填写',
          'cancel':' 重新填写',
          'title':'是否继续上次咨询？'
          }" v-if="showTip" :showFlag.sync="showTip" @cancelClickEvent="cancelShowTip()"
             @ensureClickEvent="ensureShowTip()">
    </confirm>
  </section>
</template>

<script>
  /**
   * @Desc：智能分诊
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by zh 2019/7/3
   */
  import api from 'common/js/util/util';
  import localStorage from "localStorage";
  import confirm from "components/confirm";
  // import getTriageWorkingTime from "common/js/HttpRequest/getTriageWorkingTime"; // 获取分诊工作时间
  import MachineMessage from './components/MachineMessage'
  import dataLog from "dataLog";
  import {mapMutations} from "vuex";
  const triageList = {
    question: api.httpEnv() + "/mcall/cms/part/question/relation/v1/geQuestionAndOptionList/",
    saveTmpData: api.httpEnv() + "/mcall/cms/part/illness/relation/v1/saveTmpData/",
    getTmpData: api.httpEnv() + "/mcall/cms/part/illness/relation/v1/getTmpData/",
    imgUpload: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/create/"
  };

  export default {
    name: "intelligent-triage",
    data() {
      return {
        dateObj: {
          array: [],
          index: [2],
        },
        serviceTime:'',
        showTip:false,
        isFinish:false,
        isShowPicker: false,
        partId: '',//部位id
        sex:'',
        doctorId:'',
        partName:'',
        applicationType: '0',//流程类型1-快速问诊；2-找医生
        scrollHeight: 0,
        scrollTimer: null,
        questionList: [],
        getTmpDataList:[],
        postData:{
          optionList:[],
          inspectionAttId:''
        },
        messageList: [],
        currentIndex: 0
      }
    },
    computed:{
      nowDate(){
        // 10-09 15:05
        let myDate = new Date,
            year = myDate.getFullYear(),//获取当前年
            yue = myDate.getMonth()+1,//获取当前月
            date = myDate.getDate(),//获取当前日
            h = myDate.getHours(),//获取当前小时数(0-23)
            m = myDate.getMinutes(),//获取当前分钟数(0-59)
            s = myDate.getSeconds();//获取当前秒
        if(yue<10){
          yue= `0${yue}`
        }
        if(date<10){
          date= `0${date}`
        }
        if(h<10){
          h= `0${h}`
        }
        if(m<10){
          m= `0${m}`
        }
        return `${yue}-${date} ${h}:${m}`
      }
    },
    components: {
      MachineMessage,
      confirm
      // PickerComponent
    },
    methods: {
      ...mapMutations(["setOrderMessage"]),
      //继续填写
      ensureShowTip(){
        this.showTip=false;
        if(this.isFinish){
          this.finishJump();
        }else {
          this.messageList=this.getTmpDataList.messageList;
          this.postData=this.getTmpDataList.severData;
          this.questionList=this.getTmpDataList.questionList;
          if(this.messageList.length){
            this.currentIndex=this.messageList.length;
            if(this.questionList[this.messageList.length]){
              this.messageListAdd(this.questionList[this.messageList.length])
            }else {
              this.finishJump();
            }
            // this.getQuestionList(this.messageList.length)
          }else {
            this.getQuestionList(0)
          }
        }


      },
      //重新填写
      cancelShowTip(){
        this.showTip=false;
        this.getTmpDataList=[];
        this.messageList=[];
        this.postData={
          optionList:[],
          inspectionAttId:''
        };
        this.currentIndex=0;
        this.questionList=[];
        this.isFinish=false;
        this.getQuestionList(0)
      },
      //跳转
      finishJump(){
        this.isFinish=true;
        let query={
          partId:this.partId,
          partName:this.partName,
          applicationType:this.applicationType,
          sex:this.sex,
          doctorId:this.doctorId
        };
        let orderMessage={
            mainSymptom: '',                                                 //主诉
            continueTime: '',                                              //患病时长
            treatment: '',                                                   //治疗情况
            illness: '',                                 //病情补充
            docHelp: '',                                            //想要医生帮助
            imageList: []                                                        //图片资料
        };
        this.messageList.map((value,index)=>{
          if(
            value.questionName ==='symptom_1'
          ){
            if(this.messageList[index].answer !== '其他'){
              orderMessage.mainSymptom+=this.messageList[index].answer;
            }
            // if(this.postData.optionList[1].questionName === 'pain_degree_1.3'){
            //   orderMessage.mainSymptom+=this.postData.optionList[1].optionDesc;
            // }
          }
          if(
            (value.questionName==='else_4.1' && index===1)||
             value.questionName==='else_symptom_1.2'
          ){
            orderMessage.mainSymptom+=this.messageList[index].answer;
          }
          if(
            value.questionName==='time_2'
          ){
            orderMessage.continueTime+=this.messageList[index].answer;
          }
          if(value.questionName==='diagnosis_treat_4.2'){
            orderMessage.treatment+=this.messageList[index].answer;
          }
          if(
            value.questionName==='to_the_hospital_3' ||
            (value.questionName==='else_4.1'&&index !==1)
          ){
            orderMessage.illness+=this.messageList[index].answer+'医院';
          }
          if(
            value.questionName==='ask_else_6' ||
            value.questionName==='ask_doctor_5.1'
          ){
            orderMessage.docHelp+=this.messageList[index].answer;
          }
          if(value.imgList&&value.imgList.length){
            orderMessage.imageList=this.messageList[index].answer;
          }
        });
        console.log(orderMessage)
        // console.log('query ---> ', query)
        if(this.applicationType == 0){
          //partId:部位id;applicationType:0-快速问诊；1-找医生;sex性别，doctorName doctorId
          wx.navigateTo({
            url: `/packageB/consultPatientList/consultPatientList?query=${encodeURIComponent(JSON.stringify(query))}`
          });
        }else{
          this.setOrderMessage({
            medicalShow: {
              mainSymptom: orderMessage.mainSymptom,                                                 //主诉
              continueTime: orderMessage.continueTime,                                              //患病时长
              treatment: orderMessage.treatment,                                                   //治疗情况
              illness: orderMessage.illness,                                 //病情补充
              docHelp: orderMessage.docHelp,                                            //想要医生帮助
              imageList: orderMessage.imageList?orderMessage.imageList:'没有'                                                       //图片资料
            },
            medicalCreate:{

            }
          });
          wx.navigateTo({
            url: `/packageE/findDoctorPatientList/findDoctorPatientList?query=${encodeURIComponent(JSON.stringify(query))}`
          });
        }
      },
      //上传数据
      saveTmpData(){
        // let messageList=[];
        // this.messageList.map((item,index)=>{
        //   messageList.push({
        //     answer:item.answer,
        //     questionId:item.questionId,
        //   })
        // });
        // console.log(messageList)
        let sex=1;
        switch (this.sex){
          case 'man':
            sex=1;
            break;
          case 'woman':
            sex=2;
            break;
          case 'kid':
            sex=3;
            break;
          default:
            sex=1;
            break;
        }
        api.ajax({
          url: triageList.saveTmpData,
          method: "post",
          data: {
            partId:this.partId,
            sex: sex,
            openId:wx.getStorageSync('openId'),
            data:JSON.stringify({ messageList:this.messageList,severData:this.postData,questionList:this.questionList})
          },
          done: data => {
            if (data&& data.responseObject && data.responseObject.responseStatus) {
                if(this.isFinish){
                 this.finishJump();
                }
            } else {
              console.log('shibai');
            }
          }
        });
      },
      //获取数据
      getTmpData(){
        let sex=1;
        switch (this.sex){
          case 'man':
            sex=1;
            break;
          case 'woman':
            sex=2;
            break;
          case 'kid':
            sex=3;
            break;
          default:
            sex=1;
            break;
        }
        api.ajax({
          url: triageList.getTmpData,
          method: "post",
          data: {
            partId:this.partId,
            sex:sex,
            openId:wx.getStorageSync('openId')
          },
          done: data => {
            // this.getQuestionList(0);
            if (data&& data.responseObject && data.responseObject.responseStatus) {
                if(
                  data.responseObject.responseData &&
                  data.responseObject.responseData.dataList
                ){
                  if(
                    data.responseObject.responseData.dataList.messageList &&
                    data.responseObject.responseData.dataList.messageList.length
                  ){
                    this.showTip=true;
                    this.getTmpDataList=data.responseObject.responseData.dataList;
                  }else {
                    this.showTip=false;
                    this.getQuestionList(0);
                  }

                }else {
                  this.showTip=false;
                  this.getQuestionList(0);
                }
            } else {
              wx.showToast({
                title: '获取历史数据失败',
                icon: 'none'
              });
            }
          }
        });
      },
      dataInit(){
        this.dateObj={
          array:[],
          index: [2]
        };
        this.isFinish=false;
        this.isShowPicker=false;
        this.showTip=false;
        this.partId='';
        this.partName='';
        this.serviceTime='';
        this.applicationType='0';
        this.scrollHeight=0;
        this.scrollTimer=null;
        this.questionList=[];
        this.getTmpDataList=[];
        this.postData={
          optionList:[],
          inspectionAttId:''
        };
        this.messageList=[];
        this.currentIndex=0;
      },
      pickerSure() {
        this.isShowPicker = false;
        this.messageList[this.messageList.length-1].answer = this.dateObj.array[this.dateObj.index[0]].optionName;
        this.dateObj.array = [];
        this.postData.optionList.push({
          questionId:this.messageList[this.messageList.length-1].questionId,
          optionIdList:this.messageList[this.messageList.length-1].optionList[this.dateObj.index[0]].optionId,
          optionDesc:this.messageList[this.messageList.length-1].answer,
          questionName:this.messageList[this.messageList.length-1].questionName,
          refOptionId:this.messageList[this.messageList.length-1].optionList[this.dateObj.index[0]].refOptionId,
          partId:this.partId
        });
        this.nextQuestion();
      },
      bindPickerChange(e) {
        console.log(e.mp.detail.value);
        this.dateObj.index=e.mp.detail.value;
      },
      getQuestionList(index) {
        wx.showLoading({
          title: "正在加载..."
        });
        api.ajax({
          url: triageList.question,
          method: "post",
          data: {
            partId: this.partId,
            applicationType: 5
          },
          done: data => {
            wx.hideLoading();
            if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
              let dataList = data.responseObject.responseData.dataList;
              this.questionList = this.changeDataList(dataList);
              this.messageListAdd(this.questionList[index]);
            } else {

            }
          }
        });
      },
      //处理数组增加父级id
      changeDataList(data){
        let list=[],
            forList=(optionList,questionId)=>{
          let opList=[];
              optionList.map((val,ind)=>{
                val.refOptionId='';
                if(val.questionList&&val.questionList.length){
                  val.questionList.map((v,i)=>{
                    v.refOptionId=val.optionId;
                    if( v.optionList&& v.optionList.length){
                      v.optionList=forList(v.optionList,v.questionId)
                    }

                  })
                }
                opList.push(val);
              });
              return opList;
            };
        data.map((value,index)=>{
          value.refOptionId='';
          if(value.optionList&&value.optionList.length){
            value.optionList=forList(value.optionList,value.questionId,)
          }
          list.push(value);
        })
        return list;
      },
      messageListAdd(data) {
        dataLog.createTrack({
          actionId: 14262,
          keyword:data.questionName,
          locationId: this.currentIndex
        });
        this.messageList.push({
          loading: true
        });
        setTimeout(() => {
          this.messageList.pop();
          this.messageList.push({
            questionDesc: data.questionDesc,
            questionName: data.questionName,
            questionType: Number(data.questionType),
            optionList: data.optionList,
            imgList: data.imgList||[],
            questionValue: data.questionValue||'',
            answer: data.answer||'',
            questionList: data.questionList||'',
            questionId: data.questionId,
            refOptionId: data.refOptionId,
          });
          this.scrollToBottom();
          if (Number(data.questionType) === 6) {
            this.isShowPicker = true;
            this.dateObj.array = data.optionList;
          } else {
            this.isShowPicker = false;
          }
        }, 1000)
      },
      nextQuestion(data) {
        this.currentIndex+=1;
        if(data){
          data.map((item,index)=>{
            this.questionList.splice(this.currentIndex+index,0,item)
          });
        }
        this.saveTmpData();
        if(this.currentIndex < this.questionList.length){
          this.messageListAdd(this.questionList[this.currentIndex]);
        }else {
          this.isFinish=true;
          this.scrollToBottom();
        }
      },
      scrollToBottom(delayTime = 200) {
        if (this.scrollTimer) {
          clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: this.scrollHeight + 10000,
            duration: 0
          })
        }, delayTime)
      },
      /** 获取服务时间 */
      getConsultPrice() {
        console.log("获取服务时间");
        getTriageWorkingTime({
          visitSiteId: api.getSiteId()
        }).then(data => {
          let {
            responseObject: {
              responseStatus, responseData
            }
          } = data;
          if (responseStatus && !!responseData) {
            let {dataList: {responseData: {serviceEndTime, serviceStartTime}}} = responseData;

            let startTimeArray = serviceStartTime.split(":"),
              endTimeArray = serviceEndTime.split(":");
            if (startTimeArray[0].length === 1) {
              startTimeArray[0] = "0" + startTimeArray[0];
              serviceStartTime = startTimeArray.join(':');
            }
            let myDate = new Date();
            let currentHours = myDate.getHours(); //获取当前小时数(0-23)
            let currentMinutes = myDate.getMinutes(); //获取当前分钟数(0-59)
            this.serviceTime = `${serviceStartTime}-${serviceEndTime}`;
            if ((currentHours < parseInt(startTimeArray[0]) || (currentHours == parseInt(startTimeArray[0]) && currentMinutes < parseInt(startTimeArray[1]))) || (currentHours > parseInt(endTimeArray[0]) || (currentHours == parseInt(endTimeArray[0]) && currentMinutes > parseInt(endTimeArray[1])))) {
              this.serviceTime = this.serviceTime + " 休息中";
            }
          }
        });
      },
    },
    onShow(){
      dataLog.enterBrowse();
      if (localStorage.getItem("PCIMLinks")) {
        wx.reLaunch({
          url: "/pages/mIndex/mIndex"
        })
      }
      if(this.isFinish){
        this.showTip=true;
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onLoad(option) {
      if(option.query){
        option=JSON.parse(decodeURIComponent(option.query));
      }
      this.dataInit();
      // this.getConsultPrice();
      //partId:部位id;applicationType:1-快速问诊；2-找医生;sex性别，doctorName doctorId
      if(option.partId){
        this.partId=option.partId;
      }else {
        this.partId='1502698533928';
      }
      if(option.doctorName){
        wx.setNavigationBarTitle({
          title: `${option.doctorName}医生医助`,
        });
      }else {
        wx.setNavigationBarTitle({
          title: "分诊医生",
        });
      }
      if(option.applicationType){
        this.applicationType=option.applicationType;
      }else {
        this.applicationType='0';
      }
      if(option.sex){
        this.sex=option.sex;
      }else {
        this.sex='man';
      }
      if(option.partName){
        this.partName=option.partName;
      }else {
        this.partName='腰部';
      }
      if(option.doctorId){
        this.doctorId=option.doctorId;
      }else {
        this.doctorId='';
      }
      this.getTmpData();
    }
  }
</script>

<style scoped lang="scss">
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  button::after {
    display: none;
  }

  .interllingent-main {
    background: #fff;
    position: relative;
    min-height:100%;
    .main-message-time {
      padding: 18px 30px;
      font-size: 28px;
      text-align: left;
      color: #495575;
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      background: #ffffff;
      z-index: 5;
      white-space: nowrap;
      border-bottom: 1px solid #E8EDED;
      line-height: 28px;
      span {
        color: #ff7171;
        vertical-align: middle;
        display: inline;
        padding: 0 8px;
        font-size: 28px;
      }
      p {
        display: inline;
        vertical-align: middle;
        font-size: 28px;
        padding: 0;
      }
      .time-icon {
        display: inline-block;
        width: 28px;
        height: 28px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.4.0/time_2.png") no-repeat center;
        background-size: 100% 100%;
        // margin-bottom: 4px;
        margin-right: 8px;
        padding: 0;
        vertical-align: middle;
      }
    }
    .main-message-interllingent {
      /*padding: 76px 22px 100px;*/
      padding: 0 22px 100px;
      &.picker-show {
        padding-bottom: 700px;
      }
      .time-stamp {
        font-size: 26px;
        color: #aaa;
        text-align: center;
        margin: 30px 0 36px;
      }
    }
  }

  .picker-main {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .1);
    position: fixed;
    bottom: 0;
    left: 0;
    .picker-view-container {
      width: 100%;
      height: 500px;
      background: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      .picker-main-container {
        width: 100%;
        height: 100%;
      }
      .picker-header {
        text-align: center;
        width: 100%;
        height: 90px;
        font-size: 34px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        line-height: 90px;
        border-bottom: 1px solid #E3E5E9;
        position: relative;
        .picker-tittle {
          color: rgba(102, 102, 102, 1);
          display: block;
        }
        .picker-sure-btn {
          position: absolute;
          right: 30px;
          top: 0;
          color: rgba(46, 169, 254, 1);
        }
      }
      .picker-item {
        text-align: center;
        font-size: 40px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 40px;
        width: 100%;
      }
    }

  }

</style>
