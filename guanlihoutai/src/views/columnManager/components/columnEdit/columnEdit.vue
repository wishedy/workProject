<template>
  <el-dialog
    :visible.sync="selfShow"
    width="70%"
    :before-close="handleClose"
    :close-on-click-modal="false"
    center>
    <div slot="title" class="dialog-title">{{editTitle}}</div>
    <el-form label-width="100px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="栏目样式">
            <el-select
              v-model="selectColumnType"
              placeholder="请选择栏目样式"
              :value="1"
              @change="handleSelectColumnChange"
              v-bind:disabled="!newDialog"
            >
              <el-option label="课程样式" :value="1"></el-option>
              <el-option label="视频样式" :value="2"></el-option>
              <el-option label="直播样式" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <columnCourseEdit :courseEditShow="editShow.course"
                          :columnData="editData.course"
                          :isNew="newDialog"
                          @submitData="handleSubmitData">
      </columnCourseEdit>
      <columnLiveEdit :liveEditShow="editShow.live"
                        :columnData="editData.live"
                        :isNew="newDialog"
                        @submitData="handleSubmitData">
      </columnLiveEdit>
      <columnVideoEdit :videoEditShow="editShow.video"
                         :columnData="editData.video"
                         :isNew="newDialog"
                         @submitData="handleSubmitData">
      </columnVideoEdit>
    </el-form>
  </el-dialog>
</template>

<script>
/**
   *  栏目管理新增/编辑弹窗
   **/
import columnCourseEdit from '@/views/columnManager/components/columnEdit/columnCourseEdit.vue';
import columnLiveEdit from '@/views/columnManager/components/columnEdit/columnLiveEdit.vue';
import columnVideoEdit from '@/views/columnManager/components/columnEdit/columnVideoEdit.vue';
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

const EDIT_TITLE = {
  NEW_COURSE: '新增课程栏目',
  NEW_VIDEO: '新增视频聚合栏目',
  NEW_LIVE: '新增直播栏目',
  EDIT_COURSE: '编辑课程栏目',
  EDIT_VIDEO: '编辑视频聚合栏目',
  EDIT_LIVE: '编辑直播栏目'
};
export default {
  name: 'columnEdit',
  props: {
    // 弹窗是否显示
    dialogShow: {
      type: Boolean,
      default: false
    }, // 弹窗是否为新增按钮打开的弹窗
    newDialog: {
      type: Boolean,
      require: true
    }, // 栏目的数据，一般用于编辑栏目弹窗
    columnData: {
      type: Object,
      require: false
    }
  },
  components: {
    columnCourseEdit,
    columnLiveEdit,
    columnVideoEdit
  },
  data() {
    return {
      selfShow: this.dialogShow,
      editTitle: '',
      selectColumnType: 1,
      editShow: {
        course: false,
        live: false,
        video: false
      },
      editData: {
        course: null,
        live: null,
        video: null
      }
    };
  },
  watch: {
    columnData(newVal) {
      this.columnData = newVal;
    },
    dialogShow(newVal) {
      this.selfShow = newVal;
      if (newVal) {
        this.hideEditAll();
        if (this.newDialog) {
          this.editTitle = EDIT_TITLE.NEW_COURSE;
          this.editShow.course = true;
          this.selectColumnType = 1;
        }
        else {
          if (this.columnData) {
            this.getDetailData();
          }
          else {
            this.handleClose();
          }
        }
      }
    }
  },
  methods: {
    getDetailData() {
      comm.openLoading('加载中...');
      this.selfShow = false;
      axios({
        method: apiUrlConfig.getColumnDetailData.type,
        url: apiUrlConfig.getColumnDetailData.url,
        params: {
          columnId: this.columnData.columnId
        }
      }).then((res) => {
        comm.closeLoading();
        this.selfShow = true;
        if (res && res.data && res.data.responseObject && res.data.responseObject.responseData) {
          let responseData = res.data.responseObject.responseData;
          const type = this.columnData.columnType;
          if (type === 1) {
            // 如果是课程聚合
            this.columnData.columnUrlScheme = responseData.columnUrlScheme;
            this.columnData.columnDesc = responseData.columnDesc;
            this.columnData.customerIdList = responseData.customerIdList;
            this.columnData.customerNameList = responseData.customerNameList;
            let img = {};
            for (let i = 0; i < responseData.attList.length; i++) {
              img = responseData.attList[i];
              if (img.attType === '1') {
                this.columnData.imgIconData = img;
                this.columnData.imgIconUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
              }
              else if (img.attType === '2') {
                this.columnData.imgShareData = img;
                this.columnData.imgShareUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
              }
              else if (img.attType === '3') {
                this.columnData.imgListData = img;
                this.columnData.imgListUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
              }
            }
          }
          else if (type === 2) {
            // 如果是视频聚合
            this.columnData.columnUrlScheme = responseData.columnUrlScheme;
            this.columnData.columnDesc = responseData.columnDesc;
            let img = {};
            for (let i = 0; i < responseData.attList.length; i++) {
              img = responseData.attList[i];
              if (img.attType === '1') {
                this.columnData.imgIconData = img;
                this.columnData.imgIconUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
              }
              else if (img.attType === '2') {
                this.columnData.imgShareData = img;
                this.columnData.imgShareUrl = apiUrlConfig.imgServer_img05.url + img.attUrl;
              }
            }
          }
          else if (type === 3) {
            // 如果是直播聚合
            this.columnData.columnUrlScheme = responseData.columnUrlScheme;
          }
          this.updateEditColumnData(this.columnData);
        }
      }).catch((err) => {
        comm.closeLoading();
        this.selfShow = true;
        console.log('获取详情数据失败：', err);
      });
    },
    hideEditAll() {
      // 隐藏所有编辑面板
      for (let key in this.editShow) {
        this.editShow[key] = false;
      }
      for (let key in this.editData) {
        this.editData[key] = null;
      }
    },
    handleClose(neeUpdate) {
      this.hideEditAll();
      this.$emit('closeDialog', neeUpdate);
    },
    handleSelectColumnChange(value) {
      this.hideEditAll();
      switch (value) {
        case 1:
          this.editTitle = EDIT_TITLE.NEW_COURSE;
          this.editShow.course = true;
          break;
        case 2:
          this.editTitle = EDIT_TITLE.NEW_VIDEO;
          this.editShow.video = true;
          break;
        case 3:
          this.editTitle = EDIT_TITLE.NEW_LIVE;
          this.editShow.live = true;
          break;
        default:
          break;
      }
    },
    updateEditColumnData(data) {
      let _editTitle = '';
      switch (data.columnType) {
        case 1:
          _editTitle = EDIT_TITLE.EDIT_COURSE;
          this.editData.course = data;
          this.editShow.course = true;
          break;
        case 2:
          _editTitle = EDIT_TITLE.EDIT_VIDEO;
          this.editData.video = data;
          this.editShow.video = true;
          break;
        case 3:
          _editTitle = EDIT_TITLE.EDIT_LIVE;
          this.editData.live = data;
          this.editShow.live = true;
          break;
        default:
          break;
      }
      this.selectColumnType = data.columnType;
      this.editTitle = _editTitle;
    }, // 提交数据处理函数
    handleSubmitData(data) {
      data.visitSiteId = 25;
      data.columnType = this.selectColumnType;
      if (data.attList && data.attList.length > 0) {
        for (let i = 0; i < data.attList.length; i++) {
          data.attList[i].columnType = 0; // 栏目后台附件的 columnType 固定为0
        }
      }

      let _data = {};
      for (let key in data) {
        if (data[key]) _data[key] = data[key];
      }
      data = _data;

      let contentTite = this.newDialog ? '新增' : '编辑';
      comm.openLoading('加载中...');
      this.selfShow = false;
      axios({
        method: apiUrlConfig.saveColumn.type,
        url: apiUrlConfig.saveColumn.url,
        data: data
      }).then((res) => {
        comm.closeLoading();
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true) {
          this.$allin_confirm({
            title: '提示',
            content: contentTite + '栏目成功',
            type: 'notice',
            done: () => {
              this.handleClose(true);
            }
          });
        }
        else {
          this.$allin_confirm({
            title: '提示',
            content: contentTite + '栏目失败',
            type: 'notice',
            done: () => {
              this.handleClose();
            }
          });
        }
      }).catch(() => {
        comm.closeLoading();
        this.$allin_confirm({
          title: '提示',
          content: contentTite + '栏目失败',
          type: 'notice',
          done: () => {
            this.handleClose();
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .el-dialog {
    .dialog-title {
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #222222;
      letter-spacing: 0;
      line-height: 24px;
      font-weight: bolder;
    }
    label {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #555555;
      letter-spacing: 0;
      line-height: 14px;
    }

    .column-style-select {
      margin: 20px 0 30px 0;
    }

  }

</style>
