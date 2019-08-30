<template>
  <section class="creat-main-contains">
    <h1 class="code-title">{{showTitle}}</h1>
    <el-form :model="courseData"
             :rules="rules"
             :label-position="'left'"
             label-width="110px"
             ref="courseForm"
             class="form-container">
      <h2 class="code-info-title"><i class="icon-bg"></i><span>基本信息</span></h2>
      <el-form-item label="课程名称" prop="courseName">
        <el-input
          placeholder="付费课程名称，不超过20个字符"
          v-model.trim="courseData.courseName"
          maxlength="20"
          class="el-input-width el-input-name"
        ></el-input>
      </el-form-item>
      <el-form-item label="上架类型" prop="courseType">
        <el-radio-group v-model="courseData.courseType">
          <el-radio :label=2>售卖</el-radio>
          <el-radio :label=1>预告</el-radio>
        </el-radio-group>
      </el-form-item>
      <!--预告配置-->
      <el-form-item label="预告文案" prop="noticeDesc" v-if="courseData.courseType===1">
              <el-input
                placeholder="请输入预告文案"
                v-model.trim="courseData.noticeDesc"
                maxlength="10"
                class="el-input-width el-input-name"
              ></el-input>
            </el-form-item>
      <el-form-item label="课程简介" prop="courseDesc" v-if="courseData.courseType===2">
        <el-input placeholder=" 付费课程描述，不超过20个字符
      "
                  type="textarea"
                  maxlength="20"
                  class="el-textarea-width"
                  v-model.trim="courseData.courseDesc"></el-input>
      </el-form-item>
      <el-form-item label="讲师姓名" prop="teacherList" v-if="courseData.courseType===2">
        <div class="teacher-tag-list">
          <el-tag
            class="el-tag-item"
            v-for="(teacher,index) in courseData.courseTeacherVOList"
            :key="index"
            :type="''"
            closable
            @close="handleRemoveTag(teacher)"
          >
            {{teacher.customerName}}
          </el-tag>
        </div>
        <el-button @click="openTeacher" class="btn-add-teacher">添加讲师</el-button>
      </el-form-item>
      <!--售卖配置-->
      <section v-if="courseData.courseType===2">
        <el-form-item label="课程售价" prop="coursePriceElement">
          <el-input
            placeholder="请输入商品售价"
            v-model.trim="courseData.coursePriceElement"
            maxlength="20"

            class="el-input-width el-input-name"
            :rules="[{
                  required: true, message: '商品售价不能为空', trigger: 'blur'
                }]"
          ></el-input>
          元
        </el-form-item>
        <el-form-item label="课程总数" prop="totalNum">
          共
          <el-input
            placeholder="10"
            v-model.trim="courseData.totalNum"
            maxlength="20"
            class="el-input-total-num-width el-input-name"
            :rules="[{
                  required: true, message: '课程总数不能为空', trigger: 'blur'
                }]"
          ></el-input>
          讲
        </el-form-item>
      </section>
      <el-row>
        <el-col :span="20">
          <el-form-item label="课程封面" prop="appCoverPicUrl">
            APP端封面图
            <ColumnImgUpload
              :imgUrl="courseData.appCoverPicUrl"
              :imgFileSizeMaxLimit="5"
              @uploadSuccess="handleImgUploadSuccessOfAppCoverPic">
            </ColumnImgUpload>
            <p class="column-course-img-tips">
              建议图片尺寸比例为228px*300px，支持.jpeg、.jpg、.png后缀格式，图片小于5M</p>

          </el-form-item>
          <el-form-item prop="pcCoverPicUrl">
            PC端封面图
            <ColumnImgUpload
              :imgUrl="courseData.pcCoverPicUrl"
              :imgFileSizeMaxLimit="5"
              @uploadSuccess="handleImgUploadSuccessOfPcCoverPic">
            </ColumnImgUpload>
            <p class="column-course-img-tips">建议图片尺寸比例为5：3，330px*198px为最佳，支持.jpeg、.jpg、.png后缀格式，图片小于5M</p>
          </el-form-item>
        </el-col>
      </el-row>
      <section v-if="courseData.courseType===2">
        <h2 class="code-info-title"><i class="icon-bg"></i><span>课程页信息</span></h2>
        <el-row>
          <el-col :span="18">
            <el-form-item label="课程页背景图" prop="appBackPicUrl">
              App端课程页背景图
              <ColumnImgUpload
                :imgUrl="courseData.appBackPicUrl"
                :imgFileSizeMaxLimit="5"
                @uploadSuccess="handleImgUploadSuccessOfAppBack">
              </ColumnImgUpload>
              <p class="column-course-img-tips">建议图片尺寸为1125px*1290px，支持.jpeg、.jpg、.png后缀格式，图片小于5M，该图片同时适用于视频页金句分享图片</p>
            </el-form-item>
            <el-form-item prop="pcBackPicUrl">
              PC端课程页背景图
              <ColumnImgUpload
                :imgUrl="courseData.pcBackPicUrl"
                :imgFileSizeMaxLimit="5"
                @uploadSuccess="handleImgUploadSuccessOfPcBack">
              </ColumnImgUpload>
              <p class="column-course-img-tips">建议图片尺寸比例为3：1，708px*236px最佳，支持.jpeg、.jpg、.png后缀格式，图片小于5M</p>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <span class="course-describe-type-before" v-if="courseData.courseType===2">*</span>
            <el-form-item label="课程介绍配置" prop="courseDescribeType">
              <el-radio-group v-model="courseData.courseDescribeType" @change="courseDescribeTypeOnChange">
                <el-radio :label="1">图片</el-radio>
                <el-radio :label="2">markdown</el-radio>
              </el-radio-group>
              <span class="column-course-img-tips">&nbsp;&nbsp;仅限选择一种配置方式，其中，图片上传配置方式需单独上传PC端和APP端两组图片</span>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row v-if="courseData.courseDescribeType==2">
          <el-col :span="20">
            <el-form-item prop="attContent">
              <editor-md ref="markdown"
                         :editor="editor"
                         :content="courseData.attContent"
                         :onchange="editorChange"
                         v-if="courseData.attContent"
              ></editor-md>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="courseData.courseDescribeType==1">
          <el-col :span="24">
            <div class="column-course-img-list">
              <el-form-item class="column-course-img-label img-upload">
                <el-tabs v-model="descActiveType" type="card" @tab-click="handleTabClick">
                  <el-tab-pane label="APP端" name="app">
                    <section class="app-img-list">
                      <div v-for="(item,index) in courseData.appCoursePic" :key="index">
                        <img :src="item.attUrl" alt="" style="width: 150px;height: 100px;">
                        <el-button @click="deleteCoursePic('app',item)">删除</el-button>
                      </div>
                    </section>
                    <!--<el-button>添加图片</el-button>-->
                    <course-desc-img-upload
                      @uploadSuccess="handleImgUploadSuccessOfAppCoursePic"
                    ></course-desc-img-upload>
                    <p class="column-course-img-tips">
                      建议APP端宽度不小于1125px，PC端宽度不小于708px，高度不限，支持.jpeg、.jpg、.png后缀格式，图片小于5M，建议每个版块需单独上传一张图片，前端自动拼接</p>
                  </el-tab-pane>
                  <el-tab-pane label="PC端" name="pc">
                    <section class="app-img-list">
                      <div v-for="(item,index) in courseData.pcCoursePic" :key="index">
                        <img :src="item.attUrl" alt="" style="width: 150px;height: 100px;">
                        <el-button @click="deleteCoursePic('pc',item)">删除</el-button>
                      </div>

                    </section>
                    <course-desc-img-upload
                      @uploadSuccess="handleImgUploadSuccessOfPcCoursePic"
                    ></course-desc-img-upload>
                    <p class="column-course-img-tips">建议APP端宽度不小于1125px，PC端宽度不小于708px，高度不限，支持.jpeg、.jpg、.png后缀格式，图片小于5M，<br>
                      建议每个版块需单独上传一张图片，前端自动拼接</p>
                  </el-tab-pane>
                </el-tabs>
                <div class="el-form-item__error" v-if="courseDescImgListError">
                  请添加APP和PC简介图片
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </section>
      <section v-if="courseData.courseType===2">
        <h2 class="code-info-title"><i class="icon-bg"></i><span>分享页信息</span></h2>
        <el-row>
          <el-col :span="18">
            <el-form-item label="分享海报" prop="sharePosterPicUrl">
              <ColumnImgUpload
                :imgUrl="courseData.sharePosterPicUrl"
                :imgFileSizeMaxLimit="5"
                @uploadSuccess="handleImgUploadSuccessOfSharePosterPic">
              </ColumnImgUpload>
              <p class="column-course-img-tips">建议宽度为1125px，高度不限，支持.jpeg、.jpg、.png后缀格式，图片小于5M</p>
            </el-form-item>
          </el-col>
        </el-row>
      </section>
      <el-row>
        <el-col :span="24">
          <el-form-item style="float: left; ">
            <el-button @click="saveCourse" size="small" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-dialog
      :center=true
      :lock-scroll=false
      :title="teacherDialogData.title"
      :visible.sync="teacherDialogData.visible"
      custom-class="edit-dialog"
      top="18vh"
      v-if="teacherDialogData.visible"
      width="770px"
    >
      <section>

        <el-row>
          <el-col :span="12">
            <el-input type="text" v-model="teacherDialogData.customerId" name="customerId"
                      placeholder="讲师ID/讲师姓名"></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button @click="searchBtnOnClick">搜索</el-button>
          </el-col>
        </el-row>
        <section class="source-list">
          <el-table
            :data="teacherDialogData.rowData"
            :default-sort="{prop: 'sortId', order: 'descending'}"
            :fit="true"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="center"
              label="选择"
              prop="index"
              width="150"
              type="selection"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="讲师ID"
              prop="customerId"
              width="250"
            >
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="讲师姓名"
              prop="fullName"
              width="250">
            </el-table-column>
          </el-table>
        </section>
      </section>
      <el-row class="pagination" style="margin:20px 0">
        <el-col :span="7">
          <el-pagination
            :current-page="teacherDialogData.paginationData.currentPage"
            :page-size="teacherDialogData.paginationData.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="teacherDialogData.paginationData.total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total,sizes, prev, pager, next, jumper"
            v-show="teacherDialogData.paginationData.total>0"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <section style="clear:both; height:50px; margin-top:20px;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="teacherDialogData.visible = false">取 消</el-button>
            <el-button type="primary" @click="saveTeacherList">确 定</el-button>
          </span>
      </section>

    </el-dialog>
  </section>
</template>

<script>
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';
import CourseDescImgUpload from './components/CourseDescImgUpload';
import apiUrlConfig from '@/api/apiUrlConfig';

import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm.js';
import editorMd from '@/components/editorMD/editorMd';

export default {
  name: 'payCourseEdit',
  components: {
    ColumnImgUpload,
    CourseDescImgUpload,
    editorMd
  },
  data() {
    return {
      showTitle: '付费课程专栏/创建付费课程专栏',
      defaultMarkdownContent: '### 讲师\n王岩，主任医师、博士、硕士生导师，西安交通大学附属医院关节病医院膝关节外科主任，中国医师协会骨科医师分会青年工作委员会副主任委员，关节学组组长\n王主任主刀和参加过2000例人工髋关节置换手术，尤其对难度较大的高度曲卵缩膝、强直膝、严重内外翻畸形的人工膝关节置换积累了丰富的经验\n\n------------\n\n\n### 课程亮点\n内翻膝畸形的来源分析\n- 如何区分？\n- 如何测量与评估？\n- 四步法分析内翻膝\n\n------------\n\n\n### 课程受益\n学完此课程你会\n- 对TKA的认识与一流专家达成共识\n- 对TKA的认知回归最底层基础逻辑\n- 看懂今天骨科发展的趋势和经验\n\n------------\n\n\n### 课程大纲\n1.我眼中TKA的理想模样\n2.TKA在现实中的操作是怎样的？\n3.TKA的底层逻辑是什么？\n4.TKA的底层逻辑在现实操作中怎么理解？\n\n------------\n\n\n### 购买须知\n1.《XXXXXXXXXXX》包含老师亲自录制的视频内容，每周更新。\n2.本产品为付费产品，共400唯金，购买成功后，即可永久使用产品所有内容 \n3.本产品为虚拟内容服务，一经购买成功，不支持退款，请您理解\n4.本产品支持优惠券，详情参见优惠券使用规则\n5.在购买过程中如果遇到任何问题，您可以通过以下途径练习客服。\n------------\n\n### 制作团队\n出品人：刘峥嵘\n监制：邢川、沈忠美\n策划：沈忠美\n制作人：安卫军、沈忠美\n拍摄：安卫军\n后期：XXX、XXX、XXX、XXX', // 默认 markdown 数据
      action: 'add',
      id: null,
      editor: {
        isEditing: false
      },
      submitting: false,
      appDescImgSortId: 1,
      pcDescImgSortId: 1,
      courseDescImgListError: false, // 显示app 或 pc 的图片简介是否上传的错误提示

      courseData: {
        opUser: localStorage.getItem('userLoginName'),
        attContent: '', // markdown 编辑器内容
        attHtmlContent: '',
        courseTeacherVOList: [],
        teacherList: [],
        courseType: 2, // 1-预告， 2-售卖  默认售卖
        courseDescribeType: 1, // 课程介绍是否是markdown模式 1-图片,2 markdown
        // Pic 是用来放图片数组的，
        appBackPic: [],
        pcBackPic: [],
        appCoverPic: [],
        pcCoverPic: [],
        appCoursePic: [], // 课程介绍配置-APP端图片列表
        pcCoursePic: [], // 课程介绍配置-PC端图片列表
        sharePosterPic: [],
        // PicUrl 是用来放图片地址的
        appBackPicUrl: '',
        pcBackPicUrl: '',
        appCoverPicUrl: '',
        pcCoverPicUrl: '',
        sharePosterPicUrl: ''

      },
      descActiveType: 'app',
      rules: {
        courseName: [
          {required: true, message: '请填写课程名称', trigger: ''},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        courseType: [
          { required: true }
        ],
        courseDesc: [
          {required: true, message: '请填写课程简介', trigger: ''},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        teacherList: [
          {required: true, message: '请选择讲师', trigger: ''}
        ],
        coursePriceElement: [
          {required: true, message: '请填写商品售价', trigger: ''}
        ],
        totalNum: [
          {required: true, message: '请填写课程总数', trigger: ''}
        ],
        noticeDesc: [
          { required: true, message: '请输入预告文案', trigger: '' },
          {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
        ],
        appBackPicUrl: [{required: true, message: '请上传App端课程页背景图', trigger: 'change'}],
        pcBackPicUrl: [{required: true, message: '请上传PC端课程页背景图', trigger: 'change'}],
        appCoverPicUrl: [{required: true, message: '请上传App端课程封面图', trigger: 'change'}],
        pcCoverPicUrl: [{required: true, message: '请上传PC端课程封面图', trigger: 'change'}],
        sharePosterPicUrl: [{required: true, message: '请上传分享海报', trigger: 'change'}]
      },
      teacherDialogData: {
        title: '添加讲师',
        visible: false,
        keyword: '',
        rowData: [],
        multiSelection: [],

        // 分页参数
        paginationData: {
          currentPage: 1, // 当前页
          firstResult: 0,
          maxResult: 10,
          pageSize: 10, // 默认显示10条
          total: 0 // 总数
        }
      }
    };
  },
  watch: {
    'courseData.courseType': function(newValue, oldValue) {
      // 预告则不需要校验课程页信息
      if (newValue === 1) {
        // this.rules.appBackPicUrl[0].required = false;
        // this.rules.pcBackPicUrl[0].required = false;
      }// 售卖需要校验课程页信息
      else {
        // this.rules.appBackPicUrl[0].required = true;
        // this.rules.pcBackPicUrl[0].required = true;
      }
    }

  },
  methods: {
    // 处理markdown 编辑器
    editorChange(data) {
      this.courseData.attContent = data.markdown;
      this.courseData.attHtmlContent = data.html;
    },
    // 获取课程详情
    getCourseDetail() {
      let _this = this;
      axios({
        url: apiUrlConfig.getCourseDetail.url + '/' + this.id,
        method: apiUrlConfig.getCourseDetail.type
      }).then(function(data) {
        comm.closeLoading();
        _this.courseData = Object.assign({}, _this.courseData, data.data.responseObject.responseData);
        _this.initImgUrl();
        _this.initTeacherList();
      });
    },
    // 从获取到的courseTeacherVOList中读取customerId 填充到数组中
    initTeacherList() {
      let _this = this;
      _this.courseData.teacherList = [];
      _this.courseData.courseTeacherVOList.map(function(item, index) {
        _this.courseData.teacherList.push(item.customerId);
      });
    },
    // 保存课程
    saveCourse() {
      let _this = this;
      this.$refs.courseForm.validate((valid) => {
        if (valid) {
          // 如果是已售卖的课程，不允许课程总数小于已更新课程数
          if (_this.courseData.courseType === 2 && (_this.courseData.newestNum || _this.courseData.newestNum === 0)) {
            if (_this.courseData.totalNum < _this.courseData.newestNum) {
              _this.$message('已售卖的课程总数不允许小于已更新的课程总数,已更新 ' + _this.courseData.newestNum + ' 讲');
              return false;
            }
          }
          if (_this.validateCoursePic()) {
            _this.submitInfoFn();
          }
        }
        else {
          console.log('表单校验失败');
          return false;
        }
      });
    },
    validateCoursePic() {
      let _this = this;
      // 只有是售卖类型，才校验课程介绍配置部分的APP和PC图片
      if (_this.courseData.courseType === 2 && _this.courseData.courseDescribeType === 1) {
        if (_this.courseData.pcCoursePic.length === 0 || _this.courseData.appCoursePic.length === 0) {
          _this.courseDescImgListError = true;
          console.log('校验课程介绍配置的APP和PC图片失败');
          return false;
        }
        else {
          _this.courseDescImgListError = false;
          return true;
        }
      }
      else {
        return true;
      }
    },
    // 提交信息
    submitInfoFn() {
      let _this = this;
      if (this.submitting) {
        return false;
      }
      this.submitting = true;
      let params = this.courseData;
      params.attIdList = this.combinePics(params);
      let needRemoveProperty = [
        'appBackPic',
        'pcBackPic',
        'appCoverPic',
        'pcCoverPic',
        'appCoursePic',
        'pcCoursePic',
        'sharePosterPic',
        'appBackPicUrl',
        'pcBackPicUrl',
        'appCoverPicUrl',
        'pcCoverPicUrl',
        'sharePosterPicUrl',
        'courseTeacherVOList',
        'teacherTagList'
      ];

      needRemoveProperty.map(function(item, index) {
        delete params[item];
      });

      params.coursePrice = params.coursePriceElement * 100;

      axios({
        url: apiUrlConfig.addOrUpdatePaymentColumn.url,
        method: apiUrlConfig.addOrUpdatePaymentColumn.type,
        data: params
      }).then(function(data) {
        _this.submitting = false;
        if (data.data.responseObject.responseStatus) {
          _this.$allin_confirm({
            title: '提示',
            content: ' 保存成功',
            type: 'notice',
            done: function() {
              comm.closeLoading();
              _this.$router.push({path: '/payCoursesIndex'});
            }
          });
        }
        else {
          _this.$allin_confirm({
            title: '提示',
            content: data.data.responseObject.responseMessage,
            type: 'notice',
            done: function() {
              comm.closeLoading();
              _this.$router.push({path: '/payCoursesIndex'});
            }
          });
        }
      });
    },
    // 将图片列表中的元素 放到data的二级属性中。
    initImgUrl() {
      this.courseData.appBackPicUrl =
          (this.courseData.appBackPic && this.courseData.appBackPic.length) > 0
            ? apiUrlConfig.imgServer_img05.url + this.courseData.appBackPic[0].attUrl : '';
      this.courseData.pcBackPicUrl =
          (this.courseData.pcBackPic && this.courseData.pcBackPic.length) > 0
            ? apiUrlConfig.imgServer_img05.url + this.courseData.pcBackPic[0].attUrl : '';
      this.courseData.appCoverPicUrl =
          (this.courseData.appCoverPic && this.courseData.appCoverPic.length) > 0
            ? apiUrlConfig.imgServer_img05.url + this.courseData.appCoverPic[0].attUrl : '';
      this.courseData.pcCoverPicUrl =
          (this.courseData.pcCoverPic && this.courseData.pcCoverPic.length) > 0
            ? apiUrlConfig.imgServer_img05.url + this.courseData.pcCoverPic[0].attUrl : '';
      this.courseData.sharePosterPicUrl =
          (this.courseData.sharePosterPic && this.courseData.sharePosterPic.length) > 0
            ? apiUrlConfig.imgServer_img05.url + this.courseData.sharePosterPic[0].attUrl : '';
      console.log(this.courseData.sharePosterPicUrl);

      this.courseData.pcCoursePic.map(function(item, index) {
        item.attUrl = apiUrlConfig.imgServer_img05.url + item.attUrl;
      });
      this.courseData.appCoursePic.map(function(item, index) {
        item.attUrl = apiUrlConfig.imgServer_img05.url + item.attUrl;
      });
      this.appDescImgSortId += this.courseData.appCoursePic.length;
      this.pcDescImgSortId += this.courseData.pcCoursePic.length;
    },
    // 打开讲师筛选
    openTeacher() {
      this.teacherDialogData.visible = true;
      // 清空当前已选择的讲师
      this.teacherDialogData.multiSelection = [];
      this.teacherDialogData.customerId = '';
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.maxResult = 10;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.searchTeacher();
    },
    // 将课程各种图片合并到一个数组里
    combinePics(params) {
      let attList = [];
      params.pcCoverPic.length > 0 && attList.push(params.pcCoverPic[0].id);
      params.appCoverPic.length > 0 && attList.push(params.appCoverPic[0].id);
      params.pcBackPic.length > 0 && attList.push(params.pcBackPic[0].id);
      params.appBackPic.length > 0 && attList.push(params.appBackPic[0].id);
      params.pcCoursePic.map(function(item, index) {
        attList.push(item.id);
      });
      params.appCoursePic.map(function(item, index) {
        attList.push(item.id);
      });
      params.sharePosterPic.length > 0 && attList.push(params.sharePosterPic[0].id);
      return attList;
    },
    searchBtnOnClick() {
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.teacherDialogData.multiSelection = [];
      this.searchTeacher();
    },
    searchTeacher() {
      let _this = this;

      let params = {
        customerId: _this.teacherDialogData.customerId,
        visitSiteId: 25,
        firstResult: _this.teacherDialogData.paginationData.firstResult,
        maxResult: _this.teacherDialogData.paginationData.maxResult

      };
      if (!_this.teacherDialogData.customerId) {
        params.customerId = null;
      }

      axios({
        url: apiUrlConfig.searchTeacherList.url,
        method: apiUrlConfig.searchTeacherList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.teacherDialogData.rowData = data.data.responseObject.responseData.dataList;
        _this.teacherDialogData.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    // 讲师搜索弹窗里的分页处理
    handleSizeChange(val) {
      this.teacherDialogData.paginationData.maxResult = val;
      this.searchTeacher();
    },
    // 讲师搜索弹窗里的分页处理
    handleCurrentChange(val) {
      this.teacherDialogData.paginationData.currentPage = val;
      this.teacherDialogData.paginationData.firstResult = (val - 1) * this.teacherDialogData.paginationData.maxResult;
      this.searchTeacher();
    },
    // 确认添加医师
    saveTeacherList() {
      let _this = this;
      let teacherTagList = _this.courseData.courseTeacherVOList;
      let teacherList = _this.courseData.teacherList;
      if (this.teacherDialogData.multiSelection.length > 0) {
        this.teacherDialogData.multiSelection.map(function(item, index) {
          if (_this.checkTeacherNoRepeat(item.customerId, teacherTagList, 1)) {
            teacherTagList.push({
              customerName: item.fullName,
              customerId: item.customerId
            });
          }
          if (_this.checkTeacherNoRepeat(item.customerId, teacherList, 2)) {
            teacherList.push(item.customerId.toString());
          }
        });

        _this.$set(_this.courseData, 'teacherTagList', teacherTagList);
        _this.$set(_this.courseData, 'teacherList', teacherList);

        this.teacherDialogData.visible = false;
        this.$refs.courseForm.validateField('teacherList');
      }
      else {
        this.$message('请选择需要添加的讲师');
      }
    },
    // 判断讲师是否重复，根据 customerId 判断,如果没有重复，则返回 true
    // dataList 分为两种，一种是object的数组 ，一种是 customerId 的数组
    // type ,1 表示 object 对象数组，2 表示 customerId 数组
    checkTeacherNoRepeat(customerId, dataList, type) {
      for (let i = 0, len = dataList.length; i < len; i++) {
        if (type === 1) {
          if (customerId.toString() === dataList[i].customerId.toString()) {
            return false;
          }
        }
        else if (type === 2) {
          if (customerId.toString() === dataList[i]) {
            return false;
          }
        }
      }
      return true;
    },
    // 讲师复选框变更时
    handleSelectionChange(val) {
      console.log(val);
      this.teacherDialogData.multiSelection = val;
    },

    // 1-APP封面图，2-PC封面图,3-APP端课程页背景图,4-PC端课程页面背景图,5-PC端课程介绍图，6-APP端课程介绍图,7-分享海报图
    handleImgUploadSuccessOfAppBack(data) {
      this.handleImgUploadSuccessByType(data, 'appBackPic');
    },
    handleImgUploadSuccessOfPcBack(data) {
      this.handleImgUploadSuccessByType(data, 'pcBackPic');
    },
    handleImgUploadSuccessOfAppCoverPic(data) {
      this.handleImgUploadSuccessByType(data, 'appCoverPic');
    },
    handleImgUploadSuccessOfPcCoverPic(data) {
      this.handleImgUploadSuccessByType(data, 'pcCoverPic');
    },
    handleImgUploadSuccessOfAppCoursePic(data) {
      let _this = this;
      let params = {
        attUrl: data.attUrl,
        sortId: _this.appDescImgSortId++,
        attType: 6
      };
      let attUrl = data.attUrl;
      axios({
        url: apiUrlConfig.addPaymentAttachment.url,
        method: apiUrlConfig.addPaymentAttachment.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();

        _this.courseData.appCoursePic.push({
          id: data.data.responseObject.responseData.id,
          attUrl: apiUrlConfig.imgServer_img05.url + attUrl,
          attType: 6
        });
        _this.validateCoursePic();
      });
    },
    handleImgUploadSuccessOfPcCoursePic(data) {
      let _this = this;
      let params = {
        attUrl: data.attUrl,
        sortId: _this.pcDescImgSortId++,
        attType: 5
      };
      let attUrl = data.attUrl;
      axios({
        url: apiUrlConfig.addPaymentAttachment.url,
        method: apiUrlConfig.addPaymentAttachment.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        _this.courseData.pcCoursePic.push({
          id: data.data.responseObject.responseData.id,
          attUrl: apiUrlConfig.imgServer_img05.url + attUrl,
          attType: 5
        });
        _this.validateCoursePic();
      });
    },
    handleImgUploadSuccessOfSharePosterPic(data) {
      this.handleImgUploadSuccessByType(data, 'sharePosterPic');
    },
    handleImgUploadSuccessByType(data, type) {
      let _this = this;
      let attType;

      // 若之前有图片，先删掉，再保存新的。
      if (this.courseData[type + 'Url']) {
        let id = this.courseData[type][0].id;
        this.deletePic(id);
      }

      this.courseData[type + 'Url'] = apiUrlConfig.imgServer_img05.url + data.attUrl;
      switch (type) {
        case 'appCoverPic':
          attType = 1;
          break;
        case 'pcCoverPic':
          attType = 2;
          break;
        case 'appBackPic':
          attType = 3;
          break;
        case 'pcBackPic':
          attType = 4;
          break;
        case 'sharePosterPic':
          attType = 7;
          break;
      }
      this.$refs.courseForm.validateField(type + 'Url');

      let params = {
        attUrl: data.attUrl,
        sortId: 1,
        attType: attType
      };

      axios({
        url: apiUrlConfig.addPaymentAttachment.url,
        method: apiUrlConfig.addPaymentAttachment.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        console.log(data);
        _this.courseData[type] = [{
          id: data.data.responseObject.responseData.id,
          attType: attType
        }];
      });
    },

    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    // 删除讲师回调
    handleRemoveTag(teacher) {
      this.courseData.courseTeacherVOList.splice(this.courseData.courseTeacherVOList.indexOf(teacher), 1);
      this.courseData.teacherList.splice(this.courseData.teacherList.indexOf(teacher.customerId), 1);
    },
    watchHtml: function() {
      this.$refs['markdown'].watch();
    },
    unWatchHtml: function() {
      this.$refs['markdown'].unwatch();
    },
    // 课程简介 tab 点击
    handleTabClick() {

    },
    deletePic(id) {
      let params = {
        id: id,
        isValid: false
      };
      axios({
        url: apiUrlConfig.deletePaymentAttachment.url,
        method: apiUrlConfig.deletePaymentAttachment.type,
        data: params
      }).then(function(data) {
        comm.closeLoading();
        console.log(data);
      });
    },
    // 删除课程简介图片
    deleteCoursePic(type, item) {
      this.deletePic(item.id);
      let index = this.courseData[type + 'CoursePic'].indexOf(item);
      this.courseData[type + 'CoursePic'].splice(index, 1);
      this.$set(this.courseData, type + 'CoursePic', this.courseData[type + 'CoursePic']);
    }, // 课程介绍配置变化
    courseDescribeTypeOnChange(value) {
      // 如果是 markdown，同时当前 markdown 中的数据为空，则填充预设的数据
      if (value === 2) {
        if (!this.courseData.attContent) {
          this.courseData.attContent = this.defaultMarkdownContent;
        }
      }
    }
  },
  created() {
    window.onbeforeunload = () => '离开此网站，系统可能不会保存您所做的更改。';
  },
  destroyed() {
    window.onbeforeunload = null;
  },
  mounted() {
    let _this = this;
    let action = this.$route.query.action;
    if (action === 'edit') {
      this.showTitle = '付费课程专栏/编辑付费课程专栏';
      this.action = 'edit';
      _this.id = this.$route.query.id;
      _this.getCourseDetail();
    }
  }
};
</script>

<style scoped lang="scss">
  .creat-main-contains {
    width: 1200px;
    margin: 20px auto;
    .form-container {
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
    }

    .course-describe-type-before {
      /* 比较特殊，此处没有使用 form 表单的 rules 校验 */
      position: absolute;
      top: 12px;
      color: #f56c6c;
      margin-left: -10px;
    }
    .code-title {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }
    .column-course-img-tips{
      width: 800px;
      color: #606266;
      line-height: 26px;
    }
    .el-input-width {
      width: 360px;
    }
    .el-input-total-num-width {
      width: 342px;
    }
    .el-textarea-width {
      width: 360px;
    }
    .teacher-tag-list {
      width: 360px;
      height: 90px;
      border: 1px solid #eeeeee;
      border-radius: 5px;
      float: left;
      overflow: scroll;

    }
    .input-after-tip {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      color: #999;
    }
    .el-input-name {
      &.el-input--suffix .el-input__inner {
        padding-right: 40px;
      }
    }
    .el-input-tip {
      color: #000;
    }
    .code-tip {
      width: 100%;
      background: #DFEEF9;
      border: 1px solid #49B6DA;
      line-height: 40px;
      padding-left: 5px;
      margin-bottom: 20px;
    }
    .el-tag-item {
      margin-left: 5px;
      margin-bottom: 5px;
    }
    .btn-add-teacher {
      margin-left: 10px;
    }
    .code-info-title {
      margin-bottom: 20px;
      .icon-bg {
        background: #0687FF;
        width: 3px;
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        border-radius: 1px;
        margin-right: 5px;
      }
      span {
        display: inline-block;
        vertical-align: middle;
      }
    }
    .content-container {
      background: #FAFCFE;
      width: 400px;
      position: relative;
      .content-desc, .content-title {
        padding-left: 20px;
        line-height: 40px;
        display: inline-block;
        vertical-align: middle;
      }
      .content-img {
        vertical-align: middle;
        width: 100px;
        height: 40px;
        margin-left: 20px;
      }
      .close-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 20px;
        font-size: 26px;
        color: #999;
        cursor: pointer;
      }
    }
  }
</style>
