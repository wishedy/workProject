<template>
  <div class="uploadContainer">
    <ul>
      <div id="ev-videoCon" v-if="!isUpload" class="addCon">
        <div class="addImg" id="ev-addVideo">
          <i></i>
        </div>
      </div>
      <div class="addCon" v-if="isEdit==1" style="position: absolute;left: 0;z-index: 5">
        <div class="addImg">
          <p class="noEdit">无法上传</p>
        </div>
      </div>
      <li class="ev-videoList" v-for="(item,index) in videoList" :key="index">
        <div v-if="onProgressStatus" class="uploadCon">
          <p class="uploadPending" v-if="isUpload"><i></i><span>{{uloadPending}}%</span></p>
          <p class="uploadFail" v-if="!isUpload&&isFail">上传失败<br/><span>请重新上传</span></p>
        </div>
        <img :src="item.imgSrc||item" v-if="!onProgressStatus"/>
        <i @click="itemClose(index,item)" class="itemClose" v-if="uloadPendingState||item.isValid">×</i>
        <p class="noEdit" v-if="isEdit==1">无法编辑</p>
        <span class="playIcon" v-if="item.videoPath"></span>
      </li>
    </ul>
  </div>
</template>

<script>

import api from '@/api/apiUrlConfig.js';
import axios from '@/assets/js/utils/request';

export default {
  props: {
    // 是否可编辑，当 isEdit==1 时，表示当前组件不可编辑
    isEdit: {
      type: Number
    }, // 视频的对象数组，数组中的对象为
    /* {
          imgSrc:String     //视频封面图片地址
          videoPath:String  //视频地址
          id:Number         //视频id
          isValid:Number    //是否有效，1 为有效，0 为无效
       } */
    videoListArr: {
      type: Array
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      videoList: this.videoListArr || [], // 图片路径
      isUpload: false,
      isFail: false,
      uloadPending: 0,
      uloadPendingState: false,
      videoBack: {
        responsePk: '',
        deletId: ''
      },
      onProgressStatus: false// 是否在上传中
    };
  },
  watch: {
    videoListArr: {
      handler(newData) {
        this.videoList = newData;
      },
      deep: true
    }
  },
  methods: {
    itemClose(index, item) {
      if (item.isValid) {
        this.videoBack.deletId += item.id + ',';
      }
      else {
        for (let i = 0; i < this.videoList.length; i++) {
          if (this.videoList[i].id === item.id) {
            this.videoBack.responsePk = this.videoBack.responsePk.replace(item.id + ',', '');
          }
        }
      }
      this.isUpload = false;
      let _this = this;
      setTimeout(function() {
        _this.uploadVideo();
      }, 1000);
      this.videoList.splice(index, 1);
      this.onProgressStatus = false;
      this.$emit('videoBack', this.videoBack);
    },
    // 上传视频
    uploadVideo() {
      let _this = this;
      _this.uploader = window.Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: 'ev-addVideo', // 上传选择的点选按钮DOM ID，必需
        container: 'ev-videoCon', // 上传区域DOM ID，默认是browser_button的父元素
        drop_element: 'ev-videoCon', // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        multi_selection: '', // 设置一次只能选择一个文件
        flash_swf_url: '//paas.allinmd.cn/modules/video_upload/plupload/Moxie.swf', // 引入flash，相对路径
        dragdrop: true, // 开启可拖曳上传
        chunk_size: '4mb', // 分块上传时，每块的体积
        uptoken_url: api.getQiniuToken.url, // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
        domain: '//api.allinmd.cn', // bucket域名，下载资源时用到，必需
        get_new_uptoken: false, // 设置上传文件的时候是否每次都重新获取新的uptoken
        filters: {
          mime_types: [ // 只允许上传video
            // {title: "video", extensions: "mp4,mov,avi,wmv,flv"}
            {title: 'video', extensions: 'mp4,mov,avi,wmv'}
          ],
          prevent_duplicates: true // 不允许选取重复文件
        },
        auto_start: true, // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
          'BeforeUpload': function(up, file) {
            // 每个文件上传前,处理相关的事情
            let name = _this.getName(file.name),
              fileName = name.fileName,
              suffix = name.suffixName;

            _this.isUpload = true;
            _this.onProgressStatus = true;
            _this.videoList.unshift({
              imgSrc: ''
            });
            if (!(/(mp4)|(mov)|(avi)|(wmv)|(flv)$/i.test(suffix))) {
              _this.uploader.removeFile(_this.uploader.getFile(file.id));
              alert('格式不支持，请选择mov、mp4、avi、wmv、flv');
              _this.onProgressStatus = false;
              _this.isUpload = false;
            }
            else if (file.size > 10 * 1048576) {
              _this.uploader.removeFile(_this.uploader.getFile(file.id));
              alert('视频过大，请联系在线客服寻求帮助');
              _this.onProgressStatus = false;
              _this.isUpload = false;
            }
            // 如果通过校验，则进行相关设置
            if (_this.onProgressStatus) {
              _this.videoName = fileName.length > 15 ? fileName.substring(0, 15) + '...' + '.' + suffix : fileName + '.' + suffix;
            }
            else {
              _this.videoList.splice(0, 1);
            }
          },
          'UploadProgress': function(up, file) { // 每个文件上传时,处理相关的事情
            _this.uloadPending = file.percent;
            _this.uloadPendingState = false;
          },
          'UploadComplete': function() { // 队列文件处理完毕后,处理相关的事情

          },
          'FileUploaded': function(up, file, info) { // 每个文件上传成功后,处理相关的事情
            if (info) {
              let dataJSON = JSON.parse(info);
              _this.saveVideo(dataJSON);
            }
          },
          'Error': function(up, err, errTip) { // 每个文件上传失败后,处理相关的事情
            if (err.code === -601) {
              alert('格式不支持，请选择mov、mp4、avi、wmv、flv');
            }
            _this.isFail = true;
            _this.isUpload = false;
            setTimeout(function() {
              _this.uploadVideo();
            }, 1000);
          }

        }
      });
    },
    //  保存视频
    saveVideo(dataJSON) {
      let _this = this,
        paramData = {
          key: dataJSON.key,
          persistentId: dataJSON.persistentId,
          videoName: _this.videoName,
          refType: 15,
          brochureId: _this.formData.brochureId,
          questionId: _this.formData.questionId,
          answerId: _this.formData.answerId,
          isValid: '0',
          visitSiteId: 25
        };
      axios.post(api.videoInfo.url, paramData).then((response) => {
        _this.uloadPendingState = true;
        _this.onProgressStatus = false;
        _this.videoList.splice(0, 1);
        if (response && response.data && response.data.responseObject && response.data.responseObject.responseStatus && response.data.responseObject.responsePk) {
          _this.videoList.unshift({
            imgSrc: '//img10.allinmd.cn/default/qiniu196_196.jpg',
            videoPath: '',
            id: response.data.responseObject.responsePk
          });
          _this.videoBack.responsePk += response.data.responseObject.responsePk + ',';
          _this.$emit('videoBack', _this.videoBack);
        }
        else {
          _this.isUpload = false;
          alert('视频上传失败');
        }
        setTimeout(function() {
          _this.uploadVideo();
        }, 1000);
      });
    },
    // 获取文件名
    getName(obj) {
      var path = obj;// obj.val();
      var pos1 = path.lastIndexOf('/');
      var pos2 = path.lastIndexOf('\\');
      var pos3 = Math.max(pos1, pos2);
      var pos4 = path.lastIndexOf('.');
      var fileName = path.substring(pos3 + 1, pos4);
      var suffixName = path.substring(pos4 + 1, path.length);
      return {
        'fileName': fileName, // 文件名
        'suffixName': suffixName // 文件后缀
      };
    }
  },
  mounted() {
    this.uploadVideo();
  }
};
</script>

<style scoped lang="scss">
  .uploadContainer {
    .noEdit {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
      background: rgba(0, 0, 0, .8);
      text-align: center;
      line-height: 100px;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      z-index: 5;
      top: 0;
    }
    .playIcon {
      position: absolute;
      width: 40px;
      height: 40px;
      background: url("/static/images/upload/video play_blue.png") no-repeat;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
    ul {
      position: relative;
      li {
        display: inline-block;
        vertical-align: middle;
        width: 100px;
        height: 100px;
        margin-right: 20px;
        /*margin-bottom: 20px;*/
        position: relative;
        .uploadCon {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          top: 0;
          p {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
            -moz-transform: translate(-50%, -50%);
            -webkit-transform: translate(-50%, -50%);
            -o-transform: translate(-50%, -50%);
            font-size: 13px;
            color: #fff;
            line-height: 1;
          }
          .uploadPending {
            i {
              display: block;
              width: 28px;
              height: 28px;
              background: url(/static/images/upload/loading.png) no-repeat;
              margin: 0 auto 5px;
              animation: rotate 1s linear infinite;
              -webkit-animation: rotate 1s linear infinite;
            }
          }
          .uploadFail {
            font-size: 14px;
            white-space: nowrap;
            line-height: 16px;
            text-align: center;
          }
        }
        img {
          width: 100px;
          height: 100px;
        }
        .itemClose {
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
    .addCon {
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      /*margin-bottom: 20px;*/
    }
    .addImg {
      /*display: inline-block;*/
      /*vertical-align: middle;*/
      cursor: pointer;
      width: 100px;
      height: 100px;
      position: relative;
      text-align: center;
      background: #EDF1FF;
      border-radius: 3px;
      i {
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
    input {
      width: 100px;
      height: 100px;
      z-index: 1;
      top: 0;
      left: 0;
      position: absolute;
      opacity: 0;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0);
      -ms-transform: rotate(0);
      -moz-transform: rotate(0);
      -webkit-transform: rotate(0);
      -o-transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
    }
  }

  @-webkit-keyframes rotate {
    0% {
      transform: rotate(0);
      -ms-transform: rotate(0);
      -moz-transform: rotate(0);
      -webkit-transform: rotate(0);
      -o-transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -webkit-transform: rotate(360deg);
      -o-transform: rotate(360deg);
    }
  }
</style>
