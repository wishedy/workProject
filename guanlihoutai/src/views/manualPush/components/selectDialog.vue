<template>
  <section class="crm-manualPush-dialog">
    <el-dialog
      :title="selectLabelName"
      :visible.sync="showOnOff"
      width="600px"
      center
      :before-close="handleClose">
      <div class="block">
        <el-checkbox-group v-model="localSelectList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="item in selectList" :label="item.labelId" :key="item.labelId" border class="checkbox-item">{{item.labelName}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click.native="handleClose">取 消</el-button>
    <el-button type="primary" @click.native="changeSelectlist">确 定</el-button>
  </span>
    </el-dialog>
  </section>
</template>
<script>
export default {
  props: {
    selectList: {
      default() {
        return [];
      },
      type: Array
    },
    selectLabelName: {
      default() {
        return '';
      },
      type: String
    },
    showOnOff: {
      default() {
        return false;
      },
      type: Boolean
    },
    currentIndex: {
      default() {
        return '';
      },
      type: Number
    }
  },
  data() {
    return {
      checked1: true,
      checked2: true,
      localSelectList: []
    };
  },
  watch: {
    nowSelectList(newVal) {
      // console.log(newVal);
    }
  },
  mounted() {
    let _this = this;
    _this.nowSelectList();
  },
  methods: {
    nowSelectList() {
      let _this = this;
      let arr = [];
      for (let num = 0; num < _this.selectList.length; num++) {
        let dataItem = _this.selectList[num];
        if (parseInt(dataItem.checked, 10)) {
          arr.push(dataItem.labelId);
        }
      }
      _this.localSelectList = JSON.parse(JSON.stringify(arr));
    },
    handleClose() {
      let _this = this;
      _this.$emit('closeSelectDialog');
    },
    handleCheckedCitiesChange(list) {
      // console.log(list);
      let _this = this;
      _this.$emit('updateSelect', list);
    },
    changeSelectlist() {
      let _this = this;
      _this.$emit('changeSelectlist', this.currentIndex);
    }
  }
};
</script>
