<template>
  <section class="upload-wrapper">
    <section class="tc-upLoadFile">
      <section class="tc-upLoadBox" @click="goUploadTips()">
        <figure class="tc-upLoadTitle uploadTips-box"><span class="tc-upLoadTitleName">医学影像拍摄过程</span><span
          class="tc-upLoadRightIcon"></span></figure>
      </section>
      <section class="tc-upLoadBox" v-for="(item,index) in uploadList" :key="index">
        <figure class="tc-upLoadTitle">
          <span class="tc-upLoadTitleName">{{item.adviceName}}</span>
          <span class="tc-upLoadRightIcon"></span>
          <span class="tc-upLoadRightCover"></span>
          <upLoadPic
            :propClass="'input-box'"
            :imgList="imageList"
            :adviceId="item.adviceId"
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
          ></upLoadPic>
        </figure>
        <ul class="tc-upLoadItemBox" v-show="imageList[item.adviceId].length>0">
          <li class="tc-upLoadItemList" v-for="(img,imgIndex) in imageList[item.adviceId]" :key="imgIndex">
            <img @click="showBigImg(img,item.adviceId)" :src="img.blob">
            <span class="tc-upLoadDel" @click="imgDelete(img,imgIndex,item.adviceId)"
                  v-show="img.uploading==false"></span>
            <div v-show="img.uploading">
              <span class="tc-upLoadCover"></span>
              <span class="tc-upLoading"></span>
              <span class="tc-upLoadAfreshText">等待上传</span>
            </div>
            <figure class="upload-fail" v-if="img.fail" @click="upLoadReload(item,imgIndex)">
              <p>重新上传</p>
              <div></div>
            </figure>
          </li>
          <li class="tc-upLoadAdd" v-show="imageList[item.adviceId].length>0&&imageList[item.adviceId].length<9">
            <div class="tc-upLoadAddBox">
              <upLoadPic
                :propClass="'tc-upLoadAddInput'"
                :imgList="imageList"
                :adviceId="item.adviceId"
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
              ></upLoadPic>
            </div>
          </li>
        </ul>
      </section>
      <footer class="tc-upLoadSubmit">
        <span class="tc-submitBtn" v-if="submitFlag" @click="backToImPage">提交</span>
        <span class="tc-submitDisabled" v-if="!submitFlag">提交</span>
      </footer>
    </section>
    <confirm :confirmParams="{
          'ensure':'取消',
          'cancel':'确定',
          'title':'确定删除图片吗？'
          }" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()"
             @ensureClickEvent="cancelDeletePic">
    </confirm>
    <NormalLoading v-if="loading"></NormalLoading>
    <toast :content="errorMsg" imgUrl="" v-if="errorShow"></toast>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc： 咨询历史 补全检查资料
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/21.
   */

  import api from "common/js/util/util";
  import confirm from "components/confirm";
  import NormalLoading from "components/loading";
  import nimEnv from "common/js/nimEnv/nimEnv";
  import upLoadPic from "components/upLoadPic/upLoadPlugn";
  import getNimToken from "common/js/HttpRequest/getNimToken";
  import ImBusinessMethods from "common/js/imBaseMethods/imBusinessMethods";
  import updateMedicalReport from "common/js/HttpRequest/updateMedicalReport";
  import updateConsultationState from "common/js/HttpRequest/updateConsultationState";
  import dataLog from "dataLog";
  import toast from "components/toast";
  import NIM from "common/js/nimEnv/NIM_Web_NIM_v5.3.0";

  const XHRList = {
    imgDelete: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/update/", //历史图片删除
  };
  export default {
    data() {
      return {
        params: {}, // 路由传过来的参数
        uploadList: [],
        imageList: {},
        failImgList: {},
        loading: false,
        errorMsg: "",
        errorShow: false,
        deletePic: {},
        deletePicTip: false,
        userData: {
          account: "",
          token: ""
        }
      };
    },
    onLoad(options) {
      this.params = options;
    },
    onUnload() {
      this.uploadList = [];
    },
    onShow() {
      dataLog.enterBrowse();
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    mounted() {
      this.getUploadList();
    },
    methods: {
      //去上传清晰图片教程页面
      goUploadTips() {
        wx.navigateTo({
          url: '/pages/upLoadGuide/upLoadGuide'
        });
      },
      getUploadList() {
        if (wx.getStorageSync("checkInspectLists")) {
          this.uploadList = JSON.parse(wx.getStorageSync("checkInspectLists"));
          this.uploadList.forEach(element => {
            this.$set(this.imageList, element.adviceId, []);
            this.$set(this.failImgList, element.adviceId, []);
          });
        }
      },
      beforeUploadFn(param) {
        this.imageList[param.adviceId].push(param.imgUrl);
        this.failImgList[param.adviceId].push(param.failParam);
      },
      uploadDoneFn(_data) {
        //是否存在上传失败图片
        if (_data.isFail) {
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].fail = true;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].finish = true;
        } else {
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].imgId = _data.imgId;
          this.imageList[_data.adviceId][this.imageList[_data.adviceId].length - 1].uploading = false;
        }
        this.$forceUpdate();
      },
      //上传失败重传事件
      upLoadReload(item, index) {
        let _this = this;
        api.reloadFile({
          param: _this.failImgList[item.adviceId][index],
          uploadBefor: (_data) => {
            _this.imageList[item.adviceId][index].uploading = true;
            _this.imageList[item.adviceId][index].fail = false;
            _this.imageList[item.adviceId][index].finish = false;
          },
          uploadDoneFn: _data => {
            if (_data.fail) {
              _this.imageList[item.adviceId][index].uploading = true;
              _this.imageList[item.adviceId][index].fail = false;
              _this.imageList[item.adviceId][index].finish = false;
              _this.$forceUpdate();
            } else {
              _this.imageList[item.adviceId][index].imgId = _data.imgId;
              _this.imageList[item.adviceId][index].uploading = false;
              _this.imageList[item.adviceId][index].fail = false;
              _this.imageList[item.adviceId][index].finish = true;
              _this.$forceUpdate();
            }
          }
        });
      },
      //查看大图
      showBigImg(item, type) {
        let bigImgLists = [];
        this.imageList[type].forEach((element) => {
          bigImgLists.push(element.blob);
        });
        wx.previewImage({
          current: item.blob,
          urls: bigImgLists
        })
      },
      //删除图片 走接口
      imgDelete(img, index, id) {
        this.deletePicTip = true;
        this.deletePic.imgId = img.imgId;
        this.deletePic.type = id;
        this.deletePic.index = index;
        console.log(this.deletePic)
      },
      //取消删除图片
      cancelDeletePic() {
        this.deletePic = {};
        this.deletePicTip = false;
      },
      //确定删除图片
      ensureDeletePic() {
        let that = this;
        let _deletePic = this.deletePic;
        api.ajax({
          url: XHRList.imgDelete,
          method: "POST",
          data: {
            id: that.deletePic.imgId,
            isValid: 0
          },
          done() {
            that.imageList[_deletePic.type].splice(_deletePic.index, 1);
            that.failImgList[_deletePic.type].splice(_deletePic.index, 1);
            that.deletePicTip = false;
          }
        });
      },
      //提交后更新IM状态并返回上一页
      backToImPage() {
        let failNum = 0;
        let loadingNum = 0;
        Object.keys(this.imageList).forEach((element) => {

          this.imageList[element].forEach((ele) => {
            console.log(ele)
            if (ele.fail) {
              failNum += 1;
            }

            if (ele.uploading) {
              loadingNum += 1;
            }
          })
        });

        if (loadingNum > 0) {
          this.errorMsg = `${loadingNum}张图片正在上传，\n请稍候`;
          this.errorShow = true;
          setTimeout(() => {
            this.errorShow = false;
          }, 2000)
          return;
        }


        if (failNum > 0) {
          this.errorMsg = `${failNum}张图片上传失败，\n点击重新上传后再次提交`;
          this.errorShow = true;
          setTimeout(() => {
            this.errorShow = false;
          }, 2000)
          return;
        }
        const that = this;
        that.loading = true;

        dataLog.createTrack({
          actionId: 14176,
        });
        that.saveImage().then((resolve, reject) => {
          if (that.params.from && that.params.from === "im") {
            wx.setStorageSync(('checkSuggestTips'), {
              success: 1,
              queryType: "checkSuggest"
            });
            that.loading = false;
            wx.navigateBack({
              delta: 1
            })
          } else {
            updateMedicalReport({
              caseId: this.params.caseId,
              state: 1
            }).then(data => {
              if (data.responseObject.responseStatus) {
                console.log("更新上传了检查检验");
                that.refreshStateOther();
                that.getUserBaseData(that.params);
              } else {
                console.log("更新状态失败");
              }
            });
          }
        })
      },
      // 保存图片
      saveImage() {
        return new Promise((resolve, reject) => {
          const that = this;
          let _picIdList = "";
          for (let i of that.uploadList) {
            for (let k of that.imageList[i.adviceId]) {
              _picIdList += `${k.imgId},`;
            }
          }
          api.ajax({
            url: XHRList.imgDelete,
            method: "POST",
            data: {
              caseId: this.params.caseId, //string	是	病例id
              idList: _picIdList.substring(0, _picIdList.length - 1) //string	是	附件id串
            },
            done(data) {
              if (data && data.responseObject && data.responseObject.responseStatus) {
                resolve();
              }
            }
          });
        });
      },
      refreshStateOther() {
        updateConsultationState({
          consultationIds: this.params.consultationId,
          consultationState: 6 //会诊状态-1-待就诊0-沟通中1-已结束2-被退回(拒绝接诊)3-超时接诊退回4-新用户5-释放6-已上传资料7-分诊拒绝8-分诊完成9-待检查10-已推荐11-超时未回复
        }).then(data => {
          if (data.responseObject.responseStatus) {
            console.log("状态更新成功" + state);
          } else {
            console.log("状态更新失败" + data);
          }
        });
      },
      getUserBaseData(obj) {
        getNimToken({
          accid: obj.caseId
        }).then(data => {
          if (data.responseObject.responseStatus) {
            this.userData = {
              account: "0_" + obj.caseId,
              token: data.responseObject.responseData.imToken
            };
            this.connectToNim(obj);
          }
        });
      },
      connectToNim(opt) {
        nimEnv("test").then(nimEnv => {
          this.nim = NIM.getInstance({
            appKey: nimEnv,
            account: this.userData.account,
            token: this.userData.token,
            reconnectionAttempts: 0,
            onconnect: data => {
              console.log("连接成功");
              new ImBusinessMethods(this.nim).sendCustomMessage({
                to: "1_doctor00001",
                custom: JSON.stringify({
                  cType: "0",
                  cId: opt.triDocId,
                  mType: "40",
                  conId: opt.consultationId
                }),
                content: JSON.stringify({
                  type: "checkSuggestSendTips",
                  data: {
                    actionType: "checkSuggest"
                  }
                }),
              }).then(msg => {
                this.nim.destroy();
                this.loading = false;
                wx.setStorageSync('backFromImgCheck', 1);
                wx.navigateBack({delta: 1});

              })
            },
            onwillreconnect(obj) {
              console.log("已重连" + obj.retryCount + "次，" + obj.duration + "后将重连...");
            },
            ondisconnect() {
              console.log("链接已中断...");
            }
          });
        });
      }
    },

    computed: {
      submitFlag() {
        let flag = false;
        // console.log(this.imageList);
        for (let i in this.imageList) {

          if (this.imageList[i].length !== 0) {
            flag = true;
            break;
          }
        }
        return flag;
      }
    },
    components: {
      NormalLoading,
      confirm,
      upLoadPic,
      toast
    }
  };
</script>
<style lang="scss" rel="stylesheet/scss">

  .tc-upLoadFile {
    background-color: #ffffff;
    padding-top: 22px;
    box-sizing: border-box;
    padding-bottom: 100px;
    min-height: 100%;
  }

  .upload-wrapper {
    width: 100%;
    height: 100%;
    background-color: #f4f5f7;
    .al-uploadNumLimit {
      font-size: 32px;
      padding: 30px 60px 0 48px;
      background-color: #ffffff;
      span {
        display: inline-block;
        position: relative;
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

  .tc-upLoadBox {
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
        color: #222222;
      }
      .tc-upLoadRightIcon {
        float: right;
        display: inline-block;
        width: 26px;
        height: 26px;
        margin-top: 10px;
        background: url("https://m.allinmed.cn/static/image/img00/patientConsult/file_upload@2x.png");
        background-size: 100% 100%;
      }
      .tc-upLoadRightCover {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 5;
        display: none;
      }
      .input-box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        .inputBoxClass {
          height: 100%;
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
        padding: 8px;
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
          margin-top: 8px;
          margin-left: 8px;
          background-color: #000000;
          opacity: 0.63;
          z-index: 0;
        }
        //上传失败
        .upload-fail {
          position: absolute;
          top: 8px;
          right: 8px;
          bottom: 8px;
          left: 8px;
          opacity: 0.83;
          background: #545454;
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
          width: 60px;
          height: 60px;
          top: 8px;
          right: 8px;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat;
          background-position: top right;
          background-size: 38px 38px;
          z-index: 1;
        }
        @keyframes imgLoading {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
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
          animation: imgLoading 1s linear infinite;
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
      }
      .tc-upLoadAdd {
        width: 152px;
        height: 152px;
        text-align: center;
        position: relative;
        float: left;
        padding: 8px;
        .tc-upLoadAddBox {
          width: 100%;
          height: 100%;
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/upload_photo_default@2x.png");
          background-size: 100% 100%;
        }
        .tc-upLoadAddInput {
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          opacity: 0;
        }
      }
    }
  }

  .tc-upLoadSubmit {
    padding-top: 70px;
    padding-bottom: 60px;
    .tc-submitBtn {
      display: block;
      width: 570px;
      line-height: 70px;
      font-size: 32px;
      text-align: center;
      background: #00d6c6;
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
</style>
