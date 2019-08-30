<template>
  <section class='specialityRoot'>
    <h3>专业入口ICON</h3>
    <div class='specialityRoot-list'>
      <ul>
        <li v-for='item in list'
            :key="item.navigationId"
            @click='click(item)'>
          <div class='specialityRoot-list-title'>{{item.navigationName}}</div>
          <div class='specialityRoot-list-img'>
            <img :src='!item.navigationAttUrl?"":"http://img05.allinmd.cn/"+item.navigationAttUrl'/>
          </div>
          <div class='specialityRoot-list-update'>修改</div>
        </li>
      </ul>
      <div class='specialityRoot-list-publish'
           @click='publish'>上线
      </div>
      <div class='clearBoth'></div>
    </div>

    <div class='specialityRoot-cloak' v-show='isPopupWindow'></div>
    <div class='specialityRoot-popupWindow' v-show='isPopupWindow'>
      <div class='el-message-box'>
        <div class='el-message-box__header'>
          <button type='button' aria-label='Close' class='el-message-box__headerbtn'
                  @click='close'>
            <i class='el-message-box__close el-icon-close'></i>
          </button>
        </div>
        <div class='specialityRoot-title'><h6>修改图片</h6></div>
        <div class='el-message-box__content'>
          <div class='el-input specialityRoot-photoWrap'>
            <div class='specialityRoot-photoWrap-groupPhoto'>
              <div class='specialityRoot-photoWrap-addPhoto'>
                <img v-show='uploadImgProps.attUrl' width='250px;' height='250px;'
                     :src='uploadImgProps.attUrl?"http://img05.allinmd.cn/"+uploadImgProps.attUrl:""'/>
                <input v-show='!uploadImgProps.attUrl' type='file' name='file' accept='image/jpeg,image/jpg,image/png'
                       @change='upload'>
                <img v-show='!uploadImgProps.attUrl' src='static/images/icons/icon-add34_34.png' alt=''
                     class='specialityRoot-photoWrap-addFlag'>
                <div v-show='!uploadImgProps.attUrl' class='specialityRoot-photoWrap-addPhotoDesc'>上传图片</div>
              </div>
            </div>
          </div>
        </div>
        <div class='el-message-box__btns'>
          <button type='button'
                  :class='publishStyle'
                  @click='updateList'>
            <span>上传</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
const Speciality = {
  data() {
    return {
      list: [], // 专业列表
      uploadImgProps: {}, // 上传后存放图信息
      isPopupWindow: false, // 是否显示弹窗
      currentId: 0, // 当前处理的专业Id
      uploadSize: 2, // 上传大小限制 单位M
      pixelRatio: { // 不允许小于这个宽高
        width: 140,
        height: 140
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  destroyed() {
    comm.goBack();
  },
  computed: {
    // 发布按钮样式
    publishStyle() {
      return this.uploadImgProps.attUrl
        ? 'specialityRoot-submit'
        : 'specialityRoot-submitDefault';
    }
  },
  methods: {
    // 获取专业列表
    init() {
      const _this = this;
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('specialityList', {
        navigationType: 10, // 类型 10
        sortType: 1, // 排序 1
        isValid: 1, // 是否有效1-有效0-无效
        firstResult: 0,
        maxResult: 20 // 参数变更取列表
      });
      promise.then((res) => {
        comm.closeLoading();
        if (res.responseStatus && res.responseData.dataList.length > 0) {
          _this.list = res.responseData.dataList;
        }
      }).catch((e) => {
        comm.closeLoading();
        if (!comm.axios.isCancel(e)) _this.$allin_confirm({title: '提示', content: '查询失败', type: 'notice'});
      });
    },
    // 发布上线
    publish() {
      const _this = this;
      _this.$allin_confirm({
        title: '提示',
        content: '确定将当前的专业入口图片上传到外网么？',
        done: function() {
          let specPublishParams = [];
          // 如果改变过则处理
          for (let x = 0; x < _this.list.length; x++) {
            if (_this.list[x].changeState) {
              delete _this.list[x].changeState;
              if (_this.list[x].imageId === undefined) {
                _this.list[x].imageId = ''; // 被替换前的图id，如果不存在，也需要有字段传空
              }
              specPublishParams.push(_this.list[x]);
            }
          }

          if (specPublishParams.length === 0) {
            _this.$allin_confirm({
              title: '提示',
              type: 'notice',
              content: '上线外网失败！原因：未修改任何专业',
              btnName: '知道了'
            });
            return false;
          }

          comm.openLoading('发布中...');
          const promise = comm.sendAxios('specialityPublish', {navigationList: JSON.stringify(specPublishParams)});
          promise.then((res) => {
            comm.closeLoading();
            if (res.responseStatus) {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '已上线到外网', btnName: '知道了'});
              _this.init();
            }
            else {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '上线到外网失败', btnName: '知道了'});
            }
            ;
          }).catch((e) => {
            comm.closeLoading();
            if (!comm.axios.isCancel(e)) {
              _this.$allin_confirm({
                title: '提示',
                content: '上线到外网失败',
                btnName: '知道了',
                type: 'notice'
              });
            }
          });
        }

      });
    },
    // 触发当前图片事件
    click(item) {
      this.uploadImgProps = {}; // 初始化之前上传的图片信息
      this.currentId = item.navigationId; // 获取当前操作图id
      this.isPopupWindow = true;
    },
    // 关闭上传图片弹窗
    close() {
      this.currentId = 0;
      this.isPopupWindow = false;
    },
    // 触发上传后更新列表
    updateList() {
      if (Object.keys(this.uploadImgProps).length === 0) {
        return false;
      }
      for (let x = 0; x < this.list.length; x++) {
        if (this.list[x].navigationId === this.currentId) {
          // 组装修改后的参数 原因：返回与发布时两个接口不一致
          this.list[x].navigationAttFormat = this.uploadImgProps.extName;
          this.list[x].navigationAttType = this.uploadImgProps.attType;
          this.list[x].navigationAttSize = this.uploadImgProps.attSize;
          this.list[x].navigationAttHeight = this.uploadImgProps.attHeight;
          this.list[x].navigationAttWidth = this.uploadImgProps.attWidth;
          this.list[x].dynaHeight = this.uploadImgProps.attHeight;
          this.list[x].dynaWidth = this.uploadImgProps.attWidth;
          this.list[x].navigationAttUrl = this.uploadImgProps.attUrl;
          this.list[x].visitSiteId = 25; // 新后台站点ID 固定
          this.list[x].changeState = true;
          this.currentId = 0;
          break;
        }
      }
      this.close();
    },
    // 上传图片
    upload(el) {
      const file = el.target.files[0];

      // 当点开选择图片，又不选，选择取消会触发
      if (!file) {
        return false;
      }

      // 计算是否超出限定大小
      if ((file.size / 1024 / 1024) > this.uploadSize) {
        this.$allin_confirm({title: '提示', content: '图片最大不超过' + this.uploadSize + 'M，不可上传', type: 'notice'});
        return false;
      }

      const imageType = /image.*/;
      const _this = this;
      if (file.type.match(imageType)) {
        let reader = new FileReader();
        reader.onload = () => {
          let img = new Image();
          img.src = reader.result;
          // 延时装载到img后才能拿到宽高比
          setTimeout(() => {
            if (img.width < _this.pixelRatio.width || img.height < _this.pixelRatio.height) {
              _this.$allin_confirm({
                title: '提示',
                type: 'notice',
                content: '上传失败，图片尺寸小于width: ' + _this.pixelRatio.width + 'px; height: ' + _this.pixelRatio.height + 'px;'
              });
            }
            else {
              let obj = {fileContent: '', extName: '', watermark: 1}; // 不打水印
              Object.assign(obj, {
                extName: file.type.split('/')[1],
                fileContent: img.src.split(',')[1]
              });
              comm.openLoading('上传中...');
              const promise = comm.sendAxios('uploadImg', obj);
              promise.then((res) => {
                comm.closeLoading();
                if (res.responseStatus) {
                  this.uploadImgProps = res.responseData.data_list;
                }
                else {
                  this.$allin_confirm({title: '提示', content: '修改图片失败，请重新上传', type: 'notice'});
                }
                ;
              }).catch((e) => {
                comm.closeLoading();
                if (!comm.axios.isCancel(e)) {
                  this.$allin_confirm({
                    title: '提示',
                    content: '修改图片失败，请重新上传',
                    type: 'notice'
                  });
                }
              });
            }
          }, 100);
        };
        reader.readAsDataURL(file);
      }
      else {
        this.$allin_confirm({title: '提示', content: '仅支持JPG/JPEG/PNG格式的图片', type: 'notice'});
        return false;
      }
    }
  }
};

export default Speciality;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .clearBoth {
    clear: both;
  }
  .specialityRoot {

    .specialityRoot-list {
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      margin: 0 auto;
      width: 880px;

      ul {
        padding-top: 40px;

        li {
          cursor: pointer;
          width: 160px;
          margin-left: 23px;
          float: left;

          .specialityRoot-list-title {
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #555555;
            letter-spacing: 0;
            line-height: 16px;
            text-align: center;
            margin-bottom: 18px;
          }

          .specialityRoot-list-img {
            width: 158px;
            height: 158px;
            background: #F7F9FC;
            border: 1px solid #E6E6E8;
            border-radius: 3px;

            img {
              width: 158px;
              height: 158px;
            }

          }
          .specialityRoot-list-update {
            border: 1px solid #cad1ed;
            border-radius: 3px;
            text-align: center;
            width: 158px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4B67D6;
            margin-top: 18px;
          }

        }

        li:nth-child(4n+1){
          margin-left: 80px;
        }
        li:nth-child(n+5){
          margin-top: 40px;
        }

      }
      .specialityRoot-list-publish {
        cursor: pointer;
        float: left;
        margin: 30px 0 30px 630px;
        width: 158px;
        height: 32px;
        background: #3846DC;
        border-radius: 3px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #FFFFFF;
        text-align: center;
        line-height: 32px;
      }

    }
    h3 {
      margin: 36px auto 25px auto;
      width: 880px;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 20px;
    }

  }

  .specialityRoot-cloak {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    opacity: 0.7;
    background: #000000;
  }

  .specialityRoot-popupWindow {
    z-index: 11;
    position: fixed;
    left: 0%;
    top: 25%;
    bottom: 0;
    right: 0;
    text-align: center;

    .el-message-box__btns {
      padding: 10px 15px 0;
      text-align: center;

      .specialityRoot-submit {
        cursor: pointer;
        width: 160px;
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

      .specialityRoot-submitDefault {
        cursor: pointer;
        width: 160px;
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
    .el-message-box {
      width: 380px;
      height: 447px;

      .el-message-box__content {
        position: relative;
        padding: 28px 45px;
        color: #606266;
        font-size: 14px;

        .specialityRoot-photoWrap-addPhoto {
          width: 250px;
          height: 250px;
          background: #F7F9FC;
          border: 1px solid #E6E6E8;
          border-radius: 4px;
          float: left;
          z-index: 1;

          .specialityRoot-photoWrap-addPhotoDesc {
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

        }
        .specialityRoot-photoWrap-addFlag {
          position: relative;
          left: 108px;
          top: 92px;
        }

        input {
          width: 250px;
          height: 250px;
          cursor: pointer;
          position: absolute;
          opacity: 0;
          outline: none;
          z-index: 2;
        }

      }
      .specialityRoot-title {
        color: #222222;
        letter-spacing: 0;
        line-height: 24px;
        text-align: center;
      }

      .specialityRoot-photoWrap .specialityRoot-photoWrap-groupPhoto {
        margin-top: 18px;
        width: 250px;
        height: 250px;
        margin: 0 auto;
      }

    }
  }

</style>
