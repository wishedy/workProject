<template>
  <section class="he-videoUpHide ev-videoImgUpHide">
    <section class="he-videoUpLoadBox">
      <section class="he-videosMain">
        <section class="al-uploadNumLimit" v-if="type == 2"><span>提示：最多可以上传9张图片</span></section>
        <p class="he-loadTitle" :class="{'upLoadPicHasTip':type==2}">{{content}}</p>
        <ul class="he-loadFiles he-videoImageBox docInt" v-if="type==2">
          <li class="tc-imageItemList ev-imgList success" v-for="(item,index) in imageList" :key="index" v-if="imageList.length>0">
            <img :src="item.blob" @click="showBigImg(item,index)" alt="">
            <span class="tc-upLoadDel" @click="imgDelete(item, index, item.imgId)"
                  v-show="item.finish"></span>
            <div v-if="item.uploading">
              <span class="tc-upLoadCover"></span>
              <span class="tc-upLoading"></span>
              <span class="tc-upLoadAfreshText">等待上传</span>
            </div>
            <figure class="upload-fail" @click = 'uploadImg(index , true)' v-if="item.fail">
              <p>重新上传</p>
            </figure>
          </li>
          <li class="tc-imageUpLoadAdd" v-show="imageList.length<9" @click = "selectImage()">
            <div class="imageIcon">
              <span class="tc-upLoadAddMore"></span>
            </div>
          </li>
        </ul>
        <ul class="he-loadFiles" v-show="type==1 && !videoObj.size">
          <li class="he-videoAddFirstBtn" @click = 'selectVideo()'>
            <div class="he-videoFirstLoadBtn"></div>
          </li>
        </ul>
        <ul class="he-loadFiles ev-success" v-show="type==1 && videoObj.size">
          <li class="he-loadVideoSuccess">
            <span class="he-loadVideoSuccessBox">
            <span class="he-loadSuccessTip"></span>
            <span class="he-loadSuccessText">已上传</span>
          </span>
          </li>
          <li class="he-videoAddBtn he-loadSuccessTextBox">
            <div class="he-reLoadText" id="reloadBtn" @click="againUpload()">重新上传</div>
          </li>
        </ul>
        <section class="he-videosSubmit ev-submitUpData" v-show="type==2">
          <button class="usable downBtn" v-if="imageList.length && !uploading" @click="submitImage"
                  style="display: inline-block;">提交
          </button>
          <button class="unusable" v-if="!imageList.length || uploading">提交</button>
        </section>
        <section class="he-videosSubmit ev-submitUpData" v-show="type==1">
          <button class="usable downBtn" :disabled="uploadVideo" style="display: inline-block;" @click="submitVideo()"
                  v-if="videoObj.size">提交
          </button>
          <button class="unusable" v-if="!videoObj.size">提交</button>
        </section>
      </section>
    </section>
    <section class="video-upLoad-box" v-if="videoUploading">
      <section class="ev-videoUpLoading">
        <div class="tc-videoLoadingImg">
          <img src="https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png" alt="">
        </div>
        <p class="tc-videoLoadingText">上传中{{upLoadPercent}}%...</p>
      </section>
    </section>
    <toast :content="errorMsg" v-if="errorShow"></toast>
    <!--<transition name="fade">-->
      <!--<confirm-->
        <!--:confirmParams="{-->
          <!--'ensure':'取消',-->
          <!--'cancel':'确定',-->
<!--//          'content':'',-->
          <!--'title':'确定删除图片吗？'-->
          <!--}" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()"-->
        <!--@ensureClickEvent="cancelDeletePic"></confirm>-->
    <!--</transition>-->
    <transition name="fade">
      <!--图片上传离开的confirm-->
      <confirm
        :confirmParams="imgLeaveConfirmParams"
        v-if="imgLeaveConfirm"
        :showFlag.sync="imgLeaveConfirm"
        @cancelClickEvent="imgCancel()"
        @ensureClickEvent="imgEnsure()">
      </confirm>
    </transition>
    <transition name="fade">
      <!--视频上传离开的confirm-->
      <confirm
        :confirmParams="videoLeaveConfirmParams"
        v-if="videoLeaveConfirm"
        :showFlag.sync="videoLeaveConfirm"
        @cancelClickEvent="cancelEvent()"
        @ensureClickEvent="ensureEvent()">
      </confirm>
    </transition>
    <transition name="fade">
      <!--视频是否重新上传的confirm-->
      <confirm
        :confirmParams="{
            'ensure':'取消',
            'cancel':'替换',
            'title':'重新上传后',
            'content':'原有视频将被替换',
          }"
        v-if="reloadVideoConfirm"
        :showFlag.sync="reloadVideoConfirm"
        @cancelClickEvent="uploadEnsure()"
        @ensureClickEvent="uploadCancel()">
      </confirm>
    </transition>
  </section>

</template>
<script type="text/ecmascript-6">
  /**
   * @Desc： 视诊
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2017/8/23.
   */

  import api from "common/js/util/util";
  // import Qiniu from "common/js/third-party/qiniu/qiniu";
  import Toast from "components/toast";
  import confirm from "components/confirm";
  import getQiniuToken from "common/js/HttpRequest/getQiniuToken";
  import storage from "common/js/miniUtil/localStorage";
  // import store from "../store/store";
  // import imageCompress from "common/js/imgCompress/toCompress";

  import {createNamespacedHelpers} from "vuex";
  const {mapMutations, mapState, mapActions, mapGetters} = createNamespacedHelpers('imScene');

  const XHRList = {
    imgCreate: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/createPicture/", //上传图片
    imgDelete: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/", //更新图片
    saveVideo: api.httpEnv() + "/mcall/qiniu/storage/v1/saveVideoInfo/", //视频保存
    resetTime: api.httpEnv() + "/mcall/customer/case/consultation/v1/updateFrequency/",
    updateCase: api.httpEnv() + "/mcall/customer/patient/case/v1/update/",
    getToken: api.httpEnv() + "/mcall/qiniu/storage/v1/getToken/"
  };
  export default {
    data() {
      return {
        tokenObj:{}, // 七牛token对象
        type:0, // 视诊类型
        content:'', // 视诊话术
        tempFilePaths:[], // 小程序选择的临时图片路径；
        imgLeaveConfirm: false, //上传图片离开confirm框是否显示
        imgLeaveConfirmParams: {}, //图片离开的参数
        videoLeaveConfirm: false, //上传视频离开confirm框是否显示
        videoLeaveConfirmParams: {}, //上传视频离开confirm的参数
        pageLeaveEnsure: false, //页面是否离开
        reloadVideoConfirm: false, //视频重新上传的confirm框是否显示
        imageList: [],
        filesObj: {}, //多图file对象存储，用于获取每张图的信息
        base64Arr: [], //base64压缩后的图片
        uploadIndex: "", //多图上传递增索引
        loading: false,
        uploading: false,
        deletePic: {},
        // deletePicTip: false, //图片删除
        videoUploading: false, //视频正在上传七牛
        videoObj: {},
        videoSubmitParam: {},
        upLoadPercent: 0,
        tip: "上传完成",
        tipShow: false,
        finish: false,
        wxImgLists: [],
        picLists: [],
        picIdIndex: 0,
        uploadVideo: false, //点击提交之后，提交按钮是否可以点击
        uploader: {},//七牛初始化的对象
        errorShow: false, //toast提示框
        errorMsg: "" //toast话术
      };
    },
    computed : {
      ...mapState(['caseId'])
    },
    watch: {

    },
    props: {},
    methods: {
      // 选择图片
      selectImage () {
        const _this = this;
        wx.chooseImage({
          count: 9 - this.imageList.length, // 默认9
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
          success: function(res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            _this.tempFilePaths = res.tempFilePaths;
            _this.uploadImg();
          },
          complete: function(res) {

          }
        });
      },
      // 上传图片
      uploadImg (index = 0,reLoad = false) {
        let _this = this;
        if (!reLoad) {
          let promises = [];
          this.tempFilePaths.map( (item, number) => {
            console.log(item);
            console.log(number);
            _this.imageList.unshift({
              blob: _this.tempFilePaths[number],
              imgId: 0,
              uploading: true,
              fail: false
            });
            promises.push(new Promise( (resolve, reject) => {
              wx.uploadFile({
                url : XHRList.imgCreate,
                filePath : item,
                name: "file",
                formData: {
                  caseCategoryId: "1",       //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
                  imageType: "1",            //	string	是	资源类型		1-上传资料图片
                  caseAttSource: "1",
                  visitSiteId: "24"
                },
                success: function(res) {
                  let _data = JSON.parse(res.data);
                  console.log(_data);
                  if (_data.responseObject.responseStatus && _data.responseObject.responsePk){
                    _this.imageList[number].imgId = _data.responseObject.responsePk;
                    _this.imageList[number].uploading = false;
                    _this.imageList[number].fail = false;
                    _this.imageList[number].finish = true;
                  } else {
                    _this.imageList[number].uploading = false;
                    _this.imageList[number].fail = true;     //上传失败标识
                    _this.imageList[number].finish = true;
                  }
                  resolve();
                },
                fail:function(err){
                  //微信接口调用失败
                  _this.imageList[number].uploading = false;
                  _this.imageList[number].fail = true;     //上传失败标识
                  _this.imageList[number].finish = true;
                  reject();
                },
                complete:function(){

                }
              });
            }))
            Promise.all(promises).then( result => {
              console.log('上传完成');
            })
          })
        }else {
          console.log(_this.imageList[_this.imageList.length - index - 1].blob);
          wx.uploadFile({
            url : XHRList.imgCreate,
            filePath : _this.imageList[_this.imageList.length - index - 1].blob,
            name: "file",
            formData: {
              caseCategoryId: "1",       //	string	是	上传的图片的资料类型（treatmentId）		1-X光片
              imageType: "1",            //	string	是	资源类型		1-上传资料图片
              caseAttSource: "1",
              visitSiteId: "24"
            },
            success: function(res) {
              let _data = JSON.parse(res.data);
              console.log(_data);
              if (_data.responseObject.responseStatus && _data.responseObject.responsePk){
                _this.imageList[index].imgId = _data.responseObject.responsePk;
                _this.imageList[index].uploading = false;
                _this.imageList[index].fail = false;
                _this.imageList[index].finish = true;
              } else {
                _this.imageList[index].uploading = false;
                _this.imageList[index].fail = true;     //上传失败标识
                _this.imageList[index].finish = true;
              }
            },
            fail:function(err){
              //微信接口调用失败
              _this.imageList[index].uploading = false;
              _this.imageList[index].fail = true;     //上传失败标识
              _this.imageList[index].finish = true;
            },
            complete:function(){

            }
          });
        }
      },
      //查看大图
      showBigImg(item, index) {
        let arrTemp = [];
        this.imageList.map( (item, index) => {
          arrTemp.push(item.blob);
        });
        wx.previewImage({
          current:item.blob, // 当前显示图片的http链接
          urls: arrTemp // 需要预览的图片http链接列表
        })
      },
      //删除图片
      imgDelete(item, index, id) {
        this.deletePic.type = id;
        this.deletePic.index = index;
        wx.showModal({
          title: '确定删除图片吗？',
          content: '',
          success: res => {
            if (res.confirm) {
              this.ensureDeletePic();
              // console.log('用户点击确定')
            } else if (res.cancel) {
              this.cancelDeletePic();
              // console.log('用户点击取消')
            }
          }
        })
        // this.deletePicTip = true;
        // this.deletePic.type = id;
        // this.deletePic.index = index;
      },
      //取消删除图片
      cancelDeletePic() {
        this.deletePic.type = "";
        this.deletePic.index = "";
        // this.deletePicTip = false;
      },
      //确定删除图片
      ensureDeletePic() {
        let that = this;
        let _deletePic = this.deletePic;
        api.ajax({
          url: XHRList.imgDelete,
          method: "POST",
          data: {
            id: that.deletePic.type,
            isValid: 0
          },
          beforeSend() {
          },
          done() {
            that.imageList.splice(_deletePic.index, 1);
            that.uploading = false;
            // that.deletePicTip = false;
          }
        });
      },

      /** 选择视频 */
      selectVideo () {
        const  that = this;
        wx.chooseVideo({
          sourceType: ['album','camera'],
          maxDuration: 60,
          camera: 'back',
          success: function(res) {
            console.log(res);
            console.log('微信选择成功');
            if (res.size >= 62914560) {
              console.log('视频太大');
              that.errorMsg = "视频不能超过60M，请重新上传";
              that.errorShow = true;
              setTimeout(() => {
                that.errorShow = false;
              }, 2000);
              return;
            }
            that.videoUploading = true;
            const uploadTask = wx.uploadFile({
              url: 'https://up-z1.qbox.me',//如果是华北一请用up-z1.qbox.me
              filePath: res.tempFilePath,
              name: 'file',
              formData: {
                'key': that.tokenObj.key,
                'token': that.tokenObj.uptoken,
              },
              success: function(response) {
                console.log(response);
                let data = JSON.parse(response.data);
                that.videoUploading = false;
                that.upLoadPercent = 0;
                that.videoObj = res;
                that.videoSubmitParam = data;
                that.tipShow = true;
              },
              fail(error) {
                console.log(error)
              },
              complete(res) {
                // console.log(res)
              }
            });
            uploadTask.onProgressUpdate((res) => {
              console.log('上传进度');
              that.upLoadPercent = res.progress;
            })
          },
          fail : err => {
            console.log(err);
          }
        })
      },
      //图片提交
      submitImage() {
        const that = this;
        let _picIdList = "";
        let _num = 0;
        for (let i of that.imageList) {
          if (i.imgId) {
            _picIdList += `${i.imgId},`;
          } else {
            _num ++;
          }
        }
        if (_num) {
          this.errorMsg = `${_num}张图片上传失败，\n点击重新上传后再次提交`;
          this.errorShow = true;
          setTimeout(() => {
            this.errorShow = false;
          }, 2000);
          return;
        }
        api.ajax({
          url: XHRList.imgDelete,
          method: "POST",
          data: {
            caseId: that.caseId, //string	是	病例id
            idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
          },
          done(data) {
            if (data && data.responseObject && data.responseObject.responseStatus) {
              that.pageLeaveEnsure = true;
              storage.setItem(('triageTips'),{
                success: 1,
                queryType: "triage",
                triageType: "image"
              });
              wx.navigateBack({
                delta: 1
              });
              that.imageList = [];
            } else {
              that.errorMsg = "图片保存失败，请稍后再试";
              that.errorShow = true;
              setTimeout(() => {
                that.errorShow = false;
              }, 2000);
            }
          }
        });
      },
      //视频提交
      submitVideo() {
        const that = this;
        // 小程序处理文件名，因为没有获取到，然后自己整一个
        let nameArr = this.videoObj.tempFilePath.split('.');
        that.uploadVideo = true;

        api.ajax({
          url: XHRList.saveVideo,
          method: "POST",
          data: {
            videoName:`${nameArr[nameArr.length - 2]}.${nameArr[nameArr.length - 1]}`,
            key: this.videoSubmitParam.key,
            persistentId: this.videoSubmitParam.persistentId,
            caseId: this.caseId,
            refType: 1
          },
          done(data) {
            that.uploadVideo = false;
            if (data && data.responseObject && data.responseObject.responseStatus) {
              that.pageLeaveEnsure = true;
              storage.setItem(('triageTips'),{
                success: 1,
                queryType: "triage",
                triageType: "video"
              });
              wx.navigateBack({
                delta: 1
              })
            } else {
              that.errorMsg = "视频保存失败，请稍后再试";
              that.errorShow = true;
              setTimeout(() => {
                that.errorShow = false;
              }, 2000);
            }
            that.videoLeaveConfirm = false;
          }
        });
      },
      //视频上传离开confirm取消函数
      cancelEvent() {
        this.videoLeaveConfirm = false;
        if (!this.videoUploading) {
          this.pageLeaveEnsure = true;
          this.$router.go(-1);
        } else {
          this.uploader.start();//七牛上传开始；
          this.pageLeaveEnsure = false;
        }
      },
      //视频上传离开confirm离开函数
      ensureEvent() {
        let that = this;
        if (that.videoUploading) {
          that.videoLeaveConfirm = false;
          that.pageLeaveEnsure = true;
          that.$router.go(-1);
        } else {
          if (that.uploadVideo) {
            return false;
          }
          that.submitVideo();
        }
      },
      //重新上传按钮
      againUpload() {
        wx.showModal({
          title: '重新上传后',
          content: '原有视频将被替换',
          success: res => {
            if (res.confirm) {
              this.selectVideo();
              // console.log('用户点击确定')
            } else if (res.cancel) {

              // console.log('用户点击取消')
            }
          }
        })
      },
      //重新上传confirm取消函数
      uploadCancel() {
        this.reloadVideoConfirm = false;
      },
      //重新上传confirm替换函数
      uploadEnsure() {
        let that = this;
        that.reloadVideoConfirm = false;
        //        console.log(document.all);
        console.log(document.querySelector("#uploadBtn").nextSibling.firstChild);
        document.querySelector("#uploadBtn").nextSibling.firstChild["click"]();
        //        try{
        //          let evt = document.createEvent("Events"); //还有onchange则是HtmlEvents
        //          evt.initEvent("click",true,true);
        //          that.$refs.uploadBtn.dispatchEvent(evt);
        //        }catch(e) {
        //          alert(e);
        //        }
      },
      //图片离开取消按钮
      imgCancel() {
        let that = this;
        that.imgLeaveConfirm = false;
        that.pageLeaveEnsure = true;
        that.$router.go(-1);
        //        this.leaveConfirm = false;
        //        this.pageLeaveEnsure = false;
        console.log("取消");
      },
      //图片离开函数
      imgEnsure() {
        let that = this;
        console.log("离开");
        if (that.uploading) {
          this.imgLeaveConfirm = false;
          this.pageLeaveEnsure = false;
        } else {
          this.submitImage();
        }
      }
    },
    mounted() {
      console.log('caseId+++++++++++++++++' + this.caseId);
      console.log(this.$root.$mp.query);
      this.type = this.$root.$mp.query.type, // 视诊类型
      this.content= this.$root.$mp.query.content, // 视诊话术
      this.imageList = [];
      this.videoObj = {};
      this.videoSubmitParam = {};

      // 如果是上传视频，则获取七牛 token
      if (this.type == 1) {
        getQiniuToken().then( (result) => {
          this.tokenObj = result.responseObject;
        });
      }


      // if (!sessionStorage.getItem("triageRoute")) {
      //   sessionStorage.setItem("triageRoute", JSON.stringify(this.$route.params));
      // }
      // this.baseMessage = JSON.parse(sessionStorage.getItem("triageRoute"));

    },
    onUnload() {
      this.videoUploading = false;
      this.upLoadPercent = 0;
      this.videoObj = {};
      this.videoSubmitParam = {};
    },
    components: {
      Toast,
      confirm,
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">
  .he-videoUpHide {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    $main-color: #00d6c6;
    height: 100%;
    background-color: #ffffff;
    box-sizing: border-box;
    //video up load
    .he-videoUpLoadBox {
      height: 100%;

      .he-videosMain {
        min-height: 100%;
        height: auto;
        box-sizing: border-box;
        position: relative;
        padding-bottom: 117px;
        background-color: #fff;
        z-index: 5;
        .al-uploadNumLimit {
          font-size: 32px;
          padding: 30px 60px 0 48px;

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
        //问题样式
        .he-loadTitle {
          padding: 48px 40px 10px;
          font-size: 34px;
          line-height: 1.5;
          color: #222222;
          &.upLoadPicHasTip {
            padding: 30px 40px 10px;
          }
        }
        .he-loadFiles {
          @include clearfix();
          padding: 0 40px;
          &.he-videoImageBox {
            padding-left: 32px;
            padding-right: 40px;
            .tc-upLoadInput {
              cursor: pointer;
              position: absolute;
              right: 0;
              opacity: 0;
              outline: none;
              width: 100%;
              height: 100%;
            }
          }
          .he-loadVideoSuccess {
            width: 152px;
            height: 152px;
            text-align: center;
            padding: 8px;
            opacity: 0.7;
            background: #000000;
            .he-loadVideoSuccessBox {
              display: block;
              padding-top: 40px;
              .he-loadSuccessTip {
                display: block;
                margin: 0 auto;
                width: 36px;
                height: 36px;
                background: url("https://m.allinmed.cn/static/image/img00/patientConsult/upload_success.png");
                background-size: 100% 100%;
              }
              .he-loadSuccessPercent {
                display: block;
                text-align: center;
                color: #ffffff;
              }
              .he-loadSuccessText {
                font-size: 24px;
                display: block;
                color: #ffffff;
                padding-top: 10px;
                text-align: center;
              }
            }
          }
          .he-videoAddBtn.he-loadSuccessTextBox {
            width: 152px;
            height: auto;
            text-align: center;
            position: static;
            float: none;
            padding: 8px;
            .he-reLoadText {
              font-size: 24px;
              color: #526085;
              padding-top: 4px;
              display: block;
              text-align: center;
            }
          }
          //.he-loadVideoItem{
          //  position: relative;
          //  height: 236px;
          //  width: 315px;
          //  background-color: #000000;
          //  display: none;
          //  .he-videoDelBtn{
          //    //display: none;
          //    position: absolute;
          //    display: inline-block;
          //    width: 38px;
          //    height: 38px;
          //    top: 2px;
          //    right: 2px;
          //    background: url("/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat center;
          //    background-size: 100% 100%;
          //    z-index: 1;
          //  }
          //  .he-videoLoading{
          //    display: none;
          //    position: absolute;
          //    width: 72px;
          //    height: 72px;
          //    top:50%;
          //    left: 50%;
          //    margin-top: -36px;
          //    margin-left: -36px;
          //    background: url("/image/img00/patientConsult/suggestion_upload@2x.png") no-repeat center;
          //    background-size: 100% 100%;
          //    animation: submitIng 1s linear infinite;
          //    -webkit-animation: submitIng 1s linear infinite;
          //    @keyframes submitIng {
          //      0% {-webkit-transform:rotate(0deg);}
          //      100% {-webkit-transform:rotate(360deg);}
          //    }
          //  }
          //  .he-videoPlayBtn{
          //    //display: none;
          //    position: absolute;
          //    width: 72px;
          //    height: 72px;
          //    top:50%;
          //    left: 50%;
          //    margin-top: -36px;
          //    margin-left: -36px;
          //    background: url("/image/img00/patientConsult/suggestion_play@2x.png") no-repeat center;
          //    background-size: 100% 100%;
          //  }
          //}
          .he-videoAddBtn {
            width: 152px;
            height: 152px;
            text-align: center;
            position: relative;
            float: left;
            padding: 8px;
            .he-videoFirstLoadBtn {
              display: block;
              height: 100%;
              background: url("https://m.allinmed.cn/image/img00/patientConsult/upload_photo_default@2x.png");
              background-size: 100% 100%;
            }
            .he-videoInputBtn {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              z-index: 1;
              opacity: 0;
            }
            &.ev-videoLoadHide {
              display: none;
            }
          }
          .he-videoAddFirstBtn {
            width: 152px;
            height: 152px;
            text-align: center;
            position: relative;
            float: left;
            padding: 8px;
            .he-videoFirstLoadBtn {
              display: block;
              height: 100%;
              background: url("https://m.allinmed.cn/static/image/img00/patientConsult/upload_photo_default@2x.png");
              background-size: 100% 100%;
            }
            //.he-videoInputBtn{
            //  position: absolute;
            //  width: 100%;
            //  height:100%;
            //  top: 0;
            //  left: 0;
            //  z-index: 1;
            //  opacity: 0;
            //}
          }
          .tc-upLoadVideoInput {
            display: none;
          }
          .tc-imageItemList {
            position: relative;
            width: 152px;
            height: 152px;
            float: left;
            margin: 8px;
            img {
              position: relative;
              width: 100%;
              height: 100%;
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
              -webkit-animation: submitIng 1s linear infinite;

            }
            .tc-upLoadAfresh {
              color: #ffffff;
              position: absolute;
              width: 40px;
              height: 40px;
              top: 44px;
              left: 50%;
              margin-left: -20px;
              background: url("https://m.allinmed.cn/image/img00/patientConsult/symptom_refresh_loading@2x.png") no-repeat center;
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
          }
          .tc-imageUpLoadAdd {
            width: 152px;
            height: 152px;
            text-align: center;
            position: relative;
            float: left;
            padding: 8px;
            .imageIcon {
              display: block;
              height: 100%;
              background: url("https://m.allinmed.cn/static/image/img00/patientConsult/upload_photo_default@2x.png");
              background-size: 100% 100%;
            }
          }
        }
        .he-videosSubmit {
          text-align: center;
          position: absolute;
          bottom: 60px;
          padding: 0 90px;
          .usable {
            display: none;
          }
          button.unusable {
            background-color: #dfdfdf;
          }
          button {
            width: 570px;
            display: block;
            line-height: 70px;
            font-size: 32px;
            text-align: center;
            background-color: $main-color;
            color: white;
            border-radius: 45px;
          }
        }
      }
    }
  }

  .video-upLoad-box {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
  }

  .ev-videoUpLoading {
    width: 258px;
    height: 258px;
    position: fixed;
    top: 50%;
    margin-top: -129px;
    margin-left: -129px;
    left: 50%;
    right: 0;
    opacity: 0.8;
    background: #000000;
    border-radius: 6px;
    .tc-videoLoadingImg {
      padding-top: 66px;
      img {
        margin: 0 auto;
        width: 60px;
        height: 60px;
        display: block;
        animation: rotate 1s linear forwards infinite;
      }
    }
    .tc-videoLoadingText {
      padding-top: 35px;
      font-size: 28px;
      color: #ffffff;
      text-align: center;
    }
  }

  .popup-tips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }


  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @keyframes submitIng {
    0% {
      -webkit-transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
    }
  }
</style>
