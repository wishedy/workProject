<!--上传一张图片-->
<template>
  <div class="upload-container">
    <div class="addImg" :class="{'hasImg':dafaultSrc}">
      <img :src="dafaultSrc" v-if="dafaultSrc"/>
      <i v-if="!dafaultSrc" class="addImg"></i>
      <input type="file" name="file"  class="ev-uploadImg" accept="image/jpeg,image/jpg,image/png"  @change="inputChange" ref="referenceUpload"/>
    </div>
  </div>
</template>

<script>
import api from '@/api/apiUrlConfig.js';
import axios from '@/assets/js/utils/request';
export default {
  props: {
    dafaultImg: {
      type: String
    },
    allinmed: {
      type: String
    }
  },
  data() {
    return {
      dafaultSrc: this.dafaultImg || '', // 图片路径
      prevFile: '',
      fileSize: 5 * 1024 * 1024,
      imgpk: {},
      formData: {

      }
    };
  },
  watch: {
    dafaultImg() {
      this.dafaultSrc = this.dafaultImg;
    }
  },
  methods: {
    // 选择文件
    inputChange(e) {
      var files = this.$refs.referenceUpload.files[0];
      if (files) {
        if (files.size > this.fileSize) {
          alert('上传失败，请上传不大于5M的图片！');
          return false;
        }
        if (!(/(jpg)|(jpeg)|(png)$/i.test(files.type))) {
          alert('格式不支持，请选择jpg、png、jpeg');
          return false;
        }

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
        // // 判断是否有缓存
        // if(img.complete){
        //   // 打印
        //   if(img.width!==1125){
        //     t.$allin_confirm({
        //       title: '提示',
        //       type: 'notice',
        //       content: '上传失败，图片尺寸建议是1125px'
        //     });
        //     return false;
        //   }else {
        //     t.imgReader(file,reader);
        //   }
        // }else{
        //   // 加载完成执行
        //   img.onload = function(){
        //     // 打印
        //     if(img.width!==1125){
        //       t.$allin_confirm({
        //         title: '提示',
        //         type: 'notice',
        //         content: '上传失败，图片尺寸建议是1125px'
        //       });
        //       return false;
        //     }else {
        //       t.imgReader(file,reader);
        //     }
        //   };
        // }
        t.imgReader(file, reader);
      };
    },
    imgReader(files, reader) {
      let t = this;
      this.prevFile = files;
      this.dafaultSrc = this.localURL(files);
      this.loading = this.$loading({
        lock: true,
        text: '图片上传中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var fileSize = files.size;
      if (fileSize < t.fileSize) {
        t.formData.fileName = files.name;
        t.formData.fileContent = reader.result.split(',')[1];
        t.uploadAction(t.formData);
      }
    },
    // 图片上传
    uploadAction(formdata) { // 上传
      let t = this,
        imgForm = {
          bucketName: 'allinmd',
          scene: 'public',
          waterType: 3,
          waterContent: ''
        },
        param = {};
      imgForm.bucketName = this.allinmed ? this.allinmed : 'allinmd';
      param = Object.assign(param, imgForm, formdata);
      axios({
        method: api.generalOSS.type,
        url: api.generalOSS.url,
        data: param
      }).then((response) => {
        t.loading.close();
        if (response) {
          response = response.data;
          if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.data_list) {
            t.$emit('imgDataList', response.responseObject.responseData.data_list);
          }
          else {
            t.loading.close();
            alert('上传失败');
          }
        }
      }).catch(() => {
        t.loading.close();
        t.dafaultSrc = '';
        t.$allin_confirm({title: '提示', content: '上传失败', type: 'notice'});
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .upload-container{
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
