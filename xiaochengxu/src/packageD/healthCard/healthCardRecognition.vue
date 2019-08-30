<template>
  <section class="recognition-main">
    <section class="recognition-title">领取居民健康卡，有利于医生了解您的病情</section>
    <section class="recognition-upLoad">
      <section class="recognition-cover-border" v-show="imgUrl.length==0" @click="upLoadImg()"></section>
      <section class="recognition-cover-card" v-show="imgUrl.length==0"></section>
      <section class="recognition-cover-btn" v-if="imgUrl.length==0">
        <section class="recognition-coverBtn-box">
          <span class="recognition-btn-text">点击上传</span>
        </section>
      </section>
      <img v-show="imgUrl.length>0" class="recognition-img" :src="imgUrl" alt>
      <section v-show="imgUrl.length>0" class="recognition-reload">
        <section class="recognition-reload-box">
          <span class="recognition-reload-cover"></span>
          <span class="recognition-reload-icon"></span>
          <span class="recognition-reload-text">重新上传</span>
        </section>
      </section>
    </section>
    <section class="cecognition-tip">
      <span class="recognition-tip-icon"></span>请上传本人身份证正面照片
    </section>
    <section class="recognition-Btn">
      <section class="recognition-next" :class="{'actived':imgUrl.length>0}" @click="goNext">下一步</section>
      <section class="recognition-next-two" @click="goPass">身份证不在身边</section>
    </section>
  </section>
</template>

<script>
/*
 * @Desc: 居民健康卡注册 身份证识别
 * @Usage:
 * @Notify：
 * @Depend：
 * Created by JK on 2019/3/27
 *
 */
export default {
  data() {
    return {
      imgUrl: "http://m.allinmed.cn/static/image/mp/index/1.4.0/card@3x.png", //图片地址
      from:'', //来源
    };
  },
  onLoad(option){
    console.log(option)
    this.from = option.from;
    this.imgUrl = '';
  },
  onShow(){
    
  },
  methods:{
    upLoadImg(){
      
    },
    goNext(){
      let _this = this;
      wx.navigateTo({
        url:'/packageD/healthCard/healthRegister'
      })
    },
    goPass(){
      let _this = this;
      wx.navigateTo({
        url:'/packageD/healthCard/healthRegister'
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.recognition-main {
  .recognition-title {
    font-size: 40px;
    color: #222222;
    padding: 56px 60px;
    font-weight: bold;
  }
  .recognition-upLoad {
    position: relative;
    width: 610px;
    height: 410px;
    background: #f3f7f7;
    margin: 0 auto;
    .recognition-cover-border {
      position: absolute;
      width: 430px;
      height: 280px;
      top: 50%;
      margin-top: -140px;
      left: 50%;
      margin-left: -215px;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/subscript@3x.png")
        no-repeat center;
      background-size: 100% 100%;
    }
    .recognition-cover-card {
      position: absolute;
      width: 392px;
      height: 248px;
      top: 50%;
      margin-top: -124px;
      left: 50%;
      margin-left: -196px;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/card@3x.png")
        no-repeat center;
      background-size: 100% 100%;
    }
    .recognition-cover-btn {
      position: absolute;
      width: 152px;
      height: 132px;
      top: 50%;
      margin-top: -66px;
      left: 50%;
      margin-left: -76px;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/photo@3x.png")
        no-repeat center;
      background-size: 100% 100%;
      .recognition-coverBtn-box {
        position: relative;
        width: 100%;
        height: 100%;
        .recognition-btn-text {
          width: 100%;
          position: absolute;
          font-size: 26px;
          color: #00aba0;
          display: inline-block;
          bottom: -10px;
          text-align: center;
        }
      }
    }
    .recognition-img {
      width: 100%;
      height: 100%;
    }
    .recognition-reload {
      position: absolute;
      width: 168px;
      height: 46px;
      border-radius: 6px 0px 0px 0px;
      right: 0;
      bottom: 0;
      .recognition-reload-box {
        position: relative;
        height: 100%;
        .recognition-reload-cover {
          display: inline-block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000000;
          border-radius: 6px 0px 0px 0px;
          opacity: 0.2;
          z-index: 0;
        }
        .recognition-reload-icon {
          z-index: 5;
          position: absolute;
          display: inline-block;
          width: 30px;
          height: 30px;
          top: 50%;
          margin-top: -15px;
          left: 14px;
          background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/refresh@3x.png")
            no-repeat center;
          background-size: 100% 100%;
        }
        .recognition-reload-text {
          z-index: 5;
          position: absolute;
          color: #ffffff;
          font-size: 26px;
          right: 14px;
          top: 50%;
          margin-top: -18px;
        }
      }
    }
  }
  .cecognition-tip {
    text-align: center;
    font-size: 30px;
    color: #aaaaaa;
    margin-top: 26px;
    .recognition-tip-icon {
      display: inline-block;
      width: 26px;
      height: 26px;
      background: url("http://m.allinmed.cn/static/image/mp/index/1.4.0/prompt@3x.png")
        no-repeat center;
      background-size: 100% 100%;
      margin-right: 8px;
      line-height: 45px;
      margin-bottom: -1px;
    }
  }
  .recognition-Btn {
    margin-top: 280px;
    .recognition-next {
      font-size: 36px;
      width: 520px;
      height: 96px;
      line-height: 96px;
      text-align: center;
      background: #cccccc;
      border-radius: 8px;
      color: #ffffff;
      margin: 0 auto;
      &.actived {
        background: #00b9ad;
      }
    }
    .recognition-next-two {
      font-size: 28px;
      color: #00b9ad;
      text-align: center;
      margin-top: 40px;
    }
  }
}
</style>
