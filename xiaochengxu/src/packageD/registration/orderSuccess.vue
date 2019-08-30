<template>
  <section class="order-success-main">
    <Share ref="share" @success="onCreateSuccess"> </Share>
    <article class="content">
      <div><span class="label">患者姓名</span> <span class="info">{{ patientName }}</span></div>
      <div><span class="label">就诊状态</span> <span class="info">{{ visitState == 1 ? '待就诊' : '已就诊' }}</span></div>
      <div><span class="label">就诊时间</span> <span class="info">{{ registDate }} {{ clinicDuration }}</span></div>
      <div><span class="label">科室</span> <span class="info">{{ deptName }}</span></div>
      <div><span class="label">医生</span> <span class="info">{{ doctorName }} {{ doctorTitle }}</span></div>
      <!-- <div><span class="label">医事服务费</span> <span class="info">¥ {{ amount }}</span></div> -->
    </article>
    <section class="submit">
      <form  @click="savepic" report-submit="true">
        <button>保存本页为图片</button>
      </form>
    </section>
  </section>
</template>

<script>
  /*
   * @Desc:预约成功
   * @Usage:
   * @Notify：
   * @Depend：
   * Created by zh on  2019/5/27
   *
   */
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import Share from "components/share";
  import api from 'common/js/util/util';
  import dataLog from "dataLog";

  export default {
    data () {
      return {
        id: 0,
        patientName: '',
        patientId: '',
        visitState: 1,
        clinicDuration: '',
        registDate: '',
        deptName: '',
        doctorName: '', 
        doctorTitle: '',
        amount: 0,
        certificateCode: ''
      }
    },
    components: {
      Share
    },
    onLoad(option) {

      wx.showLoading({
        title: "正在加载..."
      });
      this.id = option.registId;
      var _this = this;

      api.ajax({
        url: api.httpEnv() + '/mcall/tocure/register/basic/getAppointmentDetail/',
        method: "POST",
        data: {
          id: this.id
        },
        done(response) {
          wx.hideLoading();
          if (response && response.responseObject && response.responseObject.responseData) {
            _this.patientName = response.responseObject.responseData.patientName;
            _this.visitState = response.responseObject.responseData.visitState;
            _this.clinicDuration = response.responseObject.responseData.clinicDuration;
            _this.registDate = response.responseObject.responseData.registDate;
            _this.deptName = response.responseObject.responseData.deptName;
            _this.doctorName = response.responseObject.responseData.doctorName;
            _this.doctorTitle = response.responseObject.responseData.doctorTitle;
            _this.amount = response.responseObject.responseData.amount;
            _this.patientId = response.responseObject.responseData.patientId;
            _this.certificateCode = response.responseObject.responseData.certificateCode;
            dataLog.enterBrowse({
              keyword: _this.patientId
            });
          }
        }
      })
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    methods:{
      savepic() {
        dataLog.createTrack({
          actionId: 14259
        });
        const params = {
          width: 702,
          height: 922,
          backgroundUrl: 'https://m.allinmed.cn/static/image/mp/index/1.5.0/sharebg.png',
          texts: [
            {
              x: 478,
              y: 146,
              text: '预约成功',
              fontSize: 48,
              color: '#272727'
            },
            {
              x: 96,
              y: 260,
              text: '姓名',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 670,
              y: 260,
              text: this.patientName,
              textAlign: 'right',
              fontSize: 30,
              color: '#222'
            },
            {
              x: 150,
              y: 370,
              text: '身份证号',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 670,
              y: 370,
              text: this.certificateCode,
              textAlign: 'right',
              fontSize: 30,
              color: '#222'
            },
            {
              x: 150,
              y: 470,
              text: '就诊科室',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 670,
              y: 470,
              text: this.deptName,
              textAlign: 'right',
              fontSize: 30,
              color: '#222'
            },
            {
              x: 150,
              y: 570,
              text: '就诊时间',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 670,
              y: 570,
              text: this.registDate + ' ' + this.clinicDuration,
              textAlign: 'right',
              fontSize: 30,
              color: '#222'
            },
            {
              x: 150,
              y: 680,
              text: '医院地址',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 670,
              y: 680,
              text: '重庆市百灵路1号金易E世界4栋',
              textAlign: 'right',
              fontSize: 30,
              color: '#222'
            },
            {
              x: 650,
              y: 790,
              text: '请您在就诊当日凭本人有效身份证件到一层服',
              fontSize: 30,
              color: '#888'
            },
            {
              x: 200,
              y: 830,
              text: '务台取号。',
              fontSize: 30,
              color: '#888'
            }
          ],
          leftButton: {
            type: "close",
            text: "关闭",
            flag: true,
            actionId: 14261
          },
          rightButton: {
            type: "save",
            text: "确认保存",
            flag: true,
            actionId: 14260
          }
        }
        this.$refs.share.create(params);
      }
    }
  };
</script>

<style lang="scss" scoped>
.order-success-main {
  width: 100%;
  height: 100%;
  padding: 30px;
  .content {
    div {
      width: 690px;
      height: 128px;
      overflow: hidden;
      border-bottom: 1px solid #F5F5F6;
      &:last-child {
        border: none;
      }
      .label {
        display: inline-block;
        color: #888;
        float: left;
        line-height: 126px;
        font-size: 32px;
      }
      .info {
        color: #222;
        line-height: 126px;
        font-size: 34px;
        float: right;
      }
    }
  }
  .submit {
    position: absolute;
    left:0;
    bottom: 80px;
    width: 100%;
    form {
      width: 100%;
      text-align: center;
      margin: 0 auto;
      button {
        width: 420px;
        height: 96px;
        line-height: 94px;
        color: #2EA9FE;
        border: 2px solid #2EA9FE;
        background-color: #fff;
      }
    }
  }
}
</style>
