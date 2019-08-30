<template>
  <section class="advertisingMaterialsBox">
    <!--大标题开始-->
    <h1 class="advertisingTitleName">唯品汇栏目</h1>
    <!--大标题结束-->
    <!--筛选条件开始-->
    <section class="advertisingMaterialsScreening" ref="screenObject" :model="screenObject">
      <aside class="centerItem">
        <span class="titleName">资源ID</span>
        <el-input class="nameInput" placeholder="输入资源ID" v-model="screenObject.resourceId"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">资源名称</span>
        <el-input class="nameInput" placeholder="输入资源名称" v-model="screenObject.resourceName"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">资源类型</span>
        <el-select placeholder="不限" v-model="screenObject.resourceType">
          <el-option label="不限" value="" key=""></el-option>
          <el-option
            v-for="item in resourceTypeList"
            :key="item.code"
            :label="item.description"
            :value="item.code">
          </el-option>
        </el-select>
      </aside>
      <aside class="centerItem">
        <span class="titleName">状态</span>
        <el-select placeholder="不限" v-model="screenObject.resourceState">
          <el-option label="不限" value="" key=""></el-option>
          <el-option
            v-for="item in resourceStateList"
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
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </aside>
      <aside class="centerItem">
        <span class="titleName">品牌名称</span>
        <el-input class="nameInput" placeholder="输入品牌名称" v-model="screenObject.brandName"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">品牌ID</span>
        <el-input class="nameInput" placeholder="输入品牌ID" v-model="screenObject.brandId"></el-input>
      </aside>
      <aside class="advertisingButtonBox">
        <p class="resetBtn" @click.stop="resetForm">清空条件</p>
        <p class="screeningBtn" @click.stop="submitForm">筛选</p>
      </aside>
    </section>
    <!--筛选条件结束-->
    <!--新建按钮开始-->
    <button class="advertisingAddButton el-icon-circle-plus" @click="addResource"> 新增资源</button>
    <!--新建按钮结束-->
    <!--列表内容区域开始-->
    <section class="advertisingMaterials">
      <el-table :data="listData" style="width: 100%"
        :default-sort="{prop: 'addTime', order: 'descending'}" @sort-change="sortIdChange">
        <el-table-column prop="resourceId" label="资源ID" width="180">
        <!-- <el-table-column prop="resourceId" label="资源ID" width="180"
          sortable="custom" :sort-orders="['descending','ascending']"> -->
        </el-table-column>
        <el-table-column prop="resourceColumnId" label="栏目内顺序" width="120">
        </el-table-column>
        <el-table-column prop="brandId" label="品牌ID" width="180">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称" width="220">
        </el-table-column>
        <el-table-column prop="resourceColumn" label="栏目" width="100">
        </el-table-column>
        <el-table-column prop="resourceTypeName" label="资源类型" width="120">
        </el-table-column>
        <el-table-column prop="resourceName" label="资源名称" width="250">
        </el-table-column>
        <el-table-column prop="addTime" label="添加时间" width="180">
        </el-table-column>
        <el-table-column prop="resourceState" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="addResource(scope.row)" @keydown.native.prevent>编辑</el-button>
            <el-button @click="handleUpAndDown(scope.row)" @keydown.native.prevent :class="parseInt(scope.row.resourceStateCode) === 0 ? 'changeState' : 'changeState remove'">
              {{parseInt(scope.row.resourceStateCode) === 1 ? '下架' : '上架'}}
            </el-button>
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
      @mouseleave="bigImgMouseLeave">
      <img :src="bigImgPath">
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
        ref="editDialogForm">
        <el-form-item label="所属类型" prop="resourcePopType" label-width="140px">
          <el-select placeholder="请选择" v-model="editDialogForm.resourcePopType" :disabled="isEdit">
            <el-option
              v-for="item in resourceTypePopList"
              :value="item.code"
              :label="item.description"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源ID" v-show="!linkShow" class="resourceIdInputCss" prop="resourcePopId"
                      label-width="140px">
          <el-input placeholder="输入资源ID" v-model="editDialogForm.resourcePopId" :disabled="isEdit"></el-input>
          <p v-show="!isEdit" class="resourceIdSureButton" @click="resourceIdSure">确定</p>
          <p v-show="isEdit" class="resourceIdSureButtonNo">确定</p>
        </el-form-item>
        <el-form-item label="资源名称" prop="resourcePopName" label-width="140px">
          <el-input placeholder="输入资源名称" v-model="editDialogForm.resourcePopName" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌" prop="brandPopName" label-width="140px">
          <el-input placeholder="输入所属品牌" v-model="editDialogForm.brandPopName" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="资源顺序" prop="resourcePopNo" label-width="140px">
          <el-input placeholder="输入资源顺序" v-model="editDialogForm.resourcePopNo"></el-input>
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
              @returnNoUpload="returnNoUpload">
            </AdvertisingMaterialsImgUpload>
          </div>
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
      // 数据总数
      totalNum: 1,
      // 当前页
      currentPage: 1,
      // 第一条索引
      firstResult: 0,
      // 每页几条
      maxResult: 20,
      // 每页几条(分页组件)
      pageSize: 20,
      // 筛选条件的信息
      screenObject: {
        resourceId: '',
        resourceName: '',
        resourceType: '',
        addTime: '',
        resourceState: '',
        brandName: '',
        brandId: ''
      },
      // 确定筛选的参数赋值
      submitObj: {
        resourceId: '',
        resourceName: '',
        resourceType: '',
        createStartTime: '',
        createEndTime: '',
        resourceState: '',
        brandName: '',
        brandId: ''
      },
      // 资源类型的列表（筛选条件）
      resourceTypeList: [{
        code: 1,
        description: '活动'
      }, {
        code: 2,
        description: '专题'
      }],
      // 状态的列表（筛选条件）
      resourceStateList: [{
        code: 1,
        description: '已上架'
      }, {
        code: 0,
        description: '已下架'
      }],
      // 列表数据数组
      listData: [],
      // 排序字段：1:资源ID、2:栏目内顺序，3:品牌Id、4:添加时间。默认添加时间排序
      sortBy: 4,
      // 0:正序，1:倒叙。默认1 倒叙
      asc: 1,
      // 查看大图标志是否显示
      bigImgDialogVisible: false,
      bigImgTimer: null, // 查看大图的定时器
      bigImgPath: '', // 查看大图的地址
      bigImgPathName: '', // 查看大图的资源名称
      editDialogFormShow: false, // 新建编辑弹层是否展示
      editDialogFormTitle: '新增资源', // 弹层名称
      // 新建、编辑弹层的参数
      editDialogForm: {
        popId: '',
        resourcePopType: '',
        resourcePopId: '',
        resourcePopName: '',
        brandPopName: '',
        oldResourceNo: '',
        resourcePopNo: '',
        oldImgUrl: '',
        imgUrl: '',
        resourceImageUrlSave: ''
      },
      // 弹窗字段是否可编辑
      isEdit: false,
      // 广告类型的列表（新建编辑弹层）
      resourceTypePopList: [
        {
          code: 1,
          description: '活动'
        }, {
          code: 2,
          description: '专题'
        }
      ],
      // 资源id错误提示文本
      errorText: '',
      rules: {
        resourcePopType: [
          {required: true, message: '请选择所属类型', trigger: 'change'}
        ],
        resourcePopId: [
          {required: true, message: '请输入资源ID并确认', trigger: 'blur'}
        ],
        resourcePopNo: [
          {required: true, message: '请输入资源顺序', trigger: 'blur change'}
        ],
        imgUrl: [
          {required: true, message: '请上传配图', trigger: 'change'}
        ] // 配图必填校验
      },
      widthMinLimit: '336',
      heightMinLimit: '336',
      needClear: false, // 是否需要清空
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
      _this.asc = (_or === 'descending') ? 1 : 0;// 降序，反之升序
      // console.log('排序方式', _this.asc === 1 ? '降序' : '升序');
      // 排序id  默认添加时间降序
      switch (column.prop) {
        case 'resourceId':
          _this.sortBy = 1;
          // console.log('排序字段：资源ID');
          break;
        case 'resourceNo':
          _this.sortBy = 2;
          // console.log('排序字段：栏目内顺序');
          break;
        case 'brandId':
          _this.sortBy = 3;
          // console.log('排序字段：品牌ID');
          break;
        case 'addTime':
          _this.sortBy = 4;
          // console.log('排序字段：添加时间');
          break;
        default:
          _this.sortBy = 4;
          // console.log('默认排序：添加时间');
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
        resourceId: '', // 资源id
        resourceName: '', // 资源名称
        resourceType: '', // 资源类型
        addTime: '', // 添加时间
        resourceState: '', // 状态
        brandName: '', // 品牌名称
        brandId: '' // 品牌Id
      };
    },
    // 提交筛选条件
    submitForm() {
      let _this = this;
      _this.firstResult = 0;
      _this.currentPage = 1;
      _this.submitObj = {
        resourceId: _this.screenObject.resourceId,
        resourceName: _this.screenObject.resourceName,
        resourceType: _this.screenObject.resourceType,
        createStartTime: _this.screenObject.addTime[0],
        createEndTime: _this.screenObject.addTime[1],
        resourceState: _this.screenObject.resourceState,
        brandName: _this.screenObject.brandName,
        brandId: _this.screenObject.brandId
      };
      _this.dataMainList();
    },
    // 请求主列表
    dataMainList() {
      let _this = this;
      comm.openLoading('加载中...');
      let params = {
        // sortBy: _this.sortBy,
        // asc: _this.asc,
        columnId: 1563551999999,
        // queryLike: 1, // 支持模糊查询
        firstResult: _this.firstResult,
        maxResult: _this.maxResult
      };
      params.resourceId = _this.submitObj.resourceId ? _this.submitObj.resourceId : undefined;
      params.anthologyName = _this.submitObj.resourceName ? _this.submitObj.resourceName.trim() : undefined;
      params.type = _this.submitObj.resourceType ? _this.submitObj.resourceType : undefined;
      params.createStartTime = _this.submitObj.createStartTime ? _this.submitObj.createStartTime + ' 00:00:00' : undefined;
      params.createEndTime = _this.submitObj.createEndTime ? _this.submitObj.createEndTime + ' 23:59:59' : undefined;
      if (_this.submitObj.resourceState === 0) {
        params.valid = 0;
      }
      else if (_this.submitObj.resourceState === 1) {
        params.valid = 1;
      }
      else {
        params.valid = undefined;
      }
      // params.valid = _this.submitObj.resourceState  ? _this.submitObj.resourceState : undefined;
      params.brandName = _this.submitObj.brandName ? _this.submitObj.brandName : undefined;
      params.brandId = _this.submitObj.brandId ? _this.submitObj.brandId : undefined;
      axios({
        method: apiConfig.getResourceList.type,
        url: apiConfig.getResourceList.url,
        params: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let items = res.data.responseObject.responseData.items;
          _this.totalNum = res.data.responseObject.responseData.totalCount;
          if (items && items.length) {
            _this.listData = [];
            for (let i = 0; i < items.length; i++) {
              let kv = items[i];
              let resourceType = '活动';
              if (kv.type === 1) {
                resourceType = '活动';
              }
              else if (kv.type === 2) {
                resourceType = '专题';
              }
              else {
                resourceType = '-';
              }
              let resourceState = '已上架';
              if (kv.valid === 1) {
                resourceState = '已上架';
              }
              else if (kv.valid === 0) {
                resourceState = '已下架';
              }
              else {
                resourceState = '-';
              }
              let dataJson = {
                id: kv.id,
                resourceId: kv.refId,
                resourceColumnId: kv.sortId,
                brandId: kv.brandId,
                brandName: kv.brandName,
                resourceColumn: kv.columnName,
                resourceType: kv.type,
                resourceTypeName: resourceType,
                resourceName: kv.anthologyName,
                addTime: kv.createTime,
                resourceImageUrl: kv.imageUrl,
                resourceStateCode: kv.valid,
                resourceState: resourceState
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
    // 鼠标滑过查看大图
    smallImgMouseenter(scopeRow) {
      let _this = this;
      if (_this.bigImgTimer) {
        clearTimeout(_this.bigImgTimer);
      }
      let ev1 = scopeRow.resourceType;
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
    addResource(scopeRow) {
      let _this = this;
      _this.editDialogFormShow = true;
      _this.uploadFlag = false;
      // 编辑
      if (scopeRow.resourceId) {
        // console.log('====编辑====');
        // console.log(JSON.stringify(scopeRow));
        // console.log('============');
        _this.needClear = false;
        _this.editFlag = scopeRow.resourceType; // 判断是编辑
        _this.editDialogFormTitle = '编辑资源';
        _this.uploadFlag = true;
        _this.isEdit = true;
        _this.editDialogForm = {
          popId: scopeRow.id,
          resourcePopType: parseInt(scopeRow.resourceType),
          resourcePopId: scopeRow.resourceId,
          resourcePopName: scopeRow.resourceName,
          brandPopName: scopeRow.brandName,
          oldResourceNo: scopeRow.resourceColumnId,
          resourcePopNo: scopeRow.resourceColumnId,
          oldImgUrl: scopeRow.resourceImageUrl,
          imgUrl: scopeRow.resourceImageUrl,
          resourceImageUrlSave: scopeRow.resourceImageUrl
        };
      }
      // 新增
      else {
        _this.editFlag = '';// 判断是新增
        _this.editDialogFormTitle = '新增资源';
        _this.isEdit = false;
        _this.editDialogForm = {
          popId: '',
          resourcePopType: '',
          resourcePopId: '',
          resourcePopName: '',
          brandPopName: '',
          oldResourceNo: '',
          resourcePopNo: '',
          oldImgUrl: '',
          imgUrl: '',
          resourceImageUrlSave: ''
        };
      }
    },
    // 资源id确定按钮，匹配图片和资源标题  分别给广告配图和广告名称
    resourceIdSure() {
      let _this = this;
      // 类型和id为空
      if (_this.editDialogForm.resourcePopType === '') {
        _this.errorText = '请选择资源类型';
        _this.editDialogForm.resourcePopId = '';
        _this.$refs.editDialogForm.validateField('resourcePopType');
        return;
      }
      if (_this.editDialogForm.resourcePopId === '') {
        _this.errorText = '资源ID不能为空';
        _this.editDialogForm.resourcePopId = '';
        _this.resourceIdValidate();
        return;
      }
      // 判断正则数字
      let reg = /^[\d]/g;
      if (!reg.test(_this.editDialogForm.resourcePopId)) {
        _this.errorText = '请输入数字类型';
        _this.editDialogForm.resourcePopId = '';
        _this.resourceIdValidate();
        return;
      }
      _this.errorText = '请输入资源ID并确认';
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.getResource.type,
        url: apiConfig.getResource.url,
        params: {
          resourceId: _this.editDialogForm.resourcePopId, // 资源id 点击了确认按钮以后的
          type: _this.editDialogForm.resourcePopType, // 资源类型
          columnId: 1563551999999 // 栏目id
        }
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let resourceInfo = res.data.responseObject.responseData;
          _this.editDialogForm.popId = resourceInfo.id;
          _this.editDialogForm.resourcePopName = resourceInfo.anthologyName;
          _this.editDialogForm.brandPopName = resourceInfo.brandName;
          _this.editDialogForm.oldResourceNo = resourceInfo.sortId;
          _this.editDialogForm.resourcePopNo = resourceInfo.sortId;
          _this.editDialogForm.oldImgUrl = resourceInfo.imageUrl;
          _this.editDialogForm.imgUrl = resourceInfo.imageUrl;
          _this.editDialogForm.resourceImageUrlSave = resourceInfo.imageUrl;
          _this.uploadFlag = true;
        }
        else if (res.data.responseObject.responseCode === '10001') {
          _this.errorText = '该资源已存在，请勿重复添加';
          _this.editDialogForm.resourcePopId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
        else {
          _this.errorText = '资源ID与所属类型不符，请重新输入';
          _this.editDialogForm.resourcePopId = '';// 置空资源id，目的为了报错
          _this.resourceIdValidate();
        }
      }).catch((e) => {
        comm.closeLoading();
        // this.$allin_confirm({title: '提示', content: '获取失败，请刷新重试', type: 'notice'});
        console.log('失败：', e);
      });
    },
    // 上传图片成功的回调函数
    uploadImgSuccess(data) {
      let _this = this;
      _this.editDialogForm.resourceImageUrlSave = data;
      _this.editDialogForm.imgUrl = apiConfig.imgServer_img05.url + data.attUrl;
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
    // 单独校验资源ID
    resourceIdValidate() {
      let _this = this;
      _this.rules.resourcePopId[0].message = _this.errorText;
      _this.$refs.editDialogForm.validateField('resourcePopId');
    },
    // 新建、编辑发布验证
    submitEditDialogForm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.saveResourceInfo();
        }
        else {
          return false;
        }
      });
    },
    // 新增保存资源
    saveResourceInfo() {
      let _this = this;
      comm.openLoading('加载中...');
      // console.log('当前显示资源', _this.editDialogForm);
      // 请求接口
      let getInterface = apiConfig.addResource;
      // 请求参数
      let params = {
        id: _this.editDialogForm.popId,
        type: _this.editDialogForm.resourcePopType,
        resourceId: Number(_this.editDialogForm.resourcePopId),
        columnId: 1563551999999
      };
      if (_this.editDialogFormTitle === '新增资源') {
        // 新增接口地址
        getInterface = apiConfig.addResource;
        // 新增参数
        // 新旧顺序
        if (_this.editDialogForm.oldResourceNo === _this.editDialogForm.resourcePopNo) {
          params.oldSortId = _this.editDialogForm.oldResourceNo ? Number(_this.editDialogForm.oldResourceNo) : undefined;
          params.newSortId = undefined;
        }
        else {
          params.oldSortId = _this.editDialogForm.oldResourceNo ? Number(_this.editDialogForm.oldResourceNo) : undefined;
          params.newSortId = _this.editDialogForm.resourcePopNo ? Number(_this.editDialogForm.resourcePopNo) : undefined;
        }
        // 图片地址
        if (_this.editDialogForm.oldImgUrl === _this.editDialogForm.imgUrl) {
          _this.editDialogForm.resourceImageUrlSave = undefined;
          params.imageAtt = undefined;
        }
        else {
          params.imageAtt = _this.editDialogForm.resourceImageUrlSave;
        }
      }
      else {
        // 编辑接口地址
        getInterface = apiConfig.editResource;
        // 编辑参数
        // 新旧顺序
        if (_this.editDialogForm.oldResourceNo === _this.editDialogForm.resourcePopNo) {
          params.oldSortId = undefined;
          params.newSortId = undefined;
        }
        else {
          params.oldSortId = _this.editDialogForm.oldResourceNo ? Number(_this.editDialogForm.oldResourceNo) : undefined;
          params.newSortId = _this.editDialogForm.resourcePopNo ? Number(_this.editDialogForm.resourcePopNo) : undefined;
        }
        // 图片地址
        if (_this.editDialogForm.oldImgUrl === _this.editDialogForm.imgUrl) {
          _this.editDialogForm.resourceImageUrlSave = undefined;
          params.imageAtt = undefined;
        }
        else {
          params.imageAtt = _this.editDialogForm.resourceImageUrlSave;
        }
      }
      // console.log('新增、编辑信息', params);
      axios({
        method: getInterface.type,
        url: getInterface.url,
        data: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          _this.dataMainList();// 重新请求列表
          _this.editDialogFormShow = false;
        }
        else { // 没保存成功
          if (res.data.responseObject.responseCode === 1101) { // 该广告名称已存在请重新修改
            _this.editDialogForm.advertisingPopName = '';
            _this.rules.advertisingPopName[0].message = '该广告名称已经存在，请重新输入';
            _this.$refs.editDialogForm.validateField('advertisingPopName');
          }
          else if (res.data.responseObject.responseCode === 1102) {
            _this.errorText = '资源ID与所属类型不符，请重新输入';
            _this.editDialogForm.resourcePopId = '';// 置空资源id，目的为了报错
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
    },
    // 处理上下架
    handleUpAndDown(row) {
      let _this = this;
      let contentMsg = '';
      let msg = '';
      if (row.resourceState === '已上架') {
        contentMsg = '确定将此资源下架么？';
        msg = '下架';
      }
      else {
        contentMsg = '确定将此资源上架么？';
        msg = '上架';
      }
      let newIsValid = row.resourceState === '已上架' ? '已下架' : '已上架';
      this.$allin_confirm({
        content: contentMsg,
        done: () => {
          comm.openLoading('加载中...');
          axios({
            method: apiConfig.editResource.type,
            url: apiConfig.editResource.url,
            data: {
              id: row.id,
              type: row.resourceType,
              refId: row.resourceId,
              valid: row.resourceStateCode === 0 ? 1 : 0
            }
          }).then((response) => {
            if (response && response.data && response.data.responseObject) {
              let responseObject = response.data.responseObject;
              if (responseObject.responseStatus) {
                this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
                row.isValid = newIsValid;
                _this.dataMainList();
              }
              else {
                this.$allin_confirm({title: '提示', content: msg + '失败' + (responseObject.responseMessage), type: 'notice'});
                console.log(responseObject.responseMessage);
              }
            }
            comm.closeLoading();
          }).catch((e) => {
            comm.closeLoading();
            this.$message(msg + '失败');
          });
        }
      });
    }
  },
  mounted() {
    let _this = this;
    _this.dataMainList();// 获取主列表
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
          resourcePopType: '', // 所属类型
          resourcePopId: '', // 资源id
          advertisingPopName: '', // 广告名称
          advertisingPopLinkAddress: '', // 链接地址
          imgUrl: '', // 配图
          imgUrlBanner: '', // 菁英会banner配图
          imgAllinBanner: '', // 唯医学院banner配图
          imgTerminalBanner: '' // 终端页banner配图
        };// 新建/编辑弹层的参数
        _this.needClear = true;// 清空input
        _this.editFlag = '';// 编辑操作记录置空
        _this.sureResourceId = '';// 确认的资源id置为空
        _this.widthMinLimit = '336';// 恢复默认尺寸
        _this.heightMinLimit = '336';// 恢复默认尺寸
        _this.$refs.editDialogForm.resetFields();
      }
      else {
        _this.needClear = false;
      }
    },
    // 检测弹层选择的所属类型，改变配图尺寸
    'editDialogForm.resourcePopType': function(ev1, ev2) {
      let _this = this;
      _this.linkShow = false;// 链接地址默认不显示
      _this.bannerShow = false;// 菁英会不展示
      if (_this.editFlag === '') { // 判断是编辑的首次进入，首次进入不能清
        _this.editDialogForm.resourcePopId = '';
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
      if (_this.editDialogForm.resourcePopId !== '') { // 有确认搜索过的资源id
        _this.uploadFlag = true;// 可以上传图片
      }
      else {
        _this.uploadFlag = false;// 不可以上传图片
      }
    },
    // 检测链接是否显示设置必填项
    linkShow() {
      let _this = this;
      if (_this.linkShow) { // 显示链接地址必填  资源id不必填
        _this.rules.advertisingPopLinkAddress[0].required = true;
        _this.rules.resourcePopId[0].required = false;
      }
      else { // 显示资源id必填  链接地址不必填
        _this.rules.advertisingPopLinkAddress[0].required = false;
        _this.rules.resourcePopId[0].required = true;
      }
    },
    // 检测有没有确认的资源id
    sureResourceId() {
      let _this = this;
      if (_this.sureResourceId !== '') { // 有确认搜索过的资源id
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
          width: 180px;
        }
        .el-date-editor--daterange.el-input__inner {
            width: 350px;
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

  /* 下架按钮 */
  button.changeState.remove {
    background: #FFEBE3 !important;
    border: 1px solid #FF7E4D !important;
    color: #FF7E4D !important;
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
  .resourceIdSureButtonNo {
    display: inline-block;
    height: 32px;
    background: #f5f7fa;
    border-radius: 3px;
    line-height: 32px;
    margin-left: 15px;
    color: #c0c4cc;
    padding: 0 20px;
    cursor: not-allowed;
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
