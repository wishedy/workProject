<template>
  <div class="productPoint">
    <!--title位置-->
    <div class="TopTitle">厂商关联产品管理 / 关联产品详情</div>
    <div class="topCont">
      <!--筛选box区域-->
      <section class="currScreeningBox">
        <div class="currItem">
          <span class="titleName">关联时间</span>
          <el-date-picker
            v-model="searchForm.resourceTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00','23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </div>
        <div class="currItem">
          <span class="titleName">用户信息</span>
          <el-input class="txtInput" placeholder="用户ID/用户姓名/手机/邮箱" v-model="searchForm.resourceInfo"></el-input>
        </div>
        <div class="currItem">
          <span class="titleName">产品名称</span>
          <el-input class="txtInput" placeholder="产品名称" v-model="searchForm.resourceName"></el-input>
        </div>
        <aside class="btnBox">
          <p class="resetBtn" @click.stop="deleteSearch">清空条件</p>
          <p class="screeningBtn" @click.stop="searchVideoFn">筛选</p>
        </aside>
      </section>
    </div>
    <!--<div class="productDesc">-->
      <!--<img :src="resourcePicture" alt="">-->
      <!--<div class="productCon">-->
        <!--<span v-text="resourceName"></span>-->
        <!--<span v-text="resourceTypeName"></span>-->
      <!--</div>-->
      <!--<span class="goBackList" @click="goBackListFn">返回列表</span>-->
    <!--</div>-->
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%;margin-bottom: 20px"
    >
      <!--展示数据时显示-->
      <el-table-column
        prop="id"
        label="序号"
        width="60"
      >
      </el-table-column>
      <el-table-column
        prop="productName"
        label="关联产品名称"
        width="320"
      >
      </el-table-column>
      <el-table-column
        prop="productId"
        label="关联产品ID"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="用户ID"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="customerName"
        label="用户姓名"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="customerPhone"
        label="手机号"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="customerEmail"
        label="邮箱"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="relateTime"
        label="关联时间"
        width="170"
      >
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
   * CRM 管理后台，运营配置—— 厂商关联产品详情页
   * author:zhanghongda
   * create-time:2019.05.27
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
      resourcePicture: '', // 图片
      resourceTypeName: '', // 类型名称
      resourceName: '', // 名称
      maxResult: 10, // 每页几条
      firstResult: 0, // 当前页首个索引
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalNum: 0, // 数据总数
      axiosNum: 0, // 请求的数目
      searchForm: {// 筛选项
        resourceInfo: '',
        resourceName: '',
        resourceTime: [] // 筛选项中的时间
      },
      subSearchForm: {// 筛选项
        resourceInfo: '',
        resourceName: '',
        resourceTime: [] // 筛选项中的时间
      },
      resourceId: comm.getpara().rId,
      resourceType: comm.getpara().rType,
      isDisabled: false
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
    // 清空
    deleteSearch() {
      for (let key in this.searchForm) {
        this.searchForm[key] = '';
      }
      this.searchForm.resourceTime = []; // 日期恢复当前日期
      for (let key in this.subSearchForm) {
        this.subSearchForm[key] = '';
      }
      this.subSearchForm.resourceTime = []; // 日期恢复当前日期
    },
    // 查询列表
    searchVideoFn() {
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.subSearchForm.resourceInfo = this.searchForm.resourceInfo;
      this.subSearchForm.resourceName = this.searchForm.resourceName;
      this.subSearchForm.resourceTime = this.searchForm.resourceTime;
      this.getListFn();
    },
    // 返回列表按钮
    goBackListFn() {
      this.$router.push({
        name: 'manufacturerProductList'
      });
    },
    // 获取列表函数
    getListFn() {
      // 传入的参数全部为点击筛选之后的参数
      let param = {
        resourceId: this.resourceId,
        resourceType: this.resourceType,
        productName: this.subSearchForm.resourceName ? this.subSearchForm.resourceName : undefined,
        userInfo: this.subSearchForm.resourceInfo ? this.subSearchForm.resourceInfo : undefined,
        startTime: this.subSearchForm.resourceTime ? this.subSearchForm.resourceTime[0] : undefined,
        endTime: this.subSearchForm.resourceTime ? this.subSearchForm.resourceTime[1] : undefined,
        firstResult: this.firstResult,
        maxResult: this.maxResult
      };
      let callbacks = (res) => {
        this.tableData = res.data.responseObject.responseData.productList;
        this.resourcePicture = res.data.responseObject.responseData.resourcePicture;
        this.resourceTypeName = res.data.responseObject.responseData.resourceTypeName;
        this.resourceName = res.data.responseObject.responseData.resourceName;
        this.totalNum = res.data.responseObject.responseData.totalCount;
      };
      this.getListAxios(apiConfig.getRelateProductList.url, param, callbacks);
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
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.subSearchForm.resourceInfo = this.searchForm.resourceInfo;
        this.subSearchForm.resourceName = this.searchForm.resourceName;
        this.subSearchForm.resourceTime = this.searchForm.resourceTime;
        this.getListFn();
      }
    };
  },
  // created() {
  //   window.onbeforeunload = function() {
  //     return '离开此网站，系统可能不会保存您所做的更改。';
  //   };
  // },
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
  .currScreeningBox{
    position: relative;
    width:1200px;
    height:150px!important;
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
  .el-table th.is-leaf div{
    font-weight: 600;
    color: #000;
  }
  .el-table .cell{
    /*width: 100%;*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*-webkit-line-clamp: 2;*/
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
  /*中间介绍部分*/
  .productDesc{
    position: relative;
    width:1200px;
    height:150px;
    background:rgba(255,255,255,1);
    box-shadow:0 4px 10px 0 rgba(42,53,102,0.04);
    border-radius:3px;
    padding: 25px 15px;
    box-sizing: border-box;
    margin-bottom: 50px;
    img{
      display: inline-block;
      width: 200px;
      height: 100px;
      margin-right: 40px;
    }
    .productCon{
      display: inline-block;
      vertical-align: top;
      span{
        font-size: 14px;
        display: block;
        &:nth-child(1){
          margin-top: 10px;
          max-width: 750px;
          line-height: 19px;
        }
        &:nth-child(2){
          margin-top: 20px;
          color: #4B67D6;
        }
      }
    }
    .goBackList{
      position: absolute;
      right: 50px;
      top: 30px;
      font-size: 14px;
      color: #4B67D6;
      cursor: pointer;
    }
  }
</style>
