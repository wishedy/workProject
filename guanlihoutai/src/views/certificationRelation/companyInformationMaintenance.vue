<template>
  <section class="crm-cert">
    <section class="crm-cert-tip">
      <h3 class="crm-cert-title">认证证件页提示</h3>
      <div class=" crm-cert-content">
        <el-input class="crm-cert-input" placeholder="请输入认证证件页提示标题" v-model="certTipTitle"></el-input>
        <el-input class="crm-cert-input" placeholder="请输入认证证件页提示内容" v-model="certTipContent"></el-input>
        <el-button type="primary" round v-on:click="tipConfirmOnClick">确认修改</el-button>
      </div>
    </section>
    <section class="crm-cert-show">
      <h3 class="crm-cert-title">认证证件展示</h3>
      <section class="crm-cert-sort">
        <section class="crm-cert-sort-panel">
          <div class="crm-cert-sort-left sort-font">
            <h3>序号</h3>
            <ul>
              <li v-for="index in sortItemList14.length" :key="index">{{index}}</li>
            </ul>
          </div>
          <div class="crm-cert-sort-right sort-font">
            <h3>证件名称</h3>
            <SlickList v-model="sortItemList14" class="cert-sort-slick-list">
              <SlickItem v-for="(item,index) in sortItemList14" :key="item.id" :index="index"
                         class="cert-sort-slick-item">
                <StringInput v-model="item.refValue"></StringInput>
              </SlickItem>
            </SlickList>
          </div>
        </section>
        <div>
          <el-button type="primary" round v-on:click="showSortConfirmOnClick">确认调整</el-button>
        </div>
      </section>
    </section>
  </section>
</template>

<script>
/**
 * 功能描述：厂商认证信息配置
 * 参数说明：
 * 注意事项：
 * 1、基本参考 ./informationMaintenance.vue
 * 2、不同点在于厂商的认证证件展示排序的同时允许输入修改，目前仅支持一列，多列不支持
 * 3、由于 input 和拖拽功能不能同时被激活，所以拖拽的行会比 input 大一些，否则不能实现
 *
 * Create by YaoQiao on 2019/4/3
 */

import apiConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request.js';
import {SlickList, SlickItem} from 'vue-slicksort';
import StringInput from './components/StringInput';

// 认证相关信息维护
export default {
  name: 'informationMaintenance',
  components: {
    SlickList,
    SlickItem,
    StringInput
  },
  data() {
    return {
      certTipTitle: '',
      certTipContent: '',
      sortItemList14: []
    };
  },
  methods: {
    tipConfirmOnClick() {
      const _this = this;
      const data = {
        scene: 7,
        promptCondition: 0,
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
    showSortConfirmOnClick() {
      let sortItemList14 = this.sortItemList14;
      let _dataList = [];
      let dataObj = {};
      // 更新14的排序
      for (let i = 0; i < sortItemList14.length; i++) {
        dataObj = {};
        dataObj.roleId = sortItemList14[i].roleId;
        dataObj.sortId = i + 1;
        dataObj.refId = sortItemList14[i].refId;
        dataObj.isValid = sortItemList14[i].isValid;
        _dataList.push(dataObj);
      }

      let data = {
        visitSiteId: 25,
        data_list: _dataList
      };
      const _this = this;
      // 因为顺序和内容分成两个接口，其中顺序沿用原有的医护人员的证件顺序接口
      // 企业认证证件名称接口为新增接口
      // 先更新顺序，再更新内容
      axios({
        method: apiConfig.updateCertSortInfo.type,
        url: apiConfig.updateCertSortInfo.url,
        data: data
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseMessage === 'update success') {
          _dataList = [];
          for (let i = 0; i < sortItemList14.length; i++) {
            dataObj = {};
            dataObj.refId = sortItemList14[i].refId;
            dataObj.refValue = "'" + sortItemList14[i].refValue + "'";
            _dataList.push(dataObj);
          }
          data = {
            visitSiteId: 25,
            data_list: _dataList
          };
          axios({
            method: apiConfig.updateCompanyCertInfo.type,
            url: apiConfig.updateCompanyCertInfo.url,
            data: data
          }).then((res) => {
            if (res && res.data.responseObject && res.data.responseObject.responseMessage === 'update success') {
              _this.$message.info('修改认证证件展示成功！');
            }
            else {
              _this.$message.error('修改认证证件展示失败！');
            }
          }).catch(() => {
            _this.$message.error('修改认证证件展示失败！');
          });
        }
        else {
          _this.$message.error('修改认证证件展示失败！');
        }
      }).catch(() => {
        _this.$message.error('修改认证证件展示失败！');
      });
    },
    getDefaultData() {
      const _this = this;
      // 获取提示数据
      axios({
        method: apiConfig.getCertTipInfo.type,
        url: apiConfig.getCertTipInfo.url,
        params: {
          scene: 7,
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
          roleIdList: '14'
        }
      }).then(function(res) {
        if (res && res.data.responseObject && res.data.responseObject.responseData) {
          const data = res.data.responseObject.responseData;
          if (data && data.data_list) {
            const list = data.data_list;
            for (let i = 0; i < list.length; i++) {
              // 如果为14，表示为左侧数据
              if (list[i][14]) {
                _this.sortItemList14 = list[i][14];
                break;
              }
            }
          }
        }
      }).catch((e) => {
        console.log('获取认证证件页提示异常', e);
      });
    }
  },
  mounted: function() {
    // 获取认证证件页提示数据
    this.getDefaultData();
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
          height: 40px;
          line-height: 40px;
        }
      }

      .cert-sort-slick-list {
        .cert-sort-slick-item {
          padding: 13px 30px;
          border: 1px solid #E6E6E8;
          cursor: pointer;
          user-select: none;
          height: 40px;
          line-height: 40px;
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
