<!--上传一张图片-->
<template>
  <div class="uploadContainer">
    <ul>
      <div class="addImg">
        <i></i>
        <input type="file" name="file" class="ev-uploadImg" accept="image/jpeg,image/jpg,image/png" multiple  @change="inputChange" ref="referenceUpload"/>
        <p class="noEdit" v-if="isEdit==2">无法上传</p>
      </div>
      <li class="ev-imgList" v-for="(item,index) in imgList" :key="index">
        <img :src="item.src||item" @mouseover="bigImgShow(item.src||item)"/>
        <i @click="itemClose(index,item)">×</i>
        <p class="noEdit" v-if="isEdit==2">无法编辑</p>
      </li>
    </ul>
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
  props: ['isEdit', 'imgListArr', 'formData'],
  data() {
    return {
      loading: null,
      imgList: this.imgListArr, // 图片路径
      prevFile: '',
      fileSize: 2 * 1024 * 1024,
      sortid: this.imgListArr.length,
      imgLength: 0,
      imgListChange: [],
      imgpk: {
        responsePk: '',
        deletId: ''
      },
      // 查看大图
      bigImgPath: '',
      bigImgDialogVisible: false
    };
  },
  watch: {
    imgListArr: {
      handler(newData) {
        this.imgList = newData;
      },
      deep: true
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
    // 删除图片
    itemClose(index, item) {
      this.imgList.splice(index, 1);
      if (item.id) {
        this.imgpk.deletId += item.id + ',';
      }
      else {
        for (let i = 0; i < this.imgListChange.length; i++) {
          if (this.imgListChange[i].src === item) {
            this.imgpk.responsePk = this.imgpk.responsePk.replace(this.imgListChange[i].responsePk + ',', '');
          }
        }
      }
      this.$emit('imgpk', this.imgpk);
    },
    // 选择文件
    inputChange(e) {
      let fileArr = this.$refs.referenceUpload.files;
      this.imgLength = fileArr.length;
      if (this.imgList.length + this.imgLength > 9) {
        this.$alert('', '最多上传9张图片', {
          confirmButtonText: '确定'
        });
        return false;
      }
      for (let i = 0; i < fileArr.length; i++) {
        if (fileArr[i]) {
          if (fileArr[i].size > this.fileSize) {
            alert('上传失败，请上传不大于2M的图片！');
            this.imgLength--;
            if (this.imgLength === 0) {
              this.loading && this.loading.close();
            }
          }
          else {
            if ((/(jpg)|(jpeg)|(png)$/i.test(fileArr[i].type))) {
              this.prevFile = fileArr[i];
              this.sortid++;
              let localUrl = this.localURL(fileArr[i]);
              this.imgList.unshift(localUrl);
              this.loading = this.$loading({
                lock: true,
                text: '图片上传中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              this.compressImg(fileArr[i], {
                src: localUrl
              }, this.sortid);
            }
            else {
              alert('格式不支持，请选择jpg、png、jpeg');
            }
          }
        }
        else if (this.prevFile) {
          this.localURL(this.prevFile);
        }
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
    compressImg(file, obj, sortid) {
      var reader = new FileReader(),
        img = new Image(),
        t = this;
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        img.src = e.target.result;
        var fileSize = file.size;
        if (fileSize < t.fileSize) {
          t.formData.extName = file.type.split('/')[1];
          t.formData.fileContent = reader.result.split(',')[1];
          t.formData.isValid = 0;
          t.formData.sortId = sortid;
          t.formData.waterType = 2;
          t.uploadAction(t.formData, obj);
        }
        else {
          t.imgLength--;
          if (t.imgLength === 0) {
            t.loading.close();
          }
        }
      };
    },
    // 图片上传
    uploadAction(formdata, obj) { // 上传
      let t = this;
      axios.post(api.attachment.url, formdata).then((response) => {
        response = response.data;
        if (response && response.responseObject && response.responseObject.responseData && response.responseObject.responseData.data_list) {
          t.uploadSave(response.responseObject.responseData.data_list, formdata, obj);
        }
        else {
          for (let i = 0; i < t.imgList.length; i++) {
            if (t.imgList[i] === obj.src) {
              t.imgList.splice(i, 1);
            }
          }
          t.imgLength--;
          if (t.imgLength === 0) {
            t.loading.close();
          }
          alert('上传失败');
        }
      });
    },
    // 图片上传
    uploadSave(resData, formdata, obj) { // 上传
      let t = this,
        formd = {
          sendSiteId: 25,
          brochureId: formdata.brochureId,
          questionId: formdata.questionId,
          answerId: formdata.answerId,
          categoryType: formdata.categoryType,
          isValid: 0,
          attUrl: resData.attUrl,
          attSize: resData.attSize,
          attHeight: resData.attHeight,
          attWidth: resData.attWidth,
          attFormat: resData.extName,
          sortId: formdata.sortId
        };
      axios.post(api.saveAttachment.url, formd).then((response) => {
        t.imgLength--;
        if (t.imgLength === 0) {
          t.loading.close();
        }
        response = response.data;
        if (response && response.responseObject.responsePk) {
          t.imgpk.responsePk += response.responseObject.responsePk + ',';
          obj.responsePk = response.responseObject.responsePk;
          t.imgListChange.unshift(obj);
          t.$emit('imgpk', t.imgpk);
        }
        else {
          for (let i = 0; i < t.imgList.length; i++) {
            if (t.imgList[i] === obj.src) {
              t.imgList.splice(i, 1);
            }
          }
          alert('保存失败');
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .uploadContainer{
    .noEdit{
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
      background: rgba(0,0,0,.8);
      text-align: center;
      line-height: 100px;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      z-index: 5;
      top: 0;
    }
    ul{
      li{
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
        position: relative;
        img{
          width: 100px;
          height: 100px;
        }
        i{
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
      }
    }
    .addImg{
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      width: 100px;
      height: 100px;
      position: relative;
      text-align: center;
      background: #EDF1FF;
      border-radius: 3px;
      i{
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
      z-index: 6;
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
