<template>
  <section class="healthCardDetail-main">
    <section class="healthCardDetail-banner">
      <section class="healthCardDetail-content">
        <section class="healthCardDetail-card">
          <section class="healthCard-title">居民健康卡</section>
          <section class="healthCard-info">
            <section class="healthCard-name">
              <span class="healthCard-name-one">姓名：</span>
              <span class="healthCard-name-two">{{name}}</span>
            </section>
            <section class="healthCard-sex">
              <span class="healthCard-sex-one">性别：</span>
              <span class="healthCard-sex-two">{{sex}}</span>
            </section>
          </section>
          <section class="healthCard-number">
            居民健康卡号码：
            <span class="healthCard-number-two">{{cardNumber}}</span>
          </section>
          <section class="healthCard-producer">国家卫生健康委员会监制</section>
        </section>
      </section>
    </section>
  </section>
</template>

<script>
/*
 * @Desc: 居民健康卡详情页
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/4/2
 *
 */
export default {
  data() {
    return {
      cardNumber: "110********302",
      name: "**杰",
      sex: "男"
    };
  },
  onLoad(options) {
    // Do some initialize when page load.
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
    // Do something when page close.
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.healthCardDetail-main {
  height: 100%;
  .healthCardDetail-banner {
    height: 100%;
    background: #f8f9e9;
    .healthCardDetail-content {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/bg_03.png")
        no-repeat center;
      background-size: 100% 100%;
      padding-top: 100px;
      .healthCardDetail-card {
        width: 590px;
        height: 366px;
        background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/bg_02@3x.png")
          no-repeat center;
        background-size: 100% 100%;
        margin: 0 auto;
        .healthCard-title {
          font-size: 36px;
          color: #222222;
          text-align: center;
          padding-top: 30px;
          font-weight: bold;
        }
        .healthCard-info {
          @include clearfix();
          padding: 35px 70px 0;
          .healthCard-name {
            font-size: 34px;
            color: #222222;
            float: left;
            .healthCard-name-two {
              font-weight: bold;
            }
          }
          .healthCard-sex {
            font-size: 34px;
            float: right;
            color: #222222;
            padding-right: 70px;
            .healthCard-sex-two {
              font-weight: bold;
            }
          }
        }
        .healthCard-number {
          font-size: 30px;
          color: #222222;
          padding-left: 70px;
          padding-top: 20px;
          .healthCard-number-two {
            font-weight: bold;
          }
        }
        .healthCard-producer {
          font-size: 26px;
          color: #000000;
          text-align: center;
          padding-top: 70px;
        }
      }
    }
  }
}
</style>
