<template>
  <div class="productPoint">
    <!--title位置-->
    <div class="TopTitle">厂商关联产品管理</div>
    <div class="topCont">
      <!--筛选box区域-->
      <section class="currScreeningDescBox">
        <div class="currItem">
          <span class="titleName">内容名称</span>
          <el-input class="txtInput" placeholder="内容名称" v-model="searchForm.resourceName"></el-input>
        </div>
        <div class="currItem">
          <span class="titleName">内容类型</span>
          <el-select v-model="searchForm.resourceType">
            <el-option v-for="(item,index) in typeArr" :key="index" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </div>
        <aside class="btnBox">
          <p class="resetBtn" @click.stop="deleteSearch">清空条件</p>
          <p class="screeningBtn" @click.stop="searchVideoFn">筛选</p>
        </aside>
      </section>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
    >
      <!--展示数据时显示-->
      <el-table-column
        prop="id"
        label="序号"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="resourceName"
        label="内容名称"
        width="550"
      >
        <template slot-scope="scope">
          <div class="contentImg">
            <img :src="scope.row.resourcePicture">
          </div>
          <div class="contentName">
            {{ scope.row.resourceName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="resourceType"
        label="内容类型"
        width="200"
        :formatter="resourceTypeFor"
      >
      </el-table-column>
      <el-table-column
        prop="categoryNum"
        label="关联产品数量"
        width="150"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
      >
        <template slot-scope="scope">
          <span class="jumpBtn" @click.stop="goToProductDesc(scope.row)">查看关联产品</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;margin-bottom: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper, sizes"
      :total="totalNum" v-if="totalNum>10">
    </el-pagination>
  </div>
</template>
<script>
/**
   * CRM 管理后台，运营配置——厂商关联产品管理（列表页）
   * author:zhanghongda
   * 产品版本：新后台系统v1.8.0（大版本3.8）
   * 功能信息：
   *  1，列表展示
   *  2，列表筛选展示
   */
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  data() {
    return {
      tableData: [], // 列表数组
      maxResult: 10, // 每页几条
      firstResult: 0, // 当前页首个索引
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalNum: 0, // 数据总数
      axiosNum: 0, // 请求的数目
      searchForm: {// 筛选项
        resourceName: '',
        resourceType: '10'
      },
      subSeachForm: {
        resourceName: '',
        resourceType: '10'
      },
      typeArr: [] // 内容类型数组
    };
  },
  methods: {
    handleSizeChange(val) { // 更改每页数
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.maxResult = val;
      this.getListFn();
    },
    handleCurrentChange(val) { // 更改当前页
      this.currentPage = val;
      this.firstResult = (val - 1) * this.maxResult;
      this.getListFn();
    },
    getTypeArr() {
      // 传入的参数全部为点击筛选之后的参数
      let param = {};
      let callbacks = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          this.typeArr = res.data.responseObject.responseData.dataList;
        }
      };
      this.getListAxios(apiConfig.getResourceTypeEnumList.url, param, callbacks);
    },
    // 清空
    deleteSearch() {
      this.searchForm.resourceType = '10';
      this.searchForm.resourceName = '';
      this.subSeachForm.resourceName = '10';
      this.subSeachForm.resourceType = '';
    },
    // 查询列表
    searchVideoFn() {
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.subSeachForm.resourceName = this.searchForm.resourceName;
      this.subSeachForm.resourceType = this.searchForm.resourceType;
      this.getListFn();
    },
    // 跳转查看详情列表页
    goToProductDesc(row) {
      this.$router.push({
        name: 'manufacturerProductDesc',
        query: {
          rId: row.resourceId,
          rType: row.resourceType
        }
      });
    },
    // 内容类型formatter
    resourceTypeFor(val) {
      if (val.resourceType) {
        for (let i in this.typeArr) {
          if (parseInt(val.resourceType) === parseInt(this.typeArr[i].key)) {
            return this.typeArr[i].value;
          }
        }
      }
    },
    // 获取列表函数
    getListFn() {
    // 传入的参数全部为点击筛选之后的参数
      let param = {
        resourceType: this.subSeachForm.resourceType ? this.subSeachForm.resourceType : undefined,
        resourceName: this.subSeachForm.resourceName ? this.subSeachForm.resourceName : undefined,
        firstResult: this.firstResult,
        maxResult: this.maxResult
      };
      let callbacks = (res) => {
        this.tableData = res.data.responseObject.responseData.dataList;
        this.totalNum = res.data.responseObject.responseData.totalCount;
      };
      this.getListAxios(apiConfig.getCmsResourceCategoryList.url, param, callbacks);
    },
    // 获取数据公共axios方法.
    getListAxios(path, params, callback, tipMsg, type, errorCallback) {
      comm.openLoading('加载中...');
      this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          this.axiosNum--;
          callback && callback(res);
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          callback && callback(res);
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  mounted() {
    this.getListFn();
    this.getTypeArr(); // 获取内容类型接口
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.subSeachForm.resourceName = this.searchForm.resourceName;
        this.subSeachForm.resourceType = this.searchForm.resourceType;
        this.getListFn();
      }
    };
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
<style lang="scss">
  /*title*/
  .TopTitle{
    font-size:20px;
    font-weight:600;
    color:rgba(44,52,58,1);
    line-height:20px;
    margin: 32px 0 20px 0;
  }
  /*筛选按钮*/
  .currScreeningDescBox{
    position: relative;
    width:1200px;
    height:90px!important;;
    background:rgba(255,255,255,1);
    box-shadow:0 4px 10px 0 rgba(42,53,102,0.04);
    border-radius:3px;
    padding: 25px 15px;
    box-sizing: border-box;
    margin-bottom: 50px;
    .currItem{
      display: inline-block;
      margin-bottom: 22px;
      margin-left: 20px;
    }
    .titleName{
      margin-right: 10px;
      font-size: 14px;
    }
    .txtInput{
      width: 200px;
    }
    .btnBox{
      margin-top: 24px;
      //height: 32px;
      p{
        display: inline-block;
        position: absolute;
        vertical-align: middle;
        cursor: pointer;
      }
      .resetBtn{
        font-size:14px;
        font-weight:400;
        color:rgba(44,52,58,1);
        line-height:14px;
        margin-right: 20px;
        right: 124px;
        bottom: 32px;
      }
      .screeningBtn{
        right: 34px;
        bottom: 25px;
        width:90px;
        height:32px;
        border-radius:3px;
        border:1px solid rgba(75,103,214,1);
        box-sizing: border-box;
        line-height: 32px;
        font-size:14px;
        font-weight:400;
        color:rgba(75,103,214,1);
        text-align: center;
      }
    }
  }
  /*下面的列表*/
  .productPoint{
    font-size: 0;
    width: 1200px;
    margin: 36px auto 0;
    background: #F6F7FA;
    .newProductPoint{
      margin: 30px 0 30px;
      color: #4B67D6;
      border: 1px solid #4B67D6;
      border-radius: 3px;
    }
    .pointSearch{
      position: relative;
      width: 89%;
      height: 32px;
      margin-bottom: 18px;
      line-height: 32px;
      right: 0;
      display: inline-block;
      vertical-align: middle;
      input{
        width: 184px;
        height: 32px;
        border: none;
        border-radius: 4px;
        position: absolute;
        right: 74px;
        top: 0;
        text-indent: 6px;
      }
      button{
        width: 62px;
        height: 32px;
        border-radius: 4px;
        margin-left: 12px;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        background: url("/static/images/icons/icon-search-blue.png") no-repeat center;
        background-size: inherit;
        background-color: #4B67D6;
      }
    }
  }
  /*页面中列表样式*/
  .el-table {
    width: 100%;
    margin-bottom: 20px
  }
  .el-table th.is-leaf div{
    font-weight: 600;
    color: #000;
  }
  .el-table .cell{
    width: 100%;
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*-webkit-line-clamp: 1;*/
    /*-webkit-box-orient: vertical;*/
    /*white-space: nowrap;*/
  }
  thead .is-leaf:nth-child(7){
    text-align: center;
  }
  .el-table__row td:last-child{
    text-align: center;
  }
  .el-table__row td:first-child{
    text-align: center;
  }
  .el-table th.is-leaf div{
    text-align: center;
  }
  .el-table .cell{
    text-align: center;
  }
  .contentImg{
    float:left;
    width:60px;
    img{
      width:52px;
      height:40px;
    }
  }
  .contentName{
    /*overflow: hidden;*/
    /*white-space: nowrap;*/
    /*text-overflow:ellipsis;*/
    line-height: 20px
  }
  /*跳转查看按钮*/
  .jumpBtn{
    color: #4B67D6;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
