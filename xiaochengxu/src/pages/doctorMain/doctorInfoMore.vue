<template>
  <section class="doctorHome-main">
    <!-- 个人信息 -->
    <NormalLoading v-if="finish"></NormalLoading>
    <section class="doc-topInfo">
      <!--<button class="doc-shareBtn" open-type="share" @click="shareFn" v-if="ensureShare"></button>-->
      <button open-type="getUserInfo" @getuserinfo="userInfo" class="doc-shareBtn" v-if="false"></button>
      <section class="top-left">
        <img :src="doctorLogo" alt="">
      </section>
      <section class="top-right">
        <p class="top-docInfoContent"><span class="doc-name">{{authMap.fullName}}</span></p>
        <section>
          <span class="doc-medical">{{medicalTitle}}</span><span class="doc-degree" v-if="false">{{department}}</span>
        </section>
        <p class="doc-right-content2"><span class="doc-hospitalGrade" v-if="authMap.hospitalLevelId==1">三甲</span><span
          class="doc-hospitallName">{{company}}</span></p>
        <p class="doc-cureTime">{{jobDoctorYear}}</p>
      </section>
      <section class="doc-borderLine"></section>
    </section>
    <!-- 医生擅长 -->
    <section class="doc-listComm doc-goodAt" v-if="expertise.length">
      <section class="doc-listTitle">医生擅长</section>
      <section class="doc-listContent">{{expertise}}</section>
    </section>
    <section class="doc-border-hightLine"></section>
    <!-- 执业成就 -->
    <section class="doc-listComm doc-goodAt" v-if="achievement.length">
      <section class="doc-listTitle">执业成就</section>
      <section class="doc-listContent">{{achievement}}</section>
    </section>
    <section class="doc-border-hightLine"></section>
    <!-- 获得荣誉 -->
    <section class="doc-listComm doc-goodAt" v-if="honor.length">
      <section class="doc-listTitle">获得荣誉</section>
      <section class="doc-listContent">
        <p class="doc-listGoodItem" v-for="(item,index) in honorMore ? honor : honorLess" :key="index">{{item}}</p>
      </section>
      <section class="doc-listShowBtn" @click="showFun('honor')" v-show="showHonier">{{honorMore ? "收起" : "展开"}}
      </section>
    </section>
    <section class="doc-border-hightLine"></section>
    <!-- 学术能力 -->
    <section class="doc-listComm doc-goodAt" v-if="academicLess.length">
      <section class="doc-listTitle">学术能力</section>
      <section class="doc-listContent " v-html="academicMore ? academic : academicLess"></section>
      <section class="doc-listShowBtn" @click="showFun('academic')" v-if="academicMoreShow">{{academicMore ? "收起" :
        "展开"}}
      </section>
    </section>
    <section class="doc-border-hightLine"></section>
    <!-- 社会任职 -->
    <section class="doc-listComm doc-goodAt" v-if="work.length">
      <section class="doc-listTitle">社会任职</section>
      <section class="doc-listContent">
        <p class="doc-listGoodItem" v-for="(item,index) in workMore ? work : workLess" :key="index">{{item}}</p>
      </section>
      <section class="doc-listShowBtn" @click="showFun('work')" v-if="workMoreShow">{{workMore ? "收起" : "展开"}}</section>
    </section>
    <!-- 去咨询按钮 -->

    <section class="doc-goConsult">
      <form @submit="formSubmit" report-submit='true' v-if="ensureShare&&showShareBtn">
        <button class="shareBtn wx-contact-text"  open-type='share' type="submit" formType="submit" @click="shareFn"><span>分享</span></button>
      </form>
      <section class="invite-consult" v-show="openState==2&&showBottom"><p>医生暂不在线，点击[预约咨询]医生助理会为您联系医生，并在医生上线后第一时间通知您。</p></section>
      <section class="doc-go-left">
        <p class="doc-goLone">
          <span class="doc-goFreeText" :class="{'notOnline':openState==2}" v-if="openState==1&&inquiryState==1&&payType=='free'">{{openState==1?"前3次回复免费":"暂不在线"}}</span>
<span class="doc-goFreeText" :class="{'notOnline':openState==2}" v-if="openState==2">{{openState==1?"前3次回复免费":"暂不在线"}}</span><span v-if="openState==1" class="doc-goPrice" :class="{'charge':payType!=='free'}">￥{{generalPrice}} <span class="doc-priceIcon" v-if="payType=='free'"></span></span>
        </p>
        <p class="doc-goLTwo">已有<span class="doc-goNum">{{count}}</span>人咨询过</p>
      </section>

      <!-- 去咨询 -->
      <button class="doc-go-right" open-type="getUserInfo" @getuserinfo="authorizeFn" v-if="openState==1" >去咨询</button>
      <!-- <section class="doc-go-right" v-if="openState==1" @click="goConsultFn">去咨询</section> -->
      <!-- 邀请开诊 -->
      <button class="doc-go-right" open-type="getUserInfo" @getuserinfo="authorizeFn" v-if="openState==2" >预约咨询</button>
      <!-- <section class="doc-go-right" v-if="openState==2" @click="inviteConsultFn">去咨询</section> -->
    </section>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询，现在继续去沟通吗？'
          }" v-if="confirmShow"  @cancelClickEvent="confirmShow=false" @ensureClickEvent="toImPage">
    </confirm>
  </section>
</template>

<script>
  import api from "common/js/util/util";
  import localStorage from "localStorage";
  import {createNamespacedHelpers} from "vuex";

  const {mapMutations, mapGetters, mapActions, mapState} = createNamespacedHelpers('doctorMain');
  import getBaseMessage from 'common/js/doctorHome/getBaseMessage';             //医生基本信息 api
  import getConsultPrice from 'common/js/doctorHome/getConsultPrice';           //获取咨询价格
  import getConsultStatus from 'common/js/doctorHome/getConsultStatus';         //医生基本信息 api
  import miniLogin from "common/js/miniUtil/miniLogin";                         //检测登录
  import getHasInvitedConsult from "common/js/HttpRequest/getHasInvitedConsult"   //是否邀请过
  import NormalLoading from 'components/loading';
  import dataLog from "dataLog";
  import confirm from 'components/confirm';
  export default {
    data() {
      return {
        finish: false,
        ensureShare: false,
        nickName:'',              //用户微信昵称
        showHonier: false,
        showAcademic: false,
        authMap: {},
        achievement: '',
        doctorLogo: '',
        doctorName: "",
        doctorCustomerId: '',
        showShareBtn:true,
        medicalTitle: "",
        department: "",
        company: "",
        jobDoctorYear:'',
        expertise: '',
        honor: [],
        honorLess: '',
        honorMore: false,         // 获得荣誉是否显示更多显示更多还是收起
        academic: "",             // 执业成就详情全部字段
        academicLess: "",         // 学术能力详情少数字段
        academicMoreShow: false,  // 学术能力是否显示更多
        academicMore: false,      // 学术能力是否显示更多显示更多还是收起
        work: [],                 // 社会任职全部字段
        workLess: "",             // 社会任职详情少数字段
        workMoreShow: false,      // 社会任职是否显示更多
        workMore: false,          // 社会任职是否显示更多显示更多还是收起
        generalPrice: '',
        inquiryState: '',         //1-已开通免费咨询
        footerLeftShow: false,
        openState: 0,              //  接诊开关 0-"" | 1-开诊 | 2-不开诊
        payType: '',               // "pay"  "free"
        count: '',                 //咨询人数
        noStateTextTitle: '',
        noStateText: '',
        from:'',
        ensureShow:false,           //授权
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type: "openSetting"
        },
        navigateTo:false,
        scrollTop:'',
        showBottom:true,
        confirmShow:false,            //沟通中弹层
        source:''
      }
    },
    components: {
      NormalLoading,
      confirm
    },
    onLoad(option) {
      let _this=this;
      wx.removeStorageSync('reportPatient',true); // 清除患者报道患者的标记
      this.from = option.from || '';
      _this.showHonier = false;
      _this.academicMoreShow = false;
      _this.honorMore = false;
      _this.academicMore = false;
      _this.workMore = false;
      _this.workMoreShow = false;
      this.source = option.source || '';
      if(option.applicationType){
        _this.applicationType=option.applicationType;
      }else {
        _this.applicationType='12';
      }
      //获取授权信息
      wx.getSetting({
        success(res){
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                _this.ensureShare = true;
                _this.nickName = res.userInfo.nickName;
              }
            })
          }
        }
      })
      wx.onNetworkStatusChange((res) => {
        this.finish = false;
        console.log("netStatus:");
        console.log(res);
        if (res && !!res.isConnected) {} else {}
      });
    },
    onShow() {
      this.achievement='';
      this.honor=[];
      this.academic='';
      this.work=[];
      this.init();
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onPageScroll(e){
      this.scrollTop = e.scrollTop;
    },
    //转发事件
    onShareAppMessage(res) {
      if (res.from === 'button') {
        console.log(res.target)
      }
      // let _path = `/${getCurrentPages()[1].route}`;
      let _path = `/pages/mIndex/mIndex?doctorCustomerId=${this.idList.doctorId}&from=shareFriend&path=/pages/doctorMain/doctorMain`;
      let _sharTitle =  `${this.nickName}推荐>> ${this.authMap.fullName} ${this.authMap.medicalTitleShow}`;
      return {
        title: _sharTitle,
        path: _path
      }
    },
    watch:{
      scrollTop:function(item,items){
        if (item<items) {//页面上滑分享出现showShareBtn
          this.showBottom = true;
          this.showShareBtn=true;
        } else {//页面上滑分享消失showShareBtn
          this.showBottom = false;
          this.showShareBtn=false;
        }
        if(item==0||items==0){
          this.showShareBtn=true;
        }
      },
    },
    methods: {
      ...mapMutations(["setId"]),
      // ...mapActions(["getDoctorMessage"]),
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      init() {
        let _this = this;
        this.finish = true;
        _this.getDocInfo();
        _this.getPriceInfo();
      },
      /** 主动授权回调 */
      userInfo(e){
        if (e.target.userInfo) {
          this.ensureShow = false;
          this.nickName=e.target.userInfo.nickName;   //昵称
          this.ensureShare = true;                    //分享按钮
        } else {
          this.ensureShow = true;
        }
      },
      // 医生基本信息
      getDocInfo() {
        let _this = this;
        getBaseMessage({
          "customerId": _this.idList.doctorId,
          "logoUseFlag": 3
        }).then((res) => {
          _this.finish = false;
          if (res && res.responseData && res.responseData.dataList) {
            let _baseInfoData = res.responseData.dataList[0];
            _this.authMap = _baseInfoData.authMap;
            let medicalTitleText = _this.textCutter(_this.authMap.medicalTitle, "medical");
            _this.doctorLogo = _baseInfoData.logoUrlMap.logoUrl;
            // _this.doctorName = _this.authMap.fullName.length > 4 ? _this.authMap.fullName.substring(0, 4) + "..." : _this.authMap.fullName;
            _this.jobDoctorYear = _this.authMap.jobDoctorYear>=5?( _this.authMap.jobDoctorYear>=10?`从医${_this.authMap.jobDoctorYear}年`:"从医5年以上"):"师从名医";
            // _this.medicalTitle = (medicalTitleText.length > 8 ? medicalTitleText.substring(0, 8) + "..." : medicalTitleText) || "";
            _this.medicalTitle = medicalTitleText;
            _this.department = _this.authMap.department || "";
            _this.company = _this.authMap.company || "";
            _this.expertise = _this.authMap.expertise;
            _this.count = _baseInfoData.count;
            wx.setNavigationBarTitle({
              title: `${_this.authMap.fullName}医生介绍`
            })
            console.log(_baseInfoData.abilityPracticeList)
            // 处理执业成就字段；
            _baseInfoData.abilityPracticeList.length &&
            _baseInfoData.abilityPracticeList.map(item => {
              _this.achievement += item.executiveAbility + "；";
            });
            _this.achievement.length &&
            (_this.achievement = _this.achievement.substring(
              0,
              _this.achievement.length - 1
            ));
            // 处理获得荣誉字段
            _baseInfoData.honorList.length &&
            _baseInfoData.honorList.map(item => {
              _this.honor.push(item.honorName);
            });
            _this.honorLess = _this.honor;
            let honorLen = _this.honor.length;
            if (honorLen) {
              if (honorLen > 3) {
                _this.showHonier = true;
                let honorTemp = _this.honor.concat([]);
                _this.honorLess = honorTemp.splice(0, 3);
              }
            }
            // 处理学术能力字段；
            _baseInfoData.abilityAcademicList.length &&
            _baseInfoData.abilityAcademicList.map(item => {
              _this.academic += item.academicAbility + "；";
            });
            _this.academic.length &&
            (_this.academic = _this.academic.substring(
              0,
              _this.academic.length - 1
            ));
            _this.academicLess = _this.academic;
            if (api.getByteLen(_this.academic) > 120) {
              _this.academicMoreShow = true;
              _this.academicLess =
                api.getStrByteLen(_this.academic, 115) + "...";
            }
            // 处理社会任职字段
            _baseInfoData.socialList.length &&
            _baseInfoData.socialList.map(item => {
              _this.work.push(item.organization + item.socialTitle);
            });
            _this.workLess = _this.work;
            let workLen = _this.work.length;
            if (workLen) {
              if (workLen > 3) {
                _this.workMoreShow = true;
                let workTemp = _this.work.concat([]);
                _this.workLess = workTemp.splice(0, 3);
              }
            }
          }
        }).catch(err => {
          _this.finish = false;
        })
      },
      // 咨询价格
      getPriceInfo() {
        let _this = this;
        getConsultPrice({
          customerId: _this.idList.doctorId
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
                customerId: _this.idList.doctorId,
                caseId: _this.idList.caseId,
                patientId: _this.idList.patientId, //患者ID
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
                    browseType:"132",
                    opDesc:"医生信息介绍页-未开诊（小程序）"
                  })
                } else {
                  _this.openState = 1;
                  dataLog.enterBrowse({
                    browseType:"89",
                    opDesc:"医生信息介绍页（小程序）"
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
              });
            }
          }
        })
      },
      isHasGood() {
        return this.authMap.expertise > 0 ? true : false;
      },
      /** 切换展开、隐藏 */
      showFun(type) {
        this[type + "More"] = !this[type + "More"];
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
      /** 去咨询按钮 */
      goConsultFn() {
        let _this = this;
        getConsultStatus({
          customerId: _this.idList.doctorId,
          caseId: _this.idList.caseId,
          patientId: _this.idList.patientId,    //患者ID
          orderType: 1,
          orderSourceType: 0,
          sortType: 2
        }).then(data => {
          let _isFree = data.isFree;
          let _state = data.state;
          let _remainNum = data.remainNum;
          let _conState = data.conState;    //0-无沟通中数据 1-有
          if (_state == 1) {
            //开启咨询
            if (_conState ==1 && _this.from=='imScene') {
              _this.confirmShow = true;
            } else {
              if (_remainNum !== 0) {
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
        });
      },
      toImPage(){
        let _this =this;
        if (getCurrentPages().length>=4) {
          localStorage.setItem('backIndex',true)
          wx.reLaunch({
            url: `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${_this.idList.doctorId}&patientId=${_this.idList.patientId}&caseId=${_this.idList.caseId}`
          })
        } else {
          wx.navigateTo({
            url: `/packageA/imSceneDoctor/imSceneDoctor?doctorCustomerId=${_this.idList.doctorId}&patientId=${_this.idList.patientId}&caseId=${_this.idList.caseId}`
          })
        }
      },
      /** 邀请医生开诊 */
      inviteConsultFn() {
        let _this = this;
        this.finish = true;
        miniLogin({
          successCallBack:(res) => {
          if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
            // 已登录...
            getHasInvitedConsult({
              customerId: _this.idList.doctorId,                       //	string	是	医生id
              patientCustomerId: localStorage.getItem("userId") || '',	//string	是	患者所属用户id
              openid: localStorage.getItem("openId") || "",	            // string	是	渠道唯一id
              uuid: localStorage.getItem('unionId') || "",              // string	是	联合id（用来关联其他平台）
            }).then(data => {
              this.finish = false;
              if (data.responseObject.responseStatus) {
                if (data.responseObject.responseMessage == "NO DATA") {
                  //未邀请过
                  wx.navigateTo({
                    url:`/pages/doctorMain/inviteContent?from=${_this.from}`
                  })
                } else {
                  //已邀请过
                  this.toastFn("您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。");
                }
              } else {
                cosnole.log('获取是否邀请过医生开诊失败');
              }
            })
          } else {
            this.finish = false;
            wx.navigateTo({
              url:`/pages/doctorMain/inviteContent?from=${_this.from}`
            })
          }
         }
        });
      },
       /** 去咨询授权 */
      authorizeFn(e){
        this.navigateTo = true;
        if (e.target.userInfo) {
          if (this.openState==1) {
            dataLog.createTrack({
              actionId: 14150,
            });
            this.goConsultFn()
          } else {
            dataLog.createTrack({
              actionId: 14151,
            });
            this.inviteConsultFn()
          }
        }else{
          console.log("拒绝授权")
          this.ensureShow = true;
        }
      },
      goToSetting(e) {
        let _this = this;
        if (e.mp.detail.errMsg === "openSetting:ok") {
          _this.ensureShow = false;
          if (!_this.navigateTo) {
            // 分享授权回调函数 此处需要手动触发分享
          } else {
            if (_this.openState==1) {
              _this.goConsultFn()
            } else {
              _this.inviteConsultFn()
            }
          }
        } else {
          _this.ensureShow = true;
        }
      },
      /** 咨询跳页判断 */
      showNotConsult() {
        let _this = this;
        const data = {
          applicationType: this.applicationType,
          doctorId: _this.idList.doctorId,
          doctorName: _this.authMap.fullName
        }
        localStorage.removeItem("redirect")
        if (_this.from == '' || _this.from == "find" || _this.from == "share" || _this.from == "journal" || _this.from == "AI" || _this.from == "patientNote") {
          if (localStorage.getItem("userId")) {
            if (getCurrentPages().length>=4) {
              localStorage.setItem('backIndex',true)
              if (_this.source&&_this.source=='qrCode') {
                wx.reLaunch({
                  // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                })
              } else {
                wx.reLaunch({
                  // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                })
              }
            } else {
              if (_this.source&&_this.source=='qrCode') {
                wx.navigateTo({
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                  // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
                })
              } else {
                wx.navigateTo({
                  // url:`/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                })
              }
            }
          } else {
            if (getCurrentPages().length>=4) {
              localStorage.setItem('backIndex',true)
              if (_this.source&&_this.source=='qrCode') {
                   wx.reLaunch({
                     url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                    // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
                  })
              } else {

                wx.reLaunch({
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                  // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                })
              }
            } else {
              if (_this.source&&_this.source=='qrCode') {
                wx.navigateTo({
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                  // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}&source=qrCode`
                })
              } else {
                wx.navigateTo({
                  url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                  // url:`/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=${_this.idList.doctorId}&from=${_this.from}`
                })
              }
            }
          }
        } else {
          console.log("正常路程咨询")
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
      },
      shareFn() {
        dataLog.createTrack({
          actionId: 14152,
        });
      }
    },
    filters: {
      movePoint(value) {
        let result;
        if (!Number.isInteger(parseFloat(value))) {
          result = parseFloat(value);
        } else {
          result = parseFloat(value).toFixed(0);
        }
        return isNaN(result) ? 0 : result;
      },
    },
    computed: {
      ...mapState(["doctorMessage", "doctorBaseInfo", "idList"])
    }
  };
</script>

<style lang="scss" scoped>
  .doctorHome-main {
    padding-bottom: 170px;
    .doc-topInfo {
      padding: 52px 40px 0;
      position: relative;
      .doc-shareBtn {
        width: 120px;
        height: 52px;
        position: absolute;
        right: 40px;
        top: 10px;
        // box-shadow: 0 4px 8px 0 rgba(13, 166, 157, 0.42);
        border-radius: 66px;
        background: url("https://m.allinmed.cn/static/image/mp/consult/shareBtn.png") no-repeat center center;
        background-size: 100% 100%;
        &::after {
          border: none;
        }
      }
      .doc-getUserInfo{
        width: 120px;
        height: 52px;
        position: absolute;
        right: 40px;
        top: 10px;
      }
      .top-left {
        float: left;
        img {
          width: 56px;
          height: 56px;
          border-radius: 100%;
        }
      }
      .top-right {
        padding-left: 76px;
        .top-docInfoContent{
          width: 480px;
        }
        .doc-name {
          display: inline-block;
          font-size: 36px;
          color: #000000;
          margin-right: 20px;
          font-weight: bold;
        }
        .doc-medical {
          display: inline-block;
          font-size: 30px;
          color: #333333;
          margin-right: 20px;
          line-height: 1;
          padding-top: 20px;
        }
        .doc-degree {
          font-size: 30px;
          color: #333333;
        }
        //三甲 医院
        .doc-right-content2 {
          // margin-top: 20px;
          line-height: 1;
          padding-top: 12px;
          .doc-hospitalGrade {
            font-size: 26px;
            color: #2EA9FE;
            padding: 8px 8px 4px;
            background: rgba(7, 182, 172, 0.12);
            border-radius: 4px;
            margin-right: 20px;
          }
          .doc-hospitallName {
            font-size: 30px;
            color: #333333;
            line-height: 1.6;
          }
        }
        .doc-cureTime {
          margin-top: 20px;
          width: 178px;
          height: 42px;
          font-size: 26px;
          color: #cfae7b;
          text-align: center;
          line-height: 42px;
          background: #3e414f;
          border-radius: 46px;
        }
      }
      .doc-borderLine {
        margin-top: 60px;
        width: 670px;
        height: 2px;
        background: #eeeeee;
      }
    }
    // 列表统一样式
    .doc-listComm {
      padding: 60px 40px 52px 54px;
      .doc-listTitle {
        font-size: 36px;
        color: #000000;
        font-weight: bold;
        position: relative;
        margin-bottom: 30px;
        &::before {
          position: absolute;
          content: "";
          width: 6px;
          height: 30px;
          background: #2EA9FE;
          border-radius: 66px;
          left: -18px;
          top: 50%;
          margin-top: -12px;
        }
      }
      .doc-listContent {
        font-size: 30px;
        color: #333333;
        .doc-listGoodItem {
          padding-left: 35px;
          position: relative;
          &::before {
            content: "";
            display: block;
            position: absolute;
            width: 10px;
            height: 10px;
            background: url('https://m.allinmed.cn/static/image/img00/findDoctor/point.png') 50%;
            background-size: contain;
            left: 0;
            top: 18px;
          }
        }
      }
      .doc-listShowBtn {
        text-align: center;
        font-size: 30px;
        color: #2EA9FE;
        margin-top: 54px;
      }
      &.doc-goodAt{
        padding: 53px 40px 46px 54px;
      }
    }
    .doc-border-hightLine {
      background: #F2F2F2;
      height: 16px;
      width: 100%
    }
    //去咨询按钮
    .doc-goConsult {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 112px;
      /*height: 180px;*/
      box-shadow: 0 0 20px -10px rgba(0, 0, 0, 0.30);
      .shareBtn{
        position: absolute;
        right: 30px;
        text-align: center;
        top: -150px;
        width:112px;
        height:112px;
        line-height: 112px;
        border-radius: 50%;
        background:linear-gradient(121deg,rgba(255,189,35,1) 0%,rgba(255,150,13,1) 100%);
        box-shadow:0px 12px 30px 0px rgba(219,162,77,0.34);
        span{
          font-size:34px;
          color: #fff;
          white-space: nowrap;
          margin-left: -6px;
        }
      }
      @include iphoneX() {
        /*height: 180px;*/
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
            color: #FE8178;
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
        color: #FFFFFF;
        font-weight: bold;
        border-radius: 0%;
      }
    }
  }
</style>
