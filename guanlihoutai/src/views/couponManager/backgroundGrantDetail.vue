<template>
  <section class="background-grant-detail-container">
    <h3>优惠券 / 发放优惠券</h3>
    <section class="coupon-info-area">
      <h2 class="detail-content-title"><i class="icon-bg"></i><span>优惠券信息</span></h2>
      <el-form label-width="120px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="优惠券名称">
              <el-input :disabled="true" v-model="formData.couponName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="优惠券批次号">
              <el-input :disabled="true" v-model="formData.couponBatchCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="已发放数量">
              <el-input :disabled="true" v-model="formData.grantCount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="剩余数量">
              <el-input :disabled="true" v-model="formData.ungrantCount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </section>
    <section class="coupon-info-area">
      <h2 class="detail-content-title"><i class="icon-bg"></i><span>发放信息</span></h2>
      <el-form
        ref="grantForm"
        label-width="120px"
        :model="grantFormData"
        :rules="grantFormRules"
      >
        <el-form-item label="目标用户" prop="customerDataList">
          <div class="teacher-tag-list" :model="grantFormData.customerDataList">
            <el-tag
              class="el-tag-item"
              v-for="(customer,index) in grantFormData.customerVOList"
              :key="index"
              :type="''"
              closable
              @close="handleRemoveTag(customer)"
            >
              {{customer.customerName}}
            </el-tag>
          </div>
          <el-button @click="btnAddTeacherOnClick" class="btn-add-teacher" :disabled="formData.ungrantCount === 0">
            添加用户
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="btnConfirmOnClick" :disabled="formData.ungrantCount === 0">确认发放</el-button>
        </el-form-item>
      </el-form>
      <hr color="#dcdfe6"/>
      <h2 class="detail-content-title"><i class="icon-bg"></i><span>发放记录</span></h2>
      <section class="coupon-manager-table">
        <el-table
          :data="tableData"
          :fit="true"
          style="width: 100%"
        >
          <el-table-column
            prop="id"
            width="200"
            label="序号">
          </el-table-column>
          <el-table-column
            prop="customerId"
            width="200"
            label="用户ID">
          </el-table-column>
          <el-table-column
            prop="customerName"
            width="180"
            label="用户姓名">
          </el-table-column>
          <el-table-column
            width="160"
            prop="publishCount"
            label="发放数量">
          </el-table-column>
          <el-table-column
            width="180"
            prop="publishUser"
            label="发放人">
          </el-table-column>
          <el-table-column
            prop="publishTime"
            label="发放时间">
          </el-table-column>
        </el-table>
      </section>
      <el-row>
        <el-col>
          <section class="coupon-manager-pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="paginationData.currentPage"
              :total="paginationData.total"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="paginationData.pageSize"
              layout="total, prev, pager, next, jumper ,sizes"
            >
            </el-pagination>
          </section>
        </el-col>
      </el-row>
    </section>
    <el-dialog
      :center=true
      :lock-scroll=false
      :title="teacherDialogData.title"
      :visible.sync="teacherDialogData.visible"
      custom-class="edit-dialog"
      top="18vh"
      v-if="teacherDialogData.visible"
      width="770px"
    >
      <section>
        <el-row>
          <el-col :span="12">
            <el-input type="text" v-model="teacherDialogData.customerId" name="customerId"
                      placeholder="用户ID/用户姓名"></el-input>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-button @click="searchBtnOnClick">搜索</el-button>
          </el-col>
        </el-row>
        <section class="source-list">
          <el-table
            :data="teacherDialogData.rowData"
            :default-sort="{prop: 'sortId', order: 'descending'}"
            :fit="true"
            :row-class-name="tableRowClassName"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="center"
              label="选择"
              prop="index"
              width="150"
              type="selection"
            >
            </el-table-column>
            <el-table-column
              align="center"
              label="用户ID"
              prop="customerId"
              width="250"
            >
            </el-table-column>
            <el-table-column
              align="center"
              header-align="center"
              label="用户姓名"
              prop="fullName"
              width="250">
            </el-table-column>
          </el-table>
        </section>
      </section>
      <el-row class="pagination" style="margin:20px 0">
        <el-col :span="7">
          <el-pagination
            :current-page="teacherDialogData.paginationData.currentPage"
            :page-size="teacherDialogData.paginationData.pageSize"
            :page-sizes="[10, 20, 30, 40]"
            :total="teacherDialogData.paginationData.total"
            @current-change="teacherHandleCurrentChange"
            @size-change="teacherHandleSizeChange"
            layout="total,sizes, prev, pager, next, jumper"
            v-show="teacherDialogData.paginationData.total>0"
          >
          </el-pagination>
        </el-col>
      </el-row>
      <section style="clear:both; height:50px; margin-top:20px;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="teacherDialogData.visible = false">取 消</el-button>
            <el-button type="primary" @click="saveTeacherList">确 定</el-button>
          </span>
      </section>

    </el-dialog>
  </section>
</template>

<script>
/**
 * 功能描述：后台主动发放-详情页面
 * 参数说明：
 * 注意事项：
 *
 * Create by YaoQiao on 2019-05-31
 */
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'backgroundGrantDetail',
  data() {
    return {
      id: '', // 优惠券批次id
      formData: {
        couponName: '', // 优惠券名称
        couponBatchCode: '', // 批次号
        grantCount: 0, // 已发放数量
        ungrantCount: 0 // 剩余数量
      },
      tableData: [], // 已发放的列表数据
      grantFormData: {
        customerDataList: [], // 用户id数组
        customerVOList: [] // 用户数组
      },
      grantFormRules: {
        customerDataList: [{ required: true, message: '请添加目标用户' }]
      },
      paginationData: {
        currentPage: 1,
        firstResult: 0,
        maxResult: 0,
        pageSize: 10, // 默认显示10条
        total: 0
      },
      teacherDialogData: {
        title: '添加用户',
        visible: false,
        keyword: '',
        rowData: [],
        multiSelection: [],

        // 分页参数
        paginationData: {
          currentPage: 1, // 当前页
          firstResult: 0,
          maxResult: 10,
          pageSize: 10, // 默认显示10条
          total: 0 // 总数
        }
      }
    };
  },
  methods: {
    getRecordListData() {
      // 获取数据列表
      this.paginationData.maxResult = this.paginationData.pageSize;
      this.paginationData.firstResult = (this.paginationData.currentPage - 1) * this.paginationData.pageSize;
      let data = {
        firstResult: this.paginationData.firstResult,
        maxResult: this.paginationData.maxResult,
        couponBatchId: this.id
      };
      axios({
        method: apiUrlConfig.getCouponPublishList.type,
        url: apiUrlConfig.getCouponPublishList.url,
        params: data
      }).then((res) => {
        this.tableData = [];
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
          let responseData = res.data.responseObject.responseData;
          if (responseData) {
            this.tableData = responseData.items;
            this.paginationData.total = responseData.total;
          }
        }
        else {
          this.$allin_confirm({ title: '提示', content: '发放记录查询失败', type: 'notice' });
        }
      }).catch((err) => {
        this.$allin_confirm({ title: '提示', content: '发放记录查询失败', type: 'notice' });
        console.log('获取数据失败', err);
      });
    },
    getDetailData() {
      // 编辑时，获取详情数据
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCouponById.type,
        url: apiUrlConfig.getCouponById.url,
        params: {
          id: this.id
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          this.formData.couponName = responseData.couponName;
          this.formData.couponBatchCode = responseData.couponBatchCode;
          this.formData.publishCount = responseData.publishCount;
          this.formData.grantCount = responseData.receiveCount;
          this.formData.ungrantCount = responseData.publishCount - responseData.receiveCount;
        }
        else {
          this.$allin_confirm({ title: '提示', content: '优惠券信息查询失败', type: 'notice' });
          console.log('获取数据失败');
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({ title: '提示', content: '优惠券信息查询失败', type: 'notice' });
        console.log('获取数据失败', err);
      });
    },
    // 分页器相关事件处理函数 开始
    handleSizeChange(val) {
      // 每页显示条数变化
      this.paginationData.pageSize = val;
      this.getRecordListData();
    },
    handleCurrentChange(val) {
      // 当前页变化
      this.paginationData.currentPage = val;
      this.getRecordListData();
    }, // 分页器相关事件处理函数 结束
    searchBtnOnClick() {
      // 清空当前已选择的用户
      this.teacherDialogData.multiSelection = [];
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.searchTeacher();
    },
    btnAddTeacherOnClick() {
      this.teacherDialogData.visible = true;
      // 清空当前已选择的用户
      this.teacherDialogData.multiSelection = [];
      this.teacherDialogData.customerId = '';
      this.teacherDialogData.paginationData.firstResult = 0;
      this.teacherDialogData.paginationData.maxResult = 10;
      this.teacherDialogData.paginationData.currentPage = 1;
      this.searchTeacher();
    }, // 注意：本页面的 searchTeacher 与 付费课中的 "添加讲师" 用的是相同的接口，故方法名直接使用 Teacher 相关
    searchTeacher() {
      let _this = this;

      let params = {
        customerId: _this.teacherDialogData.customerId,
        firstResult: _this.teacherDialogData.paginationData.firstResult,
        maxResult: _this.teacherDialogData.paginationData.maxResult

      };
      if (!_this.teacherDialogData.customerId) {
        params.customerId = null;
      }

      axios({
        url: apiUrlConfig.searchTeacherList.url,
        method: apiUrlConfig.searchTeacherList.type,
        params: params
      }).then(function(data) {
        comm.closeLoading();
        _this.teacherDialogData.rowData = data.data.responseObject.responseData.dataList;
        _this.teacherDialogData.paginationData.total = data.data.responseObject.responseData.totalCount;
      });
    },
    // 用户搜索弹窗里的分页处理
    teacherHandleSizeChange(val) {
      this.teacherDialogData.paginationData.maxResult = val;
      this.searchTeacher();
    },
    // 用户搜索弹窗里的分页处理
    teacherHandleCurrentChange(val) {
      this.teacherDialogData.paginationData.currentPage = val;
      this.teacherDialogData.paginationData.firstResult = (val - 1) * this.teacherDialogData.paginationData.maxResult;
      this.searchTeacher();
    },
    // 确认添加医师
    saveTeacherList() {
      let _this = this;
      let customerVOList = _this.grantFormData.customerVOList;
      let customerDataList = _this.grantFormData.customerDataList;
      if (this.teacherDialogData.multiSelection.length > 0) {
        this.teacherDialogData.multiSelection.map(function(item, index) {
          if (_this.checkTeacherNoRepeat(item.customerId, customerVOList, 1)) {
            customerVOList.push({
              customerName: item.fullName,
              customerId: item.customerId
            });
          }
          if (_this.checkTeacherNoRepeat(item.customerId, customerDataList, 2)) {
            customerDataList.push(item.customerId.toString());
          }
        });

        _this.$set(_this.grantFormData, 'customerVOList', customerVOList);
        _this.$set(_this.grantFormData, 'customerDataList', customerDataList);

        this.teacherDialogData.visible = false;
        this.$refs.grantForm.validateField('customerDataList');
      }
      else {
        this.$message('请选择需要添加的用户');
      }
    },
    // 判断用户是否重复，根据 customerId 判断,如果没有重复，则返回 true
    // dataList 分为两种，一种是object的数组 ，一种是 customerId 的数组
    // type ,1 表示 object 对象数组，2 表示 customerId 数组
    checkTeacherNoRepeat(customerId, dataList, type) {
      for (let i = 0, len = dataList.length; i < len; i++) {
        if (type === 1) {
          if (customerId.toString() === dataList[i].customerId.toString()) {
            return false;
          }
        }
        else if (type === 2) {
          if (customerId.toString() === dataList[i]) {
            return false;
          }
        }
      }
      return true;
    },
    // 用户复选框变更时
    handleSelectionChange(val) {
      this.teacherDialogData.multiSelection = val;
    },
    tableRowClassName({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex + 1;
    },
    handleRemoveTag(customer) {
      this.grantFormData.customerVOList.splice(this.grantFormData.customerVOList.indexOf(customer), 1);
      this.grantFormData.customerDataList.splice(this.grantFormData.customerDataList.indexOf(customer.customerId), 1);
    }, // 确认发放按钮点击处理事件
    btnConfirmOnClick() {
      // 校验是否为空
      this.$refs.grantForm.validate((valid) => {
        if (valid) {
          // 如果当前选择添加的用户数大于剩余数量，则不允许提交，同时给出提示
          if (this.grantFormData.customerDataList.length > this.formData.ungrantCount) {
            this.$allin_confirm({
              title: '提示',
              content: '当前优惠券剩余数量不足，请修改发放人数',
              type: 'notice'
            });
          }
          else {
            let _data = {
              couponBatchId: this.id, // 优惠券批次ID
              publishUser: localStorage.getItem('userLoginName'), // 发放人
              customerIds: this.grantFormData.customerDataList.join(',') // 添加的用户ID
            };
            this.$allin_confirm({
              title: '提示',
              content: '提交后，优惠券将发放到指定用户账户中，是否确认？',
              done: () => {
                axios({
                  url: apiUrlConfig.publishCoupon.url,
                  method: apiUrlConfig.publishCoupon.type,
                  data: _data
                }).then((res) => {
                  if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                    this.$allin_confirm({
                      title: '提示',
                      content: `已成功发放给 ${res.data.responseObject.responseData} 个用户`,
                      type: 'notice',
                      done: () => {
                        this.grantFormData.customerDataList = [];
                        this.grantFormData.customerVOList = [];
                        this.getDetailData();
                        // 设置默认的页数为第1页
                        this.paginationData.currentPage = 1;
                        this.getRecordListData();
                      }
                    });
                  }
                  else {
                    this.$allin_confirm({
                      title: '提示',
                      content: `发放优惠券失败`,
                      type: 'notice'
                    });
                  }
                }).catch((err) => {
                  this.$allin_confirm({
                    title: '提示',
                    content: `发放优惠券失败`,
                    type: 'notice'
                  });
                  console.log('后台发放优惠券失败', err);
                });
              }
            });
          }
        }
        return false;
      });
    }
  },
  created() {
    window.onbeforeunload = function() {
      return '离开此网站，系统可能不会保存您所做的更改。';
    };
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getDetailData();
      this.getRecordListData();
    }
  }
};
</script>

<style scoped lang="scss">
  .background-grant-detail-container {
    width: 1200px;
    margin: 0 auto;
    background: #F6F7FA;
    margin-top: 32px;

    h3 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
      margin-bottom: 25px;
    }

    .coupon-info-area {
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 4px;
      margin-bottom: 30px;
    }

    .detail-content-title {
      margin-bottom: 20px;

      .icon-bg {
        background: #0687FF;
        width: 3px;
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        border-radius: 1px;
        margin-right: 5px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .teacher-tag-list {
      width: 360px;
      height: 120px;
      border: 1px solid #eeeeee;
      border-radius: 5px;
      float: left;
      overflow: scroll;
    }

    .btn-add-teacher {
      margin-left: 10px;
    }

    hr {
      margin-bottom: 40px;
    }

    .coupon-manager-table {
      margin-bottom: 40px;
    }

    .coupon-manager-pagination {
      float: right;
    }

    .el-tag-item {
      margin-left: 5px;
      margin-bottom: 5px;
    }
  }
</style>
