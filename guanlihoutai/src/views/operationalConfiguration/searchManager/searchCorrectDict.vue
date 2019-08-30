<template>
  <section class="searchCoDictRoot">
    <div class="searchCoDictRoot-titleTab">
      <h3>纠正词管理</h3>
      <a href="/#/correctDictEdit">
        <div class="searchCoDictRoot-titleTab-addDict"><i class="el-icon-circle-plus"></i><i>添加纠正词</i></div>
      </a>
      <div class="searchCoDictRoot-titleTab-tabCorrect">
        <div><a href="/#/searchComplexDict">复合搜索词</a></div>
        <div class="searchCoDictRoot-titleTab-tabCorrect-activeLine">纠正词</div>
      </div>
    </div>

    <div class="searchCoDictRoot-searchList">
      <div class="searchCoDictRoot-searchList-searchFieldCorrect">
        <input placeholder="请输入搜索词" v-model="queryDict">
        <div class="searchCoDictRoot-searchList-searchFieldCorrect-submit" @click="querySearch">确定</div>
      </div>

      <el-table
        :data="correctDictItems"
        @sort-change="chooseSort"
        element-loading-text="加载中..."
        :default-sort="sortRule"
      >
        <el-table-column
          prop="id"
          align="center"
          label="ID"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          width="100">
        </el-table-column>
        <el-table-column
          prop="keyWord"
          label="搜索词"
          align="center"
          width="380">
          <template slot-scope="scope">
            <p v-html="mixedDictFormatter(scope.row.keyWord, 20)"></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="reusltWord"
          label="纠正词"
          align="center"
          width="380">
          <template slot-scope="scope">
            <p v-html="mixedDictFormatter(scope.row.reusltWord, 48)"></p>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          label="编辑时间"
          width="160">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <div class="searchCoDictRoot-searchList-editArea">
              <router-link :to="{path:'/correctDictEdit',query:{ dictId:scope.row.id}}">
                <div class="searchCoDictRoot-searchList-editArea-button">编辑</div>
              </router-link>
              <div class="searchCoDictRoot-searchList-editArea-button" @click="deleteDict(scope.row)">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-row class="searchCoDictRoot-searchList-pagination">
      <el-col :span="10" :offset="5">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="correctListParams.maxResult"
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
  name: 'searchCorrectDict',
  data() {
    return {
      correctDictItems: [],
      queryDict: '',
      currentPage: 1,
      total: 0,
      sortRule: {prop: 'id', order: 'ascending'},
      correctListParams: {
        keyWord: '',
        firstResult: 0,
        maxResult: 10,
        sortType: 1, // 1为升序，2为降序
        sortFieldName: 'id' // 排序字段名
      }
    };
  },
  beforeMount() {
    for (let x in sessionStorage) {
      if (!x.includes('correct') &&
        !x.includes('userLoginName') &&
        !x.includes('menuList')
      ) {
        sessionStorage.removeItem(x);
      }
    }
    if (sessionStorage.getItem('search_correct_goBack') === 'true' && sessionStorage.getItem('search_correct_sort') && sessionStorage.getItem('search_correct_source') === 'correct') {
      let row = JSON.parse(sessionStorage.getItem('search_correct_sort'));
      this.sortRule = {prop: row.prop, order: row.order};
    }
  },
  destroyed() {
    for (let x in sessionStorage) {
      if (x.includes('correct')) {
        sessionStorage.removeItem(x);
      }
    }
    comm.goBack();
  },
  methods: {
    chooseSort(row) { // 排序
      if (sessionStorage.getItem('search_correct_goBack') === 'true' && sessionStorage.getItem('search_correct_sort') && sessionStorage.getItem('search_correct_source') === 'op') {
        row = JSON.parse(sessionStorage.getItem('search_correct_sort'));
      }

      this.correctListParams.sortFieldName = row.prop;
      this.correctListParams.sortType = row.order === 'ascending' ? 1 : 2;

      sessionStorage.setItem('search_correct_sort', JSON.stringify(row));// Storage
      this.getSearchDictList();
    },
    handleSizeChange(val) {
      this.correctListParams.maxResult = val;
      sessionStorage.setItem('search_correct_currentPage', 1);
      sessionStorage.setItem('search_correct_firstResult', 0);
      sessionStorage.setItem('search_correct_maxResult', val);// Storage
      this.getSearchDictList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.correctListParams.firstResult = (val - 1) * this.correctListParams.maxResult;
      sessionStorage.setItem('search_correct_currentPage', val);// Storage
      sessionStorage.setItem('search_correct_firstResult', (val - 1) * this.correctListParams.maxResult);
      this.getSearchDictList();
    },
    querySearch() {
      let queryDict = comm.clearUndefinedAndSpace(this.queryDict);
      this.correctListParams.keyWord = queryDict;

      this.handleCurrentChange(1); // 状态查询时 初始化 当前页及开始值
    },
    getSearchDictList() {
      if (sessionStorage.getItem('search_correct_currentPage') == null) sessionStorage.setItem('search_correct_currentPage', 1);
      if (sessionStorage.getItem('search_correct_firstResult') == null) sessionStorage.setItem('search_correct_firstResult', 0);

      this.backHandle();

      const _this = this;
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('correctSearchList', _this.correctListParams);
      promise.then((res) => {
        comm.closeLoading();
        _this.correctDictItems = res.responseData.dataList;
        _this.total = res.responseData.totalCount;
        _this.currentPage = sessionStorage.getItem('search_correct_currentPage') ? parseInt(sessionStorage.getItem('search_correct_currentPage')) : 1;

        if (_this.total > 0 && _this.correctDictItems.length === 0) {
          sessionStorage.setItem('search_correct_currentPage', sessionStorage.getItem('search_correct_currentPage') - 1);
          let tempPageSize = 10;
          if (sessionStorage.getItem('search_correct_maxResult')) {
            tempPageSize = sessionStorage.getItem('search_correct_maxResult');
          }
          sessionStorage.setItem('search_correct_firstResult', sessionStorage.getItem('search_correct_firstResult') - tempPageSize);
          _this.getSearchDictList();
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    backHandle() { // 回退处理
      let _crtMax = sessionStorage.getItem('search_correct_maxResult');
      let _crtFirst = sessionStorage.getItem('search_correct_firstResult');
      if (_crtMax || _crtFirst) {
        this.correctListParams.firstResult = _crtFirst ? parseInt(_crtFirst) : 0;
        this.correctListParams.maxResult = _crtMax ? parseInt(_crtMax) : 10;
        sessionStorage.setItem('search_correct_goBack', false);
      }
    },
    deleteDict(item) {
      const _this = this;
      this.$allin_confirm({
        title: '提示',
        content: '确认删除搜索词‘' + item.keyWord + '’吗？',
        done: function() {
          const promise = comm.sendAxios('deleteDictCorrect', {id: item.id});
          promise.then((res) => {
            if (!res.responseStatus) _this.$allin_confirm({type: 'notice', content: '删除失败!'});
            else _this.getSearchDictList();
          });
        }
      });
    },
    formatterDate(...rest) {
      return rest[2].substr(0, rest[2].length - 2);
    },
    mixedDictFormatter(cellValue, len) {
      if (cellValue && cellValue.length) {
        cellValue = comm.getStrLen(cellValue, len);
      }
      return this.searchChangeColor(this.queryDict, cellValue);
    },
    searchChangeColor(queryKey, cellValue) {
      const prefixColor = '<span class="searchCoDictRoot-searchText">';
      const subfixColor = '</span>';
      if (queryKey && queryKey.length > 0) {
        let replaceReg = new RegExp(queryKey.toUpperCase(), 'gi');
        let replaceSign = prefixColor + queryKey + subfixColor;
        let cellValueUpper = cellValue.toUpperCase().replace(replaceReg, replaceSign);

        let handleCellValue = cellValueUpper.split(prefixColor);
        let arrCell = [];
        for (let x in handleCellValue) arrCell = arrCell.concat(handleCellValue[x].split(subfixColor));

        let Result = '';
        for (let x in arrCell) {
          if (arrCell[x] === queryKey) {
            Result += prefixColor + cellValue.substr(0, arrCell[x].length) + subfixColor;
          }
          else {
            Result += cellValue.substr(0, arrCell[x].length);
          }
          cellValue = cellValue.substr(arrCell[x].length);
        }
        return Result;
      }
      else {
        return cellValue;
      }
    }
  }
};
</script>
<!-- 加scoped 会造成后追加的searchCoDictRoot-searchText不生效 -->
<style lang='scss' rel='stylesheet/scss'>
  .searchCoDictRoot {

    .searchCoDictRoot-searchText {
      color: #FF0000;
    }

    .searchCoDictRoot-searchList-pagination {
      width: 1200px;
      margin: 0 auto;
      margin-bottom: 50px;
    }

    .searchCoDictRoot-searchList-editArea {
      width: 180px;
    }

    .searchCoDictRoot-searchList-editArea-button {
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
      float: left;
      margin-right: 10px;
    }

    .searchCoDictRoot-searchList {
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

      .searchCoDictRoot-searchList-searchFieldCorrect {
        padding: 30px 0px 12px 20px;
        border-bottom: 1px solid #E6E6E8;
        color: #555555;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        letter-spacing: 0;
        line-height: 14px;
        height: 35px;

        input {
          width: 300px;
          height: 32px;
          background: #F7F9FC;
          border-radius: 3px;
          border: 1px solid #E6E6E8;
          float: left;
          padding: 0 10px;
        }

        .searchCoDictRoot-searchList-searchFieldCorrect-submit {
          margin-left: 10px;
          width: 140px;
          height: 32px;
          background: #3846DC;
          border-radius: 3px;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          line-height: 32px;
          text-align: center;
          float: left;
          cursor: pointer;
        }

      }
    }
    .searchCoDictRoot-titleTab {
      margin: 0 auto;
      width: 1200px;
      margin-top: 37px;
      height: 38px;

      .searchCoDictRoot-titleTab-addDict {
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

      .searchCoDictRoot-titleTab-tabCorrect {
        cursor: pointer;
        float: right;
        width: 240px;

        div {
          margin-left: 48px;
          float: left;
          font-family: PingFangSC-Regular;
          font-size: 18px;
          color: #A7A9AC;
          letter-spacing: 0;
          line-height: 18px;
        }

        .searchCoDictRoot-titleTab-tabCorrect-activeLine {
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

  .cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0.7;
    background: #000000;
  }

  .popupWindow {
    z-index: 11;
    position: fixed;
    left: 0%;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;
  }
</style>
