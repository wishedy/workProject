<template>

  <section class="main-inner" @click="deleteMsgIndex=-1">
    <article class="main-message-time">
      <span class="time-icon"></span><p class="new-service-time">服务时间：{{serviceTime}}</p>
    </article>

    <section class="main-message" :class="{'showBottomPd':footerBottomFlag}">
      <section class="main-message-wrapper" v-for="(msg,index) in msgList" :key="index">
        <!--时间戳-->
        <p class='time-stamp' v-if="timeStampShowList[index]==1">{{msg.timeStamp}}</p>
        <!--咨询单-->
        <MedicalReport
          v-if="msg.type==='custom' && msg.content.type==='medicalReport'"
          :medicalReportMessage="msg.content"
          :triageType="triageType"
          :caseId="parseInt(caseId)"
          :patientId="parseInt(patientId)"
          @changeType="changeTriageType"
        >
        </MedicalReport>
        <!--视诊-->
        <Triage
          v-if="msg.type==='custom' && msg.content.type === 'videoTriage'"
          :triageMessage="msg.content"
        >
        </Triage>
        <!--初诊建议-->
        <PreviewSuggestion
          v-if="msg.type==='custom' && msg.content.type==='previewSuggestion'"
          :previewSuggestionMessage="msg.content"
          :caseId="parseInt(caseId)"
          :patientId="parseInt(patientId)"
          :showFlag="showFlag"
          @scrollToBottom="scrollToBottom"
          @scrollElement='scrollElement'
        >
        </PreviewSuggestion>
        <!--检查检验-->
        <CheckSuggest
          v-if="msg.type==='custom' && msg.content.type==='checkSuggestion'"
          :checkSuggestMessage="msg.content"
          @scrollToBottom="scrollToBottom"
          @scrollElement='scrollElement'
        >
        </CheckSuggest>
        <!--文本消息-->
        <ContentText v-if="msg.type==='text' && msg.text" :contentMessage="msg"
                     :userData="userData"
                     :targetData="targetData"
                     @deleteMsgEvent="deleteMsgEvent(msg)"
                     @longTouchEmitHandler="longTouchEmitHandler(index)"
                     :currentIndex="index"
                     :deleteMsgIndex="deleteMsgIndex">

        </ContentText>
        <!--图像消息-->
        <ImageContent
          v-if="(msg.type==='file'||msg.type==='image') && msg.file &&msg.file.ext!=='pdf'"
          :imageMessage="msg"
          ref="bigImg" :imageList="imageList"
          :currentIndex="index"
          @deleteMsgEvent="deleteMsgEvent(msg)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
          :deleteMsgIndex="deleteMsgIndex"
          :userData="userData"
          :targetData="targetData">
        </ImageContent>
        <!--文件消息-->
        <FileMessage
          v-if="msg.type==='file'&&msg.file&&msg.file.ext==='pdf'"
          :fileMessage="msg"
          :userData="userData"
          :targetData="targetData"
          :currentIndex="index"
          :fileProgress="fileProgress"
          :deleteMsgIndex="deleteMsgIndex"
          @deleteMsgEvent="deleteMsgEvent(msg)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
        >
        </FileMessage>
        <!-- 图集消息 -->
        <MulitpleImage
          v-if="msg.type==='custom' && (msg.content.type === 'mulitpleImage'||msg.content.type ==='multipleImage' )"
          :imageMessage="msg"
          :userData="userData"
          @deleteMsgEvent="deleteMsgEvent(msg)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
          :targetData="targetData"
          :deleteMsgIndex="deleteMsgIndex"
          :currentIndex="index"
        >
        </MulitpleImage>
        <!-- 视频消息 -->
        <VideoMessage
          v-if="msg.type==='video' && msg.file"
          :videoMessage="msg"
          :userData="userData"
          :targetData="targetData"
          @deleteMsgEvent="deleteMsgEvent(msg)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
          :deleteMsgIndex="deleteMsgIndex"
          :currentIndex="index"
          :inputBoxShow.sync="inputBoxShow"
        ></VideoMessage>
        <!--上传视诊-->
        <section class="main-message-box"
                 v-if="msg.type==='custom' && msg.content.type === 'triageSendTips'">
          <article
            class="main-message-box-item my-message"
            :data-clientid="msg.idClient"
          >
            <i class="fail-button" style="display:none">
              <img src="https://m.allinmed.cn/static/image/imScene/error_tips.png" alt="">
            </i>
            <figcaption class="main-message-content">
              <p>患者已上传视诊资料</p>
            </figcaption>
            <figure class="main-message-img" v-if="msg.from===userData.account">
              <img :src="logoUrl" alt="">
            </figure>
          </article>
        </section>
        <!--上传检查检验-->
        <section class="main-message-box"
                 v-if="msg.type==='custom' && msg.content.type === 'checkSuggestSendTips'">
          <article
            class="main-message-box-item my-message"
            :data-clientid="msg.idClient"
          >
            <i class="fail-button" style="display:none">
              <img src="https://m.allinmed.cn/static/image/imScene/error_tips.png" alt="">
            </i>
            <figcaption class="main-message-content">
              <p>检查资料已上传</p>
            </figcaption>
            <figure class="main-message-img" v-if="msg.from===userData.account">
              <img :src="logoUrl" alt="">
            </figure>
          </article>
        </section>
        <!-- 审核通过消息 -->
        <reviewCaseSuccess v-if="msg.type==='custom' && msg.content.type === 'reviewCaseSuccess'"
                           :doctorCustomerId="doctorCustomerId"
        >
        </reviewCaseSuccess>
        <!-- 审核不通过消息 -->
        <!--<reviewCaseFail v-if="msg.type==='custom' && msg.content.type === 'reviewCaseFail'"-->
        <!--&gt;-->
        <!--</reviewCaseFail>-->
        <!--一般咨询结束-->
        <MiddleTips
          v-if="msg.type==='custom' && msg.content.type === 'notification' && msg.content.data.actionType == 5"
          :tipsType="5"
          :msg = 'msg'
        >
        </MiddleTips>
        <!--自己找医生审核通过咨询结束-->
        <MiddleTips
          v-if="msg.type==='custom' && msg.content.type === 'notification' && msg.content.data.actionType == 7"
          :tipsType="7"
        >
        </MiddleTips>
        <!--拒绝咨询-->
        <MiddleTips
          v-if="msg.type==='custom' && msg.content.type === 'refusePatient'"
          :tipsType="6"
          :tipsText="msg.content.text"
        >
        </MiddleTips>
        <!--消息撤回提示-->
        <section class="main-message-box grey-tips"
                 v-if="msg.type === 'custom' && msg.content.type === 'deleteMsgTips'">
          <figcaption class="first-message">
            <p v-if="msg.from===targetData.account">分诊医生撤回了一条消息</p>
            <p v-if="msg.from!==targetData.account">您撤回了一条消息</p>
          </figcaption>
        </section>
        <!-- 健康卡注册提示 -->
        <section class="main-message-box grey-tips"
                 v-if="msg.type === 'healthCard'">
          <figcaption class="first-message" @click="goToGetHealthCard">
            <p class="getHealthCard-one">领取居民健康卡，有利于医生了解您的病情</p>
            <p class="getHealthCard">立即领取 ></p>
          </figcaption>
        </section>
        <!--消息反垃圾提示-->
        <!--<section class="main-message-box anti-spam-tips"-->
          <!--v-if="msg.type === 'custom' && msg.content.type === 'sensitiveTip'">-->
          <!--<figcaption class="anti-spam-con">-->
            <!--<p class="anti-spam-text">您可能发送了不良用语，请乐观积极与医生沟通以获 取指导。（如系统误判，请忽略此消息）</p>-->
          <!--</figcaption>-->
        <!--</section>-->
      </section>
    </section>
    <!--底部提示-->
    <footer :class="footerPosition" v-if="inputBoxShow &&triageType!==0">
      <section class="footer-box-top">
        <section class="main-input-box-plus"
                 @click='showTabbar'>
          <i class="icon-im-plus"></i>
        </section>
        <figure class="main-input-box-textarea-inner">
          <form class="patientForm" @submit="formSubmitName" report-submit="true" id="baseIm">
            <section class="area-content">
              <input class="main-input-box-textarea"
                     :disabled="disabled"
                     type="text"
                     v-model="sendTextContent"
                     maxlength="500"
                     @focus="scrollToBottom" cursor-spacing="5"/>
            </section>
            <button class="main-input-box-send" :class="{'on':sendTextContent.length}" @click="sendMessage"
                    type="submit" formType="submit">发送
            </button>
          </form>
        </figure>

      </section>
      <ul class="footer-box-bottom" v-if="footerBottomFlag">
        <li class="bottom-item" v-if="toolbarConfig.image" @click="selectImage">
          <figure class="bottom-item-content">
            <img class="bottom-item-image" src="https://m.allinmed.cn/static/image/imScene/picture@2x.png" width="350"
                 height="234"/>
            <figcaption class="bottom-item-description">图片</figcaption>
          </figure>
        </li>
        <li class="bottom-item" v-if="toolbarConfig.video && !isIPad" ref="videoSendBox" @click="selectVideo">
          <figure class="bottom-item-content">
            <img class="bottom-item-image" src="https://m.allinmed.cn/static/image/imScene/pictures@2x.png"
                 width="350"
                 height="234"/>
            <figcaption class="bottom-item-description">视频</figcaption>
          </figure>

        </li>
      </ul>
    </footer>

    <Suggestion :customerId="patientCustomerId" :isLeave.sync="isLeave"
                :triageCustomerId="cId"></Suggestion>
    <BackIndex v-if="backIndexShow"></BackIndex>
    <NormalLoading v-if="loading"></NormalLoading>
    <ensure
      :ensureParams="{
        'content':'抱歉，经平台审核，您的咨询不在该医生的接诊范围，请咨询其他匹配医生',
        'ensure':'好的'
      }" v-if="ensureShow" @ensureClickEvent="ensureClickEvent"
    ></ensure>
    <black-list></black-list>
  </section>

</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/5/15.
   */

  // /**************************Common Components**************************/
  import Toast from "components/toast";
  import NormalLoading from "components/loading";
  import confirm from "components/confirm";
  import api from "common/js/util/util";
  // /**************************Common Methods*************************/
  import nimEnv from "common/js/nimEnv/nimEnv"
  import ImBusinessMethods from "common/js/imBaseMethods/imBusinessMethods";
  import storage from "localStorage";
  import dataLog from "dataLog";
  // /**************************ThirdParty Components**************************/
  import NIM from "common/js/nimEnv/NIM_Web_NIM_v5.3.0";
  // /**************************Base Vue-Methods*************************/
  import {createNamespacedHelpers} from "vuex";
  // /**************************Private Methods*************************/
  import ContentText from "./components/content";
  import ImageContent from "./components/image";
  import MiddleTips from "./components/middleTips";
  import MedicalReport from "./components/medicalReport"; // 咨询单组件
  import PreviewSuggestion from "./components/previewSuggestion"; // 初诊建议组件
  import CheckSuggest from "./components/checkSuggest"; // 检查检验组件
  import reviewCaseSuccess from './components/reviewCaseSuccess';// 审核通过消息组件
  import reviewCaseFail from './components/reviewCaseFail';//审核不通过消息组件
  import Triage from "./components/triage"; // 视诊
  import VideoMessage from "./components/video";
  import MulitpleImage from "./components/mulitpleImage";
  import FileMessage from "./components/fileMessage";
  import Suggestion from "components/suggestion";
  import BackIndex from "components/backIndex"; // 返回首页组件
  import blackList from "components/BlackList";//黑名单组件
  import ensure from "components/ensure";
  // /**************************Axios Http Requests*************************/
  import getTriageWorkingTime from "common/js/HttpRequest/getTriageWorkingTime"; // 获取分诊工作时间
  import getMedicalReportDetails from "common/js/HttpRequest/getMedicalReportDetails"; // 获取咨询单详情
  import getNimToken from "common/js/HttpRequest/getNimToken";
  import getCaseInfo from "common/js/HttpRequest/getCaseInfo";
  import getConsultationList from "common/js/HttpRequest/getConsultationList";
  import createConsultation from "common/js/HttpRequest/createConsultation";
  import getConsultationLastTime from "common/js/HttpRequest/getConsultationLastTime";
  import getPatientBase from "common/js/HttpRequest/getPatientBase";
  import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg";
  import sendFormId from "common/js/HttpRequest/sendFormId"; // 发送formId
  import updateConsultationState from "common/js/HttpRequest/updateConsultationState";
  import updateMedicalReport from "common/js/HttpRequest/updateMedicalReport";
import { debug } from 'util';

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/',
    updateTriageType: api.httpEnv() + "/mcall/customer/case/consultation/v1/update/",
  };
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');
  let imBaseMethods;
  let roamingMsgs = []; // 漫游消息
  let scrollTimer = null; // 页面滑动的定时器
  export default {
    name: "index",
    data() {
      return {
        serviceTime: '', // 分诊医生服务时间
        // caseId: "",
        caseType: "",  // 患者与专业医生等病例类型（caseType0-咨询2-手术直约10-老患者报到(诊后报道)11-立即咨询12-找医生(免费)13-找医生(付费)）
        doctorCustomerId: "",
        // patientId: "",
        patientCustomerId: "",
        mainCase: "",
        allMsgsGot: false,
        historyBeginTime: 0,
        isLeave: false,
        disabled: false, // input 是否可以点击 ；
        titleName: "", //document.title 的话术
        loading: true,
        footerBottomFlag: false, // 底部文件选择框是否显示
        receiveTime: "",
        imageList: [],
        consultationId: "",
        setFocus: false,
        timeStampShowList: [],
        orderSourceId: "",
        beginTimestamp: 0,
        inputBoxShow: false,
        triageType:'',
        msgList: [],
        connectFlag: false, // 是否连接上
        showFlag: false, // 是否触发 onShow 生命周期；
        userData: {
          account: "",
          token: ""
        },
        //分诊目标数据
        targetData: {
          account: "1_doctor00001"
        },
        sendTextContent: "",
        footerPosition: "main-input-box",
        scrollHeight: "",
        deleteMsgIndex: -1,
        toastTips: "",
        toastShow: false,
        connectNum: 0,
        destroyIM: true, // 是否卸载IM；
        isIPad: false, // 是否是 iPad
        backIndexShow: false, // 返回首页是否显示，
        sendTextFlag : true, // 是否可以发送文字消息
        sendDataList:{},
      }
    },
    onLoad() {
      console.log('onLoad');
      //是否显示回首页的悬浮按钮
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      this.msgList = [];
      this.sendDataList = {};
      this.imageList = []; // 清空查看大图数组
      this.timeStampShowList = []; // 是否显示时间清空
      this.sendTextFlag = true;
      this.destroyIM = true;
      const query = this.$root.$mp.query;
      console.log(query);
      // this.caseId = query.caseId;
      this.setCaseId(query.caseId); // 设置 vuex 中的caseId
      // this.patientId = query.patientId;
      this.setPatientId(query.patientId); // 设置 vuex 中的patientId
      this.patientCustomerId = wx.getStorageSync("userId");
      this.allMsgsGot = false;
      this.userData = {
        account: "0_" + this.caseId,
        token: ""
      };
      this.isIPad = wx.getSystemInfoSync().model.includes("iPad") ? true : false;
      this.getCaseBaseInfo();// 通过caseId 获取 case 的基本信息
      this.getPatientBase(); // 获取患者的基本信息
      wx.getNetworkType({
        success: (res) => {
          const networkType = res.networkType;
          if (networkType === "none") {
            wx.showToast({
              title: "网络中断，请检查您的网络状态",
              icon: "none",
              duration: 2000,
              mask: true,
            })
          }
        }
      });

      wx.onNetworkStatusChange((res) => {

        console.log("netStatus:");
        console.log(res);
        if (res && !!res.isConnected) {
          if (this.connectNum === 0) {
            this.getUserBaseData();
          }
        } else {
          this.connectNum = 0;
          wx.showToast({
            title: "网络中断，请检查您的网络状态",
            icon: "none",
            duration: 2000,
            mask: true,
          });
          if (this.nim) {
            this.nim.disconnect({
              done: () => {
                console.log('destroy really done!');
                this.getUserBaseData();
              }
            });
          }
        }
      });

    },
    onUnload() {
      console.log('onUnload');
      if (this.nim && this.nim.disconnect) {
        this.nim.disconnect({
          done: () => {
            this.nim = {};
            console.log(this.nim);
            console.log('onUnload destroy really done!');
          }
        });
      }
      this.msgList = [];
      this.triageType = '';
      this.imageList = []; // 清空查看大图数组
      this.timeStampShowList = []; // 是否显示时间清空
      this.setTargetMsg({});
      this.doctorCustomerId = "";
      this.patientCustomerId = "";

      this.historyBeginTime = 0;
      this.allMsgsGot = false;
      this.inputBoxShow = false;
      this.footerBottomFlag = false;
      this.connectNum = 0;
      clearTimeout(scrollTimer);
      //清除缓存
      storage.removeItem('triageTips');
      storage.removeItem('checkSuggestTips');
    },

    onShow() {
      console.log("onShow");
      if (this.$root.$mp.query.from === "find") {
        dataLog.enterBrowse({
          browseType: "100",
          opDesc: "想要医生的帮助-找医生（小程序）"
        })
      } else {
        dataLog.enterBrowse({
          browseType: "115",
          opDesc: "分诊聊天页（小程序）"
        })
      }
      this.showFlag = true; // 触发了 onShow 的生命周期，在 watch 中需要监听im 连接；
      console.log(this.destroyIM)


      if (this.destroyIM) {
        if (this.nim && this.nim.disconnect) {
          console.log("SDK Destory...");
          this.nim.disconnect({
            done: () => {
              this.nim = {};
              this.connectNum = 0;
              console.log('destroy really done!');
              this.getUserBaseData()
            }
          });
        } else {
          this.connectNum = 0;
          console.log("SDK已销毁...初始化开始");
          this.getUserBaseData();
        }
      }
      if (this.connectNum > 0) {
        console.log('已经连接过了');
        getConsultationList({
          caseId: this.caseId,
          consultationType: 0,
        }).then(data => {
          //无数据....创建新会话
          if (data.responseObject.responseMessage === "NO DATA") {
            console.log('我要创建会话1');
            this.createTriageMessage();
          } else {
            //有数据...获取会话ID并获取当前会话状态
            let dataList = data.responseObject.responseData.dataList;
            this.orderSourceId = dataList[0].consultationId;
            this.getLastTime();
          }
        });
      }
    },
    onHide() {
      dataLog.leaveBrowse();
      console.log('onHide');
      this.showFlag = false;
      if (this.destroyIM && this.nim && this.nim.disconnect) {
        this.nim.disconnect({
          done: () => {
            this.nim = {};
            this.connectNum = 0;
            console.log('onHide destroy really done!');
          }
        });
      }
    },
    onPullDownRefresh() {
      console.log("pull");
      this.pulling = true;
      if (roamingMsgs.length) {
        this.buildRenderMsg("scrollInit", roamingMsgs.splice(0, 20));
      } else {
        if (this.allMsgsGot) {
          this.showToast("没有更多消息了");
        } else {
          console.log('getTimeSlot');
          if (!this.msgList[0]) {
            wx.stopPullDownRefresh();
            return;
          }
          imBaseMethods.getMessageList({
            beginTime: 0,
            endTime: this.msgList[0].time,
            target: this.targetData.account,
            reverse: false,
          }).then(obj => {
            console.log(obj);
            if (obj.msgs.length === 0) {
              this.showToast("没有更多消息了");
              this.allMsgsGot = true;
            } else {
              if (obj.msgs.length <= 100) {
                this.allMsgsGot = true
              } else {
                this.allMsgsGot = false
              }
              roamingMsgs = obj.msgs;
              this.buildRenderMsg("scrollInit", roamingMsgs.splice(0, 20));
            }
          })
        }
        this.allMsgsGot = true;
      }
      wx.stopPullDownRefresh();
    },
    mounted() {
      this.getToolbarConfig();
      this.scrollToBottom();
      this.getConsultPrice(); // 获取分诊服务时间；
      storage.setItem("PCIMLinks", JSON.stringify({caseId: this.caseId, patientId: this.patientId}));
    },
    computed: {
      ...mapState(['caseId', 'patientId', 'patientName', 'isFindDoctor', 'patientInfo', 'toolbarConfig', 'targetMsg', 'logoUrl', 'ensureShow',]),
      ...mapGetters([]),
    },
    methods: {
      ...mapMutations(['setCaseId', 'setCaseType','setPatientName', 'setPatientId', 'setDoctorBaseMsg', 'setPatientInfo', 'setIsFindDoctor', 'setTargetMsg', 'setLogoUrl', 'setConsultation', 'setconsultationState', 'setEnsureShow']),
      ...mapActions(['getToolbarConfig']),
      ////改变分诊转态
      changeTriageType(){
        api.ajax({
          url: XHRList.updateTriageType,
          method: "post",
          data: {
            visitSiteId:api.getSiteId(),
            consultationId:this.orderSourceId,
            triageType:1
          },
          done: data => {
            if (data&& data.responseObject && data.responseObject.responseStatus) {
                this.triageType=1;
                this.scrollToBottom();
              this.tipNewPatient(this.sendDataList)
            } else {
              wx.showToast({
                title: '更新失败',
                icon: 'none'
              });
            }
          }
        });
      },
      // 取消ensure框
      ensureClickEvent() {
        this.setEnsureShow(false);
      },
      /** 获取服务时间 */
      getConsultPrice() {
        console.log("获取服务时间");
        getTriageWorkingTime({
          visitSiteId: api.getSiteId()
        }).then(data => {
          console.log(data);
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
      showTabbar() {
        this.footerBottomFlag = this.footerBottomFlag ? false : true;
        this.scrollToBottom();
      },
      getUserBaseData() {
        // this.getCaseBaseInfo();// 通过caseId 获取 case 的基本信息
        console.log('获取token ， caseId + ' + this.caseId);
        getNimToken({
          accid: this.caseId,
        }).then(data => {
          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseCode == 'fail') {
              this.loading = false;
              this.showToast("获取 Token 失败，请重新咨询");
              return;
            }
            this.userData = {
              account: "0_" + this.caseId,
              token: data.responseObject.responseData.imToken
            };
            console.log(this.connectNum)
            if (this.connectNum == 0) {
              this.connectToNim();
            }
          }
        });
      },
      //通过caseId 获取 case 的基本信息
      getCaseBaseInfo() {
        return getCaseInfo(this.caseId).then(data => {
          let {responseObject: {responseStatus, responseData}} = data;
          if (responseStatus && responseData) {
            let {caseType, doctorId} = responseData.dataList[0];
            console.log(caseType, doctorId);
            this.caseType = caseType;
            this.setCaseType(caseType); // 用来判断进入那种支付页；
            this.doctorCustomerId = doctorId;
            // 用来判断是否需要实名认证的需求，后来取消掉
            if (caseType == "12" || caseType == '13') {
              this.setIsFindDoctor(true);
              this.getDoctorMsg();
              this.isFree = caseType == "12" ? true : false;
            } else {
              this.setIsFindDoctor(false);
              this.titleName = "分诊医生";
              wx.setNavigationBarTitle({
                title: "分诊医生",
              });
            }
          } else {
            console.log("获取case 的基本信息失败");
          }
        })
      },
      sendMessage() {
        if (this.sendTextContent.trim().length === 0 || !this.sendTextFlag) {
          return false;
        } else {
          this.sendTextFlag = false;
          dataLog.createTrack({
            actionId: 14202,
            keyword: this.sendTextContent.trim()
          });
          // let hints=0,
          //   ret = this.nim.filterClientAntispam({
          //     content: this.sendTextContent.trim()
          //   });
          // switch (ret.type) {
          //   case 0:
          //     hints=0;
          //     console.log('没有命中反垃圾词库', ret.result);
          //     break;
          //   case 1:
          //     hints=1;
          //     console.log('已对特殊字符做了过滤', ret.result);
          //     break;
          //   case 2:
          //     hints=1;
          //     console.log('建议拒绝发送', ret.result);
          //     break;
          //   case 3:
          //     hints=1;
          //     console.log('建议服务器处理反垃圾，发消息带上字段clientAntiSpam', ret.result);
          //     break
          // }
          imBaseMethods.sendMessage({
            target: this.targetData.account,
            sendContent: this.sendTextContent.trim(),
            custom: JSON.stringify({
              cType: "0",
              cId: this.cId,
              mType: "0",
              conId: this.orderSourceId,
              // hints:hints
            }),
          }).then(obj => {
            this.setFocus = true;
            this.sendTextFlag = true;
            this.sendMessageSuccess(obj);
            // //命中反垃圾，发送发垃圾消息提醒
            // if(hints==1){
            //   this.sendAntiSpamTips();
            // }
          }).catch((err, obj) => {
            this.sendTextFlag = true;
            this.sendFail(err, obj)
          });
        }
      },
      //发送成功回调
      sendMessageSuccess(msg) {
        console.log(`发送${msg.scene}${msg.type}消息成功, id=${msg.idClient}`);
        if (msg.type === "custom") {
          msg.content = JSON.parse(msg.content);
        }

        if (!(msg.type === "custom" && msg.content.type === "deleteMsgTips")) {
          this.sendTextContent = "";
        }

        this.msgList.push(msg);
        if (msg.type === "text") {
          this.setFocus = true;
        }

        if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
          let idClient = (msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient) || (msg.content.data.imMessage && msg.content.data.imMessage.idClient) || (msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId);
          this.msgList.forEach((element, index) => {
            if (element.idClient === idClient) {
              this.msgList.removeByValue(element);
              return;
            }
          });
        }
        this.getTimeStampShowList(msg);
        msg.timeStamp = this.transformTimeStamp(msg.time); // 给元素添加时间显示属性；
        this.scrollToBottom();
      },
      //发送失败回调
      sendFail(err, msg) {
        console.log(err, msg)
        console.log(`发送${msg.type}消息失败, id=${msg.idClient}`);
      },
      triageDoctorAssign() {
        //是否有分诊会话记录
        //无则创建
        //有则获取
        getConsultationList({
          caseId: this.caseId,
          consultationType: 0,
        }).then(data => {
          //无数据....创建新会话
          if (data.responseObject.responseMessage === "NO DATA") {
            console.log('我要创建会话2');
            this.createTriageMessage();
          } else {
            //有数据...获取会话ID并获取当前会话状态
            let dataList = data.responseObject.responseData.dataList;
            this.orderSourceId = dataList[0].consultationId;
            this.getLastTime();
            this.getMessageList();
          }

        });
      },
      //创建分流
      createTriageMessage() {
        console.log('创建了分流');
        createConsultation({
          caseId: this.caseId,
          customerId: 0,
          patientCustomerId: this.patientCustomerId,
          patientId: this.patientId,
          consultationType: 0,
          consultationState: 4,
          siteId: api.getSiteId(),
          caseType: parseInt(this.caseType)
        }).then(data => {
          if (data.responseObject.responseStatus) {
            //创建就诊信息
            this.orderSourceId = data.responseObject.responsePk;
            this.getLastTime();
            this.getMessageList();
          } else {
            console.log('创建会话失败1');
          }
        }).catch( err => {
          console.log('创建会话失败2');
        });
      },
      // 更新状态
      refreshState(state) {
        updateConsultationState({
          consultationIds: this.orderSourceId,
          consultationState: state //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
        }).then(data => {
          if (data.responseObject.responseStatus) {
            console.log("状态更新成功" + state);
          } else {
            console.log("状态更新失败" + data);
          }
        });
      },
      //获取剩余时间/次数
      getLastTime() {
        getConsultationLastTime({
          caseId: this.caseId,
          consultationType: 0,
        }).then(param => {
          if (param.responseObject.responseStatus) {
            let dataList = param.responseObject.responseData.dataList;

            this.cId = dataList.customerId || 0;

            this.setConsultation(dataList.consultationId);
            this.setconsultationState(dataList.consultationState);

            switch (dataList.consultationState) {//	工单状态会诊状态-1-待就诊0-沟通中1-已结束2-被退回3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复12-待审核13-审核未通过
              case 1:
              case 7:
              case 8:
                this.inputBoxShow = false;
                break;
              case -1:
              case 0:
              case 2:
              case 3:
              case 4:
              case 5:
              case 6:
              case 9:
              case 10:
              case 11:
              case 12:
              case 13:
                this.inputBoxShow = true;
                break;
            }
            this.triageType=Number(dataList.triageType);
          }
        }).catch(err => {
          console.log(err)
        });

      },
      showToast(content) {
        wx.showToast({
          title: content,
          icon: "none",
          duration: 2000
        })
      },
      connectToNim() {
        const that = this;
        //获取IM Token/appKey
        console.log("fffff")
        nimEnv("test").then(nimEnv => {
          console.log(nimEnv);
          console.log(this.userData);
          this.loading = true;
          this.nim = NIM.getInstance({
            debug: false,
            appKey: nimEnv,
            account: this.userData.account,
            token: this.userData.token,
            reconnectionAttempts: 0,
            onconnect: data => {
              this.loading = false;
              console.log("连接成功");
              this.connectNum += 1;

              // if (!this.connectFlag) {
              this.triageDoctorAssign();
              // }
              imBaseMethods = new ImBusinessMethods(this.nim);
              // this.nim.getClientAntispamLexicon({
              //   done: (error,file) => {
              //     console.log('获取词库完成');
              //     console.log(error);
              //     console.log(file);
              //   }
              // })
              // this.checkHasSendedMedicalReport();
            },
            // 同步登录用户名片的回调, 会传入用户名片
            onmyinfo: info => {
              console.log(info)
            },
            onwillreconnect(obj) {
              console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
            },
            ondisconnect(error) {
              console.warn("链接已中断...即将重新连接,连接中断的原因");
              console.log(error);
            },
            onupdatesession: obj => {
              console.log('更新会话');
              console.log(obj);
              // 同步服务端发送的消息
              if (obj.to == that.targetData.account && obj.lastMsg.fromClientType == 'Server') {
                that.onUpdateSession(obj.lastMsg);
              }
            },
            onroamingmsgs(obj) {
              console.log("漫游消息...");
              console.log(obj);
              // 歪门邪道，切不敢学习。
              if (obj.to == that.targetData.account) {
                // roamingMsgs = obj.msgs.reverse();
                // if (roamingMsgs.length < 100) {
                //   this.allMsgsGot = true;
                // } else {
                //   this.allMsgsGot = false;
                // }
                // that.sendSuggestDoctor(); // 是否发送重新推荐
                // that.showInit(); // 检查是否需要发送
                that.onRoamingMsgs(obj.msgs.reverse()); // 漫游消息处理；
              }
            },
            onofflinemsgs(obj) {
              console.log("离线消息...");
              // console.log(obj);
              let msgs = obj.msgs;
              msgs.forEach((element, index) => {
                if (index == msgs.length - 1) {
                  that.historyBeginTime = element.time
                }
                if (element.type === "custom" && !element.content.type) {
                  element.content = JSON.parse(element.content);
                }
                element.timeStamp = that.transformTimeStamp(element.time);
                that.hideInput(element); // 检查是否需要隐藏输入框 ；
              });
              console.log(msgs);
              that.msgList = that.nim.mergeMsgs(that.msgList, msgs);
            },
            onmsg: msg => {
              console.log('收到消息');
              console.log(msg);
              this.renderReceiveMessage(msg);
            }
          });
        }).catch(err => {
          console.log(err)
        })
      },
      // 健康卡领取提示
      pushHealthCard(){
        let _this = this;
        this.msgList.push({
          type:'healthCard'
        });
      },
      goToGetHealthCard(){
        let _this = this;
        wx.navigateTo({
          url:'/packageD/healthCard/healthCardRecognition?from=imScene'
        })
      },
      // 更新会话消息处理
      onUpdateSession(msg) {
        // 开发中发现结束消息第一次会出来两条，因为会同时触发更新会话和收到消息
        if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) return;
        msg.timeStamp = this.transformTimeStamp(msg.time); // 给元素添加时间显示属性；
        if (msg.type === "custom") {
          if (!msg.content.type) {
            msg.content = JSON.parse(msg.content);
          }
          // 开发中发现结束消息第一次会出来两条，因为会同时触发更新会话和收到消息
          if ( msg.content.type === 'notification' && msg.content.data.actionType == 5) {
            this.inputBoxShow = false; //输入框取消
            this.setconsultationState(8);
            return;
          }
          if (!msg.time) {
            this.timeStampShowList.push(0);
          }
          if (Math.abs(msg.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
            if (msg.type === "custom" && msg.content.type) {
              if (
                msg.content.type.includes("new-") ||
                msg.content.type === 'reviewCaseFail' ||
                msg.content.type === "payFinishTips" ||
                msg.content.type === "triagePatientTips" ||
                msg.content.type === "reTriageTip" ||
                msg.content.type === "refusePatient" ||
                msg.content.type === "overtimeTip" ||
                msg.content.type === "chatOvertimeTip" ||
                (msg.content.type === 'notification' && msg.content.data.actionType == 3)
              ) {
                this.timeStampShowList.push(0);
              } else {
                this.beginTimestamp = msg.time;
                this.timeStampShowList.push(1);
              }
              if (msg.content.type === 'medicalReport') {
                this.allMsgsGot = true;
              }
            } else {
              this.beginTimestamp = msg.time;
              this.timeStampShowList.push(1);
            }
          } else {
            this.timeStampShowList.push(0);
          }
        }
        this.historyBeginTime = msg.time;
        this.msgList.push(msg);
      },
      // 漫游消息处理；
      onRoamingMsgs(msgs) {
        // 处理医生接诊，返回不隐藏输入框
        let msg = msgs[0];
        if (msg.type === "custom" && !msg.content.type) {
          msg.content = JSON.parse(msg.content);
        }
        if (!!msg.content) {
          // msg.content = JSON.parse(msg.content);
          if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) {
            this.inputBoxShow = false;
          }
        } // 处理完成

        // 截取漫游消息最后二十条，页面展示
        // this.buildRenderMsg('history', roamingMsgs.splice(0, 20));
      },
      // 处理是否要发送消息（发送视诊、检查检验等）
      showInit() {
        if (!!storage.getItem('triageTips')) {
          imBaseMethods.sendCustomMessage({
            to: this.targetData.account,
            custom: JSON.stringify({
              cType: "0",
              cId: this.cId,
              mType: "39",
              conId: this.orderSourceId
            }),
            content: JSON.stringify({
              type: "triageSendTips",
              data: {
                actionType: storage.getItem('triageTips').triageType
              }
            })
          }).then(msg => {
            this.sendMessageSuccess(msg);
          }).catch((err, msg) => {
            this.sendFail(err, msg);
          }).finally(() => {
            storage.removeItem('triageTips');
          });
        } else if (!!storage.getItem('checkSuggestTips')) {
          this.updateMedical();
          // 如果会话消息不是结束，则更新状态；
          if (this.consultationState != 7 && this.consultationState != 1 && this.consultationState != 8) {
            this.refreshState(6);
          }
          imBaseMethods.sendCustomMessage({
            to: this.targetData.account,
            custom: JSON.stringify({
              cType: "0",
              cId: this.cId,
              mType: "40",
              conId: this.orderSourceId
            }),
            content: JSON.stringify({
              type: "checkSuggestSendTips",
              data: {
                actionType: storage.getItem('checkSuggestTips').queryType
              }
            }),
          }).then(msg => {
            this.sendMessageSuccess(msg);
          }).catch((err, msg) => {
            this.sendFail(err, msg);
          }).finally(() => {
            storage.removeItem('checkSuggestTips');
          });
        }
      },
      renderReceiveMessage(msg) {
        if (msg.from === this.targetData.account) {
          console.log("收到回复消息：" + JSON.stringify(msg));
          if (msg.type === "custom") {
            msg.content = JSON.parse(msg.content);
          }
          this.getCId(msg);//每次收到消息更新cId(分诊台医生id);
          this.hideInput(msg); // 患者端收到拒绝咨询隐藏输入框或者分诊完成；
          this.msgList.push(msg);

          if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
            let idClient = (msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient) || (msg.content.data.imMessage && msg.content.data.imMessage.idClient) || (msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId);
            this.msgList.forEach((element, index) => {
              if (element.idClient === idClient) {
                this.msgList.removeByValue(element);
                if (element.custom.mType == 1) {
                  this.imageList.removeByValue(element.file.url);
                }
                return;
              }
            });
          }
          this.getTimeStampShowList(msg);

          this.imageCompressByNim(msg);

          if (msg.type === "image") {
            setTimeout(() => {
              this.scrollToBottom(1000);
            }, 200)
          } else {
            this.scrollToBottom(500);
          }
        }
      },
      //每次收到消息更新cId(分诊台医生id);
      getCId(msg) {
        const that = this;
        console.log(!!msg.custom);
        if (!!msg.custom) {
          that.cId = parseInt(JSON.parse(msg.custom).cId);
        }
      },
      // 患者端收到拒绝咨询隐藏输入框
      hideInput(msg) {
        console.log('验证');
        console.log(msg);
        if (msg.type === "custom" && msg.content && msg.content.type === "refusePatient") {
          this.inputBoxShow = false; //输入框取消
          this.setconsultationState(7);
        }
        if (msg.type === "custom" && msg.content && msg.content.type === 'notification' && msg.content.data.actionType == 5) {
          this.inputBoxShow = false; //输入框取消
          this.setconsultationState(8);
        }
        // 收到审核通过的信息隐藏输入框
        if (msg.type === "custom" && msg.content && msg.content.type === "reviewCaseSuccess") {
          this.inputBoxShow = false; //输入框取消
        }
      },
      //接收图片利用云信SDK作预览压缩
      imageCompressByNim(msg) {
        //云信图片压缩
        if (msg.type === "image") {
          this.imageList.push(msg.file.url);
        }
      },
      //聊天记录时间戳处理
      transformTimeStamp(time) {
        return imBaseMethods.transformTimeStamp(time);
      },
      // 获取患者的基本信息
      getPatientBase() {

        return getPatientBase({
          patientId: this.patientId,
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            this.setPatientName(dataList[0].patientName);

            this.setPatientInfo({
              patientName: dataList[0].patientName,
              patientId: this.patientId,
              age: dataList[0].patientAge,
              sexName: dataList[0].patientSex == 1 ? "男" : "女",
              idcardStatus: dataList[0].idcardStatus === "0" ? false : true,
              certificateCode: dataList[0].certificateCode,
              mobile: dataList[0].mobile,
            });

            if (dataList && dataList.length !== 0) {
              this.setLogoUrl({
                age: dataList[0].patientAge,
                sexName: dataList[0].patientSex == 1 ? "男" : "女"
              });
              const userData = {
                nick: dataList[0].patientName,
                avatar: this.logoUrl,
                sign: "newSign",
                gender: dataList[0].patientSex === "1" ? "male" : "female",
                email: "",
                birth: "",
                tel: ""
              };
              // this.nim.updateMyInfo(userData);
              this.userData = Object.assign(this.userData, userData);
              console.log(this.targetMsg)
              storage.setItem("patientInfo", JSON.stringify(this.patientInfo));
            }
          }
        });

      },
      // 获取医生姓名、头像
      getDoctorMsg() {
        return getDoctorBaseMsg({
          doctorCustomerId: this.doctorCustomerId,
          logoUseFlag: 5
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            const dataList = data.responseObject.responseData.dataList[0];
            this.setDoctorBaseMsg(dataList);
            wx.setNavigationBarTitle({
              title: `${dataList.customerName}医生医助`
            });
            this.titleName = `${dataList.customerName}医生`;

          }
        });
      },
      buildRenderMsg(type, msgs) {
        let _timeStampShowList = [];
        if (type == 'history') {
          this.msgList = [];
          this.beginTimestamp = 0;
        }
        msgs.forEach((element, index) => {
          if (index == msgs.length - 1) {
            this.historyBeginTime = element.time
          }
          if (element.type === "custom" && !element.content.type) {
            element.content = JSON.parse(element.content);
          }
          element.timeStamp = this.transformTimeStamp(element.time);
          this.msgList.unshift(element);

          if (element.type === "custom" && element.content.type === "deleteMsgTips") {

            let idClient = (element.content.data.deleteMsg && element.content.data.deleteMsg.idClient) || (element.content.data.imMessage && element.content.data.imMessage.idClient) || (element.content.data.deleteMsg && element.content.data.deleteMsg.messageId);
            if (element.idClient === idClient) {
              this.msgList.removeByValue(element);
              return;
            }
          }
        });
        this.msgList.forEach((element, index) => {
          if (!element.time) {
            _timeStampShowList.push(0);
            return;
          }
          if (Math.abs(element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
            if (element.type === "custom" && element.content.type) {
              if (
                element.content.type.includes("new-") ||
                element.content.type === 'reviewCaseFail' ||
                element.content.type === "payFinishTips" ||
                element.content.type === "triagePatientTips" ||
                element.content.type === "reTriageTip" ||
                element.content.type === "refusePatient" ||
                element.content.type === "overtimeTip" ||
                element.content.type === "chatOvertimeTip" ||
                (element.content.type === 'notification' && element.content.data.actionType == 3)
              ) {
                _timeStampShowList.push(0);
                return;
              } else {
                this.beginTimestamp = element.time;
                _timeStampShowList.push(1);
              }
            } else {
              this.beginTimestamp = element.time;
              _timeStampShowList.push(1);
            }
          } else {
            _timeStampShowList.push(0);
          }
        });
        this.timeStampShowList = _timeStampShowList;
        this.getImageList();
        if (type !== "scrollInit") {
          setTimeout(() => {
            this.scrollToBottom(1000);
          }, 0);
        } else {
          // setTimeout(() => {
          this.pulling = false;
          // }, 800)
        }
        // this.pushHealthCard();   // 健康卡提示
      },
      // 判断是否需要发送推荐医生
      sendSuggestDoctor() {
        let doctorName = storage.getItem("doctor");
        if (!!doctorName) {
          let msg = this.msgList[this.msgList.length-1];
          if (msg && msg.custom && JSON.parse(msg.custom).mType == '47') {
            storage.removeItem("doctor");
            return;
          }
          console.log(msg);
          imBaseMethods.sendMessage({
            target: this.targetData.account,
            sendContent: `${doctorName}拒绝了我的咨询，请重新为我匹配对症医生`,
            custom: JSON.stringify({
              cType: "0",
              cId: this.cId,
              mType: "47",
              conId: this.orderSourceId
            }),
          }).then(obj => {
            this.sendMessageSuccess(obj);
            storage.removeItem("doctor");
          }).catch((err, obj) => {
            this.sendFail(err, obj)
          });
        }
      },
      //聊天记录时间处理压入是0还是1
      getTimeStampShowList(element) {
        if (!element.time) {
          this.timeStampShowList.push(0);
          return;
        }
        if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
          if (element.type === "custom") {
            if (
              element.content.type.includes("new-") ||
              element.content.type === 'reviewCaseFail' ||
              element.content.type === "payFinishTips" ||
              element.content.type === "triagePatientTips" ||
              element.content.type === "reTriageTip" ||
              element.content.type === "refusePatient" ||
              element.content.type === "overtimeTip" ||
              element.content.type === "chatOvertimeTip" ||
              (element.content.type === 'notification' && element.content.data.actionType == 3)
            ) {
              this.timeStampShowList.push(0);
              return;
            } else {
              this.beginTimestamp = element.time;
              this.timeStampShowList.push(1);
            }
          } else {
            this.beginTimestamp = element.time;
            this.timeStampShowList.push(1);
          }
        } else {
          this.timeStampShowList.push(0);
        }
      },
      //长按事件响应
      longTouchEmitHandler(index) {
        if (this.toolbarConfig.delete) {
          this.deleteMsgIndex = index;
        }
      },
      //消息撤回
      deleteMsgEvent(msg) {
        let _DeleteTimeLimit;
        let _deleteTime = parseInt(this.toolbarConfig.deleteTime);
        if (_deleteTime < 60) {
          _DeleteTimeLimit = `${_deleteTime}秒`;
        } else {
          if (_deleteTime % 60) {
            _DeleteTimeLimit = `${parseInt(_deleteTime / 60)}分钟${_deleteTime % 60}秒`;
          } else {
            _DeleteTimeLimit = `${_deleteTime / 60}分钟`;
          }
        }

        imBaseMethods.deleteMessageSendTip({
          msg,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.doctorCustomerId,
            mType: "37",
            conId: this.orderSourceId,
            patientName: this.patientName,
            idClient: msg.idClient
          }),
          content: JSON.stringify({
            type: "deleteMsgTips",
            data: {
              from: this.patientName || "患者",
              deleteMsg: msg || {}
            }
          }),
          deleteFailCallback: err => {
            this.showToast(`您只能撤回${_DeleteTimeLimit}内的消息`)
          },
          deleteSuccessCallback: dMsg => {

            if (JSON.parse(msg.custom).mType == 1) {
              let _imageUrl = msg.file.url;
              this.imageList.forEach((element, index) => {
                if (element === _imageUrl) {
                  this.imageList.removeByValue(element);
                  return;
                }
              });
            }
            this.sendMessageSuccess(dMsg);
            console.log(`撤回消息提示--发送成功`);
          }
        });
      },
      // 获取页面图片消息存到数组里
      getImageList() {
        this.$nextTick(() => {
          if (this.$refs.bigImg) {
            this.$refs.bigImg.forEach((element, index) => {
              if (this.imageList.indexOf(element.imageMessage.file.url) == -1) {
                this.imageList.push(element.imageMessage.file.url);
              }
            });
          }
        });
      },
      // 滑动到底部
      scrollToBottom(delayTime = 200) {
        console.log('触发了滑到底部');
        if (scrollTimer) {
          clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: this.scrollHeight + 10000,
            duration: 0
          })
        }, delayTime)
      },
      //滑动到某个元素
      scrollElement(distance) {
        console.log("position" + distance);

      },
      //更新上传了检查检验
      updateMedical() {
        updateMedicalReport({
          caseId: this.caseId,
          state: 1
        }).then(data => {
          if (data.responseObject.responseStatus) {
            console.log("更新上传了检查检验");
          }
        });
      },
      //发送咨询结束或者开始消息--4开始、5结束
      sendConsultState(num) {
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.cId,
            mType: "24",
            conId: this.orderSourceId
          }),
          content: JSON.stringify({
            type: "notification",
            data: {
              actionType: num
            }
          }),
        }).then(msg => {
          this.sendMessageSuccess(msg);
        }).catch((err, msg) => {
          this.sendFail(err, msg)
        });
      },
      // checkHasSendedMedicalReport() {
      //   //检测从未发送过...
      //   imBaseMethods.getMessageList({
      //     beginTime: 0,
      //     endTime: 0,
      //     target: this.targetData.account,
      //     limit: 5,
      //     reverse: true,
      //   }).then(obj => {
      //     const msgList = obj.msgs;
      //     let _flag = false;
      //     for (let i in msgList) {
      //       let _ele = msgList[i];
      //       if (_ele.type === "custom" && _ele.content && JSON.parse(_ele.content).type === 'medicalReport') {
      //         _flag = false;
      //         return false;
      //       } else {
      //         _flag = true;
      //       }
      //     }
      //     if (_flag) this.getMedicalMessage();
      //     this.allMsgsGot = true;
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // },
      //获取患者咨询单
      getMedicalMessage() {
        getMedicalReportDetails({
          caseId: this.caseId,
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            if (dataList && dataList.length !== 0) {
              if(!this.isFindDoctor){
                this.sendDataList=dataList[0];
              }
              this.sendMedicalReport(dataList[0]);
            }
          }
        });
      },
      //发送咨询单
      sendMedicalReport(param) {
        console.log(imBaseMethods.sendCustomMessage);
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.cId,
            mType: "27",
            conId: this.orderSourceId
          }),
          isPushable: false,
          content: JSON.stringify({
            data: {
              caseId: this.caseId, //咨询单 病例ID
              patientName: param.patientCasemap.patientName, //患者姓名
              sexName: param.patientCasemap.sexName, //患者性别
              age: param.patientCasemap.age, //患者年龄
              createDate: new Date().getTime(),
              diagnoseContent: param.patientCasemap.caseMain.caseMain,
              isAttachment: param.patientCasemap.isAttachment,
              time: param.patientCasemap.caseTime,
              caseUrl: `${api.httpEnv()}/pages/app_native/reservation_list.html?caseId=${this.caseId}&isOrder=0`
            },
            type: "medicalReport" //自定义类型 咨询单
          }),
        }).then(msg => {
          this.mainCase = param.patientCasemap.caseMain.caseMain;
          console.log('发送咨询单成功');
          this.sendMessageSuccess(msg);
          this.historyBeginTime = msg.time; // 设置分页开始时间
          if(this.isFindDoctor){
            this.tipNewPatient(param);
          }

          this.allMsgsGot = true;
        }).catch(err => {
          console.log(err);
        });
      },
      /** 提示信息 分诊台刷新患者 */
      tipNewPatient(data) {
        imBaseMethods.sendCustomMessage({
          custom: JSON.stringify({
            cType: "0",
            cId: this.cId,
            mType: "32",
            conId: this.orderSourceId
          }),
          to: this.targetData.account,
          content: JSON.stringify({
            type: "new-health",
            data: Object.assign({}, data.data, {
              patientId: this.patientId,
              consultationid: this.orderSourceId
            })
          })
        }).then(msg => {
          this.sendMessageSuccess(msg);
          console.log("新用户提醒发送...");
        })
      },
      selectVideo() {
        const that = this;
        that.destroyIM = false;
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success(res) {
            console.log('选择视频成功');
            console.log(res);
            if (res.size >= 104857600) {
              console.log('视频太大');
              that.showToast("视频最大为100M");
              return;
            }
            if (/mp4$/.test(res.tempFilePath) || /mov$/.test(res.tempFilePath) || /quicktime$/.test(res.tempFilePath)) {
              that.sendVideo(res.tempFilePath);
            } else {
              that.showToast("请选择mp4或mov文件");
            }
          },
          fail(err) {
            that.destroyIM = true;
            console.log('选择视频失败');
            console.log(err);
            if (err.errMsg == "chooseVideo:fail DEMUXER_ERROR_COULD_NOT_OPEN: FFmpegDemuxer: open context failed") {
              that.showToast("视频尝试打开失败");
            }
          }
        })
      },
      sendVideo(file) {
        console.log('我要发送视频');
        const that = this;
        that.loading = true;
        console.log(file)
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt3'
        });
        imBaseMethods.sendVideoMessage({
          file: file,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.doctorCustomerId,
            mType: "3",
            conId: this.orderSourceId
          }),
          isPushable: true,
          needPushNick: false,
          pushContent: `患者<${this.patientName ? this.patientName : ""}>向您发送了一条视频，点击查看详情`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          progressCallback: (obj) => {
            console.log(obj)
          },
          sendSuccessCallback: (msg) => {
            console.log('视频发送成功');
            console.log(msg);
            console.log(that.msgList);
            that.loading = false;
            that.msgList.push(msg);
            that.destroyIM = true;
            that.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        });
      },
      selectImage() {
        this.destroyIM = false;
        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            console.log(res);
            const tempFiles = res.tempFiles;
            if (tempFiles.length > 1) {
              this.sendMulitpleImage(tempFiles);
            } else {
              this.sendImage(tempFiles[0]);
            }
          },
          fail: (err) => {
            this.destroyIM = true;
          }
        })
      },
      // 发送多图
      sendMulitpleImage(tempFiles) {
        this.loading = true;
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt38'
        });
        imBaseMethods.sendMulitpleImage({
          list: tempFiles,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.doctorCustomerId,
            mType: "38",
            conId: this.orderSourceId
          }),
          isPushable: true,
          needPushNick: false,
          pushContent: `患者<${this.patientName ? this.patientName : ""}>向您发送了一条图集，点击查看详情`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          sendSuccessCallback: (msg) => {
            this.loading = false;
            this.destroyIM = true;
            msg.content = JSON.parse(msg.content);
            this.msgList.push(msg);
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        });
      },
      // 发送单图
      sendImage(file) {
        this.loading = true;
        this.disabled = true;
        console.log('发送图片');
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt1'
        });
        imBaseMethods.sendImageMessage({
          file: file,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.doctorCustomerId,
            mType: "1",
            conId: this.orderSourceId
          }),
          isPushable: true,
          needPushNick: false,
          pushContent: `患者<${this.patientName ? this.patientName : ""}>向您发送了一张图片，点击查看详情`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          progressCallback: (obj) => {

          },
          sendSuccessCallback: (msg) => {
            console.log(msg);
            this.destroyIM = true;
            this.msgList.push(msg);
            this.imageList.push(msg.file.url);
            this.loading = false;
            setTimeout(() => {
              this.scrollToBottom(1000);
              setTimeout(() => {
                this.disabled = false;
              }, 1000);
            }, 200)
          }
        });
      },
      //发送反垃圾提示语
      sendAntiSpamTips(){
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "0",
            cId: this.cId,
            mType: "57",
            conId: this.orderSourceId
          }),
          isPushable: false,
          content: JSON.stringify({
            type: "sensitiveTip",
            data: {}
          }),
        }).then(msg => {
          this.sendMessageSuccess(msg);
        }).catch(err => {
          console.log(err);
        });
      },
      getMessageList(type) {
        //获取历史消息
        imBaseMethods.getMessageList({
          beginTime: 0,
          // endTime: this.historyBeginTime,
          target: this.targetData.account,
          limit: 100
        }).then(obj => {
          console.log('-------------------');
          console.log(obj);
          if (obj.msgs.length < 100) {
            this.allMsgsGot = true;
          } else {
            this.allMsgsGot = false;
          }
          // 为了兼容老数据
          if (obj.msgs.length>1) {
            roamingMsgs = obj.msgs;
            this.buildRenderMsg('history', roamingMsgs.splice(0, 20));
          }
          this.sendSuggestDoctor(); // 是否发送重新推荐
          this.showInit(); // 检查是否需要发送
        })
      },
      formSubmitName(e) {
        sendFormId(e.target.formId);
      }
    },
    components: {
      MedicalReport,
      ContentText,
      ImageContent,
      MiddleTips,
      VideoMessage,
      MulitpleImage,
      ensure,
      Suggestion,
      BackIndex,
      PreviewSuggestion, // 初诊建议组件
      CheckSuggest, // 检查检验组件
      reviewCaseSuccess, // 审核通过消息组件
      reviewCaseFail, // 审核不通过消息组件
      Triage,
      FileMessage,
      Toast,
      NormalLoading,
      confirm,
      blackList
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "static/scss/modules/imStyle";
  @include iphoneX{
    .footer-box-top{
        height: 98px;
    }
    .main-input-box{
      padding-bottom: 68px;
      /*background: #00D6C6;*/
      .main-input-box-textarea-inner .area-content .main-input-box-textarea{
        line-height: 70px;
        height: 70px;
        border-radius: 70px;
        margin-top: 2px;
      }
    }
    .main-message{
      padding-bottom: 168px;
      &.showBottomPd{
        padding-bottom: 418px;
        &.android{
          padding-bottom: 568px;
        }
      }
    }
    .icon-im-plus{
      @include square(48px);
      background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/im_add.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .anti-spam-tips{
    width:690px;
    /*height:106px;*/
    background:rgba(237,238,238,1);
    border-radius:12px;
    padding: 20px 24px;
    box-sizing: border-box;
    margin:35px auto;
    .anti-spam-con{
      .anti-spam-text{
        font-size:28px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(144,144,144,1);
        line-height:38px;
      }
    }

  }
  .main-message-img {
    position: relative;
    img.label-assistant {
      position: absolute;
      width: 84px;
      height: 32px;
      border-radius: 0;
      top: 54px;
      left: -12px;
    }
  }

  .fadeDown-enter-active,
  .fadeDown-leave-active {
    transition: all ease-in-out 0.5s;
  }

  .fadeDown-enter,
  .fadeDown-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }

  .fadeUp-enter-active,
  .fadeUp-leave-active {
    transition: all ease-in-out 0.5s;
  }

  .fadeUp-enter,
  .fadeUp-leave-to {
    opacity: 0;
    transform: translateY(50%);
  }

</style>

