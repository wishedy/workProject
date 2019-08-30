<template>
    <div>
        <el-form-item label="服务品牌">
            <el-select v-model.trim="currentBrand" filterable placeholder="请选择品牌" :filter-method="searchBrand" @visible-change="clearInfo">
                <el-option
                    v-for="(item,index) in myBrandName"
                    :key="index"
                    :value="item.split(',')[0]"
                >
                </el-option>
            </el-select>
            <!-- <el-button type="primary" plain @click.stop='addBrandBtnOnClick' v-if="ifAddBrand.ifShowAddBrandBtn">添加品牌</el-button> -->
        </el-form-item>
        <div v-if='ifAddBrand.ifShowDialog' class="myPopupWindowSpBox">
            <div class='brandMask'></div>
            <div class='myPopBox'>
                <div class='el-message-box__header'>
                    <button type='button' aria-label='Close' class='el-message-box__headerbtn' @click='closeBrandDialog'>
                    <i class='el-message-box__close el-icon-close'></i>
                    </button>
                </div>
                <div class='title'>添加品牌</div>
                <div class='myPopBox_inputBox'>
                    <div class='myPopBox_lable'><i>*</i>品牌名称</div>
                    <input type='text' class='myPopBox_input' v-model='ifAddBrand.fillBrandName'>
                </div>
                <div class='myPopBox_btns'  @click='brandAddConfirm'>确认添加</div>
                <span v-if="ifAddBrand.ifEmptyInfoWhow" class="emptyInfo">企业名称不得为空</span>
            </div>

        </div>
    </div>
</template>

<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import { setTimeout } from 'timers';

export default {
  name: 'CompanyBrand',
  props: {
    brandName: { type: Array }, // 品牌名称，初始化时接收
    company: { type: String }, // 企业名称
    chooseBrandName: { type: String } // 被选中的品牌信息
  },
  data: function() {
    return {
      myBrandName: this.brandName ? this.brandName : [], // 存放商标的数组
      currentBrand: (this.brandName.length === 1 && this.brandName[0].split(',')) ? this.brandName[0].split(',')[0] : '', // 存放当前选中状态的商标
      companyMessage: {}, // 获取当本地没有用户搜索出来的信息
      bindedBrand: this.brandName ? this.brandName : [], // 存放已经和这个企业绑定好了的品牌
      changeCompany: false, // 判断是否有企业修改
      ifAddBrand: { // 添加品牌弹框判断系列
        ifShowDialog: false, // 品牌添加弹窗显示隐藏状态
        fillBrandName: '', // 在添加品牌弹窗上添加品牌名称
        ifShowAddBrandBtn: false, // 判断品牌添加按钮是否显示
        ifEmptyInfoWhow: false // 当添加品牌时没有输入内容，提示信息出现
      },
      timerList: [] // 品牌输入防抖处理

    };
  },
  watch: {
    brandName(newVal, oldVal) {
      this.myBrandName = newVal;
      // 如果只有一条数据默认显示，要是多条数据就默认不显示
      if (newVal.length === 1 && newVal[0].split(',')) {
        this.currentBrand = newVal[0].split(',')[0];
      }
      this.bindedBrand = newVal;
      // newVal.length == 0 ? this.ifAddBrand.ifShowAddBrandBtn = true : ''; //如果默认进来品牌没有数据，添加按钮显示
      if (newVal.length !== 0 && oldVal.length === 0 && this.chooseBrandName) { // 加一项刷新默认显示之前选中项
        this.currentBrand = this.chooseBrandName.split(',')[0];
        this.$emit('sendBrandId', this.chooseBrandName.split(',')[1]);
      }
    },
    currentBrand(newVal, oldVal) { // 反到父组件当前的选中品牌
      this.$emit('sendMyBrandName', newVal);
      this.myBrandName.map((val) => {
        if (newVal === val.split(',')[0]) {
          this.$emit('sendBrandId', val.split(',')[1]);
        }
      });
    },
    company(newVal, oldVal) {
      if (newVal && oldVal) {
        this.changeCompany = true;
        this.getNewBrandNames(newVal);
      }
    }
  },
  mounted() {

  },
  methods: {
    brandAddConfirm() { // 点击提交增加的品牌
      var _this = this;
      if (this.ifAddBrand.fillBrandName) {
        axios({
          method: apiConfig.addBrand.type,
          url: apiConfig.addBrand.url,
          data: {
            brandName: _this.ifAddBrand.fillBrandName
          }
        }).then((response) => {
          _this.ifAddBrand.ifShowDialog = false;
          // _this.ifAddBrand.ifShowAddBrandBtn = false;
          _this.currentBrand = _this.ifAddBrand.fillBrandName;
          _this.ifAddBrand.fillBrandName = '';
          this.$emit('sendBrandId', response.data.responseObject.responsePk); // 向外传brandId
        });
      }
      else {
        this.ifAddBrand.ifEmptyInfoWhow = true;
      }
    },
    closeBrandDialog() { // 点击关闭添加品牌弹框
      this.ifAddBrand.ifShowDialog = false;
    },
    addBrandBtnOnClick() { // 点击添加品牌
      this.ifAddBrand.ifShowDialog = true;
    },
    clearInfo(val) { // 下拉框展开隐藏触发函数，用来清空里面的数据
      if (!val) {
        this.myBrandName = this.bindedBrand;
      }
    },
    getNewBrandNames(company, brandName = '') { // 当企业名称发生变化时更新品牌数据，也可根据品牌找信息
      axios({
        method: apiConfig.getBrandName.type,
        url: apiConfig.getBrandName.url,
        params: {
          firstResult: 0,
          maxResult: 20,
          companyName: company,
          brandName: brandName,
          flag: 4
        }
      }).then((response) => {
        this.companyMessage = response.data.responseObject;
        this.myBrandName = [];
        if (this.changeCompany) { // 企业修改了
          console.log(1);
          this.bindedBrand = [];
          this.companyMessage.map((val) => {
            if (val.brandName && this.myBrandName.indexOf(val.brandName) === -1) {
              console.log(val.brandName + ',' + val.brandId);
              this.myBrandName.push(val.brandName + ',' + val.brandId);
              this.bindedBrand.push(val.brandName + ',' + val.brandId);
            }
          });
          this.myBrandName.length === 1 ? this.currentBrand = this.myBrandName[0].split(',')[0] : this.currentBrand = '';
          this.changeCompany = false;
        }
        else { // 未修改企业
          if (this.companyMessage.length === 0) {
            // this.ifAddBrand.ifShowAddBrandBtn = true;
          }
          else {
            // this.ifAddBrand.ifShowAddBrandBtn = false;
            this.companyMessage.map((val) => {
              if (val.brandName && this.myBrandName.indexOf(val.brandName) === -1) {
                this.myBrandName.push(val.brandName + ',' + val.brandId);
              }
            });
            this.myBrandName = this.myBrandName.concat(this.bindedBrand);
          }
        }
      });
    },
    searchBrand(val) { // 下拉框输入触发函数
      this.clearTimer();
      if (val.length > 0) {
        this.timerList.push(this.timer);
        this.timer = setTimeout(() => {
          var ifhasVal = this.myBrandName.find((v) => {
            return v === val;
          });
          if (!ifhasVal && this.timerList.length <= 1) { // 当返回undefined时说明搜索的数据没有，需要掉接口调取
            this.getNewBrandNames('', val);
            this.timerList.pop();
          }
          else {
            this.timerList.pop();
          }
        }, 800);
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
  },
  destroyed() {

  }
};
</script>

<style lang="scss" scoped>
    .myPopupWindowSpBox{
        width: 100%;
        height: 100%;
        position: fixed;
        top:0;
        left:0;
        z-index: 1100;
        .myPopBox {
            width: 383px;
            height:224px;
            border-radius: 5px;
            position: absolute;
            top:50%;
            left:50%;
            margin-top: -112px;
            margin-left: -191px;
            background-color: #fff;
            z-index: 1100;
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
            .myPopBox_inputBox{
                width:326px;
                height:40px;
                margin:0 auto;
                .myPopBox_lable{
                    display: inline-block;
                    width:94px;
                    height:36px;
                    font-family: PingFang SC,"\5FAE\8F6F\96C5\9ED1", Arial, Tahoma, "Hiragino Sans GB W3";
                    color:#606266;
                    i{
                        color: rgb(235, 59, 70);
                    }
                }
                .myPopBox_input{
                    display:inline-block;
                    border: 1px solid #E6E6E8;
                    border-radius:4px;
                    height:36px;
                    width:214px;
                    padding:0 4px;
                }
            }
            .myPopBox_btns{
                width:160px;
                height:41px;
                text-align: center;
                color: #fff;
                margin: 32px auto 0;
                background: #4B67D6;
                border-radius: 100px;
                font-family: PingFangSC-Regular;
                font-size: 15px;
                line-height: 41px;
                cursor: pointer;
            }
            .emptyInfo{
                font-size: 12px;
                color: #eb3b46;
                text-align: center;
                width: 100%;
                display: block;
                margin-top: 10px;
            }
        }
    }
    .brandMask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1009;
        opacity: 0.7;
        background: #000000;
    }
</style>
