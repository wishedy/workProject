<template>
  <section class="column-manager-main-container">
    <h3>骨人云活动后台</h3>
    <section class="column-manager-search-area">
      <el-form @keydown.enter="getTableData" label-width="120px" ref="activitySearchForm">
        <el-row>
          <el-col :span="6">
            <el-form-item label="骨人云活动Id：">
              <el-input   v-model="form.movementActivityId" placeholder="输入活动id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="骨人云活动名称：" label-width="140px">
              <el-input   v-model="form.movementActivityName" placeholder="输入活动名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="发布时间：">
              <el-date-picker
                v-model="form.publishTime"
                type="daterange"
                range-separator="至"
                start-placeholder="不限"
                end-placeholder="不限"
                :default-time="['00:00:00','23:59:59']"
                value-format="yyyy-MM-dd HH:mm:ss" >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="Banner图前端状态：" label-width="160px">
              <el-select
                v-model="form.isShowBanner"
                placeholder="请选择处理状态"
                required
                value="">
                <el-option label="不限" value=""></el-option>
                <el-option label="展示" value="1"></el-option>
                <el-option label="不展示" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="活动状态：">
              <el-select
                v-model="form.isValid"
                placeholder="请选择处理状态"
                required
                value="">
                <el-option label="不限" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="参与数：">
              <el-select
                v-model="form.movementNum"
                placeholder="请选择处理状态"
                required
                value="" >
                <el-option label="不限" value=""></el-option>
                <el-option label="0" :value="[0,0]"></el-option>
                <el-option label="1-10" :value=[1,10]></el-option>
                <el-option label="11-20" :value=[11,20]></el-option>
                <el-option label="21-30" :value=[21,30]></el-option>
                <el-option label="31-40" :value=[31,40]></el-option>
                <el-option label="41-50" :value=[41,50]></el-option>
                <el-option label="50以上" :value=[50]></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="浏览数：">
              <el-select
                v-model="form.browseNum"
                placeholder="请选择处理状态"
                required
                value="">
                <el-option label="不限" value=""></el-option>
                <el-option label="0" :value="[0,0]"></el-option>
                <el-option label="1-50" :value=[1,50]></el-option>
                <el-option label="51-200" :value=[51,200]></el-option>
                <el-option label="201-500" :value=[201,500]></el-option>
                <el-option label="501-1千" :value=[501,1000]></el-option>
                <el-option label="1千以上" :value=[1000]></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item  class="submitBtn" style="float: right; margin-right: 50px;">
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
          <el-button @click="addActivity" ><span class="el-icon-circle-plus"></span>新增活动</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="source-list column-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @sort-change='tableChange'
      >
        <el-table-column
          prop="movementActivityId"
          label="骨人云活动id"
          width="140"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="movementActivityName"
          label="骨人云活动名称"
          width="260"
          align="left"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="movementActivityUrl"
          label="骨人云活动链接地址"
          width="260"
          align="left"
          header-align="center"
        >
        </el-table-column>
        <el-table-column
          prop="publishTime"
          label="发布时间"
          align="center"
          width="160"
          :formatter="formatterDate"
        >
        </el-table-column>
        <el-table-column
          prop="movementNum"
          label="参与数"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="browseNum"
          width="100"
          label="浏览数"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="attUrl"
          width="120"
          label="Banner图预览"
          align="center"
        >

          <template slot-scope="scope">
            <img src="/static/images/icons/icon-picture_hover_tiny.png"
                 class="bigImgShow"
                 alt=""
                 v-if="scope.row.attUrl"
                 @mouseenter="smallImgMouseenter(scope.row.attUrl)"
                 @mouseleave="smallImgMouseLeave"
            >
          </template>

        </el-table-column>
        <el-table-column
          prop="isShow"
          width="140"
          label="Banner图前端状态"
          align="center"
          :formatter="isShowFormatter"
        ></el-table-column>
        <el-table-column
          prop="isValid"
          width="100"
          label="活动状态"
          align="center"
          :formatter="isValidFormatter"
        ></el-table-column>
        <el-table-column label="操作"
                         width="220"
                         fixed="right"
                         align="center"     >
          <template slot-scope="scope">
            <el-button @click="editActivity(scope.row)" @keydown.native.prevent>编辑</el-button>
            <el-button @click="handleUpAndDown(scope.row)" @keydown.native.prevent :class="parseInt(scope.row.isValid) ===0?'changeState':'changeState remove'">
              {{parseInt(scope.row.isValid) ===0?'上架':'下架'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row class="pagination" style="margin:20px 0">
      <el-col :span="10" :offset="5">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      :title="editDialogData.title"
      :visible.sync="editDialogData.visible"
      v-if="editDialogData.visible"
      width="770px"
      top="18vh"
      custom-class=""
      :center=true
      :lock-scroll=false>
      <el-form ref="editDialogForm"
               label-width="90px"
               :model="editDialogData.rowData"
               :rules="rules">
        <el-row>
          <el-col :span="16" >
            <el-form-item label="骨人云活动名称" prop="movementActivityName" label-width="140px">
              <el-input v-model="editDialogData.rowData.movementActivityName"
                        placeholder="输入活动名称"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editDialogData.action==='edit'">
          <el-col :span="16" >
            <el-form-item label="骨人云活动Id" prop="movementActivityId" label-width="140px">
              <el-input v-model="editDialogData.rowData.movementActivityId" disabled  ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="活动链接地址"  prop="activityMobileUrl" label-width="140px">
              <el-input v-model="editDialogData.rowData.movementActivityUrl" placeholder="输入H5链接地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="column-course-img-list">
              <el-form-item label="Banner图"
                            class="column-course-img-label img-upload"
                            prop="attUrl" label-width="140px">
                <div class="uploadCon">

                  <ColumnImgUpload
                    :imgUrl="editDialogData.rowData.attUrl"
                    :imgFileSizeMaxLimit="2"
                    :widthHeightMaxLimit="[1035,216]"
                    :needClear="needClear"
                    @uploadSuccess="handleImgUploadSuccess"
                  >
                  </ColumnImgUpload>
                  <div class="deleteImg" @click="handleDeleteImg"
                       v-show="editDialogData.rowData.isUploaded" >
                    <i class="el-icon-circle-close"></i>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="column-course-img-list">
              <el-form-item label="Banner图前端状态"
                            class="column-course-img-label img-upload"
                            prop="attUrl" label-width="140px">
                <el-radio-group v-model="editDialogData.rowData.isShow">
                  <el-radio label="1" v-model="editDialogData.rowData.isShow"  @click.native.prevent="handleShowChange">展示</el-radio>
                  <el-radio label="0" v-model="editDialogData.rowData.isShow" >不展示</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item style="float: right; ">
              <el-button type="primary" size="small" style="width:150px;" @click="saveActivity">发布</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

    <!--表格点击查看大图-->
    <div class="tableBigImgDialog"
         v-if="bigImgDialogVisible"
         @mouseenter="bigImgMouseenter"
         @mouseleave="bigImgMouseLeave"
    >
      <img :src="bigImgPath"
           alt=""
      >
    </div>
  </section>
</template>
/**
* 骨人云活动管理
*/
<script>
import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import comm from '@/assets/js/utils/comm';
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';
export default {
  name: 'boneCloudActivityColumn',
  components: {
    ColumnImgUpload
  },
  data() {
    return {
      columnName: this.$route.query.columnName,
      columnId: this.$route.query.columnId,
      bigImgPath: '',
      bigImgDialogVisible: false,
      bigImgTimer: null, // 定时器
      needClear: false,
      params: {
        movementActivityId: '',
        movementActivityName: '',
        startTime: '',
        endTime: '',
        isShowBanner: '',
        movementNumMin: '',
        movementNumMax: '',
        browseNumMin: '',
        browseNumMax: '',
        maxResult: 10
      },
      form: {
        movementActivityId: '',
        movementActivityName: '',
        publishTime: '',
        isShowBanner: '',
        movementNum: '',
        browseNum: '',
        isValid: '',
        sortType: 1
      },
      tableData: [],
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      firstResult: 0,
      editDialogData: {
        title: '新增活动',
        visible: false,
        sortIdPlaceHolder: '',
        sortIdDisabled: 'disabled',
        rowData: {
          movementActivityName: '',
          movementActivityId: '',
          imgUrl: '',
          activityMobileUrl: '',
          isValid: 0, // 默认不显示
          bannerId: '',
          isUploaded: false,
          attList: [{
            attUrl: ''
          }]
        }
      },
      rules: {
        movementActivityName: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' },
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  watch: {

  },
  mounted() {
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
    // 表格图片hover事件
    smallImgMouseenter(bigImgPath) {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
      if (bigImgPath) {
        // 查看大图时,大图url按照规则对缩略图进行获取后获得
        let url = bigImgPath;
        if (url) {
          // 包含_c_t  则保留_c + 后缀
          if (url.includes('_c_t')) {
            this.bigImgPath = url.substring(0, url.indexOf('_c_t')) + '_c' + url.substring(url.lastIndexOf('.'), url.length);
          }
          else {
            this.bigImgPath = url;
          }
        }
        else {
          this.bigImgPath = '';
        }
        this.bigImgDialogVisible = true;
      }
    },
    smallImgMouseLeave() {
      let _this = this;
      _this.bigImgTimer = setTimeout(function() {
        _this.bigImgDialogVisible = false;
      }, 1000);
    },
    bigImgMouseenter() {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
    },
    bigImgMouseLeave() {
      this.bigImgDialogVisible = false;
    },
    // 获取表格数据
    getTableData() {
      let _this = this;
      let params = {
        sortType: _this.form.sortType,
        firstResult: _this.firstResult,
        maxResult: _this.params.maxResult
      };
      if (_this.form.movementActivityId !== '') {
        params.movementActivityId = _this.form.movementActivityId;
      }
      if (_this.form.movementActivityName !== '') {
        params.movementActivityName = _this.form.movementActivityName;
      }
      if (_this.form.isValid !== '') {
        params.isValid = _this.form.isValid;
      }
      if (_this.form.isShowBanner !== '') {
        params.isShowBanner = _this.form.isShowBanner;
      }
      if (_this.form.publishTime) {
        params.startTime = _this.form.publishTime[0];
        params.endTime = _this.form.publishTime[1];
      }
      if (_this.form.browseNum) {
        params.browseNumMin = _this.form.browseNum[0];
        if (_this.form.browseNum[1] !== undefined) {
          params.browseNumMax = _this.form.browseNum[1];
        }
      }
      if (_this.form.movementNum) {
        params.movementNumMin = _this.form.movementNum[0];
        if (_this.form.movementNum[1] !== undefined) {
          params.movementNumMax = _this.form.movementNum[1];
        }
      }
      console.log(params);
      comm.openLoading('加载中...');
      axios({
        url: apiUrl.boneCloudBannerGetMapList.url,
        type: apiUrl.boneCloudBannerGetMapList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.tableData = data.data.responseObject.responseData.dataList;
        _this.total = data.data.responseObject.responseData.totalCount;
      }).catch((e) => {
        comm.closeLoading();
        this.$message({
          type: 'info',
          message: '查询失败'
        });
      });
    },

    resetForm() {
      this.$refs['activitySearchForm'].resetFields();
      // 对时间组件进行重置
      this.form.movementActivityId = '';
      this.form.movementActivityName = '';
      this.form.publishTime = '';
      this.form.isValid = '';
      this.form.isShowBanner = '';
      this.form.browseNum = '';
      this.form.movementNum = '';
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    // 查询
    onSubmit() {
      if (Array.isArray(this.form.publishTime) && this.form.publishTime.length > 0) {
        this.form.startTime = this.form.publishTime[0];
        this.form.endTime = this.form.publishTime[1];
      }
      else {
        this.form.startTime = '';
        this.form.endTime = '';
      }
      // 数据为空不提交
      this.currentPage = 1;
      this.firstResult = 0;
      this.getTableData();
    },
    formatterDate(...rest) {
      if (rest[2]) {
        return rest[2].substring(0, rest[2].length - 5);
      }
      else {
        return '';
      }
    },
    // 首页配图上传成功回调函数
    handleImgUploadSuccess(data) {
      let t = this;
      comm.openLoading('保存中...');
      let paramsData = Object.assign({}, data);
      paramsData.movementActivityId = '';
      paramsData.isValid = '0';
      paramsData.isShow = '0';
      t.needClear = false;
      t.editDialogData.rowData.isUploaded = true;
      t.$set(t.editDialogData.rowData, 'isUploaded', true);
      this.$forceUpdate();
      axios({
        method: apiUrl.boneCloudSavePic.type,
        url: apiUrl.boneCloudSavePic.url,
        data: paramsData
      }).then(function(data) {
        if (data.data.responseObject.responseStatus) {
          t.editDialogData.rowData.bannerId = data.data.responseObject.responsePk;
        }
        comm.closeLoading();
      }).catch(function() {
        comm.closeLoading();
        this.$message('保存图片失败');
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.params.maxResult = val;
      this.pageSize = val;
      this.firstResult = 0;
      this.currentPage = 0;
      this.getTableData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.firstResult = (val - 1) * this.params.maxResult;
      this.getTableData();
    },
    isValidFormatter(row, column, cellValue) {
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
    isShowFormatter(row, column, cellValue) {
      let value = parseInt(row.isShow);
      let valueDesc = '';
      switch (value) {
        case 0:
          valueDesc = '不展示';
          break;
        case 1:
          valueDesc = '展示';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    // 排序
    tableChange(column, prop, order) {
      this.currentPage = 1; // 回退到第一页
      if (column.prop === 'updateTime') {
        this.params.sortType = column.order === 'ascending' ? 4 : 5;
        this.getTableData();
      }
      else if (column.prop === 'sortId') {
        this.params.sortType = column.order === 'ascending' ? 2 : 3;
        this.getTableData();
      }
      this.setQueryParamsInLocalStorage(this.params);
    },
    //  添加新活动
    addActivity() {
      let _this = this;
      if (_this.$refs.editDialogForm) {
        _this.$refs.editDialogForm.resetFields();
      }
      _this.editDialogData.action = 'add';
      _this.editDialogData.title = '新增活动';
      _this.editDialogData.visible = true;
      _this.editDialogData.attUrl = '';
      _this.editDialogData.sortIdDisabled = true;
      _this.editDialogData.rowData = {
        movementActivityId: '',
        movementActivityName: '',
        isShowBanner: '',
        isUploaded: false,
        bannerId: null,
        isShow: '0',
        movementActivityUrl: '',
        attUrl: ''
      };
      _this.editDialogData.rowData.userName = localStorage.getItem('userLoginName');
    },
    //  编辑活动
    editActivity(row) {
      let _this = this;
      _this.editDialogData.action = 'edit';
      _this.editDialogData.title = '编辑活动';
      _this.editDialogData.visible = true;
      _this.editDialogData.rowData = {
        movementActivityId: row.movementActivityId,
        movementActivityName: row.movementActivityName,
        isShowBanner: row.isShowBanner,
        isValid: row.isValid,
        isShow: row.isShow,
        movementActivityUrl: row.movementActivityUrl,
        bannerId: row.bannerId,
        attUrl: row.attUrl
      };
      if (row.attUrl) {
        _this.editDialogData.rowData.isUploaded = true;
      }
    },
    handleDeleteImg() {
      let t = this;
      t.editDialogData.rowData.bannerId = '';
      t.editDialogData.rowData.attUrl = '';
      t.editDialogData.rowData.isUploaded = false;
      if (t.editDialogData.rowData.isShow === '1') {
        t.editDialogData.rowData.isShow = '0';
      }
      t.needClear = true;
      t.$forceUpdate();
    },
    // 处理上下架
    handleUpAndDown(row) {
      // 是 状态1-上架0-下架
      let _this = this;
      let contentMsg = '';
      let msg = '';
      if (parseInt(row.isValid) === 1) {
        contentMsg = '确定下架此骨人云活动么？';
        msg = '下架';
      }
      else {
        contentMsg = '确定上架此骨人云活动么';
        msg = '上架';
      }
      let newIsValid = parseInt(row.isValid) === 1 ? '0' : '1';
      this.$allin_confirm({
        content: contentMsg,
        done: () => {
          axios({
            method: apiUrl.boneCloudSaveActivity.type,
            url: apiUrl.boneCloudSaveActivity.url,
            data: {
              movementActivityId: row.movementActivityId, // string 是
              bannerId: row.bannerId, // string 视频id
              isValid: newIsValid,
              isShow: row.isShow,
              visitSiteId: 25
            }
          }).then((response) => {
            if (response && response.data && response.data.responseObject) {
              let responseObject = response.data.responseObject;
              if (responseObject.responseStatus) {
                this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
                row.isValid = newIsValid;
                _this.getTableData();
              }
              else {
                this.$allin_confirm({title: '提示', content: msg + '失败' + (responseObject.responseMessage), type: 'notice'});
                console.log(responseObject.responseMessage);
              }
            }
            comm.closeLoading();
          }).catch((e) => {
            comm.closeLoading();
            this.$message(msg + '活动失败');
          });
        }
      });
    },
    // 点击展示时
    handleShowChange() {
      let _this = this;
      if (_this.editDialogData.rowData.bannerId) {
        _this.$allin_confirm({
          content: '确定在前台展示此Banner么？',
          type: 'confirm',
          done: function() {
            // 确定是否有上传banner图
            _this.editDialogData.rowData.isShow = '1';
          }
        });
      }
      else {
        this.$message('请先添加Banner图');
      }
      return false;
    },
    //  发布活动流程，1. 保存图片地址 ，获取 bannerId,2.保存活动
    saveActivity() {
      let _this = this;
      _this.editDialogData.rowData.columnId = _this.columnId;
      _this.editDialogData.rowData.columnType = '4';
      let data = Object.assign({}, this.editDialogData.rowData);
      data.userName = localStorage.getItem('userLoginName');
      this.$refs.editDialogForm.validate((valid) => {
        if (valid) {
          comm.openLoading('加载中...');
          axios({
            method: apiUrl.boneCloudSaveActivity.type,
            url: apiUrl.boneCloudSaveActivity.url,
            data: data
          }).then(function(data) {
            comm.closeLoading();
            _this.editDialogData.visible = false;
            if (_this.editDialogData.action === 'add') {
              _this.$allin_confirm({title: '提示', content: '新增成功', type: 'notice'});
            }
            else {
              _this.$allin_confirm({title: '提示', content: '更新成功', type: 'notice'});
            }
            _this.getTableData();
          }).catch(function() {
            comm.closeLoading();
            this.$message('新增活动失败');
          });
        }
        else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" >
  @import "./components/scss/columnBase";
  .source-list {
    .cell {
      font-family: PingFangSC-Regular,Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 1.2;

    }
    .headerClass{
      text-align: center;
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
  .uploadCon{
    position: relative;
    .deleteImg{
      position:absolute;
      top:-15px;
      left:140px;
      i{
        color:red;
        font-size:20px;
        width:25px;
        height:25px;
      }
    }
  }
  // 列表查看大图
  .tableBigImgDialog {
    padding: 68px 0;
    font-size: 0;
    width: 376px;
    height: 376px;
    box-sizing: border-box;
    background: #000000;
    box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);
    border-radius: 3px;
    position: fixed;
    top:50%;
    left:50%;
    margin: -188px 0 0 -188px;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }

</style>
