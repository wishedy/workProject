<template>
  <section class="main-inner" @click="deleteMsgIndex=-1">
    <!--<QrCode :customerId="doctorCustomerId"></QrCode>-->
    <!-- 针对美年大健康来源的头部-->
    <template v-if="caseType == '15' && lastTimeShow && receiveTreatmentStatus">
      <article class="main-message-time meinianHeader">
        免费问诊
      </article>
    </template>

    <template v-else>
      <article class="main-message-time" v-if="totalCount===0&&lastTimeShow&&receiveTreatmentStatus">
        <article>
          <p>医生回复剩余次数</p>
          <span>{{lastCount}}</span>
          <p>次</p>
        </article>
        <article>
          <p>对话剩余时间</p>
          <span>{{lastTimeText}}</span>
          <p></p>
        </article>
      </article>

      <article class="main-message-time" v-if="totalCount>0&&lastTimeShow&&receiveTreatmentStatus">
        <article>
          <p>唯医骨科送您</p>
          <span>50</span>
          <p>次医生回复机会</p>
        </article>
        <article>
          <p>剩余次数：</p>
          <span>{{lastCount}}</span>
          <p>次</p>
        </article>
      </article>
    </template>

    <article class="main-message-time doctor-title-message" v-if="getTargetMsgFinish&&!lastTimeShow"
             @click="goToDoctorHomePage">
      <figure class="doctor-title-img">
        <img :src="targetMsg.avatar" alt="">
      </figure>
      <figcaption class="doctor-title-content">
        <h4 class="name">{{targetMsg.nick}}</h4>
        <span class="title" v-if="targetMsg.title">{{doctorTitleName}}</span>
        <span class="hospital">{{targetMsg.hospital}}</span>
        <i class="icon-rightArrow"></i>
      </figcaption>
    </article>
    <!--消息主体-->
    <section class="main-message" @click="deleteMsgIndex = -1" @touchmove="deleteMsgIndex = -1"
             :class="{'showBottomPd':footerBottomFlag||bottomTipsType!=='','android':!ios}">
      <section class="main-message-wrapper" v-for="(msg,index) in msgList" :key="msg.idClient">
        <!--时间戳-->
        <p class='time-stamp' v-if="timeStampShowList[index]==1">
          {{msg.timeStamp}}</p>
        <!--报到单-->
        <ReportDetails v-if="msg.type==='custom'&&msg.content.type==='reportOrder'"
                       :reportOrderMessage="msg.content"
                       :reportId="caseId"
                       :targetMsg="targetMsg"
                       :textareaShow="textareaShow"
                       ref="reportOrder"
        ></ReportDetails>
        <!--咨询单-->
        <MedicalReport
          v-if="msg.type==='custom' && msg.content.type==='medicalReport'"
          :medicalReportMessage="msg.content"
          :caseId="caseId"
          :patientId="patientId">
        </MedicalReport>
        <!--医生接诊-->
        <MiddleTips
          v-if="msg.type==='custom' && msg.content.type === 'notification' && msg.content.data.actionType == 4"
          :tipsType="4">

        </MiddleTips>

        <!--消息撤回提示-->

        <section class="main-message-box grey-tips"
                 v-if="msg.type === 'custom' && msg.content.type === 'deleteMsgTips'">
          <figcaption class="first-message">
            <p v-if="msg.from===targetData.account">{{targetMsg.nick+'医生'}}撤回了一条消息</p>
            <p v-if="msg.from!==targetData.account">您撤回了一条消息</p>
          </figcaption>
        </section>

        <!--咨询拒绝-->
        <section class="main-message-box"
                 v-if="msg.type==='custom'&&msg.content.type === 'notification' &&msg.content.data.actionType == 3">
          <article class="main-message-box-item others-message">
            <figure class="main-message-img">
              <img :src="targetLogo" alt="">
            </figure>
            <figcaption class="main-message-content">
              <p>感谢您的信任！我暂时无法为您提供服务；您已支付的费用系统将自动退回，请注意查收。</p>
            </figcaption>
          </article>
        </section>
        <!--咨询结束-->
        <!--<MiddleTips v-if="msg.type==='custom'&&msg.content.type === 'notification' &&msg.content.data.actionType == 5"-->
        <!--:tipsType="5">-->
        <!--</MiddleTips>-->
        <!--支付成功-->
        <PayFinishTips v-if="msg.type==='custom' && msg.content.type==='payFinishTips'">
        </PayFinishTips>
        <!--门诊邀约-->
        <OutpatientInvite v-if="msg.type==='custom' && msg.content.type==='outpatientInvite'"
                          :outPatientMessage="msg.content" ref="outpatientInvite">
        </OutpatientInvite>
        <!-- 门诊预约 -->
        <OutpatientAppointment v-if="msg.type==='custom'&&msg.content.type==='outpatientOrderFromPT'"
                               :contentMessage="msg">
        </OutpatientAppointment>
        <!-- 门诊邀约 -->
        <OutpatientService v-if="msg.type==='custom'&&msg.content.type==='outpatientOrderFromDT'"
                           :patientId="patientId" :caseId="caseId"
                           :doctorCustomerId="doctorCustomerId">
        </OutpatientService>
        <!-- 医嘱提醒 -->
        <DoctorAdvice v-if="msg.type==='custom'&&msg.content.type==='doctorRemind'" :reportId="reportId"
                      :doctorCustomerId="doctorCustomerId"
                      :contentMessage="msg">
        </DoctorAdvice>
        <!--赠送次数-->
        <SendCount v-if="msg.type==='custom'&&msg.content.type === 'notification' &&msg.content.data.actionType == 2"
                   :sendCountMessage="msg.content" :doctorName="targetMsg.nick">
        </SendCount>
        <!--购买咨询-->
        <section class="main-message-box grey-tips"
                 v-if="msg.type==='custom'&&msg.content.type === 'notification' &&msg.content.data.actionType == 1">
          <figcaption class="first-message">
            <p>您已完成支付，可与主诊医生继续沟通</p>
          </figcaption>
        </section>

        <!--文本消息-->
        <ContentText v-if="msg.type==='text' && msg.text" :contentMessage="msg"
                     :userData="userData"
                     :targetData="targetData"
                     @deleteMsgEvent="deleteMsgEvent(msg,index)"
                     @longTouchEmitHandler="longTouchEmitHandler(index)"
                     :currentIndex="index"
                     :from="from"
                     :deleteMsgIndex="deleteMsgIndex">

        </ContentText>
        <!--图像消息-->
        <ImageContent
          v-if="(msg.type==='file'||msg.type==='image') && msg.file &&msg.file.ext!=='pdf'"
          :imageMessage="msg"
          ref="bigImg" :imageList="imageList"
          :currentIndex="index"
          @deleteMsgEvent="deleteMsgEvent(msg,index)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
          :deleteMsgIndex="deleteMsgIndex"
          :userData="userData"
          :targetData="targetData">
        </ImageContent>
        <!-- 图集消息 -->
        <MulitpleImage
          v-if="msg.type==='custom' && (msg.content.type === 'mulitpleImage'||msg.content.type ==='multipleImage' )"
          :imageMessage="msg"
          :userData="userData"
          @deleteMsgEvent="deleteMsgEvent(msg,index)"
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
          @deleteMsgEvent="deleteMsgEvent(msg,index)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
          :deleteMsgIndex="deleteMsgIndex"
          :currentIndex="index"
          :inputBoxShow.sync="inputBoxShow"
        ></VideoMessage>
        <!--文件消息-->
        <FileMessage
          v-if="msg.type==='file'&&msg.file&&msg.file.ext==='pdf'"
          :fileMessage="msg"
          :userData="userData"
          :targetData="targetData"
          :currentIndex="index"
          :fileProgress="fileProgress"
          :deleteMsgIndex="deleteMsgIndex"
          @deleteMsgEvent="deleteMsgEvent(msg,index)"
          @longTouchEmitHandler="longTouchEmitHandler(index)"
        >
        </FileMessage>
        <!--患教手册-->
        <patientNodeMsg v-if="msg.type==='custom'&&msg.content.type==='patientNode'"
                        :contentMessage="msg"></patientNodeMsg>
        <!--服务评价消息体-->
        <serviceComment
          v-if="msg.type==='custom'&&msg.content.type==='serviceComment'"
          :customerId="doctorCustomerId"
          :patientId="patientId"
          :orderSourceId="orderSourceId"
        ></serviceComment>
        <!--患者扫码报到-->
        <section class="main-message-box grey-tips"
                 v-if="msg.type==='custom'&&msg.content.type === 'notification' &&msg.content.data.actionType == 6"
                 ref="reportTip">
          <figcaption class="first-message">
            <p>报到成功，您可继续补充您的情况，便于医生更好了解病情</p>
          </figcaption>
        </section>
        <!--消息反垃圾提示-->
        <section class="main-message-box anti-spam-tips"
                 v-if="msg.type === 'custom' && msg.content.type === 'sensitiveTip'">
          <figcaption class="anti-spam-con">
            <p class="anti-spam-text">您可能发送了不良用语，请乐观积极与医生沟通以获取指导。（如系统误判，请忽略此消息）</p>
          </figcaption>
        </section>
        <!-- 领取健康卡提示 -->
        <section class="main-message-box grey-tips"
                 v-if="msg.type === 'healthCard'">
          <figcaption class="first-message" @click="goToGetHealthCard">
            <p class="getHealthCard-one">领取居民健康卡，有利于医生了解您的病情</p>
            <p class="getHealthCard">立即领取 ></p>
          </figcaption>
        </section>
      </section>

    </section>
    <!--底部提示-->

    <!--<footer :class="footerPosition" v-if="inputBoxShow || (recommendShow&&!lastTimeShow&&bottomTipsType==2)">-->
    <!--适配iPhone X-->
    <footer :class="{'main-input-box-text':(!textareaShow)&&(bottomTipsType!==''),'main-input-box-end':(!textareaShow)&&(bottomTipsType==3)}" v-if="inputBoxShow || (recommendShow&&!lastTimeShow&&bottomTipsType==2)" class="main-input-box">
      <section class="footer-box-top">
        <transition name="fadeUp">
          <BottomTips v-if="bottomTipsShow" :bottomTipsType="bottomTipsType">
          </BottomTips>
        </transition>
        <!--医生拒绝-->
        <section class="prohibit-input"
                 v-show="(recommendShow&&!textareaShow) || !lastTimeShow&&bottomTipsType==2"
                 @click="retryClick($event,2)">
          <div>
            <span>重新推荐</span>
          </div>
        </section>
        <!--医生强制结束沟通-->
        <section
          class="prohibit-input consultation-end"
          v-if="bottomTipsShow&&bottomTipsType==3"
        >
          <div>
            <span class="end-text">咨询已结束</span>
          </div>
        </section>
        <!--超时未接诊-->
        <section class="prohibit-input" v-if="!lastTimeShow&&bottomTipsType==-1" @click="retryClick($event,-1)">
          <div>
            <span>重新支付</span>
          </div>
        </section>
        <!--超时未接诊-扫码报到-->
        <!--<section class="prohibit-input" v-if="!lastTimeShow&&(bottomTipsType==2&&from==='report')">-->
        <!--<div>-->
        <!--<span>已退诊</span>-->
        <!--</div>-->
        <!--</section>-->
        <!--继续沟通-->
        <section class="prohibit-input" v-if="!lastTimeShow&&bottomTipsType==1"
                 @click="retryClick($event,1)">
          <div>
            <span>继续沟通</span>
          </div>
        </section>
        <section class="main-input-box-plus"
                 @click='showTabbar'>
          <i class="icon-im-plus"></i>
        </section>
        <figure class="main-input-box-textarea-inner" v-if="textareaShow">
          <form class="patientForm" @submit="formSubmitName" report-submit="true" id="baseIm">
            <section class="area-content">
              <input class="main-input-box-textarea"
                     v-if="textareaShow"
                     type="text"
                     @input="inputFunc"
                     maxlength="500"
                     @focus="scrollToBottom()" cursor-spacing="5"/>
              <div class="main-input-box-textarea" v-if="!textareaShow"></div>
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
    <NormalLoading v-if="finish"></NormalLoading>
    <Toast :content="toastContent" :imgUrl="toastImg" v-if="toastShow"></Toast>
    <Suggestion :customerId="patientCustomerId" :isLeave.sync="isLeave"
                :doctorCustomerId="targetData.account.substring(2)"></Suggestion>
    <BackIndex v-if="backIndexShow"></BackIndex>
    <!--报到单的图片上传-->
    <reportImageUpload v-if="reportImageUpload"></reportImageUpload>
    <blackList></blackList>
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
  import confirm from "components/confirm";
  import NormalLoading from "components/loading";
  import BackIndex from "components/backIndex"; // 返回首页组件
  import api from "common/js/util/util";
  import blackList from "components/BlackList";//黑名单组件
  // /**************************Common Methods*************************/
  import nimEnv from "common/js/nimEnv/nimEnv"
  import ImBusinessMethods from "common/js/imBaseMethods/imBusinessMethods";
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  // /**************************ThirdParty Components**************************/
  import NIM from "common/js/nimEnv/NIM_Web_NIM_v5.3.0";
  import {createNamespacedHelpers} from "vuex";
  // /**************************Base Vue-Methods*************************/
  //
  // /**************************Private Methods*************************/
  import ContentText from "./components/content";
  import ImageContent from "./components/image";
  import patientNodeMsg from "./components/patientNodeMsg";
  import BottomTips from "./components/bottomTips";
  import MiddleTips from "./components/middleTips";
  import PayFinishTips from "./components/payFinishTips";
  import OutpatientInvite from "./components/outpatientInvite";//门诊邀约单（除银川医生外展示的）
  import OutpatientAppointment from "./components/outpatientAppointment"; //门诊预约单
  import OutpatientService from "./components/outpatientService"; //门诊邀约单（银川医生展示的）
  import SendCount from "./components/sendCount";
  import VideoMessage from "./components/video";
  import MulitpleImage from "./components/mulitpleImage";
  import FileMessage from "./components/fileMessage";
  import Suggestion from "components/suggestion";
  import ReportDetails from "./components/reportDetails";
  import DoctorAdvice from "./components/doctorAdvice";
  import MedicalReport from "./components/medicalReport";
  import reportImageUpload from "./components/reportImageUpload"; // 报到单的图片上传
  import serviceComment from "./components/serviceComment"; // 服务评价消息体
  // /**************************Axios Http Requests*************************/
  import getNimToken from "common/js/HttpRequest/getNimToken";
  import getCaseInfo from "common/js/HttpRequest/getCaseInfo";
  import getConsultationList from "common/js/HttpRequest/getConsultationList";
  import createConsultation from "common/js/HttpRequest/createConsultation";
  import getConsultationLastTime from "common/js/HttpRequest/getConsultationLastTime";
  import getPatientBase from "common/js/HttpRequest/getPatientBase";
  import getDoctorBaseMsg from "common/js/HttpRequest/getDoctorBaseMsg";
  import getReportDetails from "common/js/HttpRequest/getReportDetails";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import updateConsultation from "common/js/HttpRequest/updateConsultation";
  import getMedicalReportDetails from "common/js/HttpRequest/getMedicalReportDetails";
  import updateAfterTimeOver from "common/js/HttpRequest/updateAfterTimeOver";
  import refreshToken from "common/js/HttpRequest/refreshToken"

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
  };
  let imBaseMethods;
  let scrollTimer = null; // 页面滑动的定时器
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imSceneDoctor');
  export default {
    name: "index",
    data() {
      return {
        ios: "",
        caseId: "",
        caseType: "",
        doctorCustomerId: "",
        patientId: "",
        patientCustomerId: "",
        from: "",
        consultationState: "",
        consultationLevel: "",
        mainCase: "",
        textareaShow: true,
        scrollTop: 0,
        timeStampList: [],
        allMsgsGot: false,
        historyBeginTime: 0,
        isLeave: false,
        disabled: false, // input 是否可以点击 ；
        titleName: "", //document.title 的话术
        onFocus: false,
        inputImageFlag: true, //上传图片input控制
        inputVideoFlag: true, //上传视频input控制
        inputPdfFlag: true,//上传pdf文件控制
        progressNum: 0,// 正在上传的个数
        loading: true,
        totalCount: 0,
        pulling: false,
        shuntCustomerId: "",
        bottomTipsShow: false,
        bottomTipsType: "",
        receiveTreatmentStatus: false,
        footerBottomFlag: false, // 底部文件选择框是否显示
        receiveTime: "",
        imageList: [],
        consultationId: "",
        setFocus: false,
        timeStampShowList: [],
        orderSourceId: "",
        triageOrderSourceId: "",
        beginTimestamp: 0,
        finish: true,
        lastTimeShow: false,
        inputBoxShow: false,
        msgList: [],
        targetMsgList: [],
        connectFlag: false,
        imageLastIndex: 0, //上传图片最后一张记录在数组中的位置
        userData: {
          account: "",
          token: ""
        },
        targetData: {
          account: "2_" + ""
        },
        sendTextContent: "",
        footerPosition: "main-input-box",
        scrollHeight: "",
        deleteMsgIndex: -1,
        toastContent: "",
        toastImg: "",
        toastShow: false,
        getTargetMsgFinish: false,
        recommendShow: false, // 重新推荐按钮是否显示，主要是为了处理找医生流程分诊推荐的医生
        connectNum: 0,
        clickFlag: true,
        isIPad: false, // 是否是 iPad
        backIndexShow: false, // 返回首页是否显示
      }
    },
    onLoad(e) {
      console.log("Loaded")
      const query = this.$root.$mp.query;
      // this.stopLastTimeCount();
      console.log(e);
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      this.msgList = [];
      this._originList = [];
      this.imageList = [];
      this.bottomTipsShow = false;
      this.bottomTipsType = "";
      this.lastTimeShow = false;
      this.inputBoxShow = false;

      this.from = query.from;
      this.caseId = parseInt(query.caseId);
      this.doctorCustomerId = parseInt(query.doctorCustomerId);
      this.patientId = parseInt(query.patientId);
      this.patientCustomerId = parseInt(localStorage.getItem("userId"));
      this.reportId = parseInt(query.reportId);
      this.allMsgsGot = false;


      this.userData = {
        account: "0_" + this.caseId,
        token: ""
      };
      this.targetData = {
        account: "2_" + this.doctorCustomerId
      };
      this.isIPad = wx.getSystemInfoSync().model.includes("iPad") ? true : false;
      this.ios = wx.getSystemInfoSync().system.toLowerCase().includes("ios") ? true : false;
      const _init = () => {
        if (localStorage.getItem('imShowToast') == "yes") {
          this.showToast("您已完成报到，可直接与医生沟通", "", () => {
            localStorage.removeItem('imShowToast');
            this.getUserBaseData();
          });
        } else {
          this.getUserBaseData();
        }
      };
      console.log("nim Check...")
      console.log(this.nim)
      if (this.nim && this.nim.disconnect) {
        console.log("SDK disconnect...");
        this.nim.disconnect({
          done: () => {
            this.nim = {};
            console.log('disconnect really done!');
            _init();
          }
        });
      } else {
        console.log("SDK已销毁...初始化开始");
        _init();
      }


      wx.onNetworkStatusChange((res) => {
        console.log("netStatus:" + res.isConnected);
        if (res.isConnected) {
          if (this.connectNum === 0) {
            _init();
          }
        } else {
          this.connectNum = 0;
          if (this.nim && this.nim.disconnect) {
            this.nim.disconnect({
              done: () => {
                console.log('disconnect really done!');
                _init();
              }
            });
          }
        }
      });


    },
    onUnload() {
      console.log("Unload...")
      clearInterval(this.remainTimeCount);
      this.pauseLastTimeCount();
      console.log("nim Check...")
      console.log(this.nim)
      if (this.nim && this.nim.disconnect) {
        this.nim.disconnect({
          done: () => {
            this.nim = {};
            console.log(this.nim);
          }
        });
      }
      this.msgList = [];
      this._originList = [];
      this.imageList = [];
      this.setTargetMsg({
        avatar: "",
        nick: "",
        title: "",
        hospital: "",
        companyId: "",
        medical: "",
      });
      this.caseId = "";
      this.doctorCustomerId = "";
      this.patientId = "";
      this.patientCustomerId = "";
      this.reportId = "";
      this.sendTextContent = "";
      this.connectFlag = false;
      this.historyBeginTime = 0;
      this.allMsgsGot = false;
      this.bottomTipsShow = false;
      this.bottomTipsType = "";
      this.lastTimeShow = false;
      this.getTargetMsgFinish = false;
      this.inputBoxShow = false;
      this.footerBottomFlag = false;
      this.connectNum = 0;
      clearTimeout(scrollTimer);
      this.setLastCount("");
      this.stopLastTimeCount();
      localStorage.setItem("alreadyCreateIm", 1);

      localStorage.removeItem("sendTips");
      localStorage.removeItem("targetMsg");
      localStorage.removeItem("doctorName");
      localStorage.removeItem("orderSourceId");
    },
    onHide() {
      dataLog.leaveBrowse();
      clearInterval(this.remainTimeCount);
      this.pauseLastTimeCount();
      localStorage.setItem("alreadyCreateIm", 1);
    },
    onShow() {
      dataLog.enterBrowse();
      const _init = () => {
        console.log("show");
        this.getDoctorMsg();
        if (localStorage.getItem('sendOrderMsg')) {
          this.getPatientBase();
        }
        setTimeout(() => {
          if (localStorage.getItem('sendOrderMsg') && !!imBaseMethods && imBaseMethods.sendCustomMessage) {
            imBaseMethods.sendCustomMessage({
              to: this.targetData.account,
              custom: JSON.stringify({
                cType: "1",
                cId: this.doctorCustomerId,
                mType: "52",
                conId: this.orderSourceId
              }),
              content: JSON.stringify({
                type: "outpatientOrderFromPT",
                data: Object.assign(JSON.parse(localStorage.getItem('sendOrderMsg'), {
                  caseId: this.userData.account.substring(2),
                  patientId: this.patientId,
                })),
              })
            }).then(msg => {
              localStorage.removeItem('sendOrderMsg');
              this.sendMessageSuccess(msg);
            })
          }
          // 判断是否是支付成功；
          console.log(localStorage.getItem('paySuccessParams'));
          if (localStorage.getItem('paySuccessParams')) {
            this.paySuccessCallBack(JSON.parse(localStorage.getItem('paySuccessParams')));
            localStorage.removeItem('paySuccessParams');
          } else {
            console.log(`连接数:${this.connectNum}`);
            if (this.connectNum > 0) {
              this.getConsultationStatus();
            }
          }
        }, 200);
      };

      _init();

    },
    mounted() {
      this.getToolbarConfig();
    },
    onPullDownRefresh() {
      console.log("pull");
      console.log(this.historyBeginTime)
      this.pulling = true;
      imBaseMethods.getMessageList({
        beginTime: 0,
        endTime: this.historyBeginTime,
        target: this.targetData.account,
        limit: 20
      }).then(obj => {
        console.log(obj)
        wx.stopPullDownRefresh();
        if (obj.msgs.length === 0) {
          this.showToast("没有更多消息了");
          this.pulling = false;
          this.allMsgsGot = true;
        } else {
          this.buildRenderMsg("scrollInit", obj.msgs);
        }
      })
    },
    computed: {
      ...mapState(['patientName','reportImageUpload', 'patientInfo', 'toolbarConfig', 'targetMsg', 'logoUrl', 'lastTime', 'lastCount']),
      ...mapGetters(['targetLogo', 'certificateCodeEncrypt']),
      doctorTitleName() {
        let result = [];

        if (this.targetMsg.title) {
          if (this.targetMsg.title.includes("_")) {
            this.targetMsg.title.split(",").forEach((element, index) => {
              if (element.length > 0) {
                result.push(element.substring(2));
              }
            });
            return result.join(",");
          } else {
            return this.targetMsg.title;
          }
        }
      },
      lastTimeText() {
        return api.MillisecondToDate(this.lastTime);
      },
    },
    methods: {
      ...mapMutations(['setPatientName', 'setCaseType', 'setPatientInfo', 'lastCountPlus', 'lastCountMinus', 'setTargetMsg', 'setLogoUrl', 'setConsultation', 'setLastTime', 'lastTimeCount', 'setLastCount', 'stopLastTimeCount', 'setTargetList', 'pauseLastTimeCount']),
      ...mapActions(['getToolbarConfig']),
      inputFunc (e) {
        console.log(e.target.value)
        this.sendTextContent = e.target.value
      },
      goToDoctorHomePage() {
        let urlTemp = `/pages/doctorMain/doctorMain?doctorCustomerId=${this.doctorCustomerId}&patientId=${this.patientId}&caseId=${this.caseId}&patientCustomerId=${this.patientCustomerId}&caseType=${this.caseType}&from=imSceneDoctor`;
        wx.navigateTo({
          url: urlTemp
        })
      },
      // 支付成功回调
      paySuccessCallBack(param) {
        let state = "";
        if (this.bottomTipsType == -1) {
          state = -1;
        } else {
          state = 0;
        }
        if (state === -1) {
          this.getLastTime(-1);
          this.sendPayFinish(param);
        } else {
          this.getLastTime(0);
          this.sendPayFinish(param);
          setTimeout(() => {
            this.lastTimeShow = true;
            this.receiveTreatmentStatus = true;
          }, 200);
        }
        this.footerBottomFlag = false;
      },
      showTabbar() {
        this.footerBottomFlag = this.footerBottomFlag ? false : true;
        this.scrollToBottom();
      },
      //toast显示
      showToast(text, img, callback) {
        this.toastContent = text;
        this.toastImg = img;
        this.toastShow = true;
        setTimeout(() => {
          this.toastContent = "";
          this.toastImg = "";
          this.toastShow = false;
          if (typeof callback == "function") {
            callback();
          }
        }, 2000);
      },
      getUserBaseData() {
        this.getCaseBaseInfo();// 通过caseId 获取 case 的基本信息

        getNimToken({
          accid: this.caseId
        }).then(data => {
          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseCode == 'fail') {
              // this.finish = true;
              this.showToast("获取 Token 失败，请重新咨询");
              return;
            }
            this.userData = {
              account: "0_" + this.caseId,
              token: data.responseObject.responseData.imToken
            };
            if (this.connectNum == 0) {
              if (this.from === "report") {
                setTimeout(() => {
                  this.connectToNim();
                }, 2000);
              } else {
                this.connectToNim();
              }
            }
          }
        });
      },
      refreshToken() {
        refreshToken({
          accid: "0_" + caseId
        }).then(param => {
          if (param.responseObject.responseStatus) {
            this.userData = {
              account: "0_" + caseId,
              token: param.responseObject.responseData.token
            };
          }
        });
      },
      //底部重新购买按钮
      retryClick(e, type) {
        switch (type) {
          case -1:
            dataLog.createTrack({
              actionId: 14180,
            });
            wx.navigateTo({
              url: `/packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder?doctorCustomerId=${this.doctorCustomerId}&caseId=${this.caseId}&state=-1&orderSourceId=${this.orderSourceId}`
            });
            break;
          case 1:
            dataLog.createTrack({
              actionId: 14181,
            });
            wx.navigateTo({
              url: `/packageA/imSceneDoctorAffirmOrder/imSceneDoctorAffirmOrder?doctorCustomerId=${this.doctorCustomerId}&caseId=${this.caseId}&state=0&orderSourceId=${this.orderSourceId}`
            });
            break;
          case 2:
            if(this.caseType == 12 || this.caseType == 13){
              dataLog.createTrack({
                actionId: 14194,
                browseTypeUrl:"packageA/imSceneDoctor/imSceneDoctor?from=find"
              });
            }else{
              dataLog.createTrack({
                actionId: 14194
              });
            }
            updateConsultation({
              consultationId: this.triageOrderSourceId,
              frequency: "0",
              frequencyType: "5",
              consultationLevel: "1",
              consultationState: "2"
            }).then(data => {
              if (data.responseObject.responseData) {
                // 存储Storage，给分诊医生im使用；
                localStorage.setItem(
                  "doctor", this.targetMsg.nick
                );
                // 用来获取最近的一层的分诊IM的层级
                let _arr = getCurrentPages().reverse();
                let backNum = -1;
                for (let j = 0, len = _arr.length; j < len; j++) {
                  if (_arr[j].route == 'packageA/imScene/imScene') {
                    backNum = j;
                    j = len;
                  }
                }
                if (backNum == -1) {
                  if (this.nim && this.nim.disconnect) {
                    this.nim.disconnect({
                      done: () => {
                        this.nim = {};
                        wx.redirectTo({
                          url: `/packageA/imScene/imScene?&caseId=${this.caseId}&patientId=${this.patientId}`
                        });
                      }
                    });
                  } else {
                    wx.redirectTo({
                      url: `/packageA/imScene/imScene?&caseId=${this.caseId}&patientId=${this.patientId}`
                    });
                  }
                } else {
                  if (this.nim && this.nim.disconnect) {
                    this.nim.disconnect({
                      done: () => {
                        this.nim = {};
                        wx.navigateBack({
                          delta: backNum
                        })
                      }
                    });
                  } else {
                    wx.navigateBack({
                      delta: backNum
                    })
                  }
                }
              }
            });
            break;
        }
      },

      getCaseBaseInfo() {

        getCaseInfo(this.caseId).then(data => {
          let {
            responseObject: {
              responseStatus,
              responseData
            }
          } = data;
          if (responseStatus && responseData) {
            let {caseType, doctorId} = responseData.dataList[0];
            this.caseType = caseType;
            this.setCaseType(caseType);
            console.log(parseInt(doctorId) && !(parseInt(doctorId) == this.doctorCustomerId));
            if (parseInt(doctorId) && !(parseInt(doctorId) == this.doctorCustomerId)) {
              this.recommendShow = true;
            } else {
              this.recommendShow = false;
            }
          } else {
            console.log("获取case 的基本信息失败");
          }
        })
      },

      //actionType透传消息统一处理接收条件
      receivedNotification(msg, actionType) {
        let flag = false;
        if (msg.type === "custom") {
          if (msg.content.type === "notification" && msg.content.data.actionType == actionType) {
            flag = true;
          }
        }
        return flag;
      },
      sendMessage() {

        if (this.sendTextContent.trim().length === 0) {
          return false;
        } else {
          this.textareaShow = false;
          let isJion=false;//判断是否改变了recommendShow的状态
          if(this.recommendShow){
            this.recommendShow=false;
            isJion=true;
          }
          if (!this.clickFlag) return false;
          this.clickFlag = false;
          console.log(this.sendTextContent.trim().substring(0,20));
          dataLog.createTrack({
            actionId: 14202,
            keyword: this.sendTextContent.trim()
          });
          let hints=0,
             ret = this.nim.filterClientAntispam({
                content: this.sendTextContent.trim()
             });
          switch (ret.type) {
            case 0:
              console.log('没有命中反垃圾词库', ret.result);
              hints=0;
              break;
            case 1:
              hints=1;
              console.log('已对特殊字符做了过滤', ret.result);
              break;
            case 2:
              hints=1;
              console.log('建议拒绝发送', ret.result);
              break;
            case 3:
              hints=1;
              console.log('建议服务器处理反垃圾，发消息带上字段clientAntiSpam', ret.result);
              break
          }
          imBaseMethods.sendMessage({
            target: this.targetData.account,
            sendContent: this.sendTextContent.trim(),
            custom: JSON.stringify({
              cType: "1",
              cId: this.doctorCustomerId,
              mType: "0",
              conId: this.orderSourceId,
              hints:hints
            }),
            needPushNick: false,
            pushContent: `患者${this.patientName ? this.patientName : ""}:${this.sendTextContent.trim().substring(0,20)}`,
            pushPayload: JSON.stringify({
              account: "0_" + this.caseId,
              type: "1"
            }),
          }).then(obj => {
            if(isJion){
              this.recommendShow=true;
            }
            this.textareaShow = true;
            this.setFocus = true;
            this.sendMessageSuccess(obj);
            //命中反垃圾，发送发垃圾消息提醒
            if(hints==1){
              this.sendAntiSpamTips();
            }
          }).catch((err, obj) => {
            this.sendFail(err, obj)
          });
        }
      },
      //发送成功回调
      sendMessageSuccess(msg) {
        this.clickFlag = true;
        this.getTimeStampShowList(msg);
        console.log(`发送${msg.scene}${msg.type}消息成功, id=${msg.idClient}`);
        if (msg.type === "custom") {
          msg.content = JSON.parse(msg.content);
        }

        if (!(msg.type === "custom" && msg.content.type === "deleteMsgTips")) {
          this.sendTextContent = "";
        }
        msg.timeStamp = this.transformTimeStamp(msg.time);
        // const _msg = this.setPraviteMessage(msg);
        this.msgList.push(this.setPraviteMessage(msg));
        this._originList.push(msg);
        // this.historyBeginTime=_msg.time;
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
          this._originList.forEach((element, index) => {
            if (element.idClient === idClient) {
              this._originList.removeByValue(element);
              return;
            }
          });
        }
        this.scrollToBottom();
      },
      //发送失败回调
      sendFail(err, msg) {
        this.clickFlag = true;
        console.log(err, msg)
        console.log(`发送${msg.type}消息失败, id=${msg.idClient}`);
      },
      triageDoctorAssign() {
        //是否有分诊会话记录
        //无则创建
        //有则获取
        console.log({
          caseId: this.caseId,
          consultationType: 1,
          customerId: this.doctorCustomerId
        })
        getConsultationList({
          caseId: this.caseId,
          consultationType: 1,
          customerId: this.doctorCustomerId
        }).then(data => {
          console.log(data)
          if (data.responseObject.responseMessage === "NO DATA") {
            this.createTriageMessage();
          } else {
            let dataList = data.responseObject.responseData.dataList;
            this.orderSourceId = dataList[0].consultationId;
            this.getLastTime(parseInt(dataList[0].consultationState));
            this.getMessageList("history");
          }

        });
      },
      //创建分流
      createTriageMessage() {
        createConsultation({
          caseId: this.caseId,
          caseType: "14",
          customerId: this.doctorCustomerId,
          patientCustomerId: this.patientCustomerId,
          patientId: this.patientId,
          consultationType: 1,
          consultationState: 0,
          consultationFrequency: 50,
          siteId: api.getSiteId(),
        }).then(data => {
          if (data.responseObject.responseStatus) {
            //创建就诊信息
            this.orderSourceId = data.responseObject.responsePk;

            this.getMessageList("history");
            this.getLastTime(0);
          }
        });
      },
      //获取剩余时间/次数
      getLastTime(status) {

        getConsultationLastTime({
          caseId: this.caseId,
          customerId: this.doctorCustomerId,
          consultationType: 1,
        }).then(param => {
          this.inputBoxShow = true;
          console.log(param)
          if (param.responseObject.responseStatus) {
            let dataList = param.responseObject.responseData.dataList;
            let time = parseInt(dataList.remainingTime);
            let count = parseInt(dataList.consultationFrequency);
            let receiveTime = parseInt(dataList.receiveTime);
            let endState = parseInt(dataList.endState);
            this.consultationState = parseInt(dataList.consultationState);
            this.shuntCustomerId = dataList.triageCustomerId;
            this.triageOrderSourceId = dataList.triageConsultationId;
            this.consultationLevel = dataList.consultationLevel;

            this.getConsultationStatusByTime(dataList, time, count, receiveTime, status,endState);
          }
        });

      },
      //根据剩余时间/次数进入各状态
      getConsultationStatusByTime(dataList, time, count, receiveTime, status,endState) {
        clearInterval(this.remainTimeCount);
        this.pauseLastTimeCount();
        // -1 为不限次，针对于美年来源
        if (count == -1) {
          if (status == 2 || status == 3) {
            this.receiveTreatmentStatus = false;
            this.lastTimeShow = false;
            this.textareaShow = false;
            this.bottomTipsType = 2;
            this.footerBottomFlag = false;
            this.bottomTipsShow = false;
            // if (this.caseType == 12 || this.caseType == 13) {
            //   this.inputBoxShow = false;
            // }
          } else {
            this.receiveTreatmentStatus = true;
            this.bottomTipsShow = false;
            this.lastTimeShow = true;
            this.textareaShow = true;
            this.bottomTipsType = "";
            // status 等于 -1 时，是待就诊状态
            if (status < 0) {
              this.receiveTreatmentStatus = false;
              this.lastTimeShow = false;
              if (receiveTime >=0) {
                console.log(receiveTime);
                this.receiveTime = receiveTime;
                // this.receiveTime = 5000;
                this.remainTimeOut();
              } else {
                this.textareaShow = false;
                this.footerBottomFlag = false;
                this.bottomTipsType = 2;
              }
            }
          }
        } else {
          this.totalCount = 0;
          // 若未接诊，接诊是否已超时...
          if (status < 0) {
            this.receiveTreatmentStatus = false;
            if (receiveTime <= 0) {
              this.showBottomTips(-1);
              this.textareaShow = false;
              this.footerBottomFlag = false;
            } else {
              console.log(receiveTime)
              this.receiveTime = receiveTime;
              // this.receiveTime = 5000;
              this.bottomTipsShow = false;
              this.lastTimeShow = false;
              this.textareaShow = true;
              this.bottomTipsType = "";
              this.remainTimeOut();
            }
          } else if (status === 0) {
            // 已接诊，设置剩余时间次数...
            this.receiveTreatmentStatus = true;
            this.setConsultation(dataList.consultationId);

            if (time > 0 && count > 0) {
              // time == 99999999 为报到的患者，不限时间，只限 50次回复
              if (time === 999999999) {
                this.totalCount = count;
                this.setLastCount(count);
                this.lastTimeShow = true;
                this.textareaShow = true;
                this.bottomTipsType = "";
              } else {
                this.setLastTime(time);
                this.lastTimeCount();
                this.setLastCount(count);
                this.textareaShow = true;
                this.lastTimeShow = true;
                this.bottomTipsType = "";
              }
            } else {
              this.lastTimeShow = false;
              this.textareaShow = false;
              this.footerBottomFlag = false;
              this.showBottomTips(1);
            }
          } else if (status == 3) {
            // 对美年来源做区分
            if (this.caseType == '15') {
              this.receiveTreatmentStatus = false;
              this.lastTimeShow = false;
              this.textareaShow = false;
              this.bottomTipsType = 2;
              this.footerBottomFlag = false;
              this.bottomTipsShow = false;
            } else {
              this.lastTimeShow = false;
              this.textareaShow = false;
              this.footerBottomFlag = false;
              this.showBottomTips(-1);
            }
          } else if (status == 2) {
            this.lastTimeShow = false;
            this.textareaShow = false;
            this.bottomTipsType = 2;
            this.footerBottomFlag = false;
            this.bottomTipsShow = false;

            // if (this.caseType == 12 || this.caseType == 13) {
            //   this.inputBoxShow = false;
            // }
          } else if (status == 1) {//结束
            // 对美年来源做区分
            if (this.caseType == '15') {
              this.receiveTreatmentStatus = true;
              this.bottomTipsShow = false;
              this.lastTimeShow = true;
              this.textareaShow = true;
              this.bottomTipsType = "";
            } else {
              this.textareaShow = false;
              this.lastTimeShow = false;
              this.footerBottomFlag = false;
              if(endState==1||endState==2){//强制结束
                this.showBottomTips(3);
              }else {//正常结束
                this.showBottomTips(1);
              }

            }

          }
        }
      },
      showBottomTips(type) {
        this.bottomTipsShow = true;
        this.bottomTipsType = type;
      },
      //接诊时间倒数
      remainTimeOut() {
        this.remainTimeCount = setInterval(() => {
          // console.log(this.receiveTime)
          if (this.receiveTime <= 0) {
            clearInterval(this.remainTimeCount);
            setTimeout(() => {
              this.getConsultationStatus();
            }, 1000);
            // this.bottomTipsType = -1;
            // this.bottomTipsShow=true;
            // this.footerBottomFlag = false;

            if (this.orderSourceId && this.consultationLevel) {
              updateAfterTimeOver({
                consultationId: this.orderSourceId,
                consultationType: "1",
                consultationLevel: this.consultationLevel,
                consultationState: "-1",
                updateConsultationState: "3"
              }).then((res) => {
                if (res.responseObject.responseStatus) {
                  console.log("时间结束后更新状态成功");
                }
              }).catch((err) => {
                console.log("时间结束后更新状态失败");
              })
            }
          } else {
            this.receiveTime = this.receiveTime - 1000;
          }
        }, 1000);
      },
      // 连接IM
      connectToNim() {
        const that = this;
        //获取IM Token/appKey
        nimEnv().then(nimEnv => {
          this.finish = true;
          console.log(nimEnv)
          this.nim = NIM.getInstance({
            debug: false,
            appKey: nimEnv,
            account: this.userData.account,
            token: this.userData.token,
            reconnectionAttempts: 0, //断线不主动重连，否则Unload后
            onconnect: data => {
              this.finish = false;
              console.log(nimEnv)
              console.log("连接成功");
              this.connectNum += 1;

              this.triageDoctorAssign();

              imBaseMethods = new ImBusinessMethods(this.nim);
              this.nim.getClientAntispamLexicon({
                done: (error,file) => {
                  console.log('获取词库完成');
                  console.log(error);
                  console.log(file);
                }
              })
            },
            onupdatesession(obj) {
              console.log('更新会话');
              console.log(obj);

              if (obj.to == that.targetData.account && obj.lastMsg.fromClientType == 'Server') {
                if (obj.lastMsg.content.type === "medicalReport" || obj.lastMsg.content.type === "reportOrder") {
                  this.renderReceiveMessage(obj.lastMsg);
                }
                // let content=JSON.parse(obj.lastMsg.content);
                // if(content.type === "notification"&&content.data.actionType==58){
                //   this.renderReceiveMessage(obj.lastMsg);
                // }
              }
            },
            onmyinfo: info => {
              console.log(info)
            },
            onwillreconnect(obj) {
              console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
            },
            ondisconnect() {
              console.warn("链接已中断...即将重新连接");
            },
            onroamingmsgs(obj) {
              console.log("漫游消息...");
            },

            onofflinemsgs: (obj) => {
              console.log("离线消息...");
              // console.log(obj)
              // obj.msgs.forEach((e, i) => {
              //   if (this.msgList.indexOf(e) < 0) {
              //     this.renderReceiveMessage(e);
              //   }
              // });
              // this.scrollToBottom();

            },
            onmsg: msg => {
              console.log('收到消息')
              console.log(msg)
              this.renderReceiveMessage(msg);
            }
          });
        }).catch(err => {
          console.log(err)
        })
      },
      // 处理收到的消息
      renderReceiveMessage(msg) {
        if (msg.from === this.targetData.account) {
          if (msg.type === "custom") {
            msg.content = JSON.parse(msg.content);
          }
          // const _msg = this.setPraviteMessage(msg);
          this.msgList.push(this.setPraviteMessage(msg));
          this._originList.push(msg);
          if (msg.type === "text") {
            this.targetMsgList.push(this.setPraviteMessage(msg));
          }
          // 处理收到的图片
          if (msg.type === "image") {
            this.imageList.push(msg.file.url);
          }
          //对于美年来源的患者 次数不做计算
          if (this.caseType != '15') {
            if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
              this.lastCountPlus();
            } else if (msg.type !== "custom") {
              this.lastCountMinus();
            }
          }

          if (msg.type === "custom" && msg.content.type === "deleteMsgTips") {
            let idClient = (msg.content.data.deleteMsg && msg.content.data.deleteMsg.idClient) || (msg.content.data.imMessage && msg.content.data.imMessage.idClient) || (msg.content.data.deleteMsg && msg.content.data.deleteMsg.messageId);
            this.msgList.forEach((element, index) => {
              if (element.idClient === idClient) {
                this.msgList.removeByValue(element);
                if (element&&element.custom&&element.custom.mType == 1) {
                  this.imageList.removeByValue(element.file.url);
                }
                return;
              }
            });
          }

          this.receiveSpecialMessage(msg);
          this.getTimeStampShowList(msg);

          this.setTargetList(this.targetMsgList);
          if (msg.type === "image") {
            setTimeout(() => {
              this.scrollToBottom(1000);
            }, 200)
          } else {
            this.scrollToBottom();
          }
        }
      },
      //接收图片利用云信SDK作预览压缩
      imageCompressByNim(msg) {
        //云信图片压缩
        if (msg.type === "image") {
          this.imageList.unshift(msg.file.url);
          // const qualityUrl = this.nim.viewImageQuality({
          //   url: msg.file.url,
          //   quality: 60
          // });
          // if (this.imageList.indexOf(qualityUrl) == -1) {
          //   this.imageList.push(qualityUrl);
          // }
        }
      },
      //医生发送特殊消息的处理对应方案
      receiveSpecialMessage(msg) {
        if (msg.type === "custom") {
          if (msg.content && msg.content.type === "notification") {
            let type = msg.content.data.actionType;
            switch (parseInt(type)) {
              case 1: //患者购买 不处理
                break;
              case 2: //医生赠送次数
                this.getConsultationStatus();
                break;
              case 3: //医生主动拒绝
                this.getConsultationStatus();
                clearInterval(this.remainTimeCount);
                // this.lastTimeShow = false;
                // this.footerBottomFlag = false;
                // this.bottomTipsShow = false;
                // this.textareaShow = false;
                // this.bottomTipsType = 2;
                //
                // if (this.caseType == 12 || this.caseType == 13) {
                //   this.inputBoxShow = false;
                // }
                break;
              case 4: //医生接诊
                this.getLastTime(0);
                break;
              case 58: //医生强制结束沟通
                this.getLastTime(1);
                break;

            }
          }
        }
      },
      transformTimeStamp(time) {
        return imBaseMethods.transformTimeStamp(time);
      },
      getPatientBase(type) {

        return getPatientBase({
          patientId: this.patientId,
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            this.setPatientName(dataList[0].patientName);

            this.setPatientInfo({
              patientId: this.patientId,
              patientName: dataList[0].patientName,
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
              localStorage.setItem("patientInfo", JSON.stringify(this.patientInfo));

              if (this.from === "report") {
                // this.checkReportDetails(type);
              } else {
                // this.checkHasSendedMedicalReport(type);
              }
            }
          }
        });

      },

      getDoctorMsg() {

        return getDoctorBaseMsg({
          doctorCustomerId: this.doctorCustomerId,
          logoUseFlag: 5
        }).then(data => {

          if (data.responseObject && data.responseObject.responseData) {
            const dataList = data.responseObject.responseData.dataList[0];
            wx.setNavigationBarTitle({
              title: `${dataList.customerName}医生`
            });
            this.setTargetMsg({
              avatar: dataList.logoUrl,
              nick: dataList.customerName,
              title: dataList.medicalTitle,
              hospital: dataList.company,
              companyId: dataList.companyId,
              medical: dataList.medical,
              customerId: this.doctorCustomerId,
            });
            this.titleName = `${dataList.customerName}医生`;

            console.log(this.targetMsg)
            this.getTargetMsgFinish = true;
            localStorage.setItem("targetMsg", JSON.stringify(this.targetMsg))
          }
        });
      },
      setPraviteMessage(element) {
        let result = {
          from: element.from,
          to: element.to,
          time: element.time,
          timeStamp: element.timeStamp || "",
          type: element.type,
          text: element.text,
          idClient: element.idClient,
          target: element.target,
        };
        if (element.type === "custom") {
          result = Object.assign(result, {
            content: element.content || {},
          })
        } else if (element.type === "file" || element.type === "image" || element.type === "video") {
          result = Object.assign(result, {
            file: element.file ? element.file : {}
          })
        }
        return result;
      },
      buildRenderMsg(type, msgs) {
        this.beginTimestamp = 0;
        if (msgs.length === 0) return;

        let msgList = [],
          targetMsgList = [],
          timeStampShowList = [];
        msgs.forEach((element, index) => {
          this.imageCompressByNim(element);
          if (index == msgs.length - 1) {
            this.historyBeginTime = element.time
          }
          if (element.type === "custom") {
            element.content = JSON.parse(element.content);
          }
          element.timeStamp = this.transformTimeStamp(element.time);

          if (this.msgList.indexOf(element) < 0) {
            msgList.unshift(this.setPraviteMessage(element));
          }

          if (element.from === this.targetData.account && element.type === "text") {
            targetMsgList.unshift(this.setPraviteMessage(element));
          }

          if (element.type === "custom" && element.content.type === "deleteMsgTips") {

            let idClient = (element.content.data.deleteMsg && element.content.data.deleteMsg.idClient) || (element.content.data.imMessage && element.content.data.imMessage.idClient) || (element.content.data.deleteMsg && element.content.data.deleteMsg.messageId);
            if (element.idClient === idClient) {
              msgList.removeByValue(this.setPraviteMessage(element));
            }
          }
        });
        if (type === "scrollInit") {
          this.msgList = msgList.concat(this.msgList);
          this.targetMsgList = this.targetMsgList.concat(targetMsgList);
          this._originList = msgs.concat(this._originList);
          this.setTargetList(this.targetMsgList);
        } else {

          this.msgList = msgList;
          this.targetMsgList = targetMsgList;
          this._originList = this.reverse(msgs);
          this.setTargetList(this.targetMsgList);
        }


        this._originList.forEach((element, index) => {
          if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1){
            if (element.type === "custom") {
              if (!element.content.type) {
                element.content = JSON.parse(element.content);
              }
              if (element.content.type === 'notification' && element.content.data.actionType == 5) {
                timeStampShowList.push(0);
              } else {
                this.beginTimestamp = element.time;
                timeStampShowList.push(1);
              }
            } else {
              this.beginTimestamp = element.time;
              timeStampShowList.push(1);
            }
          } else {
            timeStampShowList.push(0);
          }
        });

        this.timeStampShowList = timeStampShowList;

        if (type !== "scrollInit") {
          setTimeout(() => {
            this.scrollToBottom(1000);
          }, 0);
        } else {
          setTimeout(() => {
            this.pulling = false;
          }, 800)
        }

        this.allMsgsGot = true;
        // this.pushHealthCard();    // 健康卡push提示消息
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
          url:'/packageD/healthCard/healthCardRecognition?from=imSceneDoctor'
        })
      },
      getTimeStampShowList(element) {
        // console.log(this.timeStampShowList);
        // console.log(element.time, this.beginTimestamp)
        if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
          if (element.type === "custom") {
            if (!element.content.type) {
              element.content = JSON.parse(element.content);
            }
            if ((element.time - this.beginTimestamp) / (5 * 60 * 1000) > 1) {
              if (element.content.type === 'notification' && element.content.data.actionType == 5) {
                this.timeStampShowList.push(0);
              } else {
                this.beginTimestamp = element.time;
                this.timeStampShowList.push(1);
              }
            } else {
              this.timeStampShowList.push(0);
            }
          } else {
            this.beginTimestamp = element.time;
            this.timeStampShowList.push(1);
          }
        } else {
          this.timeStampShowList.push(0);
        }

      },
      reverse(list) {
        let result = [];
        list.forEach((element, index) => {
          result.unshift(element);
        });

        return result;
      },
      //长按事件响应
      longTouchEmitHandler(index) {
        console.log(index)
        if (this.toolbarConfig.delete) {
          this.deleteMsgIndex = index;
        }
      },
      //消息撤回
      deleteMsgEvent(msg, index) {
        console.log(this._originList)
        const _msg = this._originList[index];
        console.log(_msg);
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
          msg: _msg,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
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
              deleteMsg: _msg || {}
            }
          }),
          deleteFailCallback: err => {
            console.log(err)
            this.showToast(`您只能撤回${_DeleteTimeLimit}内的消息`)
          },
          deleteSuccessCallback: dMsg => {
            if (JSON.parse(_msg.custom).mType == 1) {
              let _imageUrl = _msg.file.url;
              this.imageList.map((element, index) => {
                if (element === _imageUrl) {
                  this.imageList.removeByValue(element);
                  return;
                }
              });
            }
            console.log(dMsg)
            this.sendMessageSuccess(dMsg);
            console.log(`撤回消息提示--发送成功`);
          }
        });
      },
      getImageList() {
        this.$nextTick(() => {
          const imageList = [];
          if (this.$refs.bigImg) {
            this.$refs.bigImg.forEach((element, index) => {
              if (this.imageList.indexOf(element.imageMessage.file.url) == -1) {
                imageList.push(element.imageMessage.file.url);
              }
            });
          }
          this.imageList = imageList;
        });
      },
      scrollToBottom(delayTime = 200) {
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
      checkHasSendedMedicalReport(type) {
        //检测从未发送过...
        imBaseMethods.getMessageList({
          beginTime: 0,
          endTime: 0,
          target: this.targetData.account,
          limit: 5,
          reverse: true,
        }).then(obj => {
          let flag = false;
          const msgList = obj.msgs;
          for (let i in msgList) {
            let _ele = msgList[i];
            if (_ele.type === "custom" && _ele.content && (JSON.parse(_ele.content).type === 'medicalReport' || JSON.parse(_ele.content).type === 'reportOrder')) {
              flag = false;
              return;
            } else {
              flag = true;
            }
          }

          if (type === "history" && flag) this.getMedicalMessage();
          this.allMsgsGot = true;
        }).catch(err => {
          console.log(err)
        })
      },
      checkReportDetails(type) {
        //检测从未发送过...
        imBaseMethods.getMessageList({
          beginTime: 0,
          endTime: 0,
          target: this.targetData.account,
          limit: 5,
          reverse: true,
        }).then(obj => {
          const msgList = obj.msgs;
          let _flag = false;
          for (let i in msgList) {
            let _ele = msgList[i];
            if (_ele.type === "custom" && _ele.content && JSON.parse(_ele.content).type === 'reportOrder') {
              _flag = false;
              return false;
            } else {
              _flag = true;
            }
          }
          console.log(type)
          if (type === "history" && _flag) this.getReportDetails();
          this.allMsgsGot = true;
        }).catch(err => {
          console.log(err)
        })
      },
      getMedicalMessage() {
        getMedicalReportDetails({
          caseId: this.caseId,
        }).then(data => {
          if (data.responseObject && data.responseObject.responseData) {
            let dataList = data.responseObject.responseData.dataList;
            if (dataList && dataList.length !== 0) {
              this.sendMedicalReport(dataList[0]);
            }
          }
        });
      },
      getReportDetails() {
        getReportDetails({
          reportId: this.reportId
        }).then(data => {
          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
              const dataList = data.responseObject.responseData.data_list;

              this.sendReportDetails(dataList[0])
            }
          }
        }).catch(err => {
          console.log(err);
        });
      },
      sendReportDetails(param) {
        let dateType = "", source = "";

        switch (parseInt(param.dateType)) {
          case 1:
            dateType = "上午";
            break;
          case 2:
            dateType = "下午";
            break;
          case 3:
            dateType = "晚上";
            break;
          default:
            break;
        }

        if (param.reportChannelOther && param.reportChannelOther.length > 0) {
          if (param.reportChannelOther.length > 4) {
            source = param.reportChannel + " - " + param.reportChannelOther.substring(0, 4) + "...";
          } else {
            source = param.reportChannel + " - " + param.reportChannelOther;
          }
        } else {
          source = param.reportChannel
        }

        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "53",
            conId: this.orderSourceId
          }),
          isPushable: true,
          isUnreadable:true,
          needPushNick: false,
          pushContent: `患者<${this.patientName ? this.patientName : ""}>向您报到，点击查看详情`,
          content: JSON.stringify({
            type: "reportOrder",
            data: {
              //三种类型的患者都需要传的字段
              patientId: param.patientId,    //患者Id
              reportType: param.reportType,    //患者类型 1-门诊患者；2-住院患者；3-首次就诊患者 *
              patientName: param.patientName,    //患者名称
              patientSex: parseInt(param.patientSex) == 1 ? "男" : "女",    //患者性别
              patientAge: param.patientAge,    //患者年龄
              reportId: this.reportId || "",


              //住院患者需要传的字段
              hospitalTime: param.reportType == 2 ? (param.visitDate.substring(0, 10) + "     " + dateType || "") : "",    //住院时间
              diagnosis: param.reportType == 2 ? (param.doctorDiagnosis || "") : "",    //医生诊断
              isOperation: param.reportType == 2 ? (parseInt(param.whetherOperation) === 1 ? "已手术" : "未手术") : "",    //是否手术
              operationName: param.reportType == 2 ? (param.operationName || "") : "",    //手术名称
              operationTime: param.reportType == 2 ? (param.operationDate && param.operationDate.substring(0, 10) || "") : "",    //手术时间


              //门诊患者需要传的字段
              clinicPurpose: param.reportType == 1 ? (param.reportPurpose || "") : "",    //就诊目的
              clinicTime: param.reportType == 1 ? (param.visitDate.substring(0, 10) + dateType || "") : "",    //就诊时间
              clinicDiagnosis: param.reportType == 1 ? (param.doctorDiagnosis || "") : "",    //医生诊断
              treatmentRecommendations: param.reportType == 1 ? (param.doctorSuggest || "") : "",    //治疗建议


              //初次就诊患者需要传的字段
              source: param.reportType == 3 ? source : "",    //来源渠道
              illnessDetail: param.reportType == 3 ? (param.reportPersonCondition || "") : "",    //病情详述
              purpose: param.reportType == 3 ? (param.reportAssist || "") : "",    //初次就诊患者 就诊目的

              // 图片列表字段
              // attrList: param.attList || [],
              // 标签列表字段
              patientTagList: param.tagList || [],
              // 标签备注字段
              tagRemark: param.tagRemark || ""
            }
          })
        }).then(msg => {
          this.historyBeginTime = msg.time;
          this.sendMessageSuccess(msg);
          this.allMsgsGot = true;
          setTimeout(() => {
            this.checkReportDetails("history");
          }, 8000);
        }).catch(err => {
          console.log(err);
        });
      },
      //发送咨询单
      sendMedicalReport(param) {
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "27",
            conId: this.orderSourceId
          }),
          isPushable: false,
          isUnreadable: false,
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
          this.sendMessageSuccess(msg);
          this.historyBeginTime = msg.time; // 设置分页开始时间
          this.allMsgsGot = true;
          setTimeout(() => {
            this.checkHasSendedMedicalReport("history");
          }, 8000);
          if (!this.from || this.from !== "report") {
            this.sendHistoryTips();
          }
        });
      },
      sendHistoryTips() {
        imBaseMethods.sendCustomMessage({
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "44",
            conId: this.orderSourceId
          }),
          content: JSON.stringify({
            type: "getHistoryTip",
            data: {
              caseId: this.userData.account.substring(2)
            }
          })
        }).then(msg => {
          this.sendMessageSuccess(msg);
        })
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
      selectVideo() {
        const that = this;
        wx.chooseVideo({
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success(res) {
            console.log(res);
            that.sendVideo(res.tempFilePath);
          }
        })
      },
      sendVideo(file) {
        this.finish = true;
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt3'
        });
        imBaseMethods.sendVideoMessage({
          file: file,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "3",
            conId: this.orderSourceId
          }),
          isPushable: true,
          isUnreadable:true,
          needPushNick: false,
          pushContent: `患者${this.patientName ? this.patientName : ""}:[影像]`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          progressCallback: (obj) => {

          },
          sendSuccessCallback: (msg) => {
            this.finish = false;
            this.msgList.push(this.setPraviteMessage(msg));
            this._originList.push(msg);
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        });
      },
      selectImage() {
        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            const tempFiles = res.tempFiles;
            if (tempFiles.length > 1) {
              this.sendMulitpleImage(tempFiles);
            } else {
              this.sendImage(tempFiles[0]);
            }
          }
        })
      },
      sendMulitpleImage(tempFiles) {
        this.finish = true;
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt38'
        });
        imBaseMethods.sendMulitpleImage({
          list: tempFiles,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "38",
            conId: this.orderSourceId
          }),
          isPushable: true,
          isUnreadable:true,
          needPushNick: false,
          pushContent: `患者${this.patientName ? this.patientName : ""}:[影像]`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          sendSuccessCallback: (msg) => {
            this.finish = false;

            msg.content = JSON.parse(msg.content);
            this.msgList.push(this.setPraviteMessage(msg));
            this._originList.push(msg);
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        });
      },

      sendImage(file) {
        this.finish = true;
        this.disabled = true;
        dataLog.createTrack({
          actionId: 14202,
          keyword: 'mt1'
        });
        imBaseMethods.sendImageMessage({
          file: file,
          to: this.targetData.account,
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "1",
            conId: this.orderSourceId
          }),
          isPushable: true,
          isUnreadable:true,
          needPushNick: false,
          pushContent: `患者${this.patientName ? this.patientName : ""}:[影像]`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          progressCallback: (obj) => {

          },
          sendSuccessCallback: (msg) => {
            console.log(msg)
            // this.progressNum--;
            this.msgList.push(this.setPraviteMessage(msg));
            this._originList.push(msg);
            // this._originList.push(msg);
            // this.msgList[imageLastIndex] = msg;
            this.imageList.push(msg.file.url);
            this.finish = false;
            // this.$nextTick(() => {
            //   this.scrollToBottom();
            // });
            setTimeout(() => {
              this.scrollToBottom(1000);
              setTimeout(() => {
                this.disabled = false;
              }, 1000);
            }, 200)
          }
        });
      },
      getConsultationStatus() {
        this.finish = true;
        getConsultationList({
          caseId: this.caseId,
          consultationType: 1,
          customerId: this.doctorCustomerId
        }).then(data => {
          this.finish = false;
          if (data.responseObject.responseMessage === "NO DATA") {
            this.createTriageMessage();
          } else {
            let dataList = data.responseObject.responseData.dataList;
            this.orderSourceId = dataList[0].consultationId;

            this.getLastTime(parseInt(dataList[0].consultationState));
          }
        });
      },
      getMessageList(type) {
        //获取用户基本信息...
        this.getPatientBase(type).then((res) => {
          // this.checkFirstBuy();
          return this.getDoctorMsg();
        }).then(() => {
          //拉取历史记录...
          this.getHistoryMessage(0);
        })
      },
      // 拉取历史记录；
      getHistoryMessage(num) {
        if (num > 20) return console.log('2s之间获取历史消息一直为空');
        imBaseMethods.getMessageList({
          beginTime: 0,
          // endTime: this.historyBeginTime,
          target: this.targetData.account,
          limit: 20
        }).then(obj => {
          console.log('获取历史');
          console.log(obj);
          // 为了兼容报道的患者至少一条问诊历史，而轻问诊和找医生至少有两条问诊历史
          if (this.from === "report" && obj.msgs.length > 0) {
            return this.buildRenderMsg('history', obj.msgs);
          } else if (this.from !== "report" && obj.msgs.length > 1) {
            return this.buildRenderMsg('history', obj.msgs);
          } else {
            setTimeout(() => {
              return this.getHistoryMessage(++num);
            }, 200)
          }
        });
      },
      //查询是否第一次购买
      // checkFirstBuy() {
      //   if (localStorage.getItem("sendTips")) {
      //     this.sendPayFinish(JSON.parse(localStorage.getItem("sendTips")));
      //   }
      // },
      //支付后发送提示语
      sendPayFinish(args) {
        let count = "",
          userData = "",
          desc = "",
          subContentDesc = "",
          contentType = "",
          amount = "";
        if (args.nick) {
          userData = args;
          count = JSON.parse(localStorage.getItem("sendTips"));
        } else {
          count = args;
          userData = this.userData;
        }


        switch (parseInt(count.orderType)) {
          case 0:
            desc = "免费";
            break;
          case 1:
            desc = "图文";
            break;
          case 3:
            desc = "特需";
            break;
          default:
            break;
        }

        if (count.orderAmount) {
          amount = `(${count.orderAmount}元)`;
        } else {
          amount = "";
        }

        if (parseInt(count.orderType) === 0) {
          subContentDesc = "[患者申请免费咨询]";
          contentType = "申请";
        } else {
          subContentDesc = `[患者购买咨询]`;
          contentType = "购买";
        }
        localStorage.removeItem("sendTips");
        imBaseMethods.sendCustomMessage({
          custom: JSON.stringify({
            cType: "1",
            cId: this.doctorCustomerId,
            mType: "33",
            conId: this.orderSourceId
          }),
          to: this.targetData.account,
          isPushable: false, // 是否推送
          isUnreadable:false, // 医生端是否计入未读数
          needPushNick: false, // 医生端是否展示昵称
          pushContent: `患者<${this.patientName ? this.patientName : ""}>向您咨询，点击查看详情`,
          pushPayload: JSON.stringify({
            account: "0_" + this.caseId,
            type: "1"
          }),
          content: JSON.stringify({
            type: "notification",
            data: {
              actionType: "1",
              contentDesc: `患者已${contentType}您的${desc}咨询${amount}`,
              subContentDesc: subContentDesc
            }
          })
        }).then(msg => {
          if (this.msgList.length !== 0) {
            this.sendMessageSuccess(msg);
          }
        }).catch((err, msg) => {
          this.sendFail(err, msg);
        });
      },
      formSubmitName(e) {
        sendFormId(e.target.formId);
      },
      //时间为0后交流状态更新为已结束
      updateAfterTimeOver() {
        updateAfterTimeOver({
          consultationId: this.orderSourceId,
          consultationType: "1",
          consultationLevel: this.consultationLevel,
          consultationState: "0",
          updateConsultationState: "1"
        }).then((res) => {
          if (res.responseObject.responseStatus) {
            console.log("时间结束后更新状态成功");
          }
        }).catch((err) => {
          console.log("时间结束后更新状态失败");
        })
      }
    },
    watch: {
      //监听剩余时间的变化，小于0进入沟通结束状态
      lastTime(time) {
        // console.log(time)
        if (time <= 0) {
          // this.lastTimeShow = false;
          // this.bottomTipsShow = true;
          // this.textareaShow = false;
          // this.footerBottomFlag = false;
          // this.showBottomTips(1);

          if (this.orderSourceId && this.consultationLevel) {
            this.updateAfterTimeOver();
          }

          this.getConsultationStatus();
        } else {
          this.lastTimeShow = true;
          this.bottomTipsShow = false;
        }
      },
      //监听剩余次数的变化，小于0进入沟通结束状态
      lastCount(count) {
        if (count <= 0) {
          this.lastTimeShow = false;
          this.bottomTipsShow = true;
          this.footerBottomFlag = false;
          this.textareaShow = false;
          this.showBottomTips(1);
          this.pauseLastTimeCount();
          // this.getConsultationStatus();
        } else {
          this.lastTimeShow = true;
          this.bottomTipsShow = false;
        }
      },
    },
    components: {
      MedicalReport,
      ContentText,
      ImageContent,
      BottomTips,
      MiddleTips,
      PayFinishTips,
      OutpatientInvite,
      OutpatientAppointment,
      OutpatientService,
      SendCount,
      DoctorAdvice,
      VideoMessage,
      MulitpleImage,
      ReportDetails,
      Suggestion,
      FileMessage,
      Toast,
      confirm,
      NormalLoading,
      BackIndex,
      patientNodeMsg,
      reportImageUpload,
      serviceComment,
      blackList
    }
  }

</script>
<style lang="scss" rel="stylesheet/scss">
  @import "static/scss/modules/imDoctorStyle";
  @include iphoneX{
    .prohibit-input{
      height: 88px;
      box-shadow:none;
    }
    .footer-box-top{
      height: 98px;
    }
    .main-input-box{
      padding-bottom: 68px;
      /*background: #00D6C6;*/
      &.main-input-box-text{
        background: #00D6C6;
        padding-bottom: 34px;
        &.main-input-box-end{
          background:rgba(204,204,204,1);
        }
      }
      .main-input-box-textarea-inner .area-content .main-input-box-textarea{
        line-height: 70px;
        height: 70px;
        border-radius: 70px;
        margin-top: 2px;
      }
      span{
        font-size: 38px;
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
  /*反垃圾*/
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
  /*咨询结束*/
  .consultation-end{
    background:rgba(204,204,204,1);
  }
  .animated {
    box-shadow: none !important;
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

