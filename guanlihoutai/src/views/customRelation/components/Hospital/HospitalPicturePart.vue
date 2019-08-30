<template>
  <div class='hospitalGroupPicture-groupPhoto'>
    <div class='hospitalGroupPicture-groupPhoto-addPhoto'>
      <div class='hospitalGroupPicture-groupPhoto-deletePhoto' v-show='isDeletePhoto'>
        <img src='static/images/icons/icon-close-gray.png'
             @click='deletePhoto' alt='' title="删除">
      </div>
      <input type='file' name='file' accept='image/jpeg,image/jpg,image/png'
             @change='uploadQualification'>
      <img src='static/images/icons/icon-add.png' alt='' class='hospitalGroupPicture-groupPhoto-addFlag'>
    </div>
    <span class='hospitalGroupPicture-groupPhoto-replacerPhoto' hidden>
      <input type='file' name='file'
             @change='uploadQualification' accept='image/jpeg,image/jpg,image/png'>替换照片
    </span>
  </div>
</template>
<script>
/**
   * 辅助Hospital组件 图片陈列
   * @module HospitalPicturePart.vue
   * @desc 图片陈列
   * @author qiaoliang
   * @date 2019/1/17 0017 下午 3:04
   * @param {Object} [title]    - 参数说明
   * @param {String} [columns] - 参数说明
   * @example 调用示例
   */
const HospitalPicturePart = {
  data() {
    return {
      isDeletePhoto: false
    };
  },
  methods: {
    uploadQualification(el) {
      this.isDeletePhoto = true;
      this.$parent.uploadQualification(el);
    },
    deletePhoto() {
      // setTimeout(function(){
      document.querySelector('.hospitalGroupPicture-groupPhoto-deletePhoto').parentNode.parentElement.remove();
      this.$parent.uploadComponents.push(1);
      // },200)
    }
  }
};
export default HospitalPicturePart;
</script>
<style lang='scss' rel='stylesheet/scss'>
  .hospitalGroupPicture-groupPhoto {
    height: 98px;
    width: 98px;
    float: left;
    margin-right: 15px;
    margin-top: 15px;
    .hospitalGroupPicture-groupPhoto-addPhoto {
      width: 98px;
      height: 73.7px;
      background: #EDF1FF;
      border-radius: 4px;
      float: left;
      z-index: 1;

      .hospitalGroupPicture-groupPhoto-deletePhoto {
        width: 23px;
        height: 23px;
        position: absolute;
        margin-left: 75px;
        z-index: 3;
      }

      .hospitalGroupPicture-groupPhoto-addFlag {
        position: relative;
        left: 37px;
        top: 25.345px;
      }

      input {
        width: 98px;
        height: 73.7px;
        cursor: pointer;
        position: absolute;
        opacity: 0;
        outline: none;
        z-index: 2;
      }

    }
    .hospitalGroupPicture-groupPhoto-replacerPhoto {
      cursor: pointer;

      input {
        width: 52px;
        height: 13px;
        position: absolute;
        opacity: 0;
        outline: none;
        cursor: pointer;
      }

    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #555555;
      letter-spacing: 0;
      line-height: 13px;
      margin-top: 10.3px;
      float: left;
    }

  }
</style>
