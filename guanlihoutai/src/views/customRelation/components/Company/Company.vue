<template>
  <div class="company-container" >
    <div class="company-content-container ">
      <div class="company-content">
        <span class="content-label">企业</span>
        <div class="content-input-container"
             @click.stop="clickItem('company')"
        >
          <input readonly="readonly" type="text"
                 v-model="hName"/>
        </div>
      </div>
      <div>
        <div class='approved' v-show='ifModeFollowForm'>
          <span>已验证</span>
        </div>
        <div class='btn-add-company' @click.stop='addCompanyBtnOnClick' v-show='!ifModeFollowForm'>
          <span>添加企业</span>
        </div>
      </div>
    </div>

    <div class='company-search-container' v-if='ifSearchHospital'>
      <div class='search-result'>
        <div class='search-icon'>
          <img src='/static/images/icons/icon-search.png' alt=''>
        </div>
        <div class='search-input'>
          <input type='text' placeholder='输入要查找的企业'
                 @input.stop='searchCompany'
                 v-model='fillSearchHospital'>
        </div>
        <ul v-if='ifSearchNullValue'>
          <li v-for='item in hospitalItems'
              :key='item.id'
              @click='pickSearchCompany(item)'
              v-html='item.companyName'></li>
        </ul>
      </div>
    </div>

    <div v-if='ifPopupWindow'>
      <div class='cloak'></div>
      <div class='popupWindow'>
        <div class='el-message-box'>
          <div class='el-message-box__header'>
            <button type='button' aria-label='Close' class='el-message-box__headerbtn' @click='closePopupWindow'>
              <i class='el-message-box__close el-icon-close'></i>
            </button>
          </div>
          <div class='title'>添加企业</div>
          <div class='el-message-box__content'>
            <ul>
              <li>
                <div class='LiLabel'>
                  <div class='requireFlag'>*</div>
                  <div>企业名称</div>
                </div>
                <div class='el-input'>
                  <input type='text' class='el-input__inner' v-model='fillHospitalName'>
                </div>
              </li>
            </ul>
          </div>
          <div class='el-message-box__btns'>
            <button type='button' class='submit_hospital' @click='addConfirm'>
              <span>确认添加</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import comm from '@/assets/js/utils/comm';
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';

export default {
  name: 'Company',
  props: {
    selected: {type: String}, // 作用于当前选中的样式
    hName: {type: String}, // 企业名称
    companyId: {type: String}, // 企业名称ID
    ifModeFollowForm: {type: Number} // 企业  初使显示1已验证/ 0添加企业
  },
  data: function() {
    return {
      loading: null,
      lockStyle: 'is-component el-popup-parent--hidden', // 弹出时锁屏
      ifPopupWindow: false, // 是否弹出添加企业
      ifSearchHospital: false, // 搜索激活
      ifSearchNullValue: false, // 搜索有值

      fillSearchHospital: '', // 搜索框
      fillHospitalName: '',
      fillHospitalAliasName: '',
      fillCity: '',
      fillCounty: '',
      fillHospitalLevel: '',

      hospitalItems: [] // 联想企业
    };
  },
  methods: {
    searchCompany(el) {
      if (!el.target.value) this.ifSearchNullValue = false;
      else this.ifSearchNullValue = true;

      // 设定时间来执行
      this.clearTimer();
      if (el.target.value && el.target.value.length > 0) {
        this.timer = setTimeout(() => {
          if (el.target.value !== '') {
            axios({
              method: apiConfig.getCompany.type,
              url: apiConfig.getCompany.url,
              params: {
                companyName: el.target.value,
                firstResult: 0,
                maxResult: 20
              }
            }).then((response) => {
              if (comm.isEmptyObject(response.data.responseObject.responseData.dataList)) {
                this.ifSearchNullValue = false;
                this.$emit('setModeFollowForm', 0);
                // this.$emit('sendCompanyId',);
                this.hospitalItems = [];
              }
              else {
                this.ifSearchNullValue = true;
                this.$emit('setModeFollowForm', 1);
                this.searchChangeColor(el.target.value, response.data.responseObject.responseData.dataList);
              }
            });
          }
        }, 500);
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    searchChangeColor(queryKey, resultsList) {
      resultsList.map((item, index) => {
        if (queryKey && queryKey.length > 0) {
          let replaceReg = new RegExp(queryKey, 'g');
          let replaceString = '<span class="search_text">' + queryKey + '</span>';
          resultsList[index].hospitalNameBackup = item.companyName;
          resultsList[index].companyName = item.companyName.replace(replaceReg, replaceString);
        }
      });
      this.hospitalItems = resultsList;
    },
    pickSearchCompany(item) {
      this.ifSearchHospital = false;
      this.ifSearchNullValue = false;
      this.fillSearchHospital = '';
      this.$emit('setCompanyName', item.hospitalNameBackup);
      this.$emit('sendCompanyId', item.companyId);
    },
    addCompanyBtnOnClick() {
      document.body.setAttribute('class', this.lockStyle);

      // 预填充添加企业
      if (this.fillSearchHospital.length > 0) this.fillHospitalName = this.fillSearchHospital;
      else this.fillHospitalName = this.hName;

      this.ifPopupWindow = true;
      this.ifSearchHospital = false;
    },
    closePopupWindow() {
      this.ifPopupWindow = false;
      this.$root.$el.removeAttribute('class');
    },
    clickItem(key) {
      this.$parent.selected = this.selected !== key ? key : '';
      this.ifSearchHospital = true;
      this.$parent.showStateGender = false;
      this.$parent.showStateMedical = false;
    },
    addConfirm() {
      let obj = {};
      obj.companyName = this.fillHospitalName; // 企业名称
      obj.hospitalOthername = this.fillHospitalAliasName; // 企业别名
      obj.isValid = 1; // 是否有效（0-无效；1-有效）
      obj = this.tools().requireHospitalInfo(obj);
      if (!obj) {
        return false;
      }
      axios({
        method: apiConfig.addCompany.type,
        url: apiConfig.addCompany.url,
        data: {
          companyName: obj.companyName,
          hospitalOthername: obj.hospitalOthername,
          isValid: obj.isValid
        }
      }).then((response) => {
        if (response.data.responseObject.responseStatus) {
          this.ifPopupWindow = false;
          this.$message.info('添加企业成功！');
          document.body.removeAttribute('class');

          this.$emit('setCompanyName', this.fillHospitalName);
          this.$emit('setCompanyId', response.data.responseObject.responsePk);
          if (!this.ifSingleStyle) {
            this.$parent.hName = this.fillHospitalName;
            this.$parent.companyId = response.data.responseObject.responsePk;
          }

          this.fillSearchHospital = ''; // 搜索框
          this.fillHospitalName = '';
          this.fillHospitalAliasName = '';
          this.fillProvince = ''; // 空
          this.fillCity = '';
          this.fillCounty = '';
          this.fillHospitalLevel = '';
          this.$parent.ifModeFollowForm = 1;
        }
        else {
          this.$message.error('添加企业失败！');
        }
      });
    },
    tools() {
      return {
        _superThis: this,
        requireHospitalInfo(obj) {
          let content = '';
          if (!obj.companyName) {
            content = '企业名称不能为空';
          }
          else {
            return obj;
          }
          this._superThis.$allin_confirm({
            title: '提示',
            content: content,
            type: 'notice',
            btnName: '确定'
          });
          return false;
        }
      };
    }
  },
  mounted() {
    document.onclick = () => {
      // TODO 隐藏搜索框
    };
  },
  destroyed() {
    document.onclick = null;
  }
};
</script>

<style lang="scss" scoped>
  .company-container {
    float: left;
    margin: 0 0 22px 0;
    font-size: 14px;
    color: #555555;
    width: 285px;
  }

  .company-content-container {
    float: left;
    margin: 0;
    font-size: 14px;
    color: #555555;
    width: 420px;
    .company-content {
      float: left;
      .content-label {
        float: left;
        padding-left: 40px;
        width: 28px;
      }

      input {
        width: 185px;
        padding: 0px;
        border: 0px;
      }

    }
    .btn-add-company {
      margin-left: 5px;
      width: 70px;
      height: 39px;
      border-radius: 4px;
      background: #EDF1FF;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B67D6;
      letter-spacing: 0;
      line-height: 16px;
      float: left;
      cursor: pointer;

      span {
        width: 70px;
        text-align: center;
      }

    }
    .approved {
      margin-left: 5px;
      width: 74px;
      height: 39px;
      opacity: 0.8;
      background: #E9F7E9;
      border-radius: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #52CC64;
      letter-spacing: 0;
      line-height: 16px;
      float: left;

      span {
        width: 74px;
        text-align: center;
      }

    }
    .content-input-container {
      background: #F7F9FC;
      border-radius: 4px;
      height: 36px;
      padding: 0 12px;
      color: #111111;
      width: 185px;
      display: inline-block;
      border: 1px solid #E6E6E8;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #111111;
      letter-spacing: 0;
      line-height: 14px;
      cursor: pointer;

      &.active {
        border: 1px solid #4B67D6;
      }

    }
    span {
      display: inline-block;
      margin-right: 15px;
      width: 42px;
      margin-top: 11px;
      text-align: justify;
      vertical-align: bottom;

      i {
        display: inline-block;
        width: 100%;
      }

    }
    input {
      background: #F7F9FC;
      border-radius: 4px;
      height: 36px;
      padding: 0 12px;
      color: #111111;
      width: 140px;
      border: 1px solid #E6E6E8;

      &
      .active {
        border: 1px solid #4B67D6;
      }

    }
  }

  .popupWindow {
    z-index: 1009;
    position: fixed;
    /*top: 0;*/
    /*left: 0;*/
    left: 0%;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;
    .uploadImg {
      position: absolute;
      width: 98px;
      height: 73.7px;
    }
    .el-icon-close {
      font-size: 23px;
    }

    .hospitalLevel {
      margin-right: 11px;
      float: left;

      ul {
        position: fixed;
        z-index: 1001;
        border-radius: 4px;
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
        margin-top: 7px;
        height: 238px;
        overflow-x: auto;

        li {
          width: 187px;
          height: 40px;
          cursor: pointer;
          margin-bottom: 0px;
          line-height: 40px;
          padding: 0 8px;
        }

        li:hover {
          background: #EDF1FF;
          font-family: PingFangSC-Regular;
          color: #4B67D6;
          letter-spacing: 0;
        }

      }
    }
    .province, .city, .county {
      width: 66px;
      margin-right: 11px;
      float: left;

      ul {
        position: fixed;
        z-index: 1001;
        border-radius: 4px;
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
        margin-top: 7px;
        max-height: 238px;
        overflow-x: auto;

        li {
          /*width: 66px;*/
          height: 40px;
          cursor: pointer;
          margin-bottom: 0px;
          line-height: 40px;
          padding: 0 8px;
        }

        li:hover {
          background: #EDF1FF;
          font-family: PingFangSC-Regular;
          color: #4B67D6;
          letter-spacing: 0;
        }

      }
    }
    .noFlagLiLabel {
      width: 94px;
      padding-right: 19px;
      padding-left: 15px;

      span {
        float: left;
        height: 100px;
        line-height: 100px;
      }

    }
    .LiLabel {
      width: 94px;
      float: left;
      text-align: center;

      div {
        float: left;
        padding-top: 10px;
      }

      .requireFlag {
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #EB3B46;
        letter-spacing: 0;
        line-height: 14px;
        vertical-align: middle;
        width: 15px;
        height: 15px;
        padding-top: 13px;
      }

    }
    ul li {
      margin-bottom: 20px;
    }

    .el-input {
      width: 222px;

      .el-input__inner {
        height: 36px;
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #111111;
        letter-spacing: 0;
        line-height: 14px;
        padding: 0 10px;
      }

    }
    .provinceWrap {
      width: 235px;
    }

    .photoWrap {
      width: 228px;
      margin-left: 22px;
    }
    .title {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      margin-top: 2px;
      margin-bottom: 19px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 24px;
      text-align: center;
    }

    .submit_hospital {
      background: #4B67D6;
      border-radius: 100px;
      width: 160px;
      height: 41px;
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 15px;
      cursor: pointer;
    }

    .el-message-box {
      width: 381px;
      max-height: 508px;
      overflow-y: auto;
    }

    .el-message-box__btns {
      padding: 5px 15px 0;
      text-align: center;
      margin-bottom: 20px;
    }

  }

  .cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1009;
    opacity: 0.7;
    background: #000000;
  }

  .company-search-container {
    position: relative;
    z-index: 1008;
    left: 60px;
    background: #FFFFFF;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.10);
    border-radius: 4px;

    .search-result {
      position: absolute;
      top: 40px;
      left: 23px;
      background: #fff;
      border-radius: 4px;
      -webkit-box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
      box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
      min-width: 140px;

      .search_text {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 14px;
      }

      ul {
        max-height: 250px;
        overflow-y: auto;

        li {
          height: 40px;
          line-height: 40px;
          padding-left: 10px;
          cursor: pointer;
          font-size: 14px;
        }

        li:hover {
          background: #EDF1FF;
        }

      }
    }

    .search-icon {
      left: 7px;
      top: 12.9px;
      position: relative;
      width: 19px;
      height: 19px;
      float: left;
    }

    .search-input {
      position: relative;
      left: 8px;
      width: 400px;

      input::-webkit-input-placeholder {
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #BCC2CC;
        letter-spacing: 0;
        line-height: 13px;
      }

      input {
        width: 360px;
        box-sizing: border-box;
        height: 40px;
        border: 0px;
        font-size: 14px;
      }

    }

  }

  .singleStyle_hospital {
    width: 420px;
  }

</style>
