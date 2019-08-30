<template>
  <section>
    <div class="popupWindow-cloak"></div>
    <div class="popupWindow-popupWindow">
      <div class="el-message-box">
        <div class="el-message-box__header">
          <button type="button" aria-label="Close" class="el-message-box__headerbtn"
                  @click="close">
            <i class="el-message-box__close el-icon-close"></i>
          </button>
        </div>
        <div class="popupWindow-popupWindow-title"><h6>修改图片</h6></div>
        <div class="el-message-box__content">
          <div class="el-input popupWindow-popupWindow-photoWrap">
            <div class="popupWindow-popupWindow-groupPhoto">
              <div class="popupWindow-popupWindow-addPhoto">
                <img v-show="imgProps.fileContent" width="250px;" height="250px;"
                  :src="imgProps.fileContent"/>
                <input type="file" name="file"
                       @change="upload"
                       v-show="!imgProps.fileContent" accept="image/jpeg,image/jpg,image/png">
                <img v-show="!imgProps.fileContent" src="static/images/icons/icon-add34_34.png" alt="" class="popupWindow-popupWindow-addFlag">
                <div v-show="!imgProps.fileContent" class="popupWindow-popupWindow-addPhotoDesc">上传图片</div>
              </div>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <button type="button"
                  :class="publishStyle"
                  @click="publish">
            <span>上传</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/**
   * 单图上传弹出窗口
   * @module UploadSingleImagePopupWindow.vue
   * @desc 在上传图片时需要弹出一个上传窗口，这个窗口只适用于上传一张.
   *       调用者需要关注三个点: 1.打开状态. 2.控制关闭同步状态  3.拿回结果 setPhotoProps{base64等}
   * @author qiaoliang
   * @date 2019/1/11 0011 下午 4:49
   * @param {Number} [uploadSize]  - 上传大小 单位M
   * @param {Object} [pixelRatio] - 单位px 像素比 pixelRatio.width宽 pixelRatio.height高
   * @event {click} [close] - 关闭当前弹窗事件 状态= false;
   * @event {click} [setPhotoProps] - 设置结果事件：图片类型 setPhotoProps.extName 图片内容 setPhotoProps.fileContent
   * @example 调用示例
     <keep-alive>
        <UploadSingleImagePopupWindow v-if="showPopupWindow"
           @close="closePopupWindow"
           @setPhotoProps="setPhotoProps"
           :uploadSize="uploadSize"
           :pixelRatio="pixelRatio"/>
     </keep-alive>
   */
const UploadSingleImagePopupWindow = {
  props: {
    uploadSize: {
      type: Number,
      required: true
    },
    pixelRatio: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imgProps: {
        extName: '',
        fileContent: ''
      }
    };
  },
  computed: {
    publishStyle() {
      return this.imgProps.fileContent ? 'popupWindow-popupWindow-submit' : 'popupWindow-popupWindow-submitDefault';
    }
  },
  methods: {
    upload(el) {
      const file = el.target.files[0];
      if (file === undefined) {
        return false;
      };

      const b2m = file.size / 1024 / 1024;
      if (b2m > this.uploadSize) {
        this.$allin_confirm({title: '提示', type: 'notice', content: '图片最大不超过' + this.uploadSize + 'M，不可上传'});
        return false;
      }

      const imageType = /image.*/;
      if (!file.type.match(imageType)) {
        this.$allin_confirm({title: '提示', content: '仅支持JPG/JPEG/PNG格式的图片', type: 'notice'});
        return false;
      }
      else {
        const reader = new FileReader();
        reader.onload = () => {
          let img = new Image();
          img.src = reader.result;

          // 延时装载到img后才能拿到宽高比
          const _this = this;
          setTimeout(function() {
            if (img.width > _this.pixelRatio.width || img.height > _this.pixelRatio.height) {
              _this.$allin_confirm({
                title: '提示',
                type: 'notice',
                content: '上传失败，图片尺寸不能超过' + _this.pixelRatio.width + 'px * ' + _this.pixelRatio.height + 'px'
              });
            }
            else {
              _this.imgProps = {
                extName: file.type.split('/')[1],
                fileContent: img.src
              };
            }
          }, 100);
        };
        reader.readAsDataURL(file);
      }
    },
    close() {
      this.$emit('close');
      // 初始化图片信息
      this.imgProps = {
        extName: '',
        fileContent: ''
      };
    },
    publish() {
      if (!this.imgProps.fileContent) {
        return false;
      }

      this.$emit('setPhotoProps', this.imgProps);
      this.close();
    }
  }
};
export default UploadSingleImagePopupWindow;
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .popupWindow-cloak{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
      opacity: 0.7;
      background: #000000;
  }

  .popupWindow-popupWindow{
      z-index: 11;
      position: fixed;
      left: 0%;
      top: 25%;
      bottom: 0;
      right: 0;
      text-align: center;

      .popupWindow-popupWindow-title{
          color: #222222;
          letter-spacing: 0;
          line-height: 24px;
          text-align: center;
      }
      .el-message-box{
          width:380px;
          height:447px;

          .el-message-box__btns{
              padding: 10px 15px 0;
              text-align:center;
              .popupWindow-popupWindow-submit{
                  cursor: pointer;
                  width:160px;
                  height: 41px;
                  background: #4B67D6;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 15px;
              }
              .popupWindow-popupWindow-submitDefault{
                  cursor: pointer;
                  width:160px;
                  height: 41px;
                  background: #b5b8c3;
                  border-radius: 3px;
                  font-family: PingFangSC-Regular;
                  font-size: 15px;
                  color: #FFFFFF;
                  letter-spacing: 0;
                  text-align: center;
                  line-height: 15px;
              }
          }
          .el-message-box__content {
              position: relative;
              padding: 28px 45px;
              color: #606266;
              font-size: 14px;
              .popupWindow-popupWindow-photoWrap .popupWindow-popupWindow-groupPhoto{
                  margin-top: 18px;
                  width: 250px;
                  height: 250px;
                  margin: 0 auto;
              }
              .popupWindow-popupWindow-addPhoto{
                  width: 250px;
                  height: 250px;
                  background: #F7F9FC;
                  border: 1px solid #E6E6E8;
                  border-radius: 4px;
                  float: left;
                  z-index: 1;
                  .popupWindow-popupWindow-addPhotoDesc{
                      font-family: PingFangSC-Regular;
                      font-size: 15px;
                      color: #4B67D6;
                      letter-spacing: 0;
                      text-align: right;
                      line-height: 15px;
                      position: relative;
                      left: 95px;
                      width: 60px;
                      top: 100px;
                  }
                  .popupWindow-popupWindow-addFlag{
                    position:relative;
                    left: 108px;
                    top: 92px;
                  }
                  input{
                    width: 250px;
                    height: 250px;
                    cursor: pointer;
                    position: absolute;
                    opacity: 0;
                    outline: none;
                    z-index: 2;
                  }
              }

          }

      }
  }

</style>
