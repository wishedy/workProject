<template>
  <el-form v-show="editShow"
           class="course-edit-show"
           label-width="100px"
           :rules="rules"
           :model="courseData"
           ref="columnCourseEditForm"
  >
    <el-row>
      <el-col :span="8">
        <el-form-item label="栏目ID">
          <el-input
            v-model="courseData.columnId"
            disabled
            placeholder="自动生成栏目ID"
          >
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item label="栏目名称" prop="columnName">
          <el-input
            v-model="courseData.columnName"
            placeholder="输入栏目名称"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="栏目介绍" prop="columnDesc">
          <el-input type="textarea" placeholder="输入栏目介绍" v-model="courseData.columnDesc"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-form-item label="查看全部" prop="columnUrlScheme">
          <el-input placeholder="自动按照栏目id+栏目类型进行系统匹配URL Scheme,支持手动修改" v-model="courseData.columnUrlScheme"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <div class="column-course-img-list">
      <el-form-item label="配图" class="column-course-img-label img-upload" prop="imgListUrl">
        <ColumnImgUpload
          @uploadSuccess="handleImgListUploadSuccess"
          :imgUrl="courseData.imgListUrl"
          :needClear="!editShow">
          <p>列表页配图</p>
        </ColumnImgUpload>
      </el-form-item>
      <el-form-item class="column-course-img-label img-upload" prop="imgIconUrl">
        <ColumnImgUpload
          @uploadSuccess="handleImgIconUploadSuccess"
          :imgUrl="courseData.imgIconUrl"
          :needClear="!editShow">
          <p>落地页头图</p>
        </ColumnImgUpload>
      </el-form-item>
      <el-form-item class="img-upload" prop="imgShareUrl">
        <ColumnImgUpload
          @uploadSuccess="handleImgShareUploadSuccess"
          :imgUrl="courseData.imgShareUrl"
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
  name: 'columnCourseEdit',
  props: {
    courseEditShow: {
      type: Boolean,
      default: false
    },
    columnData: {
      type: Object,
      default: () => {}
    },
    isNew: {
      type: Boolean,
      require: false
    }
  },
  components: {
    ColumnImgUpload
  },
  data() {
    return {
      editShow: this.courseEditShow,
      courseData: {
        columnId: this.columnData && this.columnData.columnId,
        columnType: this.columnData && this.columnData.columnType,
        columnName: this.columnData && this.columnData.columnName,
        columnDesc: this.columnData && this.columnData.columnDesc,
        columnUrlScheme: this.columnData && this.columnData.columnUrlScheme,
        customerIdList: this.columnData && this.columnData.customerIdList,
        customerNameList: this.columnData && this.columnData.customerNameList,
        imgListUrl: this.columnData && this.columnData.imgListUrl,
        imgIconUrl: this.columnData && this.columnData.imgIconUrl,
        imgShareUrl: this.columnData && this.columnData.imgShareUrl,
        imgListData: this.columnData && this.columnData.imgListData,
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
        imgListUrl: [{required: true, message: '请上传列表页配图', trigger: 'change'}],
        imgIconUrl: [{required: true, message: '请上传落地页头图', trigger: 'change'}],
        imgShareUrl: [{required: true, message: '请上传分享图'}]
      }
    };
  },
  watch: {
    courseEditShow(newVal) {
      this.editShow = newVal;
      if (newVal) {
        this.$refs.columnCourseEditForm.clearValidate();
      }
    },
    columnData() {
      for (let key in this.courseData) {
        this.courseData[key] = '';
      }
      if (this.columnData) {
        // 表单赋值
        this.courseData.columnId = this.columnData.columnId;
        this.courseData.columnName = this.columnData.columnName;
        this.courseData.columnType = this.columnData.columnType;
        this.courseData.columnUrlScheme = this.columnData.columnUrlScheme;
        this.courseData.columnDesc = this.columnData.columnDesc;
        this.courseData.customerIdList = this.columnData.customerIdList;
        this.courseData.customerNameList = this.columnData.customerNameList;
        this.courseData.imgIconData = this.columnData.imgIconData;
        this.courseData.imgIconUrl = this.columnData.imgIconUrl;
        this.courseData.imgShareData = this.columnData.imgShareData;
        this.courseData.imgShareUrl = this.columnData.imgShareUrl;
        this.courseData.imgListData = this.columnData.imgListData;
        this.courseData.imgListUrl = this.columnData.imgListUrl;
      }
    }
  },
  methods: {
    submitData() {
      let data = {
        columnId: this.courseData.columnId,
        columnType: this.courseData.columnType,
        columnName: this.courseData.columnName,
        columnDesc: this.courseData.columnDesc,
        columnUrlScheme: this.courseData.columnUrlScheme,
        attList: [this.courseData.imgIconData, this.courseData.imgShareData, this.courseData.imgListData]
      };
      this.$emit('submitData', data);
    },
    submitBtnOnClick() {
      this.$refs.columnCourseEditForm.validate((vaild) => {
        if (vaild) {
          this.submitData();
        }
        else {
          return false;
        }
      });
    }, // 头图上传成功回调函数
    handleImgIconUploadSuccess(data) {
      const id = this.courseData && this.courseData.imgIconData && this.courseData.imgIconData.id ? this.courseData.imgIconData.id : null;
      this.courseData.imgIconData = data;
      if (id) {
        this.courseData.imgIconData.id = id;
      }
      this.courseData.imgIconData.attType = 1;
      this.courseData.imgIconUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.columnCourseEditForm.validateField('imgIconUrl');
    }, // 分享图上传成功回调函数
    handleImgShareUploadSuccess(data) {
      const id = this.courseData && this.courseData.imgShareData && this.courseData.imgShareData.id ? this.courseData.imgShareData.id : null;
      this.courseData.imgShareData = data;
      if (id) {
        this.courseData.imgShareData.id = id;
      }
      this.courseData.imgShareData.attType = 2;
      this.courseData.imgShareUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.columnCourseEditForm.validateField('imgShareUrl');
    }, // 列表页配图上传成功回调函数
    handleImgListUploadSuccess(data) {
      const id = this.courseData && this.courseData.imgListData && this.courseData.imgListData.id ? this.courseData.imgListData.id : null;
      this.courseData.imgListData = data;
      if (id) {
        this.courseData.imgListData.id = id;
      }
      this.courseData.imgListData.attType = 3;
      this.courseData.imgListUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.columnCourseEditForm.validateField('imgListUrl');
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
    &:nth-child(3) {
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

  .course-edit-show textarea {
    font-family: PingFangSC-Regular;
  }
</style>
