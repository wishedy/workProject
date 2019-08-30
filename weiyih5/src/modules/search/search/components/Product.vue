<template>
    <section>
        <section class="al-searchResultContent ev-wrap" data-role="all" style="display: block;" v-cloak>
            <vue-data-loading :loading="loading" :completed="completed" :listens="['infinite-scroll']"
                              @infinite-scroll="infiniteScroll" :distance="100">
                <section class="al-content ev_box" data-alcode-mod="555" scrollpagination="disabled"
                         style="display: block;">
                    <!--<section class="al-contentPartModule " data-all="all_case" v-for="(v,i) in list">
                        &lt;!&ndash;<div class="al-resourceTypeBox" style="margin-bottom:7px;"
                             v-if="v.currentStarLevel.currentScoreNum>10">
                            <ul class="al-littleScoreStarBox"
                                v-html="starDom(v.currentStarLevel.currentScoreNum,v.currentStarLevel.currentStarLevel)"></ul>
                        </div>&ndash;&gt;
                        <section class="al-tableBox">
                            <article class="al-contentText"><a href="javascript:;"
                                                               class="al-contentTitle" @click="listEvent({
                                resourceId:v.caseId,
                                resourceUrl:v.webPageUrl
                                })"><span>{{v.caseName}}</span></a>
                                <p class="al-contentOtherMsg">
                                    <span :style="{'color':v.activityTagColor,borderColor:v.activityTagColor}"
                                          style="border:1px solid #3d3fbe;padding:0 0.10667rem;margin-right: 0.26667rem;border-radius: 0.02667rem;"
                                          v-if="!checkInvalid(v.activityTagName)>0">{{v.activityTagName}}</span>
                                    &lt;!&ndash;<span class="al-contentAuthor icon-contentAuthor">{{v.case_customer_auth.fullName|filterName}}</span>&ndash;&gt;
                                    <span class="al-contentAuthor icon-contentAuthor">{{v.customerName}}</span>
                                    <span class="icon-contentWatchedNum">{{v.browseNum}}</span>
                                </p>
                            </article>
                            <figure class="al-contentImgBox" v-if="!checkInvalid(v.picUrl)">
                                <a href="javascript:;" @click="listEvent({
                                resourceId:v.caseId,
                                resourceUrl:v.webPageUrl
                                })">
                                    <img :src="(v.picUrl)" alt="">
                                </a>
                            </figure>
                        </section>
                    </section>-->
                    <section class="al-searchProduct-item" v-for="(v,i) in list" @click.stop="jumpProduct(v)">
                        <figure class="searchProduct-logo"  :style="{background: 'url('+v.attPath+') no-repeat center center/cover'}" ></figure>
                        <section class="searchProduct-detail">
                            <div class="searchProduct-title" v-text='cutStr(v.productName,46)'></div>
                            <div class="searchBrand-title" v-text="v.brandName"></div>
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
        caseResource: "//gateway.allinmd.cn/medplus-resource-platform/med/product/getSearchProducts"
    };
    import SearchCommon from  '../searchCommon/searchCommon';
    import Share from "components/Share/Share.vue";
    import VueDataLoading from 'components/scroll/vue-data-loading.vue'
    import loading from "components/Loading/Loading.vue"
    import Nothing from "./Nothing.vue"
    import comm from 'static/js/comm'
    import axios from "axios";
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
                sortType: 11,
                searchType: 2
            }
        },
        mounted(){
            let t = this;

            t.$store.state.caseSortType = t.sortType;
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
            redirect(){
                let t = this;
                t.$router.push({
                    path: "/searchIndex"
                });
            },
            jumpProduct(v){
              let t = this;
                g_sps.jump(null,`/dist/medPlus/medPlus.html?#/productDetail?productId=${v.productId}`);
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

                    t.caseInfo();
                }, 3000)
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
            cutStr(str,num){
                return comm.getStrLen(str,num);
            },
            caseInfo(){
                let t = this;
                t.loading = true;
                t.shareOnOff = false;
                comm.ajax2({
                    url: xhrUrl.caseResource,
                    type: "GET",
                    data: {
                        "firstResult": t.pageIndex*t.pageSize,
                        "maxResult": t.pageSize,
                        "searchParam": t.$store.state.selectedStr,
                        "dataType": 2,
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
                                    //t.shareInit("case");
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
                    refType:7,
                    async:false
                });
                g_sps.jump(null,opt.resourceUrl);
            }
        },
//        filters:{
//            filterName(str){
//                if(str.length){
//                    return str
//                }else{
//                    return "唯医小编";
//                }
//            }
//        },
        watch: {
            '$store.state.caseSortType'(){
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
            },
        }
    }
</script>