<template>
  <!--增加video标签支持，并循环添加-->
  <section class="audioOut">
    <section class="audioBox">
      <img class="audioStatus" :src="srcUrl" alt="" @click="audioControl()">
      <p class="audioText">{{audioText}}</p>
      <audio
        id="jkAudio"
        :src="audioMap.attUrl"
        loop
      ></audio>
    </section>
  </section>
</template>

<script>
export default {
  name: 'wxParseVideo',
  data(){
    return {
      srcUrl:'https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png',
      audioSrc:'https://triage.allinmed.cn/dist/static/image/audio/warningTone.mp3',
      audioCtx:null,
      audioStatus:"paused",
      audioText:'',
    }
  },
  onLoad(){
    wx.removeStorageSync('audioStatus');
    this.audioStatus = 'paused';
    this.srcUrl='https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png';
    this.audioCtx = wx.createAudioContext('jkAudio');
    // this.audioCtx.play()
    this.audioControl();
  },
  methods:{
    audioControl () {
      if (this.audioStatus == 'paused') {
        this.audioPlay();
      } else {
        this.audioPause();
      }
    },
    audioPlay () {
      this.audioCtx.play();
      this.audioStatus = 'played';
      this.srcUrl='https://m.allinmed.cn/static/image/mp/index/1.1.4/bofang.png';
      this.audioText= '音乐播放中...'
    },
    audioPause () {
      this.audioCtx.pause();
      this.audioStatus = 'paused';
      this.srcUrl='https://m.allinmed.cn/static/image/mp/index/1.1.4/zanting.png';
      this.audioText= '音乐已暂停'
    }
  },
  computed: {

  },
  onHide () {
    wx.setStorageSync('audioStatus', this.audioStatus == 'played' ? true:false);
    this.audioPause();

  },
  onShow () {
    if (wx.getStorageSync('audioStatus')) {
      this.audioPlay();
    }
  },
  props: {
    audioMap: {},
  },
};
</script>

