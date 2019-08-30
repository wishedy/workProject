<template>
  <section>
    <!--推荐医生-->
    <section class="main-message-box doctor-main-box" data-alcode-mod='716' v-if="doctorObj.allData.length">
      <!-- 推荐医生提示 -->
      <article class="doctor-box">
        <header class="doctor-header">
          <h3 class="doctor-title">根据病情为您推荐以下医生</h3>
          <p class="doctor-p">点击卡片开始咨询</p>
        </header>
        <section class="doctor-content">
          <section class="doctor-list">
            <!--<section class="doctor-item"-->
                     <!--v-for="(item , index) in doctorObj.tempData"-->
                     <!--:key="index"-->
            <!--&gt;-->
              <!--<section class="doctor-item-top" @click="goDoctorHome($event,index)">-->
                <!--<figure class="doctor-item-img">-->
                  <!--<img :src="item.logoUrl" alt="">-->
                <!--</figure>-->
                <!--<figcaption class="doctor-item-info">-->
                  <!--<p class="doctor-base-info">-->
                    <!--<span class="doctor-name">{{item.fullName}}</span>-->
                    <!--<span class="doctor-post">{{item.medicalTitle}}</span>-->
                    <!--&lt;!&ndash;<span class="doctor-free">首次免费咨询</span>&ndash;&gt;-->
                  <!--</p>-->
                  <!--<p class="doctor-hospital">{{item.hospitalName}}</p>-->
                  <!--<p class="doctor-good" v-if="item.illnessNameList.length || item.operationNameList.length">擅长-->
                    <!--{{item.illnessNameList+ ((item.illnessNameList.length && item.operationNameList.length) ? "," : "")-->
                    <!--+ item.operationNameList}}</p>-->
                <!--</figcaption>-->
              <!--</section>-->
              <!--<section class="doctor-item-bottom" v-if="item.adviceStatus==='1' && item.isFreeTimes">-->
                <!--<span class="go-consult" @click="isClickInquiry&&queryConsult(index,'free',item)"-->
                      <!--v-if="item.adviceNum && !item.isRefuse">免费咨询</span>-->
                <!--<span class="consult-price"><i></i><span></span>{{item.generalPrice}}元<span class="free-consult"></span></span>-->

                <!--&lt;!&ndash;<span class="general-money">{{item.generalPrice}}元</span>&ndash;&gt;-->
              <!--</section>-->
              <!--<section class="doctor-item-bottom" v-if="item.adviceStatus==='1' && !item.isFreeTimes">-->
                <!--<span class="go-consult" @click="isClickInquiry&&queryConsult(index,'pay',item)"-->
                      <!--v-if="item.adviceNum && !item.isRefuse">去咨询</span>-->
                <!--<span class="consult-price"><i></i>{{item.generalPrice}}元</span>-->
              <!--</section>-->
              <!--<section class="doctor-item-bottom" v-if="item.adviceStatus==='0'">-->
                <!--<span class="go-consult" @click="isClickInquiry&&queryConsult(index,'order',item)"-->
                      <!--v-if="!item.isRefuse">预约咨询</span>-->
                <!--<span class="consult-price">暂未开诊</span>-->
              <!--</section>-->
            <!--</section>-->
            <section class="main-inner-item" v-for="(item,index) in doctorObj.tempData" :key="index" @click="goDoctorHome(index,item)">
              <div class="main-inner-item-img">
                <img :src="item.logoUrl" class="dp">
              </div>
              <div class="ProMark" v-if="item.jobDoctorYear>5">
                {{item.jobDoctorYear>=10?'从医'+item.jobDoctorYear+'年':'从医5年以上'}}
              </div>
              <div class="main-inner-item-baseMessage">
                <p>
                  <span class="main-inner-item-baseMessage-name">{{item.fullName}}</span>
                  <span class="main-inner-item-baseMessage-title">{{item.medicalTitle}}</span>
                </p>
                <p style="margin-top: 1.1vw">
                  <span class="sanjia" v-if="item.hospitalLevelId==1">三甲</span>
                  <span class="main-inner-item-baseMessage-hospital">{{item.company}}</span>
                </p>
              </div>
              <p class="main-inner-item-baseMessage-Pro" >
                <span style="color: #222222;"  v-if="item.illnessNameList.length || item.operationNameList.length">擅长：</span><span>{{item.illnessNameList+ ((item.illnessNameList.length && item.operationNameList.length) ? "," : "")
                    + item.operationNameList}}</span>
              </p>

              <div class="priceBar" style="float: left">
                <template v-if="item.adviceStatus==0 || item.customerReviseStatus != 8">
                  <span class="price offLine">暂不在线</span>
                </template>
                <template v-else>
                  <span class="price" v-if="item.isFreeTimes==1">前3次回复免费</span>
                  <span class="freeSug" :class="{'lineThrough':item.isFreeTimes==1}"
                        v-if="item.isFreeTimes==1">￥{{item.generalPrice}}</span>
                  <span class="noFreeSug" v-if="item.isFreeTimes!==1">￥{{item.generalPrice}}</span>
                </template>
              </div>
              <button :hoverStopPropagation="hoverStopPropagation" class="proMark1"
                      @click.stop="isClickInquiry&&queryConsult(index,item)">{{item.adviceStatus==1 && item.customerReviseStatus == 8?'咨询医生':'预约咨询'}}
              </button>
            </section>
          </section>
          <section class="more-box doctor-more-box" v-if="doctorObj.moreBoxShow">
            <span class="more-box-btn more-btn" v-if="doctorObj.moreData"
                  @click="moreDataShow('doctorObj',$event)">查看更多</span>
            <span class="more-box-btn less-btn" v-if="!doctorObj.moreData"
                  @click="lessDataShow('doctorObj',$event)">收起</span>
          </section>
        </section>
      </article>
    </section>

    <!--患教知识-->
    <section class="main-message-box" v-if="knowledgeObj.allData.length">
      <article class="knowledge-box">
        <header class="knowledge-title">以下骨科知识有助于您早日康复，点击查看详情</header>
        <section class="knowledge-bg"></section>
        <section class="knowledge-content">
          <ul class="knowledge-list">
            <li class="knowledge-item"
                v-for="(item , index) in knowledgeObj.tempData"
                :key="index"
                @click="goKnowledgeDetail(index)"
            >
              <span class="knowledge-name">{{item.knowledgeName}}</span>
              <span class="knowledge-detail">详情</span>
            </li>
          </ul>
          <section class="more-box" v-if="knowledgeObj.moreBoxShow">
            <span class="more-box-btn more-btn" v-show="knowledgeObj.moreData"
                  @click.stop="moreDataShow('knowledgeObj',$event)">查看更多</span>
            <span class="more-box-btn less-btn" v-show="!knowledgeObj.moreData"
                  @click.stop="lessDataShow('knowledgeObj',$event)">收起</span>
          </section>
        </section>
      </article>
    </section>

    <!--处置建议-->
    <section class="main-message-box" v-if="treatmentObj.allData.length">
      <article class="advice-box">
        <header class="check-suggest-title">根据您的情况，为您推荐以下康复方式，请务必在医生的指导下进行</header>
        <section class="check-suggest-bg"></section>
        <section class="check-suggest-content">
          <ul class="check-suggest-list">
            <li class="check-suggest-item"
                v-for="(item, index) in treatmentObj.tempData"
                :key="index"
            >
              <span>{{item.treatmentName}}</span>
            </li>
          </ul>
          <section class="more-box" v-if="treatmentObj.moreBoxShow">
            <span class="more-box-btn more-btn" v-show="treatmentObj.moreData"
                  @click.stop="moreDataShow('treatmentObj',$event)">查看更多</span>
            <span class="more-box-btn less-btn" v-show="!treatmentObj.moreData"
                  @click.stop="lessDataShow('treatmentObj',$event)">收起</span>
          </section>
        </section>
      </article>
    </section>

    <!--检查检验-->
    <section class="main-message-box" data-alcode-mod='715' v-if="checkSuggestObj.allData.length">
      <article class="check-suggest-box">
        <header class="check-suggest-title">建议您进行以下检查，并上传检查资料，分诊将继续为您解答，并推荐对症专家</header>
        <section class="check-suggest-bg"></section>
        <section class="check-suggest-content">
          <ul class="check-suggest-list">
            <li class="check-suggest-item"
                :data-adviceid="item.adviceId"
                :data-advicetype="item.adviceType"
                v-for="(item, index) in checkSuggestObj.tempData"
                :key="index"
            >
              <span>{{item.adviceName}}</span>
            </li>
          </ul>
          <section class="more-box" v-if="checkSuggestObj.moreBoxShow">
            <span class="more-box-btn more-btn" v-show="checkSuggestObj.moreData"
                  @click.stop="moreDataShow('checkSuggestObj',$event)">查看更多</span>
            <span class="more-box-btn less-btn" v-show="!checkSuggestObj.moreData"
                  @click.stop="lessDataShow('checkSuggestObj',$event)">收起</span>
          </section>
          <section data-alcode='e129' class="check-suggest-btn" data-role="videoTriage"
                   @click="goToUpload">
            上传检查资料
          </section>
        </section>
        <section class="tips-content">
          重要提示：在线咨询不能代替面诊，医生建议仅供参考。
        </section>
      </article>
    </section>

    <!--confrim 框-->
    <confirm :confirmParams="{
          'ensure':'去沟通',
          'cancel':'取消',
          'title':'您与该医生有正在进行中的咨询服务，现在去继续沟通吗？'
          }" v-if="hasCommunShow" @cancelClickEvent="hasCommunShow=false" @ensureClickEvent="goDoctorIm()">
    </confirm>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2017/8/18.
   */
  import api from "common/js/util/util";
  import {createNamespacedHelpers} from "vuex";
  import confirm from 'components/confirm';
  import localStorage from "localStorage";

  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');
  import dataLog from "dataLog";
  /**************************Axios Http Requests*************************/
  import updateConsultation from "common/js/HttpRequest/updateConsultation";
  import doctorStatusInfo from "common/js/doctorHome/getConsultStatus";
  import getBaseMessage from 'common/js/doctorHome/getBaseMessage';       //医生基本信息 api
  import getHasInvitedConsult from "common/js/HttpRequest/getHasInvitedConsult"   //是否邀请过


  const XHRList = {
    getCheckSuggestion: api.httpEnv() + "/mcall/patient/case/diagnosis/v1/getMapList/",//预览初诊建议
    getRecommedDoctor: api.httpEnv() + "/mcall/patient/recommend/v1/getMapList/",//推荐医生
    getToken: api.httpEnv() + "/mcall/im/interact/v1/refreshToken/",
    getCurrentByCustomerId: api.httpEnv() + '/mcall/customer/advice/setting/v1/getCurrentByCustomerId/',//获取是否与专业医生建立过im
    queryIsValid: api.httpEnv() + "/mcall/patient/recommend/v1/getMapById/", // 查询该医生是否有效
  };

  export default {
    data() {
      return {
        isClickInquiry: true,
        message: {},
        suggestResponse: false,//检查检验预览响应是否完成
        doctorResponse: false,//推荐医生预览是否完成
        currentIndex: -1, // 点击当前的医生
        //检查检验里的数据
        checkSuggestObj: {
          allData: [],//全部数据
          moreBoxShow: false,//展开更多盒子是否显示
          moreData: false,//显示展开更多还是显示收起按钮
          tempData: [],//展示的数组
          lessData: [],//五条建议的数据
          initNum: 5,//初始展示的数据条数
          pageNum: 5,//分页数据条数
          position: 0,//记录卡片的位置
          hasPosition: false,//卡片的位置是否已经记录
        },
        //处置建议里的数据
        treatmentObj: {
          allData: [],//全部数据
          moreBoxShow: false,//展开更多盒子是否显示
          moreData: false,//显示展开更多还是显示收起按钮
          tempData: [],//展示的数组
          lessData: [],//五条建议的数据
          initNum: 5,//初始展示的数据条数
          pageNum: 5,//分页数据条数
          position: 0,//记录卡片的位置
          hasPosition: false,//卡片的位置是否已经记录
        },
        //患教知识里的数据
        knowledgeObj: {
          allData: [],//全部数据
          moreBoxShow: false,//展开更多盒子是否显示
          moreData: false,//显示展开更多还是显示收起按钮
          tempData: [],//展示的数组
          lessData: [],//五条建议的数据
          initNum: 5,//初始展示的数据条数
          pageNum: 5,//分页数据条数
          position: 0,//记录卡片的位置
          hasPosition: false,//卡片的位置是否已经记录
        },
        //推荐医生的的数据
        doctorObj: {
          allData: [],//全部数据
          moreBoxShow: false,//展开更多盒子是否显示
          moreData: false,//显示展开更多还是显示收起按钮
          tempData: [],//展示的数组
          lessData: [],//五条建议的数据
          initNum: 3,//初始展示的数据条数
          pageNum: 5,//分页数据条数
          position: 0,//记录卡片的位置
          hasPosition: false,//卡片的位置是否已经记录
        },
        hasCommunShow: false, // confirm 框是否显示
      }

    },
    computed: {
      ...mapState(["orderDoctorId", 'caseType', "isFindDoctor",'consultationId']),
    },
    mounted() {
      this.message = this.previewSuggestionMessage.data.length ? this.previewSuggestionMessage.data[0] : this.previewSuggestionMessage.data;
      this.initData();
    },
    methods: {
      ...mapMutations(['addRenderSuggestionNum', 'setOrderDoctorId', 'setEnsureShow']),
      goKnowledgeDetail(index) {
        this.$router.push({
          name: "knowledgeDetail",
          params: this.knowledgeObj.allData[index],
        })
      },
      initData() {
        const that = this;
        that.uploadVideo = true;
        api.ajax({
          url: XHRList.getCheckSuggestion,
          method: "POST",
          data: {
            caseId: that.message.caseId,
            diagnosisId: that.message.diagnosisId,
            diagnosisType: 1,
            isValid: 1,
            firstResult: 0,
            maxResult: 1,
            sortType: 1
          },
          beforeSend() {

          },
          done(data) {
            if (data.responseObject.responseData.dataList) {
              let items = data.responseObject.responseData.dataList[0];
              //检查检验DOM添加
              if ((items.checkList && items.checkList.length > 0) || (items.inspectionList && items.inspectionList.length > 0)) {
                if (items.checkList.length > 0) {
                  that.checkSuggestObj.allData = that.checkSuggestObj.allData.concat(items.checkList);
                }
                if (items.inspectionList.length > 0) {
                  that.checkSuggestObj.allData = that.checkSuggestObj.allData.concat(items.inspectionList);
                }
                that.checkSuggestObj.allData.map(function (item, index) {
                  item.adviceId = item.checkId || item.inspectionId;
                  item.adviceName = item.checkName || item.inspectionName;
                  item.adviceTypeisAttachment = item.isAttachment;
                  item.adviceType = '3';
                });
                that.checkSuggestData('checkSuggestObj')
              }
              //患教知识DOM添加
              if (items.knowledgeList && items.knowledgeList.length > 0) {
                that.knowledgeObj.allData = items.knowledgeList;
                that.checkSuggestData('knowledgeObj')
              }
              //处置建议DOM添加
              if (items.treatmentList && items.treatmentList.length > 0) {
                that.treatmentObj.allData = items.treatmentList;
                that.checkSuggestData('treatmentObj')
              }
            }
            that.suggestResponse = true;
            that.checkResponse();
          },
          fail() {
            that.suggestResponse = true;
            that.checkResponse();
          },
        });
        that.getRecommedDoctor();
      },
      /** 邀请医生开诊 */
      inviteConsultFn(index) {
        getHasInvitedConsult({
          customerId: this.doctorObj.allData[this.currentIndex].customerId,                       //	string	是	医生id
          patientCustomerId: localStorage.getItem("userId") || '',	//string	是	患者所属用户id
          openid: localStorage.getItem("openId") || "",	            // string	是	渠道唯一id
          uuid: localStorage.getItem('unionId') || "",              // string	是	联合id（用来关联其他平台）
        }).then(data => {
          this.isClickInquiry = true;
          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseMessage == "NO DATA") {
              //未邀请过
              wx.navigateTo({
                url:`/pages/doctorMain/inviteContent?from=imScene&doctorId=${this.doctorObj.allData[this.currentIndex].customerId}&fullName=${this.doctorObj.allData[this.currentIndex].fullName}`
              })
            } else {
              //已邀请过
              wx.showToast({
                title: "您的邀请已发送成功，医生开诊后会及时通知，请耐心等候。",
                icon: "none",
                duration: 2000
              })
            }
          } else {
            console.log('获取是否邀请过医生开诊失败');
          }
        }).catch(err=>{
          console.log(err);
        })
      },
      /** 获取推荐医生 */
      getRecommedDoctor() {
        const that = this;
        api.ajax({
          url: XHRList.getRecommedDoctor,
          method: "POST",
          data: {
            diagnosisId: that.message.diagnosisId,
            caseId: this.caseId,
            patientId: this.patientId,
            isValidList: "1,2",
            firstResult: 0,
            maxResult: 9999,
            sortType: 1,
            logoUseFlag: 3
          },
          beforeSend() {

          },
          done(data) {
            if (data.responseObject.responseData.dataList) {
              that.doctorObj.allData = data.responseObject.responseData.dataList;
              console.log(data.responseObject.responseData.dataList);
              that.checkSuggestData('doctorObj');
            }
            that.doctorResponse = true;
            that.$nextTick(() => {
              that.checkResponse();
            });
            that.$emit('scrollToBottom', 500);
          },
          fail() {
            that.doctorResponse = true;
            that.$nextTick(() => {
              that.checkResponse();
            })
          },
        })
      },
      //检查响应是否都完成
      checkResponse() {
        let that = this;
        if (that.suggestResponse && that.doctorResponse) {
          this.addRenderSuggestionNum();
        }
        //渲染完成后进行定位
        if (that.$store.state.previewSuggestionNum <= that.$store.state.renderSuggestionNum) {
          that.$nextTick(function () {
            if (that.$store.state.historyStatus === "history") {
              console.log('医生数据完成');
              if (!api.getPara().suggest) {
                that.scrollToBottom();
              } else {
                let _eleArr = document.querySelectorAll(".doctor-main-box");
                let _ele = _eleArr[_eleArr.length - 1];
                console.log(_ele.parentElement.parentElement.offsetTop);
                that.scrollElement(_ele.parentElement.parentElement.offsetTop);
              }
            }
          })
        }
      },
      //检查检验数据
      checkSuggestData(param) {
        let that = this;
        if (that[param].allData.length > that[param].initNum) {
          that[param].moreBoxShow = true;
          that[param].lessData = that[param].allData.slice(0, that[param].initNum);
          that[param].tempData = that[param].lessData;
          that[param].moreData = true;
        } else {
          that[param].moreBoxShow = false;
          that[param].tempData = that[param].allData;
        }
      },
      //展示更多
      moreDataShow(param, e) {
        let that = this;
        console.log(e);
        if (that[param].allData.length - that[param].tempData.length > that[param].pageNum) {
          that[param].tempData = that[param].allData.slice(0, that[param].pageNum + that[param].tempData.length);
        } else {
          that[param].moreData = false;
          that[param].tempData = that[param].allData;
        }

      },
      //去医生主页
      goDoctorHome(index, item) {
        dataLog.createTrack({
          actionId: 14174,
        });
        // 针对于美年来源，直接进入医生主页
        if (this.caseType == '15') {
          this.queryConsult(index, item);
        } else {
          wx.navigateTo({
            url: `/pages/doctorMain/doctorMain?from=imScene&caseId=${this.caseId}&&doctorCustomerId=${this.doctorObj.allData[index].customerId}&patientId=${this.patientId}&orderSourceId=${this.consultationId}&caseType=${this.caseType}`
          });
        }
      },
      // 查询是否可以咨询
      queryConsult(index, opt) {
        if (this.isFindDoctor) {
          dataLog.createTrack({
            actionId: 14178,
            browseType: "100",
            opDesc: "审核不通过推荐医师咨询点击（小程序）",
            pushMessageId: opt.customerId,
            locationId: index,
            keyword: opt.fullName
          });
        } else {
          dataLog.createTrack({
            actionId: 14177,
            browseType: "115",
            opDesc: "立即咨询（小程序）",
            pushMessageId: opt.customerId,
            keyword: opt.fullName
          });
        }
        const that = this;
        that.isClickInquiry = false;
        that.currentIndex = index,
          api.ajax({
            url: XHRList.queryIsValid,
            method: "POST",
            data: {
              diagnosisId: that.message.diagnosisId,
              recommendId: that.doctorObj.allData[index].customerId,
              isValid: 1,
            },
            done(data) {
              console.log(data);
              if (data.responseObject && data.responseObject.responseMessage == 'NO DATA') {
                that.isClickInquiry = true;
                that.setEnsureShow(true);
              } else {
                doctorStatusInfo({
                  customerId: that.doctorObj.allData[index].customerId,
                  caseId: that.caseId,
                  patientId: that.patientId,
                  orderType: 1,
                  orderSourceType: 0,
                  sortType: 2
                }).then((data) => {
                  console.log(data);
                  if (data.conState == 1) {  //已存在咨询记录
                    that.isClickInquiry = true;
                    that.hasCommunShow = true;
                  } else {
                    // 判断如果是预约咨询，则请求预约咨询接口
                    if (opt.adviceStatus == 0 || opt.customerReviseStatus != 8) {
                      that.inviteConsultFn();
                    } else {
                      getBaseMessage({
                        "customerId": that.doctorObj.allData[index].customerId,
                        "logoUseFlag": 3
                      }).then((res) => {
                        if (res && res.responseData && res.responseData.dataList) {
                          let _baseInfoData = res.responseData.dataList[0];
                          if (_baseInfoData.authMap.state == 8) {
                            that.goConsult();
                          } else {
                            wx.navigateTo({
                              url: `/pages/doctorMain/doctorMain?from=imScene&caseId=${this.caseId}&&doctorCustomerId=${this.doctorObj.allData[index].customerId}&patientId=${this.patientId}&caseType=${this.caseType}`
                            });
                          }
                        }
                      });
                    }
                  }
                });
              }
            }
          })
      },
      //咨询
      goConsult() {
        let that = this;
        this.setOrderDoctorId(that.doctorObj.allData[that.currentIndex].customerId);
        wx.navigateTo({
          url: `/packageA/imSceneAffirmOrder/imSceneAffirmOrder`
        });
        that.isClickInquiry = true;
      },
      // 去主诊医生IM
      goDoctorIm() {
        this.hasCommunShow = false;
        wx.navigateTo({
          url: `/packageA/imSceneDoctor/imSceneDoctor?caseId=${this.caseId}&doctorCustomerId=${this.doctorObj.allData[this.currentIndex].customerId}&patientId=${this.patientId}`
        });
      },
      //收起
      lessDataShow(param, e) {
        let that = this;
        // document.body.scrollTop = that[param].position;
        that[param].moreData = true;
        that[param].hasPosition = false;
        that[param].tempData = that[param].lessData;
        // console.log($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
        that.$nextTick(function () {
          // that.scrollElement($(e.srcElement).closest('.main-message-wrapper')[0].offsetTop + $(e.srcElement).closest('.main-message-box')[0].offsetTop);
        })
      },
      goToUpload() {
        localStorage.removeItem("upload");
        if (this.$store.state.consultationState == 7 || this.$store.state.consultationState == 1 || this.$store.state.consultationState == 8) {
          this.$store.commit("setToastTips", "分诊服务已结束");
          this.$store.commit('setToastShow');
        } else {
          this.$router.push({
            name: "UploadList",
            params: this.checkSuggestObj.allData
          })
        }
      }
    },
    filters: {
      ellipsis: function (value, len) {
        if (!value) return ''
        let newStr = '',
          newLength = 0;
        for (let i = 0; i < value.length; i++) {
          if (value.charCodeAt(i) > 128) {
            newLength += 2;
          } else {
            newLength++;
          }
          if (newLength <= len) {
            newStr = newStr.concat(value[i]);
          } else {
            break;
          }
        }
        if (newLength > len) {
          newStr = newStr + "..."
        }
        return newStr;
      }
    },
    props: {
      previewSuggestionMessage: {
        type: Object
      },
      payPopupShow: {
        type: Boolean
      },
      scrollToBottom: {
        type: Function,
        default: null
      },
      scrollElement: {
        type: Function,
        default: null
      },
      caseId: {
        type: Number
      },
      patientId: {
        type: Number
      },
      showFlag: {
        type: Boolean
      }
    },
    watch: {
      showFlag(newVal, oldVal) {
        if (newVal) {
          this.getRecommedDoctor(); // 当触发 onShow 的时候重新获取推荐医生信息
        }
      }
    },
    components: {
      confirm,
    },
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">

  /*展开更多的公共样式*/
  .more-box {
    padding-top: 40px;
    font-size: 28px;
    color: #909090;
    text-align: center;
    .more-box-btn {
      padding: 0px 50px 0px 10px;

    }
    .more-btn {
      background: url("https://m.allinmed.cn/static/image/imScene/under_arrow@2x.png") no-repeat center right;
      background-size: 32px 32px;
    }
    .less-btn {
      background: url("https://m.allinmed.cn/static/image/imScene/pack_up@2x.png") no-repeat center right;
      background-size: 32px 32px;
    }
  }

  /*处置建议样式*/
  .advice-box {
    width: 690px;
    margin: 0 auto;
    .check-suggest-title {
      box-sizing: border-box;
      padding: 36px 36px 10px;
      background: #EDEEEE;
      color: #666666;
      font-size: 28px;
      border: 1px solid #E4E9EB;
      border-radius: 12px 12px 0px 0px;
      border-bottom: none;
    }
    .check-suggest-bg {
      width: 690px;
      height: 54px;
      background: url("https://m.allinmed.cn/static/image/imScene/list_style@2x.png") no-repeat;
      background-size: cover;
    }
    .check-suggest-content {
      color: #333333;
      padding: 20px 0 70px;
      font-size: 34px;
      background: #FFFFFF;
      border: 1px solid #E4E9EB;
      border-top: none;
      border-radius: 0px 0px 12px 12px;
      .check-suggest-list {
        .check-suggest-item {
          color: #222222;
          box-sizing: border-box;
          line-height: 1;
          padding: 0px 64px;
          position: relative;
          font-weight: bold;
          &::before {
            content: '';
            width: 8px;
            height: 8px;
            display: inline-block;
            position: absolute;
            top: 50%;
            margin-top: -6px;
            left: 39px;
            background: #406181;
            border-radius: 4px;
          }
        }
        .check-suggest-item + .check-suggest-item {
          margin-top: 50px;
        }
      }
      .check-suggest-btn {
        background: #2FC5BD;
        border-radius: 999px;
        width: 560px;
        margin: 56px auto 0px;
        color: #FFFFFF;
        text-align: center;
        line-height: 1;
        font-size: 36px;
        padding: 30px 0;
      }
    }
  }

  /*检查检验样式*/
  .check-suggest-box {
    width: 690px;
    margin: 0 auto;
    .check-suggest-title {
      box-sizing: border-box;
      padding: 36px 36px 10px;
      background: #EDEEEE;
      color: #666666;
      font-size: 28px;
      border: 1px solid #E4E9EB;
      border-radius: 12px 12px 0px 0px;
      border-bottom: none;
    }
    .check-suggest-bg {
      width: 690px;
      height: 54px;
      background: url("https://m.allinmed.cn/static/image/imScene/list_style@2x.png") no-repeat;
      background-size: cover;
    }
    .check-suggest-content {
      color: #333333;
      padding: 20px 0 70px;
      font-size: 34px;
      background: #FFFFFF;
      border-left: 1px solid #e4e9eb;
      border-right: 1px solid #e4e9eb;
      // border-radius:0px 0px 12px 12px;
      .check-suggest-list {
        .check-suggest-item {
          color: #222222;
          box-sizing: border-box;
          line-height: 1;
          padding: 0px 64px;
          position: relative;
          font-weight: bold;
          &::before {
            content: '';
            width: 8px;
            height: 8px;
            display: inline-block;
            position: absolute;
            top: 50%;
            margin-top: -6px;
            left: 39px;
            background: #406181;
            border-radius: 4px;
          }
        }
        .check-suggest-item + .check-suggest-item {
          margin-top: 50px;
        }
      }
      .check-suggest-btn {
        background: #2FC5BD;
        border-radius: 999px;
        width: 560px;
        margin: 56px auto 0px;
        color: #FFFFFF;
        text-align: center;
        line-height: 1;
        font-size: 36px;
        padding: 30px 0;
      }
    }
    .tips-content {
      padding: 18px 36px;
      background: #FAFAFB;
      color: #97A8BA;
      font-size: 26px;
      border: 1px solid #e4e9eb;
      border-top: none;
      border-bottom-right-radius: 21px;
      border-bottom-left-radius: 21px;
    }
  }

  //患教知识
  .knowledge-box {
    width: 690px;
    margin: 0 auto;
    .knowledge-title {
      box-sizing: border-box;
      padding: 36px 36px 10px;
      background: #EDEEEE;
      color: #666666;
      font-size: 28px;
      border: 1px solid #E4E9EB;
      border-radius: 12px 12px 0px 0px;
      border-bottom: none;
    }
    .knowledge-bg {
      width: 690px;
      height: 54px;
      background: url("https://m.allinmed.cn/static/image/imScene/list_style@2x.png") no-repeat;
      background-size: cover;
    }
    .knowledge-content {
      color: #333333;
      padding: 20px 0 0px;
      font-size: 34px;
      background: #FFFFFF;
      border: 1px solid #E4E9EB;
      border-top: none;
      border-radius: 0px 0px 12px 12px;
      .knowledge-list {
        .knowledge-item {
          color: #333333;
          box-sizing: border-box;
          padding: 38px 0px;
          margin: 0 30px;
          position: relative;
          font-weight: bold;
          .knowledge-name {
            display: inline-block;
            max-width: 480px;
          }
          .knowledge-detail {
            position: absolute;
            color: #AAAAAA;
            font-size: 28px;
            padding-right: 34px;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            background: url("https://m.allinmed.cn/static/image/imScene/right_arrow@2x.png") center right no-repeat;
            background-size: 28px 28px;
          }
        }
        .knowledge-item + .knowledge-item {
          border-top: 2px solid #F4F4F4;
        }
      }
      .more-box {
        border-top: 1px solid #F4F4F4;
        padding-bottom: 60px;
      }
    }
  }

  .doctor-tips {
    width: 690px;
    margin: 0 auto;
    height: 146px;
    background: url("https://m.allinmed.cn/static/image/imScene/card_bg.png") no-repeat;
    background-size: 100%;
    margin-bottom: 24px;
    .tips-content {
      padding: 18px 20px 20px 154px;
      font-size: 28px;
      color: #4A4A4A;
    }
  }

  /* 新推荐医生样式 */

  .main-inner-item {
    box-sizing: border-box;
    padding: 30px 0;
    width: 630px;
    background: white;
    margin: 0 auto;
    + .main-inner-item {
      border-top: 1px solid #f8f8f8;
    }
    @include clearfix();
    .ProMark {
      border: 2px solid #DDDDDD;
      border-radius: 4px;
      float: right;
      padding: 8px;
      line-height: 1;
      font-size: 22px;
      color:rgba(242,117,135,1);
      text-align: center;
      margin-right: 20px;
      background:rgba(253,241,243,1);
    }
    .priceBar {
      float: left;
      margin-top: 30px;
      .price {
        font-size: 28px;
        border-radius: 4px;
        color: #999999;
        position: relative;
        margin-top: 32px;
        &.offLine {
          color: #AAAAAA;
        }
      }
      .freeSug {
        margin-left: 16px;
        height: 46px;
        font-size: 26px;
        color: #aaaaaa;
        line-height: 46px;
        &.lineThrough {
          text-decoration: line-through;
        }
      }
      .noFreeSug {
        font-size: 30px;
        border-radius: 4px;
        color: #FC746A;
        position: relative;
        margin-top: 32px;
      }
    }
    .proMark1 {
      background:rgba(46,169,254,1);
      box-shadow:0px 8px 20px 0px rgba(37,56,77,0.04);
      color: white;
      padding: 14px 20px 14px 20px;
      font-size: 28px;
      border-radius: 8px;
      z-index: 2;
      float: right;
      margin-top: 20px;
      margin-right: 20px;
      text-align: center;
      font-weight: bold;
      line-height: 1;
      &:after {
        content: '';
      }
    }

    .line {
      width: 93%;
      height: 1px;
      padding: 0;
      background: #F9F9F9;
      overflow: hidden;
      margin-top: 10px;
      margin-left: 27px;
    }
    &-img {
      width: 124px;
      float: left;
      .dp {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        content: none !important;
      }
    }
    .sanjia {
      line-height: 45px;
      background-color: rgba(107, 214, 207, 0.16);
      font-size: 20px;
      color: #2EA9FE;
      padding: 2px 6px;
      + .main-inner-item-baseMessage-hospital{
        padding-left: 8px;
      }
    }
    &-baseMessage {
      padding-left: 122px;
      padding-top: 4px;
      min-height: 88px;
      &-name {
        font-weight: 600;
        vertical-align: middle;
        color: #25324D;
        font-size: 33px;
        max-width: 180px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        line-height: 1;
      }
      &-title {
        line-height: 1;
        vertical-align: middle;
        color: #25324D;;
        font-size: 29px;
        margin-left: 18px;
      }
      &-hospital {
        font-size: 29px;
        vertical-align: bottom;
        color: #25324d;
        line-height: 45px;
        max-width: 450px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &-department {
        font-size: 29px;
        line-height: 45px;
        vertical-align: bottom;
        margin-left: 18px;
        color: #25324d;
      }
      &-Pro {
        margin-top: 22px;
        padding-right: 30px;
        font-size: 28px;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        word-break: break-all;
        line-height: 41px;
      }
    }
  }

  //推荐医生
  .doctor-box {
    width: 690px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E4E9EB;
    border-radius: 12px;
    .doctor-header {
      border-bottom: 1px solid #F2F2F2;
      padding: 24px 0;
      .doctor-title {
        color: #333333;
        font-size: 40px;
        /*font-weight: 100;*/
        padding-left: 30px;
        position: relative;
        &::before {
          width: 6px;
          height: 24px;
          content: '';
          display: inline-block;
          position: absolute;
          left: 0;
          background: #2EA9FE;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .doctor-p{
        font-size: 30px;
        color: #333333;
        padding-left: 30px;
        margin-top: 10px;
      }
      .doctor-introduce {
        color: #333333;
        font-size: 30px;
        span {
          &::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #43CBC3;
            border-radius: 4px;
            vertical-align: middle;
            margin: -(6px) 8px 0px 30px;
          }
        }
        /*font-weight: bold;*/
        /*padding:0 30px;*/
      }
      .doctor-tips {
        border: 1px solid #F4F4F4;
        width: 650px;
        border-radius: 8px;
        color: #AAAAAA;
        font-size: 26px;
        margin: 18px auto;
        padding: 14px 0;
        text-align: center;
      }
    }
    .doctor-content {
      .doctor-list {
        padding: 0 30px;
        .doctor-item {
          padding: 56px 0;
          .doctor-item-top {
            display: flex;
            .doctor-item-img {
              margin-top: 6px;
              width: 108px;
              height: 108px;
              margin-right: 16px;
              // border-radius: 50%;
              // overflow: hidden;
              img {
                border-radius: 50%;
                width: 108px;
                height: 108px;
              }
            }
            .doctor-item-info {
              flex: 1;
              .doctor-base-info {
                display: flex;
                align-items: flex-end;
                max-width: 500px;
                @include clearfix();
                line-height: 1;
                .doctor-name {
                  color: #333333;
                  font-weight: bold;
                  font-size: 32px;
                  white-space: nowrap;
                  display: inline-block;
                  /*max-width: 160px;*/
                  //                  @include ellipsis();
                  vertical-align: text-bottom;
                }
                .doctor-post {
                  font-size: 28px;
                  color: #333333;
                  vertical-align: text-bottom;
                  margin-left: 16px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .doctor-free {
                  background: rgba(255, 222, 195, 0.45);
                  font-size: 26px;
                  padding-left: 22px;
                  padding-right: 8px;
                  border-radius: 999px 4px 4px 999px;
                  color: #FF8E32;
                  float: right;
                  position: relative;
                  &::before {
                    content: "";
                    display: block;
                    width: 6px;
                    height: 6px;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 10px;
                    background: #ffffff;
                  }
                }
              }
              .doctor-hospital {
                color: #666666;
                font-size: 28px;
                margin-top: 10px;
                @include ellipsis();
                max-width: 506px;
              }
              .doctor-good {
                font-size: 28px;
                color: #AAAAAA;
                @include ellipsis();
                margin-top: 10px;
                max-width: 506px;
              }
            }
          }
          .doctor-item-bottom {
            font-size: 28px;
            @include clearfix();
            margin-top: 40px;
            padding-left: 120px;
            .go-consult {
              float: right;
              width: 184px;
              text-align: center;
              background: #2EA9FE;
              border-radius: 52px;
              line-height: 52px;
              color: #ffffff;
            }
            .consult-price {
              line-height: 52px;
              color: #29A3A3;
              i {
                width: 28px;
                height: 28px;
                display: inline-block;
                background: url("https://m.allinmed.cn/static/image/imScene/advisory.png") no-repeat center;
                background-size: cover;
                vertical-align: -3px;
                margin-right: 4px;
              }
            }
            .free-consult {
              // float: left;
              // color: #FA787A;
              // font-weight: bold;
              // margin-top: 12px;
              display: inline-block;
              width: 120px;
              height: 44px;
              background: url("https://m.allinmed.cn/static/image/imScene/label_free.png") no-repeat center;
              background-size: cover;
              margin-left: 20px;
              vertical-align: bottom;
            }
            .free-price {
              font-size: 26px;
              color: #BBBBBB;
              top: 12px;
              margin-left: 12px;
              position: relative;
              text-decoration: line-through;
            }
            .general-money {
              float: left;
              color: #2EA9FE;
              padding-left: 34px;
              margin-top: 12px;
              background: url("https://m.allinmed.cn/static/image/imScene/money@2x.png") no-repeat left center;
              background-size: 32px 32px;
            }
          }
        }
        .doctor-item + .doctor-item {
          border-top: 1px solid #F4F4F4;
        }
      }
      .more-box.doctor-more-box {
        border-top: 1px solid #F4F4F4;
        margin: 0 0;
        padding: 34px 0;
      }
    }
  }
</style>
