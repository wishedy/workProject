<template>
<!-- 科室信息 -->
  <section id="section" class="order-edit-container">
    <div class="departments-info">
      <div class="info-set">在线预约挂号科室信息-科室信息设置</div>
      <div class="departments-id">
        <div class="info-id">
          <span>科室ID</span>
          <span>{{options}}</span>
        </div>
        <div class="info-btn">
          <el-button type="info" v-if="options" @click="cancel">
            返回
          </el-button>
          <el-button type="primary" @click="deptSave('searchForm')">
            保存
          </el-button>
        </div>
      </div>
    </div>
    <!-- 科室数据 -->
    <div class="departments-data">
      <el-form ref="searchForm" :rules="rules" :model='deptData' class="searchForm-orderSection" style="position: relative;"  label-width="150px">
        <el-form-item label="绑定医院HIS科室" prop="hisDepartmentName">
          <!-- <span>{{deptData.hisDepartmentCode}}</span> -->
          <span >{{deptData.hisDepartmentName}}</span>
          <el-button class="choose" @click="selectDept">选择</el-button>
        </el-form-item>
        <el-form-item label="科室名称" prop="deptName">
          <el-input
            style="width: 100%"
            v-model="deptData.deptName"
            placeholder="请输入科室名称"
            maxlength="10"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <p class="rules" :class="deptData.deptName.length === 10 ? 'red' : ''">规格说明：最多10个中文字符</p>
        </el-form-item>
        <el-form-item label="科室icon" prop="attachmentUrl">
            <upload-img
              allinmed="allinmed"
              @imgDataList="imgInfo"
              :dafaultImg="deptData.attachmentUrl.indexOf('https://img05.allinmed.cn/') === -1 ? deptData.attachmentUrl ?'https://img05.allinmed.cn/' + deptData.attachmentUrl : '' : deptData.attachmentUrl"
            ></upload-img>
        </el-form-item>
        <el-form-item>
          <p class="rules">规格说明：像素96*96</p>
        </el-form-item>
        <el-form-item label="科室擅长病种" prop="deptDisease">
          <el-input
            maxlength="200"
            type="textarea"
            v-model="deptData.deptDisease"
            placeholder=""
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <p class="rules" :class="deptData.deptDisease.length === 200 ? 'red' : ''">最多输入200中文字符</p>
        </el-form-item>
        <el-form-item label="科室擅长介绍" prop="deptIntroduce">
          <el-input
            maxlength="500"
            type="textarea"
            v-model="deptData.deptIntroduce"
            placeholder=""
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <p class="rules" :class="deptData.deptIntroduce.length === 500 ? 'red' : ''">最多输入500中文字符</p>
        </el-form-item>
      </el-form>
    </div>
    <!-- 科室专业介绍 -->
    <div class="major-introductio">
      <div class="introductio">
        <span>专业介绍</span>
        <el-button class="viewBotton" @click="handleMajorIntro">新增专业介绍</el-button>
      </div>
      <div class="introductio-data">
        <el-table
          :data="deptData.deptTextDescList"
          style="width: 100%">
          <el-table-column
            prop="deptName"
            label="专业名称">
          </el-table-column>
          <el-table-column
            prop="deptIntroduce"
            label="专业介绍文案">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                @click="handleDelete(scope.$index, scope.row)">移除</el-button>
              <el-button size="mini"
                type="danger"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 科室医生列表 -->
    <div class="departments-doctor">
      <div class="introductio">
        <span>科室医生</span>
        <el-button class="viewBotton" @click="openAddDoctorDialog">新增医生</el-button>
      </div>
      <div class="introductio-data">
        <el-table
          :data="deptData.doctorList"
          style="width: 100%">
          <el-table-column
            prop="doctorId"
            label="医生ID">
          </el-table-column>
          <el-table-column
            prop="doctorName"
            label="医生姓名">
          </el-table-column>
          <el-table-column
            prop="hospitalName"
            label="所在医院">
          </el-table-column>
          <el-table-column
            prop="medicalTitle"
            label="医生职称">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                type="danger"
                @click="doctorHandleDelete(scope.$index, scope.row)"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="gap"></div>
    <!-- 专业介绍详情 -->
    <el-dialog
      title="科室专业介绍详情"
      :visible.sync="majorIntroDialogVisible"
      width="756px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <section>
        <section-intro :isEdit="false" :visible.sync="majorIntroDialogVisible" :param="sectionInfoparam" @getEditDetail="getEditDetail"></section-intro>
      </section>
    </el-dialog>

    <!-- 选择医生 -->
    <el-dialog
      title="选择医生"
      :visible.sync="selectDoctorDialogVisible"
      width="1000px"
      :close-on-click-modal="false"
    >
      <section>
        <select-doctor :doctorList="deptData.doctorList" :deptId="''" @addRow="addRow"></select-doctor>
      </section>
    </el-dialog>
    <!-- HIS科室选择 -->
    <el-dialog
      title="HIS科室选择"
      :visible.sync="isShow"
      :close-on-click-modal="false"
      width="1000px">
      <section>
        <dept-select :deptData='deptSelectList' @deptSelect='deptSelect'></dept-select>
      </section>
    </el-dialog>
    <!-- 提示弹框 -->
    <tip-dialog
      :close-on-click-modal="false"
      :tipDialog="tipDialogData"
      @DialogTip="dialogTip"
      :deptData="deptData"></tip-dialog>
  </section>
</template>

<script>
import deptSelect from './components/deptSelect';
import tipDialog from './components/tipDialog';
import uploadImg from '../collegeClass/components/uploadImg';
import apiConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import sectionIntro from './handleSectionIntro';
import selectDoctor from './selectDoctor';
// import { constants } from 'fs';

// import {formatMenuDataList} from '@/assets/js/utils/auth';

export default {
  data() {
    return {
      // 提示框数据
      tipDialogData: {
        DialogVisible: false,
        content: ''
      },
      isShow: false, // 控制提示框是否显示
      // 规则
      rules: {
        deptName: [
          { required: true, message: '请输入科室名称', trigger: 'blur' }
        ],
        hisDepartmentName: [
          { required: true, message: '请选择科室', trigger: 'change' }
        ],
        attachmentUrl: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        deptDisease: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        deptIntroduce: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      themeUrl: '',
      // 判断是新增还是编辑
      options: '',
      deptData: {
        'hospitalId': 1,
        'deptName': '',
        'deptIntroduce': '',
        'deptDisease': '',
        'hisDepartmentCode': '',
        'hisDepartmentName': '',
        'attachmentUrl': '',
        'doctorList': [],
        'deptTextDescList': []
      },
      deptSelectList: [], // HIS科室选择列表
      dialogVisible: false, // 控制弹框显示还是隐藏
      majorIntroDialogVisible: false, // 专业介绍
      isEdit: false, // 专业介绍是新增还是编辑 默认新增
      sectionInfoparam: {}, // 专业介绍参数对象
      selectDoctorDialogVisible: false // 选择医生
    };
  },
  mounted() {
    // 获取详情  根据穿的id
    if (this.$route.query.id) {
      this.options = Number(this.$route.query.id);
      // this.rules.deptSelect[0].required = false;
      // this.rules.img[0].required = false;
      axios({
        url: apiConfig.deptDetail.url,
        method: apiConfig.deptDetail.type,
        params: {
          'deptId': this.options
        }
      }).then(res => {
        if (
          res &&
          res.data &&
          res.data.responseObject &&
          res.data.responseObject.responseData
        ) {
          this.deptData = res.data.responseObject.responseData;
        }
        else {
          this.$message({
            showClose: true,
            message: '获取失败!',
            type: 'error'
          });
        }
      });
    }
    else {
      this.deptData = {
        'hospitalId': 1,
        'deptName': '',
        'deptIntroduce': '',
        'deptDisease': '',
        'hisDepartmentCode': '',
        'hisDepartmentName': '',
        'attachmentUrl': '',
        'doctorList': [],
        'deptTextDescList': []
      };
    }
  },
  components: {
    deptSelect,
    sectionIntro,
    selectDoctor,
    uploadImg,
    tipDialog
  },
  methods: {
    // 弹框提示,
    dialogTip(tip) {
      console.log(tip);
      this.tipDialogData = {
        DialogVisible: tip
      };
    },
    // HIS科室选择列表
    selectDept() {
      /**
       * hospitalId long HIS科室id
       * deptId long  科室id
      */
      axios({
        url: apiConfig.deptSelect.url,
        method: apiConfig.deptSelect.type,
        params: {
          hospitalId: 1,
          deptId: this.options ? this.options : 0
        }
      }).then(res => {
        this.deptSelectList = res.data.responseObject.responseData.dataList;
        this.isShow = true;
      });
    },
    // HIS科室选择返回的数据
    deptSelect(data) {
      let deptSelectList = [...this.deptSelectList];
      deptSelectList[data.index].state = 1;
      this.deptSelectList = deptSelectList;
      this.deptData.hisDepartmentCode = data.row.deptCode;
      this.deptData.hisDepartmentName = data.row.deptName;
      this.isShow = false;
      this.$refs['searchForm'].validateField('hisDepartmentName');
    },
    // 图片信息
    imgInfo(data) {
      this.deptData.attachmentUrl = data.attUrl;
      let _this = this, attUrl = data.attUrl;
      if (attUrl.indexOf('//img05.allinmd.cn/') === -1) {
        _this.themeUrl = '//img05.allinmd.cn/' + attUrl;
      }
      else {
        _this.themeUrl = attUrl;
      }
      this.$refs['searchForm'].validateField('attachmentUrl');
    },
    // 警告
    warn() {
      this.$message({
        showClose: true,
        message: '该数据已存在，请不要重复添加!',
        type: 'warning'
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('getEditDetail', this.searchForm);
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 专业介绍列表编辑
    handleEdit(index, row) {
      this.majorIntroDialogVisible = true;
      this.isEdit = true; // 专业介绍是新增还是编辑 默认新增
      this.sectionInfoparam = row; // 专业介绍参数对象
      this.sectionInfoparam.index = index;
    },
    // 专业介绍列表移除
    handleDelete(index, row) {
      let data = [...this.deptData.deptTextDescList];
      data.splice(index, 1);
      this.deptData.deptTextDescList = data;
    },
    // 医生列表移除
    doctorHandleDelete(index, row) {
      let data = [...this.deptData.doctorList];
      data.splice(index, 1);
      this.deptData.doctorList = data;
    },
    // 新增专业介绍
    handleMajorIntro() {
      this.isEdit = false; // 专业介绍是新增还是编辑 默认新增
      this.sectionInfoparam = {}; // 专业介绍参数对象
      this.majorIntroDialogVisible = true;
    },
    // 添加医生返回的数据  如果存在相同的数据 提示不能重复添加！！
    addRow(data) {
      console.log(data, 'Nihap');
      if (!this.deptData.doctorList.find(item => item.doctorId === data.doctorId)) {
        this.deptData.doctorList.push(data);
      }
      else {
        this.warn();
      }
    },
    // 添加医生弹框
    openAddDoctorDialog() {
      this.selectDoctorDialogVisible = true;
    },
    // 编辑科室专业介绍返回的数据
    getEditDetail(data) {
      console.log(data, 'dadadad');
      // 判断是新增的返回的数据还是编辑返回的数据
      if (this.isEdit) {
        this.deptData.deptTextDescList = this.deptData.deptTextDescList.map((item, index) => {
          if (index === data.index) {
            item = {
              deptTextId: data.deptTextId,
              deptIntroduce: data.deptIntroduce,
              deptName: data.deptName
            };
          };
          return item;
        });
      }
      else {
        if (!this.deptData.deptTextDescList.find(item => item.deptName === data.deptName)) {
          this.deptData.deptTextDescList.push({
            deptTextId: 0,
            deptIntroduce: data.deptIntroduce,
            deptName: data.deptName
          });
        }
        else {
          this.warn();
        }
      }
      this.majorIntroDialogVisible = false;
    },
    // 科室保存
    deptSave(searchForm) {
      this.$refs[searchForm].validate((valid) => {
        if (valid) {
          this.tipDialogData = {
            dialogVisible: true,
            content: '您确定要保存吗?'
          };
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
    // 返回
    cancel() {
      this.tipDialogData = {
        dialogVisible: true,
        content: '是否保存修改的数据?'
      };
    }
  }
};
</script>

<style lang="scss">
  #section{
    width: 1200px;
    margin: 10px auto;
  }
  .order-edit-container{
    height: auto;
    font-size: 14px;
    width: 100%;
    height: auto;
    font-weight: 200;
    .departments-info{
      width: 100%;
      box-sizing: border-box;
      margin-bottom: 10px;
      background: #fff;
      box-sizing: border-box;
      padding: 20px;
      .info-set{
        font-size:20px;
        font-weight:600;
        color:rgba(44,52,58,1);
        line-height:20px;
        margin: 32px 0 20px 0;
      }
      .departments-id{
        width: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        margin-top: 20px;
        .info-id{
          width: 40%;
          &>span{
            margin-right: 20px;
          }
        }
        .info-btn{
          flex: 1;
          text-align: right;
        }
      }
    }
    .departments-data{
      width: 100%;
      margin: 0 auto;
      margin-top: 20px;
      background: #fff;
      box-sizing: border-box;
      padding: 20px;
      .searchForm-orderSection{
        > .el-form-item:nth-child(1){
          margin-bottom: 30px;
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
      }
      .el-form-item__label {
        text-align: left;
      }
      .el-form-item__content{
        & > span {
          margin-right: 15px;
        }
      }
    }
    .major-introductio, .departments-doctor{
      width: 100%;
      margin: 0 auto;
      background: #ffffff;
      margin-top: 30px;
      .introductio{
        box-sizing: 20px;
        padding: 10px;
        display: flex;
        justify-content: space-between;
        &>span{
          margin-left: 5px;
          font-weight: 900;
          font-size: 16px;
        }
      }
      .el-table, thead{
        font-size: 14px;
        font-weight: 400;
        font-style: normal;
        color: #000000;
      }
     .el-table th>.cell, tbody .cell {
        padding-left: 38px;
      }
      td.el-table_1_column_2{
        &>div{
          width: 180px;
          height: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .gap{
      width: 1200px;
      margin: 0 auto;
      margin: 30px 0;
    }
    .dept-select{
      width: 1px;
      height: 1px;
      color: #fff;
      background: #fff;
      border: 0;
    }
    .rules{
      margin-top: -18px;
    }
    label.el-form-item__label:nth-child(1){
      width: 160px;
    }
    .red{
      color: red;
    }
  }
</style>
