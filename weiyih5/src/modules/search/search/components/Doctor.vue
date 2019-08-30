<template>
    <section>
        <section class="al-searchResultContent ev-wrap" data-role="all" style="display: block;" v-cloak>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="al-content ev_box" data-alcode-mod="558" scrollpagination="disabled"
                         style="display: block;">
                    <section class="al-doctorRecommendItem" style="padding-left: 0.4rem;" v-for="(v,i) in list">
                        <figure class="al-doctorRecommendImg">
                            <figure class="al-doctorRecommendImg">
                                <a href="javascript:;"
                                   @click="listEvent({
                                resourceId:v.customerId,
                                resourceUrl:'/dist/personal/others_index.html?cid='+v.customerId
                                })"
                                >
                                    <img :src="v.picUrl" alt="">
                                </a>
                            </figure>
                        </figure>
                        <article class="al-doctorRecommendMsg">
                            <a class="al-doctorRecommendName"
                               href="javascript:;"
                               @click="listEvent({
                                resourceId:v.customerId,
                                resourceUrl:'/dist/personal/others_index.html?cid='+v.customerId
                                })">
                                {{v.customerName}}<i class="al-vipUser" v-if="v.isVerified==2||v.isVerified==7||v.isVerified==8||v.isVerified==9"></i>
                            </a>
                            <span class="al-doctorRecommendJob"
                                  v-if="!checkInvalid(v.medicalTitle)">{{v.medicalTitle, 10 | cut}}</span>
                            <span class="al-doctorRecommendHospital" v-if="!checkInvalid(v.hospital)">{{v.hospital, 22 | cut}}</span>
                            <Follow :follow-config="followConfig(v)"></Follow>
                            <!--<p class="ev-followBtn"><a href="javascript:;" class="al-doctorRecommendFollow btn-primary "
                                                       style="cursor:pointer;" data-stat="add"
                                                       :data-refid="v.customer_baseinfo.customerId" @click="follow(v.customer_baseinfo.customerId)">关注</a></p>-->
                        </article>
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
    caseResource: "//gateway.allinmd.cn/base-search-service/search/customer"
  };
  import SearchCommon from  '../searchCommon/searchCommon';
  import Follow from "components/Follow/Follow.vue";
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
        nothingOnOff: false,
        localSort: false,
        sortType: 1,
        searchType: 2
      }
    },
    mounted() {
      let t = this;
//            t.$store.state.selectedStr = comm.getpara().keyword;
      t.$store.state.doctorSortType = t.sortType;
    },
    created(){
      let t = this;
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
      loading, Nothing, Follow
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
      followConfig(v){
        return {
          refId: v.customerId,
          followState: v.isAttention,
          unFollow: false,
          className: "ev-followBtn",
        }
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
          url: xhrUrl.caseResource,
          type: "GET",
          data: {
            pageIndex: t.pageIndex*t.pageSize,
            pageSize: t.pageSize,
            searchParam: t.$store.state.selectedStr,
            sortType: t.$store.state.doctorSortType
          },
          timeout: 30000,
          success: function (res) {
            t.localSort = true;
            let options = {
              success(res) {
                if (t.pageIndex === 0) {
                  if (res.responseObject.responseData.dataList) {
                    t.list = res.responseObject.responseData.dataList;
                    //console.log(t.list);
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
                  //t.shareInit("doctor");
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
        listEvent(opt){
            comm.creatEvent({
                triggerType:1,
                actionId:11049,
                refId:opt.resourceId,
                refType:9,
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
      dateJoint: commDate.dateJoint,
      cut: (v1, v2) => comm.getStrLen(v1, v2)
    },
    watch: {
      '$store.state.doctorSortType'() {
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
