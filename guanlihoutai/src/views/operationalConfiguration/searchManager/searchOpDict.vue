<template>
  <section class="searchOpDictRoot">
    <div class="searchOpDictRoot-titleTab">
      <h3>搜索热词管理</h3>
      <a href="/#/opDictEdit">
        <div class="searchOpDictRoot-titleTab-addOpDict"><i class="el-icon-circle-plus"></i><i>添加运营词</i></div>
      </a>
      <div class="searchOpDictRoot-titleTab-tabOp">
        <div><a href="/#/searchHotDict">热搜词</a></div>
        <div class="searchOpDictRoot-titleTab-tabOp-activeLine">运营词</div>
      </div>
    </div>

    <div class="searchOpDictRoot-searchList">
      <div class="searchOpDictRoot-searchList-searchFieldOp">
        状态
        <el-select v-model="statusValue" placeholder="请选择状态" @change="statusChange(statusValue)">
          <el-option
            v-for="item in status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <el-table
        :data="opDictItems"
        @sort-change="chooseSort"
        element-loading-text="加载中..."
        :default-sort="sortRule"
      >
        <el-table-column
          prop="sortId"
          align="center"
          label="线上排序号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="id"
          align="center"
          label="创建排序"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="100">
        </el-table-column>
        <el-table-column
          prop="searchKey"
          label="搜索词"
          width="300">
        </el-table-column>
        <el-table-column
          prop="redirectUrlDesc"
          label="跳转"
          align="center"
          width="90">
        </el-table-column>
        <el-table-column
          prop="validDesc"
          label="状态"
          align="center"
          width="120">
        </el-table-column>
        <el-table-column
          :formatter="formatterDate"
          prop="createTime"
          label="创建时间"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="180">
        </el-table-column>
        <el-table-column
          :formatter="formatterDate"
          prop="updateTime"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          label="最近编辑时间"
          width="170">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="134">
          <template slot-scope="scope">
            <div>
              <router-link :to="{path:'/opDictEdit',query:{ dictId:scope.row.id}}">
                <div class="searchOpDictRoot-searchList-searchFieldOp-edit">编辑</div>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row class="searchOpDictRoot-searchList-pagination">
      <el-col :span="10" :offset="5">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="opListParams.maxResult"
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
  name: 'searchOpDict',
  data() {
    return {
      opDictItems: [],
      statusValue: 1,
      status: [{value: 2, label: '全部'}, {value: 0, label: '已下架'}, {value: 1, label: '已上架'}],
      currentPage: 1,
      total: 0,
      sortRule: {prop: 'id', order: 'descending'},
      opListParams: {
        firstResult: 0,
        maxResult: 10,
        sortType: 10,
        sourceType: 1,
        isValid: 1
      }
    };
  },
  beforeMount() {
    for (let x in sessionStorage) {
      if (!x.includes('op') &&
        !x.includes('userLoginName') &&
        !x.includes('menuList')
      ) {
        sessionStorage.removeItem(x);
      }
    }
    if (sessionStorage.getItem('search_op_goBack') === 'true' && sessionStorage.getItem('search_op_sort') && sessionStorage.getItem('search_op_source') === 'op') {
      let row = JSON.parse(sessionStorage.getItem('search_op_sort'));
      this.sortRule = {prop: row.prop, order: row.order};
    }
  },
  destroyed() {
    comm.goBack();
  },
  methods: {
    chooseSort(row) { // 排序
      if (sessionStorage.getItem('search_op_goBack') === 'true' && sessionStorage.getItem('search_op_sort') && sessionStorage.getItem('search_op_source') === 'op') {
        row = JSON.parse(sessionStorage.getItem('search_op_sort'));
      }

      switch (row.prop) {
        case 'id':
          this.opListParams.sortType = row.order === 'ascending' ? 5 : 10;
          break;// 创建排序
        case 'updateTime':
          this.opListParams.sortType = row.order === 'ascending' ? 4 : 9;
          break;// 更新时间
        case 'createTime':
          this.opListParams.sortType = row.order === 'ascending' ? 5 : 10;
          break;// 创建时间
      }

      sessionStorage.setItem('search_op_sort', JSON.stringify(row));// Storage
      this.getSearchDictList();
    },
    handleSizeChange(val) {
      this.opListParams.maxResult = val;
      sessionStorage.setItem('search_op_maxResult', val);// Storage
      this.getSearchDictList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.opListParams.firstResult = (val - 1) * this.opListParams.maxResult;
      sessionStorage.setItem('search_op_currentPage', val);// Storage
      sessionStorage.setItem('search_op_firstResult', (val - 1) * this.opListParams.maxResult);
      this.getSearchDictList();
    },
    statusChange(item) {
      this.opListParams = {firstResult: 0, maxResult: 10, sortType: 10, sourceType: 1, isValid: 1};
      if (item === 2) delete this.opListParams.isValid;
      else this.opListParams.isValid = item;

      sessionStorage.setItem('search_op_isValid', item);
      this.handleCurrentChange(1); // 状态查询时 初始化 当前页及开始值
    },
    getSearchDictList() {
      if (sessionStorage.getItem('search_op_isValid') == null) sessionStorage.setItem('search_op_isValid', 1);
      if (sessionStorage.getItem('search_op_currentPage') == null) sessionStorage.setItem('search_op_currentPage', 1);
      if (sessionStorage.getItem('search_op_firstResult') == null) sessionStorage.setItem('search_op_firstResult', 0);

      this.backHandle();

      const _this = this;
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('searchDictList', _this.opListParams);
      promise.then((res) => {
        comm.closeLoading();
        _this.opDictItems = res.items;
        _this.total = res.total;
        _this.currentPage = sessionStorage.getItem('search_op_currentPage') ? parseInt(sessionStorage.getItem('search_op_currentPage')) : 1;
        _this.tools().opDictItemsConvertDesc();
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    backHandle() { // 回退处理
      let _opMax = sessionStorage.getItem('search_op_maxResult');
      let _opFirst = sessionStorage.getItem('search_op_firstResult');
      let _opIsValid = parseInt(sessionStorage.getItem('search_op_isValid'));
      if (_opMax || _opFirst) {
        this.opListParams.firstResult = _opFirst ? parseInt(_opFirst) : 0;
        this.opListParams.maxResult = _opMax ? parseInt(_opMax) : 10;
        if (_opIsValid !== 1 && _opIsValid !== 0) delete this.opListParams.isValid;
        else this.opListParams.isValid = _opIsValid;
        sessionStorage.setItem('search_op_goBack', false);
        this.statusValue = _opIsValid;
      }
    },
    formatterDate(...rest) {
      return rest[2].substr(0, rest[2].length - 2);
    },
    tools() {
      return {
        _superThis: this,
        opDictItemsConvertDesc() {
          let ods = this._superThis.opDictItems;
          for (let x = 0; x < ods.length; x++) {
            !ods[x].redirectUrl ? ods[x].redirectUrlDesc = '-' : ods[x].redirectUrlDesc = '已添加'; // 跳转
            ods[x].isValid === 0 ? ods[x].validDesc = '已下架' : ods[x].validDesc = '已上架'; // 状态
          }
        }
      };
    }
  }
};
</script>

<style lang='scss' scoped rel='stylesheet/scss'>
  .searchOpDictRoot {

    .searchOpDictRoot-searchList-pagination {
      width: 1200px;
      margin: 0 auto;
      margin-bottom: 50px;
    }

    .searchOpDictRoot-searchList-searchFieldOp-edit {
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

    .searchOpDictRoot-searchList {
      margin: 9px auto;
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

      .searchOpDictRoot-searchList-searchFieldOp {
        padding: 30px 0px 12px 20px;
        border-bottom: 1px solid #E6E6E8;
        color: #555555;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 14px;

        input {
          margin-left: 10px;
          width: 140px;
          /*height: 32px;*/
          background: #F7F9FC;
          border-radius: 3px;
          border: 1px solid #E6E6E8;
        }

      }
    }
    .searchOpDictRoot-titleTab {
      margin: 0 auto;
      width: 1200px;
      margin-top: 37px;
      height: 38px;

      .searchOpDictRoot-titleTab-addOpDict {
        cursor: pointer;
        position: relative;
        top: -5px;
        margin-left: 24px;
        width: 112px;
        height: 32px;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        float: left;
        line-height: 32px;
        text-align: center;

        .el-icon-circle-plus {
          color: #0d17d6;
          position: relative;
          top: 1px;
        }

        i:last-child {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4B67D6;
          letter-spacing: 0;
          line-height: 14px;
          margin-left: 2px;
        }

      }
      h3 {
        float: left;
        font-size: 20px;
      }

      .searchOpDictRoot-titleTab-tabOp {
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

        .searchOpDictRoot-titleTab-tabOp-activeLine {
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
