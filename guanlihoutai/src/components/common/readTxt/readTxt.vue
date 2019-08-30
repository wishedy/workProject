<template>
  <section>
    <!-- ,.doc,.docx,.xls,.xlsx -->
    <input type="file" ref="file" class="fileTxt" accept="text/plain,.xlsx,.xls" @change.stop="fileChange" v-if="triggerOnce">
  </section>
</template>

<script>
export default {
  data() {
    return {
      triggerOnce: true
    };
  },
  methods: {
    triggerClick() {
      this.$refs.file.dispatchEvent(new MouseEvent('click'));
    },
    fileChange(e) {
      var that = this;
      let reader = new FileReader();
      console.log(e.target.files);
      // console.log(window.FileReader);
      // console.log(window.FileList);
      if (e.target.files[0].name.indexOf('txt') !== -1) {
        reader.readAsText(e.target.files[0], 'utf-8'); // gb2312
        reader.onload = () => {
          that.$emit('txtReader', reader.result);
          that.triggerOnce = false;
          that.$nextTick(() => {
            that.triggerOnce = true;
          });
        };
      }
      else if (e.target.files[0].name.indexOf('.xls') !== -1 || e.target.files[0].name.indexOf('.xlsx') !== -1) {
        reader.readAsBinaryString(e.target.files[0], 'binary');
        reader.onload = () => {
          that.$emit('fileReader', reader.result, e.target.files[0]);
          that.triggerOnce = false;
          that.$nextTick(() => {
            that.triggerOnce = true;
          });
        };
      }
      else {
        this.$message({
          type: 'info',
          message: '文件无法读取',
          duration: 3000,
          showClose: true
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .fileTxt[type=file] {
    display: none;
  }
</style>
