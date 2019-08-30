<template>
  <section class="indexBackground">
    <h3>{{indexImgCfgTitle}}</h3>
    <div class="indexBackground-list">
      <ul>
        <li v-for="(sub,index) in cfgList.children" :key="index">
          <div class="indexBackground-list-cfgTitle">{{sub.title}}</div>
          <div :class="sub.title?'indexBackground-list-imgMore':'indexBackground-list-img'" @click="update(index)">
            <div v-show="sub.imgProps.fileContent">
              <img class="indexBackground-list-imgClose" src="/static/images/icons/icon-close-gray.png" title="删除"
                   alt="删除"
                   @click.stop="deleteImg(index)">
              <img :src="sub.imgProps.fileContent"/>
            </div>
            <div v-show="!sub.imgProps.fileContent" class="indexBackground-list-noImage">当前无背景图</div>
          </div>
          <div>
            <div :class="sub.title?'indexBackground-list-updateMore':'indexBackground-list-update'" @click="update(index)">修改
            </div>
          </div>
        </li>
      </ul>
      <div class="indexBackground-list-publish" @click="publish">上线</div>

      <keep-alive>
        <UploadSingleImagePopupWindow v-if="showPopupWindow"
                                      @close="closePopupWindow"
                                      @setPhotoProps="setPhotoProps"
                                      :uploadSize="uploadSize"
                                      :pixelRatio="pixelRatio"/>
      </keep-alive>

      <keep-alive>
        <ChooseImgCfgWindow v-if="showChooseImgCfgWindow"
                            @setImgCfgType="setImgCfgType"/>
      </keep-alive>

    </div>

  </section>
</template>

<script>
import comm from '@/assets/js/utils/comm';
import UploadSingleImagePopupWindow from './components/UploadSingleImagePopupWindow';
import ChooseImgCfgWindow from './components/ChooseImgCfgWindow';

// 首页图片配置列表 1.首页背景图、2.tab背景图、4.活动专题入口图、5.会议入口图 6.菁英会
// imageSubId:1:手术精讲tab、2:推荐tab、3.直播tab
const CfgList = [{
  id: 1,
  active: false,
  title: '首页顶部背景图',
  children: [
    {
      title: '',
      imgProps: {
        extName: '',
        fileContent: '',
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 1 // 首页背景图的类型
      }
    }
  ]
}, {
  id: 5,
  active: false,
  title: '会议入口图',
  children: [
    {
      title: '',
      imgProps: {
        extName: '',
        fileContent: '',
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 5 // 首页背景图的类型
      }
    }
  ]
}, {
  id: 4,
  active: false,
  title: '活动专题入口图',
  children: [
    {
      title: '',
      imgProps: {
        extName: '',
        fileContent: '',
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 4 // 首页背景图的类型
      }
    }
  ]
}, {
  id: 6,
  active: false,
  title: '菁英会',
  children: [
    {
      title: '',
      imgProps: {
        extName: '',
        fileContent: '',
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 6 // 首页背景图的类型
      }
    }
  ]
}, {
  id: 2,
  active: false,
  title: 'tab背景图',
  children: [
    {
      title: '手术精讲tab',
      imgProps: {
        id: null,
        imageId: null,
        sortId: 1, // 顺序号
        extName: '',
        fileContent: '',
        imageSubId: 1,
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 2 // 首页背景图的类型
      }
    },
    {
      title: '推荐tab',
      imgProps: {
        id: null,
        imageId: null,
        sortId: 2, // 顺序号
        extName: '',
        fileContent: '',
        imageSubId: 2,
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 2 // 首页背景图的类型
      }
    },
    {
      title: '直播tab',
      imgProps: {
        id: null,
        imageId: null,
        sortId: 3, // 顺序号
        extName: '',
        fileContent: '',
        imageSubId: 3,
        watermark: 1, // 1无水印 0有水印
        isValid: 1, // 1为有效 0无效
        imageType: 2 // 首页背景图的类型
      }
    }
  ]
}];

const IndexBackground = {
  components: {
    UploadSingleImagePopupWindow: UploadSingleImagePopupWindow,
    ChooseImgCfgWindow: ChooseImgCfgWindow
  },
  data() {
    return {
      cfgList: comm.deepCopy(CfgList),
      updateIndex: 0, // 更新图片索引值
      // 以下为UploadSingleImagePopupWindow 组件所需参数
      showPopupWindow: false,
      uploadSize: 2, // 单位M
      pixelRatio: { // 最大宽高比
        width: 1125,
        height: 588
      },
      // 以下为ChooseImgCfgWindow 组件所需参数
      showChooseImgCfgWindow: true
    };
  },
  destroyed() {
    this.cfgList = comm.deepCopy(CfgList);
    comm.goBack();
  },
  computed: {
    indexImgCfgTitle() {
      for (const cfg of this.cfgList) {
        if (cfg.active) {
          this.cfgList = cfg;
          return cfg.title;
        }
      }
    }
  },
  methods: {
    // 初始化
    init(imageType) {
      comm.openLoading('加载中...');
      const promise = comm.sendAxios('indexBackgroundGet', {imageType: imageType, isValid: 1});
      const _this = this;
      promise.then((res) => {
        comm.closeLoading();
        const rep = res.responseData;
        if (rep && rep.dataList.length > 0) {
          _this.initUpdateImgData(rep.dataList);
        }
      }).catch(() => {
        comm.closeLoading();
        _this.$allin_confirm({content: '获取首页背景图失败', type: 'notice'});
      });
    },
    // 初始化处理单图片不存在子id 及 多图存在子id时更新对应数据
    initUpdateImgData(rep) {
      const children = this.cfgList.children;
      if (rep.length === 1) {
        Object.assign(children[0].imgProps, {
          id: rep[0].id,
          imageId: rep[0].imageId,
          fileContent: rep[0].imageUrl
        });
      }
      else {
        for (const item of rep) {
          for (let x = 0; x < children.length; x++) {
            if (item.imageSubId === children[x].imgProps.imageSubId) { // 子列表id相等
              Object.assign(children[x].imgProps, {
                id: item.id,
                imageId: item.imageId,
                fileContent: item.imageUrl
              });
            }
          }
        }
      }
    },
    // 选定后的图片配置
    setImgCfgType(item) {
      this.showChooseImgCfgWindow = false;
      for (const x of this.cfgList) {
        if (x.id === item.id) {
          x.active = true;
          this.init(x.id);
          break;
        }
      }
    },
    // 上传图片
    update(index) {
      this.updateIndex = index;
      this.showPopupWindow = true;
    },
    // 删除图片
    deleteImg(index) {
      const _this = this;
      this.$allin_confirm({
        title: '提示',
        content: '确定删除吗？',
        done: () => {
          _this.cfgList.children[index].imgProps.isValid = 0; // 修改为删除标识
          _this.cfgList.children[index].imgProps.fileContent = ''; // 将图片内容清除
        }
      });
    },
    // 关闭上传图片窗口
    closePopupWindow() {
      this.showPopupWindow = false;
    },
    // 上传完成后设置图片属性
    setPhotoProps(imgProps) {
      Object.assign(this.cfgList.children[this.updateIndex].imgProps, imgProps);
    },
    // 处理发布参数 规律：图片情况 1.base64(新旧)  2.图片路径(旧图)  3.空图(新旧)
    handlePublishParams() {
      let params = [];
      const list = comm.deepCopy(this.cfgList.children);
      for (const item of list) {
        // 新图
        if (item.imgProps.fileContent.split(',')[0] !== item.imgProps.fileContent) { //
          item.imgProps.fileContent = item.imgProps.fileContent.split(',')[1]; // 后端只接base64部分，前端需要全部
          params.push(item.imgProps);
        }

        // 旧图删除
        if (item.imgProps.id && !item.imgProps.fileContent) {
          params.push(item.imgProps);
        }
      }
      return JSON.stringify(params);
    },
    // 发布
    publish() {
      const _this = this;
      // 获取参数集
      const children = this.cfgList.children;
      // 删除与增修  防止删除后，状态变更，在此基础上又新增图片
      for (const item of children) {
        if (item.imgProps.fileContent) {
          item.imgProps.isValid = 1;
        }
      }

      _this.$allin_confirm({
        title: '提示',
        content: '确定将当前显示的首页背景图上传到外网么？',
        done: () => {
          const params = {backgroundList: this.handlePublishParams()};

          // 防止无数据提交
          if (params.backgroundList === '[]') {
            _this.$allin_confirm({title: '提示', type: 'notice', content: '已上线到外网', btnName: '知道了'});
            return false;
          }

          comm.openLoading('发布中...');
          const promise = comm.sendAxios('indexBackgroundSave', params);
          promise.then((res) => {
            comm.closeLoading();
            if (res.responseStatus) {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '已上线到外网', btnName: '知道了'});
              _this.init(_this.cfgList.children[0].imgProps.imageType);
            }
            else {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '已上线到外网', btnName: '知道了'});
            }
          }).catch((err) => {
            comm.closeLoading();
            if (!comm.axios.isCancel(err)) {
              _this.$allin_confirm({title: '提示', type: 'notice', content: '上线到外网失败', btnName: '知道了'});
            }
          });
        }
      });
    }

  }
};
export default IndexBackground;
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  .indexBackground {
    .indexBackground-list {
      background: #FFFFFF;
      box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.04);
      border-radius: 3px;
      margin: 0 auto;
      width: 880px;
      height: 543px;
      ul {
        padding-top: 40px;
        li {
          cursor: pointer;
          /*width:140px;*/
          margin-left: 23px;
          float: left;
          .indexBackground-list-cfgTitle {
            width: 240px;
            text-align: center;
            margin: 10px;
            font-size: 16px;
            font-weight: bold;
          }
          .indexBackground-list-imgMore {
            width: 240px;
            height: 196px;
            background: #F7F9FC;
            border: 1px solid #E6E6E8;
            border-radius: 3px;
            img {
              width: 240px;
              height: 196px;
              position: absolute;
            }
            .indexBackground-list-imgClose {
              width: 23px;
              height: 23px;
              cursor: pointer;
              float: right;
              position: relative;
              z-index: 1;
              border: 1px solid #c7ced8;
            }
            .indexBackground-list-noImage {
              font-family: PingFangSC-Regular;
              font-size: 15px;
              color: #4B67D6;
              letter-spacing: 0;
              text-align: center;
              line-height: 15px;
              position: relative;
              top: 90.5px;
            }
          }
          .indexBackground-list-updateMore {
            border: 1px solid #cad1ed;
            border-radius: 3px;
            text-align: center;
            width: 240px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4B67D6;
            margin-top: 18px;
          }
          .indexBackground-list-img {
            width: 375px;
            height: 196px;
            background: #F7F9FC;
            border: 1px solid #E6E6E8;
            border-radius: 3px;
            img {
              width: 375px;
              height: 196px;
              position: absolute;
            }
            .indexBackground-list-imgClose {
              width: 23px;
              height: 23px;
              cursor: pointer;
              float: right;
              position: relative;
              z-index: 1;
            }
            .indexBackground-list-noImage {
              font-family: PingFangSC-Regular;
              font-size: 15px;
              color: #4B67D6;
              letter-spacing: 0;
              text-align: center;
              line-height: 15px;
              position: relative;
              top: 90.5px;
            }
          }
          .indexBackground-list-update {
            border: 1px solid #cad1ed;
            border-radius: 3px;
            text-align: center;
            width: 375px;
            height: 30px;
            line-height: 30px;
            font-size: 14px;
            color: #4B67D6;
            margin-top: 18px;
          }
        }
        li:first-child {
          margin-left: 44px;
          /*position: absolute;*/
        }
      }
      .indexBackground-list-publish {
        cursor: pointer;
        margin: 430px 0 0 696px;
        width: 138px;
        height: 32px;
        background: #3846DC;
        border-radius: 3px;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
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

</style>
