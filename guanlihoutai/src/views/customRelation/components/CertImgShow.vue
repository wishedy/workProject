<template>
  <div class="cerImgBox">
    <div class="big-img-box">
      <div class="gallery-top">
        <div class="swiper-container topSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-no-swiping" v-for="(item,index) in imgList" :key="index">
              <div>
                <img :src="item.attPath"
                     :imgAttId="item.id"
                     @click="showBigImgOnClick(item)"
                     v-on:mouseover="imgMouseOverHandle"
                     v-on:mouseout="imgMouseOutHandle"/>
              </div>
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
      </div>
      <div class="rotate-control-box" v-if="imgList.length>0" :class="{'transparent-effect-open':!rotateControlActive,'transparent-effect-close':rotateControlActive} " v-on:mouseover="imgMouseOverHandle" v-on:mouseout="imgMouseOutHandle">
        <div class="rotate-left" @click="turnLeft">
        </div>
        <div class="rotate-right" @click="turnRight">
        </div>
      </div>
    </div>
    <div class="gallery-thumbs">
      <div class="swiper-container thumbSwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item,index) in imgList" :key="index">
            <imgRadio @click.native="radioClick(item)"
                      :selected="item.selected"></imgRadio>
            <section>
              <img :src="item.attPath" :index="index"/>
              <div v-if="swiperConClass=='.new'"
                   @click="updateCartImgOnclick(item)">
                <p>替换图片<i class="el-icon-sort el-icon--right"></i></p>
              </div>
            </section>
            <p v-if="item.isFirst">| {{attTypeFormat(item.attType)}}</p>
          </div>
        </div>

        <div class="swiper-pagination swiper-pagination-white"></div>
      </div>

      <div class="swiper-button-prev" slot="button-prev" v-show="imgList.length>2" @click="swiperBtnPrevOnClick"></div>
      <div class="swiper-button-next" slot="button-next" v-show="imgList.length>2" @click="swiperBtnNextOnClick"></div>
    </div>
    <input v-if="swiperConClass=='.new'" type="file" @change="cerImgInputChangeHandle" ref="cerImg_merge_upload" style="display: none">
  </div>

</template>
<style lang="scss" scoped>

  .rotate-control-box {
    width: 96px;
    height: 40px;
    display: flex;
    justify-content: space-between;
    z-index: 99;
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

  .big-img-box {
    position: relative;
    .rotate-control-box {
      position: absolute;
      bottom: 13px;
      left: 220px;
    }
  }

  .img-con {
    width: 530px;
    height: 398px;
  }

  .gallery-top {
    width: 530px;
    height: 397px;
    .swiper-container {
      margin-left: auto;
      margin-right: auto;
      width: 530px;
      height: 397px;

      .swiper-wrapper {
        .swiper-slide {
          box-sizing: border-box;
          width: 100%;
          height: 397px;

          text-align: center;
          display: table;
          div{
            display: table-cell;
            vertical-align: middle;
          }
          img {
            width: auto;
            height: auto;
            max-width: 530px;
            max-height: 398px;
          }
        }

      }
    }
    .rotate90 {
      transform: rotate(90deg);
      -webkit-transform: rotate(90deg);
    }

    .rotate180 {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    }

    .rotate270 {
      transform: rotate(270deg);
      -webkit-transform: rotate(270deg);
    }
  }

  .gallery-thumbs {
    height: 154px;
    box-sizing: border-box;
    padding: 18px 0;
    width: 530px;
    position: relative;
    .swiper-wrapper-center {
      justify-content: center;
    }
    .swiper-container {
      margin-left: auto;
      margin-right: auto;
      height: 100%;
      width: 100%;
      .swiper-wrapper {
        .swiper-slide {
          width: 120px;
          height: 90px;
          border: 2px solid #fff;
          box-sizing: border-box;
          text-align: center;
          background: #fff;
          margin-right: 17px;
          border-radius: 4px;
          position: relative;
          p {
            color: #BCC2CC;
            font-size: 13px;
            text-align-last: left;
          }
          section {
            height: 90px;
            //替换图片
            & > div {
              position: absolute;
              left: 0;
              bottom: 0;
              width:74px;
              height:22px;
              background:rgba(0,0,0,1);
              opacity:0.5;
              padding-left: 6px;
              p{
                padding:0;
                font-size:12px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(255,255,255,1);
                line-height:22px;
                cursor: pointer;
              }
            }
          }
          .radio {
            width: 22px;
            height: 22px;
            line-height: 36px;
            position: absolute;
            top: 4px;
            right: 4px;
            margin: 0;
            cursor: pointer;
            background: url(/static/images/icons/icon-tick-unselected-on-pic.png) no-repeat center;
            &.selected {
              background: url(/static/images/icons/icon-tick-selected.png) no-repeat center;;
            }
          }
          &.swiper-slide-active {
            background: white;
            img {
              box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.2);
            }
          }
          img {
            display: inline-block;
            max-width: 100%;
            max-height: 100%;
            margin: 0 auto;
            cursor: pointer;
          }
        }
      }
    }
  }

  .swiper-button-prev {
    position: absolute;
    width: 23px;
    height: 41px;
    background-size: 100% 100%;
    left: -12px;
    margin-top: -6px;
    background: #4A5B6F url(/static/images/icons/icon-arrow-white-left.png) no-repeat center;
    opacity: 0.56;
    &.swiper-button-disabled {
      opacity: 0.2;
    }
  }

  .swiper-button-next {
    width: 23px;
    height: 41px;
    right: -12px;
    margin-top: -6px;
    background: #4A5B6F url(/static/images/icons/icon-arrow-white-right.png) no-repeat center;
    opacity: 0.56;
    &.swiper-button-disabled {
      opacity: 0.2;
    }
  }

  .transparent-effect-open{
    opacity: 0.1;
  }
  .transparent-effect-close{
    opacity: 1;
  }

</style>
<script>
import Vue from 'vue';
import Swiper from 'swiper';
import comm from '@/assets/js/utils/comm';
import 'swiper/dist/css/swiper.css';
import axios from '@/assets/js/utils/request';
import apiConfig from '@/api/apiUrlConfig';
import {ImgDomRotateController} from '@/views/customRelation/components/ImgShowBig/ImgRotateController';

Vue.component('imgRadio', {
  data() {
    let mergeMode = this.$store.state.mergeMode;
    return {
      mergeMode: mergeMode,
      selectedSide: 'old'
    };
  },
  props: ['side', 'imgAttId', 'selected'],
  computed: {
    isSelected: function() {
      return this.selected === this.side;
    }
  },

  template: '<b class="radio" :class="{selected:selected}" v-if="this.$store.state.mergeMode"></b>'
});

export default {
  name: 'cert-img-show',
  data() {
    return {
      initState: false,
      topSwiper: null,
      thumbSwiper: null,
      rotateAngle: 0,
      selectedImgIds: [],
      imgDomRotateController: null,
      certImgFileData: {},
      imgDomRotateData: {
        currentIndex: -1,
        parentWidth: 530,
        parentHeight: 397
      },
      rotateControlActive: false

    };
  },
  props: ['swiperConClass', 'imgList', 'customerId', 'selectedIndex'], //
  components: {},
  watch: {
    'selectedIndex': function(index) {
      console.log(index);
      // this.topSwiper.slideTo(index);
      // this.thumbSwiper.slideTo(index);
    },
    // 如果 `imgList` 发生改变，这个函数就会运行
    'imgList': function(newVal, oldVal) {
      let newAttList = [];
      // 从无数据变为有数据时
      if (newVal.length > 0) {
        for (var i = 0; i < newVal.length; i++) {
          if (!newAttList[newVal[i].attType]) {
            newAttList[newVal[i].attType] = [];
            newVal[i].isFirst = true;
          }
          newVal[i].index = i;
          newAttList[newVal[i].attType].push(newVal[i]);
        }
        this.initTopSwiperImgStyle();
      }
      // 避免出现false
      this.imgList = newVal;
      this.renderImg();
    }
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.renderImg();
      this.imgRotateController = new ImgDomRotateController();
    },
    imgMouseOverHandle() {
      this.rotateControlActive = true;
    },
    imgMouseOutHandle() {
      this.rotateControlActive = false;
    },
    turnLeft() {
      if (!this.imgRotateController.imgElement) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
      }
      else if (this.imgDomRotateData.currentIndex !== this.topSwiper.activeIndex) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
      }
      this.imgRotateController.rotate(-90);
    },
    turnRight() {
      if (!this.imgRotateController.imgElement) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
      }
      else if (this.imgDomRotateData.currentIndex !== this.topSwiper.activeIndex) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
      }
      this.imgRotateController.rotate(90);
    },
    showBigImgOnClick(item) {
      item.swiperObj = this.topSwiper;
      this.$emit('showBigImg', item);
    },
    initTopSwiperImgStyle() {
      if (this.topSwiper && this.topSwiper.slides.length > 0) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        if (img.width === 0) {
          let nImg = new Image();
          nImg.src = img.src;
          nImg.onload = () => {
            // 初始化旋转控制器
            this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
          };
        }
        else {
          this.imgRotateController.init(img, this.imgDomRotateData.parentWidth, this.imgDomRotateData.parentHeight);
        }
      }
    },
    imgSelected() {

    },
    /* 图片单选框点击 */
    radioClick(img) {
      let t = this;
      console.log('cerImgClick');
      t.$emit('imgRadioClick', img);
    },
    attTypeFormat(attType) {
      let valueDesc = '';
      // 附件类型（1-身份证5-医师资格证 6-医学学位证 7-医师执业证 8-毕业证 9-工作证(学生证) 10-工作证 11-学生证 12-医师职称证书）
      switch (parseInt(attType)) {
        case 1:
          valueDesc = '身份证';
          break;
        case 6:
          valueDesc = '医师资格证';
          break;
        case 7:
          valueDesc = '医学学位证';
          break;
        case 8:
          valueDesc = '医师执业证';
          break;
        case 9:
          valueDesc = '毕业证';
          break;
        case 10:
          valueDesc = '工作证(学生证)';
          break;
        case 11:
          valueDesc = '工作证';
          break;
        case 12:
          valueDesc = '学生证';
          break;
        case 13:
          valueDesc = '医师职称证书';
          break;
        case 15:
          valueDesc = '护士执业证';
          break;
        case 16:
          valueDesc = '专业技术资格证';
          break;
        default:
          valueDesc = '';
          break;
      }
      return valueDesc;
    },
    renderImg() {
      let _this = this;
      let index = this.selectedIndex;
      this.topSwiper = new Swiper(this.swiperConClass + ' .topSwiper', {
        direction: 'horizontal',
        zoom: true,
        initialSlide: index,
        onInit: function(swiper) {
          console.log(swiper.activeIndex + '当前索引' + _this.swiperConClass);
          console.log('sipwer初始化完成!,回调函数，初始化后执行。');
        },
        onTap: function(swiper, event) {

        },
        onSlideChangeStart(swiper) {
          console.log(swiper.activeIndex + '当前索引' + _this.swiperConClass);
          _this.initTopSwiperImgStyle();
        }
      });

      this.thumbSwiper = new Swiper(this.swiperConClass + ' .thumbSwiper', {
        initialSlide: index,
        spaceBetween: 17,
        direction: 'horizontal',
        centeredSlides: true,
        slidesPerView: 4,
        touchRatio: 1,
        slideToClickedSlide: true,
        observer: true,
        prevButton: '.swiper-button-prev',
        nextButton: '.swiper-button-next', // 前进按钮的css选择器或HTML元素。
        loopedSlides: 8,
        paginationType: '',
        imgElementCallBack: function() {
          console.log('为每个指定的图片（会触发大图）单击事件绑定回调函数');
        },
        onTap: function(swiper, event) {
          _this.$store.commit('setCertImgShowActiveIndex', swiper.activeIndex);
          let imgObj = _this.imgList[swiper.activeIndex];
          imgObj.index = swiper.activeIndex;
          _this.$emit('certImgSelected', imgObj);
          swiper.slideTo(swiper.activeIndex);
        },
        onSlideChangeEnd(swiper) {
          _this.$store.commit('setCertImgShowActiveIndex', swiper.activeIndex);
          let imgObj = _this.imgList[swiper.activeIndex];
          imgObj.index = swiper.activeIndex;
          _this.$emit('certImgSelected', imgObj);
        }
      });
      this.topSwiper.params.control = this.thumbSwiper;// 需要在Swiper2初始化后，Swiper1控制Swiper2
      this.thumbSwiper.params.control = this.topSwiper;// 需要在Swiper1初始化后，Swiper2控制Swiper1
    },
    swiperBtnPrevOnClick() {
      // let t = this;
      // let swiper = this.thumbSwiper;
      // t.$store.commit("setCertImgShowActiveIndex", swiper.activeIndex);
      // let imgObj = t.imgList[swiper.activeIndex];
      // imgObj.index = swiper.activeIndex;
      // t.$emit('certImgSelected', imgObj);
    },
    swiperBtnNextOnClick() {
      // let t = this;
      // let swiper = this.thumbSwiper;
      // t.$store.commit("setCertImgShowActiveIndex", swiper.activeIndex);
      // let imgObj = t.imgList[swiper.activeIndex];
      // imgObj.index = swiper.activeIndex;
      // t.$emit('certImgSelected', imgObj);
    },
    /*
         *
         * 图片上传
         **/
    updateCartImgOnclick() {
      if (this.isLoading) return false;
      this.$refs['cerImg_merge_upload'].click();
    },
    cerImgInputChangeHandle(evt) {
      let file = evt.target.files[0];
      if (file) {
        if (!this.cerImgFormatCheck(file)) {
          return false;
        }
      }
      else return false;
      // 获取图片数据
      this.certImgFileData.extName = file.type;
      this.certImgFileData.file = file;
      const render = new FileReader();
      render.onload = (e) => {
        this.certImgFileData.fileContent = render.result;
        this.cerImgUploadImg();
      };
      render.readAsDataURL(file);
    },
    cerImgFormatCheck(file) {
      // 图片仅支持JPG/JPEG/PNG格式
      const typeTrue = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      // 图片大小不超过5M
      const sizeTrue = file.size / 1024 / 1024 < 5;
      if (!typeTrue) {
        this.$message.error('上传图片仅支持JPG/JPEG/PNG格式');
        return false;
      }
      else if (!sizeTrue) {
        this.$message.error('上传图片大小不超过5M');
        return false;
      }
      return true;
    },

    cerImgUploadImg() {
      comm.openLoading('图片上传中...');
      this.$refs['cerImg_merge_upload'].value = null;
      axios({
        method: apiConfig.memberAuditDetailFourCardImgUpload.type,
        url: apiConfig.memberAuditDetailFourCardImgUpload.url,
        data: {
          fileContent: this.certImgFileData.fileContent.split(',')[1],
          extName: this.certImgFileData.extName.split('/')[1],
          customerId: this.customerId,
          attType: this.imgList[this.selectedIndex].attType, // string 是附件类型
          attPositionType: this.imgList[this.selectedIndex].attPositionType // string是位置标识（1-第一页，2-第二页）
        }
      }).then((res) => {
        if (res && res.data.responseObject && res.data.responseObject.responseStatus === true && res.data.responseObject.responseData) {
          let newActiveAttCode = res.data.responseObject.responseData.customer_auth_attachment;
          for (let key in this.imgList[this.selectedIndex]) {
            if (key !== 'attCode') {
              this.imgList[this.selectedIndex][key] = newActiveAttCode[key];
            }
            else {
              // this.imgList[this.selectedIndex][key] = this.imgList[this.selectedIndex][key];
            }
          }
          this.$message.success('图片上传成功！');
        }
        else {
          this.$message.error('图片上传失败！');
        }
        comm.closeLoading();
      }).catch((err) => {
        console.log(err);
        comm.closeLoading();
        this.$message.error('图片上传失败！');
      });
    }
  },

  updated() {
    if (!this.initState) {
      this.renderImg();
      this.initState = true;
    }
    // this.renderImg();
  }
};
</script>
