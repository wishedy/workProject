<template>
  <section>
    <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      center
      @close="closeHandle">
      <h3 class="dialog-title">{{dialogTitle}}</h3>
      <section class="dialog-select"  v-for="(select,index) in selectList" :key="index">
        <el-select v-model="select.contentValue" value-key="id" placeholder="此处选择内容字段" size="small">
          <el-option
            v-for="item in select.conentList"
            :key="item.id"
            :label="item.promptMessage"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-select v-model="select.questionValue" value-key="id" placeholder="此处选择问题字段" size="small">
          <el-option
            v-for="item in select.questionList"
            :key="item.id"
            :label="item.promptMessage"
            :value="item"
          >
          </el-option>
        </el-select>
        <span class="el-icon-remove" v-if="selectList.length > 1" @click="refuseReaonRemoveOnClick(index)"></span>
      </section>
      <button class="refuse-cert-btn-add" @click="addSelectOnClick"><img src="/static/images/icons/icon-add.png">
      </button>
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入其他拒绝理由"
        v-model="refuseReaon"
        class="refuse-cert-custom"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" round @click="confirmOnClick">确认</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
/**
   * 组件名称：审核拒绝弹窗，选择拒绝理由
   * 使用方法：<refuseCertDialog :canShow="dialogData.visiable" :setTitle="dialogData.title"
   :contentSelectList="dialogData.contentSelectList"
   :questionSelectList="dialogData.questionSelectList"
   @closeDialog="dialogData.visiable=false" @confirmHandle="confirmHandle"></refuseCertDialog>
   其中：:canShow - 是否显示弹窗
   :setTitle - 设置弹窗标题
   :contentSelectList - 设置内容字段
   :questionSelectList - 设置问题字段
   @confirmHandle - 弹窗确认回调方法
   @closeDialog - 弹窗关闭回调方法，如果不需要作相关处理，则仍需要在此回调中设置是否显示弹窗相关值为不显示弹窗
   */
// 拒绝认证-拒绝理由公用弹窗
export default {
  name: 'refuseCertDialog',
  props: ['canShow', 'setTitle', 'contentSelectList', 'questionSelectList'],
  data() {
    return {
      dialogVisible: this.canShow,
      dialogTitle: this.setTitle,
      selectList: [],
      refuseReaon: ''
    };
  },
  watch: {
    setTitle() {
      this.dialogTitle = this.setTitle;
    },
    canShow() {
      let selectObj = {
        conentList: this.contentSelectList,
        questionList: this.questionSelectList,
        contentValue: '',
        questionValue: ''
      };
      this.refuseReaon = '';
      this.selectList = [];
      this.selectList.push(selectObj);
      this.dialogVisible = this.canShow;
    }
  },
  methods: {
    refuseReaonRemoveOnClick: function(index) {
      this.selectList.splice(index, 1);
    },
    confirmOnClick: function() {
      let isValid = true;
      // 内容字段和问题字段不能为空，必须组队出现,且必须有至少一组
      if (this.selectList.length === 0) {
        isValid = false;
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (!this.selectList[i].contentValue || !this.selectList[i].questionValue) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        let data = {}, tmpObj = {};
        data.refuseList = [];
        for (let i = 0; i < this.selectList.length; i++) {
          tmpObj = {};
          tmpObj.resourceContent = this.selectList[i].contentValue;
          tmpObj.resourceQuestion = this.selectList[i].questionValue;
          data.refuseList.push(tmpObj);
        }
        data.reason = this.refuseReaon;
        // 统一处理拒绝数据
        data = this.getRefuseData(data);
        this.$emit('confirmHandle', data);
      }
      else {
        this.$message.info('内容字段和问题字段不能为空');
      }
    },
    closeHandle: function() {
      this.$emit('closeDialog', false);
    },
    addSelectOnClick: function() {
      let selectObj = {
        conentList: this.contentSelectList,
        questionList: this.questionSelectList,
        contentValue: '',
        questionValue: ''
      };
      this.selectList.push(selectObj);
    },
    getRefuseData: function(data) {
      let _refuseData = {};
      _refuseData.refuseList = [];
      _refuseData.supplement = '';
      for (let i = 0; i < data.refuseList.length; i++) {
        let obj = {};
        obj.resourceId = data.refuseList[i].resourceContent.id;
        obj.resourceContent = data.refuseList[i].resourceContent.promptMessage;
        obj.resourceQuestion = data.refuseList[i].resourceQuestion.promptMessage;
        _refuseData.refuseList.push(obj);
        _refuseData.supplement += obj.resourceContent + obj.resourceQuestion + '，';
      }
      if (data.reason) {
        _refuseData.reason = data.reason;
        _refuseData.supplement += data.reason;
      }
      else {
        _refuseData.supplement = _refuseData.supplement.substring(0, _refuseData.supplement.length - 1);
      }
      return _refuseData;
    }
  }
};
</script>

<style lang="scss" scoped>
  .el-dialog {
    .dialog-title {
      margin: -30px 0 30px 0;
      text-align: center;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 24px;
    }
    .dialog-select {
      margin: 20px auto;
      /*text-align: center;*/
    }
    .el-select {
      width: 45%;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #111111;
      letter-spacing: 0;
      line-height: 14px;
    }
    .el-icon-remove {
      width: 5%;
      font-size: 26px;
      color: #f56c6c;
      vertical-align: middle;
    }

    .refuse-cert-btn-add {
      background: #EDF1FF;
      border-radius: 4px;
      width: 100%;
      height: 36px;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .refuse-cert-custom {
      width: 100%;
      background: #F7F9FC;
      border: 1px solid #E6E6E8;
      border-radius: 4px;
    }
    .el-button {
      background: #4B67D6;
      border-radius: 100px;
      padding: 13px 65px;
    }

  }

</style>
