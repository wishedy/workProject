<template>
  <section class="currAdConent">
    <!--title位置-->
    <div class="TopTitle">首页 > 终端页广告管理</div>
    <!--筛选box区域-->
    <section class="currScreeningBox">
      <div class="currItem">
        <span class="titleName">广告id</span>
        <el-input class="txtInput" placeholder="广告id" v-model="searchForm.adId"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">广告名称</span>
        <el-input class="txtInput" placeholder="广告名称" v-model="searchForm.adName"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">广告类型</span>
        <el-select v-model="searchForm.adType">
          <el-option label="不限" value=""></el-option>
          <el-option :key="item.code" :value="item.code" v-for="item in typeList" :label="item.description"></el-option>
        </el-select>
      </div>
      <div class="currItem">
        <span class="titleName">投放作者id</span>
        <el-input class="txtInput" placeholder="输入用户id" v-model="searchForm.cId"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">投放作者名</span>
        <el-input class="txtInput" placeholder="输入用户名" v-model="searchForm.cName"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">投放标签</span>
        <el-select v-model="searchForm.proTag">
          <el-option label="不限" value=""></el-option>
          <el-option :key="item.propertyId" :value="item.propertyId" v-for="item in proTag" :label="item.propertyName"></el-option>
        </el-select>
      </div>
      <div class="currItem">
        <span class="titleName">添加时间</span>
        <el-date-picker
          v-model="searchForm.addTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="currItem">
        <span class="titleName">更新时间</span>
        <el-date-picker
          v-model="searchForm.updateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00','23:59:59']"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </div>
      <div class="currItem">
        <span class="titleName">状态</span>
        <el-select v-model="searchForm.state">
          <el-option label="不限" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
      </div>
      <aside class="btnBox">
        <p class="resetBtn" @click.stop="resetForm">清空条件</p>
        <p class="screeningBtn" @click.stop="submitForm">筛选</p>
      </aside>
    </section>
    <!--新建广告-->
    <el-button @click.stop="popupShowFn(1)" class="NewAd"><span class="el-icon-circle-plus"></span> 新增广告</el-button>
    <!--列表-->
    <section>
      <el-table
        ref="multipleTable"
        :data="tableData"
        @sort-change='tableSortChange'
        style="width: 100%;margin-bottom: 20px"
        :default-sort = "{prop: 'createAdTime', order: 'descending'}"
      >
        <el-table-column
          prop="advMaterialId"
          label="广告ID"
          width="130"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="adProfileName"
          label="广告名称"
          width="230"
        >
        </el-table-column>
        <el-table-column
          prop="resourceTypeName"
          label="广告类型"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="customerId"
          label="投放作者id"
          width="130"
          :formatter="formatCustomerId"
        >
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="投放作者名"
          width="130"
          :formatter="formatCustomerName"
        >
        </el-table-column>
        <el-table-column
          prop="propertyIds"
          label="投放标签"
          width="130"
          :formatter="propertyIdsFor"
        >
        </el-table-column>
        <el-table-column
          prop="clickCount"
          width="100"
          label="点击量"
          sortable="custom"
          :sort-orders="['descending','ascending']"
        >
        </el-table-column>
        <el-table-column
          prop="createAdTime"
          width="160"
          label="添加时间"
          sortable="custom"
          :sort-orders="['descending','ascending']"
          :formatter="dateForOne"
        >
        </el-table-column>
        <el-table-column
          prop="updateAdTime"
          width="160"
          label="更新时间"
          sortable="custom"
          :sort-orders="['descending','ascending']"
          :formatter="dateForTwo"
        >
        </el-table-column>
        <el-table-column
          prop="bannerImage"
          label="预览"
        >
          <template slot-scope="scope">
            <img
              src="/static/images/icons/icon-picture_hover_tiny.png"
              class="bigImgShow"
              alt=""
              v-if="scope.row.bannerImage"
              @mouseenter="smallImgMouseenter(scope.row)"
              @mouseleave="smallImgMouseLeave"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="isValid"
          label="状态"
          :formatter="isValidFor"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="210"
          label="操作"
          style="text-align: center"
        >
          <template slot-scope="scope">
            <el-button
              @keydown.native.prevent
              @click="popupShowFn(2,scope.row)"
              class="editBtn"
            >
              编辑
            </el-button>
            <!--downBtn 上线的状态 文字为 "下架"-->
            <el-button
              @keydown.native.prevent
              @click="upOrDownFn(scope.row)"
              class="changeStateBotton"
              :class="parseInt(scope.row.isValid) === 0 ? 'upBtn':'downBtn'"
            >
              {{parseInt(scope.row.isValid) === 0 ? "上架" : "下架"}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[ 20, 30, 50, 100]"
        :page-size="maxResult"
        layout="total, prev, pager, next, jumper, sizes"
        :total="totalNum">
      </el-pagination>
      <!--表格hover查看大图-->
      <div
        class="tableBigImgDialog"
        v-if="bigImgDialogVisible"
        @mouseenter="bigImgMouseenter"
        @mouseleave="bigImgMouseLeave"
      >
        <img
          :src="bigImgPath"
          class="terminalImg"
        >
        <span v-if="bigImgTitle" class="terminalTxt">{{bigImgTitle}}</span>
      </div>
    </section>
    <!--编辑弹层-->
    <el-dialog title="新增/编辑广告" :visible.sync="dialogFormVisible" width="770px">
      <el-form :model="descForm" :rules="descRules" ref="descForm">
        <el-form-item label="广告id" :label-width="formLabelWidth" prop="adId" class="adId">
          <el-input v-model="descForm.adId" class="NewOrEditAd" :disabled="isNewFlag?false:'disabled'" placeholder="请输入广告ID"></el-input>
          <el-button class="NewOrEditBtn" @click.stop="makeSureFn(1)" v-if="isNewFlag">确认</el-button>
        </el-form-item>
        <el-form-item label="广告名称" :label-width="formLabelWidth" prop="adName" class="adName">
          <el-input v-model="descForm.adName" v-if="isNewFlag" class="NewOrEditAd" placeholder="请输入广告名称"></el-input>
          <el-input v-model="descForm.adName" v-if="!isNewFlag" type="textarea" :rows="2" resize="none" class="NewOrEditAd" disabled="disabled"></el-input>
          <el-button class="NewOrEditBtn"  @click.stop="makeSureFn(2)" v-show="isNewFlag">确认</el-button>
        </el-form-item>
        <el-form-item label="顺序号" :label-width="formLabelWidth" prop="adNum">
          <el-input v-model="descForm.adNum" placeholder="请输入顺序号"></el-input>
        </el-form-item>
        <el-form-item label="所属类型" :label-width="formLabelWidth" prop="region">
          <el-input v-model="descForm.region" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="资源id" :label-width="formLabelWidth" prop="resourceId" v-show="descForm.resourceType!=18">
          <el-input v-model="descForm.resourceId" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="1035：216配图" prop="imgUrl" :label-width="formLabelWidth" class="imgUrl">
          <img class="adImg1035_216" :src="descForm.imgUrl" alt="">
          <span class="tipTxt">适用于病例、文库、视频终端页</span>
        </el-form-item>
        <el-form-item label="定向作者id" :label-width="formLabelWidth" prop="customerId">
          <el-input v-model="descForm.customerId" placeholder="输入需投放的作者id"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: -82px;"  :label-width="formLabelWidth" prop="proTag">
          <span style="color:red;margin-right: 5px;">*</span><span style="margin-right:10px">定向标签</span>
          <el-select v-model="descForm.proTag" multiple>
            <el-option label="不限" value=""></el-option>
            <el-option v-for="item in proTag" :key="item.propertyId" :value="item.propertyId" :label="item.propertyName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址" :label-width="formLabelWidth" prop="linkUrl" v-show="descForm.resourceType==18">
          <el-input v-model="descForm.linkUrl" disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.stop="publishFn('descForm')">发  布</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
/**
   * CRM 管理后台，首页广告管理/终端页广告管理
   * 注意事项：课程管理、推荐管理、直播管理、菁英会管理共用一个sass文件，修改时需要注意会不会影响其他样式，功能相似
   * author:zhanghongda
   * create-time:2019.04.17
   * 产品版本：新后台系统v1.7.0（大版本3.7）
   * 功能信息：
   *  1，列表展示
   *  2，列表筛选、排序
   *  3，添加新的广告
   *  4，修改已存在的广告，根据广告id/广告名称修改广告顺序号、上下架操作
   *  5，无335:100配图时提示不可进行添加，有添加提示（该广告无对应比例配图，无法发布）
   */
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
export default {
  data() {
    return {
      // 筛选项里面选的内容
      searchForm: {
        adId: '', // 广告id
        adName: '', // 广告名称
        adType: '', // 广告类型
        adNum: '', // 顺序号
        updateTime: '', // 更新时间
        addTime: '', // 添加时间
        state: '', // 状态
        proTag: '', // 投放标签
        cName: '', // 投放作者名称
        cId: '' // 投放作者id
      },
      // 真正使用的筛选条件
      searchFormSub: {
        adId: '', // 广告id
        adName: '', // 广告名称
        adType: '', // 广告类型
        adNum: '', // 顺序号
        updateTime: '', // 更新时间
        addTime: '', // 添加时间
        state: '', // 状态
        proTag: '', // 投放标签
        cName: '', // 投放作者名称
        cId: '' // 投放作者id
      },
      ruleForm: {}, // 广告编辑
      rules: {},
      axiosNum: 0, // 请求的个数，用来控制loading
      totalNum: 0, // 数据总数
      currentPage: 1, // 当前页
      firstResult: 0, // 第一条索引
      maxResult: 20, // 每页几条
      pageSize: 20, // 每页几条(分页组件)
      tableData: [], // 列表数据
      bigImgDialogVisible: false, // 是否显示查看大图
      dialogFormVisible: false, // 是否显示广告编辑弹层
      descForm: {// 广告详情里面的内容
        adId: '', // 广告id
        region: '', // 所属类型名称
        resourceType: '', // 广告类型id
        adName: '', // 广告名称
        adNum: '', // 顺序号
        resourceId: '', // 资源id
        linkUrl: '', // 链接地址
        adSureId: '', // 确认后的广告id
        adSureName: '', // 确认后的广告名称
        imgUrl: '', // 图片的链接地址
        imgType: '', // 图片的类型
        advMaterialId: '', // 物料id
        proTag: '', // 定向标签
        customerId: '' // 定向id
      },
      descFormSub: { // 真正提交的内容
        adId: '', // 广告id
        adName: '', // 广告名称
        adNum: '', // 顺序号
        proTag: '', // 定向标签
        customerId: '' // 定向id
      },
      descRules: { // 提交发布时进行校验顺序号
        adNum: [
          {required: true, message: '请填写顺序号', trigger: 'change'}
        ],
        adId: [
          {required: true, message: '广告id输入有误，请重新输入', trigger: 'change'}
        ],
        adName: [
          {required: true, message: '广告名称输入有误，请重新输入', trigger: 'change'}
        ],
        imgUrl: [
          {required: true, message: '该广告无对应比例配图，无法发布', trigger: 'change'}
        ],
        customerId: [
          {required: true, message: '定向作者id、定向标签至少有一个填写才可发布', trigger: 'change'}
        ],
        proTag: [
          {required: false, message: '定向作者id、定向标签至少有一个填写才可发布', trigger: 'change'}
        ]
      },
      formLabelWidth: '120px',
      addSearchId: '', // 通过v-molule，将输入的广告ID进行存储，并进行请求
      addSearchName: '', // 通过v-molule，将输入的广告名字进行存储，并进行请求
      isNewFlag: false, // 是否是点击了新建按钮进行显示详情
      typeList: [], // 获取新广告类型列表
      bigImgTitle: '', // 图片title
      bigImgType: '', // 图片类型，用于获取图片高度用于下方的文字top值
      sortBy: '4', // 排序字段：1:物料添加时间、2:广告ID，3:物料更新时间、4:广告添加时间，5:顺序号，6:点击量，7:广告更新时间。
      asc: '1', // 0:正序，1:倒叙。默认1 倒叙
      isClickIdBtn: false, // 是点击了确认按钮
      proTag: [], // 投放标签
      recommendType: 6, // 广告类型
      propertyTypeId: 8 // -专业标签
    };
  },
  methods: {
    formatCustomerId(row) {
      return !row.customerId ? '-' : row.customerId;
    },
    formatCustomerName(row) {
      return !row.customerName ? '-' : row.customerName;
    },
    getImageList(imageList, type) {
      let tempImgUrl = '';
      if (imageList.length === 0) return '';
      imageList.forEach((item) => {
        if (item.imageType === type) {
          tempImgUrl = item.imageUrl;
        }
      });
      return tempImgUrl;
    },
    // 表格图片hover事件
    smallImgMouseenter(row) {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      if (row.bannerImage !== '') {
        this.bigImgDialogVisible = true;
        this.bigImgPath = row.bannerImage;
        this.bigImgType = row.resourceType;
        this.bigImgTitle = row.resourceName;
        this.$forceUpdate();// 强制让dom刷新
      }
      else {
        this.bigImgPath = '';
        this.bigImgType = '';
        this.bigImgTitle = '';
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
    // 点击新增/编辑广告
    popupShowFn(type, row) { // type:区分新建（1）还是编辑（2），新建有确认按钮，编辑没有。
      this.dialogFormVisible = true;// 弹层显示
      this.isNewFlag = true;
      if (type === 1) { // 如果是新建则将所有数据进行初始化
        if (this.$refs.descForm) {
          this.$refs.descForm.resetFields();
        }

        this.descForm.resourceType = '';// 在重新获取数据时初始化不能冲掉已经显示的链接跳转的显示样式
        this.descFormSub.adId = '';
        this.descFormSub.adName = '';
        this.descFormSub.adNum = '';
      }
      else { // 编辑则将数据进行
        setTimeout(function() {
          // 加入进行清空所有form，不加335:100配图错误提示不消失
          if (this.$refs.descForm) {
            this.$refs.descForm.resetFields();
          }
          this.isNewFlag = false;// 编辑--不显示确认按钮
          //    获取到的数据进行保存
          this.descForm.id = row.id; // 广告id ?
          this.descForm.adId = row.advMaterialId;// 广告id
          this.descForm.region = row.resourceType === 1 || row.resourceType === 2 || row.resourceType === 7 ? '单篇内容' : row.resourceTypeName; // 所属类型
          this.descForm.advMaterialId = row.advMaterialId; // 物料id
          this.descForm.resourceType = row.resourceType; // 广告类型id
          this.descForm.adName = row.adProfileName; // 广告名称
          this.descForm.adNum = row.sortId; // 顺序号
          this.descForm.resourceId = row.resourceId; // 资源id
          this.descForm.linkUrl = row.linkUrl; // 链接地址
          this.descForm.imgUrl = row.bannerImage; // 图片地址
          this.descForm.imgType = row.resourceType; // 资源类型
          this.descForm.customerId = !row.customerId ? '' : row.customerId; // 定向作者id
          this.descForm.proTag = this.handleProTag(row.propertyIds); // 定向标签
          // 提交的内容
          this.descFormSub.adId = row.id; // row.advMaterialId;// 广告id
          this.descFormSub.adNum = this.descForm.adNum; // 顺序号可以改变
          this.descFormSub.adName = row.adProfileName;// 广告名称
        }.bind(this), 0);
        this.$forceUpdate();// 强制让dom刷新
      }
    },
    handleProTag(ids) {
      let proTag = [];
      if (ids === '') return []; else ids = ids.split(',');

      ids.forEach((item) => {
        this.proTag.forEach((item2) => {
          if (parseInt(item) === item2.propertyId) {
            proTag.push(item2.propertyId);
          }
        });
      });

      return proTag;
    },
    // 筛选点击
    submitForm() {
      // 点击筛选后将已经选择的项进行赋值，并筛选；为的是在修改了筛选条件但是没有点击筛选按钮情况下进行分页等操作数据显示问题。
      this.searchFormSub.adId = this.searchForm.adId; // 广告id
      this.searchFormSub.adName = this.searchForm.adName; // 广告名称
      this.searchFormSub.adType = this.searchForm.adType; // 广告类型
      this.searchFormSub.cId = this.searchForm.cId; // 投放标签
      this.searchFormSub.cName = this.searchForm.cName; // 投放标签
      this.searchFormSub.proTag = this.searchForm.proTag; // 投放标签
      this.searchFormSub.addTime = this.searchForm.addTime; // 添加时间
      this.searchFormSub.updateTime = this.searchForm.updateTime; // 更新时间
      this.searchFormSub.state = this.searchForm.state; // 状态

      this.firstResult = 0;
      this.currentPage = 1;
      this.getListFn();
    },
    // 清空筛选
    resetForm() {
      this.searchForm.adId = ''; // 广告id
      this.searchForm.adName = ''; // 广告名称
      this.searchForm.adType = ''; // 广告类型
      this.searchForm.cId = ''; // 作者id
      this.searchForm.cName = ''; // 作者民称
      this.searchForm.proTag = ''; // 定向标签
      this.searchForm.addTime = ''; // 添加时间
      this.searchForm.updateTime = ''; // 更新时间
      this.searchForm.state = ''; // 状态
    },
    // 点击确认按钮
    makeSureFn(type) {
      if (type === 1) { // 表示是通过id检索
        let reg = /^[\d]/g;
        if (this.descForm.adId && reg.test(this.descForm.adId)) { // 校验是否为空
          this.descFormSub.adName = ''; // 广告名称
          this.descFormSub.adId = this.descForm.adId; // 广告id
          this.descFormSub.adNum = this.descForm.adNum; // 顺序号可以改变
          this.descFormSub.customerId = this.descForm.customerId;
          this.descFormSub.proTag = this.descForm.proTag;
          this.getDescFn();
        }
        else {
          if (this.$refs.descForm) {
            this.$refs.descForm.resetFields();
          }
          this.$refs['descForm'].validateField('adId', () => {});
          return false;
        }
      }
      else { // 表示是通过名称检索
        if (this.descForm.adName) {
          this.descFormSub.adId = ''; // 广告id
          this.descFormSub.adNum = this.descForm.adNum; // 顺序号可以改变
          this.descFormSub.adName = this.descForm.adName; // 广告名称
          this.descFormSub.customerId = this.descForm.customerId;
          this.descFormSub.proTag = this.descForm.proTag;
          this.getDescFn();
        }
        else {
          if (this.$refs.descForm) {
            this.$refs.descForm.resetFields();
          }
          this.$refs['descForm'].validateField('adName', () => {});
          return false;
        }
      }
    },
    // 点击发布按钮
    publishFn(formName) {
      // 校验
      if ((parseInt(this.descForm.customerId) === 0 ||
        this.descForm.customerId === '') &&
        this.descForm.proTag.length === 0) {
        this.$message.error('发布失败请重试');
        return false;
      }

      this.descForm.adId = this.descFormSub.adId;
      this.descForm.adName = this.descFormSub.adName;
      if ((this.descForm.customerId !== '' && parseInt(this.descForm.customerId) !== 0) || this.descForm.proTag.length > 0) {
        this.descFormSub.customerId = this.descForm.customerId;
        this.descFormSub.proTag = this.descForm.proTag;
        if (this.descForm.customerId !== '' && parseInt(this.descForm.customerId) !== 0) {
          this.descForm.proTag = ' ';
        }
        else {
          this.descForm.customerId = ' ';
        }
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let tagArr = '';
          for (let i in this.descFormSub.proTag) {
            tagArr += this.descFormSub.proTag[i] + ',';
          }

          if (tagArr.length > 0) tagArr = tagArr.substring(0, tagArr.length - 1);

          let params = {
            id: this.descForm.id, // id
            advMaterialId: this.descForm.advMaterialId, // 物料id
            adProfileName: this.descFormSub.adName, // 广告名称
            resourceType: this.descForm.resourceType, // 广告类型ID
            resourceId: this.descForm.resourceId, // 资源ID
            recommendType: this.recommendType, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告。新增广告的时候必须传入）
            state: 1, // 1:保存广告信息。不传，表示保存物料信息
            sortId: this.descForm.adNum, // 顺序号
            customerId: this.descFormSub.customerId,
            propertyIds: tagArr
          };

          let callbacks = (res) => {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.dialogFormVisible = false; // 弹层显示
              this.firstResult = 0;
              this.currentPage = 1;
              this.descFormSub.adId = ''; // 将已经提交的数据初始化
              this.descFormSub.adName = '';
              this.getListFn();
            }
            else {
              this.dialogFormVisible = false; // 弹层显示
              this.$message.error('发布失败请重试');
            }
          };
          this.getListAxios(apiConfig.cmsAdvertisementSave.url, params, callbacks, '操作失败，请刷新重试', apiConfig.cmsAdvertisementSave.type);
        }
        else {
          console.log('submit error!');
          return false;
        }
      });
    },
    // 上架/下架点击，进行更新列表数据
    upOrDownFn(row) {
      let contentMsg = '';
      if (parseInt(row.isValid) === 1) {
        contentMsg = '确定将此条广告下架么？';
      }
      else {
        contentMsg = '确定将此条广告上架么？';
      }
      this.$allin_confirm({
        title: '提示',
        content: contentMsg,
        done: () => {
          let params = {
            id: row.id, // 广告id
            advMaterialId: row.advMaterialId, // 物料id
            adProfileName: row.adProfileName, // 广告名称
            resourceType: row.resourceType, // 广告类型ID
            resourceId: row.resourceId, // 资源ID
            recommendType: this.recommendType, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告。新增广告的时候必须传入）
            state: 1, // 1:保存广告信息。不传，表示保存物料信息
            sortId: row.sortId, // 顺序号
            isValid: row.isValid === 0 ? 1 : 0,
            customerId: row.customerId,
            propertyIds: row.propertyIds
          };

          let callbacks = (res) => {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.dialogFormVisible = false;// 弹层显示
              this.firstResult = 0;
              this.currentPage = 1;
              this.getListFn();
            }
          };
          this.getListAxios(apiConfig.cmsAdvertisementSave.url, params, callbacks, '操作失败，请刷新重试', apiConfig.cmsAdvertisementSave.type);
        }
      });
    },
    // 筛选点击更改列表数据
    tableSortChange(column) {
      this.currentPage = 1; // 回退到第一页
      this.firstResult = 0;
      if (column.prop === 'advMaterialId') {
        this.sortBy = 2;
      }
      else if (column.prop === 'sortId') {
        this.sortBy = 5;
      }
      else if (column.prop === 'clickCount') {
        this.sortBy = 6;
      }
      else if (column.prop === 'createAdTime') {
        this.sortBy = 4;
      }
      else if (column.prop === 'updateAdTime') {
        this.sortBy = 7;
      }
      this.asc = column.order === 'ascending' ? 0 : 1;
      this.getListFn();// 在改变排序类型时请求数据，同时初始化时，默认时间逆序故也在此调用了，用作数据初始化
    },
    // 获取列表数据
    getListFn() {
      // 传入的参数全部为点击筛选之后的参数
      let param = {
        recommendType: this.recommendType, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告, 6:终端页广告)

        id: this.searchFormSub.adId && this.searchFormSub.adId.length > 0 ? this.searchFormSub.adId : undefined,
        adProfileName: this.searchFormSub.adName && this.searchFormSub.adName.length > 0 ? this.searchFormSub.adName : undefined, // 广告名称
        resourceType: this.searchFormSub.adType ? this.searchFormSub.adType : undefined, // 广告类型(1:视频，2:文库，7:病例，3:骨科会议，10：单篇内容，11:菁英汇直播，12:锦囊，13:个人主页，14:课程栏目，15:视频栏目，16:专题，17:活动，18:跳转)
        customerId: this.searchFormSub.cId ? this.searchFormSub.cId : undefined, // 定向作者id
        customerName: this.searchFormSub.cName ? this.searchFormSub.cName : undefined, // 定向作者名称
        propertyId: this.searchFormSub.proTag ? this.searchFormSub.proTag : undefined, // 定向标签
        createStartTime: this.searchFormSub.addTime ? this.searchFormSub.addTime[0].substring(0, 10) : undefined, // 创建起始时间
        createEndTime: this.searchFormSub.addTime ? this.searchFormSub.addTime[1].substring(0, 10) : undefined, // 创建结束时间
        updateStartTime: this.searchFormSub.updateTime ? this.searchFormSub.updateTime[0].substring(0, 10) : undefined, // 更新建起始时间
        updateEndTime: this.searchFormSub.updateTime ? this.searchFormSub.updateTime[1].substring(0, 10) : undefined, // 更新结束时间
        isValid: this.searchFormSub.state && this.searchFormSub.state.length > 0 ? this.searchFormSub.state : undefined, // 状态(1：上架，0:下架）默认为1
        state: 1, // 1:表示查询广告不传或者传入null表示查询物料
        sortBy: this.sortBy, // 排序字段：1:物料添加时间、2:广告ID，3:物料更新时间、4:广告添加时间，5:顺序号，6:点击量，7:广告更新时间。物料查询时默认物料添加时间，广告查询时默认广告添加时间
        asc: this.asc, // 0:正序，1:倒叙。默认1 倒叙
        sortId: this.searchFormSub.adNum && this.searchFormSub.adNum.length > 0 ? this.searchFormSub.adNum : undefined, // 顺序号
        firstResult: this.firstResult,
        maxResult: this.maxResult,
        queryLike: 1 // 模糊查询
      };

      let callbacks = (res) => { // 汇报的角度,自己的话题
        this.tableData = res.data.responseObject.items;
        this.tableData.map((item) => {
          item.bannerImage = this.getImageList(item.imageList, 2);
        });
        this.totalNum = res.data.responseObject.totalCount;
      };

        // this.getListAxios('/mock/cmsAdvertisement/getAdList',param,callbacks)
      this.getListAxios(apiConfig.getAdList.url, param, callbacks);
    },
    // 获取资源详情页
    getDescFn() {
      // 传入id/name进行查询详情
      let param = {
        id: this.descFormSub.adId ? this.descFormSub.adId : undefined,
        adProfileName: this.descFormSub.adName ? this.descFormSub.adName : undefined, // 广告名称
        recommendType: this.recommendType // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告)
      };
      let callbacks = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items.length > 0) {
          let row = res.data.responseObject.items[0];
          this.descForm.adId = row.id; // 广告id
          this.descForm.advMaterialId = row.advMaterialId; // 物料id
          this.descForm.region = row.resourceType === 1 || row.resourceType === 2 || row.resourceType === 7 ? '单篇内容' : row.resourceTypeName; // 所属类型
          this.descForm.resourceType = row.resourceType; // 广告类型id
          this.descForm.adName = row.adProfileName; // 广告名称
          this.descForm.adNum = row.sortId; // 顺序号
          this.descForm.resourceId = row.resourceId; // 资源id
          this.descForm.linkUrl = row.linkUrl; // 链接地址
          this.descForm.imgUrl = this.getImageList(row.imageList, 2); // 图片链接地址
          // 提交的内容
          this.descFormSub.adId = row.id; // 广告id
          this.descFormSub.adNum = this.descForm.adNum; // 顺序号可以改变
          this.descFormSub.adName = row.adProfileName; // 广告名称
          // 在没有banner图时点击发布，弹出提示。再次更换带有banner图的物料进行获取数据，此时提示应消失。（在有图片存在时将提示隐藏即校验）
          if (this.descForm.imgUrl) {
            this.$refs.descForm.validateField('imgUrl'); // 校验图片
          }
        }
        else {
          if (this.descFormSub.adName) { // 如果名称不为空，则表示是进行了名字的检索
            this.$refs.descForm.resetFields();
            this.descForm.adName = '';
            this.$refs['descForm'].validateField('adName', () => {});
          }
          else { // 如果id不为空，则表示是进行了id的检索
            this.$refs.descForm.resetFields();
            this.descForm.adId = '';
            this.$refs['descForm'].validateField('adId', () => {});
          }
        }
      };
      this.getListAxios(apiConfig.getAdMaterialList.url, param, callbacks);
    },
    // 状态formatter
    isValidFor(val) {
      if (val.isValid === 1) {
        return '已上架';
      }
      else {
        return '已下架';
      }
    },
    // 时间格式修改
    dateForOne(val) {
      if (val.createAdTime) {
        return val.createAdTime.substring(0, 19);
      }
    },
    // 时间格式修改
    dateForTwo(val) {
      if (val.updateAdTime) {
        return val.updateAdTime.substring(0, 19);
      }
    },
    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.maxResult = val;
      this.currentPage = 1; // 当前页
      this.firstResult = 0; // 第一条索引
      this.getListFn();
    },
    // 修改当前页码
    handleCurrentChange(val) {
      this.firstResult = (val - 1) * this.pageSize;
      this.currentPage = val;
      this.getListFn();
    },
    // 获取新广告类型列表
    getAdTypeList() {
      let param = {};
      let callbacks = (res) => {
        this.typeList = res.data.responseObject;
      };
      this.getListAxios(apiConfig.getAdTypeList.url, param, callbacks);
    },
    // 获取定向标签
    getProfessionalTags() {
      let param = {
        propertyTypeId: this.propertyTypeId
      };
      let callbacks = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items) {
          this.proTag = res.data.responseObject.items;
        }
      };
      this.getListAxios(apiConfig.getProfessionalTags.url, param, callbacks);
    },
    // 定向标签formatter
    propertyIdsFor(val) {
      if (val && val.propertyIds) {
        let tagArr = val.propertyIds.split(',');
        let tagName = '';
        for (let i in tagArr) {
          for (let j in this.proTag) {
            if (parseInt(this.proTag[j].propertyId) === parseInt(tagArr[i])) {
              tagName += this.proTag[j].propertyName + '、';
            }
          }
        }

        return tagName.substring(0, tagName.length - 1);
      }
      else {
        return '-';
      }
    },
    // 获取数据公共方法
    getListAxios(path, params, callback, tipMsg, type, errorCallback) {
      let _this = this;
      comm.openLoading('加载中...');
      _this.axiosNum++;
      if (type === 'post') {
        axios({
          method: 'post',
          url: path,
          data: params
        }).then((res) => {
          _this.axiosNum--;
          callback && callback(res);
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
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
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
        }).catch((e) => {
          errorCallback && errorCallback();
          _this.axiosNum--;
          if (_this.axiosNum <= 0) {
            comm.closeLoading();
          }
          this.$allin_confirm({title: '提示', content: tipMsg || '获取失败，请刷新重试', type: 'notice'});
          console.log('获取数据失败：', e);
        });
      }
    }
  },
  mounted() {
    // this.getListFn(); // 列表页
    this.getAdTypeList(); // 广告类型
    this.getProfessionalTags(); // 定向标签
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible) {
          this.submitForm(); // 触发提交按钮
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
  @import "../../assets/scss/pages/advertisementManage/advertisement";
</style>
