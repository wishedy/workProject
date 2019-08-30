<template>
  <section class="boneCloud-main-contains">
    <h1>骨人云后台</h1>
    <section class="search_area">
      <el-form ref="boneCloudForm" :model="searchForm" label-width="80px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="用户ID" prop="customerId">
              <el-input
                v-model="searchForm.customerId"
                placeholder="输入用户ID"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户姓名" prop="customerName">
              <el-input
                v-model="searchForm.customerName"
                placeholder="输入用户姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9" style="margin-left: 40px;">
            <el-form-item label="添加时间">
              <el-col :span="11">
                <el-date-picker
                  v-model="createTime"
                  type="daterange"
                  align="right"
                  start-placeholder="不限"
                  end-placeholder="不限"
                  range-separator="到"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                >
                </el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="isValid">
              <el-select v-model="searchForm.isValid" placeholder="全部">
                <!--1- 上架 2-下架-->
                <el-option label="全部" value=""></el-option>
                <el-option label="已上架" value="1"></el-option>
                <el-option label="已下架" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="标签" prop="itemType">
              <el-select v-model="searchForm.itemType" placeholder="全部">
                <el-option label="全部" value=""></el-option>
                <el-option label="手术" value="71"></el-option>
                <el-option label="疾病" value="72"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="评论数" prop="reviewNum">
              <el-select v-model="searchForm.reviewNum" placeholder="不限">
                <!--
                0        0
                1-10     1
                11-20    2
                21-30    3
                31-40    4
                41-50    5
                50以上    6
                -->
                <el-option label="不限" value=""></el-option>
                <el-option label="0" value="0"></el-option>
                <el-option label="1-10" value="1"></el-option>
                <el-option label="11-20" value="2"></el-option>
                <el-option label="21-30" value="3"></el-option>
                <el-option label="31-40" value="4"></el-option>
                <el-option label="41-50" value="5"></el-option>
                <el-option label="50以上" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="点赞数" prop="upNum">
              <el-select v-model="searchForm.upNum" placeholder="不限">
                <!--
                0        0
                1-10     1
                11-20    2
                21-30    3
                31-40    4
                41-50    5
                50以上    6
                -->
                <el-option label="不限" value=""></el-option>
                <el-option label="0" value="0"></el-option>
                <el-option label="1-10" value="1"></el-option>
                <el-option label="11-20" value="2"></el-option>
                <el-option label="21-30" value="3"></el-option>
                <el-option label="31-40" value="4"></el-option>
                <el-option label="41-50" value="5"></el-option>
                <el-option label="50以上" value="6"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <el-form-item label="视频数" prop="videoNum">
              <el-select
                v-model="searchForm.videoNum"
                placeholder="不限"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="1" value="1"></el-option>
                <el-option label="0" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="标签内容"
              prop="itemName"
            >
              <el-input
                v-model="searchForm.itemName"
                placeholder="输入标签内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item
              label="参与活动"
              prop="movementActivityName"
            >
              <el-input
                v-model="searchForm.movementActivityName"
                placeholder="输入活动名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="置顶" prop="isHeader">
              <el-select
                v-model="searchForm.isHeader"
                placeholder="不限"
              >
                <el-option label="不限" value=""></el-option>
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6" style="margin-right: 10px;float: right;">
            <el-form-item class="submitBtn">
              <el-button @click="resetForm">清空条件</el-button>
              <el-button @click="onSubmit">&nbsp;&nbsp;检索&nbsp;&nbsp;</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </section>
    <section class="source-list">
      <el-table
        :data="tableData"
        @cell-click="cellClick"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="resId"
          label="骨人云ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="resCustomerId"
          label="用户ID"
          width="130"
        >
        </el-table-column>
        <el-table-column
          prop="resCustomerName"
          label="用户姓名">
        </el-table-column>
        <el-table-column
          prop="resContent"
          label="发布内容"
          width="126"
          class="line-clamp-3"
          :formatter="resContentFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="resCreateTime"
          width="100"
          label="发布时间"
          :formatter="dataTimeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="imgPath"
          label="图片"
        >
          <template slot-scope="scope">
            <img
              src="/static/images/icons/icon-picture_hover_tiny.png"
              class="bigImgShow"
              alt=""
              v-if="scope.row.bigImgPath"
              @mouseenter="smallImgMouseenter(scope.row.bigImgPath)"
              @mouseleave="smallImgMouseLeave"
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="videoPicPath"
          width="108"
          label="视频">
          <template slot-scope="scope">
            <div class="videoPic" v-if="scope.row.videoPicPath">
              <img :src="scope.row.videoPicPath" alt="">
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="itemType"
          label="标签"
          :formatter="itemTypeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="itemTitle"
          label="标签内容"
          :formatter="emptyValueFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="movementActivityName"
          label="参与活动"
          :formatter="movementActivityNameFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="isHeader"
          label="置顶"
          :formatter="isHeaderFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="reviewNum"
          label="评论数">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="aLink">{{scope.row.reviewNum}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="upNum"
          label="点赞数">
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="aLink">{{scope.row.upNum}}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="isValid"
          label="状态"
          :formatter="isValidFormatter"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          width="280"
          label="操作"
          style="text-align: center"
        >
          <template slot-scope="scope">
                <el-button
                  @keydown.native.prevent
                  @click="yunYunDetailShow(scope.row)"
                  class="viewBotton"
                >
                  查看
                </el-button>

                <!--yellowBtn 置顶的状态 文字为 "取消置顶"-->
                <el-button
                  @keydown.native.prevent
                  @click="yunYunChangeHeaderBottonOnClick(scope.row)"
                  class="changeStateBotton"
                  :class="scope.row.isHeader== 0 ? '':'yellowBtn' "
                  v-if="scope.row.resCustomerName ==='唯老师' && scope.row.movementActivityId && parseInt(scope.row.movementActivityId) !== 0  &&  parseInt(scope.row.isValid) === 1"
                >
                  {{parseInt(scope.row.isHeader) === 0 ? "置顶" : "取消置顶"}}
                </el-button>

                <!--yellowBtn 上线的状态 文字为 "下架"-->
                <el-button
                  @keydown.native.prevent
                  @click="yunYunChangeStateBottonOnClick(scope.row)"
                  class="changeStateBotton"
                  :class="parseInt(scope.row.isValid) === 2 ? '':'yellowBtn' "
                >
                  {{parseInt(scope.row.isValid) === 2 ? "上架" : "下架"}}
                </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="pagination">
        <el-col :span="10" :offset="5">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </section>
    <!--表格点击查看大图-->
    <div
      class="tableBigImgDialog"
      v-if="bigImgDialogVisible"
      @mouseenter="bigImgMouseenter"
      @mouseleave="bigImgMouseLeave"
    >
      <img
        :src="bigImgPath"
        alt=""
      >
    </div>
  <!--查看云云大图-->
    <el-dialog
    title=""
    :visible.sync="yunYunDetailBigImgVisible"
    width="375px"
    class="yunYunDetailBigImgDialog"
    :show-close=false
    :lock-scroll=true
    >
      <img :src="bigImgPath" alt="">
    </el-dialog>

    <!--视频播放-->
    <el-dialog
      title=""
      :visible.sync="videoDialogVisible"
      width="375px"
      :show-close=false
      class="VideoPlayDialog"
      :lock-scroll=true
    >
      <video
        width="375"
        height="auto"
        controls
        controlsList="nodownload"
        style="float: left"
        ref="videoDom"
      >
        <source :src="nowVideoPath" type="video/mp4">
        您的浏览器不支持 video 标签。
      </video>
    </el-dialog>

    <el-dialog
      title="查看云云"
      :visible.sync="yunYunDetailDialogVisible"
      width="756px"
      top="18vh"
      :before-close="handleClose"
      custom-class="yunYunDetailDialog"
      :center=true
      :lock-scroll=true
    >
      <h4>
        <span>{{yunYunDetailData.rowData.resCustomerName}}</span>
        <span>{{yunYunDetailData.rowData.resCustomerTitle}}</span>
        <span>{{yunYunDetailData.rowData.resCustomerCompany}}</span>
      </h4>
      <p class="article">
        <span class="isHeader" v-if="parseInt(yunYunDetailData.rowData.isHeader) === 1">[置顶]</span>
        <span class="movementActivityName" v-if="yunYunDetailData.rowData.movementActivityName">#{{yunYunDetailData.rowData.movementActivityName}}#</span>
        {{yunYunDetailData.rowData.resContent}}
      </p>
      <ul
        v-if="yunYunDetailData.rowData && yunYunDetailData.rowData.resAttUrl && yunYunDetailData.rowData.resAttUrl[0] && yunYunDetailData.rowData.resAttUrl[0].attType && parseInt(yunYunDetailData.rowData.resAttUrl[0].attType) === 2 "
      >
        <li v-for="(item,index) in yunYunDetailData.rowData.resAttUrl" :key="index">
          <img :src="item.picUrl" alt="" @click="yunYunDetailBigImg(item)">
        </li>
      </ul>
      <!--视频-->
      <div
        class="yunYunDetaiVideo"
        v-if="yunYunDetailData.rowData && yunYunDetailData.rowData.resAttUrl && yunYunDetailData.rowData.resAttUrl[0] && yunYunDetailData.rowData.resAttUrl[0].attType && parseInt(yunYunDetailData.rowData.resAttUrl[0].attType) === 1 "
      >
        <!--@click="yunYunDetailVideoPlay(yunYunDetailData.rowData.resAttUrl[0])">-->
        <!--<img :src="yunYunDetailData.rowData.resAttUrl[0].picUrl" alt="">-->
        <video
          width="375"
          height="auto"
          controls
          controlsList="nodownload"
          ref="yunYunVideoDom"
        >
          <source :src="yunYunDetailData.rowData.resAttUrl[0].videoUrl" type="video/mp4">
          您的浏览器不支持 video 标签。
        </video>
      </div>
      <p class="tag">标签: <span>{{itemTypeFormatterForYunYun(yunYunDetailData.rowData.itemType)}}，{{yunYunDetailData.rowData.itemTitle}}</span>
      </p>
      <div class="button-next" @click="yunYunDetailNext"></div>
      <div class="button-prev" @click="yunYunDetailPrev"></div>

      <div slot="footer">
        <!--yellowBtn 上线的状态 文字为 "取消置顶"-->
        <el-button
          @click="yunYunDetailUpdataHeader"
          class="backgroundEDF1FF"
          :class="parseInt(yunYunDetailData.rowData.isHeader) === 0 ? 'yellowBtn':''"
          v-if="!yunYunDetailData.isConfirm && yunYunDetailData.rowData.resCustomerName ==='唯老师' && yunYunDetailData.rowData.movementActivityId  && parseInt(yunYunDetailData.rowData.movementActivityId) !== 0 &&  parseInt(yunYunDetailData.rowData.isValid) === 1"
        >
          <!-- 是否置顶1-是，0-否，“”-不限-->
          <!--此处是动作 与状态相反-->
          {{parseInt(yunYunDetailData.rowData.isHeader) === 0 ? "置顶" :"取消置顶"}}
        </el-button>

        <el-button @click="yunYunDetailData.isConfirm = false;" class="yellowBtn" v-if="yunYunDetailData.isConfirm">否
        </el-button>
        <el-button @click="yunYunDetailUpdata" v-if="yunYunDetailData.isConfirm">是</el-button>

        <!--yellowBtn 上线的状态 文字为 "下架"-->
        <el-button
          @click="yunYunDetailUpdataIsValid"
          class="backgroundEDF1FF"
          :class="parseInt(yunYunDetailData.rowData.isValid) === 2 ? 'yellowBtn':''"
          v-if="!yunYunDetailData.isConfirm"
        >
          <!--1 代表 上架 2 代表 下架 状态-->
          <!--此处是动作 与状态相反-->
          {{parseInt(yunYunDetailData.rowData.isValid) === 2 ? "上架" :"下架"}}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      :title="'查看评论'+reviewData.total"
      width="756px"
      :visible.sync="reviewDialogVisible"
      custom-class="reviewDialog"
      :center=true
    >
      <section>
        <article v-for="(item,index) in reviewData.rowData" :key="index">
          <h4>
            <span>{{item.customerName}}</span>
            <span>{{item.customerTitle}}</span>
            <span>{{item.customerCompany}}</span>
          </h4>
          <div class="commentContent">
            <p>回复 <span>{{item.parentCustomerName}}:</span> <span>{{item.createTime && item.createTime.length && item.createTime.substring(0, item.createTime.length - 2)}}</span></p>
            <p>{{item.reviewContent}}</p>
          </div>
          <div class="button-group">
            <button  class="" @click="item.isConfirm=true" v-if="parseInt(item.reviewStatus) === 1 && !item.isConfirm">下架</button>
            <button class="yellowBtn backgroundEDF1FF" @click="item.isConfirm=true"  v-if="parseInt(item.reviewStatus) === 2 && !item.isConfirm">上架</button>
            <button class="yellowBtn" @click="item.isConfirm = false" v-if="item.isConfirm">否</button>
            <button @click="updataReviewState(item)" v-if="item.isConfirm">是</button>
          </div>
          <p class="isDel" v-if="parseInt(item.reviewStatus) === 3 && !item.isConfirm"><i class="el-icon-circle-close-outline"></i>该内容已被删除</p>
        </article>
      </section>
      <div class="button-next" @click="reviewlNext"></div>
      <div class="button-prev" @click="reviewlPrev"></div>
    </el-dialog>

    <el-dialog
      title="查看点赞"
      :visible.sync="likeDialogVisible"
      custom-class="likeDialog"
      width="756px"
      :center=true
    >
      <section>
        <article v-for="(item,index) in likeData.rowData" :key="index">
          <p class="time">{{ item.createTime }}</p>
          <h4>
            <span>{{ item.customerName|| "" }}</span>
            <span>{{ item.customerTitle || "" }}</span>
            <span>{{ item.customerCompany || "" }}</span>
          </h4>
        </article>

      </section>
      <div class="button-next" @click="likeNext"></div>
      <div class="button-prev" @click="likePrev"></div>
    </el-dialog>

  </section>
</template>
<script>
import axios from '@/assets/js/utils/request.js';
import apiConfig from '@/api/apiUrlConfig';
import comm from '@/assets/js/utils/comm.js';

export default {
  name: 'bone-cloud',
  data() {
    return {
      searchForm: {
        customerId: '',
        customerName: '',
        startTime: '', // 开始时间（2019-01-09 12:00:00）
        endTime: '', // 结束时间
        isValid: '', // 1- 上架 2-下架
        itemType: '', // 1-视频 71-手术 72-疾病
        itemName: '', // 标签内容
        upNum: '',
        reviewNum: '',
        videoNum: '',
        isHeader: '', // 否置顶
        movementActivityName: '' // 活动内容
      },
      createTime: '',
      tableData: [],
      tableParams: {
        firstResult: 0, // 分页参数0
        maxResult: 20, // 分页参数20
        sortType: 1 // 传1 是倒序 ，传2或者不传是正序
      },
      // 分页参数
      currentPage: 1, // 当前页
      pageSize: 20, // 每页条数
      total: 0, // 总数

      // 查看大图
      bigImgPath: '',
      bigImgDialogVisible: false,
      bigImgTimer: null, // 定时器

      // 视频播放
      nowVideoPath: '',
      videoDialogVisible: false,

      // 评论
      reviewDialogVisible: false,
      reviewData: {
        index: 0, // 表格中的索引
        isConfirm: false, // 是否点击了下架按钮,二次确认
        isPengding: false, // 评论接口是否在请求中
        rowData: {},
        total: 0
      },
      // 查看云云
      yunYunDetailDialogVisible: false,
      yunYunDetailData: {
        // 是否点击了下架或者置顶按钮,二次确认
        // 主要用于判断 `是` `否` 按钮是否展示
        isConfirm: false,

        // 在调用接口时,判断是由上下架 还是 置顶 按钮 触发
        isUpDownConfirm: false, // 是否点击了上下架,确定按钮,二次确认
        isHeaderConfirm: false, // 是否点击了 置顶 ,确定按钮,二次确认

        rowData: {}
      },
      yunYunDetailBigImgVisible: false, // 云云查看大图是否显示

      // 点赞数
      likeDialogVisible: false,
      likeData: {
        index: 0,
        isPengding: false, // 评论接口是否在请求中
        rowData: {}
      }

    };
  },
  components: {},
  methods: {
    // 获取表格数据
    getTableData() {
      comm.openLoading('加载中...');
      axios({
        method: apiConfig.boneCloudGetMapList.type,
        url: apiConfig.boneCloudGetMapList.url,
        params: this.tableParams
      }).then((response) => {
        comm.closeLoading();
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
          let responseData = response.data.responseObject.responseData;
          if (responseData.dataList) {
            for (let i = 0; i < responseData.dataList.length; i++) {
              // 大于9条 做截取
              if (responseData.dataList[i].resAttUrl && responseData.dataList[i].resAttUrl.length > 9) {
                responseData.dataList[i].resAttUrl.length = 9;
              }
            }
            this.tableData = responseData.dataList;
            this.total = responseData.total;
          }
          else {
            this.tableData = [];
            this.total = 0;
          }
        }
      }).catch((e) => {
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
        console.log('拉取表格数据失败：', e);
      });
    },
    // 拉取评论数据
    getReviewData(params) {
      // resId string 资源ID
      // resType string 99
      let _this = this;
      comm.openLoading('加载中...');
      this.reviewData.isPengding = true;
      _this.reviewData.rowData = {};
      _this.reviewData.total = 0;
      axios({
        method: apiConfig.boneCloudGetReviewData.type,
        url: apiConfig.boneCloudGetReviewData.url,
        params: params
      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
          if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
            let responseData = response.data.responseObject.responseData;
            if (responseData.dataList) {
              for (let i = 0; i < responseData.dataList.length; i++) {
                // 数据新增 不需要 二次确认状态
                responseData.dataList[i].isConfirm = false;
              }
              _this.reviewData.rowData = responseData.dataList;
              _this.reviewData.total = responseData.total;
            }
          }
        }
        else {
          this.$allin_confirm({title: '提示', content: '获取评论数据失败', type: 'notice'});
        }
        this.reviewData.isPengding = false; // 接口查询完成
        comm.closeLoading();
      }).catch((e) => {
        this.reviewData.isPengding = false; // 接口查询完成
        comm.closeLoading();
        this.$allin_confirm({title: '提示', content: '获取评论数据失败', type: 'notice'});
        console.log('拉取评论数据失败：', e);
      });
    },
    // 获取点赞数据
    getLikeData(params) {
      // resId string 云云ID
      comm.openLoading('加载中...');
      this.likeData.isPengding = true; // 接口查询进行中,未完成
      axios({
        method: apiConfig.boneCloudGetLikeData.type,
        url: apiConfig.boneCloudGetLikeData.url,
        params: params
      }).then((response) => {
        // 非异常
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
          if (response && response.data && response.data.responseObject && response.data.responseObject.responseData) {
            if (response.data.responseObject.responseData.dataList) {
              this.likeData.rowData = response.data.responseObject.responseData.dataList;
            }
            else {
              this.likeData.rowData = {};
            }
          }
        }
        else {
          // 异常
          // 关闭点赞弹窗
          this.likeDialogVisible = false;
          this.$allin_confirm({title: '提示', content: '获取数据失败', type: 'notice'});
        }
        comm.closeLoading();
        this.likeData.isPengding = false; // 接口查询完成
      }).catch((e) => {
        comm.closeLoading();
        this.likeData.isPengding = false; // 接口查询完成
        this.$allin_confirm({title: '提示', content: '获取数据失败', type: 'notice'});
        console.log('获取点赞数据失败：', e);
      });
    },

    // 查询
    onSubmit() {
      //   createTimeGt: '',//提交时间开始
      //   createTimeLt: '',//提交时间结束
      if (Array.isArray(this.createTime) && this.createTime.length > 0) {
        this.searchForm.startTime = this.createTime[0];
        this.searchForm.endTime = this.createTime[1];
      }
      else {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
      }

      // 数据为空不提交
      let newObj = {};
      for (let key in this.searchForm) {
        if (this.searchForm[key].toString()) {
          newObj[key] = this.searchForm[key];
        }
      }

      // 要将排序,开始索引,结束索引,每页包含数恢复初始值
      // 针对两个时间字段
      this.tableParams = this.deepExtend({}, {
        firstResult: 0,
        maxResult: 20,
        sortType: 1 //  传1 是倒序 ，传2或者不传是正序
      }, newObj);

      // 恢复默认值
      this.pageSize = 20;
      this.currentPage = 1;

      this.getTableData();
    },
    // form重置
    resetForm() {
      this.$refs['boneCloudForm'].resetFields();
      // 对时间组件进行重置
      this.createTime = [];
      this.searchForm.startTime = '';
      this.searchForm.endTime = '';
    },
    /** **************表格**************/

    // 表格图片hover事件
    smallImgMouseenter(bigImgPath) {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
      if (bigImgPath) {
        // 查看大图时,大图url按照规则对缩略图进行获取后获得
        let url = bigImgPath;
        if (url) {
          // 包含_c_t  则保留_c + 后缀
          if (url.includes('_c_t')) {
            this.bigImgPath = url.substring(0, url.indexOf('_c_t')) + '_c' + url.substring(url.lastIndexOf('.'), url.length);
          }
          else {
            this.bigImgPath = url;
          }
        }
        else {
          this.bigImgPath = '';
        }
        this.bigImgDialogVisible = true;
      }
    },
    smallImgMouseLeave() {
      let _this = this;
      _this.bigImgTimer = setTimeout(function() {
        _this.bigImgDialogVisible = false;
      }, 1000);
    },
    bigImgMouseenter() {
      if (this.bigImgTimer) {
        clearTimeout(this.bigImgTimer);
      }
    },
    bigImgMouseLeave() {
      this.bigImgDialogVisible = false;
    },
    // 单元格点击
    cellClick(row, column, cell, event) {
      if (column.property === 'reviewNum') {
        // 评论数
        this.reviewDialogVisible = true;
        this.reviewData.index = row.index;
        // resId 资源ID
        // resType string 99
        this.getReviewData({
          refId: row.resId,
          resType: row.resType,
          sortType: 2,
          firstResult: 0,
          maxResult: 100
        });
      }
      else if (column.property === 'upNum') {
        // 点赞数
        this.likeDialogVisible = true;
        this.likeData.index = row.index;
        // resId string 云云ID
        this.getLikeData({
          resId: row.resId,
          sortType: 2
        });
      }
      else if (column.property === 'videoPicPath') {
        if (row.videoPath) { // 为空不添加天机事件
          // 视频弹窗
          this.videoDialogVisible = true;
          this.nowVideoPath = row.videoPath;
          this.$refs.videoDom && this.$refs.videoDom.load();
        }
      }
    },
    tableRowClassName({row, rowIndex}) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    dataTimeFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length) {
        return cellValue.substring(0, cellValue.length - 2);
      }
    },
    emptyValueFormatter(row, column, cellValue) {
      if (cellValue) {
        return cellValue;
      }
      else {
        return '无';
      }
    },
    movementActivityNameFormatter(row, column, cellValue) {
      if (cellValue) {
        return '#' + cellValue + '#';
      }
      else {
        return '未参与';
      }
    },
    resContentFormatter(row, column, cellValue) {
      if (cellValue && cellValue.length) {
        return comm.getStrLen(cellValue, 50);
      }
      else {
        return cellValue;
      }
    },
    itemTypeFormatter(row, column, cellValue) {
      // 1-视频  71-手术  72-疾病
      let value = parseInt(row.itemType);
      let valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '视频';
          break;
        case 71:
          valueDesc = '手术';
          break;
        case 72:
          valueDesc = '疾病';
          break;
        default:
          valueDesc = '无';
          break;
      }
      return valueDesc;
    },
    isValidFormatter(row, column, cellValue) {
      let value = parseInt(row.isValid);
      let valueDesc = '';
      // 1  有效、2  无效  //1.上架  2.下架
      switch (value) {
        case 1:
          valueDesc = '已上架';
          break;
        case 2:
          valueDesc = '已下架';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    isHeaderFormatter(row, column, cellValue) {
      let value = parseInt(cellValue);
      let valueDesc = '';
      // 是否置顶（3.1新增，1-是，0-否）
      switch (value) {
        case 1:
          valueDesc = '是';
          break;
        case 0:
          valueDesc = '否';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    // 修改上架下架状态
    yunYunChangeStateBottonOnClick(row) {
      // 1 代表 上架 2 代表 下架
      let contentMsg = '';
      let msg = '';
      if (parseInt(row.isValid) === 1) {
        contentMsg = '确定将此云云下架么？所有用户包括发布者都将看不到此条云云。';
        msg = '下架';
      }
      else {
        contentMsg = '确定将此条云云上架么？所有用户都将可见。';
        msg = '上架';
      }

      this.$allin_confirm({
        title: '提示',
        content: contentMsg,
        done: () => {
          // put 方法
          // resid 17
          // sValid 1-发布（显示）；2-系统屏蔽（下架）；3-用户删除；４－草稿
          axios({
            method: apiConfig.boneCloudYunYunChangeState.type,
            url: apiConfig.boneCloudYunYunChangeState.url,
            data: {
              resId: row.resId,
              isValid: parseInt(row.isValid) === 1 ? 2 : 1
            }
          }).then((response) => {
            if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
              this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
              row.isValid = parseInt(row.isValid) === 1 ? 2 : 1;
              this.getTableData();// 重新拉取表格数据
            }
            else {
              this.$allin_confirm({title: '提示', content: msg + '失败', type: 'notice'});
            }
          }).catch((e) => {
            this.$allin_confirm({title: '提示', content: msg + '失败', type: 'notice'});
            console.log('获取云云上下架失败：', e);
          });
        }
      });
    },

    /** ***************置顶*******************/
    // 列表内修改置顶状态
    yunYunChangeHeaderBottonOnClick(row) {
      // 默认参数值为0（1-置顶，0-取消置顶
      let contentMsg = '';
      let msg = '';
      if (parseInt(row.isHeader) === 1) {
        contentMsg = '确定将此云云取消置顶？';
        msg = '取消置顶';
      }
      else {
        contentMsg = '确定将此云云置顶？确定后将取代原置顶内容。';
        msg = '置顶';
      }

      this.$allin_confirm({
        title: '提示',
        content: contentMsg,
        done: () => {
          axios({
            method: apiConfig.boneCloudYunYunChangeState.type,
            url: apiConfig.boneCloudYunYunChangeState.url,
            data: {
              resId: row.resId,
              isHeader: parseInt(row.isHeader) === 1 ? 0 : 1
            }
          }).then((response) => {
            if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
              this.$allin_confirm({title: '提示', content: msg + '成功', type: 'notice'});
              this.getTableData(); // 重新拉去表格
            }
            else {
              this.$allin_confirm({title: '提示', content: msg + '失败', type: 'notice'});
            }
          }).catch((e) => {
            this.$allin_confirm({title: '提示', content: msg + '失败', type: 'notice'});
          });
        }
      });
    },
    /** **************查看云云**************/
    // 查看云云 按钮
    yunYunDetailShow(row) {
      this.yunYunDetailDialogVisible = true;
      this.yunYunDetailData.rowData = this.tableData[row.index];
      this.yunYunDetailData.isConfirm = false;// 点开始初始化
      this.$refs.yunYunVideoDom && this.$refs.yunYunVideoDom.load();
    },

    // 更新置顶
    yunYunDetailUpdataHeader() {
      this.yunYunDetailData.isUpDownConfirm = false;
      this.yunYunDetailData.isHeaderConfirm = true;

      this.yunYunDetailData.isConfirm = true;
    },

    // 更新上下架
    yunYunDetailUpdataIsValid() {
      this.yunYunDetailData.isUpDownConfirm = true;
      this.yunYunDetailData.isHeaderConfirm = false;

      this.yunYunDetailData.isConfirm = true;
    },

    // 云云上下架/置顶
    yunYunDetailUpdata() {
      let _this = this;
      let row = this.yunYunDetailData.rowData;
      if (this.yunYunDetailData.isUpDownConfirm) {
        axios({
          method: apiConfig.boneCloudYunYunChangeState.type,
          url: apiConfig.boneCloudYunYunChangeState.url,
          data: {
            resId: row.resId,
            isValid: parseInt(row.isValid) === 1 ? 2 : 1
          }
        }).then((response) => {
          if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
            row.isValid = parseInt(row.isValid) === 1 ? 2 : 1;
            row.isHeader = 0; // 重置 下架后后台会重置 置顶 状态 为下架
            this.getTableData();// 重新拉取表格数据

            this.$message({
              type: 'info',
              message: '操作成功'
            });
          }
          else {
            console.log('获取云云上下架失败：');
          }
          // 改变按钮状态
          _this.yunYunDetailData.isConfirm = false;
        }).catch((e) => {
          console.log('获取云云上下架失败：', e);
        });
      }

      // 如果是由置顶按钮触发的
      if (this.yunYunDetailData.isHeaderConfirm) {
        axios({
          method: apiConfig.boneCloudYunYunChangeState.type,
          url: apiConfig.boneCloudYunYunChangeState.url,
          data: {
            resId: row.resId,
            isHeader: parseInt(row.isHeader) === 1 ? 0 : 1

          }
        }).then((response) => {
          if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus) {
            this.getTableData();// 重新拉取表格数据
            // 重新刷新表格后,需要单独处理 this.yunYunDetailData.rowData 数据
            row.isHeader = parseInt(row.isHeader) === 1 ? 0 : 1;

            this.$message({
              type: 'info',
              message: '操作成功'
            });
          }
          else {
            console.log('云云置顶失败：');
          }
          // 改变按钮状态
          _this.yunYunDetailData.isConfirm = false;
        }).catch((e) => {
          console.log('云云置顶失败：', e);
        });
      }
    },
    // 标签格式化 用于查看云云
    itemTypeFormatterForYunYun(itemType) {
      // 1-视频  71-手术  72-疾病
      let value = parseInt(itemType);
      let valueDesc = '';
      switch (value) {
        case 1:
          valueDesc = '视频';
          break;
        case 71:
          valueDesc = '手术';
          break;
        case 72:
          valueDesc = '疾病';
          break;
        default:
          valueDesc = '无';
          break;
      }
      return valueDesc;
    },

    yunYunDetailBigImg(item) {
      // 查看大图时,大图url按照规则对缩略图进行获取后获得
      let url = item.picUrl;
      if (url) {
        // 包含_c_t  则保留_c + 后缀
        if (url.includes('_c_t')) {
          this.bigImgPath = url.substring(0, url.indexOf('_c_t')) + '_c' + url.substring(url.lastIndexOf('.'), url.length);
        }
        else {
          this.bigImgPath = url;
        }
      }
      else {
        this.bigImgPath = '';
      }

      // 是图片
      // this.bigImgPath = item.picUrl;
      this.yunYunDetailBigImgVisible = true;
    },
    // 查看云云下一条
    yunYunDetailNext() {
      let index = this.yunYunDetailData.rowData.index + 1;
      if (index >= this.tableData.length) {
        // 达到底部
        this.$message({
          type: 'info',
          message: '达到底部,请返回列表翻页'
        });
      }
      else {
        this.yunYunDetailData.rowData = this.tableData[index];
        setTimeout(function() {
          this.$refs.yunYunVideoDom && this.$refs.yunYunVideoDom.load();
        }.bind(this), 300);
      }
    },
    // 查看云云上一条
    yunYunDetailPrev() {
      let index = this.yunYunDetailData.rowData.index - 1;
      if (index < 0) {
        // 达到顶部
        this.$message({
          type: 'info',
          message: '达到顶部,请返回列表翻页'
        });
      }
      else {
        this.yunYunDetailData.rowData = this.tableData[index];
        setTimeout(function() {
          this.$refs.yunYunVideoDom && this.$refs.yunYunVideoDom.load();
        }.bind(this), 300);
      }
    },

    /** **************评论**************/

    // 评论上下架操作
    updataReviewState(item) {
      let newReviewStatus = parseInt(item.reviewStatus) === 1 ? 2 : 1;
      axios({
        method: apiConfig.boneCloudUpdataReviewState.type,
        url: apiConfig.boneCloudUpdataReviewState.url,
        data: {
          id: item.id,
          reviewStatus: newReviewStatus
        }

      }).then((response) => {
        if (response && response.data && response.data.responseObject && response.data.responseObject) {
          let responseObject = response.data.responseObject;
          if (responseObject.responseStatus) {
            item.reviewStatus = newReviewStatus;
          }
          else {
            this.$allin_confirm({title: '提示', content: '评论上下架操作失败', type: 'notice'});
            console.log(responseObject.responseMessage);
          }
          item.isConfirm = false;
        }
      }).catch((e) => {
        this.$allin_confirm({title: '提示', content: '评论上下架操作失败', type: 'notice'});
        console.log('评论上下架操作：', e);
      });
    },

    // 评论下一条
    reviewlNext() {
      // 如果正在查询中,则返回 false;
      if (this.reviewData.isPengding) {
        console.log('评论接口查询中,请勿重复点击....');
        return false;
      }
      let index = this.reviewData.index + 1;
      if (index >= this.tableData.length) {
        // 达到底部
        this.$message({
          type: 'info',
          message: '达到底部,请返回列表翻页'
        });
      }
      else {
        // refId 资源ID
        // resType 99
        this.getReviewData({
          refId: this.tableData[index].resId,
          resType: 99,
          sortType: 2,
          firstResult: 0,
          maxResult: 100
        });
        this.reviewData.index = index;
      }
    },
    // 评论上一条
    reviewlPrev() {
      // 如果正在查询中,则返回 false;
      if (this.reviewData.isPengding) {
        console.log('评论接口查询中,请勿重复点击....');
        return false;
      }
      let index = this.reviewData.index - 1;
      if (index < 0) {
        // 达到顶部
        this.$message({
          type: 'info',
          message: '达到顶部,请返回列表翻页'
        });
      }
      else {
        // refId 资源ID
        // resType 99
        this.getReviewData({
          refId: this.tableData[index].resId,
          resType: 99,
          sortType: 2,
          firstResult: 0,
          maxResult: 100
        });
        this.reviewData.index = index;
      }
    },

    /** **************点赞**************/
    // 点赞下一条
    likeNext() {
      // 如果正在查询中,则返回 false;
      if (this.likeData.isPengding) {
        console.log('点赞接口查询中,请勿重复点击....');
        return false;
      }
      let index = this.likeData.index + 1;
      if (index >= this.tableData.length) {
        // 达到底部
        this.$message({
          type: 'info',
          message: '达到底部,请返回列表翻页'
        });
      }
      else {
        this.getLikeData({
          resId: this.tableData[index].resId,
          sortType: 2
        });
        // 更新索引
        this.likeData.index = index;
      }
    },
    // 点赞上一条
    likePrev() {
      // 如果正在查询中,则返回 false;
      if (this.likeData.isPengding) {
        console.log('点赞接口查询中,请勿重复点击....');
        return false;
      }
      let index = this.likeData.index - 1;
      if (index < 0) {
        // 达到顶部
        this.$message({
          type: 'info',
          message: '达到顶部,请返回列表翻页'
        });
      }
      else {
        this.getLikeData({
          resId: this.tableData[index].resId,
          sortType: 2
        });
        // 更新索引
        this.likeData.index = index;
      }
    },

    /** **************分页组件方法**************/
    handleSizeChange(val) {
      this.pageSize = val;
      this.tableParams.maxResult = this.pageSize;

      this.tableParams.firstResult = 0;
      this.currentPage = 0;

      this.getTableData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.tableParams.firstResult = (this.currentPage - 1) * this.pageSize;
      this.getTableData();
    },

    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done();
      //   })
      //   .catch(_ => {});
    },
    /* 对象合并 */
    // 深复制,需要第一个参数为 {}
    deepExtend(out) {
      out = out || {};
      for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];

        if (!obj) {
          continue;
        }

        for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
              out[key] = this.deepExtend(out[key], obj[key]);
            }
            else {
              out[key] = obj[key];
            }
          }
        }
      }
      return out;
    }
  },
  beforeCreate() {
  },
  created() {
  },
  beforeMount() {
  },
  mounted() {
    this.getTableData();

    // 绑定键盘事件
    document.onkeydown = (e) => {
      if (e.keyCode === 13) {
        if (!this.bigImgDialogVisible || this.videoDialogVisible || this.reviewDialogVisible || this.yunYunDetailDialogVisible || this.likeDialogVisible) {
          this.onSubmit();
        }
      }
    };
  },
  beforeUpdate() {
  },
  updated() {
  },
  beforeDestroy() {
  },
  destroyed() {
    document.onkeydown = null;
    comm.goBack();
  },
  watch: {
    // 如果 `currentPage` 发生改变，这个函数就会运行
    tableData: function(newVal, oldVal) {
      if (newVal.length > 0) {
        for (let i = 0; i < newVal.length; i++) {
          if (newVal[i].resAttUrl && newVal[i].resAttUrl.length > 0) {
            for (let j = 0; j < newVal[i].resAttUrl.length; j++) {
              // 1 视频 2 图片
              if (parseInt(newVal[i].resAttUrl[j].attType) === 1) {
                newVal[i].videoPath = newVal[i].resAttUrl[j].videoUrl;
                newVal[i].videoPicPath = newVal[i].resAttUrl[j].picUrl;
                break;
              }
              else if (parseInt(newVal[i].resAttUrl[j].attType) === 2) {
                newVal[i].bigImgPath = newVal[i].resAttUrl[j].picUrl;
                break;
              }
            }
          }
        }
      }
      this.tableData = newVal;
    },
    videoDialogVisible: function(newVal, oldVal) {
      // 如果视频弹窗关闭时 暂停
      if (!newVal) {
        this.$refs.videoDom && this.$refs.videoDom.pause();
      }
    },
    yunYunDetailDialogVisible: function(newVal, oldVal) {
      // 如果视频弹窗关闭时 暂停
      if (!newVal) {
        this.$refs.yunYunVideoDom && this.$refs.yunYunVideoDom.pause();
      }
    }

  }
};
</script>

<style lang='scss'>
  .boneCloud-main-contains {
    width: 1200px;
    margin: 20px auto;

    & > h1 {
      font-family: PingFangSC-Semibold;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 20px;
      margin: 32px 0 25px;
    }

    .search_area {
      background: #fff;
      padding-top: 15px;
      margin-bottom: 30px;
      .submitBtn {
        button {
          &:nth-of-type(1) {
            border: none;
          }
          &:nth-of-type(2) {
            color: #4B67D6;
            border: 1px solid #4B67D6;
            border-radius: 4px;
          }
        }
      }
    }
    .source-list {
      /*表头样式*/
        .el-table__header .cell,.el-table__fixed-header-wrapper .cell{
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #111111;
          letter-spacing: 0;
          line-height: 1.1;

          &:last-of-type{
            text-align: center;
          }
        }
      .el-table__row {
        td{
          .cell {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            line-height: 1.2;
          }

          &:last-of-type{
            text-align: center;
          }
        }
      }

      //图片
      .bigImgShow {
        width: 26px;
        height: 22px;
      }

      //视频缩略图 显示
      .videoPic {
        position: relative;
        width: 88px;
        height: 50px;
        padding: 0;
        box-sizing: border-box;
        img {
          width: 100%;
        }
        &:before {
          background-size: 24px 24px;
          background: url(/static/images/icons/icon-video-play.png) center center no-repeat;
          content: "";
          display: block;
          width: 24px;
          height: 100%;
          position: absolute;
          opacity: 1;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .aLink {
        color: blue;
        cursor: pointer;
      }

      .pagination {
        margin-top: 28px;
      }

      //查看按钮
      .viewBotton {
        padding: 0;
        width: 74px;
        height: 28px;
        font-family: PingFangSC-Regular;
        font-size: 13px;
        color: #4B67D6;
        letter-spacing: 0;
        line-height: 13px;
        border: 1px solid #4B67D6;
        border-radius: 3px;
      }
      .changeStateBotton {
        padding: 0;
        width: 74px;
        height: 28px;
        font-family: PingFangSC-Regular;
        color: #4B67D6;
        background: #EDF1FF;
        border: 1px solid #4B67D6;
        border-radius: 3px;
        font-size: 13px;
        letter-spacing: 0;
        &.yellowBtn {
          background: #FFEBE3;
          border: 1px solid #FF7E4D;
          border-radius: 3px;
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #FF7E4D;
          letter-spacing: 0;
          line-height: 1.2;
        }
      }
    }

    .yunYunDetailDialog, .reviewDialog, .likeDialog {
      .el-dialog__header {
        padding-top: 24px;
        border-bottom: 1px solid #E0E0E0;;
        .el-dialog__title {
          font-family: PingFangSC-Semibold;
          font-size: 20px;
          color: #2C343A;
          letter-spacing: 0;
          line-height: 20px;
        }
      }
      .el-dialog__body {
        width: 348px;
        margin: 0 auto;
        padding: 16px 0 34px;
        box-sizing: border-box;
        h4 {
          margin-bottom: 20px;
          white-space: nowrap;
          text-overflow: ellipsis;
          word-break: break-all;
          overflow: hidden;
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #888888;
            letter-spacing: 0;
            line-height: 14px;
            &:nth-of-type(1) {
              font-family: PingFangSC-Medium;
              font-size: 16px;
              color: #2C343A;
              line-height: 17px;
              display: inline-block;
              max-width: 100px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              vertical-align: bottom
            }
          }
        }
      }
      //上一条 下一条
      .button-next, .button-prev {
        position: absolute;
        top: 50%;
        width: 36px;
        height: 36px;
        z-index: 10;
        cursor: pointer;
        /*outline:none;*/
      }

      .button-prev {
        background: url(/static/images/icons/icon-left-page.png) center center no-repeat;
        background-size: 36px 36px;
        left: 63px;
        right: auto;
      }
      .button-next {
        background: url(/static/images/icons/icon-right-page.png) center center no-repeat;
        background-size: 36px 36px;
        left: auto;
        right: 63px;
      }
    }

    //查看云云
    .yunYunDetailDialog {
      /*height:648px;*/
      box-sizing: border-box;
      position: relative;
      .el-dialog__body {
        p.article {
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #222222;
          letter-spacing: 0;
          line-height: 1.2;
          margin-bottom: 16px;
          //置顶
          .isHeader{
            font-size: 18px;
            color: red;
          }

          .movementActivityName{
            color: #0099FF;
          }
        }

        ul {
          overflow: hidden;
          margin-bottom: 16px;
          li {
            float: left;
            margin-right: 2px;
            margin-bottom: 2px;
            img {
              width: 112px;
              height: 112px;

            }
            &:nth-of-type(3n) {
              margin-right: 0;
            }
          }
        }

        //视频缩略图
        .yunYunDetaiVideo {
          margin-bottom: 16px;
        }

        p.tag {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #777777;
          letter-spacing: 0;
          line-height: 14px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #101010;
            letter-spacing: 0;
            line-height: 14px;
          }
        }
      }

      .el-dialog__footer {
        padding-top: 2px;
        margin-bottom: 12px;
        button {
          width: 160px;
          height: 40px;
          background: #FFEBE3;
          border: 0 solid #FF7E4D;
          border-radius: 3px;
          font-family: PingFangSC-Regular;
          font-size: 15px;
          color: #FF7E4D;
          letter-spacing: 0;
          line-height: 1.1;
          &.yellowBtn {
            background: none;
            border: 1px solid #4B67D6;
            font-family: PingFangSC-Regular;
            color: #4B67D6;
            &.backgroundEDF1FF {
              background: #EDF1FF;
            }
          }
        }
      }
    }

    //查看评论
    .reviewDialog {

      .el-dialog__body {
        height: 560px;
        max-height: 560px;
        overflow-y: auto;
        & > section > article {
          margin-bottom: 36px;
          .commentContent {
            padding: 12px 10px;
            background: #F5F6F8;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 20px;
            p:nth-of-type(1) {
              margin-bottom: 12px;
              span:nth-of-type(1) {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #506AB4;
                letter-spacing: 0;
                line-height: 14px;
              }

              span:nth-of-type(2) {
                float: right;
              }
            }
          }
          .button-group {
            button {
              width: 50px;
              height: 22px;
              background: #FFEBE3;
              border: 1px solid #FF7E4D;
              border-radius: 3px;
              font-family: PingFangSC-Regular;
              font-size: 15px;
              color: #FF7E4D;
              letter-spacing: 0;
              line-height: 22px;
              &.yellowBtn {
                border: 1px solid #4B67D6;
                background: none;
                color: #4B67D6;
                &.backgroundEDF1FF {
                  background: #EDF1FF;
                }
              }
            }
          }
          //被用户删除提示
          .isDel{
            i{
              margin-right: 5px;
            }
          }
        }
      }
    }

    //查看点赞
    .likeDialog {
      .el-dialog__body {
        height: 560px;
        max-height: 560px;
        overflow-y: auto;
        article {
          margin-bottom: 24px;
          .time {
            font-family: PingFangSC-Light;
            font-size: 14px;
            color: #888888;
            letter-spacing: 0;
            line-height: 14px;
            margin-bottom: 8px;
          }
        }
      }
    }
    .el-input__inner:not(.el-date-editor) {
      background: #F7F9FC;
      border: 1px solid #E6E6E8;
      border-radius: 4px;
    }
  }

  /*video{*/
  /*width: 100%;*/
  /*height: 100%;*/
  /*object-fit: cover;*/
  /*}*/

  // 列表查看大图
  .tableBigImgDialog {
    padding: 68px 0;
    font-size: 0;
    width: 376px;
    height: 376px;
    box-sizing: border-box;
    background: #000000;
    box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);
    border-radius: 3px;
    position: fixed;
    top:50%;
    left:50%;
    margin: -188px 0 0 -188px;
    img {
      width: 100%;
      height: 100%;
      vertical-align: top;
    }
  }

  // 查看云云hover大图
  .yunYunDetailBigImgDialog {
    .el-dialog__body {
      padding: 68px 0;
      font-size: 0;
      width: 376px;
      height: 376px;
      box-sizing: border-box;
      opacity: 0.92;
      background: #000000;
      box-shadow: 0 5px 16px 0 rgba(20, 38, 95, 0.27);
      border-radius: 3px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
    .el-dialog__header {
      padding: 0;
      font-size: 0;
    }
  }

  // 视频播放弹窗
  .VideoPlayDialog {
    .el-dialog__body {
      padding: 0;
      font-size: 0;
      width: 376px;
      box-sizing: border-box;
      border-radius: 3px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .el-dialog__header {
      padding: 0;
      font-size: 0;
    }
  }

</style>
<style scoped lang="scss">
  .el-select-dropdown__item {
    padding-left: 40px;
    position: relative;
    border-bottom: 1px solid rgba(230, 230, 232, 0.3);
    &:last-of-type {
      border-bottom: none;
    }

    &:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-unselected.png) center center no-repeat;
      content: "";
      display: block;
      width: 40px;
      height: 100%;
      position: absolute;
      opacity: 1;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    &.selected:before {
      background-size: 16px 16px;
      background: url(/static/images/icons/icon-selected.png) center center no-repeat;
    }
  }
</style>
