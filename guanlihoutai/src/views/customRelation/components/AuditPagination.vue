<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[10, 20, 30, 50,100]"
    :page-size="pageSize"
    layout="prev, pager, next,jumper,sizes"
    :total="total"
  >
  </el-pagination>
</template>
<script>
export default {
  methods: {
    handleSizeChange(val) {
      this.$emit('sizeChange', val);
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val);
    }
  },
  data() {
    return {
      // myCurrentPage:""
    };
  },
  props: {
    'total': {
      type: Number,
      require: true
    },
    'pageSize': {
      type: Number,
      require: true
    },
    'currentPage': {
      type: Number,
      require: true
    }
  },
  computed: {
  },
  watch: {
    // 如果 `currentPage` 发生改变，这个函数就会运行
    currentPage: function(newVal, oldVal) {
      this.currentPage = newVal;
    }
  }
};
</script>

<style lang="scss">
</style>
