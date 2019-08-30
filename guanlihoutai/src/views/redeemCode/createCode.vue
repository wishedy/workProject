<template>
  <section class="creat-main-contains">
    <h1 class="code-title">兑换码/{{isDisabled?'编辑':'创建'}}兑换码</h1>
    <section class="code-tip">
      <p>创建成功后，只能修改兑换码名称</p>
    </section>
    <el-form ref="form" :model="form" label-width="110px" :rules="rules" class="from-container" :label-position="'left'">
      <h2 class="code-info-title"><i class="icon-bg"></i><span>基本信息</span></h2>
      <el-form-item label="兑换码名称" prop="redeemCodeName" class="sdfadsf">
        <el-input
          v-model.trim="form.redeemCodeName"
          class="el-input-width el-input-name"
          placeholder="请输入兑换码名称，不超过20个字符"
          maxlength="20"
          @input.native="limmitLength"
        >
          <i slot="suffix" class="el-input-tip">{{form.redeemCodeName.length}}/20</i>
        </el-input>
      </el-form-item>
      <el-form-item label="发行量" prop="publishCount">
        <el-input
          v-model="form.publishCount"
          class="el-input-width"
          placeholder="请输入发行量，仅限输入数字"
          max="10000"
          :disabled="isDisabled"
          @input.native="limmitNumber('publishCount',10000,1)"
          @blur="inputBlur('publishCount')"
        ></el-input>
        <p class="input-after-tip">个&nbsp;&nbsp;&nbsp;&nbsp;每批次仅限最多申请10000个，可分批申请</p>
      </el-form-item>
      <el-form-item label="发行类型" prop="publishType">
        <el-radio-group v-model="form.publishType"  :disabled="isDisabled">
          <el-radio label="0">电子码</el-radio>
          <el-radio label="1">纸质码</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="有效时间" required>
        <el-col :span="8">
          <el-form-item prop="date1">
            <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>-->
            <el-date-picker
              class="el-input-width"
              v-model="form.date1"
              type="daterange"
              align="right"
              :start-placeholder="dateChange(new Date())"
              end-placeholder="结束时间"
              range-separator="到"
              unlink-panels
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              :default-value="defaultValue"
              :disabled="isDisabled"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <p class="input-after-tip">&nbsp;&nbsp;开始时间不得晚于结束时间</p>
      </el-form-item>
      <!--<el-form-item label="用户使用次数" prop="usageCount">-->
        <!--<el-input-->
          <!--v-model="form.usageCount"-->
          <!--class="el-input-width"-->
          <!--@input.native="limmitNumber('usageCount')"-->
          <!--:disabled="isDisabled"-->
          <!--@blur="inputBlur('usageCount')"-->
        <!--&gt;</el-input>-->
        <!--<p class="input-after-tip">次&nbsp;&nbsp;&nbsp;&nbsp;0为不限制</p>-->
      <!--</el-form-item>-->
      <el-form-item label="兑换商品" prop="productList" class="addContent">
        <!--<el-input-->
          <!--v-model="form.productList[0].productName"-->
          <!--style="display: none"-->
        <!--&gt;</el-input>-->
        <div v-if="!form.productList.length">
          <el-button class="el-icon-plus" @click="showAdd=true">选择商品</el-button>
          <p class="input-after-tip">兑换码一旦创建，商品不得删除，请谨慎操作</p>
        </div>
        <div class="content-container" v-if="form.productList.length">
          <p class="content-desc">付费课程</p>
          <img :src="form.productList[0].picUrl" class="content-img" v-if="form.productList[0].picUrl"/>
          <p class="content-title">{{form.productList[0].productName}}</p>
          <i class="close-icon" v-if="!isDisabled" @click="closeContent">×</i>
        </div>
      </el-form-item>
      <el-form-item label="商品价值" prop="productPrice">
        <el-input
          v-model="form.productPrice"
          class="el-input-width"
          disabled="disabled"
        ></el-input>
        <p class="input-after-tip">元</p>
      </el-form-item>
      <el-form-item label="总额" prop="total">
        <el-input
          v-model="form.total"
          class="el-input-width"
          disabled="disabled"
        ></el-input>
        <p class="input-after-tip">元</p>
      </el-form-item>
      <h2 class="code-info-title"><i class="icon-bg"></i><span>申请信息</span></h2>
      <el-form-item label="申请部门" prop="applyDepartment">
        <!--市场运营部、商务部、协会事业部、测试部、产品部-->
        <el-select v-model="form.applyDepartment" placeholder="请选择"  :disabled="isDisabled" class="el-input-width">
          <el-option label="市场运营部" value="0"></el-option>
          <el-option label="商务部" value="1"></el-option>
          <el-option label="协会事业部" value="2"></el-option>
          <el-option label="测试部" value="3"></el-option>
          <el-option label="产品部" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input
          v-model.trim="form.applyUser"
          class="el-input-width"
          placeholder="请输入申请人姓名"
          maxlength="5"
          :disabled="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请用途" prop="applyPurpose">
        <!--厂商购买、院方采购、平台赠送、内部测试-->
        <el-select v-model="form.applyPurpose" placeholder="请选择"  :disabled="isDisabled" class="el-input-width">
          <el-option label="厂商购买" value="0"></el-option>
          <el-option label="院方采购" value="1"></el-option>
          <el-option label="平台赠送" value="3"></el-option>
          <el-option label="内部测试" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用途描述">
        <el-input type="textarea"
                  v-model.trim="form.applyNote"
                  class="el-textarea-width"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  resize="none"
                  maxlength="100"
                  placeholder="请输入用途描述"
                  :disabled="isDisabled"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
    <add-content v-if="showAdd" @closeDalog="closeDalog" @addContent="contentAdd"></add-content>
  </section>
</template>
<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';
import addContent from './components/AddContent';
export default {

  data() {
    let _this = this;
    let checkDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择日期'));
      }
      else {
        if (value[1].toString() === 'Invalid Date') {
          return callback(new Error('请选择日期'));
        }
        else {
          callback();
        }
      }
    };
    return {
      isDisabled: false,
      form: {
        redeemCodeName: '',
        publishCount: '',
        publishType: '0',
        date1: [new Date(), new Date('')],
        // date1: [],
        usageCount: 1,
        productList: [],
        productPrice: '',
        total: '',
        applyDepartment: '',
        applyUser: '',
        applyPurpose: '',
        applyNote: ''
      },
      createTime: '',
      isSubmit: false,
      rules: {
        redeemCodeName: [
          { required: true, message: '请输入兑换码名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        publishCount: [
          { required: true, message: '请输入发行量', trigger: 'blur' }
        ],
        publishType: [
          { required: true, message: '请选择发行类型', trigger: 'change' }
        ],
        date1: [
          { required: true, validator: checkDate, trigger: 'change' }
        ],
        // usageCount: [
        //   { required: true, message: '请输入用户使用次数', trigger: 'blur' }
        // ],
        productList: [
          { required: true, message: '请添加内容', trigger: 'change' }
        ],
        productPrice: [
          { required: true, message: '请输入商品价值', trigger: 'change' }
        ],
        total: [
          { required: true, message: '请输入总额', trigger: 'change' }
        ],
        applyDepartment: [
          { required: true, message: '请选择申请部门', trigger: 'change' }
        ],
        applyUser: [
          { required: true, message: '请输入申请人', trigger: 'blur' }
        ],
        applyPurpose: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      },
      showAdd: false,
      redeemCodeId: '',
      pickerOptions: {
        disabledDate(time) {
          let dateChange = _this.dateChange(new Date()) + ' 00:00:00';
          return time.getTime() < new Date(dateChange).getTime();
          // return time.getTime()<Date.now();
        }
      },
      defaultValue: this.dateChange(new Date())
    };
  },
  components: {
    addContent
  },
  methods: {
    // 日期格式转换,yy-mm-dd
    dateChange(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      return year + '-' + month + '-' + day;
    },
    inputBlur(value) {
      if (this.form[value]) {
        this.form[value] = parseInt(this.form[value], 10);
      }
    },
    onSubmit() {
      let _this = this;
      _this.$refs['form'].validate((valid) => {
        if (valid) {
          // alert('submit!');
          if (!_this.isSubmit) {
            _this.isSubmit = true;
            _this.submitTip();
          }
        }
        else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    closeContent() {
      this.form.productList = [];
      this.form.productPrice = '';
      this.form.total = '';
      this.$refs['form'].validateField('productList');
    },
    contentAdd(data) {
      this.showAdd = false;
      let picUrl = data.collegeCourseAttachmentVOList && data.collegeCourseAttachmentVOList.length && data.collegeCourseAttachmentVOList[0].attUrl;
      this.form.productList = [{
        productId: data.id,
        productName: data.courseName,
        picUrl: picUrl,
        productPrice: data.coursePriceElement
        // productPrice:data.coursePrice
      }];
      this.$refs['form'].validateField('productList');
      this.form.productPrice = data.coursePriceElement;
      // this.form.productPrice=data.coursePrice;
      if (this.form.publishCount.toString()) {
        this.form.total = (this.form.productPrice * this.form.publishCount).toFixed(2);
      }
    },
    closeDalog() {
      this.showAdd = false;
    },
    limmitLength() {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.form.redeemCodeName && _this.form.redeemCodeName.length > 20) {
          _this.form.redeemCodeName = _this.form.redeemCodeName.substr(0, 20);
        }
      });
    },
    limmitNumber(value, len, min) {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.form[value] !== null && _this.form[value] !== '') {
          _this.form[value] = _this.form[value].replace(/[^\d]/g, '');
          if (len && _this.form[value] > len) {
            _this.form[value] = len;
          }
          if (min && _this.form[value] < min) {
            _this.form[value] = min;
          }
        }
      });
      if (value === 'publishCount' && _this.form.productPrice.toString()) {
        _this.form.total = (_this.form.productPrice * _this.form.publishCount).toFixed(2);
      }
    },
    //  获取兑换码详情
    getCodeDetail() {
      let _this = this;
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getRedeemCodeById.type,
        url: apiConfig.getRedeemCodeById.url,
        params: {redeemCodeId: _this.redeemCodeId}
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          if (response.data.responseObject.responseData.dataList) {
            let dataList = response.data.responseObject.responseData.dataList[0];
            for (let key in _this.form) {
              if (key !== 'productPrice' && dataList[key] !== '') {
                switch (key) {
                  case 'publishType':
                  case 'applyDepartment':
                  case 'applyPurpose':
                    _this.form[key] = dataList[key].toString();
                    break;
                  case 'productList':
                    if (dataList[key] && dataList[key].length) {
                      _this.form[key] = dataList[key];
                      _this.form.productPrice = dataList[key][0].productPrice;
                    }

                    break;
                  case 'date1':
                    _this.form[key] = [new Date(dataList.startTime), new Date(dataList.endTime)];
                    break;
                  default:
                    _this.form[key] = dataList[key];
                    break;
                }
              }
            }
            console.log(_this.form);
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('拉取数据失败：', e);
      });
    },
    //  提交提示
    submitTip() {
      let _this = this;
      _this.$confirm('兑换码生成后，主要字段信息不得修改，是否确认生成？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.createCodeApi();
      }).catch(() => {
        _this.isSubmit = false;
      });
    },
    //  创建兑换码
    createCodeApi() {
      let _this = this;
      comm.openLoading('加载中...');
      let param = {};
      if (_this.redeemCodeId) {
        param = {
          redeemCodeId: _this.redeemCodeId,
          redeemCodeName: _this.form.redeemCodeName
        };
      }
      else {
        let userLoginName = localStorage.getItem('userLoginName');
        if (userLoginName) {
          param.opUser = userLoginName;
        }
        for (let key in _this.form) {
          if (key !== 'productPrice' && key !== 'total') {
            switch (key) {
              case 'publishType':
              case 'applyDepartment':
              case 'applyPurpose':
                param[key] = parseInt(_this.form[key], 10);
                break;
              case 'date1':
                param.startTime = _this.form[key][0];
                param.endTime = _this.form[key][1];
                break;
              case 'productList':
                param.productList = [
                  {
                    productId: _this.form.productList[0].productId,
                    productPrice: parseInt(_this.form.productPrice * 100, 10)
                  }
                ];
                break;
              default:
                param[key] = _this.form[key];
                break;
            }
          }
        }
      }
      console.log(param);
      axios({
        method: apiConfig.createRedeemCode.type,
        url: apiConfig.createRedeemCode.url,
        data: param
      }).then((response) => {
        console.log(response);
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
          _this.$message({
            type: 'success',
            message: '创建成功',
            onClose: () => {
              _this.$router.push({
                path: '/codeBatch'
              });
            }
          });
        }
        else {
          _this.isSubmit = false;
          this.$allin_confirm({title: '提示', content: '创建兑换码失败', type: 'notice'});
        }
      }).catch((e) => {
        comm.closeLoading();
        _this.isSubmit = false;
        this.$allin_confirm({title: '提示', content: '创建兑换码失败', type: 'notice'});
      });
    }

  },
  created() {
    window.onbeforeunload = function() {
      return '离开此网站，系统可能不会保存您所做的更改。';
    };
    if (this.$route.query.redeemCodeId) {
      this.isDisabled = true;
      this.redeemCodeId = this.$route.query.redeemCodeId;
    }
  },
  mounted() {
    if (this.redeemCodeId) {
      this.getCodeDetail();
    }
  },
  destroyed() {
    document.onkeydown = null;
    window.onbeforeunload = null;
    comm.goBack();
  },
  watch: {

  }
};
</script>

<style lang='scss'>
  .creat-main-contains {
    width: 1200px;
    margin: 20px auto;
    .from-container{
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
    }
    .code-title{
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }
    .el-input-width {
      width: 360px;
    }

    .el-input-width-330 {
      width: 330px;
    }
    .el-textarea-width {
      width: 360px;
    }
    .input-after-tip{
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      color: #999;
    }
    .el-input-name{
       &.el-input--suffix .el-input__inner{
         padding-right: 40px;
       }
    }
    .el-input-tip{
      color: #000;
    }
    .code-tip{
      width: 100%;
      background: #DFEEF9;
      border: 1px solid #49B6DA;
      line-height: 40px;
      padding-left: 5px;
      margin-bottom: 20px;
    }
    .code-info-title{
      margin-bottom: 20px;
      .icon-bg{
        background: #0687FF;
        width: 3px;
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        border-radius: 1px;
        margin-right: 5px;
      }
      span{
        display: inline-block;
        vertical-align: middle;
      }
    }
    .content-container{
      background: #FAFCFE;
      /*width: 570px;*/
      width: auto;
      display: inline-block;
      vertical-align: middle;
      min-width: 340px;
      padding-right: 30px;
      position: relative;
      .content-desc,.content-title{
        padding-left: 20px;
        line-height: 40px;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        max-width: 750px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .content-img{
        vertical-align: middle;
        width: 100px;
        height: 40px;
        margin-left: 20px;
      }
      .close-icon{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 5px;
        font-size: 26px;
        color: #999;
        cursor: pointer;
        margin-top: -2px;
      }
    }
  }
</style>
