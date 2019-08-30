<template>
  <section class="crm-manualPush">
    <!--添加手动推送标题开始-->
    <h1 class="crm-manualPush-title">添加手动推送</h1>
    <!--添加手动推送标题结束-->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="crm-manualPush-ruleForm">
      <el-form-item label="推送标题" prop="messageTitle" class="crm-form-item">
        <el-input v-model.trim="ruleForm.messageTitle" placeholder="请输入推送标题"></el-input>
      </el-form-item>
      <el-form-item label="推送内容" prop="messageContent" class="crm-form-item">
        <el-input v-model.trim="ruleForm.messageContent" placeholder="请输入推送内容"></el-input>
      </el-form-item>
      <h2 class="code-info-title"><i class="icon-bg"></i><span>场景（落地页）</span></h2>
      <el-form-item label="推送场景" prop="messageScence">
        <el-select v-model="ruleForm.messageScence" placeholder="请选择推送场景">
          <!-- <el-option :label="item.sceneName" :value="item.sceneType" :key="item.sceneType" v-for="(item) in sceneList"></el-option> -->
          <el-option :label="Number(item.code) === 18 ? `${item.description}(h5)` : item.description" :value="item.code" :key="item.code" v-for="(item) in sceneList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ID" prop="resourceId" class="crm-form-item" v-if="!linkOnOff">
        <el-input v-model.trim="ruleForm.resourceId" placeholder="请输入ID"></el-input>
      </el-form-item>
      <el-form-item label="H5链接" prop="linkUrl" class="crm-form-item" v-if="linkOnOff">
        <el-input v-model.trim="ruleForm.linkUrl" placeholder="请输入链接地址"></el-input>
      </el-form-item>
      <h2 class="code-info-title"><i class="icon-bg"></i><span>目标用户</span></h2>
      <el-form-item label="目标用户" class="crm-form-item">
        <el-radio-group v-model="ruleForm.goalUser">
          <el-radio :label="1">全部用户</el-radio>
          <el-radio :label="2">用户分组</el-radio>
          <el-radio :label="3">指定用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <h2 class="code-info-title" v-if="ruleForm.goalUser==2"><i class="icon-bg"></i><span>用户分组</span></h2>
      <!-- 用户分组 -->
      <template  v-if="ruleForm.goalUser==2">
      <el-form-item :label="item.labelName"
                    class="crm-form-item crm-form-tagList"
                    v-for="(item,index) in customerGoruplist"
                    :key="index">
                    <el-tag closable
                        v-for="(innerItem,innerIndex) in item.selectData"
                        :key="innerItem.labelId"
                        @close="handleClose(index,innerIndex,innerItem)"
                        v-if="parseInt(innerItem.checked,10)">
                        {{innerItem.labelName}}
                    </el-tag>
                    <el-input :placeholder="checkChecked(item.selectData)?'继续添加':'请选择'"
                        v-model="input"
                        :disabled="true"
                        @click.native="selectLabel(index)"
                        :class="{'crm-addTag-input'
                        :checkChecked(item.selectData)}">
                    </el-input>
      </el-form-item>
        <el-form-item label="课程意向用户"  class="crm-form-item">
          <el-input v-model="ruleForm.intentionCourse" placeholder="填写课程ID"></el-input>
        </el-form-item>
        <el-form-item label="课程试看用户"  class="crm-form-item">
          <el-input v-model="ruleForm.tryseeCourse" placeholder="填写课程ID"></el-input>
        </el-form-item>
       <h2 class="code-info-title select-num" v-if="ruleForm.goalUser==2">已选择用户数<span>{{ courseGroupCount || 0 }}</span>人</h2>
      </template>
      <!-- 指定用户 -->
      <template  v-if="ruleForm.goalUser==3">
        <el-form-item label="指定用户" class="crm-form-item">
          <el-input type="textarea" class="txtContents" v-model="ruleForm.customerIdList" placeholder="填写用户ID（用户ID，多个ID以分号分隔）"></el-input>
        </el-form-item>
        <section>
          <h2 class="code-info-title select-num parallel-pos">已选择用户<span v-text="selectNum"></span>人</h2>
          <div class="block crm-form-btnList">
            <el-button type="primary" @click.native="fileResolve">选择文件</el-button>
            <el-button type="primary" @click.native="addGroupName">保存分组</el-button>
          </div>
        </section>
        <el-form-item label="专家ID" class="crm-form-item">
          <el-input type="textarea" v-model.trim="ruleForm.specialId" placeholder="填写用户ID（用户ID，多个ID以分号分隔）"></el-input>
        </el-form-item>
        <h2 class="code-info-title select-num parallel-pos">已选择下发粉丝<span>{{ fansCount }}</span>人</h2>
        <div class="block crm-form-btnList">
          <el-button type="primary" @click.native="searchFans">搜索</el-button>
        </div>
        <el-form-item label="分组" class="crm-form-item">
          <el-checkbox-group v-model="ruleForm.groupIdList" @change="handleCheckedChange">
            <el-checkbox  :label="item.groupId"
                          border
                          class="checkbox-item"
                          name="groupName"
                          :disabled="item.disabled ? true : false"
                          v-for="(item) in assignCustomerLabelList"
                          :key="item.groupId">
                          {{item.groupName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </template>
      <h2 class="code-info-title"><i class="icon-bg"></i><span>操作信息</span></h2>
      <el-form-item label="推送时间"  class="crm-form-item"  prop="pushType" >
        <el-radio-group v-model="ruleForm.pushType">
          <el-radio :label="1">即时</el-radio>
          <el-radio :label="2">定时</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推送时间"  class="crm-form-item" v-if="ruleForm.pushType==2">
        <el-date-picker
          v-model="ruleForm.pushTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="同步到消息中心"  class="crm-form-item">
        <el-radio-group v-model="ruleForm.isSys">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="部分地区延时推送" v-if="ruleForm.goalUser==0 || ruleForm.goalUser==1 " class="crm-form-item">
        <el-radio-group v-model="ruleForm.isDelay">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="推送目的" class="crm-form-item">
        <el-input v-model="ruleForm.pushGoal" placeholder="请输入推送目的"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="medium">提交</el-button>
        <read-txt ref="txtFile"
                  @txtReader="txtReader"
                  @fileReader="fileReader(arguments)">
        </read-txt>
        <!--<el-button @click="resetForm('ruleForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
    <SelectDialog :showOnOff='selectOnOff'
                  @changeSelectlist="changeSelectlist"
                  @closeSelectDialog="closeSelectDialog"
                  :selectList="selectList"
                  @updateSelect="updateSelect"
                  v-if="selectList.length"
                  :currentIndex="currentIndex"
                  :selectLabelName = 'selectLabelName'>
    </SelectDialog>
    <GroupDialog  :showOnOff="groupOnOff"
                  @closeGroupDialog="closeGroupDialog"
                  @addAssignCustomerLabel="addAssignCustomerLabel">
    </GroupDialog>
    <!-- 提交确认框 -->
    <el-dialog
      title="确认提交"
      :visible.sync="pubSubmitDialog"
      width="30%"
      center>
      <span>请仔细检查无误后再提交，是否继续？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pubSubmitDialog = false">取 消</el-button>
        <el-button type="primary" @click.native="pubSubmitTrue">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>
<script>
/**
 * CRM 管理后台，手动推送管理，添加手动推动
 * 注意事项：暂无
 * author:zhangheng
 * create-time:2019.06.20 14:17 -
 * 产品版本：医生端v3.9下的1.0版本
 * 迭代版本：
 * 1、首页模块的相关数据需要通过 src/router/menuRelation.js 和 src/router/router.js 配合设置才能正常使用，详情可见 README.md 的“管理后台主页菜单配置说明”部分
 * 2、当前首页的图标仅提供了 3 种
 */
import api from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import SelectDialog from './components/selectDialog';
import GroupDialog from './components/groupDialog';
import comm from '@/assets/js/utils/comm.js';
import readTxt from '@/components/common/readTxt/readTxt';
// const xhrUrl = {
//   sceneList: '/mock/manualPush/getScenceList/',
//   labelList: '/mock/manualPush/getLabelList/',
//   assignCustomerLabelList: '/mock/manualPush/assignCustomerLabelList/',
//   submitManualPush: 'http://gateway.allinmd.cn:16000/base-message-platform/crm/push/config/create'
// };
export default {
  'name': 'manualPush',
  components: {
    SelectDialog,
    GroupDialog,
    readTxt
  },
  data() {
    return {
      selectLabelName: '',
      groupOnOff: false,
      selectOnOff: false,
      pubSubmitDialog: false,
      input: '',
      sceneList: [],
      selectList: [],
      userGroupSelectOptions: [],
      ruleForm: {
        messageTitle: '',
        messageContent: '',
        messageScence: '',
        resourceId: '',
        linkUrl: '',
        goalUser: 0,
        pushType: '',
        isSys: '0',
        isDelay: '0',
        pushGoal: '',
        pushTime: '',
        intentionCourse: '',
        tryseeCourse: '',
        groupIdList: [],
        chooseAllTags: []
      },
      customerGoruplist: [
        {
          'labelName': '专科',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '医院地区',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '厂商地区',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '城市等级',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '医院等级',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '职称',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '认证状态',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '角色',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '活跃',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '沉默',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        },
        {
          'labelName': '付费',
          'dataType': 1, // 0:单选，1多选
          'selectData': []
        }
      ],
      selectLabelIndex: -1,
      rules: {
        messageTitle: [
          {required: true, message: '请输入推送标题', trigger: 'blur'},
          {min: 0, max: 100, message: '最多100个字符', trigger: 'blur'}
        ],
        linkUrl: [
          {required: true, message: '请输入正确的URL地址', trigger: 'blur'},
          {min: 0, max: 200, message: '最多200个字符', trigger: 'blur'}
        ],
        resourceId: [
          {required: false, message: '请输入推送标题', trigger: 'blur'},
          {min: 0, max: 40, message: '最多40个字符', trigger: 'blur'}
        ],
        messageScence: [
          {required: true, message: '请选择推送场景', trigger: 'change'}
        ],
        pushType: [
          {required: true, message: '请选择推送时间', trigger: 'change'}
        ],
        messageContent: [
          {required: true, message: '请输入推送内容', trigger: 'blur'},
          {min: 0, max: 200, message: '最多200个字符', trigger: 'blur'}
        ]
      },
      assignCustomerLabelList: [], // 指定用户分组列表
      fansCount: 0,
      currentIndex: '',
      queryParams: {
        major: '',
        companyAddress: '',
        medAddress: '',
        cityLevel: '',
        companyLevelId: '',
        medicalTitleId: '',
        state: '',
        customerRole: '',
        activType: '',
        silentType: '',
        isPay: ''
      },
      courseGroupCount: 0,
      selectNum: 0,
      isSaveGroup: false
    };
  },
  computed: {
    linkOnOff() {
      let _this = this;
      return parseInt(_this.ruleForm.messageScence, 10) === 18;
    },
    traceArr(val) {
      return val;
    }
  },
  mounted() {
    let _this = this;
    _this.getSceneList();
    // _this.getUserGroupSelectAll();
  },
  methods: {
    rmNull(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === '') {
          arr.splice(i, 1);
          i--;
        }
      }
      return arr;
    },
    fileResolve() {
      this.$refs.txtFile.triggerClick();
      console.log(this.$refs.txtFile);
    },
    txtReader(content) {
      // console.log(content);
      // console.log(typeof content);
      this.$set(this.ruleForm, 'customerIdList', content);
      console.log(this.ruleForm.customerIdList);
      let newContent = Array.from(new Set(content.trim().split(/[\n+,，；;]/g)));
      for (var i = 0; i < newContent.length; i++) {
        if (newContent[i] === '') {
          newContent.splice(i, 1);
          i--;
        }
      }
      console.log(newContent);
    },
    fileReader(content) {
      // console.log(content);
      // console.log('********');
      let formData = new FormData();
      formData.append('file', content[1]);
      let xlsFileArr = [];
      axios({
        method: api.pushUpload.type,
        url: api.pushUpload.url,
        // headers: {'Content-Type': 'multipart/form-data'},
        data: formData
      }).then((res) => {
        console.log(res);
        if (res && res.data.responseData && res.data.responseData) {
          xlsFileArr = res.data.responseData;
          this.$set(this.ruleForm, 'customerIdList', res.data.responseData.join(','));
        }
      }).catch(() => {
        this.$message.error('上传文件失败');
      });
      console.log(this.ruleForm.customerIdList);
      let newContent = Array.from(new Set(xlsFileArr.join(',').trim().split(/[\n+,，；;]/g)));
      for (var i = 0; i < newContent.length; i++) {
        if (newContent[i] === '') {
          newContent.splice(i, 1);
          i--;
        }
      }
      console.log(newContent);
    },
    handleCheckedChange(value) {
      console.log(value);
    },
    // getUserGroupSelectAll() {
    //   console.log(this.customerGoruplist);
    // },
    getAssignCustomerLabelList() {
      let _this = this;
      if (_this.assignCustomerLabelList && _this.assignCustomerLabelList.length) {

      }
      else {
        // 获取指定用户标签分组列表
        axios({
          method: api.getCustomerGroupList.type,
          url: api.getCustomerGroupList.url,
          params: {}
        }).then((res) => {
          if (res && comm.hasResponseData(res.data) && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length) {
            _this.assignCustomerLabelList = _this.handleAssignCustomerLabelList(res.data.responseObject.responseData.dataList);
            // console.log(_this.handleAssignCustomerLabelList(res.data.responseObject.responseData.dataList));
          }
        }).catch((e) => {
          // 获取分组用户标签列表失败
        });
      }
    },
    addAssignCustomerLabel(val) {
      // 添加指定用户标签
      let _this = this;
      _this.groupOnOff = false;
      this.ruleForm.groupName = val;
      let lastAdd = {
        checked: 0,
        groupId: '',
        customerIdList: [],
        disabled: true,
        groupName: val
      };
      if (this.isSaveGroup) {
        this.assignCustomerLabelList[this.assignCustomerLabelList.length - 1].groupName = val;
      }
      else {
        this.assignCustomerLabelList.push(lastAdd);
        this.isSaveGroup = true;
      }
      // console.log(this.assignCustomerLabelList);
    },
    checkChecked(list) {
      let showOnOff = false;
      for (let num = 0; num < list.length; num++) {
        if (parseInt(list[num].checked, 10)) {
          showOnOff = true;
        }
      }
      return showOnOff;
    },
    // 从弹窗中每次点选触发已选的tag list
    updateSelect(list) {
      // console.log(list);
      let _this = this;
      for (let num = 0; num < _this.selectList.length; num++) {
        let dataItem = _this.selectList[num];
        let checked = 0;
        for (let innerNum = 0; innerNum < list.length; innerNum++) {
          let innerDataItem = list[innerNum];
          if (parseInt(dataItem.labelId, 10) === parseInt(innerDataItem, 10)) {
            checked = 1;
          }
        }
        dataItem.checked = checked;
      }
    },
    // 提交确认
    submitForm(formName) {
      var _this = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.pubSubmitDialog = true;
        }
        else {
          _this.$message.warning('必填项未填写完整');
          return false;
        }
      });
    },
    // 数据提交
    pubSubmitTrue() {
      var _this = this;
      if (this.linkOnOff) {
        this.ruleForm.resourceId = '';
      }
      else {
        this.ruleForm.linkUrl = '';
      }
      switch (this.ruleForm.goalUser) {
        case 0:
          axios({
            method: api.manualPushCreate.type,
            url: api.manualPushCreate.url,
            data: {
              crmPushConfigPO: {
                goalUser: _this.ruleForm.goalUser,
                isDelay: _this.ruleForm.isDelay,
                isSys: _this.ruleForm.isSys,
                linkUrl: _this.ruleForm.linkUrl,
                messageContent: _this.ruleForm.messageContent,
                messageScence: _this.ruleForm.messageScence,
                messageTitle: _this.ruleForm.messageTitle,
                pushGoal: _this.ruleForm.pushGoal,
                pushTime: _this.ruleForm.pushTime,
                pushType: _this.ruleForm.pushType,
                resourceId: _this.ruleForm.resourceId,
                opUser: sessionStorage.getItem('userLoginName')
              }
            }
          }).then((res) => {
            if (!res.data.responseObject.responseStatus) {
              _this.$message.error('提交失败');
            }
            else {
              _this.$message.success('提交成功');
            }
          }).catch(() => {
            _this.$message.error('提交失败');
          });
          break;
        case 1:
          axios({
            method: api.manualPushCreate.type,
            url: api.manualPushCreate.url,
            data: {
              crmPushConfigPO: {
                goalUser: _this.ruleForm.goalUser,
                isDelay: _this.ruleForm.isDelay,
                isSys: _this.ruleForm.isSys,
                linkUrl: _this.ruleForm.linkUrl,
                messageContent: _this.ruleForm.messageContent,
                messageScence: _this.ruleForm.messageScence,
                messageTitle: _this.ruleForm.messageTitle,
                pushGoal: _this.ruleForm.pushGoal,
                pushTime: _this.ruleForm.pushTime,
                pushType: _this.ruleForm.pushType,
                resourceId: _this.ruleForm.resourceId,
                opUser: sessionStorage.getItem('userLoginName')
              }
            }
          }).then((res) => {
            if (!res.data.responseObject.responseStatus) {
              _this.$message.error('提交失败');
            }
            else {
              _this.$message.success('提交成功');
            }
          }).catch(() => {
            _this.$message.error('提交失败');
          });
          break;
        case 2:
          axios({
            method: api.manualPushCreate.type,
            url: api.manualPushCreate.url,
            data: {
              crmPushConfigPO: {
                messageTitle: this.ruleForm.messageTitle,
                messageContent: this.ruleForm.messageContent,
                goalUser: this.ruleForm.goalUser,
                resourceId: this.ruleForm.resourceId,
                messageScence: this.ruleForm.messageScence,
                // isDelay: this.ruleForm.isDelay,
                isSys: this.ruleForm.isSys,
                linkUrl: this.ruleForm.linkUrl,
                pushGoal: this.ruleForm.pushGoal,
                pushTime: this.ruleForm.pushTime,
                pushType: this.ruleForm.pushType,
                opUser: sessionStorage.getItem('userLoginName')
              },
              crmPushGroupInfoPO: {
                intentionCourse: this.ruleForm.intentionCourse,
                tryseeCourse: this.ruleForm.tryseeCourse,
                ...this.filterArr(this.queryParams)
              }
            }
          }).then((res) => {
            if (!res.data.responseObject.responseStatus) {
              _this.$message.error('提交失败');
            }
            else {
              _this.$message.success('提交成功');
            }
          }).catch(() => {
            _this.$message.error('提交失败');
          });
          break;
        case 3:
          let newGroupIdList = [];
          if (this.ruleForm.groupIdList && this.ruleForm.groupIdList.length) {
            this.ruleForm.groupIdList.forEach((opt) => {
              newGroupIdList.push(opt.toString());
            });
          };
          axios({
            method: api.manualPushCreate.type,
            url: api.manualPushCreate.url,
            data: {
              crmPushConfigPO: {
                goalUser: this.ruleForm.goalUser,
                specialId: this.ruleForm.specialId ? this.rmNull(this.ruleForm.specialId.split(/[\n+,，；;]/g)).join(',') : '',
                // isDelay: this.ruleForm.isDelay,
                isSys: this.ruleForm.isSys,
                linkUrl: this.ruleForm.linkUrl,
                messageContent: this.ruleForm.messageContent,
                messageTitle: this.ruleForm.messageTitle,
                messageScence: this.ruleForm.messageScence,
                pushGoal: this.ruleForm.pushGoal,
                pushTime: this.ruleForm.pushTime,
                pushType: this.ruleForm.pushType,
                spacialId: this.ruleForm.spacialId, // 专家ID
                resourceId: this.ruleForm.resourceId, // 推送场景ID
                opUser: sessionStorage.getItem('userLoginName')
              },
              groupIdList: this.ruleForm.groupIdList ? newGroupIdList : '',
              // intentionCourse: this.ruleForm.intentionCourse,
              crmPushSpecCustomerGroupPO: {
                groupName: this.ruleForm.groupName
              },
              customerIdList: this.ruleForm.customerIdList ? this.rmNull(this.ruleForm.customerIdList.split(/[\n+,，；;]/g)) : [] // 指定用户
            }
          }).then((res) => {
            // _this.$message.success('提交成功');
            if (!res.data.responseObject.responseStatus) {
              _this.$message.error('提交失败');
            }
            else {
              _this.$message.success('提交成功');
            }
          }).catch(() => {
            _this.$message.error('提交失败');
          });
          break;
      };
      var timeout = setTimeout(() => {
        window.location.reload();
        clearTimeout(timeout);
      }, 2000);
      // console.log(this.ruleForm);
      _this.pubSubmitDialog = false;
    },
    getLabelList(itemData) { // 获取分组用户标签
      // console.log(itemData);
      let _this = this;
      axios({
        method: api.getManualUserGroups.type,
        url: api.getManualUserGroups.url,
        params: {
          type: itemData + 1
        }
      }).then((res) => {
        if (res && comm.hasResponseData(res.data) && res.data.responseObject) {
          _this.selectList = JSON.parse(JSON.stringify(_this.handleLabelData(res.data.responseObject.responseData.info)));
          _this.customerGoruplist[_this.selectLabelIndex].selectData = JSON.parse(JSON.stringify(_this.selectList));
          _this.showSelectDialog();
        }
      }).catch((e) => {
        // 获取分组用户标签列表失败
      });
    },
    handleLabelData(originalList) {
      // 针对不同的分组处理成不同的数据格式，最后传给标签弹窗
      let oriData = JSON.parse(JSON.stringify(originalList));
      let newArr = [];
      oriData.forEach((opt, index) => {
        newArr.push({
          labelName: opt,
          labelId: index
        });
      });
      // console.log(newArr);
      let lastData = [];
      for (let num = 0; num < newArr.length; num++) {
        let dataItem = newArr[num];
        dataItem.checked = 0;
        lastData.push(dataItem);
      }
      return lastData;
    },
    handleAssignCustomerLabelList(originalList) {
      // 将指定用户分组标签列表处理成前端需要的格式
      let oriData = JSON.parse(JSON.stringify(originalList));
      let lastData = [];
      for (let num = 0; num < oriData.length; num++) {
        let dataItem = oriData[num];
        dataItem.checked = 0;
        lastData.push(dataItem);
      }
      return lastData;
    },
    getSceneList() { // 获取场景列表参数
      let _this = this;
      axios({
        method: api.getSelectList.type,
        url: api.getSelectList.url,
        params: {
          scence: 1
        }
      }).then((res) => {
        if (res && res.data) {
          _this.sceneList = res.data.responseObject;
        }
      }).catch((e) => {
        // 获取场景列表失败
      });
    },
    closeSelectDialog() { // 关闭用户分组弹窗
      let _this = this;
      _this.selectList = [];
      _this.selectOnOff = false;
      // this.chooseAllTags.push()
    },
    changeSelectlist(currentIndex) { // 确认选中的标签并关闭用户分组弹窗
      let _this = this;
      _this.customerGoruplist[_this.selectLabelIndex].selectData = JSON.parse(JSON.stringify(_this.selectList));
      _this.closeSelectDialog();
      let newList = [];
      this.customerGoruplist.forEach((opt, index) => {
        if (currentIndex === index) {
          opt.selectData.forEach((_opt, _index) => {
            if (Number(_opt.checked) === 1) {
              newList.push({
                name: index,
                data: _opt.labelName
              });
            }
          });
        }
      });
      // console.log(newList);
      this.getChooseUserAcount(newList);
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
    handleClose(parentIndex, innerIndex, innerItem) {
      let _this = this;
      _this.customerGoruplist[parentIndex].selectData[innerIndex].checked = 0;
      var newArr = this.queryParams[this.formatterName(parentIndex)];
      let traceArr = newArr.splice(newArr.indexOf(innerItem.labelName), 1);
      console.log(traceArr);
      this.fetchCount();
    },
    filterArr(obj) {
      // console.log(obj);
      let result = [];
      for (var j in obj) {
        if (obj[j]) {
          result.push(obj[j]);
        }
      }
      let newResult = [];
      result.forEach((opt) => {
        opt.forEach((_opt) => {
          newResult.push(_opt);
        });
      });
      if (newResult.length === 0) {
        let reNewResult = { major: 0 };
        return reNewResult;
      }
      else {
        var newObj = {};
        for (var i in obj) {
          if (obj[i]) {
            newObj[i] = (obj[i]).join(',');
          }
        }
        return newObj;
      }
    },
    // 查询用户数量
    getChooseUserAcount(newList) {
      console.log(newList);
      let that = this;
      let nameArrs = [];
      newList.forEach((opt, index) => {
        let item = that.formatterName(opt.name);
        nameArrs.push(opt.data);
        this.queryParams[item] = nameArrs;
      });
      this.fetchCount();
    },
    fetchCount() {
      console.log(this.filterArr(this.queryParams));
      axios({
        method: api.mulTagUserCount.type,
        url: api.mulTagUserCount.url,
        params: this.filterArr(this.queryParams)
      }).then((res) => {
        // console.log('查询用户数量');
        // console.log(res);
        this.courseGroupCount = res.data.responseObject.responseData.count;
      }).catch(() => {});
    },
    closeGroupDialog(name) {
      let _this = this;
      _this.groupOnOff = false;
    },
    checkCustomerId(str) {
      let pattern = /^[\d\n；;]+$/;
      // let pattern = /^\d{13}([\s\n;；])?(\d{13})/g;
      // let testStr = str.replace(/\s*/g, '');
      // testStr = str.replace(/；/g, ';');
      return pattern.test(str);
    },
    addGroupName() {
      let _this = this;
      let customerIdList = _this.ruleForm.customerIdList;
      if ((!comm.checkInvalid(customerIdList))) {
        _this.groupOnOff = true;
      }
      else {
        _this.$message.error('请输入正确ID');
      }
    },
    searchFans() {
      let _this = this;
      let specialId = _this.ruleForm.specialId;
      if ((!comm.checkInvalid(specialId)) && _this.checkCustomerId(specialId)) {
        let newSpecialId = this.rmNull(specialId.trim().split(/[\n+,，；;]/g)).join(',');
        axios({
          method: api.getFansCount.type,
          url: api.getFansCount.url,
          params: {
            customerIdList: newSpecialId,
            filterValid: '1',
            isValid: '1'
          }
        }).then((res) => {
          console.log(res);
          this.fansCount = res.data.responseObject;
        }).catch(() => {});
      }
      else {
        _this.$message.error('请输入正确ID');
      }
    },
    showSelectDialog() {
      let _this = this;
      _this.selectOnOff = true;
      _this.selectLabelName = _this.customerGoruplist[_this.selectLabelIndex].labelName;
    },
    selectLabel(index) {
      let _this = this;
      _this.selectLabelIndex = index;
      let item = _this.customerGoruplist[index];
      if (item.selectData && item.selectData.length) {
        // 如果说数据存在，说明本页面缓存里面已经有数据可以不用再次请求
        _this.selectList = JSON.parse(JSON.stringify(item.selectData));
        _this.showSelectDialog();
      }
      else {
        // 如果数据不存在，需要请求数据，然后将数据放到本页面缓存中去
        _this.getLabelList(index);
      }
      this.currentIndex = index;

      // _this.selectOnOff = true;
    },
    restoreAssignCustomer() {
      let _this = this;
      _this.assignCustomerLabelList = _this.handleAssignCustomerLabelList(_this.assignCustomerLabelList);
      this.ruleForm.customerIdList = '';
      _this.ruleForm.specialId = '';
    },
    restoreGroupCustomer() {
      // let _this = this;
      // _this.ruleForm.intentionCourse = '';
      // _this.ruleForm.tryseeCourse = '';
      // _this.selectList = [];
      // for (let num = 0; num < _this.customerGoruplist.length; num++) {
      //   let itemData = _this.customerGoruplist[num];
      //   itemData.selectData = _this.handleLabelData(itemData.selectData);
      // }
      // console.log('*******');
      // console.log(this.customerGoruplist);
    }
  },
  watch: {
    'ruleForm.pushType': {
      handler(newVal, oldVal) {
        let _this = this;
        switch (parseInt(newVal, 10)) {
          case 1:
            _this.ruleForm.pushTime = '';
            break;
          case 2:
            break;
        }
      },
      deep: true
    },
    'ruleForm.goalUser': {
      handler(newVal, oldVal) {
        let _this = this;
        switch (parseInt(newVal, 10)) {
          case 1:// 全部用户
            // _this.restoreAssignCustomer();
            _this.restoreGroupCustomer();
            break;
          case 2:// 分组用户
            // _this.restoreAssignCustomer();
            // _this.getLabelList();
            // console.log(this.customerGoruplist);
            break;
          case 3:// 指定用户
            _this.getAssignCustomerLabelList();
            _this.restoreGroupCustomer();
            break;
        }
      },
      deep: true
    },
    customerGoruplist: {
      handler(newVal, oldVal) {
        // this.listenSelectChange(newVal);
      },
      deep: true
    },
    'ruleForm.customerIdList': {
      handler(newVal) {
        if (newVal instanceof Array) {
          newVal = newVal.join(',');
        }
        let value = this.rmNull(newVal.trim().split(/[\n+,，；;]/g));
        if (value && value.length) {
          this.selectNum = value.length;
        }
        var time = setTimeout(fn => {
          if (value.length === 0) {
            this.selectNum = 0;
            clearTimeout(time);
          }
        }, 100);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
  @import "../../assets/scss/pages/manualPush/manualPush.scss";
</style>
