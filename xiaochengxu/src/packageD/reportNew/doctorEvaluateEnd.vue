<!--完成医生评价-->
<template>
  <div>
    <section class="stars-title">
      <span>
        <img src="//m.allinmed.cn/static/image/mp/index/1.2.0/name_select.png" alt="">您已完成评价
      </span>
    </section>
    <div class="stars-con">
      <section class="patient-comment-stars">
        <figure class="patient-comment-stars-item" :class="{'active':commentInfo.serviceStar>=1}"></figure>
        <figure class="patient-comment-stars-item" :class="{'active':commentInfo.serviceStar>=2}"></figure>
        <figure class="patient-comment-stars-item" :class="{'active':commentInfo.serviceStar>=3}"></figure>
        <figure class="patient-comment-stars-item" :class="{'active':commentInfo.serviceStar>=4}"></figure>
        <figure class="patient-comment-stars-item" :class="{'active':commentInfo.serviceStar>=5}"></figure>
      </section>
    </div>
    <section class="patient-comment-tag-list">
      <article class="patient-comment-tag-item active" :key="index" v-for="(item,index) in commentInfo.tagList">
        {{item.tagName}}
      </article>
    </section>
    <section class="comment-text" v-if="commentInfo.thoughts&&commentInfo.thoughts.length>0">
      {{commentInfo.thoughts}}
    </section>
    <!-- 专家文章 -->
    <section class="doc-listComm doc-healthContent" v-if="recommendLists&&recommendLists.length>0">
      <section class="doc-listTitle">
        查看{{commentInfo.doctorName}}医生的专家文章，了解相关疾病
      </section>
      <healthItem from="doctorMain" :healthLists="recommendListsLess"></healthItem>
    </section>
    <!-- 底部栏 -->
    <div class="share-box">
      <div class="share">
        <form action="" @submit="formSubmit" report-submit="true">
          <button class="shareBtn" open-type="share" formType="submit" @click="trackShareCallback">
            <img src="https://m.allinmed.cn/static/image/mp/index/1.2.0/wechat.png" alt="">
            分享
          </button>
        </form>
      </div>
      <button class="go-doctor-home" @click="goDoctorHome">
        去{{shareDoctorName}}医生主页看看
      </button>
    </div>
    <!-- loading -->
    <logo-loading v-if="loading"></logo-loading>
    <BlackList></BlackList>
  </div>
</template>
<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import miniLogin from "common/js/miniUtil/miniLogin";
  import ensureConfirm from "components/ensure";
  import storage from "localStorage";
  import dataLog from "common/js/dataLog/dataLog";
  import logoLoading from 'components/LogoLoading';
  import starTags from "../../common/js/doctorEvaluate/doctorEvaluateStarTags";
  import sendFormId from "common/js/HttpRequest/sendFormId";
  import getRecommendList from "../../common/js/HttpRequest/getEducationList";  //健康知识信息 api
  import BlackList from "components/BlackList";
  import healthItem from "../../components/healthKnowComponents/healthItem";    //健康知识组件
  const XHRList = {
    getConsultation: api.httpEnv() + '/mcall/tocure/patient/score/getByConsultId/',  // 获取评价内容
    getDoctorGuide: api.httpEnv() + '/mcall/cms/patienteducation/v1/getDoctorGuide/', // 获取专家指南列表
  };
  export default {
    name: "doctorEvaluateEnd",
    data() {
      return {
        loading: false,
        params: {
          // 推荐患教参数
          recommendParam: {
            firstResult: 0,
            maxResult: 10,
            refCustomerId: '',
            isValid: 1,
            status: 1,
            sortType: 8,
            educationContentTypeNotIn:"5",
          }
        },
        pageNum:0,             //分页计数
        noMoreData:false,  //无更多数据
        isLoadMore:false,       //是否加载更多数据
        commentInfo: {        // 评价信息
          consultationId: "",
          createTime: "",
          doctorId: "",
          doctorName: "",
          isSecret: "",
          patientCustomerId: "",
          patientName: "",
          recommendStar: "",
          serviceStar: "",
          status: "",
          tagList: [],
          thoughts: "",
        },
        selectedTags: [],
        recommendListsLess: [],    //健康知识
        recommendLists:[],         //健康知识对象
      }
    },
    computed:{
      //分享医生主页超4个字截取
      shareDoctorName(){
        if(this.commentInfo.doctorName&&this.commentInfo.doctorName.length>4){
          return this.commentInfo.doctorName.substr(0,4) + "..."
        }else{
          return this.commentInfo.doctorName;
        }
      }
    },
    components:{
      healthItem,
      logoLoading,
      BlackList
    },
    onLoad(options) {
      this.consultationId = options.consultationId;
    },
    onShow() {
       this.pageNum = 0;
       this.noMoreData = false;
       this.recommendListsLess = [];
       this.init();

      dataLog.enterBrowse({})
    },
    onHide() {
      dataLog.leaveBrowse();
    },
    onReachBottom(){
      let _this = this;
      if (!_this.noMoreData&&_this.isLoadMore) {
        _this.isLoadMore = false;
        _this.getRecommendListFn()    //加载专家文章分页数据
      }
    },
    methods: {
      init() {
        this.getConsultationInfo();
      },
      formSubmit(e) {
        sendFormId(e.target.formId);
      },
      /** 获取健康知识 */
      getRecommendListFn() {
        let _this = this;
        _this.loading++;
        _this.params.recommendParam.refCustomerIdSetIn = _this.doctorId;
        _this.params.recommendParam.firstResult = _this.pageNum*_this.params.recommendParam.maxResult;
        getRecommendList(_this.params.recommendParam).then(res => {
          _this.loading--;
          _this.isLoadMore = true;
          _this.pageNum++;     //分页计数加一
          if (
            res &&
            res.responseObject.responseData &&
            res.responseObject.responseData.dataList
          ) {
            _this.recommendLists = res.responseObject.responseData.dataList;
            if(_this.recommendLists&&_this.recommendLists.length>0){
              _this.recommendLists.forEach(element => {
                _this.recommendListsLess.push(element)
              });
            }
          }else{
            //无更多数据
            _this.noMoreData = true;
          }
        }).catch(err=>{
          console.log(err)
          _this.loading--;
          _this.isLoadMore = true;
        });
      },
      // 获取评价信息
      getConsultationInfo() {
        let _this = this;
        _this.loading++;
        api.ajax({
          url: XHRList.getConsultation,
          method: "POST",
          data: {
            consultationId: this.consultationId,
          },
          done(res) {
            _this.loading--;
            if (res && res.responseObject.responseData) {
              _this.commentInfo = res.responseObject.responseData;
              _this.doctorId = _this.commentInfo.doctorId;                    //   1462341980375  _this.commentInfo.doctorId
              _this.getRecommendListFn();
              wx.setNavigationBarTitle({
                title: _this.commentInfo.doctorName + '医生评价'
              });
            }
          }
        }, "loading")
      },
      trackShareCallback(obj){
        let doctorId = this.commentInfo.doctorId;
        dataLog.createTrack({ // 点击分享
          actionId: 14221,
          browseType:144,
          pushMessageId:JSON.stringify({doctorId:doctorId})
        });
      },
      goDoctorHome(){
        let _this = this;
        let doctorId = this.commentInfo.doctorId;
        dataLog.createTrack({ // 点击“去医生主页看看”
          actionId: 14222,
          browseType:144,
          pushMessageId:JSON.stringify({doctorId:doctorId})
        });
        wx.navigateTo({
          url:`/pages/doctorMain/doctorMain?doctorCustomerId=${doctorId}&from=doctorEvaluate`
        })
      }
    },
    onShareAppMessage () {
      wx.pageScrollTo({
        scrollTop:  0,
        duration: 100
      });
      // dataLog.createTrack({
      //   actionId: 14206
      // });
      let path = "";
      if(this.doctorId){
        path = `/pages/mIndex/mIndex?from=shareFriend&consultationId=${this.consultationId}&path=/packageD/reportNew/doctorEvaluateEnd`;
      }
      return {
        title:this.commentInfo.doctorName + "评价",
        path: path,
      }
    }
  }
</script>
<style scoped lang="scss">
  .stars-title {
    text-align: center;
    margin-top: 50px;
    span{
      display: inline-block;
      position: relative;
      padding-left: 68px;
      font-size: 46px;
      font-weight: bold;
      img{
        width:48px;
        height:48px;
        position: absolute;
        top: 50%;
        margin-top: -24px;
        left: 0;
      }
      color: #222222;
    }
  }

  .stars-con {

    .patient-comment-stars {
      text-align: center;
      font-size: 0;
      margin-top: 30px;
      margin-bottom: 40px;
      margin-left:auto;
      margin-right:auto;
      clear: both;
      /*padding-bottom: 44px;*/
      .patient-comment-stars-item {
        background: url("http://m.allinmed.cn/static/image/mp/index/1.2.0/star_unselect.png") no-repeat center center;
        width: 76px;
        height: 76px;
        background-size: contain;
        display: inline-block;
        vertical-align: middle;
        margin: 0 8px;
        transition: all 0.2s linear;
        &.first {
          margin-left: 0;
        }
        &.last {
          margin-right: 0;
        }
        &.active {
          background: url("http://m.allinmed.cn/static/image/mp/index/1.2.0/star_select.png") no-repeat center center;
          background-size: contain;
        }
      }
    }
  }

  .patient-comment-tag-list {
    // margin-top: 48px;
    text-align: center;
    box-sizing: border-box;
    // margin-left:30px;
    // margin-right:30px;
    margin:30px 30px 26px 30px;
    clear:both;
    .patient-comment-tag-plus {
      border-radius: 8px;
      background: #FFFFFF;
      border: 0.5px solid #aaaaaa;
      box-sizing: border-box;
      width: 68px;
      height: 68px;
      line-height: 68px;
      color: #808080;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      margin-bottom: 24px;
      &:before {
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      & > img {
        width: 28px;
        height: 28px;
        vertical-align: middle;
      }
    }
    .patient-comment-tag-item {
      border-radius: 8px;
      background: #FFFFFF;
      box-sizing: border-box;
      padding: 0 24px;
      height: 68px;
      line-height: 68px;
      font-size: 30px;
      color: #666666;
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      margin-right: 20px;
      margin-bottom: 24px;
      &.active {
        // font-weight: bold;
        background: #00B9AD;
        color: #FFFFFF;
      }
    }
  }

  // 列表统一样式
  .doc-listComm {
    padding: 65px 40px 100px 54px;
    clear:both;
    .doc-listTitle {
      font-size: 36px;
      color: #000000;
      font-weight: bold;
      position: relative;
      margin-bottom: 10px;
      &::before {
        position: absolute;
        content: "";
        width: 6px;
        height: 30px;
        background: #2EA9FE;
        border-radius: 66px;
        left: -18px;
        top: 24px;
        margin-top: -12px;
      }
      .doc-infoMore {
        font-size: 28px;
        color: #2EA9FE;
        float: right;
        font-weight: normal;
        background: #ffffff;
        padding-right: 0;
        line-height: 48px;
        &::after {
          border: none;
        }
      }
    }
    .doc-listContent {
      font-size: 30px;
      color: #333333;
      margin-bottom: 60px;
      &.doc-listContent-tag{
        margin-bottom: 52px;
      }
      //   善治疾病
      .doc-goodTips {
        display: inline-block;
        font-size: 30px;
        color: #666666;
        padding: 6px 20px;
        background: rgba(216, 227, 227, 0.35);
        border-radius: 8px;
        margin-right: 20px;
        margin-top: 20px;
      }
      //评价
      .doc-evaluateTitle {
        position: relative;
        img {
          width: 64px;
          height: 64px;
          border-radius: 100%;
          position: absolute;
        }
        .doc-evalUserName {
          padding-left: 88px;
          padding-top: 12px;
          font-weight:600;
        }
      }
      .doc-evaluateContent {
        margin-top: 40px;
        background: #F2F2F2;
        border-radius:0 8px 8px 8px;
        padding: 30px 28px 30px 18px;
        position: relative;
        .doc-evaluate-tag{
          font-size:32px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(51,51,51,1);
          line-height:48px;
        }
        .doc-evaluate-text{
          font-size:30px;
          font-family:PingFangSC-Regular;
          font-weight:400;
          color:rgba(85,85,85,1);
          line-height:44px;
          &.doc-evaluate-top{
            margin-top: 21px;
          }
        }
        .circle{
          position: absolute;
          top: -10px;
          left: 0;
          display: inline-block;
          width: 30px;
          height: 12px;
          // background: url("../../../static/image/circle.png") no-repeat center;
          background: url("https://m.allinmed.cn/static/image/mp/consult/circle.png") no-repeat center;
          background-size: 100% 100%;
        }
        .showMoreBtn{
          display: inline-block;
          width: 32px;
          height: 28px;
          background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/lower-arrow.png") no-repeat center;
          background-size: 100% 100%;
          position: absolute;
          right: 36px;
          bottom: 30px;
          &.closeBtn{
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/upper-arrow.png") no-repeat center;
            background-size: 100% 100%;
          }
        }
      }
      //健康知识
      .doc-healthList-item {
        .doc-healthItem-title {
          font-size: 30px;
          color: #333333;
          margin-bottom: 24px;
        }
        .doc-healthItem-box {
          font-size: 26px;
          color: #888888;
          .doc-healthItem-type {
            margin-right: 20px;
          }
        }
      }
      .doc-health-line {
        width: 100%;
        height: 2px;
        background: #EEEEEE;
        margin: 44px 0;
      }
    }
    &.doc-goodAt{
      .doc-listTitle{
        margin-bottom: 12px
      }
      .doc-listContent{
        margin-bottom: 0
      }
    }
    &.doc-practice{
      padding-right: 30px;
      .doc-listTitle{
        margin-bottom: 26px
      }
      .doc-listContent{
        margin-bottom: 4px;
        line-height:1.6
      }
    }
    &.allSuggestion{
      padding-left: 36px;
      .more-reputation{
        text-align: center;
        margin: auto;
        margin-bottom: 80px;
        width:160px;
        height:28px;
        font-size:30px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(7,182,172,1);
        line-height:40px;
      }
      .doc-listTitle{
        padding-left: 18px;
        &::before {
          left: 0;
        }
      }
    }
    &.doc-healthContent{
      padding-left: 36px;
      .doc-listTitle{
        padding-left: 18px;
        &::before {
          left: 0;
        }
      }
    }
    &.doc-guide{
      padding-left: 40px;
      padding-bottom: 60px;
      .doc-listTitle{
        padding-left: 18px;
        &::before {
          left: 0;
        }
      }
      .doc-guide-list{
        .doc-guide-item{
          display: flex;
          align-items: center;
          .doc-guide-left{
            width: 148px;
            height: 136px;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/notebookDefault.png") no-repeat center;
            background-size: 100% 100%;
            .node-img{
              width: 136px;
              height: 136px;
            }
          }
          .doc-guide-middle{
            flex: 1;
            margin: 0 24px;
            .guide-title{
              max-height: 96px;
              font-size:34px;
              font-weight:500;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              color:rgba(51,51,51,1);
            }
            .guide-content{
              margin-top: 10px;
              font-size:26px;
              font-weight:400;
              color:rgba(153,153,153,1);
            }
          }
          .doc-guide-right{
            width: 28px;
            height: 28px;
            background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/arrow_right.png") no-repeat center;
            background-size: 100% 100%;
          }
          + .doc-guide-item {
            margin-top: 40px;
          }
        }
      }
    }
  }

  .comment-text{
    clear:both;
    background: #F2F2F2;
    border-radius:8px;
    padding:20px 28px;
    margin:0 30px;
    color: #555555;
    font-size: 30px;
  }


  //健康知识
  .doc-healthList-item {
    .doc-healthItem-title {
      font-size: 30px;
      color: #333333;
      margin-bottom: 24px;
    }
    .doc-healthItem-box {
      font-size: 26px;
      color: #888888;
      .doc-healthItem-type {
        margin-right: 20px;
      }
    }
  }
  .doc-health-line {
    width: 100%;
    height: 2px;
    background: #EEEEEE;
    margin: 44px 0;
  }


  .share-box{
    position:fixed;
    bottom:0;
    left:0;
    z-index:1000;
    width: 100%;
    height: 98px;
    display:flex;
    box-shadow:0px -3px 11px 0px rgba(0,0,0,0.1);
    .share{
      width: 43.2%;
      background: #ffffff;
      color: #506C85;
      line-height: 98px;
      text-align: center;
      .shareBtn{
        background-color: #FFFFFF;
        border-radius: 0;
        line-height: 98px;
      }
      img{
        width: 48px;
        height: 48px;
        line-height: 98px;
        vertical-align: middle;
        margin-top: -5px;
      }
    }
    .go-doctor-home{
      background: #00B9AD;
      width: 56.8%;
      font-size:30px;
      line-height: 98px;
      text-align: center;
      color: #ffffff;
      border-radius: 0;
    }
  }
</style>
