<template>
  <section class="upload-box" @click="uploadHidden()">
    <ul class="upload-image-list" @click.stop="">
      <h3 class="upload-image-title">您要上传的照片是？</h3>
      <li class="upload-image-item">检查资料</li>
      <li class="upload-image-item">药品名称</li>
      <li class="upload-image-item">床头卡/腕带</li>
    </ul>
  </section>
</template>
<script type="text/ecmascript-6">
  /**
   * @Desc：
   * @Usage:
   * @Notify：
   * @Depend：
   *
   * Created by lichenyang on 2018/7/5.
   */
  import api from "common/js/util/util";

  import {createNamespacedHelpers} from "vuex";
  const {mapState,mapMutations} = createNamespacedHelpers('imSceneDoctor');

  export default {
    data() {
      return {

      };
    },
    mounted() {

    },

    methods: {
      ...mapMutations(['setReportImageUpload']),
      uploadHidden () {
        this.setReportImageUpload(false);
      }
    },
    props: {

    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.upload-box{
  position: fixed;
  background:rgba(0,0,0,0.3);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  .upload-image-list{
    padding: 48px 66px 60px;
    background:rgba(255,255,255,1);
    box-shadow:0px -8px 36px 0px rgba(26,51,71,0.06);
    border-radius:40px 40px 0px 0px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    .upload-image-title{
      line-height: 1;
      font-size: 40px;
      font-weight: 500;
      color: #333333;
      padding-bottom: 16px;
    }
    .upload-image-item{
      line-height: 96px;
      text-align: center;
      margin-top: 32px;
      background:rgba(245,247,247,1);
      border-radius:8px;
      color: #00B9AD;
      border:1px solid rgba(233,240,239,1);
      font-size: 36px;
    }
  }
}
</style>
