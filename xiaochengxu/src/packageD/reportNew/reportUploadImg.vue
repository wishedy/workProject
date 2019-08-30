<template>
  <section class="main-content">
    <!-- 上传图片盒子 -->
    <section class="uploadBox"  >
      <!-- 标题 -->
      <figure class="uploadTitleBox">
        <section class="title-left">
          {{questionList[0].name}}
          <span class="select-tip">(选填)</span>
        </section>
        <section class="title-right" @click="viewGuide">
          <span class="tip-icon"></span> 如何拍摄
        </section>
      </figure>
      <!-- 图片列表 -->
      <section class="upload-content">
        <li class="upLoadItem" v-for="(item,index) in  imgUrl0" :key="index">
          <img class="imgItem" :src="item.blob" mode="aspectFill" @click="showBigImg(index,0)">
          <span class="imgItem-delBtn" v-if="!item.fail" @click="imgDelToast(index,0)"></span>
          <span class="imgItem-cover" v-if="item.uploading">
            <span class="imgItem-loading"></span>
          </span>
          <figure class="imgItem-fail" v-if="item.fail" @click="upLoadReload(index,0)">
            <p class="imgItem-failText">上传失败</p>
            <p class="imgItem-reloadText">点击重试</p>
          </figure>
        </li>
        <uploadPlugn
          :isFailToast="true"
          :imgList ="imgUrl0"
          :order="true"
          :propClass="'upLoadItem'"
          :paramObj="{
                limit:12,
                singleNum:9,
                maxSize:10,
                overSingleTips:'一次最多上传9张图片',
                overSizeTips:'图片不能超过10M',
                compressRatio:0.8
              }"
          @beforeUpload="beforeUploadFn0"
          @uploadDone="uploadDoneFn"
          v-if="showUploadImg"
        ></uploadPlugn>
      </section>
      <section class="upload-number" v-if=" imgUrl0.length">
        已上传{{ imgUrl0.length}}张，
        <span class="upload-viewAll" @click="showBigImg('',0)">查看全部</span>
      </section>
    </section>
    <!-- 床头卡/腕带 -->
    <section class="uploadBox">
      <!-- 标题 -->
      <figure class="uploadTitleBox">
        <section class="title-left">
          {{questionList[1].name}}
          <span class="select-tip">(选填)</span>
        </section>
      </figure>
      <!-- 图片列表 -->
      <section class="upload-content">
        <li class="upLoadItem" v-for="(item,index) in  imgUrl1" :key="index">
          <img class="imgItem" :src="item.blob" mode="aspectFill" @click="showBigImg(index,1)">
          <span class="imgItem-delBtn" v-if="!item.fail" @click="imgDelToast(index,1)"></span>
          <span class="imgItem-cover" v-if="item.uploading">
            <span class="imgItem-loading"></span>
          </span>
          <figure class="imgItem-fail" v-if="item.fail" @click="upLoadReload(index,1)">
            <p class="imgItem-failText">上传失败</p>
            <p class="imgItem-reloadText">点击重试</p>
          </figure>
        </li>
        <uploadPlugn
          :isFailToast="true"
          :propClass="'upLoadItem'"
          :imgList ="imgUrl1"
          :order="true"
          :paramObj="{
                limit:12,
                singleNum:9,
                maxSize:10,
                overSingleTips:'一次最多上传9张图片',
                overSizeTips:'图片不能超过10M',
                compressRatio:0.8
              }"
          @beforeUpload="beforeUploadFn1"
          @uploadDone="uploadDoneFn"
          v-if="showUploadImg"
        ></uploadPlugn>
      </section>
      <section class="upload-number" v-if=" imgUrl1.length">
        已上传{{ imgUrl1.length}}张，
        <span class="upload-viewAll" @click="showBigImg('',1)">查看全部</span>
      </section>
    </section>
    <section class="uploadBox"  >
      <!-- 标题 -->
      <figure class="uploadTitleBox">
        <section class="title-left">
          {{questionList[2].name}}
          <span class="select-tip">(选填)</span>
        </section>
      </figure>
      <!-- 图片列表 -->
      <section class="upload-content">
        <li class="upLoadItem" v-for="(item,index) in  imgUrl2" :key="index">
          <img class="imgItem" :src="item.blob" mode="aspectFill" @click="showBigImg(index,2)">
          <span class="imgItem-delBtn" v-if="!item.fail" @click="imgDelToast(index,2)"></span>
          <span class="imgItem-cover" v-if="item.uploading">
            <span class="imgItem-loading"></span>
          </span>
          <figure class="imgItem-fail" v-if="item.fail" @click="upLoadReload(index,2)">
            <p class="imgItem-failText">上传失败</p>
            <p class="imgItem-reloadText">点击重试</p>
          </figure>
        </li>
        <uploadPlugn
          :isFailToast="true"
          :propClass="'upLoadItem'"
          :imgList ="imgUrl2"
          :order="true"
          :paramObj="{
                limit:12,
                singleNum:9,
                maxSize:10,
                overSingleTips:'一次最多上传9张图片',
                overSizeTips:'图片不能超过10M',
                compressRatio:0.8
              }"
          @beforeUpload="beforeUploadFn2"
          @uploadDone="uploadDoneFn"
          v-if="showUploadImg"
        ></uploadPlugn>
      </section>
      <section class="upload-number" v-if=" imgUrl2.length">
        已上传{{ imgUrl2.length}}张，
        <span class="upload-viewAll" @click="showBigImg('',2)">查看全部</span>
      </section>
    </section>
    <!-- 提交按钮 -->
    <section class="upload-submitBtn" :class="{'actived':imgUrl0.length>0||imgUrl1.length>0||imgUrl2.length>0}" @click="submitReport">提交</section>
  <logo-loading v-if="loading"></logo-loading>
  </section>
</template>

<script>
/**
 * DESC: 报到补充上传图片
 */

import api from "common/js/util/util";
import localStorage from "common/js/miniUtil/localStorage";
import uploadPlugn from "components/upLoadPic/upLoadPlugn";
import logoLoading from 'components/LogoLoading';

const XHR = {
  reportSubmitUrl:
    api.httpEnv() + "/mcall/patient/report/content/v2/supplementReport/"
};
export default {
  data() {
    return {
      loading:false,
      reportId: "",
      reportType: "4",
      showUploadImg:false,
      questionList: [
        {
          id: "0",
          name: "检查资料"
        },
        {
          id: "1",
          name: "床头卡/腕带"
        },
        {
          id: "2",
          name: "处方单/药盒"
        }
      ],
      imgUrl0: [], // 图片列表
      imgUrl1: [], // 图片列表
      imgUrl2: [], // 图片列表
      failImgList: [[], [], []], // 重传列表
      imgActive: false, // 提交按钮
      reloadBtnShow: false, //图片重传监控 显示btn
      reloadIndex: "" //图片重传监控  索引
    };
  },
  onLoad(option) {
    this.showUploadImg=true;
    if (option.reportId) {
      this.reportId = option.reportId;
    }
  },
  onUnload(){
    this.showUploadImg=false;
  },
  onShow() {
    if (localStorage.getItem("reportUploadImg")) {
      this.imgUrl0= []; // 图片列表
      this.imgUrl1=[]; // 图片列表
      this.imgUrl2=[]; // 图片列表
      this.failImgList= [[], [], []]; // 重传列表
      this.loading=false;
      // this.reportId="";
      this.imgActive=false;  // 提交按钮
      this.reloadBtnShow= false;  //  图片重传监控 显示btn
      this.reloadIndex=""; //  图片重传监控  索引
      localStorage.removeItem('reportUploadImg')
    }
  },
  onHide() {},
  mounted() {},
  components: {
    uploadPlugn,
    logoLoading
  },
  watch: {
    imgUrl: {
      handler: function() {
        this.imgUrl.forEach(item => {
          if (item.length > 0) {
            this.imgActive = true;
          }
        });
      },
      deep: true
    }
  },
  methods: {
    init() {},
    // 图片上传前
    beforeUploadFn0(data) {
      let _this = this;
      _this.imgUrl0=data.imgUrl;
      _this.failImgList[0].push(data.failParam);
    },
    beforeUploadFn1(data) {
      let _this = this;
      _this.imgUrl1=data.imgUrl;
      _this.failImgList[1].push(data.failParam);
    },
    beforeUploadFn2(data) {
      let _this = this;
      _this.imgUrl2=data.imgUrl;
      _this.failImgList[2].push(data.failParam);
    },
    // 图片上传完成
    uploadDoneFn(_data) {},
    // 图片重传
    upLoadReload(index, k) {
      let _this = this;
      if (!_this.reload) {
        _this.reload = true; //禁止重传
        api.reloadFile({
          param: _this.failImgList[k][index],
          uploadBefor: _data => {
            _this[`imgUrl${k}`][index].uploading = true;
            _this[`imgUrl${k}`][index].fail = false;
            _this[`imgUrl${k}`][index].finish = false;
          },
          uploadDoneFn: _data => {
            _this.reload = false; //允许重传
            if (_data.fail) {
              _this[`imgUrl${k}`][index].uploading = false;
              _this[`imgUrl${k}`][index].fail = true;
              _this[`imgUrl${k}`][index].finish = true;
              _this.$forceUpdate();
            } else {
              _this[`imgUrl${k}`][index].imgId = _data.imgId;
              _this[`imgUrl${k}`][index].uploading = false;
              _this[`imgUrl${k}`][index].fail = false;
              _this[`imgUrl${k}`][index].finish = true;
            }
          }
        });
      } else {
        //禁止重传
      }
    },
    // 查看大图
    showBigImg(index, k) {
      let _imgArr = [];
      this[`imgUrl${k}`].forEach((item, index) => {
        _imgArr.push(item.blob);
      });
      api.showBigImg({
        index: index ? index : 0,
        imgArr: _imgArr
      });
    },
    // 查看全部
    viewAllPicture(k) {
      let _this = this;
      let _imgArr = [];
      this[`imgUrl${k}`].forEach((item, index) => {
        _imgArr.push(item.blob);
      });
      api.showBigImg({
        index: 0,
        imgArr: _imgArr
      });
    },
    // 图片删除 model
    imgDelToast(index, k) {
      let _this = this;
      wx.showModal({
        // title: '确定删除图片吗？',
        content: "确定删除图片吗？",
        cancelText: "确定",
        cancelColor: "#00beaf",
        confirmText: "取消",
        confirmColor: "#00beaf",
        success: function(res) {
          if (res.confirm) {
          } else if (res.cancel) {
            _this.imgDelFn(index, k);
          }
        }
      });
    },
    //删除图片
    imgDelFn(index, k) {
      let _this = this;
      _this[`imgUrl${k}`].splice(index, 1);
    },
    //上传指导页面
    viewGuide() {
      wx.navigateTo({
        url: "/pages/upLoadGuide/upLoadGuide"
      });
    },
    // 图片idlist
    imgIdList(param) {
      let _this = this;
      let _keys = "";
      let _fail = false;
      _this[`imgUrl${param}`].forEach(function(item, index) {
        //ID存储
        if (!item.fail) {
          if (_keys != "") {
            _keys = _keys + "," + item.imgId;
          } else {
            _keys = item.imgId;
          }
        }else{
          _fail = true;
        }
      });
      return {keys:_keys,fail:_fail};
    },
    // 数据提交
    submitReport() {
      let _this = this;
      if (_this.imgUrl0.length==0&&_this.imgUrl1.length==0&&_this.imgUrl2.length==0) {
        return false;
      }
      if (_this.imgIdList(0).fail||_this.imgIdList(1).fail||_this.imgIdList(2).fail) {
        return false;
      }
      _this.loading = true;
      _this.submit({
          reportId: _this.reportId, //string是
          reportType: _this.reportType, //string 是报道类型：4-门诊患者(1.2新流程)，5-住院患者(1.2新流程)
          checkAttIdList: _this.imgIdList(0).keys, //string 图片id list
          bedAttIdList: _this.imgIdList(1).keys, //string 是 床头卡id list
          drugAttIdList: _this.imgIdList(2).keys // string 是药方id list
        })
        .then(res => {
          _this.loading = false;
          if (res&&res.responseObject&&res.responseObject.responseMessage&&res.responseObject.responseMessage=="success") {
            wx.setStorageSync('isUploadImg',true);
            wx.navigateBack({
              delta:1
            })
          }
        })
        .catch(err => {
          console, log(err);
          _this.loading = false;
        });
    },
    submit(param) {
      let _this = this;
      return new Promise((resolve, reject) => {
        api.ajax({
          url: XHR.reportSubmitUrl,
          method: "POST",
          data: param,
          done(data) {
            resolve(data);
          },
          fail(err) {
            reject(err);
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.main-content {
  padding-bottom: 86px;
  .uploadBox {
    .uploadTitleBox {
      padding: 40px 30px;
      @include clearfix();
      .title-left {
        float: left;
        color: #222222;
        font-weight: bold;
        font-size: 38px;
        .select-tip {
          color: #999999;
          font-size: 32px;
          display: inline-block;
          font-weight: normal;
        }
      }
      .title-right {
        float: right;
        font-size: 24px;
        color: #00b9ad;
        background: #f3f7f7;
        border-radius: 4px;
        padding: 4px 8px 4px 42px;
        position: relative;
        .tip-icon {
          width: 30px;
          height: 32px;
          display: inline-block;
          background: url("http://m.allinmed.cn/static/image/mp/index/1.3.0/photo.png")
            no-repeat center center;
          position: absolute;
          top: 50%;
          margin-top: -16px;
          left: 8px;
        }
      }
    }
    .upload-content {
      @include clearfix();
      padding-left: 30px;
      padding-bottom: 20px;
      .upLoadItem {
        box-sizing: border-box;
        width: 216px;
        height: 216px;
        text-align: center;
        position: relative;
        display: inline-block;
        float: left;
        vertical-align: top;
        margin: 0 20px 24px 0;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/camera2.png")
          no-repeat center;
        background-size: 100% 100%;
        &.video {
          width: 216px;
          height: 162px;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.4/uploadvideo@2x.jpg")
            no-repeat center;
          background-size: 100% 100%;
        }
        &.addBtn {
          width: 120px;
          height: 120px;
          background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/cameraTwo.png")
            no-repeat;
          background-size: 120px 120px;
          // border: 2px solid #c9c9c9;
          border-radius: 4px;
          margin-right: 20px;
        }
        .imgItem {
          width: 100%;
          height: 100%;
        }
        .imgItem-delBtn {
          display: inline-block;
          width: 38px;
          height: 38px;
          background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/symptom_photo_delete@2x.png")
            no-repeat;
          background-size: 38px 38px;
          position: absolute;
          top: 0;
          right: 0;
          z-index: 1;
        }
        .imgItem-cover {
          display: inline-block;
          opacity: 0.83;
          background: #545454;
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          .imgItem-loading {
            display: inline-block;
            position: absolute;
            width: 38px;
            height: 38px;
            background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png")
              no-repeat center;
            background-size: 38px 38px;
            top: 50%;
            left: 50%;
            margin-left: -19px;
            margin-top: -19px;
            animation: submitIng 1s linear infinite;
            -webkit-animation: submitIng 1s linear infinite;
            @keyframes submitIng {
              0% {
                -webkit-transform: rotate(0deg);
              }
              100% {
                -webkit-transform: rotate(360deg);
              }
            }
          }
        }
        .imgItem-fail {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0.83;
          background: #545454;
          .imgItem-failText {
            font-size: 24px;
            color: #ffffff !important;
            text-align: center;
            position: absolute;
            top: 35%;
            width: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
          .imgItem-reloadText {
            font-size: 24px;
            color: #ffffff !important;
            text-align: center;
            position: absolute;
            top: 62%;
            width: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    .upload-number {
      padding-left: 30px;
      padding-bottom: 30px;
      font-size: 28px;
      color: #666666;
      .upload-viewAll {
        display: inline-block;
        color: #00b9ad;
      }
    }
  }
  .upload-submitBtn {
    width: 560px;
    height: 96px;
    background: #cccccc;
    border-radius: 8px;
    text-align: center;
    color: #ffffff;
    font-size: 36px;
    line-height: 96px;
    margin: 0 auto;
    margin-top: 56px;
    &.actived {
      background: #00b9ad;
    }
  }
}
</style>

