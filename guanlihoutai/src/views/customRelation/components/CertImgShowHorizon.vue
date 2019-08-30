<template>
  <section class="wrapper">
    <div style="position: relative;margin-left: 30px;margin-top: 40px; margin-bottom: 10px"
         :class="{attCodeRedColor:activeAttCode.isNew}">
      <div style="width: 15px;height: 14px;float: left;top: 18px;position: absolute;z-index:1">
        <img src="/static/images/icons/icon-edit.png" alt=""></div>
      <span style="float:left;position: relative;margin-left: 22px;top: 18px;font-size: 14px;z-index:1">编号:</span>
      <!--变更修改页不允许修改-->
      <el-input
        class="attCode"
        type="text"
        v-model="activeAttCode.updateAttCode"
        v-bind:readonly="activeAttCode.isNew ||  !isNeedEdit"
        v-if="activeAttCode.isNew"
      >
      </el-input>
      <el-input
        class="attCode"
        type="text"
        v-model="activeAttCode.attCode"
        v-bind:readonly="activeAttCode.isNew ||  !isNeedEdit"
        v-if="!activeAttCode.isNew"
      >
      </el-input>
      <span
        v-if="isNeedEdit && (parseInt(activeAttCode.attType) === 6 || parseInt(activeAttCode.attType) === 8 || parseInt(activeAttCode.attType) === 13)"
      >证件时间:</span>
      <el-date-picker
        v-model="activeAttCode.attRecDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
        :picker-options="dataPickerOptions"
        v-if="isNeedEdit && (parseInt(activeAttCode.attType) === 6 || parseInt(activeAttCode.attType) === 8 || parseInt(activeAttCode.attType) === 13)"
      >
      </el-date-picker>
    </div>
    <section class="imgShow">
      <div class="swiper-container gallery-top">
        <div class="swiper-wrapper">
          <div class="swiper-slide swiper-no-swiping" v-for="(item,index) in attList" :key="index">
            <div>
              <img :src="item.isNew ?item.updateAttPath : item.attPath" @click="showBigImgOnClick(item)"
                   v-on:mouseover="imgMouseOverHandle" v-on:mouseout="imgMouseOutHandle"
                   v-if="item.isNew ?item.updateAttPath : item.attPath"
              />
            </div>
          </div>
        </div>
        <div class="rotate-control-box"
             :class="{'transparent-effect-open':!rotateControlActive,'transparent-effect-close':rotateControlActive} "
             v-on:mouseover="imgMouseOverHandle" v-on:mouseout="imgMouseOutHandle">
          <div class="rotate-left" @click="turnLeft"></div>
          <div class="rotate-right" @click="turnRight"></div>
        </div>
      </div>
      <div class="swiper-container gallery-thumbs">
        <div class="swiper-wrapper">
          <div v-for="(item,index) in attList" :class="[item.isNew ?'swiper-slide isNew':'swiper-slide' ]" :key="index">
            <img :src="item.isNew ?item.updateAttPath : item.attPath" :index="index"
                 v-if="item.isNew ?item.updateAttPath : item.attPath"/>
            <!--<p v-if="item.isFirst">{{attTypeFormat(item.attType)}} {{// "索引:"+item.index+(item.isFirst?"首位":"")}}</p>-->
            <p v-if="ifBoolean && item.attName">{{item.attName}}</p>
            <p v-if="!ifBoolean && item.isFirst">{{attTypeFormat(item.isNew ?item.updateAttType:item.attType)}}</p>
            <!--变更信息页只能替换变更后的图片/  或者其他页可以替换所有的() -->
            <div @click="updateCartImgOnclick(item)" v-if="pageName !== 'memberAuditChangeDetail' || (item.isNew && !ifBoolean)"><p>
              替换图片<i class="el-icon-sort el-icon--right"></i></p></div>
            </div>
        </div>
      </div>
      <!-- Add Arrows -->
      <div class="swiper-button-next swiper-button-white"></div>
      <div class="swiper-button-prev swiper-button-white"></div>
    </section>
    <input type="file" @change="cerImgInputChangeHandle" ref="cerImg_img_upload" style="display: none">
    <CertImgShowBig
      :src="showBigData.url"
      :isReadOnly="showBigData.isReadOnly"
      :title="showBigData.title"
      :visible="showBigData.visible"
      @closeShowBig="closeShowBigHandle"
      @switchPrevEvent="switchPrevEventHandle"
      @switchNextEvent="switchNextEventHandle">
    </CertImgShowBig>
  </section>
</template>
<script>
import comm from '@/assets/js/utils/comm';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
import axios from '@/assets/js/utils/request.js';
import {ImgDomRotateController} from '@/views/customRelation/components/ImgShowBig/ImgRotateController';
import CertImgShowBig from '@/views/customRelation/components/ImgShowBig/CertImgShowBig.vue';
import apiConfig from '@/api/apiUrlConfig';

export default {
  name: 'cert-img-show-horizon',
  props: {
    'attList': {
      type: Array
    },
    'customerId': {
      type: String
    },
    'isNeedEdit': {
      type: Boolean
    },
    'pageName': {
      type: String
    },
    'ifBoolean': { // 大家可以根据自己的需求更改boolean值
      type: Boolean,
      default: false
    }
  },
  components: {CertImgShowBig},
  data() {
    return {
      dataPickerOptions: { // 不能大于当前时间
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      topSwiper: null,
      thumbSwiper: null,
      activeAttCode: '', // 当前的图片编号
      isChangePage: false,
      imgDomRotateController: null,
      imgDomRotateData: {
        currentIndex: -1,
        parentWidth: 500,
        parentHeight: 435
      },
      showBigData: {
        url: '',
        isReadOnly: false,
        title: '',
        visible: false
      },
      rotateControlActive: false,
      certImgFileData: {}
    };
  },
  methods: {

    attTypeFormat(attType) {
      let valueDesc = '';
      // 附件类型（1-身份证 2-军官证 3- 文职干部证 4-驾照 5-护照 6-医师资格证 7-医学学位证 8-医师执业证
      switch (parseInt(attType)) {
        case 1:
          valueDesc = '身份证';
          break;
        case 2:
          valueDesc = '军官证';
          break;
        case 3:
          valueDesc = '文职干部证';
          break;
        case 4:
          valueDesc = '驾照';
          break;
        case 5:
          valueDesc = '护照';
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
          // 9-毕业证 10-工作证（学生证）11-工作证 12-学生证 13-医师职称证 14-住院医师规范化培训合格证）
        case 9:
          valueDesc = '毕业证';
          break;
        case 10:
          valueDesc = '工作证（学生证）';
          break;
        case 11:
          valueDesc = '工作证';
          break;
        case 12:
          valueDesc = '学生证';
          break;
        case 13:
          valueDesc = '医师职称证';
          break;
        case 14:
          valueDesc = '住院医师规范化培训合格证';
          break;
          // 15-护士执业证 16-专业技术资格证
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
    initSwiper() {
      let _this = this;
      this.galleryTop = new Swiper('.gallery-top', {
        direction: 'vertical',
        spaceBetween: 10,
        observer: true
      });
      this.galleryThumbs = new Swiper('.gallery-thumbs', {
        // loop:true,
        direction: 'vertical',
        spaceBetween: 24, // 设置slider容器能够同时显示的slides数量(carousel模式)。
        centeredSlides: true, // 设定为true时，active slide会居中，而不是默认状态下的居左。
        slidesPerView: 'auto',
        touchRatio: 1, // 触摸比例。触摸距离与slide滑动距离的比率。默认为1，按照1:1的触摸比例滑动。设置为0时，完全无法滑动
        slideToClickedSlide: true, // 设置为true则点击slide会过渡到这个slide。
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        observer: true,
        onTap: function(swiper) {
          // _this.activeIndex = swiper.activeIndex; //避免出现false
          _this.activeAttCode = _this.attList && _this.attList.length > 0 && _this.attList[swiper.activeIndex] ? _this.attList && _this.attList.length > 0 && _this.attList[swiper.activeIndex] : '';
        },
        onInit: function() {
          // 初始化编号
          // vue 热加载 后 无数据添加 //避免出现false
          this.activeAttCode = this.attList && this.attList[0] ? this.attList && this.attList[0] && this.attList[0] : '';
        },
        onSlideChangeEnd: function(swiper) {
          _this.initTopSwiperImgStyle();
          _this.activeAttCode = _this.attList && _this.attList.length > 0 && _this.attList[swiper.activeIndex] ? _this.attList && _this.attList.length > 0 && _this.attList[swiper.activeIndex] : '';
        }
      });
      this.galleryTop.params.control = this.galleryThumbs;
      this.galleryThumbs.params.control = this.galleryTop;
    },
    imgMouseOverHandle() {
      this.rotateControlActive = true;
    },
    imgMouseOutHandle() {
      this.rotateControlActive = false;
    },
    turnLeft() {
      if (!this.imgRotateController.imgElement) {
        this.topSwiper = this.galleryTop;
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
      this.topSwiper = this.galleryTop;
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
    showBigImgOnClick(data) {
      this.showBigData.visible = true;
      this.showBigData.url = data.isNew ? data.updateAttPath.replace(/(.*)_c/, '$1') : data.attPath.replace(/(.*)_c/, '$1');
      // 判断是否为新老数据，新数据可编辑标题，老数据不可以
      this.showBigData.isReadOnly = !!data.isChangePage;
      this.showBigData.title = data.attCode;
      this.showBigData.title = this.activeAttCode.isNew ? data.updateAttCode : data.attCode;
    },
    closeShowBigHandle(data) {
      this.showBigData.visible = false;
      // 因为只有认证页可以修改编号，所以直接设置认证页编号即可
      if (!this.showBigData.isReadOnly) {
        if (this.activeAttCode.isNew) {
          this.activeAttCode.updateAttCode = data;
        }
        else {
          this.activeAttCode.attCode = data;
        }
      }
    },
    switchPrevEventHandle() {
      // 查看大图时，上一张图片的处理事件
      this.galleryTop.slidePrev();
      this.showBigImgOnClick(this.attList[this.galleryTop.activeIndex]);
    },
    switchNextEventHandle() {
      // 查看大图时，下一张图片的处理事件
      this.galleryTop.slideNext();
      this.showBigImgOnClick(this.attList[this.galleryTop.activeIndex]);
    },
    initTopSwiperImgStyle() {
      this.topSwiper = this.galleryTop;
      if (this.topSwiper && this.topSwiper.slides.length > 0) {
        this.imgDomRotateData.currentIndex = this.topSwiper.activeIndex;
        let img = this.topSwiper.slides[this.topSwiper.activeIndex].getElementsByTagName('img')[0];
        if (img) {
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
      }
    },
    /*
       *
       * 图片上传
       **/
    updateCartImgOnclick() {
      if (this.isLoading) return false;
      this.$refs['cerImg_img_upload'].click();
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
      this.$refs['cerImg_img_upload'].value = null;

      // 变更信息页
      if (this.pageName === 'memberAuditChangeDetail') {
        axios({
          method: apiConfig.memberAuditDetailCardImgUpload.type,
          url: apiConfig.memberAuditDetailCardImgUpload.url,
          data: {
            fileContent: this.certImgFileData.fileContent.split(',')[1],
            extName: this.certImgFileData.extName.split('/')[1],
            customerId: this.customerId,
            attType: this.activeAttCode.attType, // 附件类型
            attPositionType: this.activeAttCode.attPositionType // 位置标识
          }
        }).then((res) => {
          if (res && res.data.responseObject && res.data.responseObject.responseStatus === true && res.data.responseObject.responseData) {
            let attUrl = res.data.responseObject.responseData.data_list.attUrl;
            let params = {};
            if (this.activeAttCode.isNew) {
              this.activeAttCode.updateAttPath = URL.createObjectURL(this.certImgFileData.file);
              params = {
                id: this.activeAttCode.id, // string图片格式
                updateAttPath: attUrl // string变更前图片url
              };
            }
            else {
              // 此处应该是冗余,在变更信息页 当前不允许修改变  变更前的路径
              this.activeAttCode.attPath = URL.createObjectURL(this.certImgFileData.file);
              params = {
                id: this.activeAttCode.id, // string图片格式
                attPath: attUrl // string变更前图片url
              };
            }

            axios({
              method: apiConfig.memberAuditDetailFourCardImgChange.type,
              url: apiConfig.memberAuditDetailFourCardImgChange.url,
              data: params
            }).then((res) => {
              if (res && res.data && res.data.responseObject && res.data.responseObject.responseStatus) {
                this.$message.success('图片保存成功！');
              }
              else {
                this.$message.error('图片保存失败！');
              }
              comm.closeLoading();
            }).catch(() => {
              comm.closeLoading();
              this.$message.error('图片保存失败！');
            });
          }
          else {
            this.$message.error('图片上传失败！');
            comm.closeLoading();
          }
        }).catch(() => {
          this.$message.error('图片上传失败！');
          comm.closeLoading();
        });
      }
      else {
        axios({
          method: apiConfig.memberAuditDetailFourCardImgUpload.type,
          url: apiConfig.memberAuditDetailFourCardImgUpload.url,
          data: {
            fileContent: this.certImgFileData.fileContent.split(',')[1],
            extName: this.certImgFileData.extName.split('/')[1],
            customerId: this.customerId,
            attCode: this.activeAttCode.attCode,
            attType: this.activeAttCode.attType, // 附件类型
            attPositionType: this.activeAttCode.attPositionType // 位置标识
          }
        }).then((res) => {
          if (res && res.data.responseObject && res.data.responseObject.responseStatus === true && res.data.responseObject.responseData) {
            let newActiveAttCode = res.data.responseObject.responseData.customer_auth_attachment;
            for (let key in this.activeAttCode) {
              if (newActiveAttCode[key]) {
                this.activeAttCode[key] = newActiveAttCode[key];
              }
            }
            this.$message.success('图片上传成功！');
          }
          else {
            this.$message.error('图片上传失败！');
          }

          comm.closeLoading();
        }).catch(() => {
          comm.closeLoading();
          this.$message.error('图片上传失败！');
        });
      }
    }
  },
  watch: {
    // 如果 `attList` 发生改变，这个函数就会运行
    attList: function(newVal, oldVal) {
      let newAttList = [];
      // 从无数据变为有数据时
      // beforeAttList  是老的    修改前    isNew  false
      // laterAttList   是新的数据   修改后  isNew  true  update**
      // 兼容变更信息页
      if (newVal.length > 0) {
        for (var i = 0; i < newVal.length; i++) {
          // laterAttList  beforeAttList
          // 需要区分 参数获取不一致
          // 兼容信息变更页  有新老数据区分
          if (newVal[i].isNew) {
            if (!newAttList[newVal[i].updateAttType]) {
              newAttList[newVal[i].updateAttType] = [];
              newVal[i].isFirst = true;
            }
            newVal[i].index = i;
            newAttList[newVal[i].updateAttType].push(newVal[i]);
          }
          else {
            if (!newAttList[newVal[i].attType]) {
              newAttList[newVal[i].attType] = [];
              newVal[i].isFirst = true;
            }
            newVal[i].index = i;
            newAttList[newVal[i].attType].push(newVal[i]);
          }
        }
        this.initTopSwiperImgStyle();
      }
      // 避免出现false
      this.activeAttCode = this.attList && this.attList[0] ? this.attList && this.attList[0] && this.attList[0] : '';
      this.attList = newVal;
      this.isChangePage = !!(this.attList && this.attList[0] && this.attList[0].isChangePage);
    },
    isNeedEdit: function(newVal, oldVal) {
      this.isNeedEdit = newVal;
    },
    // 监听 activeAttCode.attCode
    // 如果有变化时,循环寻找相同类型和 不相同正反面值 改变对应的值
    'activeAttCode.attCode': function(newVal, oldVal) {
      for (let i = 0; i < this.attList.length; i++) {
        const ele = this.attList[i];
        if (this.activeAttCode.attType === ele.attType && this.activeAttCode.attPositionType !== ele.attPositionType) {
          ele.attCode = newVal;
        }
      }
    },
    'activeAttCode.attRecDate': function(newVal, oldVal) {
      // 附件类型（1-身份证 2-军官证 3- 文职干部证 4-驾照 5-护照 6-医师资格证 7-医学学位证 8-医师执业证
      // 9-毕业证 10-工作证（学生证）11-工作证 12-学生证 13-医师职称证 14-住院医师规范化培训合格证）
      switch (parseInt(this.activeAttCode.attType)) {
        case 6: // 6-医师资格证 资格证取得时间(填写获取医师资格证时传)
          this.$emit('setAttRecDateParams', {
            certRecDate: newVal
          });
          break;
        case 8: // 8-医师执业证 pracRecDate执业证取得时间(填写获取医师执业证时传)
          this.$emit('setAttRecDateParams', {
            pracRecDate: newVal
          });
          break;
        case 13: // 13-医师职称证  titleRecDate 职称证取得时间(填写获取医师职称证时传)
          this.$emit('setAttRecDateParams', {
            titleRecDate: newVal
          });
          break;
        default:
          break;
      }

      // 正反面数据同步
      for (let i = 0; i < this.attList.length; i++) {
        const ele = this.attList[i];
        if (this.activeAttCode.attType === ele.attType && this.activeAttCode.attPositionType !== ele.attPositionType) {
          ele.attRecDate = newVal;
        }
      }
    }
  },
  mounted() {
    this.imgRotateController = new ImgDomRotateController();
    // todo 初始没有图片编号  待解决
    this.initSwiper();// swiper初始化

    console.log(this.ifBoolean, 'ifBoolean');
  },
  updated() {
    // this.init();
  }

};
</script>
<style lang="scss">
  .attCode {
    width: 220px !important;
    input {
      border: 0px;
      padding: 0;
      padding-top: 10px;
    }
  }

  .wrapper {
    //编号
    & > p {
      font-family: PingFangSC-Regular;
      font-size: 15px;
      color: #2C343A;
      letter-spacing: 0;
      line-height: 15px;
      padding-left: 55px;
      margin: 40px 0 16px;
      position: relative;
      &:before {
        padding: 0;
        margin: 0;
        display: block;
        content: "";
        width: 15px;
        height: 15px;
        background: url("/static/images/icons/icon-edit.png") 50% 50% no-repeat;
        position: absolute;
        left: 30px;
        top: 0;
      }
    }
    /*证件时间*/
    .el-date-editor.el-input {
      width: 150px;
    }
  }

  .imgShow {
    width: 820px;
    margin: 0 auto;
    height: 435px;
    /*border: 1px solid red;*/
    position: relative;
    .swiper-container {
      width: 100%;
      height: 300px;
      margin-left: auto;
      margin-right: auto;
    }

    .swiper-slide {
      background-size: cover;
      background-position: center;
    }

    .gallery-top {
      height: 100%;
      width: 61%;
      float: left;
      position: relative;
      .swiper-slide {
        box-sizing: border-box;
        width: 100%;
        text-align: center;
        display: table;
        div {
          display: table-cell;
          vertical-align: middle;
          img {
            width: auto;
            height: auto;
            max-width: 500px;
            max-height: 435px;
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
        bottom: 14px;
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
    }

    .gallery-thumbs {
      padding: 0 50px;
      height: 100%;
      width: 39%;
      box-sizing: border-box;
      .swiper-slide {
        width: 120px;
        height: 90px;
        box-sizing: border-box;
        position: relative;
        img {
          width: 100%;
          height: 100%;
        }

        &.swiper-slide-active {
          border: 1px solid blue;
          background: #FFFFFF;
          box-shadow: 0 4px 10px 0 rgba(42, 53, 102, 0.3);
          border-radius: 4px;
        }
        &.isNew {
          border: 4px solid red;
        }
        & > p {
          font-family: PingFangSC-Regular;
          font-size: 13px;
          color: #BCC2CC;
          letter-spacing: 0;
          line-height: 15px;
          left: 150px;
          top: -80px;
          position: relative;
          writing-mode: vertical-rl;
          cursor: pointer;
          &::before {
            content: "";
            display: block;
            width: 9px;
            height: 3px;
            color: #BCC2CC;
            position: absolute;
            opacity: 0.2;
            background: #BCC2CC;
            left: 50%;
            top: -8px;
            transform: translateX(-50%);
          }
        }
        //替换图片
        & > div {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 74px;
          height: 22px;
          background: rgba(0, 0, 0, 1);
          opacity: 0.5;
          padding-left: 6px;
          p {
            font-size: 12px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 22px;
            cursor: pointer;
            opacity: 1;
          }
        }
      }
    }

    //右侧swiper导航
    .swiper-button-prev, .swiper-button-next {
      position: absolute;
      left: 574px;
      width: 40px;
      height: 22px;
      margin-top: -11px;
      z-index: 3;
      cursor: pointer;
      opacity: 0.2;
      border-radius: 1px;
    }
    .swiper-button-prev.swiper-button-white, .swiper-container-rtl .swiper-button-next.swiper-button-white {
      top: 0;
      transform: translateX(50%);
      background-size: 40px 24px;
      background: #4A5B6F url(/static/images/icons/icon-arrow-white-up.png) center center no-repeat;
    }
    .swiper-button-next.swiper-button-white, .swiper-container-rtl .swiper-button-next.swiper-button-white {
      margin-top: 0;
      top: auto;
      bottom: 0;
      margin-bottom: -11px;
      transform: translateX(50%);
      background-size: 40px 24px;
      background: #4A5B6F url(/static/images/icons/icon-arrow-white-down.png) center center no-repeat;
    }
  }

  .attCodeRedColor {
    color: red;
    .el-input__inner {
      color: red;
    }
  }

  .transparent-effect-open {
    opacity: 0.1;
  }

  .transparent-effect-close {
    opacity: 1;
  }
</style>
