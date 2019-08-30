<template>
  <el-form v-show="editShow"
           label-width="100px"
           :rules="rules"
           :model="liveData"
           ref="columnLiveEditForm"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="栏目ID" prop="columnId">
          <el-input placeholder="自动生成栏目ID" disabled v-model="liveData.columnId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="栏目名称" prop="columnName">
          <el-input v-model="liveData.columnName" placeholder="输入栏目名称"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="查看全部" prop="columnViewAll">
          <el-input v-model="liveData.columnUrlScheme" placeholder="自动按照栏目id+栏目类型进行系统匹配URL Scheme，支持手动修改"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="18">
        <el-button type="primary" @click="submitBtnOnClick">发布</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import validator from '@/assets/js/utils/validator';

export default {
  name: 'columnLiveEdit',
  props: ['liveEditShow', 'columnData', 'isNew'],
  data() {
    return {
      editShow: this.liveEditShow,
      liveData: {
        columnId: this.columnData && this.columnData.columnId,
        columnName: this.columnData && this.columnData.columnName,
        classType: this.columnData && this.columnData.classType,
        columnUrlScheme: this.columnData && this.columnData.columnUrlScheme
      },
      rules: {
        columnName: [
          {required: true, message: '输入栏目名称', trigger: 'blur'},
          {max: 10, message: '最长10个字'},
          {validator: validator.fullSpanceVaild, message: '栏目名称不能全为空格', trigger: 'blur'}
        ]
        // columnUrlScheme: [{required: true, message: '自动按照栏目id+栏目类型进行系统匹配URL Scheme，支持手动修改', trigger: 'blur'}],
      }
    };
  },
  watch: {
    liveEditShow(newVal) {
      this.editShow = newVal;
      if (newVal) {
        this.$refs['columnLiveEditForm'].clearValidate();
      }
    },
    columnData() {
      for (let key in this.liveData) {
        this.liveData[key] = '';
      }
      if (this.columnData) {
        // 表单赋值
        this.liveData.columnId = this.columnData.columnId;
        this.liveData.columnName = this.columnData.columnName;
        this.liveData.columnType = this.columnData.columnType;
        this.liveData.columnUrlScheme = this.columnData.columnUrlScheme;
      }
    }
  },
  methods: {
    submitData() {
      let data = {
        columnId: this.liveData.columnId,
        columnName: this.liveData.columnName,
        columnUrlScheme: this.liveData.columnUrlScheme
      };
      this.$emit('submitData', data);
    },
    submitBtnOnClick() {
      this.$refs.columnLiveEditForm.validate((vaild) => {
        if (vaild) {
          this.submitData();
        }
        else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .el-button {
    float: right;
    padding: 10px 56px;
    background: #3846DC;
  }
</style>
