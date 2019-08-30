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
  import getPagesParam from "common/js/getPagesParam/getPagesParam";
  import localStorage from "localStorage";
  import dataLog from "dataLog";

  export default {
    data() {
      return {
        webViewUrl: "",
        queryUrl : '',
      }
    },
    onShow(option){
      console.log(option);
      dataLog.enterBrowse();
      const query = this.$root.$mp.query;
      this.queryUrl = query.url;

      let pDParam= getPagesParam.getPageInfo('doctorMain');
      let pSParam= getPagesParam.getPageInfo('patientNote');

      let urlTemp = '';
      let pDNum = '';
      let pDDocID = '';
      let pSnum = '';
      let pSID = '';

      if (this.queryUrl.includes("m1.allinmed.cn") || this.queryUrl.includes("m.allinmed.cn")) {
        urlTemp = `${decodeURIComponent(this.queryUrl)}`;
      } else {
        urlTemp = `${api.httpEnv()}${decodeURIComponent(this.queryUrl)}`;
      }
      if (localStorage.getItem('knowledgeDetailUrl')) {
        if (this.queryUrl.includes("m1.allinmed.cn") ) {
          urlTemp = 'https://m1.allinmed.cn';
        } else if (this.queryUrl.includes("m.allinmed.cn")){
          urlTemp = 'https://m.allinmed.cn';
        }
        urlTemp = urlTemp + localStorage.getItem('knowledgeDetailUrl');
        //医生主页
        if(pDParam.hasName){//有相同的
          pDNum = pDParam.backNum;
          if (pDParam.param.doctorCustomerId) {
            pDDocID = pDParam.param.doctorCustomerId;
          }else{
            if (pDParam.param.scene&&pDParam.param.scene.indexOf('_')!=-1) {
              pDDocID =  pDParam.param.scene.split('_')[0];
            }else{
              pDDocID =  pDParam.param.scene;
            }
          }
          urlTemp =`${urlTemp}&pDNum=${pDNum}&pDDocID=${pDDocID}`;
        }
        //手册
        if(pSParam.hasName){//有相同的
          pSnum = pSParam.backNum;
          if (pSParam.param.manualId) {
            pSID = pSParam.param.manualId;
          }else{
            if (pSParam.param.scene&&pSParam.param.scene.indexOf('_')!=-1) {
              pSID =  pSParam.param.scene.split('_')[0];
            }else{
              pSID =  pSParam.param.scene;
            }

          }
          urlTemp =`${urlTemp}&pSnum=${pSnum}&pSID=${pSID}`;
        }
        localStorage.removeItem('knowledgeDetailUrl')
      } else {
        //医生主页
        if(pDParam.hasName){//有相同的
          pDNum = pDParam.backNum;
          if (pDParam.param.doctorCustomerId) {
            pDDocID = pDParam.param.doctorCustomerId;
          }else{
            if (pDParam.param.scene&&pDParam.param.scene.indexOf('_')!=-1) {
              pDDocID =  pDParam.param.scene.split('_')[0];
            }else{
              pDDocID =  pDParam.param.scene;
            }
          }
          urlTemp =`${urlTemp}&pDNum=${pDNum}&pDDocID=${pDDocID}`;
        }

        //手册
        if(pSParam.hasName){//有相同的
          pSnum = pSParam.backNum;
          if (pSParam.param.manualId) {
            pSID = pSParam.param.manualId;
          }else{
            if (pSParam.param.scene&&pSParam.param.scene.indexOf('_')!=-1) {
              pSID =  pSParam.param.scene.split('_')[0];
            }else{
              pSID =  pSParam.param.scene;
            }

          }
          urlTemp =`${urlTemp}&pSnum=${pSnum}&pSID=${pSID}`;
        }
      }

      let blackUserId = localStorage.getItem("userId");
      if(blackUserId){
        urlTemp+=`&blackUserId=${blackUserId}`
      }

      this.webViewUrl = urlTemp;

      // if (this.queryUrl.includes("m1.allinmed.cn") || this.queryUrl.includes("m.allinmed.cn")) {
      //   this.webViewUrl = `${decodeURIComponent(this.queryUrl)}`;
      // } else {
      //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(this.queryUrl)}`;
      // }
    },
    onLoad() {
      // const query = this.$root.$mp.query;
      // this.queryUrl = query.url;

      // if (query.url.includes("m1.allinmed.cn") || query.url.includes("m.allinmed.cn")) {
      //   this.webViewUrl = `${decodeURIComponent(query.url)}`;
      // } else {
      //   this.webViewUrl = `${api.httpEnv()}${decodeURIComponent(query.url)}`;
      // }
    },
    //转发事件
    onShareAppMessage: function (res) {
      let _this = this;
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      //  let _path =  `/${getCurrentPages()[0].route}`;
      let _path = `/pages/mIndex/mIndex?from=shareFriend&url=${this.queryUrl}&path=/pages/healthKnowledgeDetail/healthKnowledgeDetail`;
      return {
        title:'分享给你一篇不错的文章，快看看哟～',
        path: _path
      }
    },
  }
</script>

<style lang="scss">

</style>
