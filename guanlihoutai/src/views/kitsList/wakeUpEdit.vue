<template>
  <section class="crm-wakeContainer">
    <!--锦囊问题编辑页-->
    <section>
      <h1 class="al-bs-header">
        锦囊管理后台 > 召出词编辑页
      </h1>
    </section>
    <el-container>
      <el-container class="container">
        <el-container class="wrapper">
          <el-form :label-position="labelPosition" ref="formLabelAlign" label-width="80px" :model="formLabelAlign"
                   class="handleContent">
            <el-form-item class="ev-quesFormHei" label="锦囊名" prop="name">
              <div class="bName">{{formLabelAlign.name}}</div>
            </el-form-item>
            <el-form-item label="召出词" label-width="80px" prop="region">
              <aside v-if="wakeUpArr.length>0" v-for="(item,i) in wakeUpArr" :key="i">
                <input class="formItem addInput ev-addInput" :value="item.keyWord" @input="inputVal(i)"/>
                <div class="addBtn"  @click.stop.prevent="addWakeUpCon" v-if="i==0">新增一行</div>
              </aside>
            </el-form-item>
            <div class="block submit">
              <el-button class="submitBtn" @click="saveInfo">提交</el-button>
              <el-button class="cancelBtn" @click="resetForm('formLabelAlign')">返回</el-button>
            </div>

          </el-form>
        </el-container>
      </el-container>
    </el-container>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';

export default {
  data() {
    return {
      bId: '',
      labelPosition: 'right',
      formLabelAlign: {
        name: ''
      },
      wakeUpArr: []
    };
  },
  methods: {
    // 返回历史页面
    resetForm(formName) {
      let t = this;
      t.$refs[formName].resetFields();
      if (window.history.length <= 1) {
        t.$router.push({path: '/'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    },
    // 新增召出词输入框
    addWakeUpCon() {
      let t = this;
      t.wakeUpArr.push({'keyWord': '', id: ''});
    },
    // input输入值给数组赋值
    inputVal(index) {
      let t = this;
      let _val = document.getElementsByClassName('ev-addInput')[index].value.toString().trim();
      if (comm.getByteLen(_val) > 30) { // 15个字符
        document.getElementsByClassName('ev-addInput')[index].value = comm.getStrLen2(_val, 30);
        t.wakeUpArr[index].keyWord = comm.getStrLen2(_val, 30);
      }
      else {
        t.wakeUpArr[index].keyWord = _val;
      }
      if (!t.wakeUpArr[index].id) {
        t.wakeUpArr[index].id = '';
      }
    },
    // 保存召出词接口
    saveInfo() {
      let t = this;
      if (t.wakeUpArr.length && t.wakeUpArr.length > 0) {
        let _str = [];
        let _same = [];// 重复词组检测
        let _sameFlag = false;// 重复词组检测
        let _sameIndex = [];// 重复词组检测
        for (let i = 0; i < t.wakeUpArr.length; i++) {
          let kv = t.wakeUpArr[i].keyWord;
          if (kv) {
            let kVal = kv.toString().trim();
            if (_same.indexOf(kVal) === -1) {
              _same.push(kVal);
            }
            else { // 存在重复值，进行标记
              _sameFlag = true;
              _sameIndex.push(i);
            }
            _str.push({'keyWord': kVal, id: t.wakeUpArr[i].id ? t.wakeUpArr[i].id : ''});
          }
          else { // input输入值不存在
            if (!kv && t.wakeUpArr[i].id) { // 存在获取的id
              _str.push({'keyWord': '', id: t.wakeUpArr[i].id});
            }
          }
        }
        if (_str.length && _str.length > 0) {
          if (_sameFlag === false) { // 召出词无重复添加
            for (let i = 0; i < document.getElementsByClassName('ev-addInput').length; i++) {
              let kv = document.getElementsByClassName('ev-addInput')[i];
              kv.classList.remove('error');
            }
            let param = {
              brochureId: t.bId, // 锦囊ID
              resultWordList: _str// 锦囊召出词字段
            };
            comm.openLoading('加载中...');
            axios({
              method: apiConfig.keyWordSave.type,
              url: apiConfig.keyWordSave.url,
              data: param
            }).then((res) => {
              comm.closeLoading();
              if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
                if (window.history.length <= 1) {
                  t.$router.push({path: 'kitsList'});// 返回锦囊列表页面
                  return false;
                }
                else {
                  t.$router.go(-1);
                }
              }
              else { // 没保存成功
                this.$message({
                  type: 'info',
                  message: '保存失败，请重试！'
                });
              }
            }).catch((e) => {
              comm.closeLoading();
              this.$allin_confirm({title: '提示', content: '提交失败请重试', type: 'notice'});
              console.log('失败：', e);
            });
          }
          else {
            document.getElementsByClassName('ev-addInput')[0].classList.remove('error');
            for (let i = 0; i < _sameIndex.length; i++) { // 重复词条的角标
              document.getElementsByClassName('ev-addInput')[_sameIndex[i]].classList.add('error');
            }
            this.$message({
              type: 'info',
              message: '存在重复词条，保存失败！'
            });
          }
        }
        else {
          if (window.history.length <= 1) {
            t.$router.push({path: '/'});
            return false;
          }
          else {
            t.$router.go(-1);
          }
        }
      }
      else {
        if (window.history.length <= 1) {
          t.$router.push({path: '/'});
          return false;
        }
        else {
          t.$router.go(-1);
        }
      }
    },
    // 获取召出词接口
    getInfo() {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.keyWordGet.type,
        url: apiConfig.keyWordGet.url,
        params: {
          brochureId: t.bId ? t.bId : '', // 锦囊id brochureId
          firstResult: 0,
          maxResult: 1
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList;// 对主列表数组赋值
          if (kv && kv.length > 0) { // dataList存在
            t.formLabelAlign.name = kv[0].brochureName;// 锦囊名字
            if (kv[0].keyWordList && kv[0].keyWordList.length > 0) { // 召出词列表存在
              for (let i = 0; i < kv[0].keyWordList.length; i++) {
                let ev = kv[0].keyWordList[i];
                let json = {
                  keyWord: ev.keyWord, // 召出词
                  id: ev.id// 召出词id
                };
                t.wakeUpArr.push(json);
              }
            }
            else {
              t.wakeUpArr = [{'keyWord': '', 'id': ''}];// 召出词数组赋值空值
            }
          }
          else {
            t.wakeUpArr = [{'keyWord': '', 'id': ''}];// 召出词数组赋值空值
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    }
  },
  mounted() {
    let t = this;
    if (t.$route.query.bId) {
      t.bId = t.$route.query.bId;
      t.getInfo();// 获取召出词信息
    }
    else {
      if (window.history.length <= 1) {
        t.$router.push({path: '/'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    }
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>
<style lang="scss">
  .crm-wakeContainer {
    width: 1200px;
    margin: 0 auto;
    background-color: #F6F7FA;

    .handleContent {
      .areaContent {
        .el-textarea__inner {
          width: 640px;
          height: 90px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 4px;
          resize: none;
        }
      }
      .el-input__inner:not(.el-date-editor) {
        background: #F7F9FC;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
        line-height: 32px;
        height: 32px;
      }
      .el-radio__input.is-checked + .el-radio__label {
        color: #4B67D6;
      }
      .el-radio__inner:after {
        background: #4B67D6;
        border-color: #4B67D6;
        width: 10px;
        height: 10px;
      }
      .el-radio {
        color: #999999;
      }
      .el-radio__input.is-checked .el-radio__inner {
        border-color: #4B67D6;
        background: #ffffff;
        width: 14px;
        height: 14px;

      }
      .el-button {
        width: 140px;
        height: 32px;
        background: #3846DC;
        border-radius: 3px;
        line-height: 32px;
        padding: inherit;
        border: none;
        color: #ffffff;
        &:hover {
          color: #ffffff;
          border-color: inherit;
        }
      }
      .cancelBtn.el-button {
        background: #A1A8C0;
        margin-left: 25px;
      }
    }
    .container {
      flex-direction: column;
      position: relative;
      .wrapper {
        background: none;
        width: 100%;
        /*padding: 0 20px;*/
        flex-shrink: 0;
        box-sizing: border-box;
        display: block;
      }
      .al-bs-des {
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
        border-radius: 3px;
        height: 86px;
        padding-top: 25px;
        width: 100%;
        .dot {
          width: 7px;
          height: 7px;
          background: #4B67D6;
          border-radius: 50%;
          float: left;
          margin: 5px 7px 30px 30px;
        }
        .des-content {
          float: left;
          span {
            display: block;
          }
          .title {
            font-size: 18px;
            color: #222222;
            font-weight: 600;
            .special {
              font-size: 14px;
              color: #222222;
            }
            .state {
              box-sizing: border-box;
              display: inline-block;
              border: 1px solid #4B67D6;
              text-align: center;
              border-radius: 3px;
              width: 60px;
              height: 27px;
              font-size: 13px;
              color: #6B748C;
              line-height: 24px;
            }
          }
          .produce {
            font-size: 14px;
            color: #555555;
            margin-top: 10px;
          }
        }
      }
      .handleContent {
        min-height: 397px;
        margin: 40px 0 60px;
        padding: 40px 0 40px 58px;
        background: #ffffff;
        .el-form-item {
          .formItem {
            width: 300px;
            height: 32px;
            border-radius: 4px;
          }
        }
      }
    }
    .al-bs-header {
      font-size: 20px;
      color: #222222;
      line-height: 20px;
      background: none;
      font-weight: bold;
      margin: 37px 0 25px 0;
    }
    .submit {
      position: absolute;
      left: 137px;
      bottom: 120px;
    }
    .el-form-item__label, .el-form-item__content {
      color: #555;
      font-size: 14px;
    }
    .ev-quesFormHei {
      .el-form-item__label, .el-form-item__content {
        line-height: 32px;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-form-item:nth-child(2) {
      margin-bottom: 80px;
    }
    .el-form-item:nth-child(4) {
      margin-bottom: 60px;
    }
    .el-select .el-input.is-focus .el-input__inner, .el-select .el-input__inner:focus {
      border-color: #4B67D6 !important;
    }
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-textarea__inner {
      border-color: #E6E6E8 !important;
    }
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus {
      border-color: #E6E6E8 !important;
    }
    .el-button:active, .el-button:focus, .el-button:hover {
      background: #a1a8c0 !important;
      border: none !important;
      color: #fff !important;
    }
    .el-button--primary:focus, .el-button--primary:hover, .el-button--primary.is-active, .el-button--primary:active {
      background: #3846DC !important;
      border: none !important;
      color: #fff !important;
    }
    .submitBtn:focus, .submitBtn:hover, .submitBtn.is-active, .submitBtn:active {
      background: #3846DC !important;
      border: none !important;
      color: #fff !important;
    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus {
      border-color: #f56c6c !important;
    }
  }

  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected, .el-select-dropdown__item.selected {
    color: #4B67D6 !important;
  }

  .addInput {
    background: #F7F9FC;
    border: 1px solid #E6E6E8;
    border-radius: 4px;
    line-height: 32px;
    height: 32px;
    padding: 0 15px;
    box-sizing: border-box;
    &.error {
      border: 1px solid red;
    }
  }

  .addBtn {
    display: inline-block;
    width: 90px;
    height: 32px;
    background: #3846DC;
    border-radius: 3px;
    line-height: 32px;
    padding: inherit;
    border: none;
    color: #ffffff;
    cursor: pointer;
    margin-left: 15px;
    text-align: center;
  }

  .bName {
    padding-left: 15px;
  }
</style>
