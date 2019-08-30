<template>
    <section>
        <section class="al-searchResultContent ev-wrap" data-role="all" style="display: block;" v-cloak>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="al-content ev_box" data-alcode-mod="557" scrollpagination="disabled"
                         style="display: block;">
                    <section class="al-contentPartModule al-contentUpTitleDownImg" rel="loaded" v-for="(v,i) in list">
                        <article class="al-contentText">
                            <a href="javascript:;" class="al-contentTitle" @click="listEvent({
                                resourceId:v.conferenceId,
                                resourceUrl:'/dist/conference/meeting_detail.html?conId='+v.conferenceId
                                })">
                                <span>{{v.conferenceName}}</span>
                            </a>
                            <p class="al-contentOtherMsg">
                                <span class="label" v-text="v.conferenceTheme" v-if="!checkInvalid(v.conferenceTheme)"></span>
                                <span class="al-contentSeminarTime icon-contentSeminarTime">{{formateMeetingDate(v.startTime,v.endTime)}}</span>
                                <span class="icon-contentSeminarPlace">{{v.country}}<em
                                        v-if="!checkInvalid(v.city)">•</em>{{v.city}}</span>
                            </p>
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
    caseResource: "//gateway.allinmd.cn/base-search-service/search/conference"
  };
  import VueDataLoading from 'components/scroll/vue-data-loading.vue';
  import loading from "components/Loading/Loading.vue";
  import Nothing from "./Nothing.vue";
  import commDate from 'static/js/comm.date';
  import SearchCommon from  '../searchCommon/searchCommon';
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
    mounted(){
      let t = this;
//            t.$store.state.selectedStr = comm.getpara().keyword||"";
      t.$store.state.meetingSortType = t.sortType;
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
      loading,
      Nothing

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
        formateDate(time){
          let t = this;
          //2014-10-12 16:00:00
            time = time.replace(/-/g,'/');
          if(t.checkInvalid(time)){
              return '';
          }else{
              let today = new Date();//获得当前日期
              let year = today.getFullYear();//获得年份
              let meetYear = parseInt(time.substring(0,4),10);
              let reg = /\d{2}\/\d{2}\s/g;
              if(meetYear<year){
                  return meetYear+'/'+(time.match(reg))[0];
              }else{
                  return (time.match(reg))[0];
              }
          }
        },
        formateMeetingDate(startTime,endTime){
          let t = this;
          return t.formateDate(startTime)+'-'+t.formateDate(endTime);
        },
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
          t.caseInfo();
        }, 1000)
      },
        checkInvalid(val){
            return SearchCommon.checkInvalid(val);
        },
        checkMistakeWords(v){
            let t = this;
            return t.checkInvalid(t.mistakeWords)?v:t.mistakeWords;
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
            "pageIndex": t.pageIndex*t.pageSize,
            "pageSize": t.pageSize,
            "searchParam": t.$store.state.selectedStr,
            "sortType": t.$store.state.meetingSortType
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
                  //t.shareInit("meeting");
                } else {
                  t.list = (t.list).concat(res.responseObject.responseData.dataList);
                }
                if (res.responseObject.responseData.dataList) {
                  t.completed = res.responseObject.responseData.dataList.length < t.pageSize;
                } else {
                  t.completed = true;
                }

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
                refType:3,
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
      dateJoint: commDate.dateJoint
    },
    watch: {
      '$store.state.meetingSortType'() {
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