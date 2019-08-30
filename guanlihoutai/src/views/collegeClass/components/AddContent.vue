<template>
  <section class="addContent-checkBox">
    <el-dialog
      title="添加内容"
      width="1000px"
      :visible.sync="dialogVisible"
      @close="handleClose"
    >
      <div class="add-from-content">
        <el-input
          placeholder="内容名称/内容ID"
          class="content-input"
          v-model="tableParams.courseNameOrId"
        ></el-input>
        <span class="search-button" @click="searchSub">查询</span>
      </div>
      <el-table
        ref="multipleTable"
        :data="proListDatas"
        style="width: 90%;margin-left: 50px"
      >
        <!--展示数据时显示-->
        <el-table-column
          label="选择"
          width="50"
        >
          <template slot-scope="scope">
            <el-checkbox
              v-model="templateRadio"
              :label="JSON.stringify(scope.row)"
              :checked="checkedDefault(scope.row)"
              @change="checkChange(scope.row,$event)"
            >&nbsp;
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="内容名称"
          width="300"
        >
        </el-table-column>
        <el-table-column
          prop="coursePriceElement"
          label="售价"
          :formatter="coursePriceFor"
        >
        </el-table-column>
        <el-table-column
          prop="courseTeacherVOList"
          label="作者"
          :formatter="teacherFor"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="上架类型"
          :formatter="fromCourseType"
        >
        </el-table-column>
        <el-table-column
          prop="courseState"
          label="课程状态"
          :formatter="courseStateFor"
        >
        </el-table-column>
        <el-table-column
          label="视频数"
          :formatter="fromTotalNum"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin: 20px 0 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper, sizes"
        :total="total" v-if="total>10">
      </el-pagination>
      <div class="select-content">
        <div class="search-button" @click="addContent">确定</div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
export default {
  props: {
    defaultData: {
      type: String
    }
  },
  data() {
    return {
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 10, // 分页参数10
        courseNameOrId: ''
      },
      dialogVisible: true,
      proListDatas: [],
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 10, // 每页条数
      total: 0, // 总数
      templateRadio: []
    };
  },
  methods: {
    checkedDefault(item) {
      // return true;
      // let defaultData=JSON.parse(this.defaultData);
      // for (let i=0;i< defaultData.length;i++){
      //   if(item.id===defaultData[i].id){
      //     return true;
      //   }
      // }
    },
    checkChange(item, e) {
      // if(!e){
      //   for (let i=0;i< this.templateRadio.length;i++){
      //     if(item.id===this.templateRadio[i].id){
      //       this.templateRadio.splice(i,1)
      //       return false;
      //     }
      //   }
      // }
    },
    // 上架类型
    fromCourseType(val) {
      if (val.courseType === 1) {
        return '预告';
      }
      else {
        return '售卖';
      }
    },
    // 课程状态
    courseStateFor(val) {
      if (val.courseState === 1) {
        return '已上架';
      }
      else {
        return '已下架';
      }
    },
    fromTotalNum(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        return val.totalNum + ' 讲';
      }
    },
    addContent() {
      if (this.templateRadio.length) {
        this.$emit('addContent', this.templateRadio);
      }
      else {
        // this.$emit('closeDalog', false);
        this.$message('请选择一条的数据');
      }
    },
    handleClose(done) {
      this.$emit('closeDalog', false);
    },
    // 搜索商品
    searchSub() {
      this.tableParams.firstResult = 0;
      this.currentPage = 1;
      this.templateRadio = [];
      this.addPointFn();
    },
    // 添加内容获取商品列表
    addPointFn() {
      let _this = this, param = {
        firstResult: this.tableParams.firstResult,
        maxResult: this.tableParams.maxResult,
        themeId: 0,
        courseState: 1,
        courseNameOrId: this.tableParams.courseNameOrId,
        isHaveCustomerName: true
      };
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getCoursesList.type,
        url: apiConfig.getCoursesList.url,
        params: param
      }).then((res) => {
        comm.closeLoading();
        // 初始化列表和总数
        _this.proListDatas = [];
        _this.total = 0;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseStatus) {
          if (res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length > 0) {
            _this.proListDatas = res.data.responseObject.responseData.dataList;
            _this.total = res.data.responseObject.responseData.totalCount;
          }
        }
        else {
          // _this.$message.error('数据获取失败，请重试！');
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('获取数据失败：', e);
      });
    },
    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = this.pageSize;

      this.tableParams.firstResult = 0;
      this.currentPage = 0;
      // this.templateRadio = [];
      this.addPointFn();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (this.currentPage - 1) * this.pageSize;
      // this.templateRadio = [];
      this.addPointFn();
    },
    // 课程售价
    coursePriceFor(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        if (val.coursePriceElementStr) {
          return '￥' + val.coursePriceElementStr;
        }
      }
    },
    // 讲师
    teacherFor(val) {
      if (val.courseType === 1) {
        return '-';
      }
      else {
        if (val.courseTeacherVOList.length > 0) {
          if (val.courseTeacherVOList.length < 2) {
            return val.courseTeacherVOList[0].customerName;
          }
          else if (val.courseTeacherVOList.length === 2) {
            return val.courseTeacherVOList[0].customerName + ',' + val.courseTeacherVOList[1].customerName;
          }
          else if (val.courseTeacherVOList.length >= 2) {
            return val.courseTeacherVOList[0].customerName + ',' + val.courseTeacherVOList[1].customerName + '等';
          }
          else {
            return '-';
          }
        }
        else {
          return '-';
        }
      }
    }
  },
  mounted() {
    this.addPointFn();
  }
};
</script>

<style  lang="scss">
  .addContent-checkBox{
    .add-from-content{
      margin-bottom: 20px;
      .content-input{
        width: 300px;
        margin-left: 50px;
      }
    }
    .search-button{
      width: 100px;
      height: 32px;
      background: #3846dc;
      border-radius: 3px;
      line-height: 32px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-left: 30px;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
    }
    .select-content{
      margin: 20px 0;
      padding-left: 50px;
      text-align: center;
      .choosed-text{
        display: inline-block;
        width: 656px;
        span{
          width: 656px;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          white-space: nowrap;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
  }
</style>
