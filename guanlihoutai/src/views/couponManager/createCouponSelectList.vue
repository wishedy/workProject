<template>
  <section class="create-coupon-select-list-container">
    <h3>优惠券/创建优惠券</h3>
    <section class="create-coupon-select-area">
      <ul>
        <li>
          <el-card class="box-card">
            <h3>通用优惠券</h3>
            <h5>全店通用</h5>
            <p>买家购买店铺内任意知识商品，凭券抵扣现金</p>
            <el-button type="primary" @click="createCouponBtnOnClick(0)">立即创建</el-button>
          </el-card>
        </li>
        <li>
          <el-card class="box-card">
            <h3>商品优惠券</h3>
            <h5>指定商品可用</h5>
            <p>买家购买指定知识商品，凭券抵扣现金</p>
            <el-button type="primary" @click="createCouponBtnOnClick(1)">立即创建</el-button>
          </el-card>
        </li>
      </ul>
    </section>
  </section>
</template>

<script>
/**
 * 功能描述：创建优惠券-类型选择页
 * 参数说明：
 * 注意事项：
 *
 * Create by YaoQiao on 2019/4/27
 */

export default {
  name: 'createCouponSelectList',
  methods: {
    createCouponBtnOnClick(type) {
      // type === 0 ,通用优惠券；type === 1,商品优惠券
      if (type === 0) {
        let _url = this.$router.resolve({path: '/generalCouponDetail'});
        window.open(_url.href, '_blank');
      }
      else if (type === 1) {
        let _url = this.$router.resolve({path: '/commodityCouponDetail'});
        window.open(_url.href, '_blank');
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .create-coupon-select-list-container {
    width: 1200px;
    margin: 0 auto;
    background: #F6F7FA;
    margin-top: 32px;

    h3 {
      ont-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }

    .create-coupon-select-area {

      ul {
        li {
          display: inline-block;
          width: 400px;
          margin-right: 80px;
          text-align: center;
          .box-card {
            h3 {
              margin-bottom: 10px;
            }
            h5 {
              font-weight: normal;
              color: #999999;
            }
            p {
              margin: 30px 0;
            }
          }
        }
      }
    }
  }
</style>
