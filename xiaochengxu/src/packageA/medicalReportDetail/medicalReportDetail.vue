<template>
  <section class="main-inner medical-report-detail">
    <section class="tc-caseContentBox">
      <section class="tc-baseInfo">
        <ul class="tc-baseInfoList">
          <li class="tc-baseInfoItem">
            <div class="tc-baseInfoItemLeft">
              <img :src="logoUrl" alt="">
            </div>
            <div class="tc-baseInfoItemRight">
              <article class="sexAgeBox">
                <span class="tc-baseInfoName">{{formatName}}</span>
                <span class="tc-baseInfoSex"> {{patientCasemap.sexName}}</span>
                <span class="tc-baseInfoAge">{{patientCasemap.age}}  岁</span>
              </article>
              <div class="inquiryTimeBox">咨询日期:{{caseTime}}</div>
            </div>
          </li>
        </ul>
        <section class="recommendUserMainBox">
          <div class="recommendUserMainLeft">主诉</div>
          <div class="recommendUserMainRight">{{patientCasemap.caseMain.caseMain}}</div>
        </section>
      </section>
      <section class="tc-caseDescribe tc-module">
        <section class="tc-caseDescribeTitle title"><h3>详情</h3>
        </section>
        <ul class="tc-caseDescribeList">
          <li class="tc-caseDescribeItem" v-if="caseType == 15">
            <span class="tc-caseDescribeItemLeft">美年体检</span>
            <span class="tc-caseDescribeItemRight tc-noRevice mei-nian" @click="goHealthReport()">查看美年体检报告</span>
          </li>
          <li class="tc-caseDescribeItem" v-if="resultMainList[1] && resultMainList[1].symptomOptions[0] && resultMainList[1].symptomOptions[0].optionName">
            <span class="tc-caseDescribeItemLeft">持续时间</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{resultMainList[1].symptomOptions[0].optionName}}</span>
          </li>
          <li class="tc-caseDescribeItem" v-if="VASGrade.length">
            <span class="tc-caseDescribeItemLeft">VAS评分</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{VASGrade}}</span>
          </li>
          <li class="tc-caseDescribeItem" v-if="illnessDis.length && caseType != 15">
            <span class="tc-caseDescribeItemLeft">病情补充</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{illnessDis}}</span>
          </li>
          <li class="tc-caseDescribeItem">
            <span class="tc-caseDescribeItemLeft">想获得的帮助</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{getHelp}}</span>
          </li>
        </ul>
      </section>
      <section class="tc-caseDescribe tc-module">
        <section class="tc-caseDescribeTitle title"><h3>诊治情况</h3></section>
        <ul class="tc-caseDescribeList">
          <!--<li class="tc-caseDescribeItem" v-if="patientCasemap.caseType != 12 && patientCasemap.caseType != 13">-->
          <!--<span class="tc-caseDescribeItemLeft">曾就诊医院</span>-->
          <!--<span class="tc-caseDescribeItemRight tc-noRevice">{{treatmentName}}</span>-->
          <!--</li>-->
          <!--<li class="tc-caseDescribeItem" v-if="patientCasemap.caseType != 12 && patientCasemap.caseType != 13">-->
          <!--<span class="tc-caseDescribeItemLeft">确诊疾病</span>-->
          <!--<span class="tc-caseDescribeItemRight tc-noRevice">{{illnessName}}</span>-->
          <!--</li>-->
          <li class="tc-caseDescribeItem">
            <span class="tc-caseDescribeItemLeft">检查资料</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{imageList1.length===0?(isUpload===1?"暂不上传片子":"未拍片子"):"&nbsp&nbsp"}}</span>
            <ul class="uploadListsBox" v-if="imageList1.length!==0">
              <li v-for="(item,index) in imageList1" :key="index" @click="showBigImg(index)" v-show="item.isShow">
                <img :src="item.caseAttUrl">
                <span class="moreImg"
                      v-if="imageList1.length>9&&index == 8&&showMoreImg">更多{{imageList1.length - 9}}张</span>
              </li>
            </ul>
          </li>
          <!--<li class="tc-caseDescribeItem" v-if="patientCasemap.caseType != 12 && patientCasemap.caseType != 13">-->
          <!--<span class="tc-caseDescribeItemLeft">在用药物</span>-->
          <!--<span class="tc-caseDescribeItemRight tc-noRevice">{{takeMedicine}}</span>-->
          <!--</li>-->
          <li class="tc-caseDescribeItem" v-if="treatmentList.length>0 && (patientCasemap.caseType == 12 || patientCasemap.caseType == 13)">
            <span class="tc-caseDescribeItemLeft">治疗情况</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{all_find}}</span>
          </li>
          <section v-for="(item,index) in treatmentList" :key="index" v-if="treatmentList.length>0 && (patientCasemap.caseType == 12 || patientCasemap.caseType == 13)">
            <li class="tc-caseDescribeItem" v-if="item.optionDesc.length>0">
              <span class="tc-caseDescribeItemLeft">{{item.commOptionDesc}}</span>
              <span class="tc-caseDescribeItemRight tc-noRevice">{{item.optionDesc}}</span>
            </li>
            <li class="tc-caseDescribeItem" v-if="item.commIsAttachment == 4">
              <span class="tc-caseDescribeItemLeft">手术时间</span>
              <span class="tc-caseDescribeItemRight tc-noRevice">{{item.optionRemark}}</span>
            </li>
          </section>
        </ul>
      </section>
      <section class="tc-caseDescribe tc-module">
        <section class="tc-caseDescribeTitle title">
          <h3>基本信息</h3>
        </section>
        <ul class="tc-caseDescribeList">
          <li class="tc-caseDescribeItem">
            <span class="tc-caseDescribeItemLeft">手机号码</span>
            <span class="tc-caseDescribeItemRight tc-noRevice">{{patientCasemap.mobile}}</span>
          </li>
        </ul>
      </section>
    </section>
    <BackIndex v-if="backIndexShow"></BackIndex>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by qiangkailiang on 2017/8/21.
   */
  import api from "common/js/util/util";
  import BackIndex from "components/backIndex"; // 返回首页组件

  import getMedicalReportDetails from "common/js/HttpRequest/getMedicalReportDetails"; // 获取咨询单详情


  const XHRList = {
    getInquiryPage: '/mcall/customer/patient/case/v1/getMapById/',           //咨询单
  };
  export default {
    data() {
      return {
        caseId:'',
        finish: false,
        patientCasemap: {
          patientName: "",
          caseMain: "",
          attachmentList: "",
          height:0,
          weight:0,
          bmi:0,
        },
        caseType:'', // 病例类型 15-美年大健康
        physicalNo:'', // 美年大健康的体检报告ID
        showMoreImg: true,
        logoUrl: "",
        remarkContent: "",
        illnessTime: "",
        caseTime: "",
        heavyTime: "",
        treatmentName: "",
        illnessName: "",
        illnessDis: "",
        takeMedicine: "",
        getHelp: "",
        resultMainList: [],
        isUpload:-1,
        imageList1: [],
        urlArray:[],
        acheType: "",//疼痛类型
        VASGrade: '',//VAS评分
        treatmentList:[],
        all_find:"",
        backIndexShow: false, // 返回首页是否显示
        certificateCode:'', // 患者身份证号；
      }
    },
    onLoad() {
      if (wx.getStorageSync("backIndex")) {
        this.backIndexShow = true;
      } else {
        this.backIndexShow = false;
      }
      this.caseId = this.$root.$mp.query.caseId;
      this.imageList1 = [];
      this.isUpload = -1;
      this.urlArray = [];
      this.all_find = '';
      this.getMedicalReport();
    },
    computed: {
      formatName() {
        console.log(this.patientCasemap.patientName)

        if (this.patientCasemap.patientName.length > 5) {
          return this.patientCasemap.patientName.substring(0, 5) + "...";
        } else {
          return this.patientCasemap.patientName
        }
      }
    },
    components:{
      BackIndex
    },
    methods: {
      getMedicalReport() {
        const that = this;
        that.finish = true;
        getMedicalReportDetails({
          caseId: this.caseId,
          attUseFlag: 1,
          isOrder: 0,
        }).then( (data) => {
          that.finish = false;
          if (data.responseObject && data.responseObject.responseData) {
            let _data = data.responseObject.responseData.dataList[0];
            that.patientCasemap = _data.patientCasemap;
            that.resultMainList = _data.resultMainList;
            that.getLogoUrl();
            let caseTime = that.patientCasemap.caseTime.split(' ')[0];
            that.caseTime = caseTime.split('-')[0] + '年' + caseTime.split('-')[1] + '月' + caseTime.split('-')[2] + '日';
            that.getHelp = that.patientCasemap.needHelp || "未填写";
            that.treatmentName = that.patientCasemap.treatmentName || "未填写";
            that.illnessName = that.patientCasemap.illnessName || "未填写";
            that.illnessDis = that.patientCasemap.descriptionDisease;
            that.takeMedicine = that.patientCasemap.takeMedicine || "未填写";
            that.caseType = that.patientCasemap.caseType;
            that.physicalNo = that.patientCasemap.physicalNo; // 美年大健康的体检报告ID
            that.certificateCode = that.patientCasemap.certificateCode
            console.log(that.isUpload)
            that.isUpload = that.patientCasemap.isUpload
            that.patientCasemap.attachmentList.forEach((element, index) => {
              that.imageList1.push({
                caseAttUrl: element.caseAttUrl,
                isShow: (index >= 9 ? false : true)
              });
              that.urlArray.push(element.caseAttUrl);
            });
            //找医生来的
            that.treatmentList = _data.treatmentList;
            that.treatmentList.forEach((element)=>{
              that.all_find += element.commOptionName + "，";
              if(element.commIsAttachment == 4){
                element.optionRemark = element.optionRemark.split('-')[0] + '年' + element.optionRemark.split('-')[1] + '月' + element.optionRemark.split('-')[2] + '日';
              }
            });
            that.all_find = that.all_find.substring(0,that.all_find.length - 1);
            if (that.resultMainList[0].symptomOptions[0].refQuestionList.length) {
              if(that.patientCasemap.caseType == 12 || that.patientCasemap.caseType == 13){
                that.acheType = "";
                if(that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName.indexOf('疼痛')!==-1){
                  that.VASGrade = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName + that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionDesc;//VAS评分
                }
              }else{
                that.acheType = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName;
                if(that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName.indexOf('疼痛')!==-1){
                  that.VASGrade = that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionName + that.resultMainList[0].symptomOptions[0].refQuestionList[0].symptomOptions[0].optionDesc;//VAS评分
                }
              }
            }
            that.illnessTime = ((that.resultMainList[1].symptomOptions[0].optionDesc && that.resultMainList[1].symptomOptions[0].optionDesc.length > 0) ? that.resultMainList[1].symptomOptions[0].optionDesc : that.resultMainList[1].symptomOptions[0].optionName) || "未填写";
            that.heavyTime = ((that.resultMainList[2].symptomOptions[0].optionDesc && that.resultMainList[2].symptomOptions[0].optionDesc.length > 0) ? that.resultMainList[2].symptomOptions[0].optionDesc : that.resultMainList[2].symptomOptions[0].optionName) || "未填写";
          }
        });
      },
      showBigImg(index) {
        let that = this;
        let arrTemp = [];
        that.imageList1.map((item, index) => {
          arrTemp.push(item.caseAttUrl);
        });
        wx.previewImage({
          current:arrTemp[index], // 当前显示图片的http链接
          urls: arrTemp // 需要预览的图片http链接列表
        })
      },
      getLogoUrl() {
        console.log(this.patientCasemap.sexName)
        let sex = this.patientCasemap.sexName,
          age = parseInt(this.patientCasemap.age),
          img = "";
        if (age <= 12) {
          img = 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_child@2x.png';
        } else if (age > 12 && age <= 59) {
          img = (sex === "男" ? 'https://m.allinmed.cn/static/image/img00/myServices/chatting_chatting_man@2x.png' : 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_woman@2x.png');
        } else if (age >= 60) {
          img = (sex === "男" ? 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_man@2x.png' : 'https://m.allinmed.cn/static/image/img00/myServices/chatting_portrait_old_woman@2x.png');
        }
        this.logoUrl = img;
      },
      goHealthReport() {
        wx.navigateTo({
          url: `/packageA/meinian/healthReport?from=medical&patientName=${this.patientCasemap.patientName}&certificateCode=${this.certificateCode}&physicalNo=${this.physicalNo}`
        });
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">


  .main-inner {
    //基本信息以下模块样式
    &.medical-report-detail {
      overflow: auto;
    }
    .tc-caseContentBox {
      background: #E6E6ED;
      padding: 30px;
      .tc-baseInfo {
        margin-bottom: 16px;
        border-radius: 16px;
        background: #ffffff;
        .tc-baseInfoList {
          padding-top: 40px;
          /*background: url("/static/image/img00/myServices/interrogation_bg.png") no-repeat;*/
          background-size: 100%;
          border-bottom: 2px solid #F8F8F8;
        }
        .tc-baseInfoItem {
          padding-bottom: 50px;
          @include clearfix();
          &:first-child {
            padding-bottom: 60px;
          }
          .tc-baseInfoItemLeft {
            width: 170px;
            padding-left: 32px;
            font-size:34px;
            float: left;
            color: #AAA;
            img {
              display: block;
              width: 120px;
              height: 120px;
              margin: 0 auto;
              box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.05);
              border-radius: 50%;
            }
          }
          .tc-baseInfoItemRight {
            margin-left: 230px;
            margin-right: 30px;
            color: #222222;
            font-size:36px;
            .sexAgeBox {
              padding-top: 20px;
              .tc-baseInfoName {
                font-size:40px;
                margin-right: 28px;
                font-weight: bold;
              }
              .tc-baseInfoSex {
                margin-right: 32px;
              }
            }
            .inquiryTimeBox {
              margin-top: 20px;
              font-size:32px;
              color: #AAAAAA;
            }
            span {
              display: inline-block;
            }
            .tc-baseInfoDate {
              display: block;
              font-size:26px;
              line-height: 26px;
              color: #909090;
              margin-top: 16px;
            }
            .tc-goCase {
              font-size:28px;
              position: absolute;
              right: 70px;
              top: 46px;
              color: #78849C;
              line-height: 28px;
              &::after {
                display: inline-block;
                content: "";
                width: 12px;
                height: 20px;
                position: absolute;
                top: 50%;
                margin-top: -14px;
                right: -27px;
                background: url("https://m.allinmed.cn/static/image/img00/patientConsult/arrow_right.png") no-repeat center;
                background-size: 100% 100%;
              }
            }
          }
        }
      }
      .basicData {
        padding: 50px 30px 0;
        font-size: 0;
        li {

          display: inline-block;
          vertical-align: middle;
          margin-right: 15px;
          i {
            vertical-align: middle;
          }
          &:last-child {
            margin-right: 0;
          }
          .basicDataName {
            margin-right: 32px;
            color: #AAAAAA;
            font-size:34px;
            vertical-align: middle;
          }
          .basicDataInfo {
            color: #444444;
            vertical-align: middle;
            font-size:36px;
          }
        }
      }
      .recommendUserMainBox {
        @include clearfix();
        padding: 60px 30px 50px;
        .recommendUserMainLeft {
          float: left;
          width: 68px;
          line-height: 52px;
          color: #AAAAAA;
          white-space:nowrap;
          /*margin-right: 30px;*/
          font-size:34px;
        }
        .recommendUserMainRight {
          line-height: 52px;
          color: #444444;
          font-size:36px;
          margin-left: 98px;
          word-break: break-all;
        }
      }
      .tc-module {
        margin-bottom: 16px;
        border-radius: 16px;
        background-color: #ffffff;
        .title {
          padding: 40px 0 40px 30px;
          border-bottom: 1px solid #F8F8F8;
          h3 {
            color: #666666;
            font-size:36px;
            &:before {
              display: inline-block;
              content: '';
              width: 4px;
              height: 24px;
              margin-right: 10px;
              background: #4CD3C6;
              /*vertical-align: middle;*/
              margin-top: -(4px);
              border-radius: 999px;
            }
          }
        }
        .tc-recommendRightComm {
          font-size:28px;
          position: absolute;
          right: 0;
          top: 0;
          display: block;
          width: 200px;
          text-align: right;
          color: #9798A6;
          padding-right: 24px;
          &:after {
            position: absolute;
            content: '';
            top: 50%;
            right: 0;
            margin-top: -8px;
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url("https://m.allinmed.cn/static/image/img00/recoveryReport/suggestion_enter@2x.png");
            background-size: 100% 100%;
            vertical-align: middle;
          }
        }
        .tc-caseDescribeList {
          .tc-caseDescribeItem {
            @include clearfix();
            padding: 40px 0;
            .tc-caseDescribeItemLeft {
              float: left;
              width: 170px;
              font-size:34px;
              color: #AAAAAA;
              padding-left: 32px;
            }
            .tc-caseDescribeItemRight {
              word-wrap: break-word;
              word-break: break-all;
              position: relative;
              display: block;
              margin-left: 230px;
              margin-right: 30px;
              font-size:36px;
              color: #444444;
              &:after {
                display: inline-block;
                position: absolute;
                content: '';
                width: 20px;
                height: 20px;
                background: url("https://m.allinmed.cn/static/image/img00/recoveryReport/suggestion_enter@2x.png");
                background-size: 100% 100%;
                right: 0;
                top: 50%;
                margin-top: -8px;
              }
            }
            .tc-noRevice {
              &:after {
                display: none;
              }
            }
            .mei-nian{
              color: #00B9AD;
            }
          }
        }
        .tc-caseOtherBox {
          position: relative;
        }
        .text-num-tips {
          position: absolute;
          right: 60px;
          bottom: 0;
          color: #0ab375;
          font-size:24px;
        }
        //输入框 备注
        .tc-caseDesOther {
          width: 100%;
          height: 340px;
          padding: 60px 32px;
          box-sizing: border-box;
          border-style: none;
          border-bottom: 1px solid #F4F4F4;
          font-size:36px;
          @include placeholder() {
            color: #aaaaaa;
          }
        }
      }
      .tc-comment {
        padding-bottom: 60px;
      }
      .submit_symptom_box {
        padding: 70px 0 100px;
        .submit_symptom {
          display: block;
          width: 560px;
          line-height: 100px;
          text-align: center;
          color: #FFF;
          background: #00d6c6;
          margin: 0 auto;
          border-radius: 100px;
          font-size:36px
        }
      }
      //上传图片
      .imgList-box {
        padding: 50px 0 0 32px;
      }

      .tc-upLoadItemList {
        width: 180px;
        height: 180px;
        display: inline-block;
        position: relative;
        vertical-align: top;
        margin: 0 20px 20px 0;

        & > img {
          display: block;
          width: 100%;
          height: 100%;
        }
      }

      .ev-upLoadInput {
        opacity: 0;
        width: 100%;
        height: 100%;
      }

      .ev-upLoadAdd {
        width: 180px;
        height: 180px;
        text-align: center;
        position: relative;
        display: inline-block;
        vertical-align: top;
        margin: 0 20px 20px 0;
        //padding:8px;
        background: url("https://m.allinmed.cn/static/image/img00/consult_V1.2/addto@2x.png") center;
        background-size: contain;
        //span{
        //  display: block;
        //  width: 136px;
        //  height: 136px;
        //  background: url("/image/img00/patientConsult/addto@2x.png");
        //  background-size: 100% 100%;
        //
        //}
      }

      .tc-upLoadDel {
        position: absolute;
        width: 0.8rem;
        height: 0.8rem;
        top: 0;
        right: 0;
        background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_photo_delete@2x.png") no-repeat top right;
        background-size: 0.50667rem 0.50667rem;
        z-index: 1;
      }

      .tc-upLoadItemList {
        position: relative;

        .ev-loading {
          position: absolute;
          opacity: 0.83;
          background: #545454;
          .middle-tip-modal {
            position: absolute;
          }
        }
      }

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
          font-size:24px;
          color: #FFFFFF !important;
          text-align: center;
          position: absolute;
          top: 50%;
          width: 100%;
          left: 50%;
          transform: translate(-50%, -50%)

        }
      }
    }
  }

  .au-main {
    min-height: 100%;
    height: auto;
    //position: relative;
    box-sizing: border-box;
    padding-bottom: 184px;
    .au-infoBox {
      //第六题样式
      .au-cureHisList {
        padding-top: 52px;
        li li {
          margin-top: 72px;
        }
        .au-cureHisItem {
          .au-cureHisItemTop {
            color: #222222;
            font-size:32px;
            line-height: 1;
            padding: 0 48px;
          }
          .au-cureHisItemBottom {
            padding: 0 48px;
            @include clearfix();
            font-size: 0;
            span {
              //box-sizing: border-box;
              border: 1px solid #BDBDBD;
              border-radius: 100px;
              display: table;
              float: left;
              margin-right: 18px;
              margin-top: 32px;
              font-size:28px;
              color: #808080;
              padding: 10px 22px;
              line-height: 1;
              &.selected {
                color: #5BD7CF;
                border: 1px solid #5BD7CF;
                background: #E4FDFC;
              }
            }
          }
          .au-cureHisItemInfo {
            display: none;
            width: 100%;
            height: 284px;
            box-sizing: border-box;
            margin-top: 46px;
            background-color: #F9FBFB;
            padding: 40px 48px;
            textarea {
              width: 100%;
              height: 100%;
              border: none;
              text-align: justify;
              font-size:30px;
              color: #222;
              line-height: 1.5;
              background-color: #F9FBFB;
            }
          }
        }
      }

      //第七题样式
      .au-perfectInfoList {
        padding-top: 52px;
        .au-perfectInfoItem {
          padding: 0 48px;
          display: table;
          height: 120px;
          font-size:30px;
          .au-perfectInfoItemLeft {
            display: table-cell;
            width: 248px;
            color: #222;
            vertical-align: top;

          }
          .au-perfectInfoItemRight {
            display: table-cell;
            width: 405px;
            color: #CCCCCC;
            position: relative;
            .fontGray {
              color: #ccc;
            }
            .ev-change-city {
              color: #222;
              &:after {
                display: inline-block;
                position: absolute;
                content: '';
                width: 0.26667rem;
                height: 0.26667rem;
                background: url("https://m.allinmed.cn/static/image/img00/recoveryReport/suggestion_enter@2x.png");
                background-size: 100% 100%;
                right: 0;
                top: 10%;
              }
            }
            &.hasSelect {
              span.show {
                position: absolute;
                z-index: 1;
                &.selected {
                  color: #555555;
                }
              }
              select {
                position: absolute;
                z-index: 2;
                opacity: 0;
                display: block;
                height: 50%;
                width: 100%;
              }
            }
          }
          .au-perfectInfoItemBottom {
            margin-top: 38px;
            margin-bottom: 50px;
            background-color: #F9FBFB;
            width: 654px;
            height: 276px;
            box-sizing: border-box;
            padding: 40px;
            textarea {
              display: block;
              height: 100%;
              background-color: #F9FBFB;
            }
          }
          input, textarea, span {
            border: none;
            display: block;
            width: 100%;
          }
        }
      }
    }
  }

  .symptom-desc-title {

    color: #222;
    font-size:34px;
    padding: 0 48px;
    //line-height: 1;
    & > h4 {
      font-weight: normal;
    }
    .num {
      padding-right: 8px;
      em {
        color: #00bedf;
        font-style: normal;
      }
    }
    .tips {
      color: #7f858e;
      font-size:30px;
    }
  }

  .symptom-desc-item {
    &.multiple-choices {
      margin: 40px 0;
      box-sizing: border-box;
    }
    &.single-choices {
      margin: 40px 0;
      box-sizing: border-box;
    }
    .icon-select {
      margin-right: 24px;
    }
    &.selected.multiple-choices {
      & > p {
        .icon-select {
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_square_sel@2x.png") no-repeat center;
          background-size: contain;
        }
        .icon-arrow {
          display: block;
        }
      }

    }
    &.selected.single-choices {
      & > p {
        .icon-select {
          background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_circle_sel@2x.png") no-repeat center;
          background-size: contain;
        }
        .icon-arrow {
          display: block;
        }
      }
    }
    &.selected .symptom-desc-second-form {

      display: block;
    }
    & > p {
      color: #555;
      padding-left: 84px;
      font-size:30px;
      @include clearfix();
      .icon-arrow {
        float: right;
        background: url("https://m.allinmed.cn/static/image/img00/patientConsult/symptom_pack up@2x.png") no-repeat;
        @include square(28px);
        display: none;
      }
      & > span {
        vertical-align: text-top;
        display: inline-block;
        width: 81%;
        word-break: break-all;
      }
    }
    &.selected > p {
      color: #63C7BF;
    }

  }

  .uploadListsBox {
    @include clearfix();
    padding: 50px 0 0 32px;
    li {
      float: left;
      list-style: none;
      margin: 0 20px 20px 0;
      position: relative;
      img {
        display: block;
        width: 180px;
        height: 180px;
      }
      .moreImg {
        display: block;
        padding: 45px 52px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        left: 0;
        top: 0;
        color: #FFFFFF;
        text-align: center;
        font-size:30px;
        box-sizing: border-box;
      }
    }
  }

  //选择列表弹层
  #ev-choiceList {
    display: block;
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 1;
    margin-top: 0;
    background: #fff;
  }

  section.symptom-list {
    padding-bottom: 0;
  }

  .symptom-desc-controller .disabled {
    background: #ccc;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */
  {
    opacity: 0;
  }
</style>
