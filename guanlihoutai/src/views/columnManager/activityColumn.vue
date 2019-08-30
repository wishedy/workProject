<template>
  <section class="column-manager-main-container">
    <h3>活动/专题管理</h3>
    <section class="column-manager-search-area">
      <el-form @keydown.enter="getTableData" label-width="120px" ref="activitySearchForm">
        <el-row>
          <el-col :span="8" class="search-area-anthology-name">
            <el-form-item label="活动/专题名称：">
              <el-input v-model="searchConditionData.anthologyNameLike"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分组：">
              <el-select
                placeholder="请选择分组"
                v-model="searchConditionData.groupValue"
              >
                <el-option label="全部" value=""></el-option>
                <el-option :key="item.id"
                           :label="item.groupName"
                           :value="item.groupValue"
                           v-for="item in groupValueList"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态：">
              <el-select
                placeholder="请选择处理状态"
                required
                v-model="searchConditionData.isValid"
                value=""
              >
                <el-option label="全部" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="更新时间：">
              <el-date-picker
                :default-time="['00:00:00','23:59:59']"
                end-placeholder="结束日期"
                range-separator="至"
                start-placeholder="开始日期"
                type="daterange"
                v-model="searchConditionUpdateTime"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="submitBtn" style="float: right; margin-right: 50px;">
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="onSubmit">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="column-manager-button">
      <el-row>
        <el-col>
          <el-button @click="addActivity"><span class="el-icon-circle-plus"></span>新增活动</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="source-list">
      <el-table
        :data="tableData"
        :default-sort="{prop: 'sortId', order: 'descending'}"
        :fit="true"
        :row-class-name="tableRowClassName"
        @sort-change='tableChange'
        style="width: 100%"
      >
        <el-table-column
          align="center"
          label="序号"
          prop="index"
          width="70"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="ID"
          prop="refId"
          width="150"
        >
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="活动/专题名称"
          prop="anthologyName"
          width="260"
        >
        </el-table-column>
        <el-table-column
          :formatter="groupValueFormatter"
          align="left"
          header-align="center"
          label="分组"
          prop="groupValue"
          width="100"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="活动url（h5）"
          prop="activityMobileUrl"
          width="260"
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="顺序号"
          prop="sortId"
          sortable="custom"
          width="100"
        >
        </el-table-column>
        <el-table-column
          :formatter="dateFormatter"
          align="center"
          label="更新时间"
          prop="updateTime"
          sortable="custom"
          width="180"
        >
        </el-table-column>
        <el-table-column
          :formatter="sourceTypeFormatter"
          label="搭建方式"
          prop="videoName"
          width="100">
        </el-table-column>
        <el-table-column
          :formatter="isValidFormatter"
          align="center"
          label="状态"
          prop="isValid"
          width="100"
        >
        </el-table-column>
        <el-table-column
          :formatter="showTypeFormatter"
          align="center"
          class-name="source-list-show-type"
          label="首页显示"
          label-class-name="source-list-show-type-title"
          prop="showType"
          width="100">
        </el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="120"
        >
          <template slot-scope="scope">
            <el-button @click="editActivity(scope.row)" @keydown.native.prevent class="source-list-btn">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row class="pagination" style="margin:20px 0">
      <el-col :offset="5" :span="10">
        <el-pagination
          :current-page="paginationData.currentPage"
          :page-size="paginationData.pageSize"
          :page-sizes="[10, 20, 30, 40]"
          :total="paginationData.total"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total,sizes, prev, pager, next, jumper"
          v-show="paginationData.total>0"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!--编辑弹层-->
    <el-dialog
      :center=true
      :lock-scroll=false
      :title="editDialogData.title"
      :visible.sync="editDialogData.visible"
      custom-class="edit-dialog"
      top="18vh"
      v-if="editDialogData.visible"
      width="770px"
    >
      <el-form :model="editDialogData.rowData"
               :rules="rules"
               label-width="90px"
               ref="editDialogForm"
      >
        <el-row>
          <el-col :span="16">
            <el-form-item label="名称" prop="anthologyName">
              <el-input :disabled="editDialogData.rowData.groupValue != Default_Group_Value"
                        placeholder="输入活动名称"
                        v-model.trim="editDialogData.rowData.anthologyName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分组" prop="groupValue">
              <el-input disabled
                        v-model="editDialogData.rowData.groupData.groupName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="链接" prop="activityMobileUrl">
              <el-input :disabled="editDialogData.rowData.groupValue != Default_Group_Value"
                        placeholder="填写h5链接"
                        v-model.trim="editDialogData.rowData.activityMobileUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="顺序号" prop="sortId">
              <el-input :disabled="editDialogData.sortIdDisabled"
                        :placeholder="editDialogData.sortIdPlaceHolder"
                        v-model.number="editDialogData.rowData.sortId"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="创建人" prop="userName">
              <el-input disabled v-model="editDialogData.rowData.userName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="状态">
              <el-radio-group :disabled="!editDialogData.canCancelShowType" v-model="editDialogData.rowData.isValid">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="上首页">
              <el-radio-group :disabled="editDialogData.rowData.isValid==0" v-model="editDialogData.rowData.showType">
                <el-radio :label="1">首位</el-radio>
                <el-radio :label="2">第二位</el-radio>
                <el-radio :label="3">第三位</el-radio>
              </el-radio-group>
              <span @click="showTypeUnselectClickHandle"
                    class="show-type-unselect"
                    v-show="editDialogData.canCancelShowType">取消选择</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="column-course-img-list">
              <el-form-item class="column-course-img-label img-upload"
                            label="配图"
                            prop="imgUrl">

                <ColumnImgUpload
                  :imgUrl="editDialogData.rowData.imgUrl"
                  :widthHeightMinLimit="[498,270]"
                  @uploadSuccess="handleImgUploadSuccess">
                </ColumnImgUpload>
                <p class="column-course-img-tips">提示：活动图 498*270 、专题图 498*270</p>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item style="float: right; ">
              <el-button @click="saveActivity" size="small" style="width:150px;" type="primary">发布</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </section>
</template>
<script>
/**
 * 活动/专题管理后台
 * 注意事项：
 * 2019.01.22-v3.3迭代-姚乔
 * 1、此后台为新后台系统，数据展示时，包含老后台的数据
 * 2、注意编辑时，上首页的相关逻辑，详情可见 canCancelShowType 的注释
 * 3、新后台目前仅能创建“热门活动”
 * 4、需要注意区别新后台和老后台针对校验、是否可编辑的判断，可通过是否为“热门活动”来区分新老后台的数据
 */
import validator from '@/assets/js/utils/validator.js';
import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import comm from '@/assets/js/utils/comm.js';
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';

export default {
  name: 'activityColumn',
  components: {
    ColumnImgUpload
  },
  data() {
    const editDialogType = {
      ADD: 0, // 编辑弹窗类型-新增活动
      EDIT: 1// 编辑弹窗类型-编辑活动
    };
    const editDialogTitle = {
      ADD: '新增', // 编辑弹窗标题-新增活动
      EDIT: '编辑'// 编辑弹窗标题-编辑活动
    };
    const defaultGroup = 100;// 新增活动的默认分组值为100，即热门活动
    return {
      Edit_Dialog_Type: editDialogType,
      Edit_Dialog_Title: editDialogTitle,
      Default_Group_Value: defaultGroup,
      columnName: this.$route.query.columnName,
      columnId: this.$route.query.columnId,

      searchConditionData: {
        anthologyNameLike: '', // 活动/专题名称
        updateStartTime: '', // 更新时间-开始时间
        updateEndTime: '', // 更新时间-结束时间
        isValid: '', // 状态
        groupValue: ''// 分组
      },
      groupValueList: [],
      searchConditionUpdateTime: '',
      sortType: 2, // 默认为2，顺序号倒序
      // 分页参数
      paginationData: {
        currentPage: 1, // 当前页
        firstResult: 0,
        maxResult: 10,
        pageSize: 10, // 默认显示10条
        total: 0// 总数
      },
      tableData: [],
      editDialogData: {
        title: editDialogTitle.ADD,
        visible: false,
        sortIdPlaceHolder: '',
        sortIdDisabled: 'disabled',
        rowData: {
          anthologyName: '',
          sortId: 0,
          imgUrl: '',
          activityMobileUrl: '',
          isValid: 0, // 默认不显示
          attList: [{
            attUrl: ''
          }],
          groupData: {groupValue: 100, groupName: '热门活动'}, // 分组
          showType: 0// 上首页，0-不显示，1-首位，2-第二位，3-第三位
        },
        attListTmp: null, // 用于暂存图片列表，如果编辑时图片没有修改，则不给后台传参
        // 当活动状态为下架时，不可以设置上首页；
        // 当活动状态已在首页时（包括首位、第一位、第二位），不可以直接设置下架，只能通过设置其他活动上首页将首页位替换才可以设置当前活动下架
        // 新增活动时，发布前，默认是可以设置上/下架，当且仅当此时设置上架时，才可以设置上首页，也可以取消上首页
        // 编辑活动时，如果活动已在首页，发布前，可以设置活动在首页的位置，不可以取消在首页，不可以下架活动
        // 编辑活动时，如果活动未在首页，发布前，当且仅当此时设置上架时，才可以设置上首页，也可以取消上首页
        canCancelShowType: true
      },
      rules: {
        anthologyName: [
          {required: true, message: '活动名称不能为空', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ],
        sortId: [
          {required: true, message: '顺序号不能为空', trigger: 'blur'},
          {validator: validator.fullSpanceVaild, message: '顺序号不能为空', trigger: 'blur'}
        ],
        activityMobileUrl: [
          {required: true, message: '链接不能为空', trigger: 'blur'}
        ],
        imgUrl: [{required: true, message: '配图不能为空', trigger: 'blur'}]
      }
    };
  },
  mounted() {
    // 拉取分组数据
    this.getGroupData();
    // 拉取表格数据
    this.getTableData();
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.editDialogData.visible) {
          this.getTableData();
        }
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  },
  methods: {
    // 获取分组信息，需要先获取分组信息，才能对表格中的分组进行formatter
    getGroupData() {
      let _this = this;
      axios({
        url: apiUrl.getActivityGroupList.url,
        type: apiUrl.getActivityGroupList.type
      }).then(function(data) {
        if (data && data.data && data.data.responseObject && data.data.responseObject.responseData && data.data.responseObject.responseData.dataList) {
          _this.groupValueList = data.data.responseObject.responseData.dataList;
        }
      });
    },
    // 获取表格数据
    getTableData() {
      let _this = this;
      // 分页数据、排序方式
      let params = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: this.sortType,
        columnName: this.columnName,
        columnId: this.columnId
      };

      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          params[key] = this.searchConditionData[key];
        }
      }
      // groupValue 会有为0的情况，防止其被过滤
      if (this.searchConditionData.groupValue === 0) {
        params.groupValue = 0;
      }
      comm.openLoading('加载中...');
      axios({
        url: apiUrl.getActivityList.url,
        type: apiUrl.getActivityList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.items;
        _this.paginationData.total = data.data.responseObject.total;
      });
    },
    resetForm() {
      for (let key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
      // 对时间组件进行重置
      this.searchConditionUpdateTime = '';
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    // 查询
    onSubmit() {
      if (Array.isArray(this.searchConditionUpdateTime) && this.searchConditionUpdateTime.length > 0) {
        this.searchConditionData.updateStartTime = this.searchConditionUpdateTime[0];
        this.searchConditionData.updateEndTime = this.searchConditionUpdateTime[1];
      }
      else {
        this.searchConditionData.updateStartTime = '';
        this.searchConditionData.updateEndTime = '';
      }

      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;

      this.getTableData();
    },
    // 首页配图上传成功回调函数
    handleImgUploadSuccess(data) {
      let id;
      if (this.editDialogData.action === this.Edit_Dialog_Type.EDIT && this.editDialogData.rowData.attList.length > 0) {
        id = this.editDialogData.rowData.attList[0].id;
      }
      else {
        id = '';
      }
      this.editDialogData.rowData.attList = [];
      this.editDialogData.rowData.attList.push({
        id: id,
        columnType: 4,
        attFormat: data.extName,
        navigationAttType: 1,
        attSize: data.attSize,
        attHeight: data.attHeight,
        attWidth: data.attWidth,
        attUrl: data.attUrl
        // attType: data.attType
      });
      if (this.editDialogData.action === this.Edit_Dialog_Type.ADD || id === '') {
        delete this.editDialogData.rowData.attList[0].id;
      }
      this.editDialogData.rowData.imgUrl = apiUrl.imgServer_img05.url + data.attUrl;
      this.$refs.editDialogForm.validateField('imgUrl');
    },
    handleSizeChange(val) {
      this.paginationData.maxResult = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val;
      this.paginationData.firstResult = (val - 1) * this.paginationData.maxResult;
      this.getTableData();
    },
    /**
     * sortType 排序
     *    1-顺序号正序
     *    2-顺序号倒序
     *    3-更新时间正序
     *    4-更新时间倒序
     *    默认按顺序号倒序排列
     * @param column
     */
    tableChange(column) {
      this.paginationData.currentPage = 1; // 回退到第一页
      if (column.prop === 'updateTime') {
        this.sortType = column.order === 'ascending' ? 3 : 4;
      }
      else if (column.prop === 'sortId') {
        this.sortType = column.order === 'ascending' ? 1 : 2;
      }
      else {
        this.sortType = 2;
      }
      this.getTableData();
    },
    sourceTypeFormatter(row, column, cellValue) {
      // 处理状态（1-未处理2-已处理 ）
      let value = parseInt(row.sourceType);
      let valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '网页';
          break;
        case 2:
          valueDesc = '活动搭建';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    isValidFormatter(row, column, cellValue) {
      // 处理状态（1-未处理2-已处理 ）
      let value = parseInt(row.isValid);
      let valueDesc = '';
      switch (value) {
        case 0:
          valueDesc = '已下架';
          break;
        case 1:
          valueDesc = '已上架';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    dateFormatter(...rest) {
      return rest[2].substring(0, rest[2].length - 2);
    },
    groupValueFormatter(...rest) {
      for (let i = 0; i < this.groupValueList.length; i++) {
        if (rest[2] === this.groupValueList[i].groupValue) {
          return this.groupValueList[i].groupName;
        }
      }
    }, // 显示活动在首页的顺序
    showTypeFormatter(...rest) {
      let rst = '';
      switch (rest[2]) {
        case 1:
          rst = '首位';
          break;
        case 2:
          rst = '第二位';
          break;
        case 3:
          rst = '第三位';
          break;
        default:
          rst = '';
          break;
      }
      return rst;
    },
    //  添加新活动
    addActivity() {
      if (this.$refs.editDialogForm) {
        this.$refs.editDialogForm.resetFields();
      }
      this.$set(this.rules, 'sortId', null);
      // 新增活动分组类型，仅能为热门活动，所以需要添加名称、链接校验
      this.$set(this.rules, 'anthologyName', [
        {required: true, message: '活动名称不能为空', trigger: 'blur'},
        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
      ]);
      this.$set(this.rules, 'activityMobileUrl', [
        {required: true, message: '链接不能为空', trigger: 'blur'}
      ]);

      this.editDialogData.action = this.Edit_Dialog_Type.ADD;
      this.editDialogData.title = this.Edit_Dialog_Title.ADD;
      this.editDialogData.visible = true;
      this.editDialogData.rowData.imgUrl = '';
      this.editDialogData.sortIdDisabled = true;
      this.editDialogData.rowData = {
        activityMobileUrl: '',
        anthologyName: '',
        attList: [{}],
        isValid: 0,
        imgUrl: '',
        groupData: {
          groupValue: this.Default_Group_Value,
          groupName: this.getGroupNameByGroupValue(this.Default_Group_Value)
        },
        showType: 0,
        groupValue: this.Default_Group_Value,
        userName: localStorage.getItem('userLoginName')
      };
      // 新增活动时，是允许设置上首页的
      this.editDialogData.canCancelShowType = true;
    },
    //  编辑活动
    editActivity(row) {
      // 编辑时需要校验顺序号
      this.$set(this.rules, 'sortId', [
        {required: true, message: '顺序号不能为空', trigger: 'blur'}
      ]);
      // 如果分组类型不是热门活动，则不需要校验名称、链接
      if (row.groupValue === this.Default_Group_Value) {
        this.$set(this.rules, 'anthologyName', [
          {required: true, message: '活动名称不能为空', trigger: 'blur'},
          {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
        ]);
        this.$set(this.rules, 'activityMobileUrl', [
          {required: true, message: '链接不能为空', trigger: 'blur'}
        ]);
      }
      else {
        this.$set(this.rules, 'anthologyName', null);
        this.$set(this.rules, 'activityMobileUrl', null);
      }
      // 清空原有编辑弹窗的表单数据
      if (this.$refs.editDialogForm) {
        this.$refs.editDialogForm.resetFields();
      }

      let params = {
        columnId: this.columnId,
        refId: row.refId,
        groupValue: row.groupValue
      };

      this.editDialogData.action = this.Edit_Dialog_Type.EDIT;
      this.editDialogData.title = this.Edit_Dialog_Title.EDIT;
      this.editDialogData.sortIdDisabled = false;
      this.editDialogData.rowData.refId = row.refId;

      comm.openLoading('加载中...');
      axios({
        method: apiUrl.getActivityDetail.type,
        url: apiUrl.getActivityDetail.url,
        params: params
      }).then((data) => {
        let resObj = data.data.responseObject.responseData;
        comm.closeLoading();
        this.editDialogData.visible = true;
        this.editDialogData.rowData.anthologyName = resObj.anthologyName;
        this.editDialogData.rowData.activityMobileUrl = resObj.activityMobileUrl;
        this.$set(this.editDialogData.rowData, 'userName', resObj.userName);
        this.editDialogData.rowData.id = resObj.id;
        this.$set(this.editDialogData.rowData, 'sortId', resObj.sortId);
        if (resObj.attList) {
          this.editDialogData.rowData.attList = resObj.attList;
          this.editDialogData.rowData.imgUrl = this.editDialogData.rowData.attList[0].attUrl;
          // 缓存图片数据
          this.attListTmp = resObj.attList;
        }
        else {
          this.editDialogData.rowData.attList = [];
          this.editDialogData.rowData.imgUrl = '';
        }
        this.editDialogData.rowData.isValid = parseInt(row.isValid);
        this.editDialogData.rowData.showType = row.showType;
        // 如果编辑的活动，已在首页，则不允许通过编辑下首页，只能通过新建活动，将现有的首页位置的数据替换
        if (row.showType === 1 || row.showType === 2 || row.showType === 3) {
          this.editDialogData.canCancelShowType = false;
        }
        else {
          this.editDialogData.canCancelShowType = true;
        }
        this.editDialogData.rowData.groupValue = row.groupValue;
        this.editDialogData.rowData.groupData = {
          groupValue: row.groupValue,
          groupName: this.getGroupNameByGroupValue(row.groupValue)
        };
      });
    },
    saveActivity() {
      this.editDialogData.rowData.columnId = this.columnId;
      this.editDialogData.rowData.columnType = '4';
      let data = Object.assign({}, this.editDialogData.rowData);
      data.userName = localStorage.getItem('userLoginName');
      // 删除 groupData
      delete data.groupData;
      delete data.imgUrl;
      // 如果活动状态为下架，则删除“上首页”数据
      if (data.isValid === 0) {
        delete data.showType;
      }
      // 如果图片没有变化，则删除图片数据
      if (this.attListTmp === data.attList) {
        delete data.attList;
      }
      this.$refs.editDialogForm.validate((valid) => {
        if (valid) {
          comm.openLoading('加载中...');
          axios({
            method: apiUrl.saveActivity.type,
            url: apiUrl.saveActivity.url,
            data: data
          }).then((res) => {
            comm.closeLoading();
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.editDialogData.visible = false;
              if (this.editDialogData.action === this.Edit_Dialog_Type.ADD) {
                this.$allin_confirm({title: '提示', content: '新增成功', type: 'notice'});
              }
              else {
                this.$allin_confirm({title: '提示', content: '更新成功', type: 'notice'});
              }
              this.getTableData();
            }
            else {
              if (this.editDialogData.action === this.Edit_Dialog_Type.ADD) {
                this.$allin_confirm({title: '提示', content: '新增失败', type: 'notice'});
              }
              else {
                this.$allin_confirm({title: '提示', content: '更新失败', type: 'notice'});
              }
            }
          });
        }
        else {
          return false;
        }
      });
    },
    getGroupNameByGroupValue(value) {
      let rst = '', list = this.groupValueList;
      for (let i = 0; i < list.length; i++) {
        if (list[i].groupValue === value) {
          rst = list[i].groupName;
        }
      }
      return rst;
    },
    showTypeUnselectClickHandle() {
      this.editDialogData.rowData.showType = 0;
    }
  }
};
</script>

<style lang="scss">
  @import "./components/scss/columnBase";

  .column-manager-main-container {
    .search-area-anthology-name {
      margin-left: 22px;
    }
  }

  .source-list {
    .cell {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 1.2;
    }

    .headerClass {
      text-align: center;
    }

    .source-list-btn {
      width: 74px;
      height: 28px;
      padding: 0;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #4B67D6;
      letter-spacing: 0;
    }

    .source-list-show-type {
      div {
        color: #4B67D6;
      }
    }

    .source-list-show-type-title {
      div {
        color: #333333;
      }
    }
  }

  .edit-dialog {
    .el-dialog__header .el-dialog__title {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bolder;
    }

    .show-type-unselect {
      margin-left: 20px;
      color: #c0c4cc;
      cursor: pointer;
    }

    .column-course-img-tips {
      color: #999999;
    }
  }

  .submitBtn {
    button {
      &:nth-of-type(1) {
        border: none;
      }

      &:nth-of-type(2) {
        color: #4B67D6;
        border: 1px solid #4B67D6;
        border-radius: 4px;
      }
    }
  }
</style>
