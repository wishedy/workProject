<template>
  <section>
    <section class="send-count-box">
      <article class="reportTipsBox">
        <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/congratulations.png" alt="" class="tipsImg">
        <p class="reportTipsText">您已经成功向{{targetMsg.nick}}医生报到，如有问题可以给医生留言。</p>
      </article>
    </section>
    <section class="report-details">
      <header class="report-details-head">
        <i class="icon-report">
          <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/report.png" alt="">
        </i>
        <p>报到信息</p>
      </header>
      <section class="report-details-content">
        <section class="patient-info-box">
          <article class="report-details-text-inline patientName">
            <span class="text patientName">{{userName}}</span>
            <span class="other">{{patientInfo.sexName}}</span>
            <span class="other">{{patientInfo.age}}岁</span>
          </article>
          <span class="patientType">{{patientType}}</span>
        </section>
        <section class="report-details-list">
          <template v-if="param.reportTypeNew && (param.reportTypeNew == 4 || param.reportTypeNew == 5)">
            <section class="report-details-item" v-for="(item,index) in param.reportList" :key="index">
              <article class="report-details-text">
                <h4 class="title">{{item.reportFieldName}}</h4>
                <article class="report-details-text-inline">
                  <p class="text">{{item.reportValue}}</p>
                </article>
              </article>
            </section>
          </template>
          <template v-else>
            <!--住院患者-->
            <template v-if="param.reportType==2">
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">住院时间</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.hospitalTime.length>0?param.hospitalTime:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">医生诊断</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.diagnosis.length>0?param.diagnosis:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">是否手术</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.isOperation.length>0?param.isOperation:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item" v-if="param.isOperation == '已手术'">
                <article class="report-details-text">
                  <h4 class="title">手术名称</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.operationName.length>0?param.operationName:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item" v-if="param.isOperation == '已手术'">
                <article class="report-details-text">
                  <h4 class="title">手术时间</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.operationTime.length>0?param.operationTime:"未填写"}}</p>
                  </article>
                </article>
              </section>
            </template>
            <!--门诊患者-->
            <template v-if="param.reportType==1">
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">就诊时间</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.clinicTime}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">医生诊断</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.clinicDiagnosis.length>0?param.clinicDiagnosis:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">治疗建议</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.treatmentRecommendations.length>0?param.treatmentRecommendations:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">报到目的</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.clinicPurpose.length>0?param.clinicPurpose:"未填写"}}</p>
                  </article>
                </article>
              </section>
            </template>
            <!--初次就诊-->
            <template v-if="param.reportType==3">
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">来源渠道</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.source.length>0?param.source:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">咨询目的</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.purpose.length>0?param.purpose:"未填写"}}</p>
                  </article>
                </article>
              </section>
              <section class="report-details-item">
                <article class="report-details-text">
                  <h4 class="title">病情描述</h4>
                  <article class="report-details-text-inline">
                    <p class="text">{{param.illnessDetail.length>0?param.illnessDetail:"未填写"}}</p>
                  </article>
                </article>
              </section>
            </template>
          </template>
          <!--新报到字段展示-->
          <!--<template v-if="(param.reportType == 1 || param.reportType == 2)">-->
            <!---->
          <!--</template>-->
        </section>
        <!--附件-->
        <section class="report-img-box">
          <h4 class="title">图片资料</h4>
          <!--<p class="text">{{imageNum}}</p>-->
          <section class="report-details-img-box" v-if="imageShow">
            <figure class="report-details-img-item" v-for="(item , index) in attList" v-if="index < 4"
                    :key="index" @click="showBigImg(item)">
              <img :src="item.caseAttUrl" alt="">
              <article class="report-details-img-big" v-if="index===3 && attList.length > 4">
                <figure>
                  <span>更多</span>
                  <span>{{imageNum}}</span>
                </figure>
              </article>
            </figure>
          </section>
          <!--<p class="text" v-else>未上传</p>-->
          <p class="report-img-text" v-else>您还未上传，<span @click="uploadShow()" class="report-img-upload">点击补充检查资料、药品图片</span>等</p>
        </section>
      </section>
    </section>
    <section class="main-message-box">
      <article class="main-message-box-item others-message">
        <figure class="main-message-img">
          <img :src="targetMsg.avatar" alt="">
        </figure>
        <figcaption class="main-message-content">
          <p>恭喜您报到成功，有问题可随时给我留言，上线后会尽快回复您。</p>
        </figcaption>
      </article>
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
   * Created by Hallmader on 2018/5/17.
   */

  import api from "common/js/util/util";
  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapMutations} = createNamespacedHelpers('imSceneDoctor');
 // /**************************Axios Http Requests*************************/
  import getReportDetails from "common/js/HttpRequest/getReportDetails";


  export default {
    name: "report-details",
    data() {
      return {
        param: {},
        imageList:[], // 处理过后查看大图需要的图片列表
        attList:[], // 用户上传的图片列表
        imageNum:'', // 显示话术
        imageShow:false, // 图片是否显示
        reportList:[], // 报到单数据；
      }
    },

    methods: {
      ...mapMutations(['setReportImageUpload']),
      clipImg(imgUrl) {
        if (imgUrl.indexOf("_c") != -1) {
          let beforeUrl = imgUrl.substring(0, imgUrl.indexOf("_c") + 2);
          let afterUrl = imgUrl.substring(imgUrl.lastIndexOf("."));
          return beforeUrl + afterUrl;
        } else {
          return imgUrl;
        }
      },
      showBigImg(item) {
        wx.previewImage({
          current: this.clipImg(item.caseAttUrl), // 当前显示图片的http链接
          urls: this.imageList // 需要预览的图片http链接列表
        })
      },
      getReportDetails() {
        const that = this;
        getReportDetails({
          reportId: that.param.reportId
        }).then(data => {
          if (data.responseObject.responseStatus) {
            if (data.responseObject.responseData && data.responseObject.responseData.data_list) {
              const dataList = data.responseObject.responseData.data_list;
              console.log(dataList);
              that.attList = dataList[0].attList;
            }
          }
        }).catch(err => {
          console.log(err);
        });
      },
      uploadShow () {
        // this.setReportImageUpload(true);
        console.log('上传图片')
        let _this=this;
        if(_this.textareaShow){
          wx.setStorageSync('reportUploadImg',true)
          wx.navigateTo({
            url:`/packageD/reportNew/reportUploadImg?reportId=${_this.param.reportId}`
          })
        }else {
          // 本次咨询已结束
          wx.showToast({
            title:'本次咨询已结束',
            icon:'none'
          });
        }

      }
    },
    mounted() {
      this.param = this.reportOrderMessage.data;
      wx.removeStorageSync('isUploadImg');//该缓存记录的是：是否进入补全信息页面并提交
      this.getReportDetails();
    },
    onShow(){
      console.log('ggggggggggggggggggggggggg')
      if(wx.getStorageSync('isUploadImg')){
        wx.removeStorageSync('isUploadImg');//该缓存记录的是：是否进入补全信息页面并提交
        this.getReportDetails();
      }
    },
    watch: {
      attList () {
        if (this.attList.length) {
          this.attList.forEach((element, index) => {
            this.imageList.push(this.clipImg(element.caseAttUrl));
            this.imageNum = "共"+this.attList.length+"张";
            this.imageShow = true;
          })
        } else {
          this.imageShow = false;
          this.imageNum = '未上传';
        }
      }
    },
    computed: {
      ...mapState(["logoUrl", "patientInfo", "targetMsg"]),
      userName() {
        if (this.param.patientName) {
          return api.getByteLen(this.param.patientName) > 12 ? api.getStrByteLen(this.param.patientName,10) + "..." : this.param.patientName;
        } else {
          return '';
        }
      },
      patientType() {
        //患者类型 1-住院患者；2-门诊患者；3-首次就诊患者 *
        let result = "";
        switch (parseInt(this.param.reportType)) {
          case 1:
          case 4:
            result = "门诊报到";
            break;
          case 2:
          case 5:
            result = "住院报到";
            break;
          case 3:
            result = "未就诊患者";
            break;
            break;
        }
        return result;
      }
    },
    props: {
      reportOrderMessage: {
        type: Object
      },
      reportId: {
        type: Number
      },
      targetMsg: {
        type: Object
      },
      textareaShow:{
        type:Boolean
      }
    }
  }
</script>

<style lang="scss">
  .report-details {
    margin: 50px 30px 0;
    background: #FFFFFF;
    border: 1px solid #BCEBE7;
    border-radius: 12px;
    border-top:0;
  }
  .reportTipsBox{
    width: 690px;
    padding: 14px 32px 14px 14px;
    margin: 0 auto;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    background:#EDEEEE;
    box-shadow:0px 2px 18px 0px rgba(226,226,226,0.5);
    border-radius:12px;
    // border:1px solid rgba(1,209,194,1);
    .tipsImg{
      width: 80px;
      height: 76px;
      margin-right: 14px;
    }
    .reportTipsText{
      font-size: 26px;
      color: #555555;
      text-align: left;
      flex: 1;
    }
  }

  .report-details-head {
    background:#00B9AD;
    height: 64px;
    line-height: 64px;
    padding: 0 34px;
    border-top-left-radius:12px;
    border-top-right-radius:12px;
    & > p {
      font-size: 28px;
      color: #ffffff;
      display: inline-block;
      vertical-align: middle;
    }
    .icon-report {
      width: 32px;
      height: 34px;
      display: inline-block;
      vertical-align: -19px;
      margin-right: 4px;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
  }

  .report-details-content {
    padding: 0 32px;
    position: relative;
    box-sizing: border-box;
    .patient-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40px 0 24px;
      .report-details-text-inline{
        color: #333333;
        font-size: 40px;
        font-weight:600;
        .other{
          margin-left: 28px;
        }
      }
      .patientType{
        background:#E5F8F6;
        border-radius:4px;
        color: #00B9AD;
        font-weight: 500;
        line-height: 48px;
        padding: 0 16px;
        font-size: 28px;
      }
    }
    .report-img-box {
      padding-top: 30px;
      padding-bottom: 46px;
      .title{
        font-size:32px;
        color:#555555;
        display:inline-block;
        /*margin-right:6px;*/
        width: 160px;
      }
      .report-img-text{
        font-size: 32px;
        font-weight: bold;
        color: #333333;
        margin-top: 24px;
        .report-img-upload{
          color: #00B9AD;
        }
      }
      .text{
        font-size: 32px;
        color: #222222;
        margin-right: 12px;
        display: inline-block;
        font-weight: bold;
        max-width: 440px;
        word-break: break-all;
        white-space: normal;
      }
    }
  }
  .report-details-list{
    border-top: 1px solid #E3E5E9;
    border-bottom: 1px solid #E3E5E9;
    padding: 26px 0;
  }
  .report-details-item {
    text-align: left;
    white-space: nowrap;
    position: relative;
    line-height:40px;
    + .report-details-item{
      margin-top: 20px;
    }
    .patientType {
      position: absolute;
      right: 0;
      top: -10px;
      font-size: 28px;
      color: #66BEB8;
      padding: 10px 16px;
      box-sizing: border-box;
      background: #EEFAF9;
    }
    .report-details-text {
      font-size: 0;
      .report-details-text-inline {
        display: inline-block;
        vertical-align: top;
        line-height: 46px;
        &.patientName{
          vertical-align: middle;
          line-height:32px;
        }
      }

      .title {
        line-height: 46px;
        &.patientName{
          vertical-align: middle;
          line-height:32px;
        }
        font-size: 32px;
        color: #555555;
        display: inline-block;
        vertical-align: top;
        /*margin-right: 6px;*/
        width: 160px;
      }
      .text {
        font-size: 32px;
        color: #333;
        margin-right: 12px;
        display: inline-block;
        vertical-align: middle;
        font-weight: bold;
        max-width: 440px;
        word-break: break-all;
        white-space: normal;
      }
      .other {
        font-size: 32px;
        display: inline-block;
        vertical-align: middle;
        color: #555555;
        margin-right: 14px;
      }
      .tag {
        opacity: 0.8;
        background: #F2F4F7;
        border-radius: 8px;
        padding: 12px 16px;
        font-size: 28px;
        color: #5a5a5a;
        display: inline-block;
        vertical-align: middle;
        margin-right: 16px;
      }
    }
  }

  .report-details-img-box {
    margin-top: 28px;
    font-size: 0;
    white-space: normal;
    .report-details-img-item {
      width: 148px;
      height: 148px;
      display: inline-block;
      vertical-align: middle;
      position: relative;
      border-radius: 6px;
      overflow: hidden;
      & + .report-details-img-item {
        margin-left: 10px;
      }
      .report-details-img-big {
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, .4);
        border-radius: 4px;

        &::before {
          content: '';
          display: inline-block;
          vertical-align: middle;
          height: 100%;

        }
        figure {
          display: inline-block;
          vertical-align: middle;
          span {
            font-size: 28px;
            color: #fff;
            display: block;
          }
        }
      }
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: top;
      }
    }
  }
</style>
