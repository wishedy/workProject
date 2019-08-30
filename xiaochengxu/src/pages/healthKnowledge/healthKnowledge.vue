<template>
  <section class="healthMain" :class="{fromDoc:!fromDocHomeShow}">
    <healthSearch v-if="searchFlag"></healthSearch>
    <article v-if="!searchFlag" style="height:100%;">
      <header class="headContent" :class="{fixed:headFixed}" v-if="false">
        <section class="searchBox" @click="toSearch" v-if="fromDocHomeShow">请输入关键词</section>
        <section class="healthBanner" :class="{'hide':!bannerShow}" v-if="fromDocHomeShow && bannerList.length>0">
          <swiper autoplay="true" interval="3000" duration="300">
            <block v-for="(item,index) in bannerList" :key="index">
              <swiper-item class="banner-slider">
                <a>
                  <img :src="item.adAttUrl" class="slide-image">
                </a>
              </swiper-item>
            </block>
          </swiper>
        </section>
        <ul class="fourTypes">
          <li @click="fourTypesIndex=-1;getMainList({educationContentType:''})" :class="{'on':fourTypesIndex == -1}">
            <i class="icon-all"></i>
            <span>全部</span>
          </li>
          <li v-for="(item,index) in educationTypeList" @click="fourTypesIndex=index;getMainList(item)" :key="index" :class="{'on':fourTypesIndex == index}">
            <i :class="item.titleIcon"></i>
            <span>{{item.titleName}}</span>
          </li>
        </ul>
      </header>
      <scroll-view @scroll="scrollTop" scroll-y style="height:100%;" @scrolltolower="scrolltoMore">
        <section class="mainContent" :class="{cancleTop:!fromDocHomeShow}">
          <healthItem :doctorLists="doctorList" :healthLists="mainList" from="home"></healthItem>
        </section>
        <!-- ~没有更多了~ -->
        <footer class="noMore" v-if="noMore">~没有更多了~</footer>
      </scroll-view>
    </article>
    <NormalLoading v-if="finish"></NormalLoading>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from "common/js/util/util";
  import healthItem from 'components/healthKnowComponents/healthItemList';
  import getEducationList from 'common/js/HttpRequest/getEducationList';
  import getDoctorRecommendList from "common/js/HttpRequest/getDoctorFilterList";
  import NormalLoading from 'components/loading';
  import healthSearch from "./healthSearch";
  import {mapState,mapMutations} from "vuex";
  let XHRList = {
    getBannerList: api.httpEnv() + "/mcall/ad/position/profile/getMapList/"
  };


  export default {
    data() {
      return {
        headFixed: false,
        bannerList: [],
        bannerShow: true,
        fromDocHomeShow: true,
        fourTypesIndex: -1,
        mainListParam: {
          educationContentType: "",
          firstResult: 0,
          maxResult: 20,
          isValid: 1,
          status: 1,
          sortType: 9
        },
        mainList: [],
        doctorRecommendParams: {
          firstResult: 0,
          maxResult: 3,
          logoUseFlag: 3,
          indexType: "customer",
          solrContent: "",  //搜索关键字
          searchSortType: 1,  //综合排序 1综合2从低到高
          areasExpertise: "",  //专业
          searchRegion: "",    //地区
          searchHospitalLevel: "",   //医院级别
          searchTitleLevel: ""   //职称级别
        },
        doctorList: [],
        educationTypeListParam: {
          groupType: 2,
          sortType: 6,
          firstResult: 0,
          maxResult: 999,
          isValid: 1,
          status: 1
        },
        educationTypeList: [],
        finish: false,
        noMore: false
      }
    },
    onLoad() {
      const query = this.$root.$mp.query;
      if (query.doctorCustomerId && query.doctorCustomerId.length > 0) {
        this.fromDocHomeShow = false;
        this.mainListParam = {
          educationContentType: "",
          firstResult: 0,
          maxResult: 20,
          refCustomerIdSetIn: query.doctorCustomerId,
          educationContentTypeNotIn:"5",
          isValid: 1,
          status: 1,
          sortType: 8
        };
      }
      wx.setNavigationBarTitle({
        title: `专家文章`
      })
    },
    onShow() {
      this.finish=true;
      this.noMore = false;
      this.mainListParam.firstResult = 0;
      this.scrollTop();
      this.getBannerList();
      this.getEducationType();
    },
    methods: {
      ...mapMutations(["setSearchFlag"]),
      getBannerList() {
        const that = this;
        api.ajax({
          url: XHRList.getBannerList,
          method: "POST",
          data: {
            siteId: api.getSiteId(),
            channelId: 170,
            platformId: 1,
            positionId: api.httpEnv().includes("m.allinmed") ? 641 : 3324
          },
          done(data) {
            if (data && data.responseObject.responseStatus && data.responseObject.responseData) {
              that.bannerList = data.responseObject.responseData.data_list[0].ad_profile_attachment;
            }
          }
        });
      },
      getEducationType() {
        Promise.all([getEducationList(this.educationTypeListParam), getEducationList(Object.assign(this.mainListParam, {educationContentType: ""}))]).then((list) => {
          const res1 = list[0], res2 = list[1];

          this.finish=false;
          if (res1 && res1.responseObject.responseData && res1.responseObject.responseData.dataList) {
            this.educationTypeList = res1.responseObject.responseData.dataList;

            this.educationTypeList.forEach((element, index) => {
              element.titleName = this.typeChangeTitle(element).titleName;
              element.titleIcon = this.typeChangeTitle(element).titleIcon;
            });
          }

          if (res2 && res2.responseObject.responseData && res2.responseObject.responseData.dataList) {
            this.mainList = res2.responseObject.responseData.dataList;
            if (api.getPara().doctorCustomerId && api.getPara().doctorCustomerId.length > 0) {
              wx.setNavigationBarTitle({
                title: this.mainList[0].fullName + "医生患教"
              });
            }
          } else {
            this.mainList = [];
          }
        })

      },
      typeChangeTitle(obj) {
        let titleName, titleIcon;
        switch (parseInt(obj.educationContentType)) {
          case 0:
            titleName = "读文章";
            titleIcon = "icon-read";
            break;
          case 1:
            titleName = "看视频";
            titleIcon = "icon-look";
            break;
          case 2:
            titleName = "听语音";
            titleIcon = "icon-hear";
            break;
        }
        return {
          titleName: titleName,
          titleIcon: titleIcon
        }
      },
      getMainList(obj) {
        this.noMore = false;
        this.mainListParam.firstResult = 0;
        this.mainListParam.educationContentType = obj.educationContentType;
        getEducationList(this.mainListParam).then((res) => {
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            this.mainList = res.responseObject.responseData.dataList;
          } else {
            this.mainList = [];
          }
        })
      },
      getDoctorList() {
        getDoctorRecommendList(this.doctorRecommendParams).then(res => {
          if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
            this.doctorList = res.responseObject.responseData.dataList;
          }
        })
      },
      scrollTop(e) {
        if (!e) return;
        let topDistance = e.mp.detail.scrollTop;
        if (topDistance > 100) {
          this.bannerShow = false;
          this.headFixed = true;
        } else {
          this.bannerShow = true;
          this.headFixed = false;
        }
      },
      toSearch() {
        this.setSearchFlag(true);
      },
      scrolltoMore(){
        // console.log("1111111111111111");
        if (!this.noMore) {
          this.finish = true;
          this.mainListParam.firstResult += 20;
          getEducationList(this.mainListParam).then((res) => {
            this.finish = false;
            if (res && res.responseObject.responseData && res.responseObject.responseData.dataList) {
              this.mainList = [...this.mainList, ...res.responseObject.responseData.dataList];
              this.noMore = false;
            } else {
              this.noMore = true;
            }
          })
        }
      }
    },
    components: {
      healthItem,
      NormalLoading,
      healthSearch
    },
    computed:{
      ...mapState(["searchFlag"])
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .healthMain {
    &.fromDoc {
      // padding-top: 80px;
    }
    /*padding-top: 480px;*/
    background: #F2F4F7;
    height: 100%;
    overflow: hidden;
    /*margin-bottom: 110px;*/
    .headContent {
      &.fixed {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.08);
      }
      width: 100%;
      box-sizing: border-box;
      padding: 20px 30px;
      background: #fff;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      .illnessClassify {
        margin-bottom: 30px;
        @include clearfix();
        .classifyLists {
          width: 560px;
          float: left;
          @include clearfix();
          li {
            float: left;
            margin-left: 60px;
            font-size: 32px;
            color: #666666;
            &:first-child {
              margin-left: 10px;
            }
            &.on {
              color: #29A3A3;
              font-weight: bold;
              &:after {
                display: block;
                content: "";
                height: 6px;
                width: 44px;
                margin: 4px auto 0;
                background: #09B7AC;
                border-radius: 8px;
              }
            }
          }
        }
        .allClassify {
          float: right;
          font-size: 32px;
          color: #666666;
          &.on {
            color: #09B7AC;
            font-weight: bold;
            &:after {
              display: block;
              content: "";
              height: 6px;
              width: 44px;
              margin: 4px auto 0;
              background: #09B7AC;
              border-radius: 8px;
            }
          }
        }
      }
      .searchBox {
        width: 100%;
        height: 72px;
        line-height: 72px;
        margin-bottom: 30px;
        box-sizing: border-box;
        background: #F6F6F6;
        border-radius: 100px;
        font-size: 30px;
        color: #7A8585;
        opacity: 0.6;
        text-align: center;
        &:before {
          width: 35px;
          height: 40px;
          display: inline-block;
          content: "";
          margin-right: 5px;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/search.png") no-repeat;
          background-size: 100% 100%;
          vertical-align: sub;
        }
      }
      .healthBanner {
        height: 240px;
        margin-bottom: 52px;
        box-shadow: 0 8px 30px 0 #CBD2E1;
        opacity: 1;
        overflow: hidden;
        transition: all 0.2s linear;
        &.hide {
          height: 0;
          margin-bottom: 0;
        }
        swiper {
          height: 240px !important;
        }
        .banner-slider {
          & > a {
            display: block;
            height: 100%;
            width: 100%;
            > img {
              display: block;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              content: normal !important;
            }
          }
        }
      }
      .fourTypes {
        font-size: 30px;
        color: #666666;
        @include clearfix();
        li {
          float: left;
          margin-right: 70px;
          &.on {
            color: #000;
            i {
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .icon-all {
          display: none;
          width: 30px;
          height: 30px;
          vertical-align: bottom;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/label_all.png") no-repeat;
          background-size: contain;
          margin-right: 8px;

        }
        .icon-look {
          display: none;
          width: 30px;
          height: 30px;
          vertical-align: bottom;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/label_video.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
        .icon-hear {
          display: none;
          width: 30px;
          height: 30px;
          vertical-align: bottom;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/label_vioce.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
        .icon-read {
          display: none;
          width: 30px;
          height: 30px;
          vertical-align: bottom;
          background: url("https://m.allinmed.cn/static/image/img00/healthKnowledge/label_article.png") no-repeat;
          background-size: contain;
          margin-right: 8px;
        }
      }
    }
    .mainContent {
      // padding: 0 30px;
      // margin-top: 492px;
      background: #ffffff;
      box-sizing: border-box;
      &.cancleTop{
        // margin-top: 20px;
      }
    }
    .noMore {
      color: #666;
      font-size: 28px;
      text-align: center;
      padding: 30px 0;
      background: #F2F4F7;
    }
  }

  .fadeDown-enter-active,
  .fadeDown-leave-active {
    transition: all ease-in-out 0.5s;
  }

  .fadeDown-enter,
  .fadeDown-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }
</style>
