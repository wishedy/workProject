<template>
  <section class="doctorHome-main">
    <!-- 个人信息 -->
    <section class="doc-topInfo">
      <section class="doc-name-big">{{doctorName}}医生</section>
      <section class="top-left" :class="{'no-background':!videoUrl.length>0}" @click="playVideoFn('video')">
        <section class="doc-playVideo" v-if="videoUrl.length>0"></section>
        <img :src="doctorLogo" alt="">
      </section>
      <section class="top-right">
        <!-- <section><span class="doc-name">{{doctorName}}</span></section> -->
        <section><span class="doc-medical">{{medicalTitle}}</span><span class="doc-degree" v-if="false">{{formatDepartment}}</span></section>
        <section class="doc-right-content2"><span class="doc-hospitallName">{{company}}</span></section>
        <span class="doc-hospitalGrade" v-if="authMap.hospitalLevelId==1">三甲</span>
        <section class="doc-cureTime">{{jobDoctorYear}}</section>
      </section>
    </section>
    <!-- 医生擅长 -->
    <section class="doc-listComm doc-goodAt" v-if="expertiseFiled.length>0">
      <section class="doc-listTitle">擅治疾病</section>
      <section class="doc-listContent">
        <span class="doc-goodTips" v-for="(item,index) in expertiseFiled" :key="index">{{item}}</span>
      </section>
    </section>
    <!-- 执业简介 -->
    <section class="doc-listComm doc-practice">
      <section class="doc-listTitle">执业简介<button class="doc-infoMore" open-type="getUserInfo" @getuserinfo="doctorMoreFn">更多</button>
      </section>
      <section class="doc-listContent" v-if="practiceIntroduction.length>0">{{practiceIntroduction}}</section>
    </section>
    <!-- 全部评价 -->
    <section class="doc-listComm allSuggestion" v-show="abilityPatientList.length>0">
      <section class="doc-listTitle">全部评价</section>
      <section class="doc-listContent doc-listContent-tag" v-for="(item, index) in abilityPatientList" :key="index" v-if="isMoreClick||((!isMoreClick)&&index<5)">
        <section class="doc-evaluateTitle">
          <img :src="item.patientLogo" alt="">
          <section class="doc-evalUserName">{{item.patientName}}</section>
        </section>
        <!--<section  class="doc-evaluateContent">{{'“'+item.patientReputation+'”'}}<span class="circle"></span></section>-->
        <section  class="doc-evaluateContent">
          <p v-if="item.tag" class="doc-evaluate-tag">{{item.tag}}</p>
          <p v-if="item.patientReputation" class="doc-evaluate-text" :class="{'doc-evaluate-top':item.tag}">{{'“'+item.patientReputation+'”'}}</p>
          <p v-if="(!item.patientReputation)&&(!item.tag)" class="doc-evaluate-text">“该用户给出好评，对医生非常满意”</p>
          <span class="circle"></span>
        </section>
        <!-- <section v-if="patientReputationStatusList[index]" class="doc-evaluateContent">{{'“'+patientReputationList[index]+'”'}}<span class="circle"></span><span v-if="item.patientReputation.length>37" @click="changeBtnStatus(index)" class="showMoreBtn"></span></section> -->
        <!-- <section v-if="!patientReputationStatusList[index]" class="doc-evaluateContent">{{'“'+item.patientReputation+'”'}}<span class="circle"></span><span @click="changeBtnStatus(index)" class="showMoreBtn closeBtn"></span></section> -->
      </section>
      <section v-if="abilityPatientList.length>5&&(!isMoreClick)" @click="openMoreAbility" class="more-reputation">更多评价</section>
    </section>
    <!-- 专家指南 -->
    <section class="doc-border-hightLine" v-if="doctorGuideList && doctorGuideList.length>0"></section>
    <section class="doc-listComm doc-guide" v-if="doctorGuideList.length">
      <section class="doc-listTitle">专家指南<span v-if="doctorGuideList.length > 2" class="doc-infoMore" @click="goPatientNoteList()">更多</span>
      </section>
      <ul class="doc-guide-list">
        <li class="doc-guide-item" v-for="(item,index) in doctorGuideList" :key="index" v-if="index < 2" @click="goPatientNodeDetail(item)">
          <div class="doc-guide-left">
            <img :src="item.coverUrl" alt="图片加载失败" class="node-img">
          </div>
          <div class="doc-guide-middle">
            <h3 class="guide-title">{{item.manualName}}</h3>
            <p class="guide-content">共{{item.articleNum}}篇</p>
          </div>
          <div class="doc-guide-right"></div>
        </li>
      </ul>
    </section>
    <section class="doc-border-hightLine" v-if="recommendLists && recommendLists.length>0"></section>
    <!-- 健康知识 /专家文章/-->
    <section class="doc-listComm doc-healthContent" v-if="recommendLists&&recommendLists.length>0" id="stroke-info">
      <section class="doc-listTitle">专家文章<span class="doc-infoMore" v-if="recommendLists && recommendLists.length>2" @click="goNavigateTo('health')">更多</span></section>
      <healthItem from="doctorMain" :healthLists="recommendListsLess" @clickCallback="trackCallback"></healthItem>
    </section>
    <!--<section class="doc-border-hightLine" v-if="recureJournalList && recureJournalList.length>0&& !isNoData"></section>-->
    <section class="doc-border-hightLine"></section>
    <!-- 手术康复日记 -->
    <figure class="doctorMainHistory" >
        <header :class="{'padding-bottom':recureJournalList.length}">
          <h3 class="journalTitle">手术康复日记</h3>
          <button v-if="recureJournalList.length" class="addJournal" open-type="getUserInfo" @getuserinfo="goPersonal">
            <img class="addIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/write.png">
            <span class="addText">我也要写</span>
          </button>
        </header>
        <template v-if="recureJournalList.length">
          <recureJournal :journalData="recureJournalList" @FromChild="jumpToDiary"
                         @clickCallback="rjTrack"></recureJournal>
          <section class="extraLine" v-show="recureJournalList.length>0">{{toBottom?'正在加载..':'--到底了--'}}</section>
        </template>
        <button v-if="!recureJournalList.length" class="goJournal" open-type="getUserInfo" @getuserinfo="goPersonal">
          <span class="space"></span>
          <section class="out-box">
            <img class="goIcon" src="https://m.allinmed.cn/static/image/mp/index/1.1.4/add-blue.jpg" alt="">
            <span class="goText">写我的手术康复日记</span>
          </section>
        </button>
    </figure>
    <!-- 去咨询按钮 -->
    <NormalLoading v-if="finish"></NormalLoading>
    <section class="doc-goConsult">
      <form @submit="formSubmit" report-submit='true' v-if="showShareBtn">
        <button class="shareBtn wx-contact-text"  open-type='share' type="submit" formType="submit"><span>分享</span></button>
      </form>
      <section class="invite-consult" v-show="(authMap.state!=8||openState==2)&&showBottom"><p>
        医生暂不在线，点击[预约咨询]医生助理会为您联系医生，并在医生上线后第一时间通知您。</p></section>
      <section class="doc-go-left">
        <p class="doc-goLone">
          <span class="doc-goFreeText" :class="{'notOnline':authMap.state!=8||openState==2}"
                v-if="authMap.state==8&&openState==1&&inquiryState>0&&payType=='free'">{{(authMap.state==8&&openState==1)?"前3次回复免费":"暂不在线"}}</span>
          <span class="doc-goFreeText" :class="{'notOnline':authMap.state!=8||openState==2}" v-if="authMap.state!=8||openState==2">{{(authMap.state==8&&openState==1)?"前3次回复免费":"暂不在线"}}</span>
          <span class="doc-goPrice" :class="{'charge':payType!=='free'}" v-if="authMap.state==8&&openState==1">¥{{generalPrice}} <span
            class="doc-priceIcon" v-if="payType=='free'"></span></span>
        </p>
        <p class="doc-goLTwo">已有<span class="doc-goNum">{{count}}</span>人咨询过</p>
      </section>
      <form @submit="formSubmit" report-submit='true'>
        <!-- 去咨询 -->
        <button class="doc-go-right" open-type="getUserInfo" formType="submit" @getuserinfo="authorizeFn"
                v-if="authMap.state==8&&openState==1">去咨询
        </button>
        <!-- 邀请开诊 -->
        <button class="doc-go-right" open-type="getUserInfo" formType="submit" @getuserinfo="authorizeFn"
                v-if="authMap.state!=8||openState==2">预约咨询
        </button>
      </form>
    </section>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询，现在继续去沟通吗？'
          }" v-if="confirmShow"  @cancelClickEvent="confirmShow=false" @ensureClickEvent="toImPage">
    </confirm>
    <BackIndex v-if="backIndexShow" :from="'doctorMain'"></BackIndex>
    <BlackList></BlackList>
    <authorization></authorization>
  </section>
</template>

<script>
  import api from "common/js/util/util";
  import authorization from "components/authorization/authorization";
  const XHRList = {
    getPersonalProXHR: "/mcall/customer/patent/v1/getMapList/",          // 个人简介
    // evaluate: "http://10.1.8.5:8080/static/js/jourList1.json",                                  // 获取患者评价信息
    evaluate: api.httpEnv()+"/mcall/tocure/patient/score/getByDoctorId/",                                  // 获取患者评价信息
    getDocMain: "/mcall/customer/auth/v2/getMapById/",                   //医生信息
    getVisitDetails: "/mcall/customer/advice/setting/v1/getMapById/",    //咨询详情
    updateTime: "/mcall/customer/case/consultation/v1/updateFrequency/", //更新次数
    getConsultationId:
      "/mcall/customer/case/consultation/v1/getConsultationFrequency/",  //获取咨询Id
    getCurrentByCustomerId:
      "/mcall/customer/advice/setting/v1/getCurrentByCustomerId/",       //获取剩余人数和状态,
    getVideos: api.httpEnv() + "/mcall/comm/data/logo/url/v1/getVideoList/",             //获取医生视频
    getDoctorGuide: api.httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorGuide/', // 获取专家指南列表
  };
  // 接口api
  import localStorage from "localStorage";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getBaseMessage from 'common/js/doctorHome/getBaseMessage';       //医生基本信息 api
  import getRecommendList from "common/js/HttpRequest/getEducationList";  //健康知识信息 api
  import getConsultPrice from 'common/js/doctorHome/getConsultPrice';
  import getConsultStatus from 'common/js/doctorHome/getConsultStatus';         //医生基本信息 api
  import getRecureJournal from "common/js/HttpRequest/getRecureJournal";       //康复日记 api
  import BackIndex from "components/backIndex"; // 返回首页组件
  import miniLogin from "common/js/miniUtil/miniLogin";                    //登录检测
  import getHasInvitedConsult from "common/js/HttpRequest/getHasInvitedConsult"   //是否邀请过
  // 组件
  import healthItem from "components/healthKnowComponents/healthItem";    //健康知识组件
  import recureJournal from "components/recureJournal";                   //康复日记列表
  import ensureConfirm from "components/ensure";
  import NormalLoading from 'components/loading';
  import confirm from 'components/confirm';
  import {createNamespacedHelpers} from "vuex";
  import dataLog from "dataLog";
  import getPagesParam from "common/js/getPagesParam/getPagesParam";
  const {mapMutations, mapGetters, mapActions, mapState} = createNamespacedHelpers('doctorMain');
  import BlackList from "components/BlackList";
  export default {

    data() {
      return {
        isMoreClick:false,//点击更多评价
        caseId: '',
        caseType:'', // 病例类型
        patientId: '',
        doctorLogo: '',
        authMap: {},
        doctorName: "",
        doctorCustomerId: '',
        medicalTitle: "",
        department: "",
        company: "",
        jobDoctorYear:'',          //从医
        expertiseFiled: [],        //擅治疾病 标签
        practiceIntroduction: '',  //执业介绍
        abilityPatientList: [],    //全部评价
        recommendListsLess: '',    //健康知识
        recommendLists:'',         //健康知识对象
        videoUrl: '',              //视频
        docHasVideo: false,        //是否有视频  默认false
        isAble: true,
        finish:false,
        params: {
          // 推荐患教参数
          recommendParam: {
            firstResult: 0,
            maxResult: 5,
            refCustomerId: '',
            isValid: 1,
            status: 1,
            sortType: 8,
            educationContentTypeNotIn:"5",
          },
          // 获取医生主页展示视频参数
          getDocVideoParams: {
            refId: '',  //string	是
            logoType: 12,
            logoType2: 13,
            firstResult: 0,                        //	string	是
            maxResult: 999,                        //string	是
            isValid: 1                             //string	是
          },
        },
        generalPrice:'',
        openState: 0,              //  接诊开关 0-"" | 1-开诊 | 2-不开诊
        payType: '',               // "pay"  "free"
        count: '',                 //咨询人数
        noStateTextTitle: '',
        noStateText: '',
        inquiryState:'',           //1-已开通免费咨询
        from:'',                   //来源
        ensureShow:false,           //授权
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        scrollTop:'',
        showBottom:true,
        showShareBtn:true,
        buttonClicked:true,
        nickName:'',              //微信昵称
        confirmShow:false,        //沟通中弹层
        type:'',
        currentPage:'',
        source:'',                 //通过扫码来源
        patientReputationList:[],  //v1.1.2 评价list
        patientReputationStatusList:[],
        recureJournalList:[],      //康复日记列表
        page: 0,
        loadMoreFlag: true,        //避免重复多次触底加载
        toBottom:true,
        clickFlag: true,
        isNoData:false,             //康复日记无数据
        backIndexShow: true,
        recommendType:''
      };
    },
    onUnload(){
      this.clearHisData();
    },
    onLoad(option) {
      if(option.recommend){//判断是否来自评价页面的专家文章
          this.recommendType=option.recommend;
      }else {
        this.recommendType='';
      }
      this.applicationType = '12';
      wx.removeStorageSync('reportPatient',true); // 清除患者报道患者的标记
      console.log(`-------------onLoad医生主页---------------`);
      this.clearHisData();
      wx.onNetworkStatusChange((res) => {
        this.finish = false;
        if (res && !!res.isConnected) {
        } else {}
      });
      let _this = this;
      if (localStorage.getItem("isOnWatch")) {
        localStorage.removeItem("isOnWatch");
        localStorage.removeItem("isOffLine");
      }
      // 扫码进来只能拼接 scene 参数，对此做判断
      if (option.scene) {
        this.doctorCustomerId = option.scene.split('_')[0]; //医生ID
        this.from = option.scene.split('_')[1]; //医生ID
        //对患教终端二维码中携带的参数qrCode做容错处理
        if(this.from=='qrCode'){
          this.from='';
        }
      }
      if (option.doctorCustomerId) {
        this.doctorCustomerId = option.doctorCustomerId; //医生ID
      }
      if (option.caseId) {
        this.caseId = option.caseId;
      }
      if (option.caseType) {
        this.caseType = option.caseType;
      }
      if (option.patientId) {
        this.patientId = option.patientId;
      }
      if (option.orderSourceId) {
        this.orderSourceId = option.orderSourceId;
      }
       if (option.from) {
        this.from = option.from;
      }
      if (option.type) {
        this.type = option.type
      }
      //扫码来源
      if (option.source) {
        this.source = option.source;
      }
      //获取授权信息
      wx.getSetting({
        success(res){
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                // _this.ensureShare = true;
                _this.nickName = res.userInfo.nickName;
              }
            })
          }
        }
      })
      _this.getRecureJournalOnLoad();
    },
    onShow() {
      console.log(`-------------医生主页onShow---------------`)
      this.recommendLists = "";
      this.recommendListsLess = '';
      this.getRecureJournalOnLoad();

      if(wx.getStorageSync('nodeDoctorId')){
        this.doctorCustomerId=wx.getStorageSync('nodeDoctorId');
        wx.removeStorageSync('nodeDoctorId');
      }

      this.init();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onPageScroll(e){
      this.scrollTop = e.scrollTop;
      // console.log(e.scrollTop);
      // if (this.backIndexShow == false && e.scrollTop >=60) {
      //   this.backIndexShow = true;
      // } else if (this.backIndexShow == true && e.scrollTop < 60) {
      //   this.backIndexShow = false;
      // }

    },
    //转发事件
    onShareAppMessage(res) {
      if (res.from === 'button') {
        // console.log(res.target)
      }
      // let _path = `/${getCurrentPages()[1].route}`;
      let _path = `/pages/mIndex/mIndex?doctorCustomerId=${this.doctorCustomerId}&from=shareFriend&path=/pages/doctorMain/doctorMain`;
      let _sharTitle =  `${this.nickName}推荐>> ${this.authMap.fullName} ${this.authMap.medicalTitleShow}`;
      return {
        title: _sharTitle,
        path: _path
      }
    },
    onPullDownRefresh() {
      this.getRecureJournal();
    },
    onReachBottom() {
      this.loadMore();
    },
    watch:{
      scrollTop:function(item,items){
        if (item<items) {//页面上滑分享出现showShareBtn
          this.showBottom = true;
          this.showShareBtn=true;
        } else {//页面下滑分享消失showShareBtn
          this.showBottom = false;
          this.showShareBtn=false;
        }
       if(item==0||items==0){
         this.showShareBtn=true;
       }
      },
    },
    computed: {
      ...mapState(['doctorGuideList']),
      formatDepartment() {
        if (this.department.length > 4) {
          return this.department.substring(0, 4) + "...";
        } else {
          return this.department;
        }
      }
    },
    methods: {
      ...mapMutations(["setDoctorMessage", "setDoctorBaseInfo", "setId", 'setDoctorGuideList']),
      //点击更多评价
      openMoreAbility(){
        this.isMoreClick=true;
      },
      //首次加载清空历史数据
      clearHisData(){
        this.isMoreClick=false;//更多评价
        this.recureJournalList = []; // 清空康复日记列表
        this.doctorLogo= '';
        this.authMap= {};
        this.doctorName= "";
        this.doctorCustomerId= '';
        this.from = '';
        this.medicalTitle= "";
        this.department= "";
        this.company= "";
        this.jobDoctorYear='';          //从医
        this.expertiseFiled= [];        //擅治疾病 标签
        this.practiceIntroduction= '';  //执业介绍

        this.abilityPatientList = [];    //全部评价
        // this.$set(this.abilityPatientList,[]);    //全部评价
        this.patientReputationStatusList = [];  //评价展开收起

        this.recommendListsLess= '';    //健康知识
        this.recommendLists='';         //健康知识对象
        this.isNoData = false;
        this.loadMoreFlag = true;
        this.toBottom = true;
        // this.backIndexShow = false; // 返回首页按钮隐藏
        this.setDoctorGuideList([]);
        this.isNoData = false;
        this.loadMoreFlag = true;
        this.toBottom = true;
      },
      //滚动到专家文章位置
      scollRecommend(){
        // doc-healthContent
        var _this = this;
        setTimeout(function () {
          var query = wx.createSelectorQuery();
          //选择
          query.select('#stroke-info').boundingClientRect((rect)=>{
            if(rect.top){
              wx.pageScrollTo({
                scrollTop: rect.top
              });
            }
          }).exec() ;
        },1000)
      },
      trackCallback(obj){
        dataLog.createTrack({
          actionId: 14149,
          pushMessageId: obj.item.educationId,
          keyword: obj.item.educationName,
          locationId:obj.index
        });
      },
      //初始化
      init() {
        this.finish=true;
        let _this = this;
        // vuex id存储
        this.setId({
          doctorId: _this.doctorCustomerId,         //医生ID
          caseId: _this.caseId || '',               //病历ID
          patientId: _this.patientId || '',         //患者ID
          orderSourceId: _this.orderSourceId || '',  //订单来源ID,
          caseType: _this.caseType,
        });
        this.getDocInfo();
        this.getRecommendListFn();
        this.getDocVideo();
        this.getDoctorGuideFun();
        _this.getEvaluate();
        _this.getPriceInfo();

      },
      //获取患者评价等同于之前的全部评价
      getEvaluate(){
        const _this = this;
        // _this.setDoctorGuideList([]);
        api.ajax({
          url: XHRList.evaluate,
          method: "post",
          data: {
            doctorId:_this.doctorCustomerId
          },
          done(res) {
            // console.log(res);
            if (res && res.responseObject.responseStatus && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              _this.abilityPatientList=res.responseObject.responseData.dataList;
            } else {

              console.log('获取医生指南列表失败');
            }
          },
          fail(err) {

            console.log('获取医生指南列表失败');
            console.log(err)
          }
        });
      },
      // 获取医生指南列表
      getDoctorGuideFun () {
        const _this = this;
        // _this.setDoctorGuideList([]);
        api.ajax({
          url: XHRList.getDoctorGuide,
          method: "POST",
          data: {
            customerId:	_this.doctorCustomerId,//string	是	用户id
            firstResult	:0, //string	是
            maxResult:999, //	string	是
            attUseFlag:15, //	string	是	图片规格1-原始文件、2-缩略图源文件、3-225*150、4-157*109、5-140*190、6-110*150、7-75*52、8-480*320、9-1280*720、10-900*600、12-300*200、13-450*300、14-750*500
            visitSiteId:api.getSiteId(),
          },
          done(res) {
            // console.log(data);
            if (res && res.responseObject.responseStatus && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              _this.setDoctorGuideList(res.responseObject.responseData.dataList);
            } else {
              _this.setDoctorGuideList([]);
              console.log('获取医生指南列表失败');
            }
          },
          fail(err) {
            // _this.setDoctorGuideList([]);
            console.log('获取医生指南列表失败');
            console.log(err)
          }
        });
      },
      // 患者手册列表
      goPatientNodeDetail(item) {
        if (!this.clickFlag) return;
        this.clickFlag = false;
        let pagesParam= getPagesParam.getPageInfo('patientNote');
        if(pagesParam.hasName){//有相同的
          wx.setStorageSync('nodeManualId', item.manualId);
          wx.navigateBack({
            delta: pagesParam.backNum
          });
          this.clickFlag = true;
        } else {
          wx.getNetworkType({
            success: (res) => {
              // 返回网络类型, 有效值：
              // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
              let networkType = res.networkType;
              if (networkType === 'none') {
                wx.showToast({
                  title: "网络中断，请检查您的网络状态",
                  icon:'none',
                });
                this.clickFlag = true;
              } else {
                wx.navigateTo({
                  url: `/packageF/patientNote/patientNote?manualId=${item.manualId}`,
                  success : () => {
                    this.clickFlag = true;
                  },
                  fail : () => {
                    this.clickFlag = true;
                  },
                });
              }
            }
          });
        }
      },
      // 患教手册列表页
      goPatientNoteList () {
        wx.navigateTo({
          url: `/pages/doctorMain/patientNoteList`,
        });
      },
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      //评价展开收起按钮
      changeBtnStatus(index){
        if (this.patientReputationStatusList[index]) {
          this.$set(this.patientReputationStatusList,index,false);
        } else {
          this.$set(this.patientReputationStatusList,index,true);
        }
      },
      // 医生基本信息
      getDocInfo() {
        let _this = this;
        getBaseMessage({
          "customerId": _this.doctorCustomerId,
          "logoUseFlag": 3
        }).then((res) => {
          if (res && res.responseData && res.responseData.dataList) {
            let _baseInfoData = res.responseData.dataList[0];
            _this.authMap = _baseInfoData.authMap;
            let medicalTitleText = _this.textCutter(_this.authMap.medicalTitle, "medical");
            _this.doctorLogo = _baseInfoData.logoUrlMap.logoUrl;
            // _this.doctorName = _this.authMap.fullName.length > 4 ? _this.authMap.fullName.substring(0, 4) + "..." : _this.authMap.fullName;
            _this.doctorName = _this.authMap.fullName;
            // _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
            // _this.medicalTitle = medicalTitleText;  //医生学术职称隐藏
            _this.medicalTitle = _this.authMap.medicalTitleShow;
            _this.department = _this.authMap.department || "";
            _this.company = _this.authMap.company || "";
            _this.expertiseFiled = _this.authMap.expertise.split("，");
            _this.practiceIntroduction = _baseInfoData.practiceIntroduction;
            // _this.abilityPatientList = _baseInfoData.abilityPatientList;
            _this.count = _baseInfoData.count;
            _this.jobDoctorYear = _this.authMap.jobDoctorYear>=5?( _this.authMap.jobDoctorYear>=10?`从医${_this.authMap.jobDoctorYear}年`:"从医5年以上"):"师从名医";
            //评价列表数据处理
            _this.patientReputationList = [];
            _this.abilityPatientList.forEach((item,index)=>{
              _this.patientReputationStatusList.push(true);
              if (item.patientReputation.length>37) {
                _this.patientReputationList.push(item.patientReputation.substring(0,37)+'...')
              } else {
                _this.patientReputationList.push(item.patientReputation)
              }
            })
            //页面标题设置
            wx.setNavigationBarTitle({
              title: ``
            })
            _this.setDoctorBaseInfo({
              doctorLogo: _this.doctorLogo,
              doctorName: _this.doctorName,
              medicalTitle: _this.medicalTitle,
              department: _this.department,
              company: _this.company,
              jobDoctorYear: _this.authMap.jobDoctorYear,
              hospitalLevelId: _this.authMap.hospitalLevelId,
            });
            _this.setDoctorMessage(_baseInfoData);
          }
          _this.finish=false;
        }).catch(err=>{
          _this.finish=false;
        })
      },
      /** 获取医生视频 */
      getDocVideo() {
        let _this = this;
        _this.params.getDocVideoParams.refId = _this.doctorCustomerId;
        api.ajax({
          url: XHRList.getVideos,
          method: "POST",
          data: _this.params.getDocVideoParams,
          done(data) {
            // 视频文件
            if (
              data &&
              data.responseObject &&
              data.responseObject.responseData &&
              data.responseObject.responseData
            ) {
              let _data = data.responseObject.responseData;
              if (_data.data_list!=undefined) {
                _data.data_list.forEach((item, index) => {
                  if (item.logoSpec == "13") {
                    _this.videoUrl = item.logoUrl;
                    _this.docHasVideo = true;
                    return;
                  }
                });
              }else{
                _this.videoUrl = '';
              }
            }else{
              _this.videoUrl = '';
            }
          },
          fail(err) {
            console.log(err)
            _this.finish = false;
            _this.videoUrl = '';
          }
        });
      },
      /** 获取健康知识 */
      getRecommendListFn() {
        let _this = this;
        _this.finish = true;
        _this.params.recommendParam.refCustomerIdSetIn = _this.doctorCustomerId;
        getRecommendList(_this.params.recommendParam).then(res => {
          _this.finish = false;
          if (
            res &&
            res.responseObject.responseData &&
            res.responseObject.responseData.dataList
          ) {
            _this.recommendLists = res.responseObject.responseData.dataList;
            _this.recommendListsLess = _this.recommendLists.concat([]).splice(0, 2);
            _this.$nextTick(()=>{
              if(_this.recommendType){
                _this.scollRecommend();
              }
            })

          }
        }).catch(err=>{
          console.log(err)
        });
      },
      // 手术康复日记数据
      getRecureJournalOnLoad() {
        let _this = this;
        // wx.showLoading({
        //   title: "正在加载..."
        // });
        getRecureJournal({
          isValid: 1,
          sortType: 2,
          visitSiteId: api.getSiteId(),
          firstResult: 0,
          maxResult: 20 * (this.page + 1),
          imgUseFlag:2,
          propertyId:'',
          attendCustomerId:_this.doctorCustomerId,              //doctorID
        }).then((res) => {
          wx.stopPullDownRefresh();
          if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            let dataList = res.responseObject.responseData.dataList;
            for (let i = 0; i < dataList.length; i++) {
              dataList[i].patientAgeShow = this.getAge(dataList[i].patientAge);
            }
            this.recureJournalList = dataList;
            // wx.hideLoading();
          } else {
            this.loadMoreFlag = false;
            this.finish = false;
            this.toBottom = false;
            this.isNoData = true;
            // wx.hideLoading();
          }
        })
      },
      getAge (num) {
        let firstNum = parseInt(num/10);
        let twoNum = num % 10;
        if (firstNum) {
          if (twoNum <= 5) {
            if(twoNum == 0) {
              if(firstNum == 1){
                return `${num}岁`
              } else {
                return `${firstNum-1}5岁以上`
              }
            }else{
              return `${firstNum}0岁以上`
            }
          } else {
            return `${firstNum}5岁以上`
          }
        } else {
          return `${twoNum}岁`
        }
      },
      loadMore() {
        let _this =this;
        if (this.loadMoreFlag) {
          this.finish = true;
          let result = this.page += 1;
          getRecureJournal({
            isValid:1,
            sortType: 2,
            visitSiteId: api.getSiteId(),
            firstResult: result * 20,
            maxResult: 20,
            imgUseFlag:2,
            propertyId:'',
            attendCustomerId:_this.doctorCustomerId,              //doctorID
          }).then((res) => {
            if (res && res.responseObject && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              let dataList = res.responseObject.responseData.dataList;
              for (let i = 0; i < dataList.length; i++) {
                dataList[i].patientAgeShow = this.getAge(dataList[i].patientAge);
              }
              this.finish = false;
              this.recureJournalList = this.recureJournalList.concat(dataList);
            } else {
              this.finish = false;
              this.toBottom = false;
              this.loadMoreFlag = false;
            }
          })
        }
      },
      // 康复日记详情
      jumpToDiary(e) {
        if (!this.clickFlag) return false;
        this.clickFlag = false;
        this.pathObj = {
          path: "diary",
          obj: e.obj
        };
        if (e.desc) {
          this.ensureShow = false;
          this.clickFlag = true;
          let _currenRout = false;
          let _currentPages = getCurrentPages();
          _currentPages.forEach((item,index)=>{
            if (item.route.indexOf('packageF/journalDetail/journalDetail')>-1) {
              _currenRout =true;    //历史栈有康复日记详情页  清空历史栈
            }
          })
          if (_currenRout) {
            wx.reLaunch({
                url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
            });
          } else {
            wx.navigateTo({
                url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
            });
          }
          // wx.navigateTo({
          //   url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
          // });
          // wx.navigateTo({
          //   url: "/packageF/journalDetail/journalDetail?rId=" + e.obj.diaryId + "&aId=" + e.obj.authorId+"&from=doctorHome"
          // });
          // miniLogin({
          //   successCallBack: (res) => {
          //   },
          //   failCallBack: (err) => {
          //   }
          // });
        } else {
          this.clickFlag = true;
          this.ensureShow = true;
        }
      },
      // 埋点？不详
      rjTrack(obj) {
        dataLog.createTrack({
          actionId: 14124,
          pushMessageId: obj.item.diaryId,
          keyword: obj.item.diaryName
        });
      },
      textCutter(str, type) {
        let strNew = "";
        if (str.includes(",")) {
          str.split(",").forEach((element) => {
            if (element.length === 0) {
              strNew += "";
            } else {
              if (element.includes("_")) {
                if (type == "medical") {
                  strNew += element.split("_")[1] + " ";
                } else {
                  strNew += element.split("_")[1] + "，";
                }
              } else {
                if (type == "medical") {
                  strNew += element + " ";
                } else {
                  strNew += element + "，";
                }
              }
            }
          });
          return strNew.substring(0, strNew.length - 1);
        } else if (str.includes("_")) {
          strNew += str.split("_")[1];
          return strNew;
        } else {
          strNew += str;
          return strNew;
        }
      },
      playVideoFn(item) {
        let _this = this;
        if (!_this.videoUrl.length>0) {
          return false;
        }
        _this.getNetworkType((type) => {
          if (type == "wifi") {
            _this.goNavigateTo(item)
          } else {
            wx.showModal({
              // title: '您正在使用非WIFI网络，播放将消耗流量',
              content: '您正在使用非WIFI网络，播放将消耗流量',
              confirmText: '继续播放',
              confirmColor: '#00BEAF',
              success: function (res) {
                if (res.confirm) {
                  _this.goNavigateTo(item)
                } else if (res.cancel) {
                  // console.log('用户点击取消')
                }
              }
            })
          }
        })
      },
      // 咨询价格
      getPriceInfo() {
        let _this = this;
        getConsultPrice({
          customerId: _this.doctorCustomerId
        }).then((res) => {
          if (res && res.responseData && res.responseData.dataList) {
            let _dataList = res.responseData.dataList[0];
            let _generalPrice = _dataList.generalPrice; // 图文咨询 (老接口普通咨询价格)
            _this.inquiryState = _dataList.generalChargeMode; //  1-已开通免费咨询
            if (!Number.isInteger(parseFloat(_generalPrice))) {
              _this.generalPrice = parseFloat(_generalPrice);
            } else {
              _this.generalPrice = parseFloat(_generalPrice).toFixed(0);
            }
            // 获取咨询状态 然后处理数据
            if (parseFloat(_this.generalPrice) >= 0) {
              _this.finish = true;
              getConsultStatus({
                customerId: _this.doctorCustomerId,
                caseId: _this.caseId,
                patientId: _this.patientId, //患者ID
                orderType: 1,
                orderSourceType: 0,
                sortType: 2
              }).then(data => {
                _this.footerLeftShow = true;
                _this.finish = false;
                let _isFree = data.isFree;
                let _state = data.state;
                //是否开启免费咨询
                if (_dataList.state == 0) {
                  _this.openState = 2;
                  dataLog.enterBrowse({
                    browseType:"131",
                    opDesc:"医生主页-未开诊（小程序）"
                  })
                } else {
                  _this.openState = 1;
                  dataLog.enterBrowse({
                    browseType:"88",
                    opDesc:"医生主页（小程序）"
                  })
                }
                if (_this.inquiryState ==1) {
                  //是否使用过免费咨询
                  if (_isFree == 0) {
                    //试用过
                    _this.payType = "pay";
                  } else {
                    //未使用
                    _this.payType = "free";
                  }
                } else {
                  //未开启免费咨询
                  _this.payType = "pay";
                }
              }).catch(err=>{
                console.log(err)
              });
            }
          }
        }).catch(err=>{
          console.log(err)
        })
      },
      /** 去咨询按钮 */
      goConsultFn() {
        let _this = this;
        dataLog.createTrack({
          actionId: 14147,
          pushMessageId: _this.doctorCustomerId,
        });
        getConsultStatus({
          customerId: _this.doctorCustomerId,
          caseId: _this.caseId,
          patientId: _this.patientId, //患者ID
          orderType: 1,
          orderSourceType: 0,
          sortType: 2
        }).then(data => {
          let _isFree = data.isFree;       //是否使用过免费咨询（0-使用过1-未使用过）
          let _state = data.state;
          let _remainNum = data.remainNum;  //剩余咨询人数 （-1为医生设置无限次接诊）
          let _conState = data.conState;    //0-无沟通中数据 1-有
          if (_state == 1) {
            //开启咨询
            if (_conState ==1 && _this.from=='imScene') {
              _this.confirmShow = true;
            } else {
              if (_remainNum !== 0) {
                this.applicationType = '12';
                //_remainNum!==0 (-1次数无限)
                //剩余人数>0
                if (_remainNum > 0 || _remainNum == -1) {
                  _this.showNotConsult();     //去咨询流程
                } else {
                  _this.noStateTextTitle = "";
                  _this.noStateText = "抱歉，该医生今天已经没有咨询名额了";
                  _this.showToastFn({
                    contentTitle: _this.noStateTextTitle,
                    content: _this.noStateText,
                    showCancel: false,
                    confirmText: '我知道了'
                  })
                }
              } else {
                this.applicationType = '13';
                //无剩余名额
                _this.noStateTextTitle = "";
                _this.noStateText = "抱歉，该医生今天已经没有咨询名额了";
                _this.showToastFn({
                  contentTitle: _this.noStateTextTitle,
                  content: _this.noStateText,
                  showCancel: false,
                  confirmText: '我知道了'
                })
              }
            }
          } else {
            //未开启咨询
            _this.noStateText = "医生关闭了今天的咨询服务，暂不能为您提供帮助";
            _this.noStateTextTitle = "今日暂不接诊";
            _this.showToastFn({
              contentTitle: _this.noStateTextTitle,
              content: _this.noStateText,
              showCancel: false,
              confirmText: '我知道了'
            })
          }
        }).catch(err=>{
          console.log(err)
        });
      },
      toImPage(){
        let _this =this;
        _this.confirmShow = false;
        if (getCurrentPages().length>=4) {
          localStorage.setItem('backIndex',true)
          wx.reLaunch({
              url: `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&caseId=${_this.caseId}`
          })
        } else {
          wx.navigateTo({
              url: `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${_this.doctorCustomerId}&patientId=${_this.patientId}&caseId=${_this.caseId}`
          })
        }

      },
      /** 邀请医生开诊 */
      inviteConsultFn() {
        let _this = this;
        this.finish = true;
        dataLog.createTrack({
          actionId: 14148,
          pushMessageId: _this.doctorCustomerId,
        });
        miniLogin({
          successCallBack:(res) => {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            // 已登录...
            getHasInvitedConsult({
              customerId: _this.doctorCustomerId,                       //	string	是	医生id
              patientCustomerId: localStorage.getItem("userId") || '',	//string	是	患者所属用户id
              openid: localStorage.getItem("openId") || "",	            // string	是	渠道唯一id
              uuid: localStorage.getItem('unionId') || "",              // string	是	联合id（用来关联其他平台）
            }).then(data => {
              this.finish = false;
              if (data.responseObject.responseStatus) {
                if (data.responseObject.responseMessage == "NO DATA") {
                  //未邀请过
                  wx.navigateTo({
                    url:`/pages/doctorMain/inviteContent?from=${this.from}`
                  })
                } else {
                  //已邀请过
                  this.toastFn("您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。");
                }
              } else {
                console.log('获取是否邀请过医生开诊失败');
              }
            }).catch(err=>{
              console.log(err)
            })
          } else {
            this.finish = false;
            wx.navigateTo({
              url:`/pages/doctorMain/inviteContent?from=${this.from}`
            })
          }
         }
        });
      },
      /** 查看更多授权 */
      doctorMoreFn(e){
        this.navigateTo = "doctorMore";
        if (e.target.userInfo) {
          this.goNavigateTo("doctorMore")
        }else{
          console.log("拒绝授权")
          this.ensureShow = true;
        }
      },
       /** 去咨询授权 */
      authorizeFn(e){
        let _this = this;
        _this.navigateTo = "";
        _this.buttonClickedFn();
        if (e.target.userInfo&&!_this.buttonClicked) {
          if (this.openState==1) {
            this.finish = true;
            miniLogin({
              successCallBack:(res) => {
                this.finish = false;
                if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                  // 已登录...
                  this.goConsultFn()
                } else {
                  this.goConsultFn()
                }
              }
            });
          } else {
            this.inviteConsultFn()
          }
        }else{
          console.log("拒绝授权")
          this.ensureShow = true;
        }
      },
      // 去我的页面
      goPersonal(e) {
        this.navigateTo = 'personal';
        if (e.target.userInfo) {
          //已授权...
          wx.navigateTo({
            url: '/pages/personal/personal'
          });
        } else {
          console.log("拒绝授权")
          this.ensureShow = true;
        }
      },
      buttonClickedFn() {
        let _this =this;
        this.buttonClicked = false;
        setTimeout(function () {
          this.buttonClicked = true;
        }, 500)
      },
      goNavigateTo(item) {
        // console.log(item)
        let _url = "",
          _this = this;
        switch (item) {
          case "video":
            _url = `/packageA/videoPlayer/videoPlayer?videoUrl=${_this.videoUrl}`;
            break;
          case "doctorMore":
           if (_this.source&&_this.source=='qrCode') {
             _url =  `/pages/doctorMain/doctorInfoMore?source=qrCode&&from=${_this.from}`;
           } else {
             _url =  `/pages/doctorMain/doctorInfoMore?from=${_this.from}&&applicationType=${_this.applicationType}`;
           }
            break;
          case "health":
            _url = `/pages/healthKnowledge/healthKnowledge?doctorCustomerId=${_this.doctorCustomerId}`;
            break;
          case "healthDetail":
            _url = "/pages/healthKnowledgeDetail/healthKnowledgeDetail";
            break;
          case "personal":
            _url = "/pages/personal/personal";
            break;
        }
        wx.navigateTo({
          url: _url
        });
      },
      goToSetting(e) {
        let _this = this;
        // console.log(e.mp.detail.errMsg)
        if (e.mp.detail.errMsg === "openSetting:ok") {
          //获取授权信息
          wx.getSetting({
            success(res){
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                _this.ensureShow = false;
                if (_this.navigateTo!=="") {
                  _this.goNavigateTo(_this.navigateTo);
                } else {
                  if (_this.openState==1) {
                    _this.goConsultFn()
                  } else {
                    _this.inviteConsultFn()
                  }
                }
              }else{
                _this.ensureShow = true;
                setTimeout(() => {
                  _this.ensureShow = false;
                }, 2000);
              }
            }
          })
        } else {
          _this.ensureShow = true;
          setTimeout(() => {
            _this.ensureShow = false;
          }, 2000);
        }
      },
      /** 网络类型判断 */
      getNetworkType(param) {
        wx.getNetworkType({
          success(res) {
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            param(res.networkType)
          }
        })
      },
      /** 咨询跳页判断 */
      showNotConsult() {
        let _this = this;
        const data = {
          applicationType: this.applicationType,
          doctorId: this.doctorCustomerId,
          doctorName: this.doctorName
        }
        if (_this.source&&_this.source=='qrCode'){ data.source = 'qrCode'}

        localStorage.removeItem("redirect");
        if (_this.from == '' || _this.from == "find" || _this.from == "share" || _this.from == "journal" || _this.from == "AI" || _this.from == "patientNote") {
          if (getCurrentPages().length>=4) {
            wx.reLaunch({
              url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
            })
          } else {
            wx.navigateTo({
              url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
            })
          }
        } else if(_this.from=='imSceneDoctor'){
          wx.navigateBack()
        }else{
          console.log("正常路程咨询");
          wx.removeStorageSync("PCIMLinks");
          if (getCurrentPages().length>=4) {
            localStorage.setItem('backIndex',true)
            wx.reLaunch({
              url: '/pages/doctorMain/doctorMainAffirmOrder'
            })
          } else {
            wx.navigateTo({
              url: '/pages/doctorMain/doctorMainAffirmOrder'
            })
          }
        }
      },
      /** toast提示 */
      toastFn(param){
        wx.showToast({
          title: param,
          icon: 'none',
          duration: 2000
        })
      },
      showToastFn(param) {
        let _this = this;
        wx.showModal({
          title: param.contentTitle || '',
          content: param.content || '',
          showCancel: param.showCancel,
          confirmText: param.confirmText || '确定',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    },
    components: {
      healthItem,
      NormalLoading,
      ensureConfirm,
      recureJournal,
      confirm,
      BackIndex,
      BlackList,
      authorization
    }
  };
</script>

<style lang="scss" scoped>
  .doctorHome-main {
    padding-bottom: 170px;
    .doc-topInfo {
      padding: 30px 30px 0;
      position: relative;
      .doc-playVideo {
        width: 52px;
        height: 52px;
        position: absolute;
        right: 0;
        bottom: 0;
        border-radius: 100%;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/vedion.png") no-repeat center center;
        background-size: 100% 100%;
        z-index: 1;
      }
      .doc-name-big{
        font-size: 46px;
        color: #222222;
        font-weight: bold;
        padding-bottom: 35px;
      }
      .top-left {
        position: relative;
        width: 162px;
        height: 162px;
        float: left;
        background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/vedion_circle.png") no-repeat center;
        background-size: 100% 100%;
        &.no-background{
          background: none;
        }
        img {
          position:absolute;
          top:50%;
          margin-top:-65px;
          left:50%;
          margin-left:-65px;
          width: 130px;
          height: 130px;
          border-radius: 100%;
        }
      }
      .top-right {
        padding-left: 208px;
        font-size: 0;
        .doc-name {
          display: inline-block;
          font-size: 36px;
          color: #000000;
          margin-right: 20px;
          font-weight: bold;
          line-height: 1;
        }
        .doc-medical {
          display: inline-block;
          font-size: 32px;
          color: #222222;
          margin-right: 20px;
          line-height: 1;
          padding-top: 14px;
        }
        .doc-degree {
          font-size: 32px;
          color: #222222;
          line-height: 1;
          padding-top: 20px;
        }
        //三甲 医院
        .doc-right-content2 {
          line-height: 1;
          padding-top: 12px;
          width: 420px;
          .doc-hospitallName {
            font-size: 30px;
            color: #333333;
            line-height: 1.6;
          }
        }
        .doc-hospitalGrade {
            display: inline-block;
            font-size: 26px;
            color: #2EA9FE;
            padding: 2px 8px 2px;
            background: #E1F3FF;
            border-radius: 4px;
            margin-right: 20px;
          }
        .doc-cureTime {
          display: inline-block;
          margin-top: 12px;
          margin-bottom: 24px;
          width: 178px;
          height: 42px;
          font-size: 26px;
          color: #F27587;
          text-align: center;
          line-height: 42px;
          background: #FDF1F3;
          border-radius: 4px;
        }
      }
    }
    // 列表统一样式
    .doc-listComm {
      padding: 50px 30px 0 30px;
      .doc-listTitle {
        font-size: 38px;
        color: #333333;
        font-weight: bold;
        position: relative;
        margin-bottom: 30px;
        .doc-infoMore {
          font-size: 30px;
          color: #2EA9FE;
          float: right;
          font-weight: normal;
          background: #ffffff;
          padding-right: 0;
          line-height: 48px;
          &::after {
            border: none;
          }
        }
      }
      .doc-listContent {
        font-size: 32px;
        color: #333333;
        margin-bottom: 60px;
        &.doc-listContent-tag{
          margin-bottom: 36px;
        }
        //   善治疾病
        .doc-goodTips {
          display: inline-block;
          font-size: 32px;
          color: #555555;
          padding: 10px 20px;
          background: rgba(216, 227, 227, 0.35);
          border-radius: 8px;
          margin-right: 20px;
          margin-top: 20px;
        }
        //评价
        .doc-evaluateTitle {
          position: relative;
          img {
            width: 68px;
            height: 68px;
            border-radius: 100%;
            position: absolute;
          }
          .doc-evalUserName {
            font-size: 30px;
            color: #333333;
            padding-left: 84px;
            padding-top: 12px;
            font-weight:bold;
          }
        }
        .doc-evaluateContent {
          margin-top: 30px;
          background: #F2F5F5;
          border-radius:0 8px 8px 8px;
          padding: 23px 28px 23px 18px;
          position: relative;
          .doc-evaluate-tag{
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:48px;
          }
          .doc-evaluate-text{
            font-size:32px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:#333333;
            line-height:44px;
            &.doc-evaluate-top{
              margin-top: 21px;
            }
          }
          .circle{
            position: absolute;
            top: -10px;
            left: 0;
            display: inline-block;
            width: 30px;
            height: 12px;
            // background: url("../../../static/image/circle.png") no-repeat center;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.4.0/bg_pinglun.png") no-repeat center;
            background-size: 100% 100%;
          }
          .showMoreBtn{
            display: inline-block;
            width: 32px;
            height: 28px;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/lower-arrow.png") no-repeat center;
            background-size: 100% 100%;
            position: absolute;
            right: 36px;
            bottom: 30px;
            &.closeBtn{
               background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/upper-arrow.png") no-repeat center;
               background-size: 100% 100%;
            }
          }
        }
        //健康知识
        .doc-healthList-item {
          .doc-healthItem-title {
            font-size: 30px;
            color: #333333;
            margin-bottom: 24px;
          }
          .doc-healthItem-box {
            font-size: 26px;
            color: #888888;
            .doc-healthItem-type {
              margin-right: 20px;
            }
          }
        }
        .doc-health-line {
          width: 100%;
          height: 2px;
          background: #EEEEEE;
          margin: 44px 0;
        }
      }
      &.doc-goodAt{
        .doc-listTitle{
          margin-bottom: 20px
        }
        .doc-listContent{
          margin-bottom: 0
        }
      }
      &.doc-practice{
        padding-right: 30px;
        padding-top: 80px;
        .doc-listContent{
          margin-bottom: 4px;
          line-height:1.6
        }
      }
      &.allSuggestion{
        padding-left: 36px;
        padding-top: 80px;
        .more-reputation{
          text-align: center;
          margin: auto;
          margin-bottom: 44px;
          width:160px;
          height:28px;
          font-size:30px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:#2EA9FE;
          line-height:40px;
        }
        .doc-listTitle{
            &::before {
            left: 0;
          }
        }
      }
      &.doc-healthContent{
        padding-left: 30px;
        padding-top: 40px;
        .doc-listTitle{
          margin-bottom: 8px;
          &::before {
            left: 0;
          }
        }
      }
      &.doc-guide{
        padding-left: 30px;
        padding-bottom: 60px;
        padding-top: 40px;
        .doc-listTitle{
          // padding-left: 18px;
          &::before {
            left: 0;
          }
        }
        .doc-guide-list{
          .doc-guide-item{
            display: flex;
            align-items: center;
            .doc-guide-left{
              width: 148px;
              height: 136px;
              background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/notebookDefault.png") no-repeat center;
              background-size: 100% 100%;
              .node-img{
                width: 136px;
                height: 136px;
              }
            }
            .doc-guide-middle{
              flex: 1;
              margin: 0 24px;
              .guide-title{
                max-height: 96px;
                font-size:34px;
                font-weight:500;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                color:rgba(51,51,51,1);
              }
              .guide-content{
                margin-top: 10px;
                font-size:26px;
                font-weight:400;
                color:rgba(153,153,153,1);
              }
            }
            .doc-guide-right{
              width: 28px;
              height: 28px;
              background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/arrow_right.png") no-repeat center;
              background-size: 100% 100%;
            }
            + .doc-guide-item {
              margin-top: 40px;
            }
          }
        }
      }
    }
    .doc-border-hightLine {
      /*margin-top: 10px;*/
      background: #f2f2f2;
      height: 16px;
      width: 100%;
    }
    .doctorMainHistory {
      padding-bottom: 50px;
      header {
        padding: 40px 30px 32px;
        &.padding-bottom{
          padding-bottom: 0;
        }
        @include clearfix();
        .journalTitle {
          display: inline-block;
          font-size: 38px;
          color: #333333;
          font-weight: bold;
          line-height: 38px;
          // &:before {
          //   display: inline-block;
          //   content: "";
          //   width: 6px;
          //   height: 30px;
          //   margin-right: 10px;
          //   background: #02B5AC;
          //   border-radius: 100px;
          //   vertical-align: -2px;
          // }
        }
        .addJournal{
          float: right;
          text-align: left;
          height: 56px;
          /*line-height: 56px;*/
          display: flex;
          align-content: center;
          padding: 0;
          margin: 0;
          background-color: rgba(186,186,186,0.1);
          border-radius:100px 0px 0px 100px;
          .addIcon{
            width: 56px;
            height: 56px;
            /*vertical-align: middle;*/
          }
          .addText{
            font-size: 28px;
            line-height: 56px;
            margin: 0 12px;
            color: #2EA9FE;
          }
        }
      }
      .extraLine {
        display: block;
        text-align: center;
        font-size: 26px;
        color: #BDBDBD;
        margin-top: 50px;
      }
      .goJournal{
        width:440px;
        height:100px;
        margin-top: 40px;
        border-radius: 0;
        border:none;
        background-color: #FFFFFF;
        padding: 5px;
        &::after{
          border: none;
        }
        @include clearfix();
        .space{
          width: 1px;
          height: 100%;
          float: left;
        }
        .out-box{
          /*width:430px;*/
          height:88px;
          margin: 0 auto;
          border-radius:8px;
          border:1px solid #06B4AA;
          background-color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left:2px;
          @include iphoneX{
            margin-left:0;
          }
          .goIcon{
            width: 28px;
            height: 28px;
          }
          .goText{
            margin-left: 12px;
            font-size:30px;
            font-weight:500;
            color:rgb(7,182,172);
          }
        }

      }
    }
    //去咨询按钮
    .doc-goConsult {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 112px;
      /*height: 180px;*/
      box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.3);
      .shareBtn{
        position: absolute;
        right: 30px;
        text-align: center;
        top: -150px;
        width:112px;
        height:112px;
        line-height: 112px;
        border-radius: 50%;
        background: rgb(253,213,189);
        // background:linear-gradient(121deg,rgba(255,189,35,1) 0%,rgba(255,150,13,1) 100%);
        background: linear-gradient(145deg, rgba(253,213,189,1) 0%, rgba(245,126,144,1) 94%);
        box-shadow:0px 12px 30px 0px rgba(242,117,135, 0.4);
        span{
          font-size:34px;
          color: #fff;
          white-space: nowrap;
          margin-left: -6px;
        }
      }
      @include iphoneX() {
        background: #fff;
        padding-bottom: 68px;
      }
      .invite-consult{
        padding: 20px 48px;
        box-sizing: border-box;
        opacity: 0.8;
        background: #000000;
        // border-radius: 4px;
        position: absolute;
        left: 0;
        right: 0;
        height: 128px;
        top: -128px;
        z-index: 2;
        p{
          font-size: 28px;
          color:#ffffff;
          opacity: 0.85;
          line-height: 1.5;
        }
      }
      .doc-go-left {
        width: 68%;
        height: 100%;
        background: #ffffff;
        float: left;
        .doc-goLone {
          padding-left: 36px;
          padding-top: 18px;
          line-height: 1.2;
          .doc-goFreeText {
            font-size: 32px;
            color: #fe8178;
            font-weight: bold;
            margin-right: 12px;
            &.notOnline{
               color: #AAAAAA;
            }
          }
          .doc-goPrice {
            font-size: 30px;
            color: #AAAAAA;
            position: relative;
            .doc-priceIcon {
              display: inline-block;
              position: absolute;
              width: 105%;
              height: 2px;
              background-color: #AAAAAA;
              top: 46%;
              left: 0;
            }
            &.charge{
              color: #fe8178;
              font-weight: bold;
              font-size:32px;
            }
          }
        }
        .doc-goLTwo {
          padding-left: 36px;
          margin-top: 3px;
          color: #909090;
          font-size: 24px;
          line-height: 1;
          padding-top: 10px;
          .doc-goNum {
            color: #2EA9FE;
            padding: 0 8px;
            font-weight: bold
          }
        }
      }
      .doc-go-right {
        width: 32%;
        height: 100%;
        background: #2EA9FE;
        float: left;
        text-align: center;
        line-height: 112px;
        font-size: 36px;
        color: #ffffff;
        font-weight: bold;
        border-radius: 0%;
      }
    }
  }
</style>
