<template>
  <section class="service-box">
    <article class="service-box-item">
      <figure class="service-img">
        <img :src="targetLogo" alt="">
      </figure>
      <figcaption class="service-content service-box">
        <section class="service-top">
          <h3 class="service-title">门诊邀约</h3>
        </section>
        <section class="service-middle">
          <ul class="doctor-info-list">
            <li class="doctor-info-top">{{targetMsg.nick}}</li>
            <li class="doctor-info-bottom" v-if="targetMsg.medical">{{targetMsg.medical}}</li>
          </ul>
          <section class="go-invite on"  data-alcode='e188' @click="goInvite()">去预约</section>
          <!-- <section class="go-invite off">去预约</section> -->
        </section>
      </figcaption>
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
   * Created by lichenyang on 2018/5/3.
   */
  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapGetters} = createNamespacedHelpers('imSceneDoctor');

  export default {
    data() {
      return {
        showDeleteMsg: false
      };
    },
    mounted() {

    },
    computed: {
      ...mapState(['targetMsg', 'patientInfo']),
      ...mapGetters(['targetLogo']),
      doctorTitleName() {
        let result = [];
        if (this.targetMsg.title.includes("_")){
          this.targetMsg.title.split(",").forEach((element, index) => {
            if (element.length > 0) {
              result.push(element.substring(2));
            }
          });
          return result.join(",");
        }else{
          return this.targetMsg.title;
        }
      },
    },
    methods: {
      goInvite () {
        if (this.patientInfo.idcardStatus) {
          wx.navigateTo({
            url: `/packageA/outpatientCalender/outpatientCalender?doctorCustomerId=${this.doctorCustomerId}&caseId=${this.caseId}&patientId=${this.patientId}`
          });
        } else {
          wx.navigateTo({
            url: `/packageA/nameAuthentication/nameAuthentication?routerName=outpatientCalender&patientId=${this.patientId}&doctorCustomerId=${this.doctorCustomerId}&caseId=${this.caseId}`
          });
        }
      },
    },
    props: {
      contentMessage: {
        type: Object
      },
      targetData: {
        type: Object
      },
      userData: {
        type: Object
      },
      caseId:{
        type:Number
      },
      currentIndex: {
        type: Number
      },
      deleteMsgIndex: {
        type: Number
      },
      doctorCustomerId:{
        type:Number
      },
      patientId:{
        type:Number
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.service-box {
  margin: 35px 0;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 0;
  @include clearfix();
  &-item {
    float: left;
    &>.service-img {
      display: inline-block;
      vertical-align: top;
      &>img {
        width: 60px;
        height: 60px;
        content:normal !important;
        vertical-align: top;
        border-radius: 50%;
      }
    }
    &>.service-content {
      display: inline-block;
      vertical-align: top;
      border-radius: 21px;
      overflow: hidden;
      color: #222222;
      background: #FFFFFF;
      border: 1px solid #7EBBE4;
      box-shadow: 0 1px 0 0 #94CBF0;
      border-top-left-radius: 0;
      width: 514px;
      margin: 0 30px;
      padding: 0;
      font-size:34px;
      word-break: break-all;
      box-sizing: border-box;
      & > p{
        background-size: 200%
      }
      &>img {
        content:normal !important;
        width: 150px;
        height: 150px;
        vertical-align: middle;
      }
      .service-top{
        // border-top-left-radius: 21px;
        background-image: linear-gradient(-125deg, #2899E6 11%, #198BE2 100%);
        line-height: 64px;
        .service-title{
          font-weight: normal;
          font-size: 28px;
          color: #FFFFFF;
          &::before {
            content: "";
            display: inline-block;
            width: 20px;
            height: 26px;
            background: url("https://m.allinmed.cn/static/image/imScene/label_02.png") no-repeat;
            background-size: cover;
            vertical-align: -2px;
            margin:0 12px 0 38px;
          }
        }
      }
      .service-middle{
        position: relative;
        background: url("https://m.allinmed.cn/static/image/imScene/bg_01.png") no-repeat right bottom;
        background-size: contain;
        .doctor-info-list{
          box-sizing: border-box;
          padding: 40px 0 38px 34px;
          .doctor-info-top{
            font-size: 36px;
            color: #222222;
          }
          .doctor-info-bottom{
            font-size: 32px;
            color: #555555;
            margin-top: 10px;
          }
        }
        .go-invite{
          position: absolute;
          right: 34px;
          top: 15%;

          font-size: 30px;
          line-height: 60px;
          padding: 0 30px;
          border-radius: 100px;
          background: #FFFFFF;
          &::after {
            content: "";
            display: inline-block;
            width: 12px;
            height: 26px;
            vertical-align: -1px;
            margin-left: 4px;
          }
          &.on{
            border: 1px solid #2899E6;
            color: #2899E6;
            &::after {
              background: url("https://m.allinmed.cn/static/image/imScene/arrow.png") no-repeat;
              background-size: cover;
            }
          }
          &.off{
            border: 1px solid #DDDDDD;
            color: #BBBBBB;
            &::after {
              background: url("https://m.allinmed.cn/static/image/imScene/arrow_cannot.png") no-repeat;
              background-size: cover;
            }
          }
        }
      }

    }
  }
}
</style>
