<template>
  <!--增加video标签支持，并循环添加-->
  <view :class="node.classStr" :style="node.styleStr">
    <video poster :class="node.classStr" class="video-video android" :src="node.attr.src"></video>
  </view>
</template>

<script>
export default {
  name: 'wxParseVideoAndroid',
  mounted(){
    console.log(this.node.attr.src)
  },
  watch:{
    node(res){
      console.log("node:::"+res)
    }
  },
  props: {
    node: {},
  },
};
</script>
