<template>
  <div class="productPointDescCont">
    <div class="productPointDesc">
      <el-form :model="descForm" :rules="descRules" ref="descForm" label-width="100px">
        <el-form-item label="视频ID" prop="videoId">
          <el-input v-model="descForm.videoId" placeholder="请输入视频ID" class="width300" :disabled="!isEdit?false:'disabled'"></el-input>
          <el-button class="NewOrEditBtn" @click.stop="searchVideoIdFn" v-if="!isEdit">查询</el-button>
        </el-form-item>
        <el-form-item label="视频标题" prop="">
          <el-input v-model="descForm.videoName" type="textarea" :rows="2" resize="none" disabled="disabled" class="width300"></el-input>
        </el-form-item>
        <!--发布视频最长标题是25字全部显示即可-->
        <el-form-item label="视频时长" prop="">
          <el-input v-model="descForm.playTime" disabled="disabled" class="width300"></el-input>
        </el-form-item>
        <!--多作者情况下，利用textarea放置所有的作者-->
        <el-form-item label="作者" prop="">
          <el-input type="textarea" :rows="2" resize="none" v-model="descForm.videoAuthor" disabled="disabled" class="width300"></el-input>
        </el-form-item>
        <el-form-item label="添加锚点" prop="addPoint" class="addPoint">
          <el-input v-model="descForm.addPoint" style="display: none"></el-input>
          <el-button @click.stop="clickAddPoint" class="el-icon-plus"> 新增产品</el-button>
          <span class="videoPointTip">*每个锚点时间间隔在6s以上</span>
        </el-form-item>
        <el-table
          ref="multipleTable"
          :data="listDatas.nodeList"
          style="width: 80%;margin-left: 100px"
          class="productLists"
        >
          <!--展示数据时显示-->
          <el-table-column
            prop=""
            label="序号"
            width="50"
            type="index"
          >
          </el-table-column>
          <el-table-column
            prop="nodeTime"
            label="锚点时间"
            width="210"
          >
            <template slot-scope="scope">
              <template v-for="(item,index) in timeFilter(scope)">
                <!--此处需要绑定两个key值，因为key值不能重复，则一个用index一个用item.productId-->
                <el-input class="timeInput" v-bind:value="item" :key="index" type="number" @input="timeChangeFn(scope.$index,$event,index)"></el-input>
                <span v-if="index!==2" class="nodeTimePoint" :key="item.productId">:</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名"
            width="260"
          >
          </el-table-column>
          <el-table-column
            prop="brandName"
            label="所属品牌"
            width="250"
          >
          </el-table-column>
          <el-table-column
            prop="opUserName"
            label="操作人"
            width="100"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            class="delateBtn"
            fixed="right"
            style="text-align: center"
          >
            <template slot-scope="scope">
              <el-button
                @keydown.native.prevent
                @click.stop="deletCurrentProduct(scope.row,scope.$index)"
                class="changeStateBotton"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <el-button class="submitBtn" @click.stop="saveProductBtn('descForm')">保存</el-button>
          <el-button class="cancleBtn" @click.stop="goBackProductPoint">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--选择产品弹层-->
    <el-dialog title="选择产品" :visible.sync="dialogFormVisible" width="1000px">
      <el-form :model="descFormPop" :rules="descRulesPop" ref="descFormPop">
        <el-form-item label="查询产品" :label-width="formLabelWidth" prop="product">
          <el-input v-model="descForm.product" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item label="查询品牌" :label-width="formLabelWidth" prop="brand">
          <el-input v-model="descForm.brand" placeholder="品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="brand">
          <span class="searchBtn" @click.stop="searchPointFn">查询</span>
        </el-form-item>
        <el-form-item label="" style="margin-left: 52px" prop="brand">
          <div class="choosedProductTxt"><span v-if="currentProduct.productName">已选"{{currentProduct.productName}}"</span></div>
          <div class="searchBtn" @click.stop="addCurrentProduct">添加产品</div>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="proListDatas"
        style="width: 90%;margin-left: 50px"
      >
        <!--展示数据时显示-->
        <el-table-column
          prop="nodeNum"
          label="选择"
          width="50"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="templateRadio"
              :label="scope.row.productId"
              @change.native="getRadioRow(scope.row)">&nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          width="330"
        >
        </el-table-column>
        <el-table-column
          prop="attUrl"
          label="产品图"
          width="100"
        >
            <template slot-scope="scope">
              <img
                src="/static/images/icons/icon-picture_hover_tiny.png"
                class="bigImgShow"
                alt=""
                v-if="scope.row.attUrl"
                @mouseenter="smallImgMouseenter(scope.row)"
                @mouseleave="smallImgMouseLeave"
              >
          </template>
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="所属品牌"
          width="260"
        >
        </el-table-column>
        <el-table-column
          prop="isValid"
          label="是否有效"
          width="80"
          :formatter="isValidFn"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align: center;margin: 20px 0 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper, sizes"
        :total="totalNum" v-if="totalNum>10">
      </el-pagination>
      <!--表格hover查看大图-->
      <div
        class="tableBigImgDialog"
        v-show="bigImgDialogVisible"
        @mouseenter="bigImgMouseenter"
        @mouseleave="bigImgMouseLeave"
      >
        <img
          :src="bigImgPath"
          alt="产品图"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
/**
   * CRM 管理后台，运营配置——产品锚点（详情页）
   * author:zhanghongda
   * create-time:2019.03.27（开发周期：2019/4/1-2019/4/12）
   * 产品版本：新后台系统v1.6.0（大版本3.6）
   * 功能信息：
   *  1，新建/编辑并发布一个视频完整产品锚点
   *  2，根据视频id获取视频锚点信息
   *  3，新增/删除/修改一个产品的锚点信息
   *  4，查询产品列表并添加一个产品作为锚点（一次只能添加一个产品 ）
   *
   */

import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';

export default {
  data() {
    return {
      maxResult: 10, // 每页几条
      firstResult: 0, // 当前页首个索引
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页条数
      totalNum: 0, // 数据总数
      listDatas: [],
      proListDatas: [],
      descForm: {
        videoId: '', // 视频id
        addPoint: '', // 添加锚点
        videoName: '', // 视频标题
        videoAuthor: '', // 作者
        videoLength: 0// 视频时长
      },
      descRules: {
        videoId: [
          {required: true, message: '请填写正确的视频id', trigger: 'change blur'}
        ],
        addPoint: [
          {required: true, message: '请添加锚点', trigger: 'change blur'}
        ]
      },
      descFormPop: {},
      descRulesPop: {},
      isEdit: false, // 表示是编辑状态
      dialogFormVisible: false, // 是否显示弹层
      formLabelWidth: '120px',
      bigImgDialogVisible: false, // 是否显示大图
      bigImgPath: '', // 图片路径
      templateRadio: '',
      detailLists: [], // 存储上传时选中的产品
      searchProduct: '', // 查询产品
      searchBrand: '', // 查询品牌
      axiosNum: 0, // 请求数
      videoId: comm.getpara().videoId, // 手册id
      operatorId: localStorage.getItem('userId'), // 操作者id
      operatorName: localStorage.getItem('userRealName'), // 操作者
      userLoginName: localStorage.getItem('userLoginName'), // 登录名称
      currentProduct: [], // 当前选择的产品
      alReadyProList: [], // 已经选择的产品列表
      searchVideoId: '', // 点击查询后保存视频id
      isChoosePro: false, // 是否选择了商品
      timesArr: []// 存放nodetime（视频锚点时间）的数组，将每次更改的时间进行保存，在点击保存按钮后进行循环修改。
    };
  },
  methods: {
    // 表格图片hover事件
    smallImgMouseenter(row) {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      if (row.attUrl) {
        this.bigImgDialogVisible = true;
        this.bigImgPath = row.attUrl;
      }
      else {
        this.bigImgDialogVisible = false;
        this.bigImgPath = '';
      }
    },
    // 表格离开事件
    smallImgMouseLeave() {
      let _this = this;
      _this.bigImgTimer = setTimeout(function() {
        _this.bigImgDialogVisible = false;
      }, 1000);
    },
    // 大图hover事件
    bigImgMouseenter() {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
    },
    // 大图移开事件
    bigImgMouseLeave() {
      this.bigImgDialogVisible = false;
    },
    // 更改每页数
    handleSizeChange(val) {
      this.maxResult = val;
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.addPointFn();
    },
    // 更改当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.firstResult = (val - 1) * this.maxResult;
      this.addPointFn();
    },
    // 点击添加产品
    clickAddPoint() {
      this.firstResult = 0;
      this.maxResult = 10;
      this.currentPage = 1; // 回退到第一页
      this.productName = '';// 产品名称置空，避免在输入后关闭弹层，再次唤出弹层时将参数传入导致数据获取失败/数据不准备
      this.brandName = '';// 品牌名称
      this.descForm.product = '';
      this.descForm.product = '';
      this.addPointFn();
    },
    // 添加产品点击后显示弹层,获取商品列表
    addPointFn() {
      this.dialogFormVisible = true;
      let param = {
        firstResult: this.firstResult,
        maxResult: this.maxResult,
        productNameLike: this.productName ? this.productName : undefined,
        brandNameLike: this.brandName ? this.brandName : undefined,
        isValid: 1
      };
      let callback = (res) => {
        // 初始化列表和总数
        this.proListDatas = [];
        this.totalNum = 0;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseStatus) {
          if (res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length > 0) {
            this.proListDatas = res.data.responseObject.responseData.dataList;
            this.totalNum = res.data.responseObject.responseData.totalCount;
          }
        }
        else {
          this.$message.error('数据获取失败，请重试！');
        }
      };
      this.getListAxios(apiConfig.getProductMapList.url, param, callback);
    },
    // 点击查询按钮查询产品
    searchPointFn() {
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      this.productName = this.descForm.product;// 产品名称
      this.brandName = this.descForm.brand;// 品牌名称
      this.addPointFn();
    },
    // 选中某一个产品触发
    getRadioRow(row) {
      this.currentProduct = row;
      this.isChoosePro = true;
    },
    isValidFn(val) {
      if (val.isValid === 1) {
        return '有效';
      }
      else {
        return '无效';
      }
    },
    // 将时间进行格式转换
    timeFilter(val) {
      if (val.row.nodeTime || val.row.nodeTime === 0) { // 当新添加的产品时间为0
        let times = val.row.nodeTime;
        let hour = parseInt(times / 3600);
        let minute = parseInt((times - 3600 * hour) / 60);
        let second = parseInt(((times - 3600 * hour) - 60 * minute) % 60);
        if (hour) {
          if (hour < 10) {
            hour = '0' + hour;
          }
        }
        else {
          hour = '00';
        }
        if (minute) {
          if (minute < 10) {
            minute = '0' + minute;
          }
        }
        else {
          minute = '00';
        }
        if (second) {
          if (second < 10) {
            second = '0' + second;
          }
        }
        else {
          second = '00';
        }
        let timeArr = [hour, minute, second];
        return timeArr;
      }
    },
    // 修改时间时将数组中存储的时间进行更改
    timeChangeFn(index, event, i) {
      let timeOld = this.timesArr[index];
      if (timeOld || timeOld === 0) { // 如果没有写入时间加入判断中
        let hour = parseInt(timeOld / 3600);
        let minute = parseInt((timeOld - 3600 * hour) / 60);
        let second = parseInt(((timeOld - 3600 * hour) - 60 * minute) % 60);
        let timeNew = 0;
        if (i === 0) { // 表示改变的小时
          if (event === 0 || event === '') { // 如果输入0时
            timeNew = timeOld - hour * 3600;
          }
          else {
            timeNew = timeOld - (hour - parseInt(event)) * 3600;
          }
        }
        else if (i === 1) { // 表示改变的分钟
          if (event === 0 || event === '') {
            timeNew = timeOld - minute * 60;
          }
          else {
            timeNew = timeOld - (minute - parseInt(event)) * 60;
          }
        }
        else { // 表示改变的秒
          if (event === 0 || event === '') {
            timeNew = timeOld - second;
          }
          else {
            timeNew = timeOld - second + parseInt(event);
          }
        }
        this.timesArr[index] = timeNew;// 将修改后的时间进行格式处理，并写入到时间数组中。
      }
    },
    // 选择当前选中的产品,弹层消失，将选中项插入到新增产品表格列表中。
    addCurrentProduct() {
      if (this.currentProduct === '') {
        this.$message.error('请选择一个产品');
      }
      else {
        this.dialogFormVisible = false;
        this.currentProduct.nodeNum = this.listDatas.length;
        this.currentProduct.opUserName = this.userLoginName;
        this.currentProduct.nodeTime = 0;
        if (!this.listDatas.nodeList) {
          this.listDatas.nodeList = [];// 当没有进行查询时直接进行插入产品则定义nodelist是空的，否则nodelist不存在会报错。
        }
        this.listDatas.nodeList.push(this.currentProduct);// 将已经选择的产品进行添加至列表
        this.timesArr.push(0);// 新添加的产品初始化时间为0并加入数组
        this.descForm.addPoint = 1;
      }
    },
    // 删除当前产品
    deletCurrentProduct(row, index) {
      this.$allin_confirm({
        title: '提示',
        content: '确定删除此条锚点么？',
        done: () => {
          this.listDatas.nodeList.splice(index, 1);// 删除当前项
          this.timesArr.splice(index, 1);// 删除数组中的时间
        }
      });
    },
    // 根据video查询内容
    searchVideoIdFn() {
      if (this.descForm.videoId && (this.descForm.videoId).trim()) {
        this.searchVideoId = (this.descForm.videoId).trim();// 将查询的视频id进行保存
        this.searchBtnFn();
      }
    },
    // 根据视频id进行查询数据详情
    searchBtnFn() {
      let param = {
        firstResult: 0,
        maxResult: 10,
        sortType: 1,
        videoId: this.searchVideoId
      };
      let callback = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData && res.data.responseObject.responseData.dataList && res.data.responseObject.responseData.dataList.length > 0) {
          this.listDatas = res.data.responseObject.responseData.dataList[0];
          this.descForm.videoName = this.listDatas.videoName;// 视频名称
          this.descForm.videoAuthor = this.listDatas.videoAuthor;// 作者
          this.descForm.playTime = this.listDatas.playTime;// 视频时长
          // 将视频锚点时间进行追加保存
          for (let i in this.listDatas.nodeList) {
            this.timesArr.push(this.listDatas.nodeList[i].nodeTime);
          }
        }
        else {
          this.listDatas = [];
          this.descForm.videoId = '';
          this.descForm.videoName = '';
          this.descForm.videoAuthor = '';
          this.descForm.playTime = '';
          this.searchVideoId = '';
        }
        this.$refs['descForm'].validateField('videoId');// 点击确认时进行校验输入的视频id是否正确
      };
      this.getListAxios(apiConfig.getVideoList.url, param, callback);
    },
    // 保存
    saveProductBtn(form) {
      // 判断视频id是否填写
      if (this.searchVideoId) {
        this.descForm.videoId = this.searchVideoId;
      }
      else {
        this.descForm.videoId = '';
      }
      // 判断如果添加产品列表里有数据则校验通过
      if (this.listDatas.nodeList && this.listDatas.nodeList.length > 0) {
        this.descForm.addPoint = 1;
      }
      else {
        this.descForm.addPoint = '';
      }
      this.$refs[form].validate((valid) => {
        if (valid) {
          // 循环锚点产品列表和时间数组
          for (let i in this.listDatas.nodeList) {
            for (let j in this.timesArr) {
              if (i === j) { // 当循环到相同的序号时，将时间数组中的值赋值给数组中的nodeTime，在保存时传入接口
                this.listDatas.nodeList[i].nodeTime = this.timesArr[j];
                if (i < j) { // 当循环超过自身，不用再继续，退出。
                  return;
                }
              }
            }
          }
          this.detailLists = [];
          this.detailLists = this.listDatas.nodeList;
          let param = {
            detailList: this.detailLists,
            opUserName: this.userLoginName,
            videoId: this.searchVideoId
          };
          let callback = (res) => {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              if (window.history.length <= 1) {
                this.$router.push({path: 'productAnchorPoint'});
                return false;
              }
              else {
                this.$router.go(-1);
              }
            }
          };
          this.getListAxios(apiConfig.getVideoListSave.url, param, callback, '保存失败，请重试！', apiConfig.getVideoListSave.type);
        }
        else {
          return false;
        }
      });
    },
    // 跳转回产品锚点页
    goBackProductPoint() {
      if (window.history.length <= 1) {
        this.$router.push({path: 'productAnchorPoint'});
        return false;
      }
      else {
        this.$router.go(-1);
      }
    },
    // 获取数据公共axios方法.
    getListAxios(path, params, callback, tipMsg, type, errorCallback) {
      comm.openLoading('加载中...');
      this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          this.axiosNum--;
          callback && callback(res);
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
      else {
        axios({
          method: 'get',
          url: path,
          params: params
        }).then((res) => {
          callback && callback(res);
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          this.axiosNum--;
          if (this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  watch: {
    // 监听弹层
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        this.templateRadio = '';// 如果弹层显示则将选中的radio进行移除。
        this.currentProduct = '';// 将选中项进行置空
      }
    }
  },
  mounted() {
    // 从导航上获取videoId参数
    let editVideoId = comm.getpara().videoId;
    this.descForm.videoId = editVideoId;
    this.searchVideoId = editVideoId;
    // 如果videoId存在则表示是编辑状态，首次进入进行获取详情
    if (editVideoId) {
      this.isEdit = true;// 表示是编辑
      this.searchBtnFn();
    }
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (this.dialogFormVisible) { // 表示是搜索产品列表页
          this.productName = this.descForm.product;// 产品名称
          this.brandName = this.descForm.brand;// 品牌名称
          this.addPointFn();
        }
        else { // 如果不是列表页并且是新建锚点的情况下
          if (!editVideoId) {
            this.searchVideoIdFn();
          }
        }
      }
    };
  },
  // 离开当前页面后执行
  destroyed: function() {
    comm.goBack();
  }
};
</script>
<style lang="scss">
  .productPointDescCont{
    width: 1200px;
    margin: 0 auto;
    background-color: #f6f7fa;
    .productPointDesc{
      font-size: 0;
      margin: 36px auto 36px;
      padding: 36px 0 5px;
      background: #ffffff;
      width: 1200px;
    }
    /*产品列表页*/
    .productLists{
      margin-bottom: 50px;
      .timeInput{
        display: inline-block;
        width: 55px;
      }
      .changeStateBotton{
        color: red;
        cursor: pointer;
        border: 1px solid red;
        padding: 6px 10px;
      }
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
    //返回按钮
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
    .addPoint{
      button{
        width: 83px;
        height: 32px;
        background: #edf1ff;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-weight: 400;
        color: #4b67d6;
        line-height: 12px;
        padding: 0;
      }
    }
    /*视频时长提示语句*/
    .videoPointTip{
      margin-left: 12px;
      font-size: 12px;
      color: #3846dc;
    }
  }
  .width300{
    width: 390px;
  }
  .el-dialog__body{
    .el-form-item{
      display: inline-block;
    }
    .searchBtn{
      width: 100px;
      height: 32px;
      background: #3846dc;
      border-radius: 3px;
      line-height: 32px;
      font-size: 14px;
      font-weight: 500;
      color: white;
      margin-left: 30px;
      cursor: pointer;
      display: inline-block;
      text-align: center;
    }
    .choosedProductTxt{
      display: inline-block;
      width: 656px;
      span{
        width: 656px;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        white-space: nowrap;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .bigImgShow{
      cursor: pointer;
    }
  }
  .el-table__body{
    .el-input__inner{
      height: 30px;
    }
  }
  /*页面中列表样式*/
  .el-table th.is-leaf div{
    font-weight: 600;
    color: #000;
  }
  .el-table .cell{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    white-space: nowrap;
  }
  /*去除input框type为number时上下箭头*/
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .el-input.is-disabled .el-input__inner{
    color: #606266;
  }
  .el-textarea.is-disabled .el-textarea__inner{
    color: #606266;
  }
  /*查看大图*/
  .tableBigImgDialog {
    font-size: 0;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);
    border-radius: 3px;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    width: auto;
    height: auto;
    z-index: 10;
    img {
      width:336px;
      height: 336px;
      vertical-align: top;
      display: inline-block;
    }
  }
  .nodeTimePoint{
    margin-right: 4px;
  }
</style>
