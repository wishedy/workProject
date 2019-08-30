<template>
  <div>
    <canvas canvas-id="firstCanvas" :style="{height: overAllHeight + 'px',width: overAllWidth + 'px'} " class="myCanvas"
            mode="heightFix"></canvas>
    <button style="margin-top:20px" @click="save">保存</button>
  </div>
</template>

<script>
  let ctx = wx.createCanvasContext('firstCanvas')
  export default {
    data() {
      return {
        canvasShow: true,
        shareImg: '',
        overAllWidth: '',
        overAllHeight: '',
        backGroundWidth: '',
        backGroundHeight: '',
      }
    },
    methods: {
      save() {
        wx.canvasToTempFilePath({
          canvasId: 'firstCanvas',
          success(res) {
            console.log(res.tempFilePath);
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success() {
                    wx.showToast({title: '图片保存成功'})
                  }
                })
              }
            })
          }
        }, this)
      },
    },
    onShow() {
      //获得屏幕宽度
      wx.getSystemInfo({
        success: ((res) => {
          this.overAllWidth = res.windowHeight;
          this.overAllHeight = res.windowWidth;
        })
      });
      const ratio = 0.075
      console.log(this.overAllWidth)
      console.log(this.overAllHeight)
      ctx.drawImage("https://hybrid.xiaoying.tv/miniprogram/viva-ad/1/1531103986231.jpeg", 0, 0, this.overAllWidth / 2, this.overAllHeight);
      ctx.font = "15px Arial";
      ctx.fillText("医生名称:金木研", 50, 120);
      ctx.fillText("医生职称:黑山羊建立者", 70, 180, 300);
      ctx.fillText("医生二维码", 70, 210);

      //绘制那个圆
      ctx.save();
      ctx.beginPath();
      ctx.arc(230, 260, 50, 0, 2 * Math.PI, false);
      ctx.clip();
      ctx.drawImage("../../../static/image/test.png", 180, 210, 100, 100);
      ctx.restore();
      ctx.stroke();

      ctx.fillText("错的不是我，是这个世界", 70, 350);
      ctx.draw();
    }
  }
</script>
<style>
  .myCanvas {
    background: pink;
  }
</style>
