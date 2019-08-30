<template>
  <section class="crm-quesContainer">
    <!--锦囊问题编辑页-->
    <section>
      <h1 class="al-bs-header">
        锦囊管理后台 > 问题编辑页
      </h1>
    </section>
    <el-container>
      <el-container class="container">
        <el-container class="wrapper">
          <div class="block  al-bs-des">
            <p class="dot" v-if="dataInfoBox.brochureName"></p>
            <p class="des-content">
            <span class="title">
              <i>{{dataInfoBox.brochureName}}</i>
              <i class="special" v-if="dataInfoBox.tagName">{{dataInfoBox.tagName?'('+dataInfoBox.tagName+')':''}}</i>
              <i class="state" v-if="dataInfoBox.isValid">{{dataInfoBox.isValid==1?'上架':'下架'}}</i>
            </span>
              <span class="produce" v-if="dataInfoBox.brochureDesc">
             {{dataInfoBox.brochureDesc? '说明：'+dataInfoBox.brochureDesc:''}}
            </span>
            </p>
          </div>
        </el-container>
        <el-container class="wrapper">
          <div style="margin: 20px;"></div>
          <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="80px" :model="formLabelAlign" class="handleContent">
            <el-form-item class="ev-quesFormHei" label="问题名称" prop="name">
              <el-input v-model="formLabelAlign.name" class="formItem" placeholder="请输入问题名称"> </el-input>
            </el-form-item>
            <el-form-item label="问题排序" prop="region">
              <el-input v-model="formLabelAlign.region" class="formItem" placeholder="请输入问题排序"></el-input>
            </el-form-item>
            <el-form-item label="状态"  prop="isValid">
              <el-radio-group v-model="formLabelAlign.isValid">
                <el-radio label="1">上架</el-radio>
                <el-radio label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
              <el-input type="textarea" v-model="formLabelAlign.desc" style="width: 640px;height:90px;" class="areaContent"></el-input>
            </el-form-item>
            <div class="block submit">
              <el-button class="submitBtn" @click="submitForm('formLabelAlign')">提交</el-button>
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
    let checkSort = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      else {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error('请输入正整数'));
        }
        else {
          callback();
        }
      }
    };
    let checkLenName = (rule, value, callback) => {
      if (value) {
        if (comm.getByteLen(value) > 60) {
          callback(new Error('长度超过了60个字符'));
        }
        else {
          callback();
        }
      }
      else {
        callback();
      }
    };
    let checkLenDesc = (rule, value, callback) => {
      if (value) {
        if (comm.getByteLen(value) > 100) {
          callback(new Error('长度超过了100个字符'));
        }
        else {
          callback();
        }
      }
      else {
        callback();
      }
    };
    return {
      bId: '',
      qId: '',
      keyId: '',
      dataInfoBox: '', // 锦囊的相关信息
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        region: '',
        isValid: '0',
        desc: ''
      },
      rules: {
        name: [{validator: checkLenName},
          {required: true, message: '请输入问题名称', trigger: 'blur'}], // 名称
        region: [
          {required: false, message: '请输入问题排序', trigger: 'blur'},
          {validator: checkSort}], // 排序
        desc: [{validator: checkLenDesc}]// 备注
      }
    };
  },
  computed: {
    isValidChange() {
      let t = this;
      return t.formLabelAlign.isValid;
    }
  },
  watch: {
    isValidChange() { // 检测表单中状态是否上架来改变
      let t = this;
      if (t.isValidChange === 1) { // 上架状态
        t.rules.region[0].required = true;// 上架状态下问题排序是必填
      }
      else { // 下架状态
        t.rules.region[0].required = false;//
      }
    }
  },
  methods: {
    // 提交按钮
    submitForm(formName) {
      let t = this;
      t.$refs[formName].validate((valid) => {
        if (valid) {
          t.saveInfo();// 保存问题接口
        }
        else {
          return false;
        }
      });
    },
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
    // 锦囊详情信息
    dataInfo() {
      let t = this;
      axios({
        method: apiConfig.kitsInfo.type,
        url: apiConfig.kitsInfo.url,
        params: {
          brochureId: t.bId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          t.dataInfoBox = res.data.responseObject.responseData.dataList[0];// 对主列表数组赋值
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 保存问题接口
    saveInfo() {
      let t = this;
      comm.openLoading('加载中...');
      let param = {
        brochureId: t.bId,
        questionName: t.formLabelAlign.name,
        isValid: t.formLabelAlign.isValid// 上架状态
        // visitSiteId:25,
      };
        /* 判断有数据再传的项   如果默认传空后台接口返回数据不准没有容错 20181010 */

      param.questionId = t.qId ? t.qId : undefined;// 问题id
      param.sortId = t.formLabelAlign.region ? t.formLabelAlign.region : undefined;// 排序
      param.remark = t.formLabelAlign.desc ? t.formLabelAlign.desc : undefined;// 备注
      param.id = t.keyId ? t.keyId : undefined;// 主键id
      axios({
        method: apiConfig.saveQuestion.type,
        url: apiConfig.saveQuestion.url,
        data: param
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          if (window.history.length <= 1) {
            t.$router.push({path: 'kitsQuestionList', query: {bId: t.$route.query.bId}});
            return false;
          }
          else {
            t.$router.go(-1);
          }
        }
        else { // 没保存成功
          alert('保存失败请重试');
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '保存失败，请重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取锦囊信息接口
    getInfo() {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getQueInfo.type,
        url: apiConfig.getQueInfo.url,
        params: {
          brochureId: t.bId ? t.bId : '', // 锦囊id
          questionId: t.qId ? t.qId : ''// 锦囊id
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList;// 对主列表数组赋值
          t.formLabelAlign = {
            name: kv.questionName,
            region: kv.sortId,
            isValid: kv.isValid,
            desc: kv.remark
          };
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
      t.dataInfo();// 锦囊详情信息
      if (t.$route.query.qId) { // 如果是来自编辑页面
        t.qId = t.$route.query.qId;
        t.getInfo();// 获取问题详情接口，编辑时用
      }
      if (t.$route.query.id) { // keyId赋值
        t.keyId = t.$route.query.id;
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
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  }
};
</script>
<style lang="scss">
  .crm-quesContainer{
    width: 1200px;
    margin: 0 auto;
    background-color: #F6F7FA;

    .handleContent{
      .areaContent{
        .el-textarea__inner{
          width: 640px;
          height: 90px;
          background: #F7F9FC ;
          border: 1px solid #E6E6E8;
          border-radius: 4px;
          resize: none;
        }
      }
      .el-input__inner:not(.el-date-editor){
        background: #F7F9FC ;
        border: 1px solid #E6E6E8;
        border-radius: 4px;
        line-height: 32px;
        height: 32px;
      }
      .el-radio__input.is-checked+.el-radio__label{
        color:#4B67D6;
      }
      .el-radio__inner:after{
        background: #4B67D6;
        border-color: #4B67D6;
        width: 10px;
        height: 10px;
      }
      .el-radio{
        color: #999999;
      }
      .el-radio__input.is-checked .el-radio__inner{
        border-color: #4B67D6;
        background:#ffffff;
        width: 14px;
        height: 14px;

      }
      .el-button{
        width: 140px;
        height: 32px;
        background: #3846DC;
        border-radius: 3px;
        line-height: 32px;
        padding: inherit;
        border: none;
        color:#ffffff;
        &:hover{
          color:#ffffff;
          border-color: inherit;
        }
      }
      .cancelBtn.el-button{
        background: #A1A8C0;
        margin-left: 25px;
      }
    }
    .container{
      flex-direction: column;
      .wrapper{
        background: none;
        width: 100%;
        /*padding: 0 20px;*/
        flex-shrink: 0;
        box-sizing: border-box;
        display: block;
      }
      .al-bs-des{
        background: #FFFFFF;
        box-shadow: 0 4px 10px 0 rgba(42,53,102,0.04);
        border-radius: 3px;
        height: 86px;
        padding-top: 25px;
        width: 100%;
        .dot{
          width: 7px;
          height: 7px;
          background: #4B67D6;
          border-radius: 50%;
          float: left;
          margin: 5px 7px 30px 30px;
        }
        .des-content{
          float: left;
          span{
            display: block;
          }
          .title{
            font-size: 18px;
            color: #222222;
            font-weight: 600;
            .special{
              font-size: 14px;
              color: #222222;
            }
            .state{
              box-sizing: border-box;
              display: inline-block;
              border: 1px  solid #4B67D6;
              text-align: center;
              border-radius: 3px;
              width: 60px;
              height: 27px;
              font-size: 13px;
              color: #6B748C;
              line-height: 24px;
            }
          }
          .produce{
            font-size: 14px;
            color: #555555;
            margin-top: 10px;
          }
        }
      }
      .handleContent{
        height: 397px;
        margin-top: 20px;
        padding-top: 27px ;
        padding-left: 58px;
        padding-bottom: 40px;
        background: #ffffff;
        .el-form-item{
          .formItem{
            width: 300px;
            height: 32px;
            border-radius: 4px;
          }
        }
      }
    }
    .al-bs-header{
      font-size: 20px;
      color: #222222;
      line-height: 20px;
      background: none;
      font-weight: bold;
      margin: 37px 0 25px 0;
    }
    .submit{
      margin-left: 79px;
      margin-top: 50px;
    }
    .el-form-item__label,.el-form-item__content{
      color: #555;
      font-size: 14px;
    }
    .ev-quesFormHei{
      .el-form-item__label,.el-form-item__content{
        line-height: 32px;
      }
    }
    .el-form-item{
      margin-bottom: 20px;
    }
    .el-form-item:nth-child(2),.el-form-item:nth-child(3){
      margin-bottom: 10px;
    }
    .el-form-item:nth-child(4){
      margin-bottom: 60px;
    }
    .el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus{
      border-color: #4B67D6!important;
    }
    .el-form-item.is-success .el-input__inner,.el-form-item.is-success .el-textarea__inner{
      border-color: #E6E6E8!important;
    }
    .el-form-item.is-success .el-input__inner, .el-form-item.is-success .el-input__inner:focus, .el-form-item.is-success .el-textarea__inner, .el-form-item.is-success .el-textarea__inner:focus{
      border-color: #E6E6E8!important;
    }
    .el-button:active,.el-button:focus, .el-button:hover{
      background: #a1a8c0!important;
      border: none!important;
      color: #fff!important;
    }
    .el-button--primary:focus, .el-button--primary:hover,.el-button--primary.is-active, .el-button--primary:active{
      background: #3846DC!important;
      border: none!important;
      color: #fff!important;
    }
    .submitBtn:focus, .submitBtn:hover,.submitBtn.is-active, .submitBtn:active{
      background: #3846DC!important;
      border: none!important;
      color: #fff!important;
    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
      border-color: #f56c6c!important;
    }
  }
  .el-select-dropdown.is-multiple .el-select-dropdown__item.selected, .el-select-dropdown__item.selected{
    color: #4B67D6!important;
  }

</style>
