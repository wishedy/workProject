<template>
  <section class="column-manager-main-container">
    <h3>课程管理</h3>
    <section class="column-manager-search-area">
      <el-form label-width="120px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="课程ID">
              <el-input placeholder="输入课程ID" v-model="searchConditionData.courseId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="课程名称">
              <el-input placeholder="输入课程名称" v-model="searchConditionData.courseNameLike"></el-input>
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
          <el-col :span="9">
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
          <el-col :span="6">
            <el-form-item label="专业">
              <el-select
                placeholder="不限"
                v-model="searchConditionData.areasExpertiseId">
                <el-option label="不限" value=""></el-option>
                <el-option v-for="item in profession"
                           :key="item.id"
                           :value="item.id"
                           :label="item.name"
                ></el-option>
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
          <el-button @click="createCourseBtnOnClick"><span class="el-icon-circle-plus"></span>新增课程</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="column-manager-table">
      <el-table
        :data="tableData"
        :fit="true"
        style="width: 100%">
        <el-table-column
          prop="courseId"
          width="140"
          label="课程ID">
        </el-table-column>
        <el-table-column
          prop="courseName"
          width="180"
          label="课程名称">
        </el-table-column>
        <el-table-column
          prop="customerIdList"
          width="135"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="customerNameList"
          width="120"
          label="用户名字">
        </el-table-column>
        <el-table-column
          prop="sortId"
          label="排序">
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
          :formatter="formatterAreasExpertise"
          prop="areasExpertiseId"
          label="所属专业">
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
        <el-table-column label="操作" width="300" fixed="right">
          <template slot-scope="scope">
            <el-button @keydown.native.prevent @click="tableEditBtnOnClick(scope.row)">编辑</el-button>
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
    <courseTypeColumnDialog
      :dialogShow="editDialogData.dialogShow"
      :dialogData="editDialogData.dialogData"
      :newDialog="editDialogData.newDialog"
      :profession="profession"
      @closeDialog="closeDialogHandle"
    ></courseTypeColumnDialog>
  </section>
</template>

<script>
/*
  * 课程型栏目
  */
import courseTypeColumnDialog from '@/views/columnManager/components/courseTypeColumnDialog.vue';
import comm from '@/assets/js/utils/comm.js';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';

export default {
  name: 'courseTypeColumn',
  components: {
    courseTypeColumnDialog
  },
  data() {
    return {
      columnName: this.$route.query.columnName,
      columnId: this.$route.query.columnId,
      tableData: [],
      searchConditionData: {
        courseId: '',
        courseNameLike: '',
        createStartTime: '',
        createEndTime: '',
        isValid: '',
        updateStartTime: '',
        updateEndTime: '',
        areasExpertiseId: ''
      },
      profession: [], // 专业筛选项下拉数据，id-专业id ,name-专业tagName
      searchConditionCreateTime: '',
      searchConditionUpdateTime: '',
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
        dialogData: {}
      }
    };
  },
  methods: {
    getAreasExpertiseData() {
      // 专业选项由接口获取，改为固定 (2018.10.16 09.45)
      const areasExpertise = [{id: 2, tagName: '关节'}, {id: 7, tagName: '脊柱'}, {id: 9, tagName: '创伤'}, {
        id: 8,
        tagName: '运动医学'
      }];
      let option;
      for (let i = 0; i < areasExpertise.length; i++) {
        option = {};
        option.id = areasExpertise[i].id;
        option.name = areasExpertise[i].tagName;
        this.profession.push(option);
      }
    },
    getDataList() {
      // 获取数据列表
      this.paginationData.maxResult = this.paginationData.pageSize;
      this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;
      let data = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        sortType: 1,
        columnId: this.columnId
      };

      for (let key in this.searchConditionData) {
        if (this.searchConditionData[key]) {
          data[key] = this.searchConditionData[key];
        }
      }
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCourseTableList.type,
        url: apiUrlConfig.getCourseTableList.url,
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
        console.log('课程型栏目后台数据请求异常：' + err);
      });
    },
    updateColumnStatus(row) {
      let tipTitle = '';
      if (row.isValid === 1) tipTitle = '课程下架';
      else tipTitle = '课程上架';
      // 添加loading
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.updateCourseValid.type,
        url: apiUrlConfig.updateCourseValid.url,
        data: {
          columnId: this.columnId,
          courseId: row.courseId,
          isValid: row.isValid === 1 ? 0 : 1
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
      if (Array.isArray(this.searchConditionUpdateTime) && this.searchConditionUpdateTime.length > 0) {
        this.searchConditionData.updateStartTime = this.searchConditionUpdateTime[0];
        this.searchConditionData.updateEndTime = this.searchConditionUpdateTime[1];
      }
      // 设置分页数据
      this.paginationData.currentPage = 1;
      this.paginationData.firstResult = 0;
      this.getDataList();
    },
    createCourseBtnOnClick() {
      this.editDialogData.dialogShow = true;
      this.editDialogData.newDialog = true;
    },
    closeDialogHandle(neeUpdate) {
      this.editDialogData.dialogShow = false;
      if (neeUpdate === true) {
        this.getDataList();
      }
    },
    tableEditBtnOnClick(row) {
      this.editDialogData.dialogShow = true;
      this.editDialogData.newDialog = false;
      this.editDialogData.dialogData = row;
    },
    tableValidBtnOnClick(row) {
      const content = row.isValid ? '确定将此课程下架吗？' : '确定将此课程上架吗？';
      this.$allin_confirm({
        title: '提示',
        content: content,
        done: () => {
          this.updateColumnStatus(row);
        }
      });
    },
    tableDetailBtnOnClick(row) {
      const {href} = this.$router.resolve({
        name: 'courseTypeVideoSelect',
        query: {
          columnId: this.columnId,
          courseId: row.courseId,
          courseName: row.courseName
        }
      });
      window.open(href, '_blank');
    },
    formatterStatus(...args) {
      // 栏目状态格式化
      return args[2] === 0 ? '已下架' : '已上架';
    },
    formatterAreasExpertise(row) {
      let rst = '';
      let areasExpertise = this.profession;
      if (areasExpertise) {
        for (let i = 0; i < areasExpertise.length; i++) {
          if (parseInt(row.areasExpertiseId) === parseInt(areasExpertise[i].id)) {
            rst = areasExpertise[i].name;
            break;
          }
        }
      }
      return rst;
    },
    formatterDate(...rest) {
      return rest[2].substring(0, rest[2].length - 2);
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.editDialogData.dialogShow) {
          this.getDataList();
        }
      }
    };
  },
  created() {
    // 获取专业数据
    this.getAreasExpertiseData();
    // 初始化获取数据
    this.getDataList();
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>

<style scoped>

</style>
<style lang="scss">
  @import "./components/scss/columnBase";
</style>
