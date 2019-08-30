<template>
  <section class="searchArea">
    <el-form ref="mergeForm" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="姓名" prop="fullNameLike">
            <el-input v-model="form.fullNameLike"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left:36px;">
          <el-form-item label="医院" prop="companyLike">
            <el-input v-model="form.companyLike"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left:36px;">
          <el-form-item label="角色" prop="roleId">
            <!--角色(1-住院医师、2-主治医师、3-副主任医师、4-主任医师、5-讲师、6-副教授、7-教授、8-硕士生导师、9-博士生导师、10-医学生、11-护士、12-主任医师、13-其它)-->
            <el-select v-model="form.roleId" placeholder="请选择角色">
              <el-option label="不限" value=""></el-option>
              <el-option label="医生" value="6"></el-option>
              <el-option label="护士" value="12"></el-option>
              <el-option label="医助" value="13"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" style="margin-left:36px;">

          <el-form-item label="职称" prop="medicalTitleId">
            <!--职称id(1-住院医师、2-主治医师、3-副主任医师、4-主任医师、5-讲师、6-副教授、7-教授、8-硕士生导师、9-博士生导师、10-医学生、11-护士、12-主任医师、13-其它)-->
            <el-select v-model="form.medicalTitleId" placeholder="请选择职称">
              <el-option v-for="item in medicalTitleList" :label="item.name" :value="item.id" :key="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9">
          <el-form-item label="提交时间" prop="createTime">
            <el-col :span="11">
              <el-date-picker
                v-model="createTime"
                type="daterange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col
          :span="8" v-if="isAdmin" style="margin-left:32px; margin-right:32px;"        >
          <el-form-item label="处理时间">
            <el-col :span="11">
              <el-date-picker
                v-model="dealTime"
                type="daterange"
                align="right"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
                prop="dealTime"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" style="width: 220px;">
          <el-form-item label="手机号" prop="mobileLike">
            <el-input v-model="form.mobileLike"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" style="margin-left:48px;">
          <el-form-item label="邮箱" prop="emailLike">
            <el-input v-model="form.emailLike"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="margin-left:48px;">
          <el-form-item label="账号状态" prop="uniteIsValid">
            <el-select v-model="form.uniteIsValid" placeholder="请选择账号状态">
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5" style="margin-left:48px;">
          <el-form-item label="合并类型" prop="mergeType">
            <!--合并类型(1-用户发起2-运营发起)-->
            <el-select
              v-model="form.mergeType"
              placeholder="请选择提交类型"
            >
              <el-option label="用户发起" value="1"></el-option>
              <el-option label="运营发起" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="4"
          v-if="isAdmin"
        >
          <el-form-item label="合并状态" prop="mergeState">
            <el-select
              v-model="form.mergeState"
              placeholder="请选择提交类型"
            >
              <!--合并状态(待合并传1、已合并传2、v1通过传3、v1拒绝传4、v2通过传5、v2拒绝传6、全部列表不传该字段)-->
              <el-option label="待合并" value="1"></el-option>
              <el-option label="已合并" value="2"></el-option>
              <el-option label="v1通过" value="3"></el-option>
              <el-option label="v1拒绝" value="4"></el-option>
              <el-option label="v2通过" value="5"></el-option>
              <el-option label="v2拒绝" value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :span="4"
          v-if="isAdmin" style="margin-left:32px;"
        >
          <el-form-item
            label="处理人"
            prop="opUserLike"
          >

            <el-input v-model="form.opUserLike"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item
            label="用户ID"
            prop="mainCustomerId">
            <el-input v-model="form.mainCustomerId" style="width:187px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="18">
          <el-form-item class="submitBtn">
            <el-button @click="resetForm">清空条件</el-button>
            <el-button @click="onSubmit">检索结果</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </section>
</template>

<script>
export default {
  name: 'mergeSearchArea',
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.onSubmit();
      }
    };
    if (sessionStorage.getItem('mergeListFormData')) {
      this.form = JSON.parse(sessionStorage.getItem('mergeListFormData'));
    }
    this.getMedicalTitleListByRole();
  },
  data() {
    return {
      form: {
        fullNameLike: '',
        companyLike: '',
        roleId: '',
        medicalTitleId: '',
        createTimeGt: '', // 提交时间开始
        createTimeLt: '', // 提交时间结束
        mobileLike: '', // 手机
        emailLike: '', // 邮箱
        uniteIsValid: '', // 帐号状态(0-无效1-有效)
        mainCustomerId: '', // 用户id
        mergeType: '', // 合并类型(1-用户发起2-运营发起)
        state: '', //  <!--认证状态(-1-无认证信息、0-二次提交认证、1-认证通过、2-运营确认、3-认证拒绝7-执业医师申请 8-执业医师确认 9-执业医师拒绝)-->
        dealTimeGt: '', // 处理时间开始
        dealTimeLt: '', // 处理时间结束
        opUserLike: '', // 处理人
        mergeState: ''// 合并状态(待合并传1、已合并传2、v1通过传3、v1拒绝传4、v2通过传5、v2拒绝传6、全部列表不传该字段)
      },
      createTime: [], // 创建时间
      dealTime: [], // 处理时间
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        region: [
          {required: true, message: '请选择活动区域', trigger: 'change'}
        ],
        date1: [
          {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
        ],
        date2: [
          {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
        ],
        type: [
          {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
        ],
        resource: [
          {required: true, message: '请选择活动资源', trigger: 'change'}
        ],
        desc: [
          {required: true, message: '请填写活动形式', trigger: 'blur'}
        ],
        id: [
          {required: true, message: '年龄不能为空'},
          {type: 'number', message: '年龄必须为数字值'}
        ]
      },

      medicalTitleList: [

      ]
    };
  },
  components: {},
  watch: {
    'form.roleId': function(value, oldValue) {
      if (oldValue !== value) {
        this.getMedicalTitleListByRole();
        this.$set(this.form, 'medicalTitleId', '');
      }
    }
  },
  destroyed() {
    document.onkeydown = null;
  },
  methods: {
    onSubmit() {
      console.log('获取的form表单参数:', this.form);
      if (Array.isArray(this.createTime) && this.createTime.length > 0) {
        this.form.createTimeGt = this.createTime[0];
        this.form.createTimeLt = this.createTime[1];
      }
      else {
        this.form.createTimeGt = '';
        this.form.createTimeLt = '';
      }
      if (Array.isArray(this.dealTime) && this.dealTime.length > 0) {
        this.form.dealTimeGt = this.dealTime[0];
        this.form.dealTimeLt = this.dealTime[1];
      }
      else {
        this.form.dealTimeGt = '';
        this.form.dealTimeLt = '';
      }
      let newObj = {};
      console.log(this.form);
      for (let key in this.form) {
        console.log(key);
        if (this.form[key]) {
          newObj[key] = this.form[key];
        }
      }
      if (newObj.medicalTitleId) { // 若有职称id则 角色id参数无用
        delete newObj.roleId;
      }
      sessionStorage.setItem('mergeListFormData', JSON.stringify(newObj));
      this.$emit('onSubmit', newObj);
    },
    resetForm() {
      this.$refs['mergeForm'].resetFields();
      this.createTime = [];
      this.dealTime = [];
      sessionStorage.removeItem('mergeListFormData');
    },
    getMedicalTitleListByRole() {
      let medicalTitleList;
      let doctorMedicalTitleList = [
        {
          name: '住院医师',
          id: '1'
        }, {
          name: '主治医师',
          id: '2'
        }, {
          name: '副主任医师',
          id: '3'
        }, {
          name: '主任医师',
          id: '4'
        }, {
          name: '医学生',
          id: '10'
        }
      ];
      let nurseMedicalTitleList = [
        {
          name: '护士',
          id: '11'
        }, {
          name: '护师',
          id: '12'
        }, {
          name: '主管护师',
          id: '13'
        }, {
          name: '副主任护师',
          id: '14'
        }, {
          name: '主任护师',
          id: '15'
        }
      ];
      let doctorAssistMedicalTitleList = [{
        name: '医助',
        id: '17'
      }];

      let allMedicalTitleList = [
        ...doctorMedicalTitleList,
        ...nurseMedicalTitleList,
        ...doctorAssistMedicalTitleList
      ];
      switch (this.form.roleId) {
        case '':
          medicalTitleList = allMedicalTitleList;
          break;
        case '6': // 医生
          medicalTitleList = doctorMedicalTitleList;
          break;
        case '12': // 护士
          medicalTitleList = nurseMedicalTitleList;
          break;
        case '13': // 医助
          medicalTitleList = doctorAssistMedicalTitleList;
          break;
        default: // 医生
          medicalTitleList = allMedicalTitleList;
          break;
      }
      this.medicalTitleList = medicalTitleList;
    }
  },
  props: ['isAdmin']
};
</script>

<style scoped lang="scss">
  //搜索区域样式
  .searchArea {
    padding: 25px 0 0 0;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
    border-radius: 4px;
    margin-bottom: 30px;
    .submitBtn {
      button {
        &:nth-of-type(1) {
          border: none;
        }
        &:nth-of-type(2) {
          color: #4B67D6;
          border: 1px solid #4B67D6;
          border-radius: 4px;
        }
      }
    }
  }

  .el-select-dropdown__item {
    padding-left: 40px;
    position: relative;
    border-bottom: 1px solid rgba(230, 230, 232, 0.3);
    &:last-of-type {
      border-bottom: none;
    }

    &:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-unselected.png) center center no-repeat;
      content: "";
      display: block;
      width: 40px;
      height: 100%;
      position: absolute;
      opacity: 1;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.selected:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-selected.png) center center no-repeat;
    }
  }
</style>
