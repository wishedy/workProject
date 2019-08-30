<template>
  <section class="column-manager-main-container course-type-video-select">
    <h3>{{courseName}}--选集视频</h3>
    <section class="column-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="视频ID">
              <el-input placeholder="输入视频ID" v-model="searchConditionData.refId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="选集名称">
              <el-input placeholder="输入选集名称" v-model="searchConditionData.anthologyNameLike"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="添加时间">
              <el-date-picker
                v-model="searchConditionCreateTime"
                type="daterange"
                range-separator="-"
                start-placeholder="不限"
                end-placeholder="不限"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态">
              <el-select
                placeholder="不限"
                v-model="searchConditionData.isValid"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item class="column-search-submit" style="float: right; margin-right: 50px;">
              <el-button @click="clearBtnOnClick">清空条件</el-button>
              <el-button @click="filterBtnOnClick">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="column-manager-button">
      <el-row>
        <el-col>
          <el-button @click="createBtnOnClick"><span class="el-icon-circle-plus"></span>新增选集</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="column-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%">
        <el-table-column
          :formatter="formatterRefId"
          prop="refId"
          width="140"
          label="视频ID">
        </el-table-column>
        <el-table-column
          prop="sortId"
          label="选集顺序">
        </el-table-column>
        <el-table-column
          :formatter="formatterCustomerIdList"
          prop="customerIdList"
          width="135"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="customerNameList"
          :formatter="formatterCustomerNameList"
          width="120"
          label="用户名字">
        </el-table-column>
        <el-table-column
          prop="anthologyName"
          width="180"
          label="选集名称">
        </el-table-column>
        <el-table-column
          prop="anthologyNum"
          label="选集总数">
        </el-table-column>
        <el-table-column
          prop="columnName"
          width="180"
          label="栏目">
        </el-table-column>
        <el-table-column
          prop="refDesc"
          width="180"
          label="一句话简介">
        </el-table-column>
        <el-table-column
          :formatter="formatterDate"
          prop="createTime"
          width="100"
          label="添加时间">
        </el-table-column>
        <el-table-column
          :formatter="formatterStatus"
          prop="isValid"
          label="状态">
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @keydown.native.prevent @click="tableEditBtnOnClick(scope.row)">编辑</el-button>
            <el-button @keydown.native.prevent @click="tableRemoveOnClick(scope.row)" v-if="scope.row.isValid"
                       class="changeState remove">下架
            </el-button>
            <el-button @keydown.native.prevent @click="tableRemoveOnClick(scope.row)" v-if="!scope.row.isValid"
                       class="changeState">上架
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <el-row>
      <el-col>
        <section class="column-manager-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginationData.currentPage"
            layout="total, prev, pager, next, jumper ,sizes"
            :total="paginationData.total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="paginationData.pageSize"
          >
          </el-pagination>
        </section>
      </el-col>
    </el-row>
    <videoSelectDialog
      @closeDialog="closeDialogHandle"
      :dialogShow="editDialogData.dialogShow"
      :newDialog="editDialogData.newDialog"
      :dialogData="editDialogData.dialogData"
    ></videoSelectDialog>
  </section>
</template>

<script>
/*
   * 课程型栏目-选集视频
   */
import videoSelectDialog from '@/views/columnManager/components/videoSelectDialog.vue';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'courseTypeVideoSelect',
  components: {
    videoSelectDialog
  },
  data() {
    return {
      tableData: [],
      columnId: this.$route.query.columnId,
      courseId: this.$route.query.courseId,
      courseName: this.$route.query.courseName,
      searchConditionData: {
        refId: '',
        anthologyNameLike: '',
        createStartTime: '',
        createEndTime: '',
        isValid: ''
      },
      searchConditionCreateTime: '',
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 20,
        total: 0
      },
      editDialogData: {
        dialogShow: false,
        newDialog: true,
        dialogData: null
      }
    };
  },
  methods: {
    getDataList() {
      // 获取数据列表
      // 分页数据
      this.paginationData.maxResult = this.paginationData.pageSize;
      this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;

      let data = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: 1,
        columnId: this.columnId,
        columnSubId: this.courseId
      };

      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          data[key] = this.searchConditionData[key];
        }
      }
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCourseTypeVideoTableList.type,
        url: apiUrlConfig.getCourseTypeVideoTableList.url,
        params: data
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        if (res && res.data.responseObject) {
          let responseObject = res.data.responseObject;
          this.tableData = responseObject.items;
          this.paginationData.total = responseObject.total;
        }
      }).catch((err) => {
        // 取消loading
        comm.closeLoading();
        console.log('获取视频选集数据失败：', err);
      });
    },
    updateColumnStatus(row) {
      let tipTitle = '';
      if (row.isValid === 1) {
        tipTitle = '视频选集下架';
      }
      else {
        tipTitle = '视频选集上架';
      }
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.saveCourseTypeVideo.type,
        url: apiUrlConfig.saveCourseTypeVideo.url,
        data: {
          id: row.id, // 选集的唯一id,点击编辑按钮发布后，需要传给后台
          columnId: this.columnId,
          columnSubId: this.courseId,
          refId: row.refId,
          isValid: row.isValid === 1 ? 0 : 1
        }
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        if (res) {
          this.$allin_confirm({
            title: '提示',
            content: tipTitle + '成功',
            type: 'notice',
            done: () => {
              this.getDataList();
            }
          });
        }
        else {
          this.$allin_confirm({ title: '提示', content: tipTitle + '失败', type: 'notice' });
        }
      }).catch((err) => {
        // 取消loading
        comm.closeLoading();
        this.$allin_confirm({ title: '提示', content: tipTitle + '失败', type: 'notice' });
        console.log('数据更新失败', err);
      });
    },
    handleSizeChange(val) {
      // 每页显示条数变化
      this.paginationData.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      // 当前页变化
      this.paginationData.currentPage = val;
      this.getDataList();
    },
    clearBtnOnClick() {
      for (var key in this.searchConditionData) {
        this.searchConditionData[key] = '';
      }
      this.searchConditionCreateTime = '';
    },
    filterBtnOnClick() {
      // 获取时间
      if (Array.isArray(this.searchConditionCreateTime) && this.searchConditionCreateTime.length > 0) {
        this.searchConditionData.createStartTime = this.searchConditionCreateTime[0];
        this.searchConditionData.createEndTime = this.searchConditionCreateTime[1];
      }
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
    },
    createBtnOnClick() {
      this.editDialogData.dialogShow = true;
      this.editDialogData.newDialog = true;
    },
    closeDialogHandle(needUpdate) {
      this.editDialogData.dialogShow = false;
      if (needUpdate === true) {
        this.getDataList();
      }
    },
    tableEditBtnOnClick(row) {
      this.editDialogData.dialogShow = true;
      this.editDialogData.newDialog = false;
      this.editDialogData.dialogData = row;
    },
    tableRemoveOnClick(row) {
      let content = '';
      if (row.isValid === 1) {
        content = '确定将此视频选集下架吗？';
      }
      else {
        content = '确定将此视频选集上架吗？';
      }
      this.$allin_confirm({
        title: '提示',
        content: content,
        done: () => {
          this.updateColumnStatus(row);
        }
      });
    },
    formatterRefId(row) {
      return row.refId ? row.refId : '待配置';
    },
    formatterCustomerIdList(row) {
      return row.customerIdList ? row.customerIdList : '待配置';
    },
    formatterCustomerNameList(row) {
      return row.customerNameList ? row.customerNameList : '待配置';
    },
    formatterStatus(row, column) {
      // 栏目状态格式化
      return row.isValid === 0 ? '已下架' : '已上架';
    },
    formatterDate(...rest) {
      return rest[2].substring(0, rest[2].length - 2);
    }
  },
  mounted() {
    this.getDataList();
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.editDialogData.dialogShow) {
          this.getDataList();
        }
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>

<style lang="scss">
  @import "./components/scss/columnBase";

</style>
