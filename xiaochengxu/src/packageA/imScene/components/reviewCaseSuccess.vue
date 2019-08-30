caseId<template>
  <section>
    <section class="main-message-box">
      <article class="main-message-box-item others-message">
        <figure class="main-message-img">
          <template v-if="isFindDoctor">
            <img src="https://m.allinmed.cn/static/image/mp/personal/profilePhoto.png" alt="">
            <!--<img class="label-assistant" src="https://m.allinmed.cn/static/image/imScene/label_assistant.png" alt="图片">-->
          </template>
          <template v-else>
            <img src="https://m.allinmed.cn/static/image/mp/index/imSceneLogo.png" alt="">
          </template>
        </figure>
        <figcaption class="medical-report-tips">
          <p>我已将您的病历信息提交至{{doctorBaseMsg.customerName}}医生，点击下方卡片，立即与{{doctorBaseMsg.customerName}}医生沟通吧~</p>
          <section class="tips-content">
            重要提示：在线咨询不能代替面诊，医生建议仅供参考。
          </section>
        </figcaption>
      </article>
    </section>
    <!--推荐医生-->
    <section class="main-message-box doctor-main-box"  data-alcode-mod='762'>
      <article class="doctor-box">
        <header class="doctor-header">
          <h3 class="doctor-title">点击卡片咨询医生</h3>
        </header>
        <section class="doctor-content" @click="goDoctorIm()" data-alcode='e178' :sps-data="getSpsData()">
          <section class="doctor-list">
            <section class="doctor-item">
              <section class="doctor-item-top">
                <figure class="doctor-item-img">
                  <img :src="doctorBaseMsg.logoUrl" alt="医生头像">
                </figure>
                <figcaption class="doctor-item-info">
                  <p class="doctor-base-info">
                    <span class="doctor-name">{{doctorName}}</span>
                    <span class="doctor-post">{{medicalTitle}}</span>
                  </p>
                  <p class="doctor-hospital"><span class="doctor-hospital-level" v-if="doctorBaseMsg.hospitalLevelId == 1">三甲</span>{{doctorBaseMsg.company}}</p>
                </figcaption>
              </section>
              <p class="doctor-good" v-if="doctorBaseMsg.illnessNameList.length"><span style="color: #25324D;">擅长：</span>{{doctorBaseMsg.illnessNameList}}</p>
              <section class="doctor-item-bottom">
                <span class="go-consult">去沟通</span>
              </section>
            </section>
          </section>
        </section>
      </article>
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
/**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/3/28.
   */
import dataLog from "dataLog";
import {createNamespacedHelpers} from "vuex";
const {mapState,} = createNamespacedHelpers('imScene');

export default {
  data() {
    return {
      // doctorName:'',
    };
  },
  computed: {
    ...mapState(['isFindDoctor','doctorBaseMsg','caseId','patientInfo']),
    medicalTitle () {
      let result = [];
      this.doctorBaseMsg.medicalTitle.split(",").forEach((element, index) => {
        if (element.length > 0) {
          result.push(element.substring(2));
        }
      });
      result = result.join(",");
      if (!result) return '';
      let newStr = '',
        newLength = 0;
      for (let i = 0; i < result.length; i++) {
        if (result.charCodeAt(i) > 128) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength <= 22) {
          newStr = newStr.concat(result[i]);
        } else {
          break;
        }
      }
      if (newLength > 22) {
        newStr = newStr + "..."
      }
      return newStr;
    },
    doctorName () {
      if (!this.doctorBaseMsg.customerName) return ''
      let newStr = '',
        newLength = 0;
      for (let i = 0; i < this.doctorBaseMsg.customerName.length; i++) {
        if (this.doctorBaseMsg.customerName.charCodeAt(i) > 128) {
          newLength += 2;
        } else {
          newLength++;
        }
        if (newLength <= 8) {
          newStr = newStr.concat(this.doctorBaseMsg.customerName[i]);
        } else {
          break;
        }
      }
      if (newLength > 8) {
        newStr = newStr + "..."
      }
      return newStr;
    }
  },
  methods: {
    // 埋点参数
    getSpsData(opt, index) {
      dataLog.createTrack({
        actionId: 14179,
        pushMessageId:this.doctorCustomerId,
        keyword:this.doctorBaseMsg.customerName
      });
      return `pushMassageId:${this.doctorCustomerId};keyword:${this.doctorBaseMsg.customerName}`
    },
    // 去与专业医生聊天
    goDoctorIm(){
      dataLog.createTrack({
        actionId: 14179,
        browseType: "100",
        opDesc: "审核通过推荐医师咨询点击（小程序）",
        pushMessageId:this.doctorCustomerId,
        keyword:this.doctorBaseMsg.customerName
      });
      wx.navigateTo({
        url: `/packageA/imSceneDoctor/imSceneDoctor?from=im&caseId=${this.caseId}&&doctorCustomerId=${this.doctorCustomerId}&patientId=${this.patientInfo.patientId}`
      });
    },
    //去医生主页
    goDoctorHome() {
      wx.navigateTo({
        url: `/pages/doctorMain/doctorMain?from=im&caseId=${this.caseId}&&doctorCustomerId=${this.doctorCustomerId}&patientId=${this.patientInfo.patientId}`
      });
    },
  },
  props: {
    doctorCustomerId: {
      type: String
    },
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">
.doctor-box {
    width: 690px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 1px solid #E4E9EB;
    border-radius: 12px;
    .doctor-header {
      border-bottom: 1px solid #F2F2F2;
      .doctor-title {
        color: #333333;
        font-size:40px;
        /*font-weight: 100;*/
        line-height: 1;
        padding: 40px 30px;
        position: relative;
        &::before {
          width: 6px;
          height: 24px;
          content: '';
          display: inline-block;
          position: absolute;
          left: 0;
          background: #43CBC3;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .doctor-introduce {
        color: #333333;
        font-size:30px;
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
        font-size:26px;
        margin: 18px auto;
        padding: 14px 0;
        text-align: center;
      }
    }
    .doctor-content {
      .doctor-list {
        padding: 0 30px;
        .doctor-item {
          padding: 60px 0;
          .doctor-item-top {
            display: flex;
            align-items:center;
            padding-bottom: 26px;
            .doctor-item-img {
              width: 110px;
              height: 110px;
              margin-right: 24px;
              // border-radius: 50%;
              // overflow: hidden;
              img {
                border-radius: 50%;
                width: 110px;
                height: 110px;
              }
            }
            .doctor-item-info {
              flex: 1;
              .doctor-base-info {
                @include clearfix();
                line-height: 1;
                .doctor-name {
                  color: #25324D;
                  font-weight: bold;
                  font-size:32px;
                  display: inline-block;
                  vertical-align: middle;
                }
                .doctor-post {
                  font-size:28px;
                  color: #25324D;;
                  vertical-align: middle;
                  margin-left: 20px;
                }
              }
              .doctor-hospital {
                color: #666666;
                box-sizing: border-box;
                font-size:28px;
                margin-top: 16px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                max-width: 500px;
                .doctor-hospital-level {
                  background-color: rgba(107, 214, 207, 0.16);
                  border-radius: 4px;
                  font-size: 22px;
                  color: #2EA9FE;
                  padding: 2px 6px;
                  margin-right : 14px;
                  vertical-align: 4px;
                }
              }
            }
          }
          .doctor-good {
            font-size:28px;
            color: #AAAAAA;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .doctor-item-bottom {
            font-size:28px;
            margin-top: 56px;
            .go-consult {
              width: 520px;
              margin: 0 auto;
              display: block;
              text-align: center;
              background: #00B9AD;
              border-radius: 999px;
              line-height: 96px;
              color: #ffffff;
            }
            .consult-price{
              line-height: 52px;
              color: #29A3A3;
              i{
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
              font-size:26px;
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
