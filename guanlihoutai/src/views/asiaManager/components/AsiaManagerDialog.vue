<template>
  <el-dialog
    :visible.sync="dialogVisible"
    width="80%"
    custom-class="asia-member-dialog"
    :lock-scroll=true
    top="10vh"
    :before-close="handleClose"
    :key="formData.id"
  >
    <section slot="title" class="member-dialog-header">
      <h2>{{dialogEditTypeFormatter}}会员信息</h2>
      <p>Please fill in English. Items with an asterisk (*) next to them are mandatory.</p>
    </section>
    <section class="member-dialog-main">
      <el-form
        :model="formData"
        :rules="memberInfoFormRules"
        ref="formDom"
        label-width="180px"
        label-position="right">
        <el-form-item label="Honor" prop="honor">
          <el-select
            v-model="formData.honor"
            :class="{'backgroundGray':!formData.honor}"
            :disabled="rejectEdit"
            prop="honor"
          >
            <!--Prof. :1;  Dr. : 2;  Mr. : 3; Ms. : 4;-->
            <el-option label="Not selected" value=""></el-option>
            <el-option label="Prof." value="1"></el-option>
            <el-option label="Dr." value="2"></el-option>
            <el-option label="Mr." value="3"></el-option>
            <el-option label="Ms." value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-form-item label="name" class="name" prop="lastName">
            <el-input
              v-model.trim="formData.lastName"
              placeholder="Last Name"
              maxlength="500"
              :readonly="rejectEdit"
            ></el-input>
          </el-form-item>
          <el-form-item label="" class="name" prop="firstName" label-width="0">
            <el-input
              v-model.trim="formData.firstName"
              placeholder="First Name"
              maxlength="500"
              :readonly="rejectEdit"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="Nationality" prop="nationality">
          <el-select
            v-model="formData.nationality"
            :class="{'backgroundGray':!formData.nationality}"
            :disabled="rejectEdit"
          >
            <el-option label="Not selected" value=""></el-option>
            <el-option
              v-for="(item,index) in countryCode"
              :label="item.en"
              :value="item.code"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Contact Number" prop="contactNumber">
          <el-input
            v-model="formData.contactNumber"
            maxlength="200"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email Address" prop="emailAddress">
          <el-input
            v-model="formData.emailAddress"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <h2 class="title">Post</h2>
        <el-form-item label="Address" prop="address">
          <el-input
            v-model.trim="formData.address"
            placeholder="e.g. ROOM,BUILDING"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="City" prop="city">
          <el-input
            v-model.trim="formData.city"
            maxlength="500"
            placeholder="e.g. BEIJING"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Zip Code"
          prop="zipCode"
        >
          <el-input
            v-model="formData.zipCode"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Country" prop="country">
          <el-select
            v-model="formData.country"
            :class="{'backgroundGray':!formData.country}"
            :disabled="rejectEdit"
          >
            <el-option label="Not selected" value=""></el-option>
            <el-option
              v-for="(item,index) in countryCode"
              :label="item.en"
              :value="item.code"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <h2 class="title">Professional Qualification</h2>
        <el-form-item label="Position" prop="position">
          <el-input
            v-model.trim="formData.position"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Hospital/Practice/Institue" prop="hospital">
          <el-input
            v-model.trim="formData.hospital"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Specialty/Subspecialty" prop="specialty">
          <el-input
            v-model.trim="formData.specialty"
            maxlength="500"
            placeholder="e.g. Orthopaedics:Knee"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Area of Interest" prop="areaOfInterest">
          <el-input
            v-model.trim="formData.areaOfInterest"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <h2 class="title">Professional Qualification</h2>
        <el-form-item label="M.D./Ph.D./Where, when" prop="eduExperience">
          <el-input
            type="textarea"
            v-model.trim="formData.eduExperience"
            :rows="1"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="University Degree" prop="universityDegree">
          <el-input
            v-model.trim="formData.universityDegree"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>
        <el-form-item label="Training Received" prop="trainingReceived">
          <el-input
            v-model.trim="formData.trainingReceived"
            maxlength="500"
            :readonly="rejectEdit"
          ></el-input>
        </el-form-item>

          <!--//1 新增 2 查看 3 编辑-->
          <h3 v-if="dialogEditType!==DIALOG_EDIT_TYPE.ADD">
            会员有效期
            <el-date-picker
              v-model.trim="formData.expireTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              :readonly="rejectEdit"
            >
            </el-date-picker>
          </h3>
          <section
            class="saveMemberBtn"
            v-if="dialogEditType!==DIALOG_EDIT_TYPE.VIEW"
          >
            <span @click="saveMemberInfo">保存</span>
          </section>
      </el-form>
    </section>
  </el-dialog>
</template>
<script>
/**
   * asia弹窗组件
   * @module src/views/asiaManager/components/AsiaManagerDialog.vue
   * @desc asia后台弹窗部分
   * @author 王宁
   * @date 2019年1月14日18:22:33
   * @param {Object} [memberInfoForm]   - 表单数据
   * @param {boolean} [dialogVisible]   - 弹窗是否显示
   * @param 1||2||3||4 [dialogEditType] - 编辑类型
   * @example 调用示例
   *      <AsiaDialogEdit
             :memberInfoForm="memberInfoForm"
             :dialogVisible="dialogVisible"
             :dialogEditType="dialogEditType"
             @dialogCloseHandle="dialogCloseHandle"
          ></AsiaDialogEdit>
   */

import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import countryCode from '@/assets/js/utils/countryCode';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'asia-manager-dialog',
  props: {
    memberInfoForm: {
      type: Object,
      required: true
    },
    dialogVisible: {
      type: Boolean,
      required: true
    },
    dialogEditType: {
      type: Number,
      required: true
    }
  },
  data() {
    let contactNumberValidator = (rule, value, callback) => {
      value = value.replace(/\s/g, '');
      if (/^[0-9()（）]+$/.test(value)) {
        this.formData.contactNumber = value.replace(/（/g, '(').replace(/）/g, ')');
        callback();
      }
      else {
        callback(new Error('ENTER NUMBERS ONLY'));
      }
    };

    let zipCodeValidator = (rule, value, callback) => {
      value = value.replace(/\s/g, '');
      if (/^[a-zA-Z0-9-]*$/.test(value)) {
        this.formData.zipCode = value;
        callback();
      }
      else {
        callback(new Error('Please Enter Numbers,Letters and -'));
      }
    };

    let addressValidator = (rule, value, callback) => {
      value = value.replace(/\s/g, '');
      if (value) {
        callback();
      }
      else {
        callback(new Error('Please enter address'));
      }
    };

    let cityValidator = (rule, value, callback) => {
      value = value.replace(/\s/g, '');
      if (value) {
        callback();
      }
      else {
        callback(new Error('Please enter City'));
      }
    };
    let specialtyValidator = (rule, value, callback) => {
      value = value.replace(/\s/g, '');
      if (value) {
        callback();
      }
      else {
        callback(new Error('Please enter Specialty/Subspecialty'));
      }
    };

    const DIALOG_EDIT_TYPE = {
      ADD: 1,
      VIEW: 2,
      EDIT: 3
    };

    return {
      DIALOG_EDIT_TYPE: DIALOG_EDIT_TYPE,
      formData: {
        honor: '', // 荣誉称号
        firstName: '',
        lastName: '',
        nationality: '', // 国家
        contactNumber: '',
        emailAddress: '',
        address: '',
        city: '',
        zipCode: '', // 邮寄压缩码
        country: '',
        position: '', // 位置
        hospital: '',
        specialty: '', // 专业
        areaOfInterest: '', // 兴趣领域
        eduExperience: '', // 教育经历
        universityDegree: '', // 教育经历
        payWith: '', // 支付方式
        dollar: '', // 美金（单位为分）
        trainingReceived: '',
        expireTime: '', // 会员过期时间
        id: ''
      },
      memberInfoFormRules: {
        honor: [
          {required: true, message: 'Please Choose Honor', trigger: 'change'}
        ],
        firstName: [
          {required: true, message: 'Please enter Name: firstName', trigger: 'blur'}
        ],
        lastName: [
          {required: true, message: 'Please enter Name: lastName', trigger: 'blur'}
        ],
        nationality: [
          {required: true, message: 'Please Choose Nationality', trigger: 'change'}
        ],
        contactNumber: [
          {required: true, message: 'Please enter contactNumber', trigger: 'blur'},
          {validator: contactNumberValidator, message: 'ENTER NUMBERS ONLY', trigger: 'blur'}
        ],
        emailAddress: [
          {required: true, message: 'Please enter emailAddress', trigger: 'blur'},
          {type: 'email', message: 'Please enter emailAddress', trigger: ['blur']}
        ],
        address: [
          {required: true, validator: addressValidator, message: 'Please enter Address', trigger: 'blur'}
        ],
        city: [
          {required: true, validator: cityValidator, message: 'Please enter City', trigger: 'blur'}
        ],
        zipCode: [
          {required: true, message: 'Please enter zipCode', trigger: 'blur'},
          {validator: zipCodeValidator, message: 'Please Enter Numbers,Letters and -', trigger: 'blur'}
        ],
        country: [
          {required: true, message: 'Please Choose Country', trigger: 'change'}
        ],
        position: [
          {required: true, message: 'Please enter Position', trigger: 'blur'}
        ],
        hospital: [
          {required: true, message: 'Please enter Hospital/Practice/Institue', trigger: 'blur'}
        ],
        specialty: [
          {required: true, validator: specialtyValidator, message: 'Please enter Specialty/Subspecialty', trigger: 'blur'}
        ],
        areaOfInterest: [
          {required: true, message: 'Please enter Area of Interest', trigger: 'blur'}
        ]
      },
      countryCode: countryCode
    };
  },
  components: {},
  methods: {
    handleClose(done, needUpdate) {
      this.$emit('dialogCloseHandle', needUpdate);
    },
    saveMemberInfo() {
      this.$refs.formDom.validate((valid) => {
        let _this = this, method = '', url = '', params = {};
        if (valid) {
          for (let key in this.formData) {
            if (this.formData[key] !== this.memberInfoForm[key]) {
              params[key] = this.formData[key];
            }
          }

          if (Object.keys(params).length === 0) {
            _this.handleClose(null);
            return;
          }

          if (this.dialogEditType === this.DIALOG_EDIT_TYPE.ADD) {
            // 新增
            method = apiConfig.asiaAddMemberInfo.type;
            url = apiConfig.asiaAddMemberInfo.url;
            params.registerSource = 2;// 注册渠道 手动录入
          }
          else {
            // 编辑
            method = apiConfig.asiaEditMemberInfo.type;
            url = apiConfig.asiaEditMemberInfo.url;
            params.id = this.formData.id; // 用户id
          }

          comm.openLoading('加载中...');
          axios({
            method: method,
            url: url,
            data: params
          }).then((response) => {
            if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
              _this.handleClose(null, true);
            }
            comm.closeLoading();
          }).catch((e) => {
            console.log('保存会员失败：', e);
            comm.closeLoading();
          });
        }
        else {
          this.$message.error('请检查填写格式!');
          comm.closeLoading();
          return false;
        }
      });
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
  },
  computed: {
    dialogEditTypeFormatter: function() {
      // 1 新增 2 查看 3 编辑
      switch (this.dialogEditType) {
        case 1:
          return '新增';
        case 2:
          return '查看';
        case 3:
          return '编辑';
        default:
          return '';
      }
    },
    rejectEdit: {
      // getter
      get: function() {
        return this.dialogEditType === this.DIALOG_EDIT_TYPE.VIEW;
      },
      // setter
      set: function(newValue) {

      }
    }
  },
  watch: {
    dialogVisible: function(newVal, oldVal) {
      if (newVal) {
        this.$refs.formDom && this.$refs.formDom.resetFields();
      }
    },
    memberInfoForm: function(newVal, oldVal) {
      this.formData = JSON.parse(JSON.stringify(this.memberInfoForm));
    }
  }
};

</script>

<style lang='scss'>
  .asia-member-dialog {
    .el-dialog__header{
      .member-dialog-header {
        text-align: center;
        h2{
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #222222;
          letter-spacing: 0;
          line-height: 24px;
          font-weight: bolder;
        }
      }
    }

    .el-dialog__body{
      .title{
        text-align: center;
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #222222;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: bolder;
        margin-bottom: 15px;
      }

      .member-dialog-main{
        .name {
          float: left;
          width: 500px;
          margin-right: 20px;
          &:nth-of-type(2) {
            width: 430px;
            .el-input .el-input__inner{
              width: 448px;
            }
          }
        }

        //保存按钮
        .saveMemberBtn {
          text-align: center;
          margin-top: 60px;
          span {
            width:142px;
            height:36px;
            border-radius: 4px;
            cursor: pointer;
            padding: 10px 56px;
            background: #3846DC;
            color:#FFF;
          }
        }
      }

    }
  }
</style>
