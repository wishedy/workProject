<template>
  <section class="comment-window-container" :class="{'show':showCommentWindow}" @click="cancelSubmit">
    <section class="comment-window" :class="{'isIphoneX':system=='iphoneX'}" @click.stop="">
      <section class="comment-window-textarea-container">
        <figure class="comment-window-textarea">
          <!--<pre>{{commentContent}}</pre>-->
          <textarea :fixed="fixed" v-model="commentContent" placeholder="走心的评论最有爱" class="comment-window-text iphoneX"
                    placeholder-class="comment-window-placeholder" maxlength="1000" :showConfirmBar="hideConfirm"
                    v-if="system=='iphoneX'&&showCommentWindow" cursor-spacing="20" @focus="focus=true"
                    auto-height="true" @blur="focus=false" auto-focus="true" />
          <textarea :fixed="fixed" v-model="commentContent" placeholder="走心的评论最有爱" class="comment-window-text ios"
                    placeholder-class="comment-window-placeholder" maxlength="1000" :showConfirmBar="hideConfirm"
                    v-if="system=='ios'&&showCommentWindow" cursor-spacing="20" @focus="focus=true"
                    auto-height="true" @blur="focus=false" auto-focus="true" />
          <textarea :fixed="fixed" v-model="commentContent" placeholder="走心的评论最有爱" class="comment-window-text android"
                    :class="{'noText':commentContent.length>0}" :showConfirmBar="hideConfirm" @focus="focus=true"
                    placeholder-class="comment-window-placeholder" maxlength="1000" cursor-spacing="20"
                    v-if="system=='android'&&showCommentWindow"
                    auto-height="true" @blur="focus=false" auto-focus="true" />
          <p class="last-tips" v-if="lastCount<=50">{{lastCount}}</p>
        </figure>
        <span class="middle-line" v-if="imageList.length>0"></span>
        <section class="comment-window-imgList" v-if="imageList.length>0">
          <figure class="comment-window-img" v-for="(item,index) in imageList" :key="index">
            <img :src="item.blob" alt="" @click="previewImage(item)">
            <span class="tc-upLoadDel" @click="imgDelete(index)"></span>
            <ImgLoading v-if="!item.finish"></ImgLoading>
          </figure>
        </section>

      </section>
      <section class="submit-container">
        <figure class="comment-window-uploader"  :class="{'uploaded':imageList.length>0}" @click="uploadImage">

        </figure>

        <section class="submit-button-container" @click="submitComment">
          <div class="submit-button" :class="{'active':sendActive}">发送</div>
        </section>
      </section>

      <Confirm :confirmParams="{
                'ensure':'取消',
                'cancel':'确定',
                'title':'确定删除图片吗？'
                }" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()"
               @ensureClickEvent="cancelDeletePic()"></Confirm>

    </section>
  </section>

</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/8/12.
   */
  import upLoadPic from "components/upLoadPic/upLoadPic";
  import localStorage from 'localStorage'
  import {createNamespacedHelpers} from 'vuex';

  const {mapActions, mapState, mapMutations} = createNamespacedHelpers('journal');
  import api from "common/js/util/util";
  import ImgLoading from "components/imgLoading";
  import Confirm from "components/confirm";

  const xhr = api.httpEnv() + "/mcall/customer/review/v1/upload/";
  export default {
    data() {
      return {
        fixed: true,

        hideConfirm: false,
        commentContent: "",
        imageList: [],
        failImgList: [],
        deletePic: {},
        deletePicTip: false,
        focus: false,
        keyBoardHeight: 0,
        adjustPosition: false,
        submitSuccess: {
          type: '',
          icon: '/static/image/success.png',
          content: '发布成功',
          show: true,
          hideDelay: true
        },
        submitFail: {
          type: '',
          icon: '/static/image/fail.png',
          content: '发布失败',
          show: true,
          hideDelay: true
        }
      }
    },
    props: {
      destory: {
        type: Number,
        default: 0
      }
    },

    onUnload(){
      this.commentContent="";
      this.imageList=[];
    },
    methods: {
      ...mapMutations(['setCommentWindowShow', 'showBigImg']),
      ...mapActions(['createJournalComment', 'showToast', 'getCommentList', 'changeCommentLoading']),
      //取消评论
      cancelSubmit() {
        this.setCommentWindowShow(false);
        this.focus = false;
        setTimeout(() => {
          wx.pageScrollTo({
            scrollTop: this.cachePosition,
            duration: 0
          })
        }, 100);


      },
      //提交评论
      submitComment() {
        if (this.imageList[0]){
          if (this.imageList[0].uploading){
            return false;
          }
        }

        if (this.commentContent.trim().length === 0 && (this.imageList.length === 0 || !this.imageList[0].imgId)) {
          this.showToast("回复内容不能为空");
        } else {
          this.createJournalComment({
            resourceId: this.resourceId,
            customerId: this.customerId,
            refCustomerId: this.currentCustomerId || "",
            reviewContent: this.commentContent.trim(),
            treeLevel: this.currentCustomerId ? 2 : 1,
            parentId: this.currentCommentId || 0,
            attIdList: this.imageList[0] ? this.imageList[0].imgId : ""
          }).then((data) => {
            if (data.responseObject.responseStatus) {
              //  成功
              this.changeCommentLoading(this.submitSuccess).then(() => {
                this.setCommentWindowShow(false);
                this.getCommentList({
                  type: "getAll",
                  getter: true
                });
                this.getCommentList({
                  type: "getAuthor",
                  getter: true
                });

                this.commentContent = "";
                this.imageList = [];
                const query = wx.createSelectorQuery()
                query.select('#queryHelper').boundingClientRect()
                query.selectViewport().scrollOffset()


                query.exec((res) => {
                  setTimeout(() => {
                    wx.pageScrollTo({
                      scrollTop: res[0].height,
                      duration: 0
                    })
                  }, 100);
                });
              });
            } else {
              //失败
              this.changeCommentLoading(this.submitFail)
            }
          }).catch(err => {
            this.changeCommentLoading(this.submitFail)
          })
        }
      },
      previewImage(item) {
        this.showBigImg({
          imageList: this.imageList,
          img: item.blob
        })
      },
      uploadImage() {
        console.log(`------------上传图片----------`)
        console.log(this.imageList.length)
        if (this.imageList.length>0) {
          this.showToast("最多上传1张图片");
          return false;
        }
        wx.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"],  // 可以指定来源是相册还是相机，默认二者都有
          success: (res) => {
            this.imageList = [];
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            this.tempFilePaths = res.tempFilePaths;
            this.imageList.push({
              imgId: "",
              uploading: true,
              fail: false,
              finish: false,
              blob: res.tempFilePaths[0]
            });
            this.upLoadPic(res.tempFilePaths[0]);
          },
        });
      },
      upLoadPic(file) {
        wx.uploadFile({
          url: xhr,
          filePath: file,
          name: "file",
          formData: {
            attType: "1",
            sortId: "1",
            reviewId: this.currentCommentId || "",
            visitSiteId: api.getSiteId()
          },
          success: (res) => {
            const _data = JSON.parse(res.data);
            if (_data.responseObject.responseStatus) {
              this.imageList[0].imgId = _data.responseObject.responseData.id;
              this.imageList[0].uploading = false;
              this.imageList[0].fail = false;
              this.imageList[0].finish = true;
            } else {
              this.imageList[0].imgId = _data.responseObject.responseData.id;
              this.imageList[0].uploading = false;
              this.imageList[0].fail = true;
              this.imageList[0].finish = false;
            }


            this.tempFilePaths = [];
          },
          fail: (err) => {
            this.imageList[0] = {};
            this.tempFilePaths = []
          },
        })
      },
      imgDelete() {
        this.deletePicTip = true;
      },
      ensureDeletePic() {
        this.deletePicTip = false;
        this.imageList = [];
      },
      cancelDeletePic() {
        this.deletePicTip = false;
      },
    },
    mounted() {

    },
    components: {
      upLoadPic,
      ImgLoading,
      Confirm
    },
    computed: {
      ...mapState(['cachePosition', 'customerId', 'resourceId', 'showCommentWindow', 'currentCommentId', 'currentCustomerId', 'systemInfo']),
      lastCount() {
        return 1000 - this.commentContent.trim().length
      },
      sendActive() {
        if (this.imageList.length > 0 || this.commentContent.trim().length > 0) {
          return true;
        } else {
          return false;
        }
      },
      hasImage() {
        if (this.imageList.length > 0 && this.focus) {
          return true;
        } else {
          return false;
        }
      },

      system() {
        if (this.systemInfo.model&&this.systemInfo.model.toLowerCase().includes("iphone x")){
          return "iphoneX";
        }else{
          if (this.systemInfo.system) {
            if (this.systemInfo.system.toLowerCase().includes("android")) {
              return "android";
            } else {
              return "ios"
            }
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  .iphonex {
    .comment-window {
      // padding-bottom: 30px;
    }
    .submit-container {
      // height: 80px;
      // position: relative;

    }
  }

  .comment-window-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .15);
    z-index: -1;
    opacity: 0;
    visibility: hidden;
    /*transition: all 0.2s ease-in-out;*/
    &.show {
      opacity: 1;
      visibility: visible;
      z-index: 3;
    }
  }

  .comment-window {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 36px 20px;
    background-color: #fff;
    box-sizing: border-box;
    &.hasImage {
      bottom: 26%;
    }
    &.isIphoneX{
      padding: 36px 20px 56px 20px;
    }
  }

  .submit-container {
    /*margin-top: 80px;*/
    @include clearfix();
    .submit-button-container {
      float: right;
      width: 110px;
      /*height: 90px;*/
      text-align: center;
      position: absolute;
      right: 20px;
      top: 40px;
      &:before {
        display: inline-block;
        vertical-align: middle;
        content: '';
        height: 100%;
      }
    }
    .submit-button {
      display: inline-block;
      /*vertical-align: middle;*/
      background: #E0E0E0;
      border-radius: 4px;
      width: 110px;
      /*height: 54px;*/
      line-height: 54px;
      text-align: center;
      font-size: 30px;
      color: #909090;
      &.active {
        background-color: #2EA9FE;
        color: #FFFFFF;
      }
    }
  }

  .comment-window-uploader {
    width: 90px;
    height: 100px;
    left: 0;
    /*float: left;*/
    position: absolute;
    top: 18px;
    background: url("https://m.allinmed.cn/static/image/mp/index/pic.png") no-repeat center center;
    background-size: 54px 44px;
    &.uploaded{
      background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/no-imaged.png") no-repeat center center;
      background-size: 54px 44px;
    }
  }

  .comment-window-textarea-container {
    background: #F5F5F5;
    border-radius: 8px;
    position: relative;
    width: 492px;
    margin-left: 74px;
    .middle-line {
      width: 440px;
      height: 2px;
      background-color: #d2d4d6;
      position: absolute;
      bottom: 174px;
      left: 26px;
    }
  }

  .comment-window-textarea {
    display: inline-block;
    vertical-align: bottom;
    position: relative;
    min-height: 68px;
    width: 492px;
    box-sizing: border-box;
    overflow: scroll;
    .comment-window-placeholder {
      font-size: 28px;
      box-sizing: border-box;
      color: #AAAAAA;
    }
    pre {
      width: 100%;
      padding: 0 20px;
      height: 100%;
      box-sizing: border-box;
      border-radius: 8px;
      font-size: 28px;
      word-break: break-all;
      min-height: 68px;
      opacity: 0;
      visibility: hidden;
      line-height: 1.5;
      max-height: 220px;
    }
    .comment-window-text {
      /*position: absolute;*/
      left: 0;
      top: 0;
      font-size: 30px;
      height: 68px;
      background: #F5F5F5;
      border-radius: 8px;
      width: 500px;
      padding:0 20px;
      // margin-top: 20px;
      line-height: 1.2;
      box-sizing: border-box;
      max-height: 200px;
      &.android {
        padding: 20px;
      }
      &.noText {
        padding: 0 20px;
      }
    }
    .last-tips {
      position: absolute;
      right: 20px;
      bottom: 10px;
      font-size: 30px;
      color: #FC746A;
      z-index: 1;
    }
  }

  .comment-window-imgList {
    margin-left: 26px;
    padding-bottom: 18px;
    margin-top: 54px;
    .comment-window-img {
      width: 120px;
      height: 120px;
      font-size: 0;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
      .ev-loading {
        position: absolute;
        opacity: 0.83;
        background: #545454;
        .middle-tip-modal {
          position: absolute;
        }
      }
      .tc-upLoadDel {
        position: absolute;
        width: 40px;
        height: 40px;

        top: -10px;
        right: -10px;
        background: url("https://m.allinmed.cn/static/image/mp/index/close.png") no-repeat;
        background-position: center center;
        background-size: contain;
        z-index: 3;
      }
    }
  }

  .float-helper {
    @include clearfix();
  }

  .comment-window-controller {
    float: right;
    font-size: 0;
    & > p {
      display: inline-block;
      vertical-align: middle;
      font-size: 30px;
      padding: 15px;
      border: 1px solid #000000;
      margin-left: 15px;
    }
  }

  .ev-upLoadInput {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    top: 0;
    z-index: 1;
    opacity: 0;
    width: 100%;
  }
</style>

