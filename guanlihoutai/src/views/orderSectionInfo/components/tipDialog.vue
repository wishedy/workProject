<template>
  <el-dialog
    title="提示"
    :close-on-click-modal="false"
    :visible.sync="tipDialog.dialogVisible"
    width="30%"
    center>
    <span>{{tipDialog.content}}</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSure">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import apiConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  props: {
    /**
     * tipDialog 弹出框的内容
     * deptData  参数
     */
    // 弹框内容
    tipDialog: {
      type: Object
    },
    //  保存所要传递的参数
    deptData: {
      type: Object
    }
  },
  methods: {
    // 取消
    handleCancel() {
      this.$emit('DialogTip', false);
      this.$router.replace({
        path: '/orderSectionInfo'
      });
    },
    // 确定
    handleSure() {
      // 确定保存  接口传递参数
      /**
       * data 参数
      */
      this.deptData.opUser = localStorage.getItem('userLoginName'); // 获取用户名
      axios({
        url: apiConfig.deptIntroduceSave.url,
        method: apiConfig.deptIntroduceSave.type,
        data: this.deptData
      }).then((res) => {
        if (res.data.responseObject.responseCode === '0') {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.$router.replace({
            path: '/orderSectionInfo'
          });
        }
        else {
          this.$message.error('保存失败');
        }
      }).catch((err) => {
        this.$message.error(err);
      });
    }
  }
};
</script>

<style>

</style>
