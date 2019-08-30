<template>
  <el-form v-show="editShow"
           label-width="100px"
           :rules="rules"
           :model="videoData"
           class="column-video-edit"
           ref="columnVideoEditForm"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="栏目ID">
          <el-input
            placeholder="自动生成栏目ID"
            disabled
            v-model="videoData.columnId"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="栏目名称" prop="columnName">
          <el-input
            v-model="videoData.columnName"
            placeholder="输入栏目名称"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="栏目介绍" prop="columnDesc">
          <el-input type="textarea" placeholder="输入栏目介绍" v-model="videoData.columnDesc"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="查看全部" prop="columnUrlScheme">
          <el-input placeholder="自动按照栏目id+栏目类型进行系统匹配URL Scheme,支持手动修改" v-model="videoData.columnUrlScheme"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="column-course-img-list">
      <el-form-item label="配图" class="column-course-img-label img-upload" prop="imgIconUrl">
        <ColumnImgUpload
          @uploadSuccess="handleImgIconUploadSuccess"
          :imgUrl="videoData.imgIconUrl"
          :needClear="!editShow">
          <p>头图</p>
        </ColumnImgUpload>
      </el-form-item>
      <el-form-item class="img-upload" prop="imgShareUrl">
        <ColumnImgUpload
          @uploadSuccess="handleImgShareUploadSuccess"
          :imgUrl="videoData.imgShareUrl"
          :needClear="!editShow">
          <p>分享图</p>
        </ColumnImgUpload>
      </el-form-item>
    </div>
    <el-row>
      <el-col :span="6" :offset="18">
        <el-button type="primary" @click="submitBtnOnClick">发布</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import validator from '@/assets/js/utils/validator';
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';
import apiUrlConfig from '@/api/apiUrlConfig';

export default {
  name: 'columnVideoEdit',
  props: ['videoEditShow', 'columnData', 'isNew'],
  components: {
    ColumnImgUpload
  },
  data() {
    return {
      uploadImgUrl: '/call/caseFolder/case_folder_attachment/upload/',
      editShow: this.videoEditShow,
      videoData: {
        columnId: this.columnData && this.columnData.columnId,
        columnName: this.columnData && this.columnData.columnName,
        columnType: this.columnData && this.columnData.columnType,
        columnDesc: this.columnData && this.columnData.columnDesc,
        columnUrlScheme: this.columnData && this.columnData.columnUrlScheme,
        imgIconUrl: this.columnData && this.columnData.imgIconUrl,
        imgShareUrl: this.columnData && this.columnData.imgShareUrl,
        imgIconData: this.columnData && this.columnData.imgIconData,
        imgShareData: this.columnData && this.columnData.imgShareData
      },
      rules: {
        columnName: [
          {required: true, message: '请输入栏目名称', trigger: 'blur'},
          {max: 10, message: '最长10个字'},
          {validator: validator.fullSpanceVaild, message: '栏目名称不能全为空格', trigger: 'blur'}
        ],
        columnDesc: [
          {required: true, message: '请输入栏目介绍', trigger: 'blur'},
          {max: 500, message: '最长500个字'},
          {validator: validator.fullSpanceVaild, message: '栏目介绍不能全为空格', trigger: 'blur'}
        ],
        // columnUrlScheme: [{required: true, message: '自动按照栏目id+栏目类型进行系统匹配URL Scheme，支持手动修改', trigger: 'blur'}],
        imgIconUrl: [{required: true, message: '请上传头图', trigger: 'change'}],
        imgShareUrl: [{required: true, message: '请上传分享图'}]
      }
    };
  },
  watch: {
    videoEditShow(newVal) {
      this.editShow = newVal;
      if (newVal) {
        this.$refs.columnVideoEditForm.clearValidate();
      }
    },
    columnData() {
      for (let key in this.videoData) {
        this.videoData[key] = '';
      }
      if (this.columnData) {
        // 表单赋值
        this.videoData.columnId = this.columnData.columnId;
        this.videoData.columnName = this.columnData.columnName;
        this.videoData.columnType = this.columnData.columnType;
        this.videoData.columnUrlScheme = this.columnData.columnUrlScheme;
        this.videoData.columnDesc = this.columnData.columnDesc;
        this.videoData.imgIconData = this.columnData.imgIconData;
        this.videoData.imgIconUrl = this.columnData.imgIconUrl;
        this.videoData.imgShareData = this.columnData.imgShareData;
        this.videoData.imgShareUrl = this.columnData.imgShareUrl;
      }
    }
  },
  methods: {
    submitData() {
      let data = {
        columnId: this.videoData.columnId,
        columnType: this.videoData.columnType,
        columnName: this.videoData.columnName,
        columnDesc: this.videoData.columnDesc,
        columnUrlScheme: this.videoData.columnUrlScheme,
        attList: [this.videoData.imgIconData, this.videoData.imgShareData]
      };
      this.$emit('submitData', data);
    },
    submitBtnOnClick() {
      this.$refs.columnVideoEditForm.validate((vaild) => {
        if (vaild) {
          this.submitData();
        }
        else {
          return false;
        }
      });
    },
    handleImgIconUploadSuccess(data) {
      const id = this.videoData && this.videoData.imgIconData && this.videoData.imgIconData.id ? this.videoData.imgIconData.id : null;
      this.videoData.imgIconData = data;
      if (id) {
        this.videoData.imgIconData.id = id;
      }
      this.videoData.imgIconData.attType = 1;
      this.videoData.imgIconUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.columnVideoEditForm.validateField('imgIconUrl');
    },
    handleImgShareUploadSuccess(data) {
      const id = this.videoData && this.videoData.imgShareData && this.videoData.imgShareData.id ? this.videoData.imgShareData.id : null;
      this.videoData.imgShareData = data;
      if (id) {
        this.videoData.imgShareData.id = id;
      }
      this.videoData.imgShareData.attType = 2;
      this.videoData.imgShareUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.columnVideoEditForm.validateField('imgShareUrl');
    }
  }
};
</script>

<style scoped lang="scss">

  .column-img-upload {
    p {
      text-align: center;
      margin-top: 10px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 12px;
    }
  }

  .img-upload {
    display: inline-block;
    &:nth-child(2) {
      margin-left: -80px;
    }
  }

  .el-button {
    float: right;
    padding: 10px 56px;
    background: #3846DC;
  }
</style>
<style lang="scss">
  .column-course-img-label .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }

  .column-video-edit textarea {
    font-family: PingFangSC-Regular;
  }
</style>
