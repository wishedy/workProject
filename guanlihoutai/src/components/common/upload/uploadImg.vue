<!--上传一张图片-->
<template>
  <div class="uploadContainer">
    <div class="addImg" :class="{'hasImg':dafaultSrc}">
      <img :src="dafaultSrc" v-if="dafaultSrc" @mouseover="bigImgShow(dafaultSrc)"/>
      <i v-if="!dafaultSrc" class="addImg"></i>
      <i @click="itemClose()" class="closeImg" v-if="dafaultSrc">×</i>
      <input type="file" name="file" v-if="!dafaultSrc" class="ev-uploadImg" accept="image/jpeg,image/jpg,image/png"  @change="inputChange" ref="referenceUpload"/>
    </div>
    <!--鼠标滑过查看大图-->
    <div class="ev-bigImg" v-if="bigImgDialogVisible" @click="closeBigImg">
      <img :src="bigImgPath">
    </div>
  </div>
</template>

<script>
import api from '@/api/apiUrlConfig.js';
import axios from '@/assets/js/utils/request';
export default {
  // name: "upload-img"
  props: ['formData', 'imgData'],
  data() {
    return {
      dafaultSrc: (this.imgData && this.imgData.src) || '', // 图片路径
      prevFile: '',
      fileSize: 2 * 1024 * 1024,
      imgpk: {
        responsePk: '',
        deletId: ''
      },
      // 查看大图
      bigImgPath: '',
      bigImgDialogVisible: false

    };
  },
  computed: {
    imgSrc() {
      return this.imgData && this.imgData.src;
    }
  },
  watch: {
    imgSrc() {
      this.dafaultSrc = this.imgSrc;
    }
  },
  methods: {
    // 关闭查看大图
    closeBigImg() {
      this.bigImgDialogVisible = false;
    },
    // 查看大图事件
    bigImgShow(src) {
      if (src) {
        this.bigImgPath = src;
        this.bigImgDialogVisible = true;
      }
    },
    itemClose() {
      this.dafaultSrc = '';
      this.imgpk.responsePk = '';
      this.imgpk.deletId = (this.imgData && this.imgData.id) || '';
      this.$emit('imgpk', this.imgpk);
      /*   const h = this.$createElement;
            this.$msgbox({
              title: '确认删除图片',
              message: "",
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose: (action, instance, done) => {
                if (action === 'confirm') {
                  this.dafaultSrc = '';
                  this.imgpk.responsePk='';
                  this.imgpk.deletId=(this.imgData&&this.imgData.id)||'';
                  this.$emit('imgpk', this.imgpk);
                }
                done&&done();
              }
            }).catch(action=>{

            }); */
    },
    // 选择文件
    inputChange(e) {
      var files = this.$refs.referenceUpload.files[0];
      if (files) {
        if (files.size > this.fileSize) {
          alert('上传失败，请上传不大于2M的图片！');
          return false;
        }
        if (!(/(jpg)|(jpeg)|(png)$/i.test(files.type))) {
          alert('格式不支持，请选择jpg、png、jpeg');
          return false;
        }
        this.prevFile = files;
        this.dafaultSrc = this.localURL(files);
        this.loading = this.$loading({
          lock: true,
          text: '图片上传中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.compressImg(files);
      }
      else if (this.prevFile) {
        this.localURL(this.prevFile);
      }
    },
    // 本地路径
    localURL(file) {
      // if(file){
      var url = null;
      if (window.createObjectURL !== undefined) {
        url = window.createObjectURL(file);
      }
      else if (window.URL !== undefined) {
        url = window.URL.createObjectURL(file);
      }
      else if (window.webkitURL !== undefined) {
        url = window.webkitURL.createObjectURL(file);
      }
      return url;//     eg:     blob:http://localhost/671c3409-0047-44ec-bcba-89d63a439231
      // }
    },
    // 图片转base64
    compressImg(file) {
      var reader = new FileReader(),
        img = new Image(),
        t = this;
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        img.src = e.target.result;
        // var formdata = new FormData();
        var fileSize = file.size;
        if (fileSize < t.fileSize) {
          t.formData.extName = file.type.split('/')[1];
          t.formData.fileContent = reader.result.split(',')[1];
          t.formData.isValid = 0;
          t.formData.waterType = 2;
          t.uploadAction(t.formData);
        }
      };
    },
    // 图片上传
    uploadAction(formdata) { // 上传
      let t = this;
      axios.post(api.attachment.url, formdata).then((response) => {
        response = response.data;
        if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.data_list) {
          t.uploadSave(response.responseObject.responseData.data_list, formdata);
        }
        else {
          t.loading.close();
          alert('上传失败');
        }
      });
    },
    // 图片保存
    uploadSave(resData, paramdata) { // 上传
      let t = this,
        formd = {
          sendSiteId: 25,
          brochureId: paramdata.brochureId,
          questionId: paramdata.questionId,
          answerId: paramdata.answerId,
          categoryType: paramdata.categoryType,
          isValid: 0,
          attUrl: resData.attUrl,
          attSize: resData.attSize,
          attHeight: resData.attHeight,
          attWidth: resData.attWidth,
          attFormat: resData.extName
        };
      axios.post(api.saveAttachment.url, formd).then((response) => {
        t.loading.close();
        response = response.data;
        if (response && response.responseObject.responsePk) {
          t.imgpk.responsePk = response.responseObject.responsePk;
          t.$emit('imgpk', t.imgpk);
        }
        else {
          alert('保存失败');
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .uploadContainer{
    .addImg{
      cursor: pointer;
      width: 100px;
      height: 100px;
      position: relative;
      text-align: center;
      background: #EDF1FF;
      border-radius: 3px;
      &.hasImg{
        border:none;
      }
      .closeImg{
        position: absolute;
        top: 0;
        right: 0;
        background: #000000;
        width: 20px;
        height: 20px;
        font-size: 20px;
        line-height: 20px;
        text-align: center;
        display: block;
        color: #fff;
        cursor: pointer;
      }
      .addImg{
        /*display: inline-block;*/
        width: 38px;
        height: 31px;
        /*vertical-align: middle;*/
        background: url("/static/images/upload/addImg.png") no-repeat;
        /*margin: 45px 0 6px 0;*/
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
      }
      img{
        width: 100px;
        height: 100px;
      }
    }
    input{
      width: 100px;
      height: 100px;
      z-index: 1;
      top: 0;
      left: 0;
      position: absolute;
      opacity: 0;
    }
    .ev-bigImg{
      position: fixed;
      right: 0;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 5;
      background-color: rgba(0,0,0,0.5);
      img{
        max-width: 80%;
        max-height: 80%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
</style>
