<template>
  <section class="question-list">
    <header class="question-partName">已选部位：{{patientMessage.partName}}</header>
    <section class="question-slideL"></section>
    <section class="question-list-inner">
      <article class="question-list-item" @click="goToRouter('symptom')">
        <span class="question-list-item-title">已选部位不适症状</span>
        <!--<p class="question-list-item-content" @click="goToRouter('symptom')">-->
        <p class="question-list-item-content">
          <span :class="{'selected':questionOneDes.length>0,'no-selected':(!questionOneDes.length)&&noSlected}">{{formatQuestionOneDes}}</span>
        </p>
      </article>
      <section class="question-slide"></section>
      <article class="question-list-item" @click="timeTrack">
        <picker mode='selector' :value="0" :range="delayTimePicker" :range-key="'text'" @change="getSelectedTime">
          <span class="question-list-item-title">患病时长</span>
          <!--<p class="question-list-item-content" @click="timeTrack">-->
          <p class="question-list-item-content">
            <!--<picker mode='selector' :value="0" :range="delayTimePicker" :range-key="'text'" @change="getSelectedTime">-->
              <span :class="{'selected':delayTimeContent.length>0,'no-selected':(!delayTimeContent.length)&&noSlected}">{{delayTimeContent.length>0?delayTimeContent:"请选择"}}</span>
            <!--</picker>-->
          </p>
        </picker>
      </article>
      <section class="question-slideL"></section>
    </section>
    <section class="question-list-inner">
      <article class="question-list-item" v-if="scene==='findDoctor'" @click="goToRouter('treatment')">
        <span class="question-list-item-title">治疗情况</span>
        <!--<p class="question-list-item-content" @click="goToRouter('treatment')">-->
        <p class="question-list-item-content">
          <span :class="{'selected':questionTwoDes.length>0,'no-selected':(!questionTwoDes.length)&&noSlected}">{{questionDescSubFn}}</span>
        </p>
      </article>
      <article class="question-list-item" @click="goToRouter('illnessAdd')">
        <span class="question-list-item-title">病情补充<i class="question-list-item-tip">(选填)</i></span>
        <!--<p class="question-list-item-content" @click="goToRouter('illnessAdd')">-->
        <p class="question-list-item-content">
          <span :class="{'selected':patientMessage.descriptionDisease&&patientMessage.descriptionDisease.length>0}">{{descriptionDisease}}</span>
        </p>
      </article>
      <section class="question-slide"></section>
      <article class="question-list-item uploadPic">
        <section class="question-list-hasPic">
          <span class="question-list-item-title">是否有就诊时片子的照片</span>
          <p class="question-list-item-content no-arrowIcon">
            <span class="question-hasPic" :class="{'actived':isShowImgEnter==1,'no-selected':(isShowImgEnter==-1)&&noSlected}" @click="isShowImgEnter=1">有</span>
            <span class="question-noPic" :class="{'actived':isShowImgEnter==0,'no-selected':(isShowImgEnter==-1)&&noSlected}" @click="isShowImgEnter=0;imageList=[]">没有</span>
          </p>
        </section>
        <section class="question-list-image" v-if="isShowImgEnter==1">
          <section class="question-loadTitle">
            <span class="loadTitle-l">如何翻拍片子？</span>
            <span class="loadTitle-r" @click="goPicTips">点击查看</span>
          </section>
          <section class="question-list-image-list">
            <figure class="question-list-image-item" v-show="imageList.length==0">
              <figure class="question-image-addBtn">
                <section class="question-image-btnBox">
                  <span class="question-image-btnIcon"></span><span class="question-image-btnText">点击上传照片</span>
                </section>
                <!-- 图片上传组件 -->
                <uploadPlugnInit
                  :isShowOnce="true"
                  :propClass="'inputBoxClass'"
                  :imgList="imageList"
                  :paramObj="{
                  limit:50,
                  singleNum:9,
                  maxSize:10,
                  overSingleTips:'一次最多上传9张图片',
                  overSizeTips:'图片不能超过10M',
                  compressRatio:0.8
                }"
                  @beforeUpload="beforeUploadInitFn"
                  @uploadDone="uploadDoneInitFn"
                ></uploadPlugnInit>
              </figure>
            </figure>
            <ul class="qu-upLoadItemBox-s" v-if="imageList.length>0">
              <li class="tc-upLoadItemList" v-for="(item,index) in imageList" v-if="index<9" :key="index">
                <img :src="item.blob" @click="showBigImg(item,index)">
                <span class="tc-upLoadDel" @click="imgDelete(index)"></span>
                <span class="imgItem-cover" v-if="item.uploading"><span class="imgItem-loading"></span></span>
                <figure class="imgItem-fail" v-if="item.fail"  @click="upLoadReload(index)">
                      <p class="imgItem-failText">上传失败</p>
                      <p class="imgItem-reloadText">点击重试</p>
                </figure>
              </li>
              <!-- <li class="ev-upLoadAdd"> -->
                <!-- 图片上传组件 -->
                <uploadPlugn
                  :propClass="'ev-upLoadAdd'"
                  :imgList="imageList"
                  :paramObj="{
                  limit:50,
                  singleNum:9,
                  maxSize:10,
                  overSingleTips:'一次最多上传9张图片',
                  overSizeTips:'图片不能超过10M',
                  compressRatio:0.8
                }"
                  @beforeUpload="beforeUploadFn"
                  @uploadDone="uploadDoneFn"
                  v-if="isReadyLoad"
                ></uploadPlugn>
              <!-- </li> -->
            </ul>
            <p class="upLoadContentNum" v-show="imageList.length>0">已上传{{imageList.length}}张，<span class="upLoadViewAll"
                                                                                                   @click="showBigImg({},0)">查看全部</span>
            </p>
          </section>
          <article class="question-list-image-hide" v-show="false">片子是您咨询的重要依据，请尽量上传</article>
        </section>
      </article>
      <section class="question-slide" v-if="isShowImgEnter != 1"></section>
    </section>
    <section class="question-list-inner">
      <article class="question-list-item" @click="goToRouter('doctorHelp')">
        <span class="question-list-item-title">想要医生提供的帮助</span>
        <!--<p class="question-list-item-content" @click="goToRouter('doctorHelp')">-->
        <p class="question-list-item-content">
          <span :class="{'selected':patientMessage.needHelp&&patientMessage.needHelp.length>0,'no-selected':(!(patientMessage.needHelp&&patientMessage.needHelp.length>0))&&noSlected}">{{needHelp}}</span>
        </p>
      </article>
      <section class="question-slide"></section>
    </section>
    <form action="" @submit="formSubmit">
      <button class="submit-btn" formType="submit" @click="goToAffirm">提交给医生</button>
    </form>
    <confirm :confirmParams="{
          'ensure':'取消',
          'cancel':'确定',
          'title':'确定删除图片吗？'
          }" v-if="deletePicTip" :showFlag.sync="deletePicTip" @cancelClickEvent="ensureDeletePic()"
             @ensureClickEvent="cancelDeletePic()">
    </confirm>
    <NormalLoading v-if="loading"></NormalLoading>
    <Toast :content="toastContent" v-if="toastShow"></Toast>
  </section>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/6.
   */
  import confirm from "components/confirm";
  import api from "common/js/util/util";
  import createCase from "common/js/HttpRequest/createCase";
  import localStorage from "localStorage";
  import uploadPlugn from "components/upLoadPic/upLoadPlugn";
  import uploadPlugnInit from "components/upLoadPic/upLoadPlugn";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import { mapMutations, mapState, mapActions } from "vuex";
  import NormalLoading from "components/loading";
  import Toast from "components/toast";
  import dataLog from "dataLog";

  const XHRList = {
    query: api.httpEnv() + "/mcall/cms/part/question/relation/v1/getMapList/",
    imgUpload: api.httpEnv() + "/mcall/customer/patient/case/attachment/v1/create/"
  };


  export default {
    data() {
      return {
        delayTimePicker: [],
        delayTimeContent: "",
        delayTimeSelect: [],
        isShowImgEnter: -1,
        showLaterUpload: true,
        uploading: false,
        isReadyLoad: false, //是否有上传失败图片
        reload: false,
        failImgList: [],
        imageList: [],
        imageCacheList: [],
        deletePic: {},
        deletePicTip: false,
        confirmShow: false,
        hasImageUploading: false,
        noSlected:false
      };
    },
    props: {
      scene: {
        type: String,
        default: "consult"
      }
    },
    onLoad() {
      this.noSlected=false;
      this.getQuestionList();
    },
    methods: {
      ...mapMutations(["setPatientMessage", "setQuestionDetail", "setOrderMessage", "setQuestionOneDes", "setQuestionTwoDes", "setQuestionOne", "setQuestionTwo", "setLoadingState"]),
      ...mapActions(["showToast"]),
      timeTrack(){
        dataLog.createTrack({
          actionId: 14164,
        });
      },
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      goToRouter(name) {
        switch (name) {
          case "symptom":
            dataLog.createTrack({
              actionId: 14162
            });
            break;
          case "treatment":
            dataLog.createTrack({
              actionId: 14166
            });
            break;
          case "illnessAdd":
            dataLog.createTrack({
              actionId: 14168
            });
            break;
          case "doctorHelp":
            dataLog.createTrack({
              actionId: 14170
            });
            break;
        }

        wx.navigateTo({
          url: `/packageC/${name}/${name}?scene=${this.scene}`
        });
      },
      createTimePicker(renderList) {
        let delayTimeData = [];
        renderList[1].optionList1.forEach(value => {
          delayTimeData.push({
            text: value.optionName,
            value: value.optionId
          });
        });
        this.delayTimePicker = delayTimeData;
      },
      getSelectedTime(e) {
        dataLog.createTrack({
          actionId: 14165,
        });
        this.delayTimeContent = `${this.delayTimePicker[e.mp.detail.value].text}`;
        this.delayTimeSelect = [{
          questionId: this.questionDetail[1].questionId,
          optionIdList: this.delayTimePicker[e.mp.detail.value].value,
          partId: this.patientMessage.partId,
          optionDesc: ""
        }];
      },
      getQuestionList() {
        this.setLoadingState(true);
        api.ajax({
          url: XHRList.query,
          method: "POST",
          data: {
            partId: this.patientMessage.partId,
            isValid: "1",
            firstResult: "0",
            maxResult: "9999",
            sortType: "",
            applicationType: this.scene === "findDoctor" ? "3" : "2"
          },
          done: data => {
            this.setLoadingState(false);
            if (data.responseObject.responseData && data.responseObject.responseData.dataList) {
              let dataList = data.responseObject.responseData.dataList;
              this.setQuestionDetail(dataList);
              if (dataList && dataList.length !== 0) {
                this.createTimePicker(dataList);
              }
            } else {
              localStorage.removeItem("questionDetail");
              this.setQuestionDetail({});
            }
          }
        });
      },
      goPicTips() {
        wx.navigateTo({
          url: "/pages/upLoadGuide/upLoadGuide"
        });
      },
      beforeUploadInitFn(data) {
        let _this = this;
        _this.imageList = data.imgUrl;
        _this.failImgList.unshift(data.failParam);
      },
      uploadDoneInitFn(e){
        if (e.allFinish) {
          this.isExistUpLoadFail();
        }
      },
      beforeUploadFn(data) {
        let _this = this;
        _this.imageList = data.imgUrl;
        _this.failImgList.unshift(data.failParam);
      },

      uploadDoneFn(param) {},
      //失败重传图片
      upLoadReload(index) {
        let _this = this;
        if (!_this.reload) {
          _this.reload = true;     //禁止上传
          api.reloadFile({
            param: _this.failImgList[index],
            uploadBefor: (_data) => {
              _this.imageList[index].uploading = true;
              _this.imageList[index].fail = false;
              _this.imageList[index].finish = false;
              _this.$forceUpdate();
            },
            uploadDoneFn: _data => {
              _this.reload = false;
              if (_data.fail) {
                _this.imageList[index].uploading = false;
                _this.imageList[index].fail = true;
                _this.imageList[index].finish = true;
                _this.$forceUpdate();
              } else {
                _this.imageList[index].imgId = _data.imgId;
                _this.imageList[index].uploading = false;
                _this.imageList[index].fail = false;
                _this.imageList[index].finish = true;
                _this.$forceUpdate();
                _this.isExistUpLoadFail();
              }
            }
          });
        } else {
          //禁止上传toast
        }
      },
      //是否存在上传失败图片
      isExistUpLoadFail() {
        let _this = this, _failNum = 0;
        this.imageList.forEach((item, index) => {
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
      showBigImg(item, index, type) {
        let _imgArr = [];
        this.imageList.forEach((item, index) => {
          _imgArr.push(item.blob);
        });
        api.showBigImg({
          index: index,
          imgArr: _imgArr
        });
      },
      // 图片删除
      imgDelete(index) {
        this.deletePicTip = true;
        this.deletePic.index = index;
      },
      cancelDeletePic() {
        this.deletePic.index = "";
        this.deletePicTip = false;
      },
      ensureDeletePic() {
        let _deletePic = this.deletePic;
        this.imageList.splice(_deletePic.index, 1);
        this.imageCacheList.splice(_deletePic.index, 1);
        this.deletePicTip = false;
      },
      //组合数据提交咨询单
      goToAffirm() {
        let _failImgNum = 0;
        if (this.uploading) return false;
        this.imageList.forEach((element) => {
          if (element.fail) {
            _failImgNum++
          }
        });
        if (this.questionOneDes.length <= 0) {
          // this.showToast("请选择已选部位不适症状");
          this.noSlected=true;
          return false;
        } else if (this.delayTimeContent.length <= 0) {
          // this.showToast("请选择患病时长");
          this.noSlected=true;
          return false;
        } else if (this.patientMessage.needHelp.length <= 0) {
          // this.showToast("请填写想要医生提供的帮助");
          this.noSlected=true;
          return false;
        } else if (this.isShowImgEnter < 0) {
          // this.showToast("请选择有无病情片子");
          this.noSlected=true;
          return false;
        } else if (this.isShowImgEnter == 1 && this.imageList.length === 0) {
          this.showToast("请上传病情片子");
          return false;
        } else if(_failImgNum>0){
          // console.log(`存在失败图片${_failImgNum}张`)
          this.showToast(`${_failImgNum}张图片上传失败，\n点击重新上传后再次提交`);
        }else{
          this.noSlected=false;
          this.setLoadingState(true);
          let joinImageDataList = function(list) {
            let result = [];
            list.forEach((element) => {
              result.push(element.imgId);
            });
            return result.join(",");
          };
          let param = {
            visitSiteId: api.getSiteId(),
            customerId: localStorage.getItem("userId"),
            patientId: this.patientMessage.patientId,
            patientName: this.patientMessage.patientName,
            descriptionDisease: this.patientMessage.descriptionDisease == "暂不补充" ? "" : this.patientMessage.descriptionDisease,
            needHelp: this.patientMessage.needHelp,
            inspectionAttId: joinImageDataList(this.imageList) || "",
            caseType: this.scene == "findDoctor" ? "12" : "0",
            optionList: JSON.stringify([...this.questionOne, ...this.delayTimeSelect, ...this.questionTwo])
          };
          if (this.scene == "findDoctor") {
            //设置订单中咨询单信息
            this.setOrderMessage({
              medicalShow: {
                patientName: this.patientMessage.patientName,
                sex: this.patientMessage.sex,
                age: this.patientMessage.age,
                partName: this.patientMessage.partName,
                mainSymptom: this.questionOneDes,                                                 //主诉
                continueTime: this.delayTimeContent,                                              //患病时长
                treatment: this.questionTwoDes,                                                   //治疗情况
                illness: this.patientMessage.descriptionDisease,                                 //病情补充
                docHelp: this.patientMessage.needHelp,                                            //想要医生帮助
                imageList: this.imageList                                                        //图片资料
              },
              medicalCreate: param
            });
            this.setLoadingState(false);
            this.$emit("questionListCb", param);
          } else {
            createCase(param).then((res) => {
              this.setLoadingState(false);
              if (res.responseObject.responsePk !== 0) {
                //更新caseId
                this.setPatientMessage({
                  caseId: res.responseObject.responsePk,
                  descriptionDisease: "",
                  needHelp: ""
                });
                //暴露caseId和patientId
                this.$emit("questionListCb", {
                  "caseId": res.responseObject.responsePk,
                  "patientId": this.patientMessage.patientId
                });
              }
            });
          }
        }
      }
    },
    components: {
      confirm,
      NormalLoading,
      Toast,
      uploadPlugn,
      uploadPlugnInit
    },
    computed: {
      ...mapState(["imgList", "patientMessage", "questionOne", "questionOneDes", "questionTwo", "questionTwoDes", "questionDetail", "loading", "toastContent", "toastShow"]),
      needHelp() {
        if (this.patientMessage.needHelp.length > 0) {
          if (this.patientMessage.needHelp.length > 4) {
            return this.patientMessage.needHelp.substring(0, 4) + "...";
          } else {
            return this.patientMessage.needHelp;
          }
        } else {
          return "请填写";
        }
      },
      formatQuestionOneDes() {
        if (this.questionOneDes.length > 0) {
          if (this.questionOneDes.length > 6) {
            return this.questionOneDes.substring(0, 6) + "...";
          } else {
            return this.questionOneDes;
          }
        } else {
          return "请选择";
        }
      },
      questionDescSubFn() {
        return this.questionTwoDes.length > 0 ? (this.questionTwoDes.length > 6 ? this.questionTwoDes.substring(0, 6) + "..." : this.questionTwoDes) : "请选择";
      },
      descriptionDisease() {
        if (this.patientMessage.descriptionDisease.length > 0) {
          if (this.patientMessage.descriptionDisease.length > 6) {
            return this.patientMessage.descriptionDisease.substring(0, 6) + "...";
          } else {
            return this.patientMessage.descriptionDisease;
          }
        } else {
          return "请补充";
        }
      }
    },
    watch: {
      "patientMessage.partId": {
        handler: function(val, oldval) {
          this.getQuestionList();
          this.setQuestionOneDes("");
          this.setQuestionOne([]);
          this.setQuestionTwoDes("");
          this.setQuestionTwo([]);
          this.delayTimeContent = "";
          this.delayTimeSelect = [];
          this.isShowImgEnter = -1;
          this.imageList = [];
          this.failImgList = [];
          this.setPatientMessage({
            descriptionDisease: "",
            needHelp: ""
          });
        },
        deep: true
      },

    }
  };
</script>

<style lang="scss" rel="stylesheet/scss">
  .question-list {
    padding-top: 10px;
    padding-bottom: 40px;
    .question-partName {
      padding: 50px 0;
      font-weight: bold;
      font-size: 40px;
      color: #222222;
      text-indent: 40px;
    }
  }

  .question-list-item {
    padding: 40px;
    font-size: 34px;
    @include ellipsis();
    @include clearfix();
    .question-list-item-title {
      display: block;
      color: #222222;
      float: left;
      .question-list-item-tip{
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:#999;
        line-height:30px;
        display: inline;
        margin-left: 12px;
      }
    }
    .question-list-item-content {
      color: #aaaaaa;
      overflow: hidden;
      text-align: right;
      position: relative;
      padding-right: 20px;
      &.no-arrowIcon {
        padding-right: 0;
      }
      .selected {
        font-size: 34px;
        color: #222222;
        font-weight: bold;
      }
      .no-selected{
        color: #FC746A;
      }
    }
    .question-list-hasPic {
      @include clearfix();
      padding: 40px;
      .question-hasPic {
        display: inline-block;
        width: 96px;
        height: 50px;
        font-size: 26px;
        color: #222222;
        background: #F0F1F5;
        border-radius: 8px;
        text-align: center;
        line-height: 50px;
        &.actived {
          color: #FFFFFF;
          background: #2EA9FE;
        }
        &.no-selected{
          color: #FC746A;
        }
      }
      .question-noPic {
        display: inline-block;
        width: 96px;
        height: 50px;
        font-size: 26px;
        color: #222222;
        background: #F0F1F5;
        border-radius: 8px;
        text-align: center;
        line-height: 50px;
        margin-left: 20px;
        &.no-selected{
          color: #FC746A;
        }
        &.actived {
          color: #FFFFFF;
          background: #2EA9FE;
        }
      }
    }
    &.uploadPic {
      padding: 0;
      .question-list-image {
        opacity: 0.8;
        background: #f2f4f7;
        padding: 56px 86px;
        .question-loadTitle {
          font-size: 32px;
          .loadTitle-l {
            display: inline-block;
            color: #666666;
            padding-left: 32px;
            position: relative;
            &::before {
              display: inline-block;
              content: '';
              position: absolute;
              width: 16px;
              height: 16px;
              background: #00C9BE;
              border-radius: 50%;
              left: 0;
              top: 50%;
              margin-top: -8px;
            }
          }
          .loadTitle-r {
            display: inline-block;
            color: #00C9BE;
            position: relative;
            &::after {
              position: absolute;
              display: inline-block;
              content: '';
              width: 26px;
              height: 30px;
              background: url("https://m.allinmed.cn/static/image/img00/findDoctor/arrow_list.png") no-repeat;
              background-size: 100% 100%;
              right: -26px;
              top: 50%;
              margin-top: -15px;
            }
          }
        }
        .question-list-image-list {
          .question-list-image-item {
            margin-top: 44px;
            .question-image-addBtn {
              width: 578px;
              height: 152px;
              background: #FFFFFF;
              border: 2px dotted #979797;
              position: relative;
              .question-image-btnBox {
                @include clearfix();
                .question-image-btnIcon {
                  display: block;
                  width: 60px;
                  height: 60px;
                  background: url("https://m.allinmed.cn/static/image/img00/findDoctor/ad_ph.png") no-repeat;
                  background-size: 100% 100%;
                  margin: 48px 18px 44px 30px;
                  float: left;
                }
                .question-image-btnText {
                  display: block;
                  font-size: 32px;
                  color: #222222;
                  line-height: 152px;
                  float: left;
                }
              }
              .propClass {
                // display: none;
                opacity: 0;
                width: 100%;
                height: 100%;
              }
              .inputBoxClass {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
              }
            }
          }
          .qu-upLoadItemBox-s {
            @include clearfix();
            padding-left: 26px;
            //每个上传图片缩略图
            .qu-upLoadItemList-s {
              position: relative;
              width: 136px;
              height: 136px;
              float: left;

              margin-right: 30px;
              margin-top: 30px;
              img {
                position: relative;
                width: 100%;
                height: 100%;
              }
              .qu-upLoadCover-s {
                position: absolute;
                display: inline-block;
                top: 0;
                left: 0;
                width: 136px;
                height: 136px;
                background-color: #545454;
                opacity: 0.63;
                z-index: 0;
              }
              .qu-upLoadDel-s {
                display: none;
                position: absolute;
                width: 60px;
                height: 60px;
                top: 0;
                right: 0;
                background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat;
                background-position: top right;
                background-size: 38px 38px;
                z-index: 1;
              }
              .qu-upLoading-s {
                position: absolute;
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                margin-top: -20px;
                margin-left: -20px;
                background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_loading@2x.png") no-repeat center;
                background-size: 100% 100%;
                animation: submitIng 1s linear infinite;
                -webkit-animation: submitIng 1s linear infinite;

              }
              .qu-upLoadAfresh-s {
                color: #ffffff;
                position: absolute;
                width: 40px;
                height: 40px;
                top: 50%;
                left: 50%;
                margin-top: -20px;
                margin-left: -20px;
                background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_refresh_loading@2x.png") no-repeat center;
                background-size: 100% 100%;
              }
              .qu-upLoadAfreshText-s {
                font-size: 24px;
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -17px;
                margin-left: -76px;
                color: #ffffff;
                width: 152px;
                text-align: center;
                z-index: 1;
              }
              .qu-fileUpRefresh-s {
                position: absolute;
                display: inline-block;
                top: 0;
                left: 0;
                width: 136px;
                height: 136px;
                //margin-top:8px;
                //margin-left:8px;
                z-index: 2;
              }
            }
            //原始样式
            .tc-upLoadItemList {
              width: 136px;
              height: 136px;
              float: left;
              display: inline-block;
              position: relative;
              vertical-align: top;
              margin-top: 30px;
              margin-right: 25px;
              border: 1px solid #2fc5bd;

              & > img {
                width: 100%;
                height: 100%;
                vertical-align: top;
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
                .upLoad-failText {
                  font-size: 24px;
                  color: #ffffff !important;
                  text-align: center;
                  position: absolute;
                  top: 35%;
                  width: 100%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                }
                .upLoad-reloadText {
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

            .tc-upLoadDel {
              position: absolute;
              width: 60px;
              height: 60px;
              top: 0;
              right: 0;
              background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat;
              background-position: top right;
              background-size: 38px 38px;
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
            .tc-upLoadItemList {
              position: relative;
              float: left;
              .ev-loading {
                position: absolute;
                opacity: 0.83;
                background: #545454;
                .middle-tip-modal {
                  position: absolute;
                }
              }
            }
            //上传按钮
            .ev-upLoadAdd {
              box-sizing: border-box;
              width: 136px;
              height: 136px;
              float: left;
              text-align: center;
              position: relative;
              display: inline-block;
              vertical-align: top;
              margin-top: 30px;
              background: url("https://m.allinmed.cn/static/image/img00/findDoctor/uploadEnter.png") center;
              background-size: contain;
            }
          }
          //上传初始化input
          .ev-upLoadInput {
            position: absolute;
            opacity: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
          .upLoadContentNum {
            padding: 40px 0 0 26px;
            font-size: 28px;
            color: #666666;
            .upLoadViewAll {
              color: #2EA9FE;
            }
          }
        }
        .question-list-image-hide {
          margin-top: 24px;
          font-size: 26px;
          color: #909090;
          .question-hide-l {
            display: inline-block;
            color: #666666;
            position: relative;
            padding-left: 32px;
            &::before {
              display: inline-block;
              content: '';
              position: absolute;
              width: 16px;
              height: 16px;
              background: #00C9BE;
              border-radius: 50%;
              left: 0;
              top: 50%;
              margin-top: -8px;
            }
          }
          .question-hide-r {
            display: inline-block;
            color: #00C9BE;
            position: relative;
            &::after {
              display: inline-block;
              content: '';
              width: 26px;
              height: 30px;
              background: url("https://m.allinmed.cn/static/image/img00/findDoctor/arrow_list.png") no-repeat;
              background-size: 100% 100%;
              vertical-align: -4px;
            }
          }
        }
      }
    }
  }

  .question-slide {
    background: #e2e2e2;
    height: 1px;
    width: 670px;
    margin: 0 auto;
  }

  .question-slideL {
    background: #f2f4f7;
    height: 20px;
    width: 100%;
    margin: 0 auto;
  }

  .submit-btn {
    font-size: 36px;
    color: #FFFFFF;
    width: 520px;
    height: 96px;
    border-radius: 100px;
    text-align: center;
    line-height: 96px;
    margin: 60px auto 76px;
    background:#00b9ad;
  }

  .no-border-top {
    border-top: 0;
  }
</style>
