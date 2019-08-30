<template>
  <section class="column-img-upload">
    <div class="column-img-upload-container" @click="uploadImgOnClick">
      <span class="column-img-upload-icon" v-if="!prevImgUrl"></span>
      <img v-if="prevImgUrl" :src="prevImgUrl">
      <input type="file" @change="fileChangeHandle" ref="column_img_upload_upload">
      <div v-if="uneditable" class="uneditable"></div>
    </div>
    <slot></slot>
  </section>

</template>

<script>
/**
   * 栏目后台管理-图片上传
   * @module '@/views/columnManager/components/ColumnImgUpload'
   * @desc  栏目管理模块的通用图片上传组件
   * @author 姚乔
   * @date 2018-10-09
   * @param 详见 props
   * @example
   *       <ColumnImgUpload
             @uploadSuccess="handleImgShareUploadSuccess"
             :imgUrl="courseData.imgShareUrl"
             :needClear="!editShow">
             <p>分享图</p>
             </ColumnImgUpload>
   */
import apiUrlConfig from '@/api/apiUrlConfig';
import axios from '@/assets/js/utils/request';
import comm from '@/assets/js/utils/comm';

export default {
  name: 'columnImgUpload',
  props: {
    // 图片地址,用于回显到组件中
    imgUrl: {
      type: String,
      require: true
    }, // 是否需要清除，主动监视该属性，当其值为 true 时，会清除现有的 input 中的数据
    needClear: {
      type: Boolean,
      default: false
    }, // 图片文件的体积限制，最大值，单位为（M)
    imgFileSizeMaxLimit: {
      type: Number,
      require: false
    }, // 图片最大宽高限制，单位为 (px)，widthHeightMaxLimit[0] 为允许最大宽度，widthHeightMaxLimit[1] 为允许最大高度，
    widthHeightMaxLimit: {
      type: Array,
      require: false
    }, // 图片最小宽高限制，单位为 (px)，widthHeightMinLimit[0] 为允许最小宽度，widthHeightMinLimit[1] 为允许最小高度，
    widthHeightMinLimit: {
      type: Array,
      require: false
    }, // 图片上传组件，开启不可编辑模式，如果为true,则表示此组件被禁止使用，默认为false
    uneditable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileData: {},
      widthHeightCheck: true,
      prevImgUrl: this.imgUrl ? this.imgUrl : ''
    };
  },
  watch: {
    imgUrl() {
      this.prevImgUrl = this.imgUrl;
    },
    needClear(newVal) {
      if (newVal) {
        this.clearInput();
      }
    }
  },
  methods: {
    uploadImgOnClick() {
      if (this.uneditable) {
        return false;
      }
      if (this.isLoading) return false;
      this.$refs['column_img_upload_upload'].click();
    },
    clearInput() {
      this.$refs['column_img_upload_upload'].value = null;
      this.prevImgUrl = '';
    },
    fileChangeHandle(evt) {
      let _this = this;
      let file = evt.target.files[0];
      if (file) {
        if (!this.formatCheck(file)) {
          this.$refs['column_img_upload_upload'].value = null;
          return false;
        }
      }
      else return false;
      // 获取图片数据
      this.fileData.extName = file.type;
      this.fileData.file = file;
      const render = new FileReader();
      render.onload = (e) => {
        this.fileData.fileContent = render.result;
        // 宽高限定判断
        if (this.widthHeightMaxLimit || this.widthHeightMinLimit) {
          let img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = function() {
            let width = img.width;
            let height = img.height;
            _this.widthHeightCheck = true;
            // 最大宽高限定
            if (_this.widthHeightMaxLimit) {
              if (width > _this.widthHeightMaxLimit[0]) {
                _this.$message.error('上传图片宽度不能超过' + _this.widthHeightMaxLimit[0] + 'px');
                _this.widthHeightCheck = false;
              }
              else if (height > _this.widthHeightMaxLimit[1]) {
                _this.$message.error('上传图片高度不能超过' + _this.widthHeightMaxLimit[1] + 'px');
                _this.widthHeightCheck = false;
              }
            }// 最小宽高限定
            else if (_this.widthHeightMinLimit) {
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
              _this.$refs['column_img_upload_upload'].value = null;
            }
          };
        }
        else {
          _this.uploadImg();
        }
      };
      render.readAsDataURL(file);
    },
    formatCheck(file) {
      let sizeLimit = 5;
      // 图片仅支持JPG/JPEG/PNG格式
      const typeTrue = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      if (this.imgFileSizeMaxLimit) {
        sizeLimit = this.imgFileSizeMaxLimit;
      }
      // 图片大小不超过5M
      const sizeTrue = file.size / 1024 / 1024 < sizeLimit;

      if (!typeTrue) {
        this.$message.error('上传图片仅支持JPG/JPEG/PNG格式');
        return false;
      }
      else if (!sizeTrue) {
        this.$message.error('上传图片大小不超过' + sizeLimit + 'M');
        return false;
      }
      else {
        return true;
      }
    },
    uploadImg() {
      const data = {
        fileContent: this.fileData.fileContent.split(',')[1],
        watermark: 1,
        extName: this.fileData.extName.split('/')[1]
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
          this.prevImgUrl = URL.createObjectURL(this.fileData.file);
          this.$emit('uploadSuccess', data);
        }
        else {
          comm.closeLoading();
          this.$message.error('图片上传失败！');
          this.clearInput();
        }
      }).catch(() => {
        comm.closeLoading();
        this.$message.error('图片上传失败！');
        this.clearInput();
      });
    }
  },
  destroyed() {
    comm.goBack();
  }
};
</script>

<style scoped lang="scss">

  .column-img-upload-container {
    width: 150px;
    height: 100px;
    background: #EDF1FF;
    position: relative;
    .uneditable {
      position: absolute;
      top: 0;
      left: 0;
      width: 150px;
      height: 100px;
      background: rgba(0, 0, 0, 0.2);
      z-index: 5;
    }
    .column-img-upload-icon {
      width: 38px;
      height: 31px;
      background: url("/static/images/upload/addImg.png") no-repeat;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);

    }
    img {
      width: 100%;
      height: 100%;
    }
    input {
      display: none;
    }
  }
</style>
