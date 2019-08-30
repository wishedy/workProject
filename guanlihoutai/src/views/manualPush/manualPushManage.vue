<template>
  <section class="crm-manualPush crm-manualPush-manage">
    <!--添加手动推送标题开始-->
    <h1 class="crm-manualPush-title">手动推送列表</h1>
    <!--添加手动推送标题结束-->
    <template>
      <section class="crm-manualPush-handle">
        <el-form ref="form" :model="handleForm" label-width="100px">
          <el-form-item label="场景">
            <el-select v-model="handleForm.messageScence" placeholder="场景">
              <el-option :label="item.description" :value="item.code" :key="item.code" v-for="(item) in messageScenceList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="操作人">
            <el-input v-model="handleForm.opUser" placeholder="请输入操作人" clearable></el-input>
          </el-form-item>
          <el-form-item label="提交时间">
            <el-date-picker
              v-model="handleForm.submissionTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="推送时间">
            <el-date-picker
              v-model="handleForm.pushTime"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="handleForm.status" placeholder="状态">
              <el-option :label="item.statusName" :value="item.statusType" :key="item.statusType" v-for="(item) in statusList" ></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="端口">
            <el-select v-model="handleForm.pushChannel" placeholder="端口">
              <el-option :label="item.channelName" :value="item.channelType" :key="item.channelType" v-for="(item) in channelList" ></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="标题">
            <el-input v-model="handleForm.messageTitle" placeholder="请输入推送标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="文案">
            <el-input v-model="handleForm.messageContent" placeholder="请输入推送标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="推送目的">
            <el-input v-model="handleForm.pushGoal" placeholder="请输入推送目的" clearable></el-input>
          </el-form-item>
        </el-form>
        <section class="crm-patientsEvaluation-control">
          <div class="crm-reset-table" @click.stop="resetForm">重置</div>
          <div class="crm-filtrate-table" @click.stop="getFilterList">筛选</div>
        </section>
      </section>
    </template>
    <section class="crm-manualPush-button">
      <el-row>
        <el-col>
          <el-button v-if="tableData.length>0 &&tokenData.zuultoken!==null">
            <span class="el-icon-circle-plus"></span>
            <a href="javascript:void(0);" @click='exportPushList'>导出</a>
          </el-button>
        </el-col>
      </el-row>
    </section>
    <template>
      <section class="crm-manualPush-table">
        <el-table
          border
          :data="tableData"
          width="100%"
          class="ev-table"
          ref="sortReset"
        >
        <el-table-column
          type="index"
          align="center"
          width="50">
          </el-table-column>
          <el-table-column
            prop="messageTitle"
            label="通知栏标题"
            :show-overflow-tooltip="true"
            width="120"
            align="center"
            :sort-orders="['descending','ascending']"
          >
          <template slot-scope="{ row }">
            <div>{{ row.messageTitle | nullFilter }}</div>
          </template>
          </el-table-column>
          <el-table-column
            prop="messageContent"
            label="通知栏内容（文案）"
            :show-overflow-tooltip="true"
            width="160"
            align="center"
          >
          <template slot-scope="{ row }">
            <div>{{ row.messageContent | nullFilter }}</div>
          </template>
          </el-table-column>
          <el-table-column
            prop="messageScenceStr"
            label="场景"
            :show-overflow-tooltip="true"
            width="120"
            align="center"
          >
          <template slot-scope="{ row }">
            <div>{{ row.messageScenceStr | nullFilter }}</div>
          </template>
          </el-table-column>
          <el-table-column
            prop="linkOrResource"
            label="场景ID"
            :show-overflow-tooltip="true"
            width="120"
            align="center"
          >
          <template slot-scope="{ row }">
            <div>{{ row.linkOrResource | nullFilter }}</div>
          </template>
          </el-table-column>
          <el-table-column
            prop="siteId"
            label="端口"
            width="120"
            align="center">
          <template slot-scope="scope">
            <section v-if="scope.row.crmPushStatInfos.length">
              <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                <p :class="`listChildBorder_${index}`">
                  <span>{{ opt.pushChannel | channelFilter }}</span>
                </p>
              </div>
            </section>
            <section v-else>
              <div v-for="(opt, index) in 3" class="portBox" :key="index">
                <p :class="`listChildBorder_${index}`">
                  <span>-</span>
                </p>
              </div>
            </section>
          </template>
          </el-table-column>
          <el-table-column
            prop="sendMessageCount"
            label="下发条数"
            align="center"
            min-width="100">
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.sendMessageCount | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            prop="sendCustomerCount"
            label="下发会员数"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.sendCustomerCount | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            label="到达数"
            prop="receiveMessageCount"
            align="center"
            width="100">
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.receiveMessageCount | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            label="到达率"
            prop="receiveRate"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.receiveRate | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            label="点击数"
            prop="clickNum"
            align="center"
            width="100">
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.clickNum | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            label="点击率"
            prop="clickRate"
            width="100"
            align="center"
          >
            <template slot-scope="scope">
              <section v-if="scope.row.crmPushStatInfos.length">
                <div class="portBox" v-for="(opt, index) in scope.row.crmPushStatInfos" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>{{ opt.clickRate | nullFilter }}</span>
                  </p>
                </div>
              </section>
              <section v-else>
                <div v-for="(opt, index) in 3" class="portBox" :key="index">
                  <p :class="`listChildBorder_${index}`">
                    <span>-</span>
                  </p>
                </div>
              </section>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="提交时间"
            prop="createTime"
            :show-overflow-tooltip="true"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="pushTime"
            label="推送时间"
            :show-overflow-tooltip="true"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="goalUser"
            label="目标用户"
            :formatter="formatteGoalUser"
            :show-overflow-tooltip="true"
            width="180">
            <template slot-scope="{ row }">
              <span>{{ formatteGoalUser(row) }}</span>
              <el-popover
                placement="right-start"
                title=""
                width="300"
                trigger="click">
                <span v-if="row.crmPushGroupInfoPO" style="color: #409EFF; font-size: 14px;cursor: pointer;padding-left: 10px;" slot="reference">查看详情</span>
                <ul class="opuser-detail-list">
                  <li v-if="row.crmPushGroupInfoPO['major']"><b>专&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;科：</b><span>{{ row.crmPushGroupInfoPO['major'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['companyAddress']"><b>医院地区：</b><span>{{ row.crmPushGroupInfoPO['companyAddress'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['medAddress']"><b>厂商地区：</b><span>{{ row.crmPushGroupInfoPO['medAddress'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['cityLevel']"><b>城市等级：</b><span>{{ row.crmPushGroupInfoPO['cityLevel'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['companyLevelId']"><b>医院等级：</b><span>{{ row.crmPushGroupInfoPO['companyLevelId'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['medicalTitleId']"><b>职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称：</b><span>{{ row.crmPushGroupInfoPO['medicalTitleId'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['state']"><b>认证状态：</b><span>{{ row.crmPushGroupInfoPO['state'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['customerRole']"><b>用户角色：</b><span>{{ row.crmPushGroupInfoPO['customerRole'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['activType']"><b>活跃用户类型：</b><span>{{ row.crmPushGroupInfoPO['activType'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['silentType']"><b>沉默用户类型：</b><span>{{ row.crmPushGroupInfoPO['silentType'] }}</span></li>
                  <li v-if="row.crmPushGroupInfoPO['isPay']"><b>是否付费：</b><span>{{ row.crmPushGroupInfoPO['isPay'] }}</span></li>
                </ul>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="pushGoal"
            label="推送目的"
            :show-overflow-tooltip="true"
            width="180">
            <template slot-scope="{ row }">
              <div>{{ row.pushGoal | nullFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :formatter="formatteStatus"
            label="状态"
            prop="status"
            align="center"
            :show-overflow-tooltip="true"
            width="100">
          </el-table-column>
          <el-table-column
            prop="opUser"
            label="操作人"
            align="center"
            :show-overflow-tooltip="true"
            width="100">
            <template slot-scope="{ row }">
              <div>{{ row.opUser | nullFilter }}</div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="100"
            align="center"
            fixed="right">
            <template slot-scope="scope" fixed="right">
              <div class="normal" v-if="(parseInt(scope.row.pushType) === 2 && parseInt(scope.row.status) === 1)"><!--新提交的状态下-->
                <div class="crm-patientsEvaluation-shield" @click.stop="triggerPush(scope.row)">取消推送</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </template>
    <template>
      <section class="crm-manualPush-pager">
        <div class="block ev-pages">
          <el-pagination
            class="al-bs-pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageIndex"
            :page-sizes="[10, 20, 30,40]"
            :page-size="pageSize"
            align="center"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount" v-if="totalCount!=0">
          </el-pagination>
        </div>
      </section>
    </template>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm.js';
import api from '@/api/apiUrlConfig';
// const xhrUrl = {
//   'list': '/mock/base-message-platform/manual/push/getManageList',
//   'export': '/mock/base-message-platform/manual/push/exportManageList',
//   'recall': '/mock/base-message-platform/crm/push/updatePushStatus'
// };
export default {
  data() {
    return {
      pageSize: 20,
      pageIndex: 1,
      firstResult: 0,
      maxResult: 20,
      totalCount: 10,
      handleForm: {
        messageScence: '',
        messageTitle: '',
        status: '',
        opUser: '',
        messageContent: '',
        pushGoal: '',
        submissionTime: [],
        pushTime: [],
        submissionStartTime: '',
        submissionEndTime: '',
        messageExecutionStartTime: '',
        messageExecutionEndTime: ''
      },
      // handleForm: {},
      statusList: [
        {
          statusType: 99,
          statusName: '已推送'
        },
        {
          statusType: 1,
          statusName: '未推送'
        }
      ],
      channelList: [
        {
          channelType: 1,
          channelName: 'IOS'
        },
        {
          channelType: 2,
          channelName: '安卓(友盟)'
        },
        {
          channelType: 3,
          channelName: '华为'
        }
      ],
      messageScenceList: [],
      exportOrderUrl: '',
      tokenData: {
        zuultoken: '111111'
      },
      tableData: []
    };
  },
  filters: {
    channelFilter: function(val) {
      return val === 1 ? 'IOS' : val === 2 ? '安卓(友盟)' : val === 3 ? '华为' : '-';
    },
    formatterName(name) {
      let reName = '';
      switch (name) {
        case 0:
          reName = 'major';
          break;
        case 1:
          reName = 'companyAddress';
          break;
        case 2:
          reName = 'medAddress';
          break;
        case 3:
          reName = 'cityLevel';
          break;
        case 4:
          reName = 'companyLevelId';
          break;
        case 5:
          reName = 'medicalTitleId';
          break;
        case 6:
          reName = 'state';
          break;
        case 7:
          reName = 'customerRole';
          break;
        case 8:
          reName = 'activType';
          break;
        case 9:
          reName = 'silentType';
          break;
        case 10:
          reName = 'isPay';
          break;
      }
      return reName;
    },
    nullFilter: function(val) {
      if (val === '') {
        return '-';
      }
      else {
        return val;
      }
    }
  },
  mounted() {
    let _this = this;
    _this.getList();
    _this.getSceneList();
  },
  methods: {
    getSceneList() { // 获取场景列表参数
      let _this = this;
      axios({
        method: api.getSelectList.type,
        url: api.getSelectList.url,
        params: {
          scence: 1
        }
      }).then((res) => {
        console.log(res);
        if (res && res.data) {
          _this.messageScenceList = res.data.responseObject;
        }
      }).catch((e) => {
        // 获取场景列表失败
      });
    },
    // list合并单元格
    manageSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([0, 1, 2, 3, 11, 12, 13, 14, 15, 16].includes(columnIndex)) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        }
        else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    resetForm() {
      let _this = this;
      _this.handleForm = {
        messageContent: '',
        messageExecutionEndTime: '',
        messageExecutionStartTime: '',
        messageScence: '',
        messageTitle: '',
        opUser: '',
        // pushChannel: '',
        pushGoal: '',
        pushTime: [],
        status: '',
        submissionEndTime: '',
        submissionStartTime: '',
        submissionTime: ''
      };
      _this.handleForm.submissionTime = '';
      _this.handleForm.pushTime = '';
      // console.log(_this.handleForm);
    },
    formatteStatus(row) {
      let status = parseInt(row.status, 10);
      let statusName = '';
      switch (status) {
        case 99:
          statusName = '已推送';
          break;
        case 1:
          statusName = '未推送';
          break;
      }
      return statusName;
    },
    formatteGoalUser(row) {
      let goalUser = parseInt(row.goalUser, 10);
      let reGoalUser = '';
      switch (goalUser) {
        case 1:
          reGoalUser = '全部用户';
          break;
        case 2:
          reGoalUser = '用户分组';
          break;
        case 3:
          reGoalUser = '指定用户';
          break;
        default:
          reGoalUser = '-';
      }
      return reGoalUser;
    },
    exportPushList() {
      let _this = this;
      let params = {
        firstResult: _this.firstResult,
        maxResult: _this.maxResult,
        messageExecutionStartTime: this.handleForm.pushTime === '' ? '' : this.handleForm.pushTime[0],
        messageExecutionEndTime: this.handleForm.pushTime === '' ? '' : this.handleForm.pushTime[1],
        submissionStartTime: this.handleForm.submissionTime === '' ? '' : this.handleForm.submissionTime[0],
        submissionEndTime: this.handleForm.submissionTime === '' ? '' : this.handleForm.submissionTime[1],
        ...(_this.handleForm)
      };
      // console.log(params);
      comm.openLoading('导出中...');
      axios({
        method: api.exportManageList.type,
        url: api.exportManageList.url,
        params: params,
        responseType: 'blob',
        headers: {'ms-type': 'application/vnd.ms-excel'}
      }).then((res) => {
        comm.closeLoading();
        comm.downloadFileHandle(res.data, '手动推送列表');
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '导出失败', type: 'notice'});
        console.log(err);
      });
    },
    triggerPush(rawData) {
      // console.log(rawData);
      let that = this;
      axios({
        method: api.updatePushStatus.type,
        url: api.updatePushStatus.url,
        data: {
          id: rawData.id,
          isValid: 0
        }
      }).then(() => {
        // console.log(res);
        that.$message.success('操作成功！');
        this.getList();
      }).catch(() => {
        that.$message.error('操作失败！');
      });
    },
    createTime(dateObj, type) {
      let timeStr = '';
      let addZero = (str) => {
        if (parseInt(str, 10) < 10) {
          return '0' + parseInt(str, 10);
        }
        else {
          return parseInt(str, 10);
        }
      };
      type === 0 ? timeStr = dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate()) + ' ' + addZero(dateObj.getHours()) + ':' + addZero(dateObj.getMinutes()) + ':' + addZero(dateObj.getSeconds()) : timeStr = dateObj.getFullYear() + '-' + addZero(dateObj.getMonth() + 1) + '-' + addZero(dateObj.getDate()) + ' ' + addZero(dateObj.getHours()) + ':' + addZero(dateObj.getMinutes()) + ':' + addZero(dateObj.getSeconds());
      return timeStr;
    },
    getList(dataRaw) {
      let _this = this;
      let params = {};
      if (dataRaw) {
        params = dataRaw;
      }
      else {
        params = {
          firstResult: _this.firstResult,
          maxResult: _this.maxResult
        };
      }
      // console.log('*****提交的数据******');
      // console.log(params);
      axios({
        method: api.getManageList.type,
        url: api.getManageList.url,
        // url: 'http://10.0.1.155:3333/base-message-platform/crm/push/getManageList',
        params: params
      }).then((res) => {
        if (res && res.data && res.data.responseObject.responseData) {
          // console.log(res.data.responseObject.responseData.dataList);
          console.log(res);
          _this.tableData = res.data.responseObject.responseData.dataList;
          _this.totalCount = res.data.responseObject.responseData.totalCount;
        }
      }).catch((e) => {
        // 获取分组用户标签列表失败
      });
    },
    // 筛选
    getFilterList() {
      this.pageIndex = 1;
      let dataRaw = {};
      dataRaw.messageExecutionStartTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[0];
      dataRaw.messageExecutionEndTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[1];
      dataRaw.submissionStartTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[0];
      dataRaw.submissionEndTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[1];
      dataRaw.messageContent = this.handleForm.messageContent;
      dataRaw.messageScence = this.handleForm.messageScence;
      dataRaw.messageTitle = this.handleForm.messageTitle;
      dataRaw.opUser = this.handleForm.opUser;
      dataRaw.pushGoal = this.handleForm.pushGoal;
      dataRaw.status = this.handleForm.status;
      dataRaw.firstResult = 0;
      dataRaw.maxResult = this.maxResult;
      console.log(dataRaw);
      this.getList(dataRaw);
    },
    handleSizeChange(val) {
      // console.log(val);
      let _this = this;
      _this.pageSize = val;
      _this.maxResult = val; // 当前页size
      this.pageIndex = 1;
      this.firstResult = 0;
      let dataRaw = {};
      dataRaw.messageExecutionStartTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[0];
      dataRaw.messageExecutionEndTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[1];
      dataRaw.submissionStartTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[0];
      dataRaw.submissionEndTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[1];
      dataRaw.messageContent = this.handleForm.messageContent;
      dataRaw.messageScence = this.handleForm.messageScence;
      dataRaw.messageTitle = this.handleForm.messageTitle;
      dataRaw.opUser = this.handleForm.opUser;
      dataRaw.pushGoal = this.handleForm.pushGoal;
      dataRaw.status = this.handleForm.status;
      dataRaw.firstResult = this.firstResult;
      dataRaw.maxResult = this.maxResult;
      console.log(dataRaw);
      _this.getList(dataRaw);
    },
    handleCurrentChange(val) {
      console.log(val);
      let _this = this;
      _this.pageIndex = val;
      _this.firstResult = (val - 1) * _this.pageSize;// 当前传参
      let dataRaw = {};
      dataRaw.messageExecutionStartTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[0];
      dataRaw.messageExecutionEndTime = !this.handleForm.pushTime ? '' : this.handleForm.pushTime[1];
      dataRaw.submissionStartTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[0];
      dataRaw.submissionEndTime = !this.handleForm.submissionTime ? '' : this.handleForm.submissionTime[1];
      dataRaw.messageContent = this.handleForm.messageContent;
      dataRaw.messageScence = this.handleForm.messageScence;
      dataRaw.messageTitle = this.handleForm.messageTitle;
      dataRaw.opUser = this.handleForm.opUser;
      dataRaw.pushGoal = this.handleForm.pushGoal;
      dataRaw.status = this.handleForm.status;
      dataRaw.firstResult = this.firstResult;
      dataRaw.maxResult = this.maxResult;
      console.log(dataRaw);
      _this.getList(dataRaw);
    }
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/manualPush/manualPush.scss";
</style>
