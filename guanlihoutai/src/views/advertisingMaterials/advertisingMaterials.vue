<template>
  <section class="advertisingMaterialsBox">
    <!--大标题开始-->
    <h1 class="advertisingTitleName">广告物料</h1>
    <!--大标题结束-->
    <!--筛选条件开始-->
    <section class="advertisingMaterialsScreening" ref="screenObject" :model="screenObject">
      <aside class="centerItem">
        <span class="titleName">广告ID</span>
        <el-input class="nameInput" placeholder="输入广告ID" v-model="screenObject.advertisingId"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">广告名称</span>
        <el-input class="nameInput" placeholder="输入广告名称" v-model="screenObject.advertisingName"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">广告类型</span>
        <el-select placeholder="不限" v-model="screenObject.advertisingType">
          <el-option label="不限" value="" key=""></el-option>
          <el-option
            v-for="item in advertisingTypeList"
            :key="item.code"
            :label="item.description"
            :value="item.code">
          </el-option>
        </el-select>
      </aside>
      <aside class="centerItem">
        <span class="titleName">添加时间</span>
        <el-date-picker
          v-model="screenObject.addTime"
          type="daterange"
          align="right"
          start-placeholder="不限"
          end-placeholder="不限"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </aside>
      <aside class="centerItem">
        <span class="titleName">更新时间</span>
        <el-date-picker
          v-model="screenObject.updateTime"
          type="daterange"
          align="right"
          start-placeholder="不限"
          end-placeholder="不限"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </aside>
      <aside class="advertisingButtonBox">
        <p class="resetBtn" @click.stop="resetForm">清空条件</p>
        <p class="screeningBtn" @click.stop="submitForm">筛选</p>
      </aside>
    </section>
    <!--筛选条件结束-->
    <!--新建按钮开始-->
    <button class="advertisingAddButton el-icon-circle-plus" @click="addAdvertising"> 新增广告</button>
    <!--新建按钮结束-->
    <!--列表内容区域开始-->
    <section class="advertisingMaterials">
      <el-table
        :data="listData"
        style="width: 100%"
        :default-sort="{prop: 'addTime', order: 'descending'}"
        @sort-change="sortIdChange"
      >
        <el-table-column
          prop="advertisingId"
          label="广告ID"
          width="160"
          sortable="custom"
          :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column
          prop="advertisingName"
          label="广告名称"
          width="282">
        </el-table-column>
        <el-table-column
          prop="advertisingTypeName"
          label="广告类型"
          width="150">
        </el-table-column>
        <el-table-column
          prop="addTime"
          label="添加时间"
          width="180"
          sortable="custom"
          :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180"
          sortable="custom"
          :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column
          prop="resourceImageUrl"
          label="预览"
          width="90">
          <template slot-scope="scope">
            <img
              src="/static/images/icons/icon-picture_hover_tiny.png"
              class="bigImgShow"
              v-if="scope.row.resourceImageUrl!==''"
              @mouseenter="smallImgMouseenter(scope.row)"
              @mouseleave="smallImgMouseLeave"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="operateButton"
          label="操作">
          <template slot-scope="scope">
            <el-button size="medium" @click="addAdvertising(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
    <!--列表内容区域结束-->
    <!--查看大图大图区域开始-->
    <div
      class="tableBigImg"
      :class="{tableBigImg212:mouseBigImgHeight===212,tableBigImg464:mouseBigImgHeight===464}"
      v-if="bigImgDialogVisible"
      @mouseenter="bigImgMouseenter"
      @mouseleave="bigImgMouseLeave"
    >
      <img
        :src="bigImgPath"
      >
      <p class="bigImgPathName" v-show="bigImgPathName">{{bigImgPathName}}</p>
    </div>
    <!--查看大图大图区域结束-->
    <!--分页开始-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 50, 100]"
      :page-size="maxResult"
      layout="total, prev, pager, next, jumper, sizes"
      :total="totalNum"
      align="center" v-if="totalNum!==0">
    </el-pagination>
    <!--分页结束-->
    <!--新建和编辑弹层开始-->
    <el-dialog
      class="ev-popBox"
      width="770px"
      top="18vh"
      :visible.sync="editDialogFormShow"
      :title="editDialogFormTitle"
      :center=true
      :lock-scroll=false>
      <el-form
        label-width="90px"
        :rules="rules"
        :model="editDialogForm"
        ref="editDialogForm"
      >
        <el-form-item label="所属类型" prop="advertisingPopType" label-width="140px">
          <el-select placeholder="请选择" v-model="editDialogForm.advertisingPopType">
            <el-option
              v-for="item in advertisingTypePopList"
              :value="item.code"
              :label="item.description"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="广告ID" prop="advertisingPopId" label-width="140px">
          <el-input placeholder="自动生成广告ID" v-model="editDialogForm.advertisingPopId" disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="资源ID" v-show="!linkShow" class="resourceIdInputCss" prop="advertisingPopResourceId"
                      label-width="140px">
          <el-input placeholder="输入资源ID" v-model="editDialogForm.advertisingPopResourceId"
          ></el-input>
          <p class="resourceIdSureButton" @click="resourceIdSure">确定</p>
        </el-form-item>

        <el-form-item label="广告名称" prop="advertisingPopName" label-width="140px">
          <el-input placeholder="输入广告名称" v-model="editDialogForm.advertisingPopName"
          ></el-input>
        </el-form-item>

        <el-form-item label="配图" class="column-course-img-label img-upload"
                      prop="imgUrl" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :widthHeightMinLimit="[widthMinLimit,heightMinLimit]"
              :needClear="needClear"
              :imgUrl="editDialogForm.imgUrl"
              :uploadFlag="uploadFlag"
              @deleteSuccess="deleteImgSuccess"
              @uploadSuccess="uploadImgSuccess"
              @returnNoUpload="returnNoUpload"
            >
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>
        <el-form-item label="1005:300配图" class="column-course-img-label img-upload"
                      prop="imgUrlBanner" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :uploadDesc="'适用于菁英会banner'"
              :widthHeightMinLimit="[1005,300]"
              :imgUrl="editDialogForm.imgUrlBanner"
              :needClear="needClear01"
              :uploadFlag="true"
              :isBannerImg="true"
              @deleteSuccess="deleteImgSuccess01"
              @uploadSuccess="uploadImgSuccess01"
              @returnNoUpload="returnNoUpload"
            >
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>

        <el-form-item label="1035:390配图" class="column-course-img-label img-upload"
                      prop="imgAllinBanner" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :uploadDesc="'适用于唯医学院banner'"
              :widthHeightMinLimit="[1035,390]"
              :imgUrl="editDialogForm.imgAllinBanner"
              :needClear="needClear02"
              :uploadFlag="true"
              :isBannerImg="true"
              @deleteSuccess="deleteImgSuccess02"
              @uploadSuccess="uploadImgSuccess02"
              @returnNoUpload="returnNoUpload"
            >
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>

        <el-form-item label="1035:216配图" class="column-course-img-label img-upload"
                      prop="imgTerminalBanner" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :uploadDesc="'适用于病例、文库、视频终端页'"
              :widthHeightMinLimit="[1035,216]"
              :imgUrl="editDialogForm.imgTerminalBanner"
              :needClear="needClear03"
              :uploadFlag="true"
              :isBannerImg="true"
              @deleteSuccess="deleteImgSuccess03"
              @uploadSuccess="uploadImgSuccess03"
              @returnNoUpload="returnNoUpload"
            >
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>

        <el-form-item label="链接地址" v-show="linkShow" prop="advertisingPopLinkAddress" label-width="140px">
          <el-input placeholder="输入链接地址" v-model="editDialogForm.advertisingPopLinkAddress"
          ></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="24">
            <el-form-item style="float: right;">
              <el-button type="primary" size="small" style="width:150px;"
                         @click="submitEditDialogForm('editDialogForm')">发布
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>
    <!--新建和编辑弹层结束-->

  </section>
</template>

<script>
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm';
import AdvertisingMaterialsImgUpload from './components/advertisingMaterialsImgUpload.vue';

export default {
  name: 'advertisingMaterials',
  data() {
    return {
      totalNum: 1, // 数据总数
      currentPage: 1, // 当前页
      firstResult: 0, // 第一条索引
      maxResult: 20, // 每页几条
      pageSize: 20, // 每页几条(分页组件)
      screenObject: {
        advertisingId: '', // 广告id
        advertisingName: '', // 广告名称
        advertisingType: '', // 广告类型
        addTime: '', // 添加时间
        updateTime: '' // 更新时间
      }, // 筛选条件的信息
      submitObj: {
        advertisingId: '', // 广告id
        advertisingName: '', // 广告名称
        advertisingType: '', // 广告类型
        createStartTime: '', // 添加时间开始
        createEndTime: '', // 添加时间结束
        updateStartTime: '', // 更新时间开始
        updateEndTime: '' // 更新时间结束
      }, // 确定筛选的参数赋值
      advertisingTypeList: [], // 广告类型的列表（筛选条件）
      listData: [], // 列表数据数组
      sortBy: 1, // 排序字段：1:物料添加时间、2:广告ID，3:物料更新时间、4:广告添加时间，5:顺序号，6:点击量，7:广告更新时间。物料查询时默认物料添加时间，广告查询时默认广告添加时间
      asc: 1, // 0:正序，1:倒叙。默认1 倒叙
      bigImgDialogVisible: false, // 查看大图标志是否显示
      bigImgTimer: null, // 查看大图的定时器
      bigImgPath: '', // 查看大图的地址
      bigImgPathName: '', // 查看大图的资源名称
      editDialogFormShow: false, // 新建编辑弹层是否展示
      editDialogFormTitle: '新建广告', // 弹层名称
      editDialogForm: {
        advertisingPopType: '', // 所属类型
        advertisingPopId: '', // 广告id
        advertisingPopResourceId: '', // 资源id
        advertisingPopName: '', // 广告名称
        advertisingPopLinkAddress: '', // 链接地址
        imgUrl: '', // 是否有图片地址
        imgUrlBanner: '', // 菁英会的banner地址
        imgAllinBanner: '', // 唯品学院banner
        imgTerminalBanner: ''// 唯品学院banner
      }, // 新建/编辑弹层的参数
      advertisingTypePopList: [], // 广告类型的列表（新建编辑弹层）
      errorText: '', // 资源id错误提示文本
      rules: {
        advertisingPopType: [
          {required: true, message: '请选择所属类型', trigger: 'change'}
        ],
        advertisingPopResourceId: [
          {required: true, message: '请输入资源ID并确认', trigger: 'blur'}
        ],
        advertisingPopName: [
          {required: true, message: '请输入广告名称', trigger: 'blur change'}
        ],
        advertisingPopLinkAddress: [
          {required: false, message: '请输入链接地址', trigger: 'blur'}
        ],
        imgUrl: [{required: true, message: '请上传配图', trigger: 'change'}]// 配图必填校验
      },
      widthMinLimit: '336',
      heightMinLimit: '336',
      needClear: false, // 是否需要清空
      needClear01: false, // 是否要清空菁英会banner图
      needClear02: false, // 是否要清空唯医学院banner图
      needClear03: false, // 是否要清空病例、文库、视频终端页
      resourceImageUrlSave: '', // 编辑或者保存上传图片的地址
      linkShow: false, // 显示链接地址
      editFlag: '', // 是否是编辑状态，涉及到切换
      uploadFlag: false, // 可不可以上传，为了设置不输入资源id的时候不能上传图片
      mouseBigImgHeight: 336, // 查看大图的高度
      sureResourceId: '', // 确认后的资源id
      bannerShow: false// 菁英会banner是否显示
    };
  },
  components: {
    AdvertisingMaterialsImgUpload
  },
  methods: {
    // 每页多少条数据
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;// 每页多少条
      _this.currentPage = 1;// 每页多少条更改返回首页
      _this.firstResult = 0;// 当前传参
      _this.maxResult = _this.currentPage * val;// 当前页最多
      // 分页参数变化重新请求列表接口
      _this.dataMainList();
    },
    // 当前页面页码
    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;// 当前页码
      _this.firstResult = (val - 1) * _this.pageSize;// 当前传参
      // 分页参数变化重新请求列表接口
      _this.dataMainList();
    },
    // 排序id变换检测
    sortIdChange(column) {
      let _this = this;
      let _or = column.order;
      _this.asc = (_or === 'descending') ? '1' : '0';// 降序，反之升序
      // 排序id  默认添加时间降序
      switch (column.prop) {
        case 'advertisingId':// 广告id排序
          _this.sortBy = 2;
          break;
        case 'addTime':// 添加时间排序
          _this.sortBy = 1;
          break;
        case 'updateTime':// 更新时间排序
          _this.sortBy = 3;
          break;
        default:
          _this.sortBy = 1;
          break;
      }
      _this.currentPage = 1;// 分页回归首页
      _this.firstResult = 0;// 当前传参
      if (_this.listData.length > 0) {
        // 发送请求的列表函数
        _this.dataMainList();
      }
    },
    // 重置筛选条件
    resetForm() {
      this.screenObject = {
        advertisingId: '', // 广告id
        advertisingName: '', // 广告名称
        advertisingType: '', // 广告类型
        addTime: '', // 添加时间
        updateTime: '' // 更新时间
      };
    },
    // 提交筛选条件
    submitForm() {
      let _this = this;
      _this.firstResult = 0; // 回退到第一页
      _this.currentPage = 1;
      _this.submitObj = {
        advertisingId: _this.screenObject.advertisingId, // 广告id
        advertisingName: _this.screenObject.advertisingName, // 广告名称
        advertisingType: _this.screenObject.advertisingType, // 广告类型
        createStartTime: _this.screenObject.addTime[0], // 添加时间开始
        createEndTime: _this.screenObject.addTime[1], // 添加时间结束
        updateStartTime: _this.screenObject.updateTime[0], // 更新时间开始
        updateEndTime: _this.screenObject.updateTime[1]// 更新时间结束
      };
      _this.dataMainList();
    },
    // 请求主列表
    dataMainList() {
      let _this = this;
      comm.openLoading('加载中...');
      let params = {
        sortBy: _this.sortBy, // 排序
        asc: _this.asc, // 排序
        queryLike: 1, // 支持模糊查询
        firstResult: _this.firstResult,
        maxResult: _this.maxResult
      };
      params.id = _this.submitObj.advertisingId ? _this.submitObj.advertisingId : undefined;
      params.adProfileName = _this.submitObj.advertisingName ? _this.submitObj.advertisingName.trim() : undefined;
      params.resourceType = _this.submitObj.advertisingType ? _this.submitObj.advertisingType : undefined;
      params.createStartTime = _this.submitObj.createStartTime ? _this.submitObj.createStartTime : undefined;
      params.createEndTime = _this.submitObj.createEndTime ? _this.submitObj.createEndTime : undefined;
      params.updateStartTime = _this.submitObj.updateStartTime ? _this.submitObj.updateStartTime : undefined;
      params.updateEndTime = _this.submitObj.updateEndTime ? _this.submitObj.updateEndTime : undefined;
      axios({
        method: apiConfig.getAdMaterialList.type,
        url: apiConfig.getAdMaterialList.url,
        params: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject) {
          let items = res.data.responseObject.items;
          _this.totalNum = res.data.responseObject.totalCount;
          if (items && items.length) {
            _this.listData = [];
            for (let i = 0; i < items.length; i++) {
              let kv = items[i];
              let dataJson = {
                advertisingId: kv.id, // 广告id
                advertisingName: kv.adProfileName, // 广告名称
                advertisingType: kv.resourceType, // 广告类型
                advertisingTypeName: kv.resourceTypeName, // 广告类型的名称
                addTime: kv.createTime, // 添加时间
                updateTime: kv.updateTime, // 更新时间
                resourceImageUrl: kv.resourceImageUrl, // 预览是否有图
                resourceName: kv.resourceName, // 预览大图的资源标题
                advertisingResourceId: kv.resourceId, // 资源id
                advertisingLink: kv.linkUrl, // 链接地址
                specialImageUrl: kv.specialImageUrl, // 菁英会banner
                recommendType: kv.recommendType, // 首页推荐类型
                imageList: kv.imageList // 其它banner 数组: imageType 1唯医学院banner，2病例文库视频终端页
              };
              _this.listData.push(dataJson);
            }
          }
          else {
            _this.listData = [];
          }
        }
        else {
          _this.listData = [];
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 获取广告类型请求
    getAdvertisingType() {
      let _this = this;
      /* 广告类型（1:视频，2:文库，7:病例，3:骨科会议，10：单篇内容，11:菁英汇直播，12:锦囊，13:个人主页，14:栏目，15:课程，16:专题，17:活动，18:跳转） */
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getAdTypeList.type,
        url: apiConfig.getAdTypeList.url,
        params: {}
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.length) {
          // 编辑新建弹层的选择条件
          let items = res.data.responseObject;
          for (let i = 0; i < items.length; i++) {
            if (items[i].code !== 1 && items[i].code !== 2 && items[i].code !== 7) { // 排除视频病例文库
              let json = {
                code: parseInt(items[i].code),
                description: items[i].description
              };
              _this.advertisingTypePopList.push(json);
            }
          }
          // 列表页面的筛选
          _this.advertisingTypeList = res.data.responseObject;
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 鼠标滑过查看大图
    smallImgMouseenter(scopeRow) {
      let _this = this;
      if (_this.bigImgTimer) {
        clearTimeout(_this.bigImgTimer);
      }
      let ev1 = scopeRow.advertisingType;
      if (ev1 === 11 || ev1 === 13 || ev1 === 14 || ev1 === 15 || ev1 === 19 || ev1 === 21) { // 直播、个人主页、栏目、课程、产品、付费课程
        _this.mouseBigImgHeight = 336;
      }
      else if (ev1 === 3 || ev1 === 12 || ev1 === 16 || ev1 === 17 || ev1 === 10 || ev1 === 1 || ev1 === 2 || ev1 === 7 || ev1 === 20) { // 会议、锦囊、专题、活动、单篇内容、品牌
        _this.mouseBigImgHeight = 212;
      }
      else if (ev1 === 18) { // 链接跳转
        _this.mouseBigImgHeight = 464;
      }
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      let url = scopeRow.resourceImageUrl;
      if (url) {
        _this.bigImgPathName = scopeRow.resourceName;// 大图预览的资源标题
        _this.bigImgPath = url;
        _this.bigImgDialogVisible = true;
      }
      else {
        _this.bigImgPath = '';
        _this.bigImgPathName = '';
      }
    },
    // 鼠标离开查看大图关闭
    smallImgMouseLeave() {
      let _this = this;
      _this.bigImgTimer = setTimeout(function() {
        _this.bigImgDialogVisible = false;
      }, 1000);
    },
    // 大图区域上的hover状态
    bigImgMouseenter() {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
    },
    // 离开大图区域
    bigImgMouseLeave() {
      this.bigImgDialogVisible = false;
    },
    // 新增广告按钮和编辑按钮操作弹层
    addAdvertising(scopeRow) {
      let _this = this;
      _this.editDialogFormShow = true;
      if (scopeRow.advertisingId) { // 编辑
        _this.needClear = false;
        _this.needClear01 = false;
        _this.needClear02 = false;
        _this.needClear03 = false;
        _this.editFlag = scopeRow.advertisingType;// 判断是编辑
        _this.editDialogFormTitle = '编辑广告';
        let _type = parseInt(scopeRow.advertisingType);
        _this.editDialogForm = {
          advertisingPopType: _type === 1 || _type === 2 || _type === 7 ? 10 : _type, // 所属类型(视频病例文库统一处理为单篇内容)
          advertisingPopId: scopeRow.advertisingId, // 广告id
          advertisingPopResourceId: scopeRow.advertisingResourceId, // 资源id
          advertisingPopName: scopeRow.advertisingName, // 广告名称
          advertisingPopLinkAddress: scopeRow.advertisingLink, // 链接地址
          imgUrl: scopeRow.resourceImageUrl !== '' ? scopeRow.resourceImageUrl : '', // 图片地址
          imgUrlBanner: scopeRow.specialImageUrl !== '' ? scopeRow.specialImageUrl : '', // 图片地址(菁英会banner图)
          imgAllinBanner: _this.getImgList(1, scopeRow.imageList), // 唯品学院banner
          imgTerminalBanner: _this.getImgList(2, scopeRow.imageList)// 终端页banner
        };// 新建/编辑弹层的参数
        _this.sureResourceId = _this.editDialogForm.advertisingPopResourceId;// 确认后的资源id
        _this.resourceImageUrlSave = _this.editDialogForm.imgUrl;// 保存接口所需参数
        _this.bannerImageUrlSave = _this.editDialogForm.imgUrlBanner;// 菁英会保存接口所需参数
        _this.AllinBannerImageUrlSave = _this.editDialogForm.imgAllinBanner; // 唯医学院保存接口所需参数
        _this.imgTerminalBannerImageUrlSave = _this.editDialogForm.imgTerminalBanner; // 终端页保存接口所需参数
      }
      else { // 新建
        _this.editFlag = '';// 判断是新增
        _this.editDialogFormTitle = '新增广告';
        _this.editDialogForm = {
          advertisingPopType: '', // 所属类型
          advertisingPopId: '', // 广告id
          advertisingPopResourceId: '', // 资源id
          advertisingPopName: '', // 广告名称
          advertisingPopLinkAddress: '', // 链接地址
          imgUrl: '',
          imgUrlBanner: '',
          AllinBannerImageUrlSave: '', // 唯医学院保存接口所需参数
          imgTerminalBannerImageUrlSave: '' // 终端页保存接口所需参数
        };// 新建/编辑弹层的参数
      }
    },
    // 获取imgList图片 1-(4:3配图)适用于唯医学院banner，2-(16:9配图)适用于病例文库视频终端页
    getImgList(type, imgList) {
      if (imgList.length === 0) return '';

      for (let x in imgList) {
        if (imgList[x].imageType === type) {
          return imgList[x].imageUrl;
        }
      }
    },
    // 资源id确定按钮，匹配图片和资源标题  分别给广告配图和广告名称
    resourceIdSure() {
      let _this = this;
      // 类型和id为空
      if (_this.editDialogForm.advertisingPopResourceId === '' || _this.editDialogForm.advertisingPopType === '') {
        return;
      }
      // 判断正则数字
      let reg = /^[\d]/g;

      if (!reg.test(_this.editDialogForm.advertisingPopResourceId)) {
        _this.errorText = '请输入数字类型';
        _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
        _this.resourceIdValidate();
        return;
      }
      _this.errorText = '请输入资源ID并确认';
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getImgByResIdAndAdType.type,
        url: apiConfig.getImgByResIdAndAdType.url,
        params: {
          resourceId: _this.editDialogForm.advertisingPopResourceId, // 资源id 点击了确认按钮以后的
          resourceType: _this.editDialogForm.advertisingPopType// 资源类型
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.items && res.data.responseObject.items.length) {
          let resourceImageUrl = res.data.responseObject.items[0].resourceImageUrl;// 配图地址
          _this.editDialogForm.imgUrl = resourceImageUrl || '';
          _this.resourceImageUrlSave = _this.editDialogForm.imgUrl;// 保存接口所需参数
          _this.bannerImageUrlSave = _this.editDialogForm.imgUrlBanner;// 保存接口所需参数(精英会banner)
          _this.AllinBannerImageUrlSave = _this.editDialogForm.imgAllinBanner; // 唯医学院保存接口所需参数
          _this.imgTerminalBannerImageUrlSave = _this.editDialogForm.imgTerminalBanner; // 终端页保存接口所需参数
          _this.$refs.editDialogForm.validateField('imgUrl');// 校验图片
          let adProfileName = res.data.responseObject.items[0].adProfileName;// 广告名字
          _this.editDialogForm.advertisingPopName = adProfileName || '';
          _this.sureResourceId = _this.editDialogForm.advertisingPopResourceId;// 确认后的资源id
        }
        else if (res.data.responseObject.responseCode === '1102') {
          _this.errorText = '资源ID与所属类型不符，请重新输入';
          _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
        else if (res.data.responseObject.responseCode === '1103') {
          _this.errorText = '该资源无效，请重新输入';
          _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
        else if (res.data.responseObject.responseCode === '1104') {
          _this.errorText = '该资源已被用户删除，请重新输入';
          _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
        else if (res.data.responseObject.responseCode === '1105') {
          _this.errorText = '该视频为付费课程选集，无法添加';
          _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
        else {
          _this.errorText = '资源ID与所属类型不符，请重新输入';
          _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 上传图片成功的回调函数
    uploadImgSuccess(data) {
      let _this = this;
      _this.resourceImageUrlSave = data.attUrl;
      _this.editDialogForm.imgUrl = data.prevImgUrl;
      _this.$refs.editDialogForm.validateField('imgUrl');// 校验图片
    },
    // 删除图片的回调操作
    deleteImgSuccess() {
      let _this = this;
      _this.editDialogForm.imgUrl = '';// 图片地址置为空
      _this.needClear = false;// 清空input
      _this.resourceImageUrlSave = '';// 删除了
    },
    // 不能上传图片，先输入id
    returnNoUpload() {
      let _this = this;
      _this.errorText = '请先输入资源ID并确认';
      _this.resourceIdValidate();
    },
    // 上传图片成功的回调函数（菁英会banner）
    uploadImgSuccess01(data) {
      let _this = this;
      _this.bannerImageUrlSave = data.attUrl;
      _this.editDialogForm.imgUrlBanner = data.prevImgUrl;
    },
    // 删除图片的回调操作（菁英会banner）
    deleteImgSuccess01() {
      let _this = this;
      _this.editDialogForm.imgUrlBanner = '';// 图片地址置为空
      _this.needClear01 = false;// 清空input
      _this.bannerImageUrlSave = '';
    },

    // 上传图片成功的回调函数（唯品学院banner）
    uploadImgSuccess02(data) {
      let _this = this;
      _this.AllinBannerImageUrlSave = data.attUrl;
      _this.editDialogForm.imgAllinBanner = data.prevImgUrl;
    },
    // 删除图片的回调操作（唯品学院banner）
    deleteImgSuccess02() {
      let _this = this;
      _this.editDialogForm.imgAllinBanner = '';// 图片地址置为空
      _this.needClear02 = false;// 清空input
      _this.AllinBannerImageUrlSave = '';
    },

    // 上传图片成功的回调函数（终端页banner）
    uploadImgSuccess03(data) {
      let _this = this;
      _this.imgTerminalBannerImageUrlSave = data.attUrl;
      _this.editDialogForm.imgTerminalBanner = data.prevImgUrl;
    },
    // 删除图片的回调操作（终端页banner）
    deleteImgSuccess03() {
      let _this = this;
      _this.editDialogForm.imgTerminalBanner = '';// 图片地址置为空
      _this.needClear03 = false;// 清空input
      _this.imgTerminalBannerImageUrlSave = '';
    },
    // 单独校验资源ID
    resourceIdValidate() {
      let _this = this;
      _this.rules.advertisingPopResourceId[0].message = _this.errorText;
      _this.$refs.editDialogForm.validateField('advertisingPopResourceId');
    },
    // 新建、编辑发布验证
    submitEditDialogForm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.saveAdvertisingInfo();// 保存广告接口
        }
        else {
          return false;
        }
      });
    },
    // 保存广告接口请求
    saveAdvertisingInfo() {
      let _this = this;
      comm.openLoading('加载中...');
      let params = {
        resourceImageUrl: _this.resourceImageUrlSave, // 广告配图
        adProfileName: _this.editDialogForm.advertisingPopName.trim(), // 广告名称
        resourceType: _this.editDialogForm.advertisingPopType, // 广告类型
        imageList: [] // 其它图片存放 1唯医学院,2终端页
      };

      params.id = _this.editDialogForm.advertisingPopId ? _this.editDialogForm.advertisingPopId : undefined;
      params.resourceId = _this.sureResourceId ? _this.sureResourceId : undefined;
      params.linkUrl = _this.editDialogForm.advertisingPopLinkAddress ? _this.editDialogForm.advertisingPopLinkAddress : undefined;
      params.specialImageUrl = _this.bannerImageUrlSave ? _this.bannerImageUrlSave : undefined;// 广告banner配图
      _this.AllinBannerImageUrlSave
        ? params.imageList.push({imageType: 1, imageUrl: _this.AllinBannerImageUrlSave}) : params.imageList.push();// 唯医学院banner配图
      _this.imgTerminalBannerImageUrlSave
        ? params.imageList.push({imageType: 2, imageUrl: _this.imgTerminalBannerImageUrlSave}) : params.imageList.push();// 终端页banner配图

      axios({
        method: apiConfig.saveOrUpdateMaterial.type,
        url: apiConfig.saveOrUpdateMaterial.url,
        data: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          _this.dataMainList();// 重新请求列表
          _this.editDialogFormShow = false;
        }
        else { // 没保存成功
          if (res.data.responseObject.responseCode === '1101') { // 该广告名称已存在请重新修改
            _this.editDialogForm.advertisingPopName = '';
            _this.rules.advertisingPopName[0].message = '该广告名称已经存在，请重新输入';
            _this.$refs.editDialogForm.validateField('advertisingPopName');
          }
          else if (res.data.responseObject.responseCode === '1102') {
            _this.errorText = '资源ID与所属类型不符，请重新输入';
            _this.editDialogForm.advertisingPopResourceId = '';// 置空资源id，目的为了报错
            _this.resourceIdValidate();
          }
          else {
            _this.$allin_confirm({title: '提示', content: '保存失败，请重试', type: 'notice'});
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        _this.$allin_confirm({title: '提示', content: '保存失败，请重试', type: 'notice'});
        console.log('失败：', e);
      });
    }
  },
  mounted() {
    let _this = this;
    _this.dataMainList();// 获取主列表
    _this.getAdvertisingType();// 获取广告类型
    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible) {
          _this.submitForm();// 触发提交按钮
        }
      }
    };
  },
  computed: {},
  watch: {
    // 关闭弹层的时候清空表单和上传的图片
    editDialogFormShow() {
      let _this = this;
      if (!_this.editDialogFormShow) { // 弹层不可见状态，重置填写的内容
        _this.editDialogForm = {
          advertisingPopType: '', // 所属类型
          advertisingPopId: '', // 广告id
          advertisingPopResourceId: '', // 资源id
          advertisingPopName: '', // 广告名称
          advertisingPopLinkAddress: '', // 链接地址
          imgUrl: '', // 配图
          imgUrlBanner: '', // 菁英会banner配图
          imgAllinBanner: '', // 唯医学院banner配图
          imgTerminalBanner: '' // 终端页banner配图
        };// 新建/编辑弹层的参数
        _this.needClear = true;// 清空input
        _this.needClear01 = true;// 清空input
        _this.needClear02 = true;// 清空input
        _this.needClear03 = true;// 清空input
        _this.editFlag = '';// 编辑操作记录置空
        _this.sureResourceId = '';// 确认的资源id置为空
        _this.widthMinLimit = '336';// 恢复默认尺寸
        _this.heightMinLimit = '336';// 恢复默认尺寸
        _this.$refs.editDialogForm.resetFields();
      }
      else {
        _this.needClear = false;
        _this.needClear01 = false;
        _this.needClear02 = false;
        _this.needClear03 = false;
      }
    },
    // 检测弹层选择的所属类型，改变配图尺寸
    'editDialogForm.advertisingPopType': function(ev1, ev2) {
      let _this = this;
      _this.linkShow = false;// 链接地址默认不显示
      _this.bannerShow = false;// 菁英会不展示
      if (_this.editFlag === '') { // 判断是编辑的首次进入，首次进入不能清
        _this.editDialogForm.advertisingPopResourceId = '';
        _this.editDialogForm.advertisingPopName = '';
        _this.editDialogForm.advertisingPopLinkAddress = '';
        _this.editDialogForm.imgUrl = '';
        _this.editDialogForm.imgUrlBanner = '';
        _this.editDialogForm.imgAllinBanner = '';
        _this.editDialogForm.imgTerminalBanner = '';
      }
      if (_this.editFlag !== '') { // 判断是编辑的首次进入，首次进入不能清空图片
        _this.editFlag = '';
      }
      if (_this.sureResourceId !== '') { // 有确认搜索过的资源id
        _this.uploadFlag = true;// 可以上传图片
      }
      else {
        _this.uploadFlag = false;// 不可以上传图片
      }
      // 更新类型以后的选择
      if (ev1 === 11 || ev1 === 13 || ev1 === 14 || ev1 === 15 || ev1 === 19) { // 直播、个人主页、栏目、课程、产品
        _this.widthMinLimit = '336';
        _this.heightMinLimit = '336';
        if (ev1 === '11') { // 菁英会banner展示
          _this.bannerShow = true;
        }
      }
      else if (ev1 === 3 || ev1 === 12 || ev1 === 16 || ev1 === 17 || ev1 === 10 || ev1 === 20) { // 会议、锦囊、专题、活动、单篇内容、品牌
        _this.widthMinLimit = '336';
        _this.heightMinLimit = '212';
      }
      else if (ev1 === 18) { // 链接跳转
        _this.widthMinLimit = '336';
        _this.heightMinLimit = '464';
        _this.uploadFlag = true;// 可以上传图片
        _this.linkShow = true;
      }
    },
    // 检测链接是否显示设置必填项
    linkShow() {
      let _this = this;
      if (_this.linkShow) { // 显示链接地址必填  资源id不必填
        _this.rules.advertisingPopLinkAddress[0].required = true;
        _this.rules.advertisingPopResourceId[0].required = false;
      }
      else { // 显示资源id必填  链接地址不必填
        _this.rules.advertisingPopLinkAddress[0].required = false;
        _this.rules.advertisingPopResourceId[0].required = true;
      }
    },
    // 检测有没有确认的资源id
    sureResourceId() {
      let _this = this;
      if (_this.sureResourceId !== '' || _this.editDialogForm.advertisingPopType === 18) { // 有确认搜索过的资源id
        _this.uploadFlag = true;// 可以上传图片
      }
      else {
        _this.uploadFlag = false;// 不可以上传图片
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
  /*父层*/
  .advertisingMaterialsBox {
    width: 1200px;
    margin: 0 auto;
    /*广告物料标题*/
    .advertisingTitleName {
      font-size: 20px;
      color: #222222;
      font-weight: bold;
      display: inline-block;
      margin: 32px 0 20px 0;
    }
    /*筛选条件部分*/
    .advertisingMaterialsScreening {
      position: relative;
      width: 1200px;
      height: 190px;
      background: white;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      margin-bottom: 25px;
      padding: 25px 15px;
      box-sizing: border-box;
      .centerItem {
        display: inline-block;
        margin-bottom: 20px;
        .titleName {
          font-size: 14px;
          font-weight: 400;
          color: rgba(85, 85, 85, 1);
          line-height: 14px;
          margin-right: 10px;
        }
        .el-input, .el-select {
          width: 220px;
        }
        .el-date-editor--daterange, .el-select {
          margin-right: 44px;
        }
        .nameInput {
          margin-right: 44px;
        }
      }
      .advertisingButtonBox {
        height: 32px;
        margin-top: 24px;
        p {
          display: inline-block;
          position: absolute;
          vertical-align: middle;
          cursor: pointer;
        }
        .resetBtn {
          font-size: 14px;
          font-weight: 400;
          color: rgba(44, 52, 58, 1);
          line-height: 14px;
          margin-right: 20px;
          right: 124px;
          bottom: 32px;
        }
        .screeningBtn {
          right: 34px;
          bottom: 25px;
          width: 90px;
          height: 32px;
          border-radius: 3px;
          border: 1px solid rgba(75, 103, 214, 1);
          box-sizing: border-box;
          line-height: 32px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(75, 103, 214, 1);
          text-align: center;
        }
      }
    }
    /*新增按钮样式*/
    .advertisingAddButton {
      background: none;
      width: 98px;
      height: 32px;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      font-size: 14px;
      color: #4B67D6;
      margin-bottom: 12px;
      cursor: pointer;
    }
    /*控制广告名称超级长的显示样式*/
    .el-table td:nth-child(2) .cell {
      width: 282px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      white-space: nowrap;
    }
    /*input框自定义高度  elementUi组件样式覆盖区域*/
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
    .el-select .el-input .el-select__caret {
      line-height: 32px;
    }
    .el-date-editor .el-range__icon, .el-date-editor .el-range-separator {
      height: 32px;
    }
    /*防止影响*/
    .el-dialog__body .el-select .el-input {
      width: 100%;
    }
    /*第一列距离左侧的间距更改*/
    .el-table th:first-child .cell, .el-table td:first-child .cell {
      padding-left: 25px;
    }
    /*表头的样式修改覆盖*/
    .el-table th > .cell {
      font-size: 14px;
      font-weight: 600;
      color: #111111;
    }
    /*编辑按钮样式修改*/
    .el-table td:last-child .cell button {
      box-sizing: border-box;
      border: 1px solid #4B67D6;
      border-radius: 3px;
      font-size: 13px;
      color: #4B67D6;
      width: 74px;
      height: 27px;
      padding: 0;
    }
    .el-pagination {
      margin: 20px auto;
    }
  }

  /*列表查看大图的大图区域*/
  .tableBigImg {
    font-size: 0;
    width: 336px;
    height: 336px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);

    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
      border-radius: 3px 3px 0 0;
    }
    .bigImgPathName {
      background-color: #ffffff;
      font-weight: 500;
      color: #222;
      font-size: 16px;
      line-height: 20px;
      min-height: 70px;
      width: 100%;
      position: absolute;
      top: 336px;
      z-index: 2;
      text-align: left;
      padding: 10px;
      box-sizing: border-box;
      box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);
      border-radius: 0 0 3px 3px;
    }
    &.tableBigImg212 {
      height: 212px;
      img {
        height: 212px;
      }
      .bigImgPathName {
        top: 212px;
      }
    }
    &.tableBigImg464 {
      height: 464px;
      img {
        height: 464px;
      }
      .bigImgPathName {
        top: 212px;
      }
    }

  }

  /*资源id后边的确定按钮*/
  .resourceIdSureButton {
    display: inline-block;
    height: 32px;
    background: #3846DC;
    border-radius: 3px;
    line-height: 32px;
    margin-left: 15px;
    color: #FFF;
    padding: 0 20px;
    cursor: pointer;
  }

  /*控制资源id输入框的样式*/
  .resourceIdInputCss {
    .el-input {
      display: inline-block;
      width: auto;
    }
  }

  /*控制弹层里输入框的宽度*/
  .ev-popBox {
    .el-input__inner {
      width: 300px;
    }
    .el-button--primary {
      background: #3846DC;
      border-color: #3846DC;
    }
    .el-dialog__title {
      font-weight: 600;
    }
  }

</style>
