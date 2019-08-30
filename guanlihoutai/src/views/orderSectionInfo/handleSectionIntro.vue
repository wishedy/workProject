<template>
  <section>
    <el-form ref="form" :rules="rules" class="searchForm-orderSection" style="position: relative;" :model="searchForm" label-width="120px">
      <el-form-item label="专业名称" prop="deptName">
        <el-input
          style="width: 80%"
          v-model="searchForm.deptName"
          placeholder="请输入专业名称"
          maxlength="10"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <p :class="searchForm.deptName && searchForm.deptName.length >= 10 ? 'red' : ''">规格说明：最多10个中文字符</p>
      </el-form-item>
      <el-form-item label="专业介绍" prop="deptIntroduce">
        <el-input type="textarea"  style="width: 80%" v-model="searchForm.deptIntroduce" maxlength="200"  placeholder="请输入专业介绍"></el-input>
      </el-form-item>
      <el-form-item>
        <p :class="searchForm.deptIntroduce && searchForm.deptIntroduce.length >= 200 ? 'red' : ''">最多输入200中文字符</p>
      </el-form-item>
      <section class="submitBtn" style="text-align: center">
        <el-button type="primary" @click="cancel('form')">&nbsp;&nbsp;取消&nbsp;&nbsp;</el-button>
        <el-button type="primary" @click="submitForm('form')">&nbsp;&nbsp;保存&nbsp;&nbsp;</el-button>
      </section>
    </el-form>
  </section>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    param: {
      type: Object
    }
  },
  created() {
    console.log(this.param, '4545455');
  },
  watch: {
    param(newVal, oldVal) {
      console.log(newVal, '5555555555');
      this.searchForm = {
        deptName: newVal.deptName,
        deptIntroduce: newVal.deptIntroduce,
        index: newVal.index,
        deptTextId: newVal.deptTextId
      };
    }
  },
  data() {
    return {
      searchForm: {
        deptName: this.param.deptName,
        deptIntroduce: this.param.deptIntroduce,
        index: this.param.index,
        deptTextId: this.param.deptTextId
      },

      rules: {
        deptName: [
          { required: true, message: '请输入专业名称', trigger: 'blur' }
        ],
        deptIntroduce: [
          { required: true, message: '请输入专业介绍', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('getEditDetail', this.searchForm);
          // this.searchForm = {
          //   name: '',
          //   text: ''
          // };
        }
        else {
          this.$message({
            showClose: true,
            message: '保存失败，请填写完整!',
            type: 'error'
          });
          return false;
        }
      });
    },
    cancel() {
      this.$emit('update:visible', false);
      this.$refs['form'].resetFields();
    }
  }
};
</script>

<style lang="scss">
  .searchForm-orderSection{
    > .el-form-item:nth-child(1){
      margin-bottom: 10px;
    }
    > .el-form-item:nth-child(3){
      margin-bottom: 10px;
    }

    .submitBtn {
      margin-top: 80px;
    }

    .el-textarea {
      textarea {
        min-height: 150px!important;
      }
    }
    .red{
      color: red;
    }
  }
</style>
