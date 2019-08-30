<template>
  <figure class="sd_searchHistory" v-if="historyInfo.length>0">
    <figcaption>历史记录<i class="sd_deleteBtnIcon" @click="confirmShow = true"></i></figcaption>
    <ul class="sd_searchHistoryList">
      <li v-for="(item,index) in historyInfo" class="sd_searchHistoryItem" @click="historyClickCallBack(item)" :key="index">{{item.keyWord.length>20?item.keyWord.substring(0,20)+'...':item.keyWord}}</li>
    </ul>
    <confirm :confirmParams="{
        'ensure':'确认',
        'cancel':'取消',
        'content':'确认删除全部历史记录么?'
        }" v-if="confirmShow"  @cancelClickEvent="confirmShow = false" @ensureClickEvent="deleteHistoryRecord()">
    </confirm>
  </figure>
</template>
<script type="text/ecmascript-6">
  import api from 'common/js/util/util';
  import confirm from 'components/confirm';
  import getHistoryRecord from 'common/js/HttpRequest/getHistoryRecord';
  import deleteHistoryRecord from 'common/js/HttpRequest/deleteHistoryRecord';
  import createHistoryRecord from 'common/js/HttpRequest/createHistoryRecord';

  export default{
    data(){
      return {
        historyInfo:[],
        confirmShow:false
      }
    },
    mounted(){
      this.getHistoryRecord();
    },
    methods:{
      getHistoryRecord() {
        getHistoryRecord({
          searchType:"2"
        }).then((res)=>{
          if(res && res.responseObject.responseData && res.responseObject.responseData.data_list){
            this.historyInfo = res.responseObject.responseData.data_list;
          }
        });
      },
      deleteHistoryRecord() {
        this.confirmShow = false;
        deleteHistoryRecord().then((res)=>{
          if (res && res.responseObject.responseStatus) {
            this.historyInfo = [];
          }
        })
      },
      historyClickCallBack(obj){
        createHistoryRecord({
          searchType:"2",
          keyWord:obj.keyWord,
          siteId:api.getSiteId()
        }).then((res)=>{
          if (res && res.responseObject.responseStatus) {
            console.log("创建历史记录成功");
          }
        });
        this.$emit("historyClickCallBack",obj.keyWord);
      }
    },
    components:{
      confirm
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">
  .sd_searchHistory{
    padding:68px 30px 0;
    background:#fff;
    figcaption{
      font-size: 34px;
      color: #444444;
      font-weight: bold;
    }
    .sd_searchHistoryList{
      margin-top:24px;
      .sd_searchHistoryItem{
        max-width: 654px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        margin-top: 10px;
        color: #5A5A5A;;
        font-size: 28px;
        background: #F2F4F7 ;
        padding: 11px 14px 11px 14px;
        margin-right: 12px;
        border-radius: 4px;
      }
    }
  }
  .sd_deleteBtnIcon{
    float: right;
    width:30px;
    height:30px;
    margin-top:6px;
    background:url("https://m.allinmed.cn/static/image/img00/DrList/specialty_delete.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
