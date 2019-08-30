<template>
  <section>
    <div class="item" @click="goRenew(1)">
      <span class="title1">我的头像</span>
      <image :src="baseInfo.headUrl" class="avator"></image>
    </div>
    <div class="item" @click="goRenew(2)">
      <span class="title2">我的昵称</span>
      <span class="operate">
        <em>{{baseInfo.nickName}}</em>
      </span>
    </div>
    <NormalLoading v-if="finish"></NormalLoading>
  </section>
</template>
<script type="text/ecmascript-6">
  import miniLogin from "common/js/miniUtil/miniLogin";
  import NormalLoading from "components/loading";
  import localStorage from "localStorage";
  export default {
    data() {
      return {
        finish: false,
        baseInfo: {
          nickName:"",
          headUrl:""
        }
      };
    },
    components: {
      NormalLoading
    },
    methods: {
      goRenew(data) {
        switch (data) {
          case 1:
            wx.chooseImage({
              count: 1,
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: (res) => {
                const src = res.tempFilePaths[0];
                wx.navigateTo({
                  url: '/pages/cropper/cropper?imgUrl=' + src
                });
              }
            })
            break;
          case 2:
            wx.navigateTo({
              url: '/pages/changeName/changeName?name=' + this.baseInfo.nickName
            });
        }
      }

    },
    onShow() {
      wx.setNavigationBarTitle({
        title:'我的资料',
      });
      this.baseInfo={
        nickName:localStorage.getItem("nickName"),
        headUrl:localStorage.getItem("logoUrl")
      };
      // miniLogin({
      //   successCallBack: (res) => {
      //     if (res.data.responseObject.responseData.mobile && res.data.responseObject.responseData.mobile.trim().length > 0) {
      //       this.baseInfo = res.data.responseObject.responseData
      //       this.finish = false
      //     }
      //   }
      // });
    }
  }
</script>
<style lang="scss">
  .item {
    padding: 20px 26px 20px 26px;
    height: 128px;
    background: white;
    position: relative;
    .title1 {
      position: relative;
      bottom: 40px;
      font-size: 36px;
      color: #222222;
      letter-spacing: 0;
      line-height: 36px;
    }
    .title2 {
      font-size: 36px;
      color: #222222;
      letter-spacing: 0;
      line-height: 36px;
    }
    .avator {
      content: none !important;
      position: relative;
      width: 128px;
      height: 128px;
      border-radius: 50%;
      left: 400px;
    }
    .name {
      position: relative;
      height: 57px;
      overflow: hidden;
      left: 240px;
      font-size: 34px;
      color: #909090;
      letter-spacing: 0;
      line-height: 57px;
      text-overflow: ellipsis;
      max-width: 450px;
      white-space: nowrap;
    }
    .operate {
      float: right;
      em {
        font-style: normal;
        font-size: 28px;
        color: #AAAAAA;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 250px;
        vertical-align: middle;
      }
    }
  }
</style>
