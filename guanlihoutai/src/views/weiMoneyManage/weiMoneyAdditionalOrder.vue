<template>
  <section class="main">
    <h1 class="TopTitle">唯币补单充值</h1>

    <section class="form-content">
      <div class="center">
        <div class="tip">
          仅限IOS端充值订单补单使用
        </div>
        <el-form :model="formData"
                 :rules="rules"
                 :label-position="'left'"
                 label-width="110px"
                 class="form-container"
                 ref="orderForm">
          <h2 class="code-info-title"><i class="icon-bg"></i><span>充值信息</span></h2>
          <el-form-item label="充值订单号" class="order-number" prop="chargeOrderNumber" :required="true">
            <el-input
              type="input"
              min="1"
              v-model.trim="formData.chargeOrderNumber"
              maxlength="19"
              class="el-input-width el-input-name"
              @input="clearInput"
            ></el-input>
            <a href="javascript:void(0)" @click="validateOrder" class="validate">校验</a>
            <span class="validate-postscript">iOS终端支付成功但未成功发货的充值订单号</span>
          </el-form-item>
          <el-form-item label="充值唯币数" prop="chargeTotalAmount">
            <el-input
              maxlength="19"
              class="el-input-width el-input-name"
              v-model.trim="formData.chargeTotalAmount" disabled="disabled"></el-input>
            币
          </el-form-item>

          <div style="margin-top: 80px;"/>

          <h2 class="code-info-title"><i class="icon-bg"></i><span>用户信息</span></h2>
          <el-form-item label="目标用户" prop="teacherList">
            <el-input
              maxlength="20"
              class="el-input-width el-input-name"
              v-model.trim="formData.fullName" disabled="disabled"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24" :offset="12">
              <el-button class="publishBtn" :disabled="!orderIfValid" type="primary" @click="submitForm">
                提交
              </el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </section>
  </section>
</template>

<script>
/*
* 补单
* */

import apiUrlConfig from '@/api/apiUrlConfig';

import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm.js';
import validator from '@/assets/js/utils/validator';

export default {
  name: 'weiMoneyAdditionalOrder',
  components: {},
  data() {
    return {
      orderIfValid: false,
      formData: {
        chargeOrderNumber: null, // 订单号
        chargeTotalAmount: null, // 唯币
        fullName: '', // 目标用户
        customerId: '',
        chargeOrderState: null
      },
      rules: {
        chargeOrderNumber: [{
          required: true,
          message: '请输入订单编号（订单号必须为数字）',
          trigger: ''
        }, {
          validator: validator.isPositiveInteger,
          message: '订单号必须为数字',
          trigger: 'blur'
        }, {
          min: 0, max: 19, message: '订单号最长不超过19位', trigger: 'blur'
        }]
      }
    };
  },
  methods: {
    // 提交表单
    submitForm() {
      let _this = this;
      this.$refs.orderForm.validate((valid) => {
        if (valid && this.orderIfValid) {
          this.$allin_confirm({
            title: '提示',
            content: '是否确认补单？',
            done: function() {
              let params = {
                customerIdList: _this.formData.customerId,
                chargeOrderNumber: _this.formData.chargeOrderNumber,
                chargeTotalAmount: _this.formData.chargeTotalAmount,
                chargeOrderState: _this.formData.chargeOrderState,
                operator: localStorage.getItem('userLoginName'),
                chargeType: 3 // 2-赠送充值,3-补单充值
              };

              axios({
                url: apiUrlConfig.weiMoneyRecharge.url,
                method: apiUrlConfig.weiMoneyRecharge.type,
                data: params
              }).then(function(res) {
                comm.closeLoading();
                if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                  // 补单成功 提示 加 清空原表单
                  _this.$allin_confirm({title: '提示', content: '补单成功', type: 'notice'});
                  _this.formData = {
                    chargeOrderNumber: null, // 订单号
                    chargeTotalAmount: null, // 唯币
                    fullName: '', // 目标用户
                    customerId: '',
                    chargeOrderState: null
                  };
                }
                else {
                  _this.$allin_confirm({title: '提示', content: '补单失败', type: 'notice'});
                }
              });
            }
          });
        }
        else {

        }
      });
    },
    clearInput() {
      this.orderIfValid = false;
      this.formData.chargeTotalAmount = null;
      this.formData.fullName = null;
      this.formData.customerId = '';
    },
    // 点击较验
    validateOrder() {
      let _this = this;
      _this.$refs.orderForm.validateField('chargeOrderNumber');
      this.$refs.orderForm.validate((valid) => {
        if (valid) {
          let params = {
            chargeOrderNumber: _this.formData.chargeOrderNumber
          };
          axios({
            url: apiUrlConfig.orderValidation.url,
            method: apiUrlConfig.orderValidation.type,
            params: params
          }).then(function(res) {
            comm.closeLoading();
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              let temp = res.data.responseObject.responseData;
              // 较验成功
              _this.orderIfValid = true;
              _this.formData.chargeTotalAmount = temp.chargeTotalAmount;
              _this.formData.fullName = temp.fullName;
              _this.formData.customerId = temp.customerId.toString();
              _this.formData.chargeOrderState = temp.chargeOrderState;
              // 较验失败
            }
            else {
              _this.$allin_confirm({title: '提示', content: '该订单不符合补单规则', type: 'notice'});
              // 禁用提交按钮
              _this.orderIfValid = false;
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/pages/editDetailEUI/euiReset.scss";

.main {
  width: 1200px;
  margin: 0 auto;
  padding-top: 1px;
  .form-content {
    /*width: 1200px;*/
    margin: 36px auto 36px;
    padding: 36px 0 5px;
    background: #ffffff;
    width: 1200px;
    .center {
      width: 1100px;
      margin: 0 auto;
      input, textarea {
        background: rgba(247, 249, 252, 1);
        border-radius: 3px;
      }
      .validate {
        color: #0099CC;
        font-size: 12px;
        text-decoration: underline;
        cursor:pointer;
      }
      .tip {
        width: 90%;
        height: 50px;
        line-height: 50px;
        background: #DFEEF9;
        border: 1px solid #49B6DA;
        margin: 20px 0;
        padding-left: 20px;
        color: #333333;
        font-size: 14px;
      }

      .code-title {
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #222222;
        letter-spacing: 0;
        line-height: 20px;
        margin: 32px 0 25px;
      }
      .el-form-item {
        width: 700px;
        .el-input {
          position: relative;
          font-size: 14px;
          display: inline-block;
        }
      }
      .el-input-width {
        width: 460px;
      }

      .el-tag-item {
        margin-left: 5px;
        margin-bottom: 5px;
      }
      .btn-add-teacher {
        margin-left: 10px;
      }

      .teacher-tag-list {
        width: 360px;
        height: 90px;
        border: 1px solid #eeeeee;
        border-radius: 5px;
        float: left;
        overflow: scroll;

      }
      .code-info-title {
        margin-bottom: 20px;

        .icon-bg {
          background: #0687FF;
          width: 3px;
          display: inline-block;
          vertical-align: middle;
          height: 16px;
          border-radius: 1px;
          margin-right: 5px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
  .TopTitle {
    font-size: 20px;
    font-weight: 600;
    color: rgba(44, 52, 58, 1);
    line-height: 20px;
    margin: 32px 0 20px 0;
  }
  .order-number {
    width: 920px !important;
  }
  .validate-postscript {
    margin-left: 30px;
  }
}

</style>
