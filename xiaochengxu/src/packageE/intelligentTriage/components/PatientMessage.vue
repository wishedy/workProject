<template>
  <section class="patient-message">
    <article class="main-message-box-item">
      <figure class="main-message-img">
        <p class="message-content" v-if="anwserType==='string'">{{answer}}</p>
        <ul class="message-content-img" v-if="anwserType!=='string'">
          <li v-for="(item,index) in answer" :key="index" class="answe-img" v-if="index<12" @click="previewImg(item)">
            <img :src="item"/>
            <div class="answer-mask" v-if="index===11">
              <p class="answer-mask-content">
                <i class="answer-mask-icon"></i>
                <span class="answer-mask-more">查看全部</span>
              </p>
            </div>
          </li>
        </ul>
        <img :src="logoUrl" alt="" class="message-logo">
      </figure>
    </article>

  </section>
</template>

<script>

  export default {
    props: {
      answer: {
        type: String
      },
      questionType: {
        type: Number
      }
    },
    name: "patient-message",
    data(){
      return{
        logoUrl:wx.getStorageSync('logoUrl')
      }
    },
    computed:{
      anwserType(){
        return typeof this.answer
      }
    },
    methods:{
      previewImg(item){
        wx.previewImage({
          current: item, // 当前显示图片的http链接
          urls: this.answer // 需要预览的图片http链接列表
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .patient-message {
    margin-bottom: 32px;
    .main-message-img {
      text-align: right;
      .message-content {
        text-align: left;
        max-width: 482px;
        padding: 26px 24px;
        display: inline-block;
        vertical-align: middle;
        background: rgba(215, 234, 253, 1);
        border-radius: 24px 0px 24px 24px;
        border: 0px solid #C4DFFC;
        font-size: 32px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(25, 25, 25, 1);
        line-height: 48px;
        word-break:break-all;
        .text-tip {
          color: #cccccc;
        }
        &.message-loading {
          padding: 32px 36px 32px 18px;
          .loading-text {
            width: 20px;
            height: 20px;
            background: rgba(167, 189, 211, 1);
            opacity: 0.4;
            display: inline-block;
            vertical-align: middle;
            margin-left: 18px;
            border-radius: 100%;
            &:first-child {
              animation: loading 2s infinite;
              animation-delay: 0ms;
            }
            &:nth-child(2) {
              animation: loading 2s infinite;
              animation-delay: 200ms;
            }
            &:last-child {
              animation: loading 2s infinite;
              animation-delay: 400ms;
            }
          }
          @keyframes loading {
            0% {
              opacity: 0.4;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              opacity: 1;
            }
          }
        }

      }
      .message-content-img {
        display: inline-block;
        vertical-align: middle;
        max-width: 530px;
        background: rgba(215, 234, 253, 1);
        border-radius: 12px;
        font-size: 0;
        padding: 30px 10px 16px 24px;
        box-sizing: border-box;
        .answe-img {
          display: inline-block;
          vertical-align: middle;
          width: 110px;
          height: 110px;
          margin: 0 14px 14px 0;
          position: relative;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .answer-mask {
          position: absolute;
          left: 0;
          top: 0;
          width: 110px;
          height: 110px;
          background: rgba(0, 0, 0, 1);
          opacity: 0.7;
          z-index: 1;
          text-align: center;
          .answer-mask-content {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            .answer-mask-icon {
              width: 28px;
              height: 28px;
              background: url("https://m1.allinmed.cn/static/image/mp/index/1.6.0/icon-more.png") no-repeat;
              background-size: 28px 28px;
              display: inline-block;
              margin-bottom: 10px;
            }
            .answer-mask-more {
              display: block;
              font-size: 22px;
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(255, 255, 255, 1);
              line-height: 22px;
            }
          }

        }
      }
      .message-logo {
        width: 72px;
        height: 72px;
        vertical-align: top;
        margin-left: 18px;
        border-radius: 50%;
      }

    }

  }

</style>
