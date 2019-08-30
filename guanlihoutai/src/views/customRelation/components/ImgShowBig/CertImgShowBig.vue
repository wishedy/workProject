<template>
  <section class="show-big-img" v-show="visible">
    <div class="switch-prev " @click="switchPrevBtnOnClick"></div>
    <figure class="show-panel">
      <div class="show-header">
        <i class="show-header-edit"></i><label>证件编号：</label>
        <input v-model="showTitle"
               class="edit-input"
               :readonly="isReadOnly"/>
        <i class="show-header-close"
           @click="closeOnClick">
        </i>
      </div>
      <div class="show-img">
        <div>
          <img
            ref="imgElement"
            :style="imgRotateController.imgStyle"
            :src="src"
            @mouseover="imgMouseOverHandle"
            @mouseout="imgMouseOutHandle"/>
        </div>
      </div>
      <div class="rotate-control-box"
           :class="{'transparent-effect-open':!rotateControlActive,'transparent-effect-close':rotateControlActive} "
           @mouseover="imgMouseOverHandle"
           @mouseout="imgMouseOutHandle">
        <div class="rotate-left" @click="imgRotateController.rotateImgHandle(-90)"></div>
        <div class="rotate-right" @click="imgRotateController.rotateImgHandle(90)"></div>
      </div>
    </figure>
    <div class="switch-next " @click="switchNextBtnOnClick"></div>
  </section>
</template>

<script>
import ImgRotateController from '@/views/customRelation/components/ImgShowBig/ImgRotateController';

/**
   * 作用：查看大图弹层
   * 使用方法：<showBig :src="showBigData.url" :isReadOnly="showBigData.idReadOnly" @closeShowBig="closeShowBigHandle" :title="'showBigData.title'" :visible="showBigData.visible"></showBig>
   * 注意事项：需要引入 imgRotateController.js 作为图片旋转控制器
   */
export default {
  name: 'CertImgShowBig',
  props: {
    src: {
      type: String,
      require: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      require: true
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      imgElement: null,
      imgRotateController: {},
      showTitle: this.title,
      rotateControlActive: false
    };
  },
  methods: {
    imgMouseOverHandle() {
      this.rotateControlActive = true;
    },
    imgMouseOutHandle() {
      this.rotateControlActive = false;
    },
    switchPrevBtnOnClick() {
      this.$emit('switchPrevEvent');
    },
    switchNextBtnOnClick() {
      this.$emit('switchNextEvent');
    },
    closeOnClick() {
      this.$emit('closeShowBig', this.showTitle);
    },
    initImg() {
      this.imgElement = this.$refs.imgElement;
      if (!this.imgElement || this.imgElement.width <= 0) {
        // 加载图片
        let img = new Image();
        img.src = this.src;
        img.onload = () => {
          // 初始化旋转控制器
          this.imgRotateController = new ImgRotateController(this.imgElement, 758, 572);
        };
      }
      else {
        // 初始化旋转控制器
        this.imgRotateController = new ImgRotateController(this.imgElement, 758, 572);
      }
    }
  },
  watch: {
    title() {
      this.showTitle = this.title;
    },
    src() {
      this.initImg();
    }
  }
};
</script>

<style lang="scss" scoped>
  .show-big-img {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);

    .switch-prev {
      display: flex;
      position: absolute;
      width: 23px;
      height: 41px;
      justify-content: space-between;
      left: 15%;
      top: 50%;
      background: rgb(111, 111, 111) url(/static/images/icons/icon-arrow-white-right.png) no-repeat center;
      transform: rotate(180deg);
      cursor: pointer;
    }

    .switch-next {
      display: flex;
      position: absolute;
      width: 23px;
      height: 41px;
      background: rgb(111, 111, 111) url(/static/images/icons/icon-arrow-white-right.png) no-repeat center;
      right: 15%;
      top: 50%;
      cursor: pointer;
    }

    .show-panel {
      display: block;
      width: 758px;
      height: 572px;
      margin: 5% auto;
      background: #000;
      font-size: 0;
    }
    .show-header {
      position: relative;
      background: rgba(0, 0, 0, 0.5);
      color: #ffffff;
      text-align: center;
      padding: 5px 0;
      z-index: 2;
      .show-header-edit {
        display: inline-block;
        margin-right: 10px;
        background: url("/static/images/icons/icon-edit.png") center center no-repeat;
        width: 15px;
        height: 15px;
      }
      label {
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 15px;
      }
      .edit-input {
        border: none;
        background: none;
        font-family: PingFangSC-Regular;
        font-size: 15px;
        color: #FFFFFF;
        letter-spacing: 0;
        line-height: 15px;
      }
      .show-header-close {
        display: inline-block;
        position: absolute;
        right: 10px;
        background: url("/static/images/icons/icon-close-white.png") center center no-repeat;
        width: 15px;
        height: 15px;
      }
    }
    .show-img {
      width: 100%;
      height: 100%;
      margin-top: -30px;
      text-align: center;
      display: table;
      div {
        display: table-cell;
        vertical-align: middle;
        img {
          z-index: 1;
          max-height: 100%;
          max-width: 100%;
        }
      }
    }
    .rotate-control-box {
      width: 96px;
      height: 40px;
      display: flex;
      justify-content: space-between;
      z-index: 99;
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      div {
        cursor: pointer;
        width: 44px;
        height: 44px;
        border-radius: 22px;
      }
      .rotate-left {
        background: #ffffff url(/static/images/icons/icon-turn-left-black.png) center no-repeat;
        &:active {
          background: #4B67D6 url(/static/images/icons/icon-turn-left-white.png) center no-repeat;
        }
      }
      .rotate-right {
        background: #ffffff url(/static/images/icons/icon-turn-right-black.png) center no-repeat;
        &:active {
          background: #4B67D6 url(/static/images/icons/icon-turn-right-white.png) center no-repeat;
        }
      }
    }

    .transparent-effect-open {
      opacity: 0.1;
    }
    .transparent-effect-close {
      opacity: 1;
    }
  }

</style>
