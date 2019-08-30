<template>
  <section class="patientEduContent">
    <div class="TopTitle">患教手册管理后台 > 手册编辑页</div>
    <section class="patientEduDesc">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">

        <el-form-item label="手册名称" prop="name">
          <el-input :disabled="true" v-model="ruleForm.name" placeholder="" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="适应人群" prop="people">
          <el-input :disabled="true" v-model="ruleForm.people" placeholder="" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="专家说" prop="expert">
          <el-input :disabled="true" type="textarea" v-model="ruleForm.expert" placeholder=""></el-input>
        </el-form-item>

        <el-form-item label="添加内容" prop="addDesc" class="addDesc">
          <div class="viewClassContent" v-for="(item,i) in listData" v-bind:key="i">
            <div class="addClassTop">{{item.parentName}}</div>
            <div class="tabContent">
              <el-table
                :data="item.manualList"
                style="width: 956px;"
              >
                <el-table-column prop="numId" label="序号" width="60" ></el-table-column>
                <el-table-column prop="educationName" label="资源名称" width="320"></el-table-column>
                <el-table-column prop="educationId" label="患教ID" width="145"></el-table-column>
                <el-table-column prop="fullName" label="作者" width="120"></el-table-column>
                <el-table-column prop="sortId" label="顺序号" width="90"></el-table-column>
                <el-table-column prop="tipsContent" label="重复提示" width="220"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="专业" prop="addDesc" class="addDesc" v-if="propertyArr.length">
          <ul class="viewDescContent">
            <li class="descItem" v-for="(val,i) in propertyArr" v-bind:key="i">{{val.labelName}}</li>
          </ul>
        </el-form-item>

        <el-form-item label="疾病阶段" prop="addDesc" class="addDesc" v-if="diseaseArr.length">
          <ul class="viewDescContent">
            <li class="descItem" v-for="(val,i) in diseaseArr" v-bind:key="i">{{val.labelName}}</li>
          </ul>
        </el-form-item>

        <el-form-item label="手册专家" prop="bookExpert">
          <el-input :disabled="true" v-model="ruleForm.peopleId" placeholder="" class="width300"></el-input>
        </el-form-item>

        <el-form-item label="封面" prop="coverImg" >
          <div class="coverImgView" v-if="coverUrl" @mouseover="showBigImgFlag(true)">
          <!--<div class="coverImgView" v-if="coverUrl" @mouseover="function() {isShowBig = true}">-->
            <img :src="coverUrl" alt="">
          </div>
        </el-form-item>

        <el-form-item label="属性" prop="property">
          <el-radio-group v-model="ruleForm.property" disabled>
            <el-radio label="1" v-if="ruleForm.property==1">公开</el-radio>
            <el-radio label="2" v-if="ruleForm.property==2">隐私(不允许被搜索)</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="ruleForm.state" disabled>
            <el-radio label="1" v-if="ruleForm.state==1">下架</el-radio>
            <el-radio label="2" v-if="ruleForm.state==2">上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </section>
    <!--鼠标滑过查看大图-->
    <div class="ev-bigImg" v-show="isShowBig" @click="showBigImgFlag(false)">
    <!--<div class="ev-bigImg" v-show="isShowBig" @click="function() {isShowBig = false}">-->
      <img :src="coverUrl">
    </div>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  name: 'patientEduDesc',
  data() {
    return {
      manualId: '', // 患者手册的id
      coverUrl: '', // 手册封面图
      ruleForm: {// 手册基本信息的表单
        name: '',
        addDesc: '',
        bookExpert: '',
        expert: '',
        coverImg: '',
        property: '公开',
        state: '下架'
      },
      listData: [], // 数据列表
      propertyArr: [], // 专业列表
      diseaseArr: [], // 疾病列表
      isShowBig: false// 是否显示大图
    };
  },
  methods: {
    // 获取基础信息患教手册（除去去疾病阶段  内容 专业的部分）
    getBaseInfo() {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.manualBaseInfo.type,
        url: apiConfig.manualBaseInfo.url,
        params: {
          manualId: t.manualId, // 手册id
          isValid: 1
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && comm.hasResponseData(res.data) && res.data.responseObject.responseData.dataList &&
            res.data.responseObject.responseData.dataList.length) {
          let kv = res.data.responseObject.responseData.dataList[0];
          t.ruleForm = {
            name: kv.manualName, // 手册名称
            people: kv.adaptCrowd, // 适应人群
            expert: kv.expertsSay, // 专家说
            peopleId: kv.recommender, // 手册专家
            property: kv.openState, // 属性
            state: kv.state// 状态
          };
          t.coverUrl = kv.attUrl;// 手册封面图
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取专业和疾病列表
    getList(val) {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getLabelUrl.type,
        url: apiConfig.getLabelUrl.url,
        params: {
          manualId: t.manualId, // 手册id
          labelType: val, // 区分专业还是疾病
          firstResult: 0,
          maxResult: 99,
          isValid: 1
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && comm.hasResponseData(res.data) && res.data.responseObject.responseData.dataList &&
            res.data.responseObject.responseData.dataList.length) {
          if (val === 1) { // 专业
            t.propertyArr = res.data.responseObject.responseData.dataList;
          }
          else { // 获取疾病
            t.diseaseArr = res.data.responseObject.responseData.dataList;
          }
        }
        else {
          if (val === 1) { // 专业
            t.propertyArr = [];
          }
          else { // 获取疾病
            t.diseaseArr = [];
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取内容
    getContent() {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getConUrl.type,
        url: apiConfig.getConUrl.url,
        params: {
          manualId: t.manualId, // 手册id
          firstResult: 0,
          maxResult: 99,
          isValid: 1,
          isClassify: t.isClassify,
          idNum: t.idNum
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && comm.hasResponseData(res.data) && res.data.responseObject.responseData.dataList &&
            res.data.responseObject.responseData.dataList.length) {
          let dataCon = res.data.responseObject.responseData.dataList;
          for (let i in dataCon) {
            let datas = dataCon[i].manualList;
            for (let j in datas) {
              datas[j].numId = parseInt(j) + 1;// 列表页序号
            }
          }
          t.listData = res.data.responseObject.responseData.dataList;
        }
        else {
          t.listData = [];
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 一系列的点击隐藏显示操作(根据eslint规范2019/3/26进行的修改)
    showBigImgFlag(flag) {
      this.isShowBig = flag;
    }
  },
  mounted() {
    let t = this;
    if (t.$route.query.mId) { // 展示太判断是都
      t.manualId = t.$route.query.mId;
      t.isClassify = t.$route.query.isClassify;// 获取是否分类
      t.idNum = t.$route.query.idNum;//
      t.getBaseInfo();// 获取手册的基本信息展示
      t.getList(1);// 获取专业
      t.getList(2);// 获取疾病
      t.getContent();// 获取内容列表
    }
    else {
      if (window.history.length <= 1) {
        t.$router.push({path: 'patientEduList'});
        return false;
      }
      else {
        t.$router.go(-1);
      }
    }
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
<style lang="scss">
  .patientEduContent{
    width: 1200px;
    margin: 0 auto;
  }
  .el-textarea{
    font-family: "Microsoft YaHei,微软雅黑";
  }
  .TopTitle{
    font-size:20px;
    font-weight:600;
    color:rgba(44,52,58,1);
    line-height:20px;
    margin: 32px 0 20px 0;
  }
  .patientEduDesc{
    font-size: 0;
    /*width: 1200px;*/
    margin: 36px auto 36px;
    padding: 36px 0 5px;
    background: #ffffff;
    input,textarea{
      background:rgba(247,249,252,1);
      border-radius:3px;
    }
    .el-table .cell{
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp:1;
      -webkit-box-orient:vertical;
      white-space: nowrap;
      font-size:14px;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:14px;
    }
    .el-input.is-disabled .el-input__inner,.el-textarea.is-disabled .el-textarea__inner,.el-radio__input.is-disabled+span.el-radio__label{
      color:rgba(17,17,17,1);
      font-weight:400;
    }
    .width300{
      width: 642px;
    }
    textarea{
      width: 642px;
      height: 90px;
      font-family: "Microsoft YaHei";
    }
    /*textArea样式*/
    .el-textarea__inner{
      font-family: "Microsoft YaHei";
      resize: none;
    }
    /*上传图片*/
    .patUploadImg{
      font-size: 14px;
    }
    .coverImgView{
      width: 151px;
      height: 100px;
      background:rgba(251,251,253,1);
      border-radius:3px;
      text-align: center;
      img{
        height: 100%;
      }
    }
    /*提示性文字*/
    .tipTxt{
      font-size:14px;
      font-weight:400;
      color:rgba(153,153,153,1);
      line-height:14px;
      margin-left: 8px;
    }
    /*添加分类*/
    .viewClassContent{
      position: relative;
      width: 956px;
      background:rgba(251,251,253,1);
      border-radius:3px;
      padding: 20px 15px 31px;
      font-size: 0;
      margin-top: 20px;
      &:first-child{
        margin-top: 0;
      }
      .triangleUp{
        width:0;
        height:0;
        border-width:0 10px 10px;
        border-style:solid;
        border-color:transparent transparent #EDF1FF;/*透明 透明  灰*/
        margin:-30px 14px;
        position:absolute;
      }
      .addClassTop{
        font-size:14px;
        font-weight:500;
        color:rgba(17,17,17,1);
        line-height:14px;
        margin-bottom: 16px;
      }
      .tabContent{
        .tip {
          input{
            height: 30px;
          }
          textarea {
            width: 162px;
            height: 30px;
            max-height: 47px;
          }
        }
        .el-table thead{
          font-size:14px;
          font-weight:500;
          color:rgba(17,17,17,1);
          line-height:14px;
        }
      }
    }
    /* 专业、发病阶段*/
    .viewDescContent{
      background:rgba(251,251,253,1);
      border-radius:3px;
      padding: 20px 15px;
      margin-top: 10px;
      display: table;
      max-width: 956px;
      .descItem{
        font-size:14px;
        font-weight:400;
        color:rgba(104,109,125,1);
        line-height:20px;
        background:rgba(255,255,255,1);
        border-radius:3px;
        border:1px solid rgba(161,168,192,1);
        padding: 5px 15px;
        display: inline-block;
        margin-right :15px;
      }
      .triangleUp{
        width:0;
        height:0;
        border-width:0 10px 10px;
        border-style:solid;
        border-color:transparent transparent #EDF1FF;/*透明 透明  灰*/
        margin:-30px 14px;
        position:absolute;
      }
    }
    /*单选按钮点击*/
    .el-radio__input.is-checked .el-radio__inner{
      border-color: #4B67D6;
      background: #4B67D6;
    }
    .el-radio__input.is-checked+.el-radio__label{
      color:#4B67D6;
    }
    .el-radio{
      color: #999999;
    }
    /*提交按钮*/
    .submitBtn{
      width:140px;
      height:32px;
      background:rgba(56,70,220,1);
      border-radius:3px;
      line-height: 0;
      font-size:14px;
      font-weight:500;
      color:rgba(255,255,255,1);
    }
    .cancleBtn{
      width:140px;
      height:32px;
      background:rgba(161,168,192,1);
      border-radius:3px;
      font-size:14px;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height: 0;
    }
  }
  /*查看大图*/
  .ev-bigImg{
    position: fixed;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 5;
    background-color: rgba(0,0,0,0.5);
    img{
      max-width: 80%;
      max-height: 80%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
    }
  }
</style>
