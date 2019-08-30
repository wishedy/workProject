<template>
    <section class="add-patient-content">
        <article class="add-patient-content-item">
            <aside>姓名</aside>
            <figure class="add-patient-input">
                <input type="text" placeholder="请填写真实姓名" id="patientName" @blur="validateBlur"
                    maxlength=10
                    @input="inputMaxLength('username', 40)"
                    placeholder-style="color:#aaaaaa;"
                    :disabled='updateInfo'
                    name="username"
                    v-model="username">
            </figure>
        </article>
        <article class="add-patient-content-item">
            <aside>性别</aside>
            <figure class="add-patient-input">
                <section class="add-patient-sex-selector " :class="{'on':sexSelect==1}" @click="selectSex(1)">
                    <i class="add-patient-selector"></i>
                    <span>男</span>
                </section>
                <section class="add-patient-sex-selector women" :class="{'on':sexSelect==2}" @click="selectSex(2)">
                    <i class="add-patient-selector"></i>
                    <span>女</span>
                </section>
            </figure>
        </article>
        <article class="add-patient-content-item">
            <aside>出生日期</aside>
            <figure class="add-patient-input birth-box">
                <p class="contentMessage" :class="{'on':birthClickNum > 1}">{{birthClickNum > 1 ? birthInput : '请选择'}}</p>
                <picker class="time-picker" mode="date" :value="defaultTime" start="1900-01-01" :end="currTime"
                        style="position: absolute;top: 0;width: 100%;height: 100%;" @change="selectTimeFn">
                <view class="picker" style="position: absolute;top: 0;width: 100%;height: 100%;">
                    <!-- 当前选择: {{date}} -->
                </view>
                </picker>
            </figure>
        </article>
        <form class="add-patient-btn" @submit="formSubmit" report-submit="true">
            <button v-if="infoFlag" @click="addPerson">完成</button>
            <button v-if="!infoFlag" class="disabled">完成</button>
        </form>
        <Toast :content="toastContent" v-if="toastShow"></Toast>
    </section>
</template>
<script type="text/ecmascript-6">
/*
  * @Desc:添加就诊人
  * @Usage:
  * @Notify：
  * @Depend：
  * Created by 朱宁 on  2019/6/24
  *
  */

import api from 'common/js/util/util'
import Toast from "components/toast"
import sendFormId from "common/js/HttpRequest/sendFormId"
import {mapMutations, mapActions, mapState, mapGetters} from "vuex"

export default {
  data () {
    return {
      username: '',
      sexSelect: -1, // 性别选择控制
      birthClickNum: 0, // 生日是否选择了,因为初始化的执行一次，所以用数字 ++
      pickerShow: false, // 生日选择器是否显示，每次进来都让其重新初始化；
      birthInput: "", // 出生日期
      defaultTime: '',
      currTime: "",
      customerId: '',
      mobile: '',
      infoFlag: false
    }
  },
  components: {
    Toast,
  },
  onLoad () {
    this.username = ''
    this.sexSelect = -1
    this.birthClickNum = 0
    this.pickerShow = true
    this.birthInput = ''
    try { this.customerId = wx.getStorageSync('userId') } catch (e) {}
    try { this.mobile = wx.getStorageSync('mobile') } catch (e) {}
    this.getPickerTime()
  },
  computed: {
    ...mapGetters(['toastShow', 'toastContent', 'updatePatient', 'isLogin'])
  },
  methods: {
    ...mapActions(['showToast','hideToast', 'setPatientMessage', 'setIsLogin']),
    ...mapMutations(['addUpdatePatientList']),
    /** 发送formId */
    formSubmit (e) { sendFormId(e.target.formId); },
    addPerson () {
      var _this = this;
      let sex = '未选择'
      if (this.sexSelect === 1) {
        sex = '男'
      } else if (this.sexSelect === 2) {
        sex = '女'
      } else {
        sex = '未选择'
      }
      let age = '28'
      let now = new Date()
      let nowYear = now.getFullYear()
      let pYear = this.birthInput.substr(0,4)
      let pMonth = this.birthInput.substr(5,2)
      age = (now.getMonth() + 1 > pMonth) ? (nowYear - pYear + 1) : (nowYear - pYear)

      // console.log(`姓名：${this.username}，性别：${sex}，出生日期：${this.birthInput}，年龄：${age}`)

      wx.showLoading({ title: "正在加载..." });
      const param = {
        customerId: this.customerId || 1550555211623,
        patientName: this.username,
        patientSex: this.sexSelect,
        patientBirthday: this.birthInput,
        mobile: this.mobile
      }
      api.ajax({
        url:  api.httpEnv() + '/mcall/customer/patient/relation/v1/create2/',
        method: "POST",
        data: param,
        done(response) {
          try { wx.setStorageSync('patientInfo', JSON.stringify(response.responseObject.responseData.dataList)) } catch (e) { }
          wx.hideLoading();
          _this.infoFlag = false;
          wx.navigateBack({ delta: 1 });
        }
      })
    },
    // input最大长度事件
    inputMaxLength(attr, length) { this[attr] = api.getStrByteLen(this[attr], length); },
    // input失焦事件
    validateBlur() {
      this.infoFlag = this.infoJudge();
      if (this.username.trim() === "") this.infoFlag = false;
    },
    /** 选择性别时的函数 */
    selectSex(index) {
      this.sexSelect = index;
      this.infoFlag = this.infoJudge();
    },
    /** 生日 picker 选择回调函数 */
    selectTimeFn(e) {
      let _this = this;
      let time = {};
      let _timeArr = e.target.value.split("-");
      //月份去零
      time.month = (_timeArr[1] > 9) ? _timeArr[1] : (_timeArr[1].split("0")[1]);
      //天数去零
      time.day = (_timeArr[2] > 9) ? _timeArr[2] : _timeArr[2].split("0")[1];
      time.year = _timeArr[0];
      _this.birthClickNum++;
      // _this.birthInput = time.year + '-' + time.month.toString().padStart(2, '0') + "-" + time.day.toString().padStart(2, '0') ;
      if (time.month < 10)  time.month = '0' + time.month;
      if (time.day < 10) time.day = '0' + time.day;
      _this.birthInput = `${time.year}-${time.month }-${time.day}`;
      this.infoFlag = this.infoJudge();
    },
    getPickerTime () {
      let _this = this;
      this.birthClickNum = 1;
      const time = {};
      let dataTemp = new Date();
      time.year = dataTemp.getFullYear();
      time.month = dataTemp.getMonth() + 1;
      time.day = dataTemp.getDate();
      _this.currTime = `${time.year}-${time.month}-${ time.day}`;
      _this.defaultTime = `2000-${time.month}-${ time.day}`;
    },
    confirmModal(info, callbackFlag, callbackFlagVal, cancleFlag) {
      var _this = this;
      if (!this.modalFlag) {
        this.modalFlag = true;
        wx.showModal({
          content: info || "出错了",
          showCancel: cancleFlag || false,
          confirmText: '知道了',
          confirmColor: '#333',
          success: function (res) {
            _this.modalFlag = false;
            if (res.confirm) {
              callbackFlag && (callbackFlag = callbackFlagVal);
            }
          }
        })          
      }

    },
    infoJudge() { return (this.username.trim() != '' && (this.sexSelect != -1) && (this.birthInput != '')) }
  },
  onUnload() {
    this.pickerShow = false
    this.hideToast()
  },
}
</script>
<style lang="scss" scoped>
.add-patient-content {
	padding: 15px 60px 0;
	&-item {
		height: 140px;
		line-height: 140px;
		border-bottom: 1px solid #D8D8D8;
		font-size: 0;
		position: relative;
		&>aside {
			display: inline-block;
			vertical-align: middle;
			width: 196px;
			font-size: 34px;
			color: #909090;
			letter-spacing: 0;
			/*line-height: 34px;*/
		}
		.codeText {
			position: absolute;
			right: 0px;
			top: 0;
			font-size: 34px;
			color: #2FC5BD;
			letter-spacing: 0;
			&::after {
				content: "";
				height: 30px;
				width: 4px;
				background: #ccc;
				position: absolute;
				left: -14px;
				top: 50%;
				margin-top: -15px;
			}
		}
		.codeCountdown {
			position: absolute;
			right: 0px;
			top: 0;
			font-size: 34px;
			color: #777;
			letter-spacing: 0;
			i {
				display: inline-block;
			}
		}
		&>.add-patient-input {
			position: relative;
			display: inline-block;
			vertical-align: middle;
			/*width: 440px;*/
			font-size: 34px;
			max-width: 380px;
			color: #666666;
			&.birth-box {
				width: 50%;
			}
			&.code-box {
				width: 50%;
			}
			input[disabled] {
				color: #555;
			}
			.icon-clear {
				display: inline-block;
				position: absolute;
				width: 54px;
				height: 54px;
				top: 50%;
				margin-top: -27px;
				right: 150px;
				z-index: 2;
				background: url("https://m.allinmed.cn/static/image/img00/login/close_button.png") center center no-repeat;
				background-size: 38px 38px;
			}
			.contentMessage {
				color: #AAAAAA;
				&.on {
					color: #222222;
				}
			}
			::-webkit-input-placeholder {
				/* WebKit browsers */
				color: #AFAFAF;
			}
			:-moz-placeholder {
				/* Mozilla Firefox 4 to 18 */
				color: #AFAFAF;
				opacity: 1;
			}
			::-moz-placeholder {
				/* Mozilla Firefox 19+ */
				color: #AFAFAF;
				opacity: 1;
			}
			:-ms-input-placeholder {
				/* Internet Explorer 10+ */
				color: #AFAFAF;
			}
			&>input {
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				/*padding: 26px 30px;*/
				background: none;
				color: #222;
				font-size: 34px;
			}
			&>select {
				min-height: 60px;
				background: none;
				border: none;
				width: 100%;
				outline: medium;
			}
			&>.codeInput {
				width: 60%;
			}
		}
		.add-patient-sex-selector {
			display: inline-block;
			width: 164px;
			vertical-align: middle;
			.add-patient-selector {
				width: 48px;
				height: 48px;
				background: url("https://m.allinmed.cn/static//image/mp/consult/notSelect@2x.png") no-repeat;
				background-size: contain;
				display: inline-block;
				vertical-align: middle;
				margin-right: 10px;
				box-sizing: border-box;
			}
			&>span {
				display: inline-block;
				vertical-align: middle;
				color: #222222;
			}
			&.on {
				.add-patient-selector {
					background: url("https://m.allinmed.cn/static/image/mp/index/1.5.0/edit_patient.png") no-repeat;
					background-size: contain;
				}
			}
		}
	}
    .add-patient-btn {
        width: 520px;
        height: 96px;
        margin-top: 80px;
        border: 1px solid #fff;
        button {
            width: 520px;
            height: 96px;
            color: #fff;
            font-size: 36px;
            border: none;
            background-color: #27acf7;
            &.disabled {
              color: #fff;
              background-color: #ccc;
            }
        }
    }
}
</style>
