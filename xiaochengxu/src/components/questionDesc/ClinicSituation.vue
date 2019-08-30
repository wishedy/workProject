<template>
  <section>
    <form @submit="formSubmit" report-submit="true">
      <section class="clinic-main">
        <section class="clinic-contain">
          <section class="clinic-title"><span class="clinic-titleIcon"></span><span class="clinic-titleText">您找{{doctorName}}医生看病的时间是？</span></section>
          <section class="clinic-list time">
            <section class="clinicTime-contain" @click="selectTimeBtnFn">
              <span class="clinicTime-iconLeft"></span>
              <p class="clinicTime-top">{{month}}月{{day}}日</p>
              <p class="clinicTime-bottom">{{hour}}</p>
              <span class="clinicTime-iconRight"></span>
            </section>
            <section class="clinicTime-bottomLine"></section>
          </section>
        </section>
        <section class="clinic-contain">
          <section class="clinic-title"><span class="clinic-titleIcon"></span><span class="clinic-titleText">就诊时医生给您的诊断是什么？</span></section>
          <section class="clinic-list diagnose">
            <section class="clinicDiagnose-contain">
              <textarea v-show="!pickerShow" class="clinic-textarea" @input="limitStrLength(200)" v-model="doctorDiagnosis" :placeholder="placeholder" name="" id="" placeholder-class="placeholderClass" cursor-spacing="50"></textarea>
            </section>
          </section>
        </section>
        <section class="clinic-contain uploadBox">
          <upLoadPic v-if="uploadShow" :uploadType="1"></upLoadPic>
        </section>
        <!-- button按钮 -->
        <button class="clinicBtn" @click="nextPageFn" formType="submit" type="submit">
          下一页
        </button>
        <pickerSelect v-if="pickerShow" :times="{year:year,month:month,day:day,hour:hour,num:num}" :timeType="2"
                      :pickerShow.sync="pickerShow" @cancleTime="cancleTimeFn"
                      @selectTime="selectTimeFn"></pickerSelect>
      </section>
    </form>
  </section>
</template>
<script>
  /**
   * @Desc：门诊患者
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
  const {mapMutations,mapActions,mapState} = createNamespacedHelpers('questionDesc');

  const XHRList = {
    sendMessage: api.httpEnv() + '/mcall/log/tocure/patient/mini/v1/create/'
  };

  export default {
    name: "index",
    data() {
      return {
        itemKey: "1", //1-门诊患者 2-住院患者 3-未就诊过
        pickerShow: false,
        timeObj: "",
        year: '',
        month: "",
        day: "",
        hour: "上午",
        num: 0,
        doctorDiagnosis: '', // 医生诊断
        doctorName: '',
        placeholder: "请准确填写疾病名称",
        uploadShow: false,
        isOldData: false,
        clickFlag: true
      };
    },
    methods: {
      ...mapMutations(['setQueryObject','emptyQueryObject']),
      // ...mapActions(["showToast"]),
      getCurrentTime() {
        let _this = this;
        let dataTemp = new Date();
        _this.year = dataTemp.getFullYear();
        _this.month = dataTemp.getMonth() + 1;
        _this.day = dataTemp.getDate();
        // _this.hour = _this.getHour(dataTemp);
        _this.doctorName = localStorage.getItem("doctorName");
      },
      // 限制字符串长度；
      limitStrLength(num) {
        this.doctorDiagnosis = api.getStrByteLimit(this.doctorDiagnosis, num);
      },
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
      selectTimeBtnFn() {
        this.pickerShow = true;
      },

      selectTimeFn(time) {
        let _this = this;
        _this.year = parseInt(time.year);
        _this.month = time.month;
        _this.day = time.day;
        _this.hour = time.hour;
        _this.num = time.num;
      },
      getHour(_date) {
        let _this = this;
        var _time = _date.getHours();
        var _text = "";
        if (_time >= 6 && _time < 12) _text = "上午";
        else if (_time >= 12 && _time < 18) _text = "下午";
        else _text = "晚上";
        return _text;
      },
      nextPageFn() {
        if (!this.clickFlag) return false;
        this.clickFlag = false;
        dataLog.createTrack({
          actionId: 14082,
        });
        if (localStorage.getItem("failUploadNum")) {
          let _failNum = localStorage.getItem("failUploadNum");
          if (_failNum>0) {
             this.toastFn(`${_failNum}张图片上传失败，\n点击重新上传后再次提交`);
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
          reportType: 1,                                                               //就诊类型：默认0，1-门诊患者，2-住院患者，3-未就诊
          doctorDiagnosis:encodeURIComponent(_this.doctorDiagnosis.replace(/\"/g, "\\\"")),                                      //医生诊断
          visitDate: _this.year + '-' + _this.month + '-' + _this.day + ' 00:00:00',             //就诊时间
          dateType: _this.hour == "上午" ? 1 : (_this.hour == "下午" ? 2 : 3),
          attIds: localStorage.getItem('attIds'),
          finishTime: 1,
          siteId: api.getSiteId(),
          delAttIds: _this.isOldData?'':localStorage.getItem('delAttIds')        //历史图片数据
        };
        QuestionDesc(_data).then(res => {
          if (res && res.responseObject && res.responseObject.responseStatus) {
            _this.doctorDiagnosis = '';
            _this.pickerShow = false;
            let dataTemp = new Date();
            _this.year = dataTemp.getFullYear();
            _this.month = dataTemp.getMonth() + 1;
            _this.day = dataTemp.getDate();
            // _this.getHour(dataTemp);
            _this.uploadShow = false;
            setTimeout(() => {
              _this.uploadShow = true;
              _this.emptyQueryObject();
              _this.clickFlag = true;
              wx.navigateTo({
                url: "/packageD/selectDesc/selectDesc"
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
          if (this.queryObject.reportType == 1) {
            this.doctorDiagnosis = this.queryObject.doctorDiagnosis;
            this.year = this.queryObject.visitDate.substring(0, 4);
            this.month = this.queryObject.visitDate.substring(5, 7);
            this.day = this.queryObject.visitDate.substring(8, 10);
            switch (parseInt(this.queryObject.dateType)) {
              case 1:
                this.hour = "上午";
                break;
              case 2:
                this.hour = "下午";
                break;
              case 3:
                this.hour = "晚上";
                break;
              default:
                break;
            }
            let _imgurls = this.queryObject.attList;
            if (_imgurls&&_imgurls.length>0) {
              _this.setDelAttIds(_imgurls);
              _this.isOldData = true;   //存在历史图片
            }else{
              _this.removeDelAttIds();
            }
          }else if (this.queryObject.reportType == 0) {
            _this.removeDelAttIds();
          }
        })
      },
      setDelAttIds(imgurls){
        let _keys = '';
        imgurls.forEach(function(item,index){
          //ID
          if (_keys!='') {
            _keys =_keys+","+item.id
          }else{
            _keys =item.id
          }
        })
        localStorage.setItem("delAttIds", _keys);
      },
      removeDelAttIds(){
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
    onLoad(){
      this.getDefaultData();
    },
    mounted() {
      this.getCurrentTime();

      this.uploadShow = true;
    },
    computed: {
      ...mapState(['queryObject']),
    },
    components: {
      upLoadPic,
      pickerSelect,
      QuestionDesc
    }
  };
</script>

<style lang="scss">
  .clinic-main {
    background-color: #f2f4f7;
    padding-bottom: 88px !important;

    .clinic-contain {
      box-sizing: border-box;
      padding: 50px 60px 0px 40px;
      .clinic-title {

        .clinic-titleIcon {
          display: block;
          width: 16px;
          height: 16px;
          background: #2fc5bd;
          border-radius: 50%;
          // vertical-align: 6px;
          margin-right: 30px;
          margin-top: 13px;
          float: left;
        }
        .clinic-titleText{
            display: block;
            font-size: 40px;
            color: #222222;
            line-height: 1.2;
            font-weight: bold;
            padding-left: 46px;
        }
      }
      .clinic-list {
        margin-top: 40px;
        margin-left: 48px;
        margin-right: 24px;
        &.time {
          .clinicTime-contain {
            background-color: #ffffff;
            padding: 34px 42.4px 34px 120px;
            position: relative;
            background: #ffffff;
            box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.06);
            border-radius: 10px;
            .clinicTime-iconLeft {
              position: absolute;
              width: 64px;
              height: 68px;
              left: 30px;
              top: 50%;
              margin-top: -34px;
              background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/calendar.png") no-repeat;
              background-size: 64px 68px;
            }
            .clinicTime-top {
              font-size: 36px;
              color: #444444;
            }
            .clinicTime-bottom {
              font-size: 28px;
              color: #909090;
            }
            .clinicTime-iconRight {
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
          .clinicTime-bottomLine {
            margin-top: 50px;
            height: 2px;
            background: #e2e2e2;
          }
        }
        &.diagnose {
          .clinicDiagnose-contain {
            background-color: #ffffff;
            margin-bottom: 40px;
            font-size: 32px;
            line-height: 32px;
            border: 1px solid #c9c9c9;
            border-radius: 10px;
            z-index: 0;
            height: 136px;
            .clinic-textarea {
              box-sizing: border-box;
              padding: 15px;
              width: 100%;
              height: 100%;
              font-size: 32px;
              color: #444444;
              z-index: 0;
              .placeholderClass {
                color: #b2b2b2;
              }
            }
          }
        }
      }
      &.uploadBox {
        padding: 0 40px 36px 72px;
      }
    }
    .clinicBtn {
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
