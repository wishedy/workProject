<template>
  <section class="playVideoCon">
    <div class="videoCon" v-if="!isFinish">
      <video
        :src="videoObj.videoUrl"
        ref="videoHtml"
        controls
        :poster="videoObj.imgUrl"
        autoplay
        webkit-playsinline="true" x-webkit-airplay="true" playsinline="true"
        x5-playsinline
        @ended="endVideo"
        id="myVideo"
        v-if="videoObj.videoUrl"
      ></video>
    </div>
    <div class="playNextTip" v-if="isFinish">
      <img :src="videoObj.imgUrl"/>
      <div class="tipContainer">
        <div class="tipContent">
          <p class="tipTitle" v-if="videoObj.tipsContent" ><i class="iconTip"></i><span>温馨提示：{{videoObj.tipsContent}}</span></p>
          <div class="tipPlaySel">
            <button class="playNextBtn wx-contact-text" v-if="videoObj.nextEducationId"  @click="getVideoInfo(videoObj.nextEducationId)">播放下一个</button>
            <button class="playReshBtn wx-contact-text" @click="videoPlay">重新播放</button>
          </div>
        </div>
      </div>
    </div>
    <article class="videoDesc">
      <p class="videoText">{{videoObj.educationDesc}}</p>
    </article>
    <authorization></authorization>
    <normalLoading v-if="loading"></normalLoading>
  </section>
</template>

<script>
  import api from 'common/js/util/util';
  import normalLoading from "components/loading";
  import authorization from "components/authorization/authorization";
  import {createNamespacedHelpers} from 'vuex';
  const {mapState, mapActions, mapMutations} = createNamespacedHelpers('patientNote');
  // let getVideoList='http://10.1.8.5:8080/static/js/jourList2.json';
  let getVideoList=api.httpEnv() +'/mcall/cms/patienteducation/v1/getVideoList/';//手册详情--视频播放列表
  export default {
    data(){
      return{
        videoObj:{
          videoUrl:''
        },
        educationId:'',
        isFinish:false,
        loading:false,
        manualId:'',
        videoId:''
      }
    },
    computed: {
      ...mapState(['videoMap'])
    },
    onLoad(option){
      this.videoObj={
        videoUrl:''
      };
      this.educationId='';
      this.isFinish=false;
      this.loading=false;
      this.manualId='';
      this.videoId='';
      // console.log(option)
      if(option.id){
        this.videoId=option.id;
      }
      if(option.manualId){
        this.manualId=option.manualId;
      }
      if(option.educationId){
        this.educationId=option.educationId;
        this.getVideoInfo(this.educationId);
      }

    },
    methods:{

      videoPlay() {
        this.isFinish=false;
        this.videoContext = wx.createVideoContext('myVideo');
        this.videoContext.play();
      },
      endVideo(){
        this.isFinish=true;
      },
      //获取视频信息
      getVideoInfo(educationId){
        let t=this;
        t.loading=true;
        api.ajax({
          url:getVideoList,
          method: 'post',
          data: {
            educationId:educationId,
            id:t.videoId,
            manualId:t.manualId
          },
          timeout: 30000,
          done(response) {
            t.loading=false;
            if(response&&response.responseObject&&response.responseObject.responseData&&response.responseObject.responseData.dataList){
              let dataList=response.responseObject.responseData.dataList;
              if(dataList.length){
                t.videoObj=dataList[0];
                t.videoId=dataList[0].nextId;
                setTimeout(function () {
                  t.videoPlay();
                },100)
              }

            }
          }
        })
      },
    },
    mounted(){

      // this.videoObj=JSON.parse(this.videoMap);
    },
    components: {
      normalLoading,
      authorization
    }
  }
</script>

<style scoped lang="scss">
  .playVideoCon{
    /*position: fixed;*/
    /*top: 0;*/
    /*bottom: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*z-index: 5;*/
    height: 100%;
    overflow: auto;
    background:rgba(0,0,0,.9);
    .videoCon{
      height:422px;
      width: 100%;
      position: fixed;
      z-index: 2;
      top: 0;
      background:rgba(0,0,0,.9);
      video{
        width: 100%;
        height: 100%;
      }
    }
    .playNextTip{
      height:422px;
      position: fixed;
      width: 100%;
      img{
        width: 100%;
        height: 100%;
      }
      .tipContainer{
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        background:rgba(0,0,0,.7);
        top: 0;
        .tipContent{
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          text-align: center;
          .tipTitle{
            font-size: 0;
            text-align: center;
            margin-bottom: 48px;
            .iconTip{
              display: inline-block;
              vertical-align: middle;
              width: 40px;
              height: 40px;
              background: url("https://m.allinmed.cn/static/image/mp/index/1.1.5/smile_small.png") center center no-repeat;
              background-size: contain;
              margin-right: 12px;
            }
            span{
              font-size:32px;
              display: inline-block;
              vertical-align: middle;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:#fff;
              line-height:44px;
            }

          }
          .tipPlaySel{
            width: 100%;
            button{
              width:210px;
              height:80px;
              border-radius:8px;
              border:1px solid #fff;
              font-size:30px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:#fff;
              background: transparent;
              &.playNextBtn{
                margin-right: 84px;
              }
              &.playReshBtn{

                width:212px;
                height:82px;
                background:rgba(7,182,172,1);
                border: none;
              }
            }

          }
        }
      }
    }
    .videoDesc{
      padding: 0 30px;
      padding-top: 458px;
      padding-bottom: 40px;
      font-size:36px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:#fff;
      line-height:60px;
    }
    .wx-contact-text{
      padding-left:0;
      padding-right:0;
      box-sizing:border-box;
      border-radius:0;
      border: none;
      outline: none;
      display: inline-block;
      &:after {
        border: 0;
      }
    }
  }
</style>
