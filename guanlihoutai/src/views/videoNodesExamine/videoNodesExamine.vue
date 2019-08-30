<template>
  <div class="nodesContainer">
    <div class="nodesTop">
      <div class="nodesOne">
        <div class="nodesTopTitle">配置内容</div>
        <div class="nodesTopNum" v-show="nodeState===0">
          <span @click="toExamine" v-show="!isExamine">批量审核</span>
          <span v-show="isExamine" @click="createNode">进入审核</span>
          <i v-show="isExamine||surplusNum>0">{{totalNodesNum}}</i>
        </div>
      </div>
      <div class="nodesTwo">
        <div class="nodeWait active" data-type="1" @click="TabCli(0)">待审核</div>
        <div class="nodePass" data-type="2" @click="TabCli(1)">已通过</div>
        <div class="nodeRefuse" data-type="3" @click="TabCli(2)">已屏蔽</div>
      </div>
    </div>
    <div class="nodeSearch">
      <div v-show="isExamine&&nodeState===0">已选择<span>{{checkNum}}</span>个笔记</div>
      <input id="searchVal" type="text">
      <button @click="searchBtn" class="searchBtn"></button>
    </div>
    <el-table
      ref="multipleTable"
      :data="listDatas"
      @row-click="rowClick"
      style="width: 100%"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      @sort-change='tableSortChange'
      @selection-change="selectionChange"
      :row-key="getRowKeys"
      >
      <!--多选时进行显示-->
      <el-table-column type="selection" width="80" v-if="isExamine&&nodeState===0" v-bind:key="1" :reserve-selection="true" prop="nodeId"></el-table-column>
      <!--展示数据时显示-->
      <el-table-column prop="nodeNum" label="序号" width="80" v-if="!isExamine||nodeState!==0" v-bind:key="3"></el-table-column>
      <el-table-column prop="nodeDesc" label="笔记内容" :width="nodeState===0?435:390" v-bind:key="4"></el-table-column>
      <el-table-column prop="videoName" label="资源标题" :width="nodeState===0?240:190" v-bind:key="5"></el-table-column>
      <el-table-column prop="refCustomerId" sortable="custom" :sort-orders="['descending','ascending']" label="用户ID" width="150" v-bind:key="6"></el-table-column>
      <el-table-column prop="videoId" sortable="custom" :sort-orders="[ 'descending','ascending']" label="资源ID" width="150" v-bind:key="7"></el-table-column>
      <el-table-column prop="opUserName" sortable="custom" :sort-orders="[ 'descending','ascending']" label="审核人" width="100" v-if="nodeState!==0" v-bind:key="2"></el-table-column>
      <el-table-column prop="createTime" sortable="custom" :sort-orders="[ 'descending','ascending']" label="发布时间" width="110" v-bind:key="9"></el-table-column>
    </el-table>
    <el-pagination
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
<style lang="scss">
  .nodesContainer{
    font-size: 0;
    width: 1200px;
    margin: 36px auto 0;
    background: #F6F7FA;
    .nodesTop{
      position: relative;
      padding-bottom: 16px;
      border-bottom : 2px solid;
      border-color: rgba(185,186,191,0.2);
      margin-bottom: 16px;
      .nodesOne{
        display: inline-block;
      }
      .nodesTopTitle{
        font-size: 20px;
        color: #2C343A;
        font-weight: 600;
        margin-right: 24px;
        display: inline-block;
      }
      .nodesTopNum{
        display: inline-block;
        font-size: 14px;
        text-align: center;
        color: #FFFFFF;
        span{
          width: 77px;
          height: 22px;
          background: #4B67D6;
          border-radius: 3px;
          line-height: 22px;
          display: inline-block;
          cursor: pointer;
        }
        i{
          display: inline-block;
          min-width: 11px;
          height: 16px;
          border-radius: 16px;
          position: relative;
          top: -8px;
          right: 11px;
          background: #FF7E4D;
          line-height: 16px;
          text-align: center;
          padding: 2px 4px;
        }
      }
      .nodesTwo{
        display: inline-block;
        position: absolute;
        right: 0;
        top: 0;
        div{
          display: inline-block;
          width: 54px;
          font-size: 18px;
          margin-left: 48px;
          color: #A7A9AC;
          cursor: pointer;
          &.active{
            color: #2C343A;
            font-weight: 600;
            border-bottom: 4px solid #4B67D6;
            padding-bottom: 18px;
          }
        }
      }
    }
    .nodeSearch{
      position: relative;
      width: 100%;
      height: 32px;
      margin-bottom: 18px;
      line-height: 32px;
      div{
        font-size: 18px;
        color: #A7A9AC;
        span{
          color: #FF7E4D;
        }
      }
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
        background: url("./components/images/seach.png") no-repeat center;
        background-size: inherit;
        background-color: #4B67D6;
      }
    }
    .el-table{
      padding: 0 25px;
    }
    .el-table th.is-leaf{
      border: none;
    }
    .el-table-column{
      font-weight: 600;
    }
    .el-table th.is-leaf div{
      font-weight: 600;
      color: #000;
    }
    .el-pagination{
      text-align: center;
      margin: 25px auto 33px;
    }
  }
</style>
<script>
// const axios = require('axios');
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  name: 'videoNodesExamine',
  data() {
    return {
      fdsnn: '',
      userId: localStorage.getItem('userId'),
      waitData: [], // 待审核所有数据
      listDatas: [], // 列表里的数据
      currentPage: 1, // 第几页
      pageSize: 10, // 每页几条
      totalNum: 0, // 数据总数
      checkNum: 0, // 已经选择的条数
      surplusNum: 0, // 剩余未审核条数
      totalNodesNum: 0, // 需要进行审核笔记条数
      totalNodeIds: [], // 总nodeIds
      nodeIds: [], // 已经选择的id
      surplusNodeId: [], // 剩余的笔记id
      isExamine: false, // 表示是多选
      nodeState: 0, // 列表类型
      sortType: 2, // 排序类型
      start: 1, // 待审核列表中展示的数据开始的下标
      searchVal: '', // 点击搜索的文字
      waitNodeIds: [], // 保存所有id的数组
      localTime: ''// 当前年月日
    };
  },
  methods: {
    handleSizeChange(val) { // 更改每页数
      this.pageSize = val;
      this.sortType = '2';// 筛选项条件变化，排序回归默认，
      this.$refs.multipleTable.clearSort();// 清空排序
      this.$refs.multipleTable.sort('createTime', 'descending');// 设置默认排序
      this.currentPage = 1; // 回退到第一页
      this.start = 1;
      // if(this.nodeState===0){
      //   this.getListFn(2,'',1);
      // }else{
      //   this.getListFn();
      // }
    },
    handleCurrentChange(val) { // 更改当前页
      let t = this;
      this.currentPage = val;
      this.start = ((this.currentPage - 1) * this.pageSize) + 1;
      if (this.nodeState === 0) {
        this.getListFn(2, t.searchVal, 1);
      }
      else {
        this.getListFn(t.sortType);
      }
    },
    toExamine() { // 点击批量审核
      this.isExamine = true;
      this.currentPage = 1; // 回退到第一页
      this.start = 1;
      // this.$refs.multipleTable.doLayout();
      this.checked();// 在点击批量审核时进行判断是否有已经选择的项，如果有则进行默认选择
    },
    getRowKeys(row) { // 获取row的key值
      return row.nodeId;
    },
    selectionChange(val) { // 多选触发事件
      let t = this;
      // let oldNodeId = [];//用来存放老的nodeid
      if (val) {
        t.checkNum = val.length;
        // t.totalNodesNum = parseInt(t.checkNum)+parseInt(t.surplusNum);
        t.totalNodesNum = parseInt(t.checkNum);
        t.nodeIds = [];
        for (let i = 0; i < val.length; i++) {
          if (t.nodeIds.indexOf(val[i].nodeId) < 0) {
            if (val[i].nodeId) {
              t.nodeIds += val[i].nodeId + ',';
              // oldNodeId.push(val[i].nodeId)//将选中的nodeid进行保存
            }
          }
          // console.log(oldNodeId);
          // console.log(t.surplusNodeId)
          // for(let j = 0;j<t.surplusNodeId[0].length;j++){
          //   console.log(oldNodeId)
          //   if(oldNodeId.indexOf(t.surplusNodeId[0][j])<0){//说明取消了选择
          //     t.surplusNodeId[0].splice(t.surplusNodeId[0][j], 1);//将取消后的nodeid进行删除
          //     t.checkNum = t.surplusNodeId.length;
          //   }
          // }
        }
      }
      // console.log('已选择'+val.length+'条数据，nodeId是'+t.nodeIds)
    },
    TabCli(type) { // 待审核、已通过、已屏蔽按钮点击
      let t = this;
      t.sortType = '2';// 筛选项条件变化，排序回归默认，
      t.$refs.multipleTable.clearSort();// 清空排序
      t.$refs.multipleTable.sort('createTime', 'descending');// 设置默认排序
      t.currentPage = 1; // 回退到第一页
      t.start = 1;
      t.nodeState = type;
      document.getElementsByClassName('nodeWait')[0].classList.remove('active');
      document.getElementsByClassName('nodePass')[0].classList.remove('active');
      document.getElementsByClassName('nodeRefuse')[0].classList.remove('active');
      if (type === 0) {
        document.getElementsByClassName('nodeWait')[0].classList.add('active');
      }
      else if (type === 1) {
        document.getElementsByClassName('nodePass')[0].classList.add('active');
      }
      else {
        document.getElementsByClassName('nodeRefuse')[0].classList.add('active');
      }
    },
    getListFn(type, keyWord, isWait) { // 取笔记列表--type:排序类型。keyWord:搜索关键字。isWait：存在则表示是待审核列表进行分页点击不进行请求接口。
      let t = this;
      if (isWait) {
        t.listDatas = t.waitData.slice(t.start - 1, t.start + t.pageSize - 1);
      }
      else {
        let params = {
          keyWord: keyWord || undefined, // 如果在切换时也进行keyword检索则传入一个全局变量即可，如果不需要则传入一个形参
          nodeState: t.nodeState,
          sortType: type,
          userId: t.userId// userId
        };
        if (t.nodeState === 0) { // 表示是待审核
          params.firstResult = '';
          params.maxResult = '';
        }
        else {
          params.firstResult = (t.currentPage - 1) * t.pageSize;
          params.maxResult = t.pageSize;
        }
        let callback = (res) => {
          if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
            let data = res.data.responseObject.responseData.dataList;
            // 方法三：将数据进行处理
            t.listDatas = [];
            t.waitData = [];
            if (data && data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                let _data = data[i];
                let dataJson = {
                  createTime: _data.createTime ? t.dateLocalJoint(t.localTime, _data.createTime) : '',
                  nodeDesc: t.nodeState === 0 ? ((_data.nodeDesc && _data.nodeDesc.length > 27) ? _data.nodeDesc.substring(0, 27) + '...' : _data.nodeDesc) : (_data.nodeDesc && _data.nodeDesc.length > 25) ? _data.nodeDesc.substring(0, 25) + '...' : _data.nodeDesc,
                  nodeNum: _data.nodeNum,
                  videoName: _data.videoName ? '《' + _data.videoName + '》' : '',
                  refCustomerId: _data.refCustomerId,
                  videoId: _data.videoId,
                  opUserName: _data.opUserName,
                  nodeId: _data.nodeId
                };
                if (t.nodeState === 0) { // 表示是待审核列表
                  t.waitData.push(dataJson);
                  t.listDatas = t.waitData.slice(t.start - 1, t.start + t.pageSize - 1);
                }
                else {
                  t.listDatas.push(dataJson);
                }
              }
            }
            // console.log(t.listDatas);
            // 方法二：如果不在乎数据样式，此处打开展示的为未处理的数据
            // if(t.nodeState===0){//表示是待审核列表
            //   t.waitData.push(dataJson);
            // t.waitData = res.data.responseObject.responseData.data_list;
            //   t.listDatas =  t.waitData.slice(t.start-1,t.start+t.pageSize-1);
            // }else {
            //   t.listDatas = res.data.responseObject.responseData.data_list;
            //   t.listDatas.push(dataJson)
            // }
            t.totalNum = res.data.responseObject.responseData.totalCount;
          }
        };
        this.getListAxios(apiConfig.getVideoNodesList.url, params, callback, apiConfig.getVideoNodesList.type);
      }
    },
    tableSortChange(column, prop, order) { // 筛选点击更改列表数据
      let t = this;
      t.currentPage = 1; // 回退到第一页
      t.start = 1;
      if (column.prop === 'refCustomerId') {
        this.sortType = column.order === 'ascending' ? 4 : 5;
      }
      else if (column.prop === 'videoId') {
        this.sortType = column.order === 'ascending' ? 6 : 7;
      }
      else if (column.prop === 'createTime') {
        this.sortType = column.order === 'ascending' ? 3 : 2;
      }
      else if (column.prop === 'opUserName') {
        this.sortType = column.order === 'ascending' ? 8 : 9;
      }
      this.getListFn(this.sortType);// 在改变排序类型时请求数据，同时初始化时，默认时间逆序故也在此调用了，用作数据初始化
    },
    rowClick(row, column, cell, event) {
      let t = this;
      if (t.nodeState !== 0) {
        t.$router.push({
          name: 'videoNodesDesc',
          query: {
            nodeId: row.nodeId,
            nodeState: t.nodeState,
            sortType: t.sortType ? t.sortType : '',
            keyWord: t.searchVal ? t.searchVal : ''
          }
        });
      }
    },
    searchBtn() { // 点击搜索按钮
      let t = this;
      let val = document.getElementById('searchVal').value;
      t.currentPage = 1; // 回退到第一页
      t.start = 1;
      t.getListFn(2, val);
      t.searchVal = val;
    },
    createNode() { // 点击进入审核
      let t = this;
      if (t.totalNodesNum > 0) { // 如果有待审核的笔记
        // if(t.surplusNodeId.length>0){
        //   t.totalNodeIds.push(t.surplusNodeId);//首先将待审核id
        // }
        if (t.checkNum > 0) { // 如果有选择的笔记，走入接口并进入审核详情页
          t.totalNodeIds.push((t.nodeIds).substring(0, t.nodeIds.length - 1));// 其次将选择的id加入
          t.totalNodeIds = t.totalNodeIds.join(',').split(',');
          let params = {
            userId: t.userId,
            nodeIds: t.totalNodeIds.join(',')
          };
          let callback = function(res) {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              t.$router.push({
                name: 'videoNodesDesc',
                query: {
                  nodeId: t.totalNodeIds[0],
                  nodeState: 0,
                  sortType: t.sortType ? t.sortType : '',
                  keyWord: t.searchVal ? t.searchVal : ''
                }
              });
            }
          };
          let errorcall = function(res) {
            t.$message({
              message: '批量审核失败，请重试。',
              type: 'warning',
              center: true
            });
          };
          t.getListAxios(apiConfig.createUserNode.url, params, callback, apiConfig.createUserNode.type, errorcall);
        }
        else { // 如果没有选择的笔记，但是存有未审核的笔记直接跳转到审核详情页
          t.$router.push({
            name: 'videoNodesDesc',
            query: {
              nodeId: t.totalNodeIds[0][0][0],
              nodeState: 0
            }
          });
        }
      }
      else {
        this.$message({
          message: '请选择笔记',
          type: 'error',
          center: true
        });
      }
    },
    getNodeNum() { // 获取未审核的笔记数量
      let t = this;
      let params = {
        userId: t.userId
      };
      let callback = function(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.nodeNum) {
          if (res.data.responseObject.responseData.nodeNum > 0) { // 如果存在未审核的笔记
            t.surplusNum = res.data.responseObject.responseData.nodeNum;
            t.totalNodesNum = parseInt(t.surplusNum);
            t.surplusNodeId.push(res.data.responseObject.responseData.dataList);
          }
        }
      };
      t.getListAxios(apiConfig.getUserNodeNum.url, params, callback, apiConfig.getUserNodeNum.type);
    },
    local_time: function() { // 获取当前年
      let t = this;
      let local = new Date();
      let year = local.getFullYear();
      let month = local.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      let day = local.getDate();
      if (day < 10) {
        day = '0' + day;
      }
      let time = local.toTimeString().substr(0, 8);
      let localTime = year + '-' + month + '-' + day + ' ' + time;
      t.localTime = localTime;
    },

    dateLocalJoint(date1, date2, sign) { // date1开始时间，date2结束时间(当前时间)
      let result;
      let signal = (sign !== undefined && sign !== '') ? sign : '*';
      let d1 = date1.substring(0, 10).replace(/-/g, signal);
      let d1Arr = d1.toString().split(signal);
      let d2 = date2.substring(0, 10).replace(/-/g, signal);
      let d2Arr = d2.toString().split(signal);
      let d3 = date2;
      if (parseInt(d2Arr[0]) < parseInt(d1Arr[0])) { // 如果跨年
        result = d3.substring(0, 16);
      }
      else { // 同一年
        if (new Date().getFullYear() === parseInt(d1Arr[0])) { // 如果开始年份是当前年则不显示年份
          if (Date.parse(new Date(d1)) === Date.parse(new Date(d2))) { // 如果是同一天
            result = d3.substring(11, 16);
          }
          else {
            result = d3.substring(5, 16);
          }
        }
      }
      return result;
    },
    checked() { // 判断如果当前用户已经将笔记加入到自己的待审核列表中，则进行数据的默认选择操作。
      let t = this;
      let newArr = [];
      for (let i = 0; i < t.waitData.length; i++) {
        if (t.surplusNodeId[0]) {
          for (let j = 0; j < t.surplusNodeId[0].length; j++) {
            if (parseInt(t.waitData[i].nodeId) === parseInt(t.surplusNodeId[0][j])) {
              newArr.push(i);
            }
          }
        }
      }
      for (let z = 0; z < newArr.length; z++) {
        this.$refs.multipleTable.toggleRowSelection(t.waitData[newArr[z]], true);
      }
    },
    getListAxios(path, params, callback, type, errorCallback) { // 获取数据公共方法
      comm.openLoading('加载中...');
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          comm.closeLoading();
          callback && callback(res);
        }).catch((e) => {
          comm.closeLoading();
          errorCallback && errorCallback();
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          comm.closeLoading();
          callback && callback(res);
        }).catch((e) => {
          comm.closeLoading();
          errorCallback && errorCallback();
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  filters: {
    timeFile(data) {
      return data.substring(0, data.length - 1);
    }
  },
  mounted() {
    let t = this;
    t.getNodeNum();// 获取未审核笔记的数量
    t.local_time();// 获取当前时间
    document.getElementById('searchVal').onkeyup = function(event) {
      if (event.keyCode === '13') {
        t.getListFn('', document.getElementById('searchVal').value);
      }
    };
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
