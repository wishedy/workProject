<template>
  <section class="articleLists">
    <figure class="articleItem" v-for="(item,index) in healthLists" @click="goToInfo(item,index)" :key="index">
      <!-- <figcaption class="articleItemLeft" v-if="item.educationContentType!=2&&item.educationContentType!=0&&item.imgUrl&&item.imgUrl.length>0">
        <img :src="item.imgUrl" alt="" class="showImg">
        <img src="https://m.allinmed.cn/static/image/img00/healthKnowledge/play_big.png" alt="" class="videoPlay" v-if="item.educationContentType == 1">
        <span class="videoTimes" v-if="item.educationContentType == 1">{{item.videoTimes}}</span>
      </figcaption>
      <article :class="{noShowImg:item.educationContentType==2 || !item.imgUrl}">
        <span class="articalIcon" v-if="item.educationContentType==0"></span>
        <h3 class="articleTitle" :class="{isArtical:item.educationContentType==0}">{{item.educationName}}</h3>
        <section class="audioBox" v-if="item.educationContentType==2">
          <img class="audioPlayIcon" src="https://m.allinmed.cn/static/image/img00/healthKnowledge/play_voice.png">
          <span class="audioPlayWire"></span>
          <span class="audioPlayTime">{{item.playTime?item.playTime.substring(3):""}}</span>
          <audio :src="item.attUrl" :dataIndex="index"></audio>
        </section>
        <section class="articleIntro" v-if="item.educationContentType!=0">
          <div class="typeAndSource">
            <span class="articleType">{{item.typeName}}</span>
            <span class="articleSource">{{item.fullName.length>6?item.fullName + '...':item.fullName}}</span>
          </div>
        </section>
      </article> -->
      <article class="noShowImg" >
        <span class="articalIcon"></span>
        <h3 class="articleTitle isArtical">{{item.educationName}}</h3>
      </article>
      <section class="recommendDoctor" v-if="index==2&&from=='home'&&doctorLists.length>0">
        <div class="doctorBorder"></div>
        <h3>医生推荐</h3>
        <swiper :options="swiperDoctorOption" ref="mySwiper">
          <swiper-slide v-for="(item,iIndex) in doctorLists" :key="item.customerId">
            <figure class="doctorInfo">
              <figcaption><img :src="item.logoUrl" alt=""></figcaption>
              <span
                class="doctorName">{{item.fullName.length>4?item.fullName.substring(0,4) + '...':item.fullName}}</span>
              <span class="doctorTitle">{{item.medicalTitle}}</span>
              <span class="doctorAddress">{{item.hospitalName.length>6?item.hospitalName.substring(0,6) + '...':item.hospitalName}}</span>
            </figure>
          </swiper-slide>
        </swiper>
      </section>
    </figure>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import getPagesParam from "common/js/getPagesParam/getPagesParam";

  export default {
    data() {
      return {
        swiperDoctorOption: {
          notNextTick: true,
          setWrapperSize: true,
          mousewheelControl: true,
          observeParents: true,
          slidesPerView: "auto",
          freeMode: true
        },
        newDate:[],
        innerAudioContext:null
      }
    },
    methods: {
      audioPlayStop(item) {
        console.log(this.innerAudioContext)
        if(this.innerAudioContext){
          console.log(this.innerAudioContext.paused)
          if(this.innerAudioContext.paused){
            this.innerAudioContext.play();
            item.playState = 1;
            this.$forceUpdate();
          }else{
            console.log("+++++++++++++++")
            this.innerAudioContext.stop();
            console.log("---------")
            item.playState = 0;
            this.$forceUpdate();
          }
        }else{
          this.innerAudioContext = wx.createInnerAudioContext();
          this.innerAudioContext.src = item.attUrl;
          this.innerAudioContext.play();
          item.playState = 1;
          this.$forceUpdate();
        }
      },
      getTypeName(obj) {
        switch (parseInt(obj.educationContentType)) {
          case 0:
          case 3:
            return "文章";
            break;
          case 1:
            return "视频";
            break;
          case 2:
            return "语音";
            break;
          case 4:
            return "综合";
            break;
        }
      },
      goToInfo(obj, index) {
        this.$emit("clickCallback", {
          item: obj,
          index
        });
        api.ajax({
          url: api.httpEnv() + "/mcall/cms/patienteducation/v1/update/",
          method: "POST",
          data: {
            educationId: obj.educationId,
            isBrowse: 1
          },
          done(res) {
          }
        });
        let url = "";
        if(this.from=="doctorMain"){
          let pagesParam= getPagesParam.getPageInfo('healthKnowledgeDetail');
          let webUrl=obj.webStoragePath+'?educationId='+obj.educationId;
          if(pagesParam.hasName){//有相同的
            wx.setStorageSync('knowledgeDetailUrl', webUrl);
            wx.navigateBack({
              delta: pagesParam.backNum
            });
            return;
          }else {//没有相同的历史
            url = `${obj.webStoragePath}?refCustomerId=${obj.refCustomerId}&educationId=${obj.educationId}&from=doctorMain`;
          }
          // url = `${obj.webStoragePath}?refCustomerId=${obj.refCustomerId}&educationId=${obj.educationId}&from=doctorMain`;
        }else{
          url = `${obj.webStoragePath}?refCustomerId=${obj.refCustomerId}&educationId=${obj.educationId}`;
        }
        wx.navigateTo({
          url: `/pages/healthKnowledgeDetail/healthKnowledgeDetail?url=${encodeURIComponent(url)}`
        });
      }
    },
    mounted(){
      this.healthLists.forEach((element) => {
//        if(element.educationContentType == 2){
//          element.playState = 0;
//        }
        element.typeName = this.getTypeName(element);
      });
    },
    props: {
      healthLists: {
        type: Array,
        required: true
      },
      doctorLists: {
        type: Array,
        default: function () {
          return []
        }
      },
      from: {
        type: String,
        default: "home"
      }
    },
    watch:{
//      healthLists(newVal,oldVal){
//        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//        this.newDate = newVal;
//        this.newDate.forEach((element) => {
//          if(element.educationContentType == 2){
//            element.playState = 0;
//          }
//          element.typeName = this.getTypeName(element);
//        });
//      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .articleItem {
    padding: 38px 0;
    @include clearfix();
    border-bottom: 1px solid #eeeeee;
    &:last-child {
      border-bottom: 0;
    }
    article {
      margin-right: 240px;
      &.noShowImg {
        margin-right: 0;
      }
      .articalIcon{
        display: inline-block;
        float: left;
        margin-top: 2px;
        width: 36px;
        height: 34px;
        background: url("https://m.allinmed.cn/static/image/mp/index/1.1.2/article_profile.png") no-repeat center;
        background-size: 100% 100%;
      }
      .articleTitle {
        line-height: 42px;
        font-size: 34px;
        color: #333333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        &.isArtical{
          padding-left: 12px;
        }
      }
      .audioBox {
        width: 100%;
        height: 100px;
        white-space: nowrap;
        line-height: 100px;
        margin-top: 20px;
        background: #F2F4F7;
        border-radius: 4px;
        .audioPlayIcon {
          display: inline-block;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          margin-left: 40px;
        }
        .audioPlayWire {
          display: inline-block;
          width: 420px;
          height: 4px;
          background: #DADDE4;
          vertical-align: middle;
          margin: 0 35px;
        }
        .audioPlayTime {
          display: inline-block;
          font-size: 30px;
          color: #29A3A3;
          vertical-align: middle;
        }
      }
      .articleIntro {
        font-size: 26px;
        color: #888888;
        margin-top: 12px;
        @include clearfix();
        .typeAndSource {
          float: left;
          .articleType {
            margin-right: 20px;
          }
        }
        .societyIllness {
          float: right;
          font-size: 24px;
          color: #778291;
          background: #ECF4F3;
          border-radius: 4px;
          padding: 10px 14px;
          margin-top: -9px;
        }
      }
    }
    .articleItemLeft {
      float: right;
      width: 210px;
      height: 140px;
      border-radius: 4px;
      position: relative;
      .showImg {
        display: block;
        width: 100%;
        height: 100%;
        content: normal !important;
      }
      .videoPlay {
        display: block;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .videoTimes {
        display: block;
        font-size: 20px;
        color: #FFFFFF;
        position: absolute;
        right: 8px;
        bottom: 8px;
      }
    }
    .recommendDoctor {
      margin-right: -30px;
      .doctorBorder {
        width: 690px;
        height: 1px;
        background: #eeeeee;
      }
      h3 {
        padding-top: 30px;
        font-size: 30px;
        color: #222222;
        &:before {
          display: inline-block;
          content: "";
          width: 30px;
          height: 30px;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/label_recommend.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: middle;
          margin-right: 8px;
          margin-top: -4px;
        }
      }
      .doctorInfo {
        width: 264px;
        height: 326px;
        background: #FFFFFF;
        border-radius: 8px;
        figcaption {
          margin: 0 auto;
          padding-top: 40px;
          width: 112px;
          height: 112px;
          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .doctorName {
          display: block;
          font-weight: bold;
          font-size: 32px;
          color: #000000;
          margin-top: 16px;
          text-align: center;
        }
        .doctorTitle {
          opacity: 0.45;
          display: block;
          font-size: 24px;
          color: #25324D;
          margin-top: 12px;
          text-align: center;
        }
        .doctorAddress {
          display: block;
          margin-top: 24px;
          font-size: 26px;
          color: #25324D;
          opacity: 0.7;
          text-align: center;
        }
      }
      .swiper-container {
        margin-left: -10px;
      }
      .swiper-wrapper {
        margin: 30px 0 20px 0;
      }
      .swiper-slide {
        width: 264px;
        margin: 0 12px;
        box-shadow: 0 6px 20px 0 rgba(200, 206, 217, 0.45);
        border-radius: 8px;
      }
    }
  }
</style>
