<template>
  <section class="orderList">
    <NormalLoading v-if="finish"></NormalLoading>
    <section v-if="!authorizationFlag" style="height:100%;">
      <div v-if="historyLists.length == 0 && noFriend">
        <section class="noFriendText">
          <p>您还没有任何记录</p>
        </section>
        <section class="noFriendHref">

          <div @click="clickStatus && hrefToConsult()"><i class="icon"></i>快速问诊</div>
        </section>
      </div>
      <div class="orderHistoryBox" v-else>
        <!--消息列表老代码部分开始-->
        <section class="orderHistoryItem" :key="index" @click="clickStatus && goImPage(item)" v-for="(item,index) in historyLists" v-if="item.patientId">
          <article class="orderHisItemTop">
            <figure class="doctorInfo left">
              <figcaption class="docLogo left"><img :src="item.logoImg"></figcaption>
              <section class="docType right">
                <p class="docName"><span>{{item.showName}}</span><span class="medicalTitleRight">{{item.medicalTitle}}</span></p>
                <p class="inquiryType" :class="{mTop:!item.medicalTitle}">{{item.consultationType == 1?item.company:"唯医骨科"}}</p>
              </section>
            </figure>
            <div class="doctorState right">
              <span class="inquiryTimeShow">{{item.showTime}}</span>
              <span class="inquiryStateShow" :class="item.fontGray">{{item.statusName}}</span>
            </div>
          </article>
          <div class="orderHistoryItemCenter">
            <p><i>就诊人</i><span>{{item.patientNameShow}}</span></p>
            <p v-if="item.caseType != 14"><i>病&nbsp;&nbsp;&nbsp;情</i><span class="patientComplaint">{{item.mainContent.caseMain}}</span></p>
            <!-- <p v-if="item.caseType == 15"><i>病&nbsp;&nbsp;&nbsp;情</i><span class="patientComplaint">美年健康体检咨询</span></p> -->
          </div>
          <div class="orderHistoryItemBottom" v-if="(item.consultationType==0&&(item.consultationState==0 || item.consultationState == 9)&&item.state==3) || (item.consultationType==0&&item.isRecommend==1)">
            <span class="hrefBtn" v-if="item.consultationState==9&&item.state==3" @click.stop="clickStatus && goToUploadPic(item)">补全检查资料</span>
            <span class="hrefBtn" v-if="item.isRecommend==1">查看推荐专家</span>
          </div>
          <div class="orderHistoryItemBottom" v-if="item.isEvaluateFlag==1">
            <span class="hrefBtn" @click.stop="goEvaluate(item)">去评价</span>
          </div>
        </section>
        <!--消息列表老代码部分结束-->
        <!--<section class="orderMessageItem"  :key="index" @click="clickStatus && goImPage(item)" v-for="(item,index) in historyLists" v-if="item.patientId">
          <section class="orderMessageDoctor">
            <figure class="doctorLogo" :style='{background: "url("+item.logoImg+") no-repeat center center/cover"}'></figure>
            <article class="doctorInfo">
              <div class="doctorMedicalTitle">
                <span class="doctorName" v-text="item.showName"></span>
                <span class="medicalTitle" v-text="item.medicalTitle"></span>
              </div>
              <p class="doctorCompany" v-text="item.consultationType == 1?item.company:'唯医骨科'"></p>
            </article>
            <div class="messageTime" v-text="item.showTime"></div>
            <div class="messageNum">99&nbsp;条新消息</div>
          </section>
          <section class="orderMessagePatient">
            <div class="patientItem patientInfo">
              <span class="labelName">就诊人:</span>
              <span class="patientDetailInfo" v-text="item.patientNameShow"></span>
            </div>
            <div class="patientItem patientDetail">
              <div class="labelName">病情:</div>
              <div class="patientDetailInfo" v-text="item.mainContent.caseMain"></div>
            </div>
          </section>
        </section>-->
        <p class="noMore" v-if="noMoreShow">没有更多了</p>
      </div>
    </section>
    <section class="authorization" v-if="authorizationFlag">
      <img src="https://m.allinmed.cn/static/image/mp/report/authorization.png"/>
      <div class="text">获取信息失败，请先授权</div>
      <button @getuserinfo="getAuthorize" open-type="getUserInfo">去授权</button>
    </section>
    <ensureConfirm v-if="ensureShow" :ensureParams="ensureParams" @ensureClickEvent="goToSetting"></ensureConfirm>
    <customizedTabbar :selected=3 @FromChild="jumpToUrl" @goToMessage="jumpToMessage" :checkedPhone="mobileOnOff"></customizedTabbar>
    <authorization></authorization>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from 'common/js/util/util';
  import NormalLoading from "components/loading";
  import localStorage from "localStorage";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import ensureConfirm from "components/ensure";
  import customizedTabbar from "components/customizedTabbar";
  import authorization from "components/authorization/authorization";
  import dataLog from "dataLog";
  import {mapGetters} from 'vuex';
  const XHRList = {
    getOrderHistoryLists: api.httpEnv() + '/mcall/customer/case/consultation/v1/getMapList/', //咨询历史接口
    getPicList: api.httpEnv() + '/mcall/patient/recovery/advice/v1/getMapList/'//图片列表
  };

  import getPhoneAuthorization from 'common/js/miniUtil/GetPhoneAuthorization';
  import getServiceCommentStatus from "common/js/HttpRequest/getServiceCommentStatus";

  export default {
    data() {
      let mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      return {
        finish: false,
        noFriend: false,
        noMoreShow: false,
        pageStart: 0,
        pageNum: 20,
        historyLists: [],
        authorizationFlag:false,
        ensureShow:false,
        ensureParams: {
          content: "唯医骨科需获取您的授权信息，以方便您后续使用",
          ensure: "确定",
          type:"openSetting"
        },
        mobileOnOff:mobileOnOff,
        clickStatus:true
      }
    },
    onPullDownRefresh() {
      this.pageStart = 0;
      this.noMoreShow = false;
      this.historyLists = [];
      this.getConsultLists("get");
    },
    onShow() {
      if (localStorage.getItem("backFromImgCheck")){
        this.pageStart = 0;
        this.noMoreShow = false;
        this.historyLists = [];
        this.getConsultLists("get");
        localStorage.removeItem("backFromImgCheck");
      }
    },
    onLoad() {
      this.init();
      wx.onNetworkStatusChange((res) => {
        this.finish = false;
        console.log("netStatus:");
        console.log(res);
        if (res && !!res.isConnected) {

        } else {

        }
      });
    },
    computed:{
      ...mapGetters(['userInfoEnd'])
    },
    watch:{
      userInfoEnd(newVal){
        console.log(newVal);
        console.log('获取到信息');
        let _this = this;
        _this.mobileOnOff = getPhoneAuthorization.checkPhoneNumber();
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onReachBottom() {
      if (!this.noMoreShow) {
        this.pageStart += this.pageNum;
        this.getConsultLists("pull");
      }
    },
    methods: {
      //跳转到我的医生列表
      jumpToMessage(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/myConsult/myConsult'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      //跳转到个人中心
      jumpToUrl(e) {
        if (e.desc) {
          wx.redirectTo({
            url: '/pages/personal/personal'
          });
          miniLogin({
            successCallBack: (res) => {
            },
            failCallBack: (res) => {
              this.finish = true;
              setTimeout(() => {
                this.finish = false
              }, 2000)
            }
          });
        } else {
          this.ensureShow = true;
        }
      },
      init(){
        this.pageStart = 0;
        this.finish = false;
        this.noFriend = false;
        this.noMoreShow = false;
        this.authorizationFlag = false;
        this.ensureShow = false;
        this.clickStatus = true;
        this.historyLists = [];
        this.checkAuthorize();
      },
      trackCallback(){
        dataLog.createTrack({
          actionId: 14192,
        });
      },
      checkAuthorize(){
        let that = this;
        wx.getSetting({
          success: (res) => {
            console.log(res);
            if (res && res.authSetting["scope.userInfo"]) {
              that.authorizationFlag=false;
              that.getConsultLists("get");
            }else{
              that.authorizationFlag=true;
              dataLog.enterBrowse({
                browseType: "124",
                opDesc: "授权页面（独立授权页）（小程序）"
              });
            }
          }
        })
      },
      getAuthorize(obj) {
        dataLog.createTrack({
          actionId: 14188,
        });
        if (obj.target.userInfo) {
          this.ensureShow = false;
          this.getLoginInfo();
        } else {
          this.ensureShow = true;
        }
      },
      getLoginInfo() {
        let that = this;
        miniLogin({
          successCallBack: function (res) {
            if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
              that.authorizationFlag=false;
              that.getConsultLists();
            } else {
              wx.navigateTo({
                url: '/pages/login/login?backPage=myConsult'
              });
            }
          }
        });
      },
      goToSetting(e) {
        let that = this;
        if (e.mp.detail.errMsg==="openSetting:ok"){
          that.ensureShow = false;
          that.getLoginInfo();
        }else{
          that.ensureShow = true;
        }
      },

      getConsultLists(type) {
        let that = this;
        that.finish = true;
        wx.stopPullDownRefresh();
        api.ajax({
          url: XHRList.getOrderHistoryLists,
          method: "POST",
          data: {
            patientCustomerId: localStorage.getItem("userId"),
            isValid: 1,
            firstResult: that.pageStart,
            maxResult: that.pageNum,
            logoUseFlag: 3,
            visitSiteId: 24    //站点  （美年需求新增）
          },
          done(response) {
            that.finish = false;
            if (response && response.responseObject.responseData.dataList && response.responseObject.responseData.dataList.length>0) {
              let temp = response.responseObject.responseData.dataList;
              temp.forEach((element) => {
                element.statusName = that.getStatusName(element).statusName;
                element.fontGray = that.getStatusName(element).fontGray;
                element.logoImg = that.getImgUrl(element);
                element.showName = that.getShowName(element);
                element.showTime = that.getCaseTime(element.createTime);
                element.patientNameShow = element.patientName.length > 5 ? element.patientName.substring(0, 5) + "..." : element.patientName;
                element.company = element.company.length > 15 ? element.company.substring(0, 15) + "..." : element.company;
//                element.showNameAfter = that.getShowNameAfter(element);
              });
              that.historyLists = that.historyLists.concat(temp);
              if (type==="get"){
                if (that.historyLists.length===0){
                  dataLog.enterBrowse({
                    browseType: "120",
                    opDesc: "无记录页面（小程序）"
                  });
                }else{
                  dataLog.enterBrowse({
                    browseType: "119",
                    opDesc: "无记录页面（小程序）"
                  });
                }
              }
            } else {
              if (that.pageStart == 0) {
                that.noFriend = true;
              } else {
                that.noMoreShow = true;
              }
            }
          }
        })
      },
      getImgUrl(opt) {
        let logoImg = '';
        //分诊医生
        if (opt.consultationType == 0) {
          //判断头像
          if (opt.caseType == 0 || opt.caseType == 15) {
            logoImg = "https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png";
          } else {
            logoImg = "https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png";
          }
        } else {
          //判断头像
          if (opt.logoUrl) {
            logoImg = opt.logoUrl;
          } else {
            logoImg = "https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png";
          }
        }
        return logoImg;
      },
      getStatusName(opt) {
        let statusName = '', fontGray = '';
        if (opt.consultationType == 0) {
          //分诊医生
          if (opt.doctorState == 0) {
            switch (Number(opt.consultationState)) {
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
                statusName = '咨询中';
                break;
              case 1:
              case 7:
              case 8:
                statusName = '已结束';
                fontGray = 'font-gray';
                break;
            }
          } else if (opt.doctorState == 1) {
            statusName = '已结束';
            fontGray = 'font-gray';
          }
        } else {
          //医生
          switch (Number(opt.consultationState)) {
            case -1:
              statusName = '待接诊';
              break;
            case 0:
              statusName = '咨询中';
              break;
            case 1:
            case 11:
              if (opt.caseType == 15) {
                statusName = '咨询中';
              } else {
                statusName = '已结束';
                fontGray = 'font-gray';
              }
              break;
            case 2:
              statusName = '已拒绝';
              fontGray = 'font-gray';
              break;
            case 3:
              if (opt.caseType == '15') {
                statusName = '已拒绝';
              } else {
                statusName = '已超时';
              }
              fontGray = 'font-gray';
              break;
          }
        }
        return {
          statusName: opt.caseType == 14 ? "诊后报到" : statusName,
          fontGray: fontGray
        }
      },
      getShowName(opt) {
        if (opt.consultationType == 0) {
          if (opt.caseType == 0  || opt.caseType == 15) {
            return "分诊医生";
          } else {
            return opt.doctorName + "医生助理";
          }
        } else {
          if (opt.fullName.length > 6) {
            return opt.fullName.substring(0,6) + "..."
          } else {
            return opt.fullName;
          }
        }
      },
      getShowNameAfter(opt) {
        if (opt.consultationType == 1) {
          return opt.company;
        } else {
          if (opt.consultationType == 1) {
            return "图文咨询 " + this.getCaseTime(opt.createTime);
          } else {
            return " " + this.getCaseTime(opt.createTime);
          }
        }
      },
      getCaseTime(times) {
        let time = times.substring(0, 19).replace(/-/g, "/");
        let format = function (num) {
          return num > 9 ? num : "0" + num;
        };
        let normalTime = function (time) {
          let d = new Date(time);
          let obj = {
            y: d.getFullYear(),
            m: format(d.getMonth() + 1),
            dd: format(d.getDate()),
            h: format(d.getHours()),
            mm: format(d.getMinutes())
          };
          return obj;
        };
        let result = "";
        let now = new Date().getTime(),
          day1 = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd,
          day2 = normalTime(now).y + "-" + normalTime(now).m + "-" + normalTime(now).dd;
        if (day1 === day2) {
          result = normalTime(time).h + ":" + normalTime(time).mm;
        } else if (normalTime(time).y === normalTime(now).y) {
          result = normalTime(time).m + "-" + normalTime(time).dd + "  " + normalTime(time).h + ":" + normalTime(time).mm;
        } else if (normalTime(time).y !== normalTime(now).y) {
          result = normalTime(time).y + "-" + normalTime(time).m + "-" + normalTime(time).dd + "  " + normalTime(time).h + ":" + normalTime(time).mm;
        }
        return result;
      },

      hrefToConsult() {
        dataLog.createTrack({
          actionId: 14189,
        });
        this.finish = true;
        this.clickStatus = false;
        setTimeout(()=>{
          this.clickStatus = true;
        },500);
        wx.navigateTo({
          url: '/packageB/consultIntro/consultIntro',
          success:()=>{
            this.finish = false;
          }
        })
      },
      goImPage(opt) {
        dataLog.createTrack({
          actionId: 14192,
        });
        this.finish = true;
        this.clickStatus = false;
        setTimeout(()=>{
          this.clickStatus = true;
        },500);
        if (opt.consultationType == 1) {  //医生IM跳转
          if (opt.caseType == 14) {    //跳转诊后报到IM
            wx.navigateTo({
              url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${opt.caseId}&doctorCustomerId=${opt.customerId}&patientId=${opt.patientId}&reportId=${opt.reportId}&from=report`,
              success:()=>{
                this.finish = false;
              }
            });
          } else {
            wx.navigateTo({          //跳转正常咨询IM
              url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${opt.caseId}&doctorCustomerId=${opt.customerId}&patientId=${opt.patientId}`,
              success:()=>{
                this.finish = false;
              }
            });
          }
        } else {
          if (opt.caseType == 0) {   //分诊医生跳转
            wx.navigateTo({          //跳转轻咨询IM
              url: `/packageA/imScene/imScene?caseId=${opt.caseId}&patientId=${opt.patientId}`,
              success:()=>{
                this.finish = false;
              }
            });
          } else {
            wx.navigateTo({          //跳转找医生IM
              url: `/packageA/imScene/imScene?caseId=${opt.caseId}&doctorCustomerId=${opt.customerId}&patientId=${opt.patientId}&from=find`,
              success:()=>{
                this.finish = false;
              }
            });
          }
        }
      },
      goToUploadPic(opt) {
        this.finish = true;
        this.clickStatus = false;
        setTimeout(()=>{
          this.finish = false;
          this.clickStatus = true;
        },500);
        dataLog.createTrack({
          actionId: 14191,
        });
        api.ajax({
          url: XHRList.getPicList,
          method: "POST",
          data: {
            caseId: opt.caseId,
            patientId: opt.patientId,
            isValid: 1,
            firstResult: 0,
            maxResult: 999
          },
          done(response) {
            if (response && response.responseObject.responseData.dataList.length > 0) {
              let items = response.responseObject.responseData.dataList[0];
              let hisPicLists = [];
              if (items.checkMap.length > 0) {
                items.checkMap.forEach((element) => {
                  hisPicLists.push({
                    "adviceType": 3,
                    "adviceId": String(element.checkId),
                    "adviceName": element.checkName
                  })
                })
              }
              if (items.inspectionMap.length > 0) {
                items.inspectionMap.forEach((elemen) => {
                  hisPicLists.push({
                    "adviceType": 3,
                    "adviceId": String(elemen.inspectionId),
                    "adviceName": elemen.inspectionName
                  })
                })
              }
              wx.setStorageSync("checkInspectLists", JSON.stringify(hisPicLists));
              wx.navigateTo({
                url: `/pages/upLoadImgCheck/upLoadImgCheck?caseId=${opt.caseId}&consultationId=${opt.consultationId}&triDocId=${opt.customerId}&from=myConsult`
              });
            }
          }
        })
      },
      goEvaluate(opt){
        this.finish = true;
        this.clickStatus = false;
        setTimeout(()=>{
          this.finish = false;
          this.clickStatus = true;
        },500);
        dataLog.createTrack({
          actionId: 14195,
        });
        if (opt.caseType == '14') {
          this.goCommentPage(opt)
        } else {
          wx.navigateTo({
            url: `/pages/patientComment/patientComment?consultationId=${opt.consultationId}&doctorId=${opt.customerId}&patientId=${opt.patientId}`
          });
        }

      },
      // 去评价
      goCommentPage(opt) {
        const _this = this;
        getServiceCommentStatus({
          consultationId:opt.consultationId
        }).then( data => {
          console.log(data);
          let {
            responseObject: {
              responseStatus, responseData, responseMessage
            }
          } = data;
          if (responseStatus && !!responseData) {
            if (responseMessage == 'NO DATA') {
              wx.navigateTo({
                url: `/packageD/reportNew/doctorEvaluate?doctorId=${opt.customerId}&patientId=${opt.patientId}&consultationId=${opt.consultationId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
              });
            } else {
              let {status} = responseData;
              if (status == 2) {
                wx.navigateTo({
                  url: `/packageD/reportNew/doctorEvaluate?doctorId=${opt.customerId}&patientId=${opt.patientId}&consultationId=${opt.consultationId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
                });
              }  else {
                wx.navigateTo({
                  url: `/packageD/reportNew/doctorEvaluateEnd?consultationId=${opt.consultationId}`
                });
              }
            }

          } else {
            console.log('接口请求失败');
          }
        }).catch( err => {
          console.log(err)
        });
      }
    },
    components: {
      NormalLoading,
      ensureConfirm,
      customizedTabbar,
      authorization
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  //字号定义
  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .orderList {
    background-color: #ffffff;
  }

  //没有历史
  .noFriendText {
    padding-top: 470px;
    &:before {
      content: '';
      display: block;
      width: 328px;
      height: 328px;
      background: url("https://m1.allinmed.cn/static/image/img00/myServices/inquiry_bg.png") no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      top: 94px;
      left: 50%;
      margin-left: -164px;
    }
    p {
      height:30px;
      font-size:30px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:30px;
      text-align: center;
    }
  }

  .noFriendHref {
    div{
      .icon{
        display: block;
        width:44px;
        height:44px;
        background:url("https://m1.allinmed.cn/static/image/img00/myServices/advisory.png") no-repeat center center/cover;
        margin-right: 6px;
      }
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      line-height: 96px;
      margin:0 auto;
      text-align: center;
      margin-top: 176px;
      color: #FFFFFF;
      font-weight: bold;
      font-size:36px;
      color:rgba(255,255,255,1);

      width:520px;
      height:96px;
      background:rgba(46,169,254,1);
      border-radius:8px;
    }
  }

  //咨询历史
  .orderList {
    box-sizing: border-box;
    height:100%;
    .orderHistoryBox {
      background: #eeeeee;
      border-top: 1px solid transparent;
      min-height:100%;
      .noMore {
        line-height: 100px;
        color: #666;
        text-align: center;
        font-size: 28px;
      }
    }
    .orderHistoryItem {
      margin: 20px 20px 0;
      background: #ffffff;
      border-radius: 16px;
      .orderHisItemTop {
        padding: 32px 32px 24px 32px;
        @include clearfix();
        .doctorInfo {
          @include clearfix();
          .docLogo > img {
            display: block;
            width: 76px;
            height: 76px;
            border-radius: 50%;
          }
          .docType {
            padding-left: 16px;
            .docName {
              color: #222222;
              font-weight: bold;
              font-size: 30px;
              .medicalTitleRight {
                margin-left: 16px;
                font-weight: normal;
                color: #333333;
              }
            }
            .inquiryType {
              &.mTop{
                margin-top:10px;
              }
              color: #909090;
              font-size: 24px;
            }
          }
        }
        .doctorState {
          text-align: right;
          .inquiryTimeShow {
            display: block;
            font-size: 24px;
            color: #AAAAAA;
          }
          .inquiryStateShow {
            display: block;
            font-size: 30px;
            font-weight: bold;
            color: #00B9AD;
            &.font-gray {
              color: #AAAAAA;
            }
          }
        }
      }
      .orderHistoryItemCenter {
        &:before {
          display: block;
          content: "";
          height: 1px;
          background: #F8F8F8;
          margin-bottom: 32px;
          margin-right: 40px;
        }
        position: relative;
        padding: 0 32px 44px;
        font-size: 32px;
        p {
          color: #909090;
          line-height:32px;
          &:nth-child(2) {
            padding-top: 20px;
          }
          i{
            display: inline-block;
            font-style: normal;
            vertical-align: middle;
          }
          span {
            display: inline-block;
            color: #555555;
            margin-left: 20px;
            vertical-align: middle;
          }
        }
        .patientComplaint {
          width: 480px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .orderHistoryItemBottom {
        margin: 0 60px 0 32px;
        border-top: 2px solid #F2F2F2;
        display: flex;
        display: -webkit-flex;
        -webkit-justify-content: space-around;
        .hrefBtn {
          margin: 20px 0 28px;
          padding: 10px 28px;
          background: #fff;
          color: #00B9AD;
          font-size: 28px;
          border: 1px solid rgba(47, 197, 189, 0.5);
          border-radius: 50px;
        }
      }
    }
    .orderMessageItem{
      width:710px;
      height:288px;
      background:rgba(254,254,254,1);
      box-shadow:0px 6px 18px 0px rgba(131,149,162,0.15);
      border-radius:16px;
      margin:20px 20px 0;
      .orderMessageDoctor{
        width:656px;
        height:130px;
        background:rgba(231,242,253,1);
        border-radius:16px 16px 0px 0px;
        padding-top: 30px;
        padding-left: 28px;
        padding-right: 26px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        position: relative;
        .doctorLogo{
          width:100px;
          height:100px;
          background:rgba(176,212,251,1);
          opacity:0.85;
          border-radius: 50%;
          margin-right: 22px;
          border:4px solid rgba(255,255,255,1);
        }
        .doctorInfo{
          display: block;
          .doctorMedicalTitle{
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            margin-bottom: 18px;
            height: 50px;
            justify-content: flex-start;
            .doctorName{
              height:34px;
              font-size:34px;
              font-family:PingFangSC-Medium;
              font-weight:500;
              color:rgba(8,17,43,1);
              line-height:34px;

            }
            .medicalTitle{
              height:32px;
              font-size:32px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(8,17,43,1);
              line-height:32px;
              margin-left: 10px;
            }
          }
          .doctorCompany{
            display: block;
            width:308px;
            height:26px;
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(8,17,43,1);
            line-height:26px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
        .messageTime{
          height:26px;
          font-size:26px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(13,22,47,1);
          line-height:26px;
          position: absolute;
          right: 26px;
          top:48px;
        }
        .messageNum{
          width:142px;
          height:48px;
          padding-right: 26px;
          background:rgba(242,117,135,1);
          box-shadow:0px 4px 6px 0px rgba(242,117,135,0.53);
          border-radius:8px 0px 0px 8px;
          position: absolute;
          right: 0;
          bottom:24px;
          font-size:24px;
          text-align: right;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(255,255,255,1);
          line-height:48px;
        }
      }
      .orderMessagePatient{
        padding-top: 26px;
        padding-left: 40px;
        .labelName{
          width:86px;
          height:26px;
          font-size:26px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(102,102,102,1);
          line-height:26px;
          margin-right: 22px;
          text-align-last: justify;
          text-align: justify;
        }
        .patientItem{
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          height: 26px;
          width: auto;
          &:nth-of-type(2){
            margin-top: 14px;
          }
          .patientDetailInfo{
            height:26px;
            font-size:26px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(144,144,144,1);
            line-height:26px;
          }
          &.patientDetail{
            .patientDetailInfo{
              width:416px;
              height:26px;
              font-size:26px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(144,144,144,1);
              line-height:26px;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }


  //授权引导页
  .authorization{
    margin-top: 180px;
    background: #fff;
    image {
      width: 360px;
      height: 256px;
      display: block;
      margin: 0 auto 28px;
    }
    .text {
      font-size:28px;
      color: #888888;
      letter-spacing: 0;
      line-height: 28px;
      text-align: center;
      margin-bottom:140px;
    }
    button{
      width:400px;
      height:100px;
      border:2px solid #12D5A8;
      border-radius: 50px;
      line-height: 100px;
      color:#11D5A7;
      display: block;
      margin:0 auto;
    }
  }
</style>
