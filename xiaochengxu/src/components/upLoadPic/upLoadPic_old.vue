<template>
  <section>
      <section class="upLoad-main">
          <ul class="upLoadBox">
              <li class="upLoadItem" v-for="(item,index) in imgUrl" v-if="index<9" :key="index">
                  <img class="imgItem" :src="item.blob" mode="aspectFill" @click="viewBigImg(index)">
                  <span class="imgItem-delBtn" v-if="!item.fail" @click="imgDelToast(index)"></span>
                  <!-- <image ></image> -->
                  <span class="imgItem-cover" v-if="item.uploading"><span class="imgItem-loading"></span></span>
                  <figure class="imgItem-fail" v-if="item.fail"  @click="upLoadReload(index)">
                        <p class="imgItem-failText">上传失败</p>
                        <p class="imgItem-reloadText">点击重试</p>
                        <!-- <div class="ev-upLoadInput" ref="uploader"></div> -->
                  </figure>
              </li>
              <li class="upLoadItem addBtn" @click="upLoadImg()" v-show="isReadyLoad&&imgUrl.length<50"></li>
              <li class="upLoadDetail" v-show="upLoadDetail">
                  <p class="upLoadDetail-top">请上传您的病例（以及处方、检查单、X光/CT/核磁等资料）</p>
                  <span class="upLoadDetail-bottom" @click="viewGuide">查看拍摄示例</span>
              </li>
          </ul>
          <section class="upLoadViewBtn" v-if="imgUrl.length>0">
            <span class="upLoadViewBtn-l">【已上传{{imgUrl.length}}张】</span><span v-show="imgUrl.length>9" @click="viewBigImg(0)" class="upLoadViewBtn-r">查看更多</span>
          </section>
      </section>
      <!-- <upLoadGuide></upLoadGuide> -->
  </section>
</template>

<script>
/**
 * @Desc：上传图片组件
 * @Usage:
 * @Notify：版本_1.0
 * @Depend：
 *
 * Created by Hallmader on 2018/5/15.
 */
import updateLoad from "../../common/js/upLoadPic/upLoadComm";
import util from "common/js/util/util";
import {createNamespacedHelpers} from "vuex";
const {mapMutations, mapState} = createNamespacedHelpers('findDoctor');

// import upLoadGuide from "./upLoadGuide";
const xhr = util.httpEnv()+"/mcall/customer/patient/case/attachment/v1/createPicture/";
export default {
  name: "uploadPic",
  data() {
    return {
      upLoadDetail: true,
      tempFilePaths: "",
      imgUrl: [],
      upLoadIndex: 0,
      reload: false,
      isReadyLoad: true, //是否无上传失败图片
    };
  },
  methods: {
    ...mapMutations(['setQueryObject','setScene']),
    // 选取图片
    upLoadImg(e) {
      let _this = this;
      _this.upLoadIndex = 0;
      _this.setScene("1");
      wx.chooseImage({
        count: 9, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          _this.tempFilePaths = res.tempFilePaths;
          _this.upLoadPic(0);
        },
        complete: function(res) {

          // _this.setScene("0");
          // console.log("++++++++++++++++");
          // console.log(_this.scene);
        }
      });
    },
    // 上传图片
    upLoadPic(index, upLoadIndex) {
      let _this = this;
      let num = '';
      let _files = [];
      if (typeof upLoadIndex !== "undefined") {
        num = upLoadIndex;
      } else {
        num = index;
      }
      if (typeof upLoadIndex !== "undefined") {
        _files = _this.tempFilePaths.reverse();
        _this.imgUrl[upLoadIndex] = {
          blob: _files[num],
          imgId: "",
          uploading: true,
          fail: false
        };
      } else {
        _files = _this.tempFilePaths;
        _this.imgUrl.unshift({
          blob: _this.tempFilePaths[index],
          imgId: "",
          uploading: true,
          fail: false
        });
      }
      _this.upLoadDetail = false;
      const uploadTask = wx.uploadFile({
        url:xhr,
        filePath:_files[num],
        name: "file",
        formData: {
          caseCategoryId: "1",       //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
          imageType: "1",            //	string	是	资源类型		1-上传资料图片
          caseAttSource: "17",
          visitSiteId: "24"
        },
        success: function(res) {
          var _data = JSON.parse(res.data);
          // console.log(num);
          if (typeof upLoadIndex !== "undefined") {
              _this.imgUrl[upLoadIndex].imgId = _data.responseObject.responsePk;
              _this.imgUrl[upLoadIndex].uploading = false;
              _this.imgUrl[upLoadIndex].fail = false;
              _this.imgUrl[upLoadIndex].finish = true;
          } else {
              _this.imgUrl[0].imgId = _data.responseObject.responsePk;
              _this.imgUrl[0].uploading = false;
              _this.imgUrl[0].fail = false;
              _this.imgUrl[0].finish = true;
          }
          //ID存储
          var value = wx.getStorageSync("attIds");
          if (value !="") {
            let _keys = value + "," + _data.responseObject.responsePk;
            wx.setStorageSync("attIds", _keys);
          } else {
            wx.setStorageSync("attIds", _data.responseObject.responsePk);
          }
          //是否有上传失败图片
          _this.isExistUpLoadFail();
          //上传下一张
          if (!_this.reload) {
            if (index < _this.tempFilePaths.length - 1 && _this.imgUrl.length <50) {
              _this.upLoadPic(index + 1);
            }
          } else {
            _this.reload = false;
          }
        },
        fail:function(err){
          //微信接口调用失败
          _this.imgUrl[0].uploading = false;
          _this.imgUrl[0].fail = true;     //上传失败标识
          _this.imgUrl[0].finish = true;
          if (index < _this.tempFilePaths.length - 1 && _this.imgUrl.length <50) {
            _this.upLoadPic(index + 1);
          }
        },
        complete:function(){
          //微信接口调用结束
           _this.setScene("0");
        }
      });
      //上传进度
      uploadTask.onProgressUpdate(res => {
        // console.log("上传进度", res.progress);
        // console.log("已经上传的数据长度", res.totalBytesSent);
        // console.log("预期需要上传的数据总长度", res.totalBytesExpectedToSend);
      });
    },
    //重传图片
    upLoadReload(index){
      let _this = this;
      _this.reload = true;
      _this.upLoadPic( "", index);
    },
    //是否存在上传失败图片
    isExistUpLoadFail() {
      let _this = this,
        _failNum = 0;
      this.imgUrl.forEach((item, index) => {
        if (item.fail) {
          _failNum++;
        }
      });
      if (_failNum > 0) {
        _this.isReadyLoad = false;
      } else {
        _this.isReadyLoad = true;
      }
    },
    //查看大图
    viewBigImg(index) {
      let _this = this;
      let _imgurls = [];
      wx.setStorageSync("guideFrom","shootips");
      _this.imgUrl.forEach((ele,index) =>{
        _imgurls.push(ele.blob);
      });
      wx.previewImage({
        current: _this.imgUrl[index].blob, // 当前显示图片的http链接
        urls: _imgurls                     // 需要预览的图片http链接列表
      });
    },
    //删除图片
    imgDelFn(index) {
      let _this = this;
      updateLoad({
        id: _this.imgUrl[index].imgId,
        isValid: "0"
      })
        .then(res => {
          _this.imgUrl.splice(index, 1);
          let idList ='';
           _this.imgUrl.forEach(function(ele,index){
             if(index==0){
               idList=ele.imgId;
             }else{
               idList=idList+','+ele.imgId;
             }
           });
          //清理缓存
          wx.setStorageSync("attIds",idList );
          if(_this.imgUrl.length ==0){
            _this.upLoadDetail = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //删除图片确定模态
    imgDelToast(index){
      let _this = this;
      wx.showModal({
        // title: '确定删除图片吗？',
        content: '确定删除图片吗？',
        cancelText : '确定',
        cancelColor: '#00beaf',
        confirmText: '取消',
        confirmColor: '#00beaf',
        success: function(res) {
          if (res.confirm) {;

          } else if (res.cancel) {
            _this.imgDelFn(index);
          }
        }
      })
    },
    //上传指导页面
    viewGuide() {
      wx.navigateTo({
        url: "/pages/upLoadGuide/upLoadGuide"
      });
    },
    getDefaultData() {
      let _this = this;
      let _keys = '';
        this.$nextTick(() => {
          if ((this.queryObject.reportType==1 ||this.queryObject.reportType==2) && this.uploadType==this.queryObject.reportType) {
            let _imgurls = this.queryObject.attList;
            if (_imgurls&&_imgurls.length>0) {
               _this.upLoadDetail = false;
            }
            _imgurls.forEach(function(item,index){
              _this.imgUrl.push({
                blob: item.caseAttUrl,
                imgId: item.id,
                uploading: false,
                fail: false,
                finish: true
              });
              //ID存储
              if (_keys!='') {
                _keys =_keys+","+item.id
              }else{
                _keys =item.id
              }
            })
            wx.setStorageSync("attIds", _keys);
          }
        })
      }
  },
  mounted() {
    this.getDefaultData();
  },
  computed: {
    ...mapState(['queryObject','scene']),
  },
  components: {

  },
  props:{
    uploadType:{
      type:String
    }
  }
};
</script>

<style lang="scss">
@import "static/scss/base";
.upLoad-main {
  .upLoadBox {
    @include clearfix();
    .upLoadItem {
      float: left;
      width: 120px;
      height: 120px;
      margin: 0 16px 24px 16px;
      position: relative;
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
      .imgItem-cover{
        display: inline-block;
        opacity: 0.83;
        background: #545454;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        .imgItem-loading{
          display: inline-block;
          position: absolute;
          width: 38px;
          height: 38px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png") no-repeat center;
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
      .imgItem-fail{
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0.83;
        background: #545454;
        .imgItem-failText{
          font-size:24px;
          color: #ffffff !important;
          text-align: center;
          position: absolute;
          top: 35%;
          width: 100%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .imgItem-reloadText{
          font-size:24px;
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
    .upLoadDetail {
      float: left;
      .upLoadDetail-top {
        font-size: 28px;
        color: #666666;
        width: 392px;
      }
      .upLoadDetail-bottom {
        display: inline-block;
        font-size: 28px;
        color: #2EA9FE;
        margin-top: 10px;
        position: relative;
        &::after {
          position: absolute;
          content: "";
          width: 28px;
          height: 28px;
          right: -34px;
          top: 50%;
          margin-top: -14px;
          background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/smmIcon02.png")
            no-repeat;
          background-size: 28px 28px;
        }
      }
    }
  }
  .upLoadViewBtn {
    text-align: center;
    padding-right: 32px;
    margin-bottom: 24px;
    .upLoadViewBtn-l {
      font-size: 28px;
      color: #909090;
    }
    .upLoadViewBtn-r {
      font-size: 28px;
      color: #29a3a3;
      position: relative;
      &::after {
        position: absolute;
        content: "";
        width: 26px;
        height: 26px;
        background: url("https://m.allinmed.cn/static/image/wxmp/questionDesc/arrow_green_more.png")
          no-repeat;
        background-size: 26px 26px;
        top: 50%;
        right: -20px;
        margin-top: -13px;
      }
    }
  }
}
</style>

