<template>
  <section class="liveTypeColumn">
    <h3>直播内容管理</h3>
    <section class="liveSearchArea">
      <el-form label-width="100px" row-height="20px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="直播id">
              <el-input placeholder="输入课程id" v-model="params.refId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="直播名称">
              <el-input placeholder="输入课程名称" v-model="params.anthologyNameLike"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="添加时间">
              <el-date-picker
                v-model="params.createDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="状态">
              <el-select
                v-model="params.isValid"
                placeholder="请选择处理状态"
                required
              >
                <el-option
                  v-for="item in liveStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直播时间">
              <el-date-picker
                v-model="params.liveDate"
                type="daterange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                :default-time="['00:00:00', '23:59:59']"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" style="float: right;margin-top:4px;margin-bottom:8px;">
            <el-form-item class="submitBtn">
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="queryData">筛选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>

    <section class="middleController">
      <div class="addLive" @click="createLive"><i class="el-icon-circle-plus"></i><i>新增直播</i></div>
    </section>

    <section class="liveColumnTable">
      <el-table
        :data="tableData"
        :fit="true"

        @cell-mouse-enter="enterLiveImg"
      >
        <el-table-column
          prop="id"
          label="序号ID"
          width="110"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="anthologyName"
          label="直播名称"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="customerIdList"
          label="用户ID">
        </el-table-column>
        <el-table-column
          prop="customerNameList"
          label="用户名字">
        </el-table-column>
        <el-table-column
          prop="attUrl"
          width="80"
          label="直播配图"
        >
          <template slot-scope="scope">
            <img v-if="scope.row.attUrl" width="42" height="54" :src="scope.row.attUrl">
          </template>
        </el-table-column>
        <el-table-column
          prop="columnName"
          width="120"
          label="栏目">
        </el-table-column>
        <el-table-column
          prop="refId"
          width="130"
          label="资源ID">
        </el-table-column>
        <el-table-column
          prop="liveNum"
          width="130"
          label="直播间ID">
        </el-table-column>
        <el-table-column
          prop="refLiveId"
          width="130"
          label="直播ID">

        </el-table-column>
        <el-table-column
          prop="playBackId"
          width="130"
          label="回放ID">
        </el-table-column>
        <el-table-column
          prop="liveStartTime"
          width="170"
          label="开始时间"
          :formatter="dataTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="liveEndTime"
          width="170"
          label="结束时间"
          :formatter="dataTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="authority"
          width="100"
          label="观看权限"
          :formatter="authorityFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="isValid"
          label="状态"
          style="padding-top:100px;"
        >
          <template slot-scope="scope">
            <div>{{scope.row.isValid==1?'已上架':'已下架'}}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <div class="elButton" @click="editLive(scope.row)">编辑</div>
            <div v-if="scope.row.isValid" class="elButton removeAtt" :class="scope.row.isValid==2 ? '':'yellowBtn' " @click="upDownLive(scope.row)">下架</div>
            <div v-if="!scope.row.isValid" class="elButton removeAtt" @click="upDownLive(scope.row)">上架</div>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <div     v-show="bigImgDialogVisible"
      style="position:fixed; top:50%;  margin: -188px 0 0 -188px; left:50%; width: 376px;   height: 376px; z-index:500"
      class="bigImgDialog"
    >
      <img :src="bigImgPath" alt=""
           v-on:mouseover="enterBigImg"
           v-on:mouseleave="leaveBigImg"
           style="max-width:100%; max-height: 100%; margin:0 auto;">
    </div>

    <el-row class="pagination">
      <el-col :span="20" :offset="5">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.maxResult"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="ifPopupWindow"
      width="700px"
      :show-close=true
      :lock-scroll=true
      :modal=true
      :center=true
      :title="'新增/编辑直播'"
    >

      <el-form
        label-width="100px"
        :model="editDialogData.rowData"
        ref="editForm"
        :rules="rules"
      >
        <el-row>
          <el-col :span="14">
            <el-form-item label="直播标题" prop="anthologyName">
              <el-input v-model="editDialogData.rowData.anthologyName" placeholder="输入直播间标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="直播间ID" prop="liveNum">
              <el-input v-model="editDialogData.rowData.liveNum" placeholder="输入CC的直播间ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="直播ID">
              <el-input v-model="editDialogData.rowData.refLiveId" placeholder="输入CC的直播ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="直播用户" prop="customerIdList">
              <el-input v-model="editDialogData.rowData.customerIdList" v-on:focus="disableSaveBtn" v-on:blur="customerIdChange"  placeholder="输入用户ID" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名字">
              <el-input disabled v-model="editDialogData.rowData.customerNameList" placeholder="根据ID自动读取"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top:10px">
          <el-col :span="12">
            <el-form-item label="回放ID">
              <el-input v-model="editDialogData.rowData.playBackId" placeholder="输入CC的回放ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="观看权限">
              <el-select v-model="editDialogData.rowData.authority" placeholder="请选择观看权限">
                <el-option label="所有用户" value="1"></el-option>
                <el-option label="登录用户" value="2"></el-option>
                <el-option label="认证用户" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="开始时间/结束时间" label-width="150px" prop="timeInterval">
              <el-date-picker
                v-model="editDialogData.rowData.timeInterval"
                :picker-options="pickerBeginDate"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="column-course-img-list">
          <el-form-item label="配图"
                        class="column-course-img-label img-upload"
                        prop="imgIconUrl">
            <ColumnImgUpload
              @uploadSuccess="handleImgListUploadSuccess"
              :needClear="!ifPopupWindow"
              :imgUrl="editDialogData.rowData.imgIconUrl">
              <p>列表页配图</p>
            </ColumnImgUpload>
          </el-form-item>
        </div>

        <el-row>
          <el-col :span="24" :offset="19">
            <el-button class="publishBtn" ref="saveBtn" :disabled="saveBtnDisable" type="primary" @click="publishLive">发布</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>

  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiUrl from '@/api/apiUrlConfig.js';
import ColumnImgUpload from '@/views/columnManager/components/ColumnImgUpload';
import validator from '@/assets/js/utils/validator';
const commFn = require('../../assets/js/utils/comm.js');

export default {
  name: 'liveTypeColumn',
  components: {
    ColumnImgUpload
  },
  data() {
    return {
      picDomain: 'http://img05.allinmd.cn/', // 显示图片需加的域名<接口只返回了目录地址>
      ifPopupWindow: false,
      ifDeleteIcon: false,
      columnId: this.$route.query.columnId,
      queryParams: {},
      saveBtnDisable: false,
      leaveTimeout: null,
      params: {
        refId: '', // 业务id
        refLiveId: '', // 直播id
        anthologyNameLike: '', // 直播名称
        liveDate: '', // 直播时间
        createDate: '', // 添加时间
        isValid: '', // 直播状态
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        columnId: this.$route.query.columnId // 外部获取columnId
      },
      liveStatusOption: [{value: '', label: '全部'}, {value: '1', label: '已上架'}, {value: '0', label: '已下架'}],
      pickerBeginDate: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 60 * 60 * 1000);
        }
      },
      currentPage: 1,
      total: 0,
      limitIconSize: 5, // 单位M
      base64HandleInfo: {}, // 上传前临时存放图片信息
      bigImgPath: '',
      bigImgDialogVisible: false,
      warningStyle: {
        anthologyName: false,
        refLiveId: false,
        customerIdList: false,
        customerNameList: false,
        attUrl: false
      },
      liveInfo: {
        anthologyName: '', // 直播标题
        refId: '', // 直播id
        refLiveId: '', // 直播id
        liveNum: '',
        customerNameList: '', // 直播用户
        customerIdList: '', // 直播用户id
        liveStartTime: '', // 开始时间
        liveEndTime: '', // 结束时间
        playBackId: '', // 回放id
        attUrl: '', // 直播配图
        timeInterval: '',
        imgIconUrl: ''
      },

      editDialogData: {
        title: '新增活动',
        visible: false,
        sortIdPlaceHolder: '',
        sortIdDisabled: 'disabled',
        attList: {

        },
        rowData: {
          sortId: '',
          imgUrl: '',
          anthologyName: '', // 直播标题
          refId: '', // 直播id
          refLiveId: '', // 直播id
          liveNum: '',
          customerNameList: '', // 直播用户
          customerIdList: '', // 直播用户id
          liveStartTime: '', // 开始时间
          liveEndTime: '', // 结束时间
          playBackId: '', // 回放id
          attUrl: '', // 直播配图
          timeInterval: '',
          authority: '',
          imgIconUrl: '',
          activityMobileUrl: '',
          isValid: 0, // 默认不显示
          attList: {
            attUrl: ''
          }
        }
      },
      rules: {
        anthologyName: [
          {required: true, message: '直播间标题不能为空', trigger: 'blur'},
          {max: 30, min: 10, message: '最少10个字,最长30个字'},
          {validator: validator.fullSpanceVaild, message: '栏目名称不能全为空格', trigger: 'blur'}
        ],
        customerIdList: [
          {required: true, message: '直播用户ID不能为空', trigger: 'blur'},
          {validator: validator.liveCustomerIdList, trigger: 'blur'}
        ],
        timeInterval: [
          {required: true, message: '直播时间不能为空', trigger: 'blur'}
        ],
        imgIconUrl: [{required: true, message: '请上传直播配图', trigger: 'blur'}]
      },
      tableData: []
    };
  },
  mounted() {
    if (!this.$route.query.columnId) {
      window.history.back(-1);
    }
    this.columnId = this.$route.query.columnId;
    this.params.columnId = this.columnId;
    this.queryData();
  },
  methods: {
    enterLiveImg(row, column, cell, event) {
      if (this.leaveTimeout) {
        clearTimeout(this.leaveTimeout);
      }
      if (column.property === 'attUrl') {
        if (row.attUrl) {
          this.bigImgPath = row.attUrl;
          this.bigImgDialogVisible = true;
        }
      }
      else {
        this.bigImgDialogVisible = false;
      }
    },
    enterBigImg() {
      if (this.leaveTimeout) {
        clearTimeout(this.leaveTimeout);
      }
    },
    leaveBigImg(row, column, cell, event) {
      let t = this;
      t.leaveTimeout = setTimeout(function() {
        t.bigImgDialogVisible = false;
      }, 1000);
    },
    disableSaveBtn() {
      this.saveBtnDisable = true;
    },
    getLiveList() {
      const _this = this;
      let t = this;
      this.tools().openLoading();

      t.queryParams = JSON.parse(JSON.stringify(this.params));
      for (let x in t.queryParams) {
        if (t.queryParams[x] === '') delete t.queryParams[x];
        if (Array.isArray(t.queryParams[x])) {
          if (x === 'liveDate') {
            console.log('liveDate', t.queryParams[x][0]);
            t.queryParams.liveStartTime = this.params.liveDate[0];
            t.queryParams.liveEndTime = this.params.liveDate[1];
          }
          if (x === 'createDate') {
            t.queryParams.createStartTime = this.params.createDate[0];
            t.queryParams.createEndTime = this.params.createDate[1];
          }
          delete t.queryParams[x];
        }
      }

      const promise = this.tools().sendAxios(_this.queryParams, 'liveList');

      promise.then((res) => {
        _this.tools().closeLoading();
        _this.total = res.totalCount;
        _this.tableData = !res.items ? [] : res.items;
      });
    },
    publishLive() { // 新增&修改
      this.$refs.editForm.validate((vaild) => {
        if (vaild) {
          const _this = this;
          let data = {
            columnId: this.columnId, // 外部获取
            liveTitle: this.editDialogData.rowData.anthologyName,
            refId: this.editDialogData.rowData.refId,
            liveNum: this.editDialogData.rowData.liveNum,
            refLiveId: this.editDialogData.rowData.refLiveId,
            id: this.editDialogData.rowData.id,
            customerIdList: this.editDialogData.rowData.customerIdList,
            customerNameList: this.editDialogData.rowData.customerNameList,
            playBackId: this.editDialogData.rowData.playBackId,
            liveEndTime: this.editDialogData.rowData.timeInterval[1],
            liveStartTime: this.editDialogData.rowData.timeInterval[0],
            attList: this.editDialogData.rowData.attList,
            authority: this.editDialogData.rowData.authority,
            columnType: 3
          };
          if (this.editDialogData.action === 'add') {
            delete data.refId;
            delete data.refLiveId;
            delete data.liveId;
            delete data.id;
          }
          this.tools().openLoading();
          const promise = this.tools().sendAxios(data, 'publishLive');
          promise.then((res) => {
            _this.tools().closeLoading();
            if (res.responseStatus) {
              _this.$allin_confirm({title: '提示', content: '发布成功', type: 'notice'});
              _this.closePopupWindow();
            }
            else {
              _this.$allin_confirm({title: '提示', content: '发布失败', type: 'notice'});
            }
            _this.getLiveList();
          });
        }
        else {
          return false;
        }
      });
    },
    getCustomerInfo() {
      let _this = this;
      let customerIdListFlag = true;
      if (this.editDialogData.rowData.customerIdList.indexOf('，') > -1) {
        this.$message.error('请使用半角逗号分隔');
        this.editDialogData.rowData.customerIdList = this.editDialogData.rowData.customerIdList.replace('，', ',');
        this.$refs.editForm.validateField('customerIdList');
      }
      let newArray = this.uniqueArraySet(this.editDialogData.rowData.customerIdList.replace(/\s+/g, '').split(','));
      for (let i = 0; i < newArray.length; i++) {
        if (!commFn.default.isPositiveInteger(newArray[i]) || !(newArray[i] !== '0')) {
          this.$message.error('请输入正确的直播用户Id');
        }
      }
      let userList = newArray.map(item => item);
      this.editDialogData.rowData.customerNameList = '';
      let l = 0;
      for (let i = 0; i < userList.length; i++) {
        let customerId = userList[i];
        const promise = this.tools().sendAxios({customerId: customerId}, 'getCustomerById');
        promise.then((res) => {
          l++;
          if (res.responseStatus) {
            if (res.responseData.data_list[0].customerUnite.isValid === '1') {
              if (userList.length === 1) {
                this.saveBtnDisable = false;
              }
              if (_this.editDialogData.rowData.customerNameList.length === 0) {
                _this.$set(_this.editDialogData.rowData, 'customerNameList', res.responseData.data_list[0].customerAuth.lastName + res.responseData.data_list[0].customerAuth.firstName);
              }
              else {
                _this.$set(_this.editDialogData.rowData, 'customerNameList', _this.editDialogData.rowData.customerNameList + ',' + res.responseData.data_list[0].customerAuth.lastName + res.responseData.data_list[0].customerAuth.firstName);
              }
            }
            else {
              customerIdListFlag = false;
              this.$message.error('请输入有效的直播用户Id');

              console.log(_this.editDialogData.rowData.customerIdList);
              console.log(_this.editDialogData.rowData.customerNameList);
              _this.$set(_this.editDialogData.rowData, 'customerIdList', _this.editDialogData.rowData.customerIdList.replace(customerId, ''));
              this.$refs.editForm.validateField('customerIdList');
            }
          }
          else {
            _this.editDialogData.rowData.customerIdList = _this.editDialogData.rowData.customerIdList.replace(customerId, '');
            customerIdListFlag = false;
            this.$message.error('请输入正确的直播用户Id');
            this.$refs.editForm.validateField('customerIdList');
          }
          if (l === userList.length - 1) {
            if (customerIdListFlag) { // 没有出错的话，把发布按钮放开
              this.saveBtnDisable = false;
            }
          }
        });
      }
    },
    handleSizeChange(val) {
      this.params.maxResult = val;
      this.getLiveList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.params.firstResult = (val - 1) * this.params.maxResult;
      this.getLiveList();
    },
    createLive() {
      this.editDialogData.action = 'add';

      this.ifPopupWindow = true;
      // 重置表单数据
      this.$refs.editForm && this.$refs.editForm.resetFields();
      for (let key in this.editDialogData.rowData) {
        this.editDialogData.rowData[key] = '';
      }
      this.editDialogData.rowData.authority = '3';
    },
    editLive(row) {
      let _this = this;
      _this.editDialogData.action = 'edit';
      _this.editDialogData.title = '编辑活动';
      this.ifPopupWindow = true;
      // t.editDialogData.visible = true;
      _this.editDialogData.rowData.refId = row.refId;
      let params = {
        'columnId': this.columnId,
        'refId': row.refId
      };
        // 重置表单数据
      this.$refs.editForm && this.$refs.editForm.resetFields();
      for (let key in this.editDialogData.rowData) {
        this.editDialogData.rowData[key] = '';
      }
      // this.editDialogData.rowData = row;
      const promise = this.tools().sendAxios(params, 'liveDetail');
      promise.then((res) => {
        console.log(res);
        let responseData = res.responseData;
        _this.editDialogData.rowData.sortId = responseData.sortId;
        _this.editDialogData.rowData.anthologyName = responseData.anthologyName;
        _this.editDialogData.rowData.refId = responseData.refId;
        _this.editDialogData.rowData.refLiveId = responseData.refLiveId;
        _this.editDialogData.rowData.id = responseData.id;
        _this.editDialogData.rowData.authority = responseData.authority;
        _this.editDialogData.rowData.liveNum = responseData.liveNum;
        _this.editDialogData.rowData.customerNameList = responseData.customerNameList;
        _this.editDialogData.rowData.customerIdList = responseData.customerIdList;
        _this.editDialogData.rowData.playBackId = responseData.playBackId;
        if (responseData.attList) {
          _this.editDialogData.attUrl = responseData.attList.attUrl;
          _this.editDialogData.rowData.imgIconUrl = responseData.attList.attUrl;
          _this.editDialogData.attList = responseData.attList;
          _this.editDialogData.rowData.imgUrl = responseData.attList.attUrl;
        }

        _this.editDialogData.rowData.isValid = parseInt(responseData.isValid);
        if (responseData.liveStartTime && responseData.liveEndTime) {
          _this.$set(_this.editDialogData.rowData, 'timeInterval', [responseData.liveStartTime, responseData.liveEndTime]);
        }
        else {
          _this.$set(_this.editDialogData.rowData, 'timeInterval', '');
        }

        if (!responseData.attList) { // 以避免
          _this.editDialogData.rowData.attList = {};
        }
      }).catch((err) => {
        console.log('获取直播详细数据失败：', err);
      });
    },

    upDownLive(row) {
      const _this = this;
      this.$allin_confirm({title: '提示',
        content: '确定将此直播' + (row.isValid ? '下' : '上') + '架么？',
        done: function() {
          const promise = _this.tools().sendAxios({id: row.id, columnId: row.columnId, refId: row.refId, isValid: row.isValid ? 0 : 1}, 'publishLive');
          promise.then((res) => {
            if (res.responseStatus) {
              _this.$allin_confirm({title: '提示',
                content: (row.isValid ? '下' : '上') + '架成功',
                type: 'notice',
                done: function() {
                  _this.getLiveList();
                }});
            }
            else {
              _this.$allin_confirm({title: '提示', content: (row.isValid ? '下' : '上') + '架失败', type: 'notice'});
            }
            row.isValid = row.isValid ? 0 : 1;
          });
        }});
    },
    closePopupWindow() {
      this.ifPopupWindow = false;
      for (let key in this.editDialogData.rowData) {
        this.editDialogData.rowData[key] = '';
      }

      for (let x in this.warningStyle) {
        this.warningStyle[x] = false;
      }
    },
    resetForm() {
      this.params = { refId: '',
        anthologyName: '',
        liveDate: '',
        createDate: '',
        isValid: '',
        firstResult: 0,
        maxResult: 10,
        columnId: this.$route.query.columnId};
    },
    checkLiveName() {
      let nameLen = commFn.default.getByteLen(this.editDialogData.rowData.anthologyName);
      this.warningStyle.anthologyName = nameLen < 20 || nameLen > 60;
    },
    tools() {
      return {
        _superThis: this,
        getDate(date) {
          let year = date.getFullYear(), month = date.getMonth() + 1, day = date.getDate();

          if (month < 10) month = '0' + month;
          if (day < 10) day = '0' + day;
          return year + '-' + month + '-' + day;
        },
        sendAxios(obj, desc) {
          let newObj = {};
          newObj.url = apiUrl[desc].url;
          newObj.type = apiUrl[desc].type;
          newObj.params = obj;
          return this.axios(newObj);
        },
        axios(obj) {
          if (obj.type === 'put') {
            return axios.put(obj.url, obj.params).then(function(res) {
              return res.data.responseObject;
            }).catch((e) => {
              console.log('err', obj.url);
            });
          }
          else if (obj.type === 'post') {
            return axios.post(obj.url, obj.params).then(function(res) {
              return res.data.responseObject;
            }).catch((e) => {
              console.log('err', obj.url);
            });
          }
          else {
            return axios({
              method: !obj.type ? 'get' : obj.type,
              url: obj.url,
              params: obj.params,
              responseType: 'json'
            }).then(function(res) {
              return res.data.responseObject;
            }).catch((e) => {
              console.log('err', obj.url);
            });
          }
        },
        openLoading() {
          this._superThis.loading = this._superThis.$loading({
            lock: true,
            text: '加载中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
        },
        closeLoading() {
          this._superThis.loading.close();
        }
      };
    },

    queryData() { // 筛选
      this.params.firstResult = 0;
      this.getLiveList();
    },

    dataTimeFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length) {
        return cellValue.substring(0, cellValue.length - 2);
      }
    },
    authorityFormatter(row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return '所有用户';
        case 2:
          return '登录用户';
        case 3:
          return '认证用户';
        default:
          return '所有用户';
      }
    },
    handleImgListUploadSuccess(data) {
      let id;
      this.editDialogData.rowData.attList = {};
      if (this.editDialogData.action === 'edit') {
        id = this.editDialogData.attList.id;
      }
      else {
        id = '';
      }

      this.editDialogData.rowData.attList = {
        id: id,
        attFormat: data.attFormat,
        attSize: data.attSize,
        attHeight: data.attHeight,
        attWidth: data.attWidth,
        attUrl: data.attUrl,
        attType: 1
      };
      if (!id) {
        delete this.editDialogData.rowData.attList.id;
      }
      this.editDialogData.rowData.imgIconData = data;
      this.editDialogData.rowData.imgIconData.attType = 1;
      this.editDialogData.rowData.imgIconUrl = apiUrl.imgServer_img05.url + data.attUrl;
      this.$refs.editForm.validateField('imgIconUrl');
    },
    customerIdChange: function(value) {
      if (value) {
        this.getCustomerInfo();
      }
    },
    uniqueArraySet(array) {
      return Array.from(new Set(array)).filter(value => value);
    }
  }

};
</script>

<style lang="scss" scoped>
  .column-img-upload {
    p {
      text-align: center;
      margin-top: 10px;
      font-family: PingFangSC-Regular,Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      line-height: 12px;
    }
  }

  .img-upload {
    display: inline-block;
    &:nth-child(2) {
      margin-left: -80px;
    }
    &:nth-child(3) {
      margin-left: -80px;
    }
  }

  .publishBtn {
    padding: 10px 56px;
    background: #3846DC;
  }
</style>
<style lang="scss">
  .el-table_1_column_5 {
    div {
      text-align: center;
    }
  }

  // 查看大图
  .bigImgDialog {
    .el-dialog__body {
      padding: 0;
      font-size: 0;
      img {
        width: 100%;
        max-width: 785px;
        height: 375px;
      }
    }
    .el-dialog__header {
      padding: 0;
      font-size: 0;
    }
  }

  .pagination {
    margin: 0 auto;
    text-align: center;
  }

  .liveTypeColumn {
    /*.el-form-item {*/
    /*height: 28px;*/
    /*}*/
    .submitBtn {
      button {
        &:nth-of-type(1) {
          margin-top: 5px;
          width: 88px;
          height: 30px;
          float: left;
          border: none;
          line-height: 5px;
        }
        &:nth-of-type(2) {
          width: 88px;
          height: 30px;
          color: #4B67D6;
          border: 1px solid #4B67D6;
          border-radius: 3px;
          line-height: 5px;
        }
      }
    }
    .liveColumnTable {
      margin: 0 auto;
      width: 1200px;
      margin-bottom: 30px;
      .el-table th.is-leaf {
        font-weight: bold;
        font-size: 14px;
        color: #111111;
        font-family: PingFangSC-Medium,Arial, "Helvetica Neue", Helvetica, sans-serif;
      }
    }
    h3 {
      width: 1200px;
      margin: 35px auto 25px;
      font-size: 20px;
    }
    .liveSearchArea {
      margin: 0 auto;
      width: 1200px;
      padding-top: 25px;
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      .el-input__inner {
        height: 30px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 3px;
      }
      .el-date-editor {
        margin-top: 5px;
        height: 30px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 3px;
        .el-range-input {
          background: #F7F9FC;
        }
        .el-range__close-icon {
          margin-top: -12px;
        }
        .el-range-separator {
          line-height: 22px;
        }
        .el-range__icon {
          position: relative;
          top: -5px;
        }
      }
    }
    .middleController {
      width: 1200px;
      margin: 0 auto;
      margin-top: 30px;
      margin-bottom: 12px;
      height: 40px;
    }
    .addLive {
      cursor: pointer;
      position: relative;
      width: 98px;
      height: 32px;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      float: left;
      line-height: 32px;
      text-align: center;
      .el-icon-circle-plus {
        color: #0d17d6;
        position: relative;
        top: 1px;
      }
      i:last-child {
        font-family: PingFangSC-Regular,Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 14px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 14px;
        margin-left: 2px;
      }
    }
    .elButton {
      cursor: pointer;
      width: 72px;
      height: 25px;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      font-family: PingFangSC-Regular,Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 13px;
      color: #4B67D6;
      letter-spacing: 0;
      line-height: 23px;
      text-align: center;
      float: left;
      &.yellowBtn {
        background: #FFEBE3;
        border: 1px solid #FF7E4D;
        color: #FF7E4D;
      }
    }
    .removeAtt {
      margin-left: 10px;
    }
  }

  .cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0.7;
    background: #000000;
  }

  .popupWindow {
    z-index: 11;
    position: fixed;
    left: 0;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;
    .warningStyle {
      border: 1px solid #EB3B46 !important;
    }
    .publish {
      float: right;
      margin-top: 27px;
      margin-right: 10px;
      .publishBtn {
        cursor: pointer;
        width: 140px;
        height: 32px;
        background: #3846DC;
        border-radius: 3px;
        font-family: PingFangSC-Medium,Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 32px;
        text-align: center;
      }
    }
    .popupStyle {
      width: 770px;
      /*height: 472px;*/
    }
    .title {
      text-align: center;
    }
    .editArea {
      margin-top: 12px;
      input::-webkit-input-placeholder {
        font-family: PingFangSC-Regular,Arial, "Helvetica Neue", Helvetica, sans-serif;
        font-size: 14px;
        color: #BBBBBB;
        letter-spacing: 0;
        line-height: 14px;
      }
      .photoWrap {
        width: 150.8px;
        margin-left: 10px;
        .groupPhoto {
          width: 150.8px;
          height: 100px;
          margin: 18px  auto 0;
          .addPhoto {
            width: 150.8px;
            height: 100px;
            background: #EDF1FF;
            border-radius: 3px;
            float: left;
            z-index: 1;
            .addFlag {
              position: relative;
              left: 63px;
              top: 38px;
            }
            input {
              width: 123px;
              height: 100px;
              cursor: pointer;
              position: absolute;
              opacity: 0;
              outline: none;
              z-index: 2;
            }
          }
        }
      }
      .el-date-editor {
        height: 30px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 3px;
        .el-range-input {
          background: #F7F9FC;
        }
        .el-range-separator {
          line-height: 22px;
        }
        .el-range__icon {
          position: relative;
          top: -5px;
        }
        .el-range__close-icon {
          top: -5px;
        }
      }
      ul {
        li {
          margin-bottom: 20px;
        }
        li:last-child {
          .left {
            margin-top: -10px;
          }
        }
      }
      .left {
        float: left;
        margin-right: 10px;
        .noFlag {
          margin-top: 8px;
          width: 60px;
          text-align: right;
        }
        i {
          font-size: 21px;
          color: #EB3B46;
          letter-spacing: 0;
          position: relative;
          top: 7px;
          margin-right: 5px;
        }
      }
      .shortRight {
        span {
          margin-right: 10px;
        }
        input {
          width: 138px;
          height: 30px;
          padding: 0 12px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 3px;
          margin-right: 38px;
        }
      }
      .right {
        input:first-child {
          width: 356px;
          height: 30px;
          padding: 0 12px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 3px;
          margin-right: 38px;
        }
        input:last-child {
          width: 138px;
          height: 30px;
          padding: 0 12px;
          margin-left: 10px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 3px;
        }
        i {
          font-size: 21px;
          color: #EB3B46;
          letter-spacing: 0;
          position: relative;
          top: 7px;
          margin-right: 5px;
        }
      }
    }
  }
</style>
