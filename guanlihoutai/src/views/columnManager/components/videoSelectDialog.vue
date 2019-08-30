<template>
  <el-dialog
    :visible.sync="editShow"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    class="video-select-dialog"
    :lock-scroll=false
    center>
    <div slot="title" class="dialog-title">{{editTitle}}</div>
    <el-form
      label-width="100px"
      :model="editData"
      ref="editForm"
      :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item label="选集顺序" prop="sortId" v-if="!newDialog">
            <el-input placeholder="请输入选集顺序" v-model="editData.sortId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="选集名称" prop="anthologyName">
            <el-input v-model="editData.anthologyName" placeholder="请输入选集名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户ID" prop="customerIdList">
            <el-input placeholder="自动读取" v-model="editData.customerIdList" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="用户姓名" prop="customerNameList">
            <el-input v-model="editData.customerNameList" placeholder="自动读取" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="一句话介绍" prop="refDesc">
            <el-input type="textarea" placeholder="请输入选集介绍内容" v-model="editData.refDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="视频ID">
            <el-input
              v-model="editData.refId"
              placeholder="视频ID，可以为空"
              @change="videoIdChange"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="18">
          <el-button type="primary" @click="submitBtnOnClick">发布</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
/**
   * 课程管理-选集视频-新增/编辑选集弹窗
   */
import validator from '@/assets/js/utils/validator';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'videoSelectDialog',
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    newDialog: {
      type: Boolean,
      required: false
    },
    dialogData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      editTitle: '',
      editShow: this.dialogShow,
      columnId: this.$route.query.columnId,
      courseId: this.$route.query.courseId,
      editData: {
        id: '', // 选集的唯一id,点击编辑按钮发布后，需要传给后台
        sortId: '',
        anthologyName: '',
        customerIdList: '',
        customerNameList: '',
        refDesc: '',
        refId: '',
        isValid: ''
      },
      rules: {
        sortId: [
          {required: true, message: '选集序号不能为空', trigger: 'blur'},
          {validator: validator.isPositiveInteger, message: '选集序号必须为正整数', trigger: 'blur'}
        ],
        anthologyName: [
          {required: true, message: '选集名称不能为空', trigger: 'blur'},
          {max: 30, message: '最长30个字'}
        ],
        refDesc: [
          {required: true, message: '一句话介绍不能为空', trigger: 'blur'},
          {max: 50, message: '最长50个字'}
        ]
      }
    };
  },
  watch: {
    dialogShow(newVal) {
      this.editShow = newVal;
      if (newVal) {
        this.$refs.editForm && this.$refs.editForm.clearValidate();
        for (let key in this.editData) {
          this.editData[key] = '';
        }
        if (this.newDialog) {
          this.editTitle = '新增选集';
        }
        else {
          this.editTitle = '编辑选集';
          if (this.dialogData) {
            // 表单赋值
            this.editData.id = this.dialogData.id;
            this.editData.refId = this.dialogData.refId;
            this.editData.anthologyName = this.dialogData.anthologyName;
            // 获取其他数据
            this.getDetailData();
          }
        }
      }
    }
  },
  methods: {
    getDetailData() {
      this.editShow = false;
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCourseTypeVideoDetailData.type,
        url: apiUrlConfig.getCourseTypeVideoDetailData.url,
        params: {
          columnId: this.columnId,
          columnSubId: this.courseId,
          refId: this.editData.refId,
          id: this.editData.id
        }
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        this.editShow = true;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          this.editData.customerIdList = responseData.customerIdList;
          this.editData.customerNameList = responseData.customerNameList;
          this.editData.refDesc = responseData.refDesc;
          this.editData.sortId = responseData.sortId;
        }
      }).catch((err) => {
        // 取消loading
        comm.closeLoading();
        this.editShow = true;
        console.log('获取选集详细数据异常：', err);
      });
    },
    getVideoContentByVideoId(params) {
      axios({
        method: apiUrlConfig.getVideoContentByVideoIdVideoTypeColumn.type,
        url: apiUrlConfig.getVideoContentByVideoIdVideoTypeColumn.url,
        params: params
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseObject = response.data.responseObject;
          let responseData = response.data.responseObject.responseData;
          if (Object.keys(responseData).length > 0) {
            if (responseData.videoId) {
              this.editData.refId = responseData.videoId;
            }
          }
          else {
            this.editData.refId = '';
            responseObject.responseMessage && this.$message({
              type: 'info',
              message: responseObject.responseMessage
            });
          }
        }
      }
      ).catch((e) => {
        this.editData.refId = '';
        this.$message({
          type: 'info',
          message: 'videoId不存在或者视频已被无效'
        });
        console.log('根据视频id获取视频名称-获取数据失败：', e);
      });
    },
    submitData() {
      let data = {
        id: this.editData.id,
        columnId: this.columnId,
        columnSubId: this.courseId,
        columnType: '1',
        anthologyName: this.editData.anthologyName,
        refId: this.editData.refId,
        refDesc: this.editData.refDesc,
        sortId: this.editData.sortId,
        visitSiteId: 25
      };

      let _data = {};
      for (let key in data) {
        if (data[key]) _data[key] = data[key];
      }
      data = _data;
      let contentTitle = this.newDialog ? '新增' : '编辑';

      comm.openLoading('加载中...');
      this.editShow = false;
      axios({
        method: apiUrlConfig.saveCourseTypeVideo.type,
        url: apiUrlConfig.saveCourseTypeVideo.url,
        data: data
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true) {
          this.$allin_confirm({
            title: '提示',
            content: contentTitle + '选集成功',
            type: 'notice',
            done: () => {
              this.handleClose(true);
            }
          });
        }
        else {
          this.$allin_confirm({
            title: '提示',
            content: contentTitle + '选集失败',
            type: 'notice',
            done: () => {
              this.handleClose();
            }
          });
        }
      }).catch(() => {
        comm.closeLoading();
        this.$allin_confirm({
          title: '提示',
          content: contentTitle + '选集失败',
          type: 'notice',
          done: () => {
            this.handleClose();
          }
        });
      });
    },
    handleClose(needUpdate) {
      this.$emit('closeDialog', needUpdate);
    },
    videoIdChange(value) {
      if (value && comm.isNumber(value)) {
        this.getVideoContentByVideoId(
          {
            videoId: value // string 是
          }
        );
      }
      else {
        this.editData.refId = '';
        this.$message({
          type: 'info',
          message: 'videoId不存在或者视频已被无效'
        });
      }
    },
    submitBtnOnClick() {
      this.$refs.editForm.validate((vaild) => {
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

<style scoped>
  .dialog-title {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #222222;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: bolder;
  }

  .el-button {
    padding: 10px 56px;
    float: right;
    background: #3846DC;
  }
</style>
<style>
  .video-select-dialog textarea {
    font-family: PingFangSC-Regular;
  }
</style>
