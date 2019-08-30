<template>
  <!--增加video标签支持，并循环添加-->
  <view class="videoStyleOrder" @click="videoPlay()">
    <!--<video :id="videoId" class="_video videoPlayBox video-video video" controls :src="item.content" :poster="platform=='ios'?'':item.poster" ></video>-->
    <img class="_video videoPlayBox video-video video" :src="item.poster" mode="aspectFit" alt="">
    <img src="https://m.allinmed.cn/static/image/img00/healthKnowledge/play_big.png" alt="" class="videoPlayBtn">
  </view>
</template>

<script>
import {mapState, mapActions, } from 'vuex';
export default {
  name: 'wxParseVideo',
  data(){
    return {
      platform:"",
      videoId:`` // 给视频增加id 属性，为了解决视频自动播放的问题
    }
  },
  onLoad(){
    this.platform = "";
    this.getPlatForm();
    // console.log(`videoTag${this.videoNum}`);
    this.videoId = `videoTag${this.videoNum}`;
    this.setVideoNum();
  },
  methods:{
    ...mapActions(['setVideoNum']),
    getPlatForm(){
      let that = this;
      wx.getSystemInfo({
        success: function(res) {
          if(res.platform == "ios"){
            that.platform = "ios";
          }
        },
        fail:function (err) {
          that.platform = "ios";
        }
      })
    },
    videoPlay() {
      const _url = `/packageA/videoPlayer/videoPlayer?videoUrl=${encodeURIComponent(this.item.content)}`;
      wx.navigateTo({
        url: _url
      });
    },
  },
  computed: {
    ...mapState(['videoNum'])
  },
  props: {
    item: {},
  },
};
</script>
