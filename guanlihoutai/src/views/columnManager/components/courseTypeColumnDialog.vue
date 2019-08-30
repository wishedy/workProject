<template>
  <el-dialog
    width="70%"
    class="course-type-column-dialog"
    center
    :visible.sync="editShow"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div slot="title" class="dialog-title">{{editTitle}}</div>
    <el-form
      label-width="100px"
      ref="courseTypeColumnForm"
      :model="editData"
      :rules="rules"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="课程ID">
            <el-input placeholder="系统分配" v-model="editData.courseId" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item label="课程名称" prop="courseName">
            <el-input placeholder="课程名称" v-model="editData.courseName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="用户ID">
            <el-input placeholder="按内容自动读取" v-model="editData.customerIdList" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户姓名">
            <el-input placeholder="按ID自动读取" v-model="editData.customerNameList" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="顺序号" prop="sortId" v-if="!newDialog">
            <el-input placeholder="输入序号" v-model="editData.sortId"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="选集总数" prop="anthologyNum">
            <el-input placeholder="输入数字" v-model="editData.anthologyNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专业" prop="areasExpertiseId">
            <el-select
              v-model="editData.areasExpertiseId"
              placeholder="请选择专业"
            >
              <el-option v-for="item in profession"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="适合人群" prop="suitCrowd">
            <el-input type="textarea" :rows="3" v-model="editData.suitCrowd"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="课程介绍" prop="courseDesc">
            <el-input type="textarea" :rows="3" v-model="editData.courseDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="讲师介绍" prop="customerDesc">
            <el-input type="textarea" :rows="3" v-model="editData.customerDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="column-course-img-list">
        <el-form-item label="配图" class="column-course-img-label img-upload" prop="imgListUrl">
          <ColumnImgUpload
            @uploadSuccess="handleImgListUploadSuccess"
            :imgUrl="editData.imgListUrl"
            :needClear="!editShow">
            <p>列表页配图</p>
          </ColumnImgUpload>
        </el-form-item>
        <el-form-item class="column-course-img-label img-upload" prop="imgIconUrl">
          <ColumnImgUpload
            @uploadSuccess="handleImgIconUploadSuccess"
            :imgUrl="editData.imgIconUrl"
            :needClear="!editShow">
            <p>落地页头图</p>
          </ColumnImgUpload>
        </el-form-item>
        <el-form-item class="img-upload" prop="imgShareUrl">
          <ColumnImgUpload
            @uploadSuccess="handleImgShareUploadSuccess"
            :imgUrl="editData.imgShareUrl"
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
  </el-dialog>
</template>

<script>
/*
   * 课程管理-新增/编辑课程弹窗
   **/
import validator from '@/assets/js/utils/validator';
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'courseTypeColumnDialog',
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    newDialog: {
      type: Boolean,
      require: false
    },
    dialogData: {
      type: Object,
      require: false
    },
    profession: {
      type: Array,
      require: true
    }
  },
  components: {
    ColumnImgUpload
  },
  data() {
    return {
      uploadImgUrl: '/call/caseFolder/case_folder_attachment/upload/',
      editTitle: '',
      columnId: this.$route.query.columnId,
      editShow: this.dialogShow,
      editData: {
        courseId: '',
        courseName: '',
        customerIdList: '',
        customerNameList: '',
        sortId: '',
        anthologyNum: '', // 课程（选集）总数
        areasExpertiseId: '',
        suitCrowd: '', // 适合人群
        courseDesc: '',
        customerDesc: '',
        imgIconUrl: '',
        imgShareUrl: '',
        imgListUrl: '',
        imgIconData: {},
        imgShareData: {},
        imgListData: {}
      },
      rules: {
        courseName: [
          {required: true, message: '课程名称不能为空', trigger: 'blur'},
          {max: 30, message: '最长30个字'},
          {validator: validator.fullSpanceVaild, message: '栏目名称不能全为空格', trigger: 'blur'}
        ],
        sortId: [
          {required: true, message: '顺序号不能为空', trigger: 'blur'},
          {validator: validator.isPositiveInteger, message: '选集序号必须为正整数', trigger: 'blur'}
        ],
        anthologyNum: [
          {required: true, message: '选集总数必须为正整数', trigger: 'blur'},
          {validator: validator.isPositiveInteger, message: '选集总数必须为正整数', trigger: 'blur'}
        ],
        suitCrowd: [
          {required: true, message: '适合人群不能为空', trigger: 'blur'},
          {max: 500, message: '最长500个字'},
          {validator: validator.fullSpanceVaild, message: '适合人群不能为空', trigger: 'blur'}
        ],
        courseDesc: [
          {required: true, message: '课程介绍不能为空', trigger: 'blur'},
          {max: 500, message: '最长500个字'},
          {validator: validator.fullSpanceVaild, message: '课程介绍不能为空', trigger: 'blur'}
        ],
        customerDesc: [
          {required: true, message: '讲师介绍不能为空', trigger: 'blur'},
          {max: 500, message: '最长500个字'},
          {validator: validator.fullSpanceVaild, message: '讲师介绍不能为空', trigger: 'blur'}
        ],
        areasExpertiseId: [
          {required: true, message: '专业选项不能为空', trigger: 'blur'}
        ],
        imgListUrl: [{required: true, message: '请上传列表页配图', trigger: 'change'}],
        imgIconUrl: [{required: true, message: '请上传落地页头图', trigger: 'change'}],
        imgShareUrl: [{required: true, message: '请上传分享图'}]

      }
    };
  },
  watch: {
    dialogShow(newVal) {
      this.editShow = newVal;
      if (newVal) {
        this.$refs.courseTypeColumnForm && this.$refs.courseTypeColumnForm.clearValidate();
        for (let key in this.editData) {
          this.editData[key] = '';
        }

        if (this.newDialog) {
          this.editTitle = '新增课程';
        }
        else {
          if (this.dialogData) {
            this.editTitle = '编辑课程';
            this.editData.courseId = this.dialogData.courseId;
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
        method: apiUrlConfig.getCourseDetailData.type,
        url: apiUrlConfig.getCourseDetailData.url,
        params: {
          columnId: this.columnId,
          courseId: this.editData.courseId
        }
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        this.editShow = true;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          this.editData.courseName = responseData.courseName;
          this.editData.customerIdList = responseData.customerIdList;
          this.editData.customerNameList = responseData.customerNameList;
          this.editData.sortId = responseData.sortId;
          this.editData.anthologyNum = responseData.anthologyNum;
          this.editData.areasExpertiseId = parseInt(responseData.areasExpertiseId);
          this.editData.suitCrowd = responseData.suitCrowd;
          this.editData.courseDesc = responseData.courseDesc;
          this.editData.customerDesc = responseData.customerDesc;
          let img = {};
          for (let i = 0; i < responseData.attList.length; i++) {
            img = responseData.attList[i];
            if (img.attType === '1') {
              this.editData.imgIconData = img;
              this.editData.imgIconUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
            }
            else if (img.attType === '2') {
              this.editData.imgShareData = img;
              this.editData.imgShareUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
            }
            else if (img.attType === '3') {
              this.editData.imgListData = img;
              this.editData.imgListUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
            }
          }
        }
      }).catch((err) => {
        // 取消loading
        comm.closeLoading();
        this.editShow = true;
        console.log('获取课程型栏目详细数据失败：', err);
      });
    },
    submitData() {
      let data = {
        columnId: this.columnId,
        visitSiteId: 25, // 站点固定为25
        courseId: this.editData.courseId,
        courseName: this.editData.courseName,
        sortId: this.editData.sortId,
        anthologyNum: this.editData.anthologyNum,
        areasExpertiseId: this.editData.areasExpertiseId,
        suitCrowd: this.editData.suitCrowd,
        courseDesc: this.editData.courseDesc,
        customerDesc: this.editData.customerDesc,
        attList: [this.editData.imgListData, this.editData.imgIconData, this.editData.imgShareData]
      };

      for (let i = 0; i < data.attList.length; i++) {
        data.attList[i].columnType = 1; // 课程型栏目后台附件的 columnType 固定为1
      }

      let _data = {};
      for (let key in data) {
        if (data[key]) _data[key] = data[key];
      }
      data = _data;
      let contentTitle = this.newDialog ? '新增' : '编辑';
      // 添加loading
      comm.openLoading('加载中...');
      this.editShow = false;
      axios({
        method: apiUrlConfig.saveColumnCourse.type,
        url: apiUrlConfig.saveColumnCourse.url,
        data: data
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true) {
          this.$allin_confirm({
            title: '提示',
            content: contentTitle + '课程成功',
            type: 'notice',
            done: () => {
              this.handleClose(true);
            }
          });
        }
        else {
          this.$allin_confirm({
            title: '提示',
            content: contentTitle + '课程失败',
            type: 'notice',
            done: () => {
              this.handleClose();
            }
          });
        }
      }).catch(() => {
        // 取消loading
        comm.closeLoading();
        this.$allin_confirm({
          title: '提示',
          content: contentTitle + '课程失败',
          type: 'notice',
          done: () => {
            this.handleClose();
          }
        });
      });
    },
    submitBtnOnClick() {
      this.$refs.courseTypeColumnForm.validate((vaild) => {
        if (vaild) {
          this.submitData();
        }
        else {
          return false;
        }
      });
    },
    handleClose(neeUpdate) {
      this.$emit('closeDialog', neeUpdate);
    },
    handleImgListUploadSuccess(data) {
      // 列表页配图上传成功回调函数
      const id = this.editData && this.editData.imgListData && this.editData.imgListData.id ? this.editData.imgListData.id : null;
      this.editData.imgListData = data;
      if (id) {
        this.editData.imgListData.id = id;
      }
      this.editData.imgListData.attType = 3;
      this.editData.imgListUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.courseTypeColumnForm.validateField('imgListUrl');
    },
    handleImgIconUploadSuccess(data) {
      // 头图上传成功回调函数
      const id = this.editData && this.editData.imgIconData && this.editData.imgIconData.id ? this.editData.imgIconData.id : null;
      this.editData.imgIconData = data;
      if (id) {
        this.editData.imgIconData.id = id;
      }
      this.editData.imgIconData.attType = 1;
      this.editData.imgIconUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.courseTypeColumnForm.validateField('imgIconUrl');
    },
    handleImgShareUploadSuccess(data) {
      // 分享图上传成功回调函数
      const id = this.editData && this.editData.imgShareData && this.editData.imgShareData.id ? this.editData.imgShareData.id : null;
      this.editData.imgShareData = data;
      if (id) {
        this.editData.imgShareData.id = id;
      }
      this.editData.imgShareData.attType = 2;
      this.editData.imgShareUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      this.$refs.courseTypeColumnForm.validateField('imgShareUrl');
    }
  },
  mounted() {

  }
};
</script>

<style scoped lang="scss">
  .dialog-title {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: #222222;
    letter-spacing: 0;
    line-height: 24px;
    font-weight: bolder;
  }

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
<style>
  .column-course-img-label .el-form-item__label:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }

  .course-type-column-dialog textarea {
    font-family: PingFangSC-Regular;
  }
</style>
