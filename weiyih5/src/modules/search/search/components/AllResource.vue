<template>
    <section>
        <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                          @infinite-scroll="infiniteScroll" :distance="100">
            <div slot="pull-down-ready">ready to refresh</div>
            <section class="al-searchResultContent ev-wrap active" data-role="all" v-show="list.length>0">
                <section class="al-content al-doctorRecommend ev_docBox" v-if="customerList.length>0">
                    <section class="al-doctorRecommendItem" v-for="(v,i) in customerList" v-if="i<2">
                        <figure class="al-doctorRecommendImg">
                            <figure class="al-doctorRecommendImg">
                                <a href="javascript:;" @click="listEvent({
                                resourceId:v.customerId,
                                typeId:9,
                                resourceUrl:'/dist/personal/others_index.html?cid='+v.customerId
                                })">
                                    <img :src="v.picUrl" alt="">
                                </a>
                            </figure>
                        </figure>
                        <article class="al-doctorRecommendMsg">
                            <a class="al-doctorRecommendName"
                               href="javascript:;"  @click="listEvent({
                                resourceId:v.customerId,
                                typeId:9,
                                resourceUrl:'/dist/personal/others_index.html?cid='+v.customerId
                                })">
                                {{v.customerName}}<i class="al-vipUser"></i>
                            </a>
                            <span class="al-doctorRecommendJob">{{v.medicalTitle}}</span>
                            <span class="al-doctorRecommendHospital">{{v.hospital}}</span>
                        </article>
                    </section>
                    <footer class="al-searchMoreUser" @click="moreTeacher">更多用户<i class="icon-searchMoreUser"></i>
                    </footer>
                </section>
                <section class="al-content al-content-product" v-if="productList.length">
                    <section class="al-searchProduct-item" v-for="(v,i) in productList" @click.stop="jumpProduct(v)" :key="i" v-if="i<2">
                        <figure class="searchProduct-logo"  :style="{background: 'url('+v.attPath+') no-repeat center center/cover'}" ></figure>
                        <section class="searchProduct-detail">
                            <div class="searchProduct-title" v-text='cutStr(v.productName,46)'></div>
                            <div class="searchBrand-title" v-text="v.brandName"></div>
                        </section>
                    </section>
                    <footer class="al-searchMoreUser" @click="moreProduct" v-if="productNum>2" style="background: #fff;">更多产品<i class="icon-searchMoreUser"></i></footer>
                </section>
                <section class="al-content ev_box" data-alcode-mod="461" scrollpagination="enabled"
                         v-if="list.length>0">
                    <section class="al-contentPartModule " data-all="all_video" rel="loaded" v-for="(v,i) in list"
                             v-cloak>
                        <!--<div class="al-resourceTypeBox" style="margin-bottom:7px;" v-if="v.currentStarLevel>0">
                            &lt;!&ndash;<ul class="al-littleScoreStarBox">&ndash;&gt;
                            &lt;!&ndash;<li v-for="startNum in actualStart(v.currentStarLevel)"><b></b></li>&ndash;&gt;
                            &lt;!&ndash;</ul>&ndash;&gt;
                            <ul class="al-littleScoreStarBox"
                                v-html="starDom(v.currentScoreNum,v.currentStarLevel)"></ul>
                        </div>-->

                        <section class="al-tableBox">
                            <article class="al-contentText">
                                <a href="javascript:;" class="al-contentTitle"  @click="listEvent({
                                resourceId:v.resourceId,
                                typeId:v.resourceType,
                                resourceUrl:v.webPageUrl
                                })">
                                    <span>{{v.resourceTitle}}</span>
                                </a>
                                <p class="al-contentOtherMsg">
                                    <span v-if="v.activityTagName"
                                          :style="{color:v.activityTagColor,borderColor:v.activityTagColor}"
                                          style="color:#3d3fbe;border:1px solid #3d3fbe;padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;">{{v.activityTagName}}</span>
                                    <span class="al-contentAuthor" :class="icon(v.resourceSecondType)"
                                          v-if="v.customerName">{{v.typeId==1?v.ownerNameStr:v.customerName}}</span>
                                    <span class="icon-contentWatchedNum">{{v.browseNum | toWkH}}</span>
                                </p>
                            </article>
                            <figure class="al-contentImgBox" v-if="!checkInvalid(v.picUrl)">
                                <a href="javascript:;" @click="listEvent({
                                resourceId:v.resourceId,
                                typeId:v.resourceType,
                                resourceUrl:v.webPageUrl
                                })">
                                    <img :src="v.picUrl.split('|')[0]" alt="">
                                    <i class="al-videoPlayBtn" v-if="v.resourceType==1">
                                        <img src="//img50.allinmd.cn/pages/index/videoPlay_btn.png" alt="">
                                    </i>
                                    <span class="al-videoTime" v-if="v.resourceType==1">{{v.playTime}}</span>
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
  import SearchCommon from  '../searchCommon/searchCommon';
  import loading from "components/Loading/Loading.vue"
  import Nothing from "./Nothing.vue"
  import Share from "components/Share/Share.vue";
  import { mapActions, mapGetters } from  "vuex";
  const xhrUrl = {
    allResource: "//gateway.allinmd.cn/base-search-service/search/all",
    doctor: "//gateway.allinmd.cn/base-search-service/search/customer",
  };
  import comm from 'static/js/comm'
  import axios from "axios"

  export default {
    data() {
      return {
          productNum:0,
        list: [],
        shareOnOff: false,
        pageSize: 10,
        pageIndex: 0,
        customerList: [],
        completed: false,
        loading: false,
        nothingOnOff: false,
        sortType: 1,
        localSort: false,
        searchType: 2,
          productList:[]
      }
    },
    created() {
      let t = this;
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
//            t.$store.state.selectedStr = comm.getpara().keyword||"";
      t.$store.state.allSortType = t.sortType;
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
        jumpProduct(v){
            let t = this;
            g_sps.jump(null,`/dist/medPlus/medPlus.html?#/productDetail?productId=${v.productId}`);
        },
        cutStr(str,num){
            return comm.getStrLen(str,num);
        },
      actualStart(num){
        if (num === 0 || num) {
          return Math.ceil(num);
        } else {
          return 0;
        }
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
          t.requestInfo();
        }, 1000)
      },
      moreTeacher(){
        let t = this;
        t.$router.push({
          path: "/doctor"
        });
      },
        moreProduct(){
        let t = this;
        t.$router.push({
          path: "/product"
        });
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
      redirect(){
        let t = this;
        /*t.$router.push({
          path: "/searchIndex"
        });*/
      },
      requestInfo() {
        let t = this;
        t.loading = true;
        t.shareOnOff = false;t.nothingOnOff = false;
          comm.ajax2({
                  url: "//gateway.allinmd.cn/medplus-resource-platform/med/product/getSearchProducts",
                  type: "GET",
                  data: {
                      "firstResult": 0,
                      "maxResult": 20,
                      "searchParam": t.$store.state.selectedStr,
                      "dataType": 1,
                  },
                  timeout: 30000,
                  success: function (res) {
                      console.log(res);
                      if (res&&res.responseObject&&res.responseObject.responseData&&res.responseObject.responseData.dataList) {
                          t.productList = res.responseObject.responseData.dataList;
                          t.productNum = parseInt(res.responseObject.responseData.dataCount,10);
                      }
                  }
          });
        var getDoctorList = (resourceList)=>{
            axios.get(xhrUrl.doctor, {
                params: {
                    "pageIndex": t.pageIndex*t.pageSize,
                    "pageSize": t.pageSize,
                    "searchParam": t.$store.state.selectedStr,
                    "sortType": t.$store.state.allSortType,
                    "searchType": t.searchType
                }
            })
                .then(function (res) {
                    t.localSort = true;
                    t.loading = false;
                    let customer_list = res.data.responseObject.responseData.dataList;
                    let resource_list = resourceList;
                    if(customer_list && customer_list.length){
                        if (t.pageIndex === 0) {
                            t.customerList = customer_list;
                        }
                    }

                    if(resource_list && resource_list.length){
                        if(resource_list.length < 10){
                            t.list = t.list.concat(resource_list);
                            t.completed = true;
                        }else{
                            if (t.pageIndex === 0) {
                                t.list = resource_list;
                            } else {
                                t.list = t.list.concat(resource_list);
                            }
                        }
                    }else{
                        if(t.pageIndex != 0){
                            t.completed = true;
                        }else{
                            t.nothingOnOff = true;
                        }
                    }

                    //如果有数据我们就展示分享按钮
                    if(t.customerList.length || t.list.length){
                        t.shareOnOff = true;
                        //t.shareInit("all");
                    }
                })
                .catch(function (error) {

                    ////console.log(error);
                });
        };
          axios.get(xhrUrl.allResource, {
              params: {
                  collegeCourseState:0,
                  "pageIndex": t.pageIndex*t.pageSize,
                  "pageSize": t.pageSize,
                  "searchParam": t.$store.state.selectedStr,
                  "sortType": t.$store.state.allSortType,
                  "searchType": t.searchType,
                  "appVersion":"3110",
                  "platformId": t.$store.state.platformType,
              }
          })
              .then(function (res) {
                  if(SearchCommon.checkResData(res.data)){
                      //存在数据
                        getDoctorList(res.data.responseObject.responseData.dataList);
                  }else{
                      //没有数据
                      getDoctorList([]);
                  };
              })
              .catch(function (error) {

                  ////console.log(error);
              });
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
      icon(v){
        if (v && v == 17 || v == 18 || v == 19) {
          return 'bookNameIcon';
        } else {
          return 'icon-contentAuthor';
        }
      },
        listEvent(opt){
            comm.creatEvent({
                triggerType:1,
                actionId:11049,
                refId:opt.resourceId,
                refType:opt.typeId,
                async:false
            });
            g_sps.jump(null,opt.resourceUrl);
        }
    },
    filters: {
      toWkH: comm.toWKH
    },
    watch: {
      '$store.state.allSortType'(){
        let t = this;
        if (t.localSort) {
          t.resetXhrData();
        }

      },
      "$store.state.selectedStr"(){
        let t = this;
        t.resetXhrData();
      },
      searchType(){
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
