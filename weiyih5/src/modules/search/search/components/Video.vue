<template>
    <section>
        <vue-data-loading :loading="loading" :listens="['infinite-scroll']" @infinite-scroll="infiniteScroll"
                          :distance="100">
            <div slot="pull-down-ready">ready to refresh</div>
            <section class="al-searchResultContent ev-wrap active" data-role="video" style="display: block;">
                <section class="al-content ev_box" data-alcode-mod="461" scrollpagination="enabled"
                         style="display: block;">
                    <section class="al-contentPartModule " data-all="all_video" rel="loaded" v-for="(v,i) in list"
                             v-cloak>
                        <!--<div class="al-resourceTypeBox" style="margin-bottom:7px;"
                             v-if="v.currentStarLevel.currentScoreNum>10">
                            <ul class="al-littleScoreStarBox"
                                v-html="starDom(v.currentStarLevel.currentScoreNum,v.currentStarLevel.currentStarLevel)"></ul>
                        </div>-->
                        <section class="al-tableBox">
                            <article class="al-contentText">
                                <a href="javascript:;" class="al-contentTitle" @click="listEvent({
                                resourceId:v.videoId,
                                resourceUrl:v.webPageUrl
                                })">
                                    <span>{{v.videoName}}</span>
                                </a>
                                <p class="al-contentOtherMsg">
                                    <!--<span :style="iconType(v.isShowActivityTag,v.activityTagColor,v.cms_video.videoType)">{{v.isShowActivityTag, v.activityTagName, v.videoType | nameType}}</span>-->
                                    <span class="al-contentAuthor icon-contentAuthor">{{v.videoAuthor}}</span>
                                    <span class="icon-contentWatchedNum">{{v.browseNum | toWkH}}</span>
                                </p></article>
                            <figure class="al-contentImgBox" v-if="!checkInvalid(v.picUrl)">
                                <a href="javascript:;" @click="listEvent({
                                resourceId:v.videoId,
                                resourceUrl:v.webPageUrl
                                })">
                                    <img :src="v.picUrl" alt="">
                                    <i class="al-videoPlayBtn">
                                        <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                                    </i>
                                    <span class="al-videoTime">{{v.playTime}}</span>
                                </a>
                            </figure>
                        </section>
                    </section>
                </section>
            </section>
            <div slot="infinite-scroll-loading">loading...</div>
            <Nothing v-show="nothingOnOff"></Nothing>
            <loading v-show="loading"></loading>
        </vue-data-loading>
    </section>
</template>
<script>
  import VueDataLoading from 'components/scroll/vue-data-loading.vue';
  import loading from "components/Loading/Loading.vue";
  import Nothing from "./Nothing.vue";
  import Share from "components/Share/Share.vue";
  import { mapActions, mapGetters } from  "vuex";
  const xhrUrl = {
    videoResource: "//gateway.allinmd.cn/base-search-service/search/video/course"
  };
  import SearchCommon from  '../searchCommon/searchCommon';
  import comm from 'static/js/comm'
  import axios from "axios"

  export default {
    data() {
      return {
        list: [],
        shareOnOff: false,
        loading: false,
        pageSize: 10,
        pageIndex: 0,
        customerList: [],
        nothingOnOff: false,
        localSort: false,
        sortType: 1,
        searchType: 2
      }
    },
    created() {
      let t = this;
//            t.$store.state.selectedStr = comm.getpara().keyword||"";
      t.$store.state.videoSortType = t.sortType;
      if (comm.getparaNew().keyword === undefined) {
        this.nothingOnOff = (this.$store.state.selectedStr.length === 0);
      } else {
        this.nothingOnOff = (this.$store.state.selectedStr.length === 0) && (comm.getparaNew().keyword === undefined);
      }
      if (!this.nothingOnOff) {
        t.requestInfo();
      } else {
        t.redirect();
      }
    },
    mounted() {
      let t = this;

    },
    components: {
      Share: Share,
      VueDataLoading,
      loading, Nothing
    },
    computed: {
        ...mapGetters(['mistakeWords']),
      shareConfig(){
        return this.$store.state.shareConfig;
      },
      customerId(){
        let t = this;
        return t.$store.state.customerId;
      }
    },
    methods: {
      ...mapActions(["shareInit"]),
      redirect(){
        let t = this;
        t.$router.push({
          path: "/searchIndex"
        });
      },
//            actualStart(num){
//                if(num===0||num){
//                    return Math.ceil(num);
//                }else{
//                    return 0;
//                }
//
//            },
      "infiniteScroll"(){
        let t = this;
        t.loading = true;
        t.pageIndex++;
        setTimeout(() => {
          t.loading = false;
          t.requestInfo();
        }, 1000)
      },
        checkInvalid(val){
            return SearchCommon.checkInvalid(val);
        },
      resetXhrData(){
        let t = this;
        t.list = [];
        t.completed = false;
        t.loading = true;
        t.pageIndex = 0;
        setTimeout(() => {
          t.loading = false;
          t.requestInfo();
        }, 1000)
      },
        checkMistakeWords(v){
          let t = this;
          return t.checkInvalid(t.mistakeWords)?v:t.mistakeWords;
        },
      requestInfo() {
        let t = this;
        t.loading = true;
        t.shareOnOff = false;
        console.log('请求数据');
        comm.ajax2({
          url: xhrUrl.videoResource,
          type: "GET",
          data: {
              collegeCourseState:0,
              "appVersion":"3110",
            "pageIndex": t.pageIndex*t.pageSize,
            "pageSize": t.pageSize,
            "searchParam": t.$store.state.selectedStr,
            "sortType": t.$store.state.videoSortType
          },
          timeout: 30000,
          success: function (res) {
            t.localSort = true;
            let options = {
              success(res) {
                if (t.pageIndex === 0) {
                  if (res.responseObject.responseData.dataList) {
                    t.list = res.responseObject.responseData.dataList;
                    console.log(t.list.length);
                    t.nothingOnOff = (t.list.length === 0);
                  } else {
                    if (t.searchType === 2) {
                      t.searchType = 1;
                    } else {
                      t.nothingOnOff = true;
                    }
                    t['infiniteScroll'] = () => {
                      return false;
                    };
                  }
                  t.shareOnOff = true;
                  //t.shareInit("video");
                } else {
                  t.list = (t.list).concat(res.responseObject.responseData.dataList);
                }
                t.completed = res.responseObject.responseData.dataList.length < t.pageSize;
                t.loading = false;

              },
              failed() {
                if (t.pageIndex === 0) {
                    t.nothingOnOff = true;
                  if (t.searchType === 2) {
                    t.searchType = 1;
                  } else {
                    t.nothingOnOff = true;
                  }
                  t['infiniteScroll'] = () => {
                    return false;
                  };
                  t.loading = false;
                  t.completed = true;
                }
                return false;
              }
            };
            comm.searchRequest(res, options);
          }
        })
      },
      starDom(n, score){
        if (parseInt(n) > 10) {
          let _dom = "";
          var num = parseInt(score);
          var flot = (score - num) * 100 + "%";
          if (num == 0) {
            _dom = '<li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li><li></li>';
          } else if (num == 1) {
            _dom = '<li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li><li></li>';
          } else if (num == 2) {
            _dom = '<li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li><li></li>';
          } else if (num == 3) {
            _dom = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li><li></li>';
          } else if (num == 4) {
            _dom = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b style="width:' + flot + '"></b></li>';
          } else if (num == 5) {
            _dom = '<li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li><li><b></b></li>';
          }
          return _dom;
        }
      },
      iconType(nameType, name, videoType){
        if (nameType == 1) {
          return 'color:' + name + ';border:1px solid ' + name + ';padding:0 0.10667rem;margin-right:0.26667rem;border-radius: 0.02667rem;'
        } else if (videoType == 1) {
          return 'color:#3598db;border:1px solid #3598db;padding:0 0.10667rem;margin-right:0.26667rem;border-radius: 0.02667rem;'
        }
      },
        listEvent(opt){
            comm.creatEvent({
                triggerType:1,
                actionId:11049,
                refId:opt.resourceId,
                refType:1,
                async:false
            });
            g_sps.jump(null,opt.resourceUrl);
        }
    },
    filters: {
      toWkH: comm.toWKH,
      nameType: (nameType, name, videoType) => {
        if (nameType == 1) {
          return name
        } else if (videoType == 1) {
          return '手术视频';
        }
      }
    },
    watch: {
      '$store.state.videoSortType'(v) {
        let t = this;
        if (t.localSort) {
            if(parseInt(v,10)===4){
                xhrUrl.videoResource = '//gateway.allinmd.cn/base-search-service/search/video/operation';
                t.resetXhrData();
            }else{
                xhrUrl.videoResource = "//gateway.allinmd.cn/base-search-service/search/video/course";
                t.resetXhrData();
            }
        }

      },
      "$store.state.selectedStr"() {
        let t = this;
        t.resetXhrData();
      },
      searchType() {
        let t = this;
        t.resetXhrData();
      },
        nothingOnOff(n){
          console.log(n);
        },
      '$store.state.platformType'(){
        let t = this;
        t.resetXhrData();
      }
    }
  }
</script>
