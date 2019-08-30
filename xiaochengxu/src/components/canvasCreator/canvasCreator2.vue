<template>
  <div style="opacity: 0;visibility: hidden;position: absolute;z-index: -1;">
    <CanvasCreator ref="poster" :params="params" id="poster" @success="onCreateSuccess"
                   @fail="onCreateFail"></CanvasCreator>
  </div>
</template>

<script>
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by Hallmader on 2018/9/21.
   */
  import CanvasCreator from "./canvasCreator";

  export default {
    name: "canvas-creator2",
    data() {
      return {
        preload: true,
        downloadStatus: false,
        hideLoading: false
      }
    },
    methods: {
      trigger(event, data) {
        if (this.listener && typeof this.listener[event] === 'function') {
          this.listener[event](data);
        }
      },
      once(event, fun) {
        if (typeof this.listener === 'undefined') {
          this.listener = {};
        }
        this.listener[event] = fun;
      },
      downloadResource() {
        return new Promise((resolve, reject) => {
          const poster = this.$refs.poster;
          if (this.downloadStatus && this.downloadStatus !== 'fail') {
            if (this.downloadStatus === 'success') {
              resolve();
            } else {
              this.once('downloadSuccess', () => resolve());
              this.once('downloadFail', (e) => reject(e));
            }
          } else {
            poster.downloadResource(this.params.images)
              .then(() => {
                this.downloadStatus = 'success';
                resolve();
              })
              .catch((e) => reject(e));
          }
        })
      },
      onCreate() {
        !this.hideLoading && wx.showLoading({mask: true, title: '生成中'});
        return this.downloadResource().then(() => {
          this.hideLoading && wx.hideLoading();
          const poster = this.$refs.poster;
          poster.create(this.params);
        })
          .catch((err) => {
            !this.hideLoading && wx.hideLoading();
            wx.showToast({icon: 'none', title: err.errMsg || '生成失败'});
            console.error(err);
          })
      },
      onCreateSuccess(e) {
        const {detail} = e;
        this.$emit('success', e);
      },
      onCreateFail(err) {
        console.error(err);
        this.$emit('fail', err);
      }
    },
    mounted() {
      console.log(this.params)
      if (this.preload) {

        const poster = this.$refs.poster;
        this.downloadStatus = 'doing';
        poster.downloadResource(this.params.images).then(() => {
          console.log(this.params.images)
          this.downloadStatus = 'success';
          this.trigger('downloadSuccess');
        }).catch((e) => {
          this.downloadStatus = 'fail';
          this.trigger('downloadFail', e);
        });
      }
    },
    components: {
      CanvasCreator
    },
    computed: {},
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

</style>
