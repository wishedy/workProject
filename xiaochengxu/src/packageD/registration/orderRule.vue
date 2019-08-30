<template>
  <section class="rule-main">
    <section class="booking">
            <span class="booking-title boking-first">
                <span class="title-strong">1</span><i class="title-text">预约时间范围</i>
            </span>
      <span class="booking-content">1.您可预约7日内的号源。</span>
      <span class="booking-content">2.每日12：00停止当日上午挂号，17：30停止当日全部挂号。</span>
    </section>
    <section class="booking">
            <span class="booking-title">
                <span class="title-strong">2</span><i class="title-text">预约实名制</i>
            </span>
      <span class="booking-content">网上预约挂号采取实名制注册预约，请您如实提供就诊人员的真实姓名、有效身份证号和手机号等有效基本信息。</span>
    </section>
    <section class="booking">
            <span class="booking-title">
                <span class="title-strong">3</span><i class="title-text">预约取号</i>
            </span>
      <span
        class="booking-content">1.预约成功后，请患者于就诊当日携带有效证件到医院一层服务台验证预约信息（核对与预约登记实名信息一致的本人有效证件）和取号，如验证不符则医院不能提供相应的诊疗服务。</span>
      <span class="booking-content">2.取号时间：上午就诊患者，就诊当日12：00前取号。下午就诊患者，就诊当日下午17：30前取号。过时未取号者，预约作废。</span>
      <span class="booking-content">3.取号地点：一层服务台。</span>
    </section>
    <section class="booking">
            <span class="booking-title">
                <span class="title-strong">4</span><i class="title-text">医生停诊</i>
            </span>
      <span class="booking-content">如遇特殊情况医生停诊，给您造成的不便敬请谅解。医生临时停诊，工作人员将会用电话方式及时通知您，请配合更改就诊日期或更换其他医生，请您保持电话畅通。</span>
    </section>
    <section class="booking">
            <span class="booking-title">
                <span class="title-strong">5</span><i class="title-text">交通指南</i>
            </span>
      <span class="booking-content">重庆市渝北区冉家坝金易E世界4栋</span>
    </section>
  </section>
</template>


<script>
  /*
  * @Desc:预约须知
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by zh on  2019/5/27
  *
  */
  import dataLog from 'common/js/dataLog/dataLog'

  export default {
    data() {
      return {}
    },
    onLoad() {
      console.log('预约须知加载完毕')
    },

    onShow() {
      dataLog.enterBrowse();
      console.log('预约须知页面显示')
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  .rule-main {
    width: 690px;
    margin: 0 auto;
    color: #444;
    padding: 0 0 100px;
    .booking {
      width: 690px;
      span {
        display: block;
      }
      .booking-title {
        &.boking-first {
          margin-top: 56px;
        }
        margin: 86px 0 40px;
        font-size: 36px;
        font-family: PingFangSC-Medium;
        font-weight: bold;
        color: rgba(39, 172, 247, 1);
        line-height: 36px;
        .title-strong {
          display: inline-block;
          vertical-align: middle;
          width: 40px;
          height: 40px;
          margin-right: 14px;
          border-radius: 4px;
          text-align: center;
          font-size: 32px;
          line-height: 40px;
          color: #fff;
          background: linear-gradient(#2ea9fe, #38e5fe);
        }
        .title-text {
          display: inline-block;
          vertical-align: middle;
          margin-top: -3px;
        }
      }
      .booking-content {
        font-size: 32px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(68, 68, 68, 1);
        line-height: 60px;
        margin-bottom: 24px;
      }
    }
  }
</style>
