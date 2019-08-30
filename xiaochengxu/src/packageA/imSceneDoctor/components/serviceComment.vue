<template>
  <section class="service-box" @click="goCommentPage()">
    <figcaption class="service--title">
      <section class="service--top">
        <h3 class="service--title">服务评价提醒</h3>
      </section>
      <ul class="service--content">
        <li class="content-top">
          <section class="content-top-left">您对{{targetMsg.nick}}医生满意吗？亲爱的患友，请您抽出宝贵的时间，对医生进行评价，为其他患友提供有价值的参考。</section>
        </li>
        <li class="content-bottom">
          点击此处对{{targetMsg.nick}}医生进行评价
          <span class="more"></span>
        </li>
      </ul>
    </figcaption>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/7/5.
   */
  import {createNamespacedHelpers} from "vuex";
  const {mapState} = createNamespacedHelpers('imSceneDoctor');

  import getServiceCommentStatus from "common/js/HttpRequest/getServiceCommentStatus";

  export default {
    data() {
      return {
        isClick: false,
      };
    },
    mounted() {

    },
    computed : {
      ...mapState(['targetMsg',]),
    },
    methods: {
      // 去评价
      goCommentPage() {
        const _this = this;
        if (_this.isClick) {
          return;
        }
        _this.isClick = true;
        getServiceCommentStatus({
          consultationId:this.orderSourceId
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
                url: `/packageD/reportNew/doctorEvaluate?doctorId=${this.customerId}&patientId=${this.patientId}&consultationId=${this.orderSourceId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
              });
            } else {
              let {status} = responseData;
              if (status == 2) {
                wx.navigateTo({
                  url: `/packageD/reportNew/doctorEvaluate?doctorId=${this.customerId}&patientId=${this.patientId}&consultationId=${this.orderSourceId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
                });
              }  else {
                wx.navigateTo({
                  url: `/packageD/reportNew/doctorEvaluateEnd?consultationId=${this.orderSourceId}`
                });
              }
            }

          } else {
            console.log('接口请求失败');
          }
          _this.isClick = false;
        }).catch( err => {
          _this.isClick = false;
          console.log(err)
        });
        // wx.navigateTo({
        //   url: `/packageD/reportNew/doctorEvaluate?doctorId=${this.customerId}&patientId=${this.patientId}&consultationId=${this.orderSourceId}&isRequest=1&patientCustomerId=${wx.getStorageSync('userId')}`
        // });
      }
    },
    props: {
      customerId: {
        type: Number
      },
      patientId: {
        type: Number
      },
      orderSourceId: {
        type: Number
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .service-box {
    margin: 35px 0;
    padding: 0 20px;
    box-sizing: border-box;
    font-size: 0;
    & > .service--title {
      border-radius: 12px;
      overflow: hidden;
      color: #222222;
      width: 690px;
      padding: 2px;
      background:linear-gradient(305deg,rgba(1,209,194,1) 0%,rgba(7,182,172,1) 100%);
      width: 690px;
      margin: 0 auto;
      font-size: 34px;
      word-break: break-all;
      box-sizing: border-box;
      .service--top {
        height: 68px;
        line-height: 68px;
        .service--title {
          font-weight: bold;
          font-size: 28px;
          color: #FFFFFF;
          &::before {
            content: "";
            display: inline-block;
            width: 32px;
            height: 24px;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.2.0/evaluate.png") no-repeat;
            background-size: cover;
            margin-right: 4px;
            margin-left: 34px;
            margin-top: 4px;
          }
        }
      }
      .service--content {
        border-radius:0 0 12px 12px;
        background: #ffffff;
        padding:22px 36px;
        .content-top {
          font-size: 32px;
          padding-bottom: 30px;
          .content-top-left {

            color: #222222;
          }
        }
        .content-bottom {
          font-size: 28px;
          color: #00B9AD;
          position: relative;
          padding-right: 60px;
          .more {
            position: absolute;
            width: 40px;
            height: 40px;
            right: 0;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/im_more.png") no-repeat;
            background-size: cover;
          }
          span {
            color: #2EA9FE;
          }
        }
        li + li.content-bottom {
          padding-top: 22px;
          border-top: 1px solid #EAEDF3;
          .more {
            top: 20px;
          }
        }
      }
    }
  }
</style>
