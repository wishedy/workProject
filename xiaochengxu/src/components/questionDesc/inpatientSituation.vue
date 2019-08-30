<template>
  <section>
    <form @submit="formSubmit" report-submit="true">
      <section class="inpatient-main">
        <section class="inpatient-contain">
          <section class="inpatient-title"><span class="inpatient-titleIcon"></span>您的住院时间是？</section>
          <section class="inpatient-list time">
            <section class="inpatientTime-contain">
              <span class="inpatientTime-iconLeft"></span>
              <p class="inpatientTime-top">{{month}}月{{day}}日</p>
              <span class="inpatientTime-iconRight"></span>
              <pickerSelect v-show="true" :timeType="1" :selectTime.sync="selectTime"
                            @selectTime="selectTimeFn"></pickerSelect>
            </section>
            <section class="inpatientTime-bottomLine"></section>
          </section>
        </section>
        <section class="inpatient-contain">
          <section class="inpatient-title"><span class="inpatient-titleIcon"></span>就诊时医生给您的诊断是什么？</section>
          <section class="inpatient-list diagnose">
            <section class="inpatientDiagnose-contain">
              <textarea class="inpatient-textarea" @input="limitStrLength(200)" v-model="doctorDiagnosis"
                        placeholder="请准确填写疾病名称" placeholder-style="color: #b2b2b2;" name="" id=""
                        cursor-spacing="50"></textarea>
            </section>
          </section>
        </section>
        <section class="inpatient-contain uploadBox">
          <upLoadPic v-if="uploadShow" :uploadType="2"></upLoadPic>
        </section>
        <!-- button按钮 -->
        <button class="inpatientBtn" @click="nextPageFn" formType="submit" type="submit">下一页</button>
      </section>
    </form>
  </section>
</template>
<script>
  /**
   * @Desc：住院患者
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Jukun on 2018/5/15.
   */
  import api from "common/js/util/util";
  import upLoadPic from "../upLoadPic/upLoadPic";
  import pickerSelect from "../picker/picker";
  import localStorage from "localStorage";
  import QuestionDesc from "common/js/questionDesc/questionDesc";
  import dataLog from "common/js/dataLog/dataLog";
  import {createNamespacedHelpers} from "vuex";

  const {mapMutations, mapState} = createNamespacedHelpers('questionDesc');

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
  };

  export default {
    name: "index",
    data() {
      return {
        itemKey: '1',   //1-门诊患者 2-住院患者 3-未就诊过
        selectTime: '',
        year: '',
        month: '',
        day: '',
        doctorDiagnosis: '',// 医生诊断
        uploadShow: true,
        isOldData: false,
        clickFlag: true
      };
    },
    onLoad() {
      wx.setNavigationBarTitle({
        title: "就诊情况"
      });
      this.getDefaultData();
    },
    mounted() {

    },
    methods: {
      ...mapMutations(['setQueryObject', 'emptyQueryObject']),
      questionItemFn(item) {
        let _this = this;
        _this.itemKey = item;
        switch (item) {
          case 1:

            break;
          case 2:

            break;
          case 3:

            break;
        }
      },
      // 限制字符串长度；
      limitStrLength(num) {
        this.doctorDiagnosis = api.getStrByteLimit(this.doctorDiagnosis, num);
      },
      selectTimeFn(time) {
        let _this = this;
        _this.year = time.year;
        _this.month = time.month;
        _this.day = time.day;
      },
      nextPageFn() {
        if (!this.clickFlag) return false;
        this.clickFlag = false;

        dataLog.createTrack({
          actionId: 14083,
        });
        if (localStorage.getItem("failUploadNum")) {
          let _failNum = localStorage.getItem("failUploadNum");
          if (_failNum>0) {
             this.toastFn(`${_failNum}张图片上传失败，点击重新上传后再次提交`);
             this.clickFlag = true;
          }else{
            this.nextPageGo()
          }
        }else{
          this.nextPageGo()
        }
      },
      nextPageGo(){
        let _this = this;
        let _data = {
          reportType: 2,                                                               //就诊类型：默认0，1-门诊患者，2-住院患者，3-未就诊
          dateType: 0,                                                                //时间类型：默认0，1-上午，2-下午，3-晚上
          doctorDiagnosis: encodeURIComponent(_this.doctorDiagnosis.replace(/\"/g, "\\\"")),                                      //医生诊断
          visitDate: _this.year + '-' + _this.month + '-' + _this.day + ' 00:00:00',
          attIds: localStorage.getItem('attIds'),
          delAttIds: _this.isOldData ? '' : localStorage.getItem('delAttIds'),
          finishTime: 1,
        }
        QuestionDesc(_data).then(res => {
          // console.log(res);
          if (res && res.responseObject && res.responseObject.responseStatus) {
            _this.uploadShow = false;
            setTimeout(() => {
              _this.doctorDiagnosis = "";
              _this.uploadShow = true;
              _this.$emit("setUpTab");
              _this.emptyQueryObject();
              _this.clickFlag = true;
              wx.navigateTo({
                url: "/packageD/surgicalDesc/surgicalDesc"
              });
            }, 100);
          }
        }).catch(err => {
          _this.clickFlag = true;
          console.log(err);
        })
      },
      formSubmit: function (e) {
        // console.log(e);
        api.ajax({
          url: XHRList.sendMessage,
          method: "POST",
          data: {
            openId: localStorage.getItem('openId'),
            formId: e.target.formId
          },
          done(res) {
          }
        });
      },
      getDefaultData() {
        let _this = this;
        this.$nextTick(() => {
          if (this.queryObject.reportType == 2) {
            this.doctorDiagnosis = this.queryObject.doctorDiagnosis;
            this.year = this.queryObject.visitDate.substring(0, 4);
            this.month = this.queryObject.visitDate.substring(5, 7);
            this.day = this.queryObject.visitDate.substring(8, 10);
            let _imgurls = this.queryObject.attList;
            if (_imgurls && _imgurls.length > 0) {
              _this.setDelAttIds(_imgurls);
              _this.isOldData = true;   //存在历史图片
            } else {
              _this.removeDelAttIds();
            }
          }
        })
      },
      setDelAttIds(imgurls) {
        let _keys = '';
        imgurls.forEach(function (item, index) {
          //ID
          if (_keys != '') {
            _keys = _keys + "," + item.id
          } else {
            _keys = item.id
          }
        })
        localStorage.setItem("delAttIds", _keys);
      },
      removeDelAttIds() {
        let _delAttIds = localStorage.getItem('delAttIds');
        if (_delAttIds && _delAttIds.toString().length > 0) {
          localStorage.removeItem("delAttIds");
        }
      },
      /** toast提示 */
      toastFn(param){
        wx.showToast({
          title: param,
          icon: 'none',
          duration: 2000
        })
      },
    },
    computed: {
      ...mapState(['queryObject']),
    },
    components: {
      upLoadPic,
      pickerSelect
    }
  };
</script>

<style lang="scss">
  .inpatient-main {
    background-color: #f2f4f7;
    padding-bottom: 88px !important;

    .inpatient-contain {
      box-sizing: border-box;
      padding: 48px 60px 0px 40px;
      .inpatient-title {
        font-size: 40px;
        color: #222222;
        line-height: 1;
        font-weight: bold;
        .inpatient-titleIcon {
          display: inline-block;
          width: 16px;
          height: 16px;
          background: #2fc5bd;
          border-radius: 50%;
          vertical-align: 6px;
          margin-right: 30px;
        }
      }
      .inpatient-list {
        margin-top: 40px;
        margin-left: 48px;
        margin-right: 24px;
        &.time {
          .inpatientTime-contain {
            background-color: #ffffff;
            padding: 34px 42.4px 34px 120px;
            position: relative;
            background: #FFFFFF;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            .inpatientTime-iconLeft {
              position: absolute;
              width: 64px;
              height: 68px;
              left: 30px;
              top: 50%;
              margin-top: -34px;
              background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/calendar.png") no-repeat;
              background-size: 64px 68px;
            }
            .inpatientTime-top {
              font-size: 36px;
              color: #444444;
            }
            .inpatientTime-bottom {
              font-size: 28px;
              color: #909090;
            }
            .inpatientTime-iconRight {
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
          .inpatientTime-bottomLine {
            margin-top: 50px;
            height: 2px;
            background: #E2E2E2;
          }
        }
        &.diagnose {
          .inpatientDiagnose-contain {
            font-size: 32px;
            line-height: 32px;
            background-color: #ffffff;
            margin-bottom: 40px;
            border: 1px solid #c9c9c9;
            border-radius: 10px;
            height: 140px;
            .inpatient-textarea {
              padding: 15px;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      &.uploadBox {
        padding: 0 40px 36px 72px;
      }
    }
    .inpatientBtn {
      width: 504px;
      height: 100px;
      background-image: linear-gradient(-90deg, #3FE6BC 6%, #07B6AC 95%);
      border-radius: 200px;
      text-align: center;
      line-height: 100px;
      margin: 0 auto;
      font-size: 36px;
      color: #FFFFFF;
      &::after {
        display: none;
      }
    }
  }
</style>
