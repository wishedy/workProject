<template>
  <div>
    <web-view :src="webViewUrl"></web-view>
  </div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/6/29.
   */
  import api from "common/js/util/util";
  import dataLog from "dataLog";

  export default {
    data() {
      return {
        webViewUrl: "",
      }
    },
    onUnload(){
      this.webViewUrl = '';
    },
    onLoad(option) {
      let str='/dist/journalStatus.html';
      if(JSON.stringify(option) !== '{}'){
        str+='?';
        for (var i in option){
          str+=i+'='+option[i]+'&'
        }
        str=str.slice(0,str.length-1);
      }
      this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(str)}`;
    },
    onShow(){
      dataLog.enterBrowse();
      if(wx.getStorageSync('isRefresh')){
        wx.removeStorageSync('isRefresh');
        this.webViewUrl=this.webViewUrl.split('?')[0]+'?flag='+Date.parse(new Date())+'&'+this.webViewUrl.split('?')[1]
      }
    },
    onHide(){
      dataLog.leaveBrowse();
    },
  }
</script>

<style lang="scss">

</style>
