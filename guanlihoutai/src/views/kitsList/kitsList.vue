<template>
  <section class="crm-kitsListContainer">
    <!--title标志开始-->
    <aside class="crm-kitsTitleContainer">
      <p class="crm-kitsTitle">锦囊管理后台</p>
    </aside>
    <!--title标志结束-->
    <!--新建锦囊按钮,筛选区域开始-->
    <router-link to="kitsEdit"><button class="crm-newBtn  el-icon-circle-plus">新建锦囊</button></router-link>
    <!--新建锦囊按钮,筛选区域开始结束-->
    <!--锦囊列表页面样式开始-->
    <aside class="crm-kitsList ev-kitsList">
      <aside class="crm-Profess">
        <span>专科</span>
        <el-select class="ev-select ev-selectMore"
          v-model="proArr"
          multiple
          collapse-tags
          placeholder="全部">
          <el-option
            v-for="item in proListArr"
            :key="item.id"
            :label="item.tagName"
            :value="item.id">
          </el-option>
        </el-select>
        <span>状态</span>
        <el-select class="ev-select" v-model="statusId" placeholder="请选择">
          <el-option
            v-for="item in statusArr"
            :key="item.id"
            :label="item.statusName"
            :value="item.id">
          </el-option>
        </el-select>
      </aside>
      <el-table
        :data="listDataArr"
        width="100%"
        class="ev-table"
        :default-sort = "{prop: 'recDate', order: 'descending'}"
        @sort-change="sortIdChange"
        ref="sortReset"
      >
        <el-table-column
          prop="sortNum"
          label="锦囊排序"
          width="90"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="areaId"
          width="75"
          label="专科ID"
        >
        </el-table-column>
        <el-table-column
          prop="proName"
          width="81"
          label="专科"
        >
        </el-table-column>
        <el-table-column
          prop="kitsId"
          label="锦囊ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="kitsName"
          label="锦囊名"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="quesNum"
          width="90"
          label="问题总数"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="ansNum"
          label="答案总数"
          width="90"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
     <!--   <el-table-column
          prop="pepFeedBack"
          label="用户反馈"
          width="102"
        >
        </el-table-column>-->
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="recDate"
          label="最近编辑时间"
          width="120"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="40"
        >
        </el-table-column>
        <el-table-column
          width="20"
        >
        </el-table-column>
        <el-table-column
          width="20"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="173"
        >
          <template slot-scope="scope">
            <el-button  size="medium" @click="editJump(scope.row)">编辑</el-button>
            <el-button  size="medium" @click="searchJump(scope.row)">召出词</el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="10"
        >
        </el-table-column>
      </el-table>
    </aside>
    <!--锦囊列表页面样式结束-->
    <!--列表分页开始-->
    <div class="block ev-pages">
      <el-pagination
        class="al-bs-pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30,50,100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount" v-if="totalCount!=0">
      </el-pagination>
    </div>
    <!--列表分页结束-->
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'kitsList',
  data() {
    return {
      currentPage: 1, // 排序页码(分页组件)
      pageSize: 30, // 每页几条(分页组件)
      totalCount: 0, // 总数(分页组件依赖数据总数)
      maxResult: 30, // 接口请求中的分页参数
      firstResult: 0, // 接口请求中的分页参数
      sortId: '1', // 排序参数（默认传1-修改时间降序2-修改时间升序3主键降序4主键升序5问题数降序6问题数升序7答案数降序8答案数升序）
      proArr: [], // 专科多选的数组数据存储（选中的）
      proIdList: '', // 专科选中的id
      statusId: '1', // 选中的状态id
      statusArr: [{id: '', statusName: '全部'}, {id: '1', statusName: '上架'}, {id: '0', statusName: '下架'}], // 筛选状态的数组
      proListArr: [], // 专科列表数据铺设
      listDataArr: []// 列表数据
    };
  },
  methods: {
    // 编辑跳转
    editJump(row) {
      let t = this;
      t.$router.push({path: 'kitsQuestionList', query: {bId: row.brochureId}});// 类似get传参，通过URL传递参数
    },
    // 召出词跳转
    searchJump(row) {
      let t = this;
      t.$router.push({path: 'wakeUpEdit', query: {bId: row.brochureId}});// 类似get传参，通过URL传递参数
    },
    // 检测排序id变化
    sortIdChange(column) {
      let t = this;
      let _or = column.order;
      // 默认传1-修改时间降序2-修改时间升序3主键降序4主键升序5问题数降序6问题数升序7答案数降序8答案数升序
      switch (column.prop) {
        case 'sortNum':// 锦囊排序
          t.sortId = (_or === 'descending') ? '3' : '4';// 降序，反之升序
          break;
        case 'quesNum':// 问题总数排序
          t.sortId = (_or === 'descending') ? '5' : '6';// 降序，反之升序
          break;
        case 'ansNum':// 答案排序
          t.sortId = (_or === 'descending') ? '7' : '8';// 降序，反之升序
          break;
        case 'recDate':// 最近编辑时间排序
          t.sortId = (_or === 'descending') ? '1' : '2';// 降序，反之升序
          break;
      }
    },
    // 每页多少条数据
    handleSizeChange(val) {
      let t = this;
      t.pageSize = val;// 每页多少条
      t.currentPage = 1;// 每页多少条更改返回首页
      t.firstResult = 0;// 当前传参
      t.maxResult = t.currentPage * val;// 当前页最多
      // 分页参数变化重新请求列表接口
      t.dataMainList();
    },
    // 当前页面页码
    handleCurrentChange(val) {
      let t = this;
      t.currentPage = val;// 当前页码
      t.firstResult = (val - 1) * t.pageSize;// 当前传参
      // 分页参数变化重新请求列表接口
      t.dataMainList();
    },
    // 专科请求列表
    professList() {
      let t = this;
      axios({
        method: apiConfig.professList.type,
        url: apiConfig.professList.url,
        params: {
          firstResult: 0,
          maxResult: 99,
          treeLevel: 2,
          platformId: 1,
          isValid: 1
        }
      }).then((res) => {
        if (res && comm.hasResponseData(res.data)) {
          t.proListArr = res.data.responseObject.responseData.data_list;// 对专科列表赋值
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 数据列表接口
    dataMainList() {
      let t = this;
      comm.openLoading('加载中...');
      let param = {
        firstResult: t.firstResult,
        maxResult: t.maxResult
      };
      param.sortType = t.sortId ? t.sortId : undefined;
      param.areasExpertiseIdList = t.proIdList ? t.proIdList.substr(0, t.proIdList.length - 1) : undefined;
      param.isValid = t.statusId ? t.statusId : undefined;
      axios({
        method: apiConfig.kitsListUrl.type,
        url: apiConfig.kitsListUrl.url,
        params: param
      }).then((res) => {
        comm.closeLoading();
        t.listDataArr = [];
        if (res && res.data) {
          let items = res.data.responseObject;
          t.totalCount = items.totalCount;
          if (items.items && items.items.length) {
            for (let i = 0; i < items.items.length; i++) {
              let kv = items.items[i];
              let _json = {
                sortNum: kv.sortId, // 锦囊排序
                proName: t.proNameShow(kv.areasExpertiseId), // kv.areasExpertiseId,//专科
                kitsName: kv.brochureName, // 锦囊名
                quesNum: kv.questionNum, // 问题数
                ansNum: kv.answerNum, // 答案数
                // pepFeedBack: kv.suggestNum,//用户反馈
                createDate: kv.createTime.substr(0, 19), // 创建时间
                recDate: kv.updateTime.substr(0, 19), // 最近更改时间
                status: kv.isValid === 1 ? '上架' : '下架', // 状态
                opBtn: '编辑', // 编辑操作
                brochureId: kv.brochureId, // 锦囊id
                areaId: kv.areasExpertiseId, // 专科id20181102增加需求修改
                kitsId: kv.brochureId// 锦囊id20181102增加需求修改
              };
              t.listDataArr.push(_json);
            }
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 列表里的专科展示
    proNameShow(num) {
      let t = this;
      let str = '';
      for (let i = 0; i < t.proListArr.length; i++) {
        if (num === t.proListArr[i].id) {
          str = t.proListArr[i].tagName;
        }
      }
      return str;
    }
  },
  mounted() {
    let t = this;
    t.professList();// 专科请求列表
    t.dataMainList();// 数据主列表请求接口
  },
  watch: {
    // 检测排序id变化，发送筛选请求
    sortId() {
      let t = this;
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
      if (t.listDataArr.length > 0) {
        // 发送请求的列表函数
        t.dataMainList();
      }
    },
    // 检测筛选状态id变化，发送筛选请求
    statusId() {
      let t = this;
      t.sortId = '1';// 筛选项条件变化，排序回归默认，
      t.$refs.sortReset.clearSort();// 清空排序
      t.$refs.sortReset.sort('recDate', 'descending');// 设置默认排序
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
      // 发送请求的列表函数
      t.dataMainList();
    },
    // 检测筛选专科id变化，发送筛选请求
    proArr() {
      let t = this;
      t.sortId = '1';// 筛选项条件变化，排序回归默认，
      t.$refs.sortReset.clearSort();// 清空排序
      t.$refs.sortReset.sort('recDate', 'descending');// 设置默认排序
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
      t.proIdList = '';
      for (let i = 0; i < t.proArr.length; i++) {
        t.proIdList += t.proArr[i] + ',';
      }
      // 发送请求的列表函数
      t.dataMainList();
    }
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>

<style lang="scss">
  @import "../../assets/scss/pages/kitsList/kitsList";
  .ev-kitsList .el-table td{
    &:nth-child(8), &:nth-child(9){
      .cell{
        width: 90px;
      }
    }
  }
</style>
