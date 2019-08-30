<template>
  <div class="productPoint">
      <div class="topCont">
        <!--新建锚点-->
        <el-button
          @click.stop="newPoint"
          class="el-icon-circle-plus newProductPoint"
        > 新建锚点</el-button>
        <div class="pointSearch">
          <input class="searchVal" type="text">
          <button @click="searchVideoFn" class="searchBtn"></button>
        </div>
      </div>
    <el-table
      ref="multipleTable"
      :data="listDatas"
      @row-click="newPoint"
      style="width: 100%;margin-bottom: 20px"
    >
      <!--展示数据时显示-->
      <el-table-column
        prop="videoNum"
        label="序号"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="videoName"
        label="视频标题"
        width="360"
      >
      </el-table-column>
      <el-table-column
        prop="videoId"
        label="视频id"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="videoAuthor"
        label="作者"
        width="210"
      >
      </el-table-column>
      <el-table-column
        prop="publishTime"
        label="发布时间"
        width="160"
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="添加锚点时间"
        width="160"
        :formatter="timeUpFormate"
      >
      </el-table-column>
      <el-table-column
      label="操作"
      width="100"
    >
        <template slot-scope="scope">
            <span class="delateBtn" @click.stop="deleteVideoFn(scope.row)">删除</span>
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
   * CRM 管理后台，运营配置——产品锚点（列表页）
   * author:zhanghongda
   * create-time:2019.03.27（开发周期：2019/4/1-2019/4/12）
   * 产品版本：新后台系统v1.6.0（大版本3.6）
   * 功能信息：
   *  1，列表展示
   *  2，列表搜索
   *  3，新建锚点
   *  4，编辑锚点
   */
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  data() {
    return {
      listDatas: [], // 列表数组
      maxResult: 10, // 每页几条
      firstResult: 0, // 当前页首个索引
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalNum: 0, // 数据总数
      axiosNum: 0, // 请求的数目
      searchParam: '', // 查询的关键字
      userLoginName: localStorage.getItem('userLoginName') // 登录名称
    };
  },
  methods: {
    handleSizeChange(val) { // 更改每页数
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.maxResult = val;
      this.getVideoListFn();
    },
    handleCurrentChange(val) { // 更改当前页
      this.currentPage = val;
      this.firstResult = (val - 1) * this.maxResult;
      this.getVideoListFn();
    },
    newPoint(row) {
      if (row === 1) { // 新建锚点
        this.$router.push({
          name: 'productPointDesc'
        });
      }
      else { // 编辑锚点
        this.$router.push({
          name: 'productPointDesc',
          query: {
            videoId: row.videoId
          }
        });
      }
    },
    // 获取视频列表
    getVideoListFn() {
      let param = {
        searchParam: this.searchParam ? this.searchParam : undefined,
        firstResult: this.firstResult,
        maxResult: this.maxResult,
        sortType: 1
      };
      let callback = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList) {
          this.listDatas = res.data.responseObject.responseData.dataList;
          this.totalNum = res.data.responseObject.responseData.totalCount;
        }
      };
      this.getListAxios(apiConfig.getVideoList.url, param, callback);
    },
    // 查询视频锚点列表
    searchVideoFn() {
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.searchParam = (document.getElementsByClassName('searchVal')[0].value).trim();
      this.getVideoListFn();
    },
    timeUpFormate(val) {
      if (val.updateTime) {
        return val.updateTime.substring(0, 19);
      }
    },
    // 删除整个视频锚点操作
    deleteVideoFn(row) {
      this.$allin_confirm({
        title: '提示',
        content: '确定删除此条视频么？',
        done: () => {
          let param = {
            opUserName: this.userLoginName,
            videoId: row.videoId,
            isValid: 0
          };
          let callback = (res) => {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.getVideoListFn();// 删除成功后刷新列表
            }
            else {
              this.$message.error('删除失败，请重试！');
            }
          };
          this.getListAxios(apiConfig.getVideoListSave.url, param, callback, '删除失败，请重试！', apiConfig.getVideoListSave.type);
        }
      });
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
    this.getVideoListFn();
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        this.searchParam = (document.getElementsByClassName('searchVal')[0].value).trim();
        this.getVideoListFn();
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
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
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
  /*列表删除按钮*/
  .delateBtn{
    color: #ff0000;
    cursor: pointer;
  }
</style>
