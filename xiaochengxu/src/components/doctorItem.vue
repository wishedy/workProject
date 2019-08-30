<template>
  <section style="margin-top:20px;">
    <section class="main-inner-item" v-for="(item,index) in organization" :key="index"
    >
      <div class="main-inner-item-img" @click="goDoctorPage(item,index)">
        <img :src="item.logoUrl" class="dp">
      </div>
      <div class="ProMark" @click="goDoctorPage(item,index)" v-if="item.jobDoctorYear>5">
        {{item.jobDoctorYear>=10?'从医'+item.jobDoctorYear+'年':'从医5年以上'}}
      </div>

      <div class="main-inner-item-baseMessage" @click="goDoctorPage(item,index)">
        <p>
          <span class="main-inner-item-baseMessage-name">{{item.fullName}}</span>
          <span class="main-inner-item-baseMessage-title">{{item.medicalTitle}}</span>
        </p>
        <p style="margin-top: 1.1vw" @click="goDoctorPage(item,index)">
          <span class="sanjia" v-show="item.hospitalLevelId==1">三甲</span><span
          class="main-inner-item-baseMessage-hospital">{{item.company}}</span>
        </p>
      </div>

      <p class="main-inner-item-baseMessage-Pro" @click="goDoctorPage(item,index)">
        <span
          style="color: #222222;">擅长：</span><span>{{(item.expertise&&item.expertise.length >0)?item.expertise:showChinese(item)}}</span>
      </p>

      <div class="priceBar" style="float: left" @click="goDoctorPage(item,index)">
        <span class="price" :class="{'offLine':item.adviceStatus==0}"
              v-show="item.adviceStatus==1&&item.isFreeTimes==1">前3次回复免费</span>
        <span class="price" :class="{'offLine':item.adviceStatus==0}" v-show="item.adviceStatus==0">暂不在线</span>
        <span class="freeSug" :class="{'lineThrough':item.isFreeTimes==1}"
              v-show="item.adviceStatus==1&&item.isFreeTimes==1">￥{{item.generalPrice}}</span>
        <span class="noFreeSug" v-show="item.adviceStatus==1&&item.isFreeTimes!==1">￥{{item.generalPrice}}</span>
      </div>

      <button :hoverStopPropagation="hoverStopPropagation" class="proMark1" open-type="getUserInfo"
              @getuserinfo.stop="checkIn(item,$event)">{{item.adviceStatus==1?'去咨询':'预约咨询'}}
      </button>

    </section>
  </section>
</template>
<script>
  import api from "common/js/util/util";
  import toast from "components/toast";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import dataLog from "dataLog";
  import localStorage from "localStorage";

  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by YuxiYang on 2018/4/13.
   */
  export default {
    data() {
      return {
        hoverStopPropagation: true,
        errowShow: true,
        errMsg: '',
        jumpAnchor: true,
        activeItem: {}
      }
    },
    components: {
      toast
    },
    props: {
      organization: {
        type: Array,
        default: function () {
          return []
        }
      },
    },
    methods: {
      toastFn(param){
        wx.showToast({
          title: param,
          icon: 'none',
          duration: 2000
        })
      },
      checkIn(item, e) {
        console.log(this.jumpAnchor)
        if (!this.jumpAnchor) return false;
        this.jumpAnchor = false;
        dataLog.createTrack({
          actionId: 14145,
          pushMessageId: item.customerId,
        });
        console.log(e)
        if (item.adviceStatus == 1) {
          let doctorCustomerId = item.customerId;
          const data = {
            applicationType: '12',
            doctorId: item.customerId,
            doctorName: item.fullName
          }

          if (e.target.userInfo) {
            this.$emit('authEvent', {
              desc: true
            });
            if (localStorage.getItem("mobile") && localStorage.getItem("mobile").trim().length > 0) {
              // wx.navigateTo({
              //   url: "/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=" + doctorCustomerId + "&from=list",
              //   success: () => {
              //   }
              // });
              wx.navigateTo({
                url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
              })
            } else {
              miniLogin({
                successCallBack: (res) => {
                  console.log(res)

                  if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                    // wx.navigateTo({
                    //   url: "/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=" + doctorCustomerId + "&from=list",
                    //   success: () => {
                    //   }
                    // });
                    wx.navigateTo({
                      url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data))
                    })
                  } else {
                    wx.navigateTo({
                      url: '/packageB/consultSelectPart/consultSelectPart?query=' + encodeURIComponent(JSON.stringify(data)),
                      success: () => {
                      }
                    });
                  }
                }, failCallBack: (err) => {

                }
              });
            }
          } else {
            this.jumpAnchor = true;
            this.$emit('authEvent', {
              desc: false
            });
          }
        } else {
          let doctorCustomerId = item.customerId;
          wx.navigateTo({
            url: "/pages/doctorMain/doctorMain?doctorCustomerId=" + doctorCustomerId + "&from=list",
            success: () => {
            }
          })
        }


        /*          return new Promise((relove, rejected) => {
                    api.ajax({
                      url: api.httpEnv() + "/mcall/customer/advice/setting/v1/getCurrentByCustomerId/",
                      method: "POST",
                      data: {
                        customerId: item.customerId,
                        caseId: '',
                        patientId: '', //患者ID
                        orderType: 1,
                        orderSourceType: 0,
                        sortType: 2
                      },
                      done: (data) => {
                        if (
                          data &&
                          data.responseObject &&
                          data.responseObject.responseData &&
                          data.responseObject.responseData.dataList
                        ) {
                          let dataList = data.responseObject.responseData.dataList;
                          if (dataList.state == 1) {
                            if (dataList.remainNum > 0 || dataList.remainNum == -1) {
                              let doctorCustomerId = item.customerId;
                              this.jumpAnchor = false;
                              miniLogin({
                                successCallBack: (res) => {
                                  if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
                                    wx.navigateTo({
                                      url: "/packageE/findDoctorPatientList/findDoctorPatientList?doctorCustomerId=" + doctorCustomerId + "&from=list"
                                    });
                                  } else {
                                    wx.navigateTo({
                                      url: '/packageE/findDoctorAddPatient/findDoctorAddPatient?doctorCustomerId=' + doctorCustomerId + "&from=list"
                                    });
                                  }
                                },
                              })
                            } else {
                              this.$emit('FromChild', {msg: '抱歉，该医生今天已经没有咨询名额了', state: true});
                            }
                          } else {
                            let doctorCustomerId = item.customerId;
                            wx.navigateTo({
                              url: "/pages/doctorMain/doctorMain?doctorCustomerId=" + doctorCustomerId + "&from=list"
                            })
                          }
                        }
                      },
                      fail(err) {
                        this.finish = false;
                        rejected(err);
                      }
                    });
                  });*/


      },
      showChinese(item) {
        let itemValue = item.areasExpertise;
        if (itemValue.length>0){
          let reg = /[\u4e00-\u9fa5,]/g;
          let str = itemValue.match(reg).join("");
          let val = str.replace(/,/g, '、');
          return val;
        }else{
          return "";
        }

      },
      goDoctorPage(item, index) {

        if (!this.jumpAnchor) return false;

        this.jumpAnchor = false;
        this.$emit("clickCallback", {
          item,
          index
        });
        let doctorCustomerId = item.customerId;
        wx.navigateTo({
          url: "/pages/doctorMain/doctorMain?doctorCustomerId=" + doctorCustomerId + "&from=find"
        });


      },
    },
    onShow() {
      this.jumpAnchor = true
    },
    onLoad() {
      this.jumpAnchor = true;
    },
  }
</script>
<style lang="scss" scoped="">
  .main-inner-item {
    box-sizing: border-box;
    padding: 30px 10px 22px 0;
    margin-bottom: 20px;
    width: 710px;
    margin-left: 20px;
    margin-right: 20px;
    background: white;
    box-shadow: 0 6px 20px 0 #e6ecf1;
    border-radius: 8px;
    @include clearfix();
    .ProMark {
      background: rgba(255, 242, 242, 0.80);
      border: 2px solid rgba(255, 108, 118, 0.53);
      border-radius: 4px;
      float: right;
      // width: 150px;
      // height: 42px;
      padding: 8px;
      line-height: 1;
      font-size: 22px;
      color: #FC746A;
      margin-top: 6px;
      text-align: center;
      margin-right: 20px;
    }
    .priceBar {
      float: left;
      margin-top: 30px;
      .price {
        font-size: 30px;
        border-radius: 4px;
        color: #FC746A;
        position: relative;
        margin-top: 32px;
        margin-left: 28px;
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
        margin-left: 28px;
      }
    }
    .proMark1 {
      background: #48BAFB;
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
        margin-left: 28px;
        border-radius: 50%;
        content: none !important;
      }
    }
    .sanjia {
      margin-left: 25px;
      line-height: 45px;
      background-color: rgba(225, 243, 255, 1);
      font-size: 20px;
      color: #2EA9FE;
      padding: 2px 6px;
    }
    &-baseMessage {
      padding-left: 122px;
      &-name {
        font-weight: 600;
        vertical-align: bottom;
        padding-left: 22px;
        color: #25324D;
        font-size: 33px;
        max-width: 310px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
      &-title {
        line-height: 38px;
        vertical-align: middle;
        color: #25324D;;
        font-size: 29px;
        margin-left: 18px;
      }
      &-hospital {
        font-size: 29px;
        vertical-align: bottom;
        padding-left: 22px;
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
        max-height: 240px;
        margin-top: 22px;
        font-size: 28px;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        word-break: break-all;
        line-height: 41px;
        margin-left: 30px;
        margin-right: 30px;
      }
    }
  }
</style>
