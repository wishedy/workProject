<template>
  <section class="listEditCon ev-replyEdit">
    <section>
      <h1 class="editTitle">锦囊管理后台 > 回复编辑页</h1>
    </section>
    <section class="detaileDesc">
      <section class="detaileTitle">
        <h2 class="descTitle" v-if="dataInfoBox.questionName">{{dataInfoBox.questionName?dataInfoBox.questionName:''}}</h2>
        <span v-if="dataInfoBox.isValid">{{dataInfoBox.isValid==1?'上架':'下架'}}</span>
      </section>
      <p class="descName">{{brochureName?'锦囊名：'+brochureName:''}}</p>
    </section>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm listForm">
      <el-form-item label="回复内容" prop="response">
        <el-input type="textarea" v-model="ruleForm.response"></el-input>
      </el-form-item>
      <el-form-item label="添加图片" prop="addImg" class="mediaRadio" :class="{'active':isVideo==1}">
        <span class="medioSelet" @click="medioSelet(1)"></span>
        <upload-img-list @imgpk="imgpk" :isEdit="isVideo" :imgListArr="imgListArr" :formData="paramData"></upload-img-list>
      </el-form-item>
      <el-form-item label="添加视频" prop="addVideo" class="mediaRadio" :class="{'active':isVideo==2}">
        <span class="medioSelet" @click="medioSelet(2)"></span>
        <upload-video @videoBack="videoBack" :isEdit="isVideo" :videoListArr="videoListArr" :formData="formData"></upload-video>
      </el-form-item>
      <el-form-item label="回复排序" prop="responeSort">
        <el-input v-model="ruleForm.responeSort" class="listName" placeholder="请输入回复排序"></el-input>
      </el-form-item>
      <el-form-item label="资源类型" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择资源类型" class="listName">
          <el-option
            v-for="item in citeTypeArr"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资源ID" prop="resorceId">
        <el-input v-model="ruleForm.resorceId" placeholder="请输入资源ID" class="listName">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="searchResorce"></i>
        </el-input>
      </el-form-item>
      <el-form-item label="资源名" prop="resorceName">
        <el-input  type="text" disabled="disabled" v-model="ruleForm.resorceName" placeholder="请检索资源名称" class="listName"></el-input>
      </el-form-item>
      <el-form-item label="资源锚点选择" prop="resorceSelet" v-show="nodeArr.length>0">
        <el-select v-model="ruleForm.resorceSelet" placeholder="请选择" class="listName">
          <el-option
            v-for="item in nodeArr"
            :key="item.nodeId"
            :label="item.nodeDesc"
            :value="item.nodeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="resource">
        <el-radio-group v-model="ruleForm.resource">
          <el-radio label="上架"></el-radio>
          <el-radio label="下架"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">返回</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import uploadImgList from '@/components/common/upload/uploadImgList';
import uploadVideo from '@/components/common/upload/UploadVideo';
export default {
  data() {
    let checkSort = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9]\d*$/.test(value)) {
          callback(new Error('请输入正整数'));
        }
        else {
          callback();
        }
      }
      else {
        callback();
      }
    };
    let checkLenName = (rule, value, callback) => {
      if (value) {
        if (comm.getByteLen(value) > 600) {
          callback(new Error('长度超过了600个字符'));
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
    let checkImg = (rule, value, callback) => {
      if (rule.required) {
        if (document.getElementsByClassName('ev-imgList')[0]) {
          callback();
        }
        else {
          callback(new Error('请上传图片'));
        }
      }
      else {
        callback();
      }
    };
    let checkVideo = (rule, value, callback) => {
      if (rule.required) {
        // 上传视频并且不能是上传中和失败
        let kv = document.getElementsByClassName('ev-videoList')[0];
        let kv1 = kv ? kv.getElementsByClassName('uploadPending')[0] : '';
        let kv2 = kv ? kv.getElementsByClassName('uploadFail')[0] : '';
        if (kv && !kv1 && !kv2) {
          callback();
        }
        else {
          callback(new Error('请上传视频'));
        }
      }
      else {
        callback();
      }
    };
    return {
      picIds: '', // 上架的图片Id串，逗号拼接
      delPicIds: '', // 下架的图片Id串，逗号拼接
      videoId: '',
      vDelete: '',
      formData: {// 视频
        brochureId: '',
        questionId: '',
        answerId: ''
      },
      paramData: {// 图片
        brochureId: '',
        questionId: '',
        answerId: '',
        categoryType: 3,
        visitSiteId: 25
      },
      nodeIdVal: '', // 编辑时获取的nodeId
      nodeArr: [], // 锚点数组
      bId: '', // 锦囊id
      qId: '', // 问题id
      aId: '', // 回复id
      id: '', // 列表的id
      brochureName: '', // 锦囊名字
      dataInfoBox: '', // 问题详情
      citeTypeArr: [{id: '1', typeName: '视频'}, {id: '2', typeName: '文库'}, {id: '7', typeName: '病例'}],
      ruleForm: {
        response: '',
        addVideo: '',
        addImg: '',
        responeSort: '',
        region: '1',
        resorceName: '',
        resorceId: '',
        resorceSelet: '',
        resource: '下架',
        desc: ''
      },
      imgListArr: [],
      videoListArr: [],
      isVideo: 0,
      rules: {
        response: [
          { required: true, message: '请输入回复内容', trigger: 'blur' },
          {validator: checkLenName}
        ], // 回复内容
        region: [
          { required: true, message: '请选择资源类型', trigger: 'blur' }
        ], // 资源类型
        addImg: [
          { required: false, validator: checkImg }
        ], // 添加图片
        addVideo: [
          { required: false, validator: checkVideo }
        ], // 添加视频
        resorceId: [
          { required: true, message: '请输入资源ID', trigger: 'blur' }
        ], // 资源类型
        resorceName: [
          { required: true, message: '请检索资源名称', trigger: 'blur' }
        ], // 资源类型
        responeSort: [{ required: false, message: '请输入回复排序', trigger: 'blur' },
          {validator: checkSort}], // 排序规则
        desc: [{validator: checkLenDesc}]// 备注
      }
    };
  },
  components: {
    uploadImgList,
    uploadVideo
  },
  computed: {
    resChangeVal() {
      let t = this;
      return t.ruleForm.resource === '下架' ? 1 : 2;
    }
  },
  watch: {
    imgListArr() {
      let t = this;
      if (t.imgListArr && t.imgListArr.length && t.isVideo === 0) {
        t.isVideo = 1;
      }
    },
    videoListArr() {
      let t = this;
      if (t.videoListArr && t.videoListArr.length && t.isVideo === 0) {
        t.isVideo = 2;
      }
    },
    resChangeVal() { // 检测表单中状态是否上架来改变
      let t = this;
      if (t.resChangeVal === 1) { // 下架状态
        t.rules.responeSort[0].required = false;// 锦囊序号
      }
      else { // 上架状态
        t.rules.responeSort[0].required = true;// 锦囊序号
      }
    },
    isVideo() {
      let t = this;
      if (t.isVideo === 1) { // 选择了图片
        t.rules.addImg[0].required = true;// 添加图片
        t.rules.addVideo[0].required = false;// 添加视频
      }
      if (t.isVideo === 2) { // 选择了视频
        t.rules.addImg[0].required = false;// 添加图片
        t.rules.addVideo[0].required = true;// 添加视频
      }
    }
  },
  methods: {
    // 提交
    submitForm(formName) {
      let t = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          t.saveInfo();
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
    // 校验资源搜索
    searchResorce() {
      let t = this;
      if (t.ruleForm.resorceId && t.ruleForm.region) {
        axios({
          method: apiConfig.getResourceInfo.type,
          url: apiConfig.getResourceInfo.url,
          params: {
            resourceId: t.ruleForm.resorceId,
            resourceType: t.ruleForm.region
          }
        }).then((res) => {
          if (res && res.data && comm.hasResponseData(res.data)) {
            let item = res.data.responseObject.responseData;
            t.ruleForm.resorceName = item.refName ? item.refName : '无此资源，请重新检索';// 资源名
            if (item.dataList && item.dataList.length) { // 存在锚点
              t.nodeArr = item.dataList;
            }
            else {
              t.nodeArr = [];
            }
          }
          else {
            t.ruleForm.resorceName = '无此资源，请重新检索';
            t.nodeArr = [];
          }
        }).catch((e) => {
          comm.closeLoading();
          this.$allin_confirm({title: '提示', content: '搜索失败，请重试', type: 'notice'});
          console.log('失败：', e);
        });
      }
    },
    // 图片视频相互切换
    medioSelet(kv) {
      let t = this;
      t.isVideo = kv;
    },
    // 上传视频
    videoBack(val) {
      let t = this;
      t.vDelete = val.deletId;
      t.videoId = val.responsePk;
    },
    // 上传图片
    imgpk(val) {
      let t = this;
      t.picIds = val.responsePk;
      t.delPicIds = val.deletId;
    },
    // 保存锦囊接口
    saveInfo() {
      let t = this;
      if (t.ruleForm.resorceName === '无此资源，请重新检索') {
        t.$alert('资源id：' + t.ruleForm.resorceId + '无资源名称，请重新检索后提交', '缺少引用资源名称', {
          confirmButtonText: '确定'
        });
        return false;
      }
      comm.openLoading('加载中...');
      let param = {
        brochureId: t.bId,
        questionId: t.qId,
        answerContent: t.ruleForm.response,
        isValid: (t.ruleForm.resource === '上架' ? 1 : 0)// 上架状态

        // visitSiteId:25,
      };
        /* 判断有数据再传的项   如果默认传空后台接口返回数据不准没有容错 20181010 */
      param.sortId = t.ruleForm.responeSort ? t.ruleForm.responeSort : undefined;// 排序
      param.refType = t.ruleForm.region ? t.ruleForm.region : undefined;// 资源类型
      param.refId = t.ruleForm.resorceId ? t.ruleForm.resorceId : undefined;// 资源id
      param.nodeId = t.ruleForm.resorceSelet ? t.ruleForm.resorceSelet : undefined;// 锚点id
      param.remark = t.ruleForm.desc ? t.ruleForm.desc : undefined;// 备注
      param.answerId = t.aId ? t.aId : undefined;// 回复id
      param.id = t.id ? t.id : undefined;// 列表的id
      if (t.isVideo === 2) { // 选择视频
        param.videoId = (t.videoId && t.videoId !== 0) ? t.videoId.substr(0, t.videoId.length - 1) : undefined;// 上架的视频
        param.attType = (t.videoId && t.videoId !== 0) ? 2 : undefined;// 上架的视频
      }
      else if (t.isVideo === 1) { // 选择图片
        param.picIds = t.picIds ? t.picIds.substr(0, t.picIds.length - 1) : undefined;// 上架的图片Id串，逗号拼接
        param.attType = t.picIds ? 1 : undefined;// 上架的图片Id串，逗号拼接
        param.delPicIds = t.delPicIds ? t.delPicIds.substr(0, t.delPicIds.length - 1) : undefined;// 下架的图片Id串，逗号拼接
      }
      else {
        param.attType = 0;// 媒体类型
      }
      axios({
        method: apiConfig.saveAnswer.type,
        url: apiConfig.saveAnswer.url,
        data: param
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          if (window.history.length <= 1) {
            t.$router.push({path: 'questionInfo', query: {bId: t.bId, qId: t.qId}});
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
    // 问题详情信息
    dataInfo() {
      let t = this;
      axios({
        method: apiConfig.getQueInfo.type,
        url: apiConfig.getQueInfo.url,
        params: {
          brochureId: t.bId,
          questionId: t.qId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          t.dataInfoBox = res.data.responseObject.responseData.dataList;// 对主列表数组赋值
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取锦囊信息接口
    getInfo() {
      let t = this;
      axios({
        method: apiConfig.kitsInfo.type,
        url: apiConfig.kitsInfo.url,
        params: {
          brochureId: t.bId
        }
      }).then((res) => {
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList[0];
          t.brochureName = kv.brochureName;// 锦囊名字
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取回复列表接口
    getAnswerInfo() {
      let t = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getAnswerById.type,
        url: apiConfig.getAnswerById.url,
        params: {
          brochureId: t.bId,
          questionId: t.qId,
          answerId: t.aId
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList[0];
          let _pic = res.data.responseObject.responseData.picList;
          let _video = res.data.responseObject.responseData.videoList;
          t.ruleForm = {
            response: kv.answerContent,
            addVideo: '',
            addImg: '',
            responeSort: kv.sortId,
            region: kv.refType,
            // resorceName:'',
            resorceId: kv.refId,
            // resorceSelet:parseInt(kv.nodeId),
            resource: kv.isValid === 1 ? '上架' : '下架',
            desc: kv.remark
          };
          t.searchResorce();// 自动检索名字和锚点
          if (kv.nodeId) { // 如果选中的锚点存在
            t.ruleForm.resorceSelet = parseInt(kv.nodeId);
          }
          if (_pic && _pic.length) {
            t.isVideo = 1;
            for (let i = 0; i < _pic.length; i++) {
              let _kv = _pic[i];
              let _json = {
                src: _kv.picUrl,
                id: _kv.picId,
                sortId: _kv.sortId
              };
              t.imgListArr.push(_json);
              t.picIds = _kv.picId + ',';// 图片id
            }
          }
          if (_video && _video.length) {
            t.isVideo = 2;
            t.videoId = _video[0].videoId + ',';// videoId
            t.videoListArr = [{
              imgSrc: _video[0].videoPicUrl ? _video[0].videoPicUrl : '//img10.allinmd.cn/default/qiniu196_196.jpg',
              videoPath: _video[0].videoUrl,
              id: _video[0].videoId,
              isValid: 1
            }];
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
    if (t.$route.query.bId && t.$route.query.qId) {
      t.bId = t.$route.query.bId;
      t.qId = t.$route.query.qId;
      t.formData.brochureId = t.bId;
      t.formData.questionId = t.qId;
      t.paramData.brochureId = t.bId;
      t.paramData.questionId = t.qId;
      t.getInfo();// 获取锦囊相关信息
      t.dataInfo();// 获取问题详情信息
      if (t.$route.query.aId && t.$route.query.id) { // keyId赋值
        t.aId = t.$route.query.aId;
        t.id = t.$route.query.id;
        t.formData.answerId = t.aId;
        t.paramData.answerId = t.aId;
        t.getAnswerInfo();
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
  @import "../../assets/scss/pages/editDetailEUI/euiReset.scss";
  .listEditCon{
    &.ev-replyEdit{
      .mediaRadio{
        position: relative;
        .medioSelet{
          cursor: pointer;
          position: absolute;
          left: -86px;
          top: 9px;
          width: 14px;
          height: 14px;
          background: url("/static/images/upload/radio_default.png") no-repeat;
        }
        &.active{
          .medioSelet{
            background: url("/static/images/upload/radio_selected.png") no-repeat;
          }
        }
      }
      .el-input__prefix{
        right: 5px!important;
        left: auto!important;
      }
      .el-input--prefix .el-input__inner{
        padding-left: 15px!important;
      }
      .detaileDesc{
        background: #fff;
        margin-bottom: 20px;
        padding: 25px 0 35px 30px;
        .detaileTitle{
          .descTitle{
            &:before{
              content: '';
              width: 6px;
              height: 6px;
              display: inline-block;
              vertical-align: middle;
              background: #4B67D6;
              border-radius: 50%;
              margin-right: 7px;
            }
            font-size: 18px;
            color: #222222;
            letter-spacing: 0;
            display: inline-block;
            vertical-align: middle;
          }
          span{
            font-size: 13px;
            color: #6B748C;
            letter-spacing: 0;
            line-height: 14px;
            display: inline-block;
            vertical-align: middle;
            border: 1px solid #4B67D6;
            border-radius: 3px;
            padding: 6px 17px;
            margin-left: 8px;
          }
        }
        .descName{
          font-size: 14px;
          color: #555555;
          letter-spacing: 0;
          margin-top: 6px;
          margin-left: 13px;
        }
      }
      .el-form-item.is-success .el-textarea__inner{
        border-color: #E6E6E8;
      }
      .el-input.is-disabled .el-input__inner{
        color: #606266;
      }
      .el-form-item:nth-child(8){
        margin-bottom: 20px;
      }
      .el-form-item:nth-child(2){
        margin-bottom: 20px;
      }
      .el-form-item:nth-child(10){
        margin-bottom: 60px;
      }
      .el-input__icon{
        &.el-icon-search{
          cursor: pointer;
        }
      }
      .el-form-item.is-required {
        &.mediaRadio{
          .el-form-item__label:before{
              margin-right: 22px;
            }
        }
      }

    }
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
      border-color: #f56c6c!important;
    }
  }

</style>
