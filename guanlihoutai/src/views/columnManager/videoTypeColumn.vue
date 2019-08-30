<template>
  <section class="column-manager-main-container video-manager">
    <h1 class="column-manager-title">{{currentColumnTitle}}</h1>
    <section class="column-manager-search-area">
      <el-form label-width="80px" :model="searchForm" ref="searchForm">
        <el-row>
          <el-col :span="5">
            <el-form-item label="视频id" prop="refId">
              <el-input
                v-model.trim="searchForm.refId"
                placeholder="输入视频ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="视频名称" prop="anthologyNameLike">
              <el-input
                v-model="searchForm.anthologyNameLike"
                placeholder="输入视频名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提交时间">
              <el-date-picker
                v-model="searchFormCreateTime"
                type="daterange"
                align="right"
                start-placeholder="不限"
                end-placeholder="不限"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="状态" prop="isValid">
              <el-select v-model="searchForm.isValid" placeholder="请选择账号状态">
                <el-option label="不限" value=""></el-option>
                <el-option label="已下架" value="0"></el-option>
                <el-option label="已上架" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="医师名称" prop="customerNameLike">
              <el-input
                v-model.trim="searchForm.customerNameLike"
                placeholder="输入医师名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医师ID" prop="customerId">
              <el-input
                v-model.trim="searchForm.customerId"
                placeholder="输入医师ID"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="18">
            <el-form-item class="submitBtn">
              <el-button @click="searchFormReset">清空条件</el-button>
              <el-button @click="searchFormSubmit">&nbsp;&nbsp;筛选&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="column-manager-button">
      <el-row>
        <el-col>
          <h3>栏目内的资源</h3>
          <el-button @click="addVideoDeatil" class="el-icon-circle-plus">新增视频</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="column-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="refId"
          label="视频ID"
          width="130px"
        >
        </el-table-column>
        <el-table-column
          prop="sortId"
          label="栏目内顺序">
        </el-table-column>
        <el-table-column
          prop="customerIdList"
          label="用户ID"
          width="130px"
        >
        </el-table-column>
        <el-table-column
          prop="customerNameList"
          label="用户名字">
        </el-table-column>
        <el-table-column
          prop="columnName"
          label="栏目">
        </el-table-column>
        <el-table-column
          prop="anthologyName"
          width="180"
          label="视频名称">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          width="180"
          label="添加时间"
          :formatter="dataTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="isValid"
          width="80"
          :formatter="isValidFormatter"
          label="状态">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="editVideoDetail(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              @keydown.native.prevent
              @click="updataVideoDetail(scope.row)"
              :class="parseInt(scope.row.isValid) ===0?'changeState':'changeState remove'"
            >
              {{parseInt(scope.row.isValid) ===0?'上架':'下架'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="column-manager-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        >
      </el-pagination>
    </section>
    <el-dialog
      :title="this.editFormType === 1 ? '新增视频':'编辑视频'"
      :visible.sync="dialogFormVisible"
      custom-class="editFormDialog"
    >
      <el-form
        :model="editForm"
        ref="editForm"
        label-width="80px"
        :rules="editFormRules"
        :lock-scroll=false
      >
        <el-row type="flex">
          <!--editFormType: 1,//1-新增 2-编辑-->
          <el-col :span="8"   v-if="this.editFormType !== 1">
            <el-form-item
              label="视频顺序"
              prop="sortId"
            >
              <el-input v-model.trim="editForm.sortId" placeholder="输入视频顺序" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="this.editFormType === 1 ?24:8">
            <el-form-item
              label="视频ID"
              prop="refId"
            >
              <el-input
                v-model.trim="editForm.refId"
                placeholder="输入视频ID"
                @change="videoIdChange"
              >

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="this.editFormType !== 1">
            <el-form-item label="用户ID" prop="customerIdList" disable>
              <el-input
                v-model="editForm.customerIdList"
                placeholder="自动读取"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--新增时不显示-->
        <el-row type="flex"  v-if="this.editFormType !== 1">
          <el-col :span="16">
            <el-form-item label="视频名称" prop="anthologyName">
              <el-input
                v-model="editForm.anthologyName"
                placeholder="自动读取"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="用户姓名" prop="customerName">
              <el-input
                v-model="editForm.customerName"
                placeholder="自动读取"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @keydown.native.prevent
          @click="editFormSubmit('editForm')"
        >
          发布
        </el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
/**
   * 视频聚合栏目
   */

import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import validator from '@/assets/js/utils/validator';
export default {
  name: 'videoTypeColumn',
  data() {
    return {
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数 0
        maxResult: 10, // 分页参数 20
        sortType: 3
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0, // 总数
      searchForm: {
        columnId: '', // 栏目id
        sortType: '', // 排序1-按照创建时间倒叙2-按照顺序号正序
        refId: '', // 视频id
        anthologyNameLike: '', // 视频名称
        createStartTime: '', // 添加时间(开始时间)
        createEndTime: '', // 添加时间(结束时间)
        isValid: '', // 状态1-上架0-下架
        customerId: '', // 医师名称
        customerNameLike: ''// 医师id
      },
      searchFormCreateTime: '', // 搜索区域表单提交时间
      // 编辑视频区域
      dialogFormVisible: false,
      editForm: {
        refId: '', // 视频id
        sortId: '', // 排序
        anthologyName: '', // 名称
        customerIdList: '', // 用户id
        customerName: '', //
        columnId: '', // 栏目id
        isValid: '', // 上架下架
        id: '', // 是
        index: 0
      },
      editFormType: 1, // 1-新增 2-编辑
      editFormRules: {
        sortId: [
          {
            required: true,
            message: '视频顺序不能为空',
            trigger: 'blur'
          },
          {
            validator: validator.isPositiveInteger,
            message: '视频顺序必须为正整数',
            trigger: 'blur'
          }
        ],
        refId: [
          {
            required: true,
            message: '视频ID不能为空'
          },
          {
            validator: this.editIsPositiveInteger,
            message: '视频ID必须为正整数',
            trigger: 'blur'
          }
        ]
      },
      // 当前栏目标题,url
      currentColumnTitle: '',
      currentColumnId: ''
    };
  },
  computed: {},
  components: {},
  methods: {
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getTableListVideoTypeColumn.type,
        url: apiConfig.getTableListVideoTypeColumn.url,
        params: this.tableParams
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.items) {
          let responseData = response.data.responseObject;
          this.tableData = responseData.items;
          this.total = responseData.total;
        }
        comm.closeLoading();
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('获取video列表失败：', e);
      });
    },
    /*
      * 视频聚合栏目-编辑获取数据
      * params 查询接口需要的参数
      * */
    getColumnVideoById(params) {
      comm.openLoading('加载中...');
      var _this = this;
      axios({
        method: apiConfig.getColumnVideoByIdVideoTypeColumn.type,
        url: apiConfig.getColumnVideoByIdVideoTypeColumn.url,
        params: params
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseData = response.data.responseObject.responseData;

          _this.editForm.customerName = responseData.customerNameList || '';
          _this.editForm.customerIdList = responseData.customerIdList || '';
          _this.editForm.columnId = responseData.columnId || '';
          _this.editForm.refId = comm.isNumber(responseData.refId) && parseInt(responseData.refId);
          _this.editForm.isValid = responseData.isValid || '';
          _this.editForm.id = responseData.id || '';
          _this.editForm.sortId = responseData.sortId || '';
          _this.editForm.anthologyName = responseData.anthologyName || '';
        }
        comm.closeLoading();
        this.dialogFormVisible = true;
      }).catch((e) => {
        comm.closeLoading();
        console.log('获取编辑获-取数据失败：', e);
      });
    },
    /*
      * 根据视频id获取视频名称/用户
      * params 查询接口需要的参数
      * */
    getVideoContentByVideoId(params) {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getVideoContentByVideoIdVideoTypeColumn.type,
        url: apiConfig.getVideoContentByVideoIdVideoTypeColumn.url,
        params: params
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseObject = response.data.responseObject;
          let responseData = response.data.responseObject.responseData;
          if (Object.keys(responseData).length > 0) {
            _this.editForm.anthologyName = responseData.videoName;

            if (responseData.authorList && responseData.authorList.length > 0) {
              _this.editForm.customerIdList = responseData.authorList.map(function(item, index) {
                return item.customerId;
              }).join(',');

              _this.editForm.customerName = responseData.authorList.map(function(item, index) {
                return item.customerName;
              }).join(',');
            }
          }
          else {
            responseObject.responseMessage && this.$message.error(responseObject.responseMessage || ' 失败');
            _this.editForm.refId = ''; // 置空
            console.log('根据视频id获取视频名称/用户失败:', responseObject.responseMessage);
          }
        }
        comm.closeLoading();
      }).catch((e) => {
        comm.closeLoading();
        console.log('根据视频id获取视频名称-获取数据失败：', e);
      });
    },
    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (val - 1) * this.pageSize;
      this.getTableData();
    },

    // 搜索表单提交
    searchFormSubmit() {
      if (Array.isArray(this.searchFormCreateTime) && this.searchFormCreateTime.length > 0) {
        this.searchForm.createStartTime = this.searchFormCreateTime[0];
        this.searchForm.createEndTime = this.searchFormCreateTime[1];
      }
      else {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }

      var newObj = {};
      for (var key in this.searchForm) {
        if (this.searchForm[key].toString()) {
          newObj[key] = this.searchForm[key];
        }
      }

      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      // 针对两个时间字段
      this.tableParams = this.deepExtend({}, {
        firstResult: 0,
        maxResult: 10,
        sortType: 3,
        columnId: this.currentColumnId
      }, newObj);

      // 恢复默认值
      this.pageSize = 10;
      this.currentPage = 1;

      this.getTableData();
    },

    // 搜索表单重置
    searchFormReset() {
      this.$refs['searchForm'].resetFields();
      // todo对创建时间操作
      // 对时间组件进行重置
      this.searchFormCreateTime = [];
      this.searchForm.createStartTime = '';
      this.searchForm.createEndTime = '';
    },
    // 新增视频video
    addVideoDeatil() {
      this.editFormType = 1; // 1-新增 2-编辑
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();

      for (let key in this.editForm) {
        this.editForm[key] = '';
      }
      this.dialogFormVisible = true;
    },
    // 编辑的时触发change事件
    videoIdChange(value) {
      console.log('======');
      // 为什么编辑弹窗时,初始化不能触发呢 因为监控的失去焦点事件
      // 编辑时触发,新增时由发布按钮触发
      if (this.editFormType !== 1 && comm.isNumber(value)) {
        // 根据视频id获取视频名称/用户
        this.getVideoContentByVideoId(
          {
            videoId: value
          }
        );
      }
    },
    // 编辑video
    editVideoDetail(row) {
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
      for (let key in this.editForm) {
        this.editForm[key] = '';
      }
      this.editFormType = 2; // 1-新增 2-编辑
      this.editForm.index = row.index;
      // 编辑获取数据
      this.getColumnVideoById({
        columnId: row.columnId,
        refId: row.refId // 视频id
      }
      );
    },
    // 编辑视频发布 -编辑表单提交
    editFormSubmit(formName) {
      var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // _this.editFormType  1-新增 2-编辑
          if (_this.editFormType === 1) {
            // 1400749778016, 1403484561617, 1418105159224,1418105162778,1418105166223,1397797491441,1418090408183,1400749778016,1400749778016,1403484561617,1418105159224,1418105162778,1418105166223,1397797491441,1400749778016,1400749778016,1403484561617,1418105159224,1418105162778,1418105166223,1397797491441,
            let newArray = this.uniqueArraySet(_this.editForm.refId.replace(/，/g, ',').replace(/\s+/g, '').split(','));
            if (newArray.length > 10) {
              this.$message.error(' 最多输入10个ID');
              return false;
            }
            else {
              for (var i = 0; i < newArray.length; i++) {
                if (!comm.isPositiveInteger(newArray[i]) || !(newArray[i] !== '0')) {
                  this.$message.error('请输入正确的视频ID');
                  return false;
                }
              }
            }
            _this.editForm.refId = newArray.map(item => item).join(',');
            _this.editForm.columnId = _this.currentColumnId;
            _this.editForm.isValid = 1;
            _this.editForm.visitSiteId = 25;
            _this.editForm.columnType = 2; // 栏目类型1-课程聚合2-视频聚合3-直播聚合
          }

          var newObj = {};
          for (var key in _this.editForm) {
            if (_this.editForm[key].toString()) {
              newObj[key] = _this.editForm[key];
            }
          }
          comm.openLoading('加载中...');
          axios({
            method: apiConfig.saveColumnVideoVideoTypeColumn.type,
            url: apiConfig.saveColumnVideoVideoTypeColumn.url,
            data: newObj
          }).then((response) => {
            if (response && response.data && response.data.responseObject) {
              let msg = '';
              // 1-新增 2-编辑
              if (parseInt(this.editFormType) === 1) {
                msg = ' 新增';
              }
              else {
                msg = ' 编辑';
              }

              /*
                * 新增多个VideoId后,会出现部分数据成功的原因,全部重新拉取表格
                * */
              this.pageSize = 20; // 恢复默认值
              this.currentPage = 1; // 恢复默认值
              this.tableParams.maxResult = 20;
              this.tableParams.firstResult = 0;

              let responseObject = response.data.responseObject;
              if (responseObject.responseStatus && !(responseObject.responseData && responseObject.responseData.errorRefIdList)) {
                this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
              }
              else {
                let errorRefIdList = responseObject.responseData && responseObject.responseData.errorRefIdList;
                this.$allin_confirm({title: '提示', content: errorRefIdList ? '视频ID号:' + errorRefIdList + msg + '失败' : msg + '失败', type: 'notice'});
                console.log(errorRefIdList ? '视频ID号:' + errorRefIdList + msg + '失败' : msg + '失败');
              }
              comm.closeLoading();
              this.getTableData();
            }
            _this.dialogFormVisible = false;
          }).catch((e) => {
            comm.closeLoading();
            _this.dialogFormVisible = false;
            console.log('新增/下架视频失败：', e);
          });
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 下架功能
    updataVideoDetail(row) {
      // 状态1-上架0-下架
      let contentMsg = '';
      let msg = '';
      if (parseInt(row.isValid) === 1) {
        contentMsg = '确定将此视频下架么？';
        msg = '下架';
      }
      else {
        contentMsg = '确定将此条视频上架么';
        msg = '上架';
      }

      let newIsValid = parseInt(row.isValid) === 1 ? 0 : 1;
      this.$allin_confirm({
        title: '提示',
        content: contentMsg,
        done: () => {
          axios({
            method: apiConfig.saveColumnVideoVideoTypeColumn.type,
            url: apiConfig.saveColumnVideoVideoTypeColumn.url,
            data: {
              columnId: row.columnId,
              refId: row.refId, // 视频id
              isValid: newIsValid,
              id: row.id,
              visitSiteId: 25
            }
          }).then((response) => {
            if (response && response.data && response.data.responseObject) {
              let responseObject = response.data.responseObject;
              if (responseObject.responseStatus) {
                this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
                row.isValid = newIsValid;
              }
              else {
                this.$allin_confirm({title: '提示', content: msg + '失败' + (responseObject.responseMessage || ''), type: 'notice'});
              }
            }
            comm.closeLoading();
          }).catch((e) => {
            console.log('新增/下架视频失败：', e);
          });
        }
      });
    },
    dataTimeFormatter(row, column, cellValue) {
      if (cellValue.length) {
        return cellValue.substring(0, cellValue.length - 2);
      }
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    isValidFormatter(row, column, cellValue) {
      var value = parseInt(row.isValid);
      var valueDesc = '';
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
    /* 对象合并 */
    // 深复制,需要第一个参数为 {}
    deepExtend(out) {
      out = out || {};
      for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i];

        if (!obj) {
          continue;
        }

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              out[key] = this.deepExtend(out[key], obj[key]);
            }
            else {
              out[key] = obj[key];
            }
          }
        }
      }
      return out;
    },
    // 编辑时 判断是否为正整数
    editIsPositiveInteger(rule, value, callback) {
      if (this.editFormType !== 1) {
        if (/^[0-9]*[1-9][0-9]*$/.test(value) && value !== '0' && value !== 0) {
          callback();
        }
        else {
          callback(new Error('必须为正整数'));
        }
      }
      else {
        callback();
      }
    },
    uniqueArraySet(array) {
      // Set。它类似于数组，但是成员的值都是唯一的，没有重复的值
      return Array.from(new Set(array)).filter(value => value);
    }
  },
  watch: {

  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
    // 获取相关参数
    let urlParam = comm.getpara();
    this.currentColumnId = urlParam.columnId;
    this.tableParams.columnId = urlParam.columnId;
    this.currentColumnTitle = urlParam.columnName;
  },
  mounted() {
    // 拉取表格数据
    this.getTableData();

    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.dialogFormVisible) {
          this.searchFormSubmit();
        }
      }
    };
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>

<style lang="scss">
  @import "./components/scss/columnBase";

  .video-manager {
    .column-manager-title {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }
    //搜索区域
    .column-manager-search-area {
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
    }

    //新增按钮
    .column-manager-button button {
      padding: 10px 13px;
      span {
        padding-left: 2px;
      }
    }

    //表格区域
    .column-manager-table {
      .cell button {

      }
    }
    //编辑视频
    .editFormDialog {
      .el-dialog__footer {
        button {
          height: 32px;
          width: 140px;
          padding: 0;
          background: #3846DC;
          border-radius: 3px;
          span {
            font-family: PingFangSC-Medium;
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            line-height: 14px;
          }
        }
      }
    }
  }
  .ui_confirm .popupWindow .content{
    word-break: break-all;
  }
</style>
<style scoped lang="scss">
  .el-select-dropdown__item {
    padding-left: 40px;
    position: relative;
    border-bottom: 1px solid rgba(230, 230, 232, 0.3);
    &:last-of-type {
      border-bottom: none;
    }

    &:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-unselected.png) center center no-repeat;
      content: "";
      display: block;
      width: 40px;
      height: 100%;
      position: absolute;
      opacity: 1;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.selected:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-selected.png) center center no-repeat;
    }
  }
</style>
