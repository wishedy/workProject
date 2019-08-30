<template>
  <!--广告物料管理上传图片 三种尺寸 开始-->
  <section class="advertisingMaterialsImgUploadBox">
    <aside class="uploadInputBox"
           :class="{
           uploadInputBox01:heightMinLimit=='212',
           uploadInputBox02:heightMinLimit=='300',
           uploadInputBox03:heightMinLimit=='390',
           uploadInputBox04:heightMinLimit=='216',
           }" @click="uploadImgOnClick">
      <span class="uploadInputButton" v-if="!prevImgUrl"></span>
      <img class="ev-uploadImgTag" :src="prevImgUrl" v-if="prevImgUrl">
      <input @change="fileChangeHandle" type="file" ref="upolad_Input" v-show="!prevImgUrl">
      <p class="eliteBannerImg" v-if="isBannerImg1">{{uploadDesc}}</p>
      <!-- <p class="deleteImg" @click="deleteImgFun" v-if="prevImgUrl"><i class="el-icon-circle-close"></i></p> -->
    </aside>
  </section>
  <!--广告物料管理上传图片 三种尺寸 结束-->
</template>

<script>
/**
   * 广告管理-广告物料-图片上传
   * @module '@/views/advertisingMaterials/components/advertisingMaterialsImgUpload.vue'
   * @desc  广告管理的广告物料模块上传图片，多重尺寸选择类型
   * @author 何静
   * @date 2019-02-13

   **/
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'advertisingMaterialsImgUpload',
  props: {
    // 上传描述
    uploadDesc: {
      type: String,
      require: true
    },
    // 图片地址,用于回显到组件中
    imgUrl: {
      type: String,
      require: true
    },
    // 图片最小宽高限制，单位为 (px)，widthHeightMinLimit[0] 为允许最小宽度，widthHeightMinLimit[1] 为允许最小高度，
    widthHeightMinLimit: {
      type: Array,
      require: false
    },
    // 是否需要清除，主动监视该属性，当其值为 true 时，会清除现有的 input 中的数据
    needClear: {
      type: Boolean,
      default: false
    },
    // 是否能上传图片（校验先输入id）
    uploadFlag: {
      type: Boolean,
      default: false
    },
    // 是否是精英会配图，是则显示图片后方说明文字
    isBannerImg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileData: {}, // 上传的文件
      widthHeightCheck: true, // 上传文件的宽高比是否要限制提示
      prevImgUrl: this.imgUrl ? this.imgUrl : '', // 图片地址
      heightMinLimit: this.widthHeightMinLimit[1] ? this.widthHeightMinLimit[1] : '',
      uploadFlag1: this.uploadFlag,
      isBannerImg1: this.isBannerImg
    };
  },
  watch: {
    imgUrl() {
      let _this = this;
      _this.prevImgUrl = _this.imgUrl;
    },
    needClear(newVal) {
      if (newVal) {
        this.deleteImgFun();
      }
    },
    widthHeightMinLimit() {
      this.heightMinLimit = this.widthHeightMinLimit[1] ? this.widthHeightMinLimit[1] : '';
    },
    uploadFlag() {
      this.uploadFlag1 = this.uploadFlag;
    }
  },
  methods: {
    // 清空input上传值
    clearInput() {
      let _this = this;
      _this.$refs['upolad_Input'].value = null;
      _this.prevImgUrl = '';
    },
    // 点击图片
    uploadImgOnClick() {
      let _this = this;
      if (_this.prevImgUrl !== '') {
        _this.$refs['upolad_Input'].click();
      }
    },
    // input上传文件
    fileChangeHandle(e) {
      let _this = this;
      if (!_this.uploadFlag1) {
        _this.$emit('returnNoUpload', '');
        return;
      }
      let file = e.target.files[0];
      if (file) {
        if (!this.formatCheck(file)) {
          _this.deleteImgFun();
          return false;
        }
      }
      else {
        return false;
      }
      // 获取图片数据
      this.fileData.extName = file.type;
      this.fileData.file = file;
      const render = new FileReader();
      render.onload = (e) => {
        _this.fileData.fileContent = render.result;
        // 宽高限定判断
        if (_this.widthHeightMinLimit) {
          let img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = function() {
            let width = img.width;
            let height = img.height;
            _this.widthHeightCheck = true;
            // 最小宽高限定
            if (_this.widthHeightMinLimit) {
              if (width < _this.widthHeightMinLimit[0]) {
                _this.$message.error('上传图片宽度不能小于' + _this.widthHeightMinLimit[0] + 'px');
                _this.widthHeightCheck = false;
              }
              else if (height < _this.widthHeightMinLimit[1]) {
                _this.$message.error('上传图片高度不能小于' + _this.widthHeightMinLimit[1] + 'px');
                _this.widthHeightCheck = false;
              }
            }
            // 如果满足条件，则允许上传图片
            if (_this.widthHeightCheck) {
              _this.uploadImg();
            }
            else {
              _this.deleteImgFun();
            }
          };
        }
        else {
          _this.uploadImg();// 上传function
        }
      };
      render.readAsDataURL(file);
    },
    // 上传图片
    uploadImg() {
      let _this = this;
      const data = {
        fileContent: _this.fileData.fileContent.split(',')[1],
        watermark: 1,
        extName: _this.fileData.extName.split('/')[1]
      };
      comm.openLoading('图片上传中...');
      axios({
        method: apiUrlConfig.uploadImg.type,
        url: apiUrlConfig.uploadImg.url,
        data: data
      }).then((res) => {
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true) {
          comm.closeLoading();
          // 格式化数据
          let dataList = res.data.responseObject.responseData.data_list;
          let data = {};
          data.attUrl = dataList.attUrl;
          data.attFormat = dataList.extName;
          data.navigationAttType = 1;
          data.attSize = dataList.attSize;
          data.attHeight = dataList.attHeight;
          data.attWidth = dataList.attWidth;
          data.attType = dataList.attType;
          // 显示预览图
          _this.prevImgUrl = URL.createObjectURL(_this.fileData.file);
          data.prevImgUrl = _this.prevImgUrl;
          _this.$emit('uploadSuccess', data);
        }
        else {
          comm.closeLoading();
          _this.$message.error('图片上传失败！');
          _this.deleteImgFun();
        }
      }).catch(() => {
        comm.closeLoading();
        _this.$message.error('图片上传失败！');
        _this.deleteImgFun();
      });
    },
    // 检测上传图片文件的格式大小
    formatCheck(file) {
      let _this = this;
      let sizeLimit = 1;
      // 图片仅支持JPG/JPEG/PNG/GIF格式
      const typeTrue = file.type === 'image/jpeg' || file.type === 'image/jpg' ||
          file.type === 'image/png' || file.type === 'image/gif';

        // 图片大小不超过1M
      const sizeTrue = file.size / 1024 / 1024 < sizeLimit;
      if (!typeTrue) {
        _this.$message.error('上传图片仅支持JPG/JPEG/PNG/GIF格式');
        return false;
      }
      else if (!sizeTrue) {
        _this.$message.error('上传图片大小不超过' + sizeLimit + 'M');
        return false;
      }
      else {
        return true;
      }
    },
    // 删除图片
    deleteImgFun() {
      let _this = this;
      _this.$refs['upolad_Input'].value = null;
      _this.prevImgUrl = '';
      _this.$emit('deleteSuccess', '');
    }
  }
};
</script>

<style scoped lang="scss">
  .advertisingMaterialsImgUploadBox {
    /*图片展示的尺寸比例*/
    .uploadInputBox { /*手术精讲、直播、个人主页、视频栏目、课程栏目*/
      width: 150px;
      height: 150px;
      background: #EDF1FF;
      position: relative;
      &.uploadInputBox01 { /*视频、病例、文库、锦囊、专题、活动、会议*/
        width: 168px;
        height: 106px;
      }
      &.uploadInputBox02 { /*精英会banner*/
        width: 335px;
        height: 100px;
      }
      &.uploadInputBox03 { /*唯医学院banner*/
         width: 345px;
         height: 130px;
      }
      &.uploadInputBox04 { /*病例、文库、视频banner*/
         width: 345px;
         height: 72px;
      }
      img {
        width: 100%;
        height: 100%;
      }
      input {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        top: 0;
        left: 0;
        opacity: 0;
      }
      /*精英会bannner配图*/
      .eliteBannerImg{
        position: absolute;
        right: -210px;
        top: 30px;
        /*position: relative;*/
        /*left: 360px;*/
        /*top: 28%;*/
      }
      /*关闭按钮*/
      .deleteImg {
        position: absolute;
        top: -13px;
        right: -11px;
        display: inline-block;
        cursor: pointer;
        i {
          color: red;
          font-size: 23px;
          width: 23px;
          height: 23px;
        }
      }
    }
    /*上传按钮的加号*/
    .uploadInputButton {
      width: 38px;
      height: 31px;
      background: url("/static/images/upload/addImg.png") no-repeat;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
    }
  }
</style>
