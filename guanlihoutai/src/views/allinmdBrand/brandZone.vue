<template>
  <section class="advertisingMaterialsBox">
    <!--大标题开始-->
    <h1 class="advertisingTitleName">品牌专区</h1>
    <!--大标题结束-->
    <!--筛选条件开始-->
    <section class="advertisingMaterialsScreening" ref="screenObject" :model="screenObject">
      <aside class="centerItem">
        <span class="titleName">品牌ID</span>
        <el-input class="nameInput" placeholder="输入品牌ID" v-model="screenObject.brandId"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">品牌名称</span>
        <el-input class="nameInput" placeholder="输入品牌名称" v-model="screenObject.brandName"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">顺序号</span>
        <el-input class="nameInput" placeholder="输入顺序号" v-model="screenObject.brandNo"></el-input>
      </aside>
      <aside class="centerItem">
        <span class="titleName">是否为合作品牌</span>
        <el-select placeholder="不限" v-model="screenObject.isCooperation">
          <el-option label="不限" value="" key=""></el-option>
          <el-option
            v-for="item in isCooperationList"
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
        <span class="titleName">更新时间</span>
        <el-date-picker
          v-model="screenObject.updateTime"
          type="daterange"
          align="right"
          start-placeholder="不限"
          end-placeholder="不限"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </aside>
      <aside class="centerItem">
        <span class="titleName">状态</span>
        <el-select placeholder="不限" v-model="screenObject.isValid">
          <el-option label="不限" value="" key=""></el-option>
          <el-option
            v-for="item in isValidList"
            :key="item.code"
            :label="item.description"
            :value="item.code">
          </el-option>
        </el-select>
      </aside>
      <aside class="advertisingButtonBox">
        <p class="resetBtn" @click.stop="resetForm">清空条件</p>
        <p class="screeningBtn" @click.stop="submitForm">筛选</p>
      </aside>
    </section>
    <!--筛选条件结束-->
    <!--列表内容区域开始-->
    <section class="advertisingMaterials">
      <el-table style="width: 100%" :data="listData"
          :default-sort="{prop: 'brandNo', order: 'descending'}" @sort-change="sortIdChange">
        <el-table-column prop="brandId" label="品牌ID" width="180"
          sortable="custom" :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌名称"  width="220">
        </el-table-column>
        <el-table-column prop="brandNo" label="顺序号" width="120"
          sortable="custom" :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column prop="isCooperation" label="合作品牌" width="180">
        </el-table-column>
        <el-table-column prop="addTime" label="添加时间" width="220"
          sortable="custom" :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="220"
          sortable="custom" :sort-orders="['descending','ascending']">
        </el-table-column>
        <el-table-column prop="matchImageUrl" label="预览" width="120">
          <template slot-scope="scope">
            <img src="/static/images/icons/icon-picture_hover_tiny.png"
              class="bigImgShow" v-if="scope.row.matchImageUrl"
              @mouseenter="smallImgMouseenter(scope.row)" @mouseleave="smallImgMouseLeave">
          </template>
        </el-table-column>
        <el-table-column prop="isValid" label="状态" width="100">
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button @click="addAdvertising(scope.row)" @keydown.native.prevent>编辑</el-button>
            <el-button @click="handleUpAndDown(scope.row)" @keydown.native.prevent :class="parseInt(scope.row.isValidCode) === 0 ? 'changeState' : 'changeState remove'">
              {{parseInt(scope.row.isValidCode) === 0 ? '上架' : '下架'}}
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
        <el-form-item label="品牌ID" prop="brandPopId" label-width="140px">
          <el-input placeholder="品牌ID" v-model="editDialogForm.brandPopId" disabled></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandPopName" label-width="140px">
          <el-input placeholder="品牌名称" v-model="editDialogForm.brandPopName" disabled></el-input>
        </el-form-item>
        <el-form-item label="顺序号" prop="brandPopNo" label-width="140px">
          <el-input placeholder="顺序号" v-model="editDialogForm.brandPopNo"></el-input>
        </el-form-item>
        <el-form-item label="配图" class="column-course-img-label img-upload"
                      prop="imgUrl" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :widthHeightMinLimit="[widthMinLimit,heightMinLimit]"
              :needClear="needClear"
              :imgUrl="editDialogForm.imgUrl"
              :uploadFlag="true"
              @deleteSuccess="deleteImgSuccess"
              @uploadSuccess="uploadImgSuccess">
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>
        <el-form-item label="品牌头图" class="column-course-img-label img-upload"
                      prop="imgUrlBanner" label-width="140px">
          <div class="uploadCon">
            <AdvertisingMaterialsImgUpload
              :uploadDesc="''"
              :widthHeightMinLimit="[1005,300]"
              :imgUrl="editDialogForm.imgUrlBanner"
              :needClear="needClear01"
              :uploadFlag="true"
              :isBannerImg="true"
              @deleteSuccess="deleteImgSuccess01"
              @uploadSuccess="uploadImgSuccess01">
            </AdvertisingMaterialsImgUpload>
          </div>
        </el-form-item>
        <el-form-item label="" class="column-course-img-label img-upload" prop="isCooperation" label-width="140px">
          <div class="cosplay-radio" @click="changeCooperation(editDialogForm.isCooperation)">
            <img v-show="editDialogForm.isCooperation === 1 && editDialogForm.isCooperationSelect" src="static/images/icons/icon_radio_selected.png">
            <img v-show="editDialogForm.isCooperation === 1 && !editDialogForm.isCooperationSelect" src="static/images/icons/icon_radio_unselected.png">
            <!-- <span v-if="editDialogForm.isCooperation === 1" @click="changeCooperationA">已是合作品牌</span> -->
            <span v-if="editDialogForm.isCooperation === 1">已是合作品牌</span>
            <img v-show="editDialogForm.isCooperation === 0 && editDialogForm.notCooperationSelect" src="static/images/icons/icon_radio_selected.png">
            <img v-show="editDialogForm.isCooperation === 0 && !editDialogForm.notCooperationSelect" src="static/images/icons/icon_radio_unselected.png">
            <!-- <span v-if="editDialogForm.isCooperation === 0" @click="changeCooperationB">升级为合作品牌</span> -->
            <span v-if="editDialogForm.isCooperation === 0">升级为合作品牌</span>
          </div>
        </el-form-item>
        <el-form-item label="背景颜色" v-show="editDialogForm.showBgSelect" prop="bgColor" label-width="140px">
          <el-select placeholder="请选择" v-model="editDialogForm.bgColor">
            <el-option label="请选择" value="" key=""></el-option>
            <el-option
              v-for="item in bgColorList"
              :value="item.code"
              :label="item.description"
              :key="item.code"
            ></el-option>
          </el-select>
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
import comm from '@/assets/js/utils/comm';
import apiConfig from '@/api/apiUrlConfig';
import AdvertisingMaterialsImgUpload from './components/advertisingMaterialsImgUpload.vue';
import apiUrlConfig from '../../api/apiUrlConfig';

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
      // 筛选条件
      screenObject: {
        // 品牌id
        brandId: '',
        // 品牌名称
        brandName: '',
        // 顺序号
        brandNo: '',
        // 是否为合作厂商
        isCooperation: '',
        // 添加时间
        addTime: '',
        // 更新时间
        updateTime: '',
        // 状态
        isValid: ''
      },
      // 确定筛选的参数值
      submitObj: {
        // 品牌id
        brandId: '',
        // 品牌名称
        brandName: '',
        // 顺序号
        brandNo: '',
        // 是否为合作厂商
        isCooperation: '',
        // 添加时间开始
        createStartTime: '',
        // 添加时间结束
        createEndTime: '',
        // 更新时间开始
        updateStartTime: '',
        // 更新时间结束
        updateEndTime: '',
        // 状态
        isValid: ''
      },
      // 是否是合作厂商列表（筛选条件）
      isCooperationList: [
        {
          code: 1,
          description: '是'
        }, {
          code: 0,
          description: '否'
        }
      ],
      // 状态列表（筛选条件）
      isValidList: [
        {
          code: 1,
          description: '已上架'
        }, {
          code: 0,
          description: '已下架'
        }
      ],
      // ====排序规则，默认顺序号倒叙====
      // 排序字段：1:品牌Id、2:顺序号、3:添加时间、4:更新时间。
      sortBy: 2,
      // 排序顺序：0:正序，1:倒叙。
      asc: 1,
      // 列表数据数组
      listData: [],
      // ====查看大图====
      // 查看大图标志是否显示
      bigImgDialogVisible: false,
      // 查看大图的定时器
      bigImgTimer: null,
      // 查看大图的地址
      bigImgPath: '',
      // ====弹窗====
      // 是否展示
      editDialogFormShow: false,
      // 弹窗名称
      editDialogFormTitle: '编辑品牌',
      // 弹窗编辑字段
      editDialogForm: {
        // id
        id: '',
        // 品牌id
        brandPopId: '',
        // 品牌名称
        brandPopName: '',
        // 顺序号
        brandPopOldNo: '',
        brandPopNo: '',
        // 状态
        brandPopState: '',
        // 配图
        oldImgUrl: '',
        imgUrl: '',
        // 品牌头图
        oldBannerUrl: '',
        imgUrlBanner: '',
        // 是否是合作品牌
        isCooperation: 1,
        // 合作厂商默认选中
        isCooperationSelect: true,
        // 普通厂商默认不选
        notCooperationSelect: false,
        // 是否显示选色
        showBgSelect: true,
        // 品牌背景色
        bgColor: ''
      },
      // 背景颜色列表
      bgColorList: [
        {
          code: 1,
          description: '红'
        }, {
          code: 2,
          description: '橙'
        }, {
          code: 3,
          description: '黄'
        }, {
          code: 4,
          description: '绿'
        }, {
          code: 5,
          description: '蓝'
        }, {
          code: 6,
          description: '靛'
        }, {
          code: 7,
          description: '紫'
        }, {
          code: 8,
          description: '灰'
        }
      ],
      // 资源id错误提示文本
      // errorText: '',
      rules: {
        brandPopId: [
          {required: true, message: '请输入品牌ID并确认', trigger: 'blur'}
        ],
        brandPopName: [
          {required: true, message: '请输入品牌名称', trigger: 'blur change'}
        ],
        brandPopNo: [
          {required: true, message: '请输入顺序号', trigger: 'blur change'}
        ],
        imgUrl: [
          {required: true, message: '请上传配图', trigger: 'change'}
        ],
        imgUrlBanner: [
          {required: true, message: '请上传品牌头图', trigger: 'change'}
        ],
        bgColor: [
          {required: true, message: '请选择背景颜色', trigger: 'change'}
        ]
      },
      // 配图大小
      widthMinLimit: '336',
      heightMinLimit: '336',
      // 是否需要清空配图
      needClear: false,
      // 是否要清空品牌头图
      needClear01: false,
      // 编辑后发布确认信息
      editSubmitForm: {
        sureId: '',
        sureBrandId: '',
        sureBrandName: '',
        oldBrandNo: '',
        sureBrandNo: '',
        sureBrandState: '',
        sureIsCooperation: '',
        sureMatchImg: '',
        sureHeadImg: '',
        sureBgColor: ''
      },
      // 查看大图的高度
      mouseBigImgHeight: 336
    };
  },
  components: {
    AdvertisingMaterialsImgUpload
  },
  methods: {
    // 每页多少条数据
    handleSizeChange(val) {
      let _this = this;
      // 每页多少条
      _this.pageSize = val;
      // 每页多少条更改返回首页
      _this.currentPage = 1;
      // 当前传参
      _this.firstResult = 0;
      // 当前页最多
      _this.maxResult = _this.currentPage * val;
      // 分页参数变化重新请求列表接口
      _this.dataMainList();
    },
    // 当前页面页码
    handleCurrentChange(val) {
      let _this = this;
      // 当前页码
      _this.currentPage = val;
      // 当前传参
      _this.firstResult = (val - 1) * _this.pageSize;
      // 分页参数变化重新请求列表接口
      _this.dataMainList();
    },
    // 排序id变换检测
    sortIdChange(column) {
      let _this = this;
      let _or = column.order;
      // 排序：1:品牌Id、2:顺序号、3:添加时间、4:更新时间。默认顺序号降序
      // 排序方式：降序，反之升序
      _this.asc = (_or === 'descending') ? 1 : 0;
      // console.log('排序方式', _this.asc === 1 ? '降序' : '升序');
      // 排序字段
      switch (column.prop) {
        case 'brandId':
          _this.sortBy = 1;
          // console.log('排序字段：品牌ID');
          break;
        case 'brandNo':
          _this.sortBy = 2;
          // console.log('排序字段：顺序号');
          break;
        case 'addTime':
          _this.sortBy = 3;
          // console.log('排序字段：添加时间');
          break;
        case 'updateTime':
          _this.sortBy = 4;
          // console.log('排序字段：更新时间');
          break;
        default:
          _this.sortBy = 2;
          // console.log('默认字段：顺序号');
          break;
      }
      // 分页回归首页
      _this.currentPage = 1;
      // 当前传参
      _this.firstResult = 0;
      if (_this.listData.length > 0) {
        // 发送请求的列表函数
        _this.dataMainList();
      }
    },
    // 重置筛选条件
    resetForm() {
      this.screenObject = {
        brandId: '',
        brandName: '',
        brandNo: '',
        isCooperation: '',
        addTime: '',
        updateTime: '',
        isValid: ''
      };
    },
    // 提交筛选条件
    submitForm() {
      let _this = this;
      // 回退到第一页
      _this.firstResult = 0;
      _this.currentPage = 1;
      _this.submitObj = {
        brandId: _this.screenObject.brandId,
        brandName: _this.screenObject.brandName,
        brandNo: _this.screenObject.brandNo,
        isCooperation: _this.screenObject.isCooperation,
        createStartTime: _this.screenObject.addTime[0],
        createEndTime: _this.screenObject.addTime[1],
        updateStartTime: _this.screenObject.updateTime[0],
        updateEndTime: _this.screenObject.updateTime[1],
        isValid: _this.screenObject.isValid
      };
      // console.log('筛选条件', _this.submitObj);
      _this.dataMainList();
    },
    // 请求主列表
    dataMainList() {
      let _this = this;
      comm.openLoading('加载中...');
      // 必须参数
      let params = {
        // 排序字段
        sortBy: _this.sortBy,
        // 排序方式
        asc: _this.asc,
        firstResult: _this.firstResult,
        maxResult: _this.maxResult
      };
      // 非必须参数
      params.brandId = _this.submitObj.brandId ? _this.submitObj.brandId : undefined;
      params.brandName = _this.submitObj.brandName ? _this.submitObj.brandName : undefined;
      params.sortId = _this.submitObj.brandNo ? _this.submitObj.brandNo : undefined;
      if (_this.submitObj.isCooperation === 0) {
        params.cooperate = 0;
      }
      else if (_this.submitObj.isCooperation === 1) {
        params.cooperate = 1;
      }
      else {
        params.cooperate = undefined;
      }
      params.createStartTime = _this.submitObj.createStartTime ? _this.submitObj.createStartTime + ' 00:00:00' : undefined;
      params.createEndTime = _this.submitObj.createEndTime ? _this.submitObj.createEndTime + ' 23:59:59' : undefined;
      params.updateStartTime = _this.submitObj.updateStartTime ? _this.submitObj.updateStartTime + ' 00:00:00' : undefined;
      params.updateEndTime = _this.submitObj.updateEndTime ? _this.submitObj.updateEndTime + ' 23:59:59' : undefined;
      if (_this.submitObj.isValid === 0) {
        params.valid = 0;
      }
      else if (_this.submitObj.isValid === 1) {
        params.valid = 1;
      }
      else {
        params.valid = undefined;
      }
      // console.log('请求参数params', params);
      axios({
        method: apiConfig.getBrandList.type,
        url: apiConfig.getBrandList.url,
        params: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          // 列表总数
          _this.totalNum = res.data.responseObject.responseData.totalCount;
          // 列表项
          let items = res.data.responseObject.responseData.items;
          if (items && items.length) {
            _this.listData = [];
            for (let i = 0; i < items.length; i++) {
              let kv = items[i];
              let dataJson = {
                id: kv.id,
                brandId: kv.brandId,
                brandName: kv.brandName,
                brandNo: kv.sortId,
                isCooperationCode: kv.cooperate,
                isCooperation: kv.cooperate === 1 ? '合作品牌' : '-',
                addTime: kv.createTime,
                updateTime: kv.lastUpdateTime,
                matchImageUrl: kv.matchImageUrl ? 'http://' + kv.matchImageUrl : '',
                headImageUrl: kv.headImageUrl ? 'http://' + kv.headImageUrl : '',
                isValidCode: kv.valid,
                isValid: kv.valid === 0 ? '已下架' : '已上架',
                bgColor: kv.colorType
              };
              _this.listData.push(dataJson);
            }
          }
          else {
            _this.totalNum = 0;
            _this.listData = [];
          }
        }
        else {
          _this.totalNum = 0;
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
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      let url = scopeRow.matchImageUrl;
      if (url) {
        _this.bigImgPath = url;
        _this.bigImgDialogVisible = true;
      }
      else {
        _this.bigImgPath = '';
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
    // 编辑按钮操作弹层
    addAdvertising(scopeRow) {
      let _this = this;
      _this.editDialogFormShow = true;
      // console.log('编辑按钮信息', JSON.stringify(scopeRow));
      // 编辑
      if (scopeRow.brandId) {
        _this.needClear = false;
        _this.needClear01 = false;
        _this.editDialogFormTitle = '编辑品牌';
        _this.editDialogForm = {
          id: scopeRow.id,
          brandPopId: scopeRow.brandId,
          brandPopName: scopeRow.brandName,
          brandPopOldNo: scopeRow.brandNo,
          brandPopNo: scopeRow.brandNo,
          brandPopState: scopeRow.isValidCode,
          oldImgUrl: scopeRow.matchImageUrl !== '' ? scopeRow.matchImageUrl : '',
          imgUrl: scopeRow.matchImageUrl !== '' ? scopeRow.matchImageUrl : '',
          oldBannerUrl: scopeRow.headImageUrl !== '' ? scopeRow.headImageUrl : '',
          imgUrlBanner: scopeRow.headImageUrl !== '' ? scopeRow.headImageUrl : '',
          isCooperation: scopeRow.isCooperationCode,
          bgColor: scopeRow.bgColor !== '' ? scopeRow.bgColor : ''
        };
        // 判断是否是合作品牌
        if (scopeRow.isCooperationCode === 0) {
          // console.log('普通品牌，不选中');
          _this.editDialogForm.notCooperationSelect = false;
          _this.editDialogForm.showBgSelect = false;
          _this.rules.imgUrlBanner = [];
          _this.rules.bgColor = [];
          this.$forceUpdate();
        }
        else {
          // console.log('合作品牌，选中');
          _this.editDialogForm.isCooperationSelect = true;
          _this.editDialogForm.showBgSelect = true;
          _this.rules.imgUrlBanner = [{required: true, message: '请上传品牌头图', trigger: 'change'}];
          _this.rules.bgColor = [{required: true, message: '请选择背景颜色', trigger: 'change'}];
          this.$forceUpdate();
        }
      }
    },
    // 选择是否合作
    changeCooperation(cooperation) {
      if (cooperation === 1) {
        this.changeCooperationA();
      }
      else {
        this.changeCooperationB();
      }
    },
    changeCooperationA() {
      let _this = this;
      if (_this.editDialogForm.isCooperationSelect) {
        _this.$allin_confirm({
          content: '确定降级为普通品牌？降级行为在发布成功后生效',
          type: 'confirm',
          done: function() {
            // console.log('确定');
            _this.editDialogForm.isCooperationSelect = false;
            _this.editDialogForm.showBgSelect = false;
            _this.editSubmitForm.sureIsCooperation = 0;
            _this.editDialogForm.bgColor = undefined;
            _this.rules.imgUrlBanner = [];
            _this.rules.bgColor = [];
            _this.$forceUpdate();
          },
          cancel: function() {
            // console.log('取消');
            _this.editDialogForm.isCooperationSelect = true;
            _this.editDialogForm.showBgSelect = true;
            _this.editSubmitForm.sureIsCooperation = 1;
            _this.rules.imgUrlBanner = [{required: true, message: '请上传品牌头图', trigger: 'change'}];
            _this.rules.bgColor = [{required: true, message: '请选择背景颜色', trigger: 'change'}];
            _this.$forceUpdate();
          }
        });
      }
      else {
        _this.$allin_confirm({
          content: '确定升级为合作品牌？升级行为在发布成功后生效',
          type: 'confirm',
          done: function() {
            // console.log('确定');
            _this.editDialogForm.isCooperationSelect = true;
            _this.editDialogForm.showBgSelect = true;
            _this.editSubmitForm.sureIsCooperation = 1;
            _this.rules.imgUrlBanner = [{required: true, message: '请上传品牌头图', trigger: 'change'}];
            _this.rules.bgColor = [{required: true, message: '请选择背景颜色', trigger: 'change'}];
            _this.$forceUpdate();
          },
          cancel: function() {
            // console.log('取消');
            _this.editDialogForm.isCooperationSelect = false;
            _this.editDialogForm.showBgSelect = false;
            _this.editSubmitForm.sureIsCooperation = 0;
            _this.rules.imgUrlBanner = [];
            _this.rules.bgColor = [];
            _this.$forceUpdate();
          }
        });
      }
    },
    changeCooperationB() {
      let _this = this;
      if (_this.editDialogForm.notCooperationSelect) {
        _this.$allin_confirm({
          content: '确定降级为普通品牌？降级行为在发布成功后生效',
          type: 'confirm',
          done: function() {
            // console.log('确定');
            _this.editDialogForm.notCooperationSelect = false;
            _this.editDialogForm.showBgSelect = false;
            _this.editSubmitForm.sureIsCooperation = 0;
            _this.rules.imgUrlBanner = [];
            _this.rules.bgColor = [];
            _this.$forceUpdate();
          },
          cancel: function() {
            // console.log('取消');
            _this.editDialogForm.notCooperationSelect = true;
            _this.editDialogForm.showBgSelect = true;
            _this.editSubmitForm.sureIsCooperation = 1;
            _this.rules.imgUrlBanner = [{required: true, message: '请上传品牌头图', trigger: 'change'}];
            _this.rules.bgColor = [{required: true, message: '请选择背景颜色', trigger: 'change'}];
            _this.$forceUpdate();
          }
        });
      }
      else {
        _this.$allin_confirm({
          content: '确定升级为合作品牌？升级行为在发布成功后生效',
          type: 'confirm',
          done: function() {
            // console.log('确定');
            _this.editDialogForm.notCooperationSelect = true;
            _this.editDialogForm.showBgSelect = true;
            _this.editSubmitForm.sureIsCooperation = 1;
            _this.rules.imgUrlBanner = [{required: true, message: '请上传品牌头图', trigger: 'change'}];
            _this.rules.bgColor = [{required: true, message: '请选择背景颜色', trigger: 'change'}];
            _this.$forceUpdate();
          },
          cancel: function() {
            // console.log('取消');
            _this.editDialogForm.notCooperationSelect = false;
            _this.editDialogForm.showBgSelect = false;
            _this.editSubmitForm.sureIsCooperation = 0;
            _this.rules.imgUrlBanner = [];
            _this.rules.bgColor = [];
            _this.$forceUpdate();
          }
        });
      }
    },
    // 上传配图成功的回调函数
    uploadImgSuccess(data) {
      let _this = this;
      _this.editSubmitForm.sureMatchImg = data;
      _this.editDialogForm.imgUrl = apiUrlConfig.imgServer_img05.url + data.attUrl;
      _this.$refs.editDialogForm.validateField('imgUrl');
    },
    // 删除配图成功的回调操作
    deleteImgSuccess() {
      let _this = this;
      _this.editSubmitForm.sureMatchImg = {};// 图片地址置为空
      _this.needClear = false;// 清空input
      _this.editDialogForm.imgUrl = '';// 删除了
    },
    // 上传品牌头图成功的回调函数
    uploadImgSuccess01(data) {
      let _this = this;
      _this.editSubmitForm.sureHeadImg = data;
      _this.editDialogForm.imgUrlBanner = apiUrlConfig.imgServer_img05.url + data.attUrl;
    },
    // 删除品牌头图成功的回调操作
    deleteImgSuccess01() {
      let _this = this;
      _this.editSubmitForm.sureHeadImg = {};// 图片地址置为空
      _this.needClear01 = false;// 清空input
      _this.editDialogForm.imgUrlBanner = '';// 删除了
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
      // 发布按钮确认的参数
      _this.editSubmitForm = {
        sureId: _this.editDialogForm.id,
        sureBrandId: _this.editDialogForm.brandPopId,
        sureBrandName: _this.editDialogForm.brandPopName,
        oldBrandNo: _this.editDialogForm.brandPopOldNo,
        sureBrandNo: Number(_this.editDialogForm.brandPopNo),
        sureBrandState: undefined,
        sureIsCooperation: _this.editSubmitForm.sureIsCooperation,
        sureMatchImg: _this.editSubmitForm.sureMatchImg,
        sureHeadImg: _this.editSubmitForm.sureHeadImg,
        sureBgColor: _this.editDialogForm.bgColor
      };
      // 新旧顺序号
      if (_this.editDialogForm.brandPopOldNo === Number(_this.editDialogForm.brandPopNo)) {
        _this.editSubmitForm.oldBrandNo = undefined;
        _this.editSubmitForm.sureBrandNo = undefined;
      }
      // 是否合作
      if (_this.editSubmitForm.sureIsCooperation !== 0 && _this.editSubmitForm.sureIsCooperation !== 1) {
        _this.editSubmitForm.sureIsCooperation = undefined;
      }
      // 是否更新配图
      if (_this.editDialogForm.imgUrl === _this.editDialogForm.oldImgUrl) {
        _this.editSubmitForm.sureMatchImg = undefined;
      }
      // 是否更新头图
      if (_this.editDialogForm.imgUrlBanner === _this.editDialogForm.oldBannerUrl) {
        _this.editSubmitForm.sureHeadImg = undefined;
      }
      // 是否选择颜色
      if (_this.editDialogForm.bgColor === null) {
        _this.editSubmitForm.sureBgColor = undefined;
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.saveBrandInfo();
        }
        else {
          return false;
        }
      });
    },
    // 保存品牌
    saveBrandInfo() {
      let _this = this;
      comm.openLoading('加载中...');
      let params = {
        id: _this.editSubmitForm.sureId,
        brandId: _this.editSubmitForm.sureBrandId,
        brandName: _this.editSubmitForm.sureBrandName,
        oldSortId: _this.editSubmitForm.oldBrandNo,
        newSortId: _this.editSubmitForm.sureBrandNo,
        valid: _this.editSubmitForm.sureBrandState,
        cooperate: _this.editSubmitForm.sureIsCooperation,
        matchAtt: _this.editSubmitForm.sureMatchImg,
        headAtt: _this.editSubmitForm.sureHeadImg,
        colorType: _this.editSubmitForm.sureBgColor
      };
      // console.log('保存参数', params);
      axios({
        method: apiConfig.updateBrandList.type,
        url: apiConfig.updateBrandList.url,
        data: params
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data && res.data.responseObject.responseStatus) { // 保存成功
          _this.dataMainList();// 重新请求列表
          _this.editDialogFormShow = false;
        }
        else { // 没保存成功
          if (res.data.responseObject.responseCode === 1101) { // 该广告名称已存在请重新修改
            _this.editDialogForm.brandPopName = '';
            _this.rules.brandPopName[0].message = '该广告名称已经存在，请重新输入';
            _this.$refs.editDialogForm.validateField('brandPopName');
          }
          else if (res.data.responseObject.responseCode === 1102) {
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
    },
    // 处理上下架
    handleUpAndDown(row) {
      let _this = this;
      let contentMsg = '';
      let msg = '';
      if (row.isValid === '已下架') {
        contentMsg = '确定将此资源上架么？';
        msg = '上架';
      }
      else {
        contentMsg = '确定将此资源下架么？';
        msg = '下架';
      }
      let newIsValid = row.isValid === '已下架' ? '已上架' : '已下架';
      this.$allin_confirm({
        content: contentMsg,
        done: () => {
          axios({
            method: apiConfig.updateBrandList.type,
            url: apiConfig.updateBrandList.url,
            data: {
              id: row.id,
              brandId: row.brandId,
              valid: row.isValidCode === 0 ? 1 : 0
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
    // document.onkeydown = (e) => {
    //   if (e.keyCode === 13) {
    //     if (!this.bigImgDialogVisible) {
    //       _this.submitForm();// 触发提交按钮
    //     }
    //   }
    // };
  },
  computed: {},
  watch: {
    // 关闭弹层的时候清空表单和上传的图片
    editDialogFormShow() {
      let _this = this;
      // 弹层不可见状态，重置填写的内容
      if (!_this.editDialogFormShow) {
        _this.editDialogForm = {
          // id
          id: '',
          // 品牌id
          brandPopId: '',
          // 品牌名称
          brandPopName: '',
          // 顺序号
          brandPopOldNo: '',
          brandPopNo: '',
          // 状态
          brandPopState: '',
          // 配图
          imgUrl: '',
          // 品牌头图
          imgUrlBanner: '',
          // 是否是合作品牌
          isCooperation: 1,
          // 合作厂商默认选中
          isCooperationSelect: true,
          // 普通厂商默认不选
          notCooperationSelect: false,
          // 是否显示选色
          showBgSelect: true,
          // 品牌背景色
          bgColor: ''
        };
        _this.needClear = true;// 清空input
        _this.needClear01 = true;// 清空input
        _this.widthMinLimit = '336';// 恢复默认尺寸
        _this.heightMinLimit = '336';// 恢复默认尺寸
        _this.$refs.editDialogForm.resetFields();
      }
      else {
        _this.needClear = false;
        _this.needClear01 = false;
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
          width: 168px;
        }
        .el-date-editor--daterange, .el-select {
          margin-right: 44px;
        }
        .el-date-editor--daterange.el-input__inner {
            width: 332px;
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
      width: 220px;
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
  /* 模拟radio */
  .el-form-item {
    .cosplay-radio {
      display: flex;
      flex-direction: row;
      align-items: center;
      img {
        width: 14px;
        height: 14px;
      }
      span {
        height: 16px;
        line-height: 16px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
</style>
