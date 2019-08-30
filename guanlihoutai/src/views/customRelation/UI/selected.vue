<template>
  <ul v-show="showState" class="ui_selected">
    <li @click="chooseItem(item)" v-for="(item,index) in selectedItems" :key="index">
      <img :src="item[matchKey] == defaultValue?selectedIcon.selected:selectedIcon.unselected" alt="">
      <span>{{item[matchKey]}}</span>
    </li>
  </ul>
</template>
<script>
export default{
  name: 'selectedUI',
  props: {
    showState: {
      type: Boolean,
      require: true
    }, // 展示状态
    selectedItems: {
      type: Array,
      require: true
    }, // 作用列表信息
    matchKey: {
      type: String,
      require: true
    }, // 用 Key来判断是否匹配到列表信息某值
    defaultValue: {
      type: String,
      require: true
    } // 默认值，用来与key值作匹配
  },
  data() {
    return {
      selectedIcon: {
        selected: require('../../../../static/images/icons/icon-selected.png'),
        unselected: require('../../../../static/images/icons/icon-unselected.png')
      }
    };
  },
  methods: {
    chooseItem(item) {
      this.$emit('refreshValue', this.matchKey, item);
    }
  }
};

</script>

<style lang='scss' rel='stylesheet/scss'>
  .ui_selected{
    position: absolute;
    top: 40px;
    width: 140px;
    background: #FFFFFF;
    -webkit-box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    /*max-height: 300px;*/

    left: 0;
    z-index: 9;
    li{
      position:relative;
      list-style: none;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      cursor:pointer;
      border-bottom: 1px solid #f6f6f6;
    }
    li:hover{
      background: #EDF1FF;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B67D6;
      letter-spacing: 0;
    }
    li:last-child{
      position:relative;
      list-style: none;
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
      cursor:pointer;
      border: 0px;
    }
    li:last-child:hover{
      background: #EDF1FF;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4B67D6;
      letter-spacing: 0;
      border-radius: 4px;
    }
    img{
      position: relative;
      top: 10px;
      float: left;
    }
    span{
      position: relative;
      left: 5px;
    }
  }
</style>
