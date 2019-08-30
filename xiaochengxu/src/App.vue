<template>
  <div class="container">1231</div>
</template>
<script>
  import api from "common/js/util/util";
  export default {
    globalData:{

    },
    onLaunch(options){
    },
    onLoad(){
      this.updateApp();
    },
    methods:{
      updateApp(){
        const updateManager = wx.getUpdateManager();
        //console.log('走');

        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          //console.log(res);
          //console.log(res.hasUpdate)
        });

        updateManager.onUpdateReady(function () {
          updateManager.applyUpdate();

        });
        updateManager.onUpdateFailed(function () {
          // 新的版本下载失败
        })
      }
    }
  }
</script>

<style lang="scss">
  page{
    height:100%;
  }
</style>
