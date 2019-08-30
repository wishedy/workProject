<template>
  <section class="listEditCon ev-kitsList">
    <section>
      <h1 class="editTitle">锦囊管理后台 > 锦囊编辑页</h1>
    </section>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm listForm">
      <el-form-item label="锦囊名" prop="name">
        <el-input v-model="ruleForm.name" class="listName" placeholder="请输入锦囊名"></el-input>
      </el-form-item>
      <el-form-item label="锦囊说明" prop="detailDesc">
        <el-input class="listName" v-model="ruleForm.detailDesc" placeholder="请输入锦囊说明"></el-input>
      </el-form-item>
      <el-form-item label="所属专科" prop="region">
        <el-select v-model="ruleForm.region" placeholder="请选择所属专科" class="listName">
          <el-option
            v-for="item in proListArr"
            :key="item.id"
            :label="item.tagName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="锦囊排序" prop="rank">
        <el-input v-model="ruleForm.rank" placeholder="请输入锦囊排序号" class="listName"></el-input>
      </el-form-item>
      <el-form-item label="锦囊封面" class="ev-imgPk ev-imgUpload01" prop="coverImg">
        <upload-img  class="ev-imgPk imgPK01" ref="imgPK01" @imgpk="imgpk01" :formData="paramData01" :imgData="imgData01"></upload-img><!--:formData="" :imgData=""-->
      </el-form-item>
      <el-form-item label="锦囊分享图" class="ev-imgPk ev-imgUpload02" prop="shareImg">
        <upload-img  class="ev-imgPk imgPK02"  ref="imgPK02" @imgpk="imgpk02" :formData="paramData02" :imgData="imgData02"></upload-img>
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
import uploadImg from '@/components/common/upload/uploadImg';
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
export default {
  data() {
    let checkImg1 = (rule, value, callback) => {
      if (rule.required) {
        let kv = document.getElementsByClassName('imgPK01')[0];
        let kv1 = kv ? kv.getElementsByClassName('hasImg')[0] : '';
        let kv2 = kv1 ? kv1.getElementsByTagName('img')[0] : '';
        if (kv && kv1 && kv2) {
          callback();
        }
        else {
          callback(new Error('请上传锦囊封面'));
        }
      }
      else {
        callback();
      }
    };
    let checkImg2 = (rule, value, callback) => {
      if (rule.required) {
        let kv = document.getElementsByClassName('imgPK02')[0];
        let kv1 = kv ? kv.getElementsByClassName('hasImg')[0] : '';
        let kv2 = kv1 ? kv1.getElementsByTagName('img')[0] : '';
        if (kv && kv1 && kv2) {
          callback();
        }
        else {
          callback(new Error('请上传锦囊分享图'));
        }
      }
      else {
        callback();
      }
    };
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
        if (comm.getByteLen(value) > 30) {
          callback(new Error('长度超过了30个字符'));
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
      bId: '', // 锦囊id
      id: '', // 列表id
      coverImgSrc: '', // 锦囊上传的封面图
      shareImgSrc: '', // 锦囊上传的分享图
      coverImgSrcD: '', // 锦囊上传的封面图（删除）
      shareImgSrcD: '', // 锦囊上传的分享图（删除）
      // 编辑锦囊的时候给上传图片传参
      paramData01: {
        brochureId: '',
        questionId: '',
        answerId: '',
        categoryType: 1,
        visitSiteId: 25
      },
      paramData02: {
        brochureId: '',
        questionId: '',
        answerId: '',
        categoryType: 2,
        visitSiteId: 25
      },
      // 编辑锦囊的时候给上传图片传参锦囊封面
      imgData01: {
        src: '',
        id: ''
      },
      // 编辑锦囊的时候给上传图片传参 分享图片
      imgData02: {
        src: '',
        id: ''
      },
      proListArr: [], // 专科列表数据铺设
      ruleForm: {
        name: '',
        detailDesc: '',
        rank: '',
        region: '',
        coverImg: '',
        shareImg: '',
        resource: '下架',
        desc: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入锦囊名', trigger: 'blur'},
          {validator: checkLenName}
        ], // 锦囊名
        detailDesc: [
          {required: false, message: '请输入锦囊说明', trigger: 'blur'},
          {validator: checkLenDesc}
        ], // 锦囊描述
        rank: [{validator: checkSort},
          {required: false, message: '请输入锦囊排序号', trigger: 'blur'}], // 锦囊排序
        region: [{required: false, message: '请选择所属专科'}], // 锦囊专科
        coverImg: [{required: false, validator: checkImg1}], // 锦囊封面
        shareImg: [{required: false, validator: checkImg2}], // 锦囊分享图
        desc: [{validator: checkLenDesc}]// 备注
      }
    };
  },
  components: {
    uploadImg
  },
  computed: {
    resChangeVal() {
      let t = this;
      return t.ruleForm.resource === '下架' ? 1 : 2;
    }
  },
  watch: {
    resChangeVal() { // 检测表单中状态是否上架来改变
      let t = this;
      if (t.resChangeVal === 1) { // 下架状态
        t.rules.detailDesc[0].required = false;// 锦囊说明
        t.rules.region[0].required = false;// 专科
        t.rules.coverImg[0].required = false;// 锦囊封面
        t.rules.shareImg[0].required = false;// 锦囊分享图
        t.rules.rank[1].required = false;// 锦囊序号
      }
      else { // 上架状态
        t.rules.detailDesc[0].required = true;// 锦囊说明
        t.rules.region[0].required = true;// 专科
        t.rules.coverImg[0].required = true;// 锦囊封面
        t.rules.shareImg[0].required = true;// 锦囊分享图
        t.rules.rank[1].required = true;// 锦囊序号
      }
    }
  },
  methods: {
    // 提交按钮
    submitForm(formName) {
      let t = this;
      t.$refs[formName].validate((valid) => {
        if (valid) {
          t.saveInfo();// 保存锦囊接口
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
    // 锦囊封面图片
    imgpk01(val) {
      let t = this;
      t.coverImgSrc = val.responsePk;
      t.coverImgSrcD = val.deletId;
      if (val) {
        this.ruleForm.coverImg = true;
      }
      else {
        this.ruleForm.coverImg = '';
      }
    },
    // 锦囊分享图
    imgpk02(val) {
      let t = this;
      t.shareImgSrc = val.responsePk;
      t.shareImgSrcD = val.deletId;
      if (val) {
        this.ruleForm.shareImg = true;
      }
      else {
        this.ruleForm.shareImg = '';
      }
    },
    // 保存锦囊接口
    saveInfo() {
      let t = this;
      comm.openLoading('加载中...');
      let param = {
        brochureName: t.ruleForm.name,
        isValid: (t.ruleForm.resource === '上架' ? 1 : 0)// 上架状态
        // visitSiteId:25,
      };
        /* 判断有数据再传的项   如果默认传空后台接口返回数据不准没有容错 20181010 */
      //  修改语法，eslint不通过t.ruleForm.detailDesc ? param.brochureDesc = t.ruleForm.detailDesc : '';// 锦囊说明===》 param.brochureDesc = t.ruleForm.detailDesc ? t.ruleForm.detailDesc : undefined;// 锦囊说明
      param.brochureDesc = t.ruleForm.detailDesc ? t.ruleForm.detailDesc : undefined;// 锦囊说明
      param.areasExpertiseId = t.ruleForm.region ? t.ruleForm.region : undefined;// 专科
      param.sortId = t.ruleForm.rank ? t.ruleForm.rank : undefined;// 排序
      param.remark = t.ruleForm.desc ? t.ruleForm.desc : undefined;// 备注
      param.brochureId = t.bId ? t.bId : undefined;// 锦囊id
      param.id = t.id ? t.id : undefined;// 锦囊id

      // t.ruleForm.detailDesc ? param.brochureDesc = t.ruleForm.detailDesc : '';// 锦囊说明
      // t.ruleForm.region ? param.areasExpertiseId = t.ruleForm.region : '';// 专科
      // t.ruleForm.rank ? param.sortId = t.ruleForm.rank : '';// 排序
      // t.ruleForm.desc ? param.remark = t.ruleForm.desc : '';// 备注
      // t.bId ? param.brochureId = t.bId : '';// 锦囊id
      // t.id ? param.id = t.id : '';// 锦囊id
      if (t.coverImgSrc || t.shareImgSrc) {
        if (t.coverImgSrc && t.shareImgSrc) {
          param.idList = t.coverImgSrc + ',' + t.shareImgSrc;
        }
        else if (t.coverImgSrc && !t.shareImgSrc) {
          param.idList = t.coverImgSrc;
        }
        else if (t.shareImgSrc && !t.coverImgSrc) {
          param.idList = t.shareImgSrc;
        }
      }
      if (t.coverImgSrcD || t.shareImgSrcD) {
        if (t.coverImgSrcD && t.shareImgSrcD) {
          param.delIdList = t.coverImgSrcD + ',' + t.shareImgSrcD;
        }
        else if (t.coverImgSrcD && !t.shareImgSrcD) {
          param.delIdList = t.coverImgSrcD;
        }
        else if (t.shareImgSrcD && !t.coverImgSrcD) {
          param.delIdList = t.shareImgSrcD;
        }
      }

      axios({
        method: apiConfig.saveBrochure.type,
        url: apiConfig.saveBrochure.url,
        data: param
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          if (window.history.length <= 1) {
            t.$router.push({path: 'kitsList'});
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
    // 专科请求列表
    professList() {
      let t = this;
      axios({
        method: apiConfig.professList.type,
        url: apiConfig.professList.url,
        params: {
          firstResult: 0,
          maxResult: 99,
          treeLevel: 2,
          platformId: 1,
          isValid: 1
        }
      }).then((res) => {
        if (res && comm.hasResponseData(res.data)) {
          t.proListArr = res.data.responseObject.responseData.data_list;// 对专科列表赋值
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
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.kitsInfo.type,
        url: apiConfig.kitsInfo.url,
        params: {
          brochureId: t.bId
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && comm.hasResponseData(res.data)) {
          let kv = res.data.responseObject.responseData.dataList[0];
          t.ruleForm.name = kv.brochureName;// 锦囊名字
          t.ruleForm.detailDesc = kv.brochureDesc;// 锦囊说明
          t.ruleForm.region = kv.areasExpertiseId;// 专科
          t.ruleForm.rank = kv.sortId;// 锦囊排序
          t.ruleForm.resource = kv.isValid === 1 ? '上架' : '下架';// 上架
          t.ruleForm.desc = kv.remark;// 备注
          t.imgData01.src = kv.picUrl;// 封面图
          t.imgData01.id = kv.picId;
          t.imgData02.src = kv.shareUrl;// 分享图
          t.imgData02.id = kv.shareId;
          /* 对图片进行赋值 */
          if (kv.picUrl && kv.picId) {
            t.ruleForm.coverImg = true;
            t.coverImgSrc = kv.picId;
          }
          if (kv.shareUrl && kv.shareId) {
            t.ruleForm.shareImg = true;
            t.shareImgSrc = kv.shareId;
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
    t.professList();// 请求专科选项
    if (this.$route.query.bId && t.$route.query.id) { // 如果是来自编辑页面
      t.bId = t.$route.query.bId;
      t.id = t.$route.query.id;
      t.paramData01.brochureId = t.bId;
      t.paramData02.brochureId = t.bId;
      t.getInfo();
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
  .ev-kitsList .el-form-item:nth-child(2){
    margin-bottom: 20px!important;
  }
  .ev-kitsList .el-form-item:nth-child(3){
    margin-bottom: 20px!important;
  }
  .ev-kitsList{
    .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus, .el-message-box__input input.invalid, .el-message-box__input input.invalid:focus{
      border-color: #f56c6c!important;
    }
  }

</style>
