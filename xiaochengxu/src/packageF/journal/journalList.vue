<template>
  <div>
    <web-view v-if="webViewUrl.length" :src="webViewUrl"></web-view>
  </div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by YuxiYang on 2018/12/4.
   */
  import api from "common/js/util/util";
  import dataLog from "dataLog";

  export default {
    data() {
      return {
        webViewUrl:''
      }
    },
    onShow(){
      dataLog.enterBrowse();
      if(wx.getStorageSync('isJournalBack')){
        let urlTemp = this.webViewUrl;
        this.webViewUrl = '';
        wx.removeStorageSync('isJournalBack');
        setTimeout( () => {
          this.webViewUrl=urlTemp.split('?')[0]+'?flag='+Date.parse(new Date())+'&' + urlTemp.split('?')[1];
        }, 100)
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
    onUnload(){
      this.webViewUrl = '';
    },
    onLoad(option) {
      if(wx.getStorageSync('isJournalBack')){
        wx.removeStorageSync('isJournalBack');
      }
      let str='/dist/journalList.html';
      if(JSON.stringify(option) !== '{}'){
        str+='?';
        for (var i in option){
          str+=i+'='+option[i]+'&'
        }
        str=str.slice(0,str.length-1);
      }
      this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(str)}`
      console.log(this.webViewUrl)
    },
  }
</script>

<style lang="scss">

</style>
