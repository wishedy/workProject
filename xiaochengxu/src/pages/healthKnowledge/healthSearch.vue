<template>
  <section class="healthSearchBox" :class="{bgf:historyShow}">
    <searchInput :historyShow.sync="historyShow" @searchKetWordCallBack="searchResult"></searchInput>
    <section class="healthSearchFilter" v-if="!historyShow">
      <ul class="healthFilterType">
        <li class="healthFilterItem" @click="tabIndex=-1;filterResult({educationContentType:''})" :class="{on:tabIndex==-1}">全部</li>
        <li class="healthFilterItem" v-for="(item,index) in educationTypeList" @click="tabIndex=index;filterResult(item)" :class="{on:tabIndex==index}" :key="index">{{item.typeName}}</li>
      </ul>
      <section class="healthSearchResult">
        <healthItem v-if="!noResult" :healthLists="searchResultList" from="search"></healthItem>
        <figure class="healthSearchNoResult" v-if="noResult"><span>抱歉，暂未找到符合条件的结果</span></figure>
      </section>
    </section>
    <section class="searchRecommendMoudle" v-if="noResult">
      <h2>相关推荐</h2>
      <healthItem :healthLists="recommendList" from="recommend"></healthItem>
    </section>
    <footer class="noMore" v-if="noMore">~没有更多了~</footer>
    <loading v-if="finish"></loading>
  </section>
</template>
<script type="text/ecmascript-6">
  import api from 'common/js/util/util';
  import loading from 'components/loading';
  import searchInput from 'components/healthKnowComponents/search';
  import healthItem from 'components/healthKnowComponents/healthItem';
  import getEducationList from 'common/js/HttpRequest/getEducationList';
  import getEducationSearchList from 'common/js/HttpRequest/getEducationSearchList';
  export default {
    data(){
      return {
        historyShow:true,
        tabIndex:-1,
        noResult:false,
        educationTypeListParam:{
          groupType:2,
          sortType:6,
          firstResult:0,
          maxResult:999,
          isValid:1,
          status:1
        },
        educationTypeList:[],
        searchParam:{
          searchParam:"",
          searchEducationContentType:"",
          firstResult:0,
          maxResult:20,
          isSolr:1
        },
        searchResultList:[],
        recommendParam:{
          firstResult:0,
          maxResult:5,
          isValid:1,
          status:1,
          sortType:8
        },
        recommendList:[],
        finish:false,
        noMore:false
      }
    },
    mounted(){
      this.getEducationType();
    },
    methods:{
      getEducationType(){
        getEducationList(this.educationTypeListParam).then((res)=>{
          if(res && res.responseObject.responseData && res.responseObject.responseData.dataList){
            this.educationTypeList = res.responseObject.responseData.dataList;
            this.educationTypeList.forEach((e,i)=>{
              e.typeName=this.getTypeName(e);
            });

          }
        })
      },
      getTypeName(obj){
        switch(parseInt(obj.educationContentType)){
          case 0:
            return "文章";
            break;
          case 1:
            return "视频";
            break;
          case 2:
            return "语音";
            break;
//          case 3:
//            return "图片";
//            break;
//          case 4:
//            return "综合";
//            break;
        }
      },
      searchResult(kw){
        this.finish = true;
        this.noMore = false;
        this.searchParam.searchParam = kw;
        this.searchParam.firstResult = 0;
        this.searchParam.searchEducationContentType = "";
        getEducationSearchList(this.searchParam).then((res)=>{
          this.finish = false;
          if(res && res.responseObject.responseData && res.responseObject.responseData.dataList){
            this.noResult = false;
            this.searchResultList = res.responseObject.responseData.dataList;
          }else{
            this.noResult = true;
            this.recommendResult();
          }
        });
      },
      filterResult(obj){
        this.finish = true;
        this.noMore = false;
        this.searchParam.firstResult = 0;
        this.searchParam.searchEducationContentType = obj.educationContentType;
        getEducationSearchList(this.searchParam).then((res)=>{
          this.finish = false;
          if(res && res.responseObject.responseData && res.responseObject.responseData.dataList){
            this.noResult = false;
            this.searchResultList = res.responseObject.responseData.dataList;
          }else{
            this.noResult = true;
            this.recommendResult();
          }
        });
      },
      recommendResult(){
        getEducationList(this.recommendParam).then((res)=>{
          if(res && res.responseObject.responseData && res.responseObject.responseData.dataList){
            this.recommendList = res.responseObject.responseData.dataList;
          }
        });
      }
    },
    components:{
      searchInput,
      healthItem,
      loading
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .healthSearchBox{
    width:100%;
    min-height:100%;
    background:#F2F4F7;
    &.bgf{
      background:#fff;
    }
    .healthSearchFilter{
      .healthFilterType{
        padding-top:40px;
        background:#fff;
        @include clearfix();
        .healthFilterItem{
          float: left;
          font-size: 30px;
          color: #696969;
          margin:0 60px;
          &.on{
            font-weight: bold;
            color: #29A3A3;
            &:after{
              display: block;
              content: "";
              width:30px;
              height:4px;
              background: #2EA9FE;
              margin:14px auto 12px;
            }
          }
        }
      }
      .healthSearchResult{
        margin-top:14px;
        padding:0 30px;
        background:#fff;
        .healthSearchNoResult{
          width:100%;
          height:536px;
          line-height: 536px;
          text-align: center;
          background: #fff;
          span{
            font-size: 28px;
            color: #25384D;
            opacity: 0.4;
          }
          &:before{
            display: inline-block;
            content: "";
            width:80px;
            height:66px;
            margin-right:28px;
            background: url("https://m.allinmed.cn/static/image/img00/DrList/status_results.png") no-repeat;
            background-size: 100% 100%;
            vertical-align: middle;
          }
        }
      }
    }
    .searchRecommendMoudle{
      background:#fff;
      margin-top:12px;
      padding:40px 30px 0;
      box-sizing: border-box;
      h2{
        padding-bottom:20px;
        font-size: 34px;
        color: #333333;
      }
    }
    .noMore{
      color: #666;
      font-size: 28px;
      text-align: center;
      padding: 10px 0;
    }
  }
</style>
