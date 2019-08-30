<template>
  <section class="patientEduContent">
    <article class="filterTop">
      <div class="TopTitle">患教手册</div>
      <div class="centerFilter">
        <div class="centerItem">
          <span class="titleName">手册名称</span>
          <el-input class="nameInput" placeholder="请输入内容" v-model="validFilter.manualName"></el-input>
        </div>
        <div class="centerItem">
          <span class="titleName">更新时间</span>
          <el-date-picker
            v-model="validFilter.auditTime"
            type="daterange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </div>
        <div class="centerItem">
          <span class="titleName">专业</span>
          <el-select class="majorSelect"
                     v-model="validFilter.majorArr"
                     collapse-tags
                     placeholder="全部">
            <el-option
              v-for="item in majorArrList"
              :key="item.labelId"
              :label="item.labelName"
              :value="item.labelId">
            </el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">属性</span>
          <el-select class="majorSelect"
                     v-model="validFilter.propertyArr"
                     collapse-tags
                     placeholder="全部">
            <el-option
              v-for="item in propertyArrList"
              :key="item.id"
              :label="item.tagName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">状态</span>
          <el-select class="majorSelect"
                     v-model="validFilter.stateArr"
                     collapse-tags
                     placeholder="全部">
            <el-option
              v-for="item in stateArrList"
              :key="item.id"
              :label="item.tagName"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="filterBtn">
          <el-row>
            <el-button @click.stop="resetBtnFn">重置</el-button>
            <el-button @click.stop="getList(1)">筛选</el-button>
          </el-row>
        </div>
      </div>
    </article>
    <section class="column-manager-button">
      <el-row :style="{display:(!isAdmin?'none':'')}">
        <el-col>
          <router-link :to="{ path: 'patientEduDesc'}">
            <el-button><span class="el-icon-circle-plus"></span>新建手册</el-button>
          </router-link>
        </el-col>
      </el-row>
    </section>
    <article class="patientLists">

      <el-table
        ref="multipleTable"
        :data="listDatas"
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column prop="nodeNum" label="序号" width="80" align="center" ></el-table-column>
        <el-table-column prop="manualName" label="手册名称" width="340"></el-table-column>
        <el-table-column prop="resourceNum" label="资源量" width="100" align="center"></el-table-column>
        <el-table-column prop="collectionNum" label="收录量" width="100" align="center"></el-table-column>
        <el-table-column prop="labelNameList" label="专业" width="220"></el-table-column>
        <el-table-column prop="lastUpdateTime" label="更新时间" width="200"></el-table-column>
        <el-table-column prop="openState" label="属性" width="80"></el-table-column>
        <el-table-column prop="state" label="状态" width="80"></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="maxResult"
        layout="total, prev, pager, next, jumper, sizes"
        :total="totalNum" v-if="totalNum>10">
      </el-pagination>
    </article>
  </section>
</template>
<style lang="scss">

  .column-manager-button{
    margin-top: 30px;
    margin-bottom: 30px;
    button{
      color: #4B67D6;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      span{
        padding-right: 2px;
      }
    }
  }
.patientEduContent{
  font-size: 0;
  width: 1200px;
  margin: 36px auto 0;
  /*顶部筛选*/
  .filterTop{
    font-size: 14px;
    position: relative;
    .TopTitle{
      font-size:20px;
      font-weight:600;
      color:rgba(44,52,58,1);
      line-height:20px;
      margin: 32px 0 20px 0;
    }
    .nameInput{
      width: 150px;
    }
    .majorSelect{
      width: 150px;
      .el-input__inner{
        height: 32px;
      }
    }
    .el-input__icon{
      line-height: 32px;
    }
    .filterBtn{
      position: absolute;
      right: 34px;
      button{
        color: #ffffff;
        width:90px;
        height:32px;
        border-radius:3px;
        border:1px solid rgba(75,103,214,1);
        text-align: center;
        /*line-height: 28px;*/
        cursor: pointer;
        &:first-child{
          font-size:14px;
          font-weight:400;
          color:rgba(44,52,58,1);
          line-height:14px;
          color: #2C343A;
          background-color: #ffffff;
          border: none;
        }
        &:last-child{
          background-color: #ffffff;
          font-size:14px;
          font-weight:400;
          color:rgba(75,103,214,1);
          line-height: 0;
        }
      }

    }
  }
  /*中间筛选项*/
  .centerFilter{
    width:1170px;
    height:140px;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 10px 0px rgba(42,53,102,0.04);
    border-radius:3px;
    padding: 25px 15px;
    font-size: 0;
    .centerItem{
      display: inline-block;
      margin-bottom: 20px;
      .titleName{
        font-size:14px;
        font-weight:400;
        color:rgba(85,85,85,1);
        line-height:14px;
        margin-right: 10px;
      }
      .el-select{
        width: 140px;
      .el-input__inner,.el-range-input{
      }
        background:rgba(247,249,252,1);
      }
      .el-date-editor--daterange,.el-select{
        margin-right: 35px;
      }
      .nameInput{
        margin:0 44px 0 0;
        .el-input__inner{
          width:140px;
          height:32px;
          border-radius:3px;
          border:1px solid rgba(230,230,232,1);
          font-size:14px;
          font-weight:400;
          line-height:14px;
        }
      }
      /*筛选项颜色 */
      .el-tag--info{
        color: #333333;
      }
    }
  }
  /*下方列表*/
  .creatBookBtn{
    background: none;
    width: 98px;
    height: 32px;
    border: 1px solid #4B67D6;
    border-radius: 3px;
    font-size: 14px;
    color: #4B67D6;
    cursor: pointer;
    margin: 30px 0 12px;
    /*新建手册icon*/
    &.el-icon-circle-plus:before{
      margin-right: 2px;
    }
  }
  /*heade颜色*/
  .el-table th>.cell{
    font-size:14px;
    font-weight:600;
    color:rgba(17,17,17,1);
  }
  /*所有项展示不下...显示*/
  .el-table td .cell{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
    white-space: nowrap;
    font-size:14px;
    font-weight:400;
    color:rgba(51,51,51,1);
  }
  /*分页数据居中显示*/
  .el-pagination{
    text-align: center;
    margin: 25px auto 33px;
  }
  .centerFilter .centerItem .el-date-editor--daterange, .patientEduContent .centerFilter .centerItem .el-select{
    height: 32px;
  }
  .filterTop .el-input__icon{
    height: 32px;
  }
  .el-date-editor .el-range-separator{
    height: 32px;
  }
}
</style>
<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import {getPageOperation} from '@/assets/js/utils/auth';
export default {
  name: 'patientEduList',
  data() {
    return {
      validFilter: {
        manualName: '', // 手册名称
        auditTime: '', // 时间选择
        majorArr: [], // 专业
        majorArrName: [], // 专业名称
        stateArr: '', // 状态
        propertyArr: ''// 属性
      },
      majorArrList: [], // 专业列表
      propertyArrList: [{
        tagName: '全部',
        id: ''
      }, {
        tagName: '公开',
        id: 1
      }, {
        tagName: '隐私',
        id: 2
      }],
      stateArrList: [{
        tagName: '全部',
        id: ''
      }, {
        tagName: '上架',
        id: 1
      }, {
        tagName: '下架',
        id: 2
      }],
      listDatas: [], // 数据列表
      totalNum: 0, // 数据总数
      currentPage: 1, // 当前页
      firstResult: 0, // 第一条索引
      maxResult: 10, // 每页几条
      manualNameLike: '', // 手册名称
      property: '', // 属性
      state: '', // 状态
      isAdmin: false// 管理员
    };
  },
  methods: {
    handleSizeChange(val) { // 更改每页数
      this.maxResult = val;
      this.firstResult = 0; // 回退到第一页
      this.currentPage = 1;
      this.getList();
    },
    handleCurrentChange(val) { // 更改当前页
      this.firstResult = (val - 1) * this.maxResult;
      this.currentPage = val;
      this.getList();
    },
    rowClick(row) {
      let t = this;
      if (this.isAdmin) { // 此处判断权限,是跳转到展示页
        t.$router.push({
          name: 'patientEduDesc',
          query: {
            manualId: row.manualId,
            isClassify: row.isClassify,
            idNum: row.id
          }
        });
      }
      else {
        t.$router.push({
          name: 'patientEduView',
          query: {
            mId: row.manualId,
            isClassify: row.isClassify,
            idNum: row.id
          }
        });
      }
    },
    majorArrFn() {
      let t = this;
      let param = {
        isValid: 1,
        firstResult: 0,
        maxResult: 99,
        labelType: 0,
        treeLevel: 1
      };
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items) {
          t.majorArrList = t.majorArrList.concat(res.data.responseObject.items);
        }
      }
      t.getListAxios(apiConfig.getLabelListNew.url, param, callback, apiConfig.getLabelListNew.type);
    },
    resetBtnFn() { // 重置按钮
      this.validFilter.manualName = '';// 手册名称
      this.validFilter.auditTime = '';// 时间选择
      this.validFilter.majorArr = '';// 专业
      this.validFilter.stateArr = '';// 状态
      this.validFilter.propertyArr = '';// 属性
    },
    getList(isFilter) { // 获取列表数据.传入isFilter表示是在做筛选操作此时将页码置为第一页
      let t = this;
      let param = {};
      if (isFilter) {
        t.firstResult = 0;
        t.currentPage = 1;
      }
      param.sortType = 1;
      param.firstResult = t.firstResult;
      param.maxResult = t.maxResult;
      param.isValid = 1;
      param.sourceType = 0;
      param.manualNameLike = t.validFilter.manualName ? t.validFilter.manualName : undefined;// 手册名称
      param.lastUpdateTimeGt = t.validFilter.auditTime[0] ? t.validFilter.auditTime[0] : undefined;// 开始时间
      param.lastUpdateTimeLt = t.validFilter.auditTime[1] ? t.validFilter.auditTime[1] : undefined;// 结束时间
      param.openState = t.validFilter.propertyArr ? t.validFilter.propertyArr : undefined;// 属性：1公开2私密（不允许被搜索）
      param.state = t.validFilter.stateArr ? t.validFilter.stateArr : undefined;// 状态：1上架2下架
      param.labelId = t.validFilter.majorArr ? t.validFilter.majorArr : undefined;// 专业id
      param.labelName = t.majorArrList.labelName;
      // 专业单选操作
      for (let j = 0; j < t.majorArrList.length; j++) {
        if (t.validFilter.majorArr === t.majorArrList[j].labelId) {
          param.labelName = t.majorArrList[j].labelName;
          break;
        }
      }
      // 专业多选操作
      // for(let i = 0;i<t.validFilter.majorArr.length;i++){//专业名称
      //   for(let j = 0;j<t.majorArrList.length;j++){
      //     if(t.validFilter.majorArr[i]==t.majorArrList[j].propertyId){
      //       if(!param.labelName){
      //         param.labelName = t.majorArrList[j].propertyName+','
      //       }else{
      //         param.labelName += t.majorArrList[j].propertyName+','
      //       }
      //     }
      //   }
      // }
      // if(param.labelName){
      //   param.labelName = param.labelName.substring(0,param.labelName.length-1);
      // }
      param.firstResult = t.firstResult;
      param.maxResult = t.maxResult;
      param.isValid = 1;
      function callback(res) {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items) {
          t.totalNum = res.data.responseObject.total;// 数据总数
          let data = res.data.responseObject.items;
          t.listDatas = [];
          if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              let _data = data[i];
              let dataJson = {
                nodeNum: parseInt((t.currentPage - 1) * t.maxResult + i + 1),
                id: _data.id,
                sortId: _data.sortId,
                manualName: _data.manualName,
                resourceNum: _data.resourceNum,
                collectionNum: _data.collectionNum,
                openState: _data.openState === 1 ? '公开' : '隐私',
                state: _data.state === 1 ? '上架' : '下架',
                // lastUpdateTime:_data.lastUpdateTime?t.dateLocalJoint(t.localTime,_data.lastUpdateTime):'',
                lastUpdateTime: _data.lastUpdateTime.substring(0, _data.lastUpdateTime.length - 2),
                manualId: _data.manualId,
                isClassify: _data.isClassify,
                labelNameList: _data.labelNameList
              };
              t.listDatas.push(dataJson);
            }
          }
        }
      }
      t.getListAxios(apiConfig.getManualList.url, param, callback, apiConfig.getManualList.type);
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
  mounted() {
    let t = this;
    let pageOperation = getPageOperation(this.$route.path);
    this.isAdmin = pageOperation === 721;
    t.majorArrFn();// 获取专业列表
    t.getList();// 获取默认的列表数据
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
