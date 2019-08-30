<template>
  <section class="searchHotDictRoot">
    <div class="searchHotDictRoot-titleTab">
      <h3>搜索热词管理</h3>
      <div class="searchHotDictRoot-tabHot">
        <div class="searchHotDictRoot-activeLine">热搜词</div>
        <div><a href="/#/searchOpDict">运营词</a></div>
      </div>
    </div>

    <div class="searchHotDictRoot-searchList">
      <el-table
        :data="hotDictItems"
        @sort-change="chooseSort"
        element-loading-text="加载中..."
        :default-sort="sortRule"
      >
        <el-table-column
          prop="sortId"
          align="center"
          label="线上排序号"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="160">
        </el-table-column>
        <el-table-column
          prop="searchKey"
          label="搜索词"
          width="320">
        </el-table-column>
        <el-table-column
          prop="recommendTypeDesc"
          label="搜索类型"
          width="160">
        </el-table-column>
        <el-table-column
          prop="heatId"
          label="实际热度"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sourceTypeDesc"
          label="来源"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="120">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180">
          <template slot-scope="scope">
            <div>{{scope.row.sourceTypeDesc=="-"?"-":formatterDate(scope.row.createTime)}}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="134">
          <template slot-scope="scope">
            <div>
              <router-link :to="{path:'/hotDictEdit',query:{ dictId:scope.row.id}}">
                <div class="searchHotDictRoot-searchList-edit">编辑</div>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-row class="searchHotDictRoot-searchList-pagination">
      <el-col :span="10" :offset="5">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="hotListParams.maxResult"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
export default{
  name: 'searchHotDict',
  data() {
    return {
      hotDictItems: [],
      currentPage: 1,
      total: 33, // 业务要求只有30-33个 这个数值还影响编辑返回页数变化--!
      sortRule: {prop: 'sourceTypeDesc', order: 'ascending'}, // 默认排序
      hotListParams: {
        firstResult: 0,
        maxResult: 10,
        isValid: 1, // 1有效 0无效
        sortType: 2 // 1-线上排序号正序,2-来源正序,3-实际热度正序,4-修改时间正序,5-id正序,6-线上排序号倒序 7-来源倒序,8-实际热度倒序,9-修改时间倒序，10-id倒序,11-来源序列号正序
      }
    };
  },
  beforeMount() {
    for (let x in sessionStorage) {
      if (x.includes('op')) {
        sessionStorage.removeItem(x);
      }
    }

    if (sessionStorage.getItem('search_goBack') === 'true' && sessionStorage.getItem('search_sort') && sessionStorage.getItem('search_source') === 'hot') {
      let row = JSON.parse(sessionStorage.getItem('search_sort'));
      this.sortRule = {prop: row.prop, order: row.order};
    }
  },
  destroyed() {
    comm.goBack();
  },
  methods: {
    chooseSort(row) {
      if (sessionStorage.getItem('search_goBack') === 'true' && sessionStorage.getItem('search_sort') && sessionStorage.getItem('search_source') === 'hot') {
        row = JSON.parse(sessionStorage.getItem('search_sort'));
      }

      switch (row.prop) {
        case 'sourceTypeDesc':
          this.hotListParams.sortType = row.order === 'ascending' ? 7 : 2;
          break; // 来源
        case 'heatId':
          this.hotListParams.sortType = row.order === 'ascending' ? 3 : 8;
          break; // 热度
        case 'sortId':
          this.hotListParams.sortType = row.order === 'ascending' ? 1 : 6;
          break; // 线上排序
      }

      sessionStorage.setItem('search_sort', JSON.stringify(row));// Storage
      this.getSearchDictList();
    },
    handleSizeChange(val) {
      this.hotListParams.maxResult = val;
      sessionStorage.setItem('search_maxResult', val); // Storage
      this.getSearchDictList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.hotListParams.firstResult = (val - 1) * this.hotListParams.maxResult;
      sessionStorage.setItem('search_currentPage', val); // Storage
      sessionStorage.setItem('search_firstResult', (val - 1) * this.hotListParams.maxResult);
      this.getSearchDictList();
    },
    getSearchDictList() {
      if (sessionStorage.getItem('search_currentPage') == null) sessionStorage.setItem('search_currentPage', 1);
      if (sessionStorage.getItem('search_firstResult') == null) sessionStorage.setItem('search_firstResult', 0);

      this.backHandle();

      // 列表  请求:无参或取热词或运营词动作参   响应(热词30个、运营词3个): 线上排序号、搜索词、推荐类型、实际热度、来源、创建时间、对应的热运词ID、热词计数、运营词计数（提交时超过3个运营词不允许提交）
      const _this = this;
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('searchDictList', _this.hotListParams);
      promise.then((res) => {
        comm.closeLoading();
        _this.hotDictItems = res.items;
        _this.total = res.totalCount;
        _this.tools().hotDictItemsConvertDesc();
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    backHandle() { // 回退处理
      let _hotMax = sessionStorage.getItem('search_maxResult');
      let _hotFirst = sessionStorage.getItem('search_firstResult');
      let _hotCurrent = sessionStorage.getItem('search_currentPage');
      if (_hotMax || _hotFirst || _hotCurrent) {
        this.currentPage = _hotCurrent ? parseInt(_hotCurrent) : 1;
        this.hotListParams.firstResult = _hotFirst ? parseInt(_hotFirst) : 0;
        this.hotListParams.maxResult = _hotMax ? parseInt(_hotMax) : 10;
        sessionStorage.setItem('search_goBack', false);
      }
    },
    formatterDate(date) {
      return date.substr(0, date.length - 2);
    },
    tools() {
      return {
        _superThis: this,
        hotDictItemsConvertDesc() {
          let hds = this._superThis.hotDictItems;
          for (let x = 0; x < hds.length; x++) {
            if (hds[x].sourceType === 0) hds[x].sourceTypeDesc = '-';
            else hds[x].sourceTypeDesc = '运营添加';

            switch (hds[x].recommendType) {
              case 0:
                hds[x].recommendTypeDesc = '-';
                break;
              case 1:
                hds[x].recommendTypeDesc = '推荐';
                break;
              case 2:
                hds[x].recommendTypeDesc = '预填充词';
                break;
            }
          }
        }
      };
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .searchHotDictRoot {

    .searchHotDictRoot-searchList-pagination {
      width: 1200px;
      margin: 0 auto;
      margin-bottom: 50px;
    }

    .searchHotDictRoot-searchList {
      margin: 25px auto;
      width: 1200px;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;

      .el-table th.is-leaf {
        font-weight: bold;
        font-size: 14px;
        color: #111111;
        font-family: PingFangSC-Medium;
      }

      .searchHotDictRoot-searchList-edit {
        cursor: pointer;
        width: 72px;
        height: 25px;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 23px;
        text-align: center;
      }

    }
    .searchHotDictRoot-titleTab {
      margin: 0 auto;
      width: 1200px;
      margin-top: 37px;
      height: 38px;
      border-bottom: 2px solid #eaebf0;

      h3 {
        float: left;
        font-size: 20px;
      }

      .searchHotDictRoot-tabHot {
        cursor: pointer;
        float: right;
        width: 204px;

        div {
          margin-left: 48px;
          float: left;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #A7A9AC;
          letter-spacing: 0;
          line-height: 18px;
        }

        .searchHotDictRoot-activeLine {
          float: left;
          font-family: PingFangSC-Semibold;
          font-size: 18px;
          color: #2C343A;
          letter-spacing: 0;
          line-height: 18px;
          height: 35px;
          border-bottom: 4px solid #4B67D6;
        }

      }
    }
  }
</style>
