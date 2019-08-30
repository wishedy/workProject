<template>
  <section class="crm-kitsListContainer">
    <!--title标志开始-->
    <aside class="crm-kitsTitleContainer">
      <p class="crm-kitsTitle queListTitle">锦囊管理后台</p>
      <p class="crm-kitsSubTitle">锦囊问题列表页</p>
    </aside>
    <!--title标志结束-->

    <el-container class="container">
      <el-container class="wrapper">
        <div class="block  al-bs-des">
          <p class="dot" v-if="dataInfoBox.brochureName"></p>
          <p class="des-content">
            <span class="title">
              <i>{{dataInfoBox.brochureName}}</i>
              <i class="special" v-if="dataInfoBox.tagName">{{dataInfoBox.tagName?'('+dataInfoBox.tagName+')':''}}</i>
              <i class="state" v-if="dataInfoBox.isValid">{{dataInfoBox.isValid==1?'上架':'下架'}}</i>
            </span>
            <span class="produce">
             {{dataInfoBox.brochureDesc? '说明：'+dataInfoBox.brochureDesc:''}}
            </span>
          </p>
        </div>
        <router-link :to="{path:'kitsEdit',query:{id:dataInfoBox.id,bId:dataInfoBox.brochureId}}"><div class="editBtn">去编辑</div></router-link>
      </el-container>
    </el-container>

    <!--新建锦囊按钮,筛选区域开始-->
    <router-link :to="{path:'questionEdit',query:{bId:bId}}"><button class="crm-newBtn el-icon-circle-plus">添加问题</button></router-link>
    <!--新建锦囊按钮,筛选区域开始结束-->

    <!--锦囊列表页面样式开始-->
    <aside class="crm-kitsList">
      <aside class="crm-Profess">
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
        class="ev-table ev-kitsQue"
        :default-sort = "{prop: 'sortNum', order: 'descending'}"
        @sort-change="sortIdChange"
        ref="sortReset"
      >
        <el-table-column
          prop="sortNum"
          label="问题排序"
          width="115"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="qusId"
          label="问题ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="qusName"
          label="问题名称"
          width="144"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="创建时间"
          width="183"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="recDate"
          label="最近编辑时间"
          width="194"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="239"
        >
        </el-table-column>
        <el-table-column
          width="30"
        >
        </el-table-column>
        <el-table-column
          width="30"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button  size="medium" @click="editJump(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          width="24"
        >
        </el-table-column>
      </el-table>
    </aside>
    <!--锦囊列表页面样式结束-->
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
      bId: '', // 锦囊id
      sortId: '5', // 排序（1-创建时间降序2-创建时间升序3-修改时间降序4-修改时间升序5-问题降序6-问题升序7主键降序8主键升序）
      dataInfoBox: '', // 锦囊详情页面
      dataInfoPName: '', // 专科名字
      currentPage: 1, // 排序页码(分页组件)
      pageSize: 30, // 每页几条(分页组件)
      totalCount: 0, // 总数(分页组件依赖数据总数)
      maxResult: 30, // 接口请求中的分页参数
      firstResult: 0, // 接口请求中的分页参数
      statusId: '1', // 选中的状态id
      statusArr: [{id: '', statusName: '全部'}, {id: '1', statusName: '上架'}, {id: '0', statusName: '下架'}], // 筛选状态的数组
      listDataArr: []
    };
  },
  methods: {
    // 编辑跳转
    editJump(row) {
      let t = this;
      t.$router.push({path: 'questionInfo', query: {bId: row.brochureId, qId: row.questionId}});// 类似get传参，通过URL传递参数
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
    // 检测排序id变化
    sortIdChange(column) {
      let t = this;
      let _or = column.order;
      // 排序（1-创建时间降序2-创建时间升序3-修改时间降序4-修改时间升序5-问题降序6-问题升序7主键降序8主键升序）
      switch (column.prop) {
        case 'sortNum':// 问题排序
          t.sortId = (_or === 'descending') ? '5' : '6';// 降序，反之升序
          break;
        case 'createDate':// 创建时间排序
          t.sortId = (_or === 'descending') ? '1' : '2';// 降序，反之升序
          break;
        case 'recDate':// 最近编辑时间排序
          t.sortId = (_or === 'descending') ? '3' : '4';// 降序，反之升序
          break;
      }
    },
    // 锦囊详情信息
    dataInfo() {
      let t = this;
      axios({
        method: apiConfig.kitsInfo.type,
        url: apiConfig.kitsInfo.url,
        params: {
          brochureId: t.bId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          t.dataInfoBox = res.data.responseObject.responseData.dataList[0];// 对主列表数组赋值
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
        brochureId: t.bId,
        sortType: t.sortId,
        firstResult: t.firstResult,
        maxResult: t.maxResult
      };
      param.isValid = t.statusId !== '' ? t.statusId : undefined;// 0下架 1上架
      axios({
        method: apiConfig.kitsQueList.type,
        url: apiConfig.kitsQueList.url,
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
                qusName: kv.questionName, // 问题数
                createDate: kv.createTime.substr(0, 19), // 创建时间
                recDate: kv.updateTime.substr(0, 19), // 最近更改时间
                status: kv.isValid === 1 ? '上架' : '下架', // 状态
                opBtn: '编辑', // 编辑操作
                brochureId: kv.brochureId, // 锦囊id
                questionId: kv.questionId, // 问题id
                id: kv.id, // 列表的id
                qusId: kv.questionId// 问题id  20181102增加需求
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
    }
  },
  mounted() {
    let t = this;
    if (t.$route.query.bId) { // 如果是来自编辑页面
      t.bId = t.$route.query.bId;
      // t.professList();//请求专科列表
      t.dataInfo();// 锦囊详情信息
      t.dataMainList();// 数据主列表请求接口
    }
    else { // 如果没有锦囊id跳转回首页
      if (window.history.length <= 1) {
        t.$router.push({path: '/'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    }
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
      t.sortId = '5';// 筛选项条件变化，排序回归默认，
      t.$refs.sortReset.clearSort();// 清空排序
      t.$refs.sortReset.sort('sortNum', 'descending');// 设置默认排序
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
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
</style>
