<template>
  <section class="authenticationMain">
    <NormalLoading v-if="finish"></NormalLoading>
    <section class="authen-topBanner">
    </section>
    <section class="authen-container" data-alcode-mod='758'>
      <section class="authen-center">
        <ul class="authen-info-list">
          <li class="authen-title">患者真实姓名</li>
          <li class="authen-input">
            <input type="text" v-model="name"
                   @blur="validateName(name)"
                   @input="inputMaxLength('name',40)"
                   name="patientName"
                   placeholder="请填写真实姓名">
          </li>
        </ul>
        <ul class="authen-info-list">
          <li class="authen-title">身份证号</li>
          <li class="authen-input">
            <input type="text" v-model="idCard"
                   name="idCard"
                   @blur="validateCard(idCard)"
                   @input="inputMaxLength('idCard',18)"
                   placeholder="填写患者证件号码">
          </li>
        </ul>
      </section>
      <section class="tips-box">
        认证信息是您在唯医骨科后续就诊的凭证，请谨慎填写；认证过程如有任何疑问,请<span @click="goFeedback()">联系我们</span>
      </section>
      <button data-alcode='e172' class="finish-btn" @click="validate()">
        完成
      </button>
    </section>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>


</template>

<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/03/26.
   */

  import api from 'common/js/util/util';
  import checkIdCard from 'common/js/HttpRequest/checkIdCard'
  import BackIndex from "components/backIndex"; // 返回首页组件

  import storage from "common/js/miniUtil/localStorage";
  import {createNamespacedHelpers} from "vuex";

  const {mapState, mapMutations} = createNamespacedHelpers('imSceneDoctor');
  export default {
    data() {
      return {
        name: '',//患者姓名
        idCard: '',// 身份证号
        errorMsg: "",// 错误提示话术
        errorShow: false, // toust提示框是否显示
        patientId: 0,// 患者id
        finish: false,
        backIndexShow: false, // 返回首页是否显示
      }
    },
    computed: {
      ...mapState(['patientInfo'])
    },
    onLoad () {
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
    },
    mounted() {
      const query = this.$root.$mp.query;
      this.patientId = query.patientId;
      this.caseId = query.caseId;
      this.doctorCustomerId = query.doctorCustomerId;
      this.name = this.patientInfo.patientName;
      wx.setNavigationBarTitle({
        title: `实名认证`
      });
      this.init();
    },
    methods: {
      ...mapMutations(['setPatientInfo']),
      init() {
        this.patientInfo.certificateCode && (this.idCard = this.patientInfo.certificateCode);
      },
      validateName(name) {
        let isPass = (/[`~!！？@#$%^&*()_+<>?:"{},，。\/;'[\] ]/).test(name) || (/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g).test(this.nameValue) || (/^(?=.*\d.*\b)/).test(this.nameValue);

        if (name.length === 0) {
          this.toastShow("请输入患者姓名");
          return false;
        } else if (isPass) {
          this.toastShow("请输入真实姓名");
          return false;
        } else {
          return true;
        }
      },
      validateCard(idCard) {
        if (idCard.length === 0) {
          this.toastShow("请输入身份证号码");
          return false;
        } else if (!this.idCardMethod(idCard)) {
          this.toastShow("请输入正确的身份证号码");
          return false;
        } else {
          return true;
        }
      },
      idCardMethod(value) {
        let city = {
          11: "北京",
          12: "天津",
          13: "河北",
          14: "山西",
          15: "内蒙古",
          21: "辽宁",
          22: "吉林",
          23: "黑龙江 ",
          31: "上海",
          32: "江苏",
          33: "浙江",
          34: "安徽",
          35: "福建",
          36: "江西",
          37: "山东",
          41: "河南",
          42: "湖北 ",
          43: "湖南",
          44: "广东",
          45: "广西",
          46: "海南",
          50: "重庆",
          51: "四川",
          52: "贵州",
          53: "云南",
          54: "西藏 ",
          61: "陕西",
          62: "甘肃",
          63: "青海",
          64: "宁夏",
          65: "新疆",
          71: "台湾",
          81: "香港",
          82: "澳门",
          91: "国外 "
        };
        let tip = "",
          pass = true;
        value = value.toUpperCase();
        if (value.length == 15) {
          //15位身份证直接过
          pass = false;
        } else if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)) {
          //tip = "身份证号格式错误";
          pass = false;
        } else if (!city[value.substr(0, 2)]) {
          //tip = "地址编码错误";
          pass = false;
        } else if (value.length == 18) {
          //18位身份证需要验证最后一位校验位
          value = value.split('');
          //∑(ai×Wi)(mod 11)
          //加权因子
          let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
            parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],//校验位
            sum = 0,
            ai = 0,
            wi = 0;
          for (let i = 0; i < 17; i++) {
            ai = value[i];
            wi = factor[i];
            sum += ai * wi;
          }
          if (parity[sum % 11] != value[17]) {
            //tip = "校验位错误";
            pass = false;
          }
        }
        return pass;
      },
      // 验证字段函数
      validate() {
        if (this.validateName(this.name) && this.validateName(this.idCard)) {
          this.checkCardFun();
        }
      },
      // input 事件
      inputMaxLength(attr, length) {
        this[attr] = api.getStrByteLen(this[attr], length);
      },
      // toast 框显示
      toastShow(errorMsg = "需要传入错误话术") {
        wx.showToast({
          title: errorMsg,
          icon: "none",
          duration: 2000
        })
      },
      // 验证姓名与身份证是否符合函数
      checkCardFun() {
        const that = this;
        if (this.finish) return false;
        this.finish = true;
        checkIdCard({
          patientId: that.patientId,
          name: that.name,
          cardno: that.idCard,
        }).then((data) => {
            let {responseObject: {responseStatus, responseData, responseMessage}} = data;
            this.finish = false;
            if (responseStatus) {
              let {dataList, dataList: {code, msg, patientName, patientAge, patientSex}} = responseData;
              if (!!dataList) {
                if (code === "0") {
                  const _patientInfo = that.patientInfo;
                  _patientInfo.idcardStatus = true;
                  that.setPatientInfo(_patientInfo);
                  wx.redirectTo({
                    url: `/packageA/outpatientCalender/outpatientCalender?doctorCustomerId=${that.doctorCustomerId}&caseId=${that.caseId}&patientId=${that.patientId}`
                  });
                } else {
                  that.toastShow('患者姓名与身份证信息不符');
                }
              }
            } else {
              this.finish = false;
              console.log("验证失败");
            }
          }
        ).catch((err) => {
          this.finish = false;
          console.log(err);
        })
      },
      // 去意见反馈页
      goFeedback() {
        wx.navigateTo({
          url: `/pages/feedback/feedback?from=im&customerId=${storage.getItem('userId')}&doctorCustomerId=${this.doctorCustomerId}`
        });
      }
    },
    components:{
      BackIndex
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .authenticationMain {
    height: 100%;
    position: relative;
    background: url("https://m.allinmed.cn/static/image/background_wave.png") no-repeat bottom center #F2F2F2;
    background-size: 100% 272px;
    // 头部图片
    .authen-topBanner {
      width: 100%;
      height: 260px;
      background: url("https://m.allinmed.cn/static/image/img00/contactUs/background.png") no-repeat center;
      background-size: 100% 100%;
    }
    // 主要内容
    .authen-container {
      position: absolute;
      width: 100%;
      top: 206px;
    }
    // 输入框的盒子
    .authen-center {
      box-sizing: border-box;
      width: 690px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 50px 0px 50px 54px;
      .authen-info-list {
        font-size: 0px;
        color: #333333;
        li {
          font-size: 34px;
          display: inline-block;
          vertical-align: middle;
          input {
            border: none;
            width: 100%;
          }
        }
        .authen-title {
          width: 238px;
        }
        .authen-input {
          width: 380px;
          overflow: hidden;
          input {
            height: 100%;
          }
        }
      }
      ul + ul {
        margin-top: 60px;
      }
    }
    // 提示的盒子
    .tips-box {
      margin: 46px auto 0px;
      font-size: 30px;
      color: #909090;
      width: 660px;
      span {
        color: #29A3A3;
      }
    }
    // 完成按钮
    .finish-btn {
      width: 560px;
      margin: 226px auto 0px;
      display: block;
      background: #2EA9FE;
      box-shadow: 0 4px 12px 0 rgba(47, 197, 189, 0.40);
      border-radius: 50px;
      font-size: 36px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 100px;
    }
  }
</style>
