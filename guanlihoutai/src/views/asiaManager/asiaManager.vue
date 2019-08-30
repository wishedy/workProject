<template>
  <section class="asia-main-contains">
    <h1>ASIA用户后台</h1>
    <section class="search-area">
      <el-form
        ref="asiaManagerForm"
        :model="searchForm"
        label-width="94px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="加入时间">
              <el-date-picker
                v-model="createTime"
                type="daterange"
                align="right"
                start-placeholder="不限"
                end-placeholder="不限"
                range-separator="-"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="状态" prop="payState">
              <el-select
                v-model="searchForm.payState"
                placeholder="全部"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="未收到款项" value="1"></el-option>
                <el-option label="付款失败" value="2"></el-option>
                <el-option label="付款成功" value="3"></el-option>
                <el-option label="过期" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="支付模式" prop="payWith">
              <el-select
                v-model="searchForm.payWith"
                placeholder="全部"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="微信" value="1"></el-option>
                <el-option label="PayPal" value="2"></el-option>
                <el-option label="免缴" value="3"></el-option>
                <el-option label="电汇" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="注册来源" prop="registerSource">
              <el-select
                v-model="searchForm.registerSource"
                placeholder="全部"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="Asia网站" value="1"></el-option>
                <el-option label="手工录入" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <el-form-item label="用户姓名" prop="memberName">
              <el-input
                v-model="searchForm.memberName"
                placeholder="输入会员名字"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="search-form-submit">
            <el-form-item>
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="onSubmit">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="add_member_button">
      <el-row>
        <el-col>
          <el-button class="el-icon-circle-plus" @click="addButtonOnClick">新增会员</el-button>
        </el-col>
      </el-row>
    </section>
    <section class="source-list">
      <el-table
        :data="tableData"
      >
        <el-table-column
          prop="id"
          label="会员ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="会员名字"
          width="180"
          :formatter="fullNameFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="emailAddress"
          label="邮箱地址"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="contactNumber"
          label="联系电话"
          width="150"
        >
        </el-table-column>
        <el-table-column
          label="支付模式"
          width="140"
          class="payWith"
        >
          <template slot-scope="scope">
            <p>{{payWithFormatter(scope.row.payWith)}}</p>
            <p>
              <a
                href="javascript:;"
                class="aLink color-blue"
                @click="updatePayState(scope.row)"
              >
                {{payWithStateFormatter(scope.row.payWithState)}}
              </a>
            </p>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="加入时间"
          width="160"
          :formatter="createTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="payState"
          label="状态"
          width="120"
        >
          <template slot-scope="scope">
            <!--支付状态(订单状态) //1-未收到款项，2-付款失败，3-付款成功，4-过期-->
            <p
              v-if="parseInt(scope.row.payState) === 1"
              class="color-blue"
            >
              未确认收款
            </p>
            <p
              v-if="parseInt(scope.row.payState) === 2"
              class="color-red"
            >
              付款失败
            </p>
            <template v-if="parseInt(scope.row.payState) === 3">
              <p>有效至</p>
              <p>{{scope.row.expireTime&& scope.row.expireTime.substring(0,10)}}</p>
            </template>
            <template v-if="parseInt(scope.row.payState) === 4">
              <p class="color-red">有效至</p>
              <p class="color-red">{{scope.row.expireTime && scope.row.expireTime.substring(0,10)}}</p>
              <p class="color-red">已过期{{getDateGap(scope.row.expireTime)+"天"}}</p>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          prop="registerSource"
          label="注册来源"
          :formatter="registerSourceFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="180"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="230"
          label="操作"
          style="text-align: center"
        >
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="editButtonOnClick(scope.row)"
              class="editButton"
            >
              编辑
            </el-button>

            <el-button
              @keydown.native.prevent
              @click="viewButtonOnClick(scope.row)"
              class="viewButton"
            >
              查看信息
            </el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-row class="pagination">
        <el-col :span="10" :offset="5">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
    <AsiaManagerDialog
      :memberInfoForm="memberInfoForm"
      :dialogVisible="dialogVisible"
      :dialogEditType="dialogEditType"
      @dialogCloseHandle="dialogCloseHandle"
    ></AsiaManagerDialog>
  </section>
</template>
<script>

import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import AsiaManagerDialog from './components/AsiaManagerDialog';

export default {
  name: 'asia-manager',
  data() {
    // dialog编辑类型
    const DIALOG_EDIT_TYPE = {
      ADD: 1,
      VIEW: 2,
      EDIT: 3
    };

    return {
      searchForm: {
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        payState: '', // 1-未收到款项，2-付款失败，3-付款成功，4-过期
        payWith: '', // 微信：1; paypal: 2; 免缴: 3; 电汇: 4
        registerSource: '', // 1-Asia网站 2-手工录入
        memberName: '' // 会员名称
      },
      createTime: '',
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数 0
        maxResult: 20, // 分页参数 20
        sortType: 2 // 1正序，2倒序
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0, // 总数
      DIALOG_EDIT_TYPE: DIALOG_EDIT_TYPE,
      dialogEditType: DIALOG_EDIT_TYPE.ADD, // 1 新增 2 查看 3 编辑
      dialogVisible: false,
      memberInfoForm: {
        honor: '', // 荣誉称号
        firstName: '',
        lastName: '',
        nationality: '', // 国家
        contactNumber: '',
        emailAddress: '',
        address: '',
        city: '',
        zipCode: '', // 邮寄压缩码
        country: '',
        position: '', // 位置
        hospital: '',
        specialty: '', // 专业
        areaOfInterest: '', // 兴趣领域
        eduExperience: '', // 教育经历
        universityDegree: '', //
        payWith: '', // 支付方式
        dollar: '', // 美金（单位为分）
        trainingReceived: '',
        expireTime: '', // 会员过期时间
        id: '' // 用户ID
      }
    };
  },
  components: {
    AsiaManagerDialog
  },
  methods: {
    // 查询
    onSubmit() {
      if (Array.isArray(this.createTime) && this.createTime.length > 0) {
        this.searchForm.startTime = this.createTime[0];
        this.searchForm.endTime = this.createTime[1];
      }
      else {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }

      // 数据为空不提交
      let newObj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key].toString()) {
          newObj[key] = this.searchForm[key];
        }
      }

      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      // 针对两个时间字段
      this.tableParams = this.deepExtend({}, {
        firstResult: 0, // 分页参数 0
        maxResult: 20, // 分页参数 20
        sortType: 2 // 1正序，2倒序
      }, newObj);

      // 恢复默认值
      this.pageSize = 20;
      this.currentPage = 1;
      this.getTableData();
    },
    // form重置
    resetForm() {
      this.$refs['asiaManagerForm'].resetFields();
      // 对时间组件进行重置
      this.createTime = [];
      this.searchForm.startTime = '';
      this.searchForm.endTime = '';
    },
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getAsiaTableList.type,
        url: apiConfig.getAsiaTableList.url,
        params: this.tableParams
      }).then((response) => {
        if (response && response.data && response.data.responseObject.responseData) {
          let responseData = response.data.responseObject.responseData;
          this.tableData = responseData.dataList;
          this.total = responseData.total;
        }
        else {
          console.log('拉取表格数据失败：');
        }
        comm.closeLoading();
      }).catch((e) => {
        comm.closeLoading();
        console.log('拉取表格数据失败：', e);
      });
    },
    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = this.pageSize;

      this.tableParams.firstResult = 0;
      this.currentPage = 0;

      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (this.currentPage - 1) * this.pageSize;

      this.getTableData();
    },
    createTimeFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length) {
        return cellValue.substring(0, 16);
      }
    },
    fullNameFormatter(...getVal) {
      if (getVal[2] && getVal[2].length) {
        // <!--Prof. :1;  Dr. : 2;  Mr. : 3; Ms. : 4;-->
        switch (parseInt(getVal[0].honor)) {
          case 1:
            return 'Prof.' + getVal[2];
          case 2:
            return 'Dr.' + getVal[2];
          case 3:
            return 'Mr.' + getVal[2];
          case 4:
            return 'Ms.' + getVal[2];
          default:
            return '';
        }
      }
    },
    payWithFormatter(payWith) {
      // 微信：1; paypal: 2; 免缴: 3; 电汇: 4
      switch (parseInt(payWith)) {
        case 1:
          return '微信';
        case 2:
          return 'PayPal';
        case 3:
          return '免缴';
        case 4:
          return '电汇';
        default:
          return '';
      }
    },
    // 支付模式状态
    payWithStateFormatter(payWithState) {
      // 0-空 1-催缴付费（未付款） 2-催缴付费（过期）  3-确认款项到达
      switch (parseInt(payWithState)) {
        case 0:
          return '';
        case 1:
          return '催缴付费';
        case 2:
          return '催缴付费';
        case 3:
          return '确认款项到达';
        default:
          return '';
      }
    },
    // 更新支付状态(订单状态)
    updatePayState(row) {
      function sendMail() {
        return axios({
          method: apiConfig.asiaSendMail.type,
          url: apiConfig.asiaSendMail.url,
          data: {
            memberId: row.memberId,
            sendType: row.payWithState // 发送邮件的类型（1-催缴付费（未付款） 2-催缴付费（过期） 3-确认款项到达）
          }
        }).catch((e) => {
          console.log('邮件发送失败：', e);
        });
      }

      // 0-空 1-催缴付费（未付款） 2-催缴付费（过期）  3-确认款项到达
      let contentMsg = '';
      switch (parseInt(row.payWithState)) {
        // 对付费失败的信用卡渠道显示，点击后，弹窗提示“邮件已发送至对方邮箱”，弹窗按钮“知道了”，点击关闭弹窗。发送邮件模版为注册未付费的模版
        case 1:
        case 2: // 对过期的会员不管是什么支付模式都显示，点击后，弹窗提示“邮件已发送至对方邮箱”，弹窗按钮“知道了”，点击关闭弹窗。发送邮件模版为已到期邮件模版。
          comm.openLoading('发送中...');
          sendMail().then((response) => {
            if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
              this.getTableData();// 重新拉取表格数据
              this.$allin_confirm({title: '提示', content: '邮件已发送至对方邮箱', type: 'notice'});
              comm.closeLoading();
            }
            else {
              console.log('邮件发送失败：');
              comm.closeLoading();
            }
          });
          break;
        case 3:
          // 仅对电汇渠道显示，点击后弹窗二次确认“是否确认收到对方付款，确认后，会发送邮件给对方邮箱。”弹窗按钮为确认/取消
          contentMsg = '是否确认收到对方付款，确认后，会发送邮件给对方邮箱。';

          this.$allin_confirm({
            title: '提示',
            content: contentMsg,
            done: () => {
              comm.openLoading('发送中...');
              sendMail().then((response) => {
                if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
                  this.getTableData();// 重新拉取表格数据
                  comm.closeLoading();
                }
                else {
                  console.log('邮件发送失败：');
                  comm.closeLoading();
                }
              });
            }
          });
          break;
        default:
          contentMsg = '';
          break;
      }
    },
    registerSourceFormatter(row, column, cellValue) {
      // 1-Asia网站 2-手工录入
      switch (parseInt(cellValue)) {
        case 1:
          return 'Asia网站';
        case 2:
          return '手工录入';
        default:
          return '';
      }
    },
    addButtonOnClick() {
      this.dialogVisible = true;
      this.dialogEditType = this.DIALOG_EDIT_TYPE.ADD;// 1 新增 2 查看 3 编辑
      let newInfo = {};
      for (let key in this.memberInfoForm) {
        newInfo[key] = '';
      }
      this.memberInfoForm = newInfo;
    },
    viewButtonOnClick(row) {
      this.dialogVisible = true;
      this.dialogEditType = this.DIALOG_EDIT_TYPE.VIEW;
      this.memberInfoForm = row;
    },
    editButtonOnClick(row) {
      this.dialogVisible = true;
      this.dialogEditType = this.DIALOG_EDIT_TYPE.EDIT;
      this.memberInfoForm = row;
    },
    dialogCloseHandle(needUpdate) {
      this.dialogVisible = false;
      if (needUpdate) {
        this.getTableData();
      }
    },
    /*
      * 对象合并
      * 深复制,需要第一个参数为 {}
      * */
    deepExtend(out) {
      out = out || {};
      for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];
        if (!obj) {
          continue;
        }
        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              out[key] = this.deepExtend(out[key], obj[key]);
            }
            else {
              out[key] = obj[key];
            }
          }
        }
      }
      return out;
    },
    // 计算指定时间与当前时间的天数差别
    getDateGap(time) {
      let diffTime = new Date(time).getTime();
      let nowTime = new Date().getTime();
      let diffDay = Math.floor(Math.abs((diffTime - nowTime) / (24 * 3600 * 1000)));
      return diffDay;
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
    this.getTableData();

    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.dialogVisible) {
          this.onSubmit();
        }
      }
    };
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};

</script>
<style lang='scss'>
  .asia-main-contains {
    width: 1200px;
    margin: 20px auto;

    & > h1 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }

    .search-area {
      background: #fff;
      padding-top: 15px;
      margin-bottom: 24px;

      .search-form-submit {
        float: right;
        margin-right: 42px;

        button {
          &:nth-of-type(1) {
            border: none;
          }

          &:nth-of-type(2) {
            color: #4B67D6;
            border: 1px solid #4B67D6;
            border-radius: 4px;
            padding: 8px 30px;
          }
        }
      }

      .el-input__inner:not(.el-date-editor) {
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
      }
    }

    .add_member_button {
      margin-bottom: 24px;

      button {
        background: none;
        border: 1px solid #4B67D6;
        border-radius: 4px;
        padding: 8px 30px;
        font-size: 14px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(75, 103, 214, 1);
        line-height: 15px;

        &:hover {
          background-color: #ecf5ff;
        }
      }
    }

    .source-list {
      /*表头样式*/
      .el-table__header .cell,
      .el-table__fixed-header-wrapper .is-leaf .cell {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        line-height: 1.1;
      }

      .el-table__fixed-header-wrapper .is-leaf:last-of-type .cell {
        text-align: center;
      }

      .el-table__row {
        td {
          .cell {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 1.2;
          }

          &:last-of-type {
            text-align: center;
          }
        }
      }

      .color-blue {
        color: #4B67D6;
      }

      .color-red {
        color: #FF4F4F
      }

      .aLink {
        cursor: pointer;
        text-decoration: underline;
        margin-top: 6px;
      }

      //payState
      .payStateContent {
        p {
          line-height: 20px;
        }
      }

      .pagination {
        margin-top: 28px;
      }

      //编辑按钮
      .editButton {
        padding: 0;
        width: 74px;
        height: 28px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 13px;
        border: 1px solid #4B67D6;
        border-radius: 3px;
      }

      .viewButton {
        padding: 0;
        width: 74px;
        height: 28px;
        font-family: PingFangSC-Regular;
        color: #4B67D6;
        background: #EDF1FF;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        font-size: 13px;
        letter-spacing: 0;
      }
    }
  }

</style>
<style scoped lang="scss">
  .asia-over-hidden {
    overflow: hidden;
  }

  .el-select-dropdown__item {
    padding-left: 40px;
    position: relative;
    border-bottom: 1px solid rgba(230, 230, 232, 0.3);

    &:last-of-type {
      border-bottom: none;
    }

    &:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-unselected.png) center center no-repeat;
      content: "";
      display: block;
      width: 40px;
      height: 100%;
      position: absolute;
      opacity: 1;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.selected:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-selected.png) center center no-repeat;
    }
  }
</style>
