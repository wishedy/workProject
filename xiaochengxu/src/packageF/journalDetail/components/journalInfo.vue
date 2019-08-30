<template>
  <section class="ji_main">
    <div style="position: absolute;z-index: -1;opacity: 0;visibility: hidden;bottom: 0;right: 0;" v-if="clipFlag">
      <canvas class="getCircleImage" canvasId="getCircleImage"></canvas>
    </div>
    <form action="" @submit="formSubmit">
      <button v-if="journalData.fullName" formType="submit" class="doctorInfo content clearButtonStyle" open-type="getUserInfo" @getuserinfo="getUserInfo">
        <section class="clearButtonStyle">
          <figure class="logoUrl">
            <img :src="journalData.customerLogo?journalData.customerLogo:'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'">
          </figure>
          <section class="message">
            <span class="doctorName">主刀:{{journalData.fullNameShow}}</span>
            <span class="doctorLevel">{{journalData.medicalTitle}}</span>
            <p class="hospital">{{journalData.company}}</p>
          </section>
        </section>
        <section class="ji-consultDoc">咨询医生</section>
      </button>
      <button v-if="journalData.fullName" formType="submit" class="doctorFixed" :class="{'show':fixedShow}" open-type="getUserInfo" @getuserinfo="getUserInfo">
        <section class="doctorBox">
          <img class="doctorFixedLogo" :src="journalData.customerLogo?journalData.customerLogo:'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'">
          <span class="doctorFixedName">主刀：{{journalData.fullNameShow}}</span>
          <span class="doctorFixedOther">{{journalData.medicalTitle}} {{journalData.company}}</span>
        </section>
      </button>
    </form>
    <header class="ji_title">{{journalData.diaryName}}</header>
    <section class="ji_updateTime">
      <!--<span>{{journalData.operationString}}</span>-->
      <section class="ji_patientInfo">
        <img class="patientLogo" :src="journalData.authorLogoUrl" alt="" v-if="journalData.authorLogoUrl">
        <span class="patientName" v-if="journalData.authorName">{{journalData.authorNameShow}}</span>
        <span class="patientAge">{{(journalData.patientSex == 1 ? '男' : '') || (journalData.patientSex == 2 ? '女' : '')}} {{journalData.patientAgeShow}}</span>
      </section>
      <p class="updateTime" v-if="journalData.updateTime.length">更新于: {{journalData.updateTime}}</p>
    </section>

    <!--<button v-if="journalData.fullName" open-type="getUserInfo" @getuserinfo="getUserInfo" class="ji_doctorInfo">-->
      <!--<div class="ji_doctorInfoDet">主诊医生：<span class="ji_detailName">{{journalData.fullNameShow}}</span><span>{{journalData.medicalTitle}}</span>-->
      <!--</div>-->
      <!--<div class="ji_doctorInfoHos">{{journalData.company}}</div>-->
    <!--</button>-->
    <!--<ul class="ji_patientDetail">-->
    <!--<li v-if="journalData.patientSex || journalData.patientAge">患者信息：<span v-if="journalData.patientSex">{{journalData.patientSex == 1?"男":"女"}}</span><span-->
    <!--v-if="journalData.patientAge && journalData.patientAge!=0">{{journalData.patientAge}}岁</span></li>-->
    <!--<li v-if="journalData.treatmentTimeShow">入院时间：{{journalData.treatmentTimeShow}}</li>-->
    <!--</ul>-->
    <backgroundMusic
      v-if="journalData.audioMap && journalData.audioMap.attUrl"
      :audioMap = 'journalData.audioMap'>
    </backgroundMusic>
    <section class="ji_patientDes-box" v-if="journalData.diaryContent && journalData.diaryContent.length && parseShow">
      <jkParse className="ji_patientDes" :content="journalData.diaryContent"></jkParse>
    </section>
    <footer class="ji_bottomMsg">

      <!--<article class="share-btn" @click="showCanvas">-->
      <!--<i class="icon-share">-->
      <!--<img src="/static/image/shareCircle.png" alt="">-->
      <!--</i>-->
      <!--<p>生成分享图片</p>-->
      <!--</article>-->
      <form action="" @submit="formSubmit" report-submit="true">
        <button class="addJournal" type="submit" formType="submit" open-type="getUserInfo" @getuserinfo="goPersonal">
          <img class="addIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/write.png">
          <span class="addText">我也要写</span>
        </button>
      </form>
      <div class="ji_browseNum" v-if="journalData.browseNum>0">{{journalData.browseNumShow}}浏览</div>
    </footer>
    <section class="LikeSection">
      <section class="like" @click="clickShareButton">
        <h1 :class="{'popup':popup}">{{count}}鼓励<!--<img
          src="https://m.allinmed.cn/static/image/mp/index/1.1.2/encourage.png">--></h1>
        <img class="likeIcon"
             src="https://m.allinmed.cn/static/image/mp/index/1.1.2/like.png" :class="{'shacking':shack}">
        <p v-if="recentLikeNum!=0&&recentLikeNum<100000">{{recentLikeNum}}</p>
        <p v-if="recentLikeNum!=0&&recentLikeNum>=100000">10万+</p>
      </section>
      <p>康复不易，点赞鼓励~</p>
    </section>
    <!--<section class="doctorInfo" v-if="journalData.fullName">-->
      <!--<header class="doctorInfo-title">-->
        <!--<h2>主诊医生</h2>-->
      <!--</header>-->
      <!--<button class="content clearButtonStyle" open-type="getUserInfo" @getuserinfo="getUserInfo">-->
        <!--<section class="clearButtonStyle">-->
          <!--<figure class="logoUrl"><img-->
            <!--:src="journalData.customerLogo?journalData.customerLogo:'https://m.allinmed.cn/static/image/img00/doctorMain/doc_logo.png'">-->
          <!--</figure>-->
          <!--<section class="message">-->
            <!--<span class="doctorName">{{journalData.fullNameShow}}</span>-->
            <!--<span class="doctorLevel">{{journalData.medicalTitle}}</span>-->
            <!--<p class="hospital">{{journalData.company}}</p>-->
          <!--</section>-->
        <!--</section>-->
        <!--<section class="ji-consultDoc">咨询医生</section>-->
      <!--</button>-->
    <!--</section>-->
    <BackIndex v-if="countPages.length==1"></BackIndex>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import {createNamespacedHelpers} from 'vuex';
  import localStorage from "localStorage";
  import dataLog from "dataLog";
  import getJournalQrCode from "common/js/HttpRequest/getJournalQrCode";
  import getLikeNumber from "common/js/HttpRequest/getLikeNumber";
  import BackIndex from "components/backIndex";
  import backgroundMusic from './backgroundMusic';
  import sendFormId from "common/js/HttpRequest/sendFormId";

  const {mapState,mapGetters, mapMutations, mapActions} = createNamespacedHelpers('journal');
  const XHRList = {
    infoHtml: api.httpEnv() + "/mcall/rehabilitative/diary/v1/getMapById/"
  };
  // const jkParse = require("../api/js/jkParse");
  import jkParse from 'components/wxParse/jkParse'

  let popupTimeOut = null;
  let shackTimeOut = null;
  let videoTime = null;

  export default {
    data() {
      return {
        popup: false,
        shack: false,
        count: 0,
        recentLikeNum: 0,
        journalData: {
          operationString: "",
          updateTime: "",
          treatmentTimeShow: "",
          browseNumTest: "200000"
        },
        parseShow:false,
        clickStatus: true,
        clipFlag: false,
        countPages:'',
        backStatus:0,
        fixedShow:false, // fixed 医生信息是否显示
        textHtml: '<p><img src="https://img05.allinmed.cn/public1/M00/04/ED/wKgBwVuPiryAV21KACq5BoF0xlU301.png"></p><p>发发发发发发发发发付付付付付付付付付付付付付付付付付付付</p><section class="videoStyleOrder"><video src="http://vpro.allinmed.cn/1536131521612_1280_720.mp4" class="videoPlayBox" controls="controls" poster="http://vpro.allinmed.cn/1536131521612_1536131521_450_300.jpg"></video></section>'
      }
    },
    components: {
      jkParse,
      BackIndex,
      backgroundMusic
    },
    onUnload() {
      this.recentLikeNum = 0;
      this.getLike();
      this.parseShow = false;
      this.journalData = {
        operationString: "",
        updateTime: "",
        treatmentTimeShow: "",
        diaryContent:'',
      };
      // if (videoTime) clearTimeout(videoTime);
    },
    onHide() {
      this.getLike()
    },
    onShow() {
      this.count = 0
    },
    onPageScroll (e) {
      if (this.journalData.fullName) {
        if (e.scrollTop > 100) {
          this.fixedShow = true;
        } else {
          this.fixedShow = false;
        }
      }
    },
    onLoad(options) {
      let _this = this;
      this.journalData = {
        operationString: "",
        updateTime: "",
        treatmentTimeShow: "",
        diaryContent:'',
      };
      this.parseShow = false;
      this.popup = false;
      this.shack = false;
      this.fixedShow = false;
      if (popupTimeOut) clearTimeout(popupTimeOut);
      if (shackTimeOut) clearTimeout(shackTimeOut);
      // if (videoTime) clearTimeout(videoTime);
      // this.setVideoNum(0);
      this.getQr(options);
      this.getInfoHtml(options);

      // videoTime = setTimeout( () => {
      //   this.videoPause();
      // }, 2000)
      
      _this.countPages = getCurrentPages();
      // let _currentPages = getCurrentPages();
      // _currentPages.forEach((item,index)=>{
      //   switch (item.route){
      //     case 'pages/doctorMain/doctorMain':
      //         _this.backStatus+=1;
      //         break;
      //   }
      // })
      
    },
    methods: {
      ...mapActions(['checkLogin', 'getJournalQrCode','setVideoNum']),
      ...mapMutations(['setLoadingStatus', 'setShareMessage', 'setEnsureShow', 'setCommentNum', 'setCanvasShow', 'setJournalMessage', 'setBaseMessage']),
      getLike() {
        getLikeNumber({
          refId: localStorage.getItem('diaryId'),
          preferUpNum: this.count,
          customerId: localStorage.getItem('userId')
        })
      },
      /** 发送formId */
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      clickShareButton() {
        // clearInterval(_interval);
        this.shack = true;
        this.count += 1;
        this.recentLikeNum += 1
        this.popup = true;
        if (popupTimeOut) clearTimeout(popupTimeOut);

        // let timeRemaining = 3;
        // popupTimeOut = setTimeout(() => {
        //   timeRemaining = timeRemaining - 1;
        //   if (timeRemaining == 0) {
        //     this.popup = false;
        //     clearInterval(_interval);
        //   }
        // }, 1000);
        popupTimeOut = setTimeout(() => {
          this.popup = false;
        }, 3000);
        setTimeout(() => {
          this.shack = false;
        }, 500)
      },
      getCircleImage(url, w) {
        const ctx = wx.createCanvasContext('getCircleImage', this);
        // console.log(w)
        const res = wx.getSystemInfoSync();
        const platform = res.platform;
        let time = 0;
        if (platform === 'android') {
          // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
          time = 300;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(w / 2, w / 2, w / 2, 0, 2 * Math.PI)
        ctx.clip();
        ctx.drawImage(url, 0, 0, w, w)
        ctx.restore();

        if (platform === 'android') {
          // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
          time = 300;
        }
        // console.log(url)
        ctx.draw(false, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'getCircleImage',
              x: 0,
              y: 0,
              width: w,
              height: w,
              success: (res) => {
                // console.log("....")
                // console.log(res)
                this.setJournalMessage({
                  customerLogo: res.tempFilePath
                });
                this.clipFlag = false;
              },
              complete(res) {

              }
            }, this);
          }, 300)
        });
      },
      showCanvas() {
        dataLog.createTrack({
          actionId: 14196,
          pushMessageId: this.resourceId
        });
        this.setCanvasShow(true);
      },
      _mapHttpToHttps(rawUrl) {
        if (rawUrl.indexOf(':') < 0) {
          return rawUrl;
        }
        const urlComponent = rawUrl.split(':');
        if (urlComponent.length === 2) {
          if (urlComponent[0] === 'http') {
            urlComponent[0] = 'https';
            return `${urlComponent[0]}:${urlComponent[1]}`;
          }
        }
        return rawUrl;
      },
      getQr(obj) {
        // wx.showToast({
        //   title:"diaryId:"+obj.rId || obj.scene
        // });
        getJournalQrCode({
          diaryId: obj.rId || obj.scene
        }).then(data => {
          // console.log('====================')
          // console.log(data.responseObject.responseStatus)
          // console.log('====================')
          if (data.responseObject.responseStatus) {
            this.setJournalMessage({
              qrCode: data.responseObject.responseData.dataList[0].miniUrl
            });
          }
        });
      },
      // 处理年龄；
      getAge (num) {
        // console.log(num);
        let firstNum = parseInt(num/10);
        let twoNum = num % 10;
        if (firstNum) {
          if (twoNum <= 5) {
            if(twoNum == 0) {
              if(firstNum == 1){
                return `${firstNum}岁`
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
      getInfoHtml(obj) {
        let that = this;
        this.setLoadingStatus(true);
        api.ajax({
          url: XHRList.infoHtml,
          method: "POST",
          data: {
            diaryId: obj.rId || obj.scene,
            isValid: "1",
            visitSiteId: 24
          },
          done(res) {
            that.clipFlag = true;
            that.setLoadingStatus(false);
            if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              that.journalData = Object.assign(that.journalData, res.responseObject.responseData.dataList[0]);
              setTimeout( () => {
                that.parseShow = true;
              },0);
              if (that.journalData.operationList && that.journalData.operationList.length) {
                that.journalData.operationList.forEach((element) => {
                  that.journalData.operationString += element.operationName + " ";
                });
              };
              that.recentLikeNum = parseInt(that.journalData.preferUpNum);
              that.journalData.updateTime = that.journalData.releaseTime.substring(0, 10);
              // that.journalData.fullNameShow = that.journalData.fullName.length > 9 ? that.journalData.fullName.substring(0, 9) + "..." : that.journalData.fullName;  //主诊医师字符截取
              that.journalData.fullNameShow = that.journalData.fullName.length > 4 ? that.journalData.fullName.substring(0, 3) + "..." : that.journalData.fullName;
              that.journalData.authorNameShow = api.getByteLen(that.journalData.authorName) > 8 ? api.getStrByteLen(that.journalData.authorName,6) + "..." : that.journalData.authorName;
              that.journalData.patientAgeShow = that.getAge(that.journalData.patientAge);
              that.journalData.treatmentTimeShow = that.journalData.treatmentTime.substring(0, 10);
              that.journalData.browseNumShow = that.journalData.browseNum > 9999 ? that.journalData.browseNum.substring(0, 1) + '万+' : that.journalData.browseNum;
              that.setShareMessage({
                title: that.journalData.diaryName,
                num: that.journalData.shareNum
              });
              that.$forceUpdate();
              // that.getCircleImage(that.journalData.customerLogo, 100);
              // console.log((that.journalData.customerLogo && that.journalData.customerLogo.length > 0) ? that._mapHttpToHttps(that.journalData.customerLogo) : that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"))
              wx.downloadFile({
                url: (that.journalData.customerLogo && that.journalData.customerLogo.length > 0) ? that._mapHttpToHttps(that.journalData.customerLogo) : that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"),
                success: (res) => {

                  // console.log(res)
                  if (res.statusCode === 200) {
                    that.getCircleImage(res.tempFilePath, 100)
                  } else {
                    // console.log("??")
                    wx.downloadFile({
                      url: that._mapHttpToHttps("https://img00.allinmed.cn/common/chatting_portrait_system@2x.png"),
                      success: (_res) => {

                        if (_res.statusCode === 200) {
                          // console.log("??")
                          // console.log(_res)
                          that.getCircleImage(_res.tempFilePath, 100)
                        }
                      },
                      complete: (err) => {
                        console.log(err)
                      }
                    });
                  }
                }
              });
              that.setJournalMessage({
                authorName: that.journalData.authorName,
                authorLogoUrl: that.journalData.authorLogoUrl,
                diaryName: that.journalData.diaryName,
                fullName: that.journalData.fullName,
                medicalTitle: that.journalData.medicalTitle,
                company: that.journalData.company,
                customerUrl: that.journalData.customerLogo,
                content: that.journalData.shareGuide
              });


              that.setBaseMessage({
                resourceId: obj.rId || obj.scene,
                authorCustomerId: that.journalData.authorId,
              });
            }
          }
        })
      },
      // goToDoctor(doctorCustomerId) {
      //   if (!this.clickStatus) return;
      //   this.clickStatus = false;
      //   setTimeout(() => {
      //     this.clickStatus = true;
      //   }, 500);
      //   dataLog.createTrack({
      //     actionId: 14125,
      //   });
      //   console.log(`==============page============`)
      //   console.log(getcurrentPage())
      //   wx.navigateTo({
      //     url: `/pages/doctorMain/doctorMain?doctorCustomerId=${doctorCustomerId}&from=journal`
      //   })
      // },
      goDoctorMain(doctorCustomerId) {
        if (!this.clickStatus) return;
        this.clickStatus = false;

        setTimeout(() => {
          this.clickStatus = true;
        }, 500);
        dataLog.createTrack({
          actionId: 14126,
        });
        
        let _currenRout = false;
        let _currentPages = getCurrentPages();
        _currentPages.forEach((item,index)=>{
          if (item.route.indexOf('pages/doctorMain/doctorMain')>-1) {
            _currenRout =true;    //历史栈有医生主页   路由回退
          }
        })
        if (_currenRout) {
          wx.navigateBack({
              delta:1
          })
        } else {
          wx.navigateTo({
            url: `/pages/doctorMain/doctorMain?doctorCustomerId=${doctorCustomerId}&from=journal`
          })
        }
      },
      getUserInfo(e) {
        this.setLoadingStatus(true);
        if (e.target.userInfo) {
          //已授权...
          this.goDoctorMain(this.journalData.attendCustomerId);
          this.setLoadingStatus(false);
        } else {
          this.setEnsureShow(true);
          this.setLoadingStatus(false);
        }
      },
      goPersonal(e) {
        this.setLoadingStatus(true);
        if (e.target.userInfo) {
          //已授权...
          wx.navigateTo({
            url: '/pages/personal/personal'
          });
          this.setLoadingStatus(false);
        } else {
          this.setEnsureShow(true);
          this.setLoadingStatus(false);
        }
      }
    },
    computed: {
      ...mapState(['loading', 'customerId', 'commentNum', 'resourceId', 'journalMessage', 'canvasShow']),
      ...mapGetters(['videoNum'])
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .clearButtonStyle {
    display: inline-block;
    padding: 0;
    box-sizing: border-box;
    line-height: normal;
    border-radius: 8px;
    background: #F2F7F7;
    text-align: inherit;
    /*margin-bottom: 25px;*/
  }
  .doctorFixed {
    position: fixed;
    display: none;
    top: 0;
    left: 0;
    right: 0;
    height:82px;
    background:rgb(245,249,249);
    color:rgb(129,133,143);
    text-align: left;
    box-sizing: border-box;
    padding: 0 16px 0 16px;
    z-index: 2;
    &.show{
      display: block;
    }
    .doctorBox{
      width: 100%;
      height: 90px;
      left: 90px;
      @include ellipsis();
      .doctorFixedLogo{
        width: 48px;
        height: 48px;
        border-radius: 48px;
        vertical-align: middle;
      }
      .doctorFixedName{
        font-size:34px;
        font-weight:500;
        color:rgb(37,50,77);
        margin-left: 12px;
        vertical-align: baseline;
      }
      .doctorFixedOther{
        font-size:32px;
        color:rgb(129,133,143);
        margin-left: 18px;
        vertical-align: baseline;
      }
    }
  }
  .LikeSection {
    text-align: center;
    font-size: 32px;
    color: #444444;
    letter-spacing: 0;
    line-height: 32px;
    padding-bottom: 64px;
    padding-top: 24px;
    border-bottom: 2px solid #EBEDF0;
    .like {
      margin: 0 auto;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      border: 1px solid #FC746A;
      .likeIcon {
        width: 50px;
        height: 50px;
        position: relative;
        top: -15px;
        &.shacking {
          animation: shack 0.5s linear;
          -webkit-animation: shack 0.5s linear;
        }
      }
      p {
        color: #FC746A;
        font-size: 24px;
        position: relative;
        bottom: 42px;
      }
    }
    p {
      margin-top: 26px;
    }
    h1 {
      width: 200px;
      vertical-align: middle;
      font-family: 'Open Sans', sans-serif;
      position: relative;
      color: #FF4234;
      font-size: 40px;
      background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(#FFB736), to(#FF4234));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      left: 80px;
      top: 30px;
      opacity: 0;
      font-weight: 900;
      box-sizing: border-box;
      padding: 5px;
      img {
        width: 90px;
        height: 55px;
        top: 7px;
        position: relative;
        left: -15px;
      }
      &.popup {
        animation: popup 0.5s linear forwards;
        -webkit-animation: popup 0.5s linear forwards;
      }
    }
  }

  .ji_main {
    background: #ffffff;
    padding: 0 30px 40px;
    .ji_title {
      line-height: 62px;
      font-size: 46px;
      color: #000000;
      padding-top: 12px;
      font-weight: bold;
    }
    .ji_updateTime {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .ji_patientInfo {
        .patientLogo {
          width: 66px;
          height: 66px;
          margin-right: 16px;
          vertical-align: middle;
          border-radius: 50%;
        }
        .patientName {
          display: inline-block;
          font-size: 30px;
          color: #666666;
          vertical-align: middle;
          margin-right: 20px;
        }
        .patientAge{
          padding: 0 12px;
          background:rgba(0,185,173,0.1);
          border-radius:2px;
          font-size:28px;
          color:rgb(0,185,173);
          vertical-align: middle;
        }
      }
      .updateTime {
        font-size: 28px;
        color: #AAAAAA;
      }
    }
    .ji_patientDetail {
      margin-top: 80px;
      font-size: 34px;
      color: #333333;
      li {
        margin-bottom: 20px;
        span {
          margin-right: 16px;
        }
      }
    }
    .audioOut{
      padding-top: 65px;
      padding-bottom: 20px;
    }
    .audioBox {
      height:78px;
      background:rgb(245,249,249);
      border-radius:4px;
      display: flex;
      align-items: center;
      .audioStatus{
        margin: 0 0 0 24px;
        width:42px !important;
        height:42px;

      }
      .audioText{
        margin-left: 12px;
        font-size:30px;
        color:rgb(2,181,172);
      }
    }
    .audioOut + .ji_patientDes-box{
      .ji_patientDes{
        padding-top: 0px;
      }
    }
    .ji_patientDes {
      padding-top: 65px;
      h3 {
        width: 100%;
        margin-top: 70px;
        font-weight: bold;
        font-size: 36px;
        color: #222222;
        white-space: normal !important;
        word-break: break-all;
        word-wrap: break-word;
      }
      .p, .span {
        width: 100%;
        /*margin-top: 40px;*/
        font-size: 34px;
        color: #333333;
        line-height: 64px;
        white-space: normal !important;
        word-break: break-all;
        word-wrap: break-word;
      }
      .videoStyleOrder {
        width: 100%;
        height: 380px;
        margin: 40px 0;
        position: relative;
        .videoPlayBox {
          width: 100%;
          height: 380px;
          background-color: black;
          @include iphoneX() {
            object-fit: cover;
          }
        }
        .img-preview {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          width: 100% !important;
          height: 100% !important;
          z-index: 2;
        }
        .videoPlayBtn {
          display: block;
          margin: 0 !important;
          width: 144px !important;
          height: 144px;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 3;
          transform: translate(-50%, -50%);
        }
      }
      image {
        display: block !important;
        width: 100% !important;
        margin: 40px 0;
      }
    }
    .ji_bottomMsg {
      height: 56px;
      margin: 40px 0;
      padding-bottom: 60px;
      display: flex;
      justify-content: space-between;
      flex-direction:row-reverse;
      align-content: center;
      border-bottom: 1px solid #EBEDF0;
      //@include clearfix();
    }
    .ji_browseNum {
      font-size: 28px;
      margin-top: 12px;
      color: #AAAAAA;
    }
    .addJournal{
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
        color: rgb(0,185,173);
      }
    }
    .share-btn {
      line-height: 1;
      & > p {
        font-size: 30px;
        color: #506C85;
        display: inline-block;
        vertical-align: middle;
        margin-left: 12px;
      }
      & > .icon-share {
        display: inline-block;
        vertical-align: middle;
        width: 44px;
        height: 44px;
        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
    }
    .doctorInfo {
      box-sizing: border-box;
      /*margin-top: 56px;*/
      .doctorInfo-title {
        font-size: 30px;
        font-weight: normal;
        color: #777777;
        h2 {
          display: inline-block;
          vertical-align: middle;
          &:before {
            display: inline-block;
            content: "";
            width: 4px;
            height: 26px;
            margin-right: 10px;
            background: #00B9AD;
            border-radius: 100px;
            vertical-align: -2px;
          }
        }
      }
      &.content {
        width: 100%;
        position: relative;
        // border: 2px solid #B5E9E6;
        border-radius: 8px;
        padding: 26px 24px;
        font-size: 0;
        margin-top: 20px;
        .logoUrl {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          margin-right: 24px;
          display: inline-block;
          vertical-align: middle;
          & > img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            vertical-align: top;
          }
        }
        .message {
          display: inline-block;
          vertical-align: middle;
          .doctorName {
            font-size: 34px;
            // line-height: 1;
            color: #25324D;
            display: inline-block;
            /*vertical-align: middle;*/
            font-weight: bold;
          }
          .doctorLevel {
            font-size: 30px;
            line-height: 1;
            color: #9DA3AF;
            margin-left: 20px;
            display: inline-block;
            /*vertical-align: middle;*/
          }
          .hospital {
            font-size: 30px;
            line-height: normal;
            color: #25324D;
            max-width: 370px;
            margin-top: 11px;
            @include ellipsis();
          }
        }
        .ji-consultDoc {
          position: absolute;
          color: #2EA9FE;
          font-size: 28px;
          width: 132px;
          height: 46px;
          border: 1px solid #2EA9FE;
          border-radius: 4px;
          right: 20px;
          top: 50%;
          margin-top: -23px;
          text-align: center;
          line-height: 46px;
        }
      }
    }
  }

  .getCircleImage {
    display: block;
    opacity: 0;
    visibility: hidden;
    position: fixed;
    z-index: -1;
  }

  @keyframes shack {
    0% {
      transform: scale(1)
    }
    50% {
      transform: scale(1.5)
    }
    100% {
      transform: scale(1)
    }
  }

  @keyframes popup {
    0% {
      opacity: 0;
    }
    25% {
      opacity: 0.25;
      transform: translate(10px, -18px);
    }
    50% {
      opacity: 0.5;
      transform: translate(10px, -25px);
    }
    75% {
      opacity: 0.75;
      transform: translate(10px, -38px);
    }
    100% {
      opacity: 1;
      transform: translate(10px, -50px);
    }
  }
</style>
