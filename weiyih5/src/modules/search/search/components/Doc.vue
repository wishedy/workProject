<template>
    <section>
        <section class="al-searchResultContent ev-wrap" data-role="all" style="display: block;" v-cloak>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="al-content ev_box" data-alcode-mod="5597" scrollpagination="disabled"
                         style="display: block;">
                    <section class="al-contentPartModule " data-all="all_doc" v-for="(v,i) in list">
                        <!--<div class="al-resourceTypeBox" style="margin-bottom:7px;"
                             v-if="v.currentStarLevel.currentScoreNum>10">
                            <ul class="al-littleScoreStarBox"
                                v-html="starDom(v.currentStarLevel.currentScoreNum,v.currentStarLevel.currentStarLevel)"></ul>
                        </div>-->
                        <section class="al-tableBox">
                            <article class="al-contentText">
                                <a href="javascript:;"
                                   @click="listEvent({
                                resourceId:v.docId,
                                resourceUrl:skip(v.docType,v.docId,v.webPageUrl)
                                })"
                                   class="al-contentTitle">
                                    <span>{{v.docName}}</span>
                                </a>
                                <p class="al-contentOtherMsg">
                                    <span v-if="v.customerName"
                                          class="al-contentAuthor"
                                          :class="icon(v.customerName,v.docType)">{{v.customerName}}</span>
                                    <span class="icon-contentWatchedNum">{{v.browseNum | toWkH}}</span>
                                </p>
                            </article>
                            <figure class="al-contentImgBox" v-if="!checkInvalid(v.picUrl)">
                                <a  href="javascript:;"
                                   @click="listEvent({
                                resourceId:v.docId,
                                resourceUrl:skip(v.docType,v.docId,v.webPageUrl)
                                })">
                                    <img :src="v.picUrl" alt="">
                                </a>
                            </figure>
                        </section>
                    </section>
                </section>
                <Nothing v-show="nothingOnOff"></Nothing>
                <loading v-show="loading"></loading>
            </vue-data-loading>
        </section>
    </section>
</template>
<script>
  const xhrUrl = {
    docResource: "//gateway.allinmd.cn/base-search-service/search/doc"
  };
  import SearchCommon from  '../searchCommon/searchCommon';
  import VueDataLoading from 'components/scroll/vue-data-loading.vue';
  import loading from "components/Loading/Loading.vue";
  import Nothing from "./Nothing.vue";
  import commDate from 'static/js/comm.date';
  import comm from 'static/js/comm';
  import axios from "axios";
  import Share from "components/Share/Share.vue";
  import { mapActions, mapGetters } from  "vuex";
  export default {
    data(){
      return {
        msg: "welcome",
        shareOnOff: false,
        pageIndex: 0,
        pageSize: 10,
        list: [],
        loading: false,
        completed: false,
        localSort: false,
        sortType: 1,
        searchType: 2
      }
    },
    created(){
      let t = this;
//            t.$store.state.selectedStr = comm.getpara().keyword||"";
      t.$store.state.docSortType = t.sortType;
      if (comm.getparaNew().keyword === undefined) {
        this.nothingOnOff = (this.$store.state.selectedStr.length === 0);
      } else {
        this.nothingOnOff = (this.$store.state.selectedStr.length === 0) && (comm.getparaNew().keyword === undefined);
      }
      if (!this.nothingOnOff) {
        t.caseInfo();
      } else {
        t.redirect();
      }
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
        checkMistakeWords(v){
            let t = this;
            return t.checkInvalid(t.mistakeWords)?v:t.mistakeWords;
        },
        checkInvalid(val){
            return SearchCommon.checkInvalid(val);
        },
      "infiniteScroll"(){
        let t = this;
        t.loading = true;
        t.pageIndex++;
        setTimeout(() => {
//                    t.loading = false;
          t.caseInfo();
        }, 1000)
      },
      resetXhrData(){
        let t = this;
        t.list = [];
        t.completed = false;
        t.loading = true;
        t.pageIndex = 0;
        setTimeout(() => {
          t.loading = false;
          t.caseInfo();
        }, 1000)
      },
      caseInfo(){
        let t = this;
        t.loading = true;
        t.shareOnOff = false;
        comm.ajax2({
          url: xhrUrl.docResource,
          type: "GET",
          data: {
            "pageIndex": t.pageIndex*t.pageSize,
            "pageSize": t.pageSize,
            "searchParam": t.$store.state.selectedStr,
            "sortType": t.$store.state.docSortType
          },
          timeout: 30000,
          success: function (res) {
            t.localSort = true;
            let options = {
              success(res) {
                if (t.pageIndex === 0) {
                  if (res.responseObject.responseData.dataList) {
                    t.list = res.responseObject.responseData.dataList;
                    t.nothingOnOff = (t.list.length === 0);
                    t.shareOnOff = true;
                    //t.shareInit("doc");
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
      icon(customerName, docType){
        let str = '';
        if (customerName) {
          if (docType && docType == 17 || docType == 18 || docType == 19) {
            str = 'bookNameIcon';
          } else {
            str = 'icon-contentAuthor';
          }
        } else {
          str = "";
        }
        return str;
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
      skip(type, id, url){
        let str = '';
        if (type == 17) {
          str = '/dist/eBook/eBook_details.html?bId=' + id + ''
        } else {
          str = url;
        }
        return str;
      },
        listEvent(opt){
            comm.creatEvent({
                triggerType:1,
                actionId:11049,
                refId:opt.resourceId,
                refType:2,
                async:false
            });
            g_sps.jump(null,opt.resourceUrl);
        }
    },
    filters: {
      filterName(str){
        if (str.length) {
          return str
        } else {
          return "唯医小编";
        }
      },
      toWkH: comm.toWKH,
      dateJoint: commDate.dateJoint
    },
    watch: {
      '$store.state.docSortType'() {
        let t = this;
        if (t.localSort) {
          t.resetXhrData();
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
      '$store.state.platformType'(){
        let t = this;
        t.resetXhrData();
      }
    }
  }
</script>