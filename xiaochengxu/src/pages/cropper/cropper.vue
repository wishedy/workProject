<template>
  <div class="main">
    <section class="fillup2"></section>
    <MpvueCropper
      ref="cropper"
      :option="cropperOpt"
      @ready="cropperReady"
      @beforeDraw="cropperBeforeDraw"
      @beforeImageLoad="cropperBeforeImageLoad"
      @beforeLoad="cropperLoad"
    ></MpvueCropper>
    <button class="changeAvator" @tap="getCropperImage">更换头像</button>
    <section class="fillup"></section>
  </div>
</template>

<script>
  import MpvueCropper from 'components/weCropper'
  import api from "common/js/util/util"
  import localStorage from "localStorage";
  import util from "common/js/util/util";

  const XHRUrl = util.httpEnv() + "/mcall/patient/customer/unite/info/v1/createPicture/";

  let wecropper

  const device = wx.getSystemInfoSync();
  const width = device.windowWidth;
  const height = device.windowHeight / 2;

  export default {
    data() {
      return {
        imgUrl: '',
        cropperOpt: {
          id: 'cropper',
          width,
          height,
          scale: 2.5,
          zoom: 8,
          cut: {
            x: (width - 300) / 2,
            y: (height - 300) / 2,
            width: 300,
            height: 300
          }
        }
      }
    },

    components: {
      MpvueCropper,
    },

    methods: {
      cropperReady(...args) {
        console.log('cropper ready!')
      },
      cropperBeforeImageLoad(...args) {
        console.log('before image load')
      },
      cropperLoad(...args) {
        console.log('image loaded')
      },
      inits() {
        wecropper.pushOrigin(this.$root.$mp.query.imgUrl)
      },

      getCropperImage() {
        console.log(111)
        wecropper.getCropperImage()
          .then((src) => {
            wx.uploadFile({
              url: XHRUrl,
              filePath: src,
              name: "file",
              formData: {
                customerId: localStorage.getItem("userId"),
                attType: 1,
                visitSiteId: api.getSiteId(),
                sortId: "1",
              },
              success: (() => {
                wx.showToast({
                  title: '上传图片成功',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(() => {
                      wx.redirectTo({
                        url: '/pages/personal/personal'
                      })
                    }, 2000)
                  }
                })
              }),
              fail: (() => {
                wx.showToast({
                  title: '上传图失败',
                  icon: 'fail',
                  duration: 2000,
                  success: function () {
                    setTimeout(() => {
                      wx.redirectTo({
                        url: '/pages/personalDetail/personalDetail'
                      })
                    }, 2000)
                  }
                })
              }),
              complete: function () {
              }
            });
          })
          .catch(e => {
            console.error('获取图片失败')
          })
      },
    },

    mounted() {
      wx.setNavigationBarTitle({
        title:'更换头像',
      });
      wecropper = this.$refs.cropper;
      this.inits()
    }
  }
</script>

<style lang="scss" scoped="">
  .cropper-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    height: 100%;
    background-color: #e5e5e5;
  }

  .main {
    position: absolute;
    overflow: hidden;
    margin-top: -100px;
    .fillup {
      bottom: 0;
      height: 425px;
      width: 100%;
      background: black;
    }
    .fillup2 {
      position: absolute;
      top: 0;
      height: 500px;
      width: 100%;
      background: black;
    }
  }

  .cropper-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
  }

  .changeAvator {
    z-index: 2;
    position: absolute;
    bottom: 250px;
    text-align: center;
    width: 330px;
    // height: 80px;
    background: rgba(0, 0, 0, 0);
    border-radius: 100px;
    color: gray;
    left: 220px;
    border-style: solid;
    border-width: 1px;
    border-color: gray;
  }

  .cropper-buttons .upload, .cropper-buttons .getCropperImage {
    width: 50%;
    text-align: center;
    z-index: 2;
  }

  .cropper {
    position: absolute;
    top: 0;
    left: 0;
  }

</style>
