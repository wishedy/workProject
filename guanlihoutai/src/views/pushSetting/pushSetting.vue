<template>
  <section class="crm-pushSetting">
    <!--推送设置标题开始-->
    <h1 class="crm-pushSetting-title">推送设置</h1>
    <!--推送设置标题结束-->
    <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="crm-pushSetting-ruleForm">
      <el-form-item label="每天推送条数限制" prop="pushContent" class="crm-form-item">
        <el-tooltip class="item" effect="dark" content="温馨提示：请按回车确定" placement="top">
          <el-input v-model.trim="ruleForm.numLimit" @keyup.enter.native="publishLimit" placeholder="填写格式：10" clearable></el-input>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="收到推送时间设置">
        <el-col :span="9">
          <el-time-picker :placeholder="startTime ? startTime : '选择时间'" v-model="ruleForm.timeStart" @focus="startFocus" value-format="HH:mm:ss" style="width: 100%;"></el-time-picker>
        </el-col>
        <el-col class="line crm-pushSetting-line" :span="2">-</el-col>
        <el-col :span="9">
          <el-time-picker :placeholder="endTime ? endTime : '选择时间'" v-model="ruleForm.timeEnd" @focus="endFocus" value-format="HH:mm:ss" style="width: 100%;"></el-time-picker>
        </el-col>
        <el-col :span="2" :offset="1">
          <el-button type='primary' @click.native="setting">完成设置</el-button>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="推送展示间隔" prop="pushContent" class="crm-form-item">
        <el-input v-model="ruleForm.pushTimeGap" placeholder="填写格式：100s"></el-input>
      </el-form-item> -->
    </el-form>
  </section>
</template>
<script>
import api from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
// import { clearTimeout } from 'timers';
export default {
  data() {
    return {
      ruleForm: {
        numLimit: 0,
        timeEnd: '',
        timeStart: ''
      },
      startTime: '',
      endTime: '',
      listId: ''
    };
  },
  created() {
    this.getConfig();
  },
  methods: {
    getConfig() {
      axios({
        method: api.getPushConfigInfo.type,
        url: api.getPushConfigInfo.url,
        params: {}
      }).then((res) => {
        // console.log(res);
        this.listId = res.data.responseObject.responseData.id;
        this.startTime = res.data.responseObject.responseData.timeStart;
        this.endTime = res.data.responseObject.responseData.timeEnd;
        // this.ruleForm.timeStart = res.data.responseObject.responseData.timeStart;
        // this.ruleForm.timeEnd = res.data.responseObject.responseData.timeEnd;
        this.ruleForm.numLimit = res.data.responseObject.responseData.numLimit;
      });
    },
    startFocus() {
      this.ruleForm.timeStart = this.startTime;
    },
    endFocus() {
      this.ruleForm.timeEnd = this.endTime;
    },
    publishLimit() {
      var that = this;
      if (this.ruleForm.numLimit && this.ruleForm.numLimit >= 0) {
        axios({
          method: api.pushSetting.type,
          url: api.pushSetting.url,
          data: {
            id: this.listId,
            numLimit: this.ruleForm.numLimit,
            timeEnd: this.endTime,
            timeStart: this.startTime
          }
        }).then(() => {
          that.$message.success('设置成功！');
          that.getConfig();
          var timeout = setTimeout(() => {
            window.location.reload();
            clearTimeout(timeout);
          }, 600);
        }).catch(() => {
          that.$message.error('设置失败！');
        });
      }
      else {
        that.$message.info('请输入正确的数字');
      }
    },
    setting() {
      var that = this;
      if (!this.ruleForm.timeStart || !this.ruleForm.timeEnd) {
        this.$message.info('时间段不完整！');
      }
      else {
        axios({
          method: api.pushSetting.type,
          url: api.pushSetting.url,
          data: {
            id: this.listId,
            numLimit: this.ruleForm.numLimit,
            timeEnd: this.ruleForm.timeEnd,
            timeStart: this.ruleForm.timeStart
          }
        }).then(() => {
          that.$message.success('设置成功！');
          var timeout = setTimeout(() => {
            window.location.reload();
            clearTimeout(timeout);
          }, 600);
        }).catch(() => {
          that.$message.error('设置失败！');
        });
      }
    }
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/pushSetting/pushSetting.scss";
</style>
