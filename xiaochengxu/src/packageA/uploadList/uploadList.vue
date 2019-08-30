<template>
  <section class="upload-wrapper">
    <!-- <section class="al-uploadNumLimit"><span>提示：每一项最多可以上传9张图片</span></section> -->
    <section class="tc-upLoadFile ev-delete">
      <section class="tc-upLoadBox" @click="goUploadTips()">
        <figure class="tc-upLoadTitle uploadTips-box">
          <span class="tc-upLoadTitleName  uploadTips-title">医学影像拍摄过程</span>
          <span class="tc-upLoadRightIcon  uploadTips-icon"></span>
        </figure>
      </section>
      <section class="tc-upLoadBox" v-for="(item,index) in uploadList" :key="index">
        <figure class="tc-upLoadTitle ev-upLoadList">
          <span class="tc-upLoadTitleName" :data-treatmentid="item.adviceId" :data-advicetype="item.adviceType">{{item.adviceName}}</span>
          <span class="tc-upLoadRightIcon"></span>
          <span class="tc-upLoadRightCover"></span>
          <!-- <li class="ev-upLoadInput"></li> -->
          <upLoadPlugn
            :propClass="'ev-upLoadInput'"
            :inputBoxClass="'inputBoxClass'"
            :adviceId="item.adviceId"
            :imageList="imageList"
            v-if="true"
            :paramObj="{
                      limit:9,
                      singleNum:9,
                      maxSize:10,
                      overSingleTips:'一次最多上传9张图片',
                      overSizeTips:'图片不能超过10M',
                      compressRatio:0.8
                  }"
            @beforeUpload="beforeUploadFn"
            @uploadDone="uploadDoneFn"
          ></upLoadPlugn>
        </figure>
        <ul class="tc-upLoadItemBox docInt" v-show="imageList[item.adviceId]&&imageList[item.adviceId].length>0">
          <li class="tc-upLoadItemList ev-imgList success" v-for="(img,imgIndex) in imageList[item.adviceId]" :key="imgIndex">
            <img alt="" @click="showBigImg(img,imgIndex,item.adviceId)" :src="img.blob">
            <span class="tc-upLoadDel" style="cursor: pointer"
                  @click="imgDelete(img,imgIndex,item.adviceId)"
                  v-show="img.uploading==false&&!img.fail"></span>
            <div v-show="img.uploading">
              <span class="tc-upLoadCover"></span>
              <span class="tc-upLoading"></span>
              <span class="tc-upLoadAfreshText">等待上传</span>
            </div>
            <figure class="upload-fail" v-if="img.fail">
              <p>重新上传</p>
              <div class="ev-upLoadInput" @click="upLoadReload(item,imgIndex)"></div>
            </figure>
          </li>
          <li class="tc-upLoadAdd" style="display: list-item;"
              v-show="imageList[item.adviceId]&&imageList[item.adviceId].length>0&&imageList[item.adviceId].length<9">
            <span class="upLoadBtnBox">
              <span class="tc-upLoadAddMore">
                <upLoadPlugn
                  :propClass="'ev-upLoadInput'"
                  :inputBoxClass="'inputBoxClass'"
                  :adviceId="item.adviceId"
                  v-if="true"
                  :paramObj="{
                      limit:9,
                      singleNum:9,
                      maxSize:10,
                      overSingleTips:'一次最多上传9张图片',
                      overSizeTips:'图片不能超过10M',
                      compressRatio:0.8
                  }"
                  @beforeUpload="beforeUploadFn"
                  @uploadDone="uploadDoneFn"
                ></upLoadPlugn>
              </span>
            </span>
          </li>
        </ul>
      </section>
      <div data-alcode-mod='718'>
        <footer class="tc-upLoadSubmit">
          <button class="tc-submitBtn" v-if="submitFlag" @click="backToImPage">提交</button>
          <button class="tc-submitDisabled" v-if="!submitFlag">提交</button>
        </footer>
      </div>
    </section>
    <transition name="fade">
      <Toast :content="errorMsg" v-if="errorShow"></Toast>
    </transition>
    <transition name="fade">
      <confirm
        :confirmParams="{
          'ensure':'取消',
          'cancel':'确定',
//          'content':'',
          'title':'确定删除图片吗？'
          }" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()"
        @ensureClickEvent="cancelDeletePic"></confirm>
    </transition>
    <transition name="fade">
      <!--图片上传离开的confirm-->
      <confirm
        :confirmParams="leaveConfirmParams"
        v-if="leaveConfirm"
        :showFlag.sync="leaveConfirm"
        @cancelClickEvent="cancelEvent()"
        @ensureClickEvent="ensureEvent()">
      </confirm>
    </transition>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc： 上传检查检验
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/21.
   */

  import api from "common/js/util/util";
  import confirm from "components/confirm";
  import Loading from "components/loading";
  import Toast from "components/toast";
  import upLoadPlugn from "components/upLoadPic/upLoadPlugn";
  import storage from "common/js/miniUtil/localStorage";
  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');

  const XHRList = {
    imgCreate: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/create/",
    imgDelete: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/",
    resetTime: api.httpEnv() + "/mcall/customer/case/consultation/v1/updateFrequency/",
    updateCase: api.httpEnv() + "/mcall/customer/patient/case/v1/update/",
    saveImage: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/" //图片保存
  };
  let refreshFlag = true; //路由进来的时候判断是否是查看大图返回来的
  export default {
    data() {
      return {
        leaveConfirm: false,
        leaveConfirmParams: {}, //离开confirm的参数
        pageLeaveEnsure: false, //是否离开页面
        uploadList: [], //上传列表项
        imageListLength: false, //图片列表中是否有图片
        imageList: {}, //上传成功后的图片数组
        toClick: false, //提交按钮是否可以点击
        errorShow: false,
        errorMsg: "",
        picIdIndex: 0,
        picLists:[],
        wxImgLists: [],
        loading: false, //是否正在上传
        deletePic: {},
        deletePicTip: false, //删除图片弹层,
        failImgList:{}
      };
    },

    computed: {
      ...mapState(['upload','caseId']),
      //计算提交按钮是否可以点击
      submitFlag() {
        let flag = false;
        let listFlag = false;
        let uploadingFlag = false;
        this.imageListLength = false;
        this.toClick = false;
        for (let i in this.imageList) {
          if (this.imageList[i].length !== 0) {
            listFlag = true;
            this.imageListLength = true;
            for (let j in this.imageList[i]) {
              if (this.imageList[i][j].uploading) {
                uploadingFlag = true;
                this.toClick = false;
              }else{
                uploadingFlag = false;
              }
            }
          }
        }
        //        debugger;
        if (listFlag && !uploadingFlag) {
          flag = true;
          this.toClick = true;
        }
        return flag;
      }
    },
    beforeRouteEnter(to, from, next) {
      if (from.name === "showBigImg" || from.name === "upLoadTip") {
        refreshFlag = false;
      } else {
        refreshFlag = true;
      }
      next(true);
    },
    beforeRouteLeave(to, from, next) {
      let that = this;
      if (to.name === "showBigImg" || to.name === "upLoadTip") {
        next(true);
        return;
      }
      if (that.imageListLength || that.toClick) {
        console.log("confirm框");
        if (that.imageListLength && that.toClick) {
          that.leaveConfirmParams = {
            ensure: "现在提交",
            cancel: "暂不提交",
            title: "要提交上传的图片么？"
          };
        } else {
          that.leaveConfirmParams = {
            ensure: "取消",
            cancel: "离开",
            title: "努力上传中",
            content: "现在离开，下次还要重新上传哦"
          };
        }
        that.leaveConfirm = true;
        next(that.pageLeaveEnsure);
        if (that.pageLeaveEnsure) {
          that.leaveConfirm = false; //离开之后confirm框隐藏
          that.imageList = {}; //离开之后上传图片对象置为空
        }
        that.pageLeaveEnsure = false;
      } else {
        console.log("没有上传图片");
        that.imageList = {}; //离开之后上传图片对象置为空
        that.leaveConfirm = false; //离开之后confirm框隐藏
        next(true);
      }
    },
    onLoad() {
      this.uploadList = [];
      this.getUploadList()
    },
    onUnload () {
      this.uploadList = [];
    },
    methods: {
      // 去上传提示
      goUploadTips() {
        wx.navigateTo({
          url: "/pages/upLoadGuide/upLoadGuide"
        });
      },
      beforeUploadFn(param){
        // this.imageList[param.adviceId].push(param);
        this.imageList[param.adviceId].push(param.imgUrl);
      },
      uploadDoneFn(_data){
        //是否存在上传失败图片
        if (_data.isFail) {
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1].fail = true;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1].uploading = false;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1].finish = true;
          this.failImgList[_data.adviceId].push(_data.failParam);
        } else {
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1] .imgId= _data.imgId;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1] .fail= false;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1] .uploading= false;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length-1] .finish= true;
          this.failImgList[_data.adviceId].push([]);
        }
        this.$forceUpdate();
      },
      //上传失败重传事件
      upLoadReload(item,index){
        let _this = this;
        api.reloadFile({
          param:_this.failImgList[item.adviceId][index],
          uploadBefor:(_data)=>{
            _this.imageList[item.adviceId][index].uploading = true;
            _this.imageList[item.adviceId][index].fail = false;
            _this.imageList[item.adviceId][index].finish = false;
            _this.$forceUpdate();
          },
          uploadDoneFn:_data=>{
            if (_data.fail) {
              _this.imageList[item.adviceId][index].uploading = false;
              _this.imageList[item.adviceId][index].fail = true;
              _this.imageList[item.adviceId][index].finish = true;
              _this.$forceUpdate();
            } else {
              _this.imageList[item.adviceId][index] = _data;
              _this.$forceUpdate();
            }
          }
        });
      },
      //上传列表数组初始化
      getUploadList() {
        this.uploadList = this.upload;
        this.uploadList.forEach((element, index) => {
          this.$set(this.imageList, element.adviceId, []);
          this.$set(this.failImgList, element.adviceId, []);
        });
        console.log(this.uploadList)
      },
      //删除图片
      imgDelete(img, index, id) {
        const that = this;
        this.deletePicTip = true;
        this.deletePic.type = id;
        this.deletePic.index = index;
      },
      cancelDeletePic() {
        this.deletePic.type = "";
        this.deletePic.index = "";
        this.deletePicTip = false;
      },
      ensureDeletePic() {
        let _deletePic = this.deletePic;
        this["imageList"][_deletePic.type].splice(_deletePic.index, 1);
        this["failImgList"][_deletePic.type].splice(_deletePic.index, 1);
        this.deletePicTip = false;
      },
      //查看大图
      showBigImg(item, index, type) {
        let _params = {
          imgBlob: this["imageList"][type],
          indexNum: index
        };
        this.$router.push({
          name: "showBigImg",
          params: _params
        });
      },
      backToImPage() {
        const that = this;
        let _picIdList = "";
        this.leaveConfirm = false;
        for (let i of that.uploadList) {
          for (let k of that.imageList[i.adviceId]) {
            _picIdList += `${k.imgId},`;
          }
        }
        api.ajax({
          url: XHRList.saveImage,
          method: "POST",
          data: {
            caseId: this.caseId, //string	是	病例id
            idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
          },
          done(data) {
            if (data && data.responseObject && data.responseObject.responseStatus) {
              that.pageLeaveEnsure = true;
              storage.setItem(('checkSuggestTips'),{
                success: 1,
                queryType: "checkSuggest"
              });
              wx.navigateBack({
                delta: 1
              })
            }
          }
        });
      },
      //取消按钮
      cancelEvent() {
        let that = this;
        that.leaveConfirm = false;
        that.pageLeaveEnsure = true;
        that.$router.go(-1);
        //        this.leaveConfirm = false;
        //        this.pageLeaveEnsure = false;
        console.log("取消");
      },
      //离开函数
      ensureEvent() {
        let that = this;
        console.log("离开");
        if (!that.toClick) {
          this.leaveConfirm = false;
          this.pageLeaveEnsure = false;
        } else {
          that.backToImPage();
        }
      }
    },
    components: {
      Toast,
      Loading,
      confirm,
      // SelectImage,
      upLoadPlugn
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">


  .tc-upLoadFile.fileUpload {
    display: flex;
  }

  .tc-upLoadFile {
    background-color: #ffffff;
    padding-top: 22px;
    /*height: 100%;*/
    box-sizing: border-box;
  }

  .upload-wrapper {
    width: 100%;
    min-height: 100%;
    position: absolute;
    top: 0;
    right: 0;

    left: 0;
    bottom: 0;
    background-color: #ffffff;
    .al-uploadNumLimit {
      font-size: 32px;
      padding: 30px 60px 30px 48px;

      span {
        display: inline-block;
        position: relative;
        // padding-left: 30px;
        padding: 10px 30px 10px 65px;
        background-color: #fa787a2b;
        border-radius: 50px;
        width: 100%;
        box-sizing: border-box;
        color: #444444;
        &::before {
          position: absolute;
          content: "";
          display: inline-block;
          width: 28px;
          height: 28px;
          background: url("https://m.allinmed.cn/static/image/img00/doctorHome/upLoadTip.png") no-repeat center;
          background-size: 28px 28px;
          top: 50%;
          margin-top: -14px;

          left: 20px;
        }
      }
    }
  }

  $colorTwo: #222222;
  .tc-upLoadBox {
    background-color: white;
    .middle-tip-box {
      opacity: 0.83;
      background: #545454;
      position: absolute;
      .middle-tip-modal {
        position: absolute;
      }
    }
    .tc-upLoadTitle {
      padding: 30px 48px 30px 48px;
      position: relative;
      border-bottom: 1px solid #ffffff;
      &.uploadTips-box {
        padding-left: 86px;
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/doubt2@2x.png") no-repeat 48px center;
        background-size: 38px;
        .tc-upLoadTitleName {
          color: #2EA9FE;
        }
        .tc-upLoadRightIcon {
          float: right;
          display: inline-block;
          width: 26px;
          margin-top: 10px;
          height: 26px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/arrow.png");
          background-size: 100% 100%;
        }
      }
      .tc-upLoadTitleName {
        display: inline-block;
        font-size: 32px;
        color: $colorTwo;
      }
      .ev-upLoadInput {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        opacity: 0;
        width: 100%;
      }
      .tc-upLoadRightIcon {
        float: right;
        display: inline-block;
        width: 26px;
        margin-top: 10px;
        height: 26px;
        background: url("https://m.allinmed.cn/static/image/img00/patientConsult/file_upload@2x.png");
        background-size: 100% 100%;
      }
      .tc-upLoadRightCover {
        position: absolute;
        //display: inline-block;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 5;
        display: none;
      }
      .input-box{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .inputBoxClass{
          height: 100%;
          .ev-upLoadInput{
            height: 100%;
            opacity: 0;
            border: none;
            width: 100%;
          }
        }
        &.isWx{
          .inputBoxClass{
            height: 100%;
            .ev-upLoadInput{
              height: 100%;
              opacity: 0;
              border: none;
              width: 100%
            }
          }
        }
      }
    }
    .tc-upLoadItemBox {
      padding-left: 32px;
      padding-right: 30px;
      padding-bottom: 36px;
      @include clearfix();
      .tc-upLoadItemList {
        position: relative;
        width: 152px;
        height: 152px;
        float: left;
        margin: 8px;
        img {
          position: relative;
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
        .tc-upLoadCover {
          position: absolute;
          display: inline-block;
          top: 0;
          left: 0;
          width: 152px;
          height: 152px;
          // margin-top: 8px;
          // margin-left: 8px;
          background-color: #000000;
          opacity: 0.63;
          z-index: 0;
        }
        //上传失败
        .upload-fail {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0.83;
          background: #545454;
          & > input {
            opacity: 0;
            width: 100%;
            height: 100%;
          }
          & > p {
            font-size: 24px;
            color: #ffffff !important;
            text-align: center;
            position: absolute;
            top: 50%;
            width: 100%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
        .tc-upLoadDel {
          position: absolute;
          //display: inline-block;
          width: 60px;
          height: 60px;
          top: 8px;
          right: 8px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat;
          background-position: top right;
          background-size: 38px 38px;
          z-index: 1;
        }
        .tc-upLoadAddMore {
          display: inline-block;
          width: 100%;
          height: 1000%;
          //position: relative;
          &:before {
            display: inline-block;
            content: "";
            position: absolute;
            width: 64px;
            height: 2px;
            background: #d8d8d8;
            top: 50%;
            left: 50%;
            margin-left: -32px;
          }
          &:after {
            display: inline-block;
            content: "";
            position: absolute;
            width: 2px;
            height: 64px;
            background: #d8d8d8;
            top: 50%;
            margin-top: -32px;
          }
        }
        .tc-upLoading {
          position: absolute;
          width: 40px;
          height: 40px;
          top: 44px;
          left: 50%;
          margin-left: -20px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png") no-repeat center;
          background-size: 100% 100%;
          animation: submitIng 1s linear infinite;
        }
        .tc-upLoadAfresh {
          color: #ffffff;
          position: absolute;
          width: 40px;
          height: 40px;
          top: 44px;
          left: 50%;
          margin-left: -20px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_refresh_loading@2x.png") no-repeat center;
          background-size: 100% 100%;
        }
        .tc-upLoadAfreshText {
          font-size: 26px;
          display: inline-block;
          position: absolute;
          left: 50%;
          margin-left: -76px;
          bottom: 30px;
          color: #ffffff;
          width: 152px;
          text-align: center;
          z-index: 1;
        }
        .ev-fileUpRefresh {
          position: absolute;
          display: inline-block;
          top: 0;
          left: 0;
          width: 152px;
          height: 152px;
          margin-top: 8px;
          margin-left: 8px;
          z-index: 2;
        }
        .ev-upLoadInput{
          margin: 0;
          height: 100%;
          opacity: 0;
        }
      }
      .tc-upLoadAdd {
        width: 152px;
        height: 152px;
        text-align: center;
        position: relative;
        float: left;
        padding: 8px;
        input {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0;
          width: 100%;
        }
        .upLoadBtnBox {
          display: block;
          height: 100%;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/upload_photo_default@2x.png");
          background-size: 100% 100%;
          .tc-upLoadAddMore{
            display: inline-block;
            width: 100%;
            height: 100%;
            section{
              height: 100%;
              .ev-upLoadInput{
                display:block;
                height:100%;
              }
            }
          }
        }
      }
      div {
        margin-top: 8px;
        margin-left: 8px;
      }
      &.tc-reviewItemBox {
        display: block;
      }
    }
  }

  .tc-upLoadSubmit {
    padding-top: 70px;
    text-align: center;
    padding-bottom: 60px;
    background-color: white;
    .tc-submitBtn {
      width: 570px;
      //display: block;
      line-height: 70px;
      font-size: 32px;
      text-align: center;
      background-color: #00d6c6;
      color: white;
      border-radius: 45px;
      margin: 0 auto;
    }
    .tc-submitDisabled {
      width: 570px;
      display: block;
      line-height: 70px;
      font-size: 32px;
      text-align: center;
      background-color: #dfdfdf;
      color: white;
      border-radius: 45px;
      margin: 0 auto;
    }
  }

  .he-upLoadGuide {
    img {
      max-width: 100%;
      min-width: 100%;
      height: 100%;
      width: 100%;
    }
  }

  #EV-swiper {
    padding-top: 40px;
    .closeBtn {
      top: 40px;
      right: 40px;
    }
    .EV-gallery-top {
      font-size: 28px;
    }
    .swiper-pagination.swiper-pagination-bullets {
      height: 37px;
      .swiper-pagination-bullet-active,
      .swiper-pagination-bullet {
        font-size: 28px;
        width: 16px;
        height: 16px;
      }
    }
    .swiper-wrapper {
      height: 100%;
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
</style>
