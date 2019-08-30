<template>
  <div>
    <web-view :src="webViewUrl"  v-if="webViewUrl.length"></web-view>
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

  export default {
    data() {
      return {
        webViewUrl: "",
      }
    },
    onShow(){
      if(wx.getStorageSync('isReflesh')){
        let urlTemp = this.webViewUrl;
        this.webViewUrl = '';
        wx.removeStorageSync('isReflesh');
        setTimeout( () => {
          this.webViewUrl=urlTemp.split('?')[0]+'?flag='+Date.parse(new Date())+'&' + urlTemp.split('?')[1];
        }, 100)
        // this.webViewUrl=this.webViewUrl.split('?')[0]+'?flag='+Date.parse(new Date())+'&'+this.webViewUrl.split('?')[1]
      }
    },
    onUnload(){
      // console.log('sdagfsfgds')
      // this.webViewUrl = '';
    },
    onLoad(option) {
      let str='/dist/journalEditor.html';
      if(JSON.stringify(option) !== '{}'){
        str+='?';
        for (var i in option){
          str+=i+'='+option[i]+'&'
        }
        str=str.slice(0,str.length-1);
        if(!option.isRedirect){
          wx.setStorageSync('isJournalBack',true)
        }
      }
      this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(str)}`;
      // const query = this.$root.$mp.query;
      // this.queryUrl = query.url;
      // if (query.url.includes("m1.allinmed.cn") || query.url.includes("m.allinmed.cn")) {
      //   this.webViewUrl = `${decodeURIComponent(query.url)}`;
      // } else {
      //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(query.url)}`;
      // }
    },
  }
</script>

<style lang="scss">

</style>
