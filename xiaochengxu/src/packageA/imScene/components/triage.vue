<template>
  <section class="main-message-box">
    <!--视诊新样式-->
    <article class="video-triage-box">
      <figure class="video-triage-content">
        <span>{{triageMessage.data.content}}</span>
      </figure>
      <figcaption class="video-triage-btn" data-role="videoTriage"
                  @click="goToUpload(triageMessage.data.type)">
                上传{{triageMessage.data.type==1?"视频":"照片"}}
      </figcaption>
    </article>
    <section class="tips-content">
      重要提示：在线咨询不能代替面诊，医生建议仅供参考。
    </section>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2017/8/23.
   */
  export default{
    data(){
      return {

      }
    },
    mounted(){
//      type2图片 1视频
      console.log(this.triageMessage)
    },
    methods: {
      goToUpload(type){
        // sessionStorage.removeItem("triageRoute");
        // this.$router.push({
        //   name: "TriageDetail",
        //   params: this.triageMessage.data
        // })
        wx.navigateTo({
          url:`/packageA/triageDetail/triageDetail?type=${this.triageMessage.data.type}&content=${this.triageMessage.data.content}`,
        });
      }
    },
    props: {
      triageMessage: {
        type: Object
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped="">

  .video-triage-box{
    width: 690px;
    margin: 0 auto;
    box-sizing: border-box;
    background: #FFFFFF;
    border: 1px solid #E4E9EB;
    border-bottom: none;
    border-radius:12px 12px 0 0;
    padding: 70px 60px;
    .video-triage-content{
      color: #333333;
      letter-spacing: 0;
      font-size:34px;
      font-weight: 600;
    }
    .video-triage-btn{
      background: #2FC5BD;
      border-radius: 999px;
      width: 560px;
      margin: 56px auto 0px;
      color: #FFFFFF;
      text-align: center;
      font-size:36px;
      padding: 30px 0;
      line-height: 1;
    }
  }
  .tips-content{
      width: 690px;
      margin: 0 auto;
      padding:18px 36px;
      box-sizing: border-box;
      background: #FAFAFB;
      color: #97A8BA;
      font-size:26px;
      border: 1px solid  #e4e9eb;
      border-top: none;
      border-bottom-right-radius: 21px;
      border-bottom-left-radius: 21px;
    }
</style>
