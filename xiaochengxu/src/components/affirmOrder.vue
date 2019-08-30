<template>
  <section class="ao_main" :class="{hideScroll:choiceCouponShow}">
    <section class="ao_fromDoctor" v-if="pageFrom == 'findDoctor'">
      <medicalReportEnsure :medicalParams="medicalParams" :doctorInfo="doctorInfoString"></medicalReportEnsure>
      <ul class="fd_orderInfo">
        <li><span class="fd_orderItemLeft">咨询费</span><p class="fd_orderItemRight fd_orderItemPrice">￥ {{priceMessage.generalPrice}}</p></li>
        <li><span class="fd_orderItemLeft">优惠券</span><p class="fd_orderItemRight fd_orderItemCoupon" @click="getCouponList(1);getCouponList(2);choiceCouponShow=true;"><span v-show="couponId">已选 </span>{{couponName}}</p></li>
        <li><span class="fd_orderItemLeft fd_orderItemExplain">服务说明</span><p class="fd_orderItemRight fd_orderItemExplain" @click="serviceShow=true"><span>过期退款</span><span>{{priceMessage.generalTimes}}次医生回答</span></p></li>
      </ul>
      <footer class="fd_orderSubmit">
        <span class="fd_ActualMoney">￥{{showActualMoney}}</span>
        <span class="fd_goSubmit" @click="submitStatus && beforePay()">提交咨询单</span>
      </footer>
    </section>
    <section class="ao_fromOther" v-else>
      <section class="ao_docBox">
        <figure class="ao_doxInfo">
          <figcaption class="ao_docIcon"><img :src="doctorIcon"></figcaption>
          <section class="ao_docDetails">
            <div class="ao_docNameTitle"><span class="ao_docName">{{doctorInfo.fullName}}</span><span class="ao_docTitle">{{medicalTitle}}</span></div>
            <div class="ao_docHospitalDivision"><span class="ao_docHospital">{{doctorInfo.company}}</span><span class="ao_docDivision">{{doctorInfo.platformId==1?'骨科':'手外科'}}</span></div>
          </section>
        </figure>
        <section class="ao_inquiryTypeBox">
          <h2 class="ao_imgInquiry">
            <span class="ao_inquiryTitle">图文咨询</span>
            <span class="ao_inquiryMoney">{{priceMessage.generalPrice}}<i>元</i></span>
          </h2>
          <div class="ao_inquiryUnder"></div>
          <ul class="ao_doxCando" v-if="caseType == '15'">
            <li>1.美年健康体检咨询，本次医生在线咨询免费</li>
            <li>2.本次问诊医生回复次数不限</li>
          </ul>
          <ul class="ao_doxCando" v-else>
            <li>1.咨询5天有效,可获得医生{{priceMessage.generalTimes}}次回答；</li>
            <li>2.医生48小时未接诊全额退款；</li>
          </ul>
        </section>
      </section>
      <section class="ao_coupon" v-if="caseType != '15'">
        <span class="ao_couponLeft"><i>优惠券</i></span>
        <span class="ao_couponRight" @click="getCouponList(1);getCouponList(2);choiceCouponShow=true;">{{couponName}}</span>
      </section>
      <footer class="ao_btnBox">
        <span class="ao_money">实付款:<i>￥{{showActualMoney}}</i></span><span class="ao_submit" @click="submitStatus && beforePay()">提交订单</span>
      </footer>
    </section>
    <section class="ao_couponMasker" ref="couponMasker" v-if="choiceCouponShow" @click="choiceCouponShow=false">
      <figure class="ao_couponMaskerMain" @click.stop="">
        <figcaption class="mm_header"><span class="mm_title">优惠券</span><span class="mm_instructions" @click.stop="instructionsShow=true">使用说明</span><i class="mm_icon_close" @click="choiceCouponShow=false"></i></figcaption>
        <section class="mm_main">
          <ul class="mm_useTab">
            <li :class="{active:tabIndex==0}" @click.stop="tabIndex=0">可使用({{enableCouponList.length}})</li>
            <li :class="{active:tabIndex==1}" @click.stop="tabIndex=1">不可使用({{unenableCouponList.length}})</li>
          </ul>
          <div class="mm_CDkey"><input type="text" placeholder="请输入优惠码" class="mm_CDkeyInput" v-model="couponNum" @input.stop="inputFn()"><button class="mm_CDkeyBtn" @click.stop="exchangeCDkey">兑换</button></div>
          <section class="mm_useContent">
            <div class="mm_useItem" v-show="tabIndex==0">
              <ul class="mm_useYesLists" :class="{'mm_ipad':isIPad}" v-if="enableCouponList.length>0">
                <li class="mm_useYesItem" v-for="(item , index) in enableCouponList" :key="index" @click.stop="changeCoupon(item)">
                  <figure class="mm_couponInfoBox">
                    <h4 v-if="item.ruleType == 2">免费咨询</h4>
                    <h4 v-if="item.ruleType == 1">￥<span>{{item.discountAmount}}</span></h4>
                    <section class="mm_couponInfo">
                      <div class="mm_couponName">{{item.promotionName}}</div>
                      <div class="mm_couponIndate">
                        <span v-if="item.infoTimeType == 0">有效期：长期有效</span>
                        <span v-else>有效期：{{item.threeFree?"长期有效":item.promotionEndtime}}</span>
                      </div>
                      <!--<div class="mm_couponLimit" v-if="item.limitContent&&Object.keys(item.limitContent)!=0">{{item.limitContent}}</div>-->
                      <!--<i class="mm_icon_unfold" v-if="item.limitContent&&Object.keys(item.limitContent)!=0" :class="{rotate:item.isValid == 0}" @click.stop="item.isValid==0?item.isValid=1:item.isValid=0"></i>-->
                    </section>
                    <span class="mm_couponStatus" :class="{on:item.selected}"></span>
                  </figure>
                  <!--<article class="mm_couponExplain" v-show="item.isValid == 0">-->
                    <!--<p>{{item.promotionDesc}}</p>-->
                  <!--</article>-->
                </li>
              </ul>
              <section class="mm_noCoupon" :class="{'mm_ipad':isIPad}" v-if="enableCouponList.length==0">
                <img src="https://m.allinmed.cn/static/image/img00/findDoctor/coupon_none.png" alt="">
                <span>暂无可用优惠券，如有优惠码请先兑换</span>
              </section>
            </div>
            <div class="mm_useItem" v-show="tabIndex==1">
              <ul class="mm_useYesLists" :class="{'mm_ipad':isIPad}">
                <li class="mm_useYesItem" v-for="(item, index) in unenableCouponList" :key="index">
                  <figure class="mm_couponInfoBox">
                    <h4 v-if="item.ruleType == 2">免费咨询</h4>
                    <h4 v-if="item.ruleType == 1">￥<span>{{item.discountAmount}}</span></h4>
                    <section class="mm_couponInfo">
                      <div class="mm_couponName">{{item.promotionName}}</div>
                      <div class="mm_couponIndate">
                        <span v-if="item.infoTimeType == 0">有效期 长期有效</span>
                        <span v-else>有效期至 {{item.promotionEndtime}}</span>
                      </div>
                      <!--<div class="mm_couponLimit colorRed" v-if="item.limitDesc">{{item.limitDesc}}</div>-->
                      <!--<i class="mm_icon_unfold" v-if="item.limitDesc&&Object.keys(item.limitDesc)!=0" :class="{rotate:item.isValid == 0}" @click.stop="item.isValid==0?item.isValid=1:item.isValid=0"></i>-->
                    </section>
                  </figure>
                  <article class="mm_couponExplain" v-if="item.limitDesc">
                    <p class="colorRed">{{item.limitDesc}}</p>
                  </article>
                </li>
              </ul>
            </div>
          </section>
        </section>
      </figure>
    </section>
    <section class="ao_couponMasker" style="z-index:3;" v-if="instructionsShow">
      <section class="ao_couponInstructions">
        <h3 class="ci_title">优惠券使用说明</h3>
        <ul class="ci_info">
          <li>1. 每张优惠券仅限使用一次，每张订单限用一张，不得转赠；不找零，不兑换;</li>
          <li>2. 如有恶意下单等行为，我司有权取消优惠资格；</li>
          <li>3. 如发生退款，优惠券将退回到您的唯医账户。</li>
        </ul>
        <span class="ci_btn" @click="instructionsShow=false">我知道了</span>
      </section>
    </section>
    <section class="ao_couponMasker" v-if="serviceShow">
      <section class="ao_couponInstructions">
        <h3 class="ci_title">服务说明</h3>
        <ul class="ci_info">
          <li>1. 咨询5天有效，可获得医生{{priceMessage.generalTimes}}次回答</li>
          <li>2. 医生48小时未接诊，自动全额退款</li>
        </ul>
        <span class="ci_btn" @click="serviceShow=false">我知道了</span>
      </section>
    </section>
    <confirm :confirmParams="{
          'ensure':'确定',
          'cancel':'取消',
          'content':'医生关闭了今天的咨询服务，暂不能为您提供帮助',
          'title':'今日暂不接诊'
          }" v-if="noStateShow" @cancelClickEvent="noStateShow=false;submitStatus=true" @ensureClickEvent="noStateShow=false;submitStatus=true">
    </confirm>
    <confirm :confirmParams="{
          'ensure':'确定',
          'cancel':'取消',
          'title':'抱歉，该医生今天已经没有咨询名额了'
          }" v-if="noMoreShow" @cancelClickEvent="noMoreShow=false;submitStatus=true" @ensureClickEvent="noMoreShow=false;submitStatus=true">
    </confirm>
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询服务，现在去继续沟通吗？'
          }" v-if="hasCommunShow" @cancelClickEvent="hasCommunShow=false;submitStatus=true" @ensureClickEvent="goIM">
    </confirm>
    <toast :content="toastContent" :imgUrl="toastImg" v-if="toastShow"></toast>
    <NormalLoading v-if="finish"></NormalLoading>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from 'common/js/util/util';
  import wxCommon from 'common/js/wxPay/wxComm';
  import confirm from 'components/confirm';
  import toast from 'components/toast';
  import NormalLoading from 'components/loading';
  import createCase from "common/js/HttpRequest/createCase";
  import ExchangeCoupon from 'common/js/coupon/exchange';
  import { mapState } from "vuex";
  import dataLog from "dataLog";
  const exchangeCoupon = new ExchangeCoupon();

  import medicalReportEnsure from 'components/medicalReportEnsure';

  const XHRList = {
    getDoctorInfo: api.httpEnv() + "/mcall/customer/auth/v1/getMapById/",//医生信息
    getVisitDetails: api.httpEnv() + "/mcall/customer/advice/setting/v1/getMapById/",//获取医生咨询价格及次数
    getCurrentState: api.httpEnv() + "/mcall/customer/advice/setting/v1/getCurrentByCustomerId/",//获取剩余人数和状态
    getConsultationId: api.httpEnv() + "/mcall/customer/case/consultation/v1/getConsultationFrequency/",//获取咨询Id
    getRecommendedCoupon: api.httpEnv() + "/mcall/promotion/sub/getBestPromotionSub/",//获取推荐优惠券
    getCouponList: api.httpEnv() + "/mcall/promotion/sub/getMapListByScene/",//获取优惠券列表
    getCouponInfo: api.httpEnv() + "/mcall/promotion/sub/getBaseMapList/"//获取优惠券详情------优惠券列表点击流程，需要优先使用
  };
  export default {
    data(){
      return {
        finish:false,
        pageFrom:"",//1."findDoctor"  2."doctorHome"  3."imScene"  4."imSceneDoctor"
        doctorId:"",
        caseId:"",
        patientId:"",
        doctorInfo:{
          fullName:"",
          company:"",
          platformId:""
        },
        doctorInfoString:"",
        medicalTitle:"",
        priceMessage:{
          generalPrice:"",
          generalTimes:"",
          freeTimes:""
        },
        doctorIcon:"",
        noStateShow: false,
        noMoreShow:false,
        hasCommunShow:false,
        toastContent:"",
        toastImg:"",
        toastShow:false,
        instructionsShow:false,
        choiceCouponShow:false,
        serviceShow:false,
        tabIndex:0,
        actualFrequency:"",//支付后返回次数
        actualMoney:0,//实付款金额
        couponId:"",//优惠券Id
        couponName:"",//优惠券名字
        couponMoney:"",//优惠券金额
        couponActivityId:"",//优惠券活动Id
        couponNum:"",//优惠码
        enableCouponList:[],//可使用优惠券列表
        unenableCouponList:[],//不可使用优惠券列表
        freeState:"",//是否使用前三次免费
        submitStatus: true,
        isIPad:false
      }
    },
    onLoad(){
      this.pageFrom = this.orderParams.from;
      this.doctorId = this.orderParams.doctorId;
      this.caseId = this.orderParams.caseId;
      this.patientId = this.orderParams.patientId;
      this.getDoctorInfo();
      this.getPrice();
      this.isIPad = wx.getSystemInfoSync().model.includes("iPad") ? true : false;
    },
    onUnload(){
      //重置弹层
      this.submitStatus = true;
      this.noStateShow = false;
      this.noMoreShow = false;
      this.hasCommunShow = false;
      this.instructionsShow = false;
      this.choiceCouponShow = false;
      this.serviceShow = false;
      this.finish = false;
      this.pageFrom = "";
      this.doctorId = "";
      this.caseId = "";
      this.patientId = "";
//      this.actualMoney = 0;
//      this.priceMessage = {
//        generalPrice:"",
//        generalTimes:"",
//        freeTimes:""
//      };
    },
    methods:{
      //toast显示
      showToast(text,img){
        this.toastContent = text;
        this.toastImg = img;
        this.toastShow = true;
        setTimeout(()=>{
          this.toastContent = "";
          this.toastImg = "";
          this.toastShow = false;
        },2000);
      },
      //字数限制
      wordsLimit(word,num){
        return api.getStrByteLength(word, num)
      },
      //输入框限制字数
      inputFn() {
        this.couponNum = api.getStrByteLength(this.couponNum, 8);
      },
      //优惠码兑换
      exchangeCDkey(){
        if(/^[a-zA-Z0-9]{8}$/.test(this.couponNum)){
          this.finish = true;
          exchangeCoupon.getMessage({
            customerId:wx.getStorageSync("userId"),
            promotionCode:this.couponNum,
            sendSiteId:api.getSiteId(),
            infoScene:this.pageFrom == "findDoctor"?"1":"4",
            orderAmount:this.priceMessage.generalPrice,
            useState:"1"
          }).then((res)=>{
            this.finish = false;
            if(res.responseCode == 0){
              if(res.responseData.canUseState == "1"){
                this.showToast("兑换成功");
                let resData = res.responseData;
                resData.discountAmount = (resData.discountAmount%1 === 0?parseInt(resData.discountAmount):resData.discountAmount);
                resData.promotionName = (resData.promotionName.length>10?resData.promotionName + "...":resData.promotionName);
                resData.promotionEndtime = resData.promotionEndtime.substring(0,4)+"."+resData.promotionEndtime.substring(5,7)+"."+resData.promotionEndtime.substring(8,10);
                resData.limitContent = (resData.limitContent.length>10?resData.limitContent + "...":resData.limitContent);
                resData.selected = false;
                this.enableCouponList.unshift(resData);
                this.tabIndex = 0;
              }else{
                this.showToast("该优惠券暂不可用，已放入'我的优惠券'中");
                let resDataNo = res.responseData;
                resDataNo.discountAmount = (resDataNo.discountAmount%1 === 0?parseInt(resDataNo.discountAmount):resDataNo.discountAmount);
                resDataNo.promotionName = (resDataNo.promotionName.length>10?resDataNo.promotionName + "...":resDataNo.promotionName);
                resDataNo.promotionEndtime = resDataNo.promotionEndtime.substring(0,4)+"."+resDataNo.promotionEndtime.substring(5,7)+"."+resDataNo.promotionEndtime.substring(8,10);
                resDataNo.limitContent = (resDataNo.limitContent.length>10?resDataNo.limitContent + "...":resDataNo.limitContent);
                this.unenableCouponList.unshift(resDataNo);
                this.tabIndex = 1;
              }
            }else if(res.responseCode == 1){
              this.showToast("该优惠券码已被使用");
            }else if(res.responseCode == 3){
              this.showToast("优惠码错误","https://m.allinmed.cn/static/image/img00/findDoctor/error_mark.png");
            }else if(res.responseCode == 4){
              if(res.responseData.receiveLimitStartTime && res.responseData.receiveLimitEndTime){
                let startTime = res.responseData.receiveLimitStartTime,endTime = res.responseData.receiveLimitEndTime;
                let timeArea = `${startTime.substring(0,4)}年${startTime.substring(5,7)}月${startTime.substring(8,10)}日-${endTime.substring(0,4)}年${endTime.substring(5,7)}月${endTime.substring(8,10)}日`;
                this.showToast(`未到达兑换时间，兑换时间为${timeArea}`);
              }else{
                this.showToast("未到达兑换时间");
              }
            }else if(res.responseCode == 5){
              this.showToast("已超过兑换时间，兑换失败");
            }
          }).catch((err)=>{
            this.finish = false;
        //this.showToast("网络错误");
          })
        }else{
          this.showToast("优惠码错误","https://m.allinmed.cn/static/image/img00/findDoctor/error_mark.png");
        }
      },
      //选择优惠券
      changeCoupon(obj){
        this.choiceCouponShow=false;
        this.couponId = obj.promotionSubId;
        this.couponActivityId = obj.promotionActivityId;
        obj.selected = true;
        this.enableCouponList.forEach((element)=>{
          element.selected = false
        });
        if(obj.threeFree){
          this.couponName = obj.promotionName;
          this.couponMoney = this.priceMessage.generalPrice;
          this.actualFrequency = "3";
        }else{
          if(obj.ruleType == 2){
            this.couponMoney = this.priceMessage.generalPrice;
          }else{
            this.couponMoney = obj.discountAmount;
          }
          this.couponName = `${obj.promotionName} -${this.couponMoney}元`;
          this.actualFrequency = this.priceMessage.generalTimes;
        }
      },
      //获取优惠券列表
      getCouponList(type){
        const that = this;
        that.couponNum = "";
        that.tabIndex = 0;
        that.finish = true;
        api.ajax({
          url: XHRList.getCouponList,
          method: "POST",
          data: {
            customerId:wx.getStorageSync("userId"),
            unionId: "",
            infoScene:that.pageFrom == "findDoctor"?"1":"4",
            listType:type,
            orderAmount:that.priceMessage.generalPrice,
            firstResult:0,
            maxResult:999
          },
          done(data) {
            that.finish = false;
            if (data && data.responseObject.responseData.dataList) {
              if(type == 1){
                that.enableCouponList = data.responseObject.responseData.dataList;
                that.enableCouponList.forEach((element)=>{
                  element.discountAmount = (element.discountAmount%1 === 0?parseInt(element.discountAmount):element.discountAmount);
                  element.promotionName = (element.promotionName.length>10?element.promotionName + "...":element.promotionName);
                  element.promotionEndtime = element.promotionEndtime.substring(0,4)+"."+element.promotionEndtime.substring(5,7)+"."+element.promotionEndtime.substring(8,10);
                  element.limitContent = (element.limitContent.length>10?element.limitContent + "...":element.limitContent);
                  element.selected = false;
                });
                if(that.priceMessage.freeTimes>0 && that.freeState == 1){
                  that.enableCouponList.unshift({
                    isValid:0,
                    ruleType:2,
                    limitContent:"",
                    threeFree:1,
                    infoTimeType:"1",
                    promotionName:"医生赠送3次回复",
                    promotionDesc:"免费获得医生3次回复次数",
                    promotionSubId:"",
                    promotionActivityId:"",
                    selected:false
                  })
                }
                that.addChoiceStatus();
              }else if(type == 2){
                that.unenableCouponList = data.responseObject.responseData.dataList;
                that.unenableCouponList.forEach((element)=>{
                  element.discountAmount = (element.discountAmount%1 === 0?parseInt(element.discountAmount):element.discountAmount);
                  element.promotionName = (element.promotionName.length>10?element.promotionName + "...":element.promotionName);
                  element.promotionEndtime = element.promotionEndtime.substring(0,4)+"."+element.promotionEndtime.substring(5,7)+"."+element.promotionEndtime.substring(8,10);
                  element.limitContent = (element.limitContent.length>10?element.limitContent + "...":element.limitContent);
                });
              }
            }
          },
          fail(err){
            that.finish = false;
          }
        });
      },
      //选择优惠券增加选中状态
      addChoiceStatus(){
        this.enableCouponList.forEach((element)=>{
          if(element.promotionSubId == this.couponId){
            element.selected = true
          }else{
            element.selected = false
          }
        })
      },
      //获取推荐优惠券
      getRecommendedCoupon(){
        const that = this;
        api.ajax({
          url: XHRList.getRecommendedCoupon,
          method: "POST",
          data: {
            customerId:wx.getStorageSync("userId"),
            unionId: "",
            infoScene:that.pageFrom == "findDoctor"?"1":"4",
            orderAmount:that.priceMessage.generalPrice
          },
          done(data) {
            if (data && data.responseObject.responseData.dataList && data.responseObject.responseData.dataList.length>0) {
              let item = data.responseObject.responseData.dataList[0];
              if(item.ruleType == 2){
                that.couponMoney = that.priceMessage.generalPrice;
              }else{
                that.couponMoney = item.discountAmount;
              }
              that.couponName = `${item.promotionName} -${that.couponMoney}元`;
              that.couponId = item.promotionSubId;
              that.couponActivityId = item.promotionActivityId;
            }else{
              that.couponName = "暂无可用，去兑换";
              that.couponId = "";
              that.couponActivityId = "";
              that.couponMoney = 0;
            }
            that.finish = false;
          },
          fail(err){
            that.couponName = "暂无可用，去兑换";
            that.couponId = "";
            that.couponActivityId = "";
            that.couponMoney = 0;
            that.finish = false;
          }
        });
      },
      //优惠券列表入口----获取优惠券详情
      getCouponInfo(){
        return new Promise((resolve, reject)=>{
          api.ajax({
            url: XHRList.getCouponInfo,
            method: "POST",
            data: {
              customerId: wx.getStorageSync("userId"),
              unionId: "",
              promotionSubId: wx.getStorageSync("promotionSubId"),
              infoScene: this.pageFrom == "findDoctor"?"1":"4",
              orderAmount: this.priceMessage.generalPrice
            },
            done(data) {
              if (data && data.responseObject.responseData.data_list && data.responseObject.responseData.data_list.length>0) {
                resolve(data.responseObject.responseData.data_list[0])
              }else{
                reject()
              }
            },
          });
        })
      },
      //获取医生信息
      getDoctorInfo(){
        const that = this;
        api.ajax({
          url: XHRList.getDoctorInfo,
          method: "POST",
          data: {
            customerId:this.doctorId,
            logoUseFlag: 3
          },
          done(data) {
            if (data && data.responseObject.responseData.dataList) {
              that.doctorInfo = data.responseObject.responseData.dataList[0].authMap;
              that.doctorInfoString = `${that.doctorInfo.fullName}，${that.doctorInfo.medicalTitleShow}，${that.doctorInfo.company}`;
              that.doctorInfo.fullName = that.doctorInfo.fullName.length>4?that.doctorInfo.fullName.substring(0,4)+"...":that.doctorInfo.fullName;
              that.doctorInfo.company = that.doctorInfo.company.length>6?that.doctorInfo.company.substring(0,6)+"...":that.doctorInfo.company;
              //职称
              let medicalTitleArr = that.doctorInfo.medicalTitle.split(","),medicalTitleNewArr = [];
              medicalTitleArr.forEach((element) => {
                medicalTitleNewArr.push(element.substring(element.indexOf("_")+1));
              });
              that.medicalTitle = that.wordsLimit(medicalTitleNewArr.join(" "),10);
              //医生头像
              that.doctorIcon = data.responseObject.responseData.dataList[0].logoUrlMap.logoUrl.length>0?data.responseObject.responseData.dataList[0].logoUrlMap.logoUrl:'/static/image/img00/doctorHome/docLogo_default.jpg'
            }
          },
        });
      },
      //获取咨询价格
      getPrice() {
        const that = this;
        that.finish = true;
        api.ajax({
          url: XHRList.getVisitDetails,
          method: "POST",
          data: {
            customerId: that.doctorId
          },
          done(data) {
            if (data.responseObject.responseData.dataList) {
              that.$set(that.priceMessage,"generalPrice",data.responseObject.responseData.dataList[0].generalPrice);
              that.$set(that.priceMessage,"generalTimes",data.responseObject.responseData.dataList[0].generalTimes);
              that.$set(that.priceMessage,"freeTimes",data.responseObject.responseData.dataList[0].freeTimes);
              that.actualFrequency = that.priceMessage.generalTimes;
              that.beforePay("freeState");
            }
          },
        });
      },
      //获取支付前各状态
      beforePay(type){
        dataLog.createTrack({
          actionId: 14171,
          browseType:"133",
          opDesc:"订单详情（通用）"
        });
        let that = this;
        if(type != "freeState"){
          this.submitStatus = false;
          this.finish = true;
        }
        api.ajax({
          url: XHRList.getCurrentState,
          method: "POST",
          data: {
            customerId: that.doctorId,
            caseId: that.caseId,
            patientId: that.patientId,
            orderType: 1,
            orderSourceType: 0,
            sortType: 2
          },
          done(data) {
            if (data.responseObject.responseData.dataList) {
              let item = data.responseObject.responseData.dataList;
              if(type == "freeState"){
                that.freeState = item.isFree;
                if(wx.getStorageSync("promotionSubId")){//来源-------优惠券列表
                  that.getCouponInfo().then((res)=>{
                    if(res.canUseState == 1){
                      if(res.ruleType == 2){
                        that.couponMoney = that.priceMessage.generalPrice;
                      }else{
                        that.couponMoney = res.discountAmount;
                      }
                      that.couponName = `${res.promotionName} -${that.couponMoney}元`;
                      that.couponId = res.promotionSubId;
                      that.couponActivityId = res.promotionActivityId;
                      that.finish = false;
                    }else{
                      if(that.priceMessage.freeTimes>0 && that.freeState == 1){
                        that.actualFrequency = "3";
                        that.couponMoney = that.priceMessage.generalPrice;
                        that.couponName = "医生赠送3次回复";
                        that.couponId = "";
                        that.couponActivityId = "";
                        that.finish = false;
                      }else{
                        that.getRecommendedCoupon();
                      }
                    }
                  }).catch((err)=>{
                    console.log("获取优惠券详情错误");
                    if(that.priceMessage.freeTimes>0 && that.freeState == 1){
                      that.actualFrequency = "3";
                      that.couponMoney = that.priceMessage.generalPrice;
                      that.couponName = "医生赠送3次回复";
                      that.couponId = "";
                      that.couponActivityId = "";
                      that.finish = false;
                    }else{
                      that.getRecommendedCoupon();
                    }
                  })
                }else if(that.priceMessage.freeTimes>0 && that.freeState == 1){
                  that.actualFrequency = "3";
                  that.couponMoney = that.priceMessage.generalPrice;
                  that.couponName = "医生赠送3次回复";
                  that.couponId = "";
                  that.couponActivityId = "";
                  that.finish = false;
                }else{
                  that.getRecommendedCoupon();
                }
              }else{
                that.finish = true;
                if(item.state == 0 && that.pageFrom != "imSceneDoctor") { //医生未开通咨询
                  that.noStateShow = true;
                  that.finish = false;
                }else if(item.remainNum <= 0 && item.remainNum != -1 && that.pageFrom != "imSceneDoctor"){  //医生今日剩余人数为0
                  that.noMoreShow = true;
                  that.finish = false;
                }else if (item.conState == 1 && (that.pageFrom == "doctorHome" || that.pageFrom == "imScene")) {  //已存在咨询记录
                  that.hasCommunShow = true;
                  that.finish = false;
                }else{
                  that.goPay();
                }
              }
            }
          },
          fail(err){
            that.finish = false;
          }
        });
      },
      //支付
      goPay(){
        let that = this;
        //判断订单来源
        if(this.pageFrom != "findDoctor"){
          api.ajax({
            url: XHRList.getConsultationId,
            method: "POST",
            data: {
              caseId: this.caseId,
              customerId: this.doctorId,
              isCreate: 1,
              isValid: 1,
              consultationType: 1,
              firstResult: 0,
              maxResult: 999
            },
            done(data) {
              if (data && data.responseObject.responseData.dataList) {
                let consultationId = data.responseObject.responseData.dataList.consultationId;
                wx.setStorageSync("orderSourceId", consultationId);
                if(that.actualMoney == 0){
                  that.freePay(consultationId);
                }else{
                  that.notFreePay(consultationId);
                }
              }else{
                that.finish = false;
                that.submitStatus = true;
                console.log("获取consultationId失败");
              }
            },
            fail(err){
              that.finish = false;
            }
          });
        }else{
          this.createMedical().then(()=>{
            if(that.actualMoney == 0){
              that.freePay(0);
            }else{
              that.notFreePay(0);
            }
          }).catch((err)=>{
            console.log(err)
            that.finish = false;
            console.log("创建订单失败");
          });
        }
      },
      //创建免费订单
      freePay(cId){
        let that = this;
        let data = {
            caseId: that.caseId,                                          //  string  是  caseId
            patientCustomerId: wx.getStorageSync("userId"),               //	string	是	  患者所属用户id
            patientId: that.patientId,                                    // 	string	是  	患者id
            doctorId: that.doctorId,                                      //	string	是 	医生id
            orderType: 1,                                                 //	string	是	  订单类型  1-咨询
            orderSourceId: cId,                                           //	string	是	  来源id，  对应 咨询id
            orderSourceType: that.couponId?"1":"0",                       //	string	是	  来源类型  咨询：0-免费1-普通2-加急3-特需
            orderAmount:that.couponId?that.priceMessage.generalPrice:0,   //	string	是	  订单金额  （单位/元 保留两位小数）
            payAmount:parseFloat(that.actualMoney).toFixed(2),            //	string	是	  实际支付金额
            isCharge: "false",                                            //  string  否  true-收费  false-免费
            body: '免费咨询'                                               //  string  否  订单描述 （微信支付展示用）
          };
        // 针对于美年的问诊不需要优惠卷
        if (this.caseType != '15') {
          Object.assign(data,{
            promotionAmount:that.couponMoney,                             //  string	否  优惠金额
            promotionSubId:that.couponId,                                 //  string	否  优惠劵id
            promotionActivityId:that.couponActivityId,                    //  string	否  促销活动ID
            promotionInfoName:that.couponName,                            //  string	否  优惠劵名称
          })
        }
        wxCommon.wxCreateOrder({
          data,
          backCreateSuccess: function (_data) {
            that.finish = false;
//            that.submitStatus = true;
            wx.removeStorageSync("promotionSubId");
            if(that.pageFrom == "findDoctor"){
              that.paySuccessBack();
            }else{
              that.creatInquiryId(_data);
            }
          },
          backCreateError: function (_data) {
            //创建订单失败  (必选)
            that.finish = false;
            that.submitStatus = true;
          }
        });
      },
      //免费咨询支付成功后创建咨询id
      creatInquiryId(orderId) {
        let that = this;
        //获取是否已经存在咨询id
        api.ajax({
          url: api.httpEnv() + "/mcall/customer/case/consultation/v1/getMapById/",
          method: "POST",
          data: {
            caseId: that.caseId,
            customerId: that.doctorId,
            consultationType: 1
          },
          done(data) {
            if (data.responseObject.responseMessage == "NO DATA") {
              let data = {
                caseId: that.caseId,
                customerId: that.doctorId,
                patientId: that.patientId,
                patientCustomerId: wx.getStorageSync("userId"),
                consultationType: 1,
                consultationState: -1,
                consultationLevel: 0,
                siteId: api.getSiteId(),
                caseType: 0
              };
              if (that.caseType == '15') {
                Object.assign(data,{
                  consultationFrequency : -1,
                  caseType: 15,
                })
              }
              api.ajax({
                url: api.httpEnv() + "/mcall/customer/case/consultation/v1/create/",
                method: "POST",
                data,
                done(res) {
                  if (res.responseObject.responseStatus) {
                    let orderSourceId = res.responseObject.responsePk;
                    wx.setStorageSync("orderSourceId", res.responseObject.responsePk);
                    wxCommon.wxUpOrder({
                      operationType: "2",
                      orderId: orderId,
                      orderSourceId: orderSourceId,
                      outTradeNo: "",
                      status: '2',
                      payTime: '1',
                      callBack: function (data) {
                        that.paySuccessBack();
                      }
                    });
                  }
                }
              });
            } else {
              that.paySuccessBack();
            }
          }
        });
      },
      //创建付费订单
      notFreePay(cId){
        let that = this;
        wxCommon.wxCreateOrder({
          data: {
            caseId: that.caseId,                                          //  string  是  caseId
            patientCustomerId: wx.getStorageSync("userId"),               //	string	是	  患者所属用户id
            patientId: that.patientId,                                    // 	string	是  	患者id
            doctorId: that.doctorId,                                      //	string	是 	医生id
            orderType: 1,                                                 //	string	是	  订单类型  1-咨询
            orderSourceId: cId,                                           //	string	是	  来源id，  对应 咨询id
            orderSourceType: 1,                                           //	string	是	  来源类型  咨询：0-免费1-普通2-加急3-特需
            orderAmount: parseFloat(that.priceMessage.generalPrice).toFixed(2), //	string	是	  订单金额  （单位/元 保留两位小数）
            payAmount:parseFloat(that.actualMoney).toFixed(2),            //	string	是	  实际支付金额  （单位/元 保留两位小数）
            promotionAmount:that.couponMoney,                             //  string	否  优惠金额
            promotionSubId:that.couponId,                                 //  string	否  优惠劵id
            promotionActivityId:that.couponActivityId,                    //  string	否  促销活动ID
            promotionInfoName:that.couponName,                            //  string	否  优惠劵名称
            isCharge: "true",                                             //  string  否  true-收费  false-免费
            body: '图文咨询',                                              //  string  否  订单描述 （微信支付展示用）
            paySource: that.pageFrom == "findDoctor"?"0":"1"              //  string  否  支付来源 0--找专家 1--其他
          },
          backCreateSuccess: function (_data) {
            //创建订单成功  （手术必选）
            wx.removeStorageSync("promotionSubId");
          },
          backCreateError: function (_data) {
            //创建订单失败  (必选)
            that.finish = false;
            that.submitStatus = true;
          },
          wxPaySuccess: function (_data) {
            that.finish = false;
            that.submitStatus = true;
            that.paySuccessBack();
          },
          wxPayError: function (_data) {
            that.finish = false;
            that.submitStatus = true;
          }
        });
      },
      //支付成功后回调
      paySuccessBack(){
        let ot,oa;
        console.log("+++++++++++++++++++++++++++++",this.couponId)
        if(this.couponId){
          ot = "1";
          oa = this.priceMessage.generalPrice;
        }else{
          if(this.priceMessage.freeTimes>0 && this.freeState == 1){
            ot = "0";
            oa = "0";
          }else{
            ot = "1";
            oa = this.priceMessage.generalPrice;
          }
        }
        console.log("+++++++++++++++++++++++++++++",{
          "aaaaaaa":this.actualFrequency,
          "bbbbbbbbbb":this.caseId
        })
        this.$emit("paySuccess", {
          orderType: ot,//0免费，其他不是
          orderAmount: oa, //价钱
          orderFrequency: this.actualFrequency,//聊天次数
          caseId:this.caseId
        });
      },
      //继续沟通
      goIM(){
        this.hasCommunShow = false;
        this.submitStatus = true;
        wx.redirectTo({
          url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${this.caseId}&doctorCustomerId=${this.doctorId}&patientId=${this.patientId}`
        });
      },
      //来源是findDoctor，创建咨询单
      createMedical(){
        let param = {};
        if (this.qrCode) {
          param = Object.assign(this.medicalParams.medicalCreate,{
            doctorId:this.doctorId,
            channelType : wx.getStorageSync('reportPatient')?3:2, // 清除患者报道患者的标记2,
          });
        } else {
          param = Object.assign(this.medicalParams.medicalCreate,{
            doctorId:this.doctorId,
          });
        }
        return new Promise((resolve, reject)=>{
          let _this = this;
          api.ajax({
            url:  api.httpEnv() + '/mcall/customer/patient/case/v3/create/',
            method: "POST",
            data: param,
            done(response) {
              if (response.responseObject.responsePk && response.responseObject.responsePk) {
                //更新caseId
                _this.caseId = response.responseObject.responsePk;
                resolve();
              }else{
                reject();
              }
            }
          });
          // createCase(param).then((res) => {
          //   if (res.responseObject.responsePk && res.responseObject.responsePk.length>1) {
          //     //更新caseId
          //     this.caseId = res.responseObject.responsePk;
          //     resolve();
          //   }else{
          //     reject();
          //   }
          // });
        })
      }
    },
    watch:{
      couponMoney() {
        if (this.caseType == '15') {
          this.actualMoney = 0;
        } else {
          this.actualMoney = this.priceMessage.generalPrice - this.couponMoney > 0?this.priceMessage.generalPrice - this.couponMoney:0;
        }
      }
    },
    computed:{
      ...mapState(['qrCode',]),
      showActualMoney(){
        return this.actualMoney%1 === 0?parseInt(this.actualMoney):parseFloat(this.actualMoney).toFixed(2);
      }
    },
    components: {
      confirm,
      toast,
      NormalLoading,
      medicalReportEnsure
    },
    props:{
      orderParams: {
        type: Object,
//        default:{
//          from:"findDoctor",
//          doctorId:"1522727994871",
//          caseId:"1535102257454",
//          patientId:"1535102206857"
//        }
      },
      medicalParams:{
        type: Object
      },
      caseType: {
        type: String,
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .ao_main{
    width:100%;
    height:100%;
    background: #F5F7F9;
    padding:24px 20px 0;
    box-sizing: border-box;
    &.hideScroll{
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 0;
    }
    .ao_docBox{
      background:#ffffff;
      padding:32px 28px;
      box-sizing: border-box;
      .ao_doxInfo{
        .ao_docIcon{
          display: inline-block;
          margin-right:24px;
          vertical-align: middle;
          img{
            display: block;
            width:96px;
            height:96px;
            border-radius: 50%;
          }
        }
        .ao_docDetails{
          display: inline-block;
          vertical-align: middle;
          .ao_docNameTitle{
            .ao_docName{
              font-size: 34px;
              color: #25324D;
              font-weight: bold;
              margin-right:20px;
            }
            .ao_docTitle{
              font-size: 30px;
              color: #25324D;
              opacity: 0.45;
            }
          }
          .ao_docHospitalDivision{
            margin-top:20px;
            font-size: 30px;
            color: #25324D;
            .ao_docHospital{
              margin-right:20px;
            }
          }
        }
      }
      .ao_inquiryTypeBox {
        margin-top: 48px;
        background: url("https://m.allinmed.cn/static/image/img00/doctorMain/advisory_bg.png") no-repeat center;
        background-size: 100% 100%;
        padding:30px 20px;
        .ao_imgInquiry {
          @include clearfix();
          font-size:32px;
          color: #29A3A3;
          .ao_inquiryTitle{
            float:left;
            &:before{
              display: inline-block;
              content: "";
              width:32px;
              height:32px;
              background:url("https://m.allinmed.cn/static/image/img00/doctorMain/advisory.png") no-repeat center;
              background-size: 100% 100%;
              margin-right:10px;
              vertical-align: sub;
            }
          }
          .ao_inquiryMoney {
            float:right;
            i{
              display:inline-block;
              font-size:28px;
              margin-left:5px;
            }
          }
        }
        .ao_inquiryUnder{
          width:90px;
          height:2px;
          opacity: 0.08;
          background: #25324D;
          margin-top:28px;
        }
        .ao_doxCando {
          padding-top: 16px;
          li {
            padding: 8px 0;
            color: #25324D;
            font-size:26px;
            opacity: 0.55;
          }
        }
      }
    }
    .ao_coupon{
      @include clearfix();
      margin-top:16px;
      background:#ffffff;
      padding:48px 28px;
      box-sizing: border-box;
      font-size: 32px;
      color: #444444;
      .ao_couponLeft{
        float:left;
        i{
          display: inline-block;
          vertical-align: middle;
        }
        &:before{
          display: inline-block;
          vertical-align: middle;
          content: "";
          width:40px;
          height:32px;
          margin-right:8px;
          background: url("https://m.allinmed.cn/static/image/img00/findDoctor/coupon.png") no-repeat center;
          background-size: 100% 100%;
        }
      }
      .ao_couponRight{
        float:right;
        margin-top:5px;
        &:after{
          display: inline-block;
          content: "";
          width:28px;
          height:28px;
          margin-left:10px;
          background: url("https://m.allinmed.cn/static/image/img00/findDoctor/arrow.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: -4px;
        }
      }
    }
    .ao_btnBox{
      width:100%;
      height:112px;
      /*height:180px;*/
      /*background: #fff;*/
      line-height: 112px;
      box-shadow: 0 -8px 20px 0 rgba(37,56,77,0.04);
      position: absolute;
      left: 0;
      bottom: 0;
      @include iphoneX() {
        height: 180px;
        background: #fff;
      }
      .ao_money{
        display: inline-block;
        width:68%;
        padding-left:40px;
        background: #ffffff;
        font-size: 30px;
        color: #333333;
        box-sizing: border-box;
        i{
          display: inline-block;
          font-weight: bold;
          font-size: 44px;
          color: #FF8C8A;
        }
      }
      .ao_submit{
        display: inline-block;
        width:32%;
        background: #FF8C8A;
        font-size: 36px;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
      }
    }
  }
  .ao_couponMasker{
    width:100%;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    .ao_couponMaskerMain{
      width:100%;
      padding:0 20px;
      position: absolute;
      left:0;
      bottom:0;
      z-index:2;
      background: #ffffff;
      box-sizing: border-box;
      .mm_header{
        @include clearfix();
        line-height:120px;
        position: relative;
        .mm_title{
          float:left;
          margin-left:10px;
          font-weight: bold;
          font-size: 40px;
          color: #333333;
        }
        .mm_instructions{
          float:right;
          margin-right:70px;
          font-size: 28px;
          color: #868686;
        }
        .mm_icon_close{
          width:28px;
          height:28px;
          background: url("https://m.allinmed.cn/static/image/img00/findDoctor/close.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          right:0;
          top:50%;
          transform: translateY(-50%);
        }
      }
      .mm_main{
        padding-top:20px;
        .mm_useTab{
          li{
            display: inline-block;
            width:49%;
            font-size: 32px;
            color: #686868;
            text-align: center;
            &.active{
              font-weight: bold;
              color: #2EA9FE;
              &:after{
                display: block;
                content: "";
                width:180px;
                height:4px;
                margin:28px auto 0;
                background: #2EA9FE;
              }
            }
          }
        }
        .mm_CDkey{
          border-top:1px solid #E8E8E8;
          padding:32px 0 40px;
          .mm_CDkeyInput{
            display: inline-block;
            vertical-align: top;
            width:590px;
            height:80px;
            padding:15px;
            box-sizing: border-box;
            background: #F3F3F3;
            border: none;
            outline: none;
            font-size: 32px;
            color: #222222;
            caret-color: #2EA9FE;
            border-radius: 4px 0 0 4px;
            @include placeholder(){
              color: #999999;
            }
          }
          .mm_CDkeyBtn{
            display: inline-block;
            vertical-align: top;
            width:120px;
            height:80px;
            padding:0;
            line-height: 80px;
            font-size: 30px;
            color: #FFFFFF;
            text-align: center;
            background: #2EA9FE;
            border-radius: 0 4px 4px 0;
            box-sizing: border-box;
          }
        }
        .mm_useContent{
          .mm_useYesLists{
            &.mm_ipad{
              height:450px;
            }
            height:600px;
            overflow: scroll;
          }
          .mm_useYesItem{
            margin-bottom:20px;
            box-shadow: 0 10px 20px 0 rgba(2,27,25,0.07);
            .mm_couponInfoBox{
              position: relative;
              &>h4{
                display: inline-block;
                vertical-align:middle;
                margin-right:20px;
                width:250px;
                height:200px;
                line-height:200px;
                text-align: center;
                background:url("https://m.allinmed.cn/static/image/img00/findDoctor/coupon_bg.png") no-repeat;
                background-size: 100% 100%;
                font-size: 46px;
                color: #FFFFFF;
                span{
                  font-size: 80px;
                }
              }
            }
            .mm_couponInfo{
              display: inline-block;
              vertical-align:middle;
              .mm_couponName{
                margin-top: 20px;
                font-weight: bold;
                font-size: 32px;
                color: #312F2F;
              }
              .mm_couponIndate{
                margin-top:15px;
                font-size: 24px;
                color: #686868;
              }
              .mm_couponLimit{
                /*width:350px;*/
                /*overflow:hidden;*/
                /*text-overflow:ellipsis;*/
                /*white-space:nowrap;*/
                margin-top:40px;
                font-size: 24px;
                color: #686868;
                &.colorRed{
                  color: #F76A69;
                }
              }
              .mm_icon_unfold{
                display: block;
                width:24px;
                height:24px;
                background: url("https://m.allinmed.cn/static/image/img00/findDoctor/Artboard.png") no-repeat;
                background-size: 100% 100%;
                position: absolute;
                right:30px;
                bottom:15px;
                &.rotate{
                  transform:rotate(180deg);
                }
              }
            }
            .mm_couponStatus{
              position:absolute;
              right:40px;
              top:50%;
              transform:translateY(-50%);
              display: inline-block;
              width:48px;
              height:48px;
              border: 2px solid #DDDDDD;
              border-radius: 50%;
              &.on{
                background:url("https://m.allinmed.cn/static/image/mp/consult/selected@2x.png") no-repeat;
                background-size: 100% 100%;
                border:none;
              }
            }
            .mm_couponExplain{
              width:100%;
              padding:20px 26px;
              box-sizing: border-box;
              p{
                font-size: 28px;
                color: #686868;
                white-space:pre-wrap;
                &.colorRed{
                  color: #F76A69;
                }
              }
            }
          }
          .mm_noCoupon{
            width:100%;
            &.mm_ipad{
              margin-bottom:180px;
            }
            margin-bottom:280px;
            font-size: 30px;
            color: #999999;
            img{
              display: block;
              width:196px;
              height:120px;
              margin:160px auto 40px;
            }
            span{
              display: block;
              text-align: center;
            }
          }
        }
      }
    }
    .ao_couponInstructions{
      width:640px;
      background: #FFFFFF;
      border-radius: 16px;
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      z-index: 4;
      box-sizing: border-box;
      .ci_title{
        padding-top:60px;
        font-size: 40px;
        font-weight: bold;
        color: #333333;
        text-align: center;
      }
      .ci_info{
        padding:60px 35px 20px 40px;
        li{
          margin-bottom:40px;
          font-size: 32px;
          color: #666666;
        }
      }
      .ci_btn{
        display: block;
        width:100%;
        border-top: 1px solid #DFDFDF;
        padding:30px 0;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
        color: #2EA9FE;
      }
    }
  }
  .ao_fromDoctor{
    padding-bottom:50px;
    .fd_orderInfo{
      background:#ffffff;
      box-shadow: 0 8px 20px 0 rgba(37,56,77,0.04);
      border-radius: 8px;
      margin-top:20px;
      margin-bottom:200px;
      li{
        padding:40px 30px;
        border-top:1px solid #e8e8e8;
        @include clearfix();
        &:first-child{
          border:none;
        }
        .fd_orderItemLeft{
          float:left;
          font-size: 34px;
          color: #666666;
          &.fd_orderItemExplain{
            &:after{
              display: inline-block;
              content: "";
              width:36px;
              height:36px;
              margin-left:5px;
              background: url("https://m.allinmed.cn/static/image/mp/commonImage/serviceNote.png") no-repeat;
              background-size: 100% 100%;
              vertical-align: -8px;
            }
          }
        }
        .fd_orderItemRight{
          overflow: hidden;
          text-align: right;
          &.fd_orderItemPrice{
            font-size: 32px;
            color: #FE8178;
          }
          &.fd_orderItemCoupon{
            font-size: 34px;
            color: #666666;
            span{
              color: #222222;
            }
          }
          &.fd_orderItemExplain{
            span{
              display: inline-block;
              padding:0 6px;
              margin-right:12px;
              margin-bottom:4px;
              border: 1px solid #2EA9FE;
              border-radius: 4px;
              font-size: 26px;
              line-height:40px;
              color: #2EA9FE;
            }
          }
        }
      }
    }
    .fd_orderSubmit{
      @include clearfix();
      position: fixed;
      left:0;
      bottom:0;
      width:100%;
      height:110px;
      line-height: 110px;
      @include iphoneX() {
        height: 178px;
        background: #fff;
        box-shadow: 0 0 20px -10px rgba(0,0,0,0.3);
      }
      .fd_ActualMoney{
        float: left;
        width:500px;
        background: #FFFFFF;
        box-shadow: 0 0 20px -10px rgba(0,0,0,0.3);
        font-size: 44px;
        color: #FE8178;
        text-indent: 40px;
        @include iphoneX() {
          box-shadow:none;
        }
      }
      .fd_goSubmit{
        display: block;
        overflow: hidden;
        text-align: center;
        background: #2EA9FE;
        box-shadow: 0 8px 24px 0 rgba(47,197,189,0.4);
        font-size: 36px;
        font-weight: bold;
        color: #FFFFFF;
        @include iphoneX() {
          box-shadow:none;
        }
      }
    }
  }
</style>
