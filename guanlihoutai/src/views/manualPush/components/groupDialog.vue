<template>
  <section class="crm-manualPush-groupDialog">
    <el-dialog
      :visible.sync="showOnOff"
      width="600px"
      center
      :before-close="handleClose">
      <div class="block">
        <el-form :model="ruleForm" :rules="titleRule" ref="ruleForm" label-width="120px">
          <el-form-item label="设置分组名称" prop="gourpName" class="crm-form-item">
            <el-input v-model.trim="ruleForm.gourpName" placeholder="请输入分组名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="addGroupName('ruleForm')">确 定</el-button>
  </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: {
    showOnOff: {
      default() {
        return false;
      },
      type: Boolean
    }
  },
  data() {
    return {
      ruleForm: {
        gourpName: ''
      },
      checked1: true,
      checked2: true,
      titleRule: {
        gourpName: [
          {required: true, message: '请输入分组名称', trigger: 'blur'},
          {min: 0, max: 20, message: '最多20个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    handleClose() {
      let _this = this;
      _this.$emit('closeGroupDialog');
    },
    addGroupName(formName) {
      let _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.pubSubmitDialog = true;
          _this.$emit('addAssignCustomerLabel', _this.ruleForm.gourpName);
        }
      });
    }
  }
};
</script>
