<template>
  <!--增加video标签支持，并循环添加-->
  <view :class="node.classStr" :style="node.styleStr">
    <video controls :poster="platform=='ios'?'':node.attr.poster" :class="node.classStr" class="video-video" :src="node.attr.src"></video>
  </view>
</template>

<script>
// import {mapState, mapActions, } from 'vuex';
export default {
  name: 'wxParseVideo',
  data(){
    return {
      platform:"",
      // videoId:`` // 给视频增加id 属性，为了解决视频自动播放的问题
    }
  },
  onLoad(){
    this.platform = "";
    this.getPlatForm();
    // console.log(`videoTag${this.videoNum}`);
    // this.videoId = `videoTag${this.videoNum}`;
    // this.setVideoNum();
  },
  methods:{
    // ...mapActions(['setVideoNum']),
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
    }
  },
  computed: {
    // ...mapState(['videoNum'])
  },
  props: {
    node: {},
  },
};
</script>
