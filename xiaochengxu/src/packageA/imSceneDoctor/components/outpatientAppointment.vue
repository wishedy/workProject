<template>
  <section class="appointment-box">
    <article class="appointment-box-item">
      <figcaption class="appointment-content appointment-box">
        <section class="appointment-top">
          <h3 class="appointment-title">门诊预约</h3>
        </section>
        <section class="appointment-middle">
          <ul class="patient-info-list">
            <li class="patient-info-item">
              <section class="patient-info-top">患者：</section>
              <section class="patient-info-bottom"><span>{{patientInfo.patientName}}</span><span>{{patientInfo.sexName}}性</span><span>{{patientInfo.age}}岁</span></section>
            </li>
            <li class="patient-info-item">
              <section class="patient-info-top">身份证：</section>
              <section class="patient-info-bottom"><span>{{certificateCodeEncrypt}}</span></section>
            </li>
            <li class="patient-info-item">
              <section class="patient-info-top">就诊时间：</section>
              <section class="patient-info-bottom"><span>{{contentData.clinicTime}}</span><span>{{contentData.weekDay}}</span><span>{{contentData.timeType}}</span></section>
            </li>
          </ul>
          <section v-if="clinicType == 1" class="appiontment-status pendding">预约中</section>
          <section v-if="clinicType == 2" class="appiontment-status fail">预约失败</section>
          <section v-if="clinicType == 3" class="appiontment-status success">预约成功</section>
        </section>
        <section class="appointment-bottom">
          温馨提示：预约成功后以短信形式提醒，请保持手机畅通
        </section>
      </figcaption>
      <figure class="appointment-img">
        <img :src="logoUrl" alt="">
      </figure>
    </article>
  </section>
</template>
<script type="text/ecmascript-6">
/**
 * @Desc：
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by lichenyang on 2018/5/2.
 */
import {createNamespacedHelpers} from "vuex";
const {mapState,mapGetters} = createNamespacedHelpers('imSceneDoctor');

import util from "common/js/util/util";

import ajax from "common/js/util/ajax";

const XHRList = {
  clinicStatus: util.httpEnv() + "/mcall/customer/clinic/v1/getMapById/" // 门诊预约单信息
};
export default {
  data() {
    return {
      showDeleteMsg: false,
      contentData: {},
      clinicType: 0
    };
  },
  mounted() {
    this.mountedInit();
    console.log(this.contentMessage);
  },
  computed: {
    ...mapState(["logoUrl", "patientInfo"]),
    ...mapGetters(["certificateCodeEncrypt"])
  },
  methods: {
    mountedInit() {
      this.contentData = this.contentMessage.content.data;
      this.getOutpatientInfo();
    },
    // 获取预约状态
    getOutpatientInfo() {
      let that = this;
      ajax({
        url: XHRList.clinicStatus,
        method: "POST",
        data: {
          clinicId: this.contentData.clinicId,
          isValid: 1 // string	是	是否有效
        },
        beforeSend(config) {},
        done(param) {
          console.log(param);
          if (param.responseObject.responseStatus && param.responseObject) {
            let datas = param.responseObject.responseData.dataList[0];
            that.clinicType = datas.clinicType;
          } else {
            console.log("接口返回状态失败");
          }
        },
        fail(err) {
          console.log(err);
        }
      });
    }
  },
  props: {
    contentMessage: {
      type: Object
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.appointment-box {
  margin: 35px 0;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 0;
  @include clearfix();
  &-item {
    float: right;
    & > .appointment-img {
      display: inline-block;
      vertical-align: top;
      & > img {
        width: 60px;
        height: 60px;
        content: normal !important;
        vertical-align: top;
        border-radius: 50%;
      }
    }
    & > .appointment-content {
      display: inline-block;
      vertical-align: top;
      border-radius: 21px;
      overflow: hidden;
      color: #222222;
      background: #ffffff;
      border: 1px solid #01d1c2;
      box-shadow: 0 1px 0 0 #76dad3;
      border-top-right-radius: 0;
      width: 514px;
      margin: 0 30px;
      padding: 0;
      font-size: 34px;
      word-break: break-all;
      box-sizing: border-box;
      & > p {
        background-size: 200%;
      }
      & > img {
        content: normal !important;
        width: 150px;
        height: 150px;
        vertical-align: middle;
      }
      .appointment-top {
        // border-top-left-radius: 21px;
        background-image: linear-gradient(-125deg, #01d1c2 11%, #07b6ac 100%);
        line-height: 64px;
        .appointment-title {
          font-weight: normal;
          font-size: 28px;
          color: #ffffff;
          &::before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 26px;
            background: url("https://m.allinmed.cn/static/image/imScene/label_02.png")
              no-repeat;
            background-size: cover;
            vertical-align: -2px;
            margin: 0 12px 0 38px;
          }
        }
      }
      .appointment-middle {
        position: relative;
        background: url("https://m.allinmed.cn/static/image/imScene/bg_02.png")
          no-repeat right bottom;
        background-size: 180px 222px;
        .patient-info-list {
          box-sizing: border-box;
          padding: 36px 0 36px 34px;
          font-size: 32px;
          .patient-info-item {
            .patient-info-top {
              color: #888888;
            }
            .patient-info-bottom {
              margin-top: 12px;
              color: #222222;
              span + span {
                margin-left: 16px;
              }
            }
          }
          .patient-info-item + .patient-info-item {
            margin-top: 24px;
          }
        }
        .appiontment-status {
          position: absolute;
          width: 172px;
          right: 0;
          top: 24px;
          font-size: 24px;
          line-height: 48px;
          border-radius: 22px 0 0 22px;
          &::before {
            content: "";
            display: inline-block;
            width: 24px;
            height: 24px;
            vertical-align: -1px;
            margin: 0 8px 0 22px;
          }
          &.success {
            background-color: rgba(7, 182, 172, 0.1);
            color: #29a3a3;
            &::before {
              background: url("https://m.allinmed.cn/static/image/imScene/label_succes.png")
                no-repeat;
              background-size: cover;
            }
          }
          &.pendding {
            background-color: rgba(255, 152, 49, 0.1);
            color: #ff8811;
            &::before {
              background: url("https://m.allinmed.cn/static/image/imScene/label_wait.png")
                no-repeat;
              background-size: cover;
            }
          }
          &.fail {
            background-color: rgba(250, 120, 122, 0.1);
            color: #fa787a;
            &::before {
              background: url("https://m.allinmed.cn/static/image/imScene/label_failure.png")
                no-repeat;
              background-size: cover;
            }
          }
        }
      }
      .appointment-bottom {
        background: #fafafb;
        font-size: 26px;
        color: #97a8ba;
        box-sizing: border-box;
        padding: 20px 36px;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
