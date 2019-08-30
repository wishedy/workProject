<template>
  <el-table
    :data="deptData"
    style="width: 100%">
    <el-table-column
      label="科室code">
      <template slot-scope="scope">
        <span>{{ scope.row.deptCode }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="科室姓名">
      <template slot-scope="scope">
        <span>{{ scope.row.deptName }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="科室介绍">
      <template slot-scope="scope">
        <span>{{ scope.row.deptDesc }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          v-if="!scope.row.state"
          size="mini"
          @click="handleSelect(scope.$index, scope.row)">选择</el-button>
        <el-button
          v-else
          size="mini"
          disabled>不可选择</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  /**
   * his科室选择弹框以及内容
  */
  props: {
    deptData: Array
  },
  methods: {
    handleSelect(index, row) {
      /**
       * index  小标、
       * row 当前的数据
       */
      this.$emit('deptSelect', {index, row});
    }
  }
};
</script>
