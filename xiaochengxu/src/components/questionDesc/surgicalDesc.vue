<template>
  <section>
    <form @submit="formSubmit" report-submit="true">
      <section class="surgical-main">
        <section class="surgical-contain">
          <section class="surgical-title"><span class="surgical-titleIcon"></span>您做的是什么手术？</section>
          <section class="surgical-list diagnose">
            <section class="surgicalDiagnose-contain">
              <textarea class="surgical-textarea" @input="limitStrLength(200)" v-model.lazy='operationName'
                        placeholder="请准确填写疾病名称" placeholder-style="color: #b2b2b2;" name="" id=""
                        cursor-spacing="50"></textarea>
            </section>
            <section class="surgicalTime-bottomLine"></section>
          </section>
        </section>
        <section class="surgical-contain surgicalTime">
          <section class="surgical-title"><span class="surgical-titleIcon"></span>您的手术时间是？</section>
          <section class="surgical-list time">
            <section class="surgicalTime-contain">
              <span class="surgicalTime-iconLeft"></span>
              <p class="surgicalTime-top">{{month}}月{{day}}日</p>
              <span class="surgicalTime-iconRight"></span>
              <pickerSelect v-if="pickInit" :timeType="1" @selectTime="selectTimeFn"></pickerSelect>
            </section>
          </section>
        </section>
        <!-- button按钮 -->
        <button class="surgicalBtn" @click="submitFn()" formType="submit" type="submit">
          报到
        </button>
      </section>
    </form>
  </section>
</template>

<script>
  /**
   * @Desc：就诊情况
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/5/15.
   */
  import api from "common/js/util/util";
  import upLoadPic from "../upLoadPic/upLoadPic";
  import pickerSelect from "../picker/picker";
  import localStorage from "localStorage";

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
  };
  export default {
    name: "surgicalDesc",
    data() {
      return {
        year: '',
        month: '',
        day: '',
        operationName: '',	//string	是	手术名称
        operationDate: '',// string 手术时间
        formSubmitList: '',
        clickFlag: true,
        pickInit:true
      };
    },
    onLoad(){
      this.pickInit = true
    },
    onUnload(){
      this.pickInit = false;
      this.operationName = '';
    },
    onHide(){
      this.pickInit = false;
      this.operationName = '';
    },
    methods: {

      // 限制字符串长度；
      limitStrLength(num) {
        let _this = this;
        _this.operationName = api.getStrByteLimit(_this.operationName, num);
      },
      selectTimeFn(time) {
        let _this = this;
        _this.year = time.year;
        _this.month = time.month;
        _this.day = time.day;
      },
      submitFn() {
        //跳IM
        if (!this.clickFlag) return false;
        this.clickFlag = false;
        let _this = this;
        if (_this.operationName.trim().length > 0) {

          api.ajax({
            url: XHRList.sendMessage,
            method: "POST",
            data: {
              openId: localStorage.getItem('openId'),
              formId: _this.formSubmitList
            },
            done(res) {
            }
          });

          let _data = {
            whetherOperation: 1,   //string	是	是否手术：0-否，1-是                                 //医生诊断
            operationDate: _this.year + '-' + _this.month + '-' + _this.day + ' 00:00:00',
            operationName: encodeURIComponent(_this.operationName.replace(/\"/g, "\\\"")),
            finishTime: 1,
          }
          if (localStorage.getItem('reportId') && localStorage.getItem('reportId').trim().length > 0) {
            _data.reportId = localStorage.getItem('reportId');
          }
          api.ajax({
            url: api.httpEnv() + '/mcall/patient/report/improvement/v1/saveReportInfo/',
            method: "POST",
            data: Object.assign(_data,{
              consultationType: 1,
              consultationState: 0,
              caseType:14,
              consultationFrequency: 50,
              visitSiteId: api.getSiteId(),
            }),
            done(res) {
              if (res.responseObject.responseStatus) {
                console.log('请求成功跳转IM~');
                localStorage.removeItem('attIds');
                _this.operationName = '';
                let patientId = '';
                let _patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
                if (_patientInfo.patientId && _patientInfo.patientId.length > 0) {
                  patientId = _patientInfo.patientId;
                }
                let reportId = localStorage.getItem('reportId');
                let caseId = res.responseObject.responsePk;
                let doctorCustomerId = localStorage.getItem('doctorId');
                localStorage.setItem("caseId", res.responseObject.responsePk);
                localStorage.setItem("patientId", patientId);
                localStorage.removeItem('qrHasClosed');
                _this.clickFlag = true;
                wx.navigateTo({
                  url: '/packageA/imSceneDoctor/imSceneDoctor?caseId=' + caseId + '&doctorCustomerId=' + doctorCustomerId + '&patientId=' + patientId + '&reportId=' + reportId + "&from=report"
                });
              }
            }, fail(err) {
              _this.clickFlag = true;
            }
          })
        } else {
          wx.showToast({
            title: '请填写您的手术名称',
            icon: 'none',
          });
          setTimeout(() => {
            wx.hideToast();
          }, 2000)
          this.clickFlag = true;
        }
      },
      formSubmit: function (e) {
        console.log(e);
        if (this.formSubmitList.length == 0) {
          this.formSubmitList = e.target.formId
        } else {
          this.formSubmitList = this.formSubmitList + ',' + e.target.formId;
        }
      }
    },
    mounted() {
    },
    computed: {},
    components: {
      upLoadPic,
      pickerSelect
    }
  };
</script>

<style lang="scss">
  .surgical-main {
    background-color: #f2f4f7;
    padding-bottom: 88px !important;
    .surgical-contain {
      box-sizing: border-box;
      padding: 50px 60px 0px 40px;
      .surgical-title {
        font-size: 40px;
        color: #222222;
        line-height: 1;
        font-weight: bold;
        .surgical-titleIcon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: #2fc5bd;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 30px;
        }
      }
      .surgical-list {
        margin-top: 40px;
        margin-left: 48px;
        margin-right: 24px;
        &.time {
          .surgicalTime-contain {
            background-color: #ffffff;
            padding: 34px 42.4px 34px 120px;
            position: relative;
            background: #ffffff;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            .surgicalTime-iconLeft {
              position: absolute;
              width: 64px;
              height: 68px;
              left: 30px;
              top: 50%;
              margin-top: -34px;
              background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/calendar.png") no-repeat;
              background-size: 64px 68px;
            }
            .surgicalTime-top {
              font-size: 36px;
              color: #444444;
            }
            .surgicalTime-bottom {
              font-size: 28px;
              color: #909090;
            }
            .surgicalTime-iconRight {
              position: absolute;
              width: 26px;
              height: 26px;
              right: 42.4px;
              top: 50%;
              margin-top: -14px;
              background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/arrow_report_list.png") no-repeat;
              background-size: 26px 26px;
            }
          }
        }
        &.diagnose {
          .surgicalDiagnose-contain {
            background-color: #ffffff;
            height: 140px;
            margin-bottom: 40px;
            /*box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.06);*/
            border-radius: 10px;
            border: 1px solid #c9c9c9;
            .surgical-textarea {
              padding: 15px;
              font-size: 32px;
              line-height: 32px;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }
          }
          .surgicalTime-bottomLine {
            margin-top: 50px;
            height: 2px;
            background: #e2e2e2;
          }
        }
      }
      &.uploadBox {
        padding: 0 40px 100px 72px;
      }
      &.surgicalTime {
        padding-bottom: 60px;
      }
    }
    .surgicalBtn {
      width: 504px;
      height: 100px;
      background-image: linear-gradient(-90deg, #3fe6bc 6%, #07b6ac 95%);
      border-radius: 200px;
      text-align: center;
      line-height: 100px;
      margin: 0 auto;
      font-size: 36px;
      color: #ffffff;
      &::after {
        display: none;
      }
    }
  }
</style>
