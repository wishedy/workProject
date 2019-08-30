<template>
  <section class="creat-main-contains">
    <h1 class="code-title">{{showTitle}}</h1>
    <section class="code-tip" v-if="!isEdit">
      <p>提示：商品优惠券仅限用于绑定的指定商品消费时使用，创建成功后，仅允许修改优惠券名称。</p>
    </section>
    <section class="code-tip-edit" v-if="isEdit">
      <ul>
        <li>
          <el-card class="box-card">
            <h3>{{editTipData.receiveTitle}}</h3>
            <div>
              <h5>{{editTipData.unreceiveLabel}}{{editTipData.receiveStateTip}}</h5>
              <p>{{editTipData.unreceiveCount}}</p>
            </div>
            <div>
              <h5>{{editTipData.receiveLabel}}</h5>
              <p>{{editTipData.receiveCount}}</p>
            </div>
          </el-card>
        </li>
        <li>
          <el-card class="box-card">
            <h3>使用维度</h3>
            <div>
              <h5>未使用{{editTipData.useStateTip}}</h5>
              <p>{{editTipData.unuseCount}}</p>
            </div>
            <div>
              <h5>已使用</h5>
              <p>{{editTipData.useCount}}</p>
            </div>
          </el-card>
        </li>
      </ul>
    </section>
    <el-form ref="couponForm"
             :model="formData"
             :rules="rules"
             :label-position="'left'"
             label-width="110px"
             class="from-container">
      <h2 class="code-info-title"><i class="icon-bg"></i><span>基本信息</span></h2>
      <el-form-item label="优惠券名称" prop="couponName">
        <el-input
          v-model.trim="formData.couponName"
          class="el-input-width el-input-name"
          placeholder="请输入优惠券名称，不超过20个字符"
          maxlength="20"
        >
          <i slot="suffix" class="el-input-tip">{{formData.couponName.length}}/20</i>
        </el-input>
      </el-form-item>
      <el-form-item label="优惠券描述" prop="displayName">
        <el-input type="textarea"
                  :disabled="isEdit"
                  v-model.trim="formData.displayName"
                  class="el-textarea-width"
                  resize="none"
                  maxlength="18"
                  placeholder="示例：唯医学院送您满200减60学员券"
        >
        </el-input>
        <p class="input-after-tip">展示在付费视频和课程页中，文案中涉及金额需与该优惠券金额保持一致，请谨慎操作</p>
      </el-form-item>
      <el-form-item label="发放类型" prop="publishType">
        <el-radio-group v-model="formData.publishType" :disabled="isEdit">
          <el-radio :label=0>前台领取</el-radio>
          <el-radio :label=1>后台发放</el-radio>
        </el-radio-group>
        <p class="input-after-tip">后台发放支持按照指定UID将优惠券发放到用户账户中</p>
      </el-form-item>
      <el-form-item label="面额" prop="couponDenomination">
        <el-input
          v-model="formData.couponDenomination"
          class="el-input-width"
          placeholder="请输入优惠券金额，仅限数字"
          :disabled="isEdit"
          @input.native="limmitNumber('couponDenomination',null,1)"
        ></el-input>
        <p class="input-after-tip">元&nbsp;&nbsp;&nbsp;&nbsp;优惠券扣减金额，必须小于满额金额</p>
      </el-form-item>
      <el-form-item label="发行量" prop="publishCount">
        <el-input
          v-model="formData.publishCount"
          class="el-input-width"
          placeholder="请输入发行量，仅限输入数字"
          max="10000"
          :disabled="isEdit"
          @input.native="limmitNumber('publishCount',10000)"
        ></el-input>
        <p class="input-after-tip">个&nbsp;&nbsp;&nbsp;&nbsp;每批次仅限最多申请10000个，可分批申请</p>
      </el-form-item>
      <el-form-item label="总额" prop="couponTotal">
        <el-input
          v-model="formData.couponTotal"
          class="el-input-width"
          placeholder="系统自动计算，总额 = 面额 * 发行量"
          :disabled="true"
        ></el-input>
        <p class="input-after-tip">元</p>
      </el-form-item>
      <el-form-item label="使用条件" prop="useCondition">
        <p class="input-before-tip">满</p>
        <el-input
          v-model="formData.useCondition"
          class="el-input-width el-input-width-330"
          placeholder="请输入满额金额，仅限数字"
          :disabled="isEdit"
          @input.native="limmitNumber('useCondition',null,1)"
        ></el-input>
        <p class="input-after-tip">元使用&nbsp;&nbsp;&nbsp;&nbsp;必须大于优惠券面额</p>
      </el-form-item>
      <el-form-item label="有效时间" required>
        <el-col :span="8">
          <el-form-item prop="validTime">
            <el-date-picker
              class="el-input-width"
              v-model="formData.validTime"
              type="daterange"
              align="right"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              range-separator="到"
              value-format="yyyy-MM-dd"
              :default-time="['00:00:00', '23:59:59']"
              :default-value="['2010-09-08','2010-10-10']"
              :disabled="isEdit"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <p class="input-after-tip">&nbsp;开始时间不得晚于结束时间，开始前买家可以领取但不能使用</p>
      </el-form-item>
      <el-form-item label="每人限领" prop="perLimit">
        <el-input
          v-model="formData.perLimit"
          class="el-input-width"
          :disabled="true"
        ></el-input>
        <p class="input-after-tip">张</p>
      </el-form-item>
      <el-form-item label="适用商品" prop="limitProduct">
        <div class="content-add-header">
          <el-button class="el-icon-plus" @click="showAdd=true" :disabled="isEdit">添加商品</el-button>
          <p class="input-after-tip">优惠券一旦创建，商品不得删除，请谨慎操作</p>
        </div>
        <div v-if="formData.limitProduct">
          <div v-for="(item,index) in formData.limitProduct" :key="index">
            <div class="content-container">
              <p class="content-desc">付费课程</p>
              <img :src="item.picUrl" class="content-img"/>
              <p class="content-title">{{item.productName}}</p>
              <i class="close-icon" v-if="!isEdit" @click="deleteContent(item)">×</i>
            </div>
          </div>
        </div>
      </el-form-item>
      <h2 class="code-info-title"><i class="icon-bg"></i><span>申请信息</span></h2>
      <el-form-item label="申请部门" prop="applyDepartment">
        <!--市场运营部、商务部、协会事业部、测试部、产品部-->
        <el-select v-model="formData.applyDepartment" placeholder="请选择" :disabled="isEdit" class="el-input-width">
          <el-option label="市场运营部" :value="0"></el-option>
          <el-option label="商务部" :value="1"></el-option>
          <el-option label="协会事业部" :value="2"></el-option>
          <el-option label="测试部" :value="3"></el-option>
          <el-option label="产品部" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUser">
        <el-input
          v-model.trim="formData.applyUser"
          class="el-input-width"
          placeholder="请输入申请人姓名"
          maxlength="5"
          :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请用途" prop="applyPurpose">
        <!--厂商购买、院方采购、平台赠送、内部测试-->
        <el-select v-model="formData.applyPurpose" placeholder="请选择" :disabled="isEdit" class="el-input-width">
          <el-option label="渠道合作" :value="0"></el-option>
          <el-option label="营销推广" :value="1"></el-option>
          <el-option label="内部测试" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用途描述">
        <el-input type="textarea"
                  v-model.trim="formData.applyNote"
                  class="el-textarea-width"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  resize="none"
                  maxlength="100"
                  placeholder="请输入名称，最多不超过100个汉字"
                  :disabled="isEdit"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitBtnOnClick">提交</el-button>
      </el-form-item>
    </el-form>
    <AddContent v-if="showAdd" @closeDalog="closeDialogHandle" @addContent="addContentHandle"></AddContent>
  </section>
</template>

<script>
/**
 * 功能描述：创建/编辑商品优惠券
 * 参数说明：
 * 注意事项：
 *
 * Create by YaoQiao on 2019/4/27
 */
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';
import AddContent from './components/AddContent';

export default {
  name: 'commodityCouponDetail',
  components: {
    AddContent
  },
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

    function checkProductList(rule, value, callback) {
      if (value && value.length > 0) {
        callback();
      }
      else {
        callback(new Error('添加商品不能为空'));
      }
    }

    return {
      isEdit: false, // 是否为编辑状态，编辑状态仅允许修改
      showAdd: false, // 显示添加商品内容的弹窗
      id: '', // 批次id
      showTitle: '优惠券/创建商品优惠券',
      formData: {
        couponName: '', // 优惠券名称
        displayName: '', // 优惠券描述
        publishType: 0, // 发放类型
        couponDenomination: '', // 面额
        publishCount: '', // 发行量
        couponTotal: '', // 总额
        useCondition: '', // 使用条件
        validTime: [new Date(), new Date('')], // 有效时间
        limitProduct: [], // 适用商品
        perLimit: 1, // 限领张数，3.7迭代要求固定为 1 张
        applyDepartment: '', // 申请部门
        applyUser: '', // 申请人
        applyPurpose: '', // 申请用途
        applyNote: '', // 用途描述
        couponType: 1 // 优惠券类型，商品优惠券（固定值）
      },
      rules: {
        couponName: [
          {required: true, message: '请输入优惠券名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        displayName: [
          {required: true, message: '请输入优惠券描述', trigger: 'blur'},
          {min: 1, max: 18, message: '长度在 1 到 18 个字符', trigger: 'blur'}
        ],
        publishType: [
          { required: true }
        ],
        couponDenomination: [
          {required: true, message: '请输入优惠券金额', trigger: 'blur'}
        ],
        publishCount: [
          {required: true, message: '请输入发行量', trigger: 'blur'}
        ],
        couponTotal: [
          {required: true, message: '系统自动计算，总额 = 面额 * 发行量'}
        ],
        useCondition: [
          {required: true, message: '请输入满额金额', trigger: 'blur'}
        ],
        validTime: [
          {required: true, message: '请选择有效时间', trigger: 'change'},
          {required: true, validator: checkDate, trigger: 'change'}
        ],
        limitProduct: [
          {required: true, validator: checkProductList, trigger: 'change'}
        ],
        perLimit: [
          {required: true}
        ],
        applyDepartment: [
          {required: true, message: '请选择申请部门', trigger: 'change'}
        ],
        applyUser: [
          {required: true, message: '请输入申请人', trigger: 'blur'}
        ],
        applyPurpose: [
          {required: true, message: '请选择申请用途', trigger: 'change'}
        ],
        applyNote: [
          {required: false, message: ''}
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          let dateChange = _this.dateChange(new Date()) + ' 00:00:00';
          return time.getTime() < new Date(dateChange).getTime();
        }
      },
      defaultValue: this.dateChange(new Date()),
      editTipData: {
        isNormal: false, // 正常状态
        isExpired: false, // 已过期状态
        isDiscard: false, // 已废弃状态
        receiveCount: 0, // 已领取数量
        unreceiveCount: 0, // 未领取数量
        useCount: 0, // 已使用数量
        unuseCount: 0, // 未使用数量
        receiveStateTip: '', // 当前领取状态的提示语，（已过期）、（已废弃）
        useStateTip: '', // 当前使用状态的提示语，（已过期）
        receiveTitle: '', // 领取维度的标题，前台领取类型为"领取维度"，后台发放类型为"发放维度"
        unreceiveLabel: '', // 未领取的label ，前台领取类型为 "未领取"，后台发放类型为 "未发放"
        receiveLabel: '' // 已领取的label ，前台领取类型为 "已领取"，后台发放类型为 "已发放"
      }
    };
  },
  methods: {
    getDetailData() {
      // 编辑时，获取详情数据
      comm.openLoading('加载中...');
      axios({
        method: apiUrlConfig.getCouponById.type,
        url: apiUrlConfig.getCouponById.url,
        params: {
          id: this.id
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          this.formData.couponName = responseData.couponName;
          this.formData.displayName = responseData.displayName;
          this.formData.couponDenomination = responseData.couponDenomination;
          this.formData.publishType = responseData.publishType;
          this.formData.publishCount = responseData.publishCount;
          this.formData.couponTotal = responseData.couponDenomination * responseData.publishCount;
          this.formData.useCondition = responseData.useCondition;
          this.formData.validTime = [new Date(responseData.startTime), new Date(responseData.endTime)];
          this.formData.perLimit = responseData.perLimit;
          this.formData.applyDepartment = responseData.applyDepartment;
          this.formData.applyUser = responseData.applyUser;
          this.formData.applyPurpose = responseData.applyPurpose;
          this.formData.applyNote = responseData.applyNote;
          this.formData.limitProduct = responseData.limitProduct;
          // 设置领取/发放相关提示
          // 前台领取
          if (responseData.publishType === 0) {
            this.editTipData.receiveTitle = '领取维度';
            this.editTipData.unreceiveLabel = '未领取';
            this.editTipData.receiveLabel = '已领取';
          }// 后台发放
          else if (responseData.publishType === 1) {
            this.editTipData.receiveTitle = '发放维度';
            this.editTipData.unreceiveLabel = '未发放';
            this.editTipData.receiveLabel = '已发放';
          }
          // 设置当前批次使用数据
          // 正常
          if (responseData.batchState === 0) {
            this.editTipData.isNormal = true;
          }// 已废弃
          else if (responseData.batchState === 1) {
            this.editTipData.isDiscard = true;
            this.editTipData.receiveStateTip = '（已废弃）';
          }// 已过期
          else if (responseData.batchState === 2) {
            this.editTipData.isExpired = true;
            this.editTipData.receiveStateTip = '（已过期）';
            this.editTipData.useStateTip = '（已过期）';
          }
          this.editTipData.useCount = responseData.useCount;
          this.editTipData.unuseCount = responseData.publishCount - responseData.useCount;
          this.editTipData.receiveCount = responseData.receiveCount;
          this.editTipData.unreceiveCount = responseData.publishCount - responseData.receiveCount;
        }
        else {
          this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
          console.log('获取数据失败');
        }
      }).catch((err) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('获取数据失败', err);
      });
    },
    saveDetailData() {
      // 如果面额、使用条件同时存在，则判断使用条件是否小于面额，小于则提示有误，并清空使用条件
      if (parseInt(this.formData.useCondition) <= parseInt(this.formData.couponDenomination)) {
        this.$allin_confirm({
          title: '提示',
          content: '优惠券扣减金额，必须小于满额金额，请重新输入面额金额！',
          type: 'notice',
          done: () => {
            this.formData.useCondition = '';
          },
          cancel: () => {
            this.formData.useCondition = '';
          }
        });
      }
      else {
        if (this.isEdit) {
          comm.openLoading('加载中...');
          axios({
            url: apiUrlConfig.updateCouponNameById.url,
            method: apiUrlConfig.updateCouponNameById.type,
            data: {
              id: this.id,
              couponName: this.formData.couponName
            }
          }).then((res) => {
            comm.closeLoading();
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.$message('修改优惠券名称成功', {duration: 2000});
              this.$router.push('/couponBatchList');
            }
            else {
              this.$message('修改优惠券名称失败', {duration: 2000});
            }
          }).catch((err) => {
            comm.closeLoading();
            this.$message('修改优惠券名称失败', {duration: 2000});
            console.log(err);
          });
        }
        else {
          this.$allin_confirm({
            title: '提示',
            content: '优惠券生成后，主要字段信息不得修改，是否确认生成？',

            done: () => {
              // 更新数据
              comm.openLoading('加载中...');
              let data = {};
              // 格式化有效时间
              data.startTime = this.formData.validTime[0];
              data.endTime = this.formData.validTime[1];
              for (let key in this.formData) {
                if (this.formData[key] || this.formData[key] === 0) {
                  data[key] = this.formData[key];
                }
              }
              // 获取当前登录用户名
              data.opUser = localStorage.getItem('userLoginName');
              delete data.validTime;

              axios({
                method: apiUrlConfig.createCoupon.type,
                url: apiUrlConfig.createCoupon.url,
                data: data
              }).then((res) => {
                comm.closeLoading();
                if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                  this.$message('生成优惠券成功', {duration: 2000});
                  this.$router.push('/couponBatchList');
                }
                else {
                  this.$allin_confirm({title: '提示', content: '生成优惠券失败', type: 'notice'});
                  console.log('生成优惠券失败');
                }
              }).catch((err) => {
                comm.closeLoading();
                this.$allin_confirm({title: '提示', content: '生成优惠券失败', type: 'notice'});
                console.log('生成优惠券失败', err);
              });
            }
          });
        }
      }
    },
    limmitNumber(value, max, min) {
      let _this = this;
      _this.$nextTick(() => {
        if (_this.formData[value] !== null && _this.formData[value] !== '') {
          _this.formData[value] = _this.formData[value].replace(/[^\d]/g, '');
          if (max && _this.formData[value] > max) {
            _this.formData[value] = max;
          }
          if (min && _this.formData[value] < min) {
            _this.formData[value] = min;
          }
        }
      });
      // 如果是面额、发行量同时存在，则计算出总额
      if ((value === 'couponDenomination' && this.formData.publishCount) || (value === 'publishCount' && this.formData.couponDenomination)) {
        this.formData.couponTotal = this.formData.publishCount * this.formData.couponDenomination;
      }
    },
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
    submitBtnOnClick() {
      this.$refs['couponForm'].validate((valid) => {
        if (valid) {
          this.saveDetailData();
        }
        else {
          return false;
        }
      });
    },
    closeDialogHandle() {
      this.showAdd = false;
    },
    addContentHandle(data) {
      this.showAdd = false;
      for (let j = 0; j < data.length; j++) {
        let picUrl = data[j].collegeCourseAttachmentVOList && data[j].collegeCourseAttachmentVOList.length && data[j].collegeCourseAttachmentVOList[0].attUrl;
        // 数据去重
        let _noRepeat = true;
        for (let i = 0, len = this.formData.limitProduct.length; i < len; i++) {
          if (data[j].id === this.formData.limitProduct[i].productId) {
            _noRepeat = false;
            break;
          }
        }
        if (_noRepeat) {
          this.formData.limitProduct.push({
            productId: data[j].id,
            productName: data[j].courseName,
            picUrl: picUrl,
            productPrice: data[j].coursePrice
          });
        }
      }
      this.$refs['couponForm'].validateField('limitProduct');
    },
    deleteContent(item) {
      let _index = this.formData.limitProduct.indexOf(item);
      this.formData.limitProduct.splice(_index, 1);
      this.$refs['couponForm'].validateField('limitProduct');
    }
  },
  created() {
    window.onbeforeunload = function() {
      return '离开此网站，系统可能不会保存您所做的更改。';
    };
    if (this.$route.query.id) {
      this.isEdit = true;
      this.id = this.$route.query.id;
      this.showTitle = '优惠券/编辑商品优惠券';
    }
  },
  mounted() {
    if (this.isEdit) {
      this.getDetailData();
    }
  },
  destroyed() {
    window.onbeforeunload = null;
  }
};
</script>

<style scoped lang="scss">
  .creat-main-contains {
    width: 1200px;
    margin: 20px auto;
    textarea {
      font-family: PingFangSC-Regular;
    }
    .from-container {
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
    }

    .code-title {
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

    .input-before-tip {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
      color: #999;
    }
    .input-after-tip {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
      color: #999;
    }

    .el-input-name {
      &
      .el-input--suffix .el-input__inner {
        padding-right: 40px;
      }
    }
    .el-input-tip {
      color: #000;
    }

    .code-tip {
      width: 100%;
      background: #DFEEF9;
      border: 1px solid #49B6DA;
      line-height: 40px;
      padding-left: 5px;
      margin-bottom: 20px;
    }
    .code-tip-edit {
      ul {
        li {
          display: inline-block;
          width: 340px;
          margin-right: 80px;
          margin-bottom: 40px;
          .box-card {
            color: #999999;
            h3 {
              text-align: center;
              font-size: 14px;
            }
            div {
              display: inline-block;
              width: 120px;
              margin-right: 25px;
              text-align: center;
              h5 {
                padding: 20px 0;
                font-size: 14px;
                font-weight: normal;
              }
              p {
                color: #4B67D6;
                font-weight: bolder;
              }
            }
          }
        }
      }
    }

    .code-info-title {
      margin-bottom: 20px;
      .icon-bg {
        background: #0687FF;
        width: 3px;
        display: inline-block;
        vertical-align: middle;
        height: 16px;
        border-radius: 1px;
        margin-right: 5px;
      }

      span {
        display: inline-block;
        vertical-align: middle;
      }

    }
    .content-add-header {
      margin-bottom: 10px;
    }
    .content-container {
      background: #FAFCFE;
      display: inline-block;
      vertical-align: middle;
      min-width: 340px;
      padding-right: 30px;
      position: relative;
      margin: 10px 0;
      .content-desc, .content-title {
        padding-left: 20px;
        line-height: 40px;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        max-width: 750px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .content-img {
        vertical-align: middle;
        width: 100px;
        height: 40px;
        margin-left: 20px;
      }

      .close-icon {
        position: absolute;
        margin-top: -2px;
        top: 50%;
        transform: translateY(-50%);
        right: 5px;
        font-size: 26px;
        color: #999;
        cursor: pointer;
      }

    }
  }
</style>
<style lang="scss">
  .creat-main-contains {
    textarea {
      font-family: PingFangSC-Regular;
    }
  }
</style>
