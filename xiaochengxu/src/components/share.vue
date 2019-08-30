<template>
  <section>
    <canvas canvasId="sharecanvas" :style="{
      width: width + 'px',
      height: height + 'px',
      position: 'fixed',
      top: 0,
      left: 9999 + 'px'}">
    </canvas>
    <section v-if="resultFlag" class="result">
      <div class=resultImg>
        <img :src="shareUrl" />
      </div>
      <div class="operation">
        <form v-if="leftButton.flag" ><button @click="leftClick"> {{leftButton.text}} </button></form>
        <form v-if="leftButton.flag" class="right"><button @click="rightClick"> {{rightButton.text}} </button></form>
      </div>
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
   * Created by zhuning on 2019/06/21.
   */
  import dataLog from "dataLog";
  export default {
    data() {
      return {
        drawArr: [],
        width: "702",
        height: "922",
        ctx: {},
        factor: "",
        shareUrl: "",
        resultFlag: false,
        leftButton: {
          type: "save",
          text: "保存本页图片",
          flag: true,
        },
        rightButton: {
          type: "nav",
          text: "我的预约挂号",
          url: "/packageD/registration/myOrderList",
          flag: true
        }
      }
    },
    methods: {
      create(params) {
        var _this = this;
        this.leftButton = params.leftButton;
        this.rightButton = params.rightButton;
        this.ctx = wx.createCanvasContext('sharecanvas', this);
        this.width = params.width * this.factor;
        this.height = params.height * this.factor;
        if (params.backgroundUrl) {
          wx.getImageInfo({
            src: params.backgroundUrl,
            success: function (res) {
              _this.ctx.drawImage(res.path, 0, 0, res.width, res.height, 0, 0, params.width, params.height);
              // _this.ctx.drawImage(res.path, 0, 0, res.width, res.height, 0, 0, params.width, params.height);
              _this.callDraw(_this, params);
            }
          });
        } else {
          _this.callDraw(_this, params);
        }
      },
      close() { this.resultFlag = false; },
      callDraw(_this, params) {
        const {texts = [], images = [], blocks = [], lines = []} = params;
        const queue = _this.drawArr
          .concat(texts.map((item) => {
            item.type = 'text';
            item.zIndex = item.zIndex || 0;
            return item;
          }))
          .concat(blocks.map((item) => {
            item.type = 'block';
            item.zIndex = item.zIndex || 0;
            return item;
          }))
          .concat(lines.map((item) => {
            item.type = 'line';
            item.zIndex = item.zIndex || 0;
            return item;
          }));
        // 按照顺序排序
        queue.sort((a, b) => a.zIndex - b.zIndex);
        queue.forEach((item) => {
          if (item.type === 'image') {
            _this.drawImage(item)
          } else if (item.type === 'text') {
            // _this.drawText(item)
            _this.drawTextArr(item)
          } else if (item.type === 'block') {
            _this.drawBlock(item)
          } else if (item.type === 'line') {
            _this.drawLine(item)
          }
        });
        _this.ctx.save();
        wx.showLoading({
          title: "正在加载..."
        });
        _this.ctx.draw(false, () => {
          _this.ctx.save();
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'sharecanvas',
              x: 0,
              y: 0,
              width:params.width,
              height:params.height,
              destWidth: params.destWidth || params.width,
              destHeight:params.destHeight || params.height,
              fileType:"png",
              success: (res) => {
                wx.hideLoading();
                _this.$emit('success', res.tempFilePath);
                _this.shareUrl = res.tempFilePath;
                _this.resultFlag = true;
              },
              fail: (err) => {
                console.log(err)
                _this.$emit('fail', err);
              }
            }, _this);
          }, 1500);
        });
      },
      drawTextArr(textInfo) {
        this.ctx.setFontSize(textInfo.fontSize * this.factor);
        this.ctx.setFillStyle(textInfo.color);
        this.ctx.setTextAlign('right');
        this.ctx.fillText(textInfo.text, textInfo.x, textInfo.y);
      },
      leftClick() {
        dataLog.createTrack({ actionId: this.leftButton.actionId });
        var _this = this;
        switch(this.leftButton.type) {
          case "save": 
            this.saveSharePic(this.shareUrl);
            break;
          case "nav": 
            if (this.leftButton.url) {
              wx.navigateTo({url: this.leftButton.url});
            }
            break;
          case "close": 
            this.resultFlag = false;
            break;
          case "relaunch":
            this.resultFlag = false;
            wx.reLaunch({url: this.rightButton.url});
            break;
          default: 
            return false;
        }
      },
      rightClick() {
        dataLog.createTrack({
          actionId: this.rightButton.actionId
        });
        switch(this.rightButton.type) {
          case "save": 
            this.saveSharePic(this.shareUrl);
            break;
          case "nav": 
            if (this.rightButton.url) {
              wx.navigateTo({url: this.rightButton.url});
            }
            break;
          case "close": 
            this.resultFlag = false;
            break;
          case "relaunch":
            this.resultFlag = false;
            wx.reLaunch({url: this.rightButton.url});
            break;
          default: 
            return false;
        }
      },
      saveSharePic(url) {
        var _this = this;
        wx.saveImageToPhotosAlbum({
          filePath: url,
          success(res) {
            wx.showModal({
              content: '图片已保存到手机相册',
              showCancel: false,
              confirmText: '好的',
              confirmColor: '#333',
              success: function (res) {
                if (res.confirm) {
                  // _this.resultFlag = false;
                  // wx.reLaunch({url: _this.rightButton.url});
                }
              }
            })
          }
        })
      }
    },
    mounted() { this.factor = wx.getSystemInfoSync().screenWidth / 375; },
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    }
  }
</script>
<style lang="scss">
  .result {
    // display: none;
    width: 750px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    text-align: center;
    z-index: 99;
    .resultImg {
      width: 100%;
      img {
        width: 702px;
        height: 922px;
        margin: 0 auto;
        margin-top: 66px;
      }
    }
    .operation {
      width: 100%;
      margin-top: 56px;
      form {
        width: 100%;
        button {
          display: inline-block;
          width: 304px;
          height: 92px;
          border-radius: 8px;
          line-height: 92px;
          font-size: 32px;
          color: #fff;
          background-color: #2EA9FE;

          border: none;
        }
        &.right {
          margin-left: 30rpx;
        }
      }
    }
  }
</style>
