<template>
  <section class="crm-kitsListContainer ev-quesInfo">
    <!--title标志开始-->
    <aside class="crm-kitsTitleContainer">
      <p class="crm-kitsTitle queListTitle">锦囊管理后台</p>
      <p class="crm-kitsSubTitle">问题详情页</p>
    </aside>
    <!--title标志结束-->

    <el-container class="container">
      <el-container class="wrapper">
        <div class="block  al-bs-des">
          <p class="dot"></p>
          <p class="des-content">
            <span class="title">
              <i>{{dataInfoBox.questionName?dataInfoBox.questionName:''}}</i>
              <i class="state">{{dataInfoBox.isValid==1?'上架':'下架'}}</i>
            </span>
            <span class="produce">
              {{brochureName?'锦囊名：'+brochureName:''}}
            </span>
          </p>
        </div>
        <router-link :to="{path:'questionEdit',query:{id:dataInfoBox.id,bId:dataInfoBox.brochureId,qId:dataInfoBox.questionId}}"><div class="editBtn">去编辑</div></router-link>
      </el-container>
    </el-container>

    <!--新建锦囊按钮,筛选区域开始-->
    <router-link :to="{path:'replyEdit',query:{bId:bId,qId:qId}}"><button class="crm-newBtn el-icon-circle-plus">添加回复</button></router-link>
    <!--新建锦囊按钮,筛选区域开始结束-->

    <!--锦囊列表页面样式开始-->
    <aside class="crm-kitsList">
      <aside class="crm-Profess">
        <span>引用类型</span>
        <el-select class="ev-select"  v-model="citeType" placeholder="请选择">
          <el-option
            v-for="item in citeTypeArr"
            :key="item.id"
            :label="item.typeName"
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
        class="ev-table ev-queInfo"
        :default-sort = "{prop: 'recDate', order: 'descending'}"
        @sort-change="sortIdChange"
        ref="sortReset"
      >
        <el-table-column
          prop="sortNum"
          label="回复排序"
          width="115"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="multimedia"
          label="多媒体"
          width="88"
        >
        </el-table-column>
          <el-table-column
            prop="type"
            label="引用类型"
            width="102"
          >
          </el-table-column>
        <el-table-column
          prop="proName"
          label="资源名称"
          width="130"
        >
        </el-table-column>
          <el-table-column
            prop="teacherName"
            label="资源讲师"
            width="102"
          >
          </el-table-column>
        <el-table-column
          prop="preferNum"
          label="认可数"
          width="88"
        >
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="回复时间"
          width="132"
        >
        </el-table-column>
        <el-table-column
          prop="recDate"
          label="最近编辑时间"
          width="143"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          width="105"
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
      brochureName: '', // 锦囊名字
      bId: '', // 锦囊id
      qId: '', // 问题id
      dataInfoBox: '', // 问题详情
      currentPage: 1, // 排序页码(分页组件)
      pageSize: 30, // 每页几条(分页组件)
      totalCount: 0, // 总数(分页组件依赖数据总数)
      maxResult: 30, // 接口请求中的分页参数
      firstResult: 0, // 接口请求中的分页参数
      sortId: '4', // 排序id默认最近编辑时间 1-按回复顺序，2-按回复逆序，3-按编辑时间顺序，4-按编辑时间逆序
      citeType: '', // 引用类型的type
      citeTypeArr: [{id: '', typeName: '全部'}, {id: '1', typeName: '视频'}, {id: '2', typeName: '文库'}, {id: '7', typeName: '病例'}], // 引用类型的枚举值数组
      statusId: '1', // 选中的状态id
      statusArr: [{id: '', statusName: '全部'}, {id: '1', statusName: '上架'}, {id: '0', statusName: '下架'}], // 筛选状态的数组
      listDataArr: []
    };
  },
  methods: {
    // 编辑跳转
    editJump(row) {
      let t = this;
      t.$router.push({path: 'replyEdit', query: {id: row.id, bId: row.brochureId, qId: row.questionId, aId: row.answerId}});// 类似get传参，通过URL传递参数
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
      // 1-按回复顺序，2-按回复逆序，3-按编辑时间顺序，4-按编辑时间逆序
      switch (column.prop) {
        case 'sortNum':// 回复排序
          t.sortId = (_or === 'descending') ? 2 : 1;// 降序，反之升序
          break;
        case 'recDate':// 最近编辑时间排序
          t.sortId = (_or === 'descending') ? 4 : 3;// 降序，反之升序
          break;
      }
    },
    // 问题详情信息
    dataInfo() {
      let t = this;
      axios({
        method: apiConfig.getQueInfo.type,
        url: apiConfig.getQueInfo.url,
        params: {
          brochureId: t.bId,
          questionId: t.qId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          t.dataInfoBox = res.data.responseObject.responseData.dataList;// 对主列表数组赋值
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取锦囊信息接口
    getInfo() {
      let t = this;
      axios({
        method: apiConfig.kitsInfo.type,
        url: apiConfig.kitsInfo.url,
        params: {
          brochureId: t.bId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList[0];
          t.brochureName = kv.brochureName;// 锦囊名字
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
        questionId: t.qId,
        sortType: t.sortId,
        firstResult: t.firstResult,
        maxResult: t.maxResult
      };
      param.resourceType = t.citeType !== '' ? t.citeType : undefined;// 引用类型
      param.isValid = t.statusId !== '' ? t.statusId : undefined;// 0下架 1上架
      axios({
        method: apiConfig.getAnswerList.type,
        url: apiConfig.getAnswerList.url,
        params: param
      }).then((res) => {
        comm.closeLoading();
        t.listDataArr = [];
        if (res && res.data && comm.hasResponseData(res.data)) {
          let items = res.data.responseObject;
          t.totalCount = items.responseData.totalCount;
          if (items.responseData.dataList && items.responseData.dataList.length) {
            for (let i = 0; i < items.responseData.dataList.length; i++) {
              let kv = items.responseData.dataList[i];
              let _json = {
                sortNum: kv.sortId, // 锦囊排序
                multimedia: t.multiText(kv.attType), // 多媒体类型
                type: t.refTypeText(kv.refType), // 引用类型
                proName: kv.refName, // 资源名称
                teacherName: kv.authorName.split(',').length > 1 ? kv.authorName.split(',')[0] + '等人' : kv.authorName, // 资源讲师
                preferNum: kv.preferNum, // 认可数
                createDate: kv.createTime.substr(0, 19), // 回复时间
                recDate: kv.updateTime.substr(0, 19), // 最近更改时间
                status: kv.isValid === 1 ? '上架' : '下架', // 状态
                opBtn: '编辑', // 编辑操作
                brochureId: kv.brochureId, // 锦囊id
                questionId: kv.questionId, // 问题id
                answerId: kv.answerId, // 回复id
                id: kv.id// 列表的id
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
    // 多媒体类型转换
    multiText(num) {
      let str = '';
      switch (parseInt(num)) {
        case 0:
          str = '无';
          break;
        case 1:
          str = '图片';
          break;
        case 2:
          str = '视频';
          break;
      }
      return str;
    },
    // 引用类型转换
    refTypeText(num) {
      let str = '';
      switch (parseInt(num)) {
        case 1:
          str = '视频';
          break;
        case 2:
          str = '文库';
          break;
        case 7:
          str = '病例';
          break;
      }
      return str;
    }
  },
  mounted() {
    let t = this;
    if (t.$route.query.bId && t.$route.query.qId) { // 如果有相关id
      t.bId = t.$route.query.bId;
      t.qId = t.$route.query.qId;
      t.getInfo();// 获取锦囊相关信息
      t.dataInfo();// 获取问题详情信息
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
      t.sortId = '4';// 筛选项条件变化，排序回归默认，
      t.$refs.sortReset.clearSort();// 清空排序
      t.$refs.sortReset.sort('recDate', 'descending');// 设置默认排序
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
      // 发送请求的列表函数
      t.dataMainList();// 数据主列表请求接口
    },
    // 检测筛选引用类型选项变化
    citeType() {
      let t = this;
      t.sortId = '4';// 筛选项条件变化，排序回归默认，
      t.$refs.sortReset.clearSort();// 清空排序
      t.$refs.sortReset.sort('recDate', 'descending');// 设置默认排序
      t.currentPage = 1;// 分页回归首页
      t.firstResult = 0;// 当前传参
      // 发送请求的列表函数
      t.dataMainList();// 数据主列表请求接口
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
  .crm-kitsListContainer{
    &.ev-quesInfo{
      .el-table th.is-leaf{
        border-bottom: none;
        &:nth-child(10),&:nth-child(12){
          border-left: none;
        }
        &:nth-child(11){
          border-left: 1px solid rgba(216,216,216,0.5);
        }
      }
      .el-table__row td {
        &:nth-child(10), &:nth-child(11), &:nth-child(13) {
          border-bottom: none;
        }
        &:nth-child(11){
          border-left: 1px solid rgba(216,216,216,0.5);
        }
        &:nth-child(9){
          border-bottom: 1px solid rgba(230,230,232,0.3);
        }
      }
      .el-table__row td:nth-child(10),.el-table__row td:nth-child(12){
        border-left: none;
      }
      .el-table__row td:nth-child(12){
        border-bottom: 1px solid rgba(230,230,232,0.3);
        .cell{
          margin:4.5px 0;
          .el-button{
            box-sizing: border-box;
            border: 1px solid #4B67D6;
            border-radius: 3px;
            font-size: 13px;
            color: #4B67D6;
            width: 74px;
            height: 27px;
            padding: 0;
          }
        }
      }
    }
  }
  .ev-quesInfo .el-table td{
    &:nth-child(7), &:nth-child(8){
      .cell{
        width: 90px;
      }
    }
  }
</style>
