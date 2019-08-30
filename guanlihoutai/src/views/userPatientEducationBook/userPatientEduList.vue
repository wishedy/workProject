<template>
  <section class="listConent">
      <h1 class="titleName">用户患教手册</h1>
      <section class="userScreeningBox">
        <div class="centerItem">
          <span class="titleName">手册名称</span>
          <el-input class="nameInput" placeholder="手册名称" v-model="searchForm.manualName"></el-input>
        </div>
        <div class="centerItem">
          <span class="titleName">创建者</span>
          <el-input class="nameInput" placeholder="用户名" v-model="searchForm.authorName"></el-input>
        </div>
        <div class="centerItem">
          <span class="titleName">ID</span>
          <el-input class="nameInput" placeholder="用户ID" v-model="searchForm.authorId"></el-input>
        </div>
        <div class="centerItem">
          <span class="titleName">属性</span>
          <el-select v-model="searchForm.openState" placeholder="全部">
            <!--1- 上架 2-下架-->
            <el-option label="全部" value=""></el-option>
            <el-option label="公开" value="1"></el-option>
            <el-option label="隐私" value="2"></el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">主页</span>
          <el-select v-model="searchForm.homePage" placeholder="全部">
            <!--1- 上架 2-下架-->
            <el-option label="全部" value=""></el-option>
            <el-option label="显示" value="1"></el-option>
            <el-option label="不显示" value="0"></el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">专业</span>
          <el-select v-model="searchForm.major" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in majorArrList"
              :key="item.labelId"
              :label="item.labelName"
              :value="item.labelId">
            </el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">疾病阶段</span>
          <el-select v-model="searchForm.illness" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item in illArrList"
              :key="item.labelId"
              :label="item.labelName"
              :value="item.labelName">
            </el-option>
          </el-select>
        </div>
        <div class="centerItem">
          <span class="titleName">是否有资源</span>
          <el-select v-model="searchForm.hasResoure" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="有" value="1"></el-option>
            <el-option label="无" value="0"></el-option>
          </el-select>
        </div>
        <aside class="btnBox">
          <p class="resetBtn" @click.stop="resetForm">重置</p>
          <p class="screeningBtn" @click.stop="submitForm">筛选</p>
        </aside>
      </section>

    <article class="boxLists">
      <el-table
        :data="listDatas"
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column prop="nodeNum" label="序号" width="80" align="center" ></el-table-column>
        <el-table-column prop="manualName" label="手册名称" width="386"></el-table-column>
        <el-table-column prop="authorName" label="创建者" width="126" align="center"></el-table-column>
        <el-table-column prop="authorId" label="创建者ID" width="137" align="center"></el-table-column>
        <el-table-column prop="operatorTime" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="openState" label="属性" width="72"></el-table-column>
        <el-table-column prop="state" label="主页"></el-table-column>
      </el-table>
    </article>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="maxResult"
      layout="total, prev, pager, next, jumper, sizes"
      :total="totalNum" v-if="totalNum!=0">
    </el-pagination>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import {getPageOperation} from '@/assets/js/utils/auth';
export default {
  name: 'userPatientEduList',
  data() {
    return {
      searchForm: {
        manualName: '', // 手册名称
        authorName: '', // 用户名
        authorId: '', // 用户id
        openState: '', // 属性
        homePage: '', // 主页
        major: '', // 专业
        illness: '', // 疾病阶段
        hasResoure: ''// 是否有资源
      },
      submitObj: {
        manualName: '', // 手册名称
        authorName: '', // 用户名
        authorId: '', // 用户id
        openState: '', // 属性
        homePage: '', // 主页
        major: '', // 专业
        illness: '', // 疾病阶段
        hasResoure: ''// 是否有资源
      }, // 提交代码的数据
      listDatas: [], // 数据列表
      majorArrList: [], // 专业列表
      totalNum: 0, // 数据总数
      currentPage: 1, // 当前页
      firstResult: 0, // 第一条索引
      maxResult: 10, // 每页几条
      pageSize: 10, // 每页几条(分页组件)
      illArrList: [{
        'labelId': '1',
        'labelName': '疾病科普'
      },
      {
        'labelId': '2',
        'labelName': '疾病自查'
      },
      {
        'labelId': '3',
        'labelName': '保守治疗'
      },
      {
        'labelId': '4',
        'labelName': '手术前'
      },
      {
        'labelId': '5',
        'labelName': '手术中'
      },
      {
        'labelId': '6',
        'labelName': '手术后'
      },
      {
        'labelId': '7',
        'labelName': '疾病康复'
      },
      {
        'labelId': '0',
        'labelName': '暂无疾病阶段'
      }]// 疾病阶段列表数据
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
    // 点击一行跳转
    rowClick(row) {
      let _this = this;
      let pageOperation = getPageOperation('/userPatientEduList');// 获取权限
      _this.isAdmin = pageOperation === 721;
      if (_this.isAdmin) { // 此处判断权限,是跳转到展示页
        _this.$router.push({
          name: 'userPatientEduEdit',
          query: {
            manualId: row.manualId
          }
        });
      }
      else {
        _this.$router.push({
          name: 'userPatientEduView',
          query: {
            manualId: row.manualId
          }
        });
      }
    },
    // 筛选form重置
    resetForm() {
      let _this = this;
      _this.searchForm.manualName = '';
      _this.searchForm.authorName = '';
      _this.searchForm.authorId = '';
      _this.searchForm.openState = '';
      _this.searchForm.homePage = '';
      _this.searchForm.major = '';
      _this.searchForm.illness = '';
      _this.searchForm.hasResoure = '';
    },
    // 提交筛选操作
    submitForm() {
      let _this = this;
      _this.firstResult = 0; // 回退到第一页
      _this.currentPage = 1;
      _this.submitObj = {
        manualName: _this.searchForm.manualName.trim(), // 手册名称
        authorName: _this.searchForm.authorName.trim(), // 用户名
        authorId: _this.searchForm.authorId.trim(), // 用户id
        openState: _this.searchForm.openState, // 属性
        homePage: _this.searchForm.homePage, // 主页
        major: _this.searchForm.major, // 专业
        illness: _this.searchForm.illness === '暂无疾病阶段' ? '无' : _this.searchForm.illness, // 疾病阶段
        hasResoure: _this.searchForm.hasResoure// 是否有资源
      };// 提交代码的数据
      _this.getList();
    },
    // 获取列表
    getList() {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.userManualList.type,
        url: apiConfig.userManualList.url,
        params: {
          manualNameLike: _this.submitObj.manualName,
          authorName: _this.submitObj.authorName,
          authorId: _this.submitObj.authorId,
          openState: _this.submitObj.openState, // 属性：1-公开2-私密
          isViewFlag: _this.submitObj.homePage, // 主页：是否可见（0-不显示（患者端医生主页不可见）1-显示（患者端医生主页可见））
          labelIdList: _this.submitObj.major, // 专业标签
          illnessNameList: _this.submitObj.illness, // 疾病
          isHaveResource: _this.submitObj.hasResoure, // 是否有资源 1是0否
          firstResult: _this.firstResult,
          maxResult: _this.maxResult
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && comm.hasResponseData(res.data)) {
          let items = res.data.responseObject.responseData;
          _this.totalNum = items.totalNum;
          if (items.dataList && items.dataList.length) {
            _this.listDatas = [];
            for (let i = 0; i < items.dataList.length; i++) {
              let kv = items.dataList[i];
              let dataJson = {
                nodeNum: parseInt((_this.currentPage - 1) * _this.maxResult + i + 1),
                authorName: kv.authorName,
                authorId: kv.authorId,
                manualName: kv.manualName,
                manualId: kv.manualId,
                openState: kv.openState === 1 ? '公开' : '隐私',
                state: kv.isViewFlag === 1 ? '显示' : '不显示',
                operatorTime: kv.operatorTime.substring(0, kv.operatorTime.length - 2)
              };
              _this.listDatas.push(dataJson);
            }
          }
          else {
            _this.listDatas = [];
          }
        }
        else {
          _this.listDatas = [];
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取专业列表筛选项
    getMajorList() {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getLabelListNew.type,
        url: apiConfig.getLabelListNew.url,
        params: {
          isValid: 1,
          firstResult: 0,
          maxResult: 99,
          labelType: 0,
          treeLevel: 1
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.items) {
          _this.majorArrList = _this.majorArrList.concat(res.data.responseObject.items);
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    }
  },
  mounted() {
    let _this = this;
    _this.getList();// 获取列表
    _this.getMajorList();// 获取专业列表
  }
};
</script>
<style lang="scss" >
  .boxLists{
    padding: 10px 25px 0 25px;
    background-color: #ffffff;
    margin-bottom: 34px;
  }
  .listConent{
    font-size: 0;
    width: 1200px;
    margin: 36px auto 0;
  }
  .titleName{
    font-size:20px;
    font-weight:600;
    color:rgba(44,52,58,1);
    line-height:20px;
    margin: 32px 0 20px 0;
  }
  .userScreeningBox{
    position: relative;
    width:1200px;
    height:190px;
    background:rgba(255,255,255,1);
    box-shadow:0 4px 10px 0 rgba(42,53,102,0.04);
    border-radius:3px;
    margin-bottom: 30px;
    padding: 25px 15px;
    box-sizing: border-box;
  }
  .userScreeningBox{
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
      .el-input,.el-select{
        width: 140px;
      }
      .el-date-editor--daterange,.el-select{
        margin-right: 44px;
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
          line-height:32px;

        }
      }
      .el-input__inner{
        width: 140px;
        height: 32px;
        line-height: 32px;
        background-color:rgba(247,249,252,1);
      }
      /*筛选项颜色 */
      .el-tag--info{
        color: #333333;
      }
    }
  }

  .btnBox{
    margin-top: 24px;
    height: 32px;
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

  /*筛选条件覆盖*/
  .el-form-item{
    margin-bottom: 20px;
  }
  .el-input__inner{

  }
  .el-input__icon{
    line-height: 32px;
  }
  .boxLists .el-table th>.cell{
    font-size:14px;
    font-weight:600;
    color:rgba(17,17,17,1);
    line-height:14px;
  }
  .el-pagination{
    text-align: center;
    margin-bottom: 48px;
  }
  .el-table td:nth-child(2) .cell{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
  }
  .el-table th.is-center,.el-table td.is-center{
    text-align: left;
  }

</style>
