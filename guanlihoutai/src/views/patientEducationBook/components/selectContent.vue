<template>
  <section class="selectBox">
    <section class="selectConBox">
      <i class="closeBtn"></i>
      <h3 class="title">选择内容</h3>
      <!--筛选开始-->
      <aside class="screeningBox">
        <el-form :model="ruleForm" ref="ruleForm" label-width="68px" class="contentName">
          <el-form-item label="查询患教" prop="paEduName">
            <el-input v-model="ruleForm.paEduId" class="conInput" placeholder="患教名称"></el-input>
          </el-form-item>
          <el-form-item label="患教ID" prop="paEduId">
            <el-input v-model="ruleForm.paEduId" class="conInput" placeholder="患教ID"></el-input>
          </el-form-item>
          <p class="queryBtn">查询</p>

        </el-form>
      </aside>
      <!--筛选结束-->
      <!--表单部分开始-->
      <el-table
        :data="listArr"
        width="100%"
        class="ev-table"
        height="500"
      >
        <el-table-column
          prop="paEduTitle"
          label="患教标题"
          width="297"
        >
        </el-table-column>
        <el-table-column
          prop="paEduType"
          label="患教内容类型"
          width="128"
        >
        </el-table-column>
        <el-table-column
          prop="isValid"
          label="是否有效"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="isReprint"
          label="是否转载"
          width="181"
        >
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="操作"
        >
          <template slot-scope="scope">
            <p class="addBtn active">编辑</p>
          </template>
        </el-table-column>
      </el-table>
      <!--表单部分结束-->
      <!--列表分页开始-->
      <div class="block ev-pages">
        <el-pagination
          class="al-bs-pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30,50,100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <!--列表分页结束-->
    </section>

  </section>
</template>

<script>
export default {
  name: 'selectContent',
  data() {
    return {
      ruleForm: {
        paEduName: '', // 患教名称
        paEduId: ''// 患教ID
      },
      listArr: [
        {
          paEduTitle: '我也不知道是什么',
          paEduType: '文章',
          isValid: '有效',
          isReprint: '不是'
        },
        {
          paEduTitle: '啦啦啦啦',
          paEduType: '文章',
          isValid: '有效',
          isReprint: '不是'
        },
        {
          paEduTitle: '1234567884',
          paEduType: '文章',
          isValid: '有效',
          isReprint: '不是'
        }
      ],
      currentPage: 1, // 排序页码(分页组件)
      pageSize: 30, // 每页几条(分页组件)
      totalCount: 0, // 总数(分页组件依赖数据总数)
      maxResult: 30, // 接口请求中的分页参数
      firstResult: 0// 接口请求中的分页参数
    };
  },
  methods: {
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
    }
  }
};
</script>

<style>
  /*父层（可共用）*/
  .selectBox{
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    background-color: rgba(0,0,0,0.7);
  }
  /*内容区*/
  .selectConBox{
    width:880px;
    min-height:579px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    overflow: hidden;
  }
  /*关闭按钮（可共用）*/
  .closeBtn{
    position: absolute;
    right: 14px;
    top: 14px;
    width: 20px;
    height: 20px;
    background: url("/static/images/icons/icon-close-gray.png") no-repeat;
    background-size:contain;
    cursor: pointer;
  }
  /*标题（可共用）*/
  h3.title{
    font-size:20px;
    font-weight:600;
    color:rgba(34,34,34,1);
    line-height:20px;
    margin-top: 35px;
    text-align: center;
  }

  .screeningBox{
    margin-top: 32px;
    margin-left: 30px;
  }
/*筛选部分的名称label*/
.contentName{
  font-size:14px;
  font-weight:400;
  color:rgba(85,85,85,1);
}
/*input输入框样式重写开始*/
  .conInput{
    width:284px;
    height:32px;
    background:rgba(247,249,252,1);
    border-radius:3px;
    box-sizing: border-box;
  }
  .selectBox .el-form-item__label{
    line-height: 32px;
  }
  .selectBox .el-input__inner{
    height: 32px;
    line-height: 32px;
  }
  .selectBox .el-form-item__content{
    height: 32px;
  }
  .selectBox .el-form-item__content{
        line-height: 32px;
  }
  .selectBox .el-form-item{
     display: inline-block;
  }
  /*input输入框样式重写结束*/
  /*查询按钮*/
  .queryBtn{
    width:80px;
    height:32px;
    border-radius:3px;
    border:1px solid rgba(75,103,214,1);
    font-size:14px;
    font-weight:500;
    color:rgba(75,103,214,1);
    line-height:30px;
    text-align: center;
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    margin-left: 25px;
  }
  /*表单区域样式重写*/
  .selectBox .el-table__header-wrapper{
    border-top:1px solid rgba(230,230,232,1);
  }
  .selectBox .el-table thead{
      font-size:14px;
      font-weight:500;
      color:rgba(17,17,17,1);
  }
  .selectBox .el-table .el-table__row td:first-child .cell{
    padding-left: 30px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp:1;
    -webkit-box-orient:vertical;
    white-space: nowrap;
  }
  .selectBox .el-table .el-table__row td:last-child{
    border-left: 1px solid rgba(216,216,216,0.5);
    border-bottom:1px solid transparent;
  }
  .selectBox .el-table .el-table__row td:last-child .cell{
    padding-left: 30px;
  }
  .selectBox .el-table th:first-child .cell{
    padding-left: 30px;
  }
  .selectBox .el-table th:nth-last-child(2).is-leaf{
    padding-left: 20px;
    border-left: 1px solid rgba(216,216,216,0.5);
  }
  .el-table .cell .addBtn{
    width:74px;
    height:27px;
    border-radius:3px;
    border:1px solid rgba(75,103,214,1);
    text-align: center;
    line-height: 27px;
    cursor: pointer;
  }
  .el-table .cell .addBtn.active{
    border: 1px solid transparent;
    font-size:13px;
    font-weight:400;
    color:rgba(126,131,148,1);
    cursor: default;
  }
  .ev-pages{
    text-align: center;
    margin-top: 34px;
  }
</style>
