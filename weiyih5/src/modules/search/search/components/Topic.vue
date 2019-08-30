<template>
    <section>
        <section class="al-searchResultContent ev-wrap" data-role="all" style="display: block;" v-cloak>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="al-content ev_box" data-alcode-mod="560" scrollpagination="disabled"
                         style="display: block;">
                    <section class="al-contentPartModule " data-all="all_topic" v-for="(v,i) in list">
                        <section class="al-tableBox">
                            <article class="al-contentText">
                                <a href="javascript:;" class="al-contentTitle"
                                   @click="listEvent({
                                resourceId:v.cms_topic.topicId,
                                resourceUrl:v.cms_topic.webStoragePath
                                })">
                                    <span>{{v.cms_topic.topicName}}</span>
                                </a>
                                <p class="al-contentOtherMsg">
                                    <span class="al-contentAuthor icon-contentAuthor"
                                          v-if="v.cms_topic_customer_auth.lastName ||v.cms_topic_customer_auth.firstName">{{v.cms_topic_customer_auth.lastName}}{{v.cms_topic_customer_auth.firstName}}</span>
                                    <span class="icon-contentWatchedNum">{{v.cms_topic.browseNum | toWkH}}</span>
                                </p>
                            </article>
                            <figure class="al-contentImgBox" v-if="v.cms_topic_attachment.topicAttUrl.length>0">
                                <a href="javascript:;" @click="listEvent({
                                resourceId:v.cms_topic.topicId,
                                resourceUrl:v.cms_topic.webStoragePath
                                })"><img :src="v.cms_topic_attachment.topicAttUrl"
                                                                           alt=""></a>
                            </figure>
                        </section>
                    </section>
                </section>
                <Nothing v-show="nothingOnOff"></Nothing>
                <loading v-show="loading"></loading>
            </vue-data-loading>
        </section>
        <Share :shareConfig.sync="shareConfig" v-show="shareOnOff"></Share>
    </section>
</template>
<script>
  const xhrUrl = {
    caseResource: "/mcall/cms/topic/base/json_list/"
  };
  import VueDataLoading from 'components/scroll/vue-data-loading.vue';
  import loading from "components/Loading/Loading.vue";
  import Nothing from "./Nothing.vue";
  import comm from 'static/js/comm';
  import axios from "axios";
  import Share from "components/Share/Share.vue";
  import { mapActions, mapGetters } from  "vuex";
  /*TempCache.getItem("userId") != null ? TempCache.getItem("userId")*/

  export default {
    data(){
      return {
        msg: "welcome",
        shareOnOff: false,
        pageIndex: 1,
        pageSize: 10,
        list: [],
        loading: false,
        completed: false,
        nothingOnOff: false,
        localSort: false,
        sortType: 1,
        searchType: 2
      }
    },
    mounted() {
      let t = this;
      t.$store.state.topicSortType = t.sortType;
    },
    created(){
      let t = this;
//            t.$store.state.selectedStr = comm.getpara().keyword||"";
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
        t.pageIndex = 1;
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
          url: xhrUrl.caseResource,
          type: "GET",
          data: {
            'isValid': 1,
            "pageIndex": t.pageIndex,
            "pageSize": t.pageSize,
            "searchParam": t.$store.state.selectedStr,
            "logoUseFlag": 3,
            "useFlag": (t.customerId) ? 2 : 1,
            "attUseFlag": t.GLOBAL.AttUseFlag.e,
            "sortType": t.$store.state.topicSortType,
            "searchType": t.searchType,
            "platformId": t.$store.state.platformType,
            "opUsr":t.customerId,
            "sessionCustomerId": t.customerId
          },
          timeout: 30000,
          success: function (res) {
            t.localSort = true;
            let options = {
              success(res) {
                if (t.pageIndex === 1) {
                  if (res.responseObject.responseData.data_list) {
                    t.list = res.responseObject.responseData.data_list;
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
                  t.shareInit("topic");
                } else {
                  t.list = (t.list).concat(res.responseObject.responseData.data_list);
                }
                t.completed = res.responseObject.responseData.data_list.length < t.pageSize;
                t.loading = false;

              },
              failed() {
                if (t.pageIndex === 1) {
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
            comm.successRequest(res, options);
          }
        })
      },
        listEvent(opt){
            comm.creatEvent({
                triggerType:1,
                actionId:11049,
                refId:opt.resourceId,
                refType:4,
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
      toWkH: comm.toWKH
    },
    watch: {
      '$store.state.topicSortType'() {
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