<template>
  <section class="journalMain">
    <!--<button class="main-inner" v-for="(item,index) in journalData" :key="index" open-type="getUserInfo"-->
            <!--@getuserinfo="settingCheck" @click="journalInfo = item ;journalIndex=index">-->
      <!--<section class="header">-->
        <!--<figure class="inner-avator">-->
          <!--<img :src="item.authorLogoUrl">-->
        <!--</figure>-->
        <!--<span class="inner-name">{{item.authorName}}</span>-->
      <!--</section>-->
      <!--<p class="desc">-->
        <!--{{item.diaryName}}</p>-->
      <!--<figure class="video-img-box" v-if="(item.diaryContentType==1||(item.diaryContentType==4&&item.isExistVideo==1))&&item.diaryAttachmentList.length>0" >-->
        <!--<img :src="item.diaryAttachmentList[0].diaryAttachmentUrl"-->
             <!--class="videoImg" mode="aspectFit">-->
        <!--<img class="playButton"-->
             <!--src="https://m.allinmed.cn/static/image/mp/index/vedion.png"-->
             <!--v-if="(item.diaryContentType==1||(item.diaryContentType==4&&item.isExistVideo==1))&&item.diaryAttachmentList.length>0">-->
        <!--<div class="playTime">{{item.diaryAttachmentList[0].playTime}}</div>-->
      <!--</figure>-->


      <!--<img :src="item.diaryAttachmentList[0].diaryAttachmentUrl"-->
           <!--class="special" v-if="item.diaryContentType!=1&&item.diaryAttachmentList.length==1&&item.isExistVideo==0" mode="widthFix">-->
      <!--<img v-for="(item1,index1) in item.diaryAttachmentList" :src="item1.diaryAttachmentUrl"-->
           <!--class="imgList" v-if="item.diaryContentType!=1&&item.diaryAttachmentList.length!=1&&item.isExistVideo==0" :key="index1" mode="widthFix">-->
      <!--<div class="inner-footer">-->
        <!--<span class="inner-title" v-if="item.operationNameList"># {{item.operationNameList}}</span>-->
        <!--<span class="inner-review">{{item.browseNum==0?"":item.browseNum}}浏览</span>-->
      <!--</div>-->
    <!--</button>-->
    <button class="main-inner" open-type="getUserInfo" v-for="(item,index) in journalData" :key="index"
            @getuserinfo="settingCheck" @click="journalInfo = item ;journalIndex=index">
      <ul class="journalTagList">
        <li class="journalTagItem">{{item.patientSex==1?'男':'女'}} {{item.patientAgeShow || ageArray[index]}}</li>
        <li class="journalTagItem" v-if="item.postoperativeTime > 0">术后{{item.postoperativeTime}}天</li>
        <!--<li class="journalTagItem" v-if='item.popularizeTag.length'>{{item.popularizeTag}}</li>-->
        <template v-if="item.popularizeTagList&&item.popularizeTagList.length">
          <li class="journalTagItem" v-for="(itemTwo, indexTwo) in item.popularizeTagList" :key="indexTwo">{{itemTwo}}</li>
        </template>
      </ul>
      <h3 class="journalItemTitle">{{item.diaryName}}</h3>
      <img class="journalCover" :src="item.diaryAttUrl" mode="aspectFill" alt="">
      <section class="journalBottom">
        <div class="doctorBox" v-if="item.fullName">
          <img class="doctorIcon" src="https://m1.allinmed.cn/static/image/mp/index/1.6.0/doctor-icon.png" alt="">
          <span class="doctorName">主刀：{{item.fullName}}</span>
          <span class="doctorTitle">{{item.medicalTitle}}</span>
        </div>
        <div class="give-like">
          <img src="https://m.allinmed.cn/static/image/mp/index/1.1.4/praise.png" alt="" class="like-icon">
          <span class="praiseNum">{{item.preferUpNum}}</span>
        </div>
      </section>
    </button>
  </section>
</template>
<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   * Created by YuxiYang on 2018/8/17.
   */
  import NormalLoading from "components/loading";

  export default {
    data() {
      return {
        errowShow: true,
        errMsg: "",
        jumpAvalible: true,
        journalInfo: [],
        journalIndex: -1,
        finish:false,
        ageArray:[], // 岁数的数组
      };
    },
    components: {
      NormalLoading
    },
    computed: {},
    props: {
      journalData: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    watch : {
      // journalData (newData, oldData) {
      //   // debugger;
      //   this.ageArray = [];
      //   for (let i = 0; i < newData.length; i++) {
      //     this.ageArray.push(this.getAge(newData[i].patientAge))
      //   }
      // },
      journalData: {
        handler(newData, oldData) {
          this.ageArray = [];
          for (let i = 0; i < newData.length; i++) {
            this.ageArray.push(this.getAge(newData[i].patientAge))
          }
        },
        deep: true
      },
    },
    methods: {
      getAge (num) {
        let firstNum = parseInt(num/10);
        let twoNum = num % 10;
        if (firstNum) {
          if (twoNum <= 5) {
            if(twoNum == 0) {
              if(firstNum == 1){
                return `${num}岁`
              } else {
                return `${firstNum-1}5岁以上`
              }
            }else{
              return `${firstNum}0岁以上`
            }
          } else {
            return `${firstNum}5岁以上`
          }
        } else {
          return `${twoNum}岁`
        }
      },
      settingCheck(e) {
        this.finish = true;
        wx.getNetworkType({
          success:(res) => {
            // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
            if(res.networkType == "none"){
              this.finish = false;
              wx.showToast({
                title: "网络信号差，请稍后再试",
                icon: 'none',
                duration: 2000
              })
            }else{
              if (this.jumpAvalible) {
                this.jumpAvalible = false;
                if (e.target.userInfo) {
                  this.finish = false;
                  this.$emit("FromChild", {from: "journal",desc: true,obj: this.journalInfo});
                  this.goJournalPage();
                } else {
                  this.finish = false;
                  this.$emit("FromChild", {from: "journal", desc: false, obj: this.journalInfo});
                }
              }
            }
          },
          fail:(err)=>{
            this.finish = false;
          }
        })
      },
      showChinese(item) {
        let itemValue = item.areasExpertise;
        if (itemValue != null && itemValue != "") {
          let reg = /[\u4e00-\u9fa5,]/g;
          let str = itemValue.match(reg).join("");
          let val = str.replace(/,/g, "、");
          return val;
        }
      },
      goJournalPage() {
        this.$emit("clickCallback", {
          item: this.journalInfo,
          index: this.journalIndex
        });
      }
    },
    onShow() {
      this.jumpAvalible = true;
    }
  };
</script>
<style lang="scss" scoped="">
  /*
  .main-inner {
    padding-left: 30px;
    padding-right:30px;
    line-height: normal;
    margin-top: 40px;
    text-align: left;
    border-bottom: 1px solid #EBEDF0;
    .header {
      line-height:40px;
      .inner-avator {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: inline-block;
        vertical-align: middle;
        & > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
        }
      }
      .inner-name {
        margin-left: 10px;
        font-size: 24px;
        color: #888888;
        display: inline-block;
        vertical-align: middle;
      }
    }
    .desc {
      font-size: 34px;
      color: #444444;;
      letter-spacing: 0;
      line-height: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
      margin-right: 30px;
      font-weight: 900;
      margin-top: 18px;
    }
    .imgList {
      width: 220px;
      height: 220px;
      margin-top: 18px;
      margin-right: 8px;
      border-radius: 4px
    }
    .special {
      margin-top: 18px;
      width: 414px;
      height: 414px;
      border-radius: 4px
    }
    .video-img-box{
      position: relative;
      background-color: #000000;
    }
    .videoImg {
      margin: 0 auto;
      margin-top: 18px;
      width:690px;
      height:390px;
      display: block;
      border-radius: 4px
    }
    .playButton {
      position: absolute;
      width: 100px;
      height: 100px;
      z-index: 3;
      left: 50%;
      top: 50%;
      margin-top: -50px;
      margin-left: -50px;
    }
    .playTime {
      position: absolute;
      font-size: 24px;
      color: white;
      letter-spacing: 0;
      line-height: 24px;
      right: 60px;
      bottom: 30px;
    }
    .inner-footer {
      padding-top: 40px;
      padding-bottom:40px;
      .inner-title {
        font-size: 24px;
        color: #AAAAAA;
        line-height: 24px;
        max-width: 200px;
        display: inline-block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: top;
      }
      .inner-review {
        float: right;
        font-size: 24px;
        color: #AAAAAA;
        line-height: 24px;
        margin-right: 23px;
      }
      .inner-comment {
        float: right;
        margin-left: 12px;
        font-size: 24px;
        color: #AAAAAA;
        line-height: 24px;
        margin-right: 30px;
      }
    }

  }
  */
  .journalMain{
    background:rgb(242,242,242);
    padding-bottom: 1px;
  }
  .main-inner {
    margin-bottom: 16px;
    padding: 44px 30px;
    border-radius: 0;
    text-align: left;
    line-height:1.2;
    &:first-child{
      padding-top: 24px;
    }
    .journalTagList{
      line-height: 40px;
      height: 40px;
      white-space:nowrap;
      color: #2EA9FE;
      /*overflow: hidden;*/
      @include clearfix();
      @include ellipsis();
      .journalTagItem{
        display: inline-block;
        background:rgba(46, 169, 254, 0.1);
        border-radius:2px;
        color: #2EA9FE;
        font-size:28px;
        padding: 0 12px;
        height: 40px;
        line-height: 40px;
        + .journalTagItem{
          margin-left: 20px;
        }
      }
    }
    .journalItemTitle{
      color:#333333;
      font-size: 40px;
      font-weight: bold;
      margin-top: 28px;
      overflow: hidden;
      line-height: 1.4;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }
    .journalCover{
      width: 100%;
      height: 320px;
      margin-top: 24px;
      border-radius: 6px;
    }
    .journalBottom{
      margin-top: 30px;
      @include clearfix();
      .doctorBox{
        float: left;
        display: flex;
        align-items:center;
        .doctorIcon{
          width: 38px;
          height: 48px;
          /*vertical-align: middle;*/
        }
        .doctorName{
          font-size:32px;
          font-weight:500;
          color:rgb(77,81,92);
          margin-left: 12px;
        }
        .doctorTitle{
          font-size:30px;
          color:rgb(120,126,143);
          margin-left: 10px;
        }
      }
      .give-like {
        float: right;
        display: flex;
        margin-top: 6px;
        .like-icon{
          width: 32px;
          height: 32px;
          /*vertical-align: 10px;*/
        }
        .praiseNum{
          font-size:28px;
          color:rgb(119,119,119);
          margin-left: 8px;
          margin-top: 2px;
        }
      }
    }
  }
</style>
