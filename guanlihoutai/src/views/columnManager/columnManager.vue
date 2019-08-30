<template>
  <section class="column-manager-main-container">
    <h3>v3.0栏目管理</h3>
    <section class="column-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="栏目ID">
              <el-input placeholder="输入栏目ID" v-model="searchConditionData.columnId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="栏目名称">
              <el-input placeholder="输入栏目名称" v-model="searchConditionData.columnNameLike"></el-input>
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
                required
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

          <el-col :span="12">
            <el-form-item label="更新时间">
              <el-date-picker
                v-model="searchConditionUpdateTime"
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
          <el-button @click="createColumnBtnOnClick"><span class="el-icon-circle-plus"></span>新增栏目</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="column-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%">
        <el-table-column
          prop="columnId"
          width="140"
          label="栏目ID">
        </el-table-column>
        <el-table-column
          prop="columnName"
          width="180"
          label="栏目名称">
        </el-table-column>
        <el-table-column
          prop="resourceNum"
          label="资源量">
        </el-table-column>
        <el-table-column
          prop="columnType"
          :formatter="formatterColumnType"
          label="分类">
        </el-table-column>
        <el-table-column
          :formatter="formatterDate"
          prop="createTime"
          width="100"
          label="添加时间">
        </el-table-column>
        <el-table-column
          :formatter="formatterDate"
          prop="updateTime"
          width="100"
          label="更新时间">
        </el-table-column>
        <el-table-column
          :formatter="formatterStatus"
          prop="isValid"
          label="状态">
        </el-table-column>
        <el-table-column label="操作" width="400" fixed="right">
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="tableEditBtnOnClick(scope.row)"
              :disabled="!checkCanEdit(scope.row)"
              v-if="checkCanEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isValid ==0"
              @keydown.native.prevent
              @click="tableValidBtnOnClick(scope.row)"
              class="changeState"
            >
              上架
            </el-button>
            <el-button
              v-else
              @keydown.native.prevent
              @click="tableValidBtnOnClick(scope.row)"
              class="changeState remove"
            >
              下架
            </el-button>
            <el-button @click="tableDetailBtnOnClick(scope.row)">查看内容</el-button>
            <el-button @click="tableIndexBtnOnClick(scope.row)" class="column-table-index-btn">首页操作</el-button>
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
            :total="paginationData.total"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="paginationData.pageSize"
            layout="total, prev, pager, next, jumper ,sizes"
          >
          </el-pagination>
        </section>
      </el-col>
    </el-row>
    <columnEdit @closeDialog="closeDialogHandle"
                 :columnData="columnEditData.columnData"
                 :dialogShow="columnEditData.dialogShow"
                 :newDialog="columnEditData.newDialog">
    </columnEdit>
  </section>
</template>

<script>
/**
   * 栏目管理
   */
import columnEdit from '@/views/columnManager/components/columnEdit/columnEdit.vue';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'columnManager',
  components: {
    columnEdit
  },
  data() {
    return {
      tableData: [],
      searchConditionData: {
        columnId: '',
        columnNameLike: '',
        createStartTime: '',
        createEndTime: '',
        isValid: '',
        updateStartTime: '',
        updateEndTime: ''
      },
      searchConditionCreateTime: '',
      searchConditionUpdateTime: '',
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 20, // 默认显示20条
        total: 0
      },
      columnEditData: {
        dialogShow: false,
        newDialog: false,
        columnData: {}
      }
    };
  },
  methods: {
    getDataList() {
      this.paginationData.maxResult = this.paginationData.pageSize;
      this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;
      let data = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: 1
      };
      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          data[key] = this.searchConditionData[key];
        }
      }
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getColumnTableList.type,
        url: apiUrlConfig.getColumnTableList.url,
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
        console.log('栏目后台数据请求异常：' + err);
      });
    },
    updateColumnStatus(row) {
      let tipTitle = '';
      if (row.isValid === 1) tipTitle = '栏目下架';
      else tipTitle = '栏目上架';
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.updateColumnValid.type,
        url: apiUrlConfig.updateColumnValid.url,
        data: {
          columnId: row.columnId,
          isValid: row.isValid === 1 ? 0 : 1,
          visitSiteId: 25
        }
      }).then((res) => {
        // 取消loading
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
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
          this.$allin_confirm({title: '提示', content: tipTitle + '失败', type: 'notice'});
        }
      }).catch(() => {
        // 取消loading
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: tipTitle + '失败', type: 'notice'});
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
      this.searchConditionUpdateTime = '';
    },
    filterBtnOnClick() {
      // 获取时间
      if (Array.isArray(this.searchConditionCreateTime) && this.searchConditionCreateTime.length > 0) {
        this.searchConditionData.createStartTime = this.searchConditionCreateTime[0];
        this.searchConditionData.createEndTime = this.searchConditionCreateTime[1];
      }
      else {
        this.searchConditionData.createStartTime = '';
        this.searchConditionData.createEndTime = '';
      }
      if (Array.isArray(this.searchConditionUpdateTime) && this.searchConditionUpdateTime.length > 0) {
        this.searchConditionData.updateStartTime = this.searchConditionUpdateTime[0];
        this.searchConditionData.updateEndTime = this.searchConditionUpdateTime[1];
      }
      else {
        this.searchConditionData.updateStartTime = '';
        this.searchConditionData.updateEndTime = '';
      }
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
    },
    createColumnBtnOnClick() {
      this.columnEditData.dialogShow = true;
      this.columnEditData.newDialog = true;
    },
    closeDialogHandle(neeUpdate) {
      this.columnEditData.dialogShow = false;
      if (neeUpdate === true) this.getDataList();
    },
    tableEditBtnOnClick(row) {
      if (row.columnType === 4) {
        this.tableDetailBtnOnClick(row);
      }
      else {
        this.columnEditData.dialogShow = true;
        this.columnEditData.newDialog = false;
        this.columnEditData.columnData = row;
      }
    },
    tableValidBtnOnClick(row) {
      let content = '';
      if (row.isValid === 1) {
        content = '确定在首页展示上移除此栏目么？确定后，此栏目将不再显示在首页。';
      }
      else {
        content = '确定在首页展示上添加此栏目么？确定后，此栏目将显示在首页。';
      }
      this.$allin_confirm({
        title: '提示',
        content: content,
        done: () => {
          this.updateColumnStatus(row);
        }
      });
    },
    tableDetailBtnOnClick(row) {
      if (row.columnType === 5) {
        window.open('//manager.allinmd.cn/allin_manager_platform/mallBackControlAction!login_index', '_blank');
      }
      else {
        let routerName = null;
        if (row.columnType === 1) {
          routerName = 'courseTypeColumn';
        }
        else if (row.columnType === 2) {
          routerName = 'videoTypeColumn';
        }
        else if (row.columnType === 3) {
          routerName = 'liveTypeColumn';
        }
        else if (row.columnType === 4) {
          if (row.columnId === 1563551999999) {
            routerName = 'wphManage';
          }
          else {
            routerName = 'activityColumn';
          }
        }

        if (routerName) {
          const {href} = this.$router.resolve({
            name: routerName,
            query: {
              columnId: row.columnId,
              columnName: row.columnName
            }
          });
          window.open(href, '_blank');
        }
      }
    },
    tableIndexBtnOnClick() {
      // 首页操作按钮点击处理事件
      let routeData = this.$router.resolve({
        name: 'columnSort'
      });
      console.log(routeData);

      window.open('#/indexColumn', '_blank');
    },
    formatterStatus(row, column) {
      // 栏目状态格式化
      return row.isValid === 0 ? '已下架' : '已上架';
    },
    formatterColumnType(row, column) {
      // 栏目分类格式化
      let _columnType = '';
      switch (row.columnType) {
        case 1 :
          _columnType = '课程聚合';
          break;
        case 2:
          _columnType = '视频聚合';
          break;
        case 3:
          _columnType = '直播聚合';
          break;
        case 4:
          _columnType = '活动';
          break;
        case 5:
          _columnType = '骨科会议';
          break;
        default:
          break;
      }
      return _columnType;
    },
    formatterDate(...rest) {
      return rest[2].substring(0, rest[2].length - 2);
    },
    checkCanEdit(row) {
      // 校验当前数据是否可以被编辑
      // 骨科会议本质上不属于栏目，无法编辑，点击查看内容，跳转到会议的管理老后台
      if (row.columnType === 5) return false;
      return true;
    }

  },
  mounted() {
    // 初始化获取数据
    this.getDataList();
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.columnEditData.dialogShow) {
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
