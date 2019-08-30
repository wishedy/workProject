<template>
  <section class="report-attachment-inner">
    <h1 class="title">
      <i></i>
      <span class="subTitle">共{{physicalAttList.length}}张图片</span>
      <!--<span class="des"></span>-->
    </h1>
    <article class="report-attachment-list">
      <figure class="report-attachment-item" v-for="(item,index) in physicalAttList" :key="index" @click.stop="viewImage(index)">
        <img   :src="item.attUrl"  :alt="item.inspectionItem">
      </figure>
    </article>
    <div class="returnBack" @click.stop="returnBackUrl">返回</div>
  </section>
</template>
<style lang="scss">
  @import "healthCooperation";
</style>
<script>
  import {createNamespacedHelpers} from "vuex";
  const {mapGetters} = createNamespacedHelpers('meinian');
  export default {
    name: 'attachment',
    data() {
      return {
        viewImageIndex: -1
      }
    },
    computed: {
      ...mapGetters(['reportData']),
      physicalAttList() {
        let t = this;
        if (t.reportData && t.reportData.responseData && t.reportData.responseData.dataList && t.reportData.responseData.dataList[0].physicalAttList) {
          return t.reportData.responseData.dataList[0].physicalAttList;
        } else {
          return [];
        }
      },
      imageArr(){
        let t = this;
        if(t.physicalAttList.length){
          let arr = [];
          for(let i = 0;i<t.physicalAttList.length;i++){
            arr.push(t.physicalAttList[i]['attUrl']);
          }
          return arr;
        }else{
          return [];
        }
      }
    },
      watch: {},
      components: {},
      methods: {
        viewImage(index) {
          let t = this;
          wx.previewImage({
            current: t.imageArr[index],     //当前图片地址
            urls: t.imageArr,               //所有要预览的图片的地址集合 数组形式
            success: function(res) {
            },
            fail: function(res) {
            },
            complete: function(res) {
            },
          })

        },
        returnBackUrl() {
          let t = this;
          wx.navigateBack({
            delta: 1
          })
        },
        changeSlide(index) {
          let t = this;
          t.viewImageIndex = index;
        }
      }
  }
</script>
