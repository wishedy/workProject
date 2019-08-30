<template>
  <div>
    <section class="sd_searchHeaderBox">
      <span class="sd_searchBack" @click="backToPast"></span>
      <div class="sd_searchGroup">
        <input class="sd_searchInput" type="text" v-model.trim="searchVal" placeholder="请输入关键词">
        <span class="sd_searchClear" @click="searchVal=''">
          <img v-show="searchVal.length>0" class="sd_delete_icon" src="https://m.allinmed.cn/dist/static/image/img00/DrList/delete_01.png">
        </span>
        <span class="sd_searchBtn" @click="searchKetWordCallBack()" :sps-data="'keyword:'+searchVal">搜索</span>
      </div>
    </section>
    <searchHistory v-if="historyShow" @historyClickCallBack="searchKetWordCallBack"></searchHistory>
  </div>
</template>
<script type="text/ecmascript-6">
  import api from 'common/js/util/util';
  import searchHistory from 'components/healthKnowComponents/searchHistory';
  import createHistoryRecord from 'common/js/HttpRequest/createHistoryRecord';
  export default{
    data(){
      return {
        searchVal:''
      }
    },
    methods:{
      backToPast(){
        this.$store.commit("setSearchFlag",false)
      },
      searchKetWordCallBack(kw){
        this.$emit('update:historyShow',false);
        if(kw && kw.length>0){
          this.searchVal = kw;
          this.$emit('searchKetWordCallBack',kw);
        }else{
          if(this.searchVal.length>0){
            createHistoryRecord({
              searchType:"2",
              keyWord:this.searchVal,
              siteId:api.getSiteId()
            }).then((res)=>{
              if (res && res.responseObject.responseStatus) {
                console.log("创建历史记录成功");
              }
            });
          }
          this.$emit('searchKetWordCallBack',this.searchVal);
        }
      }
    },
    components:{
      searchHistory
    },
    props:{
      historyShow:{
        type:Boolean,
        required:true
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">
  .sd_searchHeaderBox {
    padding:30px 30px 0;
    @include clearfix();
    background:#fff;
    .sd_searchBack {
      float: left;
      width: 50px;
      height: 70px;
      background: url("https://m.allinmed.cn/static/image/img00/DrList/arrow.png") no-repeat left center;
      background-size: 25px 40px;
    }
    .sd_searchGroup {
      @include clearfix();
      float: left;
      border-radius: 8px;
      box-sizing: border-box;
      background:rgba(65, 96, 129, 0.07) url("https://m.allinmed.cn/static/image/search.png") no-repeat 20px center;
      background-size: 35px 35px;
      .sd_searchInput {
        float: left;
        width: 448px;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: #333333;
        padding-left: 60px;
        box-sizing: border-box;
        border: none;
        outline: none;
        border-radius: 10px 0 0 10px;
        @include placeholder{
          color: #2B3752;
          opacity: 0.3;
        }
      }
      .sd_searchClear {
        float: left;
        width: 90px;
        height: 70px;
        background-size: 30px 30px;
        .sd_delete_icon {
          width: 42px;
          height:42px;
          margin-left: 26px;
          margin-top: 16px;
        }
      }
      .sd_searchBtn {
        float: left;
        width: 100px;
        height: 70px;
        line-height: 70px;
        font-size: 30px;
        color: #fff;
        border-radius: 0 10px 10px 0;
        background: #2EA9FE;
        text-align: center;
      }
    }
  }
</style>
