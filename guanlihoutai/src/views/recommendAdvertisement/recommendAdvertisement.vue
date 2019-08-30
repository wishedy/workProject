<template>
  <section class="currAdConent">
    <!--title位置-->
    <div class="TopTitle">首页 > 推荐广告管理</div>
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
        <span class="titleName">顺序号</span>
        <el-input class="txtInput" placeholder="顺序号" v-model="searchForm.adNum"></el-input>
      </div>
      <div class="currItem">
        <span class="titleName">点击量</span>
        <el-input class="txtInput" placeholder="点击量最小" v-model="searchForm.adCliNumMin"></el-input>
        ——
        <el-input class="txtInput" placeholder="点击量最大" v-model="searchForm.adCliNumMax"></el-input>
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
          prop="sortId"
          label="顺序号"
          width="126"
          class="line-clamp-3"
          sortable="custom"
          :sort-orders="['descending','ascending']"
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
          prop="resourceImageUrl"
          label="预览"
        >
          <template slot-scope="scope">
            <img
              src="/static/images/icons/icon-picture_hover_tiny.png"
              class="bigImgShow"
              alt=""
              v-if="scope.row.resourceImageUrl"
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
          alt=""
          :style="{height:bigImgTypeFn(bigImgType)}"
        >
        <span v-if="bigImgTitle" :style="{top:bigImgTypeFn(bigImgType)}">{{bigImgTitle}}</span>
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
          <el-input v-model="descForm.adName" v-if="isNewFlag" class="NewOrEditAd" :disabled="isNewFlag?false:'disabled'" placeholder="请输入广告名称"></el-input>
          <el-input v-model="descForm.adName" v-if="!isNewFlag" type="textarea" :rows="2" resize="none" class="NewOrEditAd" :disabled="isNewFlag?false:'disabled'"></el-input>
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
        <el-form-item label="配图" prop="imgUrl" :label-width="formLabelWidth">
          <img :class="{
          adImg212:(descForm.imgType==1||descForm.imgType==2||descForm.imgType==3||descForm.imgType==7||descForm.imgType==12||descForm.imgType==16||descForm.imgType==17||descForm.imgType==10||descForm.imgType===20||descForm.imgType==''),
          adImg336:(descForm.imgType==11||descForm.imgType==13||descForm.imgType==14||descForm.imgType==15||descForm.imgType===19),
          adImg464:(descForm.imgType==18)
        }"
               :src="descForm.imgUrl" alt="">
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
   * CRM 管理后台，首页广告管理——直播管理
   * 注意事项：课程管理、推荐管理、直播管理共用一个sass文件，修改时需要注意会不会影响其他样式，功能相同
   * author:zhanghongda
   * create-time:2019.02.11
   * 产品版本：新后台系统v1.5.0（大版本3.4）
   * 功能信息：
   *  1，列表展示
   *  2，列表筛选、排序
   *  3，添加新的广告
   *  4，修改已存在的广告，根据广告id/广告名称修改广告顺序号、上下架操作
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
        adCliNum: '', // 点击量
        adCliNumMin: '',
        adCliNumMax: '',
        updateTime: '', // 更新时间
        addTime: '', // 添加时间
        state: ''// 状态
      },
      // 真正使用的筛选条件
      searchFormSub: {
        adId: '', // 广告id
        adName: '', // 广告名称
        adType: '', // 广告类型
        adNum: '', // 顺序号
        adCliNum: '', // 点击量
        adCliNumMin: '',
        adCliNumMax: '',
        updateTime: '', // 更新时间
        addTime: '', // 添加时间
        state: ''// 状态
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
        advMaterialId: ''// 物料id
      },
      descFormSub: {// 真正提交的内容
        adId: '', // 广告id
        adName: '', // 广告名称
        adNum: ''// 顺序号
      },
      descRules: {// 提交发布时进行校验顺序号
        adNum: [
          {required: true, message: '请填写顺序号', trigger: 'change'}
        ],
        adId: [
          {required: true, message: '广告id输入有误，请重新输入', trigger: 'change'}
        ],
        adName: [
          {required: true, message: '广告名称输入有误，请重新输入', trigger: 'change'}
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
      isClickIdBtn: false// 是点击了确认按钮
    };
  },
  methods: {
    // 表格图片hover事件
    smallImgMouseenter(row) {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      if (row.resourceImageUrl) {
        this.bigImgDialogVisible = true;
        this.bigImgPath = row.resourceImageUrl;
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
          this.isNewFlag = false;// 编辑--不显示确认按钮
          //    获取到的数据进行保存
          this.descForm.adId = row.advMaterialId;// 广告id
          this.descForm.region = row.resourceType === 1 || row.resourceType === 2 || row.resourceType === 7 ? '单篇内容' : row.resourceTypeName;// 所属类型
          this.descForm.advMaterialId = row.advMaterialId;// 物料id
          this.descForm.resourceType = row.resourceType;// 广告类型id
          this.descForm.adName = row.adProfileName;// 广告名称
          this.descForm.adNum = row.sortId;// 顺序号
          this.descForm.resourceId = row.resourceId;// 资源id
          this.descForm.linkUrl = row.linkUrl;// 链接地址
          this.descForm.imgUrl = row.resourceImageUrl;// 链接地址
          this.descForm.imgType = row.resourceType;// 资源类型
          // 提交的内容
          this.descFormSub.adId = row.advMaterialId;// 广告id
          this.descFormSub.adNum = this.descForm.adNum;// 顺序号可以改变
          this.descFormSub.adName = row.adProfileName;// 广告名称
        }.bind(this), 0);
      }
    },
    // 筛选点击
    submitForm() {
      // 点击筛选后将已经选择的项进行赋值，并筛选；为的是在修改了筛选条件但是没有点击筛选按钮情况下进行分页等操作数据显示问题。
      this.searchFormSub.adId = this.searchForm.adId;// 广告id
      this.searchFormSub.adName = this.searchForm.adName;// 广告名称
      this.searchFormSub.adType = this.searchForm.adType;// 广告类型
      this.searchFormSub.adNum = this.searchForm.adNum;// 顺序号
      this.searchFormSub.adCliNum = this.searchForm.adCliNum;// 点击量
      this.searchFormSub.adCliNumMax = this.searchForm.adCliNumMax;// 点击量最大
      this.searchFormSub.adCliNumMin = this.searchForm.adCliNumMin;// 点击量最小
      this.searchFormSub.updateTime = this.searchForm.updateTime;// 更新时间
      this.searchFormSub.addTime = this.searchForm.addTime;// 添加时间
      this.searchFormSub.state = this.searchForm.state;// 状态
      this.firstResult = 0;
      this.currentPage = 1;
      this.getListFn();
    },
    // 清空筛选
    resetForm() {
      this.searchForm.adId = '';// 广告id
      this.searchForm.adName = '';// 广告名称
      this.searchForm.adType = '';// 广告类型
      this.searchForm.adNum = '';// 顺序号
      this.searchForm.adCliNumMin = '';// 点击量
      this.searchForm.adCliNumMax = '';// 点击量
      this.searchForm.updateTime = '';// 更新时间
      this.searchForm.addTime = '';// 添加时间
      this.searchForm.state = '';// 状态
    },
    // 点击确认按钮
    makeSureFn(type) {
      if (type === 1) { // 表示是通过id检索
        let reg = /^[\d]/g;
        if (this.descForm.adId && reg.test(this.descForm.adId)) { // 校验是否为空
          this.descFormSub.adName = '';// 广告名称
          this.descFormSub.adId = this.descForm.adId;// 广告id
          this.descFormSub.adNum = this.descForm.adNum;// 顺序号可以改变
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
          this.descFormSub.adId = '';// 广告id
          this.descFormSub.adNum = this.descForm.adNum;// 顺序号可以改变
          this.descFormSub.adName = this.descForm.adName;// 广告名称
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
      this.descForm.adId = this.descFormSub.adId;
      this.descForm.adName = this.descFormSub.adName;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            // id:this.descFormSub.adId,//广告id
            advMaterialId: this.descForm.advMaterialId, // 物料id
            adProfileName: this.descFormSub.adName, // 广告名称
            resourceType: this.descForm.resourceType, // 广告类型ID
            resourceId: this.descForm.resourceId, // 资源ID
            recommendType: 1, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告。新增广告的时候必须传入）
            state: 1, // 1:保存广告信息。不传，表示保存物料信息
            sortId: this.descForm.adNum// 顺序号
          };
          let callbacks = (res) => {
            if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
              this.dialogFormVisible = false;// 弹层显示
              this.firstResult = 0;
              this.currentPage = 1;
              this.descFormSub.adId = '';// 将已经提交的数据初始化
              this.descFormSub.adName = '';
              this.getListFn();
            }
            else {
              this.dialogFormVisible = false;// 弹层显示
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
            recommendType: 1, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告。新增广告的时候必须传入）
            state: 1, // 1:保存广告信息。不传，表示保存物料信息
            sortId: row.sortId, // 顺序号
            isValid: row.isValid === 0 ? 1 : 0
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
        id: this.searchFormSub.adId && this.searchFormSub.adId.length > 0 ? this.searchFormSub.adId : undefined,
        adProfileName: this.searchFormSub.adName && this.searchFormSub.adName.length > 0 ? this.searchFormSub.adName : undefined, // 广告名称
        recommendType: 1, // 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告)
        resourceType: this.searchFormSub.adType ? this.searchFormSub.adType : undefined, // 广告类型(1:视频，2:文库，7:病例，3:骨科会议，10：单篇内容，11:菁英汇直播，12:锦囊，13:个人主页，14:课程栏目，15:视频栏目，16:专题，17:活动，18:跳转)
        createStartTime: this.searchFormSub.addTime ? this.searchFormSub.addTime[0].substring(0, 10) : undefined, // 创建起始时间
        createEndTime: this.searchFormSub.addTime ? this.searchFormSub.addTime[1].substring(0, 10) : undefined, // 创建结束时间
        updateStartTime: this.searchFormSub.updateTime ? this.searchFormSub.updateTime[0].substring(0, 10) : undefined, // 更新建起始时间
        updateEndTime: this.searchFormSub.updateTime ? this.searchFormSub.updateTime[1].substring(0, 10) : undefined, // 更新结束时间
        state: 1, // 1:表示查询广告不传或者传入null表示查询物料
        sortBy: this.sortBy, // 排序字段：1:物料添加时间、2:广告ID，3:物料更新时间、4:广告添加时间，5:顺序号，6:点击量，7:广告更新时间。物料查询时默认物料添加时间，广告查询时默认广告添加时间
        asc: this.asc, // 0:正序，1:倒叙。默认1 倒叙
        sortId: this.searchFormSub.adNum && this.searchFormSub.adNum.length > 0 ? this.searchFormSub.adNum : undefined, // 顺序号
        isValid: this.searchFormSub.state && this.searchFormSub.state.length > 0 ? this.searchFormSub.state : undefined, // 状态(1：上架，0:下架）默认为1
        clickCountMin: this.searchFormSub.adCliNumMin && this.searchFormSub.adCliNumMin.length > 0 ? this.searchFormSub.adCliNumMin : undefined, // 起始点击数
        clickCountMax: this.searchFormSub.adCliNumMax && this.searchFormSub.adCliNumMax.length > 0 ? this.searchFormSub.adCliNumMax : undefined, // 截止点击数
        firstResult: this.firstResult,
        maxResult: this.maxResult,
        queryLike: 1// 模糊查询
      };
      let callbacks = (res) => {
        this.tableData = res.data.responseObject.items;
        this.totalNum = res.data.responseObject.totalCount;
      };
      this.getListAxios(apiConfig.getAdList.url, param, callbacks);
    },
    // 获取资源详情页
    getDescFn() {
      // 传入id/name进行查询详情
      let param = {
        id: this.descFormSub.adId ? this.descFormSub.adId : undefined,
        adProfileName: this.descFormSub.adName ? this.descFormSub.adName : undefined, // 广告名称
        recommendType: 1// 首页推荐类型(1:推荐广告，2:课程广告，3:直播广告)
      };
      let callbacks = (res) => {
        if (res && res.data && res.data.responseObject && res.data.responseObject.items.length > 0) {
          let row = res.data.responseObject.items[0];
          this.descForm.adId = row.id;// 广告id
          this.descForm.advMaterialId = row.advMaterialId;// 物料id
          this.descForm.region = row.resourceType === 1 || row.resourceType === 2 || row.resourceType === 7 ? '单篇内容' : row.resourceTypeName;// 所属类型
          this.descForm.resourceType = row.resourceType;// 广告类型id
          this.descForm.adName = row.adProfileName;// 广告名称
          this.descForm.adNum = row.sortId;// 顺序号
          this.descForm.resourceId = row.resourceId;// 资源id
          this.descForm.linkUrl = row.linkUrl;// 链接地址
          this.descForm.imgUrl = row.resourceImageUrl;// 链接地址
          // 提交的内容
          this.descFormSub.adId = row.id;// 广告id
          this.descFormSub.adNum = this.descForm.adNum;// 顺序号可以改变
          this.descFormSub.adName = row.adProfileName;// 广告名称
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
    // 获取图片高度，用于展示下方文字的top
    bigImgTypeFn(type) {
      // 1:视频，2:文库，7:病例，3:骨科会议，10：单篇内容，11:菁英汇直播，12:锦囊，13:个人主页，14:栏目，15:课程，16:专题，17:活动，18:跳转
      switch (parseInt(type)) {
        case 1:
        case 2:
        case 3:
        case 7:
        case 12:
        case 16:
        case 17:
        case 10:
        case 20:// 品牌
          return '221px';
        case 11:
        case 13:
        case 14:
        case 15:
        case 19:// 产品
          return '336px';
        case 18:
          return '464px';
        default:
          return '221px';
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
    this.getListFn();// 列表页
    this.getAdTypeList();// 广告类型
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible) {
          this.submitForm();// 触发提交按钮
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
