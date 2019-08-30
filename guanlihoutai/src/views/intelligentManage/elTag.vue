<template>
<section class="main-eltag">
  <p v-if="isEdit">请为该医生添加智能匹配标签</p>
  <section class="tagBox" v-if="isEdit">
    <span v-for="(item, i) in dataList" :key="i" @click="handleTag(item)" :style="item.isCheckeded ? 'border: 1px solid #3846dc' : ''" class="mytag">
      {{item.partName}}
    </span>
  </section>
  <section class="tagBox" v-else>
    <span v-for="(item, i) in dataList" :key="i" class="mytag">
      {{item.partName}}
    </span>
  </section>
</section>
</template>

<script>
/**
 * elTag组件
 * 可以编辑标签 查看标签
 * 在首页查看标签 修改标签和添加医生组件中复用
 * 2019-07-05 丑晴
 * */
export default {
  props: {
    dataList: {
      type: Array
    },
    showTags: {
      type: Array
    },
    isEdit: { // 是否是编辑页面 是的话可操作 否的话仅可查看
      type: Boolean,
      default: true
    },
    breakNum: { // 当前是第几个换行 换行的行距离右边的距离为0 暂时没用它了
      type: Number,
      default: 3
    }
  },
  data() {
    return {
      showTagsList: []
    };
  },
  methods: {
    handleTag(item) {
      item.isCheckeded = !item.isCheckeded;
      this.$forceUpdate();
      // 筛选出选中的数据 传给父元素
      const dataList = this.dataList.filter(item => item.isCheckeded);
      this.$emit('dataList', dataList);
    }
  },
  mounted() {
    const showTagsList = this.showTags;
    showTagsList.forEach(item => {
      const index = this.dataList.findIndex(i => +i.partId === +item);
      if (index > -1) this.dataList[index].isCheckeded = true;
      else this.dataList[index].isCheckeded = false;
    });
    this.$forceUpdate();
  },
  watch: {
    showTags(val) {
      const showTagsList = val.slice();
      let dataList = [];
      dataList = this.dataList.map(item => {
        item.isCheckeded = false;
        return item;
      });
      showTagsList.forEach(item => {
        const index = dataList.findIndex(i => +i.partId === +item);
        if (index > -1) dataList[index].isCheckeded = true;
      });
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
  .main-eltag{
    > p{
      margin: 0 0 20px 20px;
      color: #3846dc;
    }
  }
  .tagBox{
    display: flex;
    flex-flow: wrap;
    margin-left: 20px;
    .mytag {
      background-color: #dddddd;
      border-radius: 20px;
      width: 150px;
      margin: 0 20px 20px 0;
      box-sizing: border-box;
      height: 50px;
      line-height: 50px;
      text-align: center;
    }
    .noMarRight {
      margin-right: 0;
    }
  }

</style>
