<template>
    <section class="person">
        <Share ref="share" @success="onCreateSuccess"> </Share>
        <TelephoneVerify ref="verify" @success="onChangeTelephoneSuccess"></TelephoneVerify>
        <section v-if="attentionFlag" class="attention">
          <section class="content">
            <div class="info">
              <p>同一个就诊人每日仅可预约5个号源</p>
              <p class="tips">详细规则请见<span class="nav" @click="attentionNav">预约须知</span></p>
            </div>
            <div class="submit-box">
              <form class="confirm" @click="confirm"><button>知道了</button></form>
            </div>
          </section>
        </section>
        <section class="person-title">
            <span>今日：{{now}}</span>
        </section>
        <section class="person-order">
            <h3>挂号信息</h3>
            <div class="order-info">
                <div class="order-item">
                    <span>就诊科室</span>
                    <span class="order-content">重庆唯医骨科医院-{{deptName}}</span>
                </div>
                <div class="order-item">
                    <span>就诊医生</span>
                    <span class="order-content">{{doctorName}} {{medicalTitle}}</span>
                </div>
                <div class="order-item no-border">
                    <span>就诊日期</span>
                    <span class="order-content">{{regDate}} {{week}} {{clinicDuration}}</span>
                </div>
                <!-- <div class="order-item no-border">
                    <span>医事服务费</span>
                    <span class="order-content">¥{{cost}}</span>
                </div> -->
            </div>
        </section>
        <section class="person-order add-info">
            <h3>填写相关信息完成预约</h3>
            <div class="order-info">
                <div id="patient" class="order-item" @click="personList">
                    <span>就诊人</span>
                    <span class="order-content">{{patientName}}
                        <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_info_go.png">
                    </span>
                </div>
                <div class="order-item">
                    <span>身份证</span>
                    <!-- <span class="order-content">{{IDCard}}</span> -->
                    <input v-if="!IDCardStatus" @blur="idCardvalid" class="order-content idcard" type="text" placeholder="就诊人身份证号" v-model="IDCard">
                    <input v-if="IDCardStatus" class="order-content idcard" type="text" placeholder="就诊人身份证号" v-model="IDCard" disabled>
                </div>
                <div class="order-item no-border" @click="verifyShow">
                    <span>手机号</span>
                    <button class="order-content-btn" >{{phone}}
                        <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/order_info_go.png">
                    </button>
                </div>
                <div class="order-item no-border phone-sure">
                    <span>(请确保手机号为本人号码)</span>
                </div>
            </div>
        </section>
        <section class="person-btn">
            <form class="person-order-btn" @submit="formSubmit" report-submit="true">
                <span v-if="!infoFlag">
                  <button class="disabled" v-if="cost === 0">免费预约{{type}}</button>
                   <button class="disabled" v-else>免费预约{{type}}</button>
                </span>
                <span v-if="infoFlag">
                  <button @click="goSuccess" v-if="cost === 0">免费预约{{type}}</button>
                   <button @click="goSuccess" v-else>免费预约{{type}}</button>
                </span>
               
            </form>
        </section>
        <!-- 就诊人列表 -->
        <section id="person" class="persons" v-if="showPersonList" @click="personList">
            <div class="tit">
              <img src="https://m.allinmed.cn/static/image/mp/index/1.5.0/patient.png">
              选择就诊人
            </div>
            <section class="person-list">
                <div 
                  v-for="(item,index) in personListData"
                  :key="index"
                  class="person-item"
                  @click="choosePerson(item)"
                >
                  <span class="person-item-name">{{item.patientName}}</span>
                  <span class="person-item-sex">{{ item.patientSex == 1 ? '男' : '女'}}</span>
                  <span class="person-item-age">{{ item.patientAge }}岁</span>
                  <form v-if="item.idcardStatus != 1" class="person-item-edit">
                    <button @click="goEditPerson(item)">编辑</button>
                  </form>
                  <span v-if="item.idcardStatus == 1" class="person-item-tips">已实名认证，不可更改</span>
                </div>
            </section>
            <section class="add-person"> 
              <form class="add-person-btn">
                <button @click="goAddPerson">添加就诊人</button>
              </form>
            </section>
        </section>
    </section>
</template>
<script>
/*
  * @Desc:预约详情
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by ljx on  2019/6/3
  *
  */

import sendFormId from "common/js/HttpRequest/sendFormId";
import localStorage from "localStorage";
import Share from "components/share";
import TelephoneVerify from "components/telephoneVerify";
import api from 'common/js/util/util';
import dataLog from "dataLog";

const personApiList = {
  getPatientList: api.httpEnv() + '/mcall/customer/patient/relation/v1/getPatientList/',
  addRegister: api.httpEnv() + '/mcall/tocure/register/basic/addRegister/',
  updatePerson: api.httpEnv() + '/mcall/customer/patient/relation/v1/update/'
}

export default {
  data () {
    return {
      now: new Date(),
      deptName: '骨一科',
      deptCode: '',
      doctorCode: '',
      doctorName: '医生姓名',
      medicalTitle: '医生职称',
      regDate: '就诊日期',
      clinicDuration: '就诊时间',
      week: '就诊星期',
      cost: 0,
      personListData: [],
      showPersonList: false,
      patientName: '选择就诊人',
      IDCard: '',
      IDCardStatus: false,
      phone: '',
      patientId: 0,
      customerId: '',
      doctorId: 0,
      doctorCode: 0,
      hbTime: '',
      hospitalAddress: '',
      hospitalCode: 2901349,
      attentionFlag: false,
      infoFlag: true,
      firstFlag: true
    }
  },
  onLoad (option) {
    dataLog.enterBrowse();
    var _this = this;
    const info = JSON.parse(decodeURIComponent(option.query));
    this.clinicDuration = info.clinicDuration;
    this.deptCode = info.deptCode;
    this.deptName = info.deptName;
    this.doctorId = info.doctorId || 1522654229281;
    this.doctorCode = info.doctorCode || 8000017;
    this.medicalTitle = info.medicalTitle || this.medicalTitle;
    this.regDate = info.regDate;
    this.hbTime = info.hbTime;
    this.week = this.getWeek(this.regDate);
    this.cost = info.cost;
    this.doctorName = info.doctorName;
    this.IDCard = '';
    this.hospitalAddress = info.hospitalAddress;
    this.now = this.getDay();
    try {
      this.customerId = wx.getStorageSync('userId')
    } catch (e) {
      // Do something when catch error
    }
    // this.init(this);
  },
  onHide() {dataLog.leaveBrowse();},
  onShow() {
    this.init(this);
    let patientInfo = {};
    try { patientInfo = JSON.parse(wx.getStorageSync('patientInfo')) } catch (e) { }
    this.patientId = patientInfo.patientId || 0;
    this.patientName = patientInfo.patientName || '选择就诊人';
    this.phone = patientInfo.mobile || '';
    this.IDCard = patientInfo.certificateCode || '';
    this.IDCardStatus = false;
    this.showPersonList = false;
    this.$refs.verify && this.$refs.verify.cancle();
    // if (this.infoJudge()) this.infoFlag = true;
    this.$refs.share && this.$refs.share.close();
  },
  components: {
    Share,
    TelephoneVerify
  },
  methods: {
    init(_this) {
      wx.showLoading({ title: "正在加载..." });
      api.ajax({
        url: personApiList.getPatientList,
        method: "POST",
        data: {
          customerId: _this.customerId,
          isValid: "1",
          firstResult: "0",
          maxResult : "9999"
        },
        done(response) {
          wx.hideLoading();
          if (
            response &&
            response.responseObject &&
            response.responseObject.responseData &&
            response.responseObject.responseData.dataList &&
            response.responseObject.responseData.dataList.length > 0) {
            let dataList = response.responseObject.responseData.dataList;
            _this.personListData = dataList ;
            if (dataList.length == 1) {
              _this.patientName =  dataList[0].patientName;
              _this.IDCard = dataList[0].certificateCode;
              _this.phone = dataList[0].mobile;
              _this.patientId = dataList[0].patientId;
              _this.IDCardStatus = dataList[0].idcardStatus == "1" ? true : false;
              // _this.infoFlag = true;
            } else {
              if (_this.firstFlag) {
                _this.showPersonList = true;
              } else {
                _this.showPersonList = false;
              }
              try {
                var value = wx.getStorageSync('mobile');
                if (value) { _this.phone = value; }
              } catch (e) { console.log(e); }
            }
          }else {
            if (_this.firstFlag) {
              wx.navigateTo({ url: '/packageD/registration/orderAddPerson' });
            } else {
              _this.patientName = '添加就诊人';
            }
          }
        }
      })
    },
    idCardvalid() {
      // if (this.IDCard != '') {
      //   if (this.infoJudge()) this.infoFlag = true;
      // } else {
      //   this.infoFlag = false;
      // }
    },
    /** 发送formId */
    formSubmit (e) { sendFormId(e.target.formId); },
    getWeek (date) {
        let weekDay = ['星期日', '星期一','星期二','星期三','星期四','星期五','星期六']
        // let day = `${year}/${month}/1`
        let myDate = new Date(date)
        return weekDay[myDate.getDay()]
    },
    getDay () {
        let date = new Date()
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month < 10 ? '0' + month : month
        day = day < 10 ? '0' + day : day
        return `${year}-${month}-${day}`
    },
    goAddPerson () {
      this.firstFlag = false;
      dataLog.createTrack({ actionId: 14252});
      wx.navigateTo({ url: '/packageD/registration/orderAddPerson'});
    },
    goEditPerson (person) {
      this.firstFlag = false;
      dataLog.createTrack({ actionId: 14251 });
      wx.navigateTo({ url: '/packageD/registration/orderEditPerson?query='+JSON.stringify(person) });
    },
    goSuccess() {
      // this.infoFlag = false;
      this.firstFlag = false;
      var _this = this;
      wx.showLoading({ title: "正在加载..." });
      dataLog.createTrack({ actionId: 14258 });
      const param = {
        patientCustoemerId: this.customerId,
        patientId: this.patientId,
        patientName: this.patientName,
        idCard: this.IDCard,
        doctorId: this.doctorId,
        doctorCode: this.doctorCode,
        doctorName: this.doctorName,
        hospitalCode: this.hospitalCode,
        deptCode: this.deptCode,
        deptName: this.deptName,
        regDate: this.regDate,
        // regDate: '2019-06-21',
        hbTime: this.hbTime,
        clinicDuration: this.clinicDuration,
        MedicalTitle: this.medicalTitle
      }

      if (this.patientId == 0 || this.IDCard == '' || this.phone == '') {
        wx.hideLoading();
        this.confirmModal('请补齐就诊人信息');
        return false;
      }
      // _this.savepic();
      // return false;
      api.ajax({
        url: personApiList.updatePerson,
        method: "POST",
        data: {
          patientId: this.patientId,
          customerId: this.customerId,
          certificateId: 1,
          certificateCode: this.IDCard,
          patientName: this.patientName
        },
        done(response) {
          // _this.infoFlag = true;
          if (response && response.responseObject.responseStatus) {
            const res = response.responseObject.responseData;
            api.ajax({
              url: personApiList.addRegister,
              method: "POST",
              data: param,
              done(response) {
                wx.hideLoading();
                if (
                  (response && response.responseObject.responseStatus) || 
                  (response.responseObject.responseCode == "10002" && response.responseObject.responseStatus)
                ) {
                  const res = response.responseObject.responseData;
                  _this.savepic();
                } else if (response && response.responseObject.responseCode == "10001") {
                  _this.confirmModal('身份证号有误', _this.resultFlag, false);
                } else if (response && response.responseObject.responseCode == "10003") {
                  _this.attentionFlag = true;
                  _this.showPersonList = false;
                } else if (response && response.responseObject.responseCode == "10006") {
                  _this.confirmModal('当前时间已过上午/下午，不能挂号', _this.resultFlag, false);
                } else if (response && response.responseObject.responseCode == "10004") {
                  _this.confirmModal('号源已用完', _this.resultFlag, false);
                } else {
                  _this.confirmModal('挂号失败', _this.resultFlag, false);
                }
              }
            })
          } else if (response && response.responseObject.responseCode == "303") {
            _this.confirmModal('当前账号已多次身份证校验未通过，请明日再试');
          } else  {
            _this.confirmModal('身份证号有误');
          }
        }
      })
    },
    personList(e) {
      dataLog.createTrack({ actionId: 14246 });
      if (this.personListData.length == 0 && !this.firstFlag) {
        wx.navigateTo({ url: '/packageD/registration/orderAddPerson' });
      } else {
        if (e.target.id == "person") this.showPersonList = false;
        if (e.currentTarget.id == "patient") this.showPersonList = true;
      }
    },
    savepic() {
      const params = {
        width: 702,
        height: 922,
        backgroundUrl: 'https://m.allinmed.cn/static/image/mp/index/1.5.0/sharebg.png',
        texts: [
          {
            x: 478,
            y: 146,
            text: '预约成功',
            fontSize: 48,
            color: '#272727'
          },
          {
            x: 96,
            y: 260,
            text: '姓名',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 670,
            y: 260,
            text: this.patientName,
            textAlign: 'right',
            fontSize: 30,
            color: '#222'
          },
          {
            x: 150,
            y: 370,
            text: '身份证号',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 670,
            y: 370,
            text: this.IDCard,
            textAlign: 'right',
            fontSize: 30,
            color: '#222'
          },
          {
            x: 150,
            y: 470,
            text: '就诊科室',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 670,
            y: 470,
            text: this.deptName,
            textAlign: 'right',
            fontSize: 30,
            color: '#222'
          },
          {
            x: 150,
            y: 570,
            text: '就诊时间',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 670,
            y: 570,
            text: this.regDate + ' ' + this.clinicDuration,
            textAlign: 'right',
            fontSize: 30,
            color: '#222'
          },
          {
            x: 150,
            y: 680,
            text: '医院地址',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 670,
            y: 680,
            text: '重庆市百灵路1号金易E世界4栋',
            textAlign: 'right',
            fontSize: 30,
            color: '#222'
          },
          {
            x: 650,
            y: 790,
            text: '请您在就诊当日凭本人有效身份证件到一层服',
            fontSize: 30,
            color: '#888'
          },
          {
            x: 200,
            y: 830,
            text: '务台取号。',
            fontSize: 30,
            color: '#888'
          }
        ],
        leftButton: {
          type: "save",
          text: "保存本页图片",
          flag: true,
          actionId: 14253
        },
        rightButton: {
          type: "relaunch",
          text: "我的预约挂号",
          url: "/pages/mIndex/mIndex?from=shareFriend&path=/packageD/registration/myOrderList",
          flag: true,
          actionId: 14254
        }
      }
      this.$refs.share.create(params);
    },
    verifyShow() {
      dataLog.createTrack({ actionId: 14247 });
      this.$refs.verify.show(this.patientId);
    },
    choosePerson(person) {
      this.patientName =  person.patientName;
      this.IDCard = person.certificateCode;
      this.phone = person.mobile;
      this.patientId = person.patientId;
      this.IDCardStatus = (person.idcardStatus == "1") ? true : false;
      this.showPersonList = false;
      // if (this.infoJudge()) this.infoFlag = true;
    },
    onChangeTelephoneSuccess(data) { 
      this.phone = data.mobile || this.phone;
      // if (this.infoJudge()) this.infoFlag = true;
    },
    confirm() { this.attentionFlag = false; },
    attentionNav() { wx.navigateTo({url: '/packageD/registration/orderRule'}); },
    confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
      var _this = this;
      if (!this.modalFlag) {
        this.modalFlag = true;
        wx.showModal({
          content: info || "出错了",
          showCancel: cancleFlag || false,
          confirmText: '知道了',
          confirmColor: '#333',
          success: function (res) {
            _this.modalFlag = false;
            if (res.confirm) {
              callbackFlag && (callbackFlag = callbackFlagVal);
            }
          }
        })          
      }

    },
    infoJudge() { return (this.phone != '' && this.IDCard != '' && this.patientId != 0);}
  }
}
</script>
<style lang="scss" scoped>
  .person {
      width: 750px;
      height: 100%;
      background-color: #f2f5f7;
      overflow: scroll;
      .attention {
        width: 750px;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.7);
        text-align: center;
        z-index: 99;
        .content {
          width: 640px;
          height: 260px;
          background-color: #fff;
          border-radius: 16px;
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -320px;
          margin-top: -260px;
          padding-top: 64px;
          text-align: center;
          p {
            text-align: center;
            line-height: 40px;
            font-size: 32px;
            color: #333;
            .nav {
              width: 134px;
              color: #27ACF7;
              border-bottom: 1px solid #27ACF7;
            }
          }
          .submit-box {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 640px;
            height: 100px;
            border-top: 1px solid #DFDFDF;
            form {
              width: 100%;
              height: 100px;
              background-color: #fff;
              border-radius: 0 0 16px 16px;
              button {
                background-color: #fff;
                font-size: 32px;
                color: #27ACF7;
                border-radius: 0 0 16px 16px;
              }
            }
          }
        }
      }
      .person-title {
          height: 74px;
          text-align: center;
          line-height: 74px;
          color: #777;
          font-size: 28px;
          // border: 1px solid red;
      }
      .person-order {
          height: 380px;
          margin: 0 24px;
          background-color: #fefefe;
          border-radius: 8px;
          h3 {
              height: 86px;
              text-align: left;
              line-height: 86px;
              padding-left: 30px;
              color: #222;
              font-size: 32px;
              border-bottom: 2px solid #f1f1f1;
              font-weight: 500;
          }
          .order-info {
              width: 642px;
              height: 352px;
              margin: 9px 30px;
              // border: 1px solid goldenrod;
              .order-item {
                  width: 642px;
                  height: 88px;
                  line-height: 88px;
                  border-bottom: 2px solid #f5f5f6;
                  span {
                      height: 88px;
                      line-height: 88px;
                      color: #888;
                      font-size: 30px;
                      // border: 1px solid hotpink;
                      img {
                          width: 26px;
                          height: 26px;
                      }
                  }
                  .order-content {
                      color: #222;
                      float: right;
                      &.idcard {
                        width: 350px;
                        height: 88px;
                        text-align: right;
                        font-size: 30px;
                        line-height: 88px;
                        padding-right: 10px;
                      }
                  }
                  button {
                      // width: 256px;
                      height: 88px;
                      float: right;
                      text-align: right;
                      padding-right: 0;
                      line-height: 88px;
                      font-size: 30px;
                      background-color: #fff;
                      border-radius: 0;
                      img {
                          width: 26px;
                          height: 26px;
                          // border: 1px solid red;
                      }
                  }
                  button::after {
                      color: #222;
                      background: none;
                      border: none;
                      border-radius: 0;
                  }
              }
              .no-border {
                  border: none;
              }
              .phone-sure {
                  // border: 1px solid red;
                  height: 44px;
                  line-height: 44px;
                  margin-top: -22px;
                  span {
                      height: 44px;
                      line-height: 44px;
                      color: #888;
                      font-size: 30px;
                  }
              }
          }
      }
      .add-info {
          height: 414px;
          margin-top: 20px;
      }
      .person-info {
          height: 414px;
          margin: 0 24px;
          margin-top: 20px;
          border: 1px solid green;

      }
      .person-btn {
          width: 750px;
          height: 92px;
          margin-top: 60px;
          // border: 1px solid red;
          .person-order-btn {
              width: 476px;
              height: 92px;
              text-align: center;
              button {
                  width: 476px;
                  height: 92px;
                  border: none;
                  background-color: #2ea9fe;
                  line-height: 92px;
                  font-size: 32px;
                  color: #fff;
                  font-weight: 500;
                  &.disabled {
                    color: #fff;
                    background-color: #ccc;
                  }
                  &:focus {
                    background-color: #237FBF;
                  }
                  &:active {
                    background-color: #237FBF;
                  }
              }
          }
      }
      .persons {
          overflow: hidden;
          width: 750px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 100;
          background-color: rgba(0, 0, 0, 0.35);
          .tit {
            position: absolute;
            z-index: 2;
            left: 0;
            bottom: 646px;
            width: 100%;
            height: 92px;
            font-size: 28px;
            color: #333;
            line-height: 92px;
            text-align: center;
            background-color: #fff;
            img {
              left:50%;
              margin-left:-110px;
              top: 32px;
              position: absolute;
              width:34px;
              height: 28px;
            }
          }
          .person-list {
              overflow: auto;
              width: 750px;
              height: 428px;
              max-height: 428px;
              position: absolute;
              left: 0;
              bottom: 120px;
              padding: 22px 48px 90px 48px;
              background-color: #fff;
              border-radius: 8px 8px 0 0;
              .person-item {
                  width: 584px;
                  height: 46px;
                  margin-top: 30px;
                  line-height: 46px;
                  padding: 30px 30px 30px 40px;
                  background-color: #f2f5f7;
                  border: 2px solid #e5ebee;
                  border-radius: 8px;
                  span {
                      color: #08112b;
                      font-size: 32px;
                      line-height: 32px;
                  }
                  .person-item-name {
                    display:inline-block;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                    max-width: 200px;
                    font-weight: 500;
                    font-size: 36px;
                  }
                  .person-item-sex {
                    color: #656C7C;
                    height:46rpx;
                    line-height:46rpx;
                    font-size:30rpx;
                    margin-left: 10px;
                  }
                  .person-item-age {
                    color: #656C7C;
                    height:46rpx;
                    line-height:46rpx;
                    font-size:30rpx;
                    margin-left: 10px;
                  }
                  .person-item-edit {
                    font-weight: 500;
                    float: right;
                    margin-top: 0;
                    button {
                      // position: static;
                      background-color: #f2f5f7;
                      height: 46px;
                      line-height: 46px;
                      font-size: 30px;
                      color: #27acf7;
                      padding: 0;
                    }
                  }
                  .person-item-tips {
                    color: #AAB0B9;
                    float: right;
                    font-size: 24px;
                    line-height: 46px;
                  }
              }
          }
          .add-person {
              width: 100%;
              margin-top: 32px;
              text-align: center;
              padding-bottom: 44px;
              background-color: #FFF;
              position: absolute;
              bottom: 0;
              .add-person-btn {
                  display:block;
                  width: 584px;
                  height: 46px;
                  margin: 0 auto;
                  text-align:center;
                  border-radius: 8px;
                  border: 1px solid #27ACF7;
                  padding: 30px 30px 30px 40px;
                  button {
                      position: relative;
                      display: inline-block;
                      color: #27acf7;
                      height: 46px;
                      line-height: 46px;
                      font-size: 30px;
                      background-color: #FFF;
                      width: 330px;
                      margin: 0 auto;
                      &:before {
                          content: '';
                          width: 26px;
                          height: 4px;
                          background: #27acf7;
                          position: absolute;
                          top: 20px;
                          left: 50px;
                          transform: rotate(90deg);
                      }
                      &:after {
                          content: '';
                          width: 54px;
                          height: 8px;
                          background: #27acf7;
                          position: absolute;
                          top: 20px;
                          left: 50px;
                      }
                  }
              }
          }
      }
  }
</style>
