<template>
  <section class="crm-cert">
    <section class="crm-cert-tip" v-show="confirmRole">
      <h3 class="crm-cert-title">认证证件页提示</h3>
      <div class=" crm-cert-content">
        <el-input class="crm-cert-input" placeholder="请输入认证证件页提示标题" v-model="certTipTitle"></el-input>
        <el-input class="crm-cert-input" placeholder="请输入认证证件页提示内容" v-model="certTipContent"></el-input>
        <el-button type="primary" round @click="tipConfirmOnClick">确认修改</el-button>
      </div>
    </section>
    <section class="crm-cert-show" v-show="confirmRole">
      <h3 class="crm-cert-title">认证证件展示</h3>
      <!--医生角色-->
      <section class="crm-cert-sort" v-show="currentRole && currentRole.scene===2">
        <section class="crm-cert-sort-panel">
          <div class="crm-cert-sort-left sort-font">
            <h3>序号</h3>
            <ul>
              <li v-for="index in sortItemList6.length" :key="index">{{index}}</li>
            </ul>
          </div>
          <div class="crm-cert-sort-right sort-font">
            <h3>证件名称</h3>
            <SortableList lockAxis="" v-model="sortItemList6" helperClass="helperClass">
              <SortableItem v-for="(item, index) in sortItemList6" :index="index" :key="index" :item="item.refValue"/>
            </SortableList>
          </div>
        </section>
        <section class="crm-cert-sort-panel">
          <div class="crm-cert-sort-left sort-font">
            <h3>序号</h3>
            <ul>
              <li v-for="index in sortItemList7.length" :key="index">{{index}}</li>
            </ul>
          </div>
          <div class="crm-cert-sort-right sort-font">
            <h3>证件名称</h3>
            <SortableList lockAxis="" v-model="sortItemList7" helperClass="helperClass">
              <SortableItem v-for="(item, index) in sortItemList7" :index="index" :key="index" :item="item.refValue"/>
            </SortableList>
          </div>
        </section>
        <div>
          <el-button type="primary" round @click="showSortConfirmOnClick">确认修改</el-button>
        </div>
      </section>
      <!--护士角色-->
      <section class="crm-cert-sort" v-show="currentRole && currentRole.scene===6">
        <section class="crm-cert-sort-panel">
          <div class="crm-cert-sort-left sort-font">
            <h3>序号</h3>
            <ul>
              <li v-for="index in sortItemList12.length" :key="index">{{index}}</li>
            </ul>
          </div>
          <div class="crm-cert-sort-right sort-font">
            <h3>证件名称</h3>
            <SortableList lockAxis="" v-model="sortItemList12" helperClass="helperClass">
              <SortableItem v-for="(item, index) in sortItemList12" :index="index" :key="index" :item="item.refValue"/>
            </SortableList>
          </div>
        </section>
        <div>
          <el-button type="primary" round @click="showSortConfirmOnClick">确认修改</el-button>
        </div>
      </section>
    </section>
    <el-dialog
      class="crm-cert-select"
      center
      width="380px"
      :visible="selectDialogVisible"
      :before-close="selectDialogCloseHandle">
      <h3 slot="title">请选择要调整的用户身份</h3>
      <div class="cert-select-container">
        <ul>
          <li v-for="(item,index) in certRole"
              :key="index"
              :class="{'cert-item-selected':item.selected}"
              @click="selectItemOnClick(item)"
          >{{item.roleName}}
          </li>
        </ul>
      </div>
      <div slot="footer">
        <el-button @click="confirmCertRoleHandle" :class="{'el-button-disabled':!currentRole}">进入</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
/**
 * 功能描述：资源管理-认证资源-认证提示模块
 * 注意事项：
 * 1、本模块主要包括两部分：
 *    认证证件页提示，仅涉及字段的修改
 *    认证证件展示，涉及排序，不同角色排序的内容也不同，需要注意
 * 2、本模块涉及角色判断，当前仅有如下角色：
 *    医生：scene=2、sortItemList6、sortItemList7
 *    护士：scene=6、sortItemList12
 *
 * Create by YaoQiao on 2019/3/14
*/

import apiConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request.js';
import {ContainerMixin, ElementMixin} from 'vue-slicksort';

const SortableList = {
  mixins: [ContainerMixin],
  template: `<ul><slot></slot></ul>`
};
const SortableItem = {
  mixins: [ElementMixin],
  props: ['item'],
  template: `<li class="">{{item}}</li>`
};

// 认证相关信息维护
export default {
  name: 'informationMaintenance',
  data() {
    return {
      certTipTitle: '',
      certTipContent: '',
      sortItemList6: [], // 认证证件展示-医生-左
      sortItemList7: [], // 认证证件展示-医生-右
      sortItemList12: [], // 认证证件展示-护士
      selectDialogVisible: true,
      confirmRole: false,
      // 可选角色
      certRole: [{
        roleName: '医生',
        scene: 2,
        selected: false
      },
      {
        roleName: '护士',
        scene: 6,
        selected: false
      }],
      currentRole: null // 当前选择的角色
    };
  },
  methods: {
    // 认证证件页提示信息的点击事件处理，发送数据
    tipConfirmOnClick() {
      const _this = this;
      const data = {
        scene: _this.currentRole.scene,
        promptCondition: 0,
        visitSiteId: 25,
        promptMessage: this.certTipTitle + '@=@' + this.certTipContent
      };
      axios({
        method: apiConfig.updateCertTipInfo.type,
        url: apiConfig.updateCertTipInfo.url,
        data: data
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseStatus) {
          _this.$message.info('修改认证证件页提示成功！');
        }
        else {
          _this.$message.error('修改认证证件页提示失败！');
        }
      }).catch(() => {
        _this.$message.error('修改认证证件页提示失败！');
      });
    },
    /**
     * 功能描述：证件展示排序确定按钮点击事件处理，发送数据
     * 参数说明：
     * sortItemList6：认证证件展示-医生-左
     * sortItemList7：认证证件展示-医生-右
     * sortItemList12：认证证件展示-护士
     * 注意事项：
     *
     * Create by YaoQiao on 2019/3/14
     */

    showSortConfirmOnClick() {
      let sortItemList6 = this.sortItemList6;
      let sortItemList7 = this.sortItemList7;
      let sortItemList12 = this.sortItemList12;
      let _dataList = [];
      // 更新6的排序
      _dataList = _dataList.concat(this.updateSortItemListData(sortItemList6));
      // 更新7的排序
      _dataList = _dataList.concat(this.updateSortItemListData(sortItemList7));
      // 更新12的排序
      _dataList = _dataList.concat(this.updateSortItemListData(sortItemList12));

      const data = {
        visitSiteId: 25,
        data_list: _dataList
      };
      const _this = this;
      axios({
        method: apiConfig.updateCertSortInfo.type,
        url: apiConfig.updateCertSortInfo.url,
        data: data
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseMessage === 'update success') {
          _this.$message.info('修改认证证件展示成功！');
        }
        else {
          _this.$message.error('修改认证证件展示失败！');
        }
      }).catch(() => {
        _this.$message.error('修改认证证件展示失败！');
      });
    },
    /**
     * 功能描述：
     * 参数说明：
     *  scene:2 -- 医生角色
     *       :6 -- 护理角色
     *
     *  roleIdList:"6,7"  -- 医生角色的认证证件展示类型
     *            :"12"   -- 护理角色的认证证件展示类型
     *
     * 注意事项：
     * 1、此方法有两次请求：一次请求认证证件页提示数据
     *                      一次请求认证证件展示数据
     *
     *
     * Create by YaoQiao on 2019/3/14
     */
    getDefaultData() {
      const _this = this;
      let _roleIdList = '';
      // 医生角色
      if (_this.currentRole.scene === 2) {
        _roleIdList = '6,7';
      } // 护理角色
      else if (_this.currentRole.scene === 6) {
        _roleIdList = '12';
      }

      // 获取提示数据
      axios({
        method: apiConfig.getCertTipInfo.type,
        url: apiConfig.getCertTipInfo.url,
        params: {
          scene: _this.currentRole.scene,
          promptCondition: 0
        }
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseData) {
          const data = res.data.responseObject.responseData;
          if (data && data.promptMessage) {
            const list = data.promptMessage.split('@=@');
            _this.certTipTitle = list[0];
            _this.certTipContent = list[1];
          }
        }
      }).catch((e) => {
        console.log('获取认证证件页提示异常', e);
      });

      // 获取排序列表数据
      axios({
        method: apiConfig.getCertSortInfo.type,
        url: apiConfig.getCertSortInfo.url,
        params: {
          isValid: 2,
          visitSiteId: 25,
          roleIdList: _roleIdList
        }
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseData) {
          const data = res.data.responseObject.responseData;
          // 如果是医生角色，配置 sortItemList6，sortItemList7
          if (_this.currentRole.scene === 2) {
            if (data && data.data_list) {
              const list = data.data_list;
              for (let i = 0; i < list.length; i++) {
                // 如果为6，表示为左侧数据
                if (list[i][6]) {
                  _this.sortItemList6 = list[i][6];
                }
                // 如果为7，表示为右侧数据
                if (list[i][7]) {
                  _this.sortItemList7 = list[i][7];
                }
              }
            }
          } // 如果是护理角色，配置 sortItemList12
          else if (_this.currentRole.scene === 6) {
            if (data && data.data_list) {
              const list = data.data_list;
              for (let i = 0; i < list.length; i++) {
                // 如果为6，表示为左侧数据
                if (list[i][12]) {
                  _this.sortItemList12 = list[i][12];
                }
              }
            }
          }
        }
      }).catch((e) => {
        console.log('获取认证证件页提示异常', e);
      });
    },
    selectDialogCloseHandle() {
      // 点击关闭按钮后，退出至首页
      this.$router.push({path: './home'});
    }, // 用户身份选择项点击处理函数
    selectItemOnClick(item) {
      if (this.currentRole) {
        this.currentRole.selected = false;
      }
      item.selected = true;
      this.currentRole = item;
    },
    confirmCertRoleHandle() {
      if (this.currentRole) {
        this.confirmRole = true;
        this.selectDialogVisible = false;
        // 获取认证证件页提示数据
        this.getDefaultData();
      }
    },
    // 根据现有的证件列表，返回对应的证件顺序
    updateSortItemListData(sortItemList) {
      let _result = [], dataObj = {};
      for (let i = 0; i < sortItemList.length; i++) {
        dataObj = {};
        dataObj.roleId = sortItemList[i].roleId;
        dataObj.sortId = i + 1;
        dataObj.refId = sortItemList[i].refId;
        dataObj.isValid = sortItemList[i].isValid;
        _result.push(dataObj);
      }
      return _result;
    }
  },
  components: {
    SortableList,
    SortableItem
  }
};
</script>

<style lang="scss" scoped>
  .crm-cert {
    width: 1200px;
    margin: 0 auto;
    .crm-cert-title {
      margin: 32px 0 25px 0;
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bolder;
    }
    .crm-cert-content {
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 4px;
    }
    .crm-cert-input {
      padding: 20px 20px 0 20px;
      width: 1160px;
    }
    .el-button {
      margin: 36px 20px;
      padding: 10px 50px;
      background: #4B67D6;
      border-radius: 100px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 15px;
    }
    .crm-cert-select {
      .cert-select-container {
        ul {
          display: flex;
        }
        li {
          flex: 1;
          border: 1px solid #cad1ed;
          border-radius: 3px;
          text-align: center;
          width: 110px;
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          color: #4B67D6;
          margin: 10px;
          padding: 5px;
          cursor: pointer;
        }
        .cert-item-selected {
          background: #4B67D6;
          color: #FFFFFF;
        }
      }
      .el-button {
        margin: 0 auto;
      }
      .el-button-disabled {
        background: #b5b8c3;
      }
    }
  }

  .crm-cert-sort {
    display: block;
    width: 1200px;
    height: auto;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
    border-radius: 4px;
    .crm-cert-sort-panel {
      display: inline-block;
      padding: 20px;
      font-size: 0;
      vertical-align: top;
      .sort-font {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        line-height: 14px;
      }

      h3 {
        padding: 13px 30px;
        border: 1px solid #E6E6E8;
        margin: 0;
      }
      ul {

        li {
          padding: 13px 30px;
          border: 1px solid #E6E6E8;
          cursor: pointer;
          user-select: none;
        }
      }

      .crm-cert-sort-left {
        display: inline-block;

      }
      .crm-cert-sort-right {
        display: inline-block;
      }
    }

  }

  .helperClass {
    opacity: 0.3;
    background: #A8BAFF;
    text-align: center;
    line-height: 42px;
  }

</style>
